<template>
  <!-- Validation Screen Settings -->
  <QueryCriteriaComponent
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.challenge-ui')"
    @search="handleSearch"
    :customButtons="customButtonList"
  />
  <!-- Display search results -->
  <DataTable
    ref="tableRef"
    :title="$t('ui.challenge-ui')"
    :columns="searchResultsHeader"
    :fetchData="fetchUserData"
    :operation-btn-detail="true"
    :operation-btn-update="true"
    :operation-btn-delete="true"
    @open-detail="openDetail"
    @open-update="openUpdate"
    @delete-row="deleteRow"
  />

  <ChallengeUiFormView
    ref="formMask"
    :form-config="formConfig"
    :title="formTitle"
    @submit="submit"
    @go-back="goBack"
    :form-data-detail="formDetails"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { CriteriaField, CustomButton } from '@/components/query/QueryCriteriaComponent.vue'
import QueryCriteriaComponent from '@/components/query/QueryCriteriaComponent.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { type BaseSelect, defaultOptionSelect, optionSelect, optionSelect1 } from '@/utils/select/baseSelect'
import ApiUtil from '@/utils/apiUtils'
import { type FormField } from '@/components/formTable/FormComponent.vue'
import { readOnlyALLSet, readOnlySet } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import { findAllIssuer } from '@/hooks/issuer'
import swalMessage from '@/plugins/swalMessage'
import { useI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/stores/app'
import { deviceChannelOptionSelect } from '@/utils/select/transStatus'
import {
  challengeInfoTextIndOptionSelect,
  messageCategoryOptionSelect,
  togglePositionIndOptionSelect,
  uiTypeOptionSelect
} from '@/utils/select/challengeUi'
import ChallengeUiFormView from '@/views/common/system/challenge_ui/ChallengeUiFormView.vue'

const appStoreHook = useAppStoreHook()
const { t } = useI18n()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
// Create reference to child component
const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  if (tableRef.value) {
    tableRef.value.currentPage = 1
    await tableRef.value.fetchPageData()
  }
}

const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted'
    ? [...optionSelect, ...defaultOptionSelect, ...issuerData.value]
    : [...defaultOptionSelect, ...issuerData.value]
})

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
const deviceChannelOption = computed(() => [...optionSelect, ...deviceChannelOptionSelect])
const messageCategoryOption = computed(() => [...optionSelect, ...messageCategoryOptionSelect])
const uiTypeOption = computed(() => [...optionSelect, ...uiTypeOptionSelect])
const togglePositionIndOption = computed(() => [...optionSelect, ...togglePositionIndOptionSelect])
const challengeInfoTextIndOption = computed(() => [...optionSelect, ...challengeInfoTextIndOptionSelect])
const issuerData = ref<BaseSelect[]>([])
const form = ref<any>({})
// Breadcrumb
const formTitle = ref('')
const formMask = ref() // Used to store reference to FormComponent
// Define custom buttons
const customButtonList: CustomButton[] = [
  {
    label: 'btn.new',
    type: 'button',
    variant: 'primary',
    action: () => {
      if (formMask.value) {
        formTitle.value = 'ADD'
        readOnlySet(formConfig, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [], true)
        formDetails.value.challengeUis = [
          {
            locale: 'en_US',
            challengeUiSelectInfos: []
          },
          {
            locale: 'zh_TW',
            challengeUiSelectInfos: []
          },
          {
            locale: 'zh_CN',
            challengeUiSelectInfos: []
          }
        ]
        formMask.value.show()
      } else {
        console.error('FormComponent component is not ready yet')
      }
    }
  }
]
/**
 * Pagination query
 * @param page current page
 */
const fetchUserData = async (page: number) => {
  for (const field of userQueryConfig.value) {
    searchCriteria.value[field.model] ??= field.default
  }
  const result = await apiUtil.postSearchPage('/challenge_ui/query', searchCriteria.value, page, {}, true)

  if (!(result.success && result.code == '0000')) {
    await swalMessage.warning(result.message)
  }
  return {
    data: result.data.content,
    totalItems: result.data.totalElements
  }
}
/**
 * Open form
 */
const openFrom = () => {
  if (formMask.value) {
    formMask.value.show()
  } else {
    console.error('FormComponent component is not ready yet')
  }
}

