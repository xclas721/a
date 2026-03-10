//import axios from 'axios'
import HttpUtil from './httpUtil'
import { userStateStore } from '@/stores/user'
import { logout } from '@/utils/authUserUtils'
import { useCookies } from 'vue3-cookies'
import { useAppStoreHook } from '@/stores/app'
import { resetRouter } from '@/router'
import { appConfig, type PublicConfig } from '@/config'
interface RequestPage {
  pageNumber: number
  pageSize: number
}
interface SearchRequestPageModel {
  page: RequestPage
  criteria: any
}

class ApiUtil {
  #vue: any
  #appConfig: PublicConfig
  #httpUtil: HttpUtil

  constructor(vue: any) {
    this.#vue = vue
    this.#appConfig = appConfig
    this.#httpUtil = new HttpUtil(vue)
  }
  url(path: string) {
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    return path
  }

  get(path: string, params: any = null, headers = {}, reqLogin = true) {
    return this.#checkToken('get', path, params, headers, reqLogin)
  }

  post(path: string, data: any, headers = {}, reqLogin = true) {
    //console.log(data)
    return this.#checkToken('post', path, data, headers, reqLogin)
  }

  postSearchPage(path: string, data: any, pageNumber: number, headers = {}, reqLogin = true) {
    // Push into page
    const pageSize: number = Number(this.#appConfig.PAGE_SIZE)
    // pageNumber-1, backend starts from 0
    const requestPage: RequestPage = { pageSize: pageSize, pageNumber: pageNumber }
    const requestData: SearchRequestPageModel = {
      page: requestPage,
      criteria: data
    }

    return this.#checkToken('post', path, requestData, headers, reqLogin)
  }

  // put(path: string, data: any, headers = {}, reqLogin = true) {
  //   return this.#checkToken('put', path, data, headers, reqLogin)
  // }
  //
  // delete(path: string, params = null, headers = {}, reqLogin = true) {
  //   return this.#checkToken('delete', path, params, headers, reqLogin)
  // }

  async downloadExcel(path: string, data: any = null, headers: any = {}, reqLogin = true) {
    return this.#checkToken('downloadExcel', path, data, headers, reqLogin)
  }

  #checkToken(method: keyof HttpUtil, path: string, params: any, headers: any, reqLogin: boolean) {
    const userState = userStateStore()
    if (reqLogin) {
      if (!userState.user.login) {
        logout()
        // Clear routes
        resetRouter()
        return new Promise((resolve) => {
          resolve({
            success: false
          })
        })
      }
    }
    const url = this.url(path)
    if (!headers['content-type']) {
      headers['content-type'] = 'application/json'
    }
    const { cookies } = useCookies()
    const appStoreHook = useAppStoreHook()
    const header: any = {
      UserTimeZone: userState.user.timeZone,
      'Accept-Language': appStoreHook.language,
      'Access-isHosted': appStoreHook.organ == 'issuer' ? `false` : 'true',
      //XSRF TOKEN
      'X-XSRF-TOKEN': `${cookies.get('XSRF-TOKEN') ? cookies.get('XSRF-TOKEN') : ''}`,
      //Replay attack key
      'Replay-key': generateRandomValues()
    }
    Object.assign(header, headers)
    //console.log(header)
    /*if( params && process.env.NODE_ENV != 'development' ) {
        params.jsonData = JSON.stringify(params) ;
    }*/

    return this.#httpUtil[method](url, params, header)
  }
}

/**
 * Generate random number string
 */
function generateRandomValues() {
  // Millisecond timestamp
  const timestamp = Date.now()
  const nonce =
    (crypto as any)?.randomUUID?.() ??
    (() => {
      // fallback: 16 byte hex
      const arr = new Uint8Array(16)
      crypto.getRandomValues(arr)
      return Array.from(arr)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    })()

  const replayKey = `${timestamp}:${nonce}`
  return replayKey
}

export default ApiUtil
