// 從 moonland.ai 本站抓「中文 → 英文」名稱對照，下載成 terms.json，用來更新 data/en/terms.json
// 英文版說明的功能名稱要和本站英文版一致（例如 點數 Points、登月幣 Coins、交談 Chat）
//
// 用法（本站有防機器人的保護，程式直接連會被擋，所以在瀏覽器裡執行）：
//   1. 用 Chrome 打開 https://moonland.ai
//   2. 按 F12 打開開發者工具，切到「Console（主控台）」
//   3. 把這個檔案的全部內容貼上、按 Enter，等它跑完會自動下載 terms.json
//   4. 用下載的檔案取代 data/en/terms.json，用 git diff 看哪些名稱變了，英文說明與 data/en/ui.js 跟著改
//
// 做法：本站是 Next.js，介面文字寫在網頁程式（/_next/static/chunks/*.js）裡的 defineCopy({"zh-TW":{…},en:{…}})，
//       逐一讀取網頁程式，把同一個代號的中文與英文配成一對。只取 30 個字以內的（名稱、按鈕、選單），長句不取
(async () => {
  const seen = new Set();
  const queue = [...document.querySelectorAll('script[src]')].map((s) => new URL(s.src).pathname).filter((u) => u.startsWith('/_next/'));
  const chunk = /["'(]\/?(?:_next\/)?(static\/chunks\/[\w\-.]+\.js)/g;
  const pairs = {};
  while (queue.length && seen.size < 1500) {
    const u = queue.shift();
    if (seen.has(u)) continue;
    seen.add(u);
    let t;
    try { t = await (await fetch(u)).text(); } catch (e) { continue; }
    for (const m of t.matchAll(chunk)) { const v = `/_next/${m[1]}`; if (!seen.has(v)) queue.push(v); }
    let i = -1;
    while ((i = t.indexOf('"zh-TW":{', i + 1)) >= 0) {
      const z = t.indexOf('},en:{', i);
      if (z < 0 || z - i > 20000) continue;
      const e = t.indexOf('}', z + 6);
      const zh = {};
      for (const m of t.slice(i + 9, z).matchAll(/(\w+):"([^"]*)"/g)) zh[m[1]] = m[2];
      for (const m of t.slice(z + 6, e).matchAll(/(\w+):"([^"]*)"/g)) {
        const c = zh[m[1]];
        if (c && /[一-鿿]/.test(c) && c.length <= 30 && !/[{}]/.test(c) && m[2].trim()) pairs[c] = m[2];
      }
    }
  }
  const terms = Object.fromEntries(Object.entries(pairs).sort(([a], [b]) => a.localeCompare(b, 'zh-Hant')));
  const json = `${JSON.stringify({ from: location.origin, at: new Date().toISOString().slice(0, 10), terms }, null, 1)}\n`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  a.download = 'terms.json';
  a.click();
  console.log(`讀了 ${seen.size} 個網頁程式，找到 ${Object.keys(terms).length} 組名稱，已下載 terms.json`);
})();
