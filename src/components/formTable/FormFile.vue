<template>
  <div class="input-container">
    <label :for="ID" class="input-label" :class="getLabelClass">{{ $t(LabelVal) }}</label>
    <!-- Outer Bootstrap style simulates file style -->
    <div class="input-group">
      <span
        class="input-group-text"
        @click="triggerFileSelect"
        :class="{ disabled: readOnly, 'input-error text-danger': invalidsValue }"
        style="cursor: pointer"
      >
        {{ $t('ui.upload.select-file') }}
      </span>

      <input
        type="text"
        :class="['form-control', { 'input-error': invalidsValue }]"
        :value="fileName"
        @click="triggerFileSelect"
        :placeholder="$t('ui.upload.select-file-placeholder')"
        :disabled="readOnly"
      />

      <!-- Real input file: hidden -->
      <input ref="fileInput" type="file" class="d-none" @change="handleFileChange" :disabled="readOnly" :id="ID" />
    </div>
    <div class="text-danger small" v-if="invalidsValue">
      <span>{{ $t(getInvalidsTxt, invalidsPattern ?? []) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import swalMessage from '@/plugins/swalMessage'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'

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
  },
  invalidsPattern: {
    type: Array as () => string[],
    required: false
  }
})
const emit = defineEmits(['btnClick', 'clickFunc', 'update:modelValue', 'update:invalids'])

const invalidsValue = ref(props.invalids)
const appStore = useAppStore()
const { t } = useI18n()
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

const fileInput = ref<HTMLInputElement | null>(null)
const isFullScreen = ref(false)

const fileName = ref('')

function triggerFileSelect() {
  if (!fileInput.value) return
  fileInput.value.click()
}
watch(
  () => props.modelValue,
  (newValue) => {
    emit('update:modelValue', newValue)
    if ((newValue == null || newValue == '') && fileInput.value) {
      fileInput.value.value = '' // Clear file input box
      isFullScreen.value = false
      fileName.value = ''
    }
    if (props.required && props.invalids) {
      if (props.validation) {
        invalidsValue.value = newValue == null
      }
    }
  }
)

const getLabelClass = computed(() => {
  let labelClass = props.required ? 'required ' : ''
  if (!props.readOnly && invalidsValue.value) {
    labelClass = labelClass + ' text-danger'
  }
  return labelClass
})
function handleFileChange(event: Event) {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0]
    // File too large
    if (file.size > appStore.maxFileSize) {
      swalMessage.error(fileInput.files[0].name + t('warn.currency.file.size.error'))
      fileInput.value = ''
      return
    }
    emit('update:modelValue', file)
    fileName.value = file.name
  } else {
    emit('update:modelValue', null)
    fileName.value = ''
  }
}

const getInvalidsTxt = computed(() => props.invalidsTxt)
</script>

<style scoped>
.input-label {
  display: block;
  margin-bottom: 0.5rem;
}
.input-error {
  border-color: #dc3545;
}
.required:before {
  content: '* ';
  color: red;
}
</style>
