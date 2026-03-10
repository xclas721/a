<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.codeDesc') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.codeDesc) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.codeId') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.codeId) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.codeType') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.codeType) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.codeTypeDesc') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.codeTypeDesc) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.codeOrder') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.codeOrder) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.sys-code.i18nCode') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.i18nCode) }}
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
