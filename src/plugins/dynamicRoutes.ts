import { defineStore } from 'pinia'
import { MenuType, type RouteVO } from '@/stores/user'
import type { RouteRecordRaw } from 'vue-router'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { constantRoutes } from '@/router'
import ApiUtil from '@/utils/apiUtils'
import { store } from '@/stores'

const modules = import.meta.glob('../views/**/*.vue')
const Layout = () => import('@/layout/HomeView.vue')
import { useAppStoreHook } from '@/stores/app'

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

const appStoreHook = useAppStoreHook()

export function filterRouter(routers: RouteVO[]) {
  const asyncRoutes: RouteRecordRaw[] = []
  for (const router of routers) {
    const tmpRoute = { ...router } as RouteRecordRaw
    // Top level directory, replaced by Layout component. No sidebar if not set
    if (router.component?.toString() == 'Layout') {
      tmpRoute.component = Layout
      // If Layout component and has child routes, remove parent route name to avoid duplication with child routes
      if (router.children && router.children.length > 0) {
        delete tmpRoute.name
      }
    } else {
      const organ = handleMenu(router.menuType)
      const component = modules[`../views/${organ}${tmpRoute.path}/${String(tmpRoute.component)}.vue`]
      if (component) {
        tmpRoute.component = component
      } else {
        // No match, jump to 404
        console.log(organ + tmpRoute.path)
        tmpRoute.component = modules[`../views/404View.vue`]
      }
    }
    if (router.children) {
      tmpRoute.children = filterRouter(router.children)
    }
    asyncRoutes.push(tmpRoute)
  }
  return asyncRoutes
}

/**
 * Handle menu directory
 * @param menuType menu type
 */
const handleMenu = (menuType: string) => {
  switch (menuType) {
    case '0':
      return MenuType.Hosted
    case '1':
      return MenuType.Issuer
    case '2':
      return MenuType.Common
    case '3':
      return appStoreHook.organ
    default:
      return MenuType.Common
  }
}
// setup
export const usePermissionStore = defineStore('permission', () => {
  // state
  const routes: Ref<RouteRecordRaw[]> = ref<RouteRecordRaw[]>([])

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]): void {
    routes.value = constantRoutes.concat(newRoutes)
  }

  async function generateRoutes(): Promise<RouteRecordRaw[]> {
    let result: RouteRecordRaw[] = []
    const adminRouter = await apiUtil.post('/menu/getRouter', null, {}, true)
    if (adminRouter.success && adminRouter.data != null) {
      result = filterRouter(adminRouter.data)
      setRoutes(result)
    }
    return result
  }

  return { routes, generateRoutes }
})

// Non-setup
export function usePermissionStoreHook(): ReturnType<typeof usePermissionStore> {
  return usePermissionStore(store)
}
