// judge.mjs — the reviewer's overlay (D-071). Loaded only on ?judge=1 or the J key; the child's page
// never imports it. Beside the game, live: the event log as the game writes it, the classifier's verdict,
// the exact redacted payload with a digit check, the last hint's source and round trip, the mastery map.
// It only ever paints its own panel: pointer events stop at its edge, the scene underneath is untouched.
import { GRAPH, IDS } from "/fence.mjs";

const CSS = `
#judge{position:fixed;right:0;top:0;bottom:0;width:420px;z-index:1000;overflow:auto;padding:10px 12px 16px;
  background:#22303a;color:#efe3cd;font:12px/1.45 ui-monospace,Consolas,"Cascadia Mono",monospace;box-shadow:-4px 0 14px rgba(0,0,0,.35)}
body.judge #stage{right:420px}
#judge .ev{padding-left:7ch;text-indent:-7ch;white-space:pre-wrap;word-break:break-word}
#judge h3{margin:12px 0 3px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#d9b77a;font-weight:600}
#judge pre{margin:0;white-space:pre-wrap;word-break:break-word}
#judge .jh{display:flex;align-items:center;gap:10px}
#judge .jh b{font-size:14px;letter-spacing:.06em}
#judge .jh span{flex:1;opacity:.6}
#judge button,#jtab{font:inherit;cursor:pointer;background:#efe3cd;color:#22303a;border:0;border-radius:6px;padding:0 12px;min-height:32px}
#judge .ok{color:#9fdc9f}#judge .bad{color:#ff8a80;font-weight:700}
#judge .dim{opacity:.6}
#jtab{position:fixed;right:12px;bottom:calc(var(--hud) + 12px);z-index:1000;min-height:44px;box-shadow:0 4px 10px rgba(0,0,0,.35)}
@media (max-width:640px){
  #judge{top:auto;left:0;width:auto;height:52vh;border-radius:14px 14px 0 0;box-shadow:0 -4px 14px rgba(0,0,0,.35)}
  body.judge #stage{right:0}
}`;

const esc = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const j = v => esc(JSON.stringify(v));

export function mount(snap) {
  document.head.insertAdjacentHTML("beforeend", `<style>${CSS}</style>`);
  document.body.insertAdjacentHTML("beforeend",
    `<aside id="judge" hidden><div class="jh"><b>JUDGE</b><span>J closes</span><button id="jmin">Hide</button></div><div id="jbody"></div></aside>` +
    `<button id="jtab" hidden>Judge</button>`);
  const panel = document.getElementById("judge"), tab = document.getElementById("jtab");
  const show = (open) => { panel.hidden = !open; document.body.classList.toggle("judge", open); dispatchEvent(new Event("resize")); if (open) update(); };
  document.getElementById("jmin").onclick = () => { show(false); tab.hidden = false; };
  tab.onclick = () => { tab.hidden = true; show(true); };

  function update() {
    if (panel.hidden) return;
    const s = snap(), r = s.result, h = s.hint, p = h?.payload || s.payload;   // the payload the last hint was built from; before any hint, the live one
    const { age, tier, reading_level, ...rest } = p;                 // the only fields allowed a digit (BUDDY-CONTRACT)
    const clean = !/\d/.test(JSON.stringify(rest));
    const ev = s.events.slice(-10).map(e => { const { t, e: name, ...x } = e; return `<div class="ev">${String(t).padStart(6)} ${esc(name)} ${Object.keys(x).length ? j(x) : ""}</div>`; }).join("");
    document.getElementById("jbody").innerHTML =
      `<h3>level</h3><pre>${esc(s.node)}  ·  ${s.events.length} events</pre>` +
      `<h3>events (last ten)</h3>${ev || "<pre class=dim>none yet</pre>"}` +
      `<h3>classifier · now · classify(level)</h3><pre>id         ${esc(r.id)}\ntier       ${r.tier}\nconfirmed  ${r.confirmed}\ncounts     ${j(r.counts)}\nflags      ${j(r.flags)}</pre>` +
      `<h3>last hint</h3><pre>${h ? `for        ${esc(h.id)} tier ${h.tier}\nsource     ${esc(h.source)}${h.reason ? `  (${esc(h.reason)})` : ""}\nround trip ${h.ms} ms\nmodel      ${esc(h.model || (h.source === "model" ? "server key" : "template, no call"))}` : "<span class=dim>none yet</span>"}</pre>` +
      `<h3>payload · ${h?.payload ? "what the model got for the last hint" : "what the next hint would get"} <span class="${clean ? "ok" : "bad"}">[${clean ? "no digits" : "DIGITS FOUND"}]</span></h3>` +
      `<pre>${h?.payload || IDS.includes(r.id) ? "" : "<span class=dim>(not sent: no misconception to phrase)</span>\n"}${esc(JSON.stringify(p, null, 1))}</pre>` +
      `<h3>mastery · ${GRAPH.length} nodes</h3><pre>${GRAPH.map(g => `${g.node.padEnd(14)} ${s.mastery[g.node] ?? 0}`).join("\n")}</pre>`;
  }
  return { update, toggle() { tab.hidden = true; show(panel.hidden); } };   // one press from any state: closed, open, or hidden behind the tab
}
