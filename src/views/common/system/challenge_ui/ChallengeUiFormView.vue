<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ computedTitle }}</h5>
          <button
            type="button"
            class="btn-close"
            data-coreui-dismiss="modal"
            aria-label="Close"
            @click="goBack"
          ></button>
        </div>
        <div class="modal-body">
          <div class="border border-light-subtle">
            <div class="header-title">{{ $t('ui.cardholder-status-information') }}</div>
            <div class="content-box p-3">
              <div class="rounded m-0 t-16 row">
                <div v-for="(field, index) in formConfig" :key="index" :class="itemClass(field.colNum)">
                  <div class="order-0 mb-2">
                    <component
                      :is="getComponentType()"
                      :ID="field.ID"
                      :LabelVal="field.label"
                      :type="field.type"
                      v-model="formDate[field.model]"
                      :invalids="field.invalids"
                      :invalidsTxt="field.invalidsTxt"
                      :maxlength="field.maxlength"
                      :placeholder="field.placeholder"
                      :required="field.required"
                      :readOnly="field.readOnly"
                      v-bind="field.props"
                      :validation="valida"
                      @update:invalids="(newInvalids: boolean) => (field.invalids = newInvalids)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-12 mt-3">
            <div class="panel panel-success composite-panel">
              <div style="display: flex">
                <!-- Tag Loop -->
                <div
                  v-for="(entry, index) in formDate.challengeUis"
                  :key="index"
                  class="panel-heading lang"
                  :class="{
                    'heading-active': index === activeIndex,
                    'heading-inactive': index !== activeIndex
                  }"
                  @click="activeIndex = index"
                >
                  <span class="lang-title">
                    <!-- Multi-language Support -->
                    <template v-if="entry.locale === 'en_US'">
                      {{ $t('ui.challenge.en-us') }}
                    </template>
                    <template v-else-if="entry.locale === 'zh_TW'">
                      {{ $t('ui.challenge.zh-tw') }}
                    </template>
                    <template v-else-if="entry.locale === 'zh_CN'">
                      {{ $t('ui.challenge.zh-cn') }}
                    </template>
                    <template v-else>
                      {{
                        entry.locale != null && entry.locale != ''
                          ? entry.locale
                          : $t('ui.challenge-ui.custom-language')
                      }}
                    </template>
                  </span>
                  <button
                    v-if="title != 'DETAIL'"
                    type="button"
                    class="btn btn-delete"
                    @click.stop="removeLanguage(index, entry.locale)"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <!-- Add Language Button -->
                <div style="margin-left: auto" v-if="title != 'DETAIL'">
                  <button type="button" class="btn btn-success" @click="addLanguage">+</button>
                </div>
              </div>

              <div class="border border-start">
                <!-- Panel Content Loop -->
                <div
                  v-for="(entry, index) in formDate.challengeUis"
                  :key="'panel-' + index"
                  class="panel-body composite-panel-body"
                  :style="{ display: index === activeIndex ? '' : 'none' }"
                >
                  <div class="row mt-4">
                    <div class="col-md-3"></div>
                    <div class="col-md-6">
                      <!-- Locale Input Box -->
                      <div class="form-group">
                        <span class="form-label required" :class="[{ 'text-danger': error.locale }]">{{
                          $t('ui.challenge-ui.locale')
                        }}</span>
                        <input
                          class="form-control locale-input"
                          :class="[{ 'input-error': challengeUisError[index]?.locale }]"
                          v-model="entry.locale"
                          maxlength="5"
                          placeholder="ex:en_US"
                          :disabled="title == 'DETAIL'"
                        />
                      </div>
                      <div v-if="challengeUisError[index]?.locale" class="text-danger">
                        {{ $t('warn.can.not.empty') }}
                      </div>
                    </div>
                    <div class="col-md-3"></div>
                  </div>

                  <!-- Image Display -->
                  <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-8" style="text-align: center">
                      <div class="challenge-window">
                        <div class="img-container">
                          <div style="width: 33%">
                            <img
                              alt=""
                              class="img-thumbnail"
                              style="border: none; width: 100%; height: 100%"
                              :src="imgSrc"
                            />
                          </div>
                          <div style="width: 33%">
                            <img alt="" class="img-thumbnail" style="border: none" src="@/assets/img/CardNetwork.png" />
                          </div>
                        </div>

                        <!-- ChallengeInfoHeader -->
                        <div class="form-group" style="width: 70%; margin: 0 auto 25px">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('challenge.info.header')" :key="index">
                              <div v-if="index < handleLabel('challenge.info.header').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}<span style="color: red">*</span></div>
                            </template>
                          </span>
                          <input
                            style="text-align: center"
                            class="form-control"
                            :class="[
                              {
                                'input-error': challengeUisError[index]?.challengeInfoHeader
                              }
                            ]"
                            v-model="entry.challengeInfoHeader"
                            maxlength="45"
                            :disabled="title == 'DETAIL'"
                          />
                          <div v-if="challengeUisError[index]?.challengeInfoHeader" class="text-danger">
                            {{ $t('warn.can.not.empty') }}
                          </div>
                        </div>

                        <div class="form-group">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('challenge.info.text')" :key="index">
                              <div v-if="index < handleLabel('challenge.info.text').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}<span style="color: red">*</span></div>
                            </template>
                          </span>
                          <textarea
                            rows="5"
                            cols="30"
                            class="form-control"
                            :class="[
                              {
                                'input-error': challengeUisError[index]?.challengeInfoText
                              }
                            ]"
                            v-model="entry.challengeInfoText"
                            maxlength="350"
                            :disabled="title == 'DETAIL'"
                          />
                          <div v-if="challengeUisError[index]?.challengeInfoText" class="text-danger">
                            {{ $t('warn.can.not.empty') }}
                          </div>
                        </div>
                        <!--                        challengeUiSelectInfo-->
                        <div class="form-group" v-if="shouldShow('challengeUiSelectInfoContainer')">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('challenge.ui.Select.info')" :key="index">
                              <div v-if="index < handleLabel('challenge.ui.Select.info').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>
                                {{ line }}
                              </div>
                            </template>
                          </span>
                          <ChallengeUiSelectInfoTable
                            v-model="entry.challengeUiSelectInfos"
                          ></ChallengeUiSelectInfoTable>
                          <div v-if="challengeUisError[index]?.challengeUiSelectInfos" class="text-danger">
                            {{ $t('warn.can.not.empty') }}
                          </div>
                        </div>

                        <div class="form-group" v-if="shouldShow('challengeInfoLabelContainer')">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('challenge.info.label')" :key="index">
                              <div v-if="index < handleLabel('challenge.info.label').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>
                                {{ line }}<span v-if="formDate.uiType == '01'" style="color: red">*</span>
                              </div>
                            </template>
                          </span>
                          <input
                            class="form-control"
                            :class="[
                              {
                                'input-error': challengeUisError[index]?.challengeDataEntryLabel
                              }
                            ]"
                            v-model="entry.challengeDataEntryLabel"
                            maxlength="45"
                            :disabled="title == 'DETAIL'"
                          />
                          <div v-if="challengeUisError[index]?.challengeDataEntryLabel" class="text-danger">
                            {{ $t('warn.can.not.empty') }}
                          </div>
                        </div>

                        <div class="form-group" v-if="shouldShow('challengeInformationLabelContainer')">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('challenge.Information.label')" :key="index">
                              <div v-if="index < handleLabel('challenge.Information.label').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>
                                {{ line
                                }}<span v-if="formDate.uiType == '02' || formDate.uiType == '03'" style="color: red"
                                  >*</span
                                >
                              </div>
                            </template>
                          </span>
                          <input
                            class="form-control"
                            :class="[
                              {
                                'input-error': challengeUisError[index]?.challengeInfoLabel
                              }
                            ]"
                            v-model="entry.challengeInfoLabel"
                            maxlength="350"
                            :disabled="title == 'DETAIL'"
                          />
                          <div v-if="challengeUisError[index]?.challengeInfoLabel" class="text-danger">
                            {{ $t('warn.can.not.empty') }}
                          </div>
                        </div>

                        <input
                          v-if="shouldShow('challengeValueContainer')"
                          style="text-align: center"
                          class="form-control mt-2"
                          :placeholder="$t('ui.system.code.input')"
                          disabled
                        />

                        <div class="form-group" v-if="shouldShow('challengeDataEntryLableTwoContainer')">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template
                              v-for="(line, index) in handleLabel('challenge.data.entry.label.two')"
                              :key="index"
                            >
                              <div v-if="index < handleLabel('challenge.data.entry.label.two').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>
                                {{ line }}<span v-if="formDate.uiType == '01'" style="color: red">*</span>
                              </div>
                            </template>
                          </span>
                          <input
                            :class="[
                              {
                                'input-error': challengeUisError[index]?.challengeDataEntryLabelTwo
                              }
                            ]"
                            class="form-control"
                            v-model="entry.challengeDataEntryLabelTwo"
                            maxlength="45"
                            :disabled="title == 'DETAIL'"
                          />
                          <div v-if="challengeUisError[index]?.challengeDataEntryLabelTwo" class="text-danger">
                            {{ $t('warn.can.not.empty') }}
                          </div>
                        </div>

                        <input
                          v-if="shouldShow('challengeDataEntryLableTwoContainer')"
                          style="text-align: center"
                          class="form-control mt-2"
                          :placeholder="$t('ui.system.code.input.two')"
                          disabled
                        />

                        <div class="form-group" v-if="shouldShow('whitelistingInfoTextContainer')">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('whitelisting.Info.Text')" :key="index">
                              <div v-if="index < handleLabel('whitelisting.Info.Text').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}</div>
                            </template>
                          </span>
                          <input
                            class="form-control"
                            v-model="entry.whitelistingInfoText"
                            maxlength="64"
                            :disabled="title == 'DETAIL'"
                          />
                        </div>

                        <div class="form-group">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('trust.list.info.text')" :key="index">
                              <div v-if="index < handleLabel('trust.list.info.text').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }} [EMV 2.3]</div>
                            </template>
                          </span>
                          <input
                            class="form-control"
                            v-model="entry.trustListInfoText"
                            maxlength="64"
                            :disabled="title == 'DETAIL'"
                          />
                        </div>

                        <div class="form-group">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('device.Binding.Info.text')" :key="index">
                              <div v-if="index < handleLabel('device.Binding.Info.text').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}</div>
                            </template>
                          </span>
                          <input
                            class="form-control"
                            v-model="entry.deviceBindingInfoText"
                            maxlength="64"
                            :disabled="title == 'DETAIL'"
                          />
                        </div>

                        <div class="form-group" v-if="shouldShow('fidoDeviceBindingInfoTextContainer')">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('fido.Binding.Info.text')" :key="index">
                              <div v-if="index < handleLabel('fido.Binding.Info.text').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}</div>
                            </template>
                          </span>
                          <input
                            class="form-control"
                            v-model="entry.fidoDeviceBindingInfoText"
                            maxlength="64"
                            :disabled="title == 'DETAIL'"
                          />
                        </div>

                        <div class="form-group">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('submit.auth.label')" :key="index">
                              <div v-if="index < handleLabel('submit.auth.label').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>
                                {{ line
                                }}<span
                                  v-if="formDate.uiType == '01' || formDate.uiType == '02' || formDate.uiType == '03'"
                                  style="color: red"
                                  >*</span
                                >
                              </div>
                            </template>
                          </span>
                          <input
                            style="text-align: center; background: #4684c2"
                            :class="[
                              'form-control',
                              {
                                'input-error': challengeUisError[index]?.submitAuthLabel
                              }
                            ]"
                            v-model="entry.submitAuthLabel"
                            maxlength="45"
                            :disabled="title == 'DETAIL'"
                          />
                          <div v-if="challengeUisError[index]?.submitAuthLabel" class="text-danger">
                            {{ $t('warn.can.not.empty') }}
                          </div>
                        </div>

                        <div class="form-group" v-if="shouldShow('resendInfoLabelContainer')">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('resend.info.label')" :key="index">
                              <div v-if="index < handleLabel('resend.info.label').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}</div>
                            </template>
                          </span>
                          <input
                            class="form-control"
                            v-model="entry.resendInfoLabel"
                            maxlength="45"
                            :disabled="title == 'DETAIL'"
                          />
                        </div>

                        <div class="form-group">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('challenge.additional.label')" :key="index">
                              <div v-if="index < handleLabel('challenge.additional.label').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }} [EMV 2.3]</div>
                            </template>
                          </span>
                          <input
                            :disabled="title == 'DETAIL'"
                            class="form-control"
                            v-model="entry.challengeAddLabel"
                            maxlength="45"
                          />
                        </div>

                        <div class="form-group" v-if="shouldShow('oobContainer')">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('oob.app.label')" :key="index">
                              <div v-if="index < handleLabel('oob.app.label').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}</div>
                            </template>
                          </span>
                          <input
                            class="form-control"
                            v-model="entry.oobAppLabel"
                            maxlength="45"
                            :disabled="title == 'DETAIL'"
                          />
                        </div>

                        <div class="form-group" v-if="shouldShow('oobContainer')">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('oob.continue.label')" :key="index">
                              <div v-if="index < handleLabel('oob.continue.label').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}</div>
                            </template>
                          </span>
                          <input
                            :disabled="title == 'DETAIL'"
                            class="form-control"
                            v-model="entry.oobContinueLabel"
                            maxlength="45"
                          />
                        </div>

                        <div class="form-group" v-if="shouldShow('challengeContinuationLabelContainer')">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('info.continuation.label')" :key="index">
                              <div v-if="index < handleLabel('info.continuation.label').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>
                                {{ line }}<span v-if="formDate.uiType == '07'" style="color: red">*</span>
                              </div>
                            </template>
                          </span>
                          <input
                            :class="[
                              'form-control',
                              {
                                'input-error': challengeUisError[index]?.infoContinueLabel
                              }
                            ]"
                            :disabled="title == 'DETAIL'"
                            class="form-control"
                            v-model="entry.infoContinueLabel"
                            maxlength="45"
                          />
                          <div v-if="challengeUisError[index]?.infoContinueLabel" class="text-danger">
                            {{ $t('warn.can.not.empty') }}
                          </div>
                        </div>

                        <div class="form-group">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('why.info.label1')" :key="index">
                              <div v-if="index < handleLabel('why.info.label1').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}</div>
                            </template>
                          </span>
                          <input
                            :disabled="title == 'DETAIL'"
                            class="form-control"
                            v-model="entry.whyInfoLabel"
                            maxlength="45"
                          />
                        </div>

                        <div class="form-group">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('why.info.text1')" :key="index">
                              <div v-if="index < handleLabel('why.info.text1').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}</div>
                            </template>
                          </span>
                          <textarea
                            :disabled="title == 'DETAIL'"
                            rows="3"
                            cols="30"
                            class="form-control"
                            v-model="entry.whyInfoText"
                            maxlength="256"
                          />
                        </div>

                        <div class="form-group">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('expand.info.label1')" :key="index">
                              <div v-if="index < handleLabel('expand.info.label1').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}</div>
                            </template>
                          </span>
                          <input
                            :disabled="title == 'DETAIL'"
                            class="form-control"
                            v-model="entry.expandInfoLabel"
                            maxlength="45"
                          />
                        </div>

                        <div class="form-group">
                          <span class="form-label"
                            ><!-- 循环渲染分割后的每一部分 -->
                            <template v-for="(line, index) in handleLabel('expand.info.text1')" :key="index">
                              <div v-if="index < handleLabel('expand.info.text1').length - 1">
                                {{ line }}
                              </div>
                              <div v-else>{{ line }}</div>
                            </template>
                          </span>
                          <input
                            :disabled="title == 'DETAIL'"
                            class="form-control"
                            v-model="entry.expandInfoText"
                            maxlength="45"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-2 mt-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="shouldShow('challengeDataEntryBoxContainer')">
            <div class="border border-light-subtle mt-3">
              <div class="header-title">{{ $t('ui.challenge-ui.challenge-data-entry') }}</div>
              <div class="content-box p-3 row">
                <div v-for="(field, index) in dataEntryFormConfig" :key="index" :class="itemClass(field.colNum)">
                  <div class="order-0 mb-2">
                    <component
                      :is="ChallengeFormInput"
                      :ID="field.ID"
                      :LabelVal="field.label"
                      :type="field.type"
                      v-model="formDate[field.model]"
                      :invalids="field.invalids"
                      :invalidsTxt="field.invalidsTxt"
                      :invalidsPattern="field.invalidsPattern"
                      :maxlength="field.maxlength"
                      :placeholder="field.placeholder"
                      :required="field.required"
                      :readOnly="title == 'DETAIL'"
                      v-bind="field.props"
                      :validation="false"
                      @clickUpFunc="(event: any) => handleInputKeyup(field, event)"
                      @update:invalids="(newInvalids: boolean) => (field.invalids = newInvalids)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="border border-light-subtle mt-3">
              <div class="header-title">{{ $t('ui.challenge-ui.challenge-data-entry-two') }}</div>
              <div class="content-box p-3 row">
                <div v-for="(field, index) in dataEntryTwoFormConfig" :key="index" :class="itemClass(field.colNum)">
                  <div class="order-0 mb-2">
                    <component
                      :is="ChallengeFormInput"
                      :ID="field.ID"
                      :LabelVal="field.label"
                      :type="field.type"
                      v-model="formDate[field.model]"
                      :invalids="field.invalids"
                      :invalidsTxt="field.invalidsTxt"
                      :invalidsPattern="field.invalidsPattern"
                      :maxlength="field.maxlength"
                      :placeholder="field.placeholder"
                      :required="field.required"
                      :readOnly="title == 'DETAIL'"
                      v-bind="field.props"
                      :validation="false"
                      @clickUpFunc="(event: any) => handleInputKeyup(field, event)"
                      @update:invalids="(newInvalids: boolean) => (field.invalids = newInvalids)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-footer-buttons mt-2 mb-5" v-if="title != 'DETAIL'">
          <div class="d-flex justify-content-between align-items-center gap-2 w-100">
            <div class="d-flex gap-2">
              <FormButton
                noWrapper
                label="btn.reset"
                type="button"
                variant="primary"
                appearance="outlined"
                @click="resetFormBtn"
              />
            </div>
            <div class="d-flex gap-2">
              <FormButton noWrapper label="btn.cancel" type="button" variant="secondary" @click="goBack" />
              <FormButton noWrapper label="btn.save" type="submit" variant="primary" @click="submit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import FormInput from '@/components/formTable/FormInput.vue'
