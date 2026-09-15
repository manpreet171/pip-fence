// board.mjs — the board, the call, the sow. Everything the child sees; nothing here decides truth.
// The engine (sow.mjs Part 1) owns the rules and the classifier; buddy.mjs owns the hint; this file
// draws, animates, logs the events the contract lists, and persists. DOM only, browser only.
import { GRAPH, shape, newGame, legalMoves, landing, applyMove, isOver, finish, classify, next, policy, IDS } from "/sow.mjs";
import { TEMPLATES, hint, payload } from "/buddy.mjs";

const $ = id => document.getElementById(id), px = n => n.toFixed(1) + "px";
const Q = new URLSearchParams(location.search), DEBUG = Q.has("debug");
const KEY = "kuzhi.v1", SOUND = "kuzhi.sound", P_BEST = 0.6;
const HINTED = IDS.filter(id => id !== "correct" && id !== "guessing");   // the eight that get a card; guessing is silence
const nx = p => (p + 1) % 14;
const still = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
const SEED_MS = () => still() ? 0 : 250, CODE_MS = () => still() ? 0 : 120;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ v: 1, mastery: S.mastery, events: S.events.slice(-500),
  game: S.state && { node: S.node, state: S.state, at: S.at, over: S.over, ended: S.ended, last: S.last } })); } catch {} };

// One plain object. S.state is the engine's truth; D is what is drawn, and it lags S.state only while seeds are in the air.
const S = { node: null, state: null, mastery: {}, events: [], at: 0, phase: "idle", from: null, hand: 0, last: null, result: null,
  hint: null, pre: null, probe: false, over: false, ended: false, tok: 0, pips: 0 };
let D = { pits: Array(14).fill(0), stores: [0, 0] };
const scene = $("scene"), board = $("board"), stage = $("stage");
let J = null;                                            // the judge's overlay, mounted only when asked for
const sh = () => shape(S.node);
const lvl = () => S.events.slice(Math.max(0, S.events.findLastIndex(e => e.e === "level_start")));
const cls = () => { try { return classify(lvl()); } catch { return { id: "none", tier: 0, confirmed: false, flags: [] }; } };
function log(e) { S.events.push({ t: Date.now() - S.at, ...e }); save(); J?.update(); }
const timed = r => { const t0 = performance.now(); return hint(r).then(h => ({ ...h, ms: Math.round(performance.now() - t0) })); };

