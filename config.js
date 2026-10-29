// 網站設定（說明中心與後台共用）
// googleScriptUrl：回饋要存進 Google 試算表時，貼上 Apps Script「網頁應用程式」的網址
//   （以 https://script.google.com/macros/s/ 開頭、/exec 結尾，設定步驟見 google-apps-script/README.md）。
//   留空時回饋送到網站自己的伺服器（server/server.js）；兩者都沒有就進預覽模式。
window.SITE_CONFIG = {
  googleScriptUrl: '',
};
