<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.issuerOid, dataBefore.issuerOid) }">
            {{ getOptionsByValue(dataAfter.issuerOid, issuerOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-mer-whitelist.acquirer-bin') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.acquirerBin, dataBefore.acquirerBin) }">
            {{ valOrNA(dataAfter.acquirerBin) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.mer-id') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.acquirerMerchantId, dataBefore.acquirerMerchantId)
            }"
          >
            {{ valOrNA(dataAfter.acquirerMerchantId) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.mer-name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.merchantName, dataBefore.merchantName) }">
            {{ valOrNA(dataAfter.merchantName) }}
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

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
