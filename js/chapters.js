/* 章节选择 / 已读管理 / 跨线继承 */
window.Chapters = {
  /* 收集 STORY[route] 中所有 chapter step 的 index 与名字 */
  list(route){
    const story = (window.STORY || {})[route] || [];
    const arr = [];
    for (let i = 0; i < story.length; i++){
      if (story[i].type === "chapter"){
        arr.push({ idx:i, name: story[i].name, en: story[i].en, day: story[i].day });
      }
    }
    return arr;
  },

  hasRead(save, route, chapterIdx){
    return !!(save.chapterRead && save.chapterRead[route] && save.chapterRead[route][chapterIdx]);
  },

  markRead(save, route, chapterIdx){
    save.chapterRead = save.chapterRead || {};
    save.chapterRead[route] = save.chapterRead[route] || {};
    save.chapterRead[route][chapterIdx] = true;
  },

  unlock(save, route, chapterIdx){
    // 已通关该 route 后所有章节默认解锁；否则解锁已读 + 第一个未读
    const finished = save.finishedRoutes && save.finishedRoutes[route];
    if (finished) return true;
    if (this.hasRead(save, route, chapterIdx)) return true;
    // 找第一个未解锁的
    const list = this.list(route);
    for (const c of list){
      if (!this.hasRead(save, route, c.idx)) return c.idx === chapterIdx;
    }
    return true;
  },

  showPanel(save, route){
    const exists = document.getElementById("chPanel");
    if (exists) exists.remove();
    const panel = document.createElement("div");
    panel.id = "chPanel";
    panel.className = "chapter-panel active";
    const list = this.list(route);
    panel.innerHTML = `
      <div class="chapter-panel-card">
        <h3>章节选择 · ${({qianye:"千夜",yunli:"云璃",yin:"银","true":"真结局"})[route]||route}</h3>
        <div class="chapter-list">
          ${list.map((c, i) => {
            const r = this.hasRead(save, route, c.idx);
            const u = this.unlock(save, route, c.idx);
            return `<div class="chapter-row ${r?'read':''} ${u?'':'locked'}" data-idx="${c.idx}">
              <div>
                <div class="ch-name">${c.name}</div>
                <div class="ch-tag">Day ${c.day || 1} · ${c.en || ''}</div>
              </div>
            </div>`;
          }).join("")}
        </div>
        <div class="chapter-panel-foot">
          <button class="btn-ghost" id="chClose">关闭</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelectorAll(".chapter-row").forEach(row => {
      if (row.classList.contains("locked")) return;
      row.addEventListener("click", () => {
        const idx = +row.dataset.idx;
        save.stepIndex = idx;
        save.currentRoute = route;
        Save.store(save);
        panel.remove();
        Engine.run();
      });
    });
    panel.querySelector("#chClose").addEventListener("click", () => panel.remove());
  },

  /* 跨线继承：返回当前线开头时，根据其他线已通关情况返回额外的 prefix steps */
  // 返回 step 数组（被插到 STORY[route] 起始之前，逻辑上）。具体由 engine 调用。
  prefixForRoute(save, route){
    const fin = save.finishedRoutes || {};
    const prefix = [];
    if (route === "qianye"){
      if (fin.yunli){
        prefix.push(
          { type:"narr", scene:"deck", text:"（你脑海里隐约响起一段旋律——是云璃哼过的那首。但这是你和千夜的第一面。）" }
        );
      }
      if (fin.yin){
        prefix.push(
          { type:"narr", scene:"deck", text:"（在你伸手扶住胶囊舱壁的瞬间，你听见自己心跳里有金属的回响。像银的心脏。）" }
        );
      }
    }
    if (route === "yunli"){
      if (fin.qianye){
        prefix.push(
          { type:"narr", scene:"corridor", text:"（千夜白天提过她有个妹妹。你知道这意味着什么——但还不确定。）" }
        );
      }
      if (fin.yin){
        prefix.push(
          { type:"narr", scene:"corridor", text:"（你忽然能看清她舞步里的「重心提前 0.3 秒」——这是只有银的金色机械瞳孔教过你的事。）" }
        );
      }
    }
    if (route === "yin"){
      if (fin.qianye){
        prefix.push(
          { type:"narr", scene:"corridor", text:"（千夜的眼神，和他的金色瞳孔，重叠了一瞬。你知道这不是巧合。）" }
        );
      }
      if (fin.yunli){
        prefix.push(
          { type:"narr", scene:"corridor", text:"（云璃临走前提过：星舰里还有一个等你的人。你现在知道是谁了。）" }
        );
      }
    }
    return prefix;
  },

  /* 检查是否触发跨线分支选项 */
  crossOptionFor(save, flag){
    // engine.js 在 renderChoice 时可调用，用来注入额外选项
    return null;
  }
};
