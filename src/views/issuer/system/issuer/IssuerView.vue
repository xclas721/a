<template>
  <h4>{{ $t('ui.issuer') }}</h4>
  <div class="outer-container">
    <div class="p-3">
      <div v-if="reconfirmFlag" class="my-2 w-100">
        <span class="alert alert-success d-flex">{{ $t('ui.reconfirm.message.add-to-reconfirm-sucessful') }}</span>
      </div>
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
              :invalidsTxt="field.invalidsTxt"
              :maxlength="field.maxlength"
              :placeholder="field.placeholder"
              :required="field.required"
              :readOnly="field.readOnly || reconfirmFlag"
              v-bind="field.props"
              :validation="valida"
              @update:invalids="(newInvalids: boolean) => (field.invalids = newInvalids)"
            />
          </div>
        </div>
      </div>
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
import { onMounted, reactive, ref } from 'vue'
import ApiUtil from '@/utils/apiUtils'
import { type FormField } from '@/components/formTable/FormComponent.vue'
import { userStateStore } from '@/stores/user'
import swalMessage from '@/plugins/swalMessage'
import FormImgFile from '@/components/formTable/FormImgFile.vue'
import FormFile from '@/components/formTable/FormFile.vue'
import FormButton from '@/components/formTable/FormButton.vue'
import FormInput from '@/components/formTable/FormInput.vue'
import { baseIsConfirming } from '@/hooks/reconfirm' // Import review state check method

const valida = ref(false)
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const initialFormData = ref<Record<string, any>>({})
const reconfirmFlag = ref(false) // Review status flag

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
  // Restore all form fields to initial values
  for (const key of Object.keys(initialFormData.value)) {
    if (formDate[key] !== undefined) {
      formDate[key] = initialFormData.value[key]
    }
  }
}

const submit = async () => {
  let validation = true
  //check form
  for (const field of formConfig.value) {
    if (!field.hide) {
      if (field.invalids) {
        validation = false
      }
      if (field.required) {
        if (formDate[field.model] === undefined || formDate[field.model] === null || formDate[field.model] === '') {
          field.invalids = true
          field.invalidsTxt = 'javax.validation.constraints.NotNull.message'
          field.invalidsPattern = []
          validation = false
        }
      }
    }
  }

  if (validation) {
    formDate.issuerOid = userState.user.issuerOid
    const result = await apiUtil.post('/issuer/edit', formDate, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      await findById()
      // Update initial data after successful submission
      initialFormData.value = JSON.parse(JSON.stringify(formDate))
    } else {
      await swalMessage.error(result.message)
    }
  }
}

const formDate = reactive<Record<string, any>>({})

const findById = async () => {
  const result = await apiUtil.get('/issuer/detail', {}, {}, true)

  if (result.success && result.code === '0000') {
    // Handle potentially nested data
    const responseData = result.data?.data || result.data

    Object.assign(formDate, responseData)

    const reconfirmResult = await baseIsConfirming('issuer', formDate.oid)
    reconfirmFlag.value = !!reconfirmResult

    // Finally save initial data
    initialFormData.value = JSON.parse(JSON.stringify(formDate))
  } else {
    await swalMessage.error(result.message)
  }
}

onMounted(async () => {
  // Initialize formDate 的默认值
  for (const field of formConfig.value) {
    formDate[field.model] = field.default || ''
  }

  // Save initial default values (before getting detail data)
  initialFormData.value = JSON.parse(JSON.stringify(formDate))

  // Call findById to get form data
  await findById()

  // Enable validation only after data loaded (delay 100ms to ensure DOM rendering)
  setTimeout(() => {
    valida.value = true
  }, 100)
})

const formConfig = ref<FormField[]>([
  {
    type: 'text',
    label: 'ui.issuer.bank-id',
    model: 'bankId',
    default: '',
    ID: 'bankId',
    readOnly: true,
    required: true,
    maxlength: '20',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.issuer.issuer-name',
    model: 'issuerName',
    default: '',
    ID: 'issuerName',
    readOnly: false,
    required: true,
    maxlength: '50',
    props: {}
  },
  {
    type: 'text',
    label: 'ui.issuer.description',
    model: 'description',
    default: '',
    ID: 'description',
    readOnly: false,
    required: true,
    maxlength: '50',
    props: {}
  }
])
</script>

<style scoped>
h4 {
  color: #6c757d; /* Gray color for title */
  border-bottom: 2px solid #e0e0e0; /* Light gray bottom border */
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.outer-container {
  border: 1px solid #e0e0e0; /* 1 pixel wide gray solid border */
  border-radius: 8px;
  background-color: white;
  margin-bottom: 15px;
}
</style>
