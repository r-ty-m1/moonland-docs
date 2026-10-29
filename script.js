// =========================================================
// moonland.ai 說明中心
// - SECTIONS：左側目錄與分類（改分類、改順序都在這裡）
// - 文章內容在 data/*.js（window.ARTICLES），寫法見 README.md
// - 圖片、影片、音訊對照表在 data/media.js（window.MEDIA）
// =========================================================


const ICONS = {
  home: 'M5 12l-2 0l9 -9l9 9l-2 0 M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7 M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6',
  rocket: 'M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3 M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3 M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
  coin: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1 M12 7v10',
  key: 'M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z M15 9h.01',
  grid: 'M4 4h6v6h-6z M14 4h6v6h-6z M4 14h6v6h-6z M14 14h6v6h-6z',
  chat: 'M8 9h8 M8 13h6 M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z',
  image: 'M15 8h.01 M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5 M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3',
  video: 'M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z M3 8a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z',
  flask: 'M9 3l6 0 M10 9l4 0 M10 3v6l-4 11a.7 .7 0 0 0 .5 1h11a.7 .7 0 0 0 .5 -1l-4 -11v-6',
  music: 'M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0 M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0 M9 17v-13h10v13 M9 8h10',
  planet: 'M18.816 13.58c2.292 2.138 3.546 4 3.092 4.9c-.745 1.46 -5.783 -.259 -11.255 -3.838c-5.47 -3.579 -9.304 -7.664 -8.56 -9.123c.464 -.91 2.926 -.444 5.803 .805 M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0',
  sparkles: 'M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z',
  layers: 'M12 4l-8 4l8 4l8 -4l-8 -4 M4 12l8 4l8 -4 M4 16l8 4l8 -4',
  users: 'M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2 M16 3.13a4 4 0 0 1 0 7.75 M21 21v-2a4 4 0 0 0 -3 -3.85',
  shield: 'M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3 M9 12l2 2l4 -4',
  help: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 17l0 .01 M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4',
  history: 'M12 8l0 4l2 2 M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5',
  mail: 'M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z M3 7l9 6l9 -6',
  chev: 'M9 6l6 6l-6 6',
  menu: 'M4 6l16 0 M4 12l16 0 M4 18l16 0',
  sidebar: 'M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z M9 4v16',
  search: 'M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0 M21 21l-6 -6',
  sun: 'M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7',
  moon: 'M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z',
  ext: 'M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6 M11 13l9 -9 M15 4h5v5',
  x: 'M18 6l-12 12 M6 6l12 12',
  copy: 'M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1',
  check: 'M5 12l5 5l10 -10',
  clock: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 7v5l3 3',
  message: 'M8 9h8 M8 13h6 M9 18h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-3l-3 3l-3 -3z',
  up: 'M12 5l0 14 M18 11l-6 -6 M6 11l6 -6',
  globe: 'M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0 M3.6 9h16.8 M3.6 15h16.8 M11.5 3a17 17 0 0 0 0 18 M12.5 3a17 17 0 0 1 0 18',
};
const ic = (name, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------------------------------------------------
// 0. 語言：中文（預設）／英文，index.html 開頭依 ?lang= 或上次的選擇設定 <html lang>
//    介面文字一律寫中文、外面包 T()；英文對照在 data/en/ui.js，英文文章在 data/en/*.js
//    T('約 {n} 分鐘', { n: 5 })：大括號裡的名稱會換成對應的值
// ---------------------------------------------------------
const LANG = document.documentElement.lang === 'en' ? 'en' : 'zh';
const UI_EN = window.UI_EN || {};
function T(s, vars) {
  let r = (LANG === 'en' && s && UI_EN[s]) || s;
  if (vars) r = r.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return r;
}

// ---------------------------------------------------------
// 1. 網站結構
//    一般列：{ id, icon, tag, n: 目錄上顯示的較短名稱（選填） }
//    分類列：{ id, t, icon, tag, d, groups: [{ g: 小標, items: [[文章 id, 目錄名稱, 標籤]] }] }
//    文章標題與內容來自 data/*.js
// ---------------------------------------------------------
const SECTIONS = [
  { label: '開始使用', rows: [
    { id: 'quick-start', icon: 'rocket', tag: '新手' },
    { id: 'credits', icon: 'coin' },
    { id: 'trial-login', icon: 'key' },
    { id: 'gallery', icon: 'grid' },
  ] },
  { label: '創作工具', rows: [
    { id: 'chat', t: '交談', icon: 'chat', tag: '新手推薦',
      d: '用中文對話生成圖片、影片、音樂與 3D 模型，AI 助理會自動挑選模型。第一次使用最推薦從這裡開始。',
      groups: [{ g: '', items: [['chat-intro', '交談介紹', '新手'], ['chat-prompts', '提示詞寫法'], ['chat-edit', '編輯與合成'], ['chat-settings', '交談設定']] }] },
    { id: 'image', t: '圖片生成', icon: 'image',
      d: '用文字或參考圖片生成 AI 圖片，也能放大、拓展、旋轉視角或修改已生成的圖片。',
      groups: [
        { g: '基礎', items: [['img-basics', '圖片生成基礎介紹', '新手'], ['img-prompt', '提示詞助手']] },
        { g: '進階應用', items: [['img-upscale', '圖片放大（SeedVR2）'], ['img-outpaint', '圖片拓展'], ['img-rotate', '圖片視角旋轉']] },
      ] },
    { id: 'video', t: '影片生成', icon: 'video',
      d: '用文字、圖片或影片生成 AI 影片，還能控制運動軌跡、頭尾幀、模仿動作與合併片段。',
      groups: [
        { g: '基礎', items: [['v-basics', '影片生成基礎介紹', '新手'], ['v-i2v', '圖片生成影片（i2v）']] },
        { g: '進階控制', items: [['v-v2v', '影片生成影片（v2v）'], ['v-path', '物件運動軌跡控制'], ['v-frames', '頭尾幀連接'], ['v-mimic', '動作模仿'], ['v-merge', '合併影片']] },
      ] },
    { id: 'lab', t: '實驗室', icon: 'flask',
      d: '用 LoRA、ControlNet、IP-Adapter 等精細參數控制生成，適合對品質要求高、或熟悉 Stable Diffusion 的使用者。',
      groups: [{ g: '', items: [['l-ui', '操作介面'], ['l-lora', 'LoRA 應用'], ['l-cn', 'ControlNet'], ['l-ip', '風格一致性（IP-Adapter）']] }] },
    { id: 'music-3d', t: '音樂與 3D', icon: 'music',
      d: '用文字與歌詞生成歌曲、背景音樂與音效，或用一張圖片生成 3D 模型。',
      groups: [{ g: '', items: [['music', '音樂生成'], ['model-3d', '3D 模型生成']] }] },
    { id: 'credit-tools', icon: 'planet', n: '外部模型（登月幣）' },
  ] },
  { label: '學習資源', rows: [
    { id: 'recipes', t: '應用範例', icon: 'sparkles',
      d: '跟著做就能完成的主題教學：從一個具體成品出發，帶你走完整個流程。',
      groups: [{ g: '', items: [['chat-recipes', '「交談」應用大全'], ['pvc', 'PVC 公仔風格'], ['logo', 'LOGO 創作'], ['outfit', '人物角色換衣'], ['face-swap', '名畫換臉']] }] },
    { id: 'models', t: '模型指南', icon: 'layers',
      groups: [{ g: '', items: [['m-choose', '模型怎麼選', '新手'], ['m-image', '圖片模型一覽'], ['m-video', '影片模型比較'], ['m-music', '音樂模型比較']] }] },
  ] },
  { label: '團隊管理', rows: [
    { id: 'team', t: '團隊成員', icon: 'users',
      d: '給團隊成員：收到邀請後怎麼註冊登入，以及用專案整理作品。',
      groups: [{ g: '', items: [['team-login', '團隊註冊與登入'], ['projects', '專案管理']] }] },
    { id: 'admin', t: '管理員課程', icon: 'shield',
      d: '給團隊管理員的六堂課，依序從系統導覽走到成員資訊檢視。',
      groups: [{ g: '', items: [['admin-1', '1｜系統導覽與標籤準備'], ['admin-2', '2｜邀請成員'], ['admin-3', '3｜用標籤分組'], ['admin-4', '4｜點數與登月幣分配'], ['admin-5', '5｜帳號狀態管理'], ['admin-6', '6｜查看成員資訊']] }] },
  ] },
  { label: '支援', rows: [
    { id: 'faq', icon: 'help' },
    { id: 'changelog', icon: 'history' },
    { id: 'contact', icon: 'mail' },
    { id: 'feedback', t: '意見回饋', icon: 'message' },
  ] },
];

// 舊網址對照（改版前的頁面代號）
const ALIASES = {
  basics: 'img-basics', 'c-basics': 'chat-intro', 'c-settings': 'chat-settings', 'c-edit': 'chat-edit',
  'c-recipes': 'chat-recipes', 'c-pvc': 'pvc', 'c-logo': 'logo', 'c-outfit': 'outfit', 'l-face': 'face-swap',
  'l-prompt': 'img-prompt', 'g-basics': 'gallery', 'o-music': 'music', 'o-3d': 'model-3d',
  'm-img': 'm-choose', 'm-imgc': 'm-image', 'm-vid': 'm-video', 'm-credit': 'models',
  'a-login': 'team-login', 'a-trial': 'trial-login', 'a-projects': 'projects', 'a-admin': 'admin',
  'a-invite': 'admin-2', 'a-tags': 'admin-3', 'a-credits': 'admin-4',
  'a-1': 'admin-1', 'a-2': 'admin-2', 'a-3': 'admin-3', 'a-4': 'admin-4', 'a-5': 'admin-5', 'a-6': 'admin-6',
};

// 英文版：目錄名稱換成英文；文章用 data/en/*.js 的標題、摘要與內文蓋過中文（等級、分鐘數等沿用中文版）
// 還沒翻譯的文章維持中文，頁面上會提示
const ZH_ARTICLES = window.ARTICLES || {};
const EN_ARTICLES = window.ARTICLES_EN || {};
const ARTICLES = LANG === 'en'
  ? Object.fromEntries(Object.entries(ZH_ARTICLES).map(([k, a]) => [k, EN_ARTICLES[k] ? { ...a, ...EN_ARTICLES[k] } : { ...a, untranslated: true }]))
  : ZH_ARTICLES;
const MEDIA = window.MEDIA || {};
if (LANG === 'en') {
  SECTIONS.forEach((sec) => {
    sec.label = T(sec.label);
    sec.rows.forEach((r) => {
      ['t', 'd', 'n', 'tag'].forEach((k) => { if (r[k]) r[k] = T(r[k]); });
      (r.groups || []).forEach((g) => {
        g.g = T(g.g);
        g.items.forEach((it) => { it[1] = T(it[1]); if (it[2]) it[2] = T(it[2]); });
      });
    });
  });
}

// 由 SECTIONS 建立頁面索引
const PAGES = { home: { t: T('首頁'), crumb: [] } };
const CATS = {};
const ORDER = [];
SECTIONS.forEach((sec) => sec.rows.forEach((r) => {
  if (r.groups) {
    CATS[r.id] = r;
    PAGES[r.id] = { t: r.t, crumb: [sec.label], cat: r.id };
    ORDER.push(r.id);
    r.groups.forEach((g) => g.items.forEach(([id, n, tag]) => {
      PAGES[id] = { t: (ARTICLES[id] && ARTICLES[id].t) || n, n, tag, crumb: [sec.label, r.t], cat: r.id };
      ORDER.push(id);
    }));
  } else {
    const t = (ARTICLES[r.id] && ARTICLES[r.id].t) || r.t || r.id;
    PAGES[r.id] = { t, n: r.n || (ARTICLES[r.id] && ARTICLES[r.id].n) || t, tag: r.tag, crumb: [sec.label] };
    r.t = t;
    ORDER.push(r.id);
  }
}));

// ---------------------------------------------------------
// 2. 媒體網址：檔案放在 assets/media/（對照表見 data/media.js）
// ---------------------------------------------------------
function mediaUrl(n) {
  const e = MEDIA[n];
  return e ? `assets/media/${e[0]}` : '';
}
const mediaRatio = (n) => (MEDIA[n] && MEDIA[n][1]) || 0;

// ---------------------------------------------------------
// 3. 文章標記語法 → HTML（語法說明見 README.md）
// ---------------------------------------------------------
function inline(s) {
  let h = esc(s);
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\[((?:[^\[\]]|\[[^\]]*\])+)\]\(([^)\s]+)\)/g, (m, text, href) => {
    if (href.startsWith('#h-')) return `<a href="#" data-to="${href.slice(1)}">${text}</a>`;
    if (/^https?:/.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
    return `<a href="${href}">${text}</a>`;
  });
  return h;
}

