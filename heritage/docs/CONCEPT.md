# KUZHI — "call the pit"

*kuzhi* (Tamil: pit). A sowing game the way children have played it in Tamil Nadu (Pallanguzhi),
Karnataka (Ali Guli Mane), Andhra (Vamana Guntalu), and across West Africa (Oware) and Central Asia
(Toguz Korgool), with one added step that turns it into a counting machine the child cannot get past
without counting: **before she sows, she must call the pit her last seed will land in.**

Written 15 Sep 2026 from `RESEARCH-INDIA.md`, `RESEARCH-WORLD.md`, `RESEARCH-AI.md`. Every claim
below traces to those memos with their confidence marks. Decisions are in `DECISIONS.md` (HD-001…).

---

## 0. The claim, exactly

Counting on around a cycle — "from pit 4, six seeds, where does the last one land?" — is
addition with a wrap, the skill that becomes skip-counting, the number line, and modular thinking.
The sowing family exercises it on every move; the research is honest that no controlled study shows
transfer (RESEARCH-WORLD §2e, RESEARCH-INDIA §3), so we measure it ourselves (root CONSTITUTION R3).

The narrow claim: **no product we found makes the counting the move.** On a screen the computer
sows and the child watches. Here the seeds do not move until she has committed a prediction, the
prediction stays on the board as a marker, and the gap between her call and where the seed actually
lands is a visible, repairable error that code can name.

The AI claim is Rung's, deliberately, and it is the reason this can be built to the same standard:
the model never counts for her, never sees a number, and only phrases a hint whose content code
fixed first. Same gate, same leak measurement, same parent note, same overlay.

---

## 1. Who it is for, and what she learns

Ages **6–9** (Year 1–4). Nerdy's Prompt 01 asks for "foundational arithmetic concepts…
intuitive and engaging… steady progression and reward mastery of core numeracy skills"
(RESEARCH-AI §0, High). The skills, in the order the levels introduce them:

1. **Counting on** from a start point by a small number (2, 3, 4) — one seed, one pit.
2. **Counting round a corner**: the path wraps from her row into the other row and back.
3. **Larger hops** (6 seeds) and **passing the start**: a full lap and beyond.
4. **Relay** (the attested sowing rule): when the last seed lands in an occupied pit, pick up that
   pit and keep sowing — two hops in one move, planned before the first seed drops.

Each is a node in a small mastery graph (§5). The misconceptions are named from the log (§4).

---

## 2. The board and the rules (one version, named as one version)

The rule family is attested; no single seed count is (RESEARCH-INDIA §3, High/Low). We ship **one
simplified version and say so** on the source screen.

- **Board:** two rows of seven pits. Her row is the near row, pits 1–7 left to right; the far row is
  the other side's, pits 8–14 continuing anticlockwise. A store at each end holds captured seeds.
- **Seeds per pit at the start:** set by the level: 2, 3, 4, or 6.
- **Sowing:** pick up every seed in one of your pits, drop one seed in each following pit
  anticlockwise, never skipping a pit (single-lap levels never reach the start pit again).
- **Relay (levels 5–6 only):** if the last seed lands in a pit that now holds more than one seed,
  pick that pit up and keep sowing. If it lands in an empty pit, the move ends.
- **Capture:** when the move ends, if the **next** pit is empty, take the seeds in the pit beyond it
  (the attested Pallanguzhi capture). **The capture is hers only if her call was right.** A wrong
  call still sows, but the capture is forfeited: the seeds stay where they are. This is what makes
  the call matter (RESEARCH-AI §5, the biggest risk, answered mechanically).
- **Four (pasu):** on levels with 4 or more seeds, any pit that reaches exactly four during sowing is
  taken by its row's owner at once. Kept because it is the attested "count to four" trigger for
  7–8-year-olds and because it makes her watch every pit, not just the last.
- **End:** when a side has no seeds to sow, the other side takes what is left; more seeds wins.
- **The other side is code.** A one-move-lookahead policy with one knob, `p_best`, tuned so a child
  wins about half the time. It never calls a pit, never talks. The overlay says "code" beside its
  every move. There is no model anywhere near a move (RESEARCH-AI §1b, §2).

Not in this version, by decision: multi-round play with closed pits, the Ali Guli Mane
choose-your-direction rule, the "pit opposite" capture. Named on the source screen as omissions.

---

## 3. The move, as she experiences it (the 20-second beat)

1. She taps one of her pits. It lifts; its seeds are shown in her hand as a row of dots.
2. **She taps the pit she thinks the last seed lands in.** A small wooden marker drops on it.
   Nothing has moved yet.
