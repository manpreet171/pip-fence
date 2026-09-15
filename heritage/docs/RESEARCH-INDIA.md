# RESEARCH-INDIA — Games and playful mathematics from ancient and classical India

Research memo, 15 Sep 2026. Scope: raw material for a 7–12 learning game with an AI angle. Every claim carries a URL and a confidence mark (High / Medium / Low). "Attested" means found in a datable text or object; "popular" means widely repeated without a datable source. Where the sources disagree, the disagreement is recorded, not smoothed over.

Method note: web search plus fetch of primary/scholarly pages; four PDFs (Price 2000 on Śulba geometry, Dani 2020 on Kātyāyana, Schmidt-Madsen 2019 PhD on Gyān Caupaṛ, NCERT Ganita Prakash grades 6–8) were downloaded and text-extracted locally so that the exact wording could be checked. Several paywalled or bot-blocked pages (ResearchGate, mancala.fandom, Springer, academia.edu) could not be read; where only an abstract or secondary summary was available, confidence is capped at Medium.

---

## 1. Śulba Sūtras (c. 800–200 BCE): fire-altar geometry

### 1.1 What the texts are and when
- Four main Śulba Sūtras: Baudhāyana, Mānava, Āpastamba, Kātyāyana; appendices to the Śrauta ritual manuals, giving cord-and-peg geometry for laying out sacrificial grounds and brick altars (citi). Wikipedia (citing Plofker 2009, Pingree 1981): Baudhāyana "possibly compiled around 800 BCE to 500 BCE", Kātyāyana after Pāṇini (mid-4th c. BCE). https://en.wikipedia.org/wiki/Shulba_Sutras — **High** that these are the texts and the rough order; **Medium** on any specific date.
- Dani (2020, arXiv) is blunter: Kashikar's ranges are Baudhāyana 800–500 BCE, Āpastamba/Mānava 650–300 BCE, Kātyāyana 300 BCE–400 CE, and "all dates seem to be quite speculative, and there do not seem to be dependable inputs on the issue." https://arxiv.org/pdf/2006.10285 — **High** (direct quote from the paper).
- MacTutor gives point dates (Baudhāyana c. 800 BC, Mānava c. 750, Āpastamba c. 600, Kātyāyana c. 200 BC). https://mathshistory.st-andrews.ac.uk/HistTopics/Indian_sulbasutras/ — **Medium** (these are conventional, not evidenced).

Practical consequence for a game: say "roughly 2,500 years ago", never "800 BCE" as a fact.

### 1.2 The diagonal rule ("Baudhāyana theorem")
- Baudhāyana states two things: (a) "The diagonal of a square produces double the area [of the square]" (the dvikaraṇī, doubling rule); (b) "The areas [of the squares] produced separately by the length and the breadth of a rectangle together equal the area [of the square] produced by the diagonal." https://en.wikipedia.org/wiki/Shulba_Sutras — **High**.
- Dani's close translation: "the diagonal of a rectangle makes as much (area) as (the areas) made separately by the base and the side put together"; the same statement recurs in Kātyāyana 2.7 followed by "iti kṣetrajñānam" ("this is the knowledge of figures"), which Dani reads as pedagogical emphasis. He also notes: "neither the notion of a right angle nor of a right angled triangle are found in the Śulvasūtras, as concepts" — the rule is stated for rectangles. https://arxiv.org/pdf/2006.10285 — **High**.
- Āpastamba lists the triples (3,4,5), (5,12,13), (8,15,17), (12,35,37). https://en.wikipedia.org/wiki/Shulba_Sutras — **High**.
- No proof is given in any Śulba text; they are rule-books. Mumford's AMS review of Plofker: "It is completely clear that this result was known to" the Vedic priests, and the theorem mattered "because an altar often had to" be scaled while keeping shape. https://www.dam.brown.edu/people/mumford/beyond/papers/2010a--PlofkerReview-AMS.pdf — **High** for the point that it is a used rule, not a proved theorem.
- Myth flag: "Baudhāyana proved Pythagoras first" is popular, not attested. What is attested is the earliest *verbal statement* of the rule plus worked triples.

### 1.3 Cord-and-peg (the 3-4-5 rope)
- Śulba = cord/rope. A cord of 12 units with marks (nyañcana) at 3 and 7, pegged at its ends and pulled taut at the mark, gives the (3,4,5) right angle. Wikipedia and Dani both describe the nyañcana operation. https://en.wikipedia.org/wiki/Shulba_Sutras , https://arxiv.org/pdf/2006.10285 — **High**.
- Baudhāyana's square construction begins with a measuring cord and pegs (opening of the Baudhāyana Śulba). https://en.wikipedia.org/wiki/Shulba_Sutras — **High**.

### 1.4 Equal-area transformations (what is actually in the text)
| Transformation | What the text says | Source | Conf. |
|---|---|---|---|
| Double a square | Use the diagonal as the new side (dvikaraṇī) | Wikipedia; Dani | High |
| Add two squares | Cut a rectangle from the larger square with width = side of smaller; its diagonal is the side of the sum-square (direct use of the diagonal rule) | Dani §5, Fig. 1 | High |
| Subtract two squares | Same figure, reversed | Dani §5 | High |
| Rectangle → square | Cut off a square, split the excess, rearrange into an L/gnomon, then subtract the small corner square (Baudhāyana; MacTutor, Price §2.5) | https://mathshistory.st-andrews.ac.uk/HistTopics/Indian_sulbasutras/ | High |
| Square → circle | Radius = half-side + one-third of (half-diagonal minus half-side). Area error about +1.7% (π ≈ 3.088) | Dani §6; Wikipedia | High |
| Circle → square | Side = diameter × (1 − 1/8 + 1/(8·29) − …), i.e. side ≈ 13/15 of diameter (π ≈ 3.004) | MacTutor; Dani §6 | High |
| √2 | "Increase a unit length by its third and this third by its own fourth less the thirty-fourth part of that fourth" = 577/408 = 1.41421568…, correct to 5 places | MacTutor; Wikipedia | High |

Note for a 7–12 game: doubling, adding two squares, and rectangle→square are grid-reconstructable with unit tiles. Square↔circle is not exactly reconstructable with bricks and the ancient rule is only approximate; teach it as "the ancients had a good-enough rule" or leave it out.

