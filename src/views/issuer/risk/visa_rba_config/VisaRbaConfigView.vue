<template>
  <h4>{{ $t('ui.visa-rba') }}</h4>
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
                v-model="formDateSubmit[field.model]"
                :invalids="field.invalids"
                :invalidsTxt="field.invalidsTxt"
                :maxlength="field.maxlength"
                :placeholder="field.placeholder"
                :required="field.required"
                :readOnly="field.readOnly"
                v-bind="field.props"
                :validation="valida"
                @update:invalids="(newInvalids: boolean) => (field.invalids = newInvalids)"
              />
            </div>
            <!-- Enable Visa Score -->
            <div class="form-check mb-3">
              <input
                type="checkbox"
                id="enableFlag"
                class="form-check-input"
                :checked="formDateSubmit.enableFlag == 1"
                @change="formDateSubmit.enableFlag = ($event.target as HTMLInputElement).checked ? 1 : 0"
                :disabled="reconfirmFlag"
              />
              <label for="enableFlag" class="form-check-label">{{ t('ui.visa-rba.enabled') }}</label>
            </div>
            <div class="d-flex align-items-center">
              <div class="me-2 text-nowrap">
                <span>{{ t('ui.visa-rba.visaRBAScoreInd.frictionless') }} &lt;</span>
              </div>
              <div class="me-2">
                <input
                  type="text"
                  class="form-control"
                  style="width: 80px"
                  placeholder="0"
                  maxlength="2"
                  v-model="formDateSubmit.visaRBAScoreInd"
                  @input="onInputChange('visaRBAScoreInd', $event)"
                  :disabled="reconfirmFlag"
                />
              </div>
              <div class="me-2 text-nowrap">
                <span>≤ {{ t('ui.visa-rba.visaRBAScoreInd.rba') }} ≤</span>
              </div>
              <div class="me-2">
                <input
                  type="text"
                  class="form-control"
                  style="width: 80px"
                  placeholder="90"
                  maxlength="2"
                  v-model="formDateSubmit.visaRBAScoreInd2"
                  @input="onInputChange('visaRBAScoreInd2', $event)"
                  :disabled="reconfirmFlag"
                />
              </div>
              <div class="text-nowrap">
                <span>{{ t('ui.trans.log.reskAssesmentResult.R') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-3">
      <div class="form-footer-buttons mt-2" v-if="!reconfirmFlag">
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
            <FormButton noWrapper label="btn.save" type="submit" variant="primary" @click="submit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/stores/app'
import FormImgFile from '@/components/formTable/FormImgFile.vue'
import FormFile from '@/components/formTable/FormFile.vue'
import FormPassword from '@/components/formTable/FormPassword.vue'
import FormInput from '@/components/formTable/FormInput.vue'
import FormButton from '@/components/formTable/FormButton.vue'
import { findAllIssuer } from '@/hooks/issuer'
import type { FormField } from '@/components/formTable/FormComponent.vue'
import { baseIsConfirming } from '@/hooks/reconfirm'

const appStoreHook = useAppStoreHook()
const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const valida = ref(true)

const reconfirmFlag = ref(false)
const itemClass = (colNum: string | undefined) => {
  return 'col-md-' + (colNum ?? '6')
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
// Define the form object dynamically based on formConfig
const formDateSubmit = reactive<Record<string, any>>({
  enableFlag: 0,
  visaRBAScoreInd: 0,
  visaRBAScoreInd2: 90,
  issuerOid: '',
  oid: ''
})
//riskLevel
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...issuerData.value] : [...issuerData.value]
})

//options setting
const issuerData = ref<BaseSelect[]>([])

/**
 * Add, Modify Submit Function
 * @param formDate form data
 */
const submit = async () => {
  const result = await apiUtil.post('/visa_rba/edit', formDateSubmit, {}, true)
  if (result.success && result.code === '0000') {
    await swalMessage.success(result.message)
    await findById()
  } else {
    await swalMessage.error(result.message)
  }
}

/**
 * Detail info
 * @param formDate form data
 */

const findById = async () => {
  const result = await apiUtil.get('/visa_rba/detail', {}, {}, true)
  if (result.success && result.code === '0000') {
    // Save initial data
    initialFormData.value = JSON.parse(JSON.stringify(result.data))

    // Update formDateSubmit data
    for (const key in result.data) {
      if (Object.prototype.hasOwnProperty.call(formDateSubmit, key)) {
        formDateSubmit[key] = result.data[key]
      }
    }

    const reconfirmResult = await baseIsConfirming('visa_rba_config', formDateSubmit.oid)
    reconfirmFlag.value = !!reconfirmResult
  } else {
    await swalMessage.error(result.message)
  }
}

// Process input content, ensure only numbers are kept
function onInputChange(field: keyof typeof formDateSubmit, event: Event) {
  const input = event.target as HTMLInputElement
  const sanitizedValue = input.value.replace(/\D/g, '') // Remove non-numeric characters
  formDateSubmit[field] = sanitizedValue // Update bound field value
  input.value = sanitizedValue // Force sync display value to validated content
}

const initialFormData = ref<Record<string, any>>({})

const resetFormBtn = () => {
  // Restore all form fields to initial values
  for (const key in initialFormData.value) {
    if (Object.prototype.hasOwnProperty.call(formDateSubmit, key)) {
      formDateSubmit[key] = initialFormData.value[key]
    }
  }
}

onMounted(async () => {
  issuerData.value = await findAllIssuer()
  await findById()
})

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
  }
])
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
  background-color: var(--cui-body-bg);
  margin-bottom: 15px;
}
</style>
