/* 抽卡逻辑 */
window.Gacha = {
  rollOnce(pity){
    const rate = Object.assign({}, window.GACHA_RATE);
    if (pity >= 9) rate.SSR = 1;  // 十连保底SSR
    const r = Math.random();
    let bucket;
    if (r < rate.SSR) bucket = "SSR";
    else if (r < rate.SSR + rate.SR) bucket = "SR";
    else bucket = "R";
    const pool = window.GACHA_POOL.filter(x=>x.rk===bucket);
    const total = pool.reduce((a,b)=>a+b.w,0);
    let pick = Math.random()*total;
    for (const item of pool){ pick -= item.w; if (pick<=0) return item; }
    return pool[0];
  },

  doPull(times, save){
    const cost = times === 10 ? 900 : 100;
    if (save.coin < cost){
      UI.toast("星币不足，去剧情中获取~");
      return null;
    }
    save.coin -= cost;
    const got = [];
    // v7.2: 初始化三个仓库
    save.episodes = save.episodes || {};
    save.letters  = save.letters  || {};
    save.wardrobe = save.wardrobe || {};
    for (let i=0;i<times;i++){
      const pity = (i === times - 1 && times === 10) ? 9 : i;
      const item = this.rollOnce(pity);
      got.push(item);
      save.gachaHistory.push(item.id);
      // 按分类存入对应仓库
      if (item.cat === "episode") save.episodes[item.id] = { name:item.name, desc:item.desc, body:item.body, role:item.role, rk:item.rk };
      else if (item.cat === "letter") save.letters[item.id] = { name:item.name, desc:item.desc, body:item.body, role:item.role, rk:item.rk };
      else if (item.cat === "outfit") save.wardrobe[item.id] = { name:item.name, desc:item.desc, body:item.body, role:item.role, rk:item.rk };
      // R 卡道具立即生效
      if (item.id === "r_coin1") save.coin += 100;
      if (item.id === "r_coin2") save.coin += 50;
    }
    Save.store(save);
    return got;
  },

  render(save){
    document.getElementById("coinNum").textContent = save.coin;
    document.getElementById("diamondNum").textContent = save.diamond;
  },

  renderResult(items){
    const box = document.getElementById("gachaResult");
    box.innerHTML = "";
    items.forEach((it, i)=>{
      const meta = (window.GACHA_CAT_META || {})[it.cat] || { icon:"♦", label:"" };
      const c = document.createElement("div");
      c.className = "gacha-card " + it.rk.toLowerCase();
      c.style.animationDelay = (i * 0.08) + "s";
      c.style.background = `linear-gradient(135deg, ${shadeForGacha(it.color, 12)}, ${shadeForGacha(it.color, -25)})`;
      c.dataset.itemId = it.id;
      c.innerHTML = `
        <div class="rk">${it.rk}</div>
        <div class="cat-tag">${meta.icon} ${meta.label}</div>
        <div class="nm">${it.name}</div>
      `;
      // 点击查看详情
      if (it.cat === "episode" || it.cat === "letter" || it.cat === "outfit"){
        c.style.cursor = "pointer";
        c.addEventListener("click", () => Gacha.showItem(it));
      }
      box.appendChild(c);
    });
  },

  /* v7.2: 抽到详情查看 */
  showItem(item){
    const meta = (window.GACHA_CAT_META || {})[item.cat] || {};
    const old = document.getElementById("gachaItem");
    if (old) old.remove();
    const modal = document.createElement("div");
    modal.id = "gachaItem";
    modal.className = "gacha-item-modal";
    modal.innerHTML = `
      <div class="gi-card rk-${item.rk.toLowerCase()}">
        <div class="gi-head">
          <span class="gi-rk">${item.rk}</span>
          <span class="gi-cat">${meta.icon||""} ${meta.label||""}</span>
        </div>
        <div class="gi-name">${item.name}</div>
        <div class="gi-desc">${item.desc||""}</div>
        <div class="gi-body">${(item.body||"").replace(/\n/g,"<br>")}</div>
        <button class="gi-close">关 闭</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
    modal.querySelector(".gi-close").addEventListener("click", () => modal.remove());
  },

  /* 列出某分类下已抽到的内容（archive 面板） */
  listByCategory(save, cat){
    const map = cat === "episode" ? save.episodes : cat === "letter" ? save.letters : save.wardrobe;
    if (!map) return [];
    return Object.entries(map).map(([id, x]) => Object.assign({ id, cat }, x));
  }
};

function shadeForGacha(hex, amt){
  let c = (hex||"#7d4dff").replace("#","");
  if (c.length === 3) c = c.split("").map(x=>x+x).join("");
  const num = parseInt(c, 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0xff) + amt;
  let b = (num & 0xff) + amt;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + ((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
}
