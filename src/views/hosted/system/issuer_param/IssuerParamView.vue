<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.issuer-param')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.issuer-param')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="true"
    :operation-btn-update="true"
    @open-detail="openDetail"
    @open-update="openUpdate"
    :custom-buttons="openUpLoadButtonList"
  />

  <IssuerParamFormView
    ref="formMask"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    :form-data-detail="formDetails"
    :issuer-data="issuerData"
  />

  <!-- upload from -->
  <FormComponent
    ref="formUpload"
    :form-config="formConfig"
    :title="formTitle"
    @submit="uploadSubmit"
    @go-back="goBackUploadForm"
    :form-data="formDetails"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import { findByCodeType } from '@/hooks/sysCode'
import { type BaseI18nSelect, type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import { findAllIssuer } from '@/hooks/issuer'
import swalMessage from '@/plugins/swalMessage'
import { useAppStoreHook } from '@/stores/app'
import { switchOptionSelect } from '@/utils/select/issuerParam'
import IssuerParamFormView from '@/views/hosted/system/issuer_param/IssuerParamFormView.vue'
import { uploadFile } from '@/utils/util'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'

const appStoreHook = useAppStoreHook()
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

const openUpLoadButtonList: TableCustomButton[] = [
  {
    label: 'btn.load',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      if (formUpload.value) {
        const params: Record<string, any> = { oid: row.oid }
        // Fill data
        const result = await apiUtil.get('/issuer_param/detail', params, {}, true)
        if (result.success && result.code == '0000') {
          const imgParam = [
            { msgType: 'image_medium', fileId: result.data.imageMedium },
            { msgType: 'image_high', fileId: result.data.imageHigh },
            { msgType: 'image_extra', fileId: result.data.imageExtra },
            { msgType: 'spc_image_default', fileId: result.data.imageDefault },
            { msgType: 'spc_image_dark', fileId: result.data.imageDark },
            { msgType: 'spc_image_monochrome', fileId: result.data.imageMonochrome }
          ]
          const imgResult = await apiUtil.post(`/downloads`, imgParam, {}, true)
          // Update formDetails value
          formDetails.value = {
            ...result.data,
            imageMediumFile: imgResult.data.find((item: any) => item.msgType === 'image_medium')!.bytes,
            imageHighFile: imgResult.data.find((item: any) => item.msgType === 'image_high')!.bytes,
            imageExtraFile: imgResult.data.find((item: any) => item.msgType === 'image_extra')!.bytes,
            defaultImageFile: imgResult.data.find((item: any) => item.msgType === 'spc_image_default')!.bytes,
            darkImageFile: imgResult.data.find((item: any) => item.msgType === 'spc_image_dark')!.bytes,
            monochromeImageFile: imgResult.data.find((item: any) => item.msgType === 'spc_image_monochrome')!.bytes
          }
        } else {
          await swalMessage.error(result.message)
          return
        }
        formTitle.value = 'UPDATE'
        formUpload.value.show()

        await handleSearch(searchCriteria.value)
      } else {
        console.error('FormComponent component is not ready yet')
      }
    }
  }
]
//CardScheme
const schemeOptions = ref<BaseI18nSelect[]>([])

const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})

// Reactive to refresh table
const searchCriteria = ref<any>({})
//options setting
const cardSchemeOptions = computed(() => [...optionSelect, ...schemeOptions.value])
const issuerData = ref<BaseSelect[]>([])
const form = ref<any>({})
// Breadcrumb
const formTitle = ref('')
const formMask = ref() // Used to store reference to FormComponent

const formUpload = ref() // Used to store reference to FormComponent
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
  const result = await apiUtil.postSearchPage('/issuer_param/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
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
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}
/**
 * Close upload form
 */
