# Scopes 與權限控制

## 什麼是 Scope？

**Scope**（作用範圍）定義了應用程式被授予的確切權限。通過 Scopes，患者可以精確控制應用程式能做什麼，而不是盲目地給予應用程式對整個病歷的訪問權限。

### Scope 的作用

1. **最小權限原則** — 應用程式只獲得完成工作所需的最小權限
2. **患者隱私** — 患者可以拒絕應用程式訪問敏感資訊（如心理健康記錄）
3. **安全性** — 即使應用程式被破壞，洩露的數據範圍也是有限的
4. **透明度** — 患者清楚地看到應用程式會存取什麼

## Scope 語法

SMART on FHIR 的 Scope 遵循統一的語法：

```
<context>/<resource>.<permissions>
```

### 組成部分

| 部分 | 說明 | 範例 |
|------|------|------|
| `<context>` | `patient`、`user` 或 `system` | `patient` |
| `<resource>` | FHIR 資源型別或 `*`（所有） | `Patient`、`Observation` |
| `<permissions>` | `.cruds` 的子集 | `.read`、`.write` |

### 權限代碼（.cruds）

| 代碼 | 操作 | 說明 |
|------|------|------|
| `c` | Create | 建立新資源 |
| `r` | Read | 讀取現有資源 |
| `u` | Update | 更新現有資源 |
| `d` | Delete | 刪除資源 |
| `s` | Search | 搜尋資源 |

## 三種 Scope 類型

### 1. Patient Scopes（患者作用範圍）

格式：`patient/<Resource>.<permissions>`

患者 Scope 授予應用程式訪問**單一患者**相關資料的權限。患者必須在授權流程中被識別。

**常見 Patient Scopes：**

```
patient/Patient.read           # 讀取患者個人資訊（姓名、年齡等）
patient/Observation.read       # 讀取患者的檢查結果（血糖、血壓等）
patient/Condition.read         # 讀取患者的診斷
patient/Medication.read        # 讀取患者的藥物清單
patient/MedicationRequest.read # 讀取患者的藥物處方
patient/Encounter.read         # 讀取患者的就診記錄
patient/DocumentReference.read # 讀取患者的文檔（如報告）
patient/AllergyIntolerance.read # 讀取患者的過敏資訊
patient/Procedure.read         # 讀取患者的醫療程序
patient/DiagnosticReport.read  # 讀取患者的診斷報告

# 寫入權限（少見，需謹慎授予）
patient/Observation.write      # 建立/更新患者的檢查結果
patient/Condition.write        # 建立/更新患者的診斷
```

**Patient Scope 範例請求：**

```
scope=launch/patient+patient/Patient.read+patient/Observation.read
```

這意味著應用程式可以：
- 獲得患者上下文（`launch/patient`）
- 讀取患者基本資訊
- 讀取該患者的檢查結果

### 2. User Scopes（使用者作用範圍）

格式：`user/<Resource>.<permissions>`

使用者 Scope 授予應用程式訪問**已登入使用者能訪問的**資料的權限。常用於臨床應用程式。

**常見 User Scopes：**

```
user/Patient.read              # 讀取使用者可見的所有患者
user/Patient.write             # 建立/編輯患者（如醫護人員）
user/Observation.read          # 讀取所有患者的檢查結果
user/Observation.write         # 建立/編輯檢查結果
user/Encounter.read            # 讀取所有患者的就診記錄
user/MedicationRequest.read    # 讀取所有患者的藥物處方
user/Condition.read            # 讀取所有患者的診斷
user/DocumentReference.write   # 建立/上傳文檔
user/Appointment.read          # 讀取約診資訊
user/Appointment.write         # 建立/修改約診
```

**User Scope 範例請求：**

```
scope=user/Patient.read+user/Observation.read+user/Encounter.read
```

這意味著應用程式（以醫護人員身份）可以：
- 讀取所有患者的基本資訊
- 讀取所有患者的檢查結果
- 讀取所有患者的就診記錄

