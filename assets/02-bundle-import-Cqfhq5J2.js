var e=`# 用 Bundle 批次匯入資料

在前一章節中，我們學會了逐一建立各個 FHIR Resource。但在實際系統整合中，一次就診紀錄往往需要同時寫入多個 Resource，若逐一呼叫 API，不但效率低落，還可能因中途失敗導致資料不一致。

**FHIR Bundle Transaction** 提供了解決方案：將多個操作打包成一個請求，讓伺服器原子性地（all-or-nothing）執行。

---

## 7.2.1 Bundle 的兩種批次類型

FHIR 提供兩種批次執行模式：

| 特性 | \`batch\` | \`transaction\` |
|---|---|---|
| **原子性** | 無（每筆獨立執行） | 有（全部成功或全部失敗）|
| **失敗處理** | 繼續執行其餘項目 | 立即中止，回滾所有變更 |
| **跨項目參照** | 不支援 | 支援 \`urn:uuid:\` 內部參照 |
| **適用場景** | 批量匯入、容錯度高的情境 | 就診紀錄寫入、需要一致性的情境 |
| **提交方式** | \`POST [baseUrl]/\` | \`POST [baseUrl]/\` |
| **回應類型** | \`bundle-response\`（type: \`batch-response\`）| \`bundle-response\`（type: \`transaction-response\`）|

> **重要：** 提交到 \`POST [baseUrl]/Bundle\` 只是**儲存** Bundle 資源本身，並不執行其中的操作。必須提交到 \`POST [baseUrl]/\`（不加資源類型）才會**執行** Bundle。

---

## 7.2.2 Bundle 結構解析

### 基本結構

\`\`\`json
{
  "resourceType": "Bundle",
  "type": "transaction",
  "timestamp": "2024-04-02T09:00:00+08:00",
  "entry": [
    {
      "fullUrl": "urn:uuid:patient-001",
      "resource": { ... },
      "request": {
        "method": "PUT",
        "url": "Patient/patient-001"
      }
    }
  ]
}
\`\`\`

### \`entry\` 的三個核心欄位

| 欄位 | 說明 |
|---|---|
| \`fullUrl\` | Bundle 內的唯一識別 URI，供其他 entry 參照 |
| \`resource\` | 要操作的 FHIR Resource 本體 |
| \`request\` | HTTP 操作指令（method + url）|

---

## 7.2.3 fullUrl 與內部參照

\`fullUrl\` 是 Transaction Bundle 中最重要的機制之一，讓多個尚未存入伺服器的 Resource 在同一個 Bundle 中互相參照。

### 使用規則

1. **使用 \`urn:uuid:\` 格式**（新建資源時）：
   \`\`\`json
   "fullUrl": "urn:uuid:550e8400-e29b-41d4-a716-446655440001"
   \`\`\`

2. **其他 entry 用相同 URI 參照它**：
   \`\`\`json
   "subject": { "reference": "urn:uuid:550e8400-e29b-41d4-a716-446655440001" }
   \`\`\`

3. **伺服器處理完成後**，會將 \`urn:uuid:\` 替換為真實的 Resource ID，並自動更新所有參照。

4. **已知 ID 時**，可直接使用完整 URL：
   \`\`\`json
   "fullUrl": "https://hapi.fhir.org/baseR4/Patient/patient-001"
   \`\`\`

### 範例：Encounter 參照 Patient

\`\`\`json
{
  "entry": [
    {
      "fullUrl": "urn:uuid:patient-A",
      "resource": {
        "resourceType": "Patient",
        "name": [{ "family": "陳", "given": ["大明"] }]
      },
      "request": { "method": "POST", "url": "Patient" }
    },
    {
      "fullUrl": "urn:uuid:encounter-A",
      "resource": {
        "resourceType": "Encounter",
        "status": "finished",
        "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB" },
        "subject": { "reference": "urn:uuid:patient-A" }
      },
      "request": { "method": "POST", "url": "Encounter" }
    }
  ]
}
\`\`\`

---

## 7.2.4 POST vs PUT — 何時用哪個？

### \`POST\`（新建，伺服器分配 ID）

- URL 只需填資源類型：\`"Patient"\`
- 伺服器自動指派 ID
- 支援條件式新建（\`ifNoneExist\`），避免重複建立

\`\`\`json
{
  "fullUrl": "urn:uuid:new-patient",
  "resource": { "resourceType": "Patient", ... },
  "request": {
    "method": "POST",
    "url": "Patient",
    "ifNoneExist": "identifier=http://hospital.org/mrn|MRN-123456"
  }
}
\`\`\`

> \`ifNoneExist\` 的效果：如果搜尋條件找到已有的 Resource，就跳過建立並直接使用現有的。

### \`PUT\`（更新或建立，客戶端指定 ID）

- URL 需包含資源類型與 ID：\`"Patient/patient-001"\`
- 若該 ID 不存在則新建（Upsert），若已存在則更新
- 支援 \`ifMatch\` 進行樂觀鎖定（Optimistic Locking）

\`\`\`json
{
  "fullUrl": "urn:uuid:patient-001",
  "resource": {
    "resourceType": "Patient",
    "id": "patient-001",
    ...
  },
  "request": {
    "method": "PUT",
    "url": "Patient/patient-001",
    "ifMatch": "W/\\"2\\""
  }
}
\`\`\`

> \`ifMatch\` 中的 \`W/"2"\` 是版本 ETag，確保只有在版本號符合時才更新，防止並發寫入衝突。

---

## 7.2.5 完整就診紀錄 Transaction Bundle

以下是一個完整範例，包含五個 Resource 的一次性寫入：

\`\`\`json
{
  "resourceType": "Bundle",
  "type": "transaction",
  "timestamp": "2024-04-02T09:00:00+08:00",
  "entry": [
    {
      "fullUrl": "urn:uuid:patient-001",
      "resource": {
        "resourceType": "Patient",
        "id": "patient-001",
        "identifier": [{
          "use": "usual",
          "type": { "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/v2-0203", "code": "MR" }] },
          "system": "http://hospital.example.org/patients",
          "value": "MRN-123456"
        }],
        "name": [{ "use": "official", "family": "陳", "given": ["大明"] }],
        "gender": "male",
        "birthDate": "1980-06-15"
      },
      "request": { "method": "PUT", "url": "Patient/patient-001" }
    },
    {
      "fullUrl": "urn:uuid:encounter-001",
      "resource": {
        "resourceType": "Encounter",
        "id": "encounter-001",
        "status": "finished",
        "class": {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          "code": "AMB",
          "display": "ambulatory"
        },
        "subject": { "reference": "urn:uuid:patient-001" },
        "period": {
          "start": "2024-04-02T09:00:00+08:00",
          "end": "2024-04-02T09:45:00+08:00"
        },
        "diagnosis": [{
          "condition": { "reference": "urn:uuid:condition-001" },
          "rank": 1
        }]
      },
      "request": { "method": "PUT", "url": "Encounter/encounter-001" }
    },
    {
      "fullUrl": "urn:uuid:condition-001",
      "resource": {
        "resourceType": "Condition",
        "id": "condition-001",
        "clinicalStatus": {
          "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/condition-clinical", "code": "active" }]
        },
        "verificationStatus": {
          "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status", "code": "confirmed" }]
        },
        "code": {
          "coding": [
            { "system": "http://snomed.info/sct", "code": "38341003", "display": "Hypertension" },
            { "system": "http://hl7.org/fhir/sid/icd-10", "code": "I10", "display": "Essential (primary) hypertension" }
          ],
          "text": "原發性高血壓"
        },
        "subject": { "reference": "urn:uuid:patient-001" },
        "encounter": { "reference": "urn:uuid:encounter-001" },
        "recordedDate": "2024-04-02"
      },
      "request": { "method": "PUT", "url": "Condition/condition-001" }
    },
    {
      "fullUrl": "urn:uuid:observation-001",
      "resource": {
        "resourceType": "Observation",
        "id": "observation-001",
        "status": "final",
        "category": [{
          "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "vital-signs" }]
        }],
        "code": {
          "coding": [{ "system": "http://loinc.org", "code": "85354-9", "display": "Blood pressure panel" }],
          "text": "血壓"
        },
        "subject": { "reference": "urn:uuid:patient-001" },
        "encounter": { "reference": "urn:uuid:encounter-001" },
        "effectiveDateTime": "2024-04-02T09:10:00+08:00",
        "component": [
          {
            "code": { "coding": [{ "system": "http://loinc.org", "code": "8480-6" }] },
            "valueQuantity": { "value": 148, "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]" }
          },
          {
            "code": { "coding": [{ "system": "http://loinc.org", "code": "8462-4" }] },
            "valueQuantity": { "value": 92, "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]" }
          }
        ]
      },
      "request": { "method": "PUT", "url": "Observation/observation-001" }
    },
    {
      "fullUrl": "urn:uuid:medicationrequest-001",
      "resource": {
        "resourceType": "MedicationRequest",
        "id": "medicationrequest-001",
        "status": "active",
        "intent": "order",
        "medicationCodeableConcept": {
          "coding": [{ "system": "http://www.nlm.nih.gov/research/umls/rxnorm", "code": "314076", "display": "Lisinopril 10 MG Oral Tablet" }],
          "text": "Lisinopril 10mg 口服錠"
        },
        "subject": { "reference": "urn:uuid:patient-001" },
        "encounter": { "reference": "urn:uuid:encounter-001" },
        "authoredOn": "2024-04-02T09:30:00+08:00",
        "reasonReference": [{ "reference": "urn:uuid:condition-001" }],
        "dosageInstruction": [{
          "text": "每日一次，每次一顆，口服",
          "timing": { "repeat": { "frequency": 1, "period": 1, "periodUnit": "d" } },
          "doseAndRate": [{
            "doseQuantity": { "value": 10, "unit": "mg", "system": "http://unitsofmeasure.org", "code": "mg" }
          }]
        }]
      },
      "request": { "method": "PUT", "url": "MedicationRequest/medicationrequest-001" }
    }
  ]
}
\`\`\`

---

## 7.2.6 提交 Bundle 並解讀回應

### 用 cURL 提交

\`\`\`bash
curl -X POST "https://hapi.fhir.org/baseR4" \\
  -H "Content-Type: application/fhir+json" \\
  -H "Accept: application/fhir+json" \\
  -d @visit-bundle.json
\`\`\`

### 用 JavaScript 提交

\`\`\`javascript
async function submitBundle(bundle) {
  const response = await fetch('https://hapi.fhir.org/baseR4', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json'
    },
    body: JSON.stringify(bundle)
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.resourceType === 'OperationOutcome') {
      const messages = error.issue.map(i => i.diagnostics || i.details?.text).join('\\n');
      throw new Error(\`FHIR Error: \${messages}\`);
    }
    throw new Error(\`HTTP \${response.status}\`);
  }

  return response.json();
}
\`\`\`

### 解讀 transaction-response

伺服器回傳的 Bundle 中，每個 \`entry.response\` 對應請求中的同位置 entry：

\`\`\`json
{
  "resourceType": "Bundle",
  "type": "transaction-response",
  "entry": [
    {
      "response": {
        "status": "200 OK",
        "location": "Patient/patient-001/_history/1",
        "etag": "W/\\"1\\"",
        "lastModified": "2024-04-02T01:25:42.000+00:00"
      }
    },
    {
      "response": {
        "status": "201 Created",
        "location": "Encounter/encounter-001/_history/1",
        "etag": "W/\\"1\\"",
        "lastModified": "2024-04-02T01:25:42.000+00:00"
      }
    }
  ]
}
\`\`\`

| \`status\` | 說明 |
|---|---|
| \`200 OK\` | 資源已更新（已存在） |
| \`201 Created\` | 資源已新建 |
| \`400 Bad Request\` | 請求格式錯誤 |
| \`422 Unprocessable Entity\` | 業務邏輯驗證失敗 |

---

## 7.2.7 Transaction 失敗處理

Transaction Bundle 具備原子性：若任何一個 entry 操作失敗，伺服器**不會**部分提交，會回傳 HTTP 400/422 並附上 OperationOutcome。

\`\`\`json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "diagnostics": "Entry 2: Patient/patient-001 already exists with version 2, ifMatch requires version 1",
      "location": ["Bundle.entry[1]"]
    }
  ]
}
\`\`\`

常見失敗原因：

| 原因 | 解決方式 |
|---|---|
| \`ifMatch\` 版本不符 | 先 \`GET\` 取得最新 \`ETag\`，再更新 \`ifMatch\` |
| 資源 ID 格式不合法 | ID 只能含字母、數字、\`-\`、\`.\` |
| 必填欄位缺失（如 Condition 缺少 clinicalStatus）| 補上必填欄位 |
| \`fullUrl\` 重複 | 確保每個 entry 的 \`fullUrl\` 唯一 |

---

## 7.2.8 Batch vs Transaction 的選擇建議

\`\`\`
需要原子性（一致性優先）？
├── 是 → 使用 transaction
│         ✓ 就診紀錄、住院入院資料
│         ✓ 有跨資源參照的情境
│
└── 否 → 使用 batch
          ✓ 大量歷史資料匯入
          ✓ 可容忍部分失敗的情境
          ✓ 每筆資料彼此獨立
\`\`\`

---

## 7.2.9 實作練習

1. 將 7.2.5 的完整 Bundle JSON 貼入「API 測試面板」
2. 選擇 \`POST\` 方法，URL 填 \`https://hapi.fhir.org/baseR4\`
3. 觀察回應中每個 entry 的 \`status\` 與 \`location\`
4. 試著故意在某個 Resource 中移除必填欄位，觀察 Transaction 如何整體失敗
5. 嘗試改用 \`batch\` 類型提交，觀察相同錯誤時的不同行為

> **進階挑戰：** 建立一個包含 10 筆 Patient 的 Batch Bundle，並觀察 batch-response 中哪些成功、哪些失敗。
`;export{e as default};