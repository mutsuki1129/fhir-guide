import { ref, computed, watch } from 'vue'
import { chapters } from '@/data/chapters'

// Eagerly load all markdown at build time so search works offline & instantly
const contentModules = import.meta.glob('/src/content/chapters/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface SearchResult {
  chapterId: string
  stepId: string
  chapterTitle: string
  chapterIcon: string
  stepTitle: string
  snippet: string
}

/** Strip markdown syntax to get searchable plain text */
function toPlainText(content: string): string {
  return content
    // Fenced code blocks: keep the code text (important for POST/GET etc.)
    .replace(/```[^\n]*\n([\s\S]*?)```/g, ' $1 ')
    // Inline code
    .replace(/`([^`]+)`/g, ' $1 ')
    // Images
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    // Links – keep label
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Headings
    .replace(/^#{1,6}\s+/gm, '')
    // Bold / italic
    .replace(/[*_]{1,3}([^*_\n]+)[*_]{1,3}/g, '$1')
    // Blockquote markers
    .replace(/^>\s*/gm, '')
    // HTML tags
    .replace(/<[^>]+>/g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSnippet(plainText: string, query: string): string {
  const lower = plainText.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return ''
  const start = Math.max(0, idx - 40)
  const end = Math.min(plainText.length, idx + query.length + 60)
  let snip = plainText.slice(start, end).trim()
  if (start > 0) snip = '…' + snip
  if (end < plainText.length) snip = snip + '…'
  return snip
}

// Pre-compute plain text for each step (module-level cache, built once)
const plainTextCache: Record<string, string> = {}
for (const [path, raw] of Object.entries(contentModules)) {
  plainTextCache[path] = toPlainText(raw)
}

export function useContentSearch() {
  const query = ref('')
  const currentIndex = ref(0)

  const results = computed<SearchResult[]>(() => {
    const q = query.value.trim()
    if (q.length < 2) return []
    const qLower = q.toLowerCase()
    const matches: SearchResult[] = []

    for (const chapter of chapters) {
      for (const step of chapter.steps) {
        const path = `/src/content/chapters/${step.contentPath}.md`
        const plain = plainTextCache[path] ?? ''
        const titleMatch =
          step.title.toLowerCase().includes(qLower) ||
          chapter.title.toLowerCase().includes(qLower)
        const contentMatch = plain.toLowerCase().includes(qLower)

        if (titleMatch || contentMatch) {
          matches.push({
            chapterId: chapter.id,
            stepId: step.id,
            chapterTitle: chapter.title,
            chapterIcon: chapter.icon,
            stepTitle: step.title,
            snippet: contentMatch ? extractSnippet(plain, q) : '',
          })
        }
      }
    }
    return matches
  })

  watch(query, () => { currentIndex.value = 0 })

  function next() {
    if (results.value.length === 0) return
    currentIndex.value = (currentIndex.value + 1) % results.value.length
  }

  function prev() {
    if (results.value.length === 0) return
    currentIndex.value = (currentIndex.value - 1 + results.value.length) % results.value.length
  }

  function current() {
    return results.value[currentIndex.value] ?? null
  }

  return { query, results, currentIndex, next, prev, current }
}
