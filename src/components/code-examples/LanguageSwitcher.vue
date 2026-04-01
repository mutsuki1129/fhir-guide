<script setup lang="ts">
import { ref } from 'vue'
import CodeBlock from './CodeBlock.vue'
import type { CodeExample } from '@/types'

const props = defineProps<{ examples: CodeExample[] }>()

const active = ref(props.examples[0]?.language ?? 'javascript')

const langLabels: Record<string, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  curl: 'cURL',
  csharp: 'C#',
  java: 'Java'
}
</script>

<template>
  <div class="lang-switcher">
    <div class="tabs">
      <button
        v-for="ex in examples"
        :key="ex.language"
        class="tab"
        :class="{ active: active === ex.language }"
        @click="active = ex.language"
      >
        {{ langLabels[ex.language] ?? ex.language }}
      </button>
    </div>
    <CodeBlock
      v-for="ex in examples"
      v-show="active === ex.language"
      :key="ex.language"
      :code="ex.code"
      :language="ex.language"
      :filename="langLabels[ex.language]"
    />
  </div>
</template>

<style scoped>
.lang-switcher { border-radius: 8px; overflow: hidden; border: 1px solid #1e293b; }
.tabs { display: flex; background: #0d1117; border-bottom: 1px solid #1e293b; }
.tab {
  padding: 7px 14px; background: none; border: none; cursor: pointer;
  font-size: 0.8rem; color: #64748b; transition: color 0.15s, background 0.15s;
  font-family: 'JetBrains Mono', monospace; border-bottom: 2px solid transparent;
}
.tab:hover { color: #e2e8f0; }
.tab.active { color: #3b82f6; border-bottom-color: #3b82f6; }
</style>
