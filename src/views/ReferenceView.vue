<script setup lang="ts">
import { ref } from 'vue'

const sections = [
  {
    id: 'resources',
    title: 'Core Resources',
    items: [
      { name: 'Patient', desc: '病患人口學資料', emoji: '👤', required: ['resourceType', 'id'], key: ['name', 'gender', 'birthDate', 'identifier', 'telecom', 'address'] },
      { name: 'Observation', desc: '臨床觀察（生命徵象、檢驗值）', emoji: '📊', required: ['resourceType', 'status', 'code'], key: ['subject', 'effectiveDateTime', 'valueQuantity', 'component'] },
      { name: 'Encounter', desc: '就診紀錄（門診、急診、住院）', emoji: '🏥', required: ['resourceType', 'status', 'class'], key: ['subject', 'period', 'reasonCode', 'participant'] },
      { name: 'Condition', desc: '診斷條件、疾病、症狀', emoji: '🩺', required: ['resourceType', 'subject'], key: ['clinicalStatus', 'verificationStatus', 'code', 'severity', 'onsetDateTime'] },
      { name: 'MedicationRequest', desc: '用藥醫囑', emoji: '💊', required: ['resourceType', 'status', 'intent', 'subject'], key: ['medicationCodeableConcept', 'dosageInstruction', 'dispenseRequest'] },
      { name: 'Bundle', desc: '多資源容器（Transaction/Batch/Document）', emoji: '📦', required: ['resourceType', 'type'], key: ['entry', 'total', 'link'] },
      { name: 'Practitioner', desc: '醫療人員（醫師、護理師等）', emoji: '👨‍⚕️', required: ['resourceType'], key: ['identifier', 'name', 'qualification', 'telecom'] },
      { name: 'Organization', desc: '醫療機構、部門', emoji: '🏨', required: ['resourceType'], key: ['identifier', 'name', 'type', 'telecom', 'address'] },
      { name: 'DiagnosticReport', desc: '診斷報告（影像報告、病理報告）', emoji: '📋', required: ['resourceType', 'status', 'code'], key: ['subject', 'issued', 'result', 'conclusion'] },
      { name: 'Immunization', desc: '疫苗接種紀錄', emoji: '💉', required: ['resourceType', 'status', 'vaccineCode', 'patient', 'occurrenceDateTime'], key: ['doseQuantity', 'performer', 'lotNumber'] },
    ]
  },
  {
    id: 'search',
    title: '搜尋參數',
    params: [
      { param: '_id', type: 'token', desc: 'Resource 的邏輯 ID', example: '/Patient?_id=123' },
      { param: '_lastUpdated', type: 'date', desc: '最後更新時間', example: '/Patient?_lastUpdated=gt2024-01-01' },
      { param: '_count', type: 'number', desc: '每頁回傳筆數', example: '/Patient?_count=20' },
      { param: '_offset', type: 'number', desc: '跳過前 N 筆', example: '/Patient?_offset=20&_count=20' },
      { param: '_sort', type: 'string', desc: '排序欄位（-前置表降序）', example: '/Patient?_sort=-_lastUpdated' },
      { param: '_include', type: 'string', desc: '同時取得相關 Resource', example: '/Encounter?_include=Encounter:patient' },
      { param: '_revinclude', type: 'string', desc: '反向取得引用此資源的 Resource', example: '/Patient?_revinclude=Observation:patient' },
      { param: '_summary', type: 'token', desc: '回傳摘要（true/false/count）', example: '/Patient?_summary=count' },
      { param: 'name', type: 'string', desc: 'Patient 姓名', example: '/Patient?name=王大明' },
      { param: 'identifier', type: 'token', desc: '識別碼（如身份證）', example: '/Patient?identifier=A123456789' },
      { param: 'birthdate', type: 'date', desc: 'Patient 生日', example: '/Patient?birthdate=1985-03-15' },
      { param: 'gender', type: 'token', desc: 'Patient 性別', example: '/Patient?gender=male' },
      { param: 'patient', type: 'reference', desc: '關聯的 Patient', example: '/Observation?patient=Patient/123' },
      { param: 'code', type: 'token', desc: '編碼（如 LOINC）', example: '/Observation?code=8480-6' },
      { param: 'date', type: 'date', desc: '觀察/就診日期', example: '/Observation?date=ge2024-01-01' },
      { param: 'status', type: 'token', desc: '狀態', example: '/Encounter?status=finished' },
    ]
  },
  {
    id: 'operations',
    title: 'Operations',
    ops: [
      { name: '$validate', scope: 'type/instance', desc: '驗證 Resource 是否符合規範', example: 'POST /Patient/$validate' },
      { name: '$everything', scope: 'instance', desc: '取得病患所有相關資源', example: 'GET /Patient/{id}/$everything' },
      { name: '$expand', scope: 'type/instance', desc: '展開 ValueSet 的所有值', example: 'GET /ValueSet/{id}/$expand' },
      { name: '$lookup', scope: 'type', desc: '查詢 CodeSystem 中的特定編碼', example: 'GET /CodeSystem/$lookup?system=http://loinc.org&code=8480-6' },
      { name: '$translate', scope: 'type', desc: '概念對應（術語轉換）', example: 'POST /ConceptMap/$translate' },
      { name: '$match', scope: 'type', desc: '病患匹配（重複資料偵測）', example: 'POST /Patient/$match' },
      { name: '$document', scope: 'instance', desc: '將 Composition 轉換為 Document Bundle', example: 'POST /Composition/{id}/$document' },
    ]
  },
  {
    id: 'terminology',
    title: '術語系統速查',
    systems: [
      { name: 'LOINC', url: 'http://loinc.org', usage: '檢驗項目、生命徵象、文件類型', example: '8480-6（收縮壓）、18723-7（血液學報告）' },
      { name: 'SNOMED CT', url: 'http://snomed.info/sct', usage: '臨床術語（診斷、程序、身體部位）', example: '38341003（高血壓）、73211009（糖尿病）' },
      { name: 'ICD-10', url: 'http://hl7.org/fhir/sid/icd-10', usage: '疾病診斷分類', example: 'I10（高血壓）、E11（第2型糖尿病）' },
      { name: 'RxNorm', url: 'http://www.nlm.nih.gov/research/umls/rxnorm', usage: '藥品（美國）', example: '308460（Amlodipine 5mg）' },
      { name: '健保藥品碼', url: 'https://www.nhi.gov.tw/drugcode', usage: '台灣健保藥品', example: 'AC37100100（Amlodipine 5mg Tab）' },
      { name: 'ATC', url: 'http://www.whocc.no/atc', usage: 'WHO 藥品解剖治療化學分類', example: 'C08CA01（Amlodipine）' },
      { name: 'ICD-10-PCS', url: 'http://www.icd10data.com/icd10pcs', usage: '手術及處置編碼', example: '0RG10J0（頸椎融合術）' },
      { name: '健保處置碼', url: 'https://www.nhi.gov.tw', usage: '台灣健保醫療處置碼', example: '28001C（全血計數）' },
    ]
  }
]

