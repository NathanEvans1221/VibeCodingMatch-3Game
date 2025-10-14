<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Agent Guide

- **Single-Page Site First**：所有公版內容預設維護於 `index.html`，以靜態 HTML/CSS 呈現，必要時才新增 JS 互動。
- **Style Alignment**：頁面需落實《STYLE.md》指示的隨機主題；若未指定則預設使用「未來科技風」的深色霓虹色票與玻璃質感。
- **語言與文案**：採繁體中文撰寫，描述需聚焦節奏化三消玩法、AI 競技、社群互動與商業策略。
- **可存取性**：標題階層需連續、CTA 元件提供焦點樣式，色彩對比遵循 WCAG AA。
- **效能考量**：避免引入大型外部框架，優先使用 CSS 變數與原生特性；若新增資產需壓縮並說明來源授權。

### 工作流程

- 建議先閱讀 `openspec/project.md` 取得最新背景，再依任務調整文案或版面。
- 修改完成後自行以瀏覽器開啟 HTML 檔案檢查桌機與行動版視覺。
- 若引入新檔案 (圖像、字型等) 請於 PR 描述或文件中註明用途與授權狀態。

### 交付檢查清單

- [ ] 文案符合產品定位並提供具體亮點/數據
- [ ] CSS/JS 無未使用段落
- [ ] 主要 CTA anchor 正常運作
- [ ] 自述文件或規格同步更新 (若涉及流程或架構調整)
