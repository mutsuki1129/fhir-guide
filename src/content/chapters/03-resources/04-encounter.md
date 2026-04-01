# Encounter Resource

Encounter 資源記錄患者與醫療提供者（醫生、護士等）之間的互動。它是連接臨床資料（如 Observation、Condition、MedicationRequest）與具體醫療事件的樞紐。

## 核心概念

Encounter 的主要用途：
- **門診記錄**：患者到醫院掛號、看診的記錄
- **住院記錄**：患者從入院到出院的整個過程
- **急診記錄**：患者到急診室就診的記錄
- **居家照護**：醫護人員上門提供醫療服務
- **遠距醫療**：透過視訊或電話進行的醫療諮詢

## JSON 結構範例

### 門診就診
```json
{
  "resourceType": "Encounter",
  "id": "E001",
  "status": "finished",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "ambulatory"
  },
  "type": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/encounter-type",
          "code": "ACUTE",
          "display": "Acute Care"
        }
      ],
      "text": "急性期照護"
    }
  ],
  "subject": {
    "reference": "Patient/P001",
    "display": "王大明"
  },
  "period": {
    "start": "2024-01-20T10:00:00+08:00",
    "end": "2024-01-20T10:45:00+08:00"
  },
  "participant": [
    {
      "type": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
              "code": "PPRF",
              "display": "primary performer"
            }
          ]
        }
      ],
      "individual": {
        "reference": "Practitioner/DR001",
        "display": "李醫生"
      }
    }
  ],
  "serviceProvider": {
    "reference": "Organization/ORG001",
    "display": "台北醫學中心"
  },
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "29857009",
          "display": "Chest pain"
        }
      ],
      "text": "胸痛"
    }
  ],
  "diagnosis": [
    {
      "condition": {
        "reference": "Condition/C001",
        "display": "高血壓"
      },
      "use": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            "code": "billing",
            "display": "Billing"
          }
        ]
      }
    }
  ],
  "location": [
    {
      "location": {
        "reference": "Location/LOC001",
        "display": "內科診療室"
      },
      "status": "completed"
    }
  ]
}
```

### 住院就診
```json
{
  "resourceType": "Encounter",
  "id": "E002",
  "status": "in-progress",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "IMP",
    "display": "inpatient"
  },
  "period": {
    "start": "2024-01-20T15:00:00+08:00",
    "end": null
  },
  "subject": {
    "reference": "Patient/P002"
  },
  "hospitalization": {
    "preAdmissionIdentifier": {
      "system": "http://hospital.example.org/pre-admit",
      "value": "Pre-2024-001"
    },
    "admitSource": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/admit-source",
          "code": "emd",
          "display": "From accident/emergency department"
        }
      ]
    },
    "dischargeDisposition": {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/discharge-disposition",
          "code": "home",
          "display": "Discharged to home care"
        }
      ]
    }
  }
}
```

## 重要欄位說明

| 欄位 | 必填 | 說明 |
|------|------|------|
| `status` | ✓ | 就診狀態：planned / arrived / in-progress / onleave / finished / cancelled |
| `class` | ✓ | 就診類型：ambulatory (門診) / inpatient (住院) / emergency (急診) 等 |
| `subject` | ✓ | 就診的患者 |
| `period` | ✓ | 就診開始和結束時間 |
| `participant` | | 參與就診的醫療人員 |
| `reasonCode` | | 就診原因（症狀或主訴） |
| `diagnosis` | | 在本次就診中診斷的病情 |
| `location` | | 就診地點 |
| `serviceProvider` | | 提供服務的醫療機構 |
| `hospitalization` | | 住院相關的資訊 |

## Encounter 狀態流程

```
planned (已計劃)
   ↓
arrived (患者已到達)
   ↓
in-progress (就診中)
   ↓
onleave (患者暫時離開)
   ↓
finished (已完成)
   ↓
cancelled (已取消)
```

## 常見使用場景

### 1. 門診掛號與就診
患者到醫院掛號後，建立一個 Encounter 記錄該次就診的過程。

### 2. 住院流程管理
記錄患者的入院、住院期間的轉科、最後出院的整個過程。

### 3. 就診資料關聯
將該次就診中進行的所有 Observation、Condition、MedicationRequest 等資料關聯到同一次 Encounter。

### 4. 急診分流與監測
記錄患者進入急診室、分流等級、等候時間等資訊。

### 5. 遠距醫療記錄
記錄透過視訊或電話進行的醫療諮詢。

## Encounter 與其他資源的關聯

Encounter 是許多臨床資料的容器，連接了：

```
Encounter
├── Patient ← 就診的患者
├── Observation ← 本次就診的測量結果
├── Condition ← 本次診斷的病情
├── MedicationRequest ← 本次開立的用藥
├── DiagnosticReport ← 本次進行的檢驗報告
├── Procedure ← 本次進行的醫療程序
└── Practitioner ← 參與的醫療人員
```

---

**提示**：Encounter 的 status 和 class 是兩個不同的概念：
- `status` 表示就診流程的進度（計劃→進行中→完成）
- `class` 表示就診類型（門診→住院→急診）
