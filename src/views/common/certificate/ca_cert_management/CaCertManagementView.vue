<template>
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.ca-cert-certificate-management')"
    @search="handleSearch"
    :customButtons="customButtonList"
    :hide-btn="true"
  />

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.ca-cert-certificate-management')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :custom-buttons="tableCustomButtonList"
    :operation-btn-delete="true"
    @delete-row="deleteRow"
  />

  <FormComponent
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    @reset-form-btn="resetFormBtn"
    :form-data="formDetails"
  />

  <FormComponent
    ref="detailForm"
    :form-config="detailFormConfig"
    :title="formTitle"
    @go-back="detailGoBack"
    :form-data="formDetails"
  />
</template>

<script setup lang="ts">
import QueryCriteriaComponent, {
  type CriteriaField,
  type CustomButton
} from '@/components/query/QueryCriteriaComponent.vue'
import { computed, ref } from 'vue'
import { userStateStore } from '@/stores/user'
import { optionSelect } from '@/utils/select/baseSelect'
import { useAppStoreHook } from '@/stores/app'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { fileToBase64, readOnlyALLSet } from '@/utils/util'
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import swalMessage from '@/plugins/swalMessage'
import ApiUtil from '@/utils/apiUtils'
import { certEncodeOptionSelect } from '@/utils/select/caCertLoad'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userState = userStateStore()
const appStoreHook = useAppStoreHook()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const formMask = ref()
const detailForm = ref()
const formTitle = ref('')
const customButtonList: CustomButton[] = [
  {
    label: 'btn.upload',
    type: 'button',
    variant: 'primary',
    action: () => {
      if (formMask.value) {
        readOnlyALLSet(formConfig, false, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
        formTitle.value = 'UPLOAD'
        formMask.value.show()
      } else {
        console.error('FormComponent component is not ready yet')
      }
    }
  }
]
const tableCustomButtonList: TableCustomButton[] = [
  {
    label: 'btn.export',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      const param = {
        oid: row.oid
      }
      await apiUtil
        .downloadExcel(`/ca_cert_management/export`, param, {}, true)
        .then((result) => {
          if (result.success) {
            console.log('file downloaded successfully.', result)
          } else {
            swalMessage.error(result.message)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
]

/**
 * Delete function
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  swalMessage.confirm(t('ui.confirm.delete'), '', async function () {
    const result = await apiUtil.get(`/ca_cert_management/delete`, params, {}, true)
    if (result.success && result.code == '0000') {
      swalMessage.success(result.message)
    } else {
      swalMessage.error(result.message)
    }
    handleSearch(searchCriteria.value)
  })
}
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const handleSearch = async (criteria: any) => {
  if (criteria.notBefore) {
    // Complete time part, e.g. "2025-03-06" -> "2025-03-06T00:00:00Z"
    criteria.notBefore = new Date(criteria.notBefore).toISOString()
  }
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}
const formDetails = ref<Record<string, any>>({})
/**
 * Submit
 * @param formDate form
 */
const submit = async (formDate: any) => {
  console.log(formDate)
  formDate['fileContent'] = await fileToBase64(formDate['uploadFile'])
  //call add API
  const result = await apiUtil.post('/ca_cert_management/load', formDate, {}, true)
  if (result.success && result.code == '0000') {
    await swalMessage.success(result.message)
    goBack()
  } else {
    await swalMessage.error(result.message)
    return
  }
  await handleSearch(searchCriteria.value)
}
/**
 * Open popup function
 */
const openFrom = () => {
  if (detailForm.value) {
    detailForm.value.show()
  } else {
    console.error('FormComponent component is not ready yet')
  }
}
/**
 * Pagination query function
 * @param page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/ca_cert_management/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
/**
 * Close detail popup
 */
const detailGoBack = () => {
  //page date refresh
  if (detailForm.value) {
    detailForm.value.hide()
    formDetails.value = {}
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}
/**
 * Close popup
 */
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    if (formTitle.value === 'UPLOAD') {
      readOnlyALLSet(formConfig, true, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
    }
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}
const resetFormBtn = () => {}
const certEncodeOptions = computed(() => [...optionSelect, ...certEncodeOptionSelect])
/**
 * Open detail popup
 * @param formDate form data
 */
const openDetail = async (formDate: Record<string, any>) => {
  formTitle.value = 'DETAIL'
  // Define ID list to update
  readOnlyALLSet(formConfig, true, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
  await findById(formDate)
}
/**
 * Query detail function
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  // Fill data
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/caCertificate/detail', params, {}, true)
  if (result.success && result.code == '0000') {
    // Update formDetails value
    formDetails.value = result.data
  } else {
    await swalMessage.error(result.message)
    return
  }
  // Open window
  openFrom()
}

// header: table header; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.ca-cert-certificate.cert-alias',
    field: 'certAlias',
    action: (row: Record<string, any>) => openDetail(row)
  },
  { header: 'ui.ca-cert-certificate-subject-cn', field: 'subjectCn' },
  {
    header: 'ui.ca-cert-certificate-cert-issuer-cn',
    field: 'certIssuerCn'
  },
  {
    header: 'ui.issuer-cert.validity-period',
    field: 'validPeriod'
  }
])

const detailFormConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.ca-cert-certificate.cert-alias',
    model: 'certAlias',
    default: '',
    ID: 'certAlias',
    colNum: '12',
    readOnly: true,
    required: false,
    props: {}
  },
  {
    type: 'text',
    label: 'ui.ca-cert-certificate-cert-issuer',
    model: 'certIssuer',
    default: '',
    ID: 'certIssuer',
    colNum: '12',
    readOnly: true,
    required: false,
    props: {}
  },
  {
    type: 'text',
    label: 'ui.ca-cert-certificate-subject',
    model: 'subject',
    default: '',
    ID: 'subject',
    colNum: '12',
    readOnly: true,
    required: false,
    props: {}
  },
  {
    type: 'text',
    label: 'ui.ca-cert-certificate-serial-number',
    model: 'serialNumber',
    default: '',
    ID: 'serialNumber',
    colNum: '12',
    readOnly: true,
    required: false,
    props: {}
  },
  {
    type: 'text',
    label: 'ui.issuer-cert.validity-period',
    model: 'validPeriod',
    default: '',
    ID: 'validPeriod',
    colNum: '12',

    readOnly: true,
    required: false,
    props: {}
  }
])
const formConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.ca-cert-certificate.cert-alias',
    model: 'certAlias',
    default: '',
    ID: 'certAlias',
    readOnly: false,
    required: true,
    props: {}
  },
  {
    type: 'checkbox',
    label: 'ui.ca-cert-certificate-cert-encode',
    model: 'certEncode',
    default: '',
    ID: 'certEncode',
    readOnly: false,
    required: true,
    props: {
      options: certEncodeOptions
    }
  },
  {
    type: 'file',
    label: 'ui.ca-cert-certificate-cert-content',
    model: 'uploadFile',
    default: null,
    ID: 'uploadFile',
    readOnly: false,
    required: true,
    props: {}
  }
])
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'date',
    label: 'ui.issuer-cert.validity-period',
    model: 'notBefore',
    default: '',
    props: {
      id: 'notBefore'
    }
  }
])
</script>
