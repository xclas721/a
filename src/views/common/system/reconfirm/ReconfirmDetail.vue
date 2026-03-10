<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div style="max-width: 80%; margin: 5rem auto">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-coreui-dismiss="modal"
            aria-label="Close"
            @click="closeDialog"
          ></button>
        </div>
        <div class="modal-body">
          <div class="header-title">{{ $t('ui.reconfirm.item-information') }}</div>
          <div class="content-box p-3">
            <div class="row mb-3">
              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.reconfirm.apply-user-name1') }}</span>
                <span class="span-control">{{ valOrNA(detailData.applyUserName) }}</span>
                <hr />
              </div>

              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.reconfirm.apply-account') }}</span>
                <span class="span-control">{{ valOrNA(detailData.applyAccount) }}</span>
                <hr />
              </div>

              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.reconfirm.apply-datetime') }}</span>
                <span class="span-control">{{ valOrNA(detailData.applyDateTime) }}</span>
                <hr />
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.reconfirm.confirm-user-name1') }}</span>
                <span class="span-control">{{ valOrNA(detailData.confirmUserName) }}</span>
                <hr />
              </div>

              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.reconfirm.confirm-account') }}</span>
                <span class="span-control">{{ valOrNA(detailData.confirmAccount) }}</span>
                <hr />
              </div>

              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.reconfirm.confirm-datetime') }}</span>
                <span class="span-control">{{ valOrNA(detailData.confirmDateTime) }}</span>
                <hr />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.reconfirm.function-name') }}</span>
                <span class="span-control">{{ getOptionsByValue(detailData.accessId, menuConfig) }}</span>
                <hr />
              </div>

              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.reconfirm.action') }}</span>
                <span class="span-control">{{
                  getOptionsByValue(detailData.action, reconfirmActionOptionSelect)
                }}</span>
                <hr />
              </div>
              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.reconfirm.status') }}</span>
                <span class="span-control">{{
                  getOptionsByValue(detailData.status, reconfirmStatusOptionSelect)
                }}</span>
                <hr />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.reconfirm.status-description') }}</span>
                <span class="span-control">{{ valOrNA(detailData.statusDescription) }}</span>
                <hr />
              </div>
            </div>
          </div>

          <!-- Add -->
          <div class="mt-3" v-if="detailData.action == 'A' || detailData.action == 'U'">
            <div class="row mt-3">
              <div class="col-md-12">
                <!-- After change -->
                <div class="header-title-after">{{ $t('ui.operation-log.data-after') }}</div>
                <div v-if="!detailData.dataAfter">
                  <div class="row">
                    <div class="col-md-12">{{ $t('warn.data-not-found') }}</div>
                  </div>
                </div>
                <div class="content-box-after p-3" v-else>
                  <!-- Dynamically load component -->
                  <component
                    :is="loadDynamicComponent(detailData.accessId, 'A')"
                    :detailData="detailData ?? {}"
                    :dataBefore="detailData.dataBefore ?? {}"
                    :dataAfter="detailData.dataAfter ?? {}"
                    :scheme-options="schemeOptions"
                    :issuer-options="issuers"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Modify -->
          <div class="mt-3" v-if="detailData.action == 'E' || detailData.action == 'AP' || detailData.action == 'RJ'">
            <div class="row mt-3">
              <div class="col-md-6">
                <!-- Before change -->
                <div class="header-title-before">{{ $t('ui.operation-log.data-before') }}</div>
                <div v-if="!detailData.dataBefore">
                  <div class="row">
                    <div class="col-md-12">{{ $t('warn.data-not-found') }}</div>
                  </div>
                </div>
                <div class="content-box-before p-3" v-else>
                  <!-- Dynamically load component -->
                  <component
                    :is="loadDynamicComponent(detailData.accessId, 'B')"
                    :detailData="detailData ?? {}"
                    :dataBefore="detailData.dataBefore ?? {}"
                    :dataAfter="detailData.dataAfter ?? {}"
                    :scheme-options="schemeOptions"
                    :issuer-options="issuers"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <!-- After change -->
                <div class="header-title-after">{{ $t('ui.operation-log.data-after') }}</div>
                <div v-if="!detailData.dataAfter">
                  <div class="row">
                    <div class="col-md-12">{{ $t('warn.data-not-found') }}</div>
                  </div>
                </div>
                <div class="content-box-after p-3" v-else>
                  <!-- Dynamically load component -->
                  <component
                    :is="loadDynamicComponent(detailData.accessId, 'A')"
                    :detailData="detailData ?? {}"
                    :dataBefore="detailData.dataBefore ?? {}"
                    :dataAfter="detailData.dataAfter ?? {}"
                    :scheme-options="schemeOptions"
                    :issuer-options="issuers"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Delete -->
          <div class="mt-3" v-if="detailData.action == 'D' || detailData.action == 'O'">
            <div class="row mt-3">
              <div class="col-md-12">
                <!-- Before change -->
                <div class="header-title-before">{{ $t('ui.operation-log.data-before') }}</div>
                <div v-if="!detailData.dataBefore">
                  <div class="row">
                    <div class="col-md-12">{{ $t('warn.data-not-found') }}</div>
                  </div>
                </div>
                <div class="content-box-before p-3" v-else>
                  <!-- Dynamically load component -->
                  <component
                    :is="loadDynamicComponent(detailData.accessId, 'B')"
                    :detailData="detailData"
                    :dataBefore="detailData.dataBefore ?? {}"
                    :dataAfter="detailData.dataAfter ?? {}"
                    :scheme-options="schemeOptions"
                    :issuer-options="issuers"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="row mb-3 mt-3"
            v-if="detailData.status == '0' && (detailData.reconfirmPrivilege || detailData.settingReconfirmPrivilege)"
          >
            <div class="col d-flex justify-content-center">
              <UtilityButton
                label="btn.refund"
                variant="secondary"
                appearance="outlined"
                class="col-md-5"
                @click="refundClick"
              />
              <UtilityButton
                label="btn.approve"
                variant="primary"
                appearance="contained"
                class="col-md-5"
                @click="approveClick"
              />
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <UtilityButton
              label="btn.cancel"
              variant="primary"
              appearance="contained"
              class="mt-3"
              @click="closeDialog"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { reconfirmActionOptionSelect, reconfirmStatusOptionSelect } from '@/utils/select/reconfirm'
