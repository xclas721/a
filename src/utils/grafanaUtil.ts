/**
 * Grafana related utility functions
 * Unified handling of Grafana iframe communication
 */

import { useGrafanaStore } from '@/stores/grafana'
import type { GrafanaTimeRange } from '@/stores/grafana'

/**
 * Grafana message type
 */
export enum GrafanaMessageType {
  TIME_RANGE_CHANGE = 'GRAFANA_TIME_RANGE_CHANGE',
  REDIRECT = 'GRAFANA_REDIRECT'
}

/**
 * Grafana message Payload
 */
export type GrafanaTimeRangeChangePayload = GrafanaTimeRange

export interface GrafanaRedirectPayload {
  path: string
}

/**
 * Extract time range parameters from URL
 */
export function extractTimeRangeFromUrl(url: string | URL): GrafanaTimeRange | null {
  try {
    const urlObj = typeof url === 'string' ? new URL(url) : url
    const from = urlObj.searchParams.get('from')
    const to = urlObj.searchParams.get('to')

    if (from && to) {
      return { from, to }
    }
  } catch (error) {
    console.error('提取時間範圍失敗:', error)
  }

  return null
}

/**
 * Create Grafana message handler
 * @param options handling options
 * @returns cleanup function
 */
export function createGrafanaMessageHandler(options: {
  grafanaStore?: ReturnType<typeof useGrafanaStore>
  router?: any // Vue Router
}) {
  const { grafanaStore, router } = options

  const handler = (event: MessageEvent) => {
    // Validate message format
    if (!event.data || typeof event.data.type !== 'string') {
      return
    }

    // Handle time range change
    if (event.data.type === GrafanaMessageType.TIME_RANGE_CHANGE) {
      const payload = event.data.payload as GrafanaTimeRangeChangePayload
      const { from, to } = payload

      if (from && to) {
        const timeRange: GrafanaTimeRange = { from, to }

        // Save to Pinia store (automatically persisted to sessionStorage)
        if (grafanaStore) {
          grafanaStore.setTimeRange(timeRange)
        }
      }
    }

    // Handle jump message
    if (event.data.type === GrafanaMessageType.REDIRECT) {
      const payload = event.data.payload as GrafanaRedirectPayload
      const { path } = payload

      // Execute jump
      if (router && path) {
        router.push(path)
      }
    }
  }

  // Add listener
  window.addEventListener('message', handler)

  // Return cleanup function
  return () => {
    window.removeEventListener('message', handler)
  }
}
