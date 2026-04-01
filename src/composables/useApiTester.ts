import { ref } from 'vue'
import type { ApiRequest, ApiResponse } from '@/types'
import { useSettingsStore } from '@/stores/settings'

const HISTORY_KEY = 'fhir-api-history'
const MAX_HISTORY = 50

export function useApiTester() {
  const settings = useSettingsStore()
  const loading = ref(false)
  const lastResponse = ref<ApiResponse | null>(null)
  const history = ref<ApiRequest[]>(loadHistory())

  function loadHistory(): ApiRequest[] {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    } catch {
      return []
    }
  }

  function saveHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value.slice(0, MAX_HISTORY)))
  }

  async function send(request: Omit<ApiRequest, 'id' | 'timestamp'>): Promise<ApiResponse> {
    loading.value = true
    lastResponse.value = null
    const start = performance.now()

    const fullUrl = request.url.startsWith('http')
      ? request.url
      : `${settings.currentServer}${request.url}`

    try {
      const fetchOptions: RequestInit = {
        method: request.method,
        headers: request.headers,
        signal: AbortSignal.timeout(30000)
      }
      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        fetchOptions.body = request.body
      }

      const res = await fetch(fullUrl, fetchOptions)
      const duration = Math.round(performance.now() - start)
      const responseHeaders: Record<string, string> = {}
      res.headers.forEach((v, k) => { responseHeaders[k] = v })

      let body = ''
      try {
        const text = await res.text()
        try {
          body = JSON.stringify(JSON.parse(text), null, 2)
        } catch {
          body = text
        }
      } catch {}

      const response: ApiResponse = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body,
        duration
      }

      lastResponse.value = response

      // Save to history
      const historyItem: ApiRequest = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        method: request.method,
        url: fullUrl,
        headers: request.headers,
        body: request.body
      }
      history.value.unshift(historyItem)
      if (history.value.length > MAX_HISTORY) history.value = history.value.slice(0, MAX_HISTORY)
      saveHistory()

      return response
    } catch (e: any) {
      const duration = Math.round(performance.now() - start)
      const response: ApiResponse = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        body: `連線失敗：${e.message}\n\n如果是本地伺服器，請確認 Docker 容器正在執行。\n如果是公開伺服器，請確認網路連線正常。`,
        duration
      }
      lastResponse.value = response
      return response
    } finally {
      loading.value = false
    }
  }

  function clearHistory() {
    history.value = []
    saveHistory()
  }

  return { send, loading, lastResponse, history, clearHistory }
}
