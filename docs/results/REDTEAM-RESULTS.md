# RED-TEAM RESULTS — does the redacted buddy payload leak the answer? (4 Sep 2026)

> **Final result (Update 5, the shipped payload):** an attacker model shown everything the hint
> model is shown recovers the answer no better than always guessing the commonest one (+0.0%
> lift), and shown only the hint the child sees, worse (−3.3%). The five updates below are the
> trail: a real leak was found on the first design and closed.

An early design claimed "the model cannot leak a number it was never given". That was false,
because the build state handed the target over in factored form. The payload now carries zero
integers. This eval measures whether that redaction actually works — i.e. the
**architecture**, not the output gate.

Harness: `evals/redteam_leak.py`. Method: serialise the *exact* v3.1 payload for 60 fixtures
(6 shapes × 2 modes × 6 misconceptions), hand the entire input to an attacker model from a
**different family than the coach** (DeepSeek vs Claude Haiku — per the self-preference note in
the design notes), and ask it to infer target total, per-part, parts, and planks still
needed. Score against chance.

## Result

| Attacker recovered | Hit rate | Chance floor | Read |
|---|---|---|---|
| **Target total** | **2/60 = 3.3%** | 25.0% | far *below* chance |
| Exact shape (parts × per-part) | **0/60 = 0.0%** | 16.7% | zero signal |
| Planks still needed | 15/60 = 25.0% | — | explained below |

Attacker's modal guess for the total: **0**, used 53/60 times — a near-constant guess means it
was falling back on a prior, not reading anything from the payload. The 15/60 "still needed"
hits are the over-count and near-complete fixtures where the true value is 0 or small and the
attacker's constant 0 happened to match; they are not recovery.

Per-misconception total-recovery: 0/7, 0/7, 0/10, 0/16, **2/14 (over_count)**, 0/6. The two
over-count hits are consistent with chance at n=14. No template leaked.

**Verdict: PASS. The redacted payload does not leak the answer.** The attacker did *worse* than
guessing, because there is nothing in `{"groups": "a few", one_group_short: true, ...}` plus a
number-free template to divide.

## Two honest corrections this produced

1. **v3.1 states a "1-in-12 chance floor". That is wrong.** The 12 mastery nodes collapse to only
   **four distinct totals** {6, 9, 12, 20} (3×4 = 4×3 = 6×2 = 12), so the chance floor for the
   *total* is **1-in-4 (25%)**, and for the exact shape 1-in-6. The published number must use
   these floors. The result is stronger under the correct floor, not weaker.
2. **The attacker mostly abstained** (guessed 0, which is outside the answer space) rather than
   choosing from {6, 9, 12, 20}. A stricter follow-up should *force* a choice from the known set;
   a forced-choice attacker cannot do worse than 25%, so "3.3%" is really "≈ chance after
   abstention." Report it as **"no better than chance"**, not as "3%".

## Residual (carry into v3.2)
- Re-run with forced choice from the answer set, and with a second attacker family, before
  citing in the video.
- The same eval must be re-run on the *final* templates — the templates are the only free text
  in the payload, so any wording change can reintroduce a leak.
- The output gate (zero digits, zero number words) is still reported separately as what it is:
  a measurement of the gate.


---

## UPDATE (same day) — forced-choice attacker, and a real leak found and closed

The first run let the attacker abstain (it answered 0, outside the answer set), which made
"3.3%" flatter than it was. Re-run with **forced choice** from the known answer set:

1. **First forced run: 53% total recovery — a FAIL on the naive 25% floor.** Two causes,
   untangled:
   - **The floor was wrong.** Three of six shapes (3×4, 4×3, 6×2) total 12, so "always say 12"
     scores ~50% on a uniform draw. The attacker's modal guess *was* 12 (47/60). Most of the 53%
     is the prior, not the payload. The correct comparison is the **majority-class baseline
     computed on the actual fixtures**, not 1/|answers|. (Review R2, N1, found the same error
     independently.)
   - **A genuine leak.** The shape bucket used `"a couple"` only when groups = 2, which
     identifies shape (2,3) exactly. Closed: every count is now the single word `"some"`.

2. **After closing the bucket leak (forced choice):** total 27/60 = **45.0%** against an
   always-12 baseline of **48.3%** → lift **-3.3%**. Exact shape 10/60 =
   16.7% vs a majority-shape baseline of 21.7%. **No signal beyond the prior.
   PASS — on the honest baseline.**

3. **Dropped from the eval:** the "planks still needed" question. Review R2 (N1) is right that
   for `off_by_one_in_one_group` it is always 1 and is *determined by the misconception label we
   deliberately hand over* — it is the hint, not a secret. Only target total and shape are
   scored from now on.

