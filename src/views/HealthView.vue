<template>
  <div v-if="appStoreHook.organ == 'issuer' && userState.user.userType == '1'">
    <div>
      <!-- 與其他頁一致的標題（query 組件的標題樣式） -->
      <QueryCriteriaComponent :criteriaConfig="[]" :title="$t('ui.notification-center')" :hideBtn="true" />

      <!-- 未讀提示（由 MainNotificationCenter 透過 sendData 更新） -->
      <i v-if="!tabUnchecked" class="fa fa-exclamation-triangle health-badge" id="tab_unchecked" aria-hidden="true"></i>

      <!-- Content Display -->
      <div class="row health-content">
        <div class="col-lg-12">
          <component :is="currentComponent" @sendData="handleData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import MainNotificationCenter from '@/views/issuer/health/MainNotificationCenter.vue'
import { useAppStoreHook } from '@/stores/app'
import { userStateStore } from '@/stores/user'

const appStoreHook = useAppStoreHook()
const userState = userStateStore()
const tabUnchecked = ref(true)
/**
 * Update parent component data
 * @param data
 */
const handleData = (data: boolean) => {
  tabUnchecked.value = data
}
// Import child component
const componentMap = {
  'notification-center': MainNotificationCenter
  // 'system-health': SystemHealth,
  // 'realTime-trans-monitor': RealTimeTransMonitor,
} as const

const activeTab = ref<keyof typeof componentMap>('notification-center')

// TypeScript inference, avoid type issues
const currentComponent = computed(() => componentMap[activeTab.value])
</script>

<style scoped>
.health-badge {
  color: #c00000;
  margin-left: 0.25rem;
}

.health-content {
  padding: 0 30px;
}
</style>
