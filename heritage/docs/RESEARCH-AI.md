# RESEARCH-AI — the AI side and the three-day feasibility of a heritage game

Written 15 Sep 2026, three days before the deadline (Fri 18 Sep, 11:59 PM CDT). Scoping memo, not a
concept. Grounded in the root repo as it stands: `src/engine/buddy.mjs` (gate, providers, note),
`src/public/fence.mjs` Part 1 (classifier), `src/server.mjs`, `src/public/judge.mjs`, `evals/`.
The two game-catalogue passes (`RESEARCH.md`, when it lands) own the history; this memo owns
"where does a model earn its place, and what fits in 72 hours".

Confidence flags: **H** = verified against a primary or vendor source today; **M** = secondary
source, consistent across two or more; **L** = my own estimate or a single source. Every estimate of
hours is L by definition.

---

## 0. The frame that does not change

The proven architecture is the asset, not the fence. Restated once, as the test every mechanic
below is held against:

1. **Code owns the truth.** A pure function over the action log names the misconception. No model on
   the truth path, the difficulty path, or the mastery path.
2. **The model only phrases.** It receives a payload with every number stripped, returns strict
   JSON, and passes a lexical gate (≤2 sentences, no digit, no number word, no affect word, ≤2
   out-of-list words). Any miss ships the gate-checked template. Offline still plays.
3. **The leak rate is measured**, by an attacker from a different model family, against an honest
   majority-class baseline (REDTEAM-RESULTS: 40.0% vs 48.3%, no lift).
4. **The parent note** is the model pointed at the adult (Tutor CoPilot shape) from a validated
   summary, through its own gate; an empty week never reaches the model.
5. **The judge's overlay** shows the pipeline live. **Spoken hints** are the browser's own speech.
6. **Measurement** is within-child pre/post/48 h with a pre-registered null.

A heritage mechanic earns a model call only where the *same* separation holds: a log the child
produces with her hands, a classifier that can name an error from it without a model, and a hint
whose content is fixed by code before the model sees it. Where a mechanic cannot produce that log,
the model has nothing legitimate to do and the "AI angle" becomes theatre.

The brief itself (hackathon.nerdy.com, fetched today, **H**): Prompt 01 asks for "an interactive,
gamified math experience tailored for elementary students that makes foundational arithmetic
concepts both intuitive and engaging" with "innovative mechanics that encourage steady progression
and reward mastery of core numeracy skills"; the open prompt is "a tool that genuinely helps someone
learn"; entries are "judged on what you actually shipped"; "a project link plus a 2–3 minute demo
video". The page does **not** contain the words "user value" or "novelty" — that line ("Integrate AI
thoughtfully, prioritizing user value over novelty") is from Nerdy's job description, quoted in
CONSTITUTION R4, and is the sentence the panel will be hiring against.

---

## 1. Six candidate mechanics, held against the architecture

Legend per mechanic: skill and age band · what the action log is · what code can name · what the
model phrases · what would be theatre · verdict.

### (a) Brick-altar builder on a grid (Śulba Sūtras)

