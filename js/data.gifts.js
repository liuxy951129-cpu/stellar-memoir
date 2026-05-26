/* 礼物 & 邮件库 */
window.GIFTS = {
  coffee:        { name:"现冲咖啡", desc:"机器调制 · 慢工出细活", emoji:"☕", aff:{qianye:2, yunli:1, yin:1}, cost:30 },
  coffee_slow:   { name:"耐心慢冲咖啡", desc:"等了 15 分钟才煮好", emoji:"☕", aff:{qianye:3, yunli:1, yin:1}, cost:50 },
  coffee_brandy: { name:"白兰地咖啡", desc:"成年人的浪漫", emoji:"🥃", aff:{qianye:2, yunli:2, yin:2}, cost:60 },
  coffee_sweet:  { name:"加糖咖啡", desc:"糖能稳定脑波", emoji:"☕", aff:{qianye:1, yunli:2, yin:3}, cost:40 },
  flower:        { name:"全息花束", desc:"永不凋谢的安慰", emoji:"💐", aff:{qianye:2, yunli:3, yin:1}, cost:80 },
  snack:         { name:"夜宵小点心", desc:"星舰合成的甜品", emoji:"🍰", aff:{qianye:1, yunli:3, yin:0}, cost:40 },
  recorder:      { name:"录音笔", desc:"把每段哼唱留下", emoji:"🎙️", aff:{qianye:1, yunli:3, yin:1}, cost:120 },
  star_naming:   { name:"星辰命名权", desc:"给一颗星起 ta 的名字", emoji:"⭐", aff:{qianye:3, yunli:3, yin:3}, cost:300 },
  oil:           { name:"机械润滑油", desc:"机械义体专用", emoji:"🛢️", aff:{qianye:0, yunli:0, yin:3}, cost:60 },
  notebook:      { name:"手写笔记本", desc:"宇宙级稀缺品", emoji:"📓", aff:{qianye:3, yunli:1, yin:2}, cost:100 },
  music_box:     { name:"老式音乐盒", desc:"地球时代制造", emoji:"🎵", aff:{qianye:2, yunli:3, yin:3}, cost:180 },
  starmap:       { name:"星图项链", desc:"刻着银河旋臂", emoji:"📿", aff:{qianye:3, yunli:2, yin:2}, cost:200 }
};

window.SHOP_INDEX = ["coffee","coffee_slow","coffee_brandy","coffee_sweet","flower","snack","recorder","oil","notebook","music_box","starmap","star_naming"];

window.MAILS_POOL = [
  { id:"sys_welcome", role:"system", title:"修复师 · 入职欢迎", body:"欢迎加入「忘川号」记忆修复局。每位乘客都封存着一段故事，等你打开。\n\n你的体力每 30 分钟恢复 1 点（演示版每 60 秒）。\n每日任务可在「任务」页查看。" },
  { id:"sys_d1", role:"system", title:"日报 · Day 1", body:"星舰位于猎户臂边缘，距银心 28000 光年。\n今日有 3 位 VIP 乘客需修复：A-07（千夜）/ B-12（云璃）/ Y-01（银）。" },
  { id:"qy_mail1", role:"qianye", title:"千夜：物理小问题", body:"修复师。\n\n你今天进来时，呼吸频率 14/分。比标准慢 2。\n是因为遇到我而紧张吗？\n\n——千夜" },
  { id:"yl_mail1", role:"yunli", title:"云璃：偷偷告诉你", body:"修复师！我刚刚在走廊跳了一段，没人看~ \n下次你来，我跳给你看。带零食哦！\n\n——云璃 ♥" },
  { id:"yin_mail1", role:"yin", title:"银：今日校准报告", body:"机械心脏第 7392 小时运行正常。\n\n附：今日有 1 次异常波动。原因——你站在我面前的时候。\n\n——Y-01" },
  { id:"sys_d2", role:"system", title:"日报 · Day 2", body:"昨晚星舰穿越了银河三号尘埃带。能源储备 -3%。\n\n所有乘客睡眠质量良好。除了 A-07，她查了 17 次时间。" },
  { id:"sys_lover", role:"system", title:"周报 · 关系档案", body:"系统检测到你与至少一位乘客好感度突破 10。\n\n提示：好感度达到「心动」阶段后，可在抽卡中获得限定记忆碎片。" }
];

window.DAILY_TASKS = [
  { id:"d_talk", name:"与任一位 VIP 进行 1 段对话", reward:{coin:30}, target:1, key:"talkCount" },
  { id:"d_gift", name:"送出 1 份礼物", reward:{coin:40}, target:1, key:"giftCount" },
  { id:"d_mini", name:"完成 1 次角色小游戏", reward:{coin:50, diamond:1}, target:1, key:"miniCount" },
  { id:"d_mail", name:"查看 1 封新邮件", reward:{coin:20}, target:1, key:"mailReadCount" }
];

window.WEEKLY_TASKS = [
  { id:"w_route", name:"通关任意 1 条主线", reward:{coin:300, diamond:10}, target:1, key:"routeFinished" },
  { id:"w_cg", name:"解锁 6 张回忆 CG", reward:{coin:200, diamond:5}, target:6, key:"cgCount" },
  { id:"w_aff", name:"任一角色好感度达到 15", reward:{coin:250, diamond:6}, target:15, key:"maxAff" },
  { id:"w_mini", name:"完成 5 次角色小游戏", reward:{coin:200, diamond:4}, target:5, key:"miniCount" }
];

window.STAGE_NAMES = ["陌生", "熟悉", "心动", "深爱"];