### 1.5 The altars: what is attested about brick counts and layouts
- Price (2000, "Applied Geometry of the Śulba Sūtras", in *Geometry at Work*, MAA), text extracted locally: "Each of the citis is constructed from five layers of bricks, the first, third and fifth layers being of the same design, as are the second and fourth… successive layers are built so that no joins lie along each other… Generally each layer has 200 bricks with the exception of the gārhapatya citi which has 21 bricks in each layer." Layer height 6.4 aṅgulas (~4.8 in); 120 aṅgulas = 1 puruṣa (~7 ft 6 in). "For each design (with the exception of the gārhapatya citi), the citi is first constructed with an area of 7.5 square puruṣas, then with 8.5 square puruṣas, and so on up to 101.5 square puruṣas (BSS II, 1–6). Verse II, 12 explains how these increases in size are to be brought about": scale the unit so that one square puruṣa becomes 1 + 2q/15 square puruṣas. Śyena citi construction is BSS III, 62–104; rathacakra (chariot wheel) BSS III, 187–214, computed in bricks of area 1/30 sq. puruṣa → 7.5 × 30 = 225 bricks (nave 16, spokes 64, rim 145; with the gaps 289 = 17²; Price notes 15² + 8² = 17²). https://sanskrit.uohyd.ac.in/Algorithms_in_Ancient_India/7-3-2018/Applied+Geometry+in+SulbaSutras.pdf — **High** (direct extraction from the published paper).
- Bhāvanā's "The Act as Knowledge" (on Staal/Seidenberg) independently: five layers, exactly 200 bricks per layer, area 7.5 units per layer, vertical joints never coincide, 14 standard brick shapes; the composers had to satisfy brick count, area and non-aligned joints simultaneously — "a system of indeterminate equations in several variables". https://bhavana.org.in/the-act-as-knowledge/ — **High** that this is the scholarly consensus summary.
- 5 layers × 200 = 1000 bricks is the *textbook* Śyena. Wikipedia's Agnicayana page says the Nambudiri altar Staal filmed in 1975 was "built out of 1005 bricks"; Mahavidya says "a minimum of 10,800 kiln-fired bricks". The 10,800 figure belongs to the Śatapatha Brāhmaṇa's symbolic counting (10,800 = muhūrtas in a year) and the ritual as performed, not the Śulba layout. https://en.wikipedia.org/wiki/Agnicayana , https://mahavidya.ca/2010/08/19/the-agnicayana-ritual/ — **Medium**; the three figures describe three different things (Śulba design / 1975 performance / Brāhmaṇa numerology), and a game should use 200 × 5 = 1000 and say "in the design manuals".
- The 360-enclosing-bricks = days-of-the-year claim is calendrical symbolism from the Brāhmaṇas (arXiv 0708.0427, Kak), not Śulba geometry. https://arxiv.org/pdf/0708.0427 — **Medium**; avoid in a maths game.
- Earliest physical falcon altars: Kuninda-period (2nd c. BCE–2nd c. CE). https://en.wikipedia.org/wiki/Agnicayana — **Medium**.
- Layouts: Price's figures 7–8 show Śyena layers 1/3/5 vs 2/4 (odd layers: 9 of type 1 + 12 of type 2 for the gārhapatya; even layers 6 of type 3 + 16 of type 1). The gārhapatya (21 bricks per layer on a 1-vyāyāma square, bricks of 1/6, 1/4, 1/3 vyāyāma) is the only altar small enough to reconstruct fully on a child-size grid. https://sanskrit.uohyd.ac.in/Algorithms_in_Ancient_India/7-3-2018/Applied+Geometry+in+SulbaSutras.pdf — **High**.

### 1.6 What a child could reconstruct with bricks on a grid
- Gārhapatya: 21 bricks per layer, two alternating layer patterns, joints must not line up. A 6×6 or 12×12 grid with three brick sizes. Fully attested and small. **High** on the counts (Price).
- Śyena: 200 bricks / 7.5 sq. puruṣa is real but requires 14 brick shapes and is too big for a phone screen at true scale; a simplified "falcon silhouette on a grid, fill it with exactly N bricks of these shapes, no aligned seams" keeps the attested constraints while dropping the exact plan. Mark in-game as "simplified".
- Enlargement (7.5 → 8.5 → … → 101.5 sq. puruṣa, same shape) is the mathematically deepest and least known feature: it is a scaling problem. Attested (BSS II, 1–6, 12). Good for ages 10–12 (area scales with side²).
- Classroom precedent: MAA Convergence published "Ancient Indian Rope Geometry in the Classroom" (fire-altars series) — the server returned 521 twice during this research, so its content could not be verified; treat it as "exists" only. https://old.maa.org/press/periodicals/convergence/ancient-indian-rope-geometry-in-the-classroom-fire-altars-of-ancient-india — **Low** on content.

### 1.7 Cultural notes for §1
- The Agnicayana is a Brahmin śrauta ritual; today it survives mainly among Kerala Nambudiris and was filmed by Staal in 1975. https://en.wikipedia.org/wiki/Agnicayana — **High**. A game can use the geometry without staging the sacrifice; avoid depicting priests, mantras or animal offerings.
- "Vedic Mathematics" (Tirthaji 1965) is unrelated to the Śulba Sūtras and its 16 sūtras are not in any Veda; Dani (IIT Bombay) calls it a disservice to both maths education and historiography. https://en.wikipedia.org/wiki/Vedic_Mathematics — **High**. Do not brand anything "Vedic maths".

---

## 2. Līlāvatī (Bhāskara II, 1150 CE): verse word problems

### 2.1 The book
- Composed 1150 CE; first part of the Siddhānta-śiromaṇi; 13 chapters (definitions, arithmetic, interest, progressions, plane and solid geometry, gnomon shadow, kuṭṭaka, combinations). https://en.wikipedia.org/wiki/L%C4%ABl%C4%81vat%C4%AB — **High**.
- The "daughter and the water-clock pearl" story comes from Fyzi's Persian translation of 1587, four centuries later; it is tradition, not attested in Bhāskara. https://en.wikipedia.org/wiki/L%C4%ABl%C4%81vat%C4%AB — **High** that this is the source; **Low** that the legend is true. Colebrooke (1817) notes the name is read by commentators as "charming". https://archive.org/stream/colebrookestrans00hcba/colebrookestrans00hcba_djvu.txt — **High**.
- The problems address a listener directly ("O expert businessman", "beautiful maiden"). This *is* attested in the verses. **High**.

