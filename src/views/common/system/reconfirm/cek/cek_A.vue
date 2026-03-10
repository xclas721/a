<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.issuerOid, dataBefore.issuerOid) }">
            {{ getIssuerOptionsByValue(dataAfter.issuerOid, issuerOptions) }}
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
        <span class="form-label d-block">{{ $t('ui.kek.enc-data-type') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.encDataType, dataBefore.encDataType) }">
            {{ getOptionsByValue(dataAfter.encDataType, encDataTypeOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.alg') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.algorithm, dataBefore.algorithm) }">
            {{ valOrNA(dataAfter.algorithm) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.mode') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.mode, dataBefore.mode) }">
            {{ valOrNA(dataAfter.mode) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.padding') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.padding, dataBefore.padding) }">
            {{ valOrNA(dataAfter.padding) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.key-size') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.keySize, dataBefore.keySize) }">
            {{ valOrNA(dataAfter.keySize) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.kek.status') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.status, dataBefore.status) }">
            {{ getOptionsByValue(dataAfter.status, kekStatusOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getIssuerOptionsByValue, getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { encDataTypeOptionSelect, kekStatusOptionSelect } from '@/utils/select/kek'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
