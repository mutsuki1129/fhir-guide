#!/bin/bash
# 使用 cURL 執行 FHIR R4 基本搜尋

BASE_URL="https://hapi.fhir.org/baseR4"
ACCEPT="Accept: application/fhir+json"

# 依姓名搜尋
echo "=== 依姓名搜尋 ==="
curl -s -G "$BASE_URL/Patient" \
  -H "$ACCEPT" \
  --data-urlencode "name=王" \
  --data-urlencode "_count=10" | grep -o '"total":[0-9]*'

# 組合搜尋：姓名 + 性別
echo -e "\n=== 組合搜尋 ==="
curl -s "$BASE_URL/Patient?name=王&gender=male&_count=10" \
  -H "$ACCEPT" | grep -o '"total":[0-9]*'

# 日期範圍搜尋
echo -e "\n=== 日期範圍搜尋（2024 年觀察）==="
curl -s "$BASE_URL/Observation?subject=Patient/P001&date=ge2024-01-01&date=le2024-12-31&_sort=-date" \
  -H "$ACCEPT" | grep -o '"total":[0-9]*'

# 搜尋活躍病情
echo -e "\n=== 搜尋活躍病情 ==="
curl -s "$BASE_URL/Condition?subject=Patient/P001&clinical-status=active" \
  -H "$ACCEPT" | grep -o '"total":[0-9]*'

# 搜尋用藥清單
echo -e "\n=== 搜尋活躍用藥 ==="
curl -s "$BASE_URL/MedicationRequest?subject=Patient/P001&status=active" \
  -H "$ACCEPT" | grep -o '"total":[0-9]*'
