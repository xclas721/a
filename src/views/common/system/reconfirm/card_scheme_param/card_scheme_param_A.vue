<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <template v-if="detailData.action != 'U'">
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.trans.log.details.cardSchemeName') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.codeId, dataBefore.codeId) }">
              {{ getOptionsByValue(dataAfter.codeId, schemeOptions) }}
            </span>
          </p>
          <hr />
        </div>
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.referred') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.shortName, dataBefore.shortName) }">
              {{ valOrNA(dataAfter.shortName) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.signature-algorithm') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.jwsAlgorithm, dataBefore.jwsAlgorithm)
              }"
            >
              {{ getOptionsByValue(dataAfter.jwsAlgorithm, jwsAlgorithmOptionSelect) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.algorithm') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.jweAlgorithm, dataBefore.jweAlgorithm)
              }"
            >
              {{ getOptionsByValue(dataAfter.jweAlgorithm, jweAlgorithmOptionSelect) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.connection-failed-retry-interval') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.rreqRetryInterval, dataBefore.rreqRetryInterval)
              }"
            >
              {{ valOrNA(dataAfter.rreqRetryInterval) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.conn-timeout') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.rreqConnTimeout, dataBefore.rreqConnTimeout)
              }"
            >
              {{ valOrNA(dataAfter.rreqConnTimeout) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.data-read-timeout') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.rreqReadTimeout, dataBefore.rreqReadTimeout)
              }"
            >
              {{ valOrNA(dataAfter.rreqReadTimeout) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.transaction-over-initial-time') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.creq1TransTimeout, dataBefore.creq1TransTimeout)
              }"
            >
              {{ valOrNA(dataAfter.creq1TransTimeout) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.transaction-over-time') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.creq2TransTimeout, dataBefore.creq2TransTimeout)
              }"
            >
              {{ valOrNA(dataAfter.creq2TransTimeout) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.service-name') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.serviceName, dataBefore.serviceName) }">
              {{ valOrNA(dataAfter.serviceName) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.proxy-enabled') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.proxyEnabled, dataBefore.proxyEnabled)
              }"
            >
              {{ getOptionsByValue(dataAfter.proxyEnabled, enableFlagOptionSelect) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.proxy-host') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.proxyHost, dataBefore.proxyHost) }">
              {{ valOrNA(dataAfter.proxyHost) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.proxy-port') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.proxyPort, dataBefore.proxyPort) }">
              {{ valOrNA(dataAfter.proxyPort) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme-param.acsRefNum') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.acsRefNum, dataBefore.acsRefNum) }">
              {{ valOrNA(dataAfter.acsRefNum) }}
            </span>
          </p>
          <hr />
        </div>
      </template>
      <template v-if="detailData.action == 'U'">
        <div class="col-md-12 d-flex flex-column" style="height: 165px">
          <span>{{ $t('ui.issuer-param.image-medium') }}</span>
          <div class="mt-auto">
            <p>
              <img alt="" class="mt-2" :src="previews.imageMediumFile" style="max-width: 200px; max-height: 100px" />
            </p>
            <hr />
          </div>
        </div>

        <div class="col-md-12 d-flex flex-column" style="height: 165px">
          <span>{{ $t('ui.issuer-param.image-high') }}</span>
          <div class="mt-auto">
            <p>
              <img alt="" class="mt-2" :src="previews.imageHighFile" style="max-width: 200px; max-height: 100px" />
            </p>
            <hr />
          </div>
        </div>

        <div class="col-md-12 d-flex flex-column" style="height: 165px">
          <span>{{ $t('ui.issuer-param.image-extra') }}</span>
          <div class="mt-auto">
            <p>
              <img alt="" class="mt-2" :src="previews.imageExtraFile" style="max-width: 200px; max-height: 100px" />
            </p>
            <hr />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
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
    { msgType: 'card_scheme_image_medium', fileId: props.dataAfter.imageMedium },
    { msgType: 'card_scheme_image_high', fileId: props.dataAfter.imageHigh },
    { msgType: 'card_scheme_image_extra', fileId: props.dataAfter.imageExtra }
  ]
  const imgResult = await apiUtil.post(`/downloads`, imgParam, {}, true)
  // Update formDetails value
  if (imgResult.success && imgResult.code == '0000') {
    previews.imageMediumFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_medium')!.bytes

    previews.imageHighFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_high')!.bytes

    previews.imageExtraFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'card_scheme_image_extra')!.bytes
  }
})
</script>
