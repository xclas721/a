<template>
  <QueryCriteriaComponent :criteriaConfig="userQueryConfig" :title="$t('ui.operation-log')" @search="handleSearch" />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.operation-log')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
    :customButtons="customButtonList"
  />
  <OperationLogDetail
    :detail-data="detailData"
    v-model="showDetail"
    :menu-config="menuData"
    :title="$t('ui.operation-log')"
  />
</template>
<script setup lang="ts">
import QueryCriteriaComponent, { type CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import { computed, onMounted, ref } from 'vue'
import { userStateStore } from '@/stores/user'
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import swalMessage from '@/plugins/swalMessage'
import ApiUtil from '@/utils/apiUtils'
import { type BaseI18nSelect, type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { findMenu } from '@/hooks/menu'
import { actionOptionSelect, actionResultOptionSelect, functionOptionSelect } from '@/utils/select/operation'
import OperationLogDetail from '@/views/common/system/operation_log/OperationLogDetail.vue'
import { useTimeCalculations } from '@/utils/util'
import { findAllIssuer } from '@/hooks/searchConditions'
const { getEndDate, getStartDate } = useTimeCalculations()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const showDetail = ref(false)
const detailData = ref<Record<string, any>>({})
const customButtonList: TableCustomButton[] = [
  {
    label: 'btn.difference',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      //call API
      const result = await apiUtil.get('/operationLog/detail', { oid: row.oid }, {}, true)
      if (result.success && result.code == '0000') {
        detailData.value = result.data
      } else {
        await swalMessage.error(result.message)
        return
      }
      showDetail.value = true
    }
  }
]

const userState = userStateStore()
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }

  const result = await apiUtil.postSearchPage('/operation_log/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

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

const menuData = ref<BaseI18nSelect[]>([])
onMounted(async () => {
  menuData.value = await findMenu()
  issuerOptions.value = await findAllIssuer()
})
const issuerOptions = ref<BaseSelect[]>([])
const issuerSeleteOptions = computed(() => [...optionSelect, ...issuerOptions.value])
const menusOptions = computed(() => [...optionSelect, ...functionOptionSelect, ...menuData.value])
const actionOptions = computed(() => [...optionSelect, ...actionOptionSelect])
const resultOptions = computed(() => [...optionSelect, ...actionResultOptionSelect])
const searchResultsHeader = ref<any>([
  {
    header: 'ui.operation-log.date-time',
    field: 'operationDataTime'
  },
  {
    header: 'ui.operation-log.account',
    field: 'account',
    joinStr: '(',
    joinCol: 'userName',
    joinStrEnd: ')'
  },
  {
    header: 'ui.operation-log.function',
    field: 'accessId',
    colOptions: computed(() => [...menusOptions.value])
  },
  {
    header: 'ui.operation-log.source',
    field: 'ipAddr'
  },
  {
    header: 'ui.operation-log.action',
    field: 'action',
    colOptions: computed(() => [...actionOptionSelect])
  },
  {
    header: 'ui.operation-log.result',
    field: 'result',
    colOptions: computed(() => [...actionResultOptionSelect])
  }
])
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer-adm.issuer',
    model: 'issuerOid',
    default: '',
    props: {
      options: issuerSeleteOptions,
      id: 'issuerOid'
    }
  },
  {
    // <!-- (2)Operation start date -->
    type: 'date',
    label: 'ui.operation-log.op-start-date',
    model: 'criteriaStartDate',
    default: getStartDate,
    startDateFlag: true,
    props: {
      id: 'criteriaStartDate'
    }
  },
  {
    // <!-- (3)Operation end date -->
    type: 'date',
    label: 'ui.operation-log.op-end-date',
    model: 'criteriaEndDate',
    default: getEndDate,
    endDateFlag: true,
    props: {
      id: 'criteriaEndDate'
    }
  },
  {
    // <!-- (4)Operator -->
    type: 'text',
    label: 'ui.operation-log.account',
    model: 'criteriaAccount',
    default: '',
    props: {
      id: 'endDate'
    }
  },
  {
    // <!-- (5)Function Name -->
    type: 'select',
    label: 'ui.operation-log.function',
    model: 'criteriaAccessId',
    default: '',
    props: {
      options: menusOptions,
      id: 'criteriaAccessId'
    }
  },
  {
    // <!-- (6)Action -->
    type: 'select',
    label: 'ui.operation-log.action',
    model: 'criteriaAction',
    default: '',
    props: {
      options: actionOptions,
      id: 'criteriaAction'
    }
  },
  {
    // <!-- (6)Execution Result -->
    type: 'select',
    label: 'ui.operation-log.result',
    model: 'criteriaResult',
    default: '',
    props: {
      options: resultOptions,
      id: 'criteriaResult'
    }
  }
])
</script>
