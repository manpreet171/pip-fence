# Pip

A fence-building maths game for children aged 6 to 10. The child is told "3 parts, 4 planks in
each part" and given a cart of planks. If she counts wrong, the fence stands wrong, the goat walks
through the gap, and Pip, a seed with eyes and a child's voice, talks her through fixing it.
The arithmetic is the build. Nothing is marked wrong.

Built for the Nerdy AI Hackathon Challenge, September 2026.

![The home page: the farm, the chapters, the badges](docs/shots/home.png)

## Try it

```bash
git clone https://github.com/manpreet171/pip-fence.git && cd pip-fence && node src/server.mjs
```

Open http://localhost:5177. No dependencies, Node 22. Set `DEEPSEEK_API_KEY` or
`ANTHROPIC_API_KEY` for the model; without a key every line falls back to a template and the game
still works. Sound on, and use Edge on Windows if you can: Pip's voice then matches throughout.
Press **J** in the game to watch the AI pipeline live. How it all works:
[docs/DESIGN.md](docs/DESIGN.md).

To put it online in two minutes:
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/manpreet171/pip-fence)
The free plan sleeps when idle, so the first load can take half a minute.

## Where it came from

The brief asked for a K-5 maths game that makes arithmetic intuitive and rewards mastery, with AI
at the centre. Before writing any game code, two weeks went into research and into killing ideas.

- **The research** ([docs/RESEARCH-LEARNER.md](docs/RESEARCH-LEARNER.md)) found one result that
  shows a learning gain, not just engagement, for this age: children learn more at equal time on
  task when the maths *is* the mechanic rather than a quiz wrapped in a game (Habgood and
  Ainsworth, *Zombie Division*, ages 7 to 11). It also found a large randomised trial in which ten
  minutes of AI help reduced children's persistence and independent performance once the AI was
  taken away. Those two findings set the whole design: the build is the maths, and the AI must
  never answer.
- **Four concepts were tried and set aside first**, each by a cheap experiment before any
  build: a misconception engine mined from real data, a spoken sixty-second defence, a tutor that
  is deliberately wrong, and a question-quality coach that turned out to overlap Khanmigo. The
  reasons are in [docs/DECISIONS.md](docs/DECISIONS.md), D-018 to D-035.
- **The first build was thrown away.** It was a quiz with a farm around it. Decision D-043 stops
  the build, names the problem, and restarts from the research. The fence came out of that.
- **A second game was built and dropped** on the last day: a traditional sowing game on the same
  AI pipeline. A child could not learn its rules from the screen. Fence stayed.

Eighty-five decisions, each with what was rejected and why, are in the log. Names and dates are
real; Rung was the working name until the last day.

## What makes it different

- **The wrong answer stays on screen as a wrong fence.** The child reads her own mistake off the
  world and repairs it with her hands. No red X, no score, no confetti.
- **Mistakes are named, not scored.** A pure function reads the placement log and says which
  misconception the fence shows: a part short, parts and planks swapped, a plank over the post,
  a pack treated as a plank, the gaps miscounted, the shares uneven. Fifteen of them. When two
  mistakes make the same fence, it asks her to point instead of guessing.
- **Four chapters on one board.** Build, Packs, Fix and Share turn one mechanic into
  multiplication, units within units, subtraction with addition, and division. A chapter opens on
  three gold stars.
- **Every word a six-year-old can read**, checked against a 500-word early-reader list, and every
  fixed line spoken in a child's voice.

