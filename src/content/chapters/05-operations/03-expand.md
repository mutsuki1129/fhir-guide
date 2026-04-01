# $expand 操作（ValueSet）

## 核心概念

**$expand** 操作用於將 ValueSet（值集）展開為具體的代碼清單。ValueSet 是 FHIR 中定義允許值的標準方式，$expand 幫助開發者取得所有可用的代碼選項，常用於下拉選單、自動補全等前端 UI 控制項。

### 什麼是 ValueSet？

ValueSet 是一個可複用的代碼集合，例如：

- **性別代碼**：male, female, other, unknown
- **患者狀態**：final, amended, cancelled
- **診斷代碼**：SNOMED CT 症狀列表
- **藥物代碼**：RxNorm 藥物編碼系統

### 為什麼需要 $expand？

ValueSet 可能很複雜：
- 包含數千個代碼（如 SNOMED CT）
- 動態定義（如「所有活躍的診斷代碼」）
- 跨系統引用（如「FDA 核准的藥物列表」）

$expand 允許伺服器計算並返回符合條件的所有代碼，前端可直接用於 UI。

## 操作 URI

```
GET [base]/ValueSet/$expand
GET [base]/ValueSet/[id]/$expand
POST [base]/ValueSet/$expand
```

### 例子

```
GET https://hapi.fhir.org/baseR4/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/administrative-gender
GET https://hapi.fhir.org/baseR4/ValueSet/123/$expand
```

## 輸入參數

| 參數 | 型別 | 說明 |
|------|------|------|
| `url` | uri | ValueSet 的規範 URI (canonical URL)（GET 時必須） |
| `valueSet` | ValueSet | 直接傳入 ValueSet 資源內容（POST 時使用） |
| `filter` | string | 文字過濾，限制返回的代碼 |
| `activeOnly` | boolean | 只返回活躍（active=true）的代碼，預設 false |
| `includeDesignations` | boolean | 包含代碼的替代顯示文字，預設 false |
| `designation` | string | 篩選特定的顯示文字語言或類型 |
| `offset` | integer | 分頁起始位置，預設 0 |
| `count` | integer | 分頁時每頁代碼數，預設由伺服器決定 |
| `excludeNested` | boolean | 強制平面展開（不含層級結構）|
| `excludeNotForUI` | boolean | 排除標記為「不用於 UI」的抽象代碼 |

## 回應內容

$expand 返回展開後的 **ValueSet** 資源，包含具體的代碼清單。

### ValueSet 擴展結構

```json
{
  "resourceType": "ValueSet",
  "id": "administrative-gender",
  "url": "http://hl7.org/fhir/ValueSet/administrative-gender",
  "version": "4.0.1",
  "name": "AdministrativeGender",
  "title": "Administrative Gender",
  "timestamp": "2023-12-15T10:30:00Z",
  "expansion": {
    "identifier": "urn:uuid:550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2023-12-15T10:30:00Z",
    "total": 5,
    "offset": 0,
    "parameter": [
      {
        "name": "version",
        "valueString": "http://hl7.org/fhir/administrative-gender|4.0.1"
      }
    ],
    "contains": [
      {
        "system": "http://hl7.org/fhir/administrative-gender",
        "code": "male",
        "display": "Male",
        "designation": [
          {
            "language": "zh-TW",
            "use": {
              "system": "http://terminology.hl7.org/CodeSystem/designation-usage",
              "code": "display"
            },
            "value": "男性"
          }
        ]
      },
      {
        "system": "http://hl7.org/fhir/administrative-gender",
        "code": "female",
        "display": "Female",
        "designation": [
          {
            "language": "zh-TW",
            "value": "女性"
          }
        ]
      },
      {
        "system": "http://hl7.org/fhir/administrative-gender",
        "code": "other",
        "display": "Other"
      },
      {
        "system": "http://hl7.org/fhir/administrative-gender",
        "code": "unknown",
        "display": "Unknown"
      }
    ]
  }
}
```

### 關鍵結構說明

| 元素 | 說明 |
|------|------|
| `expansion` | 包含展開結果的容器 |
| `expansion.timestamp` | 展開時間 |
| `expansion.total` | 符合篩選條件的代碼總數 |
| `expansion.contains` | 實際代碼陣列 |
| `contains[*].code` | 代碼值 |
| `contains[*].display` | 代碼顯示文字 |
| `contains[*].designation` | 代碼的替代顯示（如多語言） |

## 實戰範例