### 2.2 Problem texts (Colebrooke 1817 numbering where available)
| Problem | Text (Colebrooke unless noted) | Answer | Suitable 7–12? |
|---|---|---|---|
| Bees (§68) | "The square root of half the number of a swarm of bees is gone to a shrub of jasmin; and so are eight-ninths of the whole swarm; a female is buzzing to one remaining male…" | 72 | No — square roots, quadratic |
| Bees (Kadamba, §54 area) | "One-fifth of a swarm of bees flew to the Kadamba flower, one-third flew to the Silandhara, three times the difference of these two numbers flew to an arbor. One bee remained…" | 15 | Yes (11–12) — fractions of a whole |
| Geese (§64) | "One pair out of a flock of geese remained sporting in the water, and saw seven times the half of the square root of the flock proceeding to the shore" | 16 | No — square root |
| Necklace (note to §54) | "The third part of a necklace of pearls, broken in an amorous struggle, fell to the ground; its fifth part rested on the couch: the sixth part was saved by the wench; and the tenth part was taken up by her lover; six pearls remained strung" | 30 | Content: rewrite as "dropped while dancing"; maths yes (11–12) |
| Peacock and snake | Pillar 9 (hastas) high, snake 27 from the hole, peacock swoops diagonally; where do they meet? | 12 from the pillar | 12 only; needs a²+b²=c² |
| Broken bamboo | 32 cubits tall, tip touches ground 16 from the root; where did it break? | 12 | 12 only |
| Lotus | Flower ½ cubit above water, blown over touches water 2 cubits away; depth? | 3¾ | 12 only |
| Monkey climbing | Tree 100 cubits, up 5 slips 2 per leap | 33 leaps (per the secondary source) | Yes (8–10) — but see note |
| "Beautiful maiden" chain | ×3, +¾ of product, ÷7, −⅓, square, −52, √, +8, ÷10 = 2 | 28 | 10–12 as a work-backwards puzzle |
| Saffron (proportion) | "If 2½ palas of saffron costs 3/7 niṣkas, O expert businessman! tell me quickly what quantity of saffron can be bought for 9 niṣkas?" (as printed in NCERT Grade 8) | proportional | Yes (11–12) |

Sources: Colebrooke full text https://archive.org/stream/colebrookestrans00hcba/colebrookestrans00hcba_djvu.txt (**High** for §54, §64, §68 wording and answers); peacock/snake wording via MAA Convergence search summary and ProofWiki (**Medium**); bamboo, lotus, monkey, maiden via a secondary page https://gauravtiwari.org/a-problem-solution-from-bhaskaracharyas-lilavati/ (**Medium** — the monkey problem's answer "33 leaps" is arithmetically wrong under the usual reading; net 3 per leap reaches 97 after 32 leaps and the top on the 33rd only if a full 5 is allowed at the end — verify against Colebrooke before using); saffron via NCERT Ganita Prakash Grade 8 ch. 7, locally extracted https://ncert.nic.in/textbook/pdf/hegp107.pdf (**High**).

### 2.3 Pedagogy
- The riddle form (nature imagery, direct address, "tell me quickly") is attested throughout and is the reason the book was used as a school text for 700 years. https://en.wikipedia.org/wiki/L%C4%ABl%C4%81vat%C4%AB — **High** on form, **Medium** on the claim of continuous school use.
- Honest constraint: most famous Līlāvatī problems need square roots or quadratics — i.e. ages 13+. The 7–12 subset is: fractions-of-a-whole (bees/necklace type), proportion (saffron), simple progressions, and the "work-backwards chain". Age 7–9 material has to be *written in the Līlāvatī style* rather than lifted from it. Say so in the product: "in the style of Līlāvatī".

---

## 3. Sowing games (mancala family in India)

### 3.1 Pallanguzhi / Pallāṅkuḻi (Tamil Nadu, Sri Lanka, Kerala as Kuḻipara)
Rules are **not standardised**; the sources disagree on seed count and capture number. Recorded variants:

| Source | Board | Seeds | Start | Capture on N | Empty-pit rule |
|---|---|---|---|---|---|
| Wikipedia (citation-needed tag since 2011) https://en.wikipedia.org/wiki/Pallanguzhi | 2×7 | 148 | 12 per pit, 2 in each middle pit | 6 ("pasu") | last seed → next pit empty → capture the pit beyond; two empties → turn ends |
| Ananthanarayanan blog (family rules) https://ananthv9.wordpress.com/2018/08/17/playing-pallanguzhi-the-traditional-game-of-the-great-kings-involving-strategy-and-numbers/ | 2×7 | 146 | 12 per pit, 1 in each middle | 6 | same; unfilled pits become "rubbish holes" next round |
| traditionalgames.co.in https://www.traditionalgames.co.in/pallanguzhi | 2×7 | 84 | 6 per pit | 4 | same; refill 6 per pit each round |
| Teacher Plus (Chennai school project) https://teacherplus.org/2020/2020/may-june-2020/pallankuzhi-a-school-math-project/ | 2×7 | 84 | 6 per pit | not used | last seed in empty pit → capture next pit, turn ends |
| pallanguzhiguide.com (commercial, cites "TGFI 2023", no bibliography) https://www.pallanguzhiguide.com/rules-of-playing-pallanguzhi/ | 2×7 | 70–100 | 5 or 7 | 4 | own-side empty → capture opposite |
| rollthedice.in https://rollthedice.in/pages/how-to-play-pallanguzhi | 2×6 | 72 | 12 | none | own-side empty → capture opposite |