![Pip's hint lands on the gap; the goat is already in the corn](docs/shots/hint.png)

## Why the AI is used this way

The model never sees a number from the fence and never grades. It does the parts that need
judgment about words and about practice, and code checks every one before the child sees it.

| Job | The model | The check |
|---|---|---|
| Hint | Rephrases a template for a child of six | No digits, no number words, a 500-word list. A second model judges the meaning is the same. Template on any failure |
| Cheer | Says what she did right when a fence is done | Booleans in. A judge rejects any claim not in the facts. No call when there is nothing specific to praise |
| Plan | Picks the next fence from her last eight, says why | Code lists the fences that exercise her mistake. The pick must be on that list |
| Show | Writes a worked example as moves: point, count, place, remove, say | Code simulates the moves first. Illegal or unhelpful scripts are replaced by code's own. Pip fixes one part and hands the rest back |
| Parent note | Writes a weekly note and one question to ask out loud | Validated summary in. Blame, invented claims and internal labels rejected |

![Show me, Pip: the model wrote the moves, code checked them, Pip performs them on her fence](docs/shots/show.png)

**Why no chat box.** An AI that answers makes learning worse once it is taken away. Pip cannot
answer because Pip is never given the number. The child never types or speaks, so nothing
personal leaves the device. Progress lives in one key in the browser's local storage.

**Why code names the mistake, not the model.** A model grading the fence would be right more
often on strange builds and wrong in ways nobody could audit. The classifier is tested on 162
hand-written sequences and is right whenever it commits.

![Press J: the event log, the classifier's verdict, the payload with no digits, who chose the next fence](docs/shots/judge.png)

## What is measured

```bash
python evals/run_all.py
```

| Check | What it proves |
|---|---|
| `readinglevel.py --assert` | All 48 hint templates: two sentences at most, no digits or number words, a named word list |
| `classifier_eval.mjs` | 162 hand-written placement sequences. Right whenever it commits, silent when two mistakes make the same fence |
| `buddy_test.mjs` | 57 checks: no integer crosses the wire, the gate rejects what it must, every failure falls back to a template |

With a live key, measured and written up in `docs/results/`:

| Run | Result |
|---|---|
| [Latency and cost](docs/results/LATENCY-RESULTS.md) | 20 live hints: p50 under a second, about a hundredth of a cent each |
| [The judge](docs/results/JUDGE-RESULTS.md) | 20 rephrases: 12 shipped, 6 stopped by the gate, 2 overturned by the judge |
| [Red team](docs/results/REDTEAM-RESULTS.md) | An attacker given the whole payload recovers the answer no better than guessing the commonest one |
| [The planner](docs/results/PLAN-RESULTS.md) | 8 learner records: every pick inside code's list, half different from the fixed order, sensibly |
| [Worked examples](docs/results/SHOW-RESULTS.md) | 6 fence states: 5 scripts passed the simulation and ran, 1 replaced by code's own |

![The grown-ups page: the week, the note, one question to ask](docs/shots/parent.png)

## Our concerns, honestly

- **No child has played it yet.** Everything about "it teaches" is architecture and measurement,
  not evidence. That is the biggest gap and we say so.
- **The classifier is consistent with its own spec**, not proven accurate on children. It will
  meet mistakes nobody wrote a fixture for.
- **The model's own lines use the browser's voice.** Pip's hundred fixed lines are a child's voice;
  a rephrase or a plan reason is not. In Edge on Windows they match. Elsewhere they do not.
- **Depth is narrow.** Twenty-four levels of one mechanic. Enough to show the idea, thin as a
  product.
- **The lexical gate is lexical.** It stops digits and number words. It does not stop a sentence
  that points the wrong way; that is what the judge is for, and the judge is another model.

## Layout

```
src/server.mjs        zero-dependency server; the model endpoints are the trust boundary
src/public/           the game (build.html, fence.mjs), home, parent page, judge overlay, Pip's pieces, assets
src/engine/buddy.mjs  every model job: payloads, gate, judge, simulator hooks, template fallbacks
data/                 hint templates and the word list
evals/                the checks above; results/ holds measured runs
scripts/              sprite cut-outs and Pip's voice clips
docs/                 how it works, the research, every decision, measured results, screenshots
```

Art is Kenney's CC0 isometric packs. Font is Fredoka, OFL. Pip's voice clips were made once with
`scripts/make_voice.py`. Credits in [docs/CREDITS.md](docs/CREDITS.md).
