<template>
  <div class="row">
    <!-- Before change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.trans.log.details.cardSchemeName') }}</span>
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { jweAlgorithmOptionSelect, jwsAlgorithmOptionSelect } from '@/utils/select/cardSchemeParam'
import { enableFlagOptionSelect } from '@/utils/select/visarba'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
