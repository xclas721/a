<template>
  <!-- FIDO User Status Query Popup -->
  <div class="modal fade show" style="display: block" tabindex="-1">
    <div class="modal-dialog" style="max-width: 60vw; width: 60vw">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('ui.fido.user-status.title') }} - {{ props.userName || props.userId }}</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body">
          <!-- User Basic Info -->
          <div class="border border-light-subtle" v-if="userStatus">
            <div class="header-title">{{ $t('ui.fido.user-status.basic-info') }}</div>
            <div class="content-box p-3">
              <div class="row mb-3">
                <div class="col-md-12">
                  <div class="row">
                    <div class="col">
                      <div class="mb-3">
                        <span class="form-label fw-bold">{{ $t('ui.fido.user-status.issuer') }}:</span>
                        <p class="mb-0 value-with-underline">{{ userStatus.issuerName }}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="mb-3">
                        <span class="form-label fw-bold">{{ $t('ui.fido.user-status.user-id') }}:</span>
                        <p class="mb-0 value-with-underline">{{ userStatus.userId }}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="mb-3">
                        <span class="form-label fw-bold">{{ $t('ui.fido.user-status.user-binding-id') }}:</span>
                        <p class="mb-0 value-with-underline">{{ userStatus.userName }}</p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="mb-3">
                        <span class="form-label fw-bold">{{ $t('ui.fido.user-status.attestation') }}:</span>
                        <p class="mb-0 value-with-underline">
                          {{ t('ui.fido.user-status.success') }}
                        </p>
                      </div>
                    </div>
                    <div class="col">
                      <div class="mb-3">
                        <span class="form-label fw-bold">{{ $t('ui.fido.user-status.member') }}:</span>
                        <p class="mb-0 value-with-underline">
                          {{ t('ui.fido.user-status.success') }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="text-end">
                    <button class="btn btn-success" @click="handleUserRemove">
                      {{ $t('ui.fido.user-status.remove') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- User Device Info Table -->
          <div class="mt-3" v-if="userStatus">
            <div class="header-title">{{ $t('ui.fido.user-status.device-info') }}</div>
            <DataTable
              ref="tableRef"
              :title="$t('ui.fido.user-status.device-info')"
              :columns="deviceTableHeader"
              :fetchData="fetchDeviceData"
              :operation-btn-detail="false"
              :operation-btn-update="false"
              :operation-btn-delete="false"
              :custom-buttons="customButtons"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable from '@/components/dataTable/DataTable.vue'
import { type BaseSelect } from '@/utils/select/baseSelect'
import { findAllIssuer } from '@/hooks/issuer'
import { findAllPermissionGroup } from '@/hooks/permissionGroup'
import swalMessage from '@/plugins/swalMessage'
import { userStateStore } from '@/stores/user'
import ApiUtil from '@/utils/apiUtils'

// Props and Emits Definition
interface Props {
  userId?: string // 預設查詢的使用者 ID
  userName?: string // 使用者名稱（用於顯示）
  issuerId?: string // Issuer ID (for Hosted managing single issuer scenario)
}

const props = withDefaults(defineProps<Props>(), {
  userId: '',
  userName: '',
  issuerId: ''
})

const emit = defineEmits(['close'])

const { t } = useI18n()
const userState = userStateStore()

// Initialize API tools
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })

// User status data
const userStatus = ref<any>(null)

// Current logged-in user's FIDO ID
const currentUserFidoId = ref<string>('')

const issuerData = ref<BaseSelect[]>([])
const groupArrayData = ref<BaseSelect[]>([])

// Device deregistration processing
const handleUnregister = async (row: any) => {
  swalMessage.confirm(
    t('ui.fido.user-status.unregister-confirm', { device: row.deviceModel }),
    t('ui.fido.user-status.unregister-title'),
    async () => {
      try {
        // Format username based on user type
        let username = userStatus.value!.fidoResponse.memberId

        if (!username.includes(':')) {
          if (userState.user.type === 'issuer') {
            username = userState.user.bankId + ':' + username
          } else if (userState.user.type === 'hosted') {
            username = 'hosted' + ':' + username
          }
        }

        const response = await apiUtil.post(
          `${getApiPrefix()}/device/remove`,
          {
            rpUsername: username,
            credentialsId: row.bindingId,
            operator: userState.user.account,
            operatorSource: 'ACS_ADMIN'
          },
          {},
          true
        )

        if (response.status === 'ok') {
          swalMessage.success(t('ui.fido.user-status.unregister-success'))

          // Reload device list
          if (tableRef.value) {
            await tableRef.value.fetchPageData()
          }
        } else {
          swalMessage.error(response.errorMessage || t('ui.fido.user-status.unregister-error'))
        }
      } catch (error) {
        console.error(t('ui.fido.user-status.unregister-error'), error)
        swalMessage.error(t('ui.fido.user-status.unregister-error'))
      }
    }
  )
}

// Control deregistration button display
const showUnregisterBtn = (row: any) => {
  // Show deregistration button only for bound devices
  return row.bindingStatus === t('ui.fido.user-status.bound') || t('ui.fido.user-status.current-user')
}

// Control deregistration button disable
const disableUnregisterBtn = (row: any) => {
  // Disable button for deregistered devices
  return row.bindingStatus === t('ui.fido.user-status.unbound')
}

// Custom button configuration
const customButtons = ref([
  {
    label: 'btn.unregister',
    type: 'button' as const,
    variant: 'primary',
    action: handleUnregister,
    btnShow: showUnregisterBtn,
    btnDisable: disableUnregisterBtn
  }
])

// Device table header configuration
const deviceTableHeader = ref<any>([
  {
    header: 'ui.fido.user-status.create-time',
    field: 'createTime',
    dateFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    header: 'ui.fido.user-status.binding-id',
    field: 'bindingId'
  },
  {
    header: 'ui.fido.user-status.device-model',
    field: 'deviceModel'
  },
  {
    header: 'ui.fido.user-status.binding-status',
    field: 'bindingStatus'
  }
])

// Handle query
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (criteria.userId) {
    try {
      // Format username based on user type
      let username = criteria.userId

      // If entered username has no prefix, add prefix based on current user type
      if (!username.includes(':')) {
        if (userState.user.type === 'issuer') {
          // issuer type: bankId + ':' + account
          username = userState.user.bankId + ':' + criteria.userId
        } else if (userState.user.type === 'hosted') {
          if (props.issuerId) {
            // Hosted managing single issuer:issuerId + ':' + account
            username = props.issuerId + ':' + criteria.userId
          } else {
            // hosted type: 'hosted' + ':' + account
            username = 'hosted' + ':' + criteria.userId
          }
        }
      }

      // Call backend API: dynamically select API path (apiUtil will automatically add /api)
      const response = await apiUtil.post(
        `${getApiPrefix()}/queryUserInfoEx`,
        {
          username: username
        },
        {},
        true
      )

      if (response.status === 'ok') {
        // Successful response, set user status
        userStatus.value = {
          userId: criteria.userId,
          userName: response.memberId || criteria.userId,
          issuerName: criteria.issuerName || 'Issuing Bank',
          groupName: criteria.groupName || 'Default Group',
          status: response.attestationStatus === '0' ? 'Y' : 'N',
          // Store complete response data for later use
          fidoResponse: response
        }

        // Wait for DOM update to complete then refresh table
        await nextTick()

        // Refresh table
        if (tableRef.value) {
          tableRef.value.currentPage = 1
        }
      } else {
        // API error response
        let errorMessage = response.errorMessage || t('ui.fido.user-status.query-error')

        // Provide friendlier message for specific error codes
        if (response.returnCode === 'VeriFIDO-E004') {
          errorMessage = t('ui.fido.user-status.user-not-found')
          // Close popup immediately, then show error message
          emit('close')
          swalMessage.error(errorMessage)
        } else if (response.returnCode === 'Z002') {
          // Permission check failed
          errorMessage = t('ui.fido.user-status.access-denied')
          swalMessage.error(errorMessage)
        } else {
          swalMessage.error(errorMessage)
        }
        userStatus.value = null
      }
    } catch (error) {
      console.error(t('ui.fido.user-status.query-error'), error)
      swalMessage.error(t('ui.fido.user-status.query-error'))
      userStatus.value = null
    }
  } else {
    swalMessage.warning(t('ui.fido.user-status.user-id-required'))
  }
}

