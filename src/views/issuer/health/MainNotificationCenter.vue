<template>
  <div class="row" style="padding: 0 30px">
    <!-- Notification Section -->
    <div class="col-lg-12">
      <div
        style="
          box-shadow:
            rgba(27, 31, 35, 0.04) 0 1px 0,
            rgba(255, 255, 255, 0.25) 0 1px 0 inset;
          padding: 10px 0;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        "
      >
        <div
          style="color: #70ad47; display: flex; justify-content: center; align-items: center"
          id="notifications_checked"
        >
          <i class="fa fa-check-circle fa-lg"></i>&nbsp;&nbsp;
        </div>
        <div style="font-size: 20px; font-weight: bold">
          {{ $t('ui.notification-center.expiring')
          }}<!-- 提醒事項 -->
        </div>
      </div>
    </div>

    <div class="col-lg-12">
      <!-- Signing certificate expiring soon -->
      <div class="border border-light-subtle">
        <div class="header-title">{{ $t('ui.notification-center.expiring-sign') }}</div>
        <div class="content-box p-3">
          <div class="panel-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr class="bg-primary">
                    <th>{{ $t('ui.notification-center.cardScheme') }}</th>
                    <th>{{ $t('ui.notification-center.cert-alias') }}</th>
                    <th>{{ $t('ui.notification-center.subject-cn') }}</th>
                    <th>{{ $t('ui.notification-center.issuer-cn') }}</th>
                    <th>{{ $t('ui.notification-center.expiry-date') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="issuerCert in expiringSignList" :key="issuerCert.oid">
                    <td>{{ getOptionsByValue(issuerCert.cardScheme, schemeOptions) }}</td>
                    <td>
                      <a
                        href="javascript:void(0)"
                        @click="handleNavigation(certificatesAccess[0], '/certificate/sign_cert_management')"
                      >
                        {{ issuerCert.keyAlias }}
                      </a>
                    </td>
                    <td>{{ issuerCert.subjectCn }}</td>
                    <td>{{ issuerCert.certIssuerCn }}</td>
                    <td>{{ dateFormat(issuerCert.notAfter, 'yyyy-MM-dd', userTz()) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- DS client certificate expiring soon -->
      <div class="border border-light-subtle mt-3">
        <div class="header-title">{{ $t('ui.notification-center.expiring-dsclient') }}</div>
        <div class="content-box p-3">
          <div class="panel-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr class="bg-primary">
                    <th>{{ $t('ui.notification-center.cardScheme') }}</th>
                    <th>{{ $t('ui.notification-center.cert-alias') }}</th>
                    <th>{{ $t('ui.notification-center.subject-cn') }}</th>
                    <th>{{ $t('ui.notification-center.issuer-cn') }}</th>
                    <th>{{ $t('ui.notification-center.expiry-date') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="issuerCert in expiringDSClientList" :key="issuerCert.oid">
                    <td>{{ getOptionsByValue(issuerCert.cardScheme, schemeOptions) }}</td>
                    <td>
                      <a
                        href="javascript:void(0)"
                        @click="handleNavigation(certificatesAccess[1], '/certificate/ds_cert_management')"
                      >
                        {{ issuerCert.keyAlias }}
                      </a>
                    </td>
                    <td>{{ issuerCert.subjectCn }}</td>
                    <td>{{ issuerCert.certIssuerCn }}</td>
                    <td>{{ dateFormat(issuerCert.notAfter, 'yyyy-MM-dd', userTz()) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- Trusted CA certificate expiring soon -->
      <div class="border border-light-subtle mt-3">
        <div class="header-title">{{ $t('ui.notification-center.expiring-cacert') }}</div>
        <div class="content-box p-3">
          <div class="panel-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr class="bg-primary">
                    <th>{{ $t('ui.notification-center.cert-alias') }}</th>
                    <th>{{ $t('ui.notification-center.subject-cn') }}</th>
                    <th>{{ $t('ui.notification-center.issuer-cn') }}</th>
                    <th>{{ $t('ui.notification-center.expiry-date') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="issuerCert in expiringCACert" :key="issuerCert.oid">
                    <td>
                      <a
                        href="javascript:void(0)"
                        @click="handleNavigation(certificatesAccess[2], '/certificate/ca_cert_query')"
                      >
                        {{ issuerCert.keyAlias }}
                      </a>
                    </td>
                    <td>{{ issuerCert.subjectCn }}</td>
                    <td>{{ issuerCert.certIssuerCn }}</td>
                    <td>{{ dateFormat(issuerCert.notAfter, 'yyyy-MM-dd', userTz()) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-12 mt-3">
        <div
          style="
            box-shadow:
              rgba(27, 31, 35, 0.04) 0 1px 0,
              rgba(255, 255, 255, 0.25) 0 1px 0 inset;
            padding: 10px 0;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
          "
        >
          <div
            v-if="systemSettingsChecked"
            style="color: #70ad47; display: flex; justify-content: center; align-items: center"
            id="notifications_checked"
          >
            <i class="fa fa-check-circle fa-lg"></i>&nbsp;&nbsp;
          </div>
          <div
            v-else
            style="color: #c00000; display: flex; justify-content: center; align-items: center; font-size: 16px"
            id="systemSettings_unchecked"
          >
            <i class="fa fa-exclamation-triangle font-size: 16px;"></i>&nbsp;&nbsp;
          </div>
          <div style="font-size: 20px; font-weight: bold">
            {{ $t('ui.notification-center.system-setting')
            }}<!-- 提醒事項 -->
          </div>
        </div>
      </div>

      <div class="col-lg-12">
        <div class="border border-light-subtle mt-3">
          <div class="header-title">{{ $t('ui.notification-center.system-setting') }}</div>
          <div class="content-box p-3">
            <div class="panel-body">
              <div class="table-responsive">
                <!-- Issuer Param -->
                <div class="setting-item">
                  <div
                    class="link-no-style"
                    id="trans_argument"
                    @click="handleNavigation(systemSettingAccess[0], '/system/issuer_param')"
                  >
                    <div class="setting-item-content">
                      <div>{{ $t('ui.notification-center.system-setting.issuerParam') }}</div>
                      <div v-if="issuerParam" class="status-icon text-muted">
                        <i class="fa fa-check"></i>
                      </div>
                      <div v-else class="status-text text-danger">
                        {{ $t('ui.notification-center.unchecked') }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- CA Certificate -->
                <div class="setting-item">
                  <div
                    class="link-no-style"
                    id="trans_argument"
                    @click="handleNavigation(systemSettingAccess[1], '/certificate/ca_cert_load')"
                  >
                    <div class="setting-item-content">
                      <div>{{ $t('ui.notification-center.system-setting.cacert') }}</div>
                      <div v-if="cacert" class="status-icon text-muted">
                        <i class="fa fa-check"></i>
                      </div>
                      <div v-else class="status-text text-danger">
                        {{ $t('ui.notification-center.unchecked') }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="setting-item" v-if="enableRba">
                  <div
                    class="link-no-style"
                    id="trans_argument"
                    @click="handleNavigation(systemSettingAccess[2], '/risk/issuer_risk')"
                  >
                    <div class="setting-item-content">
                      <div>{{ $t('ui.notification-center.system-setting.rba') }}</div>
                      <div v-if="rba" class="status-icon text-muted">
                        <i class="fa fa-check"></i>
                      </div>
                      <div v-else class="status-text text-danger">
                        {{ $t('ui.notification-center.unchecked') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-12 mt-3">
        <div
          style="
            box-shadow:
              rgba(27, 31, 35, 0.04) 0 1px 0,
              rgba(255, 255, 255, 0.25) 0 1px 0 inset;
            padding: 10px 0;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
          "
        >
          <div
            v-if="cardSchemeSettingsChecked"
            style="color: #70ad47; display: flex; justify-content: center; align-items: center"
            id="notifications_checked"
          >
            <i class="fa fa-check-circle fa-lg"></i>&nbsp;&nbsp;
          </div>
          <div
            v-else
            style="color: #c00000; display: flex; justify-content: center; align-items: center; font-size: 16px"
            id="systemSettings_unchecked"
          >
            <i class="fa fa-exclamation-triangle font-size: 16px;"></i>&nbsp;&nbsp;
          </div>
          <div style="font-size: 20px; font-weight: bold">
            {{ $t('ui.notification-center.cardScheme-setting')
            }}<!-- 卡組織相關設定 -->
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6" v-for="(codeId, index) in codeIdOrderBy" :key="index">
          <div class="border border-light-subtle mt-3">
            <div class="header-title">
              {{ getOptionsByValue(codeId, schemeOptions) }}
              {{ $t('ui.notification-center.cardScheme-setting-items') }}
            </div>
            <div class="content-box p-3">
              <div class="panel-body">
                <div class="table-responsive">
                  <!-- Card Scheme Parameter Settings -->
                  <div class="setting-item">
                    <div
                      class="link-no-style"
                      @click="handleNavigation(cardSchemeSettingAccess[0], '/system/card_scheme_param')"
                    >
                      <div class="setting-item-content">
                        <div>{{ $t('ui.notification-center.cardScheme-setting-items.0') }}</div>
                        <div v-if="cardSchemeSettings[codeId][0]" class="status-icon text-muted">
                          <i class="fa fa-check"></i>
                        </div>
                        <div v-else class="status-text text-danger">
                          {{ $t('ui.notification-center.unchecked') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Card BIN Settings -->
                  <div class="setting-item">
                    <div
                      class="link-no-style"
                      @click="handleNavigation(cardSchemeSettingAccess[1], '/system/card_bin')"
                    >
                      <div class="setting-item-content">
                        <div>{{ $t('ui.notification-center.cardScheme-setting-items.1') }}</div>
                        <div v-if="cardSchemeSettings[codeId][1]" class="status-icon text-muted">
                          <i class="fa fa-check"></i>
                        </div>
                        <div v-else class="status-text text-danger">
                          {{ $t('ui.notification-center.unchecked') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- CAVV Key Management -->
                  <div class="setting-item">
                    <div class="link-no-style" @click="handleNavigation(cardSchemeSettingAccess[2], '/key/cavv_key')">
                      <div class="setting-item-content">
                        <div>{{ $t('ui.notification-center.cardScheme-setting-items.2') }}</div>
                        <div v-if="cardSchemeSettings[codeId][2]" class="status-icon text-muted">
                          <i class="fa fa-check"></i>
                        </div>
                        <div v-else class="status-text text-danger">
                          {{ $t('ui.notification-center.unchecked') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Signing Certificate Request Creation -->
                  <div class="setting-item">
                    <div
                      class="link-no-style"
                      @click="handleNavigation(cardSchemeSettingAccess[3], '/certificate/sign_csr')"
                    >
                      <div class="setting-item-content">
                        <div>{{ $t('ui.notification-center.cardScheme-setting-items.3') }}</div>
                        <div v-if="cardSchemeSettings[codeId][3]" class="status-icon text-muted">
                          <i class="fa fa-check"></i>
                        </div>
                        <div v-else class="status-text text-danger">
                          {{ $t('ui.notification-center.unchecked') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Signing Certificate Loading -->
                  <div class="setting-item">
                    <div
                      class="link-no-style"
                      @click="handleNavigation(cardSchemeSettingAccess[4], '/certificate/sign_cert_management')"
                    >
                      <div class="setting-item-content">
                        <div>{{ $t('ui.notification-center.cardScheme-setting-items.4') }}</div>
                        <div v-if="cardSchemeSettings[codeId][4]" class="status-icon text-muted">
                          <i class="fa fa-check"></i>
                        </div>
                        <div v-else class="status-text text-danger">
                          {{ $t('ui.notification-center.unchecked') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Signing Certificate Activation -->
                  <div class="setting-item">
                    <div
                      class="link-no-style"
                      @click="handleNavigation(cardSchemeSettingAccess[5], '/certificate/sign_cert_management')"
                    >
                      <div class="setting-item-content">
                        <div>{{ $t('ui.notification-center.cardScheme-setting-items.5') }}</div>
                        <div v-if="cardSchemeSettings[codeId][5]" class="status-icon text-muted">
                          <i class="fa fa-check"></i>
                        </div>
                        <div v-else class="status-text text-danger">
                          {{ $t('ui.notification-center.unchecked') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- DS Client Certificate Request Creation -->
                  <div class="setting-item">
                    <div
                      class="link-no-style"
                      @click="handleNavigation(cardSchemeSettingAccess[6], '/certificate/ds_csr')"
                    >
                      <div class="setting-item-content">
                        <div>{{ $t('ui.notification-center.cardScheme-setting-items.6') }}</div>
                        <div v-if="cardSchemeSettings[codeId][6]" class="status-icon text-muted">
                          <i class="fa fa-check"></i>
                        </div>
                        <div v-else class="status-text text-danger">
                          {{ $t('ui.notification-center.unchecked') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- DS Client Certificate Loading -->
                  <div class="setting-item">
                    <div
                      class="link-no-style"
                      @click="handleNavigation(cardSchemeSettingAccess[7], '/certificate/ds_cert_management')"
                    >
                      <div class="setting-item-content">
                        <div>{{ $t('ui.notification-center.cardScheme-setting-items.7') }}</div>
                        <div v-if="cardSchemeSettings[codeId][7]" class="status-icon text-muted">
                          <i class="fa fa-check"></i>
                        </div>
                        <div v-else class="status-text text-danger">
                          {{ $t('ui.notification-center.unchecked') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- DS Client Certificate Activation -->
                  <div class="setting-item">
                    <div
                      class="link-no-style"
                      @click="handleNavigation(cardSchemeSettingAccess[8], '/certificate/ds_cert_management')"
                    >
                      <div class="setting-item-content">
                        <div>{{ $t('ui.notification-center.cardScheme-setting-items.8') }}</div>
                        <div v-if="cardSchemeSettings[codeId][8]" class="status-icon text-muted">
                          <i class="fa fa-check"></i>
                        </div>
                        <div v-else class="status-text text-danger">
                          {{ $t('ui.notification-center.unchecked') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ApiUtil from '@/utils/apiUtils'
import swalMessage from '@/plugins/swalMessage'
import { findByCodeType } from '@/hooks/sysCode'
import type { BaseI18nSelect } from '@/utils/select/baseSelect'
import { dateFormat, getOptionsByValue } from '@/utils/util'
import { userStateStore } from '@/stores/user'
import { DateTime } from 'luxon'
import router from '@/router'
import { useI18n } from 'vue-i18n'

const userTz = () => userStateStore().user?.timeZone || DateTime.local().zoneName
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const expiringSignList = ref()
const expiringDSClientList = ref()
const expiringCACert = ref()
const systemSetting = ref()
const issuerParam = ref()
const cacert = ref()
const enableRba = ref()
const rba = ref()
const codeIdOrderBy = ref()
const cardSchemeSettings = ref()
const schemeOptions = ref<BaseI18nSelect[]>([])
const { t } = useI18n()

const certificatesAccess = ref([])
const systemSettingAccess = ref([])
const cardSchemeSettingAccess = ref([])

const emit = defineEmits(['sendData'])

const cardSchemeSettingsChecked = computed(() => {
  if (!cardSchemeSettings.value) {
    return false
  }
  // Iterate through arrays in each object
  for (const key in cardSchemeSettings.value) {
    const array = cardSchemeSettings.value[key]
    // If any value in the array is false, return false
    if (array.includes(false)) {
      return false
    }
  }
  // If no false in any array, return true
  return true
})

const systemSettingsChecked = computed(() => {
  if (!systemSetting.value) {
    return false
  }
  return !!(issuerParam.value && cacert.value && rba.value)
})

/**
 * Handle Navigation Logic
 * @param {boolean} flag - Permission ID
 * @param {string} path - Target Path
 */
const handleNavigation = async (flag: boolean, path: string) => {
  if (flag) {
    await router.push(path)
  } else {
    await swalMessage.error(t('warn.login.invalid-access'))
  }
}

onMounted(async () => {
  schemeOptions.value = await findByCodeType('CARD_SCHEME')
  const result = await apiUtil.get('/issuer/index/health', {}, {}, true)
  if (result.success && result.code == '0000') {
    expiringSignList.value = {
      ...result.data.expiringSignList
    }
    expiringDSClientList.value = {
      ...result.data.expiringDSClientList
    }
    expiringCACert.value = {
      ...result.data.expiringCACert
    }
    systemSetting.value = {
      ...result.data.systemSetting
    }
    issuerParam.value = result.data.systemSetting.issuerParam
    cacert.value = result.data.systemSetting.cacert
    enableRba.value = result.data.systemSetting.enableRba
    rba.value = result.data.systemSetting.rba
    codeIdOrderBy.value = {
      ...result.data.codeIdOrderBy
    }
    cardSchemeSettings.value = {
      ...result.data.cardSchemeSettings
    }
    cardSchemeSettingAccess.value = result.data.privilegesMap.cardSchemeSettingAccess
    systemSettingAccess.value = result.data.privilegesMap.systemSettingAccess
    certificatesAccess.value = result.data.privilegesMap.certificatesAccess
  } else {
    await swalMessage.error(result.message)
  }

  const tabUnchecked = cardSchemeSettingsChecked.value && systemSettingsChecked.value
  emit('sendData', tabUnchecked)
})
</script>

<style scoped>
.setting-item {
  border: 1px solid #e0e0e0; /* Add border */
  border-radius: 5px; /* Border radius effect */
  margin-bottom: 15px; /* Bottom margin */
  transition: all 0.3s ease; /* Smooth transition effect */
}

.setting-item:hover {
  border-color: #70ad47; /* Border color on hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Shadow effect on hover */
}

.setting-item-content {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px; /* Padding */
  align-items: center; /* Vertical align center */
}

.status-icon {
  color: #70ad47;
}

.status-text {
  color: #c00000;
  font-weight: bold;
}

/* Adapt styles for different states */
.text-muted {
  color: #70ad47;
}

.text-danger {
  color: #c00000;
}

/* Remove default styles of <router-link> */
.link-no-style {
  text-decoration: none; /* Remove underline */
  color: inherit; /* Inherit color from parent */
}
</style>
