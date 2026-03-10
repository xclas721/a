<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">MFA AUTH</h5>
          <button
            type="button"
            class="btn-close"
            data-coreui-dismiss="modal"
            aria-label="Close"
            @click="closeDialog"
          ></button>
        </div>
        <div class="modal-body">
          <div class="rounded m-0 t-16 row">
            <div class="col-md-12 d-flex justify-content-center">
              <div class="form-group" style="margin: 0 auto 25px">
                <QrcodeVue :value="mfaQrCode" :size="200" />
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group" style="width: 30%; margin: 0 auto 25px">
                <span class="form-label d-flex justify-content-center">
                  {{ $t('ui.mfa.authentication.code') }}
                </span>
                <input
                  ref="verificationInput"
                  style="text-align: center"
                  class="form-control"
                  v-model="verificationCodeInput"
                  maxlength="10"
                  @input="verificationCodeInput = verificationCodeInput.replace(/\D/g, '')"
                  pattern="[0-9]*"
                />
              </div>
            </div>
          </div>
          <div class="mt-2 d-flex justify-content-center">
            <button class="btn btn-primary mt-3 me-3" @click="mfaBinding">
              {{ $t('ui.mfa.authentication.qrcode.confirmed') }}
            </button>
            <button class="btn btn-primary mt-3" @click="closeDialog">
              {{ $t('ui.mfa.authentication.qrcode.cancel') }}
            </button>
          </div>
        </div>
        <div class="mt-2" style="width: 50%; margin: 0 auto 25px">
          <div class="text-center mx-3">
            <!-- Add centering container -->
            <b>{{ $t('ui.mfa.authentication.qrcode.message') }}</b> <br />
            <b>{{ $t('ui.mfa.authentication.qrcode.message1') }}</b> <br />
            <b>{{ $t('ui.mfa.authentication.qrcode.message2') }}</b>
          </div>

          <div class="d-flex flex-column align-items-center mt-3">
            <!-- Use Flex layout -->
            <span class="mb-2">{{ $t('ui.main.technology.provides') }}</span>
            <img
              alt="HITRUST Certified"
              class="logo"
              src="../../../../assets/img/hitrust_logo.svg"
              width="155"
              height="50"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ApiUtil from '@/utils/apiUtils'
import swalMessage from '@/plugins/swalMessage'
import QrcodeVue from 'qrcode.vue'

const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const props = defineProps<{
  modelValue: boolean
  userData: Record<string, any>
}>()
const emit = defineEmits(['update:modelValue', 'refreshCode'])
const showFlag = ref(props.modelValue)
const mfaQrCode = ref('')
const verificationCodeInput = ref('')
const verificationInput = ref<HTMLInputElement | null>(null)
// Watch modelValue to control showFlag
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal) {
      const param = {
        systemName: props.userData.systemName,
        otpauthIssuer: props.userData.otpAuthIssuer,
        accountName: props.userData.userAccount
      }
      const result = await apiUtil.post(`/index/auth/qrcode`, param, {}, false)
      if (result.success && result.code == '0000') {
        mfaQrCode.value = result.data
      }
    }
    showFlag.value = newVal
    // Use nextTick to ensure DOM is updated
    await nextTick(() => {
      if (verificationInput.value) {
        verificationInput.value.focus()
      }
    })
  },
  { immediate: true }
)

const dispalyCss = computed(() => {
  return showFlag.value ? `display:block;background:rgba(0,0,0,0.7);` : `display:none;background:rgba(0,0,0,0.7);`
})

// Close popup
const closeDialog = () => {
  showFlag.value = false
  emit('update:modelValue', false)
}
const mfaBinding = async () => {
  if (!verificationCodeInput.value) {
    await swalMessage.error(t('ui.mfa.authentication.code'))
    return
  }
  swalMessage.confirm(t('ui.mfa.authentication.qrcode.binding'), '', async () => {
    const matchResult = mfaQrCode.value.match(/secret=([^&]+)/)
    const secret = matchResult ? matchResult[1] : null
    const param = {
      systemName: props.userData.systemName,
      otpauthIssuer: props.userData.otpAuthIssuer,
      accountName: props.userData.userAccount,
      secret: secret,
      code: verificationCodeInput.value,
      loginNonce: props.userData.loginNonce
    }
    const result = await apiUtil.post(`/index/auth/authData`, param, {}, false)

    emit('refreshCode', {})
    if (result.success && result.code == '0000') {
      mfaQrCode.value = result.date
    } else {
      await swalMessage.error(result.message)
      return
    }
    showFlag.value = false
    emit('update:modelValue', false)
  })
}
onMounted(async () => {})
</script>

<style>
.modal-dialog {
  max-width: 50%;
  margin: 5rem auto;
}

.modal-content {
  border: 0;
}
</style>
