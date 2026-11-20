// 說明中心回饋後台：讀取 Google 試算表（config.js 有設網址時）或 /api/feedback，整理成統計與意見列表。
// 「閱讀流量」分頁（#views）讀 /api/views：每篇的瀏覽、訪客、閱讀時間、讀到最後的比例、來源、搜尋找不到的字（server/views.js）。
// 兩者都沒有（GitHub Pages 預覽）時，改顯示示範資料，加上這台電腦在說明中心送出的回饋。
'use strict';

const GOOGLE_URL = (window.SITE_CONFIG && window.SITE_CONFIG.googleScriptUrl) || '';
const TYPES = { stuck: '照著做還是卡住', unclear: '看完還是不懂', suggest: '建議改進', other: '其他' };
const SITE = { '': '整個網站' };
const SITE_KEY = '_site';   // 篩選選單裡「整個網站」的值（空字串已代表「全部頁面」）
const pageKey = (id) => id || SITE_KEY;
const adm = document.getElementById('adm');
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const fmtDate = (iso) => new Date(iso).toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
const TOKEN_KEY = 'ml-admin-token';

let entries = [];
let mode = 'server';
let tab = location.hash === '#views' ? 'views' : 'fb';
const vf = { days: 30, staff: false, sort: 'views', dir: -1 };
let vdata = null;
const tabsHtml = () => `<nav class="adm-tabs" aria-label="後台分頁"><a href="#feedback"${tab === 'fb' ? ' aria-current="page"' : ''}>意見回饋</a><a href="#views"${tab === 'views' ? ' aria-current="page"' : ''}>閱讀流量</a></nav>`;
const authHeaders = () => { let t = ''; try { t = sessionStorage.getItem(TOKEN_KEY) || ''; } catch (e) {} return t ? { authorization: `Bearer ${t}` } : {}; };
const filter = { type: '', page: '', q: '' };

// ---------- 讀取 ----------
async function load() {
  if (tab === 'views') return loadViews();
  let token = '';
  try { token = sessionStorage.getItem(TOKEN_KEY) || ''; } catch (e) {}
  if (GOOGLE_URL) return loadGoogle(token);
  let r;
  try {
    r = await fetch('api/feedback', { headers: token ? { authorization: `Bearer ${token}` } : {}, cache: 'no-store' });
  } catch (e) { r = null; }
  if (r && r.ok) {
    entries = (await r.json()).entries;
    mode = 'server';
  } else if (r && r.status === 401) {
    return askToken(!!token);
  } else {
    // 沒有回饋伺服器（GitHub Pages 預覽）
    mode = 'preview';
    let local = [];
    try { local = JSON.parse(localStorage.getItem('ml-feedback-preview') || '[]'); } catch (e) {}
    entries = demoEntries().concat(local);
  }
  entries.sort((a, b) => (a.at < b.at ? -1 : 1));
  draw();
}

// 回饋存在 Google 試算表（config.js 的 googleScriptUrl，見 google-apps-script/README.md）
async function loadGoogle(token) {
  if (!token) return askToken(false);
  let data = null;
  try {
    // 用 text/plain 送出，Apps Script 才收得到（不會觸發跨網域預檢）
    const r = await fetch(GOOGLE_URL, { method: 'POST', body: JSON.stringify({ action: 'list', token }) });
    data = await r.json();
  } catch (e) { data = null; }
  if (data && data.error === 'unauthorized') return askToken(true);
  if (!data || !Array.isArray(data.entries)) {
    adm.innerHTML = '<p class="adm-err" role="alert">讀不到 Google 試算表，請確認 config.js 的網址正確、Apps Script 已部署成「所有人」可存取。</p>';
    return;
  }
  entries = data.entries;
  mode = 'google';
  entries.sort((a, b) => (a.at < b.at ? -1 : 1));
  draw();
}

