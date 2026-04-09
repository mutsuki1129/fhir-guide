<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { chapters } from '@/data/chapters'
import { useProgressStore } from '@/stores/progress'
import { useSettingsStore } from '@/stores/settings'
import { useContentSearch } from '@/composables/useContentSearch'
import { useSearchHighlight } from '@/composables/useSearchHighlight'
import ProgressTracker from '@/components/tutorial/ProgressTracker.vue'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()
const settings = useSettingsStore()

const expandedChapters = ref<Set<string>>(new Set(['01-basics', '02-setup']))
const searchInputEl = ref<HTMLInputElement>()
const { query, results } = useContentSearch()
const { setHighlight, clearHighlight } = useSearchHighlight()

// activeIdx = last navigated result index (-1 = nothing yet)
// This is the single source of truth for both visual highlight and navigation position.
const activeIdx = ref(-1)

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

const isSearching = computed(() => query.value.trim().length >= 2)

// Reset active when query changes; auto-expand matched chapters
watch(results, (res) => {
  activeIdx.value = -1
  if (res.length > 0) {
    expandedChapters.value = new Set(res.map(r => r.chapterId))
  }
})

function highlightText(text: string) {
  if (!isSearching.value) return text
  const q = query.value.trim()
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>')
}

function isChapterExpanded(id: string) {
  return expandedChapters.value.has(id)
}

/** Navigate to a specific result index — single entry point for all navigation */
function goTo(idx: number) {
  const n = results.value.length
  if (n === 0) return
  const i = ((idx % n) + n) % n   // safe modulo for negative values
  const r = results.value[i]
  if (!r) return
  activeIdx.value = i
  setHighlight(query.value.trim())
  router.push(`/tutorial/${r.chapterId}/${r.stepId}`)
  // Return focus to search input so keyboard shortcuts keep working
  nextTick(() => searchInputEl.value?.focus())
}

function navNext() {
  // If nothing visited yet start from 0, otherwise go to next
  goTo(activeIdx.value < 0 ? 0 : activeIdx.value + 1)
}

function navPrev() {
  goTo(activeIdx.value <= 0 ? results.value.length - 1 : activeIdx.value - 1)
}

function onSearchEnter() {
  if (!isSearching.value || results.value.length === 0) return
  navNext()
}

function onSearchKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); navNext() }
  if (e.key === 'ArrowUp') { e.preventDefault(); navPrev() }
}

function clearSearch() {
  query.value = ''
  clearHighlight()
}

// Click on a result card → navigate immediately, single click is enough
function selectResult(idx: number) {
  goTo(idx)
}

const displayPos = computed(() => activeIdx.value >= 0 ? activeIdx.value + 1 : 0)
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: !settings.sidebarOpen }">
    <div class="sidebar-inner">
      <div class="sidebar-header">
        <span class="sidebar-title">章節目錄</span>
        <span class="chapters-count">{{ chapters.length }} 章</span>
      </div>

      <!-- Search box -->
      <div class="search-box" :class="{ active: isSearching }">
        <svg class="search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref="searchInputEl"
          v-model="query"
          class="search-input"
          type="text"
          placeholder="搜尋內容… Enter 跳轉 ↑↓ 切換"
          @keydown.enter="onSearchEnter"
          @keydown.escape="clearSearch"
          @keydown="onSearchKeydown"
        />
        <button v-if="isSearching" class="search-clear" @click="clearSearch" title="清除 (Esc)">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Search results counter -->
      <div v-if="isSearching" class="search-status">
        <template v-if="results.length > 0">
          <span class="result-counter">{{ displayPos > 0 ? displayPos : '—' }} / {{ results.length }} 個結果</span>
          <div class="nav-hints">
            <button class="nav-btn" @click="navPrev" title="上一個">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
            <button class="nav-btn" @click="navNext" title="下一個 (Enter)">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </template>
        <span v-else class="no-results">無符合結果</span>
      </div>

      <!-- Search results list -->
      <div v-if="isSearching && results.length > 0" class="search-results">
        <button
          v-for="(r, idx) in results"
          :key="`${r.chapterId}/${r.stepId}`"
          class="result-item"
          :class="{ 'result-current': idx === activeIdx }"
          @click="selectResult(idx)"
        >
          <div class="result-meta">
            <span class="result-chapter-icon">{{ r.chapterIcon }}</span>
            <span class="result-chapter-name" v-html="highlightText(r.chapterTitle)"></span>
          </div>
          <div class="result-step" v-html="highlightText(r.stepTitle)"></div>
          <div v-if="r.snippet" class="result-snippet" v-html="highlightText(r.snippet)"></div>
        </button>
      </div>

      <!-- Normal chapter nav (hidden while searching) -->
      <nav v-if="!isSearching" class="chapter-nav">
        <div v-for="chapter in chapters" :key="chapter.id" class="chapter-group">
          <button
            class="chapter-header"
            :class="{ active: chapterHasActive(chapter.id) }"
            @click="toggleChapter(chapter.id)"
          >
            <span class="chapter-icon">{{ chapter.icon }}</span>
            <span class="chapter-title">{{ chapter.title }}</span>
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
              >
                <span class="step-check">
                  <svg v-if="progress.isCompleted(chapter.id, step.id)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span v-else class="step-dot"></span>
                </span>
                <span class="step-title">{{ step.title }}</span>
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
  width: 280px;
  flex-shrink: 0;
  background: var(--bg-deep);
  border-right: 1px solid var(--border-color);
  overflow: hidden;
  transition: width 0.3s ease, opacity 0.3s ease;
  display: flex;
  flex-direction: column;
}
.sidebar.collapsed { width: 0; opacity: 0; }
.sidebar-inner { width: 280px; overflow-y: auto; height: 100%; display: flex; flex-direction: column; }
.sidebar-header {
  padding: 0.875rem 1rem 0.5rem;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}
