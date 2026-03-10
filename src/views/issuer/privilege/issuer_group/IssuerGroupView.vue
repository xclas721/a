<template>
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.issuer-group.management')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.issuer-group.management')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="true"
    :operation-btn-update="true"
    :operation-btn-delete="true"
    @open-detail="openDetail"
    @open-update="openUpdate"
    @delete-row="deleteRow"
  />

  <IssuerGroupFormView
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    :form-data="formDetails"
    :menu-data="menuData"
    :check-data="checkData"
  />
</template>
<script setup lang="ts">
import QueryCriteriaComponent, {
  type CriteriaField,
  type CustomButton
} from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { readOnlyALLSet, readOnlySet } from '@/utils/util'
import IssuerGroupFormView from '@/views/issuer/privilege/issuer_group/IssuerGroupFormView.vue'
import { type FormField } from '@/components/formTable/FormComponent.vue'

const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const form = ref<any>({})
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

const customButtonList: CustomButton[] = [
  {
    label: 'btn.new',
    type: 'button',
    variant: 'primary',
    action: () => {
      checkData.value = {}
      deleteFormConfigData()
      openFrom()
      formTitle.value = 'ADD'
    }
  }
]
/**
 * Pagination query function
 * @param page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/issuer_group/query', searchCriteria.value, page, {}, true)

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
  addFormConfigData()
  readOnlyALLSet(formConfig, true, [])
  await findById(formDate)
}
/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  addFormConfigData()
  readOnlySet(formConfig, ['groupId', 'issuerName'], true)
  await findById(formDate)
}
/**
 * Delete function
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/issuer_group/delete?oid=${formDate['oid']}`, {}, {}, true)
      .then((result) => {
        if (result.success && result.code == '0000') {
          swalMessage.success(result.message)
        } else {
          swalMessage.error(result.message)
        }
      })
      .catch((error) => {
        swalMessage.error(error)
      })
      .finally(() => {
        // Finally update table
        handleSearch(searchCriteria.value)
      })
  })
}
/**
 * Query detail function
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/issuer_group/detail', params, {}, true)
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
/**
 * Submit
 * @param formDate form data
 */
const submit = (formData: any, callback: (isSuccess: boolean) => void) => {
  // Add field to form data, and assign current login issuerOid
  formData.issuerOid = userState.user.issuerOid
  const submitAction = async () => {
    try {
      let result
      form.value = { ...formData }

      if (formTitle.value == 'ADD') {
        result = await apiUtil.post('/issuer_group/add', form.value, {}, true)
      } else if (formTitle.value == 'UPDATE') {
        result = await apiUtil.post('/issuer_group/edit', form.value, {}, true)
      }

      if (result?.success && result.code == '0000') {
        await swalMessage.success(result.message)
        callback(true)
        goBack()
        await handleSearch(searchCriteria.value)
      } else {
        callback(false)
        await swalMessage.error(result?.message || '操作失败')
      }
    } catch (error) {
      callback(false)
      // Safely handle unknown type error
      if (error instanceof Error) {
        await swalMessage.error(error.message)
      } else {
        await swalMessage.error('发生未知错误')
      }
    }
  }

  submitAction()
}

/**
 * Popup form data - Add issuerName
 */
const addFormConfigData = () => {
  const isExist = formConfig.value.some((field) => field.ID === 'issuerName')
  if (!isExist) {
    formConfig.value.unshift({
      type: 'text',
      label: 'ui.issuer-adm.issuer',
      model: 'issuerName',
      default: '',
      ID: 'issuerName',
      readOnly: false,
      required: true,
      maxlength: '20',
      props: {}
    })
  }
}

/**
 * Popup form data - Delete issuerName
 */
const deleteFormConfigData = () => {
  const isExist = formConfig.value.some((field) => field.ID === 'issuerName')
  if (isExist) {
    formConfig.value = formConfig.value.filter((field) => field.ID !== 'issuerName')
  }
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
    required: true,
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
    required: true,
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
    required: true,
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
    required: true,
    maxlength: '100',
    props: {}
  }
])
</script>
