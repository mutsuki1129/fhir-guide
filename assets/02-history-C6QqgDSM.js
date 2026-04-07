var e=`# FHIR 的歷史與版本演進

了解 FHIR 的歷史，能幫助你理解為什麼它設計成現在這個樣子，以及為什麼選擇 R4 而非其他版本。

---

## HL7 組織簡介

**HL7 International**（Health Level Seven International）成立於 1987 年，是全球最重要的醫療資訊標準組織之一。

「Level Seven」指的是 OSI 網路模型的第七層（應用層），代表 HL7 專注於應用程式層面的醫療資訊交換標準。

---

## 舊有標準的痛點

### HL7 v2（1989 年～現在）

\`\`\`
MSH|^~\\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|
20240115093000||ADT^A01|MSG00001|P|2.5|||NE|NE|
PID|1||123456789^^^NHI||王^大明^||19850315|M|||台北市信義路五段7號^^台北市^^110^TW|
\`\`\`

HL7 v2 是管線分隔（pipe-delimited）的文字格式，問題明顯：
- 格式難以閱讀和除錯
- 每家廠商實作方式各異（方言問題）
- 沒有統一的 API 規範，全靠 socket 連線
- 無法直接用現代 Web 技術處理

### HL7 v3 與 CDA（2005 年）

HL7 v3 改用 XML 格式，Clinical Document Architecture（CDA）更是 XML 文件標準的代表。但問題是：
- XML Schema 極其複雜（數千頁規範）
- 實作成本高，學習曲線陡峭
- 即便是完全符合標準的兩個系統，也可能無法互通

---

## FHIR 的誕生（2011 年）

2011 年，Grahame Grieve（外號「FHIR 之父」）在 HL7 的 Fresh Look 計畫中提出了一個激進的想法：

> 「讓我們用現代 Web 開發者熟悉的技術重新設計醫療資料標準。」

核心設計哲學：
- **80/20 原則**：用 20% 的規範涵蓋 80% 的使用場景，其餘由 Extensions 擴充
- **現代技術**：REST + JSON/XML，開發者零學習成本
- **模組化**：從最小可用單元（Resource）出發，按需組合
- **社群驅動**：公開規範，任何人都可以參與制定

---

## 版本演進時間軸

\`\`\`
2011  ├─ FHIR 概念提出（Grahame Grieve）
      │
2012  ├─ DSTU 1 草案（Draft Standard for Trial Use 1）
      │  • 首個公開草案，Resource 約 49 個
      │
2015  ├─ DSTU 2 / STU2
      │  • 資源增至約 100 個
      │  • Apple HealthKit 採用此版本
      │  • 美國 ONC 開始推廣
      │
2017  ├─ STU3（R3）
      │  • 大規模修訂，Observation 等資源結構調整
      │  • Clinical Reasoning Module 加入
      │  • Google、Microsoft 開始建置 FHIR 服務
      │
2019  ├─ R4 ★ 目前主流版本
      │  • 部分資源首次達到 Normative（規範級，不再大改）
      │  • Normative 資源：Patient, Observation, Bundle...
      │  • 美國 CMS 和 ONC 強制要求採用 R4
      │  • 台灣 TW Core IG 基於 R4
      │
2023  ├─ R5
         • 更多 Normative 資源
         • SubscriptionTopic 改進
         • 不向下相容的修改（需遷移）
         • 現階段台灣尚未要求採用
\`\`\`

---

## 為什麼選擇 R4？

| 指標 | R4 | R5 |
|------|----|----|
| 台灣 TW Core IG | ✅ 基於 R4 | ❌ 尚未支援 |
| HAPI FHIR 穩定度 | ✅ 非常穩定 | ⚠️ 仍在演進 |
| 社群資源 | ✅ 豐富 | ⚠️ 相對較少 |
| 美國 CMS 規定 | ✅ 強制 R4 | — |
| 日本 FHIR 規範 | ✅ 基於 R4 | — |
| Normative 資源 | ✅ 核心資源穩定 | ✅ 更多 |

**結論：在 2025 年，R4 是最務實的學習目標。** 等 R5 生態系成熟、台灣法規更新後，從 R4 遷移到 R5 不會太困難，因為核心概念是相通的。

---

## 里程碑事件

| 年份 | 事件 |
|------|------|
| 2016 | Apple HealthKit 整合 FHIR |
| 2018 | Microsoft Azure 推出 FHIR 服務 |
| 2019 | Google Cloud Healthcare API 支援 FHIR R4 |
| 2020 | 美國 21st Century Cures Act 強制醫療機構提供 FHIR API |
| 2021 | SMART on FHIR 2.0 發布（OAuth 2.0 整合）|
| 2022 | 台灣衛福部啟動 FHIR 推廣計畫 |
| 2023 | 台灣 TW Core IG 1.0.0 正式發布 |
| 2024 | 台灣健保署開始試辦 FHIR 病歷摘要交換 |

:::tip 台灣現況
台灣衛福部目前要求大型醫療機構提供 FHIR R4 API，並以 TW Core IG 為基礎。許多醫學中心已陸續完成 FHIR 伺服器建置。
:::
`;export{e as default};