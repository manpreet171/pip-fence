> **SUPERSEDED 3 Sep 2026.** Concept v1/v2 abandoned — see `docs/AUDIT.md` and D-018.
> Current shortlist: `docs/IDEAS-V2.md`.

# IDEAS — Candidate Concepts

Generated 3 Sep 2026. 15 days to deadline.
Every idea below is scored against `docs/RESEARCH.md` §9 openings (A/B/C/D) and the
Mission test in `CLAUDE.md`.

**Scoring key** (1–5 each): **NOV** novelty · **FIT** Nerdy strategic fit ·
**DEMO** shows in 3 min · **BLD** buildable solo in 15 days · **EVID** evidence backing ·
**MEAS** can we put a number on it

---

## Tier 1 — the ones that could win

### 1. The Protégé — a learner who teaches an AI that genuinely doesn't understand
`A · C · D` — **NOV 5 · FIT 4 · DEMO 5 · BLD 4 · EVID 5 · MEAS 5**

The child is the tutor. They are assigned an AI classmate who **actually holds a specific,
tracked misconception** — not roleplay, a real symbolic learner model with a broken rule in
it (e.g. it genuinely believes `borrow across zero → skip the zero`). The child must
diagnose the misunderstanding, explain the fix, and the AI's *rule set updates only if the
explanation is correct*.

**Why this is the strongest idea in the list:** it makes cognitive offloading
*structurally impossible*. You cannot ask the AI for the answer, because you are the one
who knows it. The PNAS harm mechanism cannot occur — not because of a guardrail, but
because of the direction of the interaction. That is an architectural answer to a research
finding, and it is the kind of thing a hiring panel remembers.

- **Grounding:** protégé effect / learning-by-teaching (Betty's Brain, Vanderbilt) is one
  of the best-evidenced pedagogies there is. Plus arXiv 2410.12294 (LLM cognitive models
  of students with misconceptions).
- **The measurement, and it is beautiful:** the AI protégé sits a test. The child's score
  *is* the protégé's improvement. Learning outcome and game score are the same number.
  No proxy metric, no engagement theatre.
- **The demo shot:** side-by-side. Left — the AI's belief graph with one red broken rule.
  Right — the child explaining. The rule turns green *live* when the explanation lands, and
  the protégé's test score jumps. Three minutes, zero narration needed.
- **Risk:** the protégé must be *convincingly* wrong and must resist bad explanations.
  If it accepts anything, the whole thing collapses. That validator is the hard part — and
  it is also exactly the engineering that impresses.

---

### 2. Bug Hunter — a 1978 misconception catalogue wearing a 2026 LLM
`C · D` — **NOV 5 · FIT 5 · DEMO 5 · BLD 5 · EVID 5 · MEAS 4**

Stop modelling *what the child knows*. Model *how they are wrong*.

Brown & Burton (1978) catalogued ~100 procedural bugs in children's arithmetic. Encode
~40 of them as executable rules. When a child answers wrong, don't say "not quite" — run
the bug library against their answer, identify **which broken procedure would produce
exactly that digit string**, then generate the one problem where that bug yields a visibly
absurd result. Confront the misconception instead of drilling around it.

- **Why it stands out:** every other entry says "adaptive". Theirs means an LLM picks the
  next question. Ours means a symbolic diagnostic engine naming the precise faulty
  subroutine in the child's head. It is also *faster and cheaper* than an LLM call, which
  is itself the finding of arXiv 2603.02830.
- **The demo shot:** type `503 − 178 = 475`. App instantly: *"You're not borrowing across
  the zero — you're skipping it. Here's a problem that will show you."* Serves `1000 − 1`.
  That single moment sells the whole product.
- **Risk:** low. This is the safest build in Tier 1. Bug library is data, not ML.
- **Note:** this is a *component* as much as a product — it is the natural learner-model
  engine underneath idea 1, 4 or 5.

---

### 3. Session Copilot — real-time coaching for the human tutor
`B · D` — **NOV 4 · FIT 5 · DEMO 3 · BLD 3 · EVID 5 · MEAS 5**

Live audio of a tutoring session → real-time suggestions **to the tutor**, grounded in a
taxonomy of tutoring moves, plus an automatic post-session intelligence report.

- **Why it stands out:** this is Nerdy's literal product surface (`tutoring copilots` +
  `session intelligence`), it replicates the **only large RCT win in the field**
  (+9pp for weakest tutors), and *no other hackathon entrant will build tutor-facing*.
  It says: I understand your business, not just your prompt.
- **Risk:** hardest to demo — needs a believable live session. Latency is real work.
  Highest strategic fit, lowest demo safety. **Strong candidate for a second surface
  bolted onto a Tier-1 build rather than the whole entry.**

---

### 4. The Struggle Band — detecting the boundary of productive difficulty
`A · C · D` — **NOV 5 · FIT 4 · DEMO 3 · BLD 3 · EVID 4 · MEAS 4**

Desirable difficulties only work inside a band; below it nothing encodes, above it the
child shuts down. Everyone quotes Bjork. Nobody instruments it.

