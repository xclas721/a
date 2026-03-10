<template>
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.grafana-key')"
    :customButtons="customButtonList"
    @search="handleSearch"
    @update:criteria="handleCriteriaUpdate"
  />

  <!-- Reconfirm Hint -->
  <div v-if="reconfirmFlag" class="my-2 w-100">
    <span class="alert alert-success d-flex">{{ $t('ui.reconfirm.message.add-to-reconfirm-sucessful') }}</span>
  </div>

  <!-- Functional Block: API Key Management -->
  <div class="mb-4">
    <div class="grafana-key-block">
      <div class="header-title d-flex justify-content-between align-items-center">
        <span>{{ $t('ui.grafana-key') }}</span>
      </div>
      <div class="content-box p-3">
        <DataTable
          ref="tableRef"
          title=""
          :columns="tableColumns"
          :fetchData="fetchApiKeyData"
          :operation-btn-detail="false"
          :operation-btn-update="false"
          :operation-btn-delete="true"
          :customButtons="tableCustomButtons"
          @delete-row="deleteApiKey"
        />
      </div>
    </div>
  </div>

  <!-- Functional Block: Key Generation (jwks.json, grafanaKey, jwk) -->
  <div class="mb-4">
    <div class="grafana-key-block">
      <div class="header-title d-flex justify-content-between align-items-center">
        <span>{{ $t('ui.grafana-key.key-generation') }}</span>
        <div class="d-flex gap-2">
          <button class="btn btn-secondary btn-sm" @click="genKey">
            <span class="mx-2">{{ $t('ui.grafana-key.generate-key') }}</span>
          </button>
          <button v-if="publicKey" class="btn btn-outline-secondary btn-sm" @click="toggleKeyDisplay">
            <i :class="isGenKey ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </button>
        </div>
      </div>
      <div class="content-box p-3">
        <div v-if="!publicKey" class="text-muted text-center py-4">
          <p class="mb-0">{{ $t('ui.grafana-key.generate-hint') }}</p>
        </div>
        <div v-else-if="isGenKey">
          <div class="key-section mb-3">
            <h6 class="key-section-title">jwks.json</h6>
            <div class="key-content-area">
              <pre v-if="isFormatted" class="key-content-text">{{ formattedData }}</pre>
              <pre v-else class="key-content-text">{{ publicKey }}</pre>
            </div>
          </div>

          <div class="key-section mb-3">
            <h6 class="key-section-title">grafanaKey</h6>
            <div class="key-content-area key-content-area-small">
              <pre class="key-content-text">{{ grafanaKey }}</pre>
            </div>
          </div>

          <div class="key-section mb-3">
            <h6 class="key-section-title">jwk</h6>
            <div class="key-content-area key-content-area-small">
              <pre class="key-content-text">{{ jwk }}</pre>
            </div>
          </div>

          <div class="key-actions">
            <button class="btn btn-primary" @click="format">
              <span class="mx-2">{{ $t('ui.trans.log.message.format-json') }}</span>
            </button>
          </div>
        </div>
        <div v-else class="text-muted text-center py-4">
          <p class="mb-0">{{ $t('ui.grafana-key.content-hidden') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ApiUtil from '@/utils/apiUtils'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { userStateStore } from '@/stores/user'
import QueryCriteriaComponent, {
  type CriteriaField,
  type CustomButton
} from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { findAllIssuer } from '@/hooks/searchConditions'
import { type BaseSelect, type BaseI18nSelect, optionSelect } from '@/utils/select/baseSelect'
import { useAppStoreHook } from '@/stores/app'
import { isConfirmingAdd } from '@/hooks/reconfirm'

const userState = userStateStore()
const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const appStoreHook = useAppStoreHook()

// Reconfirm status
const reconfirmFlag = ref(false)

// Table reference
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)

// Key related status variables
const isFormatted = ref(false)
const formattedData = ref('')
const publicKey = ref('')
const grafanaKey = ref('')
const isGenKey = ref(false)
const jwk = ref('')

// Query criteria
const searchCriteria = ref<any>({
  issuerOid: appStoreHook.organ == 'hosted' ? '' : userState.user.issuerOid
})

// Issuer options
const issuerData = ref<BaseSelect[]>([])
// Hosted option (indicate hosted's API Key, issuerOid is null)
const hostedOption: BaseI18nSelect = {
  value: '__HOSTED__', // Use special value marker, convert to null in generateApiKey
  i18nText: 'ui.grafana-key.hosted'
}
const issuerOptions = computed(() => {
  return appStoreHook.organ == 'hosted' ? [...optionSelect, hostedOption, ...issuerData.value] : [...issuerData.value]
})

// Query criteria配置
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: appStoreHook.organ == 'hosted' ? '' : userState.user.issuerOid,
    readOnly: appStoreHook.organ != 'hosted',
    props: {
      options: issuerOptions,
      id: 'issuerOid'
    }
  }
])

