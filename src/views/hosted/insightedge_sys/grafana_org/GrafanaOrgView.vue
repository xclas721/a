<template>
  <!-- Grafana Organization Management -->
  <QueryCriteriaComponent
    :criteriaConfig="queryConfig"
    :title="$t('ui.grafana-org')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />

  <!-- Review Prompt -->
  <div v-if="reconfirmFlag" class="my-2 w-100">
    <span class="alert alert-success d-flex">{{ $t('ui.reconfirm.message.add-to-reconfirm-sucessful') }}</span>
  </div>

  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.grafana-org')"
    :columns="searchResultsHeader"
    :fetchData="fetchData"
    :operation-btn-detail="false"
    :operation-btn-update="false"
    :operation-btn-delete="true"
    @delete-row="deleteRow"
    :custom-buttons="customTableButtons"
  />

  <FormComponent
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    :form-data="formDetails"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable, { type TableCustomButton } from '@/components/dataTable/DataTable.vue'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import FormComponent, { type FormField } from '@/components/formTable/FormComponent.vue'
import { userStateStore } from '@/stores/user'
import { findAllIssuer, type IssuerData } from '@/hooks/issuer'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/stores/app'
import { isConfirmingAdd } from '@/hooks/reconfirm'

// Grafana Organization Sync Status Constants
const SYNC_STATUS = {
  NORMAL: 'NORMAL', // Normal state, no review needed, can sync indefinitely
  PENDING: 'PENDING', // Pending review state, click sync to enter review, button disabled
  APPROVED: 'APPROVED' // Approved state, after approval, can click sync button to execute sync once
} as const

const appStoreHook = useAppStoreHook()
const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()

// Review Status
const reconfirmFlag = ref(false)

// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)

// Reactive data
const searchCriteria = ref<any>({})
const form = ref<any>({})
const formTitle = ref('')
const formMask = ref()
const issuerData = ref<BaseSelect[]>([])
const issuerMap = ref<Record<string, string>>({}) // issuerOid -> bankId

// Issuer Options
const issuerOptions = computed(() => {
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})

// Query criteria配置
const queryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: appStoreHook.organ == 'issuer' ? userState.user.issuerOid : '',
    props: {
      options: issuerOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'text',
    label: 'ui.grafana-org.org-name',
    model: 'orgName',
    default: '',
    maxlength: '50',
    props: {
      id: 'orgName'
    }
  }
])

// Table column configuration
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...issuerOptions.value])
  },
  {
    header: 'ui.grafana-org.org-name',
    field: 'orgName'
  },
  {
    header: 'ui.grafana-org.org-id',
    field: 'orgId'
  },
  {
    header: 'ui.grafana-org.create-time',
    field: 'createDateTime',
    dateFormat: 'yyyy-MM-dd HH:mm:ss'
  }
])

const formConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: '',
    ID: 'issuerOid',
    readOnly: false,
    required: true,
    props: {
      options: issuerOptions,
      id: 'issuerOid'
    }
  },
  {
    type: 'text',
    label: 'ui.grafana-org.org-name',
    model: 'orgName',
    default: '',
    ID: 'orgName',
    readOnly: false,
    required: true,
    maxlength: '100',
    props: {}
  }
])

// Custom button - Add
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

// Table custom button - Create Organization and Sync
const customTableButtons: TableCustomButton[] = [
  {
    label: 'ui.grafana-org.create-org',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      await createOrg(row)
    },
    btnShow: (row: any) => {
      // Show "Create Organization" button only when createOrg=false
      return row.createOrg === false
    }
  },
  {
    label: 'btn.sync',
    type: 'button',
    variant: 'primary',
    action: async (row: any) => {
      await syncFromHosted(row)
    },
    btnShow: (row: any) => {
      // Sync button always exists (as long as createOrg=true and orgId exists)
      // If review needed, click to enter review
      // If no review needed, can click repeatedly
      return row.createOrg === true && row.orgId != null
    },
    btnDisable: (row: any) => {
      // If syncStatus is PENDING, disable sync button
      return row.syncStatus === SYNC_STATUS.PENDING
    }
  }
]

/**
 * Search handling
 */
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

/**
 * Pagination query（注意：後端 query 不使用分頁，返回所有符合條件的結果）
 */
