<template>
  <div ref="maskSpace" :style="dispalyCss" :class="['modal fade', { show: showFlag }]">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ computedTitle }}</h5>
          <button
            type="button"
            class="btn-close"
            data-coreui-dismiss="modal"
            aria-label="Close"
            @click="goBack"
          ></button>
        </div>

        <div class="modal-body">
          <div class="p-3">
            <div class="rounded m-0 t-16 row">
              <!-- (1)Issuer Bank -->
              <div class="col-md-12 mb-3">
                <div class="form-group">
                  <span :class="['required', { 'text-danger': error.issuerOid }]">
                    {{ $t('ui.issuer.name')
                    }}<!--發卡銀行-->
                  </span>
                  <select
                    v-model="formData.issuerOid"
                    :class="['form-control', { 'input-error': error.issuerOid }]"
                    :disabled="formTitle == 'DETAIL' || formTitle == 'UPDATE'"
                  >
                    <option v-for="option in issuerOptions" :key="option.value" :value="option.value">
                      {{ isBaseI18nSelect(option) ? t(option.i18nText) : option.text }}
                    </option>
                  </select>
                </div>
                <div v-if="error.issuerOid" class="text-danger">
                  {{ $t('warn.can.not.empty') }}
                </div>
              </div>
              <!-- Data Edit Area - Bank Parameter Management -->
              <div class="col-md-6">
                <div class="row">
                  <!-- Transaction Parameter Card -->
                  <div class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.trans-param') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- (4)Transaction Channel -->
                          <div class="col-md-12 mt-1">
                            <div class="form-group">
                              <span>
                                {{ $t('ui.issuer-param.switch')
                                }}<!--交易管道   -->
                              </span>
                              <div class="row">
                                <!-- First div: Visa, Diners, EFTPOS -->
                                <div class="col-md-3 switch-column">
                                  <label class="switch-check">
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL'"
                                      :checked="formData.switchVisa == 0"
                                      @change="
                                        formData.switchVisa = ($event.target as HTMLInputElement).checked ? 0 : 1
                                      "
                                    />
                                    Visa</label
                                  >
                                  <label class="switch-check">
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL'"
                                      :checked="formData.switchDiners == 0"
                                      @change="
                                        formData.switchDiners = ($event.target as HTMLInputElement).checked ? 0 : 1
                                      "
                                    />
                                    Diners</label
                                  >
                                  <label class="switch-check">
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL'"
                                      :checked="formData.switchEftPos == 0"
                                      @change="
                                        formData.switchEftPos = ($event.target as HTMLInputElement).checked ? 0 : 1
                                      "
                                    />
                                    EFTPOS</label
                                  >
                                </div>
                                <!-- Second div: MasterCard, CUP, Thai Payment Network -->
                                <div class="col-md-3 switch-column">
                                  <label class="switch-check">
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL'"
                                      :checked="formData.switchMastercard == 0"
                                      @change="
                                        formData.switchMastercard = ($event.target as HTMLInputElement).checked ? 0 : 1
                                      "
                                    />
                                    Mastercard</label
                                  >
                                  <label class="switch-check">
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL'"
                                      :checked="formData.switchCup == 0"
                                      @change="formData.switchCup = ($event.target as HTMLInputElement).checked ? 0 : 1"
                                    />
                                    Cup</label
                                  >
                                  <label class="switch-check">
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL'"
                                      :checked="formData.switchTpn == 0"
                                      @change="formData.switchTpn = ($event.target as HTMLInputElement).checked ? 0 : 1"
                                    />
                                    TPN</label
                                  >
                                </div>
                                <!-- Third div: JCB, PayNet -->
                                <div class="col-md-3 switch-column">
                                  <label class="switch-check">
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL'"
                                      :checked="formData.switchJcb == 0"
                                      @change="formData.switchJcb = ($event.target as HTMLInputElement).checked ? 0 : 1"
                                    />
                                    Jcb</label
                                  >
                                  <label class="switch-check">
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL'"
                                      :checked="formData.switchPayNet == 0"
                                      @change="
                                        formData.switchPayNet = ($event.target as HTMLInputElement).checked ? 0 : 1
                                      "
                                    />
                                    PayNet</label
                                  >
                                </div>
                                <!-- Fourth div: AMEX, Saudi MADA -->
                                <div class="col-md-3 switch-column">
                                  <label class="switch-check">
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL'"
                                      :checked="formData.switchAmex == 0"
                                      @change="
                                        formData.switchAmex = ($event.target as HTMLInputElement).checked ? 0 : 1
                                      "
                                    />
                                    Amex</label
                                  >
                                  <label class="switch-check">
                                    <input
                                      type="checkbox"
                                      :disabled="formTitle == 'DETAIL'"
                                      :checked="formData.switchMada == 0"
                                      @change="
                                        formData.switchMada = ($event.target as HTMLInputElement).checked ? 0 : 1
                                      "
                                    />
                                    Saudi MADA</label
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Supported Authentication Method Card -->
                  <div class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.authentication-methods') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- App / Browser / 3RI Transaction settings for supported authentication methods -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span :class="['required', { 'text-danger': error.formAuthenticationMethod }]">{{
                                $t('ui.issuer-param.authenticationMethod')
                              }}</span>
                            </div>

                            <!-- SMS OTP and OTP Other (Email) are supported by default -->
                            <div class="row">
                              <!-- Left side authentication method -->
                              <div class="col-md-6">
                                <label
                                  v-for="option in authenticationMethods.slice(0, 8)"
                                  :key="option.value"
                                  :class="[{ 'text-danger': error.formAuthenticationMethod }]"
                                  style="
                                    margin-left: 0;
                                    width: 100%;
                                    vertical-align: top;
                                    display: block;
                                    margin-bottom: 4px;
                                  "
                                >
                                  <input
                                    type="checkbox"
                                    :value="option.value"
                                    :disabled="formTitle == 'DETAIL'"
                                    :class="[{ 'input-error': error.formAuthenticationMethod }]"
                                    v-model="formData.formAuthenticationMethod"
                                  />
                                  {{ option.label }}
                                </label>
                              </div>
                              <!-- Right side authentication method -->
                              <div class="col-md-6">
                                <label
                                  v-for="option in authenticationMethods.slice(8, 16)"
                                  :key="option.value"
                                  :class="[{ 'text-danger': error.formAuthenticationMethod }]"
                                  style="
                                    margin-left: 0;
                                    width: 100%;
                                    vertical-align: top;
                                    display: block;
                                    margin-bottom: 4px;
                                  "
                                >
                                  <input
                                    type="checkbox"
                                    :value="option.value"
                                    :disabled="formTitle == 'DETAIL'"
                                    :class="[{ 'input-error': error.formAuthenticationMethod }]"
                                    v-model="formData.formAuthenticationMethod"
                                  />
                                  {{ option.label }}
                                </label>
                              </div>
                            </div>
                            <div v-if="error.formAuthenticationMethod" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Security Control Card -->
                  <div class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.security-controls') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- Card Lock Mechanism -->
                          <div class="col-md-12 mt-1">
                            <div class="row">
                              <!-- Transaction Lock Indicator (Left) -->
                              <div class="col-md-6">
                                <span :class="['required', { 'text-danger': error.transLockInd }]">
                                  {{ $t('ui.issuer-param.trans-lock-ind') }}
                                  <!-- Transaction Lock Indicator -->
                                </span>
                                <div>
                                  <label class="me-3">
                                    <input
                                      type="radio"
                                      value="1"
                                      v-model="formData.transLockInd"
                                      :disabled="formTitle == 'DETAIL'"
                                    />
                                    <span :class="[{ 'text-danger': error.transLockInd }]">
                                      &nbsp;{{ $t('ENABLED.1') }}
                                    </span>
                                  </label>
                                  <label>
                                    <input
                                      type="radio"
                                      value="0"
                                      v-model="formData.transLockInd"
                                      :disabled="formTitle == 'DETAIL'"
                                    />
                                    <span :class="[{ 'text-danger': error.transLockInd }]">
                                      &nbsp;{{ $t('ENABLED.0') }}
                                    </span>
                                  </label>
                                </div>
                                <div v-if="error.transLockInd" class="text-danger">
                                  {{ $t('warn.can.not.empty') }}
                                </div>
                              </div>
                              <!-- Transaction Lock Level Indicator (Right) -->
                              <div class="col-md-6">
                                <span :class="['required', { 'text-danger': error.transLockLevelInd }]">
                                  {{ $t('ui.issuer-param.image-extra-lock-level') }}
                                  <!-- Transaction Lock Level Indicator -->
                                </span>
                                <div>
                                  <label>
                                    <input
                                      type="radio"
                                      value="0"
                                      v-model="formData.transLockLevelInd"
                                      :disabled="formTitle == 'DETAIL'"
                                    />
                                    <span :class="[{ 'text-danger': error.transLockLevelInd }]"> &nbsp;card </span>
                                  </label>
                                  <label class="ms-3">
                                    <input
                                      type="radio"
                                      value="1"
                                      v-model="formData.transLockLevelInd"
                                      :disabled="formTitle == 'DETAIL'"
                                    />
                                    <span :class="[{ 'text-danger': error.transLockLevelInd }]">
                                      &nbsp;cardholder
                                    </span>
                                  </label>
                                </div>
                                <div v-if="error.transLockLevelInd" class="text-danger">
                                  {{ $t('warn.can.not.empty') }}
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Auto Unlock Interval -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  {
                                    required: formData.transLockInd == '1',
                                    'text-danger': error.lockDuration
                                  }
                                ]"
                              >
                                {{ $t('ui.issuer-param.lock-duration')
                                }}<!--自動解鎖時間間隔-->
                              </span>
                              <input
                                id="lockDuration"
                                :class="['form-control', { 'input-error': error.lockDuration }]"
                                maxlength="4"
                                :placeholder="$t('ui.issuer-param.lock-duration.placeholder')"
                                :disabled="isLockDurationDisabled || formTitle == 'DETAIL'"
                                v-model="formData.lockDuration"
                                oninput="value = value.replace(/\D/g, '')"
                              />
                              <div v-if="error.lockDuration" class="text-danger">
                                {{ $t('warn.can.not.empty') }}
                              </div>
                            </div>
                          </div>

                          <!-- Validation Failure Handling -->
                          <div class="col-md-12 mt-1">
                            <div class="row">
                              <!-- Validation Failure Accumulation Indicator (Left) -->
                              <div class="col-md-6">
                                <div>
                                  <span :class="['required', { 'text-danger': error.authFailedCounterInd }]">
                                    {{ $t('ui.issuer-param.authFailedCounterInd') }}
                                    <!-- Validation Failure Accumulation Indicator -->
                                  </span>
                                  <div>
                                    <label>
                                      <input
                                        type="radio"
                                        :disabled="formTitle == 'DETAIL'"
                                        v-model="formData.authFailedCounterInd"
                                        value="0"
                                      />
                                      <span :class="[{ 'text-danger': error.authFailedCounterInd }]"
                                        >&nbsp;{{ $t('ui.issuer-param.authFailedCounterInd.0') }}</span
                                      >
                                    </label>
                                    <label class="ms-3">
                                      <input
                                        type="radio"
                                        :disabled="formTitle == 'DETAIL'"
                                        v-model="formData.authFailedCounterInd"
                                        value="1"
                                      />
                                      <span :class="[{ 'text-danger': error.authFailedCounterInd }]"
                                        >&nbsp;{{ $t('ui.issuer-param.authFailedCounterInd.1') }}</span
                                      >
                                    </label>
                                  </div>
                                  <div v-if="error.authFailedCounterInd" class="text-danger">
                                    {{ $t('warn.can.not.empty') }}
                                  </div>
                                </div>
                              </div>
                              <!-- Validation Failure Count Limit (Right) -->
                              <div class="col-md-6">
                                <div>
                                  <span :class="['required', { 'text-danger': error.authFailedLimit }]">
                                    {{ $t('ui.issuer-param.auth-failed-limit') }}
                                    <!-- Validation Failure Count Limit -->
                                  </span>
                                  <input
                                    id="authFailedLimit"
                                    v-model="formData.authFailedLimit"
                                    :disabled="formTitle == 'DETAIL'"
                                    :class="['form-control', { 'input-error': error.authFailedLimit }]"
                                    maxlength="2"
                                    :placeholder="$t('ui.issuer-param.sms-otp-resend-control')"
                                    oninput="value = value.replace(/\D/g, '')"
                                  />
                                </div>
                                <div v-if="error.authFailedLimit" class="text-danger">
                                  {{ $t('warn.can.not.empty') }}
                                </div>
                              </div>
                            </div>
                            <!-- ID Number Validation Indicator -->
                            <div class="col-md-12 mt-1">
                              <div>
                                <span :class="['required', { 'text-danger': error.acctIdInd }]">
                                  <!-- ID Number Validation Indicator -->
                                  {{ $t('ui.issuer-param.acct-id-ind') }}
                                </span>
                                <div>
                                  <label class="me-3">
                                    <input
                                      type="radio"
                                      value="1"
                                      v-model="formData.acctIdInd"
                                      :disabled="formTitle == 'DETAIL'"
                                    />
                                    <span :class="[{ 'text-danger': error.acctIdInd }]"
                                      >&nbsp;{{ $t('ENABLED.1') }}</span
                                    >
                                  </label>
                                  <label>
                                    <input
                                      type="radio"
                                      value="0"
                                      v-model="formData.acctIdInd"
                                      :disabled="formTitle == 'DETAIL'"
                                    />
                                    <span :class="[{ 'text-danger': error.acctIdInd }]"
                                      >&nbsp;{{ $t('ENABLED.0') }}</span
                                    >
                                  </label>
                                </div>
                                <div v-if="error.acctIdInd" class="text-danger">
                                  {{ $t('warn.can.not.empty') }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Card Data Query Sync Indicator Card -->
                  <div class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.card-data-inquiry-sync') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- Card Data Query Sync Note -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span :class="['required', { 'text-danger': error.cardDataInquiryInd }]">
                                {{ $t('ui.issuer-param.cardDataInquiryInd')
                                }}<!--卡片資料查詢同步註記-->
                              </span>
                              <div>
                                <label class="me-3">
                                  <input
                                    :disabled="formTitle == 'DETAIL'"
                                    type="radio"
                                    value="0"
                                    v-model="formData.cardDataInquiryInd"
                                  />
                                  <span :class="[{ 'text-danger': error.cardDataInquiryInd }]"
                                    >&nbsp;{{ $t('ui.issuer-param.cardDataInquiryInd.0') }}</span
                                  >
                                </label>
                                <label>
                                  <input
                                    :disabled="formTitle == 'DETAIL'"
                                    type="radio"
                                    value="1"
                                    v-model="formData.cardDataInquiryInd"
                                  />
                                  <span :class="[{ 'text-danger': error.cardDataInquiryInd }]"
                                    >&nbsp;{{ $t('ui.issuer-param.cardDataInquiryInd.1') }}</span
                                  >
                                </label>
                              </div>
                              <div v-if="error.cardDataInquiryInd" class="text-danger">
                                {{ $t('warn.can.not.empty') }}
                              </div>
                            </div>
                          </div>

                          <!-- CardData Inquiry EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.cardDataInquiry-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.cardDataInquiryEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>

                          <!-- Card Security Code Validate URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.card-security-code-validate-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.cvvValidateEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- CReq URL Setting Card -->
                  <div class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.acs-url') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- (1) acsURL Domain (App Transaction) -->
                          <div class="col-md-6 mt-1">
                            <div>
                              <span
                                :class="[
                                  'required',
                                  {
                                    'text-danger': error.creqAppDomain || formatError.creqAppDomain
                                  }
                                ]"
                              >
                                {{ $t('ui.issuer-param.creq-app-domain') }}
                                <!-- acsURL Domain (App Transaction) -->
                              </span>
                              <input
                                id="creqAppDomain"
                                :disabled="formTitle == 'DETAIL'"
                                v-model="formData.creqAppDomain"
                                :class="[
                                  'form-control',
                                  {
                                    'input-error': error.creqAppDomain || formatError.creqAppDomain
                                  }
                                ]"
                                maxlength=""
                                @input="validateIpFormat(formData, formatError, 'creqAppDomain')"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.creqAppDomain" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                            <div v-if="formatError.creqAppDomain" class="text-danger">
                              {{ $t('warn.invalid-ip') }}
                            </div>
                          </div>

                          <!-- (2) acsURL Port (App Transaction) -->
                          <div class="col-md-6 mt-1">
                            <div>
                              <span :class="['required', { 'text-danger': error.creqAppPort }]">
                                {{ $t('ui.issuer-param.creq-app-port') }}
                                <!-- acsURL Port (App Transaction) -->
                              </span>
                              <input
                                id="creqAppPort"
                                :disabled="formTitle == 'DETAIL'"
                                v-model="formData.creqAppPort"
                                :class="['form-control', { 'input-error': error.creqAppPort }]"
                                maxlength=""
                                placeholder=""
                                oninput="value = value.replace(/\D/g, '')"
                              />
                            </div>
                            <div v-if="error.creqAppPort" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>

                          <!-- (1) acsURL Domain (Browser Transaction) -->
                          <div class="col-md-6 mt-1">
                            <div>
                              <span
                                :class="[
                                  'required',
                                  {
                                    'text-danger': error.creqBrwDomain || formatError.creqBrwDomain
                                  }
                                ]"
                              >
                                {{ $t('ui.issuer-param.creq-brw-domain') }}
                                <!-- acsURL Domain (Browser Transaction) -->
                              </span>
                              <input
                                id="creqBrwDomain"
                                :disabled="formTitle == 'DETAIL'"
                                v-model="formData.creqBrwDomain"
                                :class="[
                                  'form-control',
                                  {
                                    'input-error': error.creqBrwDomain || formatError.creqBrwDomain
                                  }
                                ]"
                                maxlength=""
                                @input="validateIpFormat(formData, formatError, 'creqBrwDomain')"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.creqBrwDomain" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                            <div v-if="formatError.creqBrwDomain" class="text-danger">
                              {{ $t('warn.invalid-ip') }}
                            </div>
                          </div>

                          <!-- (2) acsURL Port (Browser Transaction) -->
                          <div class="col-md-6 mt-1">
                            <div>
                              <span :class="['required', { 'text-danger': error.creqBrwPort }]">
                                {{ $t('ui.issuer-param.creq-brw-port') }}
                                <!-- acsURL Port (Browser Transaction) -->
                              </span>
                              <input
                                id="creqBrwPort"
                                :disabled="formTitle == 'DETAIL'"
                                v-model="formData.creqBrwPort"
                                :class="['form-control', { 'input-error': error.creqBrwPort }]"
                                maxlength=""
                                placeholder=""
                                oninput="value = value.replace(/\D/g, '')"
                              />
                            </div>
                            <div v-if="error.creqBrwPort" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Customer Service Contact Card -->
                  <div class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.customer-service') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- Call Center Contact Phone -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span :class="['required', { 'text-danger': error.tel }]">
                                {{ $t('ui.issuer-param.tel')
                                }}<!-- 客服中心聯絡電話 -->
                              </span>
                              <input
                                id="tel"
                                v-model="formData.tel"
                                :class="['form-control', { 'input-error': error.tel }]"
                                :disabled="formTitle == 'DETAIL'"
                                maxlength="20"
                              />
                            </div>
                            <div v-if="error.tel" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Image Upload Card -->
                  <div class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.image-upload') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- Logo Image-Standard -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <FormImgFile
                                ref="imageMediumFileInput"
                                :ID="'imageMediumFile'"
                                :required="true"
                                :LabelVal="'ui.issuer-param.image-medium'"
                                v-model="formData.imageMediumFile"
                                :readOnly="formTitle == 'DETAIL'"
                                :validation="false"
                                :invalids="previews.imageMediumFile"
                              />
                            </div>
                          </div>

                          <!-- Logo Image-HD -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <FormImgFile
                                ref="imageHighFileInput"
                                :ID="'imageHighFile'"
                                :required="true"
                                :LabelVal="'ui.issuer-param.image-high'"
                                v-model="formData.imageHighFile"
                                :readOnly="formTitle == 'DETAIL'"
                                :validation="false"
                                :invalids="previews.imageHighFile"
                              />
                            </div>
                          </div>

                          <!-- Logo Image-Ultra HD -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <FormImgFile
                                ref="imageExtraFileInput"
                                :ID="'imageExtraFile'"
                                :required="true"
                                :LabelVal="'ui.issuer-param.image-extra'"
                                v-model="formData.imageExtraFile"
                                :readOnly="formTitle == 'DETAIL'"
                                :validation="false"
                                :invalids="previews.imageExtraFile"
                              />
                            </div>
                          </div>

                          <!-- SPC Image Display/Upload -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <FormImgFile
                                ref="defaultImageFileInput"
                                :ID="'defaultImageFile'"
                                :required="true"
                                :LabelVal="'ui.issuer-param.image-default'"
                                v-model="formData.defaultImageFile"
                                :readOnly="formTitle == 'DETAIL'"
                                :validation="false"
                                :invalids="previews.defaultImageFile"
                              />
                            </div>
                          </div>
                          <div class="col-md-12 mt-1">
                            <div>
                              <FormImgFile
                                ref="darkImageFileInput"
                                :ID="'darkImageFile'"
                                :required="true"
                                :LabelVal="'ui.issuer-param.image-dark'"
                                v-model="formData.darkImageFile"
                                :readOnly="formTitle == 'DETAIL'"
                                :validation="false"
                                :invalids="previews.darkImageFile"
                              />
                            </div>
                          </div>
                          <div class="col-md-12 mt-1">
                            <div>
                              <FormImgFile
                                ref="monochromeImageFileInput"
                                :ID="'monochromeImageFile'"
                                :required="true"
                                :LabelVal="'ui.issuer-param.image-monochrome'"
                                v-model="formData.monochromeImageFile"
                                :readOnly="formTitle == 'DETAIL'"
                                :validation="false"
                                :invalids="previews.monochromeImageFile"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="row">
                  <!-- Card Scheme ACS Registration Number Card -->
                  <div
                    v-if="
                      formData.switchVisa == 0 ||
                      formData.switchMastercard == 0 ||
                      formData.switchJcb == 0 ||
                      formData.switchAmex == 0 ||
                      formData.switchDiners == 0 ||
                      formData.switchCup == 0 ||
                      formData.switchPayNet == 0 ||
                      formData.switchMada == 0 ||
                      formData.switchEftPos == 0 ||
                      formData.switchTpn == 0
                    "
                    class="col-md-12 mb-3"
                  >
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.trans.log.acsOperatorId')
                        }}<!--AcsOperatorId-->
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- visaAcsOperatorId-->
                          <div v-if="formData.switchVisa == 0" class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  { required: formData.switchVisa == 0 },
                                  { 'text-danger': error.visaAcsOperatorId }
                                ]"
                              >
                                Visa<!-- visaAcsOperatorId  -->
                              </span>
                              <input
                                id="visaAcsOperatorId"
                                v-model="formData.visaAcsOperatorId"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.visaAcsOperatorId }]"
                                maxlength="32"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.visaAcsOperatorId" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                          <!-- masterCardAcsOperatorId-->
                          <div v-if="formData.switchMastercard == 0" class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  { required: formData.switchMastercard == 0 },
                                  { 'text-danger': error.masterCardAcsOperatorId }
                                ]"
                              >
                                MasterCard<!-- masterCardAcsOperatorId  -->
                              </span>
                              <input
                                id="masterCardAcsOperatorId"
                                v-model="formData.masterCardAcsOperatorId"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.masterCardAcsOperatorId }]"
                                maxlength="32"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.masterCardAcsOperatorId" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                          <!-- jcbAcsOperatorId-->
                          <div v-if="formData.switchJcb == 0" class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  { required: formData.switchJcb == 0 },
                                  { 'text-danger': error.jcbAcsOperatorId }
                                ]"
                              >
                                JCB<!-- jcbAcsOperatorId-->
                              </span>
                              <input
                                id="jcbAcsOperatorId"
                                v-model="formData.jcbAcsOperatorId"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.jcbAcsOperatorId }]"
                                maxlength="32"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.jcbAcsOperatorId" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                          <!-- amexAcsOperatorId-->
                          <div v-if="formData.switchAmex == 0" class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  { required: formData.switchAmex == 0 },
                                  { 'text-danger': error.amexAcsOperatorId }
                                ]"
                              >
                                AMEX<!-- amexAcsOperatorId  -->
                              </span>
                              <input
                                id="amexAcsOperatorId"
                                v-model="formData.amexAcsOperatorId"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.amexAcsOperatorId }]"
                                maxlength="32"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.amexAcsOperatorId" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                          <!-- dinersAcsOperatorId-->
                          <div v-if="formData.switchDiners == 0" class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  { required: formData.switchDiners == 0 },
                                  { 'text-danger': error.dinersAcsOperatorId }
                                ]"
                              >
                                Diners<!-- dinersAcsOperatorId  -->
                              </span>
                              <input
                                id="dinersAcsOperatorId"
                                v-model="formData.dinersAcsOperatorId"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.dinersAcsOperatorId }]"
                                maxlength="32"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.dinersAcsOperatorId" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                          <!-- cupAcsOperatorId-->
                          <div v-if="formData.switchCup == 0" class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  { required: formData.switchCup == 0 },
                                  { 'text-danger': error.cupAcsOperatorId }
                                ]"
                              >
                                CUP<!-- cupAcsOperatorId  -->
                              </span>
                              <input
                                id="cupAcsOperatorId"
                                v-model="formData.cupAcsOperatorId"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.cupAcsOperatorId }]"
                                maxlength="32"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.cupAcsOperatorId" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                          <!-- payNetAcsOperatorId-->
                          <div v-if="formData.switchPayNet == 0" class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  { required: formData.switchPayNet == 0 },
                                  { 'text-danger': error.payNetAcsOperatorId }
                                ]"
                              >
                                PayNet<!-- payNetAcsOperatorId-->
                              </span>
                              <input
                                id="payNetAcsOperatorId"
                                v-model="formData.payNetAcsOperatorId"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.payNetAcsOperatorId }]"
                                maxlength="32"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.payNetAcsOperatorId" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                          <!-- madaAcsOperatorId-->
                          <div v-if="formData.switchMada == 0" class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  { required: formData.switchMada == 0 },
                                  { 'text-danger': error.madaAcsOperatorId }
                                ]"
                              >
                                Saudi MADA<!-- madaAcsOperatorId-->
                              </span>
                              <input
                                id="madaAcsOperatorId"
                                v-model="formData.madaAcsOperatorId"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.madaAcsOperatorId }]"
                                maxlength="32"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.madaAcsOperatorId" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                          <!-- eftPosAcsOperatorId-->
                          <div v-if="formData.switchEftPos == 0" class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  { required: formData.switchEftPos == 0 },
                                  { 'text-danger': error.eftPosAcsOperatorId }
                                ]"
                              >
                                EFTPOS<!-- eftPosAcsOperatorId-->
                              </span>
                              <input
                                id="eftPosAcsOperatorId"
                                v-model="formData.eftPosAcsOperatorId"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.eftPosAcsOperatorId }]"
                                maxlength="32"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.eftPosAcsOperatorId" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                          <!-- tpnAcsOperatorId-->
                          <div v-if="formData.switchTpn == 0" class="col-md-12 mt-1">
                            <div>
                              <span
                                :class="[
                                  { required: formData.switchTpn == 0 },
                                  { 'text-danger': error.tpnAcsOperatorId }
                                ]"
                              >
                                TPN<!-- tpnAcsOperatorId-->
                              </span>
                              <input
                                id="tpnAcsOperatorId"
                                v-model="formData.tpnAcsOperatorId"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.tpnAcsOperatorId }]"
                                maxlength="32"
                                placeholder=""
                              />
                            </div>
                            <div v-if="error.tpnAcsOperatorId" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- SMS OTP Card -->
                  <div class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.sms-otp') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- SMS OTP validity period (minutes) -->
                          <div class="col-md-6 mt-1">
                            <div>
                              <span :class="['required', { 'text-danger': error.smsOtpExpiry }]">
                                {{ $t('ui.issuer-param.sms-otp-expiry') }}
                                ({{ $t('ui.issuer-param.minute') }})
                                <!-- SMS OTP validity period (minutes) -->
                              </span>
                              <input
                                id="smsOtpExpiry"
                                v-model="formData.smsOtpExpiry"
                                type="text"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.smsOtpExpiry }]"
                                maxlength="3"
                                :placeholder="$t('ui.issuer-param.sms-numlimt')"
                                oninput="value = value.replace(/\D/g, '')"
                              />
                            </div>
                            <div v-if="error.smsOtpExpiry" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>

                          <!-- Get Dynamic Password Count -->
                          <div class="col-md-6 mt-1">
                            <div>
                              <span :class="['required', { 'text-danger': error.smsOtpResendLimit }]">
                                {{ $t('ui.issuer-param.sms-otp-resend') }}
                              </span>
                              <input
                                id="smsOtpResendLimit"
                                v-model="formData.smsOtpResendLimit"
                                type="text"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.smsOtpResendLimit }]"
                                maxlength="2"
                                :placeholder="$t('ui.issuer-param.sms-otp-resend-control')"
                                oninput="value = value.replace(/\D/g, '')"
                              />
                            </div>
                            <div v-if="error.smsOtpResendLimit" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>

                          <!-- Resend interval (seconds) -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span :class="['required', { 'text-danger': error.smsOtpResendInterval }]">
                                {{ $t('ui.issuer-param.sms-otp-resend-interval') }}
                                <!-- Resend interval (seconds) -->
                              </span>
                              <input
                                id="smsOtpResendInterval"
                                v-model="formData.smsOtpResendInterval"
                                type="text"
                                :disabled="formTitle == 'DETAIL'"
                                :class="['form-control', { 'input-error': error.smsOtpResendInterval }]"
                                maxlength="3"
                                oninput="value = value.replace(/\D/g, '')"
                              />
                            </div>
                            <div v-if="error.smsOtpResendInterval" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>

                          <!-- OTP SMS EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.otp-sms-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.otpSmsEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>

                          <!-- OTP Email EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.otp-email-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.otpEmailEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- OOB Setting Card -->
                  <div v-if="showOobSettings" class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.oob-settings') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- OOB App Name -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.oob-app-name') }}
                                <!-- OOB App Name -->
                              </span>
                              <input
                                v-model="formData.oobAppName"
                                class="form-control"
                                :disabled="formTitle == 'DETAIL'"
                                maxlength="50"
                                placeholder=""
                              />
                            </div>
                          </div>
                          <!-- 3DS Requestor App URL Indicator -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.threeDSRequestorAppURLInd') }}
                                <!-- 3DS Requestor App URL Indicator -->
                              </span>
                              <div>
                                <label>
                                  <input
                                    type="radio"
                                    :disabled="formTitle == 'DETAIL'"
                                    v-model="formData.threeDSRequestorAppURLInd"
                                    value="Y"
                                  />
                                  <span>&nbsp;{{ $t('ui.issuer-param.threeDSRequestorAppURLInd.Y') }}</span>
                                </label>
                                <label class="ms-3">
                                  <input
                                    type="radio"
                                    :disabled="formTitle == 'DETAIL'"
                                    v-model="formData.threeDSRequestorAppURLInd"
                                    value="N"
                                  />
                                  <span>&nbsp;{{ $t('ui.issuer-param.threeDSRequestorAppURLInd.N') }}</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <!-- OOB Authentication Request (OArq)-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.oob-auth-request-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.oobAuthRequestEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                          <!-- OOB Authentication Result Query (ORrq)-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.oob-result-query-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.oobResultQueryEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Offline Validation Setting Card -->
                  <div v-if="showDecoupledSettings" class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.decoupled-auth-settings') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- Decoupled Authentication (DArq) EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.dec-auth-request-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.decAuthRequestEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- RBA Parameter Setting Card -->
                  <div class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">
                        {{ $t('ui.issuer-param.rba-param') }}
                      </div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- RBA processing time limit parameter (seconds) -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span :class="['required', { 'text-danger': error.rbaReadTimeout }]">
                                {{ $t('ui.issuer-param.rba-read-timeout') }}
                                <!-- RBA processing time limit parameter (seconds) -->
                              </span>
                              <input
                                id="rbaReadTimeout"
                                v-model="formData.rbaReadTimeout"
                                :disabled="formTitle == 'DETAIL'"
                                type="text"
                                :class="['form-control', { 'input-error': error.rbaReadTimeout }]"
                                maxlength="5"
                              />
                            </div>
                            <div v-if="error.rbaReadTimeout" class="text-danger">
                              {{ $t('warn.can.not.empty') }}
                            </div>
                          </div>

                          <!-- VISA DAF Advice Indicator -->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span :class="['required', { 'text-danger': error.dafAdviceInd }]">
                                {{ $t('ui.issuer-param.daf-advice-ind') }}
                              </span>
                              <div>
                                <label>
                                  <input
                                    type="radio"
                                    :disabled="formTitle == 'DETAIL'"
                                    value="0"
                                    v-model="formData.dafAdviceInd"
                                  />
                                  <span :class="[{ 'text-danger': error.dafAdviceInd }]"
                                    >&nbsp;{{ $t('ui.issuer-param.daf-advice-ind.0') }}</span
                                  >
                                  <!-- Approve The Authentication Request -->
                                </label>
                                <label class="ms-3">
                                  <input
                                    type="radio"
                                    value="1"
                                    :disabled="formTitle == 'DETAIL'"
                                    v-model="formData.dafAdviceInd"
                                  />
                                  <span :class="[{ 'text-danger': error.dafAdviceInd }]"
                                    >&nbsp;{{ $t('ui.issuer-param.daf-advice-ind.1') }}</span
                                  >
                                  <!-- Deny The Authentication Request -->
                                </label>
                              </div>
                              <div v-if="error.dafAdviceInd" class="text-danger">
                                {{ $t('warn.can.not.empty') }}
                              </div>
                            </div>
                          </div>

                          <!-- VISA VPP Support Indicator -->
                          <div class="col-md-6 mt-1">
                            <div>
                              <label :class="['required', { 'text-danger': error.visaVppSupportInd }]">
                                {{ $t('ui.issuer-param.visaVppSupportInd') }}
                              </label>
                              <div>
                                <label>
                                  <input
                                    type="radio"
                                    :disabled="formTitle == 'DETAIL'"
                                    value="1"
                                    v-model="formData.visaVppSupportInd"
                                  />
                                  <span :class="[{ 'text-danger': error.visaVppSupportInd }]"
                                    >&nbsp;{{ $t('ui.issuer-param.visaVppSupportInd.1') }}</span
                                  >
                                </label>
                                <label class="ms-3">
                                  <input
                                    type="radio"
                                    value="0"
                                    :disabled="formTitle == 'DETAIL'"
                                    v-model="formData.visaVppSupportInd"
                                  />
                                  <span :class="[{ 'text-danger': error.visaVppSupportInd }]"
                                    >&nbsp;{{ $t('ui.issuer-param.visaVppSupportInd.0') }}</span
                                  >
                                </label>
                              </div>
                              <div v-if="error.visaVppSupportInd" class="text-danger">
                                {{ $t('warn.can.not.empty') }}
                              </div>
                            </div>
                          </div>

                          <!-- VISA VPP Issuer Decision -->
                          <div class="col-md-6 mt-1">
                            <div>
                              <label :class="['required', { 'text-danger': error.visaVppIssDecision }]">
                                {{ $t('ui.issuer-param.visaVppIssDecision') }}
                              </label>
                              <div>
                                <label>
                                  <input
                                    type="radio"
                                    :disabled="formTitle == 'DETAIL'"
                                    value="0"
                                    v-model="formData.visaVppIssDecision"
                                  />
                                  <span :class="[{ 'text-danger': error.visaVppIssDecision }]"
                                    >&nbsp;{{ $t('ui.issuer-param.visaVppIssDecision.0') }}</span
                                  >
                                </label>
                                <label class="ms-3">
                                  <input
                                    type="radio"
                                    value="1"
                                    :disabled="formTitle == 'DETAIL'"
                                    v-model="formData.visaVppIssDecision"
                                  />
                                  <span :class="[{ 'text-danger': error.visaVppIssDecision }]"
                                    >&nbsp;{{ $t('ui.issuer-param.visaVppIssDecision.1') }}</span
                                  >
                                </label>
                              </div>
                              <div v-if="error.visaVppIssDecision" class="text-danger">
                                {{ $t('warn.can.not.empty') }}
                              </div>
                            </div>
                          </div>

                          <!-- Veri-id User Institution Code -->
                          <div class="col-md-6 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.veriid-institute-id') }}
                              </span>
                              <input
                                v-model="formData.instituteId"
                                type="text"
                                :disabled="formTitle == 'DETAIL'"
                                class="form-control"
                                maxlength="20"
                              />
                            </div>
                          </div>

                          <!-- Veri-id Service Provider Code -->
                          <div class="col-md-6 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.veriid-operator-id') }}
                              </span>
                              <input
                                v-model="formData.operatorId"
                                type="text"
                                :disabled="formTitle == 'DETAIL'"
                                class="form-control"
                                maxlength="20"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- EPS Endpoint Card -->
                  <div class="col-md-12 mb-3">
                    <div class="border border-light-subtle">
                      <div class="header-title">EPS Endpoint<!--EPS Endpoint--></div>
                      <div class="content-box p-3">
                        <div class="row mb-0">
                          <!-- HSM Csc EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.hsm-csc-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.hsmCscEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                          <!-- HSM CNV2 EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.hsm-cnv2-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.hsmCvn2EpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                          <!-- HSM CVV EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.hsm-cvv-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.hsmCvvEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                          <!-- HSM SPA2 EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.hsm-spa2-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.hsmSpa2EpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                          <!-- HSM Decrypt EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.hsm-dec-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.hsmDecEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                          <!-- HSM Encrypt EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.hsm-enc-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.hsmEncEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                          <!-- HSM Jws Sign EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.hsm-jws-sign-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.hsmJwsSignEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                          <!-- HSM CsrGenerate EPS URL-->
                          <div class="col-md-12 mt-1">
                            <div>
                              <span>
                                {{ $t('ui.issuer-param.hsm-csr-generate-eps-url') }}
                                <a href="/" style="text-decoration: none">[Swagger api documents]</a>
                              </span>
                              <input
                                v-model="formData.hsmCsrGenerateEpsUrl"
                                class="form-control"
                                maxlength="255"
                                :disabled="formTitle == 'DETAIL'"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Button Area: align with FormComponent (layout + width) -->
            <div class="modal-footer form-footer-buttons">
              <div
                class="d-flex justify-content-between align-items-center gap-2 w-100 mt-2 mb-2"
                v-if="formTitle != 'DETAIL'"
              >
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
                  <FormButton
                    noWrapper
                    id="btnSubmit"
                    label="btn.save"
                    type="submit"
                    variant="primary"
                    @click="submit"
                  />
                </div>
              </div>
              <div class="d-flex justify-content-end w-100 mt-2 mb-2" v-else>
                <FormButton noWrapper label="btn.cancel" type="button" variant="secondary" @click="goBack" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { conventTitle, isBaseI18nSelect } from '@/utils/util'
