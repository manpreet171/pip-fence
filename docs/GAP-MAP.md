# GAP MAP — where the incumbents are genuinely weak

4 Sep 2026. 14 days to deadline. Per D-029: stop pitching single concepts; map the real
market weaknesses first, then choose a target together.

Every gap below is **sourced**, not asserted. Ranked at the end.

---

## The single biggest finding, and it is not what we were chasing

> **Almost half of children given an AI tutor simply do not use it.**

This is the finding that reframes everything. All four dead concepts optimised *quality* —
better diagnosis, better questions, better measurement. But the field's number-one problem
is not quality. It is that **kids won't touch these tools.**

- ~50% of students given an AI tutor didn't use it at all.
- Grades 1–5 usage stayed **far below** the 30 min/week needed for any measurable gain.
- Even *with* human support, usage rose only **1–4.4 min/week**.
- Khan Academy's own Khanmigo was described as **"a non-event"** at scale; engagement did
  **not** reliably correlate with learning gains.
- Khanmigo's Socratic style — the exact mechanic our dead "Ask Better" copied — **frustrated
  kids into quitting.** "Students simply stopped asking for help." Worst for under-8s.

Sources: chalkbeat.org (usage), the74million.org (motivation), socialsciencespace.com
(16%), agentconn.com (Khanmigo "non-event"), kidsaitools.com (Socratic frustration).

**Implication:** a beautiful tutor nobody opens scores zero. The hackathon prompts hint at
this on purpose — they ask for a *game*, not a tutor. Games get used. Tutors get abandoned.

---

## The five real gaps

### GAP 1 — Engagement / the usage cliff
**The problem is getting a child to come back, not what happens when they do.**

- Evidence: the numbers above. This is the best-evidenced weakness in the entire field.
- Why it's open: everyone builds the teaching engine; almost nobody solves "why open it
  tomorrow." The ones who try reach for shallow gamification (points, streaks) — which the
  2026 review found is **68% challenge-mechanics, 3× under-serving curiosity and autonomy**
  (`RESEARCH.md` §15).
- Nerdy fit: **very high.** Retention is their business (day-30 <12% across the industry).
- Manpreet fit: **medium.** Engagement is design-led; the ML angle is modelling *what* keeps
  a specific child returning, which is real but data-hungry.
- Risk: easy to do shallowly and land in the saturated gamification pile. Hard to measure
  honestly in 15 days (retention needs weeks).

### GAP 2 — Correctness / the AI is confidently wrong at maths
**The market leader is publicly unreliable on elementary arithmetic.**

- Evidence: *"Khanmigo's answers are not trustworthy. Even for basic elementary school math,
  there have been incorrect answers."* *"GPT-4 makes more errors with larger numbers, and
  students trust it because it sounds confident — for a math tutor this is structural."*
  Our own kill-tests independently measured the LLM at **88%** on multi-step maths.
- Why it's open: everyone lets the LLM do the maths. Nobody architects it so the LLM
  *cannot* be the source of truth.
- Nerdy fit: high — reliability is a named JD value ("fast, reliable, delightful").
- Manpreet fit: **high.** This is an architecture/engineering story: code owns truth, LLM
  owns language. It uses the actual ML-systems skill.
- Risk: on its own it's a *correctness improvement*, not a product. Needs a body to live in.

### GAP 3 — The pre-reader / under-8 wall
**AI tutors are text-first; the children who most need help can't read the help.**

- Evidence: Khanmigo is **text-only**; sources say *"voice interaction would be more natural
  for younger learners,"* and under-8s are exactly who abandon Socratic text. Younger kids
  "require more interactive and emotionally supportive environments."
- Why it's open: text is the default because it's easy; voice-first for a 5-year-old who
  can't type or read is genuinely hard and rare.
- Nerdy fit: high — K-5 is prompt #1, and this is the untouched end of it.
- Manpreet fit: medium — voice pipeline is engineering, but the ML differentiation is
  thinner unless we do something real with the audio (e.g. speech assessment).
