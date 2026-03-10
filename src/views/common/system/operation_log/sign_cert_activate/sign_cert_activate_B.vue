<template>
  <div class="row">
    <!-- After change -->
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
          <span>
            {{ getOptionsByValue(dataBefore.cardType, cardTypeOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.key-alias') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.keyAlias) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.common-name') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.certIssuerCn) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-cert.validity-period') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.notAfter) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-cert.credential-status') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.status, enableORDisableOptions) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { cardTypeOptions, enableORDisableOptions } from '@/utils/select/cardBin'

defineProps<{
  detailData: Record<string, any>
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
