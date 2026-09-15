# LATENCY / COST — 20 live hints, measured (15 Sep 2026)

`node heritage/evals/latency_cost.mjs` against the shipped `phrase()` path: real redacted payloads
for the eight hinted ids × tiers 1–3 (`correct` is never hinted), the full output gate applied,
template fallback on any rejection. Provider: **DeepSeek `deepseek-v4-flash`**, thinking disabled,
JSON mode. Raw log: `heritage/evals/latency_cost_deepseek.txt`.

| Metric | Value |
|---|---|
| Calls | 20 / 20 returned (no timeouts at the eval's 10 s ceiling) |
| Latency p50 | **803 ms** |
| Latency p95 | **1,062 ms** (max 1,250 ms) |
| Tokens in / out (mean) | 235 / 46 |
| Cost per hint (list price $0.44 / $1.32 per MTok, peak) | **$0.000164** — about 6,100 hints per dollar |
| Gate pass rate | **15 / 20 = 75%** |
| Gate rejections | 5: 2 `number` (the model wrote *"the one right before the pit"*, *"the one you count first"*), 3 `vocab` (*bend*, *travels/path/send*, *truly/held/past*). The template shipped each time. |
| Schema / parse failures | 0 |

## What the rejections show

Same degrade path as Rung, observed live on the new nouns. The lexical gate caught the number word
*one* twice (the templates avoid it for exactly this reason) and three hints that wandered off the
500-word list (*bend*, *travels*, *truly*). The child saw the gate-checked template in every case.
The gate, not the vendor, is the safety claim.

Of the 15 accepted hints, 11 are the template verbatim or near-verbatim and 4 are rephrasings. One
rephrasing is imprecise (`counted_start_pit/1`: *"Your marker sits in a pit that is early"*) and one
over-explains (`stopped_at_first_lap/3` reads the relay as *"put your seed in the first pit"*). Both
are number-free, on-list and point at the right place; neither states a count. Phrasing quality on
the relay id is the residual to watch in the pilot.

## Timeouts

Measured median 803 ms, p95 1,062 ms: the Rung setting of **2,000 ms server-side inside 2,500 ms
client-side** holds unchanged. The hint is requested when the last seed lands off the marker; the
template is on screen at once if the network is slow.

## Not measured

- The Anthropic path (`claude-haiku-4-5-20251001`, strict schema). Wired and unit-tested with a
  fake fetch; no key on this machine. It becomes the active provider if `ANTHROPIC_API_KEY` is set.
- Off-peak DeepSeek pricing (half the figure above).
- Latency from a child's device over a home connection; this run was from the dev machine.
