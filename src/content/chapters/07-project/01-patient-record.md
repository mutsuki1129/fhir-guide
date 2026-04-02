# 建立完整病患就診紀錄

在實際的醫療系統中，一次門診就診（Encounter）並非只有一個 Resource 組成，而是由多個互相關聯的 FHIR Resource 共同描述。本章節將帶你逐步建立一筆完整的病患就診紀錄，涵蓋 Patient、Encounter、Condition、Observation、MedicationRequest 五個核心 Resource，並說明它們彼此的連結方式。

---

## 7.1.1 就診紀錄的組成結構

一次完整的就診流程在 FHIR 中的對應關係如下：

```
Patient（病患基本資料）
  └── Encounter（就診事件）
        ├── Condition（診斷）
        ├── Observation（生命徵象 / 檢查結果）
        └── MedicationRequest（處方用藥）
```

各 Resource 間的參照方式：

| 子 Resource | 關聯到 Patient | 關聯到 Encounter |
|---|---|---|
| Encounter | `subject` | — |
| Condition | `subject` | `encounter` |
| Observation | `subject` | `encounter` |
| MedicationRequest | `subject` | `encounter` |

> **提示：** Encounter 同時也會透過 `diagnosis.condition` 反向參照 Condition，明確記錄主要診斷。

---

## 7.1.2 Patient Resource — 病患基本資料

Patient 是整個就診紀錄的起點，儲存病患的人口學資訊。

### 欄位說明

| 欄位 | 說明 | 必填 |
|---|---|---|
| `identifier` | 病歷號（MRN）、身分證號等識別碼 | 建議 |
| `active` | 紀錄是否有效 | 否 |
| `name` | 姓名（可有多筆，如正式姓名、慣用名）| 否 |
| `telecom` | 聯絡方式（電話、Email）| 否 |
| `gender` | 性別：`male \| female \| other \| unknown` | 否 |
| `birthDate` | 出生日期（格式：YYYY-MM-DD）| 否 |
| `address` | 地址 | 否 |
| `contact` | 緊急聯絡人 | 否 |
| `communication` | 語言偏好 | 否 |
| `generalPractitioner` | 主治醫師 | 否 |
| `managingOrganization` | 管理機構 | 否 |

### 完整 JSON 範例

```json
{
  "resourceType": "Patient",
  "id": "patient-001",
  "identifier": [
    {
      "use": "usual",
      "type": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
          "code": "MR",
          "display": "Medical Record Number"
        }]
      },
      "system": "http://hospital.example.org/patients",
      "value": "MRN-123456"
    }
  ],
  "active": true,
  "name": [
    {
      "use": "official",
      "family": "陳",
      "given": ["大明"],
      "text": "陳大明"
    }
  ],
  "telecom": [
    { "system": "phone", "value": "0912-345-678", "use": "mobile" },
    { "system": "email", "value": "daming.chen@example.com" }
  ],
  "gender": "male",
  "birthDate": "1980-06-15",
  "address": [
    {
      "use": "home",
      "line": ["台北市信義路五段7號"],
      "city": "台北市",
      "country": "TW"
    }
  ],
  "contact": [
    {
      "relationship": [{
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
          "code": "N",
          "display": "Next-of-Kin"
        }]
      }],
      "name": {
        "use": "official",
        "family": "陳",
        "given": ["美玲"],
        "text": "陳美玲"
      },
      "telecom": [
        { "system": "phone", "value": "0923-456-789", "use": "mobile" }
      ],
      "gender": "female"
    }
  ],
  "communication": [
    {
      "language": {
        "coding": [{
          "system": "urn:ietf:bcp:47",
          "code": "zh-TW",
          "display": "Chinese (Traditional, Taiwan)"
        }]
      },
      "preferred": true
    }
  ]
}
```

### identifier.type 常用代碼

| 代碼 | 說明 |
|---|---|
| `MR` | Medical Record Number（病歷號） |
| `SS` | Social Security Number（社會安全號） |
| `NI` | National Identity Number（身分證號） |
| `PPN` | Passport Number（護照號） |

---

## 7.1.3 Encounter Resource — 就診事件

Encounter 記錄病患與醫療機構之間的一次互動，包括門診、急診、住院等。

### 關鍵欄位

| 欄位 | 說明 |
|---|---|
| `status` | 就診狀態：`planned \| arrived \| in-progress \| finished \| cancelled` |
| `class` | 就診類型（門診/急診/住院），使用 v3-ActCode |
| `type` | 就診性質（初診、複診、諮詢），使用 SNOMED CT |
| `subject` | 參照 Patient |
| `period` | 就診時間範圍（start / end）|
| `diagnosis` | 主要診斷（關聯到 Condition）|
| `serviceProvider` | 服務機構（關聯到 Organization）|

