<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.issuerOid, dataAfter.issuerOid) }">
            {{ getOptionsByValue(dataAfter.issuerOid, issuerOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.black-list.item-type') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.itemType, dataBefore.itemType) }">
            {{ getOptionsByValue(dataAfter.itemType, TypeOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.black-list.item-value') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.itemValueMask, dataBefore.itemValueMask)
            }"
          >
            {{ valOrNA(dataAfter.itemValueMask) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.black-list.risk-level') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.riskLevel, dataBefore.riskLevel) }">
            {{ getOptionsByValue(dataAfter.riskLevel, blackListRiskLevelOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.black-list.memo') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.memo, dataBefore.memo) }">
            {{ valOrNA(dataAfter.memo) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import { blackListRiskLevelOptionSelect } from '@/utils/select/blacklist'
import { onMounted, ref } from 'vue'
import { findByCodeType } from '@/hooks/sysCode'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()

const TypeOptions = ref<BaseI18nSelect[]>([])
onMounted(async () => {
  TypeOptions.value = await findByCodeType('BLACK_LIST_ITEM_TYPE')
})
</script>
