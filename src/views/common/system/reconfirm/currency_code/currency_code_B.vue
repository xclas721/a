<template>
  <div class="row text-break">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.entity') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.entity) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.currency') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.currency) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.alphabeticCode') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.alphabeticCode) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.numericCode') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.numericCode) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.minorUnit') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.minorUnit) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency.link.currency-rate') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.currencyRate.rate) }}
          </span>
        </p>
        <hr />
      </div>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.currency-rate.exchangeWay') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.currencyRate.exchangeWay, exchangeWayOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
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