### `class` 常用代碼（v3-ActCode）

| 代碼 | 說明 |
|---|---|
| `AMB` | 門診（Ambulatory） |
| `EMER` | 急診（Emergency） |
| `IMP` | 住院（Inpatient） |
| `VR` | 視訊診療（Virtual） |

### JSON 範例

```json
{
  "resourceType": "Encounter",
  "id": "encounter-001",
  "status": "finished",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "ambulatory"
  },
  "type": [
    {
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": "11429006",
        "display": "Consultation"
      }]
    }
  ],
  "subject": {
    "reference": "Patient/patient-001",
    "display": "陳大明"
  },
  "period": {
    "start": "2024-04-02T09:00:00+08:00",
    "end": "2024-04-02T09:45:00+08:00"
  },
  "diagnosis": [
    {
      "condition": {
        "reference": "Condition/condition-001",
        "display": "高血壓"
      },
      "use": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
          "code": "AD",
          "display": "Admission diagnosis"
        }]
      },
      "rank": 1
    }
  ],
  "serviceProvider": {
    "reference": "Organization/hospital-001",
    "display": "範例醫院"
  }
}
```

---

## 7.1.4 Condition Resource — 診斷

Condition 記錄病患的疾病診斷或問題，必須包含臨床狀態與確認狀態。

### 關鍵欄位

| 欄位 | 說明 |
|---|---|
| `clinicalStatus` | 臨床狀態：`active \| recurrence \| relapse \| inactive \| remission \| resolved` |
| `verificationStatus` | 確認狀態：`unconfirmed \| provisional \| differential \| confirmed \| refuted \| entered-in-error` |
| `category` | 類別（如 `encounter-diagnosis`、`problem-list-item`）|
| `code` | 診斷代碼（建議同時提供 SNOMED CT 與 ICD-10）|
| `subject` | 參照 Patient |
| `encounter` | 參照 Encounter |
| `onsetDateTime` | 症狀發作時間 |
| `recordedDate` | 記錄日期 |

### JSON 範例

```json
{
  "resourceType": "Condition",
  "id": "condition-001",
  "clinicalStatus": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
      "code": "active",
      "display": "Active"
    }]
  },
  "verificationStatus": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
      "code": "confirmed",
      "display": "Confirmed"
    }]
  },
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/condition-category",
      "code": "encounter-diagnosis",
      "display": "Encounter Diagnosis"
    }]
  }],
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "38341003",
        "display": "Hypertension"
      },
      {
        "system": "http://hl7.org/fhir/sid/icd-10",
        "code": "I10",
        "display": "Essential (primary) hypertension"
      }
    ],
    "text": "原發性高血壓"
  },
  "subject": { "reference": "Patient/patient-001" },
  "encounter": { "reference": "Encounter/encounter-001" },
  "onsetDateTime": "2023-01-10",
  "recordedDate": "2024-04-02"
}
```

---

## 7.1.5 Observation Resource — 生命徵象

Observation 用於記錄量測結果，例如血壓、體溫、血糖等。血壓需使用 `component`（面板型）結構。

### LOINC 常用代碼

| LOINC Code | 說明 |
|---|---|
| `85354-9` | 血壓面板（Blood pressure panel） |
| `8480-6` | 收縮壓（Systolic blood pressure） |
| `8462-4` | 舒張壓（Diastolic blood pressure） |
| `8310-5` | 體溫（Body temperature） |
| `8867-4` | 心跳（Heart rate） |
| `2339-0` | 血糖（Glucose） |

### JSON 範例（血壓）

```json
{
  "resourceType": "Observation",
  "id": "observation-bp-001",
  "status": "final",
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      "code": "vital-signs",
      "display": "Vital Signs"
    }]
  }],
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "85354-9",
      "display": "Blood pressure panel"
    }],
    "text": "血壓"
  },
  "subject": { "reference": "Patient/patient-001" },
  "encounter": { "reference": "Encounter/encounter-001" },
  "effectiveDateTime": "2024-04-02T09:10:00+08:00",
  "component": [
    {
      "code": {
        "coding": [{ "system": "http://loinc.org", "code": "8480-6", "display": "Systolic blood pressure" }]
      },
      "valueQuantity": {
        "value": 148,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    },
    {
      "code": {
        "coding": [{ "system": "http://loinc.org", "code": "8462-4", "display": "Diastolic blood pressure" }]
      },
      "valueQuantity": {
        "value": 92,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    }
  ]
}
```

