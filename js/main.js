/* 入口 */
(function(){
  let save = Save.load() || Save.defaults();
  let settings = Save.loadSettings();
  Engine.init(save, settings);

  // 渲染初始 UI
  UI.renderRouteCards("routeCards", save);
  Gallery.render(save);
  Gacha.render(save);

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

    if (!action) return;

    switch(action){
      case "start-new":
        save = Save.defaults();
        Engine.init(save, settings);
        UI.renderRouteCards("routeCards", save);
        UI.switchScreen("route-select");
        break;
      case "continue":
        if (!save.currentRoute){ UI.toast("还没有进行中的故事"); return; }
        Engine.resume();
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
      case "to-title":
        UI.switchScreen("title-screen");
        break;

      case "menu":
        UI.modal({
          title:"菜单",
          body:"<p>返回标题页将保留当前进度，可随时继续。</p>",
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
          UI.toast(`抽到：${got[0].rk} · ${got[0].name}`);
        }
        break;
      }
      case "gacha-10":{
        const got = Gacha.doPull(10, save);
        if (got){
          Gacha.renderResult(got);
          Gacha.render(save);
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
            UI.closeModal();
            UI.toast("已到账");
          }
        });
        break;

      case "reset-save":
        UI.modal({
          title:"确认清空？",
          body:"<p>所有剧情进度、相册、抽卡历史都会被重置。</p>",
          onOk:()=>{
            Save.clear();
            save = Save.defaults();
            Engine.init(save, settings);
            UI.renderRouteCards("routeCards", save);
            Gallery.render(save);
            Gacha.render(save);
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

  // 初始好感度条
  UI.renderAffinityMini(save.affinity);
})();
