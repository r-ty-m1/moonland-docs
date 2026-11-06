# moonland.ai 說明中心

網址：https://r-ty-m1.github.io/moonland-docs/

純靜態網站，不需要安裝或建置。接手維護請先讀 [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md)；編輯者的操作說明在編輯後台的「使用說明」分頁。推到 `main` 後，GitHub Pages 約 1～2 分鐘自動更新。

所有圖片、影片、音訊都放在網站自己的 `assets/media/`，不再依賴 Notion。

## 檔案結構

| 檔案 | 內容 |
| --- | --- |
| `index.html` | 頁面骨架，並依序載入下面的檔案 |
| `style.css` | 配色、字體與排版。最上方 `:root` 是深色配色，下面兩段是淺色配色。字級一律用 `rem`，右上角「字體大小」才能整站一起放大 |
| `data/sections.js` | 左側目錄與分類結構（`window.SECTIONS`） |
| `markup.js` | 說明中心和編輯後台共用：圖示、`T()`、文章標記語法轉成畫面 |
| `script.js` | 說明中心的顯示、搜尋、明暗模式、字體大小等功能 |
| `model.js` | 編輯後台和伺服器共用：兩種內容格式互相轉換、檢查缺圖與壞連結、決定上傳圖片的區域資料夾 |
| `data/*.js` | 所有文章內容，依分類分檔 |
| `config.js` | 網站設定：回饋要存進 Google 試算表時填 Apps Script 網址 |
| `google-apps-script/` | 存回饋到 Google 試算表的程式與設定步驟 |
| `data/media.js` | 媒體編號 → 檔名與寬高比的對照表 |
| `assets/media/` | 所有圖片（WebP）、影片（MP4）、音訊（MP3），依區域分資料夾（見下方「圖片與影片」） |
| `data/snippets.js` | 多篇文章共用的長段落（例如歌詞） |
| `data/drafts.js` | 還沒公開的草稿（`window.DRAFTS`）。只有編輯後台載入，說明中心看不到；格式和文章一樣，另外用 `in`、`after` 指定位置 |
| `assets/` | logo（深色、淺色版）與網站圖示 |
| `server/` | 公司內部部署用的小型伺服器（`server.js`：檔案、回饋；`editor.js`：編輯後台的公司帳號登入、內容存放、上傳、備份；`owners.json`：主管理員的員工編號）與自動測試 `test.js`（GitHub Pages 用不到） |
| `admin.html`、`admin.js`、`admin.css` | 回饋後台：統計、各頁回饋、意見列表、匯出 CSV |
| `edit.html`、`edit.js`、`edit.css` | 編輯後台：新增／修改／刪除／排序頁面、上傳圖片、草稿箱、圖庫、版本紀錄、檢查與備份、編輯者名單、給同事看的「使用說明」。公司網站上是正式版，GitHub Pages 上是示範版 |
| `Dockerfile`、`compose.yaml`、`vibe.yaml`、`.gitea/workflows/ci.yaml` | 部署到 MoonShine 內部環境的設定 |
| `docs/MAINTENANCE.md` | 維護手冊：給網站負責人與平台組，含發布與回復、問題排查、上線前清單 |

完整的 Starlight 版本保留在 `starlight` 分支。

## 新增或修改文章

> **公司網站上線後，文章改在編輯後台修改，不要改 `data/*.js`。** 伺服器第一次啟動時把 `data/*.js` 複製一份存起來，之後說明中心只讀伺服器存的內容（見下方〈編輯後台〉）。下面是預覽版（GitHub Pages）的改法。

1. 在對應的 `data/*.js` 新增一篇：

```js
'文章代號': {
  t: '文章標題',
  d: '一句話摘要，會出現在分類頁與搜尋結果',
  level: '新手',        // 新手／進階／團隊（選填）
  minutes: 3,           // 預估閱讀分鐘數（選填）
  models: ['FLUX.2'],   // 適用模型（選填）
  tool: '交談',         // 使用的工具（選填）
  src: 'Notion 頁面 ID', // 原文出處（選填）
  body: `
