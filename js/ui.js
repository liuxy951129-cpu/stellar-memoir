/* UI 通用 */
window.UI = {
  switchScreen(id){
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("active");
  },

  toast(msg){
    let t = document.querySelector(".toast");
    if (!t){
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tm);
    t._tm = setTimeout(()=>t.classList.remove("show"), 1800);
  },

  modal({title, body, onOk, onCancel}){
    const m = document.getElementById("modal");
    document.getElementById("modalTitle").textContent = title || "";
    document.getElementById("modalBody").innerHTML = body || "";
    m.classList.add("active");
    m._onOk = onOk;
    m._onCancel = onCancel;
  },

  closeModal(){
    document.getElementById("modal").classList.remove("active");
  },

  showCG(role, cgId, scene){
    const v = document.getElementById("cgViewer");
    const inner = document.getElementById("cgInner");
    const r = (window.ROUTES || []).find(x=>x.id===role);
    const bg = Scene.cgSurface(scene || "deck");
    inner.style.background = bg;
    inner.innerHTML = `
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%, rgba(255,255,255,.12) 0%, transparent 70%);"></div>
      <div style="position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;">
        <div style="width:60%;height:90%;">${Portrait.build(role, "smile")}</div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:0;padding:20px;background:linear-gradient(0deg,rgba(0,0,0,.85),transparent);text-align:center;">
        <div style="font-size:11px;letter-spacing:.4em;color:#3ad6ff;margin-bottom:6px;">MEMORY · ${cgId.toUpperCase()}</div>
        <div style="font-size:22px;letter-spacing:.25em;color:#fff;font-weight:700;text-shadow:0 0 14px rgba(${(r||{}).color === '#7d4dff' ? '125,77,255' : '255,119,200'},.7);">${cgId}</div>
      </div>
    `;
    v.classList.add("active");
  },

  closeCG(){
    document.getElementById("cgViewer").classList.remove("active");
  },

  renderAffinityMini(aff){
    const el = document.getElementById("affinityMini");
    if (!el) return;
    const map = {qianye:"千夜", yunli:"云璃", yin:"银"};
    el.innerHTML = Object.keys(map).map(id=>{
      const v = Math.max(0, Math.min(100, (aff[id]||0)*8 + 30));
      return `<div class="aff-row"><span class="aff-name">${map[id]}</span><div class="aff-bar"><i style="width:${v}%"></i></div></div>`;
    }).join("");
  },

  renderRouteCards(elId, save){
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = "";
    (window.ROUTES || []).forEach(r => {
      const finished = save.finishedRoutes && save.finishedRoutes[r.id];
      const card = document.createElement("div");
      card.className = "route-card";
      card.dataset.route = r.id;
      // 卡片内置一张大立绘
      const portraitHTML = Portrait.build(r.id, "calm");
      card.innerHTML = `
        <div class="rc-bg" style="background:linear-gradient(180deg, ${r.color}33 0%, #0a0d28 100%);">
          <div style="position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;">
            <div style="width:90%;height:96%;transform:translateY(8%);">${portraitHTML}</div>
          </div>
        </div>
        <div class="rc-mask"></div>
        <div class="rc-badge">${r.badge}${finished ? " · 已通关" : ""}</div>
        <div class="rc-info">
          <div class="rc-name">${r.name}</div>
          <div class="rc-en">${r.en}</div>
          <div class="rc-tag">${r.title}<br>${r.tag}</div>
        </div>
      `;
      el.appendChild(card);
    });
  }
};
