# RESEARCH — The Evidence Base

Compiled 3 Sep 2026. This is the factual ground under every design decision.
Rule R3: no pedagogical claim in this project may go beyond what is cited here.

---

## 1. The finding that reframes the whole hackathon

**Unguarded generative AI actively harms learning.**

PNAS 2025 / Wharton–Penn. RCT, ~1,000 high-school maths students, Turkey. Three arms:

| Arm | Practice performance | Exam performance (AI removed) |
|---|---|---|
| GPT Base (raw ChatGPT) | up sharply | **down 17% vs control** |
| GPT Tutor (guardrailed, hints only) | up sharply | ≈ control (harm erased, **no gain**) |
| Control (textbook + notes) | baseline | baseline |

Two conclusions that most hackathon entrants will not know:

1. The default build — a helpful chatbot that answers — is **net negative** for learning.
2. Guardrails are a **floor, not a ceiling**. "Give hints, not answers" gets you back to
   zero. It does not get you a win. Something more is required.

Source: https://www.pnas.org/doi/10.1073/pnas.2422633122

---

## 2. Where the largest measured win actually came from

**Stanford Tutor CoPilot** — first RCT of AI-supported *live* tutoring.
900 tutors, 1,800 K-12 students, historically under-served communities.

- Students of tutors with CoPilot: **+4pp topic mastery**
- Students of the **lowest-rated tutors: +9pp** — AI compressed the expertise gap
- Tutors with CoPilot were **+10pp** more likely to ask students to explain their thinking;
  control tutors defaulted to generic encouragement
- Cost: **$20 per tutor per year** vs thousands for traditional training
- Design choice: **tutor-facing only**, multiple strategies offered, tutor agency preserved

The AI never touched the student. It made the human better in real time.

Sources: https://arxiv.org/pdf/2410.03017v1 · https://edunlp.stanford.edu/projects/tutor-copilot

---

## 3. The 2026 frontier framing: effort preservation

**EFFORT-AI** (Frontiers in Education, 2026) — the cleanest articulation of the principle:

> "AI should preserve target cognition. Before a learner has attempted the focal retrieval,
> explanation, diagnosis, or transfer act, AI may probe, prompt, segment, or clarify, but it
> should **not perform that focal act in the learner's place**."

Six-phase cycle: **Elicit → Formulate → Feedback → Organize → Reflect → Transfer**,
with three control layers: effort preservation, load-adaptive scaffolding, accountability.

Note: model-building paper, **no original empirical data**. Useful as vocabulary and
architecture, not as proof. Cite it as framing, never as evidence.

Related: the **Retrieval Interruption Framework** (Educ. Sci. 2026) — AI assistance
inserted before a retrieval attempt breaks retrieval-dependent learning.
OECD Digital Education Outlook 2026: general-purpose GenAI improves *task performance*
without producing *learning* unless pedagogy shapes the interaction.

Source: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1849821/full

---

## 4. Desirable difficulties — and their limits

Bjork's principle: conditions that **slow immediate fluency improve later retention and
transfer** (spacing, interleaving, testing over rereading).

Critical 2026 caveat: **desirable difficulties are conditional, not universal.**
Retrieval practice *stalls under high cognitive load*. Struggle is only productive inside
a band — below it there is no encoding, above it there is shutdown.

**Design consequence:** "make it harder" is not a strategy. Detecting the *boundary* of
productive struggle, per learner, per moment, is the real engineering problem. Almost
nobody operationalises this.

---

## 5. The state of shipped AI tutors (the bar we are clearing)

- AI tutors deliver ≈ **0.34 SD** learning gain. Human 1:1 tutoring ≈ 2 SD (Bloom, contested).
  AI is at roughly **one-sixth** of a human tutor.
- 2025 RCT: Khanmigo ≈ **0.34 SD** in algebra.
- Audit finding: **3 of 4** AI-tutor products are thin LLM wrappers — **no mastery model,
  no pedagogical strategy, day-30 retention under 12%.**
- Most EdTech companies **do not benchmark** against published research benchmarks at all.
  ("The gap between research and practice is vast.")

**This is the opening.** The field's own weak spot is measurement. An entry that arrives
with an evaluation harness and real numbers is competing in an almost empty category.

Sources: https://arxiv.org/pdf/2605.05648 · https://edtechinsiders.substack.com/p/new-tutoring-benchmarks-continue

---

## 6. Learner modelling — what actually works

- LLMs infer student misconceptions **better than naive baselines but worse than methods
  that explicitly model misconceptions.**
- LLMs struggle specifically at identifying **incorrect** reasoning (they pattern-match
  toward correctness).
