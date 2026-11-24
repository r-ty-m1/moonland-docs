/**
 * @OnlyCurrentDoc
 * 上面這行讓程式只能讀寫「綁定的這一份」試算表，授權視窗就不會要求存取你所有的 Google 試算表。
 */
// moonland.ai 說明中心「體驗帳號專區」：發放一次性體驗帳號（2026-11-24）。
// 這份程式綁在「體驗帳號」試算表（和回饋試算表分開）。安裝步驟見同資料夾的 README.md。
// 改了這個檔案要在 Apps Script 重新「部署 → 管理部署作業 → 編輯 → 新版本」。
//
// 每個梯次一個分頁（選單「體驗帳號 → 新增梯次」建立），格式：
//   A1 單位      B1 神奕
//   A2 課程代號  B2 學員要輸入的代號（留空會自動產生）
//   A3 每日點數  B3 下拉選單
//   A4 開始      B4 2026/11/25 00:00（這個時間到了才能領）
//   A5 結束      B5 2026/11/27 23:59:59（過了這個時間就不能領，隔天凌晨自動刪除分頁）
//   A6 暫停發放  B6 勾選框
//   A7 （狀態：共幾組、已領幾組，自動）
//   第 8 列是欄位名稱；第 9 列起 A 帳號（整串貼上會自動整理）、B 領取時間、C 領取者（瀏覽器代號）
//
// 說明中心送來：POST { action: 'claim', course, vid }（body 是 JSON，content-type 用 text/plain）
// 回覆：{ ok: true, account, points, start, end, again } 或 { error: 'notfound'|'notyet'|'paused'|'ended'|'empty'|'busy'|'bad' }（notyet 會附 start）

var ROW = { unit: 1, course: 2, points: 3, start: 4, end: 5, pause: 6, status: 7, head: 8, first: 9 };
var POINTS = ['3,000', '5,000', '6,000', '10,000', '20,000'];
var LOG_SHEET = '紀錄';
var HELP_SHEET = '說明';
// 帳號代碼：英數字，中間至少一個 -（例 SY11241-GQUXDESD）
var CODE_RE = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+$/;
// 自動產生的課程代號不用容易看錯的 0 O 1 I L
var COURSE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

// ---------- 給說明中心 ----------
function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ error: 'bad' }); }
  if (!body || body.action !== 'claim') return json({ error: 'bad' });
  var course = normCourse(body.course);
  var vid = typeof body.vid === 'string' ? body.vid.trim().slice(0, 40) : '';
  if (!course || !/^[\w-]{4,40}$/.test(vid)) return json({ error: 'bad' });
  if (tooMany(vid)) return json({ error: 'busy' });
  return json(claim(course, vid, new Date()));
}

function doGet() {
  return json({ ok: true, service: 'moonland trial accounts' });
}

// 領一組帳號。同一個瀏覽器（vid）在同一梯次只會拿到同一組
function claim(course, vid, now) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return { error: 'busy' };
  try {
    var sh = findBatch(course);
    if (!sh) return { error: 'notfound' };
    var info = readBatch(sh);
    if (!info.end || now > info.end) return { error: 'ended' };
    // 開始時間到了才能領（2026-11-24 使用者要求），回傳開始時間讓網頁顯示「這個課程從 … 開始發放」
    if (!info.start || now < info.start) return { error: 'notyet', start: iso(info.start) };
    var last = sh.getLastRow();
    if (last < ROW.first) return { error: 'empty' };
    var rows = sh.getRange(ROW.first, 1, last - ROW.first + 1, 3).getValues();
    var base = { ok: true, points: info.points, start: iso(info.start), end: iso(info.end) };
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][0] && String(rows[i][2]) === vid) { base.account = String(rows[i][0]); base.again = true; return base; }
    }
    if (info.paused) return { error: 'paused' };
    for (var j = 0; j < rows.length; j++) {
      if (rows[j][0] && !rows[j][1]) {
        sh.getRange(ROW.first + j, 2, 1, 2).setValues([[now, vid]]);
        SpreadsheetApp.flush();
        updateStatus(sh);
        base.account = String(rows[j][0]);
        return base;
      }
    }
    return { error: 'empty' };
  } finally {
    lock.releaseLock();
  }
}

