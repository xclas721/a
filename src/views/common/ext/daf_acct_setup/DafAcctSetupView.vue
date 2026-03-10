<template>
  <!-- Query criteria settings -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.menu.daf_acct_setup')"
    @search="handleSearch"
  />

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.menu.daf_acct_setup')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
  />

  <DetailDialog v-if="showDetail" v-model="showDetail" :detailData="detailData" :title="$t('ui.trans.log-detail')" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useTimeCalculations } from '@/utils/util'
import DetailDialog from '@/views/common/trans/transaction_log/transDetail/DetailDialog.vue'
import { useAppStoreHook } from '@/stores/app'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { findAllIssuer } from '@/hooks/searchConditions'
const { getEndDate, getStartDate } = useTimeCalculations()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const issuerSeleteOptions = computed(() => [...optionSelect, ...issuerOptions.value])
const issuerOptions = ref<BaseSelect[]>([])
const showDetail = ref(false)
const detailData = ref()
/**
 * Open transaction detail popup
 * @param acsTransId transaction serial number
 */
const openTransModal = async (acsTransId: string) => {
  const result = await apiUtil.get('/transaction/detail', { acsTransId: acsTransId }, {}, true)
  if (!result.success || result.code != '0000') {
    await swalMessage.error(result.message)
    return
  }
  detailData.value = result.data
  showDetail.value = true
  disablePageScroll()
}
// Disable page scrolling
function disablePageScroll() {
  document.body.style.overflow = 'hidden'
}
const appStoreHook = useAppStoreHook()
onMounted(async () => {
  issuerOptions.value = await findAllIssuer()
  deleteQueryConfigData()
})
/**
 * Query criteria data - delete issuer
 */
const deleteQueryConfigData = () => {
  if (appStoreHook.organ == 'issuer') {
    const isExist = userQueryConfig.value.some((field) => field.model === 'issuerOid')
    if (isExist) {
      userQueryConfig.value = userQueryConfig.value.filter((field) => field.model !== 'issuerOid')
    }
  }
}
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer-adm.issuer',
    model: 'issuerOid',
    default: appStoreHook.organ == 'issuer' ? userState.user.issuerOid : '',
    props: {
      options: issuerSeleteOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'date',
    label: 'ui.trans.log.start.date', // label is defined directly on the field object
    model: 'startDate',
    default: getStartDate,
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
    default: getEndDate,
    endDateFlag: true,
    props: {
      // Use computed to switch language
      id: 'endDate'
    }
  },
  {
    type: 'text',
    label: 'ui.daf.acct.setup.threeDSRequestorID',
    model: 'threeDSRequestorID',
    default: '',
    props: {
      // Use computed to switch language
      id: 'threeDSRequestorID'
    }
  },
  {
    type: 'text',
    label: 'ui.daf.acct.setup.acctNumber',
    model: 'acctNumber',
    default: '',
    props: {
      // Use computed to switch language
      id: 'acctNumber'
    }
  },
  {
    type: 'text',
    label: 'ui.daf.acct.setup.chAccReqID',
    model: 'chAccReqID',
    default: '',
    props: {
      // Use computed to switch language
      id: 'chAccReqID'
    }
  },
  {
    type: 'text',
    label: 'ui.daf.acct.setup.acsTransID',
    model: 'acsTransID',
    default: '',
    props: {
      // Use computed to switch language
      id: 'acsTransID'
    }
  },
  {
    type: 'text',
    label: 'ui.daf.acct.setup.threeDSServerTransID',
    model: 'threeDSServerTransID',
    default: '',
    props: {
      // Use computed to switch language
      id: 'threeDSServerTransID'
    }
  },
  {
    type: 'text',
    label: 'ui.daf.acct.setup.dsTransID',
    model: 'dsTransID',
    default: '',
    props: {
      // Use computed to switch language
      id: 'dsTransID'
    }
  }
])

// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.daf.acct.setup.threeDSRequestorID',
    field: 'threeDSRequestorId'
  },
  {
    header: 'ui.daf.acct.setup.acctNumber',
    field: 'acctNumberPrefix',
    joinCol: 'acctNumberPostfix',
    joinStr: 'xxxxxx'
  },
  {
    header: 'ui.daf.acct.setup.chAccReqID',
    field: 'chAccReqId'
  },
  {
    header: 'ui.daf.acct.setup.acsTransID',
    field: 'acsTransId',
    action: (row: Record<string, any>) => openTransModal(row.acsTransId)
  },
  {
    header: 'ui.daf.acct.setup.threeDSServerTransID',
    field: 'threeDSServerTransId'
  },
  {
    header: 'ui.daf.acct.setup.dsTransID',
    field: 'dsTransId'
  }
])

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })

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
  const result = await apiUtil.postSearchPage('/daf_acct_setup/query', searchCriteria.value, page, {}, true)

  if (!result.success) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
