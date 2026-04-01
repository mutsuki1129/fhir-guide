# $validate 操作

## 核心概念

**$validate** 是 FHIR 中最常用的操作之一，用於驗證資源內容是否符合 FHIR 規範或特定的 Profile。它讓開發者在實際創建、更新資源前，能先進行驗證檢查，確保資料的正確性。

### 主要特徵

- **無副作用**：$validate 不會修改或保存任何資源，只進行驗證檢查
- **多層驗證**：支援通用驗證、create、update、delete 三種模式
- **Profile 驗證**：可指定特定的 Profile 進行驗證
- **詳細錯誤報告**：返回 OperationOutcome，包含具體的驗證錯誤及警告

## 操作 URI

```
GET/POST [base]/[Resource]/$validate
GET/POST [base]/[Resource]/[id]/$validate
```

### 例子

```
POST https://hapi.fhir.org/baseR4/Patient/$validate
POST https://hapi.fhir.org/baseR4/Patient/123/$validate
```

## 輸入參數

| 參數 | 型別 | 必須 | 說明 |
|------|------|------|------|
| `resource` | Resource | 否* | 要驗證的資源內容。delete 模式下可省略 |
| `mode` | code | 否 | 驗證模式：`create`、`update`、`delete`、或省略（通用驗證） |
| `profile` | uri | 否 | 驗證的目標 Profile URI（如不指定則用預設） |
| `usageContext` | UsageContext | 否 | 使用環境，影響 ValueSet binding 的驗證 |

*在 delete 模式下可省略 resource 參數，其他模式則必須提供

## 回應內容

$validate 總是返回 HTTP 200 OK（除非有嚴重錯誤），內容為 **OperationOutcome** 資源。

### OperationOutcome 結構

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "diagnostics": "Patient.name: minimum required = 1, but only found 0",
      "location": ["Patient.name"]
    },
    {
      "severity": "warning",
      "code": "structure",
      "diagnostics": "Patient.contact: contains incomplete contact information"
    }
  ]
}
```

### Severity 級別

| 級別 | 說明 |
|------|------|
| `error` | 致命錯誤，資源無法被建立/更新 |
| `warning` | 警告，資源可能有問題但可接受 |
| `information` | 資訊提示，無影響 |
| `success` | 驗證成功（無錯誤時可能出現） |

### 判斷驗證結果

驗證成功的標誌：
- 回應中 `issue` 陣列為空，或
- 最高級別的 severity 不高於 `warning`

## 實戰範例

### 1. 驗證有效的 Patient

**Request:**
```http
POST /baseR4/Patient/$validate
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "name": [{
    "use": "official",
    "given": ["John"],
    "family": "Doe"
  }],
  "gender": "male",
  "birthDate": "1980-01-01"
}
```

**Response:**
```json
{
  "resourceType": "OperationOutcome",
  "issue": []
}
```

### 2. 驗證無效的 Patient（缺少必要欄位）

**Request:**
```http
POST /baseR4/Patient/$validate
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "gender": "male"
}
```

**Response:**
```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "required",
      "diagnostics": "Patient.identifier or Patient.name: one of these SHALL be present",
      "expression": ["Patient"]
    }
  ]
}
```

### 3. Create 模式驗證

在 create 模式下，伺服器會額外檢查資源在創建時的合法性：

```http
POST /baseR4/Patient/$validate?mode=create
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "id": "new-id",
  "name": [{"given": ["Jane"], "family": "Smith"}],
  "gender": "female"
}
```

**Response:**
```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "information",
      "code": "create",
      "diagnostics": "Patient.id: should not be specified during creation (server will assign ID)"
    }
  ]
}
```

### 4. Update 模式驗證

Update 模式需要在已有資源的基礎上進行驗證：

```http
POST /baseR4/Patient/123/$validate?mode=update
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "id": "123",
  "name": [{"given": ["Jane"], "family": "Smith"}],
  "gender": "female"
}
```

### 5. 指定 Profile 驗證

驗證資源是否符合特定的 FHIR Profile：

```http
POST /baseR4/Patient/$validate?profile=http://hl7.org/fhir/StructureDefinition/us-core-patient
Content-Type: application/fhir+json

{
  "resourceType": "Patient",
  "identifier": [{
    "system": "http://hl7.org/fhir/sid/us-ssn",
    "value": "123-45-6789"
  }],
  "name": [{"given": ["John"], "family": "Doe"}],
  "gender": "male",
  "birthDate": "1980-01-01"
}
```

## 常見使用場景

### 場景 1：表單提交驗證

在前端表單提交前，先調用 $validate 檢查資料合法性，提供即時反饋給使用者。

```typescript
async function validatePatientForm(formData) {
  const response = await fetch(
    'https://hapi.fhir.org/baseR4/Patient/$validate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify(formData)
    }
  );
  
  const outcome = await response.json();
  return outcome.issue.length === 0; // 驗證成功
}
```

### 場景 2：批量資料匯入前檢查

在匯入大量資料前，批量驗證每筆記錄，標記錯誤資料以供修正：

```typescript
async function validateBatch(resources) {
  const results = [];
  
  for (const resource of resources) {
    const response = await fetch(
      `https://hapi.fhir.org/baseR4/${resource.resourceType}/$validate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/fhir+json' },
        body: JSON.stringify(resource)
      }
    );
    
    const outcome = await response.json();
    results.push({
      resource,
      valid: outcome.issue.every(i => i.severity !== 'error'),
      errors: outcome.issue.filter(i => i.severity === 'error')
    });
  }
  
  return results;
}
```

### 場景 3：Profile 遵循性檢查

驗證資源是否符合組織特定的 FHIR Profile（如台灣 TW Core IG）：

```typescript
const TWCoreProfile = 'http://tw.fhir.org/core/StructureDefinition/tw-core-patient';

async function validateWithTWCoreProfile(patient) {
  const response = await fetch(
    `https://hapi.fhir.org/baseR4/Patient/$validate?profile=${encodeURIComponent(TWCoreProfile)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/fhir+json' },
      body: JSON.stringify(patient)
    }
  );
  
  const outcome = await response.json();
  return outcome;
}
```

## 最佳實踐

| 做法 | 說明 |
|------|------|
| ✅ 提前驗證 | 在 create/update 之前先驗證，減少伺服器往返 |
| ✅ 指定 Profile | 若有特定的 Profile 需求，主動指定以取得更精準的驗證 |
| ✅ 處理警告 | 即使沒有 error，也要檢查 warning 級別的訊息 |
| ❌ 驗證代替業務檢查 | $validate 只檢查 FHIR 合規性，不能替代業務邏輯驗證 |
| ❌ 過度依賴 | 不要在每個操作都驗證，只在必要時驗證（如批量匯入） |

## 小結

$validate 是確保 FHIR 資源品質的關鍵工具。掌握它能幫助你：
- 減少無效資料進入系統
- 提升前端使用者體驗
- 簡化後續的資料清潔工作