const fetchData = async () => {
  queryConfig.value.forEach((field) => {
    searchCriteria.value[field.model] ??= field.default
  })

  const result = await apiUtil.post('/grafana_org/query', searchCriteria.value, {}, true)

  if (!result.success) {
    await swalMessage.warning(result.message)
  }

  const data = (result.data || []).map((row: any) => ({
    ...row,
    bankId: issuerMap.value[row.issuerOid] || '',
    // If syncStatus is PENDING, also set isConfirming to true, so DataTable shows exclamation mark
    // But this won't affect disable status of other buttons, because sync button's btnDisable is handled separately
    // Note: Only PENDING state needs to set isConfirming, APPROVED state does not
    isConfirming: row.isConfirming || row.syncStatus === SYNC_STATUS.PENDING || false
  }))

  // Check if there are pending review items (including delete and sync)
  // Note: Only when syncStatus is PENDING it counts as pending review, APPROVED state does not
  const hasConfirming = data.some((item: any) => {
    // If sync operation, only PENDING state counts as pending review
    if (item.syncStatus === SYNC_STATUS.PENDING) {
      return true
    }
    // Pending review status for other operations (e.g. delete)
    return item.isConfirming === true
  })

  // Also check newly added review status
  const targetIssuerOid =
    appStoreHook.organ == 'hosted' ? searchCriteria.value.issuerOid || '' : userState.user.issuerOid
  const isAddConfirming = await isConfirmingAdd('grafana_org', targetIssuerOid || '')

  reconfirmFlag.value = isAddConfirming || hasConfirming

  return { data, totalItems: data.length }
}

/**
 * Close form
 */
const goBack = () => {
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}

/**
 * Add submit function
 */
const submit = async (formDate: any) => {
  form.value = { ...formDate }

  if (formTitle.value == 'ADD') {
    const bankId = issuerMap.value[form.value.issuerOid]
    if (!bankId) {
      await swalMessage.error('請選擇發卡單位')
      return
    }

    const result = await apiUtil.post('/grafana_org/insert', { ...form.value, bankId }, {}, true)
    if (result.success && result.code == '0000') {
      const data = result.data
      // Check if entering review：如果沒有 data 且 message 包含覆核訊息，表示進入覆核
      const reconfirmMessage = t('ui.reconfirm.message.add-to-reconfirm-sucessful')
      const isReconfirm = (!data || data === null) && result.message && result.message.includes(reconfirmMessage)

      if (isReconfirm) {
        // Enter review, show detailed prompt
        await swalMessage.fire({
          title: t('ui.message.info'),
          html: `<div class="text-start">
            <p>${result.message}</p>
            <hr style="margin: 1rem 0;">
            <p style="color: #dc3545; font-weight: bold; margin-bottom: 0.5rem;">${t('ui.grafana-org.reconfirm-notice-title')}</p>
            <ul style="margin: 0; padding-left: 1.5rem;">
              <li>${t('ui.grafana-org.reconfirm-notice-create-org')}</li>
            </ul>
          </div>`,
          icon: 'info',
          confirmButtonText: t('btn.ok'),
          width: '600px'
        })
        reconfirmFlag.value = true
      } else {
        // No review needed, success directly
        await swalMessage.success(result.message)
        // Check if entering review（用於更新覆核狀態）
        const targetIssuerOid = appStoreHook.organ == 'hosted' ? form.value.issuerOid || '' : userState.user.issuerOid
        const isAddConfirming = await isConfirmingAdd('grafana_org', targetIssuerOid || '')
        reconfirmFlag.value = isAddConfirming
      }

      goBack()
    } else {
      await swalMessage.error(result.message)
    }
  }

  // Finally update table
  await handleSearch(searchCriteria.value)
}

// Form detail data
const formDetails = ref<Record<string, any>>({})

/**
 * Delete
 */
const deleteRow = async (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', async function () {
    const result = await apiUtil.post('/grafana_org/delete', { oid: formDate['oid'] }, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)

      // Check if entering review
      const targetIssuerOid =
        appStoreHook.organ == 'hosted' ? searchCriteria.value.issuerOid || '' : userState.user.issuerOid
      const isAddConfirming = await isConfirmingAdd('grafana_org', targetIssuerOid || '')
      const data = await fetchData()
      const hasConfirming = data.data.some((item: any) => item.isConfirming === true)
      reconfirmFlag.value = isAddConfirming || hasConfirming
    } else {
      await swalMessage.error(result.message)
    }

    // Finally update table
    await handleSearch(searchCriteria.value)
  })
}

