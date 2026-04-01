import { ref } from 'vue'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import type { ValidationResult } from '@/types'
import { fhirBaseSchema, resourceSchemas } from '@/data/fhir-schema'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

export function useFhirValidation() {
  const result = ref<ValidationResult>({ valid: true, errors: [], warnings: [] })

  function validate(jsonString: string): ValidationResult {
    if (!jsonString.trim()) {
      const r = { valid: false, errors: [{ path: '', message: 'JSON 內容不可為空' }], warnings: [] }
      result.value = r
      return r
    }

    let data: any
    try {
      data = JSON.parse(jsonString)
    } catch (e: any) {
      const r = { valid: false, errors: [{ path: '', message: `JSON 語法錯誤：${e.message}` }], warnings: [] }
      result.value = r
      return r
    }

    if (!data.resourceType) {
      const r = { valid: false, errors: [{ path: 'resourceType', message: '缺少必要欄位 resourceType' }], warnings: [] }
      result.value = r
      return r
    }

    const schema = resourceSchemas[data.resourceType] ?? fhirBaseSchema
    const validateFn = ajv.compile(schema)
    const valid = validateFn(data)

    const errors = valid ? [] : (validateFn.errors ?? []).map(e => ({
      path: e.instancePath || e.schemaPath,
      message: e.message ?? '驗證失敗'
    }))

    const warnings: { path: string; message: string }[] = []
    if (!data.id) warnings.push({ path: 'id', message: '建議提供 id 欄位' })
    if (!data.meta) warnings.push({ path: 'meta', message: '建議提供 meta 欄位（包含 profile）' })
    if (!data.text) warnings.push({ path: 'text', message: '建議提供 text.div 顯示文字（DomainResource narrative）' })

    const r: ValidationResult = { valid: errors.length === 0, errors, warnings }
    result.value = r
    return r
  }

  return { validate, result }
}
