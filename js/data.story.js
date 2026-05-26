/* ============ 剧情数据 ============
 * 每个 step:
 *   { type:"line", who, exp?, text, scene?, fx?, pose?, side? }
 *   { type:"narr", text, scene?, fx? }
 *   { type:"choice", options:[{text, next?, aff?{id:+n}, flag?, unlock?}] }
 *   { type:"jump", to: "labelId" }
 *   { type:"label", id }
 *   { type:"chapter", day, name, en }
 *   { type:"cg", id, title, scene? } // 解锁回忆
 *   { type:"end", tag:"HE|NE|TE", title, en, body }
 * ============================== */

const _PROTAG = "你";

window.STORY = {
  /* ===========================
   *  千夜线（理性）
   * =========================== */
  qianye: [
    { type:"chapter", day:1, name:"第一章 · 醒来", en:"Chapter 1 · Awakening" },
    { type:"narr", scene:"deck", text:"星舰「忘川号」漂浮在猎户臂的边缘。十二年了，乘客舱里仍维持着零下 196 度的沉睡。" },
    { type:"narr", scene:"deck", text:"作为新上任的「记忆修复师」，你接过的第一份病历，编号 A-07。" },
    { type:"line", who:"narrator", text:"——加压完成。胶囊舱开启。" },
    { type:"line", who:"qianye", exp:"calm", scene:"deck", text:"……你好。请问，这里的引力常数变了吗？" },
    { type:"line", who:"player", text:"（这就是她醒来说的第一句话？）" },
    { type:"line", who:"player", text:"……没变。还是 9.81。" },
    { type:"line", who:"qianye", exp:"calm", text:"那就好。看来宇宙学常数也没变，我可以放心地开始忘记。" },
    { type:"choice", options:[
      { text:"「你不是刚醒吗？怎么一开口就是公式？」", aff:{qianye:1}, next:"q_d1_branch_funny" },
      { text:"「修复师在场，请允许我引导你回忆。」", aff:{qianye:2}, next:"q_d1_branch_pro" },
      { text:"「……你叫什么？」", aff:{qianye:0}, next:"q_d1_branch_basic" }
    ]},

    { type:"label", id:"q_d1_branch_funny" },
    { type:"line", who:"qianye", exp:"smile", text:"公式是我唯一记得的东西。其他的，都消失在黑洞里了。" },
    { type:"jump", to:"q_d1_main" },

    { type:"label", id:"q_d1_branch_pro" },
    { type:"line", who:"qianye", exp:"calm", text:"……你的眼神比仪器认真。可以。" },
    { type:"jump", to:"q_d1_main" },

    { type:"label", id:"q_d1_branch_basic" },
    { type:"line", who:"qianye", exp:"calm", text:"我叫……名字是个变量，请你赋值。" },
    { type:"jump", to:"q_d1_main" },

    { type:"label", id:"q_d1_main" },
    { type:"line", who:"qianye", exp:"calm", text:"我只记得三件事：我做过的最后一个实验、银河旋臂的进动、还有一句话。" },
    { type:"line", who:"player", text:"哪一句？" },
    { type:"line", who:"qianye", exp:"sad", text:"——「答应我，下一次相遇，你要先认出我。」" },
    { type:"line", who:"qianye", exp:"calm", text:"我不知道这是谁说的。也许是我自己。" },
    { type:"narr", scene:"deck", fx:"flash", text:"系统提示：A-07 记忆碎片 0%。修复进度：ENTRY。" },
    { type:"line", who:"player", text:"……我会帮你找回那个人。" },
    { type:"choice", options:[
      { text:"「就算这是你给自己留的谎言。」", aff:{qianye:2}, next:"q_d1_close" },
      { text:"「就算那个人，是我。」", aff:{qianye:3}, flag:"hint_self", next:"q_d1_close" }
    ]},
    { type:"label", id:"q_d1_close" },
    { type:"line", who:"qianye", exp:"smile", text:"……记忆修复师，我喜欢你的工作态度。" },
    { type:"cg", id:"qianye_cg1", title:"第一次对望", scene:"deck" },
    { type:"narr", text:"Day 1 结束。你在记录板上写下：A-07，最后的实验是「跨星际记忆迁移」。" },

    { type:"chapter", day:2, name:"第二章 · 走廊里的常数", en:"Chapter 2 · The Constant Hallway" },
    { type:"narr", scene:"corridor", fx:"none", text:"次日。星舰内日历切换为「人造黎明」。你来到甲板 7 走廊，千夜已等在那里。" },
    { type:"line", who:"qianye", exp:"calm", scene:"corridor", text:"我自己拼出了一段碎片。我曾在地球的山顶天文台做过研究。" },
    { type:"line", who:"qianye", exp:"calm", text:"那是个会下雨的地方。" },
    { type:"line", who:"player", text:"你想去看看？" },
    { type:"line", who:"qianye", exp:"smile", text:"船上有一个全息花园，能模拟任何天气。" },
    { type:"choice", options:[
      { text:"「那现在就去。」", aff:{qianye:2}, next:"q_d2_go" },
      { text:"「先把你的脑波数据备份完。」", aff:{qianye:1}, next:"q_d2_safe" },
      { text:"「你想下雨，我们就让它下。」", aff:{qianye:3}, flag:"romantic_q", next:"q_d2_go" }
    ]},
    { type:"label", id:"q_d2_safe" },
    { type:"line", who:"qianye", exp:"calm", text:"……理性的人。我们是同类。" },
    { type:"jump", to:"q_d2_go" },
    { type:"label", id:"q_d2_go" },
    { type:"narr", scene:"garden", fx:"rain", text:"全息花园 · 雨。雨落在皮肤上是温的，因为这是模拟。" },
    { type:"line", who:"qianye", exp:"sad", scene:"garden", fx:"rain", text:"……我想起来一件事。" },
    { type:"line", who:"qianye", exp:"sad", text:"那个让我「认出他」的人，他也是修复师。" },
    { type:"line", who:"player", text:"（心跳错了一拍。）" },
    { type:"line", who:"qianye", exp:"calm", text:"但我永远不会要求你成为他。" },
    { type:"line", who:"qianye", exp:"smile", text:"——只想问你，你愿意成为下一个。" },
    { type:"choice", options:[
      { text:"「我愿意。」", aff:{qianye:3}, flag:"vow_q", next:"q_d2_close" },
      { text:"「先让我修好你，我们再谈。」", aff:{qianye:1}, next:"q_d2_close" },
      { text:"「不可以。我会让你失望。」", aff:{qianye:-2}, flag:"reject_q", next:"q_d2_close" }
    ]},
    { type:"label", id:"q_d2_close" },
    { type:"cg", id:"qianye_cg2", title:"全息雨中的承诺", scene:"garden" },
    { type:"narr", text:"Day 2 结束。修复进度：47%。" },

    { type:"chapter", day:3, name:"第三章 · 同一个常数", en:"Chapter 3 · Same Constant" },
    { type:"narr", scene:"archive", text:"星舰档案库。最后一片记忆碎片，深锁在生物锁里。" },
    { type:"line", who:"qianye", exp:"calm", scene:"archive", text:"它需要两个人的脉搏才能打开。" },
    { type:"line", who:"qianye", exp:"smile", text:"系统说，我登记的另一个人——是「未来某天的你」。" },
    { type:"line", who:"player", text:"……？" },
    { type:"line", who:"qianye", exp:"sad", text:"我知道这听起来像悖论。但请相信我。" },
    { type:"choice", options:[
      { text:"「把手伸过来。」", aff:{qianye:3}, next:"q_d3_open" },
      { text:"「先告诉我，你做了什么。」", aff:{qianye:1}, next:"q_d3_truth" }
    ]},
    { type:"label", id:"q_d3_truth" },
    { type:"line", who:"qianye", exp:"sad", text:"我把自己的记忆，提前传送到了「未来与我相遇的人」的脑中——也就是你。" },
    { type:"line", who:"qianye", exp:"sad", text:"所以你才会一开始就觉得，认识我。" },
    { type:"jump", to:"q_d3_open" },
    { type:"label", id:"q_d3_open" },
    { type:"narr", fx:"flash", scene:"archive", text:"——锁开了。光从胸口溢出来。" },
    { type:"line", who:"qianye", exp:"smile", scene:"archive", text:"……终于，我把自己交还给你了。" },
    { type:"cg", id:"qianye_cg3", title:"同一个常数", scene:"archive" },

    /* 结局分支 */
    { type:"label", id:"q_ending" },
    { type:"end", tag:"HE", title:"恒星轨道",
      en:"Stellar Orbit · True End",
      body:"她最终选择把记忆全部交给你保管，而你陪她重新开始研究——下一次相遇，仍然是你先认出她。" }
  ],

  /* ===========================
   *  云璃线（感性）
   * =========================== */
  yunli: [
    { type:"chapter", day:1, name:"第一章 · 跳碎了的玻璃", en:"Chapter 1 · Shattered Stage" },
    { type:"narr", scene:"corridor", text:"警报响起的时候，你冲进甲板 4 走廊，看见一个粉色头发的女孩，赤脚踩在碎玻璃上跳舞。" },
    { type:"line", who:"yunli", exp:"smile", scene:"corridor", text:"嘿~ 你也是来看演出的吗？" },
    { type:"line", who:"player", text:"……你的脚在流血。" },
    { type:"line", who:"yunli", exp:"smile", text:"哎呀真的。可这是我醒来后第一次跳，停不下来嘛~" },
    { type:"choice", options:[
      { text:"「先停下，我帮你包扎。」", aff:{yunli:2}, next:"y_d1_care" },
      { text:"「跳完吧，我看完再带你去医务室。」", aff:{yunli:3}, flag:"witness_y", next:"y_d1_dance" },
      { text:"「你有意识到自己在流血吗？」", aff:{yunli:0}, next:"y_d1_care" }
    ]},
    { type:"label", id:"y_d1_dance" },
    { type:"narr", scene:"corridor", fx:"petals", text:"她跳完最后一个旋转，停在你面前，笑着哭了。" },
    { type:"line", who:"yunli", exp:"sad", text:"……谢谢你看完。其实，这是我「最后的舞台」。" },
    { type:"jump", to:"y_d1_main" },
    { type:"label", id:"y_d1_care" },
    { type:"line", who:"yunli", exp:"smile", text:"啊呀，这位修复师好凶哦~ 不过……我让你包。" },
    { type:"jump", to:"y_d1_main" },
    { type:"label", id:"y_d1_main" },
    { type:"narr", scene:"cabin", text:"医务舱。她坐在床沿，把绷带绕在你手腕上。" },
    { type:"line", who:"yunli", exp:"smile", scene:"cabin", text:"「最后的舞台」是我醒来记得的唯一一句话。但我不知道……是我的最后，还是别人给我的最后。" },
    { type:"line", who:"player", text:"想找回来吗？" },
    { type:"line", who:"yunli", exp:"sad", text:"想啊。但我害怕找回来之后，我会变成不爱跳舞的人。" },
    { type:"choice", options:[
      { text:"「那就别找了，做现在的你。」", aff:{yunli:1}, next:"y_d1_now" },
      { text:"「我陪你一起找。」", aff:{yunli:3}, flag:"with_y", next:"y_d1_now" }
    ]},
    { type:"label", id:"y_d1_now" },
    { type:"line", who:"yunli", exp:"smile", text:"……你这种人，真讨厌。一句话就让人想哭。" },
    { type:"cg", id:"yunli_cg1", title:"医务舱里的绷带", scene:"cabin" },
    { type:"narr", text:"Day 1 结束。修复进度：12%。" },

    { type:"chapter", day:2, name:"第二章 · 全息废墟", en:"Chapter 2 · Holographic Ruins" },
    { type:"narr", scene:"deck", text:"第二天。她非要拉你去看观景台。" },
    { type:"line", who:"yunli", exp:"smile", scene:"deck", text:"看~ 那颗会闪三下的星。我以前给它起过名字。" },
    { type:"line", who:"player", text:"叫什么？" },
    { type:"line", who:"yunli", exp:"smile", text:"叫「我」。因为我也总在被人忘记之前，先闪三下提醒一下。" },
    { type:"choice", options:[
      { text:"「我不会忘。」", aff:{yunli:3}, flag:"promise_y", next:"y_d2_a" },
      { text:"「那现在闪给我看。」", aff:{yunli:2}, next:"y_d2_a" },
      { text:"「……」（把手放在她手上）", aff:{yunli:3}, flag:"hand_y", next:"y_d2_a" }
    ]},
    { type:"label", id:"y_d2_a" },
    { type:"narr", scene:"deck", text:"她突然蹲下来，捂住了头。" },
    { type:"line", who:"yunli", exp:"sad", text:"想起来一点……我曾经有一个搭档。她在最后那场演出里……死了。" },
    { type:"line", who:"yunli", exp:"sad", text:"是我让她替我上的台。" },
    { type:"line", who:"player", text:"……" },
    { type:"choice", options:[
      { text:"「不是你的错。」", aff:{yunli:2}, next:"y_d2_close" },
      { text:"「就算是你的错，我也陪你扛。」", aff:{yunli:3}, flag:"share_y", next:"y_d2_close" },
      { text:"「先回到现在，深呼吸。」", aff:{yunli:1}, next:"y_d2_close" }
    ]},
    { type:"label", id:"y_d2_close" },
    { type:"cg", id:"yunli_cg2", title:"会闪三下的星", scene:"deck" },
    { type:"narr", text:"Day 2 结束。" },

    { type:"chapter", day:3, name:"第三章 · 重新登台", en:"Chapter 3 · Encore" },
    { type:"narr", scene:"cabin", text:"星舰主厅被改造成了一个临时舞台。她说她要重新跳一次「最后的舞台」——但这次，是为了告别也为了开始。" },
    { type:"line", who:"yunli", exp:"smile", scene:"cabin", text:"修复师，可以请你来当我的搭档吗？" },
    { type:"line", who:"player", text:"我不会跳。" },
    { type:"line", who:"yunli", exp:"smile", text:"那刚刚好。你只要站在那里，让我有理由不再独自跳。" },
    { type:"choice", options:[
      { text:"「好，我来。」", aff:{yunli:3}, next:"y_d3_dance" },
      { text:"「我看着你跳，更好。」", aff:{yunli:1}, next:"y_d3_watch" }
    ]},
    { type:"label", id:"y_d3_dance" },
    { type:"narr", scene:"cabin", fx:"petals", text:"她牵着你的手，转了一圈又一圈。这是星舰里第一场两个人的演出。" },
    { type:"jump", to:"y_d3_close" },
    { type:"label", id:"y_d3_watch" },
    { type:"narr", scene:"cabin", fx:"petals", text:"她在台上独舞，你在台下，比她更不敢眨眼。" },
    { type:"label", id:"y_d3_close" },
    { type:"line", who:"yunli", exp:"smile", text:"——谢谢你，让我知道，最后的舞台之后，还能有「再来一次」。" },
    { type:"cg", id:"yunli_cg3", title:"再来一次", scene:"cabin" },
    { type:"end", tag:"HE", title:"安可",
      en:"Encore · True End",
      body:"她从此把每一场演出叫做「再来一次」。你成了固定观众席第一排的那个人——她每跳完都会先看向你。" }
  ],

  /* ===========================
   *  银线（反差）
   * =========================== */
  yin: [
    { type:"chapter", day:1, name:"第一章 · 不会眨眼的人", en:"Chapter 1 · The Man Who Never Blinks" },
    { type:"narr", scene:"corridor", text:"星舰守卫舱。一个穿着银灰色守卫服的男人靠墙站立，眼睛是金色的，像两枚老式怀表。" },
    { type:"line", who:"yin", exp:"calm", scene:"corridor", text:"……你是新的修复师？" },
    { type:"line", who:"player", text:"（他不眨眼。也几乎不动。）是。" },
    { type:"line", who:"yin", exp:"calm", text:"我不需要修复。" },
    { type:"choice", options:[
      { text:"「但你登记里写了『请修复我』。」", aff:{yin:1}, next:"yin_d1_log" },
      { text:"「那我陪你站一会儿。」", aff:{yin:2}, flag:"silent_yin", next:"yin_d1_silent" },
      { text:"「你害怕想起什么。」", aff:{yin:2}, next:"yin_d1_log" }
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
    { type:"cg", id:"yin_cg1", title:"金色瞳孔", scene:"corridor" },
    { type:"narr", text:"Day 1 结束。" },

    { type:"chapter", day:2, name:"第二章 · 心跳停过 7 次", en:"Chapter 2 · Seven Stops" },
    { type:"narr", scene:"deck", text:"第二天。他在观景台等你，手里多了一个机械怀表。" },
    { type:"line", who:"yin", exp:"calm", scene:"deck", text:"我的心脏，是机械的。它停过 7 次。" },
    { type:"line", who:"yin", exp:"calm", text:"每停一次，我会忘掉一段感情。" },
    { type:"line", who:"player", text:"……所以你忘掉了 7 个人？" },
    { type:"line", who:"yin", exp:"sad", text:"不。" },
    { type:"line", who:"yin", exp:"sad", text:"是同一个人，我忘了 7 次。" },
    { type:"choice", options:[
      { text:"「让我看看你的左眼。」", aff:{yin:3}, flag:"see_yin", next:"yin_d2_see" },
      { text:"「那你这次想不起，是好事。」", aff:{yin:1}, next:"yin_d2_close" },
      { text:"「下次停的时候，我陪你。」", aff:{yin:3}, flag:"stay_yin", next:"yin_d2_close" }
    ]},
    { type:"label", id:"yin_d2_see" },
    { type:"narr", scene:"deck", fx:"flash", text:"他闭上眼，把左眼的视觉投向空中。是一个一直在笑的女孩，每一帧都不一样年龄。" },
    { type:"line", who:"yin", exp:"sad", text:"我不知道她是谁。但每一次重启，我都会先认出她的笑。" },
    { type:"label", id:"yin_d2_close" },
    { type:"cg", id:"yin_cg2", title:"机械怀表", scene:"deck" },
    { type:"narr", text:"Day 2 结束。" },

    { type:"chapter", day:3, name:"第三章 · 第八次", en:"Chapter 3 · The 8th Time" },
    { type:"narr", scene:"archive", text:"档案库。系统警报：守卫 Y-01 心跳异常，机械心脏即将进入第 8 次停跳。" },
    { type:"line", who:"yin", exp:"sad", scene:"archive", text:"……来了。" },
    { type:"line", who:"yin", exp:"sad", text:"修复师，听我说。" },
    { type:"line", who:"yin", exp:"sad", text:"我重启之后，会忘掉你。" },
    { type:"line", who:"yin", exp:"sad", text:"但请你，下次也先认出我。" },
    { type:"choice", options:[
      { text:"「我会的。」", aff:{yin:3}, next:"yin_d3_a" },
      { text:"「你不要重启。我留你。」", aff:{yin:2}, flag:"stop_restart", next:"yin_d3_b" },
      { text:"「让我替你记住。」", aff:{yin:3}, flag:"keep_for_him", next:"yin_d3_a" }
    ]},
    { type:"label", id:"yin_d3_a" },
    { type:"narr", scene:"archive", fx:"flash", text:"他握住你的手。机械心脏停下的那一瞬间，舱内灯光全部熄灭，只剩他金色的瞳孔。" },
    { type:"jump", to:"yin_d3_close" },
    { type:"label", id:"yin_d3_b" },
    { type:"narr", scene:"archive", fx:"flash", text:"你按下中止按钮。系统报错。但他还活着，只是会带着痛活下去。" },
    { type:"label", id:"yin_d3_close" },
    { type:"line", who:"yin", exp:"smile", text:"……第 8 次。我先认出了你。" },
    { type:"cg", id:"yin_cg3", title:"先认出你", scene:"archive" },
    { type:"end", tag:"HE", title:"第八次重逢",
      en:"The 8th Reunion · True End",
      body:"他从此每天醒来，会先看着你说一句「早。」——这是他训练自己永远先认出你的练习。" }
  ]
};
