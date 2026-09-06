"""One-off compositor (Pillow). Cuts and composites the few sprites the fence scene needs that
Kenney does not ship as-is (all sources CC0). Outputs are committed; this script is provenance.

  assets/fence/post.png, rail.png   a post and a single rail cut from fenceHigh_E (D-048)
  assets/fence/board.png            the planks_E slab cropped tight, for the cart heap
  assets/ground/grass.png           a seamless 264x132 patch of eight flat grass diamonds (tile 075),
                                    two of them 3 % darker so the lattice reads as a field
  assets/ground/dirt.png            the top diamond of flat dirt tile 083, for the path
  assets/ground/tree.png            one tree in Kenney's flat style: two-tone trunk, three green blobs

Measured on fenceHigh_E (256x512): left post x 0-13, y 339-448; rails slope -0.5, 11 px thick,
bottom rail centreline y = 414 - 0.5*(x-16) for x in [14,122).

Run: python scripts/make_parts.py [--preview out.png]
"""
import sys
from PIL import Image, ImageDraw

SRC = "src/public/assets/probe/fenceHigh_E.png"
OUT = "src/public/assets/fence/"
GND = "src/public/assets/ground/"
ISO = "src/public/assets/iso/landscapeTiles_%03d.png"
im = Image.open(SRC).convert("RGBA")

# post: the left post, cropped tight
post = im.crop((0, 339, 14, 449))
post.save(OUT + "post.png")

# rail: the bottom rail, cut along its own parallelogram so the rail above is excluded
X0, X1 = 14, 122
rail = Image.new("RGBA", (X1 - X0, 512))
for x in range(X0, X1):
    cy = 414 - 0.5 * (x - 16)
    for y in range(int(cy) - 7, int(cy) + 8):
        p = im.getpixel((x, y))
        if p[3] > 40 and abs(y - cy) <= 6:
            rail.putpixel((x - X0, y), p)
bb = rail.getbbox()
rail = rail.crop(bb)                       # ~108 x 65: a diagonal slab in its own box
rail.save(OUT + "rail.png")
print("post", post.size, "rail", rail.size)

# board: the flat plank slab, cropped to its opaque bounds (a 256x148 diamond of boards)
slab = Image.open("src/public/assets/farm/planks_E.png").convert("RGBA")
slab = slab.crop(slab.split()[3].point(lambda v: 255 if v > 40 else 0).getbbox())
slab.save(OUT + "board.png")
print("board", slab.size)

# ---- ground -------------------------------------------------------------------------------------
TW, TH = 132, 66
DIAMOND = [(TW / 2, -1), (TW + 1, TH / 2), (TW / 2, TH + 1), (-1, TH / 2)]   # a px proud, so butted tiles never show a hairline

def top_face(n, base, mul=1.0):
    """The top diamond of landscape tile n over a solid `base` fill, hard polygon edge (no fringe)."""
    t = Image.open(ISO % n).convert("RGBA").crop((0, 0, TW, TH))
    if mul != 1.0:
        t = Image.merge("RGBA", [c.point(lambda v: min(255, int(v * mul))) for c in t.split()[:3]] + [t.split()[3]])
    face = Image.new("RGBA", (TW, TH), (0, 0, 0, 0))
    ImageDraw.Draw(face).polygon(DIAMOND, fill=base)
    face.alpha_composite(t)
    mask = Image.new("L", (TW, TH), 0)
    ImageDraw.Draw(mask).polygon(DIAMOND, fill=255)
    face.putalpha(mask)
    return face

GRASS, DIRT = (138, 181, 73, 255), (186, 140, 93, 255)
grass, shade = top_face(75, GRASS), top_face(75, GRASS, 0.97)
patch = Image.new("RGBA", (2 * TW, 2 * TH), GRASS)
# lattice points of one 264x132 period; the diamond's top vertex sits on each. Wrapped on all four sides.
for i, (tx, ty) in enumerate([(0, 0), (TW, 0), (TW / 2, TH / 2), (3 * TW / 2, TH / 2), (0, TH), (TW, TH), (TW / 2, 3 * TH / 2), (3 * TW / 2, 3 * TH / 2)]):
    tile = shade if i in (2, 5) else grass
    for dx in (-2 * TW, 0, 2 * TW):
        for dy in (-2 * TH, 0, 2 * TH):
            patch.alpha_composite(tile, (int(tx - TW / 2 + dx), int(ty + dy)))
