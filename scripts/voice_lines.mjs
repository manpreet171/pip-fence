// Every fixed line Pip says, as JSON on stdout, for scripts/make_voice.py. Templates come from the
// hint layer, the cheer lines from their fallbacks, code's worked-example lines from fence.mjs, and
// the sheet, demo and card lines are read out of the page source. Model-phrased lines are not here:
// they are spoken by the browser's own voice at run time.
import { readFileSync } from "node:fs";
import { TEMPLATES, cheerFallback } from "../src/engine/buddy.mjs";
import { codeShow } from "../src/public/fence.mjs";

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
process.stdout.write(JSON.stringify([...lines].filter(l => /[a-z]/i.test(l) && !/[{}$]/.test(l)), null, 1));
