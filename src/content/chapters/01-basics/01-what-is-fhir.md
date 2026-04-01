# 什麼是 FHIR？

**FHIR**（Fast Healthcare Interoperability Resources，快速醫療互通資源）是由 HL7 International 所制定的醫療健康資料交換標準。它結合了現代網路技術（RESTful API、JSON、XML）與醫療領域的需求，讓不同系統之間能夠安全、快速地共享病患資料。

:::tip 為什麼叫「Fast」？
FHIR 設計的核心目標之一就是「快速實作」——相較於舊有的 HL7 v2 或 CDA 標準，FHIR 的學習曲線更平緩，使用你已熟悉的 REST API 概念即可開始使用。
:::

---

## FHIR 解決什麼問題？

醫療資訊系統長期以來面臨「資料孤島」問題：

- 醫院 HIS 系統用 HL7 v2 格式
- 電子病歷 EMR 用各自的私有格式
- 保險公司、政府機關又有各自的 API
- 跨院轉診、緊急就醫時，資料無法即時取得

FHIR 提供了一套**統一的資源模型（Resource Model）**，讓所有系統說同一種語言。

---

## FHIR 的核心概念

### 1. Resource（資源）

FHIR 的最基本單元是 **Resource**，類似物件導向中的「物件」。每個 Resource 都代表一個醫療領域的概念：

| Resource | 說明 |
|----------|------|
| `Patient` | 病患基本資料（姓名、生日、性別等）|
| `Observation` | 觀察記錄（血壓、體重、血糖等）|
| `Encounter` | 就診記錄（門診、住院等）|
| `Condition` | 診斷條件（疾病、症狀）|
| `MedicationRequest` | 用藥醫囑 |
| `Practitioner` | 醫療人員 |
| `Organization` | 醫療機構 |
| `Bundle` | 多個 Resource 的打包容器 |

### 2. RESTful API 介面

FHIR 使用標準的 HTTP 動詞操作 Resource：

```
GET    /Patient           → 查詢所有病患
GET    /Patient/123       → 查詢 id=123 的病患
POST   /Patient           → 建立新病患
PUT    /Patient/123       → 更新病患（完整覆蓋）
PATCH  /Patient/123       → 更新病患（部分修改）
DELETE /Patient/123       → 刪除病患
```

### 3. JSON 格式

FHIR R4 支援 JSON 與 XML，現代應用程式多使用 JSON。一個最簡單的 Patient Resource 長這樣：

```json
{
  "resourceType": "Patient",
  "id": "example-001",
  "name": [
    {
      "use": "official",
      "text": "王大明",
      "family": "王",
      "given": ["大明"]
    }
  ],
  "gender": "male",
  "birthDate": "1985-03-15"
}
```

注意 `resourceType` 欄位是必要的，它告訴系統這個 JSON 是什麼類型的 Resource。

---

## FHIR 的架構層次

```
FHIR R4 規範
│
├── Base Resources（基礎資源）
│   ├── Clinical Resources: Patient, Observation, Condition...
│   ├── Financial Resources: Claim, Coverage...
│   ├── Administrative Resources: Organization, Practitioner...
│   └── Infrastructure Resources: Bundle, CapabilityStatement...
│
├── Data Types（資料型別）
│   ├── Primitive Types: string, boolean, integer, dateTime...
│   └── Complex Types: CodeableConcept, Reference, Quantity...
│
└── Profiles（設定檔）
    └── 各國/機構對標準 Resource 的客製化限制
```

---

## 台灣的 FHIR 推廣

衛生福利部已於 2023 年推出 **TW Core IG（Taiwan Core Implementation Guide）**，是台灣醫療機構必須遵循的 FHIR 在地化規範。主要包含：

- 身分識別碼（健保卡號、身份證字號）的系統 URL 規範
- 台灣特有的醫療行政碼系統（如健保藥品碼、ICD-10 在地化）
- 中文姓名的表示方式

:::warning 重要提醒
本教學使用 FHIR R4（第四版），是目前台灣醫療機構主流採用的版本。FHIR R5 已於 2023 年發布，但尚未廣泛導入。
:::

---

## 學習路線圖

完成本章後，你將能夠：

1. ✅ 理解 FHIR 是什麼、解決什麼問題
2. ✅ 認識 Resource 的基本概念
3. ✅ 了解 FHIR RESTful API 的操作模式

下一章節，我們將深入了解 FHIR 的歷史與版本演進，幫助你理解為什麼要選擇 R4。
