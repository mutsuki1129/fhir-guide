var e=`# Resource 結構總覽

## 什麼是 FHIR Resource？

每個 FHIR Resource 都是一個獨立、可識別的醫療資訊單元，具備以下共同元素：

---

## 所有 Resource 的共同結構

\`\`\`json
{
  "resourceType": "Patient",     // 必填：資源類型
  "id": "123",                   // 伺服器分配的邏輯 ID
  "meta": {                      // 元資料
    "versionId": "1",
    "lastUpdated": "2024-01-15T09:30:00+08:00",
    "profile": ["https://example.org/profile/Patient"]
  },
  "implicitRules": "...",        // 隱含規則 URI（謹慎使用）
  "language": "zh-TW",          // 資源語言
  "text": {                      // 人類可讀摘要（DomainResource）
    "status": "generated",
    "div": "<div>...</div>"
  },
  "extension": [ ... ],          // 延伸欄位（標準外的資料）
  "modifierExtension": [ ... ],  // 修改性延伸（改變語意）

  // 以下為各 Resource 特有欄位
  "name": [ ... ],
  "gender": "male",
  ...
}
\`\`\`

---

## Resource 繼承層次

\`\`\`
Resource（所有資源的基底）
├── id, meta, implicitRules, language
│
├── DomainResource（臨床/行政資源的基底）
│   ├── text（人類可讀摘要）
│   ├── contained（內嵌資源）
│   ├── extension
│   └── modifierExtension
│   │
│   ├── Patient
│   ├── Observation
│   ├── Encounter
│   ├── Condition
│   ├── MedicationRequest
│   └── ... （大多數資源）
│
└── Bundle（不繼承 DomainResource）
    └── 沒有 text/extension
\`\`\`

---

## 重要的共用資料型別

### Reference（參照）

用於連結不同 Resource：

\`\`\`json
"subject": {
  "reference": "Patient/123",
  "display": "王大明"
}
\`\`\`

### CodeableConcept（可編碼概念）

攜帶多個編碼系統的概念：

\`\`\`json
"code": {
  "coding": [
    {
      "system": "http://loinc.org",
      "code": "8480-6",
      "display": "Systolic blood pressure"
    },
    {
      "system": "http://snomed.info/sct",
      "code": "271649006",
      "display": "Systolic blood pressure"
    }
  ],
  "text": "收縮壓"
}
\`\`\`

### Quantity（數量）

\`\`\`json
"valueQuantity": {
  "value": 120,
  "unit": "mmHg",
  "system": "http://unitsofmeasure.org",
  "code": "mm[Hg]"
}
\`\`\`

---

## 常用術語系統

| 術語系統 | 用途 | System URL |
|----------|------|-----------|
| LOINC | 檢驗、觀察、文件類型 | \`http://loinc.org\` |
| SNOMED CT | 臨床術語（診斷、程序等）| \`http://snomed.info/sct\` |
| ICD-10 | 疾病診斷碼 | \`http://hl7.org/fhir/sid/icd-10\` |
| RxNorm | 藥品編碼 | \`http://www.nlm.nih.gov/research/umls/rxnorm\` |
| ATC | WHO 藥品分類 | \`http://www.whocc.no/atc\` |
| 健保藥品碼 | 台灣健保用藥 | \`https://www.nhi.gov.tw/drugcode\` |

本章接下來將逐一深入介紹各個重要的 Resource 類型。
`;export{e as default};