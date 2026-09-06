// fence.mjs — the build IS the answer.
//
// Part 1 (this section) is pure logic with zero DOM access so `node` can import it for the
// 60-fixture eval: the mastery graph, event tally, and classify(). Part 2 (DOM) sits below in
// exported functions only.

export const IDS = ["off_by_one_in_one_group", "off_by_one_per_group", "counted_groups_as_group_size",
  "one_group_only", "over_count", "right_total_wrong_grouping", "pack_unit_confusion", "ambiguous"];

// Six shapes × two modes = the 12-node graph. groups × per (4x3 = four parts of three).
// Pack size must divide `per` or the level is unsolvable (a pack is indivisible at the point of
// use). Only 3x4 admits a proper divisor; elsewhere a pack is one full part. See D-047.
const SHAPES = [[2, 3], [3, 3], [3, 4], [4, 3], [4, 5], [2, 5]];
const packFor = (per) => { for (let d = per - 1; d > 1; d--) if (per % d === 0) return d; return per; };
export const GRAPH = ["concrete", "packs"].flatMap(mode =>
  SHAPES.map(([groups, per]) => ({ node: `${groups}x${per}_${mode}`, groups, per, mode, pack: packFor(per) })));

export const shape = (node) => GRAPH.find(g => g.node === node);

// First node not yet mastered; an ambiguous result routes to the diagnostic shape (4x3) in the
// same mode, where off_by_one_per_group and counted_groups_as_group_size predict different fences.
export function next(mastery, last) {
  if (last?.id === "ambiguous") return `4x3_${shape(last.node).mode}`;
  return GRAPH.find(g => (mastery[g.node] || 0) < 1)?.node ?? null;
}

// Final planks per part plus the bookkeeping classify() needs. Pure arithmetic on the log.
export function tally(events) {
  const s = shape(events.find(e => e.e === "level_start").node);
  const c = Array(s.groups).fill(0), removes = Array(s.groups).fill(0);
  let ordered = 0, lastAct = 0;
  for (const e of events) {
    const n = e.unit === "pack" ? (e.n ?? s.pack) : 1;
    if (e.e === "place") { c[e.group] = e.n_in_group ?? c[e.group] + n; lastAct = e.t; }
    else if (e.e === "remove") { c[e.group] = e.n_in_group ?? Math.max(0, c[e.group] - n); removes[e.group]++; lastAct = e.t; }
    else if (e.e === "order") { ordered += e.packs; lastAct = e.t; }
    else if (e.e === "place_failed" || e.e === "tap_count") lastAct = e.t;
  }
  return { s, c, ordered, lastAct, removes };
}

// classify(events) -> { id, tier, confirmed, counts, flags }
// Code owns truth. No I/O, no Date.now(), no model. Timing is arithmetic on `t` in the log.
export function classify(events) {
  const { s, c, ordered, lastAct, removes } = tally(events);
  const T = s.groups * s.per, sum = c.reduce((a, b) => a + b, 0);
  const flags = removes.some(n => n >= 4) ? ["wheel_spinning"] : [];  // ponytail: ≥4 removes on one part; "no net progress" not tracked
  const hints = events.filter(e => e.e === "hint");
  const tier = id => Math.min(3, 1 + hints.filter(h => h.id === id).length);
  const out = (id, confirmed = true) => ({ id, tier: tier(id), confirmed, counts: c, flags, node: s.node });

  // Packs: ordering a pack per plank is the misconception even when the fence comes out right --
  // the order is the multiplicative act this mode exists to observe, and the surplus sits in the cart.
  if (s.mode === "packs" && ordered === T) return out("pack_unit_confusion");
  if (c.every(n => n === s.per)) return out("correct");
  const ci = events.findLastIndex(e => e.e === "commit");
  if (ci < 0) return out("in_progress", false);
  const commit = events[ci], prev = events[ci - 1];

  const filled = c.filter(n => n > 0);
  // Each filled part holds exactly `groups` planks. With a finite cart this is [4,4,4,0] on 4x3,
  // not [4,4,4,4]: when groups > per the cart runs dry before the last part.
  const asGroups = s.groups !== s.per && filled.every(n => n === s.groups) && (filled.length === s.groups || sum === T);
  const perGroup = c.every(n => n === s.per - 1);
  // The probe was shown for the collision: its outcome (tap, or silence past 20 s) outranks the idle rule,
  // otherwise the 45 s idle commit would always land on idle_off_task and the escalation could never fire.
  if (asGroups && perGroup && hints.some(h => h.id === "ambiguous")) return resolveAmbiguous(events, hints, c, s, out);

  // Interface, not maths: the last act was a failed tap, while holding, aimed at a part that is short.
  if (prev?.e === "place_failed" && c[prev.nearest_group] < s.per) return out("interface_failure");
  // Disengagement, not maths: the commit came from the idle timer, not from her. A deliberate Done is
  // always read as her answer, however long she looked at it first (QA D-3: a 30 s gap rule made a
  // presenter's pause silence the hint on camera).
  if (commit.reason === "idle") return out("idle_off_task");
  // Packs: one pack per part, when a pack is not a part.
  if (s.mode === "packs" && ordered === s.groups && s.pack !== s.per) return out("pack_unit_confusion");

  if (asGroups && perGroup) return resolveAmbiguous(events, hints, c, s, out);
  if (asGroups) return out("counted_groups_as_group_size");
  if (sum === T && c.includes(0)) return out("right_total_wrong_grouping");
  if (c.some(n => n > s.per)) return out("over_count");
  if (filled.length === 1) return out("one_group_only");
  if (c.filter(n => n === s.per - 1).length === 1 && c.filter(n => n === s.per).length === s.groups - 1)
    return out("off_by_one_in_one_group");
  if (perGroup) return out("off_by_one_per_group");
  return out("ambiguous", false);
}

