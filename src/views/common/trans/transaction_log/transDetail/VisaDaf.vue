<template>
  <div class="header-title">DAF {{ $t('ui.trans.log.basic.message') }}</div>
  <div class="content-box p-3">
    <div class="row">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-4">
            <span class="form-label d-block text-primary fw-bold">{{ $t('ui.trans.log.daf.vmid') }}</span>
            <span class="span-control">{{ valOrNA(data.threeDSRequestorId) }}</span>
          </div>

          <div class="col-md-4">
            <span class="form-label d-block text-primary fw-bold">{{ $t('ui.trans.log.daf.chAccReqID') }}</span>
            <span class="span-control">{{ valOrNA(data.chAccReqId) }}</span>
          </div>
          <div class="col-md-4">
            <span class="form-label d-block text-primary fw-bold">{{
              $t('ui.trans.log.basic.cardholderAccountNumber')
            }}</span>
            <span class="span-control">{{ valOrNA(data.acctNumber) }}</span>
          </div>
          <hr />
        </div>

        <div class="row mt-2">
          <div class="col-md-4">
            <span class="form-label d-block text-primary fw-bold">{{ $t('ui.trans.log.daf.authPayCredStatus') }}</span>
            <span class="span-control">{{
              data.authPayCredStatus ? $t('ui.trans.log.daf.authPayCredStatus.' + data.authPayCredStatus) : 'N/A'
            }}</span>
          </div>

          <div class="col-md-4">
            <span class="form-label d-block">{{ $t('ui.trans.log.daf.authPayProcessReqInd') }}</span>
            <span class="span-control">{{
              data.authPayProcessReqInd
                ? $t('ui.trans.log.daf.authPayProcessReqInd.' + data.authPayProcessReqInd)
                : 'N/A'
            }}</span>
          </div>
          <div class="col-md-4">
            <span class="form-label d-block text-primary fw-bold">{{ $t('ui.trans.log.daf.dafAdvice') }}</span>
            <span class="span-control">{{
              data.dafAdvice ? $t('ui.trans.log.daf.dafAdvice.' + data.dafAdvice) : 'N/A'
            }}</span>
          </div>
          <hr />
        </div>

        <div class="row mt-2">
          <div class="col-md-4">
            <span class="form-label d-block">{{ $t('ui.trans.log.basic.transactionStatus') }}</span>
            <span class="span-control">{{ getOptionsByValue(data.transStatus, transStatusI18nOptions) }}</span>
          </div>

          <div class="col-md-4">
            <span class="form-label d-block">{{ $t('ui.trans.log.details.transStatusReason') }}</span>
            <span class="span-control">{{
              getOptionsByValue(data.transStatusReason, transStatusReasonOptionSelect)
            }}</span>
          </div>
          <div class="col-md-4">
            <span class="form-label d-block">{{ $t('ui.trans.log.details.eci') }}</span>
            <span class="span-control">{{ valOrNA(data.eci) }}</span>
          </div>
          <hr />
        </div>

        <div class="row mt-2">
          <div class="col-md-4">
            <span class="form-label d-block">{{ $t('ui.trans.log.basic.3DSServerTransactionID') }}</span>
            <span class="span-control">{{ valOrNA(data.threeDSServerTransId) }}</span>
          </div>

          <div class="col-md-4">
            <span class="form-label d-block">{{ $t('ui.trans.log.basic.DSTransactionID') }}</span>
            <span class="span-control">{{ valOrNA(data.dsTransId) }}</span>
          </div>
          <div class="col-md-4">
            <span class="form-label d-block">{{ $t('ui.trans.log.basic.ACSTransactionID') }}</span>
            <span class="span-control">{{ valOrNA(data.acsTransId) }}</span>
          </div>
          <hr />
        </div>
      </div>
    </div>
  </div>

  <div class="header-title mt-3">RBA Score {{ $t('ui.trans.log.basic.message') }}</div>
  <div class="content-box p-3">
    <div class="row">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-4">
            <span class="form-label d-block">{{ $t('ui.trans.log.visa-rba.score') }}</span>
            <span class="span-control">{{ valOrNA(data.score) }}</span>
          </div>

          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import { transStatusI18nOptions, transStatusReasonOptionSelect } from '@/utils/select/transStatus'

defineProps<{
  data: Record<string, any>
}>()
</script>
