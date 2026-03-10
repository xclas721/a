<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div style="max-width: 80%; margin: 5rem auto">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-coreui-dismiss="modal"
            aria-label="Close"
            @click="closeDialog"
          ></button>
        </div>
        <div class="modal-body">
          <nav>
            <div class="nav nav-tabs" id="nav-tab">
              <button
                v-for="tab in filteredTabs"
                :key="tab.name"
                class="nav-link"
                :class="{ active: activeTab === tab.name }"
                @click="switchTab(tab.name)"
              >
                {{ tab.label }}
              </button>
            </div>
          </nav>

          <div class="tab-content" id="nav-tabContent" v-if="detailData">
            <div
              v-for="tab in filteredTabs"
              :key="tab.name"
              class="tab-pane fade mt-4"
              :class="{ 'show active': activeTab === tab.name }"
            >
              <component :is="tab.component" :data="viewDetailData[tab.name] || {}"></component>
            </div>
          </div>

          <div class="float-end">
            <UtilityButton
              id="closeBtn"
              label="btn.close"
              variant="primary"
              appearance="contained"
              class="mt-3"
              @click="closeDialog"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DeviceInfo from '@/views/common/trans/transaction_log/transDetail/TransDeviceInfo.vue'
import LogMsg from '@/views/common/trans/transaction_log/transDetail/TransLogMsg.vue'
import TranMessage from '@/views/common/trans/transaction_log/transDetail/TranMessage.vue'
import TransMessageDetail from '@/views/common/trans/transaction_log/transDetail/TransMessageDetail.vue'
import TransRisk from '@/views/common/trans/transaction_log/transDetail/TransRisk.vue'
import TransOtpMsg from '@/views/common/trans/transaction_log/transDetail/TransOtpMsg.vue'
import VisaDaf from '@/views/common/trans/transaction_log/transDetail/VisaDaf.vue'
import KbaHistory from '@/views/common/trans/transaction_log/transDetail/KbaHistory.vue'
import FidoLogs from '@/views/common/trans/transaction_log/transDetail/FidoLogs.vue'
import mcRBA from '@/views/common/trans/transaction_log/transDetail/McRBA.vue'
import ruleEngine from '@/views/common/trans/transaction_log/transDetail/RuleEngine.vue'
import Veriid from '@/views/common/trans/transaction_log/transDetail/TransVeriid.vue'
import ApiUtil from '@/utils/apiUtils'
import UtilityButton from '@/components/UtilityButton.vue'

const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const props = defineProps<{
  detailData: Record<string, any>
  modelValue: boolean
  title: string
}>()
const emit = defineEmits(['update:modelValue'])
const showFlag = ref(props.modelValue)
const activeTab = ref('message')
// Store data for each tab
const viewDetailData = ref<Record<string, any>>(props.detailData)
// Define an object to store loading status of each Tab
const tabLoaded = ref<Record<string, boolean>>({
  message: true,
  messageDetail: false,
  visa: false,
  logMsg: false,
  Otp: false,
  kba: false,
  fido: false,
  device: false,
  mcRBA: false,
  riskIndicator: false,
  ruleEngine: false,
  veriid: false
})
// Define tabs array, bind label and corresponding component
const tabs = [
  { name: 'message', label: t('ui.trans.log-trading.message'), component: TranMessage },
  {
    name: 'messageDetail',
    label: t('ui.trans.log-trading.message.detail'),
    component: TransMessageDetail
  },
  { name: 'visa', label: t('ui.menu.visa.ext'), component: VisaDaf },
  { name: 'logMsg', label: t('ui.trans.log-message.message'), component: LogMsg },
  { name: 'Otp', label: t('ui.trans.log-otp.message'), component: TransOtpMsg },
  { name: 'kba', label: t('ui.trans.kba.history'), component: KbaHistory },
  { name: 'fido', label: t('ui.trans.fido'), component: FidoLogs },
  { name: 'device', label: t('ui.trans.device.info'), component: DeviceInfo },
  { name: 'mcRBA', label: t('ui.trans.log.mc-rba'), component: mcRBA },
  { name: 'riskIndicator', label: t('ui.risk-indicator.report'), component: TransRisk },
  { name: 'ruleEngine', label: t('ui.trans.log.rule-engine-report'), component: ruleEngine },
  { name: 'veriid', label: t('ui.trans.log.veriid-report'), component: Veriid }
]

