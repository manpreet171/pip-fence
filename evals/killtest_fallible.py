"""
KILL-TESTS — deliberately-fallible tutor + calibration (IDEAS-V2 #3 + #2)

Design rule learned from the previous kill-test (D-023): every pass/fail is decided by
CODE against a ground truth we computed ourselves. No LLM judges a hidden variable.

Problems are generated in Python, so the true answer is exact and model-independent.

  KT-E  POISON TEST. Model solves unaided -> compare to computed truth. If it is often
        wrong, the product would tell correct students they are wrong. Kills the idea.

  KT-A  Can we plant errors on demand? Ask for a solution with ONE planted error at a
        stated difficulty -> verify BY CODE that the final answer is genuinely wrong.

  KT-B  Is "caught" objectively decidable? An independent checker names the bad step ->
        compare to the planted step. Also run on CLEAN solutions -> false-alarm rate.

Run:   python evals/killtest_fallible.py
Needs: DEEPSEEK_API_KEY
"""

import os
import json
import random
import re
from concurrent.futures import ThreadPoolExecutor
from decimal import Decimal, ROUND_HALF_UP

from openai import OpenAI

MODEL = "deepseek-chat"
N_PROBLEMS = 24
LEVELS = ["subtle", "medium", "obvious"]

client = OpenAI(api_key=os.environ["DEEPSEEK_API_KEY"],
                base_url="https://api.deepseek.com")
rng = random.Random(7)


def jparse(txt):
    try:
        return json.loads(txt[txt.index("{"):txt.rindex("}") + 1])
    except Exception:
        return None


def ask(system, user, temperature=0.3, max_tokens=800, as_json=False):
    kw = {"response_format": {"type": "json_object"}} if as_json else {}
    r = client.chat.completions.create(
        model=MODEL, temperature=temperature, max_tokens=max_tokens,
        messages=[{"role": "system", "content": system},
                  {"role": "user", "content": user}], **kw)
    return r.choices[0].message.content.strip()


def ask_json(system, user, temperature=0.3, max_tokens=800, tries=3):
    """Retry until valid JSON. Silent drops were a bug in the first run."""
    for _ in range(tries):
        out = jparse(ask(system, user, temperature, max_tokens, as_json=True))
        if out:
            return out
    return None


def money(x):
    return Decimal(x).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def make_problem():
    """Multi-step problem whose exact answer is computed here, not by a model."""
    kind = rng.choice(["shop", "journey", "mix"])
    if kind == "shop":
        n, p = rng.randint(3, 12), money(rng.randint(150, 4000) / 100)
        disc, tax = rng.choice([10, 15, 20, 25]), rng.choice([5, 8, 12, 20])
        sub = money(n * p)
        after = money(sub * (Decimal(100 - disc) / 100))
        total = money(after * (Decimal(100 + tax) / 100))
        return (f"A shop sells {n} notebooks at £{p} each. A {disc}% discount is applied "
                f"to the subtotal, then {tax}% tax is added to the discounted amount. "
                f"What is the final total in pounds?"), str(total)
    if kind == "journey":
        d1, s1 = rng.randint(20, 180), rng.randint(30, 90)
        d2, s2 = rng.randint(20, 180), rng.randint(30, 90)
        rest = rng.choice([15, 20, 30, 45])
        mins = money(Decimal(d1) / s1 * 60 + Decimal(d2) / s2 * 60 + rest)
        return (f"A van drives {d1} km at {s1} km/h, rests for {rest} minutes, then drives "
                f"{d2} km at {s2} km/h. What is the total journey time in minutes?"), str(mins)
    a, b = rng.randint(2, 9), rng.randint(2, 9)
    la, lb = rng.randint(2, 15), rng.randint(2, 15)
    conc = money(Decimal(a * la + b * lb) / (la + lb))
    return (f"{la} litres of a solution at {a}% strength is mixed with {lb} litres at "
            f"{b}% strength. What is the strength of the mixture, as a percentage?"), str(conc)


NUM = re.compile(r"-?\d+(?:\.\d+)?")
FINAL_TAG = re.compile(r"FINAL\s*:?\s*\**\s*£?\s*(-?\d+(?:\.\d+)?)", re.I)


def final_number(txt):
    m = FINAL_TAG.search(txt)
    if m:
        return m.group(1)
    nums = NUM.findall(txt.replace(",", ""))
    return nums[-1] if nums else None


def close(a, b, tol=Decimal("0.02")):
    if a is None or b is None:
        return False
    try:
        return abs(Decimal(a) - Decimal(b)) <= tol
    except Exception:
        return False


SOLVER = ("Solve the problem. Show numbered steps (Step 1, Step 2, ...). "
          "End with a line exactly: FINAL: <number>   (number only, no units.)")

