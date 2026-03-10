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
          <div class="header-title">{{ $t('ui.operation-log.log') }}</div>
          <div class="content-box p-3">
            <div class="row mb-3">
              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.operation-log.op-start-date') }}</span>
                <span class="span-control">{{ valOrNA(detailData.operationDataTime) }}</span>
                <hr />
              </div>

              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.operation-log.issuer') }}</span>
                <span class="span-control">{{ getOptionsByValue(detailData.dataIssuerOid, issuerOptions) }}</span>
                <hr />
              </div>

              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.operation-log.account') }}</span>
                <span class="span-control">{{ valOrNA(detailData.account) }}({{ valOrNA(detailData.userName) }})</span>
                <hr />
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.operation-log.source') }}</span>
                <span class="span-control">{{ valOrNA(detailData.ipAddr) }}</span>
                <hr />
              </div>

              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.operation-log.function') }}</span>
                <span class="span-control">{{ getOptionsByValue(detailData.accessId, menuConfig) }}</span>
                <hr />
              </div>

              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.operation-log.target-object') }}</span>
                <span class="span-control text-break">{{ valOrNA(detailData.targetObject) }}</span>
                <hr />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.operation-log.action') }}</span>
                <span class="span-control">{{ getOptionsByValue(detailData.action, actionOptionSelect) }}</span>
                <hr />
              </div>

              <div class="col-md-4">
                <span class="form-label d-block">{{ $t('ui.operation-log.result') }}</span>
                <span class="span-control">{{ getOptionsByValue(detailData.result, actionResultOptionSelect) }}</span>
                <hr />
              </div>
            </div>
          </div>

          <div v-if="detailData.action == 'Q'">
            <!-- Query Criteria -->
            <component
              :is="loadDynamicComponent(detailData.accessId, 'Q')"
              :data="detailData.dataQuery ?? {}"
              :scheme-options="schemeOptions"
              :issuer-options="issuers"
              :menu-config="menuConfig"
            />
          </div>

          <!-- Add -->
          <div class="mt-3" v-if="detailData.action == 'A' || detailData.action == 'I'">
            <div class="row mt-3">
              <div class="col-md-12">
                <!-- After change -->
                <div class="header-title-after">{{ $t('ui.operation-log.data-after') }}</div>
                <div class="content-box-after p-3">
                  <div v-if="!detailData.dataAfter">
                    <div class="row">
                      <div class="col-md-12">{{ $t('warn.data-not-found') }}</div>
                    </div>
                  </div>
                  <div class="p-3" v-else>
                    <!-- Dynamically load component -->
                    <component
                      :is="loadDynamicComponent(detailData.accessId, 'A')"
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
          </div>

          <!-- Modify -->
          <div class="mt-3" v-if="detailData.action == 'E' || detailData.action == 'AP' || detailData.action == 'RJ'">
            <div class="row mt-3">
              <div class="col-md-6">
                <!-- Before change -->
                <div class="header-title-before">{{ $t('ui.operation-log.data-before') }}</div>
                <div class="content-box-before p-3">
                  <div v-if="!detailData.dataBefore">
                    <div class="row">
                      <div class="col-md-12">{{ $t('warn.data-not-found') }}</div>
                    </div>
                  </div>
                  <div class="p-3" v-else>
                    <!-- Dynamically load component -->
                    <component
                      :is="loadDynamicComponent(detailData.accessId, 'B')"
                      :detailData="detailData"
                      :dataBefore="detailData.dataBefore ?? {}"
                      :dataAfter="detailData.dataAfter ?? {}"
                      :scheme-options="schemeOptions"
                      :issuer-options="issuers"
                      :menu-config="menuConfig"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <!-- After change -->
                <div class="header-title-after">{{ $t('ui.operation-log.data-after') }}</div>
                <div class="content-box-after p-3">
                  <div v-if="!detailData.dataAfter">
                    <div class="row">
                      <div class="col-md-12">{{ $t('warn.data-not-found') }}</div>
                    </div>
                  </div>
                  <div class="p-3" v-else>
                    <!-- Dynamically load component -->
                    <component
                      :is="loadDynamicComponent(detailData.accessId, 'A')"
                      :detailData="detailData"
                      :dataBefore="detailData.dataBefore ?? {}"
                      :dataAfter="detailData.dataAfter ?? {}"
                      :scheme-options="schemeOptions"
                      :issuer-options="issuers"
                      :menu-config="menuConfig"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Delete -->
          <div class="mt-3" v-if="detailData.action == 'D' || detailData.action == 'O'">
            <div class="row mt-3">
              <div class="col-md-12">
                <!-- After change -->
                <div class="header-title-before">{{ $t('ui.operation-log.data-before') }}</div>
                <div class="content-box-before p-3">
                  <div v-if="!detailData.dataBefore">
                    <div class="row">
                      <div class="col-md-12">{{ $t('warn.data-not-found') }}</div>
                    </div>
                  </div>
                  <div class="p-3" v-else>
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
          </div>
          <div class="d-flex justify-content-end">
            <UtilityButton
              label="btn.close"
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
import { type BaseI18nSelect, type BaseSelect, optionSelect1 } from '@/utils/select/baseSelect'

const props = defineProps<{
  detailData: Record<string, any>
  modelValue: boolean
  menuConfig?: BaseI18nSelect[]
  title?: string
}>()
const emit = defineEmits(['update:modelValue'])
const showFlag = ref(props.modelValue)
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { findByCodeType } from '@/hooks/sysCode'
import { getOptionsByValue, valOrNA } from '@/utils/util'
import { actionOptionSelect, actionResultOptionSelect } from '@/utils/select/operation'
import { findAllIssuer } from '@/hooks/issuer'
import { useAppStore } from '@/stores/app'
import UtilityButton from '@/components/UtilityButton.vue'

const appStore = useAppStore()

const getOperationLogModules = () => {
  const baseModules = import.meta.glob('@/views/common/system/operation_log/**/*.vue')

  const organModules =
    appStore.organ === 'issuer'
      ? import.meta.glob('@/views/issuer/system/operation_log/**/*.vue')
      : import.meta.glob('@/views/hosted/system/operation_log/**/*.vue')

  return { ...baseModules, ...organModules }
}

const modules = getOperationLogModules()

const loadDynamicComponent = (accessId: string, action: string) => {
  // Try all possible paths
  const possiblePaths = [
    `/src/views/common/system/operation_log/${accessId}/${accessId}_${action}.vue`,
    `/src/views/issuer/system/operation_log/${accessId}/${accessId}_${action}.vue`,
    `/src/views/hosted/system/operation_log/${accessId}/${accessId}_${action}.vue`
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
const schemeOptions = ref<BaseI18nSelect[]>([])
const issuerOptions = ref<BaseSelect[]>([])
const issuers = ref<any>([...optionSelect1, ...issuerOptions.value])
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
