/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import { useSettingsStore } from '@/stores/settings';
const settings = useSettingsStore();
const servers = [
    { label: 'HAPI FHIR Public (R4)', url: 'https://hapi.fhir.org/baseR4' },
    { label: 'Local Docker HAPI', url: 'http://localhost:8080/fhir' }
];
const customInput = ref('');
function applyCustom() {
    const url = customInput.value.trim();
    if (url) {
        settings.setServer(url);
        customInput.value = '';
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['server-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['server-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-input']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "server-selector" },
});
/** @type {__VLS_StyleScopedClasses['server-selector']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "label" },
});
/** @type {__VLS_StyleScopedClasses['label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "server-btns" },
});
/** @type {__VLS_StyleScopedClasses['server-btns']} */ ;
for (const [s] of __VLS_vFor((__VLS_ctx.servers))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.settings.setServer(s.url);
                // @ts-ignore
                [servers, settings,];
            } },
        key: (s.url),
        ...{ class: "server-btn" },
        ...{ class: ({ active: __VLS_ctx.settings.currentServer === s.url }) },
    });
    /** @type {__VLS_StyleScopedClasses['server-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    (s.label);
    // @ts-ignore
    [settings,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "custom-server" },
});
/** @type {__VLS_StyleScopedClasses['custom-server']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onKeydown: (__VLS_ctx.applyCustom) },
    ...{ class: "custom-input" },
    placeholder: "自訂 URL（如 http://localhost:8080/fhir）",
});
(__VLS_ctx.customInput);
/** @type {__VLS_StyleScopedClasses['custom-input']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.applyCustom) },
    ...{ class: "apply-btn" },
});
/** @type {__VLS_StyleScopedClasses['apply-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "current-url" },
});
/** @type {__VLS_StyleScopedClasses['current-url']} */ ;
(__VLS_ctx.settings.currentServer);
// @ts-ignore
[settings, applyCustom, applyCustom, customInput,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
