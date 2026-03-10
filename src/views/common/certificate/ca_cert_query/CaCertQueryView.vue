<template>
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.ca-cert-certificate-find')"
    @search="handleSearch"
    :hide-btn="true"
  />
  <div class="outer-container">
    <!-- Display search results -->
    <DataTable
      ref="tableRef"
      :title="$t('ui.ca-cert-certificate-find')"
      :columns="searchResultsHeader"
      :fetchData="fetchUserData"
      :operation-btn-detail="false"
      :operation-btn-update="false"
      :operation-btn-delete="false"
    />

    <FormComponent
      ref="formMask"
      :form-config="formConfig"
      :title="formTitle"
      @go-back="goBack"
      :form-data="formDetails"
    />
  </div>
</template>
<script setup lang="ts">
import DataTable from '@/components/dataTable/DataTable.vue'
import { ref } from 'vue'
import swalMessage from '@/plugins/swalMessage'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import QueryCriteriaComponent, { type CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
const fetchUserData = async (page: number) => {
  const result = await apiUtil.postSearchPage('/caCertificate/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
const formMask = ref()
const formTitle = ref('')

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
const openDetail = async (formDate: Record<string, any>) => {
  const params: Record<string, any> = { oid: formDate['oid'] }
  // Fill data
  const result = await apiUtil.get('/caCertificate/detail', params, {}, true)
  if (result.success && result.code == '0000') {
    // Update formDetails value
    formDetails.value = {
      ...result.data
    }
  } else {
    await swalMessage.error(result.message)
    return
  }

  formTitle.value = 'DETAIL'
  // Define ID list to update
  formMask.value.show()
}
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}

const formConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.ca-cert-certificate.cert-alias',
    model: 'certAlias',
    default: '',
    ID: 'certAlias',
    colNum: '12',
    readOnly: true,
    required: false,
    props: {}
  },
  {
    type: 'text',
    label: 'ui.ca-cert-certificate-cert-issuer',
    model: 'certIssuer',
    default: '',
    ID: 'certIssuer',
    colNum: '12',
    readOnly: true,
    required: false,
    props: {}
  },
  {
    type: 'text',
    label: 'ui.ca-cert-certificate-subject',
    model: 'subject',
    default: '',
    ID: 'subject',
    colNum: '12',
    readOnly: true,
    required: false,
    props: {}
  },
  {
    type: 'text',
    label: 'ui.ca-cert-certificate-serial-number',
    model: 'serialNumber',
    default: '',
    ID: 'serialNumber',
    colNum: '12',
    readOnly: true,
    required: false,
    props: {}
  },
  {
    type: 'text',
    label: 'ui.issuer-cert.validity-period',
    model: 'validPeriod',
    default: '',
    ID: 'validPeriod',
    colNum: '12',
    readOnly: true,
    required: false,
    props: {}
  }
])
const searchResultsHeader = ref<any>([
  {
    header: 'ui.ca-cert-certificate.cert-alias',
    field: 'certAlias',
    action: (row: Record<string, any>) => openDetail(row)
  },
  { header: 'ui.ca-cert-certificate-subject-cn', field: 'subjectCn' },
  {
    header: 'ui.ca-cert-certificate-cert-issuer-cn',
    field: 'certIssuerCn'
  },
  {
    header: 'ui.issuer-cert.validity-period',
    field: 'validPeriod'
  }
])

const userQueryConfig = ref<CriteriaField[]>([
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
</script>

<style scoped>
h4 {
  color: #6c757d; /* Gray color for title */
  border-bottom: 2px solid #e0e0e0; /* Light gray bottom border */
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.outer-container {
  border: 1px solid var(--cui-border-color, #e0e0e0);
  border-radius: 8px;
  background-color: var(--cui-body-bg);
  margin-bottom: 15px;
}
</style>
