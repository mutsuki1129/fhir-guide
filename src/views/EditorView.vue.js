/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import JsonEditor from '@/components/editor/JsonEditor.vue';
import ValidationPanel from '@/components/editor/ValidationPanel.vue';
import ResourceTemplates from '@/components/editor/ResourceTemplates.vue';
import { useFhirValidation } from '@/composables/useFhirValidation';
// Import template JSONs directly (Vite handles JSON imports natively)
import patientJson from '@/content/templates/patient.json';
import observationJson from '@/content/templates/observation.json';
import encounterJson from '@/content/templates/encounter.json';
import conditionJson from '@/content/templates/condition.json';
import medicationRequestJson from '@/content/templates/medication-request.json';
import bundleJson from '@/content/templates/bundle-transaction.json';
const templates = {
    Patient: patientJson,
    Observation: observationJson,
    Encounter: encounterJson,
    Condition: conditionJson,
    MedicationRequest: medicationRequestJson,
    Bundle: bundleJson
};
const templateNames = Object.keys(templates);
const selectedTemplate = ref('Patient');
const editorValue = ref(JSON.stringify(templates.Patient, null, 2));
const { validate, result } = useFhirValidation();
const validating = ref(false);
let debounceTimer;
function onEditorChange(value) {
    clearTimeout(debounceTimer);
    validating.value = true;
    debounceTimer = setTimeout(() => {
        validate(value);
        validating.value = false;
    }, 500);
}
function selectTemplate(name) {
    selectedTemplate.value = name;
    editorValue.value = JSON.stringify(templates[name], null, 2);
    validate(editorValue.value);
}
// Initial validation
validate(editorValue.value);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "editor-view" },
});
/** @type {__VLS_StyleScopedClasses['editor-view']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "editor-toolbar" },
});
/** @type {__VLS_StyleScopedClasses['editor-toolbar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "toolbar-title" },
});
/** @type {__VLS_StyleScopedClasses['toolbar-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#3b82f6",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
    points: "16 18 22 12 16 6",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
    points: "8 6 2 12 8 18",
});
const __VLS_0 = ResourceTemplates;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onSelect': {} },
    templates: (__VLS_ctx.templateNames),
    selected: (__VLS_ctx.selectedTemplate),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSelect': {} },
    templates: (__VLS_ctx.templateNames),
    selected: (__VLS_ctx.selectedTemplate),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ select: {} },
    { onSelect: (__VLS_ctx.selectTemplate) });
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "editor-body" },
});
/** @type {__VLS_StyleScopedClasses['editor-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "editor-panel" },
});
/** @type {__VLS_StyleScopedClasses['editor-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "panel-header" },
});
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "hint" },
});
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
const __VLS_7 = JsonEditor;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.editorValue),
    language: "json",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.editorValue),
    language: "json",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = ({ change: {} },
    { onChange: (__VLS_ctx.onEditorChange) });
var __VLS_10;
var __VLS_11;
const __VLS_14 = ValidationPanel;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    result: (__VLS_ctx.result),
    loading: (__VLS_ctx.validating),
}));
const __VLS_16 = __VLS_15({
    result: (__VLS_ctx.result),
    loading: (__VLS_ctx.validating),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
// @ts-ignore
[templateNames, selectedTemplate, selectTemplate, editorValue, onEditorChange, result, validating,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
