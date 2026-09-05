// The village — a real isometric scene built from professional CC0 game art
// (Kenney "Isometric Landscape" + "Isometric Miniature Farm", public domain).
//
// Why sprites and not hand-drawn SVG: the SVG version read as a school project. Real products
// use an asset pipeline. Why not AI-generated images: tested and failed (see D-040) — the
// buildings the child chose didn't appear, every painting looked alike, long prompts errored.
// Sprites are instant, offline, always correct, and look like a shipped game.
//
// The world is a farm/homestead because that is what the art supports — designing to your
// assets is what a studio does, rather than forcing castles out of a barn pack.

const TW = 132, TH = 66, TILE_H = 83;   // tile diamond 132x66; png is 83 tall incl. depth
const COLS = 5, ROWS = 5;
const SPRITE_W = 116;                    // farm sprites scaled to sit nicely on a tile
const SPRITE_H = SPRITE_W * 2;           // source art is 256x512

const G = (n) => `/assets/iso/landscapeTiles_${String(n).padStart(3, "0")}.png`;
const F = (n) => `/assets/farm/${n}_E.png`;
const GRASS = G(15);

// opaque art bounds of each sprite in its 256x512 canvas, measured from the PNGs.
// Used to anchor art by its true footprint instead of the empty canvas.
export const BB = {"fenceHigh":[0,277,134,451],"dirtFarmland":[0,373,256,512],"cornDouble":[1,285,231,491],"hayBalesStacked":[22,346,211,489],"woodWallDoorClosed":[0,220,141,455],"roofSingle":[0,313,256,512],"woodWallWindow":[0,220,141,455],"roof":[0,242,256,512],"woodWallGateClosed":[0,220,141,455],"chimneyBase":[0,250,136,452],"chimneyTop":[61,250,113,441],"planksHigh":[0,354,256,510],"ladderStraight":[41,275,145,457],"cornYoungDouble":[32,376,219,490],"sacksCrate":[71,401,163,469],"planksSide":[0,364,256,512]};

// Each build is a small stack of sprites at one cell. dy is in scaled pixels, up is negative.
export const BUILDS = [
  { key:"fence",      label:"fence",       unit:"posts",      emoji:"🪵",
    parts:[{s:"fenceHigh"}] },
  { key:"cornfield",  label:"corn field",  unit:"seedlings",  emoji:"🌽",
    parts:[{s:"dirtFarmland"},{s:"cornDouble"}] },
  { key:"haystore",   label:"hay store",   unit:"bales",      emoji:"🌾",
    parts:[{s:"hayBalesStacked"}] },
  { key:"cottage",    label:"cottage",     unit:"planks",     emoji:"🏠",
    parts:[{s:"woodWallDoorClosed"},{s:"roofSingle",dy:-120}] },
  { key:"barn",       label:"barn",        unit:"boards",     emoji:"🛖",
    parts:[{s:"woodWallWindow"},{s:"roof",dy:-120}] },
  { key:"stable",     label:"stable",      unit:"gates",      emoji:"🐴",
    parts:[{s:"woodWallGateClosed"},{s:"roofSingle",dy:-120}] },
  { key:"forge",      label:"forge",       unit:"bricks",     emoji:"🔥",
    parts:[{s:"chimneyBase"},{s:"chimneyTop",dy:-150}] },
  { key:"watchdeck",  label:"watch deck",  unit:"beams",      emoji:"🗼",
    parts:[{s:"planksHigh"},{s:"ladderStraight",dy:-10}] },
  { key:"orchardrow", label:"orchard row", unit:"saplings",   emoji:"🌱",
    parts:[{s:"cornYoungDouble"}] },
  { key:"woodstore",  label:"wood store",  unit:"planks",     emoji:"📦",
    parts:[{s:"sacksCrate"},{s:"planksSide",dy:-6}] },
];

// Where each build lands. Chosen for screen-space spread, not grid order: on an iso grid
// screen-x is (c-r) and screen-y is (c+r), so slots are picked to vary BOTH. Early builds
// land far apart so a small village never looks cramped; the centre (2,2) is filled late so
// it reads as a village green until the farm is busy.
const SLOTS = [
  {r:3,c:1},  // left-middle
  {r:1,c:3},  // right-middle
  {r:0,c:1},  // back-right
  {r:4,c:3},  // front-left
  {r:1,c:0},  // back-left
  {r:3,c:4},  // front-right
  {r:0,c:4},  // far right point
  {r:4,c:0},  // far left point
  {r:2,c:2},  // the centre, filled late
  {r:0,c:3},  // back, between right pair
];

export function iso(r, c, originX, originY) {
  return { x: originX + (c - r) * (TW / 2), y: originY + (c + r) * (TH / 2) };
}

