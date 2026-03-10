<template>
  <!-- Label and Tooltip -->
  <template v-if="showLabel">
    <template v-if="readOnly">
      <span class="pl-2 d-inline-block input-text m-0" v-if="LabelVal" :class="getLabelClass" :style="styleTxt">
        {{ $t(LabelVal) }}
      </span>
    </template>
    <template v-else>
      <label class="pl-2 input-text m-0" :for="getID" v-if="LabelVal" :class="getLabelClass" :style="styleTxt">
        {{ $t(LabelVal) }}
      </label>
    </template>
    <i v-if="tooltip" class="fas fa-question-circle input-tooltip" data-toggle="tooltip" :title="tooltip" />
  </template>

  <template v-if="readOnly">
    <div class="selectText input" :class="getInputClass" :style="disableStyle">
      {{ modelValue }}
    </div>
  </template>

  <template v-else>
    <div class="input-container input-group">
      <input
        :type="passwordVisible ? 'text' : 'password'"
        :name="getID"
        :id="getID"
        v-model="internalValue"
        :class="['form-control', { 'input-error': required && invalidsValue }]"
        :placeholder="placeholder || ''"
        :maxlength="maxlength"
        @keyup="inputKeyup"
      />
      <span class="input-group-text" @click="togglePasswordVisibility()">
        <i :class="passwordVisible ? 'ri-eye-line' : 'ri-eye-off-line'"></i>
      </span>
      <button v-if="action" class="btn btn-secondary" @click="generatorPassword">Generator</button>
    </div>

    <!-- Password Strength Indicator -->
    <div :class="strengthClass">
      <span>{{ passwordStrengthMessage }}</span>
    </div>
  </template>

  <!-- Error Message -->
  <div class="text-danger small" v-if="required && invalidsValue && !passwordStrengthMessage">
    <span>{{ $t(getInvalidsTxt, invalidsPattern ?? []) }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import zxcvbn from 'zxcvbn'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  LabelVal: { type: String, required: true },
  ID: { type: String, required: true },
  invalids: { type: Boolean, required: false },
  type: { type: String, required: true },
  inputClass: { type: String, required: false },
  inputStyle: { type: String, required: false },
  readOnly: { type: Boolean, required: false },
  required: { type: Boolean, required: false },
  tooltip: { type: String, required: false },
  placeholder: { type: String, required: false },
  maxlength: { type: String, required: false },
  modelValue: { type: String, required: false },
  validation: { type: Boolean, required: false },
  action: { type: String, required: false },
  pdRestrict: { type: String, required: false },
  valid: { type: Boolean, required: false },
  invalidsTxt: {
    type: String,
    required: false
  },
  invalidsPattern: {
    type: Array as () => string[],
    required: false
  }
})

const emit = defineEmits(['btnClick', 'clickFunc', 'update:modelValue', 'clickUpFunc', 'update:invalids', 'change'])

const internalValue = ref(props.modelValue)
const invalidsValue = ref(props.invalids)
const passwordStrength = ref()
const pwdInvalidsTxt = ref()
const { t } = useI18n()
const generatorPassword = () => {
  internalValue.value = props.action
  emit('update:modelValue', internalValue.value) // ✅ Ensure parent component gets value
  emit('clickFunc', internalValue.value)
}
// Watch for changes in the modelValue prop
watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
    if (!newValue) {
      pwdInvalidsTxt.value = ''
    }
    if (props.required && props.invalids) {
      // Check if the form is opening or closing. Skip validation if closing.
      if (props.validation) {
        if (typeof newValue === 'string') {
          invalidsValue.value = !(newValue && newValue.trim() !== '')
        } else {
          invalidsValue.value = !newValue
        }
      }
    }
    if (props.pdRestrict == '1' && props.valid) {
      passwordStrength.value = zxcvbn(internalValue.value ?? '')
      if (internalValue.value) {
        if (passwordStrength.value.score < 2) {
          invalidsValue.value = true
          pwdInvalidsTxt.value = t('pwd.weak')
          emit('update:invalids', true)
        } else {
          pwdInvalidsTxt.value = t('pwd.strong')
          invalidsValue.value = false
          emit('update:invalids', false)
        }
      } else {
        pwdInvalidsTxt.value = ''
      }
    }
  }
)

// Watch for changes in internalValue and emit them to the parent component
watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
})

// Sync invalids value with prop
watch(
  () => props.invalids,
  (newValue) => {
    invalidsValue.value = newValue
  }
)
const getInvalidsTxt = computed(() => {
  return 'javax.validation.constraints.NotNull.message'
})

const passwordVisible = ref(false)
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

// Computed properties for password strength message and style
const passwordStrengthMessage = computed(() => {
  return pwdInvalidsTxt.value
})

const strengthClass = computed(() => {
  return {
    'text-danger': passwordStrength.value && passwordStrength.value.score < 2,
    'text-success': passwordStrength.value && passwordStrength.value.score >= 2
  }
})

const getType = computed(() => props.type || 'text')

const getInputClass = computed(() => {
  let className = props.inputClass || (getType.value === 'file' ? 'form-control' : 'form-control text-left')
  if (!props.readOnly && getType.value !== 'file') className += ' bg-white'
  return className
})

const getLabelClass = computed(() => {
  let labelClass = props.required ? 'required ' : ''
  if (!props.readOnly && invalidsValue.value) {
    labelClass = labelClass + ' text-danger'
  }
  return labelClass
})
const getID = computed(() => {
  return props.ID
})
const showLabel = computed(() => !!props.LabelVal)
const styleTxt = computed(() => {
  if (props.inputStyle) {
    return props.inputStyle
  }
  const style = { 'max-width': 'calc(100% - 5px)' }
  if (props.tooltip) {
    style['max-width'] = 'calc(100% - 25px)'
  }
  return style
})
const disableStyle = computed(() => {
  const style: Record<string, any> = {}
  style['height'] = '38px'
  if (props.readOnly) {
    const colorMode = localStorage.getItem('admin-theme')
    if (colorMode == 'dark') {
      style['background-color'] = '#323a49'
    } else {
      style['background-color'] = '#e7eaee'
    }
  }
  return style
})
function inputKeyup(event: any) {
  emit('update:modelValue', internalValue.value)
  if (props.required) {
    if (!internalValue.value || !internalValue.value.trim()) {
      invalidsValue.value = true
      emit('update:invalids', true)
    } else {
      invalidsValue.value = false
      emit('update:invalids', false)
    }
  }
  emit('clickUpFunc', event) // Retain original logic
}
</script>

<style scoped>
.input-error {
  border-color: #dc3545; /* Red border color */
}
.text-danger {
  color: #dc3545; /* Red for weak passwords */
}
.text-success {
  color: #28a745; /* Green for strong passwords */
}
.required:before {
  content: '* ';
  color: red;
}
</style>
