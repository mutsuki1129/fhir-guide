// 使用 JavaScript Fetch API 建立 FHIR R4 Transaction Bundle
const BASE_URL = 'https://hapi.fhir.org/baseR4';

const headers = {
  'Content-Type': 'application/fhir+json',
  'Accept': 'application/fhir+json'
};

// Transaction Bundle：原子性地建立 Patient + Observation
const transactionBundle = {
  resourceType: 'Bundle',
  type: 'transaction',
  entry: [
    {
      fullUrl: 'urn:uuid:patient-001',
      resource: {
        resourceType: 'Patient',
        name: [{ use: 'official', text: '張小明', family: '張', given: ['小明'] }],
        gender: 'male',
        birthDate: '1990-01-15'
      },
      request: { method: 'POST', url: 'Patient' }
    },
    {
      fullUrl: 'urn:uuid:obs-001',
      resource: {
        resourceType: 'Observation',
        status: 'final',
        code: {
          coding: [{ system: 'http://loinc.org', code: '29463-7', display: 'Body weight' }],
          text: '體重'
        },
        subject: { reference: 'urn:uuid:patient-001' },  // 引用同 bundle 中的 Patient
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 70, unit: 'kg', system: 'http://unitsofmeasure.org', code: 'kg' }
      },
      request: { method: 'POST', url: 'Observation' }
    }
  ]
};

async function executeTransaction() {
  const res = await fetch(BASE_URL, {
    method: 'POST', headers, body: JSON.stringify(transactionBundle)
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const responseBundle = await res.json();
  console.log('Transaction result type:', responseBundle.type);
  responseBundle.entry?.forEach((e: any, i: number) => {
    console.log(`Entry ${i + 1}: ${e.response?.status} - ${e.response?.location}`);
  });
  return responseBundle;
}

// Batch Bundle：非原子性，每個請求獨立執行
async function executeBatch() {
  const batchBundle = {
    ...transactionBundle,
    type: 'batch'
  };
  const res = await fetch(BASE_URL, {
    method: 'POST', headers, body: JSON.stringify(batchBundle)
  });
  const responseBundle = await res.json();
  console.log('Batch completed, entries:', responseBundle.entry?.length);
  return responseBundle;
}

(async () => {
  console.log('=== Transaction Bundle ===');
  await executeTransaction();
  console.log('\n=== Batch Bundle ===');
  await executeBatch();
})().catch(console.error);
