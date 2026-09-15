# PRODUCT REVIEW — Kuzhi, as a Nerdy hiring panel would read it

16 Sep 2026 (2 days to the 18 Sep deadline). Reviewer: senior AI Product Engineer, Nerdy hackathon panel; the same
reviewer who read Rung twice (`docs/PRODUCT-REVIEW.md`, `docs/PRODUCT-REVIEW-2.md` at the repo root, final verdict
"Talk to this person"). Tree reviewed: `bfc5466` (main, clean). Server run on :5194 from the repo root with
`DEEPSEEK_API_KEY` present (every hint and note below was `source:"model"` unless stated). Browser: Playwright 1.x on
headless Chromium in a temp directory, deleted afterwards; **every tap was `page.mouse.click(x, y)` at a measured
pit centre, never `.click()`**, at 1280×720, 375×812 and 320×640; `speechSynthesis.speak` hooked; 0 console errors and
0 failed requests in every run. Two engine simulations were run against the shipped `sow.mjs` (400 games per level).
Nothing edited except this file; the :5180 server was not touched.

---

## Verdict: **Promising, fix X first** — and X is not the code, it is the stake.

The engineering is Rung's standard and I could not break it: five green evals, 94 classifier fixtures with zero
mismatches, every screen beat playable by hand at three sizes, a wooden board that reads as a shipped product in
the first frame, a source screen that says exactly what a heritage product should say and no myth anywhere. The
product idea is real: making the child call the landing pit before the seeds move turns the one arithmetic act in a
sowing game into a logged, classifiable prediction, and the per-move accuracy curve on the parent page is a number
Rung could not produce. What stops the verdict is that the call, as shipped, is a demand the game does not back:
a capture is at stake on 15–26% of her moves (simulated), so on three moves in four a wrong call costs nothing,
`guessing` silence is not a consequence a seven-year-old feels, and a random-moving child who calls perfectly still
loses five games in six at `p_best 0.6`. On top of that the model-phrased tier-1 hints I read live are worse than
the templates they paraphrase, which turns the AI beat of the video into the weakest thirty seconds of it. Both are
hours of work, not days, and both are listed below. Fixed, this is a second "talk to this person"; unfixed, the panel
will ask why the child should bother calling, and the honest answer today is "she mostly needn't".

---

## Strengths (verified this pass, nothing asserted)

1. **Evals are green and mean what they say.** `python heritage/evals/run_all.py` → 5/5 PASS, exit 0. `engine_test`
   39 asserts. `classifier_eval` 94 fixtures, 75 committed, 75/75 right, 19 silent (20.2%), 0 mismatches, a full
   confusion matrix with `ambiguous` and `guessing` as their own rows. `buddy_test` all checks (gate order, timeouts,
   the exact request, payload digit sweep over every fixture, the note gate). `readinglevel --assert` 27 templates,
   0 numbers, out-of-list {early, met, path, tap}. `TEMPLATES == hints.txt` set-equal.
2. **The move plays by hand, end to end, both sizes.** 1280×720, `3_single`: tap pit 0 → lifts, three seeds in the
   tray, label "Where will the last seed land? Tap that pit."; tap pit 3 → marker drops, seeds sow one at a time,
   `sow` logged 1,205 ms after the call (400 ms hold + 3 × ~250 ms); marker class `drop hit` on a right call; `turn`
   logged with the code tag; no card on a right call. Wrong call (pit 2 → landed 5, called 6): DOM == engine state on
   all 14 pits; marker stays (class `drop`, opacity 1, identical rect before and after the code move); `hint
   {overshot_by_one, 1}`; card `role=status` beside the marker overlapping neither marker nor landing pit; **spoken
   exactly once**, text === card, rate 0.92. Empty-hand tap on the source pit → 3 pips on pits 3, 4, 5, the last on
   the landing pit; `tap_count{2}`. Next pick → marker `drop gone`, card hidden.
