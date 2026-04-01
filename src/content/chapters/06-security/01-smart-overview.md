# SMART on FHIR 概覽

## 什麼是 SMART on FHIR？

**SMART on FHIR** 是一個建立在 **OAuth 2.0** 之上的授權和應用程式啟動框架，專為醫療保健應用程式設計。它定義了應用程式如何安全地請求存取 FHIR 資源和患者身份資訊的標準方式。

### SMART 代表什麼？
- **S**ubstantive
- **M**eaningful 
- **A**ssertable
- **R**ole-based
- **T**ransportable

## 為什麼需要 SMART on FHIR？

在醫療系統中，第三方應用程式（如健康監控 App、臨床決策支援系統）需要安全地存取患者資料，同時：

1. **不洩露患者憑證** — 患者不應將密碼分享給第三方應用
2. **受限制的權限範圍** — 應用只能存取它需要的特定資料（如血糖值，而非整個患者病歷）
3. **使用者同意** — 患者明確授權應用程式可以做什麼
4. **可撤銷的授權** — 患者隨時可以取消應用程式的存取權限
5. **稽核追蹤** — 記錄誰在何時存取了什麼資料

## SMART on FHIR vs 一般 OAuth 2.0

| 面向 | 一般 OAuth 2.0 | SMART on FHIR |
|------|---------------|---------------|
| **應用場景** | 通用網際網路應用 | 醫療應用專用 |
| **Discovery** | 手動設定端點 | 自動探索（`.well-known/smart-configuration`） |
| **安全驗證** | 可選 | 強制使用 PKCE（Proof Key for Code Exchange） |
| **Launch Context** | 無 | 提供患者/使用者上下文 |
| **Scope 標準** | 自定義 | 標準化的患者/使用者/系統 Scopes |
| **Back-end 服務** | 不常用 | 支援服務器間認證 |

## SMART 應用類型

### 1. 患者應用（Patient-facing Apps）
- 使用者：患者本人
- 權限：`patient/` 開頭的 scopes
- 例：患者健康監控 App，患者可查看自己的實驗室結果

### 2. 臨床應用（Provider Apps）
- 使用者：醫療提供者（醫生、護士）
- 權限：`user/` 開頭的 scopes
- 例：臨床決策支援系統，醫生可查看病患資訊

### 3. 系統應用（System Apps）
- 使用者：應用系統本身
- 權限：`system/` 開頭的 scopes，無使用者參與
- 例：後台資料整合系統，EHR 之間的自動資料同步

## SMART 授權流程簡述

```
┌─────────────────┐
│   患者開啟應用   │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ 應用重定向到 EHR 授權 │
│   伺服器進行授權     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ 患者在 EHR 登入和    │
│ 同意授權應用程式     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ EHR 伺服器發放授權   │
│ 代碼和存取令牌       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ 應用使用存取令牌     │
│ 從 FHIR API 取得資料 │
└──────────────────────┘
```

## SMART Discovery — `.well-known/smart-configuration`

每個符合 SMART 標準的 FHIR 伺服器都必須在根 URL 發布其配置：

```bash
GET https://example.com/fhir/.well-known/smart-configuration
```

**回應範例：**

```json
{
  "authorization_endpoint": "https://example.com/oauth/authorize",
  "token_endpoint": "https://example.com/oauth/token",
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
  "revocation_endpoint": "https://example.com/oauth/revoke",
  "revocation_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
  "scopes_supported": [
    "launch",
    "launch/patient",
    "patient/Patient.read",
    "patient/Observation.read",
    "user/Patient.read",
    "user/Observation.read"
  ],
  "response_types_supported": ["code", "id_token"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "code_challenge_methods_supported": ["S256", "plain"]
}
```

## 關鍵概念

### Launch Token
啟動令牌（`launch` scope）包含關於被啟動的患者或使用者上下文的資訊。
- 模式：`launch` 或 `launch/patient` 或 `launch/user`
- 包含：通常由 EHR 提供患者 ID 或使用者 ID

### Access Token
存取令牌是應用程式用來呼叫 FHIR API 的憑證。
- 有效期：通常 15 分鐘 - 1 小時
- 包含：授予的權限（scopes）、使用者身份、患者上下文

### Refresh Token（如果允許）
刷新令牌允許應用程式在不要求使用者重新授權的情況下獲得新的存取令牌。

## SMART 應用註冊

應用程式需要在 FHIR 伺服器上註冊，以獲得：

1. **Client ID** — 應用程式的唯一識別符
2. **Client Secret** — 應用程式的密鑰（機密應用程式）
3. **Redirect URI** — 授權後重定向的位址

```json
{
  "software_name": "My Health App",
  "software_version": "1.0.0",
  "client_id": "my-app-client-id",
  "client_secret": "my-app-client-secret",
  "redirect_uris": ["https://myapp.com/callback"],
  "token_endpoint_auth_method": "client_secret_basic",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "scope": "launch/patient patient/Patient.read patient/Observation.read"
}
```

## 實作檢查清單

- [ ] 應用程式已在 FHIR 伺服器註冊
- [ ] 已獲得 Client ID 和 Client Secret
- [ ] 已設定 Redirect URI
- [ ] 實作 Discovery 端點查詢
- [ ] 實作授權碼流程（Authorization Code Flow）
- [ ] 實作 PKCE 驗證
- [ ] 實作令牌刷新邏輯
- [ ] 實作適當的錯誤處理

## 後續章節預告

下一章節將深入介紹 **OAuth 2.0 授權碼流程**（Authorization Code Flow），以及如何在實際應用中實現這個流程。
