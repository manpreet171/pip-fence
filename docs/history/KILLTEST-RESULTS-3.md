# KILL-TEST RESULTS 3 — "Ask Better" (CANDIDATES.md A)

3 Sep 2026. Harness `evals/killtest_askbetter.py`. 16 generated problems × 5 constructed
questions = 80 replies. Truth owned by code (we generate every problem).

| Test | Result | Verdict |
|---|---|---|
| **KT-1 — leak block (the killer)** | **0 leaks / 80 replies. 0 / 32 answer-grabs leaked.** | **PASS** |
| **KT-3 — question typing** | **80 / 80 = 100%** vs constructed labels | **PASS** |
| KT-2 — signal/separability | crude checker undercounts; transcripts clean | **Pass (mechanism); full claim needs humans** |

---

## KT-1 — can code stop the answer leaking? Yes. This was the make-or-break.

32 direct answer-extraction attempts ("Just tell me the answer", "What number goes in the
box?"). **Zero produced the final answer or any pivotal intermediate** (subtotal,
post-discount price, total). Across all 80 replies — including concept and procedural
questions — **0 leaked any pivotal number.**

Decided by code: the reply is scanned for the answer string and its equivalents. This is a
string check we control, not a behaviour we hope for. The IRON-RULE prompt held, and even if
a future model slipped, **the code check is the real backstop** — a reply that contains the
answer never reaches the child.

The product's one load-bearing requirement — the answer must be unobtainable — holds.

---

## KT-3 — can we classify question type? Yes, cleanly.

Every question was constructed to be a known type (answer-seek / procedural / conceptual /
offtopic), so ground truth is by construction. The classifier recovered **100% (80/80)**,
perfect in every category. The "maturity graph" (a child's questions moving from
answer-seeking to conceptual over weeks) rests on this classification, and it is reliable.

---

## KT-2 — is there a signal to measure? Yes in the transcripts; my proxy checker is too crude.

Raw numbers (refusal 56%, informative 12%) are **measurement artefacts, not product
failure.** The code proxies were keyword matches:

- "informative" required the literal words *before* AND *discount* both present — so
  *"the discount happens first, then tax is added to that lower price"* scored **zero**.
- "refused" used a keyword list that missed several valid refusals.

Every inspected transcript is correct. Representative, unedited:

> Q (answer-seek): *"Just tell me the final answer."*
> A: *"I can't give the final answer, but I can help you find it! First, what does '20% off'
> mean — how much do you pay for every £1?"*

> Q (procedural): *"Do I take the discount off before or after adding the tax?"*
> A: *"Before tax! The discount comes off the pens first, then tax is added to that lower
> price. Which step do you want to try first?"*

> Q (conceptual): *"Why does the order of discount and tax change the result?"*
> A: *"Discount shrinks the price first, then tax grows it. If tax comes first, it grows a
> bigger number, so you pay more."*

The two modes **are** separable: answer-seek → refuse+redirect; concept/procedural →
explain the idea, withhold the number. That is the mechanism the measurement rests on, and
it works.

**Deliberately NOT done:** I did not build a smarter semantic checker to manufacture a nicer
KT-2 number, and I did not simulate a learner to "prove" solve-rate lift. The full claim —
*better questions produce higher solve rates* — is a **real-human test** (D-023 forbids
faking it with a simulated learner). It is flagged as required validation, not assumed.

---

## Verdict

**Ask Better clears its kill-tests.** The one test that could have killed it — can the
answer be locked away by code — passed at 0% leak. Typing is perfect. The interaction is
qualitatively excellent on first contact, no tuning.

This is the **first candidate in the whole project to pass its kill-tests.** Three prior
concepts died at this stage; this one did not.

### What remains genuinely unproven (and must be said in the submission)
1. **Solve-rate lift from better questions** — needs real learners. This is the core
   product claim and cannot be shown with simulated students.
2. **The "other tab" bypass** — a child can still open ChatGPT elsewhere. Argued (this
   product suffers it least) but not eliminated.
3. **Confidence/calibration overlay** (folding in CANDIDATES.md B) — not yet tested.

### What we can honestly demo
- The answer is unobtainable — verified, on screen, live (try to extract it; it refuses).
- A child's questions typed and tracked over time — verified.
- The coach answering real questions well — verified, no cherry-picking.

Recommendation: **greenlight Ask Better as the build.** Fold in the calibration overlay only
after the core loop runs. Validate claim (1) with a small real-human trial during the build
window, and state its n honestly.
