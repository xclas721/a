<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.bank-id') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.bankId, dataBefore.bankId) }">
            {{ valOrNA(dataAfter.bankId) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.issuer-name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.issuerName, dataBefore.issuerName) }">
            {{ valOrNA(dataAfter.issuerName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.description') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.description, dataBefore.description) }">
            {{ valOrNA(dataAfter.description) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
