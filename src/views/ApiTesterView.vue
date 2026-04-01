<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as monaco from 'monaco-editor'
import { useApiTester } from '@/composables/useApiTester'
import { useSettingsStore } from '@/stores/settings'
import { apiPresets } from '@/data/api-presets'
import type { ApiPreset } from '@/types'

const settings = useSettingsStore()
const { send, loading, lastResponse, history, clearHistory } = useApiTester()

const method = ref<'GET'|'POST'|'PUT'|'DELETE'|'PATCH'>('GET')
const urlPath = ref('/metadata')
const activeTab = ref<'body'|'headers'|'history'>('headers')
const responseTab = ref<'body'|'headers'>('body')
const customServerInput = ref('')

const servers = [
  { label: 'HAPI FHIR Public (R4)', url: 'https://hapi.fhir.org/baseR4' },
  { label: 'Local Docker HAPI', url: 'http://localhost:8080/fhir' },
]

const bodyEditorContainer = ref<HTMLElement>()
let bodyEditor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  if (!bodyEditorContainer.value) return
  bodyEditor = monaco.editor.create(bodyEditorContainer.value, {
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

const defaultHeaders = ref([
  { key: 'Accept', value: 'application/fhir+json' },
  { key: 'Content-Type', value: 'application/fhir+json' }
])

function applyPreset(preset: ApiPreset) {
  method.value = preset.method
  urlPath.value = preset.path
  if (preset.body) {
    bodyEditor?.setValue(preset.body)
    activeTab.value = 'body'
  } else {
    bodyEditor?.setValue('')
    activeTab.value = 'headers'
  }
}

async function sendRequest() {
  const headers: Record<string, string> = {}
  defaultHeaders.value.forEach(h => { if (h.key) headers[h.key] = h.value })

  const body = ['POST', 'PUT', 'PATCH'].includes(method.value) ? (bodyEditor?.getValue() ?? '') : ''

  await send({
    method: method.value,
    url: urlPath.value,
    headers,
    body
  })
  responseTab.value = 'body'
}

function statusClass(status: number) {
  if (status === 0) return 'status-error'
  if (status < 300) return 'status-ok'
  if (status < 400) return 'status-redirect'
  return 'status-error'
}

function methodClass(m: string) {
  const map: Record<string, string> = { GET: 'method-get', POST: 'method-post', PUT: 'method-put', DELETE: 'method-delete', PATCH: 'method-patch' }
  return map[m] ?? ''
}

function setServer(url: string) {
  settings.setServer(url)
}

function loadHistory(h: { method: 'GET'|'POST'|'PUT'|'DELETE'|'PATCH'; url: string; body: string }) {
  method.value = h.method
  urlPath.value = h.url.replace(settings.currentServer, '') || h.url
  const ed = bodyEditor as monaco.editor.IStandaloneCodeEditor | null
  ed?.setValue(h.body || '')
}

function applyCustomServer() {
  if (customServerInput.value.trim()) {
    settings.setServer(customServerInput.value.trim())
  }
}
</script>

<template>
  <div class="api-tester">
    <!-- Server bar -->
    <div class="server-bar">
      <span class="server-label">FHIR Server：</span>
      <div class="server-btns">
        <button
          v-for="s in servers"
          :key="s.url"
          class="server-btn"
          :class="{ active: settings.currentServer === s.url }"
          @click="setServer(s.url)"
        >{{ s.label }}</button>
      </div>
      <div class="custom-server">
        <input
          v-model="customServerInput"
          class="server-input"
          placeholder="自訂 URL（如 http://localhost:8080/fhir）"
          @keydown.enter="applyCustomServer"
        />
        <button class="apply-btn" @click="applyCustomServer">套用</button>
      </div>
      <div class="current-server">
        <span class="current-url">{{ settings.currentServer }}</span>
      </div>
    </div>

    <div class="tester-body">
      <!-- Preset panel -->
      <div class="preset-panel">
        <div class="preset-header">快速範例</div>
        <div class="preset-list">
          <button
            v-for="p in apiPresets"
            :key="p.id"
            class="preset-item"
            @click="applyPreset(p)"
          >
            <span class="preset-method" :class="methodClass(p.method)">{{ p.method }}</span>
            <div class="preset-info">
              <span class="preset-path">{{ p.path }}</span>
              <span class="preset-desc">{{ p.description }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Main panel -->
      <div class="main-panel">
        <!-- Request bar -->
        <div class="request-bar">
          <select v-model="method" class="method-select" :class="methodClass(method)">
            <option v-for="m in ['GET','POST','PUT','DELETE','PATCH']" :key="m" :value="m">{{ m }}</option>
          </select>
          <input v-model="urlPath" class="url-input" placeholder="/Patient" @keydown.enter="sendRequest" />
          <button class="send-btn" :disabled="loading" @click="sendRequest">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '發送中...' : '發送' }}
          </button>
        </div>

        <!-- Request tabs -->
        <div class="tabs-area">
          <div class="tabs">
            <button class="tab" :class="{active: activeTab==='headers'}" @click="activeTab='headers'">Headers</button>
            <button class="tab" :class="{active: activeTab==='body'}" @click="activeTab='body'">Body</button>
            <button class="tab" :class="{active: activeTab==='history'}" @click="activeTab='history'">歷史紀錄 ({{ history.length }})</button>
          </div>
          <div class="tab-content">
            <div v-show="activeTab==='headers'" class="headers-table">
              <div v-for="(h, i) in defaultHeaders" :key="i" class="header-row">
                <input v-model="h.key" class="header-input key" placeholder="Header Key" />
                <input v-model="h.value" class="header-input value" placeholder="Header Value" />
              </div>
            </div>
            <div v-show="activeTab==='body'" class="body-editor">
              <div ref="bodyEditorContainer" class="monaco-small"></div>
            </div>
            <div v-show="activeTab==='history'" class="history-panel">
              <div class="history-actions">
                <button class="clear-btn" @click="clearHistory">清除歷史</button>
              </div>
              <div v-if="history.length === 0" class="empty-msg">尚無請求紀錄</div>
              <div v-for="h in history" :key="h.id" class="history-item" @click="loadHistory(h)">
                <span class="preset-method" :class="methodClass(h.method)">{{ h.method }}</span>
                <span class="history-url">{{ h.url }}</span>
                <span class="history-time">{{ new Date(h.timestamp).toLocaleTimeString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Response panel -->
        <div class="response-panel" v-if="lastResponse">
          <div class="response-header">
            <span class="section-title">回應</span>
            <span class="status-badge" :class="statusClass(lastResponse.status)">
              {{ lastResponse.status }} {{ lastResponse.statusText }}
            </span>
            <span class="duration-badge">{{ lastResponse.duration }}ms</span>
            <div class="res-tabs">
              <button class="tab" :class="{active: responseTab==='body'}" @click="responseTab='body'">Body</button>
              <button class="tab" :class="{active: responseTab==='headers'}" @click="responseTab='headers'">Headers</button>
            </div>
          </div>
          <div class="response-body" v-show="responseTab==='body'">
            <pre class="response-pre">{{ lastResponse.body }}</pre>
          </div>
          <div class="response-headers" v-show="responseTab==='headers'">
            <div v-for="(v, k) in lastResponse.headers" :key="k" class="resp-header-row">
              <span class="resp-header-key">{{ k }}</span>
              <span class="resp-header-val">{{ v }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-response">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <p>尚未發送請求。選擇左側範例或自行輸入 URL，按下「發送」開始測試。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.api-tester { display: flex; flex-direction: column; height: 100%; padding: 1rem; gap: 0.75rem; }
.server-bar { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 8px; flex-wrap: wrap; flex-shrink: 0; }
.server-label { font-size: 0.775rem; color: var(--text-dim); white-space: nowrap; }
.server-btns { display: flex; gap: 4px; }
.server-btn { padding: 4px 10px; border-radius: 5px; border: 1px solid var(--border-color); background: none; color: var(--text-dim); font-size: 0.75rem; cursor: pointer; transition: all 0.15s; }
.server-btn:hover { color: var(--text-primary); border-color: var(--border-subtle); }
.server-btn.active { color: var(--color-primary); border-color: var(--color-primary); background: rgba(59,130,246,0.08); }
.custom-server { display: flex; gap: 4px; }
.server-input { background: var(--bg-deep); border: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.75rem; padding: 4px 8px; border-radius: 5px; width: 240px; outline: none; }
.server-input:focus { border-color: var(--border-subtle); }
.apply-btn { padding: 4px 10px; border-radius: 5px; border: 1px solid var(--border-color); background: var(--border-color); color: var(--text-secondary); font-size: 0.75rem; cursor: pointer; transition: all 0.15s; }
.apply-btn:hover { color: var(--text-primary); }
.current-url { font-size: 0.7rem; color: var(--text-muted); font-family: 'Fira Code', monospace; }

.tester-body { display: flex; gap: 0.75rem; flex: 1; min-height: 0; }
.preset-panel { width: 240px; flex-shrink: 0; background: var(--bg-deep); border: 1px solid var(--border-color); border-radius: 8px; overflow-y: auto; }
.preset-header { padding: 8px 12px; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; border-bottom: 1px solid var(--border-color); }
.preset-item { width: 100%; background: none; border: none; border-bottom: 1px solid var(--border-color); padding: 8px 10px; text-align: left; cursor: pointer; display: flex; align-items: flex-start; gap: 6px; transition: background 0.15s; }
.preset-item:hover { background: var(--bg-elevated); }
.preset-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.preset-path { font-size: 0.75rem; color: var(--text-secondary); font-family: 'Fira Code', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.preset-desc { font-size: 0.7rem; color: var(--text-muted); }

.main-panel { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; min-width: 0; }
.request-bar { display: flex; gap: 6px; flex-shrink: 0; }
.method-select { width: 90px; flex-shrink: 0; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 6px; font-size: 0.825rem; font-weight: 700; padding: 6px 8px; outline: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; }
.method-get { color: #16a34a; } .method-post { color: #ea580c; } .method-put { color: var(--color-primary); } .method-delete { color: var(--color-error); } .method-patch { color: #9333ea; }
.url-input { flex: 1; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); font-size: 0.85rem; padding: 6px 12px; outline: none; font-family: 'Fira Code', monospace; }
.url-input:focus { border-color: var(--border-subtle); }
.send-btn { padding: 6px 20px; background: var(--color-primary); color: #fff; border: none; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.send-btn:hover:not(:disabled) { opacity: 0.85; }
.send-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner { width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.tabs-area { background: var(--bg-deep); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; flex-shrink: 0; }
.tabs { display: flex; border-bottom: 1px solid var(--border-color); background: var(--bg-panel); }
.tab { padding: 6px 14px; background: none; border: none; cursor: pointer; font-size: 0.8rem; color: var(--text-dim); border-bottom: 2px solid transparent; transition: all 0.15s; }
.tab:hover { color: var(--text-primary); }
.tab.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
.tab-content { padding: 8px; min-height: 80px; }
.headers-table { display: flex; flex-direction: column; gap: 4px; }
.header-row { display: flex; gap: 6px; }
.header-input { flex: 1; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 5px; color: var(--text-secondary); font-size: 0.775rem; padding: 5px 8px; outline: none; font-family: 'Fira Code', monospace; }
.header-input.key { flex: 0 0 180px; }
.body-editor { height: 120px; }
.monaco-small { height: 100%; }
.history-panel { max-height: 200px; overflow-y: auto; }
.history-actions { padding: 4px 0; display: flex; justify-content: flex-end; }
.clear-btn { background: none; border: none; color: var(--text-dim); font-size: 0.75rem; cursor: pointer; padding: 3px 8px; transition: color 0.15s; }
.clear-btn:hover { color: var(--color-error); }
.history-item { display: flex; align-items: center; gap: 8px; padding: 5px 8px; cursor: pointer; border-radius: 4px; transition: background 0.15s; }
.history-item:hover { background: var(--bg-elevated); }
.history-url { flex: 1; font-size: 0.75rem; color: var(--text-dim); font-family: 'Fira Code', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.history-time { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; }
.empty-msg { font-size: 0.8rem; color: var(--text-muted); padding: 1rem; text-align: center; }

.preset-method { font-size: 0.65rem; font-weight: 700; padding: 1px 5px; border-radius: 3px; background: var(--bg-elevated); font-family: 'JetBrains Mono', monospace; flex-shrink: 0; }

.response-panel { flex: 1; min-height: 0; background: var(--bg-deep); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; }
.response-header { padding: 8px 12px; background: var(--bg-panel); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.section-title { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
.status-badge { font-size: 0.8rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; }
.status-ok { background: rgba(34,197,94,0.1); color: #16a34a; }
.status-error { background: rgba(239,68,68,0.1); color: var(--color-error); }
.status-redirect { background: rgba(234,179,8,0.1); color: var(--color-warning); }
.duration-badge { font-size: 0.75rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
.res-tabs { display: flex; margin-left: auto; }
.response-body, .response-headers { flex: 1; overflow-y: auto; padding: 1rem; }
.response-pre { font-family: 'Fira Code', monospace; font-size: 0.8rem; color: var(--text-secondary); white-space: pre-wrap; word-break: break-all; margin: 0; line-height: 1.6; }
.resp-header-row { display: flex; gap: 8px; padding: 4px 0; border-bottom: 1px solid var(--border-color); }
.resp-header-key { font-family: 'Fira Code', monospace; font-size: 0.775rem; color: var(--color-primary); min-width: 200px; }
.resp-header-val { font-family: 'Fira Code', monospace; font-size: 0.775rem; color: var(--text-secondary); word-break: break-all; }
.empty-response { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 3rem; color: var(--text-muted); font-size: 0.85rem; text-align: center; background: var(--bg-deep); border: 1px solid var(--border-color); border-radius: 8px; flex: 1; }
</style>
