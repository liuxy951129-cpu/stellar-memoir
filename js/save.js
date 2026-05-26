/* 存档系统 */
const SAVE_KEY = "stellar_memoir_save_v1";
const SETTINGS_KEY = "stellar_memoir_settings_v1";

window.Save = {
  load(){
    try{ return JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){ return null; }
  },
  store(d){
    localStorage.setItem(SAVE_KEY, JSON.stringify(d));
  },
  clear(){
    localStorage.removeItem(SAVE_KEY);
  },
  defaults(){
    return {
      currentRoute: null,
      stepIndex: 0,
      affinity:{ qianye:0, yunli:0, yin:0 },
      flags:{},
      unlockedCG:{},
      finishedRoutes:{},
      // 货币 / 资源
      coin: 300,
      diamond: 10,
      // 抽卡历史
      gachaHistory: [],
      // 已读
      readSet:{}
    };
  },
  loadSettings(){
    try{ return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null") || { textSpeed:35, autoSpeed:1800, bgmVol:60, onlyReadSkip:true }; }
    catch(e){ return { textSpeed:35, autoSpeed:1800, bgmVol:60, onlyReadSkip:true }; }
  },
  storeSettings(s){
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }
};
