<template>
  <div class="slider-container">
    <div v-if="riskReport" class="mb-3">
      <!-- Risk Assessment Threshold: Slider -->
      <div class="row">
        <div class="col-md-12 text-center my-2">
          <div class="progress mb-0">
            <div
              class="progress-bar progress-bar-striped progress-bar-animated risk-bar-striped bg-warning"
              :style="['height:28px', { width: riskReportHandle(riskReport) + '%' }]"
            >
              <span>{{ riskReportHandle(riskReport) }}%</span>
            </div>
          </div>
        </div>

        <div class="col-md-6 bold text-danger">
          <span>{{ $t('ui.risk-indicator.percentage') }}：</span>
          <span>{{ riskReportHandle(riskReport) }}%</span>
          <span
            >&nbsp;(<template v-if="riskReport.riskLevel">{{ $t('RISK_LEVEL.' + riskReport.riskLevel) }}</template
            >)</span
          >
        </div>
        <div class="col-md-6 bold text-danger">
          <span>{{ $t('ui.risk-indicator.score') }}：</span>
          <span>{{ riskReport.riskScore }}</span
          ><br />
        </div>
      </div>
    </div>
    <div class="slider-track progress" :style="{ height: !isEditing ? '35px' : '35px' }">
      <!-- Render different colored areas -->
      <div
        class="progress-bar progress-bar-striped risk-bar-striped bg-success"
        :style="{ width: threshold.accept + '%' }"
      >
        <span class="range-in-bar">{{ $t('ui.rba.risk.low') }}</span>
      </div>
      <div
        class="progress-bar progress-bar-striped risk-bar-striped bg-warning"
        :style="{
          left: threshold.accept + '%',
          width: threshold.challenge - threshold.accept + '%'
        }"
      >
        <span class="range-in-bar">{{ $t('ui.rba.risk.medium') }}</span>
      </div>
      <div
        class="progress-bar progress-bar-striped risk-bar-striped bg-danger"
        :style="{ left: threshold.challenge + '%', width: 100 - threshold.challenge + '%' }"
      >
        <span class="range-in-bar">{{ $t('ui.rba.risk.high') }}</span>
      </div>

      <div v-if="isEditing" class="thumb-layer">
        <span class="thumb-value thumb-value-above" :style="{ left: threshold.accept + '%' }"
          >{{ threshold.accept }}%</span
        >
        <span class="thumb-value thumb-value-above" :style="{ left: threshold.challenge + '%' }"
          >{{ threshold.challenge }}%</span
        >
        <div class="thumb-wrap" :style="{ left: threshold.accept + '%' }">
          <div class="thumb left-thumb" @mousedown="startDragging('left')"></div>
        </div>
        <div class="thumb-wrap" :style="{ left: threshold.challenge + '%' }">
          <div class="thumb right-thumb" @mousedown="startDragging('right')"></div>
        </div>
      </div>
    </div>

    <div class="range-labels">
      <div class="range-label-item range-label-low">{{ $t('ui.rba.risk.low') }}：0% ~ {{ threshold.accept }}%</div>
      <div class="range-label-item range-label-medium">
        {{ $t('ui.rba.risk.medium') }}：{{ threshold.accept }}% ~ {{ threshold.challenge }}%
      </div>
      <div class="range-label-item range-label-high">
        {{ $t('ui.rba.risk.high') }}：{{ threshold.challenge }}% ~ 100%
      </div>
    </div>
  </div>
  <!-- Summary + Actions: same row, summary centered, buttons right -->
  <div class="rba-footer-row mt-3">
    <div class="rba-footer-summary-wrap">
      <div class="rba-threshold-summary">
        <div class="rba-summary-item">
          <span class="rba-summary-label">{{ $t('ui.rba.count') }}</span>
          <span class="rba-summary-value">{{ threshold.ruleCount }}</span>
          <span class="rba-summary-unit">{{ $t('ui.rba.count.unit') }}</span>
        </div>
        <div class="rba-summary-item">
          <span class="rba-summary-label">{{ $t('ui.rba.summary') }}</span>
          <span class="rba-summary-value">{{ threshold.summary }}</span>
          <span class="rba-summary-unit">{{ $t('ui.rba.summary.unit') }}</span>
        </div>
      </div>
    </div>
    <div v-if="btnShow" class="form-footer-buttons">
      <div class="d-flex justify-content-between align-items-center gap-2 w-100">
        <div class="d-flex gap-2">
          <FormButton v-if="isEditing" noWrapper label="btn.cancel" type="button" variant="secondary" @click="goBack" />
        </div>
        <div class="d-flex gap-2 align-items-center">
          <FormButton
            v-if="submitShow && isEditing"
            noWrapper
            label="btn.save"
            type="button"
            variant="primary"
            :isDisabled="isLoading"
            @click="submit"
          />
          <FormButton v-if="!isEditing" noWrapper label="btn.update" type="button" variant="primary" @click="update" />
          <span v-if="isLoading" class="spinner-border spinner-border-sm text-primary" role="status"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import FormButton from '@/components/formTable/FormButton.vue'

const { t } = useI18n()

const props = defineProps<{
  thresholdDetail: Record<string, any>
  riskReport?: Record<string, any>
  isEditing: boolean
  btnShow: boolean
}>()

