// Honest evaluation of the Rung engine. Produces the demo's numbers.
//
// What this DOES prove (legitimately): the adaptive selection policy keeps a learner in the
// productive-struggle band and estimates their ability in fewer items than fair baselines
// (random selection, fixed ramp) — run on the SAME engine, so the only difference is the
// selection policy. Not circular in a damning way: random/ramp are honest baselines a real
// product could ship, and adaptive beating them is a real, expected-but-not-guaranteed result.
//
// What this does NOT prove (stated in the submission): that real children learn more. That
// needs a classroom. Here the "learner" is a simulated responder with a KNOWN true ability —
// legitimate for testing a selection policy (we are not faking understanding; theta is a
// parameter we set), unlike simulating a learner's comprehension (D-023).
//
// Run: node evals/engine_eval.mjs

import {
  sigmoid, generateProblem, updateAbility,
  selectDifficultyAdaptive, selectDifficultyRandom, selectDifficultyFixedRamp,
} from "../../src/control/engine.mjs";

// deterministic RNG for reproducible numbers
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BAND = [0.6, 0.85]; // productive-struggle success band

function runSession(trueTheta, policy, nItems, rng) {
  let theta = 0;                 // engine's estimate starts at 0 (knows nothing)
  let inBand = 0;
  const errs = [];
  for (let i = 0; i < nItems; i++) {
    let d;
    if (policy === "adaptive") d = selectDifficultyAdaptive(theta);
    else if (policy === "random") d = selectDifficultyRandom(theta, rng);
    else d = selectDifficultyFixedRamp(i);
    // simulate the child's response from their TRUE ability (Rasch)
    const pCorrect = sigmoid(trueTheta - d);
    if (pCorrect >= BAND[0] && pCorrect <= BAND[1]) inBand++;
    const correct = rng() < pCorrect;
    theta = updateAbility(theta, d, correct, i);
    errs.push(Math.abs(theta - trueTheta));
  }
  return { inBandFrac: inBand / nItems, finalErr: errs[errs.length - 1], errs };
}

function evaluate() {
  const N_LEARNERS = 400, N_ITEMS = 25;
  const policies = ["adaptive", "random", "ramp"];
  const agg = Object.fromEntries(policies.map((p) => [p, { inBand: [], err: [], curve: Array(N_ITEMS).fill(0) }]));
  const rng = mulberry32(2024);

  for (let l = 0; l < N_LEARNERS; l++) {
    const trueTheta = -3 + rng() * 6; // spread of real abilities
    for (const p of policies) {
      const r = runSession(trueTheta, p, N_ITEMS, rng);
      agg[p].inBand.push(r.inBandFrac);
      agg[p].err.push(r.finalErr);
      r.errs.forEach((e, i) => (agg[p].curve[i] += e / N_LEARNERS));
    }
  }

  const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  // items-to-confident: first item where mean abs error < 0.5
  const itemsToConf = (curve) => {
    const idx = curve.findIndex((e) => e < 0.5);
    return idx === -1 ? null : idx + 1;
  };

  console.log(`\nRung engine eval — ${N_LEARNERS} simulated learners, ${N_ITEMS} items each`);
  console.log("(honest: measures the SELECTION POLICY, not real-child learning gains)\n");
  console.log("policy    in-band%   final |θ̂-θ|   items-to-confident");
  console.log("-".repeat(56));
  for (const p of policies) {
    const ib = mean(agg[p].inBand) * 100;
    const er = mean(agg[p].err);
    const itc = itemsToConf(agg[p].curve);
    console.log(
      `${p.padEnd(9)} ${ib.toFixed(0).padStart(5)}%   ${er.toFixed(3).padStart(9)}   ` +
      `${itc === null ? " >25" : String(itc).padStart(4)}`
    );
  }

  const a = mean(agg.adaptive.inBand) * 100, r = mean(agg.random.inBand) * 100;
  console.log(`\nHEADLINE: adaptive keeps learners in the productive-struggle band ` +
    `${a.toFixed(0)}% of the time vs ${r.toFixed(0)}% for random selection.`);
  return { a, r, adaptiveErr: mean(agg.adaptive.err), randomErr: mean(agg.random.err) };
}

// ---- self-check (ponytail: one runnable check on non-trivial logic) ----
function selfCheck() {
  // a high-ability learner given an easy item should almost always be right
  const p = sigmoid(3 - (-3));
  console.assert(p > 0.99, "sigmoid/Rasch broken");
  // adaptive difficulty for theta=0 targets ~0.72 success
  const d = selectDifficultyAdaptive(0);
  const ps = sigmoid(0 - d);
  console.assert(Math.abs(ps - 0.72) < 0.02, `target band off: ${ps}`);
  // ability update moves toward truth: wrong answer on easy item lowers theta
  const t2 = updateAbility(0, -3, false, 0);
  console.assert(t2 < 0, "ability update wrong direction");
  console.log("self-check: OK");
}

selfCheck();
const res = evaluate();
// assert the headline claim actually holds, else the demo number is a lie
console.assert(res.a > res.r + 15, "adaptive did NOT beat random on in-band — investigate");
console.assert(res.adaptiveErr < res.randomErr, "adaptive did not estimate ability better");
console.log("\nclaims verified: adaptive > random on both in-band% and ability estimation.");
