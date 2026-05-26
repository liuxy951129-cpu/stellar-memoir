/* 留存系统：体力、任务、邮件、送礼、关系阶段 */
window.Sys = {
  MAX_STAMINA: 30,
  STAMINA_INTERVAL_MS: 60 * 1000, // 演示版每分钟回 1
  STAMINA_PER_CHAPTER: 3,

  initSave(save){
    save.stamina = save.stamina ?? this.MAX_STAMINA;
    save.lastStaminaTs = save.lastStaminaTs ?? Date.now();
    save.gifts = save.gifts || {};   // {giftId: count}
    save.stages = save.stages || { qianye:0, yunli:0, yin:0 };
    save.mailbox = save.mailbox || [];
    save.mailRead = save.mailRead || {};
    save.dailyState = save.dailyState || { date: this.todayKey(), talkCount:0, giftCount:0, miniCount:0, mailReadCount:0, claimed:{} };
    save.weeklyState = save.weeklyState || { week: this.weekKey(), routeFinished:0, cgCount:0, maxAff:0, miniCount:0, claimed:{} };
    // 入职邮件
    if (!save.mailbox.length){
      this.pushMail(save, "sys_welcome");
      this.pushMail(save, "sys_d1");
    }
  },

  todayKey(){
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  },
  weekKey(){
    const d = new Date();
    const onejan = new Date(d.getFullYear(),0,1);
    const week = Math.ceil((((d - onejan)/86400000) + onejan.getDay()+1)/7);
    return `${d.getFullYear()}-W${week}`;
  },

  tickStamina(save){
    const now = Date.now();
    const diff = now - (save.lastStaminaTs || now);
    const gained = Math.floor(diff / this.STAMINA_INTERVAL_MS);
    if (gained > 0){
      save.stamina = Math.min(this.MAX_STAMINA, (save.stamina||0) + gained);
      save.lastStaminaTs = (save.lastStaminaTs||now) + gained * this.STAMINA_INTERVAL_MS;
    }
    // 检查日 / 周 切换
    if (save.dailyState?.date !== this.todayKey()){
      save.dailyState = { date: this.todayKey(), talkCount:0, giftCount:0, miniCount:0, mailReadCount:0, claimed:{} };
      // 每日登录奖励
      save.coin += 100;
      save.diamond += 2;
      this.pushMail(save, "sys_d2");
      UI.toast("每日登录奖励 · 星币 +100 · 钻石 +2");
    }
    if (save.weeklyState?.week !== this.weekKey()){
      save.weeklyState = { week: this.weekKey(), routeFinished:0, cgCount:0, maxAff:0, miniCount:0, claimed:{} };
    }
  },

  consumeStamina(save, n){
    // v7.5: 已去掉体力限制，保留 UI 显示，永远返回 true
    return true;
  },

  pushMail(save, id){
    if (save.mailbox.find(m => m.id === id)) return;
    const m = (window.MAILS_POOL || []).find(x => x.id === id);
    if (!m) return;
    save.mailbox.unshift({ id:m.id, title:m.title, role:m.role, body:m.body, ts:Date.now() });
  },

  readMail(save, id){
    if (save.mailRead[id]) return;
    save.mailRead[id] = true;
    save.dailyState.mailReadCount = (save.dailyState.mailReadCount || 0) + 1;
  },

  upStage(save, role, n=1){
    save.stages[role] = Math.min(3, (save.stages[role]||0) + n);
    UI.toast(`关系阶段 → ${window.STAGE_NAMES[save.stages[role]]}`);
  },

  giveGift(save, role, giftId){
    const g = window.GIFTS[giftId];
    if (!g) return false;
    if (save.coin < g.cost){ UI.toast("星币不足"); return false; }
    save.coin -= g.cost;
    save.affinity[role] = (save.affinity[role] || 0) + (g.aff[role] || 0);
    save.gifts[giftId] = (save.gifts[giftId] || 0) + 1;
    save.dailyState.giftCount = (save.dailyState.giftCount || 0) + 1;
    save.weeklyState.maxAff = Math.max(save.weeklyState.maxAff || 0, save.affinity[role]);
    // 触发阶段升级
    const newStage = Math.min(3, Math.floor((save.affinity[role] || 0) / 8));
    if (newStage > (save.stages[role] || 0)){
      save.stages[role] = newStage;
      UI.toast(`关系升级：${window.STAGE_NAMES[newStage]} ❤`);
    }
    UI.toast(`送出 ${g.name} · ${role} 好感 +${g.aff[role]||0}`);
    return true;
  },

  countTask(save, key, inc=1){
    save.dailyState[key] = (save.dailyState[key] || 0) + inc;
    save.weeklyState[key] = (save.weeklyState[key] || 0) + inc;
    if (key === "maxAff" && save.affinity){
      save.weeklyState.maxAff = Math.max(save.weeklyState.maxAff || 0, ...Object.values(save.affinity));
    }
  },

  claimTask(save, taskId, kind="daily"){
    const list = kind === "daily" ? window.DAILY_TASKS : window.WEEKLY_TASKS;
    const t = list.find(x=>x.id===taskId);
    if (!t) return;
    const state = kind === "daily" ? save.dailyState : save.weeklyState;
    if (state.claimed[taskId]) return UI.toast("已领取");
    const cur = state[t.key] || 0;
    if (cur < t.target) return UI.toast(`未完成 (${cur}/${t.target})`);
    state.claimed[taskId] = true;
    if (t.reward.coin) save.coin += t.reward.coin;
    if (t.reward.diamond) save.diamond += t.reward.diamond;
    UI.toast(`领取：星币 +${t.reward.coin||0}${t.reward.diamond?` · 钻石 +${t.reward.diamond}`:""}`);
  }
};
