#!/usr/bin/env node
// 把說明中心包成「沒有伺服器的純靜態網站」，給 moonland.ai 網域使用（2026-11-23 使用者與工程師討論的做法）
//
// 流程：同事在公司網站的編輯後台改好內容 → 網站負責人在自己電腦跑這支 → 推到靜態版的 GitHub repo → 工程師／自動流程放上 moonland.ai
//
// 用法（在 repo 資料夾裡）：
//   node tools/build-static.js            打包到 ../moonland-docs-site（只打包，不推送）
//   node tools/build-static.js --push     打包完直接 commit 並 push 到靜態版的 repo
// 其他選項：
//   --out <資料夾>       輸出到別的資料夾（預設 ../moonland-docs-site）
//   --site <網址>        內容從哪個網站讀（預設公司網站 https://moonland-docs-vibe.moonshine-studio.net）
//   --from-repo          不讀公司網站，改用 repo 裡的 data/*.js（只用來測試，內容可能是舊的）
//   --no-compress        影片、音樂不重新壓縮（比較快，檔案比較大）
//
// 做了什麼：
// - 內容：讀公司網站的 /content.js（只有已公開的頁面；草稿、封存、英文草稿都不會出現）
// - 3D 模型：拿掉（[3d 編號] 與下面 STATIC_EDITS 列的介紹段落），不附 3D 檢視程式
// - 媒體：只放公開頁面有用到的；圖片一律 WebP；影片壓到寬度最多 1280、音樂壓到 96 kbps（壓完沒有變小就用原檔）
//   壓過的檔案存在 ../static-cache，下次只壓新的，所以第二次以後很快
// - 不連公司網域（2026-11-23 使用者要求）：config.js 的 noServer 設成 true，回饋與吉吉問卷只送 Google 試算表，
//   閱讀流量不記；成品裡出現公司網址就停止、不推送
// - 不含編輯後台、回饋後台、伺服器程式
// - 讀內容的那一步要在公司網路裡做（打包的電腦連得到公司網站），成品本身不連公司
//
// 需要：Node 18 以上；壓縮影片和音樂要 ffmpeg（找 PATH 上的 ffmpeg 或環境變數 FFMPEG，找不到就用原檔並提醒）
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync, execFile } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const has = (name) => args.includes(name);
const SITE = opt('--site', 'https://moonland-docs-vibe.moonshine-studio.net').replace(/\/+$/, '');
const OUT = path.resolve(opt('--out', path.join(ROOT, '..', 'moonland-docs-site')));
const CACHE = path.resolve(opt('--cache', path.join(ROOT, '..', 'static-cache')));
const FROM_REPO = has('--from-repo');
const COMPRESS = !has('--no-compress');
const PUSH = has('--push');
const MARK = '.ml-static';   // 輸出資料夾裡的記號：有它才敢清空資料夾，避免清錯地方

// 靜態版拿掉 3D 模型時，一併拿掉介紹 3D 範例的段落。
// 每條規則：從 start 開頭的那一行，刪到 end 開頭的那一行（endKeep: true 表示 end 那一行留著）。
// 編輯後台改了這些字，規則會找不到；打包時會提醒，照新的文字改這裡就好。
const STATIC_EDITS = [
  { page: 'm-3d', lang: 'zh', start: '## 範例：同一張圖做成 3D', end: '## Pixal3D', endKeep: true },
  { page: 'm-3d', lang: 'zh', start: '下面是用同一組來源圖片生成的 Idol 範例。', end: '[3d 639' },
  { page: 'm-3d', lang: 'en', start: '## Example: one image turned into 3D', end: '## Pixal3D', endKeep: true },
  { page: 'm-3d', lang: 'en', start: 'Below are Idol examples generated from the same source images.', end: '[3d 639' },
];

const log = (...a) => console.log(...a);
const warn = (...a) => console.log('⚠', ...a);
const MB = (n) => `${(n / 1048576).toFixed(1)} MB`;

