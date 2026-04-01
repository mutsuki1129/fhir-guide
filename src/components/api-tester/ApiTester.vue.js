/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import ServerSelector from './ServerSelector.vue';
import ApiPresets from './ApiPresets.vue';
import RequestBuilder from './RequestBuilder.vue';
import ResponseViewer from './ResponseViewer.vue';
import { useApiTester } from '@/composables/useApiTester';
const { send, loading, lastResponse, history, clearHistory } = useApiTester();
const method = ref('GET');
const urlPath = ref('/metadata');
const historyOpen = ref(false);
const requestBuilderRef = ref();
async function sendRequest() {
    if (!requestBuilderRef.value)
        return;
    const headers = requestBuilderRef.value.getHeaders();
    const body = requestBuilderRef.value.getBody();
    await send({ method: method.value, url: urlPath.value, headers, body });
}
function applyPreset(preset) {
    method.value = preset.method;
    urlPath.value = preset.path;
    if (preset.body && requestBuilderRef.value) {
        requestBuilderRef.value.setBody(preset.body);
        requestBuilderRef.value.setTab('body');
    }
    else if (requestBuilderRef.value) {
        requestBuilderRef.value.setBody('');
        requestBuilderRef.value.setTab('headers');
    }
}
function loadFromHistory(h) {
    method.value = h.method;
    urlPath.value = h.url;
    requestBuilderRef.value?.setBody(h.body || '');
    historyOpen.value = false;
}
function methodClass(m) {
    const map = {
        GET: 'method-get', POST: 'method-post', PUT: 'method-put',
        DELETE: 'method-delete', PATCH: 'method-patch'
    };
    return map[m] ?? '';
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['history-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['history-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['history-item']} */ ;
/** @type {__VLS_StyleScopedClasses['history-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "api-tester" },
});
/** @type {__VLS_StyleScopedClasses['api-tester']} */ ;
const __VLS_0 = ServerSelector;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tester-body" },
});
/** @type {__VLS_StyleScopedClasses['tester-body']} */ ;
const __VLS_5 = ApiPresets;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    ...{ 'onSelect': {} },
}));
const __VLS_7 = __VLS_6({
    ...{ 'onSelect': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_10;
const __VLS_11 = ({ select: {} },
    { onSelect: (__VLS_ctx.applyPreset) });
var __VLS_8;
var __VLS_9;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "main-panel" },
});
/** @type {__VLS_StyleScopedClasses['main-panel']} */ ;
const __VLS_12 = RequestBuilder;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ 'onSend': {} },
    ref: "requestBuilderRef",
    method: (__VLS_ctx.method),
    urlPath: (__VLS_ctx.urlPath),
    loading: (__VLS_ctx.loading),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onSend': {} },
    ref: "requestBuilderRef",
    method: (__VLS_ctx.method),
    urlPath: (__VLS_ctx.urlPath),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
const __VLS_18 = ({ send: {} },
    { onSend: (__VLS_ctx.sendRequest) });
var __VLS_19 = {};
var __VLS_15;
var __VLS_16;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "history-bar" },
});
/** @type {__VLS_StyleScopedClasses['history-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.historyOpen = !__VLS_ctx.historyOpen;
            // @ts-ignore
            [applyPreset, method, urlPath, loading, sendRequest, historyOpen, historyOpen,];
        } },
    ...{ class: "history-toggle" },
    ...{ class: ({ active: __VLS_ctx.historyOpen }) },
});
/** @type {__VLS_StyleScopedClasses['history-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
    points: "12 6 12 12 16 14",
});
(__VLS_ctx.history.length);
if (__VLS_ctx.history.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.clearHistory) },
        ...{ class: "clear-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
}
if (__VLS_ctx.historyOpen) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "history-drawer" },
    });
    /** @type {__VLS_StyleScopedClasses['history-drawer']} */ ;
    if (__VLS_ctx.history.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "empty-msg" },
        });
        /** @type {__VLS_StyleScopedClasses['empty-msg']} */ ;
    }
    for (const [h] of __VLS_vFor((__VLS_ctx.history))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.historyOpen))
                        return;
                    __VLS_ctx.loadFromHistory(h);
                    // @ts-ignore
                    [historyOpen, historyOpen, history, history, history, history, clearHistory, loadFromHistory,];
                } },
            key: (h.id),
            ...{ class: "history-item" },
        });
        /** @type {__VLS_StyleScopedClasses['history-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "h-method" },
            ...{ class: (__VLS_ctx.methodClass(h.method)) },
        });
        /** @type {__VLS_StyleScopedClasses['h-method']} */ ;
        (h.method);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "h-url" },
        });
        /** @type {__VLS_StyleScopedClasses['h-url']} */ ;
        (h.url);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "h-time" },
        });
        /** @type {__VLS_StyleScopedClasses['h-time']} */ ;
        (new Date(h.timestamp).toLocaleTimeString());
        // @ts-ignore
        [methodClass,];
    }
}
const __VLS_21 = ResponseViewer;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    response: (__VLS_ctx.lastResponse),
    loading: (__VLS_ctx.loading),
}));
const __VLS_23 = __VLS_22({
    response: (__VLS_ctx.lastResponse),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
// @ts-ignore
var __VLS_20 = __VLS_19;
// @ts-ignore
[loading, lastResponse,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
