/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useSettingsStore } from '@/stores/settings';
import { useProgressStore } from '@/stores/progress';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const settings = useSettingsStore();
const progress = useProgressStore();
const route = useRoute();
const serverOnline = ref(null);
async function checkServer() {
    serverOnline.value = null;
    try {
        const res = await fetch(`${settings.currentServer}/metadata`, {
            method: 'GET',
            headers: { Accept: 'application/fhir+json' },
            signal: AbortSignal.timeout(5000)
        });
        serverOnline.value = res.ok;
    }
    catch {
        serverOnline.value = false;
    }
}
onMounted(checkServer);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['sidebar-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['server-status']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "app-header" },
});
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-left" },
});
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.settings.toggleSidebar) },
    ...{ class: "sidebar-toggle" },
    'aria-label': (__VLS_ctx.settings.sidebarOpen ? '收合側邊欄' : '展開側邊欄'),
});
/** @type {__VLS_StyleScopedClasses['sidebar-toggle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.line)({
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.line)({
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.line)({
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18",
});
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "logo" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "logo-icon" },
});
/** @type {__VLS_StyleScopedClasses['logo-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "logo-text" },
});
/** @type {__VLS_StyleScopedClasses['logo-text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "logo-accent" },
});
/** @type {__VLS_StyleScopedClasses['logo-accent']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "version-badge" },
});
/** @type {__VLS_StyleScopedClasses['version-badge']} */ ;
// @ts-ignore
[settings, settings,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)({
    ...{ class: "header-nav" },
});
/** @type {__VLS_StyleScopedClasses['header-nav']} */ ;
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    to: "/tutorial/01-basics/01-what-is-fhir",
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.route.path.startsWith('/tutorial') }) },
}));
const __VLS_8 = __VLS_7({
    to: "/tutorial/01-basics/01-what-is-fhir",
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.route.path.startsWith('/tutorial') }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
const { default: __VLS_11 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
});
// @ts-ignore
[route,];
var __VLS_9;
let __VLS_12;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    to: "/editor",
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.route.path === '/editor' }) },
}));
const __VLS_14 = __VLS_13({
    to: "/editor",
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.route.path === '/editor' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
    points: "16 18 22 12 16 6",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
    points: "8 6 2 12 8 18",
});
// @ts-ignore
[route,];
var __VLS_15;
let __VLS_18;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    to: "/api-tester",
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.route.path === '/api-tester' }) },
}));
const __VLS_20 = __VLS_19({
    to: "/api-tester",
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.route.path === '/api-tester' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
    cx: "12",
    cy: "12",
    r: "10",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
    points: "12 6 12 12 16 14",
});
// @ts-ignore
[route,];
var __VLS_21;
let __VLS_24;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    to: "/reference",
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.route.path === '/reference' }) },
}));
const __VLS_26 = __VLS_25({
    to: "/reference",
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.route.path === '/reference' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
const { default: __VLS_29 } = __VLS_27.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
    points: "14 2 14 8 20 8",
});
// @ts-ignore
[route,];
var __VLS_27;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-right" },
});
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.settings.toggleTheme) },
    ...{ class: "theme-toggle" },
    'aria-label': (__VLS_ctx.settings.isDark ? '切換為亮色模式' : '切換為暗色模式'),
    title: (__VLS_ctx.settings.isDark ? '切換為亮色模式' : '切換為暗色模式'),
});
/** @type {__VLS_StyleScopedClasses['theme-toggle']} */ ;
if (__VLS_ctx.settings.isDark) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
        cx: "12",
        cy: "12",
        r: "5",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "12",
        y1: "1",
        x2: "12",
        y2: "3",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "12",
        y1: "21",
        x2: "12",
        y2: "23",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "4.22",
        y1: "4.22",
        x2: "5.64",
        y2: "5.64",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "18.36",
        y1: "18.36",
        x2: "19.78",
        y2: "19.78",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "1",
        y1: "12",
        x2: "3",
        y2: "12",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "21",
        y1: "12",
        x2: "23",
        y2: "12",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "4.22",
        y1: "19.78",
        x2: "5.64",
        y2: "18.36",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "18.36",
        y1: "5.64",
        x2: "19.78",
        y2: "4.22",
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    });
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (__VLS_ctx.checkServer) },
    ...{ class: "server-status" },
    title: "點擊重新檢測",
});
/** @type {__VLS_StyleScopedClasses['server-status']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "status-dot" },
    ...{ class: (__VLS_ctx.serverOnline === null ? 'checking' : __VLS_ctx.serverOnline ? 'online' : 'offline') },
});
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "status-label" },
});
/** @type {__VLS_StyleScopedClasses['status-label']} */ ;
(__VLS_ctx.serverOnline === null ? '檢測中...' : __VLS_ctx.serverOnline ? 'HAPI 在線' : 'HAPI 離線');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-chip" },
});
/** @type {__VLS_StyleScopedClasses['progress-chip']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "progress-text" },
});
/** @type {__VLS_StyleScopedClasses['progress-text']} */ ;
(__VLS_ctx.progress.completedCount);
(__VLS_ctx.progress.totalSteps);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-bar" },
});
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-fill" },
    ...{ style: ({ width: __VLS_ctx.progress.progressPercent + '%' }) },
});
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
// @ts-ignore
[settings, settings, settings, settings, checkServer, serverOnline, serverOnline, serverOnline, serverOnline, progress, progress, progress,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
