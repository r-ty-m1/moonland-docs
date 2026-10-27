// =========================================================
// moonland.ai 說明中心
// - SECTIONS：左側目錄與分類（改分類、改順序都在這裡）
// - 文章內容在 data/*.js（window.ARTICLES），寫法見 README.md
// - 圖片、影片、音訊對照表在 data/media.js（window.MEDIA）
// =========================================================

const NOTION_BASE = 'https://phrygian-friction-260.notion.site';

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
};
const ic = (name, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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

const ARTICLES = window.ARTICLES || {};
const MEDIA = window.MEDIA || {};

// 由 SECTIONS 建立頁面索引
const PAGES = { home: { t: '首頁', crumb: [] } };
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
    const t = (ARTICLES[r.id] && ARTICLES[r.id].t) || r.id;
    PAGES[r.id] = { t, n: r.n || t, tag: r.tag, crumb: [sec.label] };
    r.t = t;
    ORDER.push(r.id);
  }
}));

// ---------------------------------------------------------
// 2. 媒體網址：透過 Notion 公開頁面的代理讀取
// ---------------------------------------------------------
const dash = (s) => s.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
function mediaUrl(n, kind) {
  const e = MEDIA[n];
  if (!e) return '';
  const [block, file, name] = e.split('|');
  const src = encodeURIComponent(`attachment:${dash(file)}:${name || 'image.png'}`);
  return kind === 'i'
    ? `${NOTION_BASE}/image/${src}?table=block&id=${dash(block)}&width=1600&cache=v2`
    : `${NOTION_BASE}/signed/${src}?table=block&id=${dash(block)}`;
}

// ---------------------------------------------------------
// 3. 文章標記語法 → HTML（語法說明見 README.md）
// ---------------------------------------------------------
function inline(s) {
  let h = esc(s);
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, href) => {
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
    const url = mediaUrl(n, k);
    const capHtml = cap ? `<figcaption>${inline(cap)}</figcaption>` : '';
    if (!url) return `<div class="media-missing">找不到媒體 #${n}</div>`;
    if (k === 'i') return `<figure class="fig"><img src="${url}" alt="${esc(cap || '')}" loading="lazy" decoding="async" data-zoom>${capHtml}</figure>`;
    if (k === 'v') return `<figure class="fig"><video src="${url}" controls preload="metadata" playsinline></video>${capHtml}</figure>`;
    return `<figure class="fig audio"><audio src="${url}" controls preload="none"></audio>${capHtml}</figure>`;
  }
  m = t.match(/^\[embed\s+(\S+)(?:\s+(.+))?\]$/);
  if (m) return `<figure class="fig embed"><iframe src="${esc(m[1])}" loading="lazy" title="${esc(m[2] || '前後比較')}"></iframe>${m[2] ? `<figcaption>${inline(m[2])}</figcaption>` : ''}</figure>`;
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
    return `<div class="row" style="--n:${cells.length}">${cells.map((c) => `<div class="cell">${blocks(c.lines)}</div>`).join('')}</div>`;
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
      out += `<div class="prompt"><pre>${esc(buf.join('\n'))}</pre><button type="button" class="copy" aria-label="複製提示詞">${ic('copy')}<span>複製</span></button></div>`;
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
      out += `<div class="tbl"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
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
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
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
      <button class="cat-toggle" type="button" aria-expanded="false" aria-label="展開${esc(r.t)}">${ic('chev', 'ic chev')}</button>
    </div>
    <div class="nav-children"><div class="nav-children-in">${kids}</div></div>
  </div>`;
}

side.innerHTML =
  `<a class="nav-row" href="#home" data-id="home">${ic('home')}<span class="lbl">首頁</span></a>` +
  SECTIONS.map((sec) => `<div class="nav-sec"><div class="nav-sec-label">${sec.label}</div>${sec.rows.map(navRow).join('')}</div>`).join('') +
  `<div class="side-foot"><b>找不到答案？</b>寫信到 support@moonshine.ai，或<a href="https://lin.ee/PpA769D" target="_blank" rel="noopener">加入 LINE 社群</a>詢問。</div>`;