The sources: Baudhāyana's falcon altar (śyena-citi) has an area of 7½ puruṣa and **200 bricks per
layer, five layers**, and the sūtras give rope-and-peg constructions for turning a rectangle into a
square of equal area, and a square into a circle of (approximately) equal area (**M**:
https://en.wikipedia.org/wiki/Shulba_Sutras · https://mathshistory.st-andrews.ac.uk/HistTopics/Indian_sulbasutras/ ·
https://arxiv.org/pdf/2006.10285).

- **Skill, age.** Area as a count of unit tiles; conservation of area under re-shaping ("same
  bricks, different shape"); arrays as multiplication (rows × columns); with half-bricks, halves as
  units. Ages 8–11. This is the one mechanic on the list that is *foundational arithmetic* in the
  brief's sense and also genuinely what the source text is about.
- **Action log.** `{e:"place", brick:"whole"|"half", cell:[r,c], layer}`, `remove`, `commit`. Same
  shape as Rung's log; the tally is a grid instead of a vector.
- **Code can name.** `layer_short_by_row` (a row missing — the gap persists as a hole in the
  platform, exactly Rung's absent-plank cue); `counted_perimeter_as_area` (bricks only round the
  edge, hollow middle); `half_brick_as_whole` (a half laid where a whole was needed — Rung's
  `pack_unit_confusion` in reverse); `shape_changed_count_changed` (the equal-area task: she made
  the second shape with more or fewer bricks than the first); `over_count` (a brick past the
  outline). All decidable from the grid alone.
- **Model phrases.** The tier-1/2/3 hint from a payload of booleans (`has_hole`, `edge_only`,
  `used_half_where_whole`) — verbatim reuse of `redact()`/`gate()`.
- **Theatre.** A model "designing altars" or "generating shapes" (the shapes are six fixed
  outlines); vision reading the child's grid (code holds it); any "Vedic maths" framing (the 1965
  Tirthaji book is not Vedic and the panel's Indian engineers will know it — **M**); a narrator
  priest.
- **Verdict.** Closest fit to the proven architecture — arguably a re-skin of Rung (grid for
  fence). That is its weakness for this owner: it does not read as a different product. Its other
  cost is cultural (§4): the object is a Śrauta fire altar, built "by one desiring heaven"; the
  children's version must be "the rope-stretchers' geometry" with no fire, no rite, no merit.
  Three-day cost is moderate: grid rendering is simpler than the isometric fence, but half-bricks
  and outline templates are new.

### (b) A sowing game — Pallanguzhi / Ali Guli Mane / Oware

Sources: Pallanguzhi, 2 × 7 pits, 146 seeds in the full game (12 per pit, 1 in each middle pit —
**M**: https://en.wikipedia.org/wiki/Pallanguzhi); the sowing family is living, secular, and
pan-regional (Tamil Nadu, Karnataka, Andhra; Oware among the Akan; Bao in East Africa).

- **Skill, age.** One-to-one correspondence, counting-on from a pit, counting round a corner
  (modular counting), subitizing small pits, the fencepost error (starting the count at the pit
  you emptied). Ages 6–9. Squarely "core numeracy".
- **The blunt design fact.** In a digital sowing game the *computer* sows. Tap a pit and the seeds
  fly; the child counts nothing. "Counting seeds IS the move" is true on a wooden board and false
  on a screen — unless the game asks for the count *before* the sow. So the mechanic must be:
  **call the pit.** She taps the pit she is sowing from, then taps the pit she says the last seed
  will land in, *then* the seeds go. The seeds land where arithmetic puts them; the called pit
  stays marked; the gap between called and landed is the persistent, visible, repairable error —
  and the next capture depends on it, so the count matters to the game, not to a quiz.
- **Action log.** `{e:"call", from, seeds_in_from, called}`, `{e:"sow", landed}`, `{e:"tap_count",
  pit}` (code walks the seeds with a pip, as in Rung), `capture`, `turn`. The distance
  `called − landed (mod pits)` is the whole diagnostic signal.
- **Code can name.** `counted_start_pit` (called one short: she counted the emptied pit as the
  first drop — the classic fencepost), `stopped_at_corner` (called the last pit on her side when
  the seeds should wrap), `miscounted_seeds_in_hand` (off by ≥2, and a tap-count on the source pit
  before the call was skipped), `direction_reversed` (called the mirror pit), `guessing` (three
  consecutive calls off by different amounts, no tap-count — the flag Rung calls
  `wheel_spinning`). Ambiguity: off-by-one can be fencepost *or* a seed miscount; resolve as Rung
  resolves the `[3,3,3]` collision — a "show me by counting" probe whose tap-count outcome commits
  the branch.
- **Model phrases.** The hint on the called pit, from booleans (`short_by_one`, `stopped_at_edge`,
  `counted_from_hand`). Templates: "Start counting on the pit after the empty one." Same gate,
  same number-word ban — and the ban costs nothing here because no hint needs a number.
- **The opponent.** Policy in **code**: one-ply greedy (maximise seeds captured this turn) with a
  single knob, `p_best` = probability of taking the best move, tuned so the child's win rate sits
  near 50%. Twenty lines. A model must never pick a move: it is slow, sometimes illegal,
  non-deterministic in difficulty, and the panel knows all three. Table-talk from the model
  ("You left a pit open on your side") through the same gate is allowed and optional (§2).
- **Theatre.** "AI opponent" meaning an LLM choosing moves; an LLM "explaining strategy"; model-
  generated backstory about kings and queens (the origin claims online are mostly unsourced —
  **L**).
- **Verdict.** Best fit to the brief's age band and to the architecture *once the call-the-pit
  step is added*. Genuinely a different product from Rung: a living two-player game with a code
  opponent. More new code than (a): a rules engine, a second player, turn state.

### (c) Līlāvatī verse riddles as a story

Source: Bhāskara II, c. 1150; Colebrooke's 1817 translation is public domain (**H**:
https://archive.org/details/lilavati00bhas). The bees-and-lotus problem: the square root of half
the swarm goes to the jasmine, eight-ninths of the whole follow, one pair remains (**M**,
https://www2.math.uconn.edu/~glaz/math1011f16/Instructor%20Resources/Lilavati%27s%20Swarm.pdf).

- **Skill, age.** Fractions of a whole vs fractions of a remainder; simple algebra; the famous
  problems need square roots. Ages 12+. The gentlest ones (the pearl necklace, the monkeys) are
  still fraction-of-whole at age 10–11. Not elementary arithmetic.
- **Action log.** Thin. Unless a bar-model manipulative is built (she splits a bar into ninths
  and drags parts to the jasmine), the only action is typing a number — the shape of a worksheet.
  With the bar model: `{e:"split", parts}`, `{e:"assign", part, place}`, `commit`.
- **Code can name.** With a bar model: `fraction_of_remainder_taken_as_fraction_of_whole`,
  `parts_unequal`, `whole_changed`. Without it: right/wrong only, which names nothing.
- **Model phrases.** Here is the trap. The verse *contains the numbers*. Any runtime "translate
  the verse into the child's words" call puts eight-ninths, a half, and a square root in the
  prompt and the answer within a line of arithmetic of the output. The lexical gate that makes
  Rung honest cannot be applied to a text whose content is numbers. The correct use of a model for
  the verses is **at build time, once, human-checked, shipped as static text** — and that is not
  a runtime AI feature; it is editing.
- **Theatre.** A model reading the verse aloud "in Sanskrit"; a Līlāvatī character who chats — the
  saturated lane the PNAS result contradicts (§2); "AI translates ancient text live", which the
  panel cannot verify and will assume hallucinates (it does: **L**, but the Kaṭapayādi decodings
  models produce are routinely wrong).
- **Verdict.** Wrong age band for Prompt 01, thin log, and the model's only honest role is offline.
  Use the verses as *flavour text* in another mechanic's level names if at all. Do not build.

### (d) Kaṭapayādi / Bhūtasaṃkhyā number-cipher play

Sources: consonant classes ka-, ṭa-, pa-, ya- map to digits, vowels carry no value, digits read
**right to left** (aṅkānāṃ vāmato gatiḥ) — **M**: https://en.wikipedia.org/wiki/Katapayadi_system ·
https://sanskrit.iitk.ac.in/jnanasangraha/sankhya/katapayaadi/help/sa/. Bhūtasaṃkhyā: "eyes" = 2,
"Vedas" = 4, "moon" = 1, many-to-one (**M**: https://en.wikipedia.org/wiki/Bhutasamkhya_system).

- **Skill, age.** Place value and digit order (the right-to-left rule is a real place-value
  exercise); symbol-to-value mapping. Ages 9–12 for Bhūtasaṃkhyā as a *picture-numeral* game
  ("moon, eyes, Vedas" → 421). Kaṭapayādi needs Devanāgarī consonant classes; a Nerdy panel's
  learners do not have them, so it degrades into an arbitrary substitution cipher.
- **Action log.** `{e:"drop", token:"eyes", slot:2}`; `commit`. Decodable.
- **Code can name.** `read_left_to_right` (the mirror number), `slot_skipped` (a place left
  empty → wrong magnitude), `token_value_wrong` (a fixed table says what "eyes" is).
- **Model phrases.** Nothing useful. The hint *is* number words ("eyes means two") — the gate that
  is the architecture's spine bans the hint's content. The architecture inverts.
- **Theatre.** A model "inventing new Sanskrit number-words" (it will invent wrong ones); a model
  decoding a Kaṭapayādi verse to show off the π mnemonic (well-known, not learning).
- **Verdict.** A neat five-minute museum exhibit, not a learning mechanic; the learnable skill is
  a cipher, and the architecture's central safeguard cannot be used. Do not build.

### (e) Rithmomachia-style progression battles

Source: medieval European (11th c.), 8 × 16 board, numbered pieces, victories by arithmetic,
geometric and harmonic progressions (**M**: https://en.wikipedia.org/wiki/Rithmomachia ·
https://mathvoices.ams.org/featurecolumn/2021/07/01/the-battle-of-numbers/).

- **Skill, age.** Multiplication facts, ratios, sequences. Ages 11+ for the simplified capture
  rules; the progression victories are secondary-school content. Not "ancient" and not elementary.
- **Action log.** Moves and captures. Decodable, but a classifier over "she failed to see the
  geometric progression 4-8-16" names a *missed opportunity*, not a misconception — the log does
  not show what she believed.
- **Model phrases / theatre.** An LLM opponent is the obvious and wrong build; enthusiasts do not
  even agree on the rules, so a model will play a game nobody recognises.
- **Verdict.** A week of rules engine for a game whose learning claim is unmeasurable in the
  timeframe. Do not build.

### (f) Royal Game of Ur with tetrahedral-dice probability

Source: Finkel's reconstruction from the cuneiform rules tablet; four tetrahedral dice, two of four
corners marked, roll = number of marked corners up, 0–4 (**H** for the rules:
https://genjam.org/wp-content/uploads/2021/09/onrules4gameofur.pdf; https://royalur.net/rules).
The distribution is binomial(4, ½): P(0)=1/16, P(1)=4/16, P(2)=6/16, P(3)=4/16, P(4)=1/16 (my
computation, **H**; one search snippet claiming "1 is 3 in 8" is wrong — https://royalur.net/dice
has the correct table).

- **Skill, age.** Probability sense: the roll is not uniform; 2 is six times as likely as 4; a
  safe-square decision has an expected value. Ages 9–12. Not foundational arithmetic in the
  brief's sense, and probability intuition is exactly the thing a 3-day pilot cannot measure.
- **Action log.** To get a log with a belief in it, add a **bet**: before each roll she stakes a
  token on the number. `{e:"bet", n}`, `{e:"roll", n}`, `{e:"move", from, to, options}`.
- **Code can name.** `equiprobability_bias` (bets spread flat over 0–4 after ≥8 rolls — a
  chi-square against uniform vs binomial, in code); `chases_the_four`; on moves,
  `left_safe_square_for_low_odds` (took a move that needed a 4 to be safe). These are real,
  documented misconceptions (Lecoutre's equiprobability bias, **M**).
- **Model phrases.** Table-talk from the code opponent and the hint on a bad bet ("Most rolls land
  in the middle" — number-free). Same gate.
- **The opponent.** Policy in code again; Ur is a solved race game, and heuristic play is ten
  lines.
- **Theatre.** An LLM rolling dice or "predicting" rolls; "AI reconstructs the ancient rules".
- **Verdict.** Second-best design; the bet is a clean log and the code opponent is trivial. Loses
  to (b) on age band and on the brief's "core numeracy". Mesopotamian, so it satisfies "other old
  heritages"; the British Museum owns the object and the images (their images are not CC0 —
  **M**), which matters for a video.

### Summary table

| | Skill / age | Log a child produces by hand | Classifier names a *misconception*? | Model's honest job | 3-day cost |
|---|---|---|---|---|---|
| (a) Śulba grid | area, arrays, halves / 8–11 | yes (grid) | yes, 5 ids | phrase hint, note | medium |
| (b) Sowing + call-the-pit | counting-on, fencepost, wrap / 6–9 | yes (call vs landed) | yes, 5 ids + probe | phrase hint, note, (table-talk) | medium-high |
| (c) Līlāvatī | fractions / 12+ | thin | only with a bar model | offline only | high |
| (d) Cipher | place value / 9–12 | yes | yes, but the hint is number words | none | low |
| (e) Rithmomachia | ratios / 11+ | yes | opportunity, not belief | none legitimate | very high |
| (f) Ur + bet | probability / 9–12 | yes (bet vs roll) | yes, 3 ids | phrase hint, note, (table-talk) | medium |

---

## 2. The "modern AI angle" a Nerdy engineering panel respects vs sees through

**What the evidence in this repo already commits us to.** PNAS 2025 (Bastani et al., ~1,000
students, Turkey): unguarded GPT-4 access raised practice scores and then **lowered exam scores 17%
against control** once removed; the guardrailed tutor removed the harm and added no gain (**H**,
https://www.pnas.org/doi/10.1073/pnas.2422633122, cited in docs/history/RESEARCH.md). Tutor CoPilot
(Stanford, RCT): AI pointed at the *tutor* raised mastery +4 pp, **+9 pp for the weakest tutors**
(**H**, https://arxiv.org/abs/2410.03017, cited in docs/RESEARCH-LEARNER.md). A heritage game with a
chatty guru who answers is the same saturated, contradicted lane with a costume on.

**Respected** (the panel is engineers; they will open the network tab and the repo):
- A model that provably cannot leak because it never held the number; a gate they can read in 20
  lines; a leak rate with an honest baseline.
- An opponent whose difficulty is a *single named parameter in code*, reproducible, with the
  child's win rate logged — and the sentence "the opponent is not AI; here is why" said on camera.
- A parent note from a validated summary, with the empty-week case handled (the repo has the bug
  story: the model invented a fence on a thin week; the gate now catches it lexically).
- Cost and latency numbers from a live run (LATENCY-RESULTS: p50 757 ms, $0.00015/hint).
- The negative decisions listed: no LLM on the truth path, no voice input (child ASR ~25% WER,
  COPPA voiceprints), no runtime translation of source verses.
- Heritage handled as *sources with confidence*, not as marketing.

**Seen through:**
- "AI opponent" = an LLM picking moves (slow, illegal moves, unmeasurable difficulty).
- "AI translates the ancient text live" — unverifiable on stage, hallucinates in practice, and puts
  the answer in the prompt.
- AI-generated "ancient" art or Sanskrit — the panel's Indian engineers will spot wrong Devanāgarī
  and invented iconography instantly; it also reads as disrespect (§4).
- A wise-sage chatbot; "Vedic maths"; "India invented X" claims; RAG over a rules PDF; an agent.
- Any feature the child cannot feel in the 3-minute video (CONSTITUTION §1).

**At most two AI features worth building, and whether they fit three days:**

1. **Gated hint phrasing on the called-pit miss** (the Rung buddy, constants swapped). Learner
   value: the tier ladder that never gives the count, spoken aloud for a 6-year-old who reads
   slowly. Worth it: **yes**, because it is ~3 hours of constant-swapping plus template writing,
   and it is the thing the architecture was built to prove.
2. **The parent note** from a validated week summary (`writeNote()`, new `PARENT_WORDS`, a new
   validator for level names). Learner value: the strongest measured effect in the literature goes
   through the adult. Worth it: **yes**, ~2 hours, it already handles the fallbacks.

**Not worth three days, listed so nobody re-argues them:**
- Opponent table-talk from the model. Cosmetic; engagement, not learning. Take it only on day 3 if
  everything else is green, because it is the same `phrase()` call with a second job — and label
  it "chatter, gated" in the overlay so nobody mistakes it for the opponent's brain.
- Model translation of Līlāvatī verses at runtime. Never at runtime. If verses appear as level
  flavour, generate once offline, check by hand, commit as text, say so in DECISIONS.
- Model-generated levels, boards, art, backstory. The five levels are a table.

The one-line "AI angle" for the video is therefore the same as Rung's, and that is the point: **the
AI never counts for her — it only ever says the next thing a good tutor would say, and we can prove
it never held the number.** A panel that respected it once will respect it in a second mechanic; a
panel that wanted a chatbot was never going to hire for this role.

---

## 3. Feasibility: three calendar days, one engineer, existing infrastructure

`heritage/README.md` says the folder is self-contained and imports nothing from the root. So
"verbatim" below means *copy the file into `heritage/src/…` and change constants*, never import.

**Reuse verbatim (copy, then a constants block changes):**
- `src/server.mjs` → `heritage/src/server.mjs`: drop the control-arm routes and the three legacy
  endpoints; keep `/api/buddy`, `/api/note`, the trust boundary, the rate limit, the static router.
  ~20 lines deleted, 0 written. **H**
- `src/engine/buddy.mjs` → the gate (`gate`, `NUMBER_WORDS`, `parseWordlist`), `redact`/`payload`,
  `hint`/`phrase`, `PROVIDERS` (both vendors), `writeNote`/`noteGate`/`noteFallback`/`note`,
  `HINT_JOB`/`NOTE_JOB`. What changes: `IDS`, the `HINTS` table, `NOUNS` (`pit`, `seed`, `side`),
  `SHAPE_KEYS`, `PARENT_WORDS`, the `FENCE_NAME` regex → a level-name regex, the two system prompts'
  nouns ("count seeds by sowing them in a game"). ~60 lines of constants; zero logic. **H**
- `data/wordlist.txt`: append a ~15-word domain list (`seed pit sow side row turn hand land wrap
  next skip empty`); `evals/readinglevel.py --assert` runs unchanged on a new `hints.txt`. **H**
- `evals/buddy_test.mjs`: swap the ids and template strings (~15 lines). `evals/run_all.py`: the
  same CHECKS list with the new paths. `evals/latency_cost.mjs`: unchanged. `evals/redteam_leak.py`:
  unchanged logic; needs new fixtures and a DeepSeek key to rerun. **M**
- `src/public/judge.mjs`: 55 lines, imports `GRAPH`/`IDS` — same panel, same blocks (events,
  classifier now, last hint, payload with `[no digits]` badge, source/gate/latency, mastery map).
  Swap the import and the mastery node names. **H**
- Spoken hints: the ~12 lines around `speechSynthesis` in `build.html`. **H**
- `docs/TRANSFER-TEST.md` as the template for the measurement plan (pre → post → 48 h, within
  child, pre-registered null). **H**

**Must be new:**
- Board rendering: 2 × 7 pits (level 1 may use 2 × 4), seeds as dots, a sow animation that drops
  one seed per 250 ms so the count is *watchable*, the called pit marked, the landed seed
  highlighted, tap-to-count pips over a pit. Plain DOM + CSS, no canvas, no isometric. ~150 lines.
- Rules engine (pure, Part 1 of `sow.mjs`): `sow(state, pit)` → new state, capture rule (last seed
  in an empty pit on your side captures the opposite pit — the simplest widespread variant;
  Pallanguzhi's "pasu" and the skip-next-pit rule are cut, D-log it), end-of-game, turn. ~80 lines.
- Classifier (pure): the five ids above plus `correct`, `in_progress`, the ambiguity probe.
  ~50 lines. Mastery: a per-level record, three levels (2 seeds/pit, 3, 4; then 2 × 7 with 4).
- Opponent policy: greedy-with-`p_best`. ~20 lines.
- Fixtures: ~40 hand-written call/sow sequences → expected id. Rewrite the 30-line DSL expander.
- Templates: 5 ids × 3 tiers = 15 lines, gate-asserted.
- Parent page: copy `parent.html`, new level names and `PARENT_WORDS`.
- Docs: `heritage/docs/CONCEPT.md`, `DECISIONS.md`, a source/attribution screen (§4).

**Day-by-day (hours are L; the order is not):**

*Day 1 (Tue 16) — the game with no AI.* Morning: `sow.mjs` Part 1 — rules, classifier, mastery —
with `classifier_eval.mjs` green on 40 fixtures before any pixel. Afternoon: board, tap-sow with the
call step, sow animation, tap-count pips, the called-pit marker persisting, the code opponent.
End of day: two levels playable end to end against the opponent, `run_all.py` green with templates
in place as the *only* hint path. If the classifier is not green by 13:00, the fixtures are too
ambitious: cut to three ids.

*Day 2 (Wed 17) — the AI, all of it reused.* Morning: buddy constants, templates through
`readinglevel --assert`, server copied and pruned, `/api/buddy` live, spoken hints, `?debug=1`.
Afternoon: judge overlay, parent page and `/api/note`, one `latency_cost` run, red-team rerun if
a key exists (else the honest line: "measured on Rung's payload shape; not rerun here"). Evening:
cold run on a clean machine (`node heritage/src/server.mjs`, no key → templates; with key → model).

*Day 3 (Thu 18) — ship.* Morning: the demo video (shot list below), README, CONCEPT and DECISIONS
written from what exists, not what was planned. Afternoon: pilot with one child if one is
available (pre/post on a paper board, 10 "where will the last seed land" items) — reported as
n=1, no claim. Submit by 18:00 CDT, not 23:59.

**Hard cut list, in the order things go:**
1. Opponent table-talk (never scheduled; day-3-only if green).
2. Level 4 (2 × 7, 4 seeds) — three levels are enough for a mastery map on camera.
3. Pallanguzhi-specific rules (pasu, skip-a-pit, 12-seed pits). Ship the simplest sowing variant
   and name it honestly as such: "the sowing family, simplified; Pallanguzhi's own rules are here
   [source]".
4. Sow animation → instant placement with the path highlighted (if the animation costs more than
   two hours).
5. The red-team rerun (report the Rung result with the caveat that the payload shape is the same
   and the fixtures differ).
6. The child pilot.
Never cut: the classifier eval, the gate assert, the offline path, the overlay, the source screen.

**Demo-video risk — what fits in three minutes.** The video has to make a stranger understand
"call the pit" without narration in ten seconds, and it has to be visible that the opponent is
code. Shot list: 0:00–0:15 a wooden board photo → the screen board (attribution on screen).
0:15–1:00 she picks a pit of five, calls the pit *one short*, the seeds drop one by one and the
last lands past her call; the called marker stays; the hint appears *on* that pit, spoken. She
tap-counts, calls again, captures. 1:00–1:40 press J: the event log, `counted_start_pit`, the
payload with `[no digits]`, the gate verdict, the round trip in ms, the provider name; pull the
key → the template ships, the game plays. 1:40–2:10 the grown-ups page: the note, the one question.
2:10–2:45 the eval table and the leak-rate line. 2:45–3:00 the claim, exactly this narrow: "no
product we found couples a sowing game to a named counting error and a published leak rate."
Risks: the sow animation is the whole legibility of the mechanic — if it reads as a blur the video
fails; the opponent's turn must be visibly labelled "code" or a viewer assumes it is the AI; a
two-player game means half the screen time is not the child's learning — keep the opponent's
turns under two seconds.

---

## 4. Cultural handling

**Fire altars (Śulba Sūtras).** The altars are Śrauta ritual objects; the Agnicayana is a living
rite (Staal's 1975 Kerala documentation, *Agni: The Vedic Ritual of the Fire Altar*, 1983 — **M**).
If (a) is ever built: present the *geometry of the rope-stretchers* (śulba = cord), not the rite —
no fire, no offerings, no priests, no mantras, no "build the altar to reach heaven" as a game goal,
no merit or reward framed as religious outcome. Call the object a "brick platform" or "the falcon
shape" and say on the source screen that the originals were altars and what for, in one plain
sentence. No deity imagery. Do not use "Vedic maths": the phrase belongs to a 1965 book of
arithmetic tricks with no Vedic source, and using it signals not having checked.

**Moksha Patam / Gyān Chaupar.** The squares are named vices and virtues (theft, lust, anger,
murder on the snakes; generosity, faith on the ladders), and the top is liberation (**M**:
https://en.wikipedia.org/wiki/Gyan_chauper ·
https://azimpremjiuniversity.edu.in/thats-the-thing/how-moksha-patam-rolled-into-snakes-and-ladders).
That is a moral-theological map, and turning "you slid down because of your vice" into a reward
loop for a seven-year-old is a judgement on the child dressed as a game. Do not use the karma
ladder as a mechanic. It can appear as a museum object on the source screen with its real name,
its Jain and Hindu variants named, and the 19th-century British reworking stated as fact without
the "stolen" framing that the popular pages use.

**Sowing games.** No sacred load; a living game played by grandmothers and children today. The
respectful thing is accuracy: its regional names (Pallanguzhi in Tamil, Ali Guli Mane in Kannada,
Vamana Guntalu in Telugu; Oware among the Akan), that the rules vary by house, and that the
version shipped is simplified — said plainly, not hidden.

**Across all of them:**
- No AI-generated "ancient" art, script, or iconography. Wrong Devanāgarī or invented motifs on a
  child's screen are the fastest way to lose the room, and generated religious imagery is a harm
  in itself. Use CC0 assets (Kenney, as Rung does), photographs with clear licences, or drawn
  shapes. The British Museum's Ur images are not CC0 (**M**) — link, do not embed.
- Names with correct diacritics on the source screen (Śulba Sūtra, Līlāvatī, Pallāṅkuḻi), plain
  spellings in the child's UI.
- Attribution in-app: one "Where this game comes from" screen reachable from the title and from
  the grown-ups page — region, period as "earliest evidence" not "invented in", two or three
  sources with links, the sentence "the rules here are simplified from [variant]; here is a full
  set", and a confidence word next to every historical claim. The same discipline as
  `RESEARCH-LEARNER.md`. No nationalist framing in either direction.
- The child's interface stays secular and free of historical claims: it is a game about seeds.

---

## 5. Recommendation

**Build (b): the sowing game with call-the-pit.** Simplest sowing rules, three levels, a code
opponent with one difficulty knob, Rung's gate and note copied with new constants, the overlay, the
source screen.

**The one-sentence pitch a judge remembers:** *"Before she sows, she has to call the pit her last
seed will land in — the seeds show her, code names why she was off, and the AI only ever phrases
the hint, because it never held the number."*

**The biggest reason it could fail:** the call step is an imposition on a game children already
know how to play without it. If a child learns to tap any pit to get past the call, the log is
noise, the classifier names errors she never made, and the parent note describes a child who does
not exist — and there are no days left to discover this with a real child. The mitigations are
mechanical, not optional: the call must *matter to the game* (a correct call earns the capture; a
miss forfeits it), the ambiguity probe must be cheap (one tap), and `guessing` must be a first-class
classifier output that silences the hint and the note rather than inventing a misconception. If
day 1 ends and a tester with no explanation does not understand the call step from the screen
alone, fall back to (f) Ur with a bet — the bet is a step a child *wants* to take — and accept the
older age band.

---

## Sources

- Nerdy AI Hackathon Challenge page — https://hackathon.nerdy.com/ (**H**, fetched 15 Sep 2026)
- Bastani et al., PNAS 2025, generative AI and learning — https://www.pnas.org/doi/10.1073/pnas.2422633122 (**H**)
- Wang et al., Tutor CoPilot RCT — https://arxiv.org/abs/2410.03017 (**H**)
- Śulba Sūtras — https://en.wikipedia.org/wiki/Shulba_Sutras · https://mathshistory.st-andrews.ac.uk/HistTopics/Indian_sulbasutras/ · Kātyāyana observations https://arxiv.org/pdf/2006.10285 (**M**)
- Pallanguzhi — https://en.wikipedia.org/wiki/Pallanguzhi (**M**; rule pages online disagree with each other)
- Līlāvatī, Colebrooke 1817 — https://archive.org/details/lilavati00bhas (**H**, public domain); the swarm problem https://www2.math.uconn.edu/~glaz/math1011f16/Instructor%20Resources/Lilavati%27s%20Swarm.pdf (**M**)
- Kaṭapayādi — https://en.wikipedia.org/wiki/Katapayadi_system · https://sanskrit.iitk.ac.in/jnanasangraha/sankhya/katapayaadi/help/sa/ ; Bhūtasaṃkhyā — https://en.wikipedia.org/wiki/Bhutasamkhya_system (**M**)
- Rithmomachia — https://en.wikipedia.org/wiki/Rithmomachia · https://mathvoices.ams.org/featurecolumn/2021/07/01/the-battle-of-numbers/ (**M**)
- Royal Game of Ur, Finkel's rules — https://genjam.org/wp-content/uploads/2021/09/onrules4gameofur.pdf · https://royalur.net/rules · dice https://royalur.net/dice (**H** for rules; distribution recomputed)
- Gyān Chaupar / Moksha Patam — https://en.wikipedia.org/wiki/Gyan_chauper · https://azimpremjiuniversity.edu.in/thats-the-thing/how-moksha-patam-rolled-into-snakes-and-ladders (**M**)
- Repo: `docs/AI-ARCHITECTURE.md`, `docs/CONCEPT-V3.2.md` §1–3, `docs/DECISIONS.md` D-071, `docs/REDTEAM-RESULTS.md`, `docs/LATENCY-RESULTS.md`, `src/engine/buddy.mjs`, `src/public/fence.mjs`, `src/server.mjs`, `src/public/judge.mjs` (**H**)
