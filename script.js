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
  'm-img': 'm-choose', 'm-imgc': 'm-image', 'm-vid': 'm-video', 'm-credit': 'models', 'credit-music-3d': 'credit-3d', pricing: 'credits',
  'a-login': 'team-login', 'a-trial': 'trial-login', 'a-projects': 'projects', 'a-admin': 'admin',
  'a-invite': 'admin-2', 'a-tags': 'admin-3', 'a-credits': 'admin-4',
  'a-1': 'admin-1', 'a-2': 'admin-2', 'a-3': 'admin-3', 'a-4': 'admin-4', 'a-5': 'admin-5', 'a-6': 'admin-6',
};

// 英文版（2026-11-23 加回）：公開的英文（content.js 的 ARTICLES_EN）蓋過中文的標題、摘要與內文；
// 等級、分鐘數、圖片等沿用中文版。還沒有英文（或英文還是草稿）的頁面顯示中文，頁面上會提示
// 大分類與小標用編輯後台填的英文名稱（SECTIONS 的 en），沒填就查 data/en/ui.js 的對照
// 舊瀏覽器（Chrome 73、Safari 12.1 以前）沒有 Object.fromEntries
if (!Object.fromEntries) Object.fromEntries = (list) => { const o = {}; for (const [k, v] of list) o[k] = v; return o; };
const ZH_ARTICLES = window.ARTICLES || {};
const EN_ARTICLES = window.ARTICLES_EN || {};
const ARTICLES = LANG === 'en'
  ? Object.fromEntries(Object.entries(ZH_ARTICLES).map(([k, a]) => [k, EN_ARTICLES[k] && EN_ARTICLES[k].body ? { ...a, ...EN_ARTICLES[k] } : { ...a, untranslated: true }]))
  : ZH_ARTICLES;
