var e=`# 使用 Python requests 建立 FHIR R4 Patient 資源
# 安裝：pip install requests

import requests
import json

BASE_URL = 'https://hapi.fhir.org/baseR4'

headers = {
    'Content-Type': 'application/fhir+json',
    'Accept': 'application/fhir+json'
}

patient_data = {
    'resourceType': 'Patient',
    'text': {
        'status': 'generated',
        'div': '<div xmlns="http://www.w3.org/1999/xhtml">王大明</div>'
    },
    'identifier': [
        {
            'use': 'official',
            'system': 'https://www.nhi.gov.tw',
            'value': 'A123456789'
        }
    ],
    'name': [
        {
            'use': 'official',
            'text': '王大明',
            'family': '王',
            'given': ['大明']
        }
    ],
    'telecom': [
        {'system': 'phone', 'value': '0912345678', 'use': 'mobile'}
    ],
    'gender': 'male',
    'birthDate': '1985-03-15',
    'address': [
        {
            'use': 'home',
            'city': '台北市',
            'country': 'TW'
        }
    ]
}

def create_patient():
    response = requests.post(
        f'{BASE_URL}/Patient',
        headers=headers,
        json=patient_data
    )
    response.raise_for_status()
    patient = response.json()
    print(f'Patient created, ID: {patient["id"]}')
    print(f'Version: {patient.get("meta", {}).get("versionId")}')
    return patient

def get_patient(patient_id: str):
    response = requests.get(
        f'{BASE_URL}/Patient/{patient_id}',
        headers={'Accept': 'application/fhir+json'}
    )
    response.raise_for_status()
    return response.json()

def search_patients_by_name(name: str):
    response = requests.get(
        f'{BASE_URL}/Patient',
        headers={'Accept': 'application/fhir+json'},
        params={'name': name, '_count': 10}
    )
    response.raise_for_status()
    bundle = response.json()
    print(f'Found {bundle.get("total", 0)} patients')
    return bundle

if __name__ == '__main__':
    # 建立病患
    patient = create_patient()

    # 讀取病患
    fetched = get_patient(patient['id'])
    print(f'Patient name: {fetched["name"][0]["text"]}')

    # 搜尋病患
    search_patients_by_name('王')
`;export{e as default};