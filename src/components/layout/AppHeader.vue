<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { useProgressStore } from '@/stores/progress'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const settings = useSettingsStore()
const progress = useProgressStore()
const route = useRoute()
const serverOnline = ref<boolean | null>(null)

async function checkServer() {
  serverOnline.value = null
  try {
    const res = await fetch(`${settings.currentServer}/metadata`, {
      method: 'GET',
      headers: { Accept: 'application/fhir+json' },
      signal: AbortSignal.timeout(5000)
    })
    serverOnline.value = res.ok
  } catch {
    serverOnline.value = false
  }
}

onMounted(checkServer)
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button class="sidebar-toggle" @click="settings.toggleSidebar" :aria-label="settings.sidebarOpen ? '收合側邊欄' : '展開側邊欄'">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <router-link to="/" class="logo">
        <span class="logo-icon">⚕️</span>
        <span class="logo-text">FHIR <span class="logo-accent">實作指南</span></span>
        <span class="version-badge">R4</span>
      </router-link>
    </div>

    <nav class="header-nav">
      <router-link to="/tutorial/01-basics/01-what-is-fhir" class="nav-link" :class="{ active: route.path.startsWith('/tutorial') }">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        教學
      </router-link>
      <router-link to="/editor" class="nav-link" :class="{ active: route.path === '/editor' }">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        編輯器
      </router-link>
      <router-link to="/api-tester" class="nav-link" :class="{ active: route.path === '/api-tester' }">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        API 測試
      </router-link>
      <router-link to="/reference" class="nav-link" :class="{ active: route.path === '/reference' }">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        參考
      </router-link>
    </nav>

    <div class="header-right">
      <div class="server-status" @click="checkServer" title="點擊重新檢測">
        <span
          class="status-dot"
          :class="serverOnline === null ? 'checking' : serverOnline ? 'online' : 'offline'"
        ></span>
        <span class="status-label">
          {{ serverOnline === null ? '檢測中...' : serverOnline ? 'HAPI 在線' : 'HAPI 離線' }}
        </span>
      </div>
      <div class="progress-chip">
        <span class="progress-text">{{ progress.completedCount }}/{{ progress.totalSteps }}</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress.progressPercent + '%' }"></div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: 52px;
  background: #0d0d14;
  border-bottom: 1px solid #1e293b;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  gap: 1rem;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}
.header-left { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
.sidebar-toggle {
  background: none; border: none; color: #64748b; cursor: pointer; padding: 6px;
  border-radius: 6px; display: flex; align-items: center; transition: color 0.15s, background 0.15s;
}
.sidebar-toggle:hover { color: #e2e8f0; background: #1e293b; }
.logo { display: flex; align-items: center; gap: 6px; text-decoration: none; }
.logo-icon { font-size: 1.2rem; }
.logo-text { font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; font-weight: 700; color: #e2e8f0; white-space: nowrap; }
.logo-accent { color: #3b82f6; }
.version-badge { background: #1d4ed8; color: #bfdbfe; font-size: 0.65rem; padding: 1px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-weight: 600; }

.header-nav { display: flex; align-items: center; gap: 2px; flex: 1; justify-content: center; }
.nav-link {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 12px; border-radius: 6px;
  font-size: 0.825rem; font-weight: 500; color: #64748b;
  text-decoration: none; transition: color 0.15s, background 0.15s;
}
.nav-link:hover { color: #e2e8f0; background: #1e293b; }
.nav-link.active { color: #3b82f6; background: rgba(59,130,246,0.1); }
.nav-link.router-link-active { color: #3b82f6; background: rgba(59,130,246,0.1); }

.header-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
.server-status {
  display: flex; align-items: center; gap: 5px;
  cursor: pointer; padding: 4px 8px; border-radius: 6px;
  transition: background 0.15s;
}
.server-status:hover { background: #1e293b; }
.status-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}
.status-dot.online { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
.status-dot.offline { background: #ef4444; }
.status-dot.checking { background: #eab308; animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.status-label { font-size: 0.75rem; color: #64748b; }

.progress-chip { display: flex; align-items: center; gap: 6px; }
.progress-text { font-size: 0.75rem; color: #64748b; font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
.progress-bar { width: 60px; height: 4px; background: #1e293b; border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: #3b82f6; border-radius: 2px; transition: width 0.3s ease; }
</style>
