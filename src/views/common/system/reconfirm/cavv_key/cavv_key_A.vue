<template>
  <div class="row text-break">
    <!-- After change -->
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
        <span class="form-label d-block">{{ $t('ui.card-scheme.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.cardScheme, dataBefore.cardScheme) }">
            {{ getOptionsByValue(dataAfter.cardScheme, schemeOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cavv-key.key-apart') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.keyApart, dataBefore.keyApart) }">
            {{ valOrNA(dataAfter.keyApart) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cavv-key.key-bpart') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.keyBpart, dataBefore.keyBpart) }">
            {{ valOrNA(dataAfter.keyBpart) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
