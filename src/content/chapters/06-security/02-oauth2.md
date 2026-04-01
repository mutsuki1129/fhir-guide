# OAuth 2.0 授權碼流程（Authorization Code Flow）

## 概述

**授權碼流程**（Authorization Code Flow）是 SMART on FHIR 中最常用和最安全的授權方式。它適用於有後端伺服器的應用程式（即：能夠安全儲存 Client Secret 的應用）。

## 流程圖

```
┌──────────────────┐         ┌────────────────────────┐
│   患者應用程式    │         │  FHIR 授權伺服器/EHR   │
│  (Client App)    │         │  (Authorization Server)│
└────────┬─────────┘         └────────┬───────────────┘
         │                            │
         │ 1. 重定向至授權端點          │
         │────────────────────────────>│
         │  (client_id, scope, state)  │
         │                            │
         │                  ┌──────────┴──────────┐
         │                  │ 患者登入和同意授權  │
         │                  └──────────┬──────────┘
         │                            │
         │ 2. 重定向回應用程式         │
         │<────────────────────────────│
         │  (authorization_code, state)│
         │                            │
    ┌────┴────────────────┐          │
    │ 驗證 state 和        │          │
    │ 應用後端交換代碼     │          │
    └────┬────────────────┘          │
         │                            │
         │ 3. POST 令牌端點            │
         │ (code, client_id,          │
         │  client_secret)            │
         │────────────────────────────>│
         │                            │
         │ 4. 返回令牌                 │
         │<────────────────────────────│
         │ (access_token,             │
         │  refresh_token)            │
         │                            │
    ┌────┴──────────────────────────┐│
    │ 使用 access_token              ││
    │ 呼叫 FHIR API                  ││
    └────────────────────────────────┘│
         │                            │
         │ 5. FHIR API 請求           │
         │ (Authorization: Bearer)    │
         │────────────────────────────>│
         │                            │
         │ 6. 返回患者資料             │
         │<────────────────────────────│
```

## 詳細步驟

### 步驟 1：重定向至授權端點

應用程式重定向使用者的瀏覽器到 FHIR 伺服器的授權端點：

```
GET https://example.com/oauth/authorize?
    client_id=my-app-id
    &response_type=code
    &scope=launch%2Fpatient%20patient%2FPatient.read
    &redirect_uri=https%3A%2F%2Fmyapp.com%2Fcallback
    &state=random-unique-state-value
    &aud=https://example.com/fhir
    &code_challenge=E9Mz...
    &code_challenge_method=S256
```

**參數說明：**

| 參數 | 說明 | 範例 |
|------|------|------|
| `client_id` | 應用程式的唯一識別符 | `my-app-id` |
| `response_type` | 固定為 `code` | `code` |
| `scope` | 要求的權限 | `launch/patient patient/Patient.read` |
| `redirect_uri` | 授權後重定向位址 | `https://myapp.com/callback` |
| `state` | CSRF 保護令牌 | `random-unique-state-value` |
| `aud` | 受眾（目標 FHIR 伺服器） | `https://example.com/fhir` |
| `code_challenge` | PKCE 驗證碼（見下文） | `E9Mz...` |
| `code_challenge_method` | PKCE 方法，必須是 `S256` | `S256` |

### 步驟 2：使用者認證和授權

使用者在 FHIR 伺服器上：
1. 輸入使用者名稱和密碼進行登入
2. 看到應用程式要求的權限清單
3. 同意或拒絕授權

### 步驟 3：返回授權碼

授權後，FHIR 伺服器重定向回應用程式的回調 URL，並附帶授權碼：

```
GET https://myapp.com/callback?
    code=authorization-code-value
    &state=random-unique-state-value
```

**應用程式驗證步驟：**

```javascript
// 1. 驗證 state 參數（防止 CSRF 攻擊）
const returnedState = new URLSearchParams(window.location.search).get('state');
if (returnedState !== sessionStorage.getItem('authState')) {
  throw new Error('State mismatch - possible CSRF attack');
}

// 2. 獲取授權碼
const authCode = new URLSearchParams(window.location.search).get('code');
```

### 步驟 4：交換令牌

應用程式的**後端**用授權碼交換存取令牌：

```bash
POST https://example.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=authorization-code-value
&client_id=my-app-id
&client_secret=my-app-secret
&redirect_uri=https://myapp.com/callback
&code_verifier=KxjczpzasIlvL2vUTeFm...
```

**參數說明：**

| 參數 | 說明 |
|------|------|
| `grant_type` | 固定為 `authorization_code` |
| `code` | 從步驟 3 獲得的授權碼 |
| `client_id` | 應用程式 ID |
| `client_secret` | 應用程式密鑰（**機密**，僅在後端使用） |
| `redirect_uri` | 必須與步驟 1 中的相同 |
| `code_verifier` | PKCE 驗證器（見下文） |

**成功回應：**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scope": "launch/patient patient/Patient.read patient/Observation.read"
}
```

### 步驟 5：使用令牌呼叫 FHIR API

應用程式現在可以使用 `access_token` 呼叫 FHIR API：

```bash
GET https://example.com/fhir/Patient/patient-id
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**JavaScript 範例：**

```javascript
const accessToken = await exchangeCodeForToken(authCode);

const response = await fetch(
  'https://example.com/fhir/Patient/patient-id',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/fhir+json'
    }
  }
);

const patientData = await response.json();
```

