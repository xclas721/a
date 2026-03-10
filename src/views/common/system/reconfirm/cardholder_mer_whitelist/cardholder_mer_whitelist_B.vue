<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.pan') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.acctNumber) }}
          </span>
        </p>
        <hr />
      </div>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.acquirer-bin') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.acquirerBin) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.mer-id') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.acquirerMerchantId) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.mer-name') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.merchantName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cardholder-mer-whitelisting.status') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.status, cardMerWhitelistStatusOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('acs.trans.id') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.acsTransId) }}
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
import { cardMerWhitelistStatusOptionSelect } from '@/utils/select/cardMerWhitelist'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