// Table column configuration
const tableColumns = computed(() => {
  const columns = []

  // Display issuer column for Hosted user
  if (appStoreHook.organ == 'hosted') {
    // Convert array to object format for dataTrans use
    const issuerColOptions: Record<string, any> = {}
    // Add null value corresponding to "Hosted" (for table display)
    issuerColOptions['null'] = {
      value: null,
      i18nText: 'ui.grafana-key.hosted'
    }
    issuerOptions.value.forEach((item, index) => {
      issuerColOptions[index.toString()] = {
        value: item.value,
        text: 'text' in item ? item.text : undefined,
        i18nText: 'i18nText' in item ? item.i18nText : undefined
      }
    })

    columns.push({
      header: 'ui.issuer.name',
      width: '25%',
      headerNoI18n: false,
      field: 'issuerOid',
      colOptions: issuerColOptions
    })
  }

  columns.push(
    {
      header: 'ui.grafana-key.api-key',
      width: appStoreHook.organ == 'hosted' ? '50%' : '50%',
      headerNoI18n: false,
      field: 'apiKey'
    },
    {
      header: 'ui.grafana-key.modify-time',
      width: appStoreHook.organ == 'hosted' ? '25%' : '50%',
      headerNoI18n: false,
      field: 'updateDateTime',
      dateFormat: 'yyyy-MM-dd HH:mm:ss'
    }
  )

  return columns
})

/**
 * Handle query criteria update (real-time sync)
 */
const handleCriteriaUpdate = (criteria: any) => {
  searchCriteria.value = { ...criteria }
}

/**
 * Handle query
 */
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

/**
 * Paging query API Key data
 */
