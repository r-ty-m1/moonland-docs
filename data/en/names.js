// 英文翻譯：大分類與分類小標的名稱（中文 → 英文）；伺服器啟動時，還沒有英文名稱的會補上（server/editor.js 的 importEnSeed）
(window.EN_SEED = window.EN_SEED || { pages: {}, sections: {}, groups: {} });
Object.assign(EN_SEED.sections, {
  "開始使用": "Get started",
  "創作工具": "Creative tools",
  "學習資源": "Learn",
  "團隊管理": "Team management",
  "支援": "Support"
});
Object.assign(EN_SEED.groups, {
  "基礎": "Basics",
  "進階應用": "Advanced",
  "進階控制": "Advanced control",
  "先看這篇": "Start here",
  "點數模型": "Points models",
  "登月幣模型": "Coins models"
});
