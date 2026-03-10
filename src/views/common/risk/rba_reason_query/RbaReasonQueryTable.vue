<template>
  <div>
    <!-- Display loading indicator -->
    <div v-if="loading">Loading...</div>

    <!-- Data Table -->
    <table v-if="!loading" class="optimized-table">
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index" :colspan="column.colspan ?? '1'">
            {{ column.headerNoI18n ? column.header : $t(column.header) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex" style="height: 63px">
          <template v-if="rowIndex == 0">
            <td>
              <template v-for="(column, colIndex) in columns" :key="colIndex">
                <span v-if="column.colOptions">
                  {{ dataTrans(row[column.field], column.colOptions) }}
                </span>
              </template>
            </td>
          </template>
          <template v-else><td></td></template>
          <td>{{ row.parentIndexNo }}</td>
          <td>{{ row.memo }}</td>
          <td>{{ row.score }}</td>
          <td>{{ row.indexNoCount }}</td>
          <td>{{ row.indexNoCountPercentage }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { userStateStore } from '@/stores/user'
import { appConfig } from '@/config'

const { t } = useI18n()
// Define props
const props = defineProps<{
  title: string
  columns: {
    // table column title
    header: string
    // Table header not internationalized
    headerNoI18n: boolean
    // Corresponding field
    field: string
    // Columns to join
    joinCol?: string
    // Join character
    joinStr?: string
    // Suffix join character
    joinStrEnd?: string
    // For time formatting
    dateFormat?: string
    colspan?: string
    // Dropdown menu for field
    colOptions?: Record<string, any>
    // Function triggered on click, used by password
    action?: (param: Record<string, any>) => void
  }[]
  fetchData: (page: number) => Promise<{ data: Record<string, any>[]; totalItems: number }>
  itemsPerPage?: number
  // Whether to show add, detail, edit buttons
  operationBtnDetail?: boolean
  operationBtnUpdate?: boolean
  operationBtnDelete?: boolean
  // Custom buttons
  customButtons?: TableCustomButton[]
  // Condition to hide button
  btnShow?: (param: Record<string, any>) => void
  // Disable button
  btnDisable?: (param: Record<string, any>) => boolean
  // Hide pagination
  pageHide?: boolean
}>()

export interface TableCustomButton {
  label: string
  type: 'button' | 'submit' | 'reset'
  variant: string
  action: (param: any) => void
  // Condition to hide button
  btnShow?: (param: Record<string, any>) => void
  // Disable button
  btnDisable?: (param: Record<string, any>) => boolean
}

// Pagination state
const currentPage = ref(1)
const totalItems = ref(0)
const totalPages = ref(1)
const itemsPerPage = props.itemsPerPage || Number(appConfig.PAGE_SIZE)

// Data state
const data = ref<Record<string, any>[]>([])
const loading = ref(false)

// Fetch data whenever currentPage changes
const fetchPageData = async () => {
  loading.value = true
  const response = await props.fetchData(currentPage.value)
  data.value = response.data
  totalItems.value = response.totalItems
  totalPages.value = Math.ceil(totalItems.value / itemsPerPage)
  loading.value = false
}
const stateStore = userStateStore()
// Watch the currentPage ref and fetch new data
watchEffect(() => {
  // Trigger only when logged in
  if (stateStore.user.login) {
    fetchPageData()
  }
})

function dataTrans(value: any, dictList: Record<string, Record<string, string>>) {
  if (value === null || value === undefined) {
    return t('ui.rba.default')
  }
  let reDesc = ''
  for (const key in dictList) {
    if (dictList[key].value == value) {
      if (dictList[key].text) {
        reDesc = dictList[key].text
      } else {
        reDesc = t(dictList[key].i18nText)
      }
    }
  }
  return reDesc
}

// Emit the search event
defineEmits(['openDetail', 'deleteRow', 'openUpdate'])
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px 16px;
  border: 1px solid #ddd;
  text-align: left;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Right-align the pagination controls */
  gap: 10px;
}

.pagination-info {
  line-height: 50px;
}

.pagination-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.pagination-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  color: #007bff; /* Highlight color on hover */
}

.pagination-input {
  width: 50px;
  line-height: 30px;
  text-align: center;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
}

.pagination-input:focus {
  border-bottom: 1px solid #007bff;
}

.optimized-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.optimized-table th,
.optimized-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.optimized-table th {
  font-weight: bold;
}

.optimized-table tbody tr:hover {
  background-color: var(--cui-light-bg-subtle);
}

.link {
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.checkbox {
  margin: 0;
  vertical-align: middle;
}
</style>
