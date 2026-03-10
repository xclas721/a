import { defineStore } from 'pinia'
import i18n from '@/locales/index'
export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loading: false,
    message: i18n.global.t('ui.system.loading')
  }),
  actions: {
    startLoading(message = i18n.global.t('ui.system.loading')) {
      this.loading = true
      this.message = message
    },
    finishLoading() {
      this.loading = false
    },
    resetLoading() {
      this.loading = false
    }
  }
})