---

## 7.1.6 MedicationRequest Resource — 處方

MedicationRequest 記錄醫師開立的藥物處方，包含劑量指示與配藥資訊。

### 關鍵欄位

| 欄位 | 說明 |
|---|---|
| `status` | 狀態：`active \| on-hold \| cancelled \| completed \| stopped` |
| `intent` | 意圖：`order`（正式處方）、`proposal`、`plan` |
| `medicationCodeableConcept` | 藥物代碼（使用 RxNorm）|
| `subject` | 參照 Patient |
| `encounter` | 參照 Encounter |
| `reasonReference` | 開藥原因（參照 Condition）|
| `dosageInstruction` | 用藥指示 |
| `dispenseRequest` | 配藥資訊（數量、重複次數）|

### JSON 範例

```json
{
  "resourceType": "MedicationRequest",
  "id": "medicationrequest-001",
  "status": "active",
  "intent": "order",
  "medicationCodeableConcept": {
    "coding": [{
      "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
      "code": "314076",
      "display": "Lisinopril 10 MG Oral Tablet"
    }],
    "text": "Lisinopril 10mg 口服錠"
  },
  "subject": { "reference": "Patient/patient-001" },
  "encounter": { "reference": "Encounter/encounter-001" },
  "authoredOn": "2024-04-02T09:30:00+08:00",
  "reasonReference": [{ "reference": "Condition/condition-001" }],
  "dosageInstruction": [{
    "text": "每日一次，每次一顆，口服",
    "timing": {
      "repeat": {
        "frequency": 1,
        "period": 1,
        "periodUnit": "d"
      }
    },
    "route": {
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": "26643006",
        "display": "Oral route"
      }]
    },
    "doseAndRate": [{
      "doseQuantity": {
        "value": 10,
        "unit": "mg",
        "system": "http://unitsofmeasure.org",
        "code": "mg"
      }
    }]
  }],
  "dispenseRequest": {
    "numberOfRepeatsAllowed": 2,
    "quantity": {
      "value": 30,
      "unit": "顆"
    }
  }
}
```

---

## 7.1.7 逐一建立 vs. 用 Bundle 一次建立

你可以選擇分別呼叫 API 建立每個 Resource，也可以使用 Bundle Transaction 一次提交（下一章節介紹）。

### 方式一：逐一建立（適合學習與除錯）

```bash
# 1. 建立病患
curl -X PUT "https://hapi.fhir.org/baseR4/Patient/patient-001" \
  -H "Content-Type: application/fhir+json" \
  -d @patient.json

# 2. 建立就診事件
curl -X PUT "https://hapi.fhir.org/baseR4/Encounter/encounter-001" \
  -H "Content-Type: application/fhir+json" \
  -d @encounter.json

# 3. 建立診斷
curl -X PUT "https://hapi.fhir.org/baseR4/Condition/condition-001" \
  -H "Content-Type: application/fhir+json" \
  -d @condition.json

# 4. 建立血壓量測
curl -X PUT "https://hapi.fhir.org/baseR4/Observation/observation-bp-001" \
  -H "Content-Type: application/fhir+json" \
  -d @observation.json

# 5. 建立處方
curl -X PUT "https://hapi.fhir.org/baseR4/MedicationRequest/medicationrequest-001" \
  -H "Content-Type: application/fhir+json" \
  -d @medication-request.json
```

### 方式二：查詢完整就診紀錄

建立完成後，可使用 `$everything` 操作一次取得病患的所有相關 Resource：

```bash
curl "https://hapi.fhir.org/baseR4/Patient/patient-001/\$everything"
```

也可以用 `_include` 與 `_revinclude` 組合搜尋：

```bash
# 取得 Encounter 及其關聯的 Condition 和 Observation
curl "https://hapi.fhir.org/baseR4/Encounter?subject=Patient/patient-001&_revinclude=Condition:encounter&_revinclude=Observation:encounter"
```

---

## 7.1.8 實作練習

1. 將上方各 Resource 的 JSON 分別貼入「FHIR JSON 編輯器」進行驗證
2. 使用「API 測試面板」依序以 `PUT` 方法建立所有 Resource
3. 使用 `GET /Patient/patient-001/$everything` 確認五個 Resource 都已成功建立
4. 試著修改 Condition 的 `clinicalStatus` 為 `resolved`，再用 `PUT` 更新

> **注意：** HAPI 公開測試伺服器的資料會定期清除，請勿上傳真實病患資料。