import { type BaseSelect, optionSelect } from '@/utils/select/baseSelect'
import FormImgFile from '@/components/formTable/FormImgFile.vue'
import { validateIpFormat } from '@/utils/validateUtil'
import FormButton from '@/components/formTable/FormButton.vue'

const appStoreHook = useAppStore()

const { t } = useI18n()
// Props
const props = defineProps<{
  title: string
  formDataDetail: Record<string, any>
  issuerData: BaseSelect[]
}>()

// Define the form object dynamically based on formConfig
const formData = reactive<Record<string, any>>({
  issuerOid: '',
  switchVisa: 1,
  switchMastercard: 1,
  switchJcb: 1,
  switchAmex: 1,
  switchDiners: 1,
  switchCup: 1,
  switchPayNet: 1,
  switchMada: 1,
  switchEftPos: 1,
  switchTpn: 1,
  formAuthenticationMethod: ['02', '05'],
  cardDataInquiryInd: '',
  acctIdInd: '',
  transLockInd: '',
  lockDuration: '',
  transLockLevelInd: '0',
  oobAppName: '',
  threeDSRequestorAppURLInd: '',
  authFailedCounterInd: '0',
  authFailedLimit: '',
  imageMediumFile: null,
  imageHighFile: null,
  imageExtraFile: null,
  defaultImageFile: null,
  darkImageFile: null,
  monochromeImageFile: null,
  rbaReadTimeout: '3',
  dafAdviceInd: '0',
  visaVppSupportInd: '0',
  visaVppIssDecision: '1',
  instituteId: '',
  operatorId: '',
  tel: '',
  smsOtpExpiry: '', // SMS OTP validity period (minutes)
  smsOtpResendLimit: '', // Get dynamic password count
  smsOtpResendInterval: '', // Resend interval (seconds)
  creqAppDomain: '',
  creqAppPort: '',
  creqBrwDomain: '',
  creqBrwPort: '',
  visaAcsOperatorId: '',
  masterCardAcsOperatorId: '',
  jcbAcsOperatorId: '',
  amexAcsOperatorId: '',
  dinersAcsOperatorId: '',
  cupAcsOperatorId: '',
  payNetAcsOperatorId: '',
  madaAcsOperatorId: '',
  eftPosAcsOperatorId: '',
  tpnAcsOperatorId: '',
  cardDataInquiryEpsUrl: '',
  otpSmsEpsUrl: '',
  otpEmailEpsUrl: '',
  hsmCscEpsUrl: '',
  hsmCvn2EpsUrl: '',
  hsmCvvEpsUrl: '',
  hsmSpa2EpsUrl: '',
  hsmDecEpsUrl: '',
  hsmEncEpsUrl: '',
  hsmJwsSignEpsUrl: '',
  hsmCsrGenerateEpsUrl: '',
  decAuthRequestEpsUrl: '',
  oobAuthRequestEpsUrl: '',
  oobResultQueryEpsUrl: '',
  cvvValidateEpsUrl: ''
})
const previews = reactive<Record<string, any>>({
  imageMediumFile: false,
  imageHighFile: false,
  imageExtraFile: false,
  defaultImageFile: false,
  darkImageFile: false,
  monochromeImageFile: false
})
// SMS OTP and OTP Other (Email) supported by default
// Define options
const authenticationMethods = [
  { value: '01', label: 'Static Passcode' },
  { value: '02', label: 'SMS OTP' },
  { value: '03', label: 'Key fob or EMV card reader OTP' },
  { value: '04', label: 'App OTP' },
  { value: '05', label: 'OTP Other(Email)' },
  { value: '06', label: 'KBA' },
  { value: '07', label: 'OOB Biometrics' },
  { value: '08', label: 'OOB Login' },
  { value: '09', label: 'OOB Other' },
  { value: '10', label: 'Other' },
  { value: '11', label: 'Push Confirmation' },
  { value: '12', label: 'Decoupled' },
  { value: '13', label: 'WebAuthn(FIDO)' },
  { value: '14', label: 'SPC' },
  { value: '15', label: 'Behavioural biometrics' },
  { value: '16', label: 'Electronic ID' }
]

