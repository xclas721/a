import { ref } from 'vue'
import { defineStore } from 'pinia'

export const appCounterStore = defineStore('counter', () => {
  const reconfirmCount = ref(0)

  return { reconfirmCount }
})
