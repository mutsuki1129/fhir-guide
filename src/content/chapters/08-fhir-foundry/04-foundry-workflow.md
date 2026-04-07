# 開發者工作流程

本節說明如何將 FHIR Foundry 整合進你的日常開發流程，以及進階的產品組合和發佈方式。

---

## 8.4.1 開發者典型工作流程

### 完整六步驟流程

```
Step 1: 在 Foundry Gallery 搜尋所需工具
         ↓
Step 2: 評估產品（版本、授權、FHIR 版本）
         ↓
Step 3: 在本地啟動（Docker）
         ↓
Step 4: 開發和測試你的 FHIR 應用
         ↓
Step 5: 使用 RI Server 驗證客戶端應用
         ↓
Step 6: 迭代改進
```

### 實際情境範例

**情境：開發一個 iOS 健康 App，需要讀寫 FHIR R4 資料**

```bash
# Step 1-2：找到並評估 FHIR Candle（輕量 R4 伺服器）
# 確認：Apache 2.0 授權 ✅、R4 支援 ✅、最近有更新 ✅

# Step 3：本地啟動
docker run -d --name fhir-candle -p 8080:5826 \
  ghcr.io/fhir/fhir-candle:latest --r4 dev

# Step 4-5：在 App 中連接 http://localhost:8080/fhir/r4
#           開發 Patient CRUD 功能
#           用 $validate 驗證 App 產生的 FHIR Resource

# Step 6：修正驗證錯誤，重新測試
```

---

## 8.4.2 進階用法：產品組合

在真實開發中，你可能需要同時運行多個 Foundry 產品。以下是常見的組合方式。

### 組合範例 1：FHIR Server + Validator

同時啟動 FHIR Candle（儲存資料）和 HL7 官方 Validator（驗證資源）：

```yaml
# docker-compose.fhir-dev.yml
version: '3.8'
services:

  # FHIR Server（存取資料）
  fhir-candle:
    image: ghcr.io/fhir/fhir-candle:latest
    ports:
      - "8080:5826"
    command: ["--r4", "default"]

  # HL7 官方 FHIR Validator
  fhir-validator:
    image: ghcr.io/hapifhir/hapi-fhir-cli:latest
    ports:
      - "8081:8080"
    command: ["hapi-fhir-cli", "run-server", "-v", "r4"]
```

```bash
# 啟動全部
docker compose -f docker-compose.fhir-dev.yml up -d

# FHIR Server: http://localhost:8080/fhir/r4
# Validator:   http://localhost:8081
```

### 組合範例 2：HAPI FHIR Server + 資料庫持久化

```yaml
# docker-compose.hapi-persistent.yml
version: '3.8'
services:

  hapi-fhir:
    image: hapiproject/hapi:latest
    ports:
      - "8090:8080"
    depends_on:
      - postgres
    environment:
      - spring.datasource.url=jdbc:postgresql://postgres:5432/hapi
      - spring.datasource.username=hapi
      - spring.datasource.password=hapi
      - hapi.fhir.fhir_version=R4

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=hapi
      - POSTGRES_USER=hapi
      - POSTGRES_PASSWORD=hapi
    volumes:
      - hapi-data:/var/lib/postgresql/data

volumes:
  hapi-data:
```

:::tip
使用 Docker Compose 時，所有服務共用同一個網路，可以直接用服務名稱（如 `postgres`）互相存取，不需要知道 IP 位址。
:::

---

## 8.4.3 開發工作流程最佳實踐

### 環境分層管理

```
開發環境（本地）：
├── FHIR Candle（快速啟動，記憶體型）
└── 用於日常開發和快速驗證

測試環境（本地/CI）：
├── HAPI FHIR + PostgreSQL（持久化）
└── 用於整合測試和功能驗證

模擬生產環境（CI/CD）：
├── 完整 Foundry Stack（含 Validator）
└── 用於端到端測試
```

### 使用 .env 檔案管理設定

```bash
# .env
FHIR_SERVER_PORT=8080
FHIR_VERSION=R4
FHIR_IMAGE=ghcr.io/fhir/fhir-candle:latest
```

