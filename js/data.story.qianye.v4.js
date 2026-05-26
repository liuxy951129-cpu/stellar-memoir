/* ============ 千夜线 v4 完整版 · 3 小时实玩 ============
 * 13 章 + 6 日常 + 2 隐藏 + 5 BE + 1 NE + 1 GE + 1 TE
 * 关键 flag：
 *   countdown_pass / coffee_b / lie_about_id / scar_seen / vow_typed
 *   crisis_passed / mini_qy_perfect / kiss_count / truth_qianye
 * ============================================================= */
(function(){
  if (!window.STORY) window.STORY = {};

  window.STORY.qianye = [
    /* ============== Day 1 ============== */
    /* ---- Ch1 醒来（含倒计时） ---- */
    { type:"chapter", day:1, name:"第一章 · 醒来", en:"Ch.1 · Awakening", scene:"deck" },
    { type:"narr", scene:"deck", text:"星舰「忘川号」漂浮在猎户臂的边缘。十二年了，乘客舱里仍维持着零下 196 度的沉睡。" },
    { type:"narr", scene:"deck", text:"你的工作牌写着「记忆修复师 · M-?」，编号位置被一道刻痕划掉了。" },
    { type:"narr", scene:"deck", text:"系统提示：A-07 — 林千夜 / 女 / 28 岁 / 沉睡前职业：理论物理学家 / 失忆原因：神经突触主动屏蔽。" },
    { type:"narr", scene:"deck", text:"——主动屏蔽。她自己选择了忘记。这是你接到的第一份病历。" },
    { type:"line", who:"narrator", text:"——加压完成。胶囊舱开启倒计时进行中。" },
    { type:"narr", scene:"deck", fx:"flash", text:"白雾散开，一个穿着白色实验袍的身影缓缓睁开眼。" },
    { type:"line", who:"qianye", exp:"calm", scene:"deck", text:"……你好。" },
    { type:"line", who:"qianye", exp:"calm", text:"请问，这里的引力常数变了吗？" },
    { type:"line", who:"player", text:"（这就是她醒来的第一句话？理论物理学家的浪漫……？）" },
    { type:"line", who:"narrator", text:"系统检测到 A-07 的神经接口在重启，5 秒内必须有「修复师在场回应」，否则进入二次冷冻。" },
    { type:"countdown", text:"她在等你的回答。说错或不说，她会被重新冻结 6 个月。", seconds:6,
      options:[
        { text:"没变。还是 9.81。", success:true, flag:"countdown_pass", aff:{qianye:2}, next:"q_ch1_after_resp" },
        { text:"……改变了一点点。", success:false, aff:{qianye:-1}, next:"q_ch1_after_resp" },
        { text:"（沉默）", timeout:true, success:false, aff:{qianye:-3}, flag:"countdown_fail", next:"q_ch1_after_resp" }
      ]
    },
    { type:"label", id:"q_ch1_after_resp" },
    { type:"line", who:"qianye", exp:"smile", scene:"deck", text:"那就好。看来宇宙学常数也没变。我可以放心地开始忘记了。" },
    { type:"line", who:"player", text:"……开始忘记？" },
    { type:"line", who:"qianye", exp:"calm", text:"你以为我现在还记得？我已经忘了。我只是在练习「告诉别人这件事」的语气。" },
    { type:"line", who:"qianye", exp:"calm", text:"修复师，你的工作开始了。" },
    /* BE1 trigger: countdown_fail 之后再叠加冷漠选项就会 BE1 */

    /* ---- Ch2 三件事 ---- */
    { type:"chapter", day:1, name:"第二章 · 三件事", en:"Ch.2 · Three Things", scene:"deck" },
    { type:"line", who:"qianye", exp:"calm", scene:"deck", text:"我只记得三件事。第一，我做的最后一个实验是「跨星际记忆迁移」。" },
    { type:"line", who:"qianye", exp:"calm", text:"第二，银河旋臂的进动周期是 2.46 亿年。" },
    { type:"line", who:"qianye", exp:"sad", text:"第三，一句话——「答应我，下一次相遇，你要先认出我。」" },
    { type:"line", who:"qianye", exp:"calm", text:"我不记得是谁说的。" },
    { type:"line", who:"player", text:"（这一定是给一个对她很重要的人。）" },
    { type:"choice", options:[
      { text:"第三件最重要，让我帮你找。", aff:{qianye:2}, flag:"care_third", next:"q_ch2_a" },
      { text:"前两个是科学事实，可以从档案库找回。", aff:{qianye:1}, next:"q_ch2_a" },
      { text:"也许你记得的「不是这三件」，而是「其他都被你藏起来了」。", aff:{qianye:3}, flag:"insight_q", next:"q_ch2_b" }
    ]},
    { type:"label", id:"q_ch2_a" },
    { type:"line", who:"qianye", exp:"smile", text:"……你比我想象中聪明一点点。" },
    { type:"jump", to:"q_ch2_main" },
    { type:"label", id:"q_ch2_b" },
    { type:"line", who:"qianye", exp:"shy", text:"……" },
    { type:"line", who:"qianye", exp:"calm", text:"修复师，第一天就拆穿我，你不嫌不礼貌？" },
    { type:"line", who:"qianye", exp:"smile", text:"但我喜欢这种不礼貌。" },
    { type:"jump", to:"q_ch2_main" },
    { type:"label", id:"q_ch2_main" },
    { type:"line", who:"qianye", exp:"calm", text:"修复师，让我看看你。" },
    { type:"choice", options:[
      { text:"看吧。", aff:{qianye:1}, next:"q_ch2_close" },
      { text:"我没什么好看的。", aff:{qianye:0}, next:"q_ch2_close" },
      { text:"你想看什么？", aff:{qianye:2}, flag:"flirt_q", next:"q_ch2_close" }
    ]},
    { type:"label", id:"q_ch2_close" },
    { type:"line", who:"qianye", exp:"calm", text:"……你的眼神，我好像在哪里见过。" },
    { type:"line", who:"player", text:"（你的心，开始有点不规律。）" },

    /* ---- Ch3 编号空格（触摸） ---- */
    { type:"chapter", day:1, name:"第三章 · 编号空格", en:"Ch.3 · The Blank Number", scene:"corridor" },
    { type:"narr", scene:"corridor", text:"她注意到你的工作牌。" },
    { type:"line", who:"qianye", exp:"calm", scene:"corridor", text:"M 后面是空的？" },
    { type:"line", who:"qianye", exp:"calm", text:"修复师统一编号是 M-XX-XX。三段。你的中段缺失。" },
    { type:"line", who:"player", text:"（你低头看了看自己的工作牌——你之前没注意。）" },
    { type:"touch",
      text:"看看你自己的工作牌：哪里被刻痕划掉了？",
      img:"assets/portraits/qianye.png",
      hint:"点击你看到的可疑位置",
      regions:[
        { x:50, y:20, r:8, label:"最上方", flag:"touch_top", aff:{qianye:0} },
        { x:50, y:50, r:9, label:"中段刻痕", flag:"clue_a08", aff:{qianye:2}, next:"q_ch3_after_touch" },
        { x:50, y:80, r:8, label:"最下方", flag:"touch_bottom", aff:{qianye:-1} }
      ]
    },
    { type:"label", id:"q_ch3_after_touch" },
    { type:"line", who:"qianye", exp:"sad", text:"……和我神经接口签字纸上的那道刻痕，一模一样。" },
    { type:"line", who:"player", text:"（你的呼吸……忽然变浅了。）" },
    { type:"choice", options:[
      { text:"也许是同款工艺。", aff:{qianye:0}, flag:"lie_about_id", next:"q_ch3_after" },
      { text:"我不知道为什么是空的。", aff:{qianye:1}, next:"q_ch3_after" },
      { text:"我也想知道。但说实话——我害怕知道。", aff:{qianye:3}, flag:"honest_q", next:"q_ch3_after" }
    ]},
    { type:"label", id:"q_ch3_after" },
    { type:"line", who:"qianye", exp:"calm", text:"……害怕。我喜欢你说出这个词。" },
    { type:"line", who:"qianye", exp:"calm", text:"理性的人，从来不轻易说害怕。" },

    /* ---- Ch4 第一杯咖啡（拖拽） ---- */
    { type:"chapter", day:1, name:"第四章 · 第一杯咖啡", en:"Ch.4 · The First Coffee", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"傍晚。她说她没喝咖啡 12 年了。" },
    { type:"line", who:"qianye", exp:"smile", scene:"cabin", text:"修复师，给我配一杯。" },
    { type:"line", who:"player", text:"我自己来配？" },
    { type:"line", who:"qianye", exp:"smile", text:"我以前最爱的配方，是「3 浓缩 + 1 牛奶 + 1 糖」。三比一比一。" },
    { type:"line", who:"qianye", exp:"calm", text:"但你听到我说的是这个比例之前——选你自己想配的。" },
    { type:"drag",
      text:"把配料拖入正确的格子，做一杯她可能喜欢的咖啡。",
      hint:"想想她说的「3:1:1」这个比例（提示：浓缩咖啡是主角）",
      items:[
        { label:"浓缩 ×3" }, { label:"牛奶 ×1" }, { label:"糖 ×1" },
        { label:"白兰地" }, { label:"焦糖" }
      ],
      targets:[
        { id:"main", label:"主体" },
        { id:"sub",  label:"中和" },
        { id:"sweet", label:"甜味" }
      ],
      answer:{ "0":"main", "1":"sub", "2":"sweet" },
      success:{ flag:"coffee_b", aff:{qianye:3}, next:"q_ch4_perfect" },
      fail:{ flag:"coffee_off", aff:{qianye:0}, next:"q_ch4_off" }
    },
    { type:"label", id:"q_ch4_perfect" },
    { type:"line", who:"qianye", exp:"smile", text:"……" },
    { type:"line", who:"qianye", exp:"smile", text:"这是 12 年前我自己配的最后一杯。" },
    { type:"line", who:"qianye", exp:"shy", text:"修复师，你的手指——是会记得的。" },
    { type:"line", who:"player", text:"（你的手指真的有点抖。但你不知道为什么。）" },
    { type:"jump", to:"q_ch4_close" },
    { type:"label", id:"q_ch4_off" },
    { type:"line", who:"qianye", exp:"calm", text:"……" },
    { type:"line", who:"qianye", exp:"smile", text:"也行。新的口味。我现在是新的人。" },
    { type:"label", id:"q_ch4_close" },
    { type:"cg", id:"qianye_cg1", title:"第一杯咖啡", scene:"cabin", img:"qianye_d1" },
    { type:"mail", id:"sys_d1", role:"system", title:"修复师 · 日报", body:"Day 1 完成。A-07 修复进度：8% → 12%。\n\n附：你的工作牌中段编号缺失，已上报维护组。" },
    { type:"narr", text:"=== Day 1 主线结束 ===" },

    /* ---- Day 1 日常 1：星图笔记 ---- */
    { type:"chapter", day:1, name:"日常 · 星图笔记", en:"Daily · Star Notebook", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"晚上她送你一本笔记本。扉页有一行褪色的字迹。" },
    { type:"line", who:"qianye", exp:"calm", scene:"cabin", text:"我醒来时口袋里就有这个。" },
    { type:"line", who:"qianye", exp:"calm", text:"扉页那行字——我看不清。" },
    { type:"choice", options:[
      { text:"让我看看。", aff:{qianye:1}, next:"q_d1_note_a" },
      { text:"也许故意被擦掉。", aff:{qianye:1}, flag:"erased_q", next:"q_d1_note_a" },
      { text:"不要看了。属于你的，让你自己慢慢想起来。", aff:{qianye:3}, flag:"respect_q", next:"q_d1_note_b" }
    ]},
    { type:"label", id:"q_d1_note_a" },
    { type:"line", who:"player", text:"（你侧着光看，隐约是一个名字——林.夕？还是别的什么）" },
    { type:"jump", to:"q_d1_note_close" },
    { type:"label", id:"q_d1_note_b" },
    { type:"line", who:"qianye", exp:"shy", text:"……谢谢。" },
    { type:"line", who:"qianye", exp:"shy", text:"我会想起来的。等我想起来的那天，我先告诉你。" },
    { type:"label", id:"q_d1_note_close" },

    /* ---- Day 1 日常 2：失眠（触摸） ---- */
    { type:"chapter", day:1, name:"日常 · 失眠夜", en:"Daily · Sleepless", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"凌晨 2:47。她发来语音通话。" },
    { type:"line", who:"qianye", exp:"sad", text:"……修复师，我睡不着。" },
    { type:"line", who:"qianye", exp:"sad", text:"每次闭眼，都像在重新进入胶囊。" },
    { type:"choice", options:[
      { text:"开视频，让我看到你。", aff:{qianye:2}, next:"q_d1_sleep_video" },
      { text:"我去你那。", aff:{qianye:3}, flag:"physical_q", next:"q_d1_sleep_visit" },
      { text:"数 9.81 个数。", aff:{qianye:3}, flag:"witty_q", next:"q_d1_sleep_count" }
    ]},
    { type:"label", id:"q_d1_sleep_video" },
    { type:"line", who:"qianye", exp:"smile", text:"……你这副刚被吵醒的样子很难看。" },
    { type:"line", who:"qianye", exp:"smile", text:"但很可爱。" },
    { type:"jump", to:"q_d1_sleep_close" },
    { type:"label", id:"q_d1_sleep_visit" },
    { type:"line", who:"qianye", exp:"shy", text:"……" },
    { type:"line", who:"qianye", exp:"shy", text:"门没锁。" },
    { type:"narr", scene:"cabin", text:"舱内只有她床头一盏蓝光。她没有看你，背对着你。" },
    { type:"touch",
      text:"她在颤抖。你想做什么？",
      img:"assets/portraits/qianye_sad.png",
      hint:"不必每次都做选择，有时候只是一个动作",
      regions:[
        { x:50, y:25, r:8, label:"摸头", flag:"touch_head", aff:{qianye:2}, next:"q_d1_sleep_touch_after" },
        { x:50, y:55, r:9, label:"握手", flag:"touch_hand", aff:{qianye:3}, next:"q_d1_sleep_touch_after" },
        { x:50, y:78, r:8, label:"轻拍肩", flag:"touch_shoulder", aff:{qianye:2}, next:"q_d1_sleep_touch_after" }
      ]
    },
    { type:"label", id:"q_d1_sleep_touch_after" },
    { type:"line", who:"qianye", exp:"shy", text:"……我可以靠一下吗。" },
    { type:"line", who:"player", text:"（她什么都没说，但你已经把头借给她。）" },
    { type:"jump", to:"q_d1_sleep_close" },
    { type:"label", id:"q_d1_sleep_count" },
    { type:"line", who:"qianye", exp:"smile", text:"……一……二……" },
    { type:"line", who:"qianye", exp:"smile", text:"……数到 6 的时候我已经睡着了。" },
    { type:"label", id:"q_d1_sleep_close" },
    { type:"narr", text:"=== 日常结束 ===" },

    /* ============== Day 2 ============== */
    /* ---- Ch5 雨中花园（QTE） ---- */
    { type:"chapter", day:2, name:"第五章 · 雨中花园", en:"Ch.5 · Rain in the Garden", scene:"garden" },
    { type:"narr", scene:"garden", fx:"rain", text:"全息花园 · 雨。雨落在皮肤上是温的，因为这是模拟。" },
    { type:"line", who:"qianye", exp:"calm", scene:"garden", fx:"rain", text:"修复师，你听过雨声里藏的歌吗？" },
    { type:"line", who:"qianye", exp:"smile", text:"我哼一段，你跟拍——能跟上的话，我送你一颗记忆碎片。" },
    { type:"qte",
      text:"千夜在雨里哼歌。跟着她的节拍，按下「击中」。",
      beats:6,
      intervalMs:1100,
      success:{ flag:"mini_qy_perfect", aff:{qianye:3}, next:"q_ch5_qte_pass" },
      fail:{ flag:"mini_qy_fail", aff:{qianye:0}, next:"q_ch5_qte_miss" }
    },
    { type:"label", id:"q_ch5_qte_pass" },
    { type:"line", who:"qianye", exp:"smile", text:"……你怎么会跟拍？" },
    { type:"line", who:"qianye", exp:"smile", text:"这是我研究室里只放给一个人听过的旋律。" },
    { type:"line", who:"player", text:"（你不知道为什么会跟。但你知道这件事。）" },
    { type:"jump", to:"q_ch5_after_qte" },
    { type:"label", id:"q_ch5_qte_miss" },
    { type:"line", who:"qianye", exp:"calm", text:"……没关系。" },
    { type:"line", who:"qianye", exp:"smile", text:"也许你以后会记得。" },
    { type:"label", id:"q_ch5_after_qte" },
    { type:"line", who:"qianye", exp:"sad", text:"……你戴过眼镜吗？" },
    { type:"line", who:"player", text:"……？没戴过。" },
    { type:"line", who:"qianye", exp:"sad", text:"奇怪。我看你的时候，总觉得你眼睛被某种镜片折射过。" },

    /* ---- Ch6 信任考验（打字输入） ---- */
    { type:"chapter", day:2, name:"第六章 · 信任考验", en:"Ch.6 · The Vow", scene:"garden" },
    { type:"line", who:"qianye", exp:"calm", scene:"garden", text:"修复师。我现在要请你做一件事。" },
    { type:"line", who:"qianye", exp:"calm", text:"我把那句不知道是谁对我说的话，让你亲手写一遍。" },
    { type:"line", who:"qianye", exp:"sad", text:"如果是你写的，我会知道。" },
    { type:"typing",
      text:"亲手把她的那句话写下来。",
      prompt:"答应我，下一次相遇，你要先认出我。",
      answer:"答应我，下一次相遇，你要先认出我。",
      tolerance:4,
      hint:"输入完成后按 Enter 或回车",
      success:{ flag:"vow_typed", aff:{qianye:4}, next:"q_ch6_vow_pass" },
      fail:{ flag:"vow_failed", aff:{qianye:-1}, next:"q_ch6_vow_fail" }
    },
    { type:"label", id:"q_ch6_vow_pass" },
    { type:"line", who:"qianye", exp:"shy", text:"……" },
    { type:"line", who:"qianye", exp:"shy", text:"修复师，我今天不打算再叫你修复师了。" },
    { type:"line", who:"player", text:"那叫我什么？" },
    { type:"line", who:"qianye", exp:"smile", text:"——我还在想。也许下一章，我会想出来。" },
    { type:"jump", to:"q_ch6_close" },
    { type:"label", id:"q_ch6_vow_fail" },
    { type:"line", who:"qianye", exp:"sad", text:"……不是这一句。" },
    { type:"line", who:"qianye", exp:"sad", text:"也对，凭什么是你呢。" },
    { type:"label", id:"q_ch6_close" },
    { type:"cg", id:"qianye_cg2", title:"全息雨中的承诺", scene:"garden", img:"qianye_d2" },

    /* ---- Ch7 共同回忆（滑动） ---- */
    { type:"chapter", day:2, name:"第七章 · 共同回忆", en:"Ch.7 · Shared Memory", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"她在你面前坐下。她的额发遮住了大半边脸。" },
    { type:"line", who:"qianye", exp:"calm", scene:"cabin", text:"我醒来后，第一次照镜子，发现额头有一道疤。" },
    { type:"line", who:"qianye", exp:"calm", text:"我不记得是哪里来的。" },
    { type:"line", who:"qianye", exp:"shy", text:"修复师……你帮我看看。" },
    { type:"swipe",
      text:"慢慢拨开她额前的发帘。",
      direction:"left",
      dirHint:"向左滑",
      reveal:"assets/cg/qianye_he.png",
      success:{ flag:"scar_seen", aff:{qianye:3}, next:"q_ch7_scar_seen" },
      fail:{ next:"q_ch7_scar_miss" }
    },
    { type:"label", id:"q_ch7_scar_seen" },
    { type:"line", who:"player", text:"（一道横在左额的浅疤，形状像一道阶梯。）" },
    { type:"line", who:"player", text:"（你心里「咔」地一声——这是你小时候和你妹妹打闹留的疤。）" },
    { type:"anomaly", text:"⚠ 玩家身份耦合度 +20% · clue_scar 解锁", clue:"clue_scar" },
    { type:"line", who:"qianye", exp:"sad", text:"看到了？" },
    { type:"line", who:"player", text:"……看到了。" },
    { type:"line", who:"qianye", exp:"sad", text:"那你愿意告诉我，是怎么留的吗？" },
    { type:"choice", options:[
      { text:"是和你妹妹打闹的时候，你撞到楼梯。", aff:{qianye:3}, flag:"truth_scar", next:"q_ch7_close" },
      { text:"我不知道。但我会帮你查清楚。", aff:{qianye:1}, next:"q_ch7_close" },
      { text:"对不起，我说不出口。", aff:{qianye:0}, flag:"choke_q", next:"q_ch7_close" }
    ]},
    { type:"jump", to:"q_ch7_close" },
    { type:"label", id:"q_ch7_scar_miss" },
    { type:"line", who:"qianye", exp:"sad", text:"……没事。我下次再让你看。" },
    { type:"label", id:"q_ch7_close" },

    /* ---- Ch8 重大冲突 ---- */
    { type:"chapter", day:2, name:"第八章 · 重大冲突", en:"Ch.8 · Confrontation", scene:"corridor" },
    { type:"narr", scene:"corridor", text:"她忽然在走廊拦住你。" },
    { type:"line", who:"qianye", exp:"sad", scene:"corridor", text:"修复师。我问你一个问题，请你不要思考超过 3 秒。" },
    { type:"line", who:"qianye", exp:"sad", text:"——你是修复师，还是认识我的人？" },
    { type:"countdown", text:"她在等你的回答。", seconds:4,
      options:[
        { text:"我是修复师。", success:false, flag:"choice_repair", aff:{qianye:0}, next:"q_ch8_repair" },
        { text:"我是认识你的人。", success:true, flag:"choice_know", aff:{qianye:3}, next:"q_ch8_know" },
        { text:"两个都是。", success:true, flag:"choice_both", aff:{qianye:4}, next:"q_ch8_both" },
        { text:"（沉默）", timeout:true, success:false, flag:"choice_silence", aff:{qianye:-3}, next:"q_ch8_silence" }
      ]
    },
    { type:"label", id:"q_ch8_repair" },
    { type:"line", who:"qianye", exp:"sad", text:"……好。" },
    { type:"line", who:"qianye", exp:"sad", text:"那请保持你的专业距离。" },
    { type:"jump", to:"q_ch8_close" },
    { type:"label", id:"q_ch8_know" },
    { type:"line", who:"qianye", exp:"shy", text:"……" },
    { type:"line", who:"qianye", exp:"shy", text:"我知道。但我希望你亲口说。" },
    { type:"jump", to:"q_ch8_close" },
    { type:"label", id:"q_ch8_both" },
    { type:"line", who:"qianye", exp:"smile", text:"……你比我想象中的诚实。" },
    { type:"jump", to:"q_ch8_close" },
    { type:"label", id:"q_ch8_silence" },
    { type:"line", who:"qianye", exp:"sad", text:"……好。" },
    { type:"line", who:"qianye", exp:"sad", text:"那我也保持我的沉默。" },
    /* BE2 触发：silence + lie_about_id */
    { type:"jump", to:"q_ch8_close" },
    { type:"label", id:"q_ch8_close" },
    { type:"narr", text:"=== Day 2 主线结束 ===" },

    /* ---- Day 2 日常 3：送花 ---- */
    { type:"chapter", day:2, name:"日常 · 送花", en:"Daily · The Flower", scene:"garden" },
    { type:"narr", scene:"garden", text:"花园里有一朵全息蓝花，是稀有品。" },
    { type:"choice", options:[
      { text:"摘下来送给她。", aff:{qianye:2}, gift:"flower", next:"q_d2_flower_a" },
      { text:"留在原处。带她过来看。", aff:{qianye:3}, flag:"share_view", next:"q_d2_flower_b" },
      { text:"自己留着。我也喜欢花。", aff:{qianye:0}, next:"q_d2_flower_a" }
    ]},
    { type:"label", id:"q_d2_flower_a" },
    { type:"line", who:"qianye", exp:"smile", text:"……谢谢。" },
    { type:"jump", to:"q_d2_flower_close" },
    { type:"label", id:"q_d2_flower_b" },
    { type:"line", who:"qianye", exp:"shy", text:"修复师，你让我看花，是不是觉得我也是要被看的？" },
    { type:"line", who:"qianye", exp:"smile", text:"……没事。我让你看了。" },
    { type:"label", id:"q_d2_flower_close" },

    /* ---- Day 2 日常 4：合作小游戏 ---- */
    { type:"chapter", day:2, name:"日常 · 双人记忆碎片", en:"Daily · Co-op Memory", scene:"cabin" },
    { type:"narr", scene:"cabin", text:"她说她想和你一起玩一个游戏。" },
    { type:"choice", options:[
      { text:"来。", aff:{qianye:1}, mini:"qy", next:"q_d2_coop_after" },
      { text:"我们换个安静一点的事情。", aff:{qianye:2}, flag:"quiet_q", next:"q_d2_coop_after" }
    ]},
    { type:"label", id:"q_d2_coop_after" },
    { type:"narr", text:"=== 日常结束 ===" },

    /* ---- 隐藏章 · 双胞胎记忆（需 scar_seen） ---- */
    { type:"chapter", day:2, name:"隐藏 · 双胞胎记忆", en:"Hidden · The Twins", scene:"archive" },
    { type:"narr", scene:"archive", text:"档案库深处。她调出一个尘封文件。" },
    { type:"line", who:"qianye", exp:"sad", scene:"archive", text:"……我有一个双胞胎兄弟。" },
    { type:"line", who:"qianye", exp:"sad", text:"他叫林夕。他在我做实验那年，把自己也送进了胶囊。" },
    { type:"line", who:"qianye", exp:"sad", text:"——他签下的那行字，被刻痕划掉了。" },
    { type:"line", who:"player", text:"（你的呼吸——又一次变浅。）" },
    { type:"choice", options:[
      { text:"……他叫什么？再说一次。", aff:{qianye:1}, next:"q_hidden1_a" },
      { text:"他长什么样？", aff:{qianye:2}, flag:"want_to_know_lin", next:"q_hidden1_b" },
      { text:"他是不是……和我有点像？", aff:{qianye:4}, flag:"hint_self_q", next:"q_hidden1_c" }
    ]},
    { type:"label", id:"q_hidden1_a" },
    { type:"line", who:"qianye", exp:"sad", text:"林夕。林。夕。" },
    { type:"jump", to:"q_hidden1_close" },
    { type:"label", id:"q_hidden1_b" },
    { type:"line", who:"qianye", exp:"sad", text:"和你像。" },
    { type:"line", who:"qianye", exp:"sad", text:"非常非常像。" },
    { type:"jump", to:"q_hidden1_close" },
    { type:"label", id:"q_hidden1_c" },
    { type:"line", who:"qianye", exp:"shy", text:"……" },
    { type:"line", who:"qianye", exp:"shy", text:"修复师，我现在不敢看你的脸了。" },
    { type:"jump", to:"q_hidden1_close" },
    { type:"label", id:"q_hidden1_close" },
    { type:"anomaly", text:"⚠ 隐藏剧情解锁 · 林夕（玩家本人）", clue:"clue_lin_xi" },

    /* ============== Day 3 ============== */
    /* ---- Ch9 危机（倒计时 + 拖拽） ---- */
    { type:"chapter", day:3, name:"第九章 · 危机", en:"Ch.9 · Crisis", scene:"archive" },
    { type:"narr", scene:"archive", fx:"flash", text:"系统警报：A-07 神经接口故障。10 秒内须修复，否则记忆永久封存。" },
    { type:"countdown", text:"听好——10 秒内你必须做出第一步反应。", seconds:4,
      options:[
        { text:"打开她的接口仓盖。", success:true, flag:"crisis_step1", next:"q_ch9_step1_ok" },
        { text:"先扶住她。", success:false, flag:"hold_q", next:"q_ch9_step1_hold" },
        { text:"叫援助。", success:false, next:"q_ch9_step1_call" }
      ]
    },
    { type:"label", id:"q_ch9_step1_hold" },
    { type:"line", who:"qianye", exp:"sad", text:"……不是先扶我。先开仓盖。" },
    { type:"jump", to:"q_ch9_step1_ok" },
    { type:"label", id:"q_ch9_step1_call" },
    { type:"line", who:"qianye", exp:"sad", text:"……来不及了。修复师，你来。" },
    { type:"label", id:"q_ch9_step1_ok" },
    { type:"narr", scene:"archive", text:"仓盖打开。三个零件散落在你面前。" },
    { type:"drag",
      text:"把正确的零件拖入接口。一次机会。",
      hint:"她说过：「主」「中和」「甜」三段——这次不是咖啡，是神经导线",
      items:[ { label:"主导线" }, { label:"中和器" }, { label:"调节阀" } ],
      targets:[
        { id:"main", label:"主接口" },
        { id:"sub",  label:"调节" },
        { id:"sweet", label:"反馈" }
      ],
      answer:{ "0":"main", "1":"sub", "2":"sweet" },
      success:{ flag:"crisis_passed", aff:{qianye:5}, next:"q_ch9_pass" },
      fail:{ flag:"crisis_failed", aff:{qianye:-3}, next:"q_ch9_fail" }
    },
    { type:"label", id:"q_ch9_fail" },
    { type:"line", who:"qianye", exp:"sad", text:"……" },
    { type:"line", who:"qianye", exp:"sad", text:"修复师……你的手在抖。" },
    { type:"narr", scene:"archive", fx:"flash", text:"她的神经接口冒出蓝色火花。" },
    { type:"be", title:"BE · 错误的修复",
      en:"Wrong Repair",
      body:"你慌了。零件接错了一根。\n她的记忆被永久压缩。胶囊舱重新封闭。\n你站在档案库里很久——但她不会再为你醒来。" },
    { type:"label", id:"q_ch9_pass" },
    { type:"line", who:"qianye", exp:"shy", text:"……" },
    { type:"line", who:"qianye", exp:"shy", text:"修复师，你的手——和我哥哥一样稳。" },

    /* ---- Ch10 真相揭示 ---- */
    { type:"chapter", day:3, name:"第十章 · 真相", en:"Ch.10 · The Truth", scene:"archive" },
    { type:"line", who:"qianye", exp:"calm", scene:"archive", text:"我现在告诉你 12 年前的全部。" },
    { type:"line", who:"qianye", exp:"sad", text:"我的实验，把我的记忆传送到了「未来与我相遇的人」脑中。" },
    { type:"line", who:"qianye", exp:"sad", text:"那时只有一个候选人——我哥哥林夕。" },
    { type:"line", who:"qianye", exp:"sad", text:"但他在事故里被植入了机械义体。" },
    { type:"line", who:"qianye", exp:"sad", text:"系统说他活下来了。但他自己说他死了。" },
    { type:"line", who:"qianye", exp:"sad", text:"于是他把自己的记忆，又传给了下一个人。" },
    { type:"line", who:"qianye", exp:"sad", text:"——也就是「修复师」这个身份。" },
    { type:"line", who:"player", text:"……" },
    { type:"swipe",
      text:"慢慢握住她的手——她在颤抖。",
      direction:"right",
      dirHint:"向右滑 · 握住",
      reveal:"assets/cg/qianye_he.png",
      success:{ flag:"hand_q", aff:{qianye:3}, next:"q_ch10_after" },
      fail:{ next:"q_ch10_after" }
    },
    { type:"label", id:"q_ch10_after" },

    /* ---- Ch11 第二次抉择 ---- */
    { type:"chapter", day:3, name:"第十一章 · 第二次抉择", en:"Ch.11 · The Second Choice", scene:"archive" },
    { type:"line", who:"qianye", exp:"sad", scene:"archive", text:"修复师……不。我决定叫你的名字。" },
    { type:"line", who:"qianye", exp:"sad", text:"——你叫什么？" },
    { type:"typing",
      text:"亲手输入你的名字。",
      prompt:"如果你已经认识到你是谁——写下「林夕」。",
      answer:"林夕",
      tolerance:0,
      success:{ flag:"truth_qianye", aff:{qianye:5}, next:"q_ch11_pass" },
      fail:{ flag:"truth_failed", aff:{qianye:-1}, next:"q_ch11_fail" }
    },
    { type:"label", id:"q_ch11_pass" },
    { type:"line", who:"qianye", exp:"shy", text:"……终于。" },
    { type:"line", who:"qianye", exp:"shy", text:"林夕，你回来了。" },
    { type:"jump", to:"q_ch11_close" },
    { type:"label", id:"q_ch11_fail" },
    { type:"line", who:"qianye", exp:"sad", text:"……" },
    { type:"line", who:"qianye", exp:"sad", text:"那我再等一会儿。" },
    { type:"label", id:"q_ch11_close" },

    /* ---- Ch12 高潮（QTE + CG） ---- */
    { type:"chapter", day:3, name:"第十二章 · 高潮", en:"Ch.12 · The Climax", scene:"archive" },
    { type:"narr", scene:"archive", fx:"flash", text:"档案库的胶囊全部启动。光从胸口溢出来。" },
    { type:"line", who:"qianye", exp:"smile", scene:"archive", text:"陪我走完最后一段记忆走廊。" },
    { type:"qte",
      text:"她的心跳和你同步——别让节奏断。",
      beats:8,
      intervalMs:900,
      success:{ flag:"climax_passed", aff:{qianye:3}, next:"q_ch12_pass" },
      fail:{ flag:"climax_failed", aff:{qianye:-2}, next:"q_ch12_fail" }
    },
    { type:"label", id:"q_ch12_pass" },
    { type:"narr", scene:"archive", text:"你和她的呼吸同步了 8 次。所有记忆点亮。" },
    { type:"jump", to:"q_ch12_close" },
    { type:"label", id:"q_ch12_fail" },
    { type:"narr", scene:"archive", text:"你的节奏断了一拍。她的记忆也断了一段。" },
    { type:"label", id:"q_ch12_close" },
    { type:"cg", id:"qianye_cg3", title:"同一个常数", scene:"archive", img:"qianye_he" },

    /* ---- 隐藏章：镜中林夕 ---- */
    { type:"chapter", day:3, name:"隐藏 · 镜中林夕", en:"Hidden · Mirror", scene:"archive" },
    { type:"narr", scene:"archive", text:"档案库深处的镜面舱。你看见自己——和她哥哥的脸重叠。" },
    { type:"player_silhouette", text:"（剪影站在镜里。）" },
    { type:"line", who:"narrator", text:"……终于。" },
    { type:"line", who:"narrator", text:"我们都在等你认出自己。" },
    { type:"player_reveal" },
    { type:"line", who:"player", text:"（你笑了。也哭了。）" },

    /* ---- Ch13 后日谈 + 结局判定 ---- */
    { type:"chapter", day:3, name:"第十三章 · 后日谈", en:"Ch.13 · Aftermath", scene:"deck" },
    { type:"narr", scene:"deck", text:"星舰穿过新的星云。她坐在你旁边。" },
    { type:"line", who:"qianye", exp:"smile", scene:"deck", text:"林夕。" },
    { type:"line", who:"qianye", exp:"smile", text:"下一次相遇，你要先认出我。" },
    { type:"line", who:"player", text:"……我已经认出了。" },
    { type:"end", tag:"HE", title:"恒星轨道",
      en:"Stellar Orbit · True End",
      body:"你不再叫修复师。\n你陪她重新研究跨星际记忆。\n下一次相遇——你们已经先认出了彼此。\n\n而工作牌上的刻痕，永远不再闪光。" }
  ];
})();
