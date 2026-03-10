<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.reconfirm.start-date') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaStartDate) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.reconfirm.end-date') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaEndDate) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.reconfirm.function-name') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaAccessId, menuConfig) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.reconfirm.status') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaStatus, reconfirmStatusOptionSelect) }}</span>
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
import { reconfirmStatusOptionSelect } from '@/utils/select/reconfirm'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
  menuConfig?: BaseI18nSelect[]
}>()
</script>
