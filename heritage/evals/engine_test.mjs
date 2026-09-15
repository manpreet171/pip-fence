// The rules themselves, asserted. Run: node heritage/evals/engine_test.mjs
import assert from "node:assert/strict";
import { GRAPH, IDS, applyMove, finish, isOver, landing, legalMoves, newGame, next, policy, shape } from "../src/sow.mjs";

let n = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); n++; };
const eq = (a, b, msg) => { assert.deepEqual(a, b, msg); n++; };
const seeded = (s = 7) => () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x80000000; };
const withPits = (node, pits, side = 0) => ({ ...newGame(node), pits, side });
const fill = (v, over = {}) => Array.from({ length: 14 }, (_, i) => over[i] ?? v);

// graph
eq(GRAPH.map(g => g.node), ["2_single", "3_single", "4_single", "6_single", "3_relay", "4_relay", "4_count", "6_count", "4_even", "6_even"], "node order");
eq(GRAPH.filter(g => g.four).map(g => g.node), ["4_single", "6_single", "4_relay", "4_count", "6_count", "4_even", "6_even"], "four from 4 seeds up");
eq(GRAPH.filter(g => g.relay).map(g => g.node), ["3_relay", "4_relay"], "relay levels");
eq(GRAPH.map(g => g.kind), ["single", "single", "single", "single", "relay", "relay", "count", "count", "even", "even"], "kinds");
ok(GRAPH.every(g => g.p_best >= 0 && g.p_best <= 1), "every node carries a p_best");
eq(IDS.length, 13, "thirteen ids");
eq(next({ "2_single": 1, "3_single": 0.5 }, null), "3_single", "next: first unmastered");
eq(next({}, { id: "ambiguous", node: "4_single" }), "4_single", "next: ambiguous stays on the node");
eq(next(Object.fromEntries(GRAPH.map(g => [g.node, 1])), null), null, "next: all mastered");

// a fresh board
const g = newGame("2_single");
eq(g, { node: "2_single", pits: fill(2), stores: [0, 0], side: 0 }, "newGame");
eq(legalMoves(g, 0), [0, 1, 2, 3, 4, 5, 6], "her legal moves");
eq(legalMoves(g, 1), [7, 8, 9, 10, 11, 12, 13], "code's legal moves");

// sowing
let r = applyMove(g, 0, 2);
eq(r.path, [1, 2], "one seed per pit, no skipping");
eq(r.state.pits[0], 0, "source emptied");
eq(g.pits[0], 2, "input not mutated");
eq(r.state.side, 1, "side flips");
eq([r.lost, r.held, r.state.pits[2], r.state.stores], [false, 3, 3, [0, 0]], "a right call keeps the seed; held is what the landing pit holds");
r = applyMove(withPits("2_single", fill(2), 1), 13, null);
eq(r.path, [0, 1], "wrap 13 -> 0");

// the stake: a wrong call sends the last seed to the far store
r = applyMove(g, 0, 1);
eq([r.lost, r.landed, r.state.pits[2], r.state.stores], [true, 2, 2, [0, 1]], "wrong pit: the landing pit is one lighter, the far store one heavier");
eq(applyMove(g, 0, { pit: 2 }).lost, false, "a call object with the right pit");
eq(applyMove(withPits("2_single", fill(2), 1), 7, null).lost, false, "code never loses a seed");
r = applyMove(newGame("4_count"), 0, { pit: 4, count: 5 });
eq([r.lost, r.held], [false, 5], "count level: right pit and right count");
r = applyMove(newGame("4_count"), 0, { pit: 4, count: 4 });
eq([r.lost, r.state.pits[4], r.state.stores[1]], [true, 0, 1], "count level: right pit, wrong count loses the seed (pit 4 then holds four: pasu)");
eq(r.fours, [{ pit: 4, owner: 0 }], "the lighter pit reaching four is a pasu");
eq(applyMove(newGame("4_count"), 0, 4).lost, true, "count level: a bare pit with no count is a wrong call");
eq(applyMove(newGame("4_even"), 0, { pit: 4, parity: "odd" }).lost, false, "even level: five is odd");
eq(applyMove(newGame("4_even"), 0, { pit: 4, parity: "even" }).lost, true, "even level: wrong parity loses the seed");

// relay from the next pit
r = applyMove(newGame("3_relay"), 0, null);
eq(r.hops, [3, 7], "relay: land on 3, pick up pit 4, go on");
eq(r.path, [1, 2, 3, 5, 6, 7], "relay path is both hops; the pickup pit is not sown into");
ok(r.state.pits[4] === 0 && r.state.pits[3] === 4 && r.landed === 7, "the pickup pit is emptied, the first landing keeps its seeds");
ok(r.state.pits[7] === 4, "depth one: the second landing holds four and stays");
eq(applyMove(newGame("3_single"), 0, null).hops, [3], "no relay on a single level");
eq(applyMove(withPits("3_relay", fill(3, { 4: 0 })), 0, null).hops, [3], "no relay when the next pit is empty");
eq(applyMove(withPits("3_relay", fill(3, { 3: 0 })), 0, null).hops, [3, 7], "an empty landing pit does not stop the relay");
r = applyMove(newGame("3_relay"), 0, 3);
eq([r.lost, r.state.pits[7], r.state.stores[1]], [true, 3, 1], "the lost seed is the last of the relay hop");
eq(applyMove(newGame("3_relay"), 0, 3).hops, applyMove(newGame("3_relay"), 0, 7).hops, "the relay does not depend on the call");

