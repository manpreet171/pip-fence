# TEST REPORT — Kuzhi, independent QA (16 Sep 2026)

Scope: `heritage/` as committed at `c77b037`. Method: every browser case was driven with real hit-tested
pointer input — Playwright `page.mouse.click(x, y)` at `getBoundingClientRect()` centres, `page.keyboard.press`
for J — against a server started for this run (`PORT=5191 node heritage/src/server.mjs`, DeepSeek key present).
No `.click()` dispatch anywhere. Zero console errors and zero failed requests were required for every case and
are reported per case. Nothing in `src/`, `data/` or `evals/` was edited; the only file written is this one.
Playwright was installed in the QA temp directory and removed afterwards; the 5180 server was not touched.

Timings come from a `MutationObserver` on the board plus a hook on `localStorage.setItem` (every logged event
stamped with `performance.now()`); speech from a hook on `speechSynthesis.speak`. Headless Chromium 1280×720
unless stated; it exposes a real `speechSynthesis` (three voices), `prefers-reduced-motion` off, Fredoka loaded.

## Summary

| # | Case | Result | Notes |
|---|---|---|---|
| 1 | Automated evals | **PASS** | `run_all.py` ALL PASS (5/5); engine 39 asserts; classifier 94 fixtures, 75/75 right when committed, 0 mismatches; buddy_test all pass; readinglevel 27 templates, 0 numbers |
| 2 | HTTP | **FAIL** (one route) | `GET /judge.mjs` → **404** (D3). Every other route, type, 400/404 and error body as specified |
| 3 | The move (§3) | **PASS** | 3 seeds sowed in 764–776 ms (250 ± 8 ms each); marker flips; code tag; wrong call: marker stays, no red, card beside marker, spoken once, pips one per seed ending on the landing pit, never spoken over pips; marker fades on the next pick |
| 4 | Every classifier id | **PASS** | All eight hinted ids reached the card; `guessing` silent with no request; `ambiguous` = fixed probe, no `/api/buddy`, resolved by a source-pit tap to `counted_start_pit` with a hint after |
| 5 | Tier escalation | **PASS** | `counted_start_pit` ×3 → hint events tier 1, 2, 3; wire tier 2 / 3; cards = tier template or gated rephrase |
| 6 | Rules on screen | **PASS** | Capture earned only on a correct call (forfeit leaves the seeds); pasu flashes and moves four; relay once, never twice; no skipping; source emptied; both wraps |
| 7 | The opponent | **PASS** | Legal moves only; 125–134 ms per seed (median); "other side: code, p_best = 0.6" on every turn row; never stalled |
| 8 | End of game | **PASS** | "The seeds are in. Your store holds more." (no digit); Next board → `next()`; all six mastered → end screen; Start again resets only on tap |
| 9 | Persistence | **PASS*** | Mid-game and mid-call reload restore; non-JSON `kuzhi.v1` → fresh level. *An extra probe (right keys, wrong types) throws at boot — D4 (SEV3) |
| 10 | Judge overlay | **PASS** | J / `?judge=1` open, J closes; live rows; classifier row matches the board; `[no digits]` verified independently on `payload()` and on the wire; source / ms / model shown; `judge.mjs` not fetched on a plain load; child's area byte-identical after closing |
| 11 | Parent page | **PASS*** | Empty → no request; two boards → model note (≤3 sentences, one question, no blame, no digits, facts match); curve 8 bars + percentages; corrupt storage loads. *Note fell back to the template in 3 of 7 live calls — D2 (SEV2) |
| 12 | Source screen | **PASS** | Diacritics, "one simplified version", "the call is our addition", linked sources with confidence words, no banned phrases |
| 13 | Responsive + a11y | **FAIL** at 320 px | 1280×720 and 375×812 pass every check. **320×640: all seven of her pits are 36 px and pit 0's centre is covered by the hand tray** — D1 (SEV2). 375×667: pits 38 px |
| 14 | Sound | **PASS** | Default on, toggle off silences and persists in `kuzhi.sound`, hidden without `speechSynthesis` |
| 15 | Text and attribution audit | **PASS** | No emoji; no digits in child-facing strings off the sign; every "Anthropic/claude/agent" hit is a vendor id, API host, env var or a research memo's rejected-list entry (listed below); no attribution trailer in the last 12 commits |
| 16 | Cold clone | **PASS*** | Clone serves everything, `run_all.py` ALL PASS, `/api/buddy` answers. *`/judge.mjs` 404 there too (same D3); nothing missing from the tree |

