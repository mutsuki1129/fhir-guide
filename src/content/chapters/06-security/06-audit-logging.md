# 稽核日誌與監控

## 為什麼需要稽核日誌？

在醫療環境中，稽核日誌是合規性和安全性的關鍵要求。它們記錄：

1. **誰**訪問了患者資料（使用者身份）
2. **何時**進行訪問（時間戳）
3. **做了什麼**（操作類型）
4. **訪問了什麼**（哪些資源）
5. **結果如何**（成功或失敗）
6. **為什麼**訪問（目的、理由）

### 合規性要求

- **HIPAA** —必須記錄所有訪問患者資料的操作
- **GDPR** —必須記錄所有個人資料的訪問
- **醫療法規** —許多國家要求對醫療記錄的訪問進行審計

## FHIR AuditEvent 資源

FHIR 定義了 `AuditEvent` 資源來標準化稽核日誌記錄。

### AuditEvent 結構

```json
{
  "resourceType": "AuditEvent",
  "id": "audit-event-123",
  "type": {
    "system": "http://terminology.hl7.org/CodeSystem/audit-event-type",
    "code": "rest",
    "display": "Restful Operation"
  },
  "subtype": [
    {
      "system": "http://hl7.org/fhir/restful-interaction",
      "code": "read",
      "display": "read"
    }
  ],
  "action": "R",
  "recorded": "2026-04-01T14:30:00Z",
  "outcome": "0",
  "outcomeDesc": "Success",
  "agent": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/audit-event-agent-type",
            "code": "human",
            "display": "human user"
          }
        ]
      },
      "who": {
        "identifier": {
          "system": "http://example.com/users",
          "value": "dr-smith"
        }
      },
      "altId": "2309",
      "name": "Dr. Smith",
      "requestor": true
    }
  ],
  "source": {
    "site": "Hospital Portal",
    "identifier": {
      "system": "urn:oid:1.2.3.4.5.6.7.8.9.0",
      "value": "portal-server"
    },
    "type": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/audit-event-source-type",
        "code": "4",
        "display": "Application Server"
      }
    ]
  },
  "entity": [
    {
      "what": {
        "reference": "Patient/patient-123"
      },
      "type": {
        "system": "http://terminology.hl7.org/CodeSystem/audit-entity-type",
        "code": "2",
        "display": "System Object"
      },
      "role": {
        "system": "http://terminology.hl7.org/CodeSystem/object-role",
        "code": "1",
        "display": "Patient"
      },
      "lifecycle": {
        "system": "http://terminology.hl7.org/CodeSystem/object-lifecycle-events",
        "code": "1",
        "display": "Access / Use"
      },
      "name": "Patient Record"
    }
  ]
}
```

### AuditEvent 主要欄位

| 欄位 | 說明 | 範例 |
|------|------|------|
| `type` | 事件型別 | REST 操作、DICOM 操作等 |
| `action` | 操作代碼 | C（Create）、R（Read）、U（Update）、D（Delete）、E（Execute） |
| `recorded` | 時間戳 | ISO 8601 格式 |
| `outcome` | 結果 | 0=成功、4=失敗、8=取消等 |
| `agent` | 執行操作的人/系統 | 使用者身份、IP 位址等 |
| `source` | 日誌來源系統 | 應用伺服器 |
| `entity` | 受影響的資源 | Patient、Observation 等 |

## 操作代碼（Action Codes）

| 代碼 | 操作 | 說明 |
|------|------|------|
| `C` | Create | 建立新資源 |
| `R` | Read | 讀取現有資源 |
| `U` | Update | 更新資源 |
| `D` | Delete | 刪除資源 |
| `E` | Execute | 執行操作 |

## 結果代碼（Outcome Codes）

| 代碼 | 含義 |
|------|------|
| `0` | 成功 |
| `4` | 失敗 |
| `8` | 取消 |
| `12` | 部分成功 |

## 在 Node.js 中實現稽核日誌

### 稽核事件工廠類

