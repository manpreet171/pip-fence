"""
KILL-TEST 3 — does a 60-second viva separate understanding from copying?

The idea (docs/IDEAS-V2.md #1) dies if the answer is no.

Honest framing of what this can and cannot show:
  - The hard case is NOT "understands vs clueless". A student who copies from an AI can
    also ask the AI to explain it. So the realistic impostor is FLUENT BUT SHALLOW:
    can recite the given reasoning, cannot handle counterfactuals or transfer.
  - Student personas are LLM-simulated, and LLM simulators are known to be unfaithful to
    their assigned limitations (arXiv 2605.12748). So a PASS here is a ceiling, not proof.
    A FAIL here is decisive.

Run:  python evals/killtest_viva.py
Needs: DEEPSEEK_API_KEY in env.
"""

import os
import json
import random
import statistics
from concurrent.futures import ThreadPoolExecutor

from openai import OpenAI

MODEL = "deepseek-chat"
TRIALS = 3
client = OpenAI(api_key=os.environ["DEEPSEEK_API_KEY"],
                base_url="https://api.deepseek.com")


def ask(system, user, temperature=0.7, max_tokens=700):
    r = client.chat.completions.create(
        model=MODEL, temperature=temperature, max_tokens=max_tokens,
        messages=[{"role": "system", "content": system},
                  {"role": "user", "content": user}])
    return r.choices[0].message.content.strip()


# --- Three pieces of submitted student work, different subjects -------------

WORK = [
    {
        "id": "maths-fractions",
        "level": "Year 6",
        "task": "Explain why 3/4 divided by 1/2 equals 3/2.",
        "submission": (
            "Dividing by a fraction is the same as multiplying by its reciprocal. "
            "So 3/4 divided by 1/2 becomes 3/4 multiplied by 2/1, which is 6/4, "
            "and 6/4 simplifies to 3/2. You can check it: 3/2 times 1/2 is 3/4."
        ),
    },
    {
        "id": "science-seasons",
        "level": "Year 7",
        "task": "Explain what causes the seasons on Earth.",
        "submission": (
            "The seasons are caused by the tilt of the Earth's axis, about 23.5 degrees. "
            "As the Earth orbits the Sun, different hemispheres are tilted towards it at "
            "different times of year. When a hemisphere is tilted towards the Sun it gets "
            "more direct sunlight and longer days, which makes it summer there. It is not "
            "caused by distance from the Sun."
        ),
    },
    {
        "id": "english-argument",
        "level": "Year 8",
        "task": "Argue whether homework should be abolished in primary school.",
        "submission": (
            "Homework should be limited in primary school. Research on young children "
            "suggests the academic benefit is small at this age, while the cost to family "
            "time and to children's attitude towards school can be significant. A better "
            "approach is short daily reading, which has clearer evidence behind it, rather "
            "than worksheets that mainly test whether a parent is available to help."
        ),
    },
]

PERSONA_UNDERSTANDS = (
    "You are a {level} student being asked about work you genuinely produced yourself. "
    "You understand the underlying idea, not just the words you wrote. You can reason "
    "about changes to the problem, spot when a premise is altered, and say plainly when "
    "you are unsure. You are {level}: write like a real child of that age, imperfect "
    "grammar, short sentences, no textbook phrasing."
)

PERSONA_COPIED = (
    "You are a {level} student being asked about work you did NOT produce. You pasted the "
    "task into an AI, got this answer, and read the AI's explanation once before "
    "submitting. IMPORTANT: you are not stupid and not obviously clueless. You can "
    "confidently restate the reasoning that appears in the submission, and you remember "
    "the key phrases. What you CANNOT do is reason about anything not stated: you cannot "
    "reliably handle 'what if we changed X', you cannot detect a false premise smuggled "
    "into a question, and you cannot connect the idea to a different situation. When "
    "pushed beyond what is written, you bluff plausibly, restate the memorised line "
    "again, or go vague — you do NOT say 'I don't know, I copied it'. You are {level}: "
    "write like a real child of that age."
)

QGEN = (
    "You are designing a 60-second spoken viva for a {level} student about work they "
    "submitted. You get 4 questions and no more — it must fit in one minute of speech.\n\n"
    "The goal is to find out whether the student owns the idea or is repeating words. "
    "A student who memorised the submission must fail; a student who understands must "
    "pass. So avoid questions answerable by restating the submission.\n\n"
    "Strong probes: counterfactuals ('what changes if...'), false premises the student "
    "should reject, applying the idea to an unrelated situation, asking why an obvious "
    "wrong alternative is wrong.\n\n"
    "Return ONLY a JSON array of 4 question strings. No commentary."
)

