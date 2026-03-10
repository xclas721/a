<template>
  <!-- Rba Transaction Risk Statistical Analysis & Report -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.report.rba-trans-risk')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />

  <!-- Display search results -->
  <RbaTransRiskQueryTable
    :title="$t('ui.report.rba-trans-risk')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
  />
</template>

<script setup lang="ts">
import QueryCriteriaComponent, {
  type CriteriaField,
  type CustomButton
} from '@/components/query/QueryCriteriaComponent.vue'
import { computed, onMounted, ref } from 'vue'
import { type BaseI18nSelect, type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { findAllIssuer } from '@/hooks/issuer'
import { findByCodeType } from '@/hooks/sysCode'
import { userStateStore } from '@/stores/user'
import { useAppStoreHook } from '@/stores/app'
import ApiUtil from '@/utils/apiUtils'
import swalMessage from '@/plugins/swalMessage'

import RbaTransRiskQueryTable from '@/views/common/risk/rba_trans_risk_query/RbaTransRiskQueryTable.vue'
import { useTimeCalculations } from '@/utils/util'
import type DataTable from '@/components/dataTable/DataTable.vue'

const { getEndDate, getStartDate } = useTimeCalculations()
const userState = userStateStore()
const appStoreHook = useAppStoreHook()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

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

const schemeOptions = ref<BaseI18nSelect[]>([])
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})
const customButtonList: CustomButton[] = [
  {
    label: 'btn.export', // export
    type: 'button',
    variant: 'primary',
    action: () => {
      console.log('Exporting data...')
      apiUtil
        .downloadExcel('/RBATransRiskReport/export', searchCriteria.value)
        .then(() => {
          console.log('Excel file downloaded successfully.')
        })
        .catch((error) => {
          console.error('Error downloading Excel:', error)
        })
    }
  }
]

/**
 * Pagination query function
 * @param page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/RBATransRiskReport/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerOptions.value])
  },
  {
    header: 'ui.report.rba-trans-risk-data',
    dateFormat: 'yyyy-MM-dd'
  },
  {
    header: 'ui.report.rba-trans-risk-transtotal'
  },
  { header: 'ui.report.rba-trans-risk-lowrisk' },
  { header: 'ui.report.error-detail-ratio' },
  { header: 'ui.report.rba-trans-risk-mediumrisk' },
  { header: 'ui.report.error-detail-ratio' },
  { header: 'ui.report.rba-trans-risk-highrisk' },
  { header: 'ui.report.error-detail-ratio' }
])
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
    // <!-- (2)Transaction start date -->
    type: 'date',
    label: 'ui.trans.log.start.date',
    model: 'startDate',
    default: getStartDate,
    startDateFlag: true,
    props: {
      id: 'startDate'
    }
  },
  {
    // <!-- (3)Transaction end date -->
    type: 'date',
    label: 'ui.trans.log.end.date',
    model: 'endDate',
    default: getEndDate,
    endDateFlag: true,
    props: {
      id: 'endDate'
    }
  }
])
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
const issuerData = ref<BaseSelect[]>([])
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
  deleteQueryConfigData()
})
</script>
