<template>
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.menu.visa_vpp_query')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <VisaVppQueryTable
    ref="tableRef"
    :title="$t('ui.menu.visa_vpp_query')"
    :fetchData="fetchUserData"
    :currency-data="currencyData"
    :acs-trans-id-action="openDetail"
    :pan-action="openCardholderDetail"
    :vpp-step-options="vppStepColOptions"
    :visa-vpp-indicator-options="visaVppIndicatorColOptions"
    :trans-status-options="transStatusI18nOptions"
    :risk-assessment-method-options="riskAssessmentMethodOptionSelect"
  />

  <DetailDialog v-if="showDetail" v-model="showDetail" :detailData="detailData" :title="$t('ui.trans.log-detail')" />

  <FormComponent ref="formMask" :form-config="formConfig" :title="title" @go-back="goBack" :form-data="formDetails" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import VisaVppQueryTable from '@/views/common/ext/visa_vpp_query/VisaVppQueryTable.vue'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useAppStoreHook } from '@/stores/app'
import { useTimeCalculations } from '@/utils/util'
import { findAllIssuer } from '@/hooks/searchConditions'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { findByCodeType } from '@/hooks/sysCode'
import { type BaseI18nSelect } from '@/utils/select/baseSelect'
import { transStatusI18nOptions, riskAssessmentMethodOptionSelect } from '@/utils/select/transStatus'
import DetailDialog from '@/views/common/trans/transaction_log/transDetail/DetailDialog.vue'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { enrollStatusOptionSelect, threedsStatusOptionSelect } from '@/utils/select/cardholder'

const { getEndDate, getStartDate } = useTimeCalculations()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const appStoreHook = useAppStoreHook()
const issuerOptions = ref<BaseSelect[]>([])
const transStatusReasonOptions = ref<BaseI18nSelect[]>([])
const currencyData = ref<BaseSelect[]>([])
const showDetail = ref(false)
const detailData = ref({})
const title = ref('')
const formDetails = ref<Record<string, any>>({})
const formMask = ref<InstanceType<typeof FormComponent> | null>(null)

// VPP transaction type options
const vppStepOptions = computed(() => [
  ...optionSelect,
  { value: '1a', i18nText: 'ui.trans.log.vpp.vppStep.1a' },
  { value: '1b', i18nText: 'ui.trans.log.vpp.vppStep.1b' },
  { value: '2', i18nText: 'ui.trans.log.vpp.vppStep.2' }
])

// VPP transaction indicator options
const visaVppIndicatorOptions = computed(() => [
  ...optionSelect,
  { value: '01', i18nText: 'ui.trans.log.vpp.vppIndicator.01' },
  { value: '02', i18nText: 'ui.trans.log.vpp.vppIndicator.02' },
  { value: '03', i18nText: 'ui.trans.log.vpp.vppIndicator.03' }
])

// VPP Step Options (for colOptions)
const vppStepColOptions = computed(() => [
  { value: '1a', i18nText: 'ui.trans.log.vpp.vppStep.1a' },
  { value: '1b', i18nText: 'ui.trans.log.vpp.vppStep.1b' },
  { value: '2', i18nText: 'ui.trans.log.vpp.vppStep.2' }
])

// VPP Indicator Options (for colOptions)
const visaVppIndicatorColOptions = computed(() => [
  { value: '01', i18nText: 'ui.trans.log.vpp.vppIndicator.01' },
  { value: '02', i18nText: 'ui.trans.log.vpp.vppIndicator.02' },
  { value: '03', i18nText: 'ui.trans.log.vpp.vppIndicator.03' }
])

const issuerSelectOptions = computed(() => [...optionSelect, ...issuerOptions.value])

const formConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    ID: 'issuerOid',
    readOnly: true,
    required: false,
    colNum: '12',
    props: {
      options: issuerSelectOptions
    }
  },
  {
    type: 'text',
    label: 'ui.cardholder-data.credit-card-pan',
    model: 'acctNumber',
    default: '',
    ID: 'acctNumber',
    readOnly: true,
    required: false,
    colNum: '12',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.cardholder-data.cn-name',
    model: 'cnName',
    default: '',
    ID: 'cnName',
    readOnly: true,
    required: false,
    colNum: '12',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.cardholder-data.idnumber',
    model: 'idno',
    default: '',
    ID: 'idno',
    readOnly: true,
    required: false,
    colNum: '12',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.cardholder-data.email',
    model: 'email',
    default: '',
    ID: 'email',
    readOnly: true,
    required: false,
    colNum: '12',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.card-data.expiry-date',
    model: 'expiryDateTime',
    default: '',
    ID: 'expiryDateTime',
    readOnly: true,
    required: false,
    colNum: '12',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.cardholder-data.mobile-phone-number',
    model: 'mobilePhoneNumber',
    default: '',
    ID: 'mobilePhoneNumber',
    readOnly: true,
    required: false,
    colNum: '12',
    props: {}
  },
  {
    type: 'checkbox',
    label: 'ui.card-data.enroll-status',
    model: 'enrollStatus',
    default: '',
    ID: 'enrollStatus',
    readOnly: true,
    required: false,
    colNum: '12',
    props: {
      options: enrollStatusOptionSelect
    }
  },
  {
    type: 'checkbox',
    label: 'ui.card-data.threeds-status',
    model: 'threedsStatus',
    default: '',
    ID: 'threedsStatus',
    readOnly: true,
    required: false,
    colNum: '12',
    props: {
      options: threedsStatusOptionSelect
    }
  }
])

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

