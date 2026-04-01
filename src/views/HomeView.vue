<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'
import { chapters } from '@/data/chapters'

const progress = useProgressStore()

const features = [
  {
    icon: '📚',
    title: '互動式教學',
    desc: '7 章節完整教學，從 FHIR 基礎到實戰專案，進度自動記錄',
    route: '/tutorial/01-basics/01-what-is-fhir',
    btnText: '開始學習'
  },
  {
    icon: '⚡',
    title: 'JSON 編輯器',
    desc: 'Monaco Editor 即時驗證 FHIR R4 JSON，內建 6 種 Resource 範本',
    route: '/editor',
    btnText: '開啟編輯器'
  },
  {
    icon: '🔗',
    title: 'API 測試面板',
    desc: '類 Postman 介面，直連 HAPI FHIR 公開伺服器，10+ 預設範例',
    route: '/api-tester',
    btnText: '開始測試'
  },
  {
    icon: '📖',
    title: 'Resource 參考',
    desc: 'FHIR R4 核心資源快速參考、術語系統與搜尋參數一覽',
    route: '/reference',
    btnText: '查閱參考'
  }
]
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <div class="hero">
      <div class="hero-badge">FHIR R4 · 繁體中文</div>
      <h1 class="hero-title">
        <span class="hero-title-main">FHIR R4</span>
        <span class="hero-title-sub">互動式實作指南</span>
      </h1>
      <p class="hero-desc">
        從零開始學習 HL7 FHIR R4——涵蓋基礎概念、Resource 深入解析、搜尋機制、SMART on FHIR 安全認證，到完整實戰專案。所有範例均可在瀏覽器中直接執行。
      </p>
      <div class="hero-actions">
        <router-link to="/tutorial/01-basics/01-what-is-fhir" class="btn-primary">
          🚀 立即開始
        </router-link>
        <router-link to="/api-tester" class="btn-secondary">
          ⚡ 試試 API 測試
        </router-link>
      </div>
    </div>

    <!-- Progress summary -->
    <div class="progress-card" v-if="progress.completedCount > 0">
      <div class="progress-card-header">
        <span class="progress-card-title">學習進度</span>
        <span class="progress-percent">{{ progress.progressPercent }}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-track-fill" :style="{ width: progress.progressPercent + '%' }"></div>
      </div>
      <p class="progress-detail">已完成 {{ progress.completedCount }} / {{ progress.totalSteps }} 個步驟</p>
    </div>

    <!-- Features -->
    <div class="features-grid">
      <router-link
        v-for="f in features"
        :key="f.title"
        :to="f.route"
        class="feature-card"
      >
        <div class="feature-icon">{{ f.icon }}</div>
        <div class="feature-body">
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
        </div>
        <div class="feature-arrow">→</div>
      </router-link>
    </div>

    <!-- Chapter list -->
    <div class="chapters-section">
      <h2 class="section-title">教學章節</h2>
      <div class="chapters-list">
        <router-link
          v-for="chapter in chapters"
          :key="chapter.id"
          :to="`/tutorial/${chapter.id}/${chapter.steps[0].id}`"
          class="chapter-card"
        >
          <span class="chapter-icon-lg">{{ chapter.icon }}</span>
          <div class="chapter-info">
            <span class="chapter-name">{{ chapter.title }}</span>
            <span class="chapter-steps">{{ chapter.steps.length }} 個步驟</span>
          </div>
          <span class="chapter-arrow">›</span>
        </router-link>
      </div>
    </div>

    <!-- Stack badges -->
    <div class="stack-section">
      <p class="stack-label">技術棧</p>
      <div class="stack-badges">
        <span class="badge">FHIR R4</span>
        <span class="badge">HAPI FHIR</span>
        <span class="badge">REST API</span>
        <span class="badge">SMART on FHIR</span>
        <span class="badge">TW Core IG</span>
        <span class="badge">LOINC</span>
        <span class="badge">SNOMED CT</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home { max-width: 900px; margin: 0 auto; padding: 3rem 2.5rem; display: flex; flex-direction: column; gap: 3rem; }

