> Written 4 September 2026 under the working name Rung, before the fence game existed. Sections 4 to 6 judge the earlier build that was thrown away, and section 5 sketches the redesign that became Pip. The findings are the evidence base; the product that came out of them is described in DESIGN.md.

# RESEARCH — The Learner (ages 7–11): psychology, evidence, and what it demands of Rung

4 Sep 2026. Produced by five research passes (attention/cognitive load; motivation;
narrative; game design for learning gains; retention & ethics) synthesised into one document,
with the two load-bearing citations independently spot-checked (see §9).

**Rule carried throughout:** every confidence flag from the underlying research is preserved.
Nothing weak has been laundered into something strong. Where a number is vendor-sourced or an
effect size is unverified, it says so.

---

## 1. The learner (a psychology model)

A 7–11 year old is not a small adult with a shorter timer. Sustained attention grows fast from
5 to 9 and then plateaus, and around age 9 attention reorganises into separable perceptual and
executive components that are absent in 7–8 year olds
(https://www.tandfonline.com/doi/full/10.1080/09297040500488522). So a 7 year old and an
11 year old are two different machines and need **two pacing tiers**. There is **no** validated
"age × 2–3 minutes" attention span — it is untraceable folklore
(https://en.wikipedia.org/wiki/Attention_span) and must never appear in our pitch.

Working memory is the binding constraint: composite span ~3.25 at 7–8, 4.14 at 9–10, 5.57 at
11–12 (https://twu.edu/media/documents/woodcock-institute/ReynoldsWM.pdf). Every on-screen
element that is not the problem is competing for three to five slots.

Competence, for this child, is not a badge. Gamification's own meta-analysis boosts autonomy and
relatedness and *barely moves competence* (g = 0.257,
https://link.springer.com/article/10.1007/s11423-023-10337-7). Competence is felt as a visible,
durable thing they made that would not exist if they had not understood something.

They quit on frustration without a scaffold — children weak in maths show measurably weaker
neural error-monitoring and some do not self-correct without external feedback
(https://www.sciencedaily.com/releases/2026/02/260213020416.htm) — and they disengage in short
bursts (off-task, wheel-spinning, careless errors; Baker,
https://learninganalytics.upenn.edu/ryanbaker/BakerRossi2013.pdf).

And they do not control return. **Parents do** — install, frequency, limits — and parent co-use
correlates with learning gains independent of app mechanics
(https://www.tandfonline.com/doi/full/10.1080/17482798.2021.1970599).

---

## 2. Where the five domains AGREE — the load-bearing principles

| # | Principle | Strongest citation | Strength |
|---|---|---|---|
| 1 | **Intrinsic integration: the mechanic must BE the maths** | Habgood & Ainsworth, *Zombie Division*, ages 7–11 — more learning at fixed time-on-task **and** ~7× longer voluntary play; mechanism is attention directed at task-relevant features. https://dl.acm.org/doi/abs/10.1145/3549503 | **Strong** |
| 2 | **Cut decorative / seductive detail** | Rey et al. 2021 meta-analysis, 177 effects, reliable negative effect on comprehension, recall and transfer; mechanism is *diversion* — learners build mental models around the irrelevant. https://link.springer.com/article/10.1007/s10648-020-09522-4 | **Strong** (extrapolation flag: mostly older learners — but 6–12s are novices by definition, so the risk is if anything higher) |
| 3 | **Points / badges / streaks are the weakest layer and can do harm** | Lepper, Greene & Nisbett 1973 — expected, contingent rewards reduced later free interest in *young children*; surprise rewards did not. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Motivation/Lepper_et_al_Undermining_Childrens_Intrinsic_Interest.pdf | **Strong** |
| 4 | **Context + personalisation + choice beats plain drill** | Cordova & Lepper 1996, N=72, grades 4–5, arithmetic — large gains in engagement, depth of learning in fixed time, and *perceived competence*. https://www.kellogg.northwestern.edu/faculty/research/detail/1996/intrinsic-motivation-and-the-process-of-learning-beneficial-effects/ | **Strong** |
| 5 | **Adaptive mastery pacing helps most — and helps the weakest most** | My Math Academy RCT, K–1, N≈505/481. https://link.springer.com/article/10.1007/s10643-022-01332-3 · Tutor CoPilot +4pp mastery, **+9pp for weakest tutors** https://arxiv.org/html/2410.03017 | **Strong** |
| 6 | **AI must not hand over answers** | RCT N=1,222 — ~10 min of AI help reduced persistence and independent performance after removal (age composition **unverified**). https://arxiv.org/pdf/2604.04721 | **Moderate** |
| 7 | **Feedback must be elaborated and error-specific, not right/wrong** | https://www.sciencedirect.com/science/article/abs/pii/S036013151930082X — bounded by working memory: over-elaboration hurts low-WM learners | **Moderate–Strong** |
| 8 | **Short, spaced sessions > one long session** | Among the most replicated findings in cognitive psychology (https://parentingscience.com/spaced-learning/). **No** validated optimal minute-count for 6–12 exists | **Strong on principle, Weak on any number** |
| 9 | **Building / creating is the ethical return mechanic** | UK Children's Code Standard 13 constrains reward loops and nudges; Roblox return is graduated creative participation, not a reward loop (https://ijoc.org/index.php/ijoc/article/download/21902/4789) | **Moderate** (regulation Strong, mechanism descriptive) |

Intrinsic integration earns the top slot on the right grounds: Habgood & Ainsworth is the only
finding here that shows a *learning* gain (not merely engagement) attributable to the
integration itself, held at equal time-on-task, in exactly our age band.

---

## 3. Where the domains CONTRADICT — and the resolutions

### (a) Narrative: a null RCT vs meta-analytic endorsement
Sýkora, Stárková & Brom 2021 (BJET, N=95, age ~8, two-week at-home RCT with a *commercial
maths game*): adding narrative cutscenes produced no difference in learning, engagement,
enjoyment, time-on-task or tasks solved — all effects < 0.29
(https://bera-journals.onlinelibrary.wiley.com/doi/abs/10.1111/bjet.12939). Yet gamification
meta-analyses group narrative among the *effective* elements
(https://link.springer.com/article/10.1007/s11423-023-10337-7).

**Resolution:** these measure different objects. Sýkora isolated narrative as a *bracket* — story
before and after an unchanged maths task. The meta-analyses code "has narrative" at study level,
confounded with challenge design and meaningful goals; no RCT isolates a narrative wrapper alone.
The mechanistic evidence splits cleanly: Adair et al. 2022 found narrative correlated with
successful problem-solving *specifically where story and maths problem were the same object*
(https://link.springer.com/article/10.1007/s11423-022-10129-5), and Cordova & Lepper's fantasy
context *was* the arithmetic.
**Bracketing narrative: null. Integrated narrative: positive.** Confidence: **high**.

### (b) Adaptive difficulty vs learner-chosen difficulty
Adaptive beats fixed (https://www.sciencedirect.com/science/article/abs/pii/S0360131513001711);
a later study found no significant difference vs learner-chosen, implying agency is the active
ingredient (https://www.intechopen.com/chapters/1228576 — weaker venue). Against that, My Math
Academy's mastery-paced adaptivity produced its largest gains for the *weakest* students — the
learners least able to calibrate their own challenge.

**Resolution:** adaptivity sets the **floor**, agency sets the **ceiling**. The system proposes
the next skill at mastery pace; the child may always choose a different building and may take a
harder one. Never let a child *lower* below the mastery floor silently — surface it to the parent
view instead. Confidence: **moderate**; the tie result rests on one weak-venue study.

### (c) Rewards and streaks
Two meta-analyses openly disagree on intrinsic vs extrinsic effect (g 0.257 vs g 0.713/0.638,
high heterogeneity). Duolingo's streak evidence is its own unpublished A/B — **LOW confidence,
self-reported**, and it stays flagged.

**Resolution:** the disagreement dissolves on reward *condition*, not reward *presence*. Lepper
1973 shows expected + contingent rewards do the damage; surprise rewards did not. So: **no
anticipated reward schedule, no loss-framed streak.** The village is not a reward — it is a
*readout of mastery*. Combined with Children's Code Standard 13, streak-as-loss is both weakly
evidenced and legally exposed. Confidence: **high** on direction, **low** on any retention number.

### (d) The companion
Pedagogical agents create genuine attachment and better retention in young children ("Little
Bear", https://link.springer.com/chapter/10.1007/978-3-319-67684-5_28); cute anthropomorphic UI
can function as a dark pattern undermining autonomy
(https://link.springer.com/chapter/10.1007/978-3-031-46053-1_5); parasocial shame pressure was
measured in 24.8% of preschool apps (https://pmc.ncbi.nlm.nih.gov/articles/PMC9206186/).

**Resolution:** the buddy may express *pride in the child's work*; it may **never** express
sadness, disappointment, or need. That single line separates the two literatures.
Confidence: **moderate–high**.

---

## 4. What the earlier build's failure actually means, in evidence terms

The criticism — "not interactive, not meaningful, no storyline, placement makes no sense" — is
correct, and it is **one failure wearing four masks**.

**"Not interactive"** — in Habgood & Ainsworth's terms the current build is *extrinsically*
integrated: the arithmetic is a **tollgate** in front of a build action, not the build action
itself. The child's input changes a number, not the world. Every finding in §2.1 says this is
exactly the configuration that produces engagement-without-learning. **This is the single
largest defect.**

**"Placement doesn't make sense"** — two named effects. The **split-attention effect**
(https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/splitattention-principle-in-multimedia-learning/194CBCD1A3C911116CCB5F403AC7E415):
the number, the cost, and the thing being built are separated, so a child with a 3–4 item span
burns capacity holding them together instead of doing arithmetic. And **unsignalled
affordances**: children — especially those with attention difficulties — learn better when
interactive elements are visually marked as interactive
(https://www.sciencedirect.com/science/article/pii/S0022096525001262). Non-diegetic placement
is not a taste problem; it is a working-memory tax.

**"Visuals don't make sense"** — decorative art and celebratory animation that carries no
information is a seductive detail, and the harm is *diversion*: the child builds a mental model
around the fun-but-irrelevant. Worst for low-prior-knowledge learners — which is every learner
we have.

**"No storyline"** — the instinct is **right about the symptom and wrong about the cure.** What
is missing is not plot; it is **meaning for the numbers**. Sýkora's RCT is unambiguous:
cutscenes bought nothing on any measure. Do not write a story. Write a *situation*: this
village needs 3 beams, a beam is 4 logs, how many logs — where getting it wrong builds a shorter
fence, visibly. That is the narrative form Adair and Cordova & Lepper actually support, and it is
cheaper than cutscenes.

---

## 5. The redesign — what an evidence-grounded Rung looks like

**Core loop (MUST → §2.1).** Select a plot → **the build *is* the problem**: the child assembles
the quantity (place 4 logs per beam, 3 beams) rather than typing an answer into a modal. The
manipulation and the arithmetic are one action. A wrong quantity produces a wrong structure —
visible and fixable — not a red X.

**Maths ↔ village relation (MUST → §2.1, §2.3).** The village displays *mastered skills*, not
coins spent. Every structure is tied to a skill; the skyline is a mastery map a parent can read
at a glance.

**Feedback (MUST → §2.7).** Error-specific and short: name the misconception ("you counted the
beams, not the logs in each"), one strategy, ≤2 sentences — the WM bound is real. Default
immediate; do not over-engineer timing — the 2026 meta-analysis
(https://link.springer.com/article/10.1007/s10648-026-10117-8) shows no consensus and it is
not where the win is.

**Difficulty & agency (MUST → §2.5, §3b).** Adaptive mastery floor; the child always picks
*which* building next (autonomy is the one need gamification reliably serves);
harder-than-suggested always allowed.

**Session shape (SHOULD → §2.8).** Short and resumable; two pacing tiers (7–8 vs 10–11) per the
age-9 reorganisation. **Never state a target minute count as evidence-based** — none exists.

**The buddy (MUST → §2.6, §3d).** Tutor CoPilot model, not chatbot: never states an answer,
offers the next hint tier, triggers *before* frustration. Comments on the child's build, never on
their absence. Any generated text: short, templated, age context re-injected **every turn** —
KIDBench shows safety degrading 6–24% over multi-turn (arXiv 2605.25510); one system prompt is
insufficient.

**Parent surface (MUST → §2.9).** Skill-level mastery view, parent-facing only. No child-facing
purchase or social feed. Separate explicit parental consent for any data flow (COPPA amendments,
compliance 22 Apr 2026,
https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule).

**Measure (MUST — this is the project's differentiator).**
1. **Near-transfer checkpoint** — same skill, plain non-game format, plus a delayed re-test.
   Transfer is hardest for young children and context-dependent — measure it, never assume it
   (https://pmc.ncbi.nlm.nih.gov/articles/PMC11268831/).
2. **A/B intrinsic vs extrinsic integration** — same maths, tollgate vs build-is-the-problem.
   This replicates Habgood in a modern format and is the headline number.
3. **Disengagement proxies** (Baker): idle time, rapid wrong guessing, retries without progress.
4. **Hint-tier escalation rate** — does the buddy scaffold, or leak answers?
5. Own cohort retention. **NICE:** A/B companion present vs absent.

---

## 6. What to CUT from the current build

- **The arithmetic modal / cost tollgate.** Replaced by build-is-the-problem. Highest priority.
- **Decorative celebration animation** — seductive detail, diversion cost, worst for the weakest.
- **Any number or label separated from the object it describes** — split attention.
- **Cutscenes, intros, frame story.** Sýkora: zero effect on five outcomes.
- **Loss-framed streaks, countdown timers, auto-advance.** Weak evidence; Children's Code
  exposure (£17.5M / 4% turnover).
- **Leaderboards.** Help the top, demotivate the middle and bottom.
- **Points / badges as the primary loop** — overjustification, and they don't move competence.
- **Buddy sadness / disappointment / neediness.** Parasocial pressure appears in 24.8% of
  preschool apps; we don't ship the 80th percentile of manipulation.
- **Cosmetic-only skins and avatars.** Choice that doesn't change the world isn't agency.

---

## 7. Evidence gaps and honest limits

- **Seductive-details and split-attention evidence is largely from older learners** — applied
  to 6–12 by extrapolation. Defensible (novices are the moderated-worst case), but extrapolation.
- **The AI-persistence RCT's age composition is unverified.** We say "in a large RCT of
  learners", not "in children".
- **Tokac et al. 2019's exact maths-specific effect size is unverified** — read the full paper
  before quoting any g. Solid effect sizes here come from *general* DGBL, not primary maths.
- **Every retention number is vendor- or aggregator-sourced.** Duolingo's streak claim, the 2–3×
  parent-dashboard claim, and "Khan Kids works without badges" are all **Low confidence** and stay
  that way. Education D30 ≈ 2–3% is an industry aggregate we have not verified.
- **No controlled study shows creation/ownership mechanics are causal for 6–12 return.** Roblox
  and Toca Boca are descriptive. Our village-as-mastery bet is *reasoned*, not proven.
- **No RCT tests AI-generated personalised narrative in maths with children.** Open gap.
- **Companion attachment → return visits** is thin for software companions.
- **Claims needing our own measurement:** that Rung improves maths mastery; that
  build-is-the-problem beats the tollgate; that the buddy raises persistence rather than
  substituting for it; any retention figure at all.

---

## 8. The one-paragraph pitch

Rung is a maths game for 7–11 year olds where solving the arithmetic *is* the act of building —
not a gate in front of it. That distinction isn't a design preference: it's the one intervention
in this literature with a controlled learning gain in exactly this age band (Habgood & Ainsworth's
*Zombie Division* — more learning at equal time-on-task, ~7× longer voluntary play). We
deliberately did not build the obvious things. No storyline, because the only direct RCT on
narrative cutscenes in a children's maths game found zero effect on learning, engagement,
enjoyment, or time-on-task. No streaks or badges, because expected contingent rewards have
undermined children's intrinsic interest since Lepper 1973 and gamification barely moves the
competence need this product exists to serve. The AI buddy is modelled on Stanford's Tutor
CoPilot — it scaffolds, it never answers — because handing answers to learners measurably reduced
their persistence once it was removed. What we do claim, we measure: the ship includes an eval
harness with an off-game near-transfer post-test, a delayed retest, and an A/B of integrated
versus tollgate arithmetic. We don't yet have those numbers at scale, and we don't quote anyone
else's.

---

## 9. Provenance and verification

Five research passes (attention & cognitive load; motivation; narrative; game design for
learning gains; retention & ethics), each instructed to report only what it found via search,
with URLs and confidence labels, and to flag popular claims lacking evidence. Synthesised by a
separate analyst instructed to preserve every confidence flag.

**Independently spot-checked** (afterwards, separately from the research passes and
analyst; publisher pages returned 403 so verified via search records):
- **Sýkora, Stárková & Brom (2021), BJET** — "Can narrative cutscenes improve home learning from
  a math game? An experimental study with children." Confirmed: N=95, mean age 8.24, two weeks
  at-home, story vs no-story via comic cutscenes at beginning and end. Design matches exactly.
  The null-result sentence was reported from the abstract in the narrative pass and not
  re-read verbatim here.
- **Habgood & Ainsworth (2011), Journal of the Learning Sciences** — "Motivating Children to
  Learn Effectively: Exploring the Value of Intrinsic Integration in Educational Games."
  Confirmed: *Zombie Division*, ages 7–11, intrinsic / extrinsic / control, Study 1 N=58.
  Landmark, real. https://eric.ed.gov/?id=EJ922627

Not independently re-verified (carried at the pass's stated confidence): Lepper 1973 and
Cordova & Lepper 1996 (classics, low risk); PMC9206186 (rated High in the retention pass);
Tokac et al. exact effect size (flagged unverified — do not cite a number); arXiv 2604.04721
(sample age unverified).
