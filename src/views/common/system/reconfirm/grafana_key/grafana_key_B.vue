<template>
  <div class="row">
    <!-- Before change -->
    <div class="col-md-12">
      <!-- Issuer -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.issuerOid, issuerOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <!-- API Key -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.grafana-key.api-key') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.apiKey) }}
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

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
