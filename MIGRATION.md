# 從 Notion 搬移內容

## 現況

- 已依新範本改寫：`image/basics.mdx`（圖片生成基礎介紹）
- 其餘文章都已建立頁面與網址，標記為 `migration: todo`，頁面會連回 Notion 原文
- 截圖目前是佔位圖，需要換成真的圖片

查詢還沒搬的文章：

```bash
grep -rl "migration: todo" src/content/docs
```

## 搬移流程

1. **從 Notion 匯出**：在 Notion 首頁 → 右上「⋯」→ 匯出 → 格式選「Markdown & CSV」，勾選「包含子頁面」。解壓縮到專案根目錄的 `notion-export/`（已列在 `.gitignore`）。
2. **放圖片**：把該篇的圖片複製到 `src/assets/<分類>/`，檔名用 `<文章>-01-<說明>.png`，例如 `basics-01-interface.png`。建議先壓縮或轉成 WebP。
3. **改寫文章**：照範本把內容改寫進對應的 `.mdx`，把 `migration: todo` 刪掉。
4. **檢查**：`npm run dev` 看排版，確認圖片、連結都正常。

## 用 Claude Code 搬移

在專案資料夾開 Claude Code，貼上這段（把路徑換成要搬的那篇）：

```
請把 notion-export/ 裡的「交談介紹」搬到 src/content/docs/chat/basics.mdx：
- 以 src/content/docs/image/basics.mdx 為範本
- 操作步驟改用 <Steps>，提醒改用 <Aside>
- 圖片複製到 src/assets/chat/，命名 basics-01-xxx.png，並寫有意義的 alt
- frontmatter 補上 level、models、minutes，刪除 migration: todo
- 內文用繁體中文、句子簡短，不要改變原本的操作說明內容
完成後執行 npm run build 確認沒有錯誤。
```

## 搬移時順便修正

- 「其他設定區塊」統一改稱「帳號與團隊」
- 「圖片生成」分類頁原文「透過不同影片來進行」應為「圖片」
- 「登月幣工具」原頁內容與「其他工具」重複，需確認正確說明
- 「常見問題」原頁只有模型介紹文章，已移到「模型總覽」；常見問題需另外整理
- 更新日誌多數日期沒有說明內容，需補上