Model struggle in real time from behavioural signal — response latency, erase/undo
patterns, retry cadence, abandonment, keystroke dynamics — and let the AI intervene at
*exactly* the upper boundary and not one second earlier. A visible "struggle meter" the
child never sees but the teacher does.

- **Why it stands out:** it turns a cited principle into a running system. Very few people
  can do the signal-processing half *and* the pedagogy half.
- **Risk:** needs real interaction data to calibrate; cold-start is genuinely hard.
  Best as a **control layer inside another idea**, not standalone.

---

## Tier 2 — strong, but each has a catch

### 5. Show Your Work — grade the process, not the answer
`A · C` — **NOV 4 · FIT 4 · DEMO 5 · BLD 3 · EVID 4 · MEAS 3**

Child works on paper or a tablet canvas. Vision model reads the **steps**, not the final
number, and flags the *line where it went wrong* — the thing a human tutor does and no
homework-scanner does (they all jump to the solution, which is the PNAS harm).

- **Catch:** vision reliability on child handwriting is a genuine risk in 15 days.
  Also adjacent to the saturated "photo of homework" lane — the differentiation is real
  but has to be communicated fast.

### 6. The Fading Scaffold — support that provably withdraws
`A · D` — **NOV 4 · FIT 4 · DEMO 4 · BLD 4 · EVID 4 · MEAS 5**

Scaffolding intensity is a tracked variable that must monotonically decrease, per skill,
with a hard rule: **assistance can never rise twice in a row without a mastery event.**
The product's headline metric is *how little help it gave you last week*.

- **Why it's interesting:** it directly inverts engagement optimisation. Success = the
  product being needed less. That framing lands hard with leadership.
- **Catch:** it is a mechanic, not a product. Needs a body — pair with idea 2.

### 7. Miscue Engine — automated running records for oral reading
`B · D` — **NOV 3 · FIT 4 · DEMO 4 · BLD 3 · EVID 5 · MEAS 5**

Child reads aloud; phoneme-level alignment produces a full miscue analysis
(substitution / omission / insertion / self-correction) and WCPM automatically — replacing
a teacher with a clipboard and a stopwatch. Enormous, unglamorous, real workload problem.

- **Catch:** **Amira Learning already owns this** and just won the BU EVAL challenge.
  Building into an occupied lane invites the comparison. Only worth it if we take the
  comprehension half, which Amira does weakly.

### 8. Between-Sessions — retrieval scheduling extracted from live sessions
`B` — **NOV 3 · FIT 5 · DEMO 3 · BLD 5 · EVID 5 · MEAS 4**

Auto-extract what was *actually taught* in a tutoring session, generate retrieval prompts,
schedule them across the week, deliver in 90-second doses. Closes the gap Nerdy explicitly
names in their own marketing ("always-on AI support between sessions").

- **Catch:** highest strategic fit-to-effort ratio here, but the lowest novelty.
  It is spaced repetition with a good input pipe. Good as a *second feature*.

---

## Tier 3 — good ideas, wrong competition

### 9. Effortmeter — an open benchmark for answer-leakage in AI tutors
`D` — **NOV 5 · FIT 3 · DEMO 2 · BLD 4 · EVID 5 · MEAS 5**

Score any AI tutor on effort preservation, answer leakage, scaffold quality, and simulated
delayed retention using LLM student simulators. Run it against raw ChatGPT, a Khanmigo-style
prompt, and ours. Publish the table.

- **Catch:** it is infrastructure, not a learning product — the brief asks for a tool that
  *helps someone learn*. **But as a component it is our single sharpest weapon.** Whichever
  idea we pick, this is how we get a number on screen in the demo.
- **Decision leaning:** not the entry. Definitely inside the entry.

### 10. The Disagreement Room — AI peers who are confidently wrong
`A` — **NOV 4 · FIT 3 · DEMO 4 · BLD 4 · EVID 3 · MEAS 2**

The learner joins a small group of AI classmates at different ability levels, one of whom
argues a plausible wrong position. The learner must defend a claim against peer pressure.
Socratic pressure + social learning.

- **Catch:** hard to measure, and "did the child learn or just win an argument" is a real
  validity problem. Fun, less defensible.

---

## Cross-cutting read

Ideas **2, 6 and 9 are components, not entries.** Ideas **1 and 3 are entries.**
The strongest submission is probably **one Tier-1 entry with two components welded in**:

> **Idea 1 (The Protégé)** as the experience,
> **Idea 2 (Bug Hunter)** as the learner model underneath it,
> **Idea 9 (Effortmeter)** as the number on screen in the final 20 seconds of the video.

That combination hits openings **A, C and D**, is buildable in 15 days, and the demo
writes itself. Adding a thin **Idea 3** teacher view would touch **B** as well — all four —
but only if the core is finished by ~12 Sep.

**Open question for discussion:** do we go Protégé (novel, memorable, riskier validator)
or Session Copilot (maximum strategic fit, harder demo)?
