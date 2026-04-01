/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import CodeBlock from './CodeBlock.vue';
const props = defineProps();
const active = ref(props.examples[0]?.language ?? 'javascript');
const langLabels = {
    javascript: 'JavaScript',
    python: 'Python',
    curl: 'cURL',
    csharp: 'C#',
    java: 'Java'
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "lang-switcher" },
});
/** @type {__VLS_StyleScopedClasses['lang-switcher']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tabs" },
});
/** @type {__VLS_StyleScopedClasses['tabs']} */ ;
for (const [ex] of __VLS_vFor((__VLS_ctx.examples))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.active = ex.language;
                // @ts-ignore
                [examples, active,];
            } },
        key: (ex.language),
        ...{ class: "tab" },
        ...{ class: ({ active: __VLS_ctx.active === ex.language }) },
    });
    /** @type {__VLS_StyleScopedClasses['tab']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    (__VLS_ctx.langLabels[ex.language] ?? ex.language);
    // @ts-ignore
    [active, langLabels,];
}
for (const [ex] of __VLS_vFor((__VLS_ctx.examples))) {
    const __VLS_0 = CodeBlock;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        key: (ex.language),
        code: (ex.code),
        language: (ex.language),
        filename: (__VLS_ctx.langLabels[ex.language]),
    }));
    const __VLS_2 = __VLS_1({
        key: (ex.language),
        code: (ex.code),
        language: (ex.language),
        filename: (__VLS_ctx.langLabels[ex.language]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.active === ex.language) }, null, null);
    // @ts-ignore
    [examples, active, langLabels,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
