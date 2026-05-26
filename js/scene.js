/* 场景渲染 */
window.Scene = {
  set(layer, fxLayer, sceneId, fx){
    layer.className = "scene-layer";
    if (sceneId) layer.classList.add("scene-" + sceneId);
    fxLayer.innerHTML = "";
    if (fx === "rain")    fxLayer.innerHTML = `<div class="fx-rain"></div>`;
    if (fx === "petals")  fxLayer.innerHTML = `<div class="fx-petals"></div>`;
    if (fx === "flash"){
      const f = document.createElement("div");
      f.className = "flash-white";
      fxLayer.appendChild(f);
      setTimeout(() => f.remove(), 700);
    }
  },

  cgSurface(scene){
    // 给 CG 用的简化背景
    const map = {
      deck:    "linear-gradient(180deg,#1a1547 0%,#06081a 100%)",
      corridor:"linear-gradient(180deg,#1a1140 0%,#0a0a25 100%)",
      cabin:   "linear-gradient(180deg,#3a1d5b 0%,#0a0721 100%)",
      garden:  "linear-gradient(180deg,#1f3a5b 0%,#031020 100%)",
      archive: "linear-gradient(180deg,#1a0d2c 0%,#06081a 100%)"
    };
    return map[scene] || map.deck;
  }
};
