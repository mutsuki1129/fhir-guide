var e=`# 連接公開測試伺服器

在搭建本地環境之前，或者當你只需要快速測試時，可以使用公開的 FHIR 測試伺服器。這些伺服器完全免費、無需認證、已啟用 CORS，非常適合學習使用。

---

## 主要公開測試伺服器

### 1. HAPI FHIR（推薦）

\`\`\`
Base URL: https://hapi.fhir.org/baseR4
UI:       https://hapi.fhir.org
\`\`\`

**特點：**
- 由 HAPI FHIR 官方維護
- 完整支援 FHIR R4
- 資料定期清除（約每週）
- 回應速度中等（有時較慢）

### 2. SMART Health IT

\`\`\`
Base URL: https://r4.smarthealthit.org
\`\`\`

**特點：**
- 由 SMART on FHIR 團隊維護
- 預載了大量測試病患資料（Synthea 生成）
- 支援 SMART on FHIR 認證流程測試

### 3. Firely Server（Simplifier.net）

\`\`\`
Base URL: https://vonk.fire.ly/R4
\`\`\`

**特點：**
- Firely（HL7 Netherlands）維護
- 支援 FHIR R4 和 R5

---

## 測試連線

使用本教學的 API 測試面板，或直接在瀏覽器開啟：

\`\`\`
https://hapi.fhir.org/baseR4/metadata?_format=json
\`\`\`

你會看到一個大型 JSON 文件（CapabilityStatement），列出伺服器支援的所有功能。

---

## 使用公開伺服器的注意事項

:::danger 重要：不要上傳真實病患資料
公開測試伺服器是給所有人共用的。**絕對不能**上傳任何真實的病患個人資料（即使是去識別化的資料也請謹慎）。只使用完全虛構的測試資料。
:::

:::warning 資料會被清除
公開伺服器的資料通常每隔幾天或幾週會被清除。不要依賴這些伺服器儲存任何重要資料。如果你的測試 ID 突然找不到，很可能是資料被清除了。
:::

---

## 第一次連線測試

讓我們用 API 測試面板做幾個簡單測試：

### 步驟 1：取得伺服器能力聲明

在 API 測試面板中：
- Method：\`GET\`
- URL：\`/metadata\`
- 點擊「發送」

回應的 \`CapabilityStatement\` 包含：
- \`software.name\`：HAPI FHIR
- \`software.version\`：HAPI FHIR 版本號
- \`rest[0].resource\`：列出所有支援的 Resource 類型

### 步驟 2：查詢現有的 Patient

\`\`\`
GET /Patient?_count=3
\`\`\`

\`_count\` 參數限制回傳筆數。回應是一個 \`Bundle\` Resource，包含：
\`\`\`json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 12345,
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "xxxx",
        ...
      }
    }
  ]
}
\`\`\`

### 步驟 3：建立一個測試 Patient

\`\`\`
POST /Patient
Content-Type: application/fhir+json
\`\`\`

Body：
\`\`\`json
{
  "resourceType": "Patient",
  "name": [
    {
      "use": "official",
      "family": "學習",
      "given": ["FHIR"]
    }
  ],
  "gender": "male",
  "birthDate": "2000-01-01"
}
\`\`\`

成功後回應 \`201 Created\`，\`Location\` header 會包含新建立的 Resource URL：
\`\`\`
Location: https://hapi.fhir.org/baseR4/Patient/3456789
\`\`\`

記下這個 ID，下一步用它來查詢！

---

## 切換伺服器

本教學的 API 測試面板支援快速切換：

1. **HAPI FHIR Public**：\`https://hapi.fhir.org/baseR4\`
2. **Local Docker**：\`http://localhost:8080/fhir\`
3. **自訂 URL**：輸入任何 FHIR R4 伺服器的 Base URL

:::tip 建議
開發初期使用公開伺服器，熟悉後切換到本地伺服器。本地伺服器速度更快，資料不會被清除，且可以任意測試而不影響他人。
:::
`;export{e as default};