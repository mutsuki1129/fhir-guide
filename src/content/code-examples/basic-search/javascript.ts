// 使用 JavaScript Fetch API 執行 FHIR R4 基本搜尋
const BASE_URL = 'https://hapi.fhir.org/baseR4';

const accept = { Accept: 'application/fhir+json' };

// 基本搜尋：依姓名
async function searchByName(name: string) {
  const res = await fetch(
    `${BASE_URL}/Patient?name=${encodeURIComponent(name)}&_count=10`,
    { headers: accept }
  );
  const bundle = await res.json();
  console.log(`Found ${bundle.total} patients named "${name}"`);
  bundle.entry?.forEach((e: any) => {
    const p = e.resource;
    console.log(` - ${p.name?.[0]?.text} (${p.gender}, born ${p.birthDate})`);
  });
  return bundle;
}

// 組合搜尋：姓名 + 性別
async function searchByNameAndGender(name: string, gender: string) {
  const params = new URLSearchParams({ name, gender, _count: '10' });
  const res = await fetch(`${BASE_URL}/Patient?${params}`, { headers: accept });
  const bundle = await res.json();
  console.log(`Combined search: ${bundle.total} results`);
  return bundle;
}

// 日期範圍搜尋：特定年份的觀察
async function searchObservationsByDate(patientId: string, from: string, to: string) {
  const params = new URLSearchParams({
    subject: `Patient/${patientId}`,
    date: [`ge${from}`, `le${to}`].join('&date='),
    _sort: '-date',
    _count: '20'
  });
  const url = `${BASE_URL}/Observation?subject=Patient/${patientId}&date=ge${from}&date=le${to}&_sort=-date`;
  const res = await fetch(url, { headers: accept });
  const bundle = await res.json();
  console.log(`Observations between ${from} and ${to}: ${bundle.total}`);
  return bundle;
}

// 搜尋活躍病情
async function searchActiveConditions(patientId: string) {
  const res = await fetch(
    `${BASE_URL}/Condition?subject=Patient/${patientId}&clinical-status=active&_sort=-recorded-date`,
    { headers: accept }
  );
  const bundle = await res.json();
  console.log(`Active conditions: ${bundle.total}`);
  return bundle;
}

(async () => {
  await searchByName('王');
  await searchByNameAndGender('王', 'male');
  await searchObservationsByDate('P001', '2024-01-01', '2024-12-31');
  await searchActiveConditions('P001');
})().catch(console.error);