（文章內容，寫法見下方）
`},
```

2. 在 `data/sections.js` 的 `SECTIONS` 把 `['文章代號', '目錄上顯示的名稱']` 加到想放的分類。

## 英文版（已移除）

2026-10-30 起網站只有中文。英文版（語言切換、`data/en/` 的 48 篇翻譯）保留在 git 的 `english-version` 標籤，要找回來時從那裡取。介面文字在程式裡仍包在 `T()` 裡，日後要加回其他語言只要改 `markup.js` 的 `T()`。

## 文章標記語法

| 寫法 | 效果 |
| --- | --- |
| `## 標題`、`### 小標` | 標題；`## 標題 {#h-代號}` 可指定錨點 |
| 空一行 | 分段 |
| `- 項目`、`1. 項目` | 項目清單、編號清單 |
| `**粗體**` | 粗體 |
| `{{最常用}}` | 小標誌（10 個字以內），例如標示公司內最常用的模型 |
| `[文字](#文章代號)` | 連到其他文章；`[文字](#h-代號)` 跳到本頁錨點；`https://` 開頭會開新分頁 |
| `> 提示詞` | 可一鍵複製的提示詞框，連續多行會合成一個框 |
| `\| 欄 \| 欄 \|` | 表格，第一列是標題 |
| `[i 123 說明]` | 圖片（數字是 media.js 的編號，說明可省略） |
| `[v 123 說明]`、`[a 123 說明]` | 影片、音訊 |
| `[3d 123 說明]` | 3D 模型（.glb）：先顯示「點一下載入」按鈕，點了才下載，讀者可以拖曳旋轉、縮放。寬高比照 `data/media.js` 寫的比例 |
| `:::compare` … `:::` | 前後比較（拖曳分隔線）：前兩行寫 `[i 編號 Before]`、`[i 編號 After]`（左＝修改前、右＝修改後），可再用 `?? Prompt(After)` 加一段可展開的提示詞；框的比例跟左圖一樣，也可寫 `:::compare 3:4` |
| `[embed 網址 說明]` | 嵌入其他網頁（目前沒有文章使用） |
| `:::tip 標題` … `:::` | 綠色提示框；`:::warn` 黃色警告；`:::note` 灰色說明 |
| `:::steps` … `:::` | 編號步驟，每一步用 `@ 步驟標題` 開頭 |
| `:::row` … `:::` | 並排，每一欄用一行 `\|\|\|` 隔開 |
| `:::details 標題` … `:::` | 可展開的段落（適合長提示詞、歌詞） |
| `:::faq` … `:::` | 常見問題，每題用 `?? 問題` 開頭 |

容器可以互相包，例如步驟裡放並排圖片。

前後比較的例子（圖片和網站其他圖片一樣放在 `assets/media/`，不需要外部服務或上傳權限）：

```
:::compare
[i 585 Before]
[i 588 After]
?? Prompt(After)
把燈籠改成南瓜燈
:::
```

## 圖片與影片

### 3D 模型（.glb）

- 檔案放法和圖片一樣（例如 `assets/media/models/m-3d-01.glb`），在 `data/media.js` 加一行 `["models/m-3d-01.glb", 1.5]`，文章寫 `[3d 編號]`。
- 每個檔案盡量在 **10 MB 以內**（Pixal3D 用「高相容」或 2K 材質匯出）。不要用 Draco／KTX2 壓縮的 GLB：解壓程式要從 Google 網站下載，公司內部網路可能連不到。
- 檢視程式是 Google 的 model-viewer 4.4.0（Apache-2.0），檔案在 `assets/vendor/model-viewer.min.js`，只有讀者點了按鈕才會載入。更新版本時，從 `https://cdn.jsdelivr.net/npm/@google/model-viewer@<版本>/dist/model-viewer.min.js` 下載換掉即可。
- 編輯後台目前只能上傳圖片；3D 檔和影片一樣，要由平台組放進網站檔案。

### 分類與命名規則

