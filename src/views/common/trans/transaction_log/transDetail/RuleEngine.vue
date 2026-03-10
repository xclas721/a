<template>
  <div class="header-title">DAF {{ $t('ui.risk-indicator.report') }}</div>
  <div class="content-box p-3">
    <div class="row">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-4">
            <span class="form-label d-block text-primary fw-bold">{{
              $t('ui.trans.log.rule-engine.solutionName')
            }}</span>
            <span class="span-control">{{ data.ruleSolutionExt ? valOrNA(data.ruleSolutionExt.name) : 'N/A' }}</span>
          </div>

          <div class="col-md-4">
            <span class="form-label d-block text-primary fw-bold">{{ $t('ui.trans.log.rule-engine.result') }}</span>
            <span class="span-control">{{ evaluationResult() }}</span>
          </div>
          <div class="col-md-4">
            <span class="form-label d-block text-primary fw-bold">{{ $t('ui.trans.log.rule-engine.isHit') }}</span>
            <span class="span-control">{{
              data.isHit ? $t('ui.trans.log.rule-engine.isHit.' + data.isHit) : 'N/A'
            }}</span>
          </div>
          <hr />
        </div>
      </div>
    </div>
  </div>

  <div class="col-md-12 mt-3">
    <div class="row">
      <div class="col-md-12">
        <hr style="margin: 0" />
        <table class="table table-striped table-hover">
          <thead class="thead-light">
            <tr class="bg-primary">
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.execute.status') }}</th>
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.hit') }}</th>
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.decision') }}</th>
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.rule.group') }}</th>
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.rule') }}</th>
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.rule-description') }}</th>
            </tr>
          </thead>
          <tbody v-if="data.ruleSolutionExt">
            <tr class="active" v-for="(ruleGroupExt, index) in data.ruleSolutionExt.ruleGroupExtList" :key="index">
              <td>
                <template v-if="ruleGroupExt.executeStatus">
                  <span class="text-success" style="font-size: 16px">●</span>
                </template>
                <template v-else>
                  <span class="text-warning" style="font-size: 16px">●</span>
                </template>
              </td>
              <td>
                <template v-if="ruleGroupExt.hit">
                  <i class="fa fa-check text-success" aria-hidden="true"></i>
                </template>
                <template v-else>
                  <i class="fa fa-times text-danger" aria-hidden="true"></i>
                </template>
              </td>
              <td>
                <template v-if="ruleGroupExt.ruleDecision.code == '01'">
                  {{ $t('ui.trans.log.rule-engine.frictionless') }}
                </template>
                <template v-else-if="ruleGroupExt.ruleDecision.code == '02'">
                  {{ $t('ui.trans.log.rule-engine.challenge') }}
                </template>
                <template v-else-if="ruleGroupExt.ruleDecision.code == '03'"
                  >{{ $t('ui.trans.log.rule-engine.reject') }}
                </template>
                <template v-else>N/A</template>
              </td>
              <td>{{ ruleGroupExt.code }} - {{ ruleGroupExt.name }}</td>
              <td>
                <div class="text-nowrap"></div>
                <template v-for="(ruleExt, index) in ruleGroupExt.ruleExtList" :key="index">
                  <template v-if="ruleExt.hit">
                    <div class="text-nowrap">
                      <i class="fa fa-check text-success" aria-hidden="true">&nbsp;&nbsp;</i>
                      {{ ruleExt.code }} - {{ ruleExt.name }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-nowrap">
                      <i class="fa fa-times text-danger" aria-hidden="true">&nbsp;&nbsp;</i>
                      {{ ruleExt.code }} - {{ ruleExt.name }}
                    </div>
                  </template>
                </template>
              </td>
              <td>
                <div class="text-nowrap"></div>
                <template v-for="(ruleExt, index) in ruleGroupExt.ruleExtList" :key="index">
                  <div class="text-nowrap">
                    <template v-if="ruleExt.description">
                      {{ ruleExt.description }}
                    </template>
                    <template v-else><br /></template>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="col-md-12 mt-3">
    <div class="row">
      <div class="col-md-12">
        <hr style="margin: 0" />
        <table class="table table-striped table-hover">
          <thead class="thead-light">
            <tr class="bg-primary">
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.api') }}</th>
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.processTime') }}</th>
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.responseCode') }}</th>
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.errorDescription') }}</th>
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.req') }}</th>
              <th class="border-0">{{ $t('ui.trans.log.rule-engine.res') }}</th>
            </tr>
          </thead>
          <tbody v-if="data.apiLogs">
            <tr class="active" v-for="(apiLog, index) in data.apiLogs" :key="index">
              <td>
                <template v-if="apiLog.apiCode">{{ $t('ui.trans.log.rule-engine.api.' + apiLog.apiCode) }}</template>
              </td>
              <td>
                <template v-if="apiLog.execTime">
                  {{ apiLog.execTime }} ({{ $t('ui.trans.log.rule-engine.ms') }})
                </template>
                <template v-else>N/A</template>
              </td>
              <td>
                <template v-if="apiLog.statusCode">
                  {{ $t('ui.trans.log.rule-engine.responseCode.' + apiLog.statusCode) }} ({{ apiLog.statusCode }})
                </template>
                <template v-else>N/A</template>
              </td>
              <td>
                {{ apiLog.statusDetail ? apiLog.statusDetail : 'N/A' }}
              </td>
              <td>
                <UtilityButton
                  label="ui.trans.log-content.message"
                  variant="primary"
                  appearance="contained"
                  @click="showJson(apiLog, 'req')"
                />
              </td>
              <td>
                <UtilityButton
                  label="ui.trans.log-content.message"
                  variant="primary"
                  appearance="contained"
                  @click="showJson(apiLog, 'res')"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="col-md-12 mt-3">
    <div class="card-header">
      <h4 style="font-size: 1.3em; color: #31708f; font-weight: bold">
        {{ $t('ui.trans.log.rule-engine.ai-predict-result') }}
      </h4>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-info">
          <table class="table table-centered table-nowrap mb-0 rounded">
            <thead class="thead-light">
              <tr>
                <th class="bg-info col-md-2" style="border-bottom: 0px">
                  {{ $t('ui.trans.log.rule-engine.model-name') }}({{ $t('ui.trans.log.rule-engine.model-id') }})
                </th>
                <th class="bg-info col-md-2" style="border-bottom: 0px">
                  {{ $t('ui.trans.log.rule-engine.policy-score') }}
                </th>
                <th class="bg-info col-md-2" style="border-bottom: 0px">
                  {{ $t('ui.trans.log.rule-engine.status-code') }}
                </th>
                <th class="bg-info" style="border-bottom: 0px">
                  {{ $t('ui.trans.log.rule-engine.risk-reason') }}
                </th>
                <th class="bg-info" style="border-bottom: 0px">
                  {{ $t('ui.trans.log.rule-engine.req') }}
                </th>
                <th class="bg-info" style="border-bottom: 0px">
                  {{ $t('ui.trans.log.rule-engine.res') }}
                </th>
              </tr>
            </thead>
            <tbody v-if="data.aiPredictResults">
              <tr v-for="(result, index) in data.aiPredictResults" :key="index">
                <td>
                  <template v-if="result.apiCode"
                    >{{ $t('ui.trans.log.rule-engine.' + result.apiCode) }} ({{ result.apiCode }})</template
                  >
                </td>
                <td>
                  <template v-if="result.decisionCode != '-999'">{{ result.decisionCode }}</template>
                  <template v-else>N/A</template>
                </td>
                <td>
                  <template v-if="result.statusCode"
                    >{{ $t('ui.trans.log.rule-engine.status-code.' + result.statusCode) }} ({{
                      result.statusCode
                    }})</template
                  >
                </td>
                <td class="risk-reason">
                  {{ result.statusDetail }}
                </td>
                <td class="text-nowrap">
                  <UtilityButton
                    label="ui.trans.log-content.message"
                    variant="primary"
                    appearance="contained"
                    @click="showJson(result, 'req')"
                  />
                </td>
                <td class="text-nowrap">
                  <UtilityButton
                    label="ui.trans.log-content.message"
                    variant="primary"
                    appearance="contained"
                    @click="showJson(result, 'res')"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <MessageLogsJson
    :title="title"
    :detail-data="detailData"
    v-model="showMessageJson"
    v-if="showMessageJson"
  ></MessageLogsJson>
</template>
<script setup lang="ts">
import { valOrNA } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import MessageLogsJson from '@/views/common/trans/transaction_log/transDetail/MessageLogsJson.vue'
import UtilityButton from '@/components/UtilityButton.vue'

const { t } = useI18n()
const props = defineProps<{
  data: Record<string, any>
}>()

function evaluationResult() {
  let str = ''
  const threedsTransDTO = props.data.threedsTransDTO
  if (threedsTransDTO && threedsTransDTO.riskAssesmentResult) {
    str = t('ui.trans.log.risk-method.' + threedsTransDTO.riskAssesmentMethod) + '-'
    if (threedsTransDTO.riskAssesmentResult) {
      str = str + t('ui.trans.log.reskAssesmentResult.' + threedsTransDTO.riskAssesmentResult)
    }
    str = str + '(' + threedsTransDTO.riskItemType + ':'
    if (threedsTransDTO.riskAssesmentMethod == '02' || threedsTransDTO.riskAssesmentMethod == '03') {
      str = str + t('ui.black-list.itemType.' + threedsTransDTO.riskItemType)
    } else if (threedsTransDTO.riskAssesmentMethod == '05') {
      str = str + t('ui.mc-rba.reason-code-' + threedsTransDTO.riskItemType)
    } else {
      str = str + t('ui.trans.log.riskAssesmentReason.' + threedsTransDTO.riskItemType)
    }
    str = str + ')'
  }
  return str
}

const title = ref('')
const detailData = ref()
const showMessageJson = ref(false)
const showJson = (row: Record<string, any>, type: string) => {
  title.value = type
  if (type == 'req') {
    detailData.value = row.reqData
  } else {
    detailData.value = row.resData
  }
  showMessageJson.value = true
}
</script>
