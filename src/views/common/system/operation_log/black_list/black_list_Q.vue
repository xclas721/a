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
          <span class="form-label d-block">{{ $t('ui.black-list.item-type') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaItemType, TypeOptions) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.black-list.risk-level') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaRiskLevel, blackListRiskLevelOptionSelect) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.black-list.item-value') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaItemValue) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import { blackListRiskLevelOptionSelect } from '@/utils/select/blacklist'
import { onMounted, ref } from 'vue'
import { findByCodeType } from '@/hooks/sysCode'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()

const TypeOptions = ref<BaseI18nSelect[]>([])
onMounted(async () => {
  TypeOptions.value = await findByCodeType('BLACK_LIST_ITEM_TYPE')
})
</script>