- Specialised knowledge-tracing models are **faster, cheaper and more accurate than LLMs**
  (arXiv 2603.02830).
- Most LLM tutors "lack explicit and theory-grounded mechanisms for representing learners'
  knowledge over time."

**Architecture consequence — the key engineering insight:**

> The learner model must be **explicit and symbolic**. The LLM is the *language layer*
> around it, not the model itself. Hybrid neuro-symbolic beats prompt-only, and it is
> auditable, cheap, and demoable.

Historical anchor: **Brown & Burton's BUGGY / DEBUGGY (1978)** catalogued ~100 procedural
"bugs" in children's subtraction — smaller-from-larger, borrow-across-zero, etc. That
library still holds. Almost no modern AI product uses it. Combining a 1978 bug catalogue
with a 2026 LLM is both genuinely effective and a strong signal of having done the reading.

Sources: https://arxiv.org/html/2410.12294 · https://arxiv.org/html/2603.02830v1

---

## 7. Nerdy — what they are and what they want

**Company:** NYSE: NRDY. Parent of Varsity Tutors. "Live + AI" — human expert instruction
with a purpose-built AI layer. 3,000+ subjects, 40k+ experts matched on 100+ attributes,
4.9/5 across millions of sessions, 1,000+ school districts.

**Their four named AI surfaces** — the hackathon prompts are downstream of these:
`matching` · `tutoring copilots` · `adaptive practice` · `session intelligence`

**Their claim:** double proficiency growth while cutting teacher workload 7–10 hrs/week
via 40+ AI teacher tools.

**AI Product Engineer JD — verbatim signals:**

- *"Identify and deeply understand customer problems through data, feedback, and direct observation"*
- *"Prototype and build end-to-end solutions, spanning front-end, back-end, and AI-powered logic"*
- *"Integrate AI thoughtfully, prioritizing user value over novelty"*
- *"Establish feedback loops and define success metrics"*
- *"Operate like an owner, accountable for the impact of what you build"*
- Culture: *"AI-Native at every level"*, *"free-market rigor — ideas rise on merit"*

**Read:** they are hiring a *product* engineer, not a researcher. Depth must be visible
*through* a shipped experience, never presented as a paper.

Sources: https://careers.nerdy.com/job-posts/aipe · https://hackathon.nerdy.com/

---

## 8. Saturation forecast — what we must not build

Predicted contents of the entry pile:

1. K-5 maths chatbot with a cartoon mascot
2. Duolingo clone with LLM-generated exercises + streaks
3. AI story generator that reads aloud to children
4. "Adaptive" = an LLM picking the next question with no learner model
5. Photo-of-homework → step-by-step solution
6. Voice tutor that talks pleasantly
7. Flashcards + SM-2 with an LLM writing the cards
8. RAG over a textbook with a chat box

Every one of these is (a) buildable in a weekend, (b) demoable to identical effect by
fifty other entrants, (c) sitting on the wrong side of the PNAS finding, and (d) contains
zero measurement.

**Our lane is whatever this list cannot reach.**

---

## 9. The four strategic openings

| # | Opening | Why it is open |
|---|---|---|
| **A** | **Effort preservation as core mechanic** | Everyone builds AI that *helps*. Evidence says helping is the harm. An AI that structurally *cannot* do the thinking is contrarian and defensible. |
| **B** | **Point the AI at the human expert, not the learner** | Biggest measured effect in the literature. Directly matches Nerdy's "tutoring copilots" + "session intelligence". Nobody at a hackathon builds tutor-facing tools. |
| **C** | **Explicit symbolic learner model + LLM as language layer** | The field's own papers say prompt-only learner modelling underperforms. Hybrid is better, cheaper, auditable — and legible as real engineering. |
| **D** | **Measurement as a first-class product surface** | 3 of 4 products have none. An eval harness that puts a number on stage is a category of one. |

**A submission that lands on three of these four is not competing with the pile.**

---

# PART II — Frontier sweep, 3 Sep 2026

Second research pass, run after concept v2 was abandoned. This section looks for **open
problems**, not for how to build a better tutor. It changed the target.

## 10. The problem the field has actually converged on: *effortless bypass*

**"AIED's Unfinished Mission: Centering Agency and Motivation in the Age of Effortless
Bypass"** (arXiv 2607.05557, 2026) states it directly:

> "The widespread availability of general-purpose AI that can perform complex cognitive
> tasks threatens to undermine education at scale. This **effortless bypass dilemma**
> sharpens a challenge AIED has long engaged with but must now confront directly: ensuring
> learners **choose** effortful engagement when easier alternatives are available."

