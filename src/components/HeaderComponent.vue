<template>
  <header class="header header-sticky header-bar p-0 mb-4">
    <div class="container-fluid header-bar-inner border-bottom px-4">
      <button class="header-toggler" type="button" @click="toggleSidebar" style="margin-inline-start: -14px">
        <i class="icon cil-menu"></i>
      </button>

      <div class="header-breadcrumb">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb my-0">
            <li class="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li class="breadcrumb-item" v-for="(breadcrumb, index) in breadcrumbs" :key="index">
              <template v-if="breadcrumb.path != '/health'">
                <span v-if="index === breadcrumbs.length - 1 && typeof breadcrumb.name === 'string'">
                  {{ $t(breadcrumb.name) }}
                </span>
                <span v-else-if="typeof breadcrumb.name === 'string'">
                  {{ $t(breadcrumb.name) }}
                </span>
              </template>
            </li>
            <li class="breadcrumb-item" v-if="appStore.formTitle">
              {{ appStore.formTitle }}
            </li>
          </ol>
        </nav>
      </div>

      <ul class="header-nav header-actions ms-auto">
        <li class="nav-item">
          <button
            class="header-theme-switch-btn"
            type="button"
            role="switch"
            :aria-checked="currentMode === 'dark'"
            :title="currentMode === 'dark' ? 'Dark' : 'Light'"
            @click="toggleTheme"
          >
            <span class="header-theme-switch-thumb" :class="{ 'is-dark': currentMode === 'dark' }">
              <img :src="currentMode === 'dark' ? iconThemeDark : iconThemeLight" alt="" class="header-action-icon" />
            </span>
          </button>
        </li>
        <!-- 語言選單：統一樣式 -->
        <li class="nav-item">
          <div class="dropdown header-dropdown">
            <button
              class="header-btn-circle"
              type="button"
              id="languageDropdown"
              aria-expanded="false"
              aria-haspopup="true"
              :title="langStr"
            >
              <img :src="iconLanguage" alt="" class="header-action-icon" aria-hidden="true" />
            </button>
            <ul class="header-dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
              <li v-for="option in langOptions" :key="option.value">
                <a
                  class="header-dropdown-item"
                  href="#"
                  @click.prevent="handleChangeLanguage(option.value)"
                  :class="{ active: option.value === appStore.language }"
                >
                  {{ option.label }}
                </a>
              </li>
            </ul>
          </div>
        </li>
        <!-- 時區選單：統一樣式 -->
        <li class="nav-item">
          <div class="dropdown header-dropdown">
            <button
              class="header-btn-circle"
              type="button"
              id="timezoneDropdown"
              aria-expanded="false"
              aria-haspopup="true"
              :title="userState.user.timeZone"
            >
              <img :src="iconTimezone" alt="" class="header-action-icon" aria-hidden="true" />
            </button>
            <ul
              class="header-dropdown-menu header-dropdown-menu-scroll dropdown-menu-end"
              aria-labelledby="timezoneDropdown"
            >
              <li>
                <a class="header-dropdown-item" href="#" @click.prevent="resetToSystemTimezone">
                  <i class="fa fa-sync-alt me-2" aria-hidden="true"></i>
                  {{ $t('ui.timezone.reset.system') }} ({{ systemTimeZone }})
                </a>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li v-for="option in timezoneOptions" :key="option.value">
                <a
                  class="header-dropdown-item"
                  href="#"
                  @click.prevent="handleChangeTimezone(option.value)"
                  :class="{ active: option.value === userState.user.timeZone }"
                >
                  {{ option.label }}
                </a>
              </li>
            </ul>
          </div>
        </li>
        <!-- 使用者／設定選單：統一樣式 -->
        <li class="nav-item">
          <div class="dropdown header-dropdown">
            <button
              class="header-btn-circle"
              type="button"
              id="userDropdown"
              aria-expanded="false"
              aria-haspopup="true"
              :title="userState.user.userName"
            >
              <img :src="iconUser" alt="" class="header-action-icon" aria-hidden="true" />
            </button>
            <div class="header-dropdown-menu dropdown-menu-end header-dropdown-menu-user">
              <div class="header-dropdown-header">
                {{ userState.user.userName }}
              </div>
              <a class="header-dropdown-item" href="#" @click.prevent="openSettingsModal">
                <i class="icon cil-settings" aria-hidden="true"></i>
                <span>{{ $t('ui.main.menu.settings') }}</span>
              </a>
              <a class="header-dropdown-item" href="#" @click.prevent="headerLogout">
                <i class="icon cil-account-logout" aria-hidden="true"></i>
                <span>{{ $t('ui.main.header.logout') }}</span>
              </a>
            </div>
          </div>
        </li>
      </ul>
      <!-- 设置弹窗 -->
      <div v-if="showSettingsModal" class="modal fade show" style="display: block" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ $t('ui.main.menu.settings') }}</h5>
              <button type="button" class="btn-close" @click="closeSettingsModal"></button>
            </div>
            <div class="modal-body">
              <!-- 修改密码按钮 -->
              <button class="btn btn-outline-primary w-100 mb-2" @click="changePassword">
                <i class="icon cil-settings" />&nbsp;{{ $t('ui.main.menu.change-password') }}
              </button>
              <!-- 解除MFA绑定按钮 -->
              <button v-if="userState.user.mfa" class="btn btn-outline-danger w-100 mb-2" @click="unbindMFA">
                <i class="icon cil-lock-unlocked" />&nbsp;{{ $t('ui.mfa.authentication.qrcode.unbinding.mfa') }}
              </button>
              <!-- FIDO管理按钮 -->
              <button
                v-if="isFidoMode && userState.user.fidoEnabled === '1'"
                class="btn btn-outline-primary w-100 mb-2"
                @click="fidoManagement"
              >
                <i class="icon cil-fingerprint" />&nbsp;{{ $t('ui.main.menu.fido-management') }}
              </button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeSettingsModal">
                {{ $t('btn.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 模态框背景遮罩 -->
      <div v-if="showSettingsModal" class="modal-backdrop fade show"></div>
    </div>
  </header>

  <ChangePassword
    v-if="changePwdShow"
    v-model="changePwdShow"
    :user-account="userState.user.account"
    :login-random8digits="random8digits"
    @headerLogout="headerLogout"
  />
  <FidoManagement
    v-if="fidoManagementShow"
    v-model="fidoManagementShow"
    :user-account="userState.user.account"
    :login-random8digits="random8digits"
    @headerLogout="headerLogout"
    @closeParentModal="closeSettingsModal"
  />
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { DateTime } from 'luxon'
import { logout } from '@/utils/authUserUtils'
import { getLocaleLabel, getSupportLocaleList, getTimezoneList } from '@/utils/appProperties'
import { userStateStore } from '@/stores/user'
import { resetRouter } from '@/router'
import { useAppStore, useAppStoreHook } from '@/stores/app'
import { useColorModes } from '@/stores/useColorModes'
import ChangePassword from '@/views/common/login/ChangePassword.vue'
import FidoManagement from '@/views/common/login/FidoManagement.vue'
import ApiUtil from '@/utils/apiUtils'
import swalMessage from '@/plugins/swalMessage'
import i18n from '@/locales'

import iconThemeLight from '@/assets/img/header/header-icon-theme-light.svg'
import iconThemeDark from '@/assets/img/header/header-icon-theme-dark.svg'
import iconLanguage from '@/assets/img/header/header-icon-language.svg'
import iconTimezone from '@/assets/img/header/header-icon-timezone.svg'
import iconUser from '@/assets/img/header/header-icon-user.svg'

const appStore = useAppStore()
const toggleSidebar = () => {
  appStore.toggleSidebar()
}
const { setColorMode } = useColorModes('admin-theme')
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const route = useRoute()
const { locale } = useI18n()
const userState = userStateStore()
const selectedLocale = ref(appStore.locale)
// Only light/dark in UI; initial value follows system if no stored preference
const currentMode = ref<'light' | 'dark'>(appStore.theme === 'dark' ? 'dark' : 'light')

const changePwdShow = ref(false)
const fidoManagementShow = ref(false)
const random8digits = ref('')
const isFidoMode = ref(false)
watch(
  () => appStore.theme,
  (newTheme) => {
    currentMode.value = newTheme === 'dark' ? 'dark' : 'light'
  },
  { immediate: true }
)
// 新增：控制设置弹窗的显示/隐藏
const showSettingsModal = ref(false)

// 打开设置弹窗
const openSettingsModal = () => {
  showSettingsModal.value = true
}

// 关闭设置弹窗
const closeSettingsModal = () => {
  showSettingsModal.value = false
}
const toggleTheme = () => {
  const next = currentMode.value === 'dark' ? 'light' : 'dark'
  setColorMode(next)
  currentMode.value = next
}

const langOptions = getSupportLocaleList()

onMounted(() => {
  const appStore = useAppStoreHook()
  selectedLocale.value = appStore.language
  appStore.toggleFormTitle('')

  // Check if FIDO mode
  isFidoMode.value = import.meta.env.MODE === 'fido'
})

const breadcrumbs = computed(() => {
  return route.matched
    .filter((matchedRoute) => matchedRoute.name !== 'homeView')
    .map((matchedRoute) => ({
      path: matchedRoute.path,
      name: matchedRoute.name,
      meta: matchedRoute.meta
    }))
})

function handleChangeLanguage(selectedLocaleL: string) {
  userState.setLocale(selectedLocaleL)
  locale.value = userState.user.localeBackendValue
  selectedLocale.value = userState.user.locale

  appStore.changeLanguage(userState.user.locale)

  apiUtil.get(`/changeLocale`, { lang: selectedLocaleL }, {}, true)
}

/**
 * 退出登录
 */
const headerLogout = async () => {
  await apiUtil.get(`/${appStore.organ}/index/logout`, null, {}, true)
  logout()
  // Clear routes
  resetRouter()
}

/**
 * 解除绑定mfa
 */
const unbindMFA = async () => {
  swalMessage.confirm(
    i18n.global.t('ui.mfa.confirmUnbind.msg'), // 弹窗内容
    i18n.global.t('ui.mfa.confirmUnbind.title'), // 弹窗标题
    async () => {
      const result = await apiUtil.post(
        '/index/auth/delData',
        {
          accountName: userState.user.account,
          issuerOid: userState.user.issuerOid === '' ? null : userState.user.issuerOid,
          userType: userState.user.userType
        },
        {},
        true
      )

      if (result.success && result.code == '0000') {
        await swalMessage.success(result.message)
        await headerLogout()
      } else {
        await swalMessage.error(result.message)
      }
    }
  )
}
/**
 * 修改密码
 */
const changePassword = async () => {
  const prepareResult = await apiUtil.get('/condition/prepare', null, {}, false)
  random8digits.value = prepareResult.data
  changePwdShow.value = true
}

/**
 * FIDO 管理
 */
const fidoManagement = async () => {
  fidoManagementShow.value = true
}
const timezoneOptions = getTimezoneList()
const systemTimeZone = computed(() => DateTime.local().zoneName)

function handleChangeTimezone(selectedTimeZone: string) {
  userState.setTimeZone(selectedTimeZone)
}

const resetToSystemTimezone = () => {
  userState.setTimeZone(systemTimeZone.value)
}

const langStr = computed(() => getLocaleLabel(appStore.language))
</script>

<style scoped>
/* Bar: design 59px height; background from _theme.scss (light #FFFFFF, dark #21191b) */
.header-bar .header-bar-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 59px;
  gap: 0.5rem;
}

.header-breadcrumb {
  flex: 1;
  min-width: 0;
}

/* Right actions: match design — Bar 59px, circles 34×34, toggle 63×34, colors #F9F1F3 / #E2E8F0 / #9E9E9E */
.header-actions {
  --header-action-size: 34px;
  --header-switch-width: 63px;
  --header-switch-height: 34px;
  --header-switch-bg: rgba(223, 184, 193, 0.2);
  --header-switch-thumb-size: 24px;
  --header-btn-size: 34px;
  --header-btn-bg: #f9f1f3;
  --header-btn-border: #e2e8f0;
  --header-btn-color: #9e9e9e;
  --header-btn-hover-bg: #f0e6e9;
  --header-btn-hover-border: #d9d9d9;
  --header-btn-hover-color: #333;
  --header-btn-icon-size: 20px;
  /* Tint img icons to #9E9E9E (design); use filter so SVG icons match */
  --header-icon-filter: invert(62%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%);
  display: flex;
  align-items: center;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Theme switch: custom button + sliding thumb with img */
.header-theme-switch-btn {
  position: relative;
  display: flex;
  align-items: center;
  width: var(--header-switch-width);
  height: var(--header-switch-height);
  padding: 3px;
  background: var(--header-switch-bg);
  border: none;
  border-radius: 32px;
  cursor: pointer;
  overflow: hidden;
}

/* 統一無反光：拇指無立體／反光效果（Light / Dark 一致） */
.header-theme-switch-thumb {
  position: absolute;
  left: 3px;
  top: 50%;
  transform: translateY(-50%);
  width: var(--header-switch-thumb-size);
  height: var(--header-switch-thumb-size);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.header-theme-switch-thumb.is-dark {
  transform: translateY(-50%) translateX(calc(var(--header-switch-width) - var(--header-switch-thumb-size) - 6px));
}

/* Icon size: design 20px for circle buttons, 16px inside toggle thumb; color #9E9E9E via filter */
.header-action-icon {
  width: var(--header-btn-icon-size);
  height: var(--header-btn-icon-size);
  object-fit: contain;
  display: block;
  filter: var(--header-icon-filter);
}

.header-theme-switch-thumb .header-action-icon {
  width: 16px;
  height: 16px;
  filter: none; /* theme SVGs 已內建 #9E9E9E，不重複套用 filter */
}

.header-btn-circle:hover .header-action-icon {
  filter: invert(20%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%);
}

/* Circle icon buttons: same size as switch height */

.header-btn-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--header-btn-size);
  height: var(--header-btn-size);
  padding: 0;
  background: var(--header-btn-bg);
  border: 0.5px solid var(--header-btn-border);
  border-radius: 50%;
  color: var(--header-btn-color);
  font-size: var(--header-btn-font-size);
  cursor: pointer;
  text-decoration: none;
}

.header-btn-circle:hover {
  background: var(--header-btn-hover-bg);
  border-color: var(--header-btn-hover-border);
  color: var(--header-btn-hover-color);
}

.header-btn-circle-link {
  border: 0.5px solid var(--header-btn-border);
}

/* Language/Timezone/Settings dropdown styles have been moved to _theme.scss (.header-dropdown-*) */
</style>
