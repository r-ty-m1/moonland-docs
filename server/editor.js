// 編輯後台的伺服器端（server.js 載入）。只用 Node 內建模組。
// - 公司帳號登入：網站自己當 OIDC client（vibe.yaml 的 auth.mode: oidc；平台部署時注入 OIDC_ISSUER、OIDC_CLIENT_ID、OIDC_CLIENT_SECRET）
//   本機開發沒有公司登入時，設 DEV_LOGIN=1 可以用「輸入員工編號」的假登入（有 OIDC 設定時一律關閉）
// - 誰能編輯：server/owners.json 的員工編號永遠是主管理員；其他人看後台「編輯者名單」
// - 內容存在 DATA_DIR（部署時是 persistence 磁碟）：
//     content.json   目錄、頁面、版本紀錄、修改紀錄、最近刪除、封存、編輯者名單（第一次啟動時從 data/*.js 複製）
// - 網站程式的修改紀錄在 server/changelog.json（跟著程式更新，後台「修改紀錄 › 網站程式修改」顯示）
//     media.json     後台上傳的圖片、影片對照表
// - 上傳的檔案：平台有提供物件儲存（vibe.yaml 的 storage: s3，見 server/s3.js）時存在 S3 的 media/<區域>/<文章代號>-<序號>.<副檔名>；
//   沒有時（本機直接跑）存在 DATA_DIR/media/。圖片經伺服器上傳；影片由瀏覽器直接傳到 S3（不經過網站，最大 90 MB）
//     session-secret 登入 cookie 的簽章金鑰（自動產生）
//     survey.jsonl   訪客問卷（server.js 寫入，後台「訪客問卷」讀取）
//     board.json     布告欄：公告與討論（server/board.js）
//     views/         閱讀流量（server/views.js，回饋後台「閱讀流量」讀取）
// - 說明中心從 /content.js 讀內容，存檔後立刻生效
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const Model = require('../model.js');
const S3 = require('./s3.js');
const Board = require('./board.js');

const CALLBACK_PATH = '/api/auth/callback/authentik';
const SESSION_HOURS = 12;
const LIMITS = { log: 500, history: 30, trash: 500, archive: 500, todos: 500, wishes: 500 };
// 最近刪除保留 30 天，之後永久清掉
const TRASH_DAYS = 30;
const freshTrash = (arr) => (Array.isArray(arr) ? arr : []).filter((x) => x && Date.parse(x.at) > Date.now() - TRASH_DAYS * 864e5).slice(0, LIMITS.trash);
const AREAS = ['start', 'chat', 'image', 'video', 'lab', 'recipes', 'models', 'team', 'support'];
// 影片直接從瀏覽器傳到 S3：單次上傳，留在 Cloudflare 單一請求 100 MB 的限制以內
const VIDEO_MAX = 90 * 1024 * 1024;
const UPLOAD_RE = /^[a-z]+\/[a-z0-9-]+-\d{2,3}\.(?:webp|jpg|mp4)$/;

