import { onBeforeMount, ref, watch } from 'vue'
import { useAppStoreHook } from '@/stores/app'

const getStoredTheme = (localStorageItemName: string) => globalThis.window?.localStorage?.getItem(localStorageItemName)

const setStoredTheme = (localStorageItemName: string, colorMode: string) =>
  localStorage.setItem(localStorageItemName, colorMode)

const getPreferredColorScheme = (localStorageItemName: string) => {
  if (globalThis.window === undefined) {
    return
  }

  const storedTheme = getStoredTheme(localStorageItemName)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  // No stored theme or legacy 'auto': use system preference and resolve to light/dark
  return globalThis.window?.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

const setTheme = (colorMode: string) => {
  document.documentElement.dataset.coreuiTheme =
    colorMode === 'auto' && globalThis.window?.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : colorMode

  const event = new Event('ColorSchemeChange')
  document.documentElement.dispatchEvent(event)
}

export const useColorModes = (localStorageItemName = 'admin-theme') => {
  const colorMode = ref(getPreferredColorScheme(localStorageItemName))

  watch(colorMode, () => {
    if (colorMode.value) {
      setStoredTheme(localStorageItemName, colorMode.value)
      setTheme(colorMode.value)
    }
  })

  onBeforeMount(() => {
    if (typeof getStoredTheme(localStorageItemName) === 'string' && colorMode.value) {
      setTheme(colorMode.value)
    }

    globalThis.window?.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', () => {
      const storedTheme = getStoredTheme(localStorageItemName)
      if (storedTheme !== 'light' && storedTheme !== 'dark' && colorMode.value) {
        setTheme(colorMode.value)
      }
    })
  })
  const storeHook = useAppStoreHook()

  return {
    colorMode,
    isColorModeSet: () => Boolean(getStoredTheme(localStorageItemName)),
    setColorMode: (mode: string) => {
      colorMode.value = mode
      storeHook.toggleTheme(mode)
    }
  }
}
