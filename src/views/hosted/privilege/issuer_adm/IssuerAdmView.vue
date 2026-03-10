<template>
  <!-- Display search criteria -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.issuer-adm')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.issuer-adm')"
    :columns="searchResultsHeader"
    :fetchData="fetchData"
    :operation-btn-detail="false"
    :operation-btn-update="true"
    :operation-btn-delete="true"
    :custom-buttons="tableCustomButtons"
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

  <!-- FIDO User Status Query Popup -->
  <FidoUserStatusModal
    v-if="showFidoModal"
    :userId="selectedUser.account"
    :userName="selectedUser.userName"
    :issuerId="selectedUser.issuerId"
    @close="closeFidoModal"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { createPd, encryptPd, handlePwd, hideALLSet, readOnlySet, requiredSet } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/stores/app'
import { validatePassword } from '@/utils/passwordValidation'
import { findAllIssuer } from '@/hooks/issuer'
import zxcvbn from 'zxcvbn'
import { mfaBindingOptionSelect } from '@/utils/select/MFABinding'
import { validateNumber } from '@/utils/validateUtil'
import FidoUserStatusModal from '@/components/fido/FidoUserStatusModal.vue'

const appStoreHook = useAppStoreHook()
const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
// FIDO popup related variables
const showFidoModal = ref(false)
const selectedUser = ref<Record<string, any>>({})
const isFidoMode = ref(false)
// Issuer OID to ID mapping table
const issuerOidToIdMap = ref<Record<string, string>>({})
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

