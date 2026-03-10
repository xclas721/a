<script setup lang="ts">
import { RouterView } from 'vue-router'
import { watch } from 'vue'
import { userStateStore } from '@/stores/user'
import { useColorModes } from '@/stores/useColorModes'
import { useAppStore } from '@/stores/app'
import { onBeforeMount } from 'vue'

// init locale
const userStore = userStateStore()
userStore.initLocale()

const { isColorModeSet, setColorMode } = useColorModes('admin-theme')
const currentTheme = useAppStore()

// 簡體中文時整個系統使用 Noto Sans SC（解決粗體顯示），同步到 html 供全域樣式使用
watch(
  () => currentTheme.locale,
  (locale) => {
    document.documentElement.setAttribute('data-locale', locale ?? '')
  },
  { immediate: true }
)

onBeforeMount(() => {
  const urlParams = new URLSearchParams(globalThis.location.href.split('?')[1])
  let theme = urlParams.get('theme')

  if (theme !== '' && theme !== null) {
    const matchedTheme = theme.match(/^[A-Za-z0-9\s]+/)

    // 检查 matchedTheme 是否为 null
    if (matchedTheme !== null && matchedTheme.length > 0) {
      theme = matchedTheme[0]
    }
  }

  if (theme) {
    setColorMode(theme)
    return
  }

  if (isColorModeSet()) {
    return
  }

  setColorMode(currentTheme.theme ?? 'light')
})
</script>

<template>
  <RouterView />
</template>
