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
          <span class="form-label d-block">{{ $t('ui.mc-rba.enabled') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaEnableFlag, enableFlagOptionSelect) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.mc-rba.low-risk') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criterialPolicyLowRisk, policyLowRiskOptionSelect) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.mc-rba.not-low-risk') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criterialPolicyNotLowRisk, policyNotLowRiskOptionSelect) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { enableFlagOptionSelect } from '@/utils/select/visarba'
import { policyLowRiskOptionSelect, policyNotLowRiskOptionSelect } from '@/utils/select/mcrba'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
