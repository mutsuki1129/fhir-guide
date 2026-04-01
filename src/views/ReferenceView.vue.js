/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/owner/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
const sections = [
    {
        id: 'resources',
        title: 'Core Resources',
        items: [
            { name: 'Patient', desc: '病患人口學資料', emoji: '👤', required: ['resourceType', 'id'], key: ['name', 'gender', 'birthDate', 'identifier', 'telecom', 'address'] },
            { name: 'Observation', desc: '臨床觀察（生命徵象、檢驗值）', emoji: '📊', required: ['resourceType', 'status', 'code'], key: ['subject', 'effectiveDateTime', 'valueQuantity', 'component'] },
            { name: 'Encounter', desc: '就診紀錄（門診、急診、住院）', emoji: '🏥', required: ['resourceType', 'status', 'class'], key: ['subject', 'period', 'reasonCode', 'participant'] },
            { name: 'Condition', desc: '診斷條件、疾病、症狀', emoji: '🩺', required: ['resourceType', 'subject'], key: ['clinicalStatus', 'verificationStatus', 'code', 'severity', 'onsetDateTime'] },
            { name: 'MedicationRequest', desc: '用藥醫囑', emoji: '💊', required: ['resourceType', 'status', 'intent', 'subject'], key: ['medicationCodeableConcept', 'dosageInstruction', 'dispenseRequest'] },
            { name: 'Bundle', desc: '多資源容器（Transaction/Batch/Document）', emoji: '📦', required: ['resourceType', 'type'], key: ['entry', 'total', 'link'] },
            { name: 'Practitioner', desc: '醫療人員（醫師、護理師等）', emoji: '👨‍⚕️', required: ['resourceType'], key: ['identifier', 'name', 'qualification', 'telecom'] },
            { name: 'Organization', desc: '醫療機構、部門', emoji: '🏨', required: ['resourceType'], key: ['identifier', 'name', 'type', 'telecom', 'address'] },
            { name: 'DiagnosticReport', desc: '診斷報告（影像報告、病理報告）', emoji: '📋', required: ['resourceType', 'status', 'code'], key: ['subject', 'issued', 'result', 'conclusion'] },
            { name: 'Immunization', desc: '疫苗接種紀錄', emoji: '💉', required: ['resourceType', 'status', 'vaccineCode', 'patient', 'occurrenceDateTime'], key: ['doseQuantity', 'performer', 'lotNumber'] },
        ]
    },
    {
        id: 'search',
        title: '搜尋參數',
        params: [
            { param: '_id', type: 'token', desc: 'Resource 的邏輯 ID', example: '/Patient?_id=123' },
            { param: '_lastUpdated', type: 'date', desc: '最後更新時間', example: '/Patient?_lastUpdated=gt2024-01-01' },
            { param: '_count', type: 'number', desc: '每頁回傳筆數', example: '/Patient?_count=20' },
            { param: '_offset', type: 'number', desc: '跳過前 N 筆', example: '/Patient?_offset=20&_count=20' },
            { param: '_sort', type: 'string', desc: '排序欄位（-前置表降序）', example: '/Patient?_sort=-_lastUpdated' },
            { param: '_include', type: 'string', desc: '同時取得相關 Resource', example: '/Encounter?_include=Encounter:patient' },
            { param: '_revinclude', type: 'string', desc: '反向取得引用此資源的 Resource', example: '/Patient?_revinclude=Observation:patient' },
            { param: '_summary', type: 'token', desc: '回傳摘要（true/false/count）', example: '/Patient?_summary=count' },
            { param: 'name', type: 'string', desc: 'Patient 姓名', example: '/Patient?name=王大明' },
            { param: 'identifier', type: 'token', desc: '識別碼（如身份證）', example: '/Patient?identifier=A123456789' },
            { param: 'birthdate', type: 'date', desc: 'Patient 生日', example: '/Patient?birthdate=1985-03-15' },
            { param: 'gender', type: 'token', desc: 'Patient 性別', example: '/Patient?gender=male' },
            { param: 'patient', type: 'reference', desc: '關聯的 Patient', example: '/Observation?patient=Patient/123' },
            { param: 'code', type: 'token', desc: '編碼（如 LOINC）', example: '/Observation?code=8480-6' },
            { param: 'date', type: 'date', desc: '觀察/就診日期', example: '/Observation?date=ge2024-01-01' },
            { param: 'status', type: 'token', desc: '狀態', example: '/Encounter?status=finished' },
        ]
    },
    {
        id: 'operations',
        title: 'Operations',
        ops: [
            { name: '$validate', scope: 'type/instance', desc: '驗證 Resource 是否符合規範', example: 'POST /Patient/$validate' },
            { name: '$everything', scope: 'instance', desc: '取得病患所有相關資源', example: 'GET /Patient/{id}/$everything' },
            { name: '$expand', scope: 'type/instance', desc: '展開 ValueSet 的所有值', example: 'GET /ValueSet/{id}/$expand' },
            { name: '$lookup', scope: 'type', desc: '查詢 CodeSystem 中的特定編碼', example: 'GET /CodeSystem/$lookup?system=http://loinc.org&code=8480-6' },
            { name: '$translate', scope: 'type', desc: '概念對應（術語轉換）', example: 'POST /ConceptMap/$translate' },
            { name: '$match', scope: 'type', desc: '病患匹配（重複資料偵測）', example: 'POST /Patient/$match' },
            { name: '$document', scope: 'instance', desc: '將 Composition 轉換為 Document Bundle', example: 'POST /Composition/{id}/$document' },
        ]
    },
    {
        id: 'terminology',
        title: '術語系統速查',
        systems: [
            { name: 'LOINC', url: 'http://loinc.org', usage: '檢驗項目、生命徵象、文件類型', example: '8480-6（收縮壓）、18723-7（血液學報告）' },
            { name: 'SNOMED CT', url: 'http://snomed.info/sct', usage: '臨床術語（診斷、程序、身體部位）', example: '38341003（高血壓）、73211009（糖尿病）' },
            { name: 'ICD-10', url: 'http://hl7.org/fhir/sid/icd-10', usage: '疾病診斷分類', example: 'I10（高血壓）、E11（第2型糖尿病）' },
            { name: 'RxNorm', url: 'http://www.nlm.nih.gov/research/umls/rxnorm', usage: '藥品（美國）', example: '308460（Amlodipine 5mg）' },
            { name: '健保藥品碼', url: 'https://www.nhi.gov.tw/drugcode', usage: '台灣健保藥品', example: 'AC37100100（Amlodipine 5mg Tab）' },
            { name: 'ATC', url: 'http://www.whocc.no/atc', usage: 'WHO 藥品解剖治療化學分類', example: 'C08CA01（Amlodipine）' },
            { name: 'ICD-10-PCS', url: 'http://www.icd10data.com/icd10pcs', usage: '手術及處置編碼', example: '0RG10J0（頸椎融合術）' },
            { name: '健保處置碼', url: 'https://www.nhi.gov.tw', usage: '台灣健保醫療處置碼', example: '28001C（全血計數）' },
        ]
    }
];
const activeSection = ref('resources');
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ref-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['field-label']} */ ;
/** @type {__VLS_StyleScopedClasses['field-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-table']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "reference-view" },
});
/** @type {__VLS_StyleScopedClasses['reference-view']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ref-header" },
});
/** @type {__VLS_StyleScopedClasses['ref-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "ref-title" },
});
/** @type {__VLS_StyleScopedClasses['ref-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "ref-desc" },
});
/** @type {__VLS_StyleScopedClasses['ref-desc']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ref-nav" },
});
/** @type {__VLS_StyleScopedClasses['ref-nav']} */ ;
for (const [s] of __VLS_vFor((__VLS_ctx.sections))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeSection = s.id;
                // @ts-ignore
                [sections, activeSection,];
            } },
        key: (s.id),
        ...{ class: "ref-nav-btn" },
        ...{ class: ({ active: __VLS_ctx.activeSection === s.id }) },
    });
    /** @type {__VLS_StyleScopedClasses['ref-nav-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    (s.title);
    // @ts-ignore
    [activeSection,];
}
if (__VLS_ctx.activeSection === 'resources') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section-content" },
    });
    /** @type {__VLS_StyleScopedClasses['section-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "resource-grid" },
    });
    /** @type {__VLS_StyleScopedClasses['resource-grid']} */ ;
    for (const [res] of __VLS_vFor((__VLS_ctx.sections[0].items))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (res.name),
            ...{ class: "resource-card" },
        });
        /** @type {__VLS_StyleScopedClasses['resource-card']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "res-header" },
        });
        /** @type {__VLS_StyleScopedClasses['res-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "res-emoji" },
        });
        /** @type {__VLS_StyleScopedClasses['res-emoji']} */ ;
        (res.emoji);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "res-name" },
        });
        /** @type {__VLS_StyleScopedClasses['res-name']} */ ;
        (res.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "res-desc" },
        });
        /** @type {__VLS_StyleScopedClasses['res-desc']} */ ;
        (res.desc);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "res-fields" },
        });
        /** @type {__VLS_StyleScopedClasses['res-fields']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "field-group" },
        });
        /** @type {__VLS_StyleScopedClasses['field-group']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "field-label required" },
        });
        /** @type {__VLS_StyleScopedClasses['field-label']} */ ;
        /** @type {__VLS_StyleScopedClasses['required']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "field-tags" },
        });
        /** @type {__VLS_StyleScopedClasses['field-tags']} */ ;
        for (const [f] of __VLS_vFor((res.required.slice(1)))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                key: (f),
                ...{ class: "field-tag req" },
            });
            /** @type {__VLS_StyleScopedClasses['field-tag']} */ ;
            /** @type {__VLS_StyleScopedClasses['req']} */ ;
            (f);
            // @ts-ignore
            [sections, activeSection,];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "field-group" },
        });
        /** @type {__VLS_StyleScopedClasses['field-group']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "field-label" },
        });
        /** @type {__VLS_StyleScopedClasses['field-label']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "field-tags" },
        });
        /** @type {__VLS_StyleScopedClasses['field-tags']} */ ;
        for (const [f] of __VLS_vFor((res.key))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                key: (f),
                ...{ class: "field-tag" },
            });
            /** @type {__VLS_StyleScopedClasses['field-tag']} */ ;
            (f);
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
    }
}
if (__VLS_ctx.activeSection === 'search') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section-content" },
    });
    /** @type {__VLS_StyleScopedClasses['section-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.table, __VLS_intrinsics.table)({
        ...{ class: "ref-table" },
    });
    /** @type {__VLS_StyleScopedClasses['ref-table']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.thead, __VLS_intrinsics.thead)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
    for (const [p] of __VLS_vFor((__VLS_ctx.sections[1].params))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
            key: (p.param),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
        (p.param);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "type-badge" },
        });
        /** @type {__VLS_StyleScopedClasses['type-badge']} */ ;
        (p.type);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (p.desc);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({
            ...{ class: "example-code" },
        });
        /** @type {__VLS_StyleScopedClasses['example-code']} */ ;
        (p.example);
        // @ts-ignore
        [sections, activeSection,];
    }
}
if (__VLS_ctx.activeSection === 'operations') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section-content" },
    });
    /** @type {__VLS_StyleScopedClasses['section-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ops-list" },
    });
    /** @type {__VLS_StyleScopedClasses['ops-list']} */ ;
    for (const [op] of __VLS_vFor((__VLS_ctx.sections[2].ops))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (op.name),
            ...{ class: "op-card" },
        });
        /** @type {__VLS_StyleScopedClasses['op-card']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "op-header" },
        });
        /** @type {__VLS_StyleScopedClasses['op-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "op-name" },
        });
        /** @type {__VLS_StyleScopedClasses['op-name']} */ ;
        (op.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "op-scope" },
        });
        /** @type {__VLS_StyleScopedClasses['op-scope']} */ ;
        (op.scope);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "op-desc" },
        });
        /** @type {__VLS_StyleScopedClasses['op-desc']} */ ;
        (op.desc);
        __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({
            ...{ class: "op-example" },
        });
        /** @type {__VLS_StyleScopedClasses['op-example']} */ ;
        (op.example);
        // @ts-ignore
        [sections, activeSection,];
    }
}
if (__VLS_ctx.activeSection === 'terminology') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section-content" },
    });
    /** @type {__VLS_StyleScopedClasses['section-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "term-list" },
    });
    /** @type {__VLS_StyleScopedClasses['term-list']} */ ;
    for (const [sys] of __VLS_vFor((__VLS_ctx.sections[3].systems))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (sys.name),
            ...{ class: "term-card" },
        });
        /** @type {__VLS_StyleScopedClasses['term-card']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "term-header" },
        });
        /** @type {__VLS_StyleScopedClasses['term-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "term-name" },
        });
        /** @type {__VLS_StyleScopedClasses['term-name']} */ ;
        (sys.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.code, __VLS_intrinsics.code)({
            ...{ class: "term-url" },
        });
        /** @type {__VLS_StyleScopedClasses['term-url']} */ ;
        (sys.url);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "term-usage" },
        });
        /** @type {__VLS_StyleScopedClasses['term-usage']} */ ;
        (sys.usage);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "term-example" },
        });
        /** @type {__VLS_StyleScopedClasses['term-example']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "example-label" },
        });
        /** @type {__VLS_StyleScopedClasses['example-label']} */ ;
        (sys.example);
        // @ts-ignore
        [sections, activeSection,];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