### 1. 取得性別代碼清單

```http
GET /baseR4/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/administrative-gender
```

**用途：** 填充患者表單的「性別」下拉選單。

**Response 摘錄：**
```json
{
  "expansion": {
    "contains": [
      { "code": "male", "display": "Male" },
      { "code": "female", "display": "Female" },
      { "code": "other", "display": "Other" },
      { "code": "unknown", "display": "Unknown" }
    ]
  }
}
```

### 2. 文字過濾搜尋

```http
GET /baseR4/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/diagnostic-service-sections&filter=blood
```

**用途：** 用戶在自動補全框輸入「blood」，伺服器返回相符的檢驗科別。

### 3. 只返回活躍代碼

```http
GET /baseR4/ValueSet/$expand?url=http://example.org/ValueSet/my-medications&activeOnly=true
```

**用途：** 處方系統只顯示尚在市場上的藥物，排除已停售藥物。

### 4. 分頁取得大型代碼集

```http
GET /baseR4/ValueSet/$expand?url=http://snomed.info/ValueSet/diabetes-codes&offset=0&count=20
```

**用途：** 大型代碼集（SNOMED CT）分頁取得，避免超時。

### 5. 取得多語言顯示文字

```http
GET /baseR4/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/administrative-gender&includeDesignations=true
```

**Response：**
```json
{
  "expansion": {
    "contains": [
      {
        "code": "male",
        "display": "Male",
        "designation": [
          { "language": "zh-TW", "value": "男性" },
          { "language": "es", "value": "Hombre" }
        ]
      }
    ]
  }
}
```

**用途：** 多語言應用取得各種語言的代碼標籤。

### 6. POST 方式直接傳入 ValueSet

當 ValueSet 很複雜且不在伺服器上時，可直接在請求體傳入：

```http
POST /baseR4/ValueSet/$expand
Content-Type: application/fhir+json

{
  "resourceType": "ValueSet",
  "url": "http://example.org/ValueSet/custom",
  "compose": {
    "include": [
      {
        "system": "http://snomed.info/sct",
        "filter": [
          {
            "property": "concept",
            "op": "is-a",
            "value": "73211009" // Diabetes
          }
        ]
      }
    ]
  }
}
```

## 實作範例（JavaScript）

### 基本使用：取得下拉選單數據

```typescript
async function getValueSetCodes(
  valueSetUrl: string,
  baseUrl: string
): Promise<Array<{ code: string; display: string }>> {
  const url = new URL(`${baseUrl}/ValueSet/$expand`);
  url.searchParams.set('url', valueSetUrl);
  
  const response = await fetch(url.toString(), {
    headers: { 'Accept': 'application/fhir+json' }
  });
  
  const valueSet = await response.json();
  
  return (valueSet.expansion?.contains || []).map(item => ({
    code: item.code,
    display: item.display || item.code
  }));
}

// 使用示例：在 Vue 組件中填充選項
const genderOptions = await getValueSetCodes(
  'http://hl7.org/fhir/ValueSet/administrative-gender',
  'https://hapi.fhir.org/baseR4'
);

// genderOptions = [
//   { code: 'male', display: 'Male' },
//   { code: 'female', display: 'Female' },
//   ...
// ]
```

### 進階使用：搜尋篩選

```typescript
async function expandValueSetWithFilter(
  valueSetUrl: string,
  filter: string,
  baseUrl: string
): Promise<any[]> {
  const url = new URL(`${baseUrl}/ValueSet/$expand`);
  url.searchParams.set('url', valueSetUrl);
  url.searchParams.set('filter', filter);
  
  const response = await fetch(url.toString());
  const valueSet = await response.json();
  
  return valueSet.expansion?.contains || [];
}

// 在自動補全中使用
const results = await expandValueSetWithFilter(
  'http://snomed.info/ValueSet/condition-codes',
  'diabete', // 用戶輸入
  'https://hapi.fhir.org/baseR4'
);
```

### 多語言下拉選單

