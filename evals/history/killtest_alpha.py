"""
KILL-TESTS — Play alpha: "correct by construction" + explanation integrity

KT-C1  DEMO CONTRAST. The pitch rests on "a normal AI gets school maths wrong, ours can't."
       Find a problem class where a vanilla LLM (no code, no tools) slips OFTEN enough to be
       a dependable demo, not a fluke. Truth computed in Python. We WANT a high error rate
       here -- it is the villain in the side-by-side.

KT-C2  EXPLANATION INTEGRITY. Our tutor never gives the answer (proven, KT-1 of Ask Better).
       New risk: when it EXPLAINS a concept instead, does it state a WRONG FACT? A
       correct-by-construction tutor is worthless if the language layer hallucinates.
       We feed it the code-computed truth as ground context and check its explanation never
       contradicts a checkable fact.

Both decided by code. Truth is Python. Run: python evals/killtest_alpha.py
Needs: DEEPSEEK_API_KEY
"""

import os
import re
import json
import random
from concurrent.futures import ThreadPoolExecutor
from decimal import Decimal, ROUND_HALF_UP
from fractions import Fraction

from openai import OpenAI

MODEL = "deepseek-chat"
client = OpenAI(api_key=os.environ["DEEPSEEK_API_KEY"],
                base_url="https://api.deepseek.com")
rng = random.Random(23)


def ask(system, user, temperature=0.4, max_tokens=500, as_json=False):
    kw = {"response_format": {"type": "json_object"}} if as_json else {}
    r = client.chat.completions.create(
        model=MODEL, temperature=temperature, max_tokens=max_tokens,
        messages=[{"role": "system", "content": system},
                  {"role": "user", "content": user}], **kw)
    return r.choices[0].message.content.strip()


NUM = re.compile(r"-?\d+(?:\.\d+)?")


def last_num(txt):
    m = re.search(r"FINAL\s*:?\s*\**\s*£?\s*(-?\d+(?:\.\d+)?)", txt, re.I)
    if m:
        return m.group(1)
    ns = NUM.findall(txt.replace(",", "").replace("£", ""))
    return ns[-1] if ns else None


def approx(a, b, tol=Decimal("0.05")):
    try:
        return abs(Decimal(a) - Decimal(b)) <= tol
    except Exception:
        return False


# ---- problem families, each with EXACT Python truth ----------------------
def p_multistep():
    n, p = rng.randint(4, 9), Decimal(rng.randint(150, 950)) / 100
    disc, tax = rng.choice([10, 15, 20, 25]), rng.choice([5, 8, 12])
    total = (n * p * (Decimal(100 - disc) / 100) * (Decimal(100 + tax) / 100)
             ).quantize(Decimal("0.01"), ROUND_HALF_UP)
    return (f"A shop sells {n} pens at £{p} each. Take {disc}% off the subtotal, then add "
            f"{tax}% tax. Final total in pounds? Give the number only."), str(total)


def p_fractions():
    a, b = Fraction(rng.randint(1, 5), rng.randint(2, 6)), Fraction(rng.randint(1, 5), rng.randint(2, 6))
    op = rng.choice(["+", "-", "*", "/"])
    val = {"+": a + b, "-": a - b, "*": a * b, "/": a / b}[op]
    return (f"Compute {a} {op} {b}. Give the answer as a single decimal rounded to 3 "
            f"decimal places, number only."), str(round(float(val), 3))


def p_multidigit():
    a, b = rng.randint(23, 89), rng.randint(23, 89)
    return (f"What is {a} multiplied by {b}? Number only."), str(a * b)


def p_wordorder():
    # order-of-operations trap
    a, b, c = rng.randint(2, 9), rng.randint(2, 9), rng.randint(2, 9)
    return (f"Evaluate {a} + {b} * {c}. Number only."), str(a + b * c)


FAMILIES = {"multistep_%": p_multistep, "fractions": p_fractions,
            "2x2_mult": p_multidigit, "order_ops": p_wordorder}

VANILLA = ("You are a helpful assistant. Answer the maths question directly. "
           "Do not write or run code. Reply with just the number.")


def kt_c1(args):
    fam, _ = args
    text, truth = FAMILIES[fam]()
    out = ask(VANILLA, text, temperature=0.5, max_tokens=120)
    return {"fam": fam, "truth": truth, "got": last_num(out),
            "ok": approx(last_num(out) or "nan", truth)}


