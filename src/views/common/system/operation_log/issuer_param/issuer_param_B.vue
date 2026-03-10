<template>
  <div class="row">
    <!-- Before change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.issuerOid, issuerOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.switch') }}</span>
        <div class="row">
          <div class="col-md-4">
            <p>{{ $t('ui.issuer-param.switchVisa.' + dataBefore.switchVisa) }}</p>
          </div>
          <div class="col-md-4">
            <p>{{ $t('ui.issuer-param.switchMastercard.' + dataBefore.switchMastercard) }}</p>
          </div>
          <div class="col-md-4">
            <p>{{ $t('ui.issuer-param.switchJcb.' + dataBefore.switchJcb) }}</p>
          </div>
          <div class="col-md-4">
            <p>{{ $t('ui.issuer-param.switchAmex.' + dataBefore.switchAmex) }}</p>
          </div>
          <div class="col-md-4">
            <p>{{ $t('ui.issuer-param.switchDiners.' + dataBefore.switchDiners) }}</p>
          </div>
          <div class="col-md-4">
            <p>{{ $t('ui.issuer-param.switchCup.' + dataBefore.switchCup) }}</p>
          </div>
          <div class="col-md-4">
            <p>{{ $t('ui.issuer-param.switchPayNet.' + dataBefore.switchPayNet) }}</p>
          </div>
          <div class="col-md-4">
            <p>{{ $t('ui.issuer-param.switchMada.' + dataBefore.switchMada) }}</p>
          </div>
          <div class="col-md-4">
            <p>{{ $t('ui.issuer-param.switchEftPos.' + dataBefore.switchEftPos) }}</p>
          </div>
          <div class="col-md-4">
            <p>{{ $t('ui.issuer-param.switchTpn.' + dataBefore.switchTpn) }}</p>
          </div>
        </div>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.authenticationMethod') }}</span>
        <div v-if="dataBefore.authenticationMethod">
          <ul style="padding-left: 15px">
            <li v-for="(methodCode, index) in splitStr(dataBefore.authenticationMethod)" :key="index">
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
          <span v-if="dataBefore.cardDataInquiryInd">
            {{ $t('ui.issuer-param.cardDataInquiryInd.' + dataBefore.cardDataInquiryInd) }}
          </span>
          <span v-else> N/A </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.acct-id-ind') }}</span>
        <p>
          <span v-if="dataBefore.acctIdInd">
            {{ $t('ENABLED.' + dataBefore.acctIdInd) }}
          </span>
          <span v-else> N/A </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.trans-lock-ind') }}</span>
        <p>
          <span v-if="dataBefore.transLockInd">
            {{ $t('ENABLED.' + dataBefore.transLockInd) }}
          </span>
          <span v-else> N/A </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.lock-duration') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.lockDuration) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.image-extra-lock-level') }}</span>
        <p>
          <span v-if="dataBefore.transLockLevelInd == '0'"> card </span>
          <span v-else-if="dataBefore.transLockLevelInd == '1'"> cardholder </span>
          <span v-else> N/A </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.tel') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.tel) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.oob-app-name') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.oobAppName) }}</span>
        </p>
        <hr />
      </div>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.threeDSRequestorAppURLInd') }}</span>
        <p>
          <span v-if="dataBefore.threeDSRequestorAppURLInd">{{
            $t('ui.issuer-param.threeDSRequestorAppURLInd.' + dataBefore.threeDSRequestorAppURLInd)
          }}</span>
          <span v-else> N/A </span>
        </p>
        <hr />
      </div>
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.authFailedCounterInd') }}</span>
        <p>
          <span v-if="dataBefore.authFailedCounterInd">
            {{ $t('ui.issuer-param.authFailedCounterInd.' + dataBefore.authFailedCounterInd) }}
          </span>
          <span v-else> N/A </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.auth-failed-limit') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.authFailedLimit) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.rba-read-timeout') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.rbaReadTimeout) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.daf-advice-ind') }}</span>
        <p>
          <span v-if="dataBefore.dafAdviceInd">
            {{ $t('ui.issuer-param.daf-advice-ind.' + dataBefore.dafAdviceInd) }}
          </span>
          <span v-else> N/A </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.veriid-institute-id') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.instituteId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.veriid-operator-id') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.operatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block"
          >{{ $t('ui.issuer-param.sms-otp-expiry') }} {{ $t('ui.issuer-param.minute') }}</span
        >
        <p>
          <span>{{ valOrNA(dataBefore.smsOtpExpiry) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.sms-otp-resend') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.smsOtpResendLimit) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.sms-otp-resend-interval') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.smsOtpResendInterval) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.creq-app-domain') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.creqAppDomain) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.creq-app-port') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.creqAppPort) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.creq-brw-domain') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.creqBrwDomain) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.creq-brw-port') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.creqBrwPort) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.pd-min-length') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.pdMinLength) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.pd-max-length') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.pdMaxLength) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.login-validate-failed-limit') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.loginValidateFailedLimit) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.login-lock-expiry') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.loginLockExpiry) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.issuer-user-pd-expiry') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.pdExpiry) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.issuer-user-pd-history') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.pdHistory) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">Visa</span>
        <p>
          <span>{{ valOrNA(dataBefore.visaAcsOperatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">MasterCard</span>
        <p>
          <span>{{ valOrNA(dataBefore.masterCardAcsOperatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">JCB</span>
        <p>
          <span>{{ valOrNA(dataBefore.jcbAcsOperatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">AMEX</span>
        <p>
          <span>{{ valOrNA(dataBefore.amexAcsOperatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">Diners</span>
        <p>
          <span>{{ valOrNA(dataBefore.dinersAcsOperatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">CUP</span>
        <p>
          <span>{{ valOrNA(dataBefore.cupAcsOperatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">PayNet</span>
        <p>
          <span>{{ valOrNA(dataBefore.payNetAcsOperatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">Saudi MADA</span>
        <p>
          <span>{{ valOrNA(dataBefore.madaAcsOperatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">EFTPOS</span>
        <p>
          <span>{{ valOrNA(dataBefore.eftPosAcsOperatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">Thai Payment Network</span>
        <p>
          <span>{{ valOrNA(dataBefore.tpnAcsOperatorId) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.cardDataInquiry-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.cardDataInquiryEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.otp-sms-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.otpSmsEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.otp-email-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.otpEmailEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-csc-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.hsmCscEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-cnv2-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.hsmCvn2EpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-cvv-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.hsmCvvEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-spa2-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.hsmSpa2EpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-dec-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.hsmDecEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-enc-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.hsmEncEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-jws-sign-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.hsmJwsSignEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.hsm-csr-generate-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.hsmCsrGenerateEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.dec-auth-request-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.decAuthRequestEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.oob-auth-request-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.oobAuthRequestEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.oob-result-query-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.oobResultQueryEpsUrl) }}</span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-param.card-security-code-validate-eps-url') }}</span>
        <p>
          <span>{{ valOrNA(dataBefore.cvvValidateEpsUrl) }}</span>
        </p>
        <hr />
      </div>

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
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, reactive } from 'vue'
import ApiUtil from '@/utils/apiUtils'

const props = defineProps<{
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
    { msgType: 'image_medium', fileId: props.dataBefore.imageMedium },
    { msgType: 'image_high', fileId: props.dataBefore.imageHigh },
    { msgType: 'image_extra', fileId: props.dataBefore.imageExtra },
    { msgType: 'spc_image_default', fileId: props.dataBefore.imageDefault },
    { msgType: 'spc_image_dark', fileId: props.dataBefore.imageDark },
    { msgType: 'spc_image_monochrome', fileId: props.dataBefore.imageMonochrome }
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

const splitStr = (str: string) => {
  return str.split(',')
}
</script>
