# 使用 Python requests 執行 FHIR $validate 操作
import requests

BASE_URL = 'https://hapi.fhir.org/baseR4'
HEADERS = {'Content-Type': 'application/fhir+json', 'Accept': 'application/fhir+json'}

def validate_resource(resource_type: str, resource: dict) -> bool:
    """驗證 FHIR 資源，回傳是否通過驗證"""
    body = {
        'resourceType': 'Parameters',
        'parameter': [{'name': 'resource', 'resource': resource}]
    }
    r = requests.post(f'{BASE_URL}/{resource_type}/$validate', headers=HEADERS, json=body)
    outcome = r.json()

    issues = outcome.get('issue', [])
    errors = [i for i in issues if i['severity'] in ('error', 'fatal')]
    warnings = [i for i in issues if i['severity'] == 'warning']

    if not errors:
        print('✅ Validation passed!')
        for w in warnings:
            print(f'  ⚠️  {w.get("diagnostics")}')
        return True
    else:
        print('❌ Validation failed:')
        for e in errors:
            location = e.get('location', [''])[0]
            print(f'  Error: {e.get("diagnostics")} [{location}]')
        return False

# 測試：正確的 Patient
valid_patient = {
    'resourceType': 'Patient',
    'name': [{'family': '陳', 'given': ['小華']}],
    'gender': 'female',
    'birthDate': '1990-07-20'
}

# 測試：錯誤的 Patient
invalid_patient = {
    'resourceType': 'Patient',
    'name': [{'family': '測試'}],
    'gender': 'INVALID_GENDER'
}

if __name__ == '__main__':
    print('=== 驗證正確的 Patient ===')
    validate_resource('Patient', valid_patient)

    print('\n=== 驗證錯誤的 Patient ===')
    validate_resource('Patient', invalid_patient)
