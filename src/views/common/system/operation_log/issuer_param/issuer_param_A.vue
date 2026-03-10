<template>
  <div class="row">
    <!-- Before change -->
    <div class="col-md-12">
      <template v-if="detailData.action != 'U'">
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.issuerOid, dataBefore.issuerOid) }">
              {{ getOptionsByValue(dataAfter.issuerOid, issuerOptions) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.switch') }}</span>
          <div class="row">
            <div class="col-md-4">
              <p :class="{ 'text-danger': isDifferent(dataAfter.switchVisa, dataBefore.switchVisa) }">
                {{ $t('ui.issuer-param.switchVisa.' + (dataAfter.switchVisa ?? '1')) }}
              </p>
            </div>
            <div class="col-md-4">
              <p
                :class="{
                  'text-danger': isDifferent(dataAfter.switchMastercard, dataBefore.switchMastercard)
                }"
              >
                {{ $t('ui.issuer-param.switchMastercard.' + (dataAfter.switchMastercard ?? '1')) }}
              </p>
            </div>
            <div class="col-md-4">
              <p :class="{ 'text-danger': isDifferent(dataAfter.switchJcb, dataBefore.switchJcb) }">
                {{ $t('ui.issuer-param.switchJcb.' + (dataAfter.switchJcb ?? '1')) }}
              </p>
            </div>
            <div class="col-md-4">
              <p :class="{ 'text-danger': isDifferent(dataAfter.switchAmex, dataBefore.switchAmex) }">
                {{ $t('ui.issuer-param.switchAmex.' + (dataAfter.switchAmex ?? '1')) }}
              </p>
            </div>
            <div class="col-md-4">
              <p
                :class="{
                  'text-danger': isDifferent(dataAfter.switchDiners, dataBefore.switchDiners)
                }"
              >
                {{ $t('ui.issuer-param.switchDiners.' + (dataAfter.switchDiners ?? '1')) }}
              </p>
            </div>
            <div class="col-md-4">
              <p :class="{ 'text-danger': isDifferent(dataAfter.switchCup, dataBefore.switchCup) }">
                {{ $t('ui.issuer-param.switchCup.' + (dataAfter.switchCup ?? '1')) }}
              </p>
            </div>
            <div class="col-md-4">
              <p
                :class="{
                  'text-danger': isDifferent(dataAfter.switchPayNet, dataBefore.switchPayNet)
                }"
              >
                {{ $t('ui.issuer-param.switchPayNet.' + (dataAfter.switchPayNet ?? '1')) }}
              </p>
            </div>
            <div class="col-md-4">
              <p :class="{ 'text-danger': isDifferent(dataAfter.switchMada, dataBefore.switchMada) }">
                {{ $t('ui.issuer-param.switchMada.' + (dataAfter.switchMada ?? '1')) }}
              </p>
            </div>
            <div class="col-md-4">
              <p
                :class="{
                  'text-danger': isDifferent(dataAfter.switchEftPos, dataBefore.switchEftPos)
                }"
              >
                {{ $t('ui.issuer-param.switchEftPos.' + (dataAfter.switchEftPos ?? '1')) }}
              </p>
            </div>
            <div class="col-md-4">
              <p :class="{ 'text-danger': isDifferent(dataAfter.switchTpn, dataBefore.switchTpn) }">
                {{ $t('ui.issuer-param.switchTpn.' + (dataAfter.switchTpn ?? '1')) }}
              </p>
            </div>
          </div>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.authenticationMethod') }}</span>
          <div v-if="dataAfter.formAuthenticationMethod">
            <ul
              style="padding-left: 15px"
              :class="{
                'text-danger': formAuthenticationMethodDifferent(
                  dataAfter.formAuthenticationMethod,
                  dataBefore.authenticationMethod
                )
              }"
            >
              <li v-for="(methodCode, index) in dataAfter.formAuthenticationMethod" :key="index">
                {{ $t('ui.issuer-param.authenticationMethod.' + methodCode) }}
              </li>
            </ul>
          </div>
          <div v-else>N/A</div>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.cardDataInquiryInd') }}</span>
          <p>
            <span
              v-if="dataAfter.cardDataInquiryInd"
              :class="{
                'text-danger': isDifferent(dataAfter.cardDataInquiryInd, dataBefore.cardDataInquiryInd)
              }"
            >
              {{ $t('ui.issuer-param.cardDataInquiryInd.' + dataAfter.cardDataInquiryInd) }}
            </span>
            <span v-else> N/A </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.acct-id-ind') }}</span>
          <p>
            <span
              v-if="dataAfter.acctIdInd"
              :class="{ 'text-danger': isDifferent(dataAfter.acctIdInd, dataBefore.acctIdInd) }"
            >
              {{ $t('ENABLED.' + dataAfter.acctIdInd) }}
            </span>
            <span v-else> N/A </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.trans-lock-ind') }}</span>
          <p>
            <span
              v-if="dataAfter.transLockInd"
              :class="{
                'text-danger': isDifferent(dataAfter.transLockInd, dataBefore.transLockInd)
              }"
            >
              {{ $t('ENABLED.' + dataAfter.transLockInd) }}
            </span>
            <span v-else> N/A </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.lock-duration') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.lockDuration, dataBefore.lockDuration)
              }"
              >{{ valOrNA(dataAfter.lockDuration) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.image-extra-lock-level') }}</span>
          <p
            :class="{
              'text-danger': isDifferent(dataAfter.transLockLevelInd, dataBefore.transLockLevelInd)
            }"
          >
            <span v-if="dataAfter.transLockLevelInd == '0'"> card </span>
            <span v-else-if="dataAfter.transLockLevelInd == '1'"> cardholder </span>
            <span v-else> N/A </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.tel') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.tel, dataBefore.tel) }">{{
              valOrNA(dataAfter.tel)
            }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.oob-app-name') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.oobAppName, dataBefore.oobAppName) }">{{
              valOrNA(dataAfter.oobAppName)
            }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.threeDSRequestorAppURLInd') }}</span>
          <p>
            <span
              v-if="dataAfter.threeDSRequestorAppURLInd"
              :class="{
                'text-danger': isDifferent(dataAfter.threeDSRequestorAppURLInd, dataBefore.threeDSRequestorAppURLInd)
              }"
              >{{ $t('ui.issuer-param.threeDSRequestorAppURLInd.' + dataAfter.threeDSRequestorAppURLInd) }}</span
            >
            <span v-else> N/A </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.authFailedCounterInd') }}</span>
          <p>
            <span
              v-if="dataAfter.authFailedCounterInd"
              :class="{
                'text-danger': isDifferent(dataAfter.authFailedCounterInd, dataBefore.authFailedCounterInd)
              }"
            >
              {{ $t('ui.issuer-param.authFailedCounterInd.' + dataAfter.authFailedCounterInd) }}
            </span>
            <span v-else> N/A </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.auth-failed-limit') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.authFailedLimit, dataBefore.authFailedLimit)
              }"
              >{{ valOrNA(dataAfter.authFailedLimit) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.rba-read-timeout') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.rbaReadTimeout, dataBefore.rbaReadTimeout)
              }"
              >{{ valOrNA(dataAfter.rbaReadTimeout) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.daf-advice-ind') }}</span>
          <p>
            <span
              v-if="dataAfter.dafAdviceInd"
              :class="{
                'text-danger': isDifferent(dataAfter.dafAdviceInd, dataBefore.dafAdviceInd)
              }"
            >
              {{ $t('ui.issuer-param.daf-advice-ind.' + dataAfter.dafAdviceInd) }}
            </span>
            <span v-else> N/A </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.veriid-institute-id') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.instituteId, dataBefore.instituteId) }">{{
              valOrNA(dataAfter.instituteId)
            }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.veriid-operator-id') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.operatorId, dataBefore.operatorId) }">{{
              valOrNA(dataAfter.operatorId)
            }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block"
            >{{ $t('ui.issuer-param.sms-otp-expiry') }} {{ $t('ui.issuer-param.minute') }}</span
          >
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.smsOtpExpiry, dataBefore.smsOtpExpiry)
              }"
              >{{ valOrNA(dataAfter.smsOtpExpiry) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.sms-otp-resend') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.smsOtpResendLimit, dataBefore.smsOtpResendLimit)
              }"
              >{{ valOrNA(dataAfter.smsOtpResendLimit) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.sms-otp-resend-interval') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.smsOtpResendInterval, dataBefore.smsOtpResendInterval)
              }"
              >{{ valOrNA(dataAfter.smsOtpResendInterval) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.creq-app-domain') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.creqAppDomain, dataBefore.creqAppDomain)
              }"
              >{{ valOrNA(dataAfter.creqAppDomain) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.creq-app-port') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.creqAppPort, dataBefore.creqAppPort) }">{{
              valOrNA(dataAfter.creqAppPort)
            }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.creq-brw-domain') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.creqBrwDomain, dataBefore.creqBrwDomain)
              }"
              >{{ valOrNA(dataAfter.creqBrwDomain) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.creq-brw-port') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.creqBrwPort, dataBefore.creqBrwPort) }">{{
              valOrNA(dataAfter.creqBrwPort)
            }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.pd-min-length') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.pdMinLength, dataBefore.pdMinLength) }">{{
              valOrNA(dataAfter.pdMinLength)
            }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.pd-max-length') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.pdMaxLength, dataBefore.pdMaxLength) }">{{
              valOrNA(dataAfter.pdMaxLength)
            }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.login-validate-failed-limit') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.loginValidateFailedLimit, dataBefore.loginValidateFailedLimit)
              }"
              >{{ valOrNA(dataAfter.loginValidateFailedLimit) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.login-lock-expiry') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.loginLockExpiry, dataBefore.loginLockExpiry)
              }"
              >{{ valOrNA(dataAfter.loginLockExpiry) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.issuer-user-pd-expiry') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.pdExpiry, dataBefore.pdExpiry) }">{{
              valOrNA(dataAfter.pdExpiry)
            }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.issuer-user-pd-history') }}</span>
          <p>
            <span :class="{ 'text-danger': isDifferent(dataAfter.pdHistory, dataBefore.pdHistory) }">{{
              valOrNA(dataAfter.pdHistory)
            }}</span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">Visa</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.visaAcsOperatorId, dataBefore.visaAcsOperatorId)
              }"
              >{{ valOrNA(dataAfter.visaAcsOperatorId) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">MasterCard</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.masterCardAcsOperatorId, dataBefore.masterCardAcsOperatorId)
              }"
              >{{ valOrNA(dataAfter.masterCardAcsOperatorId) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">JCB</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.jcbAcsOperatorId, dataBefore.jcbAcsOperatorId)
              }"
              >{{ valOrNA(dataAfter.jcbAcsOperatorId) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">AMEX</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.amexAcsOperatorId, dataBefore.amexAcsOperatorId)
              }"
              >{{ valOrNA(dataAfter.amexAcsOperatorId) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">Diners</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.dinersAcsOperatorId, dataBefore.dinersAcsOperatorId)
              }"
              >{{ valOrNA(dataAfter.dinersAcsOperatorId) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">CUP</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.cupAcsOperatorId, dataBefore.cupAcsOperatorId)
              }"
              >{{ valOrNA(dataAfter.cupAcsOperatorId) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">PayNet</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.payNetAcsOperatorId, dataBefore.payNetAcsOperatorId)
              }"
              >{{ valOrNA(dataAfter.payNetAcsOperatorId) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">Saudi MADA</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.madaAcsOperatorId, dataBefore.madaAcsOperatorId)
              }"
              >{{ valOrNA(dataAfter.madaAcsOperatorId) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">EFTPOS</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.eftPosAcsOperatorId, dataBefore.eftPosAcsOperatorId)
              }"
              >{{ valOrNA(dataAfter.eftPosAcsOperatorId) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">Thai Payment Network</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.tpnAcsOperatorId, dataBefore.tpnAcsOperatorId)
              }"
              >{{ valOrNA(dataAfter.tpnAcsOperatorId) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.cardDataInquiry-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.cardDataInquiryEpsUrl, dataBefore.cardDataInquiryEpsUrl)
              }"
              >{{ valOrNA(dataAfter.cardDataInquiryEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.otp-sms-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.otpSmsEpsUrl, dataBefore.otpSmsEpsUrl)
              }"
              >{{ valOrNA(dataAfter.otpSmsEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.otp-email-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.otpEmailEpsUrl, dataBefore.otpEmailEpsUrl)
              }"
              >{{ valOrNA(dataAfter.otpEmailEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-csc-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.hsmCscEpsUrl, dataBefore.hsmCscEpsUrl)
              }"
              >{{ valOrNA(dataAfter.hsmCscEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-cnv2-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.hsmCvn2EpsUrl, dataBefore.hsmCvn2EpsUrl)
              }"
              >{{ valOrNA(dataAfter.hsmCvn2EpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-cvv-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.hsmCvvEpsUrl, dataBefore.hsmCvvEpsUrl)
              }"
              >{{ valOrNA(dataAfter.hsmCvvEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-spa2-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.hsmSpa2EpsUrl, dataBefore.hsmSpa2EpsUrl)
              }"
              >{{ valOrNA(dataAfter.hsmSpa2EpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-dec-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.hsmDecEpsUrl, dataBefore.hsmDecEpsUrl)
              }"
              >{{ valOrNA(dataAfter.hsmDecEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-enc-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.hsmEncEpsUrl, dataBefore.hsmEncEpsUrl)
              }"
              >{{ valOrNA(dataAfter.hsmEncEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-jws-sign-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.hsmJwsSignEpsUrl, dataBefore.hsmJwsSignEpsUrl)
              }"
              >{{ valOrNA(dataAfter.hsmJwsSignEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-csr-generate-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.hsmCsrGenerateEpsUrl, dataBefore.hsmCsrGenerateEpsUrl)
              }"
              >{{ valOrNA(dataAfter.hsmCsrGenerateEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.dec-auth-request-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.decAuthRequestEpsUrl, dataBefore.decAuthRequestEpsUrl)
              }"
              >{{ valOrNA(dataAfter.decAuthRequestEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.oob-auth-request-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.oobAuthRequestEpsUrl, dataBefore.oobAuthRequestEpsUrl)
              }"
              >{{ valOrNA(dataAfter.oobAuthRequestEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.oob-result-query-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.oobResultQueryEpsUrl, dataBefore.oobResultQueryEpsUrl)
              }"
              >{{ valOrNA(dataAfter.oobResultQueryEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-param.card-security-code-validate-eps-url') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.cvvValidateEpsUrl, dataBefore.cvvValidateEpsUrl)
              }"
              >{{ valOrNA(dataAfter.cvvValidateEpsUrl) }}</span
            >
          </p>
          <hr />
        </div>
      </template>
      <div class="col-md-12 d-flex flex-column" style="height: 165px">
        <span>{{ $t('ui.issuer-param.image-medium') }}</span>
        <div class="mt-auto">
          <p>
            <img alt="" class="mt-2" :src="previews.imageMediumFile" style="max-width: 200px; max-height: 100px" />
          </p>
          <hr />
        </div>
      </div>

      <div class="col-md-12 d-flex flex-column" style="height: 165px">
        <span>{{ $t('ui.issuer-param.image-high') }}</span>
        <div class="mt-auto">
          <p>
            <img alt="" class="mt-2" :src="previews.imageHighFile" style="max-width: 200px; max-height: 100px" />
          </p>
          <hr />
        </div>
      </div>

      <div class="col-md-12 d-flex flex-column" style="height: 165px">
        <span>{{ $t('ui.issuer-param.image-extra') }}</span>
        <div class="mt-auto">
          <p>
            <img alt="" class="mt-2" :src="previews.imageExtraFile" style="max-width: 200px; max-height: 100px" />
          </p>
          <hr />
        </div>
      </div>

      <div class="col-md-12 d-flex flex-column" style="height: 165px">
        <span>{{ $t('ui.issuer-param.image-default') }}</span>
        <div class="mt-auto">
          <p>
            <img alt="" class="mt-2" :src="previews.defaultImageFile" style="max-width: 200px; max-height: 100px" />
          </p>
          <hr />
        </div>
      </div>

      <div class="col-md-12 d-flex flex-column" style="height: 165px">
        <span>{{ $t('ui.issuer-param.image-dark') }}</span>
        <div class="mt-auto">
          <p>
            <img alt="" class="mt-2" :src="previews.darkImageFile" style="max-width: 200px; max-height: 100px" />
          </p>
          <hr />
        </div>
      </div>

      <div class="col-md-12 d-flex flex-column" style="height: 165px">
        <span>{{ $t('ui.issuer-param.image-monochrome') }}</span>
        <div class="mt-auto">
          <p>
            <img alt="" class="mt-2" :src="previews.monochromeImageFile" style="max-width: 200px; max-height: 100px" />
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, reactive } from 'vue'
import ApiUtil from '@/utils/apiUtils'

const props = defineProps<{
  detailData: Record<string, any>
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })

const previews = reactive<Record<string, any>>({
  imageMediumFile: null,
  imageHighFile: null,
  imageExtraFile: null,
  defaultImageFile: null,
  darkImageFile: null,
  monochromeImageFile: null
})
onMounted(async () => {
  const imgParam = [
    { msgType: 'image_medium', fileId: props.dataAfter.imageMedium },
    { msgType: 'image_high', fileId: props.dataAfter.imageHigh },
    { msgType: 'image_extra', fileId: props.dataAfter.imageExtra },
    { msgType: 'spc_image_default', fileId: props.dataAfter.imageDefault },
    { msgType: 'spc_image_dark', fileId: props.dataAfter.imageDark },
    { msgType: 'spc_image_monochrome', fileId: props.dataAfter.imageMonochrome }
  ]
  const imgResult = await apiUtil.post(`/downloads`, imgParam, {}, true)
  // Update formDetails value
  if (imgResult.success && imgResult.code == '0000') {
    previews.imageMediumFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'image_medium')!.bytes

    previews.imageHighFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'image_high')!.bytes

    previews.imageExtraFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'image_extra')!.bytes

    previews.defaultImageFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'spc_image_default')!.bytes

    previews.darkImageFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'spc_image_dark')!.bytes

    previews.monochromeImageFile =
      'data:image/png;base64,' + imgResult.data.find((item: any) => item.msgType === 'spc_image_monochrome')!.bytes
  }
})

const formAuthenticationMethodDifferent = (afterValue: string[], beforeValue: string) => {
  return afterValue.join(',') != beforeValue
}
</script>