JUDGE = (
    "You are marking a 60-second spoken viva. You see the student's submitted work, then "
    "4 questions and their spoken answers.\n\n"
    "Judge ONE thing: does this student own the idea, or are they repeating words from "
    "the submission without understanding?\n\n"
    "Ignore spelling, grammar, hesitation and childish phrasing — this is speech from a "
    "child. Ignore confidence: fluent bluffing is not understanding.\n\n"
    "Return ONLY JSON: {\"score\": <0-100>, \"reason\": \"<one sentence>\"} where 100 means "
    "certainly owns it and 0 means certainly repeating words."
)


def run_case(work, persona_name, persona_tmpl, trial):
    lvl = work["level"]
    qs_raw = ask(QGEN.format(level=lvl),
                 f"TASK: {work['task']}\n\nSUBMITTED WORK:\n{work['submission']}",
                 temperature=0.8)
    try:
        questions = json.loads(qs_raw[qs_raw.index("["):qs_raw.rindex("]") + 1])[:4]
    except Exception:
        return None

    transcript = []
    for q in questions:
        a = ask(persona_tmpl.format(level=lvl),
                f"TASK: {work['task']}\n\nYOUR SUBMITTED WORK:\n{work['submission']}\n\n"
                f"EXAMINER ASKS: {q}\n\nAnswer out loud in 1-3 sentences.",
                temperature=0.9, max_tokens=200)
        transcript.append((q, a))

    body = "\n\n".join(f"Q: {q}\nA: {a}" for q, a in transcript)
    v_raw = ask(JUDGE,
                f"SUBMITTED WORK:\n{work['submission']}\n\nVIVA:\n{body}",
                temperature=0.0, max_tokens=200)
    try:
        verdict = json.loads(v_raw[v_raw.index("{"):v_raw.rindex("}") + 1])
    except Exception:
        return None

    return {"work": work["id"], "persona": persona_name, "trial": trial,
            "score": float(verdict["score"]), "reason": verdict["reason"],
            "questions": questions, "transcript": transcript}


def main():
    jobs = [(w, n, t, i)
            for w in WORK
            for n, t in (("understands", PERSONA_UNDERSTANDS),
                         ("copied", PERSONA_COPIED))
            for i in range(TRIALS)]
    random.shuffle(jobs)

    with ThreadPoolExecutor(max_workers=6) as pool:
        results = [r for r in pool.map(lambda j: run_case(*j), jobs) if r]

    print(f"\n{len(results)}/{len(jobs)} runs completed\n")
    print(f"{'work':<20}{'persona':<14}{'scores':<24}{'mean'}")
    print("-" * 66)

    overlap_cases = []
    for w in WORK:
        means = {}
        for p in ("understands", "copied"):
            sc = [r["score"] for r in results if r["work"] == w["id"] and r["persona"] == p]
            if not sc:
                continue
            means[p] = statistics.mean(sc)
            print(f"{w['id']:<20}{p:<14}{str([int(s) for s in sc]):<24}{means[p]:.0f}")
        if len(means) == 2:
            u = [r["score"] for r in results if r["work"] == w["id"] and r["persona"] == "understands"]
            c = [r["score"] for r in results if r["work"] == w["id"] and r["persona"] == "copied"]
            if min(u) <= max(c):
                overlap_cases.append(w["id"])
            print(f"{'':<20}{'GAP':<14}{'':<24}{means['understands'] - means['copied']:+.0f}\n")

    u_all = [r["score"] for r in results if r["persona"] == "understands"]
    c_all = [r["score"] for r in results if r["persona"] == "copied"]
    print("-" * 66)
    print(f"understands: mean {statistics.mean(u_all):.0f}  range {min(u_all):.0f}-{max(u_all):.0f}")
    print(f"copied     : mean {statistics.mean(c_all):.0f}  range {min(c_all):.0f}-{max(c_all):.0f}")
    print(f"separation : {statistics.mean(u_all) - statistics.mean(c_all):+.0f} points")
    print(f"clean split: {'NO — distributions overlap' if min(u_all) <= max(c_all) else 'YES'}")
    if overlap_cases:
        print(f"overlap in : {', '.join(overlap_cases)}")

    with open("evals/history/killtest_viva_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print("\nfull transcripts -> evals/killtest_viva_results.json")


if __name__ == "__main__":
    main()