const fetchApiKeyData = async (page: number) => {
  try {
    // Fill default values for all conditions
    for (const field of userQueryConfig.value) {
      searchCriteria.value[field.model] ??= field.default
    }

    // Prepare query params, convert '__HOSTED__' to null (indicates querying hosted's Key)
    const queryParams = { ...searchCriteria.value }
    if (queryParams.issuerOid === '__HOSTED__') {
      queryParams.issuerOid = null
    }

    const result = await apiUtil.postSearchPage('/grafanaKey/query', queryParams, page, {}, true)

    if (result.success && result.code == '0000') {
      // Backend may return list or single object
      let dataArray = []
      if (Array.isArray(result.data)) {
        // If list, use directly
        dataArray = result.data
      } else if (result.data) {
        // If single object, convert to array format
        dataArray = [result.data]
      }

      // Check if there are items pending reconfirm (including delete)
      const hasConfirming = dataArray.some((item: any) => item.isConfirming === true)

      // Also check new reconfirm status
      const targetIssuerOid =
        appStoreHook.organ == 'hosted'
          ? queryParams.issuerOid === null
            ? null
            : queryParams.issuerOid
          : userState.user.issuerOid
      const isAddConfirming = await isConfirmingAdd('grafana_key', targetIssuerOid || '')

      reconfirmFlag.value = isAddConfirming || hasConfirming

      // For records with genKey=false, query reconfirm info to Check if user is the one submitting for review
      const genKeyFalseItems = dataArray.filter((item: any) => item.genKey === false)
      if (genKeyFalseItems.length > 0) {
        await Promise.all(
          genKeyFalseItems.map(async (item: any) => {
            try {
              // Query reconfirm applicant info
              const reconfirmResult = await apiUtil.get(
                '/grafanaKey/getReconfirmApplicant',
                {
                  oid: item.oid
                },
                {},
                true
              )

              if (reconfirmResult.success && reconfirmResult.code === '0000' && reconfirmResult.data) {
                // Has reconfirm record, Check if user is the one submitting for review
                const reconfirm = reconfirmResult.data
                const isHosted = appStoreHook.organ === 'hosted'
                const isIssuer = appStoreHook.organ === 'issuer'
                const currentAccount = userState.user.account

                // Check if the user is the one submitting for review
                let canGenerateKey = false
                if (reconfirm.editor === 'I') {
                  // Reconfirm submitted by Issuer: only Issuer user with matching account can generate key
                  canGenerateKey = isIssuer && reconfirm.applyAccount === currentAccount
                } else if (reconfirm.editor === 'H') {
                  // Reconfirm submitted by Hosted: only Hosted user with matching account can generate key
                  canGenerateKey = isHosted && reconfirm.applyAccount === currentAccount
                }

                item._canGenerateKey = canGenerateKey
              } else {
                // No reconfirm record (direct add, no reconfirm needed), allow key generation
                item._canGenerateKey = true
              }
            } catch (error) {
              console.error(`Failed to query reconfirm applicant info (oid: ${item.oid}):`, error)
              // On error, default allow key generation (avoid affecting normal flow)
              item._canGenerateKey = true
            }
          })
        )
      }

      return {
        data: dataArray,
        totalItems: dataArray.length
      }
    } else {
      await swalMessage.warning(result.message)
      return { data: [], totalItems: 0 }
    }
  } catch (error) {
    console.error('Failed to query API Key:', error)
    return { data: [], totalItems: 0 }
  }
}

/**
 * Generate API Key
 */
const generateApiKey = async () => {
  try {
    // Fill default values for all conditions（但不要覆蓋已存在的值）
    for (const field of userQueryConfig.value) {
      if (searchCriteria.value[field.model] === undefined || searchCriteria.value[field.model] === null) {
        searchCriteria.value[field.model] = field.default
      }
    }

    // Use issuerOid from query conditions
    // hosted user: can select Hosted or any issuer
    // issuer user: use own issuerOid
    let targetIssuerOid: string | null = null
    if (appStoreHook.organ == 'hosted') {
      const selectedIssuerOid = searchCriteria.value.issuerOid
      // hosted user: must select an option (cannot be empty string, null or undefined)
      // Allow '__HOSTED__' to pass validation
      if (selectedIssuerOid === '' || selectedIssuerOid == null || selectedIssuerOid === undefined) {
        await swalMessage.warning('Please select an issuer first')
        return
      }
      // If Hosted option is selected, convert to null
      if (selectedIssuerOid === '__HOSTED__') {
        targetIssuerOid = null
      } else {
        targetIssuerOid = selectedIssuerOid
      }
    } else {
      // issuer user: use own issuerOid
      targetIssuerOid = userState.user.issuerOid || null
    }

    const result = await apiUtil.post('/grafanaKey/generate', { issuerOid: targetIssuerOid }, {}, true)

    if (result.success && result.code == '0000') {
      // Check if entering reconfirm
      const isReconfirm =
        result.message && result.message.includes(t('ui.reconfirm.message.add-to-reconfirm-sucessful'))

      if (isReconfirm) {
        // Enter reconfirm, show detailed hint
        await swalMessage.fire({
          title: t('ui.message.info'),
          html: `<div class="text-start">
            <p>${result.message}</p>
            <hr style="margin: 1rem 0;">
            <p style="color: #dc3545; font-weight: bold; margin-bottom: 0.5rem;">${t('ui.grafana-key.reconfirm-notice-title')}</p>
            <ul style="margin: 0; padding-left: 1.5rem;">
              <li>${t('ui.grafana-key.reconfirm-notice-generate-key')}</li>
            </ul>
          </div>`,
          icon: 'info',
          confirmButtonText: t('btn.ok'),
          width: '600px'
        })
      } else {
        // No reconfirm needed, directly success
        await swalMessage.success(result.message)
      }

      // Update reconfirm status
      await checkReconfirmStatus()
      // Re-query table
      if (tableRef.value) {
        await tableRef.value.fetchPageData()
      }
    } else {
      await swalMessage.error(result.message)
    }
  } catch (error) {
    console.error('Failed to generate API Key:', error)
    await swalMessage.error(t('ui.grafana-key.generate.failed'))
  }
}

