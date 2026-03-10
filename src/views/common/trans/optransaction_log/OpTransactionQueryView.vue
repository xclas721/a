<template>
  <QueryCriteriaComponent :criteriaConfig="userQueryConfig" :title="$t('optrans.log.query')" @search="handleSearch" />
  <!-- Display search results -->
  <OpTransDataTable
    title="$t('optrans.log.query')"
    :scheme-options="schemeOptions"
    :fetchData="fetchUserData"
    :acs-trans-id-action="openDetail"
  />
  <OpDetailDialog v-if="showDetail" v-model="showDetail" :detailData="detailData" :title="$t('optrans.log-detail')" />
</template>
<script setup lang="ts">
import QueryCriteriaComponent, { type CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import { computed, onMounted, ref } from 'vue'
import { type BaseI18nSelect, type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import { findAllIssuer } from '@/hooks/issuer'
import { findByCodeType } from '@/hooks/sysCode'
import { useTimeCalculations } from '@/utils/util'
import { opCategoryOptionSelect, opSeverityOptionSelect, transIdTypeOptionSelect } from '@/utils/select/opTrans'
import ApiUtil from '@/utils/apiUtils'
import swalMessage from '@/plugins/swalMessage'
import OpTransDataTable from '@/views/common/trans/optransaction_log/OpTransDataTable.vue'
import OpDetailDialog from '@/views/common/trans/optransaction_log/OpDetailDialog.vue'
const { getEndDate, getStartDate } = useTimeCalculations()
const schemeOptions = ref<BaseI18nSelect[]>([])
const issuerData = ref<BaseSelect[]>([])
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const showDetail = ref(false)
const detailData = ref({})

// Handle the search criteria emitted by the QueryCriteria component
const handleSearch = (criteria: any) => {
  console.log('Search criteria received:', criteria)

  searchCriteria.value = criteria
}
const searchCriteria = ref<any>({
  endDate: getEndDate,
  startDate: getStartDate
})

// Function to fetch data for the current page
const fetchUserData = async (page: number) => {
  const result = await apiUtil.postSearchPage('/optrans/query', searchCriteria.value, page, {}, true)
  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
const openDetail = async (row: Record<string, any>) => {
  disablePageScroll()
  detailData.value = row
  showDetail.value = true
}
// Disable page scrolling
function disablePageScroll() {
  document.body.style.overflow = 'hidden'
}

const cardSchemeOptions = computed(() => [...optionSelect, ...schemeOptions.value])
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  schemeOptions.value = await findByCodeType('CARD_SCHEME')

  document.body.style.overflow = ''
})
const opCategoryOption = computed(() => [...optionSelect, ...opCategoryOptionSelect])
const opSeverityOption = computed(() => [...optionSelect, ...opSeverityOptionSelect])
const transIdTypeOption = computed(() => [...optionSelect, ...transIdTypeOptionSelect])
const userQueryConfig = ref<CriteriaField[]>([
  {
    // <!-- (2)Transaction start date -->
    type: 'date',
    label: 'ui.trans.log.start.date',
    model: 'startDate',
    default: getStartDate,
    startDateFlag: true,
    props: {
      id: 'startDate'
    }
  },
  {
    // <!-- (3)Transaction end date -->
    type: 'date',
    label: 'ui.trans.log.end.date',
    model: 'endDate',
    default: getEndDate,
    endDateFlag: true,
    props: {
      id: 'endDate'
    }
  },
  // <!-- (4)Card Scheme -->
  {
    type: 'select',
    label: 'ui.card-scheme.name',
    model: 'cardScheme',
    default: '',
    props: {
      // Use computed to switch language
      options: cardSchemeOptions,
      id: 'cardScheme'
    }
  },
  // <!-- (5)Message Type -->
  {
    type: 'select',
    label: 'optrans.message.category',
    model: 'opCategory',
    default: '',
    props: {
      options: opCategoryOption,
      id: 'opCategory'
    }
  },
  //<!-- (6)opSeverity -->
  {
    type: 'select',
    label: 'optrans.message.severity',
    model: 'opSeverity',
    default: '',
    props: {
      options: opSeverityOption,
      id: 'opSeverity'
    }
  },
  {
    // <!-- (7)Message Sequence Number -->
    type: 'text',
    label: 'optrans.message.id',
    model: 'opSeqId',
    default: '',
    props: {
      id: 'opSeqId'
    }
  },
  {
    //<!-- (8)DS Transaction ID -->
    type: 'text',
    label: 'ds.trans.id',
    model: 'dsTransId',
    default: '',
    props: {
      id: 'dsTransId'
    }
  },
  {
    //<!-- (9)ACS Transaction ID -->
    type: 'text',
    label: 'acs.trans.id',
    model: 'acsTransId',
    default: '',
    props: {
      id: 'acsTransId'
    }
  },
  {
    //<!-- (10)Reference Number -->
    type: 'text',
    label: 'optrans.message.trans.reference',
    model: 'referenceNumber',
    default: '',
    props: {
      id: 'referenceNumber'
    }
  },
  {
    // <!-- (11)Previous Transaction Sequence Number -->
    type: 'text',
    label: 'optrans.message.previous.trans.id',
    model: 'priorTransId',
    default: '',
    props: {
      id: 'priorTransId'
    }
  },
  {
    // <!-- (12)Previous Transaction Reference -->
    type: 'select',
    label: 'optrans.message.previous.trans.reference',
    model: 'priorTransIdType',
    default: '',
    props: {
      options: transIdTypeOption,
      id: 'priorTransIdType'
    }
  }
])
</script>
