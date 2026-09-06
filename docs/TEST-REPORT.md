# TEST REPORT — Rung build day 1 (6 Sep 2026, 12 days to 18 Sep)

Independent QA pass over the committed tree at `0aeaa8e` (working tree identical except an untracked
`.gitattributes`). Server under test: `node src/server.mjs` on :5177, no `ANTHROPIC_API_KEY` (template path).
Browser: the in-app pane (Chromium), desktop 1280×720 unless stated. No source, data or eval file was edited.

**Environment caveat (affects how evidence was read, not the verdicts).** The pane freezes CSS
animation/transition clocks and reports `visibilityState: "hidden"` while a `javascript_tool` call is in flight, and
throttles timers to ~1 s granularity. Consequences: (a) motion (goat walk, pips, plop) was verified from screenshots
taken between steps and from final DOM geometry, not from opacity sampled inside JS; (b) two readings taken in the first
JS step of a batch saw a ~120 px-wide scene (bubble `width:100px; left:8px`) — the `resize` listener re-placed the bubble
correctly on the next frame and every screenshot shows correct placement. Not a product bug. (c) Case 14's 1.2 s timeout
measured ~2.8 s because the 100 ms poll itself ran at ~1 s ticks.

I ran `git status`/`git log` (read-only) before noticing the "clone only" rule; no other git command was run.

---

## Summary

| # | Case | Verdict |
|---|---|---|
| 1 | Automated suite (`run_all.py`, `buddy_test`, `classifier_eval`, `readinglevel`) | **PASS** |
| 2 | HTTP routes + `/api/buddy` validation + error-body hygiene | **PARTIAL** — all validation correct; `.png` served as `application/octet-stream`; `/public/../server.mjs` → 200 |
| 3 | Demo beat on `3x4_concrete` (CONCEPT §9) | **PASS** |
| 4 | Persistent error states render + classify (`[4,0,0]`, `[5,4,3]`, `[12,0,0]`, `[3,3,3]` channel, tier 2) | **PASS** |
| 5 | Repair symmetry (`remove`, `place_failed`, `tap_idle`) | **PASS** |
| 6 | Prefetch: one POST on wrong-part completion, none at commit, discarded on remove | **PASS** |
| 7 | Idle commit 45 s → `idle_off_task`; probe + 45 s → escalation (D-049) | **PASS** (+ demo-trap finding D-3) |
| 8 | Mastery 1 / 0.5, `next()` skips mastered, ambiguous → 4x3, all-12 reload | **FAIL** — all-12-mastered reload crashes (`TypeError`), blank page |
| 9 | Packs mode (`3x4_packs`, `4x3_packs`) | **PASS** |
| 10 | Persistence: mid-level restore exact, corrupt key → fresh level | **PASS** |
| 11 | Parent screen: counts, parent words, one question, empty storage | **PASS** |
| 12 | Responsive 1280×720 / 375×812 / 320×640 | **PARTIAL** — all good except "For grown-ups" link 42 px tall |
| 13 | Reduced motion CSS covers rails, goat, pips | **FAIL** — rule exists but makes count pips invisible |
| 14 | Offline/degrade: fetch reject → template; fetch hang → bubble ≤ ~1.5 s | **PASS / PARTIAL** — reject PASS; hang shows template but pane timing inflated to 2.8 s (unit test covers 1.2 s) |
| 15 | Text audit: emoji, digits, attribution strings | **PASS** (model id ALLOWED; one comment in frozen `village.mjs` noted) |
| 16 | Cold clone run on :5188 + evals | **PASS** — committed tree runs cold; only `.gitattributes` uncommitted |

Console: zero errors in every case except case 8's all-12 reload (one uncaught `TypeError`). That entry persisted in the
pane's console log for later cases; no new entries appeared after it.

---

## Evidence per case

### 1. Automated suite — PASS
- `python evals/run_all.py` → 5/5 PASS, `ALL PASS`, exit 0 (readinglevel, classifier_eval, buddy_test, engine_eval2, TEMPLATES == hints_v2.txt).
- `node evals/buddy_test.mjs` → 31 checks, `all checks passed`.
- `node evals/classifier_eval.mjs` → 68 fixtures, 55 committed, 55/55 right (100%), 13 silent (19.1%), **mismatches 0**. Confusion matrix diagonal only.
- `python evals/readinglevel.py` → 24 templates, max 2 sentences, 8.4 words/sentence, out-of-list none, **hints with a number: 0**.