/* Hero */
.hero { text-align: center; padding: 2rem 0; }
.hero-badge { display: inline-block; background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); border-radius: 20px; padding: 4px 14px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; margin-bottom: 1.25rem; font-family: 'JetBrains Mono', monospace; }
.hero-title { font-family: 'JetBrains Mono', monospace; margin: 0 0 1rem; line-height: 1.2; }
.hero-title-main { display: block; font-size: 3rem; font-weight: 700; color: #3b82f6; }
.hero-title-sub { display: block; font-size: 1.75rem; font-weight: 400; color: #94a3b8; }
.hero-desc { color: #64748b; font-size: 1rem; line-height: 1.75; max-width: 600px; margin: 0 auto 2rem; }
.hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-primary { padding: 10px 28px; background: #1d4ed8; color: #e2e8f0; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: background 0.15s; }
.btn-primary:hover { background: #2563eb; }
.btn-secondary { padding: 10px 28px; background: #1e293b; color: #94a3b8; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 0.9rem; border: 1px solid #334155; transition: all 0.15s; }
.btn-secondary:hover { color: #e2e8f0; border-color: #475569; }

/* Progress card */
.progress-card { background: #13131a; border: 1px solid rgba(59,130,246,0.2); border-radius: 12px; padding: 1.25rem 1.5rem; }
.progress-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.progress-card-title { font-size: 0.875rem; font-weight: 600; color: #e2e8f0; }
.progress-percent { font-family: 'JetBrains Mono', monospace; font-size: 1rem; font-weight: 700; color: #3b82f6; }
.progress-track { height: 6px; background: #1e293b; border-radius: 3px; overflow: hidden; }
.progress-track-fill { height: 100%; background: linear-gradient(90deg, #1d4ed8, #3b82f6); border-radius: 3px; transition: width 0.5s ease; }
.progress-detail { margin: 0.5rem 0 0; font-size: 0.8rem; color: #64748b; }

/* Features */
.features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.feature-card { background: #13131a; border: 1px solid #1e293b; border-radius: 12px; padding: 1.25rem; text-decoration: none; display: flex; align-items: center; gap: 1rem; transition: border-color 0.15s, background 0.15s; }
.feature-card:hover { border-color: #334155; background: #1a1a24; }
.feature-icon { font-size: 1.75rem; flex-shrink: 0; }
.feature-body { flex: 1; }
.feature-title { font-size: 0.9rem; font-weight: 600; color: #e2e8f0; margin: 0 0 4px; }
.feature-desc { font-size: 0.8rem; color: #64748b; margin: 0; line-height: 1.5; }
.feature-arrow { color: #334155; font-size: 1.2rem; transition: color 0.15s; }
.feature-card:hover .feature-arrow { color: #3b82f6; }

/* Chapters */
.chapters-section {}
.section-title { font-family: 'JetBrains Mono', monospace; font-size: 1rem; color: #94a3b8; margin: 0 0 1rem; font-weight: 600; }
.chapters-list { display: flex; flex-direction: column; gap: 4px; }
.chapter-card { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #0d0d14; border: 1px solid #1e293b; border-radius: 8px; text-decoration: none; transition: all 0.15s; }
.chapter-card:hover { border-color: #334155; background: #13131a; }
.chapter-icon-lg { font-size: 1.1rem; }
.chapter-info { flex: 1; display: flex; align-items: center; gap: 8px; }
.chapter-name { font-size: 0.85rem; color: #94a3b8; }
.chapter-steps { font-size: 0.75rem; color: #475569; font-family: 'JetBrains Mono', monospace; }
.chapter-arrow { color: #334155; font-size: 1.2rem; }

/* Stack */
.stack-section { text-align: center; }
.stack-label { font-size: 0.75rem; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; }
.stack-badges { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.badge { background: #1e293b; color: #64748b; font-size: 0.75rem; padding: 4px 12px; border-radius: 20px; font-family: 'JetBrains Mono', monospace; border: 1px solid #334155; }
</style>
