<template>
  <div>
    <LoginLayout :login-locale="language">
      <template #carousel>
        <LoginCarousel />
      </template>
      <template #form>
        <IssuerLoginForm
          v-model:username="username"
          v-model:bank-id="bankId"
          v-model:password="password"
          v-model:input-captcha-code="inputCaptchaCode"
          :password-visible="passwordVisible"
          :language="language"
          :lang-options="langOptions"
          :captcha-image="captchaImage"
          :error="error"
          :is-web-authn-supported="isWebAuthnSupported"
          :is-fido-mode="isFidoMode"
          :context-path="contextPath"
          :system-id="systemId"
          :challenge="challenge"
          @change-language="handleChangeLanguage"
          @toggle-password="togglePasswordVisibility"
          @refresh-captcha="getCaptchaImgCode"
          @submit="handleLogin"
          @fido-login="handleFidoLogin"
        />
      </template>
    </LoginLayout>

    <IssuerLoginUpdatePwd
      v-if="updatePwdShowDetail"
      v-model="updatePwdShowDetail"
      :title="formTitle"
      :user-account="username"
      :bank-id="bankId"
      :login-random8digits="random8digits"
      @refresh-code="refreshCode"
      @login-success="loginSuccess"
      :update-flag="updateFlag"
      :user-data="userData"
    />

    <MfAuth v-if="mfaAuthShowDetail" v-model="mfaAuthShowDetail" :user-data="userData" @refresh-code="refreshCode" />

    <MfAuthValidate
      v-if="mfaAuthValidateShow"
      v-model="mfaAuthValidateShow"
      :user-data="userData"
      @login-success="loginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { login, loginFido } from '@/utils/authUserUtils'
import { getSupportLocaleList } from '@/utils/appProperties'
import { userStateStore, UserType } from '@/stores/user'
import ApiUtil from '@/utils/apiUtils'
import { useAppStoreHook } from '@/stores/app'
import { encrypt } from '@/utils/util'
import LoginLayout from '@/views/common/login/LoginLayout.vue'
import LoginCarousel from '@/views/common/login/LoginCarousel.vue'
import IssuerLoginForm from '@/views/issuer/login/IssuerLoginForm.vue'
import IssuerLoginUpdatePwd from '@/views/issuer/login/IssuerLoginUpdatePwd.vue'
import MfAuth from '@/views/common/login/mfa/MfAuth.vue'
import MfAuthValidate from '@/views/common/login/mfa/MfAuthValidate.vue'
import swalMessage from '@/plugins/swalMessage'
import { HiFidoAssertionByPassKey, challengeValue } from '@/plugins/HiFidoClientSdk'
import { appConfig } from '@/config'

const appStore = useAppStoreHook()

