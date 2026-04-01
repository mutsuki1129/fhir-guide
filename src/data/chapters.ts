import type { Chapter } from '@/types'

export const chapters: Chapter[] = [
  {
    id: '01-basics',
    title: 'FHIR 基礎概念',
    icon: '📚',
    steps: [
      { id: '01-what-is-fhir', title: '什麼是 FHIR？', chapterId: '01-basics', contentPath: '01-basics/01-what-is-fhir' },
      { id: '02-history', title: 'FHIR 歷史與版本演進', chapterId: '01-basics', contentPath: '01-basics/02-history' },
      { id: '03-comparison', title: '與其他標準的比較', chapterId: '01-basics', contentPath: '01-basics/03-comparison' },
      { id: '04-restful-review', title: 'RESTful API 基礎回顧', chapterId: '01-basics', contentPath: '01-basics/04-restful-review' },
    ]
  },
  {
    id: '02-setup',
    title: '環境建置',
    icon: '🔧',
    steps: [
      { id: '01-dev-tools', title: '開發工具準備', chapterId: '02-setup', contentPath: '02-setup/01-dev-tools' },
      { id: '02-local-hapi', title: '本地 HAPI FHIR Server', chapterId: '02-setup', contentPath: '02-setup/02-local-hapi' },
      { id: '03-public-server', title: '連接公開測試伺服器', chapterId: '02-setup', contentPath: '02-setup/03-public-server' },
      { id: '04-first-request', title: '第一個 FHIR 請求', chapterId: '02-setup', contentPath: '02-setup/04-first-request' },
    ]
  },
  {
    id: '03-resources',
    title: 'FHIR Resource 深入',
    icon: '🏗️',
    steps: [
      { id: '01-resource-overview', title: 'Resource 結構總覽', chapterId: '03-resources', contentPath: '03-resources/01-resource-overview' },
      { id: '02-patient', title: 'Patient Resource', chapterId: '03-resources', contentPath: '03-resources/02-patient' },
      { id: '03-observation', title: 'Observation Resource', chapterId: '03-resources', contentPath: '03-resources/03-observation' },
      { id: '04-encounter', title: 'Encounter Resource', chapterId: '03-resources', contentPath: '03-resources/04-encounter' },
      { id: '05-condition', title: 'Condition Resource', chapterId: '03-resources', contentPath: '03-resources/05-condition' },
      { id: '06-medication-request', title: 'MedicationRequest Resource', chapterId: '03-resources', contentPath: '03-resources/06-medication-request' },
      { id: '07-bundle', title: 'Bundle Resource', chapterId: '03-resources', contentPath: '03-resources/07-bundle' },
      { id: '08-extension', title: '自訂 Extension', chapterId: '03-resources', contentPath: '03-resources/08-extension' },
    ]
  },
  {
    id: '04-search',
    title: 'FHIR 搜尋機制',
    icon: '🔍',
    steps: [
      { id: '01-basic-search', title: '基本搜尋參數', chapterId: '04-search', contentPath: '04-search/01-basic-search' },
      { id: '02-modifiers', title: '修飾符（Modifiers）', chapterId: '04-search', contentPath: '04-search/02-modifiers' },
      { id: '03-chained-search', title: '鏈式搜尋', chapterId: '04-search', contentPath: '04-search/03-chained-search' },
      { id: '04-revinclude', title: '反向鏈式搜尋（_revinclude）', chapterId: '04-search', contentPath: '04-search/04-revinclude' },
      { id: '05-pagination', title: '搜尋結果分頁', chapterId: '04-search', contentPath: '04-search/05-pagination' },
    ]
  },
  {
    id: '05-operations',
    title: 'FHIR 操作 (Operations)',
    icon: '⚙️',
    steps: [
      { id: '01-validate', title: '$validate', chapterId: '05-operations', contentPath: '05-operations/01-validate' },
      { id: '02-everything', title: '$everything', chapterId: '05-operations', contentPath: '05-operations/02-everything' },
      { id: '03-expand', title: '$expand (ValueSet)', chapterId: '05-operations', contentPath: '05-operations/03-expand' },
      { id: '04-custom-operation', title: '自訂 Operation', chapterId: '05-operations', contentPath: '05-operations/04-custom-operation' },
    ]
  },
  {
    id: '06-security',
    title: '安全性與認證',
    icon: '🔐',
    steps: [
      { id: '01-smart-overview', title: 'SMART on FHIR 概覽', chapterId: '06-security', contentPath: '06-security/01-smart-overview' },
      { id: '02-oauth2', title: 'OAuth 2.0 流程', chapterId: '06-security', contentPath: '06-security/02-oauth2' },
      { id: '03-scopes', title: 'Scopes 與權限控制', chapterId: '06-security', contentPath: '06-security/03-scopes' },
      { id: '04-encryption-tls', title: 'TLS 加密與通信安全', chapterId: '06-security', contentPath: '06-security/04-encryption' },
      { id: '05-security-labels', title: '安全標籤與訪問控制', chapterId: '06-security', contentPath: '06-security/05-security-labels' },
      { id: '06-audit-logging', title: '稽核日誌與監控', chapterId: '06-security', contentPath: '06-security/06-audit-logging' },
      { id: '07-best-practices', title: ' 安全最佳實踐與檢查清單', chapterId: '06-security', contentPath: '06-security/07-best-practices' },
    ]
  },
  {
    id: '07-project',
    title: '實戰專案',
    icon: '🚀',
    steps: [
      { id: '01-patient-record', title: '建立完整病患就診紀錄', chapterId: '07-project', contentPath: '07-project/01-patient-record' },
      { id: '02-bundle-import', title: '用 Bundle 批次匯入資料', chapterId: '07-project', contentPath: '07-project/02-bundle-import' },
      { id: '03-patient-frontend', title: '建立簡易病患查詢前端', chapterId: '07-project', contentPath: '07-project/03-patient-frontend' },
    ]
  }
]

export const allSteps = chapters.flatMap(c => c.steps)

export function getStepIndex(chapterId: string, stepId: string): number {
  return allSteps.findIndex(s => s.chapterId === chapterId && s.id === stepId)
}

export function getPrevStep(chapterId: string, stepId: string) {
  const idx = getStepIndex(chapterId, stepId)
  return idx > 0 ? allSteps[idx - 1] : null
}

export function getNextStep(chapterId: string, stepId: string) {
  const idx = getStepIndex(chapterId, stepId)
  return idx < allSteps.length - 1 ? allSteps[idx + 1] : null
}
