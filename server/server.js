// 公司內部部署用的靜態檔伺服器（GitHub Pages 不會用到這個檔案）。
// 只用 Node 內建模組，不需要安裝套件。
// - /healthz：健康檢查
// - 所有檔案都帶 cache-control: no-cache（每次先問伺服器有沒有更新）
// - index.html 裡的 css / js 網址改成內容雜湊，部署新版時瀏覽器與 Cloudflare 一定抓新檔
// - /api/feedback：POST 收回饋（任何人）；GET 讀全部回饋（後台用，見 canReadFeedback）
//   收到後存一份在伺服器；config.js 有填 Google 試算表網址時再轉存過去；文字回饋另用 Zulip 通知負責人（server/notify.js）
// - /api/survey：POST 收訪客問卷（任何人，匿名）；存在 DATA_DIR/survey.jsonl，編輯後台「訪客問卷」用 /api/editor/survey 讀（server/editor.js）
// - 編輯後台（公司帳號登入、內容存放、上傳）在 server/editor.js；說明中心的內容從 /content.js 讀
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { notifyFeedback } = require('./notify.js');
const Survey = require('../survey.js');

const ROOT = path.resolve(process.env.SITE_ROOT || path.join(__dirname, '..'));
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
// 回饋存成一行一筆的 JSON。部署時要指到會保留的磁碟（vibe.yaml 的 persistence），否則重新部署就不見
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, '.data'));
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.jsonl');
const SURVEY_FILE = path.join(DATA_DIR, 'survey.jsonl');
const Views = require('./views.js')(DATA_DIR);
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
  '.glb': 'model/gltf-binary',
  '.txt': 'text/plain; charset=utf-8',
};

// 只開放網站本身會用到的檔案，其餘（server/、README、Dockerfile 等）一律 404
const PUBLIC = [/^\/style\.css$/, /^\/(?:script|config|markup|model|survey)\.js$/, /^\/(?:admin|edit)\.(?:css|js)$/, /^\/data\/(?!drafts\.js$)[\w.-]+\.js$/, /^\/data\/en\/ui\.js$/, /^\/assets\/[\w./-]+$/];

const hashOf = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, file))).digest('hex').slice(0, 10);

// 啟動時算一次雜湊；每次部署都是新容器，不需要手動改版本號
// <!-- content --> 到 <!-- /content --> 之間的 data/*.js 換成伺服器產生的 content.js（編輯後台存的內容）
function loadPage(file) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8').replace(
    /(src|href)="([\w./-]+\.(?:css|js))(?:\?v=[^"]*)?"/g,
    (m, attr, f) => `${attr}="${f}?v=${hashOf(f)}"`,
  ).replace(/<!-- content -->[\s\S]*?<!-- \/content -->/, '<script src="content.js"></script>');
  return { html, etag: `"${crypto.createHash('sha256').update(html).digest('hex').slice(0, 16)}"` };
}
const PAGES = { '/': loadPage('index.html'), '/index.html': loadPage('index.html'), '/admin.html': loadPage('admin.html'), '/edit.html': loadPage('edit.html') };

function send(res, status, body, type) {
  res.writeHead(status, { 'content-type': type || 'text/plain; charset=utf-8', 'cache-control': 'no-cache', 'x-content-type-options': 'nosniff' });
  res.end(body);
}
const sendJson = (res, status, obj) => send(res, status, JSON.stringify(obj), TYPES['.json']);

// ---------- 回饋 ----------
// config.js 的 googleScriptUrl（公開的 Apps Script 網址）。有填時，伺服器收到的回饋也轉存到 Google 試算表
// 環境變數 GOOGLE_SCRIPT_URL 有設定時以它為準（測試設成空字串，免得假資料跑進真的試算表）
const GOOGLE_URL = (() => {
  if (process.env.GOOGLE_SCRIPT_URL !== undefined) return process.env.GOOGLE_SCRIPT_URL;
  try {
    const m = /googleScriptUrl:\s*'([^']*)'/.exec(fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8'));
    return m && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(m[1]) ? m[1] : '';
  } catch { return ''; }
})();

