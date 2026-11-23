// moonland.ai 說明中心：把回饋存進這份 Google 試算表。
// 安裝步驟見同資料夾的 README.md。改了這個檔案要在 Apps Script 重新「部署 → 管理部署作業 → 編輯 → 新版本」。
//
// 說明中心送來三種資料（POST，內容是 JSON）：
//   { kind: 'vote', page, pageTitle, value: 'up'|'down'|'none', vid, lang }（none＝取消投票）
//   { kind: 'note', type, page, pageTitle, message, contact, vid, lang }
//   { kind: 'survey', answers: { role, ai, tools: [...], ... }, vid, lang }（吉吉問卷，存在「問卷」分頁；2026-11-23 起）
// 後台讀取：POST { action: 'list', token }，token 要等於指令碼屬性 ADMIN_TOKEN（只讀回饋，不讀問卷）。

var SHEET_NAME = '回饋';
var HEADERS = ['id', 'at', 'kind', 'type', 'value', 'page', 'pageTitle', 'message', 'contact', 'vid', 'lang'];
var NOTE_TYPES = ['stuck', 'unclear', 'suggest', 'other'];

// 吉吉問卷的題目與選項代號：要和網站的 survey.js 一致（server/test.js 會比對，不一致測試就不會過）
// multi：可以複選；other：選了要再填一行字的選項
var SURVEY_SHEET = '問卷';
var SURVEY = [
  { id: 'role', multi: false, codes: ['edu-rel', 'stu-rel', 'edu-other', 'stu-other', 'work-rel', 'work-other', 'other'], other: ['work-other', 'other'] },
  { id: 'ai', multi: false, codes: ['none', 'some', 'often'], other: [] },
  { id: 'tools', multi: true, codes: ['chatgpt', 'gemini', 'midjourney', 'sd', 'video', 'other'], other: ['other'] },
  { id: 'ml', multi: false, codes: ['none', 'some', 'often'], other: [] },
  { id: 'source', multi: true, codes: ['school', 'work', 'social', 'youtube', 'line', 'search', 'event', 'friend', 'other'], other: ['other'] },
  { id: 'reason', multi: false, codes: ['learn', 'first', 'problem', 'advanced', 'team', 'other'], other: ['other'] },
];

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ error: 'bad json' }); }
  if (body && body.action === 'list') return list(body.token);
  if (body && body.kind === 'survey') return postSurvey(body);

  var entry = clean(body);
  if (!entry) return json({ error: '資料格式不正確' });
  if (tooMany(entry.vid)) return json({ error: '送出太頻繁，請稍後再試' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // 開頭是 = + - @ 的文字前面加 '，避免試算表當成公式執行
    sheet().appendRow(HEADERS.map(function (h) { var v = entry[h] || ''; return /^[=+\-@]/.test(v) ? "'" + v : v; }));
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

// 直接用瀏覽器打開網址時顯示，確認部署成功（survey: true 表示已經是收得到問卷的新版本）
function doGet() {
  return json({ ok: true, service: 'moonland-docs feedback', survey: true });
}

// ---------- 吉吉問卷 ----------
function postSurvey(body) {
  var answers = cleanSurvey(body.answers);
  if (!answers) return json({ error: '資料格式不正確' });
  var vid = str(body.vid, 40);
  if (tooMany(vid)) return json({ error: '送出太頻繁，請稍後再試' });
  var row = { id: Utilities.getUuid(), at: new Date().toISOString(), vid: vid, lang: body.lang === 'en' ? 'en' : 'zh' };
  for (var k in answers) row[k] = Array.isArray(answers[k]) ? answers[k].join(', ') : answers[k];
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = surveySheet();
    // 照第一列的欄位名稱放；之後題目增加，新欄位自動加在最右邊
    var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    surveyHeaders().forEach(function (h) { if (head.indexOf(h) < 0) { head.push(h); sh.getRange(1, head.length).setValue(h); } });
    sh.appendRow(head.map(function (h) { var v = String(row[h] || ''); return /^[=+\-@]/.test(v) ? "'" + v : v; }));
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

// 只留下認得的題目與選項（和 survey.js 的 clean 一樣）；什麼都沒答回傳 null
function cleanSurvey(b) {
  if (!b || typeof b !== 'object') return null;
  var out = {};
  var n = 0;
  SURVEY.forEach(function (q) {
    var v = b[q.id];
    if (!q.multi && q.codes.indexOf(v) >= 0) { out[q.id] = v; n++; }
    if (q.multi && Array.isArray(v)) {
      var list = [];
      v.forEach(function (x) { if (q.codes.indexOf(x) >= 0 && list.indexOf(x) < 0) list.push(x); });
      if (list.length) { out[q.id] = list; n++; }
    }
    q.other.forEach(function (code) {
      var picked = q.multi ? (out[q.id] || []).indexOf(code) >= 0 : out[q.id] === code;
      var text = str(b[q.id + '_' + code], 60);
      if (picked && text) out[q.id + '_' + code] = text;
    });
  });
  return n ? out : null;
}

function surveyHeaders() {
  var h = ['id', 'at', 'vid', 'lang'];
  SURVEY.forEach(function (q) { h.push(q.id); q.other.forEach(function (c) { h.push(q.id + '_' + c); }); });
  return h;
}

function surveySheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SURVEY_SHEET);
  if (!sh) {
    sh = ss.insertSheet(SURVEY_SHEET);
    sh.appendRow(surveyHeaders());
    sh.setFrozenRows(1);
  }
  return sh;
}

function list(token) {
  var want = PropertiesService.getScriptProperties().getProperty('ADMIN_TOKEN');
  if (!want || token !== want) return json({ error: 'unauthorized' });
  var rows = sheet().getDataRange().getValues();
  var head = rows.shift();
  var entries = rows.map(function (r) {
    var o = {};
    head.forEach(function (h, i) { o[h] = r[i] instanceof Date ? r[i].toISOString() : String(r[i]); });
    return o;
  });
  return json({ entries: entries });
}

function clean(b) {
  if (!b || typeof b !== 'object') return null;
  var page = str(b.page, 80);
  if (page && !/^[\w-]+$/.test(page)) return null;
  var base = {
    id: Utilities.getUuid(), at: new Date().toISOString(), page: page,
    pageTitle: str(b.pageTitle, 120), vid: str(b.vid, 40), lang: b.lang === 'en' ? 'en' : 'zh',
  };
  // value 'none'：訪客再點一次取消投票
  if (b.kind === 'vote' && page && (b.value === 'up' || b.value === 'down' || b.value === 'none')) {
    base.kind = 'vote'; base.value = b.value;
    return base;
  }
  if (b.kind === 'note' && NOTE_TYPES.indexOf(b.type) >= 0 && str(b.message, 2000)) {
    base.kind = 'note'; base.type = b.type; base.message = str(b.message, 2000); base.contact = str(b.contact, 120);
    return base;
  }
  return null;
}

// 簡單的防洗版：同一個訪客 10 分鐘內最多 30 筆
function tooMany(vid) {
  var cache = CacheService.getScriptCache();
  var key = 'n-' + (vid || 'anon');
  var n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), 600);
  return n > 30;
}

function sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function str(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