/**
 * Close form
 */
const goBack = () => {
  //page date refresh
  if (formMask.value) {
    formMask.value.hide()
    formDetails.value = {}
    formDetails.value.challengeUis = [
      {
        locale: 'en_US',
        challengeUiSelectInfos: []
      },
      {
        locale: 'zh_TW',
        challengeUiSelectInfos: []
      },
      {
        locale: 'zh_CN',
        challengeUiSelectInfos: []
      }
    ]
    if (formTitle.value === 'DETAIL') {
      readOnlyALLSet(formConfig, false, [])
    } else if (formTitle.value === 'UPDATE') {
      readOnlySet(formConfig, ['deviceChannel', 'messageCategory', 'uiType', 'qualifier', 'issuerOid'], false)
    } else if (formTitle.value === 'ADD') {
      readOnlySet(formConfig, appStoreHook.organ == 'issuer' ? ['issuerOid'] : [], false)
    }
  } else {
    console.error('FormComponent component is not ready yet')
  }
  formTitle.value = ''
}

/**
 * Add, Modify Submit Function
 * @param formDate form data
 */
const submit = async (formDate: any) => {
  form.value = { ...formDate }
  if (formTitle.value == 'ADD') {
    //call add API
    const result = await apiUtil.post('/challenge_ui/add', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  } else if (formTitle.value == 'UPDATE') {
    //call edit API
    const result = await apiUtil.post('/challenge_ui/edit', form.value, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      goBack()
    } else {
      await swalMessage.error(result.message)
      return
    }
  }
  // Enable homepage scrollbar
  enablePageScroll()
  // Finally update table
  await handleSearch(searchCriteria.value)
}

// Allow page scrolling
function enablePageScroll() {
  document.body.style.overflow = ''
  appStoreHook.toggleFormTitle('')
}
// Form detail data
const formDetails = ref<Record<string, any>>({
  challengeUis: [
    {
      locale: 'en_US',
      challengeUiSelectInfos: []
    },
    {
      locale: 'zh_TW',
      challengeUiSelectInfos: []
    },
    {
      locale: 'zh_CN',
      challengeUiSelectInfos: []
    }
  ]
})
/**
 * Open detail popup
 * @param formDate form data
 */
const openDetail = async (formDate: Record<string, any>) => {
  formTitle.value = 'DETAIL'
  // Define ID list to update
  readOnlyALLSet(formConfig, true, [])
  await findById(formDate)
}
/**
 * Open edit popup
 * @param formDate form data
 */
const openUpdate = async (formDate: Record<string, any>) => {
  formTitle.value = 'UPDATE'
  readOnlySet(formConfig, ['deviceChannel', 'messageCategory', 'uiType', 'qualifier', 'issuerOid'], true)
  await findById(formDate)
}
/**
 * Delete
 * @param formDate form data
 */
const deleteRow = (formDate: Record<string, any>) => {
  swalMessage.confirm(t('ui.confirm.delete'), '', function () {
    apiUtil
      .post(`/challenge_ui/delete/${formDate['oid']}`, {}, {}, true)
      .then((result) => {
        if (result.success && result.code == '0000') {
          swalMessage.success(result.message)
        } else {
          swalMessage.error(result.message)
        }
      })
      .catch((error) => {
        swalMessage.error(error)
      })
      .finally(() => {
        // Finally update table
        handleSearch(searchCriteria.value)
      })
  })
}
/**
 * Detail info
 * @param formDate form data
 */
const findById = async (formDate: Record<string, any>) => {
  // Fill data
  const result = await apiUtil.get(`/challenge_ui/detail/${formDate['oid']}`, {}, {}, true)
  if (result.success && result.code == '0000') {
    // Update formDetails value
    formDetails.value = {
      ...result.data
    }
  } else {
    await swalMessage.error(result.message)
    return
  }
  // Open window
  openFrom()
}
/**
 * Query criteria data - delete issuer
 */
const deleteQueryConfigData = () => {
  if (appStoreHook.organ == 'issuer') {
    const isExist = userQueryConfig.value.some((field) => field.model === 'criteriaIssuerOid')
    if (isExist) {
      userQueryConfig.value = userQueryConfig.value.filter((field) => field.model !== 'criteriaIssuerOid')
    }
  }
}
// Initialization trigger function
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  deleteQueryConfigData()
})

