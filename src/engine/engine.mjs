// Rung adaptive engine — the maths heart.
// Rasch/Elo model. Ability theta and item difficulty on one logit scale.
// P(correct) = sigmoid(theta - difficulty). Targeting difficulty ~= theta puts the learner
// near ~50-75% success: the productive-struggle band (RESEARCH.md §4).
//
// Truth is owned by code (correct-by-construction pillar): every problem is generated with
// its exact answer. The LLM never computes anything.

export const sigmoid = (x) => 1 / (1 + Math.exp(-x));

// ---- problem generation: difficulty (logit) -> a concrete, exactly-answered problem ----
// We map a continuous difficulty to arithmetic whose hardness rises monotonically:
// bigger operands, carrying/borrowing, then multiplication. Answer computed here.
export function generateProblem(difficulty, rng = Math.random) {
  // difficulty roughly in [-4, 4]; clamp and bucket
  const d = Math.max(-4, Math.min(4, difficulty));
  const tier = Math.round((d + 4) / 8 * 6); // 0..6
  const ri = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
  let a, b, op, text, answer;
  if (tier <= 1) {            // single-digit add
    a = ri(2, 9); b = ri(2, 9); op = "+";
  } else if (tier === 2) {    // two-digit + one/two-digit, no carry-heavy
    a = ri(11, 40); b = ri(5, 40); op = "+";
  } else if (tier === 3) {    // two-digit subtraction with borrow
    a = ri(30, 90); b = ri(11, a - 1); op = "-";
  } else if (tier === 4) {    // two-digit add with carries
    a = ri(25, 89); b = ri(25, 89); op = "+";
  } else if (tier === 5) {    // single x two-digit mult
    a = ri(3, 9); b = ri(11, 29); op = "*";
  } else {                    // two-digit x two-digit
    a = ri(12, 49); b = ri(12, 29); op = "*";
  }
  answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
  const sym = op === "*" ? "×" : op;
  text = `${a} ${sym} ${b}`;
  return { text, answer, difficulty: d, a, b, op };
}

// ---- ability update: Elo on the Rasch model ----
// After an answer, nudge theta toward evidence. K decays as we gather more (confidence up).
export function updateAbility(theta, itemDifficulty, correct, nSeen) {
  const expected = sigmoid(theta - itemDifficulty);
  const K = 1.2 / (1 + nSeen * 0.15);   // adaptive step: large early, small later
  return theta + K * ((correct ? 1 : 0) - expected);
}

// ---- selection policies ----
// Adaptive: choose difficulty that lands success prob in the target band centre.
// For Rasch, P=target when difficulty = theta - logit(target). target 0.7 -> slightly easy
// of theta, keeping the learner in the productive-struggle band, not at frustration (0.5).
const TARGET = 0.72;
const targetOffset = Math.log(TARGET / (1 - TARGET)); // logit(0.72) ≈ 0.94
export function selectDifficultyAdaptive(theta) {
  return theta - targetOffset + 0; // difficulty just below ability -> ~72% success
}
// Baselines for the honest comparison:
export function selectDifficultyRandom(_theta, rng = Math.random) {
  return -4 + rng() * 8;                 // ignores the learner entirely
}
export function selectDifficultyFixedRamp(nSeen) {
  return -3 + Math.min(6, nSeen * 0.3);  // preset ramp, same for every child
}

// ---- one adaptive session step (used by the product) ----
export function nextItem(state, rng = Math.random) {
  const d = selectDifficultyAdaptive(state.theta);
  return generateProblem(d, rng);
}
