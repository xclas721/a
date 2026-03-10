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
              <div v-for="(field, index) in formConfig" :key="index" :class="itemClass(field.colNum)">
                <div class="order-0 mb-2">
                  <component
                    :is="getComponentType()"
                    :ID="field.ID"
                    :LabelVal="field.label"
                    :type="field.type"
                    v-model="formDate[field.model]"
                    :invalids="field.invalids"
                    :invalidsTxt="field.invalidsTxt"
                    :maxlength="field.maxlength"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    :readOnly="field.readOnly"
                    v-bind="field.props"
                    :validation="valida"
                    @clickUpFunc="(event: any) => handleInputKeyup(field, event)"
                    @update:invalids="(newInvalids: boolean) => (field.invalids = newInvalids)"
                  />
                </div>
              </div>

              <div>
                <div v-for="menu in filterMenuChildren(menuData)" :key="menu.accessId" class="mt-3">
                  <!-- Title area -->
                  <div class="header-title">
                    {{ $t(menu.i18nCode) }}
                    <span class="float-end small">
                      <input
                        type="checkbox"
                        :checked="isAllSelected(menu.accessId)"
                        @change="toggleAll(menu.accessId)"
                        :disabled="title == 'DETAIL'"
                      />
                      {{ $t('btn.select.all') }}
                    </span>
                  </div>

                  <!-- Submenu -->
                  <div class="menu-content p-3">
                    <div class="row">
                      <div v-for="child in menu.children" :key="child.accessId" class="col-3 menu-item">
                        <label>
                          <input
                            type="checkbox"
                            :checked="isSelected(menu.accessId, child.accessId)"
                            @change="toggleItem(menu.accessId, child.accessId)"
                            :disabled="title == 'DETAIL'"
                          />
                          {{ $t(child.i18nCode) }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-footer-buttons mt-2 mb-5" v-if="title != 'DETAIL'">
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
import FormInput from '@/components/formTable/FormInput.vue'
import FormButton from '@/components/formTable/FormButton.vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { conventTitle } from '@/utils/util'
import type { FormField } from '@/components/formTable/FormComponent.vue'

const { t } = useI18n()

// Props
const props = defineProps<{
  formConfig: FormField[]
  title: string
  formData: Record<string, any>
  menuData?: Record<string, any>[]
  checkData: Record<string, Set<string>>
}>()

// Create local reactive data to store selected items
const selectedItems = reactive<Record<string, Set<string>>>({ ...props.checkData })

// Watch props.checkData changes, keep selectedItems synced
watch(
  () => props.checkData,
  (newCheckData) => {
    clearCheck()
    // Update local reactive variable selectedItems
    Object.assign(selectedItems, newCheckData)
  },
  { deep: true }
)

// Check if parent menu is fully selected
const isAllSelected = (menuId: string) => {
  const menu = props.menuData?.find((menu: any) => menu.accessId === menuId)
  if (!menu || !menu.children) return false
  return selectedItems[menuId]?.size === menu.children.length
}

// Toggle parent menu full selection
const toggleAll = (menuId: string) => {
  const menu = props.menuData?.find((menu: any) => menu.accessId === menuId)
  if (!menu) return

  if (isAllSelected(menuId)) {
    selectedItems[menuId] = new Set() // Deselect all
  } else {
    selectedItems[menuId] = new Set(menu.children.map((child: any) => child.accessId)) // Select all
  }
}

// Check if child menu is selected
const isSelected = (menuId: string, childId: string) => {
  return selectedItems[menuId]?.has(childId)
}

// Toggle single child menu selection status
const toggleItem = (menuId: string, childId: string) => {
  if (!selectedItems[menuId]) {
    selectedItems[menuId] = new Set()
  }

  if (selectedItems[menuId].has(childId)) {
    selectedItems[menuId].delete(childId)
  } else {
    selectedItems[menuId].add(childId)
  }
}
/**
 * Detail filter menu
 * @param menus menus
 */
const filterMenuChildren = (menus: Record<string, any>[] | undefined) => {
  if (menus == undefined) {
    return []
  }
  if (props.title == 'DETAIL') {
    const newMenu: Record<string, any>[] = []
    for (const menu of menus) {
      if (selectedItems[menu.accessId] && selectedItems[menu.accessId].size > 0) {
        const filteredChildren = menu.children.filter((nodeChildren: Record<string, any>) =>
          selectedItems[menu.accessId].has(nodeChildren.accessId)
        )
        newMenu.push({ ...menu, children: filteredChildren })
      }
    }
    return newMenu
  } else {
    return menus
  }
}
const clearCheck = () => {
  // Clear all Sets in selectedItems
  for (const key of Object.keys(selectedItems)) {
    selectedItems[key].clear() // Clear each Set
  }
}
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

/**
 * Input validation
 * @param field field
 * @param event event
 */
function handleInputKeyup(field: FormField, event: KeyboardEvent) {
  const data = (event.target as HTMLInputElement).value
  if (data) {
    const validateAction = field.validateAction?.(data)
    if (validateAction) {
      if (validateAction.result) {
        field.invalids = false
        field.invalidsTxt = ''
      } else {
        field.invalids = true
        field.invalidsTxt = validateAction.message
      }
    }
  } else {
    const required = field.required
    field.invalids = required
    field.invalidsTxt = required ? 'javax.validation.constraints.NotNull.message' : ''
  }
}

const getComponentType = () => {
  return FormInput
}

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

const itemClass = (colNum: string | undefined) => {
  return 'col-md-' + (colNum ?? '6')
}

// Emit the search event
const emit = defineEmits(['submit', 'goBack'])

// Define the form object dynamically based on formConfig
const formDate = reactive<Record<string, any>>({})

// Initialize form object based on formConfig
for (const field of props.formConfig) {
  formDate[field.model] = props.formData[field.model] || field.default
}

const resetForm = () => {
  for (const field of props.formConfig) {
    field.invalids = false
    formDate[field.model] = field.default
    valida.value = false
  }

  // Clear all Sets in selectedItems
  clearCheck()
}
const resetFormBtn = () => {
  if (props.title === 'UPDATE') {
    for (const field of props.formConfig) {
      formDate[field.model] = props.formData[field.model] || field.default
    }
  } else {
    for (const field of props.formConfig) {
      formDate[field.model] = field.default
    }
  }

  // Clear all Sets in selectedItems
  clearCheck()
}
watch(
  () => props.formData,
  (newData) => {
    if (newData) {
      for (const field of props.formConfig) {
        formDate[field.model] = newData[field.model] || field.default
      }
      if (newData['oid']) {
        formDate['oid'] = newData['oid']
      }
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
  emit('goBack', { ...formDate })
}
// Used for formInput component validation. When closing window and model becomes empty, error msg appears. Add this field: set to true (validate) when opening form, set to false (no validation) when closing form.
const valida = ref(true)
const submit = () => {
  let validation = true
  //check form
  for (const field of props.formConfig) {
    if (field.required) {
      field.invalids = false
      if (!formDate[field.model] || formDate[field.model] === '') {
        field.invalids = true
        field.invalidsTxt = 'javax.validation.constraints.NotNull.message'
        validation = false
      }
    }

    // Check if custom validation passed
    if (formDate[field.model]) {
      const validateAction = field.validateAction?.(formDate[field.model])
      if (validateAction) {
        if (validateAction.result) {
          validation = false
        }
      }
    }
  }

  if (validation) {
    const allSelectedItems = Array.from(Object.values(selectedItems).flatMap((set) => Array.from(set)))
    // Enable homepage scrollbar
    enablePageScroll()
    emit('submit', { ...formDate, accessIds: allSelectedItems })
    valida.value = false

    // Clear all Sets in selectedItems
    clearCheck()
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
  max-width: 60%;
  margin: 7rem auto;
}
</style>
