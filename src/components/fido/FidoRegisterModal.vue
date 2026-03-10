<template>
  <!-- FIDO Registration Popup -->
  <div class="modal fade show" style="display: block" tabindex="-1">
    <div class="modal-dialog" style="max-width: 35vw; width: 35vw">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('ui.fido.management.register') }}</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="rounded m-0 t-16 row">
            <div class="col-md-12 mb-2">
              <FormInput
                :ID="'account'"
                :LabelVal="'ui.change-password.account'"
                :type="'text'"
                v-model="account"
                :maxlength="'100'"
                :readOnly="true"
              />
            </div>

            <div class="col-md-12 mb-2">
              <FormInput
                :ID="'displayName'"
                :LabelVal="'ui.issuer-user.name'"
                :type="'text'"
                v-model="displayName"
                :maxlength="'100'"
                :readOnly="true"
              />
            </div>

            <div class="col-md-12 mb-2">
              <FormInput
                :ID="'deviceName'"
                :LabelVal="'ui.issuer-user.deviceName'"
                :type="'text'"
                v-model="deviceName"
                :maxlength="'20'"
                :readOnly="false"
                :required="true"
                :invalids="deviceNameInvalids"
                @update:invalids="(newInvalids: boolean) => (deviceNameInvalids = newInvalids)"
              />
            </div>
          </div>
          <div class="float-end">
            <button class="btn btn-primary mt-3 me-3" @click="bindFido">
              {{ $t('ui.fido.management.register') }}
            </button>
            <button class="btn btn-primary mt-3 me-3" @click="reSet">
              {{ $t('btn.reset') }}
            </button>
            <button class="btn btn-primary mt-3" @click="emit('close')">
              {{ $t('btn.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormInput from '@/components/formTable/FormInput.vue'
import swalMessage from '@/plugins/swalMessage'
import { userStateStore } from '@/stores/user'
import { HiFidoAttestation } from '@/plugins/HiFidoClientSdk'
import { appConfig } from '@/config'

const { t } = useI18n()
const userState = userStateStore()

// Emits Definition
const emit = defineEmits(['close'])

const account = ref(userState.user.account)
const bankId = ref(userState.user.bankId)
const displayName = ref(userState.user.userName)
const deviceName = ref('')
const deviceNameInvalids = ref(false)

const url = ref(appConfig.API_BASE_URL)
const systemId = ref(appConfig.SYSTEM_ID)

// Watch device name changes, clear error status
watch(
  () => deviceName.value,
  (newVal) => {
    if (newVal && newVal.trim()) {
      deviceNameInvalids.value = false
    }
  }
)

/**
 * Reset
 */
const reSet = () => {
  deviceName.value = ''
  deviceNameInvalids.value = false
}

function bindFido() {
  // Validate device name (required)
  const trimmedDeviceName = deviceName.value ? deviceName.value.trim() : ''
  if (!trimmedDeviceName) {
    deviceNameInvalids.value = true
    return
  }

  // Validate device name length (max 20 chars)
  if (trimmedDeviceName.length > 20) {
    deviceNameInvalids.value = true
    return
  }

  // Fill back trimmed value
  deviceName.value = trimmedDeviceName

  doAttestation().then((result) => {
    console.log('[result]: ' + result.success + '[code]: ' + result.code + '[message]: ' + result.message)
    if (result.success && result.code == '0000') {
      console.log('[bindFido][success]')
      swalMessage.success(result.message)
      // Close popup after successful registration
      emit('close')
    } else {
      console.log('[bindFido][fail]')
      swalMessage.error(result.message)
    }
  })
}

type AttestationResult = {
  success: boolean
  code: string
  message: string
}

/*
 * Register
 */
function doAttestation(): Promise<AttestationResult> {
  const rpUrl = url.value + '/api'
  console.log('rpUrl = ' + rpUrl)
  let userName = account.value
  // [[__${session.adminUser.getAccount()}__]]
  const type = userState.user.type
  // Need to distinguish System Admin or RP USER
  console.log('type = ' + type)
  if (type == 'issuer') {
    // RP USER Username is TaxId + ":" + Account
    userName = bankId.value + ':' + account.value
  }
  if (type == 'hosted') {
    userName = 'hosted' + ':' + account.value
  }
  console.log('userName = ' + userName)

  if (globalThis.PublicKeyCredential) {
    console.log('Supported, start attestation')

    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((available) => {
      console.log('[available]' + available)
      if (available) {
        console.log('Platform Authenticator Supported.')

        return HiFidoAttestation(
          rpUrl,
          systemId.value,
          userName,
          displayName.value,
          '',
          null,
          false,
          deviceName.value,
          false
        ).then(
          () => {
            return {
              success: true,
              code: '0000',
              message: t('fido.success.platform_authenticator')
            }
          },
          (error_) => {
            return {
              success: false,
              code: error_,
              message: error_
            }
          }
        )
      } else {
        console.log('WebAuthn supported, Platform Authenticator *not* supported.')
        return {
          success: false,
          code: '',
          message: t('fido.error.platform_authenticator_not_supported')
        }
      }
    })
  } else {
    return Promise.reject({
      success: false,
      code: 'Browser not supported!',
      message: t('fido.error.browser_not_supported')
    })
  }
}
</script>

<style scoped>
.modal-content {
  border: 0;
}
</style>
