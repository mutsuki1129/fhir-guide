import requests
from datetime import datetime

# 連接 Foundry 上啟動的 FHIR Server
# 預設使用 FHIR Candle（本地 Foundry 部署）
FHIR_BASE = "http://localhost:8080/fhir/r4"
HEADERS = {
    "Content-Type": "application/fhir+json",
    "Accept": "application/fhir+json"
}

# 1. 取得伺服器能力聲明
def get_capability_statement():
    res = requests.get(f"{FHIR_BASE}/metadata", headers={"Accept": "application/fhir+json"})
    res.raise_for_status()
    cs = res.json()
    print(f"Server: {cs.get('software', {}).get('name')} v{cs.get('software', {}).get('version')}")
    print(f"FHIR Version: {cs.get('fhirVersion')}")
    return cs

# 2. 建立 Patient
def create_patient(family: str, given: str, gender: str = "male", birth_date: str = "1990-01-01"):
    patient = {
        "resourceType": "Patient",
        "name": [{"family": family, "given": [given], "use": "official"}],
        "gender": gender,
        "birthDate": birth_date,
        "identifier": [{"system": "http://example.org/mrn", "value": f"MRN-{family}"}]
    }
    res = requests.post(f"{FHIR_BASE}/Patient", json=patient, headers=HEADERS)
    res.raise_for_status()
    created = res.json()
    print(f"Created Patient ID: {created['id']}")
    return created

# 3. 依姓名搜尋 Patient
def search_patients(family: str):
    res = requests.get(f"{FHIR_BASE}/Patient", params={"family": family}, headers=HEADERS)
    res.raise_for_status()
    bundle = res.json()
    total = bundle.get("total", 0)
    print(f"Found {total} patients with family name '{family}'")
    return bundle

# 4. 建立 Observation（血壓）
def create_blood_pressure(patient_id: str, systolic: int = 120, diastolic: int = 80):
    obs = {
        "resourceType": "Observation",
        "status": "final",
        "code": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "55284-4",
                "display": "Blood pressure systolic and diastolic"
            }]
        },
        "subject": {"reference": f"Patient/{patient_id}"},
        "effectiveDateTime": datetime.now().isoformat(),
        "component": [
            {
                "code": {"coding": [{"system": "http://loinc.org", "code": "8480-6", "display": "Systolic blood pressure"}]},
                "valueQuantity": {"value": systolic, "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]"}
            },
            {
                "code": {"coding": [{"system": "http://loinc.org", "code": "8462-4", "display": "Diastolic blood pressure"}]},
                "valueQuantity": {"value": diastolic, "unit": "mmHg", "system": "http://unitsofmeasure.org", "code": "mm[Hg]"}
            }
        ]
    }
    res = requests.post(f"{FHIR_BASE}/Observation", json=obs, headers=HEADERS)
    res.raise_for_status()
    created = res.json()
    print(f"Created Observation ID: {created['id']}")
    return created

# 5. 查詢特定 Patient 的所有 Observation
def get_patient_observations(patient_id: str):
    res = requests.get(f"{FHIR_BASE}/Observation", params={"patient": patient_id}, headers=HEADERS)
    res.raise_for_status()
    bundle = res.json()
    print(f"Found {bundle.get('total', 0)} observations for Patient/{patient_id}")
    return bundle

# 6. 驗證 Resource
def validate_patient(patient: dict):
    res = requests.post(f"{FHIR_BASE}/Patient/$validate", json=patient, headers=HEADERS)
    result = res.json()
    errors = [i for i in result.get("issue", []) if i.get("severity") == "error"]
    if not errors:
        print("✅ Validation passed")
    else:
        for err in errors:
            print(f"❌ Validation error: {err.get('diagnostics')}")
    return result

# 執行範例
if __name__ == "__main__":
    get_capability_statement()
    print()

    patient = create_patient(family="王", given="小明", gender="male", birth_date="1990-05-15")
    create_blood_pressure(patient["id"], systolic=120, diastolic=80)
    print()

    search_patients("王")
    get_patient_observations(patient["id"])
    print()

    validate_patient({
        "resourceType": "Patient",
        "gender": "male",
        "birthDate": "1990-05-15",
        "name": [{"family": "王", "use": "official"}]
    })
