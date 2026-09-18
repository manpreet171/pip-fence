// Pip's fixed lines as audio clips, one mp3 per line named by the line's hash, plus the manifest the
// page reads. Uses the same voice the server uses at run time, so fixed and fresh lines match.
// Run once after the lines change; existing files are kept.
//
//   set OPENAI_API_KEY=...            (PowerShell: $env:OPENAI_API_KEY="...")
//   node scripts/voice_clips.mjs      [voice]   default coral
//
// No dependencies. Lines are collected from the hint layer, the cheer fallbacks, code's worked-example
// lines and the game page's own strings, exactly as the page will speak them.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { TEMPLATES, cheerFallback } from "../src/engine/buddy.mjs";
import { codeShow } from "../src/public/fence.mjs";

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("OPENAI_API_KEY is not set"); process.exit(1); }
const VOICE = process.argv[2] || process.env.TTS_VOICE || "coral";
const OUT = new URL("../src/public/assets/voice/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const lines = new Set();
for (const id in TEMPLATES) for (const t in TEMPLATES[id]) lines.add(TEMPLATES[id][t]);
const C = { first_try: true, used_hint: false, fixed_after_count: false, mode: "fix", chapter_done: false };
for (const b of [C, { ...C, mode: "share" }, { ...C, mode: "build" }, { ...C, first_try: false, fixed_after_count: true }, { ...C, chapter_done: true }, { ...C, first_try: false }]) lines.add(cheerFallback(b));
for (const st of [{ per: 3, parts: [3, 1, 3], cart: 2 }, { per: 3, parts: [3, 5, 1], cart: 0 }]) for (const s of codeShow(st)) if (s.op === "say") lines.add(s.text);
const page = readFileSync(new URL("../src/public/build.html", import.meta.url), "utf8");
for (const m of page.matchAll(/(?:say|bubble)\("([^"]+)"/g)) lines.add(m[1]);
for (const m of page.matchAll(/(?:sub|title): "([^"]+)"/g)) lines.add(m[1]);
for (const m of page.matchAll(/steps: \[([^\]]+)\]/g)) for (const s of m[1].matchAll(/"([^"]+)"/g)) lines.add(s[1]);
for (const m of page.matchAll(/pip\.star\([^,]+, [^"]*"([^"]+)" : "([^"]+)"\)/g)) { lines.add(m[1]); lines.add(m[2]); }
for (const w of ["one", "two", "three", "four", "five", "six"]) lines.add(w);
for (const s of ["The fence is done.", "Look at this part.", "Every fence is done!"]) lines.add(s);
const all = [...lines].filter(l => /[a-z]/i.test(l) && !/[{}$]/.test(l));
const name = t => createHash("sha1").update(t, "utf8").digest("hex").slice(0, 12) + ".mp3";
// The clips are named by their text, so a change of voice must remake every file: a marker says which voice made them.
const MARK = new URL("VOICE", OUT);
const fresh = !existsSync(MARK) || readFileSync(MARK, "utf8").trim() !== VOICE;
if (fresh) console.log(`voice changed to ${VOICE}: remaking every clip`);

async function one(text) {
  const path = new URL(name(text), OUT);
  if (existsSync(path) && !fresh) return "kept";
  const r = await fetch("https://api.openai.com/v1/audio/speech", { method: "POST",
    headers: { authorization: "Bearer " + KEY, "content-type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini-tts", voice: VOICE, input: text, response_format: "mp3",
      instructions: "A warm, playful young child's voice, speaking slowly and clearly to a friend." }) });
  if (!r.ok) throw new Error(`${r.status} for "${text}"`);
  writeFileSync(path, Buffer.from(await r.arrayBuffer()));
  return "made";
}
let made = 0, kept = 0;
for (let i = 0; i < all.length; i += 4) {
  const res = await Promise.all(all.slice(i, i + 4).map(one));
  made += res.filter(x => x === "made").length; kept += res.filter(x => x === "kept").length;
  process.stdout.write(`\r${i + res.length}/${all.length}`);
}
writeFileSync(new URL("manifest.json", OUT), JSON.stringify(Object.fromEntries(all.map(t => [t, name(t)])), null, 0));
console.log(`\n${VOICE}: ${made} made, ${kept} kept, ${all.length} lines`);
