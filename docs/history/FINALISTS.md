> **SUPERSEDED 4 Sep 2026.** Pre-research finalists; Numbo/Rung/Sona were superseded by the learner-research redesign (D-043). Current authority: `docs/CONCEPT-V3.2.md`.

# FINALISTS — chosen for execution, not novelty

4 Sep 2026. 14 days left. Per D-034: stop optimising novelty; optimise
**execution × demo × honest measurement × genuinely helps a kid.** All three are
learner-facing (on-brief), buildable solo in 13 days, and use the AI only where our own
kill-tests proved it reliable (language layer: 0 leaks, 0 wrong facts; code owns truth;
real models train fine).

Scored 1–5: **DEMO** lean-forward factor · **BUILD** finishable+polishable in 13 days ·
**HELPS** a real kid, visibly · **MEASURE** honest number · **CRAFT** shows the engineer.

---

## Finalist 1 — "Numbo" · a maths buddy that is never wrong and never tells
K-5 / lower-middle maths game (brief prompt #1)

**What it is.** A genuinely fun maths game. Every problem is generated in code, so the
answer is exact and owned by us. A warm AI buddy coaches the child — explains, hints,
encourages — but **cannot** state the answer or a wrong fact (both proven: Ask Better KT-1
= 0/80 leaks; α KT-C2 = 0/30 wrong facts). Difficulty steps with the child.

**The kid it helps.** A 7–10-year-old stuck on homework who would otherwise copy an answer
and learn nothing. They get help that makes them think, that is *always correct* — unlike
Khanmigo, which is documented wrong on basic maths.

**The 3-min demo beat.** A child is stuck. They beg the buddy for the answer; it warmly
refuses and asks the one question that unlocks them. They get there themselves. Small,
real, joyful. (Honest version — NO rigged LLM-vs-calculator screen; the reliability is a
line in the write-up, not a staged benchmark.)

**Tech / AI.** Neuro-symbolic: code = truth, LLM = language. The reliable half of everything
we tested.

**Honest measure.** % of problems solved *after coaching without the answer being given*;
hint-to-solve rate. Modest, real, on-screen.

| DEMO | BUILD | HELPS | MEASURE | CRAFT |
|---|---|---|---|---|
| 4 | **5** | **5** | 3 | 3 |

**Main risk.** Closest to Khanmigo; wins on execution, reliability and game-feel, not idea.
Safest build, lowest ceiling.

---

## Finalist 2 — "Rung" · practice that finds each child's exact edge
Adaptive maths practice, learner-facing (brief #1, the "adaptive practice" Nerdy surface)

**What it is.** A real adaptivity engine — item-response / knowledge-tracing style — that
picks the next problem at the child's **struggle edge**: hard enough to stretch, not so hard
they quit. Uses the real-model capability from β KT (trains from scratch, sub-ms inference),
but pointed at the **learner**, not an admin dashboard.

**The kid it helps.** The bored-because-too-easy kid and the crushed-because-too-hard kid —
both get problems tuned to *them*. This is the "desirable difficulty band" made real
(RESEARCH §4), which almost nobody operationalises.

**The 3-min demo beat.** Split screen: a strong child and a struggling child start the same
app. Within a handful of problems it has silently homed each to a totally different
difficulty — visible as two diverging difficulty curves. "Same app, two children, it found
each one's level in 90 seconds."

**Tech / AI.** A genuine adaptive model (not "an LLM picks the next question" — which is the
fake-adaptive we predicted most entries ship). The AI is doing real inference. LLM optional
for phrasing.

**Honest measure.** Does it converge to the right level faster than linear/random? Measurable
in simulation on generated learners **with known ability** (this is legitimate — the learner's
true ability is a parameter WE set, not a hidden variable we're guessing; D-023 is about
faking *understanding*, not about IRT simulation with known theta).

| DEMO | BUILD | HELPS | MEASURE | CRAFT |
|---|---|---|---|---|
| 4 | 4 | 4 | **5** | **5** |

**Main risk.** Adaptive practice exists (ALEKS, DreamBox). Differentiator is "real adaptivity
vs everyone's fake LLM-adaptive," which is an execution/craft story. Convergence demo must be
made legible to non-experts.

---

## Finalist 3 — "Sona" · a maths game for kids who can't read yet
Voice-first, ages 5–7 (attacks GAP 3 — the under-8 wall the whole field ignores)

**What it is.** A voice-first maths game. The child **speaks and listens** — no reading, no
typing. Attacks the most-ignored gap: every AI tutor is text-first, so the youngest kids,
who most need help, are locked out (sources in GAP-MAP §3).

**The kid it helps.** A 5–6-year-old who cannot read a text tutor at all. The most
emotionally compelling learner in the whole space.

**The 3-min demo beat.** An actual small child playing a maths game *by talking to it*,
laughing, getting it. Nothing else on this list is as heart-string or as obviously
"the future." Highest ceiling by far.

**Tech / AI.** Speech-to-speech (2026: sub-200ms native; ~1.5s realistic). Real multimodal.

**Honest measure.** Thinner — engagement/turns; harder to put a rigorous learning number on.

| DEMO | BUILD | HELPS | MEASURE | CRAFT |
|---|---|---|---|---|
| **5** | 2 | **5** | 2 | 4 |

**Main risks — two, both real.** (1) **Child-ASR reliability is untested and known-hard** —
must be kill-tested day one or it's dead. (2) **Filming needs a real 5-year-old** we can
record — a practical demo-production problem, not just a build problem. Highest ceiling,
highest chance of not shipping.

---

## The board

| | DEMO | BUILD | HELPS | MEASURE | CRAFT | overall |
|---|---|---|---|---|---|---|
| 1 Numbo (reliable buddy) | 4 | **5** | **5** | 3 | 3 | **safe, shippable** |
| 2 Rung (real adaptive) | 4 | 4 | 4 | **5** | **5** | **best craft+measure** |
| 3 Sona (voice, pre-reader) | **5** | 2 | **5** | 2 | 4 | **highest ceiling, riskiest** |

---

## Recommendation

**Build Finalist 2 (Rung), with Finalist 1's reliable-coach buddy inside it.**

Why this pairing wins on the new bar:
- **Rung** gives the two things the critic said were missing everywhere: a **real model doing
  real inference** (craft, "where's the AI" answered) and a **rigorous, honest number**
  (convergence vs baseline, validatable in simulation with *known* ability — no D-023
  violation).
- **Numbo's buddy** folded in gives it warmth and a joyful learner-facing moment, and reuses
  the proven-reliable coaching layer — so the demo has both a *gut-punch* (it found my level)
  and a *heart* (the buddy helped me get there), while every fact stays correct by
  construction.
- Together: **learner-facing, on-brief (adaptive practice + maths game), buildable in 13
  days, genuinely helps a kid, and produces a real number** — without a rigged benchmark and
  without depending on anything our kill-tests failed.

Sona is the higher-ceiling swing. If you want the most memorable possible video and accept a
real chance it doesn't ship, we kill-test child-ASR tomorrow and decide. Otherwise Rung+buddy
is the one I'd stake the submission on.

**Either way: this is the last selection round.** Pick, and the next 13 days are build and
polish, not ideation.
