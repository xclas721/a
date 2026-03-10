<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.kek')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.kek')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="false"
    :custom-buttons="tableCustomButtonList"
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
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import { type BaseSelect, defaultOptionSelect, optionSelect, optionSelect1 } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { readOnlyALLSet, readOnlySet } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import { findAllIssuer } from '@/hooks/issuer'
import swalMessage from '@/plugins/swalMessage'
import { useAppStoreHook } from '@/stores/app'
import {
  algorithmOptionSelect,
  encDataTypeOptionSelect,
  kekStatusOptionSelect,
  keySizeOptionSelect,
  modeOptionSelect,
  paddingOptionSelect
} from '@/utils/select/kek'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
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

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
//options setting
const issuerData = ref<BaseSelect[]>([])
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted'
    ? [...optionSelect, ...defaultOptionSelect, ...issuerData.value]
    : [...defaultOptionSelect, ...issuerData.value]
})

const encDataType = ref([...encDataTypeOptionSelect])
const encDataTypeOption = computed(() => [...optionSelect, ...encDataType.value])
const encDataTypeOptionQuery = computed(() => [...optionSelect, ...encDataTypeOptionSelect])
const kekStatusOption = computed(() => [...optionSelect, ...kekStatusOptionSelect])
const algorithm = ref([...algorithmOptionSelect])
const algorithmOption = computed(() => [...optionSelect, ...algorithm.value])
const keySize = ref([...keySizeOptionSelect])
const keySizeOption = computed(() => [...optionSelect, ...keySize.value])
const modeOption = computed(() => [...optionSelect, ...mode.value])
const paddingOption = computed(() => [...optionSelect, ...padding.value])

const getkeySizeFilteredOptions = (selectedKey = '') => {
  if (!selectedKey) return keySizeOptionSelect
  switch (selectedKey) {
    case 'AES':
      // AES only supports 128, 256 bits
      return keySizeOptionSelect.filter((opt) => opt.value !== '192')
    case 'SM4':
      // SM4 example handling
      return keySizeOptionSelect.filter((opt) => opt.value === '128')
    default:
      // Other algorithm types return all options
      return keySizeOptionSelect
  }
}

const mode = ref([...modeOptionSelect])
const padding = ref([...paddingOptionSelect])

// GCM can only pair with NoPadding, CBC can only pair with PKCS5Padding/PKCS7Padding
const getPaddingFilteredOptions = (selectedMode = '') => {
  if (!selectedMode) return paddingOptionSelect
  switch (selectedMode) {
    case 'GCM':
      // GCM can only pair with NoPadding
      return paddingOptionSelect.filter((opt) => opt.value === 'NoPadding')
    case 'CBC':
      // CBC can only pair with PKCS5Padding/PKCS7Padding
      return paddingOptionSelect.filter((opt) => opt.value === 'PKCS5Padding' || opt.value === 'PKCS7Padding')
    default:
      return paddingOptionSelect
  }
}

const getEncDataTypeFilteredOptions = (selectedKey = '') => {
  if (!selectedKey) return encDataTypeOptionSelect
  return selectedKey === '00000'
    ? encDataTypeOptionSelect.filter((opt) => ['1', '3', '4'].includes(opt.value))
    : encDataTypeOptionSelect
}