import FormButton from '@/components/formTable/FormButton.vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { conventTitle } from '@/utils/util'
import swalMessage from '@/plugins/swalMessage'
import { optionSelect } from '@/utils/select/baseSelect'
import {
  challengeDataEntryAutofillOptionSelect,
  challengeDataEntryAutofillTypeOptionSelect,
  challengeDataEntryKeyboardTypeOptionSelect,
  challengeDataEntryMaskingOptionSelect,
  challengeDataEntryToggleOptionSelect
} from '@/utils/select/challengeUi'
import ChallengeFormInput from '@/views/common/system/challenge_ui/ChallengeFormInput.vue'
import ApiUtil from '@/utils/apiUtils'
import HiLogo from '@/assets/img/HiLogo.jpg'
import type { FormField } from '@/components/formTable/FormComponent.vue'
import { validatePattern } from '@/utils/validateUtil'
import ChallengeUiSelectInfoTable from '@/views/common/system/challenge_ui/ChallengeUiSelectInfoTable.vue'

const { t, locale } = useI18n()

// Props
const props = defineProps<{
  formConfig: FormField[]
  title: string
  formDataDetail: Record<string, any>
}>()
const showFlag = ref(false)
const opacity = ref(0.7)
const maskSpace = ref()
const formDate = reactive<Record<string, any>>({
  challengeUis: [
    {
      locale: 'en_US',
      challengeUiSelectInfos: []
    },
    {
      locale: 'zh_TW',
      challengeUiSelectInfos: []
    },
    {
      locale: 'zh_CN',
      challengeUiSelectInfos: []
    }
  ]
})