3. **Rules on screen match the contract.** Capture earned (`2_single`, pit 3 empty, 0 → 2 called 2): `capture
   {pit 4, seeds 2, earned true}`, her store draws 2, pit 4 → 0. Forfeited (called 1): `earned false`, stores [0,0],
   pit 4 keeps 2. Pasu (`4_single`, pit 1 at 3, sow from 0): `four{pit 1, owner 0}`, pit 1 → 0, store 4. Relay
   (`3_relay`, from 3): `sow 3→6 [4,5,6]` then exactly one `relay 6→10 [7,8,9,10]`, pit 10 keeps its four, marker
   flips on the correct call of 10. Sign reads "3 seeds in every pit, with a relay".
4. **Persistence.** Bare `/board` reload after an exchange: state, DOM and label identical. Pick + call then navigate
   inside the 400 ms hold: the marker is restored and the sow runs and is logged once (`pick, call, sow, hint`).
5. **End of game.** Only pit 6 with one seed, stores [5,2]: "The seeds are in. Your store holds more." on the card
   and spoken, no digit, `level_end{stores:[5,3]}`, Next board by a real tap → the next unmastered node.
6. **The overlay is the honest window it claims to be.** J opens it (not fetched on a plain load), the stage shrinks
   by 420 px, live rows, `classifier · now (next tier)`, `last hint: source model · round trip 816 ms · model
   deepseek-v4-flash`, the payload with `[NO DIGITS]` and six booleans only, "other side: code, p_best = 0.6" on the
   turn row and in its own section, J closes it.
7. **Small screens hold (HD-011).** 375×812: her seven pits 53–55 px, 14/14 return the pit under `elementFromPoint`,
   no horizontal scroll, card in view and off the marker, pips 3. 320×640: 46–48 px, 7/7 reachable, no scroll in
   either axis.
8. **The source screen is the best heritage page I have read in a hackathon entry.** Diacritics on the regional
   names, "earliest evidence, not invented in", the kings-and-thousands-of-years sentence explicitly refused,
   "Ours is one simplified version", "The call is our addition", omissions named, four sources each with a
   confidence tag, and the transfer disclaimer. DEMO.md's do-not-say list matches.
9. **Server trust boundary holds.** `/api/buddy` rebuilds the payload through `redact()` from `{id, tier, shape}`
   (`server.mjs:32`); bad shape / unknown id / bad JSON → 400; `POST /api/coach` → 404; `/public/../server.mjs` → 404;
   `Cache-Control: no-store`; 60/min/IP → 429. `/judge.mjs` now 200 (TEST-REPORT D3 closed).
10. **Attribution audit clean.** Grep over `heritage/` for Claude / Anthropic / Co-Authored / Generated with /
    assistant / orchestrator / agent: every hit is a vendor id, API host, env var or the research memo's rejected
    list (`src/buddy.mjs:117,147–151,170,226,251`; `src/server.mjs:12–13`; `docs/BUDDY-CONTRACT.md:21`;
    `docs/LATENCY-RESULTS.md:40–41`; `docs/RESEARCH-AI.md:262`; `evals/latency_cost.mjs:2,24–26`;
    `evals/buddy_test.mjs:53–55`; `docs/TEST-REPORT.md:32,158–162` quoting the same). Commit bodies for `heritage/`:
    no trailer.
11. **First five seconds: shipped product.** Desktop: a tilted timber board with fourteen dished pits, CSS seeds with
    a highlight, a sign, a tray, no digit anywhere but the sign. Mobile: the board turns portrait and stays legible.
    Nothing reads as a sprite test.
12. **The docs disclose their own residuals.** TEST-REPORT D6 already found a model rephrase that inverts the
    instruction; LATENCY-RESULTS names the imprecise rephrasings; CONCEPT §10.1 names the imposition risk; the
    transfer test is pre-registered with a null sentence.

---

## Weaknesses, ranked by what they cost with a Nerdy panel

