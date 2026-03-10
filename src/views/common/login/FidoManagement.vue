<template>
  <!-- FIDO Management Popup -->
  <div v-if="showFlag" class="modal fade show" :style="dispalyCss" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ computedTitle }}</h5>
          <button type="button" class="btn-close" @click="closeDialog"></button>
        </div>
        <div class="modal-body">
          <!-- FIDO Registration Button -->
          <button class="btn btn-outline-primary w-100 mb-2" @click="openFidoRegisterModal">
            <i class="icon cil-fingerprint" />&nbsp;{{ $t('ui.fido.management.register') }}
          </button>
          <!-- FIDO Status Management Button -->
          <button class="btn btn-outline-primary w-100 mb-2" @click="openFidoStatusModal">
            <i class="icon cil-list" />&nbsp;{{ $t('ui.fido.management.status') }}
          </button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeDialog">
            {{ $t('btn.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- FIDO Registration Popup -->
  <FidoRegisterModal
    v-if="showFidoRegisterModal"
    :userId="account"
    :userName="displayName"
    @close="closeFidoRegisterModal"
  />

  <!-- FIDO Status Query Popup -->
  <FidoUserStatusModal
    v-if="showFidoStatusModal"
    :userId="account"
    :userName="displayName"
    @close="closeFidoStatusModal"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { userStateStore } from '@/stores/user'
// import i18n from '@/locales'
import FidoRegisterModal from '@/components/fido/FidoRegisterModal.vue'
import FidoUserStatusModal from '@/components/fido/FidoUserStatusModal.vue'

const { t } = useI18n()
const userState = userStateStore()
const props = defineProps<{
  loginRandom8digits: string
  userAccount: string
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue', 'headerLogout', 'closeParentModal'])
const showFlag = ref(props.modelValue)
const form = reactive({
  account: '',
  pdfield: '',
  newPdfield: '',
  confirmPdfield: ''
})
// const { locale } = useI18n()
const account = ref(userState.user.account)
const displayName = ref(userState.user.userName)

// FIDO Registration Popup Control
const showFidoRegisterModal = ref(false)

// FIDO Status Query Popup Control
const showFidoStatusModal = ref(false)

watch(
  () => props.userAccount,
  (newVal) => {
    form.account = newVal
  },
  { immediate: true }
)

const computedTitle = computed(() => {
  return t('ui.main.menu.fido-management')
})

const dispalyCss = computed(() => {
  return showFlag.value ? `display:block;background:rgba(0,0,0,0.7);` : `display:none;background:rgba(0,0,0,0.7);`
})

// Open FIDO Registration Popup
const openFidoRegisterModal = () => {
  showFidoRegisterModal.value = true
}

const closeFidoRegisterModal = () => {
  showFidoRegisterModal.value = false
}

// Open FIDO Status Query Popup
const openFidoStatusModal = () => {
  showFidoStatusModal.value = true
}

const closeFidoStatusModal = () => {
  showFidoStatusModal.value = false
}

// Close popup
const closeDialog = () => {
  showFlag.value = false
  emit('update:modelValue', false)
}
onMounted(async () => {})
</script>

<style>
.modal-dialog {
  max-width: 35%;
  margin: 5rem auto;
}

.modal-content {
  border: 0;
}
</style>
