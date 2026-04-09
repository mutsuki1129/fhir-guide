// 使用 JavaScript Fetch API 執行 FHIR $everything 操作
const BASE_URL = 'https://hapi.fhir.org/baseR4';

const accept = { Accept: 'application/fhir+json' };

// 取得病患的所有相關資源
async function getPatientEverything(patientId: string) {
  const res = await fetch(
    `${BASE_URL}/Patient/${patientId}/$everything?_count=50`,
    { headers: accept }
  );
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const bundle = await res.json();

  console.log(`Patient $everything for ${patientId}:`);
  console.log(`  Total resources: ${bundle.total ?? bundle.entry?.length ?? 0}`);

  // 按資源類型分組統計
  const byType: Record<string, number> = {};
  bundle.entry?.forEach((e: any) => {
    const type = e.resource?.resourceType ?? 'Unknown';
    byType[type] = (byType[type] ?? 0) + 1;
  });

  Object.entries(byType).sort().forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  return bundle;
}

// 帶日期範圍的 $everything
async function getPatientEverythingInRange(
  patientId: string,
  start: string,
  end: string
) {
  const url = `${BASE_URL}/Patient/${patientId}/$everything?start=${start}&end=${end}`;
  const res = await fetch(url, { headers: accept });
  const bundle = await res.json();
  console.log(`Resources between ${start} and ${end}: ${bundle.entry?.length ?? 0}`);
  return bundle;
}

// 處理分頁（$everything 可能回傳多頁）
async function getAllPages(firstBundle: any): Promise<any[]> {
  const allEntries = [...(firstBundle.entry ?? [])];
  let next = firstBundle.link?.find((l: any) => l.relation === 'next')?.url;

  while (next) {
    const res = await fetch(next, { headers: accept });
    const bundle = await res.json();
    allEntries.push(...(bundle.entry ?? []));
    next = bundle.link?.find((l: any) => l.relation === 'next')?.url;
  }

  console.log(`Total entries across all pages: ${allEntries.length}`);
  return allEntries;
}

(async () => {
  const bundle = await getPatientEverything('P001');
  await getPatientEverythingInRange('P001', '2024-01-01', '2024-12-31');
  await getAllPages(bundle);
})().catch(console.error);
