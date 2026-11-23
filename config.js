// 網站設定（說明中心與後台共用）
// googleScriptUrl：回饋要存進 Google 試算表時，貼上 Apps Script「網頁應用程式」的網址
//   （以 https://script.google.com/macros/s/ 開頭、/exec 結尾，設定步驟見 google-apps-script/README.md）。
//   留空時回饋送到網站自己的伺服器（server/server.js）；兩者都沒有就進預覽模式。
// noServer：true = 沒有伺服器的靜態版（tools/build-static.js 打包時自動改成 true，這裡不用手動改）。
//   靜態版不連公司網域（2026-11-23 使用者要求）：回饋只送 Google 試算表，吉吉問卷不主動出現，閱讀流量不記。
window.SITE_CONFIG = {
  noServer: false,
  googleScriptUrl:'https://script.google.com/macros/s/AKfycbwDj9cdYci6890hTGUk8vuPi1HBaBej6rTwxqW8jD5VePX_oZCm3bYORbmR7v31SqccpA/exec',
};
