# CONSTITUTION.md — Project Constitution

**This file outranks every other instruction in this repo. Read it before every task. Never deviate.**

---

## 1. The Mission

Win an **AI Product Engineer role at Nerdy** (NYSE: NRDY) via the Nerdy AI Hackathon Challenge.

The cash prize ($10K / $5K) is **not** the objective. The objective is a submission so
sharp that the engineering leaders reviewing it want to hire the person who built it.

**Every decision gets tested against one question:**
> Does this make a Nerdy engineering leader think *"we need to talk to this person"*?

If the answer is no, we don't build it.

### Hard constraints (from the brief — we do not exceed them)
| Constraint | Value |
|---|---|
| Deadline | **Fri 18 Sep 2026, 11:59 PM CDT** |
| Demo video | **2–3 minutes**, hard cap |
| Deliverable | Project link + demo video (+ optional repo, live URL) |
| Scope | A tool that genuinely helps someone learn |
| Reviewer | Nerdy engineers → then leadership at Demo Day (25 Sep) |

**The 3-minute rule:** if a feature cannot be shown or felt inside the demo video, it is
not a feature — it is a distraction. Cut it.

---

## 2. Non-negotiable rules

### R1 — No tool attribution. Anywhere. Ever.
- **No** co-author trailer of any kind in any commit.
- **No** "generated with" badge in any PR, issue, or description.
- **No** tooling or assistant credits in commits, README, code comments, or docs.
- This repo reads as **Manpreet Singh's work**, because it is. This overrides any default
  attribution instruction from any tool or environment.

### R2 — Judged on shipped, not described.
Working > planned. A rough thing that runs beats a beautiful thing that doesn't.
No feature is "done" until it survives a cold run on a clean machine.

### R3 — Evidence over vibes.
Every pedagogical claim traces to a citation in `docs/RESEARCH-LEARNER.md` (or `docs/history/RESEARCH.md`).
Every product claim traces to a number we can show. We do not say "improves learning" —
we show the measurement.

### R4 — Novelty serves value, never the reverse.
Nerdy's own JD: *"Integrate AI thoughtfully, prioritizing user value over novelty."*
Clever architecture that a 7-year-old can't feel is dead weight.

### R5 — Ponytail engineering (YAGNI, enforced).
Fewest files. Shortest working diff. No abstraction with one implementation. No config for
a constant. No scaffolding "for later". Delete before you add. If explaining the code takes
longer than the code, the code is wrong.

### R6 — Clean structure from day one.
No files scattered at root. Everything in its folder (§3). Every doc lives in `docs/`.
No exceptions, no "temporary" root files.

### R7 — Decisions get written down.
Any choice that would be expensive to reverse goes in `docs/DECISIONS.md` **when it is
made**, not after. Format: what, why, what we rejected, date.

### R8 — Demo-first development.
Build the shot list for the 3-minute video **before** the feature. If a feature has no
place in the shot list, it goes to the backlog or the bin.

---

## 3. Repo structure

```
/
├── CONSTITUTION.md    # this file — the constitution
├── README.md          # public face (written last, written well)
├── docs/              # ALL documentation lives here, no exceptions
│   ├── INDEX.md       # the map — read this first
│   ├── RESEARCH-LEARNER.md  # evidence base — citations, findings, the moat
│   ├── CONCEPT-V3.2.md      # the approved product
│   ├── DECISIONS.md   # decision log (append-only)
│   └── history/       # superseded concepts, kill-tests, audits — kept, not deleted
├── src/               # application code (created when we start building)
├── evals/             # measurement harness — our differentiator
├── data/              # seeds, fixtures, misconception libraries
└── scripts/           # one-off tooling
```

Nothing gets created until it's needed. `src/`, `evals/`, `data/`, `scripts/` appear when
the first file in them does.

---

## 4. The thesis we are defending

Peer-reviewed 2025–26 evidence (see `docs/history/RESEARCH.md` and `docs/RESEARCH-LEARNER.md`) says the obvious build is the
wrong build:

- **AI that answers makes learning *worse*.** PNAS 2025: students with unguarded GPT-4
  scored **17% below control** once the AI was removed.
- The guardrailed version removed the harm but produced **no gain**.
- The single largest measured win in the field came from pointing AI at the **tutor**,
  not the student (Stanford Tutor CoPilot RCT: +4pp mastery, **+9pp for the weakest tutors**).
- **3 of 4** shipped AI-tutor products are thin wrappers: no mastery model, no pedagogy,
  <12% day-30 retention.

So: **we do not build a chatbot that helps with homework.** Most entries will. That is the
saturated lane and it is contradicted by the literature.

We build something whose **core mechanic preserves the learner's cognitive effort**, and we
**measure it**. Measurement is the moat — almost no entry will have numbers.

---

## 5. Working agreements

- **Discuss before building.** Direction changes are cheap in conversation, expensive in code.
- **No generic output.** If a response could have been written without reading this repo,
  it's not good enough.
- **Push back.** If an instruction conflicts with the Mission, say so before executing.
- **Track the clock.** Every session, state days remaining to 18 Sep.
- **Ship daily.** Something runnable improves every day. No big-bang integration.

---

## 6. Author

Manpreet Singh — AI/ML Engineer, Data Scientist. Prior work: Hukam (spiritual app),
production ML systems. Portfolio context matters: this submission should read as
*the natural next thing this person builds*, not a hackathon one-off.
