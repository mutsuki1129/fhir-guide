<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { chapters } from '@/data/chapters'

const progress = useProgressStore()

const chapterProgress = computed(() =>
  chapters.map(chapter => {
    const total = chapter.steps.length
    const done = chapter.steps.filter(s => progress.isCompleted(chapter.id, s.id)).length
    return { ...chapter, total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) }
  })
)
</script>

<template>
  <div class="progress-tracker">
    <div class="tracker-header">
      <span class="tracker-title">學習進度</span>
      <span class="tracker-total">{{ progress.completedCount }} / {{ progress.totalSteps }} 步驟</span>
    </div>

    <div class="overall-bar">
      <div class="overall-fill" :style="{ width: progress.progressPercent + '%' }"></div>
    </div>
    <div class="overall-percent">{{ progress.progressPercent }}% 完成</div>

    <div class="chapter-list">
      <div v-for="c in chapterProgress" :key="c.id" class="chapter-row">
        <span class="chapter-icon">{{ c.icon }}</span>
        <div class="chapter-detail">
          <div class="chapter-meta">
            <span class="chapter-name">{{ c.title }}</span>
            <span class="chapter-fraction">{{ c.done }}/{{ c.total }}</span>
          </div>
          <div class="chapter-bar">
            <div class="chapter-fill" :style="{ width: c.percent + '%' }"></div>
          </div>
        </div>
        <span class="chapter-check" v-if="c.done === c.total && c.total > 0">✓</span>
      </div>
    </div>

    <button
      v-if="progress.completedCount > 0"
      class="reset-btn"
      @click="progress.resetAll"
    >
      重置進度
    </button>
  </div>
</template>

<style scoped>
.progress-tracker {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
}
.tracker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.tracker-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.tracker-total {
  font-size: 0.8rem;
  color: var(--text-dim);
  font-family: 'JetBrains Mono', monospace;
}
.overall-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.4rem;
}
.overall-fill {
  height: 100%;
  background: linear-gradient(90deg, #1d4ed8, #3b82f6);
  border-radius: 3px;
  transition: width 0.4s ease;
}
.overall-percent {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: right;
  margin-bottom: 1rem;
  font-family: 'JetBrains Mono', monospace;
}
.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1rem;
}
.chapter-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.chapter-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}
.chapter-detail {
  flex: 1;
  min-width: 0;
}
.chapter-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
}
.chapter-name {
  font-size: 0.75rem;
  color: var(--text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chapter-fraction {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  flex-shrink: 0;
  margin-left: 4px;
}
.chapter-bar {
  height: 3px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}
.chapter-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}
.chapter-check {
  font-size: 0.75rem;
  color: var(--color-success);
  flex-shrink: 0;
  width: 16px;
  text-align: center;
}
.reset-btn {
  width: 100%;
  padding: 6px;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
}
.reset-btn:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.05);
}
</style>
