<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { chapters } from '@/data/chapters'
import { useProgressStore } from '@/stores/progress'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const progress = useProgressStore()
const settings = useSettingsStore()

const expandedChapters = ref<Set<string>>(new Set(['01-basics', '02-setup']))

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
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: !settings.sidebarOpen }">
    <div class="sidebar-inner">
      <div class="sidebar-header">
        <span class="sidebar-title">章節目錄</span>
        <span class="chapters-count">{{ chapters.length }} 章</span>
      </div>
      <nav class="chapter-nav">
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
              :class="{ open: expandedChapters.has(chapter.id) }"
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <Transition name="accordion">
            <div v-if="expandedChapters.has(chapter.id)" class="step-list">
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
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #0d0d14;
  border-right: 1px solid #1e293b;
  overflow: hidden;
  transition: width 0.3s ease, opacity 0.3s ease;
  display: flex;
  flex-direction: column;
}
.sidebar.collapsed { width: 0; opacity: 0; }
.sidebar-inner { width: 260px; overflow-y: auto; height: 100%; }
.sidebar-header {
  padding: 0.875rem 1rem 0.5rem;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid #1e293b;
}
.sidebar-title { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; font-weight: 600; }
.chapters-count { font-size: 0.7rem; color: #334155; font-family: 'JetBrains Mono', monospace; }

.chapter-nav { padding: 0.5rem 0; }
.chapter-group { margin-bottom: 2px; }

.chapter-header {
  width: 100%; background: none; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  padding: 7px 12px; text-align: left; color: #94a3b8;
  font-size: 0.8rem; font-weight: 500; transition: color 0.15s, background 0.15s;
  border-radius: 0;
}
.chapter-header:hover { color: #e2e8f0; background: rgba(255,255,255,0.04); }
.chapter-header.active { color: #93c5fd; }
.chapter-icon { font-size: 0.875rem; flex-shrink: 0; }
.chapter-title { flex: 1; }
.chevron { color: #475569; transition: transform 0.2s; flex-shrink: 0; }
.chevron.open { transform: rotate(180deg); }

.step-list { padding: 2px 0 4px; }
.step-link {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 12px 5px 32px;
  text-decoration: none; color: #64748b; font-size: 0.775rem;
  transition: color 0.15s, background 0.15s;
}
.step-link:hover { color: #e2e8f0; background: rgba(255,255,255,0.03); }
.step-link.active { color: #3b82f6; background: rgba(59,130,246,0.08); }
.step-link.router-link-active { color: #3b82f6; background: rgba(59,130,246,0.08); }

.step-check { width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step-dot { width: 5px; height: 5px; border-radius: 50%; background: #334155; display: block; }
.step-title { flex: 1; line-height: 1.4; }

/* Accordion animation */
.accordion-enter-active, .accordion-leave-active { transition: max-height 0.25s ease, opacity 0.25s ease; overflow: hidden; max-height: 400px; }
.accordion-enter-from, .accordion-leave-to { max-height: 0; opacity: 0; }
</style>