### 2. HTTP — PARTIAL
GET (curl, `--path-as-is`):

| Path | Code | Content-Type |
|---|---|---|
| `/` | 200 | text/html |
| `/measure` | 200 | text/html |
| `/build` | 200 | text/html (14072 B) |
| `/fence.mjs`, `/buddy.mjs`, `/village.mjs` | 200 | text/javascript |
| `/public/parent.html` | 200 | text/html |
| `/assets/fence/rail.png`, `/assets/animals/goat.png` | 200 | **application/octet-stream** (no `.png` in `TYPES`, `src/server.mjs:36`) |
| `/nonexistent` | 404 | body `not found` |
| `/../server.mjs`, `/../data/wordlist.txt`, `/../../CLAUDE.md` | 403 | body `no` |
| `/public/../server.mjs` | **200** text/javascript — `path.join` normalises `..` before the `startsWith(HERE)` check (`server.mjs:72-73`); anything under `src/` is reachable. No secret lives in `src/`, so no leak — but the guard is not doing what it says. |
| `/public/` (directory) | 500 | body `server error` (EISDIR) — no path, no stack |

No error body contains a filesystem path or stack trace (checked all of the above).

POST `/api/buddy`:

| Body | Result |
|---|---|
| full valid payload (over_count t1) | 200 `{"text":"That part has a plank sticking out over the post. Take it back to the cart.","source":"template","reason":"no_key"}` |
| minimal `{misconception_id, tier:2, shape:{groups:"some"}}` | 200 template t2 |
| digit in shape value `"1"`, digit in shape key `x1`, numeric `4` | 400 `bad payload` |
| `misconception_id:"correct"` | 400 |
| `tier:4`, `tier:"1"` | 400 |
| extra top-level key `evil` | 400 |
| `{bad json`, empty body, 5 KB body | 400 `bad json` |
| `[1,2]`, `null`, `shape:["some"]`, `groups:"three"` | 400 |
| GET `/api/buddy` | 404 |
| Headers on valid | `Content-Type: application/json`, `Cache-Control: no-store` |

### 3. Demo beat — PASS
Cold start `?node=3x4_concrete&debug=1`, `localStorage` cleared.
- Header `3 parts. 4 planks in each part.` exact; `#pile` 12 `.plank`; `body.innerText` minus header contains **no digit**; console empty.
- Built `[4,4,3]` (events: 1 `plank_held`, 11 `place` with `n_in_group` 1..4/1..4/1..3), cart 1 left (the leftover-plank cue, CONCEPT §9 NEW-1).
- Done → `commit{reason:"left_plot"}` then `hint{id:"off_by_one_in_one_group",tier:1}`. Goat `classList` gains `in`, final transform `translate(132px,0)`, feet at the inside centre of part 3 (measured (736,342) = post-3 foot + one tile edge). Screenshot: goat head over the fence at the rear part, in the corn.
- Bubble text exactly `That part of the fence is short. Count a full part again.`, `#bsrc` = `template`; bubble rect (504–784, 134–221) directly above part 3's posts. Nothing red, no modal, no audio element anywhere in the DOM.
- Empty-hand tap on part 0 → `tap_count{group:0}`; 4 `.pip` spans created, `textContent` 1,2,3,4, x≈378 inside rail 0's x-range (314–441), y stepping 418→333 by one rail pitch. Screenshots at +0.6 s and +1.1 s show pips 1-2 then 1-2-3 climbing part 0.
- Last plank → `place n_in_group:4`, `commit`, "The fence is done.", Done → **Next plot**, mastery `{3x4_concrete: 0.5}` (hinted). Goat back outside part 3 (feet (593,271) = outside position; screenshot shows it behind the fence). Next plot → `2x3_concrete`, header `2 parts. 3 planks in each part.`, cart 6.

