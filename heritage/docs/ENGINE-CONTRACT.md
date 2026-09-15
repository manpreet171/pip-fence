# ENGINE CONTRACT — `heritage/src/sow.mjs` Part 1 (pure) and the event log

Three builders code against this file. Change it only by editing this file first.

## Board indexing
Pits `0..13`. Her row is `0..6` (left to right as she sees it, near row). The other side's row is
`7..13`, continuing anticlockwise so that pit 6 is followed by pit 7 and pit 13 by pit 0.
Sowing direction is always anticlockwise: `next(p) = (p + 1) % 14`. Stores: `stores[0]` hers,
`stores[1]` the other side's. Side `0` is the child, `1` is code.

## Nodes (the mastery graph, in order)
`2_single, 3_single, 4_single, 6_single, 3_relay, 4_relay` — `<seeds per pit at start>_<single|relay>`.
`shape(node) -> { node, seeds, relay: boolean, four: boolean }` where `four = seeds >= 4`.

## Exports (all pure: no DOM, no Date.now, no Math.random unless an `rng` is passed)
```js
export const GRAPH            // [{node, seeds, relay, four}] in the order above
export function shape(node)
export function newGame(node) // -> { node, pits: number[14], stores: [0,0], side: 0 }
export function legalMoves(state, side)      // pits on that side with seeds > 0
export function landing(state, from)         // where the LAST seed of a move from `from` lands, including relays on relay
                                             // levels: -> { landed, path: number[], hops: number[] }  (hops = landing of each hop)
export function applyMove(state, from, called) // -> { state: newState, path, landed, hops,
                                             //      fours: [{pit, owner}], capture: {pit, seeds, earned} | null }
                                             // `called` is the child's call (or null for code's move); earned = (called === landed)
                                             // when side is 0; for side 1 a capture is always earned.
export function isOver(state)                // true when the side to move has no legal move
export function finish(state)                // remaining seeds go to the side that still has them; -> state
export function classify(events)             // -> { id, tier, confirmed, called, landed, path, node, flags: [] }
export function next(mastery, last)          // first node with mastery < 1; `ambiguous` -> a diagnostic on the same node
export function policy(state, p_best, rng)   // code's move: best one-ply move with prob p_best else random legal; rng() in [0,1)
export const IDS                             // the nine ids below in this order
```
Rules (HD-004): sow one seed per pit anticlockwise from `next(from)`, never skipping, the source pit
emptied first. Relay levels: if the last seed lands in a pit that now holds >1 seed, pick it up and
continue; **at most one relay** (depth one). Pasu: on `four` levels, any pit reaching exactly 4
during sowing is taken by its row's owner at once (fours recorded; that pit becomes 0). Capture at
move end: if `next(landed)` is empty, take `next(next(landed))` if it has seeds (earned only when
`called === landed` for the child). Store increments accordingly.

## IDS
`correct, counted_start_pit, overshot_by_one, stopped_at_corner, stopped_at_first_lap, direction_reversed, miscounted_seeds, guessing, ambiguous`

Definitions on the LAST child move (`pick` … `sow` [… `relay`]), with `called`, `landed`, `path`:
- `correct`: called === landed.
- `counted_start_pit`: called is the pit immediately before `landed` on the path (she counted the source pit as the first drop). For a 1-seed move this coincides with `direction_reversed`… see ambiguous.
- `overshot_by_one`: called === next(landed).
- `stopped_at_corner`: called is a corner (6 or 13) that lies on the path strictly before `landed`.
- `stopped_at_first_lap`: relay levels; called === hops[0] and there was a relay (hops.length > 1).
- `direction_reversed`: called === (from − seeds mod 14), i.e. the clockwise landing, and it differs from the true landing.
- `miscounted_seeds`: called is on the path and |index(called) − index(landed)| ≥ 2 and none of the above.
- `guessing`: across the last three child moves, every call was off the path, OR the same pit was called on the last three moves while the source differed. Overrides everything except `correct`.
- `ambiguous`: two of the above match at once (e.g. `counted_start_pit` and `stopped_at_corner` when landed is one past a corner), or the call is off the path and none match.
Precedence when exactly one matches: that one. Collision → `ambiguous` with `confirmed:false`, then the probe: a `tap_count{pit}` after an `ambiguous` hint resolves — tap on `from` → `counted_start_pit`; tap on next(from) → `stopped_at_corner`; else stays ambiguous.
Tier = 1 + number of prior `hint` events with the same id in this level, max 3.

## Event log (written by the page, read by classify)
```
{t, e:"level_start", node}
{t, e:"pick", pit, seeds}
{t, e:"call", pit}
{t, e:"sow", from, landed, path}          // first hop
{t, e:"relay", from, landed, path}        // second hop, relay levels only
{t, e:"four", pit, owner}
{t, e:"capture", pit, seeds, earned}
{t, e:"tap_count", pit}
{t, e:"hint", id, tier}
{t, e:"turn", side:"code", from, landed}
{t, e:"level_end", stores:[a,b]}
```

## Fixture DSL (evals/classifier_fixtures.json)
`n:<node>` start; `b:<14 comma-separated pit counts>` set the board; `p<pit>` pick; `c<pit>` call; `s` sow (engine computes path/landed and appends sow/relay/four/capture); `t<pit>` tap_count; `h:<id>` hint; `o<pit>` opponent move. Each fixture: `{node, seq, expect, confirmed?, tier?}`.

## Redacted payload shape (to the model; booleans only)
`{ early, late, by_one, past_corner, reversed, relay }` derived from the id — never a pit number, seed count or path.
