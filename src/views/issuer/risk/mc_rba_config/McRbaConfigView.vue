<template>
  <h4>{{ $t('ui.mc-rba') }}</h4>
  <div class="outer-container">
    <div class="modal-body">
      <div v-if="reconfirmFlag" class="my-2 w-100">
        <span class="alert alert-success d-flex">{{ $t('ui.reconfirm.message.add-to-reconfirm-sucessful') }}</span>
      </div>
      <div class="p-3">
        <div class="rounded m-0 t-16 row">
          <div v-for="(field, index) in formConfig" :key="index" :class="itemClass(field.colNum)">
            <div class="order-0 mb-2">
              <component
                :is="getComponentType(field.type)"
                :ID="field.ID"
                :LabelVal="field.label"
                :type="field.type"
                v-model="formDateSubmit[field.model as keyof typeof formDateSubmit]"
                :invalids="field.invalids"
                :invalidsTxt="field.invalidsTxt"
                :maxlength="field.maxlength"
                :placeholder="field.placeholder"
                :required="field.required"
                :readOnly="field.readOnly"
                :action="actionResult(field)"
                v-bind="field.props"
                :validation="valida"
                @update:invalids="(newInvalids: boolean) => (field.invalids = newInvalids)"
              />
            </div>

            <!-- Dynamically insert mc Score -->
            <div v-if="field.model === 'issuerOid'" class="form-check mb-3">
              <input
                type="checkbox"
                id="enableFlag"
                class="form-check-input"
                :checked="formDateSubmit.enabledFlag == 1"
                @change="formDateSubmit.enabledFlag = ($event.target as HTMLInputElement).checked ? 1 : 0"
                :disabled="reconfirmFlag"
              />
              <label for="enableFlag" class="form-check-label">{{ t('ui.mc-rba.enabled') }}</label>
            </div>
          </div>
          <div class="col-md-12">
            <!-- Risk Threshold Setting Title -->
            <span>{{ $t('ui.mc-rba.score') }}</span>

            <!-- Risk Score Threshold Setting -->
            <div style="display: flex; align-items: center">
              <!-- Frictionless -->
              <div class="me-3">
                {{ $t('ui.mc-rba.policy.1', 'Frictionless') }}
              </div>

              <!-- Risk Score Threshold Input Box -->
              <div class="col-md-2">
                <input
                  v-model="formDateSubmit.mcRbaScoreInd"
                  maxlength="3"
                  type="text"
                  class="form-control"
                  style="text-align: center"
                  @input="onInputChange('mcRbaScoreInd', $event)"
                  :disabled="reconfirmFlag"
                />
              </div>

              <!-- Symbol -->
              <div class="mx-3">&le;</div>

              <!-- Dropdown Menu -->
              <div class="col-md-2">
                <select
                  v-model="formDateSubmit.rbaEvaluation"
                  class="form-control"
                  style="text-align: center"
                  :disabled="reconfirmFlag"
                >
                  <option value="3">Challenge</option>
                  <option value="2">ACS RBA</option>
                </select>
              </div>

              <!-- Symbol -->
              <div class="mx-3">&le;</div>

              <!-- High Risk Score Threshold Input Box -->
              <div class="col-md-2">
                <input
                  v-model="formDateSubmit.mcRbaScoreInd2"
                  maxlength="3"
                  type="text"
                  class="form-control"
                  style="text-align: center"
                  @input="onInputChange('mcRbaScoreInd2', $event)"
                  :disabled="reconfirmFlag"
                />
              </div>

              <!-- Reject -->
              <div class="ms-3">
                {{ $t('ui.mc-rba.policy.4', 'Reject') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-3">
      <div class="form-footer-buttons mt-2">
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
          <div class="d-flex gap-2 align-items-center">
            <FormButton
              noWrapper
              label="btn.save"
              type="submit"
              variant="primary"
              :isDisabled="reconfirmFlag"
              @click="submit"
            />
            <i v-if="reconfirmFlag" class="ri-error-warning-line ms-1" :title="$t('ui.reconfirm.status.0')"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="border border-light-subtle mx-5">
      <div class="header-title">{{ $t('ui.mc-rba.policy-reason-code') }}</div>
      <div class="content-box p-3">
        <div class="row mb-3">
          <div class="col-md-12">
            <!-- Risk Rule Setting Panel -->
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th style="width: 10%">
                      {{ t('ui.mc-rba.reason-code') }}
                      <!-- Reason Code -->
                    </th>
                    <th>
                      {{ t('ui.mc-rba.description') }}
                      <!-- Description -->
                    </th>
                    <th>
                      {{ $t('ui.operation') }}
                      <!-- Description -->
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(config, index) in formDateSubmit.mcRbaReasonCodeConfigs" :key="index">
                    <!-- Enable Checkbox -->
                    <td>
                      <input
                        type="checkbox"
                        class="form-check-input"
                        style="border: 2px solid #333"
                        :checked="config.enabledFlag == 1"
                        @change="config.enabledFlag = ($event.target as HTMLInputElement).checked ? 1 : 0"
                        :disabled="reconfirmFlag"
                      />
                    </td>
                    <!-- Show Reason Code -->
                    <td>{{ config.reasonCode }}</td>
                    <!-- Show Description -->
                    <td>{{ t(`ui.mc-rba.reason-code-${config.reasonCode}`) }}</td>
                    <!-- Strategy Selection Dropdown -->
                    <td>
                      <select
                        v-model="config.policy"
                        class="form-control"
                        :class="{ 'is-invalid': config.invalidPolicy }"
                        :disabled="reconfirmFlag"
                        @change="
                          () => {
                            config.invalidPolicy = false
                          }
                        "
                      >
                        <option value="">
                          {{ t('ui.option-select') }}
                          <!-- Please Select -->
                        </option>
                        <option value="1">
                          {{ t('ui.mc-rba.policy-frictionless') }}
                          <!-- Frictionless -->
                        </option>
                        <option value="2">
                          {{ t('ui.mc-rba.policy-acs-rba') }}
                          <!-- ACS RBA -->
                        </option>
                        <option value="3">
                          {{ t('ui.mc-rba.policy-challenge') }}
                          <!-- Challenge -->
                        </option>
                        <option value="4">
                          {{ t('ui.mc-rba.policy-reject') }}
                          <!-- Reject -->
                        </option>
                      </select>
                      <div v-if="config.invalidPolicy" class="invalid-feedback">
                        {{ t('javax.validation.constraints.NotNull.message') }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { FormField } from '@/components/formTable/FormComponent.vue'
import { baseIsConfirming } from '@/hooks/reconfirm'
import { useI18n } from 'vue-i18n'
import ApiUtil from '@/utils/apiUtils'
import swalMessage from '@/plugins/swalMessage'
import { findAllIssuer } from '@/hooks/issuer'
import { userStateStore } from '@/stores/user'
import { useAppStoreHook } from '@/stores/app'

import { optionSelect } from '@/utils/select/baseSelect'
import { policyLowRiskOptionSave, policyNotLowRiskOptionSelect } from '@/utils/select/mcrba'

import FormImgFile from '@/components/formTable/FormImgFile.vue'
import FormFile from '@/components/formTable/FormFile.vue'
import FormPassword from '@/components/formTable/FormPassword.vue'
import FormInput from '@/components/formTable/FormInput.vue'
import FormButton from '@/components/formTable/FormButton.vue'

const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const appStoreHook = useAppStoreHook()

const valida = ref(true)
const reconfirmFlag = ref(false)

const reasonCodeConfigs = ref(Array.from({ length: 26 }, (_, i) => String.fromCodePoint(65 + i)))
interface ReasonCodeConfig {
  enabledFlag: number
  policy: string
  invalidPolicy?: boolean
  reasonCode: string
}

// Extended interface, allowing dynamic field access
interface FormDateSubmit {
  enabledFlag: number
  mcRbaScoreInd: string
  rbaEvaluation: string | number
  mcRbaScoreInd2: string
  issuerOid: string
  mcRbaReasonCodeConfigs: ReasonCodeConfig[]

  [key: string]: any
}

const formDateSubmit = reactive<FormDateSubmit>({
  enabledFlag: 0,
  mcRbaScoreInd: '',
  rbaEvaluation: 3,
  mcRbaScoreInd2: '',
  issuerOid: '',
  mcRbaReasonCodeConfigs: reasonCodeConfigs.value.map((reasonCode) => ({
    enabledFlag: 0,
    policy: '',
    reasonCode
  })),
  // Initialize formConfig 里额外的字段
  policyLowRisk: '',
  policyNotLowRisk: ''
})

const issuerData = ref<any[]>([])

const issuerOptions = computed(() => {
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})

const policyLowRiskSaveOption = computed(() => [...optionSelect, ...policyLowRiskOptionSave])
const policyNotLowRiskOption = computed(() => [...optionSelect, ...policyNotLowRiskOptionSelect])

const itemClass = (colNum: string | undefined) => {
  return `col-md-${colNum ?? '6'}`
}

const getComponentType = (type: string) => {
  switch (type) {
    case 'img':
      return FormImgFile
    case 'file':
      return FormFile
    case 'password':
      return FormPassword
    default:
      return FormInput
  }
}

const actionResult = (field: FormField) => field.clickAction?.() ?? ''

const formConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    ID: 'issuerOid',
    readOnly: true,
    required: true,
    colNum: '12',
    props: {
      options: issuerOptions
    }
  },
  {
    type: 'checkbox',
    label: 'ui.mc-rba.low-risk',
    model: 'policyLowRisk',
    default: '',
    ID: 'policyLowRisk',
    readOnly: false,
    required: true,
    props: {
      options: policyLowRiskSaveOption
    }
  },
  {
    type: 'checkbox',
    label: 'ui.mc-rba.not-low-risk',
    model: 'policyNotLowRisk',
    default: '',
    ID: 'policyNotLowRisk',
    readOnly: false,
    required: true,
    props: {
      options: policyNotLowRiskOption
    }
  }
])

