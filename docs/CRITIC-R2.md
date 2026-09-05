# CRITIC — Round 2 verification of CONCEPT-V3.1

4 Sep 2026. Same independent critic as R1. Verified item by item against CRITIC-R1,
CONCEPT-V3.1, ART-FEASIBILITY (new evidence), RESEARCH-LEARNER, AI-ARCHITECTURE, and the
actual source (`engine.mjs`, `coach.mjs`, `village.mjs`, `measure.html`, `index.html`,
`server.mjs`, `assets/`).

## Item-by-item verification

| # | R1 sev | v3.1 claims | Verdict | Evidence / reason |
|---|---|---|---|---|
| 1 | FATAL | Payload has no integers; empty legal number set; red-team vs 1-in-12 floor | **PARTIAL** | Redaction is real — the target total is not reconstructable. But the **1-in-12 floor is arithmetically wrong**, the red-team question is mis-specified, and the digit gate is lexical, not semantic. |
| 2 | FATAL | Packs force a multiplicative act; no one-to-one path | **PARTIAL** | "No counting path" is false as written: with packs of 2 into 4-plank parts she fills each part *by inspection*, one pack at a time. Nothing forces an up-front quantity commitment. |
| 3 | SERIOUS | Art proof = 2h gate on day 1 | **OPEN** | The proof already ran. v3.1 still says **sheep** (10×) and budgets day-1 hours to "hand-drawn SVG sheep" while `assets/animals/goat.png` is on disk. The doc contradicts its own evidence. |
| 4 | SERIOUS | Sequence classifier; tap channel; `ambiguous` | **CLOSED** (caveat) | Genuinely better. Caveat: hand-written fixtures cannot validate a *timing* heuristic — the author encodes the assumption into the fixture. |
| 5 | SERIOUS | Over-count accepted, drawn | **CLOSED** (spec) | `[5,4,4]` and `[12,0,0]` specified; `over_count` in the set; `remove` logged. One contradiction (cart finiteness — N6). |
| 6 | SERIOUS | 8 items, script, 0/1, 48h, falsification | **PARTIAL** | Real instrument. But item 1 (`2 × 6`) *is* trained 6×2 commuted; items 3 and 6 test division/missing-factor, never taught; no pre-test; unblinded administration. |
| 7 | SERIOUS | Case studies; COI on camera | **CLOSED** (inconsistency) | Exactly right — but §5 says "n=3 per arm" while §8 books **three children total**. Cannot both be true. |
| 8 | MINOR | Elo deleted → 12-node graph | **PARTIAL** | Correct decision, best camera line. But `measure.html` and `index.html` both import the engine; deleting it on day 4 breaks the "unmodified" control arm and destroys the existing adaptive-vs-fixed result. |
| 9 | MINOR | Wording verbatim | **CLOSED** | |
| 10 | MINOR | Parent screen = day-2 answer | **CLOSED** | Correlational flag preserved. |
| 11 | MINOR | Consent, hands only, day 12 | **CLOSED** (minor) | A day-10 child's 48h retest lands on day 12 (film day). |
| 12 | MINOR | Split screen + red-team number | **CLOSED** | |
| 13 | MINOR | 20 hints vs a 500-word list | **PARTIAL** | `data/wordlist.txt` does not exist and the **list is unnamed** — unfalsifiable. |

## New problems introduced by v3.1

**N1 — The 1-in-12 floor is wrong. [SERIOUS]** 12 nodes = 6 shapes × 2 modes; mode doesn't change
the target. Targets are 6, 9, 12, 12, 20, 12 — "12" is right 50% of the time. An attacker that
always says 12 beats a stated 8.3% floor. And the red-team question "planks still needed" is
*fully determined by the misconception label deliberately handed over* — scores ~100% by
construction. **Satisfy:** report against the majority-class baseline on the actual fixtures;
ask only for total and shape; say plainly that "what to do next" is the hint, not a secret.

**N2 — The zero-digit gate is lexical, sold as semantic. [SERIOUS]** "Add one more" is banned;
"add **another** plank" is not, and is identical. **Satisfy:** one honest paragraph — the gate
protects the *target total*, not the *next action*, which is deliberately hintable.

