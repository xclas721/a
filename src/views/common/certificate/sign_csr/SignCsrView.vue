<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.certificate-quest')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.certificate-quest')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="true"
    @delete-row="deleteRow"
    :custom-buttons="tableCustomButtonList"
    :btn-disable="disableBtn"
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
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import { findByCodeType } from '@/hooks/sysCode'
import { type BaseI18nSelect, type BaseSelect, defaultOptionSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { hideALLSet, readOnlyALLSet, readOnlySet } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import { findAllIssuer } from '@/hooks/issuer'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/stores/app'
import { enrollStatusOptionSelect, keyLengthOptionSelect, signAlgorithmOptionSelect } from '@/utils/select/signCsr'

const appStoreHook = useAppStoreHook()
const { t } = useI18n()
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

const tableCustomButtonList: TableCustomButton[] = [
  {
    label: 'btn.download',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      await apiUtil
        .downloadExcel(`/csr/download/${row.oid}`, {}, {}, true)
        .then(() => {
          console.log('file downloaded successfully.')
        })
        .catch((error) => {
          swalMessage.error(error)
        })
    },
    btnDisable: (row: any) => {
      return disableBtn(row)
    }
  }
]
//CardScheme
const schemeOptions = ref<BaseI18nSelect[]>([])

const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted'
    ? [...optionSelect, ...defaultOptionSelect, ...issuerData.value]
    : [...issuerData.value]
})
/**
 * Disable button
 * @param row current row
 */
const disableBtn = (row: Record<string, any>) => {
  return row.enrollStatus == '1'
}
// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
/**
 * Pagination query function
 * @param page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/csr/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
//options setting
const cardSchemeOptions = computed(() => [...optionSelect, ...schemeOptions.value])
const issuerData = ref<BaseSelect[]>([])
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
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
  deleteQueryConfigData()
  issuerData.value = await findAllIssuer()
})

const formMask = ref() // Used to store reference to FormComponent
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
const form = ref<any>({})
const formTitle = ref('')
/**
 * Close popup
 */
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    // Hide enrollStatus content field
    hideALLSet(formConfig, true, ['enrollStatus'])

    if (formTitle.value === 'DETAIL') {
      readOnlyALLSet(formConfig, false, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
    } else if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig, ['cardScheme'], false)
    }
    keyLength.value = [...keyLengthOptionSelect]
    signAlgorithm.value = [...signAlgorithmOptionSelect]
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}
/**
 * Submit表单函数
 * @param formDate form data
 */
