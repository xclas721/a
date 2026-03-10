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
        <span class="form-label d-block">{{ $t('ui.mc-rba.enabled') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.enabledFlag, enableFlagOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mc-rba.low-risk') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.policyLowRisk, policyLowRiskOptionSave) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mc-rba.not-low-risk') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.policyNotLowRisk, policyNotLowRiskOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mc-rba.score.ind') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.mcRbaScoreInd) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mc-rba.score.ind.2') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.mcRbaScoreInd2) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.mc-rba.score.rbaEvaluation') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.rbaEvaluation, rbaEvaluationOption) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="border border-light-subtle">
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
                          <th style="width: 15%; text-align: center">
                            {{ $t('ui.mc-rba.reason-code') }}
                            <!-- Reason Code -->
                          </th>
                          <th>
                            {{ $t('ui.mc-rba.description') }}
                            <!-- Description -->
                          </th>
                          <th style="width: 15%">
                            {{ $t('ui.operation') }}
                            <!-- Execution options -->
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(reasonCodeConfig, index) in dataBefore.mcRbaReasonCodeConfigs" :key="index">
                          <td>
                            {{ $t(`ui.mc-rba.enabled.${reasonCodeConfig.enabledFlag}`) }}
                          </td>
                          <td style="text-align: center">
                            {{ reasonCodeConfig.reasonCode }}
                          </td>
                          <td>
                            {{ $t(`ui.mc-rba.reason-code-${reasonCodeConfig.reasonCode}`) }}
                          </td>
                          <td style="white-space: nowrap">
                            <span v-if="reasonCodeConfig.policy">
                              {{ $t(`ui.mc-rba.policy.${reasonCodeConfig.policy}`) }}
                            </span>
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
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { enableFlagOptionSelect } from '@/utils/select/visarba'
import { policyLowRiskOptionSave, policyNotLowRiskOptionSelect, rbaEvaluationOption } from '@/utils/select/mcrba'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