// ---------- 1. 讀內容 ----------
async function loadContent() {
  const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
  let rev = '';
  if (FROM_REPO) {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const block = /<!-- content -->([\s\S]*?)<!-- \/content -->/.exec(html)[1];
    for (const m of block.matchAll(/src="([\w./-]+\.js)/g)) vm.runInContext(fs.readFileSync(path.join(ROOT, m[1]), 'utf8'), ctx, { filename: m[1] });
    ctx.ARTICLES_EN = ctx.ARTICLES_EN || {};
    rev = 'repo';
  } else {
    const r = await fetch(`${SITE}/content.js`, { cache: 'no-store' });
    if (!r.ok) throw new Error(`讀不到 ${SITE}/content.js（${r.status}）`);
    const js = await r.text();
    rev = (/版本 (\d+)/.exec(js) || [])[1] || '';
    vm.runInContext(js, ctx, { filename: 'content.js' });
  }
  if (!ctx.ARTICLES || !ctx.SECTIONS || !ctx.MEDIA) throw new Error('內容格式不對：找不到 ARTICLES、SECTIONS 或 MEDIA');
  const data = {};
  for (const k of Object.keys(ctx)) if (k !== 'window') data[k] = ctx[k];
  return { data, rev };
}

// ---------- 2. 拿掉 3D ----------
function strip3d(body, page, lang) {
  if (!/\[3d\s/.test(body)) return body;
  let lines = String(body).replace(/\r/g, '').split('\n');
  for (const r of STATIC_EDITS.filter((x) => x.page === page && x.lang === lang)) {
    const s = lines.findIndex((l) => l.startsWith(r.start));
    const e = s < 0 ? -1 : lines.findIndex((l, i) => i > s && l.startsWith(r.end));
    if (s < 0 || e < 0) { warn(`「${page}」${lang === 'en' ? '英文版' : ''}找不到要拿掉的段落「${r.start}」：文字可能改過了，請到 tools/build-static.js 的 STATIC_EDITS 更新`); continue; }
    lines.splice(s, e - s + (r.endKeep ? 0 : 1));
  }
  lines = lines.filter((l) => !/^\[3d\s[^\]]*\]\s*$/.test(l.trim()));
  if (lines.some((l) => /\[3d\s/.test(l))) warn(`「${page}」還有寫在句子裡的 [3d ...]，請檢查`);
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

// ---------- 3. 找 ffmpeg ----------
function findTools() {
  const cands = [process.env.FFMPEG, 'ffmpeg'];
  // 公司電腦常見、附在其他軟體裡的 ffmpeg（沒裝 ffmpeg 時借用）
  for (const base of [process.env.ProgramFiles, process.env['ProgramFiles(x86)']].filter(Boolean)) {
    cands.push(path.join(base, 'ffmpeg', 'bin', 'ffmpeg.exe'), path.join(base, 'Topaz Labs LLC', 'Topaz Video', 'ffmpeg.exe'),
      path.join(base, 'Red Giant', 'Trapcode Suite', 'Tools', 'ffmpeg.exe'), path.join(base, 'Red Giant', 'PluralEyes 4', 'ffmpeg.exe'));
  }
  const found = [];
  for (const c of cands.filter(Boolean)) {
    try { found.push({ bin: c, enc: execFileSync(c, ['-hide_banner', '-encoders'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 20000 }) }); } catch {}
  }
  const pick = (want) => { for (const w of want) for (const f of found) if (f.enc.split('\n').some((l) => l.includes(` ${w.enc} `) && (!w.also || w.also.every((a) => f.enc.includes(` ${a} `))))) return { bin: f.bin, enc: w.enc }; return null; };
  return {
    video: pick([{ enc: 'libx264', also: ['aac'] }, { enc: 'h264_nvenc', also: ['aac'] }, { enc: 'h264_mf', also: ['aac'] }]),
    mp3: pick([{ enc: 'libmp3lame' }, { enc: 'mp3_mf' }]),
    webp: pick([{ enc: 'libwebp' }]),
  };
}

const run = (bin, a) => new Promise((ok, no) => execFile(bin, a, { maxBuffer: 1 << 24, timeout: 600000 }, (e, _o, se) => (e ? no(new Error(String(se || e.message).split('\n').slice(-3).join(' '))) : ok())));

function videoArgs(t, src, dst) {
  const v = { libx264: ['-c:v', 'libx264', '-preset', 'slow', '-crf', '30'], h264_nvenc: ['-c:v', 'h264_nvenc', '-preset', 'p7', '-rc', 'vbr', '-cq', '34', '-b:v', '0'], h264_mf: ['-c:v', 'h264_mf', '-b:v', '900k'] }[t.enc];
  return ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-vf', "scale='min(1280,iw)':-2", ...v, '-pix_fmt', t.enc === 'h264_mf' ? 'nv12' : 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', dst];
}
const mp3Args = (t, src, dst) => ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-vn', '-c:a', t.enc, '-b:a', '96k', dst];
const webpArgs = (t, src, dst) => ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-vf', "scale='min(1920,iw)':-2", '-c:v', 'libwebp', '-quality', '82', dst];

// ---------- 4. 媒體 ----------
async function getSource(rel) {
  const local = path.join(ROOT, 'assets', 'media', rel);
  if (fs.existsSync(local)) return local;
  // 編輯後台上傳的檔案不在 repo 裡：從公司網站下載一次，存在快取資料夾
  const dl = path.join(CACHE, 'download', rel);
  if (fs.existsSync(dl)) return dl;
  const r = await fetch(`${SITE}/assets/media/${rel.split('/').map(encodeURIComponent).join('/')}`);
  if (!r.ok) throw new Error(`下載 ${rel} 失敗（${r.status}）`);
  fs.mkdirSync(path.dirname(dl), { recursive: true });
  fs.writeFileSync(dl + '.part', Buffer.from(await r.arrayBuffer()));
  fs.renameSync(dl + '.part', dl);
  return dl;
}

const inflight = new Map();
// 壓好放在 cached 就回傳 true；壓失敗或沒有變小（用原檔）回傳 false
async function compressOnce(rel, src, size, kind, tool, makeArgs, cached, skip, stats) {
  if (fs.existsSync(skip)) return false;
  if (fs.existsSync(cached)) return true;
  fs.mkdirSync(path.dirname(cached), { recursive: true });
  const tmp = cached.replace(/(\.\w+)$/, '.tmp$1');
  try { await run(tool.bin, makeArgs(tool, src, tmp)); } catch (e) { warn(`壓縮 ${rel} 失敗，用原檔：${e.message}`); return false; }
  // 圖片換格式一定要用新檔；影片、音樂沒有小到 90% 以下就不值得換
  if (kind !== 'webp' && fs.statSync(tmp).size > size * 0.9) { fs.rmSync(tmp, { force: true }); fs.writeFileSync(skip, ''); return false; }
  // Windows 的防毒軟體有時會短暫鎖住剛寫好的檔案：等一下再試
  for (let i = 0; ; i++) {
    try { fs.renameSync(tmp, cached); break; } catch (e) { if (i >= 10) throw e; await new Promise((r) => setTimeout(r, 500)); }
  }
  stats.compressed++;
  return true;
}

// 回傳 { file（要複製的檔案）, rel（輸出的相對路徑，副檔名可能變成 .webp）}
async function processMedia(rel, tools, stats) {
  const src = await getSource(rel);
  const ext = path.extname(rel).toLowerCase();
  const size = fs.statSync(src).size;
  stats.before += size;
  const hash = crypto.createHash('sha1').update(fs.readFileSync(src)).digest('hex').slice(0, 16);
  let kind = '', tool = null, makeArgs = null, outExt = ext;
  if (/^\.(png|jpe?g|gif)$/.test(ext)) { kind = 'webp'; tool = tools.webp; makeArgs = webpArgs; outExt = '.webp'; }
  else if (ext === '.mp4' && COMPRESS) { kind = 'video'; tool = tools.video; makeArgs = videoArgs; }
  else if (ext === '.mp3' && COMPRESS) { kind = 'mp3'; tool = tools.mp3; makeArgs = mp3Args; }
  const keep = () => { stats.after += size; return { file: src, rel }; };
  if (!kind) return keep();
  if (!tool) { stats.noTool.add(kind); return keep(); }
  // 設定改了就換快取檔名（v2…），舊的壓縮結果不會被誤用
  const cached = path.join(CACHE, 'out', `${hash}-${kind}-${{ video: 'v2', mp3: 'v1', webp: 'v1' }[kind]}${outExt}`);
  const skip = cached + '.keep';   // 壓完沒有變小：記下來，下次直接用原檔
  // 內容一樣的檔案（不同編號用同一個檔）只壓一次：同時有人在壓就等它
  if (!inflight.has(cached)) inflight.set(cached, compressOnce(rel, src, size, kind, tool, makeArgs, cached, skip, stats));
  if (!(await inflight.get(cached))) return keep();
  stats.after += fs.statSync(cached).size;
  return { file: cached, rel: rel.slice(0, -ext.length) + outExt };
}

// 同時跑幾個工作
async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0, done = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) {
      const k = i++;
      out[k] = await fn(items[k]);
      if (++done % 20 === 0 || done === items.length) process.stdout.write(`\r  媒體 ${done}/${items.length}`);
    }
  }));
  process.stdout.write('\n');
  return out;
}

