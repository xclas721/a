<template>
  <!-- <div class="d-flex justify-content-between align-items-center mb-3">
    <h4>{{ $t('ui.menu.report_realtime_overview_adv') }}</h4>
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
import FloatingButton from '@/components/FloatingButton.vue'
import swalMessage from '@/plugins/swalMessage'
import { userStateStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useGrafanaStore } from '@/stores/grafana'
import { createGrafanaMessageHandler, extractTimeRangeFromUrl } from '@/utils/grafanaUtil'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const userState = userStateStore()
const appStore = useAppStore()
const grafanaStore = useGrafanaStore()
const { t, locale } = useI18n()
const router = useRouter()
const grafanaUrl = ref('')
const grafanaIframe = ref<HTMLIFrameElement>()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const grafanaDashboardUrl = '/report_realtime_overview_adv/getGrafanaUrlWithAuthToken'

const grafanaTheme = computed(() => {
  return appStore.theme === 'dark' ? 'dark' : 'light'
})

// Grafana variable configuration - easy to extend
const grafanaVariables = [
  {
    param: 'var-totalTransactionsName',
    i18nKey: 'ui.grafana.panel.totalTransactions.adv.name'
  },
  {
    param: 'var-distinctCardNumbersName',
    i18nKey: 'ui.grafana.panel.distinctCardNumbers.adv.name'
  },
  {
    param: 'var-merchantCountName',
    i18nKey: 'ui.grafana.panel.merchantCount.adv.name'
  },
  {
    param: 'var-transactionVerificationResultName',
    i18nKey: 'ui.grafana.panel.transactionVerificationResult.adv.name'
  },
  {
    param: 'var-transactionSuccessRateTrendName',
    i18nKey: 'ui.grafana.panel.transactionSuccessRateTrend.adv.name'
  },
  {
    param: 'var-transactionSuccessRateName',
    i18nKey: 'ui.grafana.panel.transactionSuccessRate.adv.name'
  },
  {
    param: 'var-frictionlessRateName',
    i18nKey: 'ui.grafana.panel.frictionlessRate.adv.name'
  },
  {
    param: 'var-challengeVerificationSuccessRateTitle',
    i18nKey: 'ui.grafana.panel.challengeVerificationSuccessRate.adv.title'
  },
  {
    param: 'var-failTransactionAndReasonCodeTitle',
    i18nKey: 'ui.grafana.panel.failTransactionAndReasonCode.adv.title'
  },
  {
    param: 'var-failureCategoryStatisticsTitle',
    i18nKey: 'ui.grafana.panel.failureCategoryStatistics.adv.title'
  },
  {
    param: 'var-totalTransactionsDescription',
    i18nKey: 'ui.grafana.panel.totalTransactions.adv.description'
  },
  {
    param: 'var-transactionSuccessRateDescription',
    i18nKey: 'ui.grafana.panel.transactionSuccessRate.adv.description'
  },
  {
    param: 'var-frictionlessRateDescription',
    i18nKey: 'ui.grafana.panel.frictionlessRate.adv.description'
  },
  {
    param: 'var-challengeVerificationSuccessRateDescription',
    i18nKey: 'ui.grafana.panel.challengeVerificationSuccessRate.adv.description'
  },
  {
    param: 'var-distinctCardNumbersDescription',
    i18nKey: 'ui.grafana.panel.distinctCardNumbers.adv.description'
  },
  {
    param: 'var-merchantCountDescription',
    i18nKey: 'ui.grafana.panel.merchantCount.adv.description'
  },
  {
    param: 'var-transactionVerificationResultDescription',
    i18nKey: 'ui.grafana.panel.transactionVerificationResult.adv.description'
  },
  {
    param: 'var-transactionSuccessRateTrendDescription',
    i18nKey: 'ui.grafana.panel.transactionSuccessRateTrend.adv.description'
  },
  {
    param: 'var-failureCategoryStatisticsDescription',
    i18nKey: 'ui.grafana.panel.failureCategoryStatistics.adv.description'
  },
  {
    param: 'var-failTransactionAndReasonCodeDescription',
    i18nKey: 'ui.grafana.panel.failTransactionAndReasonCode.adv.description'
  }
  // When adding a new title, just add the new configuration here
]

const setGrafanaUrlParams = (url: URL) => {
  url.searchParams.set('theme', grafanaTheme.value)
  url.searchParams.set('kiosk', 'true')
  url.searchParams.set('timezone', userState.user.timeZone)

  // Pass base URL info
  url.searchParams.set('var-baseUrl', globalThis.location.origin)

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
  grafanaStore,
  router
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
