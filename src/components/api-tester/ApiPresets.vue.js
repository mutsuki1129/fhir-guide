/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { apiPresets } from '@/data/api-presets';
const emit = defineEmits();
function methodClass(m) {
    const map = {
        GET: 'method-get',
        POST: 'method-post',
        PUT: 'method-put',
        DELETE: 'method-delete',
        PATCH: 'method-patch'
    };
    return map[m] ?? '';
}
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
/** @type {__VLS_StyleScopedClasses['preset-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "api-presets" },
});
/** @type {__VLS_StyleScopedClasses['api-presets']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "presets-header" },
});
/** @type {__VLS_StyleScopedClasses['presets-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "presets-list" },
});
/** @type {__VLS_StyleScopedClasses['presets-list']} */ ;
for (const [p] of __VLS_vFor((__VLS_ctx.apiPresets))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.emit('select', p);
                // @ts-ignore
                [apiPresets, emit,];
            } },
        key: (p.id),
        ...{ class: "preset-item" },
    });
    /** @type {__VLS_StyleScopedClasses['preset-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "method-badge" },
        ...{ class: (__VLS_ctx.methodClass(p.method)) },
    });
    /** @type {__VLS_StyleScopedClasses['method-badge']} */ ;
    (p.method);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "preset-info" },
    });
    /** @type {__VLS_StyleScopedClasses['preset-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "preset-path" },
    });
    /** @type {__VLS_StyleScopedClasses['preset-path']} */ ;
    (p.path);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "preset-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['preset-desc']} */ ;
    (p.description);
    // @ts-ignore
    [methodClass,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
