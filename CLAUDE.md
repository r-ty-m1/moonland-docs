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
- **改了 css 或 js 就換版本號**：`index.html` 裡 `?v=` 後面的數字（例如 `20261030d`；`edit.html`、`admin.html` 也要一起換），並同步 `README.md` 的範例。否則 GitHub Pages 的訪客會讀到瀏覽器快取的舊檔。公司內部部署不受影響，伺服器會自動用檔案雜湊。
- 驗證要實際看：用 Playwright 開頁面截圖、逐頁檢查，不要只看程式碼。手機寬度至少測 360 和 390，並測三種字體大小。

## 架構重點

- `data/sections.js`：`SECTIONS` 決定左側目錄與分類。`markup.js`：圖示、`T()`、文章標記語法 → HTML（說明中心與編輯後台共用，要在 `script.js`／`edit.js` 之前載入）。`script.js`：搜尋、明暗模式、字體大小、側欄等說明中心功能。
- `data/*.js`：文章內容，每篇是 `window.ARTICLES` 裡的一個物件，內文用自訂標記語法寫（見 README）。多篇共用的長段落放 `data/snippets.js`。
- `data/media.js`：媒體編號 → `["檔案路徑", 寬高比]`。檔案在 `assets/media/<區域資料夾>/<文章代號>-<序號>.<副檔名>`（區域：start chat image video lab recipes models team support unused；2026-10-30 整理，規則見 README「圖片與影片」，`server/test.js` 會檢查）。圖片 WebP、影片 H.264 MP4、音訊 MP3。文章用編號引用，編號不改，搬檔只改路徑。文章裡用 `[i 編號]`、`[v 編號]`、`[a 編號]` 引用。新增媒體時用沒用過的編號，並寫對寬高比，這樣圖片載入前就先保留位置，頁內跳轉才不會跑掉。
- **所有字級用 `rem`**，不要寫 `px`，否則右上角「字體大小」（標準 100%、大 115%、特大 130%）放大不到。
- 手機（寬度 620px 以下）表格會改成一列一張卡片，靠每個儲存格的 `data-label`；只有圖片的並排會維持兩欄。
- 連結寫法：`[文字](#文章代號)` 到別的文章，`[文字](#h-錨點)` 跳到本頁段落，`https://` 開新分頁。連結文字可以含方括號（例如 `FLUX.2 [Klein]`）。
- 回饋：「這篇有幫助嗎？」投票與「意見回饋」頁（`VIEWS.feedback`）。`config.js` 的 `googleScriptUrl` 有值就 POST 到 Google Apps Script（`google-apps-script/Code.gs`，存進公司 Google 試算表，body 用 text/plain 避免跨網域預檢）；沒值就 POST 到 `api/feedback`，伺服器回 404/405（GitHub Pages）時改存 localStorage `ml-feedback-preview`。後台 `admin.html` 依同樣順序讀取，讀不到就進預覽模式（示範資料＋本機資料）。回饋類型的代號（stuck／unclear／suggest／other）在 `script.js`、`admin.js`、`server/server.js`、`google-apps-script/Code.gs` 四處要一致。改了 `Code.gs` 要提醒使用者在 Apps Script 重新部署新版本。2026-10-29 使用者還沒建立試算表，`googleScriptUrl` 仍是空的。
- 中英文：`<html lang>` 由 `index.html` 開頭依 `?lang=` 或 localStorage `ml-lang` 設定，切換時重新載入。介面文字寫中文包 `T()`，英文對照在 `data/en/ui.js`（key 要和中文一字不差）；英文文章在 `data/en/*.js`（`window.ARTICLES_EN`，只覆蓋 `t`、`d`、`body`、可選的目錄短名 `n`）。改中文文章時，同一篇的英文版也要一起改；`server/test.js` 會檢查每篇都有英文版、媒體與連結一致。英文版字型改用系統西文字型（中文字型的引號是全形）。後台只有中文。

- 編輯後台 `edit.html`（2026-10-30 示範版，給主管審核用）：模擬登入（主管理員／編輯者／沒有權限）、新增修改刪除排序頁面與分類、上傳圖片、圖庫（依區域篩選、搜尋、從圖庫挑圖）、版本紀錄與還原、最近刪除、修改紀錄、編輯者名單。**修改只存在瀏覽器 localStorage `ml-editor-demo`，不會生效**，這是使用者要求的。正式版方向：公司帳號登入（auth.mode: oidc，只擋編輯頁）＋員工編號白名單（公司登入沒有部門資訊）＋伺服器存內容；使用者不懂後端，也沒有公司登入資訊（平台部署時自動設定）。正式網站之後由其他職員編輯，GitHub Pages 只是預覽。英文版暫不編輯。

## 部署到公司內部（尚未推送）

網站要放到公司內部的 Gitea 自動部署，部署設定都已備好：`Dockerfile`、`compose.yaml`、`vibe.yaml`、`.gitea/workflows/ci.yaml`、`server/server.js`（無相依套件的靜態伺服器）。

- 不需要登入、不存使用者資料（`vibe.yaml` 的 `auth.mode: none`、`persistence.enabled: false`），網址對外公開，使用者已知悉。
- 回饋改存 Google 試算表後（使用者 2026-10-29 的方向），下面這兩件事就不需要了，只要 `config.js` 填好網址。
- **若回饋改回存公司伺服器，正式上線前還缺兩件事**（2026-10-29 只做到預覽）：一、回饋檔要存在會保留的磁碟，`vibe.yaml` 要開 persistence 並把 `DATA_DIR` 指過去，否則每次部署就清空；二、後台目前只靠 `ADMIN_TOKEN` 密碼（沒設就只有本機能讀），正式版應該改用公司登入限定誰能看。這兩項用 vibe-deploy 的 containerize 和 design-access skill 處理，不要手動改 `ci.yaml`。
- `ci.yaml` 由公司範本產生，不要手動改；要更新用 vibe-deploy 的 containerize skill。
- 部署流程用 vibe-deploy 這組 skills（assess-readiness → containerize → deploy-site；推送權限用 gitea-access）。推送需要用使用者的公司帳號登入，所以要在使用者自己的電腦上做。
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
- 多圖編輯的張數上限，Notion 原稿有 3 張和 9 張兩種說法，網站目前寫 9 張，待使用者確認。
- 手機上看截圖裡的介面文字會很小，只能點圖放大；若要改善，需要重新截放大局部的圖。
- 網站有加 `noindex`，不讓搜尋引擎收錄。
