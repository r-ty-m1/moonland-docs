// =========================================================
// 編輯後台（edit.html）
// - 正式版（公司網站）：伺服器有 /api/me 時，用公司帳號登入、內容存在伺服器（server/editor.js），儲存後說明中心立刻更新
// - 示範版（GitHub Pages 預覽，沒有伺服器）：登入是模擬的，修改只存在這台電腦的瀏覽器（localStorage ml-editor-demo）
// - 預覽用 markup.js 的 renderMarkup，和說明中心的畫面一樣；內容格式轉換與檢查在 model.js
// - 網址：#pages 頁面列表、#edit/代號 編輯、#new/位置 新增、#shelf 草稿・封存・刪除（#drafts #archive #trash 跳到該區）、#media 圖庫、
//   #log 修改紀錄（內容）、#log/code 網站程式的修改紀錄（server/changelog.json）、#tools 檢查與備份、#editors 編輯者名單、#help 使用說明
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
  grip: 'M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
  archive: 'M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10 M10 12l4 0',
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
// 1. 資料：格式見 model.js
//    sections：[{ label, rows: [{ id, groups?: [{ g, items: [頁面代號] }] }] }]
//    pages：{ 代號: { t 標題, n 目錄名稱, d 摘要, tag, icon, level, minutes, models, tool, body, system? } }
//    正式版從伺服器讀（boot），示範版第一次開啟時從說明中心目前的內容（data/*.js）複製一份
// ---------------------------------------------------------
let LIVE = null;   // 正式版：{ login: 'oidc'|'dev'|'none', user, role }；示範版是 null
function initialState() {
  return {
    v: 2, ...Model.fromSite(window.ARTICLES || {}, window.SECTIONS, window.DRAFTS), history: {}, log: [], trash: [], archive: [], uploads: {}, nextMedia: 9001,
    editors: [
      { no: 'A0001', name: '王小明', role: 'owner', at: now() },
      { no: 'A0002', name: '林小華', role: 'editor', at: now() },
    ],
  };
}

let S = null;
let me = null;
function loadDemo() {
  try { S = JSON.parse(localStorage.getItem(STORE)); } catch (e) {}
  if (!S || S.v !== 2) S = initialState();
  S.archive = S.archive || [];
  Object.assign(MEDIA, S.uploads);
  try { me = JSON.parse(localStorage.getItem(WHO)); } catch (e) {}
}

// 正式版的讀寫都帶 x-ml-editor 標頭（伺服器用它擋掉別的網站偽造的請求）
const api = (url, opt = {}) => fetch(url, { cache: 'no-store', ...opt, headers: { 'x-ml-editor': '1', ...(opt.headers || {}) } });
async function loadLive() {
  const r = await api('api/editor/state');
  if (!r.ok) throw new Error(`state ${r.status}`);
  S = await r.json();
  S.archive = S.archive || [];
  Object.assign(MEDIA, S.uploads);
}

// 存檔。示範版存在瀏覽器；正式版送到伺服器，一次只送一個，回傳 Promise<是否成功>
let saveChain = Promise.resolve(true);
function persist() {
  if (!LIVE) {
    try { localStorage.setItem(STORE, JSON.stringify(S)); return true; }
    catch (e) { toast('這台電腦的瀏覽器空間不夠，剛才的修改沒有存起來。示範版容量有限，請少放幾張大圖。'); return false; }
  }
  saveChain = saveChain.then(async () => {
    let msg;
    try {
      const r = await api('api/editor/state', { method: 'PUT', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ rev: S.rev, sections: S.sections, pages: S.pages, history: S.history, log: S.log, trash: S.trash, archive: S.archive, editors: S.editors }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) { S.rev = j.rev; S.editors = j.editors; return true; }
      msg = r.status === 409 ? '其他人剛剛也改了內容，已載入最新的版本；你剛才的動作沒有存到，請再做一次。'
        : r.status === 401 ? '登入已經過期，請重新整理頁面再登入一次。'
        : `沒有存成功：${j.error || '伺服器出了問題'}`;
    } catch (e) { msg = '連不到伺服器，剛才的修改沒有存起來。請確認網路後再試一次。'; }
    // 沒存成功：重新讀伺服器的內容，畫面才不會顯示沒存到的修改（正在編輯的內容會保留）
    try { await loadLive(); } catch (e) {}
    render(!!draft);
    toast(msg);
    return false;
  });
  return saveChain;
}

