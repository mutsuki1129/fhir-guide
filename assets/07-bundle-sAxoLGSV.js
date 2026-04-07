var e=`# Bundle Resource

Bundle 資源是一個容器，用於將多個資源組合在一起，作為單一單元進行傳輸或存儲。它不遵循一般 DomainResource 的繼承，是一個特殊的資源類型。

## 核心概念

Bundle 的主要用途：
- **搜尋結果集合**：查詢資料庫後返回多個 Observation、Patient 等資源
- **交易處理**：原子性地建立、更新或刪除多個相關資源
- **文件封裝**：將 Composition 和其他相關資源打包成完整的臨床文件
- **訊息交換**：傳遞包含 MessageHeader 的訊息和相關資源
- **批次處理**：一次性提交多個獨立的操作

## JSON 結構範例

### 搜尋結果 Bundle
\`\`\`json
{
  "resourceType": "Bundle",
  "id": "search-result-001",
  "meta": {
    "lastUpdated": "2024-01-20T10:45:00+08:00"
  },
  "type": "searchset",
  "total": 2,
  "link": [
    {
      "relation": "self",
      "url": "https://hospital.example.org/fhir/Patient?gender=male"
    },
    {
      "relation": "next",
      "url": "https://hospital.example.org/fhir/Patient?gender=male&page=2"
    }
  ],
  "entry": [
    {
      "fullUrl": "https://hospital.example.org/fhir/Patient/P001",
      "resource": {
        "resourceType": "Patient",
        "id": "P001",
        "name": [
          {
            "text": "王大明"
          }
        ],
        "gender": "male"
      },
      "search": {
        "mode": "match",
        "score": 1.0
      }
    },
    {
      "fullUrl": "https://hospital.example.org/fhir/Patient/P002",
      "resource": {
        "resourceType": "Patient",
        "id": "P002",
        "name": [
          {
            "text": "李小明"
          }
        ],
        "gender": "male"
      },
      "search": {
        "mode": "match",
        "score": 0.95
      }
    }
  ]
}
\`\`\`

### 交易 Bundle（Atomic Transaction）
\`\`\`json
{
  "resourceType": "Bundle",
  "id": "transaction-001",
  "type": "transaction",
  "entry": [
    {
      "fullUrl": "urn:uuid:patient-new",
      "resource": {
        "resourceType": "Patient",
        "name": [
          {
            "text": "張三"
          }
        ],
        "gender": "female",
        "birthDate": "1990-05-20"
      },
      "request": {
        "method": "POST",
        "url": "Patient"
      }
    },
    {
      "fullUrl": "urn:uuid:encounter-new",
      "resource": {
        "resourceType": "Encounter",
        "status": "finished",
        "class": {
          "code": "AMB"
        },
        "subject": {
          "reference": "urn:uuid:patient-new"
        },
        "period": {
          "start": "2024-01-20T09:00:00+08:00",
          "end": "2024-01-20T09:45:00+08:00"
        }
      },
      "request": {
        "method": "POST",
        "url": "Encounter"
      }
    },
    {
      "fullUrl": "urn:uuid:observation-new",
      "resource": {
        "resourceType": "Observation",
        "status": "final",
        "code": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "8480-6"
            }
          ]
        },
        "subject": {
          "reference": "urn:uuid:patient-new"
        },
        "encounter": {
          "reference": "urn:uuid:encounter-new"
        },
        "valueQuantity": {
          "value": 130,
          "unit": "mmHg"
        }
      },
      "request": {
        "method": "POST",
        "url": "Observation"
      }
    }
  ]
}
\`\`\`

### 批次 Bundle（Batch）
\`\`\`json
{
  "resourceType": "Bundle",
  "type": "batch",
  "entry": [
    {
      "fullUrl": "https://hospital.example.org/fhir/Patient/P001",
      "request": {
        "method": "GET",
        "url": "Patient/P001"
      }
    },
    {
      "fullUrl": "https://hospital.example.org/fhir/Observation/OBS001",
      "request": {
        "method": "GET",
        "url": "Observation/OBS001"
      }
    },
    {
      "resource": {
        "resourceType": "Observation",
        "id": "OBS002",
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
          "value": 95
        }
      },
      "request": {
        "method": "PUT",
        "url": "Observation/OBS002"
      }
    }
  ]
}
\`\`\`

## Bundle 類型說明

| 類型 | 用途 | 特點 |
|------|------|------|
| \`searchset\` | 搜尋結果 | 包含搜尋結果和評分 |
| \`transaction\` | 原子性交易 | 所有操作成功或全部失敗 |
| \`batch\` | 批次處理 | 獨立執行，一個失敗不影響其他 |
| \`message\` | 訊息交換 | 第一個 entry 必須是 MessageHeader |
| \`document\` | 文件 | 第一個 entry 必須是 Composition |
| \`collection\` | 資源集合 | 無特定順序，供人類或系統瀏覽 |
| \`history\` | 版本歷史 | 特定資源的版本歷史 |

## 重要欄位說明

### Bundle 級別
| 欄位 | 必填 | 說明 |
|------|------|------|
| \`type\` | ✓ | Bundle 類型 |
| \`total\` | | 搜尋結果時的總數量 |
| \`link\` | | 導覽連結（如分頁、下一頁） |
| \`entry\` | | 包含的資源清單 |

### Entry 級別
| 欄位 | 說明 |
|------|------|
| \`fullUrl\` | 資源的完整 URL 或 URN |
| \`resource\` | 實際的資源內容 |
| \`request\` | 該 entry 的 HTTP 請求方法和 URL |
| \`response\` | 該 entry 的 HTTP 回應狀態 |
| \`search\` | 搜尋相關資訊（如匹配分數） |

## 常見使用場景

### 1. RESTful API 搜尋結果
\`\`\`
GET /fhir/Patient?gender=male
↓
返回 searchset Bundle，包含所有符合條件的 Patient
\`\`\`

### 2. 患者就診記錄完整提交
醫院系統在患者完成就診後，一次性提交：
- Patient
- Encounter
- 多個 Observation
- Condition
- MedicationRequest

使用 \`transaction\` Bundle 確保原子性。

### 3. 多筆資料批次更新
使用 \`batch\` Bundle 更新多個 Observation 記錄，每筆更新獨立執行。

### 4. 臨床文件交換
使用 \`document\` Bundle 傳輸完整的臨床文件（如出院摘要）：
- Composition（文件結構）
- Patient（患者資訊）
- Encounter（就診記錄）
- 其他相關資源

### 5. 醫療訊息傳遞
使用 \`message\` Bundle 在醫療系統之間傳遞事件通知：
- MessageHeader（訊息頭）
- Patient（患者資訊）
- Encounter（相關就診）

## Bundle 與 Contained Resource 的區別

| 特性 | Bundle | Contained |
|------|--------|-----------|
| **資源自主性** | 資源可獨立存在 | 資源只存在於容器內 |
| **訪問方式** | 可直接透過 RESTful API 訪問 | 只能透過容器訪問 |
| **用途** | 傳輸多個相關資源 | 封裝輔助性資源 |

## 交易 Bundle 的執行流程

\`\`\`
1. 提交 transaction Bundle
         ↓
2. 伺服器驗證所有 entry
         ↓
   驗證失敗？→ 返回錯誤，不執行任何操作
         ↓
   驗證成功？↓
         ↓
3. 原子性執行所有操作（全部成功或全部失敗）
         ↓
4. 返回 Bundle（包含各 entry 的執行結果）
\`\`\`

## 與其他資源的關聯

Bundle 可包含任何類型的 FHIR 資源：
- 臨床資源：Patient、Observation、Condition 等
- 行政資源：Encounter、Appointment 等
- 文件資源：Composition、DocumentReference 等

---

**提示**：
- 使用 \`transaction\` Bundle 進行對一致性要求高的操作
- 使用 \`batch\` Bundle 進行大量獨立操作
- 在 \`transaction\` Bundle 中，可使用 \`urn:uuid:\` 格式的 fullUrl 進行內部資源參照
`;export{e as default};