// 使用 JavaScript Fetch API 執行 FHIR $validate 操作
const BASE_URL = 'https://hapi.fhir.org/baseR4';

const headers = {
  'Content-Type': 'application/fhir+json',
  'Accept': 'application/fhir+json'
};

// 驗證 Patient 資源
async function validatePatient(patient: object): Promise<boolean> {
  const body = {
    resourceType: 'Parameters',
    parameter: [{ name: 'resource', resource: patient }]
  };

  const res = await fetch(`${BASE_URL}/Patient/$validate`, {
    method: 'POST', headers, body: JSON.stringify(body)
  });
  const outcome = await res.json();

  const issues = outcome.issue ?? [];
  const errors = issues.filter((i: any) => i.severity === 'error' || i.severity === 'fatal');
  const warnings = issues.filter((i: any) => i.severity === 'warning');

  if (errors.length === 0) {
    console.log('✅ Validation passed!');
    warnings.forEach((w: any) => console.warn(`  ⚠️  ${w.diagnostics}`));
    return true;
  } else {
    console.log('❌ Validation failed:');
    errors.forEach((e: any) => console.error(`  Error: ${e.diagnostics} [${e.location?.[0]}]`));
    return false;
  }
}

// 直接驗證（不用 Parameters 包裝）
async function validateDirect(resource: object) {
  const res = await fetch(`${BASE_URL}/Patient/$validate`, {
    method: 'POST', headers, body: JSON.stringify(resource)
  });
  return res.json();
}

// 測試：正確的 Patient
const validPatient = {
  resourceType: 'Patient',
  name: [{ family: '陳', given: ['小華'] }],
  gender: 'female',
  birthDate: '1990-07-20'
};

// 測試：錯誤的 Patient（無效 gender 值）
const invalidPatient = {
  resourceType: 'Patient',
  name: [{ family: '測試' }],
  gender: 'INVALID_GENDER'  // 錯誤值
};

(async () => {
  console.log('=== 驗證正確的 Patient ===');
  await validatePatient(validPatient);

  console.log('\n=== 驗證錯誤的 Patient ===');
  await validatePatient(invalidPatient);
})().catch(console.error);
