<template>
  <div>
    <QueryCriteriaComponent
      :criteriaConfig="userQueryConfig"
      :title="$t('trans.log.query')"
      @search="handleSearch"
      :customButtons="customButtonList"
    />

    <!-- Display search results -->
    <TransDataTable
      ref="tableRef"
      title="$t('trans.log.query')"
      :fetchData="fetchUserData"
      :issuer-options="issuerOptions"
      :acs-trans-id-action="openDetail"
      :pan-action="openCardholderDetail"
      :currency-data="currencyData"
    />

    <DetailDialog v-if="showDetail" v-model="showDetail" :detailData="detailData" :title="$t('ui.trans.log-detail')" />

    <FormComponent ref="formMask" :form-config="formConfig" :title="title" @go-back="goBack" :form-data="formDetails" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import ApiUtil from '@/utils/apiUtils'
import {
  authenticationMethodOptionSelect,
  authPayCredStatusOptionSelect,
  dafAdviceOptionSelect,
  deviceChannelOptionSelect,
  enterFrictionlessOptionSelect,
  fraudOptionSelect,
  messageVersionOptionSelect,
  recvDsErrorMsgIndOptionSelect,
  riskAssessmentMethodOptionSelect,
  stmReasonOptionSelect,
  stmStateOptionSelect,
  transStatusI18nOptions
} from '@/utils/select/transStatus'
import DetailDialog from '@/views/common/trans/transaction_log/transDetail/DetailDialog.vue'
import swalMessage from '@/plugins/swalMessage'
import { userStateStore } from '@/stores/user'
import { type BaseI18nSelect, type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { useAppStoreHook } from '@/stores/app'
import { findAllIssuer } from '@/hooks/issuer'
import { findByCodeType } from '@/hooks/sysCode'
import { messageCategoryOptionSelect } from '@/utils/select/challengeUi'
import TransDataTable from '@/views/common/trans/transaction_log/TransDataTable.vue'
import { useTimeCalculations } from '@/utils/util'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { enrollStatusOptionSelect, threedsStatusOptionSelect } from '@/utils/select/cardholder'
import { DateTime } from 'luxon'

const formDetails = ref<Record<string, any>>({})
const formMask = ref() // 用于存储 FormComponent 组件的引用
const { getEndDate, getStartDate } = useTimeCalculations()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const appStoreHook = useAppStoreHook()
const tableData = ref([])
const route = useRoute()
// Search results are stored here
const showDetail = ref(false)
const detailData = ref({})
const title = ref('')
const saveCheckedFraud = ref<string[]>([])
// Create reference to child component
const tableRef = ref<InstanceType<typeof TransDataTable> | null>(null)
// Define custom buttons
const customButtonList: CustomButton[] = [
  {
    label: 'btn.export', // export
    type: 'button',
    variant: 'primary',
    action: () => {
      console.log('Exporting data...')
      apiUtil
        .downloadExcel('/transaction/export', searchCriteria.value, {})
        .then(() => {
          console.log('Excel file downloaded successfully.')
        })
        .catch((error) => {
          console.error('Error downloading Excel:', error)
        })
    }
  },
  {
    label: 'ui.visa-rba.btn.mark.fraud', // Export
    type: 'button',
    variant: 'primary',
    action: async () => {
      const checked: string[] = []
      for (const item of tableData.value as Array<Record<string, any>>) {
        if (item.fraud === 'Y') {
          checked.push(item.oid)
        }
      }
      const param = {
        saveCheckedFraud: saveCheckedFraud.value.join(','),
        checked: checked
      }
      const result = await apiUtil.post('/transaction/markFraud', param, {}, true)
      if (result.success && result.code == '0000') {
        saveCheckedFraud.value = []
        await swalMessage.success(result.message)
      } else {
        await swalMessage.error(result.message)
      }
    }
  }
]

/**
 * Close popup
 */
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    title.value = ''
  } else {
    console.error('FormComponent component is not ready yet')
  }
}

/**
 * Open detail popup
 * @param formDate form data
 */
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
const openDetail = async (row: Record<string, any>) => {
  disablePageScroll()
  detailData.value = row
  showDetail.value = true
}
// Handle the search criteria emitted by the QueryCriteria component
const handleSearch = (criteria: any) => {
  console.log('Search criteria received:', criteria)

  searchCriteria.value = criteria
  if (tableRef.value) {
    tableRef.value.currentPage = 1
  }
}
// Handle time range passed from URL parameters
const getUrlTimeParam = (paramName: string) => {
  const param = route.query[paramName]
  if (param && typeof param === 'string') {
    // Convert timestamp to date format
    const timestamp = Number.parseInt(param)
    if (!Number.isNaN(timestamp)) {
      return DateTime.fromMillis(timestamp).toFormat('yyyy-MM-dd HH:mm:ss')
    }
  }
  return null
}