function initializeFormDate() {
  for (const field of formConfig.value) {
    formDateSubmit[field.model] = field.default || ''
  }
}

const submit = async () => {
  let hasError = false

  // Normal field validation
  for (const field of formConfig.value) {
    if (field.required) {
      const value = formDateSubmit[field.model]
      if (value === '' || value === null || value === undefined) {
        field.invalids = true
        field.invalidsTxt = t('javax.validation.constraints.NotNull.message')
        hasError = true
      } else {
        field.invalids = false
        field.invalidsTxt = ''
      }
    }
  }

  // mcRbaReasonCodeConfigs validation
  for (const config of formDateSubmit.mcRbaReasonCodeConfigs) {
    if (config.enabledFlag === 1 && (!config.policy || config.policy === '')) {
      hasError = true
      config.invalidPolicy = true
    } else {
      config.invalidPolicy = false
    }
  }

  if (hasError) return

  const result = await apiUtil.post('/mastercard_rba/edit', formDateSubmit, {}, true)
  if (result.success && result.code === '0000') {
    await swalMessage.success(result.message)
    await findById()
  } else {
    await swalMessage.error(result.message)
  }
}

const initialFormData = ref<Record<string, any>>({})

const resetFormBtn = () => {
  for (const key in initialFormData.value) {
    if (Object.prototype.hasOwnProperty.call(formDateSubmit, key)) {
      formDateSubmit[key] = initialFormData.value[key]
    }
  }
  if (initialFormData.value.mcRbaReasonCodeConfigs) {
    formDateSubmit.mcRbaReasonCodeConfigs = JSON.parse(JSON.stringify(initialFormData.value.mcRbaReasonCodeConfigs))
  }
}

