<template>
  <!--CardBin Settings-->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.currency')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />

  <!-- ISO file upload block -->
  <div class="currency-upload-block border rounded p-3 mb-3">
    <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
      <span class="currency-upload-label">{{ $t('ui.currency.iso.upload') }}</span>
      <input
        ref="fileInput"
        type="file"
        @change="handleFileChange"
        class="currency-upload-input"
        aria-label="File Upload"
        :disabled="confirmingFlag"
      />
      <QueryButton label="btn.load" type="button" variant="primary" @click="fileUpload" :is-disabled="confirmingFlag" />
      <i v-if="confirmingFlag" class="ri-error-warning-line text-secondary" :title="$t('ui.reconfirm.status.0')"></i>
    </div>
    <p class="currency-upload-hint mb-0 small">
      <span class="text-warning me-1">{{ $t('ui.currency.iso.download') }}</span>
      <a
        href="https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml"
        target="_blank"
        rel="noopener noreferrer"
        class="text-break"
      >
        https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml
      </a>
    </p>
  </div>

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.currency')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="false"
    :operation-btn-update="true"
    :operation-btn-delete="true"
    @open-update="openUpdate"
    @delete-row="deleteRow"
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
import { computed, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { readOnlySet } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { exchangeWayOptionSelect } from '@/utils/select/currency'
import QueryButton from '@/components/query/QueryButton.vue'
import { validateDecimalMin, validatePattern } from '@/utils/validateUtil'
import { useAppStore } from '@/stores/app'

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

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
//options setting
const exchangeWayOption = computed(() => [...optionSelect, ...exchangeWayOptionSelect])
const form = ref<any>({})
// Breadcrumb
const formTitle = ref('')
const formMask = ref() // Used to store reference to FormComponent
const uploadFile = ref()
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
const confirmingFlag = ref(false)
/**
 * Pagination query
 * @param page current page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/currency/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  if (result.data.canNotUpload) {
    confirmingFlag.value = true
  }
  return {
    data: result.data.data.content,
    totalItems: result.data.data.totalElements
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
const fileInput = ref<HTMLInputElement | null>(null)
/**
 * Upload
 */
const fileUpload = async () => {
  if (!uploadFile.value) {
    await swalMessage.error(t('ui.currency.nofile'))
    return
  }
  const formData = new FormData()
  formData.append('file', uploadFile.value)
  const result = await apiUtil.post('/currency/upload', formData, { 'content-type': 'multipart/form-data' }, true)
  if (result.success && result.code == '0000') {
    await swalMessage.success(result.message)
    await handleSearch(searchCriteria.value)
  } else {
    await swalMessage.error(result.message)
  }
  // Clear
  if (fileInput.value) fileInput.value.value = ''
}
const appStore = useAppStore()

function handleFileChange(event: Event) {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files && fileInput.files.length > 0) {
    if (fileInput.files[0].size > appStore.maxFileSize) {
      swalMessage.error(fileInput.files[0].name + t('warn.currency.file.size.error'))
      fileInput.value = ''
      return
    }
    uploadFile.value = fileInput.files[0]
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
    if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig, ['cardScheme'], false)
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

  form.value['currencyRate'] = {
    rate: formDate['rate'],
    exchangeWay: formDate['exchangeWay']
  }

  if (formTitle.value == 'ADD') {
    //call add API
    const result = await apiUtil.post('/currency/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    //call edit API
    const result = await apiUtil.post('/currency/edit', form.value, {}, true)
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
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  readOnlySet(formConfig, ['cardScheme'], true)
  await findById(formDate)
}
/**
 * Delete
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/currency/delete?oid=${formDate['oid']}`, {}, {}, true)
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
 * Detail info
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/currency/detail', params, {}, true)
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

// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.currency.entity',
    field: 'entity'
  },
  {
    header: 'ui.currency.currency',
    field: 'currency'
  },
  { header: 'ui.currency.alphabeticCode', field: 'alphabeticCode' },
  { header: 'ui.currency.numericCode', field: 'numericCode' },
  {
    header: 'ui.currency.minorUnit',
    field: 'minorUnit'
  },
  {
    header: 'ui.currency-rate.rate',
    field: 'rate'
  },
  {
    header: 'ui.currency-rate.exchangeWay',
    field: 'exchangeWay',
    colOptions: computed(() => [...exchangeWayOptionSelect])
  }
])
const validateMinorUnit = (code: string) => {
  const validate: Record<string, any> = {}
  const codePattern = /^[0-8]$/ // Strictly match 4 digits, each digit between 0-8

  if (!code) {
    validate.result = false
    validate.message = 'warn.field-required' // Required field prompt
  } else if (codePattern.test(code)) {
    validate.result = true
  } else {
    validate.result = false
    validate.message = 'warn.minorunit.0to8-only'
  }

  return validate
}
// Form configuration for Add, Modify, Query
const formConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.currency.entity',
    model: 'entity',
    default: '',
    ID: 'entity',
    readOnly: false,
    required: true,
    maxlength: '255',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.currency.currency',
    model: 'currency',
    default: '',
    ID: 'currency',
    readOnly: false,
    required: true,
    maxlength: '255',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.currency.alphabeticCode',
    model: 'alphabeticCode',
    default: '',
    ID: 'alphabeticCode',
    readOnly: false,
    required: true,
    maxlength: '3',
    props: {},
    validateAction(val: string) {
      return validatePattern(val, '[A-Z]{3}', 'warn.currency.alphabeticCode.error')
    }
  },
  {
    type: 'text',
    label: 'ui.currency.numericCode',
    model: 'numericCode',
    default: '',
    ID: 'numericCode',
    readOnly: false,
    required: true,
    maxlength: '3',
    props: {},
    validateAction(val: string) {
      return validatePattern(val, '[0-9]{3}', 'warn.currency.numericCode.error')
    }
  },
  {
    type: 'text',
    label: 'ui.currency.minorUnit',
    model: 'minorUnit',
    default: '',
    ID: 'minorUnit',
    readOnly: false,
    required: false,
    maxlength: '1',
    props: {},
    validateAction(val: string) {
      return validateMinorUnit(val)
    }
  },
  {
    type: 'text',
    label: 'ui.currency-rate.rate',
    model: 'rate',
    default: '',
    ID: 'rate',
    readOnly: false,
    required: true,
    maxlength: '10',
    maxPoint: 8,
    props: {},
    validateAction(val: string) {
      return validateDecimalMin(val, '0.00000001')
    }
  },
  {
    type: 'checkbox',
    label: 'ui.currency-rate.exchangeWay',
    model: 'exchangeWay',
    default: '',
    ID: 'exchangeWay',
    readOnly: false,
    required: true,
    maxlength: '10',
    props: {
      options: exchangeWayOption
    }
  }
])
// Search condition configuration
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'text',
    label: 'ui.currency.entity',
    model: 'entity',
    default: '',
    maxlength: '255',
    props: {
      id: 'entity'
    }
  },
  {
    type: 'text',
    label: 'ui.currency.currency',
    model: 'currency',
    default: '',
    maxlength: '255',
    props: {
      id: 'currency'
    }
  },
  {
    type: 'text',
    label: 'ui.currency.alphabeticCode',
    model: 'alphabeticCode',
    default: '',
    maxlength: '3',
    props: {
      id: 'alphabeticCode'
    }
  },
  {
    type: 'text',
    label: 'ui.currency.numericCode',
    model: 'numericCode',
    default: '',
    maxlength: '3',
    props: {
      id: 'numericCode'
    }
  }
])
</script>

<style scoped>
.currency-upload-block {
  background-color: var(--cui-tertiary-bg, #f8f8f8);
  border-color: var(--cui-border-color) !important;
}

.currency-upload-label {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  background: var(--sidebar-active-bg, rgba(140, 28, 54, 0.12));
  color: var(--sidebar-active-text, #8c1c36);
}

.currency-upload-input {
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--cui-border-color);
  background: var(--cui-body-bg);
  color: var(--cui-body-color);
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.currency-upload-input:hover:not(:disabled) {
  border-color: var(--cui-border-color);
  background: var(--cui-secondary-bg);
}

.currency-upload-input:focus {
  border-color: var(--sidebar-active-text, #8c1c36);
  box-shadow: 0 0 0 0.2rem rgba(140, 28, 54, 0.15);
}

.currency-upload-hint {
  color: var(--cui-body-color);
  opacity: 0.9;
}

.currency-upload-hint a {
  color: var(--cui-body-color);
  text-decoration: underline;
}

.currency-upload-hint a:hover {
  color: var(--sidebar-active-text, #8c1c36);
}
</style>
