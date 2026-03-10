<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mcc-code.mcc') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.mcc, dataBefore.mcc) }">
            {{ valOrNA(dataAfter.mcc) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mcc-code.merchantType') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.merchantType, dataBefore.merchantType)
            }"
          >
            {{ valOrNA(dataAfter.merchantType) }}
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
