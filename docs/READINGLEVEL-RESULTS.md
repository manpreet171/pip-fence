# READING-LEVEL RESULTS — the six hint templates, measured (4 Sep 2026)

CRITIC-R2 #13: "reading level is asserted, never measured; the 500-word list is unnamed."
Now named and measured. List = **Dolch Sight Words** (220 service + 95 nouns, public domain),
committed at `data/wordlist.txt`, plus a separately-reported 28-word DOMAIN list of screen
vocabulary (part, plank, pack, fence, post, cart, …). Scorer: `evals/readinglevel.py` — pure
code, no model.

## Result on the six v3.1 templates

| Template | Sent. | Words/sent | Dolch | +Domain | Out-of-list | Number word? |
|---|---|---|---|---|---|---|
| One part of the fence is shorter than the others. Count a full one again. | 2 | 7.5 | 60% | 87% | than, others | **YES ("one")** |
| Every part of the fence is a little short. Look at how tall a full part should be. | 2 | 9.0 | 67% | 94% | should | no |
| You used the number of parts as the size of each part. Check what goes in one part. | 2 | 9.0 | 56% | 78% | used, number, size, check | **YES** |
| Only one part of the fence is built. The other parts are still empty. | 2 | 7.0 | 50% | 86% | other, still | **YES** |
| One part has a plank sticking out past the post. Take it back to the cart. | 2 | 8.0 | 62% | 94% | past | **YES** |
| A pack holds several planks, not one. Look inside a pack. | 2 | 5.5 | 45% | 100% | — | **YES** |

**Overall:** max 2 sentences ✅ · mean 7.7 words/sentence ✅ · Dolch coverage 57% · Dolch+domain
90% · out-of-list words: *check, number, other, others, past, should, size, still, than, used* ·
**hints containing a number word: 5 of 6 — must be 0.**

## What this means

1. **The templates violate the product's own gate.** CONCEPT-V3.1 §3 bans every number word
   including *one*. Five templates use "one" ("One part…", "…not one", "…in one part"). As
   written, the output gate would reject them and fall back to… themselves. v3.1 §10.6 predicted
   exactly this: *"the list wins, not the prose."* It did.
2. **"One" is not a leak risk — it is a rule-consistency problem.** "One part" is a determiner,
   not a count of planks. The gate could exempt the determiner sense, but a lexical gate cannot
   tell "one part" from "one more plank" (Critic R2, N2). The honest fix is to rewrite the
   templates without it, which keeps the gate simple and the claim clean.
3. **Out-of-list words are fixable.** *than/others/other/still/should/past/used/check/size/number*
   are Year-3+ or abstract. Rewrites tested below.
4. **Sentence length and count are fine.** 7.7 words/sentence, all ≤2 sentences.

## Candidate gate-compliant rewrites — see the scored run appended below

### Scored run — six gate-compliant rewrites (`data/hints_v2.txt`)

| Rewrite | Sent. | Words/sent | Dolch | +Domain | Out-of-list | Number word? |
|---|---|---|---|---|---|---|
| That part of the fence is short. Count a full part again. | 2 | 6.0 | 58% | 100% | — | no |
| Every part of the fence is a little short. Look at how tall a full part is. | 2 | 8.5 | 71% | 100% | — | no |
| Each part needs the same planks. Look at what is in a full part. | 2 | 7.0 | 57% | 86% | needs, same | no |
| Only the first part is built. The other parts are still empty. | 2 | 6.0 | 50% | 83% | other, still | no |
| That part has a plank sticking out past the post. Take it back to the cart. | 2 | 8.0 | 62% | 94% | past | no |
| A pack holds many planks. Look inside a pack. | 2 | 4.5 | 44% | 100% | — | no |

**Overall:** max 2 sentences ✅ · **6.7 words/sentence** (down from 7.7) · Dolch 57% · **Dolch+domain
94%** (up from 90%) · out-of-list: *needs, other, past, same, still* · **number words: 0 of 6 ✅**.

**Conclusion:** the zero-number-word gate is satisfiable without loss of meaning — "That part" and
"the first part" replace every "one". The constraint is real and the templates now pass it.