/**
 * Create Organization
 */
const createOrg = async (formDate: Record<string, any>) => {
  swalMessage.confirm(
    t('ui.grafana-org.confirm-create-org'),
    t('ui.grafana-org.create-org-description'),
    async function () {
      const result = await apiUtil.post('/grafana_org/createOrg', { oid: formDate['oid'] }, {}, true)
      if (result.success && result.code == '0000') {
        const data = result.data
        if (data) {
          // Show detailed success message, including configuration tips
          await showCreateSuccessMessage(data)
        } else {
          await swalMessage.success(result.message)
        }
      } else {
        await swalMessage.error(result.message)
      }
      // Finally update table
      await handleSearch(searchCriteria.value)
    }
  )
}

/**
 * Sync Settings
 */
const syncFromHosted = async (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.grafana-org.confirm-sync'), t('ui.grafana-org.sync-description'), async function () {
    const result = await apiUtil.post('/grafana_org/sync', { oid: formDate['oid'] }, {}, true)
    if (result.success && result.code == '0000') {
      const data = result.data
      if (data && data.datasourceCount !== undefined) {
        // Show sync result, including count of all synced resources
        const datasourceCount = data.datasourceCount || 0
        const contactPointCount = data.contactPointCount || 0
        const notificationPoliciesSynced = data.notificationPoliciesSynced
        const alertRuleCount = data.alertRuleCount || 0

        // Check if partial sync failed
        const hasPartialFailure = contactPointCount === 0 || !notificationPoliciesSynced

        await swalMessage.fire({
          title: t('ui.message.info'),
          html: `<div class="text-start">
              <p>${t('ui.grafana-org.sync-success')}</p>
              ${hasPartialFailure ? `<p style="color: orange; margin-top: 0.5rem; margin-bottom: 1rem;"><strong>${t('ui.grafana-org.partial-sync-failure')}</strong></p>` : ''}
              <hr style="margin: 1rem 0;">
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <p><strong>${t('ui.grafana-org.synced-datasources')}:</strong> ${datasourceCount}</p>
                <p><strong>${t('ui.grafana-org.synced-contact-points')}:</strong> ${contactPointCount}</p>
                <p><strong>${t('ui.grafana-org.synced-notification-policies')}:</strong> ${notificationPoliciesSynced ? '成功' : '失敗'}</p>
                <p><strong>${t('ui.grafana-org.synced-alert-rules')}:</strong> ${alertRuleCount}</p>
              </div>
            </div>`,
          icon: 'success',
          confirmButtonText: t('btn.ok'),
          width: '500px'
        })
      } else {
        // Check if entering review
        const isReconfirm =
          result.message && result.message.includes(t('ui.reconfirm.message.add-to-reconfirm-sucessful'))

        if (isReconfirm) {
          // Enter review, show detailed prompt
          await swalMessage.fire({
            title: t('ui.message.info'),
            html: `<div class="text-start">
              <p>${result.message}</p>
              <hr style="margin: 1rem 0;">
              <p style="color: #dc3545; font-weight: bold; margin-bottom: 0.5rem;">${t('ui.grafana-org.reconfirm-notice-title')}</p>
              <ul style="margin: 0; padding-left: 1.5rem;">
                <li>${t('ui.grafana-org.reconfirm-notice-sync')}</li>
              </ul>
            </div>`,
            icon: 'info',
            confirmButtonText: t('btn.ok'),
            width: '600px'
          })
        } else {
          await swalMessage.success(result.message)
        }
      }

      // Check if entering review（無論是否有 data，都要檢查）
      const targetIssuerOid =
        appStoreHook.organ == 'hosted' ? searchCriteria.value.issuerOid || '' : userState.user.issuerOid
      const isAddConfirming = await isConfirmingAdd('grafana_org', targetIssuerOid || '')
      const fetchResult = await fetchData()
      const hasConfirming = fetchResult.data.some(
        (item: any) => item.isConfirming === true || item.isSyncConfirming === true
      )

      // If entering review (result.data is null), set reconfirmFlag
      if (!result.data) {
        reconfirmFlag.value = true
      } else {
        reconfirmFlag.value = isAddConfirming || hasConfirming
      }
    } else {
      await swalMessage.error(result.message)
    }
    // Finally update table
    await handleSearch(searchCriteria.value)
  })
}

