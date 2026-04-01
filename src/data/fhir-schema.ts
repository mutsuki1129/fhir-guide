/**
 * FHIR R4 JSON Schema 定義
 * 用於 Ajv 即時驗證，覆蓋核心 Resource 型別
 */

export const fhirBaseSchema = {
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
        profile: { type: 'array', items: { type: 'string', format: 'uri' } },
        tag: { type: 'array', items: { type: 'object' } },
        security: { type: 'array', items: { type: 'object' } }
      }
    },
    text: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['generated', 'extensions', 'additional', 'empty'] },
        div: { type: 'string' }
      }
    },
    language: { type: 'string' },
    implicitRules: { type: 'string' }
  }
}

export const resourceSchemas: Record<string, object> = {
  Patient: {
    ...fhirBaseSchema,
    properties: {
      ...fhirBaseSchema.properties,
      active: { type: 'boolean' },
      name: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            use: { type: 'string', enum: ['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden'] },
            text: { type: 'string' },
            family: { type: 'string' },
            given: { type: 'array', items: { type: 'string' } },
            prefix: { type: 'array', items: { type: 'string' } },
            suffix: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      telecom: { type: 'array', items: { type: 'object' } },
      gender: { type: 'string', enum: ['male', 'female', 'other', 'unknown'] },
      birthDate: { type: 'string', pattern: '^\\d{4}(-\\d{2}(-\\d{2})?)?$' },
      deceased: {},
      address: { type: 'array', items: { type: 'object' } },
      maritalStatus: { type: 'object' },
      multipleBirth: {},
      photo: { type: 'array' },
      contact: { type: 'array' },
      communication: { type: 'array' },
      generalPractitioner: { type: 'array' },
      managingOrganization: { type: 'object' },
      link: { type: 'array' },
      identifier: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            use: { type: 'string' },
            type: { type: 'object' },
            system: { type: 'string' },
            value: { type: 'string' },
            period: { type: 'object' },
            assigner: { type: 'object' }
          }
        }
      }
    }
  },

  Observation: {
    ...fhirBaseSchema,
    required: ['resourceType', 'status', 'code'],
    properties: {
      ...fhirBaseSchema.properties,
      identifier: { type: 'array' },
      basedOn: { type: 'array' },
      partOf: { type: 'array' },
      status: {
        type: 'string',
        enum: ['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown']
      },
      category: { type: 'array', items: { type: 'object' } },
      code: {
        type: 'object',
        required: ['coding'],
        properties: {
          coding: { type: 'array', items: { type: 'object' } },
          text: { type: 'string' }
        }
      },
      subject: { type: 'object' },
      focus: { type: 'array' },
      encounter: { type: 'object' },
      effectiveDateTime: { type: 'string' },
      effectivePeriod: { type: 'object' },
      issued: { type: 'string' },
      performer: { type: 'array' },
      valueQuantity: { type: 'object' },
      valueCodeableConcept: { type: 'object' },
      valueString: { type: 'string' },
      valueBoolean: { type: 'boolean' },
      dataAbsentReason: { type: 'object' },
      interpretation: { type: 'array' },
      note: { type: 'array' },
      bodySite: { type: 'object' },
      method: { type: 'object' },
      specimen: { type: 'object' },
      device: { type: 'object' },
      referenceRange: { type: 'array' },
      hasMember: { type: 'array' },
      derivedFrom: { type: 'array' },
      component: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            code: { type: 'object' },
            valueQuantity: { type: 'object' },
            valueCodeableConcept: { type: 'object' },
            dataAbsentReason: { type: 'object' }
          }
        }
      }
    }
  },

  Encounter: {
    ...fhirBaseSchema,
    required: ['resourceType', 'status', 'class'],
    properties: {
      ...fhirBaseSchema.properties,
      identifier: { type: 'array' },
      status: {
        type: 'string',
        enum: ['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled', 'entered-in-error', 'unknown']
      },
      statusHistory: { type: 'array' },
      class: { type: 'object' },
      classHistory: { type: 'array' },
      type: { type: 'array' },
      serviceType: { type: 'object' },
      priority: { type: 'object' },
      subject: { type: 'object' },
      episodeOfCare: { type: 'array' },
      basedOn: { type: 'array' },
      participant: { type: 'array' },
      appointment: { type: 'array' },
      period: { type: 'object' },
      length: { type: 'object' },
      reasonCode: { type: 'array' },
      reasonReference: { type: 'array' },
      diagnosis: { type: 'array' },
      account: { type: 'array' },
      hospitalization: { type: 'object' },
      location: { type: 'array' },
      serviceProvider: { type: 'object' },
      partOf: { type: 'object' }
    }
  },

  Condition: {
    ...fhirBaseSchema,
    required: ['resourceType', 'subject'],
    properties: {
      ...fhirBaseSchema.properties,
      identifier: { type: 'array' },
      clinicalStatus: { type: 'object' },
      verificationStatus: { type: 'object' },
      category: { type: 'array' },
      severity: { type: 'object' },
      code: { type: 'object' },
      bodySite: { type: 'array' },
      subject: { type: 'object' },
      encounter: { type: 'object' },
      onsetDateTime: { type: 'string' },
      onsetAge: { type: 'object' },
      onsetPeriod: { type: 'object' },
      onsetRange: { type: 'object' },
      onsetString: { type: 'string' },
      abatementDateTime: { type: 'string' },
      recordedDate: { type: 'string' },
      recorder: { type: 'object' },
      asserter: { type: 'object' },
      stage: { type: 'array' },
      evidence: { type: 'array' },
      note: { type: 'array' }
    }
  },

  MedicationRequest: {
    ...fhirBaseSchema,
    required: ['resourceType', 'status', 'intent', 'subject'],
    properties: {
      ...fhirBaseSchema.properties,
      identifier: { type: 'array' },
      status: {
        type: 'string',
        enum: ['active', 'on-hold', 'cancelled', 'completed', 'entered-in-error', 'stopped', 'draft', 'unknown']
      },
      statusReason: { type: 'object' },
      intent: {
        type: 'string',
        enum: ['proposal', 'plan', 'order', 'original-order', 'reflex-order', 'filler-order', 'instance-order', 'option']
      },
      category: { type: 'array' },
      priority: { type: 'string' },
      doNotPerform: { type: 'boolean' },
      reported: {},
      medicationCodeableConcept: { type: 'object' },
      medicationReference: { type: 'object' },
      subject: { type: 'object' },
      encounter: { type: 'object' },
      supportingInformation: { type: 'array' },
      authoredOn: { type: 'string' },
      requester: { type: 'object' },
      performer: { type: 'object' },
      performerType: { type: 'object' },
      recorder: { type: 'object' },
      reasonCode: { type: 'array' },
      reasonReference: { type: 'array' },
      instantiatesCanonical: { type: 'array' },
      instantiatesUri: { type: 'array' },
      basedOn: { type: 'array' },
      groupIdentifier: { type: 'object' },
      courseOfTherapyType: { type: 'object' },
      insurance: { type: 'array' },
      note: { type: 'array' },
      dosageInstruction: { type: 'array' },
      dispenseRequest: { type: 'object' },
      substitution: { type: 'object' },
      priorPrescription: { type: 'object' },
      detectedIssue: { type: 'array' },
      eventHistory: { type: 'array' }
    }
  },

  Bundle: {
    ...fhirBaseSchema,
    required: ['resourceType', 'type'],
    properties: {
      ...fhirBaseSchema.properties,
      identifier: { type: 'object' },
      type: {
        type: 'string',
        enum: ['document', 'message', 'transaction', 'transaction-response', 'batch', 'batch-response', 'history', 'searchset', 'collection']
      },
      timestamp: { type: 'string' },
      total: { type: 'number' },
      link: { type: 'array' },
      entry: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            link: { type: 'array' },
            fullUrl: { type: 'string' },
            resource: { type: 'object' },
            search: { type: 'object' },
            request: {
              type: 'object',
              properties: {
                method: { type: 'string', enum: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'] },
                url: { type: 'string' },
                ifNoneMatch: { type: 'string' },
                ifModifiedSince: { type: 'string' },
                ifMatch: { type: 'string' },
                ifNoneExist: { type: 'string' }
              }
            },
            response: { type: 'object' }
          }
        }
      },
      signature: { type: 'object' }
    }
  }
}

export const supportedResourceTypes = Object.keys(resourceSchemas)
