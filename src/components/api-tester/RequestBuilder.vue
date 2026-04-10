<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps<{
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  urlPath: string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:method': [value: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH']
  'update:urlPath': [value: string]
  'send': []
}>()

const activeTab = ref<'headers' | 'body'>('headers')
const isBodyExpanded = ref(false)

const headers = ref([
  { key: 'Accept', value: 'application/fhir+json' },
  { key: 'Content-Type', value: 'application/fhir+json' }
])

const bodyContainer = ref<HTMLElement>()
let bodyEditor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  if (!bodyContainer.value) return
  bodyEditor = monaco.editor.create(bodyContainer.value, {
    value: '',
    language: 'json',
    theme: 'vs-dark',
    fontSize: 12,
    fontFamily: 'Fira Code, monospace',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    lineNumbers: 'on',
    wordWrap: 'on',
    padding: { top: 8 }
  })
})

onUnmounted(() => {
  bodyEditor?.dispose()
})

function getHeaders(): Record<string, string> {
  const result: Record<string, string> = {}
  headers.value.forEach(h => { if (h.key) result[h.key] = h.value })
  return result
}

function getBody(): string {
  return bodyEditor?.getValue() ?? ''
}

function setBody(val: string) {
  bodyEditor?.setValue(val)
}

function addHeader() {
  headers.value.push({ key: '', value: '' })
}

function removeHeader(idx: number) {
  headers.value.splice(idx, 1)
}

function methodClass(m: string) {
  const map: Record<string, string> = {
    GET: 'method-get', POST: 'method-post', PUT: 'method-put',
    DELETE: 'method-delete', PATCH: 'method-patch'
  }
  return map[m] ?? ''
}

defineExpose({ getHeaders, getBody, setBody, setTab: (t: 'headers' | 'body') => { activeTab.value = t } })
</script>

<template>
  <div class="request-builder">
    <!-- Request bar -->
    <div class="request-bar">
      <select
        :value="method"
        class="method-select"
        :class="methodClass(method)"
        @change="emit('update:method', ($event.target as HTMLSelectElement).value as typeof method)"
      >
        <option v-for="m in ['GET','POST','PUT','DELETE','PATCH']" :key="m" :value="m">{{ m }}</option>
      </select>
      <input
        :value="urlPath"
        class="url-input"
        placeholder="/Patient"
        @input="emit('update:urlPath', ($event.target as HTMLInputElement).value)"
        @keydown.enter="emit('send')"
      />
      <button
        class="send-btn"
        :disabled="loading"
        @click="emit('send')"
      >
        <span v-if="loading" class="spinner"></span>
        {{ loading ? '發送中...' : '發送' }}
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs-panel">
      <div class="tabs">
        <button
          class="tab"
          :class="{ active: activeTab === 'headers' }"
          @click="activeTab = 'headers'"
        >Headers ({{ headers.length }})</button>
        <button
          class="tab"
          :class="{ active: activeTab === 'body' }"
          @click="activeTab = 'body'"
        >Body</button>
        <button
          v-if="activeTab === 'body'"
          class="expand-btn"
          :title="isBodyExpanded ? '縮小' : '展開'"
          @click="isBodyExpanded = !isBodyExpanded"
        >{{ isBodyExpanded ? '⊟' : '⊞' }}</button>
      </div>
      <div class="tab-content">
        <div v-show="activeTab === 'headers'" class="headers-editor">
          <div v-for="(h, i) in headers" :key="i" class="header-row">
            <input v-model="h.key" class="h-input key" placeholder="Header name" />
            <input v-model="h.value" class="h-input val" placeholder="Header value" />
            <button class="remove-btn" @click="removeHeader(i)">×</button>
          </div>
          <button class="add-header-btn" @click="addHeader">+ 新增 Header</button>
        </div>
        <div v-show="activeTab === 'body'" class="body-editor" :class="{ expanded: isBodyExpanded }">
          <div ref="bodyContainer" class="body-monaco"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.request-builder { display: flex; flex-direction: column; gap: 6px; }
.request-bar { display: flex; gap: 6px; flex-shrink: 0; }
.method-select {
  width: 90px; flex-shrink: 0;
  background: var(--bg-panel); border: 1px solid var(--border-color);
  border-radius: 6px; font-size: 0.825rem; font-weight: 700;
  padding: 6px 8px; outline: none; cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
}
.method-get { color: #16a34a; } .method-post { color: #ea580c; }
.method-put { color: var(--color-primary); } .method-delete { color: var(--color-error); }
.method-patch { color: #9333ea; }
.url-input {
  flex: 1;
  background: var(--bg-panel); border: 1px solid var(--border-color);
  border-radius: 6px; color: var(--text-primary); font-size: 0.85rem;
  padding: 6px 12px; outline: none; font-family: 'Fira Code', monospace;
}
.url-input:focus { border-color: var(--border-subtle); }
.send-btn {
  padding: 6px 20px; background: var(--color-primary); color: #fff;
  border: none; border-radius: 6px; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: opacity 0.15s; display: flex;
  align-items: center; gap: 6px; white-space: nowrap;
}
.send-btn:hover:not(:disabled) { opacity: 0.85; }
.send-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner {
  width: 12px; height: 12px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.tabs-panel {
  background: var(--bg-deep);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-panel);
}
.tab {
  padding: 6px 14px; background: none; border: none; cursor: pointer;
  font-size: 0.78rem; color: var(--text-dim);
  border-bottom: 2px solid transparent; transition: all 0.15s;
}
.tab:hover { color: var(--text-primary); }
.tab.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
.tab-content { padding: 8px; min-height: 80px; }

.headers-editor { display: flex; flex-direction: column; gap: 5px; }
.header-row { display: flex; gap: 5px; align-items: center; }
.h-input {
  flex: 1; background: var(--bg-panel);
  border: 1px solid var(--border-color); border-radius: 5px;
  color: var(--text-secondary); font-size: 0.775rem; padding: 5px 8px;
  outline: none; font-family: 'Fira Code', monospace;
}
.h-input.key { flex: 0 0 170px; }
.h-input:focus { border-color: var(--border-subtle); }
.remove-btn {
  background: none; border: none; color: var(--text-muted);
  cursor: pointer; font-size: 1rem; padding: 0 4px; transition: color 0.15s;
}
.remove-btn:hover { color: var(--color-error); }
.add-header-btn {
  align-self: flex-start; background: none;
  border: 1px dashed var(--border-color); border-radius: 5px;
  color: var(--text-muted); font-size: 0.75rem; padding: 4px 10px;
  cursor: pointer; transition: all 0.15s;
}
.add-header-btn:hover { border-color: var(--border-subtle); color: var(--text-secondary); }
.body-editor { height: 120px; transition: height 0.2s ease; }
.body-editor.expanded { height: 360px; }
.body-monaco { height: 100%; }
.expand-btn {
  margin-left: auto; margin-right: 6px;
  background: none; border: none; cursor: pointer;
  color: var(--text-dim); font-size: 1rem; padding: 0 6px;
  transition: color 0.15s; line-height: 1;
}
.expand-btn:hover { color: var(--color-primary); }
</style>
