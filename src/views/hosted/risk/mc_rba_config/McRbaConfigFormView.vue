<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div class="modal-dialog">
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
                    @clickUpFunc="(event: any) => handleInputKeyup(field, event)"
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
                    />
                  </div>

                  <!-- Symbol -->
                  <div class="mx-3">&le;</div>

                  <!-- Dropdown Menu -->
                  <div class="col-md-2">
                    <select v-model="formDateSubmit.rbaEvaluation" class="form-control" style="text-align: center">
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
        <div class="form-footer-buttons mt-2 mb-5" v-if="title != 'DETAIL'">
          <div class="d-flex justify-content-between align-items-center gap-2 w-100">
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
              <FormButton noWrapper label="btn.save" type="submit" variant="primary" @click="submit" />
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
                          />
                        </td>
                        <!-- Show Reason Code -->
                        <td>{{ config.reasonCode }}</td>
                        <!-- Show Description -->
                        <td>{{ t(`ui.mc-rba.reason-code-${config.reasonCode}`) }}</td>
                        <!-- Strategy Selection Dropdown -->
                        <td>
                          <select v-model="config.policy" class="form-control">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import FormInput from '@/components/formTable/FormInput.vue'
import FormImgFile from '@/components/formTable/FormImgFile.vue'
import FormFile from '@/components/formTable/FormFile.vue'
import FormPassword from '@/components/formTable/FormPassword.vue'
import FormButton from '@/components/formTable/FormButton.vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { conventTitle } from '@/utils/util'

const { t } = useI18n()

export interface FormField {
  type: 'text' | 'checkbox' | 'file' | 'img' | 'password'
  label: string
  ID: string
  model: string
  required: boolean
  readOnly: boolean
  default?: string | File | object | null
  // Whether to show validation text
  invalids?: boolean
  invalidsTxt?: string
  props?: Record<string, any>
  maxlength?: string
  placeholder?: string
  colNum?: string
  // Function triggered on click
  clickAction?: () => string
  // Validation function
  validateAction?: (val: string) => Record<string, any>
}

// Props
const props = defineProps<{
  formConfig: FormField[]
  title: string
  formData: Record<string, any>
}>()
// Data
const showFlag = ref(false)
const opacity = ref(0.7)

// Refs
const maskSpace = ref()

// Computed
const dispalyCss = computed(() => {
  return showFlag.value
    ? `display:block;background:rgba(0,0,0,${opacity.value});`
    : `display:none;background:rgba(0,0,0,${opacity.value});`
})

const actionResult = (field: FormField) => {
  return field.clickAction?.() ?? ''
}
const reasonCodeConfigs = ref(Array.from({ length: 26 }, (_, i) => String.fromCodePoint(65 + i)))
/**
 * Input validation
 * @param field field
 * @param event event
 */
function handleInputKeyup(field: FormField, event: KeyboardEvent) {
  const data = (event.target as HTMLInputElement).value
  if (data) {
    const validateAction = field.validateAction?.(data)
    if (validateAction) {
      if (validateAction.result) {
        field.invalids = false
        field.invalidsTxt = ''
      } else {
        field.invalids = true
        field.invalidsTxt = validateAction.message
      }
    }
  } else {
    field.invalids = !!field.required
    field.invalidsTxt = field.required ? 'javax.validation.constraints.NotNull.message' : ''
  }
}

const getComponentType = (type: string) => {
  if (type == 'img') {
    return FormImgFile
  } else if (type == 'file') {
    return FormFile
  } else if (type == 'password') {
    return FormPassword
  } else {
    return FormInput
  }
}

// Methods
function show() {
  showFlag.value = true
  nextTick(() => {
    if (maskSpace.value) {
      maskSpace.value.scrollTop = 0
    }
  })
  valida.value = true

  // Disable homepage scrollbar
  disablePageScroll()
}
function hide() {
  showFlag.value = false
}

const itemClass = (colNum: string | undefined) => {
  return 'col-md-' + (colNum ?? '6')
}

// Emit the search event
const emit = defineEmits(['submit', 'goBack'])

// Define the form object dynamically based on formConfig
const formDateSubmit = reactive<Record<string, any>>({
  enabledFlag: 0,
  mcRbaScoreInd: '',
  rbaEvaluation: 3,
  mcRbaScoreInd2: '',
  mcRbaReasonCodeConfigs: reasonCodeConfigs.value.map((reasonCode) => ({
    enabledFlag: 0,
    policy: '',
    reasonCode
  }))
})