function setOpen(cat, open) {
  cat.classList.toggle('open', open);
  const b = cat.querySelector('.cat-toggle');
  b.setAttribute('aria-expanded', String(open));
  b.setAttribute('aria-label', (open ? '收合' : '展開') + cat.querySelector('.lbl').textContent);
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
  return `<nav class="crumb" aria-label="目前位置">${parts.join('<span class="sep">/</span>')}</nav>`;
}
const card = (href, icon, title, desc, tag) =>
  `<a class="card" href="${href}"><span class="tile">${ic(icon)}</span><b>${esc(title)}${tagHtml(tag)}</b><span class="d">${esc(desc)}</span></a>`;

function metaHtml(a) {
  const chips = [];
  if (a.level) chips.push(`<span class="chip${a.level === '新手' ? ' brand' : ''}">${esc(a.level)}</span>`);
  if (a.tool) chips.push(`<span class="chip">使用${esc(a.tool)}</span>`);
  (a.models || []).forEach((m) => chips.push(`<span class="chip">${esc(m)}</span>`));
  if (a.minutes) chips.push(`<span class="chip">${ic('clock', 'ic sm')}約 ${a.minutes} 分鐘</span>`);
  return chips.length ? `<div class="meta">${chips.join('')}</div>` : '';
}

function articleList(c) {
  return c.groups.map((g, i) => `<h2 id="g${i}">${esc(g.g || '這個分類的文章')}</h2><div class="list">` +
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
  return `${crumb(id)}${head}${metaHtml(a)}${a.d ? `<p class="lead">${esc(a.d)}</p>` : ''}
    <div class="prose">${renderMarkup(a.body)}</div>
    ${c ? articleList(c) : ''}
    ${a.src ? `<p class="source">${ic('ext', 'ic sm')} 本文整理自 <a href="${NOTION_BASE}/${a.src}" target="_blank" rel="noopener">Notion 原文</a></p>` : ''}`;
}

function catView(id) {
  const c = CATS[id];
  return `${crumb(id)}<div class="cat-head"><span class="cat-icon">${ic(c.icon)}</span><h1>${esc(c.t)}</h1>${tagHtml(c.tag)}</div>
    ${c.d ? `<p class="lead">${esc(c.d)}</p>` : ''}${articleList(c)}`;
}

const VIEWS = {
  home: () => `
    <section class="hero">
      <div class="eyebrow">MOONLAND.AI 說明中心</div>
      <h1><span class="seg">從第一張圖到團隊管理，</span><span class="seg"><em>所有操作</em>都查得到</span></h1>
      <p>交談、圖片、影片、音樂、實驗室與團隊後台的官方教學。不知道從哪裡開始？直接搜尋你想做的事。</p>
      <button class="hero-search" type="button" data-open-search>${ic('search')}<span class="sp-text">例如：換衣服、頭尾幀、ControlNet、點數</span><kbd>Ctrl K</kbd></button>
      <div class="popular">熱門：<a href="#chat-prompts">提示詞寫法</a><a href="#outfit">人物換衣</a><a href="#v-i2v">圖片生成影片</a><a href="#v-mimic">動作模仿</a><a href="#credits">點數怎麼算</a></div>
    </section>

    <h2 id="h-path">依你的程度開始</h2>
    <div class="grid">
      ${card('#quick-start', 'rocket', '第一次使用', '五分鐘走完登入、用交談生成第一張圖，再把它變成影片。', '新手')}
      ${card('#lab', 'flask', '想要更多控制', '到實驗室用 LoRA、ControlNet、IP-Adapter 精修畫面。')}
      ${card('#admin', 'shield', '管理團隊', '管理員六堂課：邀請成員、貼標籤、分配點數。')}
    </div>

    <h2 id="h-tools">創作工具</h2>
    <div class="grid">
      ${card('#chat', 'chat', '交談', '用對話生成與編輯，最容易上手。')}
      ${card('#image', 'image', '圖片生成', '生成、放大、拓展、旋轉視角。')}
      ${card('#video', 'video', '影片生成', '圖片轉影片、運動軌跡、動作模仿。')}
      ${card('#lab', 'flask', '實驗室', 'LoRA、ControlNet、IP-Adapter。')}
      ${card('#music-3d', 'music', '音樂與 3D', '歌曲、BGM、音效與 3D 模型。')}
      ${card('#models', 'layers', '模型指南', '依用途挑選圖片、影片、音樂模型。')}
    </div>

    <div class="sec-head"><h2 id="h-recipes">應用範例</h2><a href="#recipes">看全部 →</a></div>
    <div class="grid">
      ${card('#pvc', 'sparkles', 'PVC 公仔風格', '把照片或角色變成公仔產品照。')}
      ${card('#logo', 'sparkles', 'LOGO 創作', '用對話定義品牌色彩與風格。')}
      ${card('#outfit', 'sparkles', '人物角色換衣', '裁切、下指令，換上指定服裝。')}
    </div>`,
};

function pager(id) {
  const i = ORDER.indexOf(id);
  if (i < 0) return '';
  const p = ORDER[i - 1], n = ORDER[i + 1];
  return `<nav class="pager" aria-label="上一篇與下一篇">${p ? `<a href="#${p}"><small>上一篇</small>${esc(PAGES[p].t)}</a>` : ''}${n ? `<a class="next" href="#${n}"><small>下一篇</small>${esc(PAGES[n].t)}</a>` : ''}</nav>`;
}
const feedback = () => `<div class="feedback">這篇有幫助嗎？<button type="button" aria-pressed="false">有幫助</button><button type="button" aria-pressed="false">還需要改進</button></div>`;

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
  else body = `${crumb(id)}<h1>${esc(PAGES[id].t)}</h1><p class="lead">這篇內容整理中。</p>`;
  view.innerHTML = body + (id === 'home' ? '' : pager(id) + (CATS[id] ? '' : feedback()));
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
  document.title = (id === 'home' ? '' : PAGES[id].t + '｜') + 'moonland.ai 說明中心';
  window.scrollTo(0, 0);
  closeDrawer();
}

