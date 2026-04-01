# Observation Resource

Observation 資源用於記錄臨床觀察、測量、評估和檢驗結果，是醫療照護資料交換中最常見的資源之一。

## 核心概念

Observation 主要用途：
- **臨床測量**：血壓、體溫、血糖等生命徵象
- **檢驗結果**：血液檢查、尿液檢查、微生物培養等實驗室數據
- **成像檢查**：放射線影像的測量數據
- **問卷調查**：患者的自我評估或症狀記錄

## JSON 結構範例

### 血壓測量
```json
{
  "resourceType": "Observation",
  "id": "BP001",
  "meta": {
    "profile": ["http://hl7.org/fhir/StructureDefinition/vitalsigns"]
  },
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "vital-signs",
          "display": "Vital Signs"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "55284-4",
        "display": "Blood pressure systolic and diastolic"
      }
    ],
    "text": "血壓"
  },
  "subject": {
    "reference": "Patient/P001",
    "display": "王大明"
  },
  "encounter": {
    "reference": "Encounter/E001"
  },
  "effectiveDateTime": "2024-01-20T10:30:00+08:00",
  "issued": "2024-01-20T10:32:00+08:00",
  "performer": [
    {
      "reference": "Practitioner/DR001",
      "display": "李醫生"
    }
  ],
  "component": [
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "8480-6",
            "display": "Systolic blood pressure"
          }
        ],
        "text": "收縮壓"
      },
      "valueQuantity": {
        "value": 120,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    },
    {
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "8462-4",
            "display": "Diastolic blood pressure"
          }
        ],
        "text": "舒張壓"
      },
      "valueQuantity": {
        "value": 80,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    }
  ]
}
```

### 實驗室檢查結果
```json
{
  "resourceType": "Observation",
  "id": "LAB001",
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "laboratory"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "2345-7",
        "display": "Glucose [Moles/volume] in Serum or Plasma"
      }
    ],
    "text": "血糖"
  },
  "subject": {
    "reference": "Patient/P001"
  },
  "effectiveDateTime": "2024-01-20T08:00:00+08:00",
  "valueQuantity": {
    "value": 110,
    "unit": "mg/dL",
    "system": "http://unitsofmeasure.org",
    "code": "mg/dL"
  },
  "referenceRange": [
    {
      "low": {
        "value": 70
      },
      "high": {
        "value": 100
      },
      "text": "空腹血糖正常範圍"
    }
  ],
  "interpretation": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
          "code": "H",
          "display": "High"
        }
      ]
    }
  ]
}
```

## 重要欄位說明

| 欄位 | 必填 | 說明 |
|------|------|------|
| `status` | ✓ | 觀察狀態：preliminary / final / amended 等 |
| `code` | ✓ | 觀察項目編碼（通常使用 LOINC）|
| `subject` | ✓ | 進行觀察的患者 |
| `effectiveDateTime` | | 觀察進行的日期時間 |
| `value[x]` | | 觀察結果值（可為多種類型） |
| `valueQuantity` | | 數值結果（如血壓、血糖） |
| `valueCodeableConcept` | | 編碼結果（如檢驗陽性/陰性） |
| `valueString` | | 文字結果 |
| `component` | | 複合觀察的各部分（如血壓的收縮壓/舒張壓） |
| `referenceRange` | | 參考範圍 |
| `interpretation` | | 結果解釋（如高、低、異常） |

## 常見使用場景

### 1. 生命徵象監測
在住院或門診期間定期記錄患者的體溫、脈搏、血壓、呼吸等。

### 2. 實驗室檢查結果報告
病理檢驗、生化檢驗等實驗室檢查結果的電子報告。

### 3. 醫療設備資料傳輸
來自監護設備、血糖儀、心電圖機等醫療設備的自動測量資料。

### 4. 遠距患者監測
透過穿戴式設備收集患者的健康資料（如運動量、睡眠時間）。

### 5. 臨床研究資料收集
在臨床研究中記錄患者的各項生物指標。

## Observation 的狀態流程

```
preliminary (初步)
     ↓
  final (最終)
     ↓
amended (修訂) / corrected (更正)
     ↓
cancelled (取消) / entered-in-error (誤錄)
```

## 與其他資源的關聯

- **Patient**：被觀察的患者
- **Encounter**：進行觀察的就診記錄
- **DiagnosticReport**：包含多個 Observation 的診斷報告
- **Condition**：Observation 可能導致 Condition 的診斷

---

**提示**：在使用 Observation 時，盡可能使用標準的編碼系統（LOINC、SNOMED CT 等），以便不同的醫療系統能正確理解檢查項目的含義。
