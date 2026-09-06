# KILL-TEST RESULTS 5 — Play β (disengagement prediction from real data)

4 Sep 2026. Harness `evals/killtest_beta.py`. Data: UCI Student Performance (Cortez 2008),
1,044 real students across two courses. Model: logistic regression from scratch in numpy
(no sklearn present). AUC by hand (rank statistic). **No simulated learners** (D-023 safe).

| Test | Result | Verdict |
|---|---|---|
| Obtain + load real labelled student data | UCI #320, clean | **PASS** |
| Predict disengagement-linked outcome above baseline | **AUC 0.72**, beats majority | **PASS** |
| Fast enough for "real-time" | **<1 µs/student**, train 17 ms | **PASS** |

---

## What was tested

Predict **course failure** (final grade < 10) from **behaviour only** — `failures`,
`absences`, `studytime`, `goout`, `Dalc/Walc`, `freetime`, support flags, aspiration, etc.
**G1/G2/G3 excluded**, so the model is not reading a grade off another grade. Failure is a
*disengagement-linked* outcome; behaviour is what's available before it.

Held-out 25% of students, never seen in training.

| Course | n | AUC (held-out) | Accuracy vs majority baseline |
|---|---|---|---|
| Portuguese | 649 | **0.717** | 0.865 vs 0.853 |
| Maths | 395 | **0.729** | 0.717 vs 0.677 |

Top learned signals (both courses): **past failures, going out, absences, study time,
aspiration to higher ed (protective)** — pedagogically sensible, not noise. The model found
real structure, not artefacts.

---

## Why this result matters more than the number

**AUC 0.72 is modest.** It is not a magic predictor and the submission will say so. But the
*kind* of result is what matters: this is the **first concept in the entire project whose
core claim survived contact with real data.**

Every earlier idea died because its central claim needed something we could not get honestly:
- Viva / misconception: needed a faithful simulated learner — impossible (D-023).
- Fallible tutor: needed the LLM to be reliably wrong — impossible (D-024).
- α: the hard part was routed *away* from the AI into a calculator (critic #2).

Here the hard part **is** a trained model doing real inference on real behavioural data, with
a proper held-out evaluation and an honest metric. That is an ML/data-science artefact — the
exact thing the last three concepts hid. It answers the critic's recurring "where is the AI?"
with: *a model, trained and evaluated, not a system prompt.*

Speed is a non-issue: 17 ms to train, sub-microsecond to score a student. "Real-time" is free.

---

## Honest gaps (must be stated in the submission)

1. **Proxy dataset.** UCI is survey + behaviour → final grade. It is **not** clickstream and
   not real-time. It proves the *method* (behaviour predicts disengagement-linked outcomes),
   not the real-time product. The product vision needs interaction-log data (OULAD /
   ASSISTments). **OULAD download from UCI was truncated at source today** — obtaining a clean
   clickstream set is an open build task, with UCI #320 as the proven fallback for the method.
2. **"Failure" ≠ "disengagement."** It is a reasonable, defensible proxy, not the thing itself.
3. **The 2026 bypass-to-AI signal has no dataset.** The method transfers in principle; the
   bypass-specific claim cannot be validated on existing data and will be flagged as frontier.
4. **AUC 0.72 is honest-modest.** We report it as "meaningfully better than chance and than
   baseline on held-out real students," never as a solved problem.

---

## Verdict

β's core — *the hard AI problem is real, learnable from real data, and I can build and
evaluate it* — **passes.** This is the strongest position the project has reached: a genuine
ML result on genuine data, honestly measured, that showcases the author as an AI engineer
rather than a prompt writer.

**Not yet greenlit.** The kill-test proves the *method*. Before committing β as the build we
still need: (1) the product shape that turns this detector into a 3-minute demo, (2) a clean
real-time-ish dataset or an honest way to stage the real-time story, (3) the single demo
moment. Those are design questions for the next step — but for the first time, the
foundation under them is real.
