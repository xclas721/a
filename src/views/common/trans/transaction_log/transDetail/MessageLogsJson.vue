<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div style="max-width: 60%; margin: 5rem auto">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title + ' ' + $t('ui.trans.log-detail.message') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-coreui-dismiss="modal"
            aria-label="Close"
            @click="closeDialog"
          ></button>
        </div>
        <div class="modal-body">
          <div class="border border-light-subtle px-3" style="height: 400px; word-wrap: break-word; overflow-y: auto">
            <pre v-if="isFormatted">{{ formattedData }}</pre>
            <pre v-else>{{ detailData }}</pre>
          </div>
          <div class="float-end">
            <UtilityButton
              label="btn.close"
              variant="secondary"
              appearance="contained"
              class="mt-3"
              @click="closeDialog"
            />
            <UtilityButton
              label="ui.trans.log.message.format-json"
              variant="primary"
              appearance="contained"
              class="mt-3 ms-2"
              @click="format"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import UtilityButton from '@/components/UtilityButton.vue'
const props = defineProps<{
  detailData: string
  modelValue: boolean
  title: string
}>()
const { t } = useI18n()
const emit = defineEmits(['update:modelValue'])
const showFlag = ref(props.modelValue)
const isFormatted = ref(false)
const formattedData = ref('')
// Watch modelValue to control showFlag
watch(
  () => props.modelValue,
  (newVal) => {
    showFlag.value = newVal
  }
)
const dispalyCss = computed(() => {
  return showFlag.value ? `display:block;background:rgba(0,0,0,0.7);` : `display:none;background:rgba(0,0,0,0.7);`
})

// Close popup
const closeDialog = () => {
  showFlag.value = false
  emit('update:modelValue', false)
}
/**
 * Format json detailData
 */
const format = () => {
  if (typeof props.detailData === 'string') {
    try {
      const parsedData = JSON.parse(props.detailData)
      formattedData.value = JSON.stringify(parsedData, null, 2)
      isFormatted.value = true
    } catch (e) {
      console.error('无法解析JSON:', e)
      formattedData.value = props.detailData // Show original data
      swalMessage.warning(t('ui.trans.message.json.error'))
    }
  } else {
    console.error('detailData 不是字符串类型')
  }
}
</script>

<style>
pre {
  white-space: pre-wrap; /* Allow line wrap */
  word-break: break-all; /* Force line break */
  padding: 10px;
  border-radius: 5px;
}
</style>
