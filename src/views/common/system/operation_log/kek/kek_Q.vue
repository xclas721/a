<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <!-- After change -->
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
          <p>
            <span>{{ getIssuerOptionsByValue(data.issuerOid, issuerOptions) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.kek.key-alias') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaKeyAlias) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.kek.enc-data-type') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaEncDataType, encDataTypeOptionSelect) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.kek.status') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaStatus, kekStatusOptionSelect) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getIssuerOptionsByValue, getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { encDataTypeOptionSelect, kekStatusOptionSelect } from '@/utils/select/kek'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
