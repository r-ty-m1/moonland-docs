// =========================================================
// moonland.ai 說明中心
// 1. SECTIONS：左側目錄與所有頁面的結構（改分類、改順序都在這裡）
// 2. VIEWS：已完成內容的頁面
// 3. 其他頁面會自動顯示「待搬移」並連回 Notion 原文
// =========================================================

const NOTION_BASE = 'https://phrygian-friction-260.notion.site';

// 圖示（Tabler Icons 線條風格）
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
  arrow: 'M5 12l14 0 M13 18l6 -6 M13 6l6 6',
  ext: 'M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6 M11 13l9 -9 M15 4h5v5',
  x: 'M18 6l-12 12 M6 6l12 12',
};
const ic = (name, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------------------------------------------------
// 1. 網站結構
//    一般列：{ id, t: 標題, icon, tag }
//    分類列：{ id, t, icon, tag, d: 說明, groups: [{ g: 小標, items: [[id, 標題, 標籤]] }] }
// ---------------------------------------------------------
const SECTIONS = [
  {
    label: '開始使用',
    rows: [
      { id: 'quick-start', t: '5 分鐘快速入門', icon: 'rocket', tag: '新手' },
      { id: 'credits', t: '點數（登月幣）怎麼算', icon: 'coin' },
      { id: 'trial-login', t: '體驗帳號登入方式', icon: 'key' },
      { id: 'g-basics', t: '社群藝廊找靈感', icon: 'grid' },
    ],
  },
  {
    label: '創作工具',
    rows: [
      { id: 'chat', t: '交談', icon: 'chat', tag: '新手推薦',
        d: '用中文或英文對話的方式生成、編輯圖片，不用懂提示詞也能上手。',
        groups: [{ g: '基礎', items: [['c-basics', '交談介紹', '新手'], ['c-settings', '交談設定介紹'], ['c-edit', '編輯功能介紹']] }] },
      { id: 'image', t: '圖片生成', icon: 'image',
        d: '用文字（提示詞）或參考圖片生成各種 AI 圖片，也能針對已生成的圖片修改特定內容。',
        groups: [
          { g: '基礎', items: [['basics', '圖片生成基礎介紹', '新手'], ['img-prompt', '提示詞助手']] },
          { g: '進階應用', items: [['img-upscale', '圖片放大（SeedVR2）'], ['img-outpaint', '圖片拓展'], ['img-rotate', '圖片視角旋轉調整']] },
        ] },
      { id: 'video', t: '影片生成', icon: 'video',
        d: '用文字、圖片或影片生成 AI 影片，或做人物動態、聲音生成與配音修改。',
        groups: [
          { g: '基礎', items: [['v-basics', '影片生成基礎介紹', '新手'], ['v-i2v', '圖片生成影片（i2v）']] },
          { g: '進階應用', items: [['v-v2v', '影片生成影片（v2v）'], ['v-path', '物件運動軌跡控制'], ['v-frames', '頭尾幀連接'], ['v-mimic', '動作模仿（Wan Animate 2 / SCAIL 2）'], ['v-merge', '合併功能']] },
        ] },
      { id: 'lab', t: '實驗室', icon: 'flask',
        d: '用 LoRA、ControlNet 等精細參數精修圖片，適合熟悉 Stable Diffusion 或對品質要求高的使用者。',
        groups: [
          { g: '基礎', items: [['l-ui', '操作介面介紹'], ['l-prompt', '提示詞助手（實驗室）']] },
          { g: '進階控制', items: [['l-lora', 'LoRA 應用介紹'], ['l-cn', '進階控制選項 ControlNet'], ['l-ip', '風格一致性（IP-Adapter）']] },
        ] },
      { id: 'music-3d', t: '音樂與 3D', icon: 'music',
        d: '生成背景音樂與 3D 模型物件。',
        groups: [{ g: '', items: [['o-music', '音樂生成'], ['o-3d', '3D 模型物件生成']] }] },
      { id: 'credit-tools', t: '外部模型（登月幣）', icon: 'planet',
        d: '使用登月幣呼叫 Seedance、Kling、Google、OpenAI 等外部模型。目前僅開放團隊帳號。',
        groups: [] },
    ],
  },
  {
    label: '學習資源',
    rows: [
      { id: 'recipes', t: '應用範例', icon: 'sparkles',
        d: '跟著做就能完成的主題教學：從一個具體成品出發，帶你走完整流程。',
        groups: [{ g: '', items: [['c-recipes', '「交談」圖片應用大全'], ['c-pvc', 'PVC 模型風格生成'], ['c-logo', 'LOGO 創作'], ['c-outfit', '人物角色換衣'], ['l-face', '角色換臉應用']] }] },
      { id: 'models', t: '模型指南', icon: 'layers',
        d: '依用途比較各模型的擅長項目、輸入方式與耗點，快速找到適合的模型。',
        groups: [{ g: '', items: [['m-img', '圖片模型基礎介紹'], ['m-imgc', '圖片模型差異比較'], ['m-vid', '影片模型差異比較'], ['m-credit', '登月幣模型差異比較'], ['m-music', '音樂模型差異比較']] }] },
    ],
  },
  {
    label: '團隊管理',
    rows: [
      { id: 'team', t: '團隊與成員', icon: 'users',
        d: '團隊註冊與登入、成員邀請、標籤、點數分配與專案管理。',
        groups: [{ g: '', items: [['a-login', '團隊註冊與登入方式'], ['a-invite', '批次大量邀請成員'], ['a-tags', '標籤功能操作'], ['a-credits', '團隊共用點數分配'], ['a-projects', '專案管理']] }] },
      { id: 'admin', t: '管理員課程', icon: 'shield',
        d: '給團隊管理員的六堂課，依序從系統導覽走到帳號停用與用戶檢索。',
        groups: [{ g: '', items: [['a-admin', '團隊管理員功能教學'], ['a-1', '1｜系統導覽與前期準備'], ['a-2', '2｜帳號建置與成員邀請'], ['a-3', '3｜標籤應用與名單過濾'], ['a-4', '4｜狀態追蹤與資源配置'], ['a-5', '5｜帳號停用、恢復與刪除'], ['a-6', '6｜用戶資訊檢視與檢索']] }] },
    ],
  },
  {
    label: '支援',
    rows: [
      { id: 'faq', t: '常見問題', icon: 'help' },
      { id: 'changelog', t: '更新日誌', icon: 'history' },
      { id: 'contact', t: '聯絡我們', icon: 'mail' },
    ],
  },
];

// Notion 原文（尚未搬移的頁面會連過去）
const NOTION = {
  'img-prompt': '/3bc55cb6aede808d8446ed1662d2ed95', 'img-upscale': '/SeedVR2-3bc55cb6aede80c19b26fc7fbebd75a8',
  'img-outpaint': '/3bc55cb6aede80b68f04d9a5064b462c', 'img-rotate': '/3bc55cb6aede80748444f03fdc5a4ed9',
  'c-settings': '/3f955cb6aede80209386f6038e3cc605', 'c-basics': '/29555cb6aede807c9afcd7d64f676c89',
  'c-edit': '/29555cb6aede80ebab0ddc3575c9f969', 'c-recipes': '/2bd55cb6aede80328424c96864d5ad39',
  'c-pvc': '/PVC-29555cb6aede8042af93ef166a242af0', 'c-logo': '/LOGO-29555cb6aede807c9fb3ce18b389969b',
  'c-outfit': '/29555cb6aede80c7a662d7d4f839f4db', 'l-ui': '/2a155cb6aede80bf90e6f665c2ed087b',
  'l-lora': '/LoRA-2bd55cb6aede80529bc8e1780c63fdd4', 'l-cn': '/ControlNet-2bd55cb6aede80559935e8ad77882191',
  'l-prompt': '/29555cb6aede80b4a164d231a33442c1', 'l-ip': '/IP-adapter-29555cb6aede80c8a1dedbd3e8a018f5',
  'l-face': '/29555cb6aede80379c54f523764f1231', 'v-basics': '/29555cb6aede805098c0e9fe9bba175e',
  'g-basics': '/29555cb6aede803fad17fb770942ace9', 'a-login': '/29555cb6aede80d9bc70dd613b6d3394',
  'trial-login': '/29555cb6aede80d9bc70dd613b6d3394', 'credit-tools': '/29555cb6aede80cd9057c9fe9173c71c',
  'o-music': '/3a355cb6aede80efb873effaef3cb291', 'o-3d': '/3a355cb6aede80efb873effaef3cb291',
  'm-img': '/Q-A-29555cb6aede80729533ce4537280be1', 'm-imgc': '/Q-A-29555cb6aede80729533ce4537280be1',
};

// 已依新範本完成的頁面
const DONE = new Set(['basics', 'quick-start', 'models', 'faq', 'changelog', 'contact']);

// 由 SECTIONS 建立頁面索引
const PAGES = { home: { t: '首頁', crumb: [] } };
const CATS = {};
const ORDER = [];
SECTIONS.forEach((sec) => sec.rows.forEach((r) => {
  if (r.groups) {
    CATS[r.id] = r;
    PAGES[r.id] = { t: r.t, crumb: [sec.label], cat: r.id };
    ORDER.push(r.id);
    r.groups.forEach((g) => g.items.forEach(([id, t, tag]) => {
      PAGES[id] = { t, tag, crumb: [sec.label, r.t], cat: r.id };
      ORDER.push(id);
    }));
  } else {
    PAGES[r.id] = { t: r.t, tag: r.tag, crumb: [sec.label] };
    ORDER.push(r.id);
  }
}));

// ---------------------------------------------------------
// 左側目錄
// ---------------------------------------------------------
const root = document.documentElement;
const side = document.getElementById('side');
const view = document.getElementById('view');
const toc = document.getElementById('toc');

const tagHtml = (tag) => (tag ? `<span class="tag">${esc(tag)}</span>` : '');

function navRow(r) {
  if (!r.groups) {
    return `<a class="nav-row" href="#${r.id}" data-id="${r.id}">${ic(r.icon)}<span class="lbl">${esc(r.t)}</span>${tagHtml(r.tag)}</a>`;
  }
  const many = r.groups.length > 1;
  const kids = r.groups.map((g) =>
    (many && g.g ? `<div class="sub-label">${esc(g.g)}</div>` : '') +
    g.items.map(([id, t, tag]) => `<a class="nav-child" href="#${id}" data-id="${id}"><span>${esc(t)}</span>${tagHtml(tag)}</a>`).join('')
  ).join('');
  return `<div class="nav-cat" data-cat="${r.id}">
    <div class="nav-row cat-row">
      <a class="cat-link" href="#${r.id}" data-id="${r.id}">${ic(r.icon)}<span class="lbl">${esc(r.t)}</span>${tagHtml(r.tag)}</a>
      ${kids ? `<button class="cat-toggle" type="button" aria-expanded="false" aria-label="展開${esc(r.t)}">${ic('chev', 'ic chev')}</button>` : ''}
    </div>
    ${kids ? `<div class="nav-children"><div class="nav-children-in">${kids}</div></div>` : ''}
  </div>`;
}

side.innerHTML =
  `<a class="nav-row" href="#home" data-id="home">${ic('home')}<span class="lbl">首頁</span></a>` +
  SECTIONS.map((sec) => `<div class="nav-sec"><div class="nav-sec-label">${sec.label}</div>${sec.rows.map(navRow).join('')}</div>`).join('') +
  `<div class="side-foot"><b>找不到答案？</b>寫信到 support@moonshine.ai，或<a href="https://lin.ee/PpA769D" target="_blank" rel="noopener">加入 LINE 社群</a>詢問。</div>`;

function setOpen(cat, open) {
  cat.classList.toggle('open', open);
  const b = cat.querySelector('.cat-toggle');
  if (b) {
    b.setAttribute('aria-expanded', String(open));
    b.setAttribute('aria-label', (open ? '收合' : '展開') + cat.querySelector('.lbl').textContent);
  }
}
side.addEventListener('click', (e) => {
  const b = e.target.closest('.cat-toggle');
  if (b) { const c = b.closest('.nav-cat'); setOpen(c, !c.classList.contains('open')); }
});

// ---------------------------------------------------------
// 2. 頁面內容
// ---------------------------------------------------------
const shot = (label, ratio) => `<div class="shot" style="aspect-ratio:${ratio}"><div><strong>截圖待替換</strong>${esc(label)}</div></div>`;

function crumb(id) {
  const p = PAGES[id];
  if (!p.crumb.length) return '';
  const parts = p.crumb.map((c, i) => (i === 1 && p.cat ? `<a href="#${p.cat}">${esc(c)}</a>` : `<span>${esc(c)}</span>`));
  return `<nav class="crumb" aria-label="目前位置">${parts.join('<span class="sep">/</span>')}</nav>`;
}

const card = (href, icon, title, desc, tag) =>
  `<a class="card" href="${href}"><span class="tile">${ic(icon)}</span><b>${esc(title)}${tagHtml(tag)}</b><span class="d">${esc(desc)}</span></a>`;

const VIEWS = {
  home: () => `
    <section class="hero">
      <div class="eyebrow">MOONLAND.AI 說明中心</div>
      <h1><span class="seg">從第一張圖到團隊管理，</span><span class="seg"><em>所有操作</em>都查得到</span></h1>
      <p>交談、圖片、影片、實驗室與團隊後台的官方教學。不知道從哪裡開始？直接搜尋你想做的事。</p>
      <button class="hero-search" type="button" data-open-search>${ic('search')}<span class="sp-text">例如：圖片轉影片、ControlNet、點數</span><kbd>Ctrl K</kbd></button>
      <div class="popular">熱門：<a href="#c-basics">交談介紹</a><a href="#basics">第一張圖片</a><a href="#v-i2v">圖片生成影片</a><a href="#l-cn">ControlNet</a><a href="#credits">點數怎麼算</a></div>
    </section>

    <h2 id="h-path">依你的程度開始</h2>
    <div class="grid">
      ${card('#quick-start', 'rocket', '第一次使用', '五分鐘走完登入、用交談生成第一張圖、再把它變成影片。', '新手')}
      ${card('#lab', 'flask', '想要更多控制', '到實驗室用 LoRA、ControlNet 精修角度、光線與風格。')}
      ${card('#team', 'users', '管理團隊', '邀請成員、分配點數、管理專案，以及管理員六堂課。')}
    </div>

    <h2 id="h-tools">創作工具</h2>
    <div class="grid">
      ${card('#chat', 'chat', '交談', '用對話生成與編輯圖片，最容易上手。')}
      ${card('#image', 'image', '圖片生成', '用文字或參考圖生成、放大、拓展圖片。')}
      ${card('#video', 'video', '影片生成', '圖片轉影片、動作模仿、頭尾幀連接。')}
      ${card('#lab', 'flask', '實驗室', 'LoRA、ControlNet、IP-Adapter 進階控制。')}
      ${card('#music-3d', 'music', '音樂與 3D', '生成背景音樂與 3D 模型物件。')}
      ${card('#credit-tools', 'planet', '外部模型', 'Seedance、Kling 等模型，團隊帳號限定。')}
    </div>

    <div class="sec-head"><h2 id="h-recipes">應用範例</h2><a href="#recipes">看全部 →</a></div>
    <div class="grid">
      ${card('#c-logo', 'sparkles', 'LOGO 創作', '用交談一步步生成品牌標誌。')}
      ${card('#c-pvc', 'sparkles', 'PVC 模型風格', '把角色變成公仔質感。')}
      ${card('#c-outfit', 'sparkles', '人物角色換衣', '保留人物，只換掉服裝。')}
    </div>

    <div class="sec-head"><h2 id="h-new">最近更新</h2><a href="#changelog">完整更新日誌 →</a></div>
    <div class="list">
      <a class="list-row" href="#changelog"><span class="num">2026/08/14</span><span class="list-t">內容更新</span>${ic('chev', 'ic chev')}</a>
      <a class="list-row" href="#changelog"><span class="num">2026/05/05</span><span class="list-t">內容更新</span>${ic('chev', 'ic chev')}</a>
      <a class="list-row" href="#changelog"><span class="num">2026/04/23</span><span class="list-t">部分內文附圖更新</span>${ic('chev', 'ic chev')}</a>
    </div>`,

  'quick-start': () => `${crumb('quick-start')}
    <h1>5 分鐘快速入門</h1>
    <div class="meta"><span class="chip brand">新手</span><span class="chip">約 5 分鐘</span></div>
    <p class="lead">第一次使用 moonland.ai？照這個順序走，五分鐘內生成第一張圖和第一支影片。</p>
    <h2 id="h-steps">四個步驟</h2>
    <ol class="steps">
      <li><strong>登入</strong>：個人帳號直接登入；拿到體驗帳號請看<a href="#trial-login">體驗帳號登入方式</a>，團隊成員請看<a href="#a-login">團隊註冊與登入方式</a>。</li>
      <li><strong>用交談生成第一張圖</strong>：在交談輸入一句話，例如「一隻虎斑貓頭上戴著斗笠」。詳見<a href="#c-basics">交談介紹</a>。</li>
      <li><strong>調整細節</strong>：對結果不滿意，直接在交談裡告訴 AI 要改哪裡，或用<a href="#c-edit">編輯功能</a>局部修改。</li>
      <li><strong>把圖片變成影片</strong>：到<a href="#v-i2v">圖片生成影片（i2v）</a>讓畫面動起來。</li>
    </ol>
    <h2 id="h-next">接下來可以看</h2>
    <div class="grid c2">
      ${card('#basics', 'image', '圖片生成基礎介紹', '自己選模型、寫提示詞。')}
      ${card('#models', 'layers', '模型指南', '不知道該選哪個模型時看這裡。')}
    </div>`,

  basics: () => `${crumb('basics')}
    <h1>圖片生成基礎介紹</h1>
    <div class="meta"><span class="chip brand">新手</span><span class="chip">功能介紹</span><span class="chip">適用 FLUX.2</span><span class="chip">約 3 分鐘</span><span class="chip">更新 2026/08/14</span></div>
    <div class="callout"><b>你會學到</b>進入圖片生成介面、選擇模型、寫出有效的提示詞，並送出第一張圖。</div>
    <h2 id="h-ui">進入圖片生成介面</h2>
    <ol class="steps">
      <li>進入 moonland.ai 網站後，點選左側選單的「生成」。</li>
      <li>在畫面下方切換到「圖片」。</li>
      <li>選擇模型。這篇以「FLUX.2」為例。${shot('圖片生成介面：「生成」選單、「圖片」分頁與模型選單', '1920/863')}</li>
      <li>確認生成模式和模型都選好後，就可以開始生成。</li>
    </ol>
    <h2 id="h-prompt">撰寫提示詞</h2>
    <p>在提示詞欄位輸入想生成的內容。描述得越完整，結果越接近你想要的畫面。</p>
    <div class="callout warn"><b>提示詞至少要兩個詞</b>提示詞是 AI 生成時最重要的依據。請至少用兩個以上的詞描述，並具體寫出希望畫面裡出現的物件。</div>
    <p>如果不確定怎麼寫，可以點「提示詞自動修飾」，AI 會依照你選的模型改寫提示詞。詳細用法請看<a href="#img-prompt">提示詞助手</a>。</p>
    ${shot('提示詞欄位與「提示詞自動修飾」按鈕', '1911/863')}
    <h2 id="h-ex">提示詞範例</h2>
    <div class="tbl"><table><thead><tr><th>提示詞</th><th>重點</th></tr></thead><tbody>
      <tr><td>一隻虎斑貓頭上戴著斗笠</td><td>主體 ＋ 配件</td></tr>
      <tr><td>一隻鸚鵡嘴裡叼著一根湯匙</td><td>主體 ＋ 動作</td></tr>
      <tr><td>一位美麗的亞洲模特兒身穿禮服在走秀</td><td>主體 ＋ 服裝 ＋ 場景</td></tr>
    </tbody></table></div>
    <div class="figs">
      <figure>${shot('虎斑貓戴斗笠', '512/689')}<figcaption>虎斑貓戴斗笠</figcaption></figure>
      <figure>${shot('鸚鵡叼湯匙', '512/689')}<figcaption>鸚鵡叼湯匙</figcaption></figure>
      <figure>${shot('模特兒走秀', '512/689')}<figcaption>模特兒走秀</figcaption></figure>
    </div>
    <h2 id="h-next">下一步</h2>
    <ul>
      <li><a href="#img-prompt">提示詞助手</a>：讓 AI 幫你把提示詞寫得更完整</li>
      <li><a href="#v-i2v">圖片生成影片（i2v）</a>：把生成的圖片變成影片</li>
    </ul>`,

  models: () => `${crumb('models')}
    <div class="cat-head"><span class="cat-icon">${ic('layers')}</span><h1>模型指南</h1></div>
    <p class="lead">依用途比較各模型的擅長項目、輸入方式與耗點。每一列連到對應教學。</p>
    <div class="callout warn"><b>表格待補</b>模型與數值請依 Notion「圖片模型大彙整」「影片模型差異介紹」等原文填入。</div>
    <h2 id="h-img">圖片模型</h2>
    <div class="tbl"><table><thead><tr><th>模型</th><th>擅長</th><th>輸入</th><th>速度</th><th>耗點</th></tr></thead><tbody>
      <tr><td><a href="#basics">FLUX.2</a></td><td>通用、寫實</td><td>文字、參考圖</td><td>待填</td><td>待填</td></tr>
      <tr><td>FLUX.2 [Klein]</td><td>快速生成、圖片編輯、風格轉換</td><td>文字、圖片</td><td>快</td><td>待填</td></tr>
      <tr><td>Z-Image</td><td>寫實、人物、文字生成</td><td>文字</td><td>快</td><td>待填</td></tr>
    </tbody></table></div>
    <h2 id="h-vid">影片模型</h2>
    <div class="tbl"><table><thead><tr><th>模型</th><th>擅長</th><th>輸入</th><th>長度</th><th>耗點</th></tr></thead><tbody>
      <tr><td>待填</td><td></td><td></td><td></td><td></td></tr>
    </tbody></table></div>
    <h2 id="h-pages">詳細比較</h2>
    <div class="list">${CATS.models.groups[0].items.map(([id, t]) => `<a class="list-row" href="#${id}"><span class="list-t">${esc(t)}</span><span class="chip todo">待搬移</span>${ic('chev', 'ic chev')}</a>`).join('')}</div>`,

  faq: () => `${crumb('faq')}
    <h1>常見問題</h1>
    <p class="lead">生成不如預期、點數與帳號相關的常見問題。答案保持簡短，詳細步驟連到教學文章。</p>
    <h2 id="h-gen">生成相關</h2>
    <details class="qa"><summary>生成結果和我想的不一樣，怎麼辦？</summary><div>先檢查提示詞是否具體寫出主體、動作和場景，或用「提示詞自動修飾」改寫。詳見<a href="#basics">圖片生成基礎介紹</a>。</div></details>
    <details class="qa"><summary>不知道該選哪個模型？</summary><div>到<a href="#models">模型指南</a>依用途比較各模型的擅長項目與耗點。</div></details>
    <h2 id="h-acc">點數與帳號</h2>
    <details class="qa"><summary>團隊的點數怎麼分配給成員？</summary><div>請看<a href="#a-credits">團隊共用點數分配</a>。</div></details>
    <details class="qa"><summary>外部模型（登月幣工具）為什麼不能用？</summary><div>目前僅開放團隊帳號，如需開通請<a href="#contact">聯絡我們</a>。</div></details>`,

  changelog: () => `${crumb('changelog')}
    <h1>更新日誌</h1>
    <p class="lead">說明中心與平台功能的更新紀錄，新的在最上面。</p>
    <div class="list">
      ${[['2026/08/14', '內容更新', ''], ['2026/05/05', '內容更新', ''], ['2026/04/23', '部分內文附圖更新', '介面更新'], ['2026/03/12', '內容更新', ''], ['2026/03/08', '介面圖文更新', '介面更新'], ['2026/02/03', '介面圖文更新', '介面更新']]
        .map(([d, t, tag]) => `<div class="list-row"><span class="num">${d}</span><span class="list-t">${t}</span>${tag ? `<span class="chip">${tag}</span>` : ''}</div>`).join('')}
    </div>`,

  contact: () => `${crumb('contact')}
    <h1>聯絡我們</h1>
    <p class="lead">我們可以協助線上或線下的教育訓練課程，也歡迎洽詢客製化技術支援。</p>
    <div class="tbl"><table><tbody>
      <tr><th>E-mail</th><td>support@moonshine.ai</td></tr>
      <tr><th>電話</th><td>(+886) 02-2785-3069</td></tr>
      <tr><th>LINE 社群</th><td>ID：@588katjx・<a href="https://lin.ee/PpA769D" target="_blank" rel="noopener">加入社群</a></td></tr>
      <tr><th>價目表</th><td><a href="https://moonland.ai/pricing?direct" target="_blank" rel="noopener">moonland.ai/pricing</a></td></tr>
    </tbody></table></div>`,
};

function catView(id) {
  const c = CATS[id];
  let h = `${crumb(id)}<div class="cat-head"><span class="cat-icon">${ic(c.icon)}</span><h1>${esc(c.t)}</h1>${tagHtml(c.tag)}</div><p class="lead">${esc(c.d)}</p>`;
  if (!c.groups.length) {
    return h + `<div class="callout"><b>目前僅開放團隊帳號</b>如需開通，請<a href="#contact">聯絡我們</a>。${NOTION[id] ? ` 也可以先看 <a href="${NOTION_BASE + NOTION[id]}" target="_blank" rel="noopener">Notion 原文</a>。` : ''}</div>`;
  }
  c.groups.forEach((g, i) => {
    h += `<h2 id="g${i}">${esc(g.g || '所有文章')}</h2><div class="list">` +
      g.items.map(([aid, t, tag]) => `<a class="list-row" href="#${aid}"><span class="list-t">${esc(t)}</span>${tag ? `<span class="chip brand">${esc(tag)}</span>` : ''}${DONE.has(aid) ? '' : '<span class="chip todo">待搬移</span>'}${ic('chev', 'ic chev')}</a>`).join('') +
      `</div>`;
  });
  return h;
}

function stub(id) {
  const p = PAGES[id];
  const n = NOTION[id];
  return `${crumb(id)}<h1>${esc(p.t)}</h1>
    <div class="callout warn"><b>這篇還沒搬到新網站</b>內容整理中。${n ? ` <a href="${NOTION_BASE + n}" target="_blank" rel="noopener">先看 Notion 原文 ${ic('ext', 'ic sm')}</a>` : ''}</div>`;
}

function pager(id) {
  const i = ORDER.indexOf(id);
  if (i < 0) return '';
  const p = ORDER[i - 1], n = ORDER[i + 1];
  return `<nav class="pager" aria-label="上一篇與下一篇">${p ? `<a href="#${p}"><small>上一篇</small>${esc(PAGES[p].t)}</a>` : ''}${n ? `<a class="next" href="#${n}"><small>下一篇</small>${esc(PAGES[n].t)}</a>` : ''}</nav>`;
}
const feedback = () => `<div class="feedback">這篇有幫助嗎？<button type="button" aria-pressed="false">有幫助</button><button type="button" aria-pressed="false">還需要改進</button></div>`;

// ---------------------------------------------------------
// 3. 路由、本頁目錄
// ---------------------------------------------------------
function render() {
  let id = decodeURIComponent((location.hash || '#home').slice(1));
  if (!PAGES[id]) id = 'home';
  const isCat = !!CATS[id] && !VIEWS[id];
  const body = VIEWS[id] ? VIEWS[id]() : isCat ? catView(id) : stub(id);
  view.innerHTML = body + (id === 'home' ? '' : pager(id) + (CATS[id] ? '' : feedback()));
  document.body.classList.toggle('is-home', id === 'home');

  side.querySelectorAll('[data-id]').forEach((a) => (a.dataset.id === id ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  side.querySelectorAll('.cat-row').forEach((r) => r.classList.remove('cur', 'in'));
  const cat = PAGES[id].cat;
  if (cat) {
    const c = side.querySelector(`.nav-cat[data-cat="${cat}"]`);
    if (c) { setOpen(c, true); c.querySelector('.cat-row').classList.add(cat === id ? 'cur' : 'in'); }
  }
  const act = side.querySelector('[aria-current="page"]');
  if (act && getComputedStyle(side).display !== 'none') act.scrollIntoView({ block: 'nearest' });

  view.querySelectorAll('.feedback button').forEach((b) => (b.onclick = () => {
    view.querySelectorAll('.feedback button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', 'true');
  }));
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
toc.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-to]');
  if (!a) return;
  e.preventDefault();
  document.getElementById(a.dataset.to).scrollIntoView({ behavior: 'smooth' });
});
addEventListener('scroll', spy, { passive: true });

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
// 搜尋
// ---------------------------------------------------------
const dlg = document.getElementById('dlg');
const q = document.getElementById('q');
const results = document.getElementById('results');
let INDEX = null;
function buildIndex() {
  INDEX = Object.keys(PAGES).filter((k) => k !== 'home').map((k) => {
    const p = PAGES[k];
    const text = VIEWS[k] ? VIEWS[k]().replace(/<[^>]+>/g, ' ') : CATS[k] ? CATS[k].d : '';
    return { k, t: p.t, path: p.crumb.join(' / '), hay: (p.t + ' ' + p.crumb.join(' ') + ' ' + text).toLowerCase() };
  });
}
let sel = 0;
function search() {
  const s = q.value.trim().toLowerCase();
  if (!s) { results.innerHTML = '<p>輸入關鍵字，搜尋所有文章的標題與內文。</p>'; return; }
  const words = s.split(/\s+/);
  const r = INDEX
    .filter((x) => words.every((w) => x.hay.includes(w)))
    .sort((a, b) => (b.t.toLowerCase().includes(s) - a.t.toLowerCase().includes(s)))
    .slice(0, 12);
  sel = 0;
  results.innerHTML = r.length
    ? r.map((x, i) => `<a href="#${x.k}" role="option" class="${i ? '' : 'sel'}">${esc(x.t)}<small>${esc(x.path)}</small></a>`).join('')
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
