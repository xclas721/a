<template>
  <component :is="wrapperTag" :class="wrapperClass" :style="wrapperStyle">
    <div class="m-0">
      <button :id="id" :type="type" @click="handleClick" :class="buttonClasses" :disabled="isDisabled">
        <span class="mx-2">{{ isLabelI18n ? t(label) : label }}</span>
      </button>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Define props for the button component
const props = defineProps({
  id: {
    type: String,
    required: false
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  },
  // semantic variant
  variant: {
    type: String,
    default: 'primary'
  },
  // visual style: 實心 / 描邊 / 文字
  appearance: {
    type: String as () => 'contained' | 'outlined' | 'text',
    default: 'contained'
  },
  // size: 對應 Bootstrap btn-sm / default / btn-lg
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
  },
  /** 為 true 時不包外層 col-md-2，由父層控制版面（例如表單底多顆按鈕並排） */
  noWrapper: {
    type: Boolean,
    default: false
  }
})

// Emit click event
const emit = defineEmits(['click'])

const wrapperTag = computed(() => 'div')
const wrapperClass = computed(() => (props.noWrapper ? 'm-0 w-100' : 'col-md-2 p-2'))
const wrapperStyle = computed(() => (props.noWrapper ? {} : { marginLeft: '13%' }))

// 統一按鈕 class：variant + appearance + size
const buttonClasses = computed(() => {
  const classes: string[] = ['btn', 'w-100', 'd-flex', 'justify-content-center', 'align-items-center']

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
