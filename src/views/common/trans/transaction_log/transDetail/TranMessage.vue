<template>
  <div class="header-title">{{ $t('ui.trans.log-trading.message') }}</div>
  <div class="content-box p-3">
    <!-- Use v-for to generate content for each row, each row contains three fields -->
    <div v-for="(group, index) in groupedFields" :key="index">
      <div class="row mb-3">
        <div
          class="col-md-4"
          v-for="field in group"
          :key="field.label"
          :class="{ 'text-blue': Number(index) === 0 || Number(index) === 1 }"
        >
          <span class="form-label d-block">{{ field.label }}</span>
          <span class="span-control">{{ field.value }}</span>
        </div>
      </div>
      <hr style="margin: 1% 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { dateFormat, getOptionsByValue, valOrNA } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { userStateStore } from '@/stores/user'
import { DateTime } from 'luxon'
import {
  authenticationMethodOptionSelect,
  deviceChannelOptionSelect,
  stmReasonOptionSelect,
  stmStateOptionSelect
} from '@/utils/select/transStatus'

const props = defineProps<{
  data: Record<string, any>
}>()

const { t } = useI18n()
const fields = ref([
  {
    label: t('ui.trans.log.basic.cardholderAccountIdentifier'),
    value: computed(() => valOrNA(props.data.acctId))
  },
  {
    label: t('ui.trans.log.basic.cardholderName'),
    value: computed(() => valOrNA(props.data.cardholderName))
  },
  { label: t('ui.trans.log.basic.evaluationResult'), value: computed(() => evaluationResult()) },
  {
    label: t('ui.trans.log.basic.cardholderAccountNumber'),
    value: computed(() => valOrNA(props.data.acctNumber))
  },
  {
    label: t('ui.trans.log.basic.stmState'),
    value: computed(() => getOptionsByValue(props.data.stmState, stmStateOptionSelect))
  },
  {
    label: t('ui.trans.log.basic.stmReason'),
    value: computed(() => getOptionsByValue(props.data.stmReason, stmReasonOptionSelect))
  },
  {
    label: t('ui.trans.log.basic.deviceChannel'),
    value: computed(() => getOptionsByValue(props.data.deviceChannel, deviceChannelOptionSelect))
  },
  {
    label: t('ui.trans.log.basic.trading.date.time'),
    value: computed(() =>
      dateFormat(
        props.data.createDateTime,
        'yyyy-MM-dd HH:mm:ss',
        userStateStore().user?.timeZone || DateTime.local().zoneName
      )
    )
  },
  {
    label: t('ui.trans.log.basic.purchaseAmount'),
    value: computed(() => valOrNA(props.data.realPurchaseAmount))
  },
  {
    label: t('ui.trans.log.basic.purchaseCurrency'),
    value: computed(() => valOrNA(props.data.purchaseCurrencyAlphabeticCode))
  },
  {
    label: t('ui.trans.log.basic.authenticationMethod'),
    value: computed(() => getOptionsByValue(props.data.authenticationMethod, authenticationMethodOptionSelect))
  },
  {
    label: t('ui.trans.log.basic.acquirerBin'),
    value: computed(() => valOrNA(props.data.acquirerBin))
  },
  {
    label: t('ui.trans.log.basic.acquirerMerchantId'),
    value: computed(() => valOrNA(props.data.acquirerMerchantId))
  },
  {
    label: t('ui.trans.log.basic.merchantCountryCode'),
    value: computed(() => valOrNA(props.data.merchantCountryCode))
  },
  {
    label: t('ui.trans.log.basic.instalmentPaymentData'),
    value: computed(() => valOrNA(props.data.purchaseInstalData))
  },
  { label: t('ui.trans.log.basic.billAddr'), value: computed(() => billAddr()) },
  { label: t('ui.trans.log.basic.shipAddr'), value: computed(() => shipAddr()) },
  {
    label: t('ui.trans.log.basic.3DSServerTransactionID'),
    value: computed(() => valOrNA(props.data.threeDSServerTransId))
  },
  {
    label: t('ui.trans.log.basic.DSTransactionID'),
    value: computed(() => valOrNA(props.data.dsTransId))
  },
  {
    label: t('ui.trans.log.basic.ACSTransactionID'),
    value: computed(() => valOrNA(props.data.acsTransId))
  },
  {
    label: t('ui.trans.log.details.authenticationValue'),
    value: computed(() => valOrNA(props.data.authenticationValue))
  },
  {
    label: t('ui.trans.log.basic.transactionStatus'),
    value: computed(() => valOrNA(props.data.transStatus))
  },
  {
    label: t('ui.trans.log.basic.errorCode'),
    value: computed(() => valOrNA(props.data.errorCode))
  },
  {
    label: t('ui.trans.log.basic.creqPageOnloadDateTime'),
    value: computed(() =>
      valOrNA(
        dateFormat(
          props.data.creqPageOnloadDateTime,
          'yyyy-MM-dd HH:mm:ss',
          userStateStore().user?.timeZone || DateTime.local().zoneName
        )
      )
    )
  }
])

// Split fields array into groups of three
const groupedFields: Record<string, any> = []
for (let i = 0; i < fields.value.length; i += 3) {
  groupedFields.push(fields.value.slice(i, i + 3))
}

function evaluationResult() {
  let str = ''
  if (props.data.riskAssesmentResult) {
    str = t('ui.trans.log.risk-method.' + props.data.riskAssesmentMethod) + '-'
    if (props.data.riskAssesmentResult) {
      str = str + t('ui.trans.log.reskAssesmentResult.' + props.data.riskAssesmentResult)
    }
    str = str + '(' + props.data.riskItemType + ':'
    if (props.data.riskAssesmentMethod == '02' || props.data.riskAssesmentMethod == '03') {
      str = str + t('ui.black-list.itemType.' + props.data.riskItemType)
    } else if (props.data.riskAssesmentMethod == '05' && props.data.riskItemType == '25') {
      str = str + t('ui.mc-rba.reason-code-' + props.data.riskItemType)
    } else {
      str = str + t('ui.trans.log.riskAssesmentReason.' + props.data.riskItemType)
    }
    str = str + ')'
  } else {
    return 'N/A'
  }
  return str
}

function billAddr() {
  if (props.data.billAddrLine1 && props.data.billAddrLine2 && props.data.billAddrLine3) {
    return props.data.billAddrLine1 + props.data.billAddrLine2 + props.data.billAddrLine3
  }
  return 'N/A'
}

function shipAddr() {
  if (props.data.shipAddrLine1 && props.data.shipAddrLine2 && props.data.shipAddrLine3) {
    return props.data.shipAddrLine1 + props.data.shipAddrLine2 + props.data.shipAddrLine3
  }
  return 'N/A'
}
</script>
