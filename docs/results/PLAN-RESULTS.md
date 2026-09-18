# Pip plans the next fence — measured (18 Sep 2026)

`node evals/plan_eval.mjs`, eight synthetic learner records, `deepseek-v4-flash` choosing and judging.
Code's list first, the model's pick second.

| record | code's next() | model's pick | line for the child |
|---|---|---|---|
| swapped the two numbers twice | 3x3_concrete | **3x4_concrete** | judge stopped it ("you fixed it" is not in the facts) |
| three first-try golds | 4x3_concrete | **4x5_concrete** | shipped: "a bigger fence to build" |
| pack per plank, after two golds | 4x3_concrete | **3x3_packs** | judge stopped it ("a small pack fence" is not in the facts) |
| stops at one part, repeatedly | 3x3_concrete | 3x3_concrete | shipped: "smaller parts to help you build all the parts" |
| ordered the standing planks (fix) | 4x3_concrete | **3x3_fix** | judge stopped it ("the small fence" is invented) |
| share: parts equal per, twice | 4x3_concrete | **2x3_share** | shipped: "a smaller one of the same kind" |
| over-count once, then fixed | 3x3_concrete | 3x3_concrete | shipped: "a fence with one more part" |
| silver everywhere in Build | 2x3_concrete | **3x3_concrete** | judge stopped it ("got it right after a little help" is not in the facts) |

Pick accepted 8/8 · differs from code's order 6/8 · line shipped 4/8 · p50 1.5 s · p95 1.6 s (two calls).

Since D-091 the list code hands the model holds only her current chapter's unmastered fences, so the
"pack per plank" and "fix" records can no longer be sent back to Build; `next()` above is still the
fixed graph order, which is why it names a Build fence there.

What this shows: the model's picks stay inside what code allows and, where they differ, they follow
the learner's record (stay in the kind she got wrong, go smaller after repeated trouble). What it does
not show: that the child learns more from these picks than from the fixed order. That needs the pilot.
