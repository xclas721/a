<template>
  <div>
    <!-- Display loading indicator -->
    <div v-if="loading">Loading...</div>

    <!-- Data Table -->
    <table v-if="!loading" class="optimized-table">
      <thead>
        <tr>
          <th>{{ $t('ui.issuer.name') }}</th>
          <th>
            {{ $t('acs.trans.id') }}<br />
            {{ $t('ui.trans.log.challenge-ind-short') }}
          </th>
          <th>
            {{ $t('acct.number') }}<br />
            {{ $t('device.channel') }}/{{ $t('message.category') }}/{{ $t('message.version') }}
          </th>
          <th>
            {{ $t('purchase.currency') }}<br />
            {{ $t('purchase.amount') }}
          </th>
          <th>
            {{ $t('merchant.name') }}<br />
            {{ $t('acquirer.merchant.id') }}
          </th>
          <th>{{ $t('trans.time') }}</th>
          <th>
            {{ $t('trans.status') }}({{ $t('eci') }})<br />
            {{ $t('ui.trans.riskAssessmentMethod') }}<br />
            {{ $t('ui.trans.log.basic.authenticationMethod') }}
          </th>
          <th>{{ $t('error.description') }}</th>
          <th>
            {{ $t('ui.trans.log.visa-rba.fraud') }}<br />
            <span>
              {{ $t('btn.select.all') }}
              <br />
              <div style="text-align: center">
                <input v-model="selectAll" type="checkbox" class="checkbox" @change="checkboxAll()" />
              </div>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex" class="transaction-row">
          <td>{{ getOptionsByValue(row.issuerOid, issuerOptions) }}</td>
          <td>
            <span v-if="acsTransIdAction">
              <a href="#" @click.prevent="acsTransIdAction(row)" class="link">
                {{ row.acsTransId }}
              </a>
            </span>
            <br />
            <template v-if="row.deviceChannel == '03'">
              <span v-if="row.threeDSRequestor3RIInd && row.threeDSRequestor3RIInd < 12">
                {{ getOptionsByValue(row.threeDSRequestor3RIInd, threeDSRequestor3RIIndOptionSelect) }}
              </span>
              <span v-else-if="row.threeDSRequestor3RIInd && row.threeDSRequestor3RIInd > 12">
                <span v-if="row.cardScheme == 'V'">
                  {{ $t('ui.trans.log.threeDSRequestor3RIInd.V.' + row.threeDSRequestor3RIInd) }}
                </span>
                <span v-else>
                  {{ $t('ui.trans.log.threeDSRequestor3RIInd.M.' + row.threeDSRequestor3RIInd) }}
                </span>
              </span>
            </template>
            <template v-else>
              <span v-if="row.threeDSRequestorChallengeInd">
                {{ getOptionsByValue(row.threeDSRequestorChallengeInd, threeDSRequestorChallengeIndOptionSelect) }}
              </span>
            </template>
          </td>
          <td>
            <span v-if="panAction">
              <a href="#" @click.prevent="panAction(row)" class="link">
                {{ row.acctNumberPrefix }}XXXXXX{{ row.acctNumberPostfix }}
              </a>
            </span>
            <br />
            <!-- Device Channel -->
            <span v-if="row.deviceChannel">{{ $t('ui.trans.log.deviceChannel.' + row.deviceChannel) }} </span>
            <!-- Message Category -->
            <span v-if="row.messageCategory"> / {{ $t('ui.trans.log.messageCategory.' + row.messageCategory) }} </span>
            <!-- Message Version -->
            <span v-if="row.messageVersion">
              / {{ getOptionsByValue(row.messageVersion, messageVersionOptionSelect) }}
            </span>
          </td>
          <td>
            {{ getOptionsByValue(row.purchaseCurrency, currencyData) }}<br />
            ({{ row.purchaseCurrency }})<br />
            {{ formatAmount(row.purchaseAmount, row.purchaseExponent) }}
          </td>
          <td style="width: 10%">
            {{ row.merchantName }}<br />
            {{ row.acquirerMerchantId }}
          </td>
          <td>
            {{
              dateFormat(
                row.createDateTime,
                'yyyy-MM-dd HH:mm:ss',
                stateStore.user?.timeZone || DateTime.local().zoneName
              )
            }}
          </td>
          <td>
            <template v-if="row.transStatus">
              {{ $t('ui.trans.log.transStatus.' + row.transStatus) }}
              <template v-if="row.eci">({{ row.eci }})</template><br />
              <template v-if="row.riskAssesmentMethod">
                {{ $t('ui.trans.log.risk-method.' + row.riskAssesmentMethod) }}<br />
              </template>
              <template v-if="row.authenticationMethod">
                {{ $t('ui.trans.log.authenticationMethod.' + row.authenticationMethod) }}
              </template>
            </template>
          </td>
          <td>
            {{ getOptionsByValue(row.stmState, stmStateOptionSelect) }}
            <template v-if="row.stmReason">({{ getOptionsByValue(row.stmReason, stmReasonOptionSelect) }})</template
            ><br />
            <template v-if="row.errorCode"> ({{ row.errorCode }}){{ row.errorDescription }} </template>
            <template v-if="row.transStatusReason">
              <template v-if="row.transStatusReason">({{ row.transStatusReason }})</template>
              {{ $t('ui.trans-status-reason.' + row.transStatusReason) }}
            </template>
          </td>
          <td>
            <div style="text-align: center">
              <input type="checkbox" class="checkbox" :checked="row.fraud == 'Y'" @change="selectItem(row.oid)" />
            </div>
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
import { reactive, ref, watchEffect } from 'vue'
import { userStateStore } from '@/stores/user'
import { DateTime } from 'luxon'
import { dateFormat, formatAmount, isBaseI18nSelect } from '@/utils/util'
import {
  messageVersionOptionSelect,
  stmReasonOptionSelect,
  stmStateOptionSelect,
  threeDSRequestor3RIIndOptionSelect,
  threeDSRequestorChallengeIndOptionSelect
} from '@/utils/select/transStatus'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import i18n from '@/locales'
import { appConfig } from '@/config'

// Define props
const props = defineProps<{
  currencyData: (BaseSelect | BaseI18nSelect)[]
  issuerOptions: (BaseSelect | BaseI18nSelect)[]
  title: string
  fetchData: (page: number) => Promise<{ data: Record<string, any>[]; totalItems: number }>
  itemsPerPage?: number
  acsTransIdAction?: (param: Record<string, any>) => void
  panAction?: (param: Record<string, any>) => void
}>()

const selectAll = ref(false)
const select = reactive<string[]>([])
/**
 * Select All
 */
const checkboxAll = () => {
  for (const item of data.value) {
    if (selectAll.value) {
      item.fraud = 'Y'
      select.push(item.oid)
    } else {
      item.fraud = 'N'
      select.splice(0, select.length)
    }
  }
}
/**
 * Select Single
 */
const selectItem = (val: string) => {
  // Check if exists, if not add it
  const index = select.indexOf(val)
  if (index === -1) {
    // If not exists, add to selected list
    select.push(val)
  } else {
    // If exists, remove from selected list
    select.splice(index, 1)
  }

  // Update fraud status of current row
  const item = data.value.find((item) => item.oid === val)
  if (item) {
    item.fraud = select.includes(val) ? 'Y' : 'N'
  }
  // Update select all status
  selectAll.value = select.length === data.value.length
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
  currentPage
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
  vertical-align: middle; /* Change to vertical center alignment */
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

.checkbox {
  margin: 0;
  vertical-align: middle;
}
</style>
