var e=`# Patient Resource

Patient 資源代表接受醫療照護或醫療相關服務的個人。這是 FHIR 中最基礎、最常用的資源，用於記錄患者的人口統計、身份識別和行政資訊。

## 核心概念

Patient 資源的主要用途：
- **身份識別**：透過 identifier 欄位儲存多個識別編號（如健保卡號、病歷號）
- **人口統計資訊**：記錄姓名、性別、出生日期等基本資訊
- **聯絡資訊**：電話、電子郵件、地址等
- **聯繫人資訊**：配偶、子女等親屬或照護者

## JSON 結構範例

\`\`\`json
{
  "resourceType": "Patient",
  "id": "P001",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2024-01-20T10:30:00+08:00",
    "profile": ["https://www.nhi.gov.tw/fhir/StructureDefinition/Patient"]
  },
  "identifier": [
    {
      "system": "https://www.nhi.gov.tw/identifiers/id",
      "value": "A123456789"
    },
    {
      "system": "https://hospital.example.org/identifiers/mrn",
      "value": "H-2024-001"
    }
  ],
  "name": [
    {
      "use": "official",
      "text": "王大明",
      "family": "王",
      "given": ["大", "明"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "0912345678"
    },
    {
      "system": "email",
      "value": "wang@example.org"
    }
  ],
  "gender": "male",
  "birthDate": "1980-05-15",
  "address": [
    {
      "use": "home",
      "text": "台北市信義區101號",
      "city": "台北市",
      "district": "信義區",
      "postalCode": "110"
    }
  ],
  "managingOrganization": {
    "reference": "Organization/ORG001",
    "display": "台北醫學中心"
  },
  "contact": [
    {
      "relationship": [
        {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
              "code": "N",
              "display": "Next-of-kin"
            }
          ]
        }
      ],
      "name": {
        "text": "王小美"
      },
      "telecom": [
        {
          "system": "phone",
          "value": "0987654321"
        }
      ]
    }
  ]
}
\`\`\`

## 常見使用場景

### 1. 患者掛號與初診
當患者首次就診或掛號時，建立或更新 Patient 資源，記錄患者的基本資訊。

### 2. 患者轉介
不同醫療機構之間轉介患者時，透過 Patient 資源交換患者的身份識別和聯絡資訊。

### 3. 遠距醫療
在遠距醫療系統中，確保患者的通訊方式是最新的（如電話號碼、電子郵件）。

### 4. 患者隱私管理
透過 identifier 的多個系統，支援不同隱私層級的識別方式。

## 重要欄位說明

| 欄位 | 必填 | 說明 |
|------|------|------|
| \`resourceType\` | ✓ | 固定為 "Patient" |
| \`identifier\` | | 患者的多個識別編號（如健保卡號、病歷號） |
| \`name\` | | 患者的姓名，可有多個（如官方名稱、昵稱） |
| \`gender\` | | 患者性別：male / female / other / unknown |
| \`birthDate\` | | 出生日期，格式為 YYYY-MM-DD |
| \`telecom\` | | 聯絡資訊，可包含電話、電子郵件、傳真等 |
| \`address\` | | 患者地址，可有多個 |
| \`managingOrganization\` | | 管理該患者的醫療機構 |
| \`contact\` | | 緊急聯絡人或相關人員 |

## 與其他資源的關聯

Patient 資源是許多其他資源的中心：

- **Observation**：由患者產生的臨床觀察結果
- **Encounter**：患者與醫療提供者的互動
- **Condition**：患者的病情診斷
- **MedicationRequest**：為患者開立的用藥處方
- **Appointment**：患者預約掛號

---

**延伸學習**：建立 Patient 資源時，建議遵循當地的醫療標準（如台灣健保署的規範）來設定 identifier 的 system URL。
`;export{e as default};