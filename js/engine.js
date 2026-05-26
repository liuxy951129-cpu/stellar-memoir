/* 剧情引擎（指针推进 + label 跳转 + 选择） */
window.Engine = {
  save: null,
  settings: null,
  log: [],
  typing: false,
  typingTimer: null,
  autoTimer: null,
  autoMode: false,
  skipMode: false,

  init(save, settings){
    this.save = save;
    this.settings = settings;
  },

  start(routeId){
    this.save.currentRoute = routeId;
    this.save.stepIndex = 0;
    this.log = [];
    Save.store(this.save);
    UI.switchScreen("game-screen");
    this.run();
  },

  resume(){
    UI.switchScreen("game-screen");
    this.run();
  },

  current(){
    return STORY[this.save.currentRoute] || [];
  },

  run(){
    const steps = this.current();
    while (this.save.stepIndex < steps.length){
      const step = steps[this.save.stepIndex];
      const t = step.type;

      if (t === "label"){
        this.save.stepIndex++;
        continue;
      }
      if (t === "jump"){
        const idx = steps.findIndex(s => s.type === "label" && s.id === step.to);
        if (idx >= 0) this.save.stepIndex = idx;
        else this.save.stepIndex++;
        continue;
      }
      if (t === "chapter"){
        this.showChapter(step);
        this.save.stepIndex++;
        return;
      }
      if (t === "narr" || t === "line"){
        this.renderLine(step);
        this.save.stepIndex++;
        Save.store(this.save);
        return;
      }
      if (t === "choice"){
        this.renderChoice(step);
        return;
      }
      if (t === "cg"){
        this.save.unlockedCG = this.save.unlockedCG || {};
        this.save.unlockedCG[step.id] = true;
        UI.toast("解锁回忆碎片：" + (step.title || step.id));
        this.save.coin += 60;
        this.save.diamond += 1;
        Save.store(this.save);
        this.save.stepIndex++;
        continue;
      }
      if (t === "end"){
        this.renderEnding(step);
        return;
      }
      this.save.stepIndex++;
    }
  },

  showChapter(step){
    const layer = document.getElementById("sceneLayer");
    Scene.set(layer, document.getElementById("sceneFx"), "deck");
    document.getElementById("dayTag").textContent = "Day " + step.day;
    document.getElementById("chapterTag").textContent = step.name;
    const cf = document.createElement("div");
    cf.className = "chapter-fade";
    cf.innerHTML = `<div class="cf-day">DAY ${step.day}</div><div class="cf-name">${step.name}</div><div class="cf-en">${step.en || ""}</div>`;
    document.getElementById("game-screen").appendChild(cf);
    setTimeout(()=>{
      cf.style.transition = "opacity 1s";
      cf.style.opacity = 0;
      setTimeout(()=>{ cf.remove(); this.run(); }, 1000);
    }, 1500);
  },

  renderLine(step){
    const speakerEl = document.getElementById("speaker");
    const textEl = document.getElementById("dialogText");
    const route = (window.ROUTES || []).find(r => r.id === this.save.currentRoute);
    const charStage = document.getElementById("charStage");

    // 场景
    if (step.scene){
      Scene.set(document.getElementById("sceneLayer"),
                document.getElementById("sceneFx"),
                step.scene, step.fx);
    } else if (step.fx){
      Scene.set(document.getElementById("sceneLayer"),
                document.getElementById("sceneFx"),
                document.getElementById("sceneLayer").className.replace("scene-layer","").trim().replace("scene-",""),
                step.fx);
    }

    // 立绘
    if (step.who === "narrator" || step.who === "player"){
      // 旁白 / 主角内心：不展示对方立绘表情切换
      // 但保留角色立绘背景
      const exists = charStage.querySelector(".portrait");
      if (!exists && route) Portrait.setStage(charStage, route.id, "calm");
    } else if (step.who === route?.id){
      Portrait.setExp(charStage, route.id, step.exp || "calm");
      const w = charStage.querySelector(".portrait");
      if (w) w.classList.add("in");
    }

    // 说话人
    let label = "";
    let cls = "speaker";
    if (step.who === "narrator"){ label = "旁白"; cls += " narrator"; }
    else if (step.who === "player"){ label = "我"; cls += " protagonist"; }
    else if (route && step.who === route.id) label = route.name;
    else label = step.who || "";
    speakerEl.className = cls;
    speakerEl.textContent = label;

    // 打字机
    this.typeText(textEl, step.text);

    // 日志
    this.log.push({who:label, text:step.text});

    // 已读
    this.save.readSet[this.save.currentRoute + "_" + this.save.stepIndex] = true;

    // 隐藏选项
    document.getElementById("choiceBox").innerHTML = "";

    // 自动模式
    if (this.autoMode){
      clearTimeout(this.autoTimer);
      const wait = (this.settings.autoSpeed || 1800) + step.text.length * 30;
      this.autoTimer = setTimeout(()=>this.run(), wait);
    }
    // 跳过模式
    if (this.skipMode){
      const onlyRead = this.settings.onlyReadSkip;
      const isRead = this.save.readSet[this.save.currentRoute + "_" + this.save.stepIndex];
      if (!onlyRead || isRead){
        clearTimeout(this.autoTimer);
        this.autoTimer = setTimeout(()=>this.run(), 60);
      }
    }
  },

  typeText(el, txt){
    clearInterval(this.typingTimer);
    this.typing = true;
    el.textContent = "";
    let i = 0;
    const speed = Math.max(8, 80 - (this.settings.textSpeed || 35));
    this.typingTimer = setInterval(()=>{
      el.textContent = txt.slice(0, ++i);
      if (i >= txt.length){
        clearInterval(this.typingTimer);
        this.typing = false;
      }
    }, speed);
  },

  finishTyping(){
    if (!this.typing) return false;
    clearInterval(this.typingTimer);
    const steps = this.current();
    const step = steps[this.save.stepIndex - 1];
    if (step) document.getElementById("dialogText").textContent = step.text;
    this.typing = false;
    return true;
  },

  renderChoice(step){
    const box = document.getElementById("choiceBox");
    box.innerHTML = "";
    step.options.forEach(opt=>{
      const btn = document.createElement("div");
      btn.className = "choice-item";
      btn.textContent = opt.text;
      btn.addEventListener("click", ()=>this.pickChoice(opt));
      box.appendChild(btn);
    });
    document.getElementById("dialogText").textContent = "（选择你的回应）";
    document.getElementById("speaker").textContent = "选择";
    document.getElementById("speaker").className = "speaker narrator";
  },

  pickChoice(opt){
    const steps = this.current();
    // 好感度
    if (opt.aff){
      Object.keys(opt.aff).forEach(k=>{
        this.save.affinity[k] = (this.save.affinity[k] || 0) + opt.aff[k];
      });
      UI.toast(this._affToast(opt.aff));
      UI.renderAffinityMini(this.save.affinity);
    }
    if (opt.flag) this.save.flags[opt.flag] = true;
    if (opt.unlock){
      this.save.unlockedCG = this.save.unlockedCG || {};
      this.save.unlockedCG[opt.unlock] = true;
    }
    // 跳转
    this.save.stepIndex++;
    if (opt.next){
      const idx = steps.findIndex(s => s.type === "label" && s.id === opt.next);
      if (idx >= 0) this.save.stepIndex = idx + 1;
    }
    Save.store(this.save);
    document.getElementById("choiceBox").innerHTML = "";
    this.run();
  },

  _affToast(aff){
    return Object.keys(aff).map(k=>{
      const map={qianye:"千夜",yunli:"云璃",yin:"银"};
      const v = aff[k];
      return `${map[k] || k} 好感 ${v>=0?"+":""}${v}`;
    }).join(" · ");
  },

  renderEnding(step){
    // 决定结局：基于好感度与 flag
    const route = this.save.currentRoute;
    const aff = this.save.affinity[route] || 0;
    let finalTag = step.tag;
    let finalTitle = step.title;
    let finalEn = step.en;
    let finalBody = step.body;

    if (aff <= 1){
      finalTag = "TE";
      finalTitle = "渐行渐远";
      finalEn = "Drifting Apart";
      finalBody = "你终究没能成为她（他）能认出的那个人。航行继续，记忆封存。";
    } else if (aff <= 5){
      finalTag = "NE";
      finalTitle = "未完待续";
      finalEn = "To Be Continued";
      finalBody = "故事还远没有结束。你们都在等下一次的「先认出我」。";
    }

    this.save.finishedRoutes = this.save.finishedRoutes || {};
    this.save.finishedRoutes[route] = finalTag;
    // 通关奖励
    this.save.coin += 200;
    this.save.diamond += 5;
    Save.store(this.save);

    const card = document.createElement("div");
    card.className = "ending-card";
    card.innerHTML = `
      <div class="ending-tag ${finalTag.toLowerCase()}">${finalTag === "HE" ? "TRUE END · 爱意完满" : finalTag === "NE" ? "NORMAL END" : "TRUE BAD END"}</div>
      <h2>${finalTitle}</h2>
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;color:#ffd9ee;letter-spacing:.25em;margin-bottom:18px;">${finalEn}</div>
      <p>${finalBody}</p>
      <div style="display:flex;gap:10px;">
        <button class="btn-primary" id="endBackBtn">回到星图</button>
        <button class="btn-ghost" id="endGalBtn">查看相册</button>
      </div>
      <p style="margin-top:24px;font-size:12px;color:#aab1d6;">通关奖励：星币 +200 · 钻石 +5</p>
    `;
    document.getElementById("game-screen").appendChild(card);
    document.getElementById("endBackBtn").onclick = () => {
      card.remove();
      UI.switchScreen("title-screen");
    };
    document.getElementById("endGalBtn").onclick = () => {
      card.remove();
      Gallery.render(this.save);
      UI.switchScreen("gallery-screen");
    };
  }
};
