<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.ca-cert-certificate.cert-alias') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.certAlias, dataBefore.certAlias) }">
            {{ valOrNA(dataAfter.certAlias) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.ca-cert-certificate-cert-encode') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.certEncode, dataBefore.certEncode) }">
            {{ getOptionsByValue(dataAfter.certEncode, certEncodeOptionSelect) }}
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
import { certEncodeOptionSelect } from '@/utils/select/caCertLoad'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
