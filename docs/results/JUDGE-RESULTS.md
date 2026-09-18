# JUDGE RESULTS — a model judging the model, measured (17 Sep 2026)

The lexical gate stops digits and number words. It cannot see a sentence that points the wrong way.
So after a rephrase passes the gate, a second, colder call (`JUDGE_JOB`, temperature 0, twenty
tokens) is shown the reference template and the candidate and answers one question: does the
candidate say the same thing, point to the same place, and never tell her to pick a different pit,
part, seed or plank. Anything but a clear yes ships the template. Fail-closed: an unreadable verdict
is a rejection. The judge sees no number: the template has none by construction and the candidate
has already passed the gate.

`node evals/judge_eval.mjs` — 20 live rephrases, tiers 2 and 3 (tier 1 never calls the model),
`deepseek-v4-flash` phrasing and judging. Raw log: `evals/judge_eval_results.txt`.

| Outcome | Count |
|---|---|
| Shipped from the model (gate passed, judge said yes) | **12 / 20** |
| Stopped by the lexical gate (the word *one*, mostly) | 6 |
| Passed the gate, **overturned by the judge** | **2** |
| Judge unavailable | 0 |
| Latency, two calls, p50 / p95 | 1,779 ms / 2,233 ms |

The two overturns were rephrases that changed which part the child should look at. The gate could not
have caught them. Prefetch keeps the extra call invisible: the hint is requested when the wrong part
completes, seconds before Done. Cost roughly doubles to about three hundredths of a cent per hint.

**Residual, published.** The judge and the phraser are the same model family; a judge that shares the
phraser's blind spots will pass what it should not. The unit checks pin the mechanics (a faithful
rephrase ships; a rejected one falls back with `reason: judge`; an unreadable verdict fails closed);
the live rate above is one run of twenty and will move.