// Custom button config (query criteria area)
const customButtonList: CustomButton[] = [
  {
    label: 'btn.new',
    type: 'button',
    variant: 'primary',
    action: generateApiKey
  }
]

// Table custom button config (show 'Generate Key' button when genKey=false and user is the one submitting for review)
const tableCustomButtons = computed(() => [
  {
    label: 'ui.grafana-key.generate-key',
    type: 'button' as const,
    variant: 'primary',
    action: handleGenerateKeyForRow,
    btnShow: (row: any) => {
      // Must be genKey=false to need key generation
      if (row.genKey !== false) {
        return false
      }

      // Must have _canGenerateKey property and be true to show button
      // If _canGenerateKey is undefined (not queried yet) or false (not the user submitting for review), do not show button
      return row._canGenerateKey === true
    }
  }
])

/**
 * Generate API Key for a row in table (when genKey=false)
 */
const handleGenerateKeyForRow = async (row: any) => {
  if (!row || !row.oid) return

  try {
    const result = await apiUtil.post(`/grafanaKey/generateApiKey?oid=${row.oid}`, {}, {}, true)

    if (result.success && result.code == '0000') {
      const apiKey = result.data?.apiKey
      if (apiKey) {
        // Popup shows plaintext once
        await swalMessage.fire({
          title: t('ui.grafana-key.generate.success'),
          html: `<div class="text-start">
        <p><strong>API Key:</strong></p>
        <div style="display: flex; gap: 0.5rem; margin: 1rem 0; align-items: stretch;">
            <div style="flex: 1; padding: 0.75rem; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 0.375rem; display: flex; align-items: center;">
                <code id="apiKeyCode" style="font-size: 14px; word-break: break-all; font-family: monospace;">${apiKey}</code>
            </div>
            <button id="copyBtn" class="btn btn-outline-primary" style="white-space: nowrap; min-width: 45px; padding: 0 1rem; display: flex; align-items: center; justify-content: center;">
                <i class="fa fa-copy" style="font-size: 16px;"></i>
            </button>
        </div>
        <p style="color: #dc3545; font-size: 0.875rem;">${t('ui.grafana-key.generate.warning')}</p>
        </div>`,
          icon: 'success',
          confirmButtonText: t('btn.ok'),
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            const copyBtn = document.getElementById('copyBtn')
            if (copyBtn) {
              copyBtn.addEventListener('click', async () => {
                try {
                  await navigator.clipboard.writeText(apiKey)
                  // Modify button icon to indicate copied
                  const originalHtml = copyBtn.innerHTML
                  copyBtn.innerHTML = '<i class="fa fa-check" style="font-size: 16px;"></i>'
                  copyBtn.classList.remove('btn-outline-primary')
                  copyBtn.classList.add('btn-success')
                  setTimeout(() => {
                    copyBtn.innerHTML = originalHtml
                    copyBtn.classList.remove('btn-success')
                    copyBtn.classList.add('btn-outline-primary')
                  }, 2000)
                } catch (err) {
                  console.error('Copy failed:', err)
                }
              })
            }
          }
        })

        // Re-query table
        if (tableRef.value) {
          await tableRef.value.fetchPageData()
        }
      }
    } else {
      await swalMessage.error(result.message)
    }
  } catch (error) {
    console.error('Failed to generate API Key:', error)
    await swalMessage.error(t('ui.grafana-key.generate.failed'))
  }
}

