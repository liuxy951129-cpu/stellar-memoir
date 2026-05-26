/* ============ v7.2 抽卡池：番外/信件/服装 三类 ============
 * cat:
 *   "episode" = 番外小剧场（短文本）
 *   "letter"  = 角色信件（拟手写）
 *   "outfit"  = 角色服装（占位，未来 v8 切换立绘）
 * ================================================ */
window.GACHA_POOL = [
  /* ============ SSR (6%) ============ */
  // 番外小剧场
  { id:"ep_q_starlight", rk:"SSR", cat:"episode", role:"qianye", name:"番外 · 星光下的早茶",
    desc:"千夜带你看 12 年前她研究室窗外的那颗星",
    body:"清晨 6:12 — 千夜难得没穿制服。她端着两杯热可可走进观景舱。\n\n「修复师，过来。今天的角度，能看见我以前研究室窗外那颗星。」\n「12 年了，它的位置没变。」\n「你看，越是会发光的东西，越懒得移动。」\n\n你坐在她旁边，杯子里冒出一点桂花的香。", w:1, color:"#a99dff" },
  { id:"ep_y_workshop", rk:"SSR", cat:"episode", role:"yunli", name:"番外 · 三号扳手的故事",
    desc:"云璃讲她最舍不得换掉的那把扳手",
    body:"工坊深夜 23:40 — 云璃举着一把刻痕斑斑的扳手。\n\n「这把三号是我十六岁时拼出来的第一把。」\n「我爸说工具是机械师的另一只手——所以我从没让别人碰过它。」\n「但你可以摸一下。」\n\n冷金属在你手心，很重，但奇异地温暖。", w:1, color:"#ff77c8" },
  { id:"ep_yin_archive", rk:"SSR", cat:"episode", role:"yin", name:"番外 · 档案库的夜",
    desc:"音独自整理一份从未公开的旧档案",
    body:"音的档案库 02:33 — 灯光昏黄。他翻开一份编号为 X-00 的灰色文件夹。\n\n「这是我自己的档案。」\n「修复师从不修复修复师——但我有时候，会自己翻给自己看。」\n「你想看一页吗？只一页。」\n\n他递过来的那页，纸角微微泛黄。", w:1, color:"#3ad6ff" },

  // 信件
  { id:"lt_q_morning", rk:"SSR", cat:"letter", role:"qianye", name:"信件 · 千夜致修复师",
    desc:"早安信 · 折叠成纸船的形状",
    body:"修复师，\n\n早安。\n\n今天我醒得比往常早 12 分钟。\n胶囊舱外面的灯光蓝得像窗。\n你来的时候，请把窗子也带来一点——\n虽然你不知道我说的窗是什么样的。\n\n  ——千夜", w:1, color:"#a99dff" },
  { id:"lt_y_thanks", rk:"SSR", cat:"letter", role:"yunli", name:"信件 · 云璃的便签",
    desc:"贴在工具箱内侧的小纸条",
    body:"喂！修复师！\n\n上次你帮我递扳手的那一下——\n我看见你手指比我以为的稳。\n以后我修发动机你来打副手吧（？）\n\n（这张纸条贴在工具箱里 是因为我怕直接给你太肉麻）\n\n  ——云璃 ★", w:1, color:"#ff77c8" },
  { id:"lt_yin_chess", rk:"SSR", cat:"letter", role:"yin", name:"信件 · 音的回函",
    desc:"手写于深色信纸",
    body:"致修复师：\n\n你上次问的那一局棋——\n答案是「七步必胜」。\n\n但请你别太早算到 7 步，\n人生有些棋，要慢一点才好看。\n\n——音", w:1, color:"#3ad6ff" },

  // 服装（占位 · 未来切换立绘）
  { id:"out_q_starnight", rk:"SSR", cat:"outfit", role:"qianye", name:"服装 · 星夜礼服",
    desc:"千夜专属 · 深蓝长裙 + 银色星尘披肩",
    body:"千夜换上了一件深蓝丝绒长裙，肩上是一层薄薄的银色星尘披肩。\n\n她说：「这是我 12 年前最爱的一件，没机会穿出去。」\n「今天破例。」\n\n（已收藏到衣橱 · 后续版本支持穿戴）", w:0.5, color:"#ffd9ee" },
  { id:"out_y_mech", rk:"SSR", cat:"outfit", role:"yunli", name:"服装 · 机能赛装",
    desc:"云璃专属 · 橘黑赛车机能服",
    body:"云璃换上了赛车机能服。橘黑相间，腰间还挂着 3 把扳手。\n\n「下次让你坐副驾。开稳点。」\n\n（已收藏到衣橱 · 后续版本支持穿戴）", w:0.5, color:"#ff77c8" },
  { id:"out_yin_white", rk:"SSR", cat:"outfit", role:"yin", name:"服装 · 白瓷长袍",
    desc:"音专属 · 白瓷色长袍 + 紫晶腰带",
    body:"音换上了白瓷色的研究员长袍，腰间是一条紫晶腰带。\n\n「这是档案守护者的正装。」\n「平时不穿——今天给你看一眼。」\n\n（已收藏到衣橱 · 后续版本支持穿戴）", w:0.5, color:"#cfd6e8" },

  /* ============ SR (18%) ============ */
  // 番外
  { id:"ep_q_book", rk:"SR", cat:"episode", role:"qianye", name:"番外 · 第 2.46 页",
    desc:"千夜读书时的一段小事",
    body:"千夜把书翻到第 2.46 页（不存在的页码）。\n「修复师，每本书的 2.46 页，我都会贴一片银杏叶。」\n「这样翻到的时候，心里会响一下。」", w:5, color:"#7d4dff" },
  { id:"ep_y_song", rk:"SR", cat:"episode", role:"yunli", name:"番外 · 工坊里的歌",
    desc:"云璃边修零件边哼歌",
    body:"云璃边修零件边哼一首老歌。「这是我妈以前在车间唱的。」\n「她说——能在噪音里听见旋律的人，机器也愿意听他的。」", w:5, color:"#ff77c8" },
  { id:"ep_yin_tea", rk:"SR", cat:"episode", role:"yin", name:"番外 · 三种茶",
    desc:"音的午后习惯",
    body:"音的桌上永远有三杯茶。\n「左边是给来客的，中间是给我自己的，右边——给从来不来的那个人。」\n你没问那个人是谁。", w:5, color:"#3ad6ff" },

  // 信件
  { id:"lt_q_note", rk:"SR", cat:"letter", role:"qianye", name:"信件 · 千夜的便签",
    desc:"贴在咖啡杯下的小卡片",
    body:"今天的咖啡——\n你做的比上次温柔了 0.5 度。\n谢谢。\n\n——千", w:5, color:"#a99dff" },
  { id:"lt_y_warn", rk:"SR", cat:"letter", role:"yunli", name:"信件 · 云璃的警告",
    desc:"潦草大写字",
    body:"喂喂喂！\n下次别动我的扳手箱！\n但我猜你又会动 ：）\n\n云璃", w:5, color:"#ff77c8" },
  { id:"lt_yin_quote", rk:"SR", cat:"letter", role:"yin", name:"信件 · 音的摘抄",
    desc:"一段被反复划线的句子",
    body:"「不是所有等待都需要被回应。\n  有些等待，本身就是答案。」\n\n——音 摘", w:5, color:"#cfd6e8" },

  /* ============ R (76%) ============ */
  { id:"r_coin1",  rk:"R", cat:"item", role:"sys", name:"星币 ×100", desc:"补充货币", w:25, color:"#cfd6e8" },
  { id:"r_coin2",  rk:"R", cat:"item", role:"sys", name:"星币 ×50",  desc:"补充货币", w:25, color:"#cfd6e8" },
  { id:"r_charm",  rk:"R", cat:"item", role:"all", name:"幸运符", desc:"提升下次抽卡运气", w:15, color:"#cfd6e8" },
  { id:"r_postcard", rk:"R", cat:"item", role:"all", name:"空白明信片", desc:"可以写一段话", w:15, color:"#cfd6e8" }
];

window.GACHA_RATE = { SSR:0.06, SR:0.18, R:0.76 };

/* 分类元信息 */
window.GACHA_CAT_META = {
  episode: { label:"番外小剧场", icon:"📖", color:"#ff9ec5" },
  letter:  { label:"角色信件", icon:"✉", color:"#a99dff" },
  outfit:  { label:"角色服装", icon:"👗", color:"#ffd66b" },
  item:    { label:"道具", icon:"🎁", color:"#cfd6e8" }
};