function askToken(wrong) {
  adm.innerHTML = `<form class="adm-login" id="login">
    <h1>回饋後台</h1>
    <p>請輸入後台密碼。</p>
    <input type="password" name="token" autocomplete="current-password" aria-label="後台密碼" required>
    ${wrong ? '<p class="adm-err" role="alert">密碼不正確，請再試一次。</p>' : ''}
    <button type="submit">進入</button>
  </form>`;
  const f = document.getElementById('login');
  f.token.focus();
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    try { sessionStorage.setItem(TOKEN_KEY, f.token.value); } catch (err) {}
    load();
  });
}

// ---------- 統計 ----------
function stats() {
  const notes = entries.filter((e) => e.kind === 'note');
  // 同一個人對同一篇改過票時，只算最後一次；最後一次是取消（none）就不計
  const latest = new Map();
  entries.filter((e) => e.kind === 'vote').forEach((v) => latest.set(`${v.vid || v.id}|${v.page}`, v));
  const votes = [...latest.values()].filter((v) => v.value === 'up' || v.value === 'down');
  const pages = new Map();
  const row = (id, title) => {
    if (!pages.has(id)) pages.set(id, { id, title: title || SITE[id] || id, up: 0, down: 0, notes: 0 });
    const p = pages.get(id);
    if (title) p.title = title;
    return p;
  };
  votes.forEach((v) => { row(v.page, v.pageTitle)[v.value]++; });
  notes.forEach((n) => { row(n.page || '', n.pageTitle).notes++; });
  const byType = Object.keys(TYPES).map((k) => [k, notes.filter((n) => n.type === k).length]);
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
  return {
    notes,
    up: votes.filter((v) => v.value === 'up').length,
    down: votes.filter((v) => v.value === 'down').length,
    recent: notes.filter((n) => n.at >= weekAgo).length,
    byType,
    pages: [...pages.values()].sort((a, b) => b.down - a.down || b.notes - a.notes || b.up - a.up),
  };
}

