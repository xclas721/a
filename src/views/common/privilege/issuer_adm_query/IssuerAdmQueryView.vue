<template>
  <!-- Display search criteria -->
  <QueryCriteriaComponent :criteriaConfig="userQueryConfig" :title="$t('ui.issuer-adm-query')" @search="handleSearch" />

  <!-- Display search results -->
  <DataTable
    :title="$t('ui.issuer-adm-query')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
    ref="tableRef"
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
import { findAllIssuer } from '@/hooks/issuer'

const appStoreHook = useAppStoreHook()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()

// Reactivity needed to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
const issuerData = ref<BaseSelect[]>([]) // 发卡行数据
const issuerOptions = computed(() => [...optionSelect, ...issuerData.value])
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)

// Handle the search criteria emitted by the QueryCriteria component
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
  // Add default values to all conditions
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }

  const result = await apiUtil.postSearchPage('/issuer_adm/op_query', searchCriteria.value, page, {}, true)

  if (!result.success) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

onMounted(async () => {
  if (appStoreHook.organ == 'hosted') {
    issuerData.value = await findAllIssuer()
  }
  hideIssuerOidField()
})

/**
 * Query criteria data - hide issuer field and set default value
 */
const hideIssuerOidField = () => {
  if (appStoreHook.organ == 'issuer') {
    const field = userQueryConfig.value.find((f) => f.model === 'issuerOid')
    if (field) {
      field.default = userState.user.issuerOid // Fixed issuer
      field.hidden = true // UI hidden, but value participates in query
    }
  }
}

// Query table config; field: field name; colOptions: used for dropdown; joinCol: columns to join; joinStr: join string;
const searchResultsHeader = ref<any>([
  { header: 'ui.issuer-adm.issuer', field: 'issuerName' },
  { header: 'ui.issuer-adm.account', field: 'account' },
  { header: 'ui.issuer-adm.name', field: 'userName' },
  { header: 'ui.issuer-adm.department', field: 'department' },
  { header: 'ui.issuer-adm.tel', field: 'tel' },
  { header: 'ui.issuer-adm.ext', field: 'ext' },
  { header: 'ui.issuer-adm.email', field: 'email' },
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
    label: 'ui.issuer-adm.issuer',
    model: 'issuerOid',
    default: '',
    readOnly: appStoreHook.organ == 'issuer',
    props: {
      options: issuerOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'text',
    label: 'ui.issuer-adm.account',
    model: 'criteriaAccount',
    default: '',
    maxlength: '20',
    props: {
      id: 'criteriaAccount'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
