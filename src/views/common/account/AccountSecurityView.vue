<template>
  <div class="pb-4">
    <QueryCriteriaComponent :criteriaConfig="[]" :title="$t('ui.main.menu.account-security')" :hideBtn="true" />

    <div class="account-security-card border rounded p-3">
      <!-- Institute ID & User ID（來自登入使用者） -->
      <div class="row mb-3">
        <div class="col-md-6 mb-2 mb-md-0">
          <label class="form-label">{{ $t('ui.account-security.institute-id') }}</label>
          <input type="text" class="form-control" disabled :value="instituteDisplay" />
        </div>
        <div class="col-md-6">
          <label class="form-label">{{ $t('ui.account-security.user-id') }}</label>
          <input type="text" class="form-control" disabled :value="userState.user.account" />
        </div>
      </div>

      <!-- Password -->
      <div class="mb-3">
        <label class="form-label">{{ $t('ui.account-security.password') }}</label>
        <div>
          <UtilityButton
            label="ui.main.menu.change-password"
            variant="primary"
            appearance="contained"
            size="sm"
            @click="openChangePassword"
          />
        </div>
      </div>

      <div v-if="userState.user.fidoEnabled === '1'" class="mb-3">
        <label class="form-label">{{ $t('ui.account-security.passkey') }}</label>
        <p class="text-muted small mb-2">
          {{ $t('ui.account-security.passkey.desc') }}
        </p>
        <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
          <UtilityButton
            label="ui.account-security.add-passkey"
            variant="primary"
            appearance="contained"
            size="sm"
            @click="openFidoRegister"
          />
        </div>

        <div class="table-responsive" v-if="currentUserMemberId">
          <DataTable
            ref="deviceTableRef"
            :title="$t('ui.fido.user-status.device-info')"
            :columns="deviceTableHeader"
            :fetchData="fetchDeviceData"
            :operation-btn-detail="false"
            :operation-btn-update="false"
            :operation-btn-delete="false"
            :custom-buttons="deviceCustomButtons"
          />
        </div>
        <p v-else class="text-muted small mb-0">{{ $t('ui.account-security.passkey.loading-or-none') }}</p>
      </div>

      <!-- Multi-factor Authentication -->
      <div>
        <label class="form-label">{{ $t('ui.account-security.mfa') }}</label>
        <p class="text-muted small mb-2">
          {{ $t('ui.account-security.mfa.desc') }}
        </p>
        <UtilityButton
          v-if="userState.user.mfa"
          label="ui.mfa.authentication.qrcode.unbinding.mfa"
          variant="primary"
          appearance="contained"
          size="sm"
          @click="unbindMFA"
        />
      </div>
    </div>

    <ChangePassword
      v-if="changePwdShow"
      v-model="changePwdShow"
      :user-account="userState.user.account"
      :login-random8digits="random8digits"
      @header-logout="headerLogout"
    />

    <FidoRegisterModal v-if="showFidoRegisterModal" @close="closeFidoRegisterAndRefresh" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import UtilityButton from '@/components/UtilityButton.vue'
import ChangePassword from '@/views/common/login/ChangePassword.vue'
import FidoRegisterModal from '@/components/fido/FidoRegisterModal.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { logout } from '@/utils/authUserUtils'
import { resetRouter } from '@/router'
import swalMessage from '@/plugins/swalMessage'

defineOptions({
  name: 'AccountSecurity'
})

const { t } = useI18n()
const userState = userStateStore()
const appStore = useAppStore()
const apiUtil = new ApiUtil({ showModel: (params: unknown) => console.log(params) })

// 與 hosted 其他分頁一致：hosted 且無 issuerOid 時顯示「系統預設參數」(ui.rba.default)
const instituteDisplay = computed(() =>
  appStore.organ === 'hosted' && !userState.user.issuerOid ? t('ui.rba.default') : userState.user.issuerOid
)

const changePwdShow = ref(false)
const random8digits = ref('')
const showFidoRegisterModal = ref(false)

// 當前使用者的 FIDO memberId（用於裝置列表 API）
const currentUserMemberId = ref<string | null>(null)
const currentUserFidoId = ref<string>('')
const deviceTableRef = ref<InstanceType<typeof DataTable> | null>(null)

const getApiPrefix = () => {
  if (userState.user.type === 'issuer') return '/fido2_issuer'
  if (userState.user.type === 'hosted') return '/fido2_admin'
  return '/fido2_admin'
}

const formatUsername = (account: string) => {
  if (userState.user.type === 'issuer') return userState.user.bankId + ':' + account
  if (userState.user.type === 'hosted') return 'hosted' + ':' + account
  return account
}

// 裝置表格欄位：裝置名稱、憑證識別碼、建立時間（不顯示綁定狀態）
const deviceTableHeader = ref([
  { header: 'ui.account-security.device-name', field: 'deviceModel', width: 'auto', headerNoI18n: false },
  { header: 'ui.account-security.credential-id', field: 'bindingId', width: 'auto', headerNoI18n: false },
  {
    header: 'ui.account-security.date-added',
    field: 'createTime',
    width: 'auto',
    headerNoI18n: false,
    dateFormat: 'yyyy-MM-dd HH:mm:ss'
  }
])

