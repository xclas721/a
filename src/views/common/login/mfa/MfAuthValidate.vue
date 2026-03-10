<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">MFA Auth Validate</h5>
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
            <div class="col-md-12">
              <div class="form-group" style="width: 50%; margin: 0 auto 25px">
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
            <button class="btn btn-primary mt-3 me-3" @click="submit">
              {{ $t('ui.mfa.authentication.submit') }}
            </button>
            <button class="btn btn-primary mt-3" @click="closeDialog">
              {{ $t('btn.cancel') }}
            </button>
          </div>
        </div>
        <div class="mt-2">
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
import { computed, nextTick, ref, watch } from 'vue'
import ApiUtil from '@/utils/apiUtils'
import swalMessage from '@/plugins/swalMessage'

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const props = defineProps<{
  modelValue: boolean
  userData: Record<string, any>
}>()
const emit = defineEmits(['update:modelValue', 'loginSuccess'])
const showFlag = ref(props.modelValue)
const verificationCodeInput = ref('')
const verificationInput = ref<HTMLInputElement | null>(null)
// Watch modelValue to control showFlag
watch(
  () => props.modelValue,
  async (newVal) => {
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
const submit = async () => {
  const param = {
    systemName: props.userData.systemName,
    otpauthIssuer: props.userData.otpAuthIssuer,
    accountName: props.userData.userAccount,
    code: verificationCodeInput.value,
    loginNonce: props.userData.loginNonce
  }
  const result = await apiUtil.post(`/index/auth/code`, param, {}, false)
  if (result.success && result.code == '0000') {
    emit('loginSuccess', { ...result.data })
  } else {
    await swalMessage.error(result.message)
    return
  }
  showFlag.value = false
  emit('update:modelValue', false)
}
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
