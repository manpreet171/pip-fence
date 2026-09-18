# DECISIONS

Append-only log. Newest at the bottom. Never rewrite history — if a decision reverses,
add a new entry that supersedes the old one and mark the old one.

**Format:**
```
## D-NNN — <title>
Date · Status: Decided | Superseded by D-NNN | Open
**Decision:** what we are doing
**Why:** the reasoning
**Rejected:** what we did not do, and why
```

---

> D-001 to D-003 were housekeeping about the repository itself and are left out here. The log starts with the product.
>
> Because the log is never rewritten, older entries name files by the paths they had at the time.
> Read them with this map: the measured results named as `docs/*-RESULTS.md` are now in
> `docs/results/`; the concept papers, kill-test reports, reviews, the earlier build
> (`src/engine/engine.mjs`, `src/public/index.html`, `village.mjs`) and the second game are in
> git history up to commit `9533298`, not in the tree (D-085). Rung is the working name of what
> became Pip (D-076). Some numbers were reserved and never used, so the log runs to D-085 with
> seventy-three entries here.

---

## D-004 — We do not build a homework-answering chatbot
3 Sep 2026 · Status: **Decided**

**Decision:** The submission's core mechanic must preserve the learner's cognitive effort.
Ruled out: any surface whose primary action is the AI producing an answer, explanation or
solution the learner had not first attempted.

**Why:** PNAS 2025 (n≈1,000, RCT) — students with unguarded GPT-4 scored **17% below
control** once the AI was withdrawn. The guardrailed arm erased the harm but produced **no
gain**. See `docs/RESEARCH.md` §1. Building the obvious thing means shipping a product the
literature says is net-negative, alongside fifty identical entries.

**Rejected:** The eight saturated patterns listed in `docs/RESEARCH.md` §8.

---

## D-005 — Measurement is a first-class product surface
3 Sep 2026 · Status: **Decided**

**Decision:** Whatever we build ships with an evaluation harness, and a real number appears
on screen in the demo video.

**Why:** 3 of 4 shipped AI-tutor products have no mastery model and no evaluation
(`RESEARCH.md` §5); most EdTech does not benchmark at all. The Nerdy JD explicitly asks for
*"establish feedback loops and define success metrics."* Almost no hackathon entry will have
numbers. This is the cheapest available differentiation.

**Rejected:** Engagement metrics (time on task, streaks, sessions) as the headline. They
measure stickiness, not learning, and are exactly what the audit paper criticises.

---

## D-006 — Learner model is explicit and symbolic; the LLM is the language layer
3 Sep 2026 · Status: **Decided**

**Decision:** Knowledge/misconception state lives in an inspectable symbolic structure. The
LLM handles natural language in and out of it, and never *is* the model.

**Why:** LLMs infer misconceptions worse than explicit misconception models and are weakest
at spotting *incorrect* reasoning; specialised knowledge-tracing models are faster, cheaper
and more accurate (`RESEARCH.md` §6). A symbolic state is also renderable — which makes it
demoable, which makes it a video shot.

**Rejected:** Prompt-only "the LLM remembers the student" architectures.

---

## D-007 — Concept selection
3 Sep 2026 · Status: **Superseded by D-009**

Shortlist in `docs/IDEAS.md`. Leading combination: **Protégé (1) + Bug Hunter (2) +
Effortmeter (9)**. Alternative with higher strategic fit but harder demo: **Session
Copilot (3)**.

To be closed in discussion before any code is written.

---

## D-008 — Adversarial review of concept v1
3 Sep 2026 · Status: **Decided**

**Decision:** Ran a hostile senior-reviewer critique against concept v1 before writing code.
Eight criticisms; three judged serious.

**The serious three:**
1. **Does not scale.** Hand-authored bug rules for one skill do not extend to 3,000 subjects.
2. **No retention story.** A novelty game with no reason to return — the exact failure we
   criticised in other products.
3. **Solves nothing Nerdy has.** Touches none of matching / tutor quality / session
   intelligence / churn. We picked the concept that was easier to film over the one that fit
   the business.

**Also raised:** thin AI content, citation overreach on the PNAS result, teachable agents
are 2005 research, narrow engineering surface, cartoon tone risk.

**Why this is logged:** the critique is more valuable than the original plan. Any future
change gets re-tested against these eight points.

---

## D-009 — Concept v2: the engine is the product
3 Sep 2026 · Status: **Decided** · Supersedes D-007

**Decision:** Build a misconception diagnosis engine. Primary user is the **tutor**; the
learner-facing teaching game becomes a second surface and the designated scope sacrifice.
Full spec in `docs/CONCEPT.md`.

**Why:** it fixes all three serious criticisms with one structural move. The engine scales,
the tutor returns to it every session, and it lands directly on two of Nerdy's four named
AI surfaces.

**Rejected:** learner-only product (v1); Session Copilot as a standalone (needs live audio
and a believable session — too much risk for 15 days, and this version reaches the same
business surface through data instead of audio).

---

## D-010 — Misconceptions are mined from real data, never hand-authored
3 Sep 2026 · Status: **Decided**

**Decision:** Use the **Eedi — Mining Misconceptions in Mathematics** dataset (1,857 real
K-12 questions, every distractor expert-mapped, 2,587 distinct misconceptions). Build a
pipeline that discovers misconceptions from wrong-answer clusters: **LLM proposes a rule,
executable code verifies it against held-out answers.**

**Why:** this is the single answer to "how does this work for 3,000 subjects" — nothing is
authored. It also gives us **expert ground truth**, so mining accuracy is a real measured
number on a previously benchmarked task. And LLM-proposes / code-verifies keeps the LLM
from having the last word, which is the correct architecture given that LLMs are known to
be weak at identifying incorrect reasoning (`RESEARCH.md` §6).

**Rejected:** hand-authoring ~25 bugs from Brown & Burton (1978). Elegant, demoable, and
strategically fatal — it is the unscalable choice and reviewers see it immediately.

**Open:** confirm Kaggle data licence permits this use. Fallback: NeurIPS 2020 Diagnostic
Questions release.

---

## D-011 — Drop the PNAS "17% worse" framing
3 Sep 2026 · Status: **Decided** · Amends D-004

**Decision:** Do not claim "AI makes students worse." Claim instead:
*"The guardrailed tutor in that study produced no harm — and no gain. Nobody has beaten
zero. Here is my attempt."*

**Why:** the 17% figure applies to raw unmodified ChatGPT, which nobody serious ships.
Using it to justify an absolute design rule is motivated reasoning, and a reviewer who
knows the paper will catch it on stage. The weaker-sounding claim is harder to attack and
sets a higher bar for ourselves.

**Note:** D-004's *design* rule (do not build an answer-giving chatbot) still stands. Only
the justification changes.

---

## D-012 — Ship honest limitations in the submission
3 Sep 2026 · Status: **Decided**

**Decision:** State the boundaries in the video and the README: procedural knowledge only,
not open-ended writing; cold-start on new questions unsolved; maths-only dataset;
validated against data, not live tutors.

**Why:** every other entry will overclaim. Naming the boundary of your own system is a
senior signal and costs nothing. It also pre-empts the exact questions a panel would ask.

---

## D-013 — The learner leads the demo, not the tutor
3 Sep 2026 · Status: **Decided** · Amends D-009

**Decision:** The child-facing teaching surface is the main character of the demo video.
The tutor card appears for ~20 seconds near the end. The learner game is **no longer the
first thing we cut.**

**Why:** the brief's own-idea clause reads *"a tool that genuinely helps someone learn"* and
*"a real learner, a real problem."* All three official prompts are learner-facing. A video
that is mostly a tutor dashboard risks being scored off-brief — a stupid way to lose.
D-009 was right about the product and wrong about the presentation.

**Rejected:** tutor-first video (rules risk); learner-only product (returns us to the
retention and business-fit problems in D-008).

**New cut order:** (1) executable verifier degrades to LLM-only, (2) tutor card becomes a
static mockup, (3) shrink to one topic slice. The learner surface is now protected.

---

## D-014 — Novelty position: three specific claims, not one broad one
3 Sep 2026 · Status: **Decided**

**Decision:** We do **not** claim to have invented misconception diagnosis or teachable
agents. Both exist. We claim exactly three things:

1. **Discovery, not authoring.** Existing misconception libraries are expert-written
   (Eedi's 60k diagnostic questions; Carnegie Learning's MATHia bug library since the 90s).
   We mine them from student answer data and verify each by execution. Prior automated work
   (McMining, arXiv 2510.08827) does this for **student code**, not maths.
2. **A student simulator that cannot be talked out of its mistake.** *"Simulating Students
   or Sycophantic Problem Solving?"* (arXiv 2605.12748) finds LLM student simulators are
   sycophantic and do not hold misconceptions faithfully. Ours is executable code, so
   faithfulness is structural, not prompted.
3. **The closed loop.** Diagnose a real learner → instantiate an AI peer holding *that*
   misconception → learner teaches it → measure whether it moved. Diagnosis products stop
   at step 1; teachable-agent research starts at step 2 with hand-authored confusion.

**Why:** the broad claim ("we built misconception diagnosis") collapses the moment a
reviewer names Eedi. The narrow claim survives scrutiny and demonstrates we surveyed the
field. Supporting quote from the automated-discovery literature: *"educator beliefs about
common errors can diverge significantly from actual student patterns"* — the argument for
mining over authoring.

**Rejected:** any framing that implies the category is new.

---

## D-015 — Maths is the demo; the method is subject-general
3 Sep 2026 · Status: **Decided**

**Decision:** Build depth in one maths slice. Include a **15-second second-subject shot**
running the identical pipeline on English past-tense over-regularisation
("goed" / "runned" / "teached" — one broken rule, many wrong answers).

**Why:** it answers *"does this only work for maths?"* inside the video, before a judge
asks, and it costs almost nothing — the pipeline is unchanged, only the data differs.
It also concretely supports the 3,000-subjects claim.

**Scope boundary, stated publicly:** works where a rule can be executed and checked
(arithmetic, algebra, units, spelling, conjugation, chemistry balancing). Does **not** work
for essays, opinions or open reasoning. We say this in the video.

---

## D-016 — Dataset licence is a day-one gate
3 Sep 2026 · Status: **Open — action required 4 Sep**

**Decision:** Read the Eedi/Kaggle competition data licence **before** any code is written.
Do not assume hackathon use is permitted.

**Why:** Kaggle competition data commonly carries competition-use-only terms. Discovering
this on 17 Sep would be fatal; discovering it on 4 Sep costs nothing.

**Fallbacks, in order:** (1) NeurIPS 2020 Diagnostic Questions release (same Eedi source,
more openly published); (2) public misconception taxonomies from maths-education research.

**Note:** the dataset is demonstration fuel, not the product. The pipeline is the product.
A dataset swap is not a structural change.

---

## D-017 — The learner must break her own rule before she can teach
3 Sep 2026 · Status: **Decided** · Fixes a logic flaw in D-009 / CONCEPT.md v2

**The flaw (raised by Manpreet, 3 Sep):** if Aanya believes 52 − 27 = 35, and Max also says
35, Aanya has no reason to think Max is wrong. She agrees with him. The teaching loop
cannot start. **You cannot teach what you do not know.**

This was a genuine design fault, not a communication problem. Teaching was placed as the
mechanism of learning; it is actually the mechanism of *consolidation*.

**Decision — corrected sequence:**

1. **Test** — plain questions, no AI.
2. **Diagnose** — name the broken rule from the wrong-answer pattern.
3. **Break it** ← *new step.* Use the diagnosed rule to **compute the question on which that
   rule produces an obviously absurd answer**, and serve it.
   Example: her rule gives `22 − 19 = 17`; she can count 19→22 and get 3. She now knows her
   method is broken **without being told the correct method.**
4. **Rebuild** — give a manipulable (draggable ten-blocks), not an answer. She derives
   borrowing herself.
5. **Teach Max** — Max holds her *former* rule. Explaining it consolidates it.
6. **Re-test + tutor card.**

**Why:** this is *cognitive conflict* / conceptual change — you cannot replace a rule the
learner still trusts, so the trust must break first. Well-established in maths-education
research and consistent with the effort-preservation principle in `RESEARCH.md` §3: the app
supplies a counterexample and a tool, never the focal answer.

**Why this strengthens the product:** step 3 turns the diagnosis from a *report* into an
*action*. Selecting the bug-exposing question is only possible once the exact rule is known —
so the diagnosis now does real work inside the learner's screen, not just on the tutor card.
This is also the strongest single "nobody else can do this" moment in the demo.

**Build note:** step 3 is cheap. The bug rules are already executable (D-010), so finding
the maximally-absurd question is a search over the item bank, not new modelling.

**Rejected:** giving Max a *different* misconception from Aanya's (she could spot it, but
she would not repair her own gap); teaching her the method directly before teaching Max
(reintroduces the answer-giving pattern we ruled out in D-004).

---

## D-018 — Abandon the misconception-engine concept entirely
3 Sep 2026 · Status: **Decided** · Supersedes D-009, D-010, D-017

**Decision:** Stop work on concept v1/v2 (misconception diagnosis + teach-the-AI). Nothing
carried forward. `docs/CONCEPT.md` and `docs/IDEAS.md` are archived, not deleted.

**Why:** the audit (`docs/AUDIT.md`) found 5 serious flaws, two of which broke claims made
confidently. But the deciding reason is not the flaw count — it is that the concept answers
a **forty-year-old question** ("how do we teach better?") against forty years of incumbents
(Eedi, Carnegie Learning, ALEKS). Even executed perfectly it is a better version of
something that exists.

**Rejected:** patching the four-step flow. A repaired v2 is still competing on occupied
ground.

---

## D-019 — New target: the metacognitive gap, not the teaching gap
3 Sep 2026 · Status: **Decided**

**Decision:** Target the problem named across the 2026 literature — **effortless bypass**
and **metacognitive decoupling**. See `docs/RESEARCH.md` Part II.