const submit = async (formDate: any) => {
  form.value = { ...formDate }
  if (formTitle.value == 'ADD') {
    //call add API
    const result = await apiUtil.post('/csr/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(t('ui.message.add.success'))
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    //call edit API
    const result = await apiUtil.post('/csr/edit', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(t('ui.successfully.modified'))
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  }
  // Finally update table
  await handleSearch(searchCriteria.value)
}

const formDetails = ref<Record<string, any>>({})
/**
 * Open detail popup
 * @param formDate form data
 */
const openDetail = async (formDate: Record<string, any>) => {
  formTitle.value = 'DETAIL'
  // Show enrollStatus content field
  hideALLSet(formConfig, false, ['enrollStatus'])
  // Set other fields to read-only
  readOnlyALLSet(formConfig, true, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [])
  await findById(formDate)
}
/**
 * Delete function
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/csr/delete/${formDate['oid']}`, {}, {}, true)
      .then((result) => {
        if (result.success && result.code == '0000') {
          swalMessage.success(result.message)
        } else {
          swalMessage.error(result.message)
        }
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
 * Query detail function
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  // Fill data
  const result = await apiUtil.get(`/csr/detail/${formDate['oid']}`, {}, {}, true)
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

const keyLengthOption = computed(() => [...optionSelect, ...keyLength.value])
const signAlgorithmOption = computed(() => [...optionSelect, ...signAlgorithm.value])
const keyLength = ref([...keyLengthOptionSelect])
const signAlgorithm = ref([...signAlgorithmOptionSelect])
// Filter signature algorithm options
const getSignFilteredOptions = (selectedKey = '') => {
  if (!selectedKey) return signAlgorithmOptionSelect
  return selectedKey === '256'
    ? signAlgorithmOptionSelect.filter((opt) => opt.value.includes('ECDSA'))
    : signAlgorithmOptionSelect.filter((opt) => opt.value.includes('RSA'))
}
// Filter key length options
const getKeyFilteredOptions = (selectedSign = '') => {
  if (!selectedSign) return keyLengthOptionSelect
  return selectedSign.includes('RSA')
    ? keyLengthOptionSelect.filter((opt) => opt.value !== '256')
    : keyLengthOptionSelect.filter((opt) => opt.value === '256')
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
    header: 'ui.certificate-quest.key-alias',
    field: 'keyAlias',
    action: (row: Record<string, any>) => openDetail(row)
  },
  { header: 'ui.certificate-quest.key-length', field: 'keyLength' },
  { header: 'ui.certificate-quest.common-name', field: 'commonName' },
  { header: 'ui.certificate-quest.organization', field: 'organization' },
  { header: 'ui.certificate-quest.organization_unit', field: 'organizationUnit' },
  { header: 'ui.certificate-quest.country', field: 'country' },
  {
    header: 'ui.certificate-quest.enroll-status',
    field: 'enrollStatus',
    colOptions: computed(() => [...enrollStatusOptionSelect])
  }
])

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
    },
    // Check whether to show 'subjectAltName1', 'subjectAltName2', 'subjectAltName3' based on input result
    inputKeyupAction(val: string) {
      if (val == 'A') {
        hideALLSet(formConfig, false, ['subjectAltName1', 'subjectAltName2', 'subjectAltName3'])
      } else {
        hideALLSet(formConfig, true, ['subjectAltName1', 'subjectAltName2', 'subjectAltName3'])
      }
    }
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.key-alias',
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
    label: 'ui.certificate-quest.key-length',
    model: 'keyLength',
    default: '',
    ID: 'keyLength',
    readOnly: false,
    required: true,
    props: {
      options: keyLengthOption
    },
    inputKeyupAction(val: string) {
      signAlgorithm.value = getSignFilteredOptions(val)
    }
  },
  {
    type: 'checkbox',
    label: 'ui.certificate-quest.sign_algorithm',
    model: 'signAlgorithm',
    default: '',
    ID: 'signAlgorithm',
    readOnly: false,
    required: true,
    props: {
      options: signAlgorithmOption
    },
    inputKeyupAction(val: string) {
      keyLength.value = getKeyFilteredOptions(val)
    }
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.common-name',
    model: 'commonName',
    default: '',
    ID: 'commonName',
    readOnly: false,
    required: true,
    maxlength: '255',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.subject-alt-name1',
    model: 'subjectAltName1',
    default: '',
    ID: 'subjectAltName1',
    readOnly: false,
    required: false,
    hide: true,
    maxlength: '255',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.subject-alt-name2',
    model: 'subjectAltName2',
    default: '',
    ID: 'subjectAltName2',
    readOnly: false,
    required: false,
    hide: true,
    maxlength: '255',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.subject-alt-name3',
    model: 'subjectAltName3',
    default: '',
    ID: 'subjectAltName3',
    readOnly: false,
    required: false,
    hide: true,
    maxlength: '255',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.organization',
    model: 'organization',
    default: '',
    ID: 'organization',
    readOnly: false,
    required: true,
    maxlength: '255',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.organization_unit',
    model: 'organizationUnit',
    default: '',
    ID: 'organizationUnit',
    readOnly: false,
    required: false,
    maxlength: '255',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.country',
    model: 'country',
    default: '',
    ID: 'country',
    readOnly: false,
    required: true,
    maxlength: '2',
    placeholder: 'ui.placeholder.country',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.province',
    model: 'province',
    default: '',
    ID: 'province',
    readOnly: false,
    required: false,
    maxlength: '255',
    placeholder: 'ui.placeholder.alphabetic',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.locality',
    model: 'locality',
    default: '',
    ID: 'locality',
    readOnly: false,
    required: false,
    maxlength: '255',
    placeholder: 'ui.placeholder.alphabetic',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.certificate-quest.file-name',
    model: 'fileName',
    default: '',
    ID: 'fileName',
    readOnly: false,
    required: true,
    maxlength: '255',
    placeholder: 'ui.placeholder.alphabetic',
    props: {}
  },
  {
    type: 'checkbox',
    label: 'ui.certificate-quest.enroll-status',
    model: 'enrollStatus',
    default: '',
    ID: 'enrollStatus',
    readOnly: true, // Always read-only
    hide: true,
    required: false,
    props: {
      options: enrollStatusOptionSelect
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
  {
    type: 'text',
    label: 'ui.certificate-quest.common-name',
    model: 'criteriaCommonName',
    default: '',
    props: {
      id: 'criteriaCommonName'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
