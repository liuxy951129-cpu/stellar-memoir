/* ============ 6 类互动机制 v4 ============
 * step types:
 *   { type:"countdown", text, seconds, options:[{text, success?, next?, aff?, flag?}] }
 *   { type:"touch", text, regions:[{x,y,r,label,flag?,aff?,next?}], hint? }
 *   { type:"drag", text, items:[{label}], targets:[{id,label}], answer:{itemIdx:targetId}, success:{flag,next}, fail:{next} }
 *   { type:"typing", text, prompt, answer, success:{flag,next}, fail:{next}, tolerance? }
 *   { type:"swipe", text, direction:"left"|"right"|"up"|"down", reveal, success:{flag,next} }
 *   { type:"qte", text, beats:N, intervalMs, success:{flag,next}, fail:{next} }
 * ================================================== */

window.Interact = {
  _onDone: null,

  _host(){
    let el = document.getElementById("ix-host");
    if (!el){
      el = document.createElement("div");
      el.id = "ix-host";
      el.className = "ix-host";
      document.body.appendChild(el);
    }
    return el;
  },

  _close(){
    const el = document.getElementById("ix-host");
    if (el) el.classList.remove("active");
  },

  _show(){
    this._host().classList.add("active");
  },

  finish(result){
    this._close();
    if (typeof this._onDone === "function") this._onDone(result);
  },

  /* ---------- 倒计时选择 ---------- */
  countdown(step, onDone){
    this._onDone = onDone;
    const host = this._host();
    host.innerHTML = `
      <div class="ix-card">
        <div class="ix-title">⏱ 紧急回应</div>
        <p class="ix-text">${step.text}</p>
        <div class="ix-bar"><div class="ix-bar-fill" id="ixBar"></div></div>
        <div class="ix-time" id="ixTime">${step.seconds || 5}.0s</div>
        <div class="ix-options" id="ixOpts"></div>
      </div>
    `;
    this._show();
    const opts = host.querySelector("#ixOpts");
    step.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "ix-opt";
      b.textContent = opt.text;
      b.addEventListener("click", () => {
        clearInterval(timer);
        this.finish({ index: i, success: !!opt.success, opt });
      });
      opts.appendChild(b);
    });
    let total = (step.seconds || 5) * 1000;
    let left = total;
    const start = Date.now();
    const bar = host.querySelector("#ixBar");
    const tl = host.querySelector("#ixTime");
    const timer = setInterval(() => {
      left = Math.max(0, total - (Date.now() - start));
      bar.style.width = (left / total * 100) + "%";
      tl.textContent = (left / 1000).toFixed(1) + "s";
      if (left <= 0){
        clearInterval(timer);
        // 默认走最后一个选项（即"超时" / "错过"）
        const fallback = step.options.find(o => o.timeout) || step.options[step.options.length - 1];
        this.finish({ index: -1, success: false, opt: fallback, timeout: true });
      }
    }, 50);
  },

  /* ---------- 触摸互动（点击立绘特定区域） ---------- */
  touch(step, onDone){
    this._onDone = onDone;
    const host = this._host();
    host.innerHTML = `
      <div class="ix-card touch">
        <div class="ix-title">✦ 触碰</div>
        <p class="ix-text">${step.text}</p>
        <div class="ix-touch-zone" id="ixZone">
          <img src="${step.img || 'assets/portraits/qianye.png'}" />
          ${(step.regions || []).map((r, i) => `
            <div class="ix-region" data-i="${i}" style="left:${r.x}%;top:${r.y}%;width:${(r.r||10)*2}%;height:${(r.r||10)*2}%;transform:translate(-50%,-50%);">
              <span class="ix-region-label">${r.label||'·'}</span>
            </div>
          `).join("")}
        </div>
        <div class="ix-hint">${step.hint || '点击高亮区域'}</div>
      </div>
    `;
    this._show();
    host.querySelectorAll(".ix-region").forEach(el => {
      el.addEventListener("click", () => {
        const i = +el.dataset.i;
        const r = step.regions[i];
        el.classList.add("ix-pressed");
        setTimeout(() => this.finish({ region: r, index: i }), 350);
      });
    });
  },

  /* ---------- 拖拽 ---------- */
  drag(step, onDone){
    this._onDone = onDone;
    const host = this._host();
    const items = step.items || [];
    const targets = step.targets || [];
    host.innerHTML = `
      <div class="ix-card">
        <div class="ix-title">↔ 拖动</div>
        <p class="ix-text">${step.text}</p>
        <div class="ix-drag-area">
          <div class="ix-targets">
            ${targets.map((t, i) => `
              <div class="ix-target" data-tid="${t.id}">${t.label}<div class="ix-target-slot" data-tid="${t.id}"></div></div>
            `).join("")}
          </div>
          <div class="ix-items">
            ${items.map((it, i) => `<div class="ix-drag-item" draggable="true" data-i="${i}">${it.label}</div>`).join("")}
          </div>
        </div>
        <div class="ix-hint">${step.hint || '拖动到正确位置'}</div>
        <button class="ix-submit" id="ixSubmit">提交</button>
      </div>
    `;
    this._show();
    const placed = {}; // itemIdx -> targetId
    host.querySelectorAll(".ix-drag-item").forEach(it => {
      it.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", it.dataset.i);
      });
      // 移动端 fallback：点击循环目标
      it.addEventListener("click", (e) => {
        const slots = host.querySelectorAll(".ix-target");
        const cur = +(it.dataset.placed || -1);
        const next = (cur + 1) % slots.length;
        // 移除旧 placement
        if (cur >= 0){
          const oldSlot = slots[cur].querySelector(".ix-target-slot");
          if (oldSlot) oldSlot.innerHTML = "";
        }
        const slot = slots[next].querySelector(".ix-target-slot");
        slot.appendChild(it);
        it.dataset.placed = next;
        placed[+it.dataset.i] = slots[next].dataset.tid;
      });
    });
    host.querySelectorAll(".ix-target").forEach(t => {
      t.addEventListener("dragover", (e) => e.preventDefault());
      t.addEventListener("drop", (e) => {
        e.preventDefault();
        const i = +e.dataTransfer.getData("text/plain");
        const slot = t.querySelector(".ix-target-slot");
        const item = host.querySelector(`.ix-drag-item[data-i="${i}"]`);
        if (item){
          slot.appendChild(item);
          placed[i] = t.dataset.tid;
        }
      });
    });
    host.querySelector("#ixSubmit").addEventListener("click", () => {
      // 检查是否完全匹配
      const ans = step.answer || {};
      let ok = true;
      Object.keys(ans).forEach(k => {
        if (placed[k] !== ans[k]) ok = false;
      });
      this.finish({ success: ok, placed });
    });
  },

  /* ---------- 打字输入 ---------- */
  /* v7: 语音输入 - 按住模拟录音 + 直接点击选项
   * { type:"voice", text, prompt, options:[{label, correct?, aff?, flag?}], success:{flag,next}, fail:{next} }
   */
  voice(step, onDone){
    this._onDone = onDone;
    const host = this._host();
    const opts = (step.options || []).slice();
    host.innerHTML = `
      <div class="ix-voice">
        <div class="iv-hint">${step.text || ''}</div>
        <div class="iv-mic" id="ivMic">🎤</div>
        <div class="iv-wave" id="ivWave">
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="iv-tip">按住麦克风说话，或直接点击下方选项</div>
        <div class="iv-options" id="ivOptions">
          ${opts.map((o, i) => `
            <button class="iv-option" data-i="${i}">
              <span class="iv-num">${i+1}</span>${this._esc(o.label)}
            </button>
          `).join("")}
        </div>
      </div>
    `;
    this._show();

    const mic = host.querySelector("#ivMic");
    const wave = host.querySelector("#ivWave");
    let recordTimer = null;

    const startRecord = (e) => {
      if (e) e.preventDefault();
      mic.classList.add("recording");
      wave.classList.add("on");
      clearTimeout(recordTimer);
      recordTimer = setTimeout(stopRecord, 2200);
    };
    const stopRecord = () => {
      mic.classList.remove("recording");
      wave.classList.remove("on");
      // 模拟"语音识别失败" toast，提示用点击选项
      const tip = host.querySelector(".iv-tip");
      if (tip){
        tip.textContent = "没听清，请直接点击下方选项";
        tip.style.color = "#ffd66b";
      }
    };

    mic.addEventListener("mousedown", startRecord);
    mic.addEventListener("touchstart", startRecord);
    mic.addEventListener("mouseup", stopRecord);
    mic.addEventListener("touchend", stopRecord);
    mic.addEventListener("mouseleave", stopRecord);

    host.querySelectorAll(".iv-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = +btn.dataset.i;
        const picked = opts[idx];
        if (!picked) return;
        this.finish({ success: !!picked.correct, value: picked.label, picked });
      });
    });
  },

  _esc(s){ return String(s||"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]); },

  typing(step, onDone){
    this._onDone = onDone;
    const host = this._host();
    host.innerHTML = `
      <div class="ix-card">
        <div class="ix-title">⌨ 亲手写下</div>
        <p class="ix-text">${step.text}</p>
        <div class="ix-prompt">${step.prompt || ''}</div>
        <input class="ix-input" id="ixInput" type="text" autocomplete="off" placeholder="…" />
        <div class="ix-hint">${step.hint || '输入完成后按 Enter'}</div>
      </div>
    `;
    this._show();
    const input = host.querySelector("#ixInput");
    setTimeout(() => input.focus(), 200);
    const submit = () => {
      const v = (input.value || "").trim();
      const target = (step.answer || "").trim();
      const tol = step.tolerance ?? 0;
      // 简易容错：长度差 ≤ tol 且包含关键字
      let ok = false;
      if (target.length === 0){ ok = true; }
      else if (v === target){ ok = true; }
      else if (tol > 0){
        // 编辑距离粗略判定
        const dist = this._edit(v, target);
        if (dist <= tol) ok = true;
      } else {
        // 包含关键短语
        const keys = target.split(/[，。\s]+/).filter(x => x.length > 1);
        ok = keys.length > 0 && keys.every(k => v.includes(k));
      }
      this.finish({ success: ok, value: v });
    };
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submit();
    });
  },

  _edit(a, b){
    if (!a) return b.length;
    if (!b) return a.length;
    const dp = Array.from({length:a.length+1}, () => new Array(b.length+1).fill(0));
    for (let i=0;i<=a.length;i++) dp[i][0]=i;
    for (let j=0;j<=b.length;j++) dp[0][j]=j;
    for (let i=1;i<=a.length;i++) for (let j=1;j<=b.length;j++){
      dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);
    }
    return dp[a.length][b.length];
  },

  /* ---------- 滑动手势 ---------- */
  swipe(step, onDone){
    this._onDone = onDone;
    const host = this._host();
    host.innerHTML = `
      <div class="ix-card">
        <div class="ix-title">↔ 滑动</div>
        <p class="ix-text">${step.text}</p>
        <div class="ix-swipe-zone" id="ixSwipe">
          <div class="ix-swipe-overlay" id="ixSwipeOverlay">
            <div class="ix-swipe-hint">${step.dirHint || '向 ' + (step.direction||'left') + ' 滑'}</div>
          </div>
          ${step.reveal ? `<div class="ix-swipe-reveal" style="background-image:url('${step.reveal}');"></div>` : ''}
        </div>
      </div>
    `;
    this._show();
    const zone = host.querySelector("#ixSwipe");
    const overlay = host.querySelector("#ixSwipeOverlay");
    const dir = step.direction || "left";
    let startX = 0, startY = 0, dx = 0, dy = 0, isDown = false;
    const start = (e) => {
      isDown = true;
      const t = e.touches ? e.touches[0] : e;
      startX = t.clientX; startY = t.clientY;
    };
    const move = (e) => {
      if (!isDown) return;
      const t = e.touches ? e.touches[0] : e;
      dx = t.clientX - startX;
      dy = t.clientY - startY;
      let progress = 0;
      if (dir === "left") progress = Math.max(0, -dx);
      else if (dir === "right") progress = Math.max(0, dx);
      else if (dir === "up") progress = Math.max(0, -dy);
      else progress = Math.max(0, dy);
      const w = zone.clientWidth || 300;
      const pct = Math.min(1, progress / w);
      overlay.style.opacity = (1 - pct);
      if (pct >= 1){
        zone.classList.add("ix-swipe-done");
        finish(true);
      }
    };
    const finish = (ok) => {
      isDown = false;
      this.finish({ success: ok });
    };
    const up = () => {
      if (!isDown) return;
      isDown = false;
      const w = zone.clientWidth || 300;
      let progress = 0;
      if (dir === "left") progress = -dx;
      else if (dir === "right") progress = dx;
      else if (dir === "up") progress = -dy;
      else progress = dy;
      if (progress >= w * 0.6){
        zone.classList.add("ix-swipe-done");
        finish(true);
      } else {
        overlay.style.transition = "opacity .3s";
        overlay.style.opacity = 1;
      }
    };
    zone.addEventListener("mousedown", start);
    zone.addEventListener("mousemove", move);
    zone.addEventListener("mouseup", up);
    zone.addEventListener("mouseleave", up);
    zone.addEventListener("touchstart", start);
    zone.addEventListener("touchmove", move);
    zone.addEventListener("touchend", up);
  },

  /* ---------- QTE 节奏点击 ---------- */
  qte(step, onDone){
    this._onDone = onDone;
    const host = this._host();
    host.innerHTML = `
      <div class="ix-card">
        <div class="ix-title">♥ 节奏</div>
        <p class="ix-text">${step.text}</p>
        <div class="ix-qte-zone" id="ixQte">
          <div class="ix-qte-status" id="ixStatus">准备…</div>
          <div class="ix-qte-target" id="ixTarget">●</div>
          <button class="ix-qte-btn" id="ixHit">击中</button>
        </div>
        <div class="ix-qte-stats">
          <span>命中：<b id="ixHits">0</b> / ${step.beats || 5}</span>
          <span>错过：<b id="ixMiss">0</b></span>
        </div>
      </div>
    `;
    this._show();
    const beats = step.beats || 5;
    const intv = step.intervalMs || 1200;
    const target = host.querySelector("#ixTarget");
    const status = host.querySelector("#ixStatus");
    const hits$ = host.querySelector("#ixHits");
    const miss$ = host.querySelector("#ixMiss");
    let hits = 0, misses = 0, beat = 0;
    let active = false;

    const next = () => {
      if (beat >= beats){
        const ok = hits >= Math.ceil(beats * 0.6);
        this.finish({ success: ok, hits, misses });
        return;
      }
      beat++;
      status.textContent = `第 ${beat} / ${beats} 拍`;
      target.style.transform = "scale(0.6)";
      target.style.opacity = "0.5";
      setTimeout(() => {
        active = true;
        target.classList.add("ix-qte-pulse");
        target.style.transform = "scale(1.15)";
        target.style.opacity = "1";
        setTimeout(() => {
          if (active){
            active = false;
            target.classList.remove("ix-qte-pulse");
            misses++;
            miss$.textContent = misses;
            setTimeout(next, 300);
          }
        }, 700);
      }, intv - 700);
    };

    host.querySelector("#ixHit").addEventListener("click", () => {
      if (active){
        active = false;
        hits++;
        hits$.textContent = hits;
        target.classList.remove("ix-qte-pulse");
        target.style.background = "#ffd66b";
        setTimeout(() => target.style.background = "", 200);
        setTimeout(next, 300);
      } else {
        misses++;
        miss$.textContent = misses;
      }
    });
    setTimeout(next, 800);
  }
};
