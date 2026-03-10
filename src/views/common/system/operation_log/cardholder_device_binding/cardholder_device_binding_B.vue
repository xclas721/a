<template>
  <!-- After change -->
  <div class="col-md-12">
    <div class="col-md-12">
      <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
      <p>
        <span>
          {{ getOptionsByValue(dataBefore.issuerOid, issuerOptions) }}
        </span>
      </p>
      <hr />
    </div>

    <div class="col-md-12">
      <span class="form-label d-block">{{ $t('ui.card-scheme.name') }}</span>
      <p>
        <span>
          {{ valOrNA(dataBefore.uiCardScheme) }}
        </span>
      </p>
      <hr />
    </div>

    <div class="col-md-12">
      <span class="form-label d-block">{{ $t('ui.card-data.pan') }}</span>
      <p>
        <span>
          {{ valOrNA(dataBefore.acctNumberMask) }}
        </span>
      </p>
      <hr />
    </div>

    <div class="col-md-12">
      <span class="form-label d-block">{{ $t('ui.cardholder-device-binding.device-advertising-id') }}</span>
      <p>
        <span>
          {{ dataBefore.deviceBindingList[0].deviceAdvertisingId }}
        </span>
      </p>
      <hr />
    </div>

    <div class="col-md-12">
      <span class="form-label d-block">{{ $t('ui.cardholder3DSAttempt.status') }}</span>
      <p>
        <span>
          {{ $t('ui.cardholder-device-binding.status.' + dataBefore.deviceBindingList[0].status) }}
        </span>
      </p>
      <hr />
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  detailData: Record<string, any>
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
