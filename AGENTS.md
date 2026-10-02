# 專案代理指南

## 工作流程與 OpenSpec 適用範圍

本專案是原生 HTML/CSS/JavaScript 的單頁產品介紹與遊戲 DEMO。流程應依變更影響決定，避免為小型可逆修改建立不必要的文件與核准階段。

以下專案規則負責判斷是否啟用 OpenSpec；下方工具管理區塊與 `openspec/AGENTS.md` 提供啟用後的操作方式。若其通用觸發條件與本節不同，以本節的適用範圍為準。保留工具管理區塊，專案政策維護在區塊外。

| 任務類型 | 執行方式 |
| --- | --- |
| 文案、樣式、響應式、無障礙、文件或規則調整 | 說明改動重點後直接實作，依影響範圍驗證 |
| 一般 Bug 修復、測試補強 | 追蹤原因並直接修正；Bug 修復補上相關回歸測試 |
| 範圍明確、可逆的小型 DEMO 或原生 JS 互動 | 簡述範圍與驗收條件後直接實作，不需另建 OpenSpec 提案 |
| 跨模組功能、架構變更、外部 API／資料結構的破壞性變更、重大效能或安全調整 | 使用 OpenSpec 提案，確認具體規格後實作 |
| 使用者明確要求 OpenSpec 提案或規格流程 | 使用 OpenSpec |

- 不因單純出現 `plan`、`change`、`spec` 或「新增功能」字詞就要求提案；先判斷實際影響。
- 閱讀 `openspec/project.md` 或既有規格以理解背景，不代表啟用完整 OpenSpec 流程。
- 需求有關鍵歧義時先釐清；若使用者已確認範圍或選擇建議方案，直接依已確認內容執行，不重複要求相同核准。
- 小型任務若發現需引入後端、帳號服務、付費、持久化資料或改變既有系統介面，重新評估影響並升級流程。
- 不新增與任務無關的設計稿、計畫文件、依賴或框架；既有 OpenSpec 文件保留，需要時才更新。
- 未啟用 OpenSpec 的任務，不將提案、CLI 驗證或歸檔列為其未完成項目。
- 啟用 OpenSpec 時，先確認 CLI 是否可用；不可用時保留可審閱提案並明確回報尚未執行的驗證，不將人工檢查宣稱為 CLI 驗證通過。

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
- **Style Alignment**：延續現有「未來科技風」的深色霓虹色票與玻璃質感；使用者要求新主題時，再參考 `STYLE.md`。
- **語言與文案**：採繁體中文撰寫，描述需聚焦節奏化三消玩法、AI 競技、社群互動與商業策略。
- **可存取性**：標題階層需連續、CTA 元件提供焦點樣式，色彩對比遵循 WCAG AA。
- **效能考量**：避免引入大型外部框架，優先使用 CSS 變數與原生特性；若新增資產需壓縮並說明來源授權。

### 工作流程

- 先閱讀與任務相關的檔案及 `openspec/project.md`，說明假設、修改範圍與可驗證的完成條件；避免啟動時全專案掃描。
- 保留既有霓虹科技風；除非使用者要求換主題，不因 `STYLE.md` 的隨機指示重新選擇風格。
- 遊戲規則修改執行 `node --test tests/match3.test.cjs`；涉及操作、計時或響應式時，再執行 `node tests/browser-smoke.cjs` 並檢視相關桌機與行動版畫面。
- 純文件或規則修改，以內容一致性與 `git diff --check` 驗證，不需重跑遊戲或瀏覽器測試。
- 若引入新檔案 (圖像、字型等) 請於 PR 描述或文件中註明用途與授權狀態。
- 更新根目錄 `CHANGELOG.md`；流程或架構改變時，同步相關說明文件。
- 提交訊息使用 `<type>(<scope>): <subject>`，主旨與內容均使用繁體中文。只有使用者要求或核准時才執行 commit／push；明確要求即為授權，不重複確認。推送前檢查分支與所有推送目的地。
- 任務完成時更新 `.agent_task_state.md`（限 50 行），以實際結果區分已完成、未驗證及後續規劃。

### 交付檢查清單

- [ ] 變更符合已確認範圍，文案與數據清楚區分實作、目標與規劃
- [ ] 程式修改沒有新增未使用的 CSS/JS，相關測試通過
- [ ] 頁面修改已確認 CTA、鍵盤焦點及桌機／行動版相關行為
- [ ] 文件與 CHANGELOG 按變更影響同步更新
- [ ] `git diff --check` 通過，暫存檔已清理，任務狀態已更新
- [ ] 只有啟用 OpenSpec 的任務，才檢查其提案、規格驗證與適用的歸檔流程
