## 1. Implementation
- [x] 1.1 建立並驗證核心規則的失敗測試。
- [x] 1.2 實作三消、有效交換、補位、可走步與節奏計分。
- [x] 1.3 在首頁整合遊戲介面、計時、重新開始與輸入控制。
- [x] 1.4 驗證核心測試、桌機與手機畫面及實際遊玩。
- [x] 1.5 更新文件、CHANGELOG 與任務狀態，通過 diff 檢查。

## 2. Validation
- `node --test tests/match3.test.cjs`：9 項通過。
- `node tests/browser-smoke.cjs`：桌機點擊、鍵盤、手機觸控、無效交換復原、連鎖中重新開始、音效開關、實際 60 秒倒數及到期重玩通過，無 JavaScript 執行錯誤。
- 已檢視 1280px 與 360px 截圖；1280／390／360px 無橫向溢出。
- `git diff --check`：通過。
- 本機沒有 OpenSpec CLI，未執行 `openspec validate --strict`；規格的 ADDED Requirements 與 Scenario 結構已人工檢查。
