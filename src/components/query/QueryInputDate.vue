<template>
  <div class="form-group">
    <label :for="id">{{ isLabelI18n ? t(label) : label }}</label>
    <DatePicker v-model="internalValue" format="yyyy-MM-dd HH:mm:ss" :end-date-flag="endDateFlag" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import DatePicker from '@/components/DatePicker.vue'
const { t } = useI18n()

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
  isLabelI18n: {
    type: Boolean,
    default: true
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  endDateFlag: {
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

const emit = defineEmits(['update:modelValue'])
// Create internal value as a ref to make it reactive
const internalValue = ref(props.modelValue)

// Synchronize the internal value with the modelValue prop
watchEffect(() => {
  internalValue.value = props.modelValue
})

// Watch for changes in internal value and emit updates to the parent component
watchEffect(() => {
  emit('update:modelValue', internalValue.value)
})
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
</style>
