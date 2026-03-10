import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
const store = createPinia()

// Global register store
export function setupStore(app: App<Element>) {
  store.use(piniaPersist)
  app.use(store)
}

export { store }
