# Product requirements

What Pip is for, who it is for, what it must and must not do, and how we would know it works.
Written before the build, kept honest after it. How it is built is in [ARCHITECTURE.md](ARCHITECTURE.md).

## Problem

Children aged six to ten meet grouping for the first time: "3 parts, 4 in each" as multiplication,
then packs inside parts, gaps to fill, shares to split. Most apps for this age are a quiz with a
cartoon around it. The child types a number, gets a tick or a cross, and the cartoon does something.
The evidence says two things about that. Children learn more when the maths is the mechanic itself.
And an AI that hands over answers makes them worse at working alone once it is gone.

## Users

- **The child**, six to ten. The evidence base is for seven to eleven; the words and voice are pitched at six so the younger end can play. Reading at an early-reader level or not reading yet. Taps, does not
  type. Attention in short bursts. Quits on frustration without a scaffold.
- **The parent**, who controls whether the child comes back, and who wants one thing to say at
  the dinner table, not a dashboard.

## Goals

1. The child can read her own mistake off the fence and fix it with her hands.
2. Every mistake the fence can show is named by code, and the hint she gets is about that mistake.
3. The AI helps without ever giving an answer, and every word it says is checked before she hears it.
4. Progress is visible and earned: stars for mastery, chapters that open, a farm that grows.
5. A parent gets a short note and one question to ask, from the child's real mistakes.

## Non-goals

- Not a chat tutor. No free text in, no conversation.
- Not a general arithmetic app. Grouping and its cousins only: multiplication, units within units,
  subtraction and addition across parts, division.
- Not a rewards economy. No points, coins, streaks or leaderboards; the research says they displace
  the mechanic.
- No accounts, no cloud progress, no analytics on children in this version.
- No voice input, no camera, no biometrics of any kind.

## Requirements

### The game
- R1. The task is stated on a sign in plain words: parts, planks in each part. Never an equation.
- R2. The child places planks by tapping the cart and then a part. Pip says the count that part now
  holds. The cart pulses while her hand is empty and the parts glow while it is full. A wrong build
  stays on screen as built. Nothing is marked wrong, and the count never says "full".
- R3. On Done, or when the last plank goes on, code classifies the build. If it is right, the fence
  is done. If not, the goat walks through the gap and a hint lands on the gap.
- R4. Four chapters on one board: Build, Packs (order packs first), Fix (count the gaps, order
  exactly that many), Share (choose how many parts). Six shapes each. A chapter opens on three gold
  stars in the one before; she moves on once every fence in hers is gold, and is never sent back.
  The last fence of all ends with a star, Pip's last line and Start again.
- R5. How to play is three steps per chapter, read aloud, followed by Pip showing the new move on
  the real board once, pointing with an arrow at what she names. The first sheet says what a part is.
- R6. Every child-facing word passes an early-reader word list (Dolch and Fry sight words plus the game's own nouns). Fixed lines are spoken in a
  child's voice.

### The AI
- R7. Code names the mistake. The model is never asked what went wrong.
- R8. The model is never given a number derived from the fence, except in the worked-example job,
  where its output is a script that code simulates before it runs.
- R9. Every model output passes a lexical gate (no digits, no number words, no affect words, simple
  vocabulary, two sentences at most) and either a semantic judge or a simulator. Any failure ships
  the template. The game is complete with no model at all.
- R10. The child can ask for the same hint said a new way, and after a second hint can ask Pip to
  show her on her own fence. Pip fixes one part and hands the rest back.
- R11. When a fence is finished, praise names what she actually did, from facts, or says nothing
  specific.
- R12. The next fence is chosen from her record, only among fences in her chapter that code says exercise her mistake.

### The parent
- R13. A page with the week's fences, a short note written from the child's mistakes and never from
  a transcript, and one question to ask out loud. No blame words. Nothing invented. The only
  start-over control is here, behind a confirmation.

### Privacy and safety
- R14. Nothing personal leaves the device. No typing, no audio in, no identifiers. Progress is one
  local key.
- R15. The model key lives on the server only, is never logged, and spending is capped per day.

## Success metrics

What we can measure now, and have:
- Classifier: right whenever it commits over 169 hand-written builds; silent, never wrong, when two
  mistakes make the same fence.
- Gate and judge: overturn rates published per run, with the rejected lines.
- Leakage: an attacker given everything the model sees does no better than the majority guess.
- Latency and cost per hint.

What would show it teaches, and has not been run yet:
- Three children, six to nine. Pre-test, post-test, and a check two days later on the grouping
  items, with two control items never taught. Pre-registered: if the post-test gain is not larger on
  the taught items than the control items, we say so. Until this runs, "it teaches" is a design
  claim, not a result.

## Risks

| Risk | What we did | What remains |
|---|---|---|
| The model leaks the answer | No integers in the payload; gate; judge; red-team measured | The gate is lexical; a sentence that points the wrong way relies on the judge, which is a model |
| A child cannot read the hint | Early-reader word list, two sentences, spoken aloud, one voice through the server | Without a voice key the model's fresh lines use the browser's voice |
| The classifier meets a mistake nobody wrote a fixture for | Ambiguity is a first-class verdict with a probe | Real play will find cases; they become fixtures |
| Extrinsic rewards crowd out the mechanic | Stars only for mastery, no points, no streaks | The farm greening is a reward; we think it is the right kind |
| A public link spends the key | Daily cap, per-address limit, own-origin only | The free host sleeps between visits |
| It is engaging but does not teach | Design from the one finding with a learning gain | Only the pilot answers this |

## Open questions

- Does the probe ("Tap a part you think is finished") resolve ambiguity for a seven-year-old, or
  does she tap at random? A simulated seven-year-old, driven by real taps, tapped the part she meant;
  only a real one can answer.
- Is Fix easier or harder than Packs for this age? The chapter order is a guess from the maths, not
  from data.
- Does Pip's worked example transfer, or does the child wait for Pip every time? Silver stars for
  helped fences are the only guard now.

## Roadmap, if this continued

1. The child pilot above. Nothing else matters more.
2. Parent accounts so progress survives a cleared browser; same data, stored server-side.
3. Fixtures from real play, and diagnostic fences for every ambiguous pair.
4. A fifth chapter for remainders, on the same board.
