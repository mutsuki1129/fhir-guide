<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import { createHighlighter } from 'shiki'
import { useSearchHighlight } from '@/composables/useSearchHighlight'

const props = defineProps<{ content: string }>()

const { highlightQuery } = useSearchHighlight()
const contentEl = ref<HTMLElement>()

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

// ── Search highlight ──────────────────────────────────────────────────────────

function removeExistingMarks() {
  if (!contentEl.value) return
  contentEl.value.querySelectorAll('mark.search-hl').forEach(mark => {
    const parent = mark.parentNode
    if (!parent) return
    parent.replaceChild(document.createTextNode(mark.textContent || ''), mark)
    parent.normalize()
  })
}

function applyHighlight() {
  if (!contentEl.value) return
  removeExistingMarks()

  const q = highlightQuery.value.trim()
  if (!q) return

  const qLower = q.toLowerCase()
  const walker = document.createTreeWalker(
    contentEl.value,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        // Skip code blocks to avoid breaking syntax highlighting
        if ((node.parentElement as Element)?.closest('pre, code')) return NodeFilter.FILTER_REJECT
        return node.textContent?.toLowerCase().includes(qLower)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT
      }
    }
  )

  const textNodes: Text[] = []
  let n: Node | null
  while ((n = walker.nextNode())) textNodes.push(n as Text)

  let firstMark: HTMLElement | null = null

  for (const textNode of textNodes) {
    const text = textNode.textContent || ''
    const lower = text.toLowerCase()
    const frag = document.createDocumentFragment()
    let lastIdx = 0
    let idx = lower.indexOf(qLower)

    while (idx !== -1) {
      if (idx > lastIdx) frag.appendChild(document.createTextNode(text.slice(lastIdx, idx)))
      const mark = document.createElement('mark')
      mark.className = 'search-hl'
      mark.textContent = text.slice(idx, idx + q.length)
      frag.appendChild(mark)
      if (!firstMark) firstMark = mark
      lastIdx = idx + q.length
      idx = lower.indexOf(qLower, lastIdx)
    }
    if (lastIdx < text.length) frag.appendChild(document.createTextNode(text.slice(lastIdx)))
    textNode.parentNode?.replaceChild(frag, textNode)
  }

  if (firstMark) {
    nextTick(() => firstMark!.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }
}

// Re-highlight whenever rendered HTML or the query changes
watch(rendered, async () => {
  await nextTick()
  applyHighlight()
})

watch(highlightQuery, async () => {
  await nextTick()
  applyHighlight()
})
</script>

<template>
  <div ref="contentEl" class="markdown-content" v-html="rendered"></div>
</template>

<style scoped>
:deep(mark.search-hl) {
  background: rgba(250, 204, 21, 0.45);
  color: inherit;
  border-radius: 2px;
  padding: 0 2px;
  outline: 1px solid rgba(250, 204, 21, 0.7);
}
</style>
