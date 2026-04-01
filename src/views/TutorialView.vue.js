/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import MarkdownRenderer from '@/components/tutorial/MarkdownRenderer.vue';
import StepNavigator from '@/components/tutorial/StepNavigator.vue';
import { chapters } from '@/data/chapters';
const route = useRoute();
const chapterId = computed(() => route.params.chapterId);
const stepId = computed(() => route.params.stepId);
const content = ref('');
const loading = ref(false);
const error = ref('');
// Dynamically import markdown content
const contentModules = import.meta.glob('/src/content/chapters/**/*.md', { query: '?raw', import: 'default' });
async function loadContent() {
    loading.value = true;
    error.value = '';
    content.value = '';
    const path = `/src/content/chapters/${chapterId.value}/${stepId.value}.md`;
    try {
        const loader = contentModules[path];
        if (loader) {
            content.value = await loader();
        }
        else {
            content.value = `# 內容建設中\n\n此章節的教學內容正在準備中，敬請期待！\n\n**章節 ID：** \`${chapterId.value}/${stepId.value}\``;
        }
    }
    catch (e) {
        error.value = '無法載入教學內容';
        content.value = '';
    }
    finally {
        loading.value = false;
    }
}
const chapter = computed(() => chapters.find(c => c.id === chapterId.value));
const step = computed(() => chapter.value?.steps.find(s => s.id === stepId.value));
watch([chapterId, stepId], loadContent, { immediate: true });
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tutorial-view" },
});
/** @type {__VLS_StyleScopedClasses['tutorial-view']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tutorial-breadcrumb" },
});
/** @type {__VLS_StyleScopedClasses['tutorial-breadcrumb']} */ ;
if (__VLS_ctx.chapter) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "crumb-chapter" },
    });
    /** @type {__VLS_StyleScopedClasses['crumb-chapter']} */ ;
    (__VLS_ctx.chapter.icon);
    (__VLS_ctx.chapter.title);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#475569",
    'stroke-width': "2",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
    points: "9 18 15 12 9 6",
});
if (__VLS_ctx.step) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "crumb-step" },
    });
    /** @type {__VLS_StyleScopedClasses['crumb-step']} */ ;
    (__VLS_ctx.step.title);
}
if (!__VLS_ctx.loading && !__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "tutorial-content" },
    });
    /** @type {__VLS_StyleScopedClasses['tutorial-content']} */ ;
    const __VLS_0 = MarkdownRenderer;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        content: (__VLS_ctx.content),
    }));
    const __VLS_2 = __VLS_1({
        content: (__VLS_ctx.content),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_5 = StepNavigator;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        chapterId: (__VLS_ctx.chapterId),
        stepId: (__VLS_ctx.stepId),
    }));
    const __VLS_7 = __VLS_6({
        chapterId: (__VLS_ctx.chapterId),
        stepId: (__VLS_ctx.stepId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "tutorial-loading" },
    });
    /** @type {__VLS_StyleScopedClasses['tutorial-loading']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "spinner" },
    });
    /** @type {__VLS_StyleScopedClasses['spinner']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "tutorial-error" },
    });
    /** @type {__VLS_StyleScopedClasses['tutorial-error']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.error);
}
// @ts-ignore
[chapter, chapter, chapter, step, step, loading, loading, error, error, error, content, chapterId, stepId,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
