<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { createHighlighter } from 'shiki'
import type { Highlighter } from 'shiki'

const props = defineProps<{
  code: string
  language: string
  filename?: string
}>()

const highlighted = ref('')
const copied = ref(false)
let highlighter: Highlighter | null = null

const langMap: Record<string, string> = {
  javascript: 'typescript',
  python: 'python',
  curl: 'bash',
  csharp: 'csharp',
  java: 'java',
  bash: 'bash',
  json: 'json',
  yaml: 'yaml',
  typescript: 'typescript'
}

async function highlight() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: ['typescript', 'python', 'bash', 'csharp', 'java', 'json', 'yaml']
    })
  }
  const lang = langMap[props.language] ?? 'text'
  highlighted.value = highlighter.codeToHtml(props.code, {
    lang,
    theme: 'github-dark'
  })
}

async function copy() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

onMounted(highlight)
watch(() => props.code, highlight)
watch(() => props.language, highlight)
</script>

<template>
  <div class="code-block terminal-block">
    <div class="terminal-header">
      <span class="terminal-dot red"></span>
      <span class="terminal-dot yellow"></span>
      <span class="terminal-dot green"></span>
      <span class="filename">{{ filename || language }}</span>
      <button class="copy-btn" @click="copy">
        <svg v-if="!copied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        {{ copied ? '已複製' : '複製' }}
      </button>
    </div>
    <div class="code-body" v-html="highlighted || `<pre><code>${code}</code></pre>`"></div>
  </div>
</template>

<style scoped>
.code-block { font-family: 'Fira Code', monospace; }
.terminal-header { padding: 8px 12px; display: flex; align-items: center; gap: 6px; background: #161b22; }
.filename { flex: 1; font-size: 0.75rem; color: #64748b; font-family: 'Fira Code', monospace; }
.copy-btn {
  display: flex; align-items: center; gap: 4px; background: none; border: none;
  color: #64748b; cursor: pointer; font-size: 0.75rem; padding: 3px 8px;
  border-radius: 4px; transition: color 0.15s, background 0.15s;
}
.copy-btn:hover { color: #e2e8f0; background: #1e293b; }
.code-body { overflow-x: auto; font-size: 0.85rem; line-height: 1.6; }
.code-body :deep(pre) { margin: 0; padding: 1rem; background: transparent !important; }
.code-body :deep(code) { font-family: 'Fira Code', monospace; }
</style>