// pasu
r = applyMove(withPits("3_single", fill(3, { 2: 3 })), 0, null);
eq(r.fours, [], "no pasu below four seeds");
r = applyMove(withPits("4_single", fill(4, { 3: 3 })), 0, null);
eq(r.fours, [{ pit: 3, owner: 0 }], "pasu at exactly four");
ok(r.state.pits[3] === 0 && r.state.stores[0] === 4, "pasu pit emptied into its owner's store");
r = applyMove(withPits("4_single", fill(4, { 7: 3 })), 3, null);
eq([r.fours[0].owner, r.state.stores[1]], [1, 4], "pasu on the far row goes to code");
r = applyMove(withPits("4_relay", fill(4, { 4: 3 })), 0, null);
eq(r.hops, [4, 9], "pasu on the first landing does not stop the relay: the pickup is the next pit");

// capture beyond the empty pit
const cb = withPits("3_single", fill(3, { 8: 0 }));
r = applyMove(cb, 4, 7);
eq(r.capture, { pit: 9, seeds: 3, earned: true }, "beyond the empty pit, earned by the right call");
ok(r.state.pits[9] === 0 && r.state.stores[0] === 3, "captured seeds move to her store");
r = applyMove(cb, 4, 6);
eq(r.capture, { pit: 9, seeds: 3, earned: false }, "wrong call forfeits");
ok(r.state.pits[9] === 3 && r.state.pits[7] === 3 && r.state.stores[0] === 0 && r.state.stores[1] === 1, "forfeited seeds stay on the board; the lost seed is in the far store");
r = applyMove(withPits("3_single", fill(3, { 1: 0 }), 1), 11, null);
eq(r.capture, { pit: 2, seeds: 3, earned: true }, "code's capture is always earned");
eq(applyMove(cb, 3, 6).capture, null, "no capture when the next pit has seeds");
eq(applyMove(withPits("3_single", fill(3, { 8: 0, 9: 0 })), 4, 7).capture, null, "no capture when the pit beyond is empty");
eq(applyMove(withPits("3_relay", fill(3, { 8: 0 })), 4, 7).capture, { pit: 9, seeds: 3, earned: true }, "relay level: no relay into empty 8, so the capture beyond it");

// the even capture
r = applyMove(withPits("4_even", fill(4, { 4: 5 })), 0, { pit: 4, parity: "even" });
eq(r.capture, { pit: 4, seeds: 6, earned: true }, "the landing pit made even is captured");
ok(r.state.pits[4] === 0 && r.state.stores[0] === 6, "the even pit goes to her store");
r = applyMove(withPits("4_even", fill(4, { 4: 5 })), 0, { pit: 4, parity: "odd" });
eq([r.capture, r.state.pits[4]], [{ pit: 4, seeds: 5, earned: false }, 5], "wrong parity forfeits it and the pit is one lighter");
eq(applyMove(newGame("4_even"), 0, { pit: 4, parity: "odd" }).capture, null, "five is odd: nothing");
eq(applyMove(withPits("4_even", fill(4, { 5: 0 })), 0, { pit: 4, parity: "odd" }).capture, null, "no beyond-the-empty capture on an even level");
eq(applyMove(withPits("4_even", fill(4, { 4: 3 })), 0, { pit: 4, parity: "even" }).capture, null, "a pit reaching four is a pasu, not an even capture");
eq(applyMove(withPits("4_even", fill(4, { 11: 5 }), 1), 7, null).capture, { pit: 11, seeds: 6, earned: true }, "code's even capture");

// end
let s = withPits("2_single", fill(0, { 0: 2, 13: 2 }));
s = applyMove(s, 0, 2).state; s = applyMove(s, 13, null).state; s = applyMove(s, 1, 3).state;
ok(isOver(s), "code has nothing to sow");
eq(finish(s).stores, [4, 0], "what is left goes to the side that has it");
eq(finish(s).pits, fill(0), "finish clears the board");

// policy
const rng = seeded();
const rand = (node) => withPits(node, fill(0).map(() => Math.floor(rng() * 7)), rng() < 0.5 ? 0 : 1);
for (let i = 0; i < 200; i++) { const st = rand(GRAPH[i % GRAPH.length].node), m = policy(st, i % 2 ? rng() : undefined, rng); assert.ok(m === null ? isOver(st) : legalMoves(st, st.side).includes(m)); }
n++;
const cap = withPits("3_single", fill(3, { 1: 0 }), 1);   // 11 captures pit 2
eq(policy(cap, 1, rng), 11, "p_best 1 takes the capture");
const seen = new Set(); for (let i = 0; i < 60; i++) seen.add(policy(cap, 0, rng));
eq([...seen].sort((a, b) => a - b), legalMoves(cap, 1), "p_best 0 spreads over every legal move");

// landing() agrees with applyMove() for every legal move on random boards of every node kind
for (let i = 0; i < 100; i++) {
  const st = rand(GRAPH[i % GRAPH.length].node);
  for (const from of legalMoves(st, st.side)) { const a = landing(st, from), b = applyMove(st, from, null); assert.deepEqual(a, { landed: b.landed, path: b.path, hops: b.hops }); }
}
n++;
console.log(`engine_test: ${n} asserts passed`);
