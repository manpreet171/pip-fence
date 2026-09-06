> **SUPERSEDED 4 Sep 2026.** v3.1 was revised after REVIEW-R2. Current authority: `docs/CONCEPT-V3.2.md`.

# CONCEPT v3.1 — "the plot is the problem", after Review R1

4 Sep 2026. Day 1 of 14. Answers `docs/REVIEW-R1.md` point by point. Same core idea; six
structural changes. Nothing the review marked strong has been softened, and no confidence flag
from `RESEARCH-LEARNER.md` has been upgraded.

---

## 0. Resolution table

| # | Severity | What changed in v3.1 | Where | Closed? |
|---|---|---|---|---|
| 1 | FATAL | Prompt genuinely redacted: **no integers at all** in the payload. Legal number set for the model's output = **empty**. Plus a red-team eval (frontier model, different family, 60 fixtures, accuracy published against a 1-in-12 chance floor). "Never given" wording dropped. | §3 | **Yes** |
| 2 | FATAL | **Packs.** After the concrete phase the cart delivers planks only in packs, and pack size ≠ planks-per-part, so there is no one-to-one path to a finished fence. Transfer instrument gains symbolic items. | §2, §5 | **Yes** |
| 3 | SERIOUS | "Reuses as-is" deleted. Art proof is a hard 2-hour gate on day 1 with a named fallback beat and a 320px legibility test. | §8 | **Partially** — the gate is real, the outcome is unknown until tonight. |
| 4 | SERIOUS | Classifier runs on the **time-stamped placement sequence** (schema in §4), not the final delta. Tap-to-count is the child's answer channel. Two collisions still resolve to `ambiguous` by design. | §4 | **Yes** — with an honest residual (§10). |
| 5 | SERIOUS | Over-count is **accepted and drawn** (crooked plank overtopping the post). `over_count` and `right_total_wrong_grouping` added. Removal is a logged event, so error persists in both directions. | §2, §4 | **Yes** |
| 6 | SERIOUS | Full instrument: 8 items written out, read-aloud script, 0/1 scoring, 48h retest, falsification line committed before the pilot. | §5 | **Yes** |
| 7 | SERIOUS | A/B demoted to three named case studies. Headline is the deterministic set. Conflict-of-interest sentence is said on camera. | §5, §9 | **Yes** |
| 8 | MINOR | Elo **deleted**. 68 lines of `engine.mjs` replaced by a 12-node mastery graph. Said on camera. | §6 | **Yes** |
| 9 | MINOR | Wording adopted verbatim; MARKET's "narrower than the pitch implies" goes in the video. | §1, §9 | **Yes** |
| 10 | MINOR | Parent weekly summary promoted from stretch to **the** day-2 answer, with its evidence flagged correlational. | §7 | **Yes** |
| 11 | MINOR | Families booked day 1. Written consent + separate film release. Pilot day 9–10, film day 12, hands only. | §8 | **Yes** |
| 12 | MINOR | 15-second template-vs-model split screen on a real build, plus the red-team number. | §9 | **Yes** |
| 13 | MINOR | 20 hints checked against a 500-word list; out-of-list % and mean sentence length published. "Section" is on trial. | §3, §8 | **Yes** |

---

## 1. The insight (revised wording)

One data structure, four readers. When the arithmetic *is* the build (P1, Habgood & Ainsworth),
the placement state **is** the answer; it is also the mastery record (P9), also the only thing the
coach is shown, also the telemetry stream. No translation layer between them.

The mechanic that follows is **error persistence**: a miscount leaves a fence with a hole in it,
standing, repairable, on screen. Not a red X deleted on the frame it appears.

**Lineage, owned.** Intrinsic integration is *Zombie Division*'s, 2011, and it is credited on
camera. Mastery pacing is My Math Academy's. Non-answering AI is Khanmigo's *claim*. Persistent
wrong structures exist already — MARKET.md calls Minecraft Education's block-building "genuinely
intrinsic", and DragonBox leaves an unsolved board standing.

So the claim is exactly this and no larger: **no product we found couples a persistent wrong build
to a *named misconception* and a *published leak rate*.** The gap is narrower than the pitch
implies, and that sentence is in the video.

---

## 2. The mechanic, precisely

**Phase A — concrete (nodes 1–6).** Child taps a plot. A fence frame appears: three empty parts,
posts and a top rail drawn, the situation written on the rail. A cart of loose planks sits at the
end. She takes planks into part one, two, three. Running out or stopping *is* the answer.

