// =========================================================
// 說明中心與編輯後台共用：圖示、語言 T()、媒體網址、文章標記語法 → HTML
// 說明中心（script.js）和編輯後台（edit.js）都在這個檔案之後載入
// =========================================================

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
  ext: 'M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6 M11 13l9 -9 M15 4h5v5',
  x: 'M18 6l-12 12 M6 6l12 12',
  copy: 'M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1',
  check: 'M5 12l5 5l10 -10',
  clock: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M12 7v5l3 3',
  message: 'M8 9h8 M8 13h6 M9 18h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-3l-3 3l-3 -3z',
  up: 'M12 5l0 14 M18 11l-6 -6 M6 11l6 -6',
  globe: 'M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0 M3.6 9h16.8 M3.6 15h16.8 M11.5 3a17 17 0 0 0 0 18 M12.5 3a17 17 0 0 1 0 18',
  arrows: 'M8 7l-5 5l5 5 M16 7l5 5l-5 5',
};
const ic = (name, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------------------------------------------------
// 0. 介面文字：T('約 {n} 分鐘', { n: 5 }) 會把大括號換成對應的值
//    英文版已在 2026-10-30 移除（舊版在 git tag english-version）。介面文字仍包在 T() 裡，日後要加回其他語言只要改這裡
// ---------------------------------------------------------
function T(s, vars) {
  let r = s;
  if (vars) r = r.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return r;
}

const MEDIA = window.MEDIA || {};

// ---------------------------------------------------------
// 2. 媒體網址：檔案放在 assets/media/（對照表見 data/media.js）
//    編輯後台上傳、還沒存成檔案的圖片是 data: 網址，直接使用
// ---------------------------------------------------------
function mediaUrl(n) {
  const e = MEDIA[n];
  return e ? (/^(data|blob):/.test(e[0]) ? e[0] : `assets/media/${e[0]}`) : '';
}
const mediaRatio = (n) => (MEDIA[n] && MEDIA[n][1]) || 0;

// ---------------------------------------------------------
// 3. 文章標記語法 → HTML（語法說明見 README.md）
// ---------------------------------------------------------
function inline(s) {
  let h = esc(s);
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\[((?:[^\[\]]|\[[^\]]*\])+)\]\(([^)\s]+)\)/g, (m, text, href) => {
    if (href.startsWith('#h-')) return `<a href="#" data-to="${href.slice(1)}">${text}</a>`;
    if (/^https?:/.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
    return `<a href="${href}">${text}</a>`;
  });
  return h;
}