Rate limit (not in the case list, checked because case 2 mentions it): the 61st POST within a minute from one
address returns 429 on both `127.0.0.1` and `::1`; body "slow down".

## Per-case evidence

### 1. Automated
`python heritage/evals/run_all.py` → readinglevel --assert PASS, engine_test PASS, classifier_eval PASS, buddy_test PASS,
TEMPLATES == hints.txt PASS, **ALL PASS**, exit 0. `engine_test.mjs`: 39 asserts passed. `classifier_eval.mjs`:
fixtures 94, committed 75, right when committed 75/75 = 100 %, silent 19 (20.2 %), mismatches 0. `buddy_test.mjs`:
"all checks passed". `readinglevel.py`: 27 templates, max 2 sentences, 8.9 words/sentence, base+domain 99 %,
out-of-list [early, met, path, tap], hints with a number 0.

### 2. HTTP
| Request | Result |
|---|---|
| GET `/`, `/board` | 200 text/html 13087 B |
| GET `/sow.mjs`, `/buddy.mjs` | 200 text/javascript |
| GET `/judge.mjs` | **404** (expected 200; contract "Static routes") — D3 |
| GET `/public/parent.html`, `/public/source.html` | 200 text/html |
| GET `/assets/fonts/Fredoka.ttf` | 200 font/ttf 159184 B |
| GET `/public/../server.mjs`, `/server.mjs`, `/nope` | 404 "not found" |
| POST `/api/buddy` valid | 200 `{"text":…,"source":"model","model":"deepseek-v4-flash"}` in 0.84 s |
| POST `/api/buddy` extra shape key `x1`, string `"1"` in shape, unknown id, bad JSON | 400 "bad payload" / "bad json" |
| POST `/api/note` empty week | 200 `reason:"nothing_to_say"` in 4 ms (template, no model call) |
| POST `/api/note` bad `open_id` | 400 |
| POST `/api/coach` | 404 |
| Headers | `Cache-Control: no-store`; no path or stack in any error body |

