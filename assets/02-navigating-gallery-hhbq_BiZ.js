var e=`# 瀏覽 Foundry Gallery

Foundry Gallery 是 FHIR 生態系中最完整的參考實作目錄。本節帶你了解如何有效地瀏覽、搜尋和評估 Gallery 中的產品。

---

## 8.2.1 存取 Foundry Gallery

**網址：** \`https://foundry.hl7.org\`

### 帳號需求

| 功能 | 需要帳號 |
|---|---|
| 瀏覽 Gallery 目錄 | 否 |
| 查看產品詳情 | 否 |
| 下載 Docker Compose 檔案 | 是 |
| 雲端啟動實例 | 是 |
| 發佈自己的產品 | 是 |

:::tip
建議先不登入瀏覽，熟悉 Gallery 後再建立帳號使用進階功能。
:::

---

## 8.2.2 Gallery 介面導覽

打開 \`https://foundry.hl7.org\` 後，你會看到以下主要區域：

### 主頁面結構

\`\`\`
┌─────────────────────────────────────┐
│  HL7 FHIR Foundry   [Login]  [Sign Up]  │
├─────────────────────────────────────┤
│  🔍 搜尋欄位                         │
│  Filters: Technology | Role | Domain │
├──────────┬──────────┬───────────────┤
│ 產品卡片  │ 產品卡片  │  產品卡片      │
│ [名稱]   │ [名稱]   │  [名稱]        │
│ [描述]   │ [描述]   │  [描述]        │
│ [標籤]   │ [標籤]   │  [標籤]        │
└──────────┴──────────┴───────────────┘
\`\`\`

### 每個產品卡片顯示

- **產品名稱**：如 "FHIR Candle" 或 "HAPI FHIR Plain Server"
- **短描述**：一兩句說明用途
- **技術標籤**：如 \`Java\`、\`.NET\`、\`Node.js\`
- **FHIR 版本徽章**：如 \`R4\`、\`R5\`
- **授權標示**：如 \`Apache 2.0\`、\`MIT\`

---

## 8.2.3 搜尋與篩選產品

### 依技術搜尋

在搜尋框輸入技術名稱，或使用 **Technology** 篩選器：

\`\`\`
常用技術標籤：
Java / .NET / C# / Python / Node.js / TypeScript / Go
\`\`\`

**範例：** 搜尋 "Java" 可以找到 HAPI FHIR、WildFHIR 等 Java 實作

### 依角色搜尋

**Role** 篩選器讓不同背景的使用者快速找到相關工具：

| 角色 | 對應工具類型 |
|---|---|
| Developer（開發者）| FHIR Server、Client Library |
| Tester（測試者）| Validator、Test Suite |
| Analyst（分析師）| Query Tool、Dashboard |
| Implementer（實作者）| IG Publisher、Profile Tool |

### 依領域搜尋

**Domain** 篩選器對應特定醫療領域：

- Clinical（臨床）
- Genomics（基因組學）
- Medications（藥物）
- Financial（財務）
- Administrative（行政管理）
- Imaging（醫學影像）

### 關鍵字搜尋技巧

\`\`\`
有效的搜尋詞：
✅ "FHIR server"     → 找 FHIR 伺服器類工具
✅ "validator"       → 找驗證工具
✅ "SMART"           → 找含 SMART on FHIR 的工具
✅ "R5"              → 找支援 FHIR R5 的工具
✅ "test"            → 找測試與沙箱工具
\`\`\`

---

## 8.2.4 理解產品頁面

點擊任一產品卡片進入詳情頁，你會看到：

### 基本資訊區塊

| 欄位 | 說明 |
|---|---|
| **名稱** | 產品完整名稱 |
| **描述** | 詳細功能說明 |
| **版本** | 當前發佈版本號 |
| **FHIR 版本** | 支援的 FHIR 版本（R4/R4B/R5）|
| **授權** | 開源授權類型 |
| **GitHub** | 原始碼連結 |
| **Docker Hub** | Container Image 連結 |

### 授權類型說明

Foundry 要求所有產品必須使用開源授權：

| 授權 | 簡述 | 商業使用 |
|---|---|---|
| Apache 2.0 | 最常見，允許商業修改 | ✅ |
| MIT | 最寬鬆，幾乎無限制 | ✅ |
| BSD 3-Clause | 類似 MIT，多一條廣告限制 | ✅ |
| GPL v3 | 須開放修改後的程式碼 | 需注意 |

### 啟動設定（Configurations）

許多產品提供多種啟動設定，例如 FHIR Candle：
- \`all-r-versions\`：同時啟動 R4、R4B、R5 端點
- \`r4-only\`：只啟動 R4 端點（資源消耗較小）

---

## 8.2.5 推薦初學者的產品

### FHIR Candle（強烈推薦入門）

> Microsoft 開發的輕量記憶體 FHIR 伺服器，啟動速度快、資源需求低

**適合：** 快速開發測試、學習 FHIR API

\`\`\`
特色：
- 同時支援 R4、R4B、R5
- 內建 Web UI
- 啟動時間 < 10 秒
- 記憶體中運行（重啟後資料清空）
\`\`\`

### HAPI FHIR Plain Server

> 最廣泛使用的 Java FHIR 實作，功能完整

**適合：** 生產環境評估、完整功能測試

\`\`\`
特色：
- 持久化儲存（PostgreSQL）
- 完整搜尋支援
- 廣大社群和文件
\`\`\`

### WildFHIR Community Edition

> AEGIS 開發的完整 FHIR R4 Java 實作伺服器

**適合：** Connectathon 測試、互操作性驗證

\`\`\`
特色：
- 完整 FHIR R4 實作
- 支援 JSON/XML patch
- 提供公開測試端點
  https://wildfhir.aegis.net/fhir4-0-1
\`\`\`

### Sandbox Community Edition

> 完整的 FHIR 沙箱環境，含 SMART on FHIR

**適合：** 需要完整 OAuth 流程的測試

\`\`\`
特色：
- 內建 SMART on FHIR 授權伺服器
- 包含示範資料
- 多服務組合（較重）
\`\`\`

---

## 8.2.6 評估產品的檢查清單

在決定使用某個產品前，建議確認以下事項：

\`\`\`
□ FHIR 版本相容（R4/R4B/R5）
□ 授權符合你的使用場景
□ 最後更新日期不超過 6 個月（活躍維護中）
□ GitHub 有 Stars 和 Issues（社群活躍）
□ 有明確的 Docker 啟動說明
□ 系統需求符合你的機器規格
\`\`\`

:::warning
如果一個產品的 GitHub 倉庫超過 1 年沒有更新，需特別留意它是否還能正常啟動。FHIR 工具的依賴項目更新頻繁，長期不維護可能出現相容性問題。
:::
`;export{e as default};