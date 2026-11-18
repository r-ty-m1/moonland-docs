// 收到文字回饋時，用公司 Zulip（chat.moonshine.tw）私訊網站負責人。
//
// 設定（都放在部署主機的 runtime secret，值寫在開發者本機的 .env，由 mason 的 deploy-site 送上平台）：
//   ZULIP_SITE             https://chat.moonshine.tw
//   ZULIP_BOT_EMAIL        負責人自己在 Zulip 建的「傳入 webhook」bot 的 email
//   ZULIP_API_KEY          那個 bot 的 API key
//   FEEDBACK_NOTIFY_EMAIL  收通知的人的公司 email（收件人由伺服器決定，不接受瀏覽器傳來的值）
//   ZULIP_DELIVERY         只在本機用：dry-run 不真的發（只寫進 log）；沒設時 NODE_ENV=development 也不發
//
// 沒有設定時網站照常運作，通知直接略過；通知失敗只記 log，不影響回饋的儲存。
// 訊息只寫事件、頁面和後台連結，不放訪客寫的內容（個資與 @提及 都不會跑進 Zulip）。

const SITE_URL = (process.env.PUBLIC_URL || 'https://moonland-docs-vibe.moonshine-studio.net').replace(/\/+$/, '');
const TYPE_NAMES = { stuck: '照著做還是卡住', unclear: '看完還是不懂', suggest: '建議改進', other: '其他' };

// 全站每小時最多發 20 則，避免有人洗版時把負責人的 Zulip 塞爆
const HOURLY_LIMIT = 20;
let windowStart = 0;
let sentInWindow = 0;

function settings() {
  const env = process.env;
  return { site: (env.ZULIP_SITE || '').replace(/\/+$/, ''), bot: env.ZULIP_BOT_EMAIL || '', key: env.ZULIP_API_KEY || '', to: env.FEEDBACK_NOTIFY_EMAIL || '' };
}

function dryRun() {
  const mode = process.env.ZULIP_DELIVERY;
  if (mode && mode !== 'send' && mode !== 'dry-run') throw new Error('ZULIP_DELIVERY 只能是 send 或 dry-run');
  return (mode || (process.env.NODE_ENV === 'development' ? 'dry-run' : 'send')) === 'dry-run';
}
dryRun(); // 設錯值時啟動就停，而不是等到第一筆回饋才發現

// Zulip 的 Markdown 會把 ** 、@ 之類的符號變成格式或提及；頁面標題來自網站自己的文章，仍保險處理一次
const plain = (s) => String(s || '').replace(/[*_`@#[\]<>|~]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);

function message(entry) {
  const type = TYPE_NAMES[entry.type] || '意見回饋';
  const page = entry.page ? `「${plain(entry.pageTitle) || plain(entry.page)}」` : '（沒有指定頁面）';
  return `說明中心收到一則新的意見回饋\n- 類型：${type}\n- 頁面：${page}\n- 到回饋後台查看：${SITE_URL}/admin.html`;
}

// 回傳 'sent'、'dry-run'、'skipped' 或 'failed'
async function notifyFeedback(entry) {
  const s = settings();
  const content = message(entry);
  if (dryRun()) {
    console.info('notify dry-run, not sent', { recipient: s.to || '(FEEDBACK_NOTIFY_EMAIL 未設定)', content });
    return 'dry-run';
  }
  if (!s.site || !s.bot || !s.key || !s.to) {
    console.warn('notify skipped: ZULIP_SITE、ZULIP_BOT_EMAIL、ZULIP_API_KEY、FEEDBACK_NOTIFY_EMAIL 沒有設齊');
    return 'skipped';
  }
  const now = Date.now();
  if (now - windowStart > 3600e3) { windowStart = now; sentInWindow = 0; }
  if (sentInWindow >= HOURLY_LIMIT) {
    console.warn('notify skipped: 這一小時已發滿', HOURLY_LIMIT, '則');
    return 'skipped';
  }
  sentInWindow++;
  try {
    const res = await fetch(`${s.site}/api/v1/messages`, {
      method: 'POST',
      headers: {
        authorization: `Basic ${Buffer.from(`${s.bot}:${s.key}`).toString('base64')}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      // 傳入 webhook bot 不能查使用者，直接用 email 當收件人
      body: new URLSearchParams({ type: 'private', to: JSON.stringify([s.to]), content }),
      signal: AbortSignal.timeout(5000),
    });
    const body = await res.json().catch(() => ({}));
    if (body.result !== 'success') throw new Error(`HTTP ${res.status} ${body.msg || ''}`.trim());
    return 'sent';
  } catch (error) {
    // 不把金鑰寫進 log：只記狀態與 Zulip 回的訊息
    console.error('notify failed', { recipient: s.to, error: error.message });
    return 'failed';
  }
}

module.exports = { notifyFeedback, message };
