<template>
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
import FloatingButton from '@/components/FloatingButton.vue'

const userState = userStateStore()
const appStore = useAppStore()
const grafanaStore = useGrafanaStore()
const { t } = useI18n()
const grafanaUrl = ref('')
const grafanaIframe = ref<HTMLIFrameElement>()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const grafanaDashboardUrl = '/report_realtime_fp2/getGrafanaUrlWithAuthToken'

const grafanaTheme = computed(() => {
  return appStore.theme === 'dark' ? 'dark' : 'light'
})

// Grafana variable configuration - easy to extend
const grafanaVariables = [
  {
    param: 'var-browserTransactionCountTitle',
    i18nKey: 'ui.grafana.panel.browserTransactionCount.name'
  },
  {
    param: 'var-threeDSMethodSuccessRateTitle',
    i18nKey: 'ui.grafana.panel.threeDSMethodSuccessRate.name'
  },
  {
    param: 'var-uniqueDeviceCountTitle',
    i18nKey: 'ui.grafana.panel.uniqueDeviceCount.name'
  },
  {
    param: 'var-top10DeviceStatsTitle',
    i18nKey: 'ui.grafana.panel.top10DeviceStats.name'
  },
  {
    param: 'var-top10IpStatsTitle',
    i18nKey: 'ui.grafana.panel.top10IpStats.name'
  },
  {
    param: 'var-transactionDeviceIpAddressGeoDistributionTitle',
    i18nKey: 'ui.grafana.panel.transactionDeviceIpAddressGeoDistribution.name'
  },
  {
    param: 'var-devicePlatformDistributionTitle',
    i18nKey: 'ui.grafana.panel.devicePlatformDistribution.name'
  },
  {
    param: 'var-deviceLocaleDistributionTitle',
    i18nKey: 'ui.grafana.panel.deviceLocaleDistribution.name'
  },
  {
    param: 'var-top10CardStatsTitle',
    i18nKey: 'ui.grafana.panel.top10CardStats.name'
  }
]

const setGrafanaUrlParams = (url: URL) => {
  url.searchParams.set('theme', grafanaTheme.value)
  url.searchParams.set('kiosk', 'true')
  url.searchParams.set('timezone', userState.user.timeZone)

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

watch([() => userState.user.locale, () => grafanaTheme.value, () => userState.user.timeZone], updateGrafanaIframe)

// Set Grafana message handler
const cleanupMessageHandler = createGrafanaMessageHandler({
  grafanaStore
})

// Open in new window
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
      const viewerUrl = `${globalThis.location.origin}${globalThis.location.pathname}#/grafana-viewer`
      window.open(viewerUrl, '_blank')
    }
  } catch (error) {
    console.error('跳转失败:', error)
  }
}

// Initialize loading data
onMounted(async () => {
  // Check appStore language setting and sync
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
    console.error('初始化失败:', error)
    await swalMessage.error('初始化失败')
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
