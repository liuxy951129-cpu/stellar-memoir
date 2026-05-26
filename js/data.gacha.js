/* 抽卡库（皮肤/CG/语音碎片） */
window.GACHA_POOL = [
  // SSR
  { id:"ssr_q_lab",   rk:"SSR", role:"qianye", name:"千夜·实验白衣", desc:"白色实验袍 · 静谧夜光", w:1, color:"#a99dff" },
  { id:"ssr_y_neon",  rk:"SSR", role:"yunli",  name:"云璃·霓虹芭蕾", desc:"霓虹荧光裙 · 全息蝴蝶", w:1, color:"#ff77c8" },
  { id:"ssr_yin_old", rk:"SSR", role:"yin",    name:"银·旧日制服",   desc:"未植入义体之前的他", w:1, color:"#ffd66b" },
  { id:"ssr_v_set",   rk:"SSR", role:"all",    name:"星舰记忆全套",   desc:"全员合影 · 限定", w:0.5, color:"#ffd9ee" },

  // SR
  { id:"sr_q_glasses", rk:"SR", role:"qianye", name:"千夜·眼镜", desc:"小道具 · 学者气质", w:5, color:"#7d4dff" },
  { id:"sr_y_kimono",  rk:"SR", role:"yunli",  name:"云璃·宇宙花魁", desc:"和风 × 太空感", w:5, color:"#ff77c8" },
  { id:"sr_yin_coat",  rk:"SR", role:"yin",    name:"银·长披风", desc:"沉默感 +50", w:5, color:"#3ad6ff" },
  { id:"sr_dialog",    rk:"SR", role:"all",    name:"语音碎片包·稀有", desc:"3 段隐藏语音", w:5, color:"#a99dff" },

  // R
  { id:"r_coin1",  rk:"R", role:"sys", name:"星币 ×100", desc:"系统消耗品", w:25, color:"#cfd6e8" },
  { id:"r_coin2",  rk:"R", role:"sys", name:"星币 ×50",  desc:"系统消耗品", w:25, color:"#cfd6e8" },
  { id:"r_charm",  rk:"R", role:"all", name:"小挂件", desc:"角色挂件饰品", w:15, color:"#cfd6e8" },
  { id:"r_postcard", rk:"R", role:"all", name:"星舰明信片", desc:"明信片合集", w:15, color:"#cfd6e8" }
];

window.GACHA_RATE = { SSR:0.06, SR:0.18, R:0.76 };
