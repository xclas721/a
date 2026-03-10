<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <!-- After change -->
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.currency.entity') }}</span>
          <p>
            <span>{{ valOrNA(data.entity) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.currency.currency') }}</span>
          <p>
            <span>{{ valOrNA(data.currency) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.currency.alphabeticCode') }}</span>
          <p>
            <span>{{ valOrNA(data.alphabeticCode) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.currency.numericCode') }}</span>
          <p>
            <span>{{ valOrNA(data.numericCode) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
