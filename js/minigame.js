/* 3 个角色专属小游戏（覆盖式弹层） */
window.MiniGame = {
  _onDone: null,

  start(game, onDone){
    this._onDone = onDone || (()=>{});
    const id = "mg-" + game;
    let el = document.getElementById("mg-host");
    if (!el){
      el = document.createElement("div");
      el.id = "mg-host";
      el.style.cssText = "position:fixed;inset:0;z-index:500;background:rgba(2,4,15,.95);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;";
      document.body.appendChild(el);
    }
    el.innerHTML = "";
    el.style.display = "flex";
    if (game === "qy") this.renderQy(el);
    else if (game === "yl") this.renderYl(el);
    else if (game === "yin") this.renderYin(el);
  },

  finish(score, reward){
    const el = document.getElementById("mg-host");
    if (el) el.style.display = "none";
    UI.toast(`完成：${score} 分 · 星币 +${reward.coin||0}${reward.aff?` · 好感 +${Object.values(reward.aff)[0]}`:""}`);
    if (typeof this._onDone === "function") this._onDone(reward);
  },

  /* ---------- 千夜：记忆碎片连线（2x4 翻牌配对） ---------- */
  renderQy(host){
    const SYMBOLS = ["α","β","γ","δ","ε","ζ","η","θ"]; // 8 个，4 对会被打乱用
    const pairs = SYMBOLS.slice(0,4); // 4 对
    const cards = [...pairs, ...pairs].sort(()=>Math.random()-0.5);
    let revealed = []; // indexes
    let matched = new Set();
    let moves = 0;
    let startTs = Date.now();

    host.innerHTML = `
      <div style="width:min(94%,440px);background:linear-gradient(180deg,#1a1547,#0a0b22);border:1px solid rgba(125,77,255,.5);border-radius:18px;padding:20px;box-shadow:0 30px 80px rgba(125,77,255,.4);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div style="font-size:18px;letter-spacing:.2em;color:#fff;font-weight:700;">千夜 · 记忆碎片</div>
          <button class="btn-ghost" id="mg-close" style="padding:4px 10px;font-size:11px;letter-spacing:.1em;">退出</button>
        </div>
        <p style="color:#aab1d6;font-size:12px;margin-bottom:14px;letter-spacing:.1em;">翻开两张相同符号的碎片即可配对。配对越快得分越高。</p>
        <div id="mg-board" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;"></div>
        <div style="margin-top:12px;display:flex;justify-content:space-between;font-size:12px;color:#cfd6ff;">
          <span>已配对：<b id="mg-matched">0</b> / 4</span>
          <span>移动次数：<b id="mg-moves">0</b></span>
        </div>
      </div>`;

    const board = host.querySelector("#mg-board");
    cards.forEach((sym, i) => {
      const c = document.createElement("div");
      c.dataset.idx = i;
      c.dataset.sym = sym;
      c.style.cssText = "aspect-ratio:1;border-radius:10px;background:linear-gradient(135deg,#7d4dff,#3ad6ff);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:transparent;cursor:pointer;transition:transform .2s,filter .3s;box-shadow:0 6px 16px rgba(125,77,255,.4);";
      c.addEventListener("click", ()=>{
        if (revealed.length >= 2) return;
        if (matched.has(+c.dataset.idx)) return;
        if (revealed.includes(+c.dataset.idx)) return;
        c.style.color = "#fff";
        c.style.filter = "brightness(1.2)";
        revealed.push(+c.dataset.idx);
        if (revealed.length === 2){
          moves++;
          host.querySelector("#mg-moves").textContent = moves;
          const [a,b] = revealed;
          const ac = board.children[a], bc = board.children[b];
          if (ac.dataset.sym === bc.dataset.sym){
            matched.add(a); matched.add(b);
            host.querySelector("#mg-matched").textContent = matched.size/2;
            setTimeout(()=>{
              ac.style.background = "linear-gradient(135deg,#ffd66b,#ff77c8)";
              bc.style.background = "linear-gradient(135deg,#ffd66b,#ff77c8)";
              revealed = [];
              if (matched.size === cards.length){
                const sec = Math.floor((Date.now()-startTs)/1000);
                const score = Math.max(100, 800 - moves*30 - sec*5);
                setTimeout(()=> this.finish(score, { coin: Math.round(score/4), aff:{qianye:2} }), 600);
              }
            }, 350);
          } else {
            setTimeout(()=>{
              ac.style.color = "transparent"; ac.style.filter = "";
              bc.style.color = "transparent"; bc.style.filter = "";
              revealed = [];
            }, 700);
          }
        }
      });
      c.textContent = sym;
      board.appendChild(c);
    });
    host.querySelector("#mg-close").addEventListener("click", ()=>{
      host.style.display = "none";
      if (typeof this._onDone === "function") this._onDone(null);
    });
  },

  /* ---------- 云璃：节拍踩点（4 列下落） ---------- */
  renderYl(host){
    host.innerHTML = `
      <div style="width:min(94%,420px);background:linear-gradient(180deg,#3a1d5b,#0a0721);border:1px solid rgba(255,119,200,.6);border-radius:18px;padding:20px;box-shadow:0 30px 80px rgba(255,119,200,.4);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div style="font-size:18px;letter-spacing:.2em;color:#fff;font-weight:700;">云璃 · 跳一段</div>
          <button class="btn-ghost" id="mg-close" style="padding:4px 10px;font-size:11px;letter-spacing:.1em;">退出</button>
        </div>
        <p style="color:#ffd9ee;font-size:12px;margin-bottom:14px;letter-spacing:.1em;">按下键 D F J K 接住对应列的节拍音符。</p>
        <div id="mg-stage" style="position:relative;height:340px;background:linear-gradient(180deg,rgba(0,0,0,.5),rgba(0,0,0,.8));border-radius:10px;overflow:hidden;display:grid;grid-template-columns:repeat(4,1fr);">
          <div style="border-right:1px solid rgba(255,255,255,.1);"></div>
          <div style="border-right:1px solid rgba(255,255,255,.1);"></div>
          <div style="border-right:1px solid rgba(255,255,255,.1);"></div>
          <div></div>
        </div>
        <div id="mg-keys" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px;">
          <button data-k="0" class="btn-primary" style="padding:14px 0;font-size:18px;letter-spacing:.2em;">D</button>
          <button data-k="1" class="btn-primary" style="padding:14px 0;font-size:18px;letter-spacing:.2em;">F</button>
          <button data-k="2" class="btn-primary" style="padding:14px 0;font-size:18px;letter-spacing:.2em;">J</button>
          <button data-k="3" class="btn-primary" style="padding:14px 0;font-size:18px;letter-spacing:.2em;">K</button>
        </div>
        <div style="margin-top:10px;display:flex;justify-content:space-between;font-size:12px;color:#fff;">
          <span>得分：<b id="mg-score">0</b></span>
          <span>连击：<b id="mg-combo">0</b></span>
          <span>剩余：<b id="mg-time">20</b>s</span>
        </div>
      </div>`;

    const stage = host.querySelector("#mg-stage");
    const W = stage.clientWidth, H = 340;
    let score = 0, combo = 0;
    let notes = []; // {lane, y, el}
    let running = true;
    let timeLeft = 20;

    const tickTimer = setInterval(()=>{
      if (!running) return;
      timeLeft--;
      host.querySelector("#mg-time").textContent = timeLeft;
      if (timeLeft <= 0){
        running = false;
        clearInterval(tickTimer);
        clearInterval(spawn);
        clearInterval(loop);
        setTimeout(()=> this.finish(score, { coin: Math.round(score/2), aff:{yunli:2} }), 200);
      }
    }, 1000);

    const spawn = setInterval(()=>{
      if (!running) return;
      const lane = Math.floor(Math.random()*4);
      const note = document.createElement("div");
      note.style.cssText = `position:absolute;left:${lane*25}%;top:0;width:25%;height:28px;background:linear-gradient(180deg,#ff77c8,#ffd66b);border-radius:6px;box-shadow:0 0 12px rgba(255,119,200,.7);`;
      stage.appendChild(note);
      notes.push({ lane, y:0, el:note });
    }, 600);

    const loop = setInterval(()=>{
      if (!running) return;
      notes.forEach(n => {
        n.y += 4;
        n.el.style.top = n.y + "px";
      });
      notes = notes.filter(n => {
        if (n.y > H){
          n.el.remove();
          combo = 0;
          host.querySelector("#mg-combo").textContent = "0";
          return false;
        }
        return true;
      });
    }, 30);

    const hit = (lane) => {
      // 找最接近 H-50 ~ H 的 note
      const idx = notes.findIndex(n => n.lane === lane && n.y > H-80 && n.y < H-10);
      if (idx >= 0){
        const n = notes[idx];
        n.el.style.transition = "transform .15s,opacity .15s";
        n.el.style.transform = "scale(1.4)";
        n.el.style.opacity = "0";
        setTimeout(()=> n.el.remove(), 150);
        notes.splice(idx, 1);
        combo++;
        score += 10 + combo * 2;
        host.querySelector("#mg-score").textContent = score;
        host.querySelector("#mg-combo").textContent = combo;
      } else {
        combo = 0;
        host.querySelector("#mg-combo").textContent = "0";
      }
    };

    host.querySelectorAll("#mg-keys button").forEach(b=>{
      b.addEventListener("click", ()=> hit(+b.dataset.k));
    });
    const keyHandler = (e)=>{
      const k = { d:0, f:1, j:2, k:3 }[e.key?.toLowerCase()];
      if (k !== undefined){ e.preventDefault(); hit(k); }
    };
    document.addEventListener("keydown", keyHandler);

    host.querySelector("#mg-close").addEventListener("click", ()=>{
      running = false;
      clearInterval(tickTimer); clearInterval(spawn); clearInterval(loop);
      document.removeEventListener("keydown", keyHandler);
      host.style.display = "none";
      if (typeof this._onDone === "function") this._onDone(null);
    });
  },

  /* ---------- 银：凝视反应（出现颜色按对应键） ---------- */
  renderYin(host){
    host.innerHTML = `
      <div style="width:min(94%,420px);background:linear-gradient(180deg,#0e1a2c,#020610);border:1px solid rgba(58,214,255,.5);border-radius:18px;padding:20px;box-shadow:0 30px 80px rgba(58,214,255,.4);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div style="font-size:18px;letter-spacing:.2em;color:#fff;font-weight:700;">银 · 凝视训练</div>
          <button class="btn-ghost" id="mg-close" style="padding:4px 10px;font-size:11px;letter-spacing:.1em;">退出</button>
        </div>
        <p style="color:#a4d6ff;font-size:12px;margin-bottom:14px;letter-spacing:.1em;">屏幕闪现颜色时，立刻点击对应按键。15 秒内尽可能多得分。</p>
        <div id="mg-eye" style="height:240px;border-radius:14px;background:#000;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">
          <div id="mg-cue" style="width:120px;height:120px;border-radius:50%;background:#1a2030;transition:background .15s;"></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px;" id="mg-btns">
          <button class="btn-primary" data-c="red"    style="padding:14px 0;background:#e44;">红</button>
          <button class="btn-primary" data-c="blue"   style="padding:14px 0;background:#48f;">蓝</button>
          <button class="btn-primary" data-c="yellow" style="padding:14px 0;background:#fb3;color:#222;">黄</button>
          <button class="btn-primary" data-c="green"  style="padding:14px 0;background:#3c8;">绿</button>
        </div>
        <div style="margin-top:10px;display:flex;justify-content:space-between;font-size:12px;color:#fff;">
          <span>得分：<b id="mg-score">0</b></span>
          <span>反应：<b id="mg-react">--</b>ms</span>
          <span>剩余：<b id="mg-time">15</b>s</span>
        </div>
      </div>`;

    const cue = host.querySelector("#mg-cue");
    const COLORS = { red:"#e44", blue:"#48f", yellow:"#fb3", green:"#3c8" };
    let target = null;
    let showTs = 0;
    let score = 0;
    let time = 15;
    let running = true;

    const next = () => {
      if (!running) return;
      const keys = Object.keys(COLORS);
      target = keys[Math.floor(Math.random()*4)];
      cue.style.background = COLORS[target];
      showTs = Date.now();
    };

    setTimeout(next, 500);
    const tick = setInterval(()=>{
      time--;
      host.querySelector("#mg-time").textContent = time;
      if (time<=0){
        running=false;
        clearInterval(tick);
        setTimeout(()=> this.finish(score, { coin: Math.round(score/2), aff:{yin:2} }), 200);
      }
    }, 1000);

    host.querySelectorAll("#mg-btns button").forEach(b=>{
      b.addEventListener("click", ()=>{
        if (!target || !running) return;
        const react = Date.now() - showTs;
        if (b.dataset.c === target){
          const pts = Math.max(5, 60 - Math.floor(react/20));
          score += pts;
        } else {
          score = Math.max(0, score - 10);
        }
        host.querySelector("#mg-score").textContent = score;
        host.querySelector("#mg-react").textContent = react;
        cue.style.background = "#1a2030";
        target = null;
        setTimeout(next, 400 + Math.random()*400);
      });
    });
    host.querySelector("#mg-close").addEventListener("click", ()=>{
      running=false; clearInterval(tick);
      host.style.display="none";
      if (typeof this._onDone === "function") this._onDone(null);
    });
  }
};