3. The seeds sow **one at a time, about a quarter second each**, so the count is watchable.
4. The last seed lands. If it lands on her marker, the marker turns and the capture (if any) is
   hers. If not, **the marker stays where she put it**, and the last seed sits where it landed.
   Nothing red, no buzzer. A hint appears beside the marker, in her words, spoken aloud:
   *"Your marker is one pit early. Count the seeds in your hand again."*
5. **Tap-to-count:** an empty-hand tap on the pit she sowed from walks pips along the path, one per
   seed, ending on the pit where the last seed landed. Code counts what is on the board.
6. The marker fades when she starts her next move. The other side sows (fast, labelled). Her turn.

The misconception persists on the board (the marker on the wrong pit) until she acts, which is the
design principle carried over from the learner research: the error is a thing she can see and fix,
not a verdict.

---

## 4. The log and the classifier (code owns truth)

Events, `t` in ms since the level started:

```
level_start{node}
pick{pit, seeds}                      she lifted a pit
call{pit}                             her prediction
sow{from, landed, path:[...]}         code sowed; path is every pit a seed went into, in order
relay{from, landed, path}             a relay hop (levels 5–6)
capture{pit, seeds, earned:bool}      earned=false when the call was wrong
four{pit, owner}                      a pasu
tap_count{pit}                        empty-hand tap on a pit
hint{id, tier}
turn{side:"code", from, landed}       the other side's move, for the record
```

`classify(events)` is a pure function over the **last call and sow**, with the recent calls as
context. Ids (all named from `called − landed` along the path, never from timing):

| id | evidence |
|---|---|
| `correct` | called == landed |
| `counted_start_pit` | called == landed − 1 on the path: she counted the pit she picked up as the first drop (fencepost) |
| `overshot_by_one` | called == landed + 1 on the path |
| `stopped_at_corner` | called == the last pit of a row and the path continued past that corner |
| `stopped_at_first_lap` | relay levels: called == the landing of the first hop when a relay followed |
| `direction_reversed` | called == the pit `seeds` steps *clockwise* from the source |
| `miscounted_seeds` | called is on the path but 2 or more pits from landed (she sowed a different number in her head) |
| `guessing` | three consecutive calls off the path, or the same pit called three times in a row regardless of source |
| `ambiguous` | none of the above uniquely; e.g. one seed where fencepost and reversal coincide |

Collisions are resolved as in Rung: `counted_start_pit` and `stopped_at_corner` coincide when the
landing is exactly one pit past a corner. The diagnostic node is any move that does not end at a
corner; when the collision occurs the classifier says `ambiguous`, the hint is the probe *"Show me
where your first seed goes,"* and her tap resolves it (a tap on the source pit → fencepost; on the
next pit → corner).

Tiers escalate on repeated `hint` events of the same id, as in Rung. `guessing` silences the hint
and the parent note for that level — the log is not evidence about arithmetic when she is not
trying to count.

**Eval:** 60+ hand-written sequences in a DSL → confusion matrix with `ambiguous` and `guessing` as
their own rows. Right whenever it commits; silent when it cannot tell. Spec-consistency, not
accuracy on children, and said so.

---

## 5. Levels and mastery

Six nodes, in order: `2_single`, `3_single`, `4_single`, `6_single`, `3_relay`, `4_relay`.
A node is mastered when 7 of her last 8 calls on it were right with no hint; 0.5 when hints were
needed. `next()` is the first unmastered node; `ambiguous` routes to a diagnostic layout whose
landing is not on a corner. Starting seeds also set the cycle length she must count over; the board
never changes shape.

---

## 6. The AI layer (verbatim from Rung, constants swapped)

- **Hint phrasing.** The classifier's `{id, tier}` and a redacted shape — booleans only:
  `{early: true, by_one: true, past_corner: false, relay: false}` — go to the model with the nouns
  `pit / seed / marker / row / hand` and the tier template. Output gate in order: strict JSON →
  ≤2 sentences → zero digits and 36 number words (cardinals, quantity words, ordinals from
  *second*) → no affect words → ≤2 out-of-list words against the same Dolch ∪ Fry list plus ~15
  domain words. Any failure → the gate-checked template. Provider follows the key. Spoken by the
  browser. Templates: 9 ids × 3 tiers, checked at build time by the same scorer.
- **What the model never gets:** the pit numbers, the seed count, the path, the landing. There is
  no number for it to leak, and the payload assert proves it on every fixture.
- **Red-team:** the same forced-choice attacker over the payload and over the gated hint text,
  against the majority-class baseline on the fixtures (answer space: landing pit 1–14, seed count).
- **Parent note:** the same note job from a validated summary: nodes mastered this week, the open
  misconception in parent words (nine entries of `PARENT_WORDS`), one thing to ask out loud
  (*"Put six stones in a row and count on from three — where do you land?"*). Empty week never
  reaches the model.
