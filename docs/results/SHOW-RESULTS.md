# Pip shows her — measured (18 Sep 2026)

`node evals/show_eval.mjs`, six real fence states, `deepseek-v4-flash` writing the moves, code simulating them.

| fence state | outcome | moves | Pip's lines |
|---|---|---|---|
| one part short (3,1,3 of 3) | model | point, count, place, count, place, count, say, say | "This part now holds the same as the others." "The rest of the fence is yours to finish." |
| every part one short (3,3,3 of 4) | model | point, count, place, count, say, say | "This part now holds the full amount." "The other parts still need your care." |
| parts and planks swapped (3,3,3 of 4) | gate: "one more plank" | code's script | "This part is short. I count it first." "Now it comes up to the top of its post. You do the other parts like this." |
| one part over the post (3,5,1 of 3) | model | point, count, say, remove, remove, count, say, say | "This part has too many planks for its share." "Now this part holds its share, like every part should." |
| only the first part built (3,0,0,0 of 3) | model | point, count, say, point, count, place ×3, say, point, say | "This part is finished." "Now this part is finished too." "Your turn: keep going along the fence." |
| fix: gaps left (4,2,4 of 4) | model | point, count, place, place, count, say, say | "This part now holds the same as the others." |

Passed the simulation and the gate 5/6 · code's script 1/6 · p50 1.8 s · p95 5.8 s.

Every performed script fixed exactly one part and handed back. The rejected one was a good script
with a number word in a line; the gate is doing its job and the child still saw a worked example.
