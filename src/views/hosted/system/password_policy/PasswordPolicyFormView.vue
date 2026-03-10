<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ computedTitle }}</h5>
          <button
            type="button"
            class="btn-close"
            data-coreui-dismiss="modal"
            aria-label="Close"
            @click="goBack"
          ></button>
        </div>

        <div class="modal-body">
          <div class="p-3">
            <div v-if="reconfirmFlag" class="my-2 w-100">
              <span class="alert alert-success d-flex">{{
                $t('ui.reconfirm.message.add-to-reconfirm-sucessful')
              }}</span>
            </div>
            <div class="rounded m-0 t-16 row">
              <!-- (1)Issuer Bank -->
              <div class="col-md-12 mb-3">
                <div class="form-group">
                  <span :class="['required', { 'text-danger': error.issuerOid }]">
                    {{ $t('ui.issuer.name')
                    }}<!--發卡銀行-->
                  </span>
                  <select
                    v-model="formData.issuerOid"
                    :class="['form-control', { 'input-error': error.issuerOid }]"
                    :disabled="formTitle == 'DETAIL' || formTitle == 'UPDATE'"
                  >
                    <option v-for="option in issuerOptions" :key="option.value || 'null'" :value="option.value">
                      {{ isBaseI18nSelect(option as any) ? t((option as any).i18nText) : (option as any).text }}
                    </option>
                  </select>
                </div>
                <div v-if="error.issuerOid" class="text-danger">
                  {{ $t('warn.can.not.empty') }}
                </div>
              </div>
              <!-- Data Edit Area - Password Policy Management -->
              <div class="col-md-12">
                <div class="row">
                  <!-- Left Card -->
                  <div class="col-md-6">
                    <!-- Block 1: Password Length Setting -->
                    <div class="mb-3">
                      <div class="border border-light-subtle h-100">
                        <div class="header-title">
                          {{ $t('ui.password-policy.length-settings') }}
                        </div>
                        <div class="content-box p-3">
                          <div class="row">
                            <!-- Password min length -->
                            <div class="col-md-6 mb-3">
                              <div>
                                <span :class="['required', { 'text-danger': error.pdMinLength }]">
                                  {{ $t('ui.issuer-param.pd-min-length')
                                  }}<!-- Password min length -->
                                </span>
                                <input
                                  v-model="formData.pdMinLength"
                                  :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                  :class="['form-control', { 'input-error': error.pdMinLength }]"
                                  maxlength="2"
                                  @input="onInput('pdMinLength')"
                                  ref="minLengthInput"
                                  :placeholder="$t('ui.issuer-param.pd-min-length.limit')"
                                  oninput="value = value.replace(/\D/g, '')"
                                />
                              </div>
                              <div v-if="error.pdMinLength" class="text-danger">
                                {{
                                  error.pdMinLength === 'empty'
                                    ? $t('warn.can.not.empty')
                                    : $t('warn.issuer-param.pd-min-length')
                                }}
                              </div>
                            </div>
                            <!-- Password max length -->
                            <div class="col-md-6 mb-3">
                              <div>
                                <span :class="['required', { 'text-danger': error.pdMaxLength }]">
                                  {{ $t('ui.issuer-param.pd-max-length')
                                  }}<!-- Password max length -->
                                </span>
                                <input
                                  v-model="formData.pdMaxLength"
                                  :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                  :class="['form-control', { 'input-error': error.pdMaxLength }]"
                                  maxlength="2"
                                  @input="onInput('pdMaxLength')"
                                  ref="maxLengthInput"
                                  :placeholder="$t('ui.issuer-param.pd-min-length.limit')"
                                  oninput="value = value.replace(/\D/g, '')"
                                />
                              </div>
                              <div v-if="error.pdMaxLength" class="text-danger">
                                {{
                                  error.pdMaxLength === 'empty'
                                    ? $t('warn.can.not.empty')
                                    : $t('warn.issuer-param.pd-min-length')
                                }}
                              </div>
                            </div>
                            <!-- Error Message -->
                            <div v-if="error.minMaxLength" class="text-danger">
                              {{ $t('warn.issuer-param.pd-min-larger-than-max') }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Block 2: Password Rule Setting -->
                    <div class="mb-3">
                      <div class="border border-light-subtle h-100">
                        <div class="header-title">
                          {{ $t('ui.password-policy.rule-settings') }}
                        </div>
                        <div class="content-box p-3">
                          <div class="row">
                            <!-- Password content rules -->
                            <div class="col-md-12 mb-3">
                              <div>
                                <span :class="['required', { 'text-danger': error.formPdContentRule }]">
                                  {{ $t('ui.issuer-param.pd-content-rule') }}
                                </span>
                                <div>
                                  <label
                                    v-for="option in formPdContentRules"
                                    :key="option.value"
                                    :class="[{ 'text-danger': error.formPdContentRule }]"
                                    style="margin-left: 0; width: 45%; vertical-align: top"
                                  >
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                      :value="option.value"
                                      v-model="formData.formPdContentRule"
                                    />
                                    {{ $t(option.label) }}
                                  </label>
                                </div>
                                <div v-if="error.formPdContentRule" class="text-danger">
                                  {{ $t('warn.can.not.empty') }}
                                </div>
                              </div>
                            </div>

                            <!-- Strong Password Restriction -->
                            <div class="col-md-12">
                              <div>
                                <span :class="['required', { 'text-danger': error.pdRestrict }]">
                                  {{ $t('ui.issuer-param.pd-restrict')
                                  }}<!--強密碼要求-->
                                </span>
                                <div>
                                  <label class="me-3">
                                    <input
                                      type="radio"
                                      v-model="formData.pdRestrict"
                                      :value="0"
                                      :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                    />

                                    <span :class="[{ 'text-danger': error.pdRestrict }]"
                                      >&nbsp;{{ $t('ui.issuer-param.pd-restrict.0') }}</span
                                    >
                                  </label>
                                  <label>
                                    <input
                                      type="radio"
                                      v-model="formData.pdRestrict"
                                      :value="1"
                                      :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                    />

                                    <span :class="[{ 'text-danger': error.pdRestrict }]"
                                      >&nbsp;{{ $t('ui.issuer-param.pd-restrict.1') }}</span
                                    >
                                  </label>
                                </div>
                                <div v-if="error.pdRestrict" class="text-danger">
                                  {{ $t('warn.can.not.empty') }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Card -->
                  <div class="col-md-6">
                    <!-- Block 2: Login Security Settings -->
                    <div class="mb-3">
                      <div class="border border-light-subtle h-100">
                        <div class="header-title">
                          {{ $t('ui.password-policy.login-security') }}
                        </div>
                        <div class="content-box p-3">
                          <div class="row">
                            <!-- Login validation failure count -->
                            <div class="col-md-6 mb-3">
                              <div>
                                <span :class="['required', { 'text-danger': error.loginValidateFailedLimit }]">
                                  {{ $t('ui.issuer-param.login-validate-failed-limit')
                                  }}<!-- Login validation failure count -->
                                </span>
                                <input
                                  id="loginValidateFailedLimit"
                                  v-model="formData.loginValidateFailedLimit"
                                  :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                  :class="['form-control', { 'input-error': error.loginValidateFailedLimit }]"
                                  maxlength="2"
                                  data-type="numeric"
                                  :placeholder="$t('ui.issuer-param.login-validate-failed-limit.limit')"
                                  oninput="value = value.replace(/\D/g, '')"
                                />
                              </div>
                              <div v-if="error.loginValidateFailedLimit" class="text-danger">
                                {{ $t('warn.can.not.empty') }}
                              </div>
                            </div>
                            <!-- Login Lockout Time -->
                            <div class="col-md-6 mb-3">
                              <div>
                                <span :class="['required', { 'text-danger': error.loginLockExpiry }]">
                                  {{ $t('ui.issuer-param.login-lock-expiry')
                                  }}<!-- Login Lockout Time -->
                                </span>
                                <input
                                  id="loginLockExpiry"
                                  v-model="formData.loginLockExpiry"
                                  :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                  :class="['form-control', { 'input-error': error.loginLockExpiry }]"
                                  maxlength="3"
                                  data-type="numeric"
                                  :placeholder="$t('ui.issuer-param.login-lock-expiry.limit')"
                                  oninput="value = value.replace(/\D/g, '')"
                                />
                              </div>
                              <div v-if="error.loginLockExpiry" class="text-danger">
                                {{ $t('warn.can.not.empty') }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Block 3: Password History Settings -->
                    <div class="mb-3">
                      <div class="border border-light-subtle h-100">
                        <div class="header-title">
                          {{ $t('ui.password-policy.expiry-settings') }}
                        </div>
                        <div class="content-box p-3">
                          <div class="row">
                            <!-- Password History Records -->
                            <div class="col-md-6 mb-3">
                              <div>
                                <span :class="['required', { 'text-danger': error.pdHistory }]">
                                  {{ $t('ui.issuer-param.issuer-user-pd-history')
                                  }}<!-- Password History Records -->
                                </span>
                                <input
                                  id="pdHistory"
                                  v-model="formData.pdHistory"
                                  :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                  :class="['form-control', { 'input-error': error.pdHistory }]"
                                  maxlength="2"
                                  data-type="numeric"
                                  :placeholder="$t('ui.issuer-param.issuer-user-pd-history.limit')"
                                  oninput="value = value.replace(/\D/g, '')"
                                />
                              </div>
                              <div v-if="error.pdHistory" class="text-danger">
                                {{ $t('warn.can.not.empty') }}
                              </div>
                            </div>
                            <!-- Password Validity Period -->
                            <div class="col-md-6 mb-3">
                              <div>
                                <span :class="['required', { 'text-danger': error.pdExpiry }]">
                                  {{ $t('ui.issuer-param.issuer-user-pd-expiry')
                                  }}<!-- Password Validity Period -->
                                </span>
                                <input
                                  id="pdExpiry"
                                  v-model="formData.pdExpiry"
                                  :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                  :class="['form-control', { 'input-error': error.pdExpiry }]"
                                  maxlength="3"
                                  data-type="numeric"
                                  :placeholder="$t('ui.issuer-param.issuer-user-pd-expiry.limit')"
                                  oninput="value = value.replace(/\D/g, '')"
                                />
                              </div>
                              <div v-if="error.pdExpiry" class="text-danger">
                                {{ $t('warn.can.not.empty') }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Block 4: MFA Settings -->
                    <div class="mb-3">
                      <div class="border border-light-subtle h-100">
                        <div class="header-title">
                          {{ $t('ui.password-policy.auth-settings') }}
                        </div>
                        <div class="content-box p-3">
                          <div class="row">
                            <!-- Enable MFA -->
                            <div class="col-md-6">
                              <div>
                                <span :class="['required', { 'text-danger': error.mfaInd }]">
                                  {{ $t('ui.issuer-param.mfa')
                                  }}<!-- Enable MFA -->
                                </span>
                                <div>
                                  <label class="me-3">
                                    <input
                                      type="radio"
                                      v-model="formData.mfaInd"
                                      :value="1"
                                      :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                    />
                                    <span :class="[{ 'text-danger': error.mfaInd }]">&nbsp;{{ $t('ENABLED.1') }}</span>
                                  </label>
                                  <label>
                                    <input
                                      type="radio"
                                      v-model="formData.mfaInd"
                                      :value="0"
                                      :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                    />
                                    <span :class="[{ 'text-danger': error.mfaInd }]">&nbsp;{{ $t('ENABLED.0') }}</span>
                                  </label>
                                </div>
                                <div v-if="error.mfaInd" class="text-danger">
                                  {{ $t('warn.can.not.empty') }}
                                </div>
                              </div>
                            </div>
                            <!-- Enable FIDO Feature -->
                            <div class="col-md-6">
                              <div>
                                <span :class="['required', { 'text-danger': error.fidoEnabled }]">
                                  {{ $t('ui.password-policy.fido-enabled') }}
                                </span>
                                <div>
                                  <label class="me-3">
                                    <input
                                      type="radio"
                                      v-model="formData.fidoEnabled"
                                      value="1"
                                      :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                    />
                                    <span :class="[{ 'text-danger': error.fidoEnabled }]"
                                      >&nbsp;{{ $t('ENABLED.1') }}</span
                                    >
                                  </label>
                                  <label>
                                    <input
                                      type="radio"
                                      v-model="formData.fidoEnabled"
                                      value="0"
                                      :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                                    />
                                    <span :class="[{ 'text-danger': error.fidoEnabled }]"
                                      >&nbsp;{{ $t('ENABLED.0') }}</span
                                    >
                                  </label>
                                </div>
                                <div v-if="error.fidoEnabled" class="text-danger">
                                  {{ $t('warn.can.not.empty') }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer form-footer-buttons" v-if="formTitle != 'DETAIL'">
          <div class="d-flex justify-content-between align-items-center gap-2 w-100 mt-2 mb-2">
            <div class="d-flex gap-2">
              <FormButton
                noWrapper
                label="btn.reset"
                type="button"
                variant="primary"
                appearance="outlined"
                @click="resetFormBtn"
              />
            </div>
            <div class="d-flex gap-2">
              <FormButton noWrapper label="btn.cancel" type="button" variant="secondary" @click="goBack" />
              <FormButton noWrapper id="btnSubmit" label="btn.save" type="submit" variant="primary" @click="submit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { type BaseSelect } from '@/utils/select/baseSelect'
import { useI18n } from 'vue-i18n'
import { isBaseI18nSelect, conventTitle } from '@/utils/util'
import { useAppStoreHook } from '@/stores/app'
import FormButton from '@/components/formTable/FormButton.vue'

const { t } = useI18n()
const appStoreHook = useAppStoreHook()

// Props
const props = defineProps<{
  title: string
  formDataDetail: Record<string, any>
  issuerData: BaseSelect[]
}>()

// Emits
const emit = defineEmits<{
  submit: [formData: any]
  'go-back': []
}>()

// Issuer Bank options配置
const hostedOption = {
  value: null,
  text: 'Hosted'
}

const issuerOptions = computed(() => {
  return appStoreHook.organ == 'hosted' ? [hostedOption, ...props.issuerData] : [...props.issuerData]
})

// Form Title
const formTitle = ref('')
const showFlag = ref(false)
const reconfirmFlag = ref(false)
const opacity = ref(0.5)

// Computed
const dispalyCss = computed(() => {
  return showFlag.value
    ? `display:block;background:rgba(0,0,0,${opacity.value});`
    : `display:none;background:rgba(0,0,0,${opacity.value});`
})

// Computed Property: Title
const computedTitle = computed(() => {
  return t('ui.password-policy') + ' - ' + t(conventTitle(formTitle.value))
})

// Form Data
const formData = reactive<Record<string, any>>({
  issuerOid: null,
  pdMinLength: '',
  pdMaxLength: '',
  formPdContentRule: [],
  pdRestrict: '',
  loginValidateFailedLimit: '',
  loginLockExpiry: '',
  pdHistory: '',
  pdExpiry: '',
  mfaInd: '',
  fidoEnabled: ''
})

// Password Content Rule Options
const formPdContentRules = [
  { value: '0', label: 'ui.issuer-param.pd-content-rule.0' },
  { value: '1', label: 'ui.issuer-param.pd-content-rule.1' },
  { value: '2', label: 'ui.issuer-param.pd-content-rule.2' },
  { value: '3', label: 'ui.issuer-param.pd-content-rule.3' }
]

// Error Status
const error = reactive<Record<string, any>>({
  issuerOid: false,
  pdMinLength: false,
  pdMaxLength: false,
  formPdContentRule: false,
  pdRestrict: false,
  loginValidateFailedLimit: false,
  loginLockExpiry: false,
  pdHistory: false,
  pdExpiry: false,
  mfaInd: false,
  fidoEnabled: false,
  minMaxLength: false
})

// Show/Hide Method
function show(title?: string) {
  showFlag.value = true
  if (title) {
    formTitle.value = title
  }

  // Load data first, then reset form (avoid data clearing)
  if (props.formDataDetail && Object.keys(props.formDataDetail).length > 0) {
    for (const key in props.formDataDetail) {
      if (key === 'pdContentRule') {
        // Map backend pdContentRule to frontend formPdContentRule
        // Backend returns string array, need to convert to integer array
        formData.formPdContentRule = props.formDataDetail[key]
          ? props.formDataDetail[key].map((item: string) => Number.parseInt(item))
          : []
      } else {
        formData[key] = props.formDataDetail[key]
      }
    }
  }

  // Reset form only if in Add mode
  if (formTitle.value === 'ADD') {
    resetForm()
  }

  disablePageScroll()
}

function hide() {
  showFlag.value = false
  enablePageScroll()
}

// Page Scroll Control
function disablePageScroll() {
  document.body.style.overflow = 'hidden'
}

function enablePageScroll() {
  document.body.style.overflow = 'auto'
}

// Reset form
const resetFormBtn = () => {
  // Reset to original data (loaded from backend)
  if (props.formDataDetail && Object.keys(props.formDataDetail).length > 0) {
    for (const formDataDetailKey in props.formDataDetail) {
      formData[formDataDetailKey] = props.formDataDetail[formDataDetailKey]
    }
  }

  // Reset all error statuses
  for (const errorKey in error) {
    error[errorKey] = false
  }
}

// Reset form
function resetForm() {
  // Reset form data
  for (const key of Object.keys(formData)) {
    if (key === 'formPdContentRule') {
      formData[key] = []
    } else {
      formData[key] = ''
    }
  }

  // Reset error status
  for (const key of Object.keys(error)) {
    error[key] = false
  }
}

// Input validation
const onInput = (field: string) => {
  if (error[field]) {
    error[field] = false
  }

  // Check min length cannot be greater than max length
  if (field === 'pdMinLength' || field === 'pdMaxLength') {
    const minLength = Number.parseInt(formData.pdMinLength) || 0
    const maxLength = Number.parseInt(formData.pdMaxLength) || 0
    if (minLength > 0 && maxLength > 0 && minLength > maxLength) {
      error.minMaxLength = true
    } else {
      error.minMaxLength = false
    }
  }
}

// Password length validation logic
const validatePasswordLength = () => {
  // Reset length related errors
  if (error.pdMinLength !== 'empty') error.pdMinLength = false
  if (error.pdMaxLength !== 'empty') error.pdMaxLength = false
  error.minMaxLength = false

  const minLength = Number.parseInt(formData.pdMinLength)
  const maxLength = Number.parseInt(formData.pdMaxLength)

  // Check min value range
  if (!Number.isNaN(minLength) && (minLength < 7 || minLength > 99)) {
    error.pdMinLength = true
  }

  // Check max value range
  if (!Number.isNaN(maxLength) && (maxLength < 7 || maxLength > 99)) {
    error.pdMaxLength = true
  }

  // Check if min length is greater than max length
  if (!Number.isNaN(minLength) && !Number.isNaN(maxLength) && minLength > maxLength) {
    error.minMaxLength = true
  }
}

// Submit form
const submit = () => {
  let validation = true

  // Check required fields
  for (const errorKey in error) {
    if (errorKey === 'minMaxLength') continue // Skip special error

    if (errorKey == 'formPdContentRule') {
      if (!Array.isArray(formData[errorKey]) || formData[errorKey].length == 0) {
        error[errorKey] = true
        validation = false
        continue
      }
    }

    if (formData[errorKey] === null || formData[errorKey] === undefined || formData[errorKey] === '') {
      // Special handling: issuerOid being null is normal (Hosted record)
      if (errorKey === 'issuerOid' && formData[errorKey] === null) {
        // Hosted record issuerOid being null is normal, not considered error
        continue
      }

      // Special handling for password length field
      if (errorKey === 'pdMinLength' || errorKey === 'pdMaxLength') {
        error[errorKey] = 'empty' // Mark as empty error
      } else {
        error[errorKey] = true
      }
      validation = false
    }
  }

  // Validate length only when not empty
  if (formData.pdMinLength !== '' && formData.pdMaxLength !== '') {
    validatePasswordLength()
  }

  // Check all error statuses
  for (const errorKey in error) {
    if (error[errorKey]) {
      validation = false
    }
  }

  if (!validation) {
    return
  }

  // Convert data type to match backend API
  const submitData = {
    pdMinLength: Number.parseInt(formData.pdMinLength),
    pdMaxLength: Number.parseInt(formData.pdMaxLength),
    pdContentRule: formData.formPdContentRule.map((item: any) => item.toString()),
    pdRestrict: formData.pdRestrict.toString(),
    loginValidateFailedLimit: Number.parseInt(formData.loginValidateFailedLimit),
    loginLockExpiry: Number.parseInt(formData.loginLockExpiry),
    pdExpiry: Number.parseInt(formData.pdExpiry),
    pdHistory: Number.parseInt(formData.pdHistory),
    mfaInd: formData.mfaInd.toString(),
    fidoEnabled: formData.fidoEnabled.toString(),
    issuerOid: formData.issuerOid
  }

  // Send form data
  emit('submit', submitData)
}

// Return
const goBack = () => {
  hide()
  emit('go-back')
}

// Expose method
defineExpose({ show, hide })

// Watch form data changes
for (const field of Object.keys(formData)) {
  watch(
    () => formData[field],
    (newValue) => {
      if (newValue !== null && newValue !== undefined && newValue !== '') {
        if (field in error) {
          error[field] = false
        }
      }
    }
  )
}

// Watch password length changes
watch(
  () => [formData.pdMinLength, formData.pdMaxLength],
  () => {
    if (formData.pdMinLength !== '' && formData.pdMaxLength !== '') {
      validatePasswordLength()
    }
  }
)
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

.modal-dialog {
  max-width: 90%;
  margin: 7rem auto;
}

.modal-content {
  border: 0;
  background-color: var(--cui-body-bg);
  color: var(--cui-body-color);
}

.modal-header {
  background-color: var(--cui-body-bg);
  border-bottom: 1px solid var(--cui-border-color);
}

.modal-body {
  background-color: var(--cui-body-bg);
}

.modal-footer {
  background-color: var(--cui-body-bg);
  border-top: 1px solid var(--cui-border-color);
}

.modal-xl {
  max-width: 1200px;
}

.input-error {
  border-color: #dc3545 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.switch-check {
  margin-left: 0;
  width: 30%;
  vertical-align: top;
}
</style>
