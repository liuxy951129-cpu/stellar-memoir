/* 场景渲染（基于 AI 生成的背景图） */
window.Scene = {
  PATH: "assets/scenes/",
  CGPATH: "assets/cg/",

  set(layer, fxLayer, sceneId, fx){
    layer.className = "scene-layer";
    if (sceneId){
      layer.classList.add("scene-" + sceneId);
      layer.style.backgroundImage = `url("${this.PATH}${sceneId}.png")`;
      layer.style.backgroundSize = "cover";
      layer.style.backgroundPosition = "center";
    } else {
      layer.style.backgroundImage = "";
    }
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
    return `url("${this.PATH}${scene || "deck"}.png") center/cover`;
  },

  cgImage(cgImgId){
    // cgImgId 可能是 qianye_he / qianye 等，取 CG 图或 portrait 作 fallback
    return `${this.CGPATH}${cgImgId}.png`;
  }
};
