# moonland.ai 說明中心　維護手冊

給**接手維護的人**：網站負責人，以及公司平台組的工程師。
同事（編輯者）的操作說明不在這裡，而是在編輯後台的「使用說明」分頁（`edit.html#help`）。

> 狀態（2026-11-02）：目前是**預覽版**，放在 GitHub Pages 給主管審核，還沒部署到公司網站。正式版編輯後台已完成，公司帳號登入要等第一次部署後實測。
> 上線後不再用 AI 維護，所以上線前要把下面〈上線前清單〉做完。
> 本手冊與 `README.md` 分工：README 是寫法參考（檔案、文章語法、命名規則）；本手冊講怎麼營運、出問題怎麼查、還缺什麼。

---

## 1. 基本資料（上線時填寫）

| 項目 | 內容 |
| --- | --- |
| 網站負責人 | （填姓名、員工編號） |
| 預覽網址 | https://r-ty-m1.github.io/moonland-docs/ （上線後停用） |
| 正式網址 | `https://<應用名稱>-vibe.moonshine-studio.net/`（應用名稱在第一次部署時決定） |
| 程式碼 | 公司 Gitea：（填 repository 網址）。目前還在 GitHub `r-ty-m1/moonland-docs` |
| 部署平台 | MoonShine vibe 平台（Gitea Actions → Deployment API → 中央 CD） |
| 回饋存放 | Google 試算表（擁有者：　　），或網站伺服器，見〈5. 回饋〉 |
| 編輯後台 | `/edit.html`；主管理員：（填，員工編號也要寫進 `server/owners.json`） |
| 回饋後台 | `/admin.html`；密碼保管人：（填） |

---

## 2. 網站怎麼組成

前端是靜態檔，加一支沒有相依套件的小伺服器，不需要建置步驟、不需要 `npm install`。

```
訪客瀏覽器
  │  index.html（說明中心）／edit.html（編輯後台）／admin.html（回饋後台）
  │  ├─ /content.js       伺服器產生：文章、目錄、媒體對照表（編輯後台存的內容）
  │  ├─ markup.js         文章標記語法 → 畫面（說明中心、編輯後台共用）
  │  ├─ model.js          內容格式轉換、缺圖與壞連結檢查（編輯後台、伺服器共用）
  │  └─ assets/media/     圖片、影片、音訊（程式附的 ＋ 後台上傳的）
  ▼
server/server.js（Node 22，只用內建模組）
  ├─ 提供上面的檔案；css/js 網址自動加內容雜湊，部署新版時不怕快取
  ├─ GET  /healthz          健康檢查（平台與 Docker HEALTHCHECK 用）
  ├─ POST/GET /api/feedback 收回饋、讀回饋（沒設定 Google 試算表時才會用到）
  └─ server/editor.js       編輯後台：公司帳號登入、/api/editor/*（讀寫內容、上傳、備份、還原）
        │
        ▼
     DATA_DIR（部署時 /app/storage，vibe.yaml 的 persistence）
        ├─ content.json     目錄、頁面、版本紀錄、修改紀錄、最近刪除、編輯者名單
        ├─ media.json       後台上傳的圖片對照表；檔案在 media/<區域>/<文章代號>-<序號>.webp
        ├─ session-secret   登入 cookie 的簽章金鑰（自動產生，刪掉會讓所有人登出）
        └─ feedback.jsonl   回饋（沒用 Google 試算表時）
```

### 內容以伺服器為準（重要）
- 伺服器**第一次啟動**（`DATA_DIR` 裡沒有 `content.json`）時，把程式附的 `data/*.js` 複製成 `content.json`。之後說明中心只讀 `content.json`。
- 所以上線後**改 `data/*.js` 不會影響公司網站**，內容一律在編輯後台改。`data/*.js` 只是初始內容，也是 GitHub Pages 預覽版的內容。
- 要讓公司網站整個回到 `data/*.js` 的內容：先在後台下載備份，再請平台組刪掉 `DATA_DIR/content.json` 並重啟容器。

