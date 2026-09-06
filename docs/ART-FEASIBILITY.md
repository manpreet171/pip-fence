# ART FEASIBILITY — can the demo beat actually be drawn? (4 Sep 2026)

The review (REVIEW-R1 #3) said: prove the plank / gap / sheep art on day 1, or change the beat.
Done today, with the actual CC0 sprites on disk, rendered at demo scale and inspected.

## What is in hand (all Kenney, CC0)

| Need | Status | Asset |
|---|---|---|
| A plank as a draggable **unit** | ✅ in hand | `planks_E.png` — a clean isometric plank slab, reads well at 160px |
| A **fence section** | ✅ in hand | `fenceHigh_E.png` (also `fenceLow`) |
| A **visibly wrong / missing-plank floor** | ✅ in hand, **very legible** | `planksHole_E.png` — a dark missing patch, unmistakable at 160px |
| A "broken" fence section | ⚠️ in hand but **not legible** | `fenceHighBroken_E.png` — at 160px it is nearly identical to the whole fence; the break is too subtle to carry a demo beat |
| A **farm animal** to escape through the gap | ✅ in hand (not a sheep) | Kenney *Animal Pack Redux* (249 PNG, CC0): chicken, goat, cow, pig, duck, horse in 8 styles. **No sheep exists in any Kenney pack.** Flat, stylised — acceptable over an iso field (Kenney's own style) |

## What the probe showed (rendered at 320px, the demo width)

A 3-section fence composed as *whole + whole + broken* does **not** read as "one section is
wrong." The eye sees three fences.

Two things that DO read instantly:
1. **Absence.** Render only two of three sections — the gap is empty ground. A goat standing in
   the empty third slot makes it unmissable.
2. **A hole.** `planksHole` on a plank floor is a visible, repairable defect — the child drags a
   plank *into the hole*.

## Decision for the mechanic (feeds CONCEPT-V3.1 §2 and §8)

- The **gap state is rendered as a missing section, not a damaged one.** A short fence is two
  sections plus bare ground; the animal walks into the bare ground. No new art needed.
- **Over-count** (R1 #5) needs its own visible state: a plank that sticks out past the post
  — draw once as a small SVG overlay on the last section, or use a plank sprite offset beyond the
  post. Not yet drawn; it is the one remaining art item (est. 1–2 h).
- The escaping animal is a **goat or chicken**, not a sheep. The concept text must say goat.
- `planksHole` gives a second, cheap build type (a plank floor / bridge deck) whose wrong state is
  a hole — a natural place for the *Repair Yard* level type if it survives the pilot.

## Still to draw / prove (honest residual)
- The over-count sprite (sticks-out plank). 1–2 h.
- A bundle-of-4 sprite for the bundles phase (R1 #2): a stack of 4 planks — `hayBalesStacked`
  is a workable stand-in visually; a proper 4-plank bundle is ~1 h of compositing.
- Drag/tap hit-testing on the iso grid (`village.mjs` has no inverse of `iso()`) — engineering,
  not art; ~1 day (R1 #3 estimate stands).

Files: probe page `src/public/artprobe.html`; fence/plank sprites `src/public/assets/probe/`;
animals **copied into the project** at `src/public/assets/animals/{goat,chicken,cow,pig}.png`
(20 KB total; goat 184×171, chicken 128×145).
