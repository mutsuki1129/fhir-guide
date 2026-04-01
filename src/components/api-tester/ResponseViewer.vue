<script setup lang="ts">
import { ref } from 'vue'
import type { ApiResponse } from '@/types'

defineProps<{
  response: ApiResponse | null
  loading?: boolean
}>()

const activeTab = ref<'body' | 'headers'>('body')

function statusClass(status: number) {
  if (status === 0) return 'status-error'
  if (status < 300) return 'status-ok'
  if (status < 400) return 'status-redirect'
  return 'status-error'
}
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="response-loading">
    <div class="spinner"></div>
    <span>發送中...</span>
  </div>

  <!-- Response -->
  <div v-else-if="response" class="response-viewer">
    <div class="response-header">
      <span class="resp-label">回應</span>
      <span class="status-badge" :class="statusClass(response.status)">
        {{ response.status }} {{ response.statusText }}
      </span>
      <span class="duration-badge">{{ response.duration }}ms</span>
      <div class="resp-tabs">
        <button
          class="rtab"
          :class="{ active: activeTab === 'body' }"
          @click="activeTab = 'body'"
        >Body</button>
        <button
          class="rtab"
          :class="{ active: activeTab === 'headers' }"
          @click="activeTab = 'headers'"
        >Headers</button>
      </div>
    </div>

    <div v-show="activeTab === 'body'" class="response-body">
      <pre class="response-pre">{{ response.body }}</pre>
    </div>

    <div v-show="activeTab === 'headers'" class="response-headers">
      <div v-for="(v, k) in response.headers" :key="k" class="header-row">
        <span class="header-key">{{ k }}</span>
        <span class="header-val">{{ v }}</span>
      </div>
    </div>
  </div>

  <!-- Empty -->
  <div v-else class="response-empty">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
    <p>尚未發送請求。<br>選擇左側範例或自行輸入 URL，按下「發送」開始測試。</p>
  </div>
</template>

<style scoped>
.response-viewer {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: var(--bg-deep);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}
.response-header {
  padding: 7px 12px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.resp-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}
.status-badge {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}
.status-ok { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
.status-error { background: rgba(239, 68, 68, 0.1); color: var(--color-error); }
.status-redirect { background: rgba(234, 179, 8, 0.1); color: var(--color-warning); }
.duration-badge {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
}
.resp-tabs { display: flex; margin-left: auto; }
.rtab {
  padding: 4px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.78rem;
  color: var(--text-dim);
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}
.rtab:hover { color: var(--text-primary); }
.rtab.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
.response-body, .response-headers {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}
.response-pre {
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  line-height: 1.6;
}
.header-row {
  display: flex;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid var(--border-color);
}
.header-key {
  font-family: 'Fira Code', monospace;
  font-size: 0.775rem;
  color: var(--color-primary);
  min-width: 200px;
}
.header-val {
  font-family: 'Fira Code', monospace;
  font-size: 0.775rem;
  color: var(--text-secondary);
  word-break: break-all;
}
.response-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.825rem;
  text-align: center;
  background: var(--bg-deep);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  flex: 1;
}
.response-empty p { margin: 0; line-height: 1.6; }
.response-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
  color: var(--text-dim);
  font-size: 0.825rem;
  background: var(--bg-deep);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
.spinner {
  width: 18px; height: 18px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