### 3. System Scopes（系統作用範圍）

格式：`system/<Resource>.<permissions>`

系統 Scope 授予應用程式（作為系統本身，不代表任何特定使用者）直接訪問資源的權限。通常用於後台服務或系統間整合。

**常見 System Scopes：**

```
system/Patient.read            # 讀取所有患者
system/Patient.write           # 建立/編輯患者
system/Observation.read        # 讀取所有檢查結果
system/DiagnosticReport.read   # 讀取所有診斷報告
system/*.read                  # 讀取所有資源類型
system/*.write                 # 寫入所有資源類型
```

**System Scope 範例請求（通常為後端服務）：**

```
scope=system/Patient.read+system/Observation.read+system/DiagnosticReport.read
```

## 特殊 Scopes

### Launch Scope

`launch` Scope 提供患者或使用者上下文資訊：

```
launch         # 一般啟動上下文
launch/patient # 識別患者 ID（適用患者應用）
launch/user    # 識別使用者 ID（適用臨床應用）
```

在授權回應中，會包含：

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "launch/patient patient/Patient.read patient/Observation.read",
  "patient": "patient-123",
  "encounter": "encounter-456"
}
```

### OpenID Connect Scopes

如果應用程式需要使用者身份資訊：

```
openid         # 要求 ID Token
profile        # 要求使用者檔案資訊
email          # 要求使用者電子郵件
```

## Scope 最小化原則

### ❌ 不要

```javascript
// 過度請求權限 - 應用只需要讀取血壓數據
scope: 'patient/*.* user/*.*'
```

### ✅ 應該

```javascript
// 精確要求所需的權限
scope: 'launch/patient patient/Observation.read'
```

## 常見應用場景的 Scope 組合

### 場景 1：患者健康監控 App

```
scope=launch/patient+patient/Patient.read+patient/Observation.read
```

允許：
- 患者查看自己的姓名、年齡等基本資訊
- 患者查看自己的血糖、血壓、心率等檢查結果

### 場景 2：醫護人員臨床應用

```
scope=user/Patient.read+user/Encounter.read+user/Observation.read+user/Condition.read
```

允許：
- 醫護人員查看所有患者的基本資訊
- 醫護人員查看患者的就診記錄
- 醫護人員查看患者的檢查結果和診斷

### 場景 3：後台資料匯入系統

```
scope=system/Patient.read+system/Patient.write+system/Observation.read
```

允許：
- 系統讀取所有患者資訊
- 系統建立/更新患者資訊
- 系統讀取所有檢查結果

### 場景 4：診斷影像查看應用

```
scope=user/ImagingStudy.read+user/Patient.read+user/Observation.read
```

允許：
- 醫療人員查看所有 CT/MRI 影像
- 醫療人員查看患者基本資訊
- 醫療人員查看相關檢查結果

## Scope 的執行方式

### 伺服器端實現

FHIR 伺服器通常透過以下方式執行 Scopes：

1. **資源過濾** — 根據 Scope 過濾回傳結果
   ```javascript
   // 如果 scope 是 patient/Observation.read
   // GET /fhir/Observation?patient=patient-123 ✅ 允許
   // GET /fhir/Observation                      ❌ 拒絕（沒有患者限制）
   ```

2. **操作控制** — 根據權限代碼限制操作
   ```javascript
   // 如果 scope 是 patient/Observation.read（沒有 write）
   // GET /fhir/Observation/123                  ✅ 允許
   // POST /fhir/Observation                     ❌ 拒絕（沒有 write 權限）
   // PUT /fhir/Observation/123                  ❌ 拒絕（沒有 update 權限）
   ```

3. **使用者上下文驗證** — 驗證使用者/患者一致性
   ```javascript
   // 如果 scope 是 patient/Patient.read，patient=patient-123
   // GET /fhir/Patient/patient-123              ✅ 允許
   // GET /fhir/Patient/patient-456              ❌ 拒絕（患者不匹配）
   ```

## JavaScript 實作範例

```javascript
class SmartAuthManager {
  constructor(fhirBase) {
    this.fhirBase = fhirBase;
    this.accessToken = null;
    this.grantedScopes = null;
  }

