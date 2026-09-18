// fence.mjs — the build IS the answer.
//
// Part 1 (this section) is pure logic with zero DOM access so `node` can import it for the
// 60-fixture eval: the mastery graph, event tally, and classify(). Part 2 (DOM) sits below in
// exported functions only.

export const IDS = ["off_by_one_in_one_group", "off_by_one_per_group", "counted_groups_as_group_size",
  "one_group_only", "over_count", "right_total_wrong_grouping", "pack_unit_confusion", "ambiguous",
  "ordered_short", "ordered_over", "counted_present_not_missing", "fixed_one_part_only",            // fix (docs/MODES.md)
  "parts_equal_total", "parts_equal_per", "parts_one_short", "parts_one_over"];                     // share

// Six shapes × four modes = the 24-node graph, in chapter order. groups × per (4x3 = four parts of three).
// Pack size must divide `per` or the level is unsolvable (a pack is indivisible at the point of
// use). Only 3x4 admits a proper divisor; elsewhere a pack is one full part. See D-047.
const SHAPES = [[2, 3], [3, 3], [3, 4], [4, 3], [4, 5], [2, 5]];
export const CHAPTERS = ["Build", "Packs", "Fix", "Share"];
const MODES = ["concrete", "packs", "fix", "share"];
// Fix: the planks already standing per part. At least two parts short by different amounts, the
// total missing between 3 and total-2, and never equal to the planks standing (D-078).
const FIX = { "2x3": [2, 0], "3x3": [2, 3, 1], "3x4": [2, 4, 1], "4x3": [3, 1, 3, 0], "4x5": [3, 5, 1, 5], "2x5": [2, 4] };
const packFor = (per) => { for (let d = per - 1; d > 1; d--) if (per % d === 0) return d; return per; };
export const GRAPH = MODES.flatMap((mode, chapter) =>
  SHAPES.map(([groups, per]) => ({ node: `${groups}x${per}_${mode}`, groups, per, mode, chapter, pack: packFor(per), ...(mode === "fix" && { pre: FIX[groups + "x" + per] }) })));

export const shape = (node) => GRAPH.find(g => g.node === node);

// The highest open chapter: each one opens when the previous holds three gold stars.
export function unlocked(mastery) {
  let ch = 0;
  while (ch < CHAPTERS.length - 1 && GRAPH.filter(g => g.chapter === ch && mastery[g.node] >= 1).length >= 3) ch++;
  return ch;
}
// First open node not yet mastered; an ambiguous result routes to the diagnostic shape in the same
// mode: 4x3, where off_by_one_per_group and counted_groups_as_group_size predict different fences,
// or 2x5 for share, the one shape where `per` is neither groups-1 nor groups+1 (D-078).
export function next(mastery, last) {
  if (last?.id === "ambiguous") { const m = shape(last.node).mode; return m === "share" ? "2x5_share" : `4x3_${m}`; }
  const u = unlocked(mastery);
  return GRAPH.find(g => g.chapter <= u && (mastery[g.node] || 0) < 1)?.node ?? null;
}

// Pip plans the next fence (D-081). Code lists the open fences that exercise what she got wrong
// last; the model picks one of them and says why; code checks the pick against this same list.
// "correct" or an unknown id opens every unmastered fence; an empty fit falls back to all open.
const EXERCISES = {
  counted_groups_as_group_size: g => g.groups !== g.per && g.mode !== "share",
  right_total_wrong_grouping: g => g.groups >= 3 && g.mode !== "share",
  one_group_only: g => g.groups >= 3 && g.mode !== "share",
  pack_unit_confusion: g => g.mode === "packs",
  ordered_short: g => g.mode === "fix", ordered_over: g => g.mode === "fix",
  counted_present_not_missing: g => g.mode === "fix", fixed_one_part_only: g => g.mode === "fix",
  parts_equal_total: g => g.mode === "share", parts_equal_per: g => g.mode === "share",
  parts_one_short: g => g.mode === "share", parts_one_over: g => g.mode === "share",
};
export function candidates(mastery, last) {
  const u = unlocked(mastery), fit = EXERCISES[last?.id] || (() => true);
  const open = GRAPH.filter(g => g.chapter <= u && (mastery[g.node] || 0) < 1);
  // Never leave a chapter while it still has an unmastered fence (D-091): the next chapter opens on
  // the map at three gold stars, but she is sent there only when every fence here is gold.
  const here = open.filter(g => g.chapter === shape(last?.node)?.chapter), pool = here.length ? here : open;
  const c = pool.filter(fit);
  return (c.length ? c : pool).map(g => g.node);
}

