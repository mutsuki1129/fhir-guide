/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { useProgressStore } from '@/stores/progress';
import { chapters } from '@/data/chapters';
const progress = useProgressStore();
const chapterProgress = computed(() => chapters.map(chapter => {
    const total = chapter.steps.length;
    const done = chapter.steps.filter(s => progress.isCompleted(chapter.id, s.id)).length;
    return { ...chapter, total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}));
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['reset-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-tracker" },
});
/** @type {__VLS_StyleScopedClasses['progress-tracker']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tracker-header" },
});
/** @type {__VLS_StyleScopedClasses['tracker-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "tracker-title" },
});
/** @type {__VLS_StyleScopedClasses['tracker-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "tracker-total" },
});
/** @type {__VLS_StyleScopedClasses['tracker-total']} */ ;
(__VLS_ctx.progress.completedCount);
(__VLS_ctx.progress.totalSteps);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "overall-bar" },
});
/** @type {__VLS_StyleScopedClasses['overall-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "overall-fill" },
    ...{ style: ({ width: __VLS_ctx.progress.progressPercent + '%' }) },
});
/** @type {__VLS_StyleScopedClasses['overall-fill']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "overall-percent" },
});
/** @type {__VLS_StyleScopedClasses['overall-percent']} */ ;
(__VLS_ctx.progress.progressPercent);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chapter-list" },
});
/** @type {__VLS_StyleScopedClasses['chapter-list']} */ ;
for (const [c] of __VLS_vFor((__VLS_ctx.chapterProgress))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (c.id),
        ...{ class: "chapter-row" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-row']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chapter-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-icon']} */ ;
    (c.icon);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "chapter-detail" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-detail']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "chapter-meta" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-meta']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chapter-name" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-name']} */ ;
    (c.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chapter-fraction" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-fraction']} */ ;
    (c.done);
    (c.total);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "chapter-bar" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-bar']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "chapter-fill" },
        ...{ style: ({ width: c.percent + '%' }) },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-fill']} */ ;
    if (c.done === c.total && c.total > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "chapter-check" },
        });
        /** @type {__VLS_StyleScopedClasses['chapter-check']} */ ;
    }
    // @ts-ignore
    [progress, progress, progress, progress, chapterProgress,];
}
if (__VLS_ctx.progress.completedCount > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.progress.resetAll) },
        ...{ class: "reset-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['reset-btn']} */ ;
}
// @ts-ignore
[progress, progress,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