/**
 * Show detailed success message for creation
 */
const showCreateSuccessMessage = async (data: any) => {
  const orgMapping = data.orgMapping || ''
  const datasourceCount = data.datasourceCount || 0
  const contactPointCount = data.contactPointCount || 0
  const notificationPoliciesSynced = data.notificationPoliciesSynced
  const alertRuleCount = data.alertRuleCount || 0

  // Check if partial sync failed
  const hasPartialFailure = contactPointCount === 0 || !notificationPoliciesSynced

  await swalMessage.fire({
    title: t('ui.message.info'),
    html: `<div class="text-start">
      <p>${t('ui.grafana-org.create-success')}</p>
      ${hasPartialFailure ? `<p style="color: orange; margin-top: 0.5rem; margin-bottom: 1rem;"><strong>${t('ui.grafana-org.partial-sync-failure')}</strong></p>` : ''}
      <hr style="margin: 1rem 0;">
      <p><strong>同步結果：</strong></p>
      <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
        <p><strong>${t('ui.grafana-org.synced-datasources')}:</strong> ${datasourceCount}</p>
        <p><strong>${t('ui.grafana-org.synced-contact-points')}:</strong> ${contactPointCount}</p>
        <p><strong>${t('ui.grafana-org.synced-notification-policies')}:</strong> ${notificationPoliciesSynced ? '成功' : '失敗'}</p>
        <p><strong>${t('ui.grafana-org.synced-alert-rules')}:</strong> ${alertRuleCount}</p>
      </div>
      <hr style="margin: 1rem 0;">
      <p><strong>${t('ui.grafana-org.manual-config-title')}</strong></p>
      <ol style="text-align: left; padding-left: 1.5rem;">
        <li style="margin-bottom: 0.5rem;">
          ${t('ui.grafana-org.manual-config-hosted')}
          <div style="display: flex; gap: 0.5rem; margin: 0.5rem 0; align-items: stretch;">
            <div style="flex: 1; padding: 0.75rem; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 0.375rem; display: flex; align-items: center;">
              <code id="orgMappingCode" style="font-size: 12px; word-break: break-all; font-family: monospace; white-space: pre-wrap;">${orgMapping}</code>
            </div>
            <button id="copyOrgMappingBtn" class="btn btn-outline-primary" style="white-space: nowrap; min-width: 45px; padding: 0 1rem; display: flex; align-items: center; justify-content: center;">
              <i class="fa fa-copy" style="font-size: 16px;"></i>
            </button>
          </div>
        </li>
        <li style="margin-bottom: 0.5rem;">
          ${t('ui.grafana-org.manual-config-dashboard')}
        </li>
        <li style="margin-bottom: 0.5rem;">
          ${t('ui.grafana-org.manual-config-issuer')}
        </li>
      </ol>
    </div>`,
    icon: 'success',
    confirmButtonText: t('btn.ok'),
    allowOutsideClick: false,
    allowEscapeKey: false,
    width: '600px',
    didOpen: () => {
      const copyBtn = document.getElementById('copyOrgMappingBtn')
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const codeElement = document.getElementById('orgMappingCode')
          if (codeElement) {
            const text = codeElement.textContent || ''
            navigator.clipboard.writeText(text).then(() => {
              copyBtn.innerHTML = '<i class="fa fa-check" style="font-size: 16px; color: green;"></i>'
              setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa fa-copy" style="font-size: 16px;"></i>'
              }, 2000)
            })
          }
        })
      }
    }
  })
}

// Initialize觸發函數
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  const result = await apiUtil.get('/condition/queryIssuer', {}, {}, true)
  if (result.success) {
    result.data.forEach((issuer: IssuerData) => {
      if (issuer.oid && issuer.bankId) {
        issuerMap.value[issuer.oid] = issuer.bankId
      }
    })
  }

  // Initialize覆核狀態
  const targetIssuerOid =
    appStoreHook.organ == 'hosted' ? searchCriteria.value.issuerOid || '' : userState.user.issuerOid
  const isAddConfirming = await isConfirmingAdd('grafana_org', targetIssuerOid || '')
  reconfirmFlag.value = isAddConfirming
})
</script>

<style scoped>
/* Add your styles here */
</style>