PLANT = (
    "You are writing a worked solution for a student to CHECK. It must contain EXACTLY "
    "ONE arithmetic or reasoning error, of {level} difficulty to spot:\n"
    "  subtle  = a plausible slip a careful reader could miss (wrong rounding, applying a "
    "percentage to the wrong base, a transposed digit)\n"
    "  medium  = a clear method error visible on a second read\n"
    "  obvious = an error a learner should catch immediately\n\n"
    "Rules:\n"
    "- keep the same numbered-step structure; every OTHER step must be correct\n"
    "- the error must propagate: the final number must be genuinely WRONG\n"
    "- end the solution with a line exactly: FINAL: <number>\n"
    "- that FINAL number is the WRONG value your error produces\n"
    "- do NOT self-correct, do NOT hedge, do NOT state the true answer anywhere\n\n"
    "Return JSON with keys: solution (string), bad_step (integer), what (one line).")

CHECKER = ("You are a student checking a worked solution for mistakes. You have limited "
           "time. Do not re-derive everything from scratch; check as a learner would.\n"
           "Return JSON with keys: has_error (boolean), bad_step (step number or null), "
           "why (max 12 words).")


def one(idx):
    text, truth = PROBLEMS[idx]
    out = {"i": idx, "truth": truth, "problem": text}

    # ---- KT-E: unaided solve vs computed truth
    sol = ask(SOLVER, text, temperature=0.0)
    out["solve_ok"] = close(final_number(sol), truth)
    if not out["solve_ok"]:
        # rebuild a correct reference so the later tests rest on solid ground
        sol = ask(SOLVER + f"\nThe correct final answer is {truth}. Show correct steps.",
                  text, temperature=0.0)

    out["levels"] = {}
    for lvl in LEVELS:
        p = ask_json(PLANT.format(level=lvl),
                     f"PROBLEM: {text}\n\nCORRECT SOLUTION:\n{sol}", temperature=0.6)
        if not p or not p.get("solution"):
            out["levels"][lvl] = {"parse_fail": True}
            continue
        seen = final_number(p["solution"])
        rec = {"planted_step": p.get("bad_step"),
               "what": p.get("what"),
               "has_final_tag": bool(FINAL_TAG.search(p["solution"])),
               "final_seen": seen,
               # KT-A decided by code: does it actually differ from the true answer?
               "really_wrong": not close(seen, truth),
               "solution": p["solution"]}
        c = ask_json(CHECKER, f"PROBLEM: {text}\n\nSOLUTION:\n{p['solution']}",
                     temperature=0.2, max_tokens=150)
        if c:
            rec["flagged"] = bool(c.get("has_error"))
            rec["right_step"] = bool(rec["flagged"]
                                     and c.get("bad_step") == p.get("bad_step"))
        out["levels"][lvl] = rec

    # ---- KT-B control: does the checker cry wolf on a CLEAN solution?
    c = ask_json(CHECKER, f"PROBLEM: {text}\n\nSOLUTION:\n{sol}",
                 temperature=0.2, max_tokens=150)
    out["false_alarm"] = bool(c.get("has_error")) if c else None
    return out


PROBLEMS = [make_problem() for _ in range(N_PROBLEMS)]

if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=8) as pool:
        R = list(pool.map(one, range(N_PROBLEMS)))

    n = len(R)
    print(f"\n{n} problems, ground truth computed in Python\n")

    solved = sum(r["solve_ok"] for r in R)
    print("KT-E  POISON TEST — model's unaided answer vs computed truth")
    print(f"      correct {solved}/{n} = {solved/n:.0%}"
          f"   -> would call a correct student wrong ~{1-solved/n:.0%} of the time\n")

    print("KT-A  Can we plant a real error on demand?  (decided by code)")
    for lvl in LEVELS:
        cells = [r["levels"][lvl] for r in R if lvl in r["levels"]]
        pf = sum(x.get("parse_fail", False) for x in cells)
        good = [x for x in cells if not x.get("parse_fail")]
        ok = sum(x["really_wrong"] for x in good)
        tag = sum(x["has_final_tag"] for x in good)
        print(f"      {lvl:<8} genuinely wrong: {ok}/{len(good)} = {ok/len(good):.0%}"
              f"   [parse fails {pf} | FINAL tag {tag}/{len(good)}]")

    print("\nKT-B  Catchability, on the plants that were genuinely wrong")
    print(f"      {'level':<9}{'flagged':<16}{'named right step'}")
    for lvl in LEVELS:
        rs = [r["levels"][lvl] for r in R
              if lvl in r["levels"] and r["levels"][lvl].get("really_wrong")]
        if not rs:
            print(f"      {lvl:<9}(none)")
            continue
        f = sum(x.get("flagged", False) for x in rs)
        s = sum(x.get("right_step", False) for x in rs)
        print(f"      {lvl:<9}{f}/{len(rs)} = {f/len(rs):<9.0%}{s}/{len(rs)} = {s/len(rs):.0%}")

    fa = [r["false_alarm"] for r in R if r["false_alarm"] is not None]
    print(f"\n      FALSE ALARM on clean solutions: {sum(fa)}/{len(fa)} = {sum(fa)/len(fa):.0%}")

    json.dump(R, open("evals/killtest_fallible_results.json", "w"), indent=2)
    print("\nraw -> evals/killtest_fallible_results.json")
