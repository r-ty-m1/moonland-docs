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
const child = spawn(process.execPath, [path.join(__dirname, 'server.js')], { env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1', DATA_DIR, ADMIN_TOKEN: 'test-token', DEV_LOGIN: '1', EDITOR_OWNERS: 'T0001', OIDC_ISSUER: '' }, stdio: 'inherit' });
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
    const put = (who, body, headers = {}) => who('/api/editor/state', { method: 'PUT', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
    const doc = (s, extra) => ({ rev: s.rev, sections: s.sections, pages: s.pages, history: s.history, log: s.log, trash: s.trash, editors: s.editors, ...extra });
    assert.equal((await put(owner, doc(st), { 'x-ml-editor': '' })).status, 403, '沒有後台標頭的寫入要被拒絕');
    assert.equal((await put(owner, doc(st, { rev: st.rev - 1 }))).status, 409, '版本不對要回 409');
    const broken = JSON.parse(JSON.stringify(st.sections));
    broken[0].rows.push({ id: 'no-such-page' });
    assert.equal((await put(owner, doc(st, { sections: broken }))).status, 400, '目錄指到不存在的頁面要被拒絕');
    st.pages['quick-start'].t = '測試標題 ABC';
    st.editors.push({ no: 'T0002', name: '測試編輯', role: 'editor', at: new Date().toISOString() });
    const saved = await put(owner, doc(st));
    assert.equal(saved.status, 200);
    st.rev = (await saved.json()).rev;
    assert.match(await (await fetch(base + '/content.js')).text(), /測試標題 ABC/, '存檔後 content.js 要馬上更新');

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
  } finally {
    child.kill('SIGTERM');
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }
  await oidcTest();
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
  const srv = spawn(process.execPath, [path.join(__dirname, 'server.js')], { env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', DATA_DIR: dir, OIDC_ISSUER: issuer, OIDC_CLIENT_ID: 'cid', OIDC_CLIENT_SECRET: 'csecret', EDITOR_OWNERS: 'T0001', DEV_LOGIN: '1' }, stdio: 'inherit' });
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
