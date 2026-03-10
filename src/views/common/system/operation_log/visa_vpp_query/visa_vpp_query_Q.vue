<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row text-break">
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.issuerOid, issuerOptions) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.log.start.date') }}</span>
          <p>
            <span>{{ valOrNA(data.startDate) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.log.end.date') }}</span>
          <p>
            <span>{{ valOrNA(data.endDate) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.log.vpp.vppStep') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.vppStep, vppStepOptions) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.log.vpp.vppIndicator') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.visaVppIndicator, visaVppIndicatorOptions) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('acs.trans.id') }}</span>
          <p>
            <span>{{ valOrNA(data.acsTransID) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ds.trans.id') }}</span>
          <p>
            <span>{{ valOrNA(data.dsTransID) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('acct.number') }}</span>
          <p>
            <span>{{ valOrNA(data.acctNumber) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import { optionSelect } from '@/utils/select/baseSelect'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()

// VPP transaction type options
const vppStepOptions = computed<BaseI18nSelect[]>(() => [
  ...optionSelect,
  { value: '1a', i18nText: 'ui.trans.log.vpp.vppStep.1a' },
  { value: '1b', i18nText: 'ui.trans.log.vpp.vppStep.1b' },
  { value: '2', i18nText: 'ui.trans.log.vpp.vppStep.2' }
])

// VPP transaction indicator options
const visaVppIndicatorOptions = computed<BaseI18nSelect[]>(() => [
  ...optionSelect,
  { value: '01', i18nText: 'ui.trans.log.vpp.vppIndicator.01' },
  { value: '02', i18nText: 'ui.trans.log.vpp.vppIndicator.02' },
  { value: '03', i18nText: 'ui.trans.log.vpp.vppIndicator.03' }
])
</script>
