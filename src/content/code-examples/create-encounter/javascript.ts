// 使用 JavaScript Fetch API 建立 FHIR R4 Encounter 資源
const BASE_URL = 'https://hapi.fhir.org/baseR4';

const headers = {
  'Content-Type': 'application/fhir+json',
  'Accept': 'application/fhir+json'
};

const encounter = {
  resourceType: 'Encounter',
  status: 'finished',
  class: {
    system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    code: 'AMB',
    display: '門診'
  },
  type: [{
    coding: [{
      system: 'http://snomed.info/sct',
      code: '11429006',
      display: 'Consultation'
    }],
    text: '一般門診'
  }],
  subject: { reference: 'Patient/P001', display: '王大明' },
  participant: [{
    type: [{
      coding: [{
        system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
        code: 'ATND',
        display: 'attender'
      }]
    }],
    individual: { reference: 'Practitioner/DR001', display: '李醫師' }
  }],
  period: {
    start: '2024-01-20T09:00:00+08:00',
    end: '2024-01-20T09:30:00+08:00'
  },
  reasonCode: [{
    coding: [{
      system: 'http://snomed.info/sct',
      code: '38341003',
      display: 'Hypertension'
    }],
    text: '高血壓追蹤'
  }]
};

async function createEncounter() {
  const res = await fetch(`${BASE_URL}/Encounter`, {
    method: 'POST', headers, body: JSON.stringify(encounter)
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const result = await res.json();
  console.log('Created Encounter ID:', result.id);
  return result.id as string;
}

async function searchEncounters(patientId: string) {
  const res = await fetch(
    `${BASE_URL}/Encounter?subject=Patient/${patientId}&status=finished&_sort=-date`,
    { headers: { Accept: 'application/fhir+json' } }
  );
  const bundle = await res.json();
  console.log('Found encounters:', bundle.total);
}

(async () => {
  await createEncounter();
  await searchEncounters('P001');
})().catch(console.error);
