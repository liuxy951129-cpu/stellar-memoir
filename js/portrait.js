/* ============ 立绘 SVG 渲染（赛璐璐厚涂风）============ */
window.Portrait = {
  /**
   * @param role  qianye | yunli | yin
   * @param exp   calm | smile | sad | shy
   */
  build(role, exp = "calm"){
    const r = (window.ROUTES || []).find(x => x.id === role) || {};
    const p = r.palette || { hair:"#5b6df0", hairLight:"#a9b3ff", skin:"#f3dfd0", skinShadow:"#d4b39d",
                             eye:"#3ad6ff", outfit:"#1a2350", outfitTrim:"#7d4dff" };

    const uid = "p" + Math.random().toString(36).slice(2,8);
    const hG = `hg_${uid}`, sG = `sg_${uid}`, oG = `og_${uid}`, rG = `rg_${uid}`;

    // 头发风格 — 包覆头部
    const hairBackPath = {
      qianye: "M105,200 C75,290 70,420 110,560 C90,580 95,640 130,650 L270,650 C305,640 310,580 290,560 C330,420 325,290 295,200 C275,140 200,120 105,200 Z",
      yunli:  "M95,210 C65,330 80,490 130,600 C100,620 100,680 140,690 L260,690 C300,680 300,620 270,600 C320,490 335,330 305,210 C275,120 200,100 95,210 Z",
      yin:    "M110,200 C85,280 95,400 130,540 C100,560 105,620 135,635 L265,635 C295,620 300,560 270,540 C305,400 315,280 290,200 C270,140 200,130 110,200 Z"
    }[role];

    const hairFrontPath = {
      qianye: "M140,210 C160,180 240,170 270,200 C285,225 280,275 260,280 C235,255 195,255 175,290 C150,275 130,235 140,210 Z",
      yunli:  "M125,205 C150,170 250,165 280,195 C300,225 290,290 265,295 C240,265 200,260 175,300 C150,285 110,235 125,205 Z",
      yin:    "M150,205 C170,180 240,175 270,200 C285,225 280,285 260,290 C235,265 200,265 175,295 C155,280 135,235 150,205 Z"
    }[role];

    // 单眼 SVG（包括眼白+虹膜+高光），表情控制形态
    const eyeSVG = (exp === "smile") ?
      `<g><path d="M-12,2 C-7,10 7,10 12,2" stroke="rgba(40,20,60,.9)" stroke-width="3" fill="none" stroke-linecap="round"/></g>` :
    (exp === "shy") ?
      `<g><path d="M-12,0 C-7,7 7,7 12,0" stroke="${p.eye}" stroke-width="3" fill="none" stroke-linecap="round"/></g>` :
    (exp === "sad") ?
      `<g>
        <path d="M-15,-12 L0,-8 L15,-12" stroke="rgba(60,30,80,.7)" stroke-width="2" fill="none"/>
        <ellipse cx="0" cy="2" rx="11" ry="14" fill="white"/>
        <ellipse cx="0" cy="3" rx="9" ry="11" fill="${p.eye}"/>
        <circle cx="-1" cy="3" r="5" fill="rgba(0,0,0,.85)"/>
        <circle cx="2" cy="-1" r="2.5" fill="white"/>
      </g>` :
      // calm 默认
      `<g>
        <ellipse cx="0" cy="0" rx="12" ry="16" fill="white"/>
        <ellipse cx="0" cy="2" rx="9" ry="13" fill="${p.eye}"/>
        <circle cx="-1" cy="2" r="5.5" fill="rgba(0,0,0,.9)"/>
        <circle cx="1" cy="-2" r="2.8" fill="white"/>
        <ellipse cx="0" cy="9" rx="3" ry="2" fill="rgba(255,255,255,.65)"/>
      </g>`;

    const mouth =
      exp === "smile" ? `<path d="M-9,0 Q0,9 9,0" stroke="rgba(120,40,80,.95)" stroke-width="2.5" fill="rgba(255,160,170,.55)" stroke-linecap="round"/>` :
      exp === "sad"   ? `<path d="M-7,3 Q0,-3 7,3" stroke="rgba(120,40,80,.85)" stroke-width="2" fill="none" stroke-linecap="round"/>` :
      exp === "shy"   ? `<ellipse cx="0" cy="2" rx="4" ry="3" fill="rgba(180,80,110,.7)"/>` :
                        `<path d="M-6,0 Q0,4 6,0" stroke="rgba(120,40,80,.85)" stroke-width="2" fill="none" stroke-linecap="round"/>`;

    const blush = (exp === "shy" || exp === "smile")
      ? `<ellipse cx="-32" cy="14" rx="14" ry="6" fill="rgba(255,140,170,.45)"/>
         <ellipse cx="32" cy="14" rx="14" ry="6" fill="rgba(255,140,170,.45)"/>`
      : ``;

    // 服装（更宽肩膀更自然身体）
    const outfit = {
      qianye: `
        <path d="M85,560 C85,540 145,510 200,510 C255,510 315,540 315,560 L320,720 C320,760 80,760 80,720 Z" fill="url(#${oG})" stroke="rgba(255,255,255,.18)" stroke-width="1"/>
        <path d="M170,510 L170,720 L230,720 L230,510 Z" fill="rgba(255,255,255,.13)"/>
        <path d="M85,560 C150,580 250,580 315,560 L315,580 C250,605 150,605 85,580 Z" fill="${p.outfitTrim}" opacity=".9"/>
        <circle cx="200" cy="600" r="6" fill="${p.outfitTrim}"/>
        <circle cx="200" cy="640" r="5" fill="${p.outfitTrim}" opacity=".75"/>
        <circle cx="200" cy="675" r="4" fill="${p.outfitTrim}" opacity=".55"/>`,
      yunli: `
        <path d="M85,560 C85,545 150,520 200,520 C250,520 315,545 315,560 L335,720 C340,760 60,760 65,720 Z" fill="url(#${oG})"/>
        <path d="M85,560 L160,540 L150,720 L80,720 Z" fill="rgba(255,255,255,.2)"/>
        <path d="M315,560 L240,540 L250,720 L320,720 Z" fill="rgba(255,255,255,.2)"/>
        <path d="M155,540 Q200,510 245,540 L245,560 Q200,535 155,560 Z" fill="${p.outfitTrim}"/>
        <circle cx="200" cy="545" r="6" fill="#fff" opacity=".85"/>
        <path d="M170,600 L230,600 L226,650 L174,650 Z" fill="rgba(255,255,255,.1)"/>`,
      yin: `
        <path d="M85,560 C85,540 145,510 200,510 C255,510 315,540 315,560 L315,720 C315,760 85,760 85,720 Z" fill="url(#${oG})"/>
        <path d="M165,510 L165,720 L235,720 L235,510 L210,535 L200,510 L190,535 Z" fill="rgba(0,0,0,.55)"/>
        <path d="M88,580 L165,540 L165,575 Z" fill="${p.outfitTrim}"/>
        <path d="M312,580 L235,540 L235,575 Z" fill="${p.outfitTrim}"/>
        <rect x="195" y="555" width="10" height="140" fill="${p.outfitTrim}" opacity=".7"/>`
    }[role];

    // 装饰
    const accessory = {
      qianye: `<g transform="translate(200,355)">
                 <ellipse cx="-30" cy="0" rx="22" ry="16" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
                 <ellipse cx="30" cy="0"  rx="22" ry="16" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
                 <line x1="-8" y1="0" x2="8" y2="0" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
               </g>`,
      yunli: `<g>
                <circle cx="155" cy="225" r="5" fill="#ffd66b"/>
                <circle cx="245" cy="225" r="5" fill="#ffd66b"/>
                <path d="M180,148 Q200,128 220,148" stroke="${p.outfitTrim}" stroke-width="3" fill="none"/>
                <circle cx="200" cy="135" r="4" fill="#ffd66b"/>
              </g>`,
      yin:   `<g transform="translate(173,355)">
                <circle cx="0" cy="0" r="5" fill="#ffd66b"/>
                <line x1="-8" y1="0" x2="-26" y2="0" stroke="#3ad6ff" stroke-width="1.5" opacity=".75"/>
                <line x1="0" y1="-8" x2="0" y2="-22" stroke="#3ad6ff" stroke-width="1.5" opacity=".75"/>
                <line x1="-6" y1="-6" x2="-18" y2="-18" stroke="#3ad6ff" stroke-width="1" opacity=".5"/>
              </g>`
    }[role];

    return `
<svg viewBox="0 0 400 760" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${hG}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.hairLight}"/>
      <stop offset="55%" stop-color="${p.hair}"/>
      <stop offset="100%" stop-color="${shade(p.hair, -28)}"/>
    </linearGradient>
    <linearGradient id="${sG}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${shade(p.skin, 8)}"/>
      <stop offset="100%" stop-color="${p.skinShadow}"/>
    </linearGradient>
    <linearGradient id="${oG}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${shade(p.outfit, 22)}"/>
      <stop offset="55%" stop-color="${p.outfit}"/>
      <stop offset="100%" stop-color="${shade(p.outfit, -22)}"/>
    </linearGradient>
    <radialGradient id="${rG}" cx="0.7" cy="0.2" r="0.9">
      <stop offset="0%" stop-color="rgba(255,255,255,.55)"/>
      <stop offset="60%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>

  <g class="body-wrap">
    <!-- 背发 -->
    <path d="${hairBackPath}" fill="url(#${hG})" stroke="rgba(0,0,0,.3)" stroke-width="1.2"/>

    <!-- 颈部 -->
    <path d="M180,420 L180,500 C180,520 220,520 220,500 L220,420 Z" fill="url(#${sG})"/>
    <path d="M180,500 C180,510 220,510 220,500 L222,525 C222,545 178,545 178,525 Z" fill="${shade(p.skin,-18)}" opacity=".55"/>

    <!-- 上半身 -->
    ${outfit}

    <!-- 脸 -->
    <ellipse cx="200" cy="320" rx="92" ry="115" fill="url(#${sG})" stroke="rgba(80,40,40,.32)" stroke-width="1"/>
    <!-- 脸侧阴影 -->
    <path d="M200,210 C160,215 130,260 128,330 C130,400 165,440 200,440 Z" fill="rgba(180,120,100,.2)"/>
    <!-- 高光 -->
    <ellipse cx="200" cy="280" rx="80" ry="100" fill="url(#${rG})"/>

    <!-- 前发 -->
    <path d="${hairFrontPath}" fill="url(#${hG})" stroke="rgba(0,0,0,.32)" stroke-width="1.4"/>
    <path d="M150,200 C155,180 200,170 240,180 C220,200 200,210 175,220 Z" fill="rgba(0,0,0,.22)"/>

    <!-- 五官 -->
    ${blush}
    <g transform="translate(170,330)">${eyeSVG}</g>
    <g transform="translate(230,330)">${eyeSVG}</g>
    <path d="M150,295 Q170,287 188,295" stroke="${shade(p.hair,-30)}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M212,295 Q230,287 250,295" stroke="${shade(p.hair,-30)}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M198,355 Q200,372 196,380" stroke="rgba(120,80,80,.5)" stroke-width="1.5" fill="none"/>
    <g transform="translate(200,400)">${mouth}</g>

    ${accessory}

    <!-- 边光 -->
    <ellipse cx="160" cy="320" rx="6" ry="80" fill="rgba(255,255,255,.18)"/>
    <ellipse cx="240" cy="330" rx="4" ry="60" fill="rgba(255,255,255,.1)"/>
  </g>
</svg>`;
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

/* 颜色加深/加亮 */
function shade(hex, amt){
  let c = (hex || "#7d4dff").replace("#","");
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
