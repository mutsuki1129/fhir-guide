/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const __VLS_props = defineProps();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['validation-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['validation-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['section-label']} */ ;
/** @type {__VLS_StyleScopedClasses['section-label']} */ ;
/** @type {__VLS_StyleScopedClasses['error-item']} */ ;
/** @type {__VLS_StyleScopedClasses['warning-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-path']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "validation-panel" },
});
/** @type {__VLS_StyleScopedClasses['validation-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "panel-header" },
});
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "panel-title" },
});
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
if (!__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "validation-badge" },
        ...{ class: (__VLS_ctx.result.valid ? 'valid' : 'invalid') },
    });
    /** @type {__VLS_StyleScopedClasses['validation-badge']} */ ;
    (__VLS_ctx.result.valid ? '✅ 通過' : `❌ ${__VLS_ctx.result.errors.length} 個錯誤`);
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "checking-badge" },
    });
    /** @type {__VLS_StyleScopedClasses['checking-badge']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "panel-body" },
});
/** @type {__VLS_StyleScopedClasses['panel-body']} */ ;
if (__VLS_ctx.result.valid && __VLS_ctx.result.warnings.length === 0 && !__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "valid-message" },
    });
    /** @type {__VLS_StyleScopedClasses['valid-message']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#22c55e",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M22 11.08V12a10 10 0 1 1-5.93-9.14",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
        points: "22 4 12 14.01 9 11.01",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
if (__VLS_ctx.result.errors.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section" },
    });
    /** @type {__VLS_StyleScopedClasses['section']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section-label error" },
    });
    /** @type {__VLS_StyleScopedClasses['section-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['error']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "12",
        height: "12",
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "15",
        y1: "9",
        x2: "9",
        y2: "15",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "9",
        y1: "9",
        x2: "15",
        y2: "15",
    });
    (__VLS_ctx.result.errors.length);
    for (const [err, i] of __VLS_vFor((__VLS_ctx.result.errors))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (i),
            ...{ class: "error-item" },
        });
        /** @type {__VLS_StyleScopedClasses['error-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({
            ...{ class: "item-path" },
        });
        /** @type {__VLS_StyleScopedClasses['item-path']} */ ;
        (err.path || 'root');
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "item-msg" },
        });
        /** @type {__VLS_StyleScopedClasses['item-msg']} */ ;
        (err.message);
        // @ts-ignore
        [loading, loading, result, result, result, result, result, result, result, result,];
    }
}
if (__VLS_ctx.result.warnings.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section" },
    });
    /** @type {__VLS_StyleScopedClasses['section']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section-label warning" },
    });
    /** @type {__VLS_StyleScopedClasses['section-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['warning']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "12",
        height: "12",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "12",
        y1: "9",
        x2: "12",
        y2: "13",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.line)({
        x1: "12",
        y1: "17",
        x2: "12.01",
        y2: "17",
    });
    (__VLS_ctx.result.warnings.length);
    for (const [w, i] of __VLS_vFor((__VLS_ctx.result.warnings))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (i),
            ...{ class: "warning-item" },
        });
        /** @type {__VLS_StyleScopedClasses['warning-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({
            ...{ class: "item-path warn" },
        });
        /** @type {__VLS_StyleScopedClasses['item-path']} */ ;
        /** @type {__VLS_StyleScopedClasses['warn']} */ ;
        (w.path);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "item-msg" },
        });
        /** @type {__VLS_StyleScopedClasses['item-msg']} */ ;
        (w.message);
        // @ts-ignore
        [result, result, result,];
    }
}
if (__VLS_ctx.result.valid) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "spec-tip" },
    });
    /** @type {__VLS_StyleScopedClasses['spec-tip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "tip-label" },
    });
    /** @type {__VLS_StyleScopedClasses['tip-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "tip-text" },
    });
    /** @type {__VLS_StyleScopedClasses['tip-text']} */ ;
}
// @ts-ignore
[result,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