// Dynamic Status and Behavior
const activeIndex = ref(0)

/**
 * Add Language
 */
const addLanguage = () => {
  if (formDate.challengeUis.length <= 10) {
    formDate.challengeUis.push({
      locale: '',
      challengeInfoHeader: ''
    })
    challengeUisError.push({ ...error })
  }
}
/**
 * Delete语系
 * @param index index
 * @param locale language
 */
const removeLanguage = async (index: number, locale: string) => {
  if (locale == appStore.challengeUiDefaultLocale) {
    await swalMessage.error(t('warn.challengeUi.locale.del.error'))
    return
  }
  await swalMessage.confirm(t('ui.confirm.delete'), '', () => {
    if (activeIndex.value === index) {
      activeIndex.value = 0
    } else {
      activeIndex.value--
    }
    formDate.challengeUis.splice(index, 1)
    challengeUisError.splice(index, 1)
  })
}
// Initialize form object based on formConfig
for (const field of props.formConfig) {
  formDate[field.model] = props.formDataDetail[field.model] || field.default
}
const dataEntryField = reactive({
  challengeDataEntryKeyboardType: '',
  challengeDataEntryAutofill: '',
  challengeDataEntryAutofillType: '',
  challengeDataEntryLengthMax: '',
  challengeDataEntryMasking: '',
  challengeDataEntryToggle: '',
  challengeDataEntryKeyboardTypeTwo: '',
  challengeDataEntryAutofillTwo: '',
  challengeDataEntryAutofillTypeTwo: '',
  challengeDataEntryLengthMaxTwo: '',
  challengeDataEntryMaskingTwo: '',
  challengeDataEntryToggleTwo: ''
})
let challengeUisError = reactive<Record<string, any>[]>([])
const error = reactive<Record<string, any>>({
  locale: false,
  challengeInfoHeader: false,
  challengeInfoText: false,
  challengeDataEntryLabel: false,
  challengeDataEntryLabelTwo: false,
  submitAuthLabel: false,
  infoContinueLabel: false,
  challengeUiSelectInfos: false,
  challengeInfoLabel: false
})
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
for (const _unused of formDate.challengeUis) {
  challengeUisError.push({ ...error })
}
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
const imgSrc = ref(HiLogo)
/**
 * Process Image
 */
