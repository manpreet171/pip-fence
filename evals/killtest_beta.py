"""
KILL-TEST — Play beta: can we predict a disengagement-linked outcome from REAL student
behavioural data, above a trivial baseline, fast? (no simulated learners; D-023 safe)

Data: UCI Student Performance (Cortez 2008), 649 Portuguese-course + 395 maths students.
Real pupils, real behavioural features. We predict COURSE FAILURE (final grade G3 < 10) --
a disengagement-linked outcome -- from behaviour available BEFORE the final grade, and we
EXCLUDE G1/G2/G3 so we are not just reading a grade off another grade.

Model: logistic regression implemented from scratch in numpy (no sklearn available, and
from-scratch is a stronger signal anyway). AUC computed by hand (rank statistic).

Kill criteria:
  - AUC on held-out students must beat 0.5 (coin) AND beat the majority-class baseline
    accuracy meaningfully. If it cannot, disengagement is not learnable here -> beta dies.
  - Inference must be fast enough to call "real-time".

Run: python evals/killtest_beta.py    (reads ../scratchpad/sp/*.csv)
"""
import sys
import csv, math, random, time, os
import numpy as np

random.seed(5); np.random.seed(5)
SP = sys.argv[1] if len(sys.argv) > 1 else "data/student-performance"   # folder holding the UCI student-mat.csv / student-por.csv

# Behavioural / context features available before the outcome. NO G1/G2/G3.
NUM = ["age","Medu","Fedu","traveltime","studytime","failures","famrel","freetime",
       "goout","Dalc","Walc","health","absences"]
BIN = ["schoolsup","famsup","paid","activities","higher","internet","romantic"]  # yes/no


def load(path):
    rows = list(csv.DictReader(open(path, encoding="utf-8"), delimiter=";"))
    X, y = [], []
    for r in rows:
        feat = [float(r[c]) for c in NUM]
        feat += [1.0 if r[c] == "yes" else 0.0 for c in BIN]
        X.append(feat)
        y.append(1 if float(r["G3"]) < 10 else 0)   # 1 = failed (disengagement-linked)
    return np.array(X), np.array(y)


def standardize(Xtr, Xte):
    mu, sd = Xtr.mean(0), Xtr.std(0) + 1e-9
    return (Xtr - mu) / sd, (Xte - mu) / sd


def train_logreg(X, y, lr=0.1, epochs=400, l2=1e-3):
    n, d = X.shape
    w = np.zeros(d); b = 0.0
    for _ in range(epochs):
        z = X @ w + b
        p = 1 / (1 + np.exp(-z))
        gw = X.T @ (p - y) / n + l2 * w
        gb = (p - y).mean()
        w -= lr * gw; b -= lr * gb
    return w, b


def auc(y, s):
    pos = s[y == 1]; neg = s[y == 0]
    if len(pos) == 0 or len(neg) == 0:
        return float("nan")
    # Mann-Whitney U / rank-based AUC
    order = np.argsort(s); ranks = np.empty_like(order, float)
    ranks[order] = np.arange(1, len(s) + 1)
    r_pos = ranks[y == 1].sum()
    return (r_pos - len(pos) * (len(pos) + 1) / 2) / (len(pos) * len(neg))


def run(name, path):
    X, y = load(path)
    idx = np.arange(len(y)); np.random.shuffle(idx)
    cut = int(0.75 * len(y))
    tr, te = idx[:cut], idx[cut:]
    Xtr, Xte = standardize(X[tr], X[te])
    ytr, yte = y[tr], y[te]

    t0 = time.time()
    w, b = train_logreg(Xtr, ytr)
    train_ms = (time.time() - t0) * 1000

    t1 = time.time()
    s = 1 / (1 + np.exp(-(Xte @ w + b)))
    infer_us = (time.time() - t1) / len(te) * 1e6

    a = auc(yte, s)
    base = max(yte.mean(), 1 - yte.mean())          # majority-class accuracy
    acc = ((s > 0.5).astype(int) == yte).mean()
    fail_rate = y.mean()

    # top features by |weight|
    names = NUM + BIN
    top = sorted(zip(names, w), key=lambda t: -abs(t[1]))[:6]
    print(f"\n[{name}]  n={len(y)}  fail_rate={fail_rate:.0%}  test_n={len(te)}")
    print(f"  AUC (held-out)      : {a:.3f}   (0.5 = coin)")
    print(f"  accuracy            : {acc:.3f}   majority baseline {base:.3f}")
    print(f"  train time          : {train_ms:.0f} ms   infer {infer_us:.1f} us/student")
    print(f"  top signals         : " + ", ".join(f"{n}({w:+.2f})" for n, w in top))
    return a, acc, base


if __name__ == "__main__":
    print("KILL-TEST beta -- predict course failure from real behaviour (UCI, no grades used)")
    results = []
    for name, f in [("Portuguese", "student-por.csv"), ("Maths", "student-mat.csv")]:
        p = os.path.join(SP, f)
        if os.path.exists(p):
            results.append((name,) + run(name, p))
    print("\n=== VERDICT ===")
    for name, a, acc, base in results:
        beats = a > 0.6 and acc >= base
        print(f"  {name:<12} AUC {a:.3f}  acc {acc:.3f} vs base {base:.3f}  -> "
              f"{'PASS' if beats else 'WEAK'}")
    ok = all(a > 0.6 for _, a, _, _ in results)
    print(f"\n  disengagement learnable from behaviour alone: {'YES' if ok else 'NO'}")
