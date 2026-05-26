/* UI 通用 + 新页面渲染 */
window.UI = {
  switchScreen(id){
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("active");
  },

  toast(msg){
    let t = document.querySelector(".toast");
    if (!t){
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tm);
    t._tm = setTimeout(()=>t.classList.remove("show"), 2200);
  },

  modal({title, body, onOk, onCancel}){
    const m = document.getElementById("modal");
    document.getElementById("modalTitle").textContent = title || "";
    document.getElementById("modalBody").innerHTML = body || "";
    m.classList.add("active");
    m._onOk = onOk;
    m._onCancel = onCancel;
  },

  closeModal(){
    document.getElementById("modal").classList.remove("active");
  },

  showCG(role, title, scene, img){
    const v = document.getElementById("cgViewer");
    const inner = document.getElementById("cgInner");
    const imgUrl = img ? Scene.cgImage(img) : `assets/portraits/${role}.png`;
    inner.style.background = "#000";
    inner.innerHTML = `
      <img src="${imgUrl}" alt="${title}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';" />
      <div style="position:absolute;left:0;right:0;bottom:0;padding:20px;background:linear-gradient(0deg,rgba(0,0,0,.85),transparent);text-align:center;">
        <div style="font-size:11px;letter-spacing:.4em;color:#3ad6ff;margin-bottom:6px;">MEMORY · UNLOCKED</div>
        <div style="font-size:22px;letter-spacing:.25em;color:#fff;font-weight:700;text-shadow:0 0 14px rgba(255,119,200,.7);">${title}</div>
      </div>
    `;
    v.classList.add("active");
  },

  closeCG(){
    document.getElementById("cgViewer").classList.remove("active");
    // 关闭 CG 后继续推进剧情
    if (Engine.save && Engine.save.currentRoute && document.getElementById("game-screen").classList.contains("active")){
      Engine.run();
    }
  },

  renderTopBar(save){
    const stamEl = document.getElementById("topStamina");
    const coinEl = document.getElementById("topCoin");
    const diaEl = document.getElementById("topDiamond");
    if (stamEl) stamEl.textContent = `${save.stamina}/${Sys.MAX_STAMINA}`;
    if (coinEl) coinEl.textContent = save.coin;
    if (diaEl) diaEl.textContent = save.diamond;
    // 邮件红点
    const unreadCount = save.mailbox.filter(m=>!save.mailRead[m.id]).length;
    const badge = document.getElementById("mailBadge");
    if (badge){
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }
  },

  renderAffinityMini(aff){
    const el = document.getElementById("affinityMini");
    if (!el) return;
    const map = {qianye:"千夜", yunli:"云璃", yin:"银"};
    el.innerHTML = Object.keys(map).map(id=>{
      const v = Math.max(0, Math.min(100, (aff[id]||0)*5 + 10));
      return `<div class="aff-row"><span class="aff-name">${map[id]}</span><div class="aff-bar"><i style="width:${v}%"></i></div></div>`;
    }).join("");
  },

  renderRouteCards(elId, save){
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = "";
    (window.ROUTES || []).forEach(r => {
      const finished = save.finishedRoutes && save.finishedRoutes[r.id];
      const stage = (save.stages && save.stages[r.id]) || 0;
      const card = document.createElement("div");
      card.className = "route-card";
      card.dataset.route = r.id;
      card.innerHTML = `
        <div class="rc-bg" style="background:#0a0d28;">
          <img src="assets/portraits/${r.id}.png" alt="${r.name}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;" />
        </div>
        <div class="rc-mask"></div>
        <div class="rc-badge">${r.badge}${finished ? " · 已通关" : ""}</div>
        <div class="rc-stage">${window.STAGE_NAMES[stage]}</div>
        <div class="rc-info">
          <div class="rc-name">${r.name}</div>
          <div class="rc-en">${r.en}</div>
          <div class="rc-tag">${r.title}<br>${r.tag}</div>
        </div>
      `;
      el.appendChild(card);
    });
  },

  /* ----------- 邮件页 ----------- */
  renderMailbox(save){
    const list = document.getElementById("mailList");
    if (!list) return;
    list.innerHTML = "";
    if (!save.mailbox.length){
      list.innerHTML = `<div style="text-align:center;color:#aab1d6;padding:30px;">收件箱空空~</div>`;
      return;
    }
    const roleNames = { system:"星舰系统", qianye:"千夜", yunli:"云璃", yin:"银" };
    save.mailbox.forEach(m=>{
      const read = save.mailRead[m.id];
      const card = document.createElement("div");
      card.className = "mail-card" + (read ? " read" : "");
      card.innerHTML = `
        <div class="mail-head">
          <span class="mail-from">${roleNames[m.role] || m.role}</span>
          ${read ? "" : '<span class="mail-dot"></span>'}
        </div>
        <div class="mail-title">${m.title}</div>
        <div class="mail-snippet">${m.body.replace(/\n/g,' ').slice(0,60)}...</div>
      `;
      card.addEventListener("click", ()=>{
        Sys.readMail(save, m.id);
        Save.store(save);
        UI.modal({
          title: m.title,
          body: `<div style="color:#3ad6ff;font-size:12px;letter-spacing:.2em;margin-bottom:10px;">来自：${roleNames[m.role] || m.role}</div><div style="white-space:pre-line;line-height:1.8;">${m.body}</div>`,
          onOk: ()=>{
            UI.closeModal();
            UI.renderMailbox(save);
            UI.renderTopBar(save);
          }
        });
      });
      list.appendChild(card);
    });
  },

  /* ----------- 任务页 ----------- */
  renderTasks(save){
    const el = document.getElementById("taskList");
    if (!el) return;
    el.innerHTML = "";
    const sec = (title, list, state, kind)=>{
      const sec = document.createElement("div");
      sec.innerHTML = `<h3 style="font-size:14px;letter-spacing:.25em;color:#a99dff;margin:18px 0 10px;">${title}</h3>`;
      list.forEach(t=>{
        const cur = state[t.key] || 0;
        const done = cur >= t.target;
        const claimed = state.claimed && state.claimed[t.id];
        const card = document.createElement("div");
        card.className = "task-card";
        card.innerHTML = `
          <div class="task-l">
            <div class="task-name">${t.name}</div>
            <div class="task-prog">进度 ${Math.min(cur,t.target)} / ${t.target}</div>
          </div>
          <div class="task-r">
            <div class="task-reward">星币 +${t.reward.coin||0}${t.reward.diamond?` · 钻石 +${t.reward.diamond}`:""}</div>
            <button class="btn-${claimed?"ghost":"primary"} task-claim" data-task="${t.id}" data-kind="${kind}" ${claimed?"disabled":""} style="padding:6px 14px;font-size:11px;letter-spacing:.15em;${claimed?"opacity:.5;":""}">${claimed?"已领取":(done?"领取":"未完成")}</button>
          </div>
        `;
        sec.appendChild(card);
      });
      el.appendChild(sec);
    };
    sec("每日任务", window.DAILY_TASKS, save.dailyState, "daily");
    sec("每周任务", window.WEEKLY_TASKS, save.weeklyState, "weekly");
  },

  /* ----------- 商店页 ----------- */
  renderShop(save){
    const el = document.getElementById("shopList");
    if (!el) return;
    el.innerHTML = "";
    window.SHOP_INDEX.forEach(gid=>{
      const g = window.GIFTS[gid];
      const card = document.createElement("div");
      card.className = "shop-card";
      card.innerHTML = `
        <div class="shop-emoji">${g.emoji}</div>
        <div class="shop-name">${g.name}</div>
        <div class="shop-desc">${g.desc}</div>
        <div class="shop-aff">千夜+${g.aff.qianye||0} · 云璃+${g.aff.yunli||0} · 银+${g.aff.yin||0}</div>
        <div class="shop-buy">
          <span class="shop-cost">★ ${g.cost}</span>
          <button class="btn-primary shop-send" data-gid="${gid}" style="padding:6px 12px;font-size:11px;letter-spacing:.15em;">送出</button>
        </div>
      `;
      el.appendChild(card);
    });
  },

  /* 选择送给谁 */
  showGiftReceiver(save, giftId){
    UI.modal({
      title: `送出：${window.GIFTS[giftId].name}`,
      body: `<div style="display:flex;gap:8px;justify-content:center;margin-top:8px;">
        <button class="btn-ghost g-recv" data-r="qianye" style="padding:10px 14px;">千夜</button>
        <button class="btn-ghost g-recv" data-r="yunli" style="padding:10px 14px;">云璃</button>
        <button class="btn-ghost g-recv" data-r="yin" style="padding:10px 14px;">银</button>
      </div>`,
      onOk: ()=> UI.closeModal()
    });
    setTimeout(()=>{
      document.querySelectorAll(".g-recv").forEach(b=>{
        b.addEventListener("click", ()=>{
          Sys.giveGift(save, b.dataset.r, giftId);
          UI.renderTopBar(save);
          UI.renderAffinityMini(save.affinity);
          UI.closeModal();
        });
      });
    }, 50);
  }
};