文章裡一律用**編號**引用（`[i 123]`），編號一旦用了就不要改。檔案依網站區域放在 `assets/media/` 的資料夾裡，檔名是「文章代號-序號」：

```
assets/media/<區域資料夾>/<文章代號>-<序號>.<副檔名>
例：assets/media/image/img-basics-03.webp　→　「圖片生成」區、img-basics 這篇的第 3 張
```

| 資料夾 | 區域 |
| --- | --- |
| `start` | 開始使用 |
| `chat` | 交談 |
| `image` | 圖片生成 |
| `video` | 影片生成 |
| `lab` | 實驗室 |
| `recipes` | 應用範例 |
| `models` | 模型指南 |
| `team` | 團隊管理 |
| `support` | 支援 |
| `unused` | 暫時沒有文章用到的檔案 |

- 檔名只用英文小寫、數字和 `-`，不用空白和中文。
- 序號兩位數（01、02…），新圖接在那篇目前最大的序號後面；之後調整文章順序不必改檔名。
- 圖片轉成 WebP、寬度不超過 1600px；影片用 H.264 的 MP4，最長邊不超過 1280px；音訊用 MP3。
- 找圖：編輯後台的「圖庫」可以依區域、類型篩選，用編號、檔名、頁面、段落標題或圖片說明搜尋；插入圖片和前後比較的對話框也能直接「從圖庫挑選」。
- 正式版的編輯後台上傳圖片時，會依這個規則自動命名、自動給編號。

### 手動新增一張圖

1. 依上面的規則命名，例如 `image/img-basics-12.webp`，放進 `assets/media/image/`。
2. 在 `data/media.js` 用一個沒用過的編號加一筆：`600:["image/img-basics-12.webp",1.5]`，第二個數字是寬 ÷ 高，讓圖片載入前先保留位置，頁內跳轉才不會跑掉。
3. 文章裡寫 `[i 600 說明文字]`。

`node server/test.js` 會檢查每個文章引用的編號都有對照、檔案都存在、檔名符合命名規則，而且資料夾裡沒有對照表以外的檔案。

## 發布更新時

`index.html`、`admin.html`、`edit.html` 引用的 css、js 檔名後面有版本號（例如 `script.js?v=20261106m`）。每次更新內容後把版本號改掉，GitHub Pages 的訪客才會抓到新版，而不是用快取的舊檔。

## 回饋與後台

文章底部「這篇有幫助嗎？」和「意見回饋」頁（`#feedback`）的資料，依 `config.js` 送到下面其中一個地方：

1. **Google 試算表**（`googleScriptUrl` 有填網址時）：存進公司 Google 帳號雲端硬碟的一份試算表，設定步驟見 [`google-apps-script/README.md`](google-apps-script/README.md)。後台用 Apps Script 指令碼屬性 `ADMIN_TOKEN` 當密碼讀取；也可以直接打開試算表看。
2. **網站自己的伺服器**（沒填網址、部署在公司內部時）：`server/server.js` 的 `/api/feedback`，存成 `DATA_DIR`（預設 `.data/`）裡的 `feedback.jsonl`。
3. **預覽模式**（兩者都沒有，例如目前的 GitHub Pages）：見下方。

回饋後台若看到標示「英文版」的舊回饋，是英文版移除前送出的。

- 後台在 `admin.html`（只有中文）。存在伺服器時，讀取回饋要密碼：伺服器設了環境變數 `ADMIN_TOKEN` 就用它；沒設時只有在伺服器那台電腦本機（127.0.0.1）打開才看得到。
- **GitHub Pages 預覽版沒有伺服器**：回饋改存在送出者自己的瀏覽器，後台顯示示範資料加上這台電腦送出的回饋，方便展示流程，但收不到別人的回饋。
- 在自己電腦試真的流程：`node server/server.js`，打開 http://localhost:8080 送幾則，再開 http://localhost:8080/admin.html。

部署到公司內部時不用管這個版本號：`server/server.js` 啟動時會自動換成檔案內容的雜湊。