function buildToc() {
  const hs = [...view.querySelectorAll('h2[id]')];
  toc.innerHTML = hs.length > 1
    ? `<div class="toc-label">本頁目錄</div>` + hs.map((h) => `<a href="#" data-to="${h.id}">${esc(h.textContent)}</a>`).join('')
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

// 本頁錨點、複製提示詞、回饋、放大圖片
document.addEventListener('click', async (e) => {
  const to = e.target.closest('a[data-to]');
  if (to) {
    e.preventDefault();
    const el = document.getElementById(to.dataset.to);
    if (el) {
      const d = el.closest('details');
      if (d) d.open = true;
      el.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }
  const cp = e.target.closest('.copy');
  if (cp) {
    const text = cp.parentElement.querySelector('pre').textContent;
    try { await navigator.clipboard.writeText(text); }
    catch (err) { const r = document.createRange(); r.selectNodeContents(cp.parentElement.querySelector('pre')); getSelection().removeAllRanges(); getSelection().addRange(r); }
    cp.classList.add('done'); cp.querySelector('span').textContent = '已複製';
    setTimeout(() => { cp.classList.remove('done'); cp.querySelector('span').textContent = '複製'; }, 1600);
    return;
  }
  const fb = e.target.closest('.feedback button');
  if (fb) {
    fb.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    fb.setAttribute('aria-pressed', 'true');
    return;
  }
  const img = e.target.closest('img[data-zoom]');
  if (img) openZoom(img);
});

// 圖片無法載入時顯示提示
document.addEventListener('error', (e) => {
  const el = e.target;
  // 小圖用大尺寸讀取有時會失敗：依序改用 800 寬、原始尺寸重試
  if (el.tagName === 'IMG' && el.src.includes(NOTION_BASE)) {
    const tries = +(el.dataset.retried || 0);
    if (tries === 0) { el.dataset.retried = '1'; el.src = el.src.replace(/&width=\d+/, '&width=800'); return; }
    if (tries === 1) { el.dataset.retried = '2'; el.src = el.src.replace(/&width=\d+&cache=v2/, ''); return; }
  }
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
  navBtn.setAttribute('aria-label', open ? '收合目錄' : '展開目錄');
  navBtn.title = open ? '收合目錄' : '展開目錄';
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
  themeBtn.setAttribute('aria-label', dark ? '切換到淺色模式' : '切換到深色模式');
  themeBtn.title = dark ? '切換到淺色模式' : '切換到深色模式';
}
themeBtn.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('ml-theme', next); } catch (e) {}
  paintThemeBtn();
});
sysLight.addEventListener('change', paintThemeBtn);

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
  if (!s) { results.innerHTML = '<p>輸入關鍵字，搜尋所有文章的標題與內文。</p>'; return; }
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
    : '<p>找不到符合的文章，換個關鍵字試試。</p>';
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

// 啟動
document.querySelectorAll('[data-icon]').forEach((el) => el.insertAdjacentHTML('afterbegin', ic(el.dataset.icon)));
paintThemeBtn();
syncNavBtn();
addEventListener('hashchange', render);
render();