const isStarter = (t) => /^(:::|#{2,4}\s|>|\||\[(i|v|a|embed)\s|- |\d+\.\s|---$|@ |\?\? |\|\|\|$)/.test(t);

function splitAt(lines, test) {
  const parts = [];
  let cur = null, depth = 0;
  for (const line of lines) {
    const t = line.trim();
    if (/^:::\w/.test(t)) depth++;
    else if (t === ':::') depth--;
    if (depth === 0 && test(t)) { cur = { head: t, lines: [] }; parts.push(cur); continue; }
    if (!cur) { cur = { head: null, lines: [] }; parts.push(cur); }
    cur.lines.push(line);
  }
  return parts;
}

let headingCount = 0;
function media(t) {
  let m = t.match(/^\[(i|v|a)\s+(\d+)(?:\s+(.+))?\]$/);
  if (m) {
    const [, k, n, cap] = m;
    const url = mediaUrl(n);
    const ar = mediaRatio(n);
    const box = ar ? ` style="aspect-ratio:${ar}"` : '';
    const capHtml = cap ? `<figcaption>${inline(cap)}</figcaption>` : '';
    if (!url) return `<div class="media-missing">${T('找不到媒體 #{n}', { n })}</div>`;
    if (k === 'i') return `<figure class="fig"><img src="${url}" alt="${esc(cap || '')}" loading="lazy" decoding="async"${box} data-zoom>${capHtml}</figure>`;
    if (k === 'v') return `<figure class="fig"><video src="${url}" controls preload="metadata" playsinline${box}></video>${capHtml}</figure>`;
    return `<figure class="fig audio"><audio src="${url}" controls preload="none"></audio>${capHtml}</figure>`;
  }
  m = t.match(/^\[embed\s+(\S+)(?:\s+(.+))?\]$/);
  if (m) return `<figure class="fig embed"><iframe src="${esc(m[1])}" loading="lazy" title="${esc(m[2] || T('前後比較'))}"></iframe>${m[2] ? `<figcaption>${inline(m[2])}</figcaption>` : ''}</figure>`;
  return '';
}

function container(type, arg, inner) {
  if (type === 'tip' || type === 'warn' || type === 'note') {
    return `<div class="callout ${type}">${arg ? `<b>${inline(arg)}</b>` : ''}${blocks(inner)}</div>`;
  }
  if (type === 'details') return `<details class="more"><summary>${inline(arg)}</summary><div>${blocks(inner)}</div></details>`;
  if (type === 'steps') {
    const items = splitAt(inner, (t) => t.startsWith('@ ')).filter((p) => p.head);
    return `<ol class="steps">${items.map((p) => `<li><div class="step-t">${inline(p.head.slice(2))}</div>${blocks(p.lines)}</li>`).join('')}</ol>`;
  }
  if (type === 'row') {
    const cells = [{ lines: [] }];
    let depth = 0;
    for (const line of inner) {
      const t = line.trim();
      if (/^:::\w/.test(t)) depth++; else if (t === ':::') depth--;
      if (depth === 0 && t === '|||') { cells.push({ lines: [] }); continue; }
      cells[cells.length - 1].lines.push(line);
    }
    // 每一欄都只有一張圖或影片時，手機上維持兩欄並排
    const mediaOnly = cells.every((c) => { const ls = c.lines.map((l) => l.trim()).filter(Boolean); return ls.length === 1 && /^\[(i|v)\s+\d+/.test(ls[0]); });
    return `<div class="row${mediaOnly ? ' media' : ''}" style="--n:${cells.length}">${cells.map((c) => `<div class="cell">${blocks(c.lines)}</div>`).join('')}</div>`;
  }
  if (type === 'faq') {
    const qs = splitAt(inner, (t) => t.startsWith('?? ')).filter((p) => p.head);
    return qs.map((p) => `<details class="qa"><summary>${inline(p.head.slice(3))}</summary><div>${blocks(p.lines)}</div></details>`).join('');
  }
  return blocks(inner);
}

function blocks(lines) {
  let out = '';
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (!t) { i++; continue; }

    if (/^:::\w/.test(t)) {
      const [, type, arg] = t.match(/^:::(\w+)\s*(.*)$/);
      let depth = 1, j = i + 1;
      for (; j < lines.length; j++) {
        const tt = lines[j].trim();
        if (/^:::\w/.test(tt)) depth++;
        else if (tt === ':::' && --depth === 0) break;
      }
      out += container(type, arg, lines.slice(i + 1, j));
      i = j + 1;
      continue;
    }
    let m;
    if ((m = t.match(/^(#{2,4})\s+(.+?)(?:\s+\{#([\w-]+)\})?$/))) {
      const lvl = m[1].length;
      const id = m[3] || `h${++headingCount}`;
      out += `<h${lvl} id="${id}">${inline(m[2])}</h${lvl}>`;
      i++; continue;
    }
    if (t === '---') { out += '<hr>'; i++; continue; }
    if (t.startsWith('>')) {
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) { buf.push(lines[i].trim().replace(/^>\s?/, '')); i++; }
      out += `<div class="prompt"><pre>${esc(buf.join('\n'))}</pre><button type="button" class="copy" aria-label="${T('複製提示詞')}">${ic('copy')}<span>${T('複製')}</span></button></div>`;
      continue;
    }
    if (t.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const r = lines[i].trim();
        if (!/^\|[\s:|-]+\|$/.test(r)) rows.push(r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
        i++;
      }
      const [head, ...body] = rows;
      out += `<div class="tbl"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c, i) => `<td data-label="${esc(plainText(head[i] || ''))}">${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      continue;
    }
    if (/^\[(i|v|a|embed)\s/.test(t)) { out += media(t); i++; continue; }
    if (t.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) { items.push(lines[i].trim().slice(2)); i++; }
      out += `<ul>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`;
      continue;
    }
    if ((m = t.match(/^(\d+)\.\s/))) {
      const start = +m[1];
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s/, '')); i++; }
      out += `<ol${start > 1 ? ` start="${start}"` : ''}>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ol>`;
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !isStarter(lines[i].trim())) { buf.push(inline(lines[i].trim())); i++; }
    if (buf.length) out += `<p>${buf.join('<br>')}</p>`;
    else i++;
  }
  return out;
}
const renderMarkup = (src) => { headingCount = 0; return blocks(String(src).replace(/\r/g, '').split('\n')); };
const plainText = (src) => String(src)
  .replace(/\[(i|v|a|embed)\s[^\]]*\]/g, ' ')
  .replace(/\[((?:[^\[\]]|\[[^\]]*\])+)\]\([^)]+\)/g, '$1')
  .replace(/[*#>|:@?]/g, ' ');

// ---------------------------------------------------------
// 4. 左側目錄
// ---------------------------------------------------------
const root = document.documentElement;
const side = document.getElementById('side');
const view = document.getElementById('view');
const toc = document.getElementById('toc');
const tagHtml = (tag) => (tag ? `<span class="tag">${esc(tag)}</span>` : '');

function navRow(r) {
  if (!r.groups) {
    return `<a class="nav-row" href="#${r.id}" data-id="${r.id}">${ic(r.icon)}<span class="lbl">${esc(PAGES[r.id].n)}</span>${tagHtml(r.tag)}</a>`;
  }
  const many = r.groups.length > 1;
  const kids = r.groups.map((g) =>
    (many && g.g ? `<div class="sub-label">${esc(g.g)}</div>` : '') +
    g.items.map(([id, n, tag]) => `<a class="nav-child" href="#${id}" data-id="${id}"><span>${esc(n)}</span>${tagHtml(tag)}</a>`).join('')
  ).join('');
  return `<div class="nav-cat" data-cat="${r.id}">
    <div class="nav-row cat-row">
      <a class="cat-link" href="#${r.id}" data-id="${r.id}">${ic(r.icon)}<span class="lbl">${esc(r.t)}</span>${tagHtml(r.tag)}</a>
      <button class="cat-toggle" type="button" aria-expanded="false" aria-label="${esc(T('展開{x}', { x: r.t }))}">${ic('chev', 'ic chev')}</button>
    </div>
    <div class="nav-children"><div class="nav-children-in">${kids}</div></div>
  </div>`;
}

side.innerHTML =
  `<a class="nav-row" href="#home" data-id="home">${ic('home')}<span class="lbl">${T('首頁')}</span></a>` +
  SECTIONS.map((sec) => `<div class="nav-sec"><div class="nav-sec-label">${sec.label}</div>${sec.rows.map(navRow).join('')}</div>`).join('') +
  // 手機上頂部列放不下語言按鈕，改放在目錄裡
  `<button class="nav-row lang-row" type="button" data-switch-lang lang="${LANG === 'en' ? 'zh-Hant' : 'en'}">${ic('globe')}<span class="lbl">${LANG === 'en' ? '中文' : 'English'}</span></button>` +
  `<div class="side-foot">${T('<b>找不到答案？</b>寫信到 support@moonshine.ai，或<a href="https://lin.ee/PpA769D" target="_blank" rel="noopener">加入 LINE 社群</a>詢問。')}</div>`;

function setOpen(cat, open) {
  cat.classList.toggle('open', open);
  const b = cat.querySelector('.cat-toggle');
  b.setAttribute('aria-expanded', String(open));
  b.setAttribute('aria-label', T(open ? '收合{x}' : '展開{x}', { x: cat.querySelector('.lbl').textContent }));
}
side.addEventListener('click', (e) => {
  const b = e.target.closest('.cat-toggle');
  if (b) { const c = b.closest('.nav-cat'); setOpen(c, !c.classList.contains('open')); }
});

// ---------------------------------------------------------
// 5. 頁面
// ---------------------------------------------------------
function crumb(id) {
  const p = PAGES[id];
  if (!p.crumb.length) return '';
  const parts = p.crumb.map((c, i) => (i === 1 && p.cat ? `<a href="#${p.cat}">${esc(c)}</a>` : `<span>${esc(c)}</span>`));
  return `<nav class="crumb" aria-label="${T('目前位置')}">${parts.join('<span class="sep">/</span>')}</nav>`;
}
const card = (href, icon, title, desc, tag) =>
  `<a class="card" href="${href}"><span class="tile">${ic(icon)}</span><b>${esc(title)}${tagHtml(tag)}</b><span class="d">${esc(desc)}</span></a>`;

function metaHtml(a) {
  const chips = [];
  if (a.level) chips.push(`<span class="chip${a.level === '新手' ? ' brand' : ''}">${esc(T(a.level))}</span>`);
  if (a.tool) chips.push(`<span class="chip">${esc(T('使用{x}', { x: T(a.tool) }))}</span>`);
  (a.models || []).forEach((m) => chips.push(`<span class="chip">${esc(m)}</span>`));
  if (a.minutes) chips.push(`<span class="chip">${ic('clock', 'ic sm')}${T('約 {n} 分鐘', { n: a.minutes })}</span>`);
  return chips.length ? `<div class="meta">${chips.join('')}</div>` : '';
}

function articleList(c) {
  return c.groups.map((g, i) => `<h2 id="g${i}">${esc(g.g || T('這個分類的文章'))}</h2><div class="list">` +
    g.items.map(([aid, n, tag]) => {
      const a = ARTICLES[aid] || {};
      return `<a class="list-row" href="#${aid}"><span class="list-t"><b>${esc(a.t || n)}</b>${a.d ? `<small>${esc(a.d)}</small>` : ''}</span>${tag ? `<span class="chip brand">${esc(tag)}</span>` : ''}${ic('chev', 'ic chev')}</a>`;
    }).join('') + `</div>`).join('');
}

function articleView(id) {
  const a = ARTICLES[id];
  const c = CATS[id];
  const head = c
    ? `<div class="cat-head"><span class="cat-icon">${ic(c.icon)}</span><h1>${esc(a.t)}</h1></div>`
    : `<h1>${esc(a.t)}</h1>`;
  const notYet = a.untranslated ? `<div class="callout note">${T('這篇還沒有英文版，以下先顯示中文內容。')}</div>` : '';
  return `${crumb(id)}${head}${metaHtml(a)}${a.d ? `<p class="lead">${esc(a.d)}</p>` : ''}${notYet}
    <div class="prose">${renderMarkup(a.body)}</div>
    ${c ? articleList(c) : ''}`;
}

function catView(id) {
  const c = CATS[id];
  return `${crumb(id)}<div class="cat-head"><span class="cat-icon">${ic(c.icon)}</span><h1>${esc(c.t)}</h1>${tagHtml(c.tag)}</div>
    ${c.d ? `<p class="lead">${esc(c.d)}</p>` : ''}${articleList(c)}`;
}

const VIEWS = {
  home: () => `
    <section class="hero">
      <div class="eyebrow">${T('MOONLAND.AI 說明中心')}</div>
      <h1><span class="seg">${T('從第一張圖到團隊管理，')}</span><span class="seg">${T('<em>所有操作</em>都查得到')}</span></h1>
      <p>${T('交談、圖片、影片、音樂、實驗室與團隊後台的官方教學。不知道從哪裡開始？直接搜尋你想做的事。')}</p>
      <button class="hero-search" type="button" data-open-search>${ic('search')}<span class="sp-text">${T('例如：換衣服、頭尾幀、ControlNet、點數')}</span><kbd>Ctrl K</kbd></button>
      <div class="popular">${T('熱門：')}<a href="#chat-prompts">${T('提示詞寫法')}</a><a href="#outfit">${T('人物換衣')}</a><a href="#v-i2v">${T('圖片生成影片')}</a><a href="#v-mimic">${T('動作模仿')}</a><a href="#credits">${T('點數怎麼算')}</a></div>
    </section>

    <h2 id="h-path">${T('依你的程度開始')}</h2>
    <div class="grid">
      ${card('#quick-start', 'rocket', T('第一次使用'), T('五分鐘走完登入、用交談生成第一張圖，再把它變成影片。'), T('新手'))}
      ${card('#lab', 'flask', T('想要更多控制'), T('到實驗室用 LoRA、ControlNet、IP-Adapter 精修畫面。'))}
      ${card('#admin', 'shield', T('管理團隊'), T('管理員六堂課：邀請成員、貼標籤、分配點數。'))}
    </div>

    <h2 id="h-tools">${T('創作工具')}</h2>
    <div class="grid">
      ${card('#chat', 'chat', T('交談'), T('用對話生成與編輯，最容易上手。'))}
      ${card('#image', 'image', T('圖片生成'), T('生成、放大、拓展、旋轉視角。'))}
      ${card('#video', 'video', T('影片生成'), T('圖片轉影片、運動軌跡、動作模仿。'))}
      ${card('#lab', 'flask', T('實驗室'), T('LoRA、ControlNet、IP-Adapter。'))}
      ${card('#music-3d', 'music', T('音樂與 3D'), T('歌曲、BGM、音效與 3D 模型。'))}
      ${card('#models', 'layers', T('模型指南'), T('依用途挑選圖片、影片、音樂模型。'))}
    </div>

    <div class="sec-head"><h2 id="h-recipes">${T('應用範例')}</h2><a href="#recipes">${T('看全部 →')}</a></div>
    <div class="grid">
      ${card('#pvc', 'sparkles', T('PVC 公仔風格'), T('把照片或角色變成公仔產品照。'))}
      ${card('#logo', 'sparkles', T('LOGO 創作'), T('用對話定義品牌色彩與風格。'))}
      ${card('#outfit', 'sparkles', T('人物角色換衣'), T('裁切、下指令，換上指定服裝。'))}
    </div>`,
  feedback: () => {
    const groups = {};
    ORDER.filter((k) => ARTICLES[k]).forEach((k) => { const g = PAGES[k].crumb.join(' / '); (groups[g] = groups[g] || []).push(k); });
    const opts = Object.entries(groups).map(([g, ks]) => `<optgroup label="${esc(g)}">${ks.map((k) => `<option value="${k}"${k === fbFrom ? ' selected' : ''}>${esc(PAGES[k].t)}</option>`).join('')}</optgroup>`).join('');
    return `${crumb('feedback')}<div class="cat-head"><span class="cat-icon">${ic('message')}</span><h1>${T('意見回饋')}</h1></div>
    <p class="lead">${T('照著教學做還是卡住、看完仍然不懂，或有讓說明中心更好的建議，都歡迎告訴我們。帳號、點數等需要即時處理的問題，請改用<a href="#contact">聯絡我們</a>。')}</p>
    <form class="fb-form" id="fbForm" novalidate>
      <fieldset class="fb-field"><legend>${T('回饋類型')}</legend>
        <div class="fb-types">${FB_TYPES.map(([v, t, d]) => `<label class="fb-type"><input type="radio" name="type" value="${v}"><span><b>${T(t)}</b><small>${T(d)}</small></span></label>`).join('')}</div>
      </fieldset>
      <label class="fb-field"><span class="fb-label">${T('相關頁面')}</span>
        <select name="page"><option value="">${T('整個網站／沒有特定頁面')}</option>${opts}</select></label>
      <label class="fb-field"><span class="fb-label">${T('內容')}</span>
        <textarea name="message" rows="6" maxlength="2000" placeholder="${esc(T(FB_HINT.other))}"></textarea>
        <small class="fb-count">0 / 2000</small></label>
      <label class="fb-field"><span class="fb-label">${T('聯絡方式')}<small>${T('選填，需要我們回覆時再填')}</small></span>
        <input name="contact" maxlength="120" autocomplete="email" placeholder="${T('E-mail 或 LINE ID')}"></label>
      <p class="fb-error" role="alert"></p>
      <button class="fb-submit" type="submit">${T('送出回饋')}</button>
    </form>`;
  },
};

function pager(id) {
  const i = ORDER.indexOf(id);
  if (i < 0) return '';
  const p = ORDER[i - 1], n = ORDER[i + 1];
  return `<nav class="pager" aria-label="${T('上一篇與下一篇')}">${p ? `<a href="#${p}"><small>${T('上一篇')}</small>${esc(PAGES[p].t)}</a>` : ''}${n ? `<a class="next" href="#${n}"><small>${T('下一篇')}</small>${esc(PAGES[n].t)}</a>` : ''}</nav>`;
}
const feedback = () => `<div class="feedback">${T('這篇有幫助嗎？')}<button type="button" aria-pressed="false" data-vote="up">${T('有幫助')}</button><button type="button" aria-pressed="false" data-vote="down">${T('還需要改進')}</button><span class="fb-thanks" role="status"></span></div>`;

// ---------------------------------------------------------
// 回饋：送到網站伺服器（server/server.js 的 /api/feedback），後台頁 admin.html 查看。
// GitHub Pages 預覽版沒有伺服器，改存在這台電腦的瀏覽器裡，後台頁也會讀出來。
// ---------------------------------------------------------
const FB_TYPES = [
  ['stuck', '照著做還是卡住', '操作時遇到問題，網站上找不到解法'],
  ['unclear', '看完還是不懂', '說明不夠清楚，或需要更多例子'],
  ['suggest', '建議改進', '想新增的主題、內容或功能'],
  ['other', '其他', '其他想告訴我們的事'],
];
const FB_HINT = {
  stuck: '例如：照「圖片生成影片」的步驟做，第 3 步找不到上傳按鈕，我的畫面和截圖不一樣。',
  unclear: '例如：看不懂 ControlNet 的權重要怎麼調，可以多舉幾個例子嗎？',
  suggest: '例如：希望每篇開頭都有一段操作影片。',
  other: '想說的都可以寫在這裡。',
};
const FB_LOCAL = 'ml-feedback-preview';
let fbFrom = '';   // 從文章底部「還需要改進」過來時，預先選好那一篇

function visitorId() {
  try {
    let v = localStorage.getItem('ml-vid');
    if (!v) { v = Math.random().toString(36).slice(2, 12); localStorage.setItem('ml-vid', v); }
    return v;
  } catch (e) { return ''; }
}
// 回傳 'server'（存到 Google 試算表或伺服器）、'local'（預覽版，存在這台電腦）或 'failed'
// 頁面標題一律送中文版的，後台才不會同一篇出現中英兩種名稱
async function sendFeedback(entry) {
  const zhTitle = entry.page ? (ZH_ARTICLES[entry.page] && ZH_ARTICLES[entry.page].t) || entry.pageTitle : '';
  entry = { ...entry, pageTitle: zhTitle, vid: visitorId(), lang: LANG };
  const google = window.SITE_CONFIG && window.SITE_CONFIG.googleScriptUrl;
  if (google) {
    try {
      // 不指定 content-type（預設 text/plain），Apps Script 才收得到（不會觸發跨網域預檢）
      const r = await fetch(google, { method: 'POST', body: JSON.stringify(entry) });
      return (await r.json()).ok ? 'server' : 'failed';
    } catch (e) { return 'failed'; }
  }
  try {
    const r = await fetch('api/feedback', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entry) });
    if (r.ok) return 'server';
    if (r.status !== 404 && r.status !== 405) return 'failed';   // 有伺服器但拒收（格式錯、太頻繁）
  } catch (e) { return 'failed'; }
  try {
    const list = JSON.parse(localStorage.getItem(FB_LOCAL) || '[]');
    list.push({ ...entry, id: 'local-' + Date.now(), at: new Date().toISOString() });
    localStorage.setItem(FB_LOCAL, JSON.stringify(list.slice(-200)));
    return 'local';
  } catch (e) { return 'failed'; }
}

