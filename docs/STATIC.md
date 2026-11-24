# 靜態版（放到 moonland.ai 網域）

2026-11-23 和工程師討論的做法：

- **編輯後台照舊**：同事在公司網站（https://moonland-docs-vibe.moonshine-studio.net/edit.html）編輯、存檔、公開。
- **網站負責人打包**：在自己電腦跑一次打包程式，把「已公開的內容」包成沒有伺服器的純靜態網站。
- **推到靜態版的 GitHub repo**（`MoonShineVFX/moonland-docs-site`，私人）：工程師從這個 repo 放上 moonland.ai。之後更新也只要重新打包、推上去。
- **正式網址**：https://docs.moonland.ai （2026-11-24 上線）

## 打包會做什麼

程式是 `tools/build-static.js`，只用 Node，不用安裝套件。

| 項目 | 做法 |
|---|---|
| 內容 | 讀公司網站的 `/content.js`：只有已公開的頁面，草稿、封存、英文草稿都不會出現 |
| 3D 模型 | 拿掉（每個 12～22 MB），連同介紹 3D 範例的段落（規則在程式最上面的 `STATIC_EDITS`） |
| 圖片 | 一律 WebP；後台上傳的 PNG、JPG 會轉成 WebP |
| 影片 | 重新壓縮（寬度最多 1280）；壓完沒有變小就用原檔 |
| 音樂 | 壓到 96 kbps |
| 媒體 | 只放公開頁面用得到的（草稿用的圖不會帶進去） |
| 意見回饋、「有幫助嗎」投票 | 直接送 Google 試算表（`config.js` 的 `googleScriptUrl`），不經過公司網站 |
| 吉吉問卷 | 和公司網站一樣，第一次來會跳出來；答案送到 Google 試算表的「問卷」分頁（不在編輯後台的「訪客問卷」統計裡） |
| 閱讀流量 | 不記 |
| 領取體驗帳號（`#trial`） | 直接送「體驗帳號」Google 試算表（`config.js` 的 `trialScriptUrl`，見 `trial-apps-script/README.md`）；沒填網址就不顯示 |
| 編輯後台、回饋後台、伺服器程式 | 不放 |
| 公司網址 | **成品裡不能出現**（moonshine-studio.net 等）。有人在文章裡貼了公司網址，打包會停下來、不推送，並列出在哪裡 |

**為什麼不連公司網站**：換到 moonland.ai 的目的，就是讓公司外的人沒有任何方式連到公司網域（使用者 2026-11-23）。所以靜態版完全不連 moonshine-studio.net；讀者只會連到 moonland.ai、Google Fonts 和 Google Apps Script（回饋、投票、問卷）。打包時會讀公司網站的內容，但那是在網站負責人自己的電腦上做。

2026-11-23 第一次打包：原本 221 MB，打包後約 85 MB（影片 30 MB、音樂 28 MB、圖片 27 MB）。

壓過的檔案存在 `static-cache` 資料夾（在 repo 旁邊）。第二次以後只壓新的，一兩分鐘就好。**不要刪這個資料夾**；刪了也沒關係，只是下次要重壓。

## 每次更新

在 repo 資料夾（`F:\RD\Moonland\moonland-docs\repo`）打開終端機：

```powershell
node tools/build-static.js --push
```

畫面最後出現「已推送」就完成了。內容沒有變的話會顯示「內容和上次一樣」，不會推送。

- **只想先看看、不推送**：拿掉 `--push`。打包好的網站在 `F:\RD\Moonland\moonland-docs\moonland-docs-site`，用 `python -m http.server 8091 -d ..\moonland-docs-site` 開，再用瀏覽器打開 http://localhost:8091。
- **出現 ⚠ 提醒**：照提醒做。最常見的是「找不到要拿掉的段落」：有人改了「點數 3D 模型」那篇的文字，打開 `tools/build-static.js`，把 `STATIC_EDITS` 裡的文字改成新的。
- **找不到 ffmpeg**：影片和音樂會用原檔，網站一樣能用，只是比較大。程式會自動借用電腦裡其他軟體附的 ffmpeg（例如 Topaz、Red Giant）；要自己裝的話，裝好後重開終端機再跑一次。

## 第一次設定（已完成：https://github.com/MoonShineVFX/moonland-docs-site，私人）

2026-11-23 先放在個人帳號 `r-ty-m1/moonland-docs-site`（公開），2026-11-24 改到公司 GitHub 組織 MoonShineVFX（私人）。輸出資料夾的 `origin` 已改成新網址。推送要用有這個 repo 寫入權限的 GitHub 帳號。

換電腦或重新設定時才需要：

1. 在 GitHub 建一個新的 repo，`moonland-docs-site`（不要勾「Add a README」，要空的）。
2. 打包一次（不推送）：`node tools/build-static.js`
3. 把輸出資料夾變成 git repo，接到剛建的 GitHub repo：

```powershell
cd ..\moonland-docs-site
git init -b main
git add -A
git commit -m "說明中心靜態版"
git remote add origin https://github.com/MoonShineVFX/moonland-docs-site.git
git push -u origin main
```

之後每次就只要 `node tools/build-static.js --push`。

## 給工程師

輸出資料夾裡的 `README.md` 也有寫，摘要如下：

- 純靜態，根目錄 `index.html` 就是首頁；網址用 `#文章代號` 切換，不需要改寫規則。
- 不會連到公司內部的任何網址；對外連線只有 Google Fonts（字型）與 Google Apps Script（意見回饋、投票、吉吉問卷）。
- Google Apps Script 的部署要設成「誰可以存取：任何人」，否則外面的讀者送不出回饋（回饋頁會顯示「送出失敗」）。
- 快取建議：`index.html`、`content.js` 每次確認更新（`Cache-Control: no-cache`）；css／js 網址帶內容雜湊、`assets/media/` 的檔名不重複使用，可以長時間快取。

## 之後要注意

- 靜態版的內容**不會自動更新**：同事在後台改完，要有人打包、推送才會出現在 moonland.ai。
- 公司網站只給編輯用：它停了不影響 moonland.ai 上的靜態版，只是暫時不能編輯、打包。
- 靜態版的回饋只進 Google 試算表：回饋後台（讀試算表）看得到，但不會有 Zulip 通知；閱讀流量與後台的問卷統計只算公司網站本身的訪客；靜態版讀者的問卷在試算表「問卷」分頁。
- 英文版：同事在後台取消「英文草稿」之後，下次打包就會帶進去。
