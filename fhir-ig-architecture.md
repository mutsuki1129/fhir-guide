# FHIR 實作指南互動式網頁 - 架構設計文件

> 本文件為 Claude Code 執行用的完整架構規格，請依序執行。

---

## 1. 專案概覽

| 項目 | 說明 |
|------|------|
| 專案名稱 | `fhir-guide` |
| 類型 | 獨立前端 SPA（純靜態） |
| 技術棧 | Vue 3 + Vite + Tailwind CSS v4 + TypeScript |
| 部署 | GitHub Pages（透過 `gh-pages` branch） |
| 目標 | 個人學習筆記式的 FHIR R4 互動式實作指南 |
| 本地路徑 | `C:\Users\owner\Documents\GitHub\fhir-guide` |

---

## 2. 核心功能模組

### 2.1 互動式教學步驟 (Step-by-Step Tutorial)
- 左側目錄導航（章節樹狀結構）
- 右側內容區顯示教學步驟
- 每個步驟有「上一步 / 下一步」按鈕
- 進度追蹤（localStorage 記錄已完成步驟）
- 支援 Markdown 渲染教學內容

### 2.2 FHIR Resource JSON 即時編輯/驗證
- 內嵌 Monaco Editor（VS Code 同款編輯器）
- 左側為 JSON 編輯區，右側為即時驗證結果
- 內建 FHIR R4 JSON Schema 驗證
- 預載常用 Resource 範本（Patient, Observation, Encounter, Condition, MedicationRequest 等）
- 驗證結果以顏色標示：綠色通過 / 紅色錯誤 / 黃色警告
- 錯誤訊息可點擊跳轉到對應行號

### 2.3 API 測試面板 (FHIR API Tester)
- 類似 Postman 的介面
- 支援 HTTP 方法：GET, POST, PUT, DELETE, PATCH
- FHIR Server 切換器：
  - **HAPI FHIR 公開測試伺服器**：`https://hapi.fhir.org/baseR4`
  - **本地 Docker HAPI FHIR**：`http://localhost:8080/fhir`（使用者可自訂 URL）
- Request Headers 編輯（預設 `Content-Type: application/fhir+json`）
- Request Body 編輯（Monaco Editor）
- Response 顯示：Status Code、Headers、Body（JSON 格式化）
- 預設 API 範例快捷按鈕：
  - `GET /Patient` — 查詢所有病患
  - `GET /Patient/{id}` — 查詢單一病患
  - `POST /Patient` — 建立病患
  - `GET /Observation?patient={id}` — 查詢病患觀察紀錄
  - `GET /metadata` — 取得伺服器能力聲明
- Response Time 顯示
- 歷史紀錄（localStorage）

### 2.4 程式碼範例區 (Code Examples)
- 語言切換 Tabs：JavaScript (fetch), Python (requests), cURL, C# (HttpClient), Java (HAPI FHIR Client)
- 一鍵複製按鈕
- Syntax Highlighting（使用 Shiki）
- 每個教學章節附帶對應語言的程式碼範例

---

## 3. 教學內容結構（章節規劃）

```
1. FHIR 基礎概念
   1.1 什麼是 FHIR？
   1.2 FHIR 的歷史與版本演進（DSTU2 → STU3 → R4 → R5）
   1.3 FHIR 與其他標準的比較（HL7 v2, CDA）
   1.4 RESTful API 基礎回顧

2. 環境建置
   2.1 開發工具準備（VS Code, Postman, Docker）
   2.2 本地 HAPI FHIR Server（Docker Compose 一鍵部署）
   2.3 連接公開測試伺服器
   2.4 第一個 FHIR 請求（互動練習）

3. FHIR Resource 深入
   3.1 Resource 結構總覽
   3.2 Patient Resource（互動 JSON 編輯練習）
   3.3 Observation Resource
   3.4 Encounter Resource
   3.5 Condition Resource
   3.6 MedicationRequest Resource
   3.7 Bundle Resource（Transaction / Batch）
   3.8 自訂 Extension

4. FHIR 搜尋機制
   4.1 基本搜尋參數
   4.2 修飾符（Modifiers）
   4.3 鏈式搜尋（Chained Search）
   4.4 反向鏈式搜尋（_revinclude）
   4.5 搜尋結果分頁

5. FHIR 操作 (Operations)
   5.1 $validate
   5.2 $everything
   5.3 $expand (ValueSet)
   5.4 自訂 Operation

6. 安全性與認證
   6.1 SMART on FHIR 概覽
   6.2 OAuth 2.0 流程
   6.3 Scopes 與權限控制

7. 實戰專案
   7.1 建立完整病患就診紀錄
   7.2 用 Bundle 批次匯入資料
   7.3 建立簡易病患查詢前端
```

