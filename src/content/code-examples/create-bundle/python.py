# 使用 Python requests 建立 FHIR R4 Transaction Bundle
import requests
from datetime import datetime, timezone

BASE_URL = 'https://hapi.fhir.org/baseR4'
HEADERS = {'Content-Type': 'application/fhir+json', 'Accept': 'application/fhir+json'}

transaction_bundle = {
    'resourceType': 'Bundle',
    'type': 'transaction',
    'entry': [
        {
            'fullUrl': 'urn:uuid:patient-001',
            'resource': {
                'resourceType': 'Patient',
                'name': [{'use': 'official', 'text': '張小明', 'family': '張', 'given': ['小明']}],
                'gender': 'male',
                'birthDate': '1990-01-15'
            },
            'request': {'method': 'POST', 'url': 'Patient'}
        },
        {
            'fullUrl': 'urn:uuid:obs-001',
            'resource': {
                'resourceType': 'Observation',
                'status': 'final',
                'code': {
                    'coding': [{'system': 'http://loinc.org', 'code': '29463-7', 'display': 'Body weight'}],
                    'text': '體重'
                },
                'subject': {'reference': 'urn:uuid:patient-001'},
                'effectiveDateTime': datetime.now(timezone.utc).isoformat(),
                'valueQuantity': {'value': 70, 'unit': 'kg', 'system': 'http://unitsofmeasure.org', 'code': 'kg'}
            },
            'request': {'method': 'POST', 'url': 'Observation'}
        }
    ]
}

def execute_transaction():
    r = requests.post(BASE_URL, headers=HEADERS, json=transaction_bundle)
    r.raise_for_status()
    response_bundle = r.json()
    print(f'Transaction result type: {response_bundle["type"]}')
    for i, entry in enumerate(response_bundle.get('entry', [])):
        response = entry.get('response', {})
        print(f'Entry {i+1}: {response.get("status")} - {response.get("location")}')
    return response_bundle

def execute_batch():
    batch = {**transaction_bundle, 'type': 'batch'}
    r = requests.post(BASE_URL, headers=HEADERS, json=batch)
    r.raise_for_status()
    response_bundle = r.json()
    print(f'Batch completed, entries: {len(response_bundle.get("entry", []))}')
    return response_bundle

if __name__ == '__main__':
    print('=== Transaction Bundle ===')
    execute_transaction()
    print('\n=== Batch Bundle ===')
    execute_batch()
