<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div v-if="detailData.action === 'A'">
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.ca-cert-certificate.cert-alias') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.certAlias, dataBefore.certAlias) }">
              {{ valOrNA(dataAfter.certAlias) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.ca-cert-certificate-cert-encode') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.certEncode, dataBefore.certEncode) }">
              {{ getOptionsByValue(dataAfter.certEncode, certEncodeOptionSelect) }}
            </span>
          </p>
          <hr />
        </div>
      </div>

      <div v-else>
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.ca-cert-certificate.cert-alias') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.certAlias, dataBefore.certAlias) }">
              {{ valOrNA(dataAfter.certAlias) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.kek.key-alias') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.keyAlias, dataBefore.keyAlias) }">
              {{ valOrNA(dataAfter.keyAlias) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.certificate-quest.common-name') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.subjectCn, dataBefore.subjectCn)
              }"
            >
              {{ valOrNA(dataAfter.subjectCn) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-cert.validity-period') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.validPeriod, dataBefore.validPeriod) }">
              {{ valOrNA(dataAfter.validPeriod) }}
            </span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { certEncodeOptionSelect } from '@/utils/select/caCertLoad'

defineProps<{
  detailData: Record<string, any>
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
