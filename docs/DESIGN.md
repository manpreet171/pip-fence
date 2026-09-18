# How Pip works

## The idea

A child is told "3 parts, 4 planks in each part" and given a cart of planks. She builds a fence.
If she counts wrong, the fence stands wrong: a part a plank short, a plank sticking out over a
post, a bare part. Nothing turns red. The goat walks through the gap, and Pip, a seed with eyes
and a child's voice, talks her through fixing it with her hands.

The arithmetic is the build. That is the whole design, and it comes from one finding: children
learn more at the same time on task when the maths is the mechanic, not a quiz wrapped in a game
(Habgood and Ainsworth, ages 7 to 11). Everything else serves that. The evidence is for 7 to 11;
the words and the voice are pitched at six so the younger end can play too.

## What she learns

| Chapter | The job | The maths |
|---|---|---|
| Build | Put the right number of planks in every part | Multiplication as repeated groups |
| Packs | Planks come in packs; order the packs first | Units within units |
| Fix | The wind blew planks out; count the gaps, order exactly that many, repair | Subtraction per part, addition across parts |
| Share | You have 12 planks and 4 go in each part; you decide how many parts | Division |

Six fence shapes per chapter, 24 levels. A chapter opens on three gold stars in the one before;
she is sent there once every fence in her chapter is gold, never earlier and never back (D-091).
Gold is a fence finished without a hint; silver, with one. The last gold of a chapter says a new
chapter is open; the last gold of all ends with a star, Pip's last line and Start again.

## How Pip knows what went wrong

Code reads the fence, not a model. Every tap is logged, and a pure function over that log names
the misconception from the shape of the wrong build:

- one part short, every part short, parts and planks swapped, only the first part built, a
  plank over the post, the right total in the wrong groups, a pack treated as a plank;
- in Fix: ordered too few, ordered too many, counted the standing planks instead of the gaps,
  fixed one part only;
- in Share: a part per plank, as many parts as planks in a part, a part too few, a part too many.

When two mistakes make the same fence (in Build, every part one short on a fence with one more
plank per part than parts; in Share, as many parts as planks in a part), it says so and asks her to
tap a part she thinks is done; the parts glow until she does. That tap decides: a full part means she
knows what a part is, a short or bare one means she mixed the two numbers up. If she does not tap
within twenty seconds, Pip gives the likelier hint, marked as unconfirmed. The classifier is tested
on 169 hand-written sequences and is right whenever it commits.

## Where the AI is

The model never sees a number from the fence and never grades. It does the parts that need
judgment about words and about practice, and code checks every one before the child sees it.

| Job | The model | The check |
|---|---|---|
| Hint | Rephrases a template for a child of six | No digits, no number words, an early-reader word list (Dolch and Fry sight words plus the game's own nouns). A second call at temperature zero judges that the meaning is the same. Template on any failure |
| Cheer | Says what she did right | Booleans in. A judge rejects any claim not in the facts. No call when there is nothing specific to praise |
| Plan | Picks the next fence from her last eight, says why | Code lists the fences in her chapter that exercise her mistake. The pick must be on that list; the reason line passes the same gate and a facts judge |
| Show | Writes a worked example as moves: point, count, place, remove, say | Code simulates the moves first. Illegal, over-filling or unhelpful scripts are replaced by code's own. Pip fixes one part and hands the rest back |
| Parent note | Writes a weekly note and one question to ask | Validated summary in. Blame words, claims about progress or readiness, internal labels and wrong fence counts rejected |

Every job has a template fallback, so the game plays the same with no key and no network.
Press **J** in the game to watch the pipeline live: the event log, the classifier's verdict, the
payload the model got, and who chose the next fence and why.

**Starting over** lives on the grown-ups page, behind a confirmation, so a child cannot wipe the
farm by accident. After the last fence, the ending screen offers it too.

## Why there is no chat box

An AI that answers makes learning worse once it is taken away. Pip cannot answer because Pip is
never given the number. The child never types or speaks, so nothing personal leaves the device.
Progress lives in one key in the browser's local storage.

## What she sees

- **How to play** per chapter, three steps, read aloud, then Pip shows the new move on the real
  board and hands over. While Pip is showing, in her demo or her worked example, the board and the
  buttons do not take taps and are dimmed, so a fast child cannot muddle what she is doing. The sheet has a close, so Home is never out of reach.
- **Pip counts with her.** Each plank she places, Pip says the number that part now holds. The
  cart pulses while her hand is empty and the parts glow while it is full. On her first move of a
  level a bouncing arrow sits on the next thing to tap, and while Pip talks about the cart or a
  part in her demo, the arrow points at it. The demo says what a part is: the fence from one post
  to the next.
- **Hints on the gap**, spoken. **Say it a new way** asks for a fresh phrasing. **Show me, Pip**
  is on every hint card, and the arrow sits on the gap while the hint is read. A plank over the post comes back with a tap anywhere on that part.
- **Pip cheers** what she did: first try, a count that fixed a short part, the chapter finished. Only
  what the log shows; a plank taken back after an over-count is not "the short part fixed".
- **Stars, badges, and a farm that greens up** on the home page as she masters levels.
- Every word she reads was checked against an early-reader word list (Dolch and Fry sight words plus the game's own nouns). Pip's fixed lines are
  audio clips made once from one child's voice; with a voice key on the server, the model's fresh
  lines are spoken by that same voice.

## What is measured

`python evals/run_all.py` runs the reading-level gate over all 48 hint templates, the classifier
over its 169 sequences, and 86 checks on the hint layer. With a live key, the scripts in `evals/`
measure latency and cost, the judge's overturn rate, a red-team attack on the payload, the
planner's picks and the worked examples. Results are in `docs/results/`.

## What is not claimed

No child has been tested yet. The classifier is consistent with its own spec, not proven accurate
on children. This teaches grouping for Year 2 to 4 and nothing else.