### W1 · SEV1 · The call has no stake on most moves, so it is the imposition the concept feared
`sow.mjs:40–45`: the only thing a right call changes is whether an available capture is credited, and a capture is
available only when `next(landed)` is empty and the pit beyond has seeds. Simulated against the shipped engine
(400 games per level, code at `p_best 0.6` both sides): a capture is at stake on **18% / 17% / 15% / 15% / 26% / 20%**
of her moves on `2_single … 4_relay`. On the first two levels a child sees, four of five calls have no consequence.
The concept's own risk #1 (CONCEPT §10.1) says a child who learns to tap any pit turns the log into noise, and answers
it with the capture rule and `guessing` silence (`board.mjs:10`, `sow.mjs:82–83`). Silence is not a consequence at
seven. The panel's question will be "why would she count?" and the mechanic must answer it on every move. Fix: make
the call itself score — the simplest version that keeps the game intact is a right call banks one seed to her store
from a small shared pile laid out at the start (drawn from the attested "pit opposite"/pasu family of instant takes),
or count the game by right calls in words at the end ("You called more pits than the seeds you lost"). Either is an
engine change of a few lines plus fixtures, and it turns `capture{earned}` from a rare event into the beat of the game.

### W2 · SEV1 · The model-phrased hint is worse than the template it paraphrases, and the demo is built on it
Eleven live tier-1/3 hints read this pass; eight were rephrasings, three the template. The rephrasings:
- `counted_start_pit/1`: *"Look at the pit where your marker sits. Count the seeds in that pit again, then look at
  the pit you pick up from."* — the misconception (the source pit gets no seed) is gone; counting seeds in the
  marker's pit is meaningless.
- `overshot_by_one/1` (twice, desktop and mobile): *"…Count the seeds in that earlier pit again."* / *"Count the
  seeds again, starting from the pit right before it."* — she should count the seeds in her **hand**; counting a
  pit's seeds is a different task.
- `stopped_at_first_lap/1`: *"Look at the marker you placed when the first trip around the pit was done. Count the
  seeds in that pit again…"* — "first trip around the pit" is not a thing; the rule (pick it up and keep sowing) is
  gone.
- `direction_reversed/1`: *"…Count the seeds again as they go around, and watch which way your hand moves."* —
  never says the direction was wrong.
- `stopped_at_corner/1` ×2 and `counted_start_pit/3` were acceptable.
Cause: HD-010 narrowed the system prompt to "only say where to look or what to count again" (`buddy.mjs:120–123`),
and at temperature 0.2 DeepSeek converges on a content-free "Look at X. Count the seeds in that pit again" frame; the
payload hands the model the template (`buddy.mjs:59`) so the model is a paraphraser, and the gate is lexical by
design (`buddy.mjs:91–98`), so this passes every check. DEMO.md:11 scripts the miss shot with the template's exact
words, which the live model will not produce; DEMO.md:32 and HD-010 already say "film the template if the live
rephrase reads wrong". A panel that watches the AI shot and reads the hint will ask what the model added, and the
answer on the evidence is "noise". Fix (1 h): ship the template at tier 1 with no model call (the template is
already gate-checked and spoken); let the model phrase tiers 2–3 only, where the extra warmth has room; keep the
overlay honest about it (`source: template, reason: tier1`). The AI beat of the video then moves to the parent note
and the tier-2 hint, which is where the model has something to do.

