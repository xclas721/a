<template>
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.client-operation-log')"
    @search="handleSearch"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.client-operation-log')"
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
    :title="$t('ui.client-operation-log')"
  />
</template>
<script setup lang="ts">
import QueryCriteriaComponent, { type CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import { computed, onMounted, ref } from 'vue'
import { userStateStore } from '@/stores/user'
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import swalMessage from '@/plugins/swalMessage'
import ApiUtil from '@/utils/apiUtils'
import { type BaseI18nSelect, type BaseSelect, optionSelect, optionSelect1 } from '@/utils/select/baseSelect'
import { findMenu } from '@/hooks/menu'
import { actionOptionSelect, actionResultOptionSelect, functionOptionSelect } from '@/utils/select/operation'
import OperationLogDetail from '@/views/common/system/operation_log/OperationLogDetail.vue'

import { useAppStoreHook } from '@/stores/app'
import { findAllIssuer } from '@/hooks/issuer'
import { useTimeCalculations } from '@/utils/util'
const { getEndDate, getStartDate } = useTimeCalculations()
const appStoreHook = useAppStoreHook()
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
      const result = await apiUtil.get('/client_operation_log/detail', { oid: row.oid }, {}, true)
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

  const result = await apiUtil.postSearchPage('/client_operation_log/query', searchCriteria.value, page, {}, true)

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
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  menuData.value = await findMenu()
  deleteQueryConfigData()
})
const menuData = ref<BaseI18nSelect[]>([])
const issuerData = ref<BaseSelect[]>([])
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})
const menusOptions = computed(() => [...optionSelect, ...functionOptionSelect, ...menuData.value])
const searchResultsHeader = ref<any>([
  {
    header: 'ui.operation-log.date-time',
    field: 'operationDataTime'
  },
  {
    header: 'ui.issuer.name',
    field: 'dataIssuerOid',
    colOptions: computed(() => [...issuerData.value, ...optionSelect1])
  },
  {
    header: 'ui.cardholder-data.idno',
    field: 'lbIdNo'
  },
  {
    header: 'ui.card-data.pan',
    field: 'acctNumberPrefix',
    joinCol: 'acctNumberPostfix',
    joinStr: 'XXXXXX'
  },
  {
    header: 'ui.operation-log.function',
    field: 'accessId',
    colOptions: computed(() => [...menusOptions.value])
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
    // <!-- (4)Card Number -->
    type: 'text',
    label: 'ui.card-data.pan',
    model: 'lbAcctNumber',
    default: '',
    maxlength: '19',
    props: {
      id: 'lbAcctNumber'
    }
  },
  {
    // <!-- (5)ID Number -->
    type: 'text',
    label: 'ui.cardholder-data.idno',
    model: 'lbIdNo',
    default: '',
    maxlength: '64',
    props: {
      id: 'lbIdNo'
    }
  }
])
</script>