const threshold = reactive<Record<string, any>>({
  ruleCount: 0,
  summary: 0,
  accept: 20,
  challenge: 80
})

const isLoading = ref(false)
const submitShow = ref(true)

const riskReportHandle = (riskReport: any) => {
  if (props.thresholdDetail.summary) {
    return ((riskReport.riskScore / props.thresholdDetail.summary) * 100).toFixed(2) ?? 0
  } else {
    return 0
  }
}
let draggingThumb: 'left' | 'right' | null = null

const startDragging = (thumb: 'left' | 'right') => {
  draggingThumb = thumb
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopDragging)
}

const stopDragging = () => {
  draggingThumb = null
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopDragging)
}

const onMouseMove = (e: MouseEvent) => {
  if (!draggingThumb) return

  const track = document.querySelector('.slider-track') as HTMLElement
  const trackRect = track.getBoundingClientRect()
  const offsetX = e.clientX - trackRect.left

  // Calculate current percentage
  const percent = Math.min(100, Math.max(0, (offsetX / trackRect.width) * 100))

  if (draggingThumb === 'left') {
    // If left slider moves past right slider, swap roles
    if (percent >= threshold.challenge) {
      draggingThumb = 'right' // Current sliding becomes right slider
      threshold.accept = Math.round(threshold.challenge) // Left slider position equals right slider position
      threshold.challenge = Math.round(percent) // Right slider follows sliding
    } else {
      threshold.accept = Math.round(percent)
    }
  }

  if (draggingThumb === 'right') {
    // If right slider moves past left slider, swap roles
    if (percent <= threshold.accept) {
      draggingThumb = 'left' // Current sliding becomes left slider
      threshold.challenge = Math.round(threshold.accept) // Right slider position equals left slider position
      threshold.accept = Math.round(percent) // Left slider follows sliding
    } else {
      threshold.challenge = Math.round(percent)
    }
  }
}
watch(
  () => props.thresholdDetail,
  (newData) => {
    console.debug('newData', newData)
    for (const thresholdKey in threshold) {
      threshold[thresholdKey] = newData[thresholdKey]
    }
  },
  { deep: true }
)
onMounted(() => {
  document.addEventListener('mouseup', stopDragging)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', stopDragging)
})

const goBack = () => {
  swalMessage.confirm(t('ui.rba.message.button.cancel'), t('ui.message.info'), () => {
    for (const thresholdKey in threshold) {
      threshold[thresholdKey] = props.thresholdDetail[thresholdKey]
    }
    emit('goBack', {})
    emit('update', false)
  })
}
const update = () => {
  emit('update', true)
}

const submit = () => {
  if (isLoading.value) {
    return
  }
  console.log(isLoading.value)
  isLoading.value = true
  emit('submit', { ...threshold })
}
// Expose method for parent component call
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setLoading = (value: boolean) => {
  isLoading.value = false
  console.log(isLoading.value)
}

// Expose state and method
defineExpose({
  setLoading
})
// Emit the search event
const emit = defineEmits(['goBack', 'submit', 'update'])
</script>

<style scoped>
/* Slider container and track */
.slider-container {
  width: 100%;
  margin: 1rem 0;
}

.slider-track {
  position: relative;
  border-radius: 0.5rem;
  user-select: none;
  overflow: visible;
}

.slider-track .progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-track .progress-bar:first-child {
  border-radius: 0.5rem 0 0 0.5rem;
}
.slider-track .progress-bar:last-child {
  border-radius: 0 0.5rem 0.5rem 0;
}

/* Slider node and above value */
.thumb-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.thumb-layer .thumb-wrap {
  pointer-events: none;
}
.thumb-layer .thumb {
  pointer-events: auto;
}

.thumb-value-above {
  position: absolute;
  top: -1.35rem;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--cui-body-color);
  white-space: nowrap;
}

.thumb-wrap {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

.thumb {
  width: 35px;
  height: 35px;
  background: var(--sidebar-active-bg, #8c1c36);
  border: 2px solid var(--cui-body-bg);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

/* Progress bar inner text */
.range-in-bar {
  display: block;
  text-align: center;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

/* Bottom range labels (underline style) */
.range-labels {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.range-label-item {
  padding: 0.35rem 0.5rem;
  text-align: center;
  color: var(--cui-body-color);
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 3px solid transparent;
}

.range-label-item.range-label-low {
  border-bottom-color: var(--bs-success, #198754);
}
.range-label-item.range-label-medium {
  border-bottom-color: var(--bs-warning, #ffc107);
}
.range-label-item.range-label-high {
  border-bottom-color: var(--bs-danger, #dc3545);
}

/* Summary + buttons in the same row */
.rba-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.rba-footer-summary-wrap {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.rba-footer-row .form-footer-buttons {
  flex: 0 0 auto;
}

.rba-threshold-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.rba-summary-item {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  padding: 0.4rem 0.75rem;
  background: var(--cui-tertiary-bg);
  border-radius: 0.375rem;
  font-size: 0.9375rem;
}

.rba-summary-label,
.rba-summary-unit {
  color: var(--cui-secondary-color, rgba(0, 0, 0, 0.65));
}

.rba-summary-value {
  font-weight: 600;
  color: var(--cui-body-color);
}

/* progress striped (to prevent theme override) */
.risk-bar-striped.progress-bar-striped {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}
</style>
