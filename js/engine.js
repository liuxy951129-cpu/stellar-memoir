/* 剧情引擎 v2 */
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
    if (!Sys.consumeStamina(this.save, 0)) return; // 进入不耗体力，每章消耗
    this.save.currentRoute = routeId;
    this.save.stepIndex = 0;
    this.log = [];
    Save.store(this.save);
    UI.switchScreen("game-screen");
    UI.renderRoundHUD(this.save);
    this.run();
  },

  resume(){
    UI.switchScreen("game-screen");
    UI.renderRoundHUD(this.save);
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

      if (t === "label"){ this.save.stepIndex++; continue; }
      if (t === "jump"){
        const idx = steps.findIndex(s => s.type === "label" && s.id === step.to);
        if (idx >= 0) this.save.stepIndex = idx;
        else this.save.stepIndex++;
        continue;
      }
      if (t === "chapter"){
        // 体力消耗（仅未读章节）
        if (!Chapters.hasRead(this.save, this.save.currentRoute, this.save.stepIndex)){
          if (!Sys.consumeStamina(this.save, Sys.STAMINA_PER_CHAPTER)){
            UI.switchScreen("title-screen");
            return;
          }
        }
        Chapters.markRead(this.save, this.save.currentRoute, this.save.stepIndex);
        this.showChapter(step);
        this.save.stepIndex++;
        return;
      }
      if (t === "anomaly"){
        UI.showAnomaly(step.text);
        if (step.clue) Anomaly.recordClue(this.save, step.clue);
        Save.store(this.save);
        this.save.stepIndex++;
        continue;
      }
      if (t === "player_silhouette"){
        Portrait.setStage(document.getElementById("charStage"), "player_silhouette", "calm");
        document.getElementById("speaker").className = "speaker narrator";
        document.getElementById("speaker").textContent = "???";
        document.getElementById("dialogText").textContent = step.text || "";
        document.getElementById("choiceBox").innerHTML = "";
        this.save.stepIndex++;
        Save.store(this.save);
        return;
      }
      if (t === "player_reveal"){
        this.save.flags.player_revealed = true;
        Portrait.setStage(document.getElementById("charStage"), "player", "smile");
        UI.toast("✦ 你认出了你自己");
        Save.store(this.save);
        this.save.stepIndex++;
        continue;
      }
      if (t === "narr" || t === "line"){
        this.renderLine(step);
        this.save.stepIndex++;
        Save.store(this.save);
        return;
      }
      if (t === "choice"){ this.renderChoice(step); return; }
      if (t === "cg"){
        this.save.unlockedCG = this.save.unlockedCG || {};
        if (!this.save.unlockedCG[step.id]){
          this.save.unlockedCG[step.id] = { title:step.title, scene:step.scene, img:step.img };
          this.save.coin += 60;
          this.save.diamond += 1;
          Sys.countTask(this.save, "cgCount", 1);
          UI.toast("解锁回忆碎片：" + (step.title || step.id));
          // 显示 CG 大图
          UI.showCG(this.save.currentRoute, step.title, step.scene, step.img);
        }
        Save.store(this.save);
        this.save.stepIndex++;
        return; // 等待用户关闭 CG
      }
      if (t === "mini"){
        // 触发小游戏
        const game = step.game || "qy";
        const route = step.game === "yl" ? "yunli" : step.game === "yin" ? "yin" : "qianye";
        this.save.stepIndex++;
        Save.store(this.save);
        MiniGame.start(game, (reward) => {
          if (reward){
            if (reward.coin) this.save.coin += reward.coin;
            if (reward.aff) Object.keys(reward.aff).forEach(k => this.save.affinity[k] = (this.save.affinity[k]||0) + reward.aff[k]);
            Sys.countTask(this.save, "miniCount", 1);
            Save.store(this.save);
            UI.renderRoundHUD(this.save);
          }
          this.run();
        });
        return;
      }
      if (t === "mail"){
        const id = step.id || (`m_${Date.now()}`);
        const exists = this.save.mailbox.find(m=>m.id===id);
        if (!exists){
          this.save.mailbox.unshift({ id, title:step.title, role:step.role, body:step.body, ts:Date.now() });
          UI.toast("收到新邮件：" + step.title);
        }
        Save.store(this.save);
        this.save.stepIndex++;
        continue;
      }
      if (t === "countdown" || t === "touch" || t === "drag" || t === "typing" || t === "swipe" || t === "qte"){
        // 互动机制
        const handler = Interact[t === "qte" ? "qte" : t];
        this.save.stepIndex++;
        Save.store(this.save);
        handler.call(Interact, step, (result) => {
          // 应用 success/fail 分支
          let target = null;
          if (t === "countdown" && result.opt){
            // 倒计时按选项
            const opt = result.opt;
            if (opt.aff) Object.keys(opt.aff).forEach(k => this.save.affinity[k] = (this.save.affinity[k]||0) + opt.aff[k]);
            if (opt.flag) this.save.flags[opt.flag] = true;
            target = opt.next;
          } else if (t === "touch" && result.region){
            const r = result.region;
            if (r.aff) Object.keys(r.aff).forEach(k => this.save.affinity[k] = (this.save.affinity[k]||0) + r.aff[k]);
            if (r.flag) this.save.flags[r.flag] = true;
            target = r.next;
          } else {
            const branch = result.success ? step.success : step.fail;
            if (branch){
              if (branch.flag) this.save.flags[branch.flag] = true;
              if (branch.aff) Object.keys(branch.aff).forEach(k => this.save.affinity[k] = (this.save.affinity[k]||0) + branch.aff[k]);
              target = branch.next;
            }
          }
          if (target){
            const idx = this.current().findIndex(s => s.type === "label" && s.id === target);
            if (idx >= 0) this.save.stepIndex = idx + 1;
          }
          UI.renderRoundHUD(this.save);
          Save.store(this.save);
          this.run();
        });
        return;
      }
      if (t === "be"){
        // bad ending
        this.renderEnding({ tag:"BE", title:step.title, en:step.en, body:step.body });
        return;
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
    Scene.set(layer, document.getElementById("sceneFx"), step.scene || "deck");
    Portrait.clear(document.getElementById("charStage"));
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
    }, 1400);
  },

  renderLine(step){
    const speakerEl = document.getElementById("speaker");
    const textEl = document.getElementById("dialogText");
    const route = (window.ROUTES || []).find(r => r.id === this.save.currentRoute);
    const charStage = document.getElementById("charStage");

    if (step.scene){
      Scene.set(document.getElementById("sceneLayer"),
                document.getElementById("sceneFx"),
                step.scene, step.fx);
    } else if (step.fx){
      Scene.set(document.getElementById("sceneLayer"),
                document.getElementById("sceneFx"),
                null, step.fx);
      // 保持原背景
      const cur = document.getElementById("sceneLayer").className.match(/scene-(\w+)/);
      if (cur) Scene.set(document.getElementById("sceneLayer"),
                        document.getElementById("sceneFx"),
                        cur[1], step.fx);
    }

    if (step.who === "narrator" || step.who === "player"){
      // 旁白和玩家说话时：隐藏立绘
      Portrait.hide(charStage);
    } else if (step.who === route?.id){
      // 角色说话时：显示并切表情
      Portrait.setStage(charStage, route.id, step.exp || "calm");
      Portrait.setExp(charStage, route.id, step.exp || "calm");
    } else if (step.who && step.who !== "narrator"){
      // 其他角色（少见）
      const exists = charStage.querySelector(`.portrait[data-role="${step.who}"]`);
      if (!exists){
        Portrait.setStage(charStage, step.who, step.exp || "calm");
      } else {
        Portrait.setExp(charStage, step.who, step.exp || "calm");
        Portrait.show(charStage);
      }
    }

    let label = "";
    let cls = "speaker";
    if (step.who === "narrator"){ label = "旁白"; cls += " narrator"; }
    else if (step.who === "player"){ label = "我"; cls += " protagonist"; }
    else if (route && step.who === route.id) label = route.name;
    else label = step.who || "";
    speakerEl.className = cls;
    speakerEl.textContent = label;

    this.typeText(textEl, step.text);
    this.log.push({who:label, text:step.text});

    // 已读 + 任务计数（每次显示对话算一次 talk）
    const key = this.save.currentRoute + "_" + this.save.stepIndex;
    if (!this.save.readSet[key] && (step.who !== "narrator" && step.who !== "player")){
      Sys.countTask(this.save, "talkCount", 1);
    }
    this.save.readSet[key] = true;

    document.getElementById("choiceBox").innerHTML = "";

    if (this.autoMode){
      clearTimeout(this.autoTimer);
      const wait = (this.settings.autoSpeed || 1800) + step.text.length * 30;
      this.autoTimer = setTimeout(()=>this.run(), wait);
    }
    if (this.skipMode){
      const onlyRead = this.settings.onlyReadSkip;
      const isRead = this.save.readSet[key];
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
    if (step && step.text) document.getElementById("dialogText").textContent = step.text;
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
    if (opt.aff){
      Object.keys(opt.aff).forEach(k=>{
        this.save.affinity[k] = (this.save.affinity[k] || 0) + opt.aff[k];
        const cur = this.save.affinity[k];
        this.save.weeklyState.maxAff = Math.max(this.save.weeklyState.maxAff || 0, cur);
        // 阶段升级
        const newStage = Math.max(0, Math.min(3, Math.floor(cur / 8)));
        if (newStage > (this.save.stages[k] || 0)){
          this.save.stages[k] = newStage;
          UI.toast(`💞 关系升级：${window.STAGE_NAMES[newStage]}`);
        }
      });
      UI.toast(this._affToast(opt.aff));
      UI.renderRoundHUD(this.save);
    }
    if (opt.flag) this.save.flags[opt.flag] = true;
    if (opt.unlock){
      this.save.unlockedCG = this.save.unlockedCG || {};
      this.save.unlockedCG[opt.unlock] = true;
    }
    // 触发小游戏（在选项中）
    if (opt.mini){
      this.save.stepIndex++;
      if (opt.next){
        const idx = steps.findIndex(s => s.type === "label" && s.id === opt.next);
        if (idx >= 0) this.save.stepIndex = idx + 1;
      }
      Save.store(this.save);
      document.getElementById("choiceBox").innerHTML = "";
      const game = opt.mini;
      MiniGame.start(game, (reward)=>{
        if (reward){
          if (reward.coin) this.save.coin += reward.coin;
          if (reward.aff) Object.keys(reward.aff).forEach(k => this.save.affinity[k] = (this.save.affinity[k]||0) + reward.aff[k]);
          Sys.countTask(this.save, "miniCount", 1);
          Save.store(this.save);
          UI.renderRoundHUD(this.save);
        }
        this.run();
      });
      return;
    }
    // 送礼
    if (opt.gift){
      const g = window.GIFTS[opt.gift];
      if (g) UI.toast(`你赠送了 ${g.name}`);
    }
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
      return `${map[k] || k} ${v>=0?"+":""}${v}`;
    }).join(" · ");
  },

  renderEnding(step){
    const route = this.save.currentRoute;
    const aff = this.save.affinity[route] || 0;
    let finalTag = step.tag, finalTitle = step.title, finalEn = step.en, finalBody = step.body;
    if (aff <= 3){
      finalTag = "TE"; finalTitle = "渐行渐远"; finalEn = "Drifting Apart";
      finalBody = "你终究没能成为 ta 能认出的那个人。航行继续，记忆封存。\n（提示：好感度太低，下次多送礼、多互动）";
    } else if (aff <= 9){
      finalTag = "NE"; finalTitle = "未完待续"; finalEn = "To Be Continued";
      finalBody = "故事还远没有结束。你们都在等下一次的「先认出我」。\n（提示：好感度需 ≥ 10 才能解锁 HE）";
    }
    this.save.finishedRoutes = this.save.finishedRoutes || {};
    this.save.finishedRoutes[route] = finalTag;
    this.save.coin += 200;
    this.save.diamond += 5;
    Sys.countTask(this.save, "routeFinished", 1);
    // 触发玩家暗线邮件（仅在主线 HE 时）
    if (['qianye','yunli','yin'].includes(route) && finalTag === "HE"){
      Anomaly.checkAndPushOnRouteFinish(this.save, route);
    }
    Save.store(this.save);

    const card = document.createElement("div");
    card.className = "ending-card";
    card.innerHTML = `
      <div class="ending-tag ${finalTag.toLowerCase()}">${finalTag === "HE" ? "TRUE END · 爱意完满" : finalTag === "NE" ? "NORMAL END" : "TRUE BAD END"}</div>
      <h2>${finalTitle}</h2>
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;color:#ffd9ee;letter-spacing:.25em;margin-bottom:18px;">${finalEn}</div>
      <p style="white-space:pre-line;">${finalBody}</p>
      <div style="display:flex;gap:10px;margin-top:20px;">
        <button class="btn-primary" id="endBackBtn">回到星图</button>
        <button class="btn-ghost" id="endGalBtn">查看相册</button>
      </div>
      <p style="margin-top:24px;font-size:12px;color:#aab1d6;">通关奖励：星币 +200 · 钻石 +5</p>
    `;
    document.getElementById("game-screen").appendChild(card);
    document.getElementById("endBackBtn").onclick = () => { card.remove(); UI.switchScreen("title-screen"); };
    document.getElementById("endGalBtn").onclick = () => { card.remove(); Gallery.render(this.save); UI.switchScreen("gallery-screen"); };
  }
};