// 轉存失敗只記 log：伺服器上已經有一份，不影響訪客
async function forwardToGoogle(entry) {
  if (!GOOGLE_URL) return;
  try {
    // 不指定 content-type（text/plain），和瀏覽器直接送的格式一樣
    const r = await fetch(GOOGLE_URL, { method: 'POST', body: JSON.stringify(entry), signal: AbortSignal.timeout(15000) });
    const body = await r.json().catch(() => ({}));
    if (!body.ok) console.error('回饋轉存 Google 試算表失敗', r.status, body.error || '');
  } catch (e) {
    console.error('回饋轉存 Google 試算表失敗', e.message);
  }
}

const NOTE_TYPES = ['stuck', 'unclear', 'suggest', 'other'];
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// 檢查並整理送進來的資料，只留下認得的欄位；不合格回傳 null
function cleanFeedback(b) {
  if (!b || typeof b !== 'object') return null;
  const page = str(b.page, 80);
  if (page && !/^[\w-]+$/.test(page)) return null;
  const base = { id: crypto.randomUUID(), at: new Date().toISOString(), page, pageTitle: str(b.pageTitle, 120), vid: str(b.vid, 40), lang: b.lang === 'en' ? 'en' : 'zh' };
  // value 'none'：訪客再點一次取消投票
  if (b.kind === 'vote' && page && ['up', 'down', 'none'].includes(b.value)) return { ...base, kind: 'vote', value: b.value };
  if (b.kind === 'note' && NOTE_TYPES.includes(b.type) && str(b.message, 2000)) {
    return { ...base, kind: 'note', type: b.type, message: str(b.message, 2000), contact: str(b.contact, 120) };
  }
  return null;
}

// 簡單的防洗版：同一個訪客 10 分鐘內最多 30 筆
// 公司平台上請求都經過 Cloudflare 與反向代理，連進來的位址全是代理，所以先看代理轉來的訪客位址；
// 只用連線位址的話，全站訪客會共用同一份 30 筆的額度（2026-11-18 正式站的意見回饋因此送不出去）
function visitorOf(req) {
  const h = req.headers;
  const ip = h['cf-connecting-ip'] || h['x-real-ip'] || String(h['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
  return String(ip).slice(0, 64);
}
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
  if (tooMany(visitorOf(req))) return sendJson(res, 429, { error: '送出太頻繁，請稍後再試' });
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
    forwardToGoogle(entry);
    if (entry.kind === 'note') notifyFeedback(entry);
  });
}

// 訪客問卷：只存認得的答案、時間與訪客隨機代號（vid），不存 IP
function postSurvey(req, res) {
  if (tooMany(visitorOf(req))) return sendJson(res, 429, { error: '送出太頻繁，請稍後再試' });
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (c) => { body += c; if (body.length > 4096) { sendJson(res, 413, { error: '內容太長' }); req.destroy(); } });
  req.on('end', () => {
    if (res.headersSent) return;
    let b = null, answers = null;
    try { b = JSON.parse(body); answers = Survey.clean(b && b.answers); } catch {}
    if (!answers) return sendJson(res, 400, { error: '資料格式不正確' });
    const entry = { id: crypto.randomUUID(), at: new Date().toISOString(), vid: str(b.vid, 40), ...answers };
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.appendFileSync(SURVEY_FILE, JSON.stringify(entry) + '\n');
    } catch (e) {
      console.error('寫入問卷失敗', e.message);
      return sendJson(res, 503, { error: '暫時無法儲存' });
    }
    sendJson(res, 201, { ok: true });
  });
}

