<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ computedTitle }}</h5>
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
              <FormInput
                :ID="'account'"
                :LabelVal="'ui.change-password.account'"
                :type="'text'"
                v-model="form.account"
                :maxlength="'100'"
                :readOnly="true"
              />
            </div>

            <div class="col-md-12" v-if="updateFlag == 0">
              <FormInput
                :ID="'newAccount'"
                :LabelVal="'ui.change-password.new-account'"
                :type="'text'"
                v-model="form.newAccount"
                :maxlength="'100'"
              />
            </div>

            <div class="col-md-12">
              <FormPassword
                :ID="'pdfield'"
                :LabelVal="'ui.change-password.old-password'"
                :type="'password'"
                v-model="form.pdfield"
                :maxlength="'99'"
                :readOnly="false"
                :required="true"
                :pd-restrict="pdParam.pdRestrict"
                :invalids="pdfieldInvalids"
                @update:invalids="(newInvalids: boolean) => (pdfieldInvalids = newInvalids)"
              />
            </div>

            <div class="col-md-12">
              <FormPassword
                :ID="'newPdfield'"
                :LabelVal="'ui.change-password.new-password'"
                :type="'password'"
                v-model="form.newPdfield"
                :maxlength="'99'"
                :required="true"
                :readOnly="false"
                :pd-restrict="pdParam.pdRestrict"
                :invalids="newPdfieldInvalids"
                :valid="true"
                @update:invalids="(newInvalids: boolean) => (newPdfieldInvalids = newInvalids)"
              />
            </div>

            <div class="col-md-12">
              <FormPassword
                :ID="'confirmPdfield'"
                :LabelVal="'ui.change-password.confirm-password'"
                :type="'password'"
                v-model="form.confirmPdfield"
                :maxlength="'99'"
                :required="true"
                :readOnly="false"
                :pd-restrict="pdParam.pdRestrict"
                :invalids="confirmPdfieldInvalids"
                @update:invalids="(newInvalids: boolean) => (confirmPdfieldInvalids = newInvalids)"
              />
            </div>
          </div>
          <div class="form-footer-buttons mt-3">
            <div class="d-flex justify-content-end align-items-center gap-2 w-100">
              <FormButton noWrapper label="btn.cancel" type="button" variant="secondary" @click="closeDialog" />
              <FormButton noWrapper label="ui.login.submit" type="button" variant="primary" @click="login" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ApiUtil from '@/utils/apiUtils'
import FormInput from '@/components/formTable/FormInput.vue'
import FormPassword from '@/components/formTable/FormPassword.vue'
import FormButton from '@/components/formTable/FormButton.vue'
import swalMessage from '@/plugins/swalMessage'
import { encrypt, encryptPd } from '@/utils/util'
import { validatePassword, validateBasicPassword } from '@/utils/passwordValidation'

const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const props = defineProps<{
  loginRandom8digits: string
  userAccount: string
  modelValue: boolean
  title: string
  updateFlag: number
  userData: Record<string, any>
}>()
const emit = defineEmits(['update:modelValue', 'refreshCode', 'loginSuccess'])
const showFlag = ref(props.modelValue)
const pdParam = ref<Record<string, any>>({})
const random8digits = ref()
const newPdfieldInvalids = ref(false)
const pdfieldInvalids = ref(false)
const confirmPdfieldInvalids = ref(false)
const form = reactive({
  account: '',
  newAccount: '',
  pdfield: '',
  newPdfield: '',
  confirmPdfield: ''
})
watch(
  () => form,
  () => {
    if (form.pdfield) {
      pdfieldInvalids.value = false
    }
    if (form.newPdfield) {
      newPdfieldInvalids.value = false
    }
    if (form.confirmPdfield) {
      confirmPdfieldInvalids.value = false
    }
  },
  { deep: true }
)
watch(
  () => props.userAccount,
  (newVal) => {
    form.account = newVal
  },
  { immediate: true }
)
watch(
  () => props.loginRandom8digits,
  (newVal) => {
    random8digits.value = newVal
  },
  { immediate: true }
)
// Watch modelValue to control showFlag
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal) {
      const result = await apiUtil.get(
        '/condition/pdPolicyParam',
        {
          issuerOid: '',
          organ: 'hosted',
          loginNonce: props.userData.loginNonce
        },
        {},
        false
      )
      pdParam.value = result.data
    }
    showFlag.value = newVal
  },
  { immediate: true }
)
const computedTitle = computed(() => {
  return props.title ? t(props.title) : ''
})

