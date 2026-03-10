<template>
  <!-- Query criteria settings -->
  <QueryCriteriaComponent :criteriaConfig="userQueryConfig" :title="$t('ui.issuer-find')" @search="handleSearch" />

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.issuer-find')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'

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

/**
 * Pagination query
 * @param page current page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/issuer/op_query', searchCriteria.value, page, {}, true)

  if (!result.success) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.bank-id',
    field: 'bankId'
  },
  { header: 'ui.issuer.issuer-name', field: 'issuerName' },
  {
    header: 'ui.issuer.description',
    field: 'description'
  }
])

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'text',
    label: 'ui.issuer.bank-id', // label is defined directly on the field object
    model: 'criteriaBankId',
    default: '',
    maxlength: '20',
    props: {
      // Use computed to switch language
      id: 'criteriaBankId'
    }
  },
  {
    type: 'text',
    label: 'ui.issuer.issuer-name',
    model: 'criteriaIssuerName',
    default: '',
    maxlength: '50',
    props: {
      // Use computed to switch language
      id: 'criteriaIssuerName'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
