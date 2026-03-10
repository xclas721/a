<template>
  <div class="login-form-content">
    <div class="login-form-header">
      <h2>{{ $t('ui.login.header') }}</h2>
      <select
        id="locale"
        :value="language"
        class="form-select"
        @change="$emit('change-language', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="option in langOptions" :key="option.value" :value="option.value" class="dropdown-item">
          {{ option.label }}
        </option>
      </select>
    </div>

    <div v-if="isWebAuthnSupported && isFidoMode">
      <div class="input-group mb-3">
        <button id="btnFidoLogin" type="button" class="form-control btn-fido" @click="$emit('fido-login')">
          <span class="btn-fido-icon btn-fido-icon-left" aria-hidden="true">
            <i class="ri-qr-scan-2-line" aria-hidden="true"></i>
          </span>
          <span class="btn-fido-label">{{ $t('ui.login.fido') }}</span>
          <span class="btn-fido-icon btn-fido-icon-right" aria-hidden="true">
            <i class="ri-arrow-right-line" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="login-divider">
        <span class="login-divider-line" aria-hidden="true"></span>
        <p class="login-divider-text">{{ $t('ui.login.header2') }}</p>
        <span class="login-divider-line" aria-hidden="true"></span>
      </div>
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text"><i class="ri-user-line"></i></span>
      <input
        id="account"
        :value="username"
        class="form-control"
        maxlength="20"
        required
        autofocus
        :placeholder="$t('ui.login.account.placeholder')"
        @input="$emit('update:username', ($event.target as HTMLInputElement).value)"
      />
      <label for="account" hidden>{{ $t('ui.login.account') }}</label>
    </div>

    <div class="input-group mb-3">
      <span class="input-group-text"><i class="ri-lock-password-line"></i></span>
      <input
        :type="passwordVisible ? 'text' : 'password'"
        id="pdfield"
        class="form-control"
        maxlength="40"
        required
        :placeholder="$t('ui.login.password.placeholder')"
        :value="password"
        @input="$emit('update:password', ($event.target as HTMLInputElement).value)"
      />
      <span class="input-group-text" @click="$emit('toggle-password')">
        <i :class="passwordVisible ? 'ri-eye-line' : 'ri-eye-off-line'"></i>
      </span>
      <label for="pdfield" hidden>{{ $t('ui.login.password') }}</label>
    </div>

    <!-- Captcha section -->
    <div class="login-captcha-row mb-4">
      <div class="input-group input-group-captcha">
        <span class="input-group-text"><i class="ri-shield-check-line"></i></span>
        <input
          id="inputCaptchaCode"
          :value="inputCaptchaCode"
          class="form-control"
          maxlength="4"
          required
          :placeholder="$t('ui.login.captcha.code.placeholder')"
          @input="$emit('update:inputCaptchaCode', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <button
        type="button"
        class="login-captcha-link"
        title="Refresh captcha"
        aria-label="Refresh captcha"
        @click="$emit('refresh-captcha')"
      >
        <img :src="captchaImage" class="login-captcha-img" alt="" />
      </button>
    </div>

    <div v-if="error" class="col-12">
      <div class="alert alert-danger error-message">{{ error }}</div>
    </div>

    <input type="hidden" name="contextPath" :value="contextPath" />
    <input type="hidden" name="systemId" :value="systemId" />
    <input type="hidden" name="challenge" :value="challenge" />

    <div class="mt-2">
      <UtilityButton
        id="btnLogin"
        :label="$t('ui.login.submit')"
        variant="primary"
        appearance="contained"
        class="px-4 btn-login-submit"
        :is-label-i18n="false"
        @click="$emit('submit')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UtilityButton from '@/components/UtilityButton.vue'

defineOptions({
  name: 'HostedLoginForm'
})

defineProps<{
  username: string
  password: string
  inputCaptchaCode: string
  passwordVisible: boolean
  language: string
  langOptions: { value: string; label: string }[]
  captchaImage: string
  error: string
  isWebAuthnSupported: boolean
  isFidoMode: boolean
  contextPath: string
  systemId: string
  challenge: string
}>()

defineEmits<{
  'update:username': [value: string]
  'update:password': [value: string]
  'update:inputCaptchaCode': [value: string]
  'change-language': [value: string]
  'toggle-password': []
  'refresh-captcha': []
  submit: []
  'fido-login': []
}>()
</script>

<style scoped lang="scss">
/* Styles are provided by styles/_login-form.scss (.login-form-panel scope). */
</style>
