# IDEAS V2 — after the frontier sweep

3 Sep 2026. Written after concept v1/v2 were abandoned (`docs/AUDIT.md`, D-018).
Grounded in `docs/RESEARCH.md` **Part II** — openings **E/F/G/H/I**.

**Change of method:** v1 was scored on how good it sounded. Every idea here carries a
**pre-attack** — the strongest thing a hostile senior reviewer would say — written *before*
we choose. If the pre-attack has no answer, the idea is dead now, not on 25 September.

**Scoring** (1–5): **NOV** novelty · **FIT** Nerdy fit · **DEMO** shows in 3 min ·
**BLD** solo in 15 days · **EVID** research backing · **MEAS** produces a real number

---

## The reframe

The old plan asked *"how do we teach better?"* — a 40-year-old question with 40 years of
competitors.

The 2026 literature has converged somewhere else:

> **AI did not only make cheating easy. It made learners unable to tell whether they had
> learned anything.**

That failure — *metacognitive decoupling*, "confident but inaccurate answers **fostering
false competence**" — is **three years old**, universal, quantitative, and essentially
unserved by any product. That is where the open ground is.

---

## Tier 1

### 1. The Viva — a 60-second spoken defence of your own work
`F · E` — **NOV 5 · FIT 5 · DEMO 5 · BLD 4 · EVID 5 · MEAS 5**

Homework stopped being evidence of anything. Every manual fix schools have reached for —
more in-class writing, more observation, oral checks — **works and does not scale.**

The learner submits work. The system reads *that specific work* and holds a **60-second
voice conversation about it**: *"You wrote that you borrowed here — why did you have to?"*
*"What happens if I change this number to 9?"*

Output is not a cheating verdict. It is a map: **which parts of this work the learner can
defend, and which they cannot.**

**The move that makes it a learning tool, not a police tool:** being made to explain your
reasoning aloud is *self-explanation* + *retrieval practice* — two of the largest effects in
learning science. **The assessment is the lesson.** It teaches while it measures.

- **Why now:** speech-to-speech is under 200ms natively in 2026 (realistically 1.5–2.5s
  in production). A one-minute viva per student was impossible at scale last year.
- **Nerdy fit:** feeds `session intelligence` directly — the tutor opens Thursday knowing
  exactly which step Aanya could not defend.
- **The number:** does the viva score predict an independent written test? That is a
  validity study, and it is real data science.
- **Pre-attack:** *"This is an AI-detector in a nicer jacket. Children will hate being
  interrogated, and detectors are a discredited category."*
- **Answer:** it never accuses and never mentions AI. It asks you to explain your own work,
  which is what a good teacher does. The output is a learning map, not a verdict. And it is
  the only version of this that improves the learner while running.
- **Real risk, not hand-waved:** **ASR on children's speech is materially worse than on
  adults.** This must be tested on day one, not assumed.

---

### 2. The Calibration Map — the gap between what you think you know and what you know
`E` — **NOV 5 · FIT 4 · DEMO 4 · BLD 5 · EVID 5 · MEAS 5**

Every learning app knows what you got **wrong**. **None** know what you got right by luck,
or wrong while certain.

Before each answer the learner marks confidence. The system builds a **calibration
profile** and surfaces the dangerous quadrant — *high confidence, actually wrong.*

Those are the topics a learner will **never revise**, because they believe they know them.
They are invisible to every product on the market.

- **Why it is genuinely new:** the problem it measures is three years old. Calibration is
  well studied in psychology and almost never productised for children.
- **Why it suits this author:** Brier scores and reliability curves are natively a
  data-scientist's object. This is the rare pedagogy problem that *is* a modelling problem.
- **The demo shot:** *"You were sure about 12 topics. You actually know 7. These 5 are the
  ones that will hurt you."*
- **Pre-attack:** *"Asking for a confidence rating on every question is friction, children
  won't do it, and this is a feature, not a product."*
- **Answer:** friction is real — so infer confidence from behaviour (latency, answer
  changes, hesitation) as well as asking. And it is honestly **stronger as the instrument
  inside idea 1** than as a standalone app.

---

### 3. The Fallible Tutor — an AI you are required to check
`G` — **NOV 5 · FIT 3 · DEMO 5 · BLD 5 · EVID 4 · MEAS 4**

June 2026, replicated: learners **warned that the AI might be wrong asked for significantly
more hints — with the system behaving identically.** Merely signalling fallibility produced
verification behaviour.

So stop signalling it and **make it true.** The AI makes plausible, controlled errors at a
known rate. Catching them is the task.

**It kills effortless bypass structurally:** you cannot blind-copy an output you are
required to audit.

