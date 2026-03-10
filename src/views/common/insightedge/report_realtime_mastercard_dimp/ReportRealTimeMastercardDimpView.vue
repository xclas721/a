<template>
  <!-- <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>{{ $t('ui.menu.report_realtime_mastercard_dimp') }}</h4>
  </div> -->
  <div class="iframe-container">
    <FloatingButton label="ui.trans_performance_monitor.btn.openwindow" @click="opennewwindow" />
    <iframe
      :src="grafanaUrl"
      width="100%"
      frameborder="0"
      style="border: 0px solid #ccc"
      ref="grafanaIframe"
      class="grafana-iframe"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import ApiUtil from '@/utils/apiUtils'
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FloatingButton from '@/components/FloatingButton.vue'
import swalMessage from '@/plugins/swalMessage'
import { userStateStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useGrafanaStore } from '@/stores/grafana'
import { createGrafanaMessageHandler, extractTimeRangeFromUrl } from '@/utils/grafanaUtil'

const { t } = useI18n()
const userState = userStateStore()
const appStore = useAppStore()
const grafanaStore = useGrafanaStore()
const grafanaUrl = ref('')
const grafanaIframe = ref<HTMLIFrameElement>()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

// Backend not implemented yet, follow existing pattern: request Grafana URL with token
const grafanaDashboardUrl = '/report_realtime_mastercard_dimp/getGrafanaUrlWithAuthToken'

const grafanaTheme = computed(() => {
  return appStore.theme === 'dark' ? 'dark' : 'light'
})

// Grafana variable configuration (Panel Title)
const grafanaVariables = [
  { param: 'var-edit1Title', i18nKey: 'ui.grafana.panel.edit1.name' },
  { param: 'var-edit3Title', i18nKey: 'ui.grafana.panel.edit3.name' },
  { param: 'var-edit7Title', i18nKey: 'ui.grafana.panel.edit7.name' },
  { param: 'var-edit8Title', i18nKey: 'ui.grafana.panel.edit8.name' },
  { param: 'var-edit11Title', i18nKey: 'ui.grafana.panel.edit11.name' },
  { param: 'var-edit1Description', i18nKey: 'ui.grafana.panel.edit1.description' },
  { param: 'var-edit3Description', i18nKey: 'ui.grafana.panel.edit3.description' },
  { param: 'var-edit7Description', i18nKey: 'ui.grafana.panel.edit7.description' },
  { param: 'var-edit8Description', i18nKey: 'ui.grafana.panel.edit8.description' },
  { param: 'var-edit11Description', i18nKey: 'ui.grafana.panel.edit11.description' }
]

const setGrafanaUrlParams = (url: URL) => {
  url.searchParams.set('theme', grafanaTheme.value)
  url.searchParams.set('kiosk', 'true')
  url.searchParams.set('timezone', userState.user.timeZone)

  for (const variable of grafanaVariables) {
    url.searchParams.set(variable.param, t(variable.i18nKey))
  }

  // Extract and store time range parameters to store
  const timeRange = extractTimeRangeFromUrl(url)
  if (timeRange) {
    grafanaStore.setTimeRange(timeRange)
  }
}

const updateGrafanaIframe = () => {
  if (grafanaIframe.value && grafanaUrl.value) {
    try {
      const url = new URL(grafanaUrl.value)
      setGrafanaUrlParams(url)
      grafanaIframe.value.src = url.toString()
    } catch (error) {
      console.error('更新 Grafana 失敗:', error)
    }
  }
}

watch([() => userState.user.locale, () => grafanaTheme.value, () => userState.user.timeZone], updateGrafanaIframe)

// Set Grafana message handler
const cleanupMessageHandler = createGrafanaMessageHandler({
  grafanaStore
})

const opennewwindow = async () => {
  try {
    // Read time range parameters from store
    const requestBody = grafanaStore.getTimeRangeParams

    const result = await apiUtil.post(grafanaDashboardUrl, requestBody, {}, true)
    if (result.success) {
      const urlObj = new URL(result.data.grafanaUrlWithAuthToken)
      setGrafanaUrlParams(urlObj)

      // Save URL to sessionStorage and open new tab
      sessionStorage.setItem('grafanaViewerUrl', urlObj.toString())
      const viewerUrl = `${window.location.origin}${window.location.pathname}#/grafana-viewer`
      window.open(viewerUrl, '_blank')
    }
  } catch (error) {
    console.error('跳轉失敗:', error)
  }
}

onMounted(async () => {
  if (appStore.language && appStore.language !== userState.user.locale) {
    userState.setLocale(appStore.language)
  }
  try {
    // Read time range parameters from store
    const requestBody = grafanaStore.getTimeRangeParams

    const result = await apiUtil.post(grafanaDashboardUrl, requestBody, {}, true)
    if (result.success) {
      const urlObj = new URL(result.data.grafanaUrlWithAuthToken)
      setGrafanaUrlParams(urlObj)
      grafanaUrl.value = urlObj.toString()
    } else {
      await swalMessage.error(result.message)
    }
  } catch (error) {
    console.error('初始化失敗:', error)
    await swalMessage.error('初始化失敗')
  }
})

// Clear watcher
onUnmounted(() => {
  cleanupMessageHandler()
})
</script>

<style scoped>
h4 {
  color: #6c757d;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 20px;
  width: 100%;
  display: block;
}

.iframe-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  overflow: hidden;
}

.grafana-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
