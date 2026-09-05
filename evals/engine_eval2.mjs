// Honest, NON-CIRCULAR evaluation of the Rung engine.
//
// The circularity critique of v1: the learner responded via the SAME 1PL model the engine
// assumes and adaptive selects difficulty≈ability, so "in-band %" was near-definitional.
//
// This eval removes that. The simulated child responds through a MISSPECIFIED, messier
// world the engine does NOT know:
//   - 2-parameter model: items have varying discrimination a∈[0.6,1.8] (engine assumes a=1)
//   - guessing/slips: P = g + (1-g)·sigmoid(a·(θ-d)), g=0.12
//   - the child actually LEARNS: θ drifts up as they practise
// The engine still only sees right/wrong and updates its plain 1PL estimate.
//
// Baseline is a REAL one a non-adaptive product ships: a fixed difficulty curriculum that
// ramps the same way for every child (not strawman random).
//
// Metric is meaningful and not definitional: "wasted questions" — items landing in
// FRUSTRATION (true success <40%) or BOREDOM (true success >90%). A good sequencer keeps a
// child out of both. Measured on the TRUE model the engine cannot see.
//
// Run: node evals/engine_eval2.mjs

import { updateAbility, selectDifficultyAdaptive, sigmoid } from "../src/engine/engine.mjs";

function mulberry32(s){ return function(){ s|=0; s=(s+0x6D2B79F5)|0;
  let t=Math.imul(s^(s>>>15),1|s); t=(t+Math.imul(t^(t>>>7),61|t))^t;
  return ((t^(t>>>14))>>>0)/4294967296; }; }

// the misspecified truth the engine never sees
function trueSuccess(theta, d, a, g){ return g + (1-g)*sigmoid(a*(theta - d)); }

function fixedCurriculum(i, items){ return -3 + (i/(items-1))*6; } // same ramp for everyone

function runChild(policy, rng, items=25){
  let theta = -2.5 + rng()*5;         // true starting ability
  let est = 0;                         // engine's estimate (starts naive)
  const a0 = 0.6 + rng()*1.2;          // this child's item discrimination (engine assumes 1)
  const g = 0.12;
  let frustrated=0, bored=0, masteredAt=null;
  const startTheta = theta;
  for(let i=0;i<items;i++){
    const a = a0*(0.8+0.4*rng());      // per-item wobble
    const d = policy==="adaptive" ? selectDifficultyAdaptive(est) : fixedCurriculum(i, items);
    const p = trueSuccess(theta, d, a, g);
    if(p < 0.40) frustrated++;
    if(p > 0.90) bored++;
    const correct = rng() < p;
    est = updateAbility(est, d, correct, i);
    theta += correct ? 0.06 : 0.01;    // the child learns a little from every item
    if(masteredAt===null && theta-startTheta >= 0.8) masteredAt = i+1;
  }
  return { wasted:(frustrated+bored)/items, frustrated:frustrated/items,
           bored:bored/items, growth: theta-startTheta, estErr: Math.abs(est-theta) };
}

function evaluate(){
  const N=600, items=25, rng=mulberry32(2024);
  const acc = { adaptive:{w:[],f:[],b:[],g:[]}, fixed:{w:[],f:[],b:[],g:[]} };
  for(let l=0;l<N;l++){
    // paired: same rng stream position parity not required; draw per policy from same stream
    for(const p of ["adaptive","fixed"]){
      const r = runChild(p, rng, items);
      acc[p].w.push(r.wasted); acc[p].f.push(r.frustrated);
      acc[p].b.push(r.bored);  acc[p].g.push(r.growth);
    }
  }
  const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
  console.log(`\nRung engine — NON-CIRCULAR eval (${N} children; learner model ≠ engine model)`);
  console.log("learner: 2PL + guessing + learns over time; engine only sees right/wrong (1PL)\n");
  console.log("policy     wasted Qs   frustrated   bored     ability growth");
  console.log("-".repeat(62));
  for(const p of ["adaptive","fixed"]){
    console.log(`${p.padEnd(10)} ${(mean(acc[p].w)*100).toFixed(0).padStart(6)}%   `+
      `${(mean(acc[p].f)*100).toFixed(0).padStart(7)}%   ${(mean(acc[p].b)*100).toFixed(0).padStart(5)}%   `+
      `${mean(acc[p].g).toFixed(2).padStart(10)}`);
  }
  const wa=mean(acc.adaptive.w)*100, wf=mean(acc.fixed.w)*100;
  console.log(`\nHEADLINE: even when the engine's assumptions are WRONG, adaptive wastes `+
    `${wa.toFixed(0)}% of questions vs ${wf.toFixed(0)}% for a fixed curriculum`);
  console.log(`(wasted = child was bored or frustrated — measured on the true model the engine can't see).`);
  return { wa, wf };
}

const r = evaluate();
console.assert(r.wa < r.wf - 5, "adaptive did not beat fixed curriculum under misspecification");
console.log(r.wa < r.wf - 5 ? "\nrobust result: adaptive beats a real baseline under model misspecification." : "\nWEAK");