const dispalyCss = computed(() => {
  return showFlag.value ? `display:block;background:rgba(0,0,0,0.7);` : `display:none;background:rgba(0,0,0,0.7);`
})

// Close popup
const closeDialog = () => {
  showFlag.value = false
  emit('update:modelValue', false)
}
const login = async () => {
  if (form.pdfield == '') {
    pdfieldInvalids.value = true
  }
  if (form.newPdfield == '') {
    newPdfieldInvalids.value = true
  }
  if (form.confirmPdfield == '') {
    confirmPdfieldInvalids.value = true
  }
  if (pdfieldInvalids.value || newPdfieldInvalids.value || confirmPdfieldInvalids.value) {
    return
  }

  // Basic password validation
  const accountToCheck = props.updateFlag == 0 ? form.newAccount : form.account
  const basicValidation = await validateBasicPassword(
    form.newPdfield,
    form.confirmPdfield,
    form.pdfield,
    accountToCheck,
    t
  )
  if (!basicValidation.isValid) {
    await swalMessage.error(basicValidation.message)
    return
  }

  // Password policy validation
  const passwordValidation = await validatePassword(form.newPdfield, pdParam.value, t)
  if (!passwordValidation.isValid) {
    await swalMessage.error(passwordValidation.message)
    return
  }

  const hashAlgorithm = await apiUtil.get(
    '/condition/getHashAlgorithm',
    {
      account: form.account,
      organ: 'hosted',
      loginNonce: props.userData.loginNonce
    },
    {},
    false
  )
  const encryptPdfield = encrypt(random8digits.value, form.account, form.pdfield, hashAlgorithm.data.userHash ?? '')

  if (props.updateFlag == 0) {
    const encryptNewPdfield = encryptPd(form.newAccount, form.newPdfield, hashAlgorithm.data.userHash ?? '')
    const submtiForm = {
      account: form.account,
      newAccount: form.newAccount,
      random8digits: random8digits.value,
      encryptPdfield: encryptPdfield,
      encryptNewPdfield: encryptNewPdfield,
      loginNonce: props.userData.loginNonce
    }
    const result = await apiUtil.post('/hosted/index/sysadm_first_login', submtiForm, {}, false)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)

      // Update verification code
      emit('refreshCode', {})
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (props.updateFlag == 1) {
    const encryptNewPdfield = encryptPd(form.account, form.newPdfield, hashAlgorithm.data.userHash ?? '')
    const submtiForm = {
      account: form.account,
      random8digits: random8digits.value,
      encryptPdfield: encryptPdfield,
      encryptNewPdfield: encryptNewPdfield,
      loginNonce: props.userData.loginNonce
    }
    const result = await apiUtil.post('/hosted/index/first_login', submtiForm, {}, false)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)

      // Update verification code
      emit('refreshCode', {})
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else {
    const encryptNewPdfield = encryptPd(form.account, form.newPdfield, hashAlgorithm.data.userHash ?? '')
    const submtiForm = {
      account: form.account,
      random8digits: random8digits.value,
      encryptPdfield: encryptPdfield,
      encryptNewPdfield: encryptNewPdfield,
      loginNonce: props.userData.loginNonce
    }
    const result = await apiUtil.post('/hosted/index/refresh_pd', submtiForm, {}, false)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)

      // Update verification code
      emit('refreshCode', {})
    } else {
      await swalMessage.error(result.message)
      return
    }
  }

  showFlag.value = false
  emit('update:modelValue', false)
}
onMounted(async () => {})
</script>

<style>
.modal-dialog {
  max-width: 35%;
  margin: 5rem auto;
}

.modal-content {
  border: 0;
}
</style>
