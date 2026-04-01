<script setup lang="ts">
import { ref } from 'vue'
import ServerSelector from './ServerSelector.vue'
import ApiPresets from './ApiPresets.vue'
import RequestBuilder from './RequestBuilder.vue'
import ResponseViewer from './ResponseViewer.vue'
import { useApiTester } from '@/composables/useApiTester'
import type { ApiPreset } from '@/types'

const { send, loading, lastResponse, history, clearHistory } = useApiTester()

const method = ref<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET')
const urlPath = ref('/metadata')
const historyOpen = ref(false)
const requestBuilderRef = ref<InstanceType<typeof RequestBuilder>>()

async function sendRequest() {
  if (!requestBuilderRef.value) return
  const headers = requestBuilderRef.value.getHeaders()
  const body = requestBuilderRef.value.getBody()
  await send({ method: method.value, url: urlPath.value, headers, body })
}

function applyPreset(preset: ApiPreset) {
  method.value = preset.method
  urlPath.value = preset.path
  if (preset.body && requestBuilderRef.value) {
    requestBuilderRef.value.setBody(preset.body)
    requestBuilderRef.value.setTab('body')
  } else if (requestBuilderRef.value) {
    requestBuilderRef.value.setBody('')
    requestBuilderRef.value.setTab('headers')
  }
}

function loadFromHistory(h: { method: 'GET'|'POST'|'PUT'|'DELETE'|'PATCH'; url: string; body: string }) {
  method.value = h.method
  urlPath.value = h.url
  requestBuilderRef.value?.setBody(h.body || '')
  historyOpen.value = false
}

function methodClass(m: string) {
  const map: Record<string, string> = {
    GET: 'method-get', POST: 'method-post', PUT: 'method-put',
    DELETE: 'method-delete', PATCH: 'method-patch'
  }
  return map[m] ?? ''
}
</script>

<template>
  <div class="api-tester">
    <!-- Server bar -->
    <ServerSelector />

    <div class="tester-body">
      <!-- Presets panel -->
      <ApiPresets @select="applyPreset" />

      <!-- Main panel -->
      <div class="main-panel">
        <RequestBuilder
          ref="requestBuilderRef"
          v-model:method="method"
          v-model:urlPath="urlPath"
          :loading="loading"
          @send="sendRequest"
        />

        <!-- History toggle -->
        <div class="history-bar">
          <button
            class="history-toggle"
            :class="{ active: historyOpen }"
            @click="historyOpen = !historyOpen"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            歷史紀錄 ({{ history.length }})
          </button>
          <button v-if="history.length > 0" class="clear-btn" @click="clearHistory">清除</button>
        </div>

        <!-- History drawer -->
        <div v-if="historyOpen" class="history-drawer">
          <div v-if="history.length === 0" class="empty-msg">尚無請求紀錄</div>
          <div
            v-for="h in history"
            :key="h.id"
            class="history-item"
            @click="loadFromHistory(h)"
          >
            <span class="h-method" :class="methodClass(h.method)">{{ h.method }}</span>
            <span class="h-url">{{ h.url }}</span>
            <span class="h-time">{{ new Date(h.timestamp).toLocaleTimeString() }}</span>
          </div>
        </div>

        <!-- Response -->
        <ResponseViewer :response="lastResponse" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.api-tester { display: flex; flex-direction: column; height: 100%; padding: 1rem; gap: 0.75rem; }
.tester-body { display: flex; gap: 0.75rem; flex: 1; min-height: 0; }
.main-panel { flex: 1; display: flex; flex-direction: column; gap: 0.6rem; min-width: 0; overflow: hidden; }

.history-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 0;
}
.history-toggle {
  display: flex; align-items: center; gap: 5px;
  background: none; border: 1px solid var(--border-color);
  border-radius: 5px; color: var(--text-dim); font-size: 0.75rem;
  padding: 4px 10px; cursor: pointer; transition: all 0.15s;
}
.history-toggle:hover, .history-toggle.active {
  border-color: var(--border-subtle); color: var(--text-primary);
}
.clear-btn {
  background: none; border: none; color: var(--text-muted);
  font-size: 0.75rem; cursor: pointer; padding: 3px 6px;
  transition: color 0.15s;
}
.clear-btn:hover { color: var(--color-error); }
.history-drawer {
  background: var(--bg-deep); border: 1px solid var(--border-color);
  border-radius: 6px; overflow-y: auto; max-height: 160px;
}
.empty-msg { padding: 1rem; text-align: center; font-size: 0.8rem; color: var(--text-muted); }
.history-item {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; cursor: pointer; border-bottom: 1px solid var(--border-color);
  transition: background 0.15s;
}
.history-item:hover { background: var(--bg-elevated); }
.history-item:last-child { border-bottom: none; }
.h-method {
  font-size: 0.62rem; font-weight: 700; padding: 1px 5px; border-radius: 3px;
  background: var(--bg-elevated); font-family: 'JetBrains Mono', monospace; flex-shrink: 0;
}
.method-get { color: #16a34a; } .method-post { color: #ea580c; }
.method-put { color: var(--color-primary); } .method-delete { color: var(--color-error); }
.method-patch { color: #9333ea; }
.h-url {
  flex: 1; font-size: 0.75rem; color: var(--text-dim);
  font-family: 'Fira Code', monospace; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
}
.h-time { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; }
</style>