const handleImgSrc = async () => {
  if (props.formDataDetail.issuerOid) {
    const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
    const result = await apiUtil.get(
      `/issuer_param/image`,
      { issuerOid: props.formDataDetail.issuerOid, size: 1 },
      {},
      true
    )
    if (result.data) {
      imgSrc.value = 'data:image/png;base64,' + result.data
    }
  }
}
const resetForm = () => {
  for (const field of props.formConfig) {
    field.invalids = false
    formDate[field.model] = field.default
    valida.value = false
  }
  for (const key in dataEntryField) {
    formDate[key] = ''
  }
  imgSrc.value = HiLogo
  formDate.challengeUis = [
    {
      locale: 'en_US',
      challengeUiSelectInfos: []
    },
    {
      locale: 'zh_TW',
      challengeUiSelectInfos: []
    },
    {
      locale: 'zh_CN',
      challengeUiSelectInfos: []
    }
  ]
  resetError()
}
const resetFormBtn = () => {
  if (props.title === 'UPDATE') {
    for (const field of props.formConfig) {
      if (props.formDataDetail[field.model]) {
        formDate[field.model] = props.formDataDetail[field.model]
      } else {
        formDate[field.model] = field.default ?? ''
      }
    }
    for (const key in dataEntryField) {
      formDate[key] = props.formDataDetail[key] ?? ''
    }
    formDate.challengeUis = [...props.formDataDetail.challengeUis]
  } else {
    for (const field of props.formConfig) {
      formDate[field.model] = field.default ?? ''
    }
    for (const key in dataEntryField) {
      formDate[key] = ''
    }
    formDate.challengeUis = [
      {
        locale: 'en_US'
      },
      {
        locale: 'zh_TW'
      },
      {
        locale: 'zh_CN'
      }
    ]
  }
}
watch(
  () => props.formDataDetail,
  (newData) => {
    if (newData) {
      for (const field of props.formConfig) {
        formDate[field.model] = newData[field.model] || field.default
      }
      for (const key in dataEntryField) {
        formDate[key] = newData[key] || ''
      }
      if (newData['oid']) {
        formDate['oid'] = newData['oid']
      }
      if (newData.challengeUis) {
        formDate.challengeUis = JSON.parse(JSON.stringify(newData.challengeUis))
      }
      activeIndex.value = 0
      handleImgSrc()
    }
  },
  { immediate: true }
)

