<template>
  <div class="header-title">{{ $t('ui.trans.log-otp.message') }}</div>
  <div class="content-box p-3">
    <table class="table table-striped table-hover">
      <thead>
        <tr class="text-bg-primary">
          <th class="text-nowrap">{{ $t('ui.trans.otp.message.channel') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.otp.message.receiver') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.otp.message.status') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.otp.message.issueCounter') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.otp.message.issuerDateTime') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.otp.message.createDateTime') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.otp.message.passCode') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.otp.message.verificationCodeStatus') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>
            <template v-if="item.channel == '1'">{{ $t('ui.issuer-param.sms-otp') }}</template>
            <template v-else-if="item.channel == '2'">WeChat</template>
            <template v-else-if="item.channel == '3'">{{ $t('ui.cardholder-data.email') }}</template>
          </td>
          <td>{{ item.receiver }}</td>
          <td>
            <template v-if="item.status == 1">{{ $t('ui.operation-log.result.0') }}</template>
            <template v-if="item.status == 0 && item.verificationCodeStatus">{{
              $t('ui.operation-log.result.1')
            }}</template>
          </td>
          <td>{{ item.issueCounter }}</td>
          <td>{{ dateFormat(item.issuerDateTime, 'yyyy-MM-dd HH:mm:ss', userTz()) }}</td>
          <td>{{ dateFormat(item.createDateTime, 'yyyy-MM-dd HH:mm:ss', userTz()) }}</td>
          <td>{{ item.passCode }}</td>
          <td>
            <span v-if="item.verificationCodeStatus">{{
              $t('ui.trans.log.otp.verificationCodeStatus.' + item.verificationCodeStatus)
            }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { dateFormat } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import { DateTime } from 'luxon'

const userState = userStateStore()
const userTz = () => userState.user?.timeZone || DateTime.local().zoneName

defineProps<{
  data: Record<string, any>
}>()
</script>
