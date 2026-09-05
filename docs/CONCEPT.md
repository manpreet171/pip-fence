> **SUPERSEDED 4 Sep 2026.** Concept v2 (misconception engine) was abandoned — see D-018 and AUDIT.md. Current authority: `docs/CONCEPT-V3.2.md`.

# CONCEPT — v2 (post-critique rework)

3 Sep 2026. Supersedes the v1 sketch in `docs/IDEAS.md`.
Written specifically to answer the reviewer critique logged in `docs/DECISIONS.md` D-008.

---

## One line

**An engine that names the exact misconception a student holds from their wrong answers,
and puts it in front of the person who can act on it — the tutor, thirty seconds before
the session starts.**

Not a tutor. Not a chatbot. A diagnostic layer.

---

## The reframe

| v1 (rejected) | v2 |
|---|---|
| A game where a kid teaches a confused AI | An engine; the game is one surface on top |
| 25 hand-authored bugs | Misconceptions **mined** from real student data, verified by execution |
| Learner is the user | **Tutor is the primary user**; learner is the second surface |
| Solves nothing Nerdy has | Session intelligence + tutoring copilot — two of their four named surfaces |
| Dead-ends past one subject | Pipeline generalises to any procedural subject |
| "ChatGPT harms learning" (attackable) | "Guardrailed AI produced *no gain*. Nobody has beaten zero." |

---

## Architecture — three layers

### Layer 1 — Mining: discover misconceptions instead of authoring them

**Input:** real student wrong-answer data (question, chosen distractor, frequency).

**Process:**
1. Group wrong answers by the **answer itself**. Students who share a broken procedure
   produce the *same wrong number*. `503 − 178 → 475` is a fingerprint, not noise.
2. **LLM proposes** a hypothesis in natural language *and* as an executable rule:
   *"skips the zero instead of borrowing across it"*.
3. **Code verifies.** Run the proposed rule on held-out questions. Does it predict the
   *other* wrong answers this cluster produced? Keep it if it predicts. Discard if not.

This is LLM-proposes / executor-verifies — program synthesis with a hard oracle. The LLM
never gets the last word; arithmetic does.

**Why this matters:** it is the answer to *"how does this work for 3,000 subjects?"*
Nobody authors anything. It runs wherever a procedure can be executed — arithmetic,
algebra, units, spelling rules, grammar, chemistry balancing. **It does not work for
open-ended writing, and we say so out loud.** Naming the boundary is part of the pitch.

**Ground truth:** the Eedi dataset ships expert misconception labels for every distractor.
So mining accuracy is a **measurable number against expert labels**, on a task that had a
public Kaggle leaderboard.

### Layer 2 — Diagnosis: which misconception does *this* student hold?

Given one learner's answer history, produce a posterior over the mined misconception set.
Evaluated on held-out real students: how many answers do we need before we identify the
right misconception, and how often are we right?

Output is not a score. It is a named, ranked, confidence-weighted hypothesis.

### Layer 3 — Delivery: two surfaces, one engine

**A. Tutor surface — the primary product.**

The thirty seconds before a live session starts:

> **Aanya, Grade 4 — likely misconception:**
> *"Subtracts the smaller digit from the larger, regardless of position"* · confidence 0.81
> Seen in 4,312 students in the dataset.
> **Two questions that confirm it** → [shown]
> **The move that fixes it** → [one concrete instruction]

This is Nerdy's `session intelligence` + `tutoring copilot`, and it echoes the only large
RCT win in the field (Stanford Tutor CoPilot: +9pp for the weakest tutors, tutor-facing only).

**Retention story:** a tutor opens it before every session because it saves them prep.
That is a workflow tool, not a novelty. v1 had no retention story at all.

**B. Learner surface — the teaching game.**

The learner teaches an AI classmate who holds a misconception **loaded from the mined set**.

The line that makes it serious rather than cute:

> *"This AI is not pretending. It is wrong in exactly the way 4,312 real students were wrong."*

The learner cannot ask for the answer — they are the one who has to know it. Their score is
the AI's measured improvement on a test the AI actually sits.

---

## The Betty's Brain question (answered honestly)

