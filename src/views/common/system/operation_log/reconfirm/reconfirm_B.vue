<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.function-name') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.accessId, menuConfig) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.action') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.action, actionOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.apply-user-name') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.applyUserName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.apply-account') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.applyAccount) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.apply-datetime') }}</span>
        <p>
          <span>
            {{ dateFormat(dataBefore.createDateTime) ?? 'N/A' }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.confirm-user-name') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.confirmUserName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.confirm-account') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.confirmAccount) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.confirm-datetime') }}</span>
        <p>
          <span>
            {{ dateFormat(dataBefore.confirmDateTime, 'yyyy-MM-dd HH:mm:ss') ?? 'N/A' }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.status') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.status, reconfirmStatusOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { dateFormat, getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import { reconfirmStatusOptionSelect } from '@/utils/select/reconfirm'
import { actionOptionSelect } from '@/utils/select/operation'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
  menuConfig?: BaseI18nSelect[]
}>()
</script>
