import { ref } from 'vue'

// Shared singleton — sidebar sets it, MarkdownRenderer reads it
const highlightQuery = ref('')

export function useSearchHighlight() {
  function setHighlight(q: string) { highlightQuery.value = q }
  function clearHighlight() { highlightQuery.value = '' }
  return { highlightQuery, setHighlight, clearHighlight }
}
