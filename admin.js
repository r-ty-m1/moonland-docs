// 說明中心回饋後台：讀取 Google 試算表（config.js 有設網址時）或 /api/feedback，整理成統計與意見列表。
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
const filter = { type: '', page: '', q: '' };

// ---------- 讀取 ----------
async function load() {
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
  // 同一個人對同一篇改過票時，只算最後一次
  const latest = new Map();
  entries.filter((e) => e.kind === 'vote').forEach((v) => latest.set(`${v.vid || v.id}|${v.page}`, v));
  const votes = [...latest.values()];
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

  adm.innerHTML = `
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
  if (e.target.id === 'fType') { filter.type = e.target.value; drawNotes(); }
  if (e.target.id === 'fPage') { filter.page = e.target.value; drawNotes(); }
});
adm.addEventListener('input', (e) => { if (e.target.id === 'fQ') { filter.q = e.target.value; drawNotes(); } });
adm.addEventListener('click', (e) => {
  if (e.target.id === 'reload') { load(); return; }
  if (e.target.id === 'csv') { exportCsv(); return; }
  const p = e.target.closest('[data-page]');
  if (p) {
    e.preventDefault();
    Object.assign(filter, { page: p.dataset.page, type: '', q: '' });
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
