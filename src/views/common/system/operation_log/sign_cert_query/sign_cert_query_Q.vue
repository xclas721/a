<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <!-- After change -->
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.issuerOid, issuer) }}</span>
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
          <span class="form-label d-block">{{ $t('ui.issuer-cert.credential-status') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.status, enableORDisableOptions) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.issuer-cert.validity-period') }}</span>
          <p>
            <span>{{ valOrNA(data.notBefore) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import { type BaseSelect, defaultOptionSelect } from '@/utils/select/baseSelect'
import { enableORDisableOptions } from '@/utils/select/cardBin'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
onMounted(() => {
  issuer.value = [...defaultOptionSelect, ...(props.issuerOptions ?? [])]
})
const issuer = ref([...defaultOptionSelect, ...(props.issuerOptions ?? [])])
</script>
