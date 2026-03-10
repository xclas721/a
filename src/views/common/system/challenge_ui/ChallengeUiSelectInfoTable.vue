<template>
  <div>
    <table class="table-auto border-collapse border w-full w-100">
      <thead class="w-100">
        <tr>
          <th class="border p-2 text-center">{{ $t('ui.challengeUiSelectInfos.table.no') }}</th>
          <th class="border p-2">
            <span :title="$t('ui.challengeUiSelectInfos.table.itemName.tooltip')">
              {{ $t('ui.challengeUiSelectInfos.table.itemName') }}
            </span>
          </th>
          <th class="border p-2">{{ $t('ui.challengeUiSelectInfos.table.itemValue') }}</th>
          <th class="border p-2" v-if="!readonly">{{ $t('ui.operating') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in localData" :key="`${row.itemOrder}-${index}`">
          <td class="border p-2 text-center">{{ row.itemOrder }}</td>
          <td class="border p-2">
            <input v-model="row.itemName" class="border rounded px-2 py-1 w-full" v-if="!readonly" />
            <template v-if="readonly">{{ row.itemName }}</template>
          </td>
          <td class="border p-2">
            <input
              v-model="row.itemValue"
              @input="handleInputChange(index, $event)"
              class="border rounded px-2 py-1 w-full"
              v-if="!readonly"
            />
            <template v-if="readonly">{{ row.itemValue }}</template>
          </td>
          <td class="border p-2 text-center space-x-2" v-if="!readonly">
            <button
              @click="moveUp(index)"
              :disabled="index === 0"
              class="px-2 py-1 rounded bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <i class="ri-arrow-up-line"></i>
            </button>
            <button
              @click="moveDown(index)"
              :disabled="index === localData.length - 1"
              class="px-2 py-1 rounded bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <i class="ri-arrow-down-line"></i>
            </button>
            <button @click="removeRow(index)" class="px-2 py-1 rounded bg-red-500">
              <i class="ri-delete-bin-line"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button @click="addRow" class="px-4 rounded hover:bg-green-600" v-if="!readonly">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

interface ChallengeUiSelectInfo {
  itemName: string
  itemValue: string
  itemOrder: number
}

const props = defineProps<{
  modelValue: Record<string, any>[]
  readonly?: boolean
}>()

const emit = defineEmits<(e: 'update:modelValue', value: ChallengeUiSelectInfo[]) => void>()

const localData = ref<ChallengeUiSelectInfo[]>([])
const isUpdatingFromParent = ref(false)
const isUpdatingFromChild = ref(false)

// Data conversion function
const transformSelectInfoData = (data: Record<string, any>[]): ChallengeUiSelectInfo[] => {
  if (!Array.isArray(data)) {
    console.warn('selectInfoData 不是数组')
    return []
  }

  return data.map((item, index) => {
    return {
      itemName: item.itemName || '',
      itemValue: item.itemValue || '',
      itemOrder: item.itemOrder ?? index + 1
    }
  })
}

// Initialize data
const initializeData = () => {
  localData.value = transformSelectInfoData(props.modelValue ?? [])
}

// Update data only on initialization and when props truly change
watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    // Avoid loops caused by updates triggered by child components
    if (isUpdatingFromChild.value) {
      isUpdatingFromChild.value = false
      return
    }

    // Update only when data truly changes
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      isUpdatingFromParent.value = true
      localData.value = transformSelectInfoData(newVal ?? [])
      nextTick(() => {
        isUpdatingFromParent.value = false
      })
    }
  },
  { deep: true }
)

// Manually trigger update to parent component
const updateToParent = () => {
  if (!isUpdatingFromParent.value) {
    isUpdatingFromChild.value = true
    emit('update:modelValue', [...localData.value])
  }
}

// Handle input change
const handleInputChange = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  localData.value[index].itemValue = target.value
  updateToParent()
}

// Add a row
const addRow = () => {
  const newOrder = localData.value.length > 0 ? Math.max(...localData.value.map((item) => item.itemOrder)) + 1 : 1
  const newRow: ChallengeUiSelectInfo = {
    itemName: '',
    itemValue: '',
    itemOrder: newOrder
  }
  localData.value.push(newRow)
  updateToParent()
}

const removeRow = (index: number) => {
  localData.value.splice(index, 1)
  updateOrder()
  updateToParent()
}

const moveUp = (index: number) => {
  if (index > 0) {
    const temp = localData.value[index]
    localData.value[index] = localData.value[index - 1]
    localData.value[index - 1] = temp
    updateOrder()
    updateToParent()
  }
}

const moveDown = (index: number) => {
  if (index < localData.value.length - 1) {
    const temp = localData.value[index]
    localData.value[index] = localData.value[index + 1]
    localData.value[index + 1] = temp
    updateOrder()
    updateToParent()
  }
}

const updateOrder = () => {
  for (const [index, item] of localData.value.entries()) {
    item.itemOrder = index + 1
  }
}

// Initialize
onMounted(() => {
  initializeData()
})
</script>