const error = reactive<Record<string, any>>({
  issuerOid: false,
  formAuthenticationMethod: false,
  cardDataInquiryInd: false,
  acctIdInd: false,
  transLockInd: false,
  lockDuration: false,
  transLockLevelInd: false,
  creqBrwPort: false,
  creqAppPort: false,
  creqBrwDomain: false,
  creqAppDomain: false,
  tel: false,
  authFailedLimit: false,
  authFailedCounterInd: false,
  rbaReadTimeout: false,
  dafAdviceInd: false,
  smsOtpExpiry: false,
  smsOtpResendLimit: false,
  smsOtpResendInterval: false,
  visaAcsOperatorId: false,
  masterCardAcsOperatorId: false,
  jcbAcsOperatorId: false,
  amexAcsOperatorId: false,
  dinersAcsOperatorId: false,
  cupAcsOperatorId: false,
  payNetAcsOperatorId: false,
  madaAcsOperatorId: false,
  eftPosAcsOperatorId: false,
  tpnAcsOperatorId: false
})

// Data
const showFlag = ref(false)
const opacity = ref(0.7)
// Breadcrumb
const formTitle = ref('')
const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...optionSelect, ...props.issuerData] : [...props.issuerData]
})
// Refs
const maskSpace = ref()
for (const formDataDetailKey in props.formDataDetail) {
  formData[formDataDetailKey] = props.formDataDetail[formDataDetailKey]
}