const appStore = useAppStore()
watch(
  () => props.title,
  (newData) => {
    if (newData) {
      const title = conventTitle(newData)
      appStore.toggleFormTitle(t(title))
    }
  },
  { immediate: true }
)
watch(
  () => formDate.uiType,
  (newData) => {
    if (newData != '01') {
      for (const item of challengeUisError) {
        item.challengeInfoLabel = false
      }
    }
  }
)
const goBack = () => {
  // Enable homepage scrollbar
  enablePageScroll()
  resetForm()
  emit('goBack', { ...formDate })
}

const resetError = () => {
  challengeUisError = reactive([])
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  for (const _unused of formDate.challengeUis) {
    challengeUisError.push({ ...error })
  }
}
// Used for formInput component validation. When closing window and model becomes empty, error msg appears. Add this field: set to true (validate) when opening form, set to false (no validation) when closing form.
const valida = ref(true)
const submit = () => {
  let validation = true
  // Check language content
  if (formDate.challengeUis) {
    for (const [index, challengeUi] of formDate.challengeUis.entries()) {
      for (const [errorIndex, item] of challengeUisError.entries()) {
        if (errorIndex == index) {
          for (const valFeildKey in error) {
            if (valFeildKey == 'challengeDataEntryLabel') {
              if (formDate.uiType == '01' && isEmpty(challengeUi.challengeDataEntryLabel)) {
                item.challengeDataEntryLabel = true
                validation = false
              } else {
                item.challengeDataEntryLabel = false
              }
            } else if (valFeildKey == 'challengeDataEntryLabelTwo') {
              if (formDate.uiType == '01' && isEmpty(challengeUi.challengeDataEntryLabelTwo)) {
                item.challengeDataEntryLabelTwo = true
                validation = false
              } else {
                item.challengeDataEntryLabelTwo = false
              }
            } else if (valFeildKey == 'challengeInfoLabel') {
              if (formDate.uiType == '02' || formDate.uiType == '03') {
                if (isEmpty(challengeUi.challengeInfoLabel)) {
                  item.challengeInfoLabel = true
                  validation = false
                  console.log('challengeInfoLabel')
                } else {
                  item.challengeInfoLabel = false
                }
              }
            } else if (valFeildKey == 'submitAuthLabel') {
              if (formDate.uiType == '01' || formDate.uiType == '02' || formDate.uiType == '03') {
                if (isEmpty(challengeUi.submitAuthLabel)) {
                  item.submitAuthLabel = true
                  validation = false
                } else {
                  item.submitAuthLabel = false
                }
              }
            } else if (valFeildKey == 'challengeUiSelectInfos') {
              if (formDate.uiType == '02' || formDate.uiType == '03') {
                if (challengeUi.challengeUiSelectInfos == null || challengeUi.challengeUiSelectInfos.length == 0) {
                  item.challengeUiSelectInfos = true
                  validation = false
                } else {
                  item.challengeUiSelectInfos = false
                }
              }
            } else if (valFeildKey == 'infoContinueLabel') {
              if (formDate.uiType == '07') {
                if (isEmpty(challengeUi.infoContinueLabel)) {
                  item.infoContinueLabel = true
                  validation = false
                } else {
                  item.infoContinueLabel = false
                }
              }
            } else {
              item[valFeildKey] = challengeUi[valFeildKey] == '' || challengeUi[valFeildKey] == null
              validation = validation && !(challengeUi[valFeildKey] == '' || challengeUi[valFeildKey] == null)
            }
          }
        }
      }
    }
  }
  console.log(validation)
  //check form
  for (const field of props.formConfig) {
    if (field.required) {
      field.invalids = false
      if (!formDate[field.model] || formDate[field.model] === '') {
        field.invalids = true
        field.invalidsTxt = 'javax.validation.constraints.NotNull.message'
        validation = false
      }
    }
  }

  for (const field of dataEntryFormConfig.value) {
    // Custom validation passed?
    if (formDate[field.model]) {
      const validateAction = field.validateAction?.(formDate[field.model])
      console.log(validateAction)
      if (validateAction) {
        if (validateAction.result === false) {
          field.invalids = true
          field.invalidsTxt = validateAction.message
          field.invalidsPattern = validateAction.messagePattern
          validation = false
          continue
        }
      }
    }
  }
  for (const field of dataEntryTwoFormConfig.value) {
    if (formDate[field.model]) {
      const validateAction = field.validateAction?.(formDate[field.model])
      console.log(validateAction)
      if (validateAction) {
        if (!validateAction.result) {
          field.invalids = true
          field.invalidsTxt = validateAction.message
          field.invalidsPattern = validateAction.messagePattern
          validation = false
          continue // Only skip current loop
        }
      }
    }
  }

  if (validation) {
    if (formDate.uiType === '01' && formDate.challengeUis) {
      for (const challengeUi of formDate.challengeUis) {
        challengeUi.challengeInfoLabel = challengeUi.challengeDataEntryLabel || ''
      }
    }
    emit('submit', { ...formDate })
    resetError()
    valida.value = false
  }
}

