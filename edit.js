// =========================================================
// 編輯後台（edit.html，示範版）
// - 登入是模擬的。正式版改成公司帳號登入，由伺服器依「員工編號名單」判斷誰能編輯
// - 所有修改只存在這台電腦的瀏覽器（localStorage ml-editor-demo），不會改到說明中心
// - 預覽用 markup.js 的 renderMarkup，和說明中心的畫面一樣
// - 網址：#pages 頁面列表、#edit/代號 編輯、#new/位置 新增、#media 圖庫、#log 修改紀錄、#trash 最近刪除、#editors 編輯者名單、#help 使用說明
// =========================================================

Object.assign(ICONS, {
  pencil: 'M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4 M13.5 6.5l4 4',
  down: 'M12 5l0 14 M18 13l-6 6 M6 13l6 6',
  trash: 'M4 7l16 0 M10 11l0 6 M14 11l0 6 M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12 M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3',
  plus: 'M12 5l0 14 M5 12l14 0',
  restore: 'M9 14l-4 -4l4 -4 M5 10h11a4 4 0 1 1 0 8h-1',
  logout: 'M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2 M9 12h12l-3 -3 M18 15l3 -3',
  bold: 'M7 5h6a3.5 3.5 0 0 1 0 7h-6z M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7',
  heading: 'M7 12h10 M7 5v14 M17 5v14 M15 19h4 M15 5h4 M5 19h4 M5 5h4',
  link: 'M9 15l6 -6 M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464 M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463',
  list: 'M9 6l11 0 M9 12l11 0 M9 18l11 0 M5 6l0 .01 M5 12l0 .01 M5 18l0 .01',
  steps: 'M11 6h9 M11 12h9 M12 18h8 M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4 M6 10v-6l-2 2',
  bulb: 'M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7 M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3 M9.7 17l4.6 0',
  alert: 'M12 9v4 M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z M12 16h.01',
  table: 'M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z M3 10h18 M10 3v18',
  prompt: 'M5 7l5 5l-5 5 M12 19l7 0',
  columns: 'M4 4h6v16h-6z M14 4h6v16h-6z',
  compare: 'M12 3v18 M8 5h-3a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h3 M16 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-3',
  folder: 'M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2',
  file: 'M14 3v4a1 1 0 0 0 1 1h4 M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z',
  lock: 'M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0 M8 11v-4a4 4 0 1 1 8 0v4',
});

const STORE = 'ml-editor-demo';
const WHO = 'ml-editor-demo-user';
const ROLES = { owner: '主管理員', editor: '編輯者' };
const OUTSIDER = { no: 'A0003', name: '陳大同' };   // 示範「登入了但不在名單上」的同事
const LEVELS = ['', '新手', '進階', '團隊'];
const ICON_CHOICES = ['rocket', 'coin', 'key', 'grid', 'chat', 'image', 'video', 'flask', 'music', 'planet', 'sparkles', 'layers', 'users', 'shield', 'help', 'history', 'mail', 'message', 'globe', 'clock'];
const app = document.getElementById('app');
const clone = (x) => JSON.parse(JSON.stringify(x));
const now = () => new Date().toISOString();
const fmt = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ---------------------------------------------------------
// 1. 資料：第一次開啟時，從說明中心目前的內容（data/*.js、data/sections.js）複製一份
//    sections：[{ label, rows: [{ id, groups?: [{ g, items: [頁面代號] }] }] }]
//    pages：{ 代號: { t 標題, n 目錄名稱, d 摘要, tag, icon, level, minutes, models, tool, body, system? } }
// ---------------------------------------------------------
function initialState() {
  const A = window.ARTICLES || {};
  const pages = {};
  const extra = (a) => ({ level: a.level || '', minutes: a.minutes || '', models: (a.models || []).join(', '), tool: a.tool || '', body: (a.body || '').replace(/^\n+/, '') });
  const sections = window.SECTIONS.map((sec) => ({
    label: sec.label,
    rows: sec.rows.map((r) => {
      const a = A[r.id] || {};
      if (r.groups) {
        pages[r.id] = { t: r.t || a.t || r.id, n: '', d: r.d || a.d || '', tag: r.tag || '', icon: r.icon, ...extra(a) };
        return { id: r.id, groups: r.groups.map((g) => ({ g: g.g, items: g.items.map(([id, n, tag]) => {
          const b = A[id] || {};
          pages[id] = { t: b.t || n, n: n === b.t ? '' : n, d: b.d || '', tag: tag || '', icon: '', ...extra(b) };
          return id;
        }) })) };
      }
      pages[r.id] = A[r.id]
        ? { t: a.t, n: r.n || a.n || '', d: a.d || '', tag: r.tag || '', icon: r.icon, ...extra(a) }
        : { t: r.t || r.id, icon: r.icon, system: true };
      return { id: r.id };
    }),
  }));
  return {
    v: 1, sections, pages, history: {}, log: [], trash: [], uploads: {}, nextMedia: 9001,
    editors: [
      { no: 'A0001', name: '王小明', role: 'owner', at: now() },
      { no: 'A0002', name: '林小華', role: 'editor', at: now() },
    ],
  };
}

let S = null;
try { S = JSON.parse(localStorage.getItem(STORE)); } catch (e) {}
if (!S || S.v !== 1) S = initialState();
Object.assign(MEDIA, S.uploads);

function persist() {
  try { localStorage.setItem(STORE, JSON.stringify(S)); return true; }
  catch (e) { toast('這台電腦的瀏覽器空間不夠，剛才的修改沒有存起來。示範版容量有限，請少放幾張大圖。'); return false; }
}

let me = null;
try { me = JSON.parse(localStorage.getItem(WHO)); } catch (e) {}
const myRole = () => { const e = me && S.editors.find((x) => x.no === me.no); return e ? e.role : null; };
function addLog(action, id, title) {
  S.log.unshift({ at: now(), by: me.name, action, id, t: title });
  S.log.length = Math.min(S.log.length, 300);
}

// ---------------------------------------------------------
// 2. 位置：頁面放在「大分類底下直接列出」(s0) 或「某個分類的某個小標底下」(c:分類代號:第幾個小標)
// ---------------------------------------------------------
function allLists() {
  const out = [];
  S.sections.forEach((sec, si) => {
    out.push({ key: `s${si}`, label: `${sec.label}（直接列在目錄上）`, arr: sec.rows, top: true });
    sec.rows.forEach((r) => (r.groups || []).forEach((g, gi) => {
      out.push({ key: `c:${r.id}:${gi}`, label: `${sec.label} › ${S.pages[r.id].t}${g.g ? ` › ${g.g}` : ''}`, arr: g.items, top: false });
    }));
  });
  return out;
}
const listOf = (key) => allLists().find((l) => l.key === key);
const idOf = (x) => (typeof x === 'string' ? x : x.id);
function locate(id) {
  for (const l of allLists()) {
    const i = l.arr.findIndex((x) => idOf(x) === id);
    if (i >= 0) return { ...l, i };
  }
  return null;
}
const rowOf = (id) => { const l = locate(id); return l && l.top ? l.arr[l.i] : null; };
const isCat = (id) => !!(rowOf(id) || {}).groups;

// 搬到另一個位置：放到該處最後面
function moveTo(id, key) {
  const from = locate(id);
  if (!from || from.key === key) return;
  const [x] = from.arr.splice(from.i, 1);
  const to = listOf(key);
  to.arr.push(to.top ? (typeof x === 'string' ? { id: x } : x) : idOf(x));
}