// 簡單的防洗版：同一個瀏覽器 10 分鐘內最多試 20 次（猜課程代號也算）
function tooMany(vid) {
  var cache = CacheService.getScriptCache();
  var key = 'c-' + vid;
  var n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), 600);
  return n > 20;
}

// ---------- 試算表操作 ----------
function onOpen() {
  SpreadsheetApp.getUi().createMenu('體驗帳號')
    .addItem('新增梯次', 'newBatch')
    .addItem('整理這個分頁的帳號', 'tidyCurrent')
    .addSeparator()
    .addItem('現在清除已結束的梯次', 'cleanupNow')
    .addItem('開啟每天自動清除（只要做一次）', 'installCleanup')
    .addToUi();
}

function newBatch() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = '新梯次';
  for (var n = 2; ss.getSheetByName(name); n++) name = '新梯次 (' + n + ')';
  var sh = ss.insertSheet(name, 0);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var end = new Date(today.getTime());
  end.setDate(end.getDate() + 2);
  end.setHours(23, 59, 59, 0);
  sh.getRange(1, 1, 7, 2).setValues([
    ['單位', ''],
    ['課程代號', newCourseCode()],
    ['每日點數', '5,000'],
    ['開始', today],
    ['結束', end],
    ['暫停發放', false],
    ['狀態', ''],
  ]);
  sh.getRange(ROW.head, 1, 1, 3).setValues([['帳號（整串貼在下面）', '領取時間（自動）', '領取者（自動）']]);
  sh.getRange(1, 1, 7, 1).setFontWeight('bold').setBackground('#e0f7fa');
  sh.getRange(ROW.head, 1, 1, 3).setFontWeight('bold').setBackground('#4dd0e1');
  sh.getRange(ROW.points, 2).setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(POINTS, true).setAllowInvalid(true)
    .setHelpText('從選單挑，或直接輸入其他點數').build());
  sh.getRange(ROW.start, 2, 2, 1).setNumberFormat('yyyy/mm/dd hh:mm:ss')
    .setDataValidation(SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false)
      .setHelpText('日期加時間，例如 2026/11/27 23:59:59').build());
  sh.getRange(ROW.pause, 2).insertCheckboxes();
  sh.getRange(ROW.first, 2, 500, 1).setNumberFormat('yyyy/mm/dd hh:mm');
  sh.setColumnWidth(1, 220);
  sh.setColumnWidth(2, 190);
  sh.setColumnWidth(3, 120);
  sh.setFrozenRows(ROW.head);
  sh.getRange(ROW.unit, 2).activate();
  updateStatus(sh);
  ss.toast('填好單位、點數與日期，再把帳號整串貼到 A9。', '新增梯次', 8);
}

// 手動編輯時自動執行：整理貼上的帳號、依日期與單位改分頁名稱、檢查課程代號
function onEdit(e) {
  if (!e || !e.range) return;
  var sh = e.range.getSheet();
  if (!isBatch(sh)) return;
  var r = e.range.getRow(), lastR = e.range.getLastRow();
  if (lastR >= ROW.first) tidy(sh);
  if (r <= ROW.end) {
    if (r <= ROW.course && lastR >= ROW.course) checkCourse(sh);
    renameBatch(sh);
  }
  updateStatus(sh);
}

function tidyCurrent() {
  var sh = SpreadsheetApp.getActiveSheet();
  if (!isBatch(sh)) { SpreadsheetApp.getActiveSpreadsheet().toast('請先切到梯次分頁。'); return; }
  tidy(sh);
  updateStatus(sh);
}