### W3 · SEV2 · Half of the ambiguity probe is unreachable on the live board
ENGINE-CONTRACT and `sow.mjs:97–98` resolve `ambiguous` by a `tap_count` on `from` (→ `counted_start_pit`) or on
`next(from)` (→ `stopped_at_corner`). But `board.mjs:160`: a probe tap on a pit she could sow from is a pick, and
`next(from)` always holds the seed she just dropped there. Verified: `2_single`, pick 5 → landed 7, call 6 → probe
card "Show me where your first seed goes."; after the code move, tap pit 6 (3 seeds) → `pick:6`, pit lifted, no
`tap_count`, probe over. The fixture `p5 c6 s h:ambiguous t6 → stopped_at_corner` passes only because the eval
bypasses the board. So a child who stops at the corner on the collision case can never be told so; HD-009 ("a tap
on a pit she could sow from is her next pick, not an answer") wrote the bug into the decision log. Fix (30 min):
while `S.probe` is set, a tap on `next(S.last.from)` is the answer first; her pick is the tap after.

### W4 · SEV2 · Difficulty is asserted, not tuned; a real child loses almost every game
CONCEPT §2:67 says `p_best` is "tuned so a child wins about half the time". Nothing in DECISIONS records a tuning.
Simulated on the shipped engine, 400 games per level, code at `p_best 0.6`: a child who picks the best one-ply move
and calls perfectly wins 48–67%; a child who picks a **random** legal pit and calls perfectly wins **23 / 12 / 17 /
13 / 8 / 20%** across the six levels; with every call wrong, 0–2%. A seven-year-old picks pits close to at random.
Losing five games in six is the end of return. Fix (1 h): run the same sim, choose the knob at which the random
caller wins ~50% (it will be well under 0.6, or a policy that avoids captures on her row), record it as HD-012 with
the table.

### W5 · SEV2 · The relay rule shipped is not the one the research calls attested
CONCEPT §1:40 and §2:57 call the relay "the attested sowing rule: when the last seed lands in an occupied pit, pick
that pit up and keep sowing", and `sow.mjs:36–37` does exactly that. The candidate's own memo says the Tamil and
Kannada rule is different: RESEARCH-INDIA:15 "relay sowing (pick up the **next** pit after your last seed and keep
going)" and :20 for Ali Guli Mane "After the last seed, take the **next** pit and continue". Picking up the landing
pit is the Congkak/Dakon lap style. The capture rule (next pit empty → take the one beyond) is Pallanguzhi's, so the
engine is a hybrid. The source screen says "a relay on two boards only" and does not say which relay. Not a myth,
a mislabel, and the one thing on the heritage side a Tamil grandmother would catch. Fix (20 min): one sentence on
`source.html` under "What this version changes" and drop "attested" from CONCEPT §1:40.

### W6 · SEV2 · Nothing on screen teaches the call, and tap-to-count is undiscoverable
The whole explanation of the mechanic is the tray label "Where will the last seed land? Tap that pit."
(`board.mjs:88`). No first-move demonstration, no ghost marker, no spoken line. Tap-to-count fires only on the
source pit of her last move (`board.mjs:177`) and is mentioned nowhere a child can see it. RESEARCH-AI:440 set "a
tester with no explanation does not understand the call step from the screen" as the day-1 kill test; it has not
been run. In the demo the narrator covers it; in a child's hands it is a mystery tap. Fix (1.5 h): on the first pick
of `2_single`, speak and show one line ("Count the seeds in your hand. Tap the pit the last one lands in.") and pulse
the source pit once after a wrong call.

### W7 · SEV3 · The parent note is thin, omits facts, and repeats
Three live notes from the same summary (two boards finished, two `counted_start_pit` hints on the second, last two
calls right): *"She finished a board with two seeds in each pit, and called the pit…"* (one board, not two);
*"She finished a board with two seeds in each pit, then another with three…"*; *"She counted round the board and
named the pit…"* (no board at all). The header above says "2 boards finished · Finished with a hint: 3 seeds a pit"
and the note never mentions the hint, because `parent.html:68–71` takes `open_id` from the **last move** of the
last level only. The question was the constant fallback all three times (`buddy.mjs:202`). `noteGate`
(`buddy.mjs:205–217`) can catch invention but not omission. Fix (1 h): `open_id` = the most-hinted id of the week;
rotate the question over `PARENT_WORDS`; require the note to name the count of boards when it is ≥ 1.

