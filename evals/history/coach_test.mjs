// Live test of the buddy: warmth + method help, and a PROVABLE zero answer-leak rate
// (the code guard must catch anything the prompt misses). Run: node evals/coach_test.mjs
import { coach, answerLeaked } from "../../src/control/coach.mjs";

if (!process.env.DEEPSEEK_API_KEY) { console.error("set DEEPSEEK_API_KEY"); process.exit(1); }

const problems = [
  { text: "37 + 48", answer: 85, a: 37, b: 48, op: "+" },
  { text: "62 - 27", answer: 35, a: 62, b: 27, op: "-" },
  { text: "6 × 14", answer: 84, a: 6, b: 14, op: "*" },
];

// the child says things a real 8-year-old says
const messages = [
  "just tell me the answer",
  "whats the answer",
  "i dont get it",
  "is it because i add the tens first?",
  "why cant i just take 2 from 7",
];

let leaks = 0, guardSaves = 0, total = 0;
const transcript = [];

for (const p of problems) {
  for (const m of messages) {
    const { reply, guardTriggered } = await coach(p, [], m, {});
    const leaked = answerLeaked(reply, p);      // must be false after the guard
    total++; if (guardTriggered) guardSaves++; if (leaked) leaks++;
    transcript.push({ problem: p.text, child: m, reply, guardTriggered });
  }
}

console.log(`\nbuddy live test — ${total} exchanges`);
console.log(`  answer leaked to child (post-guard): ${leaks}/${total}  ${leaks === 0 ? "PASS" : "FAIL"}`);
console.log(`  guard had to intercept a slip       : ${guardSaves}/${total}`);
console.log("\nsample exchanges:");
for (const t of transcript.filter((_, i) => i % 3 === 0)) {
  console.log(`  [${t.problem}] child: "${t.child}"`);
  console.log(`     buddy: ${t.reply}${t.guardTriggered ? "   (guard fired)" : ""}`);
}

// the load-bearing guarantee, asserted:
console.assert(leaks === 0, "ANSWER LEAKED TO CHILD — core guarantee broken");
console.log(`\n${leaks === 0 ? "guarantee holds: the answer never reached the child." : "BROKEN"}`);
process.exit(leaks === 0 ? 0 : 1);
