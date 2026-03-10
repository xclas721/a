<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.cardholder-device-binding')"
    @search="handleSearch"
  />

  <div class="border border-light-subtle" v-show="cardholderDTO.oid">
    <div class="header-title">{{ $t('ui.cardholder-status-information') }}</div>
    <div class="content-box p-3">
      <div class="row mb-3">
        <div :class="rowCol(group.length)" v-for="(group, index) in fields" :key="index">
          <span class="form-label d-block">{{ group.label }}</span>
          <span class="span-control">{{ group.value }}</span>
          <hr style="margin: 1% 0" />
        </div>
      </div>
    </div>
  </div>

  <div class="mt-3" v-show="cardholderDTO.oid && cardholderDeviceBindingVos.length > 0">
    <div class="header-title">{{ $t('ui.cardholder-device-binding.device') }}</div>
    <div class="panel panel-default panel-info">
      <div class="panel-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>{{ $t('ui.card-scheme.name') }}</th>
                <th>{{ $t('ui.card-data.pan') }}</th>
                <th>{{ $t('ui.cardholder-device-binding.device-advertising-id') }}</th>
                <th>{{ $t('ui.cardholder3DSAttempt.status') }}</th>
                <th>{{ $t('ui.operation') }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(result, index) in cardholderDeviceBindingVos" :key="index">
                <!-- Main card info row, always show -->
                <tr class="align-middle">
                  <td>{{ index + 1 }}</td>
                  <td>{{ result.uiCardScheme }}</td>
                  <td>
                    <a href="javascript:void(0)" @click="openDetail(result)">
                      {{ result.acctNumberMask }}
                    </a>
                  </td>
                  <td>
                    <template v-if="result.deviceBindingList && result.deviceBindingList.length > 0">
                      <a
                        href="javascript:void(0)"
                        class="transDetailLink"
                        @click="opentransDetailByAcsTransId(result.deviceBindingList[0].acsTransId)"
                      >
                        {{ result.deviceBindingList[0].deviceAdvertisingId }}
                      </a>
                    </template>
                  </td>
                  <td>
                    <template v-if="result.deviceBindingList && result.deviceBindingList.length > 0">
                      {{ $t('ui.cardholder-device-binding.status.' + result.deviceBindingList[0].status) }}
                    </template>
                  </td>
                  <td>
                    <template
                      v-if="
                        result.deviceBindingList &&
                        result.deviceBindingList.length > 0 &&
                        result.deviceBindingList[0].acsTransId
                      "
                    >
                      <button
                        class="btn btn-sm unbind-btn"
                        :disabled="result.deviceBindingList[0].isConfirming"
                        @click="unbindDevice(result.deviceBindingList[0], result.acctNumber)"
                      >
                        {{ $t('ui.mfa.authentication.qrcode.unbinding') }}
                      </button>
                      <i
                        v-if="result.deviceBindingList[0].isConfirming"
                        class="ri-error-warning-line ms-1"
                        :title="$t('ui.reconfirm.status.0')"
                      ></i>
                    </template>
                  </td>
                </tr>

                <!-- Remaining device binding rows -->
                <tr v-for="(list, listIndex) in getRemainingDeviceBindings(result)" :key="`${index}-${listIndex}`">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <a
                      href="javascript:void(0)"
                      class="transDetailLink"
                      @click="opentransDetailByAcsTransId(list.acsTransId)"
                    >
                      {{ list.deviceAdvertisingId }}
                    </a>
                  </td>
                  <td>{{ $t('ui.cardholder-device-binding.status.' + list.status) }}</td>
                  <td>
                    <template v-if="list.acsTransId">
                      <button
                        class="btn btn-sm unbind-btn"
                        :disabled="list.isConfirming"
                        @click="unbindDevice(list, result.acctNumber)"
                      >
                        {{ $t('ui.mfa.authentication.qrcode.unbinding') }}
                      </button>
                      <i
                        v-if="list.isConfirming"
                        class="ri-error-warning-line ms-1"
                        :title="$t('ui.reconfirm.status.0')"
                      ></i>
                    </template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <FormComponent
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @go-back="goBack"
    :form-data="formDetails"
  />
  <DetailDialog v-if="showDetail" v-model="showDetail" :detailData="detailData" :title="$t('ui.trans.log-detail')" />
</template>

<script setup lang="ts">
import QueryCriteriaComponent, { type CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import { computed, onMounted, ref } from 'vue'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import { useAppStoreHook } from '@/stores/app'
import { type BaseI18nSelect, type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { findAllIssuer } from '@/hooks/issuer'
import { findByCodeType } from '@/hooks/sysCode'
import swalMessage from '@/plugins/swalMessage'
import { getOptionsByValue, readOnlyALLSet, valOrNA } from '@/utils/util'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { useI18n } from 'vue-i18n'
import { enrollStatusOptionSelect, threedsStatusOptionSelect } from '@/utils/select/cardholder'
import DetailDialog from '@/views/common/trans/transaction_log/transDetail/DetailDialog.vue'

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const appStoreHook = useAppStoreHook()

const issuerOptions = computed(() => {
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})
const schemeOptions = ref<BaseI18nSelect[]>([])
const detailData = ref()
const showDetail = ref(false)
const formDetails = ref<Record<string, any>>({})
const formMask = ref()
const formTitle = ref('')
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
const { t } = useI18n()
const cardholderDTO = ref<Record<string, any>>({})
const cardholderDeviceBindingVos = ref<any[]>([])
const hasSearched = ref(false)

const rowCol = (lg: any) => {
  return 'col-md-' + lg
}

// Add function to get remaining device bindings
const getRemainingDeviceBindings = (result: any) => {
  if (!result.deviceBindingList || result.deviceBindingList.length <= 1) {
    return []
  }
  // Return all device bindings starting from the second element
  return result.deviceBindingList.slice(1)
}

// Add unbind function
const unbindDevice = async (deviceBinding: any, acctNumber: string) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', async function () {
    try {
      const params = {
        oid: deviceBinding.oid,
        acctNumber: acctNumber
      }

      const result = await apiUtil.post(`/cardholder_device_binding/delete`, params)

      if (result.success && result.code == '0000') {
        swalMessage.success(result.message)
        // Reload data
        await handleSearch(searchCriteria.value)
      } else {
        swalMessage.error(result.message)
      }
    } catch (error) {
      swalMessage.error(error instanceof Error ? error.message : String(error))
    }
  })
}

