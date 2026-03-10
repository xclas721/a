<template>
  <MenuBarComponent />
  <div class="wrapper d-flex flex-column min-vh-100">
    <HeaderComponent />
    <div
      v-if="!sidebarStore.isCollapsed"
      class="sidebar-backdrop fade show"
      @click="sidebarStore.toggleSidebar()"
    ></div>
    <div class="body flex-grow-1">
      <div class="px-4">
        <router-view />
        <GlobalLoading />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const sidebarStore = useAppStore()
import GlobalLoading from '@/components/GlobalLoading.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import MenuBarComponent from '@/components/MenuBarComponent.vue'
</script>