// Pip shows her, on her own fence (D-082). A worked example is a script of moves in a fixed
// vocabulary: point at a part, count it, place a plank on it, take one off, say a line. The model
// writes the script from the real counts; validShow() simulates it and accepts only a script that
// fixes at least one part, breaks none, never over-fills, and stops within twelve moves. The
// child's agency stays: one part is fixed, the rest is hers. codeShow() is the fallback.
export const SHOW_OPS = ["point", "count", "place", "remove", "say"];
export function validShow(steps, { per, parts, cart }) {
  if (!Array.isArray(steps) || !steps.length || steps.length > 12) return false;
  const c = [...parts]; let k = cart, says = 0;
  for (const st of steps) {
    if (!st || !SHOW_OPS.includes(st.op)) return false;
    if (st.op === "say") { if (typeof st.text !== "string" || !st.text.trim() || ++says > 3) return false; continue; }
    if (!Number.isInteger(st.part) || st.part < 0 || st.part >= c.length) return false;
    if (st.op === "place") { if (k < 1 || c[st.part] >= per) return false; c[st.part]++; k--; }
    if (st.op === "remove") { if (c[st.part] < 1) return false; c[st.part]--; k++; }
  }
  const fixed = parts.some((n, i) => n !== per && c[i] === per), broke = parts.some((n, i) => n === per && c[i] !== per);
  return fixed && !broke;
}
export function codeShow({ per, parts, cart }) {
  const p = parts.findIndex(n => n !== per); if (p < 0) return [];
  const short = parts[p] < per, n = Math.abs(per - parts[p]);
  if (short && cart < n) return [];
  return [{ op: "point", part: p }, { op: "say", text: short ? "This part is short. I count it first." : "This part has a plank sticking out. I count it first." }, { op: "count", part: p },
    ...Array.from({ length: n }, () => ({ op: short ? "place" : "remove", part: p })),
    { op: "say", text: short ? "Now it reaches the top of its post. You do the other parts like this." : "Now it stops at the top of its post. Look at the other parts like this." }];
}

// Final planks per part plus the bookkeeping classify() needs. Pure arithmetic on the log. Fix starts
// from the pre-built planks; share has no parts until the `parts` event.
export function tally(events) {
  const s = shape(events.find(e => e.e === "level_start").node);
  let c = s.pre ? [...s.pre] : Array(s.mode === "share" ? 0 : s.groups).fill(0), removes = Array(s.groups).fill(0);
  let ordered = 0, lastAct = 0, parts = null;
  for (const e of events) {
    const n = e.unit === "pack" ? (e.n ?? s.pack) : 1;
    if (e.e === "place") { c[e.group] = e.n_in_group ?? c[e.group] + n; lastAct = e.t; }
    else if (e.e === "remove") { c[e.group] = e.n_in_group ?? Math.max(0, c[e.group] - n); removes[e.group]++; lastAct = e.t; }
    else if (e.e === "order") { ordered += e.planks ?? e.packs; lastAct = e.t; }
    else if (e.e === "parts") { parts = e.n; c = Array(e.n).fill(0); lastAct = e.t; }
    else if (e.e === "place_failed" || e.e === "tap_count") lastAct = e.t;
  }
  return { s, c, ordered, lastAct, removes, parts };
}

