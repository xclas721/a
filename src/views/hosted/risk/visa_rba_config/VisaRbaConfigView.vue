<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.visa-rba')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.visa-rba')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="true"
    :operation-btn-delete="true"
    @open-detail="openDetail"
    @open-update="openUpdate"
    @delete-row="deleteRow"
  />

  <VisaRbaConfigFormView
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    :form-data="formDetails"
  >
  </VisaRbaConfigFormView>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import { readOnlyALLSet, readOnlySet } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import { findAllIssuer } from '@/hooks/issuer'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/stores/app'
import { enableFlagOptionSelect } from '@/utils/select/visarba'
import VisaRbaConfigFormView, { type FormField } from '@/views/hosted/risk/visa_rba_config/VisaRbaConfigFormView.vue'

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

//riskLevel
const enableFlagOption = computed(() => [...optionSelect, ...enableFlagOptionSelect])
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
//options setting
const issuerData = ref<BaseSelect[]>([])
const form = ref<any>({})
// Breadcrumb
const formTitle = ref('')
const formMask = ref() // Used to store reference to FormComponent
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
/**
 * Pagination query
 * @param page current page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/visa_rba/query', searchCriteria.value, page, {}, true)

  if (!result.success) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
/**
 * Open form
 */
const openFrom = () => {
  if (formMask.value) {
    formMask.value.show()
  } else {
    console.error('FormComponent component is not ready yet')
  }
}

/**
 * Close form
 */
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    if (formTitle.value === 'DETAIL') {
      readOnlyALLSet(formConfig, false, ['issuerOid'])
    } else if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig, ['issuerOid'], false)
    }
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}

/**
 * Add, Modify Submit Function
 * @param formDate form data
 */
const submit = async (formDate: any) => {
  form.value = { ...formDate }
  if (formTitle.value == 'ADD') {
    //call add API
    const result = await apiUtil.post('/visa_rba/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    //call edit API
    const result = await apiUtil.post('/visa_rba/edit', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  }
  // Finally update table
  await handleSearch(searchCriteria.value)
}
// Form detail data
const formDetails = ref<Record<string, any>>({})
/**
 * Open detail popup
 * @param formDate form data
 */
const openDetail = async (formDate: Record<string, any>) => {
  formTitle.value = 'DETAIL'
  // Define ID list to update
  readOnlyALLSet(formConfig, true, ['issuerOid'])
  await findById(formDate)
}
/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  readOnlySet(formConfig, ['issuerOid'], true)
  await findById(formDate)
}
/**
 * Delete
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/visa_rba/delete?oid=${formDate['oid']}`, {}, {}, true)
      .then((result) => {
        swalMessage.success(result.message)
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
 * Detail info
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/visa_rba/detail', params, {}, true)
  if (result.success && result.code == '0000') {
    // Update formDetails value
    formDetails.value = {
      ...result.data
    }
  } else {
    await swalMessage.error(result.message)
    return
  }
  // Open window
  openFrom()
}
// Initialization trigger function
onMounted(async () => {
  issuerData.value = await findAllIssuer()
})
// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerOptions.value])
  },
  {
    header: 'ui.visa-rba.enabled',
    field: 'enableFlag',
    colOptions: computed(() => [...enableFlagOption.value])
  },
  {
    header: 'ui.cavv-key.modify-time',
    field: 'updateDateTime',
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
    readOnly: false,
    required: true,
    colNum: '12',
    props: {
      options: issuerOptions
    }
  }
])

const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    props: {
      options: issuerOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'select',
    label: 'ui.visa-rba.enabled',
    model: 'criteriaEnableFlag',
    default: '',
    props: {
      options: enableFlagOption,
      id: 'criteriaEnableFlag'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