// --- geometry: pit centres in board px, from the scene size. Landscape: her row is the near row, left to
// right, her store at the right end; portrait: the board turns so her row is the right-hand column running
// up, her store at the top, code's at the bottom. Sowing is anticlockwise either way.
const G = { c: 80, pit: [], store: [], w: 0, h: 0, portrait: false }, MIN = 47;   // 47 in board px keeps every tilted pit >= 44 on screen
// Spacing sets, tried in order until the pits reach MIN px: portrait's second set tightens the gaps and stores.
const KS = { land: [{ GAP: .15, ST: 1.2, SG: .28, PAD: .42, RG: .3 }], port: [{ GAP: .1, ST: 1, SG: .2, PAD: .3, RG: .3 }, { GAP: .06, ST: .7, SG: .1, PAD: .12, RG: .3 }] };
function layout() {
  const W = scene.clientWidth, hud = $("hud").offsetHeight, top = $("sign").getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 6;
  const portrait = W < 640, H0 = document.documentElement.clientHeight - hud;   // what the viewport can hold beside the HUD
  let K, along, across, c = 0;
  for (K of KS[portrait ? "port" : "land"]) {
    along = 2 * K.PAD + 2 * K.ST + 2 * K.SG + 7 + 6 * K.GAP; across = 2 * K.PAD + 2 + K.RG;
    c = Math.min(96, portrait ? Math.min((H0 - top) * .97 / along, W * .96 / across) : Math.min(W * .96 / along, (H0 - top) * .86 / across));
    if (c >= MIN) break;
  }
  c = Math.max(c, MIN);                                    // never under MIN: the page scrolls instead of crushing the board
  Object.assign(G, { c, portrait, w: (portrait ? across : along) * c, h: (portrait ? along : across) * c });
  const need = top + G.h + hud; stage.style.height = need > H0 + hud ? px(need) : ""; const H = scene.clientHeight;
  const first = K.PAD + K.ST + K.SG, step = 1 + K.GAP, near = K.PAD + 1 + K.RG + .5, far = K.PAD + .5;
  for (let i = 0; i < 7; i++) {
    G.pit[i] = portrait ? { x: near * c, y: G.h - (first + i * step + .5) * c } : { x: (first + i * step + .5) * c, y: near * c };
    G.pit[7 + i] = portrait ? { x: far * c, y: (first + i * step + .5) * c } : { x: (first + (6 - i) * step + .5) * c, y: far * c };
  }
  const st = (a, b) => portrait ? { x: K.PAD * c, y: a * c, w: (across - 2 * K.PAD) * c, h: (b - a) * c } : { x: a * c, y: K.PAD * c, w: (b - a) * c, h: (across - 2 * K.PAD) * c };
  G.store[0] = portrait ? st(K.PAD, K.PAD + K.ST) : st(along - K.PAD - K.ST, along - K.PAD);
  G.store[1] = portrait ? st(along - K.PAD - K.ST, along - K.PAD) : st(K.PAD, K.PAD + K.ST);
  stage.style.setProperty("--c", px(c)); board.style.cssText = `--c:${px(c)};width:${px(G.w)};height:${px(G.h)};left:${px((W - G.w) / 2)};top:${px(top + (H - top - G.h) / 2)}`;
  for (let p = 0; p < 14; p++) { const el = board.querySelector(`.pit[data-pit="${p}"]`); el.style.left = px(G.pit[p].x - c / 2); el.style.top = px(G.pit[p].y - c / 2); }
  G.store.forEach((s, i) => { const el = board.querySelector(`.store[data-store="${i}"]`); el.style.cssText = `left:${px(s.x)};top:${px(s.y)};width:${px(s.w)};height:${px(s.h)}`; });
  const tag = $("ctag"); if (tag) tag.style.cssText = portrait ? `left:-76px;top:${px(G.pit[7].y - 14)}` : `left:${px(G.pit[13].x - c / 2)};top:-38px`;
  render(); placeMarker(); placeBubble();
}
// Where seed k sits in pit p (board px, relative to the pit centre): a sunflower spiral, capped at the rim.
const seedAt = (p, k) => { const r = Math.min(.115 * G.c * Math.sqrt(k), .3 * G.c), a = k * 2.39996 + p * .7; return { x: r * Math.cos(a), y: r * Math.sin(a), rot: (k * 137 + p * 31) % 180 }; };
const storeAt = (s, k) => { const st = G.store[s], q = Math.min(1, Math.sqrt(k / 40)), a = k * 2.39996; return { x: st.x + st.w / 2 + st.w * .36 * q * Math.cos(a), y: st.y + st.h / 2 + st.h * .36 * q * Math.sin(a), rot: (k * 137) % 180 }; };
const seedHTML = (o) => `<span class="seed" style="transform:translate(${px(o.x)},${px(o.y)}) rotate(${o.rot}deg)"></span>`;

function mount() {
  board.innerHTML = [0, 1].map(i => `<div class="store" data-store="${i}"></div>`).join("") +
    Array.from({ length: 14 }, (_, p) => `<div class="pit" data-pit="${p}"><div class="hole"></div></div>`).join("") +
    `<div id="marker" hidden></div><div id="ctag" hidden>code</div>`;
  layout();
}
function renderPit(p) { board.querySelector(`.pit[data-pit="${p}"] .hole`).innerHTML = Array.from({ length: D.pits[p] }, (_, k) => seedHTML(seedAt(p, k))).join(""); }
function renderStore(s) { const st = G.store[s]; board.querySelector(`.store[data-store="${s}"]`).innerHTML =
  Array.from({ length: D.stores[s] }, (_, k) => { const o = storeAt(s, k); return seedHTML({ x: o.x - st.x - st.w / 2, y: o.y - st.y - st.h / 2, rot: o.rot }); }).join(""); }
