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
export function next(mastery, last)          // first node with mastery < 1; `ambiguous` -> the same node again (the page lays out the diagnostic board)
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
- `counted_start_pit`: called is the pit immediately before `landed` on the path (she counted the source pit as the first drop; on a 1-seed move that pit is `from` itself). It never coincides with `direction_reversed` (2·seeds ≡ 1 mod 14 has no solution); the collision that does occur is with `stopped_at_corner`, see ambiguous.
- `overshot_by_one`: called === next(landed).
- `stopped_at_corner`: called is a corner (6 or 13) that lies on the path strictly before `landed`.
- `stopped_at_first_lap`: relay levels; called === hops[0] and there was a relay (hops.length > 1). When hops[0] is a corner this outranks `stopped_at_corner` (HD-007): her count of the first hop was exact.
- `direction_reversed`: called === (from − seeds mod 14), i.e. the clockwise landing, and it differs from the true landing.
- `miscounted_seeds`: called is on the path and |index(called) − index(landed)| ≥ 2 and none of the above.
- `guessing`: across the last three child moves, every call was off the path, OR the same pit was called on the last three moves while the source differed. Overrides everything except `correct`.
- `ambiguous`: two of the above match at once (e.g. `counted_start_pit` and `stopped_at_corner` when landed is one past a corner), or the call is off the path and none match.
Precedence when exactly one matches: that one. Collision → `ambiguous` with `confirmed:false`, then the probe: a `tap_count{pit}` after an `ambiguous` hint resolves — tap on `from` → `counted_start_pit`; tap on next(from) → `stopped_at_corner`; else stays ambiguous. The probe only resolves to an id that matched (an `overshot_by_one`/`direction_reversed` collision, possible on relay boards, stays ambiguous).
Before the first completed child move of a level (no `pick`…`sow` yet) classify returns `{id:"in_progress", confirmed:false}`; the page never hints on it.
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

---

## Revision 2 (16 Sep 2026, after PRODUCT-REVIEW W1, W3, W5, W8) — supersedes the conflicting lines above

### A stake on every call
A wrong call costs a seed: **the last seed of her move goes to the other side's store instead of the
landing pit** (the seed visibly flies past the marker to the far store). The landing pit is then one
seed lighter than the path predicts; relay and capture are computed from the board as it is after
that loss. A right call sows normally and keeps any capture. `applyMove` returns `lost: boolean`
and the event `sow` carries `lost`. Code's moves never lose a seed. `guessing` still silences the hint
and the note, but the seed is still lost — that is the consequence at seven.

### The attested relay
Relay is from the **next** pit, as in Pallanguzhi and Ali Guli Mane (RESEARCH-INDIA §3): when the
last seed lands, look at `next(landed)`; if it holds seeds, pick it up and sow on (depth one, relay
levels only); if it is empty, capture `next(next(landed))` if it has seeds. `landing()` and
`hops` follow the same rule. `stopped_at_first_lap` = called === hops[0] when a relay followed.

### The ladder: two more question kinds
Nodes, in order: `2_single, 3_single, 4_single, 6_single, 3_relay, 4_relay, 4_count, 6_count, 4_even, 6_even`.
`shape(node) -> { node, seeds, kind: "single"|"relay"|"count"|"even", relay, four }` with
`relay = kind === "relay"`, `four = seeds >= 4`.
- **count**: after calling the pit she also calls **how many seeds that pit will hold after the sow**
  (`call{pit, count}`; the page offers a strip of seed silhouettes to tap, never digits). Right pit
  and right count → normal; wrong count with the right pit → the seed is lost as above. Ids:
  `count_low_by_one` (count === actual − 1: forgot the seed that lands), `count_high_by_one`,
  `count_off` (|diff| ≥ 2), evaluated only when the pit was right; a wrong pit is classified by the
  pit rules first.
- **even**: the Toguz Korgool capture — when the last seed makes the landing pit hold an **even**
  number, she captures that pit (replaces the beyond-the-empty-pit capture on these levels). She
  calls the pit and whether it will be even or odd (`call{pit, parity:"even"|"odd"}`). Ids:
  `parity_wrong` (right pit, wrong parity). A wrong pit is classified by the pit rules first.

### IDS (revision 2)
`correct, counted_start_pit, overshot_by_one, stopped_at_corner, stopped_at_first_lap, direction_reversed, miscounted_seeds, count_low_by_one, count_high_by_one, count_off, parity_wrong, guessing, ambiguous`

### Difficulty is tuned, not asserted
`evals/policy_sim.mjs` plays 2,000 games per level between `policy(p_best)` and a child model that
picks a random legal pit and always calls right; `p_best` is chosen per level so that child wins
45–55%; the chosen values live in `GRAPH[i].p_best` and HD-012 carries the table.

### Fixture DSL additions
`c<pit>:<count>` calls a pit and a count; `c<pit>:even` / `c<pit>:odd` calls a pit and a parity.

### As built (HD-012) — where the engine deviates from the lines above
- `applyMove(state, from, called)`: `called` is `{pit, count?, parity?}`, a bare number (the pit) or `null` (code).
  Returns `{state, path, landed, hops, fours, capture, lost, held}`; **`held`** is what the landing pit held as the
  last seed dropped, the answer to the count and parity questions. The `sow` event carries `lost` and `held`
  (the classifier needs `held` to tell `count_low_by_one` from `count_off`; it has no board).
- The lost seed is the last seed of the **whole** move (after a relay); relay and pasu are decided on the board as
  it stands, so a lost seed can leave a pit at four, which pasu then takes. A wrong call also forfeits the capture
  (`earned:false`, seeds stay), as before. On a count or even level a call with no count/parity is a wrong call.
- The relay picks up `next(landed)` whether or not the landing pit was empty, and sows on from the pit after it;
  the pickup pit is not on `path`. The `relay` event's `from` is the pickup pit. A call on the pickup pit is off
  the path (`ambiguous`); on a one-seed relay hop the pickup pit is the fencepost (`counted_start_pit`).
- Even levels: the capture is judged on `held` (even → the landing pit is the capture), earned only by a right
  call; pasu at four comes first, so a pit reaching four is a pasu, not an even capture; no beyond-the-empty
  capture on these levels; any pit counts (Toguz Korgool's own-row exclusion not adopted). Code captures too.
- On count levels a landing pit that reaches four reads `held = 4` (then pasu takes it).
- `policy(state, p_best = shape(state.node).p_best, rng)`.
- The sweep runs `p_best` 0.0–1.0 (not 0.3–1.0): every value from 0.2 up leaves the random-picking child under 40%.
  Chosen: 0.0 on eight levels, 0.1 on `4_relay` and `6_even`. Draws count half; games are capped at 400 moves.