// Computed
const dispalyCss = computed(() => {
  return showFlag.value
    ? `display:block;background:rgba(0,0,0,${opacity.value});`
    : `display:none;background:rgba(0,0,0,${opacity.value});`
})
// Computed: Is lock duration input disabled
const isLockDurationDisabled = computed(() => {
  return formData.transLockInd === '0'
})

// Computed: Show OOB setting card
const showOobSettings = computed(() => {
  const oobMethods = ['07', '08', '09'] // OOB Biometrics, OOB Login, OOB Other
  return oobMethods.some((method) => formData.formAuthenticationMethod?.includes(method))
})

// Computed: Show Offline Validation Setting Card
const showDecoupledSettings = computed(() => {
  return formData.formAuthenticationMethod?.includes('12') // Decoupled
})

// Watch transLockInd changes
watch(
  () => formData.transLockInd,
  (newVal) => {
    if (newVal === '0') {
      formData.lockDuration = '' // If disabled, clear and disable input box
      error.lockDuration = false // If disabled, clear error
    }
  }
)

// Watch fields in formData, if field has value, set corresponding error field to false
for (const field of Object.keys(formData)) {
  watch(
    () => formData[field],
    (newValue) => {
      if (newValue !== null && newValue !== undefined && newValue !== '') {
        if (field in error) {
          error[field] = false // If field has value, set corresponding error to false
        }
        if (field in previews) {
          previews[field] = false // If field has value, set corresponding error to false
        }
      }
    }
  )
}

