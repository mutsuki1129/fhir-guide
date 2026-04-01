import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia';
export function useTheme() {
    const settings = useSettingsStore();
    const { isDark } = storeToRefs(settings);
    return { isDark, toggleTheme: settings.toggleTheme };
}
