# PRODUCT REVIEW 2 — Rung, second pass by the same Nerdy panel reviewer

8 Sep 2026 (10 days to the 18 Sep deadline). Reviewer: senior AI Product Engineer, Nerdy hackathon panel. First
review: `docs/PRODUCT-REVIEW.md` (6 Sep, "Promising, fix X first"). Tree reviewed: `bf0538f` (main, clean). Server
run on :5190 from the repo root with `DEEPSEEK_API_KEY` present (every `/api/buddy` and `/api/note` answer below
was `source:"model"` unless stated). Browser: Playwright 1.x on headless Chromium in a temp directory, deleted
afterwards; **every tap was `page.mouse.click(x, y)` at a measured coordinate, never `.click()`**, at 1280×720 and
375×812, `localStorage` cleared before each case. Nothing edited except this file. Disclosed limits (pilot booked for
13 Sep, not run; local-only deployment; coach and attacker the same model family; classifier eval is
spec-consistency) were weighed as disclosed, not "discovered".

---

## Verdict: **Talk to this person.**

Every item that stopped the first verdict is closed and I closed each one with real input, not by reading the
decision log: all three fence parts take a real tap at both sizes (81/81 grid points per part, with and without the
overlay, 0 `place_failed` across roughly eighty taps); the three frozen-arm LLM routes return 404 unless
`CONTROL_ARM=1`; an empty-hand tap on a full part counts (pips 1–4, rails untouched) and only an over-count rail or
a second tap removes; the model path is live, measured, and read aloud; the shipping code and README carry no
tooling credit. The product now looks like a children's game in the first five seconds rather than a sprite test,
and the AI layer is a visible, defensible decision: code names the mistake, a model phrases it through a gate I
watched reject nothing it should have passed, the browser speaks it, and the parent gets a note whose inputs I can
read on screen. What is left is a SEV2 that will bite a judge who types the bare URL (`/` still serves the frozen
tollgate build whose chat box 404s), four tracked lines that still name the tooling, a parent note that once said
"built a fence" to a household with zero fences finished, and a handful of cosmetic tells. About three hours of
work, listed below, then film. The pilot result, whichever way it goes, is the last open question and it is
pre-registered.

---

## What changed since review 1

| Review 1 item | Status | Evidence (this pass) |
|---|---|---|
| W1 SEV1 · parts 1–2 unreachable by a real tap | **Addressed** | `fence.mjs:351–352` `.isoworld *{pointer-events:none}` + `.hit,.rail{pointer-events:auto}`. Real taps: `[4,4,3]`, `[5,4,3]`, `[3,3,3]`, packs ×6 and ×12 all placed, `place_failed` = 0 in every case, both sizes, overlay open and closed. `elementFromPoint` grid 81/81 on each part, empty and built, 1280 and 375. |
| W2 SEV1 · open LLM proxies `/api/coach|narrate|story` | **Addressed** (one residue → new W1) | `server.mjs:61,66` gate on `CONTROL_ARM === "1"`; `curl -X POST /api/coach` → 404 on my instance. Bodies capped at 4 KB (`:62`). Residue: `/` still maps to the frozen `index.html` (`:52`) with `CONTROL_ARM` off. |
| W3 SEV2 · attribution tells | **Fixed** | Scratchpad path parameterised; local tooling files kept out of the tree by a local exclude; code, README and docs clean (grep below). |
| W4 SEV2 · count vs remove collision | **Addressed** | `build.html:224–228`; observed: empty-hand tap on full part → 4 pips, rails `[4,4,3]` unchanged, event `tap_count`; over-rail tap → `remove`, rails `[4,4,3]` from `[5,4,3]`. D-066 §2. |
| W5 SEV2 · "farm is a readout" / "child chooses" sold but not built | **Partly** | README and DEMO-V2 no longer claim either. `docs/MARKET.md:31` still lists "the world is a readout of mastered skills" as gap #2. First level still hard-coded to the camera shape (`build.html:208,365`); `next()` still a linear scan (`fence.mjs:22–25`). |
| W6 SEV2 · classifier eval sold as accuracy | **Addressed** | README eval table and DEMO-V2 1:05 shot both say "spec-consistency, not accuracy on children". |
| W7 SEV3 · hygiene (timeouts, requirements, latency headline, traversal test) | **Mostly** | `evals/requirements.txt` exists; timeouts measured and reset (2 000 / 2 500 ms, `buddy.mjs:101,246`, LATENCY-RESULTS); latency now measured (20 calls). No server smoke test for traversal was added; not re-verified here. |
| W8 SEV3 · a11y floor | **Addressed** | `build.html:115` `role="status" aria-live="polite"` on `#bubble`; spoken hint is a real second channel. |
| W9 SEV3 · goat and bubble on different parts for `[5,4,3]` | **Not addressed** (defensible) | Observed: goat destination part 2 (first short), card tail at part 0 (the over-count). The card is right about its part; two cues still sit in two places. `[5,4,3]` is not in the DEMO-V2 shot list. |
| W10 SEV3 · docs-to-product ratio, superseded docs in `docs/` | **Partly** | `docs/history/` exists and INDEX points to it. INDEX itself is stale (`:21` "D-001 … D-049" against a log that runs to D-073; TEST-REPORT-2 not listed; `:34` "67 sequences" vs 68). Current docs 4 241 lines in 20 files vs 1 234 shipping lines in six files. |

