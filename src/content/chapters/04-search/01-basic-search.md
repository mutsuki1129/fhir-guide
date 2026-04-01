# 基本搜尋參數

FHIR 搜尋是在伺服器上查找資源的主要機制。搜尋通過 HTTP GET 或 POST 請求進行，使用標準的查詢參數語法。

## 核心概念

FHIR 搜尋的特點：
- **無參數搜尋**：取得所有該資源類型的記錄
- **單參數搜尋**：使用單一搜尋參數過濾
- **多參數搜尋**：使用多個參數組合（AND 邏輯）
- **回傳結果**：返回一個 searchset Bundle

## 基本語法

### 無參數搜尋
```bash
GET /fhir/Patient
```

返回所有 Patient 資源（受分頁限制）。

### 單參數搜尋

#### 依名字搜尋
```bash
GET /fhir/Patient?name=王大明
```

搜尋名字包含「王大明」的患者（不區分大小寫，不需完全匹配）。

#### 依性別搜尋
```bash
GET /fhir/Patient?gender=male
```

搜尋性別為男性的患者。

#### 依出生日期搜尋
```bash
GET /fhir/Patient?birthdate=1980-05-15
```

搜尋出生日期為 1980-05-15 的患者。

### 多參數搜尋（AND 邏輯）

```bash
GET /fhir/Patient?name=王&gender=male
```

搜尋名字包含「王」**且**性別為男性的患者。

多個參數間使用 `&` 連接，表示邏輯 AND（所有條件都必須滿足）。

### OR 邏輯（逗號分隔）

```bash
GET /fhir/Patient?gender=male,female
```

搜尋性別為男性**或**女性的患者。

同一參數的多個值用逗號 `,` 分隔，表示邏輯 OR（任一條件滿足即可）。

## HTTP 方法

### GET 請求
```bash
GET /fhir/Patient?name=王大明&gender=male HTTP/1.1
Host: hospital.example.org
```

適合查詢字符串較短的情況。

### POST 請求
```bash
POST /fhir/Patient/_search HTTP/1.1
Host: hospital.example.org
Content-Type: application/x-www-form-urlencoded

name=王大明&gender=male
```

適合查詢字符串很長或包含敏感資訊的情況。

## 搜尋結果結構

搜尋返回一個 searchset Bundle：

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 3,
  "link": [
    {
      "relation": "self",
      "url": "https://hospital.example.org/fhir/Patient?name=王&_count=20"
    },
    {
      "relation": "next",
      "url": "https://hospital.example.org/fhir/Patient?name=王&_count=20&__skip=20"
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
            "text": "王小華"
          }
        ],
        "gender": "female"
      },
      "search": {
        "mode": "match",
        "score": 0.95
      }
    }
  ]
}
```

## 常見搜尋參數

### 通用參數
| 參數 | 說明 | 例子 |
|------|------|------|
| `_id` | 資源的邏輯 ID | `Patient?_id=P001` |
| `_lastUpdated` | 最後更新時間 | `Patient?_lastUpdated=ge2024-01-01` |

### Patient 資源參數
| 參數 | 類型 | 說明 | 例子 |
|------|------|------|------|
| `name` | string | 患者姓名 | `Patient?name=王大明` |
| `given` | string | 名字 | `Patient?given=大明` |
| `family` | string | 姓氏 | `Patient?family=王` |
| `gender` | token | 性別 | `Patient?gender=male` |
| `birthdate` | date | 出生日期 | `Patient?birthdate=1980-05-15` |
| `address-city` | string | 城市 | `Patient?address-city=台北市` |
| `telecom` | token | 聯絡電話/email | `Patient?telecom=0912345678` |
| `identifier` | token | 識別編號 | `Patient?identifier=A123456789` |

### Observation 資源參數
| 參數 | 類型 | 說明 | 例子 |
|------|------|------|------|
| `code` | token | 檢查代碼 | `Observation?code=8480-6` |
| `date` | date | 檢查日期 | `Observation?date=2024-01-20` |
| `subject` | reference | 患者 | `Observation?subject=Patient/P001` |
| `status` | token | 狀態 | `Observation?status=final` |
| `value-quantity` | quantity | 數值 | `Observation?value-quantity=120` |

## 日期搜尋修飾符

| 修飾符 | 說明 | 例子 |
|--------|------|------|
| `eq` | 等於（預設）| `birthdate=eq1980-05-15` |
| `ne` | 不等於 | `birthdate=ne1980-05-15` |
| `lt` | 小於 | `birthdate=lt1980-05-15` |
| `le` | 小於等於 | `birthdate=le1980-05-15` |
| `gt` | 大於 | `birthdate=gt1980-05-15` |
| `ge` | 大於等於 | `birthdate=ge1980-01-01` |
| `sa` | 開始於 | `date=sa2024-01-01` |
| `eb` | 結束於 | `date=eb2024-12-31` |

### 日期搜尋範例
```bash
# 搜尋 2024 年 1 月 1 日之後出生的患者
GET /fhir/Patient?birthdate=ge1980-01-01

# 搜尋 2024 年的檢查
GET /fhir/Observation?date=ge2024-01-01&date=le2024-12-31
```

## 常見使用場景

### 1. 患者掛號查詢
```bash
GET /fhir/Patient?name=王大明&identifier=A123456789
```

查找特定患者的掛號記錄。

### 2. 檢驗結果查詢
```bash
GET /fhir/Observation?subject=Patient/P001&code=2345-7&date=ge2024-01-01
```

查找特定患者在 2024 年 1 月之後的血糖檢查。

### 3. 病情列表
```bash
GET /fhir/Condition?subject=Patient/P001&clinical-status=active
```

查找患者的所有活躍病情。

### 4. 用藥清單
```bash
GET /fhir/MedicationRequest?subject=Patient/P001&status=active
```

查找患者的所有活躍用藥。

## 搜尋評分（Score）

searchset Bundle 中的每個 entry 都包含一個 `search.score`，表示搜尋結果的相關性：

- `1.0`：完全匹配
- `0.95`：高度相關
- `0.5`：中等相關
- 資源可根據評分排序，最相關的結果首先顯示

## 重要注意事項

1. **區分大小寫**：大多數搜尋參數不區分大小寫
2. **部分匹配**：預設支持部分匹配（除非使用 `:exact` 修飾符）
3. **NULL 值**：搜尋不會返回缺少該參數的資源
4. **最大結果**：FHIR 伺服器通常限制每頁結果數（如 100 或 1000）

---

**提示**：善用日期修飾符進行時間範圍搜尋，這是臨床實務中非常常見的需求。
