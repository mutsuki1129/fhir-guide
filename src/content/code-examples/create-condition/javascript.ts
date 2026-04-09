// 使用 JavaScript Fetch API 建立 FHIR R4 Condition 資源
const BASE_URL = 'https://hapi.fhir.org/baseR4';

const headers = {
  'Content-Type': 'application/fhir+json',
  'Accept': 'application/fhir+json'
};

const condition = {
  resourceType: 'Condition',
  clinicalStatus: {
    coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }]
  },
  verificationStatus: {
    coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed', display: 'Confirmed' }]
  },
  category: [{
    coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-category', code: 'encounter-diagnosis', display: 'Encounter Diagnosis' }]
  }],
  severity: {
    coding: [{ system: 'http://snomed.info/sct', code: '6736007', display: 'Moderate' }],
    text: '中度'
  },
  code: {
    coding: [{ system: 'http://hl7.org/fhir/sid/icd-10', code: 'I10', display: 'Essential (primary) hypertension' }],
    text: '原發性高血壓'
  },
  subject: { reference: 'Patient/P001', display: '王大明' },
  onsetDateTime: '2023-06-15',
  recordedDate: new Date().toISOString().split('T')[0]
};

async function createCondition() {
  const res = await fetch(`${BASE_URL}/Condition`, {
    method: 'POST', headers, body: JSON.stringify(condition)
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const result = await res.json();
  console.log('Created Condition ID:', result.id);
  return result.id as string;
}

async function searchActiveConditions(patientId: string) {
  const res = await fetch(
    `${BASE_URL}/Condition?subject=Patient/${patientId}&clinical-status=active`,
    { headers: { Accept: 'application/fhir+json' } }
  );
  const bundle = await res.json();
  console.log('Active conditions:', bundle.total);
  bundle.entry?.forEach((e: any) => {
    console.log(' -', e.resource.code?.text, '(onset:', e.resource.onsetDateTime, ')');
  });
}

(async () => {
  await createCondition();
  await searchActiveConditions('P001');
})().catch(console.error);
