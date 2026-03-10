<template>
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.issuer-group.opquery')"
    @search="handleSearch"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.issuer-group.opquery')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="true"
    :operation-btn-update="false"
    :operation-btn-delete="false"
    @open-detail="openDetail"
  />

  <IssuerGroupQueryFormView
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
import IssuerGroupQueryFormView from '@/views/common/privilege/issuer_group_query/IssuerGroupQueryFormView.vue'
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
  const result = await apiUtil.postSearchPage('/issuer_group/op_query', searchCriteria.value, page, {}, true)

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
  const result = await apiUtil.get('/issuer_group/op_detail', params, {}, true)
  if (result.success && result.code == '0000') {
    formDetails.value = result.data

    const permissionMap = result.data.permissionMap
    // Fill checkData
    checkData.value = Object.keys(permissionMap).reduce((acc: Record<string, any>, key: string) => {
      acc[key] = new Set(permissionMap[key])
      return acc
    }, {})

    menuData.value = []
    const menuResult = await apiUtil.post('/issuer/menu/getMenu', { issuerGroupOid: formDate['oid'] }, {}, true)
    menuData.value = menuResult.data
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
    header: 'ui.issuer-adm.issuer',
    field: 'issuerName'
  },
  {
    header: 'ui.issuer-group.id',
    field: 'groupId'
  },
  {
    header: 'ui.issuer-group.name',
    field: 'groupName'
  },
  {
    header: 'ui.issuer-group.description',
    field: 'description'
  }
])

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'text',
    label: 'ui.issuer-group.id',
    model: 'criteriaGroupId',
    default: '',
    props: {
      id: 'criteriaGroupId'
    }
  },
  {
    type: 'text',
    label: 'ui.issuer-group.name',
    model: 'criteriaGroupName',
    default: '',
    props: {
      id: 'criteriaGroupName'
    }
  }
])

const formConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.issuer-adm.issuer',
    model: 'issuerName',
    default: '',
    ID: 'issuerName',
    readOnly: false,
    required: false,
    maxlength: '20',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.issuer-group.id',
    model: 'groupId',
    default: '',
    ID: 'groupId',
    readOnly: false,
    required: false,
    maxlength: '20',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.issuer-group.name',
    model: 'groupName',
    default: '',
    ID: 'groupName',
    readOnly: false,
    required: false,
    maxlength: '100',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.issuer-group.description',
    model: 'description',
    default: '',
    ID: 'description',
    readOnly: false,
    required: false,
    maxlength: '100',
    props: {}
  }
])
</script>
