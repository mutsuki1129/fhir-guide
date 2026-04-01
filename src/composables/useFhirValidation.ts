import { ref } from 'vue'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import type { ValidationResult } from '@/types'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

// Simplified FHIR R4 base schema
const fhirBaseSchema = {
  type: 'object',
  required: ['resourceType'],
  properties: {
    resourceType: { type: 'string', minLength: 1 },
    id: { type: 'string' },
    meta: {
      type: 'object',
      properties: {
        versionId: { type: 'string' },
        lastUpdated: { type: 'string', format: 'date-time' },
        profile: { type: 'array', items: { type: 'string' } }
      }
    }
  }
}

const resourceSchemas: Record<string, object> = {
  Patient: {
    ...fhirBaseSchema,
    properties: {
      ...fhirBaseSchema.properties,
      name: { type: 'array', items: { type: 'object', properties: { use: { type: 'string' }, text: { type: 'string' }, family: { type: 'string' }, given: { type: 'array', items: { type: 'string' } } } } },
      gender: { type: 'string', enum: ['male', 'female', 'other', 'unknown'] },
      birthDate: { type: 'string', pattern: '^\\d{4}(-\\d{2}(-\\d{2})?)?$' },
      identifier: { type: 'array', items: { type: 'object', properties: { system: { type: 'string' }, value: { type: 'string' } } } },
      telecom: { type: 'array', items: { type: 'object' } },
      address: { type: 'array', items: { type: 'object' } },
      active: { type: 'boolean' },
      deceased: {}
    }
  },
  Observation: {
    ...fhirBaseSchema,
    required: ['resourceType', 'status', 'code'],
    properties: {
      ...fhirBaseSchema.properties,
      status: { type: 'string', enum: ['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown'] },
      category: { type: 'array', items: { type: 'object' } },
      code: { type: 'object', required: ['coding'], properties: { coding: { type: 'array' }, text: { type: 'string' } } },
      subject: { type: 'object' },
      effectiveDateTime: { type: 'string' },
      valueQuantity: { type: 'object' },
      component: { type: 'array' }
    }
  },
  Encounter: {
    ...fhirBaseSchema,
    required: ['resourceType', 'status', 'class'],
    properties: {
      ...fhirBaseSchema.properties,
      status: { type: 'string', enum: ['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled', 'entered-in-error', 'unknown'] },
      class: { type: 'object' },
      subject: { type: 'object' },
      period: { type: 'object' },
      reasonCode: { type: 'array' }
    }
  },
  Condition: {
    ...fhirBaseSchema,
    required: ['resourceType', 'subject'],
    properties: {
      ...fhirBaseSchema.properties,
      clinicalStatus: { type: 'object' },
      verificationStatus: { type: 'object' },
      code: { type: 'object' },
      subject: { type: 'object' },
      onsetDateTime: { type: 'string' },
      severity: { type: 'object' }
    }
  },
  MedicationRequest: {
    ...fhirBaseSchema,
    required: ['resourceType', 'status', 'intent', 'subject'],
    properties: {
      ...fhirBaseSchema.properties,
      status: { type: 'string', enum: ['active', 'on-hold', 'cancelled', 'completed', 'entered-in-error', 'stopped', 'draft', 'unknown'] },
      intent: { type: 'string', enum: ['proposal', 'plan', 'order', 'original-order', 'reflex-order', 'filler-order', 'instance-order', 'option'] },
      medicationCodeableConcept: { type: 'object' },
      medicationReference: { type: 'object' },
      subject: { type: 'object' },
      dosageInstruction: { type: 'array' }
    }
  },
  Bundle: {
    ...fhirBaseSchema,
    required: ['resourceType', 'type'],
    properties: {
      ...fhirBaseSchema.properties,
      type: { type: 'string', enum: ['document', 'message', 'transaction', 'transaction-response', 'batch', 'batch-response', 'history', 'searchset', 'collection'] },
      total: { type: 'number' },
      entry: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fullUrl: { type: 'string' },
            resource: { type: 'object' },
            request: { type: 'object' }
          }
        }
      }
    }
  }
}

export function useFhirValidation() {
  const result = ref<ValidationResult>({ valid: true, errors: [], warnings: [] })

  function validate(jsonString: string): ValidationResult {
    if (!jsonString.trim()) {
      return { valid: false, errors: [{ path: '', message: 'JSON 內容不可為空' }], warnings: [] }
    }

    let data: any
    try {
      data = JSON.parse(jsonString)
    } catch (e: any) {
      return { valid: false, errors: [{ path: '', message: `JSON 語法錯誤：${e.message}` }], warnings: [] }
    }

    if (!data.resourceType) {
      return { valid: false, errors: [{ path: 'resourceType', message: '缺少必要欄位 resourceType' }], warnings: [] }
    }

    const schema = resourceSchemas[data.resourceType] ?? fhirBaseSchema
    const validate = ajv.compile(schema)
    const valid = validate(data)

    const errors = valid ? [] : (validate.errors ?? []).map(e => ({
      path: e.instancePath || e.schemaPath,
      message: e.message ?? '驗證失敗'
    }))

    const warnings: { path: string; message: string }[] = []
    if (!data.id) warnings.push({ path: 'id', message: '建議提供 id 欄位' })
    if (!data.meta) warnings.push({ path: 'meta', message: '建議提供 meta 欄位（包含 profile）' })
    if (!data.text) warnings.push({ path: 'text', message: '建議提供 text.div 顯示文字（DomainResource narrative）' })

    result.value = { valid: errors.length === 0, errors, warnings }
    return result.value
  }

  return { validate, result }
}
