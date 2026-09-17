# JUDGE RESULTS — a model judging the model, measured (17 Sep 2026)

Same mechanism as Rung's (`docs/JUDGE-RESULTS.md` at the root): after a rephrase passes the lexical
gate, a second, colder call is shown the reference template and the candidate and answers one
question — same meaning, same place, no instruction to pick a different pit or seed. Anything but a
clear yes ships the template. Fail-closed.

`node heritage/evals/judge_eval.mjs` — 20 live rephrases, tiers 2 and 3 (tier 1 is always the
template, HD-013), `deepseek-v4-flash` phrasing and judging. Raw log: `evals/judge_eval_results.txt`.

| Outcome | Count |
|---|---|
| Shipped from the model | **3 / 20** |
| Stopped by the lexical gate (number words) | 13 |
| Passed the gate, **overturned by the judge** | **4** |
| Judge unavailable | 0 |
| Latency, two calls, p50 / p95 | 1,254 ms / 1,759 ms |

The four overturns were real: a `count_off` rephrase sent her to "the pit just past the corner", a
`parity_wrong` rephrase to "the pit just before it". Neither contains a number; the gate passed both;
the judge did not. This run is the strongest evidence in the folder for two decisions at once:
tier one from the template, and a semantic judge above the lexical gate.

**What it also says, plainly:** on this game the model's rephrases are weak. Three in twenty reach
the child. The product works because the templates are good and the model is optional, which is the
design, not an accident. Residual: judge and phraser share a family; one run of twenty.
