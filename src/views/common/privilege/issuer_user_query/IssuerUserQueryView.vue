<template>
  <!-- Display search criteria -->
  <QueryCriteriaComponent
    :criteriaConfig="searchQueryConfig"
    :title="$t('ui.issuer-user.opquery')"
    @search="handleSearch"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.issuer-user.opquery')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { type BaseSelect, optionSelect, optionSelect1 } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import { findAllIssuer } from '@/hooks/issuer'
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

//issuerOptions setting
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return [...optionSelect, ...issuerData.value]
})
const issuerData = ref<BaseSelect[]>([])

//groupOptions setting
const groupOptions = computed(() => {
  // Whether to add optionSelect
  return [...optionSelect, ...groupArrayData.value]
})
const groupArrayData = ref<BaseSelect[]>([])

onMounted(async () => {
  //schemeOptions.value = await findByCodeType('CARD_SCHEME')
  issuerData.value = await findAllIssuer()
  groupArrayData.value = await findAllPermissionGroup(userState.user.issuerOid)
})

// header: table header; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerData.value, ...optionSelect1])
  },
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
    field: 'issuerGroupName'
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

const fetchUserData = async (page: number) => {
  for (const field of searchQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/issuer_user/op_query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

const searchQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.admin-user.group',
    model: 'criteriaIssuerGroupOid',
    default: '',
    props: {
      options: groupOptions,
      id: 'criteriaIssuerGroupOid'
    }
  },
  {
    type: 'text',
    label: 'ui.admin-user.account',
    model: 'criteriaIssuerUserAccount',
    default: '',
    props: {
      id: 'criteriaIssuerUserAccount'
    }
  }
])

// Watch current user hosted/issuer, dynamically update search conditions
const isHosted = ref(appStoreHook.organ == 'hosted')
watch(isHosted, (newValue) => {
  if (newValue) {
    // If issuerOid should be included but currently is not, add it
    if (!searchQueryConfig.value.some((item) => item.model === 'issuerOid')) {
      searchQueryConfig.value.unshift({
        type: 'select',
        label: 'ui.issuer-adm.issuer',
        model: 'issuerOid',
        default: '',
        props: {
          options: issuerOptions,
          id: 'issuerOid'
        }
      })
    }
  } else {
    // If issuerOid should not be included but currently is, remove it
    searchQueryConfig.value = searchQueryConfig.value.filter((item) => item.model !== 'issuerOid')
  }
})
</script>

<style scoped>
/* Add your styles here */
</style>
