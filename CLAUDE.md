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
- **改了 css 或 js 就換版本號**：`index.html` 裡 `?v=` 後面的數字（例如 `20261106c`；`edit.html`、`admin.html` 也要一起換），並同步 `README.md` 的範例。否則 GitHub Pages 的訪客會讀到瀏覽器快取的舊檔。公司內部部署不受影響，伺服器會自動用檔案雜湊。
- 驗證要實際看：用 Playwright 開頁面截圖、逐頁檢查，不要只看程式碼。手機寬度至少測 360 和 390，並測三種字體大小。

## 架構重點

- `data/sections.js`：`SECTIONS` 決定左側目錄與分類。`markup.js`：圖示、`T()`、文章標記語法 → HTML（說明中心與編輯後台共用，要在 `script.js`／`edit.js` 之前載入）。`script.js`：搜尋、明暗模式、字體大小、側欄等說明中心功能。
- `data/*.js`：文章內容，每篇是 `window.ARTICLES` 裡的一個物件，內文用自訂標記語法寫（見 README）。多篇共用的長段落放 `data/snippets.js`。
- `data/media.js`：媒體編號 → `["檔案路徑", 寬高比]`。檔案在 `assets/media/<區域資料夾>/<文章代號>-<序號>.<副檔名>`（區域：start chat image video lab recipes models team support unused；2026-10-30 整理，規則見 README「圖片與影片」，`server/test.js` 會檢查）。圖片 WebP、影片 H.264 MP4、音訊 MP3。文章用編號引用，編號不改，搬檔只改路徑。文章裡用 `[i 編號]`、`[v 編號]`、`[a 編號]` 引用。新增媒體時用沒用過的編號，並寫對寬高比，這樣圖片載入前就先保留位置，頁內跳轉才不會跑掉。
- **所有字級用 `rem`**，不要寫 `px`，否則右上角「字體大小」（標準 100%、大 115%、特大 130%）放大不到。
- 手機（寬度 620px 以下）表格會改成一列一張卡片，靠每個儲存格的 `data-label`；只有圖片的並排會維持兩欄。
- 連結寫法：`[文字](#文章代號)` 到別的文章，`[文字](#h-錨點)` 跳到本頁段落，`https://` 開新分頁。連結文字可以含方括號（例如 `FLUX.2 [Klein]`）。
- 回饋：「這篇有幫助嗎？」投票與「意見回饋」頁（`VIEWS.feedback`）。`config.js` 的 `googleScriptUrl` 有值就 POST 到 Google Apps Script（`google-apps-script/Code.gs`，存進公司 Google 試算表，body 用 text/plain 避免跨網域預檢）；沒值就 POST 到 `api/feedback`，伺服器回 404/405（GitHub Pages）時改存 localStorage `ml-feedback-preview`。後台 `admin.html` 依同樣順序讀取，讀不到就進預覽模式（示範資料＋本機資料）。回饋類型的代號（stuck／unclear／suggest／other）在 `script.js`、`admin.js`、`server/server.js`、`google-apps-script/Code.gs` 四處要一致。改了 `Code.gs` 要提醒使用者在 Apps Script 重新部署新版本。2026-10-29 使用者還沒建立試算表，`googleScriptUrl` 仍是空的。
- 英文版已在 2026-10-30 移除（使用者決定），網站只有中文。舊的英文版在 git tag `english-version`。介面文字仍包 `T()`（markup.js），不要再建 `data/en/`；使用者沒要求就不要加回英文。

- 編輯後台 `edit.html`（2026-11-02 起有正式版）：同一份程式，伺服器回應 `/api/me` 就是正式版，否則（GitHub Pages）是示範版（模擬登入、存在 localStorage `ml-editor-demo`，給主管審核用）。正式版：公司帳號登入（`server/editor.js` 自己做 OIDC＋PKCE，請求 `employee_number`；本機用 `DEV_LOGIN=1` 假登入）、`server/owners.json` 是固定主管理員、其他編輯者存伺服器名單；內容存 `DATA_DIR/content.json`（第一次啟動從 `data/*.js` 複製，**之後 `data/*.js` 只是初始內容，改它不會影響公司網站**），說明中心讀伺服器產生的 `/content.js`（`index.html`／`edit.html` 的 `<!-- content -->` 區塊會被換掉）；上傳圖片存 `DATA_DIR/media/`，伺服器依命名規則命名、給編號；存檔帶版本號，衝突回 409；「檢查與備份」分頁可下載／還原備份；草稿（`draft: true`）只在後台「草稿箱」看得到，`toSite` 會跳過，初始草稿在 `data/drafts.js`（index.html 不載入、伺服器不對外提供）。內容格式轉換與檢查在 `model.js`（瀏覽器與伺服器共用）。`server/test.js` 會用假登入和模擬的 Authentik 測完整流程。

## 部署到公司內部（尚未推送）

