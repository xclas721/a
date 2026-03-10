import { store } from '@/stores'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'
import { DateTime } from 'luxon'

export const useAppStore = defineStore('app', () => {
  const initLanguage = () => {
    const browserLang = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase()
    // Supported languages: zh-TW, zh-CN, en-US, vi-VN; defaults to English if unsupported
    if (browserLang === 'en' || browserLang.startsWith('en-')) return 'en-US'
    if (browserLang.startsWith('zh-tw') || browserLang.startsWith('zh-hk')) return 'zh-TW'
    if (browserLang.startsWith('zh-cn') || browserLang.startsWith('zh-sg') || browserLang === 'zh') return 'zh-CN'
    if (browserLang.startsWith('vi')) return 'vi-VN'
    return 'en-US'
  }
  // Language - format
  const language = useStorage('language', initLanguage)
  // Control sidebar collapse status
  const isCollapsed = ref(false)
  // Start time interval: current time - startDate
  const startDate = ref(1)
  //'day' | 'hour' | 'month'
  const dateUnit = ref<string>('month')

  const organ = useStorage('organ', 'issuer')

  const theme = useStorage('admin-theme', 'light')

  const formTitle = useStorage('formTitle', '')

  const maxFileSize = useStorage('maxFileSize', 5 * 1024 * 1024)

  const challengeUiDefaultLocale = useStorage('challengeUiDefaultLocale', 'zh_CN')

  // Calculate dynamic date
  const getDynamicDate = (offset: number, unit: string) => {
    return DateTime.now()
      .minus({ [unit]: offset })
      .toFormat('yyyy-MM-dd HH:mm:ss')
  }

  // Start date (computed)
  const getStartDate = computed(() => getDynamicDate(startDate.value, dateUnit.value))
  // End date (Current time, computed property)
  const getEndDate = computed(() => DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'))
  /**
   * Read corresponding language package based on language identifier - format
   */
  const locale = computed(() => {
    const lang = language?.value
    if (lang === 'zh-CN' || lang === 'zh_CN') return 'zh_CN'
    if (lang === 'zh-TW' || lang === 'zh_TW') return 'zh_TW'
    return 'en-US'
  })

  /**
   * Switch language
   *
   * @param val
   */
  function changeLanguage(val: string) {
    language.value = val
  }

  function changeMaxFileSize(val: number) {
    maxFileSize.value = val
  }
  function changeChallengeUiDefaultLocale(val: string) {
    challengeUiDefaultLocale.value = val
  }
  // Function to toggle sidebar status
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const toggleTheme = (_theme: string) => {
    theme.value = _theme
  }

  function toggleFormTitle(val: string) {
    formTitle.value = val
  }

  function changeOrgan(val: string) {
    organ.value = val
  }
  function resetAppStore() {
    formTitle.value = ''
  }
  return {
    language,
    startDate,
    dateUnit,
    locale,
    changeLanguage,
    changeMaxFileSize,
    challengeUiDefaultLocale,
    changeChallengeUiDefaultLocale,
    organ,
    changeOrgan,
    isCollapsed,
    toggleSidebar,
    theme,
    toggleTheme,
    formTitle,
    toggleFormTitle,
    resetAppStore,
    maxFileSize,
    getStartDate,
    getEndDate
  }
})

/**
 * Used to use store instance provided by Pinia outside of component (e.g. in Pinia Store).
 * Official documentation explains how to use Pinia Store outside of component:
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useAppStoreHook() {
  return useAppStore(store)
}