const username = ref('')
const bankId = ref('')
const organ = ref('0')
const issuer = ref('')
const showIssuer = ref(false)
const language = ref(appStore.language)
const password = ref('')
const inputCaptchaCode = ref('')
const passwordVisible = ref(false)
const error = ref('')
const router = useRouter()
const { locale, t } = useI18n()
const userState = userStateStore()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const random8digits = ref('')
const updatePwdShowDetail = ref(false)
const updateFlag = ref(2)
const formTitle = ref<string>('ui.change-password.first-login')
//mfa
const mfaAuthShowDetail = ref(false)
const userData = ref({})
const mfaAuthValidateShow = ref(false)
const contextPath = ref(appConfig.BACKEND_CONTEXT_PATH)
const url = ref(appConfig.API_BASE_URL)
const systemId = ref(appConfig.SYSTEM_ID)
const challenge = ref('')
const isWebAuthnSupported = ref(false)
const isFidoMode = ref(false)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const handleLogin = async () => {
  if (bankId.value === '' || username.value === '' || password.value === '' || inputCaptchaCode.value === '') {
    error.value = t('ui.login.field.notnull')
    return
  } else {
    error.value = ''
  }
  // 1. Get random number
  const prepareResult = await apiUtil.get('/condition/prepare', null, {}, false)
  random8digits.value = prepareResult.data
  // 2. Get Hash algorithm
  const result = await apiUtil.get(
    '/condition/getHashAlgorithm',
    {
      account: username.value,
      organ: 'issuer',
      bankId: bankId.value
    },
    {},
    false
  )
  if (result.code != '0000') {
    inputCaptchaCode.value = ''
    await getCaptchaImgCode()
    await swalMessage.error(result.message)
    return
  }
  // 3. Encrypt account and password
  const encryptPdfield = encrypt(random8digits.value, username.value, password.value, result.data.userHash ?? '')
  const pdfield = '0'.repeat(password.value.length)
  // 4. Login
  const loginForm = {
    random8digits: random8digits.value,
    bankId: bankId.value,
    account: username.value,
    encryptPdfield: encryptPdfield,
    pdfield: pdfield,
    inputCaptchaCode: inputCaptchaCode.value,
    captchaToken: captchaToken.value,
    organ: organ.value,
    issuerOid: issuer.value
  }
  const loginRes = await login(loginForm, 'issuer')
  if (loginRes.success && loginRes.code == '0000') {
    userData.value = loginRes.data
    bankId.value = loginRes.data.bankId
    // First login - 修改密码
    if (loginRes.data.operateSign == '1') {
      userState.setIssuerOid(loginRes.data.issuerOid)
      userState.setBankId(loginRes.data.bankId)
      updatePwdShowDetail.value = true
      updateFlag.value = 1
    }
    // Password expired - Change password
    else if (loginRes.data.operateSign == '2') {
      formTitle.value = 'ui.change-password.expired'
      updatePwdShowDetail.value = true
      updateFlag.value = 2
    }
    // MFA verification code binding
    else if (loginRes.data.operateSign == '3') {
      //userData.value = loginRes.data
      mfaAuthShowDetail.value = true
    }
    // MFA verification code validation
    else if (loginRes.data.operateSign == '4') {
      //userData.value = loginRes.data
      mfaAuthValidateShow.value = true
    }
    // Normal login
    else {
      await loginSuccess(loginRes.data)
    }
  } else {
    await swalMessage.error(loginRes.message)
    inputCaptchaCode.value = ''
    await getCaptchaImgCode()
  }
}

const handleFidoLogin = async () => {
  // RP USER Username is TaxId + ":" + Account
  let userName = ''
  if (bankId.value && username.value) {
    userName = bankId.value + ':' + username.value
  }
  doAssertion(userName)
}

/**
 * Login success trigger function
 */
const loginSuccess = async (result: Record<string, any>, isFidoLogin: boolean = false) => {
  // Clear FIDO login data only when logging in with normal account/password, to avoid clearing own data during FIDO login
  if (!isFidoLogin) {
    try {
      sessionStorage.removeItem('fidoLoginData')
      localStorage.removeItem('fidoLoginData')
    } catch (error) {
      console.warn('無法清除 FIDO 登入資料:', error)
    }
  }

  userState.setLogin(true)
  userState.setUserName(result.userName)
  userState.setAccount(result.userAccount)
  userState.setUserType(result.userType)
  userState.setIssuerOid(result.issuerOid ?? '')
  userState.setMfa(result.mfaBinding)
  userState.setFidoEnabled(result.fidoEnabled ?? '0')
  userState.setType(UserType.Issuer)
  userState.setLocale(language.value)
  userState.setBankId(bankId.value)
  appStore.changeLanguage(userState.user.locale)

  //get menu
  const menu = await apiUtil.post('/menu/getMenu', null, {}, true)
  if (menu.success && menu.data != null) {
    userState.setMenu(menu.data)
  }
  // Get backend configuration
  const config = await apiUtil.get(`/condition/queryConfig`, {}, {}, false)
  if (config.success && config.code == '0000') {
    appStore.changeChallengeUiDefaultLocale(config.data.adminConfigLocale)
    appStore.changeMaxFileSize(config.data.maxFileSize * 1024 * 1024)
  }

  // Jump after login success: check if there is redirect parameter
  const redirect = route.query.redirect as string
  if (redirect) {
    // Cache redirect, let permission.ts handle jump after loading dynamic routes
    sessionStorage.setItem('pendingRedirect', decodeURIComponent(redirect))
  }
  await router.push('/')
}

