<template>
  <!-- Display search criteria -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.mcc-code')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.mcc-code')"
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
import { ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import ApiUtil from '@/utils/apiUtils'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { readOnlyALLSet, readOnlySet } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'

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
  const result = await apiUtil.postSearchPage('/mcc_code/query', searchCriteria.value, page, {}, true)

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
      readOnlySet(formConfig, ['mcc'], false)
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
    const result = await apiUtil.post('/mcc_code/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    //call edit API
    const result = await apiUtil.post('/mcc_code/edit', form.value, {}, true)
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
  readOnlySet(formConfig, ['mcc'], true)
  await findById(formDate)
}
/**
 * Delete
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/mcc_code/delete?oid=${formDate['oid']}`, {}, {}, true)
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
  const result = await apiUtil.get(`/mcc_code/detail`, params, {}, true)
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
    header: 'ui.mcc-code.mcc',
    field: 'mcc'
  },
  {
    header: 'ui.mcc-code.merchantType',
    field: 'merchantType'
  }
])

/**
 * Validate number
 * @param mcc Merchant Code
 */
const validateCountryCode = (code: string) => {
  const validate: Record<string, any> = {}
  const codePattern = /^\d{4}$/ // Strictly match 4 digits

  if (!code) {
    validate.result = false
    validate.message = 'warn.field-required' // Required field prompt
  } else if (codePattern.test(code)) {
    validate.result = true
  } else {
    validate.result = false
    validate.message = 'warn.mcc-code.4digit-num-only'
  }

  return validate
}

const formConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.mcc-code.mcc',
    model: 'mcc',
    default: '',
    ID: 'mcc',
    readOnly: false,
    required: true,
    maxlength: '4',
    placeholder: 'warn.mcc-code.4digit-num-only',
    props: {},
    validateAction(val: string) {
      return validateCountryCode(val)
    }
  },
  {
    type: 'text',
    label: 'ui.mcc-code.merchantType',
    model: 'merchantType',
    default: '',
    ID: 'merchantType',
    readOnly: false,
    required: true,
    maxlength: '50',
    props: {}
  }
])

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'text',
    label: 'ui.mcc-code.mcc', // label is defined directly on the field object
    model: 'criteriaMcc',
    default: '',
    maxlength: '4',
    props: {
      // Use computed to switch language
      id: 'mcc'
    }
  },
  {
    type: 'text',
    label: 'ui.mcc-code.merchantType',
    model: 'criteriaMerchantType',
    default: '',
    maxlength: '255',
    props: {
      // Use computed to switch language
      id: 'merchantType'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
