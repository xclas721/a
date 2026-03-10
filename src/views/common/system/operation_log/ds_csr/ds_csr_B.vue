<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
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
        <span class="form-label d-block">{{ $t('ui.certificate-quest.key-alias') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.keyAlias) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.key-length') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.keyLength, keyLengthOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.sign_algorithm') }}</span>
        <p>
          <span>
            {{ getOptionsByValue(dataBefore.signAlgorithm, signAlgorithmOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.common-name') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.commonName) }}
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
        <span class="form-label d-block">{{ $t('ui.certificate-quest.organization') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.organization) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.organization_unit') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.organizationUnit) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.country') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.country) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.province') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.province) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.locality') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.locality) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.file-name') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.fileName) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import { type BaseSelect, defaultOptionSelect } from '@/utils/select/baseSelect'
import { keyLengthOptionSelect, signAlgorithmOptionSelect } from '../../../../../utils/select/signCsr'
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
