#!/bin/bash
# 使用 cURL 建立 FHIR R4 Encounter 資源

BASE_URL="https://hapi.fhir.org/baseR4"

echo "=== 建立 Encounter ==="
curl -s -X POST "$BASE_URL/Encounter" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d '{
    "resourceType": "Encounter",
    "status": "finished",
    "class": {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      "code": "AMB",
      "display": "門診"
    },
    "type": [{
      "coding": [{"system": "http://snomed.info/sct", "code": "11429006", "display": "Consultation"}],
      "text": "一般門診"
    }],
    "subject": {"reference": "Patient/P001", "display": "王大明"},
    "participant": [{
      "individual": {"reference": "Practitioner/DR001", "display": "李醫師"}
    }],
    "period": {
      "start": "2024-01-20T09:00:00+08:00",
      "end": "2024-01-20T09:30:00+08:00"
    },
    "reasonCode": [{
      "coding": [{"system": "http://snomed.info/sct", "code": "38341003", "display": "Hypertension"}],
      "text": "高血壓追蹤"
    }]
  }' | grep -o '"id":"[^"]*"' | head -1

echo -e "\n=== 搜尋門診記錄 ==="
curl -s "$BASE_URL/Encounter?subject=Patient/P001&status=finished&_sort=-date" \
  -H "Accept: application/fhir+json" | grep -o '"total":[0-9]*'