- Risk: child-ASR reliability (we already flagged this untested); a voice toy is easy, a
  voice *product* is not.

### GAP 4 — The confidence trap / false competence
**AI makes learners feel they understand when they don't.**

- Evidence: `RESEARCH.md` §11 — metacognitive decoupling, "confident but inaccurate answers
  fostering false competence." Three years old, quantitative, no incumbent.
- Why it's open: nobody productises calibration (confident-and-wrong) for children.
- Nerdy fit: medium.
- Manpreet fit: **high** — calibration is natively a data-science object (Brier, reliability
  curves).
- Risk: "rate your confidence" is friction kids resist; strongest as a layer inside a
  product, not the product (this is CANDIDATES.md B — still standing, still un-killed).

### GAP 5 — Depth of learning / the 84%
**AI tutors support a narrow band: drill and Q&A. They miss reflection, construction, play,
and social learning.**

- Evidence: socialsciencespace.com — "AI tutors support 16% of learning; what about the
  other 84%?" They miss "the playful, exploratory engagement that characterises deep
  learning" and "the social acts of learning."
- Why it's open: it's genuinely hard, and vague. High novelty, high risk of building
  something unmeasurable.
- Nerdy fit: high in principle. Manpreet fit: low-medium. Risk: **very high** — easy to
  build something impressive-looking that measures nothing (this killed earlier ideas).

---

## The map, scored

Scale 1–5. **Attack** = can a solo builder make a real dent in 14 days.

| Gap | Evidence | Open | Nerdy fit | Manpreet fit | Demo | Attack | Measurable |
|---|---|---|---|---|---|---|---|
| 1 Engagement cliff | **5** | 4 | **5** | 3 | 4 | 3 | 2 |
| 2 Correctness | **5** | 4 | 4 | **5** | 4 | **5** | **5** |
| 3 Pre-reader wall | 4 | 4 | 4 | 3 | **5** | 3 | 3 |
| 4 Confidence trap | 4 | **5** | 3 | **5** | 3 | 4 | **5** |
| 5 The 84% | 4 | **5** | 4 | 2 | 3 | 2 | 1 |

---

## The two moves worth considering — combine, don't pick one

No single gap is a product. The strong plays pair a **hard, provable engineering pillar**
(where Manpreet shines and reviewers see depth) with a **reason the child comes back**
(where the whole field is failing).

**Play α — "The tutor that is never wrong."**
Attack GAP 2 as the spine (code owns every fact; the LLM physically cannot state a wrong
number — demo it side-by-side against a normal AI getting a sum wrong), and fold GAP 4
(confident-and-wrong calibration) in as the learner-facing layer. Both are Manpreet's home
turf, both produce hard numbers, both hit real documented incumbent weaknesses. **This is
the highest-provability, best-fit-for-you play. Its risk is being felt as "correctness," not
"delight."**

**Play β — "The AI game kids actually reopen."**
Attack GAP 1 head-on: build for the thing that fails — return usage — using the correctness
pillar (GAP 2) so it's trustworthy and the effort-preservation research so it isn't the PNAS
harm. **Highest ceiling (engagement IS the market's hole), highest risk (easy to land in the
gamification pile; retention is hard to measure in 15 days).**

---

## My read (for discussion, not decision)

**GAP 2 is the anchor either way** — it's the only weakness that is simultaneously (a) a
real, sourced flaw in the market leader, (b) squarely Manpreet's ML-systems skill, (c)
provable with a hard on-screen number, and (d) something our own tests already validated.

The open question is what it powers:
- Pair it with **GAP 4** → Play α: safe, deep, "engineer's" submission. Lower delight.
- Pair it with **GAP 1** → Play β: higher ceiling, more memorable, riskier to prove.

**What I need from you to choose:** are we optimising for *"this person is a serious AI
engineer"* (α) or *"this person built something a child actually loves and it's rigorous
too"* (β)? Both are defensible. They fork the next two weeks differently.

I am **not** greenlighting either until we've (1) picked the pairing, (2) named the single
demo moment, and (3) run the incumbent-check + kill-test gate that D-029 says must come
first.
