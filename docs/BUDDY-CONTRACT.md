# BUDDY CONTRACT — the one interface the frontend and the AI/backend share

Authority: CONCEPT-V3.2 §3, TECH-STACK §1.1 / §4. Both engineers code to this file. Change it only by
editing this file first.

## Browser module `/buddy.mjs` (served from `src/engine/buddy.mjs`, isomorphic — zero top-level DOM/Node access)

```js
export const IDS;             // the 8 misconception ids (same list as fence.mjs IDS) + "correct" is never hinted
export const TEMPLATES;       // { [id]: { 1: text, 2: text, 3: text } } — built from data/hints_v2.txt, single source of truth
export function payload(result);       // result = classify() output {id, tier, counts, node, confirmed}
                                       // -> the REDACTED object of CONCEPT §3: no integer anywhere, "groups":"some",
                                       //    booleans one_group_short / all_groups_short, nouns, template, constraint, age, reading_level
export async function hint(result, { timeoutMs = 1500, fetchImpl = globalThis.fetch } = {});
   // POSTs payload(result) to /api/buddy. Resolves ALWAYS, never throws:
   //   { text, source: "model" }      when the server returned a gated model hint
   //   { text, source: "template" }   on timeout, network error, non-200, or server fallback
   // text is TEMPLATES[result.id][result.tier] in every fallback case.
export function phrase(payload, { fetchImpl, apiKey, wordlist });   // SERVER ONLY. Calls Haiku (TECH-STACK §1.1 exact request,
   // no `effort`, no thinking), runs the output gate in order (schema → ≤2 sentences → zero digits/number words →
   // no banned affect words → ≤2 out-of-list words), returns { text, source:"model" } or { text: template, source:"template", reason }.
   // Also carries `usage` {input_tokens, output_tokens} and, on a gate failure, `rejected` (the model text) — for
   // evals/latency_cost.mjs only; the server strips both before replying.
// Also exported (6 Sep, additive): gate(text, wordlist) -> null | "sentences"|"number"|"affect"|"vocab";
// redact(id, tier, shape) -> the payload from already-boolean shape facts (the server rebuilds the body through it);
// parseWordlist(text) -> Set; request(payload, apiKey) -> [url, init] (the exact Haiku request, testable without a key);
// SHAPE_KEYS, NUMBER_WORDS (the 25 banned words, same literal as evals/readinglevel.py).
```

`shape` has exactly five keys: `groups:"some"`, `one_group_short`, `all_groups_short`, `has_over`, `has_empty` (booleans
derived from counts vs `per`; `per` is read from the node name, never sent). The only fields that may contain a digit are
`age` (8), `tier` (1–3) and the fixed `reading_level` string; `evals/buddy_test.mjs` asserts this over all 67 fixtures.
`hint()` passes the server's `reason` through on fallback (`no_key`, `timeout`, `http_500`, …) — additive, so the demo can show why.

## HTTP

`POST /api/buddy`  body = `payload(result)` (JSON). Server re-validates `misconception_id ∈ IDS`, `tier ∈ {1,2,3}`,
and rejects any body containing a number in `shape` → **400**. Also 400: any top-level key outside
`{age, reading_level, misconception_id, tier, shape, nouns, template, constraint}`, any `shape` key outside the five, a
`shape` value that is not `"some"`/boolean, body > 4 KB, or unparseable JSON. The server keeps only `{misconception_id,
tier, shape}` and rebuilds the payload with `redact()` — client `template`/`nouns` text never reaches the model.
Response: `{ text, source, reason? }`, always 200 on a valid body (a server-side exception → the template with
`reason:"error"`). No API key → `{ text: template, source:"template", reason:"no_key" }`. `Cache-Control: no-store`.

`GET /buddy.mjs` → `src/engine/buddy.mjs`. `GET /build` → `src/public/build.html`. `GET /fence.mjs` → `src/public/fence.mjs`.
Anything under `src/public/` is reachable at `/public/<name>`; assets at `/assets/...`.

## Events the frontend writes (classify() reads exactly these — see fence.mjs tally/classify)

`level_start{node}` · `plank_held` · `place{unit:"plank"|"pack", n?, group, n_in_group}` · `remove{unit, group, n_in_group}` ·
`order{packs}` · `place_failed{nearest_group?, held}` · `tap_idle` · `tap_count{group}` · `hint{id, tier}` ·
`commit{reason:"left_plot"|"other_plot"|"idle"}`. `t` = ms since level_start. The frontend calls `classify(events)` at commit.

## Templates file `data/hints_v2.txt`

One template per line: `id<TAB>tier<TAB>text`. Every line must pass `python evals/readinglevel.py --assert`
(≤2 sentences, zero digits/number words). `ambiguous` tier 1 is the "show me a part that looks finished" probe.
