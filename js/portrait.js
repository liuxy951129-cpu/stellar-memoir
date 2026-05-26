/* 立绘渲染 v3.1 - 过渡动画 + 隐藏机制 */
window.Portrait = {
  PATH: "assets/portraits/",
  PLAYER: "assets/player/",
  _lastExp: {},  // role -> exp，用于避免重复切换

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
    if (!role) return;
    const existed = stageEl.querySelector(`.portrait[data-role="${role}"]`);
    if (existed){
      // 同 role 已存在，仅切表情
      this.setExp(stageEl, role, exp);
      this.show(stageEl);
      return;
    }
    stageEl.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "portrait";
    if (role === "player_silhouette" || role === "player") wrap.classList.add("player-portrait");
    if (side) wrap.classList.add(side);
    wrap.dataset.role = role;
    wrap.innerHTML = this.build(role, exp || "calm");
    stageEl.appendChild(wrap);
    this._lastExp[role] = exp || "calm";
    requestAnimationFrame(() => wrap.classList.add("in"));
  },

  setExp(stageEl, role, exp){
    const wrap = stageEl.querySelector(`.portrait[data-role="${role}"]`);
    if (!wrap) { this.setStage(stageEl, role, exp); return; }
    const target = exp || "calm";
    // 相同表情则不切换
    if (this._lastExp[role] === target) return;
    this._lastExp[role] = target;

    const oldImg = wrap.querySelector("img");
    if (!oldImg) return;
    const newSrc = this.expFile(role, target);
    // 创建新 img 渐入，旧的渐出
    const newImg = oldImg.cloneNode();
    newImg.src = newSrc;
    newImg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:bottom center;opacity:0;transition:opacity .55s ease;";
    oldImg.style.cssText += ";transition:opacity .55s ease;";
    wrap.style.position = "absolute";
    wrap.appendChild(newImg);
    requestAnimationFrame(()=>{
      newImg.style.opacity = 1;
      oldImg.style.opacity = 0;
    });
    setTimeout(()=>{
      if (oldImg.parentNode === wrap) wrap.removeChild(oldImg);
      newImg.style.position = "";
      newImg.style.inset = "";
      newImg.style.transition = "";
    }, 600);
  },

  hide(stageEl){
    const wraps = stageEl.querySelectorAll(".portrait");
    wraps.forEach(w => {
      w.style.transition = "opacity .35s ease";
      w.style.opacity = "0";
    });
  },

  show(stageEl){
    const wraps = stageEl.querySelectorAll(".portrait");
    wraps.forEach(w => {
      w.style.transition = "opacity .55s ease";
      w.style.opacity = "1";
    });
  },

  clear(stageEl){
    stageEl.innerHTML = "";
    this._lastExp = {};
  },

  shake(stageEl){
    const w = stageEl.querySelector(".portrait");
    if (!w) return;
    w.classList.remove("shake"); void w.offsetWidth; w.classList.add("shake");
  }
};
