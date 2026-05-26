/* ============ 剧情数据 v2.0 ============
 * 每条主线扩写到 ~200 行 / 章，3 章
 * step types:
 *   { type:"line", who, exp?, text, scene?, fx?, bgm? }
 *   { type:"narr", text, scene?, fx? }
 *   { type:"choice", options:[{text, next?, aff?{id:+n}, flag?, stage?:+1, gift?, mini?}] }
 *   { type:"jump", to }
 *   { type:"label", id }
 *   { type:"chapter", day, name, en, scene? }
 *   { type:"cg", id, title, scene?, img? }    // 解锁回忆 CG
 *   { type:"mini", game:"qy"|"yl"|"yin", reward:{coin?,aff?} } // 触发角色小游戏
 *   { type:"mail", title, body, role }   // 发一封世界观/角色邮件
 *   { type:"end", tag, title, en, body }
 * ============================== */

window.STORY = {
  /* ===========================
   *  千夜线（理性 · 天才科学家）
   * =========================== */
  qianye: [
    /* ---------- Day 1 · 醒来 ---------- */
    { type:"chapter", day:1, name:"第一章 · 醒来", en:"Chapter 1 · Awakening", scene:"deck" },
    { type:"narr", scene:"deck", text:"星舰「忘川号」漂浮在猎户臂的边缘。十二年了，乘客舱里仍维持着零下 196 度的沉睡。" },
    { type:"narr", scene:"deck", text:"作为新上任的「记忆修复师」，你被分配到了星舰最深处的医疗甲板。你的第一份病历，编号 A-07。" },
    { type:"narr", scene:"deck", text:"系统提示：A-07 — 林千夜 / 女 / 28 岁（生理年龄）/ 沉睡前职业：理论物理学家 / 失忆原因：神经突触主动屏蔽。" },
    { type:"narr", scene:"deck", text:"——主动屏蔽。也就是说，她自己选择了「忘记」。" },
    { type:"line", who:"narrator", text:"——加压完成。胶囊舱开启。" },
    { type:"narr", scene:"deck", fx:"flash", text:"白雾散开。一个穿着白色实验袍的身影缓缓睁开眼。" },
    { type:"line", who:"qianye", exp:"calm", scene:"deck", text:"……你好。" },
    { type:"line", who:"qianye", exp:"calm", text:"请问，这里的引力常数变了吗？" },
    { type:"line", who:"player", text:"（这就是她醒来说的第一句话？）" },
    { type:"line", who:"player", text:"……没变。还是 9.81。" },
    { type:"line", who:"qianye", exp:"smile", text:"那就好。看来宇宙学常数也没变。" },
    { type:"line", who:"qianye", exp:"calm", text:"我可以放心地开始忘记了。" },
    { type:"choice", options:[
      { text:"「你不是刚醒吗？怎么一开口就是公式？」", aff:{qianye:1}, next:"q_d1_b_funny" },
      { text:"「修复师在场，请允许我引导你回忆。」", aff:{qianye:2}, stage:1, next:"q_d1_b_pro" },
      { text:"「……你叫什么名字？」", aff:{qianye:0}, next:"q_d1_b_basic" }
    ]},

    { type:"label", id:"q_d1_b_funny" },
    { type:"line", who:"qianye", exp:"smile", text:"公式是我唯一确定的东西。其他的，都消失在黑洞里了。" },
    { type:"line", who:"qianye", exp:"calm", text:"——而且，我刚刚说错了一件事。" },
    { type:"line", who:"player", text:"嗯？" },
    { type:"line", who:"qianye", exp:"smile", text:"刚刚那句不是公式，是我能想到的最浪漫的事。" },
    { type:"jump", to:"q_d1_main" },

    { type:"label", id:"q_d1_b_pro" },
    { type:"line", who:"qianye", exp:"calm", text:"……你的眼神比仪器认真。" },
    { type:"line", who:"qianye", exp:"calm", text:"可以。我把神经接口的访问权限交给你。" },
    { type:"line", who:"player", text:"（她比我想象中果断。）" },
    { type:"jump", to:"q_d1_main" },

    { type:"label", id:"q_d1_b_basic" },
    { type:"line", who:"qianye", exp:"calm", text:"我叫……" },
    { type:"line", who:"qianye", exp:"sad", text:"名字是个变量，请你赋值。" },
    { type:"line", who:"player", text:"……" },
    { type:"line", who:"qianye", exp:"calm", text:"开玩笑。林千夜。Qianye Lin。我还没忘自己。" },
    { type:"jump", to:"q_d1_main" },

    { type:"label", id:"q_d1_main" },
    { type:"line", who:"qianye", exp:"calm", text:"修复师，先听我说。我只记得三件事。" },
    { type:"line", who:"qianye", exp:"calm", text:"第一，我做过的最后一个实验：「跨星际记忆迁移」。" },
    { type:"line", who:"qianye", exp:"calm", text:"第二，银河旋臂的进动周期是 2.46 亿年。" },
    { type:"line", who:"qianye", exp:"sad", text:"第三，一句话。" },
    { type:"line", who:"player", text:"哪一句？" },
    { type:"line", who:"qianye", exp:"sad", text:"——「答应我，下一次相遇，你要先认出我。」" },
    { type:"line", who:"qianye", exp:"calm", text:"我不知道是谁说的。也许是我，也许是别人。" },
    { type:"narr", scene:"deck", fx:"flash", text:"系统提示：A-07 记忆碎片 0%。修复进度：ENTRY。" },
    { type:"line", who:"player", text:"……我会帮你找回那个人。" },
    { type:"choice", options:[
      { text:"「就算这是你给自己留的谎言。」", aff:{qianye:2}, next:"q_d1_after_vow" },
      { text:"「就算那个人，是我。」", aff:{qianye:3}, flag:"hint_self_q", stage:1, next:"q_d1_after_vow" },
      { text:"「但请先告诉我，你为什么主动选择失忆。」", aff:{qianye:1}, next:"q_d1_why_forget" }
    ]},

    { type:"label", id:"q_d1_why_forget" },
    { type:"line", who:"qianye", exp:"sad", text:"……敏锐。" },
    { type:"line", who:"qianye", exp:"sad", text:"因为有些记忆，比死亡更重。我没有勇气带着它继续走。" },
    { type:"line", who:"qianye", exp:"calm", text:"但我又没勇气真正放手。所以我把它埋起来——用 12 年。" },
    { type:"jump", to:"q_d1_after_vow" },

    { type:"label", id:"q_d1_after_vow" },
    { type:"line", who:"qianye", exp:"smile", text:"……修复师，我喜欢你的工作态度。" },
    { type:"narr", text:"——你的体力 -3。剩余体力会随时间恢复。" },
    { type:"line", who:"qianye", exp:"calm", text:"今天先到这里。我需要重新熟悉自己的身体——脱水了 12 年的肌肉，握紧拳头都会颤。" },
    { type:"line", who:"player", text:"明天我再过来。" },
    { type:"line", who:"qianye", exp:"smile", text:"嗯。带一杯咖啡。如果星舰还能造出咖啡的话。" },
    { type:"cg", id:"qianye_cg1", title:"第一次对望", scene:"deck", img:"qianye" },
    { type:"mail", role:"system", title:"修复师任务派发", body:"任务：与 A-07（林千夜）建立信任关系。完成第一日访谈奖励：星币 +50。" },
    { type:"narr", text:"=== Day 1 结束 · 修复进度 8% ===" },

    /* ---------- Day 1.5 · 日常 · 给千夜带咖啡 ---------- */
    { type:"chapter", day:1, name:"日常 · 一杯咖啡", en:"Daily · The Coffee", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"傍晚，星舰人造黑夜降临。你在医疗甲板的合成厨房里站了 20 分钟。" },
    { type:"line", who:"player", text:"机器，给我一杯咖啡。" },
    { type:"line", who:"narrator", text:"「检测到使用者血液中咖啡因浓度过低。是否使用：A）速效配方 B）耐心慢冲 C）……加点白兰地？」" },
    { type:"choice", options:[
      { text:"A · 速效配方", aff:{qianye:0}, next:"q_coffee_after" },
      { text:"B · 耐心慢冲", aff:{qianye:2}, gift:"coffee_slow", next:"q_coffee_after" },
      { text:"C · 加点白兰地（她会喜欢这个浪漫吗？）", aff:{qianye:1}, gift:"coffee_brandy", next:"q_coffee_after" }
    ]},
    { type:"label", id:"q_coffee_after" },
    { type:"narr", scene:"cabin", text:"15 分钟后，咖啡到你手上。你穿过两层闸门，敲了敲她的舱室。" },
    { type:"line", who:"qianye", exp:"smile", scene:"cabin", text:"……你真的来了。" },
    { type:"line", who:"qianye", exp:"calm", text:"我以为这是你专业范本里的话。" },
    { type:"line", who:"player", text:"（她笑了。第一次。）" },
    { type:"line", who:"qianye", exp:"smile", text:"谢谢。" },
    { type:"narr", text:"——你解锁了「咖啡」礼物条目。今后可在「送礼」中重复使用。" },
    { type:"narr", text:"=== 日常结束 · 千夜好感度 +x ===" },

    /* ---------- Day 2 · 走廊里的常数 ---------- */
    { type:"chapter", day:2, name:"第二章 · 走廊里的常数", en:"Chapter 2 · The Constant Hallway", scene:"corridor" },
    { type:"narr", scene:"corridor", text:"第二天。星舰内日历切换为「人造黎明」。你刚走到甲板 7 走廊，就看见她——已经在那里等你。" },
    { type:"line", who:"qianye", exp:"calm", scene:"corridor", text:"你迟到了 3 分 12 秒。" },
    { type:"line", who:"player", text:"……你怎么知道？" },
    { type:"line", who:"qianye", exp:"smile", text:"我数着自己的脉搏。我的静息心率在 62。" },
    { type:"line", who:"qianye", exp:"calm", text:"我自己拼出了一段碎片。" },
    { type:"line", who:"qianye", exp:"sad", text:"我曾在地球的山顶天文台做过研究。那是个会下雨的地方。" },
    { type:"line", who:"player", text:"你想去看看？" },
    { type:"line", who:"qianye", exp:"smile", text:"船上有一个全息花园，能模拟任何天气。" },
    { type:"choice", options:[
      { text:"「那现在就去。」", aff:{qianye:2}, next:"q_d2_go" },
      { text:"「先把你的脑波数据备份完。」", aff:{qianye:1}, next:"q_d2_safe" },
      { text:"「你想下雨，我们就让它下。」", aff:{qianye:3}, flag:"romantic_q", stage:1, next:"q_d2_go" },
      { text:"「我想先和你玩个小游戏，测一下你的记忆响应速度。」", aff:{qianye:2}, mini:"qy", next:"q_d2_go" }
    ]},
    { type:"label", id:"q_d2_safe" },
    { type:"line", who:"qianye", exp:"calm", text:"……理性的人。我们是同类。" },
    { type:"line", who:"qianye", exp:"smile", text:"但理性的人也需要被雨打湿一次。走吧。" },
    { type:"jump", to:"q_d2_go" },

    { type:"label", id:"q_d2_go" },
    { type:"narr", scene:"garden", fx:"rain", text:"全息花园 · 雨。雨落在皮肤上是温的，因为这是模拟。" },
    { type:"line", who:"qianye", exp:"calm", scene:"garden", fx:"rain", text:"你知道为什么人类会觉得雨声让人安静吗？" },
    { type:"line", who:"player", text:"……不知道。" },
    { type:"line", who:"qianye", exp:"smile", text:"因为雨声是 1/f 噪音。它的频率分布刚好覆盖人耳最敏感的范围，又不刺激。" },
    { type:"line", who:"qianye", exp:"smile", text:"听起来像是「白噪音被自然温柔化」之后的产物。" },
    { type:"line", who:"player", text:"（她在用 1/f 噪音说话。）" },
    { type:"line", who:"qianye", exp:"sad", text:"……我想起来一件事。" },
    { type:"line", who:"qianye", exp:"sad", text:"那个让我「认出他」的人——他也是修复师。" },
    { type:"line", who:"player", text:"（心跳错了一拍。）" },
    { type:"line", who:"qianye", exp:"calm", text:"但我不会要求你成为他。" },
    { type:"line", who:"qianye", exp:"smile", text:"——只想问你，你愿意成为下一个吗？" },
    { type:"choice", options:[
      { text:"「我愿意。」", aff:{qianye:3}, flag:"vow_q", stage:1, next:"q_d2_after_vow" },
      { text:"「先让我修好你，我们再谈。」", aff:{qianye:1}, next:"q_d2_after_vow" },
      { text:"「我会让你失望。」", aff:{qianye:-2}, flag:"reject_q", next:"q_d2_after_reject" },
      { text:"「请告诉我那个人是谁，我帮你找他。」", aff:{qianye:0}, flag:"helper_q", next:"q_d2_help_him" }
    ]},
    { type:"label", id:"q_d2_after_reject" },
    { type:"line", who:"qianye", exp:"sad", text:"……好。" },
    { type:"line", who:"qianye", exp:"calm", text:"你是个诚实的人。这一点很贵。" },
    { type:"jump", to:"q_d2_close" },
    { type:"label", id:"q_d2_help_him" },
    { type:"line", who:"qianye", exp:"sad", text:"我也不知道他是谁。" },
    { type:"line", who:"qianye", exp:"sad", text:"我只记得，他的左眼里有星图。" },
    { type:"narr", text:"——你想起了 Y-01 银的档案。这是一个隐藏线索。" },
    { type:"jump", to:"q_d2_close" },
    { type:"label", id:"q_d2_after_vow" },
    { type:"line", who:"qianye", exp:"smile", text:"……谢谢。这就够了。" },
    { type:"line", who:"qianye", exp:"shy", text:"不用真的「成为他」。" },
    { type:"line", who:"qianye", exp:"shy", text:"——只要是你就行。" },
    { type:"label", id:"q_d2_close" },
    { type:"cg", id:"qianye_cg2", title:"全息雨中的承诺", scene:"garden", img:"qianye_he" },
    { type:"line", who:"qianye", exp:"smile", text:"今天就到这里。明天，我打算让你看看我藏在档案库的东西。" },
    { type:"line", who:"player", text:"……什么东西？" },
    { type:"line", who:"qianye", exp:"smile", text:"是我自己。" },
    { type:"narr", text:"=== Day 2 结束 · 修复进度 47% ===" },

    /* ---------- Day 2.5 · 日常 · 小游戏 / 送礼 ---------- */
    { type:"chapter", day:2, name:"日常 · 记忆碎片", en:"Daily · Memory Shards", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"晚上。她发了一条信息：「修复师，我有点睡不着。能教我玩你们说的游戏吗？」" },
    { type:"line", who:"player", text:"（她说她睡不着。第一次主动找你。）" },
    { type:"choice", options:[
      { text:"「来一局记忆碎片连线，赢了我就送你今晚的星图。」", aff:{qianye:2}, mini:"qy", next:"q_d2_5_after" },
      { text:"「送你一束花吧，让你睡得好一些。」", aff:{qianye:2}, gift:"flower", next:"q_d2_5_after" },
      { text:"「我陪你视频，直到你睡着。」", aff:{qianye:3}, flag:"sleep_call_q", stage:1, next:"q_d2_5_after" }
    ]},
    { type:"label", id:"q_d2_5_after" },
    { type:"narr", text:"=== 日常结束 ===" },

    /* ---------- Day 3 · 同一个常数 ---------- */
    { type:"chapter", day:3, name:"第三章 · 同一个常数", en:"Chapter 3 · Same Constant", scene:"archive" },
    { type:"narr", scene:"archive", text:"星舰档案库。最深一层。墙上排列着上百个发光的记忆胶囊，像一个个还没醒来的灵魂。" },
    { type:"line", who:"qianye", exp:"calm", scene:"archive", text:"它需要两个人的脉搏才能打开。" },
    { type:"line", who:"qianye", exp:"smile", text:"系统登记的另一个人，是「未来某天的你」。" },
    { type:"line", who:"player", text:"……？" },
    { type:"line", who:"qianye", exp:"sad", text:"我知道这听起来像悖论。" },
    { type:"line", who:"qianye", exp:"calm", text:"12 年前，我把自己的记忆，提前传送到了「未来与我相遇的人」的脑中——也就是你。" },
    { type:"line", who:"qianye", exp:"calm", text:"所以你才会一开始就觉得：似乎认识我。" },
    { type:"line", who:"player", text:"（你回想起第一次见她时，那种说不清的熟悉。原来不是错觉。）" },
    { type:"choice", options:[
      { text:"「把手伸过来。」", aff:{qianye:3}, next:"q_d3_open" },
      { text:"「先告诉我，你为什么要这么做。」", aff:{qianye:2}, next:"q_d3_why" },
      { text:"「等等——我没有准备好成为「记得你一切」的人。」", aff:{qianye:0}, flag:"hesitate_q", next:"q_d3_hesitate" }
    ]},
    { type:"label", id:"q_d3_why" },
    { type:"line", who:"qianye", exp:"sad", text:"因为我害怕。" },
    { type:"line", who:"qianye", exp:"sad", text:"我做的「跨星际记忆迁移」实验有副作用——长期沉睡会让大脑彻底删除「自我意识」。" },
    { type:"line", who:"qianye", exp:"sad", text:"我可能醒来后，连「我是林千夜」都不记得。" },
    { type:"line", who:"qianye", exp:"smile", text:"所以我把「我是谁」预先传给了未来的、对的那个人。" },
    { type:"line", who:"qianye", exp:"calm", text:"你今天能站在我面前，说明实验成功了。" },
    { type:"jump", to:"q_d3_open" },
    { type:"label", id:"q_d3_hesitate" },
    { type:"line", who:"qianye", exp:"sad", text:"……" },
    { type:"line", who:"qianye", exp:"smile", text:"没关系。我不强求。" },
    { type:"line", who:"qianye", exp:"calm", text:"那我就把它带回胶囊里，等下一个 12 年。" },
    { type:"jump", to:"q_d3_open" },
    { type:"label", id:"q_d3_open" },
    { type:"narr", scene:"archive", fx:"flash", text:"——锁开了。光从胸口溢出来。一段一段画面，像星雨一样涌入你的脑海。" },
    { type:"narr", scene:"archive", text:"你看见 12 年前的她，在按下「自愿失忆」按钮前的最后一刻，对镜头说：" },
    { type:"line", who:"qianye", exp:"smile", scene:"archive", text:"「未来的你，无论你叫什么名字——」" },
    { type:"line", who:"qianye", exp:"smile", text:"「先认出我。」" },
    { type:"cg", id:"qianye_cg3", title:"同一个常数", scene:"archive", img:"qianye_he" },

    /* 结局判定 */
    { type:"end", tag:"HE", title:"恒星轨道",
      en:"Stellar Orbit · True End",
      body:"她最终选择把记忆全部交给你保管，而你陪她重新研究——下一次相遇，仍然是你先认出她。\n你们一起在星舰上又工作了 7 年。她总是说：「下一个常数，是你。」" }
  ],

  /* ===========================
   *  云璃线（感性 · 失忆舞者）
   * =========================== */
  yunli: [
    { type:"chapter", day:1, name:"第一章 · 跳碎了的玻璃", en:"Chapter 1 · Shattered Stage", scene:"corridor" },
    { type:"narr", scene:"corridor", text:"凌晨 3 点 17 分。星舰内警报响起。你冲进甲板 4 走廊。" },
    { type:"narr", scene:"corridor", text:"一个粉色头发的女孩，赤脚踩在散落的全息碎片上跳舞，每一步都让玻璃溅起一串小光点。" },
    { type:"line", who:"yunli", exp:"smile", scene:"corridor", text:"嘿~ 你也是来看演出的吗？" },
    { type:"line", who:"player", text:"……你的脚在流血。" },
    { type:"line", who:"yunli", exp:"smile", text:"哎呀真的。可这是我醒来后第一次跳，停不下来嘛~" },
    { type:"line", who:"yunli", exp:"smile", text:"修复师对吧？我看你穿的制服。我叫云璃，Yunli。" },
    { type:"choice", options:[
      { text:"「先停下，我帮你包扎。」", aff:{yunli:2}, next:"y_d1_care" },
      { text:"「跳完吧，我看完再带你去医务室。」", aff:{yunli:3}, flag:"witness_y", stage:1, next:"y_d1_dance" },
      { text:"「你有意识到自己在流血吗？」", aff:{yunli:0}, next:"y_d1_care" },
      { text:"「不准跳——这是命令。」", aff:{yunli:-1}, flag:"command_y", next:"y_d1_care" }
    ]},
    { type:"label", id:"y_d1_dance" },
    { type:"narr", scene:"corridor", fx:"petals", text:"她跳完最后一个旋转，停在你面前。" },
    { type:"line", who:"yunli", exp:"sad", text:"……谢谢你看完。" },
    { type:"line", who:"yunli", exp:"sad", text:"其实，这是我「最后的舞台」。" },
    { type:"jump", to:"y_d1_main" },
    { type:"label", id:"y_d1_care" },
    { type:"line", who:"yunli", exp:"smile", text:"啊呀，这位修复师好凶哦~ 不过……我让你包。" },
    { type:"jump", to:"y_d1_main" },
    { type:"label", id:"y_d1_main" },
    { type:"narr", scene:"cabin", text:"医务舱。她坐在床沿，把绷带绕在你手腕上——尽管受伤的是她。" },
    { type:"line", who:"yunli", exp:"smile", scene:"cabin", text:"「最后的舞台」是我醒来记得的唯一一句话。" },
    { type:"line", who:"yunli", exp:"sad", text:"但我不知道——是我的最后，还是别人给我的最后。" },
    { type:"line", who:"player", text:"想找回来吗？" },
    { type:"line", who:"yunli", exp:"sad", text:"想啊。但我害怕找回来之后，我会变成不爱跳舞的人。" },
    { type:"choice", options:[
      { text:"「那就别找了，做现在的你。」", aff:{yunli:2}, next:"y_d1_now" },
      { text:"「我陪你一起找。」", aff:{yunli:3}, flag:"with_y", stage:1, next:"y_d1_now" },
      { text:"「你不会变。能跳碎玻璃的人，永远会跳。」", aff:{yunli:3}, flag:"believe_y", stage:1, next:"y_d1_now" },
      { text:"「先睡一觉。明天再说。」", aff:{yunli:0}, next:"y_d1_now" }
    ]},
    { type:"label", id:"y_d1_now" },
    { type:"line", who:"yunli", exp:"smile", text:"……你这种人，真讨厌。" },
    { type:"line", who:"yunli", exp:"smile", text:"一句话就让人想哭。" },
    { type:"line", who:"yunli", exp:"smile", text:"你先回去吧。明天我请你看我练第二支舞，好不好？" },
    { type:"cg", id:"yunli_cg1", title:"医务舱里的绷带", scene:"cabin", img:"yunli" },
    { type:"mail", role:"system", title:"修复师任务派发", body:"任务：跟进 B-12（云璃）的肌肉康复 & 情绪修复。奖励：星币 +50。" },
    { type:"narr", text:"=== Day 1 结束 · 修复进度 12% ===" },

    /* ---------- Day 1.5 · 节拍小游戏 ---------- */
    { type:"chapter", day:1, name:"日常 · 第一次合拍", en:"Daily · First Beat", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"她给你发消息：「修复师，我教你一个简单的舞步！要不要试？」" },
    { type:"choice", options:[
      { text:"「来。一局节拍游戏。」", aff:{yunli:2}, mini:"yl", next:"y_d1_5_after" },
      { text:"「我不擅长。送你点小礼物吧。」", aff:{yunli:1}, gift:"snack", next:"y_d1_5_after" },
      { text:"「我看你跳就好。」", aff:{yunli:1}, next:"y_d1_5_after" }
    ]},
    { type:"label", id:"y_d1_5_after" },
    { type:"narr", text:"=== 日常结束 ===" },

    /* ---------- Day 2 · 全息废墟 ---------- */
    { type:"chapter", day:2, name:"第二章 · 全息废墟", en:"Chapter 2 · Holographic Ruins", scene:"deck" },
    { type:"narr", scene:"deck", text:"第二天。她非要拉你去看观景台。" },
    { type:"line", who:"yunli", exp:"smile", scene:"deck", text:"看~ 那颗会闪三下的星。我以前给它起过名字。" },
    { type:"line", who:"player", text:"叫什么？" },
    { type:"line", who:"yunli", exp:"smile", text:"叫「我」。" },
    { type:"line", who:"yunli", exp:"smile", text:"因为我也总在被人忘记之前，先闪三下提醒一下。" },
    { type:"line", who:"player", text:"（这玩笑里有什么。）" },
    { type:"choice", options:[
      { text:"「我不会忘。」", aff:{yunli:3}, flag:"promise_y", stage:1, next:"y_d2_a" },
      { text:"「那现在闪给我看。」", aff:{yunli:2}, next:"y_d2_a" },
      { text:"「……」（把手放在她手上）", aff:{yunli:3}, flag:"hand_y", stage:1, next:"y_d2_a" },
      { text:"「那颗星的实际编号是 HD-218396。它不会消失。」", aff:{yunli:-1}, next:"y_d2_a" }
    ]},
    { type:"label", id:"y_d2_a" },
    { type:"narr", scene:"deck", text:"她突然蹲下来，捂住了头。" },
    { type:"line", who:"yunli", exp:"sad", text:"想起来一点……" },
    { type:"line", who:"yunli", exp:"sad", text:"我曾经有一个搭档。叫小蛐。比我小三岁，很爱我。" },
    { type:"line", who:"yunli", exp:"sad", text:"她在最后那场演出里……死了。" },
    { type:"line", who:"yunli", exp:"sad", text:"是我让她替我上的台。因为我那天嫉妒她比我更被观众喜欢。" },
    { type:"line", who:"yunli", exp:"sad", text:"灯桥塌了。砸下来的位置——本来应该是我的。" },
    { type:"line", who:"player", text:"……" },
    { type:"choice", options:[
      { text:"「不是你的错。」", aff:{yunli:1}, next:"y_d2_close" },
      { text:"「就算是你的错，我也陪你扛。」", aff:{yunli:3}, flag:"share_y", stage:1, next:"y_d2_close" },
      { text:"「先回到现在，深呼吸。」", aff:{yunli:1}, next:"y_d2_close" },
      { text:"（一句不说，紧紧抱住她。）", aff:{yunli:3}, flag:"hug_y", stage:1, next:"y_d2_close" }
    ]},
    { type:"label", id:"y_d2_close" },
    { type:"line", who:"yunli", exp:"sad", text:"……" },
    { type:"line", who:"yunli", exp:"smile", text:"修复师，你身上有一种「不会让人想跳下星舰」的味道。" },
    { type:"line", who:"yunli", exp:"smile", text:"——我喜欢这种味道。" },
    { type:"cg", id:"yunli_cg2", title:"会闪三下的星", scene:"deck", img:"yunli" },
    { type:"narr", text:"=== Day 2 结束 · 修复进度 51% ===" },

    /* ---------- Day 2.5 · 送礼日常 ---------- */
    { type:"chapter", day:2, name:"日常 · 给云璃送点什么", en:"Daily · A Little Something", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"她说她明天要重新登台。你想给她准备点什么。" },
    { type:"choice", options:[
      { text:"「送你一颗星 — 我已经在星图系统里给那颗 HD-218396 改名为「你」了。」", aff:{yunli:3}, flag:"star_gift", stage:1, next:"y_d2_5_after" },
      { text:"「送一束花。」", aff:{yunli:2}, gift:"flower", next:"y_d2_5_after" },
      { text:"「送你一个录音笔。把你想跳的舞都录下来。」", aff:{yunli:2}, gift:"recorder", next:"y_d2_5_after" }
    ]},
    { type:"label", id:"y_d2_5_after" },
    { type:"narr", text:"=== 日常结束 ===" },

    /* ---------- Day 3 · 重新登台 ---------- */
    { type:"chapter", day:3, name:"第三章 · 重新登台", en:"Chapter 3 · Encore", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"星舰主厅被改造成了一个临时舞台。" },
    { type:"narr", scene:"cabin", text:"她说她要重新跳一次「最后的舞台」——但这次，是为了告别也为了开始。" },
    { type:"line", who:"yunli", exp:"smile", scene:"cabin", text:"修复师，可以请你来当我的搭档吗？" },
    { type:"line", who:"player", text:"我不会跳。" },
    { type:"line", who:"yunli", exp:"smile", text:"那刚刚好。" },
    { type:"line", who:"yunli", exp:"smile", text:"你只要站在那里，让我有理由「不再独自跳」。" },
    { type:"choice", options:[
      { text:"「好，我来。」", aff:{yunli:3}, next:"y_d3_dance" },
      { text:"「我看着你跳，更好。」", aff:{yunli:1}, next:"y_d3_watch" },
      { text:"「让我先和你练一遍节拍。」", aff:{yunli:2}, mini:"yl", next:"y_d3_dance" }
    ]},
    { type:"label", id:"y_d3_dance" },
    { type:"narr", scene:"cabin", fx:"petals", text:"她牵着你的手，转了一圈又一圈。这是星舰上第一场两个人的演出。" },
    { type:"jump", to:"y_d3_close" },
    { type:"label", id:"y_d3_watch" },
    { type:"narr", scene:"cabin", fx:"petals", text:"她在台上独舞，你在台下，比她更不敢眨眼。" },
    { type:"label", id:"y_d3_close" },
    { type:"line", who:"yunli", exp:"smile", text:"——谢谢你，让我知道。" },
    { type:"line", who:"yunli", exp:"smile", text:"最后的舞台之后，还能有「再来一次」。" },
    { type:"cg", id:"yunli_cg3", title:"再来一次", scene:"cabin", img:"yunli_he" },
    { type:"end", tag:"HE", title:"安可",
      en:"Encore · True End",
      body:"她从此把每一场演出叫做「再来一次」。你成了固定观众席第一排的那个人——她每跳完都会先看向你。\n第 7 次「再来一次」之后，她在台上向你求婚了。" }
  ],

  /* ===========================
   *  银线（反差 · 机械义体守卫）
   * =========================== */
  yin: [
    { type:"chapter", day:1, name:"第一章 · 不会眨眼的人", en:"Chapter 1 · The Man Who Never Blinks", scene:"corridor" },
    { type:"narr", scene:"corridor", text:"星舰守卫舱。一个穿着银灰色守卫服的男人靠墙站立。" },
    { type:"narr", scene:"corridor", text:"他的眼睛是金色的，像两枚老式怀表。瞳孔里有细小的星图。" },
    { type:"line", who:"yin", exp:"calm", scene:"corridor", text:"……你是新的修复师？" },
    { type:"line", who:"player", text:"（他不眨眼。也几乎不动。）是。" },
    { type:"line", who:"yin", exp:"calm", text:"我不需要修复。" },
    { type:"choice", options:[
      { text:"「但你登记里写了『请修复我』。」", aff:{yin:1}, next:"yin_d1_log" },
      { text:"「那我陪你站一会儿。」", aff:{yin:2}, flag:"silent_yin", stage:1, next:"yin_d1_silent" },
      { text:"「你害怕想起什么。」", aff:{yin:2}, next:"yin_d1_log" },
      { text:"「机械义体每 6 个月需要一次神经接口校准。我顺便。」", aff:{yin:0}, next:"yin_d1_log" }
    ]},
    { type:"label", id:"yin_d1_log" },
    { type:"line", who:"yin", exp:"sad", text:"……那是 12 年前的我写的。我不一定还认得他。" },
    { type:"jump", to:"yin_d1_main" },
    { type:"label", id:"yin_d1_silent" },
    { type:"narr", scene:"corridor", text:"你陪他在走廊静站了 17 分钟。他终于先开口。" },
    { type:"line", who:"yin", exp:"calm", text:"……你是第一个不催我的人。" },
    { type:"jump", to:"yin_d1_main" },
    { type:"label", id:"yin_d1_main" },
    { type:"line", who:"yin", exp:"calm", scene:"corridor", text:"我的左眼是植入义体。它存着我之前所有的视觉。" },
    { type:"line", who:"yin", exp:"sad", text:"但我不敢看。" },
    { type:"line", who:"player", text:"为什么？" },
    { type:"line", who:"yin", exp:"sad", text:"……怕里面有一个我不想再失去的人。" },
    { type:"line", who:"player", text:"（这是他第一次「沉默之外」的话。）" },
    { type:"choice", options:[
      { text:"「我陪你看。」", aff:{yin:3}, flag:"watch_with", stage:1, next:"yin_d1_close" },
      { text:"「不看也行。我陪你想别的。」", aff:{yin:2}, next:"yin_d1_close" },
      { text:"「也许失去过的，更值得记得。」", aff:{yin:1}, next:"yin_d1_close" }
    ]},
    { type:"label", id:"yin_d1_close" },
    { type:"line", who:"yin", exp:"calm", text:"……今天到这里。" },
    { type:"line", who:"yin", exp:"sad", text:"我需要 6 小时校准。" },
    { type:"cg", id:"yin_cg1", title:"金色瞳孔", scene:"corridor", img:"yin" },
    { type:"mail", role:"system", title:"修复师任务派发", body:"任务：与 Y-01（银）建立信任。注意：他有机械心脏，避免任何情绪刺激。" },
    { type:"narr", text:"=== Day 1 结束 · 修复进度 6% ===" },

    /* ---------- Day 1.5 · 凝视小游戏 ---------- */
    { type:"chapter", day:1, name:"日常 · 不眨眼挑战", en:"Daily · Never Blink", scene:"corridor" },
    { type:"narr", scene:"corridor", text:"晚上。他给你发了一条信息：「我想试试看，能不能比你先眨眼。」" },
    { type:"choice", options:[
      { text:"「来。一局凝视游戏。」", aff:{yin:2}, mini:"yin", next:"yin_d1_5_after" },
      { text:"「我送你一份装备维护油。」", aff:{yin:1}, gift:"oil", next:"yin_d1_5_after" },
      { text:"「我想先听你的心跳。」", aff:{yin:3}, flag:"heartbeat_yin", stage:1, next:"yin_d1_5_after" }
    ]},
    { type:"label", id:"yin_d1_5_after" },
    { type:"narr", text:"=== 日常结束 ===" },

    /* ---------- Day 2 · 心跳停过 7 次 ---------- */
    { type:"chapter", day:2, name:"第二章 · 心跳停过 7 次", en:"Chapter 2 · Seven Stops", scene:"deck" },
    { type:"narr", scene:"deck", text:"第二天。他在观景台等你，手里多了一个机械怀表。" },
    { type:"line", who:"yin", exp:"calm", scene:"deck", text:"我的心脏，是机械的。它停过 7 次。" },
    { type:"line", who:"yin", exp:"calm", text:"每停一次，我会忘掉一段感情。" },
    { type:"line", who:"player", text:"……所以你忘掉了 7 个人？" },
    { type:"line", who:"yin", exp:"sad", text:"不。" },
    { type:"line", who:"yin", exp:"sad", text:"是同一个人，我忘了 7 次。" },
    { type:"line", who:"player", text:"（……你心里咯噔一下。）" },
    { type:"choice", options:[
      { text:"「让我看看你的左眼。」", aff:{yin:3}, flag:"see_yin", stage:1, next:"yin_d2_see" },
      { text:"「那你这次想不起，是好事。」", aff:{yin:1}, next:"yin_d2_close" },
      { text:"「下次停的时候，我陪你。」", aff:{yin:3}, flag:"stay_yin", stage:1, next:"yin_d2_close" },
      { text:"「如果是同一个人，那个人也许也在找你。」", aff:{yin:2}, next:"yin_d2_close" }
    ]},
    { type:"label", id:"yin_d2_see" },
    { type:"narr", scene:"deck", fx:"flash", text:"他闭上眼，把左眼的视觉投向空中。" },
    { type:"narr", scene:"deck", text:"是一个一直在笑的女孩，每一帧都不一样年龄——从 6 岁到 30 岁，被他完整记录。" },
    { type:"line", who:"yin", exp:"sad", text:"我不知道她是谁。" },
    { type:"line", who:"yin", exp:"sad", text:"但每一次重启，我都会先认出她的笑。" },
    { type:"line", who:"player", text:"（……她让我想起千夜。）" },
    { type:"narr", text:"——隐藏线索解锁：「同一个常数」。" },
    { type:"label", id:"yin_d2_close" },
    { type:"line", who:"yin", exp:"calm", text:"……今天就到这里。" },
    { type:"line", who:"yin", exp:"sad", text:"我感觉我快要忘第 8 次了。" },
    { type:"cg", id:"yin_cg2", title:"机械怀表", scene:"deck", img:"yin" },
    { type:"narr", text:"=== Day 2 结束 · 修复进度 38% ===" },

    /* ---------- Day 2.5 · 日常 ---------- */
    { type:"chapter", day:2, name:"日常 · 留住他", en:"Daily · Stay Awake", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"半夜。系统提示：守卫 Y-01 心跳异常预警。" },
    { type:"choice", options:[
      { text:"「我现在就去他那。」", aff:{yin:3}, flag:"rush_yin", stage:1, next:"yin_d2_5_after" },
      { text:"「给他送一杯加糖的咖啡。糖能稳定脑波。」", aff:{yin:2}, gift:"coffee_sweet", next:"yin_d2_5_after" },
      { text:"「让他自己休息。明天再说。」", aff:{yin:-1}, next:"yin_d2_5_after" }
    ]},
    { type:"label", id:"yin_d2_5_after" },
    { type:"narr", text:"=== 日常结束 ===" },

    /* ---------- Day 3 · 第八次 ---------- */
    { type:"chapter", day:3, name:"第三章 · 第八次", en:"Chapter 3 · The 8th Time", scene:"archive" },
    { type:"narr", scene:"archive", text:"档案库。系统警报：守卫 Y-01 心跳异常，机械心脏即将进入第 8 次停跳。" },
    { type:"line", who:"yin", exp:"sad", scene:"archive", text:"……来了。" },
    { type:"line", who:"yin", exp:"sad", text:"修复师，听我说。" },
    { type:"line", who:"yin", exp:"sad", text:"我重启之后，会忘掉你。" },
    { type:"line", who:"yin", exp:"sad", text:"但请你，下次也先认出我。" },
    { type:"choice", options:[
      { text:"「我会的。」", aff:{yin:3}, next:"yin_d3_a" },
      { text:"「你不要重启。我留你。」", aff:{yin:2}, flag:"stop_restart", next:"yin_d3_b" },
      { text:"「让我替你记住。」", aff:{yin:3}, flag:"keep_for_him", stage:1, next:"yin_d3_a" },
      { text:"「告诉我那个一直在你左眼里笑的女孩。她是不是千夜？」", aff:{yin:2}, flag:"truth_q", next:"yin_d3_truth" }
    ]},
    { type:"label", id:"yin_d3_truth" },
    { type:"line", who:"yin", exp:"sad", text:"……是的。" },
    { type:"line", who:"yin", exp:"sad", text:"我是 12 年前送她进胶囊的人。我答应过她「下一次相遇先认出她」。" },
    { type:"line", who:"yin", exp:"sad", text:"——结果我每次重启都忘记。" },
    { type:"line", who:"yin", exp:"smile", text:"但她现在有了你。这就够了。" },
    { type:"jump", to:"yin_d3_a" },
    { type:"label", id:"yin_d3_a" },
    { type:"narr", scene:"archive", fx:"flash", text:"他握住你的手。机械心脏停下的那一瞬间，舱内灯光全部熄灭——只剩他金色的瞳孔。" },
    { type:"jump", to:"yin_d3_close" },
    { type:"label", id:"yin_d3_b" },
    { type:"narr", scene:"archive", fx:"flash", text:"你按下中止按钮。系统报错。但他还活着，只是会带着痛活下去。" },
    { type:"label", id:"yin_d3_close" },
    { type:"line", who:"yin", exp:"smile", text:"……第 8 次。" },
    { type:"line", who:"yin", exp:"smile", text:"我先认出了你。" },
    { type:"cg", id:"yin_cg3", title:"先认出你", scene:"archive", img:"yin_he" },
    { type:"end", tag:"HE", title:"第八次重逢",
      en:"The 8th Reunion · True End",
      body:"他从此每天醒来，会先看着你说一句「早。」——这是他训练自己「永远先认出你」的练习。\n他再也没有忘记过第 9 次。" }
  ]
};
