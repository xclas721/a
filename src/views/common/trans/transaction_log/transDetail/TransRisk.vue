<template>
  <div class="header-title">{{ $t('ui.risk-indicator.result') }}</div>
  <div class="content-box p-3">
    <div class="risk-indicator">
      <div class="panel panel-danger">
        <div class="panel-body">
          <RiskThreshold
            :is-editing="false"
            :btn-show="false"
            :threshold-detail="data.riskEvaluationRequest ? (data.riskEvaluationRequest.threshold ?? {}) : {}"
            :risk-report="data.riskReportLogDTO"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="header-title mt-3">{{ $t('ui.risk-indicator.report') }}</div>
  <div class="content-box p-3">
    <div class="risk-indicator">
      <div class="panel panel-danger">
        <div class="panel-body">
          <div class="row">
            <div class="col-md-12">
              <div v-for="(group, index) in data.rbaTopicGroupList" :key="index">
                <div v-for="subject in group.subjects" :key="subject.oid">
                  <div class="table-responsive">
                    <table class="table table-condensed table-hover">
                      <tbody>
                        <template v-for="(context, contextIndex) in subject.contexts" :key="contextIndex">
                          <!-- Topic: (3)Content -->

                          <template
                            v-for="(riskReport, riskReportIndex) in data.riskReport.ruleEvaluationResults"
                            :key="riskReportIndex"
                          >
                            <template v-if="context.i18n == riskReport.name">
                              <tr>
                                <!-- column 1: No. -->
                                <td class="text-center" style="width: 5%">
                                  {{ contextIndex + 1 }}
                                </td>

                                <!-- column 3: Topic + Options -->
                                <td>
                                  <div class="text-nowrap">{{ context.memo }}</div>
                                  <div
                                    v-for="(option, optionIndex) in context.options"
                                    :key="optionIndex"
                                    class="text-nowrap"
                                  >
                                    <!--                                  Mark matched in red-->
                                    <span v-if="optionIndex == riskReport.option">
                                      <span class="mark text-danger"
                                        >({{ optionIndex }})
                                        {{ option.memo }}
                                      </span>
                                      <br />
                                    </span>
                                    <span v-else>
                                      <span
                                        >({{ optionIndex }})
                                        {{ option.memo }}
                                      </span>
                                      <br />
                                    </span>
                                  </div>
                                  <div style="margin-top: 0.5em">
                                    <div class="text-success bold">{{ $t('ui.trans.risk.rule.report') }}：</div>
                                    <p class="border border-start p-3">{{ riskReport.message }}</p>
                                  </div>
                                  <!-- Customer Script -->
                                  <div style="margin-top: 0.5em">
                                    <div class="text-success bold">{{ $t('ui.risk-indicator.csr') }}：</div>
                                    <template
                                      v-for="(formulaList, formulaListIndex) in data.riskEvaluationRequest.formulaList"
                                      :key="formulaListIndex"
                                    >
                                      <template v-if="context.i18n == formulaList.name">
                                        <textarea
                                          rows="5"
                                          class="form-control customerStatement-readonly"
                                          v-model="formulaList.customerStatement"
                                          disabled
                                        ></textarea>
                                      </template>
                                    </template>
                                  </div>
                                </td>

                                <!-- column 4: Score -->
                                <td class="text-center" style="width: 5%">
                                  <div class="text-nowrap bold">{{ $t('ui.rba.score') }}</div>
                                  <div v-for="(score, index) in context.options" :key="index">
                                    <span v-if="index == riskReport.option">
                                      <span class="score-readonly mark text-danger">
                                        {{ score.score }}
                                      </span>
                                      <br />
                                    </span>
                                    <span v-else>
                                      <span class="score-readonly">
                                        {{ score.score }}
                                      </span>
                                      <br />
                                    </span>
                                  </div>
                                  <div style="margin-top: 0.5em">
                                    <br />
                                    <div class="text-warning bold">
                                      {{ $t('ui.risk-indicator.importantForm') }}
                                    </div>
                                    <template
                                      v-for="(formulaList, formulaListIndex) in data.riskEvaluationRequest.formulaList"
                                      :key="formulaListIndex"
                                    >
                                      <template v-if="context.i18n == formulaList.name">
                                        <div class="important-editable hidden">
                                          <span class="mark text-danger">{{
                                            $t('ui.risk-important.' + formulaList.importance)
                                          }}</span>
                                        </div>
                                      </template>
                                    </template>
                                  </div>
                                </td>
                              </tr>
                            </template>
                          </template>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RiskThreshold from '@/views/common/risk/issuer_risk/RiskThreshold.vue'

defineProps<{
  data: Record<string, any>
}>()
</script>
