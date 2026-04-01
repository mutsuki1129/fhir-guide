export const apiPresets = [
    {
        id: 'get-metadata',
        label: 'GET /metadata',
        method: 'GET',
        path: '/metadata',
        description: '取得伺服器能力聲明（CapabilityStatement）'
    },
    {
        id: 'get-patients',
        label: 'GET /Patient',
        method: 'GET',
        path: '/Patient',
        description: '查詢所有病患（預設回傳前 20 筆）'
    },
    {
        id: 'get-patient-by-id',
        label: 'GET /Patient/{id}',
        method: 'GET',
        path: '/Patient/example',
        description: '查詢單一病患（請替換 example 為實際 ID）'
    },
    {
        id: 'post-patient',
        label: 'POST /Patient',
        method: 'POST',
        path: '/Patient',
        body: JSON.stringify({
            resourceType: 'Patient',
            id: 'example-tw',
            meta: { versionId: '1' },
            text: {
                status: 'generated',
                div: '<div xmlns="http://www.w3.org/1999/xhtml">王大明</div>'
            },
            identifier: [{ system: 'https://www.nhi.gov.tw', value: 'A123456789' }],
            name: [{ use: 'official', text: '王大明', family: '王', given: ['大明'] }],
            gender: 'male',
            birthDate: '1985-03-15',
            address: [{ use: 'home', city: '台北市', country: 'TW' }]
        }, null, 2),
        description: '建立新病患資源'
    },
    {
        id: 'get-observations',
        label: 'GET /Observation?patient={id}',
        method: 'GET',
        path: '/Observation?patient=example',
        description: '查詢病患的觀察紀錄（血壓、體重等）'
    },
    {
        id: 'search-patient-name',
        label: 'GET /Patient?name=王',
        method: 'GET',
        path: '/Patient?name=王',
        description: '依姓名搜尋病患'
    },
    {
        id: 'get-encounters',
        label: 'GET /Encounter?patient={id}',
        method: 'GET',
        path: '/Encounter?patient=example',
        description: '查詢病患的就診紀錄'
    },
    {
        id: 'get-conditions',
        label: 'GET /Condition?patient={id}',
        method: 'GET',
        path: '/Condition?patient=example',
        description: '查詢病患的診斷條件'
    },
    {
        id: 'get-everything',
        label: 'GET /Patient/{id}/$everything',
        method: 'GET',
        path: '/Patient/example/$everything',
        description: '取得病患所有相關資源（$everything operation）'
    },
    {
        id: 'post-bundle',
        label: 'POST / (Bundle Transaction)',
        method: 'POST',
        path: '/',
        body: JSON.stringify({
            resourceType: 'Bundle',
            type: 'transaction',
            entry: [
                {
                    fullUrl: 'urn:uuid:patient-001',
                    resource: {
                        resourceType: 'Patient',
                        name: [{ family: '李', given: ['小華'] }],
                        gender: 'female',
                        birthDate: '1990-07-20'
                    },
                    request: { method: 'POST', url: 'Patient' }
                }
            ]
        }, null, 2),
        description: '使用 Bundle Transaction 批次操作'
    }
];
