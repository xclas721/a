<template>
  <div class="row">
    <div v-if="detailData.action == 'I'">
      <div>
        <div class="col-md-12" v-if="dataAfter.updateList && dataAfter.deleteList && dataAfter.insertList">
          <h4>
            <span class="text-center text-success table-bordered">
              {{ $t('ui.currency-add') }}
            </span>
          </h4>

          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('ui.currency.entity') }}</th>
                <th scope="col">{{ $t('ui.currency.currency') }}</th>
                <th scope="col">{{ $t('ui.currency.alphabeticCode') }}</th>
                <th scope="col">{{ $t('ui.currency.numericCode') }}</th>
                <th scope="col">{{ $t('ui.currency.minorUnit') }}</th>
                <th scope="col">{{ $t('ui.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(currency, index) in dataAfter.updateList" :key="index">
                <th scope="row">{{ index }}</th>
                <td>{{ currency.entity }}</td>
                <td>{{ currency.currency }}</td>
                <td>{{ currency.alphabeticCode }}</td>
                <td>{{ currency.numericCode }}</td>
                <td>{{ currency.minorUnit }}</td>
                <td>
                  <span class="text-success">{{ $t('ui.operation-log.action.E') }}</span>
                </td>
              </tr>
              <tr v-for="(currency, index) in dataAfter.deleteList" :key="index">
                <th scope="row">{{ index }}</th>
                <td>{{ currency.entity }}</td>
                <td>{{ currency.currency }}</td>
                <td>{{ currency.alphabeticCode }}</td>
                <td>{{ currency.numericCode }}</td>
                <td>{{ currency.minorUnit }}</td>
                <td>
                  <span class="text-success">{{ $t('ui.operation-log.action.D') }}</span>
                </td>
              </tr>
              <tr v-for="(currency, index) in dataAfter.insertList" :key="index">
                <th scope="row">{{ index }}</th>
                <td>{{ currency.entity }}</td>
                <td>{{ currency.currency }}</td>
                <td>{{ currency.alphabeticCode }}</td>
                <td>{{ currency.numericCode }}</td>
                <td>{{ currency.minorUnit }}</td>
                <td>
                  <span class="text-success">{{ $t('ui.operation-log.action.A') }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>N/A</div>
      </div>
    </div>
    <!-- After change -->
    <div class="col-md-12 text-break" v-else>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.entity') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.entity, dataBefore.entity) }">
            {{ valOrNA(dataAfter.entity) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.currency') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.currency, dataBefore.currency) }">
            {{ valOrNA(dataAfter.currency) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.alphabeticCode') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.alphabeticCode, dataBefore.alphabeticCode)
            }"
          >
            {{ valOrNA(dataAfter.alphabeticCode) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.numericCode') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.numericCode, dataBefore.numericCode) }">
            {{ valOrNA(dataAfter.numericCode) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.minorUnit') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.minorUnit, dataBefore.minorUnit) }">
            {{ valOrNA(dataAfter.minorUnit) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.link.currency-rate') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(
                dataAfter.currencyRate ? dataAfter.currencyRate.rate : null,
                dataBefore.currencyRate ? dataBefore.currencyRate.rate : null
              )
            }"
          >
            {{ valOrNA(dataAfter.currencyRate.rate) }}
          </span>
        </p>
        <hr />
      </div>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency-rate.exchangeWay') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(
                dataAfter.currencyRate ? dataAfter.currencyRate.exchangeWay : '',
                dataBefore.currencyRate ? dataBefore.currencyRate.exchangeWay : ''
              )
            }"
          >
            {{ getOptionsByValue(dataAfter.currencyRate.exchangeWay, exchangeWayOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { exchangeWayOptionSelect } from '@/utils/select/currency'

defineProps<{
  detailData: Record<string, any>
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
