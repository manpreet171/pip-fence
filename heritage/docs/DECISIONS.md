# DECISIONS — heritage concept (append-only)

Format: what, why, what was rejected, date. This log is for the `heritage/` folder only; the root
`docs/DECISIONS.md` is not edited by this work.

---

## HD-001 — A second concept, isolated, at Rung's standard
15 Sep 2026 · **Decided**

The owner: "I don't like the current app… think different… ancient games children played in ancient
places… ancient India, Sanskrit era or other very old heritage… do your research… a different folder
whose files don't touch existing files… follow the rules." Then: "don't worry about the timeline,
just do the work." So: `heritage/` is self-contained; Rung stays the fallback submission untouched;
the constitution applies in full inside the folder, with its own `docs/` as the one structural
exception (so the concept can be kept or deleted as a unit).

---

## HD-002 — Three research passes before any design
15 Sep 2026 · **Decided**

Ancient India (Śulba Sūtras, Līlāvatī, sowing games, Chaupar/Gyān Caupaṛ, number ciphers, NCERT
use); the rest of the ancient world (Rithmomachia, mancala family, Ur/Senet, puzzle texts, counting
devices); and the AI/feasibility side against the architecture proven in Rung. All three are in
`docs/RESEARCH-*.md` with sources and confidence marks. Myths flagged: "Baudhāyana proved
Pythagoras", "Pachisi is 5,000 years old", "Gyān Caupaṛ is 2nd century", the Tīrtha π verse,
Senet's "rules", the Ishango prime table.

---

## HD-003 — Build the sowing game with "call the pit"; not the altar, not the riddles
15 Sep 2026 · **Decided**

**What.** Kuzhi: a two-row, fourteen-pit sowing game (Pallanguzhi / Ali Guli Mane / Oware family)
where the child must call the landing pit before the seeds move; the capture is hers only if the
call was right; the wrong marker stays on the board; code names the miscount; the model phrases the
hint through Rung's gate. Ages 6–9. One simplified rule version, named as such.

**Why this one.** All three passes ranked it first or second. It is the only candidate that is
(a) a different product from Rung rather than a re-skin, (b) squarely Nerdy's Prompt 01 (core
numeracy, elementary), (c) built on living, attested rules with no sacred load, and (d) able to
produce the hand-made action log the proven architecture needs, once the call step exists.

**Rejected.**
- *Śulba brick altar.* The best "Sanskrit era" fit and genuinely about area, but it is Rung's
  build-is-the-maths on a grid — the owner asked for different — and it carries a live Śrauta rite
  that must be stripped to be a children's product.
- *Līlāvatī riddles.* The verse carries the numbers, so any runtime model call holds the answer;
  the lexical gate cannot apply. A riddle chatbot is the PNAS-contradicted lane in costume.
  Usable only as static, hand-checked level flavour later.
- *Kaṭapayādi / Bhūtasaṃkhyā.* The hint *is* number words; the central safeguard inverts.
- *Rithmomachia.* Ages 11+, medieval not ancient, a week of rules engine, contested rules.
- *Royal Game of Ur with a bet.* A real probability lesson, but ages 9–12, a disputed route, and
  the linear-board evidence (Siegler & Ramani) says the numbered track is what teaches, not the dice.
- *Gyān Caupaṛ as-is.* No decisions; the karma ladder as a reward loop is a judgement on a
  seven-year-old dressed as a game.

**The call step is ours.** No traditional rule set contains it. The source screen says so.

---

## HD-004 — Rules fixed for version one
15 Sep 2026 · **Decided**

2×7 pits; seeds per pit by level (2, 3, 4, 6); anticlockwise sowing, no skipping; relay only on the
two relay levels, depth one; end-of-move capture of the pit beyond the next empty pit (the attested
Pallanguzhi capture), earned only by a correct call; pasu at exactly four on levels with ≥4 seeds;
game ends when a side cannot sow. **Rejected:** multi-round play with closed pits (a second game's
worth of rules), Ali Guli Mane's choose-a-direction (doubles the prediction space before she can
count one direction), the pit-opposite capture (invisible to the counting skill).

---

## HD-005 — The other side is code with one knob
15 Sep 2026 · **Decided**

One-move lookahead scoring captures and fours, choosing the best move with probability `p_best`
(default 0.6) and a random legal move otherwise; the overlay prints "code, p_best" beside every
opponent move. **Rejected:** a model opponent (slow, illegal moves, unmeasurable difficulty, and a
panel sees through it); model table-talk (cosmetic; revisit only if everything else is green).