/**
 * Delete API Key
 */
const deleteApiKey = async (row: any) => {
  if (!row) return

  swalMessage.confirm(t('ui.confirm.delete'), '', async function () {
    try {
      const result = await apiUtil.post(`/grafanaKey/delete?oid=${row.oid}`, {}, {}, true)

      if (result.success && result.code == '0000') {
        await swalMessage.success(result.message)
        // Update reconfirm status
        await checkReconfirmStatus()
        // Re-query table
        if (tableRef.value) {
          await tableRef.value.fetchPageData()
        }
      } else {
        await swalMessage.error(result.message)
      }
    } catch (error) {
      console.error('Failed to delete API Key:', error)
      await swalMessage.error(t('ui.grafana-key.delete.failed'))
    }
  })
}

/**
 * Format JSON
 */
const format = () => {
  if (typeof publicKey.value === 'string') {
    try {
      const parsedData = JSON.parse(publicKey.value)
      formattedData.value = JSON.stringify(parsedData, null, 2)
    } catch (e) {
      console.error('Cannot parse JSON:', e)
      formattedData.value = publicKey.value // Show original data
    }
    isFormatted.value = true
  } else {
    console.error('detailData is not string type')
  }
}

/**
 * Generate key
 */
const genKey = async () => {
  try {
    const result = await apiUtil.get('/grafana/genKey', {}, {}, true)
    if (result.success) {
      publicKey.value = result.data.jwksPublicKey
      grafanaKey.value = result.data.grafanaKey
      jwk.value = result.data.jwk
      isFormatted.value = false
      isGenKey.value = true
    }
  } catch (error) {
    console.error('Failed to generate key:', error)
  }
}

/**
 * Toggle key display
 */
const toggleKeyDisplay = () => {
  isGenKey.value = !isGenKey.value
}

// Check reconfirm status (only check new reconfirm status, table data reconfirm status is updated by fetchApiKeyData)
const checkReconfirmStatus = async () => {
  try {
    const targetIssuerOid =
      appStoreHook.organ == 'hosted'
        ? searchCriteria.value.issuerOid === '__HOSTED__'
          ? null
          : searchCriteria.value.issuerOid
        : userState.user.issuerOid

    // Check new reconfirm status
    const isAddConfirming = await isConfirmingAdd('grafana_key', targetIssuerOid || '')
    reconfirmFlag.value = isAddConfirming
  } catch (error) {
    console.error('Failed to check reconfirm status:', error)
    reconfirmFlag.value = false
  }
}

// Initialize trigger function
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  await checkReconfirmStatus()
})
</script>

<style scoped>
/* Block border: Use theme border color to avoid light/blue borders appearing in dark mode */
.grafana-key-block {
  border: 1px solid var(--cui-border-color);
  border-radius: 6px;
}
.grafana-key-block .content-box {
  border-color: var(--cui-border-color);
}

h4 {
  color: var(--cui-body-color);
  border-bottom: 2px solid var(--cui-border-color);
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.key-section {
  margin-bottom: 20px;
}

.key-section:last-of-type {
  margin-bottom: 0;
}

.key-section-title {
  color: var(--cui-body-color);
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.key-content-area {
  background: var(--cui-body-bg);
  border: 1px solid var(--cui-border-color);
  border-radius: 4px;
  padding: 12px;
  height: 300px;
  overflow-y: auto;
  word-wrap: break-word;
  word-break: break-all;
}

.key-content-area-small {
  height: 100px;
}

.key-content-text {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: var(--cui-body-color);
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  overflow-wrap: break-word;
}

.key-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--cui-border-color);
}

/* Prevent 'Generate Key' button text wrapping */
:deep(.optimized-table button) {
  white-space: nowrap;
}
</style>
