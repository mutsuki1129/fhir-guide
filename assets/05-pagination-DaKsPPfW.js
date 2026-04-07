var e=`# 搜尋結果分頁

FHIR 搜尋結果通常以分頁的方式返回，避免一次性傳輸大量資料。分頁通過搜尋參數和 Bundle 導覽連結實現。

## 核心概念

分頁的目的：
- **控制傳輸大小**：限制每頁返回的資源數
- **提高效能**：減少網路頻寬和伺服器負載
- **改善使用者體驗**：快速返回初始結果
- **支援實時搜尋**：避免長時間等待

## 分頁參數

### _count 參數 - 每頁數量

\`\`\`bash
# 預設每頁 20 筆（取決於伺服器配置）
GET /fhir/Patient?name=王

# 指定每頁 50 筆
GET /fhir/Patient?name=王&_count=50

# 指定每頁 100 筆（通常最大值）
GET /fhir/Patient?name=王&_count=100

# 伺服器可能會忽略超過最大值的請求
GET /fhir/Patient?name=王&_count=10000
# 伺服器可能只返回 1000 筆
\`\`\`

### _offset 參數 - 偏移量

**注意**：_offset 不是 FHIR 標準參數，不是所有伺服器都支援。Azure FHIR Server 不支援 _offset。

\`\`\`bash
# 跳過前 20 筆，返回 21-40 筆
GET /fhir/Patient?name=王&_count=20&_offset=20

# 跳過前 100 筆
GET /fhir/Patient?name=王&_count=50&_offset=100
\`\`\`

### 標準方式：使用 Bundle 導覽連結

FHIR 標準推薦使用搜尋結果 Bundle 中的導覽連結進行分頁：

\`\`\`json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 150,
  "link": [
    {
      "relation": "self",
      "url": "https://hospital.example.org/fhir/Patient?name=王&_count=20"
    },
    {
      "relation": "next",
      "url": "https://hospital.example.org/fhir/Patient?name=王&_count=20&__page=2"
    },
    {
      "relation": "last",
      "url": "https://hospital.example.org/fhir/Patient?name=王&_count=20&__page=8"
    }
  ],
  "entry": [
    // 20 筆結果
  ]
}
\`\`\`

## Bundle 導覽連結類型

| relation | 說明 | 用途 |
|----------|------|------|
| \`self\` | 目前頁面 | 當前搜尋的 URL |
| \`first\` | 第一頁 | 返回搜尋結果的第一頁 |
| \`last\` | 最後一頁 | 返回搜尋結果的最後一頁 |
| \`next\` | 下一頁 | 返回下一頁結果 |
| \`previous\` | 上一頁 | 返回上一頁結果 |

## 實際分頁範例

### 範例 1：逐頁瀏覽患者清單

**第 1 頁：初始搜尋**
\`\`\`bash
GET /fhir/Patient?name=王&_count=20

# 返回：
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 150,
  "link": [
    {
      "relation": "self",
      "url": "...?name=王&_count=20"
    },
    {
      "relation": "next",
      "url": "...?name=王&_count=20&__page=2"
    },
    {
      "relation": "last",
      "url": "...?name=王&_count=20&__page=8"
    }
  ],
  "entry": [ /* 20 筆患者 */ ]
}
\`\`\`

**第 2 頁：點擊 next 連結**
\`\`\`bash
GET /fhir/Patient?name=王&_count=20&__page=2

# 返回：
{
  "link": [
    {
      "relation": "self",
      "url": "...?name=王&_count=20&__page=2"
    },
    {
      "relation": "previous",
      "url": "...?name=王&_count=20&__page=1"
    },
    {
      "relation": "next",
      "url": "...?name=王&_count=20&__page=3"
    },
    {
      "relation": "last",
      "url": "...?name=王&_count=20&__page=8"
    }
  ],
  "entry": [ /* 20 筆患者 */ ]
}
\`\`\`

**最後一頁**
\`\`\`bash
GET /fhir/Patient?name=王&_count=20&__page=8

# 返回：
{
  "link": [
    {
      "relation": "self",
      "url": "...?name=王&_count=20&__page=8"
    },
    {
      "relation": "previous",
      "url": "...?name=王&_count=20&__page=7"
    },
    {
      "relation": "first",
      "url": "...?name=王&_count=20&__page=1"
    }
    // 沒有 "next" 連結，表示已在最後一頁
  ],
  "entry": [ /* 10 筆患者 */ ]  // 可能少於 20 筆
}
\`\`\`

### 範例 2：檢驗結果分頁

\`\`\`bash
# 第 1 頁：患者的最近檢驗（每頁 30 筆）
GET /fhir/Observation?subject=Patient/P001&_count=30&_sort=-date

# 返回：最近 30 筆檢驗

# 第 2 頁：早期的檢驗
GET /fhir/Observation?subject=Patient/P001&_count=30&_sort=-date&__page=2

# 返回：更早的 30 筆檢驗
\`\`\`

## _sort 參數 - 排序

除了分頁，通常需要指定排序順序：

\`\`\`bash
# 按患者姓名升序排列
GET /fhir/Patient?_count=20&_sort=name

# 按建立日期降序排列（-表示降序）
GET /fhir/Observation?subject=Patient/P001&_count=20&_sort=-date

# 多字段排序
GET /fhir/Patient?_count=20&_sort=family,given

# 患者按建立時間降序，然後按姓名升序
GET /fhir/Patient?_count=20&_sort=-_lastUpdated,family
\`\`\`

## 常見分頁實現方式

### 方式 1：使用 Bundle 導覽連結（推薦）
\`\`\`javascript
// 簡單 Web 應用
let nextPage = null;

function fetchNextPage() {
  // 從前一次搜尋結果的 Bundle 中取得 next 連結
  if (nextPage) {
    fetch(nextPage)
      .then(response => response.json())
      .then(bundle => {
        displayResults(bundle.entry);
        // 更新 nextPage 為下一頁連結
        nextPage = bundle.link.find(l => l.relation === 'next')?.url;
      });
  }
}

// 初始搜尋
function initialSearch() {
  fetch('/fhir/Patient?name=王&_count=20')
    .then(response => response.json())
    .then(bundle => {
      displayResults(bundle.entry);
      nextPage = bundle.link.find(l => l.relation === 'next')?.url;
    });
}
\`\`\`

### 方式 2：使用 _offset（不標準，注意相容性）
\`\`\`bash
# 第 1 頁
GET /fhir/Patient?name=王&_count=20&_offset=0

# 第 2 頁
GET /fhir/Patient?name=王&_count=20&_offset=20

# 第 3 頁
GET /fhir/Patient?name=王&_count=20&_offset=40
\`\`\`

**缺點**：
- 不是 FHIR 標準
- 某些伺服器不支援
- 高偏移量效能差

### 方式 3：後續符號分頁
某些伺服器使用不透明的後續符號（continuation token）：

\`\`\`bash
# 第 1 頁
GET /fhir/Patient?name=王&_count=20

# 返回中包含 continuation token
{
  "link": [
    {
      "relation": "next",
      "url": "...?_page_id=abc123def456"
    }
  ]
}

# 第 2 頁：直接使用返回的連結，無需自己構造參數
GET /fhir/Patient?_page_id=abc123def456
\`\`\`

## 分頁最佳實踐

### 1. 優先使用 Bundle 導覽連結
\`\`\`javascript
// ✓ 好做法
const nextLink = bundle.link.find(l => l.relation === 'next')?.url;

// ✗ 不推薦
const pageNumber = currentPage + 1;
const nextUrl = \`\${baseUrl}?_count=20&__page=\${pageNumber}\`;
\`\`\`

### 2. 合理設定 _count
\`\`\`bash
# ✓ 適中的分頁大小
_count=20 或 _count=50

# ✗ 過小（太多頁面，多次請求）
_count=1

# ✗ 過大（每頁資料太多，傳輸慢）
_count=10000
\`\`\`

### 3. 檢查伺服器支援
\`\`\`bash
# 查詢伺服器的能力聲明
GET /fhir/metadata

# 檢查 CapabilityStatement 中的搜尋能力配置
# 確認支援的分頁方式
\`\`\`

### 4. 處理結果集變化
搜尋過程中，資料可能被新增/刪除，導致結果集大小變化：
\`\`\`bash
# 使用 total 欄位追蹤總數
{
  "total": 150  // 搜尋最初執行時的結果總數
}

# 資料變化可能導致分頁偏差
# 優先使用 Bundle 導覽連結，而非自行計算
\`\`\`

## 常見分頁場景

| 場景 | 實現方式 |
|------|---------|
| Web 應用逐頁瀏覽 | 使用 Bundle 導覽連結 |
| 行動應用下拉載入更多 | 儲存下一頁 URL，按需取得 |
| 後端批次處理 | 使用 _count 和導覽連結 |
| 報表導出全量資料 | 迴圈使用導覽連結直到沒有 next |
| 快速篩選小結果集 | 加大 _count 或一次性取全部 |

## 效能提示

1. **避免大偏移量**：
   \`\`\`bash
   # ✗ 效能差
   GET /fhir/Patient?_count=20&_offset=100000
   
   # ✓ 使用導覽連結
   GET /fhir/Patient?_count=20&__page=5000
   \`\`\`

2. **加上排序提升穩定性**：
   \`\`\`bash
   # 確保一致的排序
   GET /fhir/Patient?name=王&_count=20&_sort=_id
   \`\`\`

3. **考慮使用時間範圍限制**：
   \`\`\`bash
   # 而非分頁遍歷所有記錄
   GET /fhir/Observation?date=ge2024-01-01&date=le2024-01-31&_count=100
   \`\`\`

---

**提示**：FHIR 標準優先推薦使用 Bundle 導覽連結進行分頁，確保最佳相容性和穩定性。
`;export{e as default};