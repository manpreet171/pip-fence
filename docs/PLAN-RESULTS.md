# Pip plans the next fence — measured (18 Sep 2026)

`node evals/plan_eval.mjs`, eight synthetic learner records, `deepseek-v4-flash` choosing and judging.
Code's list first, the model's pick second.

| record | code's next() | model's pick | line for the child |
|---|---|---|---|
| swapped the two numbers twice | 3x3_concrete | **4x3_concrete** | shipped: a fence where the two numbers differ, "so you can show which number goes with parts" |
| three first-try golds | 4x3_concrete | 4x3_concrete | shipped: "a bigger fence with more parts" |
| pack per plank, after two golds | 4x3_concrete | **3x3_packs** | judge stopped it ("packs of three" is not in the facts) |
| stops at one part, repeatedly | 3x3_concrete | 3x3_concrete | gate stopped it (vocabulary) |
| ordered the standing planks (fix) | 4x3_concrete | **3x3_fix** | shipped: same kind, "a slightly bigger one" |
| share: parts equal per, twice | 4x3_concrete | **2x3_share** | shipped: "a smaller one of the same kind" |
| over-count once, then fixed | 3x3_concrete | 3x3_concrete | judge stopped it ("kept the parts even" is invented) |
| silver everywhere in Build | 2x3_concrete | 2x3_concrete | shipped: "a smaller one with the same idea" |

Pick accepted 8/8 · differs from code's order 4/8 · line shipped 5/8 · p50 1.3 s · p95 1.9 s (two calls).

What this shows: the model's picks stay inside what code allows and, where they differ, they follow
the learner's record (stay in the kind she got wrong, go smaller after repeated trouble). What it does
not show: that the child learns more from these picks than from the fixed order. That needs the pilot.
