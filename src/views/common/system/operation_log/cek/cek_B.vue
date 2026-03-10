<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span>
            {{ getIssuerOptionsByValue(dataBefore.issuerOid, issuerOptions) }}
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
        <span class="form-label d-block">{{ $t('ui.kek.enc-data-type') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.encDataType, encDataTypeOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.alg') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.algorithm) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.mode') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.mode) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.padding') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.padding) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.key-size') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.keySize) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.status') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.status, kekStatusOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getIssuerOptionsByValue, getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { encDataTypeOptionSelect, kekStatusOptionSelect } from '@/utils/select/kek'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
