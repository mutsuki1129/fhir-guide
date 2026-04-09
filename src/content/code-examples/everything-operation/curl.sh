#!/bin/bash
# 使用 cURL 執行 FHIR $everything 操作

BASE_URL="https://hapi.fhir.org/baseR4"
PATIENT_ID="P001"

echo "=== Patient \$everything ==="
curl -s "$BASE_URL/Patient/$PATIENT_ID/\$everything?_count=50" \
  -H "Accept: application/fhir+json" | \
  grep -o '"resourceType":"[^"]*"' | sort | uniq -c | sort -rn

echo -e "\n=== 帶日期範圍的 \$everything ==="
curl -s "$BASE_URL/Patient/$PATIENT_ID/\$everything?start=2024-01-01&end=2024-12-31" \
  -H "Accept: application/fhir+json" | grep -o '"total":[0-9]*'

# 分頁處理：取得下一頁 URL
echo -e "\n=== 取得分頁連結 ==="
curl -s "$BASE_URL/Patient/$PATIENT_ID/\$everything?_count=10" \
  -H "Accept: application/fhir+json" | grep -o '"url":"[^"]*"' | grep next
