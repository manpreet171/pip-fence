# Rung

A fence-building game for children aged 7–11 in which **the arithmetic is the build**. The child is
told "3 parts, 4 planks in each part" and given a cart with exactly twelve planks. If she counts
wrong, the fence stands wrong: one part a plank short, a plank sticking out over a post, two bare
slots. Nothing is marked wrong. The goat walks through the gap, and a short hint appears *on the
gap*. She repairs the fence with her hands.

Built for the Nerdy AI Hackathon Challenge (September 2026).

## Why this and not a homework chatbot

The 2025–26 evidence says AI that answers makes learning worse once the AI is taken away, and that
guardrailed chat removes the harm without adding a gain. So this product never answers. Code owns
the truth: a pure-function classifier reads the placement log and names the misconception. A model
only *phrases* a hint, from a payload that contains no integer, through a lexical gate that cannot
emit a number. The leak rate is measured, not asserted.

**Where the AI is, exactly.**
- The hint the child sees is phrased by a model from a payload with every number stripped out,
  through a gate that rejects digits, number words and ordinals, with a gate-checked template as
  the fallback. Spoken aloud by the browser's own speech, offline.
- The weekly note on the grown-ups page is written by the model from a validated summary of the
  child's mistakes (never the event log), through its own gate: one question, no blame, no jargon.
  The strongest result in the tutoring literature came from pointing AI at the adult.
- Everything that must be true is code: the misconception classifier, the mastery graph, the
  next-level choice. Press J in the game to watch the whole pipeline live.

Read the evidence base in [docs/RESEARCH-LEARNER.md](docs/RESEARCH-LEARNER.md), the approved concept in
[docs/CONCEPT-V3.2.md](docs/CONCEPT-V3.2.md), and every decision with its rejected alternatives in
[docs/DECISIONS.md](docs/DECISIONS.md). [docs/INDEX.md](docs/INDEX.md) is the map.

## Run it

Node 22 or newer. No dependencies, no build step.

```bash
node src/server.mjs
```

Open http://localhost:5177/build. The parent view is at `/public/parent.html`.

- Model-phrased hints follow whichever key is present: `ANTHROPIC_API_KEY` (`claude-haiku-4-5-20251001`,
  strict JSON schema) or `DEEPSEEK_API_KEY` (`deepseek-v4-flash`, JSON mode). Same payload, same gate.
  Without a key, and whenever the model is slow, fails, or trips the gate, the gate-checked template
  ships instead. Pulling the cable degrades the hint; it does not break the game.
- `CONTROL_ARM=1` mounts the frozen earlier build (`/`, `/measure`) and its model routes, for the
  side-by-side comparison only.
- `?node=4x3_concrete` starts a given level; `?debug=1` shows whether a hint came from the model or a
  template; `?judge=1` (or the J key) opens the engineering overlay: live events, the classifier's
  decision, the redacted payload, the gate verdict and latency, the mastery map.
  Levels: `{2x3,3x3,3x4,4x3,4x5,2x5}_{concrete,packs}`.

## Evals

```bash
python evals/run_all.py
```

| Check | What it proves |
|---|---|
| `readinglevel.py --assert` | All 24 hint templates: ≤2 sentences, zero digits or number words, scored against a named list (Dolch ∪ Fry) |
| `classifier_eval.mjs` | 68 hand-written placement sequences → confusion matrix. Right whenever it commits; silent (`ambiguous`) when the fence cannot tell two misconceptions apart. This is spec-consistency, not accuracy on children |
| `buddy_test.mjs` | 31 checks: no integer ever crosses the wire; the gate rejects digits, number words, extra sentences, banned words; every failure falls back to a template |
| `engine_eval2.mjs` | The frozen control arm's adaptive-selector result, kept so it is not lost |
| `redteam_leak.py` (manual, needs `DEEPSEEK_API_KEY`) | A different-family attacker, forced choice, recovers the target total no better than the majority-class baseline. Results in [docs/REDTEAM-RESULTS.md](docs/REDTEAM-RESULTS.md) |
| `latency_cost.mjs` (manual, needs a key) | p50/p95 and cost per hint over 20 live calls. Measured: p50 757 ms, p95 1.4 s, $0.00015/hint, gate pass 80% — [docs/LATENCY-RESULTS.md](docs/LATENCY-RESULTS.md) |

Eval-only Python packages are in `evals/requirements.txt`. The shipped app has none.

## What is and is not claimed

- The mechanic is *Zombie Division*'s intrinsic integration (2011). Persistent wrong structures exist
  in Minecraft Education and DragonBox. What no product we found couples is a persistent wrong build
  to a **named misconception** and a **published leak rate**.
- The child pilot is three case studies, within-child, pre → post → 48 h, with a pre-registered
  null in [docs/TRANSFER-TEST.md](docs/TRANSFER-TEST.md). No p-value. The comparison build is my own
  earlier build, which is a conflict of interest, and I administer the tests myself, unblinded.
- This is a Year 2–4 grouping tool, not a general arithmetic tutor.
- No voice, no camera, no free text: the child never types, so nothing personal is sent anywhere.
  All progress lives in one localStorage key on the device.

## Layout

```
src/server.mjs        zero-dependency server: static files + POST /api/buddy (the trust boundary)
src/public/fence.mjs  Part 1: the 12-node graph and classify(), pure; Part 2: the isometric scene
src/public/build.html the game            src/public/parent.html   the grown-ups view
src/engine/buddy.mjs  redacted payload, output gate, template fallback (runs in browser and server)
data/hints_v2.txt     24 templates, one source of truth       data/wordlist.txt   Dolch ∪ Fry ∪ domain
evals/                the harnesses above                     scripts/make_parts.py  sprite cut-outs
docs/                 evidence, concept, decisions, reviews   docs/history/   what was killed, and why
```

Artwork is Kenney's CC0 isometric packs (see [docs/CREDITS.md](docs/CREDITS.md)).

## A second concept, same pipeline: Kuzhi

[`heritage/`](heritage/README.md) holds a second, self-contained product built on the same
architecture in three days: a sowing game of the Pallanguzhi / Ali Guli Mane / Oware family where
the child must call the pit her last seed will land in before the seeds move. Same classifier-as-code,
same gated phrasing, same parent note, same overlay, its own research, evals, QA and review.
Run it with `node heritage/src/server.mjs` and open http://localhost:5180/board.

Manpreet Singh