// 第 9 列以下：把貼上的內容（空白、換行、逗號分隔，或從 Excel 表單連序號一起複製）整理成一列一組。
// 純數字（舊序號）和重複的略過；已經領走的帳號保留領取紀錄
function tidy(sh) {
  var last = Math.max(sh.getLastRow(), ROW.first);
  var width = Math.max(sh.getLastColumn(), 3);
  var vals = sh.getRange(ROW.first, 1, last - ROW.first + 1, width).getValues();
  var claimed = {};
  vals.forEach(function (row) {
    var a = String(row[0]).trim();
    if (CODE_RE.test(a) && row[1] instanceof Date) claimed[a] = [row[1], row[2]];
  });
  var res = parseCodes(vals.map(function (row) {
    // B 欄平常是領取時間，只有像帳號的文字才算（從 Excel 表單整塊貼上時帳號會落在 B 欄）；
    // C 欄是領取者代號，一律不算（Excel 表單的 C 欄是空白間隔）；D 欄以後是貼上時溢出的內容
    return row.map(function (v, i) {
      if (i === 2 || v instanceof Date || v === true || v === false) return '';
      var s = String(v).trim();
      return i === 1 ? (CODE_RE.test(s) ? s : '') : s;
    }).join('\n');
  }).join('\n'));
  var out = res.codes.map(function (c) { var k = claimed[c] || ['', '']; return [c, k[0], k[1]]; });
  sh.getRange(ROW.first, 1, vals.length, width).clearContent();
  if (out.length) sh.getRange(ROW.first, 1, out.length, 3).setValues(out);
  var msg = [];
  if (res.dups.length) msg.push('略過重複 ' + res.dups.length + ' 組');
  if (res.nums) msg.push('略過 ' + res.nums + ' 個序號');
  if (res.bad.length) msg.push('略過不像帳號的文字：' + res.bad.slice(0, 3).join('、') + (res.bad.length > 3 ? '…' : ''));
  SpreadsheetApp.getActiveSpreadsheet().toast('共 ' + out.length + ' 組' + (msg.length ? '；' + msg.join('；') : ''), '整理帳號', 6);
}

// 和體驗帳號表單產生器同樣的規則（空白、換行、逗號、分號、頓號分隔；純數字是舊序號）
function parseCodes(raw) {
  var toks = String(raw).split(/[\s,，;；、]+/).map(function (t) { return t.trim(); }).filter(Boolean);
  var seen = {}, codes = [], dups = [], bad = [], nums = 0;
  toks.forEach(function (t) {
    if (/^\d+\.?$/.test(t)) { nums++; return; }
    if (!CODE_RE.test(t)) { bad.push(t); return; }
    if (seen[t]) { dups.push(t); return; }
    seen[t] = true;
    codes.push(t);
  });
  return { codes: codes, dups: dups, nums: nums, bad: bad };
}

// 分頁名稱照產生器：體驗 + 開始日期（月日）+ _單位，例「體驗1125_神奕」
function renameBatch(sh) {
  var info = readBatch(sh);
  if (!info.start) return;
  var md = Utilities.formatDate(info.start, Session.getScriptTimeZone(), 'MMdd');
  var unit = info.unit.replace(/[\[\]:*?\/\\]/g, '').slice(0, 20);
  var want = '體驗' + md + (unit ? '_' + unit : '');
  if (sh.getName() === want || sh.getName().indexOf(want + ' (') === 0) return;
  var ss = sh.getParent(), name = want;
  for (var n = 2; ss.getSheetByName(name); n++) name = want + ' (' + n + ')';
  sh.setName(name);
}

// 課程代號：空白就產生一個；和其他梯次重複就提醒
function checkCourse(sh) {
  var cell = sh.getRange(ROW.course, 2);
  var code = normCourse(cell.getValue());
  if (!code) { code = newCourseCode(); }
  if (String(cell.getValue()) !== code) cell.setValue(code);
  var dup = batches().filter(function (o) { return o.getSheetId() !== sh.getSheetId() && normCourse(o.getRange(ROW.course, 2).getValue()) === code; });
  if (dup.length) SpreadsheetApp.getActiveSpreadsheet().toast('課程代號 ' + code + ' 和「' + dup[0].getName() + '」重複，請換一個。', '課程代號重複', 10);
}

function newCourseCode() {
  var used = {};
  batches().forEach(function (s) { used[normCourse(s.getRange(ROW.course, 2).getValue())] = true; });
  for (;;) {
    var c = '';
    for (var i = 0; i < 6; i++) c += COURSE_CHARS.charAt(Math.floor(Math.random() * COURSE_CHARS.length));
    if (!used[c]) return c;
  }
}

