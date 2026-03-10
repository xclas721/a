<template>
  <h4>{{ $t('ui.password-policy') }}</h4>
  <div class="outer-container">
    <div class="p-3">
      <div v-if="reconfirmFlag" class="my-2 w-100">
        <span class="alert alert-success d-flex">{{ $t('ui.reconfirm.message.add-to-reconfirm-sucessful') }}</span>
      </div>
      <div class="rounded m-0 t-16 row">
        <!-- (1)Issuer Bank -->
        <div class="col-md-12 mb-3">
          <div class="border border-light-subtle">
            <div class="header-title">
              {{ $t('ui.issuer.name') }}
            </div>
            <div class="content-box p-3">
              <div class="form-group">
                <span :class="['required', { 'text-danger': error.issuerOid }]">
                  {{ $t('ui.issuer.name')
                  }}<!--發卡銀行-->
                </span>
                <select
                  v-model="formData.issuerOid"
                  :class="['form-control', { 'input-error': error.issuerOid }]"
                  :disabled="true"
                >
                  <option v-for="option in issuerOptions" :key="option.value" :value="option.value">
                    {{ isBaseI18nSelect(option) ? t(option.i18nText) : option.text }}
                  </option>
                </select>
              </div>
              <div v-if="error.issuerOid" class="text-danger">
                {{ $t('warn.can.not.empty') }}
              </div>
            </div>
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
                            ref="maxLengthInput "
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
              <!-- Block 3: Login Security Settings -->
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

                      <!-- Login Validation Failure Lockout Time (Hours) -->
                      <div class="col-md-6 mb-3">
                        <div>
                          <span :class="['required', { 'text-danger': error.loginLockExpiry }]">
                            {{ $t('ui.issuer-param.login-lock-expiry')
                            }}<!-- Login Validation Failure Lockout Time (Hours) -->
                          </span>
                          <input
                            id="loginLockExpiry"
                            v-model="formData.loginLockExpiry"
                            :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                            :class="['form-control', { 'input-error': error.loginLockExpiry }]"
                            maxlength="2"
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

              <!-- Block 4: Password Validity Settings -->
              <div class="mb-3">
                <div class="border border-light-subtle h-100">
                  <div class="header-title">
                    {{ $t('ui.password-policy.expiry-settings') }}
                  </div>
                  <div class="content-box p-3">
                    <div class="row">
                      <!-- Bank Personnel Password Validity (Days) -->
                      <div class="col-md-6 mb-3">
                        <div>
                          <span :class="['required', { 'text-danger': error.pdExpiry }]">
                            {{ $t('ui.issuer-param.issuer-user-pd-expiry')
                            }}<!-- 銀行人員 密碼效期 (天)-->
                          </span>
                          <input
                            id="pdExpiry"
                            v-model="formData.pdExpiry"
                            maxlength="3"
                            :class="['form-control', { 'input-error': error.pdExpiry }]"
                            :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                            data-type="numeric"
                            oninput="value = value.replace(/\D/g, '')"
                            :placeholder="$t('ui.issuer-param.issuer-user-pd-expiry.limit')"
                          />
                        </div>
                        <div v-if="error.pdExpiry" class="text-danger">
                          {{ $t('warn.can.not.empty') }}
                        </div>
                      </div>
                      <!-- Bank Personnel New Password Cannot Repeat History (Generations) -->
                      <div class="col-md-6 mb-3">
                        <div>
                          <span :class="['required', { 'text-danger': error.pdHistory }]">
                            {{ $t('ui.issuer-param.issuer-user-pd-history')
                            }}<!-- Bank Personnel New Password Cannot Repeat History (Generations) -->
                          </span>
                          <input
                            id="pdHistory"
                            v-model="formData.pdHistory"
                            :class="['form-control', { 'input-error': error.pdHistory }]"
                            maxlength="2"
                            :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                            data-type="numeric"
                            oninput="value = value.replace(/\D/g, '')"
                            :placeholder="$t('ui.issuer-param.issuer-user-pd-history.limit')"
                          />
                        </div>
                        <div v-if="error.pdHistory" class="text-danger">
                          {{ $t('warn.can.not.empty') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Block 5: Login Verification Settings -->
              <div class="mb-3">
                <div class="border border-light-subtle h-100">
                  <div class="header-title">
                    {{ $t('ui.password-policy.auth-settings') }}
                  </div>
                  <div class="content-box p-3">
                    <div class="row">
                      <!-- Enable MFA Two-Factor Authentication -->
                      <div class="col-md-6">
                        <div>
                          <span :class="['required', { 'text-danger': error.mfaInd }]">
                            {{ $t('ui.issuer-param.mfa') }}
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
                              <span :class="[{ 'text-danger': error.fidoEnabled }]">&nbsp;{{ $t('ENABLED.1') }}</span>
                            </label>
                            <label>
                              <input
                                type="radio"
                                v-model="formData.fidoEnabled"
                                value="0"
                                :disabled="formTitle == 'DETAIL' || reconfirmFlag"
                              />
                              <span :class="[{ 'text-danger': error.fidoEnabled }]">&nbsp;{{ $t('ENABLED.0') }}</span>
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
      <div class="form-footer-buttons mt-2 mx-3" v-if="formTitle != 'DETAIL'">
        <div class="d-flex justify-content-between align-items-center gap-2 w-100">
          <div class="d-flex gap-2">
            <FormButton
              noWrapper
              label="btn.reset"
              type="button"
              variant="primary"
              appearance="outlined"
              :isDisabled="reconfirmFlag"
              @click="resetFormBtn"
            />
          </div>
          <div class="d-flex gap-2">
            <FormButton
              noWrapper
              label="btn.save"
              type="submit"
              variant="primary"
              :isDisabled="reconfirmFlag"
              @click="submit"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import { findAllIssuer } from '@/hooks/issuer'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/stores/app'
import { isBaseI18nSelect } from '@/utils/util'
import { baseIsConfirming } from '@/hooks/reconfirm'
import FormButton from '@/components/formTable/FormButton.vue'

const appStoreHook = useAppStoreHook()
const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()

const minLengthInput = ref<HTMLInputElement | null>(null)
const maxLengthInput = ref<HTMLInputElement | null>(null)

const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})

