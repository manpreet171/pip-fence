// Pip: the pieces both games share — the mascot on the hint card, "Say it another way", the
// how-to-play sheet, the level strip with stars, and the star moment when a level is mastered.
// Plain DOM, no dependencies. Each game imports this and passes its own words and nodes.

const CSS = `
.pipface{display:inline-block;width:34px;height:40px;border-radius:50% 50% 48% 48%/60% 60% 40% 40%;background:radial-gradient(circle at 35% 30%,#c9915a,#7d5122 70%);
  position:relative;flex:none;box-shadow:inset -3px -3px 6px rgba(0,0,0,.25),0 2px 3px rgba(0,0,0,.3)}
.pipface::before,.pipface::after{content:"";position:absolute;top:14px;width:8px;height:9px;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 3px #22303a,inset -2px -2px 0 3px #22303a}
.pipface::before{left:8px}.pipface::after{right:8px}
.pipface i{position:absolute;left:12px;right:12px;bottom:9px;height:5px;border-radius:0 0 6px 6px;border-bottom:2px solid #22303a}
.piprow{display:flex;gap:10px;align-items:flex-start}
.pipagain{display:inline-block;margin-top:8px;padding:6px 12px;border-radius:10px;border:2px solid #a9702f;background:#f8f1e3;color:#7d5122;font:600 14px/1.2 inherit;cursor:pointer;pointer-events:auto;min-height:36px}
.pipagain[disabled]{opacity:.5}
#howto{position:fixed;inset:0;z-index:40;display:grid;place-items:center;background:rgba(30,20,10,.55);padding:16px}
#howto .card{max-width:520px;width:100%;background:#f8f1e3;border:3px solid #7d5122;border-radius:18px;padding:20px 22px;box-shadow:0 14px 30px rgba(0,0,0,.35);color:#22303a}
#howto h2{margin:0 0 4px;font-size:24px;color:#7d5122}
#howto .sub{margin:0 0 14px;color:#5d5246}
#howto ol{list-style:none;margin:0;padding:0;display:grid;gap:12px}
#howto li{display:flex;gap:14px;align-items:center;font-size:18px;line-height:1.3}
#howto .n{flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-size:22px;font-weight:700;color:#f8f1e3;
  background:linear-gradient(180deg,#b97b3a,#a9702f);border:3px solid #7d5122;box-shadow:0 3px 0 #7d5122}
#howto .go{margin-top:18px;min-height:56px;width:100%;border-radius:16px;border:3px solid #7d5122;background:linear-gradient(180deg,#b97b3a,#a9702f);color:#f8f1e3;
  font:600 20px/1 inherit;box-shadow:0 6px 0 #7d5122;cursor:pointer}
.strip{display:flex;gap:5px;align-items:center;margin-top:6px}
.strip i{display:block;width:14px;height:14px;border-radius:50%;background:rgba(0,0,0,.28);box-shadow:inset 0 1px 2px rgba(0,0,0,.4)}
.strip i.half{background:#d9c39a}.strip i.full{background:#ffd34d;box-shadow:0 0 6px #ffd34d}
.strip i.now{outline:3px solid #f8f1e3;outline-offset:1px}
.starmoment{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);z-index:30;pointer-events:none;text-align:center;
  font:700 30px/1.2 inherit;color:#7d5122;text-shadow:0 2px 0 #fff;animation:starpop 2.2s ease-out both}
.starmoment b{display:block;font-size:64px;color:#ffd34d;text-shadow:0 0 18px #ffb400,0 3px 0 #a9702f}
@keyframes starpop{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}80%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.starmoment{animation:none;opacity:1}}
`;
let cssDone = false;
const css = () => { if (!cssDone) { document.head.insertAdjacentHTML("beforeend", `<style>${CSS}</style>`); cssDone = true; } };

export const face = () => `<span class="pipface" aria-hidden="true"><i></i></span>`;

// How to play: three steps, shown once on a fresh install (key in localStorage) and on demand.
export function howto({ key, title, sub, steps, go = "Let's play" }) {
  css();
  const seen = () => { try { return localStorage.getItem(key) === "1"; } catch { return false; } };
  const show = () => {
    document.getElementById("howto")?.remove();
    document.body.insertAdjacentHTML("beforeend", `<div id="howto" role="dialog" aria-modal="true"><div class="card"><h2>${title}</h2><p class="sub">${sub}</p>
      <ol>${steps.map((s, i) => `<li><span class="n">${i + 1}</span><span>${s}</span></li>`).join("")}</ol><button class="go">${go}</button></div></div>`);
    document.querySelector("#howto .go").onclick = () => { document.getElementById("howto").remove(); try { localStorage.setItem(key, "1"); } catch {} };
  };
  if (!seen()) show();
  return show;
}

// The level strip: one dot per node, gold when mastered, silver when finished with hints, ringed when current.
export function strip(el, nodes, mastery, current) {
  css();
  el.innerHTML = `<span class="strip" aria-label="levels">${nodes.map(n => `<i class="${(mastery[n] || 0) >= 1 ? "full" : mastery[n] ? "half" : ""}${n === current ? " now" : ""}"></i>`).join("")}</span>`;
}

// The star moment: gold for a level mastered without help, silver with help.
export function star(full, text) {
  css();
  document.querySelector(".starmoment")?.remove();
  document.body.insertAdjacentHTML("beforeend", `<div class="starmoment"><b>${full ? "★" : "☆"}</b>${text}</div>`);
  setTimeout(() => document.querySelector(".starmoment")?.remove(), 2400);
}

// "Show me, Pip": after the second hint the child can ask for a worked example on her own fence.
// The caller fetches the script, checks it, and performs it; the button is disabled meanwhile.
export function showme(cardTextEl, handler) {
  css();
  const b = document.createElement("button"); b.className = "pipagain"; b.type = "button"; b.textContent = "Show me, Pip";
  b.onclick = async () => { b.disabled = true; b.textContent = "Pip is thinking…"; try { await handler(); } finally { b.disabled = false; b.textContent = "Show me, Pip"; } };
  cardTextEl.after(b);
  return b;
}

// "Say it another way": the child asks Pip for a fresh phrasing; the caller fetches the next tier
// through the same gate and judge and returns the text (or the template when the model is out).
export function again(cardTextEl, handler) {
  css();
  const b = document.createElement("button"); b.className = "pipagain"; b.type = "button"; b.textContent = "Say it another way";
  b.onclick = async () => { b.disabled = true; b.textContent = "Pip is thinking…"; try { await handler(); } finally { b.disabled = false; b.textContent = "Say it another way"; } };
  cardTextEl.after(b);
  return b;
}
