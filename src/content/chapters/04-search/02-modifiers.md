# 修飾符（Modifiers）

修飾符（Modifiers）是添加到搜尋參數後面的指令，用於精細化搜尋結果。修飾符使用冒號 `:` 分隔符添加。

## 核心概念

修飾符的目的：
- **改變搜尋行為**：從預設的模糊搜尋改為精確搜尋
- **篩選資源類型**：在 reference 參數中指定特定資源類型
- **邏輯運算**：支持 NOT、OR 等邏輯操作
- **數值比較**：支持大於、小於等數值比較

## 常見修飾符

### 字符串修飾符

#### `:exact` - 精確匹配
```bash
# 不使用 :exact（預設，模糊匹配）
GET /fhir/Patient?name=wang
# 結果：王大明、王小華、汪某某

# 使用 :exact（精確匹配）
GET /fhir/Patient?name:exact=王大明
# 結果：只有 王大明
```

**特點**：
- 完全匹配，包括大小寫和重音符號
- 用於精準查詢

#### `:contains` - 包含搜尋
```bash
# 預設模糊匹配（通常左對齐）
GET /fhir/Patient?name=王
# 結果：王大明、王小華

# 使用 :contains（任何位置）
GET /fhir/Patient?name:contains=大明
# 結果：王大明
```

**特點**：
- 搜尋值可出現在字段的任何位置
- 不區分大小寫
- 更寬鬆的匹配

### Token 修飾符（用於編碼欄位）

#### `:text` - 搜尋文字描述
```bash
# 搜尋編碼值
GET /fhir/Observation?code=8480-6
# 結果：血壓相關的所有編碼

# 搜尋文字描述
GET /fhir/Observation?code:text=血壓
# 結果：所有血壓相關的檢查
```

#### `:not` - 排除特定值
```bash
# 搜尋所有非男性的患者
GET /fhir/Patient?gender:not=male
# 結果：gender 為 female、other、unknown 的患者
```

#### `:in` 和 `:not-in` - 值集搜尋
```bash
# 搜尋在特定值集中的資源
GET /fhir/Observation?code:in=blood-pressure-vitals-value-set

# 搜尋不在特定值集中的資源
GET /fhir/Condition?code:not-in=excluded-conditions-value-set
```

### Reference 修飾符

#### 指定資源類型
```bash
# 搜尋 encounter 參考的患者名字
GET /fhir/Encounter?subject:Patient.name=王大明
# 冒號後指定資源類型

# 也可以不指定資源類型（系統推斷）
GET /fhir/Encounter?subject.name=王大明
```

### 缺少修飾符（`:missing`）

```bash
# 搜尋有 middle name 的患者
GET /fhir/Patient?name:missing=false

# 搜尋沒有 middle name 的患者
GET /fhir/Patient?name:missing=true
```

## 實際應用範例

### 患者搜尋
```bash
# 精確搜尋名字為「王大明」的患者
GET /fhir/Patient?name:exact=王大明

# 搜尋姓氏包含「王」的患者
GET /fhir/Patient?family:contains=王

# 搜尋沒有電話號碼的患者
GET /fhir/Patient?telecom:missing=true

# 搜尋性別不為未知的患者
GET /fhir/Patient?gender:not=unknown
```

### 檢查結果搜尋
```bash
# 搜尋血壓檢查（使用代碼）
GET /fhir/Observation?code=55284-4

# 搜尋血壓檢查（使用文字）
GET /fhir/Observation?code:text=血壓

# 搜尋結果為「最終」狀態的檢查
GET /fhir/Observation?status=final&status:not=preliminary
```

### 病情搜尋
```bash
# 搜尋活躍的病情
GET /fhir/Condition?clinical-status=active

# 搜尋確認的病情
GET /fhir/Condition?verification-status=confirmed

# 搜尋診斷代碼為高血壓的病情
GET /fhir/Condition?code:text=高血壓
```

## 修飾符與參數類型的組合

| 參數類型 | 可用修飾符 | 說明 |
|---------|-----------|------|
| **string** | :exact, :contains | 字符串精確或包含搜尋 |
| **token** | :text, :not, :in, :not-in, :missing | 編碼值或文字搜尋 |
| **reference** | 資源類型（如 :Patient）| 指定參考的資源類型 |
| **date** | 無修飾符（用比較運算符代替）| 日期通過 ge、le 等表達 |
| **quantity** | :missing | 數值搜尋 |

## 修飾符順序

```bash
# 正確順序：參數名:修飾符=值
GET /fhir/Patient?name:exact=王大明

# 對於 reference，修飾符可在冒號前
GET /fhir/Encounter?subject:Patient.name=王
```

## 修飾符不支援的情況

某些 FHIR 伺服器實現可能不支援所有修飾符，此時：
- 伺服器應返回 HTTP 400 Bad Request
- 或忽略不支援的修飾符
- 檢查伺服器的 CapabilityStatement 資源了解支援情況

```bash
# 檢查伺服器搜尋能力
GET /fhir/metadata
```

## 常見用途總結

| 用途 | 修飾符 | 例子 |
|------|--------|------|
| 精確姓名查詢 | :exact | `name:exact=王大明` |
| 模糊查詢 | :contains | `name:contains=大明` |
| 編碼文字搜尋 | :text | `code:text=血壓` |
| 排除特定值 | :not | `status:not=draft` |
| 篩選空值 | :missing | `address:missing=false` |
| 指定資源類型 | 資源名 | `subject:Patient.name=王` |

---

**提示**：修飾符的支援程度因伺服器實現而異，建議在生產環境前測試特定修飾符的可用性。
