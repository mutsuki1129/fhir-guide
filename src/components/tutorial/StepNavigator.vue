<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getPrevStep, getNextStep } from '@/data/chapters'
import { useProgressStore } from '@/stores/progress'

const props = defineProps<{ chapterId: string; stepId: string }>()
const router = useRouter()
const progress = useProgressStore()

const prev = computed(() => getPrevStep(props.chapterId, props.stepId))
const next = computed(() => getNextStep(props.chapterId, props.stepId))
const isDone = computed(() => progress.isCompleted(props.chapterId, props.stepId))

function markAndNext() {
  progress.markComplete(props.chapterId, props.stepId)
  if (next.value) {
    router.push(`/tutorial/${next.value.chapterId}/${next.value.id}`)
  }
}
</script>

<template>
  <div class="step-nav">
    <router-link
      v-if="prev"
      :to="`/tutorial/${prev.chapterId}/${prev.id}`"
      class="nav-btn prev"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      <span>{{ prev.title }}</span>
    </router-link>
    <div v-else class="nav-btn-placeholder"></div>

    <button
      class="mark-btn"
      :class="{ done: isDone }"
      @click="isDone ? progress.markIncomplete(chapterId, stepId) : markAndNext()"
    >
      <svg v-if="isDone" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
      {{ isDone ? '已完成' : (next ? '完成並繼續' : '標記完成') }}
    </button>

    <router-link
      v-if="next"
      :to="`/tutorial/${next.chapterId}/${next.id}`"
      class="nav-btn next"
    >
      <span>{{ next.title }}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </router-link>
    <div v-else class="nav-btn-placeholder"></div>
  </div>
</template>

<style scoped>
.step-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 0; border-top: 1px solid #1e293b; margin-top: 2rem; gap: 1rem;
}
.nav-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 8px; text-decoration: none;
  font-size: 0.8rem; color: #64748b; border: 1px solid #1e293b;
  background: #13131a; transition: all 0.15s; max-width: 200px;
}
.nav-btn:hover { color: #e2e8f0; border-color: #334155; background: #1e293b; }
.nav-btn span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nav-btn-placeholder { min-width: 80px; }
.mark-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 20px; border-radius: 8px;
  font-size: 0.85rem; font-weight: 500; cursor: pointer; border: none;
  background: #1d4ed8; color: #e2e8f0; transition: all 0.15s; white-space: nowrap;
}
.mark-btn:hover { background: #2563eb; }
.mark-btn.done { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
.mark-btn.done:hover { background: rgba(34,197,94,0.25); }
</style>