//options setting
const issuerData = ref<BaseSelect[]>([])
// Breadcrumb
const formTitle = ref('')
const reconfirmFlag = ref(false)

const resetFormBtn = () => {
  // Reset to original data (loaded from backend)
  if (formDetails.value && Object.keys(formDetails.value).length > 0) {
    // Convert backend data to match frontend form format
    const data = formDetails.value
    Object.assign(formData, {
      issuerOid: data.issuerOid || userState.user.issuerOid,
      pdMinLength: data.pdMinLength?.toString() || '',
      pdMaxLength: data.pdMaxLength?.toString() || '',
      pdRule: data.pdRule?.toString() || '',
      formPdContentRule: data.pdContentRule ? data.pdContentRule.map((item: string) => Number.parseInt(item)) : [],
      pdRestrict: data.pdRestrict?.toString() || '',
      loginValidateFailedLimit: data.loginValidateFailedLimit?.toString() || '',
      loginLockExpiry: data.loginLockExpiry?.toString() || '',
      pdExpiry: data.pdExpiry?.toString() || '',
      pdHistory: data.pdHistory?.toString() || '',
      mfaInd: data.mfaInd?.toString() || '',
      fidoEnabled: data.fidoEnabled?.toString() || '0'
    })
  }

  // Reset all error statuses
  for (const errorKey in error) {
    error[errorKey] = false
  }

  // Reset all preview statuses
  for (const previewsKey in previews) {
    previews[previewsKey] = false
  }
}

// Remove non-digit characters when input value changes
const onInput = (field: string) => {
  formData[field] = formData[field].replace(/\D/g, '')
  validatePasswordLength()
}

// Password length validation logic
const validatePasswordLength = () => {
  // Reset length related errors (keep empty value error)
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
    if (maxLengthInput.value) maxLengthInput.value.focus()
  }
}

/**
 * Add, Modify Submit Function
 */
