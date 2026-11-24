// 冒煙測試：npm 不需要，直接 `node server/test.js`
// 1. 每篇文章引用的媒體編號都有對照、檔案都存在
// 2. 伺服器的健康檢查、首頁、雜湊網址、媒體與 Range、404 都正常
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'data/media.js'));
const MEDIA = window.MEDIA;

// --- 1. 媒體 ---
const refs = new Set();
const dataFiles = (dir) => fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.js')).map((f) => path.join(ROOT, dir, f));
for (const file of dataFiles('data')) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/\[(?:i|v|a|3d)\s+(\d+)/g)) refs.add(m[1]);
}
const missing = [...refs].filter((n) => !MEDIA[n] || !fs.existsSync(path.join(ROOT, 'assets/media', MEDIA[n][0])));
assert.deepEqual(missing, [], `找不到媒體：${missing.join(', ')}`);
console.log(`✓ 文章引用 ${refs.size} 個媒體，檔案都在`);

// --- 1a. 媒體檔名都照規則（區域資料夾/文章代號-序號），而且資料夾裡沒有對照表以外的檔案 ---
const NAME = /^(?:(?:start|chat|image|video|lab|recipes|models|team|support)\/[a-z0-9]+(?:-[a-z0-9]+)*-\d{2,3}|unused\/[\w-]+)\.(?:webp|mp4|mp3|glb)$/;
const badName = [...new Set(Object.values(MEDIA).map((e) => e[0]))].filter((f) => !NAME.test(f));
assert.deepEqual(badName, [], `這些媒體檔名不符合命名規則：${badName.join(', ')}`);
const listed = new Set(Object.values(MEDIA).map((e) => e[0]));
const onDisk = fs.readdirSync(path.join(ROOT, 'assets/media'), { recursive: true }).map((f) => f.replace(/\\/g, '/')).filter((f) => /\.\w+$/.test(f));
const stray = onDisk.filter((f) => !listed.has(f));
assert.deepEqual(stray, [], `assets/media 裡有對照表沒有的檔案：${stray.join(', ')}`);
console.log(`✓ ${listed.size} 個媒體檔名都符合命名規則`);

// --- 1c. 網站程式的修改紀錄（後台「修改紀錄 › 網站程式修改」）格式正確、由新到舊 ---
const CHANGES = JSON.parse(fs.readFileSync(path.join(__dirname, 'changelog.json'), 'utf8')).changes;
assert.ok(Array.isArray(CHANGES) && CHANGES.length, 'server/changelog.json 要有 changes');
CHANGES.forEach((c, i) => {
  assert.match(String(c.date), /^\d{4}-\d{2}-\d{2}$/, `changelog 第 ${i + 1} 筆的日期要寫成 2026-11-19`);
  assert.ok(typeof c.text === 'string' && c.text.trim(), `changelog 第 ${i + 1} 筆沒有說明`);
  assert.ok(!c.commit || /^[0-9a-f]{7,40}$/.test(c.commit), `changelog 第 ${i + 1} 筆的 commit 格式不對`);
  if (i) assert.ok(CHANGES[i - 1].date >= c.date, `changelog 要由新到舊排（第 ${i + 1} 筆）`);
});
console.log(`✓ 網站程式修改紀錄 ${CHANGES.length} 筆，格式正確`);

// Google Apps Script（google-apps-script/Code.gs）收靜態版的吉吉問卷：題目與選項代號要和 survey.js 一樣
{
  const vm = require('node:vm');
  const Survey = require(path.join(ROOT, 'survey.js'));
  const gs = {}; vm.createContext(gs);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'google-apps-script/Code.gs'), 'utf8'), gs);
  const want = Survey.QUESTIONS.map((q) => ({ id: q.id, multi: q.type === 'multi', codes: q.options.map((o) => o[0]), other: Object.keys(q.other || {}) }));
  assert.deepEqual(JSON.parse(JSON.stringify(gs.SURVEY)), want, 'Code.gs 的 SURVEY 要和 survey.js 的題目、選項代號一致（改了 survey.js 要同步改 Code.gs，並在 Apps Script 重新部署）');
  for (const a of [{ role: 'work-other', 'role_work-other': '建築', ai: 'some', tools: ['gemini', 'bad', 'gemini', 'other'], tools_other: 'Claude', reason: 'nope' }, { ai: 'x' }, null]) {
    assert.deepEqual(JSON.parse(JSON.stringify(gs.cleanSurvey(a))), Survey.clean(a), 'Code.gs 的 cleanSurvey 要和 survey.js 的 clean 結果一樣');
  }
  console.log('✓ Google 試算表（Code.gs）：問卷題目與檢查規則和 survey.js 一致');
}