**Open call for v3.2 / the critic:** the five residuals (*other, still, same, needs, past*) are
common Year-2 words that are not Dolch. Two honest options: (a) extend BASE with a second *named*
list (Fry's first 300 contains *other* and *still*), or (b) accept and publish "5 non-Dolch words
across 6 hints." Either is defensible; silently relabelling them as DOMAIN is not.

**Note on `counted_groups_as_group_size`:** the original hint ("You used the number of parts as
the size of each part") was the worst-scoring template (Dolch 56%, four out-of-list words) AND the
most abstract. The rewrite ("Each part needs the same planks. Look at what is in a full part.")
is shorter and concrete, but says less. Whether an 8-year-old gets the point is exactly what the
tap-to-count channel exists to test — the hint points, the tap confirms.


---

## FINAL RUN — Dolch ∪ Fry (named), inflections stripped per CONCEPT-V3.2 §3

Fry's first 300 added as a second named BASE section; scorer strips `-s/-es/-ing/-ed` before
lookup, exactly as §3 defines "out-of-list". Six v2 templates:

- sentences per hint: max **2** ✅ · mean **6.7** words/sentence ✅
- Dolch-only coverage **72%** (was 57%) · **Dolch ∪ Fry ∪ domain: 98%**
- **number words: 0 of 6** ✅
- out-of-list: **`past`** only (from "sticking out *past* the post") — one word across six hints.

The residual-word question the critic raised is closed by a named list, not by relabelling:
*other, still, same* are Fry words; *needs* → *need* is Fry once inflection is handled per spec.
`past` is the single honest residual and is published as such (or the over-count hint becomes
"…sticking out *over* the post" — *over* is Dolch — which is the cheaper fix).


---

## TIERED RUN — 8 ids × 3 tiers, `id<TAB>tier<TAB>text` (6 Sep 2026)

`data/hints_v2.txt` now carries all 24 templates the buddy can ship (tier 1 = point, tier 2 =
point harder, tier 3 = walk her to the spot; never a count). The six existing tier-1 texts are
verbatim (over_count says *over* the post — `past` was the last residual). `evals/readinglevel.py
--assert` now checks **every line**: ≤2 sentences, zero digits, none of the **25 number words**
(the same literal list `gate()` in `buddy.mjs` uses, incl. *one/once/single/pair/couple/both/twice/
half/double*), and ≤2 out-of-list words. Scorer unchanged otherwise: Dolch ∪ Fry BASE, 28-word
DOMAIN reported separately, `-s/-es/-ing/-ed` stripped before lookup.

| id | tier | Sent. | Words/sent | Base | +Domain | Out-of-list | Number word? |
|---|---|---|---|---|---|---|---|
| `off_by_one_in_one_group` | 1 | 2 | 6.0 | 75% | 100% | — | no |
| `off_by_one_in_one_group` | 2 | 2 | 8.5 | 94% | 100% | — | no |
| `off_by_one_in_one_group` | 3 | 2 | 10.5 | 86% | 100% | — | no |
| `off_by_one_per_group` | 1 | 2 | 8.5 | 82% | 100% | — | no |
| `off_by_one_per_group` | 2 | 2 | 8.0 | 88% | 100% | — | no |
| `off_by_one_per_group` | 3 | 2 | 9.5 | 84% | 100% | — | no |
| `counted_groups_as_group_size` | 1 | 2 | 7.0 | 93% | 100% | — | no |
| `counted_groups_as_group_size` | 2 | 2 | 10.5 | 86% | 100% | — | no |
| `counted_groups_as_group_size` | 3 | 2 | 10.0 | 90% | 100% | — | no |
| `one_group_only` | 1 | 2 | 6.0 | 83% | 100% | — | no |
| `one_group_only` | 2 | 2 | 7.0 | 71% | 100% | — | no |
| `one_group_only` | 3 | 2 | 9.5 | 84% | 100% | — | no |
| `over_count` | 1 | 2 | 8.0 | 81% | 100% | — | no |
| `over_count` | 2 | 2 | 9.5 | 84% | 100% | — | no |
| `over_count` | 3 | 2 | 10.0 | 80% | 100% | — | no |
| `right_total_wrong_grouping` | 1 | 2 | 9.0 | 83% | 100% | — | no |
| `right_total_wrong_grouping` | 2 | 2 | 10.5 | 86% | 100% | — | no |
| `right_total_wrong_grouping` | 3 | 2 | 7.5 | 80% | 100% | — | no |
| `pack_unit_confusion` | 1 | 2 | 4.5 | 56% | 100% | — | no |
| `pack_unit_confusion` | 2 | 2 | 7.5 | 60% | 100% | — | no |
| `pack_unit_confusion` | 3 | 2 | 9.0 | 67% | 100% | — | no |
| `ambiguous` | 1 | 1 | 7.0 | 86% | 100% | — | no |
| `ambiguous` | 2 | 2 | 7.5 | 93% | 100% | — | no |
| `ambiguous` | 3 | 2 | 10.0 | 90% | 100% | — | no |

**Overall (24 templates):** max 2 sentences ✅ · mean **8.3 words/sentence** (tier 3 is longer by
design — it walks) · Dolch ∪ Fry coverage **82%** · **Dolch ∪ Fry ∪ domain 100%** · out-of-list
words: **none** · **number words: 0 of 24** ✅.

Output of `python evals/readinglevel.py --assert`:
`gate assert OK: 24 templates, 0 number words, <=2 sentences, <=2 out-of-list words each`.
One rewrite during scoring: ambiguous t3 *"…reach the top of the post"* → *"…come up to the top of
the post"* (*reach* was the only out-of-list word; *come*, *up* are Dolch).

Caveat the number does not hide: coverage measures vocabulary, not comprehension. Whether the
tier-2 `counted_groups_as_group_size` sentence ("How many parts there are is not how many planks go
in a part") lands with an 8-year-old is a pilot question (day 13 Sep), not a wordlist question.