  /**
   * 驗證應用程式是否有特定 scope
   */
  hasScope(requiredScope) {
    if (!this.grantedScopes) return false;
    return this.grantedScopes.includes(requiredScope);
  }

  /**
   * 驗證應用程式是否有特定資源的讀取權限
   */
  canReadResource(resourceType, context = 'patient') {
    return this.hasScope(`${context}/${resourceType}.read`) ||
           this.hasScope(`${context}/${resourceType}.rs`) ||
           this.hasScope(`${context}/*.read`);
  }

  /**
   * 驗證應用程式是否有特定資源的寫入權限
   */
  canWriteResource(resourceType, context = 'patient') {
    return this.hasScope(`${context}/${resourceType}.write`) ||
           this.hasScope(`${context}/${resourceType}.w`) ||
           this.hasScope(`${context}/*.write`);
  }

  /**
   * 建立符合 Scope 的 FHIR API 請求
   */
  async fetchResource(resourceType, resourceId) {
    if (!this.canReadResource(resourceType)) {
      throw new Error(`No permission to read ${resourceType}`);
    }

    const response = await fetch(
      `${this.fhirBase}/${resourceType}/${resourceId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/fhir+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 建立資源
   */
  async createResource(resourceType, resource) {
    if (!this.canWriteResource(resourceType)) {
      throw new Error(`No permission to create ${resourceType}`);
    }

    const response = await fetch(
      `${this.fhirBase}/${resourceType}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/fhir+json'
        },
        body: JSON.stringify(resource)
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 初始化認證並儲存 Scopes
   */
  setTokenInfo(accessToken, grantedScopes) {
    this.accessToken = accessToken;
    this.grantedScopes = grantedScopes.split(' ');
  }
}

// 使用範例
const authManager = new SmartAuthManager('https://example.com/fhir');
authManager.setTokenInfo('access-token-123', 'launch/patient patient/Patient.read patient/Observation.read');

// 驗證權限
if (authManager.canReadResource('Patient')) {
  const patient = await authManager.fetchResource('Patient', 'patient-123');
  console.log('患者資訊:', patient);
}

if (authManager.canWriteResource('Observation')) {
  const observation = {
    resourceType: 'Observation',
    status: 'final',
    code: { coding: [{ system: 'http://loinc.org', code: '3141-9' }] },
    valueQuantity: { value: 95, unit: 'mmHg' }
  };
  const created = await authManager.createResource('Observation', observation);
  console.log('建立的檢查結果:', created);
} else {
  console.log('沒有權限建立檢查結果');
}
```

## Scope 要求最佳實踐

1. **漸進式權限請求** — 開始時請求最少權限，需要時再請求更多
2. **解釋為什麼需要** — 在授權提示中清楚地說明應用為何需要特定權限
3. **定期檢查** — 檢查應用是否真的需要所有已授予的權限
4. **使用者控制** — 允許使用者在應用設定中管理權限

## 常見問題

**Q: 如果應用請求的 Scope 比伺服器支援的還多怎麼辦？**
A: 伺服器會授予交集（只授予它支援的 Scope）。應用應驗證返回的 `scope` 參數，並在缺少必需權限時提示使用者。

**Q: 如何刷新過期的存取令牌而不重新授權？**
A: 使用 `refresh_token`（如果授予）來獲取新的 `access_token`，無需使用者干預。

**Q: 患者可以在授權後更改他們的 Scopes 嗎？**
A: 這取決於伺服器實現。大多數系統要求患者重新進行完整的授權流程來更改 Scopes。
