/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
const props = defineProps();
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
}).use(markdownItAnchor, { permalink: markdownItAnchor.permalink.headerLink() });
// Custom containers (:::tip, :::warning, :::danger)
md.core.ruler.push('custom_container', (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'inline') {
            const content = tokens[i].content;
            const match = content.match(/^:::(tip|warning|danger)\s*(.*)$/);
            if (match) {
                tokens[i].content = `<div class="${match[1]}"><div class="${match[1]}-title">${match[2] || match[1].toUpperCase()}</div>`;
            }
            if (content.trim() === ':::') {
                tokens[i].content = '</div>';
            }
        }
    }
});
const rendered = ref('');
watch(() => props.content, (val) => {
    rendered.value = md.render(val || '');
}, { immediate: true });
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "markdown-content" },
});
__VLS_asFunctionalDirective(__VLS_directives.vHtml, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.rendered) }, null, null);
/** @type {__VLS_StyleScopedClasses['markdown-content']} */ ;
// @ts-ignore
[rendered,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
