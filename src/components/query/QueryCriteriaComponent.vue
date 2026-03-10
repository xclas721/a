<template>
  <div class="query-criteria">
    <h4>{{ title }}</h4>
    <div class="card-group" v-if="!hideBtn">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div v-for="(field, index) in visibleCriteria" :key="index" class="mb-2 order-0 col-md-3">
              <component
                :is="getComponentType(field.type)"
                v-model="criteria[field.model]"
                :id="field.props?.id ?? ''"
                :label="field.label"
                :maxlength="field.maxlength"
                :readOnly="field.readOnly"
                :endDateFlag="field.endDateFlag"
                v-bind="field.props"
              />
            </div>
          </div>
          <div class="row" v-if="advancedSearchOpen">
            <div v-for="(field, index) in hiddenCriteria" :key="index" class="mb-2 order-0 col-md-3">
              <component
                :is="getComponentType(field.type)"
                v-model="criteria[field.model]"
                :id="field.props?.id"
                :label="field.label"
                :maxlength="field.maxlength"
                :endDateFlag="field.endDateFlag"
                v-bind="field.props"
              />
            </div>
          </div>
          <!-- Advanced Search (left) | Query, Reset (right) -->
          <div class="row mt-1 align-items-center justify-content-between" v-if="!hideBtn">
            <div class="col-auto">
              <button
                v-if="showAdvancedButton"
                type="button"
                class="btn btn-link btn-sm p-0 text-secondary"
                @click="toggleAdvancedSearch"
              >
                {{ $t('ui.trans.advanced.select') }}
                <i id="btnShowDiv" :class="advancedSearchOpen ? 'fa fa-minus fa-fw' : 'fa fa-plus fa-fw'"></i>
              </button>
            </div>
            <div class="col-auto">
              <QueryButton id="btnQuery" label="btn.query" type="submit" variant="primary" @click="submitCriteria" />
              <QueryButton
                label="btn.reset"
                type="button"
                variant="primary"
                appearance="outlined"
                @click="resetCriteria"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-3" v-if="customButtons != null && customButtons.length > 0">
      <!-- Custom Buttons -->
      <span v-if="customButtons !== null">
        <QueryButton
          v-for="(button, index) in customButtons"
          :key="index"
          :label="button.label"
          :type="button.type"
          :variant="button.variant"
          @click="button.action"
        />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, reactive, ref, watch } from 'vue'
import QueryInputText from './QueryInputText.vue'
import QuerySelect from './QuerySelect.vue'
import QueryInputDate from './QueryInputDate.vue'
import QueryButton from './QueryButton.vue'
import { userStateStore } from '@/stores/user'
import { useAppStoreHook } from '@/stores/app'

// Define query field type
export interface CriteriaField {
  type: 'text' | 'select' | 'date'
  label: string
  model: string
  default?: any
  maxlength?: string
  readOnly?: boolean
  startDateFlag?: boolean
  endDateFlag?: boolean
  props?: Record<string, any>
  hidden?: boolean // New: Control if field is shown in UI
}

// Custom button type
export interface CustomButton {
  label: string
  type: 'button' | 'submit' | 'reset'
  variant: string
  action: (param: any) => void
}

const props = defineProps<{
  criteriaConfig: CriteriaField[]
  title: string
  customButtons?: CustomButton[] | null
  hideBtn?: boolean // Hide query reset button
}>()

const emit = defineEmits(['search', 'update:criteria'])
const userState = userStateStore()
const appStoreHook = useAppStoreHook()

// Initialize query criteria object
const criteria = reactive<Record<string, any>>({ issuerOid: userState.user.issuerOid })
for (const field of props.criteriaConfig) {
  criteria[field.model] = field.default || ''
}

// Watch config changes, fill missing field values
watch(
  () => props.criteriaConfig,
  (newData) => {
    for (const field of newData) {
      if (!criteria[field.model]) {
        criteria[field.model] = field.default || ''
      }
    }
  },
  { deep: true }
)

const advancedSearchOpen = ref(false)
const num = ref(8)

// Filter hidden fields, show first row
const visibleCriteria = computed(() => {
  return props.criteriaConfig.filter((f) => !f.hidden).slice(0, num.value)
})

// Filter hidden fields, remaining advanced query
const hiddenCriteria = computed(() => {
  return props.criteriaConfig.filter((f) => !f.hidden).slice(num.value)
})

// Show advanced query button?
const showAdvancedButton = computed(() => {
  return props.criteriaConfig.filter((f) => !f.hidden).length > num.value
})

// Toggle advanced query display status
const toggleAdvancedSearch = () => {
  advancedSearchOpen.value = !advancedSearchOpen.value
}

// Return corresponding component based on field type
const getComponentType = (type: string) => {
  switch (type) {
    case 'text':
      return QueryInputText
    case 'select':
      return QuerySelect
    case 'date':
      return QueryInputDate
    default:
      return QueryInputText
  }
}
// Add deep watcher
watch(
  () => criteria,
  (newValue) => {
    emit('update:criteria', newValue) // Trigger event to pass latest value
  },
  { deep: true, immediate: true } // Deep watch + trigger initial value immediately
)
// Trigger search
const submitCriteria = () => {
  emit('search', { ...criteria })
}

// Reset query criteria
const resetCriteria = () => {
  for (const field of props.criteriaConfig) {
    if (field.model == 'issuerOid' && appStoreHook.organ == 'issuer') {
      criteria[field.model] = userState.user.issuerOid
    } else {
      criteria[field.model] = field.default || ''
    }
  }
}
</script>

<style scoped>
.query-criteria {
  margin-bottom: 15px;
}

h4 {
  color: var(--cui-body-color);
  border-bottom: 2px solid var(--cui-border-color);
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}
</style>
