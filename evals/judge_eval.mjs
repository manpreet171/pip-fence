// The semantic judge, measured: 20 live rephrases through phrase() with the judge on. Prints how many
// the gate rejected, how many the judge overturned after the gate had passed them, and every
// overturned text so the number can be argued with. Needs a key; prints SKIPPED without one.
// Run: node evals/judge_eval.mjs
import { readFileSync } from "node:fs";
import { IDS, redact, phrase, parseWordlist, PROVIDERS } from "../src/engine/buddy.mjs";

const provider = process.env.ANTHROPIC_API_KEY ? "anthropic" : process.env.DEEPSEEK_API_KEY ? "deepseek" : null;
if (!provider) { console.log("SKIPPED: no key"); process.exit(0); }
const apiKey = provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.DEEPSEEK_API_KEY;
const wordlist = parseWordlist(readFileSync(new URL("../data/wordlist.txt", import.meta.url), "utf8"));
const ids = IDS.filter(id => id !== "correct");
const shapes = [{ one_group_short: true }, { all_groups_short: true }, { has_over: true }, { has_empty: true }];
const rows = [];
for (let i = 0; i < 20; i++) {
  const p = redact(ids[i % ids.length], 2 + (i % 2), shapes[i % shapes.length]);
  const t0 = performance.now();
  const r = await phrase(p, { apiKey, provider, wordlist, timeoutMs: 10000, judgeMs: 10000 });
  rows.push({ id: p.misconception_id, tier: p.tier, ms: Math.round(performance.now() - t0), source: r.source, reason: r.reason, text: r.text, rejected: r.rejected });
  console.log(`${String(rows.at(-1).ms).padStart(5)} ms  ${r.source.padEnd(8)} ${(r.reason || "").padEnd(17)} ${p.misconception_id}/${p.tier}  ${r.text}${r.rejected ? "   [rejected: " + r.rejected + "]" : ""}`);
}
const n = rows.length, model = rows.filter(r => r.source === "model").length;
const gate = rows.filter(r => r.source === "template" && !["judge", "judge_unavailable"].includes(r.reason)).length;
const judged = rows.filter(r => r.reason === "judge").length, unavailable = rows.filter(r => r.reason === "judge_unavailable").length;
const ms = rows.map(r => r.ms).sort((a, b) => a - b);
console.log(`\nJUDGE — ${n} live hints, ${PROVIDERS[provider].model} phrasing and judging`);
console.log(`  shipped from the model ${model}/${n} · gate rejected ${gate} · judge overturned ${judged} · judge unavailable ${unavailable} · p50 ${ms[Math.floor(n / 2)]} ms · p95 ${ms[Math.ceil(0.95 * n) - 1]} ms (two calls)`);
