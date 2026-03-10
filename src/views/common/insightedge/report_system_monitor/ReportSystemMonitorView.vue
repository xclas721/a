<template>
  <!-- <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>{{ $t('ui.menu.report_system_monitor') }}</h4>
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
import swalMessage from '@/plugins/swalMessage'
import { userStateStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useGrafanaStore } from '@/stores/grafana'
import { createGrafanaMessageHandler, extractTimeRangeFromUrl } from '@/utils/grafanaUtil'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FloatingButton from '@/components/FloatingButton.vue'

const userState = userStateStore()
const appStore = useAppStore()
const grafanaStore = useGrafanaStore()
const { t, locale } = useI18n()
const router = useRouter()
const grafanaUrl = ref('')
const grafanaIframe = ref<HTMLIFrameElement>()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const grafanaDashboardUrl = '/report_system_monitor/getGrafanaUrlWithAuthToken'

const grafanaTheme = computed(() => {
  return appStore.theme === 'dark' ? 'dark' : 'light'
})

// Grafana variable configuration - Titles for 8 panels
const grafanaVariables = [
  {
    param: 'var-e1Title',
    i18nKey: 'ui.grafana.panel.e1.name'
  },
  {
    param: 'var-e2Title',
    i18nKey: 'ui.grafana.panel.e2.name'
  },
  {
    param: 'var-e3Title',
    i18nKey: 'ui.grafana.panel.e3.name'
  },
  {
    param: 'var-e3_1Title',
    i18nKey: 'ui.grafana.panel.e3_1.name'
  },
  {
    param: 'var-e4Title',
    i18nKey: 'ui.grafana.panel.e4.name'
  },
  {
    param: 'var-e5Title',
    i18nKey: 'ui.grafana.panel.e5.name'
  },
  {
    param: 'var-e6Title',
    i18nKey: 'ui.grafana.panel.e6.name'
  },
  {
    param: 'var-e7Title',
    i18nKey: 'ui.grafana.panel.e7.name'
  }
]

const setGrafanaUrlParams = (url: URL) => {
  url.searchParams.set('theme', grafanaTheme.value)
  url.searchParams.set('kiosk', 'true')
  url.searchParams.set('timezone', userState.user.timeZone)

  // Pass base URL info
  url.searchParams.set('var-baseUrl', window.location.origin)

  // Set language variable
  url.searchParams.set('var-lang', locale.value)

  // Use configuration object to dynamically set variables
  for (const variable of grafanaVariables) {
    url.searchParams.set(variable.param, t(variable.i18nKey))
  }

  // Extract and store time range parameters to store
  const timeRange = extractTimeRangeFromUrl(url)
  if (timeRange) {
    grafanaStore.setTimeRange(timeRange)
  }
}

// Update Grafana iframe
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

watch([() => locale.value, () => grafanaTheme.value, () => userState.user.timeZone], updateGrafanaIframe)

// Set Grafana message handler
const cleanupMessageHandler = createGrafanaMessageHandler({
  grafanaStore
})

// Handle messages from Grafana (iframe or new window)
const handleGrafanaMessage = (event: MessageEvent) => {
  // The following console.log is for development convenience
  // console.log('Received message from Grafana:', event.data)

  // Handle jump message
  if (event.data.type === 'GRAFANA_REDIRECT') {
    const { path } = event.data.payload
    // The following console.log is for development convenience
    // console.log('Verified message type:', event.data.type)
    // console.log('Execute jump to:', path)
    router.push(path)
  }
}

// Open in new window
const opennewwindow = async () => {
  try {
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
    console.error('跳转失败:', error)
  }
}

// Initialize loading data
onMounted(async () => {
  // Add postMessage listener
  window.addEventListener('message', handleGrafanaMessage)

  // Check appStore language setting and sync
  if (appStore.language && appStore.language !== userState.user.locale) {
    userState.setLocale(appStore.language)
  }

  try {
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
    console.error('初始化失败:', error)
    await swalMessage.error('初始化失败')
  }
})

// Clear watcher
onUnmounted(() => {
  window.removeEventListener('message', handleGrafanaMessage)
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
