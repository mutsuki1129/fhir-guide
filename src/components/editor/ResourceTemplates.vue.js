/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const __VLS_props = defineProps();
const emit = defineEmits();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['template-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['template-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "resource-templates" },
});
/** @type {__VLS_StyleScopedClasses['resource-templates']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "templates-label" },
});
/** @type {__VLS_StyleScopedClasses['templates-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "template-btns" },
});
/** @type {__VLS_StyleScopedClasses['template-btns']} */ ;
for (const [name] of __VLS_vFor((__VLS_ctx.templates))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.emit('select', name);
                // @ts-ignore
                [templates, emit,];
            } },
        key: (name),
        ...{ class: "template-btn" },
        ...{ class: ({ active: __VLS_ctx.selected === name }) },
    });
    /** @type {__VLS_StyleScopedClasses['template-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    (name);
    // @ts-ignore
    [selected,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