- **Judge overlay:** J opens the same panel: events, classifier now, last hint with source and
  latency and model id, the payload with the no-digits badge, the mastery map, and the line
  **"other side: code, p_best = 0.6"** beside every opponent move.
- **Not used, by decision:** a model opponent, model table-talk, model-generated levels, art, board
  history, Tamil text or any "ancient" script, voice input, vision.

---

## 7. Measurement

Within-child, pre → post → 48 h, three children if available, the same instrument on paper:
eight "count on around a ring" items (a ring of 14 dots, a start dot, a number of steps; she marks
the landing dot), six trained ring sizes and steps, two pre-registered controls (a straight number
line item and a subtraction item, never taught). Same falsification line as Rung, in the same words.
The headline set is deterministic: classifier confusion matrix, gate leak rate, red-team recovery vs
baseline, p50/p95 latency, cost per hint, and **call accuracy over the session as the learning
curve** — the number this product can show that Rung could not: does her prediction accuracy rise
within twenty minutes, and does it hold two days later?

---

## 8. The source screen (one screen, opened from the board)

"Where this game comes from." Regional names with correct diacritics (Pallāṅkuḻi, Aḷi Guḷi Maṇe,
Vāmana Guṇṭalu; Oware; Toguz Korgool, UNESCO 2020); "earliest evidence" not "invented in"; the
sentence that seed counts and captures vary by household and that ours is one simplified version;
that the *call* is our addition, not part of any traditional rule set; two or three linked sources
with a confidence word each. Plain spellings in the child's interface. No kings, no "5,000 years".

---

## 9. What is built, in order

1. `src/sow.mjs` Part 1: rules (`sow`, `capture`, `four`, `end`), `classify`, `GRAPH`, `next`,
   `policy` — pure, importable under node. Fixtures + confusion matrix green before any pixel.
2. `src/board.html` + `src/sow.mjs` Part 2: the wooden board, seeds, the call marker, the
   quarter-second sow, pips, the hint card, spoken hints, the code opponent, persistence.
3. `src/buddy.mjs`, `src/server.mjs`: copied from Rung, constants swapped; `/api/buddy`, `/api/note`.
4. `src/judge.mjs`, `src/parent.html`, the source screen.
5. `evals/`: fixtures, classifier eval, buddy test, reading-level assert, red-team, latency, runner.
6. QA with real pointer input; product review; pilot if children are available.

Each step keeps the root repository untouched.

---

## 10. Risks, logged honestly

1. **The call step is an imposition.** Children play sowing games without it. If a child learns to
   tap any pit to get past it, the log is noise. Answered by making the call decide the capture and
   by `guessing` as a first-class output that silences everything. Watched in the pilot.
2. **No transfer evidence exists for sowing games**, anywhere. We claim only what we measure.
3. **Relay is "incalculable" for humans at depth** (RESEARCH-INDIA §3). Depth capped at one relay,
   on two levels only.
4. **One rule version.** Some Tamil households will say "that's not Pallanguzhi." The source screen
   says it first.
5. **Seeds on a screen are small.** The sow animation must be legible at 320 px or the mechanic is
   invisible; tested before the hint layer is written.
6. **Same model family for coach and attacker**, as in Rung, published as such.

---

## Revision 2 (16 Sep 2026) — what the product review changed

The hiring-panel review (`PRODUCT-REVIEW.md`) found two design faults, not polish: on three moves
in four a wrong call cost nothing, and the live tier-1 rephrases read worse than the templates.
It also caught a mislabel: our relay was the Congkak rule, not the attested Tamil and Kannada one.
All three are fixed by design (HD-012, HD-013):

- **A stake on every call.** A wrong call costs a seed: the last seed of her move goes to the other
  side's store instead of the landing pit. She sees it fly past her marker. A right call sows
  normally and keeps any capture. This replaces "the capture is forfeited", which only bit when a
  capture happened to be available.
- **The attested relay.** When the last seed lands, look at the *next* pit: seeds there are picked up
  and sown on (once); an empty next pit captures the pit beyond it. `landing()` predicts the same.
- **Tier 1 is the template.** The model phrases tiers 2 and 3 only, at temperature 0.2, and is
  never asked to give an instruction about which pit to pick up. The demo beat shows the template
  on the first miss and the model on the second.
- **The ladder is ten nodes.** After the six call levels, two *count* levels (call the pit and how
  many seeds it will hold after the sow: addition, with a strip of seed silhouettes to tap, never a
  digit) and two *even* levels (the Toguz Korgool capture: call the pit and whether it will be even or
  odd). Four new misconception ids, four new template sets, four new parent-words entries. One skill
  became a ladder from counting on to addition and parity, all inside the same board and log.
- **Difficulty is tuned, not asserted.** `evals/policy_sim.mjs` plays two thousand games a level;
  `p_best` per level is chosen so a random-picking child who always calls right wins about half.