// classify(events) -> { id, tier, confirmed, counts, flags }
// Code owns truth. No I/O, no Date.now(), no model. Timing is arithmetic on `t` in the log.
export function classify(events) {
  const { s, c, ordered, lastAct, removes, parts } = tally(events);
  const T = s.groups * s.per, sum = c.reduce((a, b) => a + b, 0);
  const flags = removes.some(n => n >= 4) ? ["wheel_spinning"] : [];  // ponytail: ≥4 removes on one part; "no net progress" not tracked
  const hints = events.filter(e => e.e === "hint");
  const tier = id => Math.min(3, 1 + hints.filter(h => h.id === id).length);
  const out = (id, confirmed = true) => ({ id, tier: tier(id), confirmed, counts: c, flags, node: s.node });

  // Packs: ordering a pack per plank is the misconception even when the fence comes out right --
  // the order is the multiplicative act this mode exists to observe, and the surplus sits in the cart.
  if (s.mode === "packs" && ordered === T) return out("pack_unit_confusion");
  // Fix, the same discipline: the order is the subtraction this mode observes. Ordering the planks
  // that stand, or more than the gaps, is the finding even if every gap then gets filled (D-078).
  const missing = s.pre?.map(n => s.per - n) ?? [], M = missing.reduce((a, b) => a + b, 0);
  if (s.pre && ordered && ordered === T - M) return out("counted_present_not_missing");
  if (s.pre && ordered > M) return out("ordered_over");
  if (s.mode === "share" && parts === null) return out("in_progress", false);
  if (c.every(n => n === s.per) && (parts === null || parts === s.groups)) return out("correct");   // share: the right count of full parts
  const ci = events.findLastIndex(e => e.e === "commit");
  if (ci < 0) return out("in_progress", false);
  const commit = events[ci], prev = events[ci - 1];
  const filled = c.filter(n => n > 0);
  // Each filled part holds exactly `groups` planks. With a finite cart this is [4,4,4,0] on 4x3,
  // not [4,4,4,4]: when groups > per the cart runs dry before the last part.
  const asGroups = c.length === s.groups && s.groups !== s.per && filled.every(n => n === s.groups) && (filled.length === s.groups || sum === T);
  const perGroup = c.every(n => n === s.per - 1);
  // The probe was shown for the collision: its outcome (tap, or silence past 20 s) outranks the idle rule,
  // otherwise the 45 s idle commit would always land on idle_off_task and the escalation could never fire.
  if (asGroups && perGroup && hints.some(h => h.id === "ambiguous")) return resolveAmbiguous(events, hints, c, s, out, "off_by_one_in_one_group", "counted_groups_as_group_size");

  // Interface, not maths: the last act was a failed tap, while holding, aimed at a part that is short.
  if (prev?.e === "place_failed" && c[prev.nearest_group] < s.per) return out("interface_failure");
  // Disengagement, not maths: the commit came from the idle timer, not from her. A deliberate Done is
  // always read as her answer, however long she looked at it first (QA D-3: a 30 s gap rule made a
  // presenter's pause silence the hint on camera).
  if (commit.reason === "idle") return out("idle_off_task");
  // Share: the division is the number of parts she built. Off by the other number on the sign, or by a
  // part either way; when two of those name the same count (per = groups±1) the fence cannot tell them
  // apart and we stay silent. The right count falls through to the concrete rules for the filling.
  if (s.mode === "share" && parts !== s.groups) {
    const ids = [parts === T && "parts_equal_total", parts === s.per && "parts_equal_per", parts === s.groups - 1 && "parts_one_short", parts === s.groups + 1 && "parts_one_over"].filter(Boolean);
    if (ids.length === 1) return out(ids[0]);
    // parts_equal_per against parts_one_short/over (per = groups±1): the probe decides. A full part
    // called finished means she knows a part's size and is out by a part; a bare or short one means
    // she read the sign's planks as parts. No tap: the sign reading, unconfirmed.
    return ids.length === 2 ? resolveAmbiguous(events, hints, c, s, out, ids.find(i => i !== "parts_equal_per"), "parts_equal_per") : out("ambiguous", false);
  }

  // Fix: exactly one part's shortfall ordered and only that part filled; fewer than the gaps and all of it
  // placed. The right order falls through to the concrete rules for the placing.
  if (s.pre && ordered && ordered < M) {
    const k = missing.findIndex((m, i) => m && ordered === m && c[i] === s.per);
    if (k >= 0 && c.every((n, i) => i === k || n === s.pre[i])) return out("fixed_one_part_only");
    return sum === T - M + ordered ? out("ordered_short") : out("ambiguous", false);
  }

  // Packs: one pack per part, when a pack is not a part.
  if (s.mode === "packs" && ordered === s.groups && s.pack !== s.per) return out("pack_unit_confusion");

  if (asGroups && perGroup) return resolveAmbiguous(events, hints, c, s, out, "off_by_one_in_one_group", "counted_groups_as_group_size");
  if (asGroups) return out("counted_groups_as_group_size");
  if (sum === T && c.includes(0)) return out("right_total_wrong_grouping");
  if (c.some(n => n > s.per)) return out("over_count");
  if (filled.length === 1) return out("one_group_only");
  if (c.filter(n => n === s.per - 1).length === 1 && c.filter(n => n === s.per).length === s.groups - 1)
    return out("off_by_one_in_one_group");
  if (perGroup) return out("off_by_one_per_group");
  return out("ambiguous", false);
}

// A collision (concrete: per-1 === groups on 2x3, 3x4, 4x5; share: per === groups±1). Before the
// "tap a part you think is finished" probe we say ambiguous. After it, her tap resolves it: a full
// part means she holds a correct reference (`full`); a short one means she mixed the two numbers up
// (`short`). No tap within 20 s -> the likelier branch, `short`, unconfirmed.
function resolveAmbiguous(events, hints, c, s, out, full, short) {
  const h = hints.findLast(x => x.id === "ambiguous");
  if (!h) return out("ambiguous", false);
  const tap = events.find(e => e.e === "tap_count" && e.t > h.t);
  if (tap) return out(c[tap.group] === s.per ? full : short);
  const commit = events.findLast(e => e.e === "commit");
  return commit.t - h.t >= 20000 ? out(short, false) : out("ambiguous", false);
}

