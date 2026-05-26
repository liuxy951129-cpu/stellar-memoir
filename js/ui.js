/* UI 通用 + 新页面渲染 v3 */
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
    if (Engine.save && Engine.save.currentRoute && document.getElementById("game-screen").classList.contains("active")){
      Engine.run();
    }
  },

  renderTopBar(save){
    // v3：title 内置
    const stamEl = document.getElementById("topStamina");
    const coinEl = document.getElementById("topCoin");
    const diaEl = document.getElementById("topDiamond");
    if (stamEl) stamEl.textContent = save.stamina;
    if (coinEl) coinEl.textContent = save.coin;
    if (diaEl) diaEl.textContent = save.diamond;
    const unread = save.mailbox.filter(m=>!save.mailRead[m.id]).length;
    const badge = document.getElementById("mailBadge");
    if (badge){
      badge.textContent = unread;
      badge.dataset.empty = unread === 0 ? "true" : "false";
    }
  },

  /* 圆形 HUD（剧情页） */
  renderRoundHUD(save){
    const route = save.currentRoute;
    if (!route) return;
    const aff = save.affinity[route] || 0;
    const stage = save.stages[route] || 0;
    const total = 13;
    const got = Object.keys(save.unlockedCG || {}).length;

    const numEl = document.getElementById("rhAffNum");
    const stageEl = document.getElementById("rhStage");
    const cgEl = document.getElementById("rhCgNum");
    if (numEl) numEl.textContent = aff;
    if (stageEl) stageEl.textContent = window.STAGE_NAMES[stage] || "陌生";
    if (cgEl) cgEl.textContent = `${got}/${total}`;

    const aPct = Math.max(0, Math.min(1, aff / 24));
    const aLen = 326.7;
    const aRing = document.getElementById("rhAffRing");
    if (aRing) aRing.setAttribute("stroke-dasharray", `${aPct * aLen} ${aLen}`);

    const cPct = Math.max(0, Math.min(1, got / total));
    const cLen = 251.3;
    const cRing = document.getElementById("rhCgRing");
    if (cRing) cRing.setAttribute("stroke-dasharray", `${cPct * cLen} ${cLen}`);
  },

  showAnomaly(text, ms = 2800){
    const el = document.getElementById("anomalyBanner");
    if (!el) return;
    el.querySelector(".ab-text").textContent = text;
    el.style.display = "flex";
    clearTimeout(el._tm);
    el._tm = setTimeout(()=> el.style.display = "none", ms);
  },

  renderAffinityMini(){ /* v3 已弃用 */ },

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
          <img src="assets/portraits/${r.id}.png" alt="${r.name}" />
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

    // 真结局线：3 条都通关后解锁
    const finCount = Object.keys(save.finishedRoutes||{}).filter(k=>['qianye','yunli','yin'].includes(k)).length;
    if (finCount >= 3 && !save.finishedRoutes.true){
      const card = document.createElement("div");
      card.className = "route-card";
      card.dataset.route = "true";
      card.style.cssText = "border:2px solid #ffd66b;box-shadow:0 0 30px rgba(255,214,107,.7);";
      card.innerHTML = `
        <div class="rc-bg" style="background:linear-gradient(135deg,#1a1547,#3a1f8f);"></div>
        <div class="rc-mask"></div>
        <div class="rc-badge" style="background:linear-gradient(135deg,#ffd66b,#ff77c8);color:#fff;">★ TRUE LINE</div>
        <div class="rc-info">
          <div class="rc-name">A-08</div>
          <div class="rc-en">The Last Patient</div>
          <div class="rc-tag">??? · 关于你自己的故事<br>仅在 3 线通关后开启</div>
        </div>
      `;
      el.appendChild(card);
    }
  },

  /* 邮件页 */
  renderMailbox(save){
    const list = document.getElementById("mailList");
    if (!list) return;
    list.innerHTML = "";
    if (!save.mailbox.length){
      list.innerHTML = `<div style="text-align:center;color:#aab1d6;padding:30px;">收件箱空空~</div>`;
      return;
    }
    const roleNames = { system:"星舰系统", qianye:"千夜", yunli:"云璃", yin:"银", unknown:"???", self:"过去的你" };
    save.mailbox.forEach(m=>{
      const read = save.mailRead[m.id];
      const card = document.createElement("div");
      card.className = "mail-card" + (read ? " read" : "");
      const isAnomaly = m.role === "unknown" || m.role === "self";
      if (isAnomaly) card.style.borderColor = "rgba(255,48,96,.55)";
      card.innerHTML = `
        <div class="mail-head">
          <span class="mail-from" style="${isAnomaly?'color:#ff77a8;':''}">${roleNames[m.role] || m.role}</span>
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
          body: `<div style="color:${isAnomaly?'#ff77a8':'#3ad6ff'};font-size:12px;letter-spacing:.2em;margin-bottom:10px;">来自：${roleNames[m.role] || m.role}</div><div style="white-space:pre-line;line-height:1.8;">${m.body}</div>`,
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
          UI.closeModal();
        });
      });
    }, 50);
  },

  renderProfile(save){
    const el = document.getElementById("profileWrap");
    if (!el) return;
    const revealed = save.flags && save.flags.player_revealed;
    const finCount = Object.keys(save.finishedRoutes||{}).filter(k=>['qianye','yunli','yin'].includes(k)).length;
    const cluesCount = save.flags ? Object.keys(save.flags).filter(k=>k.startsWith("clue_")).length : 0;
    const totalAff = Object.values(save.affinity||{}).reduce((a,b)=>a+b,0);
    el.innerHTML = `
      <div class="profile-portrait">
        <img src="${revealed ? 'assets/player/player_revealed.png' : 'assets/player/player_silhouette.png'}" alt="player">
      </div>
      <div class="profile-info">
        <h3>${revealed ? "你（A-08）" : "??? · 修复师"}</h3>
        <p>${revealed
          ? "你的真实身份在 3 线通关后揭示——你也是「忘川号」上的患者之一。"
          : "你叫不出自己的名字。系统给你的身份卡是「记忆修复师」。但每次照镜子都会有一瞬恍惚。"}</p>
        <div class="profile-row"><span>编号</span><span>${revealed ? "A-08" : "???"}</span></div>
        <div class="profile-row"><span>累计好感</span><span>${totalAff}</span></div>
        <div class="profile-row"><span>已通关主线</span><span>${finCount} / 3</span></div>
        <div class="profile-row"><span>已收集线索</span><span>${cluesCount}</span></div>
        <div class="profile-row"><span>解锁 CG</span><span>${Object.keys(save.unlockedCG||{}).length}</span></div>
      </div>
      ${cluesCount > 0 ? `
      <div class="profile-clue">
        <h4>★ 已发现的线索</h4>
        ${this._renderClueList(save)}
      </div>` : ""}
    `;
  },

  _renderClueList(save){
    const map = {
      clue_eyes: "千夜某次盯着你说：「你也戴过这副眼镜吧？」",
      clue_dance: "云璃哼的旋律和你脑海中「似曾相识」的曲子完全一样。",
      clue_yin_left_eye: "银说他左眼里那个一直在笑的女孩——脸轮廓是你。",
      clue_a08: "系统日报里出现了 A-08 的修复进度，但你并没有这位病人。",
      clue_self_mail: "你收到一封自己写给自己的信，落款 12 年前。",
      clue_mirror: "舱室镜子里的人，眼神和系统给你的身份照不一样。"
    };
    return Object.keys(save.flags||{}).filter(k=>k.startsWith("clue_"))
      .map(k => `<div style="margin:6px 0;">· ${map[k] || k}</div>`).join("");
  }
};
