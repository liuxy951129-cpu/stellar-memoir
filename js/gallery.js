/* 回忆相册 */
window.Gallery = {
  ALL_CG: [
    { id:"qianye_cg1", role:"qianye", title:"第一次对望", scene:"deck", desc:"她抬头时，眼里有银河。" },
    { id:"qianye_cg2", role:"qianye", title:"全息雨中的承诺", scene:"garden", desc:"雨是温的，因为是模拟。" },
    { id:"qianye_cg3", role:"qianye", title:"同一个常数", scene:"archive", desc:"她终于把自己交还给你。" },
    { id:"yunli_cg1",  role:"yunli",  title:"医务舱里的绷带", scene:"cabin", desc:"绷带绕过你的手腕第一次。" },
    { id:"yunli_cg2",  role:"yunli",  title:"会闪三下的星", scene:"deck", desc:"她说她也会闪三下。" },
    { id:"yunli_cg3",  role:"yunli",  title:"再来一次", scene:"cabin", desc:"她每跳完一次，都先看你。" },
    { id:"yin_cg1",    role:"yin",    title:"金色瞳孔", scene:"corridor", desc:"他不眨眼。" },
    { id:"yin_cg2",    role:"yin",    title:"机械怀表", scene:"deck", desc:"心脏停过 7 次。" },
    { id:"yin_cg3",    role:"yin",    title:"先认出你", scene:"archive", desc:"第 8 次重启之后。" },
    { id:"qianye_cg4", role:"qianye", title:"星图笔记", scene:"deck", desc:"她写在笔记最后一行的人名是你。", hidden:true },
    { id:"yunli_cg4",  role:"yunli",  title:"霓虹彩排", scene:"cabin", desc:"独属于你的彩排。", hidden:true },
    { id:"yin_cg4",    role:"yin",    title:"不再重启", scene:"archive", desc:"他终于学会留下。", hidden:true }
  ],

  render(save){
    const el = document.getElementById("galleryGrid");
    if (!el) return;
    el.innerHTML = "";
    let count = 0;
    this.ALL_CG.forEach(cg=>{
      const unlocked = save.unlockedCG && save.unlockedCG[cg.id];
      if (unlocked) count++;
      const card = document.createElement("div");
      card.className = "gal-card" + (unlocked ? "" : " locked");
      card.innerHTML = `
        <div class="gc-img" style="background:${Scene.cgSurface(cg.scene)}">
          ${unlocked ? `<div style="position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;">
            <div style="width:60%;height:96%;transform:translateY(10%);">${Portrait.build(cg.role,"smile")}</div>
          </div>` : ""}
        </div>
        <div class="gc-mask"></div>
        <div class="gc-info">
          <b>${unlocked ? cg.title : "??? ??? ???"}</b>
          <p>${unlocked ? cg.desc : "未解锁"}</p>
        </div>
      `;
      if (unlocked){
        card.addEventListener("click", () => UI.showCG(cg.role, cg.title, cg.scene));
      }
      el.appendChild(card);
    });
    document.getElementById("galCount").textContent = count;
  }
};
