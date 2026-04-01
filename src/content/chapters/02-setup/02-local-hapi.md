# 本地 HAPI FHIR Server（Docker Compose 一鍵部署）

**HAPI FHIR** 是目前最完整的開源 FHIR R4 Server 實作，由 University Health Network（UHN）開發維護。使用 Docker Compose 只需一個指令就能在本地啟動完整的 FHIR 伺服器。

---

## 為什麼需要本地伺服器？

| 情境 | 公開測試伺服器 | 本地伺服器 |
|------|----------------|------------|
| 測試資料隔離 | ❌ 所有人共用 | ✅ 完全隔離 |
| 離線開發 | ❌ 需要網路 | ✅ 完全離線 |
| 資料持久性 | ❌ 定期清除 | ✅ 可持久化 |
| 效能 | 有網路延遲 | 毫秒級回應 |
| 客製化設定 | ❌ 無法修改 | ✅ 完全控制 |
| 費用 | 免費 | 免費 |

---

## Docker Compose 設定

建立一個工作目錄，新增 `docker-compose.yml`：

```yaml
services:
  hapi-fhir:
    image: hapiproject/hapi:latest
    container_name: hapi-fhir-r4
    ports:
      - "8080:8080"
    environment:
      # 預設資料格式
      - hapi.fhir.default_encoding=json
      # FHIR 版本
      - hapi.fhir.fhir_version=R4
      # CORS 設定（允許本地前端存取）
      - hapi.fhir.cors.allow_Credentials=true
      - hapi.fhir.cors.allowed_origin=*
      # 搜尋功能最佳化
      - hapi.fhir.enable_index_missing_fields=true
      # 啟用 $everything operation
      - hapi.fhir.expunge_enabled=true
      # 資料庫設定（預設 H2，生產環境用 PostgreSQL）
      # - spring.datasource.url=jdbc:postgresql://db:5432/hapi
      # - spring.datasource.username=hapi
      # - spring.datasource.password=hapi
    volumes:
      - hapi-data:/data/hapi
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/fhir/metadata"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

volumes:
  hapi-data:
    driver: local
```

---

## 啟動與停止

```bash
# 啟動（背景執行）
docker compose up -d

# 查看啟動日誌（等待出現 "Started Application"）
docker compose logs -f hapi-fhir

# 檢查伺服器狀態
curl http://localhost:8080/fhir/metadata | jq '.software.name'

# 停止
docker compose down

# 停止並清除資料（完全重置）
docker compose down -v
```

:::tip 首次啟動
HAPI FHIR 首次啟動需要 60-90 秒進行資料庫初始化。看到以下訊息代表準備好了：

```
INFO  o.s.b.w.embedded.tomcat.TomcatEmbeddedWebServer - Tomcat started on port(s): 8080
INFO  ca.uhn.fhir.jpa.starter.Application - Started Application in 65.234 seconds
```
:::

---

## 驗證安裝

伺服器啟動後，在瀏覽器開啟以下 URL：

**1. HAPI FHIR Web UI**
```
http://localhost:8080
```
這是 HAPI FHIR 的網頁介面，可以用來瀏覽和測試 API。

**2. CapabilityStatement（能力聲明）**
```
http://localhost:8080/fhir/metadata
```
這個 JSON 文件列出伺服器支援的所有 Resource 類型和操作。

**3. 建立測試病患**
```bash
curl -X POST http://localhost:8080/fhir/Patient \
  -H "Content-Type: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [{"family": "測試", "given": ["病患"]}],
    "gender": "male",
    "birthDate": "1990-01-01"
  }'
```
成功回傳 `201 Created` 且有 `Location` header 代表一切正常。

---

## 搭配 PostgreSQL（生產環境）

預設的 H2 是嵌入式資料庫，不適合生產環境。生產環境建議使用 PostgreSQL：

```yaml
services:
  hapi-fhir:
    image: hapiproject/hapi:latest
    ports:
      - "8080:8080"
    environment:
      - spring.datasource.url=jdbc:postgresql://db:5432/hapi
      - spring.datasource.username=hapi
      - spring.datasource.password=hapi_secret
      - spring.datasource.driverClassName=org.postgresql.Driver
      - spring.jpa.properties.hibernate.dialect=ca.uhn.fhir.jpa.model.dialect.HapiFhirPostgres94Dialect
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=hapi
      - POSTGRES_USER=hapi
      - POSTGRES_PASSWORD=hapi_secret
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hapi"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

---

## 預載測試資料（Synthea）

**Synthea** 是一個能生成逼真合成病患資料的工具，非常適合開發測試：

```bash
# 使用 Docker 運行 Synthea（生成 10 個病患）
docker run --rm \
  -v $(pwd)/output:/output \
  docker.io/synthetichealth/synthea:latest \
  -p 10 -m "*" \
  --exporter.fhir.export true \
  --exporter.baseDirectory /output

# 將生成的 FHIR Bundle 匯入 HAPI FHIR
for f in output/fhir/*.json; do
  curl -X POST http://localhost:8080/fhir \
    -H "Content-Type: application/fhir+json" \
    -d @"$f"
done
```

執行後你的本地伺服器就有完整的測試病患資料可用了！

:::warning 注意
Synthea 生成的是英文姓名的美國病患資料。在實際台灣專案中，你需要自行準備台灣格式的測試資料，或調整 Synthea 的設定。
:::

---

## 常見問題

**Q: 啟動後 `curl /metadata` 回傳 Connection Refused**

等待 60 秒後再試，HAPI 初始化需要時間。用 `docker compose logs -f` 監看日誌。

**Q: 記憶體不足（Out of Memory）**

HAPI FHIR 預設需要 1.5GB RAM。在 Docker Desktop 設定中增加記憶體限制（建議 4GB+）。

**Q: 資料在 `docker compose down` 後消失**

確認 `docker-compose.yml` 中有 `volumes` 設定，且沒有使用 `-v` 參數（`-v` 會刪除 volume）。
