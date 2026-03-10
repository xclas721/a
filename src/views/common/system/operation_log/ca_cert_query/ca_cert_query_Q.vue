<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.issuer-cert.validity-period') }}</span>
          <p>
            <span>{{ valOrNA(dateFormat(data.notBefore)) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { dateFormat, valOrNA } from '@/utils/util'
import { type BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