// Reactive to refresh table
//let searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
const searchCriteria = ref<any>({})
const form = ref<any>({})
const formTitle = ref('') // Breadcrumb
const formMask = ref() // Used to store reference to FormComponent
const pdParam = ref<Record<string, any>>({})
const formDetails = ref<Record<string, any>>({}) // 表单明细数据
const issuerData = ref<BaseSelect[]>([]) //发卡行数据
const mfaBindingOptions = computed(() => [...mfaBindingOptionSelect])
// Define custom buttons
const customButtonList: CustomButton[] = [
  {
    label: 'btn.new',
    type: 'button',
    variant: 'primary',
    action: () => {
      if (formMask.value) {
        formTitle.value = 'ADD'
        hideALLSet(formConfig, true, ['mfaBinding', 'mfaBindingBtn'])
        requiredSet(formConfig, ['pdField', 'cnfrPdfield'], true)
        openFrom()
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
  const result = await apiUtil.postSearchPage('/issuer_adm/query', searchCriteria.value, page, {}, true)

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
const openFrom = async () => {
  if (formMask.value) {
    formMask.value.show()
    pdParam.value = {} // Clear password policy parameters
  } else {
    console.error('FormComponent component is not ready yet')
  }
}
/**
 * Get password policy parameters
 */
const fetchPdPolicy = async (issuerOid: string) => {
  const result = await apiUtil.get('/condition/pdPolicyParam', { issuerOid, organ: 'issuer' }, {}, true)
  pdParam.value = result.data
}

/**
 * Close form
 */
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig, ['issuerOid', 'account'], false)
    }
    hideALLSet(formConfig, false, ['mfaBinding', 'mfaBindingBtn'])
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
  // 🚨 Password mismatch validation (only check when password field is not empty)
  if (form.value['pdField'] || form.value['cnfrPdfield']) {
    if (form.value['pdField'] !== form.value['cnfrPdfield']) {
      await swalMessage.error(t('warn.issuer-adm.password-cnfr-password-not-same'))
      return
    }
  }

  // Password cannot be related to account
  if (form.value['pdField'] == form.value['account']) {
    await swalMessage.error(t('warn.change-password.contain-account'))
    return
  }
  if (form.value['pdField']) {
    // Password policy validation
    const passwordValidation = await validatePassword(form.value['pdField'], pdParam.value, t)
    if (!passwordValidation.isValid) {
      await swalMessage.error(passwordValidation.message)
      return
    }
  }

  // Only encrypt and pass when password is not empty, otherwise set to null (key modification)
  if (form.value['pdField']) {
    form.value['encryptPdfield'] = encryptPd(form.value['account'], form.value['pdField'], pdParam.value.hashAlgorithm)
    form.value['pdField'] = handlePwd('0', form.value['pdField'])
    form.value['cnfrPdfield'] = handlePwd('0', form.value['cnfrPdfield'])
  } else {
    form.value['pdField'] = null // Explicitly pass null
    form.value['cnfrPdfield'] = null
    form.value['encryptPdfield'] = null
  }

  // The following logic remains unchanged
  if (formTitle.value == 'ADD') {
    const result = await apiUtil.post('/issuer_adm/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    const result = await apiUtil.post('/issuer_adm/edit', form.value, {}, true)
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

/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  readOnlySet(formConfig, ['issuerOid', 'account'], true)
  requiredSet(formConfig, ['pdField', 'cnfrPdfield'], false)
  await findById(formDate)
}
/**
 * Delete
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/issuer_adm/delete?oid=${formDate['oid']}`, {}, {}, true)
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
  const result = await apiUtil.get(`/issuer_adm/detail`, params, {}, true)
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

/**
 * Generate password
 */
const createPwd = () => {
  const contentRules = pdParam.value.pdContentRule
  if (pdParam.value.pdMinLength && pdParam.value.pdMaxLength && contentRules) {
    const min = Number.parseInt(pdParam.value.pdMinLength)
    const max = Number.parseInt(pdParam.value.pdMaxLength)
    let pd = createPd(min, max, contentRules)
    if (pdParam.value.pdRestrict == '1') {
      while (zxcvbn(pd).score < pdParam.value.threshold) {
        pd = createPd(min, max, contentRules)
      }
    }
    return pd
  }
  return ''
}

/**
 * Validate email
 * @param email email
 */
const validateEmail = (email: string) => {
  const validate: Record<string, any> = {}
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (emailPattern.test(email)) {
    validate['result'] = true
  } else {
    validate['result'] = false
    validate['message'] = 'warn.invalid-email'
  }
  return validate
}

/**
 * Open FIDO Status Query Popup
 * @param row selected row data
 */
const openFidoModal = (row: Record<string, any>) => {
  const issuerId = issuerOidToIdMap.value[row.issuerOid] || ''
  selectedUser.value = {
    ...row,
    issuerId: issuerId
  }
  showFidoModal.value = true
}

/**
 * Close FIDO Status Query Popup
 */
const closeFidoModal = () => {
  showFidoModal.value = false
  selectedUser.value = {}
}

// Issuer Dropdown
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})

onMounted(async () => {
  issuerData.value = await findAllIssuer()

  // Get complete data from API directly to build mapping table
  const result = await apiUtil.get('/condition/queryIssuer', {}, {}, true)
  for (const group of result.data) {
    issuerOidToIdMap.value[group.oid] = group.bankId
  }

  // Check if FIDO mode
  isFidoMode.value = import.meta.env.MODE === 'fido'
})

// --------------------------------------------------------------

// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer-adm.issuer',
    field: 'issuerName'
  },
  {
    header: 'ui.issuer-adm.account',
    field: 'account'
  },
  {
    header: 'ui.issuer-adm.name',
    field: 'userName'
  },
  {
    header: 'ui.issuer-adm.department',
    field: 'department'
  },
  {
    header: 'ui.issuer-adm.tel',
    field: 'tel'
  },
  {
    header: 'ui.issuer-adm.ext',
    field: 'ext'
  },
  {
    header: 'ui.issuer-adm.email',
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

const formConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.issuer-adm.issuer',
    model: 'issuerOid',
    default: '',
    ID: 'issuerOid',
    readOnly: false,
    required: true,
    maxlength: '20',
    props: {
      options: issuerOptions
    },
    changeAction: async (val: string) => {
      await fetchPdPolicy(val)
    }
  },
  {
    type: 'text',
    label: 'ui.issuer-adm.account',
    model: 'account',
    default: '',
    ID: 'account',
    readOnly: false,
    required: true,
    maxlength: '20',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.issuer-adm.user-name',
    model: 'userName',
    default: '',
    ID: 'userName',
    readOnly: false,
    required: true,
    maxlength: '100',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.admin-user.department',
    model: 'department',
    default: '',
    ID: 'department',
    readOnly: false,
    required: true,
    maxlength: '100',
    props: {}
  },
  {
    type: 'password',
    label: 'ui.admin-user.password',
    model: 'pdField',
    default: '',
    ID: 'pdField',
    readOnly: false,
    required: true,
    maxlength: '99',
    valid: true,
    pdRestrict: '1',
    props: {},
    clickAction() {
      return createPwd()
    }
  },
  {
    type: 'password',
    label: 'ui.admin-user.cnfrpassword',
    model: 'cnfrPdfield',
    default: '',
    ID: 'cnfrPdfield',
    readOnly: false,
    required: true,
    maxlength: '99',
    valid: true,
    pdRestrict: '1',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.admin-user.tel',
    model: 'tel',
    default: '',
    ID: 'tel',
    readOnly: false,
    required: false,
    maxlength: '20',
    colNum: '4',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.admin-user.ext',
    model: 'ext',
    default: '',
    ID: 'ext',
    readOnly: false,
    required: false,
    maxlength: '8',
    colNum: '2',
    props: {},
    validateAction(val: string) {
      return validateNumber(val)
    }
  },
  {
    type: 'text',
    label: 'ui.admin-user.email',
    model: 'email',
    default: '',
    ID: 'email',
    readOnly: false,
    required: false,
    maxlength: '50',
    props: {},
    validateAction(val: string) {
      return validateEmail(val)
    }
  },
  {
    type: 'checkbox',
    label: 'ui.mfa.authentication.binding',
    model: 'mfaBinding',
    default: '',
    ID: 'mfaBinding',
    readOnly: true,
    required: false,
    maxlength: '20',
    colNum: '4',
    hide: false,
    props: {
      options: mfaBindingOptions
    }
  },
  {
    type: 'btn',
    label: 'ui.mfa.authentication.qrcode.unbinding',
    model: 'mfaBindingBtn',
    default: '',
    ID: 'mfaBindingBtn',
    readOnly: true,
    required: false,
    colNum: '2',
    props: {},
    async btnComponentAction() {
      const result = await apiUtil.post(
        '/index/auth/delData',
        {
          accountName: formDetails.value['account'],
          issuerOid: formDetails.value['issuerOid'],
          userType: formDetails.value['userType']
        },
        {},
        true
      )
      if (result.success && result.code == '0000') {
        goBack()
        await swalMessage.success(t('ui.successfully.unbind'))
      } else {
        await swalMessage.error(result.message)
      }
    }
  },
  {
    type: 'btn',
    label: 'ui.fido.user-status.query-button',
    model: 'fidoStatusBtn',
    default: '',
    ID: 'fidoStatusBtn',
    readOnly: true,
    required: false,
    colNum: '2',
    hide: true,
    props: {},
    btnComponentAction() {
      openFidoModal(formDetails.value)
    }
  }
])

