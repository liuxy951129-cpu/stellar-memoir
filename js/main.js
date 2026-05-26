/* 入口 v2 */
(function(){
  let save = Save.load() || Save.defaults();
  // 合并默认字段（兼容老存档）
  const def = Save.defaults();
  for (const k of Object.keys(def)){
    if (save[k] === undefined) save[k] = def[k];
  }
  let settings = Save.loadSettings();
  Sys.initSave(save);
  Engine.init(save, settings);

  // 体力心跳
  setInterval(()=>{
    Sys.tickStamina(save);
    UI.renderTopBar(save);
  }, 5000);

  // 初始渲染
  UI.renderRouteCards("routeCards", save);
  UI.renderTopBar(save);
  Gallery.render(save);
  Gacha.render(save);
  UI.renderAffinityMini(save.affinity);

  // 控制顶部资源条在 game-screen 时隐藏（v3 把 top bar 内嵌到 title 屏，无需同步）
  function syncTopBar(){
    const tb = document.getElementById("topBar");
    if (!tb) return;
    const game = document.getElementById("game-screen");
    tb.style.display = game.classList.contains("active") ? "none" : "flex";
  }
  setInterval(syncTopBar, 200);

  // 全局点击代理
  document.addEventListener("click", (e)=>{
    const t = e.target;
    const action = t.closest("[data-action]")?.dataset.action;

    // 角色卡片点击
    const card = t.closest(".route-card");
    if (card){
      Engine.start(card.dataset.route);
      return;
    }
    // 小游戏卡片点击
    const miniCard = t.closest(".mini-card[data-mini]");
    if (miniCard){
      const game = miniCard.dataset.mini;
      MiniGame.start(game, (reward)=>{
        if (reward){
          if (reward.coin) save.coin += reward.coin;
          if (reward.aff) Object.keys(reward.aff).forEach(k => save.affinity[k] = (save.affinity[k]||0) + reward.aff[k]);
          Sys.countTask(save, "miniCount", 1);
          Save.store(save);
          UI.renderTopBar(save);
        }
      });
      return;
    }
    // 商店送出按钮
    const shopBtn = t.closest(".shop-send");
    if (shopBtn){
      UI.showGiftReceiver(save, shopBtn.dataset.gid);
      Sys.countTask(save, "giftCount", 0); // 实际送出时计数
      Save.store(save);
      return;
    }
    // 任务领取
    const claim = t.closest(".task-claim");
    if (claim && !claim.disabled){
      Sys.claimTask(save, claim.dataset.task, claim.dataset.kind);
      Save.store(save);
      UI.renderTasks(save);
      UI.renderTopBar(save);
      return;
    }

    if (!action) return;

    switch(action){
      case "start-new":
        if (save.currentRoute){
          UI.modal({
            title:"提示",
            body:"<p>已有进行中的故事。是否覆盖开始新故事？</p>",
            onOk: ()=>{
              save = Save.defaults();
              Sys.initSave(save);
              Engine.init(save, settings);
              UI.closeModal();
              startWithPrologueIfNeeded();
            }
          });
        } else {
          startWithPrologueIfNeeded();
        }
        break;
      case "continue":
        if (!save.currentRoute){ UI.toast("还没有进行中的故事，选个角色开始吧"); UI.switchScreen("route-select"); return; }
        Engine.resume();
        break;
      case "tasks":
        UI.renderTasks(save);
        UI.switchScreen("task-screen");
        break;
      case "mailbox":
        UI.renderMailbox(save);
        UI.switchScreen("mailbox-screen");
        break;
      case "shop":
        UI.renderShop(save);
        UI.switchScreen("shop-screen");
        break;
      case "gallery":
        Gallery.render(save);
        UI.switchScreen("gallery-screen");
        break;
      case "gacha":
        Gacha.render(save);
        UI.switchScreen("gacha-screen");
        break;
      case "settings":
        UI.switchScreen("settings-screen");
        break;
      case "minigames":
        UI.switchScreen("minigames-screen");
        break;
      case "profile":
        UI.renderProfile(save);
        UI.switchScreen("profile-screen");
        break;
      case "to-title":
        UI.renderRouteCards("routeCards", save);
        UI.switchScreen("title-screen");
        break;

      case "menu":
        UI.modal({
          title:"菜单",
          body:`<p>当前章节进度已自动保存。</p>
                <p>体力：<b style="color:#3ad6ff;">${save.stamina}/${Sys.MAX_STAMINA}</b></p>
                <p>每章消耗 <b>3</b> 体力。每分钟回 1。</p>`,
          onOk: ()=>{ UI.switchScreen("title-screen"); UI.closeModal(); }
        });
        break;

      case "auto":
        Engine.autoMode = !Engine.autoMode;
        t.classList.toggle("active", Engine.autoMode);
        UI.toast(Engine.autoMode ? "自动播放：开" : "自动播放：关");
        if (Engine.autoMode) Engine.run();
        break;
      case "skip":
        Engine.skipMode = !Engine.skipMode;
        t.classList.toggle("active", Engine.skipMode);
        UI.toast(Engine.skipMode ? "跳过已读：开" : "跳过：关");
        if (Engine.skipMode) Engine.run();
        break;
      case "chapters":
        if (save.currentRoute){
          Chapters.showPanel(save, save.currentRoute);
        } else {
          UI.toast("请先开启一条主线");
        }
        break;
      case "log":
        UI.modal({
          title:"对话日志",
          body: Engine.log.slice(-20).map(r=>`<div class="log-row"><b>${r.who}</b><span>${r.text}</span></div>`).join("") || "<p>暂无</p>",
          onOk:()=>UI.closeModal()
        });
        break;
      case "save":
        Save.store(Engine.save);
        UI.toast("已保存");
        break;
      case "load":
        const s = Save.load();
        if (!s){ UI.toast("无存档"); break; }
        Engine.save = s;
        save = s;
        Engine.run();
        UI.toast("已读档");
        break;

      case "modal-ok":
        const ok = document.getElementById("modal")._onOk;
        if (typeof ok === "function") ok();
        else UI.closeModal();
        break;
      case "modal-cancel":
        UI.closeModal();
        break;

      case "close-cg":
        UI.closeCG();
        break;

      case "gacha-1":{
        const got = Gacha.doPull(1, save);
        if (got){
          Gacha.renderResult(got);
          Gacha.render(save);
          UI.renderTopBar(save);
          UI.toast(`抽到：${got[0].rk} · ${got[0].name}`);
        }
        break;
      }
      case "gacha-10":{
        const got = Gacha.doPull(10, save);
        if (got){
          Gacha.renderResult(got);
          Gacha.render(save);
          UI.renderTopBar(save);
          const best = got.reduce((b,x)=> ({R:1,SR:2,SSR:3}[x.rk] > ({R:1,SR:2,SSR:3}[b.rk]||0) ? x : b), got[0]);
          UI.toast(`十连完成 · 最高 ${best.rk}：${best.name}`);
        }
        break;
      }
      case "recharge":
        UI.modal({
          title:"演示充值",
          body:"<p>这是 demo，赠送你 500 ★ 与 10 ♦~</p>",
          onOk:()=>{
            save.coin += 500;
            save.diamond += 10;
            Save.store(save);
            Gacha.render(save);
            UI.renderTopBar(save);
            UI.closeModal();
            UI.toast("已到账");
          }
        });
        break;

      case "reset-save":
        UI.modal({
          title:"确认清空？",
          body:"<p>所有剧情进度、相册、抽卡历史、邮件都会被重置。</p>",
          onOk:()=>{
            Save.clear();
            save = Save.defaults();
            Sys.initSave(save);
            Engine.init(save, settings);
            UI.renderRouteCards("routeCards", save);
            Gallery.render(save);
            Gacha.render(save);
            UI.renderTopBar(save);
            UI.renderAffinityMini(save.affinity);
            UI.closeModal();
            UI.toast("已清空");
          }
        });
        break;
    }
  });

  // 对话区点击：推进 / 跳过打字
  document.getElementById("dialogBox").addEventListener("click", ()=>{
    if (Engine.finishTyping()) return;
    Engine.run();
  });

  // 设置项
  const ts = document.getElementById("textSpeed");
  ts.value = settings.textSpeed;
  ts.addEventListener("input", ()=>{ settings.textSpeed = +ts.value; Save.storeSettings(settings); });
  const as = document.getElementById("autoSpeed");
  as.value = settings.autoSpeed;
  as.addEventListener("input", ()=>{ settings.autoSpeed = +as.value; Save.storeSettings(settings); });
  const bv = document.getElementById("bgmVol");
  bv.value = settings.bgmVol;
  bv.addEventListener("input", ()=>{ settings.bgmVol = +bv.value; Save.storeSettings(settings); });
  const ors = document.getElementById("onlyReadSkip");
  ors.checked = settings.onlyReadSkip;
  ors.addEventListener("change", ()=>{ settings.onlyReadSkip = ors.checked; Save.storeSettings(settings); });

  /* ===== v6 序章引导 ===== */
  function startWithPrologueIfNeeded(){
    if (save.prologueDone){
      UI.renderRouteCards("routeCards", save);
      UI.switchScreen("route-select");
      return;
    }
    Prologue.start((chosenRoute) => {
      save.prologueDone = true;
      Save.store(save);
      // 直接进入选定的支线
      if (chosenRoute){
        save.currentRoute = chosenRoute;
        save.stepIndex = 0;
        Save.store(save);
        UI.switchScreen("game-screen");
        Engine.run();
      } else {
        UI.renderRouteCards("routeCards", save);
        UI.switchScreen("route-select");
      }
    });
  }

  // 暴露给设置页"重看序章"
  window.__replayPrologue = function(){
    Prologue.start((chosenRoute) => {
      if (chosenRoute){
        save.currentRoute = chosenRoute;
        save.stepIndex = 0;
        Save.store(save);
        UI.switchScreen("game-screen");
        Engine.run();
      }
    });
  };
})();
