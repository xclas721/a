<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.eea-region.countryCode') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.countryCode, dataBefore.countryCode) }">
            {{ valOrNA(dataAfter.countryCode) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.eea-region.eeaCountry') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.eeaCountry, dataBefore.eeaCountry) }">
            {{ valOrNA(dataAfter.eeaCountry) }}
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
