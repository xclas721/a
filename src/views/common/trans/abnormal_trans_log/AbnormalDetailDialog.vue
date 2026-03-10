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
import ApiUtil from '@/utils/apiUtils'
import UtilityButton from '@/components/UtilityButton.vue'
import AbnormalMessageDetail from '@/views/common/trans/abnormal_trans_log/AbnormalMessageDetail.vue'
import LogMsg from '@/views/common/trans/abnormal_trans_log/AbnormalLogMsg.vue'

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
  logMsg: false
  // Other Tabs...
})
// Define tabs array, bind label and corresponding component
const filteredTabs = shallowRef<any[]>([
  { name: 'message', label: t('ui.trans.log-trading.message'), component: AbnormalMessageDetail },
  { name: 'logMsg', label: t('ui.trans.log-message.message'), component: LogMsg }
])

// Call corresponding API based on Tab name and store data
const fetchDataForTab = async (tab: string) => {
  if (tab === 'message') {
    await fetchBaseMessageData(tab)
  } else if (tab === 'logMsg') {
    await fetchLogMsgData(tab)
  }
  tabLoaded.value[tab] = true
}
const oid = props.detailData['oid']

const fetchBaseMessageData = async (tab: string) => {
  const result = await apiUtil.get(`/abnormal_trans_log/detail/${oid}`, {}, {}, true)
  if (result.success) {
    viewDetailData.value[tab] = result.data
  }
}
const fetchLogMsgData = async (tab: string) => {
  const result = await apiUtil.get(`/abnormal_trans_log/log_msg/${oid}`, {}, {}, true)
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

onMounted(async () => {
  await fetchDataForTab('message')
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