// The hand: seeds she holds, as a heap in the tray's dark bed. Never a digit.
function renderHand() {
  const bed = $("bed"), W = bed.clientWidth, per = Math.max(1, Math.floor((W - 24) / 17)), n = S.hand;
  bed.innerHTML = Array.from({ length: n }, (_, k) => { const row = Math.floor(k / per), col = k % per, x0 = (W - Math.min(n - row * per, per) * 17) / 2;
    return `<span class="seed" style="transform:translate(${px(x0 + col * 17 + row * 6)},${px(bed.clientHeight / 2 - 5 - row * 9 + (k % 2) * 3)}) rotate(${(k * 53) % 180}deg)"></span>`; }).join("");
}
function render() {
  for (let p = 0; p < 14; p++) renderPit(p);
  renderStore(0); renderStore(1); renderHand();
  const pick = S.phase === "pick" && !S.over;
  board.querySelectorAll(".pit").forEach(el => { const p = +el.dataset.pit; el.classList.toggle("can", pick && p < 7 && D.pits[p] > 0); });
  $("handl").textContent = S.over ? "The seeds are in." : S.phase === "pick" ? "Your turn. Tap one of your pits." : S.phase === "call" ? "Where will the last seed land? Tap that pit."
    : S.phase === "code" ? "The other side sows." : "Sowing.";
  $("nextb").hidden = !(S.over && !S.ended); $("restart").hidden = !S.ended; $("hand").hidden = S.ended;
}

// --- one seed in the air: from her hand (the tray) to a pit, from a pit to a pit, or a burst to a store ----
// The fly layer sits on the stage, not the board, so a seed can leave the tray; every point is stage px read
// from the live rects, which already carry the board's tilt.
const O = () => stage.getBoundingClientRect();
const pitEl = p => board.querySelector(`.pit[data-pit="${p}"]`);
const rectPt = (el, dx = 0, dy = 0) => { const r = el.getBoundingClientRect(), o = O(); return { x: r.left + r.width / 2 - o.left + dx, y: r.top + r.height / 2 - o.top + dy }; };
const pitPt = (p, k) => { const o = seedAt(p, k); return rectPt(pitEl(p), o.x, o.y); };
const storePt = (s, k) => { const st = G.store[s], o = storeAt(s, k); return rectPt(board.querySelector(`.store[data-store="${s}"]`), o.x - st.x - st.w / 2, o.y - st.y - st.h / 2); };
const handPt = () => rectPt($("bed"), 0, -6);
function flyEl(from, to, ms, rot) {
  const el = document.createElement("div"); el.className = "fly"; el.style.setProperty("--dur", ms + "ms");
  el.style.transform = `translate(${px(from.x)},${px(from.y)})`;
  el.innerHTML = `<span class="seed" style="transform:translate(-50%,-50%) rotate(${rot}deg)"></span>`;
  $("fly").appendChild(el); void el.offsetWidth;
  el.style.transform = `translate(${px(to.x)},${px(to.y)})`;
  return el;
}
async function fly(from, b, ms) {                    // one seed from a stage point to its slot in pit b
  if (!ms) return;
  const el = flyEl(from, pitPt(b, D.pits[b]), ms, (D.pits[b] * 137 + b * 31) % 180);
  await sleep(ms); el.remove();
}
async function toStore(p, s, n, ms) {                // n seeds from pit p to store s, in a quick burst
  const els = [];
  for (let k = 0; k < n && ms; k++) { const o = storeAt(s, D.stores[s] + k); els.push(flyEl(pitPt(p, Math.max(0, D.pits[p] - 1 - k)), storePt(s, D.stores[s] + k), ms, o.rot)); await sleep(35); }
  await sleep(ms); els.forEach(e => e.remove());
  D.pits[p] = Math.max(0, D.pits[p] - n); D.stores[s] += n; renderPit(p); renderStore(s);
}
// Sow the seeds in hand along `path`, one every `ms`: hers leave the tray one at a time; code's leave its
// lifted pit. A pit that reaches four on a four level flashes and is taken at once.
async function hop(from, path, ms, side) {
  for (const p of path) {
    let src;
    if (side === 0) { src = handPt(); S.hand--; renderHand(); } else src = pitPt(from, 0);
    await fly(src, p, ms);
    D.pits[p]++; renderPit(p);
    if (sh().four && D.pits[p] === 4) {
      const owner = p < 7 ? 0 : 1; pitEl(p).classList.add("flash"); await sleep(ms ? 450 : 0); pitEl(p).classList.remove("flash");
      await toStore(p, owner, 4, ms ? 300 : 0); log({ e: "four", pit: p, owner });
    }
  }
}
function lift(p, on) { pitEl(p).classList.toggle("up", on); }
// After every move the engine's state is the picture; anything the animation got differently snaps to it.
function snap(state) { D = { pits: [...state.pits], stores: [...state.stores] }; render(); }

