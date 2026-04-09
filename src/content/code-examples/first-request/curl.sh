#!/bin/bash
# 使用 cURL 完成 FHIR CRUD 操作

BASE_URL="https://hapi.fhir.org/baseR4"

# 1. CREATE Patient
echo "=== CREATE ==="
RESPONSE=$(curl -s -X POST "$BASE_URL/Patient" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d '{
    "resourceType": "Patient",
    "name": [{"use": "official", "text": "林美玲", "family": "林", "given": ["美玲"]}],
    "telecom": [{"system": "phone", "value": "0987654321", "use": "mobile"}],
    "gender": "female",
    "birthDate": "1992-08-25"
  }')

PATIENT_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Created Patient ID: $PATIENT_ID"

# 2. READ Patient
echo -e "\n=== READ ==="
curl -s -X GET "$BASE_URL/Patient/$PATIENT_ID" \
  -H "Accept: application/fhir+json" | grep -o '"text":"[^"]*"' | head -1

# 3. UPDATE Patient
echo -e "\n=== UPDATE ==="
curl -s -X PUT "$BASE_URL/Patient/$PATIENT_ID" \
  -H "Content-Type: application/fhir+json" \
  -H "Accept: application/fhir+json" \
  -d "{
    \"resourceType\": \"Patient\",
    \"id\": \"$PATIENT_ID\",
    \"name\": [{\"use\": \"official\", \"text\": \"林美玲\", \"family\": \"林\", \"given\": [\"美玲\"]}],
    \"telecom\": [
      {\"system\": \"phone\", \"value\": \"0987654321\", \"use\": \"mobile\"},
      {\"system\": \"email\", \"value\": \"mei-ling@example.com\", \"use\": \"home\"}
    ],
    \"gender\": \"female\",
    \"birthDate\": \"1992-08-25\"
  }" | grep -o '"versionId":"[^"]*"' | head -1

# 4. SEARCH Patients
echo -e "\n=== SEARCH ==="
curl -s -X GET "$BASE_URL/Patient?name=林&gender=female" \
  -H "Accept: application/fhir+json" | grep -o '"total":[0-9]*'

# 5. DELETE Patient
echo -e "\n=== DELETE ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" \
  -X DELETE "$BASE_URL/Patient/$PATIENT_ID" \
  -H "Accept: application/fhir+json"