### 公司帳號登入
- `vibe.yaml` 宣告 `auth.mode: oidc` 與 `callback_path: /api/auth/callback/authentik`。平台部署時自動在 Authentik 建立 client，注入 `OIDC_ISSUER`、`OIDC_CLIENT_ID`、`OIDC_CLIENT_SECRET`，不用手動設定。
- `server/editor.js` 自己做 OIDC 授權碼流程＋PKCE，請求 `employee_number` scope；登入後用簽章過的 cookie（12 小時）記住身分。只有編輯後台和 `/api/editor/*` 要登入，說明中心不用。
- 「登出」只登出本站，公司帳號（SSO）維持登入。沒有做「登出公司帳號」。
- 權限：`server/owners.json` 的員工編號永遠是主管理員；其他人看 `content.json` 裡的編輯者名單（主管理員在後台維護）。判斷都在伺服器。
- 本機測試：`DEV_LOGIN=1` 會改用「輸入員工編號」的假登入；有 `OIDC_*` 設定時一律關閉。`EDITOR_OWNERS`（逗號分隔）可以臨時加主管理員，只給測試用。

- 檔案清單、文章語法、圖片命名規則：看 `README.md`。
- 只有列在 `server/server.js` 的 `PUBLIC` 白名單裡的路徑會對外提供，其他（`server/`、`README.md`、`Dockerfile` 等）一律 404。新增前端檔案時要記得加進白名單。

---

## 3. 發布與回復

### 發布
1. 改好檔案，在自己電腦跑 `node server/test.js`，全部打勾才推。
2. 推到 Gitea 預設分支。CI（`.gitea/workflows/ci.yaml`）會依序：跑測試 → 建置 Docker 映像 → 啟動容器確認 `/healthz` 正常 → 交給平台部署。
3. 在 Gitea 的 Actions 頁面看結果，綠色代表已部署。

### 出問題時回復
- 最快的方法：在 Gitea 把出問題的那次 commit **revert**（產生一個反向修改）再推上去，CI 會部署回前一版的內容。
- 不要用 force push 改寫歷史。

### 注意
- `ci.yaml` 由公司範本產生，**不要手動改**；平台契約變動時請平台組協助重新產生。
- `vibe.yaml` 記錄 Port、健康檢查、登入模式、儲存需求。改登入或儲存設定前先找平台組確認。
- GitHub Pages 預覽版沒有伺服器，所以要手動換 `?v=` 版本號（見 README〈發布更新時〉）；公司網站由伺服器自動處理，不用管。

---

## 4. `node server/test.js` 會檢查什麼

| 訊息 | 意思與處理方式 |
| --- | --- |
| 找不到媒體：123 | 文章引用了 `[i 123]`，但 `data/media.js` 沒有 123，或檔案不在 `assets/media/`。補檔案或改正編號。 |
| 媒體檔名不符合命名規則 | 檔名要是 `區域資料夾/文章代號-序號.副檔名`，見 README〈分類與命名規則〉。 |
| assets/media 裡有對照表沒有的檔案 | 放了檔案卻沒登記到 `data/media.js`。登記它，或刪掉不用的檔案。 |
| 這些站內連結找不到目標 | 文章裡的 `[文字](#頁面代號)` 指到不存在的頁面，或 `#h-錨點` 在那篇找不到。改正連結，或補上錨點。 |
| 伺服器、回饋相關失敗 | `server/server.js` 被改壞了，回復最近的修改。 |
| 編輯後台相關失敗 | `server/editor.js` 或 `model.js` 被改壞了（登入、權限、存檔、上傳、備份），回復最近的修改。 |
| 公司帳號登入相關失敗 | 用模擬的 Authentik 測登入流程失敗，`server/editor.js` 的登入部分被改壞了。 |