- **Pre-attack:** *"You are deliberately lying to children and teaching them to distrust
  the tool. That is an ethics problem and a support-ticket problem."*
- **Answer:** total transparency — the learner is told the game up front, and the error rate
  is shown. It is the oldest technique in maths teaching (error analysis, "My Favourite No")
  with the error generation automated. But the pre-attack is strong enough that this is
  **better as a mechanic inside idea 1 or 2 than as the whole product.**

---

### 4. The Group Room — AI facilitator for small-group learning
`H` — **NOV 4 · FIT 5 · DEMO 2 · BLD 2 · EVID 4 · MEAS 3**

A 2026 systematic review says AI in **in-person group work** "remains underexplored."
Essentially all AI tutoring is 1:1. **Nerdy runs live group classes.**

An AI that listens to 3–5 learners and manages the discussion: notices who has gone silent,
notices when the group has converged on a wrong answer, injects a provocation.

- **Best strategic fit in this document.**
- **Pre-attack:** *"You cannot demo this alone in 15 days. You need five children and live
  multi-speaker diarisation."*
- **Answer:** there isn't a good one. **Correct idea, wrong hackathon.** Logged, not built.

---

## Tier 2

### 5. The Help Budget — make using AI an explicit choice
`I` — **NOV 4 · FIT 3 · DEMO 3 · BLD 5 · EVID 4 · MEAS 4**

Gamified designs are **68.85% challenge** and only **18.85% autonomy**. And the core 2026
problem is that learners *choose* the bypass.

So make the choice visible: a weekly budget of AI help the learner **spends deliberately**.
The data on *when* a learner chooses to spend is itself a strong signal of self-regulation.

- **Pre-attack:** *"Artificial scarcity is a gimmick, and children will just use ChatGPT in
  another tab."* — which is fair, and unanswerable for a consumer product.

### 6. Self-Explanation Loop — think aloud while you work
`E · F` — **NOV 3 · FIT 4 · DEMO 4 · BLD 3 · EVID 5 · MEAS 4**

Child speaks their reasoning while solving; the system scores the *explanation*, not the
answer. Voice removes the typing barrier for young children entirely.

- **Catch:** this is essentially idea 1 without the defence framing — weaker positioning,
  same build. **Fold into 1.**

### 7. The Transfer Test — can you use it anywhere else?
**NOV 5 · FIT 3 · DEMO 3 · BLD 2 · EVID 4 · MEAS 2**

Every product measures recall in the context it was taught. **Transfer** is the actual goal
of education and nobody measures it. Auto-generate far-transfer items and report a transfer
score.

- **Pre-attack:** *"Far transfer is notoriously hard to produce. You will build the
  instrument and measure nothing."* True. High risk, brilliant if it worked.

### 8. The Struggle Band *(carried from v1)*
**NOV 5 · FIT 4 · DEMO 3 · BLD 3 · EVID 4 · MEAS 4**

Detect the boundary of productive struggle from behavioural signal; intervene only at the
upper edge. Still unbuilt by anyone. Still best as a **control layer**, not a product.

---

## Tier 3 — logged and rejected

**9. Process Recorder** — capture drafts/dead-ends so the process becomes the artefact.
*Rejected:* surveillance framing, and idea 1 is the smarter version of the same insight.

**10. Curiosity Engine** — build information gaps rather than challenges, since curiosity is
3× under-served in shipped designs. *Rejected:* genuinely interesting, but fuzzy to measure
and easy to dismiss as content design rather than engineering.

---

## Recommendation

**Build idea 1. Put idea 2 inside it. Optionally use idea 3's mechanic in one screen.**

> **The learner does some work. Then they defend it out loud for sixty seconds.
> The system reports what they can and cannot explain — and how far that sits from what
> they thought they knew.**

Why this and not the rest:

- It attacks a problem that is **three years old**, not forty — no incumbent owns it
- The **measurement is the intervention** (self-explanation + retrieval), so it dodges the
  entire "does AI harm learning" trap by construction rather than by guardrail
- It is only possible **now** — sub-second speech-to-speech landed this year
- It produces a **validity number**, which is a data scientist's artefact and near-unique
  in a hackathon field
- It feeds Nerdy's `session intelligence` on day one
- **The learner is visibly the hero**, so it is unambiguously on-brief (D-013)

**What must be tested on day one, before anything is built:**
1. ASR accuracy on a child's voice — the whole idea rests on it
2. End-to-end latency with a real turn-taking loop
3. Whether a 60-second viva actually separates a learner who understands from one who
   copied — on ten hand-made samples, by hand, before writing any product code

If test 3 fails, the idea dies on day two and we still have thirteen days.