function updateStatus(sh) {
  var last = sh.getLastRow(), total = 0, taken = 0;
  if (last >= ROW.first) {
    sh.getRange(ROW.first, 1, last - ROW.first + 1, 2).getValues().forEach(function (r) {
      if (r[0]) { total++; if (r[1]) taken++; }
    });
  }
  var info = readBatch(sh), now = new Date(), state;
  if (!total) state = '還沒有帳號';
  else if (!info.end || !info.start) state = '請填開始與結束時間';
  else if (now > info.end) state = '已結束（隔天凌晨自動刪除）';
  else if (now < info.start) state = '還沒開始（開始時間到了才能領）';
  else if (info.paused) state = '暫停發放中';
  else if (taken >= total) state = '已全部領完';
  else state = '發放中';
  sh.getRange(ROW.status, 2).setValue('共 ' + total + ' 組，已領 ' + taken + ' 組｜' + state);
}

// ---------- 到期自動刪除 ----------
// 每天凌晨 1 點左右執行（installCleanup 設定），刪掉結束時間已過的梯次，先在「紀錄」分頁留一行摘要（不留帳號）
function cleanupExpired() {
  var now = new Date(), removed = [];
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    batches().forEach(function (sh) {
      var info = readBatch(sh);
      if (!info.end || now <= info.end) return;
      var total = 0, taken = 0, last = sh.getLastRow();
      if (last >= ROW.first) sh.getRange(ROW.first, 1, last - ROW.first + 1, 2).getValues().forEach(function (r) { if (r[0]) { total++; if (r[1]) taken++; } });
      logSheet().appendRow([now, sh.getName(), info.unit, info.course, info.points, info.start, info.end, total, taken]);
      var ss = sh.getParent();
      if (ss.getSheets().length === 1) ss.insertSheet(HELP_SHEET);   // 試算表至少要留一個分頁
      ss.deleteSheet(sh);
      removed.push(info.course);
    });
  } finally {
    lock.releaseLock();
  }
  return removed;
}

function cleanupNow() {
  var removed = cleanupExpired();
  SpreadsheetApp.getActiveSpreadsheet().toast(removed.length ? '已刪除 ' + removed.length + ' 個已結束的梯次，摘要記在「紀錄」分頁。' : '沒有已結束的梯次。', '清除', 6);
}

// 設定每天自動清除。只要做一次（第一次會跳出 Google 授權視窗，之後不會再跳）
function installCleanup() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'cleanupExpired') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('cleanupExpired').timeBased().everyDays(1).atHour(1).create();
  SpreadsheetApp.getActiveSpreadsheet().toast('已設定：每天凌晨 1 點左右自動刪除已結束的梯次。', '自動清除', 8);
}

function logSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(LOG_SHEET);
  if (!sh) {
    sh = ss.insertSheet(LOG_SHEET);
    sh.appendRow(['刪除時間', '分頁', '單位', '課程代號', '每日點數', '開始', '結束', '帳號數', '已領']);
    sh.setFrozenRows(1);
  }
  return sh;
}

// ---------- 共用 ----------
function batches() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets().filter(isBatch);
}

function isBatch(sh) {
  return sh.getRange(ROW.course, 1).getValue() === '課程代號' && sh.getRange(ROW.end, 1).getValue() === '結束';
}

function findBatch(course) {
  var list = batches();
  for (var i = 0; i < list.length; i++) {
    if (normCourse(list[i].getRange(ROW.course, 2).getValue()) === course) return list[i];
  }
  return null;
}

function readBatch(sh) {
  var v = sh.getRange(1, 2, ROW.pause, 1).getValues().map(function (r) { return r[0]; });
  return {
    unit: String(v[ROW.unit - 1]).trim(),
    course: normCourse(v[ROW.course - 1]),
    points: Number(String(v[ROW.points - 1]).replace(/[^\d]/g, '')) || 0,
    start: v[ROW.start - 1] instanceof Date ? v[ROW.start - 1] : null,
    end: v[ROW.end - 1] instanceof Date ? v[ROW.end - 1] : null,
    paused: v[ROW.pause - 1] === true,
  };
}

// 課程代號不分大小寫、忽略空白
function normCourse(v) {
  return String(v == null ? '' : v).replace(/\s+/g, '').toUpperCase().slice(0, 20);
}

function iso(d) {
  return d ? d.toISOString() : '';
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
