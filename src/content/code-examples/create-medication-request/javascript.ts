// 使用 JavaScript Fetch API 建立 FHIR R4 MedicationRequest 資源
const BASE_URL = 'https://hapi.fhir.org/baseR4';

const headers = {
  'Content-Type': 'application/fhir+json',
  'Accept': 'application/fhir+json'
};

const medicationRequest = {
  resourceType: 'MedicationRequest',
  status: 'active',
  intent: 'order',
  medicationCodeableConcept: {
    coding: [{
      system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
      code: '29046',
      display: 'Lisinopril'
    }],
    text: '血管收縮素轉化酶抑制劑（高血壓用藥）'
  },
  subject: { reference: 'Patient/P001', display: '王大明' },
  encounter: { reference: 'Encounter/E001' },
  authoredOn: new Date().toISOString(),
  requester: { reference: 'Practitioner/DR001', display: '李醫師' },
  dosageInstruction: [{
    text: '每日一次，每次10mg，口服',
    timing: {
      repeat: { frequency: 1, period: 1, periodUnit: 'd' }
    },
    route: {
      coding: [{ system: 'http://snomed.info/sct', code: '26643006', display: 'Oral route' }],
      text: '口服'
    },
    doseAndRate: [{
      doseQuantity: { value: 10, unit: 'mg', system: 'http://unitsofmeasure.org', code: 'mg' }
    }]
  }],
  dispenseRequest: {
    quantity: { value: 30, unit: '錠', system: 'http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm', code: 'TAB' },
    expectedSupplyDuration: { value: 30, unit: 'days', system: 'http://unitsofmeasure.org', code: 'd' }
  }
};

async function createMedicationRequest() {
  const res = await fetch(`${BASE_URL}/MedicationRequest`, {
    method: 'POST', headers, body: JSON.stringify(medicationRequest)
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const result = await res.json();
  console.log('Created MedicationRequest ID:', result.id);
  return result.id as string;
}

async function searchActiveMedications(patientId: string) {
  const res = await fetch(
    `${BASE_URL}/MedicationRequest?subject=Patient/${patientId}&status=active`,
    { headers: { Accept: 'application/fhir+json' } }
  );
  const bundle = await res.json();
  console.log('Active medications:', bundle.total);
}

(async () => {
  await createMedicationRequest();
  await searchActiveMedications('P001');
})().catch(console.error);
