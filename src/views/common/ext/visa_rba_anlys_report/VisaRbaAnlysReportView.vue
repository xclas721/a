<template>
  <!-- Query criteria settings -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.meun.visa-score-anlys')"
    @search="handleSearch"
    :custom-buttons="customButtonList"
  />

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.meun.visa-score-anlys')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
    :pageHide="true"
  />
  <DataTable
    ref="tableRef"
    :title="$t('ui.meun.visa-score-anlys')"
    :columns="searchResultsHeader1"
    :fetchData="fetchUserData1"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
    :pageHide="true"
  />
  <DataTable
    ref="tableRef"
    :title="$t('ui.meun.visa-score-anlys')"
    :columns="searchResultsHeader2"
    :fetchData="fetchUserData2"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
    :pageHide="true"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useAppStoreHook } from '@/stores/app'
import { useTimeCalculations } from '@/utils/util'
import { findAllIssuer } from '@/hooks/searchConditions'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
const { getEndDate, getStartDate } = useTimeCalculations()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const appStoreHook = useAppStoreHook()
const issuerSeleteOptions = computed(() => [...optionSelect, ...issuerOptions.value])
const issuerOptions = ref<BaseSelect[]>([])
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
    props: {
      // Use computed to switch language
      id: 'endDate'
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
        .downloadExcel('/visaScoreAnlys/export', searchCriteria.value, {})
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
  { header: 'ui.visa.rba.report.total', field: 'total' },
  { header: 'ui.visa.rba.report.score.0', field: 'score0' },
  { header: 'ui.visa.rba.report.score.1', field: 'score1' },
  { header: 'ui.visa.rba.report.score.2', field: 'score2' },
  { header: 'ui.visa.rba.report.score.3', field: 'score3' },
  { header: 'ui.visa.rba.report.score.4', field: 'score4' },
  { header: 'ui.visa.rba.report.score.5', field: 'score5' },
  { header: 'ui.visa.rba.report.score.6', field: 'score6' },
  { header: 'ui.visa.rba.report.score.7', field: 'score7' },
  { header: 'ui.visa.rba.report.score.8', field: 'score8' },
  { header: 'ui.visa.rba.report.score.9', field: 'score9' }
])

const searchResultsHeader1 = ref<any>([
  { header: 'ui.visa.rba.report.total', field: 'total' },
  { header: 'ui.visa.rba.report.frictionless', field: 'total' },
  { header: 'ui.visa.rba.report.per', field: 'frictionlessPer' },
  { header: 'ui.visa.rba.report.score.0', field: 'score0' },
  { header: 'ui.visa.rba.report.score.1', field: 'score1' },
  { header: 'ui.visa.rba.report.score.2', field: 'score2' },
  { header: 'ui.visa.rba.report.score.3', field: 'score3' },
  { header: 'ui.visa.rba.report.score.4', field: 'score4' },
  { header: 'ui.visa.rba.report.score.5', field: 'score5' },
  { header: 'ui.visa.rba.report.score.6', field: 'score6' },
  { header: 'ui.visa.rba.report.score.7', field: 'score7' },
  { header: 'ui.visa.rba.report.score.8', field: 'score8' },
  { header: 'ui.visa.rba.report.score.9', field: 'score9' }
])

const searchResultsHeader2 = ref<any>([
  { header: 'ui.visa.rba.report.total', field: 'total' },
  { header: 'ui.visa.rba.report.fraud', field: 'fraud' },
  { header: 'ui.visa.rba.report.fraud.per', field: 'fraudPer' },
  { header: 'ui.visa.rba.report.score.0', field: 'score0' },
  { header: 'ui.visa.rba.report.score.1', field: 'score1' },
  { header: 'ui.visa.rba.report.score.2', field: 'score2' },
  { header: 'ui.visa.rba.report.score.3', field: 'score3' },
  { header: 'ui.visa.rba.report.score.4', field: 'score4' },
  { header: 'ui.visa.rba.report.score.5', field: 'score5' },
  { header: 'ui.visa.rba.report.score.6', field: 'score6' },
  { header: 'ui.visa.rba.report.score.7', field: 'score7' },
  { header: 'ui.visa.rba.report.score.8', field: 'score8' },
  { header: 'ui.visa.rba.report.score.9', field: 'score9' }
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
  const result = await apiUtil.postSearchPage('/visaScoreAnlys/query', searchCriteria.value, page, {}, true)

  if (!result.success) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.challengeResultVos,
    totalItems: result.data.totalElements
  }
}
const fetchUserData1 = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/visaScoreAnlys/query', searchCriteria.value, page, {}, true)

  if (!result.success) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.frictionlessResultVos,
    totalItems: result.data.totalElements
  }
}
const fetchUserData2 = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/visaScoreAnlys/query', searchCriteria.value, page, {}, true)

  if (!result.success) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.fraudResultVos,
    totalItems: result.data.totalElements
  }
}
</script>

<style scoped>
/* Add your styles here */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px 16px;
  border: 1px solid #ddd;
  text-align: left;
}
</style>
