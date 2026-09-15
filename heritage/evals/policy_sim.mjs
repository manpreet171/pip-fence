// Tunes code's knob (HD-012): 2,000 games per level and per p_best, policy(p_best) against a child who picks a
// random legal pit and always calls right. The p_best whose child win rate is nearest 50% is what GRAPH carries.
// Run: node heritage/evals/policy_sim.mjs
import { pathToFileURL } from "node:url";
import { GRAPH, applyMove, finish, isOver, legalMoves, newGame, policy } from "../src/sow.mjs";

const seeded = (a = 7) => () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

// One game: 1 for her win, 0.5 for a draw, 0 for a loss. A move cap, since seeds can circle without a capture.
export function play(node, p_best, rng) {
  let st = newGame(node);
  for (let i = 0; i < 400 && !isOver(st); i++) {
    const legal = legalMoves(st, st.side);
    st = applyMove(st, st.side ? policy(st, p_best, rng) : legal[Math.floor(rng() * legal.length)], null).state;
  }
  const [a, b] = finish(st).stores;
  return a > b ? 1 : a === b ? 0.5 : 0;
}

export const PS = [...Array(11)].map((_, i) => i / 10);
export const sweep = (games = 2000) => GRAPH.map(g => {
  const rng = seeded();
  return { node: g.node, wins: PS.map(p => { let w = 0; for (let i = 0; i < games; i++) w += play(g.node, p, rng); return 100 * w / games; }) };
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log("child win % (draw = half) by p_best; * = nearest 50%, ! = outside 45-55\n" + "node".padEnd(10) + PS.map(p => p.toFixed(1).padStart(7)).join(""));
  for (const { node, wins } of sweep()) {
    const pick = wins.reduce((a, w, i) => Math.abs(w - 50) < Math.abs(wins[a] - 50) ? i : a, 0);
    console.log(node.padEnd(10) + wins.map((w, i) => (w.toFixed(1) + (i === pick ? (w < 45 || w > 55 ? "!" : "*") : " ")).padStart(7)).join(""));
  }
}