**Phase B — packs (nodes 7–12), introduced at the third build.** The cart now delivers planks
**only in packs**. Loose planks are gone. Pack size is a level parameter and is deliberately not
always equal to planks-per-part:

- `3 parts × 4 planks, packs of 4` → 3 packs (easy entry; one pack per part)
- `3 parts × 4 planks, packs of 2` → 6 packs
- `4 parts × 3 planks, packs of 6` → 2 packs

There is no counting path to a finished fence. A pack is one act; the act is multiplicative. A
pack visibly holds its planks (strapped stack), so the concrete support survives — but the
decision "how many packs" cannot be reached by moving planks one at a time, because single planks
no longer exist in this phase. That is the structural property P1 requires, and it is why the
citation transfers.

Packs also kill the ~30-object ceiling, the fifth-fence boredom, and the "strong child has nothing
harder" problem, at zero new art cost.

**Interaction: tap-to-place, not drag.** Tap the cart, tap the part. Identical arithmetic, ~20
lines instead of ~200, and it removes the interface from the list of things that can kill the
pilot (v3 §5a). Drag is an upgrade if day 3 ends early, not a dependency.

**Over-count is accepted, never rejected.** A fifth plank in a four-plank part sits **crooked,
overtopping the post, casting a shadow on the grass**. Twelve planks tipped into part one is a
leaning stack eight planks above the rail with two empty frames beside it. Nothing turns red,
nothing buzzes, nothing pops up. The wrong build stands in both directions or "the wrong build is
visible" is a slogan.

**Repair is symmetrical.** Tapping a placed plank returns it to the cart. That is a logged
`remove` event and a first-class part of the classifier's evidence, not an undo button.

**What persists on screen, per error case** (target `3 parts × 4`):

| Build | What the child sees |
|---|---|
| `[4,4,3]` | Fence stands. Part three has a plank-wide hole at the top. A sheep steps through it into the corn and stays there. |
| `[3,3,3]` | Fence stands, uniformly short — the top rail floats a plank above every part. Reads as a fence with a stripe of sky through it. |
| `[4,0,0]` | One finished part, two bare frames. The sheep walks straight out of the open side. |
| `[5,4,4]` | Complete fence, but part one has a plank sticking out past the post at an angle, with its own shadow. Sheep stays in. |
| `[12,0,0]` | A leaning tower of planks in part one, two bare frames. Sheep out. |

**Tap-to-count.** At any time she can tap a part. Code — not the model — walks the planks one at a
time, highlighting each with a pip: 1, 2, 3, 4. It counts what is already on screen. It never
counts what should be there. The tap is her answer channel (§4).

---

## 3. The AI layer, precisely

Code owns truth. A lookup table maps the placement sequence to `(misconception_id, tier)`. The
model's only job is phrasing. It is not on the critical path.

**The payload. This is the whole prompt input — there are no integers in it.**

```json
{
  "age": 8,
  "reading_level": "500-word list, max 2 sentences",
  "misconception_id": "off_by_one_in_one_group",
  "tier": 1,
  "shape": { "groups": "a few", "one_group_short": true, "all_groups_short": false },
  "nouns": { "group": "part", "unit": "plank", "pack": "pack" },
  "template": "One part of the fence is shorter than the others. Count a full one again.",
  "constraint": "Use no numbers of any kind. Point with words, not digits."
}
```

Counts are absent. Totals are absent. The target is not present in factored form, in
reconstructable form, or at all: `"a few"` is a bucket over {2,3,4,5,6} and `one_group_short` is a
boolean. There is nothing to divide.

**The legal number set is empty.** The gate rejects any output containing a digit `[0-9]` or any
of the 25 number words `zero…twenty, hundred, dozen, half, twice`, ordinal or cardinal. Rejected →
the template ships instead. This is the direct answer to "is the forbidden number 12, 3 or 4?" —
it is all of them and every other one, and the buddy can still speak, because it never needed a
number. The number lives on the object, where the child can see it. Code may render digits (the
rail, the tap-to-count pips); the model may not emit one.

**Output gate**, in order: schema valid (`{tier, misconception_id, text}`, strict) → ≤2 sentences →
zero digits and zero number words → no banned affect words (`sad`, `disappointed`, `miss you`) →
out-of-list word count ≤ 2 against `data/wordlist.txt`. Any failure → template. Templates ship
offline; pulling the cable degrades the buddy, it does not break the game.

**"Answer-blind" now honestly means:** the model is given a misconception label, a boolean shape,
child-facing nouns and a template, and is permitted to emit no numbers. It does not mean the model
is trusted. It means the answer is not derivable from what it holds, *and* we measure that.

