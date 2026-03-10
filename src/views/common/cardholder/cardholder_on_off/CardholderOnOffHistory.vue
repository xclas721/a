<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ $t('ui.cardholder-status-on-off') }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-coreui-dismiss="modal"
            aria-label="Close"
            @click="goBack"
          ></button>
        </div>
        <div class="modal-body">
          <DataTable
            ref="tableRef"
            :title="$t('ui.cardholder-status-on-off')"
            :columns="searchResultsHeader"
            :fetchData="fetchUserData"
            :operation-btn-detail="false"
            :operation-btn-update="false"
            :operation-btn-delete="false"
            :page-hide="true"
          />
        </div>
        <div class="row mt-2">
          <div class="col-md-12">
            <button type="button" @click="goBack" class="m-1 btn btn-secondary float-end">
              <span class="mx-2">{{ $t('btn.cancel') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import {
  enrollStatusOptionSelect,
  lockOperationOptionSelect,
  threedsStatusOptionSelect
} from '@/utils/select/cardholder'

const props = defineProps<{
  historyData: Record<string, any>[]
  issuerData: Record<string, any>[]
  schemeOptions: Record<string, any>[]
}>()
// Data
const showFlag = ref(false)
const opacity = ref(0.7)
// Refs
const maskSpace = ref()

// Computed
const dispalyCss = computed(() => {
  return showFlag.value
    ? `display:block;background:rgba(0,0,0,${opacity.value});`
    : `display:none;background:rgba(0,0,0,${opacity.value});`
})
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
// Methods
async function show() {
  await nextTick(async () => {
    if (maskSpace.value) {
      maskSpace.value.scrollTop = 0
      if (tableRef.value) {
        await tableRef.value.fetchPageData()
      }
    }
  })
  // Disable homepage scrollbar
  disablePageScroll()
  showFlag.value = true
}

function hide() {
  showFlag.value = false
}
const goBack = () => {
  // Enable homepage scrollbar
  enablePageScroll()
  emit('goBack', {})
}
// Emit the search event
const emit = defineEmits(['goBack'])
/**
 * Pagination query function
 * @param page
 */
const fetchUserData = async () => {
  return {
    data: props.historyData,
    totalItems: props.historyData.length
  }
}
// Disable page scrolling
function disablePageScroll() {
  document.body.style.overflow = 'hidden'
}

// Allow page scrolling
function enablePageScroll() {
  document.body.style.overflow = ''
}
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...props.issuerData])
  },
  {
    header: 'ui.card-scheme.name',
    field: 'cardScheme',
    colOptions: computed(() => [...props.schemeOptions])
  },
  { header: 'ui.cardholder-data.name', field: 'cnName' },
  {
    header: 'ui.cardholder-data.idno',
    field: 'idno'
  },
  {
    header: 'ui.card-data.pan',
    field: 'acctNumber'
  },
  {
    header: 'ui.card-data.enroll-status',
    field: 'enrollStatus',
    colOptions: enrollStatusOptionSelect
  },
  {
    header: 'ui.cardholder-status.operation',
    field: 'lockOperation',
    colOptions: lockOperationOptionSelect
  },
  {
    header: 'ui.card-data.threeds-status',
    field: 'threedsStatus',
    colOptions: threedsStatusOptionSelect
  },
  {
    header: 'ui.cavv-key.modify-time',
    field: 'createDateTime',
    dateFormat: 'yyyy-MM-dd HH:mm:ss'
  }
])
defineExpose({
  show,
  hide
})
</script>

<style scoped>
.modal-dialog {
  max-width: 60%;
  margin: 7rem auto;
}
</style>
