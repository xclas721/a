<template>
  <!-- Display search criteria -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.sys-code.name')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.sys-code.name')"
    :columns="searchResultsHeader"
    :fetchData="fetchData"
    :operation-btn-detail="false"
    :operation-btn-update="true"
    :operation-btn-delete="true"
    @open-detail="openDetail"
    @open-update="openUpdate"
    @delete-row="deleteRow"
  />

  <FormComponent
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    :form-data="formDetails"
  >
  </FormComponent>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { readOnlyALLSet, readOnlySet } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { findDistinctCodeType } from '@/hooks/sysCode'

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

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })

const form = ref<any>({})
// Breadcrumb
const formTitle = ref('')
const formMask = ref() // Used to store reference to FormComponent
// Define custom buttons
const customButtonList: CustomButton[] = [
  {
    label: 'btn.new',
    type: 'button',
    variant: 'primary',
    action: () => {
      if (formMask.value) {
        formTitle.value = 'ADD'
        formMask.value.show()
      } else {
        console.error('FormComponent component is not ready yet')
      }
    }
  }
]
/**
 * Pagination query
 * @param page current page
 */
const fetchData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/sys_code/query', searchCriteria.value, page, {}, true)

  if (!result.success) {
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
    if (formTitle.value === 'DETAIL') {
      readOnlyALLSet(formConfig, false, ['issuerOid'])
    } else if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig, ['bankId'], false)
    }
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
    const result = await apiUtil.post('/sys_code/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    //call edit API
    const result = await apiUtil.post('/sys_code/edit', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
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
const formDetails = ref<Record<string, any>>({})
/**
 * Open detail popup
 * @param formDate form data
 */
const openDetail = async (formDate: Record<string, any>) => {
  formTitle.value = 'DETAIL'
  // Define ID list to update
  readOnlyALLSet(formConfig, true, ['issuerOid'])
  await findById(formDate)
}
/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  readOnlySet(formConfig, ['bankId'], true)
  await findById(formDate)
}
/**
 * Delete
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/sys_code/delete?oid=${formDate['oid']}`, {}, {}, true)
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
 * Detail info
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get(`/sys_code/detail`, params, {}, true)
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
// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.sys-code.codeDesc',
    field: 'codeDesc'
  },
  {
    header: 'ui.sys-code.codeId',
    field: 'codeId'
  },
  {
    header: 'ui.sys-code.codeOrder',
    field: 'codeOrder'
  },
  {
    header: 'ui.sys-code.codeType',
    field: 'codeType'
  },
  {
    header: 'ui.sys-code.codeTypeDesc',
    field: 'codeTypeDesc'
  },
  {
    header: 'ui.sys-code.i18nCode',
    field: 'i18nCode'
  }
])

function validateNumber(val: string) {
  const validate: Record<string, any> = {}

  // Check if integer
  if (/^-?\d+$/.test(val)) {
    validate['result'] = true
  } else {
    validate['result'] = false
    validate['message'] = 'javax.validation.constraints.Pattern.message.number'
  }

  return validate
}
const formConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.sys-code.codeDesc',
    model: 'codeDesc',
    default: '',
    ID: 'codeDesc',
    readOnly: false,
    required: true,
    maxlength: '50',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.sys-code.codeId',
    model: 'codeId',
    default: '',
    ID: 'codeId',
    readOnly: false,
    required: true,
    maxlength: '24',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.sys-code.codeType',
    model: 'codeType',
    default: '',
    ID: 'codeType',
    readOnly: false,
    required: true,
    maxlength: '40',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.sys-code.codeTypeDesc',
    model: 'codeTypeDesc',
    default: '',
    ID: 'codeTypeDesc',
    readOnly: false,
    required: true,
    maxlength: '50',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.sys-code.codeOrder',
    model: 'codeOrder',
    default: '',
    ID: 'codeOrder',
    readOnly: false,
    required: true,
    maxlength: '8',
    props: {},
    validateAction(val: string) {
      return validateNumber(val)
    }
  },
  {
    type: 'text',
    label: 'ui.sys-code.i18nCode',
    model: 'i18nCode',
    default: '',
    ID: 'i18nCode',
    readOnly: false,
    required: false,
    maxlength: '50',
    props: {}
  }
])
const codeTypeOption = ref<BaseSelect[]>([])
onMounted(async () => {
  codeTypeOption.value = await findDistinctCodeType()
})
const codeTypeOptions = computed(() => [...optionSelect, ...codeTypeOption.value])
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.sys-code.codeType', // label is defined directly on the field object
    model: 'codeType',
    default: '',
    props: {
      // Use computed to switch language
      id: 'codeType',
      options: codeTypeOptions
    }
  },
  {
    type: 'text',
    label: 'ui.sys-code.codeId',
    model: 'codeId',
    default: '',
    maxlength: '20',
    props: {
      // Use computed to switch language
      id: 'codeId'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
