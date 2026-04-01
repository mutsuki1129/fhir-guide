/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, watch } from 'vue';
import { createHighlighter } from 'shiki';
const props = defineProps();
const highlighted = ref('');
const copied = ref(false);
let highlighter = null;
const langMap = {
    javascript: 'typescript',
    python: 'python',
    curl: 'bash',
    csharp: 'csharp',
    java: 'java',
    bash: 'bash',
    json: 'json',
    yaml: 'yaml',
    typescript: 'typescript'
};
async function highlight() {
    if (!highlighter) {
        highlighter = await createHighlighter({
            themes: ['github-dark'],
            langs: ['typescript', 'python', 'bash', 'csharp', 'java', 'json', 'yaml']
        });
    }
    const lang = langMap[props.language] ?? 'text';
    highlighted.value = highlighter.codeToHtml(props.code, {
        lang,
        theme: 'github-dark'
    });
}
async function copy() {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
}
onMounted(highlight);
watch(() => props.code, highlight);
watch(() => props.language, highlight);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['copy-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['code-body']} */ ;
/** @type {__VLS_StyleScopedClasses['code-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "code-block terminal-block" },
});
/** @type {__VLS_StyleScopedClasses['code-block']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-block']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "terminal-header" },
});
/** @type {__VLS_StyleScopedClasses['terminal-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "terminal-dot red" },
});
/** @type {__VLS_StyleScopedClasses['terminal-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['red']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "terminal-dot yellow" },
});
/** @type {__VLS_StyleScopedClasses['terminal-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['yellow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "terminal-dot green" },
});
/** @type {__VLS_StyleScopedClasses['terminal-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "filename" },
});
/** @type {__VLS_StyleScopedClasses['filename']} */ ;
(__VLS_ctx.filename || __VLS_ctx.language);
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.copy) },
    ...{ class: "copy-btn" },
});
/** @type {__VLS_StyleScopedClasses['copy-btn']} */ ;
if (!__VLS_ctx.copied) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "13",
        height: "13",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.rect)({
        x: "9",
        y: "9",
        width: "13",
        height: "13",
        rx: "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.path)({
        d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "13",
        height: "13",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#4ade80",
        'stroke-width': "2.5",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
        points: "20 6 9 17 4 12",
    });
}
(__VLS_ctx.copied ? '已複製' : '複製');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "code-body" },
});
__VLS_asFunctionalDirective(__VLS_directives.vHtml, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.highlighted || `<pre><code>${__VLS_ctx.code}</code></pre>`) }, null, null);
/** @type {__VLS_StyleScopedClasses['code-body']} */ ;
// @ts-ignore
[filename, language, copy, copied, copied, highlighted, code,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