// ---------------------------------------------------------
// 3. 畫面共用
// ---------------------------------------------------------
const tagHtml = (tag) => (tag ? `<span class="tag">${esc(tag)}</span>` : '');
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 4000);
}
function tabs(cur) {
  const items = [['pages', '頁面'], ['media', '圖庫'], ['log', '修改紀錄'], ['trash', `最近刪除${S.trash.length ? `（${S.trash.length}）` : ''}`]];
  if (myRole() === 'owner') items.push(['editors', '編輯者名單']);
  items.push(['help', '使用說明']);
  return `<nav class="ed-tabs" aria-label="後台功能">${items.map(([k, t]) => `<a href="#${k}"${k === cur ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>`;
}
function paintWho() {
  const who = document.getElementById('who');
  if (!me) { who.innerHTML = ''; return; }
  const r = myRole();
  who.innerHTML = `<span class="ed-me"><b>${esc(me.name)}</b><small>${r ? ROLES[r] : '沒有編輯權限'}</small></span>
    <button type="button" class="icon-btn" data-act="logout" aria-label="登出" title="登出">${ic('logout')}</button>`;
}

// ---------------------------------------------------------
// 4. 登入（模擬）
// ---------------------------------------------------------
function viewLogin() {
  const people = [...S.editors, ...(S.editors.some((e) => e.no === OUTSIDER.no) ? [] : [{ ...OUTSIDER, role: null }])];
  const desc = { owner: '可以編輯頁面，也能決定誰是編輯者', editor: '可以新增、修改、刪除與排序頁面', null: '公司同事，但不在編輯者名單上' };
  return `<div class="ed-login">
    <span class="ed-login-ic">${ic('lock')}</span>
    <h1>登入編輯後台</h1>
    <p>正式版會直接用<b>公司帳號</b>登入，不用另外記密碼。</p>
    <div class="ed-note"><b>示範版還沒接上公司帳號</b>請選一個身分模擬登入，看看不同權限的人會看到什麼。</div>
    <div class="ed-people">${people.map((p) => `<button type="button" class="ed-person" data-act="login" data-no="${esc(p.no)}" data-name="${esc(p.name)}">
      <b>${esc(p.name)}<span class="chip${p.role ? ' brand' : ''}">${p.role ? ROLES[p.role] : '沒有權限'}</span></b>
      <small>員工編號 ${esc(p.no)}｜${desc[p.role]}</small></button>`).join('')}</div>
  </div>`;
}
function viewDenied() {
  return `<div class="ed-login">
    <span class="ed-login-ic">${ic('lock')}</span>
    <h1>你目前沒有編輯權限</h1>
    <p>${esc(me.name)}，你已經用公司帳號登入（員工編號 ${esc(me.no)}），但不在編輯者名單上。</p>
    <p>需要編輯說明中心的話，請主管理員把你的員工編號加進「編輯者名單」。</p>
    <p><a href="./">回到說明中心 →</a>　<button type="button" class="ed-link" data-act="logout">換個身分登入</button></p>
  </div>`;
}

// ---------------------------------------------------------
// 5. 頁面列表：新增、刪除、排序
// ---------------------------------------------------------
function badge(id) {
  const p = S.pages[id];
  if (p.isNew) return '<span class="chip ed-new">新頁面</span>';
  if (S.history[id] && S.history[id].length) return '<span class="chip ed-mod">已修改</span>';
  return '';
}
function acts(id, key, i, len, canDelete) {
  const name = esc(S.pages[id].n || S.pages[id].t);
  return `<span class="ed-acts">
    <button type="button" class="icon-btn sm" data-act="up" data-key="${key}" data-i="${i}" aria-label="把「${name}」往上移" title="往上移"${i === 0 ? ' disabled' : ''}>${ic('up')}</button>
    <button type="button" class="icon-btn sm" data-act="down" data-key="${key}" data-i="${i}" aria-label="把「${name}」往下移" title="往下移"${i === len - 1 ? ' disabled' : ''}>${ic('down')}</button>
    <button type="button" class="icon-btn sm ed-del" data-act="del" data-id="${id}" aria-label="刪除「${name}」" title="${canDelete === true ? '刪除' : esc(canDelete)}"${canDelete === true ? '' : ' disabled'}>${ic('trash')}</button>
  </span>`;
}
function itemLi(id, key, i, len) {
  const p = S.pages[id];
  if (p.system) {
    return `<li class="ed-item"><span class="ed-name is-sys">${p.icon ? ic(p.icon) : ic('file')}<span><b>${esc(p.t)}</b><small>系統頁面，內容不能在這裡修改</small></span></span>${acts(id, key, i, len, '系統頁面不能刪除')}</li>`;
  }
  return `<li class="ed-item"><a class="ed-name" href="#edit/${id}">${ic(p.icon || 'file')}<span><b>${esc(p.n || p.t)}${tagHtml(p.tag)}${badge(id)}</b>${p.n && p.n !== p.t ? `<small>${esc(p.t)}</small>` : ''}</span></a>${acts(id, key, i, len, true)}</li>`;
}
function catLi(r, key, i, len) {
  const p = S.pages[r.id];
  const count = r.groups.reduce((n, g) => n + g.items.length, 0);
  const many = r.groups.length > 1;
  return `<li class="ed-cat">
    <div class="ed-item"><a class="ed-name" href="#edit/${r.id}">${ic(p.icon || 'folder')}<span><b>${esc(p.t)}<span class="chip">分類・${count} 頁</span>${tagHtml(p.tag)}${badge(r.id)}</b></span></a>${acts(r.id, key, i, len, count ? '分類裡還有頁面，先把頁面刪除或搬走才能刪除分類' : true)}</div>
    <div class="ed-kids">${r.groups.map((g, gi) => {
      const k = `c:${r.id}:${gi}`;
      return `${many || g.g ? `<div class="ed-sub">${esc(g.g || '（沒有小標）')}</div>` : ''}
        <ul class="ed-list">${g.items.map((id, j) => itemLi(id, k, j, g.items.length)).join('')}</ul>
        <a class="ed-add" href="#new/${k}">${ic('plus')}在${esc(g.g ? `「${g.g}」` : `「${p.t}」`)}新增頁面</a>`;
    }).join('')}</div>
  </li>`;
}
function viewPages() {
  const changed = Object.keys(S.history).filter((k) => S.pages[k] && S.history[k].length).length;
  return `${tabs('pages')}
    <div class="ed-head"><div><h1>頁面</h1><p class="ed-hint">點頁面名稱開始編輯；用箭頭調整在左側目錄裡的順序。標示「已修改」「新頁面」的是這台電腦上的示範修改。</p></div></div>
    ${S.sections.map((sec, si) => `<section class="ed-sec" aria-labelledby="sec${si}">
      <div class="ed-sec-head"><h2 id="sec${si}">${esc(sec.label)}</h2>
        <button type="button" class="ed-link" data-act="rename-sec" data-si="${si}">改名稱</button></div>
      <ul class="ed-list">${sec.rows.map((r, i) => (r.groups ? catLi(r, `s${si}`, i, sec.rows.length) : itemLi(r.id, `s${si}`, i, sec.rows.length))).join('')}</ul>
      <div class="ed-adds"><a class="ed-add" href="#new/s${si}">${ic('plus')}新增頁面</a><button type="button" class="ed-add" data-act="add-cat" data-si="${si}">${ic('folder')}新增分類</button></div>
    </section>`).join('')}
    <p class="ed-hint ed-count">${changed ? `目前有 ${changed} 頁在這台電腦上改過。` : ''}</p>`;
}

function swap(key, i, d) {
  const l = listOf(key);
  const j = i + d;
  if (!l || j < 0 || j >= l.arr.length) return;
  [l.arr[i], l.arr[j]] = [l.arr[j], l.arr[i]];
  const id = idOf(l.arr[j]);
  addLog(d < 0 ? '往上移' : '往下移', id, S.pages[id].t);
  persist();
  render();
  const b = app.querySelector(`[data-act="${d < 0 ? 'up' : 'down'}"][data-key="${key}"][data-i="${j}"]`);
  (b && !b.disabled ? b : app.querySelector(`[data-key="${key}"][data-i="${j}"]:not([disabled])`) || app).focus();
}
function removePage(id) {
  const p = S.pages[id];
  if (!confirm(`確定要刪除「${p.t}」嗎？\n刪除後可以在「最近刪除」找回來。`)) return;
  const l = locate(id);
  const [row] = l.arr.splice(l.i, 1);
  S.trash.unshift({ id, key: l.key, row: clone(row), page: clone(p), at: now(), by: me.name });
  delete S.pages[id];
  addLog('刪除', id, p.t);
  persist();
  toast(`已刪除「${p.t}」，可以在「最近刪除」找回來。`);
  render();
}

// ---------------------------------------------------------
// 6. 編輯頁面
// ---------------------------------------------------------
let draft = null;   // 編輯中的頁面：{ id, isNew, where, groups?, ...頁面欄位 }
let dirty = false;

function newId() {
  let n = 1;
  while (S.pages[`page-${n}`] || S.trash.some((x) => x.id === `page-${n}`)) n++;
  return `page-${n}`;
}
function startDraft(id, newKey) {
  if (newKey) {
    const l = listOf(newKey);
    if (!l) return null;
    return { id: newId(), isNew: true, where: newKey, t: '', n: '', d: '', tag: '', icon: l.top ? 'sparkles' : '', level: '', minutes: '', models: '', tool: '', body: '' };
  }
  const p = S.pages[id];
  if (!p || p.system) return null;
  const l = locate(id);
  const row = rowOf(id);
  return { ...clone(p), isNew: false, id, origId: id, where: l.key, groups: row && row.groups ? row.groups.map((g, gi) => ({ g: g.g, n: g.items.length, src: gi })) : null };
}

function whereOptions(d) {
  return allLists().filter((l) => (d.groups ? l.top : true) && !(l.key.startsWith(`c:${d.origId}:`)))
    .map((l) => `<option value="${l.key}"${l.key === d.where ? ' selected' : ''}>${esc(l.label)}</option>`).join('');
}
const TOOLS = [
  ['heading', '小標題', 'heading'], ['bold', '粗體', 'bold'], ['link', '連結', 'link'], ['list', '清單', 'list'],
  ['steps', '步驟', 'steps'], ['tip', '提示框', 'bulb'], ['warn', '注意框', 'alert'], ['table', '表格', 'table'],
  ['prompt', '提示詞', 'prompt'], ['image', '圖片', 'image'], ['compare', '前後比較', 'compare'], ['row', '並排', 'columns'], ['help', '寫法說明', 'help'],
];
function viewEdit() {
  const d = draft;
  const top = listOf(d.where) && listOf(d.where).top;
  return `<div class="ed-bar">
      <a class="ed-back" href="#pages">← 所有頁面</a>
      <span class="ed-state" id="edState" aria-live="polite"></span>
      ${d.isNew ? '' : `<button type="button" class="ed-btn" data-act="history">${ic('history')}版本紀錄</button>`}
      <button type="submit" form="pageForm" class="ed-btn ed-primary">儲存</button>
    </div>
    <form id="pageForm" class="ed-form" novalidate>
      <h1 class="ed-title">${d.isNew ? '新增頁面' : `編輯「${esc(S.pages[d.origId].t)}」`}${d.groups ? '<span class="chip">分類</span>' : ''}</h1>
      <div class="ed-fields">
        <label class="ed-f"><span>標題<em>必填</em></span><input name="t" maxlength="60" value="${esc(d.t)}" required></label>
        <label class="ed-f"><span>目錄上顯示的名稱<small>選填，標題太長時用</small></span><input name="n" maxlength="30" value="${esc(d.n)}"></label>
        <label class="ed-f wide"><span>摘要<small>顯示在標題下方，也會出現在分類列表和搜尋結果</small></span><textarea name="d" rows="2" maxlength="200">${esc(d.d)}</textarea></label>
        <label class="ed-f"><span>放在哪裡</span><select name="where">${whereOptions(d)}</select></label>
        <label class="ed-f"><span>標籤<small>選填，例如「新手」</small></span><input name="tag" maxlength="8" value="${esc(d.tag)}"></label>
        ${d.groups ? '' : `<label class="ed-f"><span>程度</span><select name="level">${LEVELS.map((l) => `<option value="${l}"${l === d.level ? ' selected' : ''}>${l || '不標示'}</option>`).join('')}</select></label>
        <label class="ed-f"><span>閱讀時間<small>分鐘，選填</small></span><input name="minutes" type="number" min="1" max="60" inputmode="numeric" value="${esc(d.minutes)}"></label>`}
        ${top || d.groups ? `<fieldset class="ed-f wide"><legend>目錄圖示</legend><div class="ed-icons">${ICON_CHOICES.map((k) => `<label class="ed-icon" title="${k}"><input type="radio" name="icon" value="${k}"${k === d.icon ? ' checked' : ''}>${ic(k)}<span class="vh">${k}</span></label>`).join('')}</div></fieldset>` : ''}
        ${d.groups ? `<fieldset class="ed-f wide"><legend>分類裡的小標<small>頁面依小標分組；只有一組時可以不寫</small></legend>
          <div class="ed-groups">${d.groups.map((g, gi) => `<div class="ed-group"><input name="g${gi}" maxlength="20" value="${esc(g.g)}" aria-label="第 ${gi + 1} 組小標" placeholder="（沒有小標）"><small>${g.n} 頁</small>
            <button type="button" class="icon-btn sm" data-act="del-group" data-gi="${gi}" aria-label="刪除第 ${gi + 1} 組" title="${g.n ? '這組還有頁面，不能刪除' : '刪除這組'}"${g.n || d.groups.length === 1 ? ' disabled' : ''}>${ic('trash')}</button></div>`).join('')}
            <button type="button" class="ed-add" data-act="add-group">${ic('plus')}新增一組小標</button></div></fieldset>` : ''}
        <details class="ed-more wide"><summary>進階設定</summary>
          <label class="ed-f"><span>網址代號<small>只能用英文小寫、數字和 -；其他頁面連到這頁時會用到</small></span><input name="slug" maxlength="40" value="${esc(d.id)}" pattern="[a-z0-9-]+" spellcheck="false" autocapitalize="off"></label>
          ${d.groups ? '' : `<label class="ed-f"><span>相關模型<small>選填，用逗號分開，會顯示在標題下方</small></span><input name="models" maxlength="120" value="${esc(d.models)}"></label>`}
          ${d.isNew ? '' : `<p class="ed-hint"><a href="./#${esc(d.origId)}" target="_blank" rel="noopener">在說明中心看這頁目前的樣子 ↗</a></p>`}
        </details>
      </div>
      <div class="ed-split" data-pane="write">
        <div class="ed-pane-tabs" role="tablist" aria-label="切換編輯與預覽">
          <button type="button" role="tab" data-pane-to="write" aria-selected="true">編輯</button>
          <button type="button" role="tab" data-pane-to="preview" aria-selected="false">預覽</button>
        </div>
        <div class="ed-write">
          <div class="ed-tools" role="toolbar" aria-label="插入格式">${TOOLS.map(([k, t, icn]) => `<button type="button" class="ed-tool" data-tool="${k}" title="${t}">${ic(icn)}<span>${t}</span></button>`).join('')}</div>
          <div class="ed-cheat" id="cheat" hidden>${cheatSheet()}</div>
          <label class="vh" for="body">內文</label>
          <textarea name="body" id="body" spellcheck="false">${esc(d.body)}</textarea>
          <p class="ed-warn" id="linkWarn" role="status"></p>
        </div>
        <div class="ed-preview-wrap"><div class="ed-preview-label">預覽（和說明中心看到的一樣）</div><article class="content ed-preview" id="preview"></article></div>
      </div>
      <p class="ed-err" id="formErr" role="alert"></p>
    </form>`;
}
function cheatSheet() {
  const rows = [
    ['## 小標題', '段落標題，會出現在右側「本頁目錄」'],
    ['**粗體**', '強調文字'],
    ['[文字](#頁面代號)', '連到說明中心的其他頁面'],
    ['- 項目', '清單，一行一項'],
    [':::steps … :::', '步驟；每一步用「@ 」開頭'],
    [':::tip 標題 … :::', '綠色提示框；:::warn 是黃色注意框'],
    ['> 提示詞', '可以一鍵複製的提示詞框'],
    ['[i 編號 說明]', '圖片；v 是影片、a 是音訊'],
    [':::row … ||| … :::', '並排，用 ||| 分欄'],
    [':::compare … :::', '前後比較；兩行 [i 編號 標籤]，?? 開頭是可展開的提示詞'],
  ];
  return `<table><tbody>${rows.map(([a, b]) => `<tr><th><code>${esc(a)}</code></th><td>${esc(b)}</td></tr>`).join('')}</tbody></table>`;
}

function crumbFor(where) {
  const l = listOf(where);
  if (!l) return '';
  const parts = l.label.replace('（直接列在目錄上）', '').split(' › ').slice(0, 2);
  return `<nav class="crumb" aria-label="位置">${parts.map((c) => `<span>${esc(c)}</span>`).join('<span class="sep">/</span>')}</nav>`;
}
function paintPreview() {
  const d = draft;
  const chips = [];
  if (d.level) chips.push(`<span class="chip${d.level === '新手' ? ' brand' : ''}">${esc(d.level)}</span>`);
  if (d.tool) chips.push(`<span class="chip">使用${esc(d.tool)}</span>`);
  String(d.models || '').split(/[,，、]/).map((m) => m.trim()).filter(Boolean).forEach((m) => chips.push(`<span class="chip">${esc(m)}</span>`));
  if (d.minutes) chips.push(`<span class="chip">${ic('clock', 'ic sm')}約 ${esc(d.minutes)} 分鐘</span>`);
  const head = d.groups
    ? `<div class="cat-head"><span class="cat-icon">${ic(d.icon || 'folder')}</span><h1>${esc(d.t || '（還沒有標題）')}</h1>${tagHtml(d.tag)}</div>`
    : `<h1>${esc(d.t || '（還沒有標題）')}</h1>`;
  let list = '';
  if (d.groups) {
    const row = rowOf(d.origId);
    list = d.groups.map((g) => `<h2>${esc(g.g || '這個分類的文章')}</h2><div class="list">${((row && g.src != null && row.groups[g.src]) ? row.groups[g.src].items : []).map((id) =>
      `<span class="list-row"><span class="list-t"><b>${esc(S.pages[id].t)}</b>${S.pages[id].d ? `<small>${esc(S.pages[id].d)}</small>` : ''}</span>${ic('chev', 'ic chev')}</span>`).join('') || '<p class="ed-hint">這組還沒有頁面。</p>'}</div>`).join('');
  }
  document.getElementById('preview').innerHTML = `${crumbFor(d.where)}${head}${chips.length ? `<div class="meta">${chips.join('')}</div>` : ''}${d.d ? `<p class="lead">${esc(d.d)}</p>` : ''}<div class="prose">${renderMarkup(d.body)}</div>${list}`;
  // 連到不存在的頁面時提醒
  const bad = [...new Set([...d.body.matchAll(/\]\(#([\w-]+)\)/g)].map((m) => m[1]).filter((k) => !k.startsWith('h-') && !S.pages[k] && k !== d.id))];
  document.getElementById('linkWarn').textContent = bad.length ? `提醒：這些連結找不到頁面：${bad.map((k) => `#${k}`).join('、')}` : '';
  const missing = [...new Set([...d.body.matchAll(/\[(?:i|v|a)\s+(\d+)/g)].map((m) => m[1]).filter((n) => !MEDIA[n]))];
  if (missing.length) document.getElementById('linkWarn').textContent += `${bad.length ? '；' : '提醒：'}找不到圖片編號 ${missing.join('、')}`;
}
let previewTimer = 0;
function setDirty(v) {
  dirty = v;
  const s = document.getElementById('edState');
  if (s) s.textContent = v ? '有尚未儲存的修改' : '';
}

function readForm(f) {
  const d = draft;
  ['t', 'n', 'd', 'tag', 'where', 'body'].forEach((k) => { if (f.elements[k]) d[k] = f.elements[k].value; });
  d.id = f.elements.slug.value;
  if (f.elements.level) d.level = f.elements.level.value;
  if (f.elements.minutes) d.minutes = f.elements.minutes.value;
  if (f.elements.models) d.models = f.elements.models.value;
  const icon = f.querySelector('input[name="icon"]:checked');
  if (icon) d.icon = icon.value;
  if (d.groups) d.groups.forEach((g, gi) => { if (f.elements[`g${gi}`]) g.g = f.elements[`g${gi}`].value.trim(); });
}
const FIELDS = ['t', 'n', 'd', 'tag', 'icon', 'level', 'minutes', 'models', 'tool', 'body'];

function savePage(f) {
  readForm(f);
  const d = draft;
  const err = document.getElementById('formErr');
  d.t = d.t.trim(); d.id = d.id.trim();
  if (!d.t) { err.textContent = '請填寫標題。'; f.elements.t.focus(); return; }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.id)) { err.textContent = '網址代號只能用英文小寫、數字和 -。'; f.querySelector('.ed-more').open = true; f.elements.slug.focus(); return; }
  if (d.id !== d.origId && (S.pages[d.id] || ['home', 'pages'].includes(d.id))) { err.textContent = `網址代號「${d.id}」已經有其他頁面在用了。`; f.querySelector('.ed-more').open = true; f.elements.slug.focus(); return; }
  err.textContent = '';

  const page = {};
  FIELDS.forEach((k) => { page[k] = typeof d[k] === 'string' ? d[k].trim() : d[k]; });
  page.body = d.body.replace(/\s+$/, '');
  let action = '修改';
  if (d.isNew) {
    page.isNew = true;
    S.pages[d.id] = page;
    const l = listOf(d.where);
    l.arr.push(l.top ? { id: d.id } : d.id);
    action = '新增';
  } else {
    const old = S.pages[d.origId];
    if (old.isNew) page.isNew = true;
    const h = S.history[d.origId] || [];
    if (!h.length && !old.isNew) h.push({ at: null, by: '說明中心目前的版本', page: clone(old) });
    if (d.groups) {
      const row = rowOf(d.origId);
      row.groups = d.groups.map((g) => ({ g: g.g, items: g.src != null && row.groups[g.src] ? row.groups[g.src].items : [] }));
    }
    if (d.where !== locate(d.origId).key) { moveTo(d.origId, d.where); action = '修改並搬移'; }
    delete S.pages[d.origId];
    S.pages[d.id] = page;
    if (d.id !== d.origId) {
      // 改了網址代號：目錄、版本紀錄和其他頁面裡的連結一起換
      const l = locate(d.origId);
      if (l.top) l.arr[l.i].id = d.id; else l.arr[l.i] = d.id;
      delete S.history[d.origId];
      Object.values(S.pages).forEach((p) => { if (p.body) p.body = p.body.split(`](#${d.origId})`).join(`](#${d.id})`); });
    }
    S.history[d.id] = h;
  }
  S.history[d.id] = S.history[d.id] || [];
  S.history[d.id].unshift({ at: now(), by: me.name, page: clone(page) });
  S.history[d.id].length = Math.min(S.history[d.id].length, 30);
  addLog(action, d.id, page.t);
  if (!persist()) return;
  setDirty(false);
  toast(`已儲存「${page.t}」（示範：只存在這台電腦）`);
  if (d.isNew || d.id !== d.origId) { skipGuard = true; location.hash = `#edit/${d.id}`; }
  else { draft = startDraft(d.id); }
}

