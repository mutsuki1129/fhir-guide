// 使用 JavaScript Fetch API 完成 FHIR CRUD 操作
const BASE_URL = 'https://hapi.fhir.org/baseR4';

const headers = {
  'Content-Type': 'application/fhir+json',
  'Accept': 'application/fhir+json'
};

const newPatient = {
  resourceType: 'Patient',
  name: [{ use: 'official', text: '林美玲', family: '林', given: ['美玲'] }],
  telecom: [{ system: 'phone', value: '0987654321', use: 'mobile' }],
  gender: 'female',
  birthDate: '1992-08-25'
};

// CREATE
async function createPatient() {
  const res = await fetch(`${BASE_URL}/Patient`, {
    method: 'POST', headers, body: JSON.stringify(newPatient)
  });
  if (!res.ok) throw new Error(`Create failed: ${res.status}`);
  const patient = await res.json();
  console.log('Created Patient ID:', patient.id);
  return patient.id as string;
}

// READ
async function readPatient(id: string) {
  const res = await fetch(`${BASE_URL}/Patient/${id}`, { headers: { Accept: 'application/fhir+json' } });
  const patient = await res.json();
  console.log('Patient name:', patient.name?.[0]?.text);
  return patient;
}

// UPDATE
async function updatePatient(id: string) {
  const updated = {
    ...newPatient,
    id,
    telecom: [
      { system: 'phone', value: '0987654321', use: 'mobile' },
      { system: 'email', value: 'mei-ling@example.com', use: 'home' }
    ]
  };
  const res = await fetch(`${BASE_URL}/Patient/${id}`, {
    method: 'PUT', headers, body: JSON.stringify(updated)
  });
  const result = await res.json();
  console.log('Updated versionId:', result.meta?.versionId);
}

// SEARCH
async function searchPatients(name: string) {
  const res = await fetch(`${BASE_URL}/Patient?name=${encodeURIComponent(name)}&gender=female`, {
    headers: { Accept: 'application/fhir+json' }
  });
  const bundle = await res.json();
  console.log('Search total:', bundle.total);
}

// DELETE
async function deletePatient(id: string) {
  const res = await fetch(`${BASE_URL}/Patient/${id}`, { method: 'DELETE' });
  console.log('Deleted, status:', res.status);
}

// 執行完整流程
(async () => {
  const id = await createPatient();
  await readPatient(id);
  await updatePatient(id);
  await searchPatients('林');
  await deletePatient(id);
})().catch(console.error);
