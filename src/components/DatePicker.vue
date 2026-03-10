<script setup lang="ts">
import { useAppStoreHook } from '@/stores/app'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { computed } from 'vue'
import { endOfMonth, startOfMonth, subMonths, startOfDay, startOfISOWeek } from 'date-fns'
import { zhCN, zhTW, enUS } from 'date-fns/locale'
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'

defineOptions({ inheritAttrs: false })

const storeHook = useAppStoreHook()
const { t } = useI18n()

interface Props {
  // v-model value from parent (e.g. QueryInputDate)
  modelValue?: string
  width?: number // Date picker width
  mode?: 'time' | 'date' | 'week' | 'month' | 'year' // Picker mode: time, date, week, month, year
  showTime?: boolean // Whether to show time selection
  showToday?: boolean // Whether to show "Today" button
  endDateFlag?: boolean // Whether this is the end-date field
  modelType?: 'timestamp' | 'format' // v-model value type: timestamp or format string (not applied when mode is week or year)
  format?: string // Date format string (v12: maps to formats.input/preview)
}

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const props = withDefaults(defineProps<Props>(), {
  mode: 'date',
  showTime: false,
  showToday: false,
  endDateFlag: false,
  modelType: 'format',
  format: 'yyyy-MM-dd HH:mm:ss'
})

// v12: locale must be date-fns Locale object
const locale = computed(() => {
  const lang = storeHook.locale
  if (lang === 'zh_CN') return zhCN
  if (lang === 'zh_TW') return zhTW
  return enUS
})

const time = computed(() => props.mode === 'time')
const week = computed(() => props.mode === 'week')
const month = computed(() => props.mode === 'month')
const year = computed(() => props.mode === 'year')

const startDates = computed(() => [
  { label: t('preset.todayStart'), value: () => startOfDay(new Date()) },
  { label: t('preset.thisWeekStart'), value: () => startOfISOWeek(new Date()) },
  { label: t('preset.thisMonthStart'), value: () => startOfMonth(new Date()) },
  { label: t('preset.lastMonthStart'), value: () => startOfMonth(subMonths(new Date(), 1)) }
])
const monthEndDate = DateTime.now().endOf('month').toFormat('yyyy-MM-dd HH:mm:ss')
const endDates = computed(() => [
  { label: t('preset.todayEnd'), value: () => DateTime.now().endOf('day').toFormat('yyyy-MM-dd HH:mm:ss') },
  { label: t('preset.thisWeekEnd'), value: () => DateTime.now().endOf('week').toFormat('yyyy-MM-dd HH:mm:ss') },
  { label: t('preset.thisMonthEnd'), value: () => monthEndDate },
  { label: t('preset.lastMonthEnd'), value: () => endOfMonth(subMonths(new Date(), 1)) }
])
</script>

<template>
  <VueDatePicker
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :preset-dates="endDateFlag ? endDates : startDates"
    :locale="locale"
    :formats="{ input: format, preview: format }"
    :config="{ monthChangeOnScroll: false }"
    :enable-time-picker="true"
    :time-picker="time"
    :week-picker="week"
    :month-picker="month"
    :year-picker="year"
    :show-now-button="true"
    :auto-apply="true"
    :dark="storeHook.theme == 'dark'"
    :model-type="modelType"
    text-input
    time-picker-inline
    :max-date="monthEndDate"
    enable-seconds
    :day-names="[
      t('preset.weekDays.Mon'),
      t('preset.weekDays.Tue'),
      t('preset.weekDays.Wed'),
      t('preset.weekDays.Thu'),
      t('preset.weekDays.Fri'),
      t('preset.weekDays.Sat'),
      t('preset.weekDays.Sun')
    ]"
  >
    <template #preset-date-range-button="{ label, value, presetDate }">
      <span
        role="button"
        :tabindex="0"
        @click="presetDate(value)"
        @keyup.enter.prevent="presetDate(value)"
        @keyup.space.prevent="presetDate(value)"
      >
        {{ label }}
      </span>
    </template>
  </VueDatePicker>
</template>

<style>
.dp__theme_dark {
  --dp-background-color: #21191b;
  --dp-text-color: #e0e0e0;
  --dp-hover-color: #2d2527;
  --dp-hover-text-color: #e0e0e0;
  --dp-hover-icon-color: #b3b3b3;
  --dp-primary-color: #a62d4a;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #b8a4ab;
  --dp-border-color: rgba(255, 255, 255, 0.12);
  --dp-menu-border-color: rgba(255, 255, 255, 0.12);
  --dp-border-color-hover: rgba(255, 255, 255, 0.2);
  --dp-disabled-color: #737373;
  --dp-scroll-bar-background: #21191b;
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #b3b3b3;
  --dp-danger-color: #e53935;
  --dp-highlight-color: rgba(166, 45, 74, 0.2);
}

.dp__theme_light {
  --dp-background-color: #ffffff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #1976d2;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #ddd;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
}
</style>
