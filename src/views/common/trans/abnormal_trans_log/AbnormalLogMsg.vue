<template>
  <div class="content-box p-3">
    <div style="max-width: 99%">
      <div class="modal-content">
        <div class="modal-body">
          <div class="border border-light-subtle px-3" style="height: 400px; word-wrap: break-word; overflow-y: auto">
            <pre v-if="isFormatted">{{ formattedData }}</pre>
            <pre v-else>{{ data }}</pre>
          </div>
          <div class="float-end">
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
import { ref } from 'vue'
import UtilityButton from '@/components/UtilityButton.vue'
const props = defineProps<{
  data: string
}>()
const isFormatted = ref(false)
const formattedData = ref('')
/**
 * Format json detailData
 */
const format = () => {
  if (typeof props.data === 'string') {
    try {
      const parsedData = JSON.parse(props.data)
      formattedData.value = JSON.stringify(parsedData, null, 2)
    } catch (e) {
      console.error('无法解析JSON:', e)
      formattedData.value = props.data // Show original data
    }
    isFormatted.value = true
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
