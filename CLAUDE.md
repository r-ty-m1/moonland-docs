# moonland.ai 說明中心

moonland.ai（AI 生成平台）的使用手冊網站，由 Notion 手冊改寫而成。純靜態網站，不需要建置或安裝套件。

- 預覽網址：https://r-ty-m1.github.io/moonland-docs/ （GitHub Pages，`main` 分支推上去約 1～2 分鐘更新）
- Starlight 版本保留在 `starlight` 分支，已不使用
- 完整的檔案結構、文章標記語法、新增媒體步驟都在 `README.md`，改內容前先讀它

## 工作方式

- **用正體中文回覆。** 提示詞本身（例如影片生成提示詞）維持英文。
- 使用者不熟悉程式與部署，解釋時用白話，避免未解釋的術語。
- 改完直接推到 `main`，不用每次詢問。
- 推送前跑 `node server/test.js`（檢查每篇文章引用的媒體都有對照、檔案都在，伺服器運作正常）。
- **改了 css 或 js 就換版本號**：`index.html` 裡 `?v=` 後面的數字（例如 `20261028b`），並同步 `README.md` 的範例。否則 GitHub Pages 的訪客會讀到瀏覽器快取的舊檔。公司內部部署不受影響，伺服器會自動用檔案雜湊。
- 驗證要實際看：用 Playwright 開頁面截圖、逐頁檢查，不要只看程式碼。手機寬度至少測 360 和 390，並測三種字體大小。

## 架構重點

- `script.js`：`SECTIONS` 決定左側目錄與分類；文章渲染、搜尋、明暗模式、字體大小、側欄都在這裡。
- `data/*.js`：文章內容，每篇是 `window.ARTICLES` 裡的一個物件，內文用自訂標記語法寫（見 README）。多篇共用的長段落放 `data/snippets.js`。
- `data/media.js`：媒體編號 → `["檔名", 寬高比]`。檔案在 `assets/media/`（圖片 WebP、影片 H.264 MP4、音訊 MP3）。文章裡用 `[i 編號]`、`[v 編號]`、`[a 編號]` 引用。新增媒體時用沒用過的編號，並寫對寬高比，這樣圖片載入前就先保留位置，頁內跳轉才不會跑掉。
- **所有字級用 `rem`**，不要寫 `px`，否則右上角「字體大小」（標準 100%、大 115%、特大 130%）放大不到。
- 手機（寬度 620px 以下）表格會改成一列一張卡片，靠每個儲存格的 `data-label`；只有圖片的並排會維持兩欄。
- 連結寫法：`[文字](#文章代號)` 到別的文章，`[文字](#h-錨點)` 跳到本頁段落，`https://` 開新分頁。連結文字可以含方括號（例如 `FLUX.2 [Klein]`）。

## 部署到公司內部（尚未推送）

網站要放到公司內部的 Gitea 自動部署，部署設定都已備好：`Dockerfile`、`compose.yaml`、`vibe.yaml`、`.gitea/workflows/ci.yaml`、`server/server.js`（無相依套件的靜態伺服器）。

- 不需要登入、不存使用者資料（`vibe.yaml` 的 `auth.mode: none`、`persistence.enabled: false`），網址對外公開，使用者已知悉。
- `ci.yaml` 由公司範本產生，不要手動改；要更新用 vibe-deploy 的 containerize skill。
- 部署流程用 vibe-deploy 這組 skills（assess-readiness → containerize → deploy-site；推送權限用 gitea-access）。推送需要用使用者的公司帳號登入，所以要在使用者自己的電腦上做。
- 容器映像還沒實際建置驗證過（開發環境連不到 Docker Hub），第一次推上去由 CI 建置時才會驗證。
- **使用者目前只要預覽給主管看，還沒要求推到公司 Gitea。** 沒有明確要求不要推。

## 已知待辦與注意事項

- Notion 之後會關閉。所有媒體已搬進網站，文章不再連 Notion。Notion 原始檔（三個 zip 和 manifest）在使用者電腦的「下載」資料夾，預計搬到 `F:\RD\Moonland\moonland-media` 保存。
- 6 個前後比較工具是嵌入的外部頁面（`[embed ...]`），來源是使用者另一個 GitHub 專案 `Image_Compare`，不是這個網站的檔案。公司網路連不到 GitHub 就不會顯示。
- 「登月幣工具」頁在 Notion 原稿是空的，內容待使用者補。
- 多圖編輯的張數上限，Notion 原稿有 3 張和 9 張兩種說法，網站目前寫 9 張，待使用者確認。
- 手機上看截圖裡的介面文字會很小，只能點圖放大；若要改善，需要重新截放大局部的圖。
- 網站有加 `noindex`，不讓搜尋引擎收錄。
