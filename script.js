// moonland.ai 說明中心：目錄、頁面內容、搜尋
const N='https://phrygian-friction-260.notion.site';
const NAV=[
 {g:'快速入門',items:[['quick-start','5 分鐘快速入門','新手'],['credits','點數（登月幣）怎麼算']]},
 {g:'功能教學',cats:[
  {id:'image',c:'圖片生成',d:'用文字或參考圖生成、修改圖片',items:[['basics','圖片生成基礎介紹','新手'],['img-prompt','提示詞助手'],['img-upscale','圖片放大（SeedVR2）'],['img-outpaint','圖片拓展'],['img-rotate','圖片視角旋轉調整']]},
  {id:'video',c:'影片生成',d:'用文字、圖片或影片生成 AI 影片，或做人物動態、聲音生成與配音修改。',items:[['v-basics','影片生成基礎介紹'],['v-i2v','圖片生成影片（i2v）'],['v-v2v','影片生成影片（v2v）'],['v-path','物件運動軌跡控制'],['v-frames','頭尾幀連接'],['v-mimic','動作模仿（Wan Animate 2 / SCAIL 2）'],['v-merge','合併功能']]},
  {id:'chat',c:'交談',d:'用中文或英文對話的方式生成、編輯圖片，初學者最容易上手。',items:[['c-settings','交談設定介紹'],['c-basics','交談介紹'],['c-edit','編輯功能介紹'],['c-recipes','「交談」圖片應用大全'],['c-pvc','PVC 模型風格生成'],['c-logo','LOGO 創作'],['c-outfit','人物角色換衣']]},
  {id:'lab',c:'實驗室',d:'用更精細的參數與控制選項精修圖片，適合熟悉 Stable Diffusion 的使用者。',items:[['l-ui','操作介面介紹'],['l-lora','LoRA 應用介紹'],['l-cn','進階控制選項 ControlNet'],['l-prompt','提示詞助手（實驗室）'],['l-ip','風格一致性（IP-Adapter）'],['l-face','角色換臉應用']]},
  {id:'credit-tools',c:'登月幣工具',d:'使用登月幣呼叫 Seedance、Kling、Google、OpenAI 等外部模型。目前僅開放團隊帳號。',items:[]},
  {id:'other-tools',c:'其他工具',d:'3D 模型與音樂生成等其他 AI 工具。',items:[['o-3d','3D 模型物件生成'],['o-music','音樂生成']]},
  {id:'gallery',c:'社群藝廊',d:'瀏覽其他使用者的作品，找生成靈感。',items:[['g-basics','藝廊功能介紹']]}]},
 {g:'參考資料',cats:[
  {id:'models',c:'模型總覽',d:'依用途比較圖片、影片與音樂模型。',items:[['m-img','圖片模型基礎介紹'],['m-imgc','圖片模型差異比較'],['m-vid','影片模型差異比較'],['m-credit','登月幣模型差異比較'],['m-music','音樂生成模型差異比較']]},
  {id:'account',c:'帳號與團隊',d:'帳號資訊、團隊註冊與登入、成員邀請、點數分配與團隊管理員後台。',items:[['a-login','團隊註冊與登入方式'],['a-trial','體驗帳號登入方式'],['a-invite','批次大量邀請成員'],['a-tags','標籤功能操作'],['a-credits','團隊共用點數分配'],['a-projects','專案管理'],['a-admin','團隊管理員功能教學'],['a-1','管理員 1｜系統導覽與前期準備'],['a-2','管理員 2｜帳號建置與成員邀請'],['a-3','管理員 3｜標籤應用與名單過濾'],['a-4','管理員 4｜狀態追蹤與資源配置'],['a-5','管理員 5｜帳號停用、恢復與刪除'],['a-6','管理員 6｜用戶資訊檢視與檢索']]}]},
 {g:'支援',items:[['faq','常見問題'],['changelog','更新日誌'],['contact','聯絡我們']]}
];
const NOTION={'img-prompt':'/3bc55cb6aede808d8446ed1662d2ed95','img-upscale':'/SeedVR2-3bc55cb6aede80c19b26fc7fbebd75a8','img-outpaint':'/3bc55cb6aede80b68f04d9a5064b462c','img-rotate':'/3bc55cb6aede80748444f03fdc5a4ed9','c-settings':'/3f955cb6aede80209386f6038e3cc605','c-basics':'/29555cb6aede807c9afcd7d64f676c89','c-edit':'/29555cb6aede80ebab0ddc3575c9f969','c-recipes':'/2bd55cb6aede80328424c96864d5ad39','c-pvc':'/PVC-29555cb6aede8042af93ef166a242af0','c-logo':'/LOGO-29555cb6aede807c9fb3ce18b389969b','c-outfit':'/29555cb6aede80c7a662d7d4f839f4db','l-ui':'/2a155cb6aede80bf90e6f665c2ed087b','l-lora':'/LoRA-2bd55cb6aede80529bc8e1780c63fdd4','l-cn':'/ControlNet-2bd55cb6aede80559935e8ad77882191','l-prompt':'/29555cb6aede80b4a164d231a33442c1','l-ip':'/IP-adapter-29555cb6aede80c8a1dedbd3e8a018f5','l-face':'/29555cb6aede80379c54f523764f1231','video':'/29555cb6aede805098c0e9fe9bba175e','chat':'/29555cb6aede80a0934fe63d991b1018','lab':'/29555cb6aede808f8e2df8f33efc3ada'};