watch(
  () => props.formDataDetail,
  (newData) => {
    for (const key in formData) {
      formData[key] = props.formDataDetail[key]
    }
    if (newData['oid']) {
      formData['oid'] = newData['oid']
    }
    //const fields = ['imageMediumFile', 'imageHighFile', 'imageExtraFile', 'defaultImageFile', 'darkImageFile', 'monochromeImageFile']
    if (newData['imageMediumFile']) {
      formData['imageMediumFile'] = newData['imageMediumFile']
    }
    if (newData['imageHighFile']) {
      formData['imageHighFile'] = newData['imageHighFile']
    }
    if (newData['imageExtraFile']) {
      formData['imageExtraFile'] = newData['imageExtraFile']
    }
    if (newData['defaultImageFile']) {
      formData['defaultImageFile'] = newData['defaultImageFile']
    }
    if (newData['darkImageFile']) {
      formData['darkImageFile'] = newData['darkImageFile']
    }
    if (newData['monochromeImageFile']) {
      formData['monochromeImageFile'] = newData['monochromeImageFile']
    }
  }
)

// Methods
function show() {
  showFlag.value = true
  nextTick(() => {
    if (maskSpace.value) {
      maskSpace.value.scrollTop = 0
    }
  })
  valida.value = true

  // Set formTitle
  formTitle.value = props.title

  // Reset to default values every time form is opened
  resetForm()

  // If edit or view, overwrite default values
  if (props.title === 'UPDATE' || props.title === 'DETAIL') {
    for (const key in props.formDataDetail) {
      formData[key] = props.formDataDetail[key]
    }
    // Handle image preview
    const imageFields = [
      'imageMediumFile',
      'imageHighFile',
      'imageExtraFile',
      'defaultImageFile',
      'darkImageFile',
      'monochromeImageFile'
    ]
    for (const field of imageFields) {
      if (props.formDataDetail[field]) {
        formData[field] = props.formDataDetail[field]
      }
    }
  }

  disablePageScroll()
}

