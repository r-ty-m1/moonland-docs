// =========================================================
// 內容的兩種形狀互相轉換，並檢查內容有沒有問題
// 瀏覽器（編輯後台）與伺服器（server/editor.js、server/test.js）共用這一支
//
// 說明中心讀的形狀（data/*.js）：
//   ARTICLES：{ 代號: { t, n?, d?, level?, minutes?, models?: [], tool?, body } }
//   SECTIONS：[{ label, rows: [{ id, icon, n?, tag? } | { id, t, icon, d?, tag?, groups: [{ g, items: [[代號, 目錄名稱, 標籤?]] }] }] }]
// 編輯後台存的形狀：
//   sections：[{ label, rows: [{ id, groups?: [{ g, items: [代號] }] }] }]
//   pages：{ 代號: { t, n, d, tag, icon, level, minutes, models（逗號分隔）, tool, body, system?, isNew?, draft? } }
// 草稿（draft: true）留在目錄裡原本的位置，但說明中心看不到（toSite 會跳過）
// 程式附的草稿在 data/drafts.js（DRAFTS），只有編輯後台載入
// =========================================================
(function (root) {
  // 說明中心 → 編輯後台
  function fromSite(A, SECTIONS, DRAFTS) {
    const pages = {};
    const extra = (a) => ({ level: a.level || '', minutes: a.minutes ? String(a.minutes) : '', models: (a.models || []).join(', '), tool: a.tool || '', body: (a.body || '').replace(/^\n+/, '') });
    const sections = SECTIONS.map((sec) => ({
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
    // 草稿：in 是分類代號（放進那個分類的第一組）或 s0、s1…（直接列在第幾個大分類）；after 是放在哪一頁後面
    for (const [id, a] of Object.entries(DRAFTS || {})) {
      if (pages[id]) continue;
      pages[id] = { t: a.t || id, n: a.n || '', d: a.d || '', tag: a.tag || '', icon: a.icon || '', ...extra(a), draft: true };
      const top = /^s(\d+)$/.exec(a.in || '');
      const cat = !top && sections.flatMap((s) => s.rows).find((r) => r.id === a.in && r.groups);
      const arr = cat ? cat.groups[0].items : (sections[top ? +top[1] : sections.length - 1] || sections[0]).rows;
      const at = arr.findIndex((x) => (typeof x === 'string' ? x : x.id) === a.after);
      const item = cat ? id : { id };
      if (at >= 0) arr.splice(at + 1, 0, item); else arr.push(item);
      if (!cat) pages[id].icon = pages[id].icon || 'file';
    }
    return { sections, pages };
  }

  // 編輯後台 → 說明中心
  function toSite(sections, pages) {
    const ARTICLES = {};
    const article = (p) => {
      const a = { t: p.t };
      if (p.d) a.d = p.d;
      if (p.level) a.level = p.level;
      if (+p.minutes) a.minutes = +p.minutes;
      const models = String(p.models || '').split(/[,，、]/).map((m) => m.trim()).filter(Boolean);
      if (models.length) a.models = models;
      if (p.tool) a.tool = p.tool;
      a.body = `\n${p.body || ''}\n`;
      return a;
    };
    const live = (id) => pages[id] && !pages[id].draft;
    const SECTIONS = sections.map((sec) => ({
      label: sec.label,
      rows: sec.rows.filter((r) => live(r.id)).map((r) => {
        const p = pages[r.id];
        if (r.groups) {
          const row = { id: r.id, t: p.t, icon: p.icon || 'folder' };
          if (p.d) row.d = p.d;
          if (p.tag) row.tag = p.tag;
          row.groups = r.groups.map((g) => ({ g: g.g, items: g.items.filter(live).map((id) => {
            const q = pages[id];
            ARTICLES[id] = article(q);
            return q.tag ? [id, q.n || q.t, q.tag] : [id, q.n || q.t];
          }) })).filter((g, i, all) => g.items.length || (i === 0 && all.every((x) => !x.items.length)));
          // 分類頁本身有內文（例如「模型指南」）才算一篇文章
          if (p.body) ARTICLES[r.id] = article(p);
          return row;
        }
        if (p.system) return { id: r.id, t: p.t, icon: p.icon };
        ARTICLES[r.id] = article(p);
        const row = { id: r.id, icon: p.icon || 'file' };
        if (p.n) row.n = p.n;
        if (p.tag) row.tag = p.tag;
        return row;
      }),
    }));
    return { ARTICLES, SECTIONS };
  }

  // 檢查一篇內文：找不到的媒體編號、連到不存在頁面的連結、本頁找不到的 #h- 錨點
  function checkBody(body, id, pages, MEDIA) {
    const out = [];
    body = String(body || '');
    const media = [...new Set([...body.matchAll(/\[(?:i|v|a)\s+(\d+)/g)].map((m) => m[1]).filter((n) => !MEDIA[n]))];
    if (media.length) out.push(`找不到媒體編號 ${media.join('、')}`);
    const ids = [...new Set([...body.matchAll(/\]\(#([\w-]+)\)/g)].map((m) => m[1]))];
    const links = ids.filter((k) => (k.startsWith('h-') ? !body.includes(`{#${k}}`) : !(k === 'home' || k === id || pages[k])));
    if (links.length) out.push(`這些連結找不到目標：${links.map((k) => `#${k}`).join('、')}`);
    // 公開的頁面連到草稿，讀者會點到找不到的頁面
    const drafts = pages[id] && pages[id].draft ? [] : ids.filter((k) => k !== id && pages[k] && pages[k].draft);
    if (drafts.length) out.push(`這些連結指到還沒公開的草稿：${drafts.map((k) => `#${k}`).join('、')}`);
    return out;
  }

  // 檢查整個網站：[{ id, t, problems: [...] }]
  function checkAll(pages, MEDIA) {
    const out = [];
    for (const [id, p] of Object.entries(pages)) {
      if (p.system) continue;
      const problems = checkBody(p.body, id, pages, MEDIA);
      if (problems.length) out.push({ id, t: p.t, problems });
    }
    return out;
  }

  // 結構檢查（伺服器存檔前用）：回傳錯誤訊息，沒問題回傳空字串
  const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  function checkShape(sections, pages) {
    if (!Array.isArray(sections) || !pages || typeof pages !== 'object') return '資料格式不正確';
    const seen = new Set();
    const use = (id) => {
      if (typeof id !== 'string' || !ID.test(id)) return `頁面代號「${id}」不合格`;
      if (seen.has(id)) return `頁面代號「${id}」重複出現在目錄裡`;
      if (!pages[id] || typeof pages[id] !== 'object') return `目錄裡的「${id}」找不到頁面內容`;
      seen.add(id);
      return '';
    };
    for (const sec of sections) {
      if (!sec || typeof sec.label !== 'string' || !Array.isArray(sec.rows)) return '大分類格式不正確';
      for (const r of sec.rows) {
        const e = use(r && r.id);
        if (e) return e;
        if (r.groups) {
          if (!Array.isArray(r.groups)) return '分類格式不正確';
          for (const g of r.groups) {
            if (!g || !Array.isArray(g.items)) return '分類格式不正確';
            for (const id of g.items) { const e2 = use(id); if (e2) return e2; }
          }
        }
      }
    }
    for (const [id, p] of Object.entries(pages)) {
      if (!seen.has(id)) return `頁面「${id}」不在目錄裡`;
      if (typeof p.t !== 'string' || !p.t.trim()) return `頁面「${id}」沒有標題`;
    }
    return '';
  }

  // 媒體放哪個區域資料夾：先看這頁已經有的圖，再看它在哪個分類，最後看大分類
  const AREA_OF_ROW = { chat: 'chat', image: 'image', video: 'video', lab: 'lab', 'music-3d': 'lab', 'credit-tools': 'lab', recipes: 'recipes', models: 'models', team: 'team', admin: 'team' };
  const AREA_OF_SECTION = ['start', 'lab', 'recipes', 'team', 'support'];
  function areaFor(id, sections, MEDIA) {
    for (const e of Object.values(MEDIA)) {
      const m = String(e[0]).match(/^([a-z]+)\/([a-z0-9-]+)-\d{2,3}\.\w+$/);
      if (m && m[2] === id && m[1] !== 'unused') return m[1];
    }
    for (let si = 0; si < sections.length; si++) {
      for (const r of sections[si].rows) {
        if (r.id === id || (r.groups || []).some((g) => g.items.includes(id))) return areaOfPlace(si, r.id);
      }
    }
    return 'support';
  }
  // 第幾個大分類、哪個分類（還沒存的新頁面用這個）
  const areaOfPlace = (si, rowId) => AREA_OF_ROW[rowId] || AREA_OF_SECTION[si] || 'support';

  const api = { fromSite, toSite, checkBody, checkAll, checkShape, areaFor, areaOfPlace };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Model = api;
})(this);
