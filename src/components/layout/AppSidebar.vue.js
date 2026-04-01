/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { chapters } from '@/data/chapters';
import { useProgressStore } from '@/stores/progress';
import { useSettingsStore } from '@/stores/settings';
const route = useRoute();
const progress = useProgressStore();
const settings = useSettingsStore();
const expandedChapters = ref(new Set(['01-basics', '02-setup']));
function toggleChapter(id) {
    if (expandedChapters.value.has(id)) {
        expandedChapters.value.delete(id);
    }
    else {
        expandedChapters.value.add(id);
    }
}
function isActiveStep(chapterId, stepId) {
    return route.params.chapterId === chapterId && route.params.stepId === stepId;
}
function chapterHasActive(chapterId) {
    return route.params.chapterId === chapterId;
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['chapter-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chapter-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chevron']} */ ;
/** @type {__VLS_StyleScopedClasses['step-link']} */ ;
/** @type {__VLS_StyleScopedClasses['step-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['step-link']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
    ...{ class: "sidebar" },
    ...{ class: ({ collapsed: !__VLS_ctx.settings.sidebarOpen }) },
});
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['collapsed']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "sidebar-inner" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-inner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "sidebar-header" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "sidebar-title" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "chapters-count" },
});
/** @type {__VLS_StyleScopedClasses['chapters-count']} */ ;
(__VLS_ctx.chapters.length);
__VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)({
    ...{ class: "chapter-nav" },
});
/** @type {__VLS_StyleScopedClasses['chapter-nav']} */ ;
for (const [chapter] of __VLS_vFor((__VLS_ctx.chapters))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (chapter.id),
        ...{ class: "chapter-group" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.toggleChapter(chapter.id);
                // @ts-ignore
                [settings, chapters, chapters, toggleChapter,];
            } },
        ...{ class: "chapter-header" },
        ...{ class: ({ active: __VLS_ctx.chapterHasActive(chapter.id) }) },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-header']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chapter-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-icon']} */ ;
    (chapter.icon);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chapter-title" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-title']} */ ;
    (chapter.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        ...{ class: "chevron" },
        ...{ class: ({ open: __VLS_ctx.expandedChapters.has(chapter.id) }) },
        width: "12",
        height: "12",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    /** @type {__VLS_StyleScopedClasses['chevron']} */ ;
    /** @type {__VLS_StyleScopedClasses['open']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
        points: "6 9 12 15 18 9",
    });
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
    Transition;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        name: "accordion",
    }));
    const __VLS_2 = __VLS_1({
        name: "accordion",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    if (__VLS_ctx.expandedChapters.has(chapter.id)) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "step-list" },
        });
        /** @type {__VLS_StyleScopedClasses['step-list']} */ ;
        for (const [step] of __VLS_vFor((chapter.steps))) {
            let __VLS_6;
            /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
            routerLink;
            // @ts-ignore
            const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
                key: (step.id),
                to: (`/tutorial/${chapter.id}/${step.id}`),
                ...{ class: "step-link" },
                ...{ class: ({ active: __VLS_ctx.isActiveStep(chapter.id, step.id) }) },
            }));
            const __VLS_8 = __VLS_7({
                key: (step.id),
                to: (`/tutorial/${chapter.id}/${step.id}`),
                ...{ class: "step-link" },
                ...{ class: ({ active: __VLS_ctx.isActiveStep(chapter.id, step.id) }) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_7));
            /** @type {__VLS_StyleScopedClasses['step-link']} */ ;
            /** @type {__VLS_StyleScopedClasses['active']} */ ;
            const { default: __VLS_11 } = __VLS_9.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "step-check" },
            });
            /** @type {__VLS_StyleScopedClasses['step-check']} */ ;
            if (__VLS_ctx.progress.isCompleted(chapter.id, step.id)) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
                    width: "12",
                    height: "12",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "#22c55e",
                    'stroke-width': "3",
                });
                __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
                    points: "20 6 9 17 4 12",
                });
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "step-dot" },
                });
                /** @type {__VLS_StyleScopedClasses['step-dot']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "step-title" },
            });
            /** @type {__VLS_StyleScopedClasses['step-title']} */ ;
            (step.title);
            // @ts-ignore
            [chapterHasActive, expandedChapters, expandedChapters, isActiveStep, progress,];
            var __VLS_9;
            // @ts-ignore
            [];
        }
    }
    // @ts-ignore
    [];
    var __VLS_3;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
