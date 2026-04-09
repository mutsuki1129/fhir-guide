#!/bin/bash
# 使用 cURL 建立 FHIR R4 Condition 資源

BASE_URL="https://hapi.fhir.org/baseR4"
TODAY=$(date +%Y-%m-%d)

echo "=== 建立 Condition ==="
curl -s -X POST "$BASE_URL/Condition" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d "{
    \"resourceType\": \"Condition\",
    \"clinicalStatus\": {
      \"coding\": [{\"system\": \"http://terminology.hl7.org/CodeSystem/condition-clinical\", \"code\": \"active\"}]
    },
    \"verificationStatus\": {
      \"coding\": [{\"system\": \"http://terminology.hl7.org/CodeSystem/condition-ver-status\", \"code\": \"confirmed\"}]
    },
    \"code\": {
      \"coding\": [{\"system\": \"http://hl7.org/fhir/sid/icd-10\", \"code\": \"I10\", \"display\": \"Essential hypertension\"}],
      \"text\": \"原發性高血壓\"
    },
    \"subject\": {\"reference\": \"Patient/P001\", \"display\": \"王大明\"},
    \"onsetDateTime\": \"2023-06-15\",
    \"recordedDate\": \"$TODAY\"
  }" | grep -o '"id":"[^"]*"' | head -1

echo -e "\n=== 搜尋活躍病情 ==="
curl -s "$BASE_URL/Condition?subject=Patient/P001&clinical-status=active" \
  -H "Accept: application/fhir+json" | grep -o '"total":[0-9]*'