patch.save(GND + "grass.png")
top_face(83, DIRT).save(GND + "dirt.png")
print("grass patch", patch.size, "dirt", (TW, TH))

# ---- tree ---------------------------------------------------------------------------------------
# Kenney's flat look: solid fills, no outline, light comes from the top-left. Drawn at 2x and
# downsampled so the edges are as smooth as the renders. Canvas 180x240 at farm density (256 = one
# tile), trunk foot at the bottom centre.
S = 2
W, H = 180 * S, 240 * S
tree = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(tree)
cx, foot = W / 2, H - 4 * S
tw, th = 12 * S, 90 * S                                   # trunk: half-width per face, height
d.polygon([(cx - tw, foot - 6 * S), (cx, foot), (cx, foot - th), (cx - tw, foot - th - 6 * S)], fill=(168, 120, 74))
d.polygon([(cx, foot), (cx + tw, foot - 6 * S), (cx + tw, foot - th - 6 * S), (cx, foot - th)], fill=(122, 84, 50))
def blob(x, y, rx, fill):
    d.ellipse([x - rx, y - rx * 0.82, x + rx, y + rx * 0.82], fill=fill)
blob(cx + 30 * S, foot - 110 * S, 52 * S, (86, 130, 46))      # dark, bottom-right, at the back
blob(cx - 4 * S, foot - 128 * S, 58 * S, (118, 166, 62))      # mid
blob(cx - 30 * S, foot - 150 * S, 48 * S, (152, 198, 82))     # light, top-left, in front
tree = tree.resize((W // S, H // S), Image.LANCZOS)
tree.save(GND + "tree.png")
print("tree", tree.size)

# ---- geometry every part shares (source px) ----
PITCH = 24                                  # Kenney's own rail spacing, kept constant
post_h = lambda per: 65 + PITCH * (per - 1) # a part's post height encodes `per`: 3 -> 113 (orig 110)
STEP = (X1 - X0, -(X1 - X0) // 2)           # next part: right post sits here (iso slope -0.5)

def draw_part(canvas, ox, oy_bottom, k, per):
    """One fence part with k of `per` rails, bottom-up. (ox, oy_bottom) = bottom-left of the LEFT post.
    Same numbers as fence.mjs: rail i box top = post bottom - (40 + i*PITCH + 54)."""
    for i in range(k):
        canvas.alpha_composite(rail, (ox + X0, oy_bottom - (40 + i * PITCH + (rail.size[1] - 11))))
    H = post_h(per)
    canvas.alpha_composite(post.resize((post.size[0], H)), (ox, oy_bottom - H))

def fence(counts, per):
    n = len(counts); H = post_h(per)
    w = 20 + 136 + STEP[0] * (n - 1) + 20
    h = H + abs(STEP[1]) * n + 40
    c = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ox, oy = 10, h - 10
    for k in counts:
        draw_part(c, ox, oy, k, per)
        ox += STEP[0]; oy += STEP[1]
    c.alpha_composite(post.resize((post.size[0], H)), (ox, oy - H))   # closing post
    return c

if "--preview" in sys.argv:
    rows = [([4, 4, 3], 4, "[4,4,3]  one part a plank short"),
            ([3, 3, 3], 4, "[3,3,3]  every part short"),
            ([4, 4, 4], 4, "[4,4,4]  right"),
            ([5, 5, 5, 4], 5, "4x5 [5,5,5,4]"),
            ([4, 0, 0], 4, "[4,0,0]")]
    W = 320
    tiles = []
    for counts, per, label in rows:
        f = fence(counts, per)
        s = W / f.size[0]
        f = f.resize((W, int(f.size[1] * s)), Image.LANCZOS)
        tile = Image.new("RGBA", (W, f.size[1] + 18), (106, 168, 79, 255))
        tile.alpha_composite(f, (0, 18))
        ImageDraw.Draw(tile).text((4, 2), label, fill=(255, 255, 255, 255))
        tiles.append(tile)
    out = Image.new("RGBA", (W, sum(t.size[1] for t in tiles) + 8 * len(tiles)), (40, 40, 40, 255))
    y = 0
    for t in tiles:
        out.alpha_composite(t, (0, y)); y += t.size[1] + 8
    out.save(sys.argv[sys.argv.index("--preview") + 1])
    print("preview", out.size)
