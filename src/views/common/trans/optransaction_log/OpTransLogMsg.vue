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
          <td>{{ dateFormat(msg.createDateTime, 'yyyy-MM-dd HH:mm:ss:fff') }}</td>
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
import MessageLogsJson from '@/views/common/trans/transaction_log/transDetail/MessageLogsJson.vue'
import UtilityButton from '@/components/UtilityButton.vue'

defineProps<{
  data: Record<string, any>
}>()

const title = ref()
const detailData = ref()
const showMessageJson = ref(false)

const showJson = async (row: Record<string, any>) => {
  console.log(row)
  title.value = row.strType
  detailData.value = row.strData
  showMessageJson.value = true
}
</script>
