#!/bin/bash
# 使用 cURL 執行 FHIR $validate 操作

BASE_URL="https://hapi.fhir.org/baseR4"

echo "=== 驗證正確的 Patient ==="
curl -s -X POST "$BASE_URL/Patient/\$validate" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d '{
    "resourceType": "Parameters",
    "parameter": [{
      "name": "resource",
      "resource": {
        "resourceType": "Patient",
        "name": [{"family": "陳", "given": ["小華"]}],
        "gender": "female",
        "birthDate": "1990-07-20"
      }
    }]
  }' | grep -o '"severity":"[^"]*"'

echo -e "\n=== 驗證錯誤的 Patient（無效 gender）==="
curl -s -X POST "$BASE_URL/Patient/\$validate" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d '{
    "resourceType": "Parameters",
    "parameter": [{
      "name": "resource",
      "resource": {
        "resourceType": "Patient",
        "name": [{"family": "測試"}],
        "gender": "INVALID_GENDER"
      }
    }]
  }' | grep -o '"diagnostics":"[^"]*"'