const formMask = ref() // Used to store reference to FormComponent
const form = ref<any>({})
const formTitle = ref('')
const formDetails = ref<Record<string, any>>({})
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
// Enable button
const tableCustomButtonList: TableCustomButton[] = [
  {
    label: 'btn.setup',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      if (row.encDataType == '4') {
        await swalMessage.confirm(t('ui.kek.enable.warn.message'), '', async function () {
          const result = await apiUtil.post(`/kek/enable?oid=${row.oid}`, { oid: row.oid }, {}, true)
          if (result.success && result.code == '0000') {
            await swalMessage.success(result.message)
            // Update table
            await handleSearch(searchCriteria.value)
          } else {
            await swalMessage.error(result.message)
          }
        })
      } else {
        const result = await apiUtil.post(`/kek/enable?oid=${row.oid}`, { oid: row.oid }, {}, true)
        if (result.success && result.code == '0000') {
          await swalMessage.success(result.message)
          // Update table
          await handleSearch(searchCriteria.value)
        } else {
          await swalMessage.error(result.message)
          return
        }
      }
    },
    btnShow(param) {
      return param.status != '1'
    }
  }
]
/**
 * Pagination function
 * @param page current page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/kek/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

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
    algorithm.value = [...algorithmOptionSelect]
    keySize.value = [...keySizeOptionSelect]
    mode.value = [...modeOptionSelect]
    padding.value = [...paddingOptionSelect]
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
    const result = await apiUtil.post('/kek/add', form.value, {}, true)
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
// Initialization trigger function
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  deleteQueryConfigData()
})
// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...optionSelect1, ...issuerData.value])
  },
  { header: 'ui.kek.key-alias', field: 'keyAlias' },
  {
    header: 'ui.kek.enc-data-type',
    field: 'encDataType',
    colOptions: computed(() => [...encDataTypeOptionSelect])
  },
  { header: 'ui.kek.alg', field: 'algorithm' },
  { header: 'ui.kek.key-size', field: 'keySize' },
  { header: 'ui.kek.mode', field: 'mode' },
  { header: 'ui.kek.padding', field: 'padding' },
  { header: 'ui.kek.modify-time', field: 'updateDateTime', dateFormat: 'yyyy-MM-dd HH:mm:ss' }
])
// Form configuration for Add, Modify, Query
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
      options: issuerOptions
    },
    inputKeyupAction(val: string) {
      encDataType.value = getEncDataTypeFilteredOptions(val)
    }
  },
  {
    type: 'text',
    label: 'ui.kek.key-alias',
    model: 'keyAlias',
    default: '',
    ID: 'keyAlias',
    readOnly: false,
    required: true,
    maxlength: '64',
    props: {}
  },
  {
    type: 'checkbox',
    label: 'ui.kek.enc-data-type',
    model: 'encDataType',
    default: '',
    ID: 'encDataType',
    readOnly: false,
    required: true,
    props: {
      options: encDataTypeOption
    }
  },
  {
    type: 'checkbox',
    label: 'ui.kek.alg',
    model: 'algorithm',
    default: '',
    ID: 'algorithm',
    readOnly: false,
    required: true,
    props: {
      options: algorithmOption
    },
    inputKeyupAction(val: string) {
      keySize.value = getkeySizeFilteredOptions(val)
    }
  },
  {
    type: 'checkbox',
    label: 'ui.kek.key-size',
    model: 'keySize',
    default: '',
    ID: 'keySize',
    readOnly: false,
    required: true,
    props: {
      options: keySizeOption
    }
  },
  {
    type: 'checkbox',
    label: 'ui.kek.mode',
    model: 'mode',
    default: '',
    ID: 'mode',
    readOnly: false,
    required: false,
    props: {
      options: modeOption
    },
    inputKeyupAction(val: string) {
      padding.value = getPaddingFilteredOptions(val)
    }
  },
  {
    type: 'checkbox',
    label: 'ui.kek.padding',
    model: 'padding',
    default: '',
    ID: 'padding',
    readOnly: false,
    required: false,
    props: {
      options: paddingOption
    }
  }
])
// Search condition configuration
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    readOnly: appStoreHook.organ == 'issuer',
    props: {
      options: issuerOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'text',
    label: 'ui.kek.key-alias',
    model: 'criteriaKeyAlias',
    default: '',
    maxlength: '64',
    props: {
      id: 'criteriaKeyAlias'
    }
  },
  {
    type: 'select',
    label: 'ui.kek.enc-data-type',
    model: 'criteriaEncDataType',
    default: '',
    props: {
      options: encDataTypeOptionQuery,
      id: 'criteriaEncDataType'
    }
  },
  {
    type: 'select',
    label: 'ui.kek.status',
    model: 'criteriaStatus',
    default: '',
    props: {
      options: kekStatusOption,
      id: 'criteriaStatus'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