// 閱讀流量（server/views.js）：說明中心用 sendBeacon 送（text/plain JSON），量比回饋大，額度另外算
const viewHits = new Map();
function tooManyViews(ip) {
  const now = Date.now();
  const h = viewHits.get(ip);
  if (!h || h.reset < now) { viewHits.set(ip, { n: 1, reset: now + 600000 }); return false; }
  return ++h.n > 600;
}
setInterval(() => { const now = Date.now(); for (const [k, h] of viewHits) if (h.reset < now) viewHits.delete(k); }, 600000).unref();
function postView(req, res) {
  if (tooManyViews(visitorOf(req))) return sendJson(res, 429, { error: '送出太頻繁' });
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (c) => { body += c; if (body.length > 2048) { sendJson(res, 413, { error: '內容太長' }); req.destroy(); } });
  req.on('end', () => {
    if (res.headersSent) return;
    let ok = false;
    try { ok = Views.add(JSON.parse(body), req.headers['user-agent']); } catch { ok = false; }
    if (ok === 'bot') { res.writeHead(204); return res.end(); }
    if (!ok) return sendJson(res, 400, { error: '資料格式不正確' });
    res.writeHead(204);
    res.end();
  });
}
// 編輯後台登入的人（公司帳號）或有回饋後台密碼的都能看
function getViews(req, res, url) {
  if (!editor.isEditor(req) && !canReadFeedback(req)) return sendJson(res, 401, { error: '請先登入編輯後台' });
  const days = [0, 7, 30, 90].includes(Number(url.searchParams.get('days'))) ? Number(url.searchParams.get('days')) : 30;
  const lang = ['zh', 'en'].includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : '';
  sendJson(res, 200, Views.stats({ days, staff: url.searchParams.get('staff') === '1', pages: editor.publicPages(), lang }));
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
  // 後台上傳的檔案網址和程式附的一樣是 assets/media/...：存在 S3 的轉址到簽好的讀取網址，存在 DATA_DIR/media 的直接送
  const up = rel.startsWith('assets/media/') && editor.uploadedMedia(rel.slice(13));
  if (up && up.url) {
    res.writeHead(302, { location: up.url, 'cache-control': 'private, max-age=600' });
    return res.end();
  }
  const file = (up && up.file) || path.join(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep) && !file.startsWith(DATA_DIR + path.sep)) return send(res, 404, 'Not found');
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

const editor = require('./editor.js')({ ROOT, DATA_DIR, send, sendJson });

// ---------- 跨網域（2026-11-23）----------
// 放在 moonland.ai 網域的靜態版說明中心（tools/build-static.js 產生）沒有伺服器，回饋、問卷、閱讀流量送回這裡存。
// 只開放這三個「任何人都能送」的網址，而且只讀得到「有沒有收到」；編輯後台、讀回饋的網址都不開放。
// 允許的網站：moonland.ai 與它的子網域、本機測試（localhost）；要加別的網址，設環境變數 CORS_ORIGINS（用逗號分開，例如 https://xxx.pages.dev）
const CORS_PATHS = new Set(['/api/feedback', '/api/survey', '/api/view']);
const CORS_EXTRA = String(process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim().replace(/\/+$/, '')).filter(Boolean);
function corsOrigin(origin) {
  if (!origin) return '';
  if (CORS_EXTRA.includes(origin)) return origin;
  return /^https:\/\/([\w-]+\.)*moonland\.ai$/.test(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ? origin : '';
}

const server = http.createServer(async (req, res) => {
  let pathname, url;
  try { url = new URL(req.url, 'http://x'); pathname = decodeURIComponent(url.pathname); } catch { return send(res, 400, 'Bad request'); }
  if (CORS_PATHS.has(pathname)) {
    const ok = corsOrigin(req.headers.origin);
    if (ok) { res.setHeader('access-control-allow-origin', ok); res.setHeader('vary', 'Origin'); }
    if (req.method === 'OPTIONS') {
      if (!ok) return send(res, 403, 'Forbidden');
      res.writeHead(204, { 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'content-type', 'access-control-max-age': '86400' });
      return res.end();
    }
  }
  if (await editor.handle(req, res, pathname, url)) return;

  if (pathname === '/api/view') {
    if (req.method === 'POST') return postView(req, res);
    return send(res, 405, 'Method not allowed');
  }
  if (pathname === '/api/views') {
    if (req.method === 'GET') return getViews(req, res, url);
    return send(res, 405, 'Method not allowed');
  }
  if (pathname === '/api/survey') {
    if (req.method === 'POST') return postSurvey(req, res);
    return send(res, 405, 'Method not allowed');
  }
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
