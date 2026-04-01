import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { allSteps } from '@/data/chapters'

export const useProgressStore = defineStore('progress', () => {
  const completed = ref<Set<string>>(new Set())

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem('fhir-guide-progress')
      if (saved) {
        completed.value = new Set(JSON.parse(saved))
      }
    } catch {}
  }

  function saveToStorage() {
    localStorage.setItem('fhir-guide-progress', JSON.stringify([...completed.value]))
  }

  function markComplete(chapterId: string, stepId: string) {
    completed.value.add(`${chapterId}/${stepId}`)
    saveToStorage()
  }

  function markIncomplete(chapterId: string, stepId: string) {
    completed.value.delete(`${chapterId}/${stepId}`)
    saveToStorage()
  }

  function isCompleted(chapterId: string, stepId: string): boolean {
    return completed.value.has(`${chapterId}/${stepId}`)
  }

  function resetAll() {
    completed.value.clear()
    saveToStorage()
  }

  const totalSteps = computed(() => allSteps.length)
  const completedCount = computed(() => completed.value.size)
  const progressPercent = computed(() =>
    totalSteps.value === 0 ? 0 : Math.round((completedCount.value / totalSteps.value) * 100)
  )

  loadFromStorage()

  return { completed, markComplete, markIncomplete, isCompleted, resetAll, totalSteps, completedCount, progressPercent }
})
