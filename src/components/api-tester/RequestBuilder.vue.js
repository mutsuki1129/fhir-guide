/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, onUnmounted } from 'vue';
import * as monaco from 'monaco-editor';
const props = defineProps();
const emit = defineEmits();
const activeTab = ref('headers');
const headers = ref([
    { key: 'Accept', value: 'application/fhir+json' },
    { key: 'Content-Type', value: 'application/fhir+json' }
]);
const bodyContainer = ref();
let bodyEditor = null;
onMounted(() => {
    if (!bodyContainer.value)
        return;
    bodyEditor = monaco.editor.create(bodyContainer.value, {
        value: '',
        language: 'json',
        theme: 'vs-dark',
        fontSize: 12,
        fontFamily: 'Fira Code, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineNumbers: 'on',
        wordWrap: 'on',
        padding: { top: 8 }
    });
});
onUnmounted(() => {
    bodyEditor?.dispose();
});
function getHeaders() {
    const result = {};
    headers.value.forEach(h => { if (h.key)
        result[h.key] = h.value; });
    return result;
}
function getBody() {
    return bodyEditor?.getValue() ?? '';
}
function setBody(val) {
    bodyEditor?.setValue(val);
}
function addHeader() {
    headers.value.push({ key: '', value: '' });
}
function removeHeader(idx) {
    headers.value.splice(idx, 1);
}
function methodClass(m) {
    const map = {
        GET: 'method-get', POST: 'method-post', PUT: 'method-put',
        DELETE: 'method-delete', PATCH: 'method-patch'
    };
    return map[m] ?? '';
}
const __VLS_exposed = { getHeaders, getBody, setBody, setTab: (t) => { activeTab.value = t; } };
defineExpose(__VLS_exposed);
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
/** @type {__VLS_StyleScopedClasses['url-input']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
/** @type {__VLS_StyleScopedClasses['h-input']} */ ;
/** @type {__VLS_StyleScopedClasses['h-input']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['add-header-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "request-builder" },
});
/** @type {__VLS_StyleScopedClasses['request-builder']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "request-bar" },
});
/** @type {__VLS_StyleScopedClasses['request-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    ...{ onChange: (...[$event]) => {
            __VLS_ctx.emit('update:method', $event.target.value);
            // @ts-ignore
            [emit, method,];
        } },
    value: (__VLS_ctx.method),
    ...{ class: "method-select" },
    ...{ class: (__VLS_ctx.methodClass(__VLS_ctx.method)) },
});
/** @type {__VLS_StyleScopedClasses['method-select']} */ ;
for (const [m] of __VLS_vFor((['GET', 'POST', 'PUT', 'DELETE', 'PATCH']))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: (m),
        value: (m),
    });
    (m);
    // @ts-ignore
    [method, method, methodClass,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.emit('update:urlPath', $event.target.value);
            // @ts-ignore
            [emit,];
        } },
    ...{ onKeydown: (...[$event]) => {
            __VLS_ctx.emit('send');
            // @ts-ignore
            [emit,];
        } },
    value: (__VLS_ctx.urlPath),
    ...{ class: "url-input" },
    placeholder: "/Patient",
});
/** @type {__VLS_StyleScopedClasses['url-input']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.emit('send');
            // @ts-ignore
            [emit, urlPath,];
        } },
    ...{ class: "send-btn" },
    disabled: (__VLS_ctx.loading),
});
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "spinner" },
    });
    /** @type {__VLS_StyleScopedClasses['spinner']} */ ;
}
(__VLS_ctx.loading ? '發送中...' : '發送');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tabs-panel" },
});
/** @type {__VLS_StyleScopedClasses['tabs-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tabs" },
});
/** @type {__VLS_StyleScopedClasses['tabs']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeTab = 'headers';
            // @ts-ignore
            [loading, loading, loading, activeTab,];
        } },
    ...{ class: "tab" },
    ...{ class: ({ active: __VLS_ctx.activeTab === 'headers' }) },
});
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
(__VLS_ctx.headers.length);
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeTab = 'body';
            // @ts-ignore
            [activeTab, activeTab, headers,];
        } },
    ...{ class: "tab" },
    ...{ class: ({ active: __VLS_ctx.activeTab === 'body' }) },
});
/** @type {__VLS_StyleScopedClasses['tab']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tab-content" },
});
/** @type {__VLS_StyleScopedClasses['tab-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "headers-editor" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.activeTab === 'headers') }, null, null);
/** @type {__VLS_StyleScopedClasses['headers-editor']} */ ;
for (const [h, i] of __VLS_vFor((__VLS_ctx.headers))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (i),
        ...{ class: "header-row" },
    });
    /** @type {__VLS_StyleScopedClasses['header-row']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        ...{ class: "h-input key" },
        placeholder: "Header name",
    });
    (h.key);
    /** @type {__VLS_StyleScopedClasses['h-input']} */ ;
    /** @type {__VLS_StyleScopedClasses['key']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        ...{ class: "h-input val" },
        placeholder: "Header value",
    });
    (h.value);
    /** @type {__VLS_StyleScopedClasses['h-input']} */ ;
    /** @type {__VLS_StyleScopedClasses['val']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.removeHeader(i);
                // @ts-ignore
                [activeTab, activeTab, headers, removeHeader,];
            } },
        ...{ class: "remove-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['remove-btn']} */ ;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.addHeader) },
    ...{ class: "add-header-btn" },
});
/** @type {__VLS_StyleScopedClasses['add-header-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "body-editor" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.activeTab === 'body') }, null, null);
/** @type {__VLS_StyleScopedClasses['body-editor']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "bodyContainer",
    ...{ class: "body-monaco" },
});
/** @type {__VLS_StyleScopedClasses['body-monaco']} */ ;
// @ts-ignore
[activeTab, addHeader,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => (__VLS_exposed),
    __typeEmits: {},
    __typeProps: {},
});
export default {};
