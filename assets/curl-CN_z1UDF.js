var e=`#!/bin/bash
# 連接 Foundry 上啟動的 FHIR Server 並執行基本操作
# 預設使用 FHIR Candle（本地 Foundry 部署）

FHIR_BASE="http://localhost:8080/fhir/r4"

echo "=== 1. 取得伺服器能力聲明 ==="
curl -s "$FHIR_BASE/metadata" \\
  -H "Accept: application/fhir+json" \\
  | jq '{name: .software.name, version: .software.version, fhirVersion: .fhirVersion}'

echo ""
echo "=== 2. 建立 Patient ==="
PATIENT_RESPONSE=$(curl -s -X POST "$FHIR_BASE/Patient" \\
  -H "Content-Type: application/fhir+json" \\
  -H "Accept: application/fhir+json" \\
  -d '{
    "resourceType": "Patient",
    "name": [{"family": "王", "given": ["小明"], "use": "official"}],
    "gender": "male",
    "birthDate": "1990-05-15",
    "identifier": [{"system": "http://example.org/mrn", "value": "MRN-001"}]
  }')

PATIENT_ID=$(echo "$PATIENT_RESPONSE" | jq -r '.id')
echo "Created Patient ID: $PATIENT_ID"

echo ""
echo "=== 3. 建立血壓 Observation ==="
curl -s -X POST "$FHIR_BASE/Observation" \\
  -H "Content-Type: application/fhir+json" \\
  -H "Accept: application/fhir+json" \\
  -d "{
    \\"resourceType\\": \\"Observation\\",
    \\"status\\": \\"final\\",
    \\"code\\": {
      \\"coding\\": [{
        \\"system\\": \\"http://loinc.org\\",
        \\"code\\": \\"55284-4\\",
        \\"display\\": \\"Blood pressure systolic and diastolic\\"
      }]
    },
    \\"subject\\": {\\"reference\\": \\"Patient/$PATIENT_ID\\"},
    \\"effectiveDateTime\\": \\"$(date -Iseconds)\\",
    \\"component\\": [
      {
        \\"code\\": {\\"coding\\": [{\\"system\\": \\"http://loinc.org\\", \\"code\\": \\"8480-6\\", \\"display\\": \\"Systolic blood pressure\\"}]},
        \\"valueQuantity\\": {\\"value\\": 120, \\"unit\\": \\"mmHg\\", \\"system\\": \\"http://unitsofmeasure.org\\", \\"code\\": \\"mm[Hg]\\"}
      },
      {
        \\"code\\": {\\"coding\\": [{\\"system\\": \\"http://loinc.org\\", \\"code\\": \\"8462-4\\", \\"display\\": \\"Diastolic blood pressure\\"}]},
        \\"valueQuantity\\": {\\"value\\": 80, \\"unit\\": \\"mmHg\\", \\"system\\": \\"http://unitsofmeasure.org\\", \\"code\\": \\"mm[Hg]\\"}
      }
    ]
  }" | jq '{id: .id, status: .status}'

echo ""
echo "=== 4. 依姓名搜尋 Patient ==="
curl -s "$FHIR_BASE/Patient?family=%E7%8E%8B" \\
  -H "Accept: application/fhir+json" \\
  | jq '{total: .total, names: [.entry[]?.resource.name[0].family]}'

echo ""
echo "=== 5. 查詢此 Patient 的所有 Observation ==="
curl -s "$FHIR_BASE/Observation?patient=$PATIENT_ID" \\
  -H "Accept: application/fhir+json" \\
  | jq '{total: .total, codes: [.entry[]?.resource.code.coding[0].display]}'

echo ""
echo "=== 6. 驗證 Resource ==="
curl -s -X POST "$FHIR_BASE/Patient/\\$validate" \\
  -H "Content-Type: application/fhir+json" \\
  -H "Accept: application/fhir+json" \\
  -d '{
    "resourceType": "Patient",
    "gender": "male",
    "birthDate": "1990-05-15",
    "name": [{"family": "王", "use": "official"}]
  }' | jq '[.issue[] | select(.severity == "error") | {severity: .severity, message: .diagnostics}]'
`;export{e as default};