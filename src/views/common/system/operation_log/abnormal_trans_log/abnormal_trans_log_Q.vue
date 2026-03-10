<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.log.start.date') }}</span>
          <p>
            <span>{{ valOrNA(data.startDate) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.log.end.date') }}</span>
          <p>
            <span>{{ valOrNA(data.endDate) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.card-scheme.name') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaCardScheme, schemeOptions) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('message.version') }}</span>
          <p>
            <span>{{ valOrNA(data.messageVersion) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('device.channel') }}</span>
          <p>
            <span>{{ valOrNA(data.deviceChannel) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('acs.trans.id') }}</span>
          <p>
            <span>{{ valOrNA(data.acsTransID) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('3ds.server.trans.id') }}</span>
          <p>
            <span>{{ valOrNA(data.threeDSServerTransID) }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.log.acct.id') }}</span>
          <p>
            <span>{{ valOrNA(data.acctId) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.log.acct.number.prefix') }}</span>
          <p>
            <span>{{ valOrNA(data.acctNumberPrefix) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.log.acct.number.postfix') }}</span>
          <p>
            <span>{{ valOrNA(data.acctNumberPostfix) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.log.acquirer.merchant.id') }}</span>
          <p>
            <span>{{ valOrNA(data.acquirerMerchantID) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.trans.messageCategory') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.messageCategory, messageCategoryOptionSelect) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseI18nSelect, BaseSelect } from '@/utils/select/baseSelect'
import { messageCategoryOptionSelect } from '@/utils/select/challengeUi'
import { onMounted, ref } from 'vue'
import { findByCodeType } from '@/hooks/sysCode'

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()

const transStatusReasonOptionSelect = ref<BaseI18nSelect[]>([])
onMounted(async () => {
  transStatusReasonOptionSelect.value = await findByCodeType('TRANS_STATUS_REASON')
})
</script>