---

## 4. 技術架構

### 4.1 目錄結構

```
fhir-guide/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css              # Tailwind 入口
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue          # 頂部導航
│   │   │   ├── AppSidebar.vue         # 左側章節目錄
│   │   │   └── AppLayout.vue          # 主版面配置
│   │   ├── tutorial/
│   │   │   ├── StepNavigator.vue      # 上一步/下一步
│   │   │   ├── ProgressTracker.vue    # 進度追蹤
│   │   │   └── MarkdownRenderer.vue   # Markdown 渲染
│   │   ├── editor/
│   │   │   ├── JsonEditor.vue         # Monaco Editor 封裝
│   │   │   ├── ValidationPanel.vue    # 驗證結果面板
│   │   │   └── ResourceTemplates.vue  # 預載範本選擇器
│   │   ├── api-tester/
│   │   │   ├── ApiTester.vue          # 主測試面板
│   │   │   ├── ServerSelector.vue     # FHIR Server 切換
│   │   │   ├── RequestBuilder.vue     # 請求建構器
│   │   │   ├── ResponseViewer.vue     # 回應檢視器
│   │   │   └── ApiPresets.vue         # 預設 API 範例
│   │   └── code-examples/
│   │       ├── CodeBlock.vue          # 語法高亮程式碼區塊
│   │       └── LanguageSwitcher.vue   # 語言切換 Tabs
│   ├── composables/
│   │   ├── useFhirValidation.ts       # FHIR JSON 驗證邏輯
│   │   ├── useApiTester.ts            # API 測試邏輯
│   │   ├── useProgress.ts             # 進度追蹤邏輯
│   │   └── useTheme.ts               # 明暗主題切換
│   ├── content/
│   │   ├── chapters/                  # Markdown 教學內容
│   │   │   ├── 01-basics/
│   │   │   │   ├── 01-what-is-fhir.md
│   │   │   │   ├── 02-history.md
│   │   │   │   ├── 03-comparison.md
│   │   │   │   └── 04-restful-review.md
│   │   │   ├── 02-setup/
│   │   │   │   ├── 01-dev-tools.md
│   │   │   │   ├── 02-local-hapi.md
│   │   │   │   ├── 03-public-server.md
│   │   │   │   └── 04-first-request.md
│   │   │   └── ... (其餘章節同理)
│   │   ├── templates/                 # FHIR Resource JSON 範本
│   │   │   ├── patient.json
│   │   │   ├── observation.json
│   │   │   ├── encounter.json
│   │   │   ├── condition.json
│   │   │   ├── medication-request.json
│   │   │   └── bundle-transaction.json
│   │   └── code-examples/             # 多語言程式碼範例
│   │       ├── create-patient/
│   │       │   ├── javascript.ts
│   │       │   ├── python.py
│   │       │   ├── curl.sh
│   │       │   ├── csharp.cs
│   │       │   └── java.java
│   │       └── ... (每個操作一個資料夾)
│   ├── data/
│   │   ├── chapters.ts                # 章節目錄定義
│   │   ├── fhir-schema.ts             # FHIR R4 驗證 schema
│   │   └── api-presets.ts             # API 預設範例
│   ├── router/
│   │   └── index.ts                   # Vue Router 設定
│   ├── stores/
│   │   ├── progress.ts                # Pinia - 學習進度
│   │   └── settings.ts                # Pinia - 使用者設定
│   ├── types/
│   │   └── index.ts                   # TypeScript 型別定義
│   ├── App.vue
│   └── main.ts
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions 自動部署
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

### 4.2 套件依賴

```json
{
  "dependencies": {
    "vue": "^3.5",
    "vue-router": "^4.5",
    "pinia": "^2.3",
    "@monaco-editor/loader": "^1.4",
    "monaco-editor": "^0.52",
    "markdown-it": "^14.1",
    "markdown-it-anchor": "^9.2",
    "shiki": "^1.27",
    "ajv": "^8.17",
    "ajv-formats": "^3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2",
    "vite": "^6.1",
    "typescript": "^5.7",
    "tailwindcss": "^4.0",
    "@tailwindcss/vite": "^4.0",
    "vite-plugin-raw": "^1.0",
    "gh-pages": "^6.3"
  }
}
```

### 4.3 關鍵技術決策

| 決策 | 選擇 | 原因 |
|------|------|------|
| JSON 編輯器 | Monaco Editor | VS Code 同款，支援 JSON schema 驗證、自動補全 |
| JSON 驗證 | Ajv + FHIR R4 JSON Schema | 客戶端即時驗證，無需後端 |
| Markdown 渲染 | markdown-it | 輕量、可擴充、支援自訂容器語法 |
| 語法高亮 | Shiki | 與 VS Code 同款引擎，主題豐富 |
| 狀態管理 | Pinia | Vue 3 官方推薦，TypeScript 友好 |
| 路由 | Vue Router (Hash Mode) | GitHub Pages 不支援 History Mode |
| FHIR Server 連接 | 瀏覽器端 fetch | 直接從前端呼叫，HAPI 公開伺服器已啟用 CORS |

---

## 5. UI/UX 設計規格

### 5.1 設計風格
- **主題**：深色技術文件風格（類似 VitePress 暗色主題）
- **字體**：
  - 標題：`JetBrains Mono` (Google Fonts)
  - 正文：`Noto Sans TC`（繁體中文） + `Inter`（英文 fallback）
  - 程式碼：`Fira Code`
- **配色**：
  - 背景：`#0a0a0f`（深黑藍）
  - 卡片/面板：`#13131a`
  - 主色調：`#3b82f6`（FHIR 藍）
  - 成功：`#22c55e`
  - 錯誤：`#ef4444`
  - 警告：`#eab308`
  - 文字：`#e2e8f0`
  - 次要文字：`#94a3b8`
  - 邊框：`#1e293b`
