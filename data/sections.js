// 左側目錄與分類（改分類、改順序都在這裡）
//    一般列：{ id, icon, tag, n: 目錄上顯示的較短名稱（選填） }
//    分類列：{ id, t, icon, tag, d, groups: [{ g: 小標, items: [[文章 id, 目錄名稱, 標籤]] }] }
//    文章標題與內容來自 data/*.js
window.SECTIONS = [
  { label: '開始使用', rows: [
    { id: 'quick-start', icon: 'rocket', tag: '新手' },
    { id: 'credits', icon: 'coin' },
    { id: 'trial-login', icon: 'key' },
    { id: 'gallery', icon: 'grid' },
  ] },
  { label: '創作工具', rows: [
    { id: 'chat', t: '交談', icon: 'chat', tag: '新手推薦',
      d: '用中文對話生成圖片、影片、音樂與 3D 模型，AI 助理會自動挑選模型。第一次使用最推薦從這裡開始。',
      groups: [{ g: '', items: [['chat-intro', '交談介紹', '新手'], ['chat-prompts', '提示詞寫法'], ['chat-edit', '編輯與合成'], ['chat-settings', '交談設定']] }] },
    { id: 'image', t: '圖片生成', icon: 'image',
      d: '用文字或參考圖片生成 AI 圖片，也能放大、拓展、旋轉視角或修改已生成的圖片。',
      groups: [
        { g: '基礎', items: [['img-basics', '圖片生成基礎介紹', '新手'], ['img-prompt', '提示詞助手']] },
        { g: '進階應用', items: [['img-upscale', '圖片放大（SeedVR2）'], ['img-outpaint', '圖片拓展'], ['img-rotate', '圖片視角旋轉']] },
      ] },
    { id: 'video', t: '影片生成', icon: 'video',
      d: '用文字、圖片或影片生成 AI 影片，還能控制運動軌跡、頭尾幀、模仿動作與合併片段。',
      groups: [
        { g: '基礎', items: [['v-basics', '影片生成基礎介紹', '新手'], ['v-i2v', '圖片生成影片（i2v）']] },
        { g: '進階控制', items: [['v-v2v', '影片生成影片（v2v）'], ['v-path', '物件運動軌跡控制'], ['v-frames', '頭尾幀連接'], ['v-mimic', '動作模仿'], ['v-merge', '合併影片']] },
      ] },
    { id: 'lab', t: '實驗室', icon: 'flask',
      d: '用 LoRA、ControlNet、IP-Adapter 等精細參數控制生成，適合對品質要求高、或熟悉 Stable Diffusion 的使用者。',
      groups: [{ g: '', items: [['l-ui', '操作介面'], ['l-lora', 'LoRA 應用'], ['l-cn', 'ControlNet'], ['l-ip', '風格一致性（IP-Adapter）']] }] },
    { id: 'music-3d', t: '音樂與 3D', icon: 'music',
      d: '用文字與歌詞生成歌曲、背景音樂與音效，或用一張圖片生成 3D 模型。',
      groups: [{ g: '', items: [['music', '音樂生成'], ['model-3d', '3D 模型生成']] }] },
    { id: 'credit-tools', icon: 'planet', n: '外部模型（登月幣）' },
  ] },
  { label: '學習資源', rows: [
    { id: 'recipes', t: '應用範例', icon: 'sparkles',
      d: '跟著做就能完成的主題教學：從一個具體成品出發，帶你走完整個流程。',
      groups: [{ g: '', items: [['chat-recipes', '「交談」應用大全'], ['pvc', 'PVC 公仔風格'], ['logo', 'LOGO 創作'], ['outfit', '人物角色換衣'], ['face-swap', '名畫換臉']] }] },
    { id: 'models', t: '模型指南', icon: 'layers',
      groups: [{ g: '', items: [['m-choose', '模型怎麼選', '新手'], ['m-image', '圖片模型一覽'], ['m-video', '影片模型比較'], ['m-music', '音樂模型比較']] }] },
  ] },
  { label: '團隊管理', rows: [
    { id: 'team', t: '團隊成員', icon: 'users',
      d: '給團隊成員：收到邀請後怎麼註冊登入，以及用專案整理作品。',
      groups: [{ g: '', items: [['team-login', '團隊註冊與登入'], ['projects', '專案管理']] }] },
    { id: 'admin', t: '管理員課程', icon: 'shield',
      d: '給團隊管理員的六堂課，依序從系統導覽走到成員資訊檢視。',
      groups: [{ g: '', items: [['admin-1', '1｜系統導覽與標籤準備'], ['admin-2', '2｜邀請成員'], ['admin-3', '3｜用標籤分組'], ['admin-4', '4｜點數與登月幣分配'], ['admin-5', '5｜帳號狀態管理'], ['admin-6', '6｜查看成員資訊']] }] },
  ] },
  { label: '支援', rows: [
    { id: 'faq', icon: 'help' },
    { id: 'changelog', icon: 'history' },
    { id: 'contact', icon: 'mail' },
    { id: 'feedback', t: '意見回饋', icon: 'message' },
  ] },
];
