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
          <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.pan') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaAcctNumber) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.acquirer-bin') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaAcquirerBIN) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.mer-id') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaAcquirerMerchantID) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.status') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaStatus, cardMerWhitelistStatusOptionSelect) }}</span>
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
import { cardMerWhitelistStatusOptionSelect } from '@/utils/select/cardMerWhitelist'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