The five directions it names:
1. Supporting autonomy and agency
2. **Building learner resilience to metacognitive threats**
3. Designing for interest and relevance
4. **Amplifying process-based assessment**
5. Empowering teachers

**Read:** the field's problem is no longer *"can AI teach?"* It is *"why would a learner
with ChatGPT in their pocket do the hard thing at all?"* That is a **product** problem, not
a research problem. Directions 2 and 4 are the most product-shaped.

## 11. The new failure mode: metacognitive decoupling

AI does not only reduce effort — it **breaks the learner's ability to judge their own
understanding.**

- *Beyond the Steeper Curve: AI-Mediated Metacognitive Decoupling* (arXiv 2603.29681):
  AI-assisted performance diverges from actual comprehension; learners overestimate mastery
  because the system silently covers gaps they never notice.
- *Curiosity and Metacognition* (arXiv 2604.25648, 2026): LLMs give "confident but
  potentially inaccurate answers, **fostering false competence**." Learners then fail to
  detect the knowledge gaps that would have triggered curiosity in the first place.

**This problem did not exist in 2020.** It is new, universal, measurable, and essentially
nobody is building a product for it.

**Why it matters to us:** calibration — the gap between confidence and competence — is a
*quantitative* object (Brier score, reliability curves). It is the rare pedagogical problem
that is natively a data-science problem.

## 12. A cheap, powerful, replicated behavioural lever

*Warning About AI Fallibility Increases Help-Seeking in an Intelligent Tutoring System*
(arXiv 2606.03822, June 2026):

> Students **warned that the AI might be wrong requested significantly more hints** than
> students who were not — **even though the system behaved identically.**

Telling a learner the machine is fallible changes their behaviour toward verification and
active engagement. **The intervention is free.** Nobody ships it.

## 13. Assessment has quietly broken

The homework/product-as-evidence model is dead: teachers report submitted work whose polish
"does not match in-class performance." The consensus fix is **process-based assessment** —
judge drafts, reasoning and defence, not the artefact.

Nobody has built the scalable version of this. The classroom answers are all manual (more
in-class work, more observation) and therefore do not scale — which is exactly the shape of
problem an AI product should attack.

UNESCO is asking *"what's worth measuring?"* as an open question in 2026.

## 14. Gaming the system — an old, quantified, unfixed problem

- Students who game the system learn **only two-thirds as much** as similar students.
- Detectable by ML models (a 20-year literature).
- 2026 nuance: answer-first behaviour can be *rational* self-regulation under time pressure,
  not laziness — so punishing it is the wrong response.

## 15. Where gamification actually under-serves learners

Systematic review of gamified motivational architectures (Frontiers, 2026):

| Component | Share of designs |
|---|---|
| Challenge | **68.85%** |
| Feedback / narrative | second tier |
| **Curiosity** | **18.85%** |
| **Autonomy** | **18.85%** |

Every product reaches for challenge. **Curiosity and autonomy are three times rarer** — and
they are two of the three basic needs in self-determination theory.

## 16. Genuinely underexplored: AI in *groups*

Systematic review of AI agents in computer-supported collaborative learning (2026): the role
of generative AI in mediating **in-person group work** "remains underexplored."

Nearly all AI tutoring is 1:1. Nerdy runs **live group classes**. Real-time group dynamics —
who is silent, when the group has converged on a wrong answer, when to provoke — is open
ground with direct business fit.

## 17. What is newly technically possible in 2026

- **Speech-to-speech under 200ms.** Native audio models (no STT→LLM→TTS chain) with
  interruption handling, prosody, and **emotion detection in the learner's voice**.
  Realistic production latency 1.5–2.5s once turn detection and tool calls are added — plan
  for that number, not the marketing one.
- Voice removes the typing barrier for young children entirely.
- **Self-explanation** — saying your reasoning aloud — is one of the largest effects in
  learning science, and voice is finally the natural interface for it.

## 18. Revised strategic openings

| # | Opening | Evidence |
|---|---|---|
| **E** | **Calibration: make "what you *think* you know vs what you know" visible and fixable** | §11 — new problem, quantitative, unserved |
| **F** | **Verification of understanding at scale — the 60-second viva** | §13 — assessment is broken and every manual fix fails to scale |
| **G** | **Designed fallibility — an AI you must check** | §12 — replicated behavioural lever, free to implement, nobody ships it |
| **H** | **AI inside group learning, not 1:1** | §16 — explicitly underexplored; matches Nerdy's live group classes |
| **I** | **Build for curiosity and autonomy, not challenge** | §15 — 3× under-served in shipped designs |
