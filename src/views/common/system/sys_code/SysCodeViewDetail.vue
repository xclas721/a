<template>
  <!--CardBin Settings-->
  <h3>
    {{ $t('ui.sys-code') }}
  </h3>
  <div class="rounded m-0 t-16 row">
    <div v-for="(field, index) in formConfig" :key="index" :class="itemClass">
      <div class="order-0 mb-2">
        <component
          :is="getComponentType(field.type)"
          :ID="field.ID"
          :LabelVal="field.label"
          :type="field.type"
          v-model="formDate[field.model]"
          :invalids="field.invalids"
          :required="field.required"
          :readOnly="field.readOnly"
          v-bind="field.props"
          :validation="valida"
          @update:invalids="(newInvalids: boolean) => (field.invalids = newInvalids)"
        />
      </div>
    </div>
  </div>
  <div class="form-footer-buttons mt-2 mb-5">
    <div class="d-flex justify-content-between align-items-center gap-2 w-100">
      <div class="d-flex gap-2">
        <FormButton
          v-if="title != 'DETAIL'"
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
        <FormButton
          v-if="title != 'DETAIL'"
          noWrapper
          label="btn.save"
          type="submit"
          variant="primary"
          @click="submit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import FormInput from '@/components/formTable/FormInput.vue'
import FormButton from '@/components/formTable/FormButton.vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import router from '@/router'
import { type BaseSelect, type BaseI18nSelect, optionSelect } from '@/utils/select/baseSelect'
import { cardTypeOptions, cupSupportIndOptions, enableORDisableOptions } from '@/utils/select/cardBin'
import { userStateStore } from '@/stores/user'
import ApiUtil from '@/utils/apiUtils'
import { findByCodeType } from '@/hooks/sysCode'
import { findAllIssuer } from '@/hooks/issuer'
import { readOnlyALLSet } from '@/utils/util'
import swalMessage from '@/plugins/swalMessage'
import FormFile from '@/components/formTable/FormImgFile.vue'

const userState = userStateStore()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const { t } = useI18n()

export interface FormField {
  type: 'text' | 'checkbox' | 'file'
  label: string
  ID: string
  model: string
  required: boolean
  readOnly: boolean
  default?: string | File | object | null
  invalids?: boolean
  props?: Record<string, any>
}

const route = useRoute()

const colMd = ref('6')
const itemClass = computed(() => {
  let className = 'col-md-'
  className += colMd.value ? colMd.value : '6'
  return className
})

// Define the form object dynamically based on formConfig
const formDate = reactive<Record<string, any>>({})
const getComponentType = (type: string) => {
  if (type == 'file') {
    return FormFile
  } else {
    return FormInput
  }
}
const resetForm = () => {
  for (const field of formConfig.value) {
    field.invalids = false
    formDate[field.model] = field.default
    valida.value = false
  }
}
const resetFormBtn = async () => {
  if (title === 'UPDATE') {
    const result = await apiUtil.get('/cardBin/detail', { oid: route.params.id }, {}, true)
    if (result.success && result.data != null) {
      for (const key of Object.keys(result.data)) {
        formDate[key] = result.data[key]
      }
    }
  } else {
    for (const field of formConfig.value) {
      formDate[field.model] = field.default
    }
  }
}

