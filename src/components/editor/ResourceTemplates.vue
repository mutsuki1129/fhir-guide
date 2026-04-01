<script setup lang="ts">
defineProps<{
  templates: string[]
  selected: string
}>()

const emit = defineEmits<{
  select: [name: string]
}>()
</script>

<template>
  <div class="resource-templates">
    <span class="templates-label">載入範本：</span>
    <div class="template-btns">
      <button
        v-for="name in templates"
        :key="name"
        class="template-btn"
        :class="{ active: selected === name }"
        @click="emit('select', name)"
      >
        {{ name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.resource-templates {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.templates-label {
  font-size: 0.8rem;
  color: var(--text-dim);
  white-space: nowrap;
}
.template-btns {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.template-btn {
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-panel);
  color: var(--text-dim);
  font-size: 0.775rem;
  cursor: pointer;
  transition: all 0.15s;
  font-family: 'JetBrains Mono', monospace;
  white-space: nowrap;
}
.template-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-subtle);
}
.template-btn.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.08);
}
</style>
