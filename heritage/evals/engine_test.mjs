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
eq(GRAPH.map(g => g.node), ["2_single", "3_single", "4_single", "6_single", "3_relay", "4_relay"], "node order");
eq(GRAPH.filter(g => g.four).map(g => g.node), ["4_single", "6_single", "4_relay"], "four from 4 seeds up");
eq(GRAPH.filter(g => g.relay).map(g => g.node), ["3_relay", "4_relay"], "relay levels");
eq(IDS.length, 9, "nine ids");
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
r = applyMove(withPits("2_single", fill(2), 1), 13, null);
eq(r.path, [0, 1], "wrap 13 -> 0");

// relay
r = applyMove(newGame("3_relay"), 0, null);
eq(r.hops, [3, 7], "relay: pick up the four in pit 3, go on");
eq(r.path, [1, 2, 3, 4, 5, 6, 7], "relay path is both hops");
ok(r.state.pits[7] === 4 && r.landed === 7, "depth one: the second landing holds four and stays");
eq(applyMove(newGame("3_single"), 0, null).hops, [3], "no relay on a single level");
eq(applyMove(withPits("3_relay", fill(3, { 3: 0 })), 0, null).hops, [3], "no relay into an empty pit");

// pasu
r = applyMove(withPits("3_single", fill(3, { 2: 3 })), 0, null);
eq(r.fours, [], "no pasu below four seeds");
r = applyMove(withPits("4_single", fill(4, { 3: 3 })), 0, null);
eq(r.fours, [{ pit: 3, owner: 0 }], "pasu at exactly four");
ok(r.state.pits[3] === 0 && r.state.stores[0] === 4, "pasu pit emptied into its owner's store");
r = applyMove(withPits("4_single", fill(4, { 7: 3 })), 3, null);
eq([r.fours[0].owner, r.state.stores[1]], [1, 4], "pasu on the far row goes to code");
r = applyMove(withPits("4_relay", fill(4, { 4: 3 })), 0, null);
eq(r.hops, [4], "pasu on the landing pit ends the move");

// capture
const cb = withPits("3_single", fill(3, { 8: 0 }));
r = applyMove(cb, 4, 7);
eq(r.capture, { pit: 9, seeds: 3, earned: true }, "beyond the empty pit, earned by the right call");
ok(r.state.pits[9] === 0 && r.state.stores[0] === 3, "captured seeds move to her store");
r = applyMove(cb, 4, 6);
eq(r.capture, { pit: 9, seeds: 3, earned: false }, "wrong call forfeits");
ok(r.state.pits[9] === 3 && r.state.stores[0] === 0, "forfeited seeds stay on the board");
r = applyMove(withPits("3_single", fill(3, { 1: 0 }), 1), 11, null);
eq(r.capture, { pit: 2, seeds: 3, earned: true }, "code's capture is always earned");
eq(applyMove(cb, 3, 6).capture, null, "no capture when the next pit has seeds");
eq(applyMove(withPits("3_single", fill(3, { 8: 0, 9: 0 })), 4, 7).capture, null, "no capture when the pit beyond is empty");

// end
let s = withPits("2_single", fill(0, { 0: 2, 13: 2 }));
s = applyMove(s, 0, 2).state; s = applyMove(s, 13, null).state; s = applyMove(s, 1, 3).state;
ok(isOver(s), "code has nothing to sow");
eq(finish(s).stores, [4, 0], "what is left goes to the side that has it");
eq(finish(s).pits, fill(0), "finish clears the board");

// policy
const rng = seeded();
const rand = (node) => withPits(node, fill(0).map(() => Math.floor(rng() * 7)), rng() < 0.5 ? 0 : 1);
for (let i = 0; i < 200; i++) { const st = rand(GRAPH[i % 6].node), m = policy(st, rng(), rng); assert.ok(m === null ? isOver(st) : legalMoves(st, st.side).includes(m)); }
n++;
const cap = withPits("3_single", fill(3, { 1: 0 }), 1);   // 11 captures pit 2
eq(policy(cap, 1, rng), 11, "p_best 1 takes the capture");
const seen = new Set(); for (let i = 0; i < 60; i++) seen.add(policy(cap, 0, rng));
eq([...seen].sort((a, b) => a - b), legalMoves(cap, 1), "p_best 0 spreads over every legal move");

// landing() agrees with applyMove() everywhere
for (let i = 0; i < 60; i++) {
  const st = rand(GRAPH[i % 6].node);
  for (const from of legalMoves(st, st.side)) { const a = landing(st, from), b = applyMove(st, from, null); assert.deepEqual(a, { landed: b.landed, path: b.path, hops: b.hops }); }
}
n++;
console.log(`engine_test: ${n} asserts passed`);
