var e=`# $everything 操作

## 核心概念

**$everything** 是一個專為 Patient 資源設計的操作，用於在單一請求中檢索與該患者相關的**所有臨床資訊**。與傳統的多個 search API 不同，$everything 提供了一個簡潔有力的方式來獲取患者的完整醫療記錄。

### 為什麼需要 $everything？

在現實世界的電子健康紀錄（EHR）系統中，患者的訊息分散在多個資源中：

- 患者基本資料：**Patient**
- 診斷記錄：**Condition**
- 觀察紀錄：**Observation**
- 醫囑：**MedicationRequest**, **Procedure Order**
- 就診歷史：**Encounter**
- 用藥記錄：**MedicationStatement**
- 檢驗結果：**DiagnosticReport**

$everything 會自動幫你蒐集所有這些相關資源，免去繁瑣的多次 API 呼叫。

## 操作 URI

\`\`\`
GET [base]/Patient/$everything
GET [base]/Patient/[id]/$everything
\`\`\`

### 例子

\`\`\`
GET https://hapi.fhir.org/baseR4/Patient/$everything
GET https://hapi.fhir.org/baseR4/Patient/123/$everything
\`\`\`

## 輸入參數

| 參數 | 型別 | 說明 |
|------|------|------|
| \`start\` | date | 護理日期範圍的起始日期 (yyyy-MM-dd) |
| \`end\` | date | 護理日期範圍的結束日期 (yyyy-MM-dd) |
| \`_since\` | instant | 返回此時刻之後更新的資源 (ISO-8601 format) |
| \`_type\` | code | 限制返回的資源類型（如 Observation, Condition） |
| \`_count\` | integer | 分頁時每頁返回的筆數（預設由伺服器決定） |
| \`_sort\` | string | 排序方式（如 date, -date） |

### 參數說明

**start / end:**
- 用於指定患者護理相關事件的日期範圍
- 格式：\`YYYY-MM-DD\`
- 例：\`start=2020-01-01&end=2023-12-31\`

**_since:**
- 用於增量同步，只取得最近更新的資源
- 格式：ISO-8601 instant (如 \`2023-01-01T00:00:00Z\`)

**_type:**
- 多個值用逗號分隔：\`_type=Observation,Condition\`
- 節省頻寬，只返回需要的資源類型

**_count:**
- 支援分頁。伺服器可能忽略此參數並返回更少結果

## 回應內容

$everything 返回一個 **searchset** 類型的 Bundle，包含：

### Bundle 結構

\`\`\`json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 42,
  "link": [
    {
      "relation": "self",
      "url": "https://hapi.fhir.org/baseR4/Patient/123/$everything"
    },
    {
      "relation": "next",
      "url": "https://hapi.fhir.org/baseR4/Patient/123/$everything?_count=10&__offset=10"
    }
  ],
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "123",
        "name": [{"given": ["John"], "family": "Doe"}]
      }
    },
    {
      "resource": {
        "resourceType": "Condition",
        "id": "c-1",
        "subject": {"reference": "Patient/123"},
        "code": {
          "coding": [{
            "system": "http://snomed.info/sct",
            "code": "44054006",
            "display": "Diabetes mellitus type 2"
          }]
        },
        "onsetDateTime": "2010-05-05"
      }
    },
    {
      "resource": {
        "resourceType": "Observation",
        "id": "obs-1",
        "subject": {"reference": "Patient/123"},
        "code": {
          "coding": [{
            "system": "http://loinc.org",
            "code": "2345-7",
            "display": "Glucose"
          }]
        },
        "valueQuantity": {
          "value": 95,
          "unit": "mg/dL"
        },
        "effectiveDateTime": "2023-12-15T10:30:00Z"
      }
    }
  ]
}
\`\`\`

### 關鍵 Bundle 元素

| 元素 | 說明 |
|------|------|
| \`total\` | 符合條件的總資源數 |
| \`entry\` | 返回的資源陣列，第一筆必是 Patient 本身 |
| \`link\` | 分頁連結（self, next, previous） |

## 實戰範例

### 1. 簡單查詢：獲取患者的所有資訊

\`\`\`http
GET /baseR4/Patient/123/$everything
\`\`\`

**用途：** 臨床醫生登入後，一次性加載患者的完整資料檢視。

### 2. 日期範圍查詢

\`\`\`http
GET /baseR4/Patient/123/$everything?start=2023-01-01&end=2023-12-31
\`\`\`

**用途：** 查詢某個年份的患者紀錄，用於年度健檢報告。

### 3. 增量同步（使用 _since）

\`\`\`http
GET /baseR4/Patient/123/$everything?_since=2023-12-01T00:00:00Z
\`\`\`

**用途：** 行動應用每天同步患者的最新資料，只取得新增或修改的資源。

### 4. 篩選特定資源類型

\`\`\`http
GET /baseR4/Patient/123/$everything?_type=Observation,DiagnosticReport
\`\`\`

**用途：** 只取得檢驗結果和診斷報告，不需要診斷或用藥資訊。

### 5. 結合分頁

\`\`\`http
GET /baseR4/Patient/123/$everything?_count=20&__offset=0
\`\`\`

**用途：** 大量資料時分頁取得，避免一次傳輸過大的 response。

## 實作範例（JavaScript）

### 基本使用

\`\`\`typescript
async function getPatientEverything(patientId: string, baseUrl: string) {
  const url = \`\${baseUrl}/Patient/\${patientId}/$everything\`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/fhir+json'
    }
  });
  
  if (!response.ok) {
    throw new Error(\`Failed to fetch: \${response.statusText}\`);
  }
  
  const bundle = await response.json();
  return bundle.entry.map(entry => entry.resource);
}

// 使用示例
const resources = await getPatientEverything(
  '123',
  'https://hapi.fhir.org/baseR4'
);

console.log(\`取得 \${resources.length} 筆資源\`);
\`\`\`

### 進階使用：過濾和組織資料

\`\`\`typescript
interface PatientData {
  patient: any;
  conditions: any[];
  observations: any[];
  encounters: any[];
  medications: any[];
  diagnosticReports: any[];
}

async function getStructuredPatientData(
  patientId: string,
  baseUrl: string,
  dateRange?: { start: string; end: string }
): Promise<PatientData> {
  let url = \`\${baseUrl}/Patient/\${patientId}/$everything\`;
  
  // 添加日期範圍參數
  if (dateRange) {
    const params = new URLSearchParams({
      start: dateRange.start,
      end: dateRange.end
    });
    url += \`?\${params.toString()}\`;
  }
  
  const response = await fetch(url, {
    headers: { 'Accept': 'application/fhir+json' }
  });
  
  const bundle = await response.json();
  
  // 按資源類型組織資料
  const data: PatientData = {
    patient: null,
    conditions: [],
    observations: [],
    encounters: [],
    medications: [],
    diagnosticReports: []
  };
  
  for (const entry of bundle.entry || []) {
    const resource = entry.resource;
    
    switch (resource.resourceType) {
      case 'Patient':
        data.patient = resource;
        break;
      case 'Condition':
        data.conditions.push(resource);
        break;
      case 'Observation':
        data.observations.push(resource);
        break;
      case 'Encounter':
        data.encounters.push(resource);
        break;
      case 'MedicationRequest':
      case 'MedicationStatement':
        data.medications.push(resource);
        break;
      case 'DiagnosticReport':
        data.diagnosticReports.push(resource);
        break;
    }
  }
  
  return data;
}

// 使用示例：取得 2023 年全年資料
const data = await getStructuredPatientData('123', 'https://hapi.fhir.org/baseR4', {
  start: '2023-01-01',
  end: '2023-12-31'
});

console.log(\`患者: \${data.patient.name[0].given[0]} \${data.patient.name[0].family}\`);
console.log(\`診斷條件: \${data.conditions.length} 筆\`);
console.log(\`觀察紀錄: \${data.observations.length} 筆\`);
\`\`\`

### 實即時同步機制

\`\`\`typescript
async function syncPatientDataIncremental(
  patientId: string,
  baseUrl: string,
  lastSyncTime: string // ISO-8601 format
) {
  const url = new URL(
    \`\${baseUrl}/Patient/\${patientId}/$everything\`
  );
  url.searchParams.set('_since', lastSyncTime);
  url.searchParams.set('_type', 'Condition,Observation,Encounter'); // 只同步必要資源
  
  const response = await fetch(url.toString());
  const bundle = await response.json();
  
  // 更新本地資料庫
  for (const entry of bundle.entry || []) {
    await updateLocalDatabase(entry.resource);
  }
  
  // 記錄同步時間
  localStorage.setItem(
    \`lastSync_\${patientId}\`,
    new Date().toISOString()
  );
}
\`\`\`

## 常見使用場景

### 場景 1：患者授權數據下載（藍按鈕）

患者在健保系統、醫療入口網站上點擊「下載我的資料」，系統調用 $everything 生成 PDF 或 CSV。

### 場景 2：轉介醫院資料轉移

患者轉院時，接收醫院透過 $everything 一次性獲取患者的完整病歷摘要。

### 場景 3：行動 App 離線同步

行動應用定期調用 $everything?_since=..., 只下載最新資料到本地存儲，實現離線瀏覽。

### 場景 4：臨床決策支援系統（CDSS）

CDSS 引擎需要患者的全面資訊（診斷、用藥、過敏史）來推薦治療方案，$everything 是最直接的數據來源。

### 場景 5：數據分析與品質監控

醫療機構定期抽樣患者的 $everything 資料進行品質稽核，檢查資料完整性和準確度。

## 效能考量

| 考量 | 建議 |
|------|------|
| 大量患者資料 | 使用 \`_count\` 分頁，避免單次回應過大 |
| 減少傳輸量 | 使用 \`_type\` 篩選不必要的資源 |
| 增量更新 | 使用 \`_since\` 只取最新資料 |
| 日期範圍 | 指定 \`start/end\` 限制歷史資料範圍 |
| 快取策略 | 將 Patient 本身快取，定期用 _since 同步變更 |

## 最佳實踐

| 做法 | 說明 |
|------|------|
| ✅ 指定 _type | 明確指定需要的資源類型，減少服務器工作量 |
| ✅ 使用日期範圍 | 避免查詢遠古資料，提升性能 |
| ✅ 實現分頁 | 對大量結果進行分頁處理，改善用戶體驗 |
| ✅ 快取患者本體 | Patient 資訊變更不頻繁，可長期快取 |
| ❌ 頻繁全量查詢 | 改用 _since 進行增量更新 |
| ❌ 忽視回應大小 | 監控回應體積，大量患者時務必分頁 |

## 小結

$everything 是構建完整患者視圖的最有效工具。掌握它能：
- 簡化複雜的多資源查詢邏輯
- 提升患者資料應用的開發效率
- 降低伺服器和網路負擔
`;export{e as default};