# Heritage — a second concept, isolated

Started 15 Sep 2026, three days before the deadline, on the owner's call: *think differently; take a
game children played in ancient places, and give it a modern AI angle.*

This folder is self-contained. Nothing in it imports from, edits, or is imported by the files
outside it. The main submission (Rung, at the repository root) is untouched and remains the fallback.
The constitution at the root applies here in full: no tooling attribution, judged on shipped not
described, evidence over vibes, novelty serves value, fewest files, decisions written down. The one
deliberate exception to its folder rule is that this concept keeps its own `docs/` here, so that it
can be judged, kept or deleted as a unit.

## Kuzhi

*kuzhi* is Tamil for *pit*. A sowing game of the Pallanguzhi / Ali Guli Mane / Oware family for
children aged 6–9, with one added rule: **before she sows, she calls the pit her last seed will land
in.** The seeds then drop one at a time. A wrong marker stays on the board, code names the miscount
from her log, and a model only phrases the hint through a gate that cannot say a number. The capture
is hers only if the call was right. The other side is code with one knob.

```bash
node heritage/src/server.mjs
```

Open http://localhost:5180/board. Grown-ups: `/public/parent.html`. Sources: `/public/source.html`.
`?node=3_single` starts a given level; `?debug=1` shows the hint's source; `?judge=1` or J opens the
engineering overlay. Hints and the parent note follow whichever key is set (`ANTHROPIC_API_KEY` or
`DEEPSEEK_API_KEY`); without one, the gate-checked templates ship.

```bash
python heritage/evals/run_all.py
```

- `docs/RESEARCH.md` — what the three research passes found, with sources and confidence.
- `docs/CONCEPT.md` — the game, the learning claim, the AI layer, the measurement.
- `docs/ENGINE-CONTRACT.md`, `docs/BUDDY-CONTRACT.md` — the two interfaces the code is built to.
- `docs/DECISIONS.md` — this concept's own decision log (HD-001…).
- `docs/TEST-REPORT.md`, `docs/PRODUCT-REVIEW.md` — independent QA and the hiring-panel review.
- `docs/LATENCY-RESULTS.md`, `docs/REDTEAM-RESULTS.md`, `docs/TRANSFER-TEST.md`, `docs/DEMO.md`.
- `src/sow.mjs` (rules and classifier, pure) · `src/buddy.mjs` (hint and note jobs, gate) ·
  `src/server.mjs` · `src/public/{board.html, board.mjs, judge.mjs, parent.html, source.html}` ·
  `data/hints.txt` (27 templates) · `data/wordlist.txt` · `evals/`.

**What ships (17 Sep 2026).** Six playable levels (single and relay), the stake on every call, the
attested next-pit relay, the tier-one template rule, the overlay, the parent page, the source screen,
independent QA and a hiring-panel review. The engine also carries four *count* and *even* levels
(addition and parity on the same board, 139 fixtures green) whose board screens are not built yet;
the page stops at the six levels it can show, and says so here rather than pretending.

Type: Fredoka (OFL). No other third-party assets: the board and seeds are drawn in CSS.
