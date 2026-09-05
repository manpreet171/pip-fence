# KILL-TEST RESULTS 2 — fallible tutor + calibration (IDEAS-V2 #3 + #2)

3 Sep 2026. Harness: `evals/killtest_fallible.py`. 24 problems, **ground truth computed in
Python**, so no model opinion enters any pass/fail.

First run had a harness bug (≈15% of calls returned unparseable JSON and were silently
dropped). Fixed — JSON mode plus retries — and re-run. Numbers below are the clean run.

| Test | Result |
|---|---|
| KT-E — is the ground truth safe? | **Marginal fail** — 88% |
| KT-A — can we plant errors on demand? | **Fail** — 12–25% |
| KT-B — is the error catchable? | **Invalid** — my test design broke our own rule |

---

## KT-E — the poison test

Model solves the problems unaided; compare to the Python-computed answer.

**21/24 = 88% correct.** So on multi-step arithmetic it is wrong about **1 time in 8**.

A product that tells a correct child they are wrong 12% of the time is not shippable.
**Mitigation exists and is real:** if the app *generates* the problem, it knows the answer
exactly, and the model never needs to solve anything. But that confines the product to
**procedurally generated content**.

False-alarm rate on clean solutions was low — **4%** — which is the one genuinely good
number in this run.

---

## KT-A — can we make the AI wrong on purpose? No.

Asked for a worked solution containing exactly one planted error, with an explicitly wrong
FINAL line, "do not self-correct":

| Difficulty | Final answer genuinely wrong |
|---|---|
| subtle | **3/24 = 12%** |
| medium | **5/20 = 25%** |
| obvious | **5/21 = 24%** |

Parse failures ~0. FINAL tag present in ~100% of outputs. **This is not a harness artifact.**

**Three quarters of the time the model produced the correct answer while claiming to have
planted an error.** One example — asked for a subtle error, it returned the true answer
(134.74) and then wrote:

> *"the intended error is that the rounding is incorrect because 134.7433 is closer to 135
> than to 134.74 when considering the nearest minute, but the problem asks for total journey
> time in minutes, so the correct rounding to the nearest minute is 135, not 134.74."*

It argued itself back to correct and confabulated an error it had not made.

---

## KT-B — invalid, and the mistake is mine

I used an LLM as a stand-in for the learner doing the checking. **D-023 forbids exactly
that** — an LLM cannot faithfully hold limited effort or limited knowledge. The catch rates
(0% / 20% / 40%) measure the simulator, not a child.

Recording it as invalid rather than quietly presenting it as a finding.

---

## The finding that outlives this idea

Two kill-tests, two different mechanisms, same wall:

> **An LLM cannot be reliably wrong.**
> It will not hold assigned ignorance (`KILLTEST-RESULTS.md`), and it will not commit to a
> planted error (KT-A). In both cases it drifts back to the correct answer and then
> confabulates a justification for having done what it was told.

Measured in our own data, twice. This is a hard constraint on this project, not a tuning
problem.

---

## Capability map — what we now *know* we can and cannot rely on

Earned in about an hour of testing. This is the real asset from today.

| Capability | Status |
|---|---|
| Generate problems with exact known truth (Python) | ✅ reliable |
| Generate controlled **wrong** answers in code | ✅ reliable |
| LLM writes fluent explanations / dialogue | ✅ reliable |
| LLM turn latency ~1.5 s end-to-end | ✅ acceptable |
| LLM judges explanation quality | ⚠️ **rewards fluency over substance** |
| LLM solves multi-step arithmetic | ⚠️ **88%** — not a source of truth |
| LLM plants a controlled error | ❌ **12–25%** |
| LLM simulates a learner who does not understand | ❌ fails outright |

**Rule that falls out of this:** anything requiring *controlled wrongness* or *known truth*
must be produced by **code**. The LLM is safe as a language layer and unsafe as a source of
truth or of error.

---

## Where this leaves idea #3

**Not dead, but reduced.** The mechanic works only where problems and errors are generated
in code — which means procedurally generatable domains (arithmetic, units, algebra
manipulation), not arbitrary content.

That is the *same* limitation that sank concept v1: it works beautifully in a demo and does
not obviously extend to 3,000 subjects.

**Idea #2 (calibration) is untouched by these results.** Its measurement — stated confidence
vs observed correctness — needs no model to be right about anything and no model to be wrong
on purpose. Both quantities are directly observed. It is the only candidate so far whose
core instrument survives every test we have run.

---

## Method note

Three concepts assessed today, three found broken before any product was built. Total cost:
one afternoon and a few hundred cheap API calls. Zero days of build wasted.

The pattern in all three failures is the same: **we chose by novelty, then discovered the
claim could not be evidenced.** Worth inverting — start from the capability map above, and
choose the strongest product that stands on things already proven to work.
