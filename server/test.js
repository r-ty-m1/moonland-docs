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
  for (const m of src.matchAll(/\[(?:i|v|a)\s+(\d+)/g)) refs.add(m[1]);
}
const missing = [...refs].filter((n) => !MEDIA[n] || !fs.existsSync(path.join(ROOT, 'assets/media', MEDIA[n][0])));
assert.deepEqual(missing, [], `找不到媒體：${missing.join(', ')}`);
console.log(`✓ 文章引用 ${refs.size} 個媒體，檔案都在`);

// --- 1a. 媒體檔名都照規則（區域資料夾/文章代號-序號），而且資料夾裡沒有對照表以外的檔案 ---
const NAME = /^(?:(?:start|chat|image|video|lab|recipes|models|team|support)\/[a-z0-9]+(?:-[a-z0-9]+)*-\d{2,3}|unused\/[\w-]+)\.(?:webp|mp4|mp3)$/;
const badName = [...new Set(Object.values(MEDIA).map((e) => e[0]))].filter((f) => !NAME.test(f));
assert.deepEqual(badName, [], `這些媒體檔名不符合命名規則：${badName.join(', ')}`);
const listed = new Set(Object.values(MEDIA).map((e) => e[0]));
const onDisk = fs.readdirSync(path.join(ROOT, 'assets/media'), { recursive: true }).map((f) => f.replace(/\\/g, '/')).filter((f) => /\.\w+$/.test(f));
const stray = onDisk.filter((f) => !listed.has(f));
assert.deepEqual(stray, [], `assets/media 裡有對照表沒有的檔案：${stray.join(', ')}`);
console.log(`✓ ${listed.size} 個媒體檔名都符合命名規則`);

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

// --- 2. 伺服器 ---
const PORT = 18080 + Math.floor(Math.random() * 1000);
const DATA_DIR = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'moonland-fb-'));
const child = spawn(process.execPath, [path.join(__dirname, 'server.js')], { env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1', DATA_DIR, ADMIN_TOKEN: 'test-token' }, stdio: 'inherit' });
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
    assert.equal((await post({ kind: 'note', type: 'hack', message: 'x' })).status, 400, '未知的類型應該被拒收');
    assert.equal((await fetch(base + '/api/feedback')).status, 401, '沒有密碼不能讀回饋');
    assert.equal((await fetch(base + '/api/feedback', { headers: { authorization: 'Bearer wrong' } })).status, 401);
    const got = await (await fetch(base + '/api/feedback', { headers: { authorization: 'Bearer test-token' } })).json();
    assert.equal(got.entries.length, 2);
    assert.equal(got.entries[1].message, '看不懂 <b>這段</b>');
    assert.equal(got.entries[1].extra, undefined, '不認得的欄位不該存下來');
    console.log('✓ 回饋：送出、驗證、後台密碼都正常');
  } finally {
    child.kill('SIGTERM');
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }
})().catch((e) => { console.error(e); child.kill('SIGTERM'); process.exit(1); });
