<template>
  <div class="header-title">{{ $t('ui.trans.log-message.message') }}</div>
  <div class="content-box p-3">
    <table class="table table-striped table-hover">
      <thead>
        <tr class="text-bg-primary">
          <th class="text-nowrap">{{ $t('ui.trans.fido') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.fido.api.processTime') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.fido.api.responseCode') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.fido.api.req') }}</th>
          <th class="text-nowrap">{{ $t('ui.trans.fido.api.res') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(msg, index) in data" :key="index">
          <td>{{ msg.apiCode ? $t('ui.trans.fido.api.' + msg.apiCode) : '' }}</td>
          <td>
            <template v-if="msg.execTime">{{ msg.execTime }} ({{ $t('ui.trans.fido.api.ms') }})</template>
            <template v-else>N/A</template>
          </td>
          <td>
            <template v-if="msg.statusCode"
              >{{ msg.statusCode }} ({{ $t('ui.trans.fido.api.responseCode.' + msg.statusCode) }})
            </template>
            <template v-else>N/A</template>
          </td>
          <td>
            <UtilityButton
              label="ui.trans.log-content.message"
              variant="primary"
              appearance="contained"
              @click="showJson(msg, 'req')"
            />
          </td>
          <td>
            <UtilityButton
              label="ui.trans.log-content.message"
              variant="primary"
              appearance="contained"
              @click="showJson(msg, 'res')"
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
import { ref } from 'vue'
import MessageLogsJson from '@/views/common/trans/transaction_log/transDetail/MessageLogsJson.vue'
import UtilityButton from '@/components/UtilityButton.vue'

defineProps<{
  data: Record<string, any>
}>()

const title = ref('')
const detailData = ref()
const showMessageJson = ref(false)
const showJson = (row: Record<string, any>, type: string) => {
  title.value = type
  if (type == 'req') {
    detailData.value = row.reqData
  } else {
    detailData.value = row.resData
  }
  showMessageJson.value = true
}
</script>