// 體驗帳號（trial-apps-script/Code.gs）：用假的試算表跑一次「貼上帳號 → 領取」，確認不會重複發同一組
{
  const vm = require('node:vm');
  function fakeSheet(name) {
    const g = [];   // g[列][欄]，從 0 開始
    const sh = {
      name, getName: () => sh.name, setName: (n) => { sh.name = n; }, getSheetId: () => name,
      getLastRow: () => { for (let r = g.length; r > 0; r--) if ((g[r - 1] || []).some((v) => v !== '' && v != null)) return r; return 0; },
      getLastColumn: () => Math.max(0, ...Array.from(g, (row) => { for (let c = (row || []).length; c > 0; c--) if (row[c - 1] !== '' && row[c - 1] != null) return c; return 0; })),
      getRange: (r, c, nr = 1, nc = 1) => {
        const cells = () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => { const v = (g[r - 1 + i] || [])[c - 1 + j]; return v == null ? '' : v; }));
        const put = (vals) => vals.forEach((row, i) => row.forEach((v, j) => { (g[r - 1 + i] = g[r - 1 + i] || [])[c - 1 + j] = v; }));
        return { getValue: () => cells()[0][0], getValues: cells, setValue: (v) => put([[v]]), setValues: put, clearContent: () => put(cells().map((row) => row.map(() => ''))) };
      },
    };
    return sh;
  }
  const sheet = fakeSheet('體驗1125_測試');
  const ss = { getSheets: () => [sheet], toast() {} };
  const gs = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ss, flush() {} },
    LockService: { getScriptLock: () => ({ tryLock: () => true, waitLock() {}, releaseLock() {} }) },
    CacheService: { getScriptCache: () => { const m = {}; return { get: (k) => m[k], put: (k, v) => { m[k] = v; } }; } },
  };
  vm.createContext(gs);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'trial-apps-script/Code.gs'), 'utf8'), gs);
  // 日期要在 vm 裡建立，Code.gs 的 instanceof Date 才認得（真正的 Apps Script 沒有這個問題）
  const D = (s) => vm.runInContext(`new Date('${s}')`, gs);
  const start = D('2026-11-25T00:00:00+08:00'), end = D('2026-11-27T23:59:59+08:00');
  sheet.getRange(1, 1, 6, 2).setValues([['單位', '測試'], ['課程代號', 'ab 12cd'], ['每日點數', '6,000'], ['開始', start], ['結束', end], ['暫停發放', false]]);
  // 從 Excel 表單整塊複製貼上：序號、帳號、空格、序號、帳號…，外加重複的一組
  sheet.getRange(9, 1, 2, 5).setValues([[1, 'SY11241-AAAA1111', '', 18, 'SY11241-BBBB2222'], [2, 'SY11241-CCCC3333', '', 19, 'SY11241-AAAA1111']]);
  gs.tidy(sheet);
  assert.deepEqual(sheet.getRange(9, 1, 4, 1).getValues().map((r) => r[0]), ['SY11241-AAAA1111', 'SY11241-BBBB2222', 'SY11241-CCCC3333', ''], '貼上的帳號要整理成一列一組，略過序號與重複');
  const early = gs.claim('AB12CD', 'vid-a', D('2026-11-24T23:59:00+08:00'));
  assert.equal(early.error, 'notyet', '開始時間還沒到不能領');
  assert.equal(early.start, start.toISOString(), '還沒開始時要回傳開始時間，網頁才能顯示「從幾點開始發放」');
  const now = D('2026-11-25T09:00:00+08:00');
  const a = gs.claim('AB12CD', 'vid-a', now), b = gs.claim('AB12CD', 'vid-b', now), a2 = gs.claim('AB12CD', 'vid-a', now);
  assert.equal(a.account, 'SY11241-AAAA1111');
  assert.equal(b.account, 'SY11241-BBBB2222', '不同瀏覽器要拿到不同帳號');
  assert.equal(a2.account, a.account, '同一個瀏覽器再領要拿到原本那組');
  assert.equal(a.points, 6000);
  gs.tidy(sheet);   // 已領的帳號整理後要保留領取紀錄
  assert.equal(gs.claim('AB12CD', 'vid-c', now).account, 'SY11241-CCCC3333');
  assert.equal(gs.claim('AB12CD', 'vid-d', now).error, 'empty');
  assert.equal(gs.claim('XXXXXX', 'vid-d', now).error, 'notfound');
  assert.equal(gs.claim('AB12CD', 'vid-a', D('2026-11-28T00:00:00+08:00')).error, 'ended');
  // 結束只選日期（00:00:00）要當成那天 23:59:59：最後一天下午還能拿回帳號，隔天就不行
  sheet.getRange(5, 2).setValue(D('2026-11-27T00:00:00+08:00'));
  assert.equal(gs.claim('AB12CD', 'vid-a', D('2026-11-27T15:00:00+08:00')).account, a.account, '結束只選日期時，最後一天整天都要能領');
  assert.equal(gs.claim('AB12CD', 'vid-a', D('2026-11-28T00:00:00+08:00')).error, 'ended');
  gs.fixEndTime(sheet);
  assert.equal(sheet.getRange(5, 2).getValue().toISOString(), D('2026-11-27T23:59:59+08:00').toISOString(), '選了結束日期要自動改成 23:59:59');
  sheet.getRange(6, 2).setValue(true);
  assert.equal(gs.claim('AB12CD', 'vid-e', now).error, 'paused');
  assert.equal(gs.claim('AB12CD', 'vid-b', now).account, b.account, '暫停時已領過的人還是看得到自己的帳號');
  console.log('✓ 體驗帳號（trial-apps-script）：貼上整理、不重複發放、同一人拿回原帳號、暫停與到期都正確');
}