import { type BaseI18nSelect, type BaseSelect, optionSelect1 } from '@/utils/select/baseSelect'
import { findByCodeType } from '@/hooks/sysCode'
import ApiUtil from '@/utils/apiUtils'
import UtilityButton from '@/components/UtilityButton.vue'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { findAllIssuer } from '@/hooks/issuer'
import { useAppStore } from '@/stores/app'

const props = defineProps<{
  detailData: Record<string, any>
  modelValue: boolean
  title?: string
  menuConfig?: BaseI18nSelect[]
  searchCriteria?: any
}>()

const emit = defineEmits(['update:modelValue', 'refresh'])
const showFlag = ref(props.modelValue)
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const { t } = useI18n()

const appStore = useAppStore()

const getOperationLogModules = () => {
  const baseModules = import.meta.glob('@/views/common/system/reconfirm/**/*.vue')

  const organModules =
    appStore.organ === 'issuer'
      ? import.meta.glob('@/views/issuer/system/reconfirm/**/*.vue')
      : import.meta.glob('@/views/hosted/system/reconfirm/**/*.vue')
  console.log(organModules)
  return { ...baseModules, ...organModules }
}

const modules = getOperationLogModules()

const loadDynamicComponent = (accessId: string, action: string) => {
  // Try all possible paths
  const possiblePaths = [
    `/src/views/common/system/reconfirm/${accessId}/${accessId}_${action}.vue`,
    `/src/views/issuer/system/reconfirm/${accessId}/${accessId}_${action}.vue`,
    `/src/views/hosted/system/reconfirm/${accessId}/${accessId}_${action}.vue`
  ]

  for (const path of possiblePaths) {
    const loader = modules[path]
    if (loader) {
      return defineAsyncComponent(() => loader().then((mod: any) => mod.default))
    }
  }

  console.error('无法加载组件:', accessId, action)
  return null
}

const dispalyCss = computed(() => {
  return showFlag.value ? `display:block;background:rgba(0,0,0,0.7);` : `display:none;background:rgba(0,0,0,0.7);`
})
// Watch modelValue to control showFlag
watch(
  () => props.modelValue,
  (newVal) => {
    showFlag.value = newVal
    if (newVal) {
      disablePageScroll()
    }
  }
)
// Close popup
const closeDialog = () => {
  showFlag.value = false
  emit('update:modelValue', false)
  enablePageScroll()
}
// Approval button
const approveClick = async () => {
  swalMessage.confirm(t('ui.reconfirm.message.alert-approve-data'), '', async function () {
    const result = await apiUtil.post(
      `/${props.detailData.accessId}/approve?oid=${props.detailData['oid']}`,
      {},
      {},
      true
    )
    if (result.success && result.code == '0000') {
      closeDialog()
      // Refresh table
      emit('refresh', { ...props.searchCriteria })
    } else {
      await swalMessage.error(result.message)
    }
  })
}
const refundClick = async () => {
  swalMessage.confirm(t('ui.reconfirm.message.alert-refund-data'), '', async function () {
    const result = await apiUtil.post(
      `/${props.detailData.accessId}/reject?oid=${props.detailData['oid']}`,
      {},
      {},
      true
    )
    if (result.success && result.code == '0000') {
      closeDialog()
      emit('refresh', { ...props.searchCriteria })
    } else {
      await swalMessage.error(result.message)
    }
  })
}
const issuerOptions = ref<BaseSelect[]>([])
const issuers = ref<any>([...optionSelect1, ...issuerOptions.value])
const schemeOptions = ref<BaseI18nSelect[]>([])
onMounted(async () => {
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
  issuerOptions.value = await findAllIssuer()
  issuers.value = [...optionSelect1, ...issuerOptions.value]
})

// Disable page scrolling
function disablePageScroll() {
  document.body.style.overflow = 'hidden'
}

// Allow page scrolling
function enablePageScroll() {
  document.body.style.overflow = ''
}
</script>
<style>
.modal-content {
  border: 0;
}
</style>
