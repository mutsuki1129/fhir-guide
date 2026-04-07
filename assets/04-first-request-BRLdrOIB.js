var e=`# 第一個 FHIR 請求（互動練習）

理論學夠了，現在動手實作！本節將引導你完成第一個完整的 FHIR CRUD 操作，建立、讀取、更新並刪除一個 Patient Resource。

---

## 目標

完成本練習後，你將能夠：
1. ✅ 建立 (CREATE) 一個 Patient Resource
2. ✅ 讀取 (READ) 剛建立的 Patient
3. ✅ 更新 (UPDATE) 病患的電話號碼
4. ✅ 搜尋 (SEARCH) 病患
5. ✅ 刪除 (DELETE) 測試資料

---

## 準備工作

開啟本教學的 **API 測試面板**（頂部選單 → API 測試），確認已連接到 HAPI FHIR 公開伺服器。

---

## 步驟 1：建立 Patient（CREATE）

**Method**: \`POST\`  
**URL**: \`/Patient\`  
**Body**:

\`\`\`json
{
  "resourceType": "Patient",
  "meta": {
    "profile": ["https://twcore.mohw.gov.tw/ig/twcore/StructureDefinition/Patient-twcore"]
  },
  "identifier": [
    {
      "use": "official",
      "type": {
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
          "code": "NNxxx",
          "display": "National Person Identifier"
        }]
      },
      "system": "https://www.nhi.gov.tw",
      "value": "A987654321"
    }
  ],
  "name": [
    {
      "use": "official",
      "text": "林美玲",
      "family": "林",
      "given": ["美玲"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "0987654321",
      "use": "mobile"
    }
  ],
  "gender": "female",
  "birthDate": "1992-08-25",
  "address": [
    {
      "use": "home",
      "line": ["高雄市苓雅區四維三路2號"],
      "city": "高雄市",
      "postalCode": "802",
      "country": "TW"
    }
  ]
}
\`\`\`

**預期結果**：
- HTTP Status: \`201 Created\`
- Response Header 中有 \`Location: .../Patient/{id}\`
- **記下這個 id！** 後續步驟需要使用。

---

## 步驟 2：讀取 Patient（READ）

將步驟 1 回應中的 \`id\` 替換到下方的 \`{id}\` 位置：

**Method**: \`GET\`  
**URL**: \`/Patient/{id}\`

**預期結果**：
- HTTP Status: \`200 OK\`
- 回傳完整的 Patient JSON
- 注意 \`meta.versionId\` 應為 \`"1"\`（第一版）

---

## 步驟 3：更新電話號碼（UPDATE）

**Method**: \`PUT\`  
**URL**: \`/Patient/{id}\`

更新 \`telecom\` 欄位，加入第二個電話：

\`\`\`json
{
  "resourceType": "Patient",
  "id": "{id}",
  "identifier": [
    {
      "system": "https://www.nhi.gov.tw",
      "value": "A987654321"
    }
  ],
  "name": [
    {
      "use": "official",
      "text": "林美玲",
      "family": "林",
      "given": ["美玲"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "0987654321",
      "use": "mobile"
    },
    {
      "system": "email",
      "value": "mei-ling@example.com",
      "use": "home"
    }
  ],
  "gender": "female",
  "birthDate": "1992-08-25"
}
\`\`\`

**預期結果**：
- HTTP Status: \`200 OK\`
- \`meta.versionId\` 應更新為 \`"2"\`

:::tip PUT vs PATCH
\`PUT\` 是**完整替換**，你送出的 JSON 就是新的資源（\`id\` 欄位必須包含）。  
\`PATCH\` 是**部分更新**，只送出要修改的欄位（使用 JSON Patch 格式）。  
大多數 FHIR 操作使用 \`PUT\`。
:::

---

## 步驟 4：搜尋病患（SEARCH）

**Method**: \`GET\`  
**URL**: \`/Patient?name=林&gender=female\`

FHIR 搜尋支援多種參數組合：

\`\`\`
/Patient?name=林                   → 姓名包含「林」
/Patient?gender=female             → 女性病患
/Patient?birthdate=1992-08-25      → 特定生日
/Patient?identifier=A987654321     → 身分證字號
/Patient?name=林&gender=female     → 組合搜尋（AND）
/Patient?_count=10&_offset=0       → 分頁（取前10筆）
/Patient?_sort=-_lastUpdated       → 按最後更新時間倒序
\`\`\`

**預期結果**：回傳 \`Bundle\` Resource，\`type\` 為 \`searchset\`。

---

## 步驟 5：查看歷史版本（HISTORY）

**Method**: \`GET\`  
**URL**: \`/Patient/{id}/_history\`

這會列出這個 Patient 的所有歷史版本（目前應有 2 版：原始 + 更新後）。

---

## 步驟 6：使用 $validate 驗證

**Method**: \`POST\`  
**URL**: \`/Patient/$validate\`  
**Body**（故意放錯誤的 gender 值）:

\`\`\`json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "resource",
      "resource": {
        "resourceType": "Patient",
        "name": [{"family": "測試"}],
        "gender": "INVALID_GENDER"
      }
    }
  ]
}
\`\`\`

**預期結果**：回傳 \`OperationOutcome\`，指出 \`gender\` 值不合法。

---

## 步驟 7：刪除 Patient（DELETE）

**Method**: \`DELETE\`  
**URL**: \`/Patient/{id}\`

**預期結果**：HTTP Status \`200 OK\` 或 \`204 No Content\`

刪除後嘗試 GET 同一個 ID，會收到 \`410 Gone\`（已刪除，與 \`404 Not Found\` 不同）。

---

## 完整流程回顧

\`\`\`
POST /Patient          → 201 Created, Location: /Patient/123
GET  /Patient/123      → 200 OK, versionId: "1"
PUT  /Patient/123      → 200 OK, versionId: "2"
GET  /Patient?name=林  → 200 OK, Bundle{searchset}
GET  /Patient/123/_history → 200 OK, Bundle{history}
DELETE /Patient/123    → 204 No Content
GET  /Patient/123      → 410 Gone
\`\`\`

恭喜！你已完成第一個完整的 FHIR CRUD 操作。下一章我們將深入學習每個 Resource 的詳細結構。
`;export{e as default};