// Computed
const dispalyCss = computed(() => {
  return showFlag.value
    ? `display:block;background:rgba(0,0,0,${opacity.value});`
    : `display:none;background:rgba(0,0,0,${opacity.value});`
})

const getComponentType = () => {
  return FormInput
}
const isEmpty = (val: string | null | undefined): boolean => {
  return !val?.trim()
}
// Methods
function show() {
  showFlag.value = true
  nextTick(() => {
    if (maskSpace.value) {
      maskSpace.value.scrollTop = 0
    }
  })
  valida.value = true

  // Disable homepage scrollbar
  disablePageScroll()
}

/**
 * Return whether to show based on uiType
 * @param containerId input Name
 */
const shouldShow = (containerId: string) => {
  const value = formDate.uiType
  switch (value) {
    case '01':
      return (
        containerId !== 'oobContainer' &&
        containerId !== 'challengeContinuationLabelContainer' &&
        containerId !== 'challengeUiSelectInfoContainer' &&
        containerId !== 'challengeInformationLabelContainer'
      )
    case '02':
    case '03':
      return (
        containerId !== 'challengeInfoLabelContainer' &&
        containerId !== 'challengeValueContainer' &&
        containerId !== 'challengeDataEntryLableTwoContainer' &&
        containerId !== 'whitelistingInfoTextContainer' &&
        containerId !== 'fidoDeviceBindingInfoTextContainer' &&
        containerId !== 'oobContainer' &&
        containerId !== 'oobContainer' &&
        containerId !== 'challengeContinuationLabelContainer' &&
        containerId !== 'resendInfoLabelContainer' &&
        containerId !== 'challengeDataEntryBoxContainer'
      )
    case '04':
    case '06':
      return (
        containerId === 'challengeInfoLabelContainer' ||
        containerId === 'whitelistingInfoTextContainer' ||
        containerId === 'fidoDeviceBindingInfoTextContainer' ||
        containerId === 'oobContainer'
      )
    case '05':
      return (
        containerId === 'challengeInfoLabelContainer' ||
        containerId === 'challengeValueContainer' ||
        containerId === 'challengeDataEntryLableTwoContainer' ||
        containerId === 'whitelistingInfoTextContainer' ||
        containerId === 'fidoDeviceBindingInfoTextContainer' ||
        containerId === 'challengeDataEntryBoxContainer'
      )
    case '07':
      return (
        containerId !== 'challengeInfoLabelContainer' &&
        containerId !== 'challengeDataEntryLableTwoContainer' &&
        containerId !== 'whitelistingInfoTextContainer' &&
        containerId !== 'fidoDeviceBindingInfoTextContainer' &&
        containerId !== 'oobContainer' &&
        containerId !== 'resendInfoLabelContainer' &&
        containerId !== 'challengeUiSelectInfoContainer' &&
        containerId !== 'challengeDataEntryBoxContainer'
      )
    default:
      return true
  }
}