function hide() {
  showFlag.value = false
}

// Emit the search event
const emit = defineEmits(['submit', 'goBack'])

const imageMediumFileInput = ref<HTMLInputElement | null>(null)
const imageHighFileInput = ref<HTMLInputElement | null>(null)
const imageExtraFileInput = ref<HTMLInputElement | null>(null)
const defaultImageFileInput = ref<HTMLInputElement | null>(null)
const darkImageFileInput = ref<HTMLInputElement | null>(null)
const monochromeImageFileInput = ref<HTMLInputElement | null>(null)
const resetFileForm = () => {
  // Clear选中图片名
  if (imageMediumFileInput.value) imageMediumFileInput.value.value = ''
  if (imageHighFileInput.value) imageHighFileInput.value.value = ''
  if (imageExtraFileInput.value) imageExtraFileInput.value.value = ''
  if (defaultImageFileInput.value) defaultImageFileInput.value.value = ''
  if (darkImageFileInput.value) darkImageFileInput.value.value = ''
  if (monochromeImageFileInput.value) monochromeImageFileInput.value.value = ''

  for (const previewsKey in previews) {
    previews[previewsKey] = false
  }
}
const resetForm = () => {
  // Use Object.assign to ensure applying brand new default values every time
  for (const key of Object.keys(formDataDefault)) {
    formData[key] = formDataDefault[key]
  }

  // Reset error status
  for (const key of Object.keys(error)) {
    error[key] = false
  }
  for (const key of Object.keys(formatError)) {
    formatError[key] = false
  }

  resetFileForm()
}
const resetFormBtn = () => {
  if (props.title === 'UPDATE') {
    // Edit mode: Reset to original data
    for (const formDataDetailKey in formDataDefault) {
      if (!Object.keys(previews).includes(formDataDetailKey)) {
        formData[formDataDetailKey] = props.formDataDetail[formDataDetailKey]
      }
    }
    for (const previewsKey in previews) {
      formData[previewsKey] = props.formDataDetail[previewsKey]
    }
  } else {
    // Add mode: Reset to default values
    for (const formDataDetailKey in formDataDefault) {
      formData[formDataDetailKey] = formDataDefault[formDataDetailKey]
    }
    // Clear图片
    for (const previewsKey in previews) {
      previews[previewsKey] = null
    }
    resetFileForm()
  }

  // Reset all error statuses
  for (const errorKey in error) {
    error[errorKey] = false
  }

  // Reset all preview statuses
  for (const previewsKey in previews) {
    previews[previewsKey] = false
  }

  // Reset format error status
  for (const key of Object.keys(formatError)) {
    formatError[key] = false
  }
}