// Select API path based on current logged-in user type
const getApiPrefix = () => {
  // Decide which API to use based on user type
  if (userState.user.type === 'issuer') {
    // Issuer user uses Issuer API
    return '/fido2_issuer'
  } else if (userState.user.type === 'hosted') {
    // Hosted user uses Hosted API
    return '/fido2_admin'
  } else {
    // Default to using Hosted API
    return '/fido2_admin'
  }
}

// Get device data
const fetchDeviceData = async (page: number) => {
  if (!userStatus.value?.fidoResponse?.memberId) {
    return { data: [], totalItems: 0 }
  }

  try {
    // Format username based on user type
    let username = userStatus.value.fidoResponse.memberId

    if (!username.includes(':') && !username.includes('-')) {
      if (userState.user.type === 'issuer') {
        username = userState.user.bankId + ':' + username
      } else if (userState.user.type === 'hosted') {
        if (props.issuerId) {
          // Hosted managing single issuer:issuerId + ':' + username
          username = props.issuerId + ':' + username
        } else {
          // hosted type: 'hosted' + ':' + username
          username = 'hosted' + ':' + username
        }
      }
    }

    const response = await apiUtil.post(`${getApiPrefix()}/user/device/info`, { username: username }, {}, true)

    if (response.status === 'ok' && response.items) {
      // Convert data format to match frontend display
      const devices = response.items.map((item: any) => {
        const bindingId = item.credentialsId || ''
        const isCurrentUser = bindingId === currentUserFidoId.value

        const baseStatus = item.status === '1' ? t('ui.fido.user-status.bound') : t('ui.fido.user-status.unbound')

        const bindingStatus = isCurrentUser ? `${baseStatus} / ${t('ui.fido.user-status.current-user')}` : baseStatus

        return {
          bindingId: bindingId,
          deviceModel: item.deviceType || '',
          createTime: item.createDttm || '',
          bindingStatus: bindingStatus,
          isCurrentUser: isCurrentUser
        }
      })

      // Implement frontend pagination logic (fixed 5 items per page)
      const pageSize = 5
      const totalItems = devices.length
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedData = devices.slice(startIndex, endIndex)

      return {
        data: paginatedData,
        totalItems: totalItems
      }
    } else {
      console.error(t('ui.fido.user-status.device-query-error'), response.errorMessage)
      return { data: [], totalItems: 0 }
    }
  } catch (error) {
    console.error(t('ui.fido.user-status.device-query-error'), error)
    return { data: [], totalItems: 0 }
  }
}