// --- 1b. 站內連結：[文字](#頁面代號) 要有那一頁，[文字](#h-錨點) 要在同一篇找得到 ---
// （英文版已在 2026-10-30 移除，舊版在 git tag english-version）
global.SNIP = {};
for (const file of dataFiles('data')) require(file);
const ARTICLES = window.ARTICLES;
const pageIds = new Set(['home', 'feedback', ...Object.keys(ARTICLES)]);
for (const sec of window.SECTIONS) for (const r of sec.rows) pageIds.add(r.id);
const broken = [];
for (const [k, a] of Object.entries(ARTICLES)) {
  const body = String(a.body || '');
  for (const m of body.matchAll(/\]\(#([\w-]+)\)/g)) {
    const to = m[1];
    if (to.startsWith('h-') ? !body.includes(`{#${to}}`) : !pageIds.has(to)) broken.push(`${k} → #${to}`);
  }
}
assert.deepEqual(broken, [], `這些站內連結找不到目標：${broken.join(', ')}`);
console.log(`✓ ${Object.keys(ARTICLES).length} 篇文章的站內連結都找得到`);

// --- 1d. 英文版：介面文字、翻譯草稿的名稱要和 moonland.ai 本站英文版一致；公開／草稿／待更新的判斷 ---
{
  const vm = require('node:vm');
  const enCtx = { window: {} };
  enCtx.window = enCtx;
  vm.createContext(enCtx);
  const enDir = path.join(ROOT, 'data/en');
  const enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith('.js'));
  for (const f of enFiles) vm.runInContext(fs.readFileSync(path.join(enDir, f), 'utf8'), enCtx);
  // 本站英文版：點數是 Points、登月幣是 Coins（2026-11-23 起，不再用 credits、Moon Coins）
  // 連結代號（#credits、#credit-tools）和 credit card（信用卡）不算
  const OLD_TERMS = /(?<![#\w-])credits?\b(?![-\w]|\s*card)|Moon ?Coins?/i;
  const badUi = Object.entries(enCtx.UI_EN || {}).filter(([, v]) => OLD_TERMS.test(v)).map(([k]) => k);
  assert.deepEqual(badUi, [], `data/en/ui.js 還有舊說法（credits、Moon Coins）：${badUi.join('、')}`);
  const seed = enCtx.EN_SEED || { pages: {} };
  const badSeed = Object.entries(seed.pages || {}).filter(([, e]) => OLD_TERMS.test(`${e.t} ${e.n || ''} ${e.d || ''} ${e.body || ''}`)).map(([k]) => k);
  assert.deepEqual(badSeed, [], `英文翻譯還有舊說法（credits、Moon Coins）：${badSeed.join('、')}`);
  // 英文翻譯引用的圖片要存在、站內連結要有那一頁（翻譯不能弄丟或改錯編號）
  const enMissing = [];
  for (const [k, e] of Object.entries(seed.pages || {})) {
    for (const m of String(e.body || '').matchAll(/\[(?:i|v|a|3d)\s+(\d+)/g)) if (!MEDIA[m[1]]) enMissing.push(`${k} #${m[1]}`);
  }
  assert.deepEqual(enMissing, [], `英文翻譯引用了不存在的媒體：${enMissing.join(', ')}`);
  const Model = require(path.join(ROOT, 'model.js'));
  const pages = { a: { t: '中文', d: '', body: '內文', en: { t: 'English', body: 'Body', draft: true } }, b: { t: '乙', body: '內文乙' } };
  pages.a.en.src = Model.zhSig(pages.a);
  assert.equal(Model.enState(pages.a), 'draft');
  assert.equal(Model.enState(pages.b), 'none');
  let site = Model.toSite([{ label: '大分類', en: 'Section', rows: [{ id: 'a' }, { id: 'b' }] }], pages);
  assert.deepEqual(site.ARTICLES_EN, {}, '英文草稿不能出現在說明中心');
  assert.equal(site.SECTIONS[0].en, 'Section', '大分類的英文名稱要帶給說明中心');
  pages.a.en.draft = false;
  site = Model.toSite([{ label: '大分類', rows: [{ id: 'a' }, { id: 'b' }] }], pages);
  assert.equal(site.ARTICLES_EN.a.t, 'English');
  assert.equal(Model.enState(pages.a), 'ok');
  pages.a.body = '內文改過了';
  assert.equal(Model.enState(pages.a), 'stale', '中文改過，英文要標待更新');
  console.log(`✓ 英文版：介面文字 ${Object.keys(enCtx.UI_EN || {}).length} 句、翻譯 ${Object.keys(seed.pages || {}).length} 頁沒有舊說法；公開、草稿、待更新判斷正確`);
}

// --- 2. 伺服器 ---
const PORT = 18080 + Math.floor(Math.random() * 1000);
const DATA_DIR = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'moonland-fb-'));
const child = spawn(process.execPath, [path.join(__dirname, 'server.js')], { env: { ...process.env, GOOGLE_SCRIPT_URL: '', PORT: String(PORT), HOST: '127.0.0.1', DATA_DIR, ADMIN_TOKEN: 'test-token', DEV_LOGIN: '1', EDITOR_OWNERS: 'T0001', OIDC_ISSUER: '' }, stdio: 'inherit' });
const base = `http://127.0.0.1:${PORT}`;

(async () => {
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base + '/healthz')).ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  try {
    assert.equal((await fetch(base + '/healthz')).status, 200);
    const home = await fetch(base + '/');
    const html = await home.text();
    assert.equal(home.headers.get('cache-control'), 'no-cache');
    assert.match(html, /script\.js\?v=[0-9a-f]{10}"/, 'script.js 沒有內容雜湊');
    assert.match(html, /style\.css\?v=[0-9a-f]{10}"/, 'style.css 沒有內容雜湊');
    const js = await fetch(base + '/script.js');
    assert.equal(js.status, 200);
    assert.equal(js.headers.get('cache-control'), 'no-cache');
    const vid = Object.values(MEDIA).find((e) => e[0].endsWith('.mp4'))[0];
    const part = await fetch(`${base}/assets/media/${vid}`, { headers: { range: 'bytes=0-99' } });
    assert.equal(part.status, 206);
    assert.equal((await part.arrayBuffer()).byteLength, 100);
    assert.equal((await fetch(base + '/data/sections.js')).status, 200, '文章資料檔要能讀到');
    assert.equal((await fetch(base + '/config.js')).status, 200, 'config.js 要能讀到');
    for (const f of ['/markup.js', '/data/sections.js', '/edit.js', '/edit.css']) assert.equal((await fetch(base + f)).status, 200, `${f} 要能讀到`);
    assert.match(await (await fetch(base + '/edit.html')).text(), /edit\.js\?v=[0-9a-f]{10}"/, 'edit.js 沒有內容雜湊');
    assert.equal((await fetch(base + '/google-apps-script/Code.gs')).status, 404);
    assert.equal((await fetch(base + '/server/server.js')).status, 404);
    assert.equal((await fetch(base + '/assets/../server/server.js')).status, 404);
    console.log('✓ 伺服器：健康檢查、首頁雜湊、快取標頭、影片 Range、404 都正常');

    // --- 3. 回饋 ---
    const admin = await (await fetch(base + '/admin.html')).text();
    assert.match(admin, /admin\.js\?v=[0-9a-f]{10}"/, 'admin.js 沒有內容雜湊');
    const post = (body) => fetch(base + '/api/feedback', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    assert.equal((await post({ kind: 'vote', page: 'quick-start', pageTitle: '快速入門', value: 'up', vid: 'v1' })).status, 201);
    assert.equal((await post({ kind: 'note', type: 'unclear', page: '', message: '  看不懂 <b>這段</b>  ', contact: 'a@b.c', extra: 'x' })).status, 201);
    assert.equal((await post({ kind: 'note', type: 'unclear', message: '   ' })).status, 400, '空白內容應該被拒收');
    assert.equal((await post({ kind: 'vote', page: '../etc', value: 'up' })).status, 400, '頁面代號不合格應該被拒收');
    assert.equal((await post({ kind: 'vote', page: 'quick-start', value: 'none', vid: 'v1' })).status, 201, '取消投票（none）應該收下');
    assert.equal((await post({ kind: 'vote', page: 'quick-start', value: 'maybe' })).status, 400, '未知的投票值應該被拒收');
    assert.equal((await post({ kind: 'note', type: 'hack', message: 'x' })).status, 400, '未知的類型應該被拒收');
    assert.equal((await fetch(base + '/api/feedback')).status, 401, '沒有密碼不能讀回饋');
    assert.equal((await fetch(base + '/api/feedback', { headers: { authorization: 'Bearer wrong' } })).status, 401);
    const got = await (await fetch(base + '/api/feedback', { headers: { authorization: 'Bearer test-token' } })).json();
    assert.equal(got.entries.length, 3);
    assert.equal(got.entries[2].value, 'none');
    assert.equal(got.entries[1].message, '看不懂 <b>這段</b>');
    assert.equal(got.entries[1].extra, undefined, '不認得的欄位不該存下來');
    // 經過代理時依轉來的訪客位址計算：A 用完額度，B 仍然送得出去
    const vote = (ip) => fetch(base + '/api/feedback', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify({ kind: 'vote', page: 'quick-start', value: 'up' }) });
    for (let i = 0; i < 30; i++) await vote('203.0.113.1');
    assert.equal((await vote('203.0.113.1')).status, 429, '同一個訪客超過 30 筆要擋');
    assert.equal((await vote('203.0.113.2')).status, 201, '不同訪客不能共用額度');
    console.log('✓ 回饋：送出、驗證、後台密碼都正常');

    // 公司網站不開放跨網域：moonland.ai 上的靜態版不能連回來（2026-11-23 使用者要求）
    const xo = await fetch(base + '/api/feedback', { method: 'POST', headers: { origin: 'https://help.moonland.ai', 'x-forwarded-for': '203.0.113.50' }, body: JSON.stringify({ kind: 'vote', page: 'quick-start', value: 'up' }) });
    assert.equal(xo.headers.get('access-control-allow-origin'), null, '不能對其他網站開放跨網域');
    console.log('✓ 跨網域：公司網站不對其他網站開放');

    // --- 4. 編輯後台（DEV_LOGIN 假登入；T0001 是 EDITOR_OWNERS 裡的主管理員） ---
    assert.match(html, /<script src="content\.js"><\/script>/, '首頁要改讀伺服器的 content.js');
    assert.doesNotMatch(html, /data\/start\.js/, '首頁不該再讀 data/*.js');
    assert.match(await (await fetch(base + '/content.js')).text(), /window\.ARTICLES=.*"quick-start"/, 'content.js 要有文章');
    assert.deepEqual(await (await fetch(base + '/api/me')).json(), { login: 'dev', user: null, role: null });
    const login = async (no, name) => {
      const r = await fetch(base + '/api/auth/dev', { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ no, name, next: '/edit.html' }) });
      assert.equal(r.status, 302);
      assert.equal(r.headers.get('location'), '/edit.html');
      return r.headers.get('set-cookie').split(';')[0];
    };
    const as = (cookie) => (p, opt = {}) => fetch(base + p, { ...opt, headers: { cookie, 'x-ml-editor': '1', ...(opt.headers || {}) } });
    const owner = as(await login('t0001', '測試主管'));
    const stranger = as(await login('T0009', '路人'));
    assert.equal((await fetch(base + '/api/editor/state')).status, 401, '沒登入不能讀後台內容');
    assert.equal((await stranger('/api/editor/state')).status, 403, '不在名單上不能讀後台內容');
    assert.equal((await fetch(base + '/api/editor/state', { headers: { cookie: 'ml_sess=eyJubyI6IlQwMDAxIn0.fake' } })).status, 401, '偽造的 cookie 要被拒絕');
    const me = await (await owner('/api/me')).json();
    assert.equal(me.role, 'owner');
    assert.equal(me.user.no, 'T0001');

    const st = await (await owner('/api/editor/state')).json();
    assert.ok(st.editors.some((e) => e.no === 'T0001' && e.fixed), '主管理員登入後要出現在名單上');
    assert.equal((await fetch(base + '/data/drafts.js')).status, 404, '草稿檔不對外提供');
    const put =(who, body, headers = {}) => who('/api/editor/state', { method: 'PUT', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
    const doc = (s, extra) => ({ rev: s.rev, sections: s.sections, pages: s.pages, history: s.history, log: s.log, trash: s.trash, editors: s.editors, ...extra });
    assert.equal((await put(owner, doc(st), { 'x-ml-editor': '' })).status, 403, '沒有後台標頭的寫入要被拒絕');
    assert.equal((await put(owner, doc(st, { rev: st.rev - 1 }))).status, 409, '版本不對要回 409');
    const broken = JSON.parse(JSON.stringify(st.sections));
    broken[0].rows.push({ id: 'no-such-page' });
    assert.equal((await put(owner, doc(st, { sections: broken }))).status, 400, '目錄指到不存在的頁面要被拒絕');
    st.pages['quick-start'].t = '測試標題 ABC';
    st.pages.gallery.draft = true;   // 草稿：後台看得到，說明中心看不到
    st.editors.push({ no: 'T0002', name: '測試編輯', role: 'editor', at: new Date().toISOString() });
    const saved = await put(owner, doc(st));
    assert.equal(saved.status, 200);
    st.rev = (await saved.json()).rev;
    const pub = await (await fetch(base + '/content.js')).text();
    assert.match(pub, /測試標題 ABC/, '存檔後 content.js 要馬上更新');
    assert.ok(!pub.includes('"gallery"'), '草稿不該出現在說明中心');

    // 封存：從目錄拿下來、留在封存裡；說明中心看不到，重新讀取還在
    const grp = st.sections.flatMap((s) => s.rows).find((r) => r.groups && r.groups.some((g) => g.items.length));
    const aid = grp.groups.find((g) => g.items.length).items.shift();
    const apage = st.pages[aid];
    delete st.pages[aid];
    st.archive = [{ id: aid, key: `c:${grp.id}:0`, row: aid, page: apage, at: new Date().toISOString(), by: '測試' }];
    const sa = await put(owner, doc(st, { archive: st.archive }));
    assert.equal(sa.status, 200, '封存要存得進去');
    st.rev = (await sa.json()).rev;
    assert.ok(!(await (await fetch(base + '/content.js')).text()).includes(`"${aid}":{`), '封存的頁面不該出現在說明中心');
    const st3 = await (await owner('/api/editor/state')).json();
    assert.equal(st3.archive[0].id, aid, '封存要存在伺服器上');
    assert.ok(Array.isArray(st3.changes) && st3.changes.length, '後台要讀得到網站程式的修改紀錄');
    assert.equal((await fetch(base + '/server/changelog.json')).status, 404, '修改紀錄檔不對外提供');
    // 只送舊欄位（沒有 archive）的存檔不能把封存清掉
    const keep = await put(owner, doc(st3));
    assert.equal(keep.status, 200);
    st.rev = (await keep.json()).rev;
    assert.equal((await (await owner('/api/editor/state')).json()).archive.length, 1, '沒送封存欄位時要保留原本的封存');
    // 待辦清單與許願池存在伺服器上；沒送這兩個欄位的存檔不會清掉
    const st5 = await (await owner('/api/editor/state')).json();
    const tw = await put(owner, doc(st5, { archive: st5.archive, todos: [{ id: 't1', t: '待寫的文章', status: 'todo', pri: 'high' }], wishes: [{ id: 'w1', t: '想要的功能', tags: ['新功能'], status: 'new', votes: [] }] }));
    assert.equal(tw.status, 200);
    st.rev = (await tw.json()).rev;
    const st6 = await (await owner('/api/editor/state')).json();
    assert.equal(st6.todos[0].t, '待寫的文章', '待辦要存在伺服器上');
    assert.equal(st6.wishes[0].tags[0], '新功能', '許願池要存在伺服器上');
    const tw2 = await put(owner, doc(st6));
    st.rev = (await tw2.json()).rev;
    const st7 = await (await owner('/api/editor/state')).json();
    assert.ok(st7.todos.length === 1 && st7.wishes.length === 1, '沒送待辦欄位時要保留原本的待辦與願望');
    // 訪客問卷：只收認得的答案；同一個訪客重填只算最後一次；只有編輯者讀得到
    const sv = (body, ip) => fetch(base + '/api/survey', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip || '198.51.100.7' }, body: JSON.stringify(body) });
    assert.equal((await sv({ answers: { role: 'stu-rel', source: ['school', 'hack'], reason: 'first', email: 'a@b.c' }, vid: 's1' })).status, 201);
    assert.equal((await sv({ answers: { role: 'work-other', 'role_work-other': '建築', ai: 'none' }, vid: 's1' })).status, 201);
    assert.equal((await sv({ answers: { role: 'boss' }, vid: 's2' })).status, 400, '沒有認得的答案要拒收');
    assert.equal((await fetch(base + '/api/editor/survey')).status, 401, '沒登入不能讀問卷');
    const svs = (await (await owner('/api/editor/survey')).json()).entries;
    assert.equal(svs.length, 1, '同一個訪客重填只算最後一次');
    assert.equal(svs[0]['role_work-other'], '建築');
    assert.equal(svs[0].email, undefined, '不認得的欄位不該存下來');
    assert.equal(svs[0].ip, undefined, '不存訪客位址');
    // 最近刪除只留 30 天
    const old = new Date(Date.now() - 31 * 864e5).toISOString();
    const st4 = await (await owner('/api/editor/state')).json();
    const tr = await put(owner, doc(st4, { archive: st4.archive, trash: [{ ...st4.archive[0], id: 'old-x', at: old }, { ...st4.archive[0], id: 'new-x' }] }));
    assert.equal(tr.status, 200);
    st.rev = (await tr.json()).rev;
    assert.deepEqual((await (await owner('/api/editor/state')).json()).trash.map((x) => x.id), ['new-x'], '超過 30 天的最近刪除要自動清掉');

    // 編輯者不能改名單
    const editor = as(await login('T0002', '測試編輯'));
    assert.equal((await (await editor('/api/me')).json()).role, 'editor');
    const st2 = await (await editor('/api/editor/state')).json();
    st2.editors = [{ no: 'T0002', name: 'x', role: 'owner' }];
    const r2 = await put(editor, doc(st2));
    assert.equal(r2.status, 200);
    assert.ok((await r2.json()).editors.some((e) => e.no === 'T0002' && e.role === 'editor'), '編輯者改名單要被忽略');

    // 上傳：自動命名、給編號，網址和程式附的圖片一樣
    const webp = Buffer.concat([Buffer.from('RIFF\x10\x00\x00\x00WEBPVP8 ', 'latin1'), Buffer.alloc(8)]);
    const up = (who, q, body) => who(`/api/editor/media?${q}`, { method: 'POST', headers: { 'content-type': 'image/webp' }, body });
    assert.equal((await up(owner, 'page=quick-start&ratio=1.5', Buffer.from('<svg>'))).status, 400, '不是圖片要被拒絕');
    const u = await (await up(owner, 'page=quick-start&ratio=1.5', webp)).json();
    assert.match(u.path, /^start\/quick-start-\d{2}\.webp$/, `上傳的檔名不符合規則：${u.path}`);
    assert.ok(+u.n > Math.max(...Object.keys(MEDIA).map(Number)), '新編號要比用過的都大');
    assert.equal((await fetch(`${base}/assets/media/${u.path}`)).status, 200, '上傳的圖片要讀得到');
    assert.match(await (await fetch(base + '/content.js')).text(), new RegExp(`"${u.n}":\\["${u.path}"`), 'content.js 要有新圖片');
    const u2 = await (await up(owner, 'page=quick-start&ratio=1.5', webp)).json();
    assert.equal(+u2.path.match(/-(\d+)\./)[1], +u.path.match(/-(\d+)\./)[1] + 1, '同一篇的序號要接著排');

    // 備份與還原
    const bk = await (await owner('/api/editor/backup')).json();
    assert.equal(bk.kind, 'moonland-docs-backup');
    assert.ok(bk.files[u.path], '備份要包含上傳的圖片');
    assert.equal((await editor('/api/editor/restore', { method: 'POST', body: JSON.stringify(bk) })).status, 403, '只有主管理員能還原');
    assert.equal((await owner('/api/editor/restore', { method: 'POST', body: '{"kind":"x"}' })).status, 400);
    assert.equal((await owner('/api/editor/restore', { method: 'POST', body: JSON.stringify(bk) })).status, 200);
    assert.match(await (await fetch(base + '/content.js')).text(), /測試標題 ABC/);
    assert.deepEqual((await (await owner('/api/editor/check')).json()).problems, [], '全站檢查不該有問題');
    assert.equal((await fetch(base + '/model.js')).status, 200, 'model.js 要能讀到');
    console.log('✓ 編輯後台：登入、權限、存檔、版本衝突、上傳命名、備份還原都正常');

    // --- 4a. 英文版：content.js 帶英文、介面文字檔可以讀，翻譯草稿檔不對外 ---
    assert.match(await (await fetch(base + '/content.js')).text(), /window\.ARTICLES_EN=\{\};/, 'content.js 要有 ARTICLES_EN，而且英文草稿不能出現');
    const stEn = await (await owner('/api/editor/state')).json();
    assert.equal(stEn.pages['quick-start'].en.draft, true, '程式附的翻譯要匯入成英文草稿');
    assert.equal(stEn.pages['quick-start'].en.by, 'AI 翻譯（待審）');
    assert.equal(stEn.sections[0].en, 'Get started', '大分類的英文名稱要匯入');
    assert.ok(stEn.log.some((x) => /匯入英文翻譯草稿/.test(x.action)), '匯入要記在修改紀錄');
    assert.equal((await fetch(base + '/data/en/ui.js')).status, 200, '英文介面文字要讀得到');
    assert.equal((await fetch(base + '/data/en/terms.json')).status, 404, '名稱對照表不用對外');
    for (const f of fs.readdirSync(path.join(ROOT, 'data/en')).filter((x) => x.endsWith('.js') && x !== 'ui.js')) {
      assert.equal((await fetch(base + '/data/en/' + f)).status, 404, `英文翻譯草稿 data/en/${f} 不能對外`);
    }
    console.log('✓ 英文版：content.js 帶英文、翻譯草稿不對外');

    // --- 4b. 閱讀流量：收紀錄、擋格式不對與機器人、同一次閱讀只算一次、搜尋找不到的字、讀取要登入 ---
    const pv = (body, ua) => fetch(base + '/api/view', { method: 'POST', headers: { 'content-type': 'text/plain', 'user-agent': ua || 'Mozilla/5.0', 'x-forwarded-for': '198.51.100.20' }, body: JSON.stringify(body) });
    const v1 = { kind: 'view', page: 'quick-start', t: '5 分鐘快速入門', view: 'aaaa1111', vid: 'reader1', sec: 12, depth: 40, src: 'google' };
    assert.equal((await pv(v1)).status, 204);
    assert.equal((await pv({ ...v1, sec: 30, depth: 95 })).status, 204, '同一次閱讀可以再送（切回分頁後）');
    assert.equal((await pv({ ...v1, view: 'bbbb2222', vid: 'reader2', sec: 5, depth: 10, src: 'jiji', staff: true })).status, 204);
    assert.equal((await pv({ ...v1, view: 'cccc3333', sec: 2 })).status, 400, '不到 3 秒的不收');
    assert.equal((await pv({ ...v1, view: 'dddd4444', src: 'evil<script>' })).status, 400, '來源格式不對要拒絕');
    assert.equal((await pv({ ...v1, view: 'eeee5555' }, 'Googlebot/2.1')).status, 204, '機器人回 204 但不存');
    assert.equal((await pv({ kind: 'miss', q: '  量子 糖果機  ', vid: 'reader1' })).status, 204);
    assert.equal((await pv({ ...v1, view: 'ffff6666', vid: 'reader3', lang: 'en', sec: 20 })).status, 204, '英文版的閱讀');
    assert.equal((await fetch(base + '/api/views')).status, 401, '沒登入、沒密碼不能看閱讀流量');
    const vsEn = await (await owner('/api/views?days=7&lang=en')).json();
    assert.equal(vsEn.totals.views, 1, '只看英文版');
    assert.deepEqual(vsEn.langs, { zh: 1, en: 1 }, '中英文各被看幾次');
    const vs = await (await owner('/api/views?days=7&lang=zh')).json();
    assert.equal(vs.totals.views, 1, '編輯者自己看的預設不算，同一次閱讀只算一次，機器人不算');
    assert.equal(vs.pages[0].id, 'quick-start');
    assert.equal(vs.pages[0].avgSec, 30, '同一次閱讀取秒數最多的那筆');
    assert.equal(vs.pages[0].endPct, 100);
    assert.deepEqual(vs.sources, [{ k: 'google', n: 1 }]);
    assert.deepEqual(vs.misses.map((m) => m.q), ['量子 糖果機']);
    assert.ok(vs.unread.some((p) => p.id === 'credits') && !vs.unread.some((p) => p.id === 'quick-start'), '要列出沒人看的頁面');
    const vs2 = await (await fetch(base + '/api/views?days=0&staff=1', { headers: { authorization: 'Bearer test-token' } })).json();
    assert.equal(vs2.totals.views, 3, '勾「包含編輯者」要算進去；後台密碼也能讀');
    const vfiles = fs.readdirSync(path.join(DATA_DIR, 'views'));
    const vraw = fs.readFileSync(path.join(DATA_DIR, 'views', vfiles[0]), 'utf8');
    assert.ok(!vraw.includes('198.51.100.20') && !vraw.includes('Mozilla'), '閱讀紀錄不能存 IP 或瀏覽器資訊');
    console.log('✓ 閱讀流量：收紀錄、去重、擋機器人、搜尋找不到的字、讀取權限都正常');

    // --- 4c. 布告欄：公告只有主管理員能發與置頂；修改、刪除限本人或主管理員 ---
    const ed = as(await login('T0002', '測試編輯'));
    const bp = (who, act, body) => who('/api/editor/board/' + act, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    assert.equal((await fetch(base + '/api/editor/board')).status, 401, '沒登入不能讀布告欄');
    assert.equal((await bp(ed, 'create', { kind: 'notice', t: '我想發公告' })).status, 403, '編輯者不能發公告');
    assert.equal((await bp(ed, 'create', { kind: 'post', t: '' })).status, 400, '沒有標題要拒絕');
    let bj = await (await bp(ed, 'create', { kind: 'post', t: '頭尾幀缺範例', body: '第 2 步看不懂', tag: 'missing', page: 'v-frames', by: '冒名' })).json();
    const bpost = bj.posts[0];
    assert.equal(bpost.by, '測試編輯', '發文者的名字由伺服器決定');
    bj = await (await bp(owner, 'create', { kind: 'notice', t: '下週整理影片分類' })).json();
    const notice = bj.posts[0];
    assert.equal(notice.pinned, true, '公告預設置頂');
    assert.equal((await bp(ed, 'update', { id: bpost.id, pinned: true })).status, 403, '編輯者不能置頂');
    assert.equal((await bp(ed, 'update', { id: notice.id, t: '改別人的' })).status, 403, '不能改別人的');
    assert.equal((await bp(ed, 'reply', { id: notice.id, body: '收到' })).status, 200, '大家都能回覆');
    assert.equal((await bp(ed, 'update', { id: bpost.id, done: true })).status, 200);
    assert.equal((await bp(ed, 'delete', { id: notice.id })).status, 403, '不能刪別人的');
    bj = await (await (await owner('/api/editor/board')).json());
    assert.equal(bj.posts.find((p) => p.id === notice.id).replies[0].by, '測試編輯');
    assert.equal(bj.posts.find((p) => p.id === bpost.id).done, true);
    assert.equal((await bp(owner, 'delete', { id: bpost.id })).status, 200, '主管理員可以刪任何一則');
    assert.ok(fs.existsSync(path.join(DATA_DIR, 'board.json')), '布告欄存在 board.json');
    console.log('✓ 布告欄：發文、公告、置頂、回覆、權限都正常');
  } finally {
    child.kill('SIGTERM');
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }
  await oidcTest();
  await s3Test();
})().catch((e) => { console.error(e); child.kill('SIGTERM'); process.exit(1); });

// --- 5. 公司帳號登入：用假的 OIDC 伺服器（模擬 Authentik）走一次完整流程 ---
async function oidcTest() {
  const http = require('node:http');
  const crypto = require('node:crypto');
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  let issuer, pending = {};
  const idp = http.createServer((req, res) => {
    const u = new URL(req.url, issuer);
    const json = (o, s = 200) => { res.writeHead(s, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };
    if (u.pathname === '/app/.well-known/openid-configuration') return json({ issuer, authorization_endpoint: `${issuer}authorize`, token_endpoint: `${issuer}token`, userinfo_endpoint: `${issuer}userinfo` });
    if (u.pathname === '/app/token') {
      let body = '';
      req.on('data', (c) => { body += c; });
      return req.on('end', () => {
        const f = new URLSearchParams(body);
        const p = pending[f.get('code')];
        const okClient = req.headers.authorization === `Basic ${Buffer.from('cid:csecret').toString('base64')}`;
        const okPkce = p && crypto.createHash('sha256').update(f.get('code_verifier') || '').digest('base64url') === p.challenge;
        if (!okClient || !okPkce || f.get('redirect_uri') !== p.redirect) return json({ error: 'invalid_grant' }, 400);
        json({ access_token: 'at', id_token: `${b64({ alg: 'RS256' })}.${b64({ iss: issuer, aud: 'cid', exp: Math.floor(Date.now() / 1000) + 300, nonce: p.nonce, employee_number: 't0001', name: '公司帳號主管' })}.sig` });
      });
    }
    json({ error: 'not found' }, 404);
  });
  await new Promise((r) => idp.listen(0, '127.0.0.1', r));
  issuer = `http://127.0.0.1:${idp.address().port}/app/`;

  const port = PORT + 1;
  const dir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'moonland-oidc-'));
  const srv = spawn(process.execPath, [path.join(__dirname, 'server.js')], { env: { ...process.env, GOOGLE_SCRIPT_URL: '', PORT: String(port), HOST: '127.0.0.1', DATA_DIR: dir, OIDC_ISSUER: issuer, OIDC_CLIENT_ID: 'cid', OIDC_CLIENT_SECRET: 'csecret', EDITOR_OWNERS: 'T0001', DEV_LOGIN: '1' }, stdio: 'inherit' });
  const b = `http://127.0.0.1:${port}`;
  try {
    for (let i = 0; i < 50; i++) { try { if ((await fetch(b + '/healthz')).ok) break; } catch {} await new Promise((r) => setTimeout(r, 100)); }
    assert.equal((await (await fetch(b + '/api/me')).json()).login, 'oidc', '有 OIDC 設定時要用公司帳號登入');
    assert.equal((await fetch(b + '/api/auth/dev', { method: 'POST', body: 'no=T0001' })).status, 404, '有 OIDC 設定時假登入要關閉');
    const go = await fetch(b + '/api/auth/login?next=/edit.html%23media', { redirect: 'manual', headers: { 'x-forwarded-host': 'docs-vibe.example.net', 'x-forwarded-proto': 'https' } });
    assert.equal(go.status, 302);
    const to = new URL(go.headers.get('location'));
    assert.equal(to.origin + to.pathname, `${issuer}authorize`);
    assert.equal(to.searchParams.get('redirect_uri'), 'https://docs-vibe.example.net/api/auth/callback/authentik');
    assert.match(to.searchParams.get('scope'), /\bemployee_number\b/, '一定要請求 employee_number');
    assert.equal(to.searchParams.get('code_challenge_method'), 'S256');
    const tmp = go.headers.get('set-cookie').split(';')[0];
    assert.match(go.headers.get('set-cookie'), /HttpOnly.*SameSite=Lax.*Secure/);
    pending.c1 = { challenge: to.searchParams.get('code_challenge'), nonce: to.searchParams.get('nonce'), redirect: to.searchParams.get('redirect_uri') };
    const cb = (q, cookie) => fetch(`${b}/api/auth/callback/authentik?${q}`, { redirect: 'manual', headers: { cookie, 'x-forwarded-host': 'docs-vibe.example.net', 'x-forwarded-proto': 'https' } });
    assert.equal((await cb(`code=c1&state=wrong`, tmp)).status, 400, 'state 不對要拒絕');
    const done = await cb(`code=c1&state=${to.searchParams.get('state')}`, tmp);
    assert.equal(done.status, 302);
    assert.equal(done.headers.get('location'), '/edit.html#media');
    const sess = done.headers.getSetCookie().find((c) => c.startsWith('ml_sess=')).split(';')[0];
    const me = await (await fetch(b + '/api/me', { headers: { cookie: sess } })).json();
    assert.deepEqual([me.user.no, me.user.name, me.role], ['T0001', '公司帳號主管', 'owner']);
    console.log('✓ 公司帳號登入：轉址、PKCE、state、員工編號、權限都正常（模擬 Authentik）');
  } finally {
    srv.kill('SIGTERM');
    idp.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// --- 6. 物件儲存：用假的 S3 伺服器（模擬 Silo）測上傳圖片、上傳影片、讀取轉址、備份還原 ---
async function s3Test() {
  // 簽章先對 AWS 文件公開的範例（Signature Version 4），兩種簽法都要一字不差
  const { presignUrl, authHeaders } = require('./s3.js');
  const ex = { accessKey: 'AKIAIOSFODNN7EXAMPLE', secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', region: 'us-east-1', date: new Date('2013-05-24T00:00:00Z') };
  assert.ok(presignUrl({ ...ex, method: 'GET', url: 'https://examplebucket.s3.amazonaws.com/test.txt', expires: 86400 })
    .endsWith('X-Amz-Signature=aeeed9bbccd4d02ee5c0109b86d86835f995330da4c265957d157751f604d404'), '預簽網址的簽章和 AWS 範例不同');
  assert.ok(authHeaders({ ...ex, method: 'GET', url: 'https://examplebucket.s3.amazonaws.com/test.txt', headers: { Range: 'bytes=0-9' }, payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' })
    .authorization.endsWith('Signature=f0e8bdb87c964420e857bd35b5d6ed310bd44f0170aba48dd91039c6036bdb41'), '標頭簽章和 AWS 範例不同');

  const http = require('node:http');
  const objects = new Map();   // key → { body, type }
  const signed = [];
  const s3 = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    const key = decodeURIComponent(u.pathname).replace(/^\/test-bucket\//, '');
    signed.push(Boolean(req.headers.authorization || u.searchParams.get('X-Amz-Signature')));
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      if (req.method === 'PUT') { objects.set(key, { body: Buffer.concat(chunks), type: req.headers['content-type'] || '' }); res.writeHead(200, { etag: '"x"' }); return res.end(); }
      const o = objects.get(key);
      if (req.method === 'DELETE') { objects.delete(key); res.writeHead(204); return res.end(); }
      if (!o) { res.writeHead(404); return res.end('<Error><Code>NoSuchKey</Code></Error>'); }
      res.writeHead(200, { 'content-type': o.type, 'content-length': o.body.length });
      res.end(req.method === 'HEAD' ? undefined : o.body);
    });
  });
  await new Promise((r) => s3.listen(0, '127.0.0.1', r));
  const s3url = `http://127.0.0.1:${s3.address().port}`;
  const port = PORT + 2;
  const dir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'moonland-s3-'));
  const env = { ...process.env, GOOGLE_SCRIPT_URL: '', PORT: String(port), HOST: '127.0.0.1', DATA_DIR: dir, DEV_LOGIN: '1', EDITOR_OWNERS: 'T0001', OIDC_ISSUER: '',
    S3_ENDPOINT: s3url, S3_PUBLIC_ENDPOINT: s3url, S3_BUCKET: 'test-bucket', S3_ACCESS_KEY_ID: 'AK', S3_SECRET_ACCESS_KEY: 'SK', S3_REGION: 'us-east-1', S3_FORCE_PATH_STYLE: 'true' };
  const srv = spawn(process.execPath, [path.join(__dirname, 'server.js')], { env, stdio: 'inherit' });
  const b = `http://127.0.0.1:${port}`;
  try {
    for (let i = 0; i < 50; i++) { try { if ((await fetch(b + '/healthz')).ok) break; } catch {} await new Promise((r) => setTimeout(r, 100)); }
    const r = await fetch(b + '/api/auth/dev', { method: 'POST', body: 'no=T0001&name=主管', redirect: 'manual' });
    const cookie = r.headers.get('set-cookie').split(';')[0];
    const owner = (p, o = {}) => fetch(b + p, { ...o, headers: { cookie, 'x-ml-editor': '1', ...(o.headers || {}) } });

    // 圖片：經伺服器存進 S3，讀取時轉址到簽好的網址
    const webp = Buffer.concat([Buffer.from('RIFF\x10\x00\x00\x00WEBPVP8 ', 'latin1'), Buffer.alloc(8)]);
    const img = await (await owner('/api/editor/media?page=quick-start&ratio=1.5', { method: 'POST', headers: { 'content-type': 'image/webp' }, body: webp })).json();
    assert.ok(objects.has(`media/${img.path}`), '圖片要存進 S3');
    assert.equal(objects.get(`media/${img.path}`).type, 'image/webp');
    const go = await fetch(`${b}/assets/media/${img.path}`, { redirect: 'manual' });
    assert.equal(go.status, 302, '上傳的圖片要轉址到 S3');
    const loc = new URL(go.headers.get('location'));
    assert.equal(loc.pathname, `/test-bucket/media/${img.path}`);
    assert.ok(loc.searchParams.get('X-Amz-Signature'), '讀取網址要有簽章');
    assert.equal((await fetch(go.headers.get('location'))).status, 200);
    const again = await fetch(`${b}/assets/media/${img.path}`, { redirect: 'manual' });
    assert.equal(again.headers.get('location'), go.headers.get('location'), '同一小時內讀取網址要一樣，瀏覽器才快取得到');
    assert.equal((await fetch(`${b}/assets/media/start/no-such-99.webp`, { redirect: 'manual' })).status, 404, '不是上傳的檔案不轉址');

    // 影片：先拿上傳網址，瀏覽器直接傳到 S3，再請伺服器確認
    assert.equal((await owner('/api/editor/video/start?page=quick-start&ratio=1.7778&size=999999999', { method: 'POST' })).status, 413, '超過 90 MB 要拒絕');
    const st = await (await owner('/api/editor/video/start?page=quick-start&ratio=1.7778&size=2048', { method: 'POST' })).json();
    assert.match(st.path, /^start\/quick-start-\d{2}\.mp4$/);
    assert.notEqual(st.path.replace('.mp4', ''), img.path.replace('.webp', ''), '影片和圖片的序號不能撞');
    const fin = (body) => owner('/api/editor/video/finish', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    assert.equal((await fin({ path: st.path, ratio: 1.7778 })).status, 400, '還沒傳上去不能給編號');
    assert.equal((await fetch(st.uploadUrl, { method: 'PUT', headers: { 'content-type': 'video/mp4' }, body: Buffer.alloc(2048) })).status, 200);
    assert.equal((await fin({ path: 'start/other-01.mp4', ratio: 1.7778 })).status, 400, '不是這次保留的檔名要拒絕');
    const v = await (await fin({ path: st.path, ratio: 1.7778 })).json();
    assert.ok(+v.n > +img.n, '影片要拿到新編號');
    assert.match(await (await fetch(b + '/content.js')).text(), new RegExp(`"${v.n}":\\["${st.path}"`), 'content.js 要有新影片');
    const st2 = await (await owner('/api/editor/video/start?page=quick-start&ratio=1&size=10', { method: 'POST' })).json();
    await fetch(st2.uploadUrl, { method: 'PUT', headers: { 'content-type': 'text/html' }, body: '<html>' });
    assert.equal((await fin({ path: st2.path, ratio: 1 })).status, 400, '不是 MP4 要拒絕');
    assert.ok(!objects.has(`media/${st2.path}`), '不合格的檔案要從 S3 刪掉');

    // 備份包含 S3 上的圖片與影片；還原時放回 S3
    const bk = await (await owner('/api/editor/backup')).json();
    assert.ok(bk.files[img.path] && bk.files[st.path], '備份要包含 S3 上的圖片與影片');
    objects.clear();
    assert.equal((await owner('/api/editor/restore', { method: 'POST', body: JSON.stringify(bk) })).status, 200);
    assert.ok(objects.has(`media/${img.path}`) && objects.has(`media/${st.path}`), '還原要把檔案放回 S3');
    assert.ok(signed.every(Boolean), '每個 S3 請求都要有簽章');
    console.log('✓ 物件儲存：圖片與影片存進 S3、讀取轉址、大小與格式檢查、備份還原都正常（模擬 Silo）');
  } finally {
    srv.kill('SIGTERM');
    s3.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