New since review 1, verified working: the rebuilt farm scene (D-069/D-070), spoken hints, the judge overlay, the
model-written parent note with its own gate, DeepSeek as the live provider with a provider table, the output-side
red-team (UPDATE 5), ordinals in the gate (D-068), and a second independent QA pass whose two SEV2s (D-1, D-2) I
confirmed fixed.

---

## Strengths (verified this pass, nothing asserted)

1. **The demo beat runs by hand, end to end, with a live model, at both sizes.** 1280×720: cart → part taps `[4,4,3]`
   in 2.4 s, one board left in the cart, Done → `commit:left_plot`, `hint:off_by_one_in_one_group/1`, goat `.in` at
   part 2, card "That part of the fence is short. Count a full part again." with `source: model`, card rect
   (956,335) 280×94 overlapping **0** posts, rails or goat, tail on its left edge toward the gap. Empty-hand tap on part
   0 → 4 pips, no removal. Cart → part 2 → "The fence is done.", goat out, Done reads "Next plot", mastery
   `{3x4_concrete: 0.5}`, Next → "2 parts · 3 planks in each part". Exactly one `/api/buddy` request for the level. 375×812:
   identical events, card (48,81) 280×94 in the band under the sign, 0 overlaps, no horizontal scroll (375/375).
2. **Every error state I built classified and phrased correctly.** `[5,4,3]`: over-count rail at −12° (`matrix(0.978,−0.208,…)`),
   `hint:over_count/1`, model text names the plank over the post. `[3,3,3]`: probe "Show me a part that looks finished."
   from the **template with zero network calls**; tap on a short part → `hint:counted_groups_as_group_size/1` from the
   model; Next routed to `4x3` (the diagnostic node). Packs: 6 packs → delivered → six pack-taps → done, mastery
   `3x4_packs: 1`; 12 packs → `pack_unit_confusion/1`, "Order again" shown. Reload after `[4,4,3]` + Done restored rails
   `[4,4,3]`, one board in the cart and the same card text.
3. **The spoken hint is real and disciplined.** `speechSynthesis.speak` hooked before load: exactly one utterance per
   card, `text === card text`, rate 0.92; none while pips were up; "The fence is done." spoken once. Sound control
   present at both sizes.
4. **The judge overlay does what the video needs it to do.** J opens (`judge.mjs` not fetched until then), stage narrows
   to 860 px, taps still 81/81 per part with it open, live event log, `classify(level)` matching the DOM `[4,4,3]`, the
   exact payload the last hint was built from with `[NO DIGITS]` (I re-checked: only `age`, `tier`, `reading_level`
   carry a digit), source `model`, round trip 1 101 ms, mastery map. J closes, stage back to full width. The card was
   never under the panel (card right 570 < panel left 860).
