# 靜態版（放到 moonland.ai 網域）

2026-11-23 和工程師討論的做法：

- **編輯後台照舊**：同事在公司網站（https://moonland-docs-vibe.moonshine-studio.net/edit.html）編輯、存檔、公開。
- **網站負責人打包**：在自己電腦跑一次打包程式，把「已公開的內容」包成沒有伺服器的純靜態網站。
- **推到靜態版的 GitHub repo**（例如 `moonland-docs-study`）：工程師從這個 repo 放上 moonland.ai。之後更新也只要重新打包、推上去。

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
| 回饋、吉吉問卷、閱讀流量 | 照樣送回公司網站存，編輯後台、回饋後台看得到（`config.js` 的 `apiBase`） |
| 編輯後台、回饋後台、伺服器程式 | 不放 |

2026-11-23 第一次打包：原本 221 MB，打包後約 85 MB（影片 30 MB、音樂 28 MB、圖片 27 MB）。

壓過的檔案存在 `static-cache` 資料夾（在 repo 旁邊）。第二次以後只壓新的，一兩分鐘就好。**不要刪這個資料夾**；刪了也沒關係，只是下次要重壓。

## 每次更新

在 repo 資料夾（`F:\RD\Moonland\moonland-docs\repo`）打開終端機：

```powershell
node tools/build-static.js --push
```

畫面最後出現「已推送」就完成了。內容沒有變的話會顯示「內容和上次一樣」，不會推送。

- **只想先看看、不推送**：拿掉 `--push`。打包好的網站在 `F:\RD\Moonland\moonland-docs\moonland-docs-study`，用 `python -m http.server 8091 -d ..\moonland-docs-study` 開，再用瀏覽器打開 http://localhost:8091。
- **出現 ⚠ 提醒**：照提醒做。最常見的是「找不到要拿掉的段落」：有人改了「點數 3D 模型」那篇的文字，打開 `tools/build-static.js`，把 `STATIC_EDITS` 裡的文字改成新的。
- **找不到 ffmpeg**：影片和音樂會用原檔，網站一樣能用，只是比較大。程式會自動借用電腦裡其他軟體附的 ffmpeg（例如 Topaz、Red Giant）；要自己裝的話，裝好後重開終端機再跑一次。

## 第一次設定（只做一次）

1. 在 GitHub 建一個新的 repo，例如 `moonland-docs-study`（不要勾「Add a README」，要空的）。
2. 打包一次（不推送）：`node tools/build-static.js`
3. 把輸出資料夾變成 git repo，接到剛建的 GitHub repo：

```powershell
cd ..\moonland-docs-study
git init -b main
git add -A
git commit -m "說明中心靜態版"
git remote add origin https://github.com/<帳號>/moonland-docs-study.git
git push -u origin main
```

之後每次就只要 `node tools/build-static.js --push`。

## 給工程師

輸出資料夾裡的 `README.md` 也有寫，摘要如下：

- 純靜態，根目錄 `index.html` 就是首頁；網址用 `#文章代號` 切換，不需要改寫規則。
- 回饋、問卷、閱讀流量從瀏覽器直接送到公司網站的 `/api/feedback`、`/api/survey`、`/api/view`。公司網站只允許 `moonland.ai` 與它的子網域（`server/server.js` 的 `corsOrigin`）。網址不在 moonland.ai 底下（例如測試用的 `*.pages.dev`）時要另外允許：在公司網站加環境變數 `CORS_ORIGINS`（用逗號分開），要經過 mason 的部署流程設定。
- 快取建議：`index.html`、`content.js` 每次確認更新（`Cache-Control: no-cache`）；css／js 網址帶內容雜湊、`assets/media/` 的檔名不重複使用，可以長時間快取。

## 之後要注意

- 靜態版的內容**不會自動更新**：同事在後台改完，要有人打包、推送才會出現在 moonland.ai。
- 公司網站要一直開著：編輯後台在那裡，回饋、問卷、閱讀流量也存在那裡。公司網站停了，靜態版照樣能看，只是回饋送不出去（意見回饋會改送 Google 試算表）。
- 英文版：同事在後台取消「英文草稿」之後，下次打包就會帶進去。
