<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as monaco from 'monaco-editor'
import { useFhirValidation } from '@/composables/useFhirValidation'

// FHIR JSON templates
const templates: Record<string, object> = {
  Patient: {
    resourceType: 'Patient',
    id: 'tw-patient-001',
    meta: { profile: ['https://twcore.mohw.gov.tw/ig/twcore/StructureDefinition/Patient-twcore'] },
    text: { status: 'generated', div: '<div xmlns="http://www.w3.org/1999/xhtml">王大明</div>' },
    identifier: [{ use: 'official', system: 'https://www.nhi.gov.tw', value: 'A123456789' }],
    name: [{ use: 'official', text: '王大明', family: '王', given: ['大明'] }],
    telecom: [{ system: 'phone', value: '0912345678', use: 'mobile' }],
    gender: 'male',
    birthDate: '1985-03-15',
    address: [{ use: 'home', line: ['台北市信義路五段7號'], city: '台北市', postalCode: '110', country: 'TW' }]
  },
  Observation: {
    resourceType: 'Observation',
    id: 'tw-obs-bp-001',
    status: 'final',
    category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', display: 'Vital Signs' }] }],
    code: { coding: [{ system: 'http://loinc.org', code: '55284-4', display: 'Blood pressure systolic and diastolic' }], text: '血壓' },
    subject: { reference: 'Patient/tw-patient-001', display: '王大明' },
    effectiveDateTime: '2024-01-15T09:30:00+08:00',
    component: [
      { code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }] }, valueQuantity: { value: 120, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' } },
      { code: { coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }] }, valueQuantity: { value: 80, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' } }
    ]
  },
  Encounter: {
    resourceType: 'Encounter',
    id: 'tw-enc-001',
    status: 'finished',
    class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'AMB', display: '門診' },
    type: [{ coding: [{ system: 'http://snomed.info/sct', code: '11429006', display: 'Consultation' }], text: '一般門診' }],
    subject: { reference: 'Patient/tw-patient-001', display: '王大明' },
    period: { start: '2024-01-15T09:00:00+08:00', end: '2024-01-15T10:00:00+08:00' },
    reasonCode: [{ coding: [{ system: 'http://snomed.info/sct', code: '38341003', display: 'Hypertension' }], text: '高血壓追蹤' }]
  },
  Condition: {
    resourceType: 'Condition',
    id: 'tw-cond-001',
    clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active', display: 'Active' }] },
    verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed', display: 'Confirmed' }] },
    severity: { coding: [{ system: 'http://snomed.info/sct', code: '6736007', display: 'Moderate' }] },
    code: { coding: [{ system: 'http://snomed.info/sct', code: '38341003', display: 'Hypertension' }, { system: 'http://hl7.org/fhir/sid/icd-10', code: 'I10', display: 'Essential (primary) hypertension' }], text: '高血壓' },
    subject: { reference: 'Patient/tw-patient-001' },
    onsetDateTime: '2020-06-01'
  },
  MedicationRequest: {
    resourceType: 'MedicationRequest',
    id: 'tw-med-001',
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: { coding: [{ system: 'https://www.nhi.gov.tw/drugcode', code: 'AC37100100', display: 'Amlodipine 5mg Tab' }], text: 'Amlodipine 5mg 錠' },
    subject: { reference: 'Patient/tw-patient-001' },
    authoredOn: '2024-01-15',
    requester: { reference: 'Practitioner/doctor-001', display: '李醫師' },
    dosageInstruction: [{ text: '每天一次，每次一顆，口服', timing: { repeat: { frequency: 1, period: 1, periodUnit: 'd' } }, route: { coding: [{ system: 'http://snomed.info/sct', code: '26643006', display: 'Oral Route' }] }, doseAndRate: [{ doseQuantity: { value: 1, unit: '顆' } }] }],
    dispenseRequest: { quantity: { value: 30, unit: '顆' } }
  },
  Bundle: {
    resourceType: 'Bundle',
    id: 'tw-bundle-001',
    type: 'transaction',
    entry: [
      { fullUrl: 'urn:uuid:patient-001', resource: { resourceType: 'Patient', name: [{ family: '陳', given: ['小華'] }], gender: 'female', birthDate: '1990-07-20' }, request: { method: 'POST', url: 'Patient' } },
      { fullUrl: 'urn:uuid:condition-001', resource: { resourceType: 'Condition', clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] }, code: { coding: [{ system: 'http://snomed.info/sct', code: '73211009', display: 'Diabetes mellitus' }] }, subject: { reference: 'urn:uuid:patient-001' } }, request: { method: 'POST', url: 'Condition' } }
    ]
  }
}

const selectedTemplate = ref('Patient')
const { validate, result } = useFhirValidation()
const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let debounceTimer: ReturnType<typeof setTimeout>

function loadTemplate(name: string) {
  selectedTemplate.value = name
  editor?.setValue(JSON.stringify(templates[name], null, 2))
}

function onContentChange(value: string) {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => validate(value), 500)
}