function openHistory() {
  const h = S.history[draft.origId] || [];
  const list = document.getElementById('histList');
  list.innerHTML = h.length
    ? h.map((v, i) => `<li><span><b>${v.at ? fmt(v.at) : '原始版本'}</b><small>${esc(v.by)}${i === 0 && v.at ? '・目前的版本' : ''}</small><small>${esc(v.page.t)}・${plainText(v.page.body).replace(/\s+/g, ' ').trim().length} 字</small></span>
        <button type="button" class="ed-btn" data-load="${i}"${i === 0 && v.at ? ' disabled' : ''}>${ic('restore')}載入這個版本</button></li>`).join('')
    : '<li class="ed-hint">這頁還沒有在後台改過，目前就是說明中心的原始版本。</li>';
  document.getElementById('histDlg').showModal();
}
document.getElementById('histList').addEventListener('click', (e) => {
  const b = e.target.closest('[data-load]');
  if (!b) return;
  const v = S.history[draft.origId][+b.dataset.load];
  FIELDS.forEach((k) => { if (k in v.page) draft[k] = v.page[k]; });
  document.getElementById('histDlg').close();
  render(true);
  setDirty(true);
  toast(`已載入${v.at ? ` ${fmt(v.at)} ` : '原始'}的版本，按「儲存」才會還原。`);
});