const PAGES={}; const ORDER=[]; const CATS={};
NAV.forEach(g=>{(g.items||[]).forEach(i=>{PAGES[i[0]]={t:i[1],path:g.g};ORDER.push(i[0])});(g.cats||[]).forEach(c=>{CATS[c.id]=c;PAGES[c.id]={t:c.c,path:g.g,cat:c.id};ORDER.push(c.id);c.items.forEach(i=>{PAGES[i[0]]={t:i[1],path:g.g+' / '+c.c,cat:c.id};ORDER.push(i[0])})})});
PAGES.home={t:'首頁',path:''};

function esc(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function link(i){return `<a href="#${i[0]}" data-id="${i[0]}">${esc(i[1])}${i[2]?`<span class="tag new">${i[2]}</span>`:''}</a>`}
document.getElementById('side').innerHTML=NAV.map(g=>`<div class="grp"><div class="gl">${g.g}</div>${(g.items||[]).map(link).join('')}${(g.cats||[]).map(c=>`<details data-cat="${c.id}"><summary><a class="cat" href="#${c.id}" data-id="${c.id}">${esc(c.c)}</a><span class="cnt">${c.items.length}</span></summary>${c.items.map(link).join('')}</details>`).join('')}</div>`).join('');

const shot=(label,ratio)=>`<div class="shot" style="aspect-ratio:${ratio}"><div><strong>截圖待替換</strong>${label}</div></div>`;

const VIEWS={
home:()=>`<div class="hero"><h1>moonland.ai 說明中心</h1><p>從第一張 AI 圖片到團隊管理，所有操作教學都在這裡。按 Ctrl + K 隨時搜尋。</p><a class="btn" href="#quick-start">5 分鐘快速入門</a><a class="btn ghost" href="#models">看所有模型</a></div>
<h2 id="h-goal">你想做什麼？</h2>
<div class="cards"><a class="card" href="#c-basics"><b>第一次使用</b><span>從交談開始，用一句話生成圖片，再試試圖片與影片生成。</span></a><a class="card" href="#lab"><b>進階應用</b><span>到實驗室用 LoRA、ControlNet 精修角度、光線與風格。</span></a><a class="card" href="#a-admin"><b>團隊管理</b><span>邀請成員、分配點數、管理專案。</span></a></div>
<h2 id="h-feat">功能教學</h2>
<div class="cards"><a class="card" href="#image"><b>圖片生成</b><span>用文字或參考圖生成、修改圖片</span></a><a class="card" href="#video"><b>影片生成</b><span>圖片轉影片、動作模仿、頭尾幀</span></a><a class="card" href="#chat"><b>交談</b><span>用對話生成與編輯，最容易上手</span></a><a class="card" href="#lab"><b>實驗室</b><span>LoRA、ControlNet、IP-Adapter</span></a><a class="card" href="#credit-tools"><b>登月幣工具</b><span>Seedance、Kling 等外部模型</span></a><a class="card" href="#o-music"><b>其他工具</b><span>3D 模型、音樂生成</span></a></div>
<h2 id="h-new">最近更新</h2>
<div class="tbl"><table><tbody><tr><td style="font-variant-numeric:tabular-nums;width:8rem">2026/08/14</td><td>內容更新</td></tr><tr><td>2026/05/05</td><td>內容更新</td></tr><tr><td>2026/04/23</td><td>部分內文附圖更新</td></tr></tbody></table></div><p><a href="#changelog">看完整更新日誌 →</a></p>`,
image:()=>`<div class="crumb">功能教學</div><h1>圖片生成</h1><p>在「圖片生成」可以用文字（提示詞）或參考圖片生成各種 AI 圖片，也能針對已生成的圖片修改特定內容。</p>
<h2 id="h-basic">先看基礎</h2><p>第一次使用建議從這兩篇開始。</p>
<div class="cards"><a class="card" href="#basics"><b>圖片生成基礎介紹</b><span>新手・約 3 分鐘</span></a><a class="card" href="#img-prompt"><b>提示詞助手</b><span>新手・讓 AI 幫你改寫提示詞</span></a></div>
<h2 id="h-adv">進階應用</h2>
<div class="cards"><a class="card" href="#img-upscale"><b>圖片放大（SeedVR2）</b><span>提高解析度與細節</span></a><a class="card" href="#img-outpaint"><b>圖片拓展</b><span>把畫面往外延伸</span></a><a class="card" href="#img-rotate"><b>圖片視角旋轉調整</b><span>改變拍攝角度</span></a></div>`,
basics:()=>`<div class="crumb">功能教學 / 圖片生成</div><h1>圖片生成基礎介紹</h1>
<div class="meta"><span class="chip new">新手</span><span class="chip">功能介紹</span><span class="chip">適用 FLUX.2</span><span class="chip">約 3 分鐘</span><span class="chip">更新 2026/08/14</span></div>
<div class="aside"><b>你會學到</b>進入圖片生成介面、選擇模型、寫出有效的提示詞，並送出第一張圖。</div>
<h2 id="h-ui">進入圖片生成介面</h2>
<ol class="steps"><li>進入 moonland.ai 網站後，點選左側選單的「生成」。</li><li>在畫面下方切換到「圖片」。</li><li>選擇模型。這篇以「FLUX.2」為例。${shot('圖片生成介面：「生成」選單、「圖片」分頁與模型選單','1920/863')}</li><li>確認生成模式和模型都選好後，就可以開始生成。</li></ol>
<h2 id="h-prompt">撰寫提示詞</h2><p>在提示詞欄位輸入想生成的內容。描述得越完整，結果越接近你想要的畫面。</p>
<div class="aside warn"><b>提示詞至少要兩個詞</b>提示詞是 AI 生成時最重要的依據。請至少用兩個以上的詞描述，並具體寫出希望畫面裡出現的物件。</div>
<p>如果不確定怎麼寫，可以點「提示詞自動修飾」，AI 會依照你選的模型改寫提示詞。詳細用法請看<a href="#img-prompt">提示詞助手</a>。</p>${shot('提示詞欄位與「提示詞自動修飾」按鈕','1911/863')}
<h2 id="h-ex">提示詞範例</h2>
<div class="tbl"><table><thead><tr><th>提示詞</th><th>重點</th></tr></thead><tbody><tr><td>一隻虎斑貓頭上戴著斗笠</td><td>主體 ＋ 配件</td></tr><tr><td>一隻鸚鵡嘴裡叼著一根湯匙</td><td>主體 ＋ 動作</td></tr><tr><td>一位美麗的亞洲模特兒身穿禮服在走秀</td><td>主體 ＋ 服裝 ＋ 場景</td></tr></tbody></table></div>
<div class="grid3"><figure>${shot('虎斑貓戴斗笠','512/689')}<figcaption>虎斑貓戴斗笠</figcaption></figure><figure>${shot('鸚鵡叼湯匙','512/689')}<figcaption>鸚鵡叼湯匙</figcaption></figure><figure>${shot('模特兒走秀','512/689')}<figcaption>模特兒走秀</figcaption></figure></div>
<h2 id="h-next">下一步</h2><ul><li><a href="#img-prompt">提示詞助手</a>：讓 AI 幫你把提示詞寫得更完整</li><li><a href="#v-i2v">圖片生成影片（i2v）</a>：把生成的圖片變成影片</li></ul>
<div class="feedback">這篇有幫助嗎？<button type="button" aria-pressed="false">有幫助</button><button type="button" aria-pressed="false">還需要改進</button></div>`,
contact:()=>`<div class="crumb">支援</div><h1>聯絡我們</h1><p>我們的團隊可以協助線上或線下的教育訓練課程，也歡迎洽詢客製化技術支援。</p><div class="tbl"><table><tbody><tr><th>E-mail</th><td>support@moonshine.ai</td></tr><tr><th>電話</th><td>(+886) 02-2785-3069</td></tr><tr><th>LINE 社群</th><td>ID：@588katjx・<a href="https://lin.ee/PpA769D">加入社群</a></td></tr><tr><th>價目表</th><td><a href="https://moonland.ai/pricing?direct">moonland.ai/pricing</a></td></tr></tbody></table></div>`
};

function catView(id){const c=CATS[id]; const p=PAGES[id];
 return `<div class="crumb">${esc(p.path)}</div><h1>${esc(c.c)}</h1><p>${esc(c.d)}</p>`+(c.items.length?`<h2 id="h-list">這個分類的文章</h2><div class="cards">${c.items.map(i=>`<a class="card" href="#${i[0]}"><b>${esc(i[1])}</b><span>${i[2]?i[2]+'・':''}待搬移</span></a>`).join('')}</div>`:`<div class="aside"><b>目前僅開放團隊帳號</b>如需開通，請<a href="#contact">聯絡我們</a>。</div>`)}
function stub(id){const p=PAGES[id]; const n=NOTION[id];
 return `<div class="crumb">${esc(p.path)}</div><h1>${esc(p.t)}</h1><div class="todo">這篇文章還沒搬移到新網站。${n?`<a href="${N+n}">先看 Notion 原文</a>`:''}</div><p style="color:var(--muted);font-size:15px;margin-top:1.5em">預覽版只完成了「圖片生成基礎介紹」這一篇。其他頁面已在網站專案裡建好網址和側欄位置，搬移時照同一個範本改寫即可。</p>`}

function pager(id){const i=ORDER.indexOf(id); if(i<0)return ''; const p=ORDER[i-1],n=ORDER[i+1];
 return `<div class="pager">${p?`<a href="#${p}"><span>上一篇</span>${esc(PAGES[p].t)}</a>`:''}${n?`<a class="next" href="#${n}"><span>下一篇</span>${esc(PAGES[n].t)}</a>`:''}</div>`}

function render(){
 let id=(location.hash||'#home').slice(1); if(!PAGES[id]&&!VIEWS[id]) id='home';
 const v=document.getElementById('view');
 const banner=id==='home'?`<div class="note">這是排版預覽。左上角的選單按鈕可以收合整個目錄；點分類名稱會進到該分類的文章列表，點右側箭頭則直接在目錄裡展開文章。完整的 Starlight 網站專案另附原始碼，在電腦上執行後會是同樣的結構，並內建全文搜尋。</div>`:'';
 v.innerHTML=banner+(VIEWS[id]?VIEWS[id]():CATS[id]?catView(id):stub(id))+(id==='home'?'':pager(id));
 document.querySelectorAll('nav.side a').forEach(a=>{if(a.dataset.id===id)a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current')});
 const cur=PAGES[id]&&PAGES[id].cat; if(cur){const d=side.querySelector(`details[data-cat="${cur}"]`); if(d)d.open=true}
 const hs=[...v.querySelectorAll('h2[id]')];
 document.getElementById('toc').innerHTML=hs.length?`<div class="tl">本頁目錄</div>`+hs.map(h=>`<a href="#${id}" data-to="${h.id}">${esc(h.textContent)}</a>`).join(''):'';
 v.querySelectorAll('.feedback button').forEach(b=>b.onclick=()=>{v.querySelectorAll('.feedback button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true')});
 document.title=(id==='home'?'':PAGES[id].t+'｜')+'moonland.ai 說明中心';
 window.scrollTo(0,0); closeMenu();
}
document.getElementById('toc').addEventListener('click',e=>{const a=e.target.closest('a[data-to]'); if(!a)return; e.preventDefault(); document.getElementById(a.dataset.to).scrollIntoView({behavior:'smooth'})});
const side=document.getElementById('side'),mb=document.getElementById('menuBtn');
const mq=matchMedia('(max-width:760px)');
function sync(){const open=mq.matches?side.classList.contains('open'):!document.body.classList.contains('nav-collapsed'); mb.setAttribute('aria-expanded',open); mb.setAttribute('aria-label',open?'收合目錄':'展開目錄')}
function closeMenu(){side.classList.remove('open');sync()}
mb.onclick=()=>{ if(mq.matches){side.classList.toggle('open')} else {const c=document.body.classList.toggle('nav-collapsed'); try{localStorage.setItem('navCollapsed',c?'1':'0')}catch(e){}} sync()};
try{if(localStorage.getItem('navCollapsed')==='1')document.body.classList.add('nav-collapsed')}catch(e){}
mq.addEventListener('change',sync);

const dlg=document.getElementById('dlg'),q=document.getElementById('q'),res=document.getElementById('results');
const IDX=Object.entries(PAGES).filter(([k])=>k!=='home').map(([k,p])=>({k,t:p.t,path:p.path,body:VIEWS[k]?VIEWS[k]().replace(/<[^>]+>/g,' '):''}));
function search(){const s=q.value.trim().toLowerCase(); if(!s){res.innerHTML='<p>輸入關鍵字搜尋所有文章標題與內文。</p>';return}
 const r=IDX.filter(x=>(x.t+' '+x.path+' '+x.body).toLowerCase().includes(s)).slice(0,12);
 res.innerHTML=r.length?r.map((x,i)=>`<a href="#${x.k}" class="${i?'':'sel'}">${esc(x.t)}<span>${esc(x.path)}</span></a>`).join(''):'<p>找不到符合的文章，換個關鍵字試試。</p>'}
function openSearch(){q.value='';search();dlg.showModal();q.focus()}
document.getElementById('searchBtn').onclick=openSearch;
q.oninput=search;
q.onkeydown=e=>{if(e.key==='Enter'){const a=res.querySelector('a');if(a){location.hash=a.getAttribute('href');dlg.close()}}};
res.onclick=e=>{if(e.target.closest('a'))dlg.close()};
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}});
window.addEventListener('hashchange',render);
render();
