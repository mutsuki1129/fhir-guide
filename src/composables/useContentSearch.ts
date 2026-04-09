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

function extractSnippet(content: string, query: string): string {
  const lower = content.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return ''
  const start = Math.max(0, idx - 35)
  const end = Math.min(content.length, idx + query.length + 55)
  let snip = content.slice(start, end)
  // Strip markdown syntax for readability
  snip = snip.replace(/```[\s\S]*?```/g, '').replace(/[#*`>\[\]!]/g, '').replace(/\s+/g, ' ').trim()
  if (start > 0) snip = '…' + snip
  if (end < content.length) snip = snip + '…'
  return snip
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
        const content = contentModules[path] ?? ''
        const titleMatch =
          step.title.toLowerCase().includes(qLower) ||
          chapter.title.toLowerCase().includes(qLower)
        const contentMatch = content.toLowerCase().includes(qLower)

        if (titleMatch || contentMatch) {
          matches.push({
            chapterId: chapter.id,
            stepId: step.id,
            chapterTitle: chapter.title,
            chapterIcon: chapter.icon,
            stepTitle: step.title,
            snippet: contentMatch ? extractSnippet(content, q) : '',
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
