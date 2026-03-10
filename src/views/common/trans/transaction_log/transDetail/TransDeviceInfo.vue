<template>
  <div class="header-title">{{ $t('ui.trans.device.info') }}</div>
  <div class="content-box p-3">
    <div class="device-info-grid">
      <!-- Grid Item -->
      <template v-for="(value, key) in deviceInfo" :key="key">
        <div class="device-info-title">{{ $t(key) }}</div>
        <div class="device-info-value">{{ value || 'N/A' }}</div>
      </template>

      <!-- Device Status -->
      <h3 class="mt-3">{{ $t('ui.trans.device.info.all.data') }}</h3>
      <div class="device-status">
        <div v-if="isJson(data.deviceInfo)">
          <!-- Add scroll container -->
          <div class="pre-container">
            <pre>{{ formattedJson(data.deviceInfo) }}</pre>
          </div>
        </div>
        <div v-else>
          <p>{{ data.deviceInfo || 'callback timeout' }}</p>
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
const deviceInfo = ref<Record<string, any>>({})

// Watch props.data changes, dynamically update deviceInfo
watch(
  () => props.data,
  (newData) => {
    deviceInfo.value = {
      'ui.trans.log.devideInfoes.devicePlatform': newData.devicePlatform,
      'ui.trans.log.devideInfoes.deviceModel': newData.deviceModel,
      'ui.trans.log.devideInfoes.deviceOsName': newData.deviceOsName,
      'ui.trans.log.devideInfoes.deviceOsVersion': newData.deviceOsVer,
      'ui.trans.log.devideInfoes.deviceLocale': newData.deviceLocale,
      'ui.trans.log.devideInfoes.deviceTimeZone': newData.deviceTimeZone,
      'ui.trans.log.devideInfoes.deviceAdvertisingId': newData.deviceAdvertisingId,
      'ui.trans.log.devideInfoes.fingerprintMethod': newData.fingerprintMethod,
      'ui.trans.log.devideInfoes.deviceIp': newData.deviceIpAddress,
      'ui.trans.log.devideInfoes.deviceName': newData.deviceName,
      'ui.trans.log.devideInfoes.deviceLatitude': newData.deviceLatitude,
      'ui.trans.log.devideInfoes.deviceLongitude': newData.deviceLongitude
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

.device-status p {
  color: red;
}

/* Beautified JSON display */
/* New styles */
.device-status {
  max-width: 100%; /* Limit max width */
}

.pre-container {
  max-height: 300px; /* Set max height */
  overflow-y: auto; /* Auto show scrollbar */
  border-radius: 4px;
  margin: 10px 0;
}

pre {
  padding: 10px;
  font-size: 14px;
  white-space: pre; /* Disable auto line wrap */
  word-wrap: normal; /* Keep original format */
  min-width: fit-content; /* Ensure content min width */
  margin: 0; /* Clear default margin */
}

.pre-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
</style>