### 4. Error states — PASS
| Build | Classified | Visual (screenshot) | Goat | Bubble text |
|---|---|---|---|---|
| `[4,0,0]` | `one_group_only` t1 | one full part, two bare post pairs | inside part 2 (index 1) | "Only the first part is built. The other parts are still empty." |
| `[5,4,3]` | `over_count` t1 | rail `0:4` has class `over`, computed `matrix(0.978,-0.208,…)` (−12°), `drop-shadow(… 3px 5px 3px)`, drawn above post 1 | walks to part 3 | "That part has a plank sticking out **over the post**. Take it back to the cart." |
| `[12,0,0]` | `right_total_wrong_grouping` t1 | 8 `.rail.over` with `--o` 0..7, progressively leaning stack; two bare slots | inside part 2 | "A part is still **empty**, but some parts are too tall. Look at the top of each post." |
| `[3,3,3]` | `ambiguous` t1 | uniform short parts | inside part 1 (index 0) | "Show me a part that looks finished." — **no POST** |
| … tap part 1 (short) | `counted_groups_as_group_size` t1 | pips 1-2-3 then hint after 1.75 s | — | "Each part needs the same planks. Look at what is in a full part." (POST 1) |
| … Done again, same fence | `counted_groups_as_group_size` **t2** | — | — | "How many parts there are is not how many planks go in a part. Look at how tall a post is." (POST 2) |

Event log (localStorage `rung.v1`, level slice) for the last row: `hint{ambiguous,1}` · `tap_count{group:1}` · `hint{counted_groups_as_group_size,1}` · `commit` · `hint{counted_groups_as_group_size,2}`.

### 5. Repair symmetry — PASS
Empty hand, tap sky (`.isoworld` at (5,5)) → `tap_idle`. Pick up, tap sky → `place_failed{nearest_group:0, held:"plank"}`, plank still held. Empty hand, tap rail `1:2` → `remove{unit:"plank",group:1,n_in_group:2}`, rail element gone (8 → 7… counted), cart +1. Packs: tap top rail of an over-filled part → `remove{unit:"pack",n:2,…}`, two rails removed, cart +1.

### 6. Prefetch — PASS
`window.fetch` wrapped to count `/api/buddy`. `[5,4,3]`: count = **1**, fired on the 5th plank into part 0 (`S.parts[part] > per`), not again when the cart emptied (same `id+tier` key). Done → count still 1 (hint served from `S.pre`). Remove the over rail → bubble hidden, `S.pre` cleared (count unchanged); place it on part 3 → "The fence is done.", no stale hint, count still 1.

### 7. Idle commit — PASS
- `[4,4,3]`, no Done, waited: `commit{reason:"idle"}` at t=79331 vs last `place` t=33976 → **45.36 s**. No bubble, 0 POSTs (classifier → `idle_off_task`). Goat walks to the gap (onCommit does that for any wrong commit).
- Extra: tapping Done ~75 s after the last action → `commit{left_plot}`, still no bubble (`commit.t − lastAct > 30000` rule, fence.mjs:72). See defect D-3.
- Ambiguous: `[3,3,3]` → Done → probe; waited: `commit{idle}` at +45.5 s followed by `hint{counted_groups_as_group_size,1}`, bubble "Each part needs the same planks…", 1 POST. D-049 escalation confirmed (unconfirmed branch after ≥20 s with no tap).

### 8. Mastery & progression — FAIL (one sub-case)
- `[4,4,4]` no hint → `mastery.3x4_concrete = 1`; Next → `2x3_concrete`, `[3,3]` → `2x3_concrete = 1`; Next → `3x3_concrete` (never a mastered node). Ambiguous on 3x4 then finish → Next → **`4x3_concrete`**.
- All 12 nodes set to 1 in `rung.v1`, reload `/build`: header empty, `#scene` has 0 children, 0 hits, footer still shows Cart/Done. Console: `Uncaught TypeError: Cannot read properties of undefined (reading 'groups')` at `build:88` from `build:240` (`start(next(S.mastery))` with `next()` → `null` → `shape(null)`). Screenshot: empty sky. **Crash, not an end screen.**
- Related: reaching the 12th completion in play goes through `advance()` (build.html:215), which silently does `S.mastery = {}` and restarts — the parent screen loses the whole record.

