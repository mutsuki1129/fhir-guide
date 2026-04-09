# 使用 Python requests 執行 FHIR R4 基本搜尋
import requests

BASE_URL = 'https://hapi.fhir.org/baseR4'
HEADERS = {'Accept': 'application/fhir+json'}

def search_by_name(name: str):
    r = requests.get(f'{BASE_URL}/Patient', headers=HEADERS,
                     params={'name': name, '_count': 10})
    r.raise_for_status()
    bundle = r.json()
    print(f'Found {bundle.get("total", 0)} patients named "{name}"')
    for entry in bundle.get('entry', []):
        p = entry['resource']
        name_text = p.get('name', [{}])[0].get('text', '')
        print(f'  - {name_text} ({p.get("gender")}, born {p.get("birthDate")})')
    return bundle

def search_by_name_and_gender(name: str, gender: str):
    r = requests.get(f'{BASE_URL}/Patient', headers=HEADERS,
                     params={'name': name, 'gender': gender, '_count': 10})
    r.raise_for_status()
    bundle = r.json()
    print(f'Combined search: {bundle.get("total", 0)} results')
    return bundle

def search_observations_by_date(patient_id: str, from_date: str, to_date: str):
    # 多個 date 參數需手動組裝 URL
    r = requests.get(
        f'{BASE_URL}/Observation',
        headers=HEADERS,
        params=[
            ('subject', f'Patient/{patient_id}'),
            ('date', f'ge{from_date}'),
            ('date', f'le{to_date}'),
            ('_sort', '-date'),
            ('_count', '20')
        ]
    )
    r.raise_for_status()
    bundle = r.json()
    print(f'Observations between {from_date} and {to_date}: {bundle.get("total", 0)}')
    return bundle

def search_active_conditions(patient_id: str):
    r = requests.get(f'{BASE_URL}/Condition', headers=HEADERS, params={
        'subject': f'Patient/{patient_id}',
        'clinical-status': 'active',
        '_sort': '-recorded-date'
    })
    r.raise_for_status()
    bundle = r.json()
    print(f'Active conditions: {bundle.get("total", 0)}')
    return bundle

if __name__ == '__main__':
    search_by_name('王')
    search_by_name_and_gender('王', 'male')
    search_observations_by_date('P001', '2024-01-01', '2024-12-31')
    search_active_conditions('P001')
