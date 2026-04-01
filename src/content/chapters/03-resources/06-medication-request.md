# MedicationRequest Resource

MedicationRequest 資源用於記錄對患者的用藥處方或請求。它涵蓋所有類型的用藥指示，無論是門診處方、住院醫囑還是居家照護用藥。

## 核心概念

MedicationRequest 的主要用途：
- **處方開立**：醫生為患者開立的藥物處方
- **用藥醫囑**：住院期間護士執行的用藥指示
- **長期用藥管理**：患者的定期用藥（如每日服藥）
- **用藥自動補充**：患者預先授權藥師自動補充常用藥物

## JSON 結構範例

### 簡單的口服藥物處方
```json
{
  "resourceType": "MedicationRequest",
  "id": "MR001",
  "status": "active",
  "intent": "order",
  "medicationCodeableConcept": {
    "coding": [
      {
        "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
        "code": "197904",
        "display": "Amlodipine 5 MG Oral Tablet"
      }
    ],
    "text": "安美樂 (Amlodipine) 5mg 口服錠"
  },
  "subject": {
    "reference": "Patient/P001",
    "display": "王大明"
  },
  "encounter": {
    "reference": "Encounter/E001"
  },
  "authoredOn": "2024-01-20T10:30:00+08:00",
  "requester": {
    "reference": "Practitioner/DR001",
    "display": "李醫生"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "38341003",
          "display": "Hypertension"
        }
      ],
      "text": "高血壓"
    }
  ],
  "dosageInstruction": [
    {
      "text": "每日一次，每次一顆，飯後服用",
      "timing": {
        "repeat": {
          "frequency": 1,
          "period": 1,
          "periodUnit": "d"
        }
      },
      "route": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "26643006",
            "display": "Oral route"
          }
        ],
        "text": "口服"
      },
      "doseAndRate": [
        {
          "doseQuantity": {
            "value": 1,
            "unit": "tablet",
            "system": "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
            "code": "TAB"
          }
        }
      ]
    }
  ],
  "dispenseRequest": {
    "numberOfRepeatsAllowed": 11,
    "quantity": {
      "value": 30,
      "unit": "tablet",
      "system": "http://unitsofmeasure.org"
    },
    "expectedSupplyDuration": {
      "value": 30,
      "unit": "days",
      "system": "http://unitsofmeasure.org",
      "code": "d"
    }
  },
  "substitution": {
    "allowedBoolean": true,
    "reason": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-SubstanceAdminSubstitution",
          "code": "E",
          "display": "equivalent"
        }
      ]
    }
  }
}
```

### 注射藥物（住院）
```json
{
  "resourceType": "MedicationRequest",
  "id": "MR002",
  "status": "in-progress",
  "intent": "order",
  "medicationCodeableConcept": {
    "coding": [
      {
        "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
        "code": "1537005",
        "display": "Insulin Glargine 100 unit/mL"
      }
    ],
    "text": "胰島素"
  },
  "subject": {
    "reference": "Patient/P002"
  },
  "encounter": {
    "reference": "Encounter/E002"
  },
  "authoredOn": "2024-01-20T15:00:00+08:00",
  "dosageInstruction": [
    {
      "text": "每晚打針一次，10 單位皮下注射",
      "timing": {
        "repeat": {
          "frequency": 1,
          "period": 1,
          "periodUnit": "d",
          "timeOfDay": ["21:00"]
        }
      },
      "route": {
        "coding": [
          {
            "system": "http://snomed.info/sct",
            "code": "34206005",
            "display": "Subcutaneous injection"
          }
        ],
        "text": "皮下注射"
      },
      "doseAndRate": [
        {
          "doseQuantity": {
            "value": 10,
            "unit": "unit"
          }
        }
      ]
    }
  ],
  "dispenseRequest": {
    "quantity": {
      "value": 1,
      "unit": "cartridge",
      "system": "http://unitsofmeasure.org"
    }
  }
}
```

## 重要欄位說明

| 欄位 | 必填 | 說明 |
|------|------|------|
| `status` | ✓ | 狀態：active / on-hold / cancelled / completed / entered-in-error |
| `intent` | ✓ | 意圖：order / plan / reflex-order 等 |
| `medication[x]` | ✓ | 藥物：可用編碼或資源參照 |
| `subject` | ✓ | 患者 |
| `authoredOn` | | 處方開立的日期時間 |
| `requester` | | 開立處方的醫療人員 |
| `reasonCode` | | 開立該處方的臨床理由 |
| `dosageInstruction` | | 用藥指示（劑量、服用方式、頻率等） |
| `dispenseRequest` | | 領藥請求（數量、多久補充一次等） |
| `substitution` | | 是否允許藥物替代 |

## 用藥指示（dosageInstruction）詳解

dosageInstruction 是 MedicationRequest 中最重要的部分，包含：

### 頻率（Frequency）
```json
"timing": {
  "repeat": {
    "frequency": 3,        // 在 period 內的次數
    "period": 1,          // 時間週期
    "periodUnit": "d"     // 週期單位：s(秒) / min(分) / h(小時) / d(天) / wk(週) / mo(月) / a(年)
  }
}
// 解釋：每天 3 次
```

### 給藥途徑（Route）
```json
"route": {
  "coding": [
    {
      "system": "http://snomed.info/sct",
      "code": "26643006",
      "display": "Oral route"
    }
  ]
}
// 常見途徑：口服(oral) / 肌肉注射(intramuscular) / 皮下注射(subcutaneous) 等
```

### 劑量（Dose）
```json
"doseAndRate": [
  {
    "doseQuantity": {
      "value": 1,
      "unit": "tablet"
    },
    "rateQuantity": {
      "value": 100,
      "unit": "mL/h"
    }
  }
]
```

## 常見使用場景

### 1. 門診處方
患者看診後，醫生為其開立處方，患者拿著處方到藥局領藥。

### 2. 住院用藥
住院期間，醫生下達用藥醫囑，護士按醫囑給予患者用藥。

### 3. 慢性病用藥管理
患者的定期用藥（如每日服用的降血壓藥），需要定期補充。

### 4. 預先授權補充
患者預先同意藥師在特定條件下自動補充常用藥物（如胰島素）。

### 5. 用藥相互作用檢查
系統檢查多個 MedicationRequest 之間是否存在相互作用風險。

## MedicationRequest 的狀態流程

```
draft (草稿)
   ↓
active (活躍)
   ↓
on-hold (暫停)
   ↓
completed (完成) / cancelled (取消)
```

## 與其他資源的關聯

- **Patient**：患者
- **Encounter**：開立此處方的就診記錄
- **Condition**：開立該處方的臨床理由
- **Medication**：藥物的詳細資訊
- **MedicationDispense**：實際發放給患者的藥物

---

**重要提示**：
- 使用標準藥物編碼系統（如 RxNorm、ATC）確保互操作性
- dosageInstruction 應該清晰明確，患者能理解
- 記錄 reasonCode，追蹤開藥的臨床理由
