# 實作練習

透過以下四個練習，你將從探索 Foundry Gallery 到本地部署、資料操作，最終整合驗證工作流程。建議按順序完成。

---

## 8.5.1 練習一：探索 Foundry Gallery

**目標：** 熟悉 Foundry Gallery 的介面和搜尋功能，建立對 FHIR 工具生態的概覽。

**預計時間：** 20 分鐘

### 步驟

**1. 開啟 Foundry Gallery**

打開瀏覽器，前往 `https://foundry.hl7.org`。

**2. 瀏覽首頁**

注意以下資訊：
- 目前共有多少個已發佈產品？
- 頁面上有哪些篩選器？

**3. 搜尋並比較三個產品**

使用搜尋欄搜尋 `"FHIR server"`，從結果中選擇三個產品，填入下表：

| 比較項目 | 產品 A | 產品 B | 產品 C |
|---|---|---|---|
| 產品名稱 | | | |
| FHIR 版本 | | | |
| 程式語言 | | | |
| 授權類型 | | | |
| 最後更新 | | | |
| GitHub Stars | | | |

**4. 找到特定類型的工具**

使用篩選器找到以下工具，記下產品名稱：
- [ ] 一個支援 FHIR R5 的伺服器
- [ ] 一個 FHIR Validator 工具
- [ ] 一個用 Python 寫的 FHIR 工具（如果存在）

### 思考問題

完成後，思考以下問題：

1. 你最感興趣的產品是哪一個？為什麼？
2. 如果要為一個醫院 EHR 系統選擇 FHIR Server，你會優先考慮哪些因素？
3. Gallery 上是否有你沒想到的 FHIR 工具類型？

---

## 8.5.2 練習二：本地部署 FHIR Server

**目標：** 成功在本地啟動一個 FHIR R4 伺服器，並建立基本的 FHIR 資源。

**預計時間：** 30-45 分鐘

**前置條件：** 已安裝 Docker Desktop（參考 8.3.1）

### 步驟

**1. 啟動 FHIR Candle**

```bash
# 拉取 image
docker pull ghcr.io/fhir/fhir-candle:latest

# 啟動伺服器
docker run -d \
  --name fhir-exercise \
  -p 8080:5826 \
  ghcr.io/fhir/fhir-candle:latest \
  --r4 exercise

# 確認啟動成功
docker ps | grep fhir-exercise
```

**2. 驗證伺服器可連線**

```bash
curl -s http://localhost:8080/fhir/r4/metadata \
  -H "Accept: application/fhir+json" \
  | jq '.software.name'
# 預期輸出："fhir-candle"
```

**3. 建立 3 個 Patient Resources**

```bash
# Patient 1：王大明
curl -s -X POST http://localhost:8080/fhir/r4/Patient \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [{"family": "王", "given": ["大明"]}],
    "gender": "male",
    "birthDate": "1985-03-15",
    "identifier": [{"system": "http://example.org/mrn", "value": "MRN-001"}]
  }' | jq '{id: .id, name: .name[0]}'

# Patient 2：李小華
curl -s -X POST http://localhost:8080/fhir/r4/Patient \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [{"family": "李", "given": ["小華"]}],
    "gender": "female",
    "birthDate": "1990-07-20",
    "identifier": [{"system": "http://example.org/mrn", "value": "MRN-002"}]
  }' | jq '{id: .id, name: .name[0]}'

# Patient 3：陳志明
curl -s -X POST http://localhost:8080/fhir/r4/Patient \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [{"family": "陳", "given": ["志明"]}],
    "gender": "male",
    "birthDate": "1975-11-30",
    "identifier": [{"system": "http://example.org/mrn", "value": "MRN-003"}]
  }' | jq '{id: .id, name: .name[0]}'
```

**4. 為每個 Patient 建立 Observation**

使用步驟 3 取得的 Patient ID（替換 `{PATIENT_ID}`）：

