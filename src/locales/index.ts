import { createI18n } from 'vue-i18n' // 引入vue-i18n组件
import zh_CN from '@/locales/lang/zh_CN' // 引入zh.js 模块
import zh_TW from '@/locales/lang/zh_TW' // 引入zh.js 模块
import en from '@/locales/lang/en_US' // 引入en.js 模块
import vi_VN from '@/locales/lang/vi_VN' // 引入vi.js 模块
import type { App } from 'vue'
import { useAppStoreHook } from '@/stores/app'

const appStore = useAppStoreHook()
//注册i18n实例并引入语言文件
const i18n = createI18n({
  legacy: false, // using Composition API mode
  locale: appStore.locale || 'en',
  messages: {
    en,
    zh_TW,
    zh_CN,
    vi_VN
  }
})

// 全局注册 i18n
export function setupI18n(app: App<Element>) {
  app.use(i18n)
}

export default i18n
