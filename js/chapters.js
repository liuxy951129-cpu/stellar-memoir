/* ============= 章节面板 v5 · 树状视图 ·  防剧透 ============= */
window.Chapters = {
  list(route){
    const story = (window.STORY || {})[route] || [];
    const arr = [];
    let curChapterIdx = -1;
    let curHasImportant = false;
    for (let i = 0; i < story.length; i++){
      if (story[i].type === "chapter"){
        if (curChapterIdx >= 0){
          arr[arr.length - 1].hasImportant = curHasImportant;
        }
        curChapterIdx = i;
        curHasImportant = false;
        arr.push({
          idx:i,
          name: story[i].name,
          en: story[i].en,
          day: story[i].day || 1,
          hidden: (story[i].name||"").indexOf("隐藏") >= 0,
          hasImportant: false
        });
      } else if (story[i].important){
        curHasImportant = true;
      }
    }
    if (arr.length){
      arr[arr.length - 1].hasImportant = curHasImportant;
    }
    return arr;
  },

  hasKeyMemory(save, route, chapterIdx){
    return !!(save.keyMemory && save.keyMemory[route] && save.keyMemory[route][chapterIdx]);
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
    const finished = save.finishedRoutes && save.finishedRoutes[route];
    if (finished) return true;
    if (this.hasRead(save, route, chapterIdx)) return true;
    const list = this.list(route);
    for (const c of list){
      if (!this.hasRead(save, route, c.idx)) return c.idx === chapterIdx;
    }
    return true;
  },

  /* 当前章节（剧情进度所在章节） */
  currentChapterIdx(save, route){
    const list = this.list(route);
    const stepIdx = save.stepIndex || 0;
    let curr = -1;
    for (const c of list){
      if (c.idx <= stepIdx) curr = c.idx;
    }
    return curr;
  },

  /* 进度百分比 */
  progress(save, route){
    const list = this.list(route);
    if (!list.length) return 0;
    const read = list.filter(c => this.hasRead(save, route, c.idx)).length;
    return Math.round(read / list.length * 100);
  },

  /* 防剧透：未读用问号；隐藏章一律 ??? 直到解锁；普通章只隐藏「名字」保留「Day X · Ch.X」前缀 */
  displayName(c, isRead, isUnlocked){
    if (isRead) return c.name;
    if (!isUnlocked) {
      if (c.hidden) return "？？？";
      // 给个序号但不剧透名字
      const en = (c.en || "").split("·")[0].trim();
      return en ? en + " · ？？？" : "？？？";
    }
    // 已解锁未读：可点但仍不暴露名字
    if (c.hidden) return "？？？（已解锁）";
    const en = (c.en || "").split("·")[0].trim();
    return (en ? en + " · " : "") + "？？？（已解锁）";
  },

  showPanel(save, route){
    const exists = document.getElementById("chPanel");
    if (exists) exists.remove();

    const list = this.list(route);
    const currIdx = this.currentChapterIdx(save, route);
    const prog = this.progress(save, route);
    const routeName = ({qianye:"千夜",yunli:"云璃",yin:"音","true":"真结局"})[route] || route;

    /* 按 Day 分组 */
    const byDay = {};
    for (const c of list){
      const d = c.day || 1;
      (byDay[d] = byDay[d] || []).push(c);
    }
    const days = Object.keys(byDay).sort((a,b) => +a - +b);

    const panel = document.createElement("div");
    panel.id = "chPanel";
    panel.className = "chapter-panel tree-mode active";

    let html = `
      <div class="tree-card">
        <h3>章节剧情树 · ${routeName}线</h3>
        <div class="tree-sub">未触发的剧情以「？」隐藏 · 防剧透</div>

        <div class="tree-progress">
          <div class="tree-progress-bar" style="width:${prog}%"></div>
        </div>
        <div class="tree-progress-text">${prog}% · 已读 ${list.filter(c=>this.hasRead(save,route,c.idx)).length} / ${list.length}</div>

        <div class="tree-legend">
          <span class="leg-read"><i></i> 已读</span>
          <span class="leg-cur"><i></i> 当前</span>
          <span class="leg-lock"><i></i> 未解锁</span>
        </div>

        <div class="tree-container">
    `;

    let nodeNo = 0;
    for (const d of days){
      const dayChapters = byDay[d];
      html += `<div class="tree-day">
        <div class="tree-day-label">Day ${d}</div>`;
      for (const c of dayChapters){
        nodeNo++;
        const isRead = this.hasRead(save, route, c.idx);
        const isUnlocked = this.unlock(save, route, c.idx);
        const isCurrent = c.idx === currIdx && !isRead;
        const missingKey = isRead && c.hasImportant && !this.hasKeyMemory(save, route, c.idx);
        const cls = [
          isRead ? "read" : "",
          isCurrent ? "current" : "",
          (!isRead && !isUnlocked) ? "locked" : "",
          c.hidden ? "hidden-ch" : "",
          missingKey ? "missing-key" : ""
        ].filter(Boolean).join(" ");
        const displayN = this.displayName(c, isRead, isUnlocked);
        const displayTag = isRead ? (c.en || "") :
                          (isUnlocked ? "可进入 · 点击开始" : "待解锁");
        html += `<div class="tree-row ${cls}" data-idx="${c.idx}">
          <div class="tree-node">${nodeNo}</div>
          <div class="tree-card-body">
            <div class="tree-name">${displayN}</div>
            <div class="tree-tag">${displayTag}</div>
          </div>
        </div>`;
      }
      html += `</div>`;
    }

    html += `
        </div>
        <button class="tree-close" id="chClose">关 闭</button>
      </div>
    `;

    panel.innerHTML = html;
    document.body.appendChild(panel);

    panel.querySelectorAll(".tree-row").forEach(row => {
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
    /* 点击空白处关闭 */
    panel.addEventListener("click", e => {
      if (e.target === panel) panel.remove();
    });
  },

  /* 跨线继承前缀（保留 v4 逻辑） */
  prefixForRoute(save, route){
    const fin = save.finishedRoutes || {};
    const prefix = [];
    if (route === "qianye"){
      if (fin.yunli){
        prefix.push({ type:"narr", scene:"deck", text:"〔记忆回响〕你曾在另一段时间线上修复过云璃，那个倔强的工程师姑娘的笑容仍在你心底留有微光。" });
      }
      if (fin.yin){
        prefix.push({ type:"narr", scene:"deck", text:"〔记忆回响〕你曾与档案守护者音同行，那座深夜的图书馆里，她沉静的目光至今难忘。" });
      }
    }
    if (route === "yunli"){
      if (fin.qianye){
        prefix.push({ type:"narr", scene:"corridor", text:"〔记忆回响〕在一条早已闭合的时间线上，你与一位银发上尉立下过誓言。" });
      }
      if (fin.yin){
        prefix.push({ type:"narr", scene:"corridor", text:"〔记忆回响〕档案守护者的低语像潮水般退去，但她递来的那张星图仍在你梦里。" });
      }
    }
    if (route === "yin"){
      if (fin.qianye){
        prefix.push({ type:"narr", scene:"archive", text:"〔记忆回响〕你曾经爱过一个把所有事物都精确到小数点后两位的女人。" });
      }
      if (fin.yunli){
        prefix.push({ type:"narr", scene:"archive", text:"〔记忆回响〕扳手敲击合金的声响在记忆深处仍然清亮。" });
      }
    }
    return prefix;
  }
};