The framing:

> **AI did not only make cheating easy. It made learners unable to tell whether they had
> learned anything.**

**Why:** this problem is **three years old**. It has no incumbent, it is universal, and it
is quantitative (calibration is measurable). Contrast with misconception diagnosis, which
has 40 years of prior art and three shipping competitors.

**Supporting evidence:** arXiv 2607.05557 (effortless bypass; five named directions),
arXiv 2603.29681 (metacognitive decoupling), arXiv 2604.25648 ("confident but potentially
inaccurate answers, fostering false competence"), arXiv 2606.03822 (warning of AI
fallibility measurably increases help-seeking).

---

## D-020 — Method change: every candidate carries a pre-attack
3 Sep 2026 · Status: **Decided**

**Decision:** No concept is shortlisted without the strongest hostile-reviewer objection
written down **beside it, before selection**, plus an answer. No answer → cut immediately.

**Why:** v1 survived three rounds of enthusiasm and died in one round of criticism. That
cost a day. Cheaper to run the criticism first. Applied throughout `docs/IDEAS-V2.md`.

---

## D-021 — Leading candidate: the 60-second spoken defence
3 Sep 2026 · Status: **Open — pending kill-tests**

**Candidate:** learner submits work → 60-second voice viva about *that work* → report of
what they can and cannot explain, set against what they believed they knew.

**Why it leads:** the measurement *is* the intervention (self-explanation + retrieval are
among the largest effects in learning science), so it sidesteps the "AI harms learning"
trap structurally rather than by guardrail. Only newly possible — sub-second speech-to-speech
landed in 2026. Produces a validity number. Feeds `session intelligence`. Learner is visibly
the hero, satisfying the brief (D-013).

**Kill-tests to run BEFORE any product code — in this order:**
1. **ASR on a child's voice.** Materially worse than adult speech. If it fails, the idea
   dies here.
2. **End-to-end latency** with real turn-taking, not the marketing number.
3. **Discrimination:** on ~10 hand-made samples, does a 60-second viva actually separate
   someone who understands from someone who copied? Judged by hand.

If test 3 fails, the concept dies on day two with thirteen days still available.

**Not yet decided.** Awaiting Manpreet's call on direction before any build begins.

---

## D-022 — Kill-test result: the viva's core claim is not validatable here
3 Sep 2026 · Status: **Decided** · Resolves D-021

**Decision:** Test 3 did not pass. Full results in `docs/KILLTEST-RESULTS.md`.
Test 2 (latency) passed at ~1.5 s per turn. Test 1 (child ASR) remains blocked.

**What happened:** across 3 subjects and 18 runs, the simulated *copier* scored **higher**
than the simulated *genuine student* — overall 92 vs 87. Reading the transcripts explains it:
the copier persona could not hold its assigned ignorance and produced conceptual reasoning
absent from the submission, while the authentic-child persona sounded hesitant and imperfect.
**The judge rewarded fluency over substance.**

**Two conclusions:**
1. The idea **cannot be validated with simulated learners** — reproducing arXiv 2605.12748
   in our own data.
2. Therefore its central claim cannot be demonstrated inside this hackathon, and
   "we measure what we claim" (D-005) is our differentiator. Shipping it would mean
   shipping an unvalidated claim.

**Status: not killed outright, but no longer the default.** Three options are laid out in
`docs/KILLTEST-RESULTS.md`; awaiting a call.

---

## D-023 — No concept in this project may depend on a simulated learner
3 Sep 2026 · Status: **Decided**

**Decision:** Any design requiring an LLM to faithfully hold a misconception, a knowledge
gap, or a level of ignorance is rejected on sight.

**Why:** measured in our own harness, not assumed. An LLM instructed that it *could not*
reason beyond a given text proceeded to give a deep conceptual explanation not present in
that text. Consistent with arXiv 2605.12748.

**Retroactive effect:** this independently kills "Max" from concept v1 — he would have
caved to weak explanations exactly as predicted. The v1 mitigation (make the beliefs
executable code, not an LLM) was the right instinct, but the *dialogue* layer would still
have leaked, as flagged in `docs/AUDIT.md` M4.

**Standing rule:** if a claim can only be tested against a simulated human, it cannot be
tested. Find real human data or change the claim.

---

## D-024 — Kill-test 2 result: an LLM cannot be reliably wrong
3 Sep 2026 · Status: **Decided**

**Decision:** Recorded as a hard project constraint, measured twice by different mechanisms.
Full results in `docs/KILLTEST-RESULTS-2.md`.

- **KT-E (poison):** model solves multi-step arithmetic correctly **88%** of the time.
  Wrong 1 time in 8 → would tell a correct child they are wrong. Not a source of truth.
- **KT-A (planting):** asked for a solution with one deliberate error and an explicitly
  wrong final line, only **12–25%** produced a genuinely wrong answer. It returns the
  correct value and then confabulates having planted an error.
- **KT-B:** invalid — I used an LLM as a proxy learner, which D-023 forbids. Logged as a
  design error, not a finding.
- False-alarm rate on clean solutions: **4%** (the one good number).

**The constraint:**
> An LLM will not hold assigned ignorance and will not commit to a planted error. It drifts
> to correct and confabulates. Anything needing **controlled wrongness** or **known truth**
> must be produced by code.

---

## D-025 — Idea #3 (fallible tutor) reduced, not selected
3 Sep 2026 · Status: **Decided**

**Decision:** The deliberately-fallible mechanic is viable **only** on content where the
problem and the error are both generated in code. That confines it to procedurally
generatable domains.

**Why not selected:** that is the identical limitation that sank concept v1 — excellent in a
demo, no obvious path to 3,000 subjects. Repeating a known failure mode.

**Kept as:** a possible mechanic inside another product, not a product.

---

## D-026 — Method inversion: choose from the capability map, not from novelty
3 Sep 2026 · Status: **Decided** · Amends D-020

**Decision:** Stop selecting concepts by novelty and then testing whether they can be
evidenced. Start from the measured capability map in `docs/KILLTEST-RESULTS-2.md` and choose
the strongest product that stands entirely on capabilities already proven to work.

**Why:** three concepts were assessed today and all three broke, each for the same underlying
reason — the central claim could not be evidenced with the tools available. Cost was one
afternoon and no build time, so the method is working. But the ordering is wrong and is
burning cycles.

**Standing constraint set for any future candidate:**
1. No dependence on a simulated learner (D-023)
2. No dependence on controlled LLM wrongness (D-024)
3. No LLM as a source of ground truth (D-024, 88%)
4. No claim resting on a variable we cannot directly observe (D-022)
5. LLM judgement of quality is suspect — it rewards fluency (D-022)

**Note:** idea #2 (calibration) is currently the only candidate that violates none of these.
Its two quantities — stated confidence and observed correctness — are both directly measured.

---

## D-027 — "Ask Better" passes its kill-tests; first candidate to survive
3 Sep 2026 · Status: **Decided**

**Decision:** Candidate A (CANDIDATES.md, "Ask Better") cleared its kill-tests. Full results
`docs/KILLTEST-RESULTS-3.md`. First of four concepts to pass this gate.

- **KT-1 leak block (killer):** 0 leaks / 80 replies; 0 / 32 direct answer-grabs leaked.
  Decided by a code string-check we control, so the answer is unobtainable by construction.
- **KT-3 typing:** 80/80 = 100% vs constructed labels. The maturity graph is well-founded.
- **KT-2 separability:** transcripts unambiguous (refuse answer-seek / explain concept,
  withhold number); crude keyword proxies undercount and were NOT gamed into a nicer number.

**Deliberately not faked:** the full claim "better questions -> higher solve rate" needs
real learners (D-023). Flagged as required validation with honest n, not simulated.

**Why it survived where three died:** its central claim rests on directly observed events
(did the answer leak: code-checked; what type was the question: code-checked) rather than on
an unobservable (does the child understand) or on the LLM being reliably wrong/ignorant.

---

## D-028 — Build target selected: Ask Better (+ calibration overlay, later)
3 Sep 2026 · Status: **Decided** · Closes the concept search

**Decision:** Build "Ask Better" as the submission. Fold the CANDIDATES.md B calibration
overlay in only after the core ask/refuse/solve loop runs end to end. `src/` may now exist.

**Standing guardrails carried into build:**
- LLM is the language layer only; code owns truth and the leak-check (D-024/026)
- Answer-leak prevention is a code check, never merely a prompt instruction (KT-1)
- Ship honest limitations, incl. solve-rate lift as human-validated with real n (D-012)
- Learner is the visible hero of the demo (D-013)

**Concept search is now closed.** Reopen only if the build surfaces a fatal flaw the
kill-tests missed.

---

## D-029 — Khanmigo overlap confirmed; greenlight (D-028) was premature
3 Sep 2026 · Status: **Decided** · Supersedes D-028

**Decision:** "Ask Better" as specified is too close to Khan Academy's Khanmigo (700k users,
shipping 2 years) to stand as a differentiated submission. The greenlight in D-028 was made
before checking the incumbent and is withdrawn.

**Evidence (sourced):** Khanmigo's documented design is Socratic, refuses to give answers,
redirects "just tell me the answer" with "I want to help you figure this out yourself,"
frames productive struggle as the point, and spent most of its engineering on *not*
answering homework — i.e. our exact core mechanic. Its teacher dashboard already surfaces
struggle and misconceptions, colliding with the review's proposed "point it at the teacher"
pivot too.

**Process failure to remember:** competitor check must come BEFORE greenlight, not after.
Kill-tests proved the thing *works*; they did not ask whether it was *already shipped by the
market leader*. Add "incumbent check" as a gate alongside kill-tests.

