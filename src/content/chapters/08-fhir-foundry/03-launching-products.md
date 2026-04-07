# 啟動與部署產品

本節說明如何在本地或雲端啟動 Foundry Gallery 中的 FHIR 產品。重點放在本地 Docker 部署，這是學習和開發最實用的方式。

---

## 8.3.1 前置需求

在啟動任何 Foundry 產品前，請確認你的環境已準備好：

### 必要軟體

| 軟體 | 版本建議 | 下載連結 |
|---|---|---|
| Docker Desktop（Windows/Mac）| 最新版 | docker.com/products/docker-desktop |
| Docker Engine（Linux）| 24.0+ | docs.docker.com/engine/install |
| Docker Compose | 2.0+（已內建於 Docker Desktop）| — |

### 系統需求

| 資源 | 最低需求 | 建議 |
|---|---|---|
| RAM | 4 GB | 8 GB 以上 |
| 磁碟空間 | 10 GB（含 Docker images）| 20 GB |
| CPU | 雙核心 | 四核心以上 |

### 驗證 Docker 安裝

```bash
# 確認 Docker 版本
docker --version
# Docker version 26.x.x, build xxxxxxx

# 確認 Docker Compose 版本
docker compose version
# Docker Compose version v2.x.x

# 測試 Docker 正常運作
docker run hello-world
```

---

## 8.3.2 方法一：透過 Foundry UI 啟動（雲端）

適合快速試用，不需要在本地安裝任何東西。

### 步驟

1. 登入 `https://foundry.hl7.org`（需要帳號）
2. 在 Gallery 找到想要的產品（如 "FHIR Candle"）
3. 點擊產品進入詳情頁
4. 找到 **"Docker Stack"** 按鈕
5. 選擇啟動設定（如 `all-r-versions`）
6. 下載自動生成的 `docker-compose.yml` 檔案
7. 在本地執行：
   ```bash
   docker compose up -d --pull always --remove-orphans
   ```

:::warning
雲端實例有生命週期限制，通常會在一段時間後自動關閉。適合短期試用，不適合長期開發。
:::

---

## 8.3.3 方法二：本地 Docker 啟動（推薦學習用）

### 範例 1：啟動 FHIR Candle（最推薦入門）

FHIR Candle 是 Microsoft 開發的輕量記憶體 FHIR 伺服器，是學習 FHIR API 的最佳起點。

```bash
# 拉取最新 FHIR Candle image
docker pull ghcr.io/fhir/fhir-candle:latest

# 啟動伺服器（對應容器 port 5826 到本地 8080）
docker run -d \
  --name fhir-candle \
  -p 8080:5826 \
  ghcr.io/fhir/fhir-candle:latest

# 查看啟動日誌
docker logs fhir-candle

# 驗證伺服器已啟動
curl http://localhost:8080/fhir/r4/metadata | jq '.fhirVersion, .software.name'
```

**啟動後的端點：**

| 端點 | URL |
|---|---|
| Web UI | `http://localhost:8080/` |
| FHIR R4 | `http://localhost:8080/fhir/r4/` |
| FHIR R4B | `http://localhost:8080/fhir/r4b/` |
| FHIR R5 | `http://localhost:8080/fhir/r5/` |

**只啟動 R4（省資源）：**

```bash
docker run -d \
  --name fhir-candle-r4 \
  -p 8080:5826 \
  ghcr.io/fhir/fhir-candle:latest \
  --r4 default
```

:::tip
FHIR Candle 是記憶體型伺服器，重啟後所有資料都會清空。適合開發和測試，不適合需要持久化資料的場景。
:::

---

### 範例 2：啟動 HAPI FHIR Plain Server（持久化儲存）

HAPI FHIR 需要資料庫，建議使用 Docker Compose 一次啟動所有服務：

