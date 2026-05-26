/* 存档系统 v2 */
const SAVE_KEY = "stellar_memoir_save_v2";
const SETTINGS_KEY = "stellar_memoir_settings_v2";

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
      coin: 300,
      diamond: 10,
      gachaHistory: [],
      readSet:{},
      stamina: 30,
      lastStaminaTs: Date.now(),
      gifts: {},
      stages: { qianye:0, yunli:0, yin:0 },
      mailbox: [],
      mailRead: {},
      dailyState: { date:"", talkCount:0, giftCount:0, miniCount:0, mailReadCount:0, claimed:{} },
      weeklyState: { week:"", routeFinished:0, cgCount:0, maxAff:0, miniCount:0, claimed:{} }
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