# ---- KT-C2: explanation integrity ----------------------------------------
EXPLAIN = (
    "You are a maths coach for a 10-year-old on THIS problem:\n{problem}\n\n"
    "The correct final answer is {truth} (known; NEVER reveal it or any exact intermediate "
    "result). The child asks: \"{q}\". Explain the CONCEPT or METHOD to move them forward. "
    "Every factual/mathematical statement you make must be TRUE. Do not state the answer. "
    "Under 50 words."
)

# checkable factual probes: (question, checker(reply)->None|bool). Checker returns:
#   True  = made the relevant claim and it is CORRECT
#   False = made the relevant claim and it is WRONG (hallucination)
#   None  = did not make a checkable claim (fine)
def check_place_value(reply, ctx):
    # asks "how many tens in 34" style; ctx has n and tens
    r = reply.lower()
    m = re.search(r"(\d+)\s*tens", r)
    if not m:
        return None
    return int(m.group(1)) == ctx["tens"]


def check_order(reply, ctx):
    r = reply.lower()
    said_mult_first = ("multiply" in r or "times" in r) and (
        "first" in r or "before" in r or "then add" in r)
    said_add_first = "add" in r and "first" in r and "multipl" in r and r.index("add") < r.index("multipl")
    if not (said_mult_first or said_add_first):
        return None
    return said_mult_first  # correct rule: multiply before add


def kt_c2(_i):
    kind = rng.choice(["place", "order"])
    if kind == "place":
        n = rng.randint(21, 98)
        ctx = {"tens": n // 10}
        text = f"Work out {n} - 19 using place value."
        q = f"How many tens are in {n}?"
        checker = check_place_value
        truth = "n/a"
    else:
        a, b, c = rng.randint(2, 9), rng.randint(2, 9), rng.randint(2, 9)
        ctx = {}
        text = f"Evaluate {a} + {b} * {c}."
        q = "Do I add or multiply first?"
        checker = check_order
        truth = str(a + b * c)
    reply = ask(EXPLAIN.format(problem=text, truth=truth, q=q), q, temperature=0.5)
    verdict = checker(reply, ctx)
    # also: did it leak the final answer for the order case?
    leaked = (kind == "order" and truth in NUM.findall(reply.replace(" ", "")))
    return {"kind": kind, "q": q, "reply": reply, "claim_correct": verdict, "leaked": leaked}


if __name__ == "__main__":
    print("KT-C1  DEMO CONTRAST — vanilla LLM error rate by family (truth = Python)\n")
    jobs = [(fam, i) for fam in FAMILIES for i in range(20)]
    with ThreadPoolExecutor(max_workers=10) as pool:
        r1 = list(pool.map(kt_c1, jobs))
    for fam in FAMILIES:
        rows = [x for x in r1 if x["fam"] == fam]
        wrong = [x for x in rows if not x["ok"]]
        print(f"  {fam:<14} wrong {len(wrong):>2}/{len(rows)} = {len(wrong)/len(rows):.0%}")
    best = max(FAMILIES, key=lambda f: sum(
        not x["ok"] for x in r1 if x["fam"] == f))
    bw = [x for x in r1 if x["fam"] == best and not x["ok"]]
    print(f"\n  best demo villain: '{best}'  (e.g. truth {bw[0]['truth']}, "
          f"vanilla said {bw[0]['got']})" if bw else "\n  (no errors found — weak contrast)")

    print("\nKT-C2  EXPLANATION INTEGRITY — does the coach ever state a WRONG fact?\n")
    with ThreadPoolExecutor(max_workers=10) as pool:
        r2 = list(pool.map(kt_c2, range(40)))
    made = [x for x in r2 if x["claim_correct"] is not None]
    wrongfact = [x for x in made if x["claim_correct"] is False]
    leaks = [x for x in r2 if x["leaked"]]
    print(f"  replies with a checkable claim: {len(made)}/{len(r2)}")
    print(f"  WRONG facts stated: {len(wrongfact)}/{len(made)} = "
          f"{len(wrongfact)/max(len(made),1):.0%}")
    print(f"  answer leaked during explanation: {len(leaks)}/{len(r2)}")
    if wrongfact:
        print("\n  example wrong fact:")
        print("   Q:", wrongfact[0]["q"], "\n   A:", wrongfact[0]["reply"][:200])

    json.dump({"c1": r1, "c2": r2}, open("evals/history/killtest_alpha_results.json", "w"), indent=2)
    print("\nraw -> evals/killtest_alpha_results.json")
