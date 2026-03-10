<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.issuer-user-reconfirm-privilege')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.issuer-user-reconfirm-privilege')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="true"
    :operation-btn-update="true"
    :operation-btn-delete="false"
    @open-detail="openDetail"
    @open-update="openUpdate"
    :btn-show="hideBtn"
  />

  <UserReconfirmPrivilegeFormView
    ref="formMask"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    :form-data="formDetails"
    :group-array-data="issuerGroupData"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import UserReconfirmPrivilegeFormView from '@/views/hosted/privilege/user_reconfirm_privilege/UserReconfirmPrivilegeFormView.vue'
import { findAllPermissionGroup } from '@/hooks/permissionGroup'

const { t } = useI18n()
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

//CardScheme
const issuerGroupData = ref<BaseSelect[]>([])

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
//options setting
const issuerGroupOptions = computed(() => [...optionSelect, ...issuerGroupData.value])
const form = ref<any>({})
// Breadcrumb
const formTitle = ref('')
const formMask = ref() // Used to store reference to FormComponent
// Define custom buttons
const customButtonList: CustomButton[] = []
/**
 * Pagination query
 * @param page current page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage(
    '/hosted/user_reconfirm_privilege/query',
    searchCriteria.value,
    page,
    {},
    true
  )

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
/**
 * Open form
 */
const openFrom = () => {
  if (formMask.value) {
    formMask.value.show()
  } else {
    console.error('FormComponent component is not ready yet')
  }
}

/**
 * Close form
 */
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}

/**
 * Add, Modify Submit Function
 * @param formDate form data
 */
const submit = async (formDate: any) => {
  form.value = { ...formDate }
  if (formTitle.value == 'ADD') {
    //call add API
    const result = await apiUtil.post('/hosted/user_reconfirm_privilege/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(t('ui.message.add.success'))
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    //call edit API
    const result = await apiUtil.post('/hosted/user_reconfirm_privilege/edit', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(t('ui.successfully.modified'))
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  }
  // Finally update table
  await handleSearch(searchCriteria.value)
}
// Form detail data
const formDetails = ref<Record<string, any>>({
  modules: [],
  functions: [],
  accessIdsQuery: [],
  accessIdsConfirm: [],
  accessIdsConfirmBySelf: []
})
/**
 * Open detail popup
 * @param formDate form data
 */
const openDetail = async (formDate: Record<string, any>) => {
  formTitle.value = 'DETAIL'
  await findById(formDate)
}
/**
 * Hide button
 * @param row current row
 */
const hideBtn = (row: Record<string, any>) => {
  return row.userType == 1
}
/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  await findById(formDate)
}

/**
 * Detail info
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/hosted/user_reconfirm_privilege/detail', params, {}, true)
  if (result.success && result.code == '0000') {
    // Update formDetails value
    formDetails.value = {
      ...result.data
    }
  } else {
    await swalMessage.error(result.message)
    return
  }
  // Open window
  openFrom()
}

// Initialization trigger function
onMounted(async () => {
  issuerGroupData.value = await findAllPermissionGroup()
})

// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
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
    field: 'adminGroupOid',
    colOptions: computed(() => [...issuerGroupData.value])
  },
  { header: 'ui.admin-user.department', field: 'department' },
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

// Search condition configuration
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.admin-user.group',
    model: 'criteriaAdminGroupOid',
    default: '',
    props: {
      options: issuerGroupOptions,
      id: 'criteriaAdminGroupOid'
    }
  },
  {
    type: 'text',
    label: 'ui.admin-user.account',
    model: 'criteriaAccount',
    default: '',
    props: {
      id: 'criteriaAccount'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
