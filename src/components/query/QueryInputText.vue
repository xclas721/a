<template>
  <div class="form-group">
    <label :for="id">{{ isLabelI18n ? t(label) : label }}</label>
    <input
      type="text"
      :id="id"
      v-model="internalValue"
      class="form-control"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :readonly="readOnly"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Define props for the text input component
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
  placeholder: {
    type: String,
    default: ''
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

// Create a ref for the internal value
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
