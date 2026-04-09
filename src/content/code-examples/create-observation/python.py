# 使用 Python requests 建立 FHIR R4 Observation（血壓）資源
# 安裝：pip install requests

import requests
from datetime import datetime, timezone

BASE_URL = 'https://hapi.fhir.org/baseR4'
HEADERS = {
    'Content-Type': 'application/fhir+json',
    'Accept': 'application/fhir+json'
}

blood_pressure = {
    'resourceType': 'Observation',
    'status': 'final',
    'category': [{
        'coding': [{
            'system': 'http://terminology.hl7.org/CodeSystem/observation-category',
            'code': 'vital-signs',
            'display': 'Vital Signs'
        }]
    }],
    'code': {
        'coding': [{
            'system': 'http://loinc.org',
            'code': '55284-4',
            'display': 'Blood pressure systolic and diastolic'
        }],
        'text': '血壓'
    },
    'subject': {'reference': 'Patient/P001', 'display': '王大明'},
    'effectiveDateTime': datetime.now(timezone.utc).isoformat(),
    'component': [
        {
            'code': {'coding': [{'system': 'http://loinc.org', 'code': '8480-6', 'display': 'Systolic blood pressure'}], 'text': '收縮壓'},
            'valueQuantity': {'value': 120, 'unit': 'mmHg', 'system': 'http://unitsofmeasure.org', 'code': 'mm[Hg]'}
        },
        {
            'code': {'coding': [{'system': 'http://loinc.org', 'code': '8462-4', 'display': 'Diastolic blood pressure'}], 'text': '舒張壓'},
            'valueQuantity': {'value': 80, 'unit': 'mmHg', 'system': 'http://unitsofmeasure.org', 'code': 'mm[Hg]'}
        }
    ]
}

def create_observation():
    r = requests.post(f'{BASE_URL}/Observation', headers=HEADERS, json=blood_pressure)
    r.raise_for_status()
    obs = r.json()
    print(f'Created Observation ID: {obs["id"]}')
    return obs['id']

def search_blood_pressure(patient_id: str):
    r = requests.get(f'{BASE_URL}/Observation', headers=HEADERS, params={
        'subject': f'Patient/{patient_id}',
        'code': '55284-4',
        '_sort': '-date',
        '_count': 5
    })
    r.raise_for_status()
    bundle = r.json()
    print(f'Found observations: {bundle.get("total", 0)}')
    for entry in bundle.get('entry', []):
        obs = entry['resource']
        components = obs.get('component', [])
        for comp in components:
            text = comp.get('code', {}).get('text', '')
            value = comp.get('valueQuantity', {}).get('value', '')
            unit = comp.get('valueQuantity', {}).get('unit', '')
            print(f'  {text}: {value} {unit}')

if __name__ == '__main__':
    create_observation()
    search_blood_pressure('P001')
