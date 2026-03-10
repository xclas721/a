<template>
  <!-- Label and Tooltip -->
  <template v-if="showLabel">
    <template v-if="readOnly">
      <span class="pl-2 d-inline-block input-text mb-2" v-if="LabelVal" :class="getLabelClass" :style="styleTxt">
        {{ $t(LabelVal) }}
      </span>
    </template>
    <template v-else>
      <label class="pl-2 input-text mb-2" :for="getID" v-if="LabelVal" :class="getLabelClass" :style="styleTxt">
        {{ $t(LabelVal) }}
      </label>
    </template>
    <i v-if="tooltip" class="fas fa-question-circle input-tooltip" data-toggle="tooltip" :title="tooltip" />
  </template>

  <!-- Input -->
  <template v-if="readOnly && getType !== 'checkbox'">
    <div class="selectText input text-break" :class="getInputClass" :style="disableStyle">
      {{ modelValue }}
    </div>
  </template>
  <template v-else>
    <template v-if="getType === 'text' || getType === 'number'">
      <div class="input-container">
        <input
          :type="getType"
          :name="getID"
          :id="getID"
          v-model="internalValue"
          :class="['form-control', { 'input-error': invalidsValue }]"
          :placeholder="placeholder ? $t(placeholder) : ''"
          :maxlength="maxlength"
          @keyup="inputKeyup"
          @change="handleChange"
        />
      </div>
    </template>
    <template v-else-if="getType === 'checkbox'">
      <select
        :id="getID"
        v-model="internalValue"
        :class="['form-control', { 'input-error': invalidsValue }]"
        :disabled="readOnly"
        @change="handleSelectChange"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ isBaseI18nSelect(option) ? t(option.i18nText) : option.text }}
        </option>
      </select>
    </template>
  </template>

  <!-- Error Message -->
  <div class="text-danger small" v-if="invalidsValue">
    <span>{{ $t(getInvalidsTxt, invalidsPattern ?? []) }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'

const { t } = useI18n()

interface Option {
  value: string
  text: string
}

const props = defineProps({
  LabelVal: { type: String, required: true },
  ID: { type: String, required: true },
  invalids: { type: Boolean, required: false },
  options: {
    type: Array as () => Option[] | BaseI18nSelect[] | BaseSelect[],
    required: false,
    default: () => []
  },
  type: { type: String, required: true },
  inputClass: { type: String, required: false },
  inputStyle: { type: String, required: false },
  readOnly: { type: Boolean, required: false },
  required: { type: Boolean, required: false },
  tooltip: { type: String, required: false },
  placeholder: { type: String, required: false },
  maxlength: { type: String, required: false },
  modelValue: { type: null, required: false },
  pdRestrict: { type: String, required: false },
  valid: { type: Boolean, required: false },
  // Whether validation is required
  validation: { type: Boolean, required: false },
  action: { type: String, required: false },
  invalidsTxt: {
    type: String,
    required: false,
    default: 'javax.validation.constraints.NotNull.message'
  },
  invalidsPattern: { type: Array as () => string[], required: false }
})

const emit = defineEmits(['btnClick', 'clickFunc', 'update:modelValue', 'clickUpFunc', 'update:invalids', 'change'])
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change', target.value)
}

// Modify select change handling
const handleSelectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('change', target.value)
  inputKeyup(event) // Keep original keyup event trigger
}
// Create a ref for the internal value
const internalValue = ref(props.modelValue)
const invalidsValue = ref(props.invalids)

// Watch for changes in the modelValue prop and update the internalValue ref accordingly
watch(
  () => props.modelValue,
  (newValue) => {
    const newval = newValue.toString().trim()
    internalValue.value = newval

    if (props.required && props.invalids) {
      // Check if the form is opening or closing. Skip validation if closing.
      if (props.validation) {
        if (typeof newValue === 'string') {
          invalidsValue.value = !(newval && newval.trim() !== '')
        } else {
          invalidsValue.value = !newval
        }
      }
    }
  }
)
// Watch for changes in internalValue and emit them to the parent component
watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
})

// Watch changes in props.invalids, sync update invalidsValue
watch(
  () => props.invalids,
  (newValue) => {
    invalidsValue.value = newValue
  }
)

// Watch invalidsValue to notify parent component
watch(invalidsValue, (newValue) => {
  emit('update:invalids', newValue)
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

function isBaseI18nSelect(option: BaseI18nSelect | BaseSelect): option is BaseI18nSelect {
  return (option as BaseI18nSelect).i18nText != undefined
}

const getInvalidsTxt = computed(() => {
  return props.invalidsTxt
})

const showLabel = computed(() => !!props.LabelVal)

const getID = computed(() => {
  return props.ID
})

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
  if (!internalValue.value) {
    style['height'] = '38px'
  }
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
  emit('clickUpFunc', event)
}
</script>

<style scoped>
/* Error State Styles */
</style>
