<template>
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.admin-group.opquery')"
    @search="handleSearch"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.admin-group.opquery')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="true"
    :operation-btn-update="false"
    :operation-btn-delete="false"
    @open-detail="openDetail"
  />

  <AdminGroupQueryFormView
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @go-back="goBack"
    :form-data="formDetails"
    :menu-data="menuData"
    :check-data="checkData"
  />
</template>
<script setup lang="ts">
import QueryCriteriaComponent, { type CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { onMounted, ref } from 'vue'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { readOnlyALLSet, readOnlySet } from '@/utils/util'
import AdminGroupQueryFormView from '@/views/hosted/privilege/admin_group_query/AdminGroupQueryFormView.vue'
import { type FormField } from '@/components/formTable/FormComponent.vue'

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const formTitle = ref('')
const formMask = ref() // Used to store reference to FormComponent
const formDetails = ref<Record<string, any>>({})
const checkData = ref<Record<string, any>>({})
const menuData = ref<Record<string, any>[]>([])
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })

/**
 * Pagination query function
 * @param page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/admin_group/op_query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

/**
 * Open popup function
 */
const openFrom = async () => {
  menuData.value = []
  const result = await apiUtil.post('/menu/getMenuChoosePrivilege', {}, {}, true)
  menuData.value = result.data
  if (formMask.value) {
    formMask.value.show()
  } else {
    console.error('FormComponent component is not ready yet')
  }
}
/**
 * Open detail popup
 * @param formDate form data
 */
const openDetail = async (formDate: Record<string, any>) => {
  formTitle.value = 'DETAIL'
  readOnlyALLSet(formConfig, true, [])
  await findById(formDate)
}

/**
 * Query detail function
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/admin_group/op_detail', params, {}, true)
  if (result.success && result.code == '0000') {
    formDetails.value = result.data

    const permissionMap = result.data.permissionMap
    // Fill checkData
    checkData.value = Object.keys(permissionMap).reduce((acc: Record<string, any>, key: string) => {
      acc[key] = new Set(permissionMap[key])
      return acc
    }, {})

    // Open window
    await openFrom()
  } else {
    await swalMessage.error(result.message)
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
    if (formTitle.value === 'DETAIL') {
      readOnlyALLSet(formConfig, false, [])
    } else if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig, ['groupId'], false)
    }
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}

onMounted(async () => {})
// header: table header; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.admin-group.id',
    field: 'groupId'
  },
  {
    header: 'ui.admin-group.name',
    field: 'groupName'
  },
  {
    header: 'ui.admin-group.description',
    field: 'description'
  }
])

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'text',
    label: 'ui.admin-group.id',
    model: 'criteriaGroupId',
    default: '',
    maxlength: '20',
    props: {
      id: 'criteriaGroupId'
    }
  },
  {
    type: 'text',
    label: 'ui.admin-group.name',
    model: 'criteriaGroupName',
    default: '',
    maxlength: '100',
    props: {
      id: 'criteriaGroupName'
    }
  }
])

const formConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.admin-group.id',
    model: 'groupId',
    default: '',
    ID: 'groupId',
    readOnly: false,
    required: true,
    maxlength: '20',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.admin-group.name',
    model: 'groupName',
    default: '',
    ID: 'groupName',
    readOnly: false,
    required: true,
    maxlength: '100',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.admin-group.description',
    model: 'description',
    default: '',
    ID: 'description',
    readOnly: false,
    required: true,
    maxlength: '100',
    props: {}
  }
])
</script>
