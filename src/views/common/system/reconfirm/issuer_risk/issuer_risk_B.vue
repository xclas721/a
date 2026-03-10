<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <div v-if="dataBefore.bankId">
          <input class="form-control" readonly :value="getIssuerName(dataBefore.bankId)" />
        </div>
        <div v-else>
          <input class="form-control" readonly :value="$t('ui.reconfirm.sys-param')" />
        </div>
        <hr />
      </div>

      <div class="border border-light-subtle">
        <div class="header-title-red">{{ $t('ui.rba.threshold') }}</div>
        <div class="content-box-red p-3">
          <div class="row mb-3">
            <RiskThreshold :is-editing="false" :btn-show="false" :threshold-detail="threshold" />
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-12">
          <div v-for="(group, index) in topicList" :key="index">
            <div class="bg-info p-3 mt-2" style="font-size: 1.5em; font-weight: bold; border-radius: 0.5em 0.5em 0 0">
              {{ $t(group.i18n) }}
            </div>

            <div v-for="subject in group.subjects" :key="subject.oid">
              <div class="mt-2 rba-subject-header">
                {{ $t(subject.i18n) }}
              </div>
              <div class="table-responsive">
                <table class="table table-condensed table-hover">
                  <thead style="display: none">
                    <tr>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Topic: (3)Content -->
                    <tr v-for="(context, contextIndex) in subject.contexts" :key="contextIndex" class="context">
                      <!-- column 1: No. -->
                      <td class="text-center column-number" style="width: 5%">
                        {{ context.indexNo }}
                      </td>

                      <!-- column 3: Topic + Options -->
                      <td>
                        <div class="text-nowrap">{{ context.memo }}</div>
                        <div v-for="(option, optionIndex) in context.options" :key="optionIndex" class="text-nowrap">
                          ({{ optionIndex }})
                          <span v-if="option.i18n == 'ui.rba.topic.1-1-1.option.2.medium'">
                            {{ $t('ui.rba.topic.1-1-1.option.2.medium.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>

                            {{ $t('ui.rba.topic.1-1-1.option.2.medium.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-1.option.3.low'">
                            {{ $t('ui.rba.topic.1-1-1.option.3.low.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-1.option.3.low.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-2.option.1.high'">
                            {{ $t('ui.rba.topic.1-1-2.option.1.high.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-2.option.1.high.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-2.option.2.medium'">
                            {{ $t('ui.rba.topic.1-1-2.option.2.medium.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-2.option.2.medium.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-2.option.3.low'">
                            {{ $t('ui.rba.topic.1-1-2.option.3.low.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                          </span>
                          <!--                    Cardholder shopping currency usage frequency-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-3.option.1.high'">
                            {{ $t('ui.rba.topic.1-1-3.option.1.high.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            %
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-3.option.2.medium'">
                            {{ $t('ui.rba.topic.1-1-3.option.2.medium.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-3.option.2.medium.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            %
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-3.option.3.low'">
                            {{ $t('ui.rba.topic.1-1-3.option.3.low.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-3.option.3.low.2') }}
                          </span>
                          <!--                    Cardholder historical shopping time difference-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-4.option.1.high'">
                            {{ $t('ui.rba.topic.1-1-4.option.1.high.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-4.option.1.high.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-4.option.2.medium'">
                            {{ $t('ui.rba.topic.1-1-4.option.2.medium.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-4.option.2.medium.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-4.option.2.medium.3') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-4.option.3.low'">
                            {{ $t('ui.rba.topic.1-1-4.option.3.low.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-4.option.3.low.2') }}
                          </span>
                          <!--                    Cardholder shopping location (country/region) frequency-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-5.option.1.high'">
                            {{ $t('ui.rba.topic.1-1-5.option.1.high.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            %
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-5.option.2.medium'">
                            {{ $t('ui.rba.topic.1-1-5.option.2.medium.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-5.option.2.medium.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            %
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-5.option.3.low'">
                            {{ $t('ui.rba.topic.1-1-5.option.3.low.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-5.option.3.low.2') }}
                          </span>
                          <!--                    Cardholder shopping merchant category (MCC) ratio-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-6.option.1.high'">
                            {{ $t('ui.rba.topic.1-1-6.option.1.high.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            %
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-6.option.2.medium'">
                            {{ $t('ui.rba.topic.1-1-6.option.2.medium.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-6.option.2.medium.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            %
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-6.option.3.low'">
                            {{ $t('ui.rba.topic.1-1-6.option.3.low.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-6.option.3.low.2') }}
                          </span>
                          <!--                    Cardholder shopping merchant country/region ratio-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-7.option.1.high'">
                            {{ $t('ui.rba.topic.1-1-7.option.1.high.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            %
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-7.option.2.medium'">
                            {{ $t('ui.rba.topic.1-1-7.option.2.medium.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-7.option.2.medium.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            %
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.1-1-7.option.3.low'">
                            {{ $t('ui.rba.topic.1-1-7.option.3.low.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.1-1-7.option.3.low.2') }}
                          </span>
                          <!-- Indicator for transaction count of the same card number within one month -->
                          <span v-else-if="option.i18n == 'ui.rba.topic.2-1-1.option.1.high'">
                            {{ $t('ui.rba.topic.2-1-1.option.1.high.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.2-1-1.option.1.high.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.2-1-1.option.2.medium'">
                            {{ $t('ui.rba.topic.2-1-1.option.2.medium.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            ～
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.2-1-1.option.2.medium.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.2-1-1.option.3.low'">
                            {{ $t('ui.rba.topic.2-1-1.option.3.low.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.2-1-1.option.3.low.2') }}
                          </span>
                          <!--                    Time difference between current location and previous foreign (country/region) transaction-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.2-1-3.option.1.high'">
                            {{ $t('ui.rba.topic.2-1-3.option.1.high.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.2-1-3.option.1.high.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.2-1-3.option.2.medium'">
                            {{ $t('ui.rba.topic.2-1-3.option.2.medium.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.2-1-3.option.2.medium.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.2-1-3.option.2.medium.3') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.2-1-3.option.3.low'">
                            {{ $t('ui.rba.topic.2-1-3.option.3.low.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.2-1-3.option.3.low.2') }}
                          </span>
                          <!--                    Indicator for cardholder member account registration time on merchant platform-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-1.option.3.less'">
                            {{ $t('ui.rba.topic.3-1-1.option.3.less.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-1.option.3.less.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-1.option.4.middle'">
                            {{ $t('ui.rba.topic.3-1-1.option.4.middle.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-1.option.4.middle.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-1.option.4.middle.3') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-1.option.5.more'">
                            {{ $t('ui.rba.topic.3-1-1.option.5.more.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-1.option.5.more.2') }}
                          </span>
                          <!--                    Indicator for cardholder member account modification time-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-2.option.2.less'">
                            {{ $t('ui.rba.topic.3-1-2.option.2.less.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>

                            {{ $t('ui.rba.topic.3-1-2.option.2.less.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-2.option.3.middle'">
                            {{ $t('ui.rba.topic.3-1-2.option.3.middle.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-2.option.3.middle.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-2.option.3.middle.3') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-2.option.4.more'">
                            {{ $t('ui.rba.topic.3-1-2.option.4.more.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-2.option.4.more.2') }}
                          </span>
                          <!--                    Indicator for cardholder member password modification time-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-3.option.3.less'">
                            {{ $t('ui.rba.topic.3-1-3.option.3.less.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-3.option.3.less.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-3.option.4.middle'">
                            {{ $t('ui.rba.topic.3-1-3.option.4.middle.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-3.option.4.middle.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-3.option.4.middle.3') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-3.option.5.more'">
                            {{ $t('ui.rba.topic.3-1-3.option.5.more.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-3.option.5.more.2') }}
                          </span>
                          <!--                    Shipping address usage time indicator-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-4.option.2.less'">
                            {{ $t('ui.rba.topic.3-1-4.option.2.less.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-4.option.2.less.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-4.option.3.middle'">
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-4.option.3.middle.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-4.option.3.middle.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-4.option.4.more'">
                            {{ $t('ui.rba.topic.3-1-4.option.4.more.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-4.option.4.more.2') }}
                          </span>
                          <!--                    Payment account creation time indicator-->
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-7.option.3.less'">
                            {{ $t('ui.rba.topic.3-1-7.option.3.less.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-7.option.3.less.2') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-7.option.4.middle'">
                            {{ $t('ui.rba.topic.3-1-7.option.4.middle.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[0].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-7.option.4.middle.2') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">
                                {{ rbaCustom.params[1].dataValue }}
                              </span>
                            </span>
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n"> {{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-7.option.4.middle.3') }}
                          </span>
                          <span v-else-if="option.i18n == 'ui.rba.topic.3-1-7.option.5.more'">
                            {{ $t('ui.rba.topic.3-1-7.option.5.more.1') }}
                            <span v-for="rbaCustom in dataBefore.rbaCustomContextDTOList" :key="rbaCustom.oid">
                              <span v-if="rbaCustom.i18n == context.i18n">{{ rbaCustom.params[1].dataValue }}</span>
                            </span>
                            {{ $t('ui.rba.topic.3-1-7.option.5.more.2') }}
                          </span>
                          <span v-else>{{ option.memo }}</span>
                        </div>

                        <!-- Customer Script -->
                        <div style="margin-top: 0.5em">
                          <div class="text-success bold">{{ $t('ui.risk-indicator.csr') }}：</div>
                          <textarea
                            rows="5"
                            class="form-control customerStatement-readonly"
                            v-model="context.customerStatement"
                            disabled
                          ></textarea>
                        </div>
                      </td>

                      <!-- column 4: Score -->
                      <td class="text-center" style="width: 5%">
                        <div class="text-nowrap bold">{{ $t('ui.rba.score') }}</div>
                        <div v-for="(score, index) in context.scores" :key="index">
                          <span class="score-readonly">{{ score.score }}</span>
                        </div>
                        <div style="margin-top: 0.5em">
                          <br />
                          <div class="text-warning bold">
                            {{ $t('ui.risk-indicator.importantForm') }}
                          </div>
                          <div class="text-warning important-editable hidden">
                            <span v-if="context.importance == '2'">{{ $t('ui.risk-important.2') }}</span>
                            <br />
                            <span v-if="context.importance == '1'">{{ $t('ui.risk-important.1') }}</span>
                            <br />
                            <span v-if="context.importance == '0'">{{ $t('ui.risk-important.0') }}</span>
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
  </div>
</template>
<script setup lang="ts">
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, ref } from 'vue'
import type { IssuerData } from '@/hooks/issuer'
import ApiUtil from '@/utils/apiUtils'
import RiskThreshold from '@/views/common/risk/issuer_risk/RiskThreshold.vue'

const props = defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const issuerNameOptions = ref<BaseSelect[]>([])
// Used to display theme
const topicList = ref<Record<string, any>>({})
// Risk assessment threshold
const threshold = ref<Record<string, any>>({})
const getIssuerName = (param: string) => {
  const option = issuerNameOptions.value.find((item) => item.value == param)
  return option?.text
}
onMounted(async () => {
  const result = await apiUtil.post('/issuer/query', { page: { pageSize: 10, pageNumber: 1 }, criteria: {} }, {}, true)

  for (const code of result.data.content as IssuerData[]) {
    issuerNameOptions.value.push({
      value: code.bankId ?? '',
      text: code.issuerName ?? ''
    })
  }

  fetchAndFilterData()

  threshold.value = props.dataBefore.rbaDataIssuerFormReq.threshold ?? {}
})

// Utility function: filter contexts
function filterContexts(contexts: Record<string, any>[], validContexts: string[]): Record<string, any>[] {
  for (const item of props.dataBefore.rbaCustomContextDTOList) {
    for (const context of contexts) {
      if (context.i18n == item.i18n) {
        context.customerStatement = item.customerStatement
        context.scores = item.scores
        context.importance = item.importance
      }
    }
  }
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
function fetchAndFilterData() {
  // Deep copy original data
  const rawTopics = props.dataBefore.rbaStaticIssuerFormReq.topicList
  const validTopics = props.dataBefore.rbaDataIssuerFormReq.header1List
  const validSubjects = props.dataBefore.rbaDataIssuerFormReq.header2List
  const validContexts = props.dataBefore.rbaDataIssuerFormReq.contextList
  // Apply filter
  topicList.value = filterTopics(rawTopics, validTopics, validSubjects, validContexts)
}
</script>
