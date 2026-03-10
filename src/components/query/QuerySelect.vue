<template>
  <div class="form-group">
    <label :for="id">{{ isLabelI18n ? t(label) : label }}</label>
    <select v-model="internalValue" :id="id" class="form-control" :disabled="readOnly">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ isBaseI18nSelect(option) ? t(option.i18nText) : option.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import { isBaseI18nSelect } from '@/utils/util'
const { t } = useI18n()

// Define the type for options
interface Option {
  value: string
  text: string
}

// Define props for the select component
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  options: {
    type: Array as () => Option[] | BaseI18nSelect[] | BaseSelect[],
    required: true
  },
  isLabelI18n: {
    type: Boolean,
    default: true
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: String,
    required: false
  },
  format: {
    type: String,
    required: false,
    default: 'yyyy-MM-dd HH:mm:ss'
  }
})

// Emit the updated value to the parent component
const emit = defineEmits(['update:modelValue'])

// Create an internal value as a ref for the select dropdown
const internalValue = ref(props.modelValue)

// Watch for changes in the modelValue prop and update the internalValue ref accordingly
watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  }
)

// Watch for changes in internalValue and emit them to the parent component
watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
</style>
