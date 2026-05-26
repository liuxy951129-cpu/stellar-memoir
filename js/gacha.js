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
    for (let i=0;i<times;i++){
      const pity = (i === times - 1 && times === 10) ? 9 : i;
      const item = this.rollOnce(pity);
      got.push(item);
      save.gachaHistory.push(item.id);
      if (item.rk === "SSR" || item.rk === "SR"){
        // 解锁第 4 张隐藏 CG
        if (item.role === "qianye") save.unlockedCG.qianye_cg4 = true;
        if (item.role === "yunli")  save.unlockedCG.yunli_cg4 = true;
        if (item.role === "yin")    save.unlockedCG.yin_cg4 = true;
      }
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
      const c = document.createElement("div");
      c.className = "gacha-card " + it.rk.toLowerCase();
      c.style.animationDelay = (i * 0.08) + "s";
      c.style.background = `linear-gradient(135deg, ${shadeForGacha(it.color, 12)}, ${shadeForGacha(it.color, -25)})`;
      c.innerHTML = `
        <div class="rk">${it.rk}</div>
        <div class="nm">${it.name}</div>
      `;
      box.appendChild(c);
    });
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
