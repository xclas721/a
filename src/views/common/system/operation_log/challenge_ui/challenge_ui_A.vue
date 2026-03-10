<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.issuerOid, dataBefore.issuerOid) }">
            {{ getIssuerOptionsByValue(dataAfter.issuerOid, issuer) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('device.channel') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.deviceChannel, dataBefore.deviceChannel)
            }"
          >
            {{ getOptionsByValue(dataAfter.deviceChannel, deviceChannelOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('select.message.category') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.messageCategory, dataBefore.messageCategory)
            }"
          >
            {{ getOptionsByValue(dataAfter.messageCategory, messageCategoryOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('select.ui.type') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.uiType, dataBefore.uiType) }">
            {{ getOptionsByValue(dataAfter.uiType, uiTypeOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">Qualifier</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.qualifier, dataBefore.qualifier) }">
            {{ valOrNA(dataAfter.qualifier) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">Render</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.render, dataBefore.render) }">
            {{ valOrNA(dataAfter.render) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">ChallengeInfoTextInd</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.challengeInfoTextInd, dataBefore.challengeInfoTextInd)
            }"
          >
            {{ valOrNA(dataAfter.challengeInfoTextInd) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">OobAppUrl</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.oobAppUrl, dataBefore.oobAppUrl) }">
            {{ valOrNA(dataAfter.oobAppUrl) }}
          </span>
        </p>
      </div>

      <template v-for="(challengeUi, index) in dataAfter.challengeUis" :key="index">
        <div class="col-md-12">
          <hr style="border-top: 3px solid #686666" />
          <span class="form-label d-block">
            <template v-for="(line, index) in handleLabel('ui.challenge-ui.locale')" :key="index">
              <div>{{ line }}</div>
            </template></span
          >
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(index, 'locale', challengeUi.locale, dataBefore.challengeUis)
              }"
            >
              <strong>{{ valOrNA(challengeUi.locale) }}</strong>
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ChallengeInfoHeader</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'challengeInfoHeader',
                  challengeUi.challengeInfoHeader,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.challengeInfoHeader) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ChallengeInfoLabel</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'challengeInfoLabel',
                  challengeUi.challengeInfoLabel,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.challengeInfoLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ChallengeInfoText</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'challengeInfoText',
                  challengeUi.challengeInfoText,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.challengeInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">challengeUiSelectInfo</span>
          <p
            :class="{
              'text-danger': isChallengeUiSelectDifferent(
                index,
                challengeUi.challengeUiSelectInfos,
                dataBefore.challengeUis
              )
            }"
          >
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
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'challengeDataEntryLabel',
                  challengeUi.challengeDataEntryLabel,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.challengeDataEntryLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">challengeDataEntryLabelTwo</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'challengeDataEntryLabelTwo',
                  challengeUi.challengeDataEntryLabelTwo,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.challengeDataEntryLabelTwo) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">WhitelistingInfoText</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'whitelistingInfoText',
                  challengeUi.whitelistingInfoText,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.whitelistingInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">TrustListInfoText</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'trustListInfoText',
                  challengeUi.trustListInfoText,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.trustListInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">DeviceBindingInfoText</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'deviceBindingInfoText',
                  challengeUi.deviceBindingInfoText,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.deviceBindingInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">FidoDeviceBindingInfoText</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'fidoDeviceBindingInfoText',
                  challengeUi.fidoDeviceBindingInfoText,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.fidoDeviceBindingInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ExpandInfoLabel1</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'expandInfoLabel',
                  challengeUi.expandInfoLabel,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.expandInfoLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ExpandInfoText1</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'expandInfoText',
                  challengeUi.expandInfoText,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.expandInfoText) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">OobAppLabel</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'oobAppLabel',
                  challengeUi.oobAppLabel,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.oobAppLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">OobContinueLabel</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'oobContinueLabel',
                  challengeUi.oobContinueLabel,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.oobContinueLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">InformationContinuationLabel</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'infoContinueLabel',
                  challengeUi.infoContinueLabel,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.infoContinueLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ResendInfoLabel</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'resendInfoLabel',
                  challengeUi.resendInfoLabel,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.resendInfoLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">ChallengeAddLabel</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'challengeAddLabel',
                  challengeUi.challengeAddLabel,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.challengeAddLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">SubmitAuthLabel</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'submitAuthLabel',
                  challengeUi.submitAuthLabel,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.submitAuthLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">WhyInfoLabel1</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'whyInfoLabel',
                  challengeUi.whyInfoLabel,
                  dataBefore.challengeUis
                )
              }"
            >
              {{ valOrNA(challengeUi.whyInfoLabel) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">WhyInfoText1</span>
          <p>
            <span
              :class="{
                'text-danger': isChallengeUiDifferent(
                  index,
                  'whyInfoText',
                  challengeUi.whyInfoText,
                  dataBefore.challengeUis
                )
              }"
            >
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
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.togglePositionInd, dataBefore.togglePositionInd)
            }"
          >
            {{ valOrNA(dataAfter.togglePositionInd) }}
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
          <span
            :class="{
              'text-danger': isDifferent(
                dataAfter.challengeDataEntryKeyboardType,
                dataBefore.challengeDataEntryKeyboardType
              )
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryKeyboardType) }}
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
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.challengeDataEntryAutofill, dataBefore.challengeDataEntryAutofill)
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryAutofill) }}
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
          <span
            :class="{
              'text-danger': isDifferent(
                dataAfter.challengeDataEntryAutofillType,
                dataBefore.challengeDataEntryAutofillType
              )
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryAutofillType) }}
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
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.challengeDataEntryLengthMax, dataBefore.challengeDataEntryLengthMax)
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryLengthMax) }}
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
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.challengeDataEntryMasking, dataBefore.challengeDataEntryMasking)
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryMasking) }}
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
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.challengeDataEntryToggle, dataBefore.challengeDataEntryToggle)
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryToggle) }}
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
          <span
            :class="{
              'text-danger': isDifferent(
                dataAfter.challengeDataEntryKeyboardTypeTwo,
                dataBefore.challengeDataEntryKeyboardTypeTwo
              )
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryKeyboardTypeTwo) }}
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
          <span
            :class="{
              'text-danger': isDifferent(
                dataAfter.challengeDataEntryAutofillTwo,
                dataBefore.challengeDataEntryAutofillTwo
              )
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryAutofillTwo) }}
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
          <span
            :class="{
              'text-danger': isDifferent(
                dataAfter.challengeDataEntryAutofillTypeTwo,
                dataBefore.challengeDataEntryAutofillTypeTwo
              )
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryAutofillTypeTwo) }}
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
          <span
            :class="{
              'text-danger': isDifferent(
                dataAfter.challengeDataEntryLengthMaxTwo,
                dataBefore.challengeDataEntryLengthMaxTwo
              )
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryLengthMaxTwo) }}
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
          <span
            :class="{
              'text-danger': isDifferent(
                dataAfter.challengeDataEntryMaskingTwo,
                dataBefore.challengeDataEntryMaskingTwo
              )
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryMaskingTwo) }}
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
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.challengeDataEntryToggleTwo, dataBefore.challengeDataEntryToggleTwo)
            }"
          >
            {{ valOrNA(dataAfter.challengeDataEntryToggleTwo) }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getIssuerOptionsByValue, getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import { type BaseSelect, defaultOptionSelect } from '@/utils/select/baseSelect'
import { onMounted, ref } from 'vue'
import { deviceChannelOptionSelect } from '@/utils/select/transStatus'
import { messageCategoryOptionSelect, uiTypeOptionSelect } from '@/utils/select/challengeUi'
import { useI18n } from 'vue-i18n'
import ChallengeUiSelectInfoTable from '@/views/common/system/challenge_ui/ChallengeUiSelectInfoTable.vue'

const props = defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
const { t, locale } = useI18n()
onMounted(() => {
  issuer.value = [...defaultOptionSelect, ...(props.issuerOptions ?? [])]
})
const issuer = ref([...defaultOptionSelect, ...(props.issuerOptions ?? [])])

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

/**
 * Check if a field is different before and after modification
 * @param afterIndex index of modified data
 * @param fieldName field name to compare, e.g. 'locale'
 * @param afterValue after modification的值
 * @param beforeList challengeUis list before modification
 */
const isChallengeUiDifferent = (
  afterIndex: number,
  fieldName: string,
  afterValue: string,
  beforeList: Record<string, any>[]
): boolean => {
  if (beforeList && beforeList.length > 0) {
    const beforeItem = beforeList[afterIndex]
    if (!beforeItem) return true
    return beforeItem[fieldName] != afterValue
  }
  return true
}

const isChallengeUiSelectDifferent = (
  afterIndex: number,
  afterList: Record<string, any>[],
  beforeList: Record<string, any>[]
): boolean => {
  const beforeChallengeUiItem = beforeList[afterIndex]
  if (afterList.length !== beforeChallengeUiItem.challengeUiSelectInfos.length) {
    return true
  }
  // Sort both arrays by itemOrder to ensure consistent order
  const sortedAfter = [...afterList].sort((a, b) => (a.itemOrder || 0) - (b.itemOrder || 0))
  const sortedBefore = [...beforeChallengeUiItem.challengeUiSelectInfos].sort(
    (a, b) => (a.itemOrder || 0) - (b.itemOrder || 0)
  )

  // Compare specified field of each object one by one
  for (let i = 0; i < sortedAfter.length; i++) {
    const afterItem = sortedAfter[i]
    const beforeItem = sortedBefore[i]

    if (
      afterItem.itemName !== beforeItem.itemName ||
      afterItem.itemValue !== beforeItem.itemValue ||
      afterItem.itemOrder !== beforeItem.itemOrder
    ) {
      return true
    }
  }

  return false
}
</script>
