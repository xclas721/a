<template>
  <div class="row">
    <!-- Before change -->
    <div class="col-md-12">
      <!-- Issuer -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.issuerOid, issuerOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <!-- Password min length -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.pd-min-length') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.pdMinLength) }}
          </span>
        </p>
        <hr />
      </div>

      <!-- Password max length -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.pd-max-length') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.pdMaxLength) }}
          </span>
        </p>
        <hr />
      </div>

      <!-- Password Rules -->
      <div class="col-md-12">
        <hr />
      </div>

      <!-- Password content rules -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.pd-content-rule') }}</span>
        <p>
          <span>
            {{ getPdContentRuleText(dataBefore.pdContentRule) }}
          </span>
        </p>
        <hr />
      </div>

      <!-- Strong password restriction -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.pd-restrict') }}</span>
        <p>
          <span>
            {{ getPdRestrictText(dataBefore.pdRestrict) }}
          </span>
        </p>
        <hr />
      </div>

      <!-- Login validation failure count -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.login-validate-failed-limit') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.loginValidateFailedLimit) }}
          </span>
        </p>
        <hr />
      </div>

      <!-- Login failure lockout time -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.login-lock-expiry') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.loginLockExpiry) }}
          </span>
        </p>
        <hr />
      </div>

      <!-- Password validity period -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.issuer-user-pd-expiry') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.pdExpiry) }}
          </span>
        </p>
        <hr />
      </div>

      <!-- History password non-repeatable count -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.issuer-user-pd-history') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.pdHistory) }}
          </span>
        </p>
        <hr />
      </div>

      <!-- MFA Two-factor authentication -->
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.mfa') }}</span>
        <p>
          <span>
            {{ getMfaText(dataBefore.mfaInd) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()

// Password content rule text conversion
const getPdContentRuleText = (value: any) => {
  if (!value) return valOrNA(value)

  const rules = Array.isArray(value) ? value : value.split(',')
  const ruleTexts = rules.map((rule: string) => {
    switch (rule.trim()) {
      case '0':
        return '數字'
      case '1':
        return '大寫字母'
      case '2':
        return '小寫字母'
      case '3':
        return 'Special symbols [!@#$%^&*_-]'
      default:
        return rule
    }
  })

  return ruleTexts.join(', ')
}

// Strong password restriction text conversion
const getPdRestrictText = (value: any) => {
  if (value === '0') return '可使用常見密碼'
  if (value === '1') return '不可使用常見密碼'
  return valOrNA(value)
}

// MFA text conversion
const getMfaText = (value: any) => {
  if (value === '0') return '關閉'
  if (value === '1') return '開啟'
  return valOrNA(value)
}
</script>
