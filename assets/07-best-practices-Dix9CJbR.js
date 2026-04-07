var e=`# FHIR 安全最佳實踐與檢查清單

## 分層防禦（Defense in Depth）

不要依賴單一安全機制。實施多層防禦：

\`\`\`
層級 1: 邊界防護（網路層）
        └─ 防火牆、VPN、WAF
層級 2: 身份驗證和授權（應用層）
        └─ OAuth 2.0、SMART on FHIR、多因子認證
層級 3: 資料加密（傳輸層）
        └─ TLS 1.2+、HTTPS
層級 4: 資料加密（儲存層）
        └─ 磁碟加密、資料庫加密
層級 5: 訪問控制（邏輯層）
        └─ 安全標籤、RBAC、屬性型存取控制
層級 6: 稽核和監控（檢測層）
        └─ AuditEvent、日誌分析、異常檢測
層級 7: 事件應對（回應層）
        └─ 事件響應計畫、自動警報
\`\`\`

## 認證安全

### 密碼政策

\`\`\`javascript
class PasswordValidator {
  static isValid(password) {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecial
    );
  }

  static complexity(password) {
    let score = 0;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    return score; // 0-6 分
  }
}

// 密碼政策建議
const passwordPolicy = {
  minimumLength: 12,
  requireUpperCase: true,
  requireLowerCase: true,
  requireNumbers: true,
  requireSpecialCharacters: true,
  expirationDays: 90,
  historySize: 5,  // 不能重用最近 5 個密碼
  lockoutAttempts: 5,
  lockoutDurationMinutes: 30
};
\`\`\`

### 多因子認證（MFA）

\`\`\`javascript
class MFAManager {
  /**
   * 生成 TOTP 密鑰（時間型一次性密碼）
   */
  generateTOTPSecret(userId) {
    const secret = crypto.randomBytes(20).toString('base32');
    const qrCode = \`otpauth://totp/FHIR:\${userId}?secret=\${secret}&issuer=FHIRApp\`;
    
    return {
      secret,
      qrCode,
      backupCodes: this.generateBackupCodes(10)
    };
  }

  /**
   * 驗證 TOTP 代碼
   */
  verifyTOTP(secret, code) {
    const totp = require('totp-generator');
    return totp.verify({ secret, encoding: 'base32', token: code });
  }

  /**
   * 備用代碼（以防丟失 MFA 設備）
   */
  generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  /**
   * 實施速率限制防止暴力破解
   */
  checkRateLimit(userId, service = 'login') {
    // 使用 Redis 或記憶體計數器
    // 5 次失敗嘗試後鎖定 30 分鐘
  }
}

// MFA 設置流程
const mfa = new MFAManager();
const { secret, qrCode, backupCodes } = mfa.generateTOTPSecret('user@example.com');
// 顯示 QR 碼給使用者，讓他們掃描到身份驗證器應用
// 儲存備用代碼在安全位置
\`\`\`

### 令牌安全

\`\`\`javascript
class TokenManager {
  /**
   * 生成安全令牌
   */
  generateToken(claims, expiryMinutes = 60) {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET;
    
    const token = jwt.sign(
      {
        ...claims,
        iat: Math.floor(Date.now() / 1000),
        jti: crypto.randomUUID() // JWT ID，防止重放攻擊
      },
      secret,
      { expiresIn: \`\${expiryMinutes}m\`, algorithm: 'HS256' }
    );

    return token;
  }

  /**
   * 令牌黑名單（登出時撤銷）
   */
  revokeToken(jti) {
    // 存儲到 Redis，TTL 等於令牌過期時間
    redis.setex(\`token:\${jti}\`, 3600, 'revoked');
  }

  /**
   * 檢查令牌是否被撤銷
   */
  isTokenRevoked(jti) {
    return redis.exists(\`token:\${jti}\`) > 0;
  }

  /**
   * 驗證令牌
   */
  verifyToken(token) {
    const jwt = require('jsonwebtoken');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 檢查黑名單
      if (this.isTokenRevoked(decoded.jti)) {
        throw new Error('Token has been revoked');
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }
}
\`\`\`

## 授權安全

### 最小權限原則

\`\`\`javascript
class PermissionChecker {
  /**
   * 驗證使用者有確切的權限，不超過
   */
  async checkPermission(userId, resource, action) {
    const user = await this.getUser(userId);
    const grantedScopes = user.scopes;

    // 構建所需的 scope
    const requiredScope = \`\${resource.context}/\${resource.type}.\${action}\`;

    // 直接比對，不允許假定更高權限
    return grantedScopes.includes(requiredScope);
  }

  /**
   * 防止權限提升（Privilege Escalation）
   */
  async assignRoles(userId, newRoles) {
    const currentUser = await this.getCurrentUser();
    
    // 確保只有管理員可以分配角色
    if (currentUser.role !== 'Admin') {
      throw new Error('Insufficient privileges');
    }

    // 確保不能分配高於自己的角色
    const roleHierarchy = { 'User': 1, 'Clinician': 2, 'Admin': 3 };
    const currentLevel = roleHierarchy[currentUser.role];
    
    for (const newRole of newRoles) {
      if (roleHierarchy[newRole] > currentLevel) {
        throw new Error(\`Cannot assign role higher than \${currentUser.role}\`);
      }
    }

    await this.persistRoles(userId, newRoles);
  }
}
\`\`\`

## 資料安全

### 敏感資料遮蔽

\`\`\`javascript
class DataMasker {
  /**
   * 遮蔽 PII（個人識別信息）
   */
  maskPatient(patient, maskLevel = 'high') {
    const masked = JSON.parse(JSON.stringify(patient));

    if (maskLevel === 'high') {
      masked.name = [{
        family: 'X'.repeat(patient.name[0].family.length),
        given: [patient.name[0].given[0].charAt(0) + '***']
      }];
      masked.birthDate = patient.birthDate.substring(0, 4) + '-XX-XX';
      masked.address = masked.address?.map(a => ({
        ...a,
        city: 'XXXXX',
        state: 'XX',
        postalCode: 'XXXXX'
      }));
      masked.telecom = masked.telecom?.map(t => ({
        system: t.system,
        value: 'XXX-XXX-' + t.value.slice(-4)
      }));
    }

    return masked;
  }

  /**
   * 記錄敏感資料訪問
   */
  logSensitiveAccess(userId, resource, action) {
    const auditLog = {
      timestamp: new Date().toISOString(),
      userId,
      resourceType: resource.resourceType,
      resourceId: resource.id,
      action,
      ipAddress: getClientIP(),
      userAgent: getUserAgent()
    };

    // 儲存到安全的稽核日誌系統
    this.storeAuditLog(auditLog);
  }
}
\`\`\`

### 安全刪除

\`\`\`javascript
class SecureDataDeletion {
  /**
   * 安全刪除敏感資料
   * Shred 多次覆寫以防止恢復
   */
  async secureDelete(data) {
    // 美國 DoD 5220.22-M 標準（3 次通過）
    const passes = 3;
    const buffer = Buffer.from(JSON.stringify(data));

    for (let pass = 0; pass < passes; pass++) {
      // 用隨機數據覆寫
      crypto.randomFillSync(buffer);
      // 用零覆寫
      buffer.fill(0);
    }

    // 最後一次用 0xFF 覆寫
    buffer.fill(0xFF);

    // 資料庫刪除
    await this.deleteFromDatabase(data.id);
  }

  /**
   * 患者資料刪除（GDPR 被遺忘權）
   */
  async deletePatientData(patientId) {
    // 1. 收集所有相關資源
    const resources = await this.findAllPatientResources(patientId);

    // 2. 安全刪除
    for (const resource of resources) {
      await this.secureDelete(resource);
    }

    // 3. 驗證刪除
    const remaining = await this.findAllPatientResources(patientId);
    if (remaining.length > 0) {
      throw new Error('Some data was not deleted');
    }

    // 4. 記錄刪除
    await this.logDeletion(patientId);
  }
}
\`\`\`

## 通信安全

### 防止中間人攻擊（MITM）

\`\`\`javascript
class CommunicationSecurity {
  /**
   * 證書釘選
   */
  setupCertificatePinning(domain, expectedHashes) {
    // 在 Node.js 中驗證伺服器證書
    const https = require('https');
    const agent = new https.Agent({
      rejectUnauthorized: true,
      checkServerIdentity: (servername, cert) => {
        const certHash = crypto
          .createHash('sha256')
          .update(cert.raw)
          .digest('hex');

        if (!expectedHashes.includes(certHash)) {
          throw new Error('Certificate pinning failed');
        }
      }
    });

    return agent;
  }

  /**
   * 防止 DNS 欺騙
   */
  verifyDNS(domain, expectedIp) {
    const dns = require('dns').promises;
    const ip = await dns.resolve4(domain);

    if (!ip.includes(expectedIp)) {
      throw new Error('DNS spoofing detected');
    }
  }

  /**
   * 防止 HTTP 降級攻擊（HSTS）
   */
  setupHSTS(maxAge = 31536000) {
    return (req, res, next) => {
      res.setHeader(
        'Strict-Transport-Security',
        \`max-age=\${maxAge}; includeSubDomains; preload\`
      );
      next();
    };
  }

  /**
   * Content Security Policy（防止 XSS）
   */
  setupCSP() {
    return (req, res, next) => {
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
      );
      next();
    };
  }
}
\`\`\`

## 應用安全

### 輸入驗證和清理

\`\`\`javascript
class InputValidator {
  /**
   * 驗證 FHIR 資源
   */
  validateFHIRResource(resource, schema) {
    const ajv = require('ajv');
    const validator = new ajv();
    const validate = validator.compile(schema);

    if (!validate(resource)) {
      throw new Error(\`Invalid resource: \${JSON.stringify(validate.errors)}\`);
    }

    return true;
  }

  /**
   * 防止 SQL 注入
   */
  sanitizeQueryParameter(param) {
    // 使用參數化查詢，不要字符串連接
    // ❌ 不要：\`SELECT * FROM patients WHERE id = '\${id}'\`
    // ✅ 應該：\`SELECT * FROM patients WHERE id = ?\`, [id]
    return param.replace(/['";]/g, '');
  }

  /**
   * 防止 XSS
   */
  sanitizeHtml(html) {
    const sanitizeHtml = require('sanitize-html');
    return sanitizeHtml(html, {
      allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
      allowedAttributes: {}
    });
  }
}
\`\`\`

## 部署安全

### 環境變數管理

\`\`\`javascript
// ❌ 不要
const dbPassword = "password123";
const apiKey = "sk_live_abc123";

// ✅ 應該
require('dotenv').config();
const dbPassword = process.env.DB_PASSWORD;
const apiKey = process.env.API_KEY;

// .env 檔案（永遠不要提交到版本控制）
# .env
DB_PASSWORD=secure_password_123
API_KEY=sk_live_actual_key
JWT_SECRET=long_random_secret_key

// .gitignore
.env
.env.local
*.key
*.pem
\`\`\`

### 依賴項安全

\`\`\`bash
# 檢查易受攻擊的依賴項
npm audit

# 修復已知漏洞
npm audit fix

# 定期更新依賴項
npm update

# 安全的 package-lock.json（提交到版本控制）
git add package-lock.json
\`\`\`

### Docker 安全

\`\`\`dockerfile
# ❌ 不要
FROM node:latest
RUN npm install
EXPOSE 8080
CMD ["node", "app.js"]

# ✅ 應該
FROM node:20-alpine
RUN npm ci --only=production
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD node healthcheck.js
CMD ["node", "app.js"]
\`\`\`

## 安全測試

### 滲透測試清單

\`\`\`bash
# 端點掃描
nmap -sV -p- localhost

# SSL/TLS 測試
openssl s_client -connect localhost:443 -tls1_2

# Web 應用掃描
zaproxy -cmd -quickurl http://localhost:8080

# 依賴項漏洞掃描
npm audit
snyk test

# 靜態代碼分析
eslint .
sonar-scanner

# 動態應用安全測試
burp_suite  # 或其他 DAST 工具
\`\`\`

## 完整安全檢查清單

### 認證與授權
- [ ] 使用 SMART on FHIR 和 OAuth 2.0
- [ ] 實施 PKCE 驗證
- [ ] 強制使用 TLS 1.2 或更高版本
- [ ] 實施多因子認證（MFA）
- [ ] 定期輪換密鑰和密鑰
- [ ] 禁止存儲純文本密碼
- [ ] 實施會話超時
- [ ] 支持令牌撤銷和黑名單

### 資料保護
- [ ] 加密傳輸中的資料（TLS）
- [ ] 加密儲存的資料（AES-256）
- [ ] 使用安全標籤標記敏感資料
- [ ] 實施存取控制（RBAC/ABAC）
- [ ] 使用資料遮蔽隱藏 PII
- [ ] 定期備份和測試恢復
- [ ] 安全刪除敏感資料
- [ ] 加密備份

### 稽核與監控
- [ ] 記錄所有患者資料訪問（AuditEvent）
- [ ] 監控異常訪問模式
- [ ] 設定警報以進行敏感操作
- [ ] 定期審查稽核日誌
- [ ] 保留足夠的日誌歷史記錄
- [ ] 保護稽核日誌本身
- [ ] 自動化合規性報告

### 應用安全
- [ ] 驗證和清理所有輸入
- [ ] 使用參數化查詢防止 SQL 注入
- [ ] 防止 XSS、CSRF、點擊劫持攻擊
- [ ] 使用安全的依賴項（定期更新）
- [ ] 實施速率限制和 DDoS 保護
- [ ] 使用 Content Security Policy
- [ ] 實施 CORS 正確性
- [ ] 隱藏敏感的錯誤消息

### 基礎設施
- [ ] 使用有效的 CA 簽發的證書
- [ ] 定期更新作業系統和軟件
- [ ] 禁用不必要的服務
- [ ] 配置防火牆規則
- [ ] 使用 WAF（Web 應用防火牆）
- [ ] 實施網路分段
- [ ] 定期進行滲透測試
- [ ] 準備事件響應計畫

### 文檔與培訓
- [ ] 記錄安全架構
- [ ] 建立安全政策和程序
- [ ] 進行員工安全培訓
- [ ] 定期進行安全更新
- [ ] 維護變更日誌
- [ ] 建立事件響應流程

## 常見安全漏洞

| 漏洞 | 風險 | 防禦 |
|------|------|------|
| 默認憑證 | 未授權訪問 | 強制更改預設密碼 |
| 硬編碼密鑰 | 密鑰洩露 | 使用環境變數 |
| 缺少 HTTPS | 中間人攻擊 | 強制使用 TLS 1.2+ |
| 弱密碼 | 暴力破解 | 強制複雜密碼、MFA |
| SQL 注入 | 資料庫洩露 | 參數化查詢 |
| XSS | 帳戶劫持 | 輸入驗證、輸出編碼 |
| CSRF | 未授權操作 | CSRF 令牌、SameSite Cookie |
| 未驗證跳轉 | 網路釣魚 | 驗證重定向目標 |

## 資源和工具

- **OWASP Top 10** — Web 應用最常見安全漏洞
- **HL7 FHIR Security** — 官方安全指南
- **SMART on FHIR** — OAuth 2.0 醫療專用規格
- **NIST Cybersecurity Framework** — 安全管理框架
- **SSL Labs** — SSL/TLS 掃描和評級
- **OWASP ZAP** — 自動安全掃描工具
- **npm audit** — 檢查 JavaScript 依賴項漏洞
- **Snyk** — 持續依賴項安全監控

## 持續改進

安全不是一次性工作，而是持續過程：

1. **定期評估** — 每季度進行安全審計
2. **關注更新** — 訂閱安全公告和補丁
3. **學習新威脅** — 參與安全培訓和會議
4. **測試防禦** — 定期進行滲透測試
5. **文檔記錄** — 維護安全實踐記錄
6. **事件分析** — 從安全事件中學習
`;export{e as default};