.sidebar-title { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 600; }
.chapters-count { font-size: 0.7rem; color: var(--border-subtle); font-family: 'JetBrains Mono', monospace; }

/* Search box */
.search-box {
  display: flex; align-items: center; gap: 6px;
  margin: 0.5rem 0.75rem 0.25rem;
  padding: 6px 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  transition: border-color 0.15s;
  flex-shrink: 0;
}
.search-box:focus-within, .search-box.active { border-color: var(--color-primary); }
.search-icon { color: var(--text-muted); flex-shrink: 0; }
.search-input {
  flex: 1; background: none; border: none; outline: none;
  font-size: 0.73rem; color: var(--text-primary);
  font-family: inherit; min-width: 0;
}
.search-input::placeholder { color: var(--text-muted); font-size: 0.7rem; }
.search-clear {
  background: none; border: none; cursor: pointer; padding: 2px;
  color: var(--text-muted); display: flex; align-items: center;
  border-radius: 3px; flex-shrink: 0;
}
.search-clear:hover { color: var(--text-primary); background: var(--border-color); }

/* Search status bar */
.search-status {
  display: flex; align-items: center; justify-content: space-between;
  padding: 3px 0.75rem 4px;
  flex-shrink: 0;
}
.result-counter { font-size: 0.68rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
.no-results { font-size: 0.7rem; color: var(--text-muted); }
.nav-hints { display: flex; gap: 3px; }
.nav-btn {
  background: var(--bg-elevated); border: 1px solid var(--border-color);
  border-radius: 4px; padding: 3px 5px; cursor: pointer;
  color: var(--text-dim); display: flex; align-items: center;
  transition: color 0.1s, background 0.1s;
}
.nav-btn:hover { color: var(--text-primary); background: var(--border-color); }

/* Search results */
.search-results {
  flex: 1; overflow-y: auto;
  border-top: 1px solid var(--border-color);
  padding: 4px 0;
}
.result-item {
  width: 100%; background: none; border: none; cursor: pointer;
  text-align: left; padding: 7px 10px;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.12s;
}
.result-item:hover { background: var(--bg-elevated); }
.result-item.result-current { background: rgba(59, 130, 246, 0.1); border-left: 2px solid var(--color-primary); padding-left: 8px; }
.result-meta {
  display: flex; align-items: center; gap: 4px;
  margin-bottom: 2px;
}
.result-chapter-icon { font-size: 0.75rem; }
.result-chapter-name { font-size: 0.65rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.result-step { font-size: 0.78rem; color: var(--text-secondary); font-weight: 500; line-height: 1.3; margin-bottom: 2px; }
.result-snippet {
  font-size: 0.67rem; color: var(--text-muted); line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* Highlight marks */
:deep(mark) {
  background: rgba(59, 130, 246, 0.28);
  color: var(--color-primary);
  border-radius: 2px;
  padding: 0 1px;
  font-style: normal;
}

/* Normal nav */
.chapter-nav { flex: 1; padding: 0.5rem 0; }
.chapter-group { margin-bottom: 2px; }
.chapter-header {
  width: 100%; background: none; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  padding: 7px 12px; text-align: left; color: var(--text-secondary);
  font-size: 0.8rem; font-weight: 500; transition: color 0.15s, background 0.15s;
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
.step-link.active, .step-link.router-link-active { color: var(--color-primary); background: rgba(59,130,246,0.08); }

.step-check { width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border-subtle); display: block; }
.step-title { flex: 1; line-height: 1.4; }

.sidebar-footer { padding: 0.75rem; border-top: 1px solid var(--border-color); flex-shrink: 0; }

/* Accordion animation */
.accordion-enter-active, .accordion-leave-active { transition: max-height 0.25s ease, opacity 0.25s ease; overflow: hidden; max-height: 500px; }
.accordion-enter-from, .accordion-leave-to { max-height: 0; opacity: 0; }
</style>
