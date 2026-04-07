var e=`// 連接 Foundry 上啟動的 FHIR Server 並執行基本操作
// 預設使用 FHIR Candle（本地 Foundry 部署）
const FHIR_BASE = 'http://localhost:8080/fhir/r4';

// 1. 取得伺服器能力聲明
async function getCapabilityStatement() {
  const res = await fetch(\`\${FHIR_BASE}/metadata\`, {
    headers: { 'Accept': 'application/fhir+json' }
  });
  const cs = await res.json();
  console.log(\`Server: \${cs.software?.name} v\${cs.software?.version}\`);
  console.log(\`FHIR Version: \${cs.fhirVersion}\`);
  return cs;
}

// 2. 建立 Patient
async function createPatient() {
  const patient = {
    resourceType: 'Patient',
    name: [{ family: '王', given: ['小明'], use: 'official' }],
    gender: 'male',
    birthDate: '1990-05-15',
    identifier: [{ system: 'http://example.org/mrn', value: 'MRN-001' }]
  };

  const res = await fetch(\`\${FHIR_BASE}/Patient\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json'
    },
    body: JSON.stringify(patient)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(\`FHIR Error: \${JSON.stringify(err.issue?.[0]?.diagnostics)}\`);
  }

  const created = await res.json();
  console.log(\`Created Patient ID: \${created.id}\`);
  return created;
}

// 3. 依姓名搜尋 Patient
async function searchPatients(family: string) {
  const res = await fetch(\`\${FHIR_BASE}/Patient?family=\${encodeURIComponent(family)}\`, {
    headers: { 'Accept': 'application/fhir+json' }
  });
  const bundle = await res.json();
  console.log(\`Found \${bundle.total} patients with family name "\${family}"\`);
  return bundle;
}

// 4. 建立 Observation（血壓）
async function createBloodPressure(patientId: string) {
  const obs = {
    resourceType: 'Observation',
    status: 'final',
    code: {
      coding: [{
        system: 'http://loinc.org',
        code: '55284-4',
        display: 'Blood pressure systolic and diastolic'
      }]
    },
    subject: { reference: \`Patient/\${patientId}\` },
    effectiveDateTime: new Date().toISOString(),
    component: [
      {
        code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }] },
        valueQuantity: { value: 120, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
      },
      {
        code: { coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }] },
        valueQuantity: { value: 80, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
      }
    ]
  };

  const res = await fetch(\`\${FHIR_BASE}/Observation\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json'
    },
    body: JSON.stringify(obs)
  });

  const created = await res.json();
  console.log(\`Created Observation ID: \${created.id}\`);
  return created;
}

// 5. 驗證 Resource
async function validatePatient(patient: object) {
  const res = await fetch(\`\${FHIR_BASE}/Patient/$validate\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      'Accept': 'application/fhir+json'
    },
    body: JSON.stringify(patient)
  });

  const result = await res.json();
  const errors = result.issue?.filter((i: any) => i.severity === 'error') ?? [];
  if (errors.length === 0) {
    console.log('✅ Validation passed');
  } else {
    console.log(\`❌ Validation errors: \${errors.map((e: any) => e.diagnostics).join(', ')}\`);
  }
  return result;
}

// 執行範例
async function main() {
  await getCapabilityStatement();

  const patient = await createPatient();
  await createBloodPressure(patient.id);

  await searchPatients('王');

  await validatePatient({
    resourceType: 'Patient',
    gender: 'male',
    birthDate: '1990-05-15',
    name: [{ family: '王', use: 'official' }]
  });
}

main().catch(console.error);
`;export{e as default};