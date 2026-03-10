<template>
  <!-- Display search criteria -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.admin-user.management')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.admin-user.management')"
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
import { mfaBindingOptionSelect } from '@/utils/select/MFABinding'
import zxcvbn from 'zxcvbn'
import { validateNumber, validateTel, validateEmail } from '@/utils/validateUtil'
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

const formDetails = ref<Record<string, any>>({})
const formMask = ref() // Used to store reference to FormComponent
const pdParam = ref<Record<string, any>>({})

// FIDO popup related variables
const showFidoModal = ref(false)
const selectedUser = ref<Record<string, any>>({})
const isFidoMode = ref(false)

//groupOptions setting
const groupArrayData = ref<BaseSelect[]>([])
const groupOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...groupArrayData.value] : [...groupArrayData.value]
})
const mfaBindingOptions = computed(() => [...mfaBindingOptionSelect])

onMounted(async () => {
  //schemeOptions.value = await findByCodeType('CARD_SCHEME')
  groupArrayData.value = await findAllPermissionGroup()

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
      hideALLSet(formConfig, true, ['mfaBinding', 'mfaBindingBtn'])
      openFrom()
    }
  }
]

// --------------------------------------------------------------------
/**
 * Open popup function
 */
const openFrom = async () => {
  if (formMask.value) {
    const result = await apiUtil.get('/condition/pdPolicyParam', { issuerOid: '', organ: 'hosted' }, {}, true)
    pdParam.value = result.data

    formMask.value.show()
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
const form = ref<any>({})
const formTitle = ref('')
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
      readOnlySet(formConfig, ['cardScheme'], false)
    }
    hideALLSet(formConfig, false, ['mfaBinding', 'mfaBindingBtn'])
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}

/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  readOnlySet(formConfig, ['account'], true)
  requiredSet(formConfig, ['pdField', 'cnfrPdfield'], false)
  await findById(formDate)
}
/**
 * Delete function
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/admin_user/delete?oid=${formDate['oid']}`, {}, {}, true)
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

  form.value['issuerOid'] = userState.user.issuerOid

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
    const result = await apiUtil.post('/admin_user/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    const result = await apiUtil.post('/admin_user/edit', form.value, {}, true)
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
 * Query detail function
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/admin_user/detail', params, {}, true)
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
  const result = await apiUtil.postSearchPage('/admin_user/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

// header: table header; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
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
    field: 'adminGroupName'
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

const formConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.admin-user.account',
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
    label: 'ui.admin-user.user-name',
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
    label: 'ui.admin-user.group',
    model: 'adminGroupOid',
    default: '',
    ID: 'adminGroupOid',
    readOnly: false,
    required: true,
    props: {
      options: groupOptions
    }
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
    props: {},
    valid: true,
    pdRestrict: '1',
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
    props: {},
    validateAction(val: string) {
      return validateTel(val)
    }
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
// FIDO Popup Control Function
const openFidoModal = (row: Record<string, any>) => {
  selectedUser.value = row
  showFidoModal.value = true
}

const closeFidoModal = () => {
  showFidoModal.value = false
  selectedUser.value = {}
}

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
      for (const f of matchingFields) f.pdRestrict = newVal
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

// Show FIDO button in form when in Update mode and FIDO enabled (same condition as former table button)
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

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.admin-user.group',
    model: 'criteriaAdminGroupOid',
    default: '',
    props: {
      options: groupOptions,
      id: 'criteriaAdminGroupOid'
    }
  },
  {
    type: 'text',
    label: 'ui.admin-user.account',
    model: 'criteriaAccount',
    default: '',
    maxlength: '20',
    props: {
      id: 'criteriaAccount'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