// 插入格式
function insertAt(text, selectFrom, selectLen) {
  const ta = document.getElementById('body');
  const s = ta.selectionStart, e = ta.selectionEnd;
  ta.setRangeText(text, s, e, 'end');
  if (selectFrom != null) ta.setSelectionRange(s + selectFrom, s + selectFrom + selectLen);
  ta.focus();
  ta.dispatchEvent(new Event('input', { bubbles: true }));
}
function insertBlock(text, sel) {
  const ta = document.getElementById('body');
  const before = ta.value.slice(0, ta.selectionStart);
  const pre = !before || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
  const i = sel ? text.indexOf(sel) : -1;
  insertAt(`${pre}${text}\n\n`, i >= 0 ? pre.length + i : null, sel ? sel.length : 0);
}
function wrapSel(mark, ph) {
  const ta = document.getElementById('body');
  const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd) || ph;
  insertAt(`${mark}${sel}${mark}`, mark.length, sel.length);
}
const SNIPS = {
  heading: ['## 小標題', '小標題'],
  list: ['- 第一項\n- 第二項', '第一項'],
  steps: [':::steps\n@ 第一步\n說明文字\n\n@ 第二步\n說明文字\n:::', '第一步'],
  tip: [':::tip 小提醒\n內容寫在這裡\n:::', '內容寫在這裡'],
  warn: [':::warn 注意\n內容寫在這裡\n:::', '內容寫在這裡'],
  table: ['| 項目 | 說明 |\n| --- | --- |\n| 第一項 | 說明 |\n| 第二項 | 說明 |', '項目'],
  prompt: ['> 在這裡貼上提示詞', '在這裡貼上提示詞'],
  row: [':::row\n[i 圖片編號]\n|||\n[i 圖片編號]\n:::', '圖片編號'],
};
function tool(k) {
  if (k === 'bold') return wrapSel('**', '粗體文字');
  if (k === 'link') return openLink();
  if (k === 'image') return openImage();
  if (k === 'compare') return openCompare();
  if (k === 'help') { const c = document.getElementById('cheat'); c.hidden = !c.hidden; return; }
  insertBlock(...SNIPS[k]);
}

