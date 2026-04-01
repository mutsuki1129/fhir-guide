<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import { createHighlighter } from 'shiki'

const props = defineProps<{ content: string }>()

let shiki: Awaited<ReturnType<typeof createHighlighter>> | null = null

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str: string, lang: string): string {
    if (shiki && lang) {
      try {
        return shiki.codeToHtml(str, { lang, theme: 'github-dark' })
      } catch { /* unsupported lang — fallthrough */ }
    }
    return `<pre class="shiki-fallback"><code>${escapeHtml(str)}</code></pre>`
  }
}).use(markdownItAnchor, { permalink: markdownItAnchor.permalink.headerLink() })

// Custom containers (:::tip, :::warning, :::danger)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
md.core.ruler.push('custom_container', (state: any) => {
  const tokens = state.tokens
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'inline') {
      const content = tokens[i].content
      const match = content.match(/^:::(tip|warning|danger)\s*(.*)$/)
      if (match) {
        tokens[i].content = `<div class="${match[1]}"><div class="${match[1]}-title">${match[2] || match[1].toUpperCase()}</div>`
      }
      if (content.trim() === ':::') {
        tokens[i].content = '</div>'
      }
    }
  }
})

const rendered = ref('')

function render() {
  rendered.value = md.render(props.content || '')
}

watch(() => props.content, render, { immediate: true })

onMounted(async () => {
  shiki = await createHighlighter({
    themes: ['github-dark'],
    langs: ['typescript', 'javascript', 'python', 'bash', 'json', 'yaml', 'csharp', 'java', 'xml', 'http', 'sql', 'shell']
  })
  render()
})
</script>

<template>
  <div class="markdown-content" v-html="rendered"></div>
</template>
