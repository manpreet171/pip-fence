# LATENCY / COST — 20 live hints, measured (6 Sep 2026)

`node evals/latency_cost.mjs` against the shipped `phrase()` path: real redacted payloads for all 8
misconception ids × tiers 1–3, the full output gate applied, template fallback on any rejection.
Provider: **DeepSeek `deepseek-v4-flash`**, thinking disabled, JSON mode (D-067). Raw log kept locally.

| Metric | Value |
|---|---|
| Calls | 20 / 20 returned (no timeouts at the eval's 10 s ceiling) |
| Latency p50 | **757 ms** |
| Latency p95 | **1,382 ms** (max 1,625 ms) |
| Tokens in / out (mean) | 229 / 40 |
| Cost per hint (list price $0.44 / $1.32 per MTok, peak) | **$0.000154** — about 6,500 hints per dollar |
| Gate pass rate | **16 / 20 = 80%** |
| Gate rejections | 4, all `number` — the model wrote *"one"* ("one more plank", "the one that is shorter", "in one pack", "that one"). The template shipped each time. |
| Schema / parse failures | 0 |

## What the rejections show

The lexical gate did its job: every rejected hint contained the number word *one*, which the
templates were rewritten to avoid (READINGLEVEL-RESULTS) precisely because a lexical gate cannot
tell "one part" from "one more plank". The model's natural register drifts toward *one*; the gate
catches it; the child sees the gate-checked template. This is the designed degrade path, observed
live, and it is why the gate — not the vendor — is the safety claim.

The 16 accepted hints stayed on-message: every one names the part, the post, the plank or the
pack, and none states a count. Two are longer than the template they replace (e.g. `ambiguous/1`
added a second sentence), which the ≤2-sentence rule permits.

## Consequence for the timeouts

The server-side `phrase()` timeout had been set at 800 ms with Haiku in mind. Against a measured
median of 757 ms that would have sent roughly half of live calls to the template. It is now
**2,000 ms server-side inside 2,500 ms client-side**. The child never waits for either: the hint
is prefetched when the wrong part completes, 5–45 s before `Done` (TECH-STACK §1.1), and the
template is on screen instantly if the network is slow.

## Not measured

- The Anthropic path (`claude-haiku-4-5-20251001`, strict schema). Wired and unit-tested with a
  fake fetch; no key on this machine. It becomes the active provider automatically if
  `ANTHROPIC_API_KEY` is set.
- Off-peak DeepSeek pricing (half the figure above).
- Latency from a child's device over a home connection; this run was from the dev machine.
