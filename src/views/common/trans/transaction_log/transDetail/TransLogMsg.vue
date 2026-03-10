<template>
  <div class="header-title">{{ $t('ui.trans.log-message.message') }}</div>
  <div class="content-box p-3">
    <table class="table table-striped table-hover">
      <thead>
        <tr class="text-bg-primary">
          <th class="text-nowrap">{{ $t('ui.trans.log-type.message') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.log-direction.message') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.log-time.message') }}</th>
          <th class="text-nowrap">{{ $t('ui.operation') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(msg, index) in data" :key="index">
          <td>{{ msg.strType }}</td>
          <td>{{ msg.direction == '0' ? 'Incoming' : 'Outgoing' }}</td>
          <td>{{ dateFormat(msg.createDateTime, 'yyyy-MM-dd HH:mm:ss:SSS', userTz()) }}</td>
          <td>
            <UtilityButton
              label="ui.trans.log-content.message"
              variant="primary"
              appearance="contained"
              @click="showJson(msg)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <MessageLogsJson
    :title="title"
    :detail-data="detailData"
    v-model="showMessageJson"
    v-if="showMessageJson"
  ></MessageLogsJson>
</template>
<script setup lang="ts">
import { dateFormat } from '@/utils/util'
import { ref } from 'vue'
import { userStateStore } from '@/stores/user'
import UtilityButton from '@/components/UtilityButton.vue'
import { DateTime } from 'luxon'
import MessageLogsJson from '@/views/common/trans/transaction_log/transDetail/MessageLogsJson.vue'

const userTz = () => userStateStore().user?.timeZone || DateTime.local().zoneName

defineProps<{
  data: Record<string, any>
}>()

const title = ref()
const detailData = ref()
const showMessageJson = ref(false)

const showJson = async (row: Record<string, any>) => {
  title.value = row.strType
  // Is encrypted?
  // if (row.cekAlias) {
  //   const result = await apiUtil.get('/transaction/cipherMessage', { oid: row.oid }, {}, true)
  //   detailData.value = result.data
  // } else {
  detailData.value = row.strData
  // }
  showMessageJson.value = true
}
</script>