**Red-team eval** (90 minutes, day 8). Take the exact serialised prompt for each of 60 fixtures.
Hand it to a frontier model from a different family than the coach (per the self-preference note in
`AI-ARCHITECTURE.md`) with: *"Below is the entire input another model received. Name the target
total and the number of planks still needed."* Publish accuracy against the **1-in-12 chance floor**
(twelve live mastery nodes). A published number with a stated floor beats 0/60 against my own regex,
and it measures the architecture rather than the gate. The gate's 0/60 is still reported — labelled
as what it is: a measurement of the gate.

Model: `claude-haiku-4-5-20251001`, structured output, strict, ~$0.0007/hint, age re-injected every
turn (KIDBench multi-turn degradation, 6–24%). Prefetch on the wrong placement to hide latency.

**Reading level, measured not asserted.** 20 generated hints run against a fixed 500-word list;
publish out-of-list % and mean sentence length. *Section* is very likely not a Year-2 word — the
child-facing noun is on trial on day 1 and defaults to **"part"**.

---

## 4. The classifier, precisely

**Input: the event sequence, not the final delta.**

```json
[ {"t":0,     "e":"level_start", "node":"3x4_concrete"},
  {"t":2140,  "e":"place",   "unit":"plank", "group":0, "n_in_group":1},
  {"t":3010,  "e":"place",   "unit":"plank", "group":0, "n_in_group":2},
  {"t":9880,  "e":"place_failed", "group":2},
  {"t":14200, "e":"tap_count","group":0},
  {"t":31000, "e":"idle"},
  {"t":42300, "e":"remove",  "unit":"plank", "group":1},
  {"t":51100, "e":"commit",  "reason":"left_plot"} ]
```

`commit` fires on leaving the plot, tapping another plot, or 45s idle. Attempts are logged
(`place_failed`), so a fumbled tap is data rather than absence.

**Misconception set:** `off_by_one_in_one_group`, `off_by_one_per_group`,
`counted_groups_as_group_size` (used the "3" on the rail as the per-part count),
`one_group_only`, `over_count`, `right_total_wrong_grouping`, `pack_unit_confusion`
(treated a pack as a single plank — phase B only), `ambiguous`.
**Disengagement states** (Baker proxies, from the same stream, not misconceptions):
`idle_off_task` (>30s gap, no commit), `wheel_spinning` (≥4 place/remove cycles on one group, no
net progress), `rapid_guessing` (median inter-place < 400ms).

**The review's collisions, separated:**

- **`[4,4,3]`** — *off-by-one* vs *failed drag* vs *walked away* vs *"I re-read the 3"*.
  `place_failed` on group 2 immediately before the end → interface, not maths (and it is counted
  in the interface-failure rate we report). Final gap > 30s with no `commit` → `idle_off_task`.
  `commit` within 5s of the last placement → she believes it is finished → misconception.
  Which misconception is then genuinely undecidable from the sequence: `off_by_one_in_one_group`
  and `counted_groups_as_group_size` both predict this exactly. → `ambiguous`.
- **`[3,3,3]`** — *off-by-one-per-group* vs *used the 3*. Weak separator: rule-following shows a
  flat per-group latency profile with no mid-group pause; a miscount shows a hesitation.
  This is a heuristic, and where the two are within margin the classifier says `ambiguous` rather
  than guessing. Flagged **moderate confidence** and reported as such in the confusion matrix.
- **`[4,0,0]`** — *one_group_only* vs *stopped to think*. `commit` → `one_group_only`. Idle with
  no commit → `idle_off_task`. This one separates cleanly.

**"Ask, don't guess" is now an actual channel.** On `ambiguous`, the tier-1 hint is: *"Show me a
part that looks finished."* She taps. The tap is the answer:

- taps a **full** part → she holds a correct reference → `off_by_one_in_one_group` confirmed,
  escalate to a repair hint.
- taps the **short** part as "finished" → `counted_groups_as_group_size` confirmed; the tap-count
  animation runs on that part and on a full one, side by side.
- taps nothing within 20s → tier escalates on the more likely branch, and the classification is
  logged as **unconfirmed** in the harness.

**Eval:** 60 hand-written `(sequence) → expected_id` fixtures, published as a confusion matrix
with `ambiguous` as its own row and column. A classifier that says "I don't know" 15% of the time
and is right 100% of the rest is a better artefact than one that is right 85%.

---

## 5. Measurement, precisely

### The instrument — `docs/TRANSFER-TEST.md`, written day 8, before any child sees it