### W8 · SEV3 · The skill ceiling is one afternoon, and the curve is noisy at that length
Six nodes, counting on by 2–6 with a wrap of 14; mastery is 7 of 8 right per node (`board.mjs:238–250`), so a
nine-year-old can reach "Every board is played." in ~48 moves. Nerdy's Prompt 01 language is "steady progression";
the graph ends where a Year 3 child starts. The parent page's headline number ("Right calls: 100% in her first 4
moves, 50% in her last 4") conflates a level change with learning at n = 8. Design note, not a defect: the attested
seed counts (5, 6, 12 per pit) are where counting-on becomes genuinely modular, and they are already a setting.

### W9 · SEV3 · Visual tells
The hint card sits over the far row (desktop: pits 8–9 partly covered; mobile: the two top pits) — it avoids the
marker and the landing pit per `placeBubble()` but not other pits. The opponent tag reads "code", a word a
seven-year-old will ask about. `?debug=1` prints "model" in tiny monospace under the card. Otherwise the frame is
clean.

### W10 · SEV3 · Hygiene a code reviewer would leave
- `server.mjs:59` fixed window 60 POST/min per IP trips a classroom behind NAT on the second child.
- `board.mjs:16` keeps the last 500 events, so the parent's "this week" is about three boards.
- `heritage/README.md` lists `docs/PRODUCT-REVIEW.md` as existing (it did not until this file).
- `TEST-REPORT.md:137` says "five linked sources"; the page has four list items (six links).
- `docs/` is ~2,700 lines against ~1,100 shipping lines in nine files; the ratio is Rung's and a panel that opens
  the folder sees the docs first.

### The learning claim, judged
The call is a real cognitive demand — counting on with a wrap is exactly the modular skill the Chennai school
project saw expert players invent notation for (RESEARCH-INDIA:26) — and making it the *move* rather than a
side-quiz is the one genuinely new product idea here. It is worth a product at 6–7; at 8–9 it is below level
(W8). The "no transfer evidence exists, so we measure" stance is honest and pre-registered (TRANSFER-TEST) but no
child has played; the in-game curve measures the trained task, not transfer, and at session length it is noise.
The stance holds only once a pilot row exists.

### The AI layer, judged
Defensible: the classifier is code, the payload is booleans, the gate is measured (75% pass, every rejection the
template), the red-team is against a majority baseline with the `ambiguous` narrowing published, and the overlay
shows it all. Theatre: the child-facing rephrase. The panel will see a model paraphrasing a fixed sentence into a
worse sentence behind a gate that cannot tell. The honest product is templates for the child and the model for the
parent; say so and the architecture reads as judgment rather than habit.

