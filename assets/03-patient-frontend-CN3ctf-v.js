var e=`# 建立簡易病患查詢前端

學完 FHIR Resource 的建立與批次匯入後，本章節將帶你從頭打造一個可直接在瀏覽器運行的病患查詢介面，使用原生 JavaScript + Fetch API 對 HAPI FHIR 公開測試伺服器進行搜尋，並實作分頁功能。

---

## 7.3.1 搜尋 API 回顧

FHIR 搜尋回傳的結果是 \`type: "searchset"\` 的 Bundle：

\`\`\`json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 194,
  "link": [
    { "relation": "self",     "url": "https://hapi.fhir.org/baseR4/Patient?family=Smith&_count=10" },
    { "relation": "next",     "url": "https://hapi.fhir.org/baseR4?_getpages=abc123&_getpagesoffset=10&_count=10&_bundletype=searchset" },
    { "relation": "previous", "url": "https://hapi.fhir.org/baseR4?_getpages=abc123&_getpagesoffset=0&_count=10&_bundletype=searchset" }
  ],
  "entry": [
    {
      "search": { "mode": "match" },
      "resource": { "resourceType": "Patient", ... }
    }
  ]
}
\`\`\`

### Patient 常用搜尋參數

| 參數 | 範例 | 說明 |
|---|---|---|
| \`family\` | \`?family=陳\` | 姓氏（模糊比對）|
| \`given\` | \`?given=大明\` | 名字 |
| \`name\` | \`?name=陳\` | 任何姓名欄位 |
| \`birthdate\` | \`?birthdate=1980-06-15\` | 精確出生日期 |
| \`birthdate\` + 前綴 | \`?birthdate=ge1980-01-01\` | 支援 \`eq ne lt gt le ge\` |
| \`identifier\` | \`?identifier=MRN-123456\` | 識別碼（任何 system）|
| \`identifier\` + system | \`?identifier=http://hospital.org\\|MRN-001\` | 指定 system 的識別碼 |
| \`gender\` | \`?gender=male\` | 性別 |
| \`_count\` | \`?_count=10\` | 每頁筆數（預設約 20，最大 100）|

### 分頁的重要規則

> **永遠使用伺服器回傳的 \`Bundle.link\` URL，不要自行計算 offset。**

HAPI FHIR 的分頁 URL 包含內部 Token（如 \`_getpages=abc123\`），這些 Token 是伺服器快取的查詢結果指標，無法手動拼湊。

---

## 7.3.2 前端架構規劃

\`\`\`
病患查詢前端
├── 搜尋表單（姓名、出生日期、識別碼、每頁筆數）
├── 搜尋結果表格（ID、姓名、性別、出生日期、電話）
├── 分頁控制（第一頁 / 上一頁 / 下一頁 / 最後頁）
├── 狀態顯示（載入中、總筆數、錯誤訊息）
└── FHIR 工具函式（fetch、解析姓名/電話、HTML 轉義）
\`\`\`

---

## 7.3.3 完整程式碼

\`\`\`html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FHIR R4 病患查詢</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Noto Sans TC', Arial, sans-serif;
      background: #f0f4f8;
      padding: 20px;
      max-width: 1100px;
      margin: 0 auto;
      color: #2d3748;
    }
    h1 { color: #2b6cb0; border-bottom: 3px solid #3182ce; padding-bottom: 8px; }
    .server-info {
      background: #ebf8ff;
      border: 1px solid #90cdf4;
      border-radius: 6px;
      padding: 8px 14px;
      font-size: 0.85em;
      color: #2c5282;
      margin-bottom: 16px;
    }
    .search-form {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,.1);
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }
    .form-group label {
      display: block;
      font-size: 0.85em;
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 4px;
    }
    .form-group input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      font-size: 0.95em;
    }
    .form-group input:focus { outline: none; border-color: #3182ce; box-shadow: 0 0 0 2px #bee3f8; }
    .btn {
      padding: 9px 22px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95em;
      transition: background 0.15s;
    }
    .btn-primary { background: #3182ce; color: white; }
    .btn-primary:hover { background: #2b6cb0; }
    .btn-secondary { background: #e2e8f0; color: #4a5568; margin-left: 8px; }
    .btn-secondary:hover { background: #cbd5e0; }
    .btn:disabled { background: #a0aec0; cursor: not-allowed; }

    .status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      margin-bottom: 10px;
      font-size: 0.88em;
    }
    .loading { color: #3182ce; display: none; }
    .loading.visible { display: inline; }
    .error-msg {
      background: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 6px;
      padding: 12px 16px;
      color: #c53030;
      margin-bottom: 12px;
      display: none;
    }
    .error-msg.visible { display: block; }

    .results-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      display: none;
    }
    table.visible { display: table; }
    thead th {
      background: #2b6cb0;
      color: white;
      padding: 12px 14px;
      text-align: left;
      font-size: 0.88em;
      font-weight: 600;
    }
    tbody tr:nth-child(even) { background: #f7fafc; }
    tbody tr:hover { background: #ebf8ff; }
    td {
      padding: 10px 14px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 0.9em;
    }
    td code {
      background: #edf2f7;
      padding: 2px 5px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.85em;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.78em;
      font-weight: 600;
    }
    .badge-male { background: #bee3f8; color: #2c5282; }
    .badge-female { background: #fed7e2; color: #702459; }
    .badge-other { background: #e9d8fd; color: #553c9a; }
    .badge-unknown { background: #e2e8f0; color: #718096; }

    .pagination {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px;
      background: #f7fafc;
      border-top: 1px solid #e2e8f0;
    }
    .page-info { flex: 1; text-align: center; font-size: 0.88em; color: #718096; }
    .no-results {
      text-align: center;
      padding: 40px;
      color: #a0aec0;
      font-size: 1.1em;
    }
  </style>
</head>
<body>

<h1>FHIR R4 病患查詢介面</h1>

<div class="server-info">
  📡 資料來源：HAPI FHIR 公開測試伺服器 &mdash;
  <code>https://hapi.fhir.org/baseR4</code>
  （資料為測試用途，每月定期清除）
</div>

<!-- 搜尋表單 -->
<div class="search-form">
  <div class="form-grid">
    <div class="form-group">
      <label for="family">姓氏 (Family Name)</label>
      <input type="text" id="family" placeholder="例：Smith、陳">
    </div>
    <div class="form-group">
      <label for="given">名字 (Given Name)</label>
      <input type="text" id="given" placeholder="例：John、大明">
    </div>
    <div class="form-group">
      <label for="birthdate">出生日期</label>
      <input type="date" id="birthdate">
    </div>
    <div class="form-group">
      <label for="identifier">識別碼（病歷號等）</label>
      <input type="text" id="identifier" placeholder="例：MRN-123456">
    </div>
    <div class="form-group">
      <label for="count">每頁筆數</label>
      <input type="number" id="count" value="10" min="1" max="100">
    </div>
  </div>
  <div>
    <button class="btn btn-primary" onclick="searchPatients()">🔍 搜尋</button>
    <button class="btn btn-secondary" onclick="clearForm()">清除</button>
  </div>
</div>

<!-- 狀態列 -->
<div class="status-bar">
  <span id="resultInfo">輸入搜尋條件後按下「搜尋」</span>
  <span class="loading" id="loading">⏳ 搜尋中...</span>
</div>

<!-- 錯誤訊息 -->
<div class="error-msg" id="errorMsg"></div>

<!-- 搜尋結果 -->
<div class="results-card">
  <table id="resultsTable">
    <thead>
      <tr>
        <th>資源 ID</th>
        <th>姓名</th>
        <th>性別</th>
        <th>出生日期</th>
        <th>識別碼</th>
        <th>聯絡電話</th>
      </tr>
    </thead>
    <tbody id="resultsBody"></tbody>
  </table>
  <div class="no-results" id="noResults" style="display:none;">查無符合條件的病患</div>

  <!-- 分頁控制 -->
  <div class="pagination" id="paginationBar" style="display:none;">
    <button class="btn btn-secondary" id="btnFirst" onclick="goToPage('first')" disabled>⏮ 第一頁</button>
    <button class="btn btn-secondary" id="btnPrev"  onclick="goToPage('prev')"  disabled>◀ 上一頁</button>
    <span class="page-info" id="pageInfo"></span>
    <button class="btn btn-secondary" id="btnNext"  onclick="goToPage('next')"  disabled>下一頁 ▶</button>
    <button class="btn btn-secondary" id="btnLast"  onclick="goToPage('last')"  disabled>最後頁 ⏭</button>
  </div>
</div>

<script>
  const BASE_URL = 'https://hapi.fhir.org/baseR4';

  // 目前的 Bundle（保留 link 供分頁使用）
  let currentBundle = null;

  // ── 工具函式 ──────────────────────────────────────────────

  /** 防止 XSS：轉義 HTML 特殊字元 */
  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** 從 Patient resource 提取顯示姓名 */
  function getPatientName(patient) {
    if (!patient.name || patient.name.length === 0) return 'N/A';
    const n = patient.name[0];
    const given  = (n.given  || []).join(' ');
    const family = n.family || '';
    const text   = n.text   || '';
    return text || \`\${family} \${given}\`.trim() || 'N/A';
  }

  /** 從 Patient resource 提取電話號碼 */
  function getPhone(patient) {
    const tel = (patient.telecom || []).find(t => t.system === 'phone');
    return tel ? tel.value : 'N/A';
  }

  /** 從 Patient resource 提取識別碼 */
  function getIdentifier(patient) {
    if (!patient.identifier || patient.identifier.length === 0) return 'N/A';
    return patient.identifier[0].value || 'N/A';
  }

  /** 性別 Badge HTML */
  function genderBadge(gender) {
    const map = {
      male:    ['male',    '男性'],
      female:  ['female',  '女性'],
      other:   ['other',   '其他'],
      unknown: ['unknown', '未知']
    };
    const [cls, label] = map[gender] || ['unknown', gender || 'N/A'];
    return \`<span class="badge badge-\${cls}">\${esc(label)}</span>\`;
  }

  /** 從 Bundle.link 陣列取得指定 relation 的 URL */
  function getBundleLink(bundle, relation) {
    if (!bundle?.link) return null;
    const alt = relation === 'prev' ? 'previous' : null;
    const link = bundle.link.find(l => l.relation === relation || l.relation === alt);
    return link?.url ?? null;
  }

  // ── UI 狀態管理 ───────────────────────────────────────────

  function setLoading(on) {
    document.getElementById('loading').classList.toggle('visible', on);
  }

  function showError(msg) {
    const el = document.getElementById('errorMsg');
    el.textContent = msg;
    el.classList.toggle('visible', !!msg);
  }

  function updatePagination() {
    const bar = document.getElementById('paginationBar');
    if (!currentBundle) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';

    document.getElementById('btnFirst').disabled = !getBundleLink(currentBundle, 'first');
    document.getElementById('btnPrev').disabled  = !getBundleLink(currentBundle, 'prev');
    document.getElementById('btnNext').disabled  = !getBundleLink(currentBundle, 'next');
    document.getElementById('btnLast').disabled  = !getBundleLink(currentBundle, 'last');

    const total    = currentBundle.total;
    const entries  = (currentBundle.entry || []).filter(e => e.search?.mode !== 'include').length;
    const selfLink = getBundleLink(currentBundle, 'self') || '';
    const offsetMatch = selfLink.match(/_getpagesoffset=(\\d+)/);
    const offset   = offsetMatch ? parseInt(offsetMatch[1]) : 0;
    const count    = parseInt(new URLSearchParams(selfLink.split('?')[1] || '').get('_count') || entries);

    const from = offset + 1;
    const to   = offset + entries;
    document.getElementById('pageInfo').textContent =
      total !== undefined
        ? \`顯示第 \${from}–\${to} 筆，共 \${total} 筆\`
        : \`顯示 \${entries} 筆\`;
  }

  // ── 資料渲染 ──────────────────────────────────────────────

  function renderResults(bundle) {
    const tbody    = document.getElementById('resultsBody');
    const table    = document.getElementById('resultsTable');
    const noResult = document.getElementById('noResults');
    const infoEl   = document.getElementById('resultInfo');

    tbody.innerHTML = '';

    const entries = (bundle.entry || []).filter(
      e => e.resource?.resourceType === 'Patient' && e.search?.mode !== 'include'
    );
    const total = bundle.total;

    infoEl.textContent = total !== undefined
      ? \`共找到 \${total} 筆病患記錄\`
      : \`本頁找到 \${entries.length} 筆記錄\`;

    if (entries.length === 0) {
      table.classList.remove('visible');
      noResult.style.display = 'block';
      return;
    }

    noResult.style.display = 'none';
    table.classList.add('visible');

    entries.forEach(entry => {
      const p = entry.resource;
      const tr = document.createElement('tr');
      tr.innerHTML = \`
        <td><code>\${esc(p.id || 'N/A')}</code></td>
        <td>\${esc(getPatientName(p))}</td>
        <td>\${genderBadge(p.gender)}</td>
        <td>\${esc(p.birthDate || 'N/A')}</td>
        <td>\${esc(getIdentifier(p))}</td>
        <td>\${esc(getPhone(p))}</td>
      \`;
      tbody.appendChild(tr);
    });
  }

  // ── FHIR Fetch ────────────────────────────────────────────

  async function fetchFhirBundle(url) {
    setLoading(true);
    showError('');

    try {
      const resp = await fetch(url, {
        headers: {
          'Accept': 'application/fhir+json',
          'Cache-Control': 'no-cache'
        }
      });

      let body;
      try { body = await resp.json(); } catch { throw new Error('伺服器回應非 JSON 格式'); }

      // 處理 FHIR OperationOutcome 錯誤
      if (!resp.ok) {
        if (body?.resourceType === 'OperationOutcome') {
          const msgs = (body.issue || [])
            .map(i => i.diagnostics || i.details?.text || i.code)
            .filter(Boolean)
            .join('；');
          throw new Error(msgs || \`HTTP \${resp.status}\`);
        }
        throw new Error(\`HTTP \${resp.status}：\${resp.statusText}\`);
      }

      if (body.resourceType !== 'Bundle') {
        throw new Error(\`預期收到 Bundle，實際收到 \${body.resourceType}\`);
      }

      return body;

    } finally {
      setLoading(false);
    }
  }

  // ── 搜尋入口 ─────────────────────────────────────────────

  async function searchPatients() {
    const family     = document.getElementById('family').value.trim();
    const given      = document.getElementById('given').value.trim();
    const birthdate  = document.getElementById('birthdate').value.trim();
    const identifier = document.getElementById('identifier').value.trim();
    const count      = document.getElementById('count').value.trim() || '10';

    if (!family && !given && !birthdate && !identifier) {
      showError('請至少輸入一個搜尋條件，避免下載所有病患資料。');
      return;
    }

    const params = new URLSearchParams();
    if (family)     params.append('family', family);
    if (given)      params.append('given', given);
    if (birthdate)  params.append('birthdate', birthdate);
    if (identifier) params.append('identifier', identifier);
    params.append('_count', count);

    const url = \`\${BASE_URL}/Patient?\${params.toString()}\`;

    try {
      currentBundle = await fetchFhirBundle(url);
      renderResults(currentBundle);
      updatePagination();
    } catch (err) {
      showError(\`搜尋失敗：\${err.message}\`);
    }
  }

  // ── 分頁導航 ─────────────────────────────────────────────

  async function goToPage(relation) {
    const url = getBundleLink(currentBundle, relation);
    if (!url) return;

    try {
      currentBundle = await fetchFhirBundle(url);
      renderResults(currentBundle);
      updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showError(\`載入頁面失敗：\${err.message}\`);
    }
  }

  // ── 清除表單 ─────────────────────────────────────────────

  function clearForm() {
    ['family', 'given', 'birthdate', 'identifier'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('count').value = '10';
    showError('');
    currentBundle = null;
    document.getElementById('resultsTable').classList.remove('visible');
    document.getElementById('noResults').style.display = 'none';
    document.getElementById('paginationBar').style.display = 'none';
    document.getElementById('resultInfo').textContent = '輸入搜尋條件後按下「搜尋」';
  }

  // 支援 Enter 鍵觸發搜尋
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchPatients();
  });
<\/script>

</body>
</html>
\`\`\`

---

## 7.3.4 程式碼重點解析

### 1. 防止 XSS 的 \`esc()\` 函式

任何顯示到 HTML 的資料都必須經過轉義，防止惡意 Resource 資料造成 XSS 攻擊：

\`\`\`javascript
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
\`\`\`

### 2. 正確處理 OperationOutcome 錯誤

FHIR 伺服器在發生錯誤時，回傳的 body 是 \`OperationOutcome\` 資源而非純文字：

\`\`\`javascript
if (body?.resourceType === 'OperationOutcome') {
  const msgs = (body.issue || [])
    .map(i => i.diagnostics || i.details?.text || i.code)
    .filter(Boolean)
    .join('；');
  throw new Error(msgs || \`HTTP \${resp.status}\`);
}
\`\`\`

### 3. 使用伺服器提供的分頁 URL

\`\`\`javascript
// ✅ 正確：使用 Bundle.link 中的 URL
const nextUrl = getBundleLink(currentBundle, 'next');

// ❌ 錯誤：手動計算 offset（HAPI 的分頁 URL 包含內部 Token）
const nextUrl = \`\${BASE_URL}/Patient?_count=10&_offset=\${offset + 10}\`;
\`\`\`

### 4. 過濾 \`_include\` 的結果

搜尋結果 Bundle 可能包含透過 \`_include\`/\`_revinclude\` 加入的關聯 Resource，\`search.mode\` 欄位可幫助區分：

| \`search.mode\` | 說明 |
|---|---|
| \`match\` | 主要搜尋結果 |
| \`include\` | 透過 \`_include\` 附帶的 Resource |
| \`outcome\` | OperationOutcome 訊息 |

\`\`\`javascript
// 只保留主要搜尋結果
const entries = (bundle.entry || []).filter(
  e => e.resource?.resourceType === 'Patient' && e.search?.mode !== 'include'
);
\`\`\`

### 5. 強制加上搜尋條件限制

\`\`\`javascript
if (!family && !given && !birthdate && !identifier) {
  showError('請至少輸入一個搜尋條件');
  return;
}
\`\`\`

不加任何條件的搜尋（\`GET /Patient\`）可能回傳數千筆資料，造成瀏覽器卡頓或超出記憶體限制。

---

## 7.3.5 延伸功能建議

在完成基礎功能後，可嘗試加入以下進階功能：

### 點擊病患 ID 查看詳情

\`\`\`javascript
tr.style.cursor = 'pointer';
tr.addEventListener('click', () => {
  window.open(\`https://hapi.fhir.org/baseR4/Patient/\${p.id}?_format=json\`, '_blank');
});
\`\`\`

### 查詢病患的就診紀錄

\`\`\`javascript
async function showEncounters(patientId) {
  const url = \`\${BASE_URL}/Encounter?subject=Patient/\${patientId}&_count=10\`;
  const bundle = await fetchFhirBundle(url);
  // 顯示 bundle.entry 中的 Encounter 資源...
}
\`\`\`

### 加入 \`$everything\` 操作

\`\`\`javascript
async function getEverything(patientId) {
  const url = \`\${BASE_URL}/Patient/\${patientId}/$everything\`;
  const bundle = await fetchFhirBundle(url);
  // bundle 包含該病患的所有相關 Resource
  const types = [...new Set((bundle.entry || []).map(e => e.resource?.resourceType))];
  console.log('包含的 Resource 類型：', types);
}
\`\`\`

---

## 7.3.6 實作練習

1. 將完整 HTML 存成 \`patient-search.html\`，直接用瀏覽器開啟
2. 搜尋 \`family=Smith\`，觀察 Bundle 結構與分頁連結
3. 開啟瀏覽器開發者工具的 Network 頁籤，觀察點擊「下一頁」時實際發送的 URL
4. 試著在搜尋前不輸入任何條件，觀察錯誤提示
5. **進階：** 在表格右側新增「查看就診」按鈕，點擊後查詢該病患的 Encounter 列表

> **思考題：** 如果需要支援離線模式（當 HAPI 伺服器不可用時），應該如何設計 fallback 機制？
`;export{e as default};