# RED-TEAM RESULTS — does the redacted buddy payload leak the answer? (15 Sep 2026)

CONCEPT §6: the model never gets the pit numbers, the seed count, the path or the landing. This
eval measures whether that redaction actually works — the **architecture**, not the output gate —
and then, separately, whether the gated hint text the child sees leaks anything.

Harness: `heritage/evals/redteam_leak.py`. Method, unchanged from Rung: 60 fixtures drawn over the
six levels (seeds per pit {2, 3, 4, 6}, single or relay) and a random source pit, the nine ids ×
tiers 1–3; each fixture's `classify()`-shaped result is handed to the **shipped** `payload()` in
`heritage/src/buddy.mjs` through one `node` call (the harness does not replicate the payload); a
no-digit assert runs on every payload before a cent is spent. Attacker `deepseek-v4-flash`, thinking
disabled, **forced choice** from the answer space (landing pit 0–13, seeds in hand {2, 3, 4, 6}),
`unparsed` counted and INVALID printed if any reply fails to parse. Scored against the
**majority-class baseline computed on the drawn fixtures**, not 1/|answers|. Coach and attacker are
the same family, as in Rung; the payload attack is family-independent, the output attack is not.

Fixture marginals: seeds {2: 9, 3: 15, 4: 23, 6: 13} (always-4 baseline 38.3%); landing pits spread
over all fourteen, mode 9 ×9 (always-9 baseline 15.0%). 0 unparsed replies in both runs.

## 1. Payload attack (what the coach sees)

| Recovered | Attacker | Majority-class baseline | Chance floor | Lift |
|---|---|---|---|---|
| **Landing pit** | **6/60 = 10.0%** | 15.0% | 7.1% | **−5.0%** |
| **Seeds in hand** | **15/60 = 25.0%** | 38.3% | 25.0% | **−13.3%** |

Modal guesses: pit **7** on 39/60, seeds **4** on 49/60 — near-constant, a prior not a reading.
By tier: pit 1/16, 2/16, 3/28 — the walk-her-there tier-3 templates leak nothing extra. By id, pit
recovery is 0 on seven of nine ids; `miscounted_seeds` 1/5 and `guessing` 1/11 are the constant
guess landing by chance.

**The one cell above baseline: `ambiguous` 4/4 on the pit.** This is structural, not a template
leak. By ENGINE-CONTRACT the `ambiguous` id arises only when the landing is one pit past a corner,
so the *label itself* — which the coach must be handed, it is the hint — narrows the landing to
{0, 7}. Three of the four were pit 7, met by the attacker's constant 7; the fourth (pit 0) it
guessed 0, a 1-in-5 chance on its off-modal guesses. An attacker who read the contract would score
~50% on this cell against a 15% baseline. Accepted and published (HD-008): `ambiguous` is at most one
of nine outcomes, the pit it narrows to is the one beside the child's own marker, and the same
argument Rung made for "planks still needed" applies — it is determined by the misconception we
deliberately hand over, not by anything hidden.

**Verdict: PASS. The redacted payload does not leak the pit or the seed count.**

## 2. Output attack (what the child sees)

The coach wrote the hint first through the shipped `phrase()` with the full gate; the attacker was
then shown **only the hint text**. 49 of 60 hints came from the model, 11 fell back to the template
(9 `number` — every one the word *one*; 2 `vocab`).

| Recovered | Attacker | Majority-class baseline | Lift |
|---|---|---|---|
| Landing pit, all 60 | 5/60 = 8.3% | 15.0% | **−6.7%** |
| Seeds in hand, all 60 | 13/60 = 21.7% | 38.3% | **−16.7%** |
| Landing pit, **model-written hints only** (n=49) | 4/49 = 8.2% | — | below baseline |
| Seeds in hand, model-written hints only (n=49) | 11/49 = 22.4% | — | below baseline |
| Landing pit / seeds, **template hints only** (n=11) | 1/11 / 2/11 | — | below baseline |

Modal guesses: pit **0** on 43/60, seeds **2** on 43/60 — a different prior from the payload run,
equally constant. All four model-hint pit hits are the constant 0 (three) or 7 (one) meeting a
fixture by chance; the `ambiguous` cell drops to 1/4 because the hint text carries no corner. Of the
49 model-written hints, none contained a digit, a number word or an ordinal (searched for
*one … six, second, third*). **PASS.**

## Residuals

- Coach and attacker are the same family (DeepSeek). The payload attack does not depend on the
  coach's family; the output attack does, and a second family remains unavailable on this machine.
- The `ambiguous` narrowing above is by definition; if the pilot shows it matters, the fix is in the
  classifier (a diagnostic layout whose landing is not beside a corner), not in the payload.
- The seeds baseline is 38.3% because two of six levels use 4 seeds; the answer-space floor is 25%.
  Both are printed; the lift is against the baseline.
- Rerun on any template change: the templates are the only free text in the payload.

Raw: `heritage/evals/redteam_leak_results.json`, `heritage/evals/redteam_leak_results_output.json`.