const activeSection = ref('resources')
</script>

<template>
  <div class="reference-view">
    <div class="ref-header">
      <h1 class="ref-title">FHIR R4 快速參考</h1>
      <p class="ref-desc">Core Resources、搜尋參數、Operations 與術語系統一覽</p>
    </div>

    <div class="ref-nav">
      <button
        v-for="s in sections"
        :key="s.id"
        class="ref-nav-btn"
        :class="{ active: activeSection === s.id }"
        @click="activeSection = s.id"
      >{{ s.title }}</button>
    </div>

    <!-- Resources -->
    <div v-if="activeSection === 'resources'" class="section-content">
      <div class="resource-grid">
        <div v-for="res in sections[0].items" :key="res.name" class="resource-card">
          <div class="res-header">
            <span class="res-emoji">{{ res.emoji }}</span>
            <span class="res-name">{{ res.name }}</span>
          </div>
          <p class="res-desc">{{ res.desc }}</p>
          <div class="res-fields">
            <div class="field-group">
              <span class="field-label required">必要欄位</span>
              <div class="field-tags">
                <span v-for="f in res.required.slice(1)" :key="f" class="field-tag req">{{ f }}</span>
              </div>
            </div>
            <div class="field-group">
              <span class="field-label">核心欄位</span>
              <div class="field-tags">
                <span v-for="f in res.key" :key="f" class="field-tag">{{ f }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search params -->
    <div v-if="activeSection === 'search'" class="section-content">
      <table class="ref-table">
        <thead>
          <tr>
            <th>參數</th>
            <th>型別</th>
            <th>說明</th>
            <th>範例</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in sections[1].params" :key="p.param">
            <td><code>{{ p.param }}</code></td>
            <td><span class="type-badge">{{ p.type }}</span></td>
            <td>{{ p.desc }}</td>
            <td><code class="example-code">{{ p.example }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Operations -->
    <div v-if="activeSection === 'operations'" class="section-content">
      <div class="ops-list">
        <div v-for="op in sections[2].ops" :key="op.name" class="op-card">
          <div class="op-header">
            <span class="op-name">{{ op.name }}</span>
            <span class="op-scope">{{ op.scope }}</span>
          </div>
          <p class="op-desc">{{ op.desc }}</p>
          <code class="op-example">{{ op.example }}</code>
        </div>
      </div>
    </div>

    <!-- Terminology -->
    <div v-if="activeSection === 'terminology'" class="section-content">
      <div class="term-list">
        <div v-for="sys in sections[3].systems" :key="sys.name" class="term-card">
          <div class="term-header">
            <span class="term-name">{{ sys.name }}</span>
          </div>
          <code class="term-url">{{ sys.url }}</code>
          <p class="term-usage">{{ sys.usage }}</p>
          <p class="term-example"><span class="example-label">例：</span>{{ sys.example }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reference-view { max-width: 1000px; margin: 0 auto; padding: 2rem 2.5rem; }
.ref-header { margin-bottom: 1.5rem; }
.ref-title { font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; color: var(--text-primary); margin: 0 0 0.5rem; }
.ref-desc { font-size: 0.875rem; color: var(--text-dim); margin: 0; }

.ref-nav { display: flex; gap: 4px; margin-bottom: 1.5rem; background: var(--bg-deep); border: 1px solid var(--border-color); border-radius: 8px; padding: 4px; width: fit-content; }
.ref-nav-btn { padding: 6px 14px; border-radius: 6px; border: none; background: none; color: var(--text-dim); font-size: 0.8rem; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
.ref-nav-btn:hover { color: var(--text-primary); }
.ref-nav-btn.active { background: var(--border-color); color: var(--text-primary); }

.section-content {}
.resource-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.resource-card { background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem; }
.res-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.res-emoji { font-size: 1.1rem; }
.res-name { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; font-weight: 700; color: #60a5fa; }
.res-desc { font-size: 0.8rem; color: var(--text-dim); margin: 0 0 0.75rem; }
.res-fields { display: flex; flex-direction: column; gap: 6px; }
.field-group { display: flex; align-items: flex-start; gap: 8px; }
.field-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600; white-space: nowrap; padding-top: 2px; min-width: 52px; }
.field-label.required { color: #f87171; }
.field-tags { display: flex; flex-wrap: wrap; gap: 3px; }
.field-tag { background: var(--border-color); color: var(--text-dim); font-size: 0.7rem; padding: 1px 6px; border-radius: 3px; font-family: 'Fira Code', monospace; }
.field-tag.req { background: rgba(239,68,68,0.08); color: #f87171; border: 1px solid rgba(239,68,68,0.15); }

.ref-table { width: 100%; border-collapse: collapse; font-size: 0.825rem; }
.ref-table th { background: var(--bg-panel); color: var(--text-secondary); padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border-color); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.ref-table td { padding: 9px 12px; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); vertical-align: top; }
.ref-table tr:hover td { background: var(--bg-elevated); }
.ref-table code:not(.example-code) { font-family: 'Fira Code', monospace; font-size: 0.8rem; background: var(--border-color); padding: 1px 5px; border-radius: 3px; color: var(--ref-param-color, #7dd3fc); }
.example-code { font-family: 'Fira Code', monospace; font-size: 0.75rem; color: var(--ref-example-color, #7dd3fc); background: var(--border-color); padding: 1px 5px; border-radius: 3px; }

.type-badge { background: rgba(59,130,246,0.1); color: #60a5fa; font-size: 0.7rem; padding: 1px 6px; border-radius: 3px; font-family: 'JetBrains Mono', monospace; }

.ops-list { display: flex; flex-direction: column; gap: 10px; }
.op-card { background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; }
.op-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.op-name { font-family: 'Fira Code', monospace; font-size: 0.9rem; font-weight: 600; color: #c084fc; }
.op-scope { background: rgba(192,132,252,0.08); color: #c084fc; font-size: 0.7rem; padding: 1px 7px; border-radius: 3px; border: 1px solid rgba(192,132,252,0.2); }
.op-desc { font-size: 0.825rem; color: var(--text-dim); margin: 0 0 8px; }
.op-example { display: block; font-family: 'Fira Code', monospace; font-size: 0.8rem; color: var(--ref-op-example-color, #7dd3fc); background: var(--bg-deep); padding: 6px 10px; border-radius: 5px; }

.term-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.term-card { background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; }
.term-header { margin-bottom: 4px; }
.term-name { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; font-weight: 700; color: var(--ref-term-name-color, #4ade80); }
.term-url { display: block; font-size: 0.72rem; color: #60a5fa; font-family: 'Fira Code', monospace; margin-bottom: 6px; word-break: break-all; }
.term-usage { font-size: 0.8rem; color: var(--text-dim); margin: 0 0 4px; }
.term-example { font-size: 0.775rem; color: var(--text-muted); margin: 0; }
.example-label { color: var(--border-subtle); }
</style>