```yaml
# docker-compose.yml
services:
  fhir-server:
    image: ${FHIR_IMAGE}
    ports:
      - "${FHIR_SERVER_PORT}:5826"
```

---

## 8.4.4 Foundry 與 Connectathon 的關係

### 什麼是 Connectathon？

HL7 Connectathon 是定期舉辦的 FHIR 實作測試活動，讓開發者帶著自己的系統互相測試互操作性（Interoperability）。

**過去的問題：** 測試只能在活動期間（通常一年兩次）進行

**Foundry 如何改變這一切：**

```
傳統模式：
[Connectathon 活動] → 集中測試 → 等下次活動 → 再測試

Foundry 模式：
[隨時] → 啟動 Foundry RI Server → 持續測試 → 準備好了再參加 Connectathon
```

| 比較項目 | 傳統 Connectathon | 使用 Foundry |
|---|---|---|
| 測試時機 | 每年 2-3 次活動期間 | 全年隨時 |
| 測試環境 | 需現場設定 | 本地或雲端即開即用 |
| 適合對象 | 有經驗的實作者 | 初學者也能參與 |
| 學習曲線 | 較高 | 較低 |

:::tip
即使你不打算參加 Connectathon，Foundry 上的 Reference Implementation 也是驗證你的 FHIR 實作是否符合規範的最佳方式。
:::

---

## 8.4.5 發佈自己的產品到 Foundry

如果你開發了一個 FHIR 工具，可以將它發佈到 Foundry Gallery，讓全球開發者使用。

### 發佈必要條件

#### 1. 授權要求

必須使用以下其中一種開源授權：
- Apache License 2.0（最常見）
- MIT License
- BSD 2-Clause / 3-Clause License
- Mozilla Public License 2.0

:::warning
GPL 授權目前不在 Foundry 接受的授權列表中。如果你計畫發佈，請提前確認授權相容性。
:::

#### 2. 容器化要求

```
必要：
□ 提供 Docker image（linux/amd64 架構）
□ 上傳到 Docker Hub 或 GitHub Container Registry (GHCR)
□ Image 必須公開可拉取（不需登入）

建議：
□ 也提供 linux/arm64 架構（支援 Apple Silicon）
□ 提供 docker-compose.yml 範例
□ 在 README 說明環境變數和啟動參數
```

#### 3. 包含種子資料（建議）

產品最好包含測試用的初始資料（Seed Data），讓使用者啟動後立即可以體驗功能：

```bash
# 範例：在啟動時自動載入測試資料
docker run -d \
  --name my-fhir-tool \
  -e LOAD_SAMPLE_DATA=true \
  -p 8080:8080 \
  myorg/my-fhir-tool:latest
```

### 提交流程

1. 準備好符合要求的 Docker image
2. 到 `https://foundry.hl7.org` 登入並進入 Account 頁面
3. 點擊 "Submit a Product"
4. 填寫產品資訊（名稱、描述、技術標籤等）
5. 提供 Docker image 路徑和 docker-compose.yml
6. HL7 團隊審核（通常數個工作天）
7. 審核通過後上架 Gallery

---

## 8.4.6 CI/CD 整合

將 Foundry 產品整合到自動化測試流程中：

### GitHub Actions 範例

```yaml
# .github/workflows/fhir-integration-test.yml
name: FHIR Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      fhir-server:
        image: ghcr.io/fhir/fhir-candle:latest
        ports:
          - 8080:5826
        options: --health-cmd "curl -f http://localhost:5826/fhir/r4/metadata" --health-interval 10s --health-timeout 5s --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Wait for FHIR server
        run: |
          until curl -s http://localhost:8080/fhir/r4/metadata > /dev/null; do
            echo "Waiting for FHIR server..."
            sleep 2
          done
      
      - name: Run FHIR integration tests
        env:
          FHIR_BASE_URL: http://localhost:8080/fhir/r4
        run: npm test
```

:::tip
在 CI/CD 中使用 FHIR Candle 特別合適，因為它啟動快、無需資料庫依賴、每次都是全新狀態（記憶體型），非常適合自動化測試。
:::
