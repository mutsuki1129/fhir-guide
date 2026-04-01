# 鏈式搜尋（Chained Search）

鏈式搜尋允許在搜尋時遍歷資源之間的參考關係，從而根據相關資源的屬性進行篩選。

## 核心概念

鏈式搜尋的用途：
- **跨資源搜尋**：根據相關資源的屬性來篩選主資源
- **簡化複雜查詢**：無需先查詢相關資源再進行篩選
- **提高效率**：單次請求完成複雜的多資源過濾

## 基本語法

鏈式搜尋使用點符號 `.` 連接參考和目標參數：

```
/[資源類型]?[參考參數].[目標參數]=[值]
```

### 簡單鏈式搜尋

#### 按患者姓名搜尋檢驗結果
```bash
# 搜尋患者「王大明」的所有檢驗結果
GET /fhir/Observation?subject:Patient.name=王大明

# 等效於以下步驟：
# 1. 先找到名字為「王大明」的 Patient（如 P001）
# 2. 再找所有 subject 為 P001 的 Observation
```

返回：
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 5,
  "entry": [
    {
      "resource": {
        "resourceType": "Observation",
        "id": "OBS001",
        "subject": {
          "reference": "Patient/P001"
        }
      }
    }
  ]
}
```

#### 按患者城市搜尋就診記錄
```bash
# 搜尋住在台北市的患者的所有就診記錄
GET /fhir/Encounter?subject:Patient.address-city=台北市
```

### 多級鏈式搜尋

#### 按患者屬性搜尋
```bash
# 搜尋男性患者的檢驗結果
GET /fhir/Observation?subject:Patient.gender=male

# 搜尋 1980 年後出生的患者的活躍病情
GET /fhir/Condition?subject:Patient.birthdate=ge1980-01-01&clinical-status=active
```

#### 按醫療人員屬性搜尋
```bash
# 搜尋由「李醫生」診斷的所有病情
GET /fhir/Condition?recorder:Practitioner.name=李醫生

# 搜尋由台北醫學中心的醫生開立的用藥
GET /fhir/MedicationRequest?requester:Practitioner.organization.name=台北醫學中心
```

## 鏈式搜尋的資源關係

常見的鏈式搜尋組合：

### Observation 鏈式搜尋
```bash
# 按患者搜尋
GET /fhir/Observation?subject:Patient.name=王大明

# 按就診搜尋
GET /fhir/Observation?encounter:Encounter.type=ambulatory

# 按執行者搜尋
GET /fhir/Observation?performer:Practitioner.name=護士李
```

### Encounter 鏈式搜尋
```bash
# 按患者性別搜尋
GET /fhir/Encounter?subject:Patient.gender=male

# 按醫療機構搜尋
GET /fhir/Encounter?service-provider:Organization.name=台北醫學中心

# 按位置搜尋
GET /fhir/Encounter?location:Location.address-city=台北市
```

### MedicationRequest 鏈式搜尋
```bash
# 按患者搜尋
GET /fhir/MedicationRequest?subject:Patient.name=王大明

# 按開藥醫生搜尋
GET /fhir/MedicationRequest?requester:Practitioner.gender=female

# 按就診搜尋
GET /fhir/MedicationRequest?encounter:Encounter.status=finished
```

### Condition 鏈式搜尋
```bash
# 按患者年齡搜尋（通過出生日期）
GET /fhir/Condition?subject:Patient.birthdate=le1990-01-01

# 按診斷醫生搜尋
GET /fhir/Condition?recorder:Practitioner.organization=Organization/ORG001
```

## 實際使用場景

### 場景 1：找患者的所有檢驗結果
```bash
# 需求：查找名字為「王大明」的患者的所有檢驗結果
GET /fhir/Observation?subject:Patient.name=王大明&category=laboratory
```

### 場景 2：找特定醫生的病人
```bash
# 需求：查找「李醫生」主治的所有患者的活躍病情
GET /fhir/Condition?subject.general-practitioner:Practitioner.name=李醫生&clinical-status=active
```

### 場景 3：找特定地點的就診
```bash
# 需求：查找台北醫學中心內科診療室的所有就診記錄
GET /fhir/Encounter?location:Location.name=內科診療室&service-provider:Organization.name=台北醫學中心
```

### 場景 4：找特定類型患者的用藥
```bash
# 需求：查找患有高血壓的患者的所有用藥
GET /fhir/MedicationRequest?subject:Patient.general-practitioner:Practitioner.name=李醫生
```

## 複合鏈式搜尋

### 多個鏈式參數
```bash
# 搜尋結果同時滿足多個條件
GET /fhir/Observation?subject:Patient.name=王大明&subject:Patient.gender=male

# 上例會搜尋所有：
# - 名字為「王大明」的患者 AND
# - 性別為男性的患者
# 的檢驗結果
```

**重要**：多個鏈式參數是獨立評估的，不一定要指向同一個患者記錄。

### 同一參數的多個值
```bash
# 搜尋來自兩個不同患者的檢驗結果
GET /fhir/Observation?subject:Patient.name=王大明,李小華

# 等效於 OR 邏輯：患者名字為「王大明」或「李小華」
```

## 鏈式搜尋的限制

### 深度限制
大多數 FHIR 伺服器只支援單級鏈式搜尋：
```bash
# 支援（一級）
GET /fhir/Observation?subject:Patient.name=王大明

# 通常不支援（二級或更多）
GET /fhir/Observation?subject:Patient.general-practitioner:Practitioner.name=李醫生
```

### 效能考慮
- 複雜的鏈式搜尋可能很耗時
- 可能需要在資料庫中進行多次 JOIN 操作
- 建議為經常使用的鏈式搜尋建立索引

### 檢查伺服器支援
```bash
# 查看伺服器的搜尋能力聲明
GET /fhir/metadata

# 在 CapabilityStatement 中查看 searchParam 的 chain 屬性
```

## 常見鏈式搜尋快速參考

| 場景 | 查詢 |
|------|------|
| 找患者的所有檢驗 | `Observation?subject:Patient.name=XXX` |
| 找患者的所有就診 | `Encounter?subject:Patient.identifier=XXX` |
| 找患者的所有病情 | `Condition?subject:Patient.name=XXX` |
| 找患者的所有用藥 | `MedicationRequest?subject:Patient.name=XXX` |
| 找醫生的所有患者 | `Patient?general-practitioner:Practitioner.name=XXX` |
| 找醫療機構的所有患者 | `Patient?managing-organization:Organization.name=XXX` |
| 找特定時間的檢驗 | `Observation?date=ge2024-01-01&subject:Patient.name=XXX` |

---

**提示**：鏈式搜尋大大簡化了複雜查詢，但要注意伺服器的支援程度和效能影響。對於頻繁的鏈式搜尋，考慮在伺服器端建立適當的索引。
