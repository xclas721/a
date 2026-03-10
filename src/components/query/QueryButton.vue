<template>
  <!-- Ensure that the button tag is properly closed -->
  <button
    :type="type"
    :class="[...buttonClasses, { disabled: isDisabled }]"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <!-- Use t() only if isI18n is true, otherwise display the label directly -->
    {{ isLabelI18n ? t(label) : label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Define props for the button component
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary'
  },
  appearance: {
    type: String as () => 'contained' | 'outlined' | 'text',
    default: 'contained'
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg',
    default: 'md'
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  isLabelI18n: {
    type: Boolean,
    default: true
  }
})

// Emit click event
const emit = defineEmits(['click'])

// 統一按鈕 class：variant + appearance + size
const buttonClasses = computed(() => {
  const classes: string[] = ['btn']

  // size
  if (props.size === 'sm') {
    classes.push('btn-sm')
  } else if (props.size === 'lg') {
    classes.push('btn-lg')
  }

  // appearance + variant
  if (props.appearance === 'outlined') {
    classes.push(`btn-outline-${props.variant}`)
  } else if (props.appearance === 'text') {
    classes.push('btn-link')
  } else {
    classes.push(`btn-${props.variant}`)
  }

  return classes
})

// Handle button click and emit event
const handleClick = () => {
  if (!props.isDisabled) {
    emit('click')
  }
}
</script>

<style scoped>
.btn {
  padding: 6px 40px;
  font-size: 16 px;
  cursor: pointer;
  border-radius: 6px;
  margin: 0 10px;
}
.btn:disabled {
  cursor: not-allowed;
}
</style>
