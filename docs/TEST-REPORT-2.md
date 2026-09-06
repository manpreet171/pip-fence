# TEST REPORT 2 — Rung after the scene rebuild and the three AI additions (7 Sep 2026, 11 days to 18 Sep)

Independent QA pass, round 2. Build under test: the committed tree at `e104a9a` ("Parent note: the thing to ask may be an
instruction; fallback counts fences plainly"); the working tree differs from it only by line endings and the gitignored
`CLAUDE.md`. Server under test: the running `node src/server.mjs` on :5177 with a DeepSeek key live (every `/api/buddy`
answer below is `source:"model"`). No source, data or eval file was edited; no git command other than the one clone.

**Harness (the round-1 lesson, applied).** Every browser case was driven by Playwright 1.63 (installed in the QA temp
directory, deleted afterwards) on the machine's cached Chromium 151 (`ms-playwright/chromium-1234`, headless). Every
tap is `page.mouse.click(x, y)` at the centre of the target's `getBoundingClientRect` — cart, part hit region, rail,
button. No `.click()` dispatch anywhere. Reachability is an `elementFromPoint` grid (84 interior points per part
polygon, 2 px inside the clip edge). Console errors, page errors, failed requests and 4xx/5xx responses were collected on
every page; **zero on every case** unless a row says otherwise. Screenshots named below live in the QA temp directory
(`scratchpad/shots/*.png`); the measurements quoted are what they were taken from.

---

## Summary

| # | Case | Verdict |
|---|---|---|
| 1 | Automated: `run_all.py`, `buddy_test`, `classifier_eval` | **PASS** — 5/5 ALL PASS; buddy_test exit 0; 55/55 committed, 0 mismatches |
| 2 | Real-tap sweep, both sizes, overlay open / collapsed | **PASS** — 11/11 planks by real taps in all four runs, 0 `place_failed`, 84/84 points reach every part |
| 3 | Demo beat (CONCEPT §9) at 1280×720 | **PASS** — goat in at the short part, card beside the gap covering nothing, pips 1-4 with no removal, second tap removes one, over-rail tap removes, last plank → goat out → "Next plot" |
| 4 | Error states at 1280 and 320 | **PASS** — all ten render, classify and phrase; one SEV3 (320 `[12,0,0]` card touches the tower tip) |
| 5 | Spoken hints | **PASS** — one utterance per card, text identical, none over pips, Sound off → none, persisted, hidden without `speechSynthesis` |
| 6 | Judge overlay | **PASS** — J / `?judge=1` open, J closes; live events; classifier = fence; `[no digits]` verified independently; 0 differing pixels in the stage after close; `judge.mjs` never fetched on plain `/build`. Two SEV3 quirks |
| 7 | Parent page + model note | **FAIL** — plumbing right (no call on empty storage, `source:"model"`, all gates pass) but **the note invents an open weakness when nothing is open** (8/8 runs); fence counts and sizes correct in 3/3 |
| 8 | `/api/note` trust boundary | **PASS** — extra key / bad `open_id` / `<script>` / days 8 / tier 4 / 13 names → 400; empty week → template `nothing_to_say` in 3.7 ms |
| 9 | Live hint path | **PASS** — 5/5 `model`, round trip 581–990 ms in the overlay; fetch reject → template in 24 ms; fetch hang → template at 2.52 s |
| 10 | Packs level end to end | **FAIL (phone)** — logic passes at both sizes; at 375 and 320 the 12-pack slip covers 100 % of the fence, at 320 the 6-pack slip covers 36 % |
| 11 | Persistence | **PASS** — rails, cart, goat in the gap and the card all restore; `?node=` keeps history; parent count matches |
| 12 | End state | **PASS** — calm end screen, sticky on reload, mastery kept, parent shows the record, `Start again` resets only on tap. One SEV3 (reload after the 12th "Next plot" shows the finished fence, not the end screen) |
| 13 | Responsive + a11y | **PASS** — no horizontal scroll at 1280/375/320; every control ≥ 44 px (link now 48); sign clear of card and barn art; `#bubble` `role=status aria-live=polite`; Fredoka `loaded` |
| 14 | Text and attribution audit | **PASS** — no emoji; no child-facing digits off the sign (pips excepted, as designed); attribution hits are all model id / API host / env var / provider key (listed) |
| 15 | Cold clone on :5188 | **PASS** — every route 200 with the right content type; `/api/buddy` and `/api/note` answer `model`; `run_all.py` ALL PASS in the clone; nothing missing |

Two SEV2 defects, both new features; neither is in the 20-second desktop beat. No SEV1.

---

## Evidence per case

### 1. Automated — PASS
`python evals/run_all.py`: readinglevel --assert, classifier_eval, buddy_test, engine_eval2, TEMPLATES == hints_v2.txt — all PASS, `ALL PASS`, exit 0.
`node evals/buddy_test.mjs`: all checks PASS (note checks included: payload carries no id/log, blame → template, four sentences → template, instruction counts as the thing to ask), exit 0.
`node evals/classifier_eval.mjs`: 68 fixtures, 55 committed, 55/55 right, 13 silent (19.1 %), **mismatches 0**, diagonal-only matrix.

### 2. Real-tap sweep — PASS
Fresh `?node=3x4_concrete`, `[4,4,3]` built as cart-tap → part-tap × 11 by `page.mouse.click`.

| Run | place | place_failed | rails per part | sweep empty (part 0/1/2) | sweep built |
|---|---|---|---|---|---|
| 1280×720 | 11 | 0 | [4,4,3] | 84/84, 84/84, 84/84 | 84/84 ×3 |
| 375×812 | 11 | 0 | [4,4,3] | 84/84 ×3 | 84/84 ×3 |
| 1280×720, overlay OPEN (`?judge=1`, stage `right:420px`) | 11 | 0 | [4,4,3] | 84/84 ×3 (hit rects shifted left by 210 px) | 84/84 ×3 |
| 375×812, overlay collapsed via Hide (tab 71×44 at bottom-right) | 11 | 0 | [4,4,3] | 84/84 ×3 | 84/84 ×3 |

`elementFromPoint` never returned anything but the part's own `.hit` (empty) or its own rails/hit (built). Hit rects: desktop 127×181 per part, phone 67×95. Screenshots `c2_desktop.png`, `c2_phone_judge_collapsed.png`.

### 3. Demo beat — PASS
`?node=3x4_concrete&debug=1`, storage cleared. Sign `3 parts · 4 planks in each part`; 12 boards in the heap; body text minus the sign contains **0 digits**.
- `[4,4,3]` by real taps: 11 `place`, 0 `place_failed`, one board left in the cart.
- Done → events `commit:left_plot` · `hint:off_by_one_in_one_group/1`. Goat `.in`, `translate(0,-66px)` = inside the tile of part 2. Card `That part of the fence is short. Count a full part again.` `#bsrc = model`, side `left` (tail on its left edge, pointing at the gap), rect (956,335)–(1236,428): overlaps **0 posts, 0 rails, not the goat**. `c3_hint.png`: card to the right of the short part, goat's head in the corn behind the rails, nothing red, no modal.
- Empty-hand tap on part 0 → pips `1,2,3,4`, rails on part 0 still 4 (**no removal**). `c3_pips.png`.
- Second tap while the pips are up → part 0 has 3 rails, `remove` = 1, card hidden.
- Put it back; 5th plank on part 1 → `.rail.over` `1:4`, computed `matrix(0.978,-0.208,…)` (−12°). Tap that rail directly → gone, `remove` = 2. `c3_over.png`.
- Last plank on part 2 → `The fence is done.`, Done reads **Next plot**, goat back outside (`translate(66px,-33px)`, not `.in`), mastery `{3x4_concrete: 0.5}`. Next plot → `2 parts · 3 planks in each part`, new `level_start`.

### 4. Error states — PASS (one SEV3)
Each: fresh level, built by real taps (0 `place_failed` in all ten), Done, 3.3 s. `bubbleCovers` = posts/rails the card rect overlaps by more than 2 px; `*` marks an over-count rail.

| Size | Build | Card text (`#bsrc`) | rails / over | card | covers | goat | font |
|---|---|---|---|---|---|---|---|
| 1280 | [4,4,3] | That part of the fence is short. Count a full part again. (model) | 11 / 0 | (956,335) 280×94 | none | in | loaded |
| 1280 | [4,0,0] | Look at the first part—it has planks. The other parts have no planks yet. (model) | 4 / 0 | (500,97) band under sign | none | in | loaded |
| 1280 | [5,4,3] | That part has a plank sticking out over the post. Take it back to the cart. (model) | 12 / 1 | (325,443) below-left of part 0 | none | in | loaded |
| 1280 | [12,0,0] | A part is still empty, but some parts are too tall. Look at the top of each post. (model) | 12 / 8 | (325,443) | none | in | loaded |
| 1280 | [3,3,3] | Show me a part that looks finished. (template, probe) | 9 / 0 | (500,97) | none | in | loaded |
| 1280 | … tap part 1 | Each part needs the same planks. Look at what is in a full part to see how many each part should get. (model) — hints `ambiguous/1 · counted_groups_as_group_size/1` | | | | | |
| 320 | [4,4,3] | template text (model) | 11 / 0 | (20,81) 280×94 | none | in | loaded |
| 320 | [4,0,0] | Only the first part is built. The other parts are still empty. (model) | 4 / 0 | (20,81) | none | in | loaded |
| 320 | [5,4,3] | over_count template text (model) | 12 / 1 | (20,81) 280×118 | none | in | loaded |
| 320 | [12,0,0] | right_total_wrong_grouping template text (model) | 12 / 8 | (20,81) 280×118 | **`0:11*`** (top rail of the tower) | in | loaded |
| 320 | [3,3,3] → tap part 1 | probe → Look at a full part to see how many planks it has. Then check each part to see if it has that many. (model) | 9 / 0 | (20,81) | none | in | loaded |

No horizontal scroll at 320 in any state; card and goat inside the viewport in all ten. Screenshots `c4_1280_443.png` … `c4_320_333_resolved.png`. The 320 `[12,0,0]` overlap is defect D-4.

### 5. Spoken hints — PASS
`speechSynthesis.speak` wrapped by an init script before load.
- `[4,4,3]` → Done: **exactly one** utterance, `text === card text` (`That part of the fence is short. Count a full part again.`), rate 0.92, pitch 1, lang `en`, voice `en-US`.
- Tap a full part (4 pips up), place the last plank 300 ms later: utterances during the pips **0**; after they cleared **1**, `The fence is done.` = the card.
- Sound button: 56 px tall, label `Sound on`; tap → `Sound off`, `localStorage rung.sound = "0"`; `[4,4,3]` → Done → card shown, **0 utterances**; reload → still `Sound off`.
- `speechSynthesis` deleted before load → `typeof === "undefined"`, `#sound.hidden = true`, the card still appears, 0 errors.

### 6. Judge overlay — PASS (two SEV3 quirks)
- Plain `/build?node=…&debug=1`: **no request for `judge.mjs`** (all responses listed). Press `j` → `/public/judge.mjs` fetched, `#judge` open, `body.judge`, `#stage right: 420px`, six sections: level · events (last ten) · classifier · payload `[no digits]` (class `ok`) · last hint · mastery (12 nodes, all 0).
- Live: after 11 real taps the events list holds **10 rows**, last `5916 place {"unit":"plank","group":2,"n_in_group":3}`; classifier `counts [4,4,3]` = rails in the DOM `[4,4,3]`.
- After Done: rows end `commit {"reason":"left_plot"}` · `hint {"id":"off_by_one_in_one_group","tier":1}`; last hint `source model · for off_by_one_in_one_group tier 1 · round trip 713 ms · provider follows the server key`.
- **Independent digit check**: parsed the serialised payload from the panel, removed `age`/`tier`/`reading_level`, `JSON.stringify` → digits found: **none** (age 8, tier 2, reading_level `500-word list, max 2 sentences` are the only digits).
- Panel rect (860,0) 420×720; card right edge 1236 > 860 is false — the card is inside the narrowed stage, never under the panel (`c6_open.png`).
- **Pixel compare**: fresh level, 2.5 s idle, stage clip 1280×602 before `j`; open; `j` again; clip after: **0 of 770,560 pixels differ**, `#stage right` back to `0px`.
- `?judge=1` opens on load. Phone: Hide leaves a 44 px `Judge` tab at bottom-right above the tray (case 2).
- Quirk A: Hide → tab shown; press `j` → tab hidden, panel **still closed**; second `j` opens (D-5).
- Quirk B: after a tier-1 hint the panel's classifier reads `tier 2` and the payload block shows the tier-2 template under "what the model would get", while "last hint" says tier 1 (D-6).

### 7. Parent page — FAIL (note invents; plumbing passes)
- Empty storage: `0 fences finished`, `No fences yet. The first plot is waiting.`, ask box hidden, **0 `/api/note` requests**, 0 errors. `c7_empty.png`.
- `rung.v1 = "{garbage"`: same page, 0 requests, 0 errors.
- Played: 3x4 `[4,4,3]` → hint → fixed → Next plot; 2x3 `[3,3]` correct. Mastery `{3x4_concrete: 0.5, 2x3_concrete: 1}`. Page: `2 fences finished`, `Finished without a hint: 2 parts of 3. Finished with a hint: 3 parts of 4.` Summary POSTed (identical all three times): `{"open_id":null,"tier":1,"solo":["2 parts of 3"],"helped":["3 parts of 4"],"days":1}`. Three loads of `parent.html?debug=1`, all `source:"model"`, "from the model", 0.9–1.2 s:

| Run | Note (verbatim) | Question | sentences / ? / blame / `_` |
|---|---|---|---|
| 1 | This week, your child built a fence with 2 parts of 3 planks each all on their own. They also finished a bigger fence with 3 parts of 4 planks after a small hint. They are still working on counting groups of planks **without ordering them into packs first**. | Which fence did you like building best? | 3 / 1 / none / none |
| 2 | This week, your child built a fence with 2 parts of 3 planks each, all on their own. They also worked on a fence with 3 parts of 4 planks, using a hint to help. They are still practicing counting groups of planks. | same | 3 / 1 / none / none |
| 3 | This week, your child built a fence with 2 parts of 3 planks each all on their own. They also built a fence with 3 parts of 4 planks each with a little help. They are still working on **counting planks in larger groups**. | same | 3 / 1 / none / none |

Fact check against the summary: sentences 1–2 are right in all three (one 2×3 alone, one 3×4 with a hint). Sentence 3 is **not in the summary**: `still_working_on` was `null` (nothing open — the hinted level was finished). Run 1 asserts a packs problem on a child who has never seen a pack. Five more direct `/api/note` calls with the same body: every one ends with an invented "still working on … in a row / without hints / in parts / in a tidy way / without counting one by one". 8/8. The gate cannot see it (no blame word, no label, 3 sentences). Defect D-1. The seeded all-mastered run in case 12 produced the same shape: "They are still working on counting the total planks in each fence without any help" next to "built 12 fences on their own".

### 8. `/api/note` trust boundary — PASS
| Body | Result |
|---|---|
| valid + `"evil":1` | 400 `bad payload` |
| `open_id:"correct"` | 400 |
| `solo:["<script>"]` | 400 |
| `days:8` | 400 |
| `tier:4` | 400 |
| 13 names in `solo` | 400 |
| `{nope` | 400 `bad json` |
| GET | 404 |
| empty week (`days:3`, nothing else) | 200 `{"note":"No fences went up this week yet. Nothing is open right now.","question":"Which fence did you like building best?","source":"template","reason":"nothing_to_say"}` in **3.7 ms** (and 4.0 ms on a second call) — no model round trip |

### 9. Live hint path — PASS
`?node=3x4_concrete&debug=1&judge=1`, `[4,4,3]`, Done, five fresh contexts: `#bsrc` **model 5/5**; overlay round trips **603, 581, 814, 698, 990 ms**; card visible 599–1004 ms after Done; one `/api/buddy` 200 per level. Texts: the template verbatim ×4, once `That part of the fence is short. Count a full part again to see how it lines up.`
`window.fetch = () => Promise.reject(TypeError)` → template card in **24 ms**, `#bsrc = template`, 0 console errors. `fetch` that only rejects on abort → template at **2,520 ms** (`AbortSignal.timeout(2500)` in `buddy.mjs:105`), 0 errors.

### 10. Packs — logic PASS, phone slip FAIL
Both 1280×720 and 375×812, real taps throughout:
- Start: slip tray shown, cart/Done hidden, sign `3 parts · 4 planks in each part · packs of 2`, `#addpack` 49×49, Deliver 56 tall.
- 6 taps → 6 silhouettes; Deliver → `order{packs:6}`, heap of 6 packs, Done shown. Cart → part × 6 → `place pack n2` on groups 0,0,1,1,2,2 (`n_in_group` 2,4,…), 12 rails, `The fence is done.`, **mastery `3x4_packs: 1`**, 0 `place_failed`.
- Fresh: 13 taps → 12 silhouettes (cap holds); Deliver → 12 packs; 2 per part; Done → `hint pack_unit_confusion/1` — desktop `A pack holds many planks. Look inside a pack to see each plank.` (model), phone `… Look inside a pack to see how many planks fit together.` (model); **Order again visible** (153×56 desktop, 187×56 phone); tap → slip returns, event `order_reset`, parts cleared.
- **Slip geometry** (`c10b_*`): `#slipn` is **40 px wide** on phones, so silhouettes stack one per row.

| Size | packs on slip | tray height | tray top | fence hit region | fence covered |
|---|---|---|---|---|---|
| 375×812 | 6 | 248 | 480 | 318–469 | 0 % |
| 375×812 | 12 | **464** | 264 | 318–469 | **100 %** |
| 320×640 | 6 | 248 | 308 | 225–354 | **36 %** |
| 320×640 | 12 | **464** | 92 | 225–354 | **100 %** |
| 1280×720 | 12 | 176 | 528 | 314–604 | 26 % (part 0's front) |

`c10_375_slip12.png`: the paper slip runs from y≈290 to y≈720 over the whole paddock; the posts (whose height is the cue for how tall a part is) are invisible while the order is being decided. Defect D-2. The heap after delivery is intact at 375 (`c10_375_heap12.png`: six two-board packs in a tidy row).

### 11. Persistence — PASS
`[4,4,3]` → Done → hint (goat in, card up). Navigate to `/build`: rails `[4,4,3]`, cart 1, goat `.in` with the same `translate(0,-66px)`, card visible with the same text at the same spot (`#bsrc` empty because `debug` was not in the reload URL), `level_start` count still 1. `c11_reload.png`. Finish it, then `/build?node=4x3_concrete`: `build.node = 4x3_concrete`, `level_start` nodes `[3x4_concrete, 4x3_concrete]`, mastery `{3x4_concrete: 0.5}` kept; parent page `1 fence finished`, `Finished with a hint: 3 parts of 4.`

### 12. End state — PASS (one SEV3)
- All 12 nodes at 1, no build in storage → `/build`: sign `Every plot has a fence.`, a finished 3×4 fence (12 rails), goat outside, cart/Done/slip/again hidden, `Start again` 163×56 shown, Sound button kept. Reload → identical; scene tap → unchanged; mastery still 12 keys. `c12_end_pure.png`.
- Tap `Start again` → mastery `{}`, `3 parts · 4 planks in each part`, 0 rails, node `3x4_concrete`.
- All 12 at 1 **with** the 12th level saved finished in `build`: load → the finished 2×5 packs fence with **Next plot**; tap → end screen (`c12_end.png`); **reload → the finished fence with Next plot again** (the end screen is not remembered; tapping Next plot returns to it, mastery intact). Parent page at that point: `Finished without a hint:` all twelve names. Defect D-7.

### 13. Responsive and a11y — PASS
| | 1280×720 | 375×812 | 320×640 |
|---|---|---|---|
| horizontal scroll | none (1280/1280) | none | none |
| `#cart` / Done / Sound / `#grown` | 470×86 / 109×56 / 120×56 / 107×**48** | 343×78 / 119×56 / 96×56 / 99×48 | 288×78 / 178×56 / 96×56 / 99×48 |
| packs: `#addpack` / Deliver | 49×49 / 127×56 | 49×49 / 135×56 | 49×49 / 107×56 |
| sign ∩ card (with a hint up) | no (sign b=89, card t=335) | no (sign b=73, card t=81) | no (sign b=73, card t=81) |
| sign ∩ barn | none | canvas boxes of two roof images intersect; **art does not** (`c13_375x812.png`: sign bottom ≈ 75, roof apex ≈ 170) | canvas boxes of all five barn images intersect; **art does not** (`c13_320x640.png`) |
| `#bubble` | `role=status`, `aria-live=polite` | same | same |
| `document.fonts.check('16px "Fredoka"')` | true, `Fredoka:loaded`, `#task` computed family Fredoka | true | true |

### 14. Text and attribution audit — PASS
Scanned `build.html`, `judge.mjs`, `parent.html`, `fence.mjs`, `buddy.mjs`, `server.mjs`, `README.md`.
- Emoji: **none**. Non-ASCII present: `·` (the sign separator, build.html:164), `—`, `→`, `…` (parent.html "Writing your note…"), `×`, `≥`, `§`, `∪`, `–`, `≤` — all typography in comments or text.
- Digits in child-facing strings: `build.html:164` the sign (allowed); `build.html:259` pip numerals (`i + 1`, the tap-to-count design). The parent page prints the fence count (`parent.html:105`) and fence names (`:98`); the payload's `reading_level` string (`buddy.mjs:44`) and the server-only prompts (`:119`, `:129`) carry digits by contract. Nothing else.
- Attribution strings (`claude|anthropic|co-authored|generated with|assistant`, case-insensitive): `buddy.mjs:116` comment "Anthropic (Haiku, strict JSON schema) if ANTHROPIC_API_KEY is set" · `:141` provider key `anthropic:` · `:142,145` model id `claude-haiku-4-5-20251001` · `:143` `https://api.anthropic.com/v1/messages` · `:144` header `anthropic-version` · `:164,165,217,241` `provider = "anthropic"` defaults · `server.mjs:14` comment "Anthropic if present, else DeepSeek" · `:15` `ANTHROPIC_API_KEY` · `README.md:43` `ANTHROPIC_API_KEY` + model id. Every hit is a vendor-as-provider reference (model id, API host, env var, provider key/default). **Zero** hits for `Claude` outside the model id, `Co-Authored`, `Generated with`, `assistant`.

### 15. Cold clone — PASS
`git clone` → `e104a9a`; `PORT=5188 node src/server.mjs` → `Rung running on http://localhost:5188`. GET: `/build` 200 text/html 24,836 B · `/public/judge.mjs` 200 text/javascript · `/assets/fonts/Fredoka.ttf` 200 **font/ttf** 159,184 B · `/assets/fence/board.png` 200 **image/png** · `/fence.mjs`, `/buddy.mjs`, `/village.mjs`, `/public/parent.html` 200 · `/assets/ground/{grass,dirt,tree}.png`, `/assets/farm/{fenceHigh_E,woodWall_N,roofSingleWall_N,cornYoungDouble_E,hayBalesStacked_E,sacksCrate_E,dirtFarmland_E}.png`, `/assets/animals/goat.png` all 200 image/png. `POST /api/buddy` → `source:"model"`; `POST /api/note` (open over_count, one solo fence) → `source:"model"`, a consistent three-sentence note. `python evals/run_all.py` in the clone → ALL PASS. `diff -r --strip-trailing-cr` clone vs working tree: only `CLAUDE.md` (gitignored). Server killed afterwards.

---

## Defects, ranked

No SEV1. The desktop demo beat runs clean end to end with a live model.

### D-1 · SEV2 · The parent note invents a weakness when nothing is open
- Repro: finish 3x4 with a hint, then 2x3 without; open `/public/parent.html`. The page sends `open_id:null`; the model's third sentence is "They are still working on …" with content the summary never contained (8/8 runs; once "without ordering them into packs first" for a child who has never seen a pack; in the all-mastered case "without any help" beside "built 12 fences on their own").
- Where: `src/engine/buddy.mjs:133` — `NOTE_SYSTEM` asks unconditionally for "what they are still working on"; `:195` sends `still_working_on: null` with no instruction that null means nothing is open; `noteGate()` (`:199-210`) has no check for this, and cannot have a lexical one. Fix shape: when `open_id` is null, say so in the prompt ("nothing is open this week; do not say what the child is working on") and drop the clause — or cap the note at what the input lists by giving the model the fallback note as the base text to warm up, the way `template` is given to the hint. D-071 already records the model inventing on an empty week; this is the same failure one step later.

### D-2 · SEV2 · On a phone the order slip stacks one pack per row and covers the fence
- Repro: 375×812 (or 320×640), `?node=3x4_packs`, tap the add-pack box 12 times. The slip tray grows to 464 px and covers 100 % of the buildable side (six packs: 248 px, 36 % covered at 320). The child decides the order with the posts hidden. `c10_375_slip12.png`.
- Where: `src/public/build.html:47` (`.tray` is a flex row of label · note · Deliver), `:55` (`.lbl min-width:64px`), `:61` (`#note flex:1`), `:100` (`.tray{flex-basis:100%}` on ≤640 px) — the arithmetic leaves `#slipn` 40 px wide, one 36 px silhouette per row, and `#scene{bottom:var(--hud)}` (`:26`, `:97`) never learns the tray grew. Fix shape: on ≤640 px let the slip wrap under the label and Deliver (`#slip{flex-wrap:wrap} #note{flex-basis:100%}`), or draw the silhouettes overlapping in a fixed-height strip the way `heap()` (`:173`) already does for the cart.

### D-3 · SEV3 · "This week" mixes a 7-day count with all-time fence lists
- The headline count is levels finished in the last 7 days from the event ring (`parent.html:103-105`); `solo`/`helped` sent to the model are every mastered node ever (`:106`), labelled `fences_finished_*` beside `days_played_this_week` (`buddy.mjs:192-194`). Seen in case 12: `1 fence finished` above a note that opens "This week, your child built 12 fences". From week two on, a real household will see the same over-claim. Either window both from the event ring, or stop calling the mastery list "this week".

### D-4 · SEV3 · The card's fallback band ignores the cues it is meant to avoid
- 320×640, `[12,0,0]`: the card lands in the band under the sign and overlaps rail `0:11` (the top over-count rail). `src/public/fence.mjs:302` — the last-resort spot `[(W-w)/2, max(8, keep.b+8)]` is not passed through `hits()`. Cheap improvement: try the band at a couple of vertical offsets before giving up.

### D-5 · SEV3 · After "Hide", the first J press only removes the Judge tab
- `src/public/judge.mjs:54` — `toggle()` computes `open = panel.hidden && tab.hidden`; with the tab showing it hides the tab and calls `show(false)`. A judge who hid the panel and presses J sees nothing happen until the second press.

### D-6 · SEV3 · The overlay's "payload · what the model would get" shows the next tier, not the one just sent
- After a tier-1 hint, the classifier section reads `tier 2` and the payload block carries the tier-2 template, while "last hint" says tier 1 (case 6, `c6_open.png`). Correct arithmetic (`classify()` counts the hint already given), but on camera it reads as a mismatch. `judge.mjs:41-50` renders `snap()` live; keeping the payload that `showHint()` actually sent (build.html:283 already stores `S.hint`) and labelling the live one "next hint would get" would remove the ambiguity.

### D-7 · SEV3 · The end screen is not remembered when the last level is saved as finished
- Finish the 12th fence → Next plot → "Every plot has a fence." Reload → the finished fence with a Next plot button; tap → end screen again. `src/public/build.html:348` restores `saved.build` (a finished level) before the all-mastered branch at `:357`; `end()` (`:301`) writes no marker. Mastery is intact either way. A pure reload with no saved build shows the end screen correctly.

### D-8 · SEV3 · On a phone in packs mode the HUD outgrows `--hud` and the card can sit on the tray
- 375×812, 12 packs delivered, Done: tray + `Order again`/`Done` row + `Sound on` row = ~230 px against `--hud:188px` (`build.html:97`); the card for part 0 (bottom 601) overlaps the tray top by ~19 px (`c10_375_order12.png`). `bubbleSpot()` clips to `#scene`, which still ends at 624. Either fold Sound into the button row on phones or size `#scene` from the HUD's real height.

### D-9 · SEV3 · The sign wraps mid-phrase at 375 in packs mode
- `3 parts · 4 planks in each part · packs / of 2` (`c10_375_slip6.png`). `build.html:164` builds the line with ` · `; a non-breaking space inside "packs of 2" or a `<br>` before the packs clause keeps the units together.

### Observations (not defects)
- Model hints in this run: mostly the template verbatim; the additions seen ("to see how it lines up", "to see how many planks it really needs", "Look at the first part—it has planks") all passed the gate and read fine. One em dash reached the child.
- With the overlay open at 1280 the card goes to the band under the sign (the beside-the-part spots no longer fit in an 860 px stage); it covers the barn, never a post, a rail or the goat.
- `#n` on the parent page reads `2fences finished` in `textContent`; the gap is a margin, the render is right.
- The `Judge` tab on a phone sits above the tray at `calc(var(--hud) + 12px)`; with the taller packs HUD (D-8) it would overlap the buttons — not measured, since the overlay is desktop-first.
