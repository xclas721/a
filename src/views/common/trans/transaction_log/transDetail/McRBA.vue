<template>
  <div class="header-title">{{ $t('ui.trans.log.mc-rba') }}</div>
  <div class="content-box p-3">
    <div class="device-info-grid">
      <!-- Grid Item -->
      <template v-for="(value, key) in mcRbaInfo" :key="key">
        <div class="device-info-title">{{ $t(key) }}</div>
        <div class="device-info-value">{{ value }}</div>
      </template>

      <!-- Device Status -->
      <div class="device-status mt-2">
        <div v-if="isJson(data.riskReport)">
          <pre>{{ formattedJson(data.riskReport) }}</pre>
        </div>
        <div v-else>
          <p>{{ data.riskReport }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  data: Record<string, any>
}>()

// Device info data
const mcRbaInfo = ref<Record<string, any>>({})

// Watch props.data changes, dynamically update deviceInfo
watch(
  () => props.data,
  (newData) => {
    mcRbaInfo.value = {
      'ui.trans.log.mc-rba.id': newData.mcRbaId,
      'ui.trans.log.mc-rba.status': newData.status,
      'ui.trans.log.mc-rba.score': newData.score,
      'ui.trans.log.mc-rba.decision': newData.decision,
      'ui.trans.log.mc-rba.reasonCode1': newData.reasonCode1,
      'ui.trans.log.mc-rba.reasonCode2': newData.reasonCode2
    }
  },
  { immediate: true } // Execute immediately once
)

// Check if data is in JSON format
const isJson = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

// Format JSON data with indentation
const formattedJson = (jsonStr: string) => {
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2)
  } catch {
    return jsonStr
  }
}
</script>

<style scoped>
.device-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns per row */
  gap: 0; /* Remove gap between grid cells */
  width: 100%;
  border-collapse: collapse; /* Remove access gap of table borders */
}

.device-info-title,
.device-info-value {
  padding: 8px;
  border: 1px solid #ccc;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.device-info-title {
  background-color: var(--cui-primary);
  font-weight: bold; /* Title bold */
}

.device-status {
  grid-column: span 4; /* Span 4 columns */
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.device-status h3 {
  margin-top: 0;
}

/* Beautified JSON display */
pre {
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