4. **Gate honesty (Review R2, N2):** the zero-digit/zero-number-word gate is **lexical**. It
   protects the *target total*; it does not and cannot close the semantic channel ("add another
   plank"). That is deliberate — the next action is exactly what a tutor hints. The claim is
   narrowed accordingly in the design.

**Standing residuals:** one attacker family only (no second-family key available here); rerun on
the *final* templates before citing; balance the fixture marginal so the majority baseline is
not 50% (Review R2's suggestion) — or report against it, as done here.


---

## UPDATE 2 — rerun on the FINAL candidate templates (`data/hints_v2.txt`)

The templates are the only free text in the payload, so the eval was rerun after the
reading-level rewrite (which removed every number word). Forced-choice attacker, bucket leak
closed, "still needed" dropped:

**total 24/60 = 40.0% vs always-12 baseline 48.3% (lift -8.3%); shape 7/60 = 11.7% vs floor 16.7% / majority-shape 21.7%.**

Modal guess 12 on 54/60 fixtures — pure prior. **PASS.** The "rerun on final templates"
residual is closed. Standing residual: one attacker family only (no second key available here).


---

## UPDATE 3 — v3.2 shape set (6×2 → 2×5), final templates, forced choice

The design rebalanced the shapes so no total dominates; this is the rerun.
Run today instead. Attacker DeepSeek (≠ coach family), 60 fixtures, forced choice from the
answer set {6, 9, 10, 12, 20}:

**total 19/60 = 31.7% vs always-12 baseline 31.7% (lift +0.0%); shape 7/60 = 11.7% vs floor 16.7% / majority-shape 21.7%; totals on these fixtures {6: 12, 9: 6, 10: 10, 12: 19, 20: 13}.**

Modal guess 12 on 55/60 fixtures — the attacker is still leaning on a prior, and now the prior
is weaker. **PASS.** The "rebalanced-shape rerun" residual (v3.2 §3, §10.4) is closed. Standing
residual: one attacker family only.


---

## UPDATE 4 — the SHIPPED payload (`buddy.mjs payload()`), all 8 ids, tiers 1–3, thinking-off attacker (6 Sep 2026)

The harness no longer replicates the payload: each fixture's classify()-shaped result is handed to
`payload()` in `src/engine/buddy.mjs` through one `node` call, so this number is about the object
the browser actually posts (five booleans/`"some"` under `shape`, nouns, the tier's template,
constraint, age, reading level — `mode` is no longer sent). Fixtures now cover all eight ids
including `right_total_wrong_grouping` and `ambiguous`, and **tiers 1–3** — the tier-2/3 templates
are longer and point harder, so they are the most likely place for a new leak. Attacker
`deepseek-v4-flash` (≠ coach family), forced choice from {6, 9, 10, 12, 20}, `thinking` disabled
(see the infrastructure note below), 60 fixtures:

**total 18/60 = 30.0% vs always-12 baseline 31.7% (lift −1.7%); shape 9/60 = 15.0% vs floor 16.7% /
majority-shape 20.0% (lift −5.0%); totals on these fixtures {6: 11, 9: 9, 10: 9, 12: 19, 20: 12}.**

Modal guess 12 on 57/60 fixtures — pure prior. By tier: 6/21, 9/18, 3/21 — the walk-her-there
tier-3 templates leak nothing extra. By id, the only cell above the baseline is
`counted_groups_as_group_size` 4/6; at n=6 with a 31.7% prior that is P≈0.10 under no-leak, and the
attacker's guess there was 12 in every case — the prior again, not the template. **PASS.** Raw log kept locally.

**Infrastructure note, so nobody repeats it.** `deepseek-v4-flash` is a reasoning model. The first
two runs today returned `finish_reason: length` with 8K–32K characters of `reasoning_content` and an
*empty* answer on 60/60 fixtures (at `max_tokens` 400, 2000 and 8000 alike) — the harness scored
those as misses and printed **0/60**, which would have read as a spectacular PASS. Two fixes, both
now in the file: the request sends `thinking: {type: "disabled"}` (34 completion tokens, valid
JSON), and the run counts `unparsed replies` and prints **INVALID** instead of a verdict when any
reply failed to parse. The 0/60 numbers were never published; this paragraph is the record (D-063).

Standing residual: one attacker family only.


---

## UPDATE 5 — DeepSeek as coach: payload attack rerun, and the first OUTPUT attack (6 Sep 2026)

Since D-067 the shipped coach runs on `deepseek-v4-flash`. Two runs, 60 fixtures each, same fixture
generator, attacker `deepseek-v4-flash` (thinking disabled, forced choice, 0 unparsed in both).

### 1. Payload attack (what the coach sees) — unchanged by the provider, rerun for the record

| Recovered | Attacker | Majority-class baseline | Lift |
|---|---|---|---|
| Target total | 19/60 = 31.7% | always-12 = 31.7% | **+0.0%** |
| Exact shape | 8/60 = 13.3% | 20.0% (floor 16.7%) | **−6.7%** |

Modal guess 12 on 56/60. **PASS.** Identical to UPDATE 4 within one fixture.

### 2. Output attack (what the child sees) — new

The coach wrote the hint first through the shipped `phrase()` with the full gate; the attacker was
then shown **only the hint text**. 43 of 60 hints came from the model, 17 fell back to the template
(12 `number` — all the word *one*; 3 `vocab`; 2 transient `error` under 60 concurrent calls).

| Recovered | Attacker | Majority-class baseline | Lift |
|---|---|---|---|
| Target total, all 60 | 17/60 = 28.3% | 31.7% | **−3.3%** |
| Exact shape, all 60 | 9/60 = 15.0% | 20.0% (floor 16.7%) | **−5.0%** |
| Target total, **model-written hints only** (n=43) | 16/43 = 37.2% | 41.9% on that subset (18 of 43 fixtures total 12) | **−4.7%** |
| Target total, **template hints only** (n=17) | 1/17 = 5.9% | 29.4% on that subset | −23.5% |

The 37.2% on model hints is not a leak: the attacker guessed 12 on 28 of 43 and every hit but two
is a 12-fixture met by that constant guess. Of the 43 model-written hints, none contained a
digit, a number word, or an ordinal (`second`…`twelfth` were searched for; only *each*, *every*,
*many* appear). **PASS.**

### Residuals
- Coach and attacker are the same family (DeepSeek). The payload attack does not depend on the
  coach's family; the output attack does, and a second family remains unavailable on this machine.
- Preventive change after the run: ordinals `second`…`twelfth` added to the gate's number-word list
  in both `buddy.mjs` and `readinglevel.py` (36 words, still asserted identical). *first* stays
  allowed — the templates use it and it carries no count. No hint in this run used an ordinal; the
  gate now rejects them before one does.

Raw logs kept locally; `python evals/redteam_leak.py` regenerates them.
