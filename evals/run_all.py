"""
ONE COMMAND, ONE TABLE. Runs every free check (no key, no money) and exits non-zero on any failure.
Run from the repo root:  python evals/run_all.py
"""
import json, os, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

CHECKS = [
    ("readinglevel --assert", [sys.executable, "evals/readinglevel.py", "--assert"]),
    ("classifier_eval",       ["node", "evals/classifier_eval.mjs"]),
    ("buddy_test",            ["node", "evals/buddy_test.mjs"]),
    ("engine_eval2 (frozen)", ["node", "evals/engine_eval2.mjs"]),
]

def templates_equal():
    """TEMPLATES in buddy.mjs == data/hints_v2.txt, as sets of (id, tier, text)."""
    file_set = set()
    for line in open("data/hints_v2.txt", encoding="utf-8"):
        if line.strip():
            mid, tier, text = line.rstrip("\n").split("\t"); file_set.add((mid, int(tier), text))
    js = subprocess.run(["node", "--input-type=module", "-e",
        "import {TEMPLATES} from './src/engine/buddy.mjs'; console.log(JSON.stringify(TEMPLATES))"],
        capture_output=True, text=True, encoding="utf-8")
    code_set = {(mid, int(t), text) for mid, tiers in json.loads(js.stdout).items() for t, text in tiers.items()}
    diff = file_set ^ code_set
    return not diff, ("" if not diff else f"differ on {sorted(diff)}")

rows, failed = [], False
for name, cmd in CHECKS:
    t0 = time.time()
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    ok = r.returncode == 0
    rows.append((name, ok, time.time() - t0, "" if ok else (r.stdout + r.stderr).strip().splitlines()[-1:]))
    failed |= not ok
t0 = time.time(); ok, why = templates_equal()
rows.append(("TEMPLATES == hints_v2.txt", ok, time.time() - t0, why)); failed |= not ok

print(f"\n{'check':28} {'result':6} {'secs':>6}")
print("-" * 44)
for name, ok, secs, why in rows:
    print(f"{name:28} {'PASS' if ok else 'FAIL':6} {secs:6.1f}" + (f"   {why}" if why else ""))
print("-" * 44)
print("ALL PASS" if not failed else "SOME FAILED")
sys.exit(1 if failed else 0)