// ---------------------------------------------------------
// 6. 路由、本頁目錄、互動
// ---------------------------------------------------------
function currentId() {
  let id = decodeURIComponent((location.hash || '#home').slice(1));
  if (ALIASES[id]) { id = ALIASES[id]; history.replaceState(null, '', '#' + id); }
  return PAGES[id] ? id : 'home';
}

function render() {
  const id = currentId();
  let body;
  if (VIEWS[id]) body = VIEWS[id]();
  else if (ARTICLES[id]) body = articleView(id);
  else if (CATS[id]) body = catView(id);
  else body = `${crumb(id)}<h1>${esc(PAGES[id].t)}</h1><p class="lead">${T('這篇內容整理中。')}</p>`;
  view.innerHTML = body + (id === 'home' ? '' : pager(id) + (CATS[id] || id === 'feedback' ? '' : feedback()));
  fbFrom = '';
  document.body.classList.toggle('is-home', id === 'home');

  side.querySelectorAll('[data-id]').forEach((a) => (a.dataset.id === id ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  side.querySelectorAll('.cat-row').forEach((r) => r.classList.remove('cur', 'in'));
  const cat = PAGES[id].cat;
  if (cat) {
    // 只展開目前所在的分類，其他分類收起來
    side.querySelectorAll('.nav-cat').forEach((c) => setOpen(c, c.dataset.cat === cat));
    const c = side.querySelector(`.nav-cat[data-cat="${cat}"]`);
    if (c) c.querySelector('.cat-row').classList.add(cat === id ? 'cur' : 'in');
  }
  const act = side.querySelector('[aria-current="page"]');
  if (act && getComputedStyle(side).display !== 'none') {
    const r = act.getBoundingClientRect(), s = side.getBoundingClientRect();
    if (r.top < s.top || r.bottom > s.bottom) side.scrollTop += r.top - s.top - s.height / 3;
  }

  buildToc();
  document.title = (id === 'home' ? '' : PAGES[id].t + (LANG === 'en' ? ' | ' : '｜')) + T('moonland.ai 說明中心');
  window.scrollTo(0, 0);
  closeDrawer();
}

function buildToc() {
  const hs = [...view.querySelectorAll('h2[id]')];
  toc.innerHTML = hs.length > 1
    ? `<div class="toc-label">${T('本頁目錄')}</div>` + hs.map((h) => `<a href="#" data-to="${h.id}">${esc(h.textContent)}</a>`).join('')
    : '';
  spy();
}
function spy() {
  const links = [...toc.querySelectorAll('a')];
  if (!links.length) return;
  let cur = links[0];
  links.forEach((a) => { const h = document.getElementById(a.dataset.to); if (h && h.getBoundingClientRect().top < 140) cur = a; });
  links.forEach((a) => a.classList.toggle('on', a === cur));
}
addEventListener('scroll', spy, { passive: true });

// 跳到錨點：上方的圖片載入後會把目標往下推，所以載入期間持續對齊
function jumpTo(el) {
  const above = [...view.querySelectorAll('img')].filter((i) => i.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
  above.forEach((i) => { i.loading = 'eager'; });
  el.scrollIntoView({ behavior: 'smooth' });
  let stop = false;
  const cancel = () => { stop = true; };
  ['wheel', 'touchstart', 'keydown'].forEach((t) => addEventListener(t, cancel, { once: true, passive: true }));
  const realign = (e) => { if (!stop && above.includes(e.target)) el.scrollIntoView({ behavior: 'auto' }); };
  view.addEventListener('load', realign, true);
  setTimeout(() => { stop = true; view.removeEventListener('load', realign, true); }, 5000);
}

// 本頁錨點、複製提示詞、回饋、放大圖片
document.addEventListener('click', async (e) => {
  const to = e.target.closest('a[data-to]');
  if (to) {
    e.preventDefault();
    const el = document.getElementById(to.dataset.to);
    if (el) {
      const d = el.closest('details');
      if (d) d.open = true;
      jumpTo(el);
    }
    return;
  }
  const cp = e.target.closest('.copy');
  if (cp) {
    const text = cp.parentElement.querySelector('pre').textContent;
    try { await navigator.clipboard.writeText(text); }
    catch (err) { const r = document.createRange(); r.selectNodeContents(cp.parentElement.querySelector('pre')); getSelection().removeAllRanges(); getSelection().addRange(r); }
    cp.classList.add('done'); cp.querySelector('span').textContent = T('已複製');
    setTimeout(() => { cp.classList.remove('done'); cp.querySelector('span').textContent = T('複製'); }, 1600);
    return;
  }
  const fb = e.target.closest('.feedback button');
  if (fb) {
    if (fb.getAttribute('aria-pressed') === 'true') return;
    fb.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    fb.setAttribute('aria-pressed', 'true');
    const id = currentId(), up = fb.dataset.vote === 'up';
    const msg = fb.parentElement.querySelector('.fb-thanks');
    msg.innerHTML = up ? T('謝謝你的回饋！') : `${T('謝謝！')}<a href="#feedback" data-fb-from="${id}">${T('告訴我們哪裡需要改進 →')}</a>`;
    if (await sendFeedback({ kind: 'vote', page: id, pageTitle: PAGES[id].t, value: fb.dataset.vote }) === 'failed') msg.textContent = T('送出失敗，請稍後再試。');
    return;
  }
  const from = e.target.closest('[data-fb-from]');
  if (from) { fbFrom = from.dataset.fbFrom; return; }
  const img = e.target.closest('img[data-zoom]');
  if (img) openZoom(img);
});

// 圖片無法載入時顯示提示
document.addEventListener('error', (e) => {
  const el = e.target;
  if (el.tagName === 'IMG' && el.closest('.fig') && !el.dataset.failed) {
    el.dataset.failed = '1';
    el.closest('.fig').classList.add('failed');
  }
}, true);

// 放大檢視
const zoom = document.getElementById('zoom');
function openZoom(img) {
  zoom.querySelector('img').src = img.currentSrc || img.src;
  zoom.querySelector('img').alt = img.alt;
  zoom.showModal();
}
zoom.addEventListener('click', () => zoom.close());

// ---------------------------------------------------------
// 目錄收合（桌機）與抽屜（手機）
// ---------------------------------------------------------
const navBtn = document.getElementById('navBtn');
const scrim = document.getElementById('scrim');
const mqMobile = matchMedia('(max-width: 900px)');
navBtn.innerHTML = ic('sidebar', 'ic d-only') + ic('menu', 'ic m-only');

function syncNavBtn() {
  const open = mqMobile.matches ? root.classList.contains('drawer-open') : !root.classList.contains('nav-collapsed');
  navBtn.setAttribute('aria-expanded', String(open));
  navBtn.setAttribute('aria-label', T(open ? '收合目錄' : '展開目錄'));
  navBtn.title = T(open ? '收合目錄' : '展開目錄');
}
function closeDrawer() { root.classList.remove('drawer-open'); syncNavBtn(); }
navBtn.addEventListener('click', () => {
  if (mqMobile.matches) {
    root.classList.toggle('drawer-open');
  } else {
    const collapsed = root.classList.toggle('nav-collapsed');
    try { localStorage.setItem('ml-nav', collapsed ? '1' : '0'); } catch (e) {}
  }
  syncNavBtn();
});
scrim.addEventListener('click', closeDrawer);
mqMobile.addEventListener('change', () => { root.classList.remove('drawer-open'); syncNavBtn(); });

// ---------------------------------------------------------
// 明暗模式
// ---------------------------------------------------------
const themeBtn = document.getElementById('themeBtn');
const sysLight = matchMedia('(prefers-color-scheme: light)');
const currentTheme = () => root.dataset.theme || (sysLight.matches ? 'light' : 'dark');
function paintThemeBtn() {
  const dark = currentTheme() === 'dark';
  themeBtn.innerHTML = ic(dark ? 'sun' : 'moon');
  themeBtn.setAttribute('aria-label', T(dark ? '切換到淺色模式' : '切換到深色模式'));
  themeBtn.title = T(dark ? '切換到淺色模式' : '切換到深色模式');
}
themeBtn.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('ml-theme', next); } catch (e) {}
  paintThemeBtn();
});
sysLight.addEventListener('change', paintThemeBtn);

