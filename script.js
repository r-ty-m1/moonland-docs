// =========================================================
// moonland.ai 說明中心
// - 共用的圖示、T()、文章標記語法 → HTML 在 markup.js
// - 目錄與分類在 data/sections.js（window.SECTIONS）
// - 文章內容在 data/*.js（window.ARTICLES），寫法見 README.md
// - 圖片、影片、音訊對照表在 data/media.js（window.MEDIA）
// =========================================================


// ---------------------------------------------------------
// 1. 網站結構（data/sections.js）
// ---------------------------------------------------------
const SECTIONS = window.SECTIONS;

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
  return `${crumb(id)}${head}${metaHtml(a)}${a.d ? `<p class="lead">${esc(a.d)}</p>` : ''}
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
  entry = { ...entry, vid: visitorId() };
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
  document.title = (id === 'home' ? '' : PAGES[id].t + '｜') + T('moonland.ai 說明中心');
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

// 啟動
document.querySelectorAll('[data-icon]').forEach((el) => el.insertAdjacentHTML('afterbegin', ic(el.dataset.icon)));
paintThemeBtn();
syncNavBtn();
addEventListener('hashchange', render);
render();
