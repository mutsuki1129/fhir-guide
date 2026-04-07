var e=`# Condition Resource

Condition 資源用於記錄患者的病情、診斷、或其他臨床上值得關注的健康問題。它捕捉醫療提供者對患者健康狀態的臨床評估和斷言。

## 核心概念

Condition 的主要用途：
- **疾病診斷**：患者被診斷的疾病（如糖尿病、高血壓）
- **症狀記錄**：經過評估、需要長期追蹤的症狀
- **健康問題**：患者面臨的健康風險或問題
- **問題清單**：醫生維護的患者問題/診斷清單

## JSON 結構範例

### 高血壓診斷
\`\`\`json
{
  "resourceType": "Condition",
  "id": "C001",
  "meta": {
    "profile": ["http://hl7.org/fhir/StructureDefinition/Condition"]
  },
  "clinicalStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
        "code": "active",
        "display": "Active"
      }
    ]
  },
  "verificationStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
        "code": "confirmed",
        "display": "Confirmed"
      }
    ]
  },
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/condition-category",
          "code": "problem-list-item",
          "display": "Problem List Item"
        }
      ]
    }
  ],
  "severity": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "255604002",
        "display": "Mild"
      }
    ]
  },
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
    "text": "高血壓"
  },
  "subject": {
    "reference": "Patient/P001",
    "display": "王大明"
  },
  "encounter": {
    "reference": "Encounter/E001"
  },
  "onsetDateTime": "2020-06-15",
  "recordedDate": "2024-01-20T10:30:00+08:00",
  "recorder": {
    "reference": "Practitioner/DR001",
    "display": "李醫生"
  }
}
\`\`\`

### 持續性症狀
\`\`\`json
{
  "resourceType": "Condition",
  "id": "C002",
  "clinicalStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
        "code": "active"
      }
    ]
  },
  "verificationStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
        "code": "provisional",
        "display": "Provisional"
      }
    ]
  },
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/condition-category",
          "code": "symptom",
          "display": "Symptom"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "68235000",
        "display": "Chest pain"
      }
    ],
    "text": "胸痛"
  },
  "subject": {
    "reference": "Patient/P002"
  },
  "onset": {
    "dateTime": "2024-01-10T00:00:00+08:00"
  },
  "note": [
    {
      "text": "患者報告在運動後有間歇性胸痛，持續 3-5 分鐘後緩解。建議進行進一步的心臟檢查。"
    }
  ]
}
\`\`\`

## 重要欄位說明

| 欄位 | 必填 | 說明 |
|------|------|------|
| \`code\` | ✓ | Condition 的編碼（通常使用 SNOMED CT 或 ICD-10） |
| \`subject\` | ✓ | 患者 |
| \`clinicalStatus\` | ✓ | 臨床狀態：active / recurrence / relapse / inactive / remission / resolved |
| \`verificationStatus\` | ✓ | 驗證狀態：unconfirmed / provisional / confirmed / refuted / entered-in-error |
| \`category\` | | Condition 的分類：problem-list-item / encounter-diagnosis / symptom 等 |
| \`severity\` | | 嚴重程度：mild / moderate / severe |
| \`onsetDateTime\` | | Condition 開始的日期時間 |
| \`abatementDateTime\` | | Condition 結束或緩解的日期時間 |
| \`recordedDate\` | | Condition 被記錄的日期 |
| \`recorder\` | | 記錄此 Condition 的人員 |
| \`note\` | | 臨床備註 |

## Condition 與 Observation 的區別

| Aspect | Condition | Observation |
|--------|-----------|-------------|
| **目的** | 記錄診斷或健康問題 | 記錄測量或評估結果 |
| **時間** | 通常是長期的 | 通常是特定時間點 |
| **例子** | 糖尿病、高血壓、頭痛 | 血糖值、體溫、血壓數值 |
| **變化** | 可能持續數月或數年 | 每次測量可能不同 |

**規則**：
- 如果是一次性的測量結果，使用 **Observation**
- 如果需要長期追蹤和管理，使用 **Condition**
- 症狀如果只是短暫的，可用 Observation；如果需要長期追蹤，用 Condition

## 常見使用場景

### 1. 患者問題清單
醫生維護的患者問題/診斷清單，包含所有活躍的和已解決的健康問題。

### 2. 病情追蹤
定期更新患者的慢性病管理（如糖尿病、高血壓），記錄病情變化。

### 3. 臨床決策支援
系統根據患者的 Condition 提供相關的醫療建議或檢查提醒。

### 4. 公共衛生監測
收集特定疾病（如傳染病）的 Condition 記錄進行疾病監測。

### 5. 臨床研究
根據 Condition 篩選符合研究條件的患者。

## Condition 狀態概念

### Clinical Status（臨床狀態）
表示 Condition 目前的臨床進展：
- \`active\`：正在進行中
- \`recurrence\`：復發
- \`relapse\`：反覆發作
- \`inactive\`：不活躍
- \`remission\`：緩解
- \`resolved\`：已解決

### Verification Status（驗證狀態）
表示診斷的確定程度：
- \`unconfirmed\`：未確認
- \`provisional\`：初步
- \`confirmed\`：已確認
- \`refuted\`：已排除
- \`entered-in-error\`：誤錄

## 與其他資源的關聯

- **Patient**：患者
- **Encounter**：診斷該 Condition 的就診記錄
- **Observation**：導致 Condition 診斷的觀察結果
- **MedicationRequest**：為治療此 Condition 而開立的用藥

---

**提示**：記錄 Condition 時，應同時記錄 \`recordedDate\` 和 \`recorder\`，以追蹤診斷的來源和時間。
`;export{e as default};