// --- her move: pick, call, sow, verdict ------------------------------------------------------------------
const taskLine = () => { const s = sh(); $("task").textContent = `${s.seeds} seeds in every pit` + (s.relay ? ", with a relay" : ""); };
// The diagnostic board after an ambiguous call (CONCEPT §5): the fencepost and the corner collide only when a
// landing is one past a corner, so every pit gets a seed more or fewer at random until no move of hers lands there.
function diagnostic(node) {
  const g = newGame(node), bad = s => legalMoves(s, 0).some(p => [0, 7].includes(landing(s, p).landed));
  let s = g;
  for (let i = 0; i < 50 && bad(s); i++) s = { ...g, pits: g.pits.map(n => Math.max(1, n + Math.floor(Math.random() * 3) - 1)) };
  return s;   // ponytail: after 50 tries the last candidate ships; one corner landing is not worth a solver
}
function start(node, diag = false) {
  Object.assign(S, { node, state: diag ? diagnostic(node) : newGame(node), at: Date.now(), phase: "pick", from: null, hand: 0, last: null, result: null, hint: null, pre: null, probe: false, over: false, ended: false });
  S.events = S.events.slice(-500);
  log({ e: "level_start", node, at: S.at });
  taskLine(); hideBubble(); $("marker").hidden = true; snap(S.state); save();
}
board.addEventListener("click", e => { const el = e.target.closest(".pit"); if (el) onPit(+el.dataset.pit); });
function onPit(p) {
  if (S.over || S.phase === "busy" || S.phase === "code") return;
  // The probe: her tap on the source pit or the next one settles the collision. One tap answers it either way,
  // so she is never stuck; a tap on a pit she could sow from is her next pick, not an answer.
  if (S.probe && !(S.phase === "pick" && p < 7 && D.pits[p] > 0)) {
    S.probe = false; log({ e: "tap_count", pit: p }); if (S.last && p === S.last.from) pips();
    const r = cls(); if (r.id !== "ambiguous" && HINTED.includes(r.id)) showHint(r);
    return;
  }
  if (S.phase === "call") {
    if (p === S.from) { lift(p, false); D.pits[p] = S.hand; S.hand = 0; S.from = null; S.phase = "pick"; render(); return; }   // put the seeds back
    log({ e: "call", pit: p }); dropMarker(p); S.phase = "busy"; render();
    prefetch(S.from, p); setTimeout(() => sowMove(S.from, p), still() ? 0 : 400);
    return;
  }
  if (p < 7 && D.pits[p] > 0) {                            // pick: the marker of the last move fades now
    hideBubble(); $("marker").classList.add("gone");
    S.from = p; S.hand = D.pits[p]; D.pits[p] = 0; S.phase = "call"; lift(p, true); render();
    log({ e: "pick", pit: p, seeds: S.hand }); return;
  }
  log({ e: "tap_count", pit: p });                         // empty hand on any other pit
  if (S.last && p === S.last.from) pips();
}
function dropMarker(p) {
  const m = $("marker"); m.hidden = false; m.className = "drop"; S.markAt = p; placeMarker();
}
function placeMarker() { const m = $("marker"); if (m.hidden || S.markAt == null) return; m.style.left = px(G.pit[S.markAt].x + .27 * G.c); m.style.top = px(G.pit[S.markAt].y - .3 * G.c); }
// The hint is fetched while the seeds are still in the air, so a wrong call shows its card the moment the last seed lands.
function prefetch(from, called) {
  const res = applyMove(S.state, from, called), n = S.state.pits[from], t = Date.now() - S.at;
  const ev = [...lvl(), { t, e: "sow", from, landed: res.path[n - 1], path: res.path.slice(0, n) }];
  if (res.path.length > n) ev.push({ t, e: "relay", from: res.hops[0], landed: res.landed, path: res.path.slice(n) });
  let p; try { p = classify(ev); } catch { return; }
  if (HINTED.includes(p.id) && p.id !== "ambiguous" && S.pre?.key !== p.id + p.tier) S.pre = { key: p.id + p.tier, h: timed(p) };
}
async function sowMove(from, called) {
  const res = applyMove(S.state, from, called), n = S.state.pits[from], ms = SEED_MS();
  const path1 = res.path.slice(0, n), path2 = res.path.slice(n);
  await hop(from, path1, ms, 0);
  log({ e: "sow", from, landed: path1.at(-1), path: path1 });
  lift(from, false);
  if (path2.length) {                                   // relay: a pause, then the landing pit is picked up and sown on
    const h = res.hops[0]; await sleep(ms ? 500 : 0); lift(h, true); S.hand = D.pits[h]; D.pits[h] = 0; renderPit(h); renderHand();
    await sleep(ms ? 300 : 0); await hop(h, path2, ms, 0); lift(h, false);
    log({ e: "relay", from: h, landed: res.landed, path: path2 });
  }
  const m = $("marker"); if (res.landed === called) m.classList.add("hit");
  if (res.capture) {
    if (res.capture.earned) await toStore(res.capture.pit, 0, res.capture.seeds, ms ? 300 : 0);
    log({ e: "capture", pit: res.capture.pit, seeds: res.capture.seeds, earned: res.capture.earned });
  }
  S.state = { ...res.state, side: 1 }; S.last = { from, called, landed: res.landed, path: res.path, hops: res.hops }; S.hand = 0; snap(S.state);
  const r = S.result = cls(); mastery(); save(); J?.update();
  if (HINTED.includes(r.id)) showHint(r);
  if (isOver(S.state)) return gameOver();
  await sleep(ms ? 900 : 0); codeMove();
}
// The other side: code, one knob. Fast, labelled, never a call.
async function codeMove() {
  S.phase = "code"; render(); const tag = $("ctag"); tag.hidden = false;
  const ms = CODE_MS(), from = policy(S.state, P_BEST, Math.random);
  if (from == null) return gameOver();
  const res = applyMove(S.state, from, null), n = S.state.pits[from];
  await sleep(ms ? 450 : 0); lift(from, true); D.pits[from] = 0; renderPit(from); await sleep(ms ? 200 : 0);
  await hop(from, res.path.slice(0, n), ms, 1); lift(from, false);
  if (res.path.length > n) { const h = res.hops[0]; await sleep(ms ? 350 : 0); lift(h, true); D.pits[h] = 0; renderPit(h); await hop(h, res.path.slice(n), ms, 1); lift(h, false); }
  if (res.capture?.earned) await toStore(res.capture.pit, 1, res.capture.seeds, ms ? 250 : 0);
  log({ e: "turn", side: "code", from, landed: res.landed });
  S.state = { ...res.state, side: 0 }; snap(S.state); tag.hidden = true;
  S.phase = "pick"; render(); save();
  if (isOver(S.state)) gameOver();
}
async function gameOver() {
  S.phase = "busy"; $("ctag").hidden = true; const f = finish(S.state), ms = SEED_MS();
  for (let p = 0; p < 14; p++) if (D.pits[p]) await toStore(p, p < 7 ? 0 : 1, D.pits[p], ms ? 220 : 0);
  S.state = f; S.over = true; snap(f); mastery(); log({ e: "level_end", stores: f.stores }); save();
  const a = f.stores[0], b = f.stores[1];   // compared in words, never a digit
  $("marker").classList.add("gone");
  bubble("The seeds are in. " + (a > b ? "Your store holds more." : a < b ? "Your store holds fewer." : "Both stores hold the same."), "");
  render();
}
// CONCEPT §5: a node is mastered when seven of her last eight calls on it were right; 1 with no hint in that window, else 0.5.
function mastery() {
  const calls = [], hints = []; let node = null;
  S.events.forEach((e, i) => {
    if (e.e === "level_start") node = e.node; if (node !== S.node) return;
    if (e.e === "call") calls.push({ i, pit: e.pit, landed: null });
    else if ((e.e === "sow" || e.e === "relay") && calls.length) calls.at(-1).landed = e.landed;
    else if (e.e === "hint") hints.push(i);
  });
  const w = calls.filter(c => c.landed != null).slice(-8);
  if (w.length < 8 || w.filter(c => c.pit === c.landed).length < 7) return;
  const m = hints.some(i => i >= w[0].i) ? 0.5 : 1;
  S.mastery[S.node] = Math.max(S.mastery[S.node] || 0, m);
}
function advance() {
  const amb = lvl().some(e => e.e === "hint" && e.id === "ambiguous");
  let n = next(S.mastery, amb ? { id: "ambiguous", node: S.node } : S.result);
  if (n && !shape(n)) n = GRAPH.find(g => (S.mastery[g.node] || 0) < 1)?.node ?? null;
  n ? start(n, amb) : end();
}
function end() {
  S.over = S.ended = true; S.phase = "busy"; save(); hideBubble(); $("marker").hidden = true;
  $("task").textContent = "Every board is played."; render();
}
$("nextb").onclick = () => { if (S.over && !S.ended) advance(); };
$("restart").onclick = () => { S.mastery = {}; save(); start(GRAPH[0].node); };