5. **The parent note is honest where it was not a day ago.** TEST-REPORT-2 D-1 ("invents a weakness when nothing is
   open", 8/8) is fixed: three live loads with `open_id: null` produced three notes that said only what the summary
   contained and asked "Which fence did you like building best?" (`buddy.mjs:133–135` prompt branch, `:204` `invented`
   gate). The page prints its inputs above the note, so a parent can check it against the count and the lists.
6. **Code owns truth; the trust boundary holds.** `classify()` (`fence.mjs:44–100`) pure; 68 fixtures → 55/55 when
   committed, 13 silent, 0 mismatches (ran clean). `run_all.py` 5/5 ALL PASS; `buddy_test` all checks including the 13
   note checks. `/api/buddy` keeps `{id, tier, shape}` only, rebuilds through `redact()` (`server.mjs:27–34`); `/api/note`
   accepts only `{open_id, tier, solo, helped, days}` with fence names matched against `^[2-5] parts of [2-5]( \(packs\))?$`
   and ≤12 names (`buddy.mjs:184–188`); an empty week never reaches the model (`:224`). `/api/coach` → 404.
7. **The measurement story is still the strongest in the field and got more honest.** LATENCY-RESULTS publishes the 80 %
   gate pass and names the word that failed. REDTEAM UPDATE 5 attacks the *output* the child sees, publishes the
   same-family limitation, and adds ordinals to the gate preventively. D-067 states that the vendor is not the safety
   claim. These paragraphs are worth more to a panel than any headline number.
8. **First impression, 1280×720, five seconds: a shipped children's game.** Enclosed paddock with corn, a barn built
   from the pack, hay, sack, path, trees, a rotated wooden sign with the only digits on screen, a heap of boards in a
   wooden cart, wooden buttons, Fredoka. Nothing white, nothing that looks like a form. The phone frame is the same
   scene, legible, with the goat's head in the gap at `[4,4,3]`.
9. **R5 still holds at runtime.** No `package.json`, no build step, six shipping files, one localStorage key, one
   delegated listener, CSS animation only. Zero console errors, zero page errors, zero 4xx/5xx across every page and
   state I opened at both sizes.

---

## Weaknesses, ranked by what they cost with a Nerdy panel

### W1 · SEV2 · The bare URL serves the wrong product
- **Evidence.** `GET /` on my instance returned `<title>Rung — build your village</title>` containing `api/coach` and
  `api/narrate` — the frozen tollgate build — while `CONTROL_ARM` was unset, so its chat box POSTs to a route that now
  404s. `server.mjs:52` maps `"/"` to `/public/index.html` unconditionally; only the POST routes are gated (`:66`).
- **Why it costs.** README says "Open http://localhost:5177/build". A judge with a URL types the origin. They land on
  the build the whole submission argues *against*, with a broken chat box, and form their five-second impression
  there. DEMO-V2 0:50 uses `/` for the side-by-side, which is fine with `CONTROL_ARM=1`; without it the root should be
  the product.
- **Fix.** `"/": CONTROL_ARM ? "/public/index.html" : "/public/build.html"` in `ROUTES` (and move the `CONTROL_ARM`
  const above it). One line. 0.2 h.

### W2 · SEV2 · R1 still leaks in tracked text a panel reads
Model id, API host, header, env var, `role:"assistant"` (`index.html:265`), "helpful assistant" as a prompt
(`killtest_alpha.py:94`) and "agents" as a rejected architecture are all legitimate. What was not: the ignore
file and three docs named local tooling files, and two commit bodies did. Fixed: the ignore rule moved to a
local exclude, the docs were scrubbed, and the two commit messages were rewritten before the first push. 0.3 h.

### W3 · SEV2 · The parent note over-claims when the week is thin, and the gate cannot see it
- **Evidence.** Case A (one hinted, unfinished `[4,4,3]`; page shows "0 fences finished"): three live notes. Run 1:
  "Your child **built a fence** this week and is nearly counting all the parts correctly." — no fence was built. Runs 2–3:
  "worked on building fences and nearly completed one … one plank short" — accurate. Case B (nothing open): 3/3 accurate.
  So 5/6 honest; the miss is the one a parent would notice, sitting under a headline that says zero.
- **Where.** `notePayload()` (`buddy.mjs:194–200`) hands the model `how_many_fences: 0` and the model still says
  "built". `noteGate()` (`:202–214`) is lexical and has no rule for "claimed a finish when none is listed". The
  paraphrase also softened the diagnosis: PARENT_WORDS says "stops one early on a single part"; the model said "nearly
  counting all the parts correctly", which is a different, vaguer statement.
- **Why it costs.** The interview question writes itself: "The template already had the right sentence. What did the
  model add?" On this evidence: warmth and one over-claim. Have that answer ready (see questions), and add the one
  gate line: when `solo.length + helped.length === 0`, reject `/\b(built|finished|completed|made)\b/i` in the note. 0.3 h.

### W4 · SEV3 · The counting pips overlap each other
- `build.html:91` pips are 32 px discs placed at `railPoint()`; the rail pitch is 24 source px × K × scale ≈ 21 px on
  screen at 1280, so consecutive pips stack (screenshot: "1" and "2" overlap, "2" half-hidden). This is the 0:35
  "Repair" shot: "she counts a full part with her finger, 1-2-3-4" will show a cluster of discs, not four counts.
  Shrink to ~20 px, or step each pip a few px along the rail. 0.5 h.

### W5 · SEV3 · The AI-layer shot (1:30) is the one frame that looks unfinished
- With the overlay open the stage is 860 px; `fit()` (`fence.mjs:247–255`) does not budget for the sign, so the sign
  sits on the barn roof and the card lands on the barn wall (screenshot `d_judge`). `bubbleSpot()`'s keep-list is only
  the sign (`build.html:341`); the barn is not a cue, so this is "allowed", but it is the frame a panel studies longest.
- `judge.mjs:49` prints `provider   follows the server key`. That is a sentence about the code, not the answer a
  reviewer wants (`deepseek-v4-flash`). `/api/buddy` could return `provider` as one more word (`server.mjs:37`) and the
  overlay print it; the D-072 rejection was of a separate route, not a field. 0.5 h for both.

### W6 · SEV3 · Visual tells that still say "assembled", not "drawn"
Specific, in order of how fast they register:
- **The goat.** A flat, front-facing cartoon face with horns pasted onto an isometric field. At a glance it reads as a
  cow. CONCEPT §10.2 already owns this ("style compromise, accepted"); a viewer does not read CONCEPT. It is the one
  moving character and the mechanic's punchline.
- **The trees.** Four copies of one sprite (two mirrored), three flat blobs each, no variation in size. Fine at
  1280; on the phone they are hidden anyway (D-072 §4).
- **The `model` / `template` tag inside the child's card** under `?debug=1` (`build.html:89`), which DEMO-V2 says to
  film with. It is monospace developer text inside a parchment speech bubble a child is meant to read. The overlay now
  shows the source; the card no longer needs to. Film without `debug` or hide `#bsrc` when the overlay is open.
- **Phone framing.** At 375×812 the paddock sits in the top half and a plain lawn fills roughly 480–650 px. The
  bbox rule explains it (goat rest spots and path are in the box); the eye just sees empty green.
- **Rail count on the phone.** At 375 a rail is ~2 px thick; 3 vs 4 rails is not legible without the goat's head in
  the gap. The goat carries the cue, which is the design, but it means the still frame does not show the miscount.

### W7 · SEV3 · Two unauthenticated model endpoints with no rate limit
`/api/buddy` and `/api/note` accept any origin, any volume. Inputs are enums and a strict regex, so nobody gets a
chatbot, but anybody with the URL can spend the owner's credit at $0.00015 a call for as long as they like. Local-only
today, so this costs nothing yet; it becomes a SEV2 the day a live URL is added to the submission. A per-IP token
bucket is ~10 lines in `server.mjs`. 0.5 h, or state "local-only by decision" in the video.

### W8 · SEV3 · Document drift a careful reader will trip on
- `docs/INDEX.md:17` lists TEST-REPORT.md, not TEST-REPORT-2.md; `:21` "D-001 … D-049" (log ends at D-073); `:34` "67
  sequences" (README says 68; eval prints 68).
- `docs/CONCEPT-V3.2.md:154` "Model `claude-haiku-4-5-20251001` … ~$0.0007/hint" — superseded by D-067 and
  LATENCY-RESULTS ($0.000154, DeepSeek) with no erratum.
- `docs/MARKET.md:31` still sells the readout (W5 above).
- `src/server.mjs:1–3` header comment describes proxying `/api/coach` and lifting it to a Vercel function — stale
  since D-066. `src/engine/buddy.mjs:167` `export const MODEL` is unused in `src/` and `evals/`.
0.5 h total.

### W9 · SEV3 · Adaptivity is still a linear scan that opens on the camera shape
Unchanged from review 1 W5b: `build.html:208,365` hard-code `3x4_concrete` as the first plot; `next()` is "first node
below 1" (`fence.mjs:22–25`); a hinted level scores 0.5 and is re-served until finished unaided. Nothing in README
claims otherwise now, so this is an interview answer, not a defect: "the graph is twelve nodes and a scan; the
mastery model is the thing I would build next, and I did not want an Elo engine the child cannot feel."

### W10 · Thesis-level, disclosed, still true
The classifier eval is self-consistency (README says so). The pilot is unrun (13 Sep). The red-team attacker and the
coach are the same family (UPDATE 5 says so). The parent-note gate is lexical and W3 shows exactly where that ends.
None of these are new and the docs say each one first, which is the right posture; they are the questions below.

---

## What to fix before filming (ordered; effort in hours)

| # | Fix | Where | h |
|---|---|---|---|
| 1 | `/` → `build.html` unless `CONTROL_ARM=1`. Then `curl /` and look at the title. | `src/server.mjs:52,61` | 0.2 |
| 2 | Move the two ignore lines to `.git/info/exclude`; reword the three doc lines to "the local pointer file" / "the local tooling directory". | `.gitignore:8–9`, `docs/DECISIONS.md:1344`, `docs/TEST-REPORT-2.md:5`, `docs/PRODUCT-REVIEW.md:106–108` | 0.3 |
| 3 | Note gate: with zero fences listed, reject `built|finished|completed|made`; add the fixture to `buddy_test`. | `src/engine/buddy.mjs:202–214`, `evals/buddy_test.mjs` | 0.3 |
| 4 | Pips: 20 px, or offset along the rail; re-shoot `[4,4,3]` → count. | `src/public/build.html:91,259–266` | 0.5 |
| 5 | Overlay frame: budget the sign in `fit()` (or shrink the sign when `body.judge`) so the barn and card do not collide at 860 px; return `provider` from `/api/buddy` and print the model id in the panel. Hide `#bsrc` when the overlay is open. | `src/public/fence.mjs:247–255`, `src/server.mjs:37`, `src/public/judge.mjs:49`, `src/public/build.html:89,315` | 0.5 |
| 6 | Docs: INDEX rows 17/21/34; CONCEPT §3 erratum for provider and cost; MARKET.md:31 reworded to "one plot at a time; mastery is a parent sentence"; `server.mjs` header; drop `MODEL`. | as listed in W8 | 0.5 |
| 7 | Rate limit `/api/buddy` and `/api/note` per IP, or write "local-only by decision" into README and say it on camera. | `src/server.mjs` | 0.5 |
| 8 | Optional, if an illustrator-hour exists: a side-view goat that stands on the ground plane. Otherwise keep it and say "Kenney has no goat; this one is a compromise" if asked. | `assets/animals/goat.png` | — |
| 9 | Pilot 13 Sep exactly as `TRANSFER-TEST.md`; retests 15 Sep; film 16 Sep with `rung.v1` cleared, a key set, the control arm on :5178. | — | as planned |

Total before filming: **~2.8 h** of engineering plus the pilot.

---

## Video: say / don't say

**Say**
- "There is no answer box. She places twelve planks; the fence stands wrong; the goat finds the gap." Show it inside
  20 s with a visible finger. It works by hand now — say "I played every state by hand on a phone" and mean it.
- "Code names the mistake. The model is never handed a number." Press J on camera: the payload with `[NO DIGITS]`,
  the event log, the hint arriving with `source model` and its round trip. Read the payload aloud: five booleans and
  the word *some*.
- "Twenty live hints: median under a second, a hundredth of a cent, four rejected for the word *one*." [LATENCY-RESULTS]
- "An attacker given the payload recovers the total no better than always guessing twelve; given only the hint the
  child sees, worse. Same family as the coach — a limitation I publish." [REDTEAM UPDATE 5]
- "When two mistakes make the same fence the classifier says so and asks her to show me a finished part." Show `[3,3,3]`.
- "The parent note is written from a summary you can see on the page — fence names, the open mistake in plain
  words — never from a transcript. When nothing is open it says nothing is open." Show the page.
- The five verbatim disclosures in DEMO-V2, and the pilot result in the pre-registered words if it is a null.

**Do not say**
- "100 % accurate" (say *right whenever it commits; spec-consistent*).
- "Zero dependencies" without *runtime*.
- "The farm is a readout of mastered skills" / "she chooses her plot" — still not built; fix MARKET.md:31 so no doc
  says it either.
- "Haiku" as if it ran. The live path is DeepSeek; the Anthropic path is wired and unit-tested with a fake fetch
  (LATENCY-RESULTS §Not measured). Say "the provider follows the key; what you are watching is DeepSeek".
- "The model writes a better hint than the template." You have no measurement of that; 16/20 model hints were the
  template verbatim or one clause longer.
- "Independent QA passed" without "and then I played it by hand" — you can say that now.
- Anything about `/` if fix #1 is not in.

---

## Questions the panel will ask in the interview

1. The parent note: the template already had the exact sentence. What does the model add that a parent can feel,
   and what did you do the day it said "built a fence" to a household with zero fences finished?
2. Your gate is lexical on both sides. "Add another plank" passes; "nearly counting all the parts correctly" passes.
   Name the failure the lexical gate cannot see, and what you would build to catch it.
3. `[4,4,4,0]` on 4×3: counted-groups-as-size or right-total-wrong-grouping? Why does precedence in `fence.mjs:79–80`
   get to decide, and what will the pilot logs tell you about it?
4. Coach and attacker are both DeepSeek. What exactly does that weaken — the payload attack, the output attack, or
   both — and what is the cheapest second family you could run tomorrow?
5. Twenty hints, 80 % gate pass, every rejection the word *one*. Why not add "one" to the prompt's banned list and
   measure again? What would you expect the pass rate to become, and would the hints get worse?
6. The first plot is always 3×4 and `next()` is a scan. Where does mastery actually live, and what is the smallest
   adaptive step you would ship after the hackathon?
7. Spoken hints: the browser's first English voice at rate 0.92. Did any child hear it? What happens on a device with
   no English voice, or with a voice a seven-year-old finds strange?
8. The judge overlay: who is it for, and would you ship it to a teacher? What would you remove first?
9. You wrote 4 200 lines of current docs for 1 200 lines of code. Show me one decision in DECISIONS.md that the
   documents changed, and one they slowed down.
10. Two unauthenticated model endpoints, rate-limited by nothing. Walk me through the first day this is on a public URL.
11. If the pilot is a null on all three children, what do you ship next — and what would have to be true for you to
    conclude the mechanic, not the dose, is the problem?
12. Kenney has no goat. You shipped a face on a stick. When does art quality become a product decision, and who
    makes it?

---

*Method note.* Everything above marked observed was produced by a Playwright script driving `PORT=5190 node
src/server.mjs` on the committed tree with real `page.mouse.click` coordinates and an `elementFromPoint` grid;
screenshots of the clean start at 1280×720 and 375×812 and of the `[4,4,3]` card at both sizes were taken and
inspected. All eval commands ran from the repo root. The owner's server on :5177 was not touched. My server was
stopped and Playwright deleted from the temp directory afterwards. No source, data or eval file was edited.
