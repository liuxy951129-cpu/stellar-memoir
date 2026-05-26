/* ============= v7 修复进度详情模态 =============
 * 点击右上角"修复 N%" → 弹出当前支线已修复的记忆清单
 * 区别于章节树（推进 UI）：这里是"成果展示"
 * ============================================== */
window.Repair = {

  /* 章节关键记忆摘要：以章节 idx → 摘要字符串
   * 取该章节第一条 important: true 的对白文本作为"记忆碎片"
   */
  collectMemories(route){
    const story = (window.STORY || {})[route] || [];
    const arr = [];
    let curChapterIdx = -1;
    let curChapter = null;
    for (let i = 0; i < story.length; i++){
      const s = story[i];
      if (s.type === "chapter"){
        if (curChapter) arr.push(curChapter);
        curChapterIdx = i;
        curChapter = {
          idx: i,
          name: s.name,
          en: s.en,
          day: s.day || 1,
          hidden: (s.name||"").indexOf("隐藏") >= 0,
          keyMemory: null
        };
      } else if (s.important && curChapter && !curChapter.keyMemory){
        curChapter.keyMemory = s.text;
      }
    }
    if (curChapter) arr.push(curChapter);
    return arr;
  },

  show(save){
    const route = save.currentRoute;
    if (!route){ UI.toast && UI.toast("先开始一条支线吧"); return; }

    const old = document.getElementById("repairPanel");
    if (old) old.remove();

    const list = this.collectMemories(route);
    const km = (save.keyMemory && save.keyMemory[route]) || {};
    const totalCh = list.length || 1;
    const readCh = list.filter(c => Chapters.hasRead(save, route, c.idx)).length;
    const keyGot = Object.keys(km).length;
    const repPct = Math.min(100, Math.round((readCh / totalCh) * 70 + (keyGot / totalCh) * 30));
    const routeName = ({qianye:"千夜",yunli:"云璃",yin:"音","true":"真结局"})[route] || route;

    const panel = document.createElement("div");
    panel.id = "repairPanel";
    panel.className = "repair-panel";

    let listHtml = "";
    for (const c of list){
      const isRead = Chapters.hasRead(save, route, c.idx);
      const hasKey = !!km[c.idx];
      const cls = [hasKey ? "key" : "", isRead ? "" : "empty"].filter(Boolean).join(" ");
      let mem = "";
      if (!isRead){
        mem = `<div class="rp-mem locked">尚未抵达</div>`;
      } else if (hasKey && c.keyMemory){
        mem = `<div class="rp-mem">「${this._esc(c.keyMemory)}」</div>`;
      } else if (c.keyMemory){
        mem = `<div class="rp-mem locked">这段对话曾经过去，但你没有抓住它的关键</div>`;
      } else {
        mem = `<div class="rp-mem">已读完。这一章没有关键记忆需要拾取。</div>`;
      }
      listHtml += `<div class="rp-row ${cls}">
        <div class="rp-icon">${hasKey ? "★" : (isRead ? "✓" : "—")}</div>
        <div class="rp-info">
          <div class="rp-name">${this._esc(c.name)}</div>
          ${mem}
        </div>
      </div>`;
    }

    panel.innerHTML = `
      <div class="rp-card">
        <h3>修复档案 · ${this._esc(routeName)}</h3>
        <div class="rp-sub">Repair Log · ${this._esc(route.toUpperCase())}</div>
        <div class="rp-stat">
          <div class="rp-stat-item"><b>${repPct}%</b><span>修复度</span></div>
          <div class="rp-stat-item"><b>${readCh}/${totalCh}</b><span>章节</span></div>
          <div class="rp-stat-item"><b>${keyGot}</b><span>关键记忆</span></div>
        </div>
        <div class="rp-list">${listHtml}</div>
        <button class="rp-close" id="rpClose">关 闭</button>
      </div>
    `;
    document.body.appendChild(panel);
    panel.addEventListener("click", e => { if (e.target === panel) panel.remove(); });
    panel.querySelector("#rpClose").addEventListener("click", () => panel.remove());
  },

  _esc(s){
    return String(s||"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
  }
};
