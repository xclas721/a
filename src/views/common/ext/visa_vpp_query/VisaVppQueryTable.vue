<template>
  <div>
    <!-- Display loading indicator -->
    <div v-if="loading">Loading...</div>

    <!-- Data Table -->
    <table v-if="!loading" class="optimized-table">
      <thead>
        <tr>
          <th>{{ $t('acs.trans.id') }}</th>
          <th>{{ $t('trans.time') }}</th>
          <th>
            {{ $t('ui.trans.log.vpp.vppStep') }}<br />
            {{ $t('ui.trans.log.vpp.vppIndicator') }}
          </th>
          <th>
            {{ $t('merchant.name') }}<br />
            {{ $t('acquirer.merchant.id') }}
          </th>
          <th>{{ $t('acct.number') }}</th>
          <th>
            {{ $t('purchase.currency') }}<br />
            {{ $t('purchase.amount') }}
          </th>
          <th>
            {{ $t('trans.status') }}<br />
            {{ $t('ui.trans.log.transStatusReason') }}
          </th>
          <th>
            {{ $t('ui.trans.log.riskAssesmentResult') }}<br />
            {{ $t('ui.trans.log.riskItemType') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex" class="transaction-row">
          <td>
            <span v-if="acsTransIdAction">
              <a href="#" @click.prevent="acsTransIdAction(row)" class="link">
                {{ row.acsTransId }}
              </a>
            </span>
            <span v-else>{{ row.acsTransId }}</span>
          </td>
          <td>{{ dateFormat(row.createDateTime, 'yyyy-MM-dd HH:mm:ss', userTz()) }}</td>
          <td>
            <template v-if="row.vppStep">
              {{ getOptionsByValue(row.vppStep, vppStepOptions) }}
            </template>
            <template v-else>N/A</template>
            <br />
            <template v-if="row.visaVppIndicator">
              {{ getOptionsByValue(row.visaVppIndicator, visaVppIndicatorOptions) }}
            </template>
            <template v-else>N/A</template>
          </td>
          <td>
            {{ row.merchantName }}<br />
            {{ row.acquirerMerchantId }}
          </td>
          <td>
            <span v-if="panAction">
              <a href="#" @click.prevent="panAction(row)" class="link">
                {{ row.acctNumberPrefix }}XXXXXX{{ row.acctNumberPostfix }}
              </a>
            </span>
            <span v-else> {{ row.acctNumberPrefix }}XXXXXX{{ row.acctNumberPostfix }} </span>
          </td>
          <td>
            {{ getOptionsByValue(row.purchaseCurrency, currencyData) }}<br />
            ({{ row.purchaseCurrency }})<br />
            {{ formatAmount(row.purchaseAmount, row.purchaseExponent) }}
          </td>
          <td>
            <template v-if="row.transStatus">
              {{ getOptionsByValue(row.transStatus, transStatusOptions) }}
            </template>
            <br />
            <template v-if="row.transStatusReason">
              ({{ row.transStatusReason }})
              {{ $t('ui.trans-status-reason.' + row.transStatusReason) }}
            </template>
          </td>
          <td>
            <template v-if="row.riskAssesmentMethod && row.riskAssesmentResult">
              {{ $t('ui.trans.log.risk-method.' + row.riskAssesmentMethod) }}-{{
                $t('ui.trans.log.reskAssesmentResult.' + row.riskAssesmentResult)
              }}
            </template>
            <br />
            <template v-if="row.riskItemType">
              {{ row.riskItemType }}:
              <template v-if="row.riskAssesmentMethod == '02' || row.riskAssesmentMethod == '03'">
                {{ $t('ui.black-list.itemType.' + row.riskItemType) }}
              </template>
              <template v-else-if="row.riskAssesmentMethod == '05' && row.riskItemType == '25'">
                {{ $t('ui.mc-rba.reason-code-' + row.riskItemType) }}
              </template>
              <template v-else>
                {{ $t('ui.trans.log.riskAssesmentReason.' + row.riskItemType) }}
              </template>
            </template>
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
import { DateTime } from 'luxon'
import { dateFormat, formatAmount, isBaseI18nSelect } from '@/utils/util'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import i18n from '@/locales'
import { appConfig } from '@/config'

const userTz = () => userStateStore().user?.timeZone || DateTime.local().zoneName

// Define props
const props = defineProps<{
  currencyData: (BaseSelect | BaseI18nSelect)[]
  title: string
  fetchData: (page: number) => Promise<{ data: Record<string, any>[]; totalItems: number }>
  itemsPerPage?: number
  acsTransIdAction?: (param: Record<string, any>) => void
  panAction?: (param: Record<string, any>) => void
  vppStepOptions: (BaseSelect | BaseI18nSelect)[]
  visaVppIndicatorOptions: (BaseSelect | BaseI18nSelect)[]
  transStatusOptions: (BaseSelect | BaseI18nSelect)[]
  riskAssessmentMethodOptions: (BaseSelect | BaseI18nSelect)[]
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
defineExpose({
  currentPage,
  fetchPageData
})
</script>

<style scoped>
.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  color: #007bff;
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
  vertical-align: middle;
}

.optimized-table th {
  font-weight: bold;
}

.link {
  color: #007bff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