```javascript
const crypto = require('crypto');

class AuditEventLogger {
  constructor(fhirClient, sourceSystemId) {
    this.fhirClient = fhirClient;
    this.sourceSystemId = sourceSystemId;
  }

  /**
   * 生成唯一的事件 ID
   */
  generateEventId() {
    return crypto.randomUUID();
  }

  /**
   * 記錄讀取操作
   */
  async logRead(userId, userType, patientId, resourceType, succeeded = true) {
    const auditEvent = {
      resourceType: 'AuditEvent',
      type: {
        system: 'http://terminology.hl7.org/CodeSystem/audit-event-type',
        code: 'rest'
      },
      subtype: [{
        system: 'http://hl7.org/fhir/restful-interaction',
        code: 'read'
      }],
      action: 'R',
      recorded: new Date().toISOString(),
      outcome: succeeded ? '0' : '4',
      outcomeDesc: succeeded ? 'Success' : 'Failed',
      agent: [{
        type: {
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/audit-event-agent-type',
            code: userType === 'human' ? 'human' : 'application'
          }]
        },
        who: {
          identifier: {
            value: userId
          }
        },
        requestor: true
      }],
      source: {
        site: 'Clinical Portal',
        identifier: {
          value: this.sourceSystemId
        },
        type: [{
          system: 'http://terminology.hl7.org/CodeSystem/audit-event-source-type',
          code: '4'
        }]
      },
      entity: [{
        what: {
          reference: `Patient/${patientId}`
        },
        type: {
          system: 'http://terminology.hl7.org/CodeSystem/audit-entity-type',
          code: '2'
        },
        role: {
          system: 'http://terminology.hl7.org/CodeSystem/object-role',
          code: '1'
        },
        lifecycle: {
          system: 'http://terminology.hl7.org/CodeSystem/object-lifecycle-events',
          code: '1'
        }
      }]
    };

    return await this.storeAuditEvent(auditEvent);
  }

  /**
   * 記錄建立操作
   */
  async logCreate(userId, resourceType, resource, succeeded = true) {
    const auditEvent = {
      resourceType: 'AuditEvent',
      type: {
        system: 'http://terminology.hl7.org/CodeSystem/audit-event-type',
        code: 'rest'
      },
      subtype: [{
        system: 'http://hl7.org/fhir/restful-interaction',
        code: 'create'
      }],
      action: 'C',
      recorded: new Date().toISOString(),
      outcome: succeeded ? '0' : '4',
      agent: [{
        who: { identifier: { value: userId } },
        requestor: true
      }],
      entity: [{
        what: {
          reference: `${resourceType}/${resource.id || 'new'}`
        },
        type: {
          system: 'http://terminology.hl7.org/CodeSystem/audit-entity-type',
          code: '2'
        }
      }]
    };

    return await this.storeAuditEvent(auditEvent);
  }

  /**
   * 記錄未授權訪問嘗試
   */
  async logUnauthorizedAttempt(userId, resourceType, reason) {
    const auditEvent = {
      resourceType: 'AuditEvent',
      type: {
        system: 'http://terminology.hl7.org/CodeSystem/audit-event-type',
        code: 'security'
      },
      action: 'R',
      recorded: new Date().toISOString(),
      outcome: '4',
      outcomeDesc: `Unauthorized access attempt: ${reason}`,
      agent: [{
        who: { identifier: { value: userId } },
        requestor: true
      }],
      entity: [{
        what: { reference: resourceType }
      }]
    };

    return await this.storeAuditEvent(auditEvent);
  }

  /**
   * 儲存稽核事件到 FHIR 伺服器
   */
  async storeAuditEvent(auditEvent) {
    try {
      const response = await this.fhirClient.create('AuditEvent', auditEvent);
      console.log('Audit event logged:', response.id);
      return response;
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // 應該有本地備份，以防 FHIR 伺服器暫時不可用
      this.storeLocally(auditEvent);
    }
  }

  /**
   * 本地備份（以防 FHIR 伺服器不可用）
   */
  storeLocally(auditEvent) {
    // 可使用資料庫或檔案系統儲存
    console.log('Stored audit event locally:', auditEvent);
  }

  /**
   * 查詢稽核日誌
   */
  async queryAuditLog(userId, startDate, endDate) {
    const query = {
      agent: userId,
      recorded: `ge${startDate}T00:00:00Z&recorded=le${endDate}T23:59:59Z`
    };

    return await this.fhirClient.search('AuditEvent', query);
  }
}

// 使用範例
const auditLogger = new AuditEventLogger(fhirClient, 'portal-server-123');

// 記錄成功的讀取操作
await auditLogger.logRead('dr-smith', 'human', 'patient-123', 'Patient', true);

// 記錄未授權訪問嘗試
await auditLogger.logUnauthorizedAttempt(
  'user-456',
  'Patient/patient-789',
  'User does not have permission to view this patient'
);
```

## Express.js 中的自動稽核中介軟體

