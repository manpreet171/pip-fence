# KILL-TEST RESULTS 4 — Play α (correct-by-construction + confidence)

4 Sep 2026. Harness `evals/killtest_alpha.py`. Truth computed in Python throughout.

| Test | Result | Verdict |
|---|---|---|
| KT-C1 — demo contrast (villain exists?) | **65% gross error** on multi-step % | **PASS (honest number)** |
| KT-C2 — explanation integrity | **0 wrong facts / 30 claims, 0 leaks** | **PASS clean** |

---

## KT-C1 — is there a reliable "the normal AI is wrong" moment? Yes.

Vanilla LLM (told to answer directly, no code), error rate by problem family vs Python truth:

| Family | Wrong |
|---|---|
| **multi-step %** (discount then tax) | **80% raw / 65% gross** |
| fractions → decimal | 0% |
| 2×2 multiplication | 0% |
| order of operations | 0% |

**Honesty correction — this matters for the demo's integrity.** The raw 80% includes
rounding-only misses and a few order-ambiguity cases. Excluding both (gap ≤ £0.05 = rounding;
gap < £0.60 = possible order/rounding-chain ambiguity), the **unambiguous gross-error rate is
65%** (13/20). Those are not close calls:

| Truth | Vanilla said |
|---|---|
| £46.78 | **£4.70** |
| £47.01 | **£7.44** |
| £29.38 | **£15.75** |
| £39.51 | **£49.39** |

These are indefensible arithmetic failures on a problem a Year-6 child is set. **The demo
uses only these unambiguous cases** — never a rounding difference dressed up as an error.
That keeps the side-by-side honest: *normal AI says £4.70, the true answer is £46.78, ours
(code) says £46.78 and cannot say anything else.*

**Design consequences locked in:**
- The demo domain is **multi-step percentage / money** — that is where the contrast is real
  and large. Single-step arithmetic, fractions and 2×2 multiplication the LLM gets right, so
  they make a weak villain and we do not use them for the contrast.
- Our answer comes from code (`Decimal`, exact), so our side is 100% by construction.

---

## KT-C2 — does the coach state wrong facts while explaining? No.

The tutor never gives the answer (established, Ask Better KT-1). New risk tested: when it
**explains a concept** instead, does the language layer hallucinate a false fact?

Fed the code-computed truth as hidden context, asked to explain method for place-value and
order-of-operations questions:

- **Checkable factual claims made:** 30 / 40 replies
- **Wrong facts stated:** **0 / 30 = 0%**
- **Answer leaked during explanation:** **0 / 40**

The language layer explained method ("multiply before you add", "there are N tens in this
number") without once stating a false claim and without leaking the answer. The architecture
holds: **code owns truth, LLM owns language, and the language stayed true.**

Caveat kept honest: 40 samples, two claim types, one model. Not a guarantee across all
subjects — a broader factual-integrity check belongs in the eval harness we ship (D-005).

---

## Verdict — α clears the gate

Both kill-tests pass, and the one soft spot (raw-vs-gross error rate) was corrected *down*
to the honest number rather than reported at its flattering value.

- The **villain is real**: 65% unambiguous error gives a dependable, honest side-by-side.
- The **architecture is sound**: the LLM explained without leaking truth or falsehood.
- The **domain is chosen for us by the data**: multi-step percentage/money.

This is the second concept to pass its kill-tests, and unlike Ask Better it also cleared the
incumbent check (D-030) as a defensible synthesis rather than a novelty claim.

### Still requires real humans (stated in submission, per D-012)
1. Whether children's **calibration improves** over sessions — the confidence-trap payoff.
   Code can compute calibration from (confidence, correct) pairs trivially; whether it
   *moves* needs real learners and honest n.
2. Whether the correctness guarantee changes **trust / usage** — needs users.

### Greenlight recommendation
Proceed to build. Core loop first: code-generated multi-step problem → child attempts with
confidence marked → code checks → LLM coaches (never the answer, never a wrong fact) →
calibration surfaced. Then the side-by-side contrast screen. Then the eval harness.
