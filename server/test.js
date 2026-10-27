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
for (const f of fs.readdirSync(path.join(ROOT, 'data'))) {
  const src = fs.readFileSync(path.join(ROOT, 'data', f), 'utf8');
  for (const m of src.matchAll(/\[(?:i|v|a)\s+(\d+)/g)) refs.add(m[1]);
}
const missing = [...refs].filter((n) => !MEDIA[n] || !fs.existsSync(path.join(ROOT, 'assets/media', MEDIA[n][0])));
assert.deepEqual(missing, [], `找不到媒體：${missing.join(', ')}`);
console.log(`✓ 文章引用 ${refs.size} 個媒體，檔案都在`);

// --- 2. 伺服器 ---
const PORT = 18080 + Math.floor(Math.random() * 1000);
const child = spawn(process.execPath, [path.join(__dirname, 'server.js')], { env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1' }, stdio: 'inherit' });
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
    assert.equal((await fetch(base + '/server/server.js')).status, 404);
    assert.equal((await fetch(base + '/assets/../server/server.js')).status, 404);
    console.log('✓ 伺服器：健康檢查、首頁雜湊、快取標頭、影片 Range、404 都正常');
  } finally {
    child.kill('SIGTERM');
  }
})().catch((e) => { console.error(e); child.kill('SIGTERM'); process.exit(1); });
