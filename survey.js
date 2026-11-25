// =========================================================
// 訪客問卷與「吉吉」（小黑貓嚮導）共用的題目、選項與推薦規則
// 瀏覽器（script.js 的吉吉、edit.js 的問卷統計）與伺服器（server/server.js 檢查送來的答案）共用這一支
//
// - 題目的代號（role、ai…）和選項的代號（edu-rel…）存進伺服器，改文字可以，改代號會讓舊的統計對不起來
// - 問卷是匿名的：不收姓名、email、帳號；只存答案、時間和訪客隨機代號（同一台電腦重填時用來去掉重複）
// - 吉吉的推薦：問卷答完依「為什麼來」與身分推薦文章；之後點吉吉可以從「你想做什麼？」選單找文章
// =========================================================
(function (root) {
  // 題目：type single 單選、multi 複選；other 是選了要再填一行字的選項（例如「其他產業」填哪個產業）
  const QUESTIONS = [
    { id: 'role', type: 'single', q: '你是哪一種身分？', hint: '「相關」指設計、影視、動畫、遊戲、多媒體、數位內容等領域。',
      options: [
        ['edu-rel', '相關科系的教職員'], ['stu-rel', '相關科系的學生'],
        ['edu-other', '其他科系的教職員'], ['stu-other', '其他科系的學生'],
        ['work-rel', '相關產業的上班族、接案者'], ['work-other', '其他產業的上班族、接案者'],
        ['other', '其他'],
      ],
      other: { 'work-other': '哪個產業？', other: '請簡單說明' } },
    { id: 'ai', type: 'single', q: '你用過生成式 AI 嗎？',
      options: [['none', '沒用過'], ['some', '用過幾次'], ['often', '經常使用']] },
    { id: 'tools', type: 'multi', q: '用過哪些 AI 工具？', hint: '可以複選。', when: { ai: ['some', 'often'] },
      options: [['chatgpt', 'ChatGPT'], ['gemini', 'Gemini'], ['midjourney', 'Midjourney'], ['sd', 'Stable Diffusion／ComfyUI'], ['video', 'Runway、Kling 等影片工具'], ['other', '其他']],
      other: { other: '哪些工具？' } },
    { id: 'ml', type: 'single', q: '你用過 moonland.ai 嗎？',
      options: [['none', '還沒用過'], ['some', '用過幾次'], ['often', '經常使用']] },
    { id: 'source', type: 'multi', q: '你從哪裡知道 moonland.ai？', hint: '可以複選。',
      options: [['school', '學校課程或老師'], ['work', '公司或同事'], ['social', '社群媒體（FB、IG、Threads）'], ['youtube', 'YouTube'], ['line', 'LINE 社群'], ['search', '搜尋引擎'], ['event', '展覽、講座或活動'], ['friend', '朋友推薦'], ['other', '其他']],
      other: { other: '從哪裡？' } },
    { id: 'reason', type: 'single', q: '今天為什麼來看說明手冊？',
      options: [['learn', '還沒用過，想先了解'], ['first', '第一次使用，想學基本操作'], ['problem', '用過了，但遇到問題'], ['advanced', '想學進階功能'], ['team', '要管理團隊或帶學生'], ['other', '其他']],
      other: { other: '想找什麼？' } },
  ];

  const shown = (q, a) => !q.when || Object.entries(q.when).every(([k, vs]) => vs.includes(a[k]));

  // 伺服器用：只留下認得的題目與選項；什麼都沒答回傳 null
  function clean(b) {
    if (!b || typeof b !== 'object') return null;
    const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
    const out = {};
    let n = 0;
    for (const q of QUESTIONS) {
      const codes = q.options.map((o) => o[0]);
      const v = b[q.id];
      if (q.type === 'single' && codes.includes(v)) { out[q.id] = v; n++; }
      if (q.type === 'multi' && Array.isArray(v)) {
        const list = [...new Set(v.filter((x) => codes.includes(x)))];
        if (list.length) { out[q.id] = list; n++; }
      }
      for (const code of Object.keys(q.other || {})) {
        const picked = q.type === 'single' ? out[q.id] === code : (out[q.id] || []).includes(code);
        const text = str(b[`${q.id}_${code}`], 60);
        if (picked && text) out[`${q.id}_${code}`] = text;
      }
    }
    return n ? out : null;
  }

  // 依問卷答案推薦文章：[[文章代號, 為什麼推薦]]，最多 4 篇
  const BY_REASON = {
    learn: [['quick-start', '五分鐘看完整個流程'], ['credits', '先搞懂點數怎麼算'], ['gallery', '看看別人做了什麼'], ['trial-login', '有體驗帳號的話從這裡登入']],
    first: [['quick-start', '跟著做出第一張圖和影片'], ['chat-intro', '最容易上手的「交談」'], ['chat-prompts', '提示詞怎麼寫比較準'], ['credits', '點數怎麼算']],
    problem: [['faq', '常見問題可能已經有答案'], ['contact', '找不到答案就直接問客服'], ['feedback', '說明看不懂可以告訴我們']],
    advanced: [['lab', '主題：LoRA、ControlNet 精修'], ['chat-edit', '編輯與合成'], ['v-path', '控制影片裡的運動軌跡'], ['m-choose', '不同模型怎麼挑']],
    team: [['admin', '管理員六堂課'], ['team-login', '成員怎麼註冊與登入'], ['admin-4', '點數怎麼分給成員']],
  };
  function recommend(a) {
    const list = [...(BY_REASON[a.reason] || [])];
    if (String(a.role).startsWith('edu') && a.reason !== 'team') list.push(['admin', '老師可以用團隊後台帶學生']);
    if (String(a.role).startsWith('stu')) list.push(['chat-recipes', '交談應用大全，作業靈感']);
    if (a.ml === 'none' && a.reason !== 'learn' && a.reason !== 'first') list.unshift(['quick-start', '還沒用過的話先看這篇']);
    if (!list.length) list.push(['quick-start', '五分鐘看完整個流程'], ['chat-intro', '最容易上手的「交談」'], ['faq', '常見問題']);
    const seen = new Set();
    return list.filter(([id]) => !seen.has(id) && seen.add(id)).slice(0, 4);
  }

  // 吉吉的「你想做什麼？」選單：[顯示文字, [[文章代號, 說明]]]
  const MENU = [
    ['第一次用，不知道從哪開始', [['quick-start', '五分鐘快速入門'], ['chat-intro', '用「交談」生成第一張圖'], ['credits', '點數與登月幣怎麼算']]],
    ['生成圖片', [['img-basics', '圖片生成基礎'], ['chat-prompts', '提示詞寫法'], ['img-prompt', '提示詞助手'], ['m-image', '圖片模型怎麼挑']]],
    ['修改、放大或擴展圖片', [['chat-edit', '用交談編輯與合成'], ['img-upscale', '圖片放大'], ['img-outpaint', '圖片拓展'], ['outfit', '人物角色換衣']]],
    ['生成影片', [['v-basics', '影片生成基礎'], ['v-i2v', '圖片變成影片'], ['v-path', '控制運動軌跡'], ['v-frames', '頭尾幀連接']]],
    ['做音樂或 3D 模型', [['music', '音樂生成'], ['model-3d', '3D 模型生成'], ['m-music', '音樂模型'], ['m-3d', '3D 模型']]],
    ['點數、登月幣與帳號', [['credits', '點數與登月幣'], ['credit-tools', '加值登月幣'], ['trial-login', '體驗帳號登入']]],
    ['管理團隊或帶學生', [['admin', '管理員課程'], ['team-login', '團隊註冊與登入'], ['admin-4', '分配點數']]],
    ['遇到問題', [['faq', '常見問題'], ['contact', '聯絡客服'], ['feedback', '意見回饋']]],
  ];

  const api = { QUESTIONS, shown, clean, recommend, MENU };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Survey = api;
})(this);