const goBack = async () => {
  try {
    resetForm()
    await router.push('/system/sys_code')
  } catch (error) {
    console.error('Failed to navigate:', error)
  }
}
const valida = ref(true)
const submit = async () => {
  let validation = true
  //check form
  for (const field of formConfig.value) {
    field.invalids = false
    if (field.required) {
      if (!formDate[field.model] || formDate[field.model] === '') {
        field.invalids = true
        validation = false
      }
    }
  }
  if (validation) {
    valida.value = false

    if (title == 'ADD') {
      const result = await apiUtil.post('/cardBin/add', formDate, { 'content-type': 'multipart/form-data' }, true)
      if (result.success && result.data != null) {
        await swalMessage.success(t('ui.message.add.success'))
        await goBack()
      } else {
        await swalMessage.error(result.message)
        return
      }
    } else if (title == 'UPDATE') {
      const result = await apiUtil.post('/cardBin/edit', formDate, { 'content-type': 'multipart/form-data' }, true)
      if (result.success && result.data != null) {
        await swalMessage.success(t('ui.successfully.modified'))
        await goBack()
      } else {
        await swalMessage.error(result.message)
        return
      }
    }
  }
}
const title = route.params.title
onMounted(async () => {
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
  issuerOptions.value = await findAllIssuer()

  for (const field of formConfig.value) {
    field.invalids = false
    formDate[field.model] = field.default
  }
  if (title === 'DETAIL' || title === 'UPDATE') {
    if (title === 'DETAIL') {
      readOnlyALLSet(formConfig, true, ['issuerOid'])
    }
    const result = await apiUtil.get('/cardBin/detail', { oid: route.params.id }, {}, true)
    if (result.success && result.data != null) {
      for (const key of Object.keys(result.data)) {
        formDate[key] = result.data[key]
      }
    }
  }
})
const schemeOptions = ref<BaseI18nSelect[]>([])

const issuerOptions = ref<BaseSelect[]>([])
//options setting
const cardSchemeOptions = computed(() => [...optionSelect, ...schemeOptions.value])
const cardTypeModelOptions = computed(() => [...optionSelect, ...cardTypeOptions])
const decAuthIndOptions = computed(() => [...optionSelect, ...enableORDisableOptions])
const merWhiteListIndIndOptions = computed(() => [...optionSelect, ...enableORDisableOptions])
const cupSupportIndModelOptions = computed(() => [...optionSelect, ...cupSupportIndOptions])

const formConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    ID: 'issuerOid',
    readOnly: true,
    required: true,
    props: {
      options: issuerOptions
    }
  },
  {
    type: 'checkbox',
    label: 'ui.card-scheme.name',
    model: 'cardScheme',
    default: '',
    ID: 'cardScheme',
    readOnly: false,
    required: true,
    props: {
      options: cardSchemeOptions
    }
  },
  {
    type: 'checkbox',
    label: 'ui.card-bin.type',
    model: 'cardType',
    default: '',
    ID: 'cardType',
    readOnly: false,
    required: true,
    props: {
      options: cardTypeModelOptions
    }
  },
  {
    type: 'text',
    label: 'ui.card-bin.start-bin',
    model: 'binBegin',
    default: '',
    ID: 'binBegin',
    readOnly: false,
    required: true,
    props: {}
  },
  {
    type: 'text',
    label: 'ui.card-bin.end-bin',
    model: 'binEnd',
    default: '',
    ID: 'binEnd',
    readOnly: false,
    required: true,
    props: {}
  },
  {
    type: 'checkbox',
    label: 'ui.card-bin.criteriaDecAuthInd',
    model: 'decAuthInd',
    default: '',
    ID: 'decAuthInd',
    readOnly: false,
    required: true,
    props: {
      options: decAuthIndOptions
    }
  },
  {
    type: 'checkbox',
    label: 'ui.card-bin.criteriaMerWhiteListInd',
    model: 'merWhiteListInd',
    default: '',
    ID: 'merWhiteListInd',
    readOnly: false,
    required: true,
    props: {
      options: merWhiteListIndIndOptions
    }
  },
  {
    type: 'checkbox',
    label: 'ui.card-bin.cupSupportInd',
    model: 'cupSupportInd',
    default: '',
    ID: 'cupSupportInd',
    readOnly: false,
    required: true,
    props: {
      options: cupSupportIndModelOptions
    }
  },
  {
    type: 'file',
    label: 'ui.card-bin.spc-icon-img',
    model: 'spcIconImg',
    default: null,
    ID: 'spcIconImg',
    readOnly: false,
    required: true,
    props: {}
  }
])
</script>

<style scoped></style>
