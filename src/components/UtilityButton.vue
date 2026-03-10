<template>
  <button :type="type" :class="buttonClasses" :disabled="isDisabled || loading" @click="handleClick">
    <template v-if="loading">
      <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
      <span v-if="loadingText">{{ isLabelI18n ? t(loadingText) : loadingText }}</span>
    </template>
    <template v-else>
      <i v-if="icon" :class="['me-1', icon]"></i>
      <span v-if="label">
        {{ isLabelI18n ? t(label) : label }}
      </span>
      <slot v-else />
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  label: {
    type: String,
    required: false
  },
  isLabelI18n: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    required: false
  },
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  },
  // semantic variant
  variant: {
    type: String as () => 'primary' | 'secondary' | 'tertiary' | 'danger',
    default: 'secondary'
  },
  // visual style
  appearance: {
    type: String as () => 'contained' | 'outlined' | 'text',
    default: 'text'
  },
  // size
  size: {
    type: String as () => 'sm' | 'md' | 'lg',
    default: 'sm'
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  /** When true, shows spinner and disables the button (e.g. for submit) */
  loading: {
    type: Boolean,
    default: false
  },
  /** Optional i18n key or text shown next to spinner when loading (e.g. 'btn.save') */
  loadingText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void
}>()

const buttonClasses = computed(() => {
  const classes: string[] = ['btn']

  // size
  if (props.size === 'sm') {
    classes.push('btn-sm')
  } else if (props.size === 'lg') {
    classes.push('btn-lg')
  }

  // appearance + variant
  if (props.appearance === 'contained') {
    classes.push(`btn-${props.variant}`)
  } else if (props.appearance === 'outlined') {
    classes.push(`btn-outline-${props.variant}`)
  } else {
    // text style
    classes.push('btn-link')
  }

  return classes
})

const handleClick = (evt: MouseEvent) => {
  if (!props.isDisabled) {
    emit('click', evt)
  }
}
</script>
