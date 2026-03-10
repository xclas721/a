<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <!-- After change -->
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.sys-code.codeType') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.codeType, codeTypeOption) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.sys-code.codeId') }}</span>
          <p>
            <span>{{ valOrNA(data.codeId) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, ref } from 'vue'
import { findDistinctCodeType } from '@/hooks/sysCode'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
}>()
const codeTypeOption = ref<BaseSelect[]>([])
onMounted(async () => {
  codeTypeOption.value = await findDistinctCodeType()
})
</script>
