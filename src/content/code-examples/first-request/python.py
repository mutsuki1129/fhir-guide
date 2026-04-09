# 使用 Python requests 完成 FHIR CRUD 操作
# 安裝：pip install requests

import requests

BASE_URL = 'https://hapi.fhir.org/baseR4'
HEADERS = {
    'Content-Type': 'application/fhir+json',
    'Accept': 'application/fhir+json'
}

new_patient = {
    'resourceType': 'Patient',
    'name': [{'use': 'official', 'text': '林美玲', 'family': '林', 'given': ['美玲']}],
    'telecom': [{'system': 'phone', 'value': '0987654321', 'use': 'mobile'}],
    'gender': 'female',
    'birthDate': '1992-08-25'
}

def create_patient():
    r = requests.post(f'{BASE_URL}/Patient', headers=HEADERS, json=new_patient)
    r.raise_for_status()
    patient = r.json()
    print(f'Created Patient ID: {patient["id"]}')
    return patient['id']

def read_patient(patient_id: str):
    r = requests.get(f'{BASE_URL}/Patient/{patient_id}', headers=HEADERS)
    r.raise_for_status()
    patient = r.json()
    print(f'Patient name: {patient["name"][0]["text"]}')
    return patient

def update_patient(patient_id: str):
    updated = {
        **new_patient,
        'id': patient_id,
        'telecom': [
            {'system': 'phone', 'value': '0987654321', 'use': 'mobile'},
            {'system': 'email', 'value': 'mei-ling@example.com', 'use': 'home'}
        ]
    }
    r = requests.put(f'{BASE_URL}/Patient/{patient_id}', headers=HEADERS, json=updated)
    r.raise_for_status()
    result = r.json()
    print(f'Updated versionId: {result.get("meta", {}).get("versionId")}')

def search_patients(name: str):
    r = requests.get(f'{BASE_URL}/Patient', headers=HEADERS,
                     params={'name': name, 'gender': 'female'})
    r.raise_for_status()
    bundle = r.json()
    print(f'Search total: {bundle.get("total", 0)}')

def delete_patient(patient_id: str):
    r = requests.delete(f'{BASE_URL}/Patient/{patient_id}', headers=HEADERS)
    print(f'Deleted, status: {r.status_code}')

if __name__ == '__main__':
    pid = create_patient()
    read_patient(pid)
    update_patient(pid)
    search_patients('林')
    delete_patient(pid)
