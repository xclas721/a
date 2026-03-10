<template>
  <!-- Query criteria -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.card-bin')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.card-bin')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="true"
    :operation-btn-delete="true"
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
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { findByCodeType } from '@/hooks/sysCode'
import { type BaseI18nSelect, type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { cardTypeOptions, enableORDisableOptions } from '@/utils/select/cardBin'
import ApiUtil from '@/utils/apiUtils'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { readOnlyALLSet, readOnlySet, uploadFile } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import { findAllIssuer } from '@/hooks/searchConditions'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/stores/app'

const appStoreHook = useAppStoreHook()
const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()

//CardScheme
const schemeOptions = ref<BaseI18nSelect[]>([])
const issuerOptions = ref<BaseSelect[]>([])
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
//options setting
const issuerSeleteOptions = computed(() => [...optionSelect, ...issuerOptions.value])
const cardSchemeOptions = computed(() => [...optionSelect, ...schemeOptions.value])
const cardTypeModelOptions = computed(() => [...optionSelect, ...cardTypeOptions])
const decAuthIndOptions = computed(() => [...optionSelect, ...enableORDisableOptions])
const merWhiteListIndIndOptions = computed(() => [...optionSelect, ...enableORDisableOptions])
const deviceBindingIndModelOptions = computed(() => [...optionSelect, ...enableORDisableOptions])
const formMask = ref() // Used to store reference to FormComponent
const formDetails = ref<Record<string, any>>({})

onMounted(async () => {
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
  issuerOptions.value = await findAllIssuer()
  deleteQueryConfigData()
})

/**
 * Query criteria data - delete issuer
 */
const deleteQueryConfigData = () => {
  if (appStoreHook.organ == 'issuer') {
    const isExist = userQueryConfig.value.some((field) => field.model === 'issuerOid')
    if (isExist) {
      userQueryConfig.value = userQueryConfig.value.filter((field) => field.model !== 'issuerOid')
    }
  }
}

/**
 * Popup form data - Add issuer
 */
const addFormConfigData = () => {
  // Delete
  const isExist = formConfig.value.some((field) => field.ID === 'issuerOid')
  if (isExist) {
    formConfig.value = formConfig.value.filter((field) => field.ID !== 'issuerOid')
  }
  // Add
  formConfig.value.unshift({
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    ID: 'issuerOid',
    readOnly: true,
    required: true,
    props: { options: issuerSeleteOptions }
  })
}

/**
 * Popup form data - Delete issuer
 */
const deleteFormConfigData = () => {
  // Delete
  const isExist = formConfig.value.some((field) => field.ID === 'issuerOid')
  if (isExist) {
    formConfig.value = formConfig.value.filter((field) => field.ID !== 'issuerOid')
  }
  // Add
  if (appStoreHook.organ == 'hosted') {
    const isExist = formConfig.value.some((field) => field.ID === 'issuerOid')
    if (!isExist) {
      formConfig.value.unshift({
        type: 'checkbox',
        label: 'ui.issuer.name',
        model: 'issuerOid',
        default: '',
        ID: 'issuerOid',
        readOnly: false,
        required: true,
        props: { options: issuerSeleteOptions }
      })
    }
  }
}

// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

// Define custom buttons
const customButtonList: CustomButton[] = [
  {
    label: 'btn.new',
    type: 'button',
    variant: 'primary',
    action: () => {
      if (formMask.value) {
        formTitle.value = 'ADD'
        deleteFormConfigData()
        formMask.value.show()
      } else {
        console.error('FormComponent component is not ready yet')
      }
    }
  }
]

// header: table header; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.issuer-name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerOptions.value])
  },
  {
    header: 'ui.card-scheme.name',
    field: 'cardScheme',
    colOptions: computed(() => [...schemeOptions.value])
  },
  {
    header: 'ui.card-bin.type',
    field: 'cardType',
    colOptions: cardTypeOptions
  },
  {
    header: 'ui.card-bin.card',
    field: 'binBegin',
    joinCol: 'binEnd',
    joinStr: '~'
  },
  {
    header: 'ui.card-bin.criteriaDecAuthInd',
    field: 'decAuthInd',
    colOptions: enableORDisableOptions
  },
  {
    header: 'ui.card-bin.criteriaMerWhiteListInd',
    field: 'merWhiteListInd',
    colOptions: enableORDisableOptions
  },
  {
    header: 'ui.card-bin.deviceBindingInd',
    field: 'deviceBindingInd',
    colOptions: enableORDisableOptions
  }
])

/**
 * Pagination query function
 * @param page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/cardBin/query', searchCriteria.value, page, {}, true)

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
const openFrom = () => {
  if (formMask.value) {
    formMask.value.show()
  } else {
    console.error('FormComponent component is not ready yet')
  }
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
      readOnlyALLSet(formConfig, false, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
    } else if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig, ['issuerOid', 'cardScheme'], false)
    }
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}
/**
 * Submit表单函数
 * @param formDate form data
 */
const submit = async (formDate: any) => {
  form.value = { ...formDate }
  if (formTitle.value == 'ADD') {
    const bizTypes = ['spc_icon_img']
    const fields = ['spcIconImg']
    const fieldIds = ['spcIconImgId']
    const fileMappings = await uploadFile(bizTypes, fields, fieldIds, form.value, formDetails.value)
    if (fileMappings instanceof Error) {
      return
    }
    //call add API
    const result = await apiUtil.post('/cardBin/add', fileMappings, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    const bizTypes = ['spc_icon_img']
    const fields = ['spcIconImg']
    const fieldIds = ['spcIconImgId']
    const fileMappings = await uploadFile(bizTypes, fields, fieldIds, form.value, formDetails.value)
    if (fileMappings instanceof Error) {
      return
    }
    //call edit API
    const result = await apiUtil.post('/cardBin/edit', fileMappings, {}, true)
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
  await findById(formDate)
  readOnlySet(formConfig, ['issuerOid', 'cardScheme'], true)
  addFormConfigData()
}
/**
 * Delete function
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/cardBin/delete?oid=${formDate['oid']}`, {}, {}, true)
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
  const result = await apiUtil.get('/cardBin/detail', params, {}, true)
  if (result.success && result.code == '0000') {
    // Query image
    const imgResult = await apiUtil.get(`/download/spc_icon_img/${result.data.spcIconImgId}`, {}, {}, true)
    // Update formDetails value
    formDetails.value = {
      ...result.data,
      spcIconImg: imgResult.data
    }
  } else {
    await swalMessage.error(result.message)
    return
  }
  // Open window
  openFrom()
}

/**
 * Validate Card BIN Range
 * @param bin Card BIN Range
 */
const validatebin = (bin: string) => {
  const validate: Record<string, any> = {}

  // Validate if pure number
  const numberPattern = /^\d+$/
  if (!numberPattern.test(bin)) {
    validate['result'] = false
    validate['message'] = 'warn.num-only'
    return validate
  }

  // Validate length between 13-19
  if (bin.length < 13 || bin.length > 19) {
    validate['result'] = false
    validate['message'] = 'warn.bin-length'
    return validate
  }

  // Validation passed
  validate['result'] = true
  return validate
}

/**
 * Define data
 */
const formConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    ID: 'issuerOid',
    readOnly: appStoreHook.organ == 'issuer',
    required: true,
    props: {
      options: issuerSeleteOptions
    }
  },
  {
    type: 'checkbox',
    label: 'ui.card-scheme.name',
    model: 'cardScheme',
    default: '',
    ID: 'cardScheme',
    readOnly: false,
    required: true,
    props: {
      options: cardSchemeOptions
    }
  },
  {
    type: 'checkbox',
    label: 'ui.card-bin.type',
    model: 'cardType',
    default: '',
    ID: 'cardType',
    readOnly: false,
    required: true,
    props: {
      options: cardTypeModelOptions
    }
  },
  {
    type: 'text',
    label: 'ui.card-bin.start-bin',
    model: 'binBegin',
    default: '',
    ID: 'binBegin',
    readOnly: false,
    required: true,
    props: {},
    maxlength: '19',
    validateAction(val: string) {
      return validatebin(val)
    }
  },
  {
    type: 'text',
    label: 'ui.card-bin.end-bin',
    model: 'binEnd',
    default: '',
    ID: 'binEnd',
    readOnly: false,
    required: true,
    props: {},
    maxlength: '19',
    validateAction(val: string) {
      return validatebin(val)
    }
  },
  {
    type: 'radio',
    label: 'ui.card-bin.criteriaDecAuthInd',
    model: 'decAuthInd',
    default: '',
    ID: 'decAuthInd',
    readOnly: false,
    required: true,
    props: {
      options: enableORDisableOptions
    }
  },
  {
    type: 'radio',
    label: 'ui.card-bin.criteriaMerWhiteListInd',
    model: 'merWhiteListInd',
    default: '',
    ID: 'merWhiteListInd',
    readOnly: false,
    required: true,
    props: {
      options: enableORDisableOptions
    }
  },
  {
    type: 'radio',
    label: 'ui.card-bin.deviceBindingInd',
    model: 'deviceBindingInd',
    default: '',
    ID: 'deviceBindingInd',
    readOnly: false,
    required: false,
    props: {
      options: enableORDisableOptions
    }
  },
  {
    type: 'radio',
    label: 'ui.card-bin.visaVppSupportInd',
    model: 'visaVppSupportInd',
    default: '',
    ID: 'visaVppSupportInd',
    readOnly: false,
    required: false,
    props: {
      options: enableORDisableOptions
    }
  },
  {
    type: 'img',
    label: 'ui.card-bin.spc-icon-img',
    model: 'spcIconImg',
    default: null,
    ID: 'spcIconImg',
    readOnly: false,
    required: false,
    props: {}
  }
])

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer-adm.issuer',
    model: 'issuerOid',
    default: appStoreHook.organ == 'issuer' ? userState.user.issuerOid : '',
    props: {
      options: issuerSeleteOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'select',
    label: 'ui.card-scheme.name', // label is defined directly on the field object
    model: 'cardScheme',
    default: '',
    props: {
      // Use computed to switch language
      options: cardSchemeOptions,
      id: 'cardScheme'
    }
  },
  {
    type: 'select',
    label: 'ui.card-bin.type',
    model: 'cardType',
    default: '',
    props: {
      options: cardTypeModelOptions,
      id: 'cardType'
    }
  },
  {
    type: 'text',
    label: 'ui.card-bin.card',
    model: 'criteriaCardBin',
    default: '',
    maxlength: '6',
    props: {
      id: 'criteriaCardBin'
    }
  },
  {
    type: 'select',
    label: 'ui.card-bin.criteriaDecAuthInd',
    model: 'decAuthInd',
    default: '',
    props: {
      options: decAuthIndOptions,
      id: 'decAuthInd'
    }
  },
  {
    type: 'select',
    label: 'ui.card-bin.criteriaMerWhiteListInd',
    model: 'merWhiteListInd',
    default: '',
    props: {
      options: merWhiteListIndIndOptions,
      id: 'merWhiteListInd'
    }
  },
  {
    type: 'select',
    label: 'ui.card-bin.deviceBindingInd',
    model: 'deviceBindingInd',
    default: '',
    props: {
      options: deviceBindingIndModelOptions,
      id: 'deviceBindingInd'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
