#!/bin/bash
# 使用 cURL 建立 FHIR R4 Observation（血壓）資源

BASE_URL="https://hapi.fhir.org/baseR4"

# 建立血壓觀察
echo "=== 建立 Observation ==="
curl -s -X POST "$BASE_URL/Observation" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d '{
    "resourceType": "Observation",
    "status": "final",
    "category": [{
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/observation-category",
        "code": "vital-signs"
      }]
    }],
    "code": {
      "coding": [{"system": "http://loinc.org", "code": "55284-4", "display": "Blood pressure systolic and diastolic"}],
      "text": "血壓"
    },
    "subject": {"reference": "Patient/P001", "display": "王大明"},
    "effectiveDateTime": "2024-01-20T10:30:00+08:00",
    "component": [
      {
        "code": {"coding": [{"system": "http://loinc.org", "code": "8480-6"}], "text": "收縮壓"},
        "valueQuantity": {"value": 120, "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]"}
      },
      {
        "code": {"coding": [{"system": "http://loinc.org", "code": "8462-4"}], "text": "舒張壓"},
        "valueQuantity": {"value": 80, "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]"}
      }
    ]
  }' | grep -o '"id":"[^"]*"' | head -1

# 搜尋病患的血壓觀察
echo -e "\n=== 搜尋血壓觀察 ==="
curl -s -X GET \
  "$BASE_URL/Observation?subject=Patient/P001&code=55284-4&_sort=-date&_count=5" \
  -H "Accept: application/fhir+json" | grep -o '"total":[0-9]*'
