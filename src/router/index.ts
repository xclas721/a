import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { useAppStoreHook } from '@/stores/app'
const Layout = () => import('@/layout/HomeView.vue')
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'homeView',
    component: Layout,
    meta: { requiresAuth: true },
    redirect: '/health',
    children: [
      {
        path: 'health',
        name: 'ui.system-health',
        component: () => import('@/views/HealthView.vue')
      },
      {
        path: '404',
        name: '404',
        meta: { title: '404' },
        component: () => import('@/views/404View.vue')
      },
      {
        path: 'account-security',
        name: 'AccountSecurity',
        meta: { title: 'ui.main.menu.account-security', requiresAuth: true },
        component: () => import('@/views/common/account/AccountSecurityView.vue')
      },
      {
        path: ':pathMatch(.*)*',
        name: '403',
        component: () => import('@/views/404View.vue')
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/RedirectIndex.vue')
      }
    ]
  },
  {
    path: '/grafana-redirect',
    name: 'GrafanaRedirect',
    meta: { hidden: true },
    component: () => import('@/views/redirect/GrafanaRedirectView.vue')
  },
  {
    path: '/grafana-viewer',
    name: 'GrafanaViewer',
    meta: { hidden: true },
    component: () => import('@/views/redirect/GrafanaViewerView.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: { title: 'About' },
    component: () => import('@/views/AboutView.vue')
  },
  // Level 3 menu
  // {
  //   path: '/system',
  //   name: 'ui.menu.sys',
  //   component: Layout,
  //   children:[
  //     {
  //       path: '/system/sys_code',
  //       name: 'ui.sys-code',
  //       component: () => import('@/views/hosted/system/sys_code/SysCodeIndex.vue'),
  //       redirect: '/system/sys_code',
  //       children: [
  //         {
  //           path: '/system/sys_code',
  //           component: () => import('@/views/hosted/system/sys_code/SysCodeView.vue')
  //         },
  //         {
  //           path: '/system/sys_code/CardBinViewDetail/:id/:title',
  //           name: 'CardBinViewDetail',
  //           component: () => import('@/views/hosted/system/sys_code/SysCodeViewDetail.vue'),
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/404View.vue'),
    props: true // Parameters will be automatically converted to props
  },
  {
    path: '/issuer/login',
    name: 'issuerLogin',
    component: () => import('@/views/issuer/login/IssuerLoginView.vue')
  },
  {
    path: '/hosted/login',
    name: 'hostedLogin',
    component: () => import('@/views/hosted/login/HostedLoginView.vue')
  }
]

const ctx = (window as any).__APP_CONFIG__?.CONTEXT_PATH || '/'

export function createDefaultRouter() {
  return createRouter({
    history: createWebHashHistory(ctx),
    routes: constantRoutes,
    // On refresh, scrollbar position restore
    scrollBehavior: () => ({ left: 0, top: 0 })
  })
}

const router = createDefaultRouter()

// Global register router
export function setupRouter(app: App<Element>) {
  app.use(router)
}

export function resetRouter() {
  // Clear routes
  const appStoreHook = useAppStoreHook()
  router.replace({ path: `/${appStoreHook.organ}/login` })
}

export default router