網站要放到公司內部的 Gitea 自動部署，部署設定都已備好：`Dockerfile`、`compose.yaml`、`vibe.yaml`、`.gitea/workflows/ci.yaml`、`server/server.js`（無相依套件的靜態伺服器）。

- 說明中心不用登入、網址對外公開；編輯後台要公司帳號登入（`vibe.yaml` 的 `auth.mode: oidc`、`callback_path: /api/auth/callback/authentik`）。內容、上傳、回饋存在 persistence（`mount_path: /app/storage`，Dockerfile 的 `DATA_DIR`；不能用 `/app/data`，那是程式附的文章資料夾）。圖片目前存 persistence，沒用 S3。
- 回饋若存公司伺服器（`config.js` 沒填 Google 網址），persistence 已開；但回饋後台仍只靠 `ADMIN_TOKEN` 密碼，要改成公司登入可沿用 `server/editor.js` 的登入。
- `ci.yaml` 由公司範本產生，不要手動改；要更新用 vibe-deploy 的 containerize skill。
- 部署流程用 vibe-deploy 這組 skills（assess-readiness → containerize → deploy-site；推送權限用 gitea-access）。推送需要用使用者的公司帳號登入，所以要在使用者自己的電腦上做。
- `server/owners.json` 的 `owners` 目前是空的，上線前要填網站負責人的員工編號，否則沒有人能進後台管理名單。
- 容器映像還沒實際建置驗證過（開發環境連不到 Docker Hub），第一次推上去由 CI 建置時才會驗證。
- **使用者目前只要預覽給主管看，還沒要求推到公司 Gitea。** 沒有明確要求不要推。

## 維護手冊

- 上線到公司網站後**不再用 AI 維護**（使用者 2026-10-30），由同事用編輯後台、平台組工程師處理程式。所以上線前要做到不靠 AI 也能維護。
- `docs/MAINTENANCE.md`：給網站負責人與平台組（發布與回復、測試訊息、排查、上線前清單）。改了架構、部署、回饋或編輯後台時要同步更新，清單做完就打勾。
- 編輯後台「使用說明」分頁（`edit.js` 的 `viewHelp`）：給編輯者。後台功能改了要同步改說明。

## 已知待辦與注意事項

- Notion 之後會關閉。所有媒體已搬進網站，文章不再連 Notion。Notion 原始檔（三個 zip 和 manifest）在使用者電腦的「下載」資料夾，預計搬到 `F:\RD\Moonland\moonland-media` 保存。
- 前後比較（2026-10-30 起）改用網站內建的 `:::compare` 區塊（`markup.js` 的 `compare()`，拖曳程式也在 `markup.js`），圖片編號 585–593（`models/m-image-*`）。原本嵌入的外部工具 `Image_Compare`（使用者另一個 GitHub 公開專案，用 GitHub Token 從瀏覽器上傳圖片）已不再使用，使用者認為不安全；不要再嵌入它。編輯後台有「前後比較」按鈕可插入。
- 「登月幣工具」頁在 Notion 原稿是空的，內容待使用者補。
- **登月幣模型**（2026-11-06 使用者確認）：GPT Image、Kling、Seedance、MiniMax H3 Max／Max Turbo、FLUX 3 Image（FLUX.3 Image Klein 才是點數版；MiniMax H3 與 H3 Turbo 是點數版）等用登月幣計費，**不能寫進點數模型的頁面**（圖片模型一覽、影片模型比較、模型指南）。2026-11-06 使用者同意：模型介紹都在「學習資源 › 模型指南」，用小標分「先看這篇／點數模型／登月幣模型」；登月幣頁的目錄項目帶標籤「付費」（`script.js` 的 `PAID`，顯示成金色 `.tag.paid`／`.chip.paid`，所在小標也變金色）；登月幣頁 `credit-image`、`credit-video`、`credit-music-3d`（文章在 `data/lab.js`）放在付費小標下，`credit-tools` 登月幣怎麼用放在「開始使用」的「點數與登月幣」後面。創作工具裡不再有登月幣分類。使用者不要放草稿箱，但要補完圖片才推送。模型清單是使用者從平台「選擇生成工具」（篩選月亮圖示）複製的 HTML 整理而來；月亮數字＝每張／每次大約花幾枚登月幣。點數模型的預估點數也照平台清單補在各總覽表。免費帳號每日 1,000 點；登月幣 1 元 = 1 枚、最少 1,000、無期限、每次加值附一年進階權益；價目表 https://moonland.ai/pricing。
- 多圖編輯的張數上限，Notion 原稿有 3 張和 9 張兩種說法，網站目前寫 9 張，待使用者確認。
- 手機上看截圖裡的介面文字會很小，只能點圖放大；若要改善，需要重新截放大局部的圖。
- 網站有加 `noindex`，不讓搜尋引擎收錄。