// 連結對話框
const linkDlg = document.getElementById('linkDlg');
const linkForm = document.getElementById('linkForm');
function syncKind(form) {
  const kind = form.elements.kind.value;
  form.querySelectorAll('[data-kind]').forEach((el) => { el.hidden = el.dataset.kind !== kind; });
}
function openLink() {
  const ta = document.getElementById('body');
  const f = linkForm;
  f.reset();
  f.elements.text.value = ta.value.slice(ta.selectionStart, ta.selectionEnd).trim();
  f.elements.page.innerHTML = allLists().map((l) => {
    const ids = l.arr.map(idOf).filter((id) => S.pages[id] && !S.pages[id].system);
    return ids.length ? `<optgroup label="${esc(l.label)}">${ids.map((id) => `<option value="${id}">${esc(S.pages[id].t)}</option>`).join('')}</optgroup>` : '';
  }).join('');
  f.querySelector('.ed-err').textContent = '';
  syncKind(f);
  linkDlg.showModal();
}
linkForm.addEventListener('change', (e) => { if (e.target.name === 'kind') syncKind(linkForm); });
linkForm.addEventListener('submit', (e) => {
  if (e.submitter && e.submitter.value === 'cancel') return;
  const f = linkForm;
  const url = f.elements.url.value.trim();
  const text = f.elements.text.value.trim() || (f.elements.kind.value === 'page' ? S.pages[f.elements.page.value].t : url);
  const href = f.elements.kind.value === 'page' ? `#${f.elements.page.value}` : url;
  if (f.elements.kind.value === 'url' && !/^https?:\/\/\S+$/.test(url)) { e.preventDefault(); f.querySelector('.ed-err').textContent = '請輸入 https:// 開頭的網址。'; return; }
  e.preventDefault();
  linkDlg.close();
  insertAt(`[${text.replace(/[\[\]]/g, '')}](${href})`);
});

// 圖片對話框：上傳的圖片縮到 1600px 寬、轉成 WebP，示範版存在瀏覽器裡
const imgDlg = document.getElementById('imgDlg');
const imgForm = document.getElementById('imgForm');
let pendingImg = null;
function openImage() {
  imgForm.reset();
  pendingImg = null;
  document.getElementById('imgThumb').innerHTML = '';
  imgForm.querySelector('.ed-err').textContent = '';
  syncKind(imgForm);
  imgDlg.showModal();
}
async function shrink(file) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / bmp.width);
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  let url = c.toDataURL('image/webp', 0.82);
  if (!url.startsWith('data:image/webp')) url = c.toDataURL('image/jpeg', 0.85);
  return [url, +(c.width / c.height).toFixed(3)];
}
imgForm.addEventListener('change', async (e) => {
  const f = imgForm;
  const thumb = document.getElementById('imgThumb');
  const err = f.querySelector('.ed-err');
  if (e.target.name === 'kind') { syncKind(f); thumb.innerHTML = ''; pendingImg = null; err.textContent = ''; return; }
  if (e.target.name === 'file' && f.elements.file.files[0]) {
    err.textContent = '';
    try { pendingImg = await shrink(f.elements.file.files[0]); thumb.innerHTML = `<img src="${pendingImg[0]}" alt="">`; }
    catch (x) { pendingImg = null; err.textContent = '讀不到這張圖片，請換一張試試。'; }
  }
});
imgForm.elements.num.addEventListener('input', () => {
  const n = imgForm.elements.num.value.trim();
  document.getElementById('imgThumb').innerHTML = MEDIA[n] && /\.(webp|png|jpe?g|gif)$|^data:/.test(MEDIA[n][0]) ? `<img src="${mediaUrl(n)}" alt="">` : n ? '<p class="ed-hint">找不到這個編號的圖片。</p>' : '';
});
imgForm.addEventListener('submit', (e) => {
  if (e.submitter && e.submitter.value === 'cancel') return;
  const f = imgForm;
  const err = f.querySelector('.ed-err');
  let n;
  if (f.elements.kind.value === 'upload') {
    if (!pendingImg) { e.preventDefault(); err.textContent = '請先選擇一張圖片。'; return; }
    n = String(S.nextMedia++);
    S.uploads[n] = pendingImg;
    MEDIA[n] = pendingImg;
    if (!persist()) { delete S.uploads[n]; delete MEDIA[n]; S.nextMedia--; e.preventDefault(); err.textContent = '瀏覽器空間不夠，示範版放不下這張圖片。'; return; }
  } else {
    n = f.elements.num.value.trim();
    if (!MEDIA[n]) { e.preventDefault(); err.textContent = '找不到這個編號的圖片。'; return; }
  }
  const cap = f.elements.cap.value.trim().replace(/[\[\]]/g, '');
  e.preventDefault();
  imgDlg.close();
  insertBlock(`[i ${n}${cap ? ` ${cap}` : ''}]`);
});

// 前後比較對話框：左右各選一張（上傳或填編號），插入 :::compare 區塊
const cmpDlg = document.getElementById('cmpDlg');
const cmpForm = document.getElementById('cmpForm');
const cmpPending = { A: null, B: null };
function openCompare() {
  cmpForm.reset();
  cmpPending.A = cmpPending.B = null;
  document.getElementById('cmpThumbA').innerHTML = document.getElementById('cmpThumbB').innerHTML = '';
  cmpForm.querySelector('.ed-err').textContent = '';
  cmpDlg.showModal();
}
const isImageNum = (n) => MEDIA[n] && /\.(webp|png|jpe?g|gif)$|^data:/.test(MEDIA[n][0]);
cmpForm.addEventListener('change', async (e) => {
  const m = e.target.name.match(/^file([AB])$/);
  if (!m || !e.target.files[0]) return;
  const s = m[1];
  const err = cmpForm.querySelector('.ed-err');
  err.textContent = '';
  cmpForm.elements[`num${s}`].value = '';
  try { cmpPending[s] = await shrink(e.target.files[0]); document.getElementById(`cmpThumb${s}`).innerHTML = `<img src="${cmpPending[s][0]}" alt="">`; }
  catch (x) { cmpPending[s] = null; err.textContent = '讀不到這張圖片，請換一張試試。'; }
});
cmpForm.addEventListener('input', (e) => {
  const m = e.target.name.match(/^num([AB])$/);
  if (!m) return;
  const s = m[1], n = e.target.value.trim();
  cmpPending[s] = null;
  cmpForm.elements[`file${s}`].value = '';
  document.getElementById(`cmpThumb${s}`).innerHTML = isImageNum(n) ? `<img src="${mediaUrl(n)}" alt="">` : n ? '<p class="ed-hint">找不到這個編號的圖片。</p>' : '';
});
cmpForm.addEventListener('submit', (e) => {
  if (e.submitter && e.submitter.value === 'cancel') return;
  e.preventDefault();
  const f = cmpForm.elements;
  const err = cmpForm.querySelector('.ed-err');
  const side = { A: '修改前', B: '修改後' };
  for (const s of ['A', 'B']) {
    if (!cmpPending[s] && !isImageNum(f[`num${s}`].value.trim())) { err.textContent = `請選擇${side[s]}的圖片（上傳或填編號）。`; return; }
  }
  // 兩張都檢查過才存上傳的圖，避免只存一半
  const nums = {}, added = [];
  for (const s of ['A', 'B']) {
    if (cmpPending[s]) { const n = String(S.nextMedia++); S.uploads[n] = MEDIA[n] = cmpPending[s]; nums[s] = n; added.push(n); }
    else nums[s] = f[`num${s}`].value.trim();
  }
  if (added.length && !persist()) {
    added.forEach((n) => { delete S.uploads[n]; delete MEDIA[n]; S.nextMedia--; });
    err.textContent = '瀏覽器空間不夠，示範版放不下這些圖片。';
    return;
  }
  const label = (s) => f[`label${s}`].value.trim().replace(/[\[\]]/g, '') || (s === 'A' ? 'Before' : 'After');
  const lines = [':::compare', `[i ${nums.A} ${label('A')}]`, `[i ${nums.B} ${label('B')}]`];
  for (const s of ['A', 'B']) {
    const p = f[`prompt${s}`].value.trim();
    // 提示詞某一行若以 ::: 或 ?? 開頭會被當成區塊語法，換成全形符號
    if (p) lines.push(`?? Prompt(${label(s)})`, p.replace(/^(\s*):::/gm, '$1：：：').replace(/^(\s*)\?\? /gm, '$1？？ '));
  }
  lines.push(':::');
  cmpDlg.close();
  insertBlock(lines.join('\n'));
});