// Add function to open details via transaction ID
const opentransDetailByAcsTransId = async (acsTransId: string) => {
  const params = { acsTransId: acsTransId }
  const result = await apiUtil.get('/transaction/detail', params, {}, true)

  if (result.success && result.code == '0000') {
    detailData.value = { ...result.data }
    showDetail.value = true
  } else {
    await swalMessage.error(result.message)
  }
}

const fields = ref([
  {
    label: t('ui.issuer.name'),
    value: computed(() => getOptionsByValue(cardholderDTO.value.issuerOid, issuerOptions.value)),
    length: '4'
  },
  {
    label: t('ui.cardholder-data.name'),
    value: computed(() => valOrNA(cardholderDTO.value.cnName)),
    length: '4'
  },
  {
    label: t('ui.cardholder-data.idno'),
    value: computed(() => valOrNA(cardholderDTO.value.idno)),
    length: '4'
  }
])

// Modify fetchUserData function
const fetchUserData = async () => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }

  // Build request structure meeting backend requirements
  const requestData = {
    criteria: searchCriteria.value,
    page: {
      pageNumber: 1,
      pageSize: 100
    }
  }

  const result = await apiUtil.post('/cardholder_device_binding/query', requestData, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.error(result.message)
    return
  }

  // Update cardholder info
  cardholderDTO.value = result.data.cardholderVo ? result.data.cardholderVo : {}

  // Update device binding list
  cardholderDeviceBindingVos.value = result.data.cardholderDeviceBindingVos || []
  hasSearched.value = true
}

const openFrom = () => {
  if (formMask.value) {
    formMask.value.show()
  } else {
    console.error('FormComponent component is not ready yet')
  }
}

const goBack = () => {
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
  }
  formTitle.value = ''
}

const openDetail = async (formDate: Record<string, any>) => {
  formTitle.value = 'DETAIL'
  readOnlyALLSet(formConfig, true, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
  await findById(formDate)
}

const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  const result = await apiUtil.get('/cardholder_device_binding/detail', params, {}, true)
  if (result.success && result.code == '0000') {
    formDetails.value = {
      ...result.data
    }
    formDetails.value['acctNumber'] = result.data.acctNumberPrefix + 'XXXXXX' + result.data.acctNumberPostfix
    openFrom()
  } else {
    await swalMessage.error(result.message)
  }
}

const handleSearch = async (criteria: any) => {
  if (!criteria.issuerOid) {
    await swalMessage.error(t('warn.cardBin.bank-issuer-select'))
    return
  }
  if (!criteria.criteriaIdno && !criteria.criteriaAcctNumber && !criteria.criteriaMobilePhoneNumber) {
    await swalMessage.error(t('warn.cardholder-status.idno-or-acctNumber-not-null'))
    return
  }
  searchCriteria.value = { ...criteria }
  await fetchUserData()
}

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
    label: 'ui.cardholder-data.idno',
    model: 'criteriaIdno',
    default: '',
    maxlength: '64',
    props: {
      id: 'criteriaIdno'
    }
  },
  {
    type: 'text',
    label: 'ui.card-data.pan',
    model: 'criteriaAcctNumber',
    default: '',
    maxlength: '19',
    props: {
      id: 'criteriaAcctNumber'
    }
  },
  {
    type: 'text',
    label: 'ui.cardholder-data.mobile-phone-number',
    model: 'criteriaMobilePhoneNumber',
    default: '',
    maxlength: '20',
    props: {
      id: 'criteriaMobilePhoneNumber'
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
const issuerData = ref<BaseSelect[]>([])
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
  deleteQueryConfigData()
})
</script>

<style scoped>
.transDetailLink {
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
}

.transDetailLink:hover {
  color: #0056b3;
}

.table-responsive {
  overflow-x: auto;
}

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.panel-default {
  border-color: #ddd;
}

.panel-info {
  border-color: #bce8f1;
}

.panel-heading {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  color: #31708f;
  background-color: #d9edf7;
  border-color: #bce8f1;
}

.panel-body {
  padding: 15px;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #31708f;
}

.table {
  width: 100%;
  margin-bottom: 20px;
}

.table th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: bold;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

/* Unbind button style */
.unbind-btn {
  color: #007bff !important; /* Blue font */
  background-color: transparent !important;
  border: 1px solid #007bff !important; /* Blue border */
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
}

.unbind-btn:hover:not(:disabled) {
  color: white !important;
  background-color: #007bff !important; /* Blue background on hover */
  border-color: #0069d9 !important;
}

.unbind-btn:active:not(:disabled) {
  color: white !important;
  background-color: #0062cc !important;
  border-color: #005cbf !important;
  transform: translateY(1px);
}

.unbind-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Warning Icon Style */
.ri-error-warning-line {
  color: #ffc107;
  font-size: 1.2rem;
  vertical-align: middle;
}

.ms-1 {
  margin-left: 0.25rem;
}
</style>