```typescript
async function getLocalizedValueSetCodes(
  valueSetUrl: string,
  language: string = 'zh-TW',
  baseUrl: string
) {
  const url = new URL(`${baseUrl}/ValueSet/$expand`);
  url.searchParams.set('url', valueSetUrl);
  url.searchParams.set('includeDesignations', 'true');
  
  const response = await fetch(url.toString());
  const valueSet = await response.json();
  
  return (valueSet.expansion?.contains || []).map(item => {
    // 優先使用指定語言的 designation，回退到 display
    const designation = item.designation?.find(d => d.language === language);
    
    return {
      code: item.code,
      display: designation?.value || item.display || item.code
    };
  });
}

// 使用示例
const chineseCodes = await getLocalizedValueSetCodes(
  'http://hl7.org/fhir/ValueSet/administrative-gender',
  'zh-TW',
  'https://hapi.fhir.org/baseR4'
);
// chineseCodes = [
//   { code: 'male', display: '男性' },
//   { code: 'female', display: '女性' },
// ]
```

### 分頁處理大型代碼集

```typescript
async function expandValueSetPaginated(
  valueSetUrl: string,
  baseUrl: string,
  pageSize: number = 20
) {
  const allCodes: any[] = [];
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    const url = new URL(`${baseUrl}/ValueSet/$expand`);
    url.searchParams.set('url', valueSetUrl);
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('count', String(pageSize));
    
    const response = await fetch(url.toString());
    const valueSet = await response.json();
    
    const codes = valueSet.expansion?.contains || [];
    allCodes.push(...codes);
    
    // 檢查是否有更多資料
    const total = valueSet.expansion?.total || 0;
    offset += pageSize;
    hasMore = offset < total;
  }
  
  return allCodes;
}
```

### 快取機制

```typescript
class ValueSetCache {
  private cache = new Map<string, { timestamp: number; data: any[] }>();
  private cacheTimeout = 3600000; // 1 小時
  
  async getExpandedValueSet(
    valueSetUrl: string,
    baseUrl: string
  ): Promise<any[]> {
    // 檢查快取
    const cached = this.cache.get(valueSetUrl);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    // 從伺服器取得
    const url = new URL(`${baseUrl}/ValueSet/$expand`);
    url.searchParams.set('url', valueSetUrl);
    
    const response = await fetch(url.toString());
    const valueSet = await response.json();
    const codes = valueSet.expansion?.contains || [];
    
    // 快取結果
    this.cache.set(valueSetUrl, {
      timestamp: Date.now(),
      data: codes
    });
    
    return codes;
  }
}

// 使用示例
const cache = new ValueSetCache();
const codes = await cache.getExpandedValueSet(
  'http://hl7.org/fhir/ValueSet/administrative-gender',
  'https://hapi.fhir.org/baseR4'
);
```

## 常見 ValueSet URIs

| 名稱 | URL |
|------|-----|
| Administrative Gender | `http://hl7.org/fhir/ValueSet/administrative-gender` |
| Marital Status | `http://hl7.org/fhir/ValueSet/marital-status` |
| Observation Status | `http://hl7.org/fhir/ValueSet/observation-status` |
| Condition Status | `http://hl7.org/fhir/ValueSet/condition-clinical` |
| SNOMED CT (所有診斷) | `http://snomed.info/ValueSet/snomedct-all` |
| LOINC (所有檢驗代碼) | `http://loinc.org/vs` |

## 常見使用場景

### 場景 1：患者登記表單

表單加載時，調用 $expand 填充所有下拉選單（性別、婚姻狀態、國家等）。

### 場景 2：自動補全搜尋

使用者在搜尋框輸入時，實時調用 `$expand?filter=...` 返回匹配的診斷或藥物代碼。

### 場景 3：多語言應用

不同地區的使用者看到本地化的代碼標籤，透過 `includeDesignations=true` 取得多語言支持。

### 場景 4：質量管理

系統定期驗證所有患者診斷是否符合最新的官方代碼集，用 $expand 與本地資料比較。

### 場景 5：行動應用離線模式

應用啟動時一次性下載常用 ValueSet（性別、狀態等），快取到本地供離線使用。

## 效能與最佳實踐

| 做法 | 說明 |
|------|------|
| ✅ 快取結果 | ValueSet 很少變動，快取 1 小時以上 |
| ✅ 使用分頁 | 大型代碼集（SNOMED）務必分頁 |
| ✅ 篩選不必要資訊 | 不需要 designation 時別加該參數 |
| ✅ 提前加載 | 在應用啟動時預加載常用 ValueSet |
| ❌ 每次使用都查詢 | 會導致大量網路請求 |
| ❌ 無限循環查詢 | 對超大代碼集（SNOMED）分頁時注意終止條件 |

## 小結

$expand 是構建互動式 UI 的必備操作：
- 動態填充表單選項
- 實現代碼自動補全
- 支援多語言應用
- 與伺服器動態同步代碼表
