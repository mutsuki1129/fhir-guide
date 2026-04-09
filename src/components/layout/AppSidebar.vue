<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { chapters } from '@/data/chapters'
import { useProgressStore } from '@/stores/progress'
import { useSettingsStore } from '@/stores/settings'
import ProgressTracker from '@/components/tutorial/ProgressTracker.vue'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()
const settings = useSettingsStore()

const expandedChapters = ref<Set<string>>(new Set(['01-basics', '02-setup']))
const searchQuery = ref('')

function toggleChapter(id: string) {
  if (expandedChapters.value.has(id)) {
    expandedChapters.value.delete(id)
  } else {
    expandedChapters.value.add(id)
  }
}

function isActiveStep(chapterId: string, stepId: string) {
  return route.params.chapterId === chapterId && route.params.stepId === stepId
}

function chapterHasActive(chapterId: string) {
  return route.params.chapterId === chapterId
}

const isSearching = computed(() => searchQuery.value.trim().length > 0)

const filteredChapters = computed(() => {
  if (!isSearching.value) return chapters
  const q = searchQuery.value.trim().toLowerCase()
  return chapters
    .map(chapter => {
      const chapterMatches = chapter.title.toLowerCase().includes(q)
      const matchingSteps = chapter.steps.filter(s => s.title.toLowerCase().includes(q))
      if (!chapterMatches && matchingSteps.length === 0) return null
      return { ...chapter, steps: chapterMatches ? chapter.steps : matchingSteps }
    })
    .filter(Boolean) as typeof chapters
})

function highlightText(text: string) {
  if (!isSearching.value) return text
  const q = searchQuery.value.trim()
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

function isChapterExpanded(id: string) {
  if (isSearching.value) return true
  return expandedChapters.value.has(id)
}

function onSearchEnter() {
  if (!isSearching.value) return
  const first = filteredChapters.value[0]
  if (!first) return
  const step = first.steps[0]
  if (step) {
    router.push(`/tutorial/${first.id}/${step.id}`)
    searchQuery.value = ''
  }
}

function clearSearch() {
  searchQuery.value = ''
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: !settings.sidebarOpen }">
    <div class="sidebar-inner">
      <div class="sidebar-header">
        <span class="sidebar-title">章節目錄</span>
        <span class="chapters-count">{{ chapters.length }} 章</span>
      </div>
      <div class="search-box">
        <svg class="search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchQuery"
          class="search-input"
          type="text"
          placeholder="搜尋章節...（Enter 跳轉）"
          @keydown.enter="onSearchEnter"
          @keydown.escape="clearSearch"
        />
        <button v-if="isSearching" class="search-clear" @click="clearSearch">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div v-if="isSearching && filteredChapters.length === 0" class="search-empty">
        無符合結果
      </div>
      <nav class="chapter-nav">
        <div v-for="chapter in filteredChapters" :key="chapter.id" class="chapter-group">
          <button
            class="chapter-header"
            :class="{ active: chapterHasActive(chapter.id) }"
            @click="toggleChapter(chapter.id)"
          >
            <span class="chapter-icon">{{ chapter.icon }}</span>
            <span class="chapter-title" v-html="highlightText(chapter.title)"></span>
            <svg
              class="chevron"
              :class="{ open: isChapterExpanded(chapter.id) }"
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <Transition name="accordion">
            <div v-if="isChapterExpanded(chapter.id)" class="step-list">
              <router-link
                v-for="step in chapter.steps"
                :key="step.id"
                :to="`/tutorial/${chapter.id}/${step.id}`"
                class="step-link"
                :class="{ active: isActiveStep(chapter.id, step.id) }"
                @click="clearSearch"
              >
                <span class="step-check">
                  <svg v-if="progress.isCompleted(chapter.id, step.id)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span v-else class="step-dot"></span>
                </span>
                <span class="step-title" v-html="highlightText(step.title)"></span>
              </router-link>
            </div>
          </Transition>
        </div>
      </nav>
      <div class="sidebar-footer">
        <ProgressTracker />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: var(--bg-deep);
  border-right: 1px solid var(--border-color);
  overflow: hidden;
  transition: width 0.3s ease, opacity 0.3s ease;
  display: flex;
  flex-direction: column;
}
.sidebar.collapsed { width: 0; opacity: 0; }
.sidebar-inner { width: 260px; overflow-y: auto; height: 100%; display: flex; flex-direction: column; }
.chapter-nav { flex: 1; }
.sidebar-header {
  padding: 0.875rem 1rem 0.5rem;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}
.sidebar-title { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 600; }
.chapters-count { font-size: 0.7rem; color: var(--border-subtle); font-family: 'JetBrains Mono', monospace; }

.chapter-nav { padding: 0.5rem 0; }
.chapter-group { margin-bottom: 2px; }

.chapter-header {
  width: 100%; background: none; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  padding: 7px 12px; text-align: left; color: var(--text-secondary);
  font-size: 0.8rem; font-weight: 500; transition: color 0.15s, background 0.15s;
  border-radius: 0;
}
.chapter-header:hover { color: var(--text-primary); background: var(--bg-elevated); }
.chapter-header.active { color: var(--color-primary); }
.chapter-icon { font-size: 0.875rem; flex-shrink: 0; }
.chapter-title { flex: 1; }
.chevron { color: var(--text-muted); transition: transform 0.2s; flex-shrink: 0; }
.chevron.open { transform: rotate(180deg); }

.step-list { padding: 2px 0 4px; }
.step-link {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 12px 5px 32px;
  text-decoration: none; color: var(--text-dim); font-size: 0.775rem;
  transition: color 0.15s, background 0.15s;
}
.step-link:hover { color: var(--text-primary); background: var(--bg-elevated); }
.step-link.active { color: var(--color-primary); background: rgba(59,130,246,0.08); }
.step-link.router-link-active { color: var(--color-primary); background: rgba(59,130,246,0.08); }

.step-check { width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border-subtle); display: block; }
.step-title { flex: 1; line-height: 1.4; }

.search-box {
  display: flex; align-items: center; gap: 6px;
  margin: 0.5rem 0.75rem 0.25rem;
  padding: 5px 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  transition: border-color 0.15s;
}
.search-box:focus-within { border-color: var(--color-primary); }
.search-icon { color: var(--text-muted); flex-shrink: 0; }
.search-input {
  flex: 1; background: none; border: none; outline: none;
  font-size: 0.75rem; color: var(--text-primary);
  font-family: inherit; min-width: 0;
}
.search-input::placeholder { color: var(--text-muted); }
.search-clear {
  background: none; border: none; cursor: pointer; padding: 2px;
  color: var(--text-muted); display: flex; align-items: center;
  border-radius: 3px; flex-shrink: 0;
}
.search-clear:hover { color: var(--text-primary); background: var(--border-color); }
.search-empty {
  font-size: 0.75rem; color: var(--text-muted);
  text-align: center; padding: 1rem 0.75rem;
}
:deep(mark) {
  background: rgba(59, 130, 246, 0.25);
  color: var(--color-primary);
  border-radius: 2px;
  padding: 0 1px;
}
.sidebar-footer { padding: 0.75rem; border-top: 1px solid var(--border-color); flex-shrink: 0; }

/* Accordion animation */
.accordion-enter-active, .accordion-leave-active { transition: max-height 0.25s ease, opacity 0.25s ease; overflow: hidden; max-height: 400px; }
.accordion-enter-from, .accordion-leave-to { max-height: 0; opacity: 0; }
</style>
