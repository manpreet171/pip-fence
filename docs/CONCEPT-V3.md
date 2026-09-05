> **SUPERSEDED 4 Sep 2026.** v3 was revised through three critic rounds (CRITIC-R1/R2/R3). Current authority: `docs/CONCEPT-V3.2.md`.

# CONCEPT v3 — "The plot is the problem"

4 Sep 2026. 14 days to deadline. Supersedes CONCEPT.md (v2, the misconception engine) and the
current build (a tollgate maths game with a village wrapper).

Provenance: five learner-research passes → master synthesis (`docs/RESEARCH-LEARNER.md`) →
AI-Product-Engineer brief (`docs/AI-ARCHITECTURE.md`) + market landscape (`docs/MARKET.md`) →
this innovation synthesis. Two load-bearing citations independently spot-checked. Every
confidence flag from the research is preserved; nothing weak has been upgraded.

---

## 1. The combinatorial insight

Put the four proven pieces together and one object does four jobs at once. When the arithmetic
*is* the build (P1, Habgood & Ainsworth), the child's placement state **is** the answer. When
the world is a readout of mastered skills (P9), that same state **is** the mastery record. When
the buddy is answer-blind and the child never types (`AI-ARCHITECTURE.md`), the delta between
placed and required **is** the only thing the model is given — so it cannot leak a number it was
never handed. And when measurement ships inside the product, that same delta stream **is** the
telemetry: wrong-guess rate, retry-without-progress, hint-tier escalation.

One data structure; four readers; no translation layer between them.

The emergent mechanic that no product in the landscape has is **error persistence**: everywhere
else a wrong answer is a red X deleted the instant it happens. Here the wrong answer stays on
screen as a short fence with a gap in it — a durable, repairable object that the child sees, the
coach describes without knowing the target, the parent reads as a skill gap, and the harness
counts.

**Own the lineage honestly:** intrinsic integration is Zombie Division's (2011), mastery pacing
is My Math Academy's, non-answering AI is Khanmigo's *claim*. What is new is not any one piece but
that a single build state makes the *error itself* the shared object of the mechanic, the coach,
the readout and the eval — which is precisely why nobody else can publish a leak rate: their
coach holds the answer, and their error is already gone.

---

## 2. Concepts, ranked

### 1. Rung — "the plot is the problem"  ← BUILD THIS

**What it is:** an isometric farm where you build by making the quantity, and a miscount builds
a visibly wrong thing you have to go and fix.

**Core loop (60 s):** the child taps an empty plot. The frame appears with a plain situation
written *on* it: "3 fence sections. Each section needs 4 planks." A plank stack sits beside the
frame; slots are visually marked as interactive. She drags planks into section one, two, three.
No box, no keyboard, no submit button — running out of planks or stopping early *is* the answer.
The fence completes at 12; at 9 it stands three planks short with a hole, and a sheep walks out.
She drags three more; the hole closes; the sheep goes back. The plot is hers; the skyline is one
building taller.

**New vs closest product:** *Math Town* (surface-closest) is solve → earn coins → decorate.
*Prodigy* is a confirmed tollgate. In both, a wrong answer changes a counter, not the world. Here
the wrong count IS the wrong structure, and the farm displays skills mastered, not coins spent.

