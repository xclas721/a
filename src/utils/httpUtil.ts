import axios, { type AxiosResponse } from 'axios'
import { logout } from '@/utils/authUserUtils'
import swalMessage from '@/plugins/swalMessage'
import { resetRouter } from '@/router'
import { useLoadingStore } from '@/stores/loading'
import i18n from '@/locales/index'
import { appConfig, type PublicConfig } from '@/config'
class HttpUtil {
  #vue: any
  #appConfig: PublicConfig
  #loadingStore: any

  constructor(vue: any) {
    this.#vue = vue
    this.#appConfig = appConfig
    this.#loadingStore = useLoadingStore()
  }

  // Add request queue tracking
  #activeRequests = new Set<Promise<any>>()
  async get(path: string, params: any = null, headers: any = {}) {
    return this.#wrapRequest(this.#request('get', this.#buildUrl(path, params), null, headers))
  }

  async post(path: string, data: any, headers: any = {}) {
    return this.#wrapRequest(this.#request('post', this.#buildBackendUrl(path), data, headers))
  }

  async put(path: string, data: any, headers: any = {}) {
    return this.#wrapRequest(this.#request('put', this.#buildBackendUrl(path), data, headers))
  }

  async delete(path: string, data: any, headers: any = {}) {
    return this.#wrapRequest(this.#request('delete', this.#buildBackendUrl(path), data, headers))
  }

  async downloadExcel(path: string, data: any = {}, headers: any = {}) {
    return this.#wrapRequest(this.#downloadExcelInternal(path, data, headers))
  }

  // Wrap all requests to ensure correct loading status management
  async #wrapRequest<T>(requestPromise: Promise<T>): Promise<any> {
    const requestId = Symbol()
    this.#activeRequests.add(requestId as any)

    try {
      this.#loadingStore.startLoading()
      const result = await requestPromise
      return result
    } catch (error: any) {
      console.log(error)
      this.#activeRequests.delete(requestId as any)
      this.#loadingStore.finishLoading()
    } finally {
      this.#activeRequests.delete(requestId as any)
      this.#loadingStore.finishLoading()
      // Check if all requests are completed
      if (this.#activeRequests.size === 0) {
        this.#loadingStore.resetLoading()
      }
    }
  }

  async #downloadExcelInternal(path: string, data: any = {}, headers: any = {}) {
    const url = this.#buildBackendUrl(path)
    const response = await axios({
      method: 'post',
      url,
      data,
      headers,
      responseType: 'blob',
      timeout: Number.parseInt(this.#appConfig.BACKEND_API_TIMEOUT) || 10000,
      withCredentials: true // Carry cookie
    })
    return this.#processDownload(response)
  }

  #buildUrl(path: string, params: any) {
    path = this.#buildBackendUrl(path)

    if (!params) {
      return path
    }

    const queryParams = new URLSearchParams(params).toString()
    return queryParams ? `${path}?${queryParams}` : path
  }

  #buildBackendUrl(path: string): string {
    const baseUrl = this.#appConfig.API_BASE_URL || 'http://localhost:8080' // Default to localhost if not set
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    return `${baseUrl}/api${path}`
  }

  async #request(method: 'get' | 'post' | 'put' | 'delete', url: string, data: any, headers: any) {
    const response = await axios({
      method,
      url,
      data,
      headers,
      timeout: Number.parseInt(this.#appConfig.BACKEND_API_TIMEOUT) || 240000,
      withCredentials: true // Ensure http only cookie is carried
    })
    return this.#processResponse(response)
  }

  async #processDownload(response: any) {
    const contentType = response.headers['content-type'] || ''

    // Check if JSON error response
    if (contentType.includes('application/json')) {
      try {
        const jsonText = await new Response(response.data).text()
        const errorData = JSON.parse(jsonText)
        return { success: false, message: errorData.message || '下载失败' }
      } catch {
        return {
          success: false,
          message: i18n.global.t('ui.trans.log.rule-engine.status-code.system-error')
        }
      }
    }

    // Normal file download processing
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    const contentDisposition = response.headers['content-disposition']
    let filename = 'download.xlsx'

    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = filenameRegex.exec(contentDisposition)
      if (matches?.[1]) {
        filename = decodeURIComponent(matches[1].replace(/['"]/g, ''))
      }
    }

    const link = document.createElement('a')
    const url = globalThis.URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()

    // Clean DOM
    setTimeout(() => {
      document.body.removeChild(link)
      globalThis.URL.revokeObjectURL(url)
    }, 100)

    return { success: true, filename }
  }

  #processResponse(response: any) {
    return { ...response.data }
  }
}

// Response interceptor
axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    const { code, message } = response.data
    const contentType = response.headers['content-type']
    // token expired, re-login
    if (code == '2000') {
      const loadingStore = useLoadingStore()
      loadingStore.resetLoading()
      await swalMessage.error(message, '', function () {
        logout()
        // Clear routes
        resetRouter()
      })
      return Promise.reject(message)
    }
    // Handle binary response (keep original response)
    const BINARY_TYPES = ['application/octet-stream', 'application/pdf', 'application/vnd', 'image/']

    if (BINARY_TYPES.some((type) => contentType.includes(type))) {
      return response
    }

    return response
  },
  async (error: any) => {
    console.log(error)
    const loadingStore = useLoadingStore()
    loadingStore.resetLoading()
    // Request timeout handling logic
    if (error.code === 'ECONNABORTED') {
      await swalMessage.error(i18n.global.t('ui.system.request.timeout.error'))
    } else if (error.response?.data instanceof Blob) {
      // Handle JSON error in binary response
      const contentType = error.response.headers['content-type'] || ''
      if (contentType.includes('application/json')) {
        const jsonText = await new Response(error.response.data).text()
        const errorData = JSON.parse(jsonText)
        return Promise.reject(errorData.message || JSON.stringify(errorData))
      }
    } else if (error.response && error.response.data) {
      const { message } = error.response.data
      await swalMessage.error(message)
    }
    return Promise.reject(error.message)
  }
)
axios.defaults.withCredentials = true
export default HttpUtil
