<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <!-- After change -->
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaIssuerOid, issuer) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('select.device.channel') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaDeviceChannel, deviceChannelOptionSelect) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('select.message.category') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaMessageCategory, messageCategoryOptionSelect) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('select.ui.type') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaUiType, uiTypeOptionSelect) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('select.qualifier') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaQualifier) }}</span>
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
import { onMounted, ref } from 'vue'
import { deviceChannelOptionSelect } from '@/utils/select/transStatus'
import { messageCategoryOptionSelect, uiTypeOptionSelect } from '@/utils/select/challengeUi'

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