const myRole = () => {
  if (LIVE) return LIVE.role;
  const e = me && S.editors.find((x) => x.no === me.no);
  return e ? e.role : null;
};
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
  const drafts = Object.values(S.pages).filter((p) => p.draft).length;
  const items = [['pages', '頁面'], ['shelf', `草稿・封存・刪除${drafts ? `（${drafts} 篇草稿）` : ''}`], ['media', '圖庫'], ['log', '修改紀錄'], ['tools', '檢查與備份']];
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
// 4. 登入：正式版用公司帳號（伺服器處理），示範版是模擬的
// ---------------------------------------------------------
function viewLogin() {
  if (LIVE) {
    const next = encodeURIComponent(location.pathname + location.hash);
    return `<div class="ed-login">
      <span class="ed-login-ic">${ic('lock')}</span>
      <h1>登入編輯後台</h1>
      ${LIVE.login === 'none'
        ? '<div class="ed-note"><b>還沒接上公司帳號登入</b>網站要部署到公司平台、開啟公司帳號登入後才能編輯。請聯絡網站負責人或平台組。</div>'
        : `<p>用<b>公司帳號</b>登入，不用另外記密碼。</p>
          ${LIVE.login === 'dev' ? '<div class="ed-note"><b>本機測試模式</b>這台伺服器還沒接公司帳號，登入時直接輸入員工編號。</div>' : ''}
          <p><a class="ed-btn ed-primary" href="api/auth/login?next=${next}">用公司帳號登入</a></p>`}
    </div>`;
  }
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
    <p><a href="./">回到說明中心 →</a>　<button type="button" class="ed-link" data-act="logout">${LIVE ? '登出' : '換個身分登入'}</button></p>
  </div>`;
}

// ---------------------------------------------------------
// 5. 頁面列表：新增、刪除、排序
// ---------------------------------------------------------
function badge(id) {
  const p = S.pages[id];
  if (p.draft) return '<span class="chip ed-draft">草稿</span>';
  if (p.isNew) return '<span class="chip ed-new">新頁面</span>';
  if (S.history[id] && S.history[id].length) return '<span class="chip ed-mod">已修改</span>';
  return '';
}
// 刪除鈕：按了會問要「封存」還是「刪除」
function acts(id, canDelete) {
  const name = esc(S.pages[id].n || S.pages[id].t);
  return `<span class="ed-acts">
    <button type="button" class="icon-btn sm ed-del" data-act="del" data-id="${id}" aria-label="封存或刪除「${name}」" title="${canDelete === true ? '封存或刪除' : esc(canDelete)}"${canDelete === true ? '' : ' disabled'}>${ic('trash')}</button>
  </span>`;
}
// 拖曳把手：滑鼠或手指按住拖到別的位置（可以跨分類）；鍵盤聚焦後按上下鍵移動
function grip(id) {
  const name = esc(S.pages[id].n || S.pages[id].t);
  return `<button type="button" class="ed-grip" data-drag="${id}" aria-label="調整「${name}」的位置：拖曳，或按上下鍵" title="按住拖曳，調整順序或搬到別的分類">${ic('grip')}</button>`;
}
function itemLi(id) {
  const p = S.pages[id];
  if (p.system) {
    return `<li class="ed-item" data-id="${id}">${grip(id)}<span class="ed-name is-sys">${p.icon ? ic(p.icon) : ic('file')}<span><b>${esc(p.t)}</b><small>系統頁面，內容不能在這裡修改</small></span></span>${acts(id, '系統頁面不能刪除')}</li>`;
  }
  return `<li class="ed-item" data-id="${id}">${grip(id)}<a class="ed-name" href="#edit/${id}">${ic(p.icon || 'file')}<span><b>${esc(p.n || p.t)}${tagHtml(p.tag)}${badge(id)}</b>${p.n && p.n !== p.t ? `<small>${esc(p.t)}</small>` : ''}</span></a>${acts(id, true)}</li>`;
}
function catLi(r) {
  const p = S.pages[r.id];
  const count = r.groups.reduce((n, g) => n + g.items.length, 0);
  const many = r.groups.length > 1;
  return `<li class="ed-cat" data-id="${r.id}">
    <div class="ed-item">${grip(r.id)}<a class="ed-name" href="#edit/${r.id}">${ic(p.icon || 'folder')}<span><b>${esc(p.t)}<span class="chip">分類・${count} 頁</span>${tagHtml(p.tag)}${badge(r.id)}</b></span></a>${acts(r.id, count ? '分類裡還有頁面，先把頁面搬走、封存或刪除，才能處理分類' : true)}</div>
    <div class="ed-kids">${r.groups.map((g, gi) => {
      const k = `c:${r.id}:${gi}`;
      return `${many || g.g ? `<div class="ed-sub">${esc(g.g || '（沒有小標）')}</div>` : ''}
        <ul class="ed-list" data-key="${k}">${g.items.map((id) => itemLi(id)).join('')}</ul>
        <a class="ed-add" href="#new/${k}">${ic('plus')}在${esc(g.g ? `「${g.g}」` : `「${p.t}」`)}新增頁面</a>`;
    }).join('')}</div>
  </li>`;
}
function viewPages() {
  const changed = Object.keys(S.history).filter((k) => S.pages[k] && S.history[k].length).length;
  return `${tabs('pages')}
    <div class="ed-head"><div><h1>頁面</h1><p class="ed-hint">點頁面名稱開始編輯；按住左邊的 ${ic('grip', 'ic sm')} 拖曳，可以調整在左側目錄裡的順序，或拖進別的分類。${LIVE ? '修改儲存後，說明中心馬上就會更新。' : '標示「已修改」「新頁面」的是這台電腦上的示範修改。'}</p></div></div>
    ${S.sections.map((sec, si) => `<section class="ed-sec" aria-labelledby="sec${si}">
      <div class="ed-sec-head"><h2 id="sec${si}">${esc(sec.label)}</h2>
        <button type="button" class="ed-link" data-act="rename-sec" data-si="${si}">改名稱</button></div>
      <ul class="ed-list" data-key="s${si}" data-top="1">${sec.rows.map((r) => (r.groups ? catLi(r) : itemLi(r.id))).join('')}</ul>
      <div class="ed-adds"><a class="ed-add" href="#new/s${si}">${ic('plus')}新增頁面</a><button type="button" class="ed-add" data-act="add-cat" data-si="${si}">${ic('folder')}新增分類</button></div>
    </section>`).join('')}
    <p class="ed-hint ed-count">${changed ? `目前有 ${changed} 頁${LIVE ? '在後台改過' : '在這台電腦上改過'}。` : ''}</p>`;
}

// 把頁面搬到某個位置（key 見 allLists）的第 i 個。分類只能放在大分類底下
const placeName = (key) => listOf(key).label.replace('（直接列在目錄上）', '');
function movePage(id, key, i) {
  const from = locate(id);
  const to = listOf(key);
  if (!from || !to || (isCat(id) && !to.top)) { render(); return; }
  if (from.key === key && from.i === i) { render(); return; }
  const [x] = from.arr.splice(from.i, 1);
  to.arr.splice(i, 0, to.top ? (typeof x === 'string' ? { id: x } : x) : idOf(x));
  addLog(from.key === key ? '調整順序' : `搬到「${placeName(key)}」`, id, S.pages[id].t);
  persist();
  render();
  if (from.key !== key) toast(`已把「${S.pages[id].t}」搬到「${placeName(key)}」。`);
  const g = app.querySelector(`.ed-grip[data-drag="${id}"]`);
  if (g) g.focus({ preventScroll: true });
}

// 拖曳：按住把手移動，經過的位置即時讓開；放開才存檔。按 Esc 取消
let drag = null;
app.addEventListener('pointerdown', (e) => {
  const g = e.target.closest('.ed-grip');
  if (!g || e.button > 0 || drag) return;
  const li = g.closest('li[data-id]');
  e.preventDefault();
  drag = { id: li.dataset.id, li, cat: li.classList.contains('ed-cat'), pid: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, started: false, timer: 0 };
  try { g.setPointerCapture(e.pointerId); } catch (x) {}
});
function placeDrag() {
  const el = document.elementFromPoint(drag.x, drag.y);
  if (!el) return;
  let ul = el.closest('ul.ed-list[data-key]');
  if (!ul || !app.contains(ul)) return;
  if (drag.cat && ul.dataset.top !== '1') ul = ul.parentElement.closest('ul.ed-list[data-top="1"]');
  // 停在分類的小標或「新增頁面」上：先不動，避免頁面在分類前後跳來跳去
  else if (!drag.cat && el.closest('.ed-kids') && !el.closest('.ed-kids ul.ed-list')) return;
  if (!ul) return;
  let before = null;
  for (const c of ul.children) {
    if (c === drag.li || !c.matches('li[data-id]')) continue;
    const box = (c.querySelector(':scope > .ed-item') || c).getBoundingClientRect();
    if (drag.y < box.top + box.height / 2) { before = c; break; }
  }
  if (drag.li.parentElement === ul && drag.li.nextElementSibling === before) return;
  ul.insertBefore(drag.li, before);
}
document.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.pid) return;
  drag.x = e.clientX; drag.y = e.clientY;
  if (!drag.started) {
    if (Math.abs(drag.y - drag.sy) + Math.abs(drag.x - drag.sx) < 5) return;
    drag.started = true;
    document.body.classList.add('ed-dragging');
    drag.li.classList.add('is-dragging');
    // 拖到畫面上下邊緣時自動捲動
    drag.timer = setInterval(() => {
      const edge = 70;
      const d = drag.y < edge ? -(edge - drag.y) / 4 : drag.y > innerHeight - edge ? (drag.y - innerHeight + edge) / 4 : 0;
      if (d) { scrollBy(0, d); placeDrag(); }
    }, 16);
  }
  placeDrag();
});
function endDrag(e, cancel) {
  if (!drag || (e && e.pointerId !== drag.pid)) return;
  const d = drag;
  drag = null;
  clearInterval(d.timer);
  document.body.classList.remove('ed-dragging');
  d.li.classList.remove('is-dragging');
  if (!d.started) return;
  if (cancel) { render(); return; }
  const ul = d.li.parentElement;
  movePage(d.id, ul.dataset.key, [...ul.children].filter((c) => c.matches('li[data-id]')).indexOf(d.li));
}
document.addEventListener('pointerup', (e) => endDrag(e));
document.addEventListener('pointercancel', (e) => endDrag(e, true));
document.addEventListener('keydown', (e) => {
  if (drag && e.key === 'Escape') { endDrag(null, true); return; }
  const g = e.target.closest && e.target.closest('.ed-grip');
  if (!g || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
  e.preventDefault();
  const l = locate(g.dataset.drag);
  const j = l.i + (e.key === 'ArrowUp' ? -1 : 1);
  if (j < 0 || j >= l.arr.length) return;
  movePage(g.dataset.drag, l.key, j);
});

// 按刪除鈕：問要封存（留著，之後可以放回）還是刪除（放進最近刪除，太舊會自動清掉）
const delDlg = document.getElementById('delDlg');
let delId = null;
function askRemove(id) {
  delId = id;
  document.getElementById('delDlgT').textContent = `要怎麼處理「${S.pages[id].t}」？`;
  delDlg.returnValue = '';
  delDlg.showModal();
}
delDlg.addEventListener('close', () => {
  const id = delId;
  delId = null;
  if (!id || !S.pages[id]) return;
  if (delDlg.returnValue === 'archive') takeDown(id, 'archive');
  else if (delDlg.returnValue === 'delete') takeDown(id, 'trash');
});
// 從目錄拿下來，放進封存（archive）或最近刪除（trash）；兩邊都記得原本的位置，之後可以放回
function takeDown(id, where) {
  const p = S.pages[id];
  const l = locate(id);
  const [row] = l.arr.splice(l.i, 1);
  S[where].unshift({ id, key: l.key, row: clone(row), page: clone(p), at: now(), by: me.name });
  delete S.pages[id];
  addLog(where === 'archive' ? '封存' : '刪除', id, p.t);
  persist();
  toast(where === 'archive' ? `已封存「${p.t}」，說明中心看不到了；可以在「草稿・封存・刪除」放回目錄。` : `已刪除「${p.t}」，可以在「草稿・封存・刪除」的最近刪除找回來。`);
  render();
}

// ---------------------------------------------------------
// 6. 編輯頁面
// ---------------------------------------------------------
let draft = null;   // 編輯中的頁面：{ id, isNew, where, groups?, ...頁面欄位 }
let dirty = false;

function newId() {
  let n = 1;
  while (S.pages[`page-${n}`] || S.trash.some((x) => x.id === `page-${n}`) || S.archive.some((x) => x.id === `page-${n}`)) n++;
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
        <label class="ed-f ed-check wide"><input type="checkbox" name="draft"${d.draft ? ' checked' : ''}><span>草稿，先不公開<small>勾選後說明中心看不到這頁${d.groups ? '（分類裡的頁面也一起隱藏）' : ''}；取消勾選再儲存就會公開</small></span></label>
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
          ${d.isNew || S.pages[d.origId].draft ? '' : `<p class="ed-hint"><a href="./#${esc(d.origId)}" target="_blank" rel="noopener">在說明中心看這頁目前的樣子 ↗</a></p>`}
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
    ['{{最常用}}', '小標誌，例如放在模型名稱後面'],
    ['[文字](#頁面代號)', '連到說明中心的其他頁面'],
    ['- 項目', '清單，一行一項'],
    [':::steps … :::', '步驟；每一步用「@ 」開頭'],
    [':::tip 標題 … :::', '綠色提示框；:::warn 是黃色注意框'],
    ['> 提示詞', '可以一鍵複製的提示詞框'],
    ['[i 編號 說明]', '圖片；v 是影片、a 是音訊、3d 是 3D 模型（.glb）'],
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
  const missing = [...new Set([...d.body.matchAll(/\[(?:i|v|a|3d)\s+(\d+)/g)].map((m) => m[1]).filter((n) => !MEDIA[n]))];
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
  d.draft = f.elements.draft.checked;
  const icon = f.querySelector('input[name="icon"]:checked');
  if (icon) d.icon = icon.value;
  if (d.groups) d.groups.forEach((g, gi) => { if (f.elements[`g${gi}`]) g.g = f.elements[`g${gi}`].value.trim(); });
}
const FIELDS = ['t', 'n', 'd', 'tag', 'icon', 'level', 'minutes', 'models', 'tool', 'body', 'draft'];

let saving = false;
async function savePage(f) {
  if (saving) return;
  readForm(f);
  const d = draft;
  const err = document.getElementById('formErr');
  d.t = d.t.trim(); d.id = d.id.trim();
  if (!d.t) { err.textContent = '請填寫標題。'; f.elements.t.focus(); return; }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.id)) { err.textContent = '網址代號只能用英文小寫、數字和 -。'; f.querySelector('.ed-more').open = true; f.elements.slug.focus(); return; }
  if (d.id !== d.origId && (S.pages[d.id] || ['home', 'pages', 'feedback'].includes(d.id))) { err.textContent = `網址代號「${d.id}」已經有其他頁面在用了。`; f.querySelector('.ed-more').open = true; f.elements.slug.focus(); return; }
  if (d.id !== d.origId && S.archive.some((x) => x.id === d.id)) { err.textContent = `網址代號「${d.id}」是一篇封存的頁面在用，請換一個。`; f.querySelector('.ed-more').open = true; f.elements.slug.focus(); return; }
  err.textContent = '';
  // 儲存前檢查：找不到的圖片、連到不存在頁面的連結。可以照樣儲存，但先提醒
  const problems = Model.checkBody(d.body, d.id, { ...S.pages, [d.id]: d }, MEDIA);
  if (problems.length && !confirm(`這頁有些地方要確認：\n・${problems.join('\n・')}\n\n讀者會看到空白的圖片或點不開的連結。還是要儲存嗎？`)) return;

  const page = {};
  FIELDS.forEach((k) => { page[k] = typeof d[k] === 'string' ? d[k].trim() : d[k]; });
  page.body = d.body.replace(/\s+$/, '');
  if (!page.draft) delete page.draft;
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
  saving = true;
  const ok = await persist();
  saving = false;
  if (!ok) return;
  setDirty(false);
  toast(page.draft ? `已存成草稿「${page.t}」，說明中心看不到這頁。${LIVE ? '' : '（示範：只存在這台電腦）'}`
    : LIVE ? `已儲存「${page.t}」，說明中心已經更新。` : `已儲存「${page.t}」（示範：只存在這台電腦）`);
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

// 圖片對話框：上傳的圖片縮到 1600px 寬、轉成 WebP，示範版存在瀏覽器裡；影片（正式版）直接傳到物件儲存
const imgDlg = document.getElementById('imgDlg');
const imgForm = document.getElementById('imgForm');
let pendingImg = null;
let pendingVid = null;   // { file, ratio }：正式版才能上傳影片，直接傳到物件儲存
const isVideoNum = (n) => MEDIA[n] && /\.mp4$/.test(MEDIA[n][0]);
function openImage() {
  imgForm.reset();
  pendingImg = null;
  pendingVid = null;
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
  if (e.target.name === 'kind') { syncKind(f); thumb.innerHTML = ''; pendingImg = pendingVid = null; err.textContent = ''; return; }
  if (e.target.name === 'file' && f.elements.file.files[0]) {
    const file = f.elements.file.files[0];
    err.textContent = '';
    pendingImg = pendingVid = null;
    thumb.innerHTML = '';
    if (file.type.startsWith('video/')) {
      if (!LIVE) { err.textContent = '示範版不能上傳影片，正式版才可以。'; return; }
      if (file.type !== 'video/mp4') { err.textContent = '影片只接受 MP4。'; return; }
      if (file.size > 90 * 1024 * 1024) { err.textContent = '影片超過 90 MB，請先壓縮或剪短。'; return; }
      try { pendingVid = { file, ratio: await videoRatio(file) }; thumb.innerHTML = `<video src="${URL.createObjectURL(file)}" muted controls preload="metadata"></video>`; }
      catch (x) { err.textContent = '讀不到這支影片，請換一支試試。'; }
      return;
    }
    try { pendingImg = await shrink(file); thumb.innerHTML = `<img src="${pendingImg[0]}" alt="">`; }
    catch (x) { pendingImg = null; err.textContent = '讀不到這張圖片，請換一張試試。'; }
  }
});
imgForm.elements.num.addEventListener('input', () => {
  const n = imgForm.elements.num.value.trim();
  document.getElementById('imgThumb').innerHTML = isVideoNum(n) ? `<video src="${mediaUrl(n)}" muted controls preload="metadata"></video>`
    : MEDIA[n] && /\.(webp|png|jpe?g|gif)$|^data:/.test(MEDIA[n][0]) ? `<img src="${mediaUrl(n)}" alt="">` : n ? '<p class="ed-hint">找不到這個編號的圖片或影片。</p>' : '';
});
function videoRatio(file) {
  return new Promise((ok, fail) => {
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => { URL.revokeObjectURL(v.src); v.videoWidth ? ok(+(v.videoWidth / v.videoHeight).toFixed(3)) : fail(new Error('no size')); };
    v.onerror = () => fail(new Error('bad video'));
    v.src = URL.createObjectURL(file);
  });
}
// 正式版上傳：伺服器依「區域／文章代號-序號」命名、給編號，回傳編號
function uploadPlace() {
  const d = draft;
  const pageId = (document.getElementById('pageForm').elements.slug.value.trim() || d.id);
  let area;
  if (!d.isNew) area = Model.areaFor(d.origId, S.sections, MEDIA);
  else {
    const [, si, rowId] = d.where.match(/^s(\d+)$/) || [];
    const c = d.where.match(/^c:([\w-]+):/);
    area = c ? Model.areaOfPlace(S.sections.findIndex((s) => s.rows.some((r) => r.id === c[1])), c[1]) : Model.areaOfPlace(+si, rowId);
  }
  return `page=${encodeURIComponent(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pageId) ? pageId : d.id)}&area=${area}`;
}
async function uploadImage([dataUrl, ratio]) {
  const blob = await (await fetch(dataUrl)).blob();
  const r = await api(`api/editor/media?${uploadPlace()}&ratio=${ratio}`, { method: 'POST', headers: { 'content-type': blob.type }, body: blob });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || '上傳失敗');
  MEDIA[j.n] = [j.path, j.ratio];
  S.uploads[j.n] = MEDIA[j.n];
  return j.n;
}
// 影片：伺服器給一個只能放這個檔案的上傳網址，瀏覽器直接傳到物件儲存（不經過網站），傳完再請伺服器給編號
async function uploadVideo({ file, ratio }, progress) {
  const r = await api(`api/editor/video/start?${uploadPlace()}&ratio=${ratio}&size=${file.size}`, { method: 'POST' });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || '上傳失敗');
  await new Promise((ok, fail) => {
    const x = new XMLHttpRequest();
    x.open('PUT', j.uploadUrl);
    x.setRequestHeader('content-type', 'video/mp4');
    x.upload.onprogress = (e) => { if (e.lengthComputable) progress(Math.round((e.loaded / e.total) * 100)); };
    x.onload = () => (x.status >= 200 && x.status < 300 ? ok() : fail(new Error(/QuotaExceeded/.test(x.responseText) ? '儲存空間已滿' : '影片沒有傳上去')));
    x.onerror = () => fail(new Error('連不到儲存空間'));
    x.send(file);
  });
  const r2 = await api('api/editor/video/finish', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ path: j.path, ratio: j.ratio }) });
  const k = await r2.json().catch(() => ({}));
  if (!r2.ok) throw new Error(k.error || '上傳失敗');
  MEDIA[k.n] = [k.path, k.ratio];
  S.uploads[k.n] = MEDIA[k.n];
  return k.n;
}

imgForm.addEventListener('submit', async (e) => {
  if (e.submitter && e.submitter.value === 'cancel') return;
  const f = imgForm;
  const err = f.querySelector('.ed-err');
  let n;
  let video = false;
  if (f.elements.kind.value === 'upload' && pendingVid) {
    e.preventDefault();
    err.textContent = '影片上傳中… 0%';
    try { n = await uploadVideo(pendingVid, (p) => { err.textContent = `影片上傳中… ${p}%`; }); } catch (x) { err.textContent = `${x.message}，請再試一次。`; return; }
    err.textContent = '';
    video = true;
  } else if (f.elements.kind.value === 'upload' && LIVE) {
    e.preventDefault();
    if (!pendingImg) { err.textContent = '請先選擇一張圖片或影片。'; return; }
    err.textContent = '上傳中…';
    try { n = await uploadImage(pendingImg); } catch (x) { err.textContent = `${x.message}，請再試一次。`; return; }
    err.textContent = '';
  } else if (f.elements.kind.value === 'upload') {
    if (!pendingImg) { e.preventDefault(); err.textContent = '請先選擇一張圖片。'; return; }
    n = String(S.nextMedia++);
    S.uploads[n] = pendingImg;
    MEDIA[n] = pendingImg;
    if (!persist()) { delete S.uploads[n]; delete MEDIA[n]; S.nextMedia--; e.preventDefault(); err.textContent = '瀏覽器空間不夠，示範版放不下這張圖片。'; return; }
  } else {
    n = f.elements.num.value.trim();
    if (!MEDIA[n]) { e.preventDefault(); err.textContent = '找不到這個編號的圖片或影片。'; return; }
    video = isVideoNum(n);
  }
  const cap = f.elements.cap.value.trim().replace(/[\[\]]/g, '');
  e.preventDefault();
  imgDlg.close();
  insertBlock(`[${video ? 'v' : 'i'} ${n}${cap ? ` ${cap}` : ''}]`);
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
cmpForm.addEventListener('submit', async (e) => {
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
    if (cmpPending[s] && LIVE) {
      err.textContent = '上傳中…';
      try { nums[s] = await uploadImage(cmpPending[s]); cmpPending[s] = null; f[`num${s}`].value = nums[s]; }
      catch (x) { err.textContent = `${side[s]}的圖片${x.message}，請再試一次。`; return; }
      err.textContent = '';
    } else if (cmpPending[s]) { const n = String(S.nextMedia++); S.uploads[n] = MEDIA[n] = cmpPending[s]; nums[s] = n; added.push(n); }
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
const KINDS = { image: ['圖片', 'i'], video: ['影片', 'v'], audio: ['音訊', 'a'], '3d': ['3D 模型', '3d'] };
const kindOf = (f) => (/\.glb$/i.test(f) ? '3d' : /\.mp4$/i.test(f) ? 'video' : /\.mp3$/i.test(f) ? 'audio' : 'image');
// 每個編號：檔名、區域、類型，以及用在哪些頁面的哪個段落（從目前的頁面內容即時算出）
function mediaIndex() {
  const uses = {};
  for (const [id, p] of Object.entries(S.pages)) {
    if (p.system || !p.body) continue;
    let h = '';
    for (const line of p.body.split('\n')) {
      const hm = line.trim().match(/^#{2,4}\s+(.+?)(?:\s+\{#[\w-]+\})?$/);
      if (hm) { h = hm[1].replace(/\*\*/g, ''); continue; }
      for (const m of line.matchAll(/\[(?:i|v|a|3d)\s+(\d+)(?:\s+([^\]]+))?\]/g)) {
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
    : m.kind === '3d' ? `<span class="ed-m-kind">${ic('cube')}3D 模型</span>`
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
    ${LIVE ? '' : '<div class="ed-note"><b>目前是示範版</b>登入是模擬的，修改只存在這台電腦的瀏覽器，不會改到說明中心。下面標「正式版」的地方，是之後上線後的做法。</div>'}
    <div class="ed-help">
    ${sec('1. 登入與權限', `<ul>
      <li>用<b>公司帳號</b>登入，不用另外記密碼${LIVE ? '' : '（正式版）'}。</li>
      <li>登入後，要在「編輯者名單」上才能編輯。不在名單上的人會看到「沒有編輯權限」，請找主管理員把你的員工編號加進去。</li>
      <li><b>編輯者</b>可以新增、修改、刪除與排序頁面；<b>主管理員</b>另外可以管理編輯者名單。</li>
      <li>用完記得按右上角的登出。</li></ul>`, true)}
    ${sec('2. 頁面與目錄', `<ul>
      <li>「頁面」分頁就是說明中心左側目錄的樣子，由上到下照順序排。</li>
      <li>點頁面名稱開始編輯。</li>
      <li><b>調整順序、換分類</b>：按住頁面左邊的 ${ic('grip', 'ic sm')} 拖到想放的位置再放開，可以拖進別的分類或小標底下（手機一樣用手指按住拖）。拖到一半想取消就按 Esc。用鍵盤的話，按 Tab 移到 ${ic('grip', 'ic sm')} 再按上下鍵。也可以進入頁面，改「放在哪裡」再儲存，頁面會移到新位置的最後面。</li>
      <li>「分類」是一組頁面（例如「圖片生成」底下的多篇）。分類只能放在大分類底下；分類裡還有頁面時不能封存或刪除，要先把頁面搬走。</li>
      <li><b>垃圾桶</b>：會問你要「封存」還是「刪除」。<b>封存</b>是暫時拿下來、長期保留，之後可以放回；<b>刪除</b>是不要了，只保留最近 100 筆。</li>
      <li>標示「已修改」「新頁面」的，是和說明中心目前內容不同的地方。</li>
      <li><b>草稿</b>：還沒寫完、不想讓讀者看到的頁面，在編輯畫面勾選「草稿，先不公開」再儲存。所有草稿都列在「草稿・封存・刪除」；寫好後取消勾選再儲存，就會公開。公開的頁面不要連到草稿，儲存時會提醒你。</li></ul>`)}
    ${sec('3. 編輯一篇文章', `<ol>
      <li>填<b>標題</b>（必填）與<b>摘要</b>（一兩句話，會出現在搜尋結果）。</li>
      <li>內文用上方工具列插入格式：小標題、粗體、連結、清單、步驟、提示框、注意框、表格、提示詞、圖片、前後比較、並排。</li>
      <li>右邊（手機上切到「預覽」）就是讀者會看到的樣子。</li>
      <li>按<b>儲存</b>（或 Ctrl+S），說明中心馬上就會更新。還沒儲存就離開，會先問你。</li>
      <li>儲存時會自動檢查有沒有找不到的圖片、點不開的連結，有的話會先提醒你。</li></ol>
      <p>不確定格式怎麼寫，按工具列最後的「寫法說明」，或看下面的速查表：</p>
      <div class="ed-cheat">${cheatSheet()}</div>
      <p>小提醒：連到別的頁面請用「連結」按鈕挑選，不要自己打網址；改了頁面的「網址代號」，其他頁面的連結會自動跟著改。</p>`)}
    ${sec('4. 圖片', `<ul>
      <li><b>插入圖片或影片</b>：工具列「圖片」→ 從電腦上傳，或「從圖庫挑選」網站上已經有的圖片、影片。</li>
      <li>上傳的圖會自動縮小、轉成網頁用的格式，並自動取好檔名、給一個編號，<b>不用自己改檔名</b>${LIVE ? '' : '（正式版）'}。</li>
      <li>影片只接受 MP4，90 MB 以內（正式版）；太大請先壓縮或剪短。上傳時畫面會顯示進度，傳完才能插入。音訊請交給網站負責人。</li>
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
      <li>檔名規則是「區域／文章代號-序號」，例如 <code>image/img-basics-03.webp</code>；上傳時會自動照規則命名。</li></ul>`)}
    ${sec('7. 改錯了怎麼辦', `<ul>
      <li><b>版本紀錄</b>：編輯畫面右上角。每次儲存都會留一版，選一版載入、確認後再按儲存，就還原了。</li>
      <li><b>草稿・封存・刪除</b>：封存的頁面按「放回目錄」、刪掉的頁面按「還原」，都會回到原本的位置。</li>
      <li><b>修改紀錄</b>：「內容修改」是誰在什麼時候改了哪一頁；「網站程式修改」是網站本身的版面、功能改了什麼（工程師更新程式時記的）。</li>
      <li><b>檢查與備份</b>：一次檢查全站的圖片和連結；下載整個網站的備份檔。網站的儲存空間不是備份，建議每個月、或大改之前下載一次，存到公司雲端硬碟。主管理員可以用備份檔還原整個網站。</li>
      <li>兩個人同時改內容時，後存的人會看到「其他人剛剛也改了內容」，畫面會換成最新版本；正在編輯的文字還在，再按一次儲存就好。</li></ul>`)}
    ${sec('8. 編輯者名單（主管理員）', `<ul>
      <li>輸入同事的<b>員工編號</b>和姓名、選權限，按「加入名單」。</li>
      <li>公司帳號不會告訴網站部門或職稱，所以誰能編輯要在這裡手動維護。</li>
      <li>同事離職或調職，記得移除。不能移除或降級自己，避免沒有人能管理名單。</li>
      <li>標「網站設定」的主管理員寫在網站程式裡（<code>server/owners.json</code>），要變更請找平台組。</li></ul>`)}
    ${sec('9. 遇到問題找誰', `<ul>
      <li>內容怎麼寫、誰能編輯：找網站負責人或主管理員。</li>
      <li>網站打不開、圖片全部不見、登入失敗：找平台組，並告訴他們網站網址和發生時間。工程師用的維護手冊在程式碼的 <code>docs/MAINTENANCE.md</code>。</li>
      <li>讀者的意見回饋在「回饋後台」（<a href="admin.html">admin.html</a>）。</li></ul>`)}
    </div>`;
}

