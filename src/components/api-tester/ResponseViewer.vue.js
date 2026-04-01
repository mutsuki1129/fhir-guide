/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
const __VLS_props = defineProps();
const activeTab = ref('body');
function statusClass(status) {
    if (status === 0)
        return 'status-error';
    if (status < 300)
        return 'status-ok';
    if (status < 400)
        return 'status-redirect';
    return 'status-error';
}
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['rtab']} */ ;
/** @type {__VLS_StyleScopedClasses['rtab']} */ ;
/** @type {__VLS_StyleScopedClasses['response-empty']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "response-loading" },
    });
    /** @type {__VLS_StyleScopedClasses['response-loading']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "spinner" },
    });
    /** @type {__VLS_StyleScopedClasses['spinner']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
else if (__VLS_ctx.response) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "response-viewer" },
    });
    /** @type {__VLS_StyleScopedClasses['response-viewer']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "response-header" },
    });
    /** @type {__VLS_StyleScopedClasses['response-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "resp-label" },
    });
    /** @type {__VLS_StyleScopedClasses['resp-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "status-badge" },
        ...{ class: (__VLS_ctx.statusClass(__VLS_ctx.response.status)) },
    });
    /** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
    (__VLS_ctx.response.status);
    (__VLS_ctx.response.statusText);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "duration-badge" },
    });
    /** @type {__VLS_StyleScopedClasses['duration-badge']} */ ;
    (__VLS_ctx.response.duration);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "resp-tabs" },
    });
    /** @type {__VLS_StyleScopedClasses['resp-tabs']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.response))
                    return;
                __VLS_ctx.activeTab = 'body';
                // @ts-ignore
                [loading, response, response, response, response, response, statusClass, activeTab,];
            } },
        ...{ class: "rtab" },
        ...{ class: ({ active: __VLS_ctx.activeTab === 'body' }) },
    });
    /** @type {__VLS_StyleScopedClasses['rtab']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.response))
                    return;
                __VLS_ctx.activeTab = 'headers';
                // @ts-ignore
                [activeTab, activeTab,];
            } },
        ...{ class: "rtab" },
        ...{ class: ({ active: __VLS_ctx.activeTab === 'headers' }) },
    });
    /** @type {__VLS_StyleScopedClasses['rtab']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "response-body" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.activeTab === 'body') }, null, null);
    /** @type {__VLS_StyleScopedClasses['response-body']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({
        ...{ class: "response-pre" },
    });
    /** @type {__VLS_StyleScopedClasses['response-pre']} */ ;
    (__VLS_ctx.response.body);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "response-headers" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.activeTab === 'headers') }, null, null);
    /** @type {__VLS_StyleScopedClasses['response-headers']} */ ;
    for (const [v, k] of __VLS_vFor((__VLS_ctx.response.headers))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (k),
            ...{ class: "header-row" },
        });
        /** @type {__VLS_StyleScopedClasses['header-row']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "header-key" },
        });
        /** @type {__VLS_StyleScopedClasses['header-key']} */ ;
        (k);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "header-val" },
        });
        /** @type {__VLS_StyleScopedClasses['header-val']} */ ;
        (v);
        // @ts-ignore
        [response, response, activeTab, activeTab, activeTab,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "response-empty" },
    });
    /** @type {__VLS_StyleScopedClasses['response-empty']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "36",
        height: "36",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#334155",
        'stroke-width': "1.5",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.circle)({
        cx: "12",
        cy: "12",
        r: "10",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
        points: "12 6 12 12 16 14",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