Confidence: **High** that the 2×7 board, relay sowing (pick up the *next* pit after your last seed and keep going), the "one empty pit then capture the pit beyond it" rule, the "pasu" instant capture when a pit reaches a set count (4 or 6), and the multi-round refill with closed ("rubbish") pits are the genuine Tamil family of rules — they recur across independent sources and Murray (1952) and Balambal (2005) are cited for variant lists https://mancala.fandom.com/wiki/Pallankuzhi (page itself blocked; cited via search). **Low** on any single "official" count. The 146 vs 148 vs 84 difference is exactly the kind of thing to make a *setting* in a game, not a fact.
- Social history: a women's and children's game in Tamil Nadu; boards in wood, clay, or scratched in the ground. https://en.wikipedia.org/wiki/Pallanguzhi — **Medium**.
- "Game of the great kings"/"played in Chola courts" — popular, no datable source found. **Low**; do not claim.

### 3.2 Ali Guli Mane / Aliguli Mane (Karnataka; Chenne Mane in Tulu Nadu; Akal Patta north Karnataka; Satkoli Maharashtra)
- 2×7, 70 seeds (5 per pit; 7 or 12 in variants). Sower chooses direction each turn. After the last seed, take the *next* pit and continue (relay). If the next pit is empty, capture the pit after it **and the pit opposite**. A player may sow twice in a turn if the first sowing captured. Turn ends after two empties. https://en.wikipedia.org/wiki/Ali_Guli_Mane , https://www.bead.game/games/traditional/ali-guli-mane — **High** on rules (two independent sources agree). Wikipedia cites Finkel 2020. No pre-modern date attested. **Low** on antiquity.

### 3.3 Vamana Guntalu (Andhra/Telangana)
- rollthedice.in gives a 2×5, 50-seed, 10-per-pit version with relay sowing and own-side-empty capture-opposite. https://rollthedice.in/pages/how-to-play-vamana-guntalu — **Medium** (single hobby source). Search summaries (Scribd, YouTube) describe 2×7, 7 per pit, 98 seeds. **Low** on any particular count. It is the same Deccan family with the same relay-and-capture logic.

### 3.4 What the mechanics exercise (from the rules themselves)
- Counting a pit (subitising 1–6, counting beyond). Predicting where the last seed lands = *modular* reasoning: from pit k with n seeds, the last seed lands at (k + n) mod 14. This is the core skill and it is the one the Chennai school project found students inventing notation for ("1, 4, 7, 10, 13, 2…" sequences, tree diagrams). https://teacherplus.org/2020/2020/may-june-2020/pallankuzhi-a-school-math-project/ — **High** that this is what expert play requires.
- The pasu rule (capture exactly at 4 or 6) is a running "count to N" trigger — good for 7–9.
- Relay sowing makes lookahead explode: Donkers, Uiterwijk and de Voogt note that with multiple laps "the effect of a single move can be so large that it becomes incalculable for humans". https://ludicum.org/en/bgsc-iv-fribourg-2001/ — **High**. For a 7-year-old that is a feature (surprise) and a bug (no sense of control) — cap relay depth in an easy mode.

### 3.5 Research on mancala and number sense
- Retschitzki (1990, *Stratégies des joueurs d'awélé*, L'Harmattan): 38 schooled boys aged 9–15 in Kpouébo, Côte d'Ivoire, plus 11 adults; observation, verbal reports, Piagetian tasks; expert players show hypothetico-deductive reasoning. Cognition-of-experts study, not a learning intervention. https://mancala.fandom.com/wiki/Jean_Retschitzki (via search), https://www.decitre.fr/livres/strategies-des-joueurs-d-awele-9782738406170.html — **Medium**.
- Retschitzki himself, quoted: Awélé "can assist younger players in strengthening their counting abilities", but "studies on failure also reveal no appreciable advantages" and "the enjoyment a player derives from playing is, in my opinion, the primary advantage". https://www.lemaplaninternational.org/prof-jean-retschitziki-and-the-awele-board-game/ — **Medium**.
- Retschitzki & Assande: strategies are learned only by practice and watching others; no difference between Swiss novices and Ivorian children in how elementary tactics are acquired. https://ludicum.org/en/bgsc-iv-fribourg-2001/ — **Medium**.
- Gwen Dewar (Parenting Science) on whether mancala improves maths: "To date, nobody has performed the relevant experiments to find out." https://parentingscience.com/mancala-games/ — **High** that as of that page no RCT existed.
- India-specific: Prabavathy & Sivaranjani (2023), *Journal for ReAttach Therapy and Developmental Diversities* 6(10s): 12 children with maths difficulties, single-group pre/post, two months of Pallanguzhi play; reports improvement in counting, skip counting, number sense. No control group; low-tier journal. https://jrtdd.com/index.php/journal/article/view/1518 — **Low** as evidence of effect, **High** that the study exists.
- A 2025 case study: two children with ADHD (7 and 8), 36 Pallanguzhi-STEM sessions over 12 weeks, weekly maths probes. n=2. https://www.academia.edu/145816662/ — **Low**.
- Ghana: "Alikoto: Mathematics instruction and cultural games in Ghana" (Cogent Education 2023) and a teacher-pedagogy study on Oware exist; neither is an RCT on Oware and arithmetic. https://www.tandfonline.com/doi/full/10.1080/2331186X.2023.2207045 — **Medium** (abstract only).
- Bottom line: the *mechanism* (counting, modular prediction, planning) is obvious from the rules; the *evidence* that playing transfers to arithmetic is thin everywhere. If we build this, we must measure it ourselves (Constitution R3).

---

## 4. Race and dice games: Pachisi/Chaupar, Gyān Caupaṛ, Aṣṭāpada, Chaturaṅga

