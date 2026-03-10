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
              <div v-for="(field, index) in formConfigFilter" :key="index" :class="itemClass(field.colNum)">
                <div class="order-0 mb-2">
                  <component
                    :is="getComponentType(field.type)"
                    :ID="field.ID"
                    :LabelVal="field.label"
                    :type="field.type"
                    v-model="formDate[field.model]"
                    :invalids="field.invalids"
                    :invalidsTxt="field.invalidsTxt"
                    :invalidsPattern="field.invalidsPattern"
                    :maxlength="field.maxlength"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    :readOnly="field.readOnly"
                    :valid="field.valid"
                    :pdRestrict="field.pdRestrict"
                    :action="actionResult(field)"
                    v-bind="field.props"
                    :validation="valida"
                    @change="(val: string) => field.changeAction && field.changeAction(val)"
                    @clickUpFunc="(event: any) => handleInputKeyup(field, event)"
                    @clickFunc="(value: any) => generatorPwd(value)"
                    @btnClick="(event: any) => btnComponentAction(field)"
                    @update:invalids="(newInvalids: boolean) => (field.invalids = newInvalids)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="form-footer-buttons px-3 mt-2 mb-5" v-if="title != 'DETAIL'">
            <div class="row m-0">
              <div class="col-12">
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
                    <FormButton
                      noWrapper
                      id="btnSubmit"
                      label="btn.save"
                      type="submit"
                      variant="primary"
                      @click="submit"
                    />
                    <FormButton
                      v-for="(button, index) in customButtons"
                      :key="index"
                      noWrapper
                      :label="button.label"
                      :type="button.type"
                      :variant="button.variant"
                      @click="button.action"
                    />
                  </div>
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
import FormRadio from '@/components/formTable/FormRadio.vue'
import { useI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/stores/app'
import { conventTitle } from '@/utils/util'
import { userStateStore, UserType } from '@/stores/user'
import FormButtonExt from '@/components/formTable/FormButtonExt.vue'

const { t } = useI18n()
const userState = userStateStore()

export interface FormField {
  type: 'text' | 'checkbox' | 'file' | 'img' | 'password' | 'radio' | 'btn' | 'number'
  label: string
  ID: string
  model: string
  required: boolean
  readOnly: boolean
  hide?: boolean
  default?: string | File | object | null
  // Whether to show validation text
  invalids?: boolean
  invalidsTxt?: string
  invalidsPattern?: string[]
  props?: Record<string, any>
  maxlength?: string
  maxPoint?: number
  placeholder?: string
  colNum?: string
  // Check if password needs strength check, show strength
  valid?: boolean
  // Password strength level
  pdRestrict?: string
  // Function triggered on click
  clickAction?: () => string
  // Validation function
  validateAction?: (val: string) => Record<string, any>
  // Function for showing/hiding fields
  inputKeyupAction?: (val: string) => void
  // Function provided for FormButtonExt.vue component
  btnComponentAction?: () => void
  changeAction?: (val: any) => Promise<void> | void
}

// Define the structure for custom buttons
export interface CustomButton {
  label: string
  type: 'button' | 'submit' | 'reset'
  variant: string
  action: (param: any) => void
}

// Props
const props = defineProps<{
  formConfig: FormField[]
  title: string
  formData: Record<string, any>
  customButtons?: CustomButton[] | null
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
// Filter configuration items where hide is false
const formConfigFilter = computed(() => {
  return props.formConfig.filter((field) => !field.hide)
})

/**
 * Assign value to confirm password when generating password
 * @param value generated password
 */
function generatorPwd(value: string) {
  for (const field of props.formConfig) {
    if (field.model == 'cnfrPdfield') {
      formDate[field.model] = value
    }
  }
}

const actionResult = (field: FormField) => {
  return field.clickAction?.() ?? ''
}
const btnComponentAction = (field: FormField) => {
  return field.btnComponentAction?.() ?? ''
}

/**
 * Input validation
 * @param field field
 * @param event event
 */
function handleInputKeyup(field: FormField, event: KeyboardEvent) {
  let data = (event.target as HTMLInputElement).value

  if (field.type == 'number') {
    // Truncate to max length
    if (field.maxlength && data.length > Number(field.maxlength)) {
      data = data.slice(field.maxPoint, Number(field.maxlength))
    }
    // Update value
    formDate[field.model] = data
  }

  field.inputKeyupAction?.(data)
  const isValidData = data !== '' && data !== undefined && data !== null

  if (isValidData) {
    const validateAction = field.validateAction?.(data)

    if (validateAction) {
      const isValidResult = validateAction.result === true

      field.invalids = !isValidResult
      field.invalidsTxt = isValidResult ? '' : validateAction.message
      field.invalidsPattern = isValidResult ? [] : validateAction.messagePattern
    }
    // If validateAction does not exist, keep original (do not modify field)
  } else {
    const isRequired = field.required === true

    field.invalids = isRequired
    field.invalidsTxt = isRequired ? 'javax.validation.constraints.NotNull.message' : ''
    field.invalidsPattern = []
  }
}

const getComponentType = (type: string) => {
  if (type == 'img') {
    return FormImgFile
  } else if (type == 'file') {
    return FormFile
  } else if (type == 'password') {
    return FormPassword
  } else if (type == 'radio') {
    return FormRadio
  } else if (type == 'btn') {
    return FormButtonExt
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
  formDate.oid = ''
  valida.value = false
  appStore.toggleFormTitle('')
}

const itemClass = (colNum: string | undefined) => {
  return 'col-md-' + (colNum ?? '6')
}

// Emit the search event
const emit = defineEmits(['submit', 'goBack', 'resetFormBtn'])

// Define the form object dynamically based on formConfig
const formDate = reactive<Record<string, any>>({})

// Initialize form object based on formConfig
for (const field of props.formConfig) {
  formDate[field.model] = props.formData[field.model] || field.default
}
const resetForm = () => {
  for (const field of props.formConfig) {
    field.invalids = false
    field.invalidsTxt = ''
    field.invalidsPattern = []
    formDate[field.model] = field.default
  }
  formDate.oid = ''
  valida.value = false
}
const resetFormBtn = () => {
  if (props.title === 'UPDATE') {
    for (const field of props.formConfig) {
      if (!field.readOnly) {
        formDate[field.model] = props.formData[field.model] ?? field.default
        if (field.type == 'img' || field.type === 'file') {
          const input = document.querySelector(`input[type="file"][id="${field.ID}"]`) as HTMLInputElement
          if (input) input.value = ''
        }
      }
    }
  } else if (props.title === 'LOAD') {
    for (const field of props.formConfig) {
      if (!field.readOnly) {
        formDate[field.model] = field.default

        if (field.type == 'img') {
          if (props.formData[field.model]) {
            formDate[field.model] = props.formData[field.model]
            const input = document.querySelector(`input[type="file"][id="${field.ID}"]`) as HTMLInputElement
            if (input) input.value = ''
          }
        }
      }
    }
  } else {
    for (const field of props.formConfig) {
      if (!field.readOnly) {
        field.invalids = false
        formDate[field.model] = field.default

        // If file type, clear DOM element directly
        if (field.type === 'file') {
          formDate[field.model] = null
          const input = document.querySelector(`input[type="file"][id="${field.ID}"]`) as HTMLInputElement
          if (input) input.value = ''
        }
      }
    }
  }

  // **Clear validation status of all fields here, cancel all prompts**
  for (const field of props.formConfig) {
    field.invalids = false
    field.invalidsTxt = ''
    field.invalidsPattern = []
  }

  emit('resetFormBtn', { ...formDate })
}

const appStore = useAppStoreHook()

watch(
  () => props.formData,
  (newData) => {
    if (newData) {
      for (const field of props.formConfig) {
        formDate[field.model] = newData[field.model] ?? field.default
      }
      if (newData['oid']) {
        formDate['oid'] = newData['oid']
      }
      // Single institution form carries issuerOid by default
      if (appStore.organ === UserType.Issuer) {
        formDate['issuerOid'] = userState.user.issuerOid
      }
    }
  },
  { immediate: true }
)

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
  appStore.toggleFormTitle('')
  emit('goBack', { ...formDate })
  valida.value = false
}
// Used for formInput component validation. When closing window and model becomes empty, error msg appears. Add this field: set to true (validate) when opening form, set to false (no validation) when closing form.
const valida = ref(true)
const submit = () => {
  let validation = true
  //check form
  for (const field of props.formConfig) {
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

      // Check if custom validation passed
      if (formDate[field.model]) {
        const validateAction = field.validateAction?.(formDate[field.model])
        if (validateAction) {
          if (!validateAction.result) {
            field.invalids = true
            field.invalidsTxt = validateAction.message
            field.invalidsPattern = validateAction.messagePattern
            validation = false
            continue // Only skip current loop
          }
        }
      }
    }
  }

  if (validation) {
    // Enable homepage scrollbar
    enablePageScroll()
    emit('submit', { ...formDate })
    for (const field of props.formConfig) {
      field.invalids = false
      field.invalidsTxt = ''
      field.invalidsPattern = []
    }
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
</script>

<style scoped>
.modal-dialog {
  max-width: 60%;
  margin: 7rem auto;
}

.modal-content {
  border: 0;
}
</style>
