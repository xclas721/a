<template>
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.password-policy')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />

  <DataTable
    ref="tableRef"
    :title="$t('ui.password-policy')"
    :columns="searchResultsHeader"
    :fetchData="fetchData"
    :operation-btn-detail="true"
    :operation-btn-update="true"
    @open-detail="openDetail"
    @open-update="openUpdate"
  />

  <PasswordPolicyFormView
    ref="formMask"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    :form-data-detail="formDetails"
    :issuer-data="issuerData"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import PasswordPolicyFormView from '@/views/hosted/system/password_policy/PasswordPolicyFormView.vue'
import ApiUtil from '@/utils/apiUtils'
import { findAllIssuer } from '@/hooks/issuer'
import swalMessage from '@/plugins/swalMessage'
import { useAppStoreHook } from '@/stores/app'
import { optionSelect } from '@/utils/select/baseSelect'

const appStoreHook = useAppStoreHook()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

// Issuer Bank Data
const issuerData = ref<any[]>([])
const tableRef = ref()
const formMask = ref()
const formTitle = ref('')
const formDetails = ref<Record<string, any>>({})
const searchCriteria = ref<Record<string, any>>({})

// Add Hosted option to display Hosted default settings
const hostedOption = {
  value: '00000',
  i18nText: 'ui.rba.default'
}

const issuerOptions = computed(() => {
  // Convert issuerData to BaseI18nSelect format
  const convertedIssuerData = issuerData.value.map((item: any) => ({
    value: item.value,
    i18nText: item.text // Use text as i18nText
  }))

  return appStoreHook.organ == 'hosted'
    ? [optionSelect[0], hostedOption, ...convertedIssuerData]
    : [...convertedIssuerData]
})

// Query criteria配置
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: '', // Default empty string, query all records
    props: {
      options: issuerOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'select',
    label: 'ui.issuer-param.mfa',
    model: 'mfaInd',
    default: '',
    props: {
      options: [
        { value: '', i18nText: 'ui.option-select' },
        { value: '0', i18nText: 'ENABLED.0' },
        { value: '1', i18nText: 'ENABLED.1' }
      ],
      id: 'mfaInd'
    }
  },
  {
    type: 'select',
    label: 'ui.password-policy.fido-enabled',
    model: 'fidoEnabled',
    default: '',
    props: {
      options: [
        { value: '', i18nText: 'ui.option-select' },
        { value: '0', i18nText: 'ENABLED.0' },
        { value: '1', i18nText: 'ENABLED.1' }
      ],
      id: 'fidoEnabled'
    }
  }
])

// List Field Configuration
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerOptions.value])
  },
  {
    header: 'ui.issuer-param.mfa',
    field: 'mfaInd',
    colOptions: [
      { value: '0', i18nText: 'ENABLED.0' },
      { value: '1', i18nText: 'ENABLED.1' }
    ]
  },
  {
    header: 'ui.password-policy.fido-enabled',
    field: 'fidoEnabled',
    colOptions: [
      { value: '0', i18nText: 'ENABLED.0' },
      { value: '1', i18nText: 'ENABLED.1' }
    ]
  },
  {
    header: 'ui.cavv-key.modify-time',
    field: 'updateDateTime',
    dateFormat: 'yyyy-MM-dd HH:mm:ss'
  }
])

// Query Function
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

// Pagination Query
const fetchData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }

  const result = await apiUtil.postSearchPage('/password_policy/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }

  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}

// Add Button
const customButtonList: CustomButton[] = [
  {
    label: 'btn.new',
    type: 'button',
    variant: 'primary',
    action: () => {
      if (formMask.value) {
        formTitle.value = 'ADD'
        formMask.value.show('ADD')
      }
    }
  }
]

// Open Details
const openDetail = async (formDate: Record<string, any>) => {
  formTitle.value = 'DETAIL'
  await findById(formDate)
}

// Open Edit
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  await findById(formDate)
}

// Query details
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  const result = await apiUtil.get('/password_policy/detail', params, {}, true)

  if (result.success && result.code == '0000') {
    formDetails.value = { ...result.data }
    if (result.data.pdContentRule) {
      formDetails.value.pdContentRule = result.data.pdContentRule
    }
  } else {
    await swalMessage.error(result.message)
    return
  }

  // Wait for reactive update to complete before calling show
  await nextTick()
  if (formMask.value) {
    formMask.value.show(formTitle.value)
  }
}

// Submit form
const submit = async (formDate: any) => {
  const apiPath = formTitle.value == 'ADD' ? '/password_policy/add' : '/password_policy/edit'
  const result = await apiUtil.post(apiPath, formDate, {}, true)

  if (result.success && result.code == '0000') {
    await swalMessage.success(result.message)
    goBack()
  } else {
    await swalMessage.error(result.message)
    return
  }

  await handleSearch(searchCriteria.value)
}

// Close Form
const goBack = () => {
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
  }
  formTitle.value = ''
}

// Initialize
onMounted(async () => {
  issuerData.value = await findAllIssuer()
})
</script>
