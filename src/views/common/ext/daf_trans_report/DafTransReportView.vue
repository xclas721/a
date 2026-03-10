<template>
  <!-- Query criteria settings -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.meun.daf-trans-status-query')"
    @search="handleSearch"
    :custom-buttons="customButtonList"
  />

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.meun.daf-trans-status-query')"
    :columns="searchResultsHeader"
    :columns0="searchResultsHeader0"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
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
import { useTimeCalculations } from '@/utils/util'
import { useAppStoreHook } from '@/stores/app'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { findAllIssuer } from '@/hooks/searchConditions'
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
        .downloadExcel('/transStatusStats/export', searchCriteria.value, {})
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
  {
    header: 'ui.daf.trans.status.th.date',
    field: 'date'
  },
  {
    header: 'ui.daf.trans.status.th.total',
    field: 'total'
  },
  {
    header: 'ui.daf.trans.status.th.transy',
    field: 'transY'
  },
  {
    header: 'ui.daf.trans.status.th.transn',
    field: 'transN'
  },
  {
    header: 'ui.daf.trans.status.th.transr',
    field: 'transR'
  },
  {
    header: 'ui.daf.trans.status.th.transu',
    field: 'transU'
  },
  {
    header: 'ui.daf.trans.status.th.transi',
    field: 'transI'
  },
  {
    header: 'ui.daf.trans.status.th.total',
    field: 'totalDaf'
  },
  {
    header: 'ui.daf.trans.status.th.transy',
    field: 'dafTransY'
  },
  {
    header: 'ui.daf.trans.status.th.transn',
    field: 'dafTransN'
  }
])

const searchResultsHeader0 = ref<any>([
  {
    // header: 'ui.daf.trans.status.th.date',
    header: '',
    colspan: '1'
  },
  {
    header: 'ui.daf.trans.status.th.visa',
    colspan: '6'
  },
  {
    header: 'ui.daf.trans.status.th.visa.daf',
    colspan: '3'
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
  const result = await apiUtil.postSearchPage('/transStatusStats/query', searchCriteria.value, page, {}, true)

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