### 9. Packs — PASS
`3x4_packs`: slip visible, cart/Done hidden, header `3 parts. 4 planks in each part. Packs of 2.`; `#addpack` 44×44, Deliver 44 tall; 6 taps → 6 silhouettes; Deliver → `order{packs:6}`, cart shows 6 packs, Done appears. Pack held (label "In hand. Tap a part.") → part 0 → rails `0:0,0:1`, `place{unit:"pack",n:2,group:0,n_in_group:2}`. Two per part → correct, mastery 1.
Fresh, order 12 (slip caps at 12 — a 13th tap is ignored): 2 packs per part → 12 rails, cart 6, **not** finished (D-047); Done → `hint{pack_unit_confusion,1}` "A pack holds many planks. Look inside a pack.", **Order again** visible, goat does not move (no gap). Order again → slip returns, second `level_start`. Order 3 → 1 per part `[2,2,2]` → Done → same id `pack_unit_confusion` (tier 1 again — the level restarted, so hint history reset). Fresh, order 6, 3 packs on part 0 → rails `0:0..0:5`, `0:4*`/`0:5*` `over` (screenshot: two tilted rails above the post).
`4x3_packs`: header `… Packs of 3.`; order 4 → 1 per part → correct, mastery 1. Order 12 → 1 per part → `pack_unit_confusion`, Order again shown.

### 10. Persistence — PASS
Mid-level (`3x3_concrete`, `[3,0,0]`, hint shown) → navigate `/build` → node `3x3_concrete`, header right, `parts [3,0,0]`, cart 6, exactly **3 `.rail` elements** (`0:0,0:1,0:2`), level slice intact (7 events). Not restored: the hint bubble and the goat's position (goat back at base, outside). `rung.v1 = "garbage"` → `/build` loads `3x4_concrete` fresh, 12 planks, storage rewritten as valid JSON, no console error.

### 11. Parent screen — PASS
After 3x4 ✓, 2x3 ✓, 3x3 `[3,0,0]` hinted: "**2** fences finished", "Finished without a hint: 3 parts of 4, 2 parts of 3.", "One part is built and then the job stops, as if one part were the whole fence.", ASK OUT LOUD "Is the fence finished? Walk along it with your finger." Digits on the page: `2` (count), `3 4 2 3` (shape names — the problem, not the answer; the answer 12/6/9 appears nowhere). Empty storage: "0 fences finished", "No fences yet. The first plot is waiting.", ask box hidden, no error.

### 12. Responsive — PARTIAL
| | 1280×720 | 375×812 | 320×640 |
|---|---|---|---|
| horizontal scroll (`scrollWidth` vs `clientWidth`) | none | none (375/375) | none (320/320) |
| `.hit` boxes | 170×~240 | 78×111 | 66×95 |
| Done / Deliver / Order again | 44 h | 44 h | 44 h |
| `#cart` | 56 h | 56 h | 56 h |
| `#addpack` | 44×44 | — | 44×44 |
| **`#grown` link** | 42 h | **42 h** | **42 h** |
| header | 50 h, stage starts at 50 | 50 h | 89 h (2 lines; 114 h with "Packs of 2.") — stage starts below it |
| bubble | 280 w, 17 px | 280 w inside viewport | 280 w at left 30 (inside 320) |
| fence | scale 2.18 | scale 1.0, rail 50×30 | scale 0.85, rail 43×26 — legible |

Screenshots at 375 and 320 show bubble, goat and fence readable; the 12-pack slip at 320 wraps to 4 rows and the footer grows to 202 px (stage 323 px) — still usable.

### 13. Reduced motion — FAIL
Rules present: `build.html:44` `@media (prefers-reduced-motion:reduce){#bubble,.pip{animation-duration:.01s}}`; `fence.mjs:256` `.rail{animation:none} .goat{transition:none}`; `fence.mjs:224` goat legs `dur = 0`; `village.mjs:135` `.bld{animation:none}`. Rails, goat and bubble are fine. **Pips are not**: `.pip{animation:pip 2s both}` with keyframes `0%{opacity:0} … 100%{opacity:0}`; at 0.01 s the animation finishes instantly and `fill-mode: both` parks the pip on the 100% frame (opacity 0) for its 2.1 s life; during each pip's `animation-delay` the 0% frame (opacity 0) applies. Verified by injecting the identical rule and tapping a 3-rail part: 3 pips created, computed opacity `0,0,0`, pip 1 `finished@10ms`, screenshot shows no pips. Tap-to-count gives a reduced-motion user nothing.

