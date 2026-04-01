/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';
import { useSettingsStore } from '@/stores/settings';
const settings = useSettingsStore();
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-layout" },
});
/** @type {__VLS_StyleScopedClasses['app-layout']} */ ;
const __VLS_0 = AppHeader;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-body" },
});
/** @type {__VLS_StyleScopedClasses['app-body']} */ ;
const __VLS_5 = AppSidebar;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "app-main" },
});
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
let __VLS_10;
/** @ts-ignore @type {typeof __VLS_components.routerView | typeof __VLS_components.RouterView | typeof __VLS_components.routerView | typeof __VLS_components.RouterView} */
routerView;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({}));
const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
{
    const { default: __VLS_15 } = __VLS_13.slots;
    const [{ Component }] = __VLS_vSlot(__VLS_15);
    let __VLS_16;
    /** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
    Transition;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        name: "fade",
        mode: "out-in",
    }));
    const __VLS_18 = __VLS_17({
        name: "fade",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    const { default: __VLS_21 } = __VLS_19.slots;
    const __VLS_22 = (Component);
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({}));
    const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
    var __VLS_19;
    __VLS_13.slots['' /* empty slot name completion */];
}
var __VLS_13;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
