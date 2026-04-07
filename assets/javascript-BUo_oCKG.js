var e=`"use strict";
// 使用 JavaScript Fetch API 建立 FHIR R4 Patient 資源
const BASE_URL = 'https://hapi.fhir.org/baseR4';
const patient = {
    resourceType: 'Patient',
    text: {
        status: 'generated',
        div: '<div xmlns="http://www.w3.org/1999/xhtml">王大明</div>'
    },
    identifier: [
        {
            use: 'official',
            system: 'https://www.nhi.gov.tw',
            value: 'A123456789'
        }
    ],
    name: [
        {
            use: 'official',
            text: '王大明',
            family: '王',
            given: ['大明']
        }
    ],
    telecom: [
        { system: 'phone', value: '0912345678', use: 'mobile' }
    ],
    gender: 'male',
    birthDate: '1985-03-15',
    address: [
        {
            use: 'home',
            city: '台北市',
            country: 'TW'
        }
    ]
};
async function createPatient() {
    const response = await fetch(\`\${BASE_URL}/Patient\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/fhir+json',
            'Accept': 'application/fhir+json'
        },
        body: JSON.stringify(patient)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(\`FHIR Error: \${JSON.stringify(error)}\`);
    }
    const created = await response.json();
    console.log('Patient created, ID:', created.id);
    console.log('Version:', created.meta?.versionId);
    return created;
}
// 讀取剛建立的病患
async function getPatient(id) {
    const response = await fetch(\`\${BASE_URL}/Patient/\${id}\`, {
        headers: { 'Accept': 'application/fhir+json' }
    });
    return response.json();
}
// 執行
createPatient()
    .then(p => getPatient(p.id))
    .then(p => console.log('Patient:', p.name?.[0]?.text))
    .catch(console.error);
`;export{e as default};