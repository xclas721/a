<template>
  <!-- Label and Tooltip -->
  <template v-if="showLabel">
    <template v-if="readOnly">
      <span class="pl-2 d-inline-block input-text mb-2" v-if="LabelVal" :class="getLabelClass" :style="styleTxt">
        {{ $t(LabelVal) }}
      </span>
    </template>
    <template v-else>
      <span class="pl-2 input-text mb-2" v-if="LabelVal" :class="getLabelClass" :style="styleTxt">
        {{ $t(LabelVal) }}
      </span>
    </template>
    <i v-if="tooltip" class="fas fa-question-circle input-tooltip" data-toggle="tooltip" :title="tooltip" />
  </template>

  <!-- Radio Group -->
  <div class="radio-group">
    <template v-for="(option, index) in options" :key="index">
      <label class="radio-item me-3">
        <input
          type="radio"
          :value="option.value"
          v-model="internalValue"
          :disabled="readOnly"
          :class="{ 'input-error': invalidsValue }"
          @input="inputKeyup"
        />
        <span class="radio-label">
          {{ isBaseI18nSelect(option) ? t(option.i18nText) : option.text }}
        </span>
      </label>
    </template>
  </div>

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
  LabelVal: {
    type: String,
    required: true
  },
  ID: {
    type: String,
    required: true
  },
  invalids: {
    type: Boolean,
    required: false
  },
  options: {
    type: Array as () => Option[] | BaseI18nSelect[] | BaseSelect[],
    required: false,
    default: () => []
  },
  type: {
    type: String,
    required: true
  },
  inputClass: {
    type: String,
    required: false
  },
  inputStyle: {
    type: String,
    required: false
  },
  readOnly: {
    type: Boolean,
    required: false
  },
  required: {
    type: Boolean,
    required: false
  },
  pdRestrict: { type: String, required: false },
  valid: { type: Boolean, required: false },
  tooltip: {
    type: String,
    required: false
  },
  placeholder: {
    type: String,
    required: false
  },
  maxlength: {
    type: String,
    required: false
  },
  modelValue: {
    type: String,
    required: false
  },
  // Whether validation is required
  validation: {
    type: Boolean,
    required: false
  },
  action: {
    type: String,
    required: false
  },
  invalidsTxt: {
    type: String,
    required: false,
    default: 'javax.validation.constraints.NotNull.message'
  },
  invalidsPattern: {
    type: Array as () => string[],
    required: false
  }
})

const emit = defineEmits(['btnClick', 'clickFunc', 'update:modelValue', 'clickUpFunc', 'update:invalids', 'change'])

// Create a ref for the internal value
const internalValue = ref(props.modelValue)
const invalidsValue = ref(props.invalids)

// Watch for changes in the modelValue prop and update the internalValue ref accordingly
watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
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

function inputKeyup(event: any) {
  emit('clickUpFunc', event)
}

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
</script>

<style scoped>
.radio-group {
  display: flex;
  gap: 8px;
  padding-left: 8px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-item input[type='radio'] {
  margin: 0;
  width: 16px;
  height: 16px;
}

.radio-label {
  user-select: none;
}
</style>