**N3 — `[3,3,3]` doesn't need a latency heuristic; it needs a different shape. [SERIOUS — a gift]**
`off_by_one_per_group` and `counted_groups_as_group_size` collide exactly when
`per_group − 1 = groups` — true for 2×3, 3×4, 4×5; **false for 3×3, 4×3, 6×2**. On 4×3 they
predict `[2,2,2,2]` vs `[4,4,4,4]`. A level-design accident, not an information limit.
**Satisfy:** make the diagnostic node 4×3 or 3×3, delete the latency heuristic, and say on camera
"the two misconceptions are indistinguishable on the demo shape, so the diagnostic runs where
they aren't."

**N4 — Tap-to-place silently weakened §4's evidence. [SERIOUS]** Under tapping: `place_failed` is
indistinguishable from an exploratory tap on empty ground (and it was the primary separator for
`[4,4,3]`); `rapid_guessing` at <400 ms fires on ordinary enthusiastic tapping; the hover signal
the latency heuristic used no longer exists. **Satisfy:** define `place_failed` for taps,
re-derive or drop `rapid_guessing`; note this is another reason N3 is the right fix.

**N5 — `village.mjs` will rescale the whole scene on every plank. [SERIOUS, concrete bug]**
`renderVillage` recomputes the bounding box and `scale` from current items and rebuilds via
`innerHTML`. Add a plank → bbox changes → **the camera zooms on every placement**, and every
`plop` animation re-fires. Wrecks the 20-second beat. **Satisfy:** pin `bx` and `scale` at level
start; append planks incrementally. Also: tap-to-place needs neither the inverse `iso()` nor
per-part bounding boxes — the renderer already emits per-item `<img>`; add `data-part` and one
delegated click listener. Day 2 is an hour, not a day.

**N6 — Is the cart finite? §2 says both. [MINOR, decision-forcing]** "Running out *is* the answer"
needs a finite cart of exactly the target; `[5,4,4]` needs an infinite one. Finite is the better
mechanic (over-filling one part *starves* another). Decide and log it.

**N7 — Deleting Elo deletes an existing measured artifact. [MINOR]** `measure.html` holds a
non-circular adaptive-vs-fixed result. The graph has no baseline. **Satisfy:** name the lost
measurement in DECISIONS; keep `engine.mjs` intact as the frozen control arm.

**N8 — Item 3 is not a flaw if you name it. [MINOR]** `□ × 4 = 8` and "18 pencils, boxes of 6" are
untaught — 25% of the instrument. Pre-registered as **unrelated-skill control items**, they
become the best-designed part. **Satisfy:** name them controls, score trained items /6, fix
"no item repeats a trained shape."

**N9 — Unblinded administration. [MINOR]** **Satisfy:** one sentence on camera beside the COI
line: "I administered the post-test knowing which arm each child was in."

## What must still change
1. **#3** — sheep → goat everywhere; drop "hand-drawn SVG sheep"; adopt `planksHole` + missing
   section; convert day 1 to a 1-hour re-test of the one uncovered state (a *height* difference
   between adjacent parts).
2. **#1 / N1 / N2** — fix the floor, the red-team question, the overclaim.
3. **#2** — force the commitment (packs delivered **on request, once, no top-up** — she says how
   many, they arrive, the fence shows the result) or drop the claim. Specify a pack of 6 tapped
   into a part of 3. Cite the concreteness-fading progression or flag it unevidenced.
4. **N3** — diagnostic on 4×3; delete the latency heuristic.
5. **N5** — pin scale/bbox; append incrementally; DOM click targets.
6. **#7 / N7** — resolve "three children" vs "n=3 per arm"; don't delete the engine under the
   control arm.
7. **#13** — name the wordlist; commit `data/wordlist.txt`.

## Verdict
**NOT SATISFIED — but close.** 4, 5, 7, 9, 10, 11, 12 are genuinely closed. Nothing marked
strong in R1 has been softened. Remaining must-fix: #3, N1+N2, #2, N3+N4, N5, #7/#8, #13.

Residual risks accepted, to be logged: packs at age 7 have no citation; the goat over an iso
field is a style compromise; n=3 supports no inference and the video says so first; the red-team
number may be bad and is published anyway.
