<template>
  <div class="d-flex justify-content-center align-items-center" style="height: 100vh">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ $t('ui.system.loading') }}</span>
      </div>
      <p class="mt-3">{{ $t('ui.system.redirecting') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  // Notify parent page to jump to specified page
  const query = route.query

  // Check target path based on destination parameter
  // Example "url": "http://localhost:8080/#/grafana-redirect?destination=transaction_log&acsTransID=${__value}"
  let targetPath = '/' // Default path
  if (query.destination) {
    switch (query.destination) {
      case 'transaction_log': {
        // Jump to abnormal transaction query for specific status code
        const stateMachineReason = query.stateMachineReason as string
        const abnormalReasonCodes = ['2001', '2003']
        if (stateMachineReason && abnormalReasonCodes.includes(stateMachineReason)) {
          targetPath = '/trans/abnormal_trans_log'
        } else {
          targetPath = '/trans/transaction_log'
        }
        break
      }
      // More destinations can be added here
      // case 'other_page':
      //   targetPath = '/other/page'
      //   break
      default:
        targetPath = '/' // Default path
    }
  }

  // Dynamically build query parameters, excluding destination parameter
  const targetParams = new URLSearchParams()
  for (const key of Object.keys(query)) {
    if (key !== 'destination' && query[key]) {
      targetParams.append(key, query[key] as string)
    }
  }

  // Build final target URL
  let targetUrl = targetPath
  if (targetParams.toString()) {
    targetUrl = `${targetPath}?${targetParams.toString()}`
  }

  // Check if in new window - Redirect directly regardless of parent window status
  if (window.opener) {
    // New window: redirect directly to specified page
    const baseUrl = globalThis.location.origin
    const fullUrl = `${baseUrl}/#${targetUrl}`
    globalThis.location.href = fullUrl
  } else if (window.parent && window.parent !== window) {
    // If parent page exists: notify parent page to redirect to specified page
    window.parent.postMessage(
      {
        type: 'GRAFANA_REDIRECT',
        payload: {
          path: targetUrl
        }
      },
      '*'
    )
    // The following console.log is for development convenience
    // console.log('Sent jump message to parent page:', targetUrl)
    // console.log('Passed parameters:', Object.fromEntries(targetParams))
  } else {
    // Direct redirect (backup plan) - Build complete URL
    const baseUrl = globalThis.location.origin
    const fullUrl = `${baseUrl}/#${targetUrl}`
    globalThis.location.href = fullUrl
  }
})
</script>

<style scoped>
/* Some styles can be added */
</style>
