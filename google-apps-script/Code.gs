// moonland.ai 說明中心：把回饋存進這份 Google 試算表。
// 安裝步驟見同資料夾的 README.md。改了這個檔案要在 Apps Script 重新「部署 → 管理部署作業 → 編輯 → 新版本」。
//
// 說明中心送來兩種資料（POST，內容是 JSON）：
//   { kind: 'vote', page, pageTitle, value: 'up'|'down', vid, lang }
//   { kind: 'note', type, page, pageTitle, message, contact, vid, lang }
// 後台讀取：POST { action: 'list', token }，token 要等於指令碼屬性 ADMIN_TOKEN。

var SHEET_NAME = '回饋';
var HEADERS = ['id', 'at', 'kind', 'type', 'value', 'page', 'pageTitle', 'message', 'contact', 'vid', 'lang'];
var NOTE_TYPES = ['stuck', 'unclear', 'suggest', 'other'];

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ error: 'bad json' }); }
  if (body && body.action === 'list') return list(body.token);

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

// 直接用瀏覽器打開網址時顯示，確認部署成功
function doGet() {
  return json({ ok: true, service: 'moonland-docs feedback' });
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
  if (b.kind === 'vote' && page && (b.value === 'up' || b.value === 'down')) {
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