const langOptions = getSupportLocaleList()
const handleChangeLanguage = (selectedLocale: string) => {
  userState.setLocale(selectedLocale)
  language.value = selectedLocale
  locale.value = userState.user.localeBackendValue
  appStore.changeLanguage(userState.user.locale)
}

onMounted(async () => {
  appStore.changeOrgan('issuer')
  locale.value = appStore.locale
  await getCaptchaImgCode()

  const result = await apiUtil.get('/condition/prepare', null, {}, false)
  random8digits.value = result.data

  if (globalThis.PublicKeyCredential) {
    isWebAuthnSupported.value = true
  }
  isFidoMode.value = import.meta.env.MODE === 'fido'
})

watch(organ, (newVal) => {
  showIssuer.value = newVal !== '0'
})
const captchaToken = ref('')
const captchaImage = ref('')

const getCaptchaImgCode = async () => {
  const result = await apiUtil.get('/index/captcha', null, {}, false)
  captchaImage.value = 'data:image/jpeg;base64,' + result.data.img
  captchaToken.value = result.data.token
}

/**
 * Refresh verification code
 */
const refreshCode = async () => {
  inputCaptchaCode.value = ''
  await getCaptchaImgCode()

  password.value = ''
}

async function processFidoResult(jsonData: any, isFailure: boolean = false): Promise<Record<string, any>> {
  let bankID, userName

  if (jsonData && jsonData.userData && jsonData.userData.username) {
    const parts = jsonData.userData.username.split(':')
    bankID = parts.length === 2 ? parts[0] : bankId.value
    userName = parts.length === 2 ? parts[1] : username.value
  }
  // 1.Login
  const loginForm = {
    bankId: bankID || bankId.value,
    account: userName || username.value,
    organ: organ.value,
    issuerOid: issuer.value,
    challenge: challengeValue.value,
    isFailure: isFailure
  }
  const loginRes = await loginFido(loginForm, 'issuer')
  return loginRes
}

function doAssertion(userName: string) {
  // Process FIDO required info
  const currentUrl = globalThis.location.href
  const domain = new URL(currentUrl)
  const rpId = domain.hostname
  console.log('rpId = ' + rpId)
  console.log('systemId = ' + systemId.value)
  console.log('contextPath.value = ' + contextPath.value)

  const rpUrl = url.value + '/api'
  console.log('rpUrl = ' + rpUrl)
  console.log('userName = ' + userName)

  if (globalThis.PublicKeyCredential) {
    console.log('Supported, start assertion')
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((available) => {
      if (available) {
        console.log('Platform Authenticator Supported.')
        HiFidoAssertionByPassKey(rpUrl, systemId.value, userName, '', null, '').then(
          (jsonData) => {
            // Save FIDO login info to sessionStorage
            try {
              sessionStorage.setItem('fidoLoginData', JSON.stringify(jsonData))
            } catch (error) {
              console.warn('無法儲存 FIDO 登入資訊:', error)
            }

            processFidoResult(jsonData, false).then((loginRes) => {
              if (loginRes.success && loginRes.code == '0000') {
                userData.value = loginRes.data
                bankId.value = loginRes.data.bankId
                loginSuccess(loginRes.data, true)
              } else {
                swalMessage.error(loginRes.message)
                inputCaptchaCode.value = ''
                getCaptchaImgCode()
              }
            })
          },
          (error_) => {
            swalMessage.error(error_)

            // Check if it is an error type that needs to notify backend
            const shouldNotifyBackend = error_.includes(t('fido.cumulative.failure.count'))

            if (shouldNotifyBackend) {
              // Notify backend failure
              processFidoResult({ userData: null }, true).catch(() => {
                // Ignore error, main purpose is to notify backend
              })
            }

            inputCaptchaCode.value = ''
            getCaptchaImgCode()
          }
        )
      } else {
        console.log('WebAuthn supported, Platform Authenticator *not* supported.')
        swalMessage.error('WebAuthn supported, Platform Authenticator *not* supported.')
      }
    })
  } else {
    console.log('Browser not supported WebAuthn!')
    swalMessage.error('Browser not supported WebAuthn!')
  }
}

const route = useRoute()
watch(route, () => {
  getCaptchaImgCode()
})
</script>
