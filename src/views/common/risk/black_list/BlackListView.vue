<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.black-list')"
    @search="handleSearch"
    @update:criteria="onQueryCriteriaUpdate"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.black-list')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
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
import { findByCodeType } from '@/hooks/sysCode'
import { type BaseI18nSelect, type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { readOnlyALLSet, readOnlySet } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import { findAllIssuer } from '@/hooks/issuer'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/stores/app'
import { blackListRiskLevelOptionSelect } from '@/utils/select/blacklist'

const appStoreHook = useAppStoreHook()
const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const handleSearch = async (criteria: any) => {
  const payload = { ...criteria }
  if (
    criteria.criteriaItemType === ITEM_TYPE_BIN_MERCHANT &&
    (criteria.criteriaAcquirerBin || criteria.criteriaAcquirerMerchantId)
  ) {
    payload.criteriaItemValue = (criteria.criteriaAcquirerBin || '') + '+' + (criteria.criteriaAcquirerMerchantId || '')
  }
  searchCriteria.value = payload
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

/** When query item type is BIN+Merchant, show two criteria fields; otherwise show single item value */
function onQueryCriteriaUpdate(criteria: Record<string, any>) {
  const type = criteria.criteriaItemType
  const itemValueField = userQueryConfig.value.find((f) => f.model === 'criteriaItemValue')
  const binField = userQueryConfig.value.find((f) => f.model === 'criteriaAcquirerBin')
  const merchantField = userQueryConfig.value.find((f) => f.model === 'criteriaAcquirerMerchantId')
  if (itemValueField) itemValueField.hidden = type === ITEM_TYPE_BIN_MERCHANT
  if (binField) binField.hidden = type !== ITEM_TYPE_BIN_MERCHANT
  if (merchantField) merchantField.hidden = type !== ITEM_TYPE_BIN_MERCHANT
}

//riskLevel
const TypeOptions = ref<BaseI18nSelect[]>([])
const blackListRiskLevelOption = computed(() => [...optionSelect, ...blackListRiskLevelOptionSelect])
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
//options setting
const itemTypeOptions = computed(() => [...optionSelect, ...TypeOptions.value])
const issuerData = ref<BaseSelect[]>([])
const form = ref<any>({})
// Breadcrumb
const formTitle = ref('')
const formMask = ref() // Used to store reference to FormComponent
// Define custom buttons
// Selected item type for dynamic "blacklist content" field label (e.g. Cardholder IP, Acquirer BIN + Merchant ID)
const selectedItemTypeForLabel = ref('')

const ITEM_TYPE_BIN_MERCHANT = '02'

function updateItemValueMaskLabel() {
  const itemValueMaskField = formConfig.value.find((f) => f.model === 'itemValueMask')
  if (itemValueMaskField) {
    itemValueMaskField.label = selectedItemTypeForLabel.value
      ? `ui.black-list.item-value-label.${selectedItemTypeForLabel.value}`
      : 'ui.black-list.item-value'
  }
}

/** When item type is Acquirer BIN + Merchant ID, show two inputs; otherwise show single blacklist content field */
function updateItemType02FieldsVisibility() {
  const isBinMerchantAdd = formTitle.value === 'ADD' && selectedItemTypeForLabel.value === ITEM_TYPE_BIN_MERCHANT
  const itemValueMaskField = formConfig.value.find((f) => f.model === 'itemValueMask')
  const acquirerBinField = formConfig.value.find((f) => f.model === 'acquirerBin')
  const acquirerMerchantIdField = formConfig.value.find((f) => f.model === 'acquirerMerchantId')
  if (itemValueMaskField) itemValueMaskField.hide = isBinMerchantAdd
  if (acquirerBinField) acquirerBinField.hide = !isBinMerchantAdd
  if (acquirerMerchantIdField) acquirerMerchantIdField.hide = !isBinMerchantAdd
}

const customButtonList: CustomButton[] = [
  {
    label: 'btn.new',
    type: 'button',
    variant: 'primary',
    action: () => {
      if (formMask.value) {
        formTitle.value = 'ADD'
        readOnlySet(formConfig, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [], true)
        selectedItemTypeForLabel.value = ''
        updateItemValueMaskLabel()
        updateItemType02FieldsVisibility()
        formMask.value.show()
      } else {
        console.error('FormComponent component is not ready yet')
      }
    }
  }
]
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
 * Pagination query
 * @param page current page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  // When querying by BIN+Merchant (type 02), combine two fields into criteriaItemValue so backend can filter by hash
  const crit = searchCriteria.value
  if (
    crit.criteriaItemType === ITEM_TYPE_BIN_MERCHANT &&
    (crit.criteriaAcquirerBin || crit.criteriaAcquirerMerchantId)
  ) {
    crit.criteriaItemValue = (crit.criteriaAcquirerBin || '') + '+' + (crit.criteriaAcquirerMerchantId || '')
  }
  const result = await apiUtil.postSearchPage('/black_list/query', searchCriteria.value, page, {}, true)

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
  // Refresh form and page data
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    if (formTitle.value === 'DETAIL') {
      readOnlyALLSet(formConfig, false, ['issuerOid'])
    } else if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig, ['issuerOid', 'itemType', 'itemValueMask'], false)
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
  // Acquirer BIN + Merchant ID: merge with delimiter to avoid ambiguity (e.g. 12345678901+MERCHANT001)
  if (formDate.itemType === ITEM_TYPE_BIN_MERCHANT) {
    formDate.itemValueMask = (formDate.acquirerBin || '') + '+' + (formDate.acquirerMerchantId || '')
  }
  form.value = { ...formDate }
  if (formTitle.value == 'ADD') {
    const result = await apiUtil.post('/black_list/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    const result = await apiUtil.post('/black_list/edit', form.value, {}, true)
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
  readOnlyALLSet(formConfig, true, ['issuerOid'])
  await findById(formDate)
}
/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  readOnlySet(formConfig, ['issuerOid', 'itemType', 'itemValueMask'], true)
  await findById(formDate)
}
/**
 * Delete
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/black_list/delete?oid=${formDate['oid']}`, {}, {}, true)
      .then((result) => {
        swalMessage.success(result.message)
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
  const result = await apiUtil.get('/black_list/detail', params, {}, true)
  if (result.success && result.code == '0000') {
    formDetails.value = {
      ...result.data
    }
    selectedItemTypeForLabel.value = result.data.itemType || ''
    updateItemValueMaskLabel()
    updateItemType02FieldsVisibility()
  } else {
    await swalMessage.error(result.message)
    return
  }
  openFrom()
}
// Initialization trigger function
onMounted(async () => {
  TypeOptions.value = await findByCodeType('BLACK_LIST_ITEM_TYPE')

  issuerData.value = await findAllIssuer()
  deleteQueryConfigData()
})
// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerOptions.value])
  },
  {
    header: 'ui.black-list.item-type',
    field: 'itemType',
    colOptions: computed(() => [...itemTypeOptions.value])
  },
  {
    header: 'ui.black-list.item-value',
    field: 'itemValueMask'
  },
  {
    header: 'ui.black-list.risk-level',
    field: 'riskLevel',
    colOptions: computed(() => [...blackListRiskLevelOption.value])
  },
  {
    header: 'ui.black-list.memo',
    field: 'memo'
  },
  {
    header: 'ui.black-list.modify-time',
    field: 'updateDateTime',
    dateFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    header: 'ui.black-list.operator',
    field: 'operatorAccount'
  }
])
// Field order: left column = Issuer, Risk level, Memo; right column = Item type, Blacklist content (or BIN + Merchant ID when type 02)
const formConfig = ref<FormField[]>([
  // Left 1 - Issuer
  {
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    ID: 'issuerOid',
    readOnly: false,
    required: true,
    colNum: '6',
    props: { options: issuerOptions }
  },
  // Right 1 - Blacklist item type
  {
    type: 'checkbox',
    label: 'ui.black-list.item-type',
    model: 'itemType',
    default: '',
    ID: 'itemType',
    readOnly: false,
    required: true,
    colNum: '6',
    props: { options: itemTypeOptions },
    changeAction: (val: string) => {
      selectedItemTypeForLabel.value = val || ''
      updateItemValueMaskLabel()
      updateItemType02FieldsVisibility()
    }
  },
  // Left 2 - Risk level
  {
    type: 'checkbox',
    label: 'ui.black-list.risk-level',
    model: 'riskLevel',
    default: '',
    ID: 'riskLevel',
    readOnly: false,
    required: true,
    colNum: '6',
    props: { options: blackListRiskLevelOption }
  },
  // Right 2 - Blacklist content (Acquirer BIN) when type 02, or generic blacklist content
  {
    type: 'text',
    label: 'ui.black-list.item-value-label.bin',
    model: 'acquirerBin',
    default: '',
    ID: 'acquirerBin',
    readOnly: false,
    required: true,
    maxlength: '11',
    colNum: '6',
    hide: true,
    props: {}
  },
  {
    type: 'text',
    label: 'ui.black-list.item-value',
    model: 'itemValueMask',
    default: '',
    ID: 'itemValueMask',
    readOnly: false,
    required: true,
    maxlength: '50',
    colNum: '6',
    props: {}
  },
  // Left 3 - Memo
  {
    type: 'text',
    label: 'ui.black-list.memo',
    model: 'memo',
    default: '',
    ID: 'memo',
    readOnly: false,
    required: false,
    maxlength: '255',
    colNum: '6',
    props: {}
  },
  // Right 3 - Blacklist content (Merchant ID) when type 02 only
  {
    type: 'text',
    label: 'ui.black-list.item-value-label.merchant-id',
    model: 'acquirerMerchantId',
    default: '',
    ID: 'acquirerMerchantId',
    readOnly: false,
    required: true,
    maxlength: '35',
    colNum: '6',
    hide: true,
    props: {}
  }
])

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
    type: 'select',
    label: 'ui.black-list.item-type',
    model: 'criteriaItemType',
    default: '',
    props: {
      options: itemTypeOptions,
      id: 'criteriaItemType'
    }
  },
  {
    type: 'select',
    label: 'ui.black-list.risk-level',
    model: 'criteriaRiskLevel',
    default: '',
    props: {
      options: blackListRiskLevelOption,
      id: 'criteriaRiskLevel'
    }
  },
  {
    type: 'text',
    label: 'ui.black-list.item-value-label.bin',
    model: 'criteriaAcquirerBin',
    default: '',
    maxlength: '11',
    hidden: true,
    props: { id: 'criteriaAcquirerBin' }
  },
  {
    type: 'text',
    label: 'ui.black-list.item-value-label.merchant-id',
    model: 'criteriaAcquirerMerchantId',
    default: '',
    maxlength: '35',
    hidden: true,
    props: { id: 'criteriaAcquirerMerchantId' }
  },
  {
    type: 'text',
    label: 'ui.black-list.item-value',
    model: 'criteriaItemValue',
    default: '',
    maxlength: '50',
    props: { id: 'criteriaItemValue' }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
