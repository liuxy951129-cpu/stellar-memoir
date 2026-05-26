/* 立绘渲染（基于 AI 生成 PNG） */
window.Portrait = {
  PATH: "assets/portraits/",

  build(role, exp){
    // 用真实图片，exp 通过 CSS 滤镜简单调整氛围
    const fname = `${role}.png`;
    const filter = {
      smile: "saturate(1.1) brightness(1.05)",
      sad:   "saturate(.85) brightness(.9) hue-rotate(-5deg)",
      shy:   "saturate(1.15) brightness(1.05)",
      calm:  ""
    }[exp || "calm"] || "";
    return `<img src="${this.PATH}${fname}" alt="${role}" style="filter:${filter};width:100%;height:100%;object-fit:contain;object-position:bottom center;" />`;
  },

  setStage(stageEl, role, exp, side){
    stageEl.innerHTML = "";
    if (!role) return;
    const wrap = document.createElement("div");
    wrap.className = "portrait";
    if (side) wrap.classList.add(side);
    wrap.dataset.role = role;
    wrap.innerHTML = this.build(role, exp || "calm");
    stageEl.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add("in"));
  },

  setExp(stageEl, role, exp){
    const wrap = stageEl.querySelector(`.portrait[data-role="${role}"]`);
    if (!wrap) { this.setStage(stageEl, role, exp); return; }
    wrap.innerHTML = this.build(role, exp || "calm");
  },

  shake(stageEl){
    const w = stageEl.querySelector(".portrait");
    if (!w) return;
    w.classList.remove("shake");
    void w.offsetWidth;
    w.classList.add("shake");
  }
};