### 14. Offline / degrade — PASS (reject) / PARTIAL (hang)
- `window.fetch = () => Promise.reject(TypeError)`, `[4,0,0]`, Done → bubble "Only the first part is built…", `#bsrc` = `template`, no console error.
- fetch that never resolves but honours `signal` → aborted = true, template bubble shown at ~2.8 s in this pane (see caveat; `AbortSignal.timeout(1200)` in `buddy.mjs:104` and `buddy_test` "fetch hangs past timeoutMs → template (timeout)" both say 1.2 s).
- Informational: a fetch that ignores `signal` never shows a bubble — `hint()` has no independent race timer. Real `fetch` honours abort, so no user-facing path today.

### 15. Text audit — PASS
- Emoji: none in `build.html`, `parent.html`, `fence.mjs`, `buddy.mjs`. (`village.mjs:27-45` carries 10 emoji in the frozen village `BUILDS` table — served to the browser as data, never rendered by `/build`.)
- Non-ASCII in the four files: only `—`, `→`, `×`, `≥`, `§`, `∪` inside code comments and `parent.html:6` `<title>Rung — for grown-ups</title>`.
- Digits in child-facing strings: only `build.html:97` (the header, allowed) and `build.html:178` (pip numerals, intended). `parent.html:56` prints the fence count; `parent.html:49` prints shape names ("3 parts of 4").
- Attribution strings: `buddy.mjs:115` `const MODEL = "claude-haiku-4-5-20251001"` — **ALLOWED** (config value); `buddy.mjs:123,125` `api.anthropic.com` / `anthropic-version` header — API endpoint, ALLOWED; `server.mjs:31` `ANTHROPIC_API_KEY` env name — ALLOWED. `village.mjs:5` comment "Why not AI-generated images: tested and failed (see D-040)" — about image generation, not assistant attribution; frozen file; reported for completeness. No "Claude", "AI assistant" or "generated with" anywhere in commits' subject lines seen (`git log` 3 commits) or in the four files.

