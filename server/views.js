// 閱讀流量：說明中心送來的閱讀紀錄（POST /api/view），回饋後台「閱讀流量」讀統計（GET /api/views）
// - 存在 DATA_DIR/views/年-月.jsonl，一行一筆；保存 13 個月，舊的檔案自動刪掉
// - 每筆只有：時間、頁面、標題、這次閱讀的代號（view）、瀏覽器隨機代號（vid）、看了幾秒、捲到多深、從哪裡來、是不是編輯者
//   不存 IP、不存瀏覽器資訊；搜尋引擎機器人送來的直接丟掉
// - 同一次閱讀（view 代號相同）可能送好幾次（切走分頁又回來），統計時只算秒數最多的那筆
const fs = require('node:fs');
const path = require('node:path');

const KEEP_MONTHS = 13;
const SRC = /^(?:direct|internal|platform|google|engine|jiji|search|other:[a-z0-9.-]{1,60})$/;
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python|java\//i;
const str = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

// 台灣時間的日期（YYYY-MM-DD）
const dayOf = (iso) => new Date(Date.parse(iso) + 8 * 36e5).toISOString().slice(0, 10);
const monthOf = (ms) => new Date(ms + 8 * 36e5).toISOString().slice(0, 7);

module.exports = function views(DATA_DIR) {
  const DIR = path.join(DATA_DIR, 'views');

  function clean(b) {
    if (!b || typeof b !== 'object') return null;
    const base = { at: new Date().toISOString(), vid: str(b.vid, 40) };
    if (b.staff === true) base.staff = true;
    if (b.lang === 'en') base.lang = 'en';   // 英文版（沒寫就是中文）
    if (b.kind === 'view') {
      const page = str(b.page, 60);
      const view = str(b.view, 20);
      const sec = Math.round(Number(b.sec));
      const depth = Math.round(Number(b.depth));
      const src = str(b.src, 80).toLowerCase();
      if (!/^[\w-]+$/.test(page) || !/^[a-z0-9]{4,20}$/.test(view) || !(sec >= 3) || !(depth >= 0) || !SRC.test(src)) return null;
      return { ...base, kind: 'view', page, t: str(b.t, 100), view, sec: Math.min(sec, 86400), depth: Math.min(depth, 100), src };
    }
    if (b.kind === 'miss') {
      const q = str(b.q, 60).replace(/\s+/g, ' ');
      return q ? { ...base, kind: 'miss', q } : null;
    }
    return null;
  }

  // 收一筆：回傳 true 存好、false 格式不對；機器人回傳 'bot'（不存，也不算錯）
  function add(body, ua) {
    if (BOT.test(String(ua || ''))) return 'bot';
    const e = clean(body);
    if (!e) return false;
    fs.mkdirSync(DIR, { recursive: true });
    fs.appendFileSync(path.join(DIR, `${monthOf(Date.now())}.jsonl`), JSON.stringify(e) + '\n');
    return true;
  }

  function prune() {
    let files = [];
    try { files = fs.readdirSync(DIR); } catch { return; }
    const d = new Date(Date.now() + 8 * 36e5);
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() - (KEEP_MONTHS - 1));
    const oldest = d.toISOString().slice(0, 7);
    for (const f of files) if (/^\d{4}-\d{2}\.jsonl$/.test(f) && f.slice(0, 7) < oldest) { try { fs.unlinkSync(path.join(DIR, f)); } catch {} }
  }
  prune();
  setInterval(prune, 864e5).unref();

  function read(sinceIso) {
    let files = [];
    try { files = fs.readdirSync(DIR).filter((f) => /^\d{4}-\d{2}\.jsonl$/.test(f)).sort(); } catch { return []; }
    const fromMonth = sinceIso ? monthOf(Date.parse(sinceIso)) : '';
    const out = [];
    for (const f of files) {
      if (f.slice(0, 7) < fromMonth) continue;
      for (const l of fs.readFileSync(path.join(DIR, f), 'utf8').split('\n')) {
        if (!l) continue;
        try { const e = JSON.parse(l); if (!sinceIso || e.at >= sinceIso) out.push(e); } catch {}
      }
    }
    return out;
  }

  // 統計：days 是最近幾天（0 是全部），staff 為 true 時連編輯者自己看的也算
  // pages 是說明中心目前所有公開的頁面 [{ id, t }]，用來列出「沒人看」的頁面
  // lang：'zh' 只算中文、'en' 只算英文、空白全部；回傳的 langs 是兩種語言各被看幾次
  function stats({ days = 30, staff = false, pages = [], lang = '' } = {}) {
    let since = '';
    if (days > 0) {
      // 從台灣時間 days-1 天前的 0 點開始，今天也算一天
      const today = dayOf(new Date().toISOString());
      since = new Date(Date.parse(`${today}T00:00:00+08:00`) - (days - 1) * 864e5).toISOString();
    }
    const everyone = read(since).filter((e) => staff || !e.staff);
    const langOf = (e) => (e.lang === 'en' ? 'en' : 'zh');
    const all = lang ? everyone.filter((e) => langOf(e) === lang) : everyone;
    const langs = { zh: 0, en: 0 };
    const seenView = new Set();
    for (const e of everyone) if (e.kind === 'view' && !seenView.has(e.view)) { seenView.add(e.view); langs[langOf(e)]++; }
    const byView = new Map();
    for (const e of all) {
      if (e.kind !== 'view') continue;
      const old = byView.get(e.view);
      if (!old || e.sec > old.sec) byView.set(e.view, { ...e, depth: Math.max(e.depth, old ? old.depth : 0), at: old ? old.at : e.at, src: old ? old.src : e.src });
    }
    const vs = [...byView.values()];
    // 平均閱讀時間：一次超過 30 分鐘的當成 30 分鐘（可能開著沒在看）
    const capped = (s) => Math.min(s, 1800);
    const per = new Map();
    const daily = new Map();
    const src = new Map();
    const visitors = new Set();
    let secSum = 0, ends = 0;
    for (const v of vs) {
      if (!per.has(v.page)) per.set(v.page, { id: v.page, t: v.t, views: 0, vids: new Set(), sec: 0, ends: 0, last: '' });
      const p = per.get(v.page);
      p.views++; p.vids.add(v.vid || v.view); p.sec += capped(v.sec);
      if (v.depth >= 90) { p.ends++; ends++; }
      if (v.at > p.last) { p.last = v.at; if (v.t) p.t = v.t; }
      const d = dayOf(v.at);
      if (!daily.has(d)) daily.set(d, { d, views: 0, vids: new Set() });
      daily.get(d).views++; daily.get(d).vids.add(v.vid || v.view);
      src.set(v.src, (src.get(v.src) || 0) + 1);
      visitors.add(v.vid || v.view);
      secSum += capped(v.sec);
    }
    const miss = new Map();
    for (const e of all) {
      if (e.kind !== 'miss') continue;
      const k = e.q.toLowerCase();
      if (!miss.has(k)) miss.set(k, { q: e.q, n: 0, vids: new Set(), last: '' });
      const m = miss.get(k); m.n++; m.vids.add(e.vid); if (e.at > m.last) m.last = e.at; if (e.lang === 'en') m.en = true;
    }
    const titles = new Map(pages.map((p) => [p.id, p.t]));
    const pageRows = [...per.values()].map((p) => ({ id: p.id, t: titles.get(p.id) || p.t || p.id, views: p.views, visitors: p.vids.size, avgSec: Math.round(p.sec / p.views), endPct: Math.round((p.ends / p.views) * 100), live: titles.has(p.id) || p.id === 'home' }))
      .sort((a, b) => b.views - a.views);
    return {
      days, since, staff, lang, langs,
      first: all.length ? all.reduce((m, e) => (e.at < m ? e.at : m), all[0].at) : null,
      totals: { views: vs.length, visitors: visitors.size, avgSec: vs.length ? Math.round(secSum / vs.length) : 0, endPct: vs.length ? Math.round((ends / vs.length) * 100) : 0 },
      daily: [...daily.values()].map((d) => ({ d: d.d, views: d.views, visitors: d.vids.size })).sort((a, b) => a.d.localeCompare(b.d)),
      pages: pageRows,
      unread: pages.filter((p) => !per.has(p.id)).map((p) => ({ id: p.id, t: p.t })),
      sources: [...src.entries()].map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n),
      misses: [...miss.values()].map((m) => ({ q: m.q, n: m.n, visitors: m.vids.size, last: m.last, en: m.en })).sort((a, b) => b.n - a.n).slice(0, 100),
    };
  }

  return { add, stats, clean, prune };
};