Learning-by-teaching agents are ~2005 research (Betty's Brain, Vanderbilt). We do not
claim to have invented it. The interesting question is why it never scaled.

**It didn't scale because authoring the agent's wrong knowledge was manual, per-topic, and
done by researchers.** Every deployment needed a hand-built domain model. That authoring
cost is precisely the bottleneck Layer 1 removes.

So the claim is not "I invented teachable agents." It is:
**"I removed the thing that stopped them shipping."** That is a stronger and truer claim,
and it converts the field's history from a weakness into evidence we did the reading.

---

## Measurement — three numbers, all real

1. **Mining accuracy** — do our discovered misconceptions match Eedi's expert labels?
   Ground truth exists. Public benchmark exists.
2. **Diagnosis accuracy** — on held-out real students, how many answers until we correctly
   identify their misconception?
3. **Judge agreement** — the LLM decides if a learner's explanation is correct. We hand-label
   ~50 explanations and report agreement with the model.

Number 3 is the one almost nobody in this hackathon will think of. **Validating your own
evaluator** is a shipped-ML instinct. It costs an afternoon.

---

## Honest limitations (stated in the submission, not hidden)

- Works on **procedural** knowledge. Not essays, not open reasoning.
- Mining needs response volume per item; cold-start on brand-new questions is unsolved here.
- Eedi is maths-only. Cross-subject generalisation is argued and prototyped, not proven.
- The tutor surface is validated against a dataset, not against live tutors.

Stating these is a feature. Every other entry will overclaim.

---

## Scope — what ships in 15 days

**Core (must ship):** Layer 1 + Layer 2 + Tutor surface + the three measurements.
**Stretch:** Learner game surface.

| Days | Work | Cut if behind |
|---|---|---|
| 1 | Acquire Eedi data, EDA, pick one topic slice (~200 questions) | — |
| 2–4 | Mining pipeline + executable verifier; benchmark vs expert labels | verifier → LLM-only |
| 5–6 | Diagnosis layer + held-out evaluation | — |
| 7–9 | Tutor surface (primary demo) | — |
| 10–12 | Learner game surface | **cut first** |
| 13 | Eval charts + judge agreement labelling | — |
| 14–15 | Record video, deploy, write submission | — |

**This is a full 15 days with no slack.** The game is the designated sacrifice. If it goes,
we still have a complete, business-relevant submission — which v1 did not.

**Cut order:** (1) learner game, (2) executable verifier degrades to LLM-only verification,
(3) reduce to a single topic slice.

---

## Demo video — 3 minutes

| Time | Shot |
|---|---|
| 0:00–0:20 | The claim: *"The best guardrailed AI tutor in the literature produced no harm — and no gain. Nobody has beaten zero. Here's my attempt."* |
| 0:20–1:00 | **Mining.** Real wrong answers stream in → cluster → LLM proposes a rule → code executes it → verified. Accuracy vs expert labels appears. |
| 1:00–1:50 | **Tutor surface.** Session about to start. The card appears: named misconception, confidence, two confirming questions, the fix. |
| 1:50–2:40 | **Learner surface.** Child teaches the AI that holds that exact misconception. AI resists a vague explanation. Accepts a good one. Test score jumps. |
| 2:40–3:00 | The three numbers. The stated limits. |

---

## What this fixes from the critique

| Critique | Fix |
|---|---|
| 1. AI is thin | Mining pipeline with an executable verifier; benchmarked inference |
| 2. Doesn't scale | Nothing is hand-authored; generalises to procedural subjects |
| 3. Not new (2005) | Answered directly: we removed the authoring bottleneck that killed it |
| 4. Citation overreach | Reframed to the un-attackable claim |
| 5. Demo not product | Tutor uses it every session; that is the retention story |
| 6. Solves nothing Nerdy has | It *is* session intelligence + tutoring copilot |
| 7. Narrow engineering | Data pipeline + synthesis + inference + eval + two surfaces |
| 8. Cartoon tone risk | Tutor surface leads; game is second and grounded in real data |

---

## Open risks

- **Data licence.** Kaggle competition data has usage terms. Confirm before building on it.
  Fallback: NeurIPS 2020 Diagnostic Questions release, or a public misconception taxonomy.
- **Mining may underperform on a 15-day budget.** Mitigation: the benchmark is honest either
  way — a modest, correctly-measured number beats an unmeasured claim.
- **Two surfaces is a lot.** Hence the explicit cut order.