// ---------------------------------------------------------
// 字體大小：標準／大／特大，記在這台裝置上
// ---------------------------------------------------------
const FS = [['標準', 16], ['大', 19], ['特大', 22]];
const fsBtn = document.getElementById('fsBtn');
const fsPop = document.createElement('div');
fsPop.className = 'fs-pop';
fsPop.hidden = true;
fsPop.setAttribute('role', 'dialog');
fsPop.setAttribute('aria-label', T('字體大小'));
fsPop.innerHTML = `<p class="fs-title">${T('字體大小')}</p><div class="fs-opts">${FS.map(([t, px], i) => `<button type="button" data-fs="${i}"><b style="font-size:${px}px">${T('字')}</b><small>${T(t)}</small></button>`).join('')}</div>`;
document.body.appendChild(fsPop);
const currentFs = () => +(root.dataset.fs || 0);
function paintFs() {
  fsPop.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.fs === currentFs())));
}
function toggleFs(open) {
  fsPop.hidden = !open;
  fsBtn.setAttribute('aria-expanded', String(open));
  if (open) { paintFs(); fsPop.querySelector('[aria-pressed="true"]').focus(); }
}
fsBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleFs(fsPop.hidden); });
fsPop.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-fs]');
  if (!b) return;
  const n = +b.dataset.fs;
  // 放大或縮小後，讓正在讀的那一段留在畫面上
  const anchorEl = [...view.querySelectorAll('h2, h3, p, li, .fig')].find((el) => el.getBoundingClientRect().bottom > 80);
  const before = anchorEl ? anchorEl.getBoundingClientRect().top : 0;
  if (n) root.dataset.fs = n; else delete root.dataset.fs;
  try { localStorage.setItem('ml-fs', n); } catch (err) {}
  if (anchorEl) window.scrollBy(0, anchorEl.getBoundingClientRect().top - before);
  paintFs();
});
document.addEventListener('click', (e) => { if (!fsPop.hidden && !fsPop.contains(e.target)) toggleFs(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !fsPop.hidden) { toggleFs(false); fsBtn.focus(); } });

