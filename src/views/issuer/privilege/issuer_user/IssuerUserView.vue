<template>
  <!-- Display search criteria -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.issuer-user.adm')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.issuer-user.adm')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="true"
    :operation-btn-delete="true"
    :custom-buttons="tableCustomButtons"
    @open-update="openUpdate"
    @delete-row="deleteRow"
    :btn-show="hideBtn"
  />

  <FormComponent
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    :form-data="formDetails"
    :customButtons="formCustomButtonList"
  />

  <FormComponent
    ref="formUploadMask"
    :form-config="uploadFormConfig"
    :title="uploadFormTitle"
    @submit="uploadSubmit"
    @go-back="uploadGoBack"
    :form-data="formDetails"
  />

  <!-- FIDO User Status Query Popup -->
  <FidoUserStatusModal
    v-if="showFidoModal"
    :userId="selectedUser.account"
    :userName="selectedUser.userName"
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
import { createPd, encryptPd, handlePwd, hideALLSet, readOnlyALLSet, readOnlySet, requiredSet } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { useAppStore, useAppStoreHook } from '@/stores/app'
import { validatePassword } from '@/utils/passwordValidation'
import zxcvbn from 'zxcvbn'
import { findAllIssuer } from '@/hooks/searchConditions'
import { mfaBindingOptionSelect } from '@/utils/select/MFABinding'
import { validateTel } from '@/utils/validateUtil'
import { findAllPermissionGroup } from '@/hooks/permissionGroup'
import { logout } from '@/utils/authUserUtils'
import { resetRouter } from '@/router'
import FidoUserStatusModal from '@/components/fido/FidoUserStatusModal.vue'

const appStoreHook = useAppStoreHook()
const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
// Handle the search criteria emitted by the QueryCriteria component
// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

const issuerData = ref<BaseSelect[]>([])
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})
//CardScheme
const formDetails = ref<Record<string, any>>({})
const formMask = ref()
const formUploadMask = ref()
const pdParam = ref<Record<string, any>>({})

//groupOptions setting
const groupArrayData = ref<BaseSelect[]>([])
const groupOptions = computed(() => [...optionSelect, ...groupArrayData.value])
const mfaBindingOptions = computed(() => [...mfaBindingOptionSelect])

const form = ref<any>({})
const formTitle = ref('')
const uploadFormTitle = ref('')

// FIDO Popup Control
const showFidoModal = ref(false)
const selectedUser = ref<Record<string, any>>({})
const isFidoMode = ref(false)

onMounted(async () => {
  //schemeOptions.value = await findByCodeType('CARD_SCHEME')
  groupArrayData.value = await findAllPermissionGroup(userState.user.issuerOid)
  issuerData.value = await findAllIssuer()

  // Check if FIDO mode
  isFidoMode.value = import.meta.env.MODE === 'fido'
})

// Define custom buttons
const customButtonList: CustomButton[] = [
  {
    label: 'btn.new',
    type: 'button',
    variant: 'primary',
    action: () => {
      formTitle.value = 'ADD'
      readOnlySet(formConfig, ['account'], false)
      requiredSet(formConfig, ['pdField', 'cnfrPdfield'], true)
      readOnlySet(formConfig, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [], true)
      hideALLSet(formConfig, true, ['mfaBinding', 'mfaBindingBtn'])
      openFrom()
    }
  }
]

const formCustomButtonList: CustomButton[] = [
  {
    label: 'btn.export',
    type: 'button',
    variant: 'primary',
    action: async () => {
      await apiUtil
        .downloadExcel(`issuer_user/export`, {}, {}, false)
        .then(() => {
          console.log('file downloaded successfully.')
        })
        .catch((error) => {
          swalMessage.error(error)
        })
    }
  },
  {
    label: 'btn.import',
    type: 'button',
    variant: 'primary',
    action: () => {
      if (formUploadMask.value) {
        uploadFormTitle.value = 'IMPORT'
        formUploadMask.value.show()
      } else {
        console.error('FormComponent component is not ready yet')
      }
    }
  }
]

