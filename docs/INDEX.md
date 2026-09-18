# docs/ — read in this order

Everything below `docs/` is either **current authority** or **history**. Superseded files carry a
banner on line 1 pointing to what replaced them. Decisions are append-only in `DECISIONS.md`.

## Current authority (read these)

| File | What it is |
|---|---|
| **CONCEPT-V3.2.md** | The approved product — "the plot is the problem." Mechanic, AI layer, classifier, measurement, 14-day plan, demo. Errata at the end = Review R3 patches applied. |
| **RESEARCH-LEARNER.md** | Who the 7–11 learner is, per five research passes + synthesis. Every confidence flag preserved. The evidence base every design decision cites. |
| **AI-ARCHITECTURE.md** | What AI earns its place (and what does not): exact models, structured outputs, redacted payload, child-safety build list, what a hiring panel sees through. |
| **MARKET.md** | Competitive landscape. Honest verdict: a recombination of four proven pieces; closest surface competitor is Math Town (a coin tollgate). |
| **TECH-STACK.md** | Principal-engineer specification of every layer (AI/ML, visuals, frontend, backend, evals, deploy) and the file plan. |
| **REVIEW-R3.md** | Final round of independent design review: **SATISFIED** — "build it." (R1, R2 in `history/`.) |
| **BUDDY-CONTRACT.md** | The one interface the game and the hint layer share. |
| **TEST-REPORT.md → TEST-REPORT-2.md** | Independent QA, two rounds: 16 cases / 10 defects closed (D-064–D-066); then 15 cases on the rebuilt scene and AI features / 9 defects closed (D-073). |
| **PRODUCT-REVIEW.md → PRODUCT-REVIEW-2.md** | Hiring-panel style review, two rounds. Round 1: "Promising, fix X first". Round 2: **"Talk to this person"**, with the pre-filming fix list. |
| **PRODUCT-REVIEW.md** | Hiring-panel style review of the finished product; what to fix before filming. |
| **DEMO-V2.md** | The 3-minute shot list for the built product: timings, what is on screen, what is said, what is never said. |
| **TRANSFER-TEST.md** | The paper instrument for the three-child pilot, with the pre-registered null. |
| **DECISIONS.md** | D-001 … D-074. Read D-043 (stop; research the learner), D-045 (v3.2 adopted), D-047/D-048 (spec corrections found in code), D-066/D-069 (real taps; the scene), D-071 (what the AI is), D-074 (review-2 fixes). |

## Evidence produced during the review loop (measured, not asserted)

| File | Finding |
|---|---|
| **ART-FEASIBILITY.md** | No sheep in any CC0 pack → goat. "Broken fence" sprite fails legibility at 320px; a missing section and `planksHole` pass. |
| **REDTEAM-RESULTS.md** (3 updates) | The v3 "answer-blind" claim was false. v3.2's redacted payload attacked by a different-family model, forced choice: a real leak found and closed; wrong chance floor corrected; final lift **+0.0%** over baseline. PASS. |
| **JUDGE-RESULTS.md** | A second model judges each rephrase against the template for meaning; 20 live: 12 shipped, 6 gate, 2 overturned. |
| **LATENCY-RESULTS.md** | 20 live hints through the shipped path: p50 757 ms, p95 1.4 s, $0.00015/hint, gate pass 80% (every rejection was the word *one*). |
| **READINGLEVEL-RESULTS.md** | 5 of 6 original hints broke the product's own no-number-word gate. Rewrites: 0 number words, 99% in a **named** list (Dolch ∪ Fry). |
| **V3.2-ARITHMETIC-CHECK.md** | Verified the shape rebalance; caught 4×5 mis-listed as non-colliding (design unaffected). |

Harnesses: `evals/redteam_leak.py`, `evals/readinglevel.py` (`--assert` = build-time gate check),
`evals/classifier_eval.mjs` over `evals/classifier_fixtures.json` (162 sequences → confusion matrix),
`data/wordlist.txt` (Dolch 315 ∪ Fry 300 ∪ domain), `data/hints_v2.txt`.

## History — `docs/history/` (superseded, kept for the record of what was killed and why)

`AUDIT.md`, `CONCEPT.md` (v2), `CONCEPT-V3.md`, `CONCEPT-V3.1.md`, `IDEAS.md`, `IDEAS-V2.md`,
`CANDIDATES.md`, `FINALISTS.md`, `GAP-MAP.md`, `KILLTEST-RESULTS*.md`, `RESEARCH.md` (the
pre-learner research), `DEMO.md`, `FILMING.md`, `LEARNING.md` (running notes), `REVIEW-R1.md`,
`REVIEW-R2.md`. Paths inside `DECISIONS.md` older than D-066 refer to these files at their old
location; the log is append-only and was not rewritten.

Five concepts were killed by cheap experiments before this one; the kill-tests are the reason
the surviving concept is defensible. That trail is deliberate and is part of the submission.