// ---------------------------------------------------------
// 搜尋：標題、摘要與內文全文
// ---------------------------------------------------------
const dlg = document.getElementById('dlg');
const q = document.getElementById('q');
const results = document.getElementById('results');
let INDEX = null;
function buildIndex() {
  INDEX = Object.keys(PAGES).filter((k) => k !== 'home').map((k) => {
    const p = PAGES[k];
    const a = ARTICLES[k];
    const body = a ? plainText(a.body).replace(/\s+/g, ' ') : (CATS[k] && CATS[k].d) || '';
    return { k, t: p.t, path: p.crumb.join(' / '), d: (a && a.d) || (CATS[k] && CATS[k].d) || '', body, hayT: (p.t + ' ' + (p.n || '')).toLowerCase(), hay: (p.t + ' ' + p.crumb.join(' ') + ' ' + ((a && a.d) || '') + ' ' + body).toLowerCase() };
  });
}
function snippet(x, w) {
  const i = x.body.toLowerCase().indexOf(w);
  if (i < 0) return esc(x.d);
  const s = Math.max(0, i - 24);
  const piece = x.body.slice(s, i + w.length + 40);
  const j = piece.toLowerCase().indexOf(w);
  return (s > 0 ? '…' : '') + esc(piece.slice(0, j)) + '<mark>' + esc(piece.slice(j, j + w.length)) + '</mark>' + esc(piece.slice(j + w.length)) + '…';
}
let sel = 0;
function search() {
  const s = q.value.trim().toLowerCase();
  if (!s) { results.innerHTML = `<p>${T('輸入關鍵字，搜尋所有文章的標題與內文。')}</p>`; return; }
  const words = s.split(/\s+/);
  const r = INDEX
    .filter((x) => words.every((w) => x.hay.includes(w)))
    .map((x) => ({ x, score: words.reduce((n, w) => n + (x.hayT.includes(w) ? 10 : 0) + (x.d.toLowerCase().includes(w) ? 3 : 0), 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map((o) => o.x);
  sel = 0;
  results.innerHTML = r.length
    ? r.map((x, i) => `<a href="#${x.k}" role="option" class="${i ? '' : 'sel'}">${esc(x.t)}<small>${esc(x.path)}</small><span class="snip">${snippet(x, words[0])}</span></a>`).join('')
    : `<p>${T('找不到符合的文章，換個關鍵字試試。')}</p>`;
}
function moveSel(d) {
  const as = [...results.querySelectorAll('a')];
  if (!as.length) return;
  as[sel].classList.remove('sel');
  sel = (sel + d + as.length) % as.length;
  as[sel].classList.add('sel');
  as[sel].scrollIntoView({ block: 'nearest' });
}
function openSearch() { if (!INDEX) buildIndex(); q.value = ''; search(); dlg.showModal(); q.focus(); }
document.getElementById('searchBtn').addEventListener('click', openSearch);
document.getElementById('dlgClose').addEventListener('click', () => dlg.close());
document.addEventListener('click', (e) => { if (e.target.closest('[data-open-search]')) openSearch(); });
q.addEventListener('input', search);
q.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
  else if (e.key === 'Enter') {
    const a = results.querySelectorAll('a')[sel];
    if (a) { location.hash = a.getAttribute('href'); dlg.close(); }
  }
});
results.addEventListener('click', (e) => { if (e.target.closest('a')) dlg.close(); });
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape') closeDrawer();
});

