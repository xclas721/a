<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ computedTitle }}</h5>
          <button
            type="button"
            class="btn-close"
            data-coreui-dismiss="modal"
            aria-label="Close"
            @click="goBack"
          ></button>
        </div>
        <div class="modal-body">
          <div class="p-3">
            <div class="rounded m-0 t-16 row">
              <h3>{{ $t('ui.issuer-user-reconfirm-privilege') }}</h3>
              <hr />

              <div v-if="title == 'DETAIL'">
                <div class="border border-light-subtle">
                  <div class="header-title">
                    {{ $t('ui.issuer-user-reconfirm-privilege.data') }}
                  </div>
                  <div class="content-box p-3">
                    <div class="row mb-3">
                      <div class="col-md-4">
                        <span class="form-label d-block"
                          >{{ $t('ui.issuer-user-reconfirm-privilege.account') }}({{
                            $t('ui.issuer-user-reconfirm-privilege.user-name')
                          }})</span
                        >
                        <span class="span-control">{{ formData.entity.account }}({{ formData.entity.userName }})</span>
                        <hr style="margin: 1% 0" />
                      </div>
                      <div class="col-md-4">
                        <span class="form-label d-block">{{ $t('ui.issuer-user-reconfirm-privilege.group') }}</span>
                        <span class="span-control">{{
                          getOptionsByValue(formData.entity.adminGroupOid, groupArrayData)
                        }}</span>
                        <hr style="margin: 1% 0" />
                      </div>
                      <div class="col-md-4">
                        <span class="form-label d-block">{{
                          $t('ui.issuer-user-reconfirm-privilege.department')
                        }}</span>
                        <span class="span-control">{{ formData.entity.department }}</span>
                        <hr style="margin: 1% 0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="formData.functions && formData.functions.length != 0">
                <div v-for="(menuList, index) in formData.functions" :key="index">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <td style="width: 60%">
                          <div class="ft-15 font-weight-bold">
                            <b>{{ $t(formData.modules[index].i18nCode) }}</b>
                          </div>
                        </td>
                        <td>
                          <div class="ft-15 font-weight-bold">
                            {{ $t('ui.issuer-user-reconfirm-privilege.allow-query') }}
                          </div>
                        </td>
                        <td>
                          <div class="ft-15 font-weight-bold">
                            {{ $t('ui.issuer-user-reconfirm-privilege.allow-confirm') }}
                          </div>
                        </td>
                        <td>
                          <div class="ft-15 font-weight-bold">
                            {{ $t('ui.issuer-user-reconfirm-privilege.allow-confirm-by-self') }}
                          </div>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="menu in menuList" :key="menu">
                        <td class="ft-15" style="vertical-align: middle">
                          <div>
                            <span>{{ $t(menu.i18nCode) }}</span>
                          </div>
                        </td>
                        <!-- Query Permission -->
                        <td>
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                              :value="menu.accessId"
                              v-model="formDateSubmit.accessIdsQuery"
                              @change="handleChange('query')"
                              :disabled="title == 'DETAIL'"
                            />
                          </div>
                        </td>

                        <!-- Confirm Permission -->
                        <td>
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                              :value="menu.accessId"
                              v-model="formDateSubmit.accessIdsConfirm"
                              :disabled="!formDateSubmit.accessIdsQuery.includes(menu.accessId) || title == 'DETAIL'"
                              @change="handleChange('confirm')"
                            />
                          </div>
                        </td>

                        <!-- Self-set Self-review Permission -->
                        <td>
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                              :value="menu.accessId"
                              v-model="formDateSubmit.accessIdsConfirmBySelf"
                              :disabled="!formDateSubmit.accessIdsConfirm.includes(menu.accessId) || title == 'DETAIL'"
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-else class="mt-2">
                <h3>
                  <span class="ms-5 d-flex justify-content-center align-items-center">{{
                    $t('ui.issuer-user-reconfirm-privilege.message.no-function-reconfirm')
                  }}</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div class="form-footer-buttons mt-2 mb-5" v-if="title != 'DETAIL' && hasFunctions">
          <div class="d-flex justify-content-between align-items-center gap-2 w-100">
            <div class="d-flex gap-2">
              <FormButton
                noWrapper
                label="btn.reset"
                type="button"
                variant="primary"
                appearance="outlined"
                @click="resetFormBtn"
              />
            </div>
            <div class="d-flex gap-2">
              <FormButton noWrapper label="btn.cancel" type="button" variant="secondary" @click="goBack" />
              <FormButton noWrapper label="btn.save" type="submit" variant="primary" @click="submit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import FormButton from '@/components/formTable/FormButton.vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { conventTitle, getOptionsByValue } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'

const { t } = useI18n()

// Props
const props = defineProps<{
  title: string
  formData: Record<string, any>
  groupArrayData: BaseSelect[]
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

// Check if there is functional data to display
const hasFunctions = computed(() => {
  return props.formData.functions && props.formData.functions.length > 0
})

// Methods
function show() {
  showFlag.value = true
  nextTick(() => {
    if (maskSpace.value) {
      maskSpace.value.scrollTop = 0
    }
  })
  valida.value = true

  // Disable homepage scrollbar
  disablePageScroll()
}

function hide() {
  showFlag.value = false
}

// Emit the search event
const emit = defineEmits(['submit', 'goBack'])

// Define the form object dynamically based on formConfig
const formDateSubmit = reactive<Record<string, any>>({
  accessIdsQuery: [],
  accessIdsConfirm: [],
  accessIdsConfirmBySelf: []
})

for (const formDateKey in formDateSubmit) {
  formDateSubmit[formDateKey] = props.formData[formDateKey]
}
/**
 * Linkage effect, select query first then review etc.
 * @param type type
 */
const handleChange = (type: string) => {
  if (type === 'query') {
    // If query permission is canceled, clear related permissions
    formDateSubmit.accessIdsConfirm = formDateSubmit.accessIdsConfirm.filter((id: string) =>
      formDateSubmit.accessIdsQuery.includes(id)
    )
    formDateSubmit.accessIdsConfirmBySelf = formDateSubmit.accessIdsConfirmBySelf.filter((id: string) =>
      formDateSubmit.accessIdsConfirm.includes(id)
    )
  } else if (type === 'confirm') {
    // If confirm permission is canceled, clear self-set self-review permission
    formDateSubmit.accessIdsConfirmBySelf = formDateSubmit.accessIdsConfirmBySelf.filter((id: string) =>
      formDateSubmit.accessIdsConfirm.includes(id)
    )
  }
}
const resetForm = () => {
  formDateSubmit.oid = ''
  formDateSubmit.accessIdsQuery = []
  formDateSubmit.accessIdsConfirm = []
  formDateSubmit.accessIdsConfirmBySelf = []
}
const resetFormBtn = () => {
  if (props.title === 'UPDATE') {
    // Save current OID
    const currentOid = formDateSubmit.oid

    // Reset all fields
    for (const formDateKey in formDateSubmit) {
      formDateSubmit[formDateKey] = props.formData[formDateKey]
    }

    // Restore OID
    formDateSubmit.oid = currentOid
  } else {
    formDateSubmit.accessIdsQuery = []
    formDateSubmit.accessIdsConfirm = []
    formDateSubmit.accessIdsConfirmBySelf = []
  }
}
watch(
  () => props.formData,
  (newData) => {
    if (newData) {
      if (newData.entity) {
        formDateSubmit.oid = newData.entity.oid
      }
      formDateSubmit.accessIdsQuery = newData.accessIdsQuery
      formDateSubmit.accessIdsConfirm = newData.accessIdsConfirm
      formDateSubmit.accessIdsConfirmBySelf = newData.accessIdsConfirmBySelf
    }
  },
  { immediate: true }
)

const appStore = useAppStore()
watch(
  () => props.title,
  (newData) => {
    if (newData) {
      const title = conventTitle(newData)
      appStore.toggleFormTitle(t(title))
    }
  },
  { immediate: true }
)
const goBack = () => {
  // Enable homepage scrollbar
  enablePageScroll()
  resetForm()
  emit('goBack', { ...formDateSubmit })
}
// Used for formInput component validation. When closing window and model becomes empty, error msg appears. Add this field: set to true (validate) when opening form, set to false (no validation) when closing form.
const valida = ref(true)
const submit = () => {
  const validation = true

  if (validation) {
    // Enable homepage scrollbar
    enablePageScroll()
    emit('submit', { ...formDateSubmit })
    valida.value = false
  }
}

// Use computed to create dynamic title
const computedTitle = computed(() => {
  return t(conventTitle(props.title))
})

// Disable page scrolling
function disablePageScroll() {
  document.body.style.overflow = 'hidden'
}

// Allow page scrolling
function enablePageScroll() {
  document.body.style.overflow = ''
  appStore.toggleFormTitle('')
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.modal-dialog {
  max-width: 80%;
  margin: 7rem auto;
}
</style>
