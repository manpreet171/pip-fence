> **SUPERSEDED 4 Sep 2026.** The pre-research candidate list; selection was redone from RESEARCH-LEARNER.md. Current authority: `docs/CONCEPT-V3.2.md`.

# CANDIDATES — built up from the capability map

3 Sep 2026. Per D-026: chosen from what we **measured** works, not from what sounds new.

Every candidate here passes all five constraints **by construction**, before you read it:

| # | Constraint | Source |
|---|---|---|
| 1 | No simulated learner | D-023 |
| 2 | No controlled LLM wrongness | D-024 |
| 3 | No LLM as ground truth | D-024 (88%) |
| 4 | No claim resting on an unobservable | D-022 |
| 5 | No LLM judging quality (it rewards fluency) | D-022 |

**The design rule that generates all four:** the LLM is used *only* for fluent language —
the one thing it measured as reliable. Truth comes from code. Every claim is decided by
something we can watch happen.

---

## A. ASK BETTER — the learner may ask anything except for the answer

**Recommended.**

The learner faces a problem they cannot yet solve. There is no "show me the answer" button
and no hint button. There is one input: **they can ask the system a question.**

The system answers the question they actually asked — properly, helpfully, in plain
language. Then they must still solve the problem themselves.

What gets measured is **the questions**.

- *"just tell me the answer"* → refused, and it is refused **by code**: we generated the
  problem so we know the answer string, and we can verify it does not appear in the output.
  Leak prevention is a string check, not a prompt instruction.
- *"do I take the discount off before the tax or after?"* → answered, and it unlocks them.

**The measurement — and this is the part nobody has:**

> A question's value = **did it move the learner from cannot-solve to can-solve.**

Not an opinion about the question. An observed outcome. Question count, solve rate before
and after each question, time — all directly watched. **Constraint 4 fully satisfied.**

**Why it matters beyond the demo:** in a world where the answers are free, the skill that
decides whether AI helps or harms you is **knowing what to ask**. Nobody teaches it and
nobody measures it. The 2026 curiosity/metacognition literature says this directly —
effective prompting mirrors high-quality question-asking — and then proposes no product.

**The shot that wins the video:** a child's questions maturing over three weeks.
*"What's the answer"* → *"is it multiply or divide"* → *"why does the order change the
result"*. **No product has ever shown a parent that graph.**

**Why the AI is genuinely doing work here:** answering an arbitrary child's question well
is a real language task and needs a real model. Contrast with concept v1, where a reviewer
could fairly ask *"where is the AI?"*. Here the LLM is used for exactly the capability we
measured as reliable, and for nothing else.

**Pre-attack:** *"A hint system with extra steps. And children will just open ChatGPT in
another tab."*
**Answer:** a hint system decides what you need; this makes the learner decide, and the
deciding is the skill being taught and measured. The other-tab problem is real and applies
to literally every entry in this hackathon — but it applies **least** here, because this is
the only concept that gets *better* the more comfortable a child is with asking an AI things.

**Kill-tests:** (1) can code reliably block answer-leakage in a free-text reply? (2) do
better questions actually produce measurably higher solve rates, on data we generate? (3)
can we classify question *type* reliably enough to show the maturity graph?

---

## B. CALIBRATION ENGINE — the gap between sure and right

The learner marks how confident they are, then answers. Both quantities are directly
observed; truth comes from code-generated problems. Output is the dangerous quadrant:
**confident and wrong** — the topics a learner will never revise, because they believe they
know them. Invisible to every product on the market.

- **Passes all five constraints trivially.** Nothing is inferred; two observed numbers are
  compared.
- **Your home turf:** Brier scores, reliability curves.
- **The problem is three years old** — AI produces false competence (`RESEARCH.md` §11).

**Pre-attack:** *"Asking for a confidence rating on every question is friction, children
won't do it, and this is a feature inside someone else's product, not a product."*
**Answer:** partial. Confidence can also be *inferred* from behaviour — response time,
answer changes, hesitation — all observable. But the "feature, not product" charge lands,
and it is why this ranks second rather than first.

**Kill-tests:** (1) does inferred confidence correlate with stated confidence? (2) is there
enough spread in calibration to be worth showing, or is everyone the same?

---

## C. THE VERIFIER — the learner hunts bugs that code planted

Inverts kill-test 2's failure into the design. We proved an **LLM** cannot plant a
controlled error — but **code can, perfectly.** A generator produces a worked solution
containing one deterministic bug drawn from an executable bug library. The learner hunts it.

Everything is exact: the truth, the bug, the location, whether they found it.

**Pre-attack:** *"This only works where you can generate the problem and the bug in code.
So: arithmetic. How does it reach 3,000 subjects?"*
**Answer:** it does not, cleanly. **This is the identical limitation that sank concept v1**
(D-025) and I am not walking into it a third time. Listed for completeness, ranked third.

---

## D. PROCESS LEDGER — record how the work was made, not what was made

Homework stopped being evidence. Capture the observable process — order of steps, time to
first attempt, revisions, whether they attempted before asking, whether they checked their
answer — and make *that* the artefact. Every signal is directly watched; no model judges
anything.

Attacks *effortless bypass* head-on and matches the AIED 2026 direction "amplify
process-based assessment."

**Pre-attack:** *"This is surveillance software for children, and the moment a school
deploys it, someone writes an article about it."*
**Answer:** none that is fully satisfying. The framing can be made learner-owned rather than
teacher-owned, but the objection is legitimate and would follow the product. Ranked fourth.

---

## Ranking

| | Concept | Novelty | Nerdy fit | Demo | Buildable | Provable | Survives attack |
|---|---|---|---|---|---|---|---|
| **1** | **Ask Better** | **5** | 4 | **5** | 4 | **5** | **4** |
| 2 | Calibration Engine | 4 | 4 | 4 | **5** | **5** | 3 |
| 3 | The Verifier | 3 | 3 | 4 | **5** | **5** | 2 |
| 4 | Process Ledger | 4 | 4 | 3 | 4 | 4 | 2 |

**Recommendation: A, with B's calibration measure embedded in it.**

Ask Better already collects confidence for free — a learner who asks nothing and gets it
wrong was overconfident; one who asks four questions and was right all along was
underconfident. **The two concepts share one data stream.**

Combined pitch:

> **A learner cannot be given the answer. They can only ask. We measure how good their
> questions get — and how well they know when they need one.**

Both halves observed. Nothing inferred. Nothing simulated. No model asked to be wrong, to
be ignorant, or to be a judge.

---

## Before any build — kill-tests for candidate A

1. **Answer-leak blocking.** Can code reliably stop the answer appearing in a free-text
   reply? We know the answer string, so this is a verifiable check, not a hope.
2. **Signal check.** Do questions vary enough in usefulness to produce a real measurement,
   or does everything help equally?
3. **Question typing.** Can question *kind* be classified consistently enough to draw the
   maturity graph? (Note: this uses an LLM to classify, which brushes constraint 5 — so it
   must be validated against hand-labels, not assumed.)

If test 1 fails the concept is dead — the whole product rests on the answer being
unobtainable.
