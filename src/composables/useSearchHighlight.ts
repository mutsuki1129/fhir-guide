import { ref } from 'vue'

// Shared singleton — sidebar sets it, MarkdownRenderer reads it
const highlightQuery = ref('')
// Increment on every navigation so watchers always fire even when query is unchanged
const highlightVersion = ref(0)

export function useSearchHighlight() {
  function setHighlight(q: string) {
    highlightQuery.value = q
    highlightVersion.value++
  }
  function clearHighlight() {
    highlightQuery.value = ''
    highlightVersion.value++
  }
  return { highlightQuery, highlightVersion, setHighlight, clearHighlight }
}
