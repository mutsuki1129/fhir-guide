/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as monaco from 'monaco-editor';
const props = defineProps();
const emit = defineEmits();
const container = ref();
let editor = null;
onMounted(() => {
    if (!container.value)
        return;
    editor = monaco.editor.create(container.value, {
        value: props.modelValue,
        language: props.language ?? 'json',
        theme: 'vs-dark',
        fontSize: props.fontSize ?? 13,
        fontFamily: 'Fira Code, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        wordWrap: 'on',
        automaticLayout: true,
        readOnly: props.readOnly ?? false,
        padding: { top: 12, bottom: 12 },
        bracketPairColorization: { enabled: true },
        renderLineHighlight: 'gutter',
        scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }
    });
    editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        emit('update:modelValue', value);
        emit('change', value);
    });
});
onUnmounted(() => {
    editor?.dispose();
});
// Sync when parent changes the value (e.g., loading a template)
watch(() => props.modelValue, (val) => {
    if (editor && editor.getValue() !== val) {
        const model = editor.getModel();
        if (model) {
            model.pushEditOperations([], [{ range: model.getFullModelRange(), text: val }], () => null);
        }
    }
});
const __VLS_exposed = {
    getValue: () => editor?.getValue() ?? '',
    setValue: (val) => editor?.setValue(val),
    focus: () => editor?.focus()
};
defineExpose(__VLS_exposed);
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
    ref: "container",
    ...{ class: "json-editor" },
    ...{ style: (__VLS_ctx.height ? { height: __VLS_ctx.height } : {}) },
});
/** @type {__VLS_StyleScopedClasses['json-editor']} */ ;
// @ts-ignore
[height, height,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => (__VLS_exposed),
    __typeEmits: {},
    __typeProps: {},
});
export default {};
