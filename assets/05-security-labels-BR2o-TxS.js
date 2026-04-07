var e=`# 安全標籤與訪問控制

## 安全標籤概述

**安全標籤**（Security Labels）是附加到 FHIR 資源的元資料，用於支援更細粒度的訪問控制。它們定義了資源的敏感性、保密性和其他安全屬性。

### 為什麼需要安全標籤？

在複雜的醫療環境中，可能需要基於資料的性質而非使用者身份來限制訪問。例如：

- **精神衛生資訊** — 只有患者本人和精神科醫生可見
- **禁毒治療記錄** — 受聯邦隱私法律嚴格保護
- **HIV 狀態** — 需要額外的隱私保護
- **兒童記錄** — 可能需要父母同意才能訪問

## 安全標籤結構

FHIR 資源的 \`meta.security\` 元素可包含一個或多個安全標籤：

\`\`\`json
{
  "resourceType": "Condition",
  "id": "condition-123",
  "meta": {
    "security": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        "code": "R",
        "display": "Restricted"
      },
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        "code": "PSYCH",
        "display": "Psychiatric"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-123"
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "46635009",
        "display": "Depression"
      }
    ]
  }
}
\`\`\`

## 標準安全標籤系統

### 1. HL7 v3 機密性代碼

系統 URI：\`http://terminology.hl7.org/CodeSystem/v3-Confidentiality\`

| 代碼 | 中文 | 說明 |
|------|------|------|
| \`U\` | 普通 | 未標記為機密 |
| \`L\` | 低度機密 | 內部使用，不應向患者洩露 |
| \`M\` | 中度機密 | 需要特殊許可 |
| \`H\` | 高度機密 | 高度敏感，限制嚴格 |
| \`R\` | 受限 | 限制最嚴格，需特殊批准 |
| \`V\` | 非常受限 | 極端敏感情況 |

### 2. HL7 v3 行為代碼

系統 URI：\`http://terminology.hl7.org/CodeSystem/v3-ActCode\`

敏感資訊類型：

| 代碼 | 含義 | 例子 |
|------|------|------|
| \`PSYCH\` | 精神衛生 | 精神健康診斷、治療 |
| \`SUD\` | 物質使用疾病 | 藥物濫用、酒精成癮 |
| \`HIV\` | HIV 狀態 | HIV 測試結果、治療 |
| \`ADS\` | 愛滋病診斷 | 愛滋病相關資訊 |
| \`EMPL\` | 僱傭相關 | 可能影響就業的健康資訊 |
| \`OVRT\` | 公開 | 不需要額外保護 |

### 3. HL7 v3 隱私標籤

系統 URI：\`http://terminology.hl7.org/CodeSystem/v3-ActPrivacyLaw\`

隱私法律：

| 代碼 | 適用法律 |
|------|---------|
| \`42CFR2\` | 美國藥物濫用治療隱私規定 |
| \`GDPR\` | 歐盟通用資料保護規定 |
| \`HIPAA\` | 美國健康保險可攜性和問責法 |
| \`PIPEDA\` | 加拿大個人資訊保護和電子文檔法 |

## 安全標籤實例

### 例 1：精神衛生診斷

\`\`\`json
{
  "resourceType": "Condition",
  "id": "depression-123",
  "meta": {
    "security": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        "code": "H",
        "display": "High"
      },
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        "code": "PSYCH",
        "display": "Psychiatric"
      },
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActPrivacyLaw",
        "code": "HIPAA",
        "display": "HIPAA"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "35489007",
        "display": "Depression"
      }
    ]
  },
  "subject": { "reference": "Patient/patient-456" }
}
\`\`\`

### 例 2：HIV 相關診斷

\`\`\`json
{
  "resourceType": "Condition",
  "id": "hiv-123",
  "meta": {
    "security": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        "code": "R",
        "display": "Restricted"
      },
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        "code": "HIV",
        "display": "HIV"
      }
    ]
  },
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "86406008",
        "display": "Human immunodeficiency virus seropositivity"
      }
    ]
  },
  "subject": { "reference": "Patient/patient-789" }
}
\`\`\`

## 訪問控制決策（Access Control Decision）

FHIR 伺服器使用安全標籤和使用者角色/權限來決定是否允許訪問：

\`\`\`
訪問請求
  ↓
驗證使用者身份
  ↓
檢查使用者角色/Scopes
  ↓
查詢資源安全標籤
  ↓
執行 ACL（訪問控制清單）決策
  ↓
允許 ✅ 或 拒絕 ❌
\`\`\`

### 存取控制清單（ACL）範例

\`\`\`json
{
  "resourceId": "Condition/depression-123",
  "securityLabels": [
    { "system": "v3-Confidentiality", "code": "H" },
    { "system": "v3-ActCode", "code": "PSYCH" }
  ],
  "accessRules": [
    {
      "principal": "Patient:patient-456",
      "action": ["Read"],
      "effect": "Allow"
    },
    {
      "principal": "Role:Psychiatrist",
      "action": ["Read", "Update"],
      "effect": "Allow"
    },
    {
      "principal": "Role:GeneralPractitioner",
      "action": [],
      "effect": "Deny"
    },
    {
      "principal": "Role:Admin",
      "action": ["Read", "Update", "Delete"],
      "effect": "Allow"
    }
  ]
}
\`\`\`

## 在應用中實現安全標籤檢查

### JavaScript 實現

\`\`\`javascript
class SecureDataAccess {
  constructor(userRole, userId) {
    this.userRole = userRole;
    this.userId = userId;
  }

  /**
   * 檢查使用者是否可以訪問資源
   */
  canAccess(resource, action = 'Read') {
    const labels = resource.meta?.security || [];
    
    // 檢查機密性等級
    const confidentiality = labels.find(
      l => l.system === 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality'
    );

    // 檢查敏感性類型
    const sensitiveType = labels.find(
      l => l.system === 'http://terminology.hl7.org/CodeSystem/v3-ActCode'
    );

    // 決策邏輯
    return this.makeAccessDecision(
      confidentiality?.code,
      sensitiveType?.code,
      action
    );
  }

  makeAccessDecision(confidentialityCode, sensitiveTypeCode, action) {
    // 患者可以訪問自己的資訊（除非被明確拒絕）
    if (this.userRole === 'Patient') {
      return confidentialityCode !== 'V';
    }

    // 醫生可以訪問大多數資訊
    if (this.userRole === 'Physician') {
      // 但精神衛生信息需要特殊權限
      if (sensitiveTypeCode === 'PSYCH') {
        return this.hasSpecialty('Psychiatry');
      }
      // HIV 信息也需要授權
      if (sensitiveTypeCode === 'HIV') {
        return this.hasAuthorization('HIV');
      }
      return true;
    }

    // 護士訪問權限較低
    if (this.userRole === 'Nurse') {
      return confidentialityCode === 'U' || confidentialityCode === 'L';
    }

    // 管理員有完全訪問權限
    if (this.userRole === 'Admin') {
      return true;
    }

    return false;
  }

  hasSpecialty(specialty) {
    // 檢查使用者專科
    return true; // 簡化實現
  }

  hasAuthorization(authType) {
    // 檢查使用者是否有特定授權
    return true; // 簡化實現
  }

  /**
   * 過濾搜尋結果（移除沒有訪問權限的資源）
   */
  filterResults(resources) {
    return resources.filter(resource => this.canAccess(resource, 'Read'));
  }

  /**
   * 遮蔽敏感欄位
   */
  maskSensitiveFields(resource) {
    if (!this.canAccess(resource, 'Read')) {
      return null; // 完全拒絕訪問
    }

    const masked = JSON.parse(JSON.stringify(resource));
    
    const labels = resource.meta?.security || [];
    const confidentiality = labels.find(
      l => l.system === 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality'
    );

    // 對於受限資源，移除某些詳細資訊
    if (confidentiality?.code === 'H' || confidentiality?.code === 'R') {
      masked.note = masked.note?.map(n => ({
        ...n,
        text: '[Restricted Information]'
      }));
    }

    return masked;
  }
}

// 使用範例
const doctor = new SecureDataAccess('Physician', 'dr-smith');
const patient = new SecureDataAccess('Patient', 'patient-123');

const depressionRecord = {
  resourceType: 'Condition',
  id: 'depression-123',
  meta: {
    security: [
      { system: 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality', code: 'H' },
      { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'PSYCH' }
    ]
  },
  code: { coding: [{ code: '35489007', display: 'Depression' }] }
};

// 患者可以訪問
console.log('Patient can access:', patient.canAccess(depressionRecord)); // true

// 醫生可以訪問（如果是精神科醫生）
console.log('Doctor can access:', doctor.canAccess(depressionRecord)); // 取決於專科

// 過濾搜尋結果
const allRecords = [/* ... */];
const visibleToDoctor = doctor.filterResults(allRecords);
\`\`\`

## 安全標籤最佳實踐

### 何時使用安全標籤

**應該使用：**
- ✅ 敏感的精神健康資訊
- ✅ 患者明確標記為機密的資訊
- ✅ 受聯邦法律保護的資訊（禁毒治療、HIV 等）
- ✅ 涉及未成年人的醫療記錄
- ✅ 非常敏感的手術或生育資訊

**不需要使用：**
- ❌ 常規、無害的醫療記錄（如普通檢查）
- ❌ 公開發表的醫學資訊

### 標籤組合建議

\`\`\`javascript
// 高度敏感的精神衛生信息
const psychHealthLabels = [
  { system: 'v3-Confidentiality', code: 'H' },
  { system: 'v3-ActCode', code: 'PSYCH' },
  { system: 'v3-ActPrivacyLaw', code: 'HIPAA' }
];

// 禁毒治療
const substanceAbuseLabels = [
  { system: 'v3-Confidentiality', code: 'R' },
  { system: 'v3-ActCode', code: 'SUD' },
  { system: 'v3-ActPrivacyLaw', code: '42CFR2' }
];

// HIV 相關信息
const hivLabels = [
  { system: 'v3-Confidentiality', code: 'R' },
  { system: 'v3-ActCode', code: 'HIV' }
];
\`\`\`

## FHIR 伺服器安全標籤支援

### 在 HAPI FHIR 中設定

\`\`\`yaml
# application.yml
hapi:
  fhir:
    security:
      enable_security_labels: true
      default_confidentiality: U
      enforce_security_labels: true
\`\`\`

### 測試安全標籤

\`\`\`bash
# 建立帶有安全標籤的資源
POST /fhir/Condition

{
  "resourceType": "Condition",
  "meta": {
    "security": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        "code": "H"
      }
    ]
  },
  ...
}

# 查詢帶特定標籤的資源
GET /fhir/Condition?_security=http://terminology.hl7.org/CodeSystem/v3-Confidentiality|H
\`\`\`

## 與 SMART Scopes 的關係

安全標籤和 SMART Scopes 是互補的：

| 方面 | SMART Scopes | 安全標籤 |
|------|--------------|---------|
| **控制粒度** | 資源型別級別 | 單個資源級別 |
| **決策點** | 授權時 | 訪問時 |
| **應用** | 應用程式權限 | 資料敏感性 |
| **例子** | \`patient/Condition.read\` | \`Condition\` 標記為 PSYCH |

**組合使用：**
1. SMART Scopes：確定應用程式可以訪問什麼資源型別
2. 安全標籤：確定應用程式可以看到該資源型別中的哪些具體實例

## 常見問題

**Q: 安全標籤對效能有影響嗎？**
A: 是的，但通常微乎其微。大規模系統可能需要索引安全標籤以優化查詢。

**Q: 誰應該設定安全標籤？**
A: 通常由 EHR 系統在建立資源時自動設定，或由管理員手動配置敏感資訊。

**Q: 安全標籤可以動態改變嗎？**
A: 可以，但應該記錄所有改變到稽核日誌中。

**Q: 如果資源沒有安全標籤怎麼辦？**
A: 通常預設為 \`Unrestricted\` 或系統設定的預設機密性級別。
`;export{e as default};