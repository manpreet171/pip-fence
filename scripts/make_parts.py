"""One-off compositor (Pillow). Cuts Kenney's fenceHigh_E.png (CC0) into the two sprites the
build needs -- a post and a single rail -- so a fence part can hold any number of rails and a
missing rail leaves bare post above it. Outputs are committed; this script is provenance.

Measured on the source (256x512): left post x 0-13, y 339-448; rails slope -0.5, 11 px thick,
bottom rail centreline y = 414 - 0.5*(x-16) for x in [14,122).

Run: python scripts/make_parts.py [--preview out.png]
"""
import sys
from PIL import Image, ImageDraw

SRC = "src/public/assets/probe/fenceHigh_E.png"
OUT = "src/public/assets/fence/"
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
