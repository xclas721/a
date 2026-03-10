<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.function-name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.accessId, dataBefore.accessId) }">
            {{ getOptionsByValue(dataAfter.accessId, menuConfig) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.action') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.action, dataBefore.action) }">
            {{ getOptionsByValue(dataAfter.action, actionOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.apply-user-name') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.applyUserName, dataBefore.applyUserName)
            }"
          >
            {{ valOrNA(dataAfter.applyUserName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.apply-account') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.applyAccount, dataBefore.applyAccount) }">
            {{ valOrNA(dataAfter.applyAccount) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.apply-datetime') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.createDateTime, dataBefore.createDateTime)
            }"
          >
            {{ dateFormat(dataAfter.createDateTime, 'yyyy-MM-dd HH:mm:ss', userTz()) ?? 'N/A' }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.confirm-user-name') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.confirmUserName, dataBefore.confirmUserName)
            }"
          >
            {{ valOrNA(dataAfter.confirmUserName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.confirm-account') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.confirmAccount, dataBefore.confirmAccount)
            }"
          >
            {{ valOrNA(dataAfter.confirmAccount) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.confirm-datetime') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.confirmDateTime, dataBefore.confirmDateTime)
            }"
          >
            {{ dateFormat(dataAfter.confirmDateTime, 'yyyy-MM-dd HH:mm:ss', userTz()) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.reconfirm.status') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.status, dataBefore.status) }">
            {{ getOptionsByValue(dataAfter.status, reconfirmStatusOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { dateFormat, getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import { DateTime } from 'luxon'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import { reconfirmStatusOptionSelect } from '@/utils/select/reconfirm'
import { actionOptionSelect } from '@/utils/select/operation'

const userTz = () => userStateStore().user?.timeZone || DateTime.local().zoneName

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
  menuConfig?: BaseI18nSelect[]
}>()
</script>