```yaml
# docker-compose-hapi.yml
version: '3.8'
services:
  hapi-fhir:
    image: hapiproject/hapi:latest
    ports:
      - "8090:8080"
    environment:
      - hapi.fhir.fhir_version=R4
      - spring.datasource.url=jdbc:h2:mem:hapi_db
    restart: unless-stopped
```

```bash
# 使用上述設定啟動
docker compose -f docker-compose-hapi.yml up -d

# 驗證
curl http://localhost:8090/fhir/metadata | jq '.software.name'
```

**HAPI FHIR 端點：**

| 端點 | URL |
|---|---|
| FHIR R4 API | `http://localhost:8090/fhir/` |
| 管理介面 | `http://localhost:8090/` |

---

### 範例 3：使用 Foundry 生成的 docker-compose.yml

從 Foundry Gallery 下載的 Docker Compose 檔案通常包含完整設定：

```bash
# 假設你已從 Foundry 下載了 docker-compose.yml
ls docker-compose.yml

# 啟動（--pull always 確保使用最新 image）
docker compose up -d --pull always --remove-orphans

# 查看執行中的服務
docker compose ps

# 查看所有服務日誌
docker compose logs -f

# 停止所有服務
docker compose down
```

---

## 8.3.4 啟動後的第一個測試

無論啟動哪個 FHIR Server，第一步都是確認它正常運作：

### 1. 取得伺服器能力聲明

```bash
# 假設伺服器在 port 8080（FHIR Candle）
curl -s http://localhost:8080/fhir/r4/metadata \
  -H "Accept: application/fhir+json" | jq '{
    name: .software.name,
    version: .software.version,
    fhirVersion: .fhirVersion
  }'
```

預期輸出：
```json
{
  "name": "fhir-candle",
  "version": "1.x.x",
  "fhirVersion": "4.0.1"
}
```

### 2. 建立第一個 Patient

```bash
curl -s -X POST http://localhost:8080/fhir/r4/Patient \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [{"family": "測試", "given": ["用戶"]}],
    "gender": "male",
    "birthDate": "1990-01-01"
  }' | jq '{id: .id, name: .name[0].text}'
```

### 3. 查詢剛建立的 Patient

```bash
# 查詢所有 Patient
curl -s "http://localhost:8080/fhir/r4/Patient" \
  -H "Accept: application/fhir+json" | jq '.total'

# 依姓名搜尋
curl -s "http://localhost:8080/fhir/r4/Patient?family=測試" \
  -H "Accept: application/fhir+json" | jq '.entry[0].resource.id'
```

### 4. 驗證 Resource

```bash
curl -s -X POST "http://localhost:8080/fhir/r4/Patient/\$validate" \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [{"family": "王"}]
  }' | jq '.issue[] | {severity: .severity, message: .diagnostics}'
```

---

## 8.3.5 常用 Docker 管理指令

```bash
# 查看所有執行中的容器
docker ps

# 查看特定容器的日誌
docker logs fhir-candle

# 即時追蹤日誌
docker logs -f fhir-candle

# 停止容器
docker stop fhir-candle

# 移除容器（停止後才能移除）
docker rm fhir-candle

# 停止並移除容器
docker rm -f fhir-candle

# 查看 image 列表
docker images | grep fhir

# 移除不再使用的 image
docker rmi ghcr.io/fhir/fhir-candle:latest
```

---

## 8.3.6 整合本站 API 測試面板

啟動本地 FHIR Server 後，可以在本站的 API 測試面板中使用：

1. 打開「API 測試面板」
2. 在伺服器 URL 欄位輸入：
   - FHIR Candle：`http://localhost:8080/fhir/r4`
   - HAPI FHIR：`http://localhost:8090/fhir`
3. 點擊「GET /metadata」確認連線成功
4. 開始測試各種 FHIR 操作

:::warning
本地伺服器的 URL 是 `http://localhost`，在瀏覽器中訪問可能受到 CORS 限制。如果遇到問題，建議使用 curl 或直接在 API 測試面板中操作。
:::
