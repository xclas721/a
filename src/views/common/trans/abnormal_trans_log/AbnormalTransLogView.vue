<template>
  <!-- Query criteria settings -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.abnormal.trans.log')"
    @search="handleSearch"
  />

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.abnormal.trans.log')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
  />

  <AbnormalDetailDialog
    v-if="showDetail"
    v-model="showDetail"
    :detailData="detailData"
    :title="$t('ui.abnormal.trans.log-detail')"
  />
</template>

<script setup lang="ts">
import type { CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { type BaseI18nSelect, type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { deviceChannelOptionSelect, messageVersionOptionSelect } from '@/utils/select/transStatus'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { findByCodeType } from '@/hooks/sysCode'
import { findAllIssuer } from '@/hooks/issuer'
import { useAppStoreHook } from '@/stores/app'
import AbnormalDetailDialog from '@/views/common/trans/abnormal_trans_log/AbnormalDetailDialog.vue'
import { messageCategoryOptionSelect } from '@/utils/select/challengeUi'
import { useTimeCalculations } from '@/utils/util'
import { DateTime } from 'luxon'

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const appStoreHook = useAppStoreHook()
const route = useRoute()
//CardScheme
const schemeOptions = ref<BaseI18nSelect[]>([])
//options setting
const cardSchemeOptions = computed(() => [...optionSelect, ...schemeOptions.value])
//options setting
const issuerData = ref<BaseSelect[]>([])
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})
const messageVersionOption = computed(() => [...optionSelect, ...messageVersionOptionSelect])
const deviceChannelOption = computed(() => [...optionSelect, ...deviceChannelOptionSelect])
const messageCategoryOption = computed(() => [...optionSelect, ...messageCategoryOptionSelect])
const { getEndDate, getStartDate } = useTimeCalculations()
// Search results are stored here
const showDetail = ref(false)
const detailData = ref({})

const handleDetail = async (param: any) => {
  showDetail.value = true
  detailData.value = param
  console.log('kkkk', param)
}

// Handle time range passed from URL parameters
const getUrlTimeParam = (paramName: string) => {
  const param = route.query[paramName]
  if (param && typeof param === 'string') {
    // Convert timestamp to date format
    const timestamp = Number.parseInt(param)
    if (!Number.isNaN(timestamp)) {
      return DateTime.fromMillis(timestamp).toFormat('yyyy-MM-dd HH:mm:ss')
    }
  }
  return null
}

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'date',
    label: 'ui.trans.log.start.date', // label is defined directly on the field object
    model: 'startDate',
    default: getUrlTimeParam('from_time') || getStartDate,
    startDateFlag: true,
    props: {
      // Use computed to switch language
      id: 'startDate'
    }
  },
  {
    type: 'date',
    label: 'ui.trans.log.end.date',
    model: 'endDate',
    default: getUrlTimeParam('to_time') || getEndDate,
    endDateFlag: true,
    props: {
      // Use computed to switch language
      id: 'endDate'
    }
  },
  {
    type: 'select',
    label: 'ui.card-scheme.name',
    model: 'criteriaCardScheme',
    default: '',
    props: {
      // Use computed to switch language
      options: cardSchemeOptions,
      id: 'criteriaCardScheme'
    }
  },
  {
    type: 'select',
    label: 'message.version',
    model: 'messageVersion',
    default: '',
    props: {
      // Use computed to switch language
      options: messageVersionOption,
      id: 'messageVersion'
    }
  },
  {
    type: 'select',
    label: 'device.channel',
    model: 'deviceChannel',
    default: '',
    props: {
      // Use computed to switch language
      options: deviceChannelOption,
      id: 'deviceChannel'
    }
  },
  {
    type: 'text',
    label: 'ui.trans.log.basic.ACSTransactionID',
    model: 'acsTransID',
    default: '',
    props: {
      // Use computed to switch language
      id: 'acsTransID'
    }
  },
  {
    type: 'text',
    label: '3ds.server.trans.id',
    model: 'threeDSServerTransID',
    default: '',
    props: {
      // Use computed to switch language
      id: 'threeDSServerTransID'
    }
  },
  {
    type: 'text',
    label: 'ui.trans.log.acct.id',
    model: 'acctId',
    default: '',
    props: {
      // Use computed to switch language
      id: 'acctId'
    }
  },
  {
    type: 'text',
    label: 'ui.trans.log.acct.number.prefix',
    model: 'acctNumberPrefix',
    default: '',
    props: {
      // Use computed to switch language
      id: 'acctNumberPrefix'
    }
  },
  {
    type: 'text',
    label: 'ui.trans.log.acct.number.postfix',
    model: 'acctNumberPostfix',
    default: '',
    props: {
      // Use computed to switch language
      id: 'acctNumberPostfix'
    }
  },
  {
    type: 'text',
    label: 'ui.trans.log.acquirer.merchant.id',
    model: 'acquirerMerchantID',
    default: '',
    props: {
      // Use computed to switch language
      id: 'acquirerMerchantID'
    }
  },
  {
    type: 'select',
    label: 'ui.trans.messageCategory',
    model: 'messageCategory',
    default: '',
    props: {
      // Use computed to switch language
      options: messageCategoryOption,
      id: 'messageCategory'
    }
  }
])

// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerOptions.value])
  },
  { header: '3ds.server.trans.id', field: 'threeDSServerTransId', action: handleDetail },
  { header: 'message.version', field: 'messageVersion' },
  { header: 'ui.trans.messageCategory', field: 'messageCategory' },
  {
    header: 'acct.number',
    field: 'acctNumberPrefix',
    joinCol: 'acctNumberPostfix',
    joinStr: 'XXXXXX'
  },
  { header: 'device.channel', field: 'deviceChannel' },
  { header: 'merchant.name', field: 'merchantName' },
  { header: 'acquirer.merchant.id', field: 'acquirerMerchantId' },
  { header: 'trans.time', field: 'createDateTime', dateFormat: 'yyyy-MM-dd HH:mm:ss' },
  { header: 'error.description', field: 'errorDetail' }
])

// Reactive to refresh table
const searchCriteria = ref<any>({
  issuerOid: userState.user.issuerOid,
  startDate: getUrlTimeParam('from_time') || getStartDate,
  endDate: getUrlTimeParam('to_time') || getEndDate
})

// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

/**
 * Pagination query
 * @param page current page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/abnormal_trans_log/query', searchCriteria.value, page, {}, true)

  if (!result.success) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

onMounted(async () => {
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
  issuerData.value = await findAllIssuer()
})
</script>

<style scoped>
/* Add your styles here */
</style>
