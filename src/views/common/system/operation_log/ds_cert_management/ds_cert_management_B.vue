<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div v-if="detailData.action === 'E' || detailData.action === 'O'">
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
          <p>
            <span>
              {{ getOptionsByValue(dataBefore.issuerOid, issuer) }}
            </span>
          </p>
          <hr />
        </div>
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme.name') }}</span>
          <p>
            <span>
              {{ getOptionsByValue(dataBefore.cardScheme, schemeOptions) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.kek.key-alias') }}</span>
          <p>
            <span>
              {{ valOrNA(dataBefore.keyAlias) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.certificate-quest.common-name') }}</span>
          <p>
            <span>
              {{ valOrNA(dataBefore.subjectCn) }}
            </span>
          </p>
          <hr />
        </div>

        <template v-if="dataAfter.cardScheme === 'A'">
          <div class="col-md-12">
            <span class="form-label d-block">{{ $t('ui.certificate-quest.subject-alt-name1') }}</span>
            <p>
              <span>
                {{ valOrNA(dataBefore.subjectAltName1) }}
              </span>
            </p>
            <hr />
          </div>

          <div class="col-md-12">
            <span class="form-label d-block">{{ $t('ui.certificate-quest.subject-alt-name2') }}</span>
            <p>
              <span>
                {{ valOrNA(dataBefore.subjectAltName2) }}
              </span>
            </p>
            <hr />
          </div>

          <div class="col-md-12">
            <span class="form-label d-block">{{ $t('ui.certificate-quest.subject-alt-name3') }}</span>
            <p>
              <span>
                {{ valOrNA(dataBefore.subjectAltName3) }}
              </span>
            </p>
            <hr />
          </div>
        </template>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.certificate-quest.common-name') }}</span>
          <p>
            <span>
              {{ valOrNA(dataBefore.certIssuerCn) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-cert.validity-period') }}</span>
          <p>
            <span>
              {{ valOrNA(dataBefore.validPeriod) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-cert.credential-status') }}</span>
          <p>
            <span>
              {{ getOptionsByValue(dataBefore.status, enableORDisableOptions) }}
            </span>
          </p>
          <hr />
        </div>
      </div>

      <div v-if="detailData.action == 'A'">
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
          <p>
            <span>
              {{ getOptionsByValue(dataBefore.issuerOid, issuer) }}
            </span>
          </p>
          <hr />
        </div>
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.card-scheme.name') }}</span>
          <p>
            <span>
              {{ getOptionsByValue(dataBefore.cardScheme, schemeOptions) }}
            </span>
          </p>
          <hr />
        </div>
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.kek.key-alias') }}</span>
          <p>
            <span>
              {{ valOrNA(dataBefore.keyAlias) }}
            </span>
          </p>
          <hr />
        </div>
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.issuer-cert.Signature-certificate-format') }}</span>
          <p>
            <span>
              {{ getOptionsByValue(dataBefore.certEncode, certEncodeOptionSelect) }}
            </span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import { type BaseSelect, defaultOptionSelect } from '@/utils/select/baseSelect'
import { certEncodeOptionSelect } from '@/utils/select/caCertLoad'
import { enableORDisableOptions } from '@/utils/select/cardBin'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  detailData: Record<string, any>
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
onMounted(() => {
  issuer.value = [...defaultOptionSelect, ...(props.issuerOptions ?? [])]
})
const issuer = ref([...defaultOptionSelect, ...(props.issuerOptions ?? [])])
</script>
