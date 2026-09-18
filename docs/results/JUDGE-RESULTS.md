# JUDGE RESULTS — a model judging the model, measured (17 Sep 2026; re-run 18 Sep 2026, own words)

> **Re-run 18 Sep 2026, after the hint prompt was changed to "say it in your own words, do not repeat the template"** (D-098): 20 live hints on `deepseek-v4-flash`, **14 shipped from the model, 0 stopped by the gate, 6 overturned by the judge**, p50 1.8 s, p95 2.3 s for the two calls. Before the change 7 of 9 model hints were word-for-word copies of the template; after it, none. The six overturns were all right to overturn (for example "take that part off the cart", "put the short planks there again"). The original run follows.


The lexical gate stops digits and number words. It cannot see a sentence that points the wrong way.
So after a rephrase passes the gate, a second, colder call (`JUDGE_JOB`, temperature 0, twenty
tokens) is shown the reference template and the candidate and answers one question: does the
candidate say the same thing, point to the same place, and never tell her to pick a different pit,
part, seed or plank. Anything but a clear yes ships the template. Fail-closed: an unreadable verdict
is a rejection. The judge sees no number: the template has none by construction and the candidate
has already passed the gate.

`node evals/judge_eval.mjs` — 20 live rephrases, tiers 2 and 3 (tier 1 never calls the model),
`deepseek-v4-flash` phrasing and judging. Raw log kept locally.

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