const submit = async () => {
  let validation = true
  //check form
  for (const errorKey in error) {
    if (errorKey == 'minMaxLength') {
      continue
    }
    if (errorKey == 'formPdContentRule') {
      if (!Array.isArray(formData[errorKey]) || formData[errorKey].length == 0) {
        error[errorKey] = true
        validation = false
        continue
      }
    }
    // Process normal fields（包括密码长度字段）
    if (formData[errorKey] === null || formData[errorKey] === undefined || formData[errorKey] === '') {
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

  for (const errorKey in error) {
    if (error[errorKey]) {
      validation = false
    }
  }
  if (validation) {
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

    const result = await apiUtil.post('/password_policy/edit', submitData, {}, true)
    //call edit API
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
    } else {
      await swalMessage.error(result.message)
      return
    }
    // Finally update table
    await findById()
  }
}
// Form detail data
const formDetails = ref<Record<string, any>>({})
/**
 * Detail info
 */
const findById = async () => {
  // Fill data
  const result = await apiUtil.get('/password_policy/detail', { issuerOid: userState.user.issuerOid }, {}, true)
  if (result.success && result.code == '0000') {
    // Update formData value
    formDetails.value = { ...result.data }

    // Convert backend data to match frontend form format
    const data = result.data
    Object.assign(formData, {
      issuerOid: data.issuerOid || userState.user.issuerOid,
      pdMinLength: data.pdMinLength?.toString() || '',
      pdMaxLength: data.pdMaxLength?.toString() || '',
      formPdContentRule: data.pdContentRule ? data.pdContentRule.map((item: string) => Number.parseInt(item)) : [],
      pdRestrict: data.pdRestrict?.toString() || '',
      loginValidateFailedLimit: data.loginValidateFailedLimit?.toString() || '',
      loginLockExpiry: data.loginLockExpiry?.toString() || '',
      pdExpiry: data.pdExpiry?.toString() || '',
      pdHistory: data.pdHistory?.toString() || '',
      mfaInd: data.mfaInd?.toString() || '',
      fidoEnabled: data.fidoEnabled?.toString() || '0'
    })

    // Use review status returned by backend
    if (data.isConfirming === undefined) {
      // If backend does not return isConfirming, use original logic as backup
      const reconfirmResult = await baseIsConfirming('password_policy', formDetails.value.oid)
      if (reconfirmResult) {
        formTitle.value = 'DETAIL'
        reconfirmFlag.value = true
      } else {
        formTitle.value = ''
        reconfirmFlag.value = false
      }
    } else {
      if (data.isConfirming) {
        formTitle.value = 'DETAIL'
        reconfirmFlag.value = true
      } else {
        formTitle.value = ''
        reconfirmFlag.value = false
      }
    }
  } else {
    await swalMessage.error(result.message)
  }
}

// Initialization trigger function
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  await findById()
})

// Define the form object dynamically based on formConfig
const formData = reactive<Record<string, any>>({
  issuerOid: userState.user.issuerOid,
  pdMinLength: '',
  pdMaxLength: '',
  formPdContentRule: [],
  pdRestrict: '',
  loginValidateFailedLimit: '',
  loginLockExpiry: '',
  pdExpiry: '',
  pdHistory: '',
  mfaInd: '',
  fidoEnabled: ''
})

const previews = reactive<Record<string, any>>({})

// Define options
const formPdContentRules = [
  { value: '0', label: 'ui.issuer-param.pd-content-rule.0' },
  { value: '1', label: 'ui.issuer-param.pd-content-rule.1' },
  { value: '2', label: 'ui.issuer-param.pd-content-rule.2' },
  { value: '3', label: 'ui.issuer-param.pd-content-rule.3' }
]

const error = reactive<Record<string, any>>({
  pdHistory: false,
  pdExpiry: false,
  issuerOid: false,
  pdMinLength: false,
  pdMaxLength: false,
  minMaxLength: false,
  formPdContentRule: false,
  pdRestrict: false,
  loginValidateFailedLimit: false,
  loginLockExpiry: false,
  mfaInd: false,
  fidoEnabled: false
})

watch(
  () => formData.pdMinLength,
  () => validatePasswordLength()
)
watch(
  () => formData.pdMaxLength,
  () => validatePasswordLength()
)

for (const field of Object.keys(formData)) {
  watch(
    () => formData[field],
    (newValue) => {
      if (newValue !== null && newValue !== undefined && newValue !== '') {
        if (field in error) {
          error[field] = false // If field has value, set corresponding error to false
        }
      } else {
        // Retrigger validation when field is cleared
        if (field in error) {
          // For required fields, should show error when cleared
          if (field === 'pdMinLength' || field === 'pdMaxLength') {
            error[field] = 'empty'
          } else if (field === 'formPdContentRule') {
            // For array fields, check if empty array
            if (!Array.isArray(newValue) || newValue.length === 0) {
              error[field] = true
            }
          } else {
            error[field] = true
          }
        }
      }
      if (field in previews) {
        previews[field] = false // If field has value, set corresponding error to false
      }
    }
  )
}
</script>

<style scoped>
h4 {
  color: #6c757d; /* Gray color for title */
  border-bottom: 2px solid var(--cui-border-color);
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.outer-container {
  border: 1px solid var(--cui-border-color);
  border-radius: 8px;
  background-color: var(--cui-body-bg);
  margin-bottom: 15px;
}

.input-error {
  border-color: #dc3545 !important;
}

.text-danger {
  color: #dc3545 !important;
}

h4 {
  color: #6c757d;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 20px;
}
</style>
