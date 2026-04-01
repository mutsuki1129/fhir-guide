import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const sidebarOpen = ref(true)
  const currentServer = ref('https://hapi.fhir.org/baseR4')
  const customServerUrl = ref('')

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setServer(url: string) {
    currentServer.value = url
  }

  return { sidebarOpen, toggleSidebar, currentServer, customServerUrl, setServer }
})