CI 也會跑同一支測試，沒通過就不會部署。

---

## 5. 回饋（「這篇有幫助嗎？」與意見回饋頁）

依 `config.js` 的 `googleScriptUrl` 決定存哪裡：

- **有填網址**：存進 Google 試算表。設定步驟見 `google-apps-script/README.md`。改了 `Code.gs` 之後，一定要在 Apps Script 按「部署 → 管理部署作業 → 編輯 → 新版本」，否則還是跑舊程式。
- **沒填網址**：存在網站伺服器的 `DATA_DIR/feedback.jsonl`（persistence 已開，部署不會清空）。讀取要 `ADMIN_TOKEN` 密碼，要在平台設定這個環境變數。
- 回饋類型代號（stuck／unclear／suggest／other）在 `script.js`、`admin.js`、`server/server.js`、`google-apps-script/Code.gs` 四處要一致。

2026-10-30 時試算表還沒建立，`googleScriptUrl` 是空的。

---

## 6. 常見問題排查

| 狀況 | 先檢查 |
| --- | --- |
| 整個網站打不開 | 打開 `/healthz` 有沒有回 `ok`；Gitea Actions 最近一次是否失敗；找平台組看容器狀態。 |
| 某張圖不見 | 後台「檢查與備份」跑一次全站檢查；程式附的圖看 `data/media.js`，後台上傳的看 `DATA_DIR/media.json` 與 `DATA_DIR/media/`。 |
| 改了 `data/*.js` 但公司網站沒變 | 正常。上線後內容以伺服器的 `content.json` 為準，請在編輯後台改（見〈2. 內容以伺服器為準〉）。 |
| 後台存檔後說明中心沒變 | 瀏覽器按 Ctrl+F5；看伺服器 log 有沒有「編輯後台錯誤」。 |
| 按「用公司帳號登入」出現錯誤頁 | 「還沒接上公司帳號登入」：`vibe.yaml` 沒有 `auth.mode: oidc` 或部署時沒注入 `OIDC_*`。「登入暫時無法完成」：連不到 Authentik，看伺服器 log。Authentik 顯示 redirect URI 不符：確認網址與 `callback_path` 一致。 |
| 登入後顯示「沒有編輯權限」 | 員工編號不在名單上。請主管理員在後台加入；主管理員本人要寫在 `server/owners.json`。 |
| 存檔時一直說「其他人剛剛也改了內容」 | 有人同時在改。重新整理頁面再存一次。 |
| 誤刪或改壞很多內容 | 單頁用「版本紀錄」、刪除的頁用「最近刪除」；整站用備份檔在「檢查與備份」還原（主管理員）。 |
| persistence 資料不見了 | 用最近一次下載的備份檔還原；沒有備份時，網站會回到 `data/*.js` 的初始內容。 |
| 收不到回饋 | `config.js` 的網址是否正確、Apps Script 是否部署了最新版本、試算表是否還在。 |
| 回饋後台讀不到資料 | 密碼（`ADMIN_TOKEN`）是否正確；Google 試算表模式下密碼在 Apps Script 的「指令碼屬性」。 |
| 公司網路看不到某些內容 | 文章裡若有 `[embed 外部網址]`，外部網站被擋就看不到。目前沒有文章使用。 |
| 手機上版面跑掉 | 字級要用 `rem`；手機版斷點是 620px；用 360、390 寬加三種字體大小測。 |

---

## 7. 常見修改要動哪裡（需要會改程式的人）

