// 20 live hints -> p50/p95 ms, tokens in/out, $/hint at the provider's list price, gate pass rate.
// Provider follows the key: ANTHROPIC_API_KEY (Haiku) else DEEPSEEK_API_KEY (v4-flash). Costs cents.
// Without either key prints SKIPPED and exits 0.
// Run: node evals/latency_cost.mjs
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { IDS, redact, phrase, parseWordlist, PROVIDERS } from "../src/engine/buddy.mjs";

export async function runOne(payload, opts) {
  const t0 = performance.now();
  const r = await phrase(payload, { timeoutMs: 10000, ...opts });
  return { id: payload.misconception_id, tier: payload.tier, ms: performance.now() - t0, source: r.source,
    reason: r.reason, in: r.usage?.input_tokens ?? 0, out: r.usage?.output_tokens ?? 0, text: r.text, rejected: r.rejected };
}

export function summarise(rows, price = { in: 1, out: 5 }) {
  const ms = rows.map(r => r.ms).sort((a, b) => a - b), q = p => ms[Math.min(ms.length - 1, Math.ceil(p * ms.length) - 1)];
  const mean = k => rows.reduce((s, r) => s + r[k], 0) / rows.length;
  return { n: rows.length, p50: q(0.5), p95: q(0.95), in: mean("in"), out: mean("out"),
    usd: (mean("in") * price.in + mean("out") * price.out) / 1e6, pass: rows.filter(r => r.source === "model").length / rows.length };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const provider = process.env.ANTHROPIC_API_KEY ? "anthropic" : process.env.DEEPSEEK_API_KEY ? "deepseek" : null;
  if (!provider) { console.log("SKIPPED: no ANTHROPIC_API_KEY or DEEPSEEK_API_KEY — latency/cost table needs a live key"); process.exit(0); }
  const apiKey = provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.DEEPSEEK_API_KEY;
  const wordlist = parseWordlist(readFileSync(new URL("../data/wordlist.txt", import.meta.url), "utf8"));
  const shapes = [{ one_group_short: true }, { all_groups_short: true }, { has_over: true }, { has_empty: true }];
  const payloads = Array.from({ length: 20 }, (_, i) => redact(IDS[i % 8], 1 + (i % 3), shapes[i % 4]));
  const rows = [];
  for (const p of payloads) { const r = await runOne(p, { apiKey, provider, wordlist }); rows.push(r);
    console.log(`${r.ms.toFixed(0).padStart(5)} ms  ${r.source.padEnd(8)} ${(r.reason || "").padEnd(9)} ${r.id}/${r.tier}  ${r.text}${r.rejected ? "   [rejected: " + r.rejected + "]" : ""}`); }
  const s = summarise(rows, PROVIDERS[provider].usd_per_mtok);
  console.log(`\nLATENCY/COST — ${s.n} live hints, ${PROVIDERS[provider].model}, gate applied, list price $${PROVIDERS[provider].usd_per_mtok.in}/$${PROVIDERS[provider].usd_per_mtok.out} per MTok`);
  console.log(`  p50 ${s.p50.toFixed(0)} ms | p95 ${s.p95.toFixed(0)} ms | tokens in ${s.in.toFixed(0)} / out ${s.out.toFixed(0)} | $${s.usd.toFixed(6)} per hint | gate pass ${(100 * s.pass).toFixed(0)}%`);
}
