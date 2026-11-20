// 編輯後台的「布告欄」：主管理員發公告（可以置頂），所有編輯者發文討論、回覆
// - 存在 DATA_DIR/board.json，和文章內容（content.json）分開：發文、回覆不會和別人正在存的文章互相衝突
// - 誰能做什麼由伺服器決定（登入的人與角色），不信任瀏覽器送來的名字
//   公告：只有主管理員能發；置頂：只有主管理員；修改、刪除、標成已處理：發文的人或主管理員
// - 格式：{ posts: [{ id, kind: 'notice'|'post', t, body, tag, page, by, byNo, at, editedAt?, pinned?, done?, replies: [{ id, body, by, byNo, at }] }] }
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const TAGS = ['missing', 'adjust', 'question', 'other'];
const MAX_POSTS = 500, MAX_REPLIES = 200;
const str = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

module.exports = function board(DATA_DIR) {
  const FILE = path.join(DATA_DIR, 'board.json');
  let B;
  try { B = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { B = null; }
  if (!B || !Array.isArray(B.posts)) B = { posts: [] };
  function save() {
    const tmp = `${FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(B));
    fs.renameSync(tmp, FILE);
  }
  const find = (id) => B.posts.find((p) => p.id === id);
  const mine = (x, user, role) => role === 'owner' || x.byNo === user.no;
  const ok = () => [200, { posts: B.posts }];

  function create(user, role, b) {
    const kind = b && b.kind === 'notice' ? 'notice' : 'post';
    if (kind === 'notice' && role !== 'owner') return [403, { error: '只有主管理員可以發公告' }];
    const t = str(b.t, 80), body = str(b.body, 4000);
    if (!t) return [400, { error: '請寫標題' }];
    const p = { id: crypto.randomUUID(), kind, t, body, tag: TAGS.includes(b.tag) ? b.tag : 'other', page: /^[\w-]{1,60}$/.test(b.page || '') ? b.page : '', by: user.name, byNo: user.no, at: new Date().toISOString(), replies: [] };
    if (kind === 'notice') p.pinned = b.pinned !== false;
    B.posts.unshift(p);
    B.posts.length = Math.min(B.posts.length, MAX_POSTS);
    save();
    return ok();
  }
  function reply(user, b) {
    const p = find(b && b.id);
    if (!p) return [404, { error: '找不到這則，可能已經被刪除' }];
    const body = str(b.body, 2000);
    if (!body) return [400, { error: '請寫回覆內容' }];
    if (p.replies.length >= MAX_REPLIES) return [400, { error: '這則的回覆太多了，請另外發一則' }];
    p.replies.push({ id: crypto.randomUUID(), body, by: user.name, byNo: user.no, at: new Date().toISOString() });
    save();
    return ok();
  }
  function update(user, role, b) {
    const p = find(b && b.id);
    if (!p) return [404, { error: '找不到這則，可能已經被刪除' }];
    if ('pinned' in b) {
      if (role !== 'owner') return [403, { error: '只有主管理員可以置頂' }];
      p.pinned = !!b.pinned;
    }
    if ('done' in b) {
      if (!mine(p, user, role)) return [403, { error: '只有發文的人或主管理員可以標成已處理' }];
      p.done = !!b.done;
    }
    if ('t' in b || 'body' in b || 'tag' in b || 'page' in b) {
      if (!mine(p, user, role)) return [403, { error: '只有發文的人或主管理員可以修改' }];
      if ('t' in b) { const t = str(b.t, 80); if (!t) return [400, { error: '請寫標題' }]; p.t = t; }
      if ('body' in b) p.body = str(b.body, 4000);
      if ('tag' in b && TAGS.includes(b.tag)) p.tag = b.tag;
      if ('page' in b) p.page = /^[\w-]{1,60}$/.test(b.page || '') ? b.page : '';
      p.editedAt = new Date().toISOString();
    }
    save();
    return ok();
  }
  function remove(user, role, b) {
    const p = find(b && b.id);
    if (!p) return [404, { error: '找不到這則，可能已經被刪除' }];
    if (b.reply) {
      const r = p.replies.find((x) => x.id === b.reply);
      if (!r) return [404, { error: '找不到這則回覆' }];
      if (!mine(r, user, role)) return [403, { error: '只有回覆的人或主管理員可以刪除' }];
      p.replies = p.replies.filter((x) => x !== r);
    } else {
      if (!mine(p, user, role)) return [403, { error: '只有發文的人或主管理員可以刪除' }];
      B.posts = B.posts.filter((x) => x !== p);
    }
    save();
    return ok();
  }
  // 備份與還原時整份帶著走
  const dump = () => B;
  function load(b) { if (b && Array.isArray(b.posts)) { B = { posts: b.posts.slice(0, MAX_POSTS) }; save(); } }

  return { list: ok, create, reply, update, remove, dump, load };
};
