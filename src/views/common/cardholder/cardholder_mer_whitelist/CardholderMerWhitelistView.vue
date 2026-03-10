<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.cardholder-mer-whitelisting')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.cardholder-mer-whitelisting')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
    :custom-buttons="tableCustomButtonList"
  />

  <DetailDialog v-if="showDetail" v-model="showDetail" :detailData="detailData" :title="$t('ui.trans.log-detail')" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import { type BaseSelect, optionSelect, optionSelect1 } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import { findAllIssuer } from '@/hooks/issuer'
import swalMessage from '@/plugins/swalMessage'
import { useAppStoreHook } from '@/stores/app'
import { cardMerWhitelistStatusOptionSelect } from '@/utils/select/cardMerWhitelist'
import DetailDialog from '@/views/common/trans/transaction_log/transDetail/DetailDialog.vue'

const appStoreHook = useAppStoreHook()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const showDetail = ref(false)
const detailData = ref()
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
//options setting
const issuerData = ref<BaseSelect[]>([])
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})
const statusOption = computed(() => [...optionSelect, ...cardMerWhitelistStatusOptionSelect])
// Define custom buttons
const customButtonList: CustomButton[] = []
// Enable button
const tableCustomButtonList: TableCustomButton[] = [
  {
    label: 'btn.disable',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      const result = await apiUtil.post(`/cardholder_mer_whitelist/disable?oid=${row.oid}`, { oid: row.oid }, {}, true)
      if (result.success && result.code == '0000') {
        await swalMessage.success(result.message)
        // Update table
        await handleSearch(searchCriteria.value)
      } else {
        await swalMessage.error(result.message)
      }
    },
    btnShow(param) {
      return param.status == 'Y'
    }
  },
  {
    label: 'btn.setup',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      const result = await apiUtil.post(`/cardholder_mer_whitelist/enable?oid=${row.oid}`, { oid: row.oid }, {}, true)
      if (result.success && result.code == '0000') {
        await swalMessage.success(result.message)
        // Update table
        await handleSearch(searchCriteria.value)
      } else {
        await swalMessage.error(result.message)
      }
    },
    btnShow(param) {
      return param.status != 'Y'
    }
  }
]
/**
 * Pagination function
 * @param page current page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/cardholder_mer_whitelist/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }

  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
/**
 * Open transaction detail popup
 * @param acsTransId transaction serial number
 */
const openTransModal = async (acsTransId: string) => {
  const result = await apiUtil.get('/transaction/detail', { acsTransId: acsTransId }, {}, true)
  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
    return
  }
  detailData.value = result.data
  showDetail.value = true
}
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
// Initialization trigger function
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  deleteQueryConfigData()
})
// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerData.value, ...optionSelect1])
  },
  { header: 'ui.cardholder-mer-whitelisting.pan', field: 'acctNumber' },
  {
    header: 'ui.cardholder-mer-whitelisting.acquirer-bin',
    field: 'acquirerBin'
  },
  { header: 'ui.cardholder-mer-whitelisting.mer-id', field: 'acquirerMerchantId' },
  { header: 'ui.cardholder-mer-whitelisting.mer-name', field: 'merchantName' },
  {
    header: 'acs.trans.id',
    field: 'acsTransId',
    action: (row: Record<string, any>) => openTransModal(row.acsTransId)
  },
  {
    header: 'ui.cardholder-mer-whitelisting.status',
    field: 'status',
    colOptions: computed(() => [...cardMerWhitelistStatusOptionSelect])
  },
  {
    header: 'ui.cardholder-mer-whitelisting.update-time',
    field: 'updateDateTime',
    dateFormat: 'yyyy-MM-dd HH:mm:ss'
  }
])

// Search condition configuration
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    readOnly: appStoreHook.organ == 'issuer',
    props: {
      options: issuerOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'text',
    label: 'ui.cardholder-mer-whitelisting.pan',
    model: 'criteriaAcctNumber',
    default: '',
    maxlength: '19',
    props: {
      id: 'criteriaAcctNumber'
    }
  },
  {
    type: 'text',
    label: 'ui.cardholder-mer-whitelisting.acquirer-bin',
    model: 'criteriaAcquirerBIN',
    default: '',
    maxlength: '11',
    props: {
      id: 'criteriaAcquirerBIN'
    }
  },
  {
    type: 'text',
    label: 'ui.cardholder-mer-whitelisting.mer-id',
    model: 'criteriaAcquirerMerchantID',
    default: '',
    maxlength: '35',
    props: {
      id: 'criteriaAcquirerMerchantID'
    }
  },
  {
    type: 'select',
    label: 'ui.cardholder-mer-whitelisting.status',
    model: 'criteriaStatus',
    default: '',
    props: {
      options: statusOption,
      id: 'criteriaStatus'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
