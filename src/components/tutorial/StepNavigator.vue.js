/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { getPrevStep, getNextStep } from '@/data/chapters';
import { useProgressStore } from '@/stores/progress';
const props = defineProps();
const router = useRouter();
const progress = useProgressStore();
const prev = computed(() => getPrevStep(props.chapterId, props.stepId));
const next = computed(() => getNextStep(props.chapterId, props.stepId));
const isDone = computed(() => progress.isCompleted(props.chapterId, props.stepId));
function markAndNext() {
    progress.markComplete(props.chapterId, props.stepId);
    if (next.value) {
        router.push(`/tutorial/${next.value.chapterId}/${next.value.id}`);
    }
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
/** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mark-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "step-nav" },
});
/** @type {__VLS_StyleScopedClasses['step-nav']} */ ;
if (__VLS_ctx.prev) {
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        to: (`/tutorial/${__VLS_ctx.prev.chapterId}/${__VLS_ctx.prev.id}`),
        ...{ class: "nav-btn prev" },
    }));
    const __VLS_2 = __VLS_1({
        to: (`/tutorial/${__VLS_ctx.prev.chapterId}/${__VLS_ctx.prev.id}`),
        ...{ class: "nav-btn prev" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['prev']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
        points: "15 18 9 12 15 6",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.prev.title);
    // @ts-ignore
    [prev, prev, prev, prev,];
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "nav-btn-placeholder" },
    });
    /** @type {__VLS_StyleScopedClasses['nav-btn-placeholder']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isDone ? __VLS_ctx.progress.markIncomplete(__VLS_ctx.chapterId, __VLS_ctx.stepId) : __VLS_ctx.markAndNext();
            // @ts-ignore
            [isDone, progress, chapterId, stepId, markAndNext,];
        } },
    ...{ class: "mark-btn" },
    ...{ class: ({ done: __VLS_ctx.isDone }) },
});
/** @type {__VLS_StyleScopedClasses['mark-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
if (__VLS_ctx.isDone) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2.5",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
        points: "20 6 9 17 4 12",
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "14",
        height: "14",
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
        points: "12 8 12 12 14 14",
    });
}
(__VLS_ctx.isDone ? '已完成' : (__VLS_ctx.next ? '完成並繼續' : '標記完成'));
if (__VLS_ctx.next) {
    let __VLS_6;
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        to: (`/tutorial/${__VLS_ctx.next.chapterId}/${__VLS_ctx.next.id}`),
        ...{ class: "nav-btn next" },
    }));
    const __VLS_8 = __VLS_7({
        to: (`/tutorial/${__VLS_ctx.next.chapterId}/${__VLS_ctx.next.id}`),
        ...{ class: "nav-btn next" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['next']} */ ;
    const { default: __VLS_11 } = __VLS_9.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.next.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.polyline)({
        points: "9 18 15 12 9 6",
    });
    // @ts-ignore
    [isDone, isDone, isDone, next, next, next, next, next,];
    var __VLS_9;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "nav-btn-placeholder" },
    });
    /** @type {__VLS_StyleScopedClasses['nav-btn-placeholder']} */ ;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