const fetchDeviceData = async (page: number) => {
  if (!currentUserMemberId.value) return { data: [], totalItems: 0 }
  try {
    let username = currentUserMemberId.value
    if (!username.includes(':') && !username.includes('-')) {
      username = formatUsername(userState.user.account)
    }
    const response = await apiUtil.post(`${getApiPrefix()}/user/device/info`, { username }, {}, true)
    if (response.status === 'ok' && response.items) {
      const devices = response.items.map((item: Record<string, unknown>) => {
        const bindingId = String(item.credentialsId ?? '')
        const isCurrentUser = bindingId === currentUserFidoId.value
        const isBound = item.status === '1'
        return {
          bindingId,
          deviceModel: String(item.deviceType ?? ''),
          createTime: String(item.createDttm ?? ''),
          isBound,
          isCurrentUser
        }
      })
      const pageSize = 5
      const totalItems = devices.length
      const startIndex = (page - 1) * pageSize
      const paginatedData = devices.slice(startIndex, startIndex + pageSize)
      return { data: paginatedData, totalItems }
    }
    return { data: [], totalItems: 0 }
  } catch (error) {
    console.error(t('ui.fido.user-status.device-query-error'), error)
    return { data: [], totalItems: 0 }
  }
}

const handleDeviceUnregister = async (row: Record<string, unknown>) => {
  swalMessage.confirm(
    t('ui.fido.user-status.unregister-confirm', { device: String(row.deviceModel ?? '') }),
    t('ui.fido.user-status.unregister-title'),
    async () => {
      try {
        let username = currentUserMemberId.value
        if (!username || (!username.includes(':') && !username.includes('-'))) {
          username = formatUsername(userState.user.account)
        }
        const response = await apiUtil.post(
          `${getApiPrefix()}/device/remove`,
          {
            rpUsername: username,
            credentialsId: String(row.bindingId ?? ''),
            operator: userState.user.account,
            operatorSource: 'ACS_ADMIN'
          },
          {},
          true
        )
        if (response.status === 'ok') {
          swalMessage.success(t('ui.fido.user-status.unregister-success'))
          if (deviceTableRef.value) await deviceTableRef.value.fetchPageData()
        } else {
          swalMessage.error(response.errorMessage || t('ui.fido.user-status.unregister-error'))
        }
      } catch {
        swalMessage.error(t('ui.fido.user-status.unregister-error'))
      }
    }
  )
}

// 依 isBound 判斷，不依翻譯字串，切換語系時按鈕不會消失
const showUnregisterBtn = (row: Record<string, unknown>) => Boolean(row.isBound)
const disableUnregisterBtn = (row: Record<string, unknown>) => !row.isBound

const deviceCustomButtons = ref([
  {
    label: 'btn.unregister',
    type: 'button' as const,
    variant: 'primary',
    action: handleDeviceUnregister,
    btnShow: showUnregisterBtn,
    btnDisable: disableUnregisterBtn
  }
])

const loadCurrentUserFidoStatus = async () => {
  try {
    const fidoLoginData = sessionStorage.getItem('fidoLoginData') || localStorage.getItem('fidoLoginData')
    if (fidoLoginData) {
      const parsed = JSON.parse(fidoLoginData)
      if (parsed.userData?.id) currentUserFidoId.value = parsed.userData.id
    }
  } catch {
    // ignore
  }
  try {
    const username = formatUsername(userState.user.account)
    const response = await apiUtil.post(`${getApiPrefix()}/queryUserInfoEx`, { username }, {}, true)
    if (response.status === 'ok' && response.memberId) {
      currentUserMemberId.value = response.memberId
    }
  } catch {
    currentUserMemberId.value = null
  }
}

onMounted(() => {
  if (userState.user.fidoEnabled === '1') {
    loadCurrentUserFidoStatus()
  }
})

const openChangePassword = async () => {
  const prepareResult = await apiUtil.get('/condition/prepare', null, {}, false)
  random8digits.value = prepareResult.data
  changePwdShow.value = true
}

const openFidoRegister = () => {
  showFidoRegisterModal.value = true
}

/** 解除綁定 MFA（確認後呼叫後端 delData，成功則註銷） */
const unbindMFA = () => {
  swalMessage.confirm(t('ui.mfa.confirmUnbind.msg'), t('ui.mfa.confirmUnbind.title'), async () => {
    const result = await apiUtil.post(
      '/index/auth/delData',
      {
        accountName: userState.user.account,
        issuerOid: userState.user.issuerOid === '' ? null : userState.user.issuerOid,
        userType: userState.user.userType
      },
      {},
      true
    )
    if (result.success && result.code === '0000') {
      await swalMessage.success(result.message)
      await headerLogout()
    } else {
      await swalMessage.error(result.message)
    }
  })
}

const closeFidoRegisterAndRefresh = () => {
  showFidoRegisterModal.value = false
  loadCurrentUserFidoStatus().then(() => {
    if (deviceTableRef.value) deviceTableRef.value.fetchPageData()
  })
}

const headerLogout = async () => {
  await apiUtil.get(`/${appStore.organ}/index/logout`, null, {}, true)
  logout()
  resetRouter()
}
</script>

<style scoped lang="scss">
.account-security-card {
  background-color: var(--cui-body-bg);
  border-color: var(--cui-border-color) !important;

  /* Same as DataTable action buttons: width content, not force min-width */
  .btn {
    padding: 4px 20px;
    font-size: 14px;
    border-radius: 6px;
  }
}
</style>
