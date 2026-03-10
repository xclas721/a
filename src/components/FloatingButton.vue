<template>
  <button class="floating-button" :style="buttonStyle" @click="handleClick">
    <i v-if="icon" :class="[icon, 'me-2']"></i>
    <span>{{ isLabelI18n ? $t(label) : label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

useI18n()

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'fas fa-external-link-alt'
  },
  isLabelI18n: {
    type: Boolean,
    default: true
  },
  top: {
    type: String,
    default: '55px'
  },
  right: {
    type: String,
    default: '30px'
  }
})

const emit = defineEmits(['click'])

const buttonStyle = computed(() => ({
  top: props.top,
  right: props.right
}))

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.floating-button {
  position: absolute;
  z-index: 1000;
  background: rgba(55, 144, 190, 0.5);
  color: #ffffff;
  border: none;
  padding: 0.45rem 0.875rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.3;
  box-shadow: 0 2px 8px rgba(55, 144, 190, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  cursor: pointer;
}

.floating-button:hover {
  background: rgba(55, 144, 190, 0.95);
  box-shadow: 0 4px 12px rgba(55, 144, 190, 0.4);
  transform: translateY(-1px);
}

.floating-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(55, 144, 190, 0.3);
}
</style>
