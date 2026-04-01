# Extension Resource

Extension 是 FHIR 的核心可擴充機制，允許在資源中新增標準外的資料元素，而不違反 FHIR 規範。它是 FHIR 靈活性的關鍵。

## 核心概念

Extension 的主要用途：
- **增加標準化欄位**：標準 FHIR 資源中不存在的常見資料
- **實現本地化需求**：依據當地法規或醫療實踐的特殊欄位
- **支援研究擴展**：臨床研究所需的額外資料
- **向後相容性**：在不破壞現有結構的情況下新增新功能

## Extension 結構

### 簡單 Extension（Simple Extension）

只有 URL 和單一值：

```json
{
  "url": "http://example.org/fhir/StructureDefinition/patient-gender",
  "valueString": "其他"
}
```

### 複雜 Extension（Complex Extension）

包含多個嵌套的 Extension：

```json
{
  "url": "http://example.org/fhir/StructureDefinition/patient-address-components",
  "extension": [
    {
      "url": "village",
      "valueString": "村名"
    },
    {
      "url": "neighborhood", 
      "valueString": "鄰里"
    },
    {
      "url": "area-code",
      "valueString": "地區代碼"
    }
  ]
}
```

## JSON 結構範例

### 在 Patient 中新增出生地
```json
{
  "resourceType": "Patient",
  "id": "P001",
  "name": [
    {
      "text": "王大明"
    }
  ],
  "birthDate": "1980-05-15",
  "extension": [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/patient-birthPlace",
      "valueAddress": {
        "city": "台北市",
        "district": "中正區",
        "country": "台灣"
      }
    },
    {
      "url": "https://www.nhi.gov.tw/fhir/StructureDefinition/employee-id",
      "valueString": "E-2024-001"
    }
  ]
}
```

### 在 Observation 中新增檢驗單位資訊
```json
{
  "resourceType": "Observation",
  "id": "OBS001",
  "status": "final",
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "2345-7"
      }
    ]
  },
  "valueQuantity": {
    "value": 110,
    "unit": "mg/dL"
  },
  "extension": [
    {
      "url": "http://example.org/fhir/StructureDefinition/test-method",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://example.org/test-methods",
            "code": "enzymatic",
            "display": "Enzymatic method"
          }
        ],
        "text": "酶法"
      }
    },
    {
      "url": "http://example.org/fhir/StructureDefinition/instrument-used",
      "valueString": "Roche Cobas c311"
    }
  ]
}
```

### 在 Encounter 中新增中醫掛號資訊
```json
{
  "resourceType": "Encounter",
  "id": "E001",
  "status": "finished",
  "subject": {
    "reference": "Patient/P001"
  },
  "extension": [
    {
      "url": "https://www.nhi.gov.tw/fhir/StructureDefinition/tcm-syndrome-pattern",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://example.org/tcm-syndrome-pattern",
            "code": "liver-qi-stagnation",
            "display": "肝氣鬱滯"
          }
        ],
        "text": "肝氣鬱滯"
      }
    },
    {
      "url": "https://www.nhi.gov.tw/fhir/StructureDefinition/acupuncture-points",
      "valueString": "三陰交、太衝、膈俞"
    }
  ]
}
```

## Extension 的層次結構

根據修改資源語義的程度，Extension 分為兩類：

### 1. Extension（一般擴展）
**不改變資源的基本含義**

- 新增額外資訊但不改變解釋方式
- 不知道此 Extension 的系統仍能正確理解資源
- 例：出生地、員工編號

```json
"extension": [
  {
    "url": "http://hl7.org/fhir/StructureDefinition/patient-birthPlace",
    "valueAddress": { ... }
  }
]
```

### 2. Modifier Extension（修飾性擴展）
**改變資源的語義或解釋方式**

- 不知道此 Extension 的系統必須拒絕處理
- 必須顯式聲明理解此 Extension
- 例：「此血壓是患者自行測量」vs「醫療人員測量」

```json
"modifierExtension": [
  {
    "url": "http://example.org/fhir/StructureDefinition/measurement-self-reported",
    "valueBoolean": true
  }
]
```

