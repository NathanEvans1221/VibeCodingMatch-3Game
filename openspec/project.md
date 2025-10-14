# Project Context

## Purpose
提供「Vibe Coding Match-3」遊戲相關的靜態宣傳與說明資源，聚焦於呈現核心玩法、世界觀、商業模式與開發節點，協助利害關係人快速理解產品定位。

## Tech Stack
- 靜態 HTML5 / CSS3 (無前端框架預設)
- 可選用原生 JavaScript 進行互動強化
- 向量圖與影像資產採用開源或內製設計

## Project Conventions

### Code Style
- 採用語意化 HTML 標籤，配合固定的段落區塊 (`header`, `section`, `footer`)
- CSS 以自訂屬性 (CSS Variables) 管理色票與間距，命名採描述式 (e.g. `--accent-secondary`)
- 避免引入未使用的 JS/CSS 套件，維持頁面載入輕量

### Architecture Patterns
- 首頁為單頁式結構 (`index.html`)，區塊順序依敘事流安排：願景 → 玩法 → 市場 → 里程碑
- 若需擴充其他頁面，以 `/docs` 或子資料夾區隔，並在主頁提供導覽連結
- 顏色、字體等主題設定統一於 `:root` 中集中配置，便於切換風格

### Testing Strategy
- 主要採人工檢視：確認在桌機與行動裝置 (≥360px 寬) 上的排版與色彩對比
- 重要互動元件 (如 CTA 錨點) 需測試滾動定位與焦點樣式
- 使用瀏覽器內建無障礙檢測工具檢查對比度與結構 (Heading 層級、替代文字)

### Git Workflow
- 以 `main` 作為發佈分支；新功能或調整建議建立功能分支 `feature/<description>`
- Commit 訊息使用動詞起始的英文短句 (e.g. `Add neon styling to hero section`)
- 合併前請自我檢查 HTML/CSS 是否通過 W3C 驗證 (可使用線上驗證器)

## Domain Context
- 遊戲類型：節奏融合的科幻主題三消 (Match-3 Rhythm Puzzle)
- 核心訴求：節奏同步、AI 競技、社交互動、創作者工坊
- 目標族群：18-34 歲，愛好音樂與輕度競技的玩家
- 商業模式：季票、造型、合作曲包與玩家共創分潤

## Important Constraints
- 頁面需呼應「未來科技」風格：深色背景、霓虹藍紫系、玻璃質感
- 維持良好載入效能，避免未壓縮的大型多媒體資源
- 字型需選擇系統字體或具有授權的開源字體 (建議 `Segoe UI`, `Noto Sans TC`)
- 所有中文內容採繁體中文

## External Dependencies
- 無必要第三方服務；若嵌入影片或分析工具，須事先確認隱私與授權要求
