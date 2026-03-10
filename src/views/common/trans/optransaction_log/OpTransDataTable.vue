<template>
  <div>
    <!-- Display loading indicator -->
    <div v-if="loading">Loading...</div>

    <!-- Data Table -->
    <table v-if="!loading" class="optimized-table">
      <thead>
        <tr>
          <th>
            {{ $t('ui.card-scheme.name') }}<br />
            {{ $t('ds.trans.id') }}<br />
          </th>
          <th>
            {{ $t('optrans.message.severity') }}
          </th>
          <th>
            {{ $t('optrans.message.category') }}
          </th>
          <th>
            {{ $t('optrans.message.id') }}<br />
            {{ $t('optrans.message.serial-number') }} / {{ $t('optrans.message.total') }}
          </th>
          <th>
            {{ $t('optrans.message.previous.trans.id') }}<br />
            {{ $t('optrans.message.previous.trans.reference') }}
          </th>
          <th>
            {{ $t('optrans.message.summary') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td>
            {{ getOptionsByValue(row.cardScheme, schemeOptions) }} <br />
            <span v-if="acsTransIdAction">
              <a href="#" @click.prevent="acsTransIdAction(row)" class="link">
                {{ row.dsTransId }}
              </a>
            </span>
          </td>
          <td>{{ getOptionsByValue(row.opSeverity, opSeverityOptionSelect) }}</td>
          <td>
            {{ getOptionsByValue(row.opCategory, opCategoryOptionSelect) }}
          </td>
          <td>
            {{ row.opSeqId }}<br />
            {{ row.opSeqNum }} / {{ row.opSeqTotal }}
          </td>
          <td>
            {{ row.priorTransId }}<br />
            {{ row.priorTransIdType }}
          </td>
          <td :title="row.opSummary" class="ellipsis-text">
            {{ row.opSummary }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination controls -->
    <div class="pagination-controls">
      <span class="pagination-info">{{ $t('ui.table.page.total') }} : {{ totalItems }}</span>
      <button class="pagination-btn" @click="firstPage" :disabled="currentPage === 1">&laquo;</button>
      <button class="pagination-btn" @click="prevPage" :disabled="currentPage === 1">&lt;</button>
      <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="pagination-btn" @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
      <button class="pagination-btn" @click="endPage" :disabled="currentPage === totalPages">&raquo;</button>
      <span class="pagination-info">{{ $t('ui.table.page.go') }}</span>
      <input v-model.number="currentPage" min="1" :max="totalPages" class="pagination-input" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { userStateStore } from '@/stores/user'
import { isBaseI18nSelect } from '@/utils/util'
import { type BaseI18nSelect, type BaseSelect } from '@/utils/select/baseSelect'
import i18n from '@/locales'
import { opCategoryOptionSelect, opSeverityOptionSelect } from '@/utils/select/opTrans'
import { appConfig } from '@/config'

// Define props
const props = defineProps<{
  schemeOptions: (BaseSelect | BaseI18nSelect)[]
  title: string
  fetchData: (page: number) => Promise<{ data: Record<string, any>[]; totalItems: number }>
  itemsPerPage?: number
  acsTransIdAction?: (param: Record<string, any>) => void
}>()
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

function getOptionsByValue(val: string, options: (BaseSelect | BaseI18nSelect)[] | undefined) {
  if (!val || !options) {
    return ''
  }

  const option = options.find((item) => item.value == val)
  if (!option) {
    return ''
  }

  return isBaseI18nSelect(option) ? i18n.global.t(option.i18nText) : option.text
}
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
.ellipsis-text {
  max-width: 300px; /* Adapt to your table width */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