// ---------- 5. 輸出資料夾 ----------
function prepareOut() {
  if (fs.existsSync(OUT)) {
    const names = fs.readdirSync(OUT).filter((n) => n !== '.git');
    if (names.length && !names.includes(MARK)) throw new Error(`${OUT} 裡已經有別的檔案，為了安全不清空它。請換一個 --out 資料夾，或確認後自己清空`);
    for (const n of names) fs.rmSync(path.join(OUT, n), { recursive: true, force: true });
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, MARK), '這個資料夾由 moonland-docs 的 tools/build-static.js 產生，每次打包會整個重寫（.git 除外）。\n');
}
const write = (rel, data) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
const shortHash = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);

function git(a) { return execFileSync('git', a, { cwd: OUT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }

async function main() {
  const t0 = Date.now();
  log(`讀取內容：${FROM_REPO ? 'repo 裡的 data/*.js（測試用）' : `${SITE}/content.js`}`);
  const { data, rev } = await loadContent();
  const { ARTICLES, ARTICLES_EN, SECTIONS, MEDIA } = data;
  log(`  ${Object.keys(ARTICLES).length} 篇中文、${Object.keys(ARTICLES_EN || {}).length} 篇已公開的英文${rev ? `（內容版本 ${rev}）` : ''}`);

  for (const [id, a] of Object.entries(ARTICLES)) if (a.body) a.body = strip3d(a.body, id, 'zh');
  for (const [id, a] of Object.entries(ARTICLES_EN || {})) if (a.body) a.body = strip3d(a.body, id, 'en');

  // 用到的媒體：內文、頁面縮圖、首頁預設縮圖（markup.js 的 HOME_THUMBS）
  const used = new Set();
  const text = JSON.stringify([ARTICLES, ARTICLES_EN, SECTIONS, data.SNIPPETS || null]);
  for (const m of text.matchAll(/\[(?:i|v|a)\s+(\d+)/g)) used.add(m[1]);
  for (const m of text.matchAll(/"thumb":"?(\d+)/g)) used.add(m[1]);
  const homeThumbs = /const HOME_THUMBS = \{([^}]*)\}/.exec(fs.readFileSync(path.join(ROOT, 'markup.js'), 'utf8'));
  if (homeThumbs) for (const m of homeThumbs[1].matchAll(/:\s*(\d+)/g)) used.add(m[1]);
  const missing = [...used].filter((n) => !MEDIA[n]);
  if (missing.length) warn(`公開的頁面引用了找不到的媒體編號：${missing.join('、')}（請在編輯後台「檢查與備份」修正）`);
  const list = [...used].filter((n) => MEDIA[n] && !/\.glb$/i.test(MEDIA[n][0])).sort((a, b) => a - b);

  const tools = findTools();
  if (COMPRESS) log(`壓縮工具：影片 ${tools.video ? tools.video.enc : '（沒有）'}、音樂 ${tools.mp3 ? tools.mp3.enc : '（沒有）'}、圖片 ${tools.webp ? tools.webp.enc : '（沒有）'}`);

  prepareOut();
  const stats = { before: 0, after: 0, compressed: 0, noTool: new Set() };
  log(`處理 ${list.length} 個媒體（第一次要壓縮影片和音樂，會花幾分鐘；之後只處理新的）`);
  const results = await pool(list, 3, async (n) => {
    const r = await processMedia(MEDIA[n][0], tools, stats);
    fs.mkdirSync(path.dirname(path.join(OUT, 'assets/media', r.rel)), { recursive: true });
    fs.copyFileSync(r.file, path.join(OUT, 'assets/media', r.rel));
    return [n, r.rel];
  });
  const media = {};
  for (const [n, rel] of results) media[n] = [rel, MEDIA[n][1]];
  if (stats.noTool.size) warn(`找不到 ffmpeg（${[...stats.noTool].join('、')}），這些檔案用原檔。裝好 ffmpeg 再跑一次就會壓縮`);

  // content.js：只放用到的媒體
  const out = { ...data, MEDIA: media };
  const contentJs = `// 由 tools/build-static.js 產生${rev ? `（公司網站內容版本 ${rev}）` : ''}，不要手動改\n` +
    Object.entries(out).map(([k, v]) => `window.${k}=${JSON.stringify(v)};`).join('\n') + '\n';
  write('content.js', contentJs);

  // config.js：標成沒有伺服器（回饋與問卷只送 Google 試算表，閱讀流量不記）
  const config = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8');
  if (!/noServer: false/.test(config)) throw new Error('config.js 找不到 noServer 設定');
  write('config.js', config.replace(/noServer: false/, 'noServer: true'));

  for (const f of ['style.css', 'markup.js', 'survey.js', 'script.js', 'data/en/ui.js', 'assets/favicon.png', 'assets/logo-white.png', 'assets/logo-dark.png']) {
    write(f, fs.readFileSync(path.join(ROOT, f)));
  }

  // index.html：內容區塊換成 content.js；css／js 網址加內容雜湊，更新後瀏覽器一定抓新檔
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
    .replace(/<!-- content -->[\s\S]*?<!-- \/content -->/, '<script src="content.js"></script>');
  html = html.replace(/(src|href)="([\w./-]+\.(?:css|js))(?:\?v=[^"]*)?"/g, (m, attr, f) => {
    const p = path.join(OUT, f);
    return fs.existsSync(p) ? `${attr}="${f}?v=${shortHash(fs.readFileSync(p))}"` : m;
  });
  write('index.html', html);

  write('README.md', `# moonland.ai 說明中心（靜態版）

這個 repo 是**自動產生的成品**，不要直接改這裡的檔案，下次打包會被蓋掉。

- 內容由網站負責人從內部的編輯後台打包產生
- 打包時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}${rev ? `（內容版本 ${rev}）` : ''}

## 給工程師

- 純靜態網站：根目錄的 \`index.html\` 就是首頁，沒有伺服器程式、不需要建置。網址用 \`#文章代號\` 切換頁面，不需要設定改寫規則。
- 不會連到公司內部的任何網址。對外連線只有：Google Fonts（字型）、Google Apps Script（意見回饋、「有幫助嗎」投票、訪客問卷，網址在 \`config.js\`）。
- 不記閱讀流量。
- 快取：\`index.html\`、\`content.js\` 建議每次都確認有沒有更新（例如 \`Cache-Control: no-cache\`）；css／js 網址帶內容雜湊，\`assets/media/\` 的檔名不會重複使用，都可以長時間快取。
`);

  const files = []; const walk = (d) => { for (const n of fs.readdirSync(d)) { if (n === '.git') continue; const p = path.join(d, n); fs.statSync(p).isDirectory() ? walk(p) : files.push(p); } }; walk(OUT);

  // 安全檢查：成品裡不能出現公司內部的網域（2026-11-23 使用者要求外部不能有任何方式連到公司）
  // 例如有人在文章裡貼了公司網站的連結或圖片網址，這裡會擋下來，不會推送
  const INTERNAL = [/moonshine-studio\.net/i, /moonshine\.tw/i, /gitea\.moonshine/i, new RegExp(new URL(SITE).hostname.replace(/\./g, '\\.'), 'i')];
  const leaks = [];
  for (const f of files.filter((x) => /\.(html|js|css|json|md|txt)$/i.test(x))) {
    const t = fs.readFileSync(f, 'utf8');
    for (const re of INTERNAL) { const m = re.exec(t); if (m) leaks.push(`${path.relative(OUT, f)}：${t.slice(Math.max(0, m.index - 40), m.index + 60).replace(/\s+/g, ' ')}`); }
  }
  if (leaks.length) throw new Error(`成品裡出現公司內部網址，已停止（不會推送）。請在編輯後台把這些地方改掉再打包：\n  ${[...new Set(leaks)].join('\n  ')}`);
  const total = files.reduce((s, f) => s + fs.statSync(f).size, 0);
  log(`完成：${OUT}`);
  log(`  共 ${files.length} 個檔案、${MB(total)}（媒體 ${MB(stats.before)} → ${MB(stats.after)}，這次新壓縮 ${stats.compressed} 個），花了 ${Math.round((Date.now() - t0) / 1000)} 秒`);

  if (!PUSH) { log('要推上去：再跑一次並加上 --push，或到輸出資料夾自己 commit、push'); return; }
  if (!fs.existsSync(path.join(OUT, '.git'))) throw new Error(`${OUT} 還不是 git repo，請先照 docs/STATIC.md 設定一次`);
  git(['add', '-A']);
  if (!git(['status', '--porcelain'])) { log('內容和上次一樣，沒有要推送的'); return; }
  git(['commit', '-q', '-m', `更新說明中心${rev ? `（內容版本 ${rev}）` : ''}`]);
  git(['push', '-q']);
  log(`已推送：${git(['log', '--oneline', '-1'])}`);
}

main().catch((e) => { console.error(`✗ ${e.message}`); process.exit(1); });