watch(
  () => pdParam.value.pdRestrict,
  (newVal) => {
    const matchingFields = formConfig.value.filter((f) => f.valid === true)
    if (matchingFields.length > 0) {
      for (const f of matchingFields) {
        f.pdRestrict = newVal
      }
    }
  },
  { immediate: true }
)
watch(
  () => formDetails.value.mfaBinding,
  (newVal) => {
    const btnField = formConfig.value.find((f) => f.model === 'mfaBindingBtn')
    if (btnField) {
      btnField.hide = newVal == 'N'
    }
  },
  { immediate: true } // Execute immediately once，初始化时就设置正确的 hide
)

// Show FIDO button in form when in Update mode and FIDO enabled; no longer in table
watch(
  () => [formTitle.value, isFidoMode.value, userState.user.fidoEnabled] as const,
  () => {
    const fidoBtnField = formConfig.value.find((f) => f.model === 'fidoStatusBtn')
    if (fidoBtnField) {
      fidoBtnField.hide = !(formTitle.value === 'UPDATE' && isFidoMode.value && userState.user.fidoEnabled === '1')
    }
  },
  { immediate: true, deep: true }
)

const tableCustomButtons = ref<
  Array<{
    label: string
    type: 'button'
    variant: string
    action: (row: Record<string, any>) => void
    btnShow?: () => boolean
  }>
>([])

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer-adm.issuer', // label is defined directly on the field object
    model: 'issuerOid',
    default: '',
    props: {
      options: issuerOptions,
      // Use computed to switch language
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
      // Use computed to switch language
      id: 'criteriaAccount'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
