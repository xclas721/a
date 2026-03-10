<template>
  <div>
    <!-- Display loading indicator -->
    <div v-if="loading">Loading...</div>

    <!-- Data Table -->
    <table v-if="!loading" class="optimized-table">
      <thead>
        <tr v-if="columns0" class="header-row">
          <th
            v-for="(column, index) in columns0"
            :key="index"
            :colspan="column.colspan ?? '1'"
            :style="{ width: column.width || 'auto' }"
            scope="col"
          >
            {{ $t(column.header) }}
          </th>
        </tr>
        <tr class="subheader-row">
          <th
            v-for="(column, index) in columns"
            :key="index"
            :colspan="column.colspan ?? '1'"
            :style="{ width: column.width || 'auto' }"
            scope="col"
          >
            {{ column.headerNoI18n ? column.header : $t(column.header) }}
          </th>
          <th v-if="hasOperations()" class="operation-cell" scope="col">
            {{ $t('ui.operation') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex" :class="{ 'alternate-row': rowIndex % 2 === 0 }">
          <td v-for="(column, colIndex) in columns" :key="colIndex" style="height: 71px">
            <span v-if="column.joinCol">
              {{ getNestedValueExt(row, column.field, column.joinCol, column.joinStr ?? '', column.joinStrEnd ?? '') }}
            </span>
            <span v-else>
              <span v-if="column.colOptions">
                {{ dataTrans(getNestedValue(row, column.field, column.dateFormat ?? ''), column.colOptions) }}
              </span>
              <span v-else-if="column.action">
                <a href="#" @click.prevent="column.action(row)" class="link">
                  {{ getNestedValue(row, column.field, column.dateFormat ?? '') }}
                </a>
              </span>
              <span v-else>
                {{ valOrNA(getNestedValue(row, column.field, column.dateFormat ?? '')) }}
              </span>
            </span>
          </td>
          <td
            v-if="operationBtnDetail || operationBtnUpdate || operationBtnDelete || customButtons"
            class="operation-cell"
          >
            <DataTableButton
              v-if="operationBtnDetail && hideBtn(row)"
              label="btn.detail"
              type="submit"
              variant="primary"
              appearance="contained"
              @click="openDetail(row)"
              :is-label-i18n="true"
              :is-disabled="disableBtn(row)"
            />
            <DataTableButton
              v-if="operationBtnUpdate && hideBtn(row)"
              label="btn.update"
              type="submit"
              variant="primary"
              appearance="contained"
              @click="openUpdate(row)"
              :is-label-i18n="true"
              :is-disabled="disableBtn(row) || row.isConfirming"
            />
            <DataTableButton
              v-if="operationBtnDelete && hideBtn(row)"
              label="btn.delete"
              type="submit"
              variant="danger"
              appearance="outlined"
              @click="deleteRow(row)"
              :is-label-i18n="true"
              :is-disabled="disableBtn(row) || row.isConfirming"
            />
            <span v-if="customButtons">
              <DataTableButton
                v-for="(button, index) in customButtons.filter((button) =>
                  button.btnShow ? button.btnShow?.(row) : true
                )"
                :key="index"
                :label="button.label"
                :type="button.type"
                :variant="button.variant"
                :is-label-i18n="true"
                @click="button.action(row)"
                :is-disabled="button.btnDisable?.(row) || row.isConfirming"
              />
            </span>
            <i v-if="row.isConfirming" class="ri-error-warning-line" :title="$t('ui.reconfirm.status.0')"></i>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination controls -->
    <div class="pagination-controls" v-if="!pageHide">
      <span class="pagination-info">{{ $t('ui.table.page.total') }} : {{ totalItems }}</span>
      <button class="pagination-btn" @click="firstPage" :disabled="currentPage === 1">&laquo;</button>
      <button class="pagination-btn" @click="prevPage" :disabled="currentPage === 1">&lt;</button>
      <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="pagination-btn" @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
      <button class="pagination-btn" @click="endPage" :disabled="currentPage === totalPages">&raquo;</button>
      <span class="pagination-info">{{ $t('ui.table.page.go') }}</span>
      <input
        v-model.number="currentPage"
        min="1"
        :max="totalPages"
        class="pagination-input"
        oninput="value = value.replace(/\D/g, '')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { userStateStore } from '@/stores/user'
import DataTableButton from '@/components/dataTable/DataTableButton.vue'
import { dateFormat, valOrNA } from '@/utils/util'
import { DateTime } from 'luxon'

const { t } = useI18n()
// Define props
const props = defineProps<{
  title: string
  columns: {
    // table column title
    header: string
    // Width
    width: string
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
  columns0?: {
    // table column title
    header: string
    colspan?: string
    width?: string
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
  reconfirmBtnDisable?: (param: Record<string, any>) => boolean
}

// Helper function to access nested fields
const getNestedValue = (obj: Record<string, any>, field: string, format: string) => {
  const keys = field.split('.')
  return formatDate(
    keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj),
    format
  )
}

const getNestedValueExt = (
  obj: Record<string, any>,
  field: string,
  joinCol: string,
  joinStr: string,
  joinStrEnd: string
) => {
  const keys = field.split('.')
  if (joinStr) {
    const reduce = keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj)
    const reduce1 = joinCol.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj)
    if (reduce && reduce1) {
      return reduce + joinStr + reduce1 + (joinStrEnd ?? '')
    } else {
      return ''
    }
  }
  return (
    String(keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj)) +
    joinCol.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''), obj)
  )
}
const hasOperations = () => {
  return props.operationBtnDetail || props.operationBtnUpdate || props.operationBtnDelete || props.customButtons
}
/**
 * Hide button
 * @param row current row
 */