```javascript
const express = require('express');
const auditLogger = new AuditEventLogger(fhirClient, 'portal-123');

/**
 * 自動記錄所有 API 訪問的中介軟體
 */
function auditMiddleware(req, res, next) {
  // 儲存原始 send 方法
  const originalSend = res.send;

  res.send = function(data) {
    const statusCode = res.statusCode;
    const succeeded = statusCode >= 200 && statusCode < 400;
    
    // 非同步記錄稽核事件（不阻塞回應）
    (async () => {
      const userId = req.user?.id || req.headers['x-user-id'] || 'anonymous';
      const method = req.method;
      const path = req.path;
      const resourceType = path.split('/')[1];

      try {
        if (method === 'GET') {
          const patientId = req.query.patient || extractPatientId(data);
          await auditLogger.logRead(userId, 'human', patientId, resourceType, succeeded);
        } else if (method === 'POST') {
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          await auditLogger.logCreate(userId, resourceType, parsedData, succeeded);
        }

        // 記錄失敗訪問
        if (!succeeded) {
          const reason = `HTTP ${statusCode}: ${data}`;
          await auditLogger.logUnauthorizedAttempt(userId, resourceType, reason);
        }
      } catch (error) {
        console.error('Audit logging error:', error);
      }
    })();

    // 呼叫原始方法
    return originalSend.call(this, data);
  };

  next();
}

function extractPatientId(data) {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    return parsed.subject?.reference?.split('/')?.pop() || 'unknown';
  } catch {
    return 'unknown';
  }
}

// 在應用中使用
const app = express();
app.use(auditMiddleware);

app.get('/fhir/Patient/:id', (req, res) => {
  // 此請求會自動被審計
  res.json({ resourceType: 'Patient', id: req.params.id });
});
```

## 日誌聚合和分析

### ELK Stack（Elasticsearch, Logstash, Kibana）

```yaml
# docker-compose.yml
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - xpack.security.enabled=false
      - discovery.type=single-node
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.0.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5000:5000"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.0.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

### Logstash 設定

```conf
# logstash.conf
input {
  http {
    port => 5000
    codec => json
  }
}

filter {
  # 解析 FHIR AuditEvent
  if [resourceType] == "AuditEvent" {
    grok {
      match => { "agent.who.identifier.value" => "(?<userId>.+)" }
    }
    
    mutate {
      add_field => { "[@metadata][index_name]" => "fhir-audit-%{+YYYY.MM.dd}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "%{[@metadata][index_name]}"
  }
}
```

## 稽核日誌查詢範例

### 查詢特定患者的所有訪問

```javascript
// 查詢患者 P123 的所有訪問
const auditEvents = await fhirClient.search('AuditEvent', {
  entity: 'Patient/P123'
});

auditEvents.forEach(event => {
  console.log(`${event.recorded} - ${event.agent[0].name} - ${event.action}`);
});
```

### 查詢失敗的訪問嘗試

```javascript
const failedAttempts = await fhirClient.search('AuditEvent', {
  outcome: '4', // 失敗
  'recorded': `ge${startDate}`,
  '_sort': '-recorded'
});
```

### 查詢敏感資料訪問

```javascript
const sensitiveDataAccess = await fhirClient.search('AuditEvent', {
  entity: 'Condition', // 或其他敏感資源
  action: 'R',
  recorded: `ge${last24hours}`
});
```

## GDPR 審計要求

### 訪問報告（Data Subject Access Request）

```javascript
async function generateAccessReport(patientId, startDate, endDate) {
  const auditEvents = await fhirClient.search('AuditEvent', {
    entity: `Patient/${patientId}`,
    recorded: `ge${startDate}&recorded=le${endDate}`
  });

  const report = {
    patientId,
    accessEvents: auditEvents.map(event => ({
      timestamp: event.recorded,
      user: event.agent[0].name || event.agent[0].who.identifier.value,
      action: event.action,
      outcome: event.outcome === '0' ? 'Success' : 'Failed',
      details: event.outcomeDesc
    })),
    totalAccesses: auditEvents.length,
    generatedAt: new Date().toISOString()
  };

  return report;
}
```

## 稽核日誌最佳實踐

1. **立即記錄** — 所有操作應立即記錄，不要延遲
2. **不可篡改** — 稽核日誌應寫入只能追加的儲存空間
3. **足夠詳細** — 記錄足夠的上下文信息進行調查
4. **隱私保護** — 稽核日誌本身也是敏感資料，應受保護
5. **定期審查** — 定期檢查稽核日誌以發現異常
6. **備份** — 稽核日誌應定期備份到離線儲存
7. **合法保留** — 根據法規要求保留適當的時間

## 稽核日誌安全檢查清單

- [ ] 所有患者資料訪問都被記錄
- [ ] 稽核日誌經過加密和簽名
- [ ] 稽核日誌存儲於安全位置
- [ ] 只有授權人員可以訪問稽核日誌
- [ ] 定期檢查異常訪問模式
- [ ] 稽核日誌保留政策符合法規
- [ ] 有檔案破損檢測機制
- [ ] 稽核系統本身有監控

## 常見問題

**Q: 稽核日誌應該保留多久？**
A: 通常至少 6 年（HIPAA 要求）或根據當地法規。GDPR 可能有不同要求。

**Q: 患者可以看到他們的稽核日誌嗎？**
A: 是的，GDPR 允許患者要求看到誰訪問了他們的資料。

**Q: 如何處理敏感的稽核日誌？**
A: 稽核日誌本身應被視為敏感資料，需要與患者資料相同級別的保護。

**Q: 如何平衡效能和稽核詳細程度？**
A: 非同步記錄日誌以避免減慢應用，在離線數據庫中彙總分析。
