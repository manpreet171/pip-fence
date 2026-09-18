# Pip

A fence-building maths game for children aged 6 to 10. The child is told "3 parts, 4 planks in
each part" and given a cart of planks. If she counts wrong, the fence stands wrong, the goat walks
through the gap, and Pip, a seed with eyes and a child's voice, talks her through fixing it.
The arithmetic is the build. Nothing is marked wrong.

Built for the Nerdy AI Hackathon Challenge, September 2026.

## Run it

```bash
node src/server.mjs
```

Open http://localhost:5177. No dependencies, Node 22. Set `DEEPSEEK_API_KEY` or
`ANTHROPIC_API_KEY` for the model; without a key every line falls back to a template and the game
still works. Press **J** in the game to watch the AI pipeline live.

## What the child gets

- **Four chapters, 24 levels.** Build (multiplication as repeated groups), Packs (units within
  units), Fix (subtraction per part, addition across parts), Share (division). A chapter opens on
  three gold stars. Stars, badges, and a farm that greens up.
- **How to play** per chapter, read aloud, then Pip shows the new move on the real board.
- **Hints on the gap** when a fence is wrong, spoken in Pip's voice. **Say it a new way** for a
  fresh phrasing. **Show me, Pip** after the second hint: Pip fixes one part on the child's own
  fence and hands the rest back.
- **A parent page** with a weekly note and one question to ask out loud.

## Where the AI is

Code owns the truth. A pure-function classifier reads the placement log and names the
misconception. The model never sees a number and never grades. It does the parts that need
judgment, and code checks every one before the child sees it:

| Job | The model | The check |
|---|---|---|
| Hint | Rephrases a template for a child of six | Gate: no digits, no number words, 500-word list. Judge: same meaning. Template fallback |
| Cheer | Says what she did right | Booleans in. Judge rejects any invented claim. No call when there is nothing specific to praise |
| Plan | Picks the next fence from her record, says why | Code lists the allowed fences from her mistake. Pick checked against that list |
| Show | Writes a worked example as moves | Code simulates the moves first. Illegal or unhelpful scripts replaced by code's own |
| Parent note | Writes the weekly note | Validated summary in. Blame words, invented claims and internal labels rejected |

**Why no chat box.** An AI that answers makes learning worse once it is taken away. Pip cannot
answer because Pip is never given the number. The child never types or speaks, so nothing personal
leaves the device.

## Evals

```bash
python evals/run_all.py
```

| Check | What it proves |
|---|---|
| `readinglevel.py --assert` | All 48 hint templates: two sentences at most, no digits or number words, a named word list |
| `classifier_eval.mjs` | 162 hand-written placement sequences. Right whenever it commits, silent when two mistakes make the same fence |
| `buddy_test.mjs` | 57 checks: no integer crosses the wire, the gate rejects what it must, every failure falls back to a template |
| `engine_eval2.mjs` | The frozen comparison build's selector, kept so it is not lost |

Measured with a live key, results in `docs/results/`: hints ([latency](docs/results/LATENCY-RESULTS.md),
[judge](docs/results/JUDGE-RESULTS.md), [red-team](docs/results/REDTEAM-RESULTS.md)),
[plans](docs/results/PLAN-RESULTS.md), [worked examples](docs/results/SHOW-RESULTS.md).

## What is not claimed

- No child has been tested. The pilot instrument with its pre-registered null is in
  [docs/TRANSFER-TEST.md](docs/TRANSFER-TEST.md).
- This teaches grouping for Year 2 to 4. It is not a general arithmetic tutor.
- The mechanic is Zombie Division's intrinsic integration, 2011, credited.

## Layout

```
src/server.mjs        zero-dependency server; the model endpoints are the trust boundary
src/public/           the game (build.html, fence.mjs), home, parent page, judge overlay, Pip's shared pieces, assets
src/engine/buddy.mjs  every model job: payloads, gate, judge, simulator hooks, template fallbacks
src/control/          the frozen earlier build, served only with CONTROL_ARM=1, for the side-by-side
data/                 hint templates and the word list
evals/                the checks above; results/ holds measured runs
scripts/              sprite cut-outs and Pip's voice clips
docs/                 concept, research, decisions, reviews, demo script, results
```

Art is Kenney's CC0 isometric packs. Font is Fredoka, OFL. Pip's voice clips were made once with
`scripts/make_voice.py`. Credits in [docs/CREDITS.md](docs/CREDITS.md).