// ---------------------------------------------------------------------------------------------
// Part 2: DOM. Runs only inside exported functions, so `node` imports stay clean.
// Sprites are the Kenney cut-outs from scripts/make_parts.py. Geometry is in source px, scaled by
// K so one fence part (122 source px between post centres) spans one tile edge (66 world px).
// Isometric placement: tile (r, c) to screen, and each farm sprite's measured opaque bounds
// [left, top, right, bottom] in its 256x512 source, so art is anchored by its feet, not its box.
const TW = 132, TH = 66, DEEP = 3;   // tile diamond 132x66; the paddock is `groups` tiles wide and DEEP tiles back
const iso = (r, c, originX, originY) => ({ x: originX + (c - r) * (TW / 2), y: originY + (c + r) * (TH / 2) });
export const BB = {"fenceHigh":[0,277,134,451],"dirtFarmland":[0,373,256,512],"cornDouble":[1,285,231,491],"hayBalesStacked":[22,346,211,489],"woodWallDoorClosed":[0,220,141,455],"roofSingle":[0,313,256,512],"woodWallWindow":[0,220,141,455],"roof":[0,242,256,512],"woodWallGateClosed":[0,220,141,455],"chimneyBase":[0,250,136,452],"chimneyTop":[61,250,113,441],"planksHigh":[0,354,256,510],"ladderStraight":[41,275,145,457],"cornYoungDouble":[32,376,219,490],"sacksCrate":[71,401,163,469],"planksSide":[0,364,256,512]};

// The slice classify() reads: the current level, and after an `order_reset` ("Order again") only the
// events since it — plus the earlier hints, so the tier keeps climbing. Pure; here so the parent page
// reads the log the same way the game does.
export function level(events) {
  const L = events.slice(events.findLastIndex(e => e.e === "level_start")), i = L.findLastIndex(e => e.e === "order_reset");
  return i < 0 ? L : [L[0], ...L.slice(1, i).filter(e => e.e === "hint"), ...L.slice(i + 1)];
}

const K = 66 / 122;                                   // farm art is scaled per call from its 256-wide canvas
const KT = TW / 256;                                  // a 256-wide farm canvas on one 132-wide tile
const POST_W = 14, RAIL_W = 108, RAIL_H = 65, SLAB = 11, PITCH = 24;
const postH = per => 65 + PITCH * (per - 1);          // the post height encodes how tall a full part is
const A = "/assets/", SPRITE = { post: A + "fence/post.png", rail: A + "fence/rail.png", goat: A + "animals/goat.png", fence: A + "farm/fenceHigh_E.png",
  grass: A + "ground/grass.png", dirt: A + "ground/dirt.png", tree: A + "ground/tree.png" };
const GOAT_W = 52, GOAT_H = 52 * 171 / 184;
const BARN = 0.8;                                     // the barn's tile size as a fraction of a world tile (D-070)
const px = n => n.toFixed(1) + "px";

// Post feet (bottom-centre, world px) for part p. The buildable side is the paddock's FRONT-RIGHT
// edge, the one facing the camera: part p runs along tile (rows-1-p, DEEP-1), left post on its BOTTOM
// vertex, right post on its RIGHT vertex, rising to the right at the iso slope. Part 0 is nearest the
// camera's left; consecutive parts share a post. (D-069: it used to be the back-left edge.)
function feet(p, g) {
  const { x, y } = iso(g.rows - 1 - p, DEEP - 1, g.originX, g.originY);
  return { lx: x, ly: y + TH, rx: x + TW / 2, ry: y + TH / 2 };
}
const postBox = (fx, fy, per) => ({ l: fx - (POST_W / 2) * K, t: fy - postH(per) * K, w: POST_W * K, h: postH(per) * K });
function railBox(p, i, g) {
  const f = feet(p, g);
  return { l: f.lx + (POST_W / 2) * K, t: f.ly - (40 + i * PITCH + (RAIL_H - SLAB)) * K, w: RAIL_W * K, h: RAIL_H * K };
}
// Goat feet (bottom-centre, world px): outside = centre of the tile beyond the fence, towards the
// camera; inside = centre of the fenced tile. The straight line between them crosses the part's middle.
function goatFeet(p, inside, g) {
  const { x, y } = iso(g.rows - 1 - p, DEEP - 1, g.originX, g.originY);
  return inside ? { x, y: y + TH / 2 } : { x: x + TW / 2, y: y + TH };
}
const goatBox = (p, inside, g) => { const q = goatFeet(p, inside, g); return { l: q.x - GOAT_W / 2, t: q.y - GOAT_H, w: GOAT_W, h: GOAT_H }; };
const at = (b, g) => `left:${px(b.l - g.bx.l)};top:${px(b.t - g.bx.t)};width:${px(b.w)};height:${px(b.h)}`;  // explicit height: the box is hittable before the image decodes

// Farm art anchored by the bottom-centre of its measured opaque bounds (BB), so every sprite stands on its feet
// buildings; (x,y) is the ground point, w the on-screen canvas width. For props (hay, sack).
const farm = (key, x, y, z, g, w = TW) => { const bb = BB[key], k = w / 256;
  return `<img class="bld" src="${A}farm/${key}_E.png" alt="" style="z-index:${z};left:${px(x - ((bb[0] + bb[2]) / 2) * k - g.bx.l)};top:${px(y - bb[3] * k - g.bx.t)};width:${px(w)}">`; };
