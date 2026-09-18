// Pip plans the next fence, measured: eight learner records through writePlan() with the judge on.
// Prints the pick, whether it was in code's list, whether it differs from code's own next(), and the
// line for the child, so the planner's value can be argued with. Needs a key; prints SKIPPED without one.
// Run: node evals/plan_eval.mjs
import { readFileSync } from "node:fs";
import { writePlan, parseWordlist, PROVIDERS } from "../src/engine/buddy.mjs";
import { candidates, next } from "../src/public/fence.mjs";

const provider = process.env.ANTHROPIC_API_KEY ? "anthropic" : process.env.DEEPSEEK_API_KEY ? "deepseek" : null;
if (!provider) { console.log("SKIPPED: no key"); process.exit(0); }
const apiKey = provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.DEEPSEEK_API_KEY;
const wordlist = parseWordlist(readFileSync(new URL("../data/wordlist.txt", import.meta.url), "utf8"));

const h = (node, ids, hints, first_try = false, fixed_after_count = false) => ({ node, ids, hints, first_try, fixed_after_count });
const gold3 = { "2x3_concrete": 1, "3x3_concrete": 1, "3x4_concrete": 1 };
const RECORDS = [
  { name: "swapped the two numbers twice", mastery: { "2x3_concrete": 1, "3x3_concrete": 0.5 }, history: [h("2x3_concrete", [], 0, true), h("3x3_concrete", ["counted_groups_as_group_size"], 2, false, true)], last: { id: "counted_groups_as_group_size", node: "3x3_concrete" } },
  { name: "three first-try golds", mastery: gold3, history: [h("2x3_concrete", [], 0, true), h("3x3_concrete", [], 0, true), h("3x4_concrete", [], 0, true)], last: { id: "correct", node: "3x4_concrete" } },
  { name: "pack per plank, after two golds", mastery: { ...gold3, "2x3_packs": 0.5 }, history: [h("3x4_concrete", [], 0, true), h("2x3_packs", ["pack_unit_confusion"], 3)], last: { id: "pack_unit_confusion", node: "2x3_packs" } },
  { name: "stops at one part, repeatedly", mastery: { "2x3_concrete": 1, "3x3_concrete": 0.5, "3x4_concrete": 0.5 }, history: [h("3x3_concrete", ["one_group_only"], 2), h("3x4_concrete", ["one_group_only"], 3)], last: { id: "one_group_only", node: "3x4_concrete" } },
  { name: "ordered the standing planks (fix)", mastery: { ...gold3, "2x3_packs": 1, "3x3_packs": 1, "3x4_packs": 1, "2x3_fix": 0.5 }, history: [h("3x4_packs", [], 0, true), h("2x3_fix", ["counted_present_not_missing"], 1, false, true)], last: { id: "counted_present_not_missing", node: "2x3_fix" } },
  { name: "share: parts equal per, twice", mastery: { ...gold3, "2x3_packs": 1, "3x3_packs": 1, "3x4_packs": 1, "2x3_fix": 1, "3x3_fix": 1, "3x4_fix": 1, "2x3_share": 0.5, "3x3_share": 0.5 }, history: [h("2x3_share", ["parts_equal_per"], 2), h("3x3_share", ["parts_equal_per"], 2)], last: { id: "parts_equal_per", node: "3x3_share" } },
  { name: "over-count once, then fixed", mastery: { "2x3_concrete": 1 }, history: [h("2x3_concrete", ["over_count"], 1, false, true)], last: { id: "over_count", node: "2x3_concrete" } },
  { name: "silver everywhere in Build", mastery: { "2x3_concrete": 0.5, "3x3_concrete": 0.5, "3x4_concrete": 0.5, "4x3_concrete": 0.5 }, history: [h("3x4_concrete", ["off_by_one_per_group"], 2), h("4x3_concrete", ["off_by_one_per_group"], 1, false, true)], last: { id: "off_by_one_per_group", node: "4x3_concrete" } },
];
const rows = [];
for (const r of RECORDS) {
  const { name, ...b } = r, c = candidates(b.mastery, b.last), code = next(b.mastery, b.last);
  const t0 = performance.now();
  const p = await writePlan(b, c, { apiKey, provider, wordlist, timeoutMs: 10000, judgeMs: 10000 });
  const ms = Math.round(performance.now() - t0);
  rows.push({ ...p, ms, code, differs: p.node && p.node !== code });
  console.log(`${String(ms).padStart(5)} ms  ${name.padEnd(36)} code ${String(code).padEnd(13)} model ${String(p.node).padEnd(13)} ${p.source.padEnd(8)} ${(p.reason || "").padEnd(10)} ${p.why}${p.rejected ? "   [rejected: " + p.rejected + "]" : ""}`);
}
const n = rows.length, picked = rows.filter(r => r.node && r.source === "model").length, lines = rows.filter(r => r.why).length;
const differs = rows.filter(r => r.differs).length, ms = rows.map(r => r.ms).sort((a, b) => a - b);
console.log(`\nPLAN — ${n} learner records, ${PROVIDERS[provider].model} choosing and judging`);
console.log(`  pick accepted ${picked}/${n} · pick differs from code's next() ${differs}/${n} · line shipped ${lines}/${n} · p50 ${ms[Math.floor(n / 2)]} ms · p95 ${ms[Math.ceil(0.95 * n) - 1]} ms`);
