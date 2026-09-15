// sow.mjs — Kuzhi: call the pit before the seeds move.
//
// Part 1 (this section) is pure: no DOM, no Date.now, randomness only through a passed rng, so
// `node` imports it for the fixtures eval and the rules test. Part 2 (DOM) is appended by the board
// builder below the `// ---- Part 2: DOM ----` marker at the end of this section, in exported
// functions only. The contract is docs/ENGINE-CONTRACT.md.

export const IDS = ["correct", "counted_start_pit", "overshot_by_one", "stopped_at_corner", "stopped_at_first_lap",
  "direction_reversed", "miscounted_seeds", "guessing", "ambiguous"];

// Six nodes: seeds per pit at the start, single lap or one relay. Pasu (four) is live from 4 seeds up.
export const GRAPH = [[2, "single"], [3, "single"], [4, "single"], [6, "single"], [3, "relay"], [4, "relay"]]
  .map(([seeds, kind]) => ({ node: `${seeds}_${kind}`, seeds, relay: kind === "relay", four: seeds >= 4 }));
export const shape = node => GRAPH.find(g => g.node === node);

const N = 14, nx = p => (p + 1) % N, owner = p => p < 7 ? 0 : 1;   // 0..6 hers (near row), 7..13 code's

export const newGame = node => ({ node, pits: Array(N).fill(shape(node).seeds), stores: [0, 0], side: 0 });
export const legalMoves = (s, side) => [...Array(7)].map((_, i) => i + 7 * side).filter(p => s.pits[p] > 0);

// One move by state.side from `from` (HD-004): empty the pit, drop one seed per pit anticlockwise,
// never skipping; a pit reaching exactly four on a four level goes to its row's owner at once; on a
// relay level a last seed landing in a pit that now holds more than one picks it up once more; at
// the end, an empty next pit takes the pit beyond it — hers only when `called` was the landing.
export function applyMove(state, from, called) {
  const { relay, four } = shape(state.node), pits = state.pits.slice(), stores = state.stores.slice(), side = state.side;
  const path = [], hops = [], fours = [];
  let p = from, hand = pits[from];
  pits[from] = 0;
  for (let hop = 0; ; hop++) {
    while (hand-- > 0) {
      p = nx(p); pits[p]++; path.push(p);
      if (four && pits[p] === 4) { fours.push({ pit: p, owner: owner(p) }); stores[owner(p)] += 4; pits[p] = 0; }
    }
    hops.push(p);
    if (!relay || hop || pits[p] < 2) break;
    hand = pits[p]; pits[p] = 0;
  }
  let capture = null;
  const c = nx(nx(p));
  if (pits[nx(p)] === 0 && pits[c] > 0) {
    const earned = side === 1 || called === p;
    capture = { pit: c, seeds: pits[c], earned };
    if (earned) { stores[side] += pits[c]; pits[c] = 0; }
  }
  return { state: { ...state, pits, stores, side: 1 - side }, path, landed: p, hops, fours, capture };
}

export function landing(state, from) { const { landed, path, hops } = applyMove(state, from, null); return { landed, path, hops }; }
export const isOver = s => legalMoves(s, s.side).length === 0;
export function finish(s) {
  const stores = s.stores.slice();
  s.pits.forEach((n, p) => stores[owner(p)] += n);
  return { ...s, pits: Array(N).fill(0), stores };
}

// The child's completed moves in the log: {from, seeds, called, path, hops, landed, end}, where `end`
// is the index of the move's last sow/relay event. A pick without a sow yet is not a move.
function moves(events) {
  const out = []; let m;
  events.forEach((e, i) => {
    if (e.e === "pick") out.push(m = { from: e.pit, seeds: e.seeds, path: [], hops: [], end: i });
    else if (!m) return;
    else if (e.e === "call") m.called = e.pit;
    else if (e.e === "sow" || e.e === "relay") { m.path.push(...e.path); m.hops.push(e.landed); m.landed = e.landed; m.end = i; }
  });
  return out.filter(m => m.hops.length && m.called !== undefined);
}

// classify(events) -> { id, tier, confirmed, called, landed, path, node, flags }
// Code owns truth: arithmetic on the last call against the path the seeds took. No I/O, no model.
export function classify(events) {
  const node = events.find(e => e.e === "level_start")?.node;
  const ms = moves(events), m = ms.at(-1), hints = events.filter(e => e.e === "hint");
  const tier = id => Math.min(3, 1 + hints.filter(h => h.id === id).length);
  const out = (id, confirmed = true) => ({ id, tier: tier(id), confirmed, called: m?.called, landed: m?.landed, path: m?.path, node, flags: [] });
  if (!m) return out("in_progress", false);
  const { from, seeds, called, path, hops, landed } = m;
  if (called === landed) return out("correct");
  // Not counting: three calls off the path in a row, or the same pit called three times from different pits.
  const l3 = ms.slice(-3);
  if (l3.length === 3 && (l3.every(x => !x.path.includes(x.called)) || (l3.every(x => x.called === called) && new Set(l3.map(x => x.from)).size > 1)))
    return out("guessing");
  const walk = [from, ...path], li = walk.lastIndexOf(landed) - 1, ci = path.indexOf(called);   // indices on the path
  const hit = [];
  if (walk[li] === called) hit.push("counted_start_pit");                                       // the pit before the landing (the source itself on a 1-seed move)
  if (called === nx(landed)) hit.push("overshot_by_one");
  if (hops.length > 1 && called === hops[0]) hit.push("stopped_at_first_lap");
  // A corner where the first hop stopped is read as the relay stop, not the corner (HD-007): her count was exact.
  if ((called === 6 || called === 13) && ci >= 0 && ci < li && !hit.includes("stopped_at_first_lap")) hit.push("stopped_at_corner");
  if (called === ((from - seeds) % N + N) % N) hit.push("direction_reversed");
  if (!hit.length && ci >= 0 && Math.abs(ci - li) >= 2) hit.push("miscounted_seeds");
  if (hit.length === 1) return out(hit[0]);
  if (hit.length > 1) {   // the probe: after an ambiguous hint, "show me where your first seed goes"
    const hi = events.findLastIndex(e => e.e === "hint" && e.id === "ambiguous");
    const tap = hi > m.end ? events.slice(hi).find(e => e.e === "tap_count") : null;
    const r = tap && { [from]: "counted_start_pit", [nx(from)]: "stopped_at_corner" }[tap.pit];
    if (r && hit.includes(r)) return out(r);
  }
  return out("ambiguous", false);
}

// First node not yet mastered; an ambiguous result stays on the same node, where the page lays out a
// diagnostic board whose landings avoid the corners.
export const next = (mastery, last) => last?.id === "ambiguous" ? last.node : GRAPH.find(g => (mastery[g.node] || 0) < 1)?.node ?? null;

// Code's move (HD-005): with probability p_best the best one-ply move by store difference (captures
// and fours, its own minus hers; ties to the lowest pit), otherwise a random legal move. rng() in [0,1).
export function policy(state, p_best, rng) {
  const side = state.side, legal = legalMoves(state, side);
  if (!legal.length) return null;
  if (rng() >= p_best) return legal[Math.floor(rng() * legal.length)];
  const gain = from => { const s = applyMove(state, from, null).state.stores; return s[side] - s[1 - side]; };
  return legal.reduce((a, b) => gain(b) > gain(a) ? b : a);
}

// ---- Part 2: DOM ----
