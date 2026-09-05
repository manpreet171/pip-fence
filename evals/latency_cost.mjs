// 20 live Haiku hints -> p50/p95 ms, tokens in/out, $/hint at $1/$5 per MTok, gate pass rate.
// Costs money (~$0.015). Needs ANTHROPIC_API_KEY; without it prints SKIPPED and exits 0.
// Run: node evals/latency_cost.mjs
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { IDS, redact, phrase, parseWordlist } from "../src/engine/buddy.mjs";

export async function runOne(payload, opts) {
  const t0 = performance.now();
  const r = await phrase(payload, { timeoutMs: 10000, ...opts });
  return { id: payload.misconception_id, tier: payload.tier, ms: performance.now() - t0, source: r.source,
    reason: r.reason, in: r.usage?.input_tokens ?? 0, out: r.usage?.output_tokens ?? 0, text: r.text, rejected: r.rejected };
}

export function summarise(rows) {
  const ms = rows.map(r => r.ms).sort((a, b) => a - b), q = p => ms[Math.min(ms.length - 1, Math.ceil(p * ms.length) - 1)];
  const mean = k => rows.reduce((s, r) => s + r[k], 0) / rows.length;
  return { n: rows.length, p50: q(0.5), p95: q(0.95), in: mean("in"), out: mean("out"),
    usd: (mean("in") * 1 + mean("out") * 5) / 1e6, pass: rows.filter(r => r.source === "model").length / rows.length };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { console.log("SKIPPED: no ANTHROPIC_API_KEY — latency/cost table needs a live key"); process.exit(0); }
  const wordlist = parseWordlist(readFileSync(new URL("../data/wordlist.txt", import.meta.url), "utf8"));
  const shapes = [{ one_group_short: true }, { all_groups_short: true }, { has_over: true }, { has_empty: true }];
  const payloads = Array.from({ length: 20 }, (_, i) => redact(IDS[i % 8], 1 + (i % 3), shapes[i % 4]));
  const rows = [];
  for (const p of payloads) { const r = await runOne(p, { apiKey, wordlist }); rows.push(r);
    console.log(`${r.ms.toFixed(0).padStart(5)} ms  ${r.source.padEnd(8)} ${(r.reason || "").padEnd(9)} ${r.id}/${r.tier}  ${r.text}${r.rejected ? "   [rejected: " + r.rejected + "]" : ""}`); }
  const s = summarise(rows);
  console.log(`\nLATENCY/COST — ${s.n} live hints, claude-haiku-4-5-20251001, structured output`);
  console.log(`  p50 ${s.p50.toFixed(0)} ms | p95 ${s.p95.toFixed(0)} ms | tokens in ${s.in.toFixed(0)} / out ${s.out.toFixed(0)} | $${s.usd.toFixed(6)} per hint | gate pass ${(100 * s.pass).toFixed(0)}%`);
}