// ---------------------------------------------------------
// 意見回饋表單
// ---------------------------------------------------------
view.addEventListener('change', (e) => {
  const f = e.target.form;
  if (f && f.id === 'fbForm' && e.target.name === 'type') f.message.placeholder = T(FB_HINT[e.target.value]);
});
view.addEventListener('input', (e) => {
  if (e.target.name === 'message' && e.target.form && e.target.form.id === 'fbForm') {
    e.target.form.querySelector('.fb-count').textContent = `${e.target.value.length} / 2000`;
  }
});
view.addEventListener('submit', async (e) => {
  const f = e.target;
  if (f.id !== 'fbForm') return;
  e.preventDefault();
  const err = f.querySelector('.fb-error');
  const type = f.type.value, message = f.message.value.trim();
  if (!type) { err.textContent = T('請選擇回饋類型。'); f.querySelector('input[name="type"]').focus(); return; }
  if (!message) { err.textContent = T('請寫下回饋內容。'); f.message.focus(); return; }
  err.textContent = '';
  const btn = f.querySelector('.fb-submit');
  btn.disabled = true; btn.textContent = T('送出中…');
  const page = f.page.value;
  const res = await sendFeedback({ kind: 'note', type, page, pageTitle: page ? PAGES[page].t : '', message, contact: f.contact.value.trim() });
  if (res === 'failed') {
    err.textContent = T('送出失敗，請稍後再試，或改用「聯絡我們」的管道。');
    btn.disabled = false; btn.textContent = T('送出回饋');
    return;
  }
  f.outerHTML = `<div class="fb-done" role="status" tabindex="-1">${ic('check')}<div><b>${T('已收到你的回饋，謝謝！')}</b>
    <p>${T('我們會參考你的意見持續改進說明中心。')}${f.contact.value.trim() ? T('需要回覆時會依你留的聯絡方式聯繫。') : ''}</p>
    ${res === 'local' ? `<p class="fb-preview">${T('目前是預覽版，回饋只存在這台電腦的瀏覽器，可以到<a href="admin.html">後台頁</a>查看。')}</p>` : ''}
    <button type="button" class="fb-again">${T('再寫一則')}</button></div></div>`;
  view.querySelector('.fb-done').focus();
});
view.addEventListener('click', (e) => { if (e.target.closest('.fb-again')) render(); });