function hide() {
  showFlag.value = false
  formDate.challengeUis = [
    {
      locale: 'en_US'
    },
    {
      locale: 'zh_TW'
    },
    {
      locale: 'zh_CN'
    }
  ]
}

const itemClass = (colNum: string | undefined) => {
  return 'col-md-' + (colNum ?? '6')
}

// Emit the search event
const emit = defineEmits(['submit', 'goBack'])
// Use computed to create dynamic title
const computedTitle = computed(() => {
  return t(conventTitle(props.title))
})

// Disable page scrolling
function disablePageScroll() {
  document.body.style.overflow = 'hidden'
}

// Allow page scrolling
function enablePageScroll() {
  document.body.style.overflow = ''
  appStore.toggleFormTitle('')
}

const challengeDataEntryKeyboardTypeOption = computed(() => [
  ...optionSelect,
  ...challengeDataEntryKeyboardTypeOptionSelect
])
const challengeDataEntryAutofillOption = computed(() => [...optionSelect, ...challengeDataEntryAutofillOptionSelect])
const challengeDataEntryAutofillTypeOption = computed(() => [
  ...optionSelect,
  ...challengeDataEntryAutofillTypeOptionSelect
])
const challengeDataEntryMaskingOption = computed(() => [...optionSelect, ...challengeDataEntryMaskingOptionSelect])
const challengeDataEntryToggleOption = computed(() => [...optionSelect, ...challengeDataEntryToggleOptionSelect])
const dataEntryFormConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'challenge.data.entry.keyboard.type',
    model: 'challengeDataEntryKeyboardType',
    default: '',
    ID: 'challengeDataEntryKeyboardType',
    readOnly: false,
    required: false,
    colNum: '6',
    props: {
      options: challengeDataEntryKeyboardTypeOption
    }
  },
  {
    type: 'checkbox',
    label: 'challenge.data.entry.autofill',
    model: 'challengeDataEntryAutofill',
    default: '',
    ID: 'challengeDataEntryAutofill',
    readOnly: false,
    required: false,
    colNum: '6',
    props: {
      options: challengeDataEntryAutofillOption
    }
  },
  {
    type: 'checkbox',
    label: 'challenge.data.entry.autofill.type',
    model: 'challengeDataEntryAutofillType',
    default: '',
    ID: 'challengeDataEntryAutofillType',
    readOnly: false,
    required: false,
    colNum: '6',
    props: {
      options: challengeDataEntryAutofillTypeOption
    }
  },
  {
    type: 'text',
    label: 'challenge.data.entry.length.max',
    model: 'challengeDataEntryLengthMax',
    default: null,
    ID: 'challengeDataEntryLengthMax',
    readOnly: false,
    required: false,
    colNum: '6',
    placeholder: '01-45',
    maxlength: '2',
    props: {},
    validateAction(val: string) {
      return validatePattern(val, '^(|0[1-9]|[1-3][0-9]|4[0-5])$', 'warn.challengeDataEntryLengthMax.num-only')
    }
  },
  {
    type: 'checkbox',
    label: 'challenge.data.entry.masking',
    model: 'challengeDataEntryMasking',
    default: '',
    ID: 'challengeDataEntryMasking',
    readOnly: false,
    required: false,
    colNum: '6',
    props: {
      options: challengeDataEntryMaskingOption
    }
  },
  {
    type: 'checkbox',
    label: 'challenge.data.entry.toggle',
    model: 'challengeDataEntryToggle',
    default: '',
    ID: 'challengeDataEntryToggle',
    readOnly: false,
    required: false,
    colNum: '6',
    props: {
      options: challengeDataEntryToggleOption
    }
  }
])