// ---------------------------------------------------------
// 6b. 圖庫：說明中心用到的所有媒體，依區域（assets/media 的資料夾）分類，可搜尋、複製；編輯時可直接挑圖
// ---------------------------------------------------------
const AREAS = { start: '開始使用', chat: '交談', image: '圖片生成', video: '影片生成', lab: '實驗室', recipes: '應用範例', models: '模型指南', team: '團隊管理', support: '支援', unused: '暫時沒用到', upload: '示範上傳' };
const KINDS = { image: ['圖片', 'i'], video: ['影片', 'v'], audio: ['音訊', 'a'] };
const kindOf = (f) => (/\.mp4$/i.test(f) ? 'video' : /\.mp3$/i.test(f) ? 'audio' : 'image');
// 每個編號：檔名、區域、類型，以及用在哪些頁面的哪個段落（從目前的頁面內容即時算出）
function mediaIndex() {
  const uses = {};
  for (const [id, p] of Object.entries(S.pages)) {
    if (p.system || !p.body) continue;
    let h = '';
    for (const line of p.body.split('\n')) {
      const hm = line.trim().match(/^#{2,4}\s+(.+?)(?:\s+\{#[\w-]+\})?$/);
      if (hm) { h = hm[1].replace(/\*\*/g, ''); continue; }
      for (const m of line.matchAll(/\[(?:i|v|a)\s+(\d+)(?:\s+([^\]]+))?\]/g)) {
        const list = uses[m[1]] = uses[m[1]] || [];
        if (!list.some((u) => u.id === id)) list.push({ id, t: p.t, h, c: m[2] || '' });
      }
    }
  }
  const order = Object.keys(AREAS);
  return Object.keys(MEDIA).map((n) => {
    const f = MEDIA[n][0];
    const up = /^data:/.test(f);
    return { n, f: up ? '' : f, area: up ? 'upload' : f.split('/')[0], kind: up ? 'image' : kindOf(f), uses: uses[n] || [] };
  }).sort((a, b) => order.indexOf(a.area) - order.indexOf(b.area) || a.f.localeCompare(b.f) || a.n - b.n);
}
function mediaFilters(list, pick) {
  const count = (a) => list.filter((m) => m.area === a).length;
  return `<div class="ed-mfilter">
    <label class="ed-msearch"><span class="vh">搜尋</span><input type="search" data-mf="q" placeholder="搜尋編號、檔名、頁面、段落或圖片說明"></label>
    <label><span class="vh">區域</span><select data-mf="area"><option value="">全部區域（${list.length}）</option>${Object.keys(AREAS).filter(count).map((a) => `<option value="${a}">${AREAS[a]}（${count(a)}）</option>`).join('')}<option value="none">沒有頁面使用</option></select></label>
    ${pick ? '' : `<label><span class="vh">類型</span><select data-mf="kind"><option value="">全部類型</option>${Object.entries(KINDS).map(([k, [t]]) => `<option value="${k}">${t}</option>`).join('')}</select></label>`}
    <span class="ed-hint" data-mf-count aria-live="polite"></span>
  </div>`;
}
function mediaCard(m, pick) {
  const url = mediaUrl(m.n);
  const thumb = m.kind === 'image' ? `<img src="${url}" alt="" loading="lazy" decoding="async">`
    : m.kind === 'video' ? `<video data-src="${url}" muted playsinline preload="none"></video><span class="ed-m-kind">${ic('video')}影片</span>`
    : `<span class="ed-m-kind">${ic('music')}音訊</span>`;
  const where = m.uses.length
    ? m.uses.map((u) => `${pick ? esc(u.t) : `<a href="#edit/${u.id}">${esc(u.t)}</a>`}${u.h ? ` › ${esc(u.h)}` : ''}`).join('<br>')
    : '沒有頁面使用';
  const q = [m.n, `#${m.n}`, m.f, ...m.uses.map((u) => `${u.t} ${u.h} ${u.c}`)].join(' ').toLowerCase();
  const data = `data-area="${m.area}" data-kind="${m.kind}" data-used="${m.uses.length ? 1 : 0}" data-q="${esc(q)}"`;
  const info = `<b>#${m.n}</b><small class="ed-m-file">${m.f ? esc(m.f) : '示範上傳（正式版會依規則自動命名）'}</small><small>${where}</small>`;
  if (pick) return `<button type="button" class="ed-m" data-pick="${m.n}" ${data}><span class="ed-m-thumb">${thumb}</span><span class="ed-m-info">${info}</span></button>`;
  return `<div class="ed-m" ${data}><div class="ed-m-thumb">${thumb}</div><div class="ed-m-info">${info}
    <button type="button" class="ed-btn sm" data-act="copy-media" data-n="${m.n}" data-k="${KINDS[m.kind][1]}">${ic('copy')}複製</button></div></div>`;
}
function filterMedia(root) {
  const v = (k) => { const el = root.querySelector(`[data-mf="${k}"]`); return el ? el.value.trim().toLowerCase() : ''; };
  const q = v('q'), area = v('area'), kind = v('kind');
  let shown = 0;
  root.querySelectorAll('.ed-m').forEach((c) => {
    const ok = (!q || c.dataset.q.includes(q)) && (!kind || c.dataset.kind === kind)
      && (!area || (area === 'none' ? c.dataset.used === '0' : c.dataset.area === area));
    c.hidden = !ok;
    if (ok) shown++;
  });
  root.querySelector('[data-mf-count]').textContent = `顯示 ${shown} 個`;
}
// 影片捲到畫面附近才開始讀第一格畫面，避免一次載入幾十支影片
const videoWatcher = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.preload = 'metadata';
  e.target.src = `${e.target.dataset.src}#t=0.5`;
  videoWatcher.unobserve(e.target);
}), { rootMargin: '300px' }) : null;
function wakeMedia(root) {
  filterMedia(root);
  root.querySelectorAll('video[data-src]').forEach((v) => (videoWatcher ? videoWatcher.observe(v) : (v.src = v.dataset.src)));
}
function viewMedia() {
  const list = mediaIndex();
  return `${tabs('media')}<div class="ed-head"><div><h1>圖庫</h1><p class="ed-hint">說明中心用到的所有圖片、影片和音訊，依網站的區域分類。文章裡用編號引用：按「複製」再貼到文章裡就會顯示。</p></div></div>
    <details class="ed-more ed-rules"><summary>檔案命名規則</summary>
      <p>每個檔案放在「區域資料夾」裡，檔名是<b>文章代號-序號</b>，例如 <code>image/img-basics-03.webp</code> 就是「圖片生成」區、img-basics 這篇的第 3 張。</p>
      <ul><li>區域資料夾：${Object.entries(AREAS).filter(([k]) => k !== 'upload').map(([k, t]) => `<code>${k}</code> ${t}`).join('、')}</li>
        <li>只用英文小寫、數字和 -，不用空白和中文；新圖接在那篇最大的序號後面。</li>
        <li>圖片轉成 WebP、寬度不超過 1600px；影片用 MP4、音訊用 MP3。</li>
        <li>正式版上傳時會依這個規則自動命名，不用自己取檔名。</li></ul>
    </details>
    <div class="ed-media">${mediaFilters(list)}<div class="ed-mgrid">${list.map((m) => mediaCard(m)).join('')}</div></div>`;
}
async function copyMedia(b) {
  const code = `[${b.dataset.k} ${b.dataset.n}]`;
  try { await navigator.clipboard.writeText(code); toast(`已複製 ${code}，貼到文章裡就會顯示。`); }
  catch (x) { prompt('複製下面這段，貼到文章裡：', code); }
}

// 從圖庫挑圖：插入圖片、前後比較的對話框裡按「從圖庫挑選」
const pickDlg = document.getElementById('pickDlg');
const pickBody = document.getElementById('pickBody');
let pickTarget = null;
function openPicker(input) {
  pickTarget = input;
  const list = mediaIndex().filter((m) => m.kind === 'image');
  pickBody.innerHTML = `${mediaFilters(list, true)}<div class="ed-mgrid">${list.map((m) => mediaCard(m, true)).join('')}</div>`;
  wakeMedia(pickBody);
  pickDlg.showModal();
  pickBody.querySelector('[data-mf="q"]').focus();
}
pickBody.addEventListener('click', (e) => {
  const c = e.target.closest('[data-pick]');
  if (!c || !pickTarget) return;
  pickTarget.value = c.dataset.pick;
  pickTarget.dispatchEvent(new Event('input', { bubbles: true }));
  pickDlg.close();
});
document.addEventListener('input', (e) => { if (e.target.dataset.mf) filterMedia(e.target.closest('.ed-media')); });
document.addEventListener('change', (e) => { if (e.target.dataset.mf) filterMedia(e.target.closest('.ed-media')); });

