<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'

const props = defineProps<{ content: string }>()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(markdownItAnchor, { permalink: markdownItAnchor.permalink.headerLink() })

// Custom containers (:::tip, :::warning, :::danger)
md.core.ruler.push('custom_container', (state) => {
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
watch(() => props.content, (val) => {
  rendered.value = md.render(val || '')
}, { immediate: true })
</script>

<template>
  <div class="markdown-content" v-html="rendered"></div>
</template>