**Evidence:** P1 (the only controlled *learning* gain in the 7–11 band, at fixed time-on-task);
RESEARCH-LEARNER §4 — the current build's tollgate is exactly the extrinsic configuration that
produces engagement without learning; P4 (context + choice beats drill); §3a (situation, not
cutscene — Sýkora's bracket bought nothing); split-attention (the number lives on the object);
P7 (error-specific feedback, ≤2 sentences).

**AI role — exactly per `AI-ARCHITECTURE.md`:** code owns truth. A ~30-line lookup table turns
the placement delta into a `misconception_id` + tier (`counted_groups_not_members`,
`one_group_only`, `off_by_one_per_group`). Claude Haiku 4.5, structured output, strict, phrases
the tier as ≤2 sentences at a 7-year-old's reading level, age re-injected every turn. **The
prompt contains the child's build state and the misconception ID — never the target.** Output
gate: schema, sentence count, banned affect words, fall back to template. The LLM does NOT decide
difficulty, does NOT classify the error, does NOT compute anything, and is NOT on the critical
path — pull the cable and the buddy degrades to templates.

**Demo moment (20 s):** the sheep walks out through the gap. No red X anywhere in the video.
Cut to the same problem in tollgate mode: red X, farm unchanged. That contrast is the pitch.

**Measured:** near-transfer post-test (plain, paper-style), integrated arm vs tollgate arm at
equal time-on-task — the headline. Plus delayed retest, hint leak rate (target 0/N over 60
fixtures), tier-escalation rate, p50/p95 latency, cost per hint.

**14 days — realistic.** Reuses the Kenney iso art and `village.mjs` renderer as-is, the Elo
`theta` in `engine.mjs`, and the eval-harness pattern.
Day 1–4 placement mechanic + wrong-structure rendering · 5–6 classifier table + answer-blind
coach (a *deletion*: the current `coach.mjs` puts "The correct answer is …" in the prompt and
regex-guards it; the new architecture removes both) · 7 mastery skyline · 8 tollgate A/B arm
(cheap — it is the current build) · 9 transfer checkpoint · 10 harness + judge · 11 parent view ·
12 pilot with real children · 13 film · 14 buffer.

**Rule check:** learner visible (a real child placing planks); genuinely helps (the mechanic is
the maths); demoable in 20 s without narration.

**PRE-ATTACK.** *"This is Zombie Division with an LLM bolted on."* Fair, and it is said in the
video. The mechanic is 2011's and is credited. What is ours is that the mechanic's state is the
only thing the coach sees — making never-answers *structural* rather than a vendor claim — and we
publish the leak rate Khanmigo and Synthesis don't. *"n=3 children, your A/B is noise."* Correct —
no p-value is reported. Per-child raw scores, called a pilot; the shipped harness is the artifact.
The deterministic numbers (60 classifier fixtures, leak rate, latency, cost) are not underpowered,
and knowing which numbers are which is the signal.

### 2. Rung Alongside — the parent gets the CoPilot  ← BOUNDED STRETCH
Child builds; on a wrong build the parent's phone shows the misconception in plain words and one
question to ask out loud. Evidence: P5 (Tutor CoPilot +4pp, **+9pp for the weakest tutors**) and
parent co-use correlating with gains. AI: same classifier, adult reading level, leak constraint
stays. +2 days on concept 1. Pre-attack: it is exactly Nerdy's own Live+AI thesis — reads as
agreement, not invention — and needs two people on camera. **Verdict: one screen, only if
days 1–11 land clean.**

### 3. The Repair Yard  ← LEVEL TYPE, NOT A PRODUCT
The loop starts from an already-wrong structure the child diagnoses and fixes. Targets the
error-monitoring deficit in weak-maths children. Pre-attack: diagnosing someone else's error is
not the same act as constructing correctly, and no citation supports transfer in that direction;
reads as a spot-the-mistake worksheet. **Verdict: a second level type inside concept 1, only if it
survives the pilot.**

### 4. Teach the Buddy  ← DIES
The buddy builds wrong on purpose; the child corrects it. Two fatal problems: learning-by-teaching
has no citation in RESEARCH-LEARNER (so it would violate R3), and a buddy that *needs* the child
is a buddy expressing need — §3d draws the line explicitly there. **Rejected for the right reason,
which is worth more than shipping it.**

---

## 3. The recommendation

**Build concept 1. Add concept 2's single parent screen only if days 1–11 land clean.**

Concept 1 is the only one standing on P1 — the sole finding in the evidence base showing a
*learning* gain from the integration itself, at equal time-on-task, in exactly this age band. It
survives the "X already does this" attacks best because its differentiator is a 20-second
*visual* (wrong count → wrong structure), not an architecture claim a reviewer must take on faith.
On hireability: an engineer who removes the answer from the prompt instead of regex-guarding it,
refuses voice and cites the child-ASR error rate that decided it, and ships an eval harness with a
publishable leak rate is demonstrating "user value over novelty" and "define success metrics" in
artifacts rather than adjectives. On 14-day risk it is the cheapest: it deletes a modal and reuses
art, renderer, Elo and harness that already exist.

**The single demo beat:** the sheep walks out through the gap in the short fence.
**The single headline metric:** near-transfer post-test, build-is-the-problem vs tollgate, equal
time-on-task — reported as a pilot — with the leak rate (0 hints containing the target across 60
fixtures) as the number that is not underpowered.

---

## 4. What it looks like to Aanya, 8

**0:00** — A farm from above. Grass, a barn, a corn field. Three glowing empty patches. Nothing
is asking her anything.
**0:10** — She taps the patch by the sheep. A fence outline appears, three empty sections. Along
the top rail: **3 sections. 4 planks each.** A pile of planks sits at the end of the rail.
**0:25** — She drags a plank. It thunks into place with a shadow. Three more fill section one.
She fills section two. She fills section three with three planks and lets go.
**0:40** — The fence stands, but the last section has a gap. A sheep walks out into the corn.
Nothing turns red. Nothing buzzes. No box pops up over the farm.
**0:48** — Text appears on the gap itself, only there: *"Section three has 3 planks. The other
two have 4. Count one full section again."* Two sentences. It never says twelve.
**1:00** — She counts section one with her finger — one, two, three, four — and drags one more
plank into the gap. The fence closes. The sheep walks back in and sits down.
**1:15** — The farm zooms out one notch. The fence stays. Two new patches glow: a hen house
(harder) and a corn row (same). She picks the hen house because she wants hens.
**1:30** — She stops. The farm stays exactly as she left it. Nothing counts down, nothing is at
risk, nothing asks her to come back tomorrow.

---

## 5. Risks, honestly

**Where it can still read generic.** If the demo shows the fence completing *correctly* first, it
is Math Town. The wrong build must be the first thing on screen, within twenty seconds.

**The magnitude ceiling — the real one.** Build-is-the-problem works for grouping, repeated
addition and sharing at small numbers. It does not extend past roughly thirty objects: nobody
drags 47 planks. The existing `generateProblem` emits two-digit × two-digit, which is unbuildable
under this mechanic and must be re-scoped. **This is honestly a Year 2–4 grouping /
multiplication / division tool, not a general arithmetic tutor** — and saying so is better than
being caught. Zombie Division had the same ceiling.

**Thin evidence, per RESEARCH-LEARNER §7.** No controlled study shows creation/ownership
mechanics cause return in 6–12 — the farm-as-mastery bet is *reasoned*, not proven. Seductive-
detail and split-attention findings are extrapolated from older learners. The AI-persistence
RCT's age composition is unverified — "learners", never "children". The pilot A/B is descriptive.

**What would kill it.** (a) Drag placement is fiddly on a touchscreen and children fight the
interface, not the maths — pilot no later than day 12, and a tap-to-place fallback from day 2.
(b) The transfer post-test shows nothing in either arm — the likeliest outcome at this n; report
it plainly. A hackathon entry that shows a null it could have hidden is a stronger hire signal
than a suspiciously clean win. (c) The classifier can't separate two misconceptions that produce
the same visible structure — then the honest move is a tier-1 hint asking the child to show which
section they counted, not a guess dressed as diagnosis.