```bash
# 血壓觀察值（替換 {PATIENT_ID} 為實際 ID）
curl -s -X POST http://localhost:8080/fhir/r4/Observation \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Observation",
    "status": "final",
    "code": {
      "coding": [{
        "system": "http://loinc.org",
        "code": "55284-4",
        "display": "Blood pressure systolic and diastolic"
      }]
    },
    "subject": {"reference": "Patient/{PATIENT_ID}"},
    "effectiveDateTime": "2025-01-15T09:00:00+08:00",
    "component": [
      {
        "code": {"coding": [{"system": "http://loinc.org", "code": "8480-6", "display": "Systolic blood pressure"}]},
        "valueQuantity": {"value": 120, "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]"}
      },
      {
        "code": {"coding": [{"system": "http://loinc.org", "code": "8462-4", "display": "Diastolic blood pressure"}]},
        "valueQuantity": {"value": 80, "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]"}
      }
    ]
  }' | jq '{id: .id, status: .status}'
```

**5. 查詢特定 Patient 的所有 Observation**

```bash
# 查詢某位病患的所有 Observation
curl -s "http://localhost:8080/fhir/r4/Observation?patient={PATIENT_ID}" \
  -H "Accept: application/fhir+json" \
  | jq '{total: .total, entries: [.entry[]?.resource | {id: .id, code: .code.coding[0].display}]}'
```

**6. 驗收標準**

完成後確認：
- [ ] `docker ps` 顯示 `fhir-exercise` 容器在執行中
- [ ] `GET /metadata` 回應正常
- [ ] 已成功建立 3 個 Patient（取得各自的 ID）
- [ ] 每個 Patient 至少有 1 個 Observation
- [ ] 搜尋 API 能正確回傳特定 Patient 的 Observation

**7. 清理（完成後）**

```bash
docker rm -f fhir-exercise
```

---

## 8.5.3 練習三：使用 API 測試面板驗證

**目標：** 將本地 Foundry Server 與本站 API 測試面板整合，執行完整的 CRUD 操作。

**預計時間：** 20 分鐘

**前置條件：** 完成練習二，FHIR Server 仍在運行

### 步驟

**1. 重新啟動 FHIR Server（如果已停止）**

```bash
docker run -d \
  --name fhir-tester \
  -p 8080:5826 \
  ghcr.io/fhir/fhir-candle:latest \
  --r4 test
```

**2. 開啟 API 測試面板**

在本網站導航至 **API 測試面板**（`/api-tester`）。

**3. 設定伺服器 URL**

在伺服器 URL 欄位中輸入：
```
http://localhost:8080/fhir/r4
```

**4. 測試 GET /metadata**

從預設請求選擇 `GET /metadata`，點擊發送，確認回應包含 `fhirVersion: "4.0.1"`。

**5. 執行完整 CRUD 操作序列**

依序執行以下操作，每次記錄回應中的 Resource ID：

```
操作一：POST /Patient（建立）
→ 記錄回傳的 id

操作二：GET /Patient/{id}（讀取）
→ 使用操作一的 id

操作三：PUT /Patient/{id}（更新）
→ 修改 birthDate 後送出

操作四：GET /Patient（搜尋）
→ 確認更新後的資料出現在清單中

操作五：DELETE /Patient/{id}（刪除）
→ 確認回應 HTTP 200 或 204

操作六：GET /Patient/{id}（確認刪除）
→ 應收到 HTTP 410 Gone
```

**6. 驗收標準**

- [ ] 成功連接本地 FHIR Server
- [ ] 完整的 CRUD 循環都成功執行
- [ ] 理解每個操作的 HTTP 狀態碼（201 Created, 200 OK, 410 Gone 等）

---

## 8.5.4 練習四：使用 $validate 驗證 Resource

**目標：** 理解 FHIR Resource 驗證流程，能夠解讀和修正驗證錯誤。

**預計時間：** 25 分鐘

**前置條件：** FHIR Server 在 localhost:8080 運行

### 步驟

