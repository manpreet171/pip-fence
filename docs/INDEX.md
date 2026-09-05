# docs/ — read in this order

Everything below `docs/` is either **current authority** or **history**. Superseded files carry a
banner on line 1 pointing to what replaced them. Decisions are append-only in `DECISIONS.md`.

## Current authority (read these)

| File | What it is |
|---|---|
| **CONCEPT-V3.2.md** | The approved product — "the plot is the problem." Mechanic, AI layer, classifier, measurement, 14-day plan, demo. Errata at the end = Critic R3 patches applied. |
| **RESEARCH-LEARNER.md** | Who the 7–11 learner is, per five research passes + synthesis. Every confidence flag preserved. The evidence base every design decision cites. |
| **AI-ARCHITECTURE.md** | What AI earns its place (and what does not): exact models, structured outputs, redacted payload, child-safety build list, what a hiring panel sees through. |
| **MARKET.md** | Competitive landscape. Honest verdict: a recombination of four proven pieces; closest surface competitor is Math Town (a coin tollgate). |
| **TECH-STACK.md** | Principal-engineer specification of every layer (AI/ML, visuals, frontend, backend, evals, deploy) and the file plan. |
| **CRITIC-R1.md → CRITIC-R2.md → CRITIC-R3.md** | Three rounds of independent expert critique. R1: 2 fatal. R2: close. R3: **SATISFIED** — "build it." |
| **DECISIONS.md** | D-001 … D-049. Read D-043 (stop; research the learner), D-044 (concept v3), D-045 (loop converged; v3.2 adopted), D-047/D-048 (spec corrections found in code), D-049 (schedule). |

## Evidence produced during the critic loop (measured, not asserted)

| File | Finding |
|---|---|
| **ART-FEASIBILITY.md** | No sheep in any CC0 pack → goat. "Broken fence" sprite fails legibility at 320px; a missing section and `planksHole` pass. |
| **REDTEAM-RESULTS.md** (3 updates) | The v3 "answer-blind" claim was false. v3.2's redacted payload attacked by a different-family model, forced choice: a real leak found and closed; wrong chance floor corrected; final lift **+0.0%** over baseline. PASS. |
| **READINGLEVEL-RESULTS.md** | 5 of 6 original hints broke the product's own no-number-word gate. Rewrites: 0 number words, 99% in a **named** list (Dolch ∪ Fry). |
| **V3.2-ARITHMETIC-CHECK.md** | Verified the shape rebalance; caught 4×5 mis-listed as non-colliding (design unaffected). |

Harnesses: `evals/redteam_leak.py`, `evals/readinglevel.py` (`--assert` = build-time gate check),
`evals/classifier_eval.mjs` over `evals/classifier_fixtures.json` (67 sequences → confusion matrix),
`data/wordlist.txt` (Dolch 315 ∪ Fry 300 ∪ domain), `data/hints_v2.txt`.

## History (superseded — kept for the record of what was killed and why)

`AUDIT.md`, `CONCEPT.md` (v2), `CONCEPT-V3.md`, `CONCEPT-V3.1.md`, `IDEAS.md`, `IDEAS-V2.md`,
`CANDIDATES.md`, `FINALISTS.md`, `GAP-MAP.md`, `KILLTEST-RESULTS*.md`, `RESEARCH.md` (the
pre-learner research), `DEMO.md`, `FILMING.md`, `LEARNING.md` (running notes), `CREDITS.md`.

Five concepts were killed by cheap experiments before this one; the kill-tests are the reason
the surviving concept is defensible. That trail is deliberate and is part of the submission.
