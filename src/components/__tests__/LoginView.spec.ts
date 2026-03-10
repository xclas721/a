import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from '../../router'
import LoginView from '../../views/issuer/login/IssuerLoginView.vue'
import { createApp } from 'vue'
import i18n from '../../locales'
import { createPinia } from 'pinia'

import setupPlugins from '@/plugins'
import App from '../../App.vue'
describe('Vue Router with i18n', () => {
  // Create a function to create new router instance
  function createTestRouter() {
    return createRouter({
      history: createWebHistory(),
      routes: constantRoutes
    })
  }

  it('renders LoginView component via routing', async () => {
    const router = createTestRouter()
    const app = createApp(App)

    app.use(createPinia())
    app.use(setupPlugins)
    // Use mount to create a component with routing
    const wrapper = mount(LoginView, {
      global: {
        plugins: [router, i18n]
      }
    })

    // 模拟导航到 '/' 路径
    router.push('/')
    await router.isReady()

    // 断言
    expect(wrapper.html()).toContain('HiTRUST')
  })
})
