<template>
  <!-- Query criteria settings -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.meun.card-organization-trans-query')"
    @search="handleSearch"
    :custom-buttons="customButtonList"
  />

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.meun.card-organization-trans-query')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
  />
</template>

<script setup lang="ts">
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { type BaseI18nSelect, type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { computed, onMounted, ref } from 'vue'
import { findByCodeType } from '@/hooks/sysCode'
import { useTimeCalculations } from '@/utils/util'
import { useAppStoreHook } from '@/stores/app'
import { findAllIssuer } from '@/hooks/searchConditions'
const appStoreHook = useAppStoreHook()
const { getEndDate, getStartDate } = useTimeCalculations()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const issuerSeleteOptions = computed(() => [...optionSelect, ...issuerOptions.value])
const issuerOptions = ref<BaseSelect[]>([])
//CardScheme
const schemeOptions = ref<BaseI18nSelect[]>([])
//options setting
const cardSchemeOptions = computed(() => [...optionSelect, ...schemeOptions.value])
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
    type: 'select',
    label: 'ui.card-scheme.name',
    model: 'criteriaCardScheme',
    default: '',
    props: {
      // Use computed to switch language
      options: cardSchemeOptions,
      id: 'criteriaCardScheme'
    }
  }
])

// Define custom buttons
const customButtonList: CustomButton[] = [
  {
    label: 'btn.export', // export
    type: 'button',
    variant: 'primary',
    action: async () => {
      console.log('Exporting data...')
      const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
      apiUtil
        .downloadExcel('/cardOrganizationTrans/export', searchCriteria.value, {})
        .then(() => {
          console.log('Excel file downloaded successfully.')
        })
        .catch((error) => {
          console.error('Error downloading Excel:', error)
        })
    }
  }
]

// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  { header: 'ui.report.trans-status-data', field: 'data' },
  { header: 'ui.report.trans-status-transtotal', field: 'total' },
  { header: 'ui.report.frictionless', field: 'frictionless', joinCol: 'per0', joinStr: '---' },
  { header: 'ui.report.trans-status-Y', field: 'statusY', joinCol: 'per1', joinStr: '---' },
  { header: 'ui.report.trans-status-A', field: 'statusA', joinCol: 'per2', joinStr: '---' },
  { header: 'ui.report.trans-status-N', field: 'statusN', joinCol: 'per3', joinStr: '---' },
  { header: 'ui.report.trans-status-U', field: 'statusU', joinCol: 'per4', joinStr: '---' },
  { header: 'ui.report.trans-status-R', field: 'statusR', joinCol: 'per5', joinStr: '---' },
  { header: 'ui.report.trans-status-C', field: 'statusC', joinCol: 'per6', joinStr: '---' },
  { header: 'ui.report.trans-status-D', field: 'statusD', joinCol: 'per7', joinStr: '---' },
  { header: 'ui.report.trans-status-I', field: 'statusI', joinCol: 'per8', joinStr: '---' }
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
  const result = await apiUtil.postSearchPage('/cardOrganizationTrans/query', searchCriteria.value, page, {}, true)

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
  issuerOptions.value = await findAllIssuer()
  deleteQueryConfigData()
})
</script>

<style scoped>
/* Add your styles here */
</style>
