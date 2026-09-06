"""
READING-LEVEL CHECK for buddy hints (CRITIC-R2 #13: "reading level is asserted, never measured").

Scores each template in data/hints_v2.txt (id<TAB>tier<TAB>text) against data/wordlist.txt:
  - BASE   = Dolch 315 U Fry first 300 (named, public-domain lists)
  - DOMAIN = the game's own screen vocabulary (reported separately, never counted as Dolch)
Per hint: sentence count, words/sentence, % in BASE, % in BASE+DOMAIN, out-of-list words,
number-word flag. Inflections -s/-es/-ing/-ed are stripped before lookup (CONCEPT-V3.2 s3).
No LLM involved - pure code. NUMBER_WORDS is the same 36-word list as gate() in buddy.mjs.

Run:  python evals/readinglevel.py            (table for every template)
      python evals/readinglevel.py hints.txt  (same format, another file)
      python evals/readinglevel.py --assert   (build gate: <=2 sentences, 0 digits/number words,
                                               <=2 out-of-list words on EVERY line; exit 1 otherwise)
"""
import re, sys, io, statistics

NUMBER_WORDS = {"zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "fifteen", "twenty", "hundred", "dozen", "half", "twice", "once", "single",
    "pair", "couple", "both", "double",
    "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"}   # ordinals leak the group count; "first" allowed (D-068)
assert len(NUMBER_WORDS) == 36

def load_list(path="data/wordlist.txt"):
    base, dom, sect = set(), set(), None
    for raw in io.open(path, encoding="utf-8"):
        line = raw.strip()
        if not line: continue
        if line.startswith("## BASE"):   sect = "base";   continue
        if line.startswith("## DOMAIN"): sect = "domain"; continue
        if line.startswith("#"): continue
        (base if sect == "base" else dom).add(line.lower())
    return base, dom

def load_hints(path="data/hints_v2.txt"):
    rows = []
    for raw in io.open(path, encoding="utf-8"):
        if not raw.strip(): continue
        mid, tier, text = raw.rstrip("\n").split("\t")
        rows.append((mid, int(tier), text))
    return rows

WORD = re.compile(r"[a-z']+")
SENT = re.compile(r"[.!?]+")

def score(hint, base, dom):
    sents = [s for s in SENT.split(hint.strip()) if s.strip()]
    words = WORD.findall(hint.lower())
    def stem(w):
        for suf in ("ing", "ed", "es", "s"):
            if w.endswith(suf) and len(w) - len(suf) >= 3:
                yield w[: -len(suf)]
        yield w
    def known(w, S): return any(c in S for c in stem(w))
    in_base = [w for w in words if known(w, base)]
    in_any  = [w for w in words if known(w, base) or known(w, dom)]
    out     = [w for w in words if not known(w, base) and not known(w, dom)]
    has_num = bool(re.search(r"\d", hint)) or any(w in NUMBER_WORDS for w in words)
    return dict(sentences=len(sents), mean_len=(len(words)/max(1,len(sents))), n=len(words),
                pct_dolch=len(in_base)/max(1,len(words)), pct_any=len(in_any)/max(1,len(words)),
                out=out, has_number=has_num)

if __name__ == "__main__":
    base, dom = load_list()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    hints = load_hints(args[0]) if args else load_hints()
    rows = [(mid, tier, h, score(h, base, dom)) for mid, tier, h in hints]
    if "--assert" in sys.argv:            # build-time gate check on the committed templates (CONCEPT-V3.2 s3)
        bad = 0
        for mid, tier, h, r in rows:
            why = []
            if r["sentences"] > 2: why.append(f"{r['sentences']} sentences")
            if r["has_number"]:    why.append("digit/number word")
            if len(r["out"]) > 2:  why.append(f"{len(r['out'])} out-of-list")
            print(f"{'FAIL' if why else 'ok  '} {mid:30} t{tier}  out-of-list: {r['out'] or '-'}" + (f"  <- {', '.join(why)}" if why else ""))
            bad += bool(why)
        ids = {mid for mid, *_ in hints}
        if len(hints) != 24 or len(ids) != 8 or any((m, t) not in {(a, b) for a, b, *_ in hints} for m in ids for t in (1, 2, 3)):
            print(f"FAIL: expected 8 ids x 3 tiers, got {len(hints)} lines over {len(ids)} ids"); bad += 1
        if bad: print(f"gate assert FAILED: {bad} violation(s)"); sys.exit(1)
        print(f"gate assert OK: {len(hints)} templates, 0 number words, <=2 sentences, <=2 out-of-list words each"); sys.exit(0)
    print(f"wordlist: BASE (Dolch U Fry) {len(base)} words | domain {len(dom)} words\n")
    for mid, tier, h, r in rows:
        flag = " NUMBER!" if r["has_number"] else ""
        print(f"{mid} t{tier} [{r['sentences']} sent, {r['mean_len']:.1f} w/sent, base {r['pct_dolch']:.0%}, +domain {r['pct_any']:.0%}]{flag}")
        print(f"   {h}")
        print(f"   out-of-list: {r['out'] or '-'}")
    R = [r for *_, r in rows]
    print("\nOVERALL")
    print(f"  templates          : {len(R)}")
    print(f"  sentences per hint : max {max(r['sentences'] for r in R)}  (limit 2)")
    print(f"  mean words/sentence: {statistics.mean(r['mean_len'] for r in R):.1f}")
    print(f"  base coverage      : {statistics.mean(r['pct_dolch'] for r in R):.0%}")
    print(f"  base+domain        : {statistics.mean(r['pct_any'] for r in R):.0%}")
    allout = sorted({w for r in R for w in r['out']})
    print(f"  out-of-list words  : {allout or 'none'}")
    print(f"  hints with a number: {sum(r['has_number'] for r in R)}  (must be 0)")
