import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
export const useSettingsStore = defineStore('settings', () => {
    const sidebarOpen = ref(true);
    const currentServer = ref('https://hapi.fhir.org/baseR4');
    const customServerUrl = ref('');
    const isDark = ref(localStorage.getItem('theme') !== 'light');
    function toggleSidebar() {
        sidebarOpen.value = !sidebarOpen.value;
    }
    function setServer(url) {
        currentServer.value = url;
    }
    function toggleTheme() {
        isDark.value = !isDark.value;
    }
    watch(isDark, (dark) => {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        document.documentElement.classList.toggle('light', !dark);
    }, { immediate: true });
    return { sidebarOpen, toggleSidebar, currentServer, customServerUrl, setServer, isDark, toggleTheme };
});
