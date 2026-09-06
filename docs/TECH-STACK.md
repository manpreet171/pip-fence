# TECH STACK — final technical specification (4 Sep 2026, day 1 of 14)

Authority: `CONCEPT-V3.2.md` (incl. Errata) + `AI-ARCHITECTURE.md`, under `CLAUDE.md` R5.
Every model ID, price and platform limit below was verified against vendor docs today; anything
unverified is marked **[UNVERIFIED]**. The rule applied throughout: **nothing new enters the stack
unless the existing zero-dependency code cannot do it.** Net new runtime dependencies: **zero.**

---

## 1. AI / ML layer

### 1.1 Coach phrasing model — `claude-haiku-4-5-20251001`, confirmed

Verified: it is the current Claude API ID (a pinned snapshot; alias `claude-haiku-4-5`), **$1 / $5
per MTok**, 200K context, "Fastest" in the current lineup. Structured outputs are **GA — no beta
header** — via `output_config.format`, `additionalProperties: false` required.

Rejected alternatives: Sonnet 5 ($2/$10) doubles cost for a 60-token schema-locked string whose
grammar is already constrained by the gate; Opus 5 / Fable 5.1 on a 60-token hint reads as *not
having measured* (`AI-ARCHITECTURE.md`). A cheaper second family (Gemini 2.5 Flash-Lite, $0.10/$0.40)
would be the coach's own judge family — it is spent on the attacker instead (§1.2).

Two Haiku-specific facts the docs did **not** previously capture, both of which change the request:
- **`effort` is not supported on Haiku 4.5.** Do not send `output_config.effort` — Opus/Sonnet-shaped code will 400.
- Haiku 4.5 has **extended** (not adaptive) thinking. Do not enable it. A 60-token hint has nothing to think about, and thinking tokens bill at output rate.