## 編輯後台

網址是說明中心後面加 `edit.html`。同一份程式，依有沒有伺服器分成兩種：伺服器回應 `/api/me` 就是正式版，否則是示範版。

### 正式版（公司網站）

- **公司帳號登入**：`vibe.yaml` 的 `auth.mode: oidc`，網站自己當 OIDC client（`server/editor.js`，授權碼流程＋PKCE，請求 `employee_number`）。平台部署時自動注入 `OIDC_ISSUER`、`OIDC_CLIENT_ID`、`OIDC_CLIENT_SECRET`。只有編輯後台要登入，說明中心照常不用。登出只登出本站，公司帳號維持登入。
- **誰能編輯**：`server/owners.json` 的員工編號永遠是主管理員（不能在後台移除，改了要重新部署）；其他人由主管理員在「編輯者名單」新增。權限判斷都在伺服器。
- **內容存在伺服器**：`DATA_DIR`（部署時是 `/app/storage`，`vibe.yaml` 的 persistence）裡的 `content.json`。第一次啟動時從 `data/*.js` 複製；之後說明中心讀伺服器產生的 `/content.js`（`index.html` 裡 `<!-- content -->` 那段會被換掉），存檔後立刻生效。
- **上傳圖片**：瀏覽器先縮到 1600px 寬、轉成 WebP，伺服器依命名規則取檔名（`區域/文章代號-序號.webp`）、給新編號，存在 `DATA_DIR/media/`，網址和程式附的圖片一樣是 `assets/media/...`。目前只能傳圖片。
- **草稿**：頁面勾選「草稿，先不公開」就只在後台看得到（`draft: true`，`model.js` 的 `toSite` 會跳過），全部列在「草稿箱」分頁。公開的頁面連到草稿，儲存時會提醒。
- **儲存前檢查**：儲存單頁時檢查缺圖與壞連結（`model.js`），「檢查與備份」分頁可以檢查全站。
- **兩人同時修改**：每次存檔都帶版本號，版本不對伺服器回 409，後台會載入最新內容、請使用者再做一次（正在編輯的文字會保留）。
- **備份**：「檢查與備份」分頁下載整個網站（內容＋上傳的圖片）的 JSON 檔；主管理員可以用它還原。persistence 不是備份。
- **本機試正式版**：`DEV_LOGIN=1 EDITOR_OWNERS=T0001 node server/server.js`，打開 http://localhost:8080/edit.html，用員工編號 T0001 登入（假登入，有 OIDC 設定時自動關閉）。內容存在 `.data/`，刪掉就回到 `data/*.js` 的內容。

### 示範版（GitHub Pages）

給主管看編輯流程用。

- **登入是模擬的**：選一個身分登入（主管理員、編輯者、沒有權限的同事），看不同權限會看到什麼。
- **修改不會生效**：所有修改只存在這台電腦的瀏覽器（localStorage `ml-editor-demo`），說明中心的內容完全不受影響。頁面上方的「清除示範資料」可以回到說明中心目前的內容。
- 第一次打開時，從 `data/*.js` 與 `data/sections.js` 複製一份內容來編輯；預覽用 `markup.js`，和說明中心長得一樣。
- 上傳的圖片會縮到 1600px 寬、轉成 WebP，示範版存在瀏覽器裡（容量有限，大約只放得下十幾張截圖）。

## 部署到公司內部

- 本機測試：`docker compose up --build`，打開 http://localhost:8080
- 測試：`node server/test.js`（不需要安裝任何套件）
- 說明中心不需要登入、網址對外公開；只有編輯後台要公司帳號登入（`vibe.yaml` 的 `auth.mode: oidc`）。
- 內容、上傳的圖片、回饋存在 persistence 磁碟（`vibe.yaml` 的 `mount_path: /app/storage`，`Dockerfile` 的 `DATA_DIR`）。不能掛在 `/app/data`，那是程式附的文章資料夾。
- 推到公司 Gitea 的預設分支後，CI 會自動測試、建置並部署。
