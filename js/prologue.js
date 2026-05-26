/* =============================================================
 * 序章 · 修复师入职引导
 * 强化「玩家 = 修复师 / NPC = 被修复对象」设定
 * 第一次开始游戏时强制播放，之后可以在设置里"重看序章"
 * ============================================================= */
window.Prologue = (function(){

  const STEPS = [
    { type:"prologue_bg", img:"assets/scenes/prologue_lab.png" },
    { type:"prologue_narr", text:"——星历 2197 年。" },
    { type:"prologue_narr", text:"人类殖民已经抵达仙女座边缘。" },
    { type:"prologue_narr", text:"在那之前，有一项被称为「冷封」的技术：当一个人无法在当前时代继续活下去——意外、绝症、或——心碎到极致——他们可以选择把自己存进胶囊，让某个未来的修复师把记忆补完。" },
    { type:"prologue_narr", text:"星舰「忘川号」就是这样一艘载满胶囊的船。" },
    { type:"prologue_narr", text:"它不停地在星海里漂——直到下一个「修复师」上岗。" },
    { type:"prologue_narr", text:"" },
    { type:"prologue_title", text:"修 复 师 训 练 台", sub:"Repairer Onboarding · 第 0 / 3 章" },
    { type:"prologue_narr", text:"你坐在训练舱里。" },
    { type:"prologue_narr", text:"——这是你的「第一天」。" },
    { type:"prologue_narr", text:"系统在你眼前展开一份合同。" },
    { type:"prologue_doc", title:"修复师契约 · 第 196 任",
      body:[
        "本人自愿接受神经接口植入，以「修复师」身份服役于忘川号。",
        "工作内容：依据档案库分配的胶囊编号，逐一进入每一位被冷封者的记忆，协助其完成自我修复。",
        "守则一：你只是修复者。被修复者的人生属于他们自己。",
        "守则二：你不带情感介入。你只整理、唤回、归还。",
        "守则三：每一次修复结束，神经接口将清除该次记忆，确保下一次修复中立。",
        "——签字：M-□□-□□  （编号待补）"
      ]
    },
    { type:"prologue_narr", text:"你的工作牌烫着「修复师」三个字。" },
    { type:"prologue_narr", text:"——但中间四位编号，是空的。" },
    { type:"prologue_narr", text:"系统说这是个小 bug，等你完成第一次修复就会自动补上。" },
    { type:"prologue_narr", text:"你没有多想。" },
    { type:"prologue_narr", text:"" },
    { type:"prologue_voice", text:"修复师，欢迎登舰。" },
    { type:"prologue_voice", text:"今晚有三份档案在等待你的选择。" },
    { type:"prologue_voice", text:"——三位 10 年前自愿封存自己的乘客。" },
    { type:"prologue_voice", text:"他们各自封存的原因，档案里没有完整记录。" },
    { type:"prologue_voice", text:"你的任务，是协助其中一位重新整理记忆。" },
    { type:"prologue_voice", text:"——记住，你只是来修复他们的。" },
    { type:"prologue_voice", text:"他们不是来等你的。" },
    { type:"prologue_voice", text:"你也不是他们在等的人。" },
    { type:"prologue_voice", text:"" },
    { type:"prologue_choice", text:"系统在你眼前展开三份档案。请选择今晚要进入的人。",
      options:[
        { label:"千夜", route:"qianye", archive:"A-07", meta:"28 岁 / 银发 / 神经科学家", tag:"理性 · 失忆的天才", img:"assets/portraits/qianye.png" },
        { label:"云璃", route:"yunli", archive:"B-13", meta:"26 岁 / 粉发 / 机械工程师", tag:"感性 · 鬼马的引擎学徒", img:"assets/portraits/yunli.png" },
        { label:"银",   route:"yin",   archive:"C-21", meta:"30 岁 / 银发 / 沉默守夜人", tag:"反差 · 半身义体的星图持有者", img:"assets/portraits/yin.png" }
      ]
    },
    { type:"prologue_narr", text:"——你做出了选择。" },
    { type:"prologue_narr", text:"训练舱缓慢解锁。神经接口轻微一震。" },
    { type:"prologue_narr", text:"你将要进入她的记忆。" },
    { type:"prologue_narr", text:"——那里可能有你不熟悉的东西。" },
    { type:"prologue_narr", text:"——也可能有你不该熟悉的东西。" },
    { type:"prologue_narr", text:"但请记住——" },
    { type:"prologue_keyline", text:"你是修复师。她是被修复者。" },
    { type:"prologue_keyline", text:"你来，是替她整理一段她无法独自整理的人生。" },
    { type:"prologue_narr", text:"" },
    { type:"prologue_narr", text:"……" },
    { type:"prologue_narr", text:"准备好了吗？" }
  ];

  let currentStep = 0;
  let chosenRoute = null;
  let onComplete = null;

  function start(complete){
    onComplete = complete;
    chosenRoute = null;
    currentStep = 0;
    buildLayer();
    nextStep();
  }

  function buildLayer(){
    const old = document.getElementById("prologueLayer");
    if (old) old.remove();
    const layer = document.createElement("div");
    layer.id = "prologueLayer";
    layer.className = "prologue-layer";
    layer.innerHTML = `
      <div class="pl-bg" id="plBg"></div>
      <div class="pl-vignette"></div>
      <div class="pl-content">
        <div class="pl-text-wrap" id="plTextWrap"></div>
      </div>
      <button class="pl-skip" id="plSkip">跳过序章 ›</button>
      <div class="pl-tap" id="plTap">点击空白继续</div>
    `;
    document.body.appendChild(layer);

    layer.addEventListener("click", e => {
      if (e.target.closest(".pl-choice-row")) return;
      if (e.target.closest("#plSkip")) {
        skipPrologue();
        return;
      }
      // 等动画结束才能 advance
      if (!layer.classList.contains("anim-busy")) {
        nextStep();
      }
    });
  }

  function skipPrologue(){
    // 跳过：直接默认选千夜（最完整的一线）
    chosenRoute = chosenRoute || "qianye";
    finish();
  }

  function nextStep(){
    if (currentStep >= STEPS.length) {
      finish();
      return;
    }
    const step = STEPS[currentStep++];
    renderStep(step);
  }

  function renderStep(step){
    const wrap = document.getElementById("plTextWrap");
    const layer = document.getElementById("prologueLayer");
    layer.classList.add("anim-busy");

    if (step.type === "prologue_bg"){
      const bg = document.getElementById("plBg");
      if (bg) bg.style.backgroundImage = `url(${step.img})`;
      layer.classList.remove("anim-busy");
      nextStep();
      return;
    }

    let html = "";
    if (step.type === "prologue_narr"){
      if (step.text === ""){
        wrap.innerHTML = "";
        layer.classList.remove("anim-busy");
        setTimeout(nextStep, 300);
        return;
      }
      html = `<div class="pl-narr">${escapeHtml(step.text)}</div>`;
    }
    else if (step.type === "prologue_title"){
      html = `<div class="pl-title-block">
        <div class="pl-title-main">${escapeHtml(step.text)}</div>
        <div class="pl-title-sub">${escapeHtml(step.sub || "")}</div>
      </div>`;
    }
    else if (step.type === "prologue_voice"){
      if (step.text === ""){
        wrap.innerHTML = "";
        layer.classList.remove("anim-busy");
        setTimeout(nextStep, 300);
        return;
      }
      html = `<div class="pl-voice"><span class="pl-voice-tag">SYSTEM</span>${escapeHtml(step.text)}</div>`;
    }
    else if (step.type === "prologue_doc"){
      html = `<div class="pl-doc">
        <div class="pl-doc-title">${escapeHtml(step.title)}</div>
        <ul class="pl-doc-list">
          ${step.body.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>
      </div>`;
    }
    else if (step.type === "prologue_keyline"){
      html = `<div class="pl-keyline"><b>${escapeHtml(step.text)}</b></div>`;
    }
    else if (step.type === "prologue_choice"){
      html = `<div class="pl-choice">
        <div class="pl-choice-q">${escapeHtml(step.text)}</div>
        <div class="pl-route-cards">
          ${step.options.map(o =>
            `<div class="pl-route-card" data-route="${o.route}">
              <div class="prc-img"><img src="${o.img || ''}" alt=""/></div>
              <div class="prc-info">
                <div class="prc-archive">档案 ${escapeHtml(o.archive || '')}</div>
                <div class="prc-name">${escapeHtml(o.label)}</div>
                <div class="prc-meta">${escapeHtml(o.meta || '')}</div>
                <div class="prc-tag">${escapeHtml(o.tag || '')}</div>
              </div>
            </div>`).join("")}
        </div>
      </div>`;
    }

    wrap.innerHTML = html;

    if (step.type === "prologue_choice"){
      wrap.querySelectorAll(".pl-route-card").forEach(row => {
        row.addEventListener("click", e => {
          e.stopPropagation();
          chosenRoute = row.dataset.route;
          row.classList.add("picked");
          setTimeout(() => {
            layer.classList.remove("anim-busy");
            nextStep();
          }, 380);
        });
      });
      return;
    }

    setTimeout(() => layer.classList.remove("anim-busy"), 220);
  }

  function escapeHtml(s){
    return String(s||"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
  }

  function finish(){
    const layer = document.getElementById("prologueLayer");
    // 立即触发回调（main.js 会切换到 game-screen），再 fadeOut prologue 层
    if (onComplete) onComplete(chosenRoute || "qianye");
    if (layer){
      layer.classList.add("fading-out");
      setTimeout(() => layer.remove(), 600);
    }
  }

  return { start };
})();