### 3. The move (CONCEPT §3), 1280×720, `?node=3_single`
- Tap pit 0 → `.pit.up` on 0, hand strip 3 seeds, pit 0 empty. `landing(state, 0)` imported in page context → landed 3, path [1,2,3].
- Tap pit 3 → `#marker.drop`, centred 26 px right / 29 px above the pit centre (its designed offset, inside the pit's 97 px box).
- Sow: hand decrements 2, 1, 0; pit landings at +254, +258, +253 ms; **total 764 ms** for 3 seeds (second run 776 ms) — within 750 ± 30 %.
- Marker classes drop → drop hit (flip). `#ctag` shown during the code move; `turn{side:"code",from:10,landed:13}` logged. No capture on this move (capture path covered in case 6). DOM == `state.pits` after both moves.
- Wrong call (board `3_single` with pits 11–13 empty so the code side cannot refill her row): from 2 → landed 5, called 6. DOM at the moment `sow` was logged == `applyMove(pre)`; marker stays on pit 6, not flipped; no red computed colour in `#stage`; card `role=status` text "Your marker is a pit late. The last seed landed before it." (`source:"model"`, verbatim template; a second run got `source:"template", reason:"vocab"`); card rect overlaps neither marker nor landing pit; **spoken exactly once**, text === card, rate 0.92.
- Empty-hand tap on pit 2 → 3 pips at the centres of pits 3, 4, 5 (delays 0 s, 0.4 s, 0.8 s), last pip on the landing pit (Δ < 0.01 px); `tap_count{pit:2}` logged.
- Next pick → `#marker.gone`, computed opacity 0, card hidden.
- Pips then a wrong call inside their window: card shown at 9738 ms, last pip removed at 11451 ms, **utterance at 11842 ms** — never while pips run.
- 0 console errors, 0 failed requests.

### 4. Every classifier id (board states via `kuzhi.v1`, then real taps)
| id | board / move | classify | card |
|---|---|---|---|
| counted_start_pit | 3_single, 0 → 3, call 2 | ✓ tier 1 | model rephrase, or template verbatim |
| overshot_by_one | 3_single, 0 → 3, call 4 | ✓ | "Your marker sits past the pit. The last seed landed before it." (model) |
| miscounted_seeds | 3_single, 1 → 4, call 2 | ✓ | template (model rejected) |
| stopped_at_corner | 6_single, 3 → 9, call 6 | ✓ | model rephrase |
| direction_reversed | 3_single, 3 → 6, call 0 | ✓ | template verbatim via model |
| stopped_at_first_lap | 3_relay, 3 → hops [6,10], call 6 | ✓ | model rephrase |
| guessing | 3_single, pit 3 called from 0, 2, 4 | ✓ on the third | **no card, no hint event, 0 `/api/buddy` requests** after the third call |
| ambiguous | 2_single, 5 → 7, call 6 | ✓ | "Show me where your first seed goes." — **0 `/api/buddy` requests**; tap on pit 5 → `tap_count{5}`, classify → `counted_start_pit` confirmed, hint event + one request + card |
Every card text was either the id's tier-1 template or the exact text of the `/api/buddy` response with `source:"model"`. 0 errors / 0 failed requests.

### 5. Tier escalation
`counted_start_pit` from pits 0, 2, 3 (calls 2, 5, 7): hint events `[tier 1, tier 2, tier 3]`; request bodies carried `tier` 2 then 3;
cards: tier 2 = template[2] verbatim (`source:"template"`), tier 3 = template[3] (`source:"model"`, verbatim).

### 6. Rules on screen
- Capture earned: `2_single` with pit 3 empty, 0 → 2 called 2 → `capture{pit:4,seeds:2,earned:true}`, store 0 drawn with 2 seeds.
- Capture forfeited: same board, called 1 → `capture{earned:false}`, pit 4 keeps 2, stores [0,0] after her move.
- Pasu: `4_single` with pit 1 at 3, 0 → 4 → `four{pit:1,owner:0}`, `.flash` seen on pit 1, store 0 = 4.
- Relay: `3_relay` from 3 → `sow{3→6,[4,5,6]}`, exactly one `relay{6→10,[7,8,9,10]}`, hand strip showed 4 during the relay, pit 10 keeps its four seeds (no second relay).
- Wrap her last pit → other row: 6 → `[7,8]`. Wrap far row → hers: code with only pit 13 → `turn{from:13,landed:1}`, pit 0: 0→1, pit 1: 3→4. DOM == state on all 14 pits and both stores after every move.

### 7. The opponent (`3_single`, three code moves)
`turn.from` ∈ {10, 11, 7}, each with seeds before the move; per-seed landing deltas 134/133, 123/123/132, 125/125 ms
(the final delta of each move is the seed-to-store or lift pause, excluded); median **125–134 ms**. Overlay: 3 turn rows, 3
"other side: code, p_best = 0.6" tags, plus the summary section. Her turn returned after every code move.

### 8. End of game
`3_single`, only pit 6 with one seed, stores [5,2]: after her move and the code's, she cannot move → label "The seeds are in.",
card "The seeds are in. Your store holds more." (no digit), `level_end{stores:[5,3]}`, marker faded. Next board (real tap) with
`2_single`/`3_single` mastered → `4_single`, sign "4 seeds in every pit". All six mastered in storage → "Every board is played.",
Start again shown, hand hidden, mastery untouched until the tap; tap → mastery `{}`, `2_single` fresh.

### 9. Persistence
Reload after one exchange → state, DOM and side identical, her turn. Pick + call then navigate inside the 400 ms pre-sow delay
(log held `pick`, `call`, no `sow`) → marker restored on the called pit (opacity 1 after the drop), the sow ran and was logged
once (2 calls, 2 sows in the level). `kuzhi.v1 = "{corrupt json"` → `2_single` fresh, all pits 2, no error.
**Extra probe:** `{"v":1,"mastery":"x","events":"y","game":{…}}` → `pageerror: S.events.push is not a function`, sign blank — D4.

### 10. Judge overlay
Plain `/board` load requested only `board.mjs`, `sow.mjs`, `buddy.mjs`, the font — no `judge.mjs`. J → `#judge` visible and
`judge.mjs` fetched then. Event count 1 → 2 on a pick with the row `pick {"pit":0,"seeds":3}`. After a wrong call: classifier row
`id overshot_by_one`, `called 4 landed 3`, DOM == state. Badge `[NO DIGITS]`; independent check: `payload(classify(level))`
and the wire body both digit-free outside `age`, `tier`, `reading_level`. Last hint: `source model`, `round trip 759 ms`,
`model deepseek-v4-flash`. J closes; `?judge=1` opens. Full-page screenshots before open and after close: **byte-identical**.

### 11. Parent page
Empty storage → 0 `/api/note` requests, "No boards yet. The seeds are waiting.", ask box hidden. Two finished boards written to
storage (a `2_single` with four right calls, a `3_single` with two `counted_start_pit` hints, last one tier 2):
request body `{open_id:"counted_start_pit", tier:2, solo:["2 seeds a pit"], helped:["3 seeds a pit"], days:2}` — matches the
storage. Model note (first page load): *"She played twice this week, finishing a level with two seeds in each pit all on her own,
and another with three seeds when she had a hint. She is still working on where the first seed goes after she picks up a pit:
her call comes out one pit early. When you play together, you can ask her to point to the pit she picks up, then the next one,
before she says her call."* — 3 sentences, one question, no blame word, no digit, every fact in the summary. Header "2 boards
finished", lists correct; curve 8 bars `[T,T,T,T,T,F,T,F]`, "Right calls: 100% in her first 4 moves, 50% in her last 4."
Corrupt and structurally odd storage → page loads, no error.
**Flakiness:** across 7 live calls with this summary the note came from the model 4 times; 2 fell back with `reason:"length"`
(> 400 chars) and 1 with `reason:"timeout"` (4 s). The fallback reads "This week 2 levels were finished, some with a hint. …" — D2.

### 12. Source screen
Opened by a real tap on "Where this game comes from". Contains Pallāṅkuḻi, Aḷi Guḷi Maṇe, Vāmana Guṇṭalu, Oware, Toguz Korgool +
UNESCO; "earliest evidence"; "Ours is one simplified version."; "The call is our addition."; five linked sources each with
high/low confidence tags; no "5,000", "Chola", "Vedic" (the only "kings" sentence says such stories are not repeated). Back
link returns to `/`. `board.html` has no diacritics.

### 13. Responsive + a11y (each viewport in its own browser context, real taps)
| Viewport | H-scroll | Her row | Pit size | Reachable (elementFromPoint) | Card vs marker/landing | role / font |
|---|---|---|---|---|---|---|
| 1280×720 | none | lower row (y 414 vs 291) | 97–99 px | 7/7 | no overlap, in view | status / Fredoka loaded |
| 375×812 | none | right column (x 224 vs 157, HD-009) | 51–52 px | 7/7 | no overlap, in view | status / loaded |
| **320×640** | none | right column | **35–36 px** | **6/7 — pit 0 → `#hand`** | no overlap (tested from pit 3) | status / loaded |
Follow-up probe: `--hud` is 172 px but the wrapped HUD measures **250 px at 320 wide and 210 px at 360–412 wide**; the board is
laid out against the 172 px reservation, so at 320×640 the tray (top 390) covers the board's bottom (463) and pit 0. Also
320×568: pit 0 covered, pits 29 px; 375×667: pits 38 px; 360×740: 44–45 px; 375×812 and 412×915 fine.

### 14. Sound
"Sound on", no `kuzhi.sound` key; hint → 1 utterance. Tap Sound → "Sound off", `kuzhi.sound = "0"`; next hint shows the card with
no new utterance; reload keeps "Sound off". With `speechSynthesis` removed before load, `#sound` is hidden (`display:none`).

### 15. Text and attribution audit (`src/**`, `README.md`, `docs/*.md`)
- Emoji: none. Digits in child-facing strings: none except the sign (`taskLine`, board.mjs:132 — note it uses a non-breaking
  space "3 seeds", deliberate). Parent page carries digits by design (adult-facing).
- Hits for Claude / Anthropic / assistant / orchestrator / agent, all legitimate:
  `src/buddy.mjs:117,146–150,169,224,249` (provider name, `claude-haiku-4-5-20251001` model id, `api.anthropic.com`, provider
  default); `src/server.mjs:12–13` (`ANTHROPIC_API_KEY`, provider); `docs/BUDDY-CONTRACT.md:21` and `docs/LATENCY-RESULTS.md:40–41`
  (same); `docs/RESEARCH-AI.md:262` ("an agent" in the list of rejected approaches). Zero hits for "Co-Authored", "Generated
  with", "assistant", "orchestrator". Last 12 commit messages: no attribution trailer.

### 16. Cold clone (`git clone` into temp, `PORT=5192`)
`/board`, `/sow.mjs`, `/buddy.mjs`, `/public/parent.html`, `/public/source.html`, `/assets/fonts/Fredoka.ttf` → 200 with the same
sizes as the working tree; `/judge.mjs` → 404 (D3); `/api/buddy` → 200 (that call was gated: `reason:"number"`, template shipped);
`run_all.py` ALL PASS. Tree complete: `data/{hints,wordlist}.txt`, all evals, `src/public/assets/fonts/{Fredoka.ttf,OFL.txt}`.
The root has an untracked `docs/LEARNING.md` (outside `heritage/`, not part of this scope).

## Defects, ranked

**D1 — SEV2 — 320 px portrait: the HUD overlaps the board; pit 0 cannot be tapped; every pit is under 44 px.**
Repro: viewport 320×640, `/board?node=3_single`; `document.elementFromPoint` at the centre of `.pit[data-pit="0"]` returns `#hand`;
every `.pit` is 35–36 px. Same at 320×568 (29 px). At 375×667 pits are 38 px. CONCEPT §10.5 names 320 px as the size the
mechanic must survive. Cause: `board.html:126` reserves `--hud:172px` for widths ≤ 640, but the flex-wrapped HUD
(`board.html:129–135`: tray 100 %, buttons, then the links row) measures 210–250 px, and `layout()` (`board.mjs:36–39`) sizes
the board from `#scene`, which ends at the 172 px line. Suggest: set `--hud` from `$("hud").offsetHeight` inside `layout()` (a
`ResizeObserver` on `#hud`), and at ≤ 360 px put Sound and the two links on one row so the pits get the height back.

**D2 — SEV2 — The parent note falls back to the template roughly 3 times in 7, and the fallback carries a digit.**
Repro: POST `/api/note` with `{open_id:"counted_start_pit", tier:2, solo:["2 seeds a pit"], helped:["3 seeds a pit"], days:2}`
seven times: 4 × `source:"model"`, 2 × `reason:"length"`, 1 × `reason:"timeout"` (in-browser). The fallback note is
"This week 2 levels were finished, some with a hint. The call comes out a pit early. …" — a digit describing a count, and
it reads as a system message beside the model's warm note. Cause: `buddy.mjs:215` caps the note at 400 chars while the prompt
allows three sentences and `max_tokens: 220` (`buddy.mjs:141`); the 4 s timeout at `buddy.mjs:224` is tight for DeepSeek at
1.2–1.4 s typical. Suggest: ask for "at most sixty words" in `NOTE_SYSTEM`, raise the cap to ~520, spell the count in
`noteFallback` ("two levels"), and consider 6 s for the note (the parent page shows "Writing your note…" meanwhile).

**D3 — SEV3 — `GET /judge.mjs` → 404; the contract says it is served.**
`server.mjs:52` maps `/judge.mjs` to `src/judge.mjs`, but the file lives at `src/public/judge.mjs` (HD-009) and the page imports
`/public/judge.mjs` (`board.mjs:344`), so the overlay works. `docs/BUDDY-CONTRACT.md` "Static routes" lists `/judge.mjs`. Fix
either the route (`"/judge.mjs": "/public/judge.mjs"`) or the contract line.

**D4 — SEV3 — A `kuzhi.v1` with the right keys but wrong types crashes the boot.**
Repro: `localStorage.setItem("kuzhi.v1", '{"v":1,"mastery":"x","events":"y","game":{"node":"9_zzz","state":5}}')`, load `/board` →
`TypeError: S.events.push is not a function`, sign blank, no level starts. `board.mjs:15` guards only `JSON.parse`; `:318` trusts
`saved.mastery` and `saved.events`. Fix: `Array.isArray(saved.events) ? saved.events : []` and an object check on `mastery`
(one line each). Not reachable through normal play; reachable by a future storage-format change.

**D5 — SEV3 — Overlay: "classifier · now" reports tier 2 immediately after the tier-1 hint is logged.**
`judge.mjs:50` prints `classify(level).tier`, which by contract is 1 + hints already logged, so right after a hint the panel reads
"last hint … tier 1" above "classifier tier 2". Correct, but a reviewer reads it as a disagreement. Suggest the label "next tier".

**D6 — SEV3 — Model rephrases of `counted_start_pit` sometimes invert the instruction.**
Observed gated, on-list, number-free rephrases: *"Look at the pit where your marker sits. That pit is where you begin, so you do
not pick up a seed from it."* and, after the probe, *"Your marker sits on the pit, so that pit is where you begin. Pick up the
seed from the pit right after your marker, not from the pit under it."* The lexical gate (`buddy.mjs:91–99`) cannot see that
the second tells her to pick up a different pit. LATENCY-RESULTS already notes imprecise rephrasings; for the demo, pinning
`temperature` to 0 or serving templates at tier 1 removes the risk without touching the architecture.

**Observation, not a defect —** on a 1-seed move the contract's fencepost call is the source pit itself (ENGINE-CONTRACT), but a
tap on the lifted pit means "put the seeds back" (`board.mjs:158`), so `counted_start_pit` can never be logged on a 1-seed move.
Harmless; worth a line in the contract.

## Housekeeping
Server 5191 stopped; 5180 untouched. Playwright, Chromium and the clone removed from the QA temp directory.
