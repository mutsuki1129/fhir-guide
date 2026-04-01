<script setup lang="ts">
import type { ValidationResult } from '@/types'

defineProps<{
  result: ValidationResult
  loading?: boolean
}>()
</script>

<template>
  <div class="validation-panel">
    <div class="panel-header">
      <span class="panel-title">驗證結果</span>
      <span
        v-if="!loading"
        class="validation-badge"
        :class="result.valid ? 'valid' : 'invalid'"
      >
        {{ result.valid ? '✅ 通過' : `❌ ${result.errors.length} 個錯誤` }}
      </span>
      <span v-else class="checking-badge">⏳ 驗證中...</span>
    </div>

    <div class="panel-body">
      <!-- All valid -->
      <div
        v-if="result.valid && result.warnings.length === 0 && !loading"
        class="valid-message"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>JSON 格式正確，符合 FHIR R4 基本規範</span>
      </div>

      <!-- Errors -->
      <div v-if="result.errors.length > 0" class="section">
        <div class="section-label error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          錯誤 ({{ result.errors.length }})
        </div>
        <div v-for="(err, i) in result.errors" :key="i" class="error-item">
          <code class="item-path">{{ err.path || 'root' }}</code>
          <span class="item-msg">{{ err.message }}</span>
        </div>
      </div>

      <!-- Warnings -->
      <div v-if="result.warnings.length > 0" class="section">
        <div class="section-label warning">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          建議 ({{ result.warnings.length }})
        </div>
        <div v-for="(w, i) in result.warnings" :key="i" class="warning-item">
          <code class="item-path warn">{{ w.path }}</code>
          <span class="item-msg">{{ w.message }}</span>
        </div>
      </div>

      <!-- FHIR spec tip -->
      <div v-if="result.valid" class="spec-tip">
        <span class="tip-label">提示</span>
        <span class="tip-text">此驗證基於 FHIR R4 基本規範。完整驗證（含 Profile）請使用 FHIR $validate operation。</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.validation-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-elevated);
}
.panel-header {
  padding: 8px 12px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.panel-title {
  font-size: 0.775rem;
  color: var(--text-secondary);
  font-weight: 600;
}
.validation-badge {
  font-size: 0.72rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}
.validation-badge.valid { color: #4ade80; }
.validation-badge.invalid { color: #f87171; }
.checking-badge {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
}
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.valid-message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #22c55e;
  font-size: 0.8rem;
  padding: 0.875rem;
  background: rgba(34, 197, 94, 0.06);
  border-radius: 6px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  line-height: 1.5;
}
.section { display: flex; flex-direction: column; gap: 4px; }
.section-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 2px;
}
.section-label.error { color: var(--color-error); }
.section-label.warning { color: var(--color-warning); }
.error-item, .warning-item {
  border-radius: 5px;
  padding: 6px 10px;
  margin-bottom: 2px;
}
.error-item { background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); }
.warning-item { background: rgba(234, 179, 8, 0.05); border: 1px solid rgba(234, 179, 8, 0.15); }
.item-path {
  display: block;
  font-family: 'Fira Code', monospace;
  font-size: 0.72rem;
  color: var(--color-error);
  margin-bottom: 2px;
}
.item-path.warn { color: var(--color-warning); }
.item-msg {
  display: block;
  font-size: 0.775rem;
  color: var(--text-secondary);
  line-height: 1.4;
}
.spec-tip {
  margin-top: auto;
  padding: 8px 10px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: 6px;
  font-size: 0.72rem;
  line-height: 1.5;
}
.tip-label {
  font-weight: 700;
  color: #60a5fa;
  margin-right: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  text-transform: uppercase;
}
.tip-text { color: var(--text-dim); }
</style>