## PKCE（Proof Key for Code Exchange）

PKCE 是一個安全機制，用於防止授權碼被竊取。**在 SMART on FHIR 中強制使用**。

### PKCE 運作原理

1. **生成驗證碼（Code Verifier）**
   - 43-128 字元的隨機字串
   - 組成：英數字、`-`、`.`、`_`、`~`

   ```javascript
   function generateCodeVerifier() {
     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
     let result = '';
     for (let i = 0; i < 128; i++) {
       result += chars.charAt(Math.floor(Math.random() * chars.length));
     }
     return result;
   }
   ```

2. **生成驗證碼挑戰（Code Challenge）**
   - 使用 SHA-256 加雜驗證碼
   - 編碼為 Base64-URL

   ```javascript
   async function generateCodeChallenge(codeVerifier) {
     const encoder = new TextEncoder();
     const data = encoder.encode(codeVerifier);
     const hash = await crypto.subtle.digest('SHA-256', data);
     
     // Base64-URL 編碼
     return btoa(String.fromCharCode(...new Uint8Array(hash)))
       .replace(/\+/g, '-')
       .replace(/\//g, '_')
       .replace(/=/g, '');
   }
   ```

3. **步驟 1 中發送 Challenge**
   - 在授權請求中包含 `code_challenge` 和 `code_challenge_method=S256`

4. **步驟 4 中驗證 Verifier**
   - 在令牌交換時發送原始的 `code_verifier`
   - 伺服器驗證 SHA-256(code_verifier) == code_challenge

## 令牌刷新

當 `access_token` 過期時，使用 `refresh_token` 獲取新令牌：

```bash
POST https://example.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token=refresh-token-value
&client_id=my-app-id
&client_secret=my-app-secret
```

**回應：**

```json
{
  "access_token": "new-access-token-value",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## 常見安全錯誤

### ❌ 不要
- 在 URL 中傳輸 `client_secret`
- 使用不安全的 HTTP（必須 HTTPS）
- 忽略 `state` 參數驗證
- 在前端儲存 `client_secret`
- 使用簡單密碼作為 PKCE 驗證碼

### ✅ 應該
- 在後端安全地儲存 `client_secret`
- 使用強隨機值作為 `state` 和 `code_verifier`
- 驗證授權碼只能使用一次
- 設定適當的令牌過期時間
- 使用 HTTPS 和 TLS 1.2 或更高版本

## 完整 JavaScript 實作範例

```javascript
class SmartAuthFlow {
  constructor(clientId, clientSecret, redirectUri, fhirBase) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.fhirBase = fhirBase;
  }

  async initiate() {
    // 1. 生成 PKCE 驗證碼
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    // 儲存驗證碼和 state
    sessionStorage.setItem('codeVerifier', codeVerifier);
    sessionStorage.setItem('authState', this.generateState());
    
    // 2. 重定向到授權端點
    const authUrl = new URL(`${this.fhirBase}/oauth/authorize`);
    authUrl.searchParams.append('client_id', this.clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'launch/patient patient/Patient.read');
    authUrl.searchParams.append('redirect_uri', this.redirectUri);
    authUrl.searchParams.append('state', sessionStorage.getItem('authState'));
    authUrl.searchParams.append('aud', this.fhirBase);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    
    window.location.href = authUrl.toString();
  }

  async handleCallback() {
    // 3. 驗證 state 並獲取授權碼
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (state !== sessionStorage.getItem('authState')) {
      throw new Error('State mismatch');
    }
    
    // 4. 交換令牌（在後端）
    const codeVerifier = sessionStorage.getItem('codeVerifier');
    const response = await fetch(`${this.fhirBase}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier
      })
    });
    
    const tokenData = await response.json();
    
    // 5. 儲存令牌並清理
    sessionStorage.setItem('accessToken', tokenData.access_token);
    sessionStorage.removeItem('codeVerifier');
    sessionStorage.removeItem('authState');
    
    return tokenData;
  }

  generateCodeVerifier() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    for (let i = 0; i < 128; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  generateState() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async callFhirApi(resourceType, resourceId) {
    const accessToken = sessionStorage.getItem('accessToken');
    const response = await fetch(
      `${this.fhirBase}/${resourceType}/${resourceId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/fhir+json'
        }
      }
    );
    return await response.json();
  }
}

// 使用範例
const auth = new SmartAuthFlow(
  'my-app-id',
  'my-app-secret',
  'https://myapp.com/callback',
  'https://example.com/fhir'
);

// 初始化授權流程
// auth.initiate();

// 或在回調頁面上
// const tokens = await auth.handleCallback();
// const patient = await auth.callFhirApi('Patient', 'patient-123');
```

## 常見問題

**Q: 為什麼需要 PKCE？**
A: PKCE 可以防止授權碼攔截攻擊。即使攻擊者竊取授權碼，他們也無法用它交換令牌，因為他們沒有原始的驗證碼。

**Q: 訪問令牌應該儲存在哪裡？**
A: 最安全的做法是在內存中或 HTTP-Only Cookie 中。避免在 localStorage 中儲存，因為它容易受到 XSS 攻擊。

**Q: 能否在前端進行 PKCE 而不洩露 Client Secret？**
A: 可以，這被稱為「公開客戶端」流程。但 SMART 建議在後端進行，以更安全地儲存 Client Secret。