---

## HD-006 — Measurement carries over, plus the learning curve
15 Sep 2026 · **Decided**

Rung's within-child pre/post/48 h design with a paper ring-counting instrument and two
pre-registered controls; the same falsification sentence. New: call accuracy over the session as a
learning curve, which this mechanic produces on every move and Rung could not.

---

## HD-007 — Engine judgment calls, recorded while building Part 1
15 Sep 2026 · **Decided**

- **First-lap stop outranks the corner.** On a relay level the first hop can stop on a corner
  (from 3 on `3_relay`: 4, 5, 6, pick up, on to 10). The contract's collision rule would have
  called that `ambiguous` and sent the fencepost probe, which asks about the first seed and cannot
  tell the two apart. The child's count of the first hop was exact, so `stopped_at_first_lap` is
  reported alone. Contract edited. **Rejected:** ambiguous + probe (wrong question).
- **The probe resolves only to an id that matched.** `overshot_by_one` and `direction_reversed`
  coincide on every fresh `4_relay` move (from + 10 ≡ from − 4 mod 14); a tap after that hint must
  not turn into `counted_start_pit`. Contract edited.
- **The 1-seed "fencepost = reversal" note was false** (2·seeds ≡ 1 mod 14 has no solution) and is
  removed from the contract; on a 1-seed move the fencepost call is the source pit itself.
- **`in_progress`** is returned before the first completed move of a level, as in Rung, with
  `confirmed:false`; not one of the nine ids, never hinted.
- **`next()` on ambiguous returns the same node name;** the page owns the diagnostic layout (it can
  test candidate boards with `landing()` for corner-adjacent landings). No second return shape.
- **`policy()` scores store difference** (own minus hers after the move), which counts captures and
  fours together; ties go to the lowest pit; returns `null` when there is no legal move.
