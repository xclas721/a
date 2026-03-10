<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div v-if="detailData.action == 'E'">
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
                'text-danger': isDifferent(dataAfter.certIssuerCn, dataBefore.certIssuerCn)
              }"
            >
              {{ valOrNA(dataAfter.certIssuerCn) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-cert.validity-period') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.notAfter, dataBefore.notAfter) }">
              {{ valOrNA(dataAfter.notAfter) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-cert.credential-status') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.status, dataBefore.status) }">
              {{ getOptionsByValue(dataAfter.status, enableORDisableOptions) }}
            </span>
          </p>
          <hr />
        </div>
      </div>

      <div v-if="detailData.action == 'A'">
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
          <span class="form-label d-block">{{ $t('ui.issuer-cert.Signature-certificate-format') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.certEncode, dataBefore.certEncode) }">
              {{ getOptionsByValue(dataAfter.certEncode, certEncodeOptionSelect) }}
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
import { cardTypeOptions, enableORDisableOptions } from '@/utils/select/cardBin'

defineProps<{
  detailData: Record<string, any>
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
