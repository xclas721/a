import { setupRouter } from '@/router'
import { setupI18n } from '@/locales'
import type { App } from 'vue'
import { setupPermission } from './permission'
import { setupStore } from '@/stores'

export default {
  install(app: App<Element>) {
    setupStore(app)
    // Routes (router)
    setupRouter(app)
    // Internationalization
    setupI18n(app)
    // Route guard
    setupPermission()
  }
}