**Exact request** (server-side, `src/engine/buddy.mjs`, global `fetch`, no SDK — the repo already
proxies an LLM with 12 lines and adding `@anthropic-ai/sdk` would be the project's first dependency):

```jsonc
POST https://api.anthropic.com/v1/messages
headers: { "x-api-key": $ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01",
           "content-type": "application/json" }
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 120,
  "temperature": 0.4,
  "system": "You phrase one hint for a child aged 8 reading at a 500-word level. Max 2 sentences. Use no numbers of any kind — no digits, no number words. Never state or imply how many. Point with words. Never say sad, disappointed, or miss you.",
  "messages": [{ "role": "user", "content": "<the redacted payload of CONCEPT §3, JSON.stringify'd>" }],
  "output_config": { "format": { "type": "json_schema", "schema": {
    "type": "object", "additionalProperties": false,
    "required": ["tier", "misconception_id", "text"],
    "properties": {
      "tier": { "type": "integer", "enum": [1, 2, 3] },
      "misconception_id": { "type": "string", "enum": ["off_by_one_in_one_group", "off_by_one_per_group", "counted_groups_as_group_size", "one_group_only", "over_count", "right_total_wrong_grouping", "pack_unit_confusion", "ambiguous"] },
      "text": { "type": "string" }
    } } } }
}
```

`maxLength` is **not enforced on the wire** (SDK-side only), which is why the ≤2-sentence cap stays
in the code gate — already the design in §3, now with the vendor reason attached.

**Cost:** 400 in + 60 out = $0.0004 + $0.0003 = **$0.0007 / hint** at published rates; 10,000 hints
≈ $7. The entire day-7 latency run (20 hints) costs **$0.014**. **Latency is [UNVERIFIED]** — no
vendor p50 exists; the day-7 table measures it rather than citing it, which is the point.

**Prefetch:** fire the call on the `place` event that *completes a wrong part*, not on `commit`.
That is 5–45 s of child time before the hint is wanted, so the ~600 ms is invisible and the abort
path is free — if she fixes it before `commit`, the response is discarded.

**Per-turn re-injection:** the `system` string above is rebuilt per request (never a stored session),
and `age` + `reading_level` + `constraint` are *also* in the user payload. Belt and braces is
justified by KIDBench multi-turn degradation of 6–24%, and it costs ~40 tokens.

### 1.2 Judge / red-team model — different family, DeepSeek

`evals/redteam_leak.py` currently sends **`deepseek-chat`, which no longer appears in DeepSeek's
model list.** Current models are `deepseek-v4-flash` ($0.22–0.44 in / $0.66–1.32 out per MTok,
off-peak/peak) and `deepseek-v4-pro`. **Day-1 fix: pin `deepseek-v4-flash`** — a 60-fixture run costs
well under $0.01. Base URL `https://api.deepseek.com`, OpenAI-compatible, unchanged.

Best cheap second family if a key ever appears: **Gemini 2.5 Flash-Lite** ($0.10/$0.40, free tier).
**Only a DeepSeek key exists in this environment today**, so "one attacker family" stays a published
residual (REDTEAM-RESULTS standing residual) rather than a promise.

### 1.3 The classifier and the mastery graph are CODE

Neither is ML, and the submission says so out loud. Shapes:

- `classify(events) -> {id, tier, confirmed}` — a **pure function** in `fence.mjs`: no I/O, no
  `Date.now()`, no model. Timing enters only as arithmetic on `t` values already in the log (the
  latency *heuristic* is deleted per §4; `idle_off_task` and `wheel_spinning` are gap arithmetic).
  Determinism is what makes the 60 fixtures a real eval instead of a vibe.
- `GRAPH` — a frozen 12-element array literal `{node, groups, per, mode}` plus `next(mastery)`, a
  pure function. Twelve nodes is a `const`, not a database, not a graph library, not RAG.
- **Hard constraint:** `fence.mjs` must have **zero top-level DOM access**, so `node` can import
  `classify` in the eval. All DOM work sits inside exported functions.

### 1.4 Deliberately not used

Voice (Whisper-class ~25% WER on children; voiceprints are personal information under amended
COPPA) · vision (a second 25%-error channel over data code already holds exactly) · RAG (12 nodes is
a `const`) · agents (nothing to orchestrate; a panel sees through it) · fine-tuning (no eval, no
data) · local models (a browser child-safe coach is a week; the template layer *is* the offline path).

---

## 2. Visuals

**DOM `<img>` sprites — keep `village.mjs`'s approach.** Canvas and SVG both lose on the three things
that actually cost days:

| | DOM `<img>` | Canvas | SVG overlay |
|---|---|---|---|
| Hit-testing | free — `e.target.closest("[data-part]")`, one delegated listener | needs an inverse of `iso()` + per-part boxes (~1 day, ART-FEASIBILITY's own estimate) | second coordinate system to keep in sync |
| `plop` / goat walk | CSS keyframes, already written | own rAF loop | CSS works, but for nothing gained |
| 320px legibility | a property of the *sprite*, identical in all three | same | same |
| 14-day risk | the renderer already ships | rewrite | two renderers |

Cost of the three §6 changes (export `iso`/`BB`; `mountScene` pinning bbox+scale from the *finished*
fence; `appendPlank` via `insertAdjacentHTML("beforeend")`) is ~1 h, and `renderVillage` is untouched
so the frozen `index.html` cannot regress.

**Asset pipeline:** Kenney iso farm + landscape + Animal Pack Redux, all CC0, already on disk. One
throwaway compositor, `scripts/make_parts.py`, **Pillow (installed), ~30 lines, run once**, outputs
committed: (a) a single plank cropped from `planks_E.png`, (b) the over-count plank — the same crop
rotated ~12° with an offset alpha shadow, (c) a post/rail frame from `fenceHigh_E.png`. No build step,
no watcher, no sprite atlas. The script is committed for provenance, not for CI.

**Animation: CSS only, confirmed.** `plop` exists; the goat walk is one `@keyframes` translating the
goat `<img>` through the gap; `prefers-reduced-motion` is already honoured in `VILLAGE_CSS`. **Not
built:** particles, confetti, sound, screen shake, idle wiggles, celebratory modals — seductive detail
(RESEARCH-LEARNER) and every one of them competes with the very cue we spent day 1 proving legible.

---

## 3. Frontend

**Vanilla ES modules + static HTML. No framework.** Under R5, a framework would add a build step, a
`node_modules`, and a hydration story to a page whose entire state is `{shape, cart, parts, events}`
and whose rendering rule is *append one `<img>`, never re-render* — the exact thing React's
reconciler would fight (a re-render re-fires `plop` on existing sprites and kills the 20-second beat).

- **Input:** `data-part="0|1|2"` on emitted sprites + **one** delegated `click` on `.isoworld`. Add
  `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent` to kill the 300 ms tap
  delay and the grey flash; `click` already fires on tap, so no pointer-event machinery.
- **State:** one plain object, mutated, plus `events.push(...)`. The event log **is** the state
  history — no reducer, no store, no undo stack (§2: remove is a logged event, not an undo).
- **localStorage, one key `rung.v1`, local-only per COPPA:**
  ```jsonc
  { "v": 1, "mastery": { "4x3_concrete": 0.0 },   // 12 keys, 0..1
    "build": { "node": "4x3_concrete", "parts": [[..],[..],[..]], "cart": 7 },
    "events": [ /* last 500, ring-trimmed */ ] }
  ```
  Every read and write wrapped in `try/catch` — Safari private mode throws on write, and the game
  must not break because storage did. No account, no analytics SDK, no ad ID. The parent screen reads
  this object and nothing else.

---

## 4. Backend

**Keep `src/server.mjs`.** It is 54 lines, zero-dependency, already proxies an LLM and already serves
`/public`. Three additions:

1. `/build.html` → `/public/build.html`
2. `/fence.mjs` → `/public/fence.mjs`
3. `POST /api/buddy` → `phrase(payload)` in `buddy.mjs`

**Correction to CONCEPT §6:** it lists the third route as static `/buddy.mjs`. `buddy.mjs` must be
*isomorphic* — the browser imports `TEMPLATES`, `payload()` and `gate()` (the offline path needs all
three); only `phrase()` touches the network and it runs server-side, guarded by
`globalThis.process?.env?.ANTHROPIC_API_KEY`. So **both** routes exist: static `/buddy.mjs` for the
browser half, `POST /api/buddy` for the key-holding half. Serving the module to the browser is a
demo asset, not a leak — open devtools and the whole prompt is there with no answer in it.

**API key:** `ANTHROPIC_API_KEY` from env, server-side only, never in a client bundle, never logged.
`DEEPSEEK_API_KEY` is used by the evals and by the frozen control arm's routes (`/api/coach|narrate|story`), which the server only mounts when `CONTROL_ARM=1`. The shipping server exposes one model endpoint: `/api/buddy`.

**What must never be sent to the LLM:** the child never types, so there is no free text to send —
that is the design move that kills PII, prompt injection and moderation at once. The browser builds
the **redacted payload itself** and POSTs only `{misconception_id, tier, shape:{...booleans}}`, so
**no integer ever crosses the wire.** At the trust boundary the server re-validates
`misconception_id` against the enum and `tier ∈ {1,2,3}` and 400s anything else — the one place
laziness does not apply.

**Offline fallback:** `fetch(..., { signal: AbortSignal.timeout(1200) })`; any throw, non-200,
schema miss, or gate failure → `TEMPLATES[id][tier]`. Pulling the cable degrades the buddy; it does
not break the game. Demonstrated on camera by killing the server mid-session.

---

## 5. Data & evals

| File | Runs in `run_all` | Prints |
|---|---|---|
| `data/wordlist.txt` | (data) | Dolch 315 ∪ Fry 300 ∪ 28 domain — committed |
| `data/hints_v2.txt` | (data) | the 6 templates; single source of truth |
| `evals/readinglevel.py --assert` | ✅ | `gate assert OK: 6 templates, 0 number words, <=2 sentences`, exit 1 on violation |
| `evals/classifier_fixtures.json` | (data) | 60 `(sequence) → expected_id` |
| `evals/classifier_eval.mjs` | ✅ | confusion matrix with `ambiguous` as its own row/column; accuracy-when-committed and silence rate |
| `evals/redteam_leak.py` | manual (costs money, needs key) | total & shape recovery vs the majority-class baseline on the rebalanced fixtures |
| `evals/latency_cost.mjs` | manual (costs money) | p50/p95 ms, tokens in/out, $/hint over 20 live hints |
| `evals/engine_eval2.mjs` | ✅ | **frozen** — the control arm's questions-wasted result |

**Runner: `python evals/run_all.py`** — ~40 lines, `subprocess` over the four free checks (it shells
`node` for the two `.mjs` ones), prints one PASS/FAIL table, exits non-zero on any failure. **No
`package.json`, no npm, no make.** The repo has zero JS dependencies today and adding a manifest
solely to own the word `test` is exactly the scaffolding R5 forbids; Python is already the eval
language and works unchanged on the Windows dev box.

`run_all.py` also asserts **set equality between `data/hints_v2.txt` and `TEMPLATES` in
`buddy.mjs`** (3 lines). That is the only thing standing between two copies of the templates and a
gate-checked file that the product no longer ships.

---

## 6. Deploy

**Render, free web service, Node runtime.** The server runs **unmodified**: build `—`, start
`node src/server.mjs`, one env var `ANTHROPIC_API_KEY`, `PORT` supplied by the platform (already
read). Under 30 minutes.

Verified free-tier terms: **750 free instance-hours per workspace per month**, **spin-down after 15
minutes with no inbound traffic**, **~1 minute to spin back up**; Render's own docs call it unsuitable
for production. That cold start is the only real risk for a judged URL — mitigation is either a
warming hit before anyone opens it, or the cheapest always-on paid tier (**~$7/mo [UNVERIFIED — one
aggregator, not Render's pricing page; confirm day 1]**) for the submission fortnight only.

Rejected: **Vercel / Netlify** would require lifting `/api/coach`, `/api/narrate`, `/api/story` *and*
`/api/buddy` into serverless functions and re-pointing the two **frozen** pages at them — an hour of
churn that touches the control arm, for zero gain. **Railway** has no real free tier (one-time $5
trial credit, then $1/month free credit; Hobby is $5/mo). Render's free tier is the only one that
serves a Node process for $0.

---

## 7. File plan

| File | State | Purpose | Est. h |
|---|---|---|---|
| `src/public/village.mjs` | edited | export `iso`, `BB` (1 line) | 0.25 |
| `src/public/fence.mjs` | new | `mountScene` (pinned bbox), `appendPlank`, tap-to-place, tap-to-count, event log, `classify()`, `GRAPH`, localStorage | 10 |
| `src/public/build.html` | new | page shell, CSS, cart + delivery slip, hint bubble on the gap | 4 |
| `src/engine/buddy.mjs` | new | `TEMPLATES`, `payload()`, `gate()`, `phrase()` | 3 |
| `src/server.mjs` | edited | 2 static routes + `POST /api/buddy` + enum validation | 0.5 |
| `scripts/make_parts.py` | new | Pillow: plank crop, over-count plank, post/rail frame | 1.5 |
| `data/hints_v2.txt` | edited | `past` → `over` (closes the last out-of-list word) | 0.25 |
| `evals/classifier_fixtures.json` | new | 60 sequences → expected id | 2.5 |
| `evals/classifier_eval.mjs` | new | confusion matrix | 1.5 |
| `evals/latency_cost.mjs` | new | 20 live hints → p50/p95 + $ table | 1.5 |
| `evals/redteam_leak.py` | edited | rebalanced shapes, model pin, final templates | 1 |
| `evals/run_all.py` | new | one command, one table | 0.75 |
| `docs/TRANSFER-TEST.md` | new (day 8) | the paper instrument | 1.5 |
| `docs/DECISIONS.md` | edited | finite cart, packs-once, 6×2→2×5, engine frozen, stack choices | 0.5 |
| `data/wordlist.txt` | done | committed today | 0 |
| `src/engine/{engine,coach,story}.mjs`, `src/public/{index,measure}.html`, `evals/engine_eval2.mjs` | **frozen** | control arm, `control-arm-frozen` | 0 |

**Total ≈ 28.75 h of build** across days 1–8, plus day 1's 1 h art re-test and the 4 h pulled
forward. That is ~4 h/day against 8 build days — the slack absorbs day 3 (packs), which §8 already
names as the first thing to cut.

---

## 8. Stack risks and the day-1 verification list

1. **`deepseek-chat` is gone from the model list.** The red-team eval will 404 on its next run. Pin `deepseek-v4-flash`. — *one curl, day 1.*
2. **Haiku 4.5's retirement commitment is "not sooner than 15 Oct 2026"** — 27 days after the deadline. Fine for submission, quotable as a risk; the mitigation is already built (one model string, and the template layer if it vanishes).
3. **`output_config.format` on a real key** — verify the strict JSON comes back on `claude-haiku-4-5-20251001`, and that `effort` is *not* sent. — *one curl, day 1.*
4. **Render cold start (~60 s)** decides whether a judge sees a spinner. Warm it, or pay for the fortnight.
5. **`fence.mjs` must import cleanly under `node`** or the 60-fixture eval — the headline artefact — cannot run. Write `classify()` first, DOM later.
6. **Two copies of the templates** is the most likely silent regression in this repo. The `run_all.py` equality assert exists for exactly that.
7. **Prefetch racing `commit`** — abort the in-flight request on `remove`, or a stale hint lands on a fixed fence.
8. **localStorage throws, not returns null**, in Safari private mode. `try/catch` both ways.
9. **The height cue is unproven until tonight** (§10.5). The rail-less fallback is named; if it fires, `mountScene` draws no top rail for an incomplete part and the goat exits *that* part.
10. **Latency is the only headline number with no vendor source.** It is measured on day 7 or it is not claimed.

---

Sources: [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) ·
[Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) ·
[DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing) ·
[DeepSeek API docs](https://api-docs.deepseek.com/) ·
[Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) ·
[Render free tier](https://render.com/docs/free) ·
[Railway pricing plans](https://docs.railway.com/pricing/plans)


---

## Orchestrator's note on §1.2 / risk #1 (same day)

`deepseek-chat` did **not** 404 today: `evals/redteam_leak.py` ran against it three times
(3 × 60 fixtures, all successful — REDTEAM-RESULTS updates 1–3). "No longer exists" is therefore
premature; DeepSeek's docs list v4 models but the old name still resolves (likely an alias).
Repinning to `deepseek-v4-flash` remains the right day-1 hygiene — one curl — but it is not a
blocker and the published red-team numbers stand.