// --- tap-to-count: pips walk the path of her last move, one per seed, ending where the last seed landed ---
function pips() {
  const path = S.last.path, quick = still(), step = 400;
  S.pips = Date.now() + (quick ? 1200 : path.length * step + 2100);
  path.forEach((p, i) => { const q = rectPt(pitEl(p)), el = document.createElement("span"); el.className = "pip";
    el.style.cssText = `left:${px(q.x)};top:${px(q.y)};animation-delay:${quick ? 0 : i * step / 1000}s`;
    stage.appendChild(el); setTimeout(() => el.remove(), quick ? 1200 : i * step + 2100); });
}

// --- the hint: code picked the id, the model may phrase it, the card sits beside the marker ------------------
async function showHint(r) {
  log({ e: "hint", id: r.id, tier: r.tier });
  if (r.id === "ambiguous") { S.probe = true; S.hint = { id: r.id, tier: 1, source: "template", reason: "probe", ms: 0, payload: payload(r) }; J?.update(); return bubble(TEMPLATES.ambiguous[1], "template"); }
  const tok = ++S.tok, key = r.id + r.tier;
  const h = await (S.pre?.key === key ? S.pre.h : timed(r)); S.pre = null;
  S.hint = { id: r.id, tier: r.tier, payload: payload(r), ...h }; J?.update();
  if (tok === S.tok) bubble(h.text, h.source);
}
function bubble(text, source) {
  $("btext").textContent = text; $("bsrc").textContent = DEBUG ? source : "";
  $("bubble").hidden = false; placeBubble(); speak(text);
}
function hideBubble() { $("bubble").hidden = true; S.tok++; }
// Beside the marker, never on it and never on the pit the last seed landed in, off the sign, inside the scene.
// Her row: below first (the space in front of her), the other row: above; then either side; last the band under the sign.
function placeBubble() {
  const b = $("bubble"); if (b.hidden) return;
  const W = scene.clientWidth, H = scene.clientHeight, o = stage.getBoundingClientRect(), w = Math.min(280, W - 16);
  b.style.cssText = `width:${px(w)}`; const h = b.offsetHeight;
  const rect = el => { const r = el.getBoundingClientRect(); return { l: r.left - o.left, t: r.top - o.top, r: r.right - o.left, b: r.bottom - o.top }; };
  const at = S.over ? null : S.markAt, keep = [rect($("sign"))];   // the closing line has no marker: it sits in the band under the sign
  const m = at != null ? rect(pitEl(at)) : { l: W / 2, r: W / 2, t: keep[0].b, b: keep[0].b }; if (at != null && S.last) keep.push(rect(pitEl(S.last.landed)));
  const cx = (m.l + m.r) / 2, cy = (m.t + m.b) / 2;
  const hits = (l, t) => l < 8 || t < 8 || l + w > W - 8 || t + h > H - 8 || [m, ...keep].some(c => l < c.r + 6 && l + w > c.l - 6 && t < c.b + 6 && t + h > c.t - 6);
  const below = [cx - w / 2, m.b + 14, "top"], above = [cx - w / 2, m.t - h - 16, "bottom"], right = [m.r + 14, cy - h / 2, "left"], left = [m.l - 14 - w, cy - h / 2, "right"];
  const tries = at == null ? [] : at < 7 && !G.portrait ? [below, right, left, above] : [above, right, left, below];
  for (let t = keep[0].b + 8; t + h <= H - 8; t += 16) tries.push([(W - w) / 2, t, "bottom"]);
  const [l, t, side] = tries.find(([l, t]) => !hits(l, t)) || [(W - w) / 2, keep[0].b + 8, "bottom"];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  b.dataset.side = side;
  b.style.cssText = `width:${px(w)};left:${px(l)};top:${px(t)};--tx:${px(clamp(cx - l, 16, w - 16))};--ty:${px(clamp(cy - t, 16, h - 16))}`;
}
// Spoken hints: the browser's own voice, nothing leaves the device. Says the card's text once, never over the pips.
const tts = globalThis.speechSynthesis;
let sound = true; try { sound = localStorage.getItem(SOUND) !== "0"; } catch {}
$("sound").hidden = !tts;
const soundLabel = () => { $("sound").textContent = sound ? "Sound on" : "Sound off"; };
soundLabel();
$("sound").onclick = () => { sound = !sound; try { localStorage.setItem(SOUND, sound ? "1" : "0"); } catch {} soundLabel(); save(); if (!sound) tts.cancel(); };
function speak(text) {
  if (!tts || !sound) return;
  const wait = (S.pips || 0) - Date.now();
  if (wait > 0) return setTimeout(() => { if (!$("bubble").hidden && $("btext").textContent === text) speak(text); }, wait);
  tts.cancel();
  const u = new SpeechSynthesisUtterance(text); u.rate = 0.92; u.pitch = 1; u.lang = "en";
  const v = tts.getVoices().find(v => /^en/i.test(v.lang)); if (v) u.voice = v;
  tts.speak(u);
}
new ResizeObserver(() => requestAnimationFrame(layout)).observe(scene);
new ResizeObserver(() => document.documentElement.style.setProperty("--hud", px($("hud").offsetHeight))).observe($("hud"));