// ---------------------------------------------------------
// 7. 修改紀錄、最近刪除、編輯者名單
// ---------------------------------------------------------
// 網站程式的修改紀錄：正式版跟著後台內容一起讀；示範版直接讀 server/changelog.json
let codeChanges = null;
function loadChanges() {
  if (codeChanges || loadChanges.p) return;
  if (LIVE && Array.isArray(S.changes)) { codeChanges = S.changes; return; }
  loadChanges.p = fetch('server/changelog.json', { cache: 'no-cache' }).then((r) => r.json()).then((j) => { codeChanges = j.changes || []; })
    .catch(() => { codeChanges = []; }).then(() => { loadChanges.p = null; if (/^#log\/code/.test(location.hash)) render(); });
}
function viewLog(sub) {
  const code = sub === 'code';
  const seg = `<div class="ed-seg" role="tablist" aria-label="修改紀錄的種類">
    <a href="#log" role="tab" aria-selected="${!code}"${code ? '' : ' aria-current="page"'}>內容修改</a>
    <a href="#log/code" role="tab" aria-selected="${code}"${code ? ' aria-current="page"' : ''}>網站程式修改</a></div>`;
  if (code) {
    loadChanges();
    const list = codeChanges;
    return `${tabs('log')}<div class="ed-head"><div><h1>修改紀錄</h1><p class="ed-hint">網站本身的程式（版面、功能、修正錯誤）改了什麼。這些修改由工程師或網站負責人更新程式，不是在後台改的；文章內容的修改在「內容修改」。</p></div></div>${seg}
      ${!list ? '<p class="ed-hint">讀取中…</p>' : list.length ? `<div class="ed-tbl"><table class="ed-table ed-code-log"><thead><tr><th>日期</th><th>改了什麼</th><th>版本</th></tr></thead><tbody>
        ${list.map((x) => `<tr><td data-label="日期">${esc(String(x.date || '').replace(/-/g, '/'))}</td><td data-label="改了什麼">${esc(x.text || '')}</td><td data-label="版本">${x.commit ? `<code>${esc(x.commit)}</code>` : '<span class="ed-hint">最新</span>'}</td></tr>`).join('')}
      </tbody></table></div>` : '<p class="ed-hint">還沒有網站程式的修改紀錄。</p>'}`;
  }
  return `${tabs('log')}<div class="ed-head"><div><h1>修改紀錄</h1><p class="ed-hint">誰在什麼時候改了哪一頁。${LIVE ? '所有編輯者都看得到。' : '正式版會記在伺服器上，所有編輯者都看得到。'}</p></div></div>${seg}
    ${S.log.length ? `<div class="ed-tbl"><table class="ed-table"><thead><tr><th>時間</th><th>誰</th><th>做了什麼</th><th>頁面</th></tr></thead><tbody>
      ${S.log.map((x) => `<tr><td data-label="時間">${fmt(x.at)}</td><td data-label="誰">${esc(x.by)}</td><td data-label="做了什麼">${esc(x.action)}</td>
        <td data-label="頁面">${S.pages[x.id] && !S.pages[x.id].system ? `<a href="#edit/${x.id}">${esc(x.t)}</a>` : esc(x.t)}</td></tr>`).join('')}
    </tbody></table></div>` : '<p class="ed-hint">還沒有任何修改。</p>'}`;
}
// 草稿・封存・刪除：說明中心看不到的頁面放在同一頁
// - 草稿：還在目錄裡的原位置，只是不公開；寫好取消勾選「草稿」就公開
// - 封存：從目錄拿下來長期保留（不會自動清掉），可以放回原位置
// - 最近刪除：只留最近 100 筆，太舊的自動清掉
function viewShelf(route) {
  const drafts = Object.keys(S.pages).filter((id) => S.pages[id].draft && locate(id));
  const sec = (id, icon, title, hint, body) => `<section class="ed-sec" id="${id}" aria-labelledby="${id}-h"><div class="ed-sec-head"><h2 id="${id}-h">${ic(icon)}${title}</h2></div><p class="ed-hint">${hint}</p>${body}</section>`;
  const taken = (x, verb) => `<span class="ed-name">${ic(x.page.icon || 'file')}<span><b>${esc(x.page.t)}</b><small>${esc(x.by)} 在 ${fmt(x.at)} ${verb}・原本在「${esc(listOf(x.key) ? placeName(x.key) : '已經不在的位置')}」</small></span></span>`;
  return `${tabs('shelf')}<div class="ed-head"><div><h1>草稿・封存・刪除</h1><p class="ed-hint">說明中心看不到的頁面都在這裡。</p></div></div>
    <nav class="ed-jump" aria-label="跳到">${[['drafts', '草稿', drafts.length], ['archive', '封存', S.archive.length], ['trash', '最近刪除', S.trash.length]].map(([k, t, n]) => `<a href="#${k}"${route === k ? ' aria-current="true"' : ''}>${t}<span class="chip">${n}</span></a>`).join('')}</nav>
    ${sec('sh-drafts', 'pencil', `草稿（${drafts.length}）`, '還沒寫完、先不公開的頁面，留在目錄裡原本的位置。寫好後進入頁面，取消勾選「草稿」再儲存就會公開。',
      drafts.length ? `<ul class="ed-list">${drafts.map((id) => { const p = S.pages[id]; return `<li class="ed-item"><a class="ed-name" href="#edit/${id}">${ic(p.icon || 'file')}<span><b>${esc(p.n || p.t)}<span class="chip ed-draft">草稿</span></b><small>${esc(placeName(locate(id).key))}</small></span></a></li>`; }).join('')}</ul>` : '<p class="ed-hint">目前沒有草稿。</p>')}
    ${sec('sh-archive', 'archive', `封存（${S.archive.length}）`, '暫時不用、但可能還會用到的頁面。會一直保留，不會自動清掉；按「放回目錄」就回到原本的位置。',
      S.archive.length ? `<ul class="ed-list ed-trash">${S.archive.map((x, i) => `<li class="ed-item">${taken(x, '封存')}<span class="ed-row-acts">
        <button type="button" class="ed-btn" data-act="unarchive" data-i="${i}">${ic('restore')}放回目錄</button>
        <button type="button" class="ed-btn ed-del" data-act="archive-del" data-i="${i}">${ic('trash')}刪除</button></span></li>`).join('')}</ul>` : '<p class="ed-hint">沒有封存的頁面。在「頁面」按垃圾桶，可以選擇封存。</p>')}
    ${sec('sh-trash', 'trash', `最近刪除（${S.trash.length}）`, '刪掉的頁面先放在這裡，按「還原」就會放回原本的位置。只保留最近 100 筆，更早的會自動清掉；想留久一點請改用封存。',
      S.trash.length ? `<ul class="ed-list ed-trash">${S.trash.map((x, i) => `<li class="ed-item">${taken(x, '刪除')}<span class="ed-row-acts">
        <button type="button" class="ed-btn" data-act="restore" data-i="${i}">${ic('restore')}還原</button></span></li>`).join('')}</ul>` : '<p class="ed-hint">沒有刪除的頁面。</p>')}`;
}
// 從封存或最近刪除放回原本的位置（位置不在了就放到第一個大分類）
function putBack(where, i) {
  const x = S[where][i];
  if (S.pages[x.id]) { toast(`網址代號「${x.id}」已經被其他頁面用了，無法放回。`); return; }
  let l = listOf(x.key);
  if (!l || (x.row.groups && !l.top)) l = listOf('s0');
  S.pages[x.id] = x.page;
  l.arr.push(l.top ? (typeof x.row === 'string' ? { id: x.id } : x.row) : x.id);
  S[where].splice(i, 1);
  addLog(where === 'archive' ? '取消封存' : '還原', x.id, x.page.t);
  persist();
  toast(`已把「${x.page.t}」放回「${placeName(l.key)}」的最後面${x.page.draft ? '（還是草稿）' : ''}。`);
  render();
}
function archiveToTrash(i) {
  const x = S.archive[i];
  if (!confirm(`確定要刪除封存的「${x.page.t}」嗎？\n會移到「最近刪除」，只保留最近 100 筆。`)) return;
  S.archive.splice(i, 1);
  S.trash.unshift({ ...x, at: now(), by: me.name });
  addLog('刪除（原本封存）', x.id, x.page.t);
  persist();
  render();
}

// 檢查與備份：全站檢查缺圖、壞連結；正式版可以下載備份、主管理員可以從備份還原
function viewTools() {
  const problems = Model.checkAll(S.pages, MEDIA);
  return `${tabs('tools')}<div class="ed-head"><div><h1>檢查與備份</h1></div></div>
    <section class="ed-sec"><div class="ed-sec-head"><h2>全站檢查</h2></div>
      <p class="ed-hint">檢查每一頁有沒有找不到的圖片、點不開的站內連結。儲存單頁時也會自動檢查。</p>
      ${problems.length ? `<ul class="ed-list">${problems.map((x) => `<li class="ed-item"><a class="ed-name" href="#edit/${x.id}">${ic('alert')}<span><b>${esc(x.t)}</b>${x.problems.map((p) => `<small>${esc(p)}</small>`).join('')}</span></a></li>`).join('')}</ul>`
        : `<p class="ed-ok">${ic('check')}全部 ${Object.values(S.pages).filter((p) => !p.system).length} 頁都沒有問題。</p>`}
    </section>
    <section class="ed-sec"><div class="ed-sec-head"><h2>備份</h2></div>
      ${LIVE ? `<p class="ed-hint">把所有頁面、目錄、版本紀錄、編輯者名單和後台上傳的圖片、影片，下載成一個檔案。<b>網站的儲存空間不是備份</b>，建議每個月、或大改之前下載一次，存到公司的雲端硬碟。</p>
        <p><a class="ed-btn" href="api/editor/backup" download>${ic('down')}下載備份檔</a></p>
        ${myRole() === 'owner' ? `<form class="ed-addform" id="restoreForm" novalidate>
          <h2>從備份還原（主管理員）</h2>
          <p class="ed-hint">會用備份檔的內容<b>整個取代</b>目前的網站內容。還原前建議先下載一份目前的備份。</p>
          <label class="ed-f"><span>備份檔（.json）</span><input type="file" name="file" accept=".json,application/json" required></label>
          <p class="ed-err" role="alert"></p>
          <button class="ed-btn" type="submit">${ic('restore')}還原</button></form>` : ''}`
        : '<p class="ed-hint">示範版的修改只存在這台電腦，沒有備份功能。正式版可以在這裡下載整個網站的備份檔。</p>'}
    </section>`;
}
async function restoreBackup(f) {
  const err = f.querySelector('.ed-err');
  const file = f.elements.file.files[0];
  if (!file) { err.textContent = '請先選擇備份檔。'; return; }
  if (!confirm(`確定要用「${file.name}」取代目前整個網站的內容嗎？`)) return;
  err.textContent = '還原中…';
  try {
    const r = await api('api/editor/restore', { method: 'POST', headers: { 'content-type': 'application/json' }, body: file });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || '還原失敗');
    await loadLive();
    toast('已從備份還原，說明中心已經更新。');
    location.hash = '#pages';
  } catch (x) { err.textContent = x.message; }
}

function viewEditors() {
  if (myRole() !== 'owner') return `${tabs('pages')}<p class="ed-hint">只有主管理員可以管理編輯者名單。</p>`;
  return `${tabs('editors')}<div class="ed-head"><div><h1>編輯者名單</h1></div></div>
    <div class="ed-note"><b>這份名單決定誰能編輯</b>${LIVE ? '' : '正式版裡，'}同事用公司帳號登入後，系統會拿到他的員工編號；在這份名單上的人才能進入後台。公司帳號不會告訴網站部門或職稱，所以名單要由主管理員在這裡維護。標「網站設定」的主管理員寫在網站程式裡，不能在這裡移除。</div>
    <div class="ed-tbl"><table class="ed-table"><thead><tr><th>姓名</th><th>員工編號</th><th>權限</th><th>加入時間</th><th><span class="vh">動作</span></th></tr></thead><tbody>
      ${S.editors.map((e, i) => `<tr><td data-label="姓名">${esc(e.name)}${e.no === me.no ? '<span class="chip">你</span>' : ''}${e.fixed ? '<span class="chip">網站設定</span>' : ''}</td><td data-label="員工編號">${esc(e.no)}</td>
        <td data-label="權限"><select data-act="role" data-i="${i}" aria-label="${esc(e.name)} 的權限"${e.no === me.no || e.fixed ? ' disabled' : ''}>${Object.entries(ROLES).map(([k, t]) => `<option value="${k}"${k === e.role ? ' selected' : ''}>${t}</option>`).join('')}</select></td>
        <td data-label="加入時間">${fmt(e.at)}</td>
        <td><button type="button" class="ed-btn" data-act="rm-editor" data-i="${i}"${e.no === me.no ? ' disabled title="不能移除自己"' : e.fixed ? ' disabled title="網站設定裡的主管理員，要請平台組修改 server/owners.json"' : ''}>移除</button></td></tr>`).join('')}
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
  const shelf = ['shelf', 'drafts', 'archive', 'trash'].includes(route);
  app.innerHTML = shelf ? viewShelf(route) : route === 'log' ? viewLog(arg) : ({ media: viewMedia, help: viewHelp, tools: viewTools, editors: viewEditors }[route] || viewPages)();
  if (route === 'media') wakeMedia(app.querySelector('.ed-media'));
  if (shelf && route !== 'shelf') requestAnimationFrame(() => { const s = document.getElementById(`sh-${route}`); if (s) s.scrollIntoView(); });
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
      if (LIVE) {
        // 只登出本站；公司帳號（SSO）維持登入
        api('api/auth/logout', { method: 'POST' }).finally(() => { location.href = location.pathname; });
        return;
      }
      me = null;
      try { localStorage.removeItem(WHO); } catch (x) {}
      history.replaceState(null, '', location.pathname);
      lastHash = '';
      render();
    } else if (a === 'del') askRemove(b.dataset.id);
    else if (a === 'restore') putBack('trash', +b.dataset.i);
    else if (a === 'unarchive') putBack('archive', +b.dataset.i);
    else if (a === 'archive-del') archiveToTrash(+b.dataset.i);
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
  if (f.id === 'restoreForm') { restoreBackup(f); return; }
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
    toast(LIVE ? `已把 ${name} 加入名單，他用公司帳號登入後就能編輯。` : `已把 ${name} 加入名單。登出後可以用他的身分登入試試。`);
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
  if (LIVE) return;
  if (!confirm('要清除這台電腦上所有示範修改、回到說明中心目前的內容嗎？')) return;
  dirty = false;
  try { localStorage.removeItem(STORE); localStorage.removeItem(WHO); } catch (x) {}
  location.href = location.pathname;
});

// ---------------------------------------------------------
// 10. 啟動：伺服器回應 /api/me 就是正式版，否則（GitHub Pages）是示範版
// ---------------------------------------------------------
async function boot() {
  try {
    const r = await fetch('api/me', { cache: 'no-store' });
    if (r.ok && (r.headers.get('content-type') || '').includes('json')) LIVE = await r.json();
  } catch (e) {}
  document.body.classList.toggle('is-live', !!LIVE);
  if (!LIVE) loadDemo();
  else {
    me = LIVE.user;
    S = { sections: [], pages: {}, history: {}, log: [], trash: [], archive: [], editors: [], uploads: {} };
    if (me && LIVE.role) {
      try { await loadLive(); }
      catch (e) { app.innerHTML = '<p class="ed-hint">讀不到網站內容，請重新整理頁面；一直失敗請聯絡平台組。</p>'; return; }
    }
  }
  render();
}
// 切回這個分頁時，順便讀一次最新內容（別人可能剛改過）；編輯到一半時不讀
document.addEventListener('visibilitychange', async () => {
  if (!LIVE || !LIVE.role || document.hidden || draft || dirty) return;
  try { await loadLive(); render(); } catch (e) {}
});
boot();
