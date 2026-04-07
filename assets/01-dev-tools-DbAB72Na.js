var e=`# 開發工具準備

在開始 FHIR 實作之前，我們需要準備幾個核心工具。本教學的環境要求非常輕量——大部分工具你可能已經安裝了。

---

## 必備工具

### 1. VS Code

**下載**：[code.visualstudio.com](https://code.visualstudio.com)

VS Code 是目前最適合 FHIR 開發的編輯器，因為有豐富的 FHIR 相關擴充套件。

**推薦安裝的擴充套件：**

\`\`\`
FHIR Tools                  (Firely)
  → FHIR Resource 語法高亮、自動補全
  → 支援 FSH (FHIR Shorthand) 格式

REST Client                 (Huachao Mao)
  → 直接在 VS Code 內發送 HTTP 請求
  → 類似 Postman 但整合在編輯器中

JSON Language Support       (VS Code 內建)
  → 格式化、折疊、驗證 JSON
\`\`\`

安裝方式：\`Ctrl+Shift+X\` 開啟擴充套件面板，搜尋並安裝。

---

### 2. Node.js（v20+）

**下載**：[nodejs.org](https://nodejs.org)（選 LTS 版本）

驗證安裝：
\`\`\`bash
node --version   # 應顯示 v20.x.x 或更高
npm --version    # 應顯示 10.x.x 或更高
\`\`\`

---

### 3. Docker Desktop

**下載**：[docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

Docker 用於在本地運行 HAPI FHIR Server，是最快速的本地環境建置方式。

驗證安裝：
\`\`\`bash
docker --version         # 應顯示 Docker version 24.x.x 或更高
docker compose version   # 應顯示 Docker Compose version v2.x.x
\`\`\`

:::warning Windows 使用者注意
Windows 上的 Docker Desktop 需要啟用 WSL 2（Windows Subsystem for Linux）。如果尚未設定，Docker Desktop 安裝時會引導你完成。
:::

---

### 4. Git

**下載**：[git-scm.com](https://git-scm.com)（大多數系統已預裝）

\`\`\`bash
git --version   # 驗證安裝
\`\`\`

---

## 選配工具

### Postman（可選）

雖然本教學提供內建的 API 測試面板，Postman 仍是業界標準的 API 測試工具，值得熟悉。

**HAPI FHIR 官方提供的 Postman Collection：**
在 HAPI FHIR 的 GitHub 倉庫可以找到預設的 Postman 請求集合，直接匯入即可使用。

### TablePlus / DBeaver（選配）

如果你想查看 HAPI FHIR Server 的底層資料庫（預設使用 H2 內嵌資料庫），可以使用這些資料庫 GUI 工具。

---

## VS Code 設定建議

建立 \`.vscode/settings.json\`，針對 FHIR JSON 開發進行最佳化：

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "json.schemas": [
    {
      "fileMatch": ["**/fhir-resources/*.json"],
      "url": "https://hl7.org/fhir/R4/fhir.schema.json"
    }
  ],
  "rest-client.environmentVariables": {
    "$shared": {
      "baseUrl": "https://hapi.fhir.org/baseR4",
      "contentType": "application/fhir+json"
    },
    "local": {
      "baseUrl": "http://localhost:8080/fhir"
    }
  }
}
\`\`\`

---

## REST Client 使用範例

安裝 REST Client 後，建立 \`test.http\` 檔案：

\`\`\`http
### 查詢所有病患
GET {{baseUrl}}/Patient?_count=5
Accept: application/fhir+json

###

### 建立病患
POST {{baseUrl}}/Patient
Content-Type: application/fhir+json
Accept: application/fhir+json

{
  "resourceType": "Patient",
  "name": [
    {
      "use": "official",
      "family": "測試",
      "given": ["使用者"]
    }
  ],
  "gender": "male",
  "birthDate": "1990-01-01"
}
\`\`\`

點擊 \`Send Request\` 即可在 VS Code 內發送請求並查看回應。

---

## 環境確認清單

完成本節後，請確認以下工具都已就緒：

- [ ] VS Code 已安裝，FHIR Tools 擴充套件已啟用
- [ ] Node.js v20+ 已安裝
- [ ] Docker Desktop 已安裝並正在運行
- [ ] Git 已安裝

下一節，我們將用 Docker Compose 一鍵啟動本地 HAPI FHIR Server！
`;export{e as default};