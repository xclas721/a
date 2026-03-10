<template>
  <h4>{{ $t('ui.ca-cert-certificate') }}</h4>
  <div class="outer-container">
    <div>
      <div class="p-3">
        <div class="rounded m-0 t-16 row">
          <div v-for="(field, index) in formConfig" :key="index" :class="itemClass(field.colNum)">
            <div class="order-0 mb-2">
              <component
                :is="getComponentType(field.type)"
                :ID="field.ID"
                :LabelVal="field.label"
                :type="field.type"
                v-model="formDate[field.model]"
                :invalids="field.invalids"
                :maxlength="field.maxlength"
                :placeholder="field.placeholder"
                :required="field.required"
                :readOnly="field.readOnly"
                v-bind="field.props"
                :validation="valida"
                @update:invalids="(newInvalids: boolean) => (field.invalids = newInvalids)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="form-footer-buttons mt-2 mb-5">
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
            <FormButton noWrapper id="btnSubmit" label="btn.save" type="submit" variant="primary" @click="submit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { FormField } from '@/components/formTable/FormComponent.vue'
import FormImgFile from '@/components/formTable/FormImgFile.vue'
import FormFile from '@/components/formTable/FormFile.vue'
import FormInput from '@/components/formTable/FormInput.vue'
import { certEncodeOptionSelect } from '@/utils/select/caCertLoad'
import { optionSelect } from '@/utils/select/baseSelect'
import { fileToBase64 } from '@/utils/util'
import swalMessage from '@/plugins/swalMessage'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import FormButton from '@/components/formTable/FormButton.vue'
const valida = ref(true)
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const itemClass = (colNum: string | undefined) => {
  return 'col-md-' + (colNum ?? '6')
}
const getComponentType = (type: string) => {
  if (type == 'img') {
    return FormImgFile
  } else if (type == 'file') {
    return FormFile
  } else {
    return FormInput
  }
}
const resetFormBtn = () => {
  for (const field of formConfig.value) {
    formDate[field.model] = field.default
    field.invalids = false // Add this line to clear required prompt
  }
  valida.value = true // Reset validation status
}
const submit = async () => {
  valida.value = true
  let validation = true
  //check form
  for (const field of formConfig.value) {
    field.invalids = false
    if (field.required) {
      if (!formDate[field.model] || formDate[field.model] === '') {
        field.invalids = true
        validation = false
      }
    }
  }
  if (validation) {
    valida.value = false
    formDate['issuerOid'] = userState.user.issuerOid
    formDate['fileContent'] = await fileToBase64(formDate['uploadFile'])
    //call add API
    const result = await apiUtil.post('/caCertificate/load', formDate, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      resetFormBtn()
    } else {
      await swalMessage.error(result.message)
      return
    }
  }
}

const certEncodeOptions = computed(() => [...optionSelect, ...certEncodeOptionSelect])
const formDate = reactive<Record<string, any>>({})

const formConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.ca-cert-certificate.cert-alias',
    model: 'certAlias',
    default: '',
    ID: 'certAlias',
    readOnly: false,
    required: true,
    props: {}
  },
  {
    type: 'checkbox',
    label: 'ui.ca-cert-certificate-cert-encode',
    model: 'certEncode',
    default: '',
    ID: 'certEncode',
    readOnly: false,
    required: true,
    props: {
      options: certEncodeOptions
    }
  },
  {
    type: 'file',
    label: 'ui.ca-cert-certificate-cert-content',
    model: 'uploadFile',
    default: null,
    ID: 'uploadFile',
    readOnly: false,
    required: true,
    props: {}
  }
])
// Initialize formDate when component mounts
onMounted(() => {
  for (const field of formConfig.value) {
    field.invalids = false
    formDate[field.model] = field.default
  }
})
</script>

<style scoped>
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
