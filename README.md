# moonland.ai 說明中心

用 [Astro Starlight](https://starlight.astro.build/) 建置的 moonland.ai 使用教學網站。

## 第一次執行

需要 Node.js 18.20 以上（建議 20 或 22）。

```bash
npm install
npm run dev
```

打開終端機顯示的網址（通常是 http://localhost:4321）就能看到網站，改檔案會自動重新整理。

```bash
npm run build    # 產生正式網站到 dist/
npm run preview  # 在本機預覽 dist/
```

## 資料夾結構

```
src/
  content/docs/        ← 所有文章（.mdx），資料夾 = 網址
    index.mdx          首頁
    getting-started/   快速入門
    image/ video/ chat/ lab/ credit-tools/ other-tools/ gallery/
    models/            模型總覽與比較
    account/           帳號與團隊
    faq.mdx changelog.mdx contact.mdx
  assets/              文章用的圖片（依分類分資料夾）
  components/PageTitle.astro   文章標題下方的標籤列
  styles/custom.css    品牌色與排版
astro.config.mjs       網站名稱、側欄順序
```

## 寫一篇文章

複製 `src/content/docs/image/basics.mdx` 當範本。開頭的設定（frontmatter）說明：

| 欄位 | 用途 |
| --- | --- |
| `title` | 文章標題 |
| `description` | 一句話摘要，會出現在搜尋結果 |
| `type` | 功能介紹／應用／主題應用／模型介紹／團隊管理 |
| `level` | 新手／進階／團隊 |
| `models` | 適用模型，例如 `[FLUX.2]` |
| `minutes` | 預估閱讀分鐘數 |
| `sidebar.order` | 在側欄的排序 |
| `notionUrl` | 原本的 Notion 頁面（搬移追蹤用） |
| `migration` | `todo` 表示還沒搬，頁面上會顯示提示並連回 Notion |

可用的元件：`<Steps>` 編號步驟、`<Aside>` 提示框（tip／note／caution／danger）、`<Tabs>` 分頁、`<CardGrid>` + `<LinkCard>` 卡片連結。

## 用 Claude 更新網站

專案放在 GitHub，並連到 Vercel（或 Netlify／Cloudflare Pages）後，流程是：

1. 把新資料交給 Claude：Word、PDF、截圖、Notion 頁面連結或直接打字說明都可以
2. Claude 把內容改寫成 `src/content/docs/` 裡的文章、把圖片放進 `src/assets/`；要改版面就改 `src/styles/custom.css` 或 `src/components/`
3. Claude 把修改推到 GitHub（重要改動可以先開 Pull Request 讓你確認）
4. Vercel 偵測到更新，幾分鐘內自動重新發布網站

可以在 claude.ai 連結 GitHub 後直接對話完成，或在電腦上用 Claude Code 開這個資料夾操作。

## 側欄

- 所有分類預設收合，點分類名稱展開文章；目前所在的分類會自動展開
- 桌機版網站標題左邊的按鈕可以收合整個左側目錄（記住個人設定）
- 手機版使用 Starlight 內建的漢堡選單
- 每個分類的「總覽」頁列出該分類所有文章

## 部署

推到 GitHub 後，在 Vercel、Netlify 或 Cloudflare Pages 匯入專案即可，建置指令 `npm run build`，輸出資料夾 `dist`。記得把 `astro.config.mjs` 的 `site` 改成正式網址。

搬移進度與流程請看 [MIGRATION.md](./MIGRATION.md)。
