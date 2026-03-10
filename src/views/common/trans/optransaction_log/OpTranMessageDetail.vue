<template>
  <div class="header-title">{{ $t('ui.trans.log-trading.message') }}</div>
  <div class="content-box p-3">
    <!-- Use v-for to generate content for each row, each row contains three fields -->
    <div v-for="(group, index) in groupedFields" :key="index">
      <div class="row mb-3">
        <div
          class="col-md-4"
          v-for="field in group"
          :key="field.label"
          :class="{ 'text-blue': Number(index) === 0 || Number(index) === 1 }"
        >
          <span class="form-label d-block">{{ field.label }}</span>
          <span class="span-control">{{ field.value }}</span>
        </div>
      </div>
      <hr style="margin: 1% 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { dateFormat, getOptionsByValue, valOrNA } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { findByCodeType } from '@/hooks/sysCode'
import type { BaseI18nSelect } from '@/utils/select/baseSelect'
import {
  opCategoryOptionSelect,
  opSeverityOptionSelect,
  opStatusOptionSelect,
  transIdTypeOptionSelect
} from '@/utils/select/opTrans'

const props = defineProps<{
  data: Record<string, any>
}>()

const { t } = useI18n()

const schemeOptions = ref<BaseI18nSelect[]>([])
const fields = ref([
  {
    label: t('ui.card-scheme.name'),
    value: computed(() => getOptionsByValue(props.data.cardScheme, schemeOptions.value))
  },
  {
    label: t('ui.trans.log.basic.ACSTransactionID'),
    value: computed(() => valOrNA(props.data.acsTransId))
  },
  {
    label: t('ui.trans.log.dsInfoes.dsReferenceNumber'),
    value: computed(() => valOrNA(props.data.dsReferenceNumber))
  },
  {
    label: t('ui.trans.log.basic.DSTransactionID'),
    value: computed(() => valOrNA(props.data.dsTransId))
  },
  {
    label: t('ui.trans.log.details.messageVersionNumber'),
    value: computed(() => valOrNA(props.data.messageVersion))
  },
  {
    label: t('optrans.message.basic.category'),
    value: computed(() => getOptionsByValue(props.data.opCategory, opCategoryOptionSelect))
  },
  {
    label: t('optrans.message.basic.opExpDate'),
    value: computed(() => dateFormat(props.data.opExpDateTime, 'yyyy-MM-dd'))
  },
  {
    label: t('optrans.message.basic.opSeqId'),
    value: computed(() => valOrNA(props.data.opSeqId))
  },
  {
    label: t('optrans.message.basic.opSeqNum'),
    value: computed(() => valOrNA(props.data.opSeqNum))
  },
  {
    label: t('optrans.message.basic.opSeqTotal'),
    value: computed(() => valOrNA(props.data.opSeqTotal))
  },
  {
    label: t('optrans.message.basic.severity'),
    value: computed(() => getOptionsByValue(props.data.opSeverity, opSeverityOptionSelect))
  },
  {
    label: t('optrans.message.basic.opStatus'),
    value: computed(() => getOptionsByValue(props.data.opStatus, opStatusOptionSelect))
  },
  {
    label: t('optrans.message.basic.reference'),
    value: computed(() => valOrNA(props.data.referenceNumber))
  },
  {
    label: t('optrans.message.basic.previous.trans.reference'),
    value: computed(() => getOptionsByValue(props.data.priorTransIdType, transIdTypeOptionSelect))
  },
  {
    label: t('optrans.message.basic.previous.trans.id'),
    value: computed(() => valOrNA(props.data.priorTransId))
  }
])
onMounted(async () => {
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
})
// Split fields array into groups of three
const groupedFields: Record<string, any> = []
for (let i = 0; i < fields.value.length; i += 3) {
  groupedFields.push(fields.value.slice(i, i + 3))
}
</script>
