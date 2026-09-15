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
