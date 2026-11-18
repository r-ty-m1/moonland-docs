// 物件儲存（S3 相容，公司平台叫 Silo）。只用 Node 內建模組，不需要安裝 AWS SDK。
//
// 平台部署時，vibe.yaml 宣告了 `storage: s3` 就會提供這七個設定（不要列進 environment.required）：
//   S3_ENDPOINT          容器內呼叫 S3 用（例如 http://192.168.8.64:9010）
//   S3_PUBLIC_ENDPOINT   只用來簽給瀏覽器的網址（https://s3.moonshine-studio.net）
//   S3_BUCKET、S3_ACCESS_KEY_ID、S3_SECRET_ACCESS_KEY、S3_REGION、S3_FORCE_PATH_STYLE（"true"）
// 沒有設定時（本機直接跑、CI 冒煙測試）網站照常啟動，後台上傳改存在 DATA_DIR/media。
//
// 簽章規則（AWS Signature Version 4）：
// - 簽章包含 Host，所以給瀏覽器的網址一定要用 S3_PUBLIC_ENDPOINT 簽，不能先用內網簽再換網址。
// - 一律 path-style：<endpoint>/<bucket>/<key>。
const crypto = require('node:crypto');

const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');
const hmac = (key, data) => crypto.createHmac('sha256', key).update(data).digest();
// RFC 3986：encodeURIComponent 不編碼 !'()*，S3 要編碼
const enc = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
const encPath = (p) => p.split('/').map(enc).join('/');
const amzDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function settings(env = process.env) {
  const s = {
    endpoint: (env.S3_ENDPOINT || '').replace(/\/+$/, ''),
    publicEndpoint: (env.S3_PUBLIC_ENDPOINT || env.S3_ENDPOINT || '').replace(/\/+$/, ''),
    bucket: env.S3_BUCKET || '',
    accessKey: env.S3_ACCESS_KEY_ID || '',
    secretKey: env.S3_SECRET_ACCESS_KEY || '',
    region: env.S3_REGION || 'us-east-1',
  };
  return s.endpoint && s.bucket && s.accessKey && s.secretKey ? s : null;
}

function signingKey(secret, day, region) {
  return hmac(hmac(hmac(hmac('AWS4' + secret, day), region), 's3'), 'aws4_request');
}

// 產生簽好的網址（query string 簽章）。url 是完整網址，headers 只放要一起簽的（host 自動加）
function presignUrl({ method, url, accessKey, secretKey, region, expires, date = new Date() }) {
  const u = new URL(url);
  const stamp = amzDate(date);
  const day = stamp.slice(0, 8);
  const scope = `${day}/${region}/s3/aws4_request`;
  const q = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${accessKey}/${scope}`,
    'X-Amz-Date': stamp,
    'X-Amz-Expires': String(expires),
    'X-Amz-SignedHeaders': 'host',
  };
  for (const [k, v] of u.searchParams) q[k] = v;
  const query = Object.keys(q).sort().map((k) => `${enc(k)}=${enc(q[k])}`).join('&');
  const canonical = [method, encPath(decodeURIComponent(u.pathname)), query, `host:${u.host}\n`, 'host', 'UNSIGNED-PAYLOAD'].join('\n');
  const toSign = ['AWS4-HMAC-SHA256', stamp, scope, sha256(canonical)].join('\n');
  const sig = crypto.createHmac('sha256', signingKey(secretKey, day, region)).update(toSign).digest('hex');
  return `${u.origin}${encPath(decodeURIComponent(u.pathname))}?${query}&X-Amz-Signature=${sig}`;
}

// 伺服器自己呼叫 S3：簽在 Authorization 標頭。回傳要送出的標頭（host 由 fetch 自己帶）
function authHeaders({ method, url, headers = {}, payloadHash, date = new Date(), accessKey, secretKey, region }) {
  const u = new URL(url);
  const stamp = amzDate(date);
  const day = stamp.slice(0, 8);
  const scope = `${day}/${region}/s3/aws4_request`;
  const h = { ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), String(v)])), host: u.host, 'x-amz-content-sha256': payloadHash, 'x-amz-date': stamp };
  const names = Object.keys(h).sort();
  const canonical = [method, u.pathname, '', names.map((n) => `${n}:${h[n].trim()}\n`).join(''), names.join(';'), payloadHash].join('\n');
  const toSign = ['AWS4-HMAC-SHA256', stamp, scope, sha256(canonical)].join('\n');
  const sig = crypto.createHmac('sha256', signingKey(secretKey, day, region)).update(toSign).digest('hex');
  const { host, ...send } = h;
  send.authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${names.join(';')}, Signature=${sig}`;
  return send;
}

async function request(s, method, key, { body, headers = {}, timeout = 60000 } = {}) {
  const url = `${s.endpoint}/${encPath(s.bucket)}/${encPath(key)}`;
  const send = authHeaders({ method, url, headers, payloadHash: sha256(body || ''), accessKey: s.accessKey, secretKey: s.secretKey, region: s.region });
  return fetch(url, { method, headers: send, body, signal: AbortSignal.timeout(timeout) });
}

// 容量用完時 Silo 回 400 XMinioAdminBucketQuotaExceeded：不是格式錯，也不要重試
async function failure(res, what) {
  const text = await res.text().catch(() => '');
  const code = (/<Code>([^<]+)<\/Code>/.exec(text) || [])[1] || `HTTP ${res.status}`;
  const err = new Error(code === 'XMinioAdminBucketQuotaExceeded' ? '儲存空間已滿，請刪掉不用的檔案，或請管理員調高上限' : `${what}失敗（${code}）`);
  err.code = code;
  return err;
}

function create(env = process.env) {
  const s = settings(env);
  if (!s) return null;
  return {
    async put(key, buf, type) {
      const res = await request(s, 'PUT', key, { body: buf, headers: { 'content-type': type, 'content-length': buf.length } });
      if (!res.ok) throw await failure(res, '存進物件儲存');
    },
    async get(key) {
      const res = await request(s, 'GET', key);
      if (!res.ok) throw await failure(res, '讀取物件儲存');
      return Buffer.from(await res.arrayBuffer());
    },
    // 回傳 { size, type }；不存在回 null
    async head(key) {
      const res = await request(s, 'HEAD', key, { timeout: 15000 });
      if (res.status === 404) return null;
      if (!res.ok) throw await failure(res, '查詢物件儲存');
      return { size: Number(res.headers.get('content-length')), type: res.headers.get('content-type') || '' };
    },
    async del(key) {
      const res = await request(s, 'DELETE', key, { timeout: 15000 });
      if (!res.ok && res.status !== 404) throw await failure(res, '刪除物件儲存的檔案');
    },
    // 給瀏覽器的網址：用對外的 endpoint 簽。
    // 讀取用的網址把簽章時間取整到小時、有效 2 小時：同一小時內網址不變，瀏覽器才快取得到圖片
    presign(method, key, { expires = 600, stable = false } = {}) {
      const now = Date.now();
      const date = stable ? new Date(now - (now % 3600e3)) : new Date(now);
      return presignUrl({ method, url: `${s.publicEndpoint}/${encPath(s.bucket)}/${encPath(key)}`, accessKey: s.accessKey, secretKey: s.secretKey, region: s.region, expires: stable ? 7200 : expires, date });
    },
  };
}

module.exports = { create, presignUrl, authHeaders };
