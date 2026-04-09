<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownRenderer from '@/components/tutorial/MarkdownRenderer.vue'
import StepNavigator from '@/components/tutorial/StepNavigator.vue'
import LanguageSwitcher from '@/components/code-examples/LanguageSwitcher.vue'
import { chapters } from '@/data/chapters'
import type { CodeExample } from '@/types'

const route = useRoute()

const chapterId = computed(() => route.params.chapterId as string)
const stepId = computed(() => route.params.stepId as string)

const content = ref('')
const loading = ref(false)
const error = ref('')
const codeExamples = ref<CodeExample[]>([])

// Dynamically import markdown content
const contentModules = import.meta.glob('/src/content/chapters/**/*.md', { query: '?raw', import: 'default' })

// Dynamically import code examples
const exampleModules = import.meta.glob('/src/content/code-examples/**/*', { query: '?raw', import: 'default' })

// Map step keys to example folders
const exampleFolderMap: Record<string, string> = {
  '02-setup/04-first-request': 'first-request',
  '03-resources/02-patient': 'create-patient',
  '03-resources/03-observation': 'create-observation',
  '03-resources/04-encounter': 'create-encounter',
  '03-resources/05-condition': 'create-condition',
  '03-resources/06-medication-request': 'create-medication-request',
  '03-resources/07-bundle': 'create-bundle',
  '04-search/01-basic-search': 'basic-search',
  '05-operations/01-validate': 'validate-operation',
  '05-operations/02-everything': 'everything-operation',
  '08-fhir-foundry/04-foundry-workflow': 'foundry-server-interaction',
}

const extToLang: Record<string, CodeExample['language']> = {
  '.ts': 'javascript',
  '.py': 'python',
  '.sh': 'curl',
  '.cs': 'csharp',
  '.java': 'java',
}

const langLabels: Record<string, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  curl: 'cURL',
  csharp: 'C#',
  java: 'Java',
}

const langOrder: CodeExample['language'][] = ['javascript', 'python', 'curl', 'csharp', 'java']

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

async function loadExamples(cId: string, sId: string) {
  const key = `${cId}/${sId}`
  const folder = exampleFolderMap[key]
  if (!folder) { codeExamples.value = []; return }

  const seen = new Set<string>()
  const examples: CodeExample[] = []

  for (const [path, loader] of Object.entries(exampleModules)) {
    if (!path.includes(`/code-examples/${folder}/`)) continue
    const ext = path.match(/(\.[^./]+)$/)?.[1] ?? ''
    const lang = extToLang[ext]
    if (!lang || seen.has(lang)) continue   // skip .js when .ts exists
    seen.add(lang)
    const code = await loader() as string
    examples.push({ language: lang, label: langLabels[lang] ?? lang, code })
  }

  examples.sort((a, b) => langOrder.indexOf(a.language) - langOrder.indexOf(b.language))
  codeExamples.value = examples
}

const chapter = computed(() => chapters.find(c => c.id === chapterId.value))
const step = computed(() => chapter.value?.steps.find(s => s.id === stepId.value))

watch([chapterId, stepId], ([cId, sId]) => {
  loadContent()
  loadExamples(cId, sId)
}, { immediate: true })
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
      <div v-if="codeExamples.length > 0" class="examples-section">
        <h2 class="examples-title">程式碼範例</h2>
        <LanguageSwitcher :examples="codeExamples" />
      </div>
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
.examples-section { margin-top: 2.5rem; }
.examples-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}
</style>
