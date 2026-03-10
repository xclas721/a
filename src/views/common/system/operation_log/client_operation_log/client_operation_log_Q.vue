<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.issuerOid, issuerOptions) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.operation-log.op-start-date') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaStartDate) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.operation-log.op-end-date') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaEndDate) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.card-data.pan') }}</span>
          <p>
            <span>{{ valOrNA(data.lbAcctNumber) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.cardholder-data.idno') }}</span>
          <p>
            <span>{{ valOrNA(data.lbIdNo) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
