// 公司內部部署用的靜態檔伺服器（GitHub Pages 不會用到這個檔案）。
// 只用 Node 內建模組，不需要安裝套件。
// - /healthz：健康檢查
// - 所有檔案都帶 cache-control: no-cache（每次先問伺服器有沒有更新）
// - index.html 裡的 css / js 網址改成內容雜湊，部署新版時瀏覽器與 Cloudflare 一定抓新檔
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(process.env.SITE_ROOT || path.join(__dirname, '..'));
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';

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
const PUBLIC = [/^\/index\.html$/, /^\/style\.css$/, /^\/script\.js$/, /^\/data\/[\w.-]+\.js$/, /^\/assets\/[\w./-]+$/];

const hashOf = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, file))).digest('hex').slice(0, 10);

// 啟動時算一次雜湊；每次部署都是新容器，不需要手動改版本號
const INDEX_HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(
  /(src|href)="([\w./-]+\.(?:css|js))(?:\?v=[^"]*)?"/g,
  (m, attr, file) => `${attr}="${file}?v=${hashOf(file)}"`,
);
const INDEX_ETAG = `"${crypto.createHash('sha256').update(INDEX_HTML).digest('hex').slice(0, 16)}"`;

function send(res, status, body, type) {
  res.writeHead(status, { 'content-type': type || 'text/plain; charset=utf-8', 'cache-control': 'no-cache', 'x-content-type-options': 'nosniff' });
  res.end(body);
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
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { return send(res, 400, 'Bad request'); }

  if (pathname === '/healthz') return send(res, 200, 'ok');
  if (pathname === '/' || pathname === '/index.html') {
    if (req.headers['if-none-match'] === INDEX_ETAG) { res.writeHead(304, { etag: INDEX_ETAG, 'cache-control': 'no-cache' }); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES['.html'], 'cache-control': 'no-cache', 'x-content-type-options': 'nosniff', etag: INDEX_ETAG });
    return res.end(req.method === 'HEAD' ? undefined : INDEX_HTML);
  }
  if (pathname.includes('..') || !PUBLIC.some((re) => re.test(pathname))) return send(res, 404, 'Not found');
  serveFile(req, res, pathname.slice(1));
});

server.listen(PORT, HOST, () => console.log(`moonland-docs listening on http://${HOST}:${PORT}`));
const stop = () => server.close(() => process.exit(0));
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