const dataEntryTwoFormConfig = ref<FormField[]>([
  {
    type: 'checkbox',
    label: 'challenge.data.entry.keyboard.type.two',
    model: 'challengeDataEntryKeyboardTypeTwo',
    default: '',
    ID: 'challengeDataEntryKeyboardTypeTwo',
    readOnly: false,
    required: false,
    colNum: '6',
    props: {
      options: challengeDataEntryKeyboardTypeOption
    }
  },
  {
    type: 'checkbox',
    label: 'challenge.data.entry.autofill.two',
    model: 'challengeDataEntryAutofillTwo',
    default: '',
    ID: 'challengeDataEntryAutofillTwo',
    readOnly: false,
    required: false,
    colNum: '6',
    props: {
      options: challengeDataEntryAutofillOption
    }
  },
  {
    type: 'checkbox',
    label: 'challenge.data.entry.autofill.type.two',
    model: 'challengeDataEntryAutofillTypeTwo',
    default: '',
    ID: 'challengeDataEntryAutofillTypeTwo',
    readOnly: false,
    required: false,
    colNum: '6',
    props: {
      options: challengeDataEntryAutofillTypeOption
    }
  },
  {
    type: 'text',
    label: 'challenge.data.entry.length.max.two',
    model: 'challengeDataEntryLengthMaxTwo',
    default: null,
    ID: 'challengeDataEntryLengthMaxTwo',
    readOnly: false,
    required: false,
    maxlength: '2',
    placeholder: '01-45',
    colNum: '6',
    props: {},
    validateAction(val: string) {
      return validatePattern(val, '^(|0[1-9]|[1-3][0-9]|4[0-5])$', 'warn.challengeDataEntryLengthMax.num-only')
    }
  },
  {
    type: 'checkbox',
    label: 'challenge.data.entry.masking',
    model: 'challengeDataEntryMaskingTwo',
    default: '',
    ID: 'challengeDataEntryMaskingTwo',
    readOnly: false,
    required: false,
    colNum: '6',
    props: {
      options: challengeDataEntryMaskingOption
    }
  },
  {
    type: 'checkbox',
    label: 'challenge.data.entry.toggle.two',
    model: 'challengeDataEntryToggleTwo',
    default: '',
    ID: 'challengeDataEntryToggleTwo',
    readOnly: false,
    required: false,
    colNum: '6',
    props: {
      options: challengeDataEntryToggleOption
    }
  }
])

/**
 * Input validation
 * @param field field
 * @param event event
 */
function handleInputKeyup(field: FormField, event: KeyboardEvent) {
  const data = (event.target as HTMLInputElement).value
  if (data !== '' && data !== undefined && data !== null) {
    const validateAction = field.validateAction?.(data)
    if (validateAction) {
      if (validateAction.result) {
        field.invalids = false
        field.invalidsTxt = ''
        field.invalidsPattern = []
      } else {
        field.invalids = true
        field.invalidsTxt = validateAction.message
        field.invalidsPattern = validateAction.messagePattern
      }
    }
  } else {
    field.invalids = field.required
    field.invalidsTxt = field.required ? 'javax.validation.constraints.NotNull.message' : ''
    field.invalidsPattern = []
  }
}
defineExpose({
  show,
  hide
})
</script>

<style scoped>
.modal-dialog {
  max-width: 80%;
  margin: 7rem auto;
}

.modal-content {
  border: 0;
}

.panel-heading.lang {
  background-color: var(--cui-tertiary-bg); /* Default gray background */
  width: 9%;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center; /* Horizontal center */
  transition: background-color 0.3s ease;
  position: relative; /* Key: Let X button reference this container */
}

.panel-heading.lang.heading-active {
  background-color: var(--cui-gray-500); /* Light blue background */
}

.panel-heading.lang:hover {
  background-color: var(--cui-gray-300); /* Slightly lighter background on hover */
}

.lang-title {
  flex: 1; /* Let title fill remaining space to ensure center */
  text-align: center; /* Text center */
}

.btn.btn-delete {
  background: transparent;
  border: none;
  color: #999; /* Default X button color */
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s ease;
  position: absolute; /* Absolute positioning */
  right: 2px; /* 10px from right */
  top: 50%; /* Vertically centered */
  transform: translateY(-50%); /* Correct vertical centering */
}

.btn.btn-delete:hover {
  color: #ff4d4f; /* Highlight when hovering X button */
}

.challenge-window {
  border: 1px solid;
  border-radius: 15px;
  padding: 30px;
  margin: 15px 80px;
}

.challenge-window .img-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.form-group {
  font-size: 14px;
  margin-top: 10px;
  font-weight: 700;
}
</style>
