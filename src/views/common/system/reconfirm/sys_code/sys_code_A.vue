<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.codeDesc') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.codeDesc, dataBefore.codeDesc) }">
            {{ valOrNA(dataAfter.codeDesc) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.codeId') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.codeId, dataBefore.codeId) }">
            {{ valOrNA(dataAfter.codeId) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.codeType') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.codeType, dataBefore.codeType) }">
            {{ valOrNA(dataAfter.codeType) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.codeTypeDesc') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.codeTypeDesc, dataBefore.codeTypeDesc) }">
            {{ valOrNA(dataAfter.codeTypeDesc) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.codeOrder') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.codeOrder, dataBefore.codeOrder) }">
            {{ valOrNA(dataAfter.codeOrder) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.i18nCode') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.i18nCode, dataBefore.i18nCode) }">
            {{ valOrNA(dataAfter.i18nCode) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
