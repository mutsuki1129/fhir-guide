#!/bin/bash
# 使用 cURL 建立 FHIR R4 MedicationRequest 資源

BASE_URL="https://hapi.fhir.org/baseR4"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "=== 建立 MedicationRequest ==="
curl -s -X POST "$BASE_URL/MedicationRequest" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d "{
    \"resourceType\": \"MedicationRequest\",
    \"status\": \"active\",
    \"intent\": \"order\",
    \"medicationCodeableConcept\": {
      \"coding\": [{\"system\": \"http://www.nlm.nih.gov/research/umls/rxnorm\", \"code\": \"29046\", \"display\": \"Lisinopril\"}],
      \"text\": \"血管收縮素轉化酶抑制劑\"
    },
    \"subject\": {\"reference\": \"Patient/P001\", \"display\": \"王大明\"},
    \"authoredOn\": \"$NOW\",
    \"requester\": {\"reference\": \"Practitioner/DR001\", \"display\": \"李醫師\"},
    \"dosageInstruction\": [{
      \"text\": \"每日一次，每次10mg，口服\",
      \"doseAndRate\": [{\"doseQuantity\": {\"value\": 10, \"unit\": \"mg\"}}]
    }]
  }" | grep -o '"id":"[^"]*"' | head -1

echo -e "\n=== 搜尋活躍用藥 ==="
curl -s "$BASE_URL/MedicationRequest?subject=Patient/P001&status=active" \
  -H "Accept: application/fhir+json" | grep -o '"total":[0-9]*'
