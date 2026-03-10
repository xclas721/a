<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.issuerOid, dataBefore.issuerOid) }">
            {{ getOptionsByValue(dataAfter.issuerOid, issuerOptions) }}
          </span>
        </p>
        <hr />
      </div>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.type') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.cardType, dataBefore.cardType) }">
            {{ getOptionsByValue(dataAfter.cardType, cardTypeOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.cardScheme, dataBefore.cardScheme) }">
            {{ getOptionsByValue(dataAfter.cardScheme, schemeOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.start-bin') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.binBegin, dataBefore.binBegin) }">
            {{ valOrNA(dataAfter.binBegin) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.end-bin') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.binEnd, dataBefore.binEnd) }">
            {{ valOrNA(dataAfter.binEnd) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.decAuthInd') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.decAuthInd, dataBefore.decAuthInd) }">
            {{ getOptionsByValue(dataAfter.decAuthInd, enableORDisableOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.merWhiteListInd') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.merWhiteListInd, dataBefore.merWhiteListInd)
            }"
          >
            {{ getOptionsByValue(dataAfter.merWhiteListInd, enableORDisableOptions) }}
          </span>
        </p>
        <hr />
      </div>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.deviceBindingInd') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.deviceBindingInd, dataBefore.deviceBindingInd)
            }"
          >
            {{ getOptionsByValue(dataAfter.deviceBindingInd, enableORDisableOptions) }}
          </span>
        </p>
        <hr />
      </div>
      <div class="col-md-12 d-flex flex-column" style="height: 165px">
        <span>{{ $t('ui.card-bin.spc-icon-img') }}</span>
        <div class="mt-auto">
          <p>
            <img alt="" class="mt-2" :src="imageSrc" style="max-width: 200px; max-height: 100px" />
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import { cardTypeOptions, enableORDisableOptions } from '@/utils/select/cardBin'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, ref } from 'vue'
import ApiUtil from '@/utils/apiUtils'
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const props = defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
const imageSrc = ref<string>()

onMounted(async () => {
  const imgResult = await apiUtil.get(`/download/spc_icon_img/${props.dataAfter.spcIconImgId}`, {}, {}, true)
  if (imgResult.success && imgResult.code == '0000') {
    imageSrc.value = 'data:image/png;base64,' + imgResult.data
  }
})
</script>
