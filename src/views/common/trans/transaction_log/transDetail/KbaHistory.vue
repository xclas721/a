<template>
  <div class="header-title">{{ $t('ui.trans.kba.history') }}</div>
  <div class="content-box p-3">
    <table class="table table-striped table-hover">
      <thead>
        <tr class="text-bg-primary">
          <th class="text-nowrap">{{ $t('ui.trans.kba.questionId') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.kba.question') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.kba.answer') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.kba.status') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.kba.questionDatetime') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.kba.answerDatetime') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.kba.adapterRtncode') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.kba.adapterRtncodeDesc') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{ item.questionId }}</td>
          <td>{{ item.question }}</td>
          <td>
            {{ item.answer }}
          </td>
          <td>{{ item.status ? $t('ui.trans.kba.status.' + item.status) : '' }}</td>
          <td>{{ dateFormat(item.createDateTime, 'yyyy-MM-dd HH:mm:ss', userTz()) }}</td>
          <td>{{ dateFormat(item.updateDateTime, 'yyyy-MM-dd HH:mm:ss', userTz()) }}</td>
          <td>{{ item.rtnCode ? $t('ui.trans.kba.rtnCode.' + item.rtnCode) : '' }} ({{ item.rtnCode }})</td>
          <td>
            {{ item.rtnCodeDesc }}
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
