// Pip shows her, measured: six real fence states through writeShow() with the simulator on. Prints
// whether the model's script passed the simulation, how many moves, and the say lines. Needs a key.
// Run: node evals/show_eval.mjs
import { readFileSync } from "node:fs";
import { writeShow, parseWordlist, PROVIDERS } from "../src/engine/buddy.mjs";
import { validShow, codeShow } from "../src/public/fence.mjs";

const provider = process.env.ANTHROPIC_API_KEY ? "anthropic" : process.env.DEEPSEEK_API_KEY ? "deepseek" : null;
if (!provider) { console.log("SKIPPED: no key"); process.exit(0); }
const apiKey = provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.DEEPSEEK_API_KEY;
const wordlist = parseWordlist(readFileSync(new URL("../data/wordlist.txt", import.meta.url), "utf8"));
const STATES = [
  { name: "one part short", per: 3, parts: [3, 1, 3], cart: 2, misconception_id: "off_by_one_in_one_group", tier: 2 },
  { name: "every part one short", per: 4, parts: [3, 3, 3], cart: 3, misconception_id: "off_by_one_per_group", tier: 2 },
  { name: "parts and planks swapped", per: 4, parts: [3, 3, 3], cart: 3, misconception_id: "counted_groups_as_group_size", tier: 3 },
  { name: "one part over the post", per: 3, parts: [3, 5, 1], cart: 0, misconception_id: "right_total_wrong_grouping", tier: 2 },
  { name: "only the first part built", per: 3, parts: [3, 0, 0, 0], cart: 9, misconception_id: "one_group_only", tier: 2 },
  { name: "fix: gaps left", per: 4, parts: [4, 2, 4], cart: 2, misconception_id: "ordered_short", tier: 2 },
];
const rows = [];
for (const st of STATES) {
  const { name, ...b } = st, t0 = performance.now();
  const r = await writeShow(b, { apiKey, provider, wordlist, timeoutMs: 15000, valid: validShow, fallback: codeShow });
  const ms = Math.round(performance.now() - t0); rows.push({ ...r, ms });
  const moves = r.steps.map(t => t.op + (t.part != null ? t.part : "")).join(" ");
  console.log(`${String(ms).padStart(5)} ms  ${name.padEnd(26)} ${r.source.padEnd(8)} ${(r.reason || "").padEnd(11)} ${moves}\n         ${r.steps.filter(t => t.op === "say").map(t => `"${t.text}"`).join("  ")}${r.rejected ? "\n         [rejected: " + JSON.stringify(r.rejected).slice(0, 200) + "]" : ""}`);
}
const n = rows.length, model = rows.filter(r => r.source === "model").length, ms = rows.map(r => r.ms).sort((a, b) => a - b);
console.log(`\nSHOW — ${n} fence states, ${PROVIDERS[provider].model} writing the moves`);
console.log(`  model's script passed the simulation and the gate ${model}/${n} · code's script used ${n - model}/${n} · p50 ${ms[Math.floor(n / 2)]} ms · p95 ${ms[Math.ceil(0.95 * n) - 1]} ms`);