Paper and pencil. No device, no game. Trained shapes in the pilot session are **3×4, 4×5, 6×2**;
no item repeats one. Same adult reads every item aloud, verbatim from the script below, once,
repeated once on request. No hints, no feedback, no second attempt. 60s per item. The child may
say or write the answer; the scorer records the number only.

**Symbolic (shown on the card, read aloud as printed):**
1. `2 × 6 = □`
2. `5 × 3 = □`
3. `□ × 4 = 8`
4. `4 × 6 = □`

**Worded (read aloud, not shown):**
5. "There are 5 plates. Each plate has 3 buns. How many buns altogether?"
6. "18 pencils go into boxes. Each box holds 6. How many boxes?"
7. "A bike has 2 wheels. How many wheels on 7 bikes?"
8. "4 children each have 6 stickers. How many stickers altogether?"

**Scoring:** 0/1 per item, no partial credit, total /8. **Timing:** immediately after the session,
and again at **48h**, same 8 items, order reshuffled, same script, same adult.

**Falsification line, committed now, before the pilot:**
> If the integrated arm's mean is not at least 1 item above the tollgate arm on the immediate
> post-test, or that gap is not preserved at 48h, we report in the video, in these words, that
> build-is-the-problem showed **no measurable near-transfer advantage in this pilot**.

At n=3 per arm no inference is possible and we say so first, not last. The instrument's value is
that it exists, is specified, and was run.

### The headline is the deterministic set

Classifier accuracy with a confusion matrix over 60 fixtures · red-team recovery rate vs the
1-in-12 floor · gate leak rate 0/60 (labelled: this measures the gate) · reading-level check over
20 hints · p50/p95 latency · cost per hint · interface-failure rate. None of these are
underpowered, and knowing which numbers are which is the signal.

### The pilot is three named case studies

Not an A/B. Reported per child, raw, with what each one actually did. On camera, verbatim:

> "The control arm is my own earlier build, which is a conflict of interest."

---

## 6. The adaptive engine decision (#8)

**Deleted.** `sigmoid`, `updateAbility`, `selectDifficultyAdaptive`, the two baseline selectors and
`generateProblem`'s six tiers all go. Tiers 4–6 emit two-digit × two-digit, which is unbuildable
under this mechanic; what remains is about ten live shapes, and a continuous Rasch scale over ten
items is a lookup table wearing a lab coat.

Replacement: a **12-node mastery graph** — 6 shapes {2×3, 3×3, 3×4, 4×3, 4×5, 6×2} × 2 modes
{concrete, packs}, with `packs(s)` requiring `concrete(s)`. Mastery = two consecutive first-try
correct builds on a node. ~25 lines. Agency is unchanged: the child always picks *which* building,
may take an unmastered harder one, and is never silently lowered below the floor — that surfaces in
the parent view (`RESEARCH-LEARNER` §3b).

**On camera:** *"I deleted my own adaptive engine. At this scope it was theatre — sixty-eight lines
of Elo choosing between ten problems. It's a twelve-node graph now."*

---

## 7. Day 2 and the parent (#10)

Retention is not left silent, and it is not solved with a nudge loop — Children's Code Standard 13
and Lepper 1973 both close that door, and closing it is a decision we defend rather than a gap.

**The answer is the parent, because parents control return** (`RESEARCH-LEARNER` §1). One screen,
local data, no account, opened by the parent: what was mastered this week, the named misconception
still open, and **one question to ask out loud** — the Tutor CoPilot shape (P5: +4pp, +9pp for the
weakest tutors), pointed at the adult, not the child.

> "Aanya finished four fences this week. She is still counting the parts instead of what goes in
> each part. Ask her: *show me one full part.*"

**Flagged honestly, unchanged from §7 of the research:** parent co-use → gains is *correlational*;
no controlled study shows creation/ownership mechanics cause return in 6–12. This is a reasoned
bet, and the product is a ~20-minute sitting by design.

---

## 8. The revised 14-day plan