// ---------- 畫面 ----------
function draw() {
  const s = stats();
  const votes = s.up + s.down;
  const worst = s.pages.find((p) => p.down > 0);
  const maxType = Math.max(1, ...s.byType.map(([, n]) => n));
  const pageOpts = s.pages.filter((p) => p.notes).map((p) => `<option value="${esc(pageKey(p.id))}"${pageKey(p.id) === filter.page ? ' selected' : ''}>${esc(p.title)}</option>`).join('');

  adm.innerHTML = `${tabsHtml()}
    ${mode === 'preview' ? `<div class="adm-banner" role="note"><b>預覽模式</b>這裡沒有回饋伺服器（例如 GitHub Pages），以下是<strong>示範資料</strong>，加上這台電腦在說明中心送出的回饋。部署到公司伺服器後，會改成顯示所有人送出的真實回饋。</div>` : ''}
    <div class="adm-head">
      <h1>回饋總覽</h1>
      <button type="button" class="adm-btn" id="reload">重新整理</button>
    </div>

    <div class="adm-tiles">
      <div class="adm-tile"><small>文字意見</small><b>${s.notes.length}</b><span>近 7 天 ${s.recent} 則</span></div>
      <div class="adm-tile"><small>有幫助比例</small><b>${votes ? pct(s.up, votes) + '%' : '—'}</b><span>共 ${votes} 票</span></div>
      <div class="adm-tile"><small>有幫助／需改進</small><b>${s.up}<em>／</em>${s.down}</b><span>每人每篇只算最後一票</span></div>
      <div class="adm-tile"><small>最多人說需改進</small><b class="adm-tile-page">${worst ? `<a href="./#${esc(worst.id)}" target="_blank" rel="noopener">${esc(worst.title)}</a>` : '—'}</b><span>${worst ? `${worst.down} 票需改進` : '目前沒有'}</span></div>
    </div>

    <section>
      <h2>意見類型</h2>
      <table class="adm-table adm-types">
        <thead><tr><th scope="col">類型</th><th scope="col">則數</th><th scope="col"><span class="vh">比例</span></th></tr></thead>
        <tbody>${s.byType.map(([k, n]) => `<tr><th scope="row">${TYPES[k]}</th><td class="num">${n}</td>
          <td class="bar-cell">${n ? `<span class="bar" style="width:${(n / maxType) * 100}%" title="${TYPES[k]}：${n} 則（${pct(n, s.notes.length)}%）"></span>` : ''}</td></tr>`).join('')}</tbody>
      </table>
    </section>

    <section>
      <h2>各頁回饋</h2>
      <p class="adm-hint">依「需改進」票數排序，最需要修改的頁面在最上面。</p>
      ${s.pages.length ? `<table class="adm-table adm-pages">
        <thead><tr><th scope="col">頁面</th><th scope="col">有幫助</th><th scope="col">需改進</th><th scope="col">有幫助比例</th><th scope="col">文字意見</th></tr></thead>
        <tbody>${s.pages.map((p) => `<tr>
          <th scope="row" data-label="頁面">${p.id ? `<a href="./#${esc(p.id)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title)}</th>
          <td class="num" data-label="有幫助">${p.up}</td>
          <td class="num" data-label="需改進">${p.down}</td>
          <td class="num" data-label="有幫助比例">${p.up + p.down ? pct(p.up, p.up + p.down) + '%' : '—'}</td>
          <td class="num" data-label="文字意見">${p.notes ? `<a href="#list" data-page="${esc(pageKey(p.id))}">${p.notes}</a>` : 0}</td>
        </tr>`).join('')}</tbody>
      </table>` : '<p class="adm-empty">還沒有任何回饋。</p>'}
    </section>

    <section id="list">
      <div class="adm-head"><h2>意見列表</h2><button type="button" class="adm-btn" id="csv">匯出 CSV</button></div>
      <div class="adm-filters">
        <label><span>類型</span><select id="fType"><option value="">全部類型</option>${Object.entries(TYPES).map(([k, t]) => `<option value="${k}"${k === filter.type ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
        <label><span>頁面</span><select id="fPage"><option value="">全部頁面</option>${pageOpts}</select></label>
        <label class="grow"><span>關鍵字</span><input id="fQ" type="search" value="${esc(filter.q)}" placeholder="搜尋意見內容"></label>
      </div>
      <div id="notes"></div>
    </section>`;
  drawNotes();
}

function filteredNotes() {
  const q = filter.q.trim().toLowerCase();
  return entries.filter((e) => e.kind === 'note'
    && (!filter.type || e.type === filter.type)
    && (!filter.page || pageKey(e.page) === filter.page)
    && (!q || `${e.message} ${e.contact} ${e.pageTitle}`.toLowerCase().includes(q))).reverse();
}

function drawNotes() {
  const list = filteredNotes();
  document.getElementById('notes').innerHTML = list.length
    ? `<p class="adm-hint">共 ${list.length} 則，最新的在最上面。</p><ul class="adm-notes">${list.map((n) => `<li>
        <div class="meta"><span class="tag">${esc(TYPES[n.type] || n.type)}</span>
          ${n.page ? `<a href="./#${esc(n.page)}" target="_blank" rel="noopener">${esc(n.pageTitle || n.page)}</a>` : '<span>整個網站</span>'}
          ${n.lang === 'en' ? '<span class="demo">英文版</span>' : ''}<time datetime="${esc(n.at)}">${fmtDate(n.at)}</time>${n.demo ? '<span class="demo">示範</span>' : ''}</div>
        <p>${esc(n.message)}</p>
        ${n.contact ? `<div class="contact">聯絡方式：${esc(n.contact)}</div>` : ''}
      </li>`).join('')}</ul>`
    : '<p class="adm-empty">沒有符合條件的意見。</p>';
}

adm.addEventListener('change', (e) => {
  if (e.target.id === 'vStaff') { vf.staff = e.target.checked; loadViews(); return; }
  if (e.target.id === 'fType') { filter.type = e.target.value; drawNotes(); }
  if (e.target.id === 'fPage') { filter.page = e.target.value; drawNotes(); }
});
adm.addEventListener('input', (e) => { if (e.target.id === 'fQ') { filter.q = e.target.value; drawNotes(); } });
adm.addEventListener('click', (e) => {
  const d = e.target.closest('[data-days]');
  if (d) { vf.days = +d.dataset.days; loadViews(); return; }
  const so = e.target.closest('[data-sort]');
  if (so) { const k = so.dataset.sort; vf.dir = vf.sort === k ? -vf.dir : (k === 't' ? 1 : -1); vf.sort = k; drawViews(); return; }
  if (e.target.id === 'vCsv') { viewsCsv(); return; }
  if (e.target.id === 'reload') { load(); return; }
  if (e.target.id === 'csv') { exportCsv(); return; }
  const p = e.target.closest('[data-page]');
  if (p) {
    e.preventDefault();
    Object.assign(filter, { page: p.dataset.page, type: '', q: '' });
    if (tab !== 'fb') { tab = 'fb'; history.replaceState(null, '', '#feedback'); }
    draw();
    document.getElementById('list').scrollIntoView({ behavior: 'smooth' });
  }
});

function exportCsv() {
  const cell = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
  const rows = [['時間', '類型', '頁面', '頁面代號', '內容', '聯絡方式', '語言']].concat(
    filteredNotes().map((n) => [fmtDate(n.at), TYPES[n.type] || n.type, n.pageTitle || '整個網站', n.page, n.message, n.contact, n.lang === 'en' ? '英文' : '中文']),
  );
  // 開頭加 BOM，Excel 才會用 UTF-8 開啟中文
  const blob = new Blob(['﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `moonland-說明中心回饋-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------- 閱讀流量 ----------
addEventListener('hashchange', () => {
  const t = location.hash === '#views' ? 'views' : 'fb';
  if (t === tab) return;
  tab = t;
  if (tab === 'views') loadViews(); else if (entries.length || mode !== 'server') draw(); else load();
});
async function loadViews() {
  adm.innerHTML = `${tabsHtml()}<p class="adm-loading">讀取中…</p>`;
  let r;
  try { r = await fetch(`api/views?days=${vf.days}${vf.staff ? '&staff=1' : ''}`, { headers: authHeaders(), cache: 'no-store' }); } catch (e) { r = null; }
  if (r && r.status === 401) {
    adm.innerHTML = `${tabsHtml()}<div class="adm-login"><h1>閱讀流量</h1><p>閱讀流量要用公司帳號登入才看得到（編輯後台的編輯者都可以看）。</p><a class="adm-btn adm-go" href="edit.html#pages" target="_blank" rel="noopener">到編輯後台登入</a><p class="adm-hint">登入後回到這裡，按「重新整理」或重新打開這頁。</p><button type="button" class="adm-btn" id="reload">重新整理</button></div>`;
    return;
  }
  if (!r || !r.ok || !(r.headers.get('content-type') || '').includes('json')) {
    vdata = null;
    adm.innerHTML = `${tabsHtml()}<div class="adm-banner" role="note"><b>預覽模式</b>這裡沒有網站伺服器（例如 GitHub Pages），沒有閱讀流量。部署到公司網站後，說明中心才會開始記錄。</div>`;
    return;
  }
  vdata = await r.json();
  // 「回饋」欄要用到意見與投票：直接從這個分頁進來時順便讀
  if (!entries.length && !GOOGLE_URL) {
    try { const f = await fetch('api/feedback', { headers: authHeaders(), cache: 'no-store' }); if (f.ok) entries = (await f.json()).entries || []; } catch (e) {}
  }
  drawViews();
}
const SRC_LABEL = { direct: '直接打開（書籤、網址列、其他 App）', internal: '在說明中心裡點過來', platform: 'moonland.ai 平台', google: 'Google 搜尋', engine: '其他搜尋引擎', jiji: '吉吉推薦', search: '說明中心的搜尋' };
const srcLabel = (k) => SRC_LABEL[k] || (k.startsWith('other:') ? `其他網站：${k.slice(6)}` : k);
const dur = (s) => (s >= 60 ? `${Math.floor(s / 60)} 分 ${s % 60} 秒` : `${s} 秒`);
const dayLabel = (d) => d.slice(5).replace('-', '/');
function fillDays(daily) {
  if (!daily.length) return [];
  const map = new Map(daily.map((x) => [x.d, x]));
  const first = vf.days ? vdata.since.slice(0, 10) : daily[0].d;
  const start = vf.days ? new Date(Date.parse(vdata.since) + 8 * 36e5) : new Date(`${first}T00:00:00Z`);
  const out = [];
  const today = new Date(Date.now() + 8 * 36e5).toISOString().slice(0, 10);
  for (let t = start.getTime(); ; t += 864e5) {
    const d = new Date(t).toISOString().slice(0, 10);
    out.push(map.get(d) || { d, views: 0, visitors: 0 });
    if (d >= today || out.length > 800) break;
  }
  return out;
}
function chart(days) {
  if (!days.length) return '<p class="adm-empty">這段期間還沒有人看。</p>';
  const max = Math.max(1, ...days.map((x) => x.views));
  const w = 100 / days.length;
  return `<div class="adm-chart"><div class="adm-chart-y"><span>${max}</span><span>0</span></div><div class="adm-chart-bars" role="img" aria-label="每天的瀏覽次數，最多一天 ${max} 次">${days.map((x) => `<span class="adm-col" style="width:${w}%" title="${x.d}：瀏覽 ${x.views} 次、訪客 ${x.visitors} 人"><i style="height:${(x.views / max) * 100}%"></i></span>`).join('')}</div>
    <div class="adm-chart-x"><span>${dayLabel(days[0].d)}</span>${days.length > 2 ? `<span>${dayLabel(days[Math.floor(days.length / 2)].d)}</span>` : ''}<span>${dayLabel(days[days.length - 1].d)}</span></div></div>`;
}
function fbByPage() {
  const latest = new Map();
  entries.filter((e) => e.kind === 'vote').forEach((v) => latest.set(`${v.vid || v.id}|${v.page}`, v));
  const m = new Map();
  const row = (id) => { if (!m.has(id)) m.set(id, { down: 0, notes: 0 }); return m.get(id); };
  [...latest.values()].filter((v) => v.value === 'down').forEach((v) => row(v.page).down++);
  entries.filter((e) => e.kind === 'note' && e.page).forEach((n) => row(n.page).notes++);
  return m;
}
function sortedPages() {
  const k = vf.sort;
  return [...vdata.pages].sort((a, b) => (k === 't' ? a.t.localeCompare(b.t, 'zh-Hant') : a[k] - b[k]) * vf.dir || b.views - a.views);
}
function drawViews() {
  const v = vdata;
  const t = v.totals;
  const fb = fbByPage();
  const days = fillDays(v.daily);
  const maxSrc = Math.max(1, ...v.sources.map((x) => x.n));
  const th = (k, label) => `<th scope="col"><button type="button" class="adm-sort" data-sort="${k}" aria-label="依${label}排序">${label}${vf.sort === k ? (vf.dir < 0 ? ' ↓' : ' ↑') : ''}</button></th>`;
  adm.innerHTML = `${tabsHtml()}
    <div class="adm-head">
      <h1>閱讀流量</h1>
      <div class="adm-acts"><div class="adm-seg" role="group" aria-label="期間">${[[7, '7 天'], [30, '30 天'], [90, '90 天'], [0, '全部']].map(([d, l]) => `<button type="button" data-days="${d}" aria-pressed="${vf.days === d}">${l}</button>`).join('')}</div>
      <button type="button" class="adm-btn" id="reload">重新整理</button></div>
    </div>
    <p class="adm-hint">${v.first ? `最早一筆紀錄是 ${fmtDate(v.first)}。` : '還沒有任何紀錄，部署後說明中心有人看文章就會開始累積。'}停留不到 3 秒的不算；一個訪客是一個瀏覽器。
      <label class="adm-check"><input type="checkbox" id="vStaff"${vf.staff ? ' checked' : ''}> 包含編輯者自己看的（在這台瀏覽器登入過編輯後台的人）</label></p>
    <div class="adm-tiles">
      <div class="adm-tile"><small>瀏覽次數</small><b>${t.views}</b><span>${vf.days ? `最近 ${vf.days} 天` : '全部期間'}</span></div>
      <div class="adm-tile"><small>訪客</small><b>${t.visitors}</b><span>不同的瀏覽器</span></div>
      <div class="adm-tile"><small>平均閱讀時間</small><b>${t.views ? dur(t.avgSec) : '—'}</b><span>超過 30 分鐘的算 30 分鐘</span></div>
      <div class="adm-tile"><small>讀到最後</small><b>${t.views ? t.endPct + '%' : '—'}</b><span>捲到頁面九成以上</span></div>
    </div>

    <section><h2>每天的瀏覽次數</h2><p class="adm-hint">滑鼠移到長條上可以看當天的瀏覽與訪客。</p>${chart(days)}</section>

    <section>
      <div class="adm-head"><h2>各頁閱讀</h2><button type="button" class="adm-btn" id="vCsv"${v.pages.length ? '' : ' disabled'}>匯出 CSV</button></div>
      <p class="adm-hint">點欄位名稱可以排序。「讀到最後」低、「需改進」多的頁面，可能值得重寫或拆短。</p>
      ${v.pages.length ? `<table class="adm-table adm-pages adm-views">
        <thead><tr>${th('t', '頁面')}${th('views', '瀏覽')}${th('visitors', '訪客')}${th('avgSec', '平均閱讀')}${th('endPct', '讀到最後')}<th scope="col">需改進／意見</th></tr></thead>
        <tbody>${sortedPages().map((p) => { const f = fb.get(p.id); return `<tr>
          <th scope="row" data-label="頁面"><a href="./#${esc(p.id)}" target="_blank" rel="noopener">${esc(p.t)}</a>${p.live ? '' : '<small class="adm-gone">已不在說明中心</small>'}</th>
          <td class="num" data-label="瀏覽">${p.views}</td>
          <td class="num" data-label="訪客">${p.visitors}</td>
          <td class="num" data-label="平均閱讀">${dur(p.avgSec)}</td>
          <td class="num" data-label="讀到最後">${p.endPct}%</td>
          <td class="num" data-label="需改進／意見">${f ? `${f.down}／${f.notes ? `<a href="#feedback" data-page="${esc(pageKey(p.id))}">${f.notes}</a>` : 0}` : '—'}</td>
        </tr>`; }).join('')}</tbody></table>` : '<p class="adm-empty">這段期間還沒有人看。</p>'}
    </section>

    ${v.unread.length && v.pages.length ? `<section><h2>這段期間沒人看的頁面（${v.unread.length}）</h2><p class="adm-hint">可能是不好找（目錄位置、標題）或用不到；也可能只是剛上線。</p>
      <ul class="adm-chips">${v.unread.map((p) => `<li><a href="./#${esc(p.id)}" target="_blank" rel="noopener">${esc(p.t)}</a></li>`).join('')}</ul></section>` : ''}

    <section><h2>從哪裡來</h2><p class="adm-hint">每次閱讀的來源。「在說明中心裡點過來」是讀者看完一篇再點到下一篇。</p>
      ${v.sources.length ? `<table class="adm-table adm-types"><tbody>${v.sources.map((s) => `<tr><th scope="row">${esc(srcLabel(s.k))}</th><td class="num">${s.n}</td><td class="bar-cell"><span class="bar" style="width:${(s.n / maxSrc) * 100}%" title="${pct(s.n, t.views)}%"></span></td></tr>`).join('')}</tbody></table>` : '<p class="adm-empty">還沒有資料。</p>'}
    </section>

    <section><h2>搜尋找不到的字</h2><p class="adm-hint">讀者在說明中心搜尋、卻沒有任何結果的關鍵字。次數多的可能是缺的文章，或文章裡沒用到讀者習慣的說法。</p>
      ${v.misses.length ? `<table class="adm-table adm-misses"><thead><tr><th scope="col">關鍵字</th><th scope="col">次數</th><th scope="col">人數</th><th scope="col">最近一次</th></tr></thead><tbody>${v.misses.map((m) => `<tr><th scope="row">${esc(m.q)}</th><td class="num">${m.n}</td><td class="num">${m.visitors}</td><td class="num">${fmtDate(m.last)}</td></tr>`).join('')}</tbody></table>` : '<p class="adm-empty">這段期間沒有找不到結果的搜尋。</p>'}
    </section>`;
}
function viewsCsv() {
  const cell = (x) => `"${String(x == null ? '' : x).replace(/"/g, '""')}"`;
  const fb = fbByPage();
  const rows = [['頁面', '頁面代號', '瀏覽', '訪客', '平均閱讀秒數', '讀到最後(%)', '需改進票', '文字意見']].concat(
    sortedPages().map((p) => { const f = fb.get(p.id) || { down: '', notes: '' }; return [p.t, p.id, p.views, p.visitors, p.avgSec, p.endPct, f.down, f.notes]; }),
  );
  const blob = new Blob(['\ufeff' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `moonland-說明中心閱讀流量-${vf.days ? `近${vf.days}天` : '全部'}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------- 示範資料（只在預覽模式出現）----------
function demoEntries() {
  const day = 864e5, now = Date.now();
  const at = (d, h) => new Date(now - d * day - h * 36e5).toISOString();
  const P = {
    'v-i2v': '圖片生成影片（i2v）', 'chat-prompts': '提示詞寫法', 'v-mimic': '動作模仿（Wan Animate 2／SCAIL 2）',
    credits: '點數與登月幣', 'admin-4': '管理員 4｜點數與登月幣分配', 'quick-start': '5 分鐘快速入門', outfit: '人物角色換衣',
  };
  const note = (d, h, type, page, message, contact) => ({ id: `demo-n${d}${h}`, demo: true, kind: 'note', at: at(d, h), type, page, pageTitle: P[page] || '', message, contact: contact || '' });
  const out = [
    note(0, 2, 'stuck', 'v-i2v', '照著步驟做，第 3 步上傳圖片後一直轉圈，等了 5 分鐘還是沒有出現影片，網站上沒有寫遇到這種情況要怎麼辦。'),
    note(0, 5, 'unclear', 'v-mimic', 'Wan Animate 2 和 SCAIL 2 的差別看不太懂，什麼情況該選哪一個？可以放兩個的比較影片嗎？'),
    note(1, 1, 'suggest', '', '希望每篇開頭有一段 30 秒的操作影片，比看截圖更快理解。', 'demo@example.com'),
    note(2, 3, 'unclear', 'credits', '點數和登月幣到底差在哪？什麼功能扣哪一種？'),
    note(3, 6, 'stuck', 'admin-4', '分配點數給成員後，成員那邊顯示的數字沒有變，不知道是不是要重新登入。'),
    note(5, 2, 'suggest', 'chat-prompts', '提示詞範例可以多一點中文版本，現在大多是英文。'),
    note(9, 4, 'other', 'quick-start', '快速入門寫得很清楚，第一次用就成功生成了，謝謝！'),
  ];
  // 各頁的投票數：[有幫助, 需改進]
  const tally = { 'v-i2v': [6, 5], 'v-mimic': [3, 4], credits: [5, 3], 'chat-prompts': [12, 2], 'admin-4': [2, 2], 'quick-start': [18, 1], outfit: [7, 0] };
  let i = 0;
  Object.entries(tally).forEach(([page, [up, down]]) => {
    for (let k = 0; k < up + down; k++) {
      out.push({ id: `demo-v${i}`, demo: true, kind: 'vote', at: at(i % 12, k), page, pageTitle: P[page], vid: `demo${i++}`, value: k < up ? 'up' : 'down' });
    }
  });
  return out;
}

load();
