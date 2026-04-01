export interface Chapter {
  id: string
  title: string
  icon: string
  steps: Step[]
}

export interface Step {
  id: string
  title: string
  chapterId: string
  contentPath: string
}

export interface FhirServer {
  id: string
  name: string
  baseUrl: string
  type: 'public' | 'local' | 'custom'
}

export interface ApiRequest {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  headers: Record<string, string>
  body: string
  timestamp: number
}

export interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  duration: number
}

export interface ApiPreset {
  id: string
  label: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  body?: string
  description: string
}

export interface ResourceTemplate {
  id: string
  name: string
  resourceType: string
  content: object
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  path: string
  message: string
  line?: number
}

export interface ValidationWarning {
  path: string
  message: string
}

export interface CodeExample {
  language: 'javascript' | 'python' | 'curl' | 'csharp' | 'java'
  label: string
  code: string
}