const formDateBf = reactive<Record<string, any>>({
  enableFlag: 0,
  mcRbaScoreInd: '', // Frictionless Score Input Binding
  rbaEvaluation: 3, // Dropdown Option Binding
  mcRbaScoreInd2: '',
  mcRbaReasonCodeConfigs: reasonCodeConfigs.value.map((reasonCode) => ({
    enabledFlag: 0, // Default Enable Flag
    policy: '', // Default policy is empty
    reasonCode // Dynamically generated reasonCode
  })) // High Risk Score Input Binding
})

// Initialize form object based on formConfig
for (const field of props.formConfig) {
  formDateSubmit[field.model] = props.formData[field.model] || field.default
}
const resetForm = () => {
  for (const formDataKey in props.formData) {
    formDateSubmit[formDataKey] = formDateBf[formDataKey]
  }
  for (const field of props.formConfig) {
    field.invalids = false
    formDateSubmit[field.model] = field.default
    valida.value = false
  }
}
const resetFormBtn = () => {
  if (props.title === 'UPDATE') {
    for (const formDataKey in props.formData) {
      formDateSubmit[formDataKey] = props.formData[formDataKey]
    }
    for (const field of props.formConfig) {
      formDateSubmit[field.model] = props.formData[field.model] || field.default
    }
  } else {
    for (const formDataKey in formDateSubmit) {
      formDateSubmit[formDataKey] = formDateBf[formDataKey]
    }
    for (const field of props.formConfig) {
      formDateSubmit[field.model] = field.default
    }
  }
}
watch(
  () => props.formData,
  (newData) => {
    if (newData) {
      for (const formDataKey in props.formData) {
        formDateSubmit[formDataKey] = newData[formDataKey]
      }
      for (const field of props.formConfig) {
        formDateSubmit[field.model] = newData[field.model] || field.default
      }
      if (newData['oid']) {
        formDateSubmit['oid'] = newData['oid']
      }
    }
  },
  { immediate: true }
)

const appStore = useAppStore()
watch(
  () => props.title,
  (newData) => {
    if (newData) {
      const title = conventTitle(newData)
      appStore.toggleFormTitle(t(title))
    }
  },
  { immediate: true }
)
const goBack = () => {
  // Enable homepage scrollbar
  enablePageScroll()
  resetForm()
  emit('goBack', { ...formDateSubmit })
}
// Used for formInput component validation. When closing window and model becomes empty, error msg appears. Add this field: set to true (validate) when opening form, set to false (no validation) when closing form.
const valida = ref(true)
const submit = () => {
  let validation = true
  //check form
  for (const field of props.formConfig) {
    if (field.required) {
      field.invalids = false
      if (!formDateSubmit[field.model] || formDateSubmit[field.model] === '') {
        field.invalids = true
        field.invalidsTxt = 'javax.validation.constraints.NotNull.message'
        validation = false
      }
    }

    // Check if custom validation passed
    if (formDateSubmit[field.model]) {
      const validateAction = field.validateAction?.(formDateSubmit[field.model])
      if (validateAction) {
        if (!validateAction.result) {
          validation = false
        }
      }
    }
  }

  if (validation) {
    // Enable homepage scrollbar
    enablePageScroll()
    console.log()
    emit('submit', { ...formDateSubmit })
    valida.value = false
  }
}

// Use computed to create dynamic title
const computedTitle = computed(() => {
  return t(conventTitle(props.title))
})

// Disable page scrolling
function disablePageScroll() {
  document.body.style.overflow = 'hidden'
}

// Allow page scrolling
function enablePageScroll() {
  document.body.style.overflow = ''
  appStore.toggleFormTitle('')
}

defineExpose({
  show,
  hide
})

// Process input content, ensure only numbers are kept
function onInputChange(field: keyof typeof formDateSubmit, event: Event) {
  const input = event.target as HTMLInputElement
  const sanitizedValue = input.value.replace(/\D/g, '') // Remove non-numeric characters
  formDateSubmit[field] = sanitizedValue // Update bound field value
  input.value = sanitizedValue // Force sync display value to validated content
}
</script>

<style scoped>
.modal-dialog {
  max-width: 80%;
  margin: 7rem auto;
}

.modal-content {
  border: 0;
}
</style>