// User deregistration
const handleUserRemove = async () => {
  if (!userStatus.value) return

  swalMessage.confirm(
    t('ui.fido.user-status.remove-confirm', { userId: userStatus.value.userId }),
    t('ui.fido.user-status.remove-title'),
    async () => {
      try {
        // Format username based on user type
        let username = userStatus.value!.userId

        if (!username.includes(':')) {
          if (userState.user.type === 'issuer') {
            username = userState.user.bankId + ':' + username
          } else if (userState.user.type === 'hosted') {
            if (props.issuerId) {
              // Hosted managing single issuer:issuerId + ':' + username
              username = props.issuerId + ':' + username
            } else {
              // hosted type: 'hosted' + ':' + username
              username = 'hosted' + ':' + username
            }
          }
        }

        const response = await apiUtil.post(
          `${getApiPrefix()}/user/remove`,
          {
            username: username,
            operator: userState.user.account,
            operatorSource: 'ACS_ADMIN'
          },
          {},
          true
        )

        if (response.status === 'ok') {
          swalMessage.success(t('ui.fido.user-status.remove-success'))
          userStatus.value = null

          // Clear table
          if (tableRef.value) {
            tableRef.value.currentPage = 1
            await tableRef.value.fetchPageData()
          }

          // Auto close popup because user has been deregistered, no data to display
          emit('close')
        } else {
          swalMessage.error(response.errorMessage || t('ui.fido.user-status.remove-error'))
        }
      } catch (error) {
        console.error(t('ui.fido.user-status.remove-error'), error)
        swalMessage.error(t('ui.fido.user-status.remove-error'))
      }
    }
  )
}

// Initialize data
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  groupArrayData.value = await findAllPermissionGroup(userState.user.issuerOid)

  // Get current logged-in user's FIDO ID
  try {
    // Get FIDO login info from sessionStorage or localStorage
    const fidoLoginData = sessionStorage.getItem('fidoLoginData') || localStorage.getItem('fidoLoginData')
    if (fidoLoginData) {
      const parsedData = JSON.parse(fidoLoginData)
      if (parsedData.userData && parsedData.userData.id) {
        currentUserFidoId.value = parsedData.userData.id
      }
    }
  } catch (error) {
    console.warn('無法取得當前使用者的 FIDO ID:', error)
  }

  // If userId is passed, automatically execute query
  if (props.userId) {
    searchCriteria.value.userId = props.userId
    await handleSearch(searchCriteria.value)
  }
})
</script>

<style scoped>
.value-with-underline {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 2px;
  min-height: 20px;
}

/* Current user FIDO ID marker style */
.current-user-fido {
  color: #0d6efd;
  font-weight: bold;
  background-color: #e7f3ff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #b3d9ff;
}
</style>
