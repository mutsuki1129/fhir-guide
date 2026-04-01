# RESTful API 基礎回顧

FHIR 的核心是 RESTful API。如果你已熟悉 REST，可以快速瀏覽本節；如果你是 REST 新手，請仔細閱讀，這是後續所有實作的基礎。

---

## HTTP 動詞對應 CRUD

REST（Representational State Transfer）使用 HTTP 標準動詞操作資源：

| HTTP 動詞 | 對應操作 | FHIR 用途 | 冪等性 |
|-----------|----------|-----------|--------|
| `GET` | 讀取 | 查詢/讀取 Resource | ✅ 是 |
| `POST` | 建立 | 建立新 Resource | ❌ 否 |
| `PUT` | 完整替換 | 完整更新 Resource | ✅ 是 |
| `PATCH` | 部分更新 | 部分修改 Resource | ✅ 是 |
| `DELETE` | 刪除 | 刪除 Resource | ✅ 是 |

**冪等性（Idempotent）**：重複執行相同請求，結果不變。例如，重複 GET 同一個資源，總是返回相同結果。

---

## FHIR RESTful URL 結構

```
https://hapi.fhir.org/baseR4/{resourceType}/{id}/{_history}/{vid}
         ↑                    ↑             ↑    ↑           ↑
         Base URL             資源類型      ID   歷史路徑    版本ID
```

### 常見 URL 模式

```bash
# 讀取特定 Resource
GET /Patient/123

# 查詢 Resource（搜尋）
GET /Patient?name=王大明&gender=male

# 建立 Resource
POST /Patient

# 完整更新
PUT /Patient/123

# 部分更新（JSON Patch）
PATCH /Patient/123

# 刪除
DELETE /Patient/123

# 歷史版本
GET /Patient/123/_history
GET /Patient/123/_history/2   # 取得第 2 版

# Operations（操作）
GET /Patient/123/$everything
POST /Patient/$validate
```

---

## HTTP 狀態碼

FHIR 伺服器使用標準 HTTP 狀態碼：

| 狀態碼 | 意義 | FHIR 場景 |
|--------|------|-----------|
| `200 OK` | 成功 | GET 成功 |
| `201 Created` | 建立成功 | POST 成功 |
| `204 No Content` | 成功但無回應體 | DELETE 成功 |
| `400 Bad Request` | 請求格式錯誤 | JSON 格式錯誤 |
| `401 Unauthorized` | 未授權 | 需要 Bearer Token |
| `403 Forbidden` | 無權限 | SMART scope 不足 |
| `404 Not Found` | 找不到 | Resource 不存在 |
| `409 Conflict` | 衝突 | 版本衝突 |
| `410 Gone` | 已刪除 | Resource 已被刪除 |
| `422 Unprocessable Entity` | 驗證失敗 | FHIR 規範不符 |
| `500 Internal Server Error` | 伺服器錯誤 | 伺服器內部問題 |

---

## Request / Response Headers

### 重要的請求 Headers

```http
Content-Type: application/fhir+json
Accept: application/fhir+json
If-Match: W/"3"
Prefer: return=representation
```

| Header | 用途 |
|--------|------|
| `Content-Type` | 告知伺服器請求體格式，POST/PUT 必填 |
| `Accept` | 告知伺服器期望的回應格式 |
| `If-Match` | 樂觀鎖，防止覆蓋別人的修改 |
| `Prefer` | 指定回應行為（`return=representation` 要求回傳完整資源）|
| `Authorization` | Bearer Token（SMART on FHIR 認證）|

### 重要的回應 Headers

```http
Content-Type: application/fhir+json; charset=utf-8
Location: https://hapi.fhir.org/baseR4/Patient/456
ETag: W/"1"
Last-Modified: Tue, 15 Jan 2024 09:30:00 GMT
```

| Header | 用途 |
|--------|------|
| `Location` | POST 成功後，告知新資源的 URL |
| `ETag` | 當前版本號，用於樂觀鎖（`If-Match`）|
| `Last-Modified` | 最後修改時間 |

---

## FHIR 的版本控制機制

FHIR 透過 `meta.versionId` 和 ETag 實現樂觀鎖（Optimistic Locking）：

```
1. 讀取 Resource（取得 ETag: W/"1"）
   GET /Patient/123
   → Response: ETag: W/"1"

2. 修改後送出更新，附上版本號
   PUT /Patient/123
   If-Match: W/"1"
   → 若版本一致：200 OK，ETag 更新為 W/"2"
   → 若版本衝突：409 Conflict（被別人改過了）
```

這個機制防止並發修改導致的資料遺失問題（Last-Write-Wins 問題）。

---

## 實際操作練習

以下是用 cURL 操作 FHIR API 的基本範例：

```bash
# 查詢所有 Patient
curl -X GET \
  "https://hapi.fhir.org/baseR4/Patient?_count=5" \
  -H "Accept: application/fhir+json"

# 建立一個 Patient
curl -X POST \
  "https://hapi.fhir.org/baseR4/Patient" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [{"family": "陳", "given": ["小華"]}],
    "gender": "female",
    "birthDate": "1990-07-20"
  }'

# 讀取特定 Patient（替換 {id} 為實際 ID）
curl -X GET \
  "https://hapi.fhir.org/baseR4/Patient/{id}" \
  -H "Accept: application/fhir+json"
```

:::tip 使用本教學的 API 測試面板
不需要安裝 cURL！點擊頂部選單的「API 測試」，就能在瀏覽器中直接測試這些請求。預設已連接 HAPI FHIR 公開測試伺服器，完全免費使用。
:::

---

## OperationOutcome：錯誤回應格式

當 FHIR 請求失敗時，伺服器會回傳 `OperationOutcome` Resource：

```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "diagnostics": "HAPI-1838: Invalid JSON content detected...",
      "location": ["Patient.name[0].family"]
    }
  ]
}
```

| 欄位 | 值 |
|------|-----|
| `severity` | `fatal` / `error` / `warning` / `information` |
| `code` | 錯誤類型碼（如 `invalid`, `not-found`, `forbidden`）|
| `diagnostics` | 人類可讀的詳細錯誤訊息 |
| `location` | 發生錯誤的資源路徑 |

下一節，我們將進入實作：設定開發環境並發出第一個 FHIR 請求！