**1. 準備一個有錯誤的 Patient JSON**

以下 JSON 刻意包含幾個常見錯誤：

```json
{
  "resourceType": "Patient",
  "gender": "Male",
  "birthDate": "1990/01/15",
  "name": [
    {
      "family": "王",
      "use": "nickname"
    }
  ],
  "telecom": [
    {
      "system": "mobile",
      "value": "0912345678"
    }
  ]
}
```

**2. 提交驗證**

```bash
curl -s -X POST "http://localhost:8080/fhir/r4/Patient/\$validate" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "gender": "Male",
    "birthDate": "1990/01/15",
    "name": [{"family": "王", "use": "nickname"}],
    "telecom": [{"system": "mobile", "value": "0912345678"}]
  }' | jq '.issue[] | {severity: .severity, location: .location, message: .diagnostics}'
```

**3. 分析錯誤**

常見的驗證錯誤類型：

| 錯誤 | 原因 | 修正方式 |
|---|---|---|
| `gender` 值無效 | FHIR 規定只能是 `male/female/other/unknown`（小寫）| 改為 `"male"` |
| `birthDate` 格式錯誤 | 必須是 `YYYY-MM-DD` 格式 | 改為 `"1990-01-15"` |
| `name.use` 無效 | `use` 必須是 `usual/official/temp/nickname/anonymous/old/maiden` | 改為 `"usual"` |
| `telecom.system` 無效 | 必須是 `phone/fax/email/pager/url/sms/other` | 改為 `"phone"` |

**4. 修正並重新驗證**

```bash
curl -s -X POST "http://localhost:8080/fhir/r4/Patient/\$validate" \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "gender": "male",
    "birthDate": "1990-01-15",
    "name": [{"family": "王", "use": "usual"}],
    "telecom": [{"system": "phone", "value": "0912345678"}]
  }' | jq '.issue[] | select(.severity != "information") | {severity: .severity, message: .diagnostics}'
```

如果只剩 `information` 等級的訊息（沒有 `error` 或 `warning`），表示驗證通過。

**5. 挑戰題：Observation 驗證**

試著提交以下有問題的 Observation，找出並修正錯誤：

```json
{
  "resourceType": "Observation",
  "status": "completed",
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "8480-6"
    }]
  },
  "subject": {"reference": "Patient/12345"},
  "valueQuantity": {
    "value": "120",
    "unit": "mmHg"
  }
}
```

:::tip
提示：`status` 的有效值是 `registered/preliminary/final/amended/corrected/cancelled/entered-in-error/unknown`，`valueQuantity.value` 應該是數字而非字串。
:::

**6. 驗收標準**

- [ ] 能識別並說明 Patient JSON 中的所有錯誤
- [ ] 修正後的 Patient 通過驗證（無 error/warning）
- [ ] 完成 Observation 挑戰題，找到並修正錯誤
- [ ] 理解 `error`、`warning`、`information` 三種嚴重程度的差異

---

## 8.5.5 本章總結

完成以上四個練習後，你應該能夠：

✅ 在 Foundry Gallery 中搜尋和評估 FHIR 工具  
✅ 使用 Docker 在本地快速啟動 FHIR Server  
✅ 執行完整的 FHIR CRUD 操作  
✅ 使用 `$validate` 驗證 FHIR Resource 的合規性  

**下一步學習建議：**

1. 嘗試啟動 HAPI FHIR（持久化版本），比較與 FHIR Candle 的差異
2. 探索 Foundry 上的其他工具，如 Inferno Test Suite
3. 如果你有自己的 FHIR 工具，嘗試將它容器化並準備提交到 Foundry Gallery
4. 將 Foundry Server 整合到你的 CI/CD 流程中（參考 8.4.6）

:::tip
本網站的所有前幾章內容都可以在 Foundry 部署的本地 FHIR Server 上練習。建議回頭重做第 3-6 章的範例，這次使用你自己的本地伺服器，不依賴公共測試端點。
:::
