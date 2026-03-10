<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent :criteriaConfig="userQueryConfig" :title="$t('ui.cardholder-data')" @search="handleSearch" />

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

  <div class="mt-3" v-show="cardholderDTO.oid">
    <div class="header-title">{{ $t('ui.cardholder-status-card') }}</div>
    <DataTableCardHolder
      :title="$t('ui.cardholder-data')"
      :columns="searchResultsHeader"
      :fetchData="fetchUserData"
      :operation-btn-detail="true"
      :operation-btn-update="false"
      :operation-btn-delete="false"
      @open-detail="openDetail"
      :page-hide="true"
      ref="tableRef"
    />
  </div>

  <FormComponent
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @go-back="goBack"
    :form-data="formDetails"
  />
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
import { DateTime } from 'luxon'
import { dateFormat, getOptionsByValue, readOnlyALLSet, valOrNA } from '@/utils/util'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { useI18n } from 'vue-i18n'
import { cardStatusOptionSelect, enrollStatusOptionSelect, threedsStatusOptionSelect } from '@/utils/select/cardholder'
import DataTableCardHolder from '@/components/dataTable/DataTableCardHolder.vue'

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const appStoreHook = useAppStoreHook()

const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})
const schemeOptions = ref<BaseI18nSelect[]>([])

const formDetails = ref<Record<string, any>>({})
const formMask = ref() // Used to store reference to FormComponent
const formTitle = ref('')
// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })

const { t } = useI18n()

const cardholderDTO = ref<Record<string, any>>({})
const fields = ref<Record<string, any>>([
  {
    label: t('ui.issuer.name'),
    value: computed(() => getOptionsByValue(cardholderDTO.value.issuerOid, issuerOptions.value)),
    length: '2'
  },
  {
    label: t('ui.cardholder-data.name'),
    value: computed(() => valOrNA(cardholderDTO.value.cnName)),
    length: '2'
  },
  {
    label: t('ui.cardholder-data.idno'),
    value: computed(() => valOrNA(cardholderDTO.value.idno)),
    length: '3'
  },
  {
    label: t('ui.cardholder-status-threeds-status'),
    value: computed(() => getOptionsByValue(cardholderDTO.value.threedsStatus, threedsStatusOptionSelect)),
    length: '3'
  },
  {
    label: t('ui.cardholder-data.lock-expiry-date'),
    value: computed(() =>
      valOrNA(
        dateFormat(
          cardholderDTO.value.lockExpiryDateTime,
          'yyyy-MM-dd HH:mm:ss',
          userState.user?.timeZone || DateTime.local().zoneName
        )
      )
    ),
    length: '2'
  }
])

const rowCol = (lg: any) => {
  return 'col-md-' + lg
}

const show = ref(0)
/**
 * Pagination query function
 * @param page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/cardholder/query', searchCriteria.value, page, {}, true)
  // Add early return check
  if (show.value === 0) {
    return { data: [], totalItems: 0 }
  }
  if (!(result.success && result.code == '0000')) {
    await swalMessage.error(result.message)
  }
  cardholderDTO.value = result.data.cardholderVo ? result.data.cardholderVo : {}
  return {
    data: result.data ? result.data.cardDataVos : [],
    totalItems: result.data ? result.data.cardDataVos.length : 0
  }
}

/**
 * Open popup function
 */
const openFrom = () => {
  if (formMask.value) {
    formMask.value.show()
  } else {
    console.error('FormComponent component is not ready yet')
  }
}
/**
 * Close popup
 */
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    if (formTitle.value === 'DETAIL') {
      readOnlyALLSet(formConfig, false, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
    }
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}

/**
 * Open detail popup
 * @param formDate form data
 */
const openDetail = async (formDate: Record<string, any>) => {
  formTitle.value = 'DETAIL'
  // Define ID list to update
  readOnlyALLSet(formConfig, true, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
  await findById(formDate)
}

/**
 * Query detail function
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/cardholder/detail', params, {}, true)
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
  openFrom()
}
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTableCardHolder> | null>(null)
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
  if (show.value == 0) {
    show.value++
  }
  if (tableRef.value) {
    await tableRef.value.fetchPageData()
  }
}

const searchResultsHeader = ref<any>([
  {
    header: 'ui.card-scheme.name',
    field: 'uiCardScheme'
  },
  { header: 'ui.card-data.pan', field: 'acctNumber' },
  {
    header: 'ui.card-data.enroll-status',
    field: 'enrollStatus',
    colOptions: enrollStatusOptionSelect
  },
  {
    header: 'ui.card-data.threeds-status',
    field: 'threedsStatus',
    colOptions: threedsStatusOptionSelect
  },
  {
    header: 'ui.card-data.status',
    field: 'status',
    colOptions: cardStatusOptionSelect
  },
  {
    header: 'ui.card-data.lock-expiry-date',
    field: 'lockExpiryDateTime',
    dateFormat: 'yyyy-MM-dd HH:mm:ss'
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
  deleteQueryConfigData()
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
})
</script>
