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
          <span class="form-label d-block">{{ $t('ui.card-bin.type') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.cardType, cardTypeOptions) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.card-scheme.name') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.cardScheme, schemeOptions) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.card-bin.card') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaCardBin) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.card-bin.criteriaDecAuthInd') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.decAuthInd, enableORDisableOptions) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.card-bin.criteriaMerWhiteListInd') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.merWhiteListInd, enableORDisableOptions) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.card-bin.deviceBindingInd') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.deviceBindingInd, enableORDisableOptions) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import { cardTypeOptions, enableORDisableOptions } from '@/utils/select/cardBin'
import type { BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