// The collision (per-1 === groups: 2x3, 3x4, 4x5). Before the "show me a finished part" hint we
// say ambiguous. After it, a tap on a part she calls finished resolves it: a full part means she
// holds a correct reference; a short one means she counted parts as the size of a part. No tap
// within 20 s -> escalate on the likelier branch, unconfirmed.
function resolveAmbiguous(events, hints, c, s, out) {
  const h = hints.findLast(x => x.id === "ambiguous");
  if (!h) return out("ambiguous", false);
  const tap = events.find(e => e.e === "tap_count" && e.t > h.t);
  if (tap) return out(c[tap.group] === s.per ? "off_by_one_in_one_group" : "counted_groups_as_group_size");
  const commit = events.findLast(e => e.e === "commit");
  return commit.t - h.t >= 20000 ? out("counted_groups_as_group_size", false) : out("ambiguous", false);
}

// ---------------------------------------------------------------------------------------------
// Part 2: DOM. Runs only inside exported functions, so `node` imports stay clean.
// Sprites are the Kenney cut-outs from scripts/make_parts.py. Geometry is in source px, scaled by
// K so one fence part (122 source px between post centres) spans one tile edge (66 world px).
import { iso, BB, VILLAGE_CSS } from "./village.mjs";

// The slice classify() reads: the current level, and after an `order_reset` ("Order again") only the
// events since it — plus the earlier hints, so the tier keeps climbing. Pure; here so the parent page
// reads the log the same way the game does.
export function level(events) {
  const L = events.slice(events.findLastIndex(e => e.e === "level_start")), i = L.findLastIndex(e => e.e === "order_reset");
  return i < 0 ? L : [L[0], ...L.slice(1, i).filter(e => e.e === "hint"), ...L.slice(i + 1)];
}

const TW = 132, TH = 66, GRASS = "/assets/iso/landscapeTiles_015.png";
const K = 66 / 122, KF = TW / 256;                    // KF: farm sprites (256-wide canvas) onto a 132 tile
const POST_W = 14, RAIL_W = 108, RAIL_H = 65, SLAB = 11, PITCH = 24;
const postH = per => 65 + PITCH * (per - 1);          // the post height encodes how tall a full part is
const SPRITE = { post: "/assets/fence/post.png", rail: "/assets/fence/rail.png", goat: "/assets/animals/goat.png",
  dirtFarmland: "/assets/farm/dirtFarmland_E.png", cornYoungDouble: "/assets/farm/cornYoungDouble_E.png" };
const GOAT_W = 46, GOAT_H = 46 * 171 / 184;
const px = n => n.toFixed(1) + "px";

// Post feet (bottom-centre, world px) for part p. The fence runs along the back-left edge of
// column 0: the left post stands on the LEFT vertex of tile (rows-1-p, 0), the right post on its TOP
// vertex. Consecutive parts share a post.
function feet(p, g) {
  const { x, y } = iso(g.rows - 1 - p, 0, g.originX, g.originY);
  return { lx: x - TW / 2, ly: y + TH / 2, rx: x, ry: y };
}
const postBox = (fx, fy, per) => ({ l: fx - (POST_W / 2) * K, t: fy - postH(per) * K, w: POST_W * K, h: postH(per) * K });
function railBox(p, i, g) {
  const f = feet(p, g);
  return { l: f.lx + (POST_W / 2) * K, t: f.ly - (40 + i * PITCH + (RAIL_H - SLAB)) * K, w: RAIL_W * K, h: RAIL_H * K };
}
// Goat feet (bottom-centre, world px): outside = centre of the tile beyond the fence, inside = centre
// of the tile just behind it. The straight line between them crosses the fence at the part's middle.
function goatFeet(p, inside, g) {
  const { x, y } = iso(g.rows - 1 - p, 0, g.originX, g.originY);
  return inside ? { x, y: y + TH / 2 } : { x: x - TW / 2, y };
}
const at = (b, g) => `left:${px(b.l - g.bx.l)};top:${px(b.t - g.bx.t)};width:${px(b.w)};height:${px(b.h)}`;  // explicit height: the box is hittable before the image decodes

