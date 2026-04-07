var e=`# 反向鏈式搜尋（_revinclude & _include）

\`_include\` 和 \`_revinclude\` 是 FHIR 搜尋中用於一次性檢索相關資源的參數，避免多次 HTTP 請求。

## 核心概念

### _include - 順向包含
\`\`\`
搜尋結果 → 參考的資源
\`\`\`

搜尋直接返回搜尋結果**參考**的相關資源。

### _revinclude - 反向包含
\`\`\`
搜尋結果 ← 參考搜尋結果的資源
\`\`\`

搜尋還返回**參考搜尋結果**的相關資源。

## _include 語法

### 基本語法
\`\`\`bash
GET /fhir/[資源類型]?[搜尋參數]&_include=[資源類型]:[參考參數]
\`\`\`

### 簡單 _include 範例

#### 搜尋患者並包含其管理組織
\`\`\`bash
# 不使用 _include
GET /fhir/Patient?name=王大明

# 返回：只有 Patient 資源
{
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "managingOrganization": {
          "reference": "Organization/ORG001"
        }
      }
    }
  ]
}

# 使用 _include
GET /fhir/Patient?name=王大明&_include=Patient:managing-organization

# 返回：Patient + Organization
{
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "P001",
        "managingOrganization": {
          "reference": "Organization/ORG001"
        }
      }
    },
    {
      "resource": {
        "resourceType": "Organization",
        "id": "ORG001",
        "name": "台北醫學中心"
      }
    }
  ]
}
\`\`\`

#### 搜尋檢驗並包含患者
\`\`\`bash
GET /fhir/Observation?code=2345-7&_include=Observation:subject

# 返回：Observation + Patient 資源
\`\`\`

#### 搜尋就診並包含患者和醫療機構
\`\`\`bash
GET /fhir/Encounter?status=finished&_include=Encounter:subject&_include=Encounter:service-provider

# 返回：Encounter + Patient + Organization 資源
\`\`\`

## _revinclude 語法

### 基本語法
\`\`\`bash
GET /fhir/[資源類型]?[搜尋參數]&_revinclude=[參考資源類型]:[參考參數]
\`\`\`

### _revinclude 範例

#### 搜尋患者並包含其所有檢驗結果
\`\`\`bash
# 不使用 _revinclude
GET /fhir/Patient?name=王大明

# 返回：只有 Patient 資源
# 需要後續請求：GET /fhir/Observation?subject=Patient/P001

# 使用 _revinclude
GET /fhir/Patient?name=王大明&_revinclude=Observation:subject

# 返回：Patient + 該患者的所有 Observation
{
  "entry": [
    {
      "search": {
        "mode": "match"  // 原始搜尋結果
      },
      "resource": {
        "resourceType": "Patient",
        "id": "P001"
      }
    },
    {
      "search": {
        "mode": "include"  // 反向包含的結果
      },
      "resource": {
        "resourceType": "Observation",
        "id": "OBS001",
        "subject": {
          "reference": "Patient/P001"
        }
      }
    },
    {
      "search": {
        "mode": "include"
      },
      "resource": {
        "resourceType": "Observation",
        "id": "OBS002",
        "subject": {
          "reference": "Patient/P001"
        }
      }
    }
  ]
}
\`\`\`

#### 搜尋疾病並包含診斷它的就診
\`\`\`bash
GET /fhir/Condition?clinical-status=active&_revinclude=Encounter:diagnosis

# 返回：Condition + 診斷該病情的 Encounter 資源
\`\`\`

#### 搜尋患者並包含其所有就診和檢驗
\`\`\`bash
GET /fhir/Patient?name=王大明&_revinclude=Encounter:subject&_revinclude=Observation:subject

# 返回：Patient + 該患者的 Encounter + Observation
\`\`\`

## 實際應用場景

### 場景 1：患者就診完整視圖
\`\`\`bash
# 檢索特定患者及其所有臨床記錄
GET /fhir/Patient?identifier=A123456789&_revinclude=Encounter:subject&_revinclude=Observation:subject&_revinclude=Condition:subject&_revinclude=MedicationRequest:subject

# 返回：
# 1. Patient（患者）
# 2. Encounter（所有就診）
# 3. Observation（所有檢查）
# 4. Condition（所有診斷）
# 5. MedicationRequest（所有用藥）
\`\`\`

### 場景 2：組織管理視圖
\`\`\`bash
# 檢索醫療機構及其所有患者
GET /fhir/Organization?name=台北醫學中心&_revinclude=Patient:managing-organization

# 返回：Organization + 該機構管理的所有 Patient
\`\`\`

### 場景 3：診斷的完整上下文
\`\`\`bash
# 檢索所有活躍的糖尿病診斷，包含相關的患者和就診
GET /fhir/Condition?code:text=糖尿病&clinical-status=active&_include=Condition:subject&_revinclude=Encounter:diagnosis

# 返回：
# 1. Condition（糖尿病診斷）
# 2. Patient（患者）
# 3. Encounter（診斷該病的就診）
\`\`\`

### 場景 4：檢驗報告與臨床背景
\`\`\`bash
# 檢索最近的血糖檢驗，包含患者和所有相關的就診
GET /fhir/Observation?code=2345-7&date=ge2024-01-01&_include=Observation:subject&_include=Observation:encounter&_revinclude=Condition:subject

# 返回：
# 1. Observation（血糖檢驗）
# 2. Patient（患者）
# 3. Encounter（檢驗進行的就診）
# 4. Condition（患者的相關診斷）
\`\`\`

## _include 和 _revinclude 的區別

| 特性 | _include | _revinclude |
|------|----------|------------|
| **方向** | 順向（跟隨參考） | 反向（被參考） |
| **用途** | 包含被搜尋結果參考的資源 | 包含參考搜尋結果的資源 |
| **例子** | \`Observation?_include=Observation:subject\` 返回 Patient | \`Patient?_revinclude=Observation:subject\` 返回 Observation |

## :iterate 修飾符 - 遞迴包含

### 基本用法
\`\`\`bash
# 無修飾符：只包含直接參考
GET /fhir/Patient?name=王大明&_include=Patient:general-practitioner

# 返回：Patient + Practitioner

# 使用 :iterate：遞迴包含所有相關資源
GET /fhir/Patient?name=王大明&_include=Patient:general-practitioner:iterate

# 可能返回：Patient + Practitioner + Practitioner 的組織 + ...
\`\`\`

### 遞迴搜尋範例
\`\`\`bash
# 檢索患者及其醫生、醫生所在組織、組織的上級組織等
GET /fhir/Patient?name=王大明&_include=Patient:managing-organization:iterate

# 返回：Patient + Organization（及其引用的所有組織）
\`\`\`

## Bundle 中的搜尋模式標記

返回的 Bundle 中，每個 entry 都有一個 \`search.mode\` 來表明其來源：

\`\`\`json
{
  "search": {
    "mode": "match"    // 直接搜尋結果
  }
}
// 或
{
  "search": {
    "mode": "include"  // 通過 _include 或 _revinclude 包含
  }
}
\`\`\`

## 效能考慮

1. **結果集大小**：_revinclude 可能返回大量資源
   \`\`\`bash
   # 小心：可能返回數千個 Observation
   GET /fhir/Patient?name=王&_revinclude=Observation:subject
   \`\`\`

2. **使用分頁限制結果**：
   \`\`\`bash
   GET /fhir/Patient?name=王大明&_revinclude=Observation:subject&_count=50
   \`\`\`

3. **伺服器支援限制**：
   - 某些伺服器限制 _revinclude 的使用
   - 檢查 CapabilityStatement 了解支援情況

## 常見組合模式

| 場景 | 查詢 |
|------|------|
| 患者及其組織 | \`Patient?name=XXX&_include=Patient:managing-organization\` |
| 患者及其所有臨床記錄 | \`Patient?identifier=XXX&_revinclude=Encounter:subject&_revinclude=Observation:subject&_revinclude=Condition:subject\` |
| 檢驗及其患者 | \`Observation?code=XXX&_include=Observation:subject\` |
| 就診及其患者和地點 | \`Encounter?status=finished&_include=Encounter:subject&_include=Encounter:location\` |
| 診斷及其患者和相關就診 | \`Condition?code:text=XXX&_include=Condition:subject&_revinclude=Encounter:diagnosis\` |

---

**提示**：_include 和 _revinclude 能顯著減少 API 請求次數，但要注意返回結果的大小和伺服器的效能限制。
`;export{e as default};