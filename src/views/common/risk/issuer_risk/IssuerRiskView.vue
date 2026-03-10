<template>
  <QueryCriteriaComponent
    v-if="appStoreHook.organ == 'hosted'"
    :criteriaConfig="userQueryConfig"
    :title="$t('ui.risk-indicator')"
    @search="handleSearch"
  />
  <div v-if="reconfirmFlag" class="my-2 w-100">
    <span class="alert alert-success d-flex">{{ $t('ui.reconfirm.message.add-to-reconfirm-sucessful') }}</span>
  </div>

  <div class="border border-light-subtle">
    <div class="header-title">{{ $t('ui.rba.threshold') }}</div>
    <div class="content-box p-3">
      <div class="row mb-3">
        <RiskThreshold
          @submit="submit"
          @go-back="goBack"
          @update="update"
          :btn-show="brnShow"
          :is-editing="isEditing"
          :threshold-detail="threshold"
          ref="childRef"
        />
      </div>
    </div>
  </div>

  <div class="row mt-3">
    <div class="col-md-12">
      <div v-for="(group, index) in topicList" :key="index" class="border border-light-subtle rba-topic-card">
        <div class="header-title">{{ $t(group.i18n) }}</div>
        <div class="content-box p-3">
          <div v-for="subject in group.subjects" :key="subject.oid">
            <div class="rba-subject-header">{{ $t(subject.i18n) }}</div>
            <div class="table-responsive rba-topic-table-wrap">
              <table class="table table-condensed rba-topic-table">
                <tbody>
                  <tr v-for="(pair, rowIndex) in chunkContexts(subject.contexts)" :key="rowIndex" class="context-row">
                    <td v-for="context in pair" :key="context.i18n" class="rba-context-cell">
                      <div class="rba-context-block">
                        <!-- 區塊一：編號與勾選 -->
                        <div class="rba-cell-block rba-context-meta">
                          <span class="column-number">{{ context.indexNo }}</span>
                          <span class="column-checkbox" v-if="isEditing">
                            <input
                              type="checkbox"
                              class="checkbox-editable"
                              v-model="context.checked"
                              @change="changeCheckboxFn()"
                            />
                          </span>
                        </div>
                        <div class="rba-context-body">
                          <!-- 左上：主題與選項 -->
                          <div class="rba-cell-block rba-context-content rba-layout-tl">
                            <div class="text-nowrap">{{ context.memo }}</div>
                            <div
                              v-for="(option, optionIndex) in context.options"
                              :key="optionIndex"
                              class="text-nowrap"
                            >
                              ({{ optionIndex }})

                              <span v-if="option.i18n == 'ui.rba.topic.1-1-1.option.2.medium'">
                                {{ $t('ui.rba.topic.1-1-1.option.2.medium.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  :disabled="!isEditing || !context.checked"
                                  class="text-center param-editable"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.1-1-1.option.2.medium.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-1.option.3.low'">
                                {{ $t('ui.rba.topic.1-1-1.option.3.low.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  :disabled="!isEditing || !context.checked"
                                  class="text-center param-editable"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.1-1-1.option.3.low.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-2.option.1.high'">
                                {{ $t('ui.rba.topic.1-1-2.option.1.high.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  :disabled="!isEditing || !context.checked"
                                  class="text-center param-editable"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.1-1-2.option.1.high.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-2.option.2.medium'">
                                {{ $t('ui.rba.topic.1-1-2.option.2.medium.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  :disabled="!isEditing || !context.checked"
                                  class="text-center param-editable"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.1-1-2.option.2.medium.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-2.option.3.low'">
                                {{ $t('ui.rba.topic.1-1-2.option.3.low.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                              </span>
                              <!--                    Cardholder shopping currency usage frequency-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-3.option.1.high'">
                                {{ $t('ui.rba.topic.1-1-3.option.1.high.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                %
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-3.option.2.medium'">
                                {{ $t('ui.rba.topic.1-1-3.option.2.medium.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.1-1-3.option.2.medium.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                %
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-3.option.3.low'">
                                {{ $t('ui.rba.topic.1-1-3.option.3.low.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.1-1-3.option.3.low.2') }}
                              </span>
                              <!--                    Cardholder historical shopping time difference-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-4.option.1.high'">
                                {{ $t('ui.rba.topic.1-1-4.option.1.high.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.1-1-4.option.1.high.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-4.option.2.medium'">
                                {{ $t('ui.rba.topic.1-1-4.option.2.medium.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.1-1-4.option.2.medium.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.1-1-4.option.2.medium.3') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-4.option.3.low'">
                                {{ $t('ui.rba.topic.1-1-4.option.3.low.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.1-1-4.option.3.low.2') }}
                              </span>
                              <!--                    Cardholder shopping location (country/region) frequency-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-5.option.1.high'">
                                {{ $t('ui.rba.topic.1-1-5.option.1.high.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                %
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-5.option.2.medium'">
                                {{ $t('ui.rba.topic.1-1-5.option.2.medium.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.1-1-5.option.2.medium.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                %
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-5.option.3.low'">
                                {{ $t('ui.rba.topic.1-1-5.option.3.low.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.1-1-5.option.3.low.2') }}
                              </span>
                              <!--                    Cardholder shopping merchant category (MCC) ratio-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-6.option.1.high'">
                                {{ $t('ui.rba.topic.1-1-6.option.1.high.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                %
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-6.option.2.medium'">
                                {{ $t('ui.rba.topic.1-1-6.option.2.medium.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.1-1-6.option.2.medium.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                %
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-6.option.3.low'">
                                {{ $t('ui.rba.topic.1-1-6.option.3.low.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.1-1-6.option.3.low.2') }}
                              </span>
                              <!--                    Cardholder shopping merchant country/region ratio-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-7.option.1.high'">
                                {{ $t('ui.rba.topic.1-1-7.option.1.high.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                %
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-7.option.2.medium'">
                                {{ $t('ui.rba.topic.1-1-7.option.2.medium.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.1-1-7.option.2.medium.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                %
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.1-1-7.option.3.low'">
                                {{ $t('ui.rba.topic.1-1-7.option.3.low.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.1-1-7.option.3.low.2') }}
                              </span>
                              <!-- Indicator for transaction count of the same card number within one month -->
                              <span v-else-if="option.i18n == 'ui.rba.topic.2-1-1.option.1.high'">
                                {{ $t('ui.rba.topic.2-1-1.option.1.high.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.2-1-1.option.1.high.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.2-1-1.option.2.medium'">
                                {{ $t('ui.rba.topic.2-1-1.option.2.medium.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                ～
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.2-1-1.option.2.medium.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.2-1-1.option.3.low'">
                                {{ $t('ui.rba.topic.2-1-1.option.3.low.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.2-1-1.option.3.low.2') }}
                              </span>
                              <!--                    Time difference between current location and previous foreign (country/region) transaction-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.2-1-3.option.1.high'">
                                {{ $t('ui.rba.topic.2-1-3.option.1.high.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.2-1-3.option.1.high.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.2-1-3.option.2.medium'">
                                {{ $t('ui.rba.topic.2-1-3.option.2.medium.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.2-1-3.option.2.medium.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.2-1-3.option.2.medium.3') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.2-1-3.option.3.low'">
                                {{ $t('ui.rba.topic.2-1-3.option.3.low.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.2-1-3.option.3.low.2') }}
                              </span>
                              <!--                    Indicator for cardholder member account registration time on merchant platform-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-1.option.3.less'">
                                {{ $t('ui.rba.topic.3-1-1.option.3.less.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.3-1-1.option.3.less.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-1.option.4.middle'">
                                {{ $t('ui.rba.topic.3-1-1.option.4.middle.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.3-1-1.option.4.middle.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.3-1-1.option.4.middle.3') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-1.option.5.more'">
                                {{ $t('ui.rba.topic.3-1-1.option.5.more.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.3-1-1.option.5.more.2') }}
                              </span>
                              <!--                    Indicator for cardholder member account modification time-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-2.option.2.less'">
                                {{ $t('ui.rba.topic.3-1-2.option.2.less.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.3-1-2.option.2.less.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-2.option.3.middle'">
                                {{ $t('ui.rba.topic.3-1-2.option.3.middle.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.3-1-2.option.3.middle.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.3-1-2.option.3.middle.3') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-2.option.4.more'">
                                {{ $t('ui.rba.topic.3-1-2.option.4.more.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.3-1-2.option.4.more.2') }}
                              </span>
                              <!--                    Indicator for cardholder member password modification time-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-3.option.3.less'">
                                {{ $t('ui.rba.topic.3-1-3.option.3.less.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.3-1-3.option.3.less.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-3.option.4.middle'">
                                {{ $t('ui.rba.topic.3-1-3.option.4.middle.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.3-1-3.option.4.middle.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.3-1-3.option.4.middle.3') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-3.option.5.more'">
                                {{ $t('ui.rba.topic.3-1-3.option.5.more.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.3-1-3.option.5.more.2') }}
                              </span>
                              <!--                    Shipping address usage time indicator-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-4.option.2.less'">
                                {{ $t('ui.rba.topic.3-1-4.option.2.less.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.3-1-4.option.2.less.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-4.option.3.middle'">
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.3-1-4.option.3.middle.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.3-1-4.option.3.middle.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-4.option.4.more'">
                                {{ $t('ui.rba.topic.3-1-4.option.4.more.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.3-1-4.option.4.more.2') }}
                              </span>
                              <!--                    Payment account creation time indicator-->
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-7.option.3.less'">
                                {{ $t('ui.rba.topic.3-1-7.option.3.less.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.3-1-7.option.3.less.2') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-7.option.4.middle'">
                                {{ $t('ui.rba.topic.3-1-7.option.4.middle.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[0].dataValue"
                                  @blur="handleBlur(context, 0)"
                                />
                                {{ $t('ui.rba.topic.3-1-7.option.4.middle.2') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.3-1-7.option.4.middle.3') }}
                              </span>
                              <span v-else-if="option.i18n == 'ui.rba.topic.3-1-7.option.5.more'">
                                {{ $t('ui.rba.topic.3-1-7.option.5.more.1') }}
                                <input
                                  type="text"
                                  size="8"
                                  maxlength="10"
                                  class="text-center param-editable"
                                  :disabled="!isEditing || !context.checked"
                                  style="height: 20px; line-height: 17px"
                                  autocomplete="off"
                                  v-model="rbaCustomContextMap[context.i18n].params[1].dataValue"
                                  @blur="handleBlur(context, 1)"
                                />
                                {{ $t('ui.rba.topic.3-1-7.option.5.more.2') }}
                              </span>
                              <span v-else>{{ option.memo }}</span>
                            </div>
                          </div>
                          <!-- 右上：風險分數 -->
                          <div class="rba-cell-block rba-context-score rba-layout-tr">
                            <div class="text-nowrap bold">{{ $t('ui.rba.score') }}</div>
                            <div v-for="(option, index) in context.options" :key="index">
                              <input
                                type="text"
                                v-model="rbaCustomContextMap[context.i18n].scores[index].score"
                                :disabled="!isEditing || !context.checked"
                                class="text-center score-editable"
                                size="4"
                                maxlength="4"
                                @change="changeScore"
                                @input="
                                  ($event.target as HTMLInputElement).value = (
                                    $event.target as HTMLInputElement
                                  ).value.replace(/\D/g, '')
                                "
                              />
                            </div>
                          </div>
                          <!-- 左下：客戶腳本 -->
                          <div class="rba-cell-block rba-cell-block-csr rba-layout-bl">
                            <div class="text-success bold">{{ $t('ui.risk-indicator.csr') }}：</div>
                            <textarea
                              rows="5"
                              class="form-control customerStatement-readonly"
                              v-model="context.customerStatement"
                              :disabled="!isEditing || !context.checked"
                            ></textarea>
                          </div>
                          <!-- 右下：重要性（獨立區塊，自帶底色） -->
                          <div
                            class="rba-importance-block rba-layout-br"
                            :class="'rba-importance-' + (rbaCustomContextMap[context.i18n].importance ?? 'none')"
                          >
                            <div class="rba-importance-inner">
                              <div class="bold rba-importance-label">
                                {{ $t('ui.risk-indicator.importantForm') }}
                              </div>
                              <div class="important-editable hidden">
                                <label class="rba-importance-option rba-importance-option-2">
                                  <input
                                    type="radio"
                                    value="2"
                                    v-model="rbaCustomContextMap[context.i18n].importance"
                                    :disabled="!isEditing || !context.checked"
                                  />
                                  {{ $t('ui.risk-important.2') }}
                                </label>
                                <label class="rba-importance-option rba-importance-option-1">
                                  <input
                                    type="radio"
                                    value="1"
                                    v-model="rbaCustomContextMap[context.i18n].importance"
                                    :disabled="!isEditing || !context.checked"
                                  />
                                  {{ $t('ui.risk-important.1') }}
                                </label>
                                <label class="rba-importance-option rba-importance-option-0">
                                  <input
                                    type="radio"
                                    value="0"
                                    v-model="rbaCustomContextMap[context.i18n].importance"
                                    :disabled="!isEditing || !context.checked"
                                  />
                                  {{ $t('ui.risk-important.0') }}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QueryCriteriaComponent, { type CriteriaField } from '@/components/query/QueryCriteriaComponent.vue'
import { useAppStoreHook } from '@/stores/app'
import ApiUtil from '@/utils/apiUtils'
import { userStateStore } from '@/stores/user'
import { computed, onMounted, reactive, ref } from 'vue'
import { type BaseSelect, defaultOptionSelect } from '@/utils/select/baseSelect'
import { findAllIssuer } from '@/hooks/issuer'
import RiskThreshold from '@/views/common/risk/issuer_risk/RiskThreshold.vue'
import swalMessage from '@/plugins/swalMessage'
import { baseIsConfirming, isConfirmingAdd } from '@/hooks/reconfirm'

const appStoreHook = useAppStoreHook()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const userState = userStateStore()
const isEditing = ref(false)
const brnShow = ref(true)
const reconfirmFlag = ref(false)
// Handle the search criteria emitted by the QueryCriteria component
const handleSearch = async (criteria: any) => {
  searchCriteria.value = { ...criteria }
  await rbaQuery(criteria)
}
// Default configuration
const rbaStaticIssuerFormReq = ref<Record<string, any>>({})
// Selected parameter configuration
const rbaCustomContextDTOList = ref<Record<string, any>>({})
// Selected scores etc.
const rbaDataIssuerFormReq = ref<Record<string, any>>({})
// Used to bind display parameters
const rbaCustomContextMap = reactive<Record<string, any>>({})
// Risk assessment threshold
const threshold = ref<Record<string, any>>({})
// Used to display theme
const topicList = ref<Record<string, any>>({})
// All
const topicListAll = ref<Record<string, any>>({})
// Query owned
const topicListQuery = ref<Record<string, any>>({})

const rbaQuery = async (criteria: any) => {
  const params: Record<string, any> = {}
  if (criteria.issuerOid && criteria.issuerOid != '00000') {
    params.issuerOid = criteria.issuerOid
  }
  const result = await apiUtil.get(`/rba/query`, params, {}, true)
  if (result.success && result.code == '0000') {
    rbaStaticIssuerFormReq.value = result.data.rbaStaticIssuerFormReq
    rbaCustomContextDTOList.value = result.data.rbaCustomContextDTOList
    rbaDataIssuerFormReq.value = result.data.rbaDataIssuerFormReq

    threshold.value = result.data.rbaDataIssuerFormReq.threshold ?? {}
    threshold.value.bankId = result.data.rbaDataIssuerFormReq.bankId
    threshold.value.bankIdValue = result.data.rbaDataIssuerFormReq.bankIdValue
    if (result.data.rbaDataIssuerFormReq.contextList && result.data.rbaStaticIssuerFormReq.topicList) {
      // Selected
      const contextListCheck = result.data.rbaDataIssuerFormReq.contextList

      // Extract array as key-value pairs
      for (const topic of result.data.rbaStaticIssuerFormReq.topicList) {
        for (const subject of topic.subjects) {
          for (const context of subject.contexts) {
            if (contextListCheck.includes(context.i18n)) {
              for (const item of result.data.rbaCustomContextDTOList) {
                if (context.i18n == context.i18n) {
                  item.copyValue = item.dataValue
                  rbaCustomContextMap[item.i18n] = item
                }
              }
            } else {
              context.copyValue = context.dataValue
              rbaCustomContextMap[context.i18n] = {
                ...context,
                scores: context.options,
                importance: 1
              }
            }

            if (result.data.rbaCustomerStatementDTOList) {
              for (const item of result.data.rbaCustomerStatementDTOList) {
                if (context.i18n == item.i18n) {
                  context.customerStatement = item.customerStatement
                }
              }
            }
          }
        }
      }

      // Handle which topics should be displayed
      fetchAndFilterData(result)
      topicListAll.value = result.data.rbaStaticIssuerFormReq.topicList

      topicList.value = topicListQuery.value
      // Handle check
      topicList.value.forEach((item1: Record<string, any>) => {
        for (const item2 of item1.subjects) {
          for (const item3 of item2.contexts) {
            item3['checked'] = !!contextListCheck.includes(item3.i18n)
          }
        }
      })
    }
    isEditing.value = false

    // Is review query
    const reconfirmFlag1 = await baseIsConfirming('issuer_risk', threshold.value.oid)
    const reconfirmFlag2 = await isConfirmingAdd('issuer_risk', params.issuerOid)
    if (reconfirmFlag1 || reconfirmFlag2) {
      brnShow.value = false
      reconfirmFlag.value = true
    } else {
      brnShow.value = true
      reconfirmFlag.value = false
    }
  } else {
    await swalMessage.error(result.message)
  }
}

// Utility function: filter contexts
function filterContexts(contexts: Record<string, any>[], validContexts: string[]): Record<string, any>[] {
  return contexts.filter((context) => validContexts.includes(context.i18n))
}

// Utility function: filter subjects
function filterSubjects(
  subjects: Record<string, any>[],
  validSubjects: string[],
  validContexts: string[]
): Record<string, any>[] {
  return subjects
    .filter((subject) => validSubjects.includes(subject.i18n)) // Keep valid subject
    .map((subject) => ({
      ...subject,
      contexts: filterContexts(subject.contexts, validContexts) // Filter contexts
    }))
    .filter((subject) => subject.contexts.length > 0) // Remove subject without valid context
}

// Main filter function
function filterTopics(
  topics: Record<string, any>[],
  validTopics: string[],
  validSubjects: string[],
  validContexts: string[]
): Record<string, any>[] {
  return topics
    .filter((topic) => validTopics.includes(topic.i18n)) // Keep valid topic
    .map((topic) => ({
      ...topic,
      subjects: filterSubjects(topic.subjects, validSubjects, validContexts) // Filter subjects
    }))
    .filter((topic) => topic.subjects.length > 0) // Remove topic without valid subject
}

// Data processing logic
function fetchAndFilterData(res: any) {
  // Deep copy original data
  const rawTopics = res.data.rbaStaticIssuerFormReq.topicList
  const validTopics = res.data.rbaDataIssuerFormReq.header1List
  const validSubjects = res.data.rbaDataIssuerFormReq.header2List
  const validContexts = res.data.rbaDataIssuerFormReq.contextList
  // Apply filter
  topicListQuery.value = filterTopics(rawTopics, validTopics, validSubjects, validContexts)
}

const rbaDataFormReq = reactive({
  bankId: '',
  thresholdValue: '',
  contextValue: '',
  paramValue: '',
  scoreValue: '',
  disableValue: '',
  bankIdValue: '',
  importance: '',
  customerStatement: ''
})
// Create reference to child component
const childRef = ref<InstanceType<typeof RiskThreshold> | null>(null)
/**
 * Submit
 * @param param
 */
const submit = async (param: any) => {
  rbaDataFormReq.thresholdValue = param.accept + ',' + param.challenge + ',' + param.ruleCount + ',' + param.summary
  rbaDataFormReq.bankId = threshold.value.bankId
  rbaDataFormReq.bankIdValue = threshold.value.bankIdValue

  // Script
  const customerStatementList: string[] = []
  // Importance
  const importanceList: string[] = []
  // All selected topics i18n
  const contextValueList: string[] = []
  // Selected [Topic i18n/Parameter i18n: Filled Parameter]
  const paramValueList: string[] = []
  // Selected [Topic i18n/Score i18n: Score]
  const scoreValueList: string[] = []

  topicList.value.forEach((group: Record<string, any>) => {
    for (const subject of group.subjects) {
      for (const context of subject.contexts) {
        // Selected topic
        if (context.checked) {
          // Script
          customerStatementList.push(context.customerStatement ?? '')
          // Importance
          importanceList.push(rbaCustomContextMap[context.i18n].importance)
          // All selected topics i18n
          contextValueList.push(context.i18n)
          // Selected [Topic i18n / Parameter i18n: Filled Parameter]
          for (const [index, param] of context.params.entries()) {
            const paramValue =
              context.i18n + '/' + param.i18n + ':' + rbaCustomContextMap[context.i18n].params[index].dataValue
            paramValueList.push(paramValue)
          }

          // ui.rba.topic.1-1-1.context.day / ui.rba.topic.1-1-1.option.0.default:50
          for (const [index, option] of context.options.entries()) {
            const scoreValue =
              context.i18n + '/' + option.i18n + ':' + rbaCustomContextMap[context.i18n].scores[index].score
            scoreValueList.push(scoreValue)
          }
        }
      }
    }
  })

  rbaDataFormReq.importance = importanceList.join(',')
  rbaDataFormReq.customerStatement = customerStatementList.join(',')
  rbaDataFormReq.contextValue = contextValueList.join(',')
  rbaDataFormReq.paramValue = paramValueList.join(',')
  rbaDataFormReq.scoreValue = scoreValueList.join(',')

  try {
    const result = await apiUtil.post('/rba/setup', rbaDataFormReq, {}, true)
    if (result.success && result.code == '0000') {
      await swalMessage.success(result.message)
      await rbaQuery(searchCriteria.value)
    } else {
      await swalMessage.error(result.message)
    }
  } finally {
    if (childRef.value) {
      childRef.value.setLoading(false)
    }
  }
}

const goBack = async (param: boolean) => {
  isEditing.value = param

  await rbaQuery(searchCriteria.value)
}
const update = (param: boolean) => {
  isEditing.value = param

  topicList.value = topicListAll.value
}
/**
 * Recalculate score on topic check
 */
const changeCheckboxFn = () => {
  // Total score
  let summary = 0
  let ruleCount = 0
  topicList.value.forEach((group: Record<string, any>) => {
    for (const subject of group.subjects) {
      for (const context of subject.contexts) {
        // Selected topic
        if (context.checked) {
          // Get max score
          const score = Math.max(...rbaCustomContextMap[context.i18n].scores.map((score: any) => Number(score.score)))
          summary = summary + score
          ruleCount++
        }
      }
    }
  })
  // Trigger listener
  threshold.value = { ...threshold.value, summary: summary, ruleCount: ruleCount }
}
/**
 * Recalculate score on score change
 */
const changeScore = () => {
  // Total score
  let summary = 0
  topicList.value.forEach((group: Record<string, any>) => {
    for (const subject of group.subjects) {
      for (const context of subject.contexts) {
        // Selected topic
        if (context.checked) {
          // Get max score
          const score = Math.max(...rbaCustomContextMap[context.i18n].scores.map((score: any) => Number(score.score)))
          summary = summary + score
        }
      }
    }
  })
  // Trigger listener
  threshold.value = { ...threshold.value, summary: summary }
}
/**
 * Handle event
 * @param context
 * @param index
 */
const handleBlur = (context: any, index: number) => {
  // Control value range and decimal point
  const value = rbaCustomContextMap[context.i18n].params[index].dataValue
  if (Number.isNaN(Number(value))) {
    rbaCustomContextMap[context.i18n].params[index].dataValue =
      rbaCustomContextMap[context.i18n].params[index].copyValue
    return
  } else {
    // Check if integer constraint is set
    if (context.params[index].fixed == '1') {
      if (/^\d+(\.\d+)?$/.test(value)) {
        rbaCustomContextMap[context.i18n].params[index].dataValue = Math.round(Number(value)).toString()
      }
    }
    if (Number(value) > Number(rbaCustomContextMap[context.i18n].params[index].maxValue)) {
      rbaCustomContextMap[context.i18n].params[index].dataValue = convertInteger(
        rbaCustomContextMap[context.i18n].params[index].maxValue
      )
    }
    if (Number(value) < Number(rbaCustomContextMap[context.i18n].params[index].minValue)) {
      rbaCustomContextMap[context.i18n].params[index].dataValue = convertInteger(
        rbaCustomContextMap[context.i18n].params[index].minValue
      )
    }
  }

  if (rbaCustomContextMap[context.i18n].params.length === 2) {
    // Compare size, conform to normal logic
    const thenPrev = context.params[1].thenPrev
    // Value greater or smaller than previous one, Param description: gt = greater, lt = smaller, others = no check
    const value1 = rbaCustomContextMap[context.i18n].params[1].dataValue
    const prevNumber = rbaCustomContextMap[context.i18n].params[0].dataValue
    if (thenPrev == 'lt') {
      if (Number(value1) >= Number(prevNumber)) {
        rbaCustomContextMap[context.i18n].params[1].dataValue = (
          Number(prevNumber) + Number(convertInteger(context.params[1].boundValue))
        ).toString()
      }
    } else {
      if (Number(value1) > Number(prevNumber)) {
        if (Number(value1) >= Number(99)) {
          rbaCustomContextMap[context.i18n].params[1].dataValue = '99'
        }
      } else {
        if (Number(value1) >= Number(99)) {
          rbaCustomContextMap[context.i18n].params[1].dataValue = '99'
          rbaCustomContextMap[context.i18n].params[0].dataValue = (Number(value1) - Number(1)).toString()
        } else {
          rbaCustomContextMap[context.i18n].params[0].dataValue = (Number(value1) - Number(1)).toString()
        }
      }
    }
  }
  rbaCustomContextMap[context.i18n].params[index].copyValue = value
}
const convertInteger = (value: number) => {
  console.log(value)
  let intNum
  if (Number(value) > Number(1)) {
    intNum = Math.floor(value)
    console.log(intNum)
  } else {
    intNum = Math.sign(value)
    console.log(intNum)
  }

  return intNum
}

/** 將 contexts 兩兩一組，供表格每列顯示兩個項目 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function chunkContexts(contexts: any[] | undefined): any[][] {
  if (!contexts?.length) return []
  const pairs: any[][] = []
  for (let i = 0; i < contexts.length; i += 2) {
    pairs.push(contexts.slice(i, i + 2))
  }
  return pairs
}

const issuerOptions = computed(() => {
  // Whether to add optionSelect
  return appStoreHook.organ == 'hosted' ? [...defaultOptionSelect, ...issuerData.value] : [...issuerData.value]
})

// Reactive to refresh table
const searchCriteria = ref<any>({ issuerOid: userState.user.issuerOid })
const issuerData = ref<BaseSelect[]>([])

// Initialization trigger function
onMounted(async () => {
  issuerData.value = await findAllIssuer()
  await rbaQuery(searchCriteria.value)
})
// Search condition configuration
const userQueryConfig = ref<CriteriaField[]>([
  {
    type: 'select',
    label: 'ui.issuer.name',
    model: 'issuerOid',
    default: appStoreHook.organ == 'hosted' ? '00000' : userState.user.issuerOid,
    readOnly: appStoreHook.organ == 'issuer',
    props: {
      options: issuerOptions,
      id: 'issuerOid'
    }
  }
])
</script>

<style scoped>
/* ========== 1. 主題卡片 ========== */
.rba-topic-card {
  margin-top: 1rem;
  border-radius: 6px;
}

.rba-topic-card:first-child {
  margin-top: 0;
}

.rba-subject-header {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--cui-body-color);
  padding: 0.5rem 0 0.25rem;
  margin-top: 0.75rem;
  border-bottom: 1px solid var(--cui-border-color);
}

.rba-subject-header:first-child {
  margin-top: 0;
}

/* ========== 2. 表格與 cell（每列兩項目、底線區隔、hover） ========== */
.rba-topic-table-wrap {
  max-width: 100%;
}

.rba-topic-table {
  border-collapse: separate;
  border-spacing: 0.75rem 0.5rem;
}

.rba-topic-table .context-row {
  border-bottom: 1px solid var(--cui-border-color);
}

.rba-topic-table .context-row:last-child {
  border-bottom-width: 0;
}

.rba-topic-table .rba-context-cell {
  width: 50%;
  vertical-align: top;
  padding: 0.875rem 1rem;
  border-right: 1px solid var(--cui-border-color);
  background-color: rgba(0, 0, 0, 0.01);
}

.rba-topic-table .rba-context-cell:last-child {
  border-right: 0;
}

.rba-topic-table .rba-context-cell:hover {
  background-color: var(--cui-tertiary-bg);
}

/* ========== 3. Cell 內結構（區塊一～四、2x2 格線） ========== */
.rba-context-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rba-cell-block {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
}

.rba-context-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.rba-context-meta .column-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.35rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--sidebar-active-text, #8c1c36);
  background-color: var(--sidebar-active-bg, rgba(140, 28, 54, 0.12));
  border-radius: 0.25rem;
}

.rba-context-meta .column-checkbox {
  display: inline-flex;
  align-items: center;
}

.rba-context-meta .checkbox-editable {
  width: 1.125rem;
  height: 1.125rem;
  margin: 0;
  cursor: pointer;
  accent-color: var(--sidebar-active-bg, #8c1c36);
}

.rba-context-body {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 0.75rem 1.25rem;
  align-items: stretch;
}

.rba-layout-tl {
  grid-row: 1;
  grid-column: 1;
}

.rba-layout-tr {
  grid-row: 1;
  grid-column: 2;
}

.rba-layout-bl {
  grid-row: 2;
  grid-column: 1;
}

.rba-layout-br {
  grid-row: 2;
  grid-column: 2;
}

/* 客戶腳本 textarea 固定高度，與重要性區塊同列時等高 */
.rba-cell-block-csr textarea.customerStatement-readonly {
  height: 8.5rem;
  min-height: 8.5rem;
  box-sizing: border-box;
}

/* ========== 4. 左上／右上區塊內容（主題與選項、風險分數） ========== */
.rba-context-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rba-context-content > .text-nowrap {
  margin-bottom: 0.125rem;
}

.rba-context-content .form-control {
  margin-top: 0.25rem;
}

.rba-context-score {
  min-width: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  text-align: center;
}

.rba-context-score .text-nowrap.bold {
  margin-bottom: 0.125rem;
}

.rba-context-score input.score-editable {
  height: 1.75rem;
  width: 3.5rem;
  margin: 0;
}

/* ========== 5. 右下：重要性區塊（淡色底、白字，高度與腳本 textarea 一致） ========== */
.rba-importance-block {
  padding: 1.25rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--cui-border-color);
  transition: background-color 0.2s ease;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 8.5rem;
  min-height: 8.5rem;
  box-sizing: border-box;
  align-self: end;
  justify-self: end;
}

.rba-importance-block .rba-importance-label,
.rba-importance-block .important-editable {
  color: #fff;
}

.rba-importance-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.rba-importance-label {
  font-size: 1.0625rem;
}

.rba-importance-block .rba-importance-option {
  display: block;
  color: #fff;
  cursor: pointer;
  margin-bottom: 0.35rem;
  font-size: 1.0625rem;
}

.rba-importance-block .rba-importance-option:last-child {
  margin-bottom: 0;
}

.rba-importance-block .rba-importance-option input {
  margin-right: 0.5rem;
  width: 1.125rem;
  height: 1.125rem;
  vertical-align: middle;
}

/* 重要性依選擇變色（淡色）：未選 / 0 / 1 / 2 */
.rba-importance-block.rba-importance-none {
  background-color: rgba(90, 83, 85, 0.8);
}

.rba-importance-block.rba-importance-0 {
  background-color: rgba(25, 135, 84, 0.8);
}

.rba-importance-block.rba-importance-1 {
  background-color: rgba(184, 134, 11, 0.8);
}

.rba-importance-block.rba-importance-2 {
  background-color: rgba(201, 42, 58, 0.8);
}
</style>
