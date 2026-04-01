<script setup lang="ts">
import { apiPresets } from '@/data/api-presets'
import type { ApiPreset } from '@/types'

const emit = defineEmits<{
  select: [preset: ApiPreset]
}>()

function methodClass(m: string) {
  const map: Record<string, string> = {
    GET: 'method-get',
    POST: 'method-post',
    PUT: 'method-put',
    DELETE: 'method-delete',
    PATCH: 'method-patch'
  }
  return map[m] ?? ''
}
</script>

<template>
  <div class="api-presets">
    <div class="presets-header">快速範例</div>
    <div class="presets-list">
      <button
        v-for="p in apiPresets"
        :key="p.id"
        class="preset-item"
        @click="emit('select', p)"
      >
        <span class="method-badge" :class="methodClass(p.method)">{{ p.method }}</span>
        <div class="preset-info">
          <span class="preset-path">{{ p.path }}</span>
          <span class="preset-desc">{{ p.description }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.api-presets {
  width: 240px;
  flex-shrink: 0;
  background: var(--bg-deep);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.presets-header {
  padding: 8px 12px;
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}
.presets-list { overflow-y: auto; }
.preset-item {
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid var(--border-color);
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  transition: background 0.15s;
}
.preset-item:hover { background: var(--bg-elevated); }
.method-badge {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--bg-elevated);
  font-family: 'JetBrains Mono', monospace;
  flex-shrink: 0;
  margin-top: 2px;
}
.method-get { color: #16a34a; }
.method-post { color: #ea580c; }
.method-put { color: var(--color-primary); }
.method-delete { color: var(--color-error); }
.method-patch { color: #9333ea; }
.preset-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.preset-path {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: 'Fira Code', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.preset-desc {
  font-size: 0.68rem;
  color: var(--text-muted);
  line-height: 1.4;
}
</style>