// ---------------------------------------------------------
// 6c. 使用說明：給編輯者的操作手冊（工程師用的維護手冊在 docs/MAINTENANCE.md）
// ---------------------------------------------------------
function viewHelp() {
  const sec = (title, body, open) => `<details class="ed-help-sec"${open ? ' open' : ''}><summary>${title}</summary><div>${body}</div></details>`;
  return `${tabs('help')}<div class="ed-head"><div><h1>使用說明</h1><p class="ed-hint">編輯說明中心需要知道的事。點標題展開。</p></div></div>
    <div class="ed-note"><b>目前是示範版</b>登入是模擬的，修改只存在這台電腦的瀏覽器，不會改到說明中心。下面標「正式版」的地方，是之後上線後的做法。</div>
    <div class="ed-help">
    ${sec('1. 登入與權限', `<ul>
      <li>用<b>公司帳號</b>登入，不用另外記密碼（正式版）。</li>
      <li>登入後，要在「編輯者名單」上才能編輯。不在名單上的人會看到「沒有編輯權限」，請找主管理員把你的員工編號加進去。</li>
      <li><b>編輯者</b>可以新增、修改、刪除與排序頁面；<b>主管理員</b>另外可以管理編輯者名單。</li>
      <li>用完記得按右上角的登出。</li></ul>`, true)}
    ${sec('2. 頁面與目錄', `<ul>
      <li>「頁面」分頁就是說明中心左側目錄的樣子，由上到下照順序排。</li>
      <li>點頁面名稱開始編輯；用 ↑ ↓ 調整順序；垃圾桶是刪除。</li>
      <li>「分類」是一組頁面（例如「圖片生成」底下的多篇）。分類裡還有頁面時不能刪除，要先把頁面搬走或刪除。</li>
      <li>要換位置：進入頁面，改「放在哪裡」再儲存，頁面會移到新位置的最後面。</li>
      <li>標示「已修改」「新頁面」的，是和說明中心目前內容不同的地方。</li></ul>`)}
    ${sec('3. 編輯一篇文章', `<ol>
      <li>填<b>標題</b>（必填）與<b>摘要</b>（一兩句話，會出現在搜尋結果）。</li>
      <li>內文用上方工具列插入格式：小標題、粗體、連結、清單、步驟、提示框、注意框、表格、提示詞、圖片、前後比較、並排。</li>
      <li>右邊（手機上切到「預覽」）就是讀者會看到的樣子。</li>
      <li>按<b>儲存</b>（或 Ctrl+S）。還沒儲存就離開，會先問你。</li></ol>
      <p>不確定格式怎麼寫，按工具列最後的「寫法說明」，或看下面的速查表：</p>
      <div class="ed-cheat">${cheatSheet()}</div>
      <p>小提醒：連到別的頁面請用「連結」按鈕挑選，不要自己打網址；改了頁面的「網址代號」，其他頁面的連結會自動跟著改。</p>`)}
    ${sec('4. 圖片', `<ul>
      <li><b>插入圖片</b>：工具列「圖片」→ 從電腦上傳，或「從圖庫挑選」網站上已經有的圖。</li>
      <li>上傳的圖會自動縮小、轉成網頁用的格式，並自動取好檔名、給一個編號，<b>不用自己改檔名</b>（正式版）。</li>
      <li>截圖請盡量只截需要的部分，讀者在手機上才看得清楚；不要放有個人資料、密碼或公司機密的畫面。</li>
      <li>「圖片說明」會顯示在圖片下方，也能讓圖庫搜尋得到。</li>
      <li>文章裡圖片寫成 <code>[i 123 說明]</code>，123 是圖片編號；同一張圖可以用在很多篇。</li></ul>`)}
    ${sec('5. 前後比較', `<ul>
      <li>工具列「前後比較」：左邊放修改前、右邊放修改後，讀者可以拖曳中間的分隔線比較。</li>
      <li>兩張圖最好一樣大小。可以填修改後用的提示詞，讀者能展開、複製。</li></ul>`)}
    ${sec('6. 圖庫：找圖', `<ul>
      <li>「圖庫」分頁列出網站所有圖片、影片和音訊，依網站區域分類。</li>
      <li>可以用編號、頁面名稱、段落標題或圖片說明搜尋，也能篩選「沒有頁面使用」的圖。</li>
      <li>每張都寫著用在哪一頁，點頁名就能去編輯那頁；按「複製」再貼到文章裡就會顯示。</li>
      <li>檔名規則是「區域／文章代號-序號」，例如 <code>image/img-basics-03.webp</code>；正式版上傳時會自動照規則命名。</li></ul>`)}
    ${sec('7. 改錯了怎麼辦', `<ul>
      <li><b>版本紀錄</b>：編輯畫面右上角。每次儲存都會留一版，選一版載入、確認後再按儲存，就還原了。</li>
      <li><b>最近刪除</b>：刪掉的頁面會先放這裡，按「還原」放回原位。</li>
      <li><b>修改紀錄</b>：誰在什麼時候改了哪一頁。</li></ul>`)}
    ${sec('8. 編輯者名單（主管理員）', `<ul>
      <li>輸入同事的<b>員工編號</b>和姓名、選權限，按「加入名單」。</li>
      <li>公司帳號不會告訴網站部門或職稱，所以誰能編輯要在這裡手動維護。</li>
      <li>同事離職或調職，記得移除。不能移除或降級自己，避免沒有人能管理名單。</li></ul>`)}
    ${sec('9. 遇到問題找誰', `<ul>
      <li>內容怎麼寫、誰能編輯：找網站負責人或主管理員。</li>
      <li>網站打不開、圖片全部不見、登入失敗：找平台組，並告訴他們網站網址和發生時間。工程師用的維護手冊在程式碼的 <code>docs/MAINTENANCE.md</code>。</li>
      <li>讀者的意見回饋在「回饋後台」（<a href="admin.html">admin.html</a>）。</li></ul>`)}
    </div>`;
}

// ---------------------------------------------------------
// 7. 修改紀錄、最近刪除、編輯者名單
// ---------------------------------------------------------
function viewLog() {
  return `${tabs('log')}<div class="ed-head"><div><h1>修改紀錄</h1><p class="ed-hint">誰在什麼時候改了哪一頁。正式版會記在伺服器上，所有編輯者都看得到。</p></div></div>
    ${S.log.length ? `<div class="ed-tbl"><table class="ed-table"><thead><tr><th>時間</th><th>誰</th><th>做了什麼</th><th>頁面</th></tr></thead><tbody>
      ${S.log.map((x) => `<tr><td data-label="時間">${fmt(x.at)}</td><td data-label="誰">${esc(x.by)}</td><td data-label="做了什麼">${esc(x.action)}</td>
        <td data-label="頁面">${S.pages[x.id] && !S.pages[x.id].system ? `<a href="#edit/${x.id}">${esc(x.t)}</a>` : esc(x.t)}</td></tr>`).join('')}
    </tbody></table></div>` : '<p class="ed-hint">還沒有任何修改。</p>'}`;
}
function viewTrash() {
  return `${tabs('trash')}<div class="ed-head"><div><h1>最近刪除</h1><p class="ed-hint">刪掉的頁面會先放在這裡，按「還原」就會放回原本的位置。</p></div></div>
    ${S.trash.length ? `<ul class="ed-list ed-trash">${S.trash.map((x, i) => `<li class="ed-item"><span class="ed-name">${ic(x.page.icon || 'file')}<span><b>${esc(x.page.t)}</b><small>${esc(x.by)} 在 ${fmt(x.at)} 刪除</small></span></span>
      <button type="button" class="ed-btn" data-act="restore" data-i="${i}">${ic('restore')}還原</button></li>`).join('')}</ul>` : '<p class="ed-hint">沒有刪除的頁面。</p>'}`;
}
function restore(i) {
  const x = S.trash[i];
  if (S.pages[x.id]) { toast(`網址代號「${x.id}」已經被其他頁面用了，無法還原。`); return; }
  let l = listOf(x.key);
  if (!l || (x.row.groups && !l.top)) l = listOf('s0');
  S.pages[x.id] = x.page;
  l.arr.push(l.top ? (typeof x.row === 'string' ? { id: x.id } : x.row) : x.id);
  S.trash.splice(i, 1);
  addLog('還原', x.id, x.page.t);
  persist();
  toast(`已還原「${x.page.t}」，放在「${l.label}」的最後面。`);
  render();
}
function viewEditors() {
  if (myRole() !== 'owner') return `${tabs('pages')}<p class="ed-hint">只有主管理員可以管理編輯者名單。</p>`;
  return `${tabs('editors')}<div class="ed-head"><div><h1>編輯者名單</h1></div></div>
    <div class="ed-note"><b>這份名單決定誰能編輯</b>正式版裡，同事用公司帳號登入後，系統會拿到他的員工編號；在這份名單上的人才能進入後台。公司帳號不會告訴網站部門或職稱，所以名單要由主管理員在這裡維護。</div>
    <div class="ed-tbl"><table class="ed-table"><thead><tr><th>姓名</th><th>員工編號</th><th>權限</th><th>加入時間</th><th><span class="vh">動作</span></th></tr></thead><tbody>
      ${S.editors.map((e, i) => `<tr><td data-label="姓名">${esc(e.name)}${e.no === me.no ? '<span class="chip">你</span>' : ''}</td><td data-label="員工編號">${esc(e.no)}</td>
        <td data-label="權限"><select data-act="role" data-i="${i}" aria-label="${esc(e.name)} 的權限"${e.no === me.no ? ' disabled' : ''}>${Object.entries(ROLES).map(([k, t]) => `<option value="${k}"${k === e.role ? ' selected' : ''}>${t}</option>`).join('')}</select></td>
        <td data-label="加入時間">${fmt(e.at)}</td>
        <td><button type="button" class="ed-btn" data-act="rm-editor" data-i="${i}"${e.no === me.no ? ' disabled title="不能移除自己"' : ''}>移除</button></td></tr>`).join('')}
    </tbody></table></div>
    <form class="ed-addform" id="addEditor" novalidate>
      <h2>新增編輯者</h2>
      <div class="ed-fields">
        <label class="ed-f"><span>員工編號</span><input name="no" maxlength="20" autocapitalize="characters" spellcheck="false" required></label>
        <label class="ed-f"><span>姓名<small>顯示用</small></span><input name="name" maxlength="20" required></label>
        <label class="ed-f"><span>權限</span><select name="role">${Object.entries(ROLES).reverse().map(([k, t]) => `<option value="${k}">${t}</option>`).join('')}</select></label>
      </div>
      <p class="ed-err" role="alert"></p>
      <button class="ed-btn ed-primary" type="submit">${ic('plus')}加入名單</button>
    </form>`;
}