## Extension 值的數據型別

Extension 的 `value[x]` 可以包含多種 FHIR 數據型別：

| 型別 | 例子 | 用途 |
|------|------|------|
| `valueString` | 文字描述 | 簡單文本資訊 |
| `valueBoolean` | true/false | 是/否的標誌 |
| `valueInteger` | 數字 | 整數值 |
| `valueDecimal` | 小數 | 浮點數值 |
| `valueDate` | 日期 | 日期資訊 |
| `valueDateTime` | 日期時間 | 時間戳 |
| `valueCodeableConcept` | 編碼概念 | 有標準編碼的概念 |
| `valueReference` | 資源參照 | 參照其他資源 |
| `valueAddress` | 地址 | 地址資訊 |
| `valueHumanName` | 人名 | 人員姓名 |

## Extension 的最佳實踐

### 1. 定義 StructureDefinition
每個 Extension 都應該有對應的 StructureDefinition，說明其結構和用途：

```json
{
  "resourceType": "StructureDefinition",
  "id": "patient-employee-id",
  "url": "https://www.nhi.gov.tw/fhir/StructureDefinition/employee-id",
  "name": "Employee ID",
  "title": "員工編號",
  "status": "active",
  "kind": "complex-type",
  "type": "Extension",
  "baseDefinition": "http://hl7.org/fhir/StructureDefinition/Extension",
  "differential": {
    "element": [
      {
        "id": "Extension.value[x]",
        "path": "Extension.value[x]",
        "type": [
          {
            "code": "string"
          }
        ]
      }
    ]
  }
}
```

### 2. 使用有意義的 URL
Extension URL 應該是唯一的、有意義的：

```
✓ https://www.nhi.gov.tw/fhir/StructureDefinition/employee-id
✓ http://hospital.example.org/fhir/StructureDefinition/registration-fee
✗ http://example.org/ext1
✗ http://temp/extension
```

### 3. 文件化 Extension
明確說明 Extension 的用途和約束：

```json
{
  "url": "https://www.nhi.gov.tw/fhir/StructureDefinition/employee-id",
  "description": "台灣健保署員工編號，格式為 E-YYYY-XXX"
}
```

### 4. 優先使用標準 Extension
優先使用已有的 HL7 標準 Extension，而非創建重複的 Extension：

- [HL7 FHIR Extensions Registry](https://registry.fhir.org/)

## 常見使用場景

### 1. 本地化需求
台灣健保資訊：
- 健保卡號格式
- 醫療機構代碼
- 保險身份

### 2. 專科領域擴展
中醫領域：
- 證型/辨證分析
- 穴位組合
- 望聞問切記錄

牙科領域：
- 牙位編號
- 診療項目編碼

### 3. 臨床研究
- 研究參與者編號
- 研究相關的額外測量
- 臨床試驗階段資訊

### 4. 質量控制
- 檢驗方法
- 儀器編號
- 品管結果

## Extension vs Contained Resource

| 特性 | Extension | Contained |
|------|-----------|-----------|
| **用途** | 新增屬性 | 新增相關資源 |
| **資料結構** | 值對或嵌套值 | 完整資源 |
| **例子** | 出生地、員工號 | 主治醫生細節資訊 |

## 使用 Modifier Extension 的警示

使用 `modifierExtension` 時要特別謹慎，因為不瞭解此 Extension 的系統必須拒絕處理該資源：

```json
{
  "modifierExtension": [
    {
      "url": "http://example.org/fhir/StructureDefinition/measurement-reliability",
      "valueCode": "unreliable"
    }
  ],
  "valueQuantity": {
    "value": 120,
    "unit": "mmHg"
  }
}
// 如果系統不知道此 modifierExtension，
// 不能假設血壓值是可靠的，必須拒絕使用此資源
```

---

**重點總結**：
- Extension 是 FHIR 的靈活性來源
- 但應優先使用標準欄位，Extension 是補充
- 每個 Extension 都應有明確的 StructureDefinition
- Modifier Extension 必須謹慎使用，因為改變語義