// Call corresponding API based on Tab name and store data
const fetchDataForTab = async (tab: string) => {
  if (tab === 'message') {
    await fetchBaseMessageData(tab)
  } else if (tab === 'messageDetail') {
    await fetchMessageData(tab)
  } else if (tab === 'visa') {
    await fetchVisaData(tab)
  } else if (tab === 'logMsg') {
    await fetchLogMsgData(tab)
  } else if (tab === 'device') {
    await fetchDeviceData(tab)
  } else if (tab === 'kba') {
    await fetchKbaData(tab)
  } else if (tab === 'fido') {
    await fetchFidoData(tab)
  } else if (tab === 'mcRBA') {
    await fetchMcRBAData(tab)
  } else if (tab === 'riskIndicator') {
    await fetchRiskData(tab)
  } else if (tab === 'Otp') {
    await fetchOtpData(tab)
  } else if (tab === 'ruleEngine') {
    await fetchRuleEngineData(tab)
  } else if (tab === 'veriid') {
    await fetchVeriIdData(tab)
  }
  tabLoaded.value[tab] = true
}
const acsTransId = props.detailData['acsTransId']

const fetchBaseMessageData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/baseMessage', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}
const fetchMessageData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/detail', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}
const fetchVisaData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/visaRbaLog', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}
const fetchLogMsgData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/messageLogDetail', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}

const fetchOtpData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/authOtp', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}
const fetchRuleEngineData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/rule', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}
const fetchVeriIdData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/veriid', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}
const fetchDeviceData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/device', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}
const fetchKbaData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/authSecureQuestion', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}
const fetchFidoData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/fidoApiLog', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}

const fetchMcRBAData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/mcRbaLog', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}

const fetchRiskData = async (tab: string) => {
  const result = await apiUtil.get('/transaction/rba', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}

// Watch modelValue to control showFlag
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      fetchDataForTab(activeTab.value)
    }
    showFlag.value = newVal
  }
)

// Method to switch tab, pass ID for query
const switchTab = (tab: string) => {
  activeTab.value = tab // Switch to selected tab
  if (!tabLoaded.value[tab]) {
    fetchDataForTab(tab)
  }
}

const dispalyCss = computed(() => {
  return showFlag.value ? `display:block;background:rgba(0,0,0,0.7);` : `display:none;background:rgba(0,0,0,0.7);`
})

// Close popup
const closeDialog = () => {
  showFlag.value = false
  emit('update:modelValue', false)

  enablePageScroll()
}
const filteredTabs = shallowRef<any[]>([])
const tableShow = async () => {
  // Check which tables to display
  const result = await apiUtil.get('/transaction/queryTableShow', { acsTransId: acsTransId }, {}, true)
  if (result.success) {
    const { authSecureQuestionList, fidoApiLogs, mcRbaLog, rbaFlag, visaRba } = result.data
    // Filter tabs based on data returned by interface
    filteredTabs.value = tabs.filter((tab) => {
      if (tab.name === 'kba' && authSecureQuestionList) return false
      if (tab.name === 'visa' && !visaRba) return false
      if (tab.name === 'fido' && fidoApiLogs) return false
      if (tab.name === 'mcRBA' && mcRbaLog) return false
      // Handle mutex logic for riskIndicator, ruleEngine, veriid
      if (tab.name === 'riskIndicator' && rbaFlag !== 'rba') return false
      if (tab.name === 'ruleEngine' && rbaFlag !== 'rule') return false
      if (tab.name === 'veriid' && rbaFlag !== 'veriid') return false
      return true
    })
  }
}
onMounted(async () => {
  await fetchDataForTab('message')

  await tableShow()
})
onUnmounted(() => {
  enablePageScroll()
})

// Allow page scrolling
function enablePageScroll() {
  document.body.style.overflow = ''
}
</script>

<style>
.modal-content {
  border: 0;
}
</style>
