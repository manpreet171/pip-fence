// Deterministic eval of classify(): fixtures -> confusion matrix, right-when-committed, silence
// rate. Exit 1 on any mismatch. Run: node heritage/evals/classifier_eval.mjs
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { applyMove, classify, newGame } from "../src/sow.mjs";

const { fixtures } = JSON.parse(readFileSync(new URL("./classifier_fixtures.json", import.meta.url), "utf8"));

// Expand the DSL (docs/ENGINE-CONTRACT.md) into the event log the page writes. The `s` token runs
// the engine, so paths, relays, fours and captures in the log are the engine's, never hand-typed.
export function expand(node, seq) {
  const ev = [{ t: 0, e: "level_start", node }];
  let st = newGame(node), t = 0, from, called;
  const move = (pit, side) => { st.side = side; const r = applyMove(st, pit, side ? null : called); st = r.state; return r; };
  for (const tok of seq.split(/\s+/)) {
    const m = /^([a-z]):?(.*)$/.exec(tok);
    if (!m) throw new Error("bad token " + tok);
    const op = m[1], arg = m[2], pit = +arg;
    t += 1000;
    if (op === "n") { st = newGame(arg); ev.push({ t, e: "level_start", node: arg }); }
    else if (op === "b") st.pits = arg.split(",").map(Number);
    else if (op === "p") { from = pit; ev.push({ t, e: "pick", pit, seeds: st.pits[pit] }); }
    else if (op === "c") {   // c4, c4:5 (a count), c4:even / c4:odd (a parity)
      const [p, x] = arg.split(":");
      called = { pit: +p, ...(x === "even" || x === "odd" ? { parity: x } : x ? { count: +x } : {}) };
      ev.push({ t, e: "call", ...called });
    }
    else if (op === "s") {
      const seeds = st.pits[from], r = move(from, 0);
      ev.push({ t, e: "sow", from, landed: r.hops[0], path: r.path.slice(0, seeds), lost: r.lost, held: r.held });
      if (r.hops.length > 1) ev.push({ t, e: "relay", from: (r.hops[0] + 1) % 14, landed: r.hops[1], path: r.path.slice(seeds) });
      for (const f of r.fours) ev.push({ t, e: "four", ...f });
      if (r.capture) ev.push({ t, e: "capture", ...r.capture });
    }
    else if (op === "t") ev.push({ t, e: "tap_count", pit });
    else if (op === "h") ev.push({ t, e: "hint", id: arg, tier: 1 });
    else if (op === "o") { const r = move(pit, 1); ev.push({ t, e: "turn", side: "code", from: pit, landed: r.landed }); }
    else throw new Error("bad token " + tok);
  }
  return ev;
}

// Runs only when executed directly, so tests import expand() without triggering the eval.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
const labels = [...new Set(fixtures.map(f => f.expect))].sort();
const M = Object.fromEntries(labels.map(a => [a, {}]));
let fails = 0, silent = 0, right = 0, committed = 0;
for (const f of fixtures) {
  const r = classify(expand(f.node, f.seq));
  M[f.expect][r.id] = (M[f.expect][r.id] || 0) + 1;
  if (!r.confirmed) silent++; else { committed++; if (r.id === f.expect) right++; }
  const bad = r.id !== f.expect || (f.confirmed !== undefined && r.confirmed !== f.confirmed) || (f.tier !== undefined && r.tier !== f.tier);
  if (bad) { fails++; console.log(`FAIL ${f.node} "${f.seq}"\n     expect ${f.expect}${f.confirmed !== undefined ? "/" + f.confirmed : ""} got ${r.id}/${r.confirmed} tier ${r.tier} called ${r.called} landed ${r.landed} path [${r.path}]  (${f.note})`); }
}
const cols = [...new Set([...labels, ...Object.values(M).flatMap(Object.keys)])].sort();
console.log("\nCONFUSION (rows = expected, cols = predicted)\n" + " ".repeat(22) + cols.map(l => l.slice(0, 5).padStart(6)).join(""));
for (const a of labels) console.log(a.padEnd(22) + cols.map(b => String(M[a][b] || 0).padStart(6)).join(""));
console.log(`\nfixtures ${fixtures.length} | committed ${committed} | right when committed ${right}/${committed} = ${(100 * right / committed).toFixed(1)}% | silent ${silent} (${(100 * silent / fixtures.length).toFixed(1)}%) | mismatches ${fails}`);
process.exit(fails ? 1 : 0);
}
