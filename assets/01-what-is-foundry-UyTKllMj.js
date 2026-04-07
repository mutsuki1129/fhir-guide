var e=`# 什麼是 FHIR Foundry？

HL7 FHIR Foundry 是 HL7 於 2024 年 5 月在達拉斯 Connectathon 正式推出的集中式生態平台，目標是成為全球 FHIR 實作者探索、測試、部署參考實作（Reference Implementation）的統一中心。截至 2025 年，Foundry 已上架超過 86 個已發佈產品，持續快速成長。

---

## 8.1.1 平台定位與背景

### FHIR Foundry 解決了什麼問題？

在 Foundry 出現之前，FHIR 開發者面臨的常見痛點：

| 問題 | 舊做法 | Foundry 的解法 |
|---|---|---|
| 找不到合適的 FHIR Server | 自行 Google、翻 GitHub | Gallery 集中策展，可搜尋篩選 |
| 環境建置複雜耗時 | 手動下載、設定、踩雷 | 一鍵 Docker 啟動 |
| 只有 Connectathon 期間能測試 | 被動等待活動 | 隨時可以持續測試 |
| 工具品質參差不齊 | 難以判斷可信度 | HL7 審核並策展 |
| Logica Sandbox 關閉 | 失去公共測試環境 | Foundry 提供新的替代方案 |

### 平台核心目標（三步驟）

\`\`\`
Discover（探索）→ Try（試用）→ Test（測試）
\`\`\`

1. **Discover**：在 Gallery 中找到符合需求的工具
2. **Try**：在雲端或本地啟動，立即試用
3. **Test**：整合進開發流程，持續驗證你的 FHIR 應用

---

## 8.1.2 兩大核心組件

### Foundry Gallery（產品目錄）

Gallery 是 Foundry 的核心功能，是開源參考實作的策展目錄。

**主要特色：**
- 可依技術（Java、.NET、Python 等）篩選
- 可依角色（開發者、測試者、分析師）篩選
- 可依 FHIR 版本（R4、R4B、R5）篩選
- 可依領域（基因組學、藥物、臨床等）篩選
- 每個產品都標示授權、版本、FHIR 相容性

:::tip
不需要帳號就能瀏覽 Gallery。建立帳號後可以使用雲端啟動功能。
:::

### Foundry Hosting（雲端代管）

Foundry 提供 HL7 管理的雲端環境，讓你不需要自己架伺服器：

- 直接連結 GitHub 和 Docker Hub
- 支援持續整合 / 持續部署（CI/CD）
- 開發者可從 Gallery 直接啟動雲端實例（有生命週期限制）
- 也支援本地 Docker 自行部署

---

## 8.1.3 底層技術：Skycapp 平台

Foundry 的底層平台技術由 **Skycapp**（CTO: Preston Lee）提供。Skycapp 是一個容器化應用程式管理平台，負責 Foundry 的產品管理、部署流程和 CI/CD 整合。

**技術架構概覽：**
\`\`\`
┌─────────────────────────────────────┐
│           FHIR Foundry              │
│  ┌─────────────┐ ┌────────────────┐ │
│  │   Gallery   │ │    Hosting     │ │
│  │  (目錄展示)  │ │  (雲端部署)    │ │
│  └─────────────┘ └────────────────┘ │
│         底層：Skycapp Platform       │
└─────────────────────────────────────┘
         │                 │
    GitHub Repos      Docker Hub
\`\`\`

---

## 8.1.4 Foundry 與其他 FHIR 工具的關係

:::warning
Foundry 不是要取代 HAPI FHIR、Forge、Inferno 等工具，而是提供一個「發現和部署」這些工具的統一入口。可以把它想成「FHIR 工具的 App Store」。
:::

**比較：傳統做法 vs 使用 Foundry**

\`\`\`
傳統做法：
1. Google 搜尋 "FHIR R4 server java"
2. 找到 HAPI FHIR GitHub
3. 閱讀 README，看懂 Maven 設定
4. 安裝 Java、設定環境變數
5. 編譯或下載 JAR 檔
6. 踩坑、查文件、解決問題
⏱️ 可能花費 2-4 小時

使用 Foundry：
1. 打開 foundry.hl7.org
2. 搜尋 "HAPI FHIR"
3. 點擊啟動 / 下載 docker-compose.yml
4. docker compose up -d
⏱️ 約 10-15 分鐘
\`\`\`

---

## 8.1.5 Gallery 上的熱門產品一覽

| 產品名稱 | 類型 | FHIR 版本 | 特色 |
|---|---|---|---|
| FHIR Candle | FHIR Server | R4, R4B, R5 | 輕量記憶體伺服器，Microsoft 開發，適合開發測試 |
| HAPI FHIR Plain Server | FHIR Server | R4 | 最廣泛使用的 Java 實作 |
| WildFHIR Community | FHIR Server | R4 | AEGIS 開發，完整 R4 實作 |
| Inferno Test Suite | 測試工具 | R4 | ONC 官方認證測試框架 |
| FHIR Validator | 驗證工具 | R4, R5 | HL7 官方資源驗證器 |
| Sandbox Community Edition | 完整沙箱 | R4 | 含 SMART on FHIR OAuth |

💡 完整產品列表請前往 [foundry.hl7.org](https://foundry.hl7.org) 瀏覽，新產品持續加入中。

---

## 8.1.6 為什麼開發者該關注 Foundry？

**對 FHIR 初學者：**
- 快速建立可用的測試環境，無需深入了解每個工具的安裝細節
- 所有工具都經過 HL7 審核，品質有保障

**對 FHIR 開發者：**
- 發現新工具的最佳管道
- 可以將自己的開源 FHIR 工具發佈到 Gallery，讓全球開發者使用

**對組織 / 廠商：**
- 展示符合 HL7 標準的參考實作
- 參與 FHIR Connectathon 生態的持續測試

:::tip
本網站的 API 測試面板可以連接你在 Foundry 上啟動的本地伺服器。在接下來的章節中，我們會示範如何整合使用。
:::
`;export{e as default};