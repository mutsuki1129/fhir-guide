# 第 6 章：FHIR 安全性與認證

此章節涵蓋 FHIR 系統中的全面安全性實施，包括認證、授權、加密、資料保護和監控。

## 章節導覽

### 📚 教學模組

1. **[01-smart-overview.md](01-smart-overview.md) — SMART on FHIR 概覽**
   - 什麼是 SMART on FHIR？
   - 為什麼需要 SMART？
   - 三種應用類型（患者、臨床、系統）
   - Discovery 端點
   - 基本授權流程圖

2. **[02-oauth2.md](02-oauth2.md) — OAuth 2.0 授權碼流程**
   - 授權碼流程詳細步驟
   - PKCE（Proof Key for Code Exchange）安全驗證
   - 令牌交換和刷新
   - 完整 JavaScript 實作範例

3. **[03-scopes.md](03-scopes.md) — Scopes 與權限控制**
   - Scope 語法和組成部分
   - 三種 Scope 類型（Patient、User、System）
   - 權限代碼（.cruds）說明
   - 常見應用場景和 Scope 組合
   - JavaScript 權限檢查實現

### 🔐 進階安全主題

4. **[04-encryption-tls.md](04-encryption-tls.md) — TLS 加密與通信安全**
   - HTTPS 基礎和 TLS 版本要求
   - TLS 握手過程
   - 數位憑證和 CA 簽發
   - 加密套件選擇
   - Nginx 安全配置
   - 證書釘選實現

5. **[05-security-labels.md](05-security-labels.md) — 安全標籤與訪問控制**
   - 安全標籤概述和結構
   - 標準安全標籤系統（Confidentiality、ActCode）
   - 訪問控制決策（ACL）
   - 敏感資料遮蔽實現
   - FHIR 伺服器安全標籤支援

6. **[06-audit-logging.md](06-audit-logging.md) — 稽核日誌與監控**
   - FHIR AuditEvent 資源詳解
   - 稽核事件工廠類實現
   - Express.js 自動稽核中介軟體
   - ELK Stack 日誌聚合
   - GDPR 訪問報告生成
   - 日誌保留政策

7. **[07-best-practices.md](07-best-practices.md) — 安全最佳實踐與檢查清單**
   - 分層防禦策略
   - 密碼政策和多因子認證
   - 敏感資料遮蔽和安全刪除
   - 防止中間人攻擊
   - 輸入驗證和清理
   - 完整安全檢查清單

## 學習路徑

### 初學者路徑
```
01-smart-overview.md
    ↓
02-oauth2.md
    ↓
03-scopes.md
    ↓
04-encryption-tls.md
```

### 進階路徑
```
05-security-labels.md
    ↓
06-audit-logging.md
    ↓
07-best-practices.md
```

### 實作路徑（邊做邊學）
1. 先讀 01-smart-overview.md（理論）
2. 實作 02-oauth2.md 中的授權流程
3. 設定 03-scopes.md 中的權限檢查
4. 設定 04-encryption-tls.md 中的 HTTPS
5. 新增 05-security-labels.md 的安全標籤
6. 實施 06-audit-logging.md 的稽核
7. 參考 07-best-practices.md 進行安全審計

## 關鍵概念速查表

### SMART on FHIR 流程
```
應用啟動
  ↓
重定向到授權伺服器（Discovery）
  ↓
患者登入和授權
  ↓
返回授權碼
  ↓
後端交換令牌
  ↓
使用令牌調用 FHIR API
  ↓
資料存取
```

### Scope 語法
```
<context>/<resource>.<permissions>

例：patient/Observation.read
   ├─ patient    = 患者作用範圍
   ├─ Observation = 資源型別
   └─ read       = 讀取權限
```

### 安全標籤組合
```
敏感精神衛生信息 = [Confidentiality: H + ActCode: PSYCH]
禁毒治療 = [Confidentiality: R + ActCode: SUD]
HIV 相關 = [Confidentiality: R + ActCode: HIV]
```

## 技術棧推薦

### 後端認證
- **OAuth 2.0 伺服器**：Keycloak、Auth0、Okta
- **JWT 處理**：jsonwebtoken (Node.js)
- **多因子認證**：totp-generator、Authy

### 加密和安全
- **TLS 管理**：Let's Encrypt、certbot
- **加密**：OpenSSL、crypto (Node.js)
- **安全標籤**：HL7 FHIR 編碼系統

### 稽核和監控
- **日誌聚合**：ELK Stack、Splunk、Datadog
- **異常檢測**：Elastic 機器學習、自定義規則
- **警報**：Prometheus + Alertmanager、Grafana

## 代碼範例摘要

### OAuth 2.0 授權流程（JavaScript）
```javascript
// 見 02-oauth2.md - SmartAuthFlow 類
const auth = new SmartAuthFlow(clientId, clientSecret, redirectUri, fhirBase);
auth.initiate(); // 重定向到授權伺服器
const tokens = await auth.handleCallback(); // 處理回調
const patient = await auth.callFhirApi('Patient', 'patient-123');
```

### Scope 權限檢查（JavaScript）
```javascript
// 見 03-scopes.md - SmartAuthManager 類
const authManager = new SmartAuthManager(fhirBase);
authManager.setTokenInfo(accessToken, grantedScopes);

if (authManager.canReadResource('Patient')) {
  const patient = await authManager.fetchResource('Patient', 'patient-123');
}
```

### 稽核日誌記錄（JavaScript）
```javascript
// 見 06-audit-logging.md - AuditEventLogger 類
const auditLogger = new AuditEventLogger(fhirClient, sourceSystemId);
await auditLogger.logRead(userId, userType, patientId, resourceType, succeeded);
```

## 互動練習

每個章節都包含：

1. **理論解釋** — 安全概念的完整說明
2. **代碼範例** — 實際可運行的 JavaScript/Node.js 代碼
3. **配置示例** — Nginx、Docker、環境變數設定
4. **最佳實踐** — 推薦做法和要避免的陷阱
5. **常見問題** — FAQ 解答

## 測試你的理解

### 知識檢查

- [ ] 能解釋 SMART on FHIR 如何改進醫療應用安全？
- [ ] 能描述 OAuth 2.0 授權碼流程的每個步驟？
- [ ] 能列舉 Patient、User、System Scopes 的差異？
- [ ] 能設定 TLS 1.2 或更高版本的伺服器？
- [ ] 能設計適當的安全標籤策略？
- [ ] 能實施 AuditEvent 日誌記錄？
- [ ] 能執行安全檢查清單？

### 動手實驗

1. **實驗 1**：使用 HAPI FHIR 測試伺服器實施 OAuth 2.0 流程
2. **實驗 2**：設定 Let's Encrypt 證書和 HSTS
3. **實驗 3**：在資源上新增安全標籤並測試訪問控制
4. **實驗 4**：設定稽核日誌記錄和基本監控
5. **實驗 5**：進行安全檢查清單審計

## 相關資源

### 官方文檔
- [FHIR 安全規格](https://hl7.org/fhir/security.html)
- [SMART on FHIR](https://docs.smarthealthit.org/)
- [HL7 FHIR 操作](https://build.fhir.org/ig/HL7/smart-app-launch/)

### 標準和規範
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)
- [TLS 1.2 RFC 5246](https://tools.ietf.org/html/rfc5246)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### 部署工具
- [Keycloak](https://www.keycloak.org/) — 開源身份識別和訪問管理
- [HAPI FHIR](https://hapifhir.io/) — Java 開源 FHIR 伺服器
- [ELK Stack](https://www.elastic.co/what-is/elk-stack) — 日誌聚合和分析

## 下一步

完成此安全章節後，你可以：

1. 在實際項目中實施 SMART on FHIR 認證
2. 設計和實施安全的 FHIR API
3. 建立稽核和監控系統
4. 進行安全審計和滲透測試
5. 遵守 HIPAA、GDPR 等法規要求

## 常見問題

**Q: 所有 FHIR 實現都需要 SMART on FHIR 嗎？**
A: 不一定，但高度推薦用於面向患者或多應用程式的系統。內部系統可能使用更簡單的認證。

**Q: OAuth 2.0 對健康資訊來說足夠安全嗎？**
A: 是的，特別是與 TLS、PKCE 和適當的安全標籤結合時。

**Q: 如何平衡安全性和易用性？**
A: 使用分層防禦和適當的安全標籤，只在需要時強制執行最高安全級別。

**Q: 小型醫療機構應從哪裡開始？**
A: 從 HTTPS 和基本 OAuth 2.0 開始，逐漸新增稽核、標籤和進階安全功能。

---

**版本** — 2026-04-01  
**FHIR 版本** — R4  
**最後更新** — 2026-04-01
