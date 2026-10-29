// 公司內部部署用的靜態檔伺服器（GitHub Pages 不會用到這個檔案）。
// 只用 Node 內建模組，不需要安裝套件。
// - /healthz：健康檢查
// - 所有檔案都帶 cache-control: no-cache（每次先問伺服器有沒有更新）
// - index.html 裡的 css / js 網址改成內容雜湊，部署新版時瀏覽器與 Cloudflare 一定抓新檔
// - /api/feedback：POST 收回饋（任何人）；GET 讀全部回饋（後台用，見 canReadFeedback）
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(process.env.SITE_ROOT || path.join(__dirname, '..'));
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
// 回饋存成一行一筆的 JSON。部署時要指到會保留的磁碟（vibe.yaml 的 persistence），否則重新部署就不見
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, '.data'));
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.jsonl');
// 讀取回饋的密碼。沒設定時只有本機（127.0.0.1）能讀，方便在自己電腦預覽
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.txt': 'text/plain; charset=utf-8',
};

// 只開放網站本身會用到的檔案，其餘（server/、README、Dockerfile 等）一律 404
const PUBLIC = [/^\/style\.css$/, /^\/(?:script|config|markup)\.js$/, /^\/(?:admin|edit)\.(?:css|js)$/, /^\/data\/(?:en\/)?[\w.-]+\.js$/, /^\/assets\/[\w./-]+$/];

const hashOf = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, file))).digest('hex').slice(0, 10);

// 啟動時算一次雜湊；每次部署都是新容器，不需要手動改版本號
function loadPage(file) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8').replace(
    /(src|href)="([\w./-]+\.(?:css|js))(?:\?v=[^"]*)?"/g,
    (m, attr, f) => `${attr}="${f}?v=${hashOf(f)}"`,
  );
  return { html, etag: `"${crypto.createHash('sha256').update(html).digest('hex').slice(0, 16)}"` };
}
const PAGES = { '/': loadPage('index.html'), '/index.html': loadPage('index.html'), '/admin.html': loadPage('admin.html'), '/edit.html': loadPage('edit.html') };

function send(res, status, body, type) {
  res.writeHead(status, { 'content-type': type || 'text/plain; charset=utf-8', 'cache-control': 'no-cache', 'x-content-type-options': 'nosniff' });
  res.end(body);
}
const sendJson = (res, status, obj) => send(res, status, JSON.stringify(obj), TYPES['.json']);

// ---------- 回饋 ----------
const NOTE_TYPES = ['stuck', 'unclear', 'suggest', 'other'];
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// 檢查並整理送進來的資料，只留下認得的欄位；不合格回傳 null
function cleanFeedback(b) {
  if (!b || typeof b !== 'object') return null;
  const page = str(b.page, 80);
  if (page && !/^[\w-]+$/.test(page)) return null;
  const base = { id: crypto.randomUUID(), at: new Date().toISOString(), page, pageTitle: str(b.pageTitle, 120), vid: str(b.vid, 40), lang: b.lang === 'en' ? 'en' : 'zh' };
  if (b.kind === 'vote' && page && (b.value === 'up' || b.value === 'down')) return { ...base, kind: 'vote', value: b.value };
  if (b.kind === 'note' && NOTE_TYPES.includes(b.type) && str(b.message, 2000)) {
    return { ...base, kind: 'note', type: b.type, message: str(b.message, 2000), contact: str(b.contact, 120) };
  }
  return null;
}

// 簡單的防洗版：同一個來源 10 分鐘內最多 30 筆
const hits = new Map();
function tooMany(ip) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) { hits.set(ip, { n: 1, reset: now + 600000 }); return false; }
  return ++h.n > 30;
}
setInterval(() => { const now = Date.now(); for (const [k, h] of hits) if (h.reset < now) hits.delete(k); }, 600000).unref();

function canReadFeedback(req) {
  if (ADMIN_TOKEN) {
    const got = Buffer.from(req.headers.authorization || '');
    const want = Buffer.from(`Bearer ${ADMIN_TOKEN}`);
    return got.length === want.length && crypto.timingSafeEqual(got, want);
  }
  return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
}

function postFeedback(req, res) {
  if (tooMany(req.socket.remoteAddress)) return sendJson(res, 429, { error: '送出太頻繁，請稍後再試' });
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (c) => { body += c; if (body.length > 8192) { sendJson(res, 413, { error: '內容太長' }); req.destroy(); } });
  req.on('end', () => {
    if (res.headersSent) return;
    let entry;
    try { entry = cleanFeedback(JSON.parse(body)); } catch { entry = null; }
    if (!entry) return sendJson(res, 400, { error: '資料格式不正確' });
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.appendFileSync(FEEDBACK_FILE, JSON.stringify(entry) + '\n');
    } catch (e) {
      console.error('寫入回饋失敗', e.message);
      return sendJson(res, 503, { error: '暫時無法儲存' });
    }
    sendJson(res, 201, { ok: true });
  });
}

function getFeedback(req, res) {
  if (!canReadFeedback(req)) return sendJson(res, 401, { error: '需要後台密碼' });
  let lines = [];
  try { lines = fs.readFileSync(FEEDBACK_FILE, 'utf8').split('\n'); } catch {}
  const entries = [];
  for (const l of lines) { if (l) try { entries.push(JSON.parse(l)); } catch {} }
  sendJson(res, 200, { entries });
}

function serveFile(req, res, rel) {
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep)) return send(res, 404, 'Not found');
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'Not found');
    const etag = `"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
    const headers = {
      'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-cache',
      'x-content-type-options': 'nosniff',
      etag,
      'accept-ranges': 'bytes',
    };
    if (req.headers['if-none-match'] === etag) { res.writeHead(304, headers); return res.end(); }

    // 影片、音訊需要 Range 才能拖曳進度條（Safari 沒有 Range 會無法播放）
    const range = req.headers.range && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (range) {
      let start = range[1] === '' ? st.size - Number(range[2]) : Number(range[1]);
      let end = range[1] === '' || range[2] === '' ? st.size - 1 : Number(range[2]);
      if (start < 0) start = 0;
      if (end >= st.size) end = st.size - 1;
      if (start > end || start >= st.size) {
        res.writeHead(416, { ...headers, 'content-range': `bytes */${st.size}` });
        return res.end();
      }
      res.writeHead(206, { ...headers, 'content-range': `bytes ${start}-${end}/${st.size}`, 'content-length': end - start + 1 });
      if (req.method === 'HEAD') return res.end();
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { ...headers, 'content-length': st.size });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { return send(res, 400, 'Bad request'); }

  if (pathname === '/api/feedback') {
    if (req.method === 'POST') return postFeedback(req, res);
    if (req.method === 'GET') return getFeedback(req, res);
    return send(res, 405, 'Method not allowed');
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  if (pathname === '/healthz') return send(res, 200, 'ok');
  const page = PAGES[pathname];
  if (page) {
    if (req.headers['if-none-match'] === page.etag) { res.writeHead(304, { etag: page.etag, 'cache-control': 'no-cache' }); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES['.html'], 'cache-control': 'no-cache', 'x-content-type-options': 'nosniff', etag: page.etag });
    return res.end(req.method === 'HEAD' ? undefined : page.html);
  }
  if (pathname.includes('..') || !PUBLIC.some((re) => re.test(pathname))) return send(res, 404, 'Not found');
  serveFile(req, res, pathname.slice(1));
});

server.listen(PORT, HOST, () => console.log(`moonland-docs listening on http://${HOST}:${PORT}`));
const stop = () => server.close(() => process.exit(0));
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
