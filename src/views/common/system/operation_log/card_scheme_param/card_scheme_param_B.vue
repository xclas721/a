<template>
  <div class="row">
    <!-- Before change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme.name') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.codeId, schemeOptions) }}
          </span>
        </p>
        <hr />
      </div>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.referred') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.shortName) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.signature-algorithm') }}</span>
        <p>
          <span>{{ getOptionsByValue(dataBefore.jwsAlgorithm, jwsAlgorithmOptionSelect) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.algorithm') }}</span>
        <p>
          <span>{{ getOptionsByValue(dataBefore.jweAlgorithm, jweAlgorithmOptionSelect) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.connection-failed-retry-interval') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.rreqRetryInterval) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.conn-timeout') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.rreqConnTimeout) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.data-read-timeout') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.rreqReadTimeout) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.transaction-over-initial-time') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.creq1TransTimeout) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.transaction-over-time') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.creq2TransTimeout) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.service-name') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.serviceName) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.proxy-enabled') }}</span>
        <p>
          <span>{{ getOptionsByValue(dataBefore.proxyEnabled, enableFlagOptionSelect) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.proxy-host') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.proxyHost) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.proxy-port') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.proxyPort) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-scheme-param.acsRefNum') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.acsRefNum) }}</span>
        </p>
        <hr />
      </div>
      <template v-if="props.dataBefore.imageMedium || props.dataBefore.imageHigh || props.dataBefore.imageExtra">
        <div class="col-md-12 d-flex flex-column" style="height: 165px">
          <span>{{ $t('ui.issuer-param.image-medium') }}</span>
          <div class="mt-auto">
            <p>
              <template v-if="props.dataBefore.imageMedium">
                <img alt="" class="mt-2" :src="previews.imageMediumFile" style="max-width: 200px; max-height: 100px" />
              </template>
              <template v-else>
                <span>{{ valOrNA(null) }}</span>
              </template>
            </p>
            <hr />
          </div>
        </div>

        <div class="col-md-12 d-flex flex-column" style="height: 165px">
          <span>{{ $t('ui.issuer-param.image-high') }}</span>
          <div class="mt-auto">
            <p>
              <template v-if="props.dataBefore.imageHigh">
                <img alt="" class="mt-2" :src="previews.imageHighFile" style="max-width: 200px; max-height: 100px" />
              </template>
              <template v-else>
                <span>{{ valOrNA(null) }}</span>
              </template>
            </p>
            <hr />
          </div>
        </div>

        <div class="col-md-12 d-flex flex-column" style="height: 165px">
          <span>{{ $t('ui.issuer-param.image-extra') }}</span>
          <div class="mt-auto">
            <p>
              <template v-if="props.dataBefore.imageExtra">
                <img alt="" class="mt-2" :src="previews.imageExtraFile" style="max-width: 200px; max-height: 100px" />
              </template>
              <template v-else>
                <span>{{ valOrNA(null) }}</span>
              </template>
            </p>
            <hr />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.image-medium') }}</span>
          <p>
            <span>{{ valOrNA(null) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.image-high') }}</span>
          <p>
            <span>{{ valOrNA(null) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.image-extra') }}</span>
          <p>
            <span>{{ valOrNA(null) }}</span>
          </p>
          <hr />
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, reactive } from 'vue'
import ApiUtil from '@/utils/apiUtils'
import { jweAlgorithmOptionSelect, jwsAlgorithmOptionSelect } from '@/utils/select/cardSchemeParam'
import { enableFlagOptionSelect } from '@/utils/select/visarba'

const props = defineProps<{
  detailData: Record<string, any>
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

const previews = reactive<Record<string, any>>({
  imageMediumFile: null,
  imageHighFile: null,
  imageExtraFile: null
})
onMounted(async () => {
  const imgParam = [
    { msgType: 'card_scheme_image_extra', fileId: props.dataBefore.imageMedium },
    { msgType: 'card_scheme_image_high', fileId: props.dataBefore.imageHigh },
    { msgType: 'card_scheme_image_medium', fileId: props.dataBefore.imageExtra }
  ]
  const imgResult = await apiUtil.post(`/downloads`, imgParam, {}, true)
  // Update formDetails value
  if (imgResult.success && imgResult.code == '0000') {
    previews.imageMediumFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_extra')!.bytes

    previews.imageHighFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_high')!.bytes

    previews.imageExtraFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_medium')!.bytes
  }
})
</script>