// ---------------------------------------------------------
// 8. 切換畫面
// ---------------------------------------------------------
let skipGuard = false;
let lastHash = location.hash;
function render(keepDraft) {
  paintWho();
  if (!me) { app.innerHTML = viewLogin(); return; }
  if (!myRole()) { app.innerHTML = viewDenied(); return; }
  const [, route, arg] = (location.hash || '#pages').match(/^#(\w+)(?:\/(.+))?$/) || [];
  document.body.classList.toggle('is-editing', route === 'edit' || route === 'new');
  if (route === 'edit' || route === 'new') {
    if (!keepDraft) draft = route === 'edit' ? startDraft(decodeURIComponent(arg || '')) : startDraft(null, decodeURIComponent(arg || ''));
    if (!draft) { app.innerHTML = `${tabs('pages')}<p class="ed-hint">找不到這個頁面，可能已經被刪除。<a href="#pages">回到頁面列表</a></p>`; return; }
    app.innerHTML = viewEdit();
    paintPreview();
    if (!keepDraft) setDirty(false); else setDirty(dirty);
    document.title = `${draft.isNew ? '新增頁面' : `編輯「${draft.t}」`}｜編輯後台`;
    return;
  }
  draft = null;
  app.innerHTML = ({ media: viewMedia, help: viewHelp, log: viewLog, trash: viewTrash, editors: viewEditors }[route] || viewPages)();
  if (route === 'media') wakeMedia(app.querySelector('.ed-media'));
  document.title = '編輯後台｜moonland.ai 說明中心';
}

addEventListener('hashchange', () => {
  if (dirty && !skipGuard && !confirm('這頁還有沒儲存的修改，確定要離開嗎？')) {
    skipGuard = true;
    location.hash = lastHash;
    return;
  }
  if (skipGuard && location.hash === lastHash) { skipGuard = false; return; }
  skipGuard = false;
  setDirty(false);
  lastHash = location.hash;
  render();
  window.scrollTo(0, 0);
});
addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

// ---------------------------------------------------------
// 9. 按鈕與輸入
// ---------------------------------------------------------
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (b && b.tagName !== 'SELECT') {
    const a = b.dataset.act;
    if (a === 'login') {
      me = { no: b.dataset.no, name: b.dataset.name };
      try { localStorage.setItem(WHO, JSON.stringify(me)); } catch (x) {}
      render();
      app.focus();
    } else if (a === 'logout') {
      if (dirty && !confirm('這頁還有沒儲存的修改，確定要登出嗎？')) return;
      setDirty(false);
      me = null;
      try { localStorage.removeItem(WHO); } catch (x) {}
      history.replaceState(null, '', location.pathname);
      lastHash = '';
      render();
    } else if (a === 'up' || a === 'down') swap(b.dataset.key, +b.dataset.i, a === 'up' ? -1 : 1);
    else if (a === 'del') removePage(b.dataset.id);
    else if (a === 'restore') restore(+b.dataset.i);
    else if (a === 'copy-media') copyMedia(b);
    else if (a === 'rename-sec') {
      const sec = S.sections[+b.dataset.si];
      const v = (prompt('大分類的新名稱：', sec.label) || '').trim();
      if (v && v !== sec.label) { addLog(`大分類改名（原本是「${sec.label}」）`, '', v); sec.label = v; persist(); render(); }
    } else if (a === 'add-cat') {
      const v = (prompt('新分類的名稱：') || '').trim();
      if (!v) return;
      const id = newId();
      S.pages[id] = { t: v, n: '', d: '', tag: '', icon: 'folder', level: '', minutes: '', models: '', tool: '', body: '', isNew: true };
      S.sections[+b.dataset.si].rows.push({ id, groups: [{ g: '', items: [] }] });
      addLog('新增分類', id, v);
      persist();
      location.hash = `#edit/${id}`;
    } else if (a === 'history') openHistory();
    else if (a === 'add-group' || a === 'del-group') {
      readForm(document.getElementById('pageForm'));
      if (a === 'add-group') draft.groups.push({ g: '', n: 0, src: null });
      else draft.groups.splice(+b.dataset.gi, 1);
      render(true);
      setDirty(true);
    } else if (a === 'rm-editor') {
      const ed = S.editors[+b.dataset.i];
      if (!confirm(`確定要把「${ed.name}」移出編輯者名單嗎？移除後他就不能再編輯。`)) return;
      S.editors.splice(+b.dataset.i, 1);
      addLog(`移除編輯者 ${ed.name}（${ed.no}）`, '', '編輯者名單');
      persist(); render();
    }
    return;
  }
  const pf = e.target.closest('[data-pick-for]');
  if (pf) { openPicker(pf.form.elements[pf.dataset.pickFor]); return; }
  const t = e.target.closest('[data-tool]');
  if (t) { tool(t.dataset.tool); return; }
  const p = e.target.closest('[data-pane-to]');
  if (p) {
    const split = p.closest('.ed-split');
    split.dataset.pane = p.dataset.paneTo;
    split.querySelectorAll('[data-pane-to]').forEach((x) => x.setAttribute('aria-selected', String(x === p)));
    return;
  }
  // 預覽裡的連結只是示意，不跳頁
  if (e.target.closest('#preview a')) e.preventDefault();
});

app.addEventListener('input', (e) => {
  const f = e.target.form;
  if (!f || f.id !== 'pageForm') return;
  setDirty(true);
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => { readForm(f); paintPreview(); }, 150);
});
app.addEventListener('change', (e) => {
  const f = e.target.form;
  if (f && f.id === 'pageForm') { setDirty(true); readForm(f); paintPreview(); return; }
  if (e.target.dataset.act === 'role') {
    const ed = S.editors[+e.target.dataset.i];
    ed.role = e.target.value;
    addLog(`${ed.name} 改成${ROLES[ed.role]}`, '', '編輯者名單');
    persist(); toast(`${ed.name} 現在是${ROLES[ed.role]}。`);
  }
});
app.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  if (f.id === 'pageForm') { savePage(f); return; }
  if (f.id === 'addEditor') {
    const el = f.elements;
    const no = el.no.value.trim().toUpperCase(), name = el.name.value.trim();
    const err = f.querySelector('.ed-err');
    if (!/^[A-Z0-9-]{2,20}$/.test(no)) { err.textContent = '請輸入員工編號（英文字母、數字）。'; el.no.focus(); return; }
    if (!name) { err.textContent = '請輸入姓名。'; el.name.focus(); return; }
    if (S.editors.some((x) => x.no === no)) { err.textContent = `員工編號 ${no} 已經在名單上了。`; el.no.focus(); return; }
    S.editors.push({ no, name, role: el.role.value, at: now() });
    addLog(`新增${ROLES[el.role.value]} ${name}（${no}）`, '', '編輯者名單');
    persist();
    toast(`已把 ${name} 加入名單。登出後可以用他的身分登入試試。`);
    render();
  }
});
// Ctrl+S 儲存
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && document.getElementById('pageForm')) {
    e.preventDefault();
    document.getElementById('pageForm').requestSubmit();
  }
});

document.getElementById('resetDemo').addEventListener('click', () => {
  if (!confirm('要清除這台電腦上所有示範修改、回到說明中心目前的內容嗎？')) return;
  dirty = false;
  try { localStorage.removeItem(STORE); localStorage.removeItem(WHO); } catch (x) {}
  location.href = location.pathname;
});

render();
