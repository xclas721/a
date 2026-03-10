<template>
  <QueryCriteriaComponent :criteriaConfig="userQueryConfig" :title="$t('ui.reconfirm')" @search="handleSearch" />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.reconfirm')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
    :customButtons="customButtonList"
  />
  <ReconfirmDetail
    :detail-data="detailData"
    v-model="showDetail"
    :title="$t('ui.reconfirm')"
    :menu-config="menuData"
    @refresh="handleSearch"
    :search-criteria="searchCriteria"
  />
</template>
<script setup lang="ts">
import QueryCriteriaComponent, { type CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import { computed, onMounted, ref } from 'vue'
import { userStateStore } from '@/stores/user'
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import swalMessage from '@/plugins/swalMessage'
import ApiUtil from '@/utils/apiUtils'
import {
  type BaseI18nSelect,
  type BaseSelect,
  defaultOptionSelect,
  optionSelect,
  optionSelect1
} from '@/utils/select/baseSelect'
import { getReconfirmMenu } from '@/hooks/menu'
import ReconfirmDetail from '@/views/common/system/reconfirm/ReconfirmDetail.vue'
import { reconfirmActionOptionSelect, reconfirmStatusOptionSelect } from '@/utils/select/reconfirm'
import { findAllIssuer } from '@/hooks/issuer'
import { useAppStoreHook } from '@/stores/app'
import { useTimeCalculations } from '@/utils/util'
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const showDetail = ref(false)
const detailData = ref({})
const appStoreHook = useAppStoreHook()
const { getEndDate, getStartDate } = useTimeCalculations()
const customButtonList: TableCustomButton[] = [
  {
    label: 'btn.detail',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      //call API
      const result = await apiUtil.get('/reconfirm/detail', { oid: row.oid }, {}, true)
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

  const result = await apiUtil.postSearchPage('/reconfirm/query', searchCriteria.value, page, {}, true)

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
const issuerData = ref<BaseSelect[]>([])
onMounted(async () => {
  menuData.value = await getReconfirmMenu()
  issuerData.value = await findAllIssuer()
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
const menusOptions = computed(() => [...optionSelect, ...menuData.value])
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted'
    ? [...optionSelect, ...defaultOptionSelect, ...issuerData.value]
    : [...defaultOptionSelect, ...issuerData.value]
})
const actionOptions = computed(() => [...optionSelect, ...reconfirmStatusOptionSelect])
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
    label: 'ui.reconfirm.start-date',
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
    label: 'ui.reconfirm.end-date',
    model: 'criteriaEndDate',
    default: getEndDate,
    endDateFlag: true,
    props: {
      id: 'criteriaEndDate'
    }
  },
  {
    // <!-- (4)Function Name -->
    type: 'select',
    label: 'ui.reconfirm.function-name',
    model: 'criteriaAccessId',
    default: '',
    props: {
      options: menusOptions,
      id: 'criteriaAccessId'
    }
  },
  {
    // <!-- (5)Status -->
    type: 'select',
    label: 'ui.reconfirm.status',
    model: 'criteriaStatus',
    default: '',
    props: {
      options: actionOptions,
      id: 'criteriaStatus'
    }
  }
])
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerData.value, ...optionSelect1, ...defaultOptionSelect])
  },
  {
    header: 'ui.reconfirm.function-name',
    field: 'accessId',
    colOptions: computed(() => [...menusOptions.value])
  },
  {
    header: 'ui.reconfirm.action',
    field: 'action',
    colOptions: computed(() => [...reconfirmActionOptionSelect])
  },
  {
    header: 'ui.reconfirm.status',
    field: 'status',
    colOptions: computed(() => [...reconfirmStatusOptionSelect])
  },
  {
    header: 'ui.reconfirm.apply-user-name',
    field: 'applyUserName',
    joinStr: '(',
    joinCol: 'applyAccount',
    joinStrEnd: ')'
  },
  {
    header: 'ui.reconfirm.apply-datetime',
    field: 'applyDateTime'
  },
  {
    header: 'ui.reconfirm.confirm-user-name',
    field: 'confirmUserName',
    joinStr: '(',
    joinCol: 'confirmAccount',
    joinStrEnd: ')'
  },
  {
    header: 'ui.reconfirm.confirm-datetime',
    field: 'confirmDataDateTime'
  }
])
</script>
