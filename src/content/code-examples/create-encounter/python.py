# 使用 Python requests 建立 FHIR R4 Encounter 資源
import requests

BASE_URL = 'https://hapi.fhir.org/baseR4'
HEADERS = {'Content-Type': 'application/fhir+json', 'Accept': 'application/fhir+json'}

encounter = {
    'resourceType': 'Encounter',
    'status': 'finished',
    'class': {
        'system': 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        'code': 'AMB', 'display': '門診'
    },
    'type': [{
        'coding': [{'system': 'http://snomed.info/sct', 'code': '11429006', 'display': 'Consultation'}],
        'text': '一般門診'
    }],
    'subject': {'reference': 'Patient/P001', 'display': '王大明'},
    'participant': [{
        'type': [{'coding': [{'system': 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType', 'code': 'ATND'}]}],
        'individual': {'reference': 'Practitioner/DR001', 'display': '李醫師'}
    }],
    'period': {'start': '2024-01-20T09:00:00+08:00', 'end': '2024-01-20T09:30:00+08:00'},
    'reasonCode': [{
        'coding': [{'system': 'http://snomed.info/sct', 'code': '38341003', 'display': 'Hypertension'}],
        'text': '高血壓追蹤'
    }]
}

def create_encounter():
    r = requests.post(f'{BASE_URL}/Encounter', headers=HEADERS, json=encounter)
    r.raise_for_status()
    result = r.json()
    print(f'Created Encounter ID: {result["id"]}')
    return result['id']

def search_encounters(patient_id: str):
    r = requests.get(f'{BASE_URL}/Encounter', headers=HEADERS, params={
        'subject': f'Patient/{patient_id}', 'status': 'finished', '_sort': '-date'
    })
    r.raise_for_status()
    bundle = r.json()
    print(f'Found encounters: {bundle.get("total", 0)}')

if __name__ == '__main__':
    create_encounter()
    search_encounters('P001')
