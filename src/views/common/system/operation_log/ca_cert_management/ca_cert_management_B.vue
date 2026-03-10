<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.ca-cert-certificate.cert-alias') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.certAlias) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.ca-cert-certificate-cert-issuer') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.certIssuer) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.ca-cert-certificate-subject') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.subject) }}
          </span>
        </p>
        <hr />
      </div>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.ca-cert-certificate-serial-number') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.serialNumber) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-cert.validity-period') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.validPeriod) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
