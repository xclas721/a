import { defineStore } from 'pinia'

/**
 * Grafana Time Range Status
 */
export interface GrafanaTimeRange {
  from: string
  to: string
}

/**
 * Grafana Store
 * Manage Grafana iframe time range status
 */
export const useGrafanaStore = defineStore('grafana', {
  state: (): {
    timeRange: GrafanaTimeRange | null
  } => ({
    timeRange: null
  }),

  // Persist to sessionStorage
  persist: {
    storage: sessionStorage
  },

  getters: {
    /**
     * Get time range (for API request)
     */
    getTimeRangeParams(): { from?: string; to?: string } {
      if (this.timeRange) {
        return {
          from: this.timeRange.from,
          to: this.timeRange.to
        }
      }
      return {}
    },

    /**
     * Has valid time range?
     */
    hasTimeRange(): boolean {
      return !!(this.timeRange?.from && this.timeRange?.to)
    }
  },

  actions: {
    /**
     * Set time range
     */
    setTimeRange(timeRange: GrafanaTimeRange): void {
      this.timeRange = timeRange
    },

    /**
     * Clear time range
     */
    clearTimeRange(): void {
      this.timeRange = null
    }
  }
})
