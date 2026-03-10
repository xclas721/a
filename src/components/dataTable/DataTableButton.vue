<template>
  <button type="button" @click="handleClick" :class="buttonClasses" :disabled="isDisabled">
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
    default: 'outlined'
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
  const classes: string[] = ['btn', 'm-1']

  // size
  if (props.size === 'sm') {
    classes.push('btn-sm')
  } else if (props.size === 'lg') {
    classes.push('btn-lg')
  }

  // appearance + variant（預設為 outlined）
  if (props.appearance === 'contained') {
    classes.push(`btn-${props.variant}`)
  } else if (props.appearance === 'text') {
    classes.push('btn-link')
  } else {
    classes.push(`btn-outline-${props.variant}`)
  }

  if (props.isDisabled) {
    classes.push('disabled')
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
  padding: 4px 20px;
  font-size: 14px;
  border-radius: 6px;
}

/* Disabled: fade + grayscale; outline gray is in _theme.scss (light/dark) so dark mode stays visible */
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  filter: grayscale(0.6);
}
</style>
