// 網站設定（說明中心與後台共用）
// googleScriptUrl：回饋要存進 Google 試算表時，貼上 Apps Script「網頁應用程式」的網址
//   （以 https://script.google.com/macros/s/ 開頭、/exec 結尾，設定步驟見 google-apps-script/README.md）。
//   留空時回饋送到網站自己的伺服器（server/server.js）；兩者都沒有就進預覽模式。
// apiBase：回饋、吉吉問卷、閱讀流量要送去哪個伺服器。留空 = 送給目前這個網站自己（公司網站）。
//   靜態版（tools/build-static.js 產生，放在 moonland.ai 網域）沒有伺服器，打包時會自動填成公司網站的網址，
//   資料照樣存在公司網站，編輯後台與回饋後台都看得到。這裡不用手動改。
window.SITE_CONFIG = {
  apiBase: '',
  googleScriptUrl:'https://script.google.com/macros/s/AKfycbwDj9cdYci6890hTGUk8vuPi1HBaBej6rTwxqW8jD5VePX_oZCm3bYORbmR7v31SqccpA/exec',
};
