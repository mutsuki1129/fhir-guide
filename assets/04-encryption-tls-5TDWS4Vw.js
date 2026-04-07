var e=`# TLS 加密與通信安全

## 為什麼需要 TLS？

FHIR 資料包含高度敏感的個人健康資訊（PHI）。在網路上傳輸時，必須加密以防止中間人（MITM）攻擊和資料洩露。

**TLS（傳輸層安全協議）** 是標準的加密通信協議，用於保護客戶端和伺服器之間的所有通信。

## HTTPS 基礎

### HTTP vs HTTPS

| 特性 | HTTP | HTTPS |
|------|------|-------|
| **協議** | HyperText Transfer Protocol | HTTP + TLS/SSL |
| **連接埠** | 80 | 443 |
| **加密** | ❌ 無 | ✅ 完整加密 |
| **驗證** | ❌ 無 | ✅ 伺服器身份驗證 |
| **完整性檢查** | ❌ 否 | ✅ 是 | 
| **安全性** | ❌ 低 | ✅ 高 |

### FHIR 要求

> **所有生產環境的 FHIR 伺服器必須使用 HTTPS。**

不安全的 HTTP 應只用於開發和測試環境。

## TLS 版本要求

### 支援的版本

| 版本 | 發佈年份 | 狀態 | 備註 |
|------|---------|------|------|
| TLS 1.0 | 1999 | ❌ 已棄用 | 不再安全 |
| TLS 1.1 | 2006 | ⚠️ 已棄用 | 已被 PCICC 禁用 |
| TLS 1.2 | 2008 | ✅ 強制 | **FHIR 伺服器最低要求** |
| TLS 1.3 | 2018 | ✅ 推薦 | 更快、更安全 |

**FHIR 安全建議：**
- 最低版本：**TLS 1.2**
- 推薦版本：**TLS 1.3**
- 停用舊版本（1.0、1.1）

### 檢查伺服器 TLS 版本

\`\`\`bash
# Linux/Mac
openssl s_client -connect example.com:443 -tls1_2

# Windows (PowerShell)
[Net.ServicePointManager]::SecurityProtocol
\`\`\`

## TLS 握手過程

\`\`\`
客戶端                                伺服器
   │                                   │
   ├──────── ClientHello ────────────>│
   │  (支援的加密套件、版本)              │
   │                                   │
   │<───── ServerHello & 證書 ────────┤
   │  (選定的加密套件、伺服器證書)       │
   │                                   │
   ├────── 金鑰交換 & Finished ───────>│
   │  (預主密鑰、完整性檢查)             │
   │                                   │
   │<────── Finished ────────────────┤
   │  (完整性檢查)                     │
   │                                   │
   ├═════ 加密通道建立 ════════════════│
   │  (所有後續數據都被加密)             │
\`\`\`

## 數位憑證

### 什麼是數位憑證？

數位憑證是由受信任的憑證授權機構（CA）簽發的檔案，驗證伺服器的身份並包含公開金鑰。

### 自簽憑證 vs CA 簽發憑證

| 特性 | 自簽憑證 | CA 簽發憑證 |
|------|---------|-----------|
| **成本** | 免費 | 有償（通常不貴） |
| **信任** | 否 | 是（瀏覽器和應用信任） |
| **警告** | 瀏覽器警告 | 無警告 |
| **用途** | 開發/測試 | 生產環境 |
| **申請** | 手動建立 | 向 CA 申請 |

### 常見 CA 提供商

- **Let's Encrypt** —免費，自動化，推薦
- **DigiCert** —付費，企業級
- **GlobalSign** —付費，高可信度
- **Comodo** —付費，多年支援

### 在開發環境使用自簽憑證

\`\`\`bash
# 生成自簽憑證（有效期 365 天）
openssl req -x509 -newkey rsa:4096 -keyout key.pem \\
  -out cert.pem -days 365 -nodes \\
  -subj "/CN=localhost"

# 在 Node.js 中使用
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('HTTPS Server');
}).listen(443);
\`\`\`

### 在生產環境使用 Let's Encrypt

\`\`\`bash
# 安裝 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 獲取憑證（自動更新）
sudo certbot certonly --nginx -d example.com

# 設定自動更新
sudo certbot renew --dry-run
\`\`\`

## 加密演算法

### 推薦的加密套件（TLS 1.2）

\`\`\`
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
\`\`\`

### 應避免的加密套件

\`\`\`
❌ TLS_RSA_WITH_AES_256_CBC_SHA       (不使用 Forward Secrecy)
❌ TLS_DHE_RSA_WITH_3DES_EDE_CBC_SHA  (弱加密)
❌ TLS_RSA_WITH_RC4_128_SHA           (已破裂)
\`\`\`

### Nginx 安全配置

\`\`\`nginx
server {
  listen 443 ssl http2;
  server_name example.com;

  # SSL 憑證
  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

  # TLS 版本
  ssl_protocols TLSv1.2 TLSv1.3;

  # 加密套件（優先使用 ECDHE）
  ssl_ciphers 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256';
  ssl_prefer_server_ciphers on;

  # Session 快取
  ssl_session_timeout 1d;
  ssl_session_cache shared:SSL:50m;

  # HSTS（強制使用 HTTPS）
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

  # OCSP Stapling（檢查憑證狀態）
  ssl_stapling on;
  ssl_stapling_verify on;
  ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;

  location / {
    proxy_pass http://localhost:8080;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

# 重定向 HTTP 到 HTTPS
server {
  listen 80;
  server_name example.com;
  return 301 https://$server_name$request_uri;
}
\`\`\`

## JavaScript 中的 HTTPS 使用

### 基礎 HTTPS 請求

\`\`\`javascript
// 使用標準 fetch API（自動使用 HTTPS）
const response = await fetch('https://example.com/fhir/Patient/123', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer access-token',
    'Accept': 'application/fhir+json'
  }
});

const patient = await response.json();
\`\`\`

### 設定 HTTPS 代理（Node.js）

\`\`\`javascript
const https = require('https');
const fs = require('fs');

const agent = new https.Agent({
  cert: fs.readFileSync('client-cert.pem'),
  key: fs.readFileSync('client-key.pem'),
  ca: fs.readFileSync('ca-cert.pem'),
  rejectUnauthorized: true  // 驗證伺服器憑證
});

const response = await fetch('https://example.com/fhir/Patient', {
  agent: agent,
  headers: {
    'Authorization': 'Bearer token'
  }
});
\`\`\`

### 處理自簽憑證（開發只用）

\`\`\`javascript
// ⚠️ 僅用於開發/測試，不要在生產環境使用！
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const response = await fetch('https://localhost:8443/fhir/Patient');
\`\`\`

## HSTS（HTTP 嚴格傳輸安全）

HSTS 強制瀏覽器始終使用 HTTPS 連接到你的網站。

\`\`\`
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
\`\`\`

### HSTS 參數

| 參數 | 說明 | 範例 |
|------|------|------|
| \`max-age\` | 瀏覽器記住該指令的秒數 | \`31536000\`（1 年） |
| \`includeSubDomains\` | 也適用於所有子網域 | \`includeSubDomains\` |
| \`preload\` | 允許加入 HSTS 預加載列表 | \`preload\` |

## 憑證釘選（Certificate Pinning）

在 FHIR 應用中，你可以釘選預期的伺服器憑證，以進一步防止中間人攻擊。

### JavaScript 實現

\`\`\`javascript
class SecureFhirClient {
  constructor(baseUrl, expectedFingerprint) {
    this.baseUrl = baseUrl;
    this.expectedFingerprint = expectedFingerprint;
  }

  async fetch(endpoint, options = {}) {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      ...options,
      headers: {
        'Accept': 'application/fhir+json',
        ...options.headers
      }
    });

    // 驗證伺服器憑證（在 Node.js 中）
    if (typeof window === 'undefined') {
      const cert = response.socket?.getPeerCertificate?.();
      if (cert) {
        const crypto = require('crypto');
        const fingerprint = crypto
          .createHash('sha256')
          .update(cert.raw)
          .digest('hex');
        
        if (fingerprint !== this.expectedFingerprint) {
          throw new Error('Certificate mismatch - possible MITM attack');
        }
      }
    }

    return response;
  }

  async getPatient(patientId) {
    const response = await this.fetch(\`/Patient/\${patientId}\`);
    return await response.json();
  }
}

// 使用
const client = new SecureFhirClient(
  'https://example.com/fhir',
  'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
);
const patient = await client.getPatient('patient-123');
\`\`\`

## 安全檢查清單

- [ ] 所有生產 FHIR 伺服器使用 HTTPS
- [ ] TLS 版本至少 1.2（推薦 1.3）
- [ ] 使用 CA 簽發的有效憑證
- [ ] 定期更新憑證（90 天內）
- [ ] 禁用弱加密套件
- [ ] 啟用 HSTS
- [ ] 在敏感應用中使用憑證釘選
- [ ] 定期進行 SSL/TLS 掃描（使用 ssllabs.com）
- [ ] 監控憑證過期日期
- [ ] 在客戶端驗證伺服器憑證

## 常見問題

**Q: 自簽憑證在生產環境中可以使用嗎？**
A: 不推薦。應使用由受信任 CA 簽發的憑證。自簽憑證會在用戶端引發警告。

**Q: Let's Encrypt 憑證是否足夠安全？**
A: 是的。Let's Encrypt 由許多主要組織支持，其憑證與付費 CA 的安全性相同。

**Q: TLS 1.3 vs TLS 1.2，哪個更好？**
A: TLS 1.3 更快、更安全，但支援較少的舊系統。對於現代 FHIR 實現，推薦使用 TLS 1.3。

**Q: 如何測試我的 FHIR 伺服器是否安全？**
A: 訪問 [SSL Labs](https://www.ssllabs.com/ssltest/) 進行免費線上掃描。
`;export{e as default};