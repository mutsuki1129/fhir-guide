# 使用 Python requests 建立 FHIR R4 MedicationRequest 資源
import requests
from datetime import datetime, timezone

BASE_URL = 'https://hapi.fhir.org/baseR4'
HEADERS = {'Content-Type': 'application/fhir+json', 'Accept': 'application/fhir+json'}

medication_request = {
    'resourceType': 'MedicationRequest',
    'status': 'active',
    'intent': 'order',
    'medicationCodeableConcept': {
        'coding': [{'system': 'http://www.nlm.nih.gov/research/umls/rxnorm', 'code': '29046', 'display': 'Lisinopril'}],
        'text': '血管收縮素轉化酶抑制劑（高血壓用藥）'
    },
    'subject': {'reference': 'Patient/P001', 'display': '王大明'},
    'encounter': {'reference': 'Encounter/E001'},
    'authoredOn': datetime.now(timezone.utc).isoformat(),
    'requester': {'reference': 'Practitioner/DR001', 'display': '李醫師'},
    'dosageInstruction': [{
        'text': '每日一次，每次10mg，口服',
        'timing': {'repeat': {'frequency': 1, 'period': 1, 'periodUnit': 'd'}},
        'route': {
            'coding': [{'system': 'http://snomed.info/sct', 'code': '26643006', 'display': 'Oral route'}],
            'text': '口服'
        },
        'doseAndRate': [{'doseQuantity': {'value': 10, 'unit': 'mg', 'system': 'http://unitsofmeasure.org', 'code': 'mg'}}]
    }],
    'dispenseRequest': {
        'quantity': {'value': 30, 'unit': '錠'},
        'expectedSupplyDuration': {'value': 30, 'unit': 'days', 'system': 'http://unitsofmeasure.org', 'code': 'd'}
    }
}

def create_medication_request():
    r = requests.post(f'{BASE_URL}/MedicationRequest', headers=HEADERS, json=medication_request)
    r.raise_for_status()
    result = r.json()
    print(f'Created MedicationRequest ID: {result["id"]}')
    return result['id']

def search_active_medications(patient_id: str):
    r = requests.get(f'{BASE_URL}/MedicationRequest', headers=HEADERS,
                     params={'subject': f'Patient/{patient_id}', 'status': 'active'})
    r.raise_for_status()
    bundle = r.json()
    print(f'Active medications: {bundle.get("total", 0)}')
    for entry in bundle.get('entry', []):
        med = entry['resource']
        med_text = med.get('medicationCodeableConcept', {}).get('text', '')
        print(f'  - {med_text}')

if __name__ == '__main__':
    create_medication_request()
    search_active_medications('P001')
