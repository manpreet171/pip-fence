"""Pip's voice for every fixed line: one small mp3 per line, named by the line's hash, plus a manifest
the page reads. Run once after the lines change; existing files are kept.

    pip install edge-tts
    python scripts/make_voice.py            # en-US-AnaNeural, a child's voice
    python scripts/make_voice.py en-GB-MaisieNeural

The voice is Microsoft's neural read-aloud voice reached through the edge-tts package. Output goes to
src/public/assets/voice/. Model-phrased lines are not generated here; the page speaks those with the
browser's own voice (D-084)."""
import asyncio, hashlib, json, os, subprocess, sys
import edge_tts

VOICE = sys.argv[1] if len(sys.argv) > 1 else "en-US-AnaNeural"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "public", "assets", "voice")
os.makedirs(OUT, exist_ok=True)
lines = json.loads(subprocess.check_output(["node", os.path.join(ROOT, "scripts", "voice_lines.mjs")], text=True, encoding="utf-8"))
name = lambda t: hashlib.sha1(t.encode("utf-8")).hexdigest()[:12] + ".mp3"

async def one(text, sem):
    path = os.path.join(OUT, name(text))
    if os.path.exists(path): return "kept"
    async with sem:
        await edge_tts.Communicate(text, VOICE, rate="-5%", pitch="+0Hz").save(path)
    return "made"

async def main():
    sem = asyncio.Semaphore(4)
    res = await asyncio.gather(*(one(t, sem) for t in lines))
    json.dump({t: name(t) for t in lines}, open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(f"{VOICE}: {res.count('made')} made, {res.count('kept')} kept, {len(lines)} lines")

asyncio.run(main())