onMounted(async () => {
  issuerOptions.value = await findAllIssuer()
  transStatusReasonOptions.value = await findByCodeType('TRANS_STATUS_REASON')
  // Get currency data
  const result = await apiUtil.get('/currency/findAll', {}, {}, true)
  if (result.success && result.code == '0000') {
    for (const code of result.data) {
      currencyData.value.push({
        value: code.numericCode ?? '',
        text: code.alphabeticCode ?? ''
      })
    }
  }
  deleteQueryConfigData()
  document.body.style.overflow = ''
})

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer-adm.issuer',
    model: 'issuerOid',
    default: appStoreHook.organ == 'issuer' ? userState.user.issuerOid : '',
    props: {
      options: issuerSelectOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'date',
    label: 'ui.trans.log.start.date',
    model: 'startDate',
    default: getStartDate,
    startDateFlag: true,
    props: {
      id: 'startDate'
    }
  },
  {
    type: 'date',
    label: 'ui.trans.log.end.date',
    model: 'endDate',
    default: getEndDate,
    endDateFlag: true,
    props: {
      id: 'endDate'
    }
  },
  {
    type: 'select',
    label: 'ui.trans.log.vpp.vppStep',
    model: 'vppStep',
    default: '',
    props: {
      options: vppStepOptions,
      id: 'vppStep'
    }
  },
  {
    type: 'select',
    label: 'ui.trans.log.vpp.vppIndicator',
    model: 'visaVppIndicator',
    default: '',
    props: {
      options: visaVppIndicatorOptions,
      id: 'visaVppIndicator'
    }
  },
  {
    type: 'text',
    label: 'acs.trans.id',
    model: 'acsTransID',
    default: '',
    props: {
      id: 'acsTransID'
    }
  },
  {
    type: 'text',
    label: 'ds.trans.id',
    model: 'dsTransID',
    default: '',
    props: {
      id: 'dsTransID'
    }
  },
  {
    type: 'text',
    label: 'acct.number',
    model: 'acctNumber',
    default: '',
    props: {
      id: 'acctNumber'
    }
  }
])

// Reactivity needed to refresh table
const searchCriteria = ref<any>({
  issuerOid: appStoreHook.organ == 'issuer' ? userState.user.issuerOid : '',
  endDate: getEndDate,
  startDate: getStartDate
})

// Create reference to child component
const tableRef = ref<InstanceType<typeof VisaVppQueryTable> | null>(null)

// Define custom buttons
const customButtonList: CustomButton[] = [
  {
    label: 'btn.export',
    type: 'button',
    variant: 'primary',
    action: () => {
      console.log('Exporting VPP data...')
      apiUtil
        .downloadExcel('/visaVppQuery/export', searchCriteria.value, {})
        .then(() => {
          console.log('Excel file downloaded successfully.')
        })
        .catch((error) => {
          console.error('Error downloading Excel:', error)
        })
    }
  }
]

// Disable page scrolling
function disablePageScroll() {
  document.body.style.overflow = 'hidden'
}

// Open details
const openDetail = async (row: Record<string, any>) => {
  // Call API to check permission first to avoid blank dialog due to insufficient permission
  const result = await apiUtil.get('/transaction/baseMessage', { acsTransId: row.acsTransId }, {}, true)
  if (result.success && result.code == '0000') {
    disablePageScroll()
    detailData.value = row
    showDetail.value = true
  } else {
    await swalMessage.error(result.message)
    return
  }
}

// Close popup
const goBack = () => {
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    title.value = ''
  } else {
    console.error('FormComponent component is not ready yet')
  }
}

// Open cardholder details
const openCardholderDetail = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { acsTransId: formDate['acsTransId'] }
  // Fill data
  const result = await apiUtil.get('/transaction/getCardholder', params, {}, true)
  if (result.success && result.code == '0000') {
    // Update formDetails value
    formDetails.value = {
      ...result.data
    }
    formDetails.value['acctNumber'] = result.data.acctNumberPrefix + 'XXXXXX' + result.data.acctNumberPostfix
  } else {
    await swalMessage.error(result.message)
    return
  }
  // Open window
  if (formMask.value) {
    title.value = 'DETAIL'
    formMask.value.show()
  } else {
    console.error('FormComponent component is not ready yet')
  }
}

const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
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
  const result = await apiUtil.postSearchPage('/visaVppQuery/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
</script>