watch(
  () => props.title,
  (newData) => {
    if (newData) {
      const title = conventTitle(newData)
      appStoreHook.toggleFormTitle(t(title))
    }
  },
  { immediate: true }
)
const goBack = () => {
  // Enable homepage scrollbar
  enablePageScroll()
  resetForm()
  emit('goBack', { ...formData })
}
const formatError = reactive<Record<string, any>>({
  creqAppDomain: false,
  creqBrwDomain: false
})

watch(
  () => formData.creqAppDomain,
  () => {
    validateIpFormat(formData, formatError, 'creqAppDomain')
  },
  { immediate: true }
)
watch(
  () => formData.creqBrwDomain,
  () => {
    validateIpFormat(formData, formatError, 'creqBrwDomain')
  },
  { immediate: true }
)

// Watch switch status changes, clear corresponding AcsOperatorId error and value
const acsOperatorIdMapping: Record<string, string> = {
  visaAcsOperatorId: 'switchVisa',
  masterCardAcsOperatorId: 'switchMastercard',
  jcbAcsOperatorId: 'switchJcb',
  amexAcsOperatorId: 'switchAmex',
  dinersAcsOperatorId: 'switchDiners',
  cupAcsOperatorId: 'switchCup',
  payNetAcsOperatorId: 'switchPayNet',
  madaAcsOperatorId: 'switchMada',
  eftPosAcsOperatorId: 'switchEftPos',
  tpnAcsOperatorId: 'switchTpn'
}