| 要做的事 | 檔案 |
| --- | --- |
| 改配色、字型、版面 | `style.css`（深色是 `:root`，淺色在下方兩段，兩邊都要改）。字級一律 `rem`。 |
| 改左側目錄、分類 | `data/sections.js` |
| 改文章 | 公司網站：編輯後台。GitHub Pages 預覽版：`data/<區域>.js`，語法見 README |
| 新增文章語法（例如新的區塊） | `markup.js`，說明中心與編輯後台會同時生效；再補 README 語法表與後台「寫法說明」 |
| 介面文字 | 直接寫中文，外面包 `T()`（保留給日後多語言用） |
| 編輯後台 | 畫面：`edit.html`、`edit.js`、`edit.css`；伺服器：`server/editor.js`；共用：`model.js` |
| 主管理員 | `server/owners.json`（改完要重新部署） |
| 回饋後台 | `admin.html`、`admin.js`、`admin.css` |

### 英文版
2026-10-30 已移除，網站只有中文。舊的英文版（48 篇翻譯與語言切換）保留在 git 標籤 `english-version`，日後要恢復時從那裡取，並需要有人負責翻譯維護。

---

## 8. 上線前清單

上線後不再用 AI 修改，以下項目要在上線前完成或有人認領。

### 已完成
- [x] 所有媒體搬進網站，不依賴 Notion
- [x] 圖庫依區域分資料夾、建立命名規則，測試會自動檢查
- [x] 前後比較改成網站內建，不再嵌入外部 GitHub 工具
- [x] 部署設定（`Dockerfile`、`vibe.yaml`、`ci.yaml`）已備好
- [x] 編輯後台示範版（模擬登入、編輯、圖庫、版本紀錄、編輯者名單）
- [x] 正式版編輯後台（2026-11-02）：公司帳號登入、員工編號名單、內容存伺服器、上傳自動命名、儲存前檢查、兩人同時修改的保護、備份與還原。GitHub Pages 上自動維持示範版

### 部署
- [ ] 主管審核預覽版
- [ ] 推到公司 Gitea，第一次由 CI 建置。容器映像**還沒實際建置驗證過**，第一次要看 CI 結果
- [ ] 決定應用名稱（會成為網址的一部分），填進〈1. 基本資料〉
- [ ] 決定是否保留 `noindex`（目前不讓搜尋引擎收錄）

### 回饋
- [ ] 建立 Google 試算表、部署 Apps Script、把網址填進 `config.js`，或改用伺服器存放（要開 persistence）
- [ ] 指定回饋後台密碼保管人

### 正式版編輯後台
- [ ] **填主管理員**：把網站負責人的員工編號寫進 `server/owners.json` 的 `owners`（目前是空的，沒填就沒人能管理名單）
- [ ] **第一次部署後實測公司帳號登入**：登入、登出、不在名單上的人看到「沒有編輯權限」。程式已用模擬的 Authentik 測過，但真的 Authentik 只能部署後測
- [ ] **部署後實測存檔與上傳**：改一頁、傳一張圖，確認說明中心立刻更新；再重新部署一次，確認內容和圖片還在（persistence 有效）
- [ ] **備份**：平台的 persistence **不是備份**。問平台組是否有定期備份；並指定一個人每月在後台下載備份檔，存到公司雲端硬碟
- [ ] **圖片存放位置**：目前後台上傳的圖存在 persistence。平台建議新的上傳功能用 S3（`storage: s3`）；圖片量不大時 persistence 也可以，改用 S3 需要另外開發
- [ ] 目前後台只能上傳圖片；影片、音訊要由會改程式的人放進 `assets/media/`、登記到 `data/media.js`（用沒用過的編號，不要跟後台上傳的撞號），重新部署後就能在後台用編號引用。注意 `data/media.js` 是每次啟動都會讀的，和文章不同

### 內容與交接
- [x] 英文版：決定移除（2026-10-30）
- [ ] 補「登月幣工具」頁內容（Notion 原稿是空的）
- [ ] 確認多圖編輯張數上限（Notion 原稿有 3 張與 9 張兩種說法，網站寫 9 張）
- [ ] 跟同事走一次編輯後台「使用說明」，確認看得懂
- [ ] 填好〈1. 基本資料〉，把本手冊交給平台組與網站負責人