module.exports = function createEditor({ ROOT, DATA_DIR, send, sendJson }) {
  const OIDC = { issuer: process.env.OIDC_ISSUER || '', id: process.env.OIDC_CLIENT_ID || '', secret: process.env.OIDC_CLIENT_SECRET || '' };
  const LOGIN = OIDC.issuer && OIDC.id && OIDC.secret ? 'oidc' : process.env.DEV_LOGIN === '1' ? 'dev' : 'none';
  const file = (f) => path.join(DATA_DIR, f);
  const MEDIA_DIR = file('media');
  const store = S3.create();
  const board = Board(DATA_DIR);
  console.log(store ? '上傳的圖片與影片存在物件儲存（S3）' : '沒有 S3 設定：上傳的圖片存在 DATA_DIR/media，不能上傳影片');
  fs.mkdirSync(MEDIA_DIR, { recursive: true });

  // 寫檔先寫到暫存檔再改名，寫到一半當機也不會留下壞掉的檔案
  function writeJson(f, obj) {
    const tmp = `${file(f)}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(obj));
    fs.renameSync(tmp, file(f));
  }
  const readJson = (f) => { try { return JSON.parse(fs.readFileSync(file(f), 'utf8')); } catch { return null; } };

  // ---------- 訪客問卷（server.js 寫入 survey.jsonl）----------
  // 同一個訪客（vid）重填只留最後一次
  function surveyEntries() {
    let lines = [];
    try { lines = fs.readFileSync(file('survey.jsonl'), 'utf8').split('\n'); } catch {}
    const byVid = new Map();
    const out = [];
    for (const l of lines) {
      if (!l) continue;
      let x;
      try { x = JSON.parse(l); } catch { continue; }
      if (x.vid) byVid.set(x.vid, x); else out.push(x);
    }
    return [...out, ...byVid.values()].sort((a, b) => String(b.at).localeCompare(String(a.at)));
  }

  // ---------- 內容 ----------
  // 程式裡附的內容（data/*.js）。第一次啟動時複製成 content.json，之後以 content.json 為準
  function loadSiteData() {
    const ctx = vm.createContext({});
    ctx.window = ctx;
    const dir = path.join(ROOT, 'data');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
    const order = ['media.js', 'snippets.js', ...files.filter((f) => !['media.js', 'snippets.js', 'sections.js'].includes(f)).sort(), 'sections.js'];
    for (const f of order) if (files.includes(f)) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
    // 英文翻譯（data/en/*.js 的 EN_SEED）：啟動時匯入成英文草稿，見 importEnSeed
    const enDir = path.join(dir, 'en');
    let enFiles = [];
    try { enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith('.js') && f !== 'ui.js'); } catch {}
    for (const f of enFiles.sort()) vm.runInContext(fs.readFileSync(path.join(enDir, f), 'utf8'), ctx, { filename: `en/${f}` });
    return { MEDIA: ctx.MEDIA || {}, ARTICLES: ctx.ARTICLES || {}, SECTIONS: ctx.SECTIONS || [], DRAFTS: ctx.DRAFTS || {}, EN_SEED: ctx.EN_SEED || {} };
  }
  const site = loadSiteData();
  const BASE_MEDIA = site.MEDIA;

  let C = readJson('content.json');
  if (!C || !Array.isArray(C.sections)) {
    C = { rev: 1, savedAt: new Date().toISOString(), ...Model.fromSite(site.ARTICLES, site.SECTIONS, site.DRAFTS), history: {}, log: [], trash: [], archive: [], editors: [] };
    writeJson('content.json', C);
  }
  if (!Array.isArray(C.archive)) C.archive = [];
  if (!Array.isArray(C.todos)) C.todos = [];
  if (!Array.isArray(C.wishes)) C.wishes = [];
  // 程式附的英文翻譯：還沒有英文版的頁面、大分類、小標，匯入成「英文草稿」（編輯者在後台看過、取消草稿才公開）
  // 已經有英文的不覆蓋，所以後台改過的英文不會被蓋掉；翻譯時的中文和現在不同時，後台會標「英文待更新」
  function importEnSeed() {
    const seed = site.EN_SEED || {};
    const at = new Date().toISOString();
    let pages = 0, names = 0;
    for (const [id, e] of Object.entries(seed.pages || {})) {
      const p = C.pages[id];
      if (!p || p.en || !e || !e.t) continue;
      p.en = { t: String(e.t), n: String(e.n || ''), d: String(e.d || ''), body: String(e.body || '').replace(/^\n+|\s+$/g, ''), draft: true, src: String(e.src || ''), at, by: 'AI 翻譯（待審）' };
      pages++;
    }
    for (const sec of C.sections) {
      if (!sec.en && seed.sections && seed.sections[sec.label]) { sec.en = seed.sections[sec.label]; names++; }
      for (const r of sec.rows) for (const g of r.groups || []) if (g.g && !g.en && seed.groups && seed.groups[g.g]) { g.en = seed.groups[g.g]; names++; }
    }
    if (!pages && !names) return;
    C.rev++;
    C.log.unshift({ at, by: '網站程式', action: `匯入英文翻譯草稿（${pages} 頁${names ? `、${names} 個分類名稱` : ''}）`, id: '', t: '英文版' });
    C.log.length = Math.min(C.log.length, LIMITS.log);
    writeJson('content.json', C);
    console.log(`匯入英文翻譯草稿：${pages} 頁、${names} 個名稱`);
  }
  importEnSeed();
  let uploads = readJson('media.json') || {};
  let CHANGES = [];
  try { CHANGES = JSON.parse(fs.readFileSync(path.join(__dirname, 'changelog.json'), 'utf8')).changes || []; } catch (e) { console.error('讀不到 server/changelog.json', e.message); }
  const allMedia = () => ({ ...BASE_MEDIA, ...uploads });

  // 說明中心讀的 /content.js，內容變了才重算
  let contentJs = null;
  function buildContentJs() {
    const { ARTICLES, SECTIONS, ARTICLES_EN } = Model.toSite(C.sections, C.pages);
    const body = `// 由伺服器產生（版本 ${C.rev}），內容來自編輯後台\nwindow.MEDIA=${JSON.stringify(allMedia())};\nwindow.ARTICLES=${JSON.stringify(ARTICLES)};\nwindow.SECTIONS=${JSON.stringify(SECTIONS)};\nwindow.ARTICLES_EN=${JSON.stringify(ARTICLES_EN)};\n`;
    contentJs = { body, etag: `"c${C.rev}-${crypto.createHash('sha256').update(body).digest('hex').slice(0, 12)}"` };
  }
  buildContentJs();

  // ---------- 誰能編輯 ----------
  // server/owners.json，加上環境變數 EDITOR_OWNERS（逗號分隔，測試用）
  function owners() {
    let o = [];
    try { o = JSON.parse(fs.readFileSync(path.join(__dirname, 'owners.json'), 'utf8')).owners; } catch {}
    return [...(Array.isArray(o) ? o : []), ...String(process.env.EDITOR_OWNERS || '').split(',')].map((x) => String(x).trim().toUpperCase()).filter(Boolean);
  }
  function roleOf(no) {
    if (!no) return null;
    if (owners().includes(no)) return 'owner';
    const e = C.editors.find((x) => x.no === no);
    return e && (e.role === 'owner' || e.role === 'editor') ? e.role : null;
  }
  // owners.json 上的人登入時自動放進名單（顯示用），而且不能被移除或降級
  function keepOwners(list, user) {
    const out = list.filter((e) => e && typeof e.no === 'string');
    for (const no of owners()) {
      const e = out.find((x) => x.no === no);
      if (e) { e.role = 'owner'; e.fixed = true; }
      else if (user && user.no === no) out.push({ no, name: user.name, role: 'owner', at: new Date().toISOString(), fixed: true });
      else {
        const old = C.editors.find((x) => x.no === no);
        if (old) out.push({ ...old, role: 'owner', fixed: true });
      }
    }
    return out;
  }

  // ---------- 登入 cookie ----------
  let SECRET;
  try { SECRET = fs.readFileSync(file('session-secret'), 'utf8').trim(); } catch {}
  if (!SECRET || SECRET.length < 32) {
    SECRET = crypto.randomBytes(32).toString('hex');
    try { fs.writeFileSync(file('session-secret'), SECRET, { mode: 0o600 }); } catch {}
  }
  const b64 = (s) => Buffer.from(s).toString('base64url');
  const mac = (s) => crypto.createHmac('sha256', SECRET).update(s).digest('base64url');
  function seal(obj, minutes) {
    const v = b64(JSON.stringify({ ...obj, exp: Date.now() + minutes * 60000 }));
    return `${v}.${mac(v)}`;
  }
  function unseal(token) {
    const [v, m] = String(token || '').split('.');
    if (!v || !m) return null;
    const a = Buffer.from(m), b = Buffer.from(mac(v));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    try { const o = JSON.parse(Buffer.from(v, 'base64url').toString()); return o.exp > Date.now() ? o : null; } catch { return null; }
  }
  function cookies(req) {
    const out = {};
    for (const part of String(req.headers.cookie || '').split(';')) {
      const i = part.indexOf('=');
      if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
    }
    return out;
  }
  const isHttps = (req) => LOGIN === 'oidc' || req.headers['x-forwarded-proto'] === 'https';
  const cookie = (req, name, value, maxAge) => `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${isHttps(req) ? '; Secure' : ''}`;
  function userOf(req) {
    const s = unseal(cookies(req).ml_sess);
    return s && s.no ? { no: s.no, name: s.name } : null;
  }
  function origin(req) {
    if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/+$/, '');
    const proto = String(req.headers['x-forwarded-proto'] || (LOGIN === 'oidc' ? 'https' : 'http')).split(',')[0].trim();
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
    return `${proto}://${host}`;
  }
  // 登入後回到哪裡：只接受本站的路徑
  const safeNext = (n) => (typeof n === 'string' && /^\/(?!\/)[\w./#?=&-]*$/.test(n) ? n : '/edit.html');
  function redirect(res, to, setCookies) {
    res.writeHead(302, { location: to, 'cache-control': 'no-store', ...(setCookies ? { 'set-cookie': setCookies } : {}) });
    res.end();
  }
  function page(res, status, title, html) {
    send(res, status, `<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{font:1rem/1.7 system-ui,sans-serif;max-width:32rem;margin:10vh auto;padding:0 16px;color:#222}input,button{font:inherit;padding:.4em .6em;margin:.2em 0}label{display:block;margin:.6em 0}</style>
<h1>${title}</h1>${html}<p><a href="/edit.html">回到編輯後台</a>　<a href="/">回到說明中心</a></p></html>`, 'text/html; charset=utf-8');
  }
  function signIn(req, res, user, next, extraCookies = []) {
    const no = String(user.no).trim().toUpperCase();
    const name = String(user.name || no).trim().slice(0, 40);
    // 主管理員第一次登入時把名字補進名單
    if (owners().includes(no) && !C.editors.some((e) => e.no === no)) {
      C.editors = keepOwners(C.editors, { no, name });
      save();
    }
    redirect(res, next, [...extraCookies, cookie(req, 'ml_sess', seal({ no, name }, SESSION_HOURS * 60), SESSION_HOURS * 3600)]);
  }

  // ---------- 公司帳號登入（OIDC 授權碼流程＋PKCE） ----------
  let discovery = null;
  async function discover() {
    if (discovery && discovery.at > Date.now() - 3600000) return discovery.doc;
    const url = `${OIDC.issuer.replace(/\/?$/, '/')}.well-known/openid-configuration`;
    const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) throw new Error(`discovery ${r.status}`);
    discovery = { at: Date.now(), doc: await r.json() };
    return discovery.doc;
  }
  async function oidcLogin(req, res, url) {
    const d = await discover();
    const state = crypto.randomBytes(16).toString('base64url');
    const nonce = crypto.randomBytes(16).toString('base64url');
    const verifier = crypto.randomBytes(32).toString('base64url');
    const q = new URLSearchParams({
      response_type: 'code', client_id: OIDC.id, redirect_uri: origin(req) + CALLBACK_PATH,
      scope: 'openid profile email employee_number', state, nonce,
      code_challenge: crypto.createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256',
    });
    redirect(res, `${d.authorization_endpoint}?${q}`, [cookie(req, 'ml_oidc', seal({ state, nonce, verifier, next: safeNext(url.searchParams.get('next')) }, 10), 600)]);
  }
  async function oidcCallback(req, res, url) {
    const clear = cookie(req, 'ml_oidc', '', 0);
    const t = unseal(cookies(req).ml_oidc);
    if (!t || !url.searchParams.get('code') || url.searchParams.get('state') !== t.state) {
      return page(res, 400, '登入沒有完成', '<p>登入逾時或已經用過了，請回到編輯後台重新登入一次。</p>');
    }
    const d = await discover();
    const r = await fetch(d.token_endpoint, {
      method: 'POST', signal: AbortSignal.timeout(10000),
      headers: { 'content-type': 'application/x-www-form-urlencoded', authorization: `Basic ${Buffer.from(`${encodeURIComponent(OIDC.id)}:${encodeURIComponent(OIDC.secret)}`).toString('base64')}` },
      body: new URLSearchParams({ grant_type: 'authorization_code', code: url.searchParams.get('code'), redirect_uri: origin(req) + CALLBACK_PATH, code_verifier: t.verifier }),
    });
    const tok = await r.json().catch(() => ({}));
    if (!r.ok || !tok.id_token) throw new Error(`token ${r.status} ${tok.error || ''}`);
    // ID token 直接從 token endpoint（TLS）拿到，依 OIDC 規格可用 TLS 代替簽章驗證；其餘欄位照樣檢查
    const claims = JSON.parse(Buffer.from(String(tok.id_token).split('.')[1] || '', 'base64url').toString() || '{}');
    const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (claims.iss !== d.issuer || !aud.includes(OIDC.id) || !(claims.exp * 1000 > Date.now()) || claims.nonce !== t.nonce) throw new Error('id_token claims');
    let info = claims;
    if (!info.employee_number && tok.access_token && d.userinfo_endpoint) {
      const u = await fetch(d.userinfo_endpoint, { headers: { authorization: `Bearer ${tok.access_token}` }, signal: AbortSignal.timeout(10000) });
      if (u.ok) info = { ...claims, ...(await u.json()) };
    }
    if (!info.employee_number) return page(res, 403, '找不到員工編號', '<p>你的公司帳號沒有員工編號，所以無法判斷編輯權限。請聯絡平台組。</p>');
    signIn(req, res, { no: info.employee_number, name: info.name || info.preferred_username || info.email }, t.next, [clear]);
  }

  // ---------- 讀寫 ----------
  function save() {
    C.savedAt = new Date().toISOString();
    writeJson('content.json', C);
    buildContentJs();
  }
  function readBody(req, max) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let n = 0;
      req.on('data', (c) => { n += c.length; if (n > max) { reject(Object.assign(new Error('too big'), { status: 413 })); req.destroy(); } else chunks.push(c); });
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
  }
  const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);

  function stateFor(user) {
    return { rev: C.rev, savedAt: C.savedAt, sections: C.sections, pages: C.pages, history: C.history, log: C.log, trash: freshTrash(C.trash), archive: C.archive, todos: C.todos, wishes: C.wishes, editors: C.editors, uploads, changes: CHANGES };
  }
  function putState(user, role, b) {
    if (!isObj(b)) return [400, { error: '資料格式不正確' }];
    if (b.rev !== C.rev) return [409, { error: '其他人剛剛改過內容', rev: C.rev }];
    const shape = Model.checkShape(b.sections, b.pages);
    if (shape) return [400, { error: shape }];
    const next = {
      rev: C.rev + 1,
      sections: b.sections,
      pages: b.pages,
      history: isObj(b.history) ? b.history : {},
      log: Array.isArray(b.log) ? b.log.slice(0, LIMITS.log) : [],
      trash: freshTrash(b.trash),
      archive: Array.isArray(b.archive) ? b.archive.slice(0, LIMITS.archive) : C.archive,
      todos: Array.isArray(b.todos) ? b.todos.slice(0, LIMITS.todos) : C.todos,
      wishes: Array.isArray(b.wishes) ? b.wishes.slice(0, LIMITS.wishes) : C.wishes,
      editors: C.editors,
    };
    for (const k of Object.keys(next.history)) {
      if (!Array.isArray(next.history[k])) delete next.history[k];
      else next.history[k] = next.history[k].slice(0, LIMITS.history);
    }
    // 只有主管理員能改名單；名單上至少要留一位主管理員
    if (role === 'owner' && Array.isArray(b.editors)) {
      const list = keepOwners(b.editors.filter((e) => isObj(e) && /^[A-Z0-9-]{2,20}$/.test(e.no) && (e.role === 'owner' || e.role === 'editor'))
        .map((e) => ({ no: e.no, name: String(e.name || '').slice(0, 40), role: e.role, at: e.at || new Date().toISOString(), ...(e.fixed ? { fixed: true } : {}) })), user);
      if (!list.some((e) => e.role === 'owner')) return [400, { error: '名單上至少要有一位主管理員' }];
      next.editors = list;
    }
    C = { ...next, savedAt: C.savedAt };
    save();
    return [200, { rev: C.rev, savedAt: C.savedAt, editors: C.editors }];
  }

  // 命名：「區域／文章代號-序號.副檔名」，序號接著這篇在這個區域裡最大的；影片上傳中的先保留，不會撞名
  const reserved = new Map();   // 檔名 → 保留到期時間
  function nameFor(url, ext) {
    const pageId = url.searchParams.get('page') || '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pageId)) return [null, '頁面代號不合格'];
    const ratio = +(+url.searchParams.get('ratio')).toFixed(4);
    if (!(ratio > 0.05 && ratio < 20)) return [null, '寬高比不正確'];
    const MEDIA = allMedia();
    let area = url.searchParams.get('area');
    if (!AREAS.includes(area)) area = Model.areaFor(pageId, C.sections, MEDIA);
    const now = Date.now();
    for (const [k, t] of reserved) if (t < now) reserved.delete(k);
    let seq = 0;
    for (const p of [...Object.values(MEDIA).map((e) => String(e[0])), ...reserved.keys()]) {
      const m = p.match(/^([a-z]+)\/([a-z0-9-]+)-(\d{2,3})\.\w+$/);
      if (m && m[1] === area && m[2] === pageId) seq = Math.max(seq, +m[3]);
    }
    return [{ rel: `${area}/${pageId}-${String(seq + 1).padStart(2, '0')}.${ext}`, ratio }];
  }
  function addUpload(rel, ratio) {
    const MEDIA = allMedia();
    const n = String(Math.max(-1, ...Object.keys(MEDIA).map(Number).filter(Number.isFinite)) + 1);
    uploads = { ...uploads, [n]: [rel, ratio] };
    writeJson('media.json', uploads);
    buildContentJs();
    return n;
  }
  async function saveFile(rel, buf, type) {
    if (store) return store.put(`media/${rel}`, buf, type);
    fs.mkdirSync(path.join(MEDIA_DIR, rel.split('/')[0]), { recursive: true });
    fs.writeFileSync(path.join(MEDIA_DIR, rel), buf);
  }
  async function readFile(rel) {
    if (store) return store.get(`media/${rel}`);
    return fs.readFileSync(path.join(MEDIA_DIR, rel));
  }

  // 上傳圖片：瀏覽器已經縮好、轉好 WebP（或 JPEG），伺服器只檢查、命名、給編號
  async function upload(req, url, buf) {
    const isWebp = buf.length > 12 && buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP';
    const isJpeg = buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    if (!isWebp && !isJpeg) return [400, { error: '只接受 WebP 或 JPEG 圖片' }];
    const [name, bad] = nameFor(url, isWebp ? 'webp' : 'jpg');
    if (!name) return [400, { error: bad }];
    reserved.set(name.rel, Date.now() + 60e3);
    try {
      await saveFile(name.rel, buf, isWebp ? 'image/webp' : 'image/jpeg');
    } catch (e) {
      console.error('上傳圖片失敗', e.message);
      return [e.code === 'XMinioAdminBucketQuotaExceeded' ? 507 : 502, { error: e.message }];
    } finally { reserved.delete(name.rel); }
    const n = addUpload(name.rel, name.ratio);
    return [201, { n, path: name.rel, ratio: name.ratio }];
  }

  // 上傳影片第一步：伺服器決定檔名，回傳一個 10 分鐘內有效、只能放這個檔案的上傳網址
  function videoStart(url) {
    if (!store) return [503, { error: '儲存尚未設定，暫時不能上傳影片' }];
    const size = Number(url.searchParams.get('size'));
    if (!(size > 0)) return [400, { error: '檔案大小不正確' }];
    if (size > VIDEO_MAX) return [413, { error: '影片超過 90 MB，請先壓縮或剪短' }];
    const [name, bad] = nameFor(url, 'mp4');
    if (!name) return [400, { error: bad }];
    reserved.set(name.rel, Date.now() + 15 * 60e3);
    return [200, { path: name.rel, ratio: name.ratio, uploadUrl: store.presign('PUT', `media/${name.rel}`, { expires: 600 }) }];
  }
  // 第二步：瀏覽器傳完後，伺服器確認檔案真的在、大小與格式對，才給編號
  async function videoFinish(body) {
    if (!store) return [503, { error: '儲存尚未設定' }];
    const rel = isObj(body) && String(body.path || '');
    const ratio = +(+(isObj(body) && body.ratio)).toFixed(4);
    if (!UPLOAD_RE.test(rel) || !rel.endsWith('.mp4') || !reserved.has(rel)) return [400, { error: '找不到這次的上傳，請重新上傳' }];
    if (!(ratio > 0.05 && ratio < 20)) return [400, { error: '寬高比不正確' }];
    const info = await store.head(`media/${rel}`);
    if (!info) return [400, { error: '影片沒有傳上去，請再試一次' }];
    if (info.size > VIDEO_MAX || !/^video\/mp4\b/.test(info.type)) {
      await store.del(`media/${rel}`).catch(() => {});
      reserved.delete(rel);
      return [400, { error: '只接受 90 MB 以內的 MP4 影片' }];
    }
    reserved.delete(rel);
    const n = addUpload(rel, ratio);
    return [201, { n, path: rel, ratio }];
  }

  // 備份：內容＋上傳的圖片（base64）存成一個 JSON 檔；還原時整份覆蓋
  async function backup() {
    const files = {};
    for (const [rel] of Object.values(uploads)) {
      try { files[rel] = (await readFile(rel)).toString('base64'); } catch (e) { console.error('備份時讀不到', rel, e.message); }
    }
    return { kind: 'moonland-docs-backup', version: 1, at: new Date().toISOString(), content: C, uploads, files, board: board.dump() };
  }
  async function restoreBackup(user, b) {
    if (!isObj(b) || b.kind !== 'moonland-docs-backup' || !isObj(b.content)) return [400, { error: '這不是說明中心的備份檔' }];
    const shape = Model.checkShape(b.content.sections, b.content.pages);
    if (shape) return [400, { error: `備份檔內容有問題：${shape}` }];
    const files = isObj(b.files) ? b.files : {};
    const ups = isObj(b.uploads) ? b.uploads : {};
    for (const [rel] of Object.values(ups)) {
      if (!UPLOAD_RE.test(rel) || typeof files[rel] !== 'string') continue;
      const ext = rel.split('.').pop();
      await saveFile(rel, Buffer.from(files[rel], 'base64'), { webp: 'image/webp', jpg: 'image/jpeg', mp4: 'video/mp4' }[ext]);
    }
    uploads = ups;
    writeJson('media.json', uploads);
    if (isObj(b.board)) board.load(b.board);
    const c = b.content;
    C = { rev: C.rev + 1, savedAt: C.savedAt, sections: c.sections, pages: c.pages, history: isObj(c.history) ? c.history : {}, log: Array.isArray(c.log) ? c.log : [], trash: Array.isArray(c.trash) ? c.trash : [], archive: Array.isArray(c.archive) ? c.archive : [], todos: Array.isArray(c.todos) ? c.todos : [], wishes: Array.isArray(c.wishes) ? c.wishes : [], editors: Array.isArray(c.editors) ? c.editors : [] };
    C.editors = keepOwners(C.editors, user);
    C.log.unshift({ at: new Date().toISOString(), by: user.name, action: `從備份還原（${String(b.at || '').slice(0, 10)}）`, id: '', t: '整個網站' });
    save();
    return [200, { rev: C.rev }];
  }

  // ---------- 路由 ----------
  async function handle(req, res, pathname, url) {
    if (pathname === '/content.js') {
      if (req.headers['if-none-match'] === contentJs.etag) { res.writeHead(304, { etag: contentJs.etag, 'cache-control': 'no-cache' }); res.end(); return true; }
      res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-cache', 'x-content-type-options': 'nosniff', etag: contentJs.etag });
      res.end(req.method === 'HEAD' ? undefined : contentJs.body);
      return true;
    }
    if (!pathname.startsWith('/api/auth/') && !pathname.startsWith('/api/editor/') && pathname !== '/api/me') return false;
    try {
      // 登入、登出
      if (pathname === '/api/auth/login' && req.method === 'GET') {
        if (LOGIN === 'oidc') await oidcLogin(req, res, url);
        else if (LOGIN === 'dev') page(res, 200, '本機測試登入', `<p>這是本機開發用的假登入（DEV_LOGIN=1），正式網站會改用公司帳號。</p>
<form method="post" action="/api/auth/dev"><input type="hidden" name="next" value="${safeNext(url.searchParams.get('next'))}">
<label>員工編號<br><input name="no" required pattern="[A-Za-z0-9-]{2,20}"></label><label>姓名<br><input name="name" required maxlength="40"></label><button>登入</button></form>`);
        else page(res, 503, '還沒接上公司帳號登入', '<p>網站部署到公司平台、開啟公司帳號登入（vibe.yaml 的 auth.mode: oidc）後才能登入編輯。</p>');
        return true;
      }
      if (pathname === CALLBACK_PATH && req.method === 'GET' && LOGIN === 'oidc') { await oidcCallback(req, res, url); return true; }
      if (pathname === '/api/auth/dev' && req.method === 'POST' && LOGIN === 'dev') {
        const f = new URLSearchParams((await readBody(req, 4096)).toString());
        const no = String(f.get('no') || '').trim().toUpperCase();
        if (!/^[A-Z0-9-]{2,20}$/.test(no)) { page(res, 400, '員工編號不正確', '<p>請回上一頁重新輸入。</p>'); return true; }
        signIn(req, res, { no, name: f.get('name') }, safeNext(f.get('next')));
        return true;
      }
      if (pathname === '/api/auth/logout' && req.method === 'POST') {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'set-cookie': cookie(req, 'ml_sess', '', 0) });
        res.end('{"ok":true}');
        return true;
      }
      if (pathname.startsWith('/api/auth/')) { sendJson(res, 404, { error: 'Not found' }); return true; }

      const user = userOf(req);
      const role = user && roleOf(user.no);
      if (pathname === '/api/me' && req.method === 'GET') { sendJson(res, 200, { login: LOGIN, user, role }); return true; }
      if (!user) { sendJson(res, 401, { error: '請先登入' }); return true; }
      if (!role) { sendJson(res, 403, { error: '你不在編輯者名單上' }); return true; }
      // 寫入的請求要帶這個標頭：別的網站的表單送不出自訂標頭，可以擋掉跨站偽造請求
      if (req.method !== 'GET' && req.headers['x-ml-editor'] !== '1') { sendJson(res, 403, { error: '請從編輯後台操作' }); return true; }

      let out;
      if (pathname === '/api/editor/state' && req.method === 'GET') out = [200, stateFor(user)];
      else if (pathname === '/api/editor/state' && req.method === 'PUT') out = putState(user, role, JSON.parse((await readBody(req, 30e6)).toString() || 'null'));
      else if (pathname === '/api/editor/media' && req.method === 'POST') out = await upload(req, url, await readBody(req, 8e6));
      else if (pathname === '/api/editor/video/start' && req.method === 'POST') out = videoStart(url);
      else if (pathname === '/api/editor/video/finish' && req.method === 'POST') out = await videoFinish(JSON.parse((await readBody(req, 4096)).toString() || 'null'));
      else if (pathname === '/api/editor/survey' && req.method === 'GET') out = [200, { entries: surveyEntries() }];
      else if (pathname === '/api/editor/board' && req.method === 'GET') out = board.list();
      else if (pathname.startsWith('/api/editor/board/') && req.method === 'POST') {
        const b = JSON.parse((await readBody(req, 64e3)).toString() || 'null') || {};
        const act = pathname.slice(18);
        out = act === 'create' ? board.create(user, role, b) : act === 'reply' ? board.reply(user, b) : act === 'update' ? board.update(user, role, b) : act === 'delete' ? board.remove(user, role, b) : [404, { error: 'Not found' }];
      }
      else if (pathname === '/api/editor/check' && req.method === 'GET') out = [200, { problems: Model.checkAll(C.pages, allMedia()) }];
      else if (pathname === '/api/editor/backup' && req.method === 'GET') {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'content-disposition': `attachment; filename="moonland-docs-backup-${new Date().toISOString().slice(0, 10)}.json"` });
        res.end(JSON.stringify(await backup()));
        return true;
      } else if (pathname === '/api/editor/restore' && req.method === 'POST') {
        out = role === 'owner' ? await restoreBackup(user, JSON.parse((await readBody(req, 400e6)).toString() || 'null')) : [403, { error: '只有主管理員可以從備份還原' }];
      } else out = [404, { error: 'Not found' }];
      sendJson(res, out[0], out[1]);
    } catch (e) {
      if (e.status === 413) sendJson(res, 413, { error: '檔案太大' });
      else if (e instanceof SyntaxError) sendJson(res, 400, { error: '資料格式不正確' });
      else {
        console.error('編輯後台錯誤', pathname, e.message);
        if (pathname.startsWith('/api/auth/')) page(res, 502, '登入暫時無法完成', '<p>和公司帳號系統連線時出了問題，請稍後再試；一直失敗請聯絡平台組。</p>');
        else sendJson(res, 500, { error: '伺服器出了問題，請稍後再試' });
      }
    }
    return true;
  }

  // 後台上傳的檔案：/assets/media/<區域>/<檔名> 是上傳的就回 { url }（S3 的讀取網址，轉址過去）或 { file }（本機檔案）
  function uploadedMedia(rel) {
    if (!Object.values(uploads).some((e) => e[0] === rel)) return null;
    if (store) return { url: store.presign('GET', `media/${rel}`, { stable: true }) };
    const f = path.join(MEDIA_DIR, rel);
    return f.startsWith(MEDIA_DIR + path.sep) && fs.existsSync(f) ? { file: f } : null;
  }

  // 說明中心目前公開的頁面（回饋後台「閱讀流量」列出沒人看的頁面用）
  function publicPages() {
    const { ARTICLES, SECTIONS } = Model.toSite(C.sections, C.pages);
    const out = [{ id: 'home', t: '首頁' }];
    const seen = new Set(['home']);
    for (const sec of SECTIONS || []) for (const r of sec.rows || []) if (!seen.has(r.id) && C.pages[r.id]) { seen.add(r.id); out.push({ id: r.id, t: C.pages[r.id].t }); }
    for (const [id, a] of Object.entries(ARTICLES || {})) if (!seen.has(id)) { seen.add(id); out.push({ id, t: a.t }); }
    return out;
  }
  // 有沒有登入編輯後台（編輯者或主管理員）：回饋後台的「閱讀流量」用公司帳號登入就能看
  function isEditor(req) { const u = userOf(req); return !!(u && roleOf(u.no)); }
  return { handle, uploadedMedia, publicPages, isEditor, LOGIN };
};
