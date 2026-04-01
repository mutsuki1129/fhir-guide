<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

const servers = [
  { label: 'HAPI FHIR Public (R4)', url: 'https://hapi.fhir.org/baseR4' },
  { label: 'Local Docker HAPI', url: 'http://localhost:8080/fhir' }
]

const customInput = ref('')

function applyCustom() {
  const url = customInput.value.trim()
  if (url) {
    settings.setServer(url)
    customInput.value = ''
  }
}
</script>

<template>
  <div class="server-selector">
    <span class="label">FHIR Server：</span>
    <div class="server-btns">
      <button
        v-for="s in servers"
        :key="s.url"
        class="server-btn"
        :class="{ active: settings.currentServer === s.url }"
        @click="settings.setServer(s.url)"
      >
        {{ s.label }}
      </button>
    </div>
    <div class="custom-server">
      <input
        v-model="customInput"
        class="custom-input"
        placeholder="自訂 URL（如 http://localhost:8080/fhir）"
        @keydown.enter="applyCustom"
      />
      <button class="apply-btn" @click="applyCustom">套用</button>
    </div>
    <span class="current-url">{{ settings.currentServer }}</span>
  </div>
</template>

<style scoped>
.server-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 7px 12px;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
.label {
  font-size: 0.775rem;
  color: var(--text-dim);
  white-space: nowrap;
}
.server-btns { display: flex; gap: 4px; }
.server-btn {
  padding: 4px 10px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  background: none;
  color: var(--text-dim);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.server-btn:hover { color: var(--text-primary); border-color: var(--border-subtle); }
.server-btn.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.08);
}
.custom-server { display: flex; gap: 4px; }
.custom-input {
  background: var(--bg-deep);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 5px;
  width: 220px;
  outline: none;
}
.custom-input:focus { border-color: var(--border-subtle); }
.apply-btn {
  padding: 4px 10px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  background: var(--border-color);
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
}
.apply-btn:hover { color: var(--text-primary); }
.current-url {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-family: 'Fira Code', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}
</style>
