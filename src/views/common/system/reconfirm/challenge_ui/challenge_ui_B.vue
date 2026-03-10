<template>
  <div class="row">
    <!-- After change -->
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
        <span class="form-label d-block">{{ $t('device.channel') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.deviceChannel, deviceChannelOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('select.message.category') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.messageCategory, messageCategoryOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('select.ui.type') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.uiType, uiTypeOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">Qualifier</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.qualifier) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">Render</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.render) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">ChallengeInfoTextInd</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeInfoTextInd) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">OobAppUrl</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.oobAppUrl) }}
          </span>
        </p>
      </div>

      <template v-for="(challengeUi, index) in dataBefore.challengeUis" :key="index">
        <div class="col-md-12">
          <hr style="border-top: 3px solid #686666" />
          <span class="form-label d-block">
            <template v-for="(line, index) in handleLabel('ui.challenge-ui.locale')" :key="index">
              <div>{{ line }}</div>
            </template></span
          >
          <p>
            <span>
              <strong>{{ valOrNA(challengeUi.locale) }}</strong>
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ChallengeInfoHeader</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.challengeInfoHeader) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ChallengeInfoLabel</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.challengeInfoLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ChallengeInfoText</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.challengeInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">challengeUiSelectInfo</span>
          <p>
            <ChallengeUiSelectInfoTable
              v-model="challengeUi.challengeUiSelectInfos"
              readonly
            ></ChallengeUiSelectInfoTable>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">challengeDataEntryLabel</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.challengeDataEntryLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">challengeDataEntryLabelTwo</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.challengeDataEntryLabelTwo) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">WhitelistingInfoText</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.whitelistingInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">TrustListInfoText</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.trustListInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">DeviceBindingInfoText</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.deviceBindingInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">FidoDeviceBindingInfoText</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.fidoDeviceBindingInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ExpandInfoLabel1</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.expandInfoLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ExpandInfoText1</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.expandInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">OobAppLabel</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.oobAppLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">OobContinueLabel</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.oobContinueLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">InformationContinuationLabel</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.infoContinueLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ResendInfoLabel</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.resendInfoLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ChallengeAddLabel</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.challengeAddLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">SubmitAuthLabel</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.submitAuthLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">WhyInfoLabel1</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.whyInfoLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">WhyInfoText1</span>
          <p>
            <span>
              {{ valOrNA(challengeUi.whyInfoText) }}
            </span>
          </p>
        </div>
      </template>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('toggle.position.ind')" :key="index">
            <div>{{ line }}</div>
          </template>
        </span>
        <p>
          <span>
            {{ valOrNA(dataBefore.togglePositionInd) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.keyboard.type')" :key="index">
            <div>{{ line }}</div>
          </template>
        </span>
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryKeyboardType) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.autofill')" :key="index">
            <div>{{ line }}</div>
          </template>
        </span>
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryAutofill) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.autofill.type')" :key="index">
            <div>{{ line }}</div>
          </template></span
        >
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryAutofillType) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.length.max')" :key="index">
            <div>{{ line }}</div>
          </template></span
        >
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryLengthMax) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.masking')" :key="index">
            <div>{{ line }}</div>
          </template></span
        >
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryMasking) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.toggle')" :key="index">
            <div>{{ line }}</div>
          </template></span
        >
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryToggle) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.keyboard.type.two')" :key="index">
            <div>{{ line }}</div>
          </template></span
        >
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryKeyboardTypeTwo) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.autofill.two')" :key="index">
            <div>{{ line }}</div>
          </template></span
        >
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryAutofillTwo) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.autofill.type.two')" :key="index">
            <div>{{ line }}</div>
          </template></span
        >
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryAutofillTypeTwo) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.length.max.two')" :key="index">
            <div>{{ line }}</div>
          </template></span
        >
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryLengthMaxTwo) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.masking')" :key="index">
            <div>{{ line }}</div>
          </template></span
        >
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryMaskingTwo) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">
          <template v-for="(line, index) in handleLabel('challenge.data.entry.toggle.two')" :key="index">
            <div>{{ line }}</div>
          </template></span
        >
        <p>
          <span>
            {{ valOrNA(dataBefore.challengeDataEntryToggleTwo) }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import { type BaseSelect } from '@/utils/select/baseSelect'
import { deviceChannelOptionSelect } from '@/utils/select/transStatus'
import { messageCategoryOptionSelect, uiTypeOptionSelect } from '@/utils/select/challengeUi'
import { useI18n } from 'vue-i18n'
import ChallengeUiSelectInfoTable from '@/views/common/system/challenge_ui/ChallengeUiSelectInfoTable.vue'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
const { t, locale } = useI18n()

/**
 * Handle label line break
 */
const handleLabel = (label: string) => {
  const translatedText = t(label) // Get translated text
  if (locale.value === 'en') {
    return [translatedText] // Return original text for English
  } else {
    // Split into array by `challenge_ui_br`
    return translatedText.split('challenge_ui_br').map((part) => part.trim())
  }
}
</script>
