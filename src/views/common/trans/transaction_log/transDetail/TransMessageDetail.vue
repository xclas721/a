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
  <!-- Transaction & Checkout Page Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">{{ $t('ui.trans.log.details.transactionCheckoutInfo') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in transactionCheckoutInfoFields" :key="index">
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
  <!-- Secure Payment Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">{{ $t('ui.trans.log.securePayment') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in securePaymentFields" :key="index">
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
  <!-- Browser Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">{{ $t('ui.trans.log.browserInfoes') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in browserInfoFields" :key="index">
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
  <!-- APP Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">{{ $t('ui.trans.log.sdkInfoes') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in sdkFields" :key="index">
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
  <!-- ACS Basic Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">{{ $t('ui.trans.log.basic.message') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in acsFields" :key="index">
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
    <div class="header-title">DS{{ $t('ui.trans.log.basic.message') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in dsFields" :key="index">
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
  <!-- 3DS Basic Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">3DS{{ $t('ui.trans.log.basic.message') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in threeDSFields" :key="index">
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

  <!-- Cardholder Billing Address Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">{{ $t('ui.trans.log.billingInfoes') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in billingFields" :key="index">
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

  <!-- Shipping Address Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">{{ $t('ui.trans.log.shippingInfoes') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in shippingFields" :key="index">
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
  <!-- Other Info -->
  <div class="col-md-12 mt-3">
    <div class="header-title">{{ $t('ui.trans.log.otherMessage') }}</div>
    <div class="content-box p-3">
      <div v-for="(fieldGroup, index) in otherMessageFields" :key="index">
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
import { computed, ref } from 'vue'
import { userStateStore } from '@/stores/user'
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'
import {
  acctTypeOptionSelect,
  acschallengeMandatedOptionSelect,
  acsUiTypeOptionSelect,
  addrMatchOptionSelect,
  authenticationMethodOptionSelect,
  authenticationTypeOptionSelect,
  challengeCancelOptionSelect,
  challengeCompletionIndOptionSelect,
  deviceChannelOptionSelect,
  messageVersionOptionSelect,
  resultsStatusOptionSelect,
  stmReasonOptionSelect,
  stmStateOptionSelect,
  threeDSCompIndOptionSelect,
  threeDSReqAuthMethodIndOptionSelect,
  threeDSRequestor3RIIndOptionSelect,
  threeDSRequestorChallengeIndOptionSelect,
  threeDSRequestorDecReqIndOptionSelect,
  threeDSRequestorNPAIndOptionSelect,
  transStatusI18nOptions,
  transStatusReasonOptionSelect,
  transTypeOptionSelect
} from '@/utils/select/transStatus'
import { messageCategoryOptionSelect } from '@/utils/select/challengeUi'

const props = defineProps<{
  data: Record<string, any>
}>()

const { t } = useI18n()
const detailsFields = ref([
  [
    {
      label: t('ui.trans.log.details.issuerName'),
      value: computed(() => valOrNA(props.data.issuerName))
    },
    {
      label: t('ui.trans.log.basic.ACSTransactionID'),
      value: computed(() => valOrNA(props.data.acsTransId))
    },
    {
      label: t('ui.trans.log.basic.transactionStatus'),
      value: computed(() => getOptionsByValue(props.data.transStatus, transStatusI18nOptions))
    }
  ],
  [
    {
      label: t('ui.trans.log.basic.cardholderAccountNumber'),
      value: computed(() => props.data.acctNumberPrefix + 'XXXXXX' + props.data.acctNumberPostfix)
    },
    {
      label: t('ui.trans.log.details.cardSchemeName'),
      value: computed(() => valOrNA(props.data.cardScheme))
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
    }
  ],
  [
    { label: t('ui.trans.log.details.eci'), value: computed(() => valOrNA(props.data.eci)) },
    {
      label: t('ui.trans.log.basic.errorCode'),
      value: computed(() => valOrNA(props.data.errorCode))
    },
    {
      label: t('ui.trans.log.details.errorComponent'),
      value: computed(() => valOrNA(props.data.errorComponent))
    }
  ],
  [
    {
      label: t('ui.trans.log.details.errorDescription'),
      value: computed(() => valOrNA(props.data.errorDescription))
    },
    {
      label: t('ui.trans.log.details.errorDetail'),
      value: computed(() => valOrNA(props.data.errorDetail))
    },
    {
      label: t('ui.trans.log.details.errorMessageType'),
      value: computed(() => valOrNA(props.data.errorMessageType))
    }
  ],
  [
    {
      label: t('ui.trans.log.details.messageCategory'),
      value: computed(() => getOptionsByValue(props.data.messageCategory, messageCategoryOptionSelect))
    },
    {
      label: t('ui.trans.log.details.messageVersionNumber'),
      value: computed(() => getOptionsByValue(props.data.messageVersion, messageVersionOptionSelect))
    },
    {
      label: t('ui.trans.log.details.resultsMessageStatus'),
      value: computed(() => getOptionsByValue(props.data.resultsStatus, resultsStatusOptionSelect))
    }
  ],
  [
    {
      label: t('ui.trans.log.basic.authenticationMethod'),
      value: computed(() => getOptionsByValue(props.data.authenticationMethod, authenticationMethodOptionSelect))
    },
    {
      label: t('ui.trans.log.details.authenticationType'),
      value: computed(() => getOptionsByValue(props.data.authenticationType, authenticationTypeOptionSelect))
    },
    {
      label: t('ui.trans.log.details.authenticationValue'),
      value: computed(() => valOrNA(props.data.authenticationValue))
    }
  ],
  [
    {
      label: t('ui.trans.log.basic.deviceChannel'),
      value: computed(() => getOptionsByValue(props.data.deviceChannel, deviceChannelOptionSelect))
    },
    {
      label: t('ui.trans.log.basic.stmState'),
      value: computed(() => getOptionsByValue(props.data.stmState, stmStateOptionSelect))
    },
    {
      label: t('ui.trans.log.basic.stmReason'),
      value: computed(() => getOptionsByValue(props.data.stmReason, stmReasonOptionSelect))
    }
  ]
])
// Transaction & Checkout Page Info
const transactionCheckoutInfoFields = ref([
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
      label: t('ui.trans.log.details.challengeCompletionInd'),
      value: computed(() => getOptionsByValue(props.data.challengeCompletionInd, challengeCompletionIndOptionSelect))
    }
  ],
  [
    {
      label: t('ui.trans.log.details.transType'),
      value: computed(() => getOptionsByValue(props.data.transType, transTypeOptionSelect))
    },
    {
      label: t('ui.trans.log.details.threeDSRequestorChallengeInd'),
      value: computed(() =>
        getOptionsByValue(props.data.threeDSRequestorChallengeInd, threeDSRequestorChallengeIndOptionSelect)
      )
    },
    {
      label: t('ui.trans.log.details.threeDSRequestorURL'),
      value: computed(() => valOrNA(props.data.threeDSRequestorURL))
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
  ],
  [
    { label: t('ui.trans.log.details.mcc'), value: computed(() => valOrNA(props.data.mcc)) },
    {
      label: t('ui.trans.log.basic.merchantCountryCode'),
      value: computed(() => valOrNA(props.data.merchantCountryCode))
    },
    {
      label: t('ui.trans.log.details.addrMatch'),
      value: computed(() => getOptionsByValue(props.data.addrMatch, addrMatchOptionSelect))
    }
  ],
  [
    {
      label: t('ui.trans.log.basic.instalmentPaymentData'),
      value: computed(() => valOrNA(props.data.instalmentPaymentData))
    },
    {
      label: t('ui.trans.log.details.notificationURL'),
      value: computed(() => valOrNA(props.data.notificationURL))
    },
    {
      label: t('ui.trans.log.basic.purchaseAmount'),
      value: computed(() => valOrNA(props.data.realPurchaseAmount))
    }
  ],
  [
    {
      label: t('ui.trans.log.details.purchaseExponent'),
      value: computed(() => valOrNA(props.data.purchaseExponent))
    },
    {
      label: t('ui.trans.log.basic.purchaseCurrency'),
      value: computed(() => valOrNA(props.data.purchaseCurrency))
    },
    {
      label: t('ui.trans.log.details.recurringExpiry'),
      value: computed(() => valOrNA(props.data.recurringExpiry))
    }
  ],
  [
    {
      label: t('ui.trans.log.details.recurringFrequency'),
      value: computed(() => valOrNA(props.data.recurringFrequency))
    },
    {
      label: t('ui.trans.log.details.accNumberPrefix'),
      value: computed(() => valOrNA(props.data.acctNumberPrefix))
    },
    {
      label: t('ui.trans.log.details.accNumberPostfix'),
      value: computed(() => valOrNA(props.data.acctNumberPostfix))
    }
  ],
  [
    {
      label: t('ui.trans.log.details.deviceUiInterface'),
      value: computed(() => valOrNA(props.data.deviceUiInterface))
    },
    {
      label: t('ui.trans.log.details.deviceUiType'),
      value: computed(() => valOrNA(props.data.deviceUiType))
    },
    {
      label: t('ui.trans.log.details.purchaseDate'),
      value: computed(() => valOrNA(props.data.purchaseDate))
    }
  ],
  [
    {
      label: t('ui.trans.log.details.oobCompletionInd'),
      value: computed(() => valOrNA(props.data.oobCompletionInd))
    },
    {
      label: t('ui.trans.log.details.transStatusReason'),
      value: computed(() => getOptionsByValue(props.data.transStatusReason, transStatusReasonOptionSelect))
    }
  ]
])
//<!-- Secure Payment Info -->
const securePaymentFields = ref([
  [
    {
      label: t('ui.trans.log.basic.cardholderName'),
      value: computed(() => valOrNA(props.data.cardholderName))
    },
    {
      label: t('ui.trans.log.basic.cardholderAccountIdentifier'),
      value: computed(() => valOrNA(props.data.cardholderAccountIdentifier))
    },
    {
      label: t('ui.trans.log.securePayment.cardExpirationDate'),
      value: computed(() => valOrNA(props.data.cardExpiryDateTime))
    }
  ],
  [
    {
      label: t('ui.trans.log.securePayment.acctType'),
      value: computed(() => getOptionsByValue(props.data.acctType, acctTypeOptionSelect))
    }
  ]
])
//<!-- Browser Info -->
const browserInfoFields = ref([
  [
    {
      label: t('ui.trans.log.browserInfoes.browserAcceptHeader'),
      value: computed(() => valOrNA(props.data.browserAcceptHeader))
    },
    {
      label: t('ui.trans.log.browserInfoes.browserIp'),
      value: computed(() => valOrNA(props.data.browserIp))
    },
    {
      label: t('ui.trans.log.browserInfoes.browserJavaEnabled'),
      value: computed(() => valOrNA(props.data.browserJavaEnabled))
    }
  ],
  [
    {
      label: t('ui.trans.log.browserInfoes.browserLanguage'),
      value: computed(() => valOrNA(props.data.browserLanguage))
    },
    {
      label: t('ui.trans.log.browserInfoes.browserColorDepth'),
      value: computed(() => valOrNA(props.data.browserColorDepth))
    },
    {
      label: t('ui.trans.log.browserInfoes.browserScreenHeight'),
      value: computed(() => valOrNA(props.data.browserScreenHeight))
    }
  ],
  [
    {
      label: t('ui.trans.log.browserInfoes.browserScreenWidth'),
      value: computed(() => valOrNA(props.data.browserScreenWidth))
    },
    {
      label: t('ui.trans.log.browserInfoes.browserTZ'),
      value: computed(() => valOrNA(props.data.browserTZ))
    },
    {
      label: t('ui.trans.log.browserInfoes.browserUserAgent'),
      value: computed(() => valOrNA(props.data.browserUserAgent))
    }
  ],
  [
    {
      label: t('ui.trans.log.browserInfoes.browserJavascriptEnabled'),
      value: computed(() => valOrNA(props.data.browserJavascriptEnabled))
    }
  ]
])
//<!-- APP Info -->
const sdkFields = ref([
  [
    { label: 'SDK App ID', value: computed(() => valOrNA(props.data.sdkAppID)) },
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
      label: t('ui.trans.log.browserInfoes.sdkMaxTimeout'),
      value: computed(() => valOrNA(props.data.sdkMaxTimeout))
    }
  ]
])
//<!-- ACS Basic Info -->
const acsFields = ref([
  [
    {
      label: t('ui.trans.log.acsOperatorId'),
      value: computed(() => valOrNA(props.data.acsOperatorId))
    },
    {
      label: t('ui.trans.log.acsReferenceNumber'),
      value: computed(() => valOrNA(props.data.acsReferenceNumber))
    },
    {
      label: t('ui.trans.log.details.deviceUiInterface'),
      value: computed(() => valOrNA(props.data.acsUiInterface))
    }
  ],
  [
    {
      label: t('ui.trans.log.details.deviceUiType'),
      value: computed(() => getOptionsByValue(props.data.acsUiType, acsUiTypeOptionSelect))
    },
    { label: 'ACS URL', value: computed(() => valOrNA(props.data.acsUrl)) },
    {
      label: t('ui.trans.log.acschallengeMandated'),
      value: computed(() => getOptionsByValue(props.data.acschallengeMandated, acschallengeMandatedOptionSelect))
    }
  ]
])
//<!-- DS Basic Info -->
const dsFields = ref([
  [
    {
      label: t('ui.trans.log.dsInfoes.dsReferenceNumber'),
      value: computed(() => valOrNA(props.data.dsReferenceNumber))
    },
    {
      label: t('ui.trans.log.dsInfoes.dsTransID'),
      value: computed(() => valOrNA(props.data.dsTransId))
    },
    { label: 'DS URL', value: computed(() => valOrNA(props.data.dsUrl)) }
  ]
])
//<!-- 3DS Basic Info -->
const threeDSFields = ref([
  [
    {
      label: t('ui.trans.log.basic.3DSServerTransactionID'),
      value: computed(() => valOrNA(props.data.threeDSServerTransId))
    },
    {
      label: t('ui.trans.log.threeDSRequestor3RIInd'),
      value: computed(() => getOptionsByValue(props.data.threeDSRequestor3RIInd, threeDSRequestor3RIIndOptionSelect))
    },
    {
      label: t('ui.trans.log.threeDSRequestorNPAInd'),
      value: computed(() => getOptionsByValue(props.data.threeDSRequestorAuthInd, threeDSRequestorNPAIndOptionSelect))
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
    { label: '3DS Server URL', value: computed(() => valOrNA(props.data.threeDSServerUrl)) }
  ],
  [
    {
      label: t('ui.trans.log.threeDSRequestorSessionData'),
      value: computed(() => valOrNA(props.data.threeDSSessionData))
    },
    {
      label: t('ui.trans.log.threeDSCompInd'),
      value: computed(() => getOptionsByValue(props.data.threeDSCompInd, threeDSCompIndOptionSelect))
    },
    {
      label: t('ui.trans.log.threeDSReqAuthMethodInd'),
      value: computed(() => getOptionsByValue(props.data.threeDSReqAuthMethodInd, threeDSReqAuthMethodIndOptionSelect))
    }
  ],
  [
    {
      label: t('ui.trans.log.threeDSRequestorDecReqInd'),
      value: computed(() =>
        getOptionsByValue(props.data.threeDSRequestorDecReqInd, threeDSRequestorDecReqIndOptionSelect)
      )
    },
    {
      label: t('ui.trans.log.threeDSRequestorDecMaxTime'),
      value: computed(() => valOrNA(props.data.threeDSRequestorDecMaxTime))
    },
    {
      label: t('ui.trans.log.acsDecConInd'),
      value: computed(() => valOrNA(props.data.acsDecConInd))
    }
  ],
  [
    {
      label: t('ui.trans.log.whiteListStatus'),
      value: computed(() => valOrNA(props.data.whiteListStatus))
    },
    {
      label: t('ui.trans.log.whiteListStatusSource'),
      value: computed(() => valOrNA(props.data.whiteListStatusSource))
    }
  ]
])
//<!-- Cardholder Billing Address Info -->
const billingFields = ref([
  [
    {
      label: t('ui.trans.log.billingInfoes.billAddrCity'),
      value: computed(() => valOrNA(props.data.billAddrCity))
    },
    {
      label: t('ui.trans.log.billingInfoes.billAddrCountry'),
      value: computed(() => valOrNA(props.data.billAddrCountry))
    },
    {
      label: t('ui.trans.log.billingInfoes.billAddrLine1'),
      value: computed(() => valOrNA(props.data.billAddrLine1))
    }
  ],
  [
    {
      label: t('ui.trans.log.billingInfoes.billAddrLine2'),
      value: computed(() => valOrNA(props.data.billAddrLine2))
    },
    {
      label: t('ui.trans.log.billingInfoes.billAddrLine3'),
      value: computed(() => valOrNA(props.data.billAddrLine3))
    },
    {
      label: t('ui.trans.log.billingInfoes.billAddrPostCode'),
      value: computed(() => valOrNA(props.data.billAddrPostCode))
    }
  ],
  [
    {
      label: t('ui.trans.log.billingInfoes.billAddrState'),
      value: computed(() => valOrNA(props.data.billAddrState))
    },
    {
      label: t('ui.trans.log.billingInfoes.email'),
      value: computed(() => valOrNA(props.data.email))
    }
  ]
])
//<!-- Shipping Address Info -->
const shippingFields = ref([
  [
    {
      label: t('ui.trans.log.shippingInfoes.AddrCity'),
      value: computed(() => valOrNA(props.data.shipAddrCity))
    },
    {
      label: t('ui.trans.log.shippingInfoes.AddrCountry'),
      value: computed(() => valOrNA(props.data.shipAddrCountry))
    },
    {
      label: t('ui.trans.log.shippingInfoes.AddrLine1'),
      value: computed(() => valOrNA(props.data.shipAddrLine1))
    }
  ],
  [
    {
      label: t('ui.trans.log.shippingInfoes.AddrLine2'),
      value: computed(() => valOrNA(props.data.shipAddrLine2))
    },
    {
      label: t('ui.trans.log.shippingInfoes.AddrLine3'),
      value: computed(() => valOrNA(props.data.shipAddrLine3))
    },
    {
      label: t('ui.trans.log.shippingInfoes.postalCode'),
      value: computed(() => valOrNA(props.data.shipAddrPostCode))
    }
  ],
  [
    {
      label: t('ui.trans.log.shippingInfoes.AddrState'),
      value: computed(() => valOrNA(props.data.shipAddrState))
    }
  ]
])
//<!-- Other Info -->
const otherMessageFields = ref([
  [
    {
      label: t('ui.trans.log.otherMessage.acsCounterAtoS'),
      value: computed(() => valOrNA(props.data.acsCounterAtoS))
    },
    {
      label: t('ui.trans.log.otherMessage.acsCounterStoA'),
      value: computed(() => valOrNA(props.data.acsCounterStoA))
    },
    {
      label: t('ui.trans.log.otherMessage.acsSignedContent'),
      value: computed(() => valOrNA(props.data.acsSignedContent))
    }
  ],
  [
    {
      label: t('ui.trans.log.otherMessage.resendCounter'),
      value: computed(() => valOrNA(props.data.resendCounter))
    },
    {
      label: t('ui.trans.log.otherMessage.challengeCancel'),
      value: computed(() => getOptionsByValue(props.data.challengeCancel, challengeCancelOptionSelect))
    },
    {
      label: t('ui.trans.log.otherMessage.payTokenInd'),
      value: computed(() => valOrNA(props.data.payTokenInd))
    }
  ],
  [
    {
      label: t('ui.trans.log.otherMessage.payTokenSource'),
      value: computed(() => valOrNA(props.data.payTokenSource))
    },
    {
      label: t('ui.trans.log.otherMessage.interactionCounter'),
      value: computed(() => valOrNA(props.data.interactionCounter))
    }
  ]
])
</script>
