<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownRenderer from '@/components/tutorial/MarkdownRenderer.vue'
import StepNavigator from '@/components/tutorial/StepNavigator.vue'
import { chapters } from '@/data/chapters'

const route = useRoute()

const chapterId = computed(() => route.params.chapterId as string)
const stepId = computed(() => route.params.stepId as string)

const content = ref('')
const loading = ref(false)
const error = ref('')

// Dynamically import markdown content
const contentModules = import.meta.glob('/src/content/chapters/**/*.md', { query: '?raw', import: 'default' })

async function loadContent() {
  loading.value = true
  error.value = ''
  content.value = ''
  const path = `/src/content/chapters/${chapterId.value}/${stepId.value}.md`
  try {
    const loader = contentModules[path]
    if (loader) {
      content.value = await loader() as string
    } else {
      content.value = `# 內容建設中\n\n此章節的教學內容正在準備中，敬請期待！\n\n**章節 ID：** \`${chapterId.value}/${stepId.value}\``
    }
  } catch (e) {
    error.value = '無法載入教學內容'
    content.value = ''
  } finally {
    loading.value = false
  }
}

const chapter = computed(() => chapters.find(c => c.id === chapterId.value))
const step = computed(() => chapter.value?.steps.find(s => s.id === stepId.value))

watch([chapterId, stepId], loadContent, { immediate: true })
</script>

<template>
  <div class="tutorial-view">
    <div class="tutorial-breadcrumb">
      <span class="crumb-chapter" v-if="chapter">{{ chapter.icon }} {{ chapter.title }}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      <span class="crumb-step" v-if="step">{{ step.title }}</span>
    </div>

    <div class="tutorial-content" v-if="!loading && !error">
      <MarkdownRenderer :content="content" />
      <StepNavigator :chapter-id="chapterId" :step-id="stepId" />
    </div>

    <div class="tutorial-loading" v-if="loading">
      <div class="spinner"></div>
      <span>載入中...</span>
    </div>

    <div class="tutorial-error" v-if="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.tutorial-view {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 2.5rem;
}
.tutorial-breadcrumb {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 2rem; font-size: 0.8rem;
}
.crumb-chapter { color: var(--text-dim); }
.crumb-step { color: var(--text-secondary); }
.tutorial-loading {
  display: flex; align-items: center; gap: 12px;
  color: var(--text-dim); padding: 4rem; justify-content: center;
}
.spinner {
  width: 20px; height: 20px; border: 2px solid var(--border-color);
  border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.tutorial-error { color: var(--color-error); padding: 2rem; text-align: center; }
</style>
