# MODES — Fix the fence, Share it out, chapters, Pip cheers (18 Sep 2026, D-078)

Two new level kinds on the same board, a chapter map, and one more model job. Every builder codes to
this file. Nothing here changes the concrete and packs levels or their classifier ids.

## Nodes
Chapters in order: **Build** (the six `_concrete` nodes), **Packs** (the six `_packs`), **Fix** (six
`_fix`), **Share** (six `_share`). Same six shapes each: 2x3, 3x3, 3x4, 4x3, 4x5, 2x5.
`shape(node)` gains `mode: "concrete" | "packs" | "fix" | "share"` and `chapter: 0..3`.
A chapter unlocks when the previous chapter has three gold stars (mastery 1). `next()` respects locks.

## Fix the fence (`<g>x<p>_fix`) — subtraction per part, addition across parts
The level starts with the frame built and some planks already in place, chosen so at least two parts
are short by different amounts and the total missing is between 3 and per×groups−2. Example on 3x4:
`[2,4,1]`, missing `[2,0,3]`, total 5. The cart is EMPTY. She taps the order slip once per plank she
thinks is missing (silhouettes, no digits), taps DELIVER once, no top-up (the packs rule), then
places. Events: `order{planks}` then the usual `place`. Ids, evaluated at commit:
- `correct` — every part full.
- `ordered_short` — ordered fewer than the total missing (and placed them all).
- `ordered_over` — ordered more than the total missing; the surplus is left in the cart.
- `counted_present_not_missing` — ordered exactly the number of planks already standing.
- `fixed_one_part_only` — ordered exactly one part's shortfall and filled only that part.
- `ambiguous` — none uniquely.
Templates (tier 1): "Count the empty spaces in each part, not the planks that are there." /
"You ordered more than the gaps. Count the gaps again." / "You counted the planks that are there.
Count the gaps." / "Only that part is fixed. Look at the other parts." (Backend writes the final
gate-checked lines; these are the meanings.)

## Share it out (`<g>x<p>_share`) — division
The sign says "12 planks · parts of 4 · how many parts?" The frame starts with NO parts: two end
posts only. A wooden **+ part** control adds a part frame (posts and an empty slot) and **– part**
removes the last; the cart holds exactly the total. When she taps DELIVER-style **Build**, the frame
locks and she fills as in concrete mode. Events: `parts{n}` then `place`. Ids at commit:
- `correct` — n === groups and every part full.
- `parts_equal_total` — n === total (one plank per part).
- `parts_equal_per` — n === per (confused the two numbers).
- `parts_one_short` / `parts_one_over` — n === groups ∓ 1 (leftover planks in the cart, or a bare part).
- `ambiguous` — none uniquely.
Templates: "One plank in every part is not sharing. Each part needs a full set." / "You built as
many parts as planks in a part. Look at the sign again." / "There are planks left in the cart. Another
part is needed." / "A part is bare. Too many parts for the planks."

## Progression and reward
- The level strip in the sign shows the current chapter's six dots; the home page shows all four
  chapters as a map with locks, gold and silver stars, and the next level pointed at.
- The home page's plot greens up: one corn row per gold star, a hay bale per chapter completed.
- Badges add: "Fixer" (a fix level mastered), "Fair shares" (a share level mastered),
  "Chapter two" (packs unlocked), "Farmhand" (all four chapters unlocked).

## Pip cheers (buddy.mjs job `cheer`)
On a finished fence, the page sends a validated summary, booleans only:
`{ first_try, used_hint, fixed_after_count, mode: "build"|"packs"|"fix"|"share", chapter_done }`.
`cheer(summary)` → `{ text, source }`: one sentence, no digits, no number words, no "wrong/bad",
through the hint gate and the judge, template fallback per case (e.g. "You counted a full part and
fixed the short one. That is how it is done."). The card shows it with Pip's face and speaks it.
Never called when `used_hint && !fixed_after_count` is the only fact (nothing specific to praise:
the template says "The fence is done." as now).

## Templates as built
The eight ids' lines, tier 1 to 3, as they stand in `data/hints_v2.txt` and `TEMPLATES` (gate-checked:
two sentences at most, no digits or number words, the 500-word list). The page reads `TEMPLATES[id]`;
there is no second copy in the page.

| id | tier | line |
|---|---|---|
| `ordered_short` | 1 | Not every gap is filled. Count the empty spaces in each part again. |
| `ordered_short` | 2 | Look at each part. Count the empty spaces, not the planks that are there. |
| `ordered_short` | 3 | Count the empty spaces in every part. Add them all up, then order that many planks. |
| `ordered_over` | 1 | There are planks left over in the cart. Count the empty spaces again. |
| `ordered_over` | 2 | You ordered more than the gaps. Look at each part and count only the empty spaces. |
| `ordered_over` | 3 | Count the empty spaces in each part. Order only those and nothing more. |
| `counted_present_not_missing` | 1 | You counted the planks that are there. Count the empty spaces instead. |
| `counted_present_not_missing` | 2 | The planks that stand are done. The gaps are what the fence needs. |
| `counted_present_not_missing` | 3 | Point to each empty space in a part. Count those, not the planks that are up. |
| `fixed_one_part_only` | 1 | Only that part is fixed. Look at the other parts. |
| `fixed_one_part_only` | 2 | The other parts still have gaps. Count the empty spaces in every part. |
| `fixed_one_part_only` | 3 | Count the empty spaces in each part. Add all the parts together before you order. |
| `parts_equal_total` | 1 | Every part is too thin. Each part needs its full set of planks. |
| `parts_equal_total` | 2 | Look at the sign. It says how many planks go in each part, not how many parts. |
| `parts_equal_total` | 3 | Take the extra parts away. Fill a part up to the top of its post, then make the others like it. |
| `parts_equal_per` | 1 | You made as many parts as planks in a part. Look at the sign again. |
| `parts_equal_per` | 2 | The sign says how many planks go in each part. How many parts is a different question. |
| `parts_equal_per` | 3 | Fill a part up to the top of its post. Keep adding parts until the cart is empty. |
| `parts_one_short` | 1 | There are planks left in the cart. Another part is needed. |
| `parts_one_short` | 2 | Every part is full but the cart is not empty. Add a part for the planks that are left. |
| `parts_one_short` | 3 | Tap add part. Then put the planks that are left on the new part. |
| `parts_one_over` | 1 | A part is bare. There are too many parts for the planks. |
| `parts_one_over` | 2 | The cart is empty but a part has nothing on it. Take that part away. |
| `parts_one_over` | 3 | Tap take a part away. Then check that every part is full up to its post. |

## As built (D-078)
- Fix pre-fill table, per shape: `2x3 [2,0] · 3x3 [2,3,1] · 3x4 [2,4,1] · 4x3 [3,1,3,0] · 4x5 [3,5,1,5] · 2x5 [2,4]`.
- In fix, `counted_present_not_missing` and `ordered_over` are read from the order alone (the packs rule);
  `fixed_one_part_only` before `ordered_short`; a right order and, in share, the right part count fall
  through to the concrete ids for the placing. Ordered short with planks still in the cart: `ambiguous`.
- Share: `per = groups+1` (2x3, 3x4, 4x5) and `per = groups-1` (4x3) make two ids name one fence, so
  those are `ambiguous`; an ambiguous share routes to `2x5_share`. Parts cap at eight on the page.
- Chapter done = all six levels finished, gold or silver. Sign line in share: "12 planks · parts of 4 ·
  how many parts?"; in fix: "3 parts · 4 planks in each part · fix the fence". "Order again" is
  "Build again" in share and keeps the parts she framed.
