# KILL-TEST RESULTS — the 60-second viva (IDEAS-V2 #1)

3 Sep 2026. Tests run before any product code, per D-021.

| Test | Result |
|---|---|
| 1. ASR on children's speech | **Blocked** — no ASR key, no child-speech sample |
| 2. End-to-end latency | **Pass** — ~1.5 s per turn, acceptable for a viva |
| 3. Does a viva separate understanding from copying? | **Invalid — and it exposed a deeper problem** |

---

## Test 2 — latency: pass

Measured on the reasoning leg (streaming, short examiner question):

| | median | range |
|---|---|---|
| Time to first token | 446 ms | 366–964 ms |
| Full short response | 713 ms | 610–1161 ms |

Plus speech-in (VAD + turn detection, ~300–700 ms) and speech-out (TTS first audio,
~150–400 ms) → **realistic turn ≈ 1.5 s**.

That is fine for this use. A viva is not casual chat; a short pause while the examiner
"thinks" reads as natural rather than broken. **Latency is not the risk.**

---

## Test 3 — discrimination: the result

Harness: `evals/killtest_viva.py`. 3 work samples (maths, science, English argument),
2 personas (understands / copied-but-fluent), 3 trials each, 18 runs. Question generator,
student personas and judge were separate calls; the judge never saw the persona label.

| Work | Understands | Copied | Gap |
|---|---|---|---|
| maths-fractions | 90 | 93 | **−3** |
| science-seasons | 87 | 93 | **−6** |
| english-argument | 85 | 90 | **−4** |
| **overall** | **87** (82–92) | **92** (85–95) | **−4** |

**The copier scored higher than the genuine student in every single subject.**

### Why — read the transcripts

The "copied" persona was instructed it could not reason beyond the words in the submission.
It then produced this, unprompted:

> *"Dividing by a half is like asking how many halves fit into the number, and since a half
> is smaller than a whole, more halves fit in, so the answer gets bigger."*

That is a genuinely deep conceptual explanation. **It appears nowhere in the submission**,
which only says "flip and multiply, 6/4, 3/2."

The simulator did not hold its assigned limitation. It could not.

Meanwhile the "understands" persona, written to sound like a real Year 6 child, produced:

> *"It'd be smaller, because dividing by a bigger number makes the answer smaller. So yeah,
> smaller."* — and a slightly muddled pizza analogy.

The judge scored the polished bluffer **92** and the authentic child **85**.

### Two findings, and the second one matters more

**Finding 1 — the test is invalid.** LLM-simulated students cannot hold an assigned lack of
understanding. This is exactly the failure documented in *"Simulating Students or Sycophantic
Problem Solving?"* (arXiv 2605.12748) — now reproduced in our own harness. **This idea
cannot be validated with simulated learners. At all.**

**Finding 2 — the judge rewards fluency over substance.** It marked hesitant, imperfect,
authentic child speech *below* confident, well-structured bluffing. For a product whose
entire job is to tell those two apart, that is not a bug to tune away — it is the failure
mode pointing straight at the core claim.

---

## The consequence, stated plainly

The product's central claim is *"we can tell whether you actually understand."*

Validating that claim requires **real human learners** — some who understand, some who
copied — and there is no way to synthesise them. Which means:

> **We cannot demonstrate that this product works within the hackathon.**

And "we measure what we claim" was our entire differentiator (D-005). Shipping this would
mean shipping an unvalidated claim — the exact thing we criticised the rest of the field for
in `RESEARCH.md` §5.

**That is a strike against the idea, and it is not a small one.**

---

## Options

**A — Narrow the claim to something testable.**
Stop claiming copy-detection. Claim only: *"here is which parts of your work you can and
cannot explain."* That **is** testable against public datasets of real student short answers
with expert grades (SemEval SciEntsBank / Beetle, ASAP-SAS) — real humans, real labels, a
real agreement number.
*Cost:* the claim becomes automated short-answer grading, a 15-year-old field with existing
benchmarks. We would be back on occupied ground — the same trap that killed concept v1.

**B — Keep the viva, run the validation by hand.**
Recruit real humans: a few people who genuinely know a topic and a few who paste from an AI.
20 vivas, hand-scored. Small n, but real.
*Cost:* ~1–2 days, depends on people being available, and n will be too small to be
convincing on its own.

**C — Drop it and take another candidate from `docs/IDEAS-V2.md`.**
Cheapest option, and consistent with the method we adopted in D-020: an idea whose central
claim cannot be validated should die at the kill-test, not be argued back to life.

---

## What the failed test was worth

Two days of build were not spent. The harness cost about twenty minutes and roughly a
hundred cheap API calls.

It also produced something genuinely reusable: **empirical confirmation, in our own data,
that LLM student simulators cannot be trusted to hold a misconception.** That finding
invalidates *any* future concept in this project that depends on a simulated learner —
including "Max" from concept v1, who would have failed in exactly this way had it been
built.