const searchCriteria = ref<any>({
  issuerOid: userState.user.issuerOid,
  endDate: getUrlTimeParam('to_time') || getEndDate,
  startDate: getUrlTimeParam('from_time') || getStartDate,
  acsTransID: route.query.acsTransID || '',
  stmReason: route.query.stateMachineReason || ''
})

// Function to fetch data for the current page
const fetchUserData = async (page: number) => {
  const result = await apiUtil.postSearchPage('/transaction/query', searchCriteria.value, page, {}, true)
  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  for (const item of result.data.content as Array<Record<string, any>>) {
    if (item.fraud === 'Y' && !saveCheckedFraud.value.includes(item.oid)) {
      saveCheckedFraud.value.push(item.oid)
    }
  }
  tableData.value = result.data.content
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

// Disable page scrolling
function disablePageScroll() {
  document.body.style.overflow = 'hidden'
}

const schemeOptions = ref<BaseI18nSelect[]>([])
const transStatusReasonOptionSelect = ref<BaseI18nSelect[]>([])
const issuerData = ref<BaseSelect[]>([])
const currencyData = ref<BaseSelect[]>([])
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
  transStatusReasonOptionSelect.value = await findByCodeType('TRANS_STATUS_REASON')

  const result = await apiUtil.get('/currency/findAll', {}, {}, true)
  if (result.success && result.code == '0000') {
    for (const code of result.data) {
      currencyData.value.push({
        value: code.numericCode ?? '',
        text: code.alphabeticCode ?? ''
      })
    }
  }

  document.body.style.overflow = ''
})
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})
const cardSchemeOptions = computed(() => [...optionSelect, ...schemeOptions.value])
const transStatusReasonOption = computed(() => [...optionSelect, ...transStatusReasonOptionSelect.value])
const messageVersionOption = computed(() => [...optionSelect, ...messageVersionOptionSelect])
const transStatusI18nSelect = computed(() => [...optionSelect, ...transStatusI18nOptions])
const deviceChannelOption = computed(() => [...optionSelect, ...deviceChannelOptionSelect])
const messageCategoryOption = computed(() => [...optionSelect, ...messageCategoryOptionSelect])
const frictionlessTypeOption = computed(() => [...optionSelect, ...riskAssessmentMethodOptionSelect])
const enterFrictionlessOption = computed(() => [...optionSelect, ...enterFrictionlessOptionSelect])
const authenticationMethodOption = computed(() => [...optionSelect, ...authenticationMethodOptionSelect])
const stmStateOption = computed(() => [...optionSelect, ...stmStateOptionSelect])
const stmReasonOption = computed(() => [...optionSelect, ...stmReasonOptionSelect])
const recvDsErrorMsgIndOption = computed(() => [...optionSelect, ...recvDsErrorMsgIndOptionSelect])
const authPayCredStatusOption = computed(() => [...optionSelect, ...authPayCredStatusOptionSelect])
const dafAdviceOption = computed(() => [...optionSelect, ...dafAdviceOptionSelect])
const fraudOption = computed(() => [...optionSelect, ...fraudOptionSelect])

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
    // <!-- (2)Transaction start date -->
    type: 'date',
    label: 'ui.trans.log.start.date',
    model: 'startDate',
    default: getUrlTimeParam('from_time') || getStartDate,
    startDateFlag: true,
    props: {
      id: 'startDate'
    }
  },
  {
    // <!-- (3)Transaction end date -->
    type: 'date',
    label: 'ui.trans.log.end.date',
    model: 'endDate',
    default: getUrlTimeParam('to_time') || getEndDate,
    endDateFlag: true,
    props: {
      id: 'endDate'
    }
  },
  // <!-- (4)Card Scheme -->
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
  },
  // <!-- (5)Message Version -->
  {
    type: 'select',
    label: 'message.version',
    model: 'messageVersion',
    default: '',
    props: {
      options: messageVersionOption,
      id: 'messageVersion'
    }
  },
  // <!-- (6)Device Channel -->
  {
    type: 'select',
    label: 'device.channel',
    model: 'deviceChannel',
    default: '',
    props: {
      options: deviceChannelOption,
      id: 'deviceChannel'
    }
  },
  {
    // <!-- (7)ACS Transaction Sequence Number -->
    type: 'text',
    label: 'acs.trans.id',
    model: 'acsTransID',
    default: route.query.acsTransID || '',
    props: {
      id: 'acsTransID'
    }
  },
  {
    // <!-- (8)3DS Server Transaction Sequence Number -->
    type: 'text',
    label: '3ds.server.trans.id',
    model: 'threeDSServerTransID',
    default: '',
    props: {
      id: 'threeDSServerTransID'
    }
  },
  {
    // <!-- (9)Validation Result -->
    type: 'select',
    label: 'ui.trans.log.trans.status',
    model: 'transStatus',
    default: '',
    props: {
      options: transStatusI18nSelect,
      id: 'transStatus'
    }
  },
  {
    // <!-- (11)First 6 digits of card number -->
    type: 'text',
    label: 'ui.trans.log.acct.number.prefix',
    model: 'acctNumberPrefix',
    default: '',
    props: {
      id: 'acctNumberPrefix'
    }
  },
  {
    // <!-- (12)Last 4 digits of card number -->
    type: 'text',
    label: 'ui.trans.log.acct.number.postfix',
    model: 'acctNumberPostfix',
    default: '',
    props: {
      id: 'acctNumberPostfix'
    }
  },
  {
    // <!-- (13)Merchant ID -->
    type: 'text',
    label: 'ui.trans.log.acquirer.merchant.id',
    model: 'acquirerMerchantID',
    default: '',
    props: {
      id: 'acquirerMerchantID'
    }
  },
  {
    //<!-- (15)Message Category -->
    type: 'select',
    label: 'ui.trans.messageCategory',
    model: 'messageCategory',
    default: '',
    props: {
      options: messageCategoryOption,
      id: 'messageCategory'
    }
  },
  {
    //<!-- (16)FrictionlessType -->
    type: 'select',
    label: 'ui.trans.frictionlessType',
    model: 'frictionlessType',
    default: '',
    props: {
      options: frictionlessTypeOption,
      id: 'frictionlessType'
    }
  },
  {
    // <!-- (17)Is Frictionless -->
    type: 'select',
    label: 'ui.trans.frictionlessOrNot',
    model: 'enterFrictionless',
    default: '',
    props: {
      options: enterFrictionlessOption,
      id: 'enterFrictionless'
    }
  },
  {
    // <!-- (27) authenticationMethod Validation Method -->
    type: 'select',
    label: 'ui.trans.log.basic.authenticationMethod',
    model: 'authenticationMethod',
    default: '',
    props: {
      options: authenticationMethodOption,
      id: 'authenticationMethod'
    }
  },
  {
    // <!-- (18) Transaction Processing Status -->
    type: 'select',
    label: 'ui.trans.log.stmState',
    model: 'stmState',
    default: '',
    props: {
      options: stmStateOption,
      id: 'stmState'
    }
  },
  {
    // <!-- (19) Transaction Processing Status -->
    type: 'select',
    label: 'ui.trans.log.stmReason',
    model: 'stmReason',
    default: route.query.stateMachineReason || '',
    props: {
      options: stmReasonOption,
      id: 'stmReason'
    }
  },
  {
    //<!-- (20)Reason code -->
    type: 'select',
    label: 'ui.trans.log.transStatusReason',
    model: 'transStatusReason',
    default: '',
    props: {
      options: transStatusReasonOption,
      id: 'transStatusReason'
    }
  },
  {
    // <!-- (22)DS Transaction Sequence Number -->
    type: 'text',
    label: 'ds.trans.id',
    model: 'dsTransID',
    default: '',
    props: {
      id: 'dsTransID'
    }
  },
  {
    // <!-- (23)DS Return Error Flag -->
    type: 'select',
    label: 'ui.trans.log.recvDsErrorMsgInd',
    model: 'recvDsErrorMsgInd',
    default: '',
    props: {
      options: recvDsErrorMsgIndOption,
      id: 'recvDsErrorMsgInd'
    }
  },
  {
    //<!-- (24) Authenticated Payment Credential Status -->
    type: 'select',
    label: 'ui.trans.log.daf.authPayCredStatus',
    model: 'authPayCredStatus',
    default: '',
    props: {
      options: authPayCredStatusOption,
      id: 'authPayCredStatus'
    }
  },
  {
    //<!-- (25) DAF Advice -->
    type: 'select',
    label: 'ui.trans.log.daf.dafAdvice',
    model: 'dafAdvice',
    default: '',
    props: {
      options: dafAdviceOption,
      id: 'dafAdvice'
    }
  },
  {
    // <!-- (26) Fraud -->
    type: 'select',
    label: 'ui.trans.log.fraud',
    model: 'fraud',
    default: '',
    props: {
      options: fraudOption,
      id: 'fraud'
    }
  },
  {
    // <!-- (27)Card Number -->
    type: 'text',
    label: 'ui.card-data.pan',
    model: 'acctNumber',
    default: '',
    props: {
      id: 'acctNumber'
    }
  }
])

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
      options: issuerOptions
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
</script>

<style scoped>
/* Add your styles here */
</style>