if (LANG === 'en') {
  SECTIONS.forEach((sec) => {
    sec.label = sec.en || T(sec.label);
    sec.rows.forEach((r) => {
      const e = EN_ARTICLES[r.id];
      if (r.t) r.t = (e && e.t) || T(r.t);
      if (e && e.d && r.d) r.d = e.d;
      if (r.n) r.n = (e && (e.n || e.t)) || r.n;
      (r.groups || []).forEach((g) => {
        g.g = g.en || T(g.g);
        g.items.forEach((it) => { const x = EN_ARTICLES[it[0]]; if (x) it[1] = x.n || x.t; });
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
// 體驗帳號專區（2026-11-24）：不在 SECTIONS（編輯後台管不到），config.js 填了 trialScriptUrl 才出現
const TRIAL_URL = (window.SITE_CONFIG && window.SITE_CONFIG.trialScriptUrl) || '';
if (TRIAL_URL) PAGES.trial = { t: T('領取體驗帳號'), n: T('領取體驗帳號'), crumb: [] };


// ---------------------------------------------------------
// 4. 左側目錄
// ---------------------------------------------------------
const root = document.documentElement;
const side = document.getElementById('side');
const view = document.getElementById('view');
// 「意見回饋」與「聯絡我們」表單的送出最先掛上（2026-11-18）：後面的功能在某些瀏覽器出錯時，
// 送出程式才不會跟著沒掛上，否則表單會變成整頁重新載入、跳回頂部，回饋也沒送出
view.addEventListener('submit', (e) => {
  const id = e.target && e.target.id;
  if (id !== 'fbForm' && id !== 'mailForm' && id !== 'trialForm') return;
  e.preventDefault();
  Promise.resolve().then(() => ({ fbForm: onFeedbackSubmit, mailForm: onMailSubmit, trialForm: onTrialSubmit })[id](e)).catch((err) => {
    console.error('表單送出失敗', err);
    const msg = e.target.querySelector && e.target.querySelector('.fb-error');
    if (msg) msg.textContent = T('送出失敗，請重新整理頁面再試，或改用「聯絡我們」的管道。');
  });
});
// 舊版 Safari（iOS 13 以前）的 matchMedia 沒有 addEventListener
const onMediaChange = (mq, fn) => (mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn));
const toc = document.getElementById('toc');
// 窄螢幕看不到右側的本頁目錄，改成右下角的按鈕，點了展開清單
const tocBtn = document.getElementById('tocBtn');
function toggleToc(open) {
  document.body.classList.toggle('toc-open', open);
  tocBtn.setAttribute('aria-expanded', open);
  if (open) { const on = toc.querySelector('a.on') || toc.querySelector('a'); if (on) on.focus({ preventScroll: true }); }
}
// 「付費」（登月幣）用紫色，和一般標籤（新手等）分開
const PAID = '付費';
const tagHtml = (tag) => (tag ? `<span class="tag${tag === PAID ? ' paid' : ''}">${esc(T(tag))}</span>` : '');

function navRow(r) {
  if (!r.groups) {
    return `<a class="nav-row" href="#${r.id}" data-id="${r.id}">${ic(r.icon)}<span class="lbl">${esc(PAGES[r.id].n)}</span>${tagHtml(r.tag)}</a>`;
  }
  const many = r.groups.length > 1;
  const kids = r.groups.map((g) =>
    (many && g.g ? `<div class="sub-label${g.items.some((x) => x[2] === PAID) ? ' paid' : ''}">${esc(g.g)}</div>` : '') +
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
  (TRIAL_URL ? `<a class="nav-row" href="#trial" data-id="trial">${ic('key')}<span class="lbl">${T('領取體驗帳號')}</span></a>` : '') +
  SECTIONS.map((sec) => `<div class="nav-sec"><div class="nav-sec-label">${sec.label}</div>${sec.rows.map(navRow).join('')}</div>`).join('') +
  // 手機上頂部列放不下語言按鈕，目錄最下面也放一個
  `<button class="nav-row lang-row" type="button" data-switch-lang lang="${LANG === 'en' ? 'zh-Hant' : 'en'}">${ic('globe')}<span class="lbl">${LANG === 'en' ? '中文' : 'English'}</span></button>` +
  `<div class="side-foot">${T('<b>找不到答案？</b>寫信到 support@moonland.ai，或來電 <a href="tel:+886227853069">02-2785-3069</a> 詢問。')}</div>`;

function setOpen(cat, open) {
  cat.classList.toggle('open', open);
  const b = cat.querySelector('.cat-toggle');
  b.setAttribute('aria-expanded', String(open));
  b.setAttribute('aria-label', T(open ? '收合{x}' : '展開{x}', { x: cat.querySelector('.lbl').textContent }));
}
side.addEventListener('click', (e) => {
  const b = e.target.closest('.cat-toggle');
  if (b) { const c = b.closest('.nav-cat'); setOpen(c, !c.classList.contains('open')); return; }
  // 整條分類列（圖示、文字）也能收合：已展開時點一下就收起來，不換頁；
  // 收起後又點同一個分類（網址沒變，不會重新整理頁面），直接展開
  const link = e.target.closest('.cat-link');
  if (!link) return;
  const c = link.closest('.nav-cat');
  if (c.classList.contains('open')) { e.preventDefault(); setOpen(c, false); }
  else if (location.hash === link.getAttribute('href')) { e.preventDefault(); setOpen(c, true); }
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
// 首頁卡片的縮圖：編輯後台填的「首頁縮圖」優先，沒填用 markup.js 的 HOME_THUMBS；找不到圖就只放圖示
function thumbOf(id) {
  const n = (ARTICLES[id] && ARTICLES[id].thumb) || (CATS[id] && CATS[id].thumb) || HOME_THUMBS[id];
  return n && mediaUrl(n) ? mediaUrl(n) : '';
}
const card = (href, icon, title, desc, tag) => {
  const src = thumbOf(href.slice(1));
  return `<a class="card${src ? ' has-thumb' : ''}" href="${href}">${src ? `<span class="thumb"><img src="${src}" alt="" loading="lazy" decoding="async"></span>` : ''}<span class="card-t"><span class="tile">${ic(icon)}</span><b>${esc(title)}${tagHtml(tag)}</b></span><span class="d">${esc(desc)}</span></a>`;
};

function metaHtml(a) {
  const chips = [];
  if (a.level) chips.push(`<span class="chip${a.level === '新手' ? ' brand' : ''}">${esc(T(a.level))}</span>`);
  if (a.tool) chips.push(`<span class="chip">${esc(T('使用{x}', { x: T(a.tool) }))}</span>`);
  (a.models || []).forEach((m) => chips.push(`<span class="chip">${esc(m)}</span>`));
  if (a.minutes) chips.push(`<span class="chip">${ic('clock', 'ic sm')}${T('約 {n} 分鐘', { n: a.minutes })}</span>`);
  return chips.length ? `<div class="meta">${chips.join('')}</div>` : '';
}

function articleList(c) {
  return c.groups.map((g, i) => `<h2 id="g${i}">${esc(g.g || T('這個分類的文章'))}${g.items.some((x) => x[2] === PAID) ? ` <span class="chip paid">${T(PAID)}</span>` : ''}</h2><div class="list">` +
    g.items.map(([aid, n, tag]) => {
      const a = ARTICLES[aid] || {};
      return `<a class="list-row" href="#${aid}"><span class="list-t"><b>${esc(a.t || n)}</b>${a.d ? `<small>${esc(a.d)}</small>` : ''}</span>${tag ? `<span class="chip ${tag === PAID ? 'paid' : 'brand'}">${esc(T(tag))}</span>` : ''}${ic('chev', 'ic chev')}</a>`;
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
    <div class="prose"${a.untranslated ? ' lang="zh-Hant-TW"' : ''}>${renderMarkup(a.body)}</div>
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
      <fieldset class="fb-field"><legend>${T('回饋類型')}<small>${T('請選一個')}</small></legend>
        <div class="fb-types">${FB_TYPES.map(([v, t, d]) => `<label class="fb-type"><input type="radio" name="type" value="${v}"${v === 'unclear' && fbFrom ? ' checked' : ''}><span><b>${T(t)}</b><small>${T(d)}</small></span></label>`).join('')}</div>
        <p class="fb-error" data-for="type" role="alert"></p>
      </fieldset>
      <label class="fb-field"><span class="fb-label">${T('相關頁面')}</span>
        <select name="page"><option value="">${T('整個網站／沒有特定頁面')}</option>${opts}</select></label>
      <label class="fb-field"><span class="fb-label">${T('內容')}</span>
        <textarea name="message" rows="6" maxlength="2000" placeholder="${esc(T(FB_HINT[fbFrom ? 'unclear' : 'other']))}"></textarea>
        <small class="fb-count">0 / 2000</small>
        <p class="fb-error" data-for="message" role="alert"></p></label>
      <label class="fb-field"><span class="fb-label">${T('聯絡方式')}<small>${T('選填，需要我們回覆時再填')}</small></span>
        <input name="contact" maxlength="120" autocomplete="email" placeholder="${T('E-mail 或 LINE ID')}"></label>
      <p class="fb-error" role="alert"></p>
      <button class="fb-submit" type="submit">${T('送出回饋')}</button>
    </form>`;
  },
  trial: () => `<div class="cat-head"><span class="cat-icon">${ic('key')}</span><h1>${T('領取體驗帳號')}</h1></div>
    <p class="lead">${T('輸入課程上拿到的課程代號，就能領到一組 moonland.ai 一次性體驗帳號。')}</p>
    <form class="fb-form trial-form" id="trialForm" novalidate>
      <label class="fb-field"><span class="fb-label">${T('課程代號')}</span>
        <input name="course" maxlength="20" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="${T('例如：K7M2QX')}"></label>
      <p class="fb-error" role="alert"></p>
      <button class="fb-submit" type="submit">${T('領取帳號')}</button>
    </form>
    <div id="trialOut">${trialSaved().map(trialCard).join('')}</div>`,
};

// ---------------------------------------------------------
// 體驗帳號：課程代號送到「體驗帳號」試算表的 Apps Script（trial-apps-script/Code.gs），回傳一組還沒人領的帳號。
// 同一個瀏覽器在同一個課程只會拿到同一組（用 visitorId 認），領過的存在這台電腦，下次打開還看得到。
// 不經過公司網站（靜態版也能用）。
// ---------------------------------------------------------
const TRIAL_LOCAL = 'ml-trial';
const TRIAL_LOGIN = 'https://moonland.ai/';
const TRIAL_ERR = {
  notfound: '找不到這個課程代號，請確認有沒有打錯。',
  paused: '這個課程目前暫停發放，請洽講師。',
  ended: '這個課程的體驗帳號已經結束發放。',
  empty: '這個課程的帳號已經發完了，請洽講師。',
  busy: '嘗試太多次了，請過幾分鐘再試。',
  bad: '送出的資料不正確，請重新整理頁面再試一次。',
  server: '體驗帳號系統出了問題，請洽講師。',
};
function trialSaved() {
  try {
    const now = Date.now();
    return (JSON.parse(localStorage.getItem(TRIAL_LOCAL) || '[]') || []).filter((x) => x && x.account && new Date(x.end).getTime() > now);
  } catch (e) { return []; }
}
function trialSave(r) {
  try {
    const list = trialSaved().filter((x) => x.course !== r.course);
    list.unshift(r);
    localStorage.setItem(TRIAL_LOCAL, JSON.stringify(list.slice(0, 10)));
  } catch (e) { /* 無痕模式等存不了：這次畫面上還是看得到 */ }
}
function trialTime(s) {
  const d = new Date(s);
  if (isNaN(d)) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function trialStartMsg(s) {
  const d = new Date(s);
  if (!s || isNaN(d)) return T('這個課程還沒開始發放，請在上課時再試一次。');
  const p = (n) => String(n).padStart(2, '0');
  return T('這個課程從 {t} 開始發放。', { t: `${d.getMonth() + 1}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}` });
}
function trialCard(r) {
  return `<section class="trial-card" tabindex="-1" data-trial="${esc(JSON.stringify(r))}">
    <div class="trial-k">${T('你的體驗帳號')}<small>${T('課程代號 {c}', { c: esc(r.course) })}</small></div>
    <div class="trial-acc"><code>${esc(r.account)}</code><button type="button" class="trial-copy" data-copy="${esc(r.account)}">${ic('copy')}<span>${T('複製帳號')}</span></button></div>
    <ul class="trial-meta">
      ${r.points ? `<li>${T('每日 {n} 點（每日點數不累加，00:00 刷新）', { n: Number(r.points).toLocaleString('en-US') })}</li>` : ''}
      <li>${T('可以使用：{a} ～ {b}', { a: trialTime(r.start), b: trialTime(r.end) })}</li>
    </ul>
    <a class="fb-submit trial-go" href="${TRIAL_LOGIN}" target="_blank" rel="noopener">${T('前往 moonland.ai 登入')}${ic('ext')}</a>
    <div class="trial-steps">
      <div class="trial-steps-l">
        <ol>
          <li>${T('按「複製帳號」，再按「前往 moonland.ai 登入」。')}</li>
          <li>${T('在登入畫面選「一次性體驗帳號登入」。')}</li>
          <li>${T('貼上帳號，登入。')}</li>
        </ol>
        <button type="button" class="trial-copy trial-shot">${ic('image')}<span>${T('儲存成圖片')}</span></button>
      </div>
      <img src="assets/trial-guide.webp" width="564" height="723" alt="${T('登入畫面：選「一次性體驗帳號登入」')}" loading="lazy">
    </div>
    <div class="callout warn">${T('一組帳號同時只能一個人使用：別人用同一組登入，會把你登出。請不要把帳號給別人。')}</div>
  </section>`;
}
// 「儲存成圖片」（2026-11-24 使用者要求）：把帳號卡片畫成 PNG，學員可以存到手機或電腦，之後找得回帳號。
// 用 canvas 自己畫（不靠外部程式庫、不連外部網站）；顏色跟著目前的明暗模式。
// 手機上用分享選單（可以「儲存影像」），電腦上直接下載。卡片一出現就先畫好，按下去才來得及打開分享選單。
const TRIAL_SHOTS = {};
function trialShot(r) {
  const key = r.account + '|' + getComputedStyle(document.body).backgroundColor + '|' + LANG;
  if (!TRIAL_SHOTS[key]) TRIAL_SHOTS[key] = trialDraw(r).catch((e) => { delete TRIAL_SHOTS[key]; throw e; });
  return TRIAL_SHOTS[key];
}
async function trialDraw(r) {
  const cs = getComputedStyle(document.documentElement);
  const v = (n, d) => cs.getPropertyValue(n).trim() || d;
  const col = {
    bg: getComputedStyle(document.body).backgroundColor || '#fff', fg: v('--fg', '#111'), fg2: v('--fg-2', '#333'), muted: v('--muted', '#777'),
    soft: v('--accent-soft', '#e8f8ef'), line: v('--accent-line', '#7fd3a5'), box: v('--line', '#ddd'),
    warnSoft: v('--warn-soft', '#fff6dd'), warnLine: v('--warn-line', '#e8c66a'), warnInk: v('--warn-ink', '#7a5300'),
  };
  const sans = getComputedStyle(document.body).fontFamily || 'sans-serif';
  const mono = v('--mono', 'monospace');
  // 字型來自 Google Fonts：擋 Google 的網路（例如公司體驗電腦）會一直等不到，最多等 1.5 秒，用系統字型畫
  const atMost = (p, ms) => Promise.race([Promise.resolve(p).catch(() => {}), new Promise((res) => setTimeout(res, ms))]);
  if (document.fonts) await atMost(document.fonts.ready, 1500);
  const img = new Image();
  img.src = 'assets/trial-guide.webp';
  await atMost(img.decode ? img.decode() : new Promise((res) => { img.onload = img.onerror = res; }), 3000);
  const W = 680, P = 32, S = 2, IMGW = 200;
  const IMGH = img.naturalWidth ? Math.round(IMGW * img.naturalHeight / img.naturalWidth) : 0;
  const c = document.createElement('canvas');
  let g = c.getContext('2d');
  // 中文一個字一段、英文一個字一段，量寬度換行
  const wrap = (text, maxW) => {
    const lines = []; let line = '';
    for (const t of String(text).match(/[⺀-鿿豈-﫿＀-￯]|[^\s⺀-鿿豈-﫿＀-￯]+\s*|\s+/g) || []) {
      // 句號、逗號、右括號不放在行首（排不下就讓它稍微超出一點）
      if (line && !/^[，。、；：！？）」』〉》,.;:!?)]/.test(t) && g.measureText(line + t).width > maxW) { lines.push(line.trimEnd()); line = t.trimStart(); } else line += t;
    }
    if (line) lines.push(line);
    return lines;
  };
  const rr = (x, y, w, h, rad) => { g.beginPath(); g.moveTo(x + rad, y); g.arcTo(x + w, y, x + w, y + h, rad); g.arcTo(x + w, y + h, x, y + h, rad); g.arcTo(x, y + h, x, y, rad); g.arcTo(x, y, x + w, y, rad); g.closePath(); };
  // 同一套排版跑兩次：第一次只算高度，第二次真的畫
  const layout = (paint) => {
    let y = P;
    const text = (t, x, yy, font, color) => { g.font = font; if (paint) { g.fillStyle = color; g.fillText(t, x, yy); } return g.measureText(t).width; };
    g.textBaseline = 'top';
    const tw = text(T('你的體驗帳號'), P, y, `600 20px ${sans}`, col.fg);
    text(T('課程代號 {c}', { c: r.course }), P + tw + 12, y + 5, `400 14px ${sans}`, col.muted);
    y += 40;
    g.font = `700 30px ${mono}`;
    const aw = g.measureText(r.account).width + 40;
    if (paint) { rr(P, y, aw, 60, 12); g.fillStyle = col.bg; g.fill(); g.strokeStyle = col.box; g.lineWidth = 1; g.stroke(); }
    text(r.account, P + 20, y + 15, `700 30px ${mono}`, col.fg);
    y += 60 + 20;
    g.font = `400 16px ${sans}`;
    const bullets = [];
    if (r.points) bullets.push(T('每日 {n} 點（每日點數不累加，00:00 刷新）', { n: Number(r.points).toLocaleString('en-US') }));
    bullets.push(T('可以使用：{a} ～ {b}', { a: trialTime(r.start), b: trialTime(r.end) }));
    for (const b of bullets) {
      g.font = `400 16px ${sans}`;
      wrap(b, W - 2 * P - 18).forEach((l, i) => { if (i === 0) text('•', P, y, `400 16px ${sans}`, col.fg2); text(l, P + 18, y, `400 16px ${sans}`, col.fg2); y += 28; });
    }
    y += 14;
    const top = y, colW = W - 2 * P - (IMGH ? IMGW + 24 : 0);
    const steps = [T('按「複製帳號」，再按「前往 moonland.ai 登入」。'), T('在登入畫面選「一次性體驗帳號登入」。'), T('貼上帳號，登入。')];
    steps.forEach((st, n) => {
      g.font = `400 16px ${sans}`;
      wrap(st, colW - 24).forEach((l, i) => { if (i === 0) text(`${n + 1}.`, P, y, `400 16px ${sans}`, col.fg2); text(l, P + 24, y, `400 16px ${sans}`, col.fg2); y += 28; });
    });
    y += 10;
    text(T('登入網址：moonland.ai'), P, y, `600 16px ${sans}`, col.fg);
    y += 28;
    if (IMGH) {
      if (paint) { g.save(); rr(W - P - IMGW, top, IMGW, IMGH, 10); g.clip(); g.drawImage(img, W - P - IMGW, top, IMGW, IMGH); g.restore(); }
      y = Math.max(y, top + IMGH);
    }
    y += 20;
    g.font = `500 15px ${sans}`;
    const warn = wrap(T('一組帳號同時只能一個人使用：別人用同一組登入，會把你登出。請不要把帳號給別人。'), W - 2 * P - 36);
    const wh = warn.length * 26 + 28;
    if (paint) { rr(P, y, W - 2 * P, wh, 12); g.fillStyle = col.warnSoft; g.fill(); g.strokeStyle = col.warnLine; g.stroke(); }
    warn.forEach((l, i) => text(l, P + 18, y + 14 + i * 26, `500 15px ${sans}`, col.warnInk));
    y += wh + 16;
    text(T('moonland.ai 說明中心'), P, y, `400 13px ${sans}`, col.muted);
    return y + 18 + P - 8;
  };
  const H = layout(false);
  c.width = W * S; c.height = H * S;
  g = c.getContext('2d');
  g.scale(S, S);
  g.fillStyle = col.bg; g.fillRect(0, 0, W, H);
  rr(0.5, 0.5, W - 1, H - 1, 16); g.fillStyle = col.soft; g.fill(); g.strokeStyle = col.line; g.lineWidth = 1; g.stroke();
  layout(true);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('toBlob'))), 'image/png'));
}
function trialWarm(root) {
  (root || document).querySelectorAll('.trial-card[data-trial]').forEach((el) => {
    try { trialShot(JSON.parse(el.dataset.trial)).catch(() => {}); } catch (e) { /* 資料壞了就不預先畫 */ }
  });
}
async function trialSaveImage(btn) {
  const label = btn.querySelector('span');
  const done = (t) => { label.textContent = T(t); setTimeout(() => { label.textContent = T('儲存成圖片'); }, 1800); };
  let r;
  try { r = JSON.parse(btn.closest('.trial-card').dataset.trial); } catch (e) { return done('儲存失敗'); }
  label.textContent = T('製作中…');
  try {
    const blob = await trialShot(r);
    const name = `moonland-${r.account}.png`;
    const file = typeof File === 'function' ? new File([blob], name, { type: 'image/png' }) : null;
    // 手機：分享選單（iPhone 可「儲存影像」、Android 可存到相簿）；不支援或被擋就改成下載
    if (file && matchMedia('(pointer: coarse)').matches && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file] }); return done('已儲存'); }
      catch (e) { if (e && e.name === 'AbortError') return done('儲存成圖片'); }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    if ('download' in a) a.download = name; else a.target = '_blank';   // 舊 iPhone 不能下載：新分頁打開圖片，長按儲存
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    done('已儲存');
  } catch (e) { console.error('儲存圖片失敗', e); done('儲存失敗'); }
}
async function onTrialSubmit(e) {
  const form = e.target;
  const input = form.elements.course;
  const err = form.querySelector('.fb-error');
  const btn = form.querySelector('.fb-submit');
  const course = input.value.replace(/\s+/g, '').toUpperCase();
  err.textContent = '';
  if (!course) { err.textContent = T('請輸入課程代號。'); input.focus(); return; }
  const out = document.getElementById('trialOut');
  const have = trialSaved().find((x) => x.course === course);
  if (have) { out.innerHTML = trialCard(have); trialWarm(out); out.firstElementChild.focus(); return; }
  btn.disabled = true; btn.textContent = T('領取中…');
  let r;
  try {
    // 不指定 content-type（預設 text/plain），Apps Script 才收得到（不會觸發跨網域預檢）
    const res = await fetch(TRIAL_URL, { method: 'POST', body: JSON.stringify({ action: 'claim', course, vid: visitorId() || 'anon-' + Date.now() }) });
    const text = await res.text();
    // 回來的不是資料（Google 的錯誤頁、登入頁）＝試算表程式那邊出問題，不是學員的網路
    try { r = JSON.parse(text); } catch (x) { r = { error: 'server', detail: `HTTP ${res.status}` }; }
  } catch (x) { r = { error: 'network' }; }
  btn.disabled = false; btn.textContent = T('領取帳號');
  // 開始時間還沒到（2026-11-24 使用者要求開始後才能領）：顯示「這個課程從 11/25 00:00 開始發放。」
  if (r && r.error === 'notyet') { err.textContent = trialStartMsg(r.start); return; }
  if (!r || !r.ok || !r.account) {
    err.textContent = T(TRIAL_ERR[r && r.error] || '連線失敗，請檢查網路後再試一次。') + (r && r.error === 'server' && r.detail ? `（${r.detail}）` : '');
    return;
  }
  const item = { course, account: r.account, points: r.points, start: r.start, end: r.end };
  trialSave(item);
  out.innerHTML = trialCard(item);
  trialWarm(out);
  out.firstElementChild.focus();
}

function pager(id) {
  const i = ORDER.indexOf(id);
  if (i < 0) return '';
  const p = ORDER[i - 1], n = ORDER[i + 1];
  return `<nav class="pager" aria-label="${T('上一篇與下一篇')}">${p ? `<a href="#${p}"><small>${T('上一篇')}</small>${esc(PAGES[p].t)}</a>` : ''}${n ? `<a class="next" href="#${n}"><small>${T('下一篇')}</small>${esc(PAGES[n].t)}</a>` : ''}</nav>`;
}
const feedback = () => `<div class="feedback">${T('這篇有幫助嗎？')}<button type="button" aria-pressed="false" data-vote="up">${T('有幫助')}</button><button type="button" aria-pressed="false" data-vote="down">${T('還需要改進')}</button><span class="fb-thanks" role="status"></span></div>`;

// ---------------------------------------------------------
// 回饋：先送網站伺服器（server/server.js 的 /api/feedback，會轉存 Google 試算表並用 Zulip 通知負責人），後台頁 admin.html 查看。
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
// 靜態版（tools/build-static.js 產生，放在 moonland.ai）沒有伺服器，也不能連回公司網域（2026-11-23 使用者要求）：
// 回饋與吉吉問卷只送 Google 試算表（問卷在「問卷」分頁）；閱讀流量不記。公司網站上 noServer 是 false，一切照舊
const NO_SERVER = !!(window.SITE_CONFIG && window.SITE_CONFIG.noServer);
const GOOGLE_URL = (window.SITE_CONFIG && window.SITE_CONFIG.googleScriptUrl) || '';
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
  // 頁面標題一律送中文的，後台才不會同一篇出現中英兩種名稱；lang 記下是看哪個語言時送的
  const zhTitle = entry.page ? (ZH_ARTICLES[entry.page] && ZH_ARTICLES[entry.page].t) || entry.pageTitle : entry.pageTitle;
  entry = { ...entry, pageTitle: zhTitle, vid: visitorId(), lang: LANG };
  // 先送網站伺服器（公司部署）：伺服器存一份、轉存 Google 試算表、通知負責人
  if (!NO_SERVER) try {
    const r = await fetch('api/feedback', { method: 'POST', body: JSON.stringify(entry) });
    if (r.ok) return 'server';
    if (r.status !== 404 && r.status !== 405) return 'failed';   // 有伺服器但拒收（格式錯、太頻繁）
  } catch (e) { /* 連不到伺服器：往下試 Google 試算表 */ }
  // 沒有伺服器（GitHub Pages）：有填 Google 試算表網址就直接送過去
  const google = window.SITE_CONFIG && window.SITE_CONFIG.googleScriptUrl;
  if (google) {
    try {
      // 不指定 content-type（預設 text/plain），Apps Script 才收得到（不會觸發跨網域預檢）
      const r = await fetch(google, { method: 'POST', body: JSON.stringify(entry) });
      return (await r.json()).ok ? 'server' : 'failed';
    } catch (e) { return 'failed'; }
  }
  if (NO_SERVER) return 'failed';   // 靜態版沒有預覽用的後台頁，存在瀏覽器裡沒有人看得到
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
  else if (ARTICLES[id]) body = articleView(id) + (id === 'contact' ? mailForm() : '');
  else if (CATS[id]) body = catView(id);
  else body = `${crumb(id)}<h1>${esc(PAGES[id].t)}</h1><p class="lead">${T('這篇內容整理中。')}</p>`;
  view.innerHTML = body + (id === 'home' ? '' : pager(id) + (CATS[id] || id === 'feedback' || id === 'trial' ? '' : feedback()));
  if (id === 'trial') setTimeout(() => trialWarm(view), 0);   // 先畫好「儲存成圖片」的圖
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
    ? `<div class="toc-label">${T('本頁目錄')}</div>` + hs.map((h) => `<a href="#" data-to="${h.id}">${esc([...h.childNodes].filter((n) => !(n.classList && n.classList.contains('chip'))).map((n) => n.textContent).join('').trim())}</a>`).join('')
    : '';
  tocBtn.hidden = hs.length < 2;
  toggleToc(false);
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
  const shot = e.target.closest('.trial-shot');
  if (shot) { trialSaveImage(shot); return; }
  const tc = e.target.closest('.trial-copy');
  if (tc) {
    const label = tc.querySelector('span');
    try { await navigator.clipboard.writeText(tc.dataset.copy); }
    catch (err) { const r = document.createRange(); r.selectNodeContents(tc.parentElement.querySelector('code')); getSelection().removeAllRanges(); getSelection().addRange(r); }
    tc.classList.add('done'); label.textContent = T('已複製');
    setTimeout(() => { tc.classList.remove('done'); label.textContent = T('複製帳號'); }, 1600);
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
    // 再點一次已選的按鈕＝取消；送出 value: 'none'，後台只算每個人最後一次，取消後就不計票
    const undo = fb.getAttribute('aria-pressed') === 'true';
    fb.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    if (!undo) fb.setAttribute('aria-pressed', 'true');
    const id = currentId(), up = fb.dataset.vote === 'up';
    const msg = fb.parentElement.querySelector('.fb-thanks');
    msg.innerHTML = undo ? T('已取消') : up ? T('謝謝你的回饋！') : `${T('謝謝！')}<a href="#feedback" data-fb-from="${id}">${T('告訴我們哪裡需要改進 →')}</a>`;
    if (await sendFeedback({ kind: 'vote', page: id, pageTitle: PAGES[id].t, value: undo ? 'none' : fb.dataset.vote }) === 'failed') msg.textContent = T('送出失敗，請稍後再試。');
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
  openDialog(zoom);
}
zoom.addEventListener('click', () => closeDialog(zoom));

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
onMediaChange(mqMobile, () => { root.classList.remove('drawer-open'); syncNavBtn(); });

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
onMediaChange(sysLight, paintThemeBtn);

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
function openSearch() { if (!INDEX) buildIndex(); q.value = ''; search(); openDialog(dlg); q.focus(); }
document.getElementById('searchBtn').addEventListener('click', openSearch);
document.getElementById('dlgClose').addEventListener('click', () => closeDialog(dlg));
document.addEventListener('click', (e) => { if (e.target.closest('[data-open-search]')) openSearch(); });
q.addEventListener('input', search);
q.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
  else if (e.key === 'Enter') {
    const a = results.querySelectorAll('a')[sel];
    if (a) { location.hash = a.getAttribute('href'); closeDialog(dlg); }
  }
});
results.addEventListener('click', (e) => { if (e.target.closest('a')) closeDialog(dlg); });
dlg.addEventListener('click', (e) => { if (e.target === dlg) closeDialog(dlg); });

// 舊瀏覽器（iOS 15.4 以前的 Safari 等）沒有 <dialog> 的 showModal／close（2026-11-24 相容性檢查）：
// 改成加 open 屬性、自己蓋一層半透明底（style.css 的 .dlg-fallback），按 Esc 或點底色關閉
function hasDialog(d) { return typeof d.showModal === 'function'; }
function openDialog(d) {
  if (hasDialog(d)) { d.showModal(); return; }
  d.setAttribute('open', '');
  d.classList.add('dlg-fallback');
  document.body.classList.add('dlg-open');
}
function closeDialog(d) {
  if (hasDialog(d)) { d.close(); return; }
  d.removeAttribute('open');
  d.classList.remove('dlg-fallback');
  if (!document.querySelector('dialog.dlg-fallback')) document.body.classList.remove('dlg-open');
}
document.addEventListener('keydown', (e) => {
  const d = e.key === 'Escape' && document.querySelector('dialog.dlg-fallback');
  if (d) closeDialog(d);
});
document.addEventListener('click', (e) => {
  if (e.target === document.body && document.body.classList.contains('dlg-open')) document.querySelectorAll('dialog.dlg-fallback').forEach(closeDialog);
});
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape') closeDrawer();
});

// ---------------------------------------------------------
// 意見回饋表單
// ---------------------------------------------------------
view.addEventListener('change', (e) => {
  const f = e.target.form;
  if (f && f.id === 'fbForm' && e.target.name === 'type') { f.message.placeholder = T(FB_HINT[e.target.value]); clearFieldErrors(f, 'type'); }
});
view.addEventListener('input', (e) => {
  if (e.target.name === 'message' && e.target.form && e.target.form.id === 'fbForm') {
    e.target.form.querySelector('.fb-count').textContent = `${e.target.value.length} / 2000`;
    if (e.target.value.trim()) clearFieldErrors(e.target.form, 'message');
  }
});
function fieldError(f, name, text) {
  const p = f.querySelector(`.fb-error[data-for="${name}"]`);
  p.textContent = text;
  const box = p.closest('.fb-field');
  box.classList.add('invalid');
  box.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
function clearFieldErrors(f, name) {
  f.querySelectorAll(name ? `.fb-error[data-for="${name}"]` : '.fb-error[data-for]').forEach((p) => { p.textContent = ''; p.closest('.fb-field').classList.remove('invalid'); });
}
async function onFeedbackSubmit(e) {
  const f = e.target;
  const err = f.querySelector('.fb-error');
  const type = f.type.value, message = f.message.value.trim();
  clearFieldErrors(f);
  err.textContent = '';
  // 錯誤放在沒填的欄位旁邊並捲到畫面中間（2026-11-18：原本紅字在最下面，捲上去後看不到，像是按了沒反應）
  if (!type) { fieldError(f, 'type', T('請先選一個回饋類型。')); f.querySelector('input[name="type"]').focus({ preventScroll: true }); return; }
  if (!message) { fieldError(f, 'message', T('請寫下回饋內容。')); f.message.focus({ preventScroll: true }); return; }
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
}
view.addEventListener('click', (e) => { if (e.target.closest('.fb-again')) render(); });

// ---------------------------------------------------------
// 「聯絡我們」頁的寫信表單：網站本身不能寄信，按「寄出」會開啟使用者的郵件程式，
// 收件人、主旨、內容都先填好，使用者再按一次傳送。
// ---------------------------------------------------------
const SUPPORT_MAIL = 'support@moonland.ai';
const MAIL_TOPICS = ['使用問題', '教育訓練', '方案與價格', '客製化技術支援', '帳號與點數', '其他'];
const MAIL_MAX = 1500; // 郵件連結太長，部分郵件程式會打不開

function mailForm() {
  return `<section class="mail-box" aria-labelledby="mailTitle">
    <h2 id="mailTitle">${T('直接寫信給我們')}</h2>
    <p>${T('填好後按「寄出」，會開啟你的郵件程式（例如 Outlook、Gmail），收件人與內容都已填好，再按一次傳送即可。')}</p>
    <form class="fb-form" id="mailForm" novalidate>
      <label class="fb-field"><span class="fb-label">${T('問題類型')}</span>
        <select name="topic">${MAIL_TOPICS.map((t) => `<option>${T(t)}</option>`).join('')}</select></label>
      <label class="fb-field"><span class="fb-label">${T('主旨')}</span>
        <input name="subject" maxlength="80" placeholder="${T('例如：影片一直生成失敗')}"></label>
      <label class="fb-field"><span class="fb-label">${T('內容')}</span>
        <textarea name="message" rows="6" maxlength="${MAIL_MAX}" placeholder="${T('請描述你遇到的情況，例如用了哪個工具、做了什麼、出現什麼訊息。')}"></textarea>
        <small class="fb-count">0 / ${MAIL_MAX}</small></label>
      <label class="fb-field"><span class="fb-label">${T('稱呼')}<small>${T('選填')}</small></span>
        <input name="sender" maxlength="40"></label>
      <p class="fb-error" role="alert"></p>
      <button class="fb-submit" type="submit">${T('寄出')}</button>
    </form>
  </section>`;
}

view.addEventListener('input', (e) => {
  if (e.target.name === 'message' && e.target.form && e.target.form.id === 'mailForm') {
    e.target.form.querySelector('.fb-count').textContent = `${e.target.value.length} / ${MAIL_MAX}`;
  }
});
function onMailSubmit(e) {
  const f = e.target;
  const err = f.querySelector('.fb-error');
  const subject = f.subject.value.trim(), message = f.message.value.trim(), name = f.sender.value.trim();
  if (!subject) { err.textContent = T('請填寫主旨。'); f.subject.focus(); return; }
  if (!message) { err.textContent = T('請填寫內容。'); f.message.focus(); return; }
  err.textContent = '';
  const fullSubject = `[${f.topic.value}] ${subject}`;
  const body = `${message}\n\n${name ? `${T('稱呼')}：${name}\n` : ''}${T('來自說明中心「聯絡我們」')}`;
  location.href = `mailto:${SUPPORT_MAIL}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;
  f.outerHTML = `<div class="fb-done" role="status" tabindex="-1">${ic('check')}<div><b>${T('已開啟郵件程式')}</b>
    <p>${T('請在郵件程式裡按「傳送」，信才會寄出。')}</p>
    <p class="fb-preview">${T('沒有跳出郵件程式？請複製下面的內容，寄到')} <b>${SUPPORT_MAIL}</b>。</p>
    <textarea class="mail-copy" readonly rows="6">${esc(`${T('主旨')}：${fullSubject}\n\n${body}`)}</textarea>
    <button type="button" class="fb-again mail-copy-btn">${T('複製內容')}</button></div></div>`;
  view.querySelector('.fb-done').focus();
}
view.addEventListener('click', async (e) => {
  const b = e.target.closest('.mail-copy-btn');
  if (!b) return;
  const t = b.parentElement.querySelector('.mail-copy');
  try { await navigator.clipboard.writeText(t.value); } catch { t.select(); document.execCommand('copy'); }
  b.textContent = T('已複製');
});

// ---------------------------------------------------------
// 回到頂端
// ---------------------------------------------------------
tocBtn.innerHTML = ic('menu');
tocBtn.setAttribute('aria-label', T('本頁目錄'));
tocBtn.title = T('本頁目錄');
tocBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleToc(!document.body.classList.contains('toc-open')); });
// 點清單外面、點了某一節、按 Esc 都會收起來
document.addEventListener('click', (e) => { if (document.body.classList.contains('toc-open') && (!toc.contains(e.target) || e.target.closest('a[data-to]'))) toggleToc(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('toc-open')) { toggleToc(false); tocBtn.focus(); } });
const toTop = document.getElementById('toTop');
toTop.innerHTML = ic('up');
const syncToTop = () => toTop.classList.toggle('show', scrollY > 600);
addEventListener('scroll', syncToTop, { passive: true });
toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  view.focus({ preventScroll: true });
});

// ---------------------------------------------------------
// 吉吉：說明中心的小黑貓嚮導（題目、選單與推薦規則在 survey.js）
// - 第一次來的訪客會自動打開，問幾題匿名問卷（身分、AI 經驗、怎麼知道我們、為什麼來），再推薦文章
// - 答完或略過就不再自動打開（localStorage ml-jiji）；之後點右下角的吉吉，可以從「你想做什麼？」找文章或重新回答
// - 答案送到 api/survey（伺服器存起來，編輯後台「訪客問卷」看統計）；GitHub Pages 預覽版送不出去也沒關係
// ---------------------------------------------------------
const JIJI_KEY = 'ml-jiji';
// 吉吉：使用者提供的像素小黑貓（左右翻轉後轉成向量，面朝左）
const CAT_SVG = '<svg class="jiji-cat" viewBox="0 0 281 255" aria-hidden="true"><path fill="#18181b" shape-rendering="crispEdges" d="M228 0h25v19h-25zM228 19h34v10h-34zM242 29h20v24h-20zM242 53h20v9h-20zM51 53h17v9h-17zM242 62h20v2h-20zM51 62h17v2h-17zM10 62h17v2h-17zM242 64h20v6h-20zM51 64h17v6h-17zM10 64h29v6h-29zM242 70h20v8h-20zM18 70h64v8h-64zM235 78h27v4h-27zM18 78h64v4h-64zM235 82h27v8h-27zM27 82h55v8h-55zM235 90h18v2h-18zM27 90h55v2h-55zM235 92h18v11h-18zM18 92h64v11h-64zM221 103h32v4h-32zM18 103h83v4h-83zM221 107h32v7h-32zM10 107h91v7h-91zM10 114h235v8h-235zM10 122h240v13h-240zM0 135h250v7h-250zM0 142h260v9h-260zM16 151h244v8h-244zM60 159h200v12h-200zM65 171h195v12h-195zM65 183h205v7h-205zM76 190h194v4h-194zM175 194h95v12h-95zM76 194h73v12h-73zM242 206h28v5h-28zM197 206h24v5h-24zM65 206h84v5h-84zM250 211h31v11h-31zM197 211h24v11h-24zM124 211h25v11h-25zM65 211h32v11h-32zM260 222h21v9h-21zM188 222h33v9h-33zM134 222h23v9h-23zM65 222h21v9h-21zM260 231h21v7h-21zM188 231h33v7h-33zM134 231h23v7h-23zM65 231h11v7h-11zM250 238h20v5h-20zM177 238h29v5h-29zM124 238h33v5h-33zM45 238h31v5h-31zM250 243h20v12h-20zM177 243h29v12h-29zM124 243h25v12h-25zM45 243h31v12h-31z"/></svg>';
const jijiState = () => { try { return JSON.parse(localStorage.getItem(JIJI_KEY) || 'null'); } catch (e) { return null; } };
const saveJiji = (v) => { try { localStorage.setItem(JIJI_KEY, JSON.stringify({ ...v, at: new Date().toISOString() })); } catch (e) {} };
const jijiBtn = document.createElement('button');
jijiBtn.className = 'jiji-btn';
jijiBtn.type = 'button';
jijiBtn.setAttribute('aria-label', T('問吉吉：幫你找文章'));
jijiBtn.setAttribute('aria-expanded', 'false');
jijiBtn.setAttribute('aria-controls', 'jiji');
jijiBtn.title = T('問吉吉');
jijiBtn.innerHTML = CAT_SVG;
const jiji = document.createElement('section');
jiji.className = 'jiji';
jiji.id = 'jiji';
jiji.hidden = true;
jiji.setAttribute('aria-label', T('吉吉'));
// 問卷（打招呼、作答、推薦）放在畫面中間，後面蓋一層半透明底；點底色等於「先不用」
const jijiBack = document.createElement('div');
jijiBack.className = 'jiji-back';
jijiBack.hidden = true;
document.body.append(jijiBack, jiji, jijiBtn);
const jijiCenter = () => ['hello', 'q', 'done'].includes(jj.step);
function placeJiji() {
  const c = !jiji.hidden && jijiCenter();
  jiji.classList.toggle('center', c);
  jijiBack.hidden = !c;
  jiji.setAttribute('role', c ? 'dialog' : 'region');
  if (c) jiji.setAttribute('aria-modal', 'true'); else jiji.removeAttribute('aria-modal');
  document.body.classList.toggle('jiji-modal', c);
}
jijiBack.addEventListener('click', () => { closeJiji(); });

let jj = { step: 'menu', i: 0, a: {} };   // 目前畫面：hello 打招呼、q 問卷第 i 題、done 推薦、menu 選單、topic 某個選單項目
const qList = () => Survey.QUESTIONS.filter((q) => Survey.shown(q, jj.a));
// 說明和標題差不多時就不重複顯示
const pageLink = ([id, why]) => { why = why && T(why); return PAGES[id] ? `<a class="jiji-link" href="#${id}"><b>${esc(PAGES[id].t)}</b>${why && !PAGES[id].t.startsWith(why) ? `<small>${esc(why)}</small>` : ''}${ic('chev', 'ic chev')}</a>` : ''; };
const say = (html) => `<div class="jiji-say">${html}</div>`;

function paintJiji() {
  let body = '';
  if (jj.step === 'hello') {
    body = say(T('喵～我是<b>吉吉</b>，說明中心的小黑貓。<br>回答幾個小問題（大約 30 秒、不記名），我幫你挑最適合的文章！'))
      + `<div class="jiji-acts"><button type="button" class="jiji-main" data-jj="start">${T('好啊')}</button><button type="button" class="jiji-ghost" data-jj="skip">${T('先不用')}</button></div>`;
  } else if (jj.step === 'q') {
    const list = qList();
    const q = list[jj.i];
    const v = jj.a[q.id];
    const multi = q.type === 'multi';
    const picked = (code) => (multi ? (v || []).includes(code) : v === code);
    const others = Object.entries(q.other || {}).filter(([code]) => picked(code));
    body = `<div class="jiji-prog" aria-label="${T('第 {i} 題，共 {n} 題', { i: jj.i + 1, n: list.length })}"><span style="width:${((jj.i + 1) / list.length) * 100}%"></span></div>`
      + say(`<b>${esc(T(q.q))}</b>${q.hint ? `<small>${esc(T(q.hint))}</small>` : ''}`)
      + `<div class="jiji-opts" role="group" aria-label="${esc(T(q.q))}">${q.options.map(([code, label]) => `<button type="button" class="jiji-opt" data-jj="pick" data-code="${code}" aria-pressed="${picked(code)}">${esc(T(label))}</button>`).join('')}</div>`
      + others.map(([code, label]) => `<label class="jiji-other"><span>${esc(T(label))}</span><input data-other="${q.id}_${code}" maxlength="60" value="${esc(jj.a[`${q.id}_${code}`] || '')}"></label>`).join('')
      // 單選又不用填字：點選項就直接到下一題，不需要「下一題」鈕；還沒答才顯示「略過這題」
      + `<div class="jiji-acts">${jj.i ? `<button type="button" class="jiji-ghost" data-jj="back">${T('上一步')}</button>` : ''}<span class="jiji-sp"></span>`
      + `${v && v.length ? '' : `<button type="button" class="jiji-ghost" data-jj="next">${T('略過這題')}</button>`}`
      + `${multi || others.length ? `<button type="button" class="jiji-main" data-jj="next">${T(jj.i === list.length - 1 ? '完成' : '下一題')}</button>` : ''}</div>`;
  } else if (jj.step === 'done') {
    const recs = Survey.recommend(jj.a).map(pageLink).join('');
    body = say(T('謝謝你！喵～依你的回答，建議先看這幾篇：')) + `<div class="jiji-links">${recs}</div>`
      + `<div class="jiji-acts"><button type="button" class="jiji-ghost" data-jj="menu">${T('我想找別的')}</button></div>`;
  } else if (jj.step === 'topic') {
    const [label, items] = Survey.MENU[jj.i];
    body = say(T('「{x}」的話，可以看這幾篇：', { x: esc(T(label)) })) + `<div class="jiji-links">${items.map(pageLink).join('')}</div>`
      + `<div class="jiji-acts"><button type="button" class="jiji-ghost" data-jj="menu">${T('← 回到選單')}</button></div>`;
  } else {
    body = say(T('喵～你想做什麼？')) + `<div class="jiji-opts col">${Survey.MENU.map(([label], i) => `<button type="button" class="jiji-opt" data-jj="topic" data-i="${i}">${esc(T(label))}</button>`).join('')}</div>`
      + `<div class="jiji-acts"><button type="button" class="jiji-ghost" data-jj="search">${ic('search', 'ic sm')}${T('自己搜尋')}</button><span class="jiji-sp"></span><button type="button" class="jiji-ghost" data-jj="start">${T((jijiState() || {}).done ? '重新回答問卷' : '回答問卷，讓我推薦')}</button></div>`;
  }
  setTimeout(placeJiji);
  jiji.innerHTML = `<header class="jiji-head"><span class="jiji-ava">${CAT_SVG}</span><span><b>${T('吉吉')}</b><small>${T('幫你找文章的小黑貓')}</small></span>
    <button type="button" class="icon-btn" data-jj="close" aria-label="${T('關閉吉吉')}">${ic('x')}</button></header><div class="jiji-body" aria-live="polite">${body}</div>`;
}
function openJiji(step) {
  if (step) jj = { step, i: 0, a: step === 'q' ? {} : jj.a };
  paintJiji();
  jiji.hidden = false;
  placeJiji();
  jijiBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('jiji-open');
  const f = jiji.querySelector('.jiji-body button, .jiji-body a');
  if (f) f.focus({ preventScroll: true });
}
function closeJiji() {
  if (jiji.hidden) return;
  // 問卷答到一半就關掉：當成略過，不再自動打開
  if (!jijiState() && (jj.step === 'hello' || jj.step === 'q')) saveJiji({ skipped: true });
  jiji.hidden = true;
  placeJiji();
  jijiBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('jiji-open');
}
async function sendSurvey() {
  saveJiji({ done: true });
  // 靜態版：送 Google 試算表（不加 content-type，Apps Script 才收得到）
  if (NO_SERVER) {
    if (!GOOGLE_URL) { jj.sent = false; return; }
    try {
      const r = await fetch(GOOGLE_URL, { method: 'POST', body: JSON.stringify({ kind: 'survey', answers: jj.a, vid: visitorId(), lang: LANG }) });
      jj.sent = !!(await r.json()).ok;
    } catch (e) { jj.sent = false; }
    return;
  }
  try {
    const r = await fetch('api/survey', { method: 'POST', body: JSON.stringify({ answers: jj.a, vid: visitorId() }) });
    jj.sent = r.ok;
  } catch (e) { jj.sent = false; }
}
jijiBtn.addEventListener('click', (e) => { e.stopPropagation(); if (jiji.hidden) openJiji(jj.step === 'q' || jj.step === 'hello' ? undefined : 'menu'); else closeJiji(); });
jiji.addEventListener('input', (e) => { const k = e.target.dataset.other; if (k) jj.a[k] = e.target.value; });
jiji.addEventListener('click', (e) => {
  if (e.target.closest('a.jiji-link')) { viewFrom = 'jiji'; closeJiji(); return; }
  const b = e.target.closest('[data-jj]');
  if (!b) return;
  const act = b.dataset.jj;
  if (act === 'close') { closeJiji(); jijiBtn.focus(); return; }
  if (act === 'skip') { saveJiji({ skipped: true }); jj.step = 'menu'; }
  else if (act === 'start') { jj = { step: 'q', i: 0, a: {} }; }
  else if (act === 'menu') jj.step = 'menu';
  else if (act === 'search') { closeJiji(); openSearch(); return; }
  else if (act === 'topic') { jj.step = 'topic'; jj.i = +b.dataset.i; }
  else if (act === 'back') jj.i = Math.max(0, jj.i - 1);
  else if (act === 'pick' || act === 'next') {
    const q = qList()[jj.i];
    if (act === 'pick') {
      const code = b.dataset.code;
      if (q.type === 'multi') { const s = new Set(jj.a[q.id] || []); s.has(code) ? s.delete(code) : s.add(code); jj.a[q.id] = [...s]; }
      else jj.a[q.id] = code;
      // 單選、而且不用再填字：直接下一題
      const needText = q.other && q.other[code];
      if (q.type === 'multi' || needText) { paintJiji(); const t = jiji.querySelector(needText ? `[data-other="${q.id}_${code}"]` : `[data-code="${code}"]`); if (t) t.focus(); return; }
    }
    // 答案改了，後面不該出現的題目（例如沒用過 AI 就不問用過哪些工具）要清掉
    for (const x of Survey.QUESTIONS) if (!Survey.shown(x, jj.a)) delete jj.a[x.id];
    if (jj.i + 1 < qList().length) jj.i++;
    else { jj.step = 'done'; sendSurvey(); }
  }
  paintJiji();
  const f = jiji.querySelector('.jiji-body .jiji-opt, .jiji-body a, .jiji-body .jiji-main');
  if (f) f.focus({ preventScroll: true });
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !jiji.hidden) { closeJiji(); jijiBtn.focus(); } });
// 換到別頁（例如點了目錄）就收起來，問卷答到一半不算略過，點吉吉可以接著答
addEventListener('hashchange', () => { if (!jiji.hidden && jj.step !== 'hello' && jj.step !== 'q') closeJiji(); });
// 第一次來：畫面載入後，吉吉在畫面中間打招呼、問問卷（使用者 2026-11-20 要求要主動、明顯）；答完或略過就不再出現
// 來領體驗帳號的學員（#trial）不跳，免得擋住領帳號；下次來別的頁面再問
if (!jijiState() && (!NO_SERVER || GOOGLE_URL) && currentId() !== 'trial') setTimeout(() => { if (jiji.hidden && !document.querySelector('dialog[open]') && currentId() !== 'trial') openJiji('hello'); }, 800);

// ---------------------------------------------------------
// 8. 閱讀流量：記每篇被看了多久、捲到多深、從哪裡來（回饋後台「閱讀流量」看統計）
// - 不存 IP、不用 cookie，只有瀏覽器隨機代號（和意見回饋、問卷同一個）；不用外部統計服務
// - 停留不到 3 秒不記；切到別頁、切走分頁或關掉時送出，同一次閱讀再送會覆蓋前一筆（用 view 代號）
// - 在這台瀏覽器登入過編輯後台（localStorage ml-staff）的會標記 staff，後台預設不算
// - 站內搜尋找不到結果時，記下搜尋的字（停下來 1.5 秒才算一次）
// ---------------------------------------------------------
let viewFrom = '';   // 下一次換頁的來源：jiji、search，其他站內點擊是 internal
let reading = null;
const landingFrom = (() => {
  let h = '';
  try { h = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; } catch (e) {}
  if (!h) return 'direct';
  if (h === location.hostname) return 'internal';
  if (/(^|\.)moonland\.ai$/.test(h)) return 'platform';
  if (/(^|\.)google\./.test(h)) return 'google';
  if (/(^|\.)(bing\.com|yahoo\.|duckduckgo\.com|baidu\.com)/.test(h)) return 'engine';
  return 'other:' + h.slice(0, 60);
})();
const isStaff = () => { try { return localStorage.getItem('ml-staff') === '1'; } catch (e) { return false; } };
function beacon(data) {
  if (NO_SERVER) return;
  const body = JSON.stringify({ ...data, vid: visitorId(), staff: isStaff() || undefined });
  try { if (navigator.sendBeacon && navigator.sendBeacon('api/view', new Blob([body], { type: 'text/plain' }))) return; } catch (e) {}
  fetch('api/view', { method: 'POST', body, keepalive: true }).catch(() => {});
}
const depthNow = () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  return h <= 0 ? 100 : Math.min(100, Math.round((scrollY / h) * 100));
};
function startReading(id) {
  reading = { id, t: ZH_ARTICLES[id] ? ZH_ARTICLES[id].t : PAGES[id] ? PAGES[id].t : id, view: Math.random().toString(36).slice(2, 12), ms: 0, since: document.hidden ? 0 : Date.now(), depth: depthNow(), src: reading ? (viewFrom || 'internal') : landingFrom };
  viewFrom = '';
}
function flushReading() {
  const r = reading;
  if (!r) return;
  if (r.since) { r.ms += Date.now() - r.since; r.since = document.hidden ? 0 : Date.now(); }
  const sec = Math.round(r.ms / 1000);
  if (sec < 3) return;
  beacon({ kind: 'view', page: r.id, t: r.t, view: r.view, sec, depth: r.depth, src: r.src, lang: LANG });
}
addEventListener('scroll', () => { if (reading) reading.depth = Math.max(reading.depth, depthNow()); }, { passive: true });
document.addEventListener('visibilitychange', () => {
  if (!reading) return;
  if (document.hidden) flushReading();
  else reading.since = Date.now();
});
addEventListener('pagehide', flushReading);
results.addEventListener('click', (e) => { if (e.target.closest('a')) viewFrom = 'search'; });
let missTimer = 0;
q.addEventListener('input', () => {
  clearTimeout(missTimer);
  const s = q.value.trim();
  if (!s || results.querySelector('a')) return;
  missTimer = setTimeout(() => { if (q.value.trim() === s && !results.querySelector('a')) beacon({ kind: 'miss', q: s.slice(0, 60), lang: LANG }); }, 1500);
});
addEventListener('hashchange', () => {
  const id = currentId();
  if (reading && reading.id === id) return;
  flushReading();
  startReading(id);
});
startReading(currentId());

// ---------------------------------------------------------
// 9. 語言切換：記在這台裝置上（localStorage ml-lang），並把 ?lang= 寫進網址（分享網址也是同一種語言），再重新載入
//    預設中文（使用者 2026-11-23 決定）；index.html 開頭依 ?lang= 或上次的選擇設定 <html lang>
// ---------------------------------------------------------
const langBtn = document.getElementById('langBtn');
if (langBtn) {
  langBtn.textContent = LANG === 'en' ? '中文' : 'EN';
  langBtn.lang = LANG === 'en' ? 'zh-Hant' : 'en';
  langBtn.title = LANG === 'en' ? '切換成中文' : 'Switch to English';
  langBtn.setAttribute('aria-label', langBtn.title);
  langBtn.dataset.switchLang = '';
}
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
    if (el.hasAttribute(at) && el !== langBtn) el.setAttribute(at, T(el.getAttribute(at)));
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
