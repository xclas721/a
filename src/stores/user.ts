import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { getLocaleBackendValue, getLocaleValue } from '@/utils/appProperties'

interface User {
  bankId: string
  account: string
  userName: string
  email: string
  login: boolean
  locale: string
  localeBackendValue: string
  issuerOid: string
  timeZone: string
  userType: string
  type: UserType
  menu: AdminMenu[] | null
  routerFlag: boolean
  mfa: boolean
  fidoEnabled: string
}

export enum UserType {
  Issuer = 'issuer',
  Hosted = 'hosted'
}

interface UserState {
  user: User
  otherOptions: Record<string, any>
}

export interface AdminMenu {
  oid: string
  nodeType: string
  i18nCode: string
  accessId: string
  children: AdminMenu[]
  isCollapsed: boolean
}

export interface RouteVO {
  /** Child route list */
  children: RouteVO[]
  /** Component path */
  component?: string
  /** Route properties */
  meta?: Meta
  /** Route name */
  name?: string
  /** Route path */
  path?: string
  /** Jump link */
  redirect?: string
  /** Menu type */
  menuType: string
}

export enum MenuType {
  Issuer = 'issuer',
  Hosted = 'hosted',
  Common = 'common'
}

/** Meta, route properties */
export interface Meta {
  keepAlive?: boolean
  requiresAuth?: boolean
  title?: string
}

const getSystemTimeZone = () => DateTime.local().zoneName

const getDefaultUserState = (): UserState => ({
  user: {
    bankId: '',
    account: '',
    userName: '',
    email: '',
    login: false,
    locale: 'en',
    localeBackendValue: 'en',
    issuerOid: '',
    timeZone: getSystemTimeZone(),
    type: UserType.Issuer,
    userType: '',
    menu: null,
    routerFlag: false,
    mfa: false,
    fidoEnabled: '0'
  },
  otherOptions: {}
})

export const userStateStore = defineStore('user', {
  state: (): UserState => {
    return getDefaultUserState()
  },
  persist: { storage: localStorage },
  actions: {
    setUserName(userName: string) {
      this.user.userName = userName
      this.user.login = true
    },
    setAccount(account: string) {
      this.user.account = account
      this.user.login = true
    },
    setEmail(email: string) {
      this.user.email = email
      this.user.login = true
    },
    setUser(user: Partial<typeof this.user>) {
      Object.assign(this.user, user, { login: true })
    },
    setLocale(userLocale: string) {
      this.user.locale = getLocaleValue(userLocale)
      this.user.localeBackendValue = getLocaleBackendValue(userLocale)
    },
    setTimeZone(timeZone: string) {
      this.user.timeZone = timeZone
    },
    setIssuerOid(issuerOid: string) {
      this.user.issuerOid = issuerOid
    },
    setBankId(bankId: string) {
      this.user.bankId = bankId
    },
    setLogin(login: boolean) {
      this.user.login = login
    },
    setRouterFlag(login: boolean) {
      this.user.routerFlag = login
    },
    setUserType(userType: string) {
      this.user.userType = userType
    },
    setType(type: UserType) {
      this.user.type = type
    },
    setMenu(menu: AdminMenu[]) {
      this.user.menu = menu
    },
    setMfa(mfa: boolean) {
      this.user.mfa = mfa
      this.user.login = true
    },
    setFidoEnabled(fidoEnabled: string) {
      this.user.fidoEnabled = fidoEnabled
    },
    initLocale() {
      const browserLocale = navigator.language || 'en'
      this.setLocale(getLocaleValue(browserLocale))
    },
    resetState() {
      const keepLocal = this.user.locale
      const keepTimeZone = this.user.timeZone

      this.$reset()

      this.setLocale(keepLocal)
      this.setTimeZone(keepTimeZone)
    }
  }
})
