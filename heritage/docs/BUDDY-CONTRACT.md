# BUDDY CONTRACT — the one interface the board page and the AI/backend share

Authority: CONCEPT §6, ENGINE-CONTRACT (IDS, the redacted payload shape). Both engineers code to this
file. Change it only by editing this file first.

## Browser module `/buddy.mjs` (served from `heritage/src/buddy.mjs`, isomorphic — zero top-level DOM/Node access)

```js
export const IDS;             // the 9 ids of ENGINE-CONTRACT, same order as sow.mjs IDS; "correct" has templates but is never hinted
export const TEMPLATES;       // { [id]: { 1: text, 2: text, 3: text } } — built from heritage/data/hints.txt, single source of truth
export const SHAPE_KEYS;      // ["early", "late", "by_one", "past_corner", "reversed", "relay"]
export function payload(result);       // result = classify() output {id, tier, confirmed, called, landed, path, node}
                                       // -> the REDACTED object of CONCEPT §6: no integer anywhere; shape = six booleans fixed by the id
                                       //    (miscounted_seeds adds which side of the landing the marker sits, from two path positions),
                                       //    nouns {unit:"seed", place:"pit", marker:"marker"}, template, constraint, age, reading_level
export async function hint(result, { timeoutMs = 2500, fetchImpl = globalThis.fetch } = {});
   // POSTs payload(result) to /api/buddy. Resolves ALWAYS, never throws:
   //   { text, source: "model", model }   when the server returned a gated model hint (model = the vendor model id, for the overlay)
   //   { text, source: "template", reason }   on timeout, network error, non-200, or server fallback
   // text is TEMPLATES[result.id][result.tier] in every fallback case.
export function phrase(payload, { fetchImpl, apiKey, provider, wordlist, timeoutMs = 2000 });   // SERVER ONLY. provider = "anthropic" | "deepseek"
   // (follows the key). Runs the output gate in order (schema → ≤2 sentences → zero digits / 36 number words → no affect words →
   // ≤2 out-of-list words), returns { text, source:"model", usage } or { text: template, source:"template", reason, rejected? }.
// Also exported: gate(text, wordlist) -> null | "sentences"|"number"|"affect"|"vocab"; redact(id, tier, shape) -> the payload from
// already-boolean shape facts (the server rebuilds the body through it); parseWordlist(text) -> Set; request(payload, apiKey) ->
// [url, init] (the exact Haiku request, testable without a key); NUMBER_WORDS (the 36 banned words, same literal as evals/readinglevel.py).
```

`shape` has exactly six boolean keys. Which are true is fixed by the id: `counted_start_pit` → early, by_one;
`overshot_by_one` → late, by_one; `stopped_at_corner` → early, past_corner; `stopped_at_first_lap` → early, relay;
`direction_reversed` → reversed; `miscounted_seeds` → early *or* late (the marker's side of the landing on the path);
`correct`, `guessing`, `ambiguous` → all false. No pit number, seed count, path or landing is ever sent. The only fields
that may contain a digit are `age` (8), `tier` (1–3) and the fixed `reading_level` string; `evals/buddy_test.mjs` asserts
this over every classifier fixture (or over a hand-built list of 30 results if the engine is absent).

## HTTP

`POST /api/buddy`  body = `payload(result)` (JSON). Server re-validates `misconception_id ∈ IDS`, `tier ∈ {1,2,3}`, every
`shape` key ∈ SHAPE_KEYS with a boolean value, and rejects any body containing a digit in `shape` → **400**. Also 400: any
top-level key outside `{age, reading_level, misconception_id, tier, shape, nouns, template, constraint}`, body > 4 KB, or
unparseable JSON. The server keeps only `{misconception_id, tier, shape}` and rebuilds the payload with `redact()` —
client `template`/`nouns` text never reaches the model. Response: `{ text, source, reason?, model? }`, always 200 on a
valid body (a server-side exception → the template with `reason:"error"`). No API key → `{ text: template,
source:"template", reason:"no_key" }`. `model` is present only when `source === "model"`. `Cache-Control: no-store`.
POST rate limit: 60 per minute per IP across `/api/*` → **429**. Any other POST path → **404**; there is no control arm.

## The parent note

```js
export const PARENT_WORDS;    // { [id]: [what_happens, thing_to_ask] } — nine entries, parent words per id; the parent page's
                              // only copy (it imports this), the model's meaning, and the fallback sentences
export const NOTE_KEYS;       // ["open_id", "tier", "solo", "helped", "days"]
export function validNote(b); // open_id ∈ IDS | null; tier ∈ {1,2,3}; solo/helped = ≤12 level names matching
                              // /^[2346] seeds a pit(, with a relay)?$/; days integer 0–7; no other keys
export async function note(b, { timeoutMs = 5000, fetchImpl } = {});   // BROWSER. POSTs b to /api/note. Never throws:
   // { note, question, source:"model" } or { note, question, source:"template", reason? } — the fixed sentences
   // (noteFallback) on any miss. The page renders note + question either way.
export async function writeNote(b, { apiKey, provider, fetchImpl, timeoutMs = 4000 });   // SERVER ONLY. notePayload(b) → the
   // provider → noteGate (schema → nothing invented → ≤3 sentences → one thing to ask → no blame words → no "_" labels →
   // no holes/beads → length caps).
```

`POST /api/note`  body = the summary above; `validNote` false → **400**. Response always 200 on a valid body:
`{ note, question, source, reason? }`. No key → `reason:"no_key"`; an empty week (`solo`, `helped` empty and
`open_id` null) → `reason:"nothing_to_say"`, the model is never called. Level names map from nodes:
`2_single` → `"2 seeds a pit"`, `3_relay` → `"3 seeds a pit, with a relay"`. The parent page builds the summary from
storage: `solo` = mastery 1, `helped` = mastery 0.5, `open_id` = the open misconception (or null), `tier` = the tier
reached on it, `days` = distinct days with a `level_start` in the last 7. With no level at all in storage the page does
not call `/api/note`. Nothing open → the prompt says so and a note that mentions anything "still" being worked on is
rejected as invented; zero levels finished → a note claiming one was finished is rejected as invented.

## Static routes

`GET /` and `GET /board` → `src/public/board.html`. `GET /sow.mjs`, `/buddy.mjs`, `/judge.mjs` → the files of those
names in `src/`. Anything under `src/public/` is reachable at `/public/<name>`; assets at `/assets/...`. Nothing else in
`src/` is servable; `..` in a path → 404. 404 and 500 bodies never carry a path. `PORT` defaults to 5180.

## Events the board writes (classify() reads exactly these — see ENGINE-CONTRACT)

`level_start{node}` · `pick{pit, seeds}` · `call{pit}` · `sow{from, landed, path}` · `relay{from, landed, path}` ·
`four{pit, owner}` · `capture{pit, seeds, earned}` · `tap_count{pit}` · `hint{id, tier}` · `turn{side:"code", from, landed}` ·
`level_end{stores}`. `t` = ms since level_start. The page calls `classify(events)` after each sow.

## Templates file `heritage/data/hints.txt`

One template per line: `id<TAB>tier<TAB>text`, 9 ids × 3 tiers = 27 lines. Every line must pass
`python heritage/evals/readinglevel.py --assert` (≤2 sentences, zero digits/number words, ≤2 out-of-list words against
`heritage/data/wordlist.txt` BASE ∪ DOMAIN). `ambiguous` tier 1 is the probe *"Show me where your first seed goes."*