const goBackUploadForm = () => {
  //page date refresh
  if (formUpload.value) {
    formUpload.value.hide()
    formDetails.value = {}
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}
/**
 * Upload提交函数
 * @param formDate form data
 */
const uploadSubmit = async (formDate: any) => {
  const bizTypes = [
    'image_medium',
    'image_high',
    'image_extra',
    'spc_image_default',
    'spc_image_dark',
    'spc_image_monochrome'
  ]
  const fields = [
    'imageMediumFile',
    'imageHighFile',
    'imageExtraFile',
    'defaultImageFile',
    'darkImageFile',
    'monochromeImageFile'
  ]
  const fieldIds = ['imageMedium', 'imageHigh', 'imageExtra', 'imageDefault', 'imageDark', 'imageMonochrome']
  const fileMappings = await uploadFile(bizTypes, fields, fieldIds, formDate, formDetails.value)
  if (fileMappings instanceof Error) {
    return
  }
  //call add API
  const result = await apiUtil.post('/issuer_param/load', fileMappings, {}, true)
  if (result.success && result.code == '0000') {
    await swalMessage.success(result.message)
    goBackUploadForm()
  } else {
    await swalMessage.error(result.message)
    return
  }
  await handleSearch(searchCriteria.value)
}
/**
 * Add, Modify Submit Function
 * @param formDate form data
 */
const submit = async (formDate: any) => {
  form.value = { ...formDate }
  console.log('function', formTitle.value)
  const bizTypes = [
    'image_medium',
    'image_high',
    'image_extra',
    'spc_image_default',
    'spc_image_dark',
    'spc_image_monochrome'
  ]
  const fields = [
    'imageMediumFile',
    'imageHighFile',
    'imageExtraFile',
    'defaultImageFile',
    'darkImageFile',
    'monochromeImageFile'
  ]
  const fieldIds = ['imageMedium', 'imageHigh', 'imageExtra', 'imageDefault', 'imageDark', 'imageMonochrome']
  const fileMappings = await uploadFile(bizTypes, fields, fieldIds, form.value, formDetails.value)
  if (fileMappings instanceof Error) {
    return
  }
  if (formTitle.value == 'ADD') {
    //call add API
    const result = await apiUtil.post('/issuer_param/add', fileMappings, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    //call edit API
    const result = await apiUtil.post('/issuer_param/edit', fileMappings, {}, true)
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
  await findById(formDate)
}
/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  await findById(formDate)
}

/**
 * Detail info
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/issuer_param/detail', params, {}, true)
  if (result.success && result.code == '0000') {
    const imgParam = [
      { msgType: 'image_medium', fileId: result.data.imageMedium },
      { msgType: 'image_high', fileId: result.data.imageHigh },
      { msgType: 'image_extra', fileId: result.data.imageExtra },
      { msgType: 'spc_image_default', fileId: result.data.imageDefault },
      { msgType: 'spc_image_dark', fileId: result.data.imageDark },
      { msgType: 'spc_image_monochrome', fileId: result.data.imageMonochrome }
    ]
    const imgResult = await apiUtil.post(`/downloads`, imgParam, {}, true)
    // Update formDetails value
    formDetails.value = {
      ...result.data,
      imageMediumFile: imgResult.data.find((item: any) => item.msgType === 'image_medium')!.bytes,
      imageHighFile: imgResult.data.find((item: any) => item.msgType === 'image_high')!.bytes,
      imageExtraFile: imgResult.data.find((item: any) => item.msgType === 'image_extra')!.bytes,
      defaultImageFile: imgResult.data.find((item: any) => item.msgType === 'spc_image_default')!.bytes,
      darkImageFile: imgResult.data.find((item: any) => item.msgType === 'spc_image_dark')!.bytes,
      monochromeImageFile: imgResult.data.find((item: any) => item.msgType === 'spc_image_monochrome')!.bytes
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

  issuerData.value = await findAllIssuer()
})

const formConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    ID: 'issuerOid',
    readOnly: true,
    required: true,
    props: {
      options: issuerOptions
    }
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-medium',
    model: 'imageMediumFile',
    default: null,
    ID: 'imageMediumFile',
    readOnly: false,
    required: false,
    props: {}
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-high',
    model: 'imageHighFile',
    default: null,
    ID: 'imageHighFile',
    readOnly: false,
    required: false,
    props: {}
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-extra',
    model: 'imageExtraFile',
    default: null,
    ID: 'imageExtraFile',
    readOnly: false,
    required: false,
    props: {}
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-default',
    model: 'defaultImageFile',
    default: null,
    ID: 'defaultImageFile',
    readOnly: false,
    required: false,
    props: {}
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-dark',
    model: 'darkImageFile',
    default: null,
    ID: 'darkImageFile',
    readOnly: false,
    required: false,
    props: {}
  },
  {
    type: 'img',
    label: 'ui.issuer-param.image-monochrome',
    model: 'monochromeImageFile',
    default: null,
    ID: 'monochromeImageFile',
    readOnly: false,
    required: false,
    props: {}
  }
])
// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerOptions.value])
  },
  {
    header: 'Visa',
    field: 'switchVisa',
    headerNoI18n: true,
    colOptions: computed(() => [...switchOptionSelect])
  },
  {
    header: 'Master',
    field: 'switchMastercard',
    headerNoI18n: true,
    colOptions: computed(() => [...switchOptionSelect])
  },
  {
    header: 'JCB',
    field: 'switchJcb',
    headerNoI18n: true,
    colOptions: computed(() => [...switchOptionSelect])
  },
  {
    header: 'AMEX',
    field: 'switchAmex',
    headerNoI18n: true,
    colOptions: computed(() => [...switchOptionSelect])
  },
  {
    header: 'Diners',
    field: 'switchDiners',
    headerNoI18n: true,
    colOptions: computed(() => [...switchOptionSelect])
  },
  {
    header: 'CUP',
    field: 'switchCup',
    headerNoI18n: true,
    colOptions: computed(() => [...switchOptionSelect])
  },
  {
    header: 'PayNet',
    field: 'switchPayNet',
    headerNoI18n: true,
    colOptions: computed(() => [...switchOptionSelect])
  },
  {
    header: 'MADA',
    field: 'switchMada',
    headerNoI18n: true,
    colOptions: computed(() => [...switchOptionSelect])
  },
  {
    header: 'EFTPOS',
    field: 'switchEftPos',
    headerNoI18n: true,
    colOptions: computed(() => [...switchOptionSelect])
  },
  {
    header: 'Thai Payment Network',
    field: 'switchTpn',
    headerNoI18n: true,
    colOptions: computed(() => [...switchOptionSelect])
  },
  {
    header: 'ui.cavv-key.modify-time',
    field: 'updateDateTime',
    dateFormat: 'yyyy-MM-dd HH:mm:ss'
  }
])

// Search condition configuration
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: appStoreHook.organ == 'issuer' ? userState.user.issuerOid : '',
    props: {
      options: issuerOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'select',
    label: 'ui.card-scheme.name',
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