- **The expander forces the side** (`p` → hers, `o` → code's) so a fixture can play two child moves
  in a row on a reset board without the engine crediting a capture to the wrong store.

---

## HD-008 — The AI layer and server: Rung's, constants swapped, with these judgment calls
15 Sep 2026 · **Decided**

**What.** `src/buddy.mjs`, `src/server.mjs`, `data/hints.txt`, `evals/{readinglevel.py, buddy_test.mjs,
latency_cost.mjs, redteam_leak.py, run_all.py}`, `docs/BUDDY-CONTRACT.md` are copies of Rung's with
the game constants swapped; gate, providers, timeouts, trust boundary and rate limit are unchanged.
Calls made while copying, so nobody has to rediscover them:

- **27 templates, `correct` included.** `correct` is never hinted, but `TEMPLATES[id][tier]` exists for
  every id in `IDS` so the set-equality assert and the overlay never meet a hole; its three lines are
  number-free acknowledgements. `guessing` has templates too, though the page may choose silence.
- **The shape is fixed by the id.** ENGINE-CONTRACT says "derived from the id". The six booleans are a
  lookup table; `miscounted_seeds` alone adds which side of the landing the marker sits (a comparison
  of two path positions, never the distance). `relay` is true only for `stopped_at_first_lap`; it is
  *not* read from the node name, because "relay level" would narrow the seed count to {3, 4}.
- **DOMAIN list = 15 words** (pit, pits, seed, seeds, marker, corner, sow, sowing, hand, row, turn, lap,
  store, count, empty). Four out-of-list words survive across the 27 templates (*early, met, path, tap*),
  never more than one per line.
- **The number-word list is the same 36 words**; *first* stays allowed (the probe needs it).
- **Parent note vocab gate** rejects *holes/beads* (the child hears *pit* and *seed*); the at-home
  question may say *stones* and *bowls* because the parent has no board. Level names for `validNote`
  are `"<2|3|4|6> seeds a pit"` with an optional `", with a relay"`. "Zero fences" became "zero levels
  finished": a note claiming a finished level in a week with none is rejected as invented.
- **No control arm, no other POST routes.** Any POST that is not `/api/buddy` or `/api/note` is 404.
- **Red-team answer space** is the landing pit 0–13 and the seeds in hand {2, 3, 4, 6}, scored against
  the majority-class baseline on the drawn fixtures. Known, accepted: the `ambiguous` id only arises one
  past a corner, so the label alone narrows the landing to {0, 7}; and `openai` stays an evals-only
  dependency exactly as in Rung (`evals/requirements.txt`); the shipped app has none.

**Rejected.** A `relay` boolean from the node name (leaks the level); a stdlib rewrite of the attacker
client (a divergence from Rung's harness for no measured gain); templates that say *one pit early*
(the gate bans *one*; the templates say *a pit early*).

---

## HD-009 — The board page: judgment calls made while building `src/public/`
16 Sep 2026 · **Decided**

**What.** `board.html` + `board.mjs` (the wooden board, the call marker, the quarter-second sow, pips,
the hint card, spoken hints, the code opponent, persistence), `judge.mjs`, `source.html`. `sow.mjs`
stays Part 1 only: the page imports it and never edits it, so Part 2's "appended below the marker"
plan in CONCEPT §9 is dropped in favour of one page module.

- **Seeds are CSS, not a sprite.** A shaded oval with a highlight, laid in a sunflower spiral inside
  each pit, sized from the pit (`--c`), so one rule draws every seed at every viewport. **Rejected:**
  a Pillow-composited PNG (`scripts/make_seeds.py`) — a second asset pipeline for a 12 px oval.
- **Every seed she sows leaves the tray.** The seed in the air starts at the hand strip on the HUD and
  lands in the pit, one per quarter second, so the hand visibly empties as the count runs. Code's
  seeds leave its lifted pit. The flight layer sits on the stage, positioned from live rects, so the
  board's tilt costs nothing. **Rejected:** pit-to-pit hops (the hand never empties on screen).
- **The diagnostic board perturbs, it does not solve.** After `ambiguous`, every pit gets one seed
  more or fewer at random until no legal move of hers lands one past a corner (`landing()`, up to 50
  tries, then the last candidate ships). The level's seed count stays on the sign.
- **The probe never traps her.** One tap after the probe answers it, resolved or not; a tap on a pit
  she could sow from is her next pick, not an answer. The contract's "else stays ambiguous" holds
  in the log; the page just stops waiting.
- **Mid-call reload replays the call.** A `pick` with no `sow` puts the seeds back in her hand with
  the pit lifted; a `call` with no `sow` drops the marker and runs the sow, so the log never holds a
  call the board did not honour.
- **The end line is a card, not just a voice.** "The seeds are in." plus the stores compared in words
  (more / fewer / the same), in the band under the sign, spoken once. Never a digit off the sign.
- **The overlay names the opponent on every `turn` line** ("other side: code, p_best = 0.6") and once
  more in its own section, so a reviewer scrolling the log and one reading the summary both see it.
- **Storage is exactly the contract's** `{v, mastery, game, events}`; the sound choice lives in
  `kuzhi.sound` only.

**Verified** with real pointer input (Playwright `page.mouse.click` at rect centres, 68/68): the full
move, the wrong call (marker stays, card beside it, spoken once at rate 0.92 with the card's text),
pips one per seed, capture earned and forfeited, pasu, relay, the code move with its tag, reload
mid-game and mid-call, the end line, the end screen, mastery 1 after seven of eight, the overlay open
and closed at 1280×720 and 375×812, the `elementFromPoint` sweep (7/7 pits at both sizes, ≥ 44 px),
parent note from the model, source page; 0 console errors, 0 failed requests.


---

## HD-010 — QA round 1, server side: note budget, fallback wording, hint temperature, route
16 Sep 2026 · **Decided** (heritage/docs/TEST-REPORT.md D2, D3, D6)

- **Parent note.** The prompt now sets a word budget the model can hit (sixty words open, forty
  closed), the length gate is 520 characters (a three-sentence note was being cut at 400), and the
  server waits six seconds (client seven). The fallback spells counts in words and says *board*,
  never *level*: "This week two boards were finished, with a hint."
- **Hint phrasing at temperature 0.2**, and the system prompt forbids instructions about which pit to
  pick up. The lexical gate cannot see a reversed instruction; a cooler model and a narrower brief
  reduce them. Residual, published: a semantic slip is still possible; tier 1 on the demo shape is
  filmed with the template if the live rephrase reads wrong. **Rejected:** templates only at tier 1
  (hides the AI in the demo beat); a second model as a judge (cost, latency, and the same family).
- `/judge.mjs` route points at `public/judge.mjs`, matching the contract.

## HD-011 — QA round 1, screen side: the HUD is measured, the pits have a floor, the page scrolls before the board shrinks
16 Sep 2026 · **Decided**

**What.** Fixes for TEST-REPORT D1, D4, D5 and the principal's short-landscape finding, in `board.html`,
`board.mjs`, `judge.mjs` only.

- **`--hud` is measured, not reserved.** A `ResizeObserver` on `#hud` writes its height to the root
  variable, so the scene ends where the tray really ends (was a fixed 172 px against a 210–250 px
  wrapped HUD, which put pit 0 under the tray at 320 px). At ≤ 640 px Sound and the two links share
  one row (the links stacked beside the button), the sign and tray tighten, and ≤ 360 px trims the
  gaps once more, so the pits get the height back. **Rejected:** a bigger fixed reservation (wrong
  again on the next font or link).
- **Pits never go under 47 board px** (≥ 44 px on screen after the tilt). `layout()` tries the normal
  spacing, then a tighter portrait set (smaller gaps, shorter stores), and only then clamps; when
  the board plus HUD still exceed the viewport the stage grows and the page scrolls vertically
  (386×322 scrolls to 656 px) rather than crushing the board. Horizontal overflow stays hidden.
  **Rejected:** a landscape board on short landscape phones (too wide for 386 px without horizontal
  scroll); shrinking tap targets below 44 px.
- **Storage with the right keys and wrong types boots a fresh level.** `mastery` must be a plain
  object, `events` an array of objects, `game.state.pits` an array; anything else is treated as no
  save. No migration code: the format has one version.
- **The overlay labels the live classifier block "classifier · now (next tier)"**, since its tier
  is by contract one past the last logged hint; "last hint" stays as logged.

**Verified** with real pointer input at 320×640, 375×667, 375×812, 386×322 and 1280×720: every
pit of hers ≥ 44 px on screen (47.7–46.3 on the tight sizes, 99 at desktop), `elementFromPoint` at
each pit centre returns the pit (35/35), no horizontal scroll, `--hud` equals the measured HUD, a
wrong call's card never overlaps the marker, 0 console errors; the two wrong-type storage probes
boot `2_single` with no error; the overlay label; judge open/close byte-identical at 1280×720 and
375×812; `run_all.py` ALL PASS.

---

## HD-012 — Engine revision 2: the stake, the next-pit relay, the ladder, the tuned knob
16 Sep 2026 · **Decided**

**What.** `src/sow.mjs` Part 1 rebuilt to ENGINE-CONTRACT revision 2 (PRODUCT-REVIEW W1, W3, W4, W5, W8);
`evals/engine_test.mjs` (63 asserts), `evals/classifier_fixtures.json` (139 fixtures, 13 ids, 0 mismatches),
`evals/policy_sim.mjs` (new). Nothing outside `src/sow.mjs` and `evals/` touched; `buddy.mjs` still lacks
templates for the four new ids, so `buddy_test.mjs` fails on them until it gains them.

- **A stake on every call (W1).** A wrong call sends the last seed of the move to the far store; the landing
  pit is one lighter and the next move from it lands one short. Judgment calls: the lost seed is the last of the
  whole move, after any relay (she called the final landing, the marker sits there); relay and pasu read the
  board as it stands, so a lost seed can leave a pit at four and pasu takes it; a wrong call still forfeits the
  capture as before; a bare pit call on a count or even level is wrong. **Rejected:** losing the first hop's
  last seed (the call is about the final landing); a bonus seed for a right call (a pile to lay out, a second
  rule to explain).
- **The attested relay (W5).** Pick up `next(landed)` when it holds seeds, sow on from the pit after it, once.
  The pickup pit is not on the path, so a call on it is `ambiguous`; on a one-seed relay hop it is the
  fencepost. An empty landing pit no longer stops the relay, and pasu on the first landing does not either.
  The `relay` event's `from` is the pickup pit. Nine relay fixtures moved with the rule.
- **The ladder (W8).** Ten nodes: `count` asks how many the landing pit will hold, `even` asks its parity
  (Toguz Korgool's capture: an even landing pit is taken, on any row; pasu at four first; no
  beyond-the-empty capture there). `applyMove` returns `held`, the count as the last seed dropped, and the
  `sow` event carries it: the classifier has no board and needs it to grade the count. A wrong pit is graded
  by the pit rules; the count or parity is graded only on the right pit.
- **The knob is tuned (W4).** `policy_sim.mjs`: 2,000 games per level per `p_best`, code's one-ply policy
  against a child who picks a random legal pit and always calls right (calling right is `called: null` in the
  engine, since only a wrong call changes the board). Draws count half; 400-move cap. The brief said sweep
  0.3–1.0; nothing there is inside 45–55%, so the sweep is 0.0–1.0:

  | node | 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0 | chosen |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|
  | 2_single | **49.9** | 41.0 | 36.6 | 29.1 | 26.6 | 23.4 | 19.9 | 18.7 | 18.5 | 16.9 | 15.7 | 0.0 |
  | 3_single | **49.2** | 38.8 | 30.6 | 25.1 | 18.8 | 16.7 | 15.5 | 12.7 | 11.8 | 9.9 | 10.5 | 0.0 |
  | 4_single | **51.3** | 45.3 | 38.8 | 30.8 | 25.0 | 23.2 | 18.5 | 15.0 | 10.3 | 9.1 | 8.3 | 0.0 |
  | 6_single | **51.3** | 41.9 | 32.8 | 26.4 | 20.3 | 16.5 | 12.4 | 9.1 | 7.7 | 4.4 | 3.0 | 0.0 |
  | 3_relay | **51.7** | 40.6 | 33.1 | 25.8 | 21.4 | 15.9 | 12.1 | 9.9 | 9.0 | 7.5 | 5.1 | 0.0 |
  | 4_relay | 54.4 | **47.1** | 38.8 | 33.4 | 27.5 | 21.9 | 17.5 | 14.0 | 10.0 | 7.9 | 4.5 | 0.1 |
  | 4_count | **51.3** | 45.3 | 38.8 | 30.8 | 25.0 | 23.2 | 18.5 | 15.0 | 10.3 | 9.1 | 8.3 | 0.0 |
  | 6_count | **51.3** | 41.9 | 32.8 | 26.4 | 20.3 | 16.5 | 12.4 | 9.1 | 7.7 | 4.4 | 3.0 | 0.0 |
  | 4_even | **53.2** | 45.0 | 39.0 | 33.6 | 31.8 | 25.4 | 23.0 | 18.4 | 16.5 | 14.3 | 12.7 | 0.0 |
  | 6_even | 54.5 | **46.3** | 37.1 | 32.5 | 27.3 | 23.6 | 18.3 | 17.1 | 13.3 | 11.9 | 10.1 | 0.1 |

  Child win % (draw = half). `4_count`/`6_count` equal `4_single`/`6_single` because a right-calling child plays
  the same board. The finding is blunt: against a random picker the one-ply policy is too strong at any
  setting, so the tuned opponent is a random sower at seven, and one best move in ten on the two levels where
  random alone tips past 55%. `policy()` reads the node's `p_best` when none is passed; the page still passes
  its own. **Rejected:** a policy that avoids captures on her row (a second policy to explain and test, when the
  knob already reaches the band); finer steps than 0.1 (the band is two points wide at this resolution).
- **Fixtures.** 45 added: the seed-loss cases (a wrong call, a code move, then the lighter pit sown), the
  next-pit relay and its one-seed hop, the count and parity ids on all four new nodes, the probe both ways on
  a count node, tiers and guessing on the new ids.


---

## HD-013 — Ship day: the board catches up with engine revision 2 as far as it can
17 Sep 2026 · **Decided**

- **Tier one is the template.** The page shows `TEMPLATES[id][1]` with no model call; the model
  phrases tiers two and three. The review read the live tier-one rephrases and found them worse than
  the templates they paraphrase; the template is the better hint at the moment it matters most.
- **The board follows the revised engine:** the relay lifts the *next* pit; a lost seed visibly goes
  to the far store and the tray says so; progression stops at the six single and relay levels because
  the count and even screens are not built. The engine, fixtures and templates for those levels are
  complete and stay in the tree.
- **Not done today, said plainly:** the count and even board screens; the probe's second tap;
  first-move teaching; card keep-off; the parent page's week-wide open id; demo seeding.
  Each is in PRODUCT-REVIEW.md's fix list with an estimate.


---

## HD-014 — The semantic judge, and what it showed about this game's rephrases
17 Sep 2026 · **Decided**

Rung's judge (root D-075) applied unchanged. Live: 3 of 20 rephrases shipped; the gate stopped 13; the
judge overturned 4 that pointed the child at the wrong pit with no number in them
(`docs/JUDGE-RESULTS.md`). Two decisions confirmed by measurement: tier one stays the template
(HD-013); the model is optional and the templates carry the product.


---

## HD-015 — Kuzhi becomes "Seeds" inside Pip
17 Sep 2026 · **Decided**

Mounted under `/seeds/` on the Fence server's origin (root D-076); every path in the pages is now
relative so the game runs mounted and standalone; a How-to-play sheet, the level strip, the star
moment, Pip on the card and "Say it another way" are the same shared module as Fence's.
