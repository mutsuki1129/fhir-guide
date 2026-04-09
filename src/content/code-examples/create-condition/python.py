# 使用 Python requests 建立 FHIR R4 Condition 資源
import requests
from datetime import date

BASE_URL = 'https://hapi.fhir.org/baseR4'
HEADERS = {'Content-Type': 'application/fhir+json', 'Accept': 'application/fhir+json'}

condition = {
    'resourceType': 'Condition',
    'clinicalStatus': {
        'coding': [{'system': 'http://terminology.hl7.org/CodeSystem/condition-clinical', 'code': 'active'}]
    },
    'verificationStatus': {
        'coding': [{'system': 'http://terminology.hl7.org/CodeSystem/condition-ver-status', 'code': 'confirmed'}]
    },
    'category': [{
        'coding': [{'system': 'http://terminology.hl7.org/CodeSystem/condition-category', 'code': 'encounter-diagnosis'}]
    }],
    'severity': {
        'coding': [{'system': 'http://snomed.info/sct', 'code': '6736007', 'display': 'Moderate'}],
        'text': '中度'
    },
    'code': {
        'coding': [{'system': 'http://hl7.org/fhir/sid/icd-10', 'code': 'I10', 'display': 'Essential (primary) hypertension'}],
        'text': '原發性高血壓'
    },
    'subject': {'reference': 'Patient/P001', 'display': '王大明'},
    'onsetDateTime': '2023-06-15',
    'recordedDate': date.today().isoformat()
}

def create_condition():
    r = requests.post(f'{BASE_URL}/Condition', headers=HEADERS, json=condition)
    r.raise_for_status()
    result = r.json()
    print(f'Created Condition ID: {result["id"]}')
    return result['id']

def search_active_conditions(patient_id: str):
    r = requests.get(f'{BASE_URL}/Condition', headers=HEADERS, params={
        'subject': f'Patient/{patient_id}',
        'clinical-status': 'active'
    })
    r.raise_for_status()
    bundle = r.json()
    print(f'Active conditions: {bundle.get("total", 0)}')
    for entry in bundle.get('entry', []):
        cond = entry['resource']
        print(f'  - {cond.get("code", {}).get("text")} (onset: {cond.get("onsetDateTime")})')

if __name__ == '__main__':
    create_condition()
    search_active_conditions('P001')
