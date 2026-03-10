<template>
  <div class="row">
    <!-- Before change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.issuerOid, issuerOptions) }}
          </span>
        </p>
        <hr />
      </div>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.type') }}</span>
        <p>
          <span>{{ getOptionsByValue(dataBefore.cardType, cardTypeOptions) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme.name') }}</span>
        <p>
          <span>{{ getOptionsByValue(dataBefore.cardScheme, schemeOptions) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.start-bin') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.binBegin) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.end-bin') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.binEnd) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.decAuthInd') }}</span>
        <p>
          <span>{{ getOptionsByValue(dataBefore.decAuthInd, enableORDisableOptions) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.merWhiteListInd') }}</span>
        <p>
          <span>{{ getOptionsByValue(dataBefore.merWhiteListInd, enableORDisableOptions) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-bin.deviceBindingInd') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.deviceBindingInd, enableORDisableOptions) }}
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
import { getOptionsByValue, valOrNA } from '@/utils/util'
import { cardTypeOptions, enableORDisableOptions } from '@/utils/select/cardBin'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, ref } from 'vue'
import ApiUtil from '@/utils/apiUtils'

const props = defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
const imageSrc = ref<string>()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
onMounted(async () => {
  const imgResult = await apiUtil.get(`/download/spc_icon_img/${props.dataBefore.spcIconImgId}`, {}, {}, true)
  if (imgResult.success && imgResult.code == '0000') {
    imageSrc.value = 'data:image/png;base64,' + imgResult.data
  }
})
</script>