// ---------------------------------------------------------
// 回到頂端
// ---------------------------------------------------------
const toTop = document.getElementById('toTop');
toTop.innerHTML = ic('up');
const syncToTop = () => toTop.classList.toggle('show', scrollY > 600);
addEventListener('scroll', syncToTop, { passive: true });
toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  view.focus({ preventScroll: true });
});

// ---------------------------------------------------------
// 語言切換：記在這台裝置上，並把 ?lang= 寫進網址（複製網址給別人也是同一種語言），再重新載入
// ---------------------------------------------------------
const langBtn = document.getElementById('langBtn');
langBtn.textContent = LANG === 'en' ? '中文' : 'EN';
langBtn.lang = LANG === 'en' ? 'zh-Hant' : 'en';
langBtn.title = LANG === 'en' ? '切換為中文' : 'Switch to English';
langBtn.setAttribute('aria-label', langBtn.title);
langBtn.dataset.switchLang = '';
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-switch-lang]')) return;
  const next = LANG === 'en' ? 'zh' : 'en';
  try { localStorage.setItem('ml-lang', next); } catch (err) {}
  const u = new URL(location.href);
  u.searchParams.set('lang', next);
  location.href = u.href;
});

// index.html 裡寫死的文字：有 data-t 的換內文，aria-label／title／placeholder 有對照就換
if (LANG === 'en') {
  document.querySelectorAll('[data-t]').forEach((el) => { el.innerHTML = T(el.innerHTML.trim()); });
  document.querySelectorAll('[aria-label], [title], [placeholder]').forEach((el) => ['aria-label', 'title', 'placeholder'].forEach((at) => {
    if (el.hasAttribute(at)) el.setAttribute(at, T(el.getAttribute(at)));
  }));
  const md = document.querySelector('meta[name="description"]');
  if (md) md.content = T(md.content);
}

// 啟動
document.querySelectorAll('[data-icon]').forEach((el) => el.insertAdjacentHTML('afterbegin', ic(el.dataset.icon)));
paintThemeBtn();
syncNavBtn();
addEventListener('hashchange', render);
render();
