/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useProgressStore } from '@/stores/progress';
import { chapters } from '@/data/chapters';
const progress = useProgressStore();
const features = [
    {
        icon: '📚',
        title: '互動式教學',
        desc: '7 章節完整教學，從 FHIR 基礎到實戰專案，進度自動記錄',
        route: '/tutorial/01-basics/01-what-is-fhir',
        btnText: '開始學習'
    },
    {
        icon: '⚡',
        title: 'JSON 編輯器',
        desc: 'Monaco Editor 即時驗證 FHIR R4 JSON，內建 6 種 Resource 範本',
        route: '/editor',
        btnText: '開啟編輯器'
    },
    {
        icon: '🔗',
        title: 'API 測試面板',
        desc: '類 Postman 介面，直連 HAPI FHIR 公開伺服器，10+ 預設範例',
        route: '/api-tester',
        btnText: '開始測試'
    },
    {
        icon: '📖',
        title: 'Resource 參考',
        desc: 'FHIR R4 核心資源快速參考、術語系統與搜尋參數一覽',
        route: '/reference',
        btnText: '查閱參考'
    }
];
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-card']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-card']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['chapter-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "home" },
});
/** @type {__VLS_StyleScopedClasses['home']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "hero" },
});
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "hero-badge" },
});
/** @type {__VLS_StyleScopedClasses['hero-badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "hero-title" },
});
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "hero-title-main" },
});
/** @type {__VLS_StyleScopedClasses['hero-title-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "hero-title-sub" },
});
/** @type {__VLS_StyleScopedClasses['hero-title-sub']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "hero-desc" },
});
/** @type {__VLS_StyleScopedClasses['hero-desc']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "hero-actions" },
});
/** @type {__VLS_StyleScopedClasses['hero-actions']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: "/tutorial/01-basics/01-what-is-fhir",
    ...{ class: "btn-primary" },
}));
const __VLS_2 = __VLS_1({
    to: "/tutorial/01-basics/01-what-is-fhir",
    ...{ class: "btn-primary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
var __VLS_3;
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
routerLink;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    to: "/api-tester",
    ...{ class: "btn-secondary" },
}));
const __VLS_8 = __VLS_7({
    to: "/api-tester",
    ...{ class: "btn-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
const { default: __VLS_11 } = __VLS_9.slots;
var __VLS_9;
if (__VLS_ctx.progress.completedCount > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "progress-card" },
    });
    /** @type {__VLS_StyleScopedClasses['progress-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "progress-card-header" },
    });
    /** @type {__VLS_StyleScopedClasses['progress-card-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "progress-card-title" },
    });
    /** @type {__VLS_StyleScopedClasses['progress-card-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "progress-percent" },
    });
    /** @type {__VLS_StyleScopedClasses['progress-percent']} */ ;
    (__VLS_ctx.progress.progressPercent);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "progress-track" },
    });
    /** @type {__VLS_StyleScopedClasses['progress-track']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "progress-track-fill" },
        ...{ style: ({ width: __VLS_ctx.progress.progressPercent + '%' }) },
    });
    /** @type {__VLS_StyleScopedClasses['progress-track-fill']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "progress-detail" },
    });
    /** @type {__VLS_StyleScopedClasses['progress-detail']} */ ;
    (__VLS_ctx.progress.completedCount);
    (__VLS_ctx.progress.totalSteps);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "features-grid" },
});
/** @type {__VLS_StyleScopedClasses['features-grid']} */ ;
for (const [f] of __VLS_vFor((__VLS_ctx.features))) {
    let __VLS_12;
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        key: (f.title),
        to: (f.route),
        ...{ class: "feature-card" },
    }));
    const __VLS_14 = __VLS_13({
        key: (f.title),
        to: (f.route),
        ...{ class: "feature-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {__VLS_StyleScopedClasses['feature-card']} */ ;
    const { default: __VLS_17 } = __VLS_15.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "feature-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['feature-icon']} */ ;
    (f.icon);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "feature-body" },
    });
    /** @type {__VLS_StyleScopedClasses['feature-body']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
        ...{ class: "feature-title" },
    });
    /** @type {__VLS_StyleScopedClasses['feature-title']} */ ;
    (f.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "feature-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['feature-desc']} */ ;
    (f.desc);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "feature-arrow" },
    });
    /** @type {__VLS_StyleScopedClasses['feature-arrow']} */ ;
    // @ts-ignore
    [progress, progress, progress, progress, progress, features,];
    var __VLS_15;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chapters-section" },
});
/** @type {__VLS_StyleScopedClasses['chapters-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chapters-list" },
});
/** @type {__VLS_StyleScopedClasses['chapters-list']} */ ;
for (const [chapter] of __VLS_vFor((__VLS_ctx.chapters))) {
    let __VLS_18;
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        key: (chapter.id),
        to: (`/tutorial/${chapter.id}/${chapter.steps[0].id}`),
        ...{ class: "chapter-card" },
    }));
    const __VLS_20 = __VLS_19({
        key: (chapter.id),
        to: (`/tutorial/${chapter.id}/${chapter.steps[0].id}`),
        ...{ class: "chapter-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    /** @type {__VLS_StyleScopedClasses['chapter-card']} */ ;
    const { default: __VLS_23 } = __VLS_21.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chapter-icon-lg" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-icon-lg']} */ ;
    (chapter.icon);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "chapter-info" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chapter-name" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-name']} */ ;
    (chapter.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chapter-steps" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-steps']} */ ;
    (chapter.steps.length);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "chapter-arrow" },
    });
    /** @type {__VLS_StyleScopedClasses['chapter-arrow']} */ ;
    // @ts-ignore
    [chapters,];
    var __VLS_21;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stack-section" },
});
/** @type {__VLS_StyleScopedClasses['stack-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "stack-label" },
});
/** @type {__VLS_StyleScopedClasses['stack-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stack-badges" },
});
/** @type {__VLS_StyleScopedClasses['stack-badges']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "badge" },
});
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "badge" },
});
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "badge" },
});
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "badge" },
});
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "badge" },
});
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "badge" },
});
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "badge" },
});
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
