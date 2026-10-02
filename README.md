# VibeCodingMatch-3Game
Vibe Coding Match-3 Game：單頁產品介紹與可玩的節奏三消 DEMO，採未來科技霓虹視覺，保留核心玩法、世界觀、商業模式、亮點與開發里程碑。

## 試玩 DEMO

直接用瀏覽器開啟 `index.html`，點選「立即試玩 DEMO」及「開始挑戰」。無需安裝套件、建置或啟動伺服器。

- 點選兩顆相鄰方塊交換，橫向或直向三顆以上同色即可消除；無效交換會復原。
- 方塊自動掉落、補位與連鎖消除；沒有合法步數時自動洗牌。
- 每局 60 秒，每顆 10 分，連鎖依輪數加倍；100 BPM 節拍綠燈時完成有效交換，整串連鎖額外 ×2。
- 提供提示、重新開始，支援滑鼠、手機觸控與方向鍵／Enter／空白鍵。
- 按下「開始挑戰」後預設播放 100 BPM 合成背景音樂，以及開始、選取、無效交換、消除／連鎖和結算音效；音樂與音效可獨立開關，音量可調整到零。
- 開啟頁面時不自動播放；挑戰結束或切換分頁時停止背景音樂，重新開始會清除前局聲音。
- 本版沒有 AI 對戰、角色技能或社群服務；介紹區的相關內容為產品規劃。

## 驗證

需 Node.js 22 以上，不需要第三方測試套件：

```powershell
node --test tests/match3.test.cjs
node tests/browser-smoke.cjs
git diff --check
```

瀏覽器測試預設使用 Windows 安裝的 Chrome 或 Edge；其他路徑可透過 `BROWSER_PATH` 指定 Chromium 執行檔。測試涵蓋實際鍵盤、點擊與觸控、重新開始、60 秒倒數及 1280／390／360px 排版，約需 65 秒。使用 OfflineAudioContext 實際渲染音樂與音效，檢查聲音訊號、靜音和停止；另驗證第一次點擊開始才啟用 AudioContext、獨立聲音開關與音量控制。截圖保存在系統暫存目錄，測試的瀏覽器設定檔會自動清理。

DEMO 使用原生 HTML/CSS/JavaScript、系統字型、文字形狀及自行編寫的 Web Audio 合成音樂與音效。旋律、低音、和弦與打擊音均由程式即時產生，不引用外部音樂、音效或字型資產；程式碼沿用專案 MIT 授權。

![image-01](./images/image-01.png)

# Documentation
- 於 openspec/project.md:1 填寫專案目的、技術堆疊、程式風格、測試與 Git 流程、領域背景與限制，建立後續作業共識。
- 在 AGENTS.md:1 保留 OpenSpec 區塊並新增具體代理指引、工作流程與交付檢查清單，確保未來協作遵循相同準則。

DEMO 功能規格與實作清單位於 `openspec/changes/add-playable-demo/`。
