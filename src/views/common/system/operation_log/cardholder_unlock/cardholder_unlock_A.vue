<template>
  <div class="row" v-if="detailData.targetObject == 'T_S_CARD_HOLDER'">
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
        <span class="form-label d-block">{{ $t('ui.cardholder-data.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.cnName, dataBefore.cnName) }">
            {{ valOrNA(dataAfter.cnName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cardholder-data.idno') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.idno, dataBefore.idno) }">
            {{ valOrNA(dataAfter.idno) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-data.threeds-status') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.threedsStatus, dataBefore.threedsStatus)
            }"
          >
            {{ getOptionsByValue(dataAfter.threedsStatus, threedsStatusOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>

  <div class="row" v-if="detailData.targetObject == 'T_S_CARD_DATA'">
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
        <span class="form-label d-block">{{ $t('ui.card-scheme.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.cardScheme, dataBefore.cardScheme) }">
            {{ getOptionsByValue(dataAfter.cardScheme, schemeOptions) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cardholder-data.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.cnName, dataBefore.cnName) }">
            {{ valOrNA(dataAfter.cnName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.cardholder-data.idno') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.idno, dataBefore.idno) }">
            {{ valOrNA(dataAfter.idno) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-data.pan') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.acctNumberPrefix, dataBefore.acctNumberPrefix)
            }"
          >
            {{ valOrNA(dataAfter.acctNumberPrefix + 'XXXXXX' + dataAfter.acctNumberPostfix) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-data.enroll-status') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.enrollStatus, dataBefore.enrollStatus) }">
            {{ getOptionsByValue(dataAfter.enrollStatus, enrollStatusOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-data.threeds-status') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.threedsStatus, dataBefore.threedsStatus)
            }"
          >
            {{ getOptionsByValue(dataAfter.threedsStatus, threedsStatusOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.card-data.status') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.status, dataBefore.status) }">
            {{ getOptionsByValue(dataAfter.status, cardStatusOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { cardStatusOptionSelect, enrollStatusOptionSelect, threedsStatusOptionSelect } from '@/utils/select/cardholder'

defineProps<{
  detailData: Record<string, any>
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