**What survives as genuine (thin) differentiation:**
1. Question-quality as the *measured object* — Khanmigo does not do this. But it is a
   feature, not a product (review point #3 stands).
2. **Code-owns-truth architecture** — Khanmigo is documented as unreliable on basic maths
   because the LLM does the arithmetic. Our kill-tests independently proved the LLM is ~88%
   on multi-step maths and must not be the source of truth. This is a REAL technical answer
   to the market leader's REAL published weakness, and it is an AI-engineering story.

**Status:** concept search reopened. Do not rebuild "Ask Better" as-is. The one asset worth
carrying forward is the code-owns-truth principle (D-024) as a *positive* product pillar,
not just a guardrail.

---

## D-030 — Correct the novelty bar; α proceeds as synthesis, not virgin novelty
4 Sep 2026 · Status: **Decided** · Amends D-020, D-029

**Incumbent check on α (done BEFORE greenlight, per D-029):**
- **Correctness-by-code** is how Photomath / Symbolab / Mathway already work (symbolic engine
  computes, LLM explains). Not novel. Sources: toolradar, arsturn neuro-symbolic.
- **Calibration / confidence-before-answer** is established metacognition research with
  existing digital tools (Dunning–Kruger calibration training). Not novel. Sources:
  structural-learning, Springer IJAIED.

**The correction:** "has any part been done before?" is the WRONG bar and it has been killing
concepts unfairly — by that test Photomath, Khanmigo and Duolingo all fail too. This is a
large, well-funded field; virgin novelty is nearly impossible and, per Nerdy's own JD, not
what is valued ("user value over novelty"). Four concepts were partly judged on the wrong
standard.

**The right bar (going forward):** (1) defensibly differentiated, (2) shows engineering
judgment, (3) felt in the 3-minute demo, (4) measurable. Not "nobody has touched any piece."

**α under the right bar — the defensible gap:**
| | Computes correctly | Withholds the answer |
|---|---|---|
| Photomath | yes | **no** (hands it over — PNAS harm) |
| Khanmigo | **no** (LLM computes, documented wrong) | yes |
| **α** | **yes** | **yes** |

α is the synthesis neither leader achieves, plus a measured metacognition outcome
(calibration improvement). This is a strong *judgment* story, not a novelty claim, and it is
honest under scrutiny.

**Decision:** α proceeds to the kill-test gate. Framing in all submission materials is
synthesis + rigor + measurement, never "a new idea." Do not claim novelty of the pillars.

**Rejected:** continuing to hunt for a virgin-novel concept (diminishing returns; day 4 of 15;
the wrong bar).

---

## D-031 — α passes the kill-test gate; GREENLIT to build
4 Sep 2026 · Status: **Decided**

**Decision:** Play α ("correct-by-construction tutor + confidence trap") passes both
kill-tests (`docs/KILLTEST-RESULTS-4.md`) and the incumbent check (D-030). Build starts.
This is the committed direction. `src/` may now be created.

- **KT-C1 demo contrast:** vanilla LLM is grossly, unambiguously wrong on **65%** of
  multi-step percentage/money problems (raw 80%, honestly discounted for rounding/ambiguity).
  Real, dependable, honest side-by-side villain.
- **KT-C2 explanation integrity:** LLM explained method with **0/30 wrong facts** and
  **0/40 answer leaks**. Code-owns-truth / LLM-owns-language architecture holds.

**Locked design facts:**
- Demo domain = **multi-step percentage / money** (that is where the contrast is real).
- Our answer + all correctness checks come from **code** (`Decimal`, exact), never the LLM.
- LLM is language-only: coaches, explains, encourages; never emits a number or the answer.
- Confidence captured per attempt; **calibration** (confident-and-wrong) is the measured
  metacognition object.

**Honest limitations shipped (D-012):** calibration *improvement* and trust/usage effects
need real learners with stated n; factual-integrity check generalised in the eval harness.

**Framing (D-030):** synthesis of what Photomath (correct, gives answers) and Khanmigo
(withholds answers, computes wrong) each get half-right — never pitched as novel pillars.

---

## D-032 — Working name and one-line pitch
4 Sep 2026 · Status: **Open (name), Decided (pitch)**

**Pitch (locked):** "Photomath gives kids the answer. Khanmigo withholds it but gets the
maths wrong. This does neither — always-correct help that never hands over the answer — and
measures whether the child learns to tell what they actually know."

**Name:** TBD. Placeholder in code: `app`. Not a blocker; decide before README/demo.

---

## D-033 — β kill-test passes: disengagement is learnable from real data
4 Sep 2026 · Status: **Decided**

**Decision:** Play β's core ML claim is validated on real student data. Results in
`docs/KILLTEST-RESULTS-5.md`. This is the first concept whose central claim survived contact
with real data rather than needing a simulated learner or a reliably-wrong LLM.

- Trained logistic regression FROM SCRATCH (numpy; no sklearn) on UCI Student Performance
  (1,044 real students), predicting course failure from **behaviour only** (G1/G2/G3
  excluded). Held-out **AUC 0.717 / 0.729**, beats majority baseline, train 17 ms, infer
  <1 µs/student. Learned signals are pedagogically sensible (past failures, going out,
  absences, aspiration).

**Why it matters:** the hard part IS a trained, evaluated model — an ML/data-science artefact
— not a system-prompted chatbot. Answers the standing "where is the AI?" critique.

**Honest gaps carried forward (D-012):** UCI is a proxy (survey→grade, not clickstream/
real-time); "failure" is a disengagement proxy not disengagement; the 2026 bypass-to-AI
signal has no dataset; AUC 0.72 is modest and reported as such. OULAD (clickstream) download
from UCI was truncated at source; obtaining a clean real-time set is an open build task with
UCI #320 as the proven fallback.

**Status:** method validated, NOT yet greenlit as the build. Product shape, a real-time-ish
dataset, and the single demo moment are the next decisions (do not repeat the fall-in-love
pattern; design + incumbent-recheck before commit).

---

## D-034 — Stop optimising novelty; optimise execution. Three finalists.
4 Sep 2026 · Status: **Decided** · Governs selection from here

**Decision:** After five concepts died to the same structural pattern ("provable part is a
commodity; novel part is unbuildable/unprovable solo in 14 days"), stop treating novelty as a
veto. New selection bar: **execution × demo-punch × honest measurement × genuinely helps a
learner**, buildable+polishable in 13 days, on-brief (learner-facing). Novelty is not required
— Nerdy's JD says "user value over novelty," and every incumbent is un-novel too.

Three finalists in `docs/FINALISTS.md`:
1. **Numbo** — correct-by-construction maths buddy (reliable, never gives the answer). Safe.
2. **Rung** — real adaptive-practice engine (finds each child's struggle edge). Best craft+measure.
3. **Sona** — voice-first maths for pre-readers. Highest ceiling, riskiest (child-ASR untested,
   needs a real 5-yo to film).

**Recommendation:** Rung with Numbo's coach-buddy folded in — real model + honest number +
warm learner-facing moment, no rigged benchmark, nothing resting on a failed kill-test.

**This is the final selection round.** After the pick: build and polish only, no more ideation.

**Process note (the meta-lesson):** 4 days spent, 0 build. The novelty veto cost the time.
Recorded so it is not repeated: for a 15-day build, pick fast on
execution+demo and spend the days shipping.

---

## D-035 — COMMIT: Rung + buddy is the build. Selection closed.
4 Sep 2026 · Status: **Decided** · Final selection

**Decision:** Build **Rung + buddy** — adaptive maths practice that targets each child's
productive-struggle edge, with a warm coach that never gives the answer and (by construction)
is never wrong. Learner-facing, on-brief (maths game + adaptive practice), buildable in 13
days. No more concept selection. Next 13 days = build + polish + measure + film.

**The review's valid points, baked into the design (not argued away):**
- Do NOT claim "first/only real adaptive" — DreamBox/ALEKS do real adaptivity. Frame = the
  synthesis (adaptive engine + never-wrong coach) + execution, honestly.
- Do NOT validate circularly. Honest metric = adaptive policy vs a fair baseline (random
  selection) on the SAME engine, reported as "keeps the child in the productive-struggle
  band X% vs Y%" and "estimates the child's level in N items" — never "improves learning"
  (that needs real kids; stated as a limitation).
- The demo's heart is the coach + game feel; the adaptivity is the "smart" beat; the
  two-learners-diverge view is the measurement shot, not the whole demo.

---

## D-036 — Stack: single Next.js/TypeScript app, engine in TS, deploy Vercel
4 Sep 2026 · Status: **Decided**

**Decision:** One self-contained Next.js (TypeScript) app. Adaptive engine + problem
generator in TS (simple maths — Elo/Rasch, ~100 lines). Coach via one server API route,
provider-agnostic OpenAI-compatible client (DeepSeek now, Claude-ready). Free live URL on
Vercel (submission asks for one). One language, one deploy.

**Why not Python engine:** two languages + two deploys is more surface for a solo 13-day
ship. The Python kill-tests already proved the method; the product is self-contained TS.

**Build order (ship daily, riskiest first):** (1) engine + generator + honest eval [today],
(2) coach API + never-give-answer guard, (3) play UI, (4) two-learner measurement view,
(5) polish + film. UI deferred until engine's number is real.

---

## D-037 — Build/critique loop: three rounds of real improvement
4 Sep 2026 · Status: **Decided**

Ran build↔review cycles on the BUILT product until high-end.

**Round 1 — killed the circular metric.** v1 headline ("63% in-band vs 16% random") was
near-definitional (learner + engine shared the 1PL model; random was a strawman). Replaced
with a NON-CIRCULAR eval (`evals/engine_eval2.mjs`, ported live into `/measure`): the
simulated child responds through a misspecified world the engine never assumes (2PL +
guessing + learns over time); baseline is a real fixed curriculum. Metric = "wasted
questions" (bored or frustrated), measured on the true model. Result: **adaptive wastes ~24%
vs 58%**, frustration **2% vs 27%** — a result, not a definition, robust to misspecification.

**Round 2 — answered "thin AI" + "not a game" together.** Added generative theming
(`src/engine/story.mjs`, `/api/story`): the child picks a world (Dragons/Space/Sport/Bakery
— autonomy + curiosity, the under-served SDT needs), and the LLM wraps each problem in a
story. Numbers + answer stay code-owned; a code guard verifies both operands appear and the
answer does not, else falls back to plain. Correctness pillar intact; real generative AI now
does real work.

**Round 3 — gave the session a game arc.** Summit goal (climb 8 rungs), celebration +
confetti + "Keep climbing" to raise the goal, streak fire. Turns an endless quiz into a game
with a win state.

**Verdict:** the AI surface is now a real multi-component system — adaptive engine + LLM
coach (code-guarded) + generative theming (verified) + honest eval harness. That composition
of an unreliable model, made safe and measurable, IS the AI-product-engineering signal.
Scorecard moved: depth 4→7, engagement 3→7, modern-AI 3→7, measurement 5→8.

**Stopping the loop here (D-034 discipline):** remaining items (story prefetch latency, deeper
game, real-child validation) are polish/scope, not fundamentals. Further looping = diminishing
returns. Declared high-end enough to ship and film.

**Residual honest limitations (ship in submission):** themed-story latency ~1.5s (non-blocking —
equation shows instantly); core ability model is Elo (modest but correct); learning gains need
real classrooms; genAI theming is flavour, not deep reasoning.

---

## D-038 — De-generic pass: the maths becomes the game mechanic
4 Sep 2026 · Status: **Decided** · Supersedes the quiz-with-a-skin framing in D-037 R3

**Trigger:** Manpreet's read that the product felt generic. He was right. Stripped of framing,
Rung was adaptive practice + hint chat + a gamified skin — the game and the learning were
*separable* (chocolate-covered broccoli).

**Research that settled it:** *"Prodigy's RPG combat IS math practice — the mechanics and the
learning are inseparable."* And: children form genuine emotional bonds with AI companions that
have **persistent memory**, which is what drives persistence — something Prodigy structurally
cannot do, because its world is hand-authored and forgets you.

**Decision — rebuilt the play experience around three changes:**
1. **Maths is the mechanic.** The child builds a village; every build's cost IS the adaptive
   problem. You cannot build without computing. Not a wrapper.
2. **The world is generative and remembers.** `narrateBuild()` (`/api/narrate`) writes one warm
   line per build that references what they built before; village + name + ability persist in
   localStorage; returning children are greeted by name and told what they built last time.
3. **Agency.** Each turn offers two builds (never already-built ones), each with its own cost.
   The child chooses what their village becomes — autonomy, the SDT need shipped designs
   under-serve 3×.

**Kept intact:** code owns every number (correct by construction), adaptive difficulty,
code-guarded never-leak coach, honest non-circular measurement.

**Why this is the differentiator:** Prodigy's content is fixed and hand-made forever; ours is
generated, personal, and responds to what *this* child did last week. That is only possible
with 2026 AI, and it is exactly the AI-Product-Engineer signal — not a chatbot bolted on.

**Verified live:** choice → build → tile appears → AI narrates referencing the earlier build →
persists across reload → no repeat offers → adaptive ladder climbing.

**Residual (polish, not fundamentals):** emoji tiles rather than rich art; coins accumulate but
aren't spent; no loss-aversion stake; narration latency ~1.5s; learning gains still need a
real classroom.

---

## D-039 — The village is AI-painted, live, and repaints as the child builds
4 Sep 2026 · Status: **Decided**

**Trigger:** Manpreet's read that the visuals were "very basic icons… no good visuals, no
animations" — and his prompt to find free AI tech for the visual layer. Correct on both.

**Decision:** The village hero is a **generative AI painting composed from what the child
actually built**, repainted (async, non-blocking) every time they add something.

- **Tech:** Pollinations image API — **free, no API key, callable straight from the browser**.
  Verified: 896×420 JPEG, first paint ~6.3s, then ~0.5s cached (URL is deterministic).
- **Personal + stable:** the prompt is composed from the child's own build list; the seed is
  fixed per child, so it stays recognisably *their* village as it grows.
- **Craft:** cross-fade between old and new painting (1.4s), slow Ken-Burns drift so the scene
  breathes, tile pop-in, confetti, hover-lift on choice cards, scrim for text legibility.
- **Graceful:** on error it keeps the sky gradient and the emoji roster — nothing breaks.

**Why this is the right AI use (not decoration):** the child's maths decisions literally paint
their world. It gives a real reason to build the next thing, it is impossible for a
hand-authored competitor (Prodigy's art is fixed forever), and it costs nothing and needs no
key — so it survives as a live demo and a deployed link.

**Verified live:** built bridge + cottage → painting rendered → narration referenced the
earlier bridge → coins 114 → survives reload.

**Honest limitation:** the painting is impressionistic — it evokes the village rather than
depicting each build exactly. Stated as flavour, never claimed as a literal render.

---

## D-040 — Generative-image village REMOVED after it failed testing. Scene is drawn in code.
4 Sep 2026 · Status: **Decided** · Reverses D-039

**What happened:** D-039 shipped an AI-generated painting of the village. I verified only that
an image *loaded* — never that it was *correct or different*. Manpreet caught it: "it's showing
repainting but it's the exact same image." He was right.

**Then I actually tested it** (4 prompts, 1→5 buildings, fixed seed):
- **Buildings did not appear.** 1-building image had a bridge; the 3-building image had **no
  bridge at all**. The painting did not depict what the child built.
- **Visually near-identical.** Fixed seed locked the composition — same tree, same river, same
  mountains every time. Byte hashes differed; the picture didn't.
- **Long prompts failed outright.** The 5-building request returned a **1,346-byte error
  placeholder** — i.e. it broke exactly as the village got interesting.
- Plus ~6s latency for a generic stock landscape.

**Decision:** feature deleted. The village is now **drawn in code** (`src/public/village.mjs`):
a composed SVG scene that renders the child's actual buildings at fixed slots — stone bridge,
cottage with chimney smoke, orchard, fountain with jets, barn, watchtower, lantern row, boat,
turning big wheel, castle. Parallax hills, drifting clouds, shimmering river, and a sky that
progresses morning → gold → dusk → starlight as the village grows.

**Why this is the correct engineering call, not a retreat:** it is the project's own rule,
applied to pixels — *the model is used where it is reliable (language: coaching, narration),
code is used where it must be right (truth, difficulty, and now the world)*. Forcing AI into
the visual layer where it measurably underperformed was the mistake.

**Verified properly this time:** 0 JS errors; SVG grows 2,106 → 11,979 chars across 5 builds;
`.bld` groups 0→5 matching the child's choices; empty state renders a bright morning meadow,
5-build state renders a dusk village with stars. Instant, offline, never fails.

**Process lesson (repeat of the D-029 mistake, in a new costume):** "it loaded" is not "it
works." Verify the *output*, not the *mechanism*.

---

## D-041 — Real isometric game art replaces hand-drawn SVG
4 Sep 2026 · Status: **Decided** · Supersedes the SVG scene in D-040

**Trigger:** Manpreet: "does this look professional, or like an immature school project?"
Correct — hand-rolled flat SVG shapes read as a student project. Real products do not
hand-draw their art; they use an asset pipeline.

**Decision:** the village is now a true isometric scene built from **Kenney CC0 game art**
(*Isometric Landscape* ground tiles + *Isometric Miniature Farm* structures) — the same
public-domain packs used in shipped indie games.

**The world is a farm/homestead**, not a mixed fantasy village, because that is what the
art supports. Designing to your assets is what a studio does; forcing castles and fountains
out of a barn pack is what a student does.

**Engineering that made it work (each found by measurement, not assumption):**
- **Projection:** tiles are 132×83 with a 132×66 diamond → `x=(c-r)·66, y=(c+r)·33`. Verified
  by rendering a grid and checking tessellation.
- **Ground tile:** found by *pixel analysis* (scan each tile's top face for uniform green)
  rather than eyeballing 128 thumbnails → tile 015 is seamless flat grass.
- **Sprite anchoring:** art occupies varying regions of a 256×512 canvas with different
  footprints, so sprites are anchored by the **bottom-centre of their measured opaque
  bounding box** (baked into the module from PIL measurements), not the canvas.
- **Roof offset:** swept dy ∈ {0,−60,−120,−180,−235,−300} and inspected → **−120** seats the
  roof on the wall with the door visible.
- **Z-order bug:** front ground tiles were painting over rear buildings. Ground now occupies
  a low z-band and buildings a high one, depth-sorted among themselves.
- **Content-fit:** the scene scales to the *actual painted bounds* of the content, with
  headroom reserved for the header overlay.

**Verified:** 8 builds, 13 sprites, **0 broken images, 0 JS errors**; village persists across
reload and the buddy greets the returning child by name.

**Repo hygiene:** trimmed unused art — 41 sprites and 127 tiles deleted; assets now **361 KB**
total. Credits in `docs/CREDITS.md` and in the app footer (CC0 needs no attribution;
crediting is professional practice).

---

## D-042 — UI art direction: no emoji beside rendered art; type and palette from the artwork
4 Sep 2026 · Status: **Decided**

**Trigger:** "still not looking professional." Three specific causes, all real:

1. **Emoji standing in for game art.** Choice cards and the built-roster used 🪵🌽🏠 next to
   professionally rendered 3D isometric sprites. Mixing the two is the single loudest
   amateur signal in the whole UI.
2. **Default system typography.** No display face, so the product had no voice.
3. **A palette unrelated to the art.** Purple/lavender UI wrapped around wood-and-grass
   artwork, and the island floated in an empty void with no grounding.

**Fixes:**
- **`buildPreview()` in `village.mjs`** renders a real stacked sprite preview using the same
  measured art bounds as the world — so a choice card shows *exactly* what will be built.
  **Every emoji is gone from the UI** (kept only as chat/particle flavour, never as art).
- The emoji roster is deleted outright: the village already shows what was built, so it is
  now a simple "N built" chip.
- **Typography:** Fredoka (display) + Nunito (body).
- **Palette derived from the artwork** — timber `#a9702f`, grass `#5f9e46`, parchment
  `#efe3cd`, sky — replacing the arbitrary purple. Buttons got a wooden press-depth.
- **The island is grounded:** sky gradient, inner vignette, and a soft blurred ground shadow
  so it sits in a world instead of floating.
- **Choice cards are a 2-column grid**, not fixed-width flex — they were wrapping to one
  column at 412px (choices block 427px tall → now 208px).

**Verified:** 0 JS errors, 0 broken sprite previews, Fredoka loading, cards side-by-side,
empty state and 5-build state both clean.

**Note:** a white band sometimes appears in captures while scrolling — confirmed a
screenshot paint artifact, not a CSS bug (`elementFromPoint` returns the sprite underneath).

---

## D-043 — STOP. The current build is extrinsically integrated. Redesign from the learner research.
4 Sep 2026 · Status: **Decided** · Governs everything after it

**Trigger:** Manpreet: "game-wise it's okay, but is it actually interactive and meaningful for a
learner of that age? The placement and visuals don't make sense. No story line, nothing. Stop.
Go back to the research on the psychology of these learners." He was right, and the research
says why with precision.

**Method:** five research passes (attention/cognitive load; motivation;
narrative; game design for learning gains; retention & ethics) → one synthesis →
two load-bearing citations independently spot-checked afterwards. Full evidence base:
`docs/RESEARCH-LEARNER.md`.

**The diagnosis, in evidence terms (one failure, four masks):**
- *"Not interactive"* — the arithmetic is a **tollgate** in front of the build, not the build
  itself. That is *extrinsic* integration, the exact configuration Habgood & Ainsworth show
  produces engagement without learning. **Single largest defect.**
- *"Placement makes no sense"* — number, cost and object are separated: the **split-attention
  effect** taxing a 3–4 item working memory. Plus unsignalled affordances.
- *"Visuals don't make sense"* — decorative celebration animation is **seductive detail**;
  the harm is diversion, worst for the weakest learners.
- *"No storyline"* — right symptom, wrong cure. The only direct RCT (Sýkora 2021, N=95, maths
  game, kids, 2 weeks) found cutscene narrative changed **nothing** on five outcomes. What's
  missing is **meaning for the numbers** — a situation where the village's need IS the problem.

**Decisions:**
1. **Core loop becomes build-is-the-problem.** The child assembles the quantity in the world
   (place 4 logs per beam × 3 beams); the manipulation and the arithmetic are one action. A wrong
   quantity builds a visibly wrong structure, fixable — not a red X. (Strong: Habgood & Ainsworth.)
2. **The village is a readout of mastered skills, not coins spent.** (Strong: Lepper 1973;
   gamification meta-analysis shows badges barely move competence.)
3. **No bracketing story, no cutscenes, no intro plot.** Write situations, not plots.
   (Strong: Sýkora null RCT; Cordova & Lepper / Adair positive only when story = the problem.)
4. **Cut seductive detail** — celebration confetti, decorative animation, any label separated
   from its object. (Strong: Rey et al. 2021, split-attention.)
5. **No loss-framed streaks, timers, auto-advance, leaderboards, cosmetic skins.**
   (Strong on direction; also Children's Code exposure.)
6. **Adaptive floor, learner-chosen ceiling** — system proposes at mastery pace, child picks
   which building, harder always allowed, never silently easier. (Moderate — one tie study.)
7. **Buddy = Tutor CoPilot, never a chatbot.** Never states an answer; hint tiers; fires
   before frustration; may express pride in the child's work, **never** sadness or need. Age/
   safety context re-injected every turn (KIDBench: safety degrades 6–24% over turns).
8. **Two pacing tiers (7–8 vs 10–11)** per the age-9 attentional reorganisation. Never cite a
   minute-count — none is evidence-based.
9. **Parent-facing mastery view.** Parents, not children, control return.
10. **Measurement is the deliverable:** off-game near-transfer test + delayed retest; A/B
    tollgate vs build-is-the-problem (a modern Habgood replication — the headline number);
    disengagement proxies; hint-tier escalation rate.

**What this supersedes:** the confetti/celebration layer (D-037 R3), the tollgate cost modal,
the emoji-then-sprite decoration debate as a *primary* concern (D-042 stands, but visuals were
never the root cause). The isometric art pipeline (D-041) is retained — the art was fine; the
*learning design* was wrong.

**Honest limits carried forward:** seductive-detail and split-attention evidence is largely
from older learners (extrapolated); every retention number in the field is vendor-sourced; the
village-as-mastery return bet is reasoned, not proven; all of Rung's own effect claims need
Rung's own measurement.

**Process lesson (the real one):** I built mechanics, then art, then polish — and only then
asked who the learner is. The research took one afternoon and would have prevented three days
of rework. Learner model first, always.


---

## D-044 — Concept v3: "the plot is the problem". The build IS the maths; the error persists.
4 Sep 2026 · Status: **Decided** · Supersedes D-009/D-031 (concept), D-037 R3, D-038 core loop

**Pipeline:** five learner-research passes -> synthesis (RESEARCH-LEARNER.md) -> AI-architecture
review (AI-ARCHITECTURE.md) + market landscape (MARKET.md) -> innovation synthesis
(CONCEPT-V3.md). Two load-bearing citations independently spot-checked.

**Decision:** build CONCEPT-V3 concept 1. Concept 2 (parent CoPilot screen) is a bounded stretch
only if days 1-11 land clean. Concept 3 is a level type, not a product. Concept 4 is rejected -
no evidence for learning-by-teaching in our base, and a buddy that needs the child crosses the
parasocial line (RESEARCH-LEARNER 3d).

**The mechanic:** the child makes the quantity in the world (drags 4 planks x 3 sections). No
answer box, no submit. A miscount builds a visibly wrong structure that persists until repaired -
"error persistence", the one thing no product in MARKET.md has. The farm is a readout of mastered
skills. The buddy phrases a code-chosen hint tier at a 7-year-old reading level and is **never
given the target** - it cannot leak what it does not hold. The child never types.

**Why this and not the others:** it is the only concept standing on P1 (Habgood & Ainsworth - the
sole controlled *learning* gain at equal time-on-task in exactly this age band); its differentiator
is a 20-second visual, not an architecture claim taken on faith; and it is the cheapest build (it
deletes the modal and reuses art, renderer, Elo and harness).

**Scope narrowed honestly:** build-is-the-problem tops out around ~30 objects. This is a Year 2-4
grouping / multiplication / division tool, not a general arithmetic tutor. `generateProblem` must
be re-scoped from 2-digit x 2-digit to buildable quantities. Say this out loud in the submission.

**Headline metric:** near-transfer post-test, integrated vs tollgate arm at equal time-on-task -
reported as a pilot with raw per-child scores, no p-value. Leak rate (0/60 fixtures) is the number
that is not underpowered.

**Demo beat:** the sheep walks out through the gap in the short fence. No red X in the video.

**Pre-attacks answered in-doc:** "Zombie Division with an LLM" (credited; ours is the structural
never-answers + published leak rate); "n=3 is noise" (agreed; pilot, not proof).

**Kill conditions:** drag too fiddly (tap-to-place fallback from day 2, pilot by day 12); null
transfer result (report it plainly); classifier ambiguity (ask, don't guess).

**Plan:** 1-4 placement + wrong-structure render · 5-6 classifier table + answer-blind coach ·
7 mastery skyline · 8 tollgate A/B arm · 9 transfer checkpoint · 10 harness + judge · 11 parent
view · 12 pilot with real children · 13 film · 14 buffer.


---

## D-045 — Review loop converged: CONCEPT-V3.2 adopted. Build authorised pending the go decision.
4 Sep 2026 · Status: **Decided** · Supersedes D-044 (v3 → v3.2)

**Loop:** Review R1 (NOT SATISFIED: 2 fatal, 6 serious, 5 minor) → Revision v3.1 → Review R2
(NOT SATISFIED but close: 7/13 closed, 9 new) → Revision v3.2 → Review R3 **SATISFIED subject to
a patch list, all 13 patches applied and verified**. Three rounds, as capped. Records:
REVIEW-R1/R2/R3.md, CONCEPT-V3.1/V3.2.md.

**Evidence produced during the loop (measured, not asserted):**
- ART-FEASIBILITY — no sheep in any CC0 pack (goat, chicken, cow, pig now in repo); the "broken
  fence" sprite fails legibility at 320px; a MISSING section and `planksHole` pass.
- REDTEAM-RESULTS — the "answer-blind" claim was FALSE in v3 (target in the prompt, factored).
  v3.2's redacted payload was attacked by a different-family model, forced-choice, 60 fixtures:
  a real leak (`"a couple"` bucket identified groups==2) was found and closed; the 1-in-12 floor
  was wrong (majority baseline ~48%); final: 40.0% vs 48.3% baseline, shape below floor. PASS.
- READINGLEVEL-RESULTS — 5 of 6 original templates contained "one", which the product's OWN
  zero-number-word gate rejects. Rewrites in `data/hints_v2.txt`: 0 number words, Dolch∪Fry+domain
  99%, one residual word (*past*). Wordlist is NAMED (Dolch 315 ∪ Fry 300, both public domain) at
  `data/wordlist.txt`. Build-time assert added (`readinglevel.py --assert`).
- V3.2-ARITHMETIC-CHECK — caught v3.2 mis-listing 4×5 as non-colliding (it collides); design
  unaffected (diagnostic node 4×3 is clean).

**What v3.2 is (final):** the child makes the quantity in the world — finite cart, tap-to-place;
packs ordered ONCE with no top-up (forces the multiplicative commitment); a miscount builds a
visibly wrong structure that persists in both directions; the goat walks through the gap; the
farm is a readout of mastered skills. Buddy: code classifies the misconception from the
time-stamped placement sequence (no timing heuristics), the model only phrases a template with a
payload containing NO integers, behind a lexical gate that protects the target total (not the next
action — said honestly). Diagnostic node 4×3. 12-node mastery graph; Elo engine FROZEN as the
control arm, not deleted. Measurement: within-child pre→post→48h, /6 trained + /2 pre-registered
control items, falsification line pre-committed, n=3 case studies, COI and unblinding said aloud.

**Residual risks logged (v3.2 §10, 1–10):** packs at 7 unevidenced; goat over iso is a style
compromise; n=3 supports no inference; red-team may worsen on rebalanced shapes (day-8 rerun);
height cue unproven until the day-1 test; templates subordinate to the wordlist; graph has no
baseline; 3 of 6 shapes collide on one pair; all test items are near-transfer (null likely);
leftover-plank cue spoken aloud.

**Scope, said plainly:** a Year 2–4 grouping / multiplication / division tool. Not a general
arithmetic tutor.

**Next:** tech-stack review (`docs/TECH-STACK.md`, in progress) → go decision → build
per CONCEPT-V3.2 §8. The review's day-1 warning stands: `mountScene` + `appendPlank` + delegated
listener are unstarted; move them explicitly or cut the day-10 buffer.


---

## D-046 — Tech stack adopted (TECH-STACK.md). Zero new runtime dependencies.
4 Sep 2026 · Status: **Decided**

**Stack (stack review; model/pricing claims verified against vendor docs):**
- **AI:** `claude-haiku-4-5-20251001` for hint phrasing only — structured outputs GA
  (`output_config.format`, strict), ~$0.0007/hint, ≤2 sentences enforced in code (wire does not
  enforce maxLength). Do NOT send `effort` (unsupported on Haiku 4.5); do not enable thinking.
  Prompt rebuilt per request (KIDBench). Prefetch on the wrong-part `place` event, abort on `remove`.
- **Judge/attacker:** a different family — DeepSeek via OpenAI-compatible API (only key available).
  Repin to `deepseek-v4-flash` as day-1 hygiene; `deepseek-chat` still worked today (3 runs).
- **Classifier + 12-node mastery graph: pure code**, no I/O, importable under `node` so the 60
  fixtures are a real eval.
- **Not used, by decision:** voice, vision, RAG, agents, fine-tuning, local models.
- **Visuals:** DOM `<img>` sprites (keep `village.mjs` approach); Kenney CC0 farm + landscape +
  animals; one throwaway Pillow compositor `scripts/make_parts.py` run once, outputs committed;
  CSS-only animation; no particles/confetti/sound.
- **Frontend:** vanilla ES modules + static HTML, no framework; `data-part` + one delegated
  listener; `touch-action: manipulation`; one localStorage key `rung.v1`, local-only, try/catch.
- **Backend:** keep zero-dependency `server.mjs`; add static `/build.html`, `/fence.mjs`,
  `/buddy.mjs` (isomorphic — templates/payload/gate run in the browser) and `POST /api/buddy`
  (server-only, holds the key, re-validates enum + tier at the trust boundary). No integer
  crosses the wire. Offline fallback: 1.2 s timeout → template.
- **Evals:** `python evals/run_all.py` — one command, one PASS/FAIL table; asserts template
  equality between `data/hints_v2.txt` and `buddy.mjs` TEMPLATES. No package.json, no npm.
- **Deploy:** Render free Node service, unmodified server, one env var. Cold start ~60 s —
  warm before judging or pay the always-on tier for the fortnight [price UNVERIFIED].

**Corrections to CONCEPT-V3.2 §6 from the stack review:** `buddy.mjs` must be isomorphic and
needs BOTH a static route and `POST /api/buddy`; `data/hints_v2.txt`: `past` → `over` closes the
last out-of-list word.

**Build budget:** ≈ 28.75 h across days 1–8 (~4 h/day) — slack absorbs day 3 (packs).

**Day-1 verification list:** repin attacker model (curl); verify strict JSON on a real Haiku key
without `effort`; confirm Render always-on price; write `classify()` before any DOM.


---

## D-047 — Pack size must divide the part size; the finite cart changes what misconceptions look like
6 Sep 2026 · Status: **Decided** (found while writing `classify()`, day 1 of build)

**What.** Two arithmetic facts in CONCEPT-V3.2 do not survive its own rules:
1. *"4×3, packs of 6"* — a pack is indivisible at the point of use, so a pack of 6 can never fill a
   part of 3 without overflowing. The level would be unsolvable. **Rule now: pack size = the largest
   proper divisor of `per`, else `per` itself.** Only 3×4 gets a pack that is not a whole part
   (packs of 2). Everywhere else a pack *is* one part, and the ordering decision is "how many parts".
2. *"[2,2,2,2] versus [4,4,4,4] on 4×3"* — the cart holds exactly 12 planks, so [4,4,4,4] (16) is
   unreachable. `counted_groups_as_group_size` on 4×3 appears as **[4,4,4,0]**: the cart runs dry
   before the last part. The two fences are still completely different, so the diagnostic node stands.

**Also decided in code:** `[12,0,0]` and `[6,6,0]` are `right_total_wrong_grouping` (all the wood
used, whole parts bare); `[5,4,3]` is `over_count` (a plank over a post, no part bare). In packs
mode, ordering a pack per plank is `pack_unit_confusion` **even when the fence comes out right** —
the order is the multiplicative act the mode exists to observe, and the surplus sits in the cart.

**Why it matters.** The packs progression was already flagged UNEVIDENCED and first-to-cut. Point 1
narrows it further: the "pack ≠ part" beat exists on one shape. If day 3 slips, packs go, and §2's
multiplicative claim is withdrawn as planned. Evidence: `evals/classifier_eval.mjs` — 67 fixtures,
100% right when committed, 12 silent (`ambiguous`/`in_progress`/unconfirmed), 0 mismatches.

**Rejected.** Letting a pack spill into the next part (hides the over-count state); infinite cart
(destroys the leftover-plank cue NEW-1 relies on); shrinking shapes to make 6-packs fit (would
change the red-team fixtures whose numbers are already published).

---

## D-048 — Fence art: a part is posts + N rails; the post height encodes the part size
6 Sep 2026 · Status: **Decided**

Kenney's `fenceHigh_E.png` cut into two sprites (`assets/fence/post.png`, `rail.png`) by
`scripts/make_parts.py`; rails stack bottom-up at Kenney's own 24 px pitch; the post is stretched
to `65 + 24·(per−1)` so a full part fills its posts and a short part shows bare post above the last
rail. The "height difference" cue therefore **is** the absent-top-rail cue the art probe proved,
not a separate bet — CONCEPT §2's rail-less fallback is moot. Rendered at 320 px (`[4,4,3]`,
`[3,3,3]`, `[4,4,4]`, `4×5 [5,5,5,4]`, `[4,0,0]`): the missing top rail is visible; a naive-viewer
<2 s check still needs a human who has not seen the fence before — **owner: Manpreet, before day 2
ends**. Over-count rail: same sprite, rotated −12°, drop shadow, above the post (CSS, no new art).

---

## D-049 — Schedule re-baselined: build starts 6 Sep, 12 days to deadline
6 Sep 2026 · Status: **Decided**

CONCEPT §8 assumed a 4 Sep start. Two days went to the review loop and the stack review, which
produced the evidence that made the plan defensible, so this is not a slip to hide. Re-baseline:
days 1–8 of §8 compress to 6–12 Sep (day 3 packs and day 10 buffer are the cuts if needed), pilot
**Sun 13 Sep**, 48 h retests **Tue 15 Sep**, film **Wed 16 Sep**, edit + README **Thu 17 Sep**,
submit **Fri 18 Sep**. Day-1 (6 Sep) done: `control-arm-frozen` tag on the initial commit;
`classify()` + 67 fixtures + eval; post/rail sprites + compositor; `mountScene`/`appendPlank`/
`removePlank`/`onTap`; `/build` test page; `past→over` (hints now 100% in-list, 0 residual words);
attacker repinned to `deepseek-v4-flash` (verified live). **Blocked:** Haiku strict-JSON check —
no `ANTHROPIC_API_KEY` exists on this machine; needed before day 7 (`buddy.mjs` live call).


## D-060 — Hint templates: 8 ids × 3 tiers in one tab-separated file, gate-checked line by line
6 Sep 2026 · Status: **Decided**

**What.** `data/hints_v2.txt` is now `id<TAB>tier<TAB>text`, 24 lines, every id in `IDS` including
`right_total_wrong_grouping` and `ambiguous`. Tier 1 points ("That part of the fence is short"),
tier 2 points harder (where to look: the top of the post), tier 3 walks her to the exact spot
("Find the part that is not as tall… Put a plank from the cart on that part") — still no count,
no number word, ≤2 sentences, child nouns only (part/plank/pack/post/cart/fence). The six existing
tier-1 texts are verbatim; over_count says *over* the post. `evals/readinglevel.py --assert`
checks every line for ≤2 sentences, zero digits, none of 25 number words, ≤2 out-of-list words.
Result: 24/24 pass, 0 out-of-list words, Dolch∪Fry 82%, +domain 100% (READINGLEVEL-RESULTS).
**Why.** The gate's fallback is the template, so a template that fails the gate would fall back to
itself — the assert closes that loop at build time for all 24, not 6. **Rejected.** Generating
tiers 2–3 with the model at runtime (no offline path, no build-time check); a JSON file (one more
format for a 24-line table; TSV is grep-able and diff-able).

## D-061 — Payload is rebuilt server-side from `{id, tier, shape}`; two new booleans; `mode` dropped
6 Sep 2026 · Status: **Decided**

**What.** The browser posts `payload(result)` (CONCEPT §3) but `/api/buddy` keeps only
`misconception_id`, `tier`, `shape`, validates each (enum, {1,2,3}, five known keys, values
`"some"`/boolean, no digit anywhere in `shape`, no unknown top-level key, ≤4 KB) and rebuilds the
payload through `redact()` — client `template`/`nouns`/`constraint` text is never forwarded to the
model. `shape` gains `has_over` and `has_empty` (the facts the tier-2/3 templates for over_count and
right_total_wrong_grouping rest on). `mode` (concrete/packs) is not sent: the pack template already
carries the word, and one less field is one less bit for an attacker. `per` is parsed from the node
name (`"4x3_concrete"` → 3) to derive the booleans, so `buddy.mjs` does not import `fence.mjs`.
The only fields that may contain a digit are `age`, `tier` and the fixed `reading_level` string;
`buddy_test.mjs` asserts this over all 67 fixtures. **Why.** The trust boundary is the one place
laziness does not apply (TECH-STACK §4); validating the client's template text against ours would
be the same lines with a weaker guarantee. **Rejected.** Trusting the client body (a modified page
could hand the model a template with the answer in it — the gate catches digits, not a semantic
leak); sending `counts` and redacting server-side (integers would cross the wire; CONCEPT §3
forbids it).

## D-062 — The gate's word lists are fixed literals, identical in Python and JS
6 Sep 2026 · Status: **Decided**

**What.** 25 number words — zero…twelve, fifteen, twenty, hundred, dozen, half, twice, once,
single, pair, couple, both, double — as one literal in `buddy.mjs` (`NUMBER_WORDS`) and
`evals/readinglevel.py`, with an `assert len == 25` on the Python side. Banned affect: `sad`,
`disappointed`, `miss you`, plus `wrong` and `bad`. Out-of-list ≤2 against Dolch∪Fry∪DOMAIN with the
same `-s/-es/-ing/-ed` stripping in both languages. `gate()` returns the first failing stage by name
(`sentences`/`number`/`affect`/`vocab`) so the eval can show *why* a model hint fell back.
**Why.** Two implementations of one rule drift silently; a fixed literal and a matching count is
the cheapest lock. **Rejected.** Generating one list from the other at build time (a build step
for 25 words); a shared JSON file (one more file, two more loaders).

## D-063 — Red-team attacker `deepseek-v4-flash` runs with thinking disabled; unparsed replies are reported, never scored
6 Sep 2026 · Status: **Decided**

**What.** `deepseek-v4-flash` is a reasoning model. With thinking on it never reached `content`:
at `max_tokens` 400, 2000 and 8000 it returned `finish_reason: length` with 8K–32K characters of
`reasoning_content` and an empty answer — a forced choice with no information is an endless
deliberation. The harness had scored those as misses: 0/60, which would have read as a spectacular
PASS. Fixed two ways: the request sends `thinking: {type: "disabled"}` (34 completion tokens,
valid JSON, `max_tokens` stays 400), and the run prints `unparsed replies: k/n` with verdict
**INVALID** (not PASS) whenever k > 0. The harness now builds every fixture's payload by calling the
shipped `payload()` in `src/engine/buddy.mjs` through one `node` subprocess (asserting no digit
outside age/tier/reading_level before spending a cent), samples all 8 ids × tiers 1–3, and reports
lift against the majority-class baseline computed on the fixtures. **Why.** A leak eval whose
attacker cannot answer measures nothing; a below-chance number is a smell, not a result. Turning
reasoning off also keeps the attacker comparable with the UPDATE 1–3 runs (`deepseek-chat`,
non-reasoning). **Rejected.** A bigger token budget (tried: 2000 and 8000, still truncated);
replicating the payload in Python (the number would be about a copy); silently dropping unparsed
fixtures from the denominator.


---

## D-064 — `idle_off_task` fires only from the idle timer, never from a deliberate Done
6 Sep 2026 · Status: **Decided** (QA D-3, docs/TEST-REPORT.md)

CONCEPT §4 read "final gap >30 s with no commit → idle_off_task". The classifier had applied the 30 s
gap to explicit commits too, so a child (or a presenter) who looked at the fence for half a minute and
then tapped Done got silence. A Done tap is her answer regardless of how long she took; only the 45 s
idle timer's own commit is disengagement. Fixture updated; 68 fixtures, 0 mismatches.
**Rejected:** keeping the gap rule and scripting the demo tap inside 30 s — a demo-only workaround
for a real product defect.

## D-065 — QA fixes that change behaviour: cart tap while holding is a no-op; "Order again" stays in the level; twelve fences end calmly
6 Sep 2026 · Status: **Decided** (QA D-1, D-2, D-4, D-8, D-9, docs/TEST-REPORT.md). No D-050 exists in this log — the numbering
jumps D-049 → D-060 — so the cart decision the principal asked to file "under D-050" lives here.

**Cart (QA D-4).** A cart tap while already holding does nothing; the hand stays held. The old toggle
made the spec's own rhythm ("tap the cart, tap the part") drop every second plank. Consequence: a held
plank can only leave the hand by being placed — so **Done opens the hand** (`onCommit` clears `held`),
otherwise the demo beat "Done → tap a full part → pips" would place a fifth plank instead of counting.
Rejected: keeping the toggle and relying on the "In hand" label (QA showed hands-only filming misfires).

**Order again (QA D-9).** Appends `order_reset` instead of a new `level_start`. `level()` (fence.mjs,
pure, used by both pages) hands classify() the events since the reset plus the earlier hints, so the
tier escalates (verified: 12 packs → t1, Order again, 3 packs → t2) and the parent screen reads the
level the same way. Part 1 is untouched; `tally()` never sees the pre-reset order or rails. Rejected:
synthetic `remove`/negative `order` events to zero Part 1's state (pollutes the log the evals read).

**Twelve fences (QA D-2).** `next()` → null now shows a finished fence, "Every plot has a fence." and
a Start again button; mastery is wiped only when that button is tapped, never on reload or advance,
because the parent screen is built from it.

**Also.** Reduced motion: pips are static (`animation:none`), all shown at once, removed by code after
1.2 s (QA D-1). Reload restores the goat in the gap after any commit and re-says the last hint unless
a place/remove had already hidden it (QA D-8). "For grown-ups" link 44 px (QA D-7).


---

## D-066 — Product-review fixes: scenery never eats a tap; count outranks remove; control arm off by default
6 Sep 2026 · Status: **Decided** (docs/PRODUCT-REVIEW.md, SEV1/SEV2 items)

1. **Real taps could not reach two of three parts.** The transparent corn and goat images sat over
   the hit regions. Both QA and the frontend pass drove the page by dispatching clicks from script,
   which bypasses hit-testing — so the defect survived two verifications. Fix: `pointer-events:none`
   on every scenery image; only rails and hit regions are targets. Verification is now done with
   real coordinate taps and an `elementFromPoint` sweep, never `.click()`.
2. **Count vs remove.** An empty-hand tap on a rail used to remove it, so "count a full part" could
   dismantle the correct part. Now an empty-hand tap **counts** the part. A plank leaves only when
   the tapped rail is the one sticking out over the post, or when the same part is tapped again
   while the pips are still up. `remove` events are unchanged for the classifier.
3. **Control arm routes off by default.** `/api/coach|narrate|story` (the frozen build's model
   calls) are mounted only with `CONTROL_ARM=1`, and their bodies are capped at 4 KB. The shipping
   server exposes one model endpoint, `/api/buddy`.
4. Timeouts: server-side phrase 800 ms inside the client's 1500 ms, so the server answers with a
   template before the browser gives up. Bubble carries `role="status"`.
5. Local tooling config untracked; the eval that hard-coded a temp path now takes it as an argument;
   `evals/requirements.txt` lists the eval-only Python packages (the app itself has none).


---

## D-067 — The hint provider follows the key; live path measured on DeepSeek
6 Sep 2026 · Status: **Decided**

**What.** `phrase()` gains a provider table: Anthropic (`claude-haiku-4-5-20251001`, strict JSON
schema) when `ANTHROPIC_API_KEY` is set, else DeepSeek (`deepseek-v4-flash`, thinking disabled, JSON
mode) with `DEEPSEEK_API_KEY`. Same redacted payload, same ordered gate, same template fallback.

**Why.** No Anthropic key exists on this machine, so the live path had never run. The "different
family for attacker and coach" argument in TECH-STACK §1.2 does not apply here: the red-team attacks
the payload the coach *receives*, not the coach's output, so the coach's vendor is irrelevant to that
result. Measured on 20 live hints (`docs/LATENCY-RESULTS.md`): p50 757 ms, p95 1,382 ms, $0.000154
per hint, gate pass 80%, all four rejections the word *one*. The gate is the safety claim, not the
vendor, and this run is the first live evidence of it working.

**Consequences.** Server timeout 800 → 2,000 ms inside a 2,500 ms client timeout (the 800 ms figure
was a Haiku guess that the measured median would have broken). Prefetch keeps both invisible to the
child. Residual: the attacker family and the coach family are now the same; published as such.

**Rejected.** Waiting for an Anthropic key (unmeasured headline numbers for the whole submission);
DeepSeek-only (throws away the strict-schema path that is already written and unit-tested).


---

## D-068 — Output-side red-team added; ordinals join the gate
6 Sep 2026 · Status: **Decided**

With a live coach (D-067) the red-team can attack what the child sees, not only what the coach
receives. `evals/redteam_leak.py --output` has the shipped `phrase()` write 60 gated hints, then shows
the attacker the hint text alone. Result (REDTEAM-RESULTS UPDATE 5): total recovery 28.3% vs 31.7%
baseline overall; 37.2% vs 41.9% on model-written hints; the attacker's constant guess of 12
explains every hit but two. PASS on both sides of the gate.

Preventive: no model hint used an ordinal, but *"the third part"* would leak the group count and
the gate did not stop it. `second`…`twelfth` are now number words in both gate implementations
(36 words, identity asserted). *first* stays allowed: it is in the templates and names a position,
not a count. **Rejected:** blocking *first* too — it would fail four shipped templates for no gain.

---

## D-069 — The scene is a farm, the child builds the side facing her; the interface is wood and paper
6 Sep 2026 · Status: **Decided** (owner's verdict on the previous screen: "it looks bad, the orientation is off,
unprofessional, like a school project")

**What.**
1. **The buildable fence is the paddock's front-right edge** (from the bottom vertex to the right vertex of
   the front column, rising to the right at the iso slope), one part per tile, same post/rail sprites and
   the same rail geometry as D-048 (24 px pitch, post height encodes `per`, over-count rail tilted above the
   post). The goat rests OUTSIDE that edge, nearest the camera, and walks in through the gap, away from the
   camera. `feet()`/`goatFeet()` in `fence.mjs` Part 2 changed; `goatWalk`'s contract (in through the first
   short/empty part, back out when correct), `onTap`, `data-part` and the hit-region polygon are unchanged.
   Part 1 (the classifier) is byte-identical.
2. **The paddock is enclosed**: three finished sides use Kenney's `fenceHigh_E` as-is where the edge rises to
   the right (back-left) and the same sprite mirrored with `transform:scaleX(-1)` where it falls to the right
   (back-right, front-left). Seated by the measured post feet in the source: low post (6,449), high post
   (127,388) — one tile edge at the existing `K`. Interior: `dirtFarmland` under `cornDouble` at the back and
   `cornYoungDouble` in the front column, so the buildable side stays legible against low plants.
3. **Full-bleed ground, one element.** The Kenney grass tile (`landscapeTiles_015`) is a flat green *slope*
   block (top face is not a diamond, measured), so it is not tiled any more. The ground is one `div` in the
   tile's green with the iso seam lattice drawn as the two diagonals of a 132×66 repeating CSS tile, seated on
   a lattice vertex by `background-position` so the seams meet the paddock edges. Sky in the stage
   background, a world-space translucent haze at the horizon, vignette and a darker bottom edge as overlays.
4. **Camera.** bbox still pinned from the finished fence + paddock + goat rest spots (never re-zooms on
   placement); the fit now takes ≤70 % of the scene height and seats the world so the horizon sits about a
   third of the way down when width-limited (phone), or as high as needed to keep the front on screen.
5. **Depth.** Elliptical CSS-gradient shadows under each buildable post, the goat (inside its wrapper, so it
   walks with it), barn, hay and sack. z bands: ground 0 · haze 1 · dirt 10+ · shadows 20 · back fences 22+ ·
   corn 30+ · goat inside 45 · hit 50 · front-left fence 60 · sack 70 · rails 100+part · posts 200+part ·
   goat outside 300. Scene element count: 51–63 (3×4), 61 (4×5).
6. **Context.** One barn off the left corner (two `woodWallWindow` faces on one canvas, one mirrored, `roof`
   on top), a hay stack back-right, a sack front-left. Nothing else, no text in the scene.
7. **HUD.** One CSS wood (`--woodbg`: base, plank seams, grain, top light) for a rotated sign board top-left
   (brand small, task line large — the only digits on screen), a cart tray bottom holding the planks as a heap
   in a dark bed (never a count), a glow when a plank is in hand, wooden 3D buttons (Done / Next plot / Deliver
   / Start again), a parchment quiet variant (Order again), "For grown-ups" as a small link bottom-right. Packs:
   the delivery slip is a pinned paper note on the tray. Hint bubble: parchment, 2 px wood border, tail on the
   gap, 18 px; pips are 32 px wood discs with cream numerals. One display stack via `--font-display`.
8. Parent page: same variable, cream cards on parchment, no white panels.

**Why.** The previous fence stood on the back-left edge as a line of posts behind an island of six tiles in an
empty sky — no enclosure, nothing to protect, the child building the far side. Building the side that faces
her, with the goat between her and the fence, is what "the goat gets in" means on screen. Everything else is
the difference between a web form over a sprite test and a shipped children's game.

**Verified (real input, not `.click()`).** Playwright `page.mouse.click` at each hit region's centre: 22/22
planks placed, 0 `place_failed`, desktop and phone. `elementFromPoint` sweep over each part's polygon:
93/93/93 % reachable on desktop (the rest is the clip-path edge, identical on every part), 100/100/100 %
interior on the phone. Place, count with pips, two-tap remove, over-rail tap removes, goat in/out, bubble on
the gap, prefetch, packs slip → deliver → pack placed, persistence on reload (parts, goat in the gap, hint
re-said), Next plot, end screen, parent page: all pass. `classifier_eval` mismatches 0; `run_all.py` ALL PASS;
0 console errors; no horizontal scroll at 375; tap targets ≥ 44 px; `[4,4,3]` legible at 320 px.

**Rejected.**
- Tiling the grass sprite across the stage (it is a slope block; ~120 elements on a phone; a visible field
  edge on rotate). Re-rendering on resize (would drop rail state; the bbox rule forbids it anyway).
- Keeping the buildable side at the back with the enclosure added around it (still the far side).
- Putting the bubble beside the fence instead of on the gap (no room on a phone; the contract says on the gap).
- Including the barn in the camera bbox (would shrink the fence by a quarter for decoration).
- A bundled display font (R5: no build step; the variable is there for when one is chosen).
- New art or `fenceHighBroken`; base64 images.

**Known issues.** The bubble for part 0 covers the rails of part 1 on desktop (it is above the gap, and the
gap is now at the front). The subtle CSS clouds are nearly invisible against the haze. (Barn, hay cropping and the plank heap: fixed in the
addendum below.)

**Addendum, 6 Sep 2026 (review punch list).** Five changes after the screenshot review, verified the same way
(real `page.mouse.click` taps: 22/22 planks on parts 0/1/2, 0 `place_failed`, `elementFromPoint` sweep
100/100/100 % interior on both sizes; `classifier_eval` mismatches 0; `run_all.py` ALL PASS; 0 console errors).
1. *Barn.* The two-tile `roof` over one mirrored wall read as a tilted slab on a shed. Replaced with the verified
   single-tile cottage stack from `village.mjs` (`woodWallDoorClosed` + `roofSingle`, dy −120 at the sprite's own
   scale), 96 px wide, foot 25 px behind the back-left fence, with its ground shadow; inside the pinned bbox
   horizontally so nothing crops on a phone, and clear of the sign at 1280×720 and 375×812.
2. *Phone framing.* The paddock takes 96 % of the width (the dirt itself ≈90 %) and sits centred in the band
   under the sign (top 15 % of the scene), so it is midway between the sign and the tray. bbox rule unchanged.
3. *Desktop framing.* Height fit raised from 70 % to 77 % (paddock ~10 % larger). The hay stack moved from
   beyond the right vertex to behind the back-right fence, inside the bbox; the sack moved half a tile in from
   the left vertex. Nothing is cropped at a frame edge at either size. The seat is pushed down only as far as
   keeps the barn roof on screen (`g.oh`).
4. *Ground lattice.* Seam lines at 0.07 alpha instead of 0.32: a field, not graph paper.
5. *Plank heap.* Three rows of boards laid level (the rail sprite is turned 26.5° to lie flat), rows leaning
   ∓3° alternately, centred in the bed. Twelve reads as a tidy pile of boards. Still no digits.
Also: an inline empty favicon, which was the only 404 in the console.




---

## D-070 — Real tiles, a path, a barn built from the pack, trees, boards; the card sits beside the gap
6 Sep 2026 · Status: **Decided**

**First, a repair.** The "full pack" dropped into `assets/farm/` at 23:07 was Kenney's `Angle/` folder
(orthographic side views: a wall is a 26 px sliver, a roof a rectangle of planks), not `Isometric/`.
Every farm sprite the scene uses had silently changed shape. The 57 east-facing files were replaced
from the pack's `Isometric/` folder (`fenceHigh_E` is byte-identical to the `probe/` copy again) and
six more directions were added for the barn: `woodWall_N`, `woodWall_W`, `woodWallDoorClosed_W`,
`woodWallWindow_W`, `roofSingle_N`, `roofSingleWall_N`. Reason below.

**What.**
1. *Ground from tiles.* `scripts/make_parts.py` composites `assets/ground/grass.png`: one seamless
   264×132 patch of eight top diamonds of landscape tile 075 (two of them 3 % darker, so the lattice
   reads as a field rather than a single flat green), each diamond masked a pixel proud over a base
   fill so butted edges never show a hairline. The ground is still one `div`; `background-position`
   seats a diamond's top vertex on `iso(0,0)`, so the paddock's dirt lands on lattice cells exactly.
   Tile 015 (a slope) is gone. 022 was rejected on measurement: also a slope. 067's top face is
   pixel-identical to 075, so "variation" had to be synthetic.
2. *The way in.* One-tile dirt path (`assets/ground/dirt.png`, the top diamond of tile 083) along the
   column outside the buildable side, from the tile the goat waits on down-left off the front of the
   stage; 8 tiles on 3×4. It runs under nothing that matters and exits at the bottom-left at both sizes.
3. *Barn.* Two tiles along the row direction behind the back-left fence, its long face parallel to the
   fence with a one-tile alley between: `woodWallWindow_W` (back) and `woodWallDoorClosed_W` (front) on
   the front-right edges, `woodWall_N` as the gable end on the front tile's front-left edge, `roofSingle_N`
   on the back tile and `roofSingleWall_N` (closed gable) on the front one — two single-tile roofs in a
   line make one continuous gable because their inner gables coincide. Every piece is seated by its
   canvas (source (128,512) = the tile's bottom vertex), the roof 170 source px up = the measured wall
   top at the near post, so nothing floats. `roof_E` is not a two-tile roof: measured, it is one pitch
   of a full-tile slab (eave on the front-left edge, high edge on the back-right, 142 px), which is
   why the D-069 barn read as a tilted slab; and an `_E` wall stands on a tile's back-left edge, which
   in any barn behind the paddock is an interior wall — hence the non-E files.
   *Scale.* The barn is 0.8 of a world tile. At full scale its apex is 188 world px above its back
   tile's ground; behind the paddock that puts the roof under the sign on desktop unless the paddock
   drops to ~55 % of the scene height, and beside the paddock it either crops on the phone or costs the
   phone fence 13 %. At 0.8, desktop fits at the brief's 70 % (`fit` height budget 0.77 → 0.70, scale
   1.82 → 1.63) and the phone pays nothing (bbox unchanged). Fully in frame, clear of the sign, at
   1280×720 and 375×812 (checked from measured art bounds, not canvas bounds).
4. *Trees.* One sprite (`assets/ground/tree.png`, 180×240 at farm density): two-tone trunk, three flat
   green blobs, no outlines, drawn at 2× and downsampled. Four in the scene — two behind-right, two
   front-left, alternate ones mirrored — each with a ground shadow; none in the paddock, on the path
   or under the tray. **Verdict: kept.** At scene scale they sit with the flat landscape tiles; next
   to the rendered barn they are plainer, but they do not read as amateur. The blobs are geometric;
   the fix would be a hand-drawn canopy, not a script change.
5. *Boards.* `assets/fence/board.png` is `planks_E` cropped to its opaque bounds (256×148). The cart
   heap is three rows of these slabs, ∓3° per row, 34 px steps; packs are slabs stacked 4 px apart.
   Twelve reads as a pile of lumber. No digits anywhere on the tray.
6. *Card placement.* `bubbleSpot()` in `fence.mjs` Part 2 tries, in order: right of the part level with
   its top, right of it below the fence line, left level, left below, under it, above it; the first
   spot that fits the scene and overlaps no post, no rail (over-count rail included), not the goat's
   destination and not the sign wins; otherwise the band under the sign, tail pointing down at the
   gap. The tail moves to whichever edge faces the gap (`data-side`). Measured: 0 cue overlaps on
   [4,4,3] and [5,4,3] at both sizes; on the phone [4,4,3] lands under the sign, [5,4,3] under part 0.
7. *Font.* Fredoka loads (`document.fonts.check` true on build and parent pages, no 404). Weights:
   sign task 700, buttons 600, labels 600, card 500, pips 700, body 400; 800 is above the file's range
   and was synthesising bold. Parent page `.big` 800 → 700; an inline favicon there too (its only 404).
8. *Pond.* **Skipped.** The only spot that fits — behind the back-right fence — is where the hay and a
   tree already are; a 2×2 pond there crowds the corner and on desktop its far edge lands 17 px past
   the frame at 70 %.

**Verified** (Playwright `page.mouse.click`, never `.click()`): [4,4,3] 11/11 planks on parts 0/1/2,
[5,4,3] 12/12, 0 `place_failed`, both sizes; `elementFromPoint` sweep 145/145 per part on desktop,
144/145 per part on the phone (the same edge point on every part); `classifier_eval` mismatches 0;
`run_all.py` ALL PASS; 0 console errors, 0 failed requests including the font and every tile; scene
element count 71 clean, 82–83 with rails (budget 200); packs slip → deliver → pack placed; reload
restores rails and cart; parent page loads in Fredoka. Part 1 of `fence.mjs` unchanged.

**Rejected.** Tiling the grass as ~120 `img` elements (the patch does it with one). A per-viewport
barn slot (behind on a phone, beside on desktop: two layouts to keep right). Cutting one board strip
out of `planks_E` (thinner than the rail it would replace). Placing the card above the part (covers
the bare post and the over-count rail, the two cues it describes). A cheaper roof (`roof_E` alone).

---

## D-071 — Three AI additions, decided by the engineering role, not requested
6 Sep 2026 · Status: **Decided**

**Trigger.** The owner asked "what is the AI in this?" and then, when offered options, said deciding
is the engineering role's job. It is. The honest answer was: one model call the child sees as a
sentence, plus discipline around it. That is the right architecture and a weak *surface*. Three
additions make the AI visible and more valuable without touching the rule that the model never
sees a number or gives an answer:

1. **Spoken hints.** The hint is read aloud through the browser's own speech synthesis. Offline,
   no vendor, nothing leaves the device, no voice is recorded (amended COPPA is about collection;
   playback collects nothing). RESEARCH-LEARNER asks for the lowest reading load possible at 7–8;
   hearing the sentence is lower than reading it. A single Sound on/off control, remembered locally.
2. **The parent note written by the model** (`/api/note`, `writeNote()` in buddy.mjs). The
   strongest tutoring result in the literature pointed the model at the adult (Tutor CoPilot). The
   grown-ups page sends a validated summary — fence names, the open misconception in parent words,
   the tier reached, days played — never the event log, counts, or internal ids. The model returns
   `{note, question}` through its own gate: ≤3 sentences, exactly one question, no blame words, no
   internal labels, length caps. Any miss → the fixed parent sentences. An empty week never calls
   the model (it invented activity in the first live test; now it gets the plain sentence).
3. **A judge's overlay** (`?judge=1` or the J key): the live event log, the classifier's result,
   the redacted payload, the hint's source, gate verdict and latency, and the provider name, beside
   the game. The child never sees it; a reviewer sees the architecture working in real time.

**Rejected:** a chat box (the saturated, evidence-contradicted lane); child voice input (collection
under COPPA, ~25% word error on children); model-generated levels (the 12-node graph is the
product's truth and stays code); "AI-powered" copy anywhere on the child's screen.

---

## D-072 — The three AI additions, built: spoken hints, the judge's overlay, the parent note wired
7 Sep 2026 · Status: **Decided**

**What.**
1. *Spoken hints* (`build.html`). Every hint card is read aloud by `speechSynthesis` the moment it is
   shown — the card's exact text, rate 0.92, pitch 1.0, the first English voice the device offers.
   The previous utterance is cancelled first, so a new card never queues behind an old one. Nothing is
   said while the counting pips are up (the probe's follow-up waits until they are gone), and the
   completion line is said once per fence. One control in the footer, the parchment quiet button
   "Sound on" / "Sound off" (56 px), default on, remembered in `localStorage` `rung.sound`; with no
   `speechSynthesis` the control hides itself. Measured: the utterance queued after `[4,4,3]` → Done is
   the card text verbatim; off → the completion line queues nothing.
2. *The judge's overlay* (`judge.mjs`, loaded by `build.html` only on `?judge=1` or the J key; J closes
   it). Parchment on ink, monospace, 420 px on the right on desktop — the stage narrows to make room, so
   the panel never covers the paddock or the card; a 52 vh bottom sheet on a phone with a Hide button
   that leaves a 44 px "Judge" tab above the tray. It shows, live on every event the game writes: the
   last ten events of the level, `classify(level)` (id, tier, confirmed, counts, flags), the exact
   `payload(result)` pretty-printed with a `[no digits]` badge computed by testing the serialised payload
   outside `age`/`tier`/`reading_level` for `\d`, the last hint's source, gate reason if any and round
   trip in ms (timed around `hint()` in the page; `hint()` itself is untouched), the line "provider
   follows the server key", and the 12-node mastery map. Pointer events stop at the panel's edge. This
   is the only place digits appear off the sign, and it is opt-in.
3. *The parent page on the model* (`parent.html`). The local `WORDS` table is gone; the page imports
   `PARENT_WORDS` from `/buddy.mjs`. It builds `{open_id, tier, solo, helped, days}` from `rung.v1`
   exactly as `validNote` requires, calls `note()`, shows "Writing your note…" while it waits (≤5 s),
   then renders `note` and `question` — the fixed sentences on any fallback, since they are the same
   fields. `?debug=1` adds "from the model" / "standard note". With no level in storage the page keeps
   "No fences yet" and makes no request; a played week with nothing to say gets `nothing_to_say` from
   the server, which never reaches the model.
4. *Trees*. A tree is whole or absent: `fit()` hides any tree whose world span leaves the visible
   width. On 375×812 all four are outside the paddock's 96 % band, so none shows; at 1280×720 all four
   stay and the scene is pixel-identical to pass 3 (0 differing pixels above the HUD).

**Verified** (Playwright `page.mouse.click`, never `.click()`). Desktop 1280×720 with the overlay open:
11/11 planks on `[4,4,3]`, 0 `place_failed`; phone 375×812 with the overlay collapsed: 11/11, 0. Spoken:
one utterance, text === card text, rate 0.92, pitch 1, an English voice, `speechSynthesis.speaking`
true; Sound off → no utterance for "The fence is done."; `rung.sound` persisted. Parent page with a
played week: `POST /api/note` → `source:"model"`, one question ending in "?"; empty storage: zero
requests. `classifier_eval` mismatches 0; `run_all.py` ALL PASS; 0 console errors, 0 failed requests
on `/build`, `/build?judge=1`, `parent.html`. `judge.mjs` is not fetched unless asked for.

**Rejected.** A vendor voice (nothing leaves the device, and the browser's is free and offline). A
provider name read from the server (would add a route for a label; the line says what is true). The
overlay drawn over the scene (it would cover the card at 1280); a fixed-width phone panel (unusable
paddock). Moving the right-hand tree inside the paddock's band (crowds the hay and the back fence).
Speaking on reload (the browser's own autoplay rule declines it without a gesture; harmless either way).

---

## D-073 — QA round 2, frontend defects D-2 to D-9 fixed
7 Sep 2026 · Status: **Decided**

- **D-2** The order slip is a fixed-height area: pack silhouettes at 22 px (`zoom:.6`) in a wrapping two-row grid clipped at 44 px, the slip's note sized to the cart's bed, so the slip tray is exactly the plank tray's height (78 px phone, 84 desktop) with any number of packs; Deliver left the tray and stands beside it like Done beside the cart; the "Order" label hides on phones. 12 packs at 375 and 320: posts fully visible above the tray.
- **D-3** The parent page's fence lists are computed from the last 7 days of events (finished levels, with or without a hint), not from all-time mastery, so the count, the lines and the note's "This week" agree. Chosen over the "So far" label because the note template itself says "This week N fences went up" and the lists feed it. Mastery stays the game's all-time record.
- **D-4** The band under the sign is tested against posts, rails and the goat like every other spot and walked down in 16 px steps until it clears; if nothing clears, the card stays at the top of the band. Measured at 320 `[12,0,0]`: the literal "push it below the highest rail" would cover 4 posts and 11 rails against 3 over-count rails at the band top, so it was rejected.
- **D-5** J toggles from every state in one press: `toggle()` opens whenever the panel is hidden, tab or no tab.
- **D-6** The overlay shows `classifier · now` (live `classify(level)`) and `last hint` (id and tier as logged) as two labelled blocks; the payload block is the one the last hint was built from (kept on `S.hint` by `showHint`), labelled "what the model got for the last hint"; before any hint it is the live one, labelled "what the next hint would get".
- **D-7** `end()` writes `ended:true` into `rung.v1`; boot restores the end screen from it before the saved build; `start()` (Start again, Next plot, `?node=`) clears it.
- **D-8** The scene ends where the HUD really starts: a ResizeObserver on `#hud` sets `#scene`'s bottom to `max(--hud, HUD height)`, so when the buttons wrap on a phone (packs after a hint: 230 px) the card can never land on the tray; desktop framing is unchanged (118 px stays). `fit()` now dispatches a `fit` event on the scene and the card re-places itself on it, after the world has moved, never before.
- **D-9** The sign's packs clause uses non-breaking spaces ("packs of 2" never splits).

**Verified** (Playwright `page.mouse.click`, never `.click()`): 375 and 320 with 12 packs, posts clear of the tray, slip tray 78 px = cart tray; 320 `[12,0,0]` card at the band top; desktop judge after a tier-1 hint reads now tier 2 / last hint tier 1 / payload tier 1; Hide then one J press opens; 12th fence → end screen → reload → end screen, Start again clears; parent page with a 10-day-old fence lists only the week's; `classifier_eval` mismatches 0; `run_all.py` ALL PASS; 0 console errors on `/build`, `/build?judge=1`, `/build?node=3x4_packs`, `parent.html` at 1280×720 and 375×812. Part 1 of `fence.mjs` untouched.

**Known residual.** At 320 the card for a 12-rail tower still touches its top three over-count rails (no spot in a 320×418 scene clears a 280×118 card); the post tops the hint points at stay visible.


---

## D-074 — Second product review closed: root serves the game; note gate for thin weeks; rate limit
8 Sep 2026 · Status: **Decided** (docs/PRODUCT-REVIEW-2.md, verdict "Talk to this person")

1. `/` serves the game unless `CONTROL_ARM=1`; `/measure` exists only with the control arm. A judge
   typing the bare origin no longer lands on the frozen tollgate build.
2. Parent note: with zero fences finished the gate rejects any claim of building one (`built`,
   `finished`, `completed`, `made`, `put up`) → template. Unit check added. Live: 1 of 3 notes on a
   thin week had claimed a fence; that path is now closed lexically.
3. Model endpoints carry a fixed-window per-IP limit (60 a minute → 429). Inputs are enums, so
   there is no chatbot to abuse; the limit protects the key's credit. Not a DDoS answer, and said so.
4. `/api/buddy` returns the model id when the model wrote the hint; the judge overlay prints it in
   place of the static "follows the server key" line. The debug source tag is hidden while the
   overlay is open; the stage seats under the sign when the panel narrows it.
5. Counting pips 22 px so they no longer overlap on the rail pitch.
6. Docs: INDEX rows for both QA rounds and both reviews; CONCEPT §3 erratum for the provider and the
   measured cost; MARKET "readout" claim reworded to what is built; stale server header; dead export.
7. Tracked text that named the tooling (ignore file, two doc lines, two commit messages) reworded;
   local ignore rules moved out of the tracked ignore file.
**Not done, deliberately:** a side-view goat (no CC0 art exists; the flat sprite is the honest
compromise, D-048); a second attacker family (no key).


---

## D-075 — A semantic judge above the lexical gate
17 Sep 2026 · **Decided**

After a rephrase passes the lexical gate, a second model call at temperature 0 answers one question
against the reference template: same meaning, same place, no instruction to pick a different part.
Anything but a clear yes ships the template; an unreadable verdict fails closed. Live: 20 rephrases,
12 shipped, 6 stopped by the gate, 2 overturned by the judge that the gate had passed
(`docs/JUDGE-RESULTS.md`). Prefetch hides the second call. **Rejected:** a second model family as
judge (no key); a rule-based semantic check (the failure is meaning, not vocabulary); judging tier one
(tier one is the template in Kuzhi and cheap to keep as template here when the judge is unavailable).


---

## D-076 — One app, "Pip": the home page, How to play, stars and badges, and Pip on the card
17 Sep 2026 · **Decided**

**Name.** *Pip*: a seed, and the pips the games count with; one syllable a six-year-old can say; the
mascot is a seed with eyes. **Rejected:** Rung and Kuzhi as separate brands (two names for one
pipeline), anything with "math" or "AI" in it (a child's product, not a pitch).

**One app.** `node src/server.mjs` starts the seeds game as a second process and mounts it under
`/seeds/` on the same origin, so the home page reads both games' progress from one place. The seeds
game's pages use relative paths and work both mounted and standalone.

**What the child sees now, in both games.** How to play in three steps on first launch and behind a
button; a level strip in the sign with gold and silver stars; a star moment when a level is mastered;
badges on the home page across both games; and Pip on the hint card with **Say it another way**,
which asks for the next tier through the same gate and judge and logs a hint event so the
classifier's escalation stays honest. That button is the child's own line to the model: the AI is no
longer only a note to the grown-up.

**Rejected:** a chat box (the evidence the whole project rests on); points, coins or streaks (the
learner research: extrinsic reward displaces the mechanic); a leaderboard.


---

## D-077 — Seeds dropped; Pip is the Fence game
17 Sep 2026 · **Decided**

The owner, after a plain-words explanation of the sowing game: "I don't find that a child can play
and understand this, and there is no learning. Let's drop it and work on Fence only." Right on both
counts by the product's own standard: a three-tap move with a prediction step, captures, and a lost
seed is more rule than a seven-year-old can hold from a screen, and the skill it exercised, counting
on, is thinner than the grouping Fence builds. The folder stays as a killed concept with its evidence;
the app serves Fence only. The home page, the level strip, stars, badges, Pip on the card and "Say it
another way" stay, because they were built for both. Next: Pip shows the first fence part herself on
a fresh install, then hands over. **Rejected:** deleting `heritage/` (the trail of what was tried is
part of the submission); keeping Seeds reachable "for those who want it" (a judge would find it).


---

## D-078 — Fix the fence and Share it out: chapters, locks, the classifier's new ids, the greening plot
18 Sep 2026 · **Decided** (docs/MODES.md is the spec; this records what the spec left open)

**Graph.** 24 nodes in chapter order (Build, Packs, Fix, Share), `shape()` gains `mode` and `chapter`,
`unlocked(mastery)` is the highest open chapter (three gold in the previous one), `next()` never
returns a locked node and `?node=` cannot reach one either.

**Fix pre-fill is a table, not a roll:** `2x3 [2,0] · 3x3 [2,3,1] · 3x4 [2,4,1] · 4x3 [3,1,3,0] ·
4x5 [3,5,1,5] · 2x5 [2,4]`. Every shape has two parts short by different amounts, the total missing
between 3 and total-2, and the planks standing never equal the planks missing, so
`counted_present_not_missing` and a correct order can never be the same number.

**Precedence, the packs discipline carried over (D-047).** In fix the order is the subtraction the
mode exists to observe: ordering the planks that stand, or more than the gaps, is the finding even when
every gap then gets filled and the surplus sits in the cart, exactly as a pack per plank is in packs.
`fixed_one_part_only` outranks `ordered_short` (the specific reading first, as
`off_by_one_in_one_group` does). A right order (exactly the gaps) and a right part count (share,
`n === groups`) fall through to the concrete rules, so a plank over a post after a right order says
`over_count`, and short filling says `off_by_one_in_one_group`: the placing is concrete mode. Ordered
short with planks still in the cart is `ambiguous`, not her answer yet. An idle commit outranks all of
it, as D-064 says.

**Share collides on four of six shapes.** `parts_equal_per` names the same count as
`parts_one_over` when `per = groups+1` (2x3, 3x4, 4x5) and as `parts_one_short` when
`per = groups-1` (4x3); the fence cannot tell them apart, so those are `ambiguous`, and an ambiguous
share routes to `2x5_share`, the one clean shape, the way concrete routes to 4x3. Parts cap at eight
on the page (the scene must stay legible on a phone), so `parts_equal_total` is reachable only on 2x3;
the pure layer and the fixtures cover it everywhere.

**Chapter done** means every one of its six levels finished, gold or silver; that is the hay bale and
the `chapter_done` fact Pip cheers with. Requiring six gold would leave most children without one.
**First try** means one commit and no hint. **Fixed after a count** means a tap-count after the last
hint. The page skips the cheer call when a hint with no count is the only fact.

**Rejected.** Random pre-fills (the fixtures and the demo need the same fence every time); a
paddock that stays `groups` wide while share parts run off its edge (the frame is the plot, so it
grows a tile per part, and with no parts the two end posts stand together as a closed gate); a
"Templates as built" local fallback in the page (the backend shipped the templates in the same day,
so there is nothing to fall back to; see MODES.md).

Evidence: `evals/classifier_eval.mjs`, 162 fixtures (68 build and packs, 47 fix, 47 share), 137
committed, 137 right, 25 silent, 0 mismatches; real-pointer run of a fix level, a share level, the
chapter lock, the home map and the cheer line, zero console errors.

---

## D-079 — Pip cheers: the model notices what she did right
18 Sep 2026 · **Decided**

Until now the child met the model only when something was wrong. On a finished fence the page now
sends five booleans (`first_try`, `used_hint`, `fixed_after_count`, `mode`, `chapter_done`) to
`/api/cheer`; the model rephrases a template line from a list of plain facts, through the same lexical
gate, then a judge whose question is not the hint's ("same place") but "does it claim anything the
facts do not". Template fallback everywhere; when there is nothing specific to praise (a hint was used
and nothing was fixed after a count) there is no model call at all and the line is "The fence is
done." First live sample on `deepseek-v4-flash`, fourteen calls: nine shipped from the model, two
stopped by the judge (it had added a claim), three stopped by the gate on vocabulary. Rejected: praise
with no facts behind it ("great job!"), which the learner research says teaches nothing; points or
confetti; letting the model see counts.


---

## D-080 — How to play is per chapter, and Pip shows the new move each time
18 Sep 2026 · **Decided**

The owner, after playing: the packs level confused him at the slip, and one How-to sheet written for
Build says nothing about it. Each chapter changes what the cart does, so each chapter gets its own
three-step sheet, shown the first time that chapter starts and behind the button, and Pip then shows
the new move on the real board once per chapter: counts the planks inside a pack and orders one;
counts the empty spaces of one short part and taps the slip for them; adds one part and says why.
Code performs and counts; the model is not involved. Rejected: one sheet listing all four chapters
(unread), and a sheet with no demonstration (the first-plank demo was what made Build land).


---

## D-081 — Pip plans the next fence
18 Sep 2026 · **Decided**

The owner: "the theme is AI-powered learning and we are missing it; use the child's mistakes to
decide her practice." Until now the model only talked. Now, when she taps Next plot, code lists the
open fences that exercise her last mistake (`candidates()` in fence.mjs, a table from misconception
to fence shape), the model is shown her last eight fences as booleans, hint counts and plain-words
meanings, and it picks one of those fences and writes one line telling her why. Code checks the pick
against its own list, the line goes through the lexical gate (digits banned, number words allowed
here because the fence's numbers stand on its own sign) and a facts judge that rejects anything not
in the record; a bad pick falls back to `next()`, a bad line is dropped and the pick stands. The judge
overlay shows who chose and why. First live sample, eight records on `deepseek-v4-flash`: every pick
was in code's list, four of eight differed from code's fixed order (smaller fence after repeated
trouble, same kind after a hint), five of eight lines shipped, the judge stopped two invented claims.
See docs/PLAN-RESULTS.md. Rejected: letting the model invent level shapes (nothing to check them
against); a chat about what to do next; skipping the judge because "it is only praise".


---

## D-082 — Pip shows her, on her own fence
18 Sep 2026 · **Decided**

The third and strongest use of the model as a teacher, not a talker. After the second hint a button
"Show me, Pip" appears on the card. The model is given the real counts (planks on each part, planks
in the cart, planks each part needs) and the plain-words meaning of her mistake, and it writes a
worked example as a script of moves in a fixed vocabulary: point, count, place, remove, say. It does
not write to the child in prose; it writes what Pip does. Code simulates the script before it runs
(`validShow` in fence.mjs): every move must be legal on her fence, no part may be over-filled, at
least one wrong part must end right and no right part may end wrong, twelve moves at most, three say
lines at most, each say line through the lexical gate with numbers banned. A script that fails the
simulation is replaced by code's own script for the first wrong part. Pip fixes one part and hands
the rest back, so the build stays hers; the planks she places are logged, so a fence she helped with
earns silver, not gold. No judge call: the simulation is a stronger check than a second model
opinion. First live sample, six fence states on `deepseek-v4-flash`: five scripts passed the
simulation and the gate and were performed; one was stopped by the gate ("one more plank") and code's
script ran. See docs/SHOW-RESULTS.md. Not offered in Packs (the unit there is a pack, and the point
of that chapter is the order, which a worked example on the board cannot show). Rejected: letting the
model narrate a video-style explanation (words, not moves); fixing the whole fence for her.


---

## D-083 — The chrome around the art matches the art
18 Sep 2026 · **Decided**

The owner's assessment before recording: the game looked handmade next to its own Kenney art. The
scene was fine; the surfaces around it were not. Four surfaces redone with the same palette and no
new assets: the home page is now the game's own scene, framed, with a fence already up and the plot
greening with her stars, the four chapters as signs on a path and the badges as wooden tokens; the
How-to sheet has a wood header with Pip's face and pops in; the hint card is cream on wood with Pip
in her own column and the two buttons as small wood buttons; the star moment has rays and its text
sits on a paper chip, and the cheer card now waits for the star to pass. Rejected: new art, a
mascot redraw, animation for its own sake.


---

## D-084 — Words a six-year-old can read, and a voice a six-year-old wants to hear
18 Sep 2026 · **Decided**

The owner, after playing with the sound on: the text is too old for the youngest players and the
voice is wrong for the product. Two changes. **Words.** Every child-facing line was swept against the
500-word list and rewritten for a reader of six: sentences of eight words or fewer where the meaning
allowed, one idea each, no trade words. "Deliver" is "Bring it", "Order" is "I need", "Next plot" is
"Next fence", "Say it another way" is "Say it a new way", "fix the fence" is "fill the gaps". Sixteen
hint templates were shortened with the same meaning; the gate still passes all forty-eight. **Voice.**
The browser's built-in voices are adult and flat. Every fixed line Pip says, one hundred of them,
now ships as a small audio file made once from one child's voice (Microsoft's Ana neural voice, generated once and
bundled as files), keyed by the line's text in a manifest. A line the
model phrased has no file and is spoken by the browser's friendliest voice, which in Edge on Windows
is the same Ana. The How-to sheet is read aloud line by line, since the child it is for cannot read
it yet. Rejected: a paid text-to-speech call at run time for every line (a key, a cost and a network
round trip for words that never change); recording a human (no child's voice may be recorded for
this product under the same rule that keeps the microphone off).


---

## D-085 — The repo holds only what ships and what proves it
18 Sep 2026 · **Decided**

The owner: keep the repo simple and relevant, no files that are not needed. The tree is now the
product (`src/public`, `src/engine`), the frozen comparison build in its own folder (`src/control`,
served only with `CONTROL_ARM=1`), the checks that run today (`evals/`) with their measured runs
(`evals/results/`), the data, the two scripts, and the docs a reader needs. Removed from the tree:
the second concept that was built and dropped (`heritage/`, D-077), the concept-phase kill-tests and
superseded specs (`docs/history/`, `evals/history/`), the art probe, and an empty notes file. All of
it is in git history up to commit `9533298`, and D-077 and the kill-test decisions still describe
what was tried and why it lost. Rejected: rewriting the decision log to fix old paths (append-only);
keeping the trail in the tree "for the judges" (a reader who wants it has the history).


---

## D-086 — One voice: the model's lines are spoken by the same neural voice as the clips
18 Sep 2026 · **Decided**

The owner, recording the video: "I hear two different voices." The fixed lines were a child's voice
from bundled clips; anything the model wrote on the spot was read by the browser. Now the server
has a `/api/say` route: the browser asks for a line, the server synthesises it with a neural voice
(Azure's Ana, the same voice as the clips, or ElevenLabs or OpenAI by key), caches the audio by
text, and returns mp3. The server voices only lines it produced itself or ships as fixed lines, so
the route cannot be used as a free text-to-speech service; a daily character cap stops a runaway.
With no voice key the route says so and the browser voice is used as before, so nothing depends on
it. When the server voice is not Ana, the page routes even the fixed lines through the server, so
there is still one voice. Rejected: shipping the Edge read-aloud protocol inside the server (an
unofficial endpoint, and LGPL tooling around it, see the licence rule); generating every possible
model line ahead of time (unbounded).


---

## D-087 — One speaker: no line plays over another, and Pip waits for her own voice
18 Sep 2026 · **Decided**

The owner, with the server voice on: lines overlapped and cut each other off. Cause: with a voice
other than Ana the page had routed even the fixed lines through the server, so every line waited
three to four seconds to be synthesised, while Pip's demo ran on fixed timers and each new line cut
the last; a line that arrived late then played over the next. Three changes. Every spoken line now
carries a token and a newer line drops any older one still in flight, so a late arrival never plays.
Speaking returns a promise that resolves when the line has ended, and Pip's demo, her counting and
the worked example wait for that instead of a timer. And the bundled clips are made in the same
voice the server uses (`scripts/voice_clips.mjs`, marker file `VOICE`), so fixed lines are instant
again and only fresh model lines wait for synthesis. Measured with real clicks: 24 lines over a
sheet, a demo, a hint, a rephrase and a worked example, zero overlaps; a line is cut only when the
child acts and a new card replaces it. Rejected: warming every fixed line through the server at each
start (a cold start on the free host would cost a synthesis run each time).

