/* 玩家暗线 · 异常事件系统
 * 触发条件：玩家完成 ≥ 1 条主线后开始累积 anomaly；第二线推进过程中显著触发
 * step 类型扩展：
 *   { type:"anomaly", text, clue?, mailFrom? }    // 触发异常 banner + 可能寄信 + 收线索
 */
window.Anomaly = {
  // 三线之间的暗线邮件（按时机注入）
  mails: {
    after_route1: [
      { id:"unk_1", role:"unknown", title:"???",
        body:"……\n\n你怎么会觉得自己是「修复师」？\n\n看看你左手腕的内侧——那里有个 12 年前的胶囊编号。\n\n——一个比你更了解你的人" }
    ],
    after_route2: [
      { id:"self_1", role:"self", title:"给未来的我",
        body:"如果你正在读这封信，说明你已经修复了至少两个人。\n\n忘川号上一共有 4 个 VIP 编号：A-07、B-12、Y-01，还有一个被涂掉了。\n\n那个被涂掉的，是你自己。\n\n——12 年前的你" },
      { id:"unk_2", role:"unknown", title:"星舰系统 · 安全告警",
        body:"修复师，你的工作日志中，A-07/B-12/Y-01 三人被胶囊存放年限均为 12 年。\n\n而你的入职时间是 6 个月前。\n\n你用了什么从星舰外部的「6 个月生命」，去修复 12 年的记忆？\n\n——这个问题，请你在第三线之后给我答案。" }
    ],
    after_route3: [
      { id:"self_final", role:"self", title:"星海拾遗 · 真相",
        body:"你已经把他们都修好了。轮到你了。\n\n请到「档案库」最深一层，找编号 A-08。\n\n那是你。\n\n——你自己" }
    ]
  },

  // 全局异常事件触发（在 engine 推进时检查）
  checkAndPushOnRouteFinish(save, routeId){
    save.flags = save.flags || {};
    const finishedNum = Object.keys(save.finishedRoutes||{}).filter(k=>['qianye','yunli','yin'].includes(k)).length;
    let pool = [];
    if (finishedNum === 1) pool = this.mails.after_route1;
    else if (finishedNum === 2) pool = this.mails.after_route2;
    else if (finishedNum === 3) pool = this.mails.after_route3;
    pool.forEach(m=>{
      if (!save.mailbox.find(x=>x.id===m.id)){
        save.mailbox.unshift({ ...m, ts: Date.now() });
      }
    });
  },

  // 在剧情中根据当前 route 注入"打破第四面墙"片段（B 节奏：第二线开始就明显）
  // 这里不修改 STORY 而是返回需要注入的 step
  shouldTriggerAnomaly(save, route, stepIdx){
    const finishedNum = Object.keys(save.finishedRoutes||{}).filter(k=>['qianye','yunli','yin'].includes(k)).length;
    // 在第二/三线的 day 2/3 开头插入异常
    return finishedNum >= 1; // 只要通关过 1 条，第二线就可能触发
  },

  showBanner(text){
    UI.showAnomaly(text);
  },

  recordClue(save, clueId){
    save.flags = save.flags || {};
    if (!save.flags[clueId]){
      save.flags[clueId] = true;
      UI.toast("✦ 发现新线索（可在「档案」中查看）");
    }
  }
};