- **特色**：
  - 左側固定側邊欄（可收合）
  - 頂部有 FHIR 版本標示 + Server 狀態燈號
  - 程式碼區塊帶有仿終端機圓角 + 紅黃綠三點裝飾
  - JSON 編輯器與驗證面板有即時動態分割線

### 5.2 響應式設計
- Desktop（>1024px）：三欄佈局（側邊欄 + 內容 + 右側面板）
- Tablet（768-1024px）：側邊欄可收合 overlay
- Mobile（<768px）：底部 Tab 導航，內容單欄

### 5.3 頁面路由

```
/#/                          → 首頁（概覽 + 快速開始）
/#/tutorial/:chapterId/:stepId → 教學步驟頁
/#/editor                    → FHIR JSON 編輯/驗證工具
/#/api-tester                → API 測試面板
/#/reference                 → FHIR Resource 快速參考
```

---

## 6. FHIR Server 整合

### 6.1 公開測試伺服器
```
Base URL: https://hapi.fhir.org/baseR4
特性：
- 免費開放，無需認證
- 支援所有 FHIR R4 資源類型
- 資料會定期清除
- 已啟用 CORS
```

### 6.2 本地 Docker HAPI FHIR
提供教學用的 `docker-compose.yml`：

```yaml
# 教學章節 2.2 會提供此內容
services:
  hapi-fhir:
    image: hapiproject/hapi:latest
    ports:
      - "8080:8080"
    environment:
      - hapi.fhir.default_encoding=json
      - hapi.fhir.fhir_version=R4
      - hapi.fhir.cors.allow_Credentials=true
      - hapi.fhir.cors.allowed_origin=*
```

### 6.3 Server 切換邏輯
```typescript
// composables/useApiTester.ts
interface FhirServer {
  id: string;
  name: string;
  baseUrl: string;
  type: 'public' | 'local' | 'custom';
}

const defaultServers: FhirServer[] = [
  {
    id: 'hapi-public',
    name: 'HAPI FHIR Public (R4)',
    baseUrl: 'https://hapi.fhir.org/baseR4',
    type: 'public'
  },
  {
    id: 'hapi-local',
    name: 'Local Docker HAPI FHIR',
    baseUrl: 'http://localhost:8080/fhir',
    type: 'local'
  }
];
```

---

## 7. GitHub Pages 部署

### 7.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 7.2 Vite 設定

```typescript
// vite.config.ts
export default defineConfig({
  base: '/fhir-guide/',  // GitHub repo 名稱
  plugins: [vue()],
  // ... 其餘設定
});
```

---



## 8. 後續擴展計畫

- [ ] 台灣 TW Core IG 專區（衛福部 FHIR 在地化指引）
- [ ] SMART on FHIR 互動式 OAuth 流程示範
- [ ] Synthea 合成病患資料產生器整合
- [ ] FHIR Shorthand (FSH) 線上編輯器
- [ ] 離線 PWA 支援