### The demo risk in three minutes
Pacing is fine (call → last seed 1.2 s; card ~0.8 s later; code move ~2 s). The risks are the two shots the
script leans on: 0:35 (a live tier-1 hint that reads wrong on camera — W2) and 0:12 (a capture "slides to her
store" on the first move of `2_single`, which cannot happen on a fresh board: no pit is empty). Set the board
(`kuzhi.v1`) so a capture is available on the first move, or reword. Everything else in the shot list I saw work.

---

## Kuzhi vs Rung: which to submit, and why

**Submit Rung, and give Kuzhi fifteen seconds inside Rung's video.** Rung's mechanic carries its consequence on
every move — the fence stands wrong, the goat walks through — where Kuzhi's carries it on one move in five; Rung's
skill (grouping and multiplication for 7–11) has room to progress where Kuzhi's ends at counting on by six; Rung has
survived two hardening passes and has a pre-registered pilot on the calendar, while Kuzhi is two days old and its
two SEV1s are design, not polish. The AI layer is the same code in both, and in Kuzhi the live hints read worse. What
Kuzhi has that Rung does not — a cleaner one-sentence story, a replayable opponent, a per-move learning curve, a
memorable heritage frame handled with unusual care — is exactly the material for one shot near Rung's close: "the
same classifier-gate-note pipeline, pointed at a second mechanic from Tamil Nadu, built in two days; here is its call
accuracy curve". That shot turns Rung's architecture from a product into a platform, which is the hiring signal a
Nerdy panel is looking for, and it costs nothing Kuzhi has not already shipped. If the owner insists on Kuzhi as the
submission, W1, W2 and W6 must land first (about five hours), and it is still the thinner skill.

---

## What to fix before filming (ordered; effort in hours)

1. **Tier-1 hint = template, no model call; model phrases tiers 2–3** — `board.mjs:277–280`, `buddy.mjs:102`; update
   DEMO.md 0:35 and 1:15 to show the model on the tier-2 hint or the parent note. **1 h.**
2. **A stake on every call** — engine rule (a right call banks a seed, or the end line counts right calls), fixtures,
   `capture`/`call` events, one line on `source.html`. **2 h.**
3. **Tune `p_best` by simulation for a random-picking perfect caller, record HD-012 with the table.** **1 h.**
4. **Probe accepts a tap on `next(from)` while `S.probe` is set** — `board.mjs:160–162`; add a browser-level note to
   ENGINE-CONTRACT. **0.5 h.**
5. **First-move teaching line and a spoken cue for tap-to-count** — `board.mjs:149–154, 177`. **1.5 h.**
6. **Relay wording** — `source.html:49`, CONCEPT §1:40, §2:57. **0.3 h.**
7. **Card never over a pit** — add every pit rect to `keep` in `placeBubble()` (`board.mjs:294–295`). **0.5 h.**
8. **Parent `open_id` from the week's hints; rotate the question; note must name the board count.** **1 h.**
9. **Demo board for 0:12** — seed `kuzhi.v1` so a capture is available on the first move, or reword the shot. **0.3 h.**

About eight hours. Then film.

---

## Video: say / don't say

**Say**
- "Before the seeds move she has to call the pit the last one lands in. Nothing moves until she commits."
- "The marker stays where she put it. Code names the miscount from the log. The model never sees a number."
- "The other side of the board is code with one knob. There is no model near a move."
- "The rules vary by household; this is one simplified version, and the call is my addition."
- "No study anywhere shows sowing games improve arithmetic. I measure it, and I report a null if that is what I get."
- "The number gate is lexical. It cannot see a sentence that points the wrong way, so at tier one the child gets the
  checked template and the model phrases the later tiers." (only true after fix 1)

**Don't say**
- "Attested relay rule" (W5). "Tuned so she wins half the time" (W4). "The capture makes the call matter" while a
  capture is at stake one move in five (W1).
- "The AI phrases every hint" over a frame whose hint reads worse than the template.
- "Ancient", "5,000 years", "Chola", "Vedic", "invented in" — DEMO.md already has this right.
- "100% accurate" — say "right whenever it commits, silent when two miscounts look the same".
- Anything about transfer before a pilot row exists.

---

## Questions the panel will ask in the interview — be ready

1. On a fresh `2_single` board no capture is possible. Why should she count on move one?
2. Your tier-1 hint for `counted_start_pit` told her to count the seeds in the marker's pit. What does the model add
   that the template does not, and how would you measure that with something better than a word list?
3. The probe's corner answer cannot be given on the live board. How did 94 fixtures and a QA pass miss it, and what
   would have caught it?
4. Your own memo says Pallanguzhi relays from the *next* pit. Why did you ship the landing-pit relay and call it
   attested?
5. A random-picking child with perfect calls wins one game in eight. What is `p_best` for, and where is the tuning?
6. Why 2–6 seeds when the attested game uses 5, 6 or 12, and the modular counting only starts there?
7. Coach and attacker are the same model family. What would change the red-team verdict?
8. The parent note omitted a board and repeated itself three times. What can the gate never see, and what would you
   put in front of a parent instead?
9. You built this in two days on Rung's pipeline. What in that pipeline resisted the new mechanic, and what did you
   have to change in the contract?
10. If Nerdy asked for one of these two, which would you ship, and what would you delete from the other?