### 16. Cold run — PASS
`git clone` → `rung-clone` at `0aeaa8e`. `PORT=5188 node src/server.mjs` → "Rung running on http://localhost:5188"; `/build` 200, `/fence.mjs` 200, `/buddy.mjs` 200, `/public/parent.html` 200, `/assets/fence/rail.png` 200; `POST /api/buddy` → 200 template `reason:"no_key"`. `python evals/run_all.py` in the clone → 5/5 PASS. Byte sizes differ from the working tree by exactly one byte per line (CRLF from the clone's autocrlf), content identical. The only uncommitted file in the source repo is `.gitattributes`; nothing the app needs is missing. Process killed afterwards.

---

## Defects, ranked

No SEV1. The demo beat itself (case 3) runs clean end to end.

### D-1 · SEV2 · Reduced-motion users get no counting pips
- Repro: enable OS "reduce motion" (or inject `.pip{animation-duration:.01s}`), tap a built part with an empty hand.
- Observed: `tap_count` logs, pips are created, none is ever visible (opacity 0 for the whole 2.1 s).
- Where: `src/public/build.html:44` (`#bubble,.pip{animation-duration:.01s}`) against `:41,43` (`animation: pip 2s both`, 100% frame `opacity:0`). Fix shape: give `.pip` a static visible state under reduced motion (e.g. `animation:none; opacity:1` and rely on the existing `setTimeout(el.remove)`), keep the `.01s` only for `#bubble`.

### D-2 · SEV2 · All twelve plots mastered → reload crashes to a blank scene
- Repro: set every `mastery[node] = 1` in `rung.v1` (or finish all 12), reload `/build`.
- Observed: `TypeError: Cannot read properties of undefined (reading 'groups')`, empty header, empty scene, footer orphaned. Spec expects a graceful end screen.
- Where: `src/public/build.html:240` `start(… ? next(S.mastery) : "3x4_concrete")` — `next()` returns `null` (`fence.mjs:24`) and `start(null)` dereferences `shape(null)` at `:88`. Also `:215` (`advance()`) resets `S.mastery = {}` silently, wiping the parent screen's record. One guard + one "every plot is fenced" bubble covers both.

### D-3 · SEV2 · Done pressed more than 30 s after the last action gives no hint
- Repro: build `[4,4,3]`, talk for 31 s, tap Done.
- Observed: `commit{left_plot}` logs, classifier says `idle_off_task`, goat walks, **no bubble**; a second Done does the same. Only a `place`/`remove`/`tap_count` re-arms a hint.
- Where: `src/public/fence.mjs:72` (`commit.t - lastAct > 30000 → idle_off_task`). Spec-conformant (CONCEPT §4), but a presenter narrating the 20-second beat for half a minute before tapping Done will get silence on camera. Either an explicit Done should outrank the gap rule (a tap on Done is not idle), or the film script must tap Done within 30 s.

### D-4 · SEV2 · The hand is sticky and a second cart tap drops it
- Repro: tap cart, tap part, tap cart, tap part (the rhythm CONCEPT §2 describes: "tap the cart, tap the part").
- Observed: `place`, then the 2nd cart tap toggles the hand empty (no event), then the 2nd part tap becomes `tap_count` (pips) instead of `place`. Events: `plank_held · place · tap_count · plank_held · place · tap_count`.
- Where: `src/public/build.html:121` (`S.held = S.held ? null : …`) and `:151` (held survives a place). Not recorded in `DECISIONS.md`. The label "In hand. Tap a part." mitigates; hands-only filming that follows the spec's own wording will misfire. Decide and write it down (D-0xx), or make a cart tap while holding a no-op.

### D-5 · SEV3 · `/public/../server.mjs` returns 200; the traversal guard is cosmetic
- Where: `src/server.mjs:72-73` — `join()` normalises `..` so `startsWith(HERE)` always passes for anything under `src/`. Nothing secret is under `src/`, so no exposure today; the guard reads as protection it is not. `/../…` (above `src/`) is correctly 403.

### D-6 · SEV3 · PNG assets served as `application/octet-stream`
- Where: `src/server.mjs:36` `TYPES` lacks `.png` (and `.jpg`). `<img>` sniffing hides it; a judge opening an asset URL gets a download. One entry.

### D-7 · SEV3 · "For grown-ups" link is 42 px tall (< 44)
- Where: `src/public/build.html:34` `#grown{… padding:12px 4px}` with 13 px text. Parent-facing, so low impact; `padding:13px 4px` or `min-height:44px`.

### D-8 · SEV3 · Hint bubble and goat position are not restored on reload
- Repro: get a hint, reload. Fence and cart restore exactly; the bubble is gone and the goat is back outside. The event log still holds the `hint`, so the parent screen is unaffected. `build.html:237-239`.

### D-9 · SEV3 · Tier never escalates across "Order again"
- `again` → `start(S.node)` writes a new `level_start`, and `classify()` counts hints only in the current level slice, so a second `pack_unit_confusion` is tier 1 again (observed: 12 packs → t1, Order again, 3 packs → t1). `S.retry` caps mastery at 0.5 correctly. `build.html:128`, `fence.mjs:48-49`.

### D-10 · SEV3 · Correct-looking fence that will not finish (packs, by design)
- Order 12 packs, place 2 per part: all 12 rails stand, cart holds 6, Done shows "A pack holds many planks. Look inside a pack." and Order again; the goat does not move. D-047 intends this (the order is the observed act), but on screen it reads as "the fence is done and the game disagrees". Worth a sentence in the voiceover or a template that mentions the leftover packs.

### Observations (not defects)
- `#bsrc` debug source label only renders with `?debug=1`; without it no non-header digit or meta text is visible.
- `/public/` (a directory) → 500 `server error`; fine, no leak.
- Emoji exist only in the frozen `village.mjs` data table, never rendered by `/build`.
- `parent.html` prints shape names with digits ("3 parts of 4"); that is the problem statement, not the product, and matches the header the child already sees.
