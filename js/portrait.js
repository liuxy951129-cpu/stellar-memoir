/* 立绘渲染 v3 - 真正多表情 + 透明背景 */
window.Portrait = {
  PATH: "assets/portraits/",
  PLAYER: "assets/player/",

  // 表情 → 文件后缀
  expFile(role, exp){
    if (role === "player_silhouette") return this.PLAYER + "player_silhouette.png";
    if (role === "player") return this.PLAYER + "player_revealed.png";
    const map = { calm:"", smile:"_smile", sad:"_sad", shy:"_blush", blush:"_blush" };
    const suffix = map[exp] || "";
    return `${this.PATH}${role}${suffix}.png`;
  },

  build(role, exp){
    const src = this.expFile(role, exp || "calm");
    return `<img src="${src}" alt="${role}" data-exp="${exp||'calm'}" />`;
  },

  setStage(stageEl, role, exp, side){
    stageEl.innerHTML = "";
    if (!role) return;
    const wrap = document.createElement("div");
    wrap.className = "portrait";
    if (role === "player_silhouette" || role === "player") wrap.classList.add("player-portrait");
    if (side) wrap.classList.add(side);
    wrap.dataset.role = role;
    wrap.innerHTML = this.build(role, exp || "calm");
    stageEl.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add("in"));
  },

  setExp(stageEl, role, exp){
    const wrap = stageEl.querySelector(`.portrait[data-role="${role}"]`);
    if (!wrap) { this.setStage(stageEl, role, exp); return; }
    const img = wrap.querySelector("img");
    if (!img) return;
    const newSrc = this.expFile(role, exp || "calm");
    if (img.src.endsWith(newSrc.split("/").pop())) return;
    // 淡入淡出切换表情
    img.style.transition = "opacity .25s";
    img.style.opacity = .3;
    setTimeout(()=>{
      img.src = newSrc;
      img.style.opacity = 1;
    }, 200);
  },

  shake(stageEl){
    const w = stageEl.querySelector(".portrait");
    if (!w) return;
    w.classList.remove("shake"); void w.offsetWidth; w.classList.add("shake");
  }
};