const isStarter = (t) => /^(:::|#{2,4}\s|>|\||\[(i|v|a|embed)\s|- |\d+\.\s|---$|@ |\?\? |\|\|\|$)/.test(t);

function splitAt(lines, test) {
  const parts = [];
  let cur = null, depth = 0;
  for (const line of lines) {
    const t = line.trim();
    if (/^:::\w/.test(t)) depth++;
    else if (t === ':::') depth--;
    if (depth === 0 && test(t)) { cur = { head: t, lines: [] }; parts.push(cur); continue; }
    if (!cur) { cur = { head: null, lines: [] }; parts.push(cur); }
    cur.lines.push(line);
  }
  return parts;
}

let headingCount = 0;
function media(t) {
  let m = t.match(/^\[(i|v|a)\s+(\d+)(?:\s+(.+))?\]$/);
  if (m) {
    const [, k, n, cap] = m;
    const url = mediaUrl(n);
    const ar = mediaRatio(n);
    const box = ar ? ` style="aspect-ratio:${ar}"` : '';
    const capHtml = cap ? `<figcaption>${inline(cap)}</figcaption>` : '';
    if (!url) return `<div class="media-missing">${T('找不到媒體 #{n}', { n })}</div>`;
    if (k === 'i') return `<figure class="fig"><img src="${url}" alt="${esc(cap || '')}" loading="lazy" decoding="async"${box} data-zoom>${capHtml}</figure>`;
    if (k === 'v') return `<figure class="fig"><video src="${url}" controls preload="metadata" playsinline${box}></video>${capHtml}</figure>`;
    return `<figure class="fig audio"><audio src="${url}" controls preload="none"></audio>${capHtml}</figure>`;
  }
  m = t.match(/^\[embed\s+(\S+)(?:\s+(.+))?\]$/);
  if (m) return `<figure class="fig embed"><iframe src="${esc(m[1])}" loading="lazy" title="${esc(m[2] || T('前後比較'))}"></iframe>${m[2] ? `<figcaption>${inline(m[2])}</figcaption>` : ''}</figure>`;
  return '';
}

// 前後比較：:::compare 裡前兩行是 [i 編號 標籤]（左＝修改前、右＝修改後），?? 開頭是可展開的提示詞
// 框的比例預設跟左圖一樣，也可以寫 :::compare 3:4
function compare(arg, inner) {
  const parts = splitAt(inner, (t) => t.startsWith('?? '));
  const imgs = [];
  for (const p of parts) if (!p.head) for (const l of p.lines) {
    const m = l.trim().match(/^\[i\s+(\d+)(?:\s+(.+))?\]$/);
    if (m) imgs.push({ n: m[1], url: mediaUrl(m[1]), label: m[2] });
  }
  if (imgs.length < 2) return `<div class="media-missing">${T('前後比較需要兩張圖片')}</div>`;
  const [a, b] = imgs;
  const miss = [a, b].find((x) => !x.url);
  if (miss) return `<div class="media-missing">${T('找不到媒體 #{n}', { n: miss.n })}</div>`;
  const r = String(arg).match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  const ar = r ? r[1] / r[2] : mediaRatio(a.n) || 0.75;
  const la = a.label || 'Before', lb = b.label || 'After';
  const prompts = parts.filter((p) => p.head).map((p) => {
    const text = p.lines.map((l) => l.trim()).join('\n').trim();
    return `<details class="cmp-p"><summary>${inline(p.head.slice(3))}</summary><div class="prompt"><pre>${esc(text)}</pre><button type="button" class="copy" aria-label="${T('複製提示詞')}">${ic('copy')}<span>${T('複製')}</span></button></div></details>`;
  }).join('');
  return `<figure class="cmp" style="--ar:${+ar.toFixed(4)}"><div class="cmp-view">`
    + `<img src="${b.url}" alt="${esc(lb)}" loading="lazy" decoding="async">`
    + `<img class="cmp-a" src="${a.url}" alt="${esc(la)}" loading="lazy" decoding="async">`
    + `<span class="cmp-tag l">${esc(la)}</span><span class="cmp-tag r">${esc(lb)}</span>`
    + `<span class="cmp-line"><span class="cmp-knob" role="slider" tabindex="0" aria-label="${T('拖曳分隔線比較前後')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">${ic('arrows')}</span></span>`
    + `</div>${prompts}</figure>`;
}

function container(type, arg, inner) {
  if (type === 'compare') return compare(arg, inner);
  if (type === 'tip' || type === 'warn' || type === 'note') {
    return `<div class="callout ${type}">${arg ? `<b>${inline(arg)}</b>` : ''}${blocks(inner)}</div>`;
  }
  if (type === 'details') return `<details class="more"><summary>${inline(arg)}</summary><div>${blocks(inner)}</div></details>`;
  if (type === 'steps') {
    const items = splitAt(inner, (t) => t.startsWith('@ ')).filter((p) => p.head);
    return `<ol class="steps">${items.map((p) => `<li><div class="step-t">${inline(p.head.slice(2))}</div>${blocks(p.lines)}</li>`).join('')}</ol>`;
  }
  if (type === 'row') {
    const cells = [{ lines: [] }];
    let depth = 0;
    for (const line of inner) {
      const t = line.trim();
      if (/^:::\w/.test(t)) depth++; else if (t === ':::') depth--;
      if (depth === 0 && t === '|||') { cells.push({ lines: [] }); continue; }
      cells[cells.length - 1].lines.push(line);
    }
    // 每一欄都只有一張圖或影片時，手機上維持兩欄並排
    const mediaOnly = cells.every((c) => { const ls = c.lines.map((l) => l.trim()).filter(Boolean); return ls.length === 1 && /^\[(i|v)\s+\d+/.test(ls[0]); });
    return `<div class="row${mediaOnly ? ' media' : ''}" style="--n:${cells.length}">${cells.map((c) => `<div class="cell">${blocks(c.lines)}</div>`).join('')}</div>`;
  }
  if (type === 'faq') {
    const qs = splitAt(inner, (t) => t.startsWith('?? ')).filter((p) => p.head);
    return qs.map((p) => `<details class="qa"><summary>${inline(p.head.slice(3))}</summary><div>${blocks(p.lines)}</div></details>`).join('');
  }
  return blocks(inner);
}

function blocks(lines) {
  let out = '';
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (!t) { i++; continue; }

    if (/^:::\w/.test(t)) {
      const [, type, arg] = t.match(/^:::(\w+)\s*(.*)$/);
      let depth = 1, j = i + 1;
      for (; j < lines.length; j++) {
        const tt = lines[j].trim();
        if (/^:::\w/.test(tt)) depth++;
        else if (tt === ':::' && --depth === 0) break;
      }
      out += container(type, arg, lines.slice(i + 1, j));
      i = j + 1;
      continue;
    }
    let m;
    if ((m = t.match(/^(#{2,4})\s+(.+?)(?:\s+\{#([\w-]+)\})?$/))) {
      const lvl = m[1].length;
      const id = m[3] || `h${++headingCount}`;
      out += `<h${lvl} id="${id}">${inline(m[2])}</h${lvl}>`;
      i++; continue;
    }
    if (t === '---') { out += '<hr>'; i++; continue; }
    if (t.startsWith('>')) {
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) { buf.push(lines[i].trim().replace(/^>\s?/, '')); i++; }
      out += `<div class="prompt"><pre>${esc(buf.join('\n'))}</pre><button type="button" class="copy" aria-label="${T('複製提示詞')}">${ic('copy')}<span>${T('複製')}</span></button></div>`;
      continue;
    }
    if (t.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const r = lines[i].trim();
        if (!/^\|[\s:|-]+\|$/.test(r)) rows.push(r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
        i++;
      }
      const [head, ...body] = rows;
      out += `<div class="tbl"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c, i) => `<td data-label="${esc(plainText(head[i] || ''))}">${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      continue;
    }
    if (/^\[(i|v|a|embed)\s/.test(t)) { out += media(t); i++; continue; }
    if (t.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) { items.push(lines[i].trim().slice(2)); i++; }
      out += `<ul>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`;
      continue;
    }
    if ((m = t.match(/^(\d+)\.\s/))) {
      const start = +m[1];
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s/, '')); i++; }
      out += `<ol${start > 1 ? ` start="${start}"` : ''}>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ol>`;
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !isStarter(lines[i].trim())) { buf.push(inline(lines[i].trim())); i++; }
    if (buf.length) out += `<p>${buf.join('<br>')}</p>`;
    else i++;
  }
  return out;
}
const renderMarkup = (src) => { headingCount = 0; return blocks(String(src).replace(/\r/g, '').split('\n')); };
const plainText = (src) => String(src)
  .replace(/\[(i|v|a|embed)\s[^\]]*\]/g, ' ')
  .replace(/\[((?:[^\[\]]|\[[^\]]*\])+)\]\([^)]+\)/g, '$1')
  .replace(/[*#>|:@?]/g, ' ');

// ---------------------------------------------------------
// 4. 前後比較的拖曳：滑鼠點哪裡分隔線就到哪裡；手指左右滑動才會移動（上下滑照常捲頁面）
//    鍵盤：focus 圓形把手後用方向鍵、Home、End
// ---------------------------------------------------------
function setCompare(view, pct) {
  pct = Math.max(0, Math.min(100, pct));
  view.style.setProperty('--x', `${pct}%`);
  view.querySelector('.cmp-knob').setAttribute('aria-valuenow', Math.round(pct));
}
const compareAt = (view, e) => { const r = view.getBoundingClientRect(); if (r.width) setCompare(view, ((e.clientX - r.left) / r.width) * 100); };
document.addEventListener('pointerdown', (e) => {
  const view = e.target.closest && e.target.closest('.cmp-view');
  if (!view || e.button > 0) return;
  if (e.pointerType === 'mouse') { e.preventDefault(); compareAt(view, e); }
  view.setPointerCapture(e.pointerId);
  view.classList.add('drag');
  const move = (ev) => compareAt(view, ev);
  const end = () => {
    view.classList.remove('drag');
    view.removeEventListener('pointermove', move);
    view.removeEventListener('pointerup', end);
    view.removeEventListener('pointercancel', end);
  };
  view.addEventListener('pointermove', move);
  view.addEventListener('pointerup', end);
  view.addEventListener('pointercancel', end);
});
document.addEventListener('keydown', (e) => {
  const knob = e.target.closest && e.target.closest('.cmp-knob');
  const step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, Home: -100, End: 100 }[e.key];
  if (!knob || step === undefined) return;
  e.preventDefault();
  setCompare(knob.closest('.cmp-view'), +knob.getAttribute('aria-valuenow') + step);
});
