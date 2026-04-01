<script setup lang="ts">
import { ref } from 'vue'
import JsonEditor from '@/components/editor/JsonEditor.vue'
import ValidationPanel from '@/components/editor/ValidationPanel.vue'
import ResourceTemplates from '@/components/editor/ResourceTemplates.vue'
import { useFhirValidation } from '@/composables/useFhirValidation'

// Import template JSONs directly (Vite handles JSON imports natively)
import patientJson from '@/content/templates/patient.json'
import observationJson from '@/content/templates/observation.json'
import encounterJson from '@/content/templates/encounter.json'
import conditionJson from '@/content/templates/condition.json'
import medicationRequestJson from '@/content/templates/medication-request.json'
import bundleJson from '@/content/templates/bundle-transaction.json'

const templates: Record<string, object> = {
  Patient: patientJson,
  Observation: observationJson,
  Encounter: encounterJson,
  Condition: conditionJson,
  MedicationRequest: medicationRequestJson,
  Bundle: bundleJson
}

const templateNames = Object.keys(templates)
const selectedTemplate = ref('Patient')
const editorValue = ref(JSON.stringify(templates.Patient, null, 2))
const { validate, result } = useFhirValidation()
const validating = ref(false)

let debounceTimer: ReturnType<typeof setTimeout>

function onEditorChange(value: string) {
  clearTimeout(debounceTimer)
  validating.value = true
  debounceTimer = setTimeout(() => {
    validate(value)
    validating.value = false
  }, 500)
}

function selectTemplate(name: string) {
  selectedTemplate.value = name
  editorValue.value = JSON.stringify(templates[name], null, 2)
  validate(editorValue.value)
}

// Initial validation
validate(editorValue.value)
</script>

<template>
  <div class="editor-view">
    <!-- Toolbar -->
    <div class="editor-toolbar">
      <h2 class="toolbar-title">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        FHIR JSON 編輯器 / 驗證器
      </h2>
      <ResourceTemplates
        :templates="templateNames"
        :selected="selectedTemplate"
        @select="selectTemplate"
      />
    </div>

    <!-- Body -->
    <div class="editor-body">
      <!-- Left: Editor -->
      <div class="editor-panel">
        <div class="panel-header">
          <span>JSON 編輯區</span>
          <span class="hint">輸入後 0.5s 自動驗證</span>
        </div>
        <JsonEditor
          v-model="editorValue"
          language="json"
          @change="onEditorChange"
        />
      </div>

      <!-- Right: Validation -->
      <div class="validation-wrapper">
        <ValidationPanel :result="result" :loading="validating" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.25rem;
  gap: 1rem;
}
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}
.toolbar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
  white-space: nowrap;
}
.editor-body {
  display: flex;
  gap: 1rem;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}
.editor-panel {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  min-width: 0;
}
.panel-header {
  padding: 8px 12px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}
.hint { font-size: 0.7rem; color: var(--text-muted); }
.validation-wrapper {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
