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
        <span class="form-label d-block">{{ $t('ui.visa-rba.enabled') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.enableFlag, dataBefore.enableFlag) }">
            {{ getOptionsByValue(dataAfter.enableFlag, enableFlagOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.visa-rba.visa-RBA-Score-Ind') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.visaRBAScoreInd, dataBefore.visaRBAScoreInd)
            }"
          >
            {{ valOrNA(dataAfter.visaRBAScoreInd) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.visa-rba.visa-RBA-Score-Ind.2') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.visaRBAScoreInd2, dataBefore.visaRBAScoreInd2)
            }"
          >
            {{ valOrNA(dataAfter.visaRBAScoreInd2) }}
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
import { enableFlagOptionSelect } from '@/utils/select/visarba'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
