<template>
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.ds-issuer-cert.management')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.ds-issuer-cert.management')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :custom-buttons="tableCustomButtonList"
  />

  <FormComponent
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    @reset-form-btn="resetFormBtn"
    :form-data="formDetails"
  />

  <FormComponent
    ref="detailForm"
    :form-config="detailFormConfig"
    :title="formTitle"
    @go-back="detailGoBack"
    :form-data="formDetails"
  />

  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div style="max-width: 30%; margin: 7rem auto">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('ui.ds-issuer-cert.private-key-management') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-coreui-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="p-3">
            <div class="rounded m-0 t-16 row">
              <div class="col-md-12">
                <div class="order-0 mb-2">
                  <label for="recipient" class="col-form-label">{{ $t('ui.ds-issuer-cert.set-password') }}:</label>
                  <input type="password" class="form-control" v-model="recipient" maxlength="255" />
                </div>
              </div>

              <div class="col-md-12">
                <div class="order-0 mb-2">
                  <label for="recipient" class="col-form-label">{{ $t('ui.ds-issuer-cert.check-password') }}:</label>
                  <input type="password" class="form-control" v-model="checkRecipient" maxlength="255" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2 mb-2 d-flex justify-content-end me-3">
          <button type="button" @click="closeModal" class="btn btn-secondary btn-sm">
            <span class="mx-2">{{ $t('btn.cancel') }}</span>
          </button>
          <button type="button" @click="callExport" class="btn btn-primary btn-sm me-2">
            <span class="mx-2">{{ $t('btn.export') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QueryCriteriaComponent, {
  type CriteriaField,
  type CustomButton
} from '@/components/query/QueryCriteriaComponent.vue'
import { computed, onMounted, ref } from 'vue'
import { userStateStore } from '@/stores/user'
import { type BaseI18nSelect, type BaseSelect, defaultOptionSelect, optionSelect } from '@/utils/select/baseSelect'
import { useAppStoreHook } from '@/stores/app'
import { findAllIssuer } from '@/hooks/issuer'
import { findByCodeType } from '@/hooks/sysCode'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { fileToBase64, hideALLSet, readOnlyALLSet } from '@/utils/util'
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import { credentialStatusOptionSelect, keyLengthOptionSelect, signAlgorithmOptionSelect } from '@/utils/select/signCsr'
import swalMessage from '@/plugins/swalMessage'
import ApiUtil from '@/utils/apiUtils'
import { enableORDisableOptions } from '@/utils/select/cardBin'
import { certEncodeOptionSelect } from '@/utils/select/certLoad'

const userState = userStateStore()
const appStoreHook = useAppStoreHook()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const formMask = ref()
const maskSpace = ref()
const detailForm = ref()
const formTitle = ref('')
const showFlag = ref(false)
const recipient = ref('')
const checkRecipient = ref('')
const exportOid = ref('')
const dispalyCss = computed(() => {
  return showFlag.value ? `display:block;background:rgba(0,0,0,0.7);` : `display:none;background:rgba(0,0,0,0.7);`
})
const customButtonList: CustomButton[] = [
  {
    label: 'btn.upload',
    type: 'button',
    variant: 'primary',
    action: () => {
      if (formMask.value) {
        readOnlyALLSet(formConfig, false, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
        formTitle.value = 'UPLOAD'
        formMask.value.show()
      } else {
        console.error('FormComponent component is not ready yet')
      }
    }
  }
]
const tableCustomButtonList: TableCustomButton[] = [
  {
    label: 'btn.setup',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      const result = await apiUtil.post(`/ds_certificate_management/enable/${row.oid}`, {}, {}, true)
      if (result.success && result.code == '0000') {
        await swalMessage.success(result.message)
      } else {
        await swalMessage.error(result.message)
      }
      await handleSearch(searchCriteria.value)
    },
    btnShow(param) {
      return hideBtn(param)
    }
  },
  {
    label: 'btn.export',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      showFlag.value = true
      exportOid.value = row.oid
    }
  }
]
/**
 * Call export interface
 */
const callExport = async () => {
  const param = {
    oid: exportOid.value,
    recipient: recipient.value,
    checkRecipient: checkRecipient.value
  }
  await apiUtil
    .downloadExcel(`/ds_certificate_management/export`, param, {}, true)
    .then((result) => {
      if (result.success) {
        console.log('file downloaded successfully.', result)
        closeModal()
      } else {
        swalMessage.error(result.message)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

/**
 * Close popup
 */
const closeModal = () => {
  showFlag.value = false
  recipient.value = ''
  checkRecipient.value = ''
}
/**
 * Hide button
 * @param row current row
 */
const hideBtn = (row: Record<string, any>) => {
  return row.status != '1'
}
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const handleSearch = async (criteria: any) => {
  if (criteria.notBefore) {
    // Complete time part, e.g. "2025-03-06" -> "2025-03-06T00:00:00Z"
    criteria.notBefore = new Date(criteria.notBefore).toISOString()
  }
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}
const formDetails = ref<Record<string, any>>({})
/**
 * Submit
 * @param formDate form
 */
const submit = async (formDate: any) => {
  formDate['fileContent'] = await fileToBase64(formDate['signatureCer'])
  //call add API
  const result = await apiUtil.post('/ds_certificate_management/upload', formDate, {}, true)
  if (result.success && result.code == '0000') {
    await swalMessage.success(result.message)
    goBack()
  } else {
    await swalMessage.error(result.message)
    return
  }
  await handleSearch(searchCriteria.value)
}
/**
 * Open popup function
 */
const openFrom = () => {
  if (detailForm.value) {
    detailForm.value.show()
  } else {
    console.error('FormComponent component is not ready yet')
  }
}
/**
 * Pagination query function
 * @param page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/ds_certificate_management/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
/**
 * Close detail popup
 */
const detailGoBack = () => {
  //page date refresh
  if (detailForm.value) {
    detailForm.value.hide()
    formDetails.value = {}
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}
/**
 * Close popup
 */
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    hideALLSet(formConfig, true, ['recipient'])
    if (formTitle.value === 'UPLOAD') {
      readOnlyALLSet(formConfig, true, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
    }
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}
const resetFormBtn = () => {
  hideALLSet(formConfig, true, ['recipient'])
}
const schemeOptions = ref<BaseI18nSelect[]>([])
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted'
    ? [...optionSelect, ...defaultOptionSelect, ...issuerData.value]
    : [...issuerData.value]
})
const cardSchemeOptions = computed(() => [...optionSelect, ...schemeOptions.value])
const enableORDisable = computed(() => [...optionSelect, ...enableORDisableOptions])
const certEncodeOptions = computed(() => [...optionSelect, ...certEncodeOptionSelect])
const keyLengthOption = computed(() => [...optionSelect, ...keyLengthOptionSelect])
const signAlgorithmOption = computed(() => [...optionSelect, ...signAlgorithmOptionSelect])
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
  // Fill data
  const result = await apiUtil.get(`/ds_certificate_management/detail/${formDate['oid']}`, {}, {}, true)
  if (result.success && result.code == '0000') {
    // Update formDetails value
    formDetails.value = result.data
  } else {
    await swalMessage.error(result.message)
    return
  }
  // Open window
  openFrom()
}

// header: table header; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerOptions.value])
  },
  {
    header: 'ui.card-scheme.name',
    field: 'cardScheme',
    colOptions: computed(() => [...schemeOptions.value])
  },
  {
    header: 'ui.issuer-cert.Signature-key-base-code-recognition',
    field: 'keyAlias',
    action: (row: Record<string, any>) => openDetail(row)
  },
  { header: 'ui.certificate-quest.common-name', field: 'subjectCn' },
  { header: 'ui.ca-cert-certificate-cert-issuer-cn', field: 'certIssuerCn' },
  { header: 'ui.issuer-cert.validity-period', field: 'validPeriod' },
  {
    header: 'ui.issuer-cert.credential-status',
    field: 'status',
    colOptions: computed(() => [...credentialStatusOptionSelect])
  }
])

const detailFormConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    ID: 'issuerOid',
    readOnly: true,
    required: true,
    colNum: '12',
    props: {
      options: issuerOptions
    }
  },
  {
    type: 'checkbox',
    label: 'ui.card-scheme.name',
    model: 'cardScheme',
    default: '',
    ID: 'cardScheme',
    readOnly: true,
    required: true,
    colNum: '12',
    props: {
      options: cardSchemeOptions
    }
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.key-alias',
    model: 'keyAlias',
    default: '',
    ID: 'keyAlias',
    readOnly: true,
    required: true,
    maxlength: '64',
    colNum: '12',
    props: {}
  },
  {
    type: 'checkbox',
    label: 'ui.certificate-quest.key-length',
    model: 'keyLength',
    default: '',
    ID: 'keyLength',
    readOnly: true,
    required: true,
    colNum: '12',
    props: {
      options: keyLengthOption
    }
  },
  {
    type: 'text',
    label: 'ui.ca-cert-certificate-cert-issuer',
    model: 'certIssuer',
    default: '',
    ID: 'certIssuer',
    readOnly: true,
    required: true,
    maxlength: '255',
    colNum: '12',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.ca-cert-certificate-subject',
    model: 'subject',
    default: '',
    ID: 'subject',
    readOnly: true,
    required: true,
    maxlength: '255',
    colNum: '12',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.ca-cert-certificate-serial-number',
    model: 'serialNumber',
    default: '',
    ID: 'serialNumber',
    readOnly: true,
    required: true,
    maxlength: '255',
    colNum: '12',
    props: {}
  },
  {
    type: 'checkbox',
    label: 'ui.certificate-quest.sign_algorithm',
    model: 'signAlgorithm',
    default: '',
    ID: 'signAlgorithm',
    readOnly: true,
    required: true,
    colNum: '12',
    props: {
      options: signAlgorithmOption
    }
  },
  {
    type: 'text',
    label: 'ui.ca-cert-certificate-valid-period',
    model: 'validPeriod',
    default: '',
    ID: 'validPeriod',
    readOnly: true,
    required: true,
    maxlength: '255',
    colNum: '12',
    props: {}
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
    required: true,
    props: {
      options: issuerOptions
    }
  },
  {
    type: 'checkbox',
    label: 'ui.card-scheme.name',
    model: 'cardScheme',
    default: '',
    ID: 'cardScheme',
    readOnly: false,
    required: true,
    props: {
      options: cardSchemeOptions
    }
  },
  {
    type: 'text',
    label: 'ui.issuer-cert.Signature-key-base-code-recognition',
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
    label: 'ui.issuer-cert.Signature-certificate-format',
    model: 'certEncode',
    default: '',
    ID: 'certEncode',
    readOnly: false,
    required: true,
    props: {
      options: certEncodeOptions
    },
    // Check whether to show 'subjectAltName1', 'subjectAltName2', 'subjectAltName3' based on input result
    inputKeyupAction(val: string) {
      if (val == '3') {
        hideALLSet(formConfig, false, ['recipient'])
      } else {
        hideALLSet(formConfig, true, ['recipient'])
      }
    }
  },
  {
    type: 'text',
    label: 'ui.issuer-cert.p12-password',
    model: 'recipient',
    default: '',
    ID: 'recipient',
    readOnly: false,
    required: true,
    hide: true,
    maxlength: '64',
    props: {}
  },
  {
    type: 'file',
    label: 'ui.issuer-cert.Signature-open-the-certificate-file',
    model: 'signatureCer',
    default: '',
    ID: 'signatureCer',
    readOnly: false,
    required: true,
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
  // <!-- (2)Card Scheme -->
  {
    type: 'select',
    label: 'ui.card-scheme.name',
    model: 'cardScheme',
    default: '',
    props: {
      // Use computed to switch language
      options: cardSchemeOptions,
      id: 'cardScheme'
    }
  },
  // <!-- (3)Certificate Status -->
  {
    type: 'select',
    label: 'ui.issuer-cert.credential-status',
    model: 'status',
    default: '',
    props: {
      // Use computed to switch language
      options: enableORDisable,
      id: 'status'
    }
  },
  {
    type: 'date',
    label: 'ui.issuer-cert.validity-period',
    model: 'notBefore',
    default: '',
    props: {
      id: 'notBefore'
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
