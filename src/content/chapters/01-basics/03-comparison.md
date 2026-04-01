# FHIR 與其他標準的比較

本節深入比較 FHIR 與 HL7 v2、CDA 的差異，幫助你理解 FHIR 的設計優勢，以及在實際場景中如何選擇。

---

## 並排比較

### 場景：傳送病患入院通知

**HL7 v2（ADT A01 訊息）**

```
MSH|^~\&|HIS|HOSPITAL_A|ADT|HOSPITAL_B|20240115093000||ADT^A01^ADT_A01|MSG001|P|2.5|||NE|NE|
EVN|A01|20240115093000|
PID|1||A123456789^^^NHI^NI||王^大明^||19850315|M|||台北市信義路五段7號^^台北^^110^TW|||||||
PV1|1|I|5N^502^A|EL|||1234^李^醫師|||SUR||||ADM|
```

這個格式需要對照規格書才能解讀，每個 `^` 和 `|` 的位置都有嚴格定義。

---

**HL7 CDA（臨床文件架構）**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ClinicalDocument xmlns="urn:hl7-org:v3">
  <typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>
  <id root="2.16.840.1.113883.3.933" extension="A123"/>
  <code code="34108-1" codeSystem="2.16.840.1.113883.6.1"
        displayName="Outpatient Note"/>
  <title>入院病歷</title>
  <effectiveTime value="20240115093000+0800"/>
  <!-- ... 數百行 XML ... -->
  <recordTarget>
    <patientRole>
      <id root="2.16.840.1.113883.3.989.2.1.3.1" extension="A123456789"/>
      <patient>
        <name>
          <given>大明</given>
          <family>王</family>
        </name>
        <administrativeGenderCode code="M"
          codeSystem="2.16.840.1.113883.5.1"/>
        <birthTime value="19850315"/>
      </patient>
    </patientRole>
  </recordTarget>
</ClinicalDocument>
```

XML 結構清晰但冗長，OID（Object Identifier）難以記憶和查詢。

---

**FHIR R4（JSON）**

```json
{
  "resourceType": "Encounter",
  "id": "enc-001",
  "status": "in-progress",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "IMP",
    "display": "inpatient encounter"
  },
  "subject": { "reference": "Patient/A123456789", "display": "王大明" },
  "period": { "start": "2024-01-15T09:30:00+08:00" },
  "participant": [
    {
      "individual": {
        "reference": "Practitioner/doctor-1234",
        "display": "李醫師"
      }
    }
  ]
}
```

JSON 格式直觀，任何熟悉 Web 開發的工程師都能快速理解。

---

## 技術特性比較表

| 特性 | HL7 v2 | CDA (v3) | FHIR R4 |
|------|--------|----------|---------|
| 格式 | 管線分隔文字 | XML | JSON / XML |
| API 規範 | 無（靠 socket）| 無 | RESTful HTTP |
| 查詢能力 | 無 | 無 | 豐富的搜尋參數 |
| 版本控制 | 無 | 無 | ETag / If-Match |
| 數位簽章 | 無標準 | 有（但複雜）| Provenance Resource |
| 學習難度 | 中（格式奇特）| 高（XML + OID）| 低（REST + JSON）|
| 實作成本 | 中 | 高 | 低 |
| 語言中立性 | 是 | 是 | 是 |
| 擴充機制 | Z-segments | 有限 | Extensions（標準化）|
| 術語系統 | 私有為主 | OID | SNOMED CT / LOINC / URL |

---

## 各標準適用場景

### HL7 v2 仍在使用的場合

HL7 v2 並沒有消失，在以下場景仍然普遍：

- **醫院內部系統整合**：HIS ↔ LIS（檢驗）、HIS ↔ RIS（放射）
- **醫療設備連接**：床邊監視器、檢體分析儀
- **跨院 ADT 通知**（入院/轉院/出院）

原因：這些系統已安裝數十年，重建成本極高，且功能已夠用。

### CDA 仍在使用的場合

- **法定報告文件**：轉診單、出院摘要、手術紀錄
- **需要完整文件簽章的場合**
- **美國 C-CDA**（Consolidated CDA，標準化的 CDA 文件格式）

### FHIR 的最佳場合

- **新系統建置**：任何新的醫療 IT 系統
- **病患 App**：透過 SMART on FHIR 讓病患存取自己的資料
- **健康雲端平台**：Google Health、Microsoft Azure Health Data Services
- **跨機構資料交換**：病歷摘要共享、轉診
- **台灣健保 API**：政府推動的互通架構
- **AI / ML 資料管線**：統一格式便於訓練

---

## 共存策略

現實中，這三種標準往往同時存在。常見的架構是：

```
[HL7 v2 設備/系統]
        ↓ (v2 to FHIR 轉換器)
[FHIR 中介伺服器]
        ↓
[病患 App / 外部系統] ← FHIR RESTful API
```

HAPI FHIR（我們教學使用的伺服器）有內建的 HL7 v2 to FHIR 轉換功能，這讓舊系統可以漸進式遷移。

:::tip 現實建議
如果你是台灣的醫院 IT 工程師：學習 FHIR R4 是最高優先級，因為衛福部的規範和健保 API 都是基於此。舊有的 HL7 v2 系統可以先保留，用轉換器橋接到 FHIR。
:::