// Draws ground + corn + posts + goat + one transparent hit region per part, and pins bbox and scale
// from the FINISHED fence (every rail present, goat at every rest spot) so the camera never moves as
// planks land. Returns geometry.
export function mountScene(el, plan) {
  const g = { rows: plan.groups, cols: 2, per: plan.per, originX: 400, originY: 400, goat: { part: Math.floor(plan.groups / 2), inside: false } };
  const W = el.clientWidth || 900, H = el.clientHeight || 420;
  const vis = [], cells = [];
  for (let r = 0; r < g.rows; r++) for (let c = 0; c < g.cols; c++) {
    const { x, y } = iso(r, c, g.originX, g.originY);
    cells.push({ x, y, l: x - TW / 2, t: y, z: 1 + r + c, r, c });
    vis.push({ l: x - TW / 2, t: y, r: x + TW / 2, b: y + 83 });
  }
  for (let p = 0; p < g.rows; p++) {
    const f = feet(p, g);
    for (const b of [postBox(f.lx, f.ly, g.per), postBox(f.rx, f.ry, g.per)]) vis.push({ l: b.l, t: b.t, r: b.l + b.w, b: b.t + b.h });
    for (let i = 0; i < g.per; i++) { const b = railBox(p, i, g); vis.push({ l: b.l, t: b.t, r: b.l + b.w, b: b.t + b.h }); }
    const q = goatFeet(p, false, g); vis.push({ l: q.x - GOAT_W / 2, t: q.y - GOAT_H, r: q.x + GOAT_W / 2, b: q.y });
  }
  g.bx = { l: Math.min(...vis.map(v => v.l)), t: Math.min(...vis.map(v => v.t)), r: Math.max(...vis.map(v => v.r)), b: Math.max(...vis.map(v => v.b)) };
  const cw = g.bx.r - g.bx.l, ch = g.bx.b - g.bx.t;
  g.cw = cw; g.ch = ch;
  g.scale = Math.min(W / cw, H / ch) * 0.94;
  // bbox is pinned for the life of the level; only the scale follows the viewport.
  const fit = () => { const f = el.querySelector(".isofit"); if (!f) return;
    g.scale = Math.min(el.clientWidth / cw, el.clientHeight / ch) * 0.94;
    f.style.transform = `translate(-50%,-50%) scale(${g.scale.toFixed(3)})`; };
  new ResizeObserver(fit).observe(el);

  const tiles = cells.map(c => `<img class="tile" src="${GRASS}" alt="" style="z-index:${c.z};left:${px(c.l - g.bx.l)};top:${px(c.t - g.bx.t)};width:${TW}px">`).join("");
  // Something to protect: the inner column is a planted strip. Farm art is anchored by the
  // bottom-centre of its measured opaque bounds (BB), the same way village.mjs seats buildings.
  const farm = (key, c, z) => { const bb = BB[key];
    return `<img class="bld" src="${SPRITE[key]}" alt="" style="z-index:${z};left:${px(c.x - ((bb[0] + bb[2]) / 2) * KF - g.bx.l)};top:${px(c.y + TH - bb[3] * KF - g.bx.t)};width:${TW}px">`; };
  const corn = cells.filter(c => c.c === 1).map(c => farm("dirtFarmland", c, 10 + c.r) + farm("cornYoungDouble", c, 150 + c.r)).join("");
  let frame = "";
  for (let p = 0; p <= g.rows; p++) {
    const f = p < g.rows ? feet(p, g) : (() => { const q = feet(g.rows - 1, g); return { lx: q.rx, ly: q.ry }; })();
    const b = postBox(f.lx, f.ly, g.per);
    frame += `<img class="post" src="${SPRITE.post}" alt="" style="z-index:${200 + p};${at(b, g)}">`;
    if (p < g.rows) {
      const H2 = postH(g.per) * K + 4;
      frame += `<div class="hit" data-part="${p}" style="left:${px(f.lx - 6 - g.bx.l)};top:${px(f.ry - H2 - g.bx.t)};width:78px;height:${px(H2 + TH / 2)};` +
        `clip-path:polygon(6px ${px(TH / 2)},72px 0,72px ${px(H2)},6px ${px(H2 + TH / 2)})"></div>`;
    }
  }
  const gf = goatFeet(g.goat.part, false, g);
  const goat = `<img class="goat" src="${SPRITE.goat}" alt="" style="left:${px(gf.x - GOAT_W / 2 - g.bx.l)};top:${px(gf.y - GOAT_H - g.bx.t)};width:${px(GOAT_W)}">`;
  el.innerHTML = `<div class="isoworld"><div class="isofit" style="width:${px(cw)};height:${px(ch)};transform:translate(-50%,-50%) scale(${g.scale.toFixed(3)})">${tiles}${corn}${frame}${goat}</div></div>`;
  el.geom = g;
  return g;
}

// One rail lands. Appended, never re-rendered, so existing sprites keep their state and `plop`
// fires once per plank. i >= per is the over-count rail: it sits above the post, tilted; --o is
// how far over, so a stack of them leans further the higher it goes.
export function appendPlank(el, part, i) {
  const g = el.geom, b = railBox(part, i, g), over = i >= g.per;
  el.querySelector(".isofit").insertAdjacentHTML("beforeend",
    `<img class="rail${over ? " over" : ""}" data-part="${part}" data-i="${i}" src="${SPRITE.rail}" alt="" style="z-index:${100 + part};${over ? `--o:${i - g.per};` : ""}${at(b, g)}">`);
}
export function removePlank(el, part, i) {
  el.querySelector(`.rail[data-part="${part}"][data-i="${i}"]`)?.remove();
}

// World px -> px inside `el` (the .isofit is centred at 50%/57% and scaled about its centre).
function toScene(el, wx, wy) {
  const g = el.geom;
  return { x: el.clientWidth / 2 + (wx - g.bx.l - g.cw / 2) * g.scale, y: el.clientHeight * 0.57 + (wy - g.bx.t - g.ch / 2) * g.scale };
}
// Where a speech bubble points: just above the middle of part p.
export function partTop(el, part) {
  const g = el.geom, f = feet(part, g);
  return toScene(el, (f.lx + f.rx) / 2, (f.ly + f.ry) / 2 - postH(g.per) * K - 8);
}
// Centre of rail i of part p, for the counting pips.
export function railPoint(el, part, i) {
  const b = railBox(part, i, el.geom);
  return toScene(el, b.l + b.w / 2, b.t + b.h * 0.55);
}

// The goat walks, one leg at a time: along the outside to the part, then through it. CSS does the
// moving (a transition on transform); this only sets waypoints. Reduced motion: it steps.
export function goatWalk(el, part, inside) {
  const g = el.geom, s = g.goat, img = el.querySelector(".goat"), base = goatFeet(Math.floor(g.rows / 2), false, g);
  const legs = [];
  if (s.inside && s.part !== part) legs.push([s.part, false]);
  if (inside) legs.push([part, false]);
  legs.push([part, inside]);
  clearTimeout(s.timer);
  const dur = matchMedia("(prefers-reduced-motion:reduce)").matches ? 0 : 1400;
  const step = () => {
    const l = legs.shift(); if (!l) return;
    if (l[0] === s.part && l[1] === s.inside) return step();
    const p = goatFeet(l[0], l[1], g);
    img.style.transform = `translate(${px(p.x - base.x)},${px(p.y - base.y)})`;
    img.classList.toggle("in", l[1]);
    s.part = l[0]; s.inside = l[1];
    s.timer = setTimeout(step, dur + 60);
  };
  step();
}

// One delegated listener for the whole scene. fn(part, railIndex|null, event) on a part; fn(null)
// when the tap lands in the world on no part (the caller decides whether that is place_failed or
// tap_idle).
export function onTap(el, fn) {
  el.addEventListener("click", e => {
    const h = e.target.closest("[data-part]");
    fn(h ? +h.dataset.part : null, h && h.dataset.i !== undefined ? +h.dataset.i : null, e);
  });
}

export const FENCE_CSS = VILLAGE_CSS + `
.isoworld{touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer}
.isoworld .hit{position:absolute;z-index:50}
.isoworld .tile,.isoworld .bld,.isoworld .goat{pointer-events:none}   /* scenery never eats a tap; only rails and hit regions are targets */
.isoworld .bld{animation:none}
.isoworld .rail{animation:plop .45s cubic-bezier(.2,1.5,.4,1) both;transform-origin:left bottom}
.isoworld .rail.over{--o:0;transform:rotate(calc(-12deg - var(--o) * 2deg)) translate(calc(4px + var(--o) * 3px),-6px);filter:drop-shadow(3px 5px 3px rgba(0,0,0,.35))}
.isoworld .goat{z-index:90;transition:transform 1.4s ease-in-out,z-index 0s .7s}
.isoworld .goat.in{z-index:300}
@keyframes plop{0%{opacity:0;translate:0 -22px;scale:.86}100%{opacity:1}}
@media (prefers-reduced-motion:reduce){.isoworld .rail{animation:none}.isoworld .goat{transition:none}}
`;
