<template>
  <div class="input-label">
    <span class="input-label">&nbsp;</span>
    <button type="button" @click="handleClick" class="btn btn-primary">
      <span class="mx-2">{{ t(LabelVal) }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Define props for the button component
defineProps({
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
  modelValue: {
    type: [Object, String],
    default: null
  },
  validation: {
    type: Boolean,
    required: false
  },
  required: {
    type: Boolean,
    required: false
  },
  readOnly: {
    type: Boolean,
    required: false
  },
  invalidsTxt: {
    type: String,
    required: false,
    default: 'javax.validation.constraints.NotNull.message'
  }
})

// Emit click event
const emit = defineEmits(['btnClick', 'clickFunc', 'update:modelValue', 'update:invalids'])

// Handle button click and emit event
const handleClick = () => {
  emit('btnClick')
}
</script>

<style scoped>
.input-label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