### 4.1 Pachisi and Chaupar
- Board: cruciform, four arms of 3×8 squares, central charkoni, 12 marked "castle" safe squares; 4 pieces per player (up to 16 in team play); capture by landing sends the piece home; graces (special throws) needed to enter. https://en.wikipedia.org/wiki/Pachisi — **High**.
- Dice: Pachisi uses 6 (or 5/7) cowries; Chaupar uses three long stick dice marked 1-2-5-6 (or 1-2-3-4). https://www.penn.museum/sites/expedition/the-indian-games-of-pachisi-chaupar-and-chausar/ (W. Norman Brown, 1964) — **High**.
- Six-cowrie scoring: 2–5 mouths up = that number; 1 up = 10; 0 up = 25; 6 up = 6 (grace). Graces (6, 10, 25) give an extra turn and allow entering a piece. https://en.wikipedia.org/wiki/Pachisi , https://www.bead.game/games/traditional/pachisi — **High**. Seven-cowrie variant: 0 up = 7 ("sat"). **Medium**.
- Probability angle (derivable, attested only in the rules): a fair cowrie lands mouth-up about half the time (real cowries are biased — Wikipedia says they "should" be 50/50), so 6 cowries is Binomial(6, ½): P(3 up)=20/64, P(2)=P(4)=15/64, P(1)=P(5)=6/64, P(0)=P(6)=1/64. The scoring table rewards the rare outcomes (25 for the 1/64 event) — a ready-made lesson in "rare = big prize" and expected value. **High** on the arithmetic; the bias of real shells is the AI/measurement angle (let the child *estimate* the shell's bias by tallying).
- Dating — be careful: earliest *secure* evidence is Akbar's giant courtyard boards at Fatehpur Sikri and Agra (16th c.) and Abu'l Fazl's description in the Ā'īn-i-Akbarī; Finkel: "these grandiose boards still represent the earliest secure evidence for the existence of the game in India". The Ellora relief of Śiva and Pārvatī shows dice, not the board; the Mahābhārata dicing scene describes no board. https://en.wikipedia.org/wiki/Pachisi , https://imp-art.org/articles/pachisi/ , http://www.sahapedia.org/towards-cultural-history-indian-board-games-backgammon-chaupar-and-chaturanga — **High**. "Pachisi is 5,000 years old / from the Mahābhārata" is popular myth.
- Dice themselves are ancient: RV 10.34 (the Gambler's Lament, c. 11th c. BCE) describes gambling with vibhīdaka nuts; the four-sided throw names kṛta/tretā/dvāpara/kali and winning on multiples of four. https://en.wikipedia.org/wiki/Gambler%27s_Lament — **High**. Oblong dice and cowries at Indus sites (3rd millennium BCE). https://www.penn.museum/sites/expedition/the-indian-games-of-pachisi-chaupar-and-chausar/ — **High**.

### 4.2 Gyān Caupaṛ / Mokṣa Paṭam (ancestor of Snakes and Ladders)
- Best source: Schmidt-Madsen, PhD Copenhagen 2019, *The Game of Knowledge*, ~150 charts catalogued (text extracted locally). Abstract: charts "derive from Vaiṣṇava and Jaina communities in 19th-century western India, though a few reach back to the late 18th century… gyān caupaṛ itself does not appear to have been invented before the late 17th or early 18th century." Earliest datable chart: 72-square Vaiṣṇava chart, Lucknow 1780–82, commissioned by Richard Johnson (British Library, Johnson Album 5,8). Earliest forms: 72-square Vaiṣṇava and 84-square Jaina; later 100-square Sufi (17 ladders, 13 snakes per Wikipedia), 124/128-square variants. Randomiser "almost universally dice or cowrie shells"; one pawn per player; track runs boustrophedon from bottom-left; winning square top-centre. Snakes = negative karmic fruition, ladders = positive. https://curis.ku.dk/ws/portalfiles/portal/221758034/Ph.d._afhandling_2019_Schmidt_Madsen_bd.1.pdf — **High**.
- English arrival: F. H. Ayres' design registration, London, October 1892 (Schmidt-Madsen fig. 1). **High**. Milton Bradley's 1943 Chutes and Ladders removed the morals. https://en.wikipedia.org/wiki/Gyan_chauper — **Medium**.
- Topsfield 1985 (Artibus Asiae 46) and 2006 (Artibus Asiae 66) are the founding critical studies; boards of 72, 84, 100, 124, 128 squares. https://scroll.in/article/972864/ — **High**.
- Myth flags: "invented in the 2nd century CE", "by the 13th-century saint Jñāneśvar", "Kabīr" — no board or text supports any of these; Schmidt-Madsen and the quantumgame.love summary both say the earliest attributions (Jñāneśvar, Ibn al-ʿArabī, Sakya Paṇḍita — all 13th c.) have "not one board and not one text". https://en.quantumgame.love/guide/how-old-is-snakes-and-ladders.html — **High**. Wikipedia's "10th-century Dhanapāla" line is unsourced there — **Low**.
- Modern pedagogy: Russo, "Get your game on! Snakes and Ladders revisited", *Australian Primary Mathematics Classroom* 22(1), 18–22 — rule tweaks (two dice, choose the operation, exact finish) push children from count-on to mental computation. https://www.researchgate.net/publication/313243752_Get_your_game_on_Snakes_and_Ladders_revisited — **Medium** (abstract only). NCERT Grade 6 *Ganita Prakash* ch. 10 includes an "Integers: Snakes and Ladders" game with a +1…+6 die and a −1…−6 die, add or subtract in any order, race to ±50. https://ncert.nic.in/textbook/pdf/fegp110.pdf — **High** (extracted locally).
- What it teaches: counting on, number-line position, luck vs. choice (none in the original: one pawn, one die, no decisions), moral narrative. As a *maths* game it only works after Russo/NCERT-style modification.

### 4.3 Aṣṭāpada and Chaturaṅga (brief)
- Aṣṭāpada: uncheckered 8×8 board with marked squares; named in Patañjali's Mahābhāṣya (2nd c. BCE) and in the Buddhist list of games the Buddha would not play (Brahmajāla Sutta); it was a race game whose rules are not securely known. https://en.wikipedia.org/wiki/Ashtapada — **Medium**.
- Chaturaṅga: earliest name-reference Bāṇa's Harṣacarita (c. 625 CE, "only aṣṭāpadas teach the position of the chaturaṅga"); Subandhu's Vāsavadattā slightly earlier; Persian chatrang c. 600. Pieces: rāja, mantrī (one diagonal), ratha (rook), gaja (elephant, three attested move variants), aśva (knight), padāti (pawn, no double step). https://en.wikipedia.org/wiki/Chaturanga , https://www.worldhistory.org/article/2793/the-history-of-chess/ — **High**. Four-handed dice chaturaṅga (chaturājī) is attested later (al-Bīrūnī, 11th c.). **Medium**. Too complex for 7–12 in three days; skip.

---

## 5. Number systems as play

### 5.1 Bhūtasaṃkhyā (word numerals)
- Numbers written as words with a fixed count: eyes = 2, Vedas = 4, arrows (Kāma's) = 5, sky/void = 0, earth/moon = 1, teeth = 32, gods = 33. Digits are given **units first** (ascending place value). Example inscription: bāṇa-vyoma-dharādhara-indu = 5,0,7,1 → 1705 Śaka. Earliest evidence: Yavanajātaka (early centuries CE); used heavily by Varāhamihira, Bhāskara and astronomers. https://en.wikipedia.org/wiki/Bhutasamkhya_system — **High**.
- Child use: a "number rebus" — encode 2026 as "moon-eyes-sky-eyes"? No: units first gives 6-2-0-2 = "seasons–eyes–sky–eyes". Playable at 8+; the units-first order is itself a place-value lesson. No evidence of classroom use found (search returned only reference pages). **Medium** on suitability, **Low** on precedent.

### 5.2 Kaṭapayādi (syllable cipher)
- Consonant → digit table: ka-kha-ga-gha-ṅa = 1–5, ca-cha-ja-jha-ña = 6–9,0; ṭa…ṇa = 1–5, ta…na = 6–9,0; pa-pha-ba-bha-ma = 1–5; ya-ra-la-va-śa-ṣa-sa-ha = 1–8. Stand-alone vowels = 0; in a conjunct only the last consonant counts; a consonant without a vowel is ignored; digits read right-to-left (aṅkānāṃ vāmato gatiḥ). Earliest attestation Haridatta's Grahacāraṇibandhana (683 CE); Śaṅkaranārāyaṇa (869 CE); Kerala school (Mādhava) used it for sine tables and π. https://en.wikipedia.org/wiki/Katapayadi_system , https://www.varnam.org/2022/05/20/the-katapayadi-number-system/ — **High**.
- Worked example: "jaya" → ja=8, ya=1 → read right-to-left = 18. Carnatic melakartā rāgas: first two syllables give the rāga number (Dhīraśaṅkarābharaṇam: dha=9, ra=2 → 29). https://www.varnam.org/2022/05/20/the-katapayadi-number-system/ , https://en.wikipedia.org/wiki/Sankarabharanam_(raga) — **High**.
- Correction to the brief: Āryabhaṭa (499 CE) did **not** use Kaṭapayādi. He used his own alphasyllabic scheme (varga consonants ka…ma = 1–25, avarga ya…ha = 30–100, vowels mark powers of 100). https://en.wikipedia.org/wiki/%C4%80ryabha%E1%B9%ADa_numeration — **High**.
- Myth flag: the π verse "gopībhāgya madhuvrāta…" (31 digits) was composed by Bhāratī Kṛṣṇa Tīrtha and published in *Vedic Mathematics* (1965); it is not ancient. https://en.wikipedia.org/wiki/Bharati_Krishna_Tirtha , https://vedicmathmyth.quora.com/The-misconceptions-of-the-poem-gopi-bhagya-madhuvrata — **High**. Do not use it as "ancient".
- Child use: a genuine cipher game — encode your age, a date, a friend's number as a word; decode a rāga name. Requires Devanagari-aware or transliteration input; for 7–12 with no Sanskrit, reduce to a 10-row table of Latin syllables. The right-to-left rule confuses children under 10. **Medium** suitability (10–12), no classroom evidence found.

---

## 6. Are these used to teach maths in India today?

- NCERT *Ganita Prakash* (NEP 2020 / NCF-SE 2023 textbooks, 2024–26), checked by extracting the chapter PDFs:
  - Grade 6 ch. 7 (Fractions): a sidebar says the Śulba Sūtras show Vedic-era rules for fractions and that Brahmagupta codified them. https://ncert.nic.in/textbook/pdf/fegp107.pdf — **High**.
  - Grade 6 ch. 10: "Integers: Snakes and Ladders" two-dice game (above). **High**.
  - Grade 7 ch. 8 (Fractions), Example 4: "Some of the oldest examples of working with non-unit fractions occur in humanity's oldest geometry texts, the Śulbasūtra. Here is an example from Baudhāyana's Śulbasūtra (c. 800 BCE)" — covering an area of 7½ with squares of side 1/5 (the altar-brick problem, unlabelled). https://ncert.nic.in/textbook/pdf/gegp108.pdf — **High**.
  - Grade 8 ch. 6: distributive-property multiplication credited to Brahmagupta (628), Śrīdhara (750), Bhāskara (Līlāvatī 1150). Grade 8 ch. 7: a Līlāvatī proportion problem (saffron/niṣkas) set as an exercise. https://ncert.nic.in/textbook/pdf/hegp106.pdf , https://ncert.nic.in/textbook/pdf/hegp107.pdf — **High**.
  - Press (Dec 2025): Grade 8 introduces the "Baudhāyana–Pythagoras theorem" naming. https://www.awazthevoice.in/education-news/ncert-adds-baudhayana-pythagoras-theorem-to-class-syllabus-46891.html — **Medium**.
  - No Pallanguzhi, Ali Guli Mane, Chaupar or Kaṭapayādi in the grade 6–8 chapters downloaded (25 chapter files grepped). **High** for those files; other chapters not checked.
- Policy: AICTE's IKS Division; UGC mandates 5% of credits for IKS courses at university level; school IKS integration via NCERT's 19-member IKS Curriculum Area Group. https://www.indica.today/quick-reads/indic-uvacha-reclaiming-indigenous-knowledge/ — **Medium**. No outcome evaluation of any of this was found. **High** that none was found.
- Practice: Chennai Grade 9 Pallankuzhi maths project (Teacher Plus 2020) — students invented notation, tree diagrams, move-value calculations; "didn't discover a winning strategy" but built "a local formal language for articulation of strategies". https://teacherplus.org/2020/2020/may-june-2020/pallankuzhi-a-school-math-project/ — **High**. Traditional-games revival companies (Kreeda, Chennai; various "traditional games" sites) market Pallanguzhi as maths practice with no data. **High** that claims are unevidenced.
- Findings summary: heritage content is now *mentioned* in national textbooks (Śulba fractions, Līlāvatī problems, Baudhāyana naming), a Snakes-and-Ladders integer game is in the Grade 6 book, but no Indian study with a control group shows any of these games improving arithmetic. This is a gap a measured product can fill honestly.

---

## 7. Ranked shortlist: three mechanics buildable in three days by one engineer

Ranking criteria: attested (not folklore), a 7-year-old can feel it in 30 seconds, the learning objective is measurable, and the AI angle preserves the child's effort (Constitution §4: no answer-giving).

### #1 — "Where does the last seed land?" (Pallanguzhi/Ali Guli Mane sowing)
- **Learning objective:** counting on, skip-counting round a cycle, and early modular arithmetic — "from pit 5 with 11 seeds the last one lands in pit 2". Extension: the pasu trigger (count-to-4) for 7–8s; two-lap relays for 10–12s. Measurable: accuracy and latency of the prediction before the sow animates.
- **Ancient source:** Tamil/Kannada/Telugu sowing games, 2×7, relay sowing, capture beyond one empty, pasu capture at 4 or 6 (§3.1–3.2; **High** on the rule family, **Low** on any one seed count — make it a setting).
- **Core loop:** the child taps a pit, must *predict* where the last seed lands (tap the target pit) before the sowing animates; correct prediction earns the capture, wrong prediction still sows but forfeits the capture; a bot opponent plays the same rules.
- **AI angle:** the opponent is a tuned search bot (rules are cheap to simulate); the AI *never* tells the child where the seed lands; it adapts the seed count and relay depth to keep predictions at ~70–80% success, and it can generate a spoken hint of the form "how many pits round is that?" (a question, not an answer).
- **Biggest risk:** relay chains make outcomes incalculable for a 7-year-old (Donkers/de Voogt, **High**); if easy mode does not cap relay length the game reads as pure luck and the prediction skill never forms. Second risk: three days is enough for one rule set only — pick the traditionalgames.co.in 6-per-pit / capture-at-4 set and label it "one Tamil Nadu version".
- **Cultural sensitivity:** low religious content; a women's/children's domestic game, no caste marking found. Appropriation risk is low if named in Tamil/Kannada with the regional names shown and the rule variation stated honestly. Do not claim "played by Chola kings".

### #2 — "Brick the altar" (Śulba grid geometry, gārhapatya-scale)
- **Learning objective:** area conservation and equal-area transformation on a grid — doubling a square, adding two squares, turning a rectangle into a square — plus the constraint puzzle "exactly 21 bricks of these three shapes, no seam lines up with the layer below". For 10–12: enlarge the shape by one unit of area while keeping its outline (BSS II.12). Measurable: unassisted completion, count of invalid (seam-aligned) placements, time to first correct doubling.
- **Ancient source:** Baudhāyana Śulba Sūtra: gārhapatya citi 21 bricks/layer, 5 layers, alternating designs, joints not aligned (Price 2000, **High**); dvikaraṇī and rectangle→square rules (**High**); Śyena 200 bricks × 5 layers = 1000 (**High** in the design text; the 10,800 figure is a different thing).
- **Core loop:** the child drags rectangular bricks onto a grid to fill a target outline exactly, then lays layer 2 so no seam continues a seam from layer 1; levels move from a plain square to "twice this square" (build the doubled square from the diagonal), then a simplified falcon silhouette.
- **AI angle:** a vision-free checker (pure geometry) validates area and seams; the AI's only voice is Socratic ("which brick would make the seams stop lining up?") and it *flags* rather than fixes. This is the one mechanic that gives a genuine "proof by rearrangement" moment (the diagonal rule) that a child can feel.
- **Biggest risk:** drag-and-drop tiling on a phone is fiddly and three days is tight for a robust snapping grid; a broken tiling UI kills the whole thing. Mitigation: snap-to-grid, integer brick sizes only, no rotation in level 1.
- **Cultural sensitivity:** the altar is a Brahmin sacrificial structure; use "fire-altar builders" as the setting, show no priests, no mantras, no animal sacrifice; never call it "Vedic maths" (Dani, **High**). The Nambudiri community still performs the rite — frame as heritage geometry, not as ritual play.

### #3 — "Cowrie odds" (Pachisi/Chaupar throws)
- **Learning objective:** intuitive probability and expected value for 9–12: "six shells, how many mouths up?" — record throws, watch the 1-2-3-4-5 counts pile into a bell shape, notice that the scoring table pays 25 for the rarest outcome; then estimate whether *these* shells are fair. For 7–8: counting mouths-up quickly (subitising to 6) and a short Pachisi race on one arm of the cross.
- **Ancient source:** six-cowrie scoring (2–5 = face value; 1 = 10; 0 = 25; 6 = 6; graces give extra turn), cruciform 3×8 arms, 12 castles (§4.1, **High**); Akbar's courtyard boards and Ā'īn-i-Akbarī as earliest secure evidence (**High**); vibhīdaka-nut dicing in RV 10.34 (**High**) as the older cousin.
- **Core loop:** the child throws six virtual cowries (each with a hidden, slightly unfair bias), calls the count before it resolves, moves a piece along a single Pachisi arm; every ten throws a tally chart grows and the child is asked "which count is most common? which is worth most?".
- **AI angle:** the AI is the *statistician's opponent*: it sets a secret bias per shell set and the child's job is to detect it from data — a small, honest "learn from evidence" mechanic that mirrors how an ML model estimates a parameter. The AI never states the bias; it only asks for the child's estimate and shows the tally.
- **Biggest risk:** the probability content is thin for 7–8 and the original game has no decisions at all (one die, one pawn) — without the tally/estimation layer this degenerates into Ludo. Also real-cowrie bias is folklore-level knowledge (Wikipedia only says shells "should" be 50/50, **Low**) — present it as a question the child answers, not a fact.
- **Cultural sensitivity:** Pachisi is a gambling-adjacent dice game; the Mahābhārata dicing scene and RV 10.34 are about ruinous gambling. Keep points, not money; no betting language. Gyān Caupaṛ's karma/mokṣa framing is Jain/Vaiṣṇava/Sufi religious content — if used, use the *abstract* snakes-and-ladders mechanic and cite the 1780s Johnson board, not "ancient Hindu morality" (Schmidt-Madsen, **High**).

### Not shortlisted, and why
- Līlāvatī verse problems: authentic and charming, but the famous ones need square roots; the 7–12 subset is small and reads better as *flavour text* inside #1 or #2 (e.g. a Līlāvatī-style riddle as the level intro) than as its own mechanic. Use the necklace/bees fraction problems for 11–12 only, with content edits.
- Kaṭapayādi/Bhūtasaṃkhyā: real and clever, but right-to-left reading plus Sanskrit syllables is a two-step abstraction too far for under-10s in a three-day build; a "number rebus" mini-game is a fine week-two addition.
- Chaturaṅga: too heavy; Gyān Caupaṛ as-is: no decisions.

---

## Source list (all URLs cited above, grouped)

Śulba: https://en.wikipedia.org/wiki/Shulba_Sutras · https://arxiv.org/pdf/2006.10285 · https://mathshistory.st-andrews.ac.uk/HistTopics/Indian_sulbasutras/ · https://sanskrit.uohyd.ac.in/Algorithms_in_Ancient_India/7-3-2018/Applied+Geometry+in+SulbaSutras.pdf · https://bhavana.org.in/the-act-as-knowledge/ · https://en.wikipedia.org/wiki/Agnicayana · https://mahavidya.ca/2010/08/19/the-agnicayana-ritual/ · https://arxiv.org/pdf/0708.0427 · https://www.dam.brown.edu/people/mumford/beyond/papers/2010a--PlofkerReview-AMS.pdf · https://en.wikipedia.org/wiki/Baudhayana_sutras · https://en.wikipedia.org/wiki/Vedic_Mathematics · https://old.maa.org/press/periodicals/convergence/ancient-indian-rope-geometry-in-the-classroom-fire-altars-of-ancient-india (unreachable during research)

Līlāvatī: https://archive.org/stream/colebrookestrans00hcba/colebrookestrans00hcba_djvu.txt · https://en.wikipedia.org/wiki/L%C4%ABl%C4%81vat%C4%AB · https://gauravtiwari.org/a-problem-solution-from-bhaskaracharyas-lilavati/ · https://old.maa.org/press/periodicals/convergence/mathematical-treasures-lilavati-of-bhaskara · https://proofwiki.org/wiki/Bhaskara_II_Acharya/Lilavati (blocked)

Sowing games: https://en.wikipedia.org/wiki/Pallanguzhi · https://ananthv9.wordpress.com/2018/08/17/playing-pallanguzhi-the-traditional-game-of-the-great-kings-involving-strategy-and-numbers/ · https://www.traditionalgames.co.in/pallanguzhi · https://teacherplus.org/2020/2020/may-june-2020/pallankuzhi-a-school-math-project/ · https://www.pallanguzhiguide.com/rules-of-playing-pallanguzhi/ · https://rollthedice.in/pages/how-to-play-pallanguzhi · https://rollthedice.in/pages/how-to-play-vamana-guntalu · https://en.wikipedia.org/wiki/Ali_Guli_Mane · https://www.bead.game/games/traditional/ali-guli-mane · https://mancala.fandom.com/wiki/Pallankuzhi (blocked) · https://ludicum.org/en/bgsc-iv-fribourg-2001/ · https://www.lemaplaninternational.org/prof-jean-retschitziki-and-the-awele-board-game/ · https://www.decitre.fr/livres/strategies-des-joueurs-d-awele-9782738406170.html · https://parentingscience.com/mancala-games/ · https://jrtdd.com/index.php/journal/article/view/1518 · https://www.academia.edu/145816662/ · https://www.tandfonline.com/doi/full/10.1080/2331186X.2023.2207045

Dice and race games: https://en.wikipedia.org/wiki/Pachisi · https://www.penn.museum/sites/expedition/the-indian-games-of-pachisi-chaupar-and-chausar/ · https://www.bead.game/games/traditional/pachisi · https://imp-art.org/articles/pachisi/ · http://www.sahapedia.org/towards-cultural-history-indian-board-games-backgammon-chaupar-and-chaturanga · https://en.wikipedia.org/wiki/Gambler%27s_Lament · https://curis.ku.dk/ws/portalfiles/portal/221758034/Ph.d._afhandling_2019_Schmidt_Madsen_bd.1.pdf · https://en.wikipedia.org/wiki/Gyan_chauper · https://scroll.in/article/972864/ · https://en.quantumgame.love/guide/how-old-is-snakes-and-ladders.html · http://www.sahapedia.org/gyan-chaupar-game-became-snakes-and-ladders-british-india · https://www.researchgate.net/publication/313243752_Get_your_game_on_Snakes_and_Ladders_revisited · https://en.wikipedia.org/wiki/Ashtapada · https://en.wikipedia.org/wiki/Chaturanga · https://www.worldhistory.org/article/2793/the-history-of-chess/

Number systems: https://en.wikipedia.org/wiki/Bhutasamkhya_system · https://en.wikipedia.org/wiki/Katapayadi_system · https://www.varnam.org/2022/05/20/the-katapayadi-number-system/ · https://en.wikipedia.org/wiki/%C4%80ryabha%E1%B9%ADa_numeration · https://en.wikipedia.org/wiki/Sankarabharanam_(raga) · https://en.wikipedia.org/wiki/Bharati_Krishna_Tirtha · https://vedicmathmyth.quora.com/The-misconceptions-of-the-poem-gopi-bhagya-madhuvrata

Teaching today: https://ncert.nic.in/textbook/pdf/fegp107.pdf · https://ncert.nic.in/textbook/pdf/fegp110.pdf · https://ncert.nic.in/textbook/pdf/gegp108.pdf · https://ncert.nic.in/textbook/pdf/hegp106.pdf · https://ncert.nic.in/textbook/pdf/hegp107.pdf · https://www.awazthevoice.in/education-news/ncert-adds-baudhayana-pythagoras-theorem-to-class-syllabus-46891.html · https://www.indica.today/quick-reads/indic-uvacha-reclaiming-indigenous-knowledge/
