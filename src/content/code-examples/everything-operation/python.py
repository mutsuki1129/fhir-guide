# 使用 Python requests 執行 FHIR $everything 操作
import requests
from collections import Counter

BASE_URL = 'https://hapi.fhir.org/baseR4'
HEADERS = {'Accept': 'application/fhir+json'}

def get_patient_everything(patient_id: str) -> dict:
    """取得病患的所有相關資源"""
    r = requests.get(
        f'{BASE_URL}/Patient/{patient_id}/$everything',
        headers=HEADERS,
        params={'_count': 50}
    )
    r.raise_for_status()
    bundle = r.json()

    entries = bundle.get('entry', [])
    print(f'Patient $everything for {patient_id}:')
    print(f'  Total resources: {bundle.get("total", len(entries))}')

    # 按資源類型分組統計
    by_type = Counter(e['resource']['resourceType'] for e in entries)
    for resource_type, count in sorted(by_type.items()):
        print(f'  {resource_type}: {count}')

    return bundle

def get_patient_everything_in_range(patient_id: str, start: str, end: str) -> dict:
    """帶日期範圍的 $everything"""
    r = requests.get(
        f'{BASE_URL}/Patient/{patient_id}/$everything',
        headers=HEADERS,
        params={'start': start, 'end': end}
    )
    r.raise_for_status()
    bundle = r.json()
    print(f'Resources between {start} and {end}: {len(bundle.get("entry", []))}')
    return bundle

def get_all_pages(first_bundle: dict) -> list:
    """處理分頁，取得所有結果"""
    all_entries = list(first_bundle.get('entry', []))
    links = {link['relation']: link['url'] for link in first_bundle.get('link', [])}
    next_url = links.get('next')

    while next_url:
        r = requests.get(next_url, headers=HEADERS)
        r.raise_for_status()
        bundle = r.json()
        all_entries.extend(bundle.get('entry', []))
        links = {link['relation']: link['url'] for link in bundle.get('link', [])}
        next_url = links.get('next')

    print(f'Total entries across all pages: {len(all_entries)}')
    return all_entries

if __name__ == '__main__':
    bundle = get_patient_everything('P001')
    get_patient_everything_in_range('P001', '2024-01-01', '2024-12-31')
    get_all_pages(bundle)