// Query table config; field: field name; colOptions: for dropdown; joinCol: columns to join; joinStr: join character;
const searchResultsHeader = ref<any>([
  {
    header: 'ui.issuer.name',
    field: 'issuerOid',
    colOptions: computed(() => [...optionSelect1, ...issuerOptions.value])
  },
  {
    header: 'select.device.channel',
    field: 'deviceChannel',
    colOptions: computed(() => [...deviceChannelOptionSelect])
  },
  {
    header: 'select.message.category',
    field: 'messageCategory',
    colOptions: computed(() => [...messageCategoryOptionSelect])
  },
  {
    header: 'select.ui.type',
    field: 'uiType',
    colOptions: computed(() => [...uiTypeOption.value])
  },
  {
    header: 'select.qualifier',
    field: 'qualifier'
  }
])
// Form configuration for Add, Modify, Query
const formConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: userState.user.issuerOid,
    ID: 'issuerOid',
    readOnly: appStoreHook.organ == 'issuer',
    required: true,
    props: {
      options: issuerOptions
    }
  },
  {
    type: 'checkbox',
    label: 'device.channel',
    model: 'deviceChannel',
    default: '',
    ID: 'deviceChannel',
    readOnly: false,
    required: true,
    props: {
      options: deviceChannelOption
    }
  },
  {
    type: 'checkbox',
    label: 'message.category',
    model: 'messageCategory',
    default: '',
    ID: 'messageCategory',
    readOnly: false,
    required: true,
    props: {
      options: messageCategoryOption
    }
  },
  {
    type: 'checkbox',
    label: 'ui.type',
    model: 'uiType',
    default: '',
    ID: 'uiType',
    readOnly: false,
    required: true,
    props: {
      options: uiTypeOption
    }
  },
  {
    type: 'text',
    label: 'qualifier',
    model: 'qualifier',
    default: '',
    ID: 'qualifier',
    readOnly: false,
    required: true,
    maxlength: '50',
    props: {}
  },
  {
    type: 'text',
    label: 'render',
    model: 'render',
    default: '',
    ID: 'render',
    readOnly: false,
    required: true,
    maxlength: '50',
    props: {}
  },
  {
    type: 'checkbox',
    label: 'challenge.info.text.ind',
    model: 'challengeInfoTextInd',
    default: '',
    ID: 'challengeInfoTextInd',
    readOnly: false,
    required: true,
    props: {
      options: challengeInfoTextIndOption
    }
  },
  {
    type: 'checkbox',
    label: 'challenge.info.toggle.position',
    model: 'togglePositionInd',
    default: '',
    ID: 'togglePositionInd',
    readOnly: false,
    required: false,
    props: {
      options: togglePositionIndOption
    }
  },
  {
    type: 'text',
    label: 'OobAppUrl',
    model: 'oobAppUrl',
    default: '',
    ID: 'oobAppUrl',
    readOnly: false,
    required: false,
    maxlength: '256',
    props: {}
  }
])
// Search condition configuration
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer.name',
    model: 'criteriaIssuerOid',
    default: userState.user.issuerOid,
    readOnly: appStoreHook.organ == 'issuer',
    props: {
      options: issuerOptions,
      id: 'criteriaIssuerOid'
    }
  },
  {
    type: 'select',
    label: 'select.device.channel',
    model: 'criteriaDeviceChannel',
    default: '',
    props: {
      // Use computed to switch language
      options: deviceChannelOption,
      id: 'criteriaDeviceChannel'
    }
  },
  {
    type: 'select',
    label: 'select.message.category',
    model: 'criteriaMessageCategory',
    default: '',
    props: {
      options: messageCategoryOption,
      id: 'criteriaMessageCategory'
    }
  },
  {
    type: 'select',
    label: 'select.ui.type',
    model: 'criteriaUiType',
    default: '',
    props: {
      options: uiTypeOption,
      id: 'criteriaUiType'
    }
  },
  {
    type: 'text',
    label: 'select.qualifier',
    model: 'criteriaQualifier',
    default: '',
    maxlength: '50',
    props: {
      id: 'criteriaQualifier'
    }
  }
])
</script>

<style scoped>
/* Add your styles here */
</style>
