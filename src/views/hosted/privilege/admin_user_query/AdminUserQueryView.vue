<template>
  <!-- Display search criteria -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.admin-user.management-query')"
    @search="handleSearch"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.admin-user.management-query')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useAppStoreHook } from '@/stores/app'
import { findAllPermissionGroup } from '@/hooks/permissionGroup'

const appStoreHook = useAppStoreHook()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
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

//groupOptions setting
const groupArrayData = ref<BaseSelect[]>([])
const groupOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...groupArrayData.value] : [...groupArrayData.value]
})

onMounted(async () => {
  //schemeOptions.value = await findByCodeType('CARD_SCHEME')
  groupArrayData.value = await findAllPermissionGroup()
})

// --------------------------------------------------------------------------

// header: table header; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.admin-user.account',
    field: 'account'
  },
  {
    header: 'ui.admin-user.user-name',
    field: 'userName'
  },
  {
    header: 'ui.admin-user.group',
    field: 'adminGroupName'
  },
  {
    header: 'ui.admin-user.department',
    field: 'department'
  },
  {
    header: 'ui.admin-user.tel',
    field: 'tel'
  },
  {
    header: 'ui.admin-user.ext',
    field: 'ext'
  },
  {
    header: 'ui.admin-user.email',
    field: 'email'
  },
  {
    header: 'ui.admin-user.status',
    field: 'status',
    colOptions: {
      0: { value: '0', i18nText: 'ui.admin-user.status.0' },
      1: { value: '1', i18nText: 'ui.admin-user.status.1' }
    }
  }
])

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.admin-user.group',
    model: 'criteriaAdminGroupOid',
    default: '',
    props: {
      options: groupOptions,
      id: 'criteriaAdminGroupOid'
    }
  },
  {
    type: 'text',
    label: 'ui.admin-user.account',
    model: 'criteriaAccount',
    default: '',
    maxlength: '20',
    props: {
      id: 'criteriaAccount'
    }
  }
])

const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/admin_user/op_query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    swalMessage.warning(result.message)
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
