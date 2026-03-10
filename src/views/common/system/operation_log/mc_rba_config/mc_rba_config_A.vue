<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
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
        <span class="form-label d-block">{{ $t('ui.mc-rba.enabled') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.enabledFlag, dataBefore.enabledFlag) }">
            {{ getOptionsByValue(dataAfter.enabledFlag, enableFlagOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mc-rba.low-risk') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.policyLowRisk, dataBefore.policyLowRisk)
            }"
          >
            {{ getOptionsByValue(dataAfter.policyLowRisk, policyLowRiskOptionSave) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mc-rba.not-low-risk') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.policyNotLowRisk, dataBefore.policyNotLowRisk)
            }"
          >
            {{ getOptionsByValue(dataAfter.policyNotLowRisk, policyNotLowRiskOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mc-rba.score.ind') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.mcRbaScoreInd, dataBefore.mcRbaScoreInd)
            }"
          >
            {{ valOrNA(dataAfter.mcRbaScoreInd) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mc-rba.score.ind.2') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.mcRbaScoreInd2, dataBefore.mcRbaScoreInd2)
            }"
          >
            {{ valOrNA(dataAfter.mcRbaScoreInd2) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mc-rba.score.rbaEvaluation') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.rbaEvaluation, dataBefore.rbaEvaluation)
            }"
          >
            {{ getOptionsByValue(dataAfter.rbaEvaluation, rbaEvaluationOption) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="border border-light-subtle mx-2">
        <div class="header-title">{{ $t('ui.mc-rba.policy-reason-code') }}</div>
        <div class="content-box p-3">
          <div class="row mb-3">
            <div class="col-md-12">
              <!-- Data edit area frame -->
              <div class="panel panel-default panel-info">
                <div class="panel-body">
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th style="width: 15%">#</th>
                          <th style="width: 20%; text-align: center">
                            {{ $t('ui.mc-rba.reason-code') }}
                            <!-- Reason Code -->
                          </th>
                          <th>
                            {{ $t('ui.mc-rba.description') }}
                            <!-- Description -->
                          </th>
                          <th>
                            {{ $t('ui.operation') }}
                            <!-- Execution options -->
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(reasonCodeConfig, index) in dataAfter.mcRbaReasonCodeConfigs" :key="index">
                          <!-- enabledFlag -->
                          <td>
                            <span
                              :class="{
                                'text-danger': isDifferent(
                                  reasonCodeConfig.enabledFlag,
                                  getBeforeReasonCodeValue(index, 'enabledFlag')
                                )
                              }"
                            >
                              {{ $t(`ui.mc-rba.enabled.${reasonCodeConfig.enabledFlag}`) }}
                            </span>
                          </td>

                          <!-- reasonCode -->
                          <td style="text-align: center">
                            <span
                              :class="{
                                'text-danger': isDifferent(
                                  reasonCodeConfig.reasonCode,
                                  getBeforeReasonCodeValue(index, 'reasonCode')
                                )
                              }"
                            >
                              {{ reasonCodeConfig.reasonCode }}
                            </span>
                          </td>

                          <!-- description (based on reasonCode) -->
                          <td>
                            <span
                              :class="{
                                'text-danger': isDifferent(
                                  reasonCodeConfig.reasonCode,
                                  getBeforeReasonCodeValue(index, 'reasonCode')
                                )
                              }"
                            >
                              {{ $t(`ui.mc-rba.reason-code-${reasonCodeConfig.reasonCode}`) }}
                            </span>
                          </td>

                          <!-- policy -->
                          <td style="white-space: nowrap">
                            <p v-if="reasonCodeConfig.policy">
                              <span
                                :class="{
                                  'text-danger': isDifferent(
                                    reasonCodeConfig.policy,
                                    getBeforeReasonCodeValue(index, 'policy')
                                  )
                                }"
                              >
                                {{ $t(`ui.mc-rba.policy.${reasonCodeConfig.policy}`) }}
                              </span>
                            </p>
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { enableFlagOptionSelect } from '@/utils/select/visarba'
import { policyLowRiskOptionSave, policyNotLowRiskOptionSelect, rbaEvaluationOption } from '@/utils/select/mcrba'
const getBeforeReasonCodeValue = (index: number, field: string) => {
  // If dataBefore has no data, return undefined (isDifferent will handle)
  if (!props.dataBefore.mcRbaReasonCodeConfigs || index >= props.dataBefore.mcRbaReasonCodeConfigs.length) {
    return undefined
  }
  return props.dataBefore.mcRbaReasonCodeConfigs[index][field]
}
const props = defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