// Create watch for each AcsOperatorId
for (const [acsOperatorId, switchKey] of Object.entries(acsOperatorIdMapping)) {
  watch(
    () => formData[switchKey],
    (newVal) => {
      if (newVal == 1) {
        error[acsOperatorId] = false
        // Do not clear value to avoid DB constraint error
        // formData[acsOperatorId] = ''
      }
    }
  )
}
// Used for formInput component validation. When closing window and model becomes empty, error msg appears. Add this field: set to true (validate) when opening form, set to false (no validation) when closing form.
const valida = ref(true)
const submit = () => {
  let validation = true

  // Check all required fields
  for (const errorKey in error) {
    // Transaction lock indicator not enabled, skip validation
    if (errorKey === 'lockDuration') {
      if (formData.transLockInd == '0') {
        continue
      }
    }

    // AcsOperatorId conditional validation: required only when corresponding switch is enabled
    const acsOperatorIdMapping: Record<string, string> = {
      visaAcsOperatorId: 'switchVisa',
      masterCardAcsOperatorId: 'switchMastercard',
      jcbAcsOperatorId: 'switchJcb',
      amexAcsOperatorId: 'switchAmex',
      dinersAcsOperatorId: 'switchDiners',
      cupAcsOperatorId: 'switchCup',
      payNetAcsOperatorId: 'switchPayNet',
      madaAcsOperatorId: 'switchMada',
      eftPosAcsOperatorId: 'switchEftPos',
      tpnAcsOperatorId: 'switchTpn'
    }

    if (acsOperatorIdMapping[errorKey]) {
      const switchKey = acsOperatorIdMapping[errorKey]
      if (formData[switchKey] === 0) {
        // Check input only if checked
        if (formData[errorKey] === null || formData[errorKey] === undefined || formData[errorKey] === '') {
          error[errorKey] = true
          validation = false
        }
      }
      continue
    }

    // Special handling for checkboxes
    if (errorKey === 'formAuthenticationMethod') {
      if (!Array.isArray(formData[errorKey]) || formData[errorKey].length === 0) {
        error[errorKey] = true
        validation = false
      }
      continue
    }

    // Process normal fields
    if (formData[errorKey] === null || formData[errorKey] === undefined || formData[errorKey] === '') {
      error[errorKey] = true
      validation = false
    }
  }

  // Check image
  for (const previewsKey in previews) {
    previews[previewsKey] = formData[previewsKey] == null || formData[previewsKey] == ''
  }

  for (const previewsKey in previews) {
    if (previews[previewsKey]) {
      validation = false
    }
  }

  // Check all error statuses
  for (const errorKey in error) {
    if (error[errorKey]) {
      validation = false
    }
  }
  // Check all error statuses
  for (const errorKey in formatError) {
    if (formatError[errorKey]) {
      validation = false
    }
  }

  console.log('validation', validation)
  if (!validation) {
    // Find first error field by priority and jump
    let targetElement = null

    // 1. Check normal field errors first
    const firstErrorField = Object.keys(error).find((key) => error[key])
    if (firstErrorField) {
      targetElement = document.getElementById(firstErrorField)
    }

    // 2. If no normal field errors, check image errors
    if (!targetElement) {
      const firstImageErrorField = Object.keys(previews).find((key) => previews[key])
      if (firstImageErrorField) {
        targetElement = document.getElementById(firstImageErrorField)
      }
    }

    // 3. If no image errors, check format errors
    if (!targetElement) {
      const firstFormatErrorField = Object.keys(formatError).find((key) => formatError[key])
      if (firstFormatErrorField) {
        targetElement = document.getElementById(firstFormatErrorField)
      }
    }

    // Execute jump
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      targetElement.focus()
    }
    return
  }

  if (validation) {
    enablePageScroll()
    emit('submit', { ...formData })
    valida.value = false
  }
}

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
  appStoreHook.toggleFormTitle('')
}

const formDataDefault = reactive<Record<string, any>>({
  oid: '',
  tel: '',
  issuerOid: '',
  switchVisa: 1,
  switchMastercard: 1,
  switchJcb: 1,
  switchAmex: 1,
  switchDiners: 1,
  switchCup: 1,
  switchPayNet: 1,
  switchMada: 1,
  switchEftPos: 1,
  switchTpn: 1,
  formAuthenticationMethod: ['02', '05'],
  cardDataInquiryInd: '',
  acctIdInd: '',
  transLockInd: '',
  lockDuration: '',
  transLockLevelInd: '0',
  oobAppName: '',
  threeDSRequestorAppURLInd: '',
  authFailedCounterInd: '0',
  authFailedLimit: '',
  imageMediumFile: null,
  imageHighFile: null,
  imageExtraFile: null,
  defaultImageFile: null,
  darkImageFile: null,
  monochromeImageFile: null,
  rbaReadTimeout: '3',
  dafAdviceInd: '0',
  visaVppSupportInd: '0',
  visaVppIssDecision: '1',
  instituteId: '',
  operatorId: '',
  smsOtpExpiry: '', // SMS OTP validity period (minutes)
  smsOtpResendLimit: '', // Get dynamic password count
  smsOtpResendInterval: '', // Resend interval (seconds)
  creqAppDomain: '',
  creqAppPort: '',
  creqBrwDomain: '',
  creqBrwPort: '',
  visaAcsOperatorId: '',
  masterCardAcsOperatorId: '',
  jcbAcsOperatorId: '',
  amexAcsOperatorId: '',
  dinersAcsOperatorId: '',
  cupAcsOperatorId: '',
  payNetAcsOperatorId: '',
  madaAcsOperatorId: '',
  eftPosAcsOperatorId: '',
  tpnAcsOperatorId: '',
  cardDataInquiryEpsUrl: '',
  otpSmsEpsUrl: '',
  otpEmailEpsUrl: '',
  hsmCscEpsUrl: '',
  hsmCvn2EpsUrl: '',
  hsmCvvEpsUrl: '',
  hsmSpa2EpsUrl: '',
  hsmDecEpsUrl: '',
  hsmEncEpsUrl: '',
  hsmJwsSignEpsUrl: '',
  hsmCsrGenerateEpsUrl: '',
  decAuthRequestEpsUrl: '',
  oobAuthRequestEpsUrl: '',
  oobResultQueryEpsUrl: '',
  cvvValidateEpsUrl: ''
})
defineExpose({
  show,
  hide
})
</script>

<style scoped>
.modal-dialog {
  max-width: 90%;
  margin: 7rem auto;
}

.modal-content {
  border: 0;
  background-color: var(--cui-body-bg);
  color: var(--cui-body-color);
}

.modal-header {
  background-color: var(--cui-body-bg);
  border-bottom: 1px solid var(--cui-border-color);
}

.modal-body {
  background-color: var(--cui-body-bg);
}

.modal-footer {
  background-color: var(--cui-body-bg);
  border-top: 1px solid var(--cui-border-color);
}

.switch-check {
  margin-left: 0;
  width: 30%;
  vertical-align: top;
  user-select: none;
}

.switch-column .switch-check {
  display: block;
  width: 100%;
}

.img-thumbnail {
  max-width: 200px;
  height: auto;
}

.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.fullscreen-modal img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

.clickable {
  transition: transform 0.2s;
}

.clickable:hover {
  transform: scale(1.05);
}

/* Remove duplicate required style, use global definition */

.input-error {
  border-color: #dc3545 !important;
}

.text-danger {
  color: #dc3545 !important;
}
</style>
