<template>
  <div class="grafana-viewer-container">
    <iframe
      v-if="grafanaUrl"
      :src="grafanaUrl"
      width="100%"
      height="100%"
      style="border: none"
      ref="grafanaIframe"
      title="Grafana Dashboard"
    />
    <div v-else class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ $t('ui.system.loading') }}</span>
      </div>
      <p class="mt-3">{{ $t('ui.system.loading') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const grafanaUrl = ref('')
const grafanaIframe = ref<HTMLIFrameElement>()

// Handle messages from Grafana (iframe or new window)
const handleGrafanaMessage = (event: MessageEvent) => {
  // Handle jump message
  if (event.data.type === 'GRAFANA_REDIRECT') {
    const { path } = event.data.payload
    // Check if in new window
    if (window.opener) {
      // New window: redirect directly to specified page
      const baseUrl = globalThis.location.origin
      const fullUrl = `${baseUrl}/#${path}`
      globalThis.location.href = fullUrl
    } else if (window.parent && window.parent !== window) {
      // If parent page exists: notify parent page to redirect to specified page
      window.parent.postMessage(
        {
          type: 'GRAFANA_REDIRECT',
          payload: {
            path: path
          }
        },
        '*'
      )
    } else {
      // Direct redirect (backup plan)
      router.push(path)
    }
  }
}

// Remove listener when page unmounted
onUnmounted(() => {
  // Remove postMessage listener
  window.removeEventListener('message', handleGrafanaMessage)
})

// Initialize
onMounted(() => {
  // Add postMessage listener
  window.addEventListener('message', handleGrafanaMessage)

  try {
    // Read Grafana URL from sessionStorage
    const storedUrl = sessionStorage.getItem('grafanaViewerUrl')

    if (storedUrl) {
      grafanaUrl.value = storedUrl
    }
  } catch (err) {
    console.error('載入 Grafana URL 失敗:', err)
  }
})
</script>

<style scoped>
.grafana-viewer-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  flex-direction: column;
}

.loading-container p {
  color: #6c757d;
  margin: 0;
}
</style>
