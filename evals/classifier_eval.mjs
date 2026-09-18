// Deterministic eval of classify(): fixtures -> confusion matrix, accuracy-when-committed,
// silence rate. Exit 1 on any mismatch. Run: node evals/classifier_eval.mjs
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { classify, shape } from "../src/public/fence.mjs";

const { fixtures } = JSON.parse(readFileSync(new URL("./classifier_fixtures.json", import.meta.url), "utf8"));

// Expand the DSL (see fixtures "_dsl") into the event log the game itself writes.
export function expand(node, seq) {
  const s = shape(node); let c = s.pre ? [...s.pre] : Array(s.groups).fill(0);   // fix starts pre-built; share's parts come from nK
  const ev = [{ t: 0, e: "level_start", node }];
  let t = 0, wait = 0;
  for (const tok of seq.split(/\s+/)) {
    const m = /^([a-z]):?([^*]*)(?:\*(\d+))?$/.exec(tok);
    if (!m) throw new Error("bad token " + tok);
    const op = m[1], arg = m[2], rep = +(m[3] || 1);
    if (op === "w") { wait = +arg * 1000; continue; }
    for (let i = 0; i < rep; i++) {
      t += wait || 1500; wait = 0;
      const g = +arg;
      if (op === "p") { c[g]++; ev.push({ t, e: "place", unit: "plank", group: g, n_in_group: c[g] }); }
      else if (op === "r") { c[g] = Math.max(0, c[g] - 1); ev.push({ t, e: "remove", unit: "plank", group: g, n_in_group: c[g] }); }
      else if (op === "k") { c[g] += s.pack; ev.push({ t, e: "place", unit: "pack", n: s.pack, group: g, n_in_group: c[g] }); }
      else if (op === "o") ev.push({ t, e: "order", ...(s.mode === "fix" ? { planks: g } : { packs: g }) });
      else if (op === "n") { c = Array(g).fill(0); ev.push({ t, e: "parts", n: g }); }
      else if (op === "f") ev.push({ t, e: "place_failed", nearest_group: g, held: "plank" });
      else if (op === "t") ev.push({ t, e: "tap_count", group: g });
      else if (op === "h") ev.push({ t, e: "hint", id: arg });
      else if (op === "c") ev.push({ t, e: "commit", reason: arg || "left_plot" });
      else throw new Error("bad token " + tok);
    }
  }
  return ev;
}

// Runs only when executed directly; buddy_test.mjs imports expand() without triggering the eval.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
const labels = [...new Set(fixtures.map(f => f.expect))].sort();
const M = Object.fromEntries(labels.map(a => [a, {}]));
let fails = 0, silent = 0, rightCommitted = 0, committed = 0;
for (const f of fixtures) {
  const r = classify(expand(f.node, f.seq));
  M[f.expect][r.id] = (M[f.expect][r.id] || 0) + 1;
  const isSilent = r.id === "ambiguous" || r.id === "in_progress" || !r.confirmed;
  if (isSilent) silent++; else { committed++; if (r.id === f.expect) rightCommitted++; }
  const bad = r.id !== f.expect
    || (f.confirmed !== undefined && r.confirmed !== f.confirmed)
    || (f.tier !== undefined && r.tier !== f.tier)
    || (f.flag !== undefined && !r.flags.includes(f.flag));
  if (bad) {
    fails++;
    console.log(`FAIL ${f.node} "${f.seq}"\n     expect ${f.expect}${f.confirmed !== undefined ? "/" + f.confirmed : ""} got ${r.id}/${r.confirmed} tier ${r.tier} counts [${r.counts}] ${r.flags}`);
  }
}
const cols = [...new Set([...labels, ...Object.values(M).flatMap(Object.keys)])].sort();
console.log("\nCONFUSION (rows = expected, cols = predicted)\n" + " ".repeat(28) + cols.map(l => l.slice(0, 5).padStart(6)).join(""));
for (const a of labels) console.log(a.padEnd(28) + cols.map(b => String(M[a][b] || 0).padStart(6)).join(""));
console.log(`\nfixtures ${fixtures.length} | committed ${committed} | right when committed ${rightCommitted}/${committed} = ${(100 * rightCommitted / committed).toFixed(1)}% | silent ${silent} (${(100 * silent / fixtures.length).toFixed(1)}%) | mismatches ${fails}`);
process.exit(fails ? 1 : 0);
}
