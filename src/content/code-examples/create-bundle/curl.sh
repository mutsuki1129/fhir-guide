#!/bin/bash
# 使用 cURL 執行 FHIR R4 Transaction Bundle

BASE_URL="https://hapi.fhir.org/baseR4"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "=== Transaction Bundle（原子性） ==="
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d "{
    \"resourceType\": \"Bundle\",
    \"type\": \"transaction\",
    \"entry\": [
      {
        \"fullUrl\": \"urn:uuid:patient-001\",
        \"resource\": {
          \"resourceType\": \"Patient\",
          \"name\": [{\"use\": \"official\", \"text\": \"張小明\", \"family\": \"張\", \"given\": [\"小明\"]}],
          \"gender\": \"male\",
          \"birthDate\": \"1990-01-15\"
        },
        \"request\": {\"method\": \"POST\", \"url\": \"Patient\"}
      },
      {
        \"fullUrl\": \"urn:uuid:obs-001\",
        \"resource\": {
          \"resourceType\": \"Observation\",
          \"status\": \"final\",
          \"code\": {
            \"coding\": [{\"system\": \"http://loinc.org\", \"code\": \"29463-7\", \"display\": \"Body weight\"}],
            \"text\": \"體重\"
          },
          \"subject\": {\"reference\": \"urn:uuid:patient-001\"},
          \"effectiveDateTime\": \"$NOW\",
          \"valueQuantity\": {\"value\": 70, \"unit\": \"kg\"}
        },
        \"request\": {\"method\": \"POST\", \"url\": \"Observation\"}
      }
    ]
  }" | grep -o '"status":"[^"]*"'
