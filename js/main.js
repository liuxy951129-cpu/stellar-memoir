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

  // BGM 初始化
  if (window.AudioMgr){
    AudioMgr.init();
    // 同步设置控件初始值
    setTimeout(()=>{
      const en = document.getElementById("bgmEnabled");
      const vol = document.getElementById("bgmVol");
      if (en) en.checked = AudioMgr.getEnabled();
      if (vol) vol.value = Math.round(AudioMgr.getVolume()*100);
      if (en) en.addEventListener("change", e=>{
        AudioMgr.setEnabled(e.target.checked);
        if (e.target.checked){
          const cur = save.currentRoute || (document.getElementById("title-screen")?.classList.contains("active") ? "title" : "title");
          AudioMgr.play(cur);
        }
      });
      if (vol) vol.addEventListener("input", e=>{
        AudioMgr.setVolume(parseInt(e.target.value)/100);
      });
    }, 200);
    // 主菜单默认放 title 主题（在用户首次手势后才会实际响）
    AudioMgr.play("title");
  }

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
        if (window.AudioMgr) AudioMgr.play("title");
        break;

      case "menu":
        UI.modal({
          title:"修复师面板",
          body:`<p style="line-height:1.7;">当前章节进度已自动保存。</p>
                <p style="line-height:1.7;color:#a9b3ff;">— 你随时可以查看身份档案，或返回主菜单。</p>
                <p style="line-height:1.7;color:#ff77c8;font-size:12px;">⚠ 返回主菜单将丢失未保存进度。请先「存档」。</p>
                <div class="modal-menu-actions">
                  <button class="btn-ghost" data-action="open-profile-from-menu">📁 查看档案</button>
                  <button class="btn-ghost" data-action="back-to-title-confirm">⌂ 返回主菜单</button>
                </div>`,
          onOk: ()=>{ UI.closeModal(); }
        });
        break;
      case "open-profile-from-menu":
        UI.closeModal();
        UI.renderProfile(save);
        UI.switchScreen("profile-screen");
        break;
      case "back-to-title-confirm":
        UI.closeModal();
        UI.modal({
          title:"返回主菜单？",
          body:`<p>未保存的进度将会丢失。</p>
                <p style="color:#ffd66b;">建议先点底部「存档」按钮。</p>`,
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
      case "repair-detail":
        if (save.currentRoute){
          Repair.show(save);
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
  // 注：BGM 音量改由 AudioMgr 统一管理（持久化到 localStorage.bgm_cfg），此处只兜底显示
  if (bv && !window.AudioMgr) {
    bv.value = settings.bgmVol;
    bv.addEventListener("input", ()=>{ settings.bgmVol = +bv.value; Save.storeSettings(settings); });
  }
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
      if (chosenRoute){
        save.currentRoute = chosenRoute;
        save.stepIndex = 0;
        Save.store(save);
        // 先切到 game-screen 再让 prologue fadeOut，避免闪标题屏
        UI.switchScreen("game-screen");
        if (window.AudioMgr) AudioMgr.play(chosenRoute);
        Engine.run();
      } else {
        UI.renderRouteCards("routeCards", save);
        UI.switchScreen("route-select");
      }
    });
    if (window.AudioMgr) AudioMgr.play("prologue");
  }

  // 暴露给设置页"重看序章"
  window.__replayPrologue = function(){
    Prologue.start((chosenRoute) => {
      if (chosenRoute){
        save.currentRoute = chosenRoute;
        save.stepIndex = 0;
        Save.store(save);
        UI.switchScreen("game-screen");
        if (window.AudioMgr) AudioMgr.play(chosenRoute);
        Engine.run();
      }
    });
    if (window.AudioMgr) AudioMgr.play("prologue");
  };
})();
