<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <!-- After change -->
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
            <span>{{ dateFormat(data.criteriaStartDate) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.operation-log.op-end-date') }}</span>
          <p>
            <span>{{ dateFormat(data.criteriaEndDate) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.operation-log.account') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaAccount) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.operation-log.function') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaAccessId) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.operation-log.action') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaAction, actionOptionSelect) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.operation-log.result') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaResult, actionResultOptionSelect) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { dateFormat, getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import { actionOptionSelect, actionResultOptionSelect } from '@/utils/select/operation'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
  menuConfig?: BaseI18nSelect[]
}>()
</script>