const hideBtn = (row: Record<string, any>) => {
  if (props.btnShow) {
    return props.btnShow?.(row)
  } else {
    return true
  }
}

/**
 * Disable button
 * @param row current row
 */
const disableBtn = (row: Record<string, any>) => {
  if (props.btnDisable) {
    return props.btnDisable?.(row)
  }
  return false
}
// Handle time formatting (API returns UTC, display in user's timezone)
const formatDate = (date: any, format: string) => {
  const userTz = stateStore.user?.timeZone || DateTime.local().zoneName
  return format ? dateFormat(date, format, userTz) : date
}
// Pagination state
const currentPage = ref(1)
const totalItems = ref(0)
const totalPages = ref(1)
const itemsPerPage = props.itemsPerPage || Number(import.meta.env.VITE_PAGE_SIZE)

// Data state
const data = ref<Record<string, any>[]>([])
const loading = ref(false)
// Fetch data whenever currentPage changes
const fetchPageData = async () => {
  currentPage.value = validateAndSetPage(currentPage.value)
  loading.value = true
  const response = await props.fetchData(currentPage.value)
  data.value = response.data
  totalItems.value = response.totalItems
  const newTotalPages = Math.ceil(totalItems.value / itemsPerPage)
  // Update only when actually changed
  if (newTotalPages !== totalPages.value) {
    totalPages.value = newTotalPages
  }
  loading.value = false
}
const stateStore = userStateStore()
// Watch the currentPage ref and fetch new data
watch(currentPage, () => {
  if (stateStore.user.login) {
    fetchPageData()
  }
})

/**
 * Validate and reset page number on initialization
 */
function validateAndSetPage(value: any): number {
  // Convert to number
  const num = Number(value)

  // Check if valid number and greater than 0
  if (Number.isNaN(num) || num < 1) {
    console.warn(`无效的页码值: ${value}, 已重置为1`)
    return 1
  }

  if (totalPages.value != 0) {
    if (currentPage.value > totalPages.value) {
      return totalPages.value
    }
  }

  return Math.floor(num) // Ensure integer
}

// Methods to navigate through pages
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const firstPage = () => {
  currentPage.value = 1
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
const endPage = () => {
  currentPage.value = totalPages.value
}

function dataTrans(value: any, dictList: Record<string, Record<string, string>>) {
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
const emit = defineEmits(['openDetail', 'deleteRow', 'openUpdate', 'update:modelValue'])
const openDetail = async (row: Record<string, any>) => {
  emit('openDetail', { ...row })
}
const deleteRow = (row: Record<string, any>) => {
  emit('deleteRow', { ...row })
}
const openUpdate = (row: Record<string, any>) => {
  emit('openUpdate', { ...row })
}
defineExpose({
  fetchPageData
})
</script>

<style scoped>
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

.optimized-table th,
.optimized-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.link {
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.optimized-table {
  width: 100%;
  font-size: 14px;
}

.optimized-table th {
  font-weight: bold;
  text-align: left;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}

.optimized-table td {
  vertical-align: middle;
  max-width: 300px;
}

/* Cell content overflow handling */
.optimized-table td > span {
  word-break: break-word;
}

/* Operation column: width by content, buttons stay on one line (no wrap) */
.optimized-table .operation-cell {
  min-width: 120px;
  width: 1%;
  white-space: nowrap;
}

/* Responsive handling */
@media (max-width: 768px) {
  .optimized-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
