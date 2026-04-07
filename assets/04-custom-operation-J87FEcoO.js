var e=`# 自訂 Operation

## 核心概念

除了 FHIR 標準提供的內建操作（$validate、$everything、$expand），FHIR 伺服器和應用可以定義和實現**自訂操作**來滿足特定的業務需求。自訂操作允許開發者添加不符合標準 CRUD 模式的業務邏輯。

### 何時需要自訂 Operation？

自訂操作適合以下場景：

1. **複雜業務流程**：涉及多個資源的協調更新
   - 例：醫囑開立（同時涉及 MedicationRequest、Patient、Encounter 等）

2. **計算密集操作**：伺服器需要主動計算結果
   - 例：$calculate-drug-interaction（計算藥物交互作用）

3. **外部系統集成**：呼叫第三方 API 並返回結果
   - 例：$validate-insurance（驗證保險單有效性）

4. **自訂報告生成**：產生非標準格式的資訊
   - 例：$generate-clinical-summary（生成臨床摘要 PDF）

5. **批量操作**：一次性處理多筆資料
   - 例：$import-patient-batch（批量匯入患者）

## OperationDefinition 資源

自訂操作必須由 **OperationDefinition** 資源來定義，這是 FHIR 的規範文件。

### OperationDefinition 結構

\`\`\`json
{
  "resourceType": "OperationDefinition",
  "id": "patient-calculate-risk",
  "url": "http://example.org/fhir/OperationDefinition/patient-calculate-risk",
  "version": "1.0.0",
  "name": "CalculateRisk",
  "title": "Calculate Clinical Risk Score",
  "status": "active",
  "kind": "operation",
  "instance": true,
  "type": true,
  "system": false,
  "code": "calculate-risk",
  "description": "計算患者的臨床風險評分，基於患者的診斷、用藥和檢驗結果",
  "parameter": [
    {
      "name": "algorithm",
      "use": "in",
      "min": 1,
      "max": "1",
      "documentation": "選擇風險計算演算法 (CURB, PSI, NEWS)",
      "type": "code",
      "binding": {
        "strength": "required",
        "valueSet": "http://example.org/ValueSet/risk-algorithms"
      }
    },
    {
      "name": "includePrediction",
      "use": "in",
      "min": 0,
      "max": "1",
      "documentation": "是否包含預測結果",
      "type": "boolean"
    },
    {
      "name": "riskScore",
      "use": "out",
      "min": 1,
      "max": "1",
      "documentation": "計算出的風險評分（0-100）",
      "type": "decimal"
    },
    {
      "name": "riskLevel",
      "use": "out",
      "min": 1,
      "max": "1",
      "documentation": "風險等級：low, moderate, high, critical",
      "type": "code"
    },
    {
      "name": "recommendation",
      "use": "out",
      "min": 0,
      "max": "*",
      "documentation": "臨床建議",
      "type": "string"
    }
  ]
}
\`\`\`

### OperationDefinition 關鍵欄位

| 欄位 | 說明 |
|------|------|
| \`url\` | 操作的規範 URI（全球唯一標識） |
| \`name\` | 電腦友善名稱（用於代碼參考） |
| \`code\` | 操作碼（$後面的名稱） |
| \`instance\` | 是否可在資源實例上呼叫 (true) |
| \`type\` | 是否可在資源類型上呼叫 (true) |
| \`system\` | 是否可在系統層級呼叫 (true) |
| \`parameter\` | 輸入/輸出參數定義陣列 |

### 參數定義詳解

| 屬性 | 說明 |
|------|------|
| \`name\` | 參數名稱 |
| \`use\` | \`in\`（輸入）或 \`out\`（輸出） |
| \`min\` / \`max\` | 必需性（min≥1 為必須，max="*" 為多個） |
| \`type\` | 資料型別（string, integer, code, Resource 等） |
| \`binding\` | 如果是 code，可綁定 ValueSet |

## Parameters 資源

操作的實際輸入輸出是透過 **Parameters** 資源傳遞的。

### Parameters 結構

\`\`\`json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "algorithm",
      "valueCode": "CURB"
    },
    {
      "name": "includePrediction",
      "valueBoolean": true
    }
  ]
}
\`\`\`

### 回應 Parameters

\`\`\`json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "riskScore",
      "valueDecimal": 72.5
    },
    {
      "name": "riskLevel",
      "valueCode": "high"
    },
    {
      "name": "recommendation",
      "valueString": "建議轉至加護病房觀察"
    },
    {
      "name": "recommendation",
      "valueString": "定期監測生命徵象"
    }
  ]
}
\`\`\`

## 操作 URI 格式

根據 OperationDefinition 的設定，操作可在不同層級呼叫：

### 系統層級操作

\`\`\`
POST [base]/$[code]
例：POST https://hapi.fhir.org/baseR4/$batch-process
\`\`\`

### 資源類型操作

\`\`\`
POST [base]/[ResourceType]/$[code]
例：POST https://hapi.fhir.org/baseR4/Patient/$calculate-risk
\`\`\`

### 資源實例操作

\`\`\`
POST [base]/[ResourceType]/[id]/$[code]
例：POST https://hapi.fhir.org/baseR4/Patient/123/$calculate-risk
\`\`\`

## 實戰範例

### 範例 1：患者風險評分計算

**OperationDefinition（由伺服器定義）：**

已在前面展示。

**客戶端請求：**

\`\`\`http
POST /baseR4/Patient/123/$calculate-risk
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "algorithm",
      "valueCode": "CURB"
    },
    {
      "name": "includePrediction",
      "valueBoolean": true
    }
  ]
}
\`\`\`

**伺服器回應：**

\`\`\`json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "riskScore",
      "valueDecimal": 72.5
    },
    {
      "name": "riskLevel",
      "valueCode": "high"
    },
    {
      "name": "recommendation",
      "valueString": "建議立即轉至加護病房"
    },
    {
      "name": "recommendation",
      "valueString": "定期監測生命徵象及電解質"
    }
  ]
}
\`\`\`

### 範例 2：批量患者匯入

**OperationDefinition：**

\`\`\`json
{
  "resourceType": "OperationDefinition",
  "url": "http://example.org/fhir/OperationDefinition/import-patients",
  "name": "ImportPatients",
  "code": "import-patients",
  "system": true,
  "parameter": [
    {
      "name": "patients",
      "use": "in",
      "min": 1,
      "max": "*",
      "type": "Patient"
    },
    {
      "name": "totalCreated",
      "use": "out",
      "min": 1,
      "max": "1",
      "type": "integer"
    },
    {
      "name": "totalFailed",
      "use": "out",
      "min": 1,
      "max": "1",
      "type": "integer"
    },
    {
      "name": "errors",
      "use": "out",
      "min": 0,
      "max": "*",
      "type": "OperationOutcome"
    }
  ]
}
\`\`\`

**請求：**

\`\`\`http
POST /baseR4/$import-patients
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "patients",
      "resource": {
        "resourceType": "Patient",
        "name": [{"given": ["Alice"], "family": "Smith"}]
      }
    },
    {
      "name": "patients",
      "resource": {
        "resourceType": "Patient",
        "name": [{"given": ["Bob"], "family": "Jones"}]
      }
    }
  ]
}
\`\`\`

**回應：**

\`\`\`json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "totalCreated",
      "valueInteger": 2
    },
    {
      "name": "totalFailed",
      "valueInteger": 0
    }
  ]
}
\`\`\`

### 範例 3：查詢操作（查詢複雜患者資訊）

有時操作用於復雜查詢而非資源修改：

**OperationDefinition：**

\`\`\`json
{
  "resourceType": "OperationDefinition",
  "url": "http://example.org/fhir/OperationDefinition/patient-summary",
  "name": "PatientSummary",
  "code": "patient-summary",
  "instance": true,
  "parameter": [
    {
      "name": "includeAllergies",
      "use": "in",
      "type": "boolean"
    },
    {
      "name": "summary",
      "use": "out",
      "type": "string",
      "documentation": "患者臨床摘要（支援 Markdown 格式）"
    }
  ]
}
\`\`\`

**請求：**

\`\`\`http
POST /baseR4/Patient/123/$patient-summary
Content-Type: application/fhir+json

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "includeAllergies",
      "valueBoolean": true
    }
  ]
}
\`\`\`

**回應：**

\`\`\`json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "summary",
      "valueString": "# 患者摘要\\n\\n## 基本資料\\n- 姓名：John Doe\\n- 年齡：43 歲\\n- 性別：男性\\n\\n## 活躍診斷\\n- 糖尿病 (SNOMED: 44054006)\\n- 高血壓 (SNOMED: 38341003)\\n\\n## 過敏紀錄\\n- 盤尼西林（中度過敏反應）\\n- 磺胺類藥物（重度過敏反應）\\n\\n## 目前用藥\\n- 美特福明 500mg 每日一次\\n- 氯沙坦 50mg 每日一次"
    }
  ]
}
\`\`\`

## 實作範例（JavaScript 客戶端）

### 基本呼叫

\`\`\`typescript
async function callCustomOperation(
  baseUrl: string,
  resourceType: string,
  resourceId: string | null,
  operationName: string,
  parameters: Record<string, any>
): Promise<any> {
  // 組織 URI
  let url = \`\${baseUrl}\`;
  if (resourceType) {
    url += \`/\${resourceType}\`;
    if (resourceId) {
      url += \`/\${resourceId}\`;
    }
  }
  url += \`/$\${operationName}\`;
  
  // 將參數轉換為 Parameters 資源
  const parametersResource = {
    resourceType: 'Parameters',
    parameter: Object.entries(parameters).map(([name, value]) => ({
      name,
      ['value' + getTypeFromValue(value)]: value
    }))
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/fhir+json' },
    body: JSON.stringify(parametersResource)
  });
  
  if (!response.ok) {
    throw new Error(\`Operation failed: \${response.statusText}\`);
  }
  
  return await response.json();
}

function getTypeFromValue(value: any): string {
  if (typeof value === 'string') return 'String';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'Integer' : 'Decimal';
  }
  if (typeof value === 'boolean') return 'Boolean';
  if (value && typeof value === 'object') {
    return value.resourceType ? 'Resource' : 'String'; // 簡化處理
  }
  return 'String';
}

// 使用示例：計算風險評分
const result = await callCustomOperation(
  'https://hapi.fhir.org/baseR4',
  'Patient',
  '123',
  'calculate-risk',
  {
    algorithm: 'CURB',
    includePrediction: true
  }
);

console.log(\`風險評分：\${result.parameter[0].valueDecimal}\`);
console.log(\`風險等級：\${result.parameter[1].valueCode}\`);
\`\`\`

### 進階使用：處理複雜輸出

\`\`\`typescript
interface RiskCalculationResult {
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  recommendations: string[];
}

async function calculatePatientRisk(
  patientId: string,
  baseUrl: string,
  algorithm: 'CURB' | 'PSI' | 'NEWS'
): Promise<RiskCalculationResult> {
  const response = await callCustomOperation(
    baseUrl,
    'Patient',
    patientId,
    'calculate-risk',
    { algorithm, includePrediction: true }
  );
  
  // 解析 Parameters 回應
  const parameters = response.parameter || [];
  const result: RiskCalculationResult = {
    riskScore: 0,
    riskLevel: 'low',
    recommendations: []
  };
  
  for (const param of parameters) {
    switch (param.name) {
      case 'riskScore':
        result.riskScore = param.valueDecimal;
        break;
      case 'riskLevel':
        result.riskLevel = param.valueCode;
        break;
      case 'recommendation':
        result.recommendations.push(param.valueString);
        break;
    }
  }
  
  return result;
}

// 使用
const risk = await calculatePatientRisk('123', baseUrl, 'CURB');
console.log(\`風險等級：\${risk.riskLevel}\`);
risk.recommendations.forEach(rec => console.log(\`- \${rec}\`));
\`\`\`

### 伺服器端實現示例（Node.js）

\`\`\`typescript
// Express.js 路由
app.post('/fhir/Patient/:id/$calculate-risk', async (req, res) => {
  const { id } = req.params;
  const { parameter } = req.body;
  
  // 解析輸入參數
  const algorithm = parameter?.find(p => p.name === 'algorithm')?.valueCode;
  const includePrediction = parameter?.find(p => p.name === 'includePrediction')?.valueBoolean;
  
  try {
    // 從資料庫取得患者
    const patient = await getPatient(id);
    
    // 計算風險分數
    const conditions = await getPatientConditions(id);
    const medications = await getPatientMedications(id);
    const observations = await getPatientObservations(id);
    
    const riskScore = calculateRisk(
      algorithm,
      { conditions, medications, observations }
    );
    
    // 生成建議
    const recommendations = generateRecommendations(riskScore, conditions);
    
    // 回應 Parameters 資源
    const response = {
      resourceType: 'Parameters',
      parameter: [
        { name: 'riskScore', valueDecimal: riskScore },
        {
          name: 'riskLevel',
          valueCode: riskScore < 30 ? 'low' : 
                     riskScore < 60 ? 'moderate' :
                     riskScore < 80 ? 'high' : 'critical'
        },
        ...recommendations.map(rec => ({
          name: 'recommendation',
          valueString: rec
        }))
      ]
    };
    
    res.json(response);
  } catch (error) {
    res.status(400).json({
      resourceType: 'OperationOutcome',
      issue: [{
        severity: 'error',
        code: 'processing',
        diagnostics: error.message
      }]
    });
  }
});
\`\`\`

## CapabilityStatement 宣告

伺服器透過 **CapabilityStatement** 資源宣告支援的自訂操作：

\`\`\`json
{
  "resourceType": "CapabilityStatement",
  "rest": [
    {
      "mode": "server",
      "operation": [
        {
          "name": "Calculate Risk",
          "definition": "http://example.org/fhir/OperationDefinition/patient-calculate-risk"
        },
        {
          "name": "Patient Summary",
          "definition": "http://example.org/fhir/OperationDefinition/patient-summary"
        }
      ]
    }
  ]
}
\`\`\`

## 常見使用場景

### 場景 1：臨床決策支援

調用 $calculate-risk、$drug-interaction-check 等操作，在醫囑下達時提供決策支持。

### 場景 2：報告生成

$generate-discharge-summary、$generate-pdf-report 等，無需下載資料再轉換格式。

### 場景 3：資料同步與遷移

$export-data、$import-patients 等批量操作，簡化機構間資料轉移。

### 場景 4：複雜查詢

$patient-summary、$medication-timeline 等，一次性取得複雜聚合資料。

### 場景 5：外部系統整合

$validate-insurance、$check-prior-authorization 等，透明地整合保險或核保系統。

## 設計最佳實踐

| 做法 | 說明 |
|------|------|
| ✅ 清楚定義 OperationDefinition | 文檔完整，參數明確 |
| ✅ 使用適當的 HTTP 方法 | 無副作用用 GET，有副作用用 POST |
| ✅ 返回 Parameters 或單一資源 | 按規範返回，不要自訂 JSON |
| ✅ 在 CapabilityStatement 宣告 | 讓客戶端能發現操作 |
| ✅ 完善的錯誤處理 | 返回 OperationOutcome，診斷訊息清楚 |
| ❌ 濫用操作代替業務邏輯 | 簡單的 CRUD 改用標準 REST |
| ❌ 操作參數過於複雜 | 保持簡單，避免嵌套過深 |
| ❌ 忽視效能 | 長時運行的操作應提供非同步選項 |

## 小結

自訂操作是 FHIR 的強大延伸機制，允許開發者：
- 實現組織特定的業務邏輯
- 簡化複雜的多資源操作
- 無縫整合外部系統
- 提供豐富的應用層功能
`;export{e as default};