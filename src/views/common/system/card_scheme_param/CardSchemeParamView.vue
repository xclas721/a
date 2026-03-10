<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.card-scheme-param')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.card-scheme-param')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="true"
    :operation-btn-update="true"
    :operation-btn-delete="false"
    @open-detail="openDetail"
    @open-update="openUpdate"
    :custom-buttons="tableCustomButtonList"
  />

  <FormComponent
    ref="formMask"
    :form-config="formConfig1"
    :title="formTitle"
    @submit="submit1"
    @go-back="goBack1"
    :form-data="formDetails"
  >
  </FormComponent>

  <FormComponent
    ref="formLoad"
    :form-config="formConfig2"
    :title="formTitle"
    @submit="submit2"
    @go-back="goBack2"
    :form-data="formDetails"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import { findByCodeType } from '@/hooks/sysCode'
import { type BaseI18nSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import { hideALLSet, readOnlyALLSet, readOnlySet, requiredSet, uploadFile } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { jweAlgorithmOptionSelect, jwsAlgorithmOptionSelect } from '@/utils/select/cardSchemeParam'
import { enableFlagOptionSelect } from '@/utils/select/visarba'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { types } from 'sass'
import Error = types.Error
//CardScheme
const schemeOptions = ref<BaseI18nSelect[]>([])
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const { t } = useI18n()
const cardSchemeOptions = computed(() => [...optionSelect, ...schemeOptions.value])
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

//riskLevel
const jwsAlgorithmOption = computed(() => [...optionSelect, ...jwsAlgorithmOptionSelect])
const jweAlgorithmOption = computed(() => [...optionSelect, ...jweAlgorithmOptionSelect])

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
const form = ref<any>({})
// Breadcrumb
const formTitle = ref('')
const formMask = ref() // Used to store reference to FormComponent
const formLoad = ref() // Used to store reference to FormComponent
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
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/card_scheme_param/query', searchCriteria.value, page, {}, true)

  if (!result.success) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
/**
 * Upload
 */
const tableCustomButtonList: TableCustomButton[] = [
  {
    label: 'ui.reconfirm.action.U',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      if (formLoad.value) {
        readOnlySet(formConfig2, ['codeId'], true)
        const params: Record<string, any> = { oid: row['oid'] }
        // Fill data
        const result = await apiUtil.get('/card_scheme_param/detail', params, {}, true)
        if (result.success && result.code == '0000') {
          // Update formDetails value
          const imgParam = [
            { msgType: 'card_scheme_image_medium', fileId: result.data.imageMedium },
            { msgType: 'card_scheme_image_high', fileId: result.data.imageHigh },
            { msgType: 'card_scheme_image_extra', fileId: result.data.imageExtra }
          ]
          if (result.data.imageMedium && result.data.imageHigh && result.data.imageExtra) {
            const imgResult = await apiUtil.post(`/downloads`, imgParam, {}, true)
            // Update formDetails value
            if (imgResult.success && imgResult.code == '0000') {
              formDetails.value = {
                ...result.data,
                imageMediumImg: imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_medium').bytes,
                imageHighImg: imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_high').bytes,
                imageExtraImg: imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_extra').bytes
              }
            }
          } else {
            formDetails.value = {
              ...result.data
            }
          }
        } else {
          await swalMessage.error(result.message)
          return
        }
        formTitle.value = 'LOAD'
        formLoad.value.show()
      } else {
        console.error('FormComponent component is not ready yet')
      }
    }
  }
]
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
 * Close form1
 */
const goBack1 = () => {
  hideALLSet(formConfig1, true, ['imageMediumImg', 'imageHighImg', 'imageExtraImg'])
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    if (formTitle.value === 'DETAIL') {
      readOnlyALLSet(formConfig1, false, [])
    } else if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig1, ['codeId'], false)
    }
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}

/**
 * Close form2
 */
const goBack2 = () => {
  //page date refresh
  if (formLoad.value) {
    formLoad.value.hide()
    formDetails.value = {}
    if (formTitle.value === 'DETAIL') {
      readOnlyALLSet(formConfig2, false, [])
    } else if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig2, ['codeId'], false)
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
const submit1 = async (formDate: any) => {
  form.value = { ...formDate }
  if (formTitle.value == 'ADD') {
    //call add API
    const result = await apiUtil.post('/card_scheme_param/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack1()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    //call edit API
    form.value['isUploadImage'] = false
    const result = await apiUtil.post('/card_scheme_param/edit', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack1()
    } else {
      await swalMessage.error(result.message)
      return
    }
  }
  // Finally update table
  await handleSearch(searchCriteria.value)
}

/**
 * Upload提交函数
 * @param formDate form data
 */
const submit2 = async (formDate: any) => {
  form.value = formDetails.value
  if (!formDate['imageMediumImg'] || !formDate['imageHighImg'] || !formDate['imageExtraImg']) {
    await swalMessage.error(t('warn.issuer-param.image-file-array-index-error'))
    return
  }
  // form.value = { ...formDate }
  form.value['imageMediumImg'] = formDate['imageMediumImg']
  form.value['imageHighImg'] = formDate['imageHighImg']
  form.value['imageExtraImg'] = formDate['imageExtraImg']
  if (formTitle.value == 'LOAD') {
    //call edit API
    form.value['isUploadImage'] = true
    const bizTypes = ['card_scheme_image_medium', 'card_scheme_image_high', 'card_scheme_image_extra']
    const fields = ['imageMediumImg', 'imageHighImg', 'imageExtraImg']
    const fieldIds = ['imageMedium', 'imageHigh', 'imageExtra']
    const fileMappings = await uploadFile(bizTypes, fields, fieldIds, form.value, formDetails.value)
    if (fileMappings instanceof Error) {
      return
    }
    const result = await apiUtil.post('/card_scheme_param/upload', fileMappings, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack2()
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
  readOnlyALLSet(formConfig1, true, [])
  hideALLSet(formConfig1, false, ['imageMediumImg', 'imageHighImg', 'imageExtraImg'])
  await findById(formDate)
}
/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  readOnlySet(formConfig1, ['codeId'], true)
  await findById(formDate)
}
/**
 * Detail info
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/card_scheme_param/detail', params, {}, true)
  if (result.success && result.code == '0000') {
    // Update formDetails value
    const imgParam = [
      { msgType: 'card_scheme_image_medium', fileId: result.data.imageMedium },
      { msgType: 'card_scheme_image_high', fileId: result.data.imageHigh },
      { msgType: 'card_scheme_image_extra', fileId: result.data.imageExtra }
    ]
    const imgResult = await apiUtil.post(`/downloads`, imgParam, {}, true)
    // Update formDetails value
    if (imgResult.success && imgResult.code == '0000') {
      formDetails.value = {
        ...result.data,
        imageMediumImg: imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_medium').bytes,
        imageHighImg: imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_high').bytes,
        imageExtraImg: imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_extra').bytes
      }
    }
  } else {
    await swalMessage.error(result.message)
    return
  }
  // Open window
  openFrom()
}

// Initialization trigger function
onMounted(async () => {
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
})
/**
 * Validate number
 * @param mcc Merchant Code
 */
const validateMcc = (mcc: string) => {
  const validate: Record<string, any> = {}
  const emailPattern = /^\d+$/
  if (emailPattern.test(mcc)) {
    validate['result'] = true
  } else {
    validate['result'] = false
    validate['message'] = 'warn.num-only'
  }
  return validate
}

const validateProxyHost = (ip: string) => {
  const validate: Record<string, any> = {}

  // IPv4 address regex
  const ipv4Pattern =
    /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/

  // IPv6 address regex (simplified)
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/

  if (ipv4Pattern.test(ip)) {
    validate['result'] = true
    validate['type'] = 'IPv4'
  } else if (ipv6Pattern.test(ip)) {
    validate['result'] = true
    validate['type'] = 'IPv6'
  } else {
    validate['result'] = false
    validate['message'] = 'warn.invalid-ip'
  }

  return validate
}
// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.card-scheme.name',
    field: 'codeId',
    colOptions: computed(() => [...schemeOptions.value])
  },
  {
    header: 'ui.card-scheme-param.signature-algorithm',
    field: 'jwsAlgorithm'
  },
  {
    header: 'ui.card-scheme-param.algorithm',
    field: 'jweAlgorithm'
  }
])
const formConfig1 = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.card-scheme.name',
    model: 'codeId',
    default: '',
    ID: 'codeId',
    readOnly: false,
    required: true,
    props: {
      options: cardSchemeOptions
    }
  },
  {
    type: 'text',
    label: 'ui.card-scheme-param.referred',
    model: 'shortName',
    default: '',
    ID: 'shortName',
    readOnly: false,
    required: true,
    maxlength: '20',
    props: {}
  },
  {
    type: 'checkbox',
    label: 'ui.card-scheme-param.signature-algorithm',
    model: 'jwsAlgorithm',
    default: '',
    ID: 'jwsAlgorithm',
    readOnly: false,
    required: true,
    props: {
      options: jwsAlgorithmOption
    }
  },
  {
    type: 'checkbox',
    label: 'ui.card-scheme-param.algorithm',
    model: 'jweAlgorithm',
    default: '',
    ID: 'jweAlgorithm',
    readOnly: false,
    required: true,
    props: {
      options: jweAlgorithmOption
    }
  },
  {
    type: 'text',
    label: 'ui.card-scheme-param.conn-timeout',
    model: 'rreqConnTimeout',
    default: '',
    ID: 'rreqConnTimeout',
    readOnly: false,
    required: true,
    maxlength: '3',
    props: {},
    placeholder: 'warn.num-only-30',
    validateAction(val: string) {
      return validateMcc(val)
    }
  },
  {
    type: 'text',
    label: 'ui.card-scheme-param.connection-failed-retry-interval',
    model: 'rreqRetryInterval',
    default: '',
    ID: 'rreqRetryInterval',
    readOnly: false,
    required: true,
    maxlength: '3',
    props: {},
    placeholder: 'warn.num-only-10',
    validateAction(val: string) {
      return validateMcc(val)
    }
  },
  {
    type: 'text',
    label: 'ui.card-scheme-param.data-read-timeout',
    model: 'rreqReadTimeout',
    default: '',
    ID: 'rreqReadTimeout',
    readOnly: false,
    required: true,
    maxlength: '3',
    props: {},
    placeholder: 'warn.num-only-5',
    validateAction(val: string) {
      return validateMcc(val)
    }
  },
  {
    type: 'text',
    label: 'ui.card-scheme-param.transaction-over-initial-time',
    model: 'creq1TransTimeout',
    default: '',
    ID: 'creq1TransTimeout',
    readOnly: false,
    required: true,
    maxlength: '3',
    props: {},
    placeholder: 'warn.num-only-30',
    validateAction(val: string) {
      return validateMcc(val)
    }
  },
  {
    type: 'text',
    label: 'ui.card-scheme-param.transaction-over-time',
    model: 'creq2TransTimeout',
    default: '',
    ID: 'creq2TransTimeout',
    readOnly: false,
    required: true,
    maxlength: '3',
    props: {},
    placeholder: 'warn.num-only-600',
    validateAction(val: string) {
      return validateMcc(val)
    }
  },
  {
    type: 'text',
    label: 'ui.card-scheme-param.service-name',
    model: 'serviceName',
    default: '',
    ID: 'serviceName',
    readOnly: false,
    required: true,
    maxlength: '50',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.card-scheme-param.acsRefNum',
    model: 'acsRefNum',
    default: '',
    ID: 'acsRefNum',
    readOnly: false,
    required: false,
    maxlength: '32',
    props: {}
  },
  {
    type: 'radio',
    label: 'ui.card-scheme-param.proxy-enabled',
    model: 'proxyEnabled',
    default: '',
    ID: 'proxyEnabled',
    readOnly: false,
    required: true,
    props: {
      options: enableFlagOptionSelect
    },
    inputKeyupAction(val: string) {
      console.log(val)
      if (val == '1') {
        requiredSet(formConfig1, ['proxyHost', 'proxyPort'], true)
      } else {
        requiredSet(formConfig1, ['proxyHost', 'proxyPort'], false)
      }
    }
  },
  {
    type: 'text',
    label: 'ui.card-scheme-param.proxy-host',
    model: 'proxyHost',
    default: '',
    ID: 'proxyHost',
    readOnly: false,
    required: false,
    maxlength: '50',
    props: {},
    validateAction(val: string) {
      return validateProxyHost(val)
    }
  },
  {
    type: 'text',
    label: 'ui.card-scheme-param.proxy-port',
    model: 'proxyPort',
    default: '',
    ID: 'proxyPort',
    readOnly: false,
    required: false,
    maxlength: '6',
    props: {},
    validateAction(val: string) {
      return validateMcc(val)
    }
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-medium',
    model: 'imageMediumImg',
    default: '',
    ID: 'imageMediumImg',
    readOnly: true,
    required: false,
    hide: true,
    props: {}
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-high',
    model: 'imageHighImg',
    default: '',
    ID: 'imageHighImg',
    readOnly: true,
    required: false,
    hide: true,
    props: {}
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-extra',
    model: 'imageExtraImg',
    default: '',
    ID: 'imageExtraImg',
    readOnly: true,
    required: false,
    hide: true,
    props: {}
  }
])
const formConfig2 = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.card-scheme.name',
    model: 'codeId',
    default: '',
    ID: 'codeId',
    readOnly: false,
    required: true,
    props: {
      options: cardSchemeOptions
    }
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-medium',
    model: 'imageMediumImg',
    default: '',
    ID: 'imageMediumImg',
    readOnly: false,
    required: true,
    props: {}
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-high',
    model: 'imageHighImg',
    default: '',
    ID: 'imageHighImg',
    readOnly: false,
    required: true,
    props: {}
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-extra',
    model: 'imageExtraImg',
    default: '',
    ID: 'imageExtraImg',
    readOnly: false,
    required: true,
    props: {}
  }
])

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.card-scheme.name', // label is defined directly on the field object
    model: 'criteriaCardScheme',
    default: '',
    props: {
      // Use computed to switch language
      options: cardSchemeOptions,
      id: 'criteriaCardScheme'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
