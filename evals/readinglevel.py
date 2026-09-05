"""
READING-LEVEL CHECK for buddy hints (CRITIC-R2 #13: "reading level is asserted, never measured").

Scores each hint against data/wordlist.txt:
  - BASE   = Dolch 220 service words + 95 nouns (named, public-domain list)
  - DOMAIN = the game's own screen vocabulary (reported separately, never counted as Dolch)
Reports, per hint and overall: sentence count, mean sentence length (words), % words in
Dolch, % in Dolch+Domain, and the exact out-of-list words. No LLM involved — pure code.

Run:  python evals/readinglevel.py            (scores the six current hint templates)
      python evals/readinglevel.py hints.txt  (one hint per line)
"""
import re, sys, io, statistics

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

WORD = re.compile(r"[a-z']+")
SENT = re.compile(r"[.!?]+")

def score(hint, base, dom):
    sents = [s for s in SENT.split(hint.strip()) if s.strip()]
    words = WORD.findall(hint.lower())
    def stem(w):                      # v3.2 §3: "-s, -ing, -ed" removed before lookup
        for suf in ("ing", "ed", "es", "s"):
            if w.endswith(suf) and len(w) - len(suf) >= 3:
                yield w[: -len(suf)]
        yield w
    def known(w, S): return any(c in S for c in stem(w))
    in_base = [w for w in words if known(w, base)]
    in_any  = [w for w in words if known(w, base) or known(w, dom)]
    out     = [w for w in words if not known(w, base) and not known(w, dom)]
    has_num = bool(re.search(r"\d", hint)) or any(w in {"zero","one","two","three","four","five","six",
        "seven","eight","nine","ten","eleven","twelve","twenty","hundred","dozen","half","twice"} for w in words)
    return dict(sentences=len(sents), mean_len=(len(words)/max(1,len(sents))), n=len(words),
                pct_dolch=len(in_base)/max(1,len(words)), pct_any=len(in_any)/max(1,len(words)),
                out=out, has_number=has_num)

DEFAULT_HINTS = [l.strip() for l in io.open("data/hints_v2.txt", encoding="utf-8") if l.strip()]

if __name__ == "__main__":
    base, dom = load_list()
    if "--assert" in sys.argv:            # build-time gate check on the committed templates (CONCEPT-V3.2 §3)
        hints=[l.strip() for l in io.open("data/hints_v2.txt",encoding="utf-8") if l.strip()]
        bad=[h for h in hints if (r:=score(h,base,dom))["has_number"] or r["sentences"]>2]
        assert not bad, f"templates violate the gate: {bad}"
        print(f"gate assert OK: {len(hints)} templates, 0 number words, <=2 sentences"); sys.exit(0)
    hints = [l.strip() for l in io.open(sys.argv[1], encoding="utf-8") if l.strip()] if len(sys.argv) > 1 else DEFAULT_HINTS
    rows = [score(h, base, dom) for h in hints]
    print(f"wordlist: Dolch base {len(base)} words | domain {len(dom)} words\n")
    for h, r in zip(hints, rows):
        flag = " NUMBER!" if r["has_number"] else ""
        print(f"[{r['sentences']} sent, {r['mean_len']:.1f} w/sent, Dolch {r['pct_dolch']:.0%}, +domain {r['pct_any']:.0%}]{flag}")
        print(f"   {h}")
        print(f"   out-of-list: {r['out'] or '-'}")
    print("\nOVERALL")
    print(f"  sentences per hint : max {max(r['sentences'] for r in rows)}  (limit 2)")
    print(f"  mean words/sentence: {statistics.mean(r['mean_len'] for r in rows):.1f}")
    print(f"  Dolch coverage     : {statistics.mean(r['pct_dolch'] for r in rows):.0%}")
    print(f"  Dolch+domain       : {statistics.mean(r['pct_any'] for r in rows):.0%}")
    allout = sorted({w for r in rows for w in r['out']})
    print(f"  out-of-list words  : {allout or 'none'}")
    print(f"  hints with a number: {sum(r['has_number'] for r in rows)}  (must be 0)")