onMounted(() => {
  if (!editorContainer.value) return
  editor = monaco.editor.create(editorContainer.value, {
    value: JSON.stringify(templates.Patient, null, 2),
    language: 'json',
    theme: 'vs-dark',
    fontSize: 13,
    fontFamily: 'Fira Code, monospace',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    wordWrap: 'on',
    automaticLayout: true,
    padding: { top: 12, bottom: 12 }
  })
  editor.onDidChangeModelContent(() => {
    onContentChange(editor!.getValue())
  })
  validate(editor.getValue())
})

onUnmounted(() => {
  editor?.dispose()
})
</script>

<template>
  <div class="editor-view">
    <div class="editor-toolbar">
      <h2 class="toolbar-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        FHIR JSON 編輯器 / 驗證器
      </h2>
      <div class="template-selector">
        <label class="selector-label">載入範本：</label>
        <div class="template-btns">
          <button
            v-for="name in Object.keys(templates)"
            :key="name"
            class="template-btn"
            :class="{ active: selectedTemplate === name }"
            @click="loadTemplate(name)"
          >{{ name }}</button>
        </div>
      </div>
    </div>

    <div class="editor-body">
      <div class="editor-panel">
        <div class="panel-header">
          <span>JSON 編輯區</span>
          <span class="hint">輸入後 0.5s 自動驗證</span>
        </div>
        <div ref="editorContainer" class="monaco-container"></div>
      </div>

      <div class="validation-panel">
        <div class="panel-header">
          <span>驗證結果</span>
          <span
            class="validation-badge"
            :class="result.valid ? 'valid' : 'invalid'"
          >
            {{ result.valid ? '✅ 通過' : `❌ ${result.errors.length} 個錯誤` }}
          </span>
        </div>
        <div class="validation-content">
          <div v-if="result.valid && result.warnings.length === 0" class="valid-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>JSON 格式正確，符合 FHIR R4 基本規範</span>
          </div>

          <div v-if="result.errors.length > 0" class="errors-section">
            <div class="section-title error">錯誤</div>
            <div v-for="(err, i) in result.errors" :key="i" class="error-item">
              <span class="err-path">{{ err.path || 'root' }}</span>
              <span class="err-msg">{{ err.message }}</span>
            </div>
          </div>

          <div v-if="result.warnings.length > 0" class="warnings-section">
            <div class="section-title warning">建議</div>
            <div v-for="(w, i) in result.warnings" :key="i" class="warning-item">
              <span class="warn-path">{{ w.path }}</span>
              <span class="warn-msg">{{ w.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-view { display: flex; flex-direction: column; height: 100%; padding: 1.25rem; gap: 1rem; }
.editor-toolbar { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; flex-shrink: 0; }
.toolbar-title { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 600; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; margin: 0; white-space: nowrap; }
.template-selector { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.selector-label { font-size: 0.8rem; color: #64748b; white-space: nowrap; }
.template-btns { display: flex; gap: 4px; flex-wrap: wrap; }
.template-btn { padding: 4px 12px; border-radius: 6px; border: 1px solid #1e293b; background: #13131a; color: #64748b; font-size: 0.775rem; cursor: pointer; transition: all 0.15s; font-family: 'JetBrains Mono', monospace; }
.template-btn:hover { color: #e2e8f0; border-color: #334155; }
.template-btn.active { color: #3b82f6; border-color: #1d4ed8; background: rgba(59,130,246,0.08); }

.editor-body { display: flex; gap: 1rem; flex: 1; overflow: hidden; min-height: 0; }
.editor-panel { flex: 1.5; display: flex; flex-direction: column; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; min-width: 0; }
.validation-panel { width: 320px; flex-shrink: 0; display: flex; flex-direction: column; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; }
.panel-header { padding: 8px 12px; background: #13131a; border-bottom: 1px solid #1e293b; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; flex-shrink: 0; }
.hint { font-size: 0.7rem; color: #475569; }
.validation-badge { font-size: 0.75rem; font-weight: 600; font-family: 'JetBrains Mono', monospace; }
.validation-badge.valid { color: #4ade80; }
.validation-badge.invalid { color: #f87171; }
.monaco-container { flex: 1; min-height: 0; }
.validation-content { flex: 1; overflow-y: auto; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.75rem; }
.valid-message { display: flex; align-items: center; gap: 8px; color: #4ade80; font-size: 0.825rem; padding: 1rem; background: rgba(34,197,94,0.06); border-radius: 6px; border: 1px solid rgba(34,197,94,0.15); }
.section-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.4rem; }
.section-title.error { color: #f87171; }
.section-title.warning { color: #fbbf24; }
.error-item, .warning-item { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.15); border-radius: 6px; padding: 6px 10px; margin-bottom: 4px; }
.warning-item { background: rgba(234,179,8,0.05); border-color: rgba(234,179,8,0.15); }
.err-path, .warn-path { display: block; font-family: 'Fira Code', monospace; font-size: 0.75rem; color: #f87171; margin-bottom: 2px; }
.warn-path { color: #fbbf24; }
.err-msg, .warn-msg { display: block; font-size: 0.775rem; color: #94a3b8; }
</style>