// Farm art seated by its canvas: (128,512) of the 256x512 source is the tile's bottom vertex, so walls
// and roofs land on the tile edges they were drawn on. dy is in source px, up is negative. For buildings.
const seat = (key, x, y, z, k, g, dy = 0, clipTop = 0) =>
  `<img class="bld" src="${A}farm/${key}.png" alt="" style="z-index:${z};left:${px(x - 128 * k - g.bx.l)};top:${px(y - (512 - dy) * k - g.bx.t)};width:${px(256 * k)}${clipTop ? `;clip-path:inset(${clipTop}% 0 0 0)` : ""}">`;
// The paddock walls are the barn's panels cut down: only the lower part shows, about the height of the
// tallest fence she can build, so a wall never dwarfs the side that is hers.
const WALL_CLIP = 61;
// A finished Kenney fence along one tile edge, seated by its LOW post's foot. Measured in the source:
// low post foot (6,449), high post foot (127,388), i.e. one tile edge at K. The sprite rises to the
// right; the perpendicular edges use the same sprite mirrored with scaleX(-1), so the low post is then
// the box's right-hand post.
const FW = 256 * K;
const staticFence = (lx, ly, mirror, z, g) =>
  `<img class="bld${mirror ? " mir" : ""}" src="${SPRITE.fence}" alt="" style="z-index:${z};left:${px(lx - (mirror ? FW - 6 * K : 6 * K) - g.bx.l)};top:${px(ly - 449 * K - g.bx.t)};width:${px(FW)}">`;
// Soft elliptical ground shadow centred on (x,y).
const shadow = (x, y, w, h, z, g) => `<div class="shd" style="z-index:${z};left:${px(x - w / 2 - g.bx.l)};top:${px(y - h / 2 - g.bx.t)};width:${px(w)};height:${px(h)}"></div>`;
// One flat landscape tile (its top diamond only) with its top vertex at (x,y).
const tile = (src, x, y, z, g) => `<img class="bld" src="${src}" alt="" style="z-index:${z};left:${px(x - TW / 2 - g.bx.l)};top:${px(y - g.bx.t)};width:${TW}px">`;
// A tree with its trunk foot at (x,y): the 180x240 sprite at farm density, plus its ground shadow. The
// wrapper carries its world-x span so fit() can drop a tree the frame would cut in half (phone).
const tree = (x, y, z, g, mirror) => `<div class="tree" data-l="${px(x - 90 * KT)}" data-r="${px(x + 90 * KT)}">` + shadow(x, y - 2, 70, 22, z, g) +
  `<img class="bld${mirror ? " mir" : ""}" src="${SPRITE.tree}" alt="" style="z-index:${z + 1};left:${px(x - 90 * KT - g.bx.l)};top:${px(y - 236 * KT - g.bx.t)};width:${px(180 * KT)}"></div>`;

// Draws ground + paddock + three finished sides + the buildable side's posts + goat + one transparent
// hit region per part, and pins bbox from the FINISHED fence (every rail present, goat at every rest
// spot) so the camera never moves as planks land. Only the scale follows the viewport. Returns geometry.
export function mountScene(el, plan) {
  // Share starts with no parts (plan.groups 0): the plot is still one tile deep and the two end posts stand
  // together at its corner, a closed gate that opens a part at a time as she adds them.
  const N = plan.groups, R = Math.max(N, 1), g = { rows: R, cols: DEEP, per: plan.per, originX: 400, originY: 400, goat: { part: Math.floor(R / 2), inside: false } };
  g.goat.dest = { ...g.goat };
  const vis = [], box = (l, t, w, h) => vis.push({ l, t, r: l + w, b: t + h });
  // bbox first: everything below positions itself relative to it
  for (let r = 0; r < R; r++) for (let c = 0; c < DEEP; c++) { const { x, y } = iso(r, c, g.originX, g.originY); box(x - TW / 2, y, TW, TH); }
  for (let p = 0; p < R; p++) {
    const f = feet(p, g);
    for (const b of [postBox(f.lx, f.ly, g.per), postBox(f.rx, f.ry, g.per)]) box(b.l, b.t, b.w, b.h);
    for (let i = 0; i < g.per; i++) { const b = railBox(p, i, g); box(b.l, b.t, b.w, b.h); }
    const q = goatBox(p, false, g); box(q.l, q.t, q.w, q.h);
  }
  { const { x, y } = iso(0, 0, g.originX, g.originY); box(x - TW / 2, y - (449 - 277) * K + TH / 2, TW, TH); }   // back corner's finished posts
  g.bx = { l: Math.min(...vis.map(v => v.l)), t: Math.min(...vis.map(v => v.t)), r: Math.max(...vis.map(v => v.r)), b: Math.max(...vis.map(v => v.b)) };
  const cw = g.cw = g.bx.r - g.bx.l, ch = g.ch = g.bx.b - g.bx.t;

  // Ground: one div repeating a pre-composited 264x132 patch of eight flat grass diamonds (Kenney
  // landscape tile 075, scripts/make_parts.py), seated by background-position so a diamond's top vertex
  // lands on iso(0,0) and every lattice cell is a real tile edge. The top edge is the horizon; a
  // translucent haze softens the cut.
  g.hy = g.bx.t - 10;
  const GL = g.originX - TW * 12, GW = TW * 24, mod = (v, m) => ((v % m) + m) % m;
  let html = `<div class="ground" style="left:${px(GL - g.bx.l)};top:${px(g.hy - g.bx.t)};width:${GW}px;height:${px(g.bx.b + 1400 - g.hy)};background-position:${px(mod(g.originX - GL, 2 * TW))} ${px(mod(g.originY - g.hy, 2 * TH))}"></div>` +
    `<div class="haze" style="left:${px(GL - g.bx.l)};top:${px(g.hy - 30 - g.bx.t)};width:${GW}px;height:100px"></div>`;
  // The way in: a one-tile dirt path (landscape tile 083) along the column outside the buildable side,
  // from the tile the goat waits on down-left off the front of the stage.
  for (let r = R - 1 - g.goat.part; r <= R + 5; r++) { const { x, y } = iso(r, DEEP, g.originX, g.originY); html += tile(SPRITE.dirt, x, y, 2, g); }
  // Paddock: dirt with corn, tall at the back, young in front so the buildable side stays legible.
  for (let r = 0; r < R; r++) for (let c = 0; c < DEEP; c++) {
    const { x, y } = iso(r, c, g.originX, g.originY), corn = c === DEEP - 1 ? "cornYoungDouble" : c === 0 || r % 2 ? "cornDouble" : "cornYoungDouble";
    html += farm("dirtFarmland", x, y + TH, 10 + r + c, g) + farm(corn, x, y + TH, 30 + r + c, g);
  }
  // Three finished sides. Back-left rises to the right (sprite as-is); back-right and front-left fall
  // to the right (mirrored). The front-left side stands in front of the corn and the goat.
  // Three finished sides are solid plank walls from the same pack as the barn, so the eye never compares
  // their rails with the side she builds (D-094). In its canvas a W wall stands on the tile's bottom-left
  // edge and an N wall on its top-right edge, so each side is seated on the tile whose edge that is:
  // back-left = bottom-left edges of the diagonal tiles (r-1, -1); back-right = top-right edges of row 0;
  // front-left = top-right edges of the row just outside the paddock.
  for (let r = 0; r < R; r++) { const { x, y } = iso(r - 1, -1, g.originX, g.originY); html += seat("woodWall_W", x, y + TH, 22 + r, KT, g, 0, WALL_CLIP); }
  for (let c = 0; c < DEEP; c++) { const { x, y } = iso(0, c, g.originX, g.originY); html += seat("woodWall_N", x, y + TH, 22 + c, KT, g, 0, WALL_CLIP); }
  for (let c = 0; c < DEEP; c++) { const { x, y } = iso(R, c, g.originX, g.originY); html += seat("woodWall_N", x, y + TH, 60, KT, g, 0, WALL_CLIP); }
  // The buildable side: posts with shadows, one hit region per part.
  for (let p = 0; p <= Math.max(N, 1); p++) {
    const f = p < N ? feet(p, g) : N ? (() => { const q = feet(N - 1, g); return { lx: q.rx, ly: q.ry }; })() : (() => { const q = feet(0, g); return { lx: q.lx + 24 * p, ly: q.ly - 12 * p }; })();
    html += shadow(f.lx, f.ly - 1, 30, 11, 20, g) + `<img class="post" src="${SPRITE.post}" alt="" style="z-index:${200 + p};${at(postBox(f.lx, f.ly, g.per), g)}">`;
    if (p < N) {
      const H2 = postH(g.per) * K + 4;
      html += `<div class="hit" data-part="${p}" style="left:${px(f.lx - 6 - g.bx.l)};top:${px(f.ly - TH / 2 - H2 - g.bx.t)};width:78px;height:${px(H2 + TH / 2)};` +
        `clip-path:polygon(6px ${px(TH / 2)},72px 0,72px ${px(H2)},6px ${px(H2 + TH / 2)})"></div>`;
    }
  }
  const gf = goatFeet(g.goat.part, false, g);
  html += `<div class="goat" style="left:${px(gf.x - GOAT_W / 2 - g.bx.l)};top:${px(gf.y - GOAT_H - g.bx.t)};width:${px(GOAT_W)};height:${px(GOAT_H)}"><span class="shd"></span><img src="${SPRITE.goat}" alt=""></div>`;
  // Context. The barn stands behind the back-left fence, its long face parallel to it: two tiles along
  // the row direction, a wall on each front-right edge (window at the back, door at the front), a gable
  // wall on the front tile's front-left edge, one roof per tile (roofSingle's ridge runs along the row, so
  // two in a line make one continuous gable; the front one is the closed-gable roofSingleWall). Roof sits
  // 170 source px up: the measured wall top at the near post (D-070). At BARN of a world tile so the
  // paddock keeps 70 % of the height on desktop.
  { const k = BARN * KT, x1 = g.originX - 28, y1 = g.originY - 15, x2 = x1 - TW / 2 * BARN, y2 = y1 + TH / 2 * BARN;
    g.oh = g.bx.t - (y1 - 368 * k);                                  // roof apex (y = 144 in the canvas after dy) above the bbox
    html += shadow((x1 + x2) / 2, (y1 + y2) / 2 - TH / 4 * BARN, 210 * BARN, 90 * BARN, 4, g) +
      seat("woodWallWindow_W", x1, y1, 6, k, g) + seat("roofSingle_N", x1, y1, 7, k, g, -170) +
      seat("woodWallDoorClosed_W", x2, y2, 8, k, g) + seat("woodWall_N", x2, y2, 9, k, g) + seat("roofSingleWall_N", x2, y2, 10, k, g, -170); }
  { const { x, y } = iso(-2, 0, g.originX, g.originY); html += shadow(x, y + TH - 4, 105, 28, 4, g) + farm("hayBalesStacked", x, y + TH, 6, g, 125); }
  { const { x, y } = iso(R - 0.5, 0.5, g.originX, g.originY); html += shadow(x, y + TH - 2, 60, 18, 20, g) + farm("sacksCrate", x, y + TH, 70, g, 120); }
  // Trees at the edges: two behind-right, two front-left, every other one mirrored; none in the paddock,
  // on the path or under the tray.
  for (const [r, c, z, m] of [[-2, 2, 5, 0], [-1, 4, 5, 1], [3, -2, 64, 0], [4, 0, 66, 1]]) { const { x, y } = iso(r, c, g.originX, g.originY); html += tree(x, y + TH / 2, z, g, m); }

  el.innerHTML = `<div class="isoworld"><div class="isofit" style="width:${px(cw)};height:${px(ch)}">${html}</div></div>`;
  el.geom = g;
  // Camera: bbox is pinned for the life of the level; the scale and the vertical seat follow the
  // viewport. The paddock takes up to 96% of the width or 70% of the height, centred in the band
  // under the sign (top 15%), pushed down only as far as keeps the barn roof on screen.
  const fit = () => { const f = el.querySelector(".isofit"); if (!f) return;
    const W = el.clientWidth, H = el.clientHeight, T = 0.15 * H;
    g.scale = Math.min(0.96 * W / cw, 0.70 * H / ch);
    g.top = Math.max(T + (H - T - ch * g.scale) / 2, g.oh * g.scale + 8);
    f.style.top = px(g.top); f.style.transform = `translate(-50%,0) scale(${g.scale.toFixed(3)})`;
    // A tree is whole or absent, never cut by the frame edge: hide any whose span leaves the visible world.
    const half = W / g.scale / 2, cx = g.bx.l + cw / 2;
    for (const t of f.querySelectorAll(".tree")) t.style.visibility = parseFloat(t.dataset.l) >= cx - half && parseFloat(t.dataset.r) <= cx + half ? "" : "hidden";
    el.dispatchEvent(new Event("fit")); };                       // the world moved: whoever placed something on it re-places it
  fit();
  new ResizeObserver(fit).observe(el);
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

// World px -> px inside `el` (the .isofit is centred horizontally, seated at g.top, scaled about its top).
function toScene(el, wx, wy) {
  const g = el.geom;
  return { x: el.clientWidth / 2 + (wx - g.bx.l - g.cw / 2) * g.scale, y: g.top + (wy - g.bx.t) * g.scale };
}
const sceneBox = (el, b) => { const p = toScene(el, b.l, b.t), s = el.geom.scale; return { l: p.x, t: p.y, r: p.x + b.w * s, b: p.y + b.h * s }; };
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
// Where the hint card goes so it never covers what it talks about: no post, no rail (the tilted
// over-count rail included), not the goat where it is heading, nor a keep-out rect (the sign). Tried in
// order: beside the part on the outside (camera-right: level with its top, then below the fence line),
// beside it on the left, under it, above it, and last the band under the sign, which always fits. Returns
// scene px and the tail: which edge it is on and how far along.
export function bubbleSpot(el, part, w, h, keep = []) {
  const g = el.geom, f = feet(part, g), W = el.clientWidth, H = el.clientHeight, aim = partTop(el, part);
  const R = toScene(el, f.rx, f.ry), L = toScene(el, f.lx, f.ly), o = el.getBoundingClientRect();
  const wood = [...el.querySelectorAll(".post,.rail")].map(n => { const r = n.getBoundingClientRect();
    return { l: r.left - o.left, t: r.top - o.top, r: r.right - o.left, b: r.bottom - o.top }; });
  const cues = [...wood, sceneBox(el, goatBox(g.goat.dest.part, g.goat.dest.inside, g)), ...keep];
  const hits = (l, t) => l < 8 || t < 8 || l + w > W - 8 || t + h > H - 8 || cues.some(c => l < c.r + 6 && l + w > c.l - 6 && t < c.b + 6 && t + h > c.t - 6);
  const tries = [[R.x + 14, aim.y, "left"], [R.x + 14, R.y - 10, "left"], [L.x - 14 - w, aim.y, "right"], [L.x - 14 - w, L.y - 10, "right"],
    [aim.x - w / 2, L.y + 14, "top"], [aim.x - w / 2, aim.y - h - 16, "bottom"]];
  // The band under the sign is tested like the rest, walked down in steps; if nothing clears, it stays at the top of the band.
  const band = Math.max(8, ...keep.map(k => k.b + 8));
  for (let t = band; t + h <= H - 8; t += 16) tries.push([(W - w) / 2, t, "bottom"]);
  const [l, t, side] = tries.find(([l, t]) => !hits(l, t)) || [(W - w) / 2, band, "bottom"];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  return { left: l, top: t, side, at: side === "left" || side === "right" ? clamp(aim.y - t, 16, h - 16) : clamp(aim.x - l, 16, w - 16) };
}

// The goat walks, one leg at a time: along the outside to the part, then through it. CSS does the
// moving (a transition on transform); this only sets waypoints. Reduced motion: it steps.
export function goatWalk(el, part, inside) {
  const g = el.geom, s = g.goat, img = el.querySelector(".goat"), base = goatFeet(Math.floor(g.rows / 2), false, g);
  s.dest = { part, inside };
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

// z bands: ground 0 · haze 1 · path 2 · shadows 4 · trees behind 5 · barn/hay 6+ · dirt 10+ · shadows 20 · back fences 22+ ·
// corn 30+ · goat inside 45 · hit 50 · front-left fence 60 · trees in front 64+ · sack 70 · rails 100+part · posts 200+part · goat outside 300.
export const FENCE_CSS = `
.isoworld{position:absolute;inset:0;overflow:visible;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer}
.isofit{position:absolute;left:50%;top:0;transform-origin:top center}
.isoworld img,.isoworld .ground,.isoworld .haze,.isoworld .shd{position:absolute}
.isoworld .tree{position:absolute;left:0;top:0}
.isoworld *{pointer-events:none}                       /* scenery never eats a tap; only rails and hit regions are targets */
.isoworld .hit,.isoworld .rail{pointer-events:auto}
.isoworld .hit{position:absolute;z-index:50}
/* while Pip waits for a tap on a part, the parts glow so the child knows where to tap */
body.probe .isoworld .hit{background:rgba(255,211,77,.28);animation:probeglow 1.2s ease-in-out infinite}
@keyframes probeglow{50%{background:rgba(255,211,77,.55)}}
@media (prefers-reduced-motion:reduce){body.probe .isoworld .hit{animation:none}}
.isoworld .ground{z-index:0;background:#8ab549 url(${SPRITE.grass}) repeat;background-size:264px 132px}
.isoworld .haze{position:absolute;z-index:1;background:linear-gradient(180deg,rgba(223,240,216,0) 0,rgba(223,240,216,.92) 30%,rgba(223,240,216,0) 100%)}
.isoworld .shd{border-radius:50%;background:radial-gradient(ellipse at center,rgba(25,45,15,.42) 0,rgba(25,45,15,.18) 45%,rgba(25,45,15,0) 72%)}
.isoworld .bld.mir{transform:scaleX(-1)}
.isoworld .rail{animation:plop .45s cubic-bezier(.2,1.5,.4,1) both;transform-origin:left bottom;filter:drop-shadow(1px 3px 2px rgba(0,0,0,.25))}
.isoworld .rail.over{--o:0;transform:rotate(calc(-12deg - var(--o) * 2deg)) translate(calc(4px + var(--o) * 3px),-6px);filter:drop-shadow(3px 5px 3px rgba(0,0,0,.35))}
.isoworld .goat{position:absolute;z-index:300;transition:transform 1.4s ease-in-out,z-index 0s .7s}
.isoworld .goat img{left:0;top:0;width:100%}
.isoworld .goat .shd{left:-14%;right:-14%;bottom:-6px;height:14px}
.isoworld .goat.in{z-index:45}
@keyframes plop{0%{opacity:0;translate:0 -22px;scale:.86}100%{opacity:1}}
@media (prefers-reduced-motion:reduce){.isoworld .rail{animation:none}.isoworld .goat{transition:none}}
`;
