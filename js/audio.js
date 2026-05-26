/* =====================================================================
 * 星海拾遗 · BGM 引擎 v1
 * 基于 Web Audio API 程序化合成（无外部音频文件）
 * 5 套主题：title / qianye / yunli / yin / prologue
 * 每套包含：和弦循环 + 主旋律音粒 + 衬底 pad
 * ====================================================================== */
window.AudioMgr = (function(){
  let ctx = null;
  let masterGain = null;
  let currentTrack = null;   // {name, nodes:[], stop:fn}
  let enabled = true;
  let volume = 0.30;
  let unlocked = false;

  // 5 套主题：调式 + 和弦进行 + 主旋律音 + tempo
  // 频率：A4=440，相对半音数转频率
  function n(name){ // 'C4','D#5','A4'
    const NOTES = {C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
    const m = name.match(/^([A-G][#b]?)(-?\d+)$/);
    if (!m) return 440;
    const semi = NOTES[m[1]] + (parseInt(m[2])-4)*12 - 9; // A4=440 基准
    return 440 * Math.pow(2, semi/12);
  }

  const THEMES = {
    // 主菜单：神秘星海，A 小调 ambient
    title: {
      bpm: 56,
      pad:   ["A2","E3","A3","C4","E4"],         // pad 长持续
      chords:[["A3","C4","E4"],["F3","A3","C4"],["E3","G3","B3"],["A3","C4","E4"]],
      melody:["E5","A5","C5","B4","A4","G4","E4","A4"],
      color: {wave1:"sine", wave2:"triangle"},
      reverb: 0.35
    },
    // 千夜：冷静睿智，D 小调（理性 + 一点忧郁）
    qianye: {
      bpm: 62,
      pad:   ["D2","A2","D3","F3","A3"],
      chords:[["D3","F3","A3"],["A2","C3","E3"],["Bb2","D3","F3"],["A2","C#3","E3"]],
      melody:["A4","D5","F5","E5","D5","C5","Bb4","A4"],
      color: {wave1:"sine", wave2:"sawtooth"},
      reverb: 0.30
    },
    // 云璃：温暖跳脱，F 大调（明亮 + 一点泪光）
    yunli: {
      bpm: 72,
      pad:   ["F2","C3","F3","A3","C4"],
      chords:[["F3","A3","C4"],["Bb3","D4","F4"],["C4","E4","G4"],["F3","A3","C4"]],
      melody:["F5","A5","C5","Bb4","A4","G4","F4","C5"],
      color: {wave1:"triangle", wave2:"sine"},
      reverb: 0.20
    },
    // 银：守夜沉静，E 小调（克制 + 一点星图感）
    yin: {
      bpm: 50,
      pad:   ["E2","B2","E3","G3","B3"],
      chords:[["E3","G3","B3"],["C3","E3","G3"],["A2","C3","E3"],["B2","D3","F#3"]],
      melody:["B4","E5","G5","F#5","E5","D5","B4","E5"],
      color: {wave1:"sine", wave2:"sine"},
      reverb: 0.45
    },
    // 序章：训练台，C 小调（混沌中觉醒）
    prologue: {
      bpm: 48,
      pad:   ["C2","G2","C3","Eb3","G3"],
      chords:[["C3","Eb3","G3"],["Ab2","C3","Eb3"],["F2","Ab2","C3"],["G2","B2","D3"]],
      melody:["G4","C5","Eb5","D5","C5","Bb4","G4","C5"],
      color: {wave1:"sine", wave2:"triangle"},
      reverb: 0.40
    }
  };

  function ensureCtx(){
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
  }

  // 制作简易混响（卷积+衰减），仅一次性
  let reverbNode = null;
  function makeReverb(seconds, decay){
    if (!ctx) return null;
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const impulse = ctx.createBuffer(2, length, rate);
    for (let c=0; c<2; c++){
      const data = impulse.getChannelData(c);
      for (let i=0; i<length; i++){
        data[i] = (Math.random()*2-1) * Math.pow(1 - i/length, decay);
      }
    }
    const node = ctx.createConvolver();
    node.buffer = impulse;
    return node;
  }

  // 衰减音粒
  function pluck(freq, when, dur, gain, wave, dest){
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = wave || "sine";
    osc.frequency.value = freq;
    env.gain.setValueAtTime(0, when);
    env.gain.linearRampToValueAtTime(gain, when + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(env).connect(dest);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }

  // 长 pad（叠加多频率）
  function pad(freqs, when, dur, gain, wave, dest){
    freqs.forEach(f=>{
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1800;
      osc.type = wave || "sine";
      osc.frequency.value = f;
      env.gain.setValueAtTime(0, when);
      env.gain.linearRampToValueAtTime(gain, when + 0.6);
      env.gain.setValueAtTime(gain, when + dur - 0.6);
      env.gain.linearRampToValueAtTime(0, when + dur);
      osc.connect(filter).connect(env).connect(dest);
      osc.start(when);
      osc.stop(when + dur + 0.05);
    });
  }

  function startTheme(name){
    if (!enabled) return;
    ensureCtx();
    if (currentTrack && currentTrack.name === name) return;
    stopCurrent(true);

    const T = THEMES[name];
    if (!T) return;

    // 主轨增益
    const trackGain = ctx.createGain();
    trackGain.gain.value = 0;
    trackGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 1.5); // 1.5s 淡入

    // 混响支路
    const dryGain = ctx.createGain();
    const wetGain = ctx.createGain();
    dryGain.gain.value = 1 - T.reverb;
    wetGain.gain.value = T.reverb;
    reverbNode = makeReverb(2.5, 2.8);
    dryGain.connect(trackGain);
    if (reverbNode){
      reverbNode.connect(wetGain);
      wetGain.connect(trackGain);
    } else {
      wetGain.disconnect && wetGain.disconnect();
    }
    trackGain.connect(masterGain);

    const inputBus = ctx.createGain();
    inputBus.connect(dryGain);
    if (reverbNode) inputBus.connect(reverbNode);

    // 调度 16 小节，并通过 timer 不断续接
    const beat = 60 / T.bpm; // 一拍秒数
    const barLen = beat * 4;
    const loopBars = 4;       // 一段 4 小节循环
    let nextStartAt = ctx.currentTime + 0.1;

    function scheduleLoop(){
      if (!currentTrack || currentTrack.name !== name) return;
      const t0 = nextStartAt;
      // 每小节一个 pad（pad 持续一小节）+ 每小节一个和弦 + 每拍 1 个旋律音
      for (let bar=0; bar<loopBars; bar++){
        const barStart = t0 + bar*barLen;
        // pad：整套
        pad(T.pad.map(n), barStart, barLen*0.95, 0.10, T.color.wave1, inputBus);
        // 和弦：弱力度
        const chord = T.chords[bar % T.chords.length];
        chord.forEach(name1 => pluck(n(name1), barStart+0.02, barLen*0.6, 0.06, T.color.wave1, inputBus));
        // 旋律：每拍一个音
        for (let b=0; b<4; b++){
          const idx = (bar*4 + b) % T.melody.length;
          const freq = n(T.melody[idx]);
          // 偶尔留白
          if (Math.random() < 0.7){
            pluck(freq, barStart + b*beat + (b===0?0.05:0), beat*0.85, 0.07, T.color.wave2, inputBus);
          }
        }
      }
      nextStartAt = t0 + loopBars*barLen;
      // 在循环结束前 1s 预约下次
      const timer = setTimeout(scheduleLoop, (loopBars*barLen - 1.0) * 1000);
      if (currentTrack) currentTrack.timers.push(timer);
    }

    currentTrack = { name, trackGain, inputBus, timers:[] };
    scheduleLoop();
  }

  function stopCurrent(immediate){
    if (!currentTrack) return;
    const t = currentTrack;
    if (t.timers) t.timers.forEach(id => clearTimeout(id));
    if (t.trackGain && ctx){
      const now = ctx.currentTime;
      const fade = immediate ? 0.4 : 1.2;
      try{
        t.trackGain.gain.cancelScheduledValues(now);
        t.trackGain.gain.setValueAtTime(t.trackGain.gain.value, now);
        t.trackGain.gain.linearRampToValueAtTime(0, now + fade);
      } catch(e){}
      setTimeout(()=>{
        try{ t.trackGain.disconnect(); }catch(e){}
        try{ t.inputBus.disconnect(); }catch(e){}
      }, (fade+0.1)*1000);
    }
    currentTrack = null;
  }

  function setVolume(v){
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    saveState();
  }
  function setEnabled(on){
    enabled = !!on;
    if (!enabled) stopCurrent(true);
    saveState();
  }
  function getVolume(){ return volume; }
  function getEnabled(){ return enabled; }

  function saveState(){
    try{
      localStorage.setItem("bgm_cfg", JSON.stringify({enabled, volume}));
    }catch(e){}
  }
  function loadState(){
    try{
      const s = JSON.parse(localStorage.getItem("bgm_cfg")||"{}");
      if (typeof s.enabled === "boolean") enabled = s.enabled;
      if (typeof s.volume === "number") volume = s.volume;
    }catch(e){}
  }

  // 浏览器要求用户首次手势后才能播放
  function unlock(){
    if (unlocked) return;
    unlocked = true;
    ensureCtx();
    // 首次解锁后，如果当前页希望放主题，会再次调 startTheme
    if (window.__pendingTheme) {
      startTheme(window.__pendingTheme);
      window.__pendingTheme = null;
    }
  }

  // 安全接口：未解锁时把目标主题先记下来
  function play(name){
    if (!enabled) return;
    if (!unlocked){
      window.__pendingTheme = name;
      return;
    }
    startTheme(name);
  }

  function init(){
    loadState();
    // 首次任意手势解锁
    const onFirst = () => {
      unlock();
      document.removeEventListener("click", onFirst);
      document.removeEventListener("touchstart", onFirst);
      document.removeEventListener("keydown", onFirst);
    };
    document.addEventListener("click", onFirst, {once:false});
    document.addEventListener("touchstart", onFirst, {once:false});
    document.addEventListener("keydown", onFirst, {once:false});
  }

  return { init, play, stop:()=>stopCurrent(true), setVolume, setEnabled, getVolume, getEnabled };
})();