// --------------------------------------------------------------------

/**
 * Open popup function
 */
const openFrom = async () => {
  if (formMask.value) {
    formMask.value.show()

    const result = await apiUtil.get(
      '/condition/pdPolicyParam',
      {
        issuerOid: userState.user.issuerOid,
        organ: 'issuer'
      },
      {},
      true
    )
    pdParam.value = result.data
  } else {
    console.error('FormComponent component is not ready yet')
  }
}
/**
 * Hide row
 * @param row current row
 */
const hideBtn = (row: Record<string, any>) => {
  return row.userType == 1
}

/**
 * Close popup
 */
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    if (formTitle.value === 'DETAIL') {
      readOnlyALLSet(formConfig, false, ['issuerOid'])
    } else if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig, ['account', 'issuerOid'], false)
    } else if (formTitle.value === 'ADD') {
      readOnlySet(formConfig, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [], false)
    }
    hideALLSet(formConfig, false, ['mfaBinding', 'mfaBindingBtn'])
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}

/**
 * Close upload data popup
 */
const uploadGoBack = () => {
  //page date refresh
  if (formUploadMask.value) {
    formUploadMask.value.hide()
  } else {
    console.error('FormComponent component is not ready yet')
  }
  uploadFormTitle.value = ''
}

/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  readOnlySet(formConfig, ['account', 'issuerOid'], true)
  requiredSet(formConfig, ['pdField', 'cnfrPdfield'], false)
  await findById(formDate)
}

/**
 * Open FIDO Popup
 * @param row user data
 */
const openFidoModal = (row: Record<string, any>) => {
  selectedUser.value = row
  showFidoModal.value = true
}

/**
 * Close FIDO Popup
 */
const closeFidoModal = () => {
  showFidoModal.value = false
  selectedUser.value = {}
}
/**
 * Delete function
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/issuer_user/delete?oid=${formDate['oid']}`, {}, {}, true)
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
 * Submit按钮触发函数
 * @param formDate form data
 */