const findById = async () => {
  const result = await apiUtil.get('/mastercard_rba/detail', {}, {}, true)
  if (result.success && result.code === '0000') {
    initialFormData.value = JSON.parse(JSON.stringify(result.data))
    for (const key in result.data) {
      if (Object.prototype.hasOwnProperty.call(formDateSubmit, key)) {
        formDateSubmit[key] = result.data[key]
      }
    }
    const reconfirmResult = await baseIsConfirming('mc_rba_config', result.data.oid)
    reconfirmFlag.value = !!reconfirmResult
  } else {
    await swalMessage.error(result.message)
  }
}

onMounted(async () => {
  issuerData.value = await findAllIssuer()
  initializeFormDate()
  await findById()
})

function onInputChange(field: keyof typeof formDateSubmit, event: Event) {
  const input = event.target as HTMLInputElement
  let sanitizedValue = input.value.replace(/\D/g, '') // Remove non-digit characters

  // Special handling for mcRbaScoreInd2 field
  // Convert to number并限制最大值
  const numValue = Number.parseInt(sanitizedValue || '0')
  if (numValue > 950) {
    sanitizedValue = '950'
  }

  formDateSubmit[field] = sanitizedValue // Update bound field value
  input.value = sanitizedValue // Force sync display value to validated content
}
</script>

<style scoped>
/* Add your styles here */
h4 {
  color: #6c757d; /* Gray color for title */
  border-bottom: 2px solid #e0e0e0; /* Light gray bottom border */
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.outer-container {
  border: 1px solid var(--cui-border-color, #e0e0e0);
  border-radius: 8px;
  /* Follow theme: light is white background, dark is dark background */
  background-color: var(--cui-body-bg);
  margin-bottom: 15px;
}
</style>
