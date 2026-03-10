import router from '@/router'
import type { RouteLocationNormalized } from 'vue-router'
import { userStateStore } from '@/stores/user'
import { usePermissionStoreHook } from '@/plugins/dynamicRoutes'
import { useAppStoreHook } from '@/stores/app'
import DOMPurify from 'dompurify'

const permissionStore = usePermissionStoreHook()
const appStoreHook = useAppStoreHook()

/**
 * Whitelist of allowed query parameters for each page, parameters not in whitelist will be completely removed
 */
const PAGE_ALLOWED_PARAMS: Record<string, string[]> = {
  // GrafanaRedirectView.vue
  '/grafana-redirect': ['acsTransID', 'destination', 'from_time', 'to_time', 'stateMachineReason'],

  // TransactionQueryView.vue
  '/trans/transaction_log': ['acsTransID', 'from_time', 'to_time', 'stateMachineReason'],

  // AbnormalTransactionQueryView.vue
  '/trans/abnormal_trans_log': ['from_time', 'to_time', 'stateMachineReason'],
  // Login page (Reserved for RedirectIndex.vue, allows redirect parameter for jump after login, simply put, used to jump back to original page after login)
  '/issuer/login': ['redirect'],
  '/hosted/login': ['redirect'],

  // Default: Pages not explicitly listed do not allow any query parameters
  DEFAULT: []
}

/**
 * DOMPurify Configuration
 */
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [], // Do not allow any HTML tags
  ALLOWED_ATTR: [], // Do not allow any attributes
  KEEP_CONTENT: true, // Keep content, only remove tags
  RETURN_DOM: false, // Return string instead of DOM
  RETURN_DOM_FRAGMENT: false, // Do not return DOM Fragment
  RETURN_TRUSTED_TYPE: false // Do not return Trusted Type
}

/**
 * Clean and validate query parameters to prevent XSS attacks (Whitelist mode)
 * @param path current path
 * @param query original query parameters
 * @returns Cleaned query parameters, only keep parameters in whitelist
 */
function sanitizeQueryParams(path: string, query: Record<string, unknown>): Record<string, string> {
  const sanitized: Record<string, string> = {}

  // Get allowed parameter whitelist for this path (Exact match)
  const allowedParams = PAGE_ALLOWED_PARAMS[path] ?? PAGE_ALLOWED_PARAMS['DEFAULT'] ?? []

  // Only process parameters in whitelist
  for (const [key, value] of Object.entries(query)) {
    if (allowedParams.includes(key) && value !== null && value !== undefined) {
      const stringValue = String(value)

      // Use DOMPurify to clean parameter values
      const sanitizedValue = DOMPurify.sanitize(stringValue, DOMPURIFY_CONFIG).trim()

      if (sanitizedValue) {
        sanitized[key] = sanitizedValue
      }
    }
  }

  return sanitized
}

/**
 * Compare if two query parameter objects are same
 */
function isQueryEqual(query1: Record<string, unknown>, query2: Record<string, unknown>): boolean {
  const keys1 = Object.keys(query1).sort((a, b) => a.localeCompare(b))
  const keys2 = Object.keys(query2).sort((a, b) => a.localeCompare(b))

  if (keys1.length !== keys2.length) return false

  return keys1.every((key) => query1[key] === query2[key])
}

/**
 * Return redirect path to login page (Vue Router 4+: use return instead of next())
 * Note: redirect parameter will be cleaned via sanitizeQueryParams to ensure safety
 */
function getRedirectToLoginPath(to: RouteLocationNormalized): string {
  const sanitizedQuery = sanitizeQueryParams(to.path, to.query)
  const params = new URLSearchParams(sanitizedQuery)
  const queryString = params.toString()
  const redirect = queryString ? `${to.path}?${queryString}` : to.path
  const appStore = useAppStoreHook()
  return `/${appStore.organ}/login?redirect=${encodeURIComponent(redirect)}`
}

export function setupPermission() {
  /**
   * Before jumping route
   */
  // Whitelist routes
  const whiteList = new Set(['/issuer/login', '/hosted/login'])

  router.beforeEach(async (to, from) => {
    const userState = userStateStore()

    // Only check login status, token is verified from cookie by backend
    if (userState.user.login) {
      // If user already logged in and tries to access login page, redirect to home page
      if (to.path === '/issuer/login' || to.path === '/hosted/login') {
        return { path: '/' }
      }

      // Load dynamic routes once when logging in, do not load subsequently
      if (userState.user.routerFlag) {
        // Refresh and re-add routes
        if (permissionStore.routes.length == 0) {
          const accessRoutes = await permissionStore.generateRoutes()
          for (const route of accessRoutes) {
            router.addRoute(route)
          }

          appStoreHook.resetAppStore()
          // This is needed to refresh, otherwise 404
          // Use DOMPurify and whitelist to clean query parameters to prevent XSS attacks
          const sanitizedQuery = sanitizeQueryParams(to.path, to.query)
          return { path: to.path, query: sanitizedQuery }
        }

        // If no route matched, jump to 404
        if (to.matched.length === 0) {
          return from.name ? { name: from.name } : '/404'
        }

        // Use whitelist to clean query parameters to prevent XSS attacks and unauthorized parameters
        const sanitizedQuery = sanitizeQueryParams(to.path, to.query)

        // Compare query parameters before and after cleaning, re-navigate if changed
        if (JSON.stringify(to.query) === JSON.stringify(sanitizedQuery)) {
          // If title exists in route parameters, overwrite title in route meta
          const title = (to.params.title as string) || (to.query.title as string)
          if (title) {
            to.meta.title = title
          }
          return
        }
        // Query parameters cleaned or filtered, re-navigate using cleaned parameters
        return { path: to.path, query: sanitizedQuery, replace: true }
      }

      try {
        const accessRoutes = await permissionStore.generateRoutes()
        for (const route of accessRoutes) {
          router.addRoute(route)
        }
        userState.setRouterFlag(true)

        // Check if there is pending redirect (jump after login success)
        const pendingRedirect = sessionStorage.getItem('pendingRedirect')
        if (pendingRedirect) {
          sessionStorage.removeItem('pendingRedirect')
          return { path: pendingRedirect, replace: true }
        }

        // Re-navigate to target route after cleaning query parameters with whitelist, ensuring new route takes effect
        const sanitizedQuery = sanitizeQueryParams(to.path, to.query)
        return { ...to, query: sanitizedQuery, replace: true }
      } catch {
        userState.resetState()
        // Handle exception, e.g. remove token and jump to login page
        return getRedirectToLoginPath(to)
      }
    }

    // Not logged in or login not completed
    if (whiteList.has(to.path)) {
      // Login page also needs to clean query parameters (e.g. redirect parameter may contain XSS)
      const sanitizedQuery = sanitizeQueryParams(to.path, to.query)
      if (isQueryEqual(to.query, sanitizedQuery)) {
        return
      }
      return { path: to.path, query: sanitizedQuery, replace: true }
    }

    // Not in whitelist, redirect to login page
    return getRedirectToLoginPath(to)
  })
}