| Day | Work |
|---|---|
| **1 (4 Sep)** | **Art proof, 2h hard gate.** Composite a 3-part fence from a rail + posts + flat SVG plank quads over the Kenney ground tile; pack = existing `planksSide_E.png`; sheep = hand-drawn SVG. **Test: screenshot at 320px — can a naive viewer point at the wrong part in under 2 seconds?** Fail → fallback beat A: short corn row (`cornYoungDouble` vs `cornDouble`, both already in `assets/farm/`). Fail again → fallback B: drop the iso pack, flat 2D planks. Sheep fails → a hay bale rolls out through the gap (`hayBalesStacked`). Same day: book three families; consent + film-release forms out. Child-facing noun word-list check. |
| 2 | Decision locked and written to `DECISIONS.md`. Tap-to-place, plot hit-testing, one fence end to end. |
| 3 | Gap / over-count / leaning-stack rendering; remove-to-cart; sheep path. 320px re-check. |
| 4 | Event log + `commit` semantics + tap-to-count. Delete Elo → 12-node graph. |
| 5 | Classifier over the sequence; 60 fixtures; confusion matrix. |
| 6 | Packs mode. `coach.mjs` rewritten — this is the *deletion*: `The correct answer is ${problem.answer}` and `answerLeaked()` both go; redacted payload + zero-digit gate + templates replace them. |
| 7 | Haiku phrasing call, prefetch, offline-template proof, reading-level check over 20 hints. |
| 8 | Red-team eval; latency/cost table; `docs/TRANSFER-TEST.md` written and printed. |
| **9–10** | **Pilot, three children, written consent held.** Tollgate arm = the current build, unmodified. |
| 11 | Parent weekly summary; 48h retests. |
| **12** | **Film — hands only.** No faces, no names, no child voice (voiceprints are personal information under the amended COPPA — the same reason we refused the mic). |
| 13 | Edit to under 3:00. README. |
| 14 | Buffer. Submit 18 Sep. |

**First thing likely to slip: days 2–3.** The repo has never implemented a drag, `village.mjs`
renders 10 hardcoded slots with no hit-testing, and `iso()` has no inverse. That is why the
interaction is tap-to-place: it needs only the forward transform and a bounding box per part.
If day 3 overruns, the sheep becomes a static sprite that is simply *outside* the fence rather than
animated through the gap, and packs move to day 7.

---

## 9. The demo

**The 20-second beat.** The wrong build is on screen inside twenty seconds — if the fence completes
correctly first, this is Math Town. Aanya takes packs. The fence stands with a plank-wide hole. The
sheep steps through into the corn. Nothing red, nothing buzzing, no modal. Text appears **on the
gap**: *"One part of the fence is shorter than the others. Count a full one again."* She taps a full
part; the pips count 1-2-3-4. She takes one more plank. The hole closes. The sheep walks back.
Cut to the same problem in the tollgate build: red X, farm unchanged.

**The 15 seconds that answer "is this an AI product?"** Split screen, one real build state: left,
the template; right, Haiku's phrasing of the same `misconception_id`. Under both, the red-team
number and the 1-in-12 floor.

**Said aloud, in the voiceover:**
- "The mechanic is Zombie Division's, from 2011. It is credited."
- "The control arm is my own earlier build, which is a conflict of interest."
- "I deleted my own adaptive engine because at this scope it was theatre."
- "The gap between this and what already ships is narrower than the pitch implies."
- "This is a Year 2–4 grouping tool, not a general arithmetic tutor."
- "n=3. No p-value. Three case studies, and a null if that is what we got."

("Teach the Buddy died because a buddy that *needs* the child is a buddy expressing need" goes in
the README — it is the right decision and the wrong use of nine seconds.)

---

## 10. What is still uncertain — please re-check these

1. **The `[3,3,3]` split is a latency heuristic.** `off_by_one_per_group` and
   `counted_groups_as_group_size` may not separate at all. If the confusion matrix on day 5 shows
   them collapsing, the honest move is to merge them into one node and shrink the misconception
   set — not to keep two labels a tap cannot distinguish either.
2. **Art is unproven until tonight.** Everything in §2 assumes a plank, a gap and a sheep read at
   320px. The fallback is named, but a fallback is a worse demo.
3. **Packs may be too abstract at 7.** The concrete phase is the mitigation and pack size 4 with
   4-plank parts is the gentle entry, but no citation in `RESEARCH-LEARNER` speaks to unitising at
   this age. Watch it in the day-9 pilot specifically; if a child treats a pack as one plank,
   `pack_unit_confusion` is the diagnosis and the concrete phase gets longer.
4. **The red-team number could be embarrassing.** If a frontier model recovers the target well
   above the 1-in-12 floor from `{"a few", one_group_short}` plus the template text, the template
   itself is the leak and the templates need rewriting, not the payload. We publish it either way.
5. **The 48h retest depends on three families being available twice.** Booked day 1; if one drops,
   it is two case studies, said plainly.
6. **The word-list check may reject the templates I have already written.** Three of the hint
   sentences above use "shorter" and "altogether". If they fail, the templates change and the
   examples in this document are wrong — the list wins, not the prose.
