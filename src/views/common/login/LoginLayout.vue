<template>
  <div class="login-page-bg">
    <div class="login-layout-box">
      <div class="login-carousel-panel">
        <slot name="carousel" />
      </div>
      <div class="login-form-panel" :class="{ 'locale-zh-cn': isZhCN }">
        <slot name="form" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'LoginLayout'
})

const props = defineProps<{
  loginLocale?: string
}>()

const isZhCN = computed(() => {
  const loc = props.loginLocale ?? ''
  return loc === 'zh_CN' || loc === 'zh-CN'
})
</script>

<style scoped lang="scss">
.login-page-bg {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  background: #f8f8f8;
  background-image: url('@/assets/img/login/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Figma layout: total 1070, left 593, right 477, height 629 */
.login-layout-box {
  width: min(1070px, calc(100vw - 4rem));
  height: min(629px, calc(100vh - 4rem));
  display: flex;
  flex-direction: row;
  overflow: visible;
  border-radius: 50px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.login-carousel-panel {
  flex: 620 1 0;
  min-width: 0;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  border-radius: 50px 0 0 50px;
}

.login-form-panel {
  flex: 450 1 0;
  min-width: 0;
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1rem, 2.2vw, 2rem) clamp(1.25rem, 2.4vw, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: visible; /* Keep language dropdown from being clipped */
  border-radius: 0 50px 50px 0;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

@media (max-width: 992px) {
  .login-layout-box {
    height: auto;
    min-height: 500px;
    border-radius: 24px;
  }

  .login-carousel-panel {
    flex: 0 0 42%;
    min-height: 380px;
    border-radius: 24px 0 0 24px;
  }

  .login-form-panel {
    border-radius: 0 24px 24px 0;
  }
}

@media (max-width: 767px) {
  .login-page-bg {
    padding: 1rem;
  }

  .login-layout-box {
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: auto;
    max-height: none;
    border-radius: 16px;
  }

  .login-carousel-panel {
    flex: none;
    min-height: 200px;
    border-radius: 16px 16px 0 0;
  }

  .login-form-panel {
    padding: 1.5rem 1.25rem;
    border-radius: 0 0 16px 16px;
  }
}
</style>
