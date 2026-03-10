<template>
  <transition name="fade">
    <div v-if="loading" class="global-loading">
      <div class="loading-content">
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
        <div class="loading-text">{{ message }}</div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'
import { storeToRefs } from 'pinia'

const loadingStore = useLoadingStore()
const { loading, message } = storeToRefs(loadingStore)
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.loading-content {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 30px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.spinner {
  margin: 0 auto 20px;
  width: 120px;
  text-align: center;
}

.spinner > div {
  width: 24px;
  height: 24px;
  background-color: #3498db;
  border-radius: 100%;
  display: inline-block;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  animation-delay: -0.16s;
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.loading-text {
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
