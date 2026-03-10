<template>
  <div class="header-title">{{ $t('ui.trans.log.details') }}</div>
  <div class="content-box p-3">
    <div v-for="(fieldGroup, index) in detailsFields" :key="index">
      <div class="row mb-3">
        <div class="col-md-4" v-for="(field, i) in fieldGroup" :key="i">
          <span class="form-label d-block">{{ field.label }}</span>
          <span class="span-control">{{ field.value }}</span>
        </div>
      </div>
      <hr style="margin: 1% 0" />
    </div>
  </div>
  <!-- 3DS and Acquirer Basic Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">{{ $t('ui.abnormal.trans.log.3dsAndAcquirerMessage') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in threedsAndAcquirerMessage" :key="index">
        <div class="row mb-3">
          <div class="col-md-4" v-for="(field, i) in fieldGroup" :key="i">
            <span class="form-label d-block">{{ field.label }}</span>
            <span class="span-control">{{ field.value }}</span>
          </div>
        </div>
        <hr style="margin: 1% 0" />
      </div>
    </div>
  </div>
  <!-- DS Basic Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">DS {{ $t('ui.trans.log.basic.message') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in threedsMessage" :key="index">
        <div class="row mb-3">
          <div class="col-md-4" v-for="(field, i) in fieldGroup" :key="i">
            <span class="form-label d-block">{{ field.label }}</span>
            <span class="span-control">{{ field.value }}</span>
          </div>
        </div>
        <hr style="margin: 1% 0" />
      </div>
    </div>
  </div>
  <!-- Error Message -->
  <div class="col-md-12 mt-3">
    <div class="header-title">{{ $t('ui.abnormal.trans.log.errorMessage') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in errorMessage" :key="index">
        <div class="row mb-3">
          <div class="col-md-4" v-for="(field, i) in fieldGroup" :key="i">
            <span class="form-label d-block">{{ field.label }}</span>
            <span class="span-control">{{ field.value }}</span>
          </div>
        </div>
        <hr style="margin: 1% 0" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { dateFormat, getOptionsByValue, valOrNA } from '@/utils/util'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { findAllIssuer } from '@/hooks/issuer'

const props = defineProps<{
  data: Record<string, any>
}>()

const { t } = useI18n()
const detailsFields = ref([
  [
    {
      label: t('ui.trans.log.details.issuerName'),
      value: computed(() => getOptionsByValue(props.data.issuerOid, issuerData.value))
    },
    {
      label: t('ui.trans.log.basic.ACSTransactionID'),
      value: computed(() => valOrNA(props.data.acsTransId))
    },
    {
      label: t('ui.trans.log.basic.3DSServerTransactionID'),
      value: computed(() => valOrNA(props.data.threeDSServerTransId))
    }
  ],
  [
    {
      label: t('ui.trans.log.basic.deviceChannel'),
      value: computed(() => valOrNA(props.data.deviceChannel))
    },
    {
      label: t('ui.trans.log.details.messageCategory'),
      value: computed(() => valOrNA(props.data.messageCategory))
    },
    {
      label: t('ui.trans.log.details.messageVersionNumber'),
      value: computed(() => valOrNA(props.data.messageVersion))
    }
  ],
  [
    {
      label: 'SDK App ID',
      value: computed(() => valOrNA(props.data.sdkAppId))
    },
    {
      label: t('ui.trans.log.browserInfoes.sdkReferenceNumber'),
      value: computed(() => valOrNA(props.data.sdkReferenceNumber))
    },
    {
      label: t('ui.trans.log.browserInfoes.sdkTransactionID'),
      value: computed(() => valOrNA(props.data.sdkTransactionID))
    }
  ],
  [
    {
      label: t('ui.trans.log.details.cardSchemeName'),
      value: computed(() => valOrNA(props.data.cardScheme))
    },
    {
      label: t('ui.trans.log.basic.purchaseDate'),
      value: computed(() => dateFormat(props.data.purchaseDate))
    },
    {
      label: t('ui.trans.log.basic.cardholderAccountNumber'),
      value: computed(() => props.data.acctNumberPrefix + 'XXXXXX' + props.data.acctNumberPostfix)
    }
  ],
  [
    {
      label: t('ui.trans.log.basic.cardholderName'),
      value: computed(() => valOrNA(props.data.cardholderName))
    },
    {
      label: t('ui.trans.log.basic.cardholderAccountIdentifier'),
      value: computed(() => valOrNA(props.data.acctId))
    }
  ]
])
// 3DS and Acquirer Basic Info
const threedsAndAcquirerMessage = ref([
  [
    {
      label: t('ui.trans.log.details.threedsRequestorId'),
      value: computed(() => valOrNA(props.data.threeDSRequestorId))
    },
    {
      label: t('ui.trans.log.details.threedsRequestorName'),
      value: computed(() => valOrNA(props.data.threeDSRequestorName))
    },
    {
      label: '3DS Requestor URL',
      value: computed(() => valOrNA(props.data.threeDSRequestorUrl))
    }
  ],
  [
    {
      label: t('ui.trans.log.threeDSServerReferenceNumber'),
      value: computed(() => valOrNA(props.data.threeDSServerRefNumber))
    },
    {
      label: t('ui.trans.log.threeDSServerOperatorID'),
      value: computed(() => valOrNA(props.data.threeDSServerOperatorId))
    },
    {
      label: '3DS Server URL',
      value: computed(() => valOrNA(props.data.threeDSServerUrl))
    }
  ],
  [
    {
      label: t('ui.trans.log.basic.acquirerBin'),
      value: computed(() => valOrNA(props.data.acquirerBin))
    },
    {
      label: t('ui.trans.log.basic.acquirerMerchantId'),
      value: computed(() => valOrNA(props.data.acquirerMerchantId))
    },
    {
      label: t('ui.trans.log.details.merchantName'),
      value: computed(() => valOrNA(props.data.merchantName))
    }
  ]
])
//<!-- DS Basic Info -->
const threedsMessage = ref([
  [
    {
      label: t('ui.trans.log.dsInfoes.dsReferenceNumber'),
      value: computed(() => valOrNA(props.data.dsReferenceNumber))
    },
    {
      label: t('ui.trans.log.dsInfoes.dsTransID'),
      value: computed(() => valOrNA(props.data.dsTransId))
    }
  ]
])
//<!-- Error Message -->
const errorMessage = ref([
  [
    {
      label: t('ui.trans.log.basic.errorCode'),
      value: computed(() => valOrNA(props.data.errorCode))
    },
    {
      label: t('ui.trans.log.details.errorComponent'),
      value: computed(() => valOrNA(props.data.errorComponent))
    },
    {
      label: t('ui.trans.log.details.errorDescription'),
      value: computed(() => valOrNA(props.data.errorDescription))
    }
  ],
  [
    {
      label: t('ui.trans.log.details.errorMessageType'),
      value: computed(() => valOrNA(props.data.errorMessageType))
    },
    {
      label: t('ui.trans.log.details.errorDetail'),
      value: computed(() => valOrNA(props.data.errorDetail))
    }
  ]
])
const issuerData = ref<BaseSelect[]>([])
// Initialization trigger function
onMounted(async () => {
  issuerData.value = await findAllIssuer()
})
</script>
