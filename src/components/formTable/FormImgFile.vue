<template>
  <div class="input-container">
    <label :for="ID" class="input-label" :class="getLabelClass">{{ $t(LabelVal) }}</label>

    <!-- Left-Right Layout Container -->
    <div class="layout-container">
      <!-- Left: File Input Area -->
      <div class="input-section">
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
          <input
            ref="fileInput"
            type="file"
            class="d-none"
            @change="handleFileChange"
            accept="image/x-png"
            :disabled="readOnly"
            :id="ID"
          />
        </div>
        <div class="text-danger small" v-if="invalidsValue">
          <span>{{ $t(getInvalidsTxt) }}</span>
        </div>
      </div>

      <!-- Right: Image Preview Area -->
      <div class="preview-section" v-if="imageSrc">
        <div @click="toggleFullScreen" style="cursor: pointer">
          <img v-if="!isFullScreen" :src="imageSrc" alt="選中的圖片" class="thumbnail" />
          <div v-else class="overlay" @click="toggleFullScreen">
            <img :src="imageSrc" alt="全屏圖片" class="full-screen" />
            <button class="close-btn" @click.stop="toggleFullScreen">×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { base64ToFile } from '@/utils/util'
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
  }
})
const emit = defineEmits(['btnClick', 'clickFunc', 'update:modelValue', 'update:invalids'])

const invalidsValue = ref(props.invalids)

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

const imageSrc = ref<string | null>(null)
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
      imageSrc.value = null // Clear image preview
      isFullScreen.value = false
      fileName.value = ''
    } else if (newValue != null && newValue != '' && typeof newValue == 'string') {
      imageSrc.value = 'data:image/png;base64,' + newValue
      // Convert to file, submit again without error
      emit('update:modelValue', base64ToFile(imageSrc.value, 'img.png'))
      fileName.value = ''
    }

    if (props.required && props.invalids) {
      if (props.validation) {
        invalidsValue.value = newValue == null
      }
    }
  }
)

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
}
const appStore = useAppStore()
const { t } = useI18n()
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
    // Only images can be uploaded
    if (file.type !== 'image/png') {
      swalMessage.error(t('warn.issuer-user.file-format-error'))
      fileInput.value = ''
      return
    }
    const fileNa = file.name.toLowerCase()
    if (!fileNa.endsWith('.png')) {
      swalMessage.error(t('warn.issuer-user.file-format-error'))
      fileInput.value = ''
      return
    }
    emit('update:modelValue', file)

    // Create image URL
    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target?.result as string // Set image source
    }
    reader.readAsDataURL(file) // Read file as Data URL
    fileName.value = file.name
  } else {
    emit('update:modelValue', null)
    imageSrc.value = null // If no file, clear image preview
    fileName.value = ''
  }
}

const getInvalidsTxt = computed(() => 'javax.validation.constraints.NotNull.message')
</script>

<style scoped>
.input-label {
  display: block;
  margin-bottom: 0.5rem;
}

/* Left-Right Layout Container */
.layout-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

/* Left Input Area */
.input-section {
  flex: 1;
  min-width: 0;
}

/* Right Preview Area */
.preview-section {
  flex-shrink: 0;
  width: 120px;
  text-align: center;
}
.thumbnail {
  max-width: 100px;
  height: auto;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.full-screen {
  max-width: 90%;
  max-height: 90%;
  height: auto;
  width: auto;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  line-height: 24px;
  color: black;
  padding: 0;
  width: 40px;
  height: 40px;
}
</style>
