// 使用 JavaScript Fetch API 建立 FHIR R4 Observation（血壓）資源
const BASE_URL = 'https://hapi.fhir.org/baseR4';

const headers = {
  'Content-Type': 'application/fhir+json',
  'Accept': 'application/fhir+json'
};

const bloodPressure = {
  resourceType: 'Observation',
  status: 'final',
  category: [{
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/observation-category',
      code: 'vital-signs',
      display: 'Vital Signs'
    }]
  }],
  code: {
    coding: [{
      system: 'http://loinc.org',
      code: '55284-4',
      display: 'Blood pressure systolic and diastolic'
    }],
    text: '血壓'
  },
  subject: { reference: 'Patient/P001', display: '王大明' },
  effectiveDateTime: new Date().toISOString(),
  component: [
    {
      code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }], text: '收縮壓' },
      valueQuantity: { value: 120, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
    },
    {
      code: { coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }], text: '舒張壓' },
      valueQuantity: { value: 80, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
    }
  ]
};

async function createObservation() {
  const res = await fetch(`${BASE_URL}/Observation`, {
    method: 'POST', headers, body: JSON.stringify(bloodPressure)
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const obs = await res.json();
  console.log('Created Observation ID:', obs.id);
  return obs.id as string;
}

// 查詢指定病患的血壓觀察
async function searchBloodPressure(patientId: string) {
  const res = await fetch(
    `${BASE_URL}/Observation?subject=Patient/${patientId}&code=55284-4&_sort=-date&_count=5`,
    { headers: { Accept: 'application/fhir+json' } }
  );
  const bundle = await res.json();
  console.log('Found observations:', bundle.total);
  return bundle;
}

(async () => {
  const id = await createObservation();
  await searchBloodPressure('P001');
})().catch(console.error);