const submit = async (formDate: any) => {
  form.value = { ...formDate }

  // Password mismatch validation (check only when password field is not empty)
  if (form.value['pdField'] || form.value['cnfrPdfield']) {
    if (form.value['pdField'] !== form.value['cnfrPdfield']) {
      await swalMessage.error(t('warn.issuer-adm.password-cnfr-password-not-same')) // Multi-language prompt or fixed text
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
  form.value['issuerOid'] = userState.user.issuerOid
  if (form.value['pdField']) {
    form.value['encryptPdfield'] = encryptPd(form.value['account'], form.value['pdField'], pdParam.value.hashAlgorithm)
    form.value['pdField'] = handlePwd('0', form.value['pdField'])
    form.value['cnfrPdfield'] = handlePwd('0', form.value['cnfrPdfield'])
  } else {
    form.value['pdField'] = null // Explicitly pass null
    form.value['cnfrPdfield'] = null
    form.value['encryptPdfield'] = null
  }

  if (formTitle.value == 'ADD') {
    //call add API
    const result = await apiUtil.post('/issuer_user/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    //call edit API
    const result = await apiUtil.post('/issuer_user/edit', form.value, {}, true)
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
 * Submit上传资料
 * @param formDate form data
 */
const uploadSubmit = async (formDate: any) => {
  form.value = { ...formDate }

  if (uploadFormTitle.value == 'IMPORT') {
    //call add API
    const result = await apiUtil.post(
      '/issuer_user/import',
      form.value,
      { 'content-type': 'multipart/form-data' },
      true
    )
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      uploadGoBack()
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
 * Query detail function
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/issuer_user/detail', params, {}, true)
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
  await openFrom()
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

const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/issuer_user/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
/**
 * Validate number
 * @param val input value
 */
const validateNumber = (val: string) => {
  const validate: Record<string, any> = {}
  const emailPattern = /^\d+$/
  if (emailPattern.test(val)) {
    validate['result'] = true
  } else {
    validate['result'] = false
    validate['message'] = 'warn.num-only'
  }
  return validate
}
// header: table header; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerName'
  },
  {
    header: 'ui.issuer-user.code',
    field: 'account'
  },
  {
    header: 'ui.issuer-user.name',
    field: 'userName'
  },
  {
    header: 'ui.issuer-user.group',
    field: 'issuerGroupName'
  },
  {
    header: 'ui.issuer-user.dep',
    field: 'department'
  },
  {
    header: 'ui.issuer-user.tel',
    field: 'tel'
  },
  {
    header: 'ui.issuer-user.ext',
    field: 'ext'
  },
  {
    header: 'ui.issuer-user.email',
    field: 'email'
  }
])

// FIDO button moved into Edit form; no longer shown in table
const tableCustomButtons = ref<
  Array<{
    label: string
    type: 'button'
    variant: string
    action: (row: Record<string, any>) => void
    btnShow?: (row: Record<string, any>) => boolean
  }>
>([])

const formConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: 'issuerOid',
    ID: 'issuerOid',
    readOnly: true,
    required: true,
    maxlength: '20',
    props: {
      options: issuerOptions
    }
  },
  {
    type: 'text',
    label: 'ui.issuer-user.code',
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
    label: 'ui.issuer-user.name',
    model: 'userName',
    default: '',
    ID: 'userName',
    readOnly: false,
    required: true,
    maxlength: '100',
    props: {}
  },
  {
    type: 'checkbox',
    label: 'ui.issuer-user.group',
    model: 'issuerGroupOid',
    default: '',
    ID: 'issuerGroupOid',
    readOnly: false,
    required: true,
    props: {
      options: groupOptions
    }
  },
  {
    type: 'text',
    label: 'ui.issuer-user.dep',
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
    label: 'ui.issuer-user.password',
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
    label: 'ui.issuer-user.chpassword',
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
    label: 'ui.issuer-user.tel',
    model: 'tel',
    default: '',
    ID: 'tel',
    readOnly: false,
    required: false,
    maxlength: '20',
    colNum: '4',
    props: {},
    validateAction(val: string) {
      return validateTel(val)
    }
  },
  {
    type: 'text',
    label: 'ui.issuer-user.ext',
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
    label: 'ui.issuer-user.email',
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
        if (userState.user.account == formDetails.value['account']) {
          goBack()
          await swalMessage.success(result.message)
          headerLogout()
        } else {
          goBack()
          await swalMessage.success(t('ui.successfully.unbind'))
        }
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
const appStore = useAppStore()
const headerLogout = async () => {
  apiUtil.get(`/${appStore.organ}/index/logout`, null, {}, true)
  logout()
  // Clear routes
  resetRouter()
}
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

// Show FIDO button in form when in Update mode and FIDO enabled (same as former table: userType != 0)
watch(
  () => [formTitle.value, formDetails.value.userType, isFidoMode.value, userState.user.fidoEnabled] as const,
  () => {
    const fidoBtnField = formConfig.value.find((f) => f.model === 'fidoStatusBtn')
    if (fidoBtnField) {
      fidoBtnField.hide = !(
        formTitle.value === 'UPDATE' &&
        isFidoMode.value &&
        userState.user.fidoEnabled === '1' &&
        formDetails.value?.userType != 0
      )
    }
  },
  { immediate: true, deep: true }
)

const uploadFormConfig = ref<FormField[]>([
  {
    type: 'file',
    label: 'ui.issuer-user.data',
    model: 'file',
    default: '',
    ID: 'file',
    readOnly: false,
    required: true,
    props: {}
  }
])

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer-user.group',
    model: 'criteriaIssuerGroupOid',
    default: '',
    props: {
      options: groupOptions,
      id: 'criteriaIssuerGroupOid'
    }
  },
  {
    type: 'text',
    label: 'ui.issuer-user.code',
    model: 'criteriaIssuerUserAccount',
    default: '',
    props: {
      id: 'criteriaIssuerUserAccount'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