// --- boot: the board mid-game exactly as she left it, else the first level ---------------------------------
mount();
const saved = load();                                     // right keys, wrong types: treat as no save
S.mastery = Object(saved.mastery) === saved.mastery && !Array.isArray(saved.mastery) ? saved.mastery : {};
S.events = Array.isArray(saved.events) && saved.events.every(e => Object(e) === e) ? saved.events : [];
const g = saved.game;
if (Q.get("node") && shape(Q.get("node"))) start(Q.get("node"));
else if (g?.ended) { Object.assign(S, { node: g.node, state: g.state, at: g.at }); $("task").textContent = "Every board is played."; end(); }
else if (Array.isArray(g?.state?.pits) && shape(g.node) && lvl().at(0)?.node === g.node) {
  Object.assign(S, { node: g.node, state: g.state, at: g.at, over: !!g.over, last: g.last || null, phase: g.state.side === 1 ? "code" : "pick" });
  taskLine(); snap(S.state);
  // The marker and card of a move she has not answered yet come back with it; a pick since then has cleared them.
  const L = lvl(), h = L.findLast(e => e.e === "hint" || e.e === "pick");
  if (!S.over && S.last && h?.e === "hint") {
    S.markAt = S.last.called; const m = $("marker"); m.hidden = false; m.className = S.last.called === S.last.landed ? "hit" : ""; placeMarker();
    S.probe = h.id === "ambiguous"; S.result = cls(); bubble(TEMPLATES[h.id]?.[S.probe ? 1 : h.tier] || "", "template");
  } else if (!S.over && S.last) { S.markAt = S.last.called; const m = $("marker"); m.hidden = false; m.className = "gone"; placeMarker(); }
  // A pit lifted, or a call made, with no sow yet: the seeds go back in her hand and, if she had called, the sow runs.
  const pk = L.findLast(e => e.e === "pick"), tail = pk ? L.slice(L.lastIndexOf(pk)) : [], cl = tail.find(e => e.e === "call");
  const pending = !S.over && S.state.side === 0 && pk && !tail.some(e => e.e === "sow") && D.pits[pk.pit] > 0;
  if (pending) { S.from = pk.pit; S.hand = D.pits[pk.pit]; D.pits[pk.pit] = 0; lift(pk.pit, true); S.phase = "call"; }
  if (S.over) { S.phase = "busy"; render(); } else if (S.state.side === 1) codeMove(); else render();
  if (pending && cl) { dropMarker(cl.pit); S.phase = "busy"; render(); prefetch(S.from, cl.pit); setTimeout(() => sowMove(S.from, cl.pit), still() ? 0 : 400); }
} else {
  const n = Object.values(S.mastery).some(v => v >= 1) ? next(S.mastery) : GRAPH[0].node;
  n ? start(n) : end();
}

// --- the judge's overlay: opt-in by ?judge=1 or the J key, loaded only then. The only place digits appear off the sign.
const snapJ = () => { const L = lvl(), r = cls(); return { node: S.node, events: L, result: r, payload: IDS.includes(r.id) ? payload(r) : {}, hint: S.hint, mastery: S.mastery, state: S.state, p_best: P_BEST }; };
async function judge() { J ??= (await import("/public/judge.mjs")).mount(snapJ); J.toggle(); }
addEventListener("keydown", e => { if (e.key === "j" || e.key === "J") judge(); });
if (Q.has("judge")) judge();