export function renderVillage(el, built) {
  const W = el.clientWidth || 900, H = el.clientHeight || 320;
  const K = SPRITE_W / 256;                 // source px -> world px
  const PAD = 400;                          // generous origin so nothing lands negative
  const originX = PAD, originY = PAD;
  const items = [];                          // {z,left,top,w,vis:{l,t,r,b},src,cls,delay}

  // ground
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const { x, y } = iso(r, c, originX, originY);
      const left = x - TW / 2, top = y;
      items.push({ z:(r+c), left, top, w:TW, src:GRASS, cls:"tile", delay:0,
                   vis:{ l:left, t:top, r:left+TW, b:top+TILE_H } });
    }
  }

  // buildings — anchored by the BOTTOM-CENTRE OF THEIR ART, not the empty canvas
  built.forEach((b, i) => {
    const def = BUILDS.find(d => d.key === b.key) || BUILDS[i % BUILDS.length];
    const slot = SLOTS[i % SLOTS.length];
    const { x, y } = iso(slot.r, slot.c, originX, originY);
    const groundY = y + TH;
    def.parts.forEach((p, k) => {
      const bb = BB[p.s] || [0, 0, 256, 512];
      const left = x - ((bb[0] + bb[2]) / 2) * K;
      const top  = groundY - bb[3] * K + (p.dy || 0) * K;
      items.push({ z:1000 + (slot.r+slot.c)*10 + k, left, top, w:SPRITE_W, src:F(p.s),
                   cls:"bld", delay:Math.min(i,6)*0.07,
                   vis:{ l:left + bb[0]*K, t:top + bb[1]*K,
                         r:left + bb[2]*K, b:top + bb[3]*K } });
    });
  });

  // fit to the ACTUAL painted content, so there is no wasted empty canvas
  const bx = {
    l: Math.min(...items.map(i => i.vis.l)), t: Math.min(...items.map(i => i.vis.t)),
    r: Math.max(...items.map(i => i.vis.r)), b: Math.max(...items.map(i => i.vis.b)),
  };
  const cw = bx.r - bx.l, ch = bx.b - bx.t;
  const scale = Math.min(W / cw, (H * 0.84) / ch) * 0.97;  // leave room for the header overlay

  items.sort((a, b2) => a.z - b2.z);
  const html = items.map((it, i) =>
    `<img class="${it.cls}" src="${it.src}" alt="" style="z-index:${i};`+
    `left:${(it.left - bx.l).toFixed(1)}px;top:${(it.top - bx.t).toFixed(1)}px;`+
    `width:${it.w}px;animation-delay:${it.delay}s">`).join("");

  el.innerHTML =
    `<div class="isoworld"><div class="isofit" style="width:${cw.toFixed(0)}px;`+
    `height:${ch.toFixed(0)}px;transform:translate(-50%,-50%) scale(${scale.toFixed(3)})">`+
    `${html}</div></div>`;
}

export const VILLAGE_CSS = `
.scene{background:linear-gradient(180deg,#8fd0f0 0%,#bfe6f7 55%,#dff0d8 100%)}
.isoworld{position:absolute;inset:0;overflow:hidden}
.isofit{position:absolute;left:50%;top:57%;transform-origin:center center}
/* soft ground shadow so the island sits in the world instead of floating in a void */
.isofit::before{content:"";position:absolute;left:50%;bottom:2%;width:86%;height:20%;
  transform:translateX(-50%);z-index:-1;filter:blur(10px);
  background:radial-gradient(ellipse at center,rgba(24,58,72,.40) 0%,rgba(24,58,72,.18) 45%,rgba(24,58,72,0) 72%)}
.isoworld img{position:absolute;image-rendering:auto}
.isoworld .bld{animation:plop .55s cubic-bezier(.2,1.5,.4,1) both}
@keyframes plop{0%{opacity:0;transform:translateY(-22px) scale(.86)}100%{opacity:1}}
@media (prefers-reduced-motion:reduce){.isoworld .bld{animation:none}}
`;

// A small stacked preview of one build, for UI (choice cards, rosters).
// Uses the same measured art bounds as the world, so previews match what gets built —
// no emoji stand-ins next to rendered 3D art.
export function buildPreview(def, boxW = 92, boxH = 82) {
  const K = 1;                                  // work in source px, scale at the end
  const laid = def.parts.map((p) => {
    const bb = BB[p.s] || [0, 0, 256, 512];
    const dy = (p.dy || 0) * K;
    return { s: p.s, bb,
      l: -((bb[0] + bb[2]) / 2) + bb[0],        // art-left relative to art-centre
      t: -bb[3] + dy + bb[1],                   // art-top relative to art-bottom(=0)
      r: -((bb[0] + bb[2]) / 2) + bb[2],
      b: -bb[3] + dy + bb[3],
      offX: -((bb[0] + bb[2]) / 2), offY: -bb[3] + dy };
  });
  const bx = { l: Math.min(...laid.map(o => o.l)), t: Math.min(...laid.map(o => o.t)),
               r: Math.max(...laid.map(o => o.r)), b: Math.max(...laid.map(o => o.b)) };
  const cw = bx.r - bx.l, ch = bx.b - bx.t;
  const sc = Math.min(boxW / cw, boxH / ch);
  const imgs = laid.map(o =>
    `<img src="${F(o.s)}" alt="" style="position:absolute;width:${(256 * sc).toFixed(1)}px;`+
    `left:${((o.offX - bx.l) * sc).toFixed(1)}px;top:${((o.offY - bx.t) * sc).toFixed(1)}px">`
  ).join("");
  return `<span class="bprev" style="width:${(cw*sc).toFixed(0)}px;height:${(ch*sc).toFixed(0)}px">${imgs}</span>`;
}
