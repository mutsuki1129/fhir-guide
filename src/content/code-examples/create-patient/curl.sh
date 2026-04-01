#!/bin/bash
# 使用 cURL 建立 FHIR R4 Patient 資源

BASE_URL="https://hapi.fhir.org/baseR4"

# 建立 Patient
echo "=== 建立 Patient ==="
RESPONSE=$(curl -s -X POST "$BASE_URL/Patient" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "text": {
      "status": "generated",
      "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">王大明</div>"
    },
    "identifier": [
      {
        "use": "official",
        "system": "https://www.nhi.gov.tw",
        "value": "A123456789"
      }
    ],
    "name": [
      {
        "use": "official",
        "text": "王大明",
        "family": "王",
        "given": ["大明"]
      }
    ],
    "telecom": [
      {"system": "phone", "value": "0912345678", "use": "mobile"}
    ],
    "gender": "male",
    "birthDate": "1985-03-15",
    "address": [
      {
        "use": "home",
        "city": "台北市",
        "country": "TW"
      }
    ]
  }')

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

# 取得 Patient ID
PATIENT_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)

if [ -n "$PATIENT_ID" ]; then
  echo ""
  echo "=== 讀取 Patient ($PATIENT_ID) ==="
  curl -s "$BASE_URL/Patient/$PATIENT_ID" \
    -H "Accept: application/fhir+json" | python3 -m json.tool

  echo ""
  echo "=== 搜尋姓名包含「王」的 Patient ==="
  curl -s "$BASE_URL/Patient?name=%E7%8E%8B&_count=5" \
    -H "Accept: application/fhir+json" | python3 -m json.tool
fi
