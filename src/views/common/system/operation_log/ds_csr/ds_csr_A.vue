<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer.name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.issuerOid, dataBefore.issuerOid) }">
            {{ getOptionsByValue(dataAfter.issuerOid, issuer) }}
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
        <span class="form-label d-block">{{ $t('ui.certificate-quest.key-alias') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.keyAlias, dataBefore.keyAlias) }">
            {{ valOrNA(dataAfter.keyAlias) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.key-length') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.keyLength, dataBefore.keyLength)
            }"
          >
            {{ getOptionsByValue(dataAfter.keyLength, keyLengthOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.sign_algorithm') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.signAlgorithm, dataBefore.signAlgorithm)
            }"
          >
            {{ getOptionsByValue(dataAfter.signAlgorithm, signAlgorithmOptionSelect) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.common-name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.commonName, dataBefore.commonName) }">
            {{ valOrNA(dataAfter.commonName) }}
          </span>
        </p>
        <hr />
      </div>

      <template v-if="dataAfter.cardScheme === 'A'">
        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.certificate-quest.subject-alt-name1') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.subjectAltName1, dataBefore.subjectAltName1)
              }"
            >
              {{ valOrNA(dataAfter.subjectAltName1) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.certificate-quest.subject-alt-name2') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.subjectAltName2, dataBefore.subjectAltName2)
              }"
            >
              {{ valOrNA(dataAfter.subjectAltName2) }}
            </span>
          </p>
          <hr />
        </div>

        <div class="col-md-12">
          <span class="form-label d-block">{{ $t('ui.certificate-quest.subject-alt-name3') }}</span>
          <p>
            <span
              :class="{
                'text-danger': isDifferent(dataAfter.subjectAltName3, dataBefore.subjectAltName3)
              }"
            >
              {{ valOrNA(dataAfter.subjectAltName3) }}
            </span>
          </p>
          <hr />
        </div>
      </template>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.organization') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.organization, dataBefore.organization) }">
            {{ valOrNA(dataAfter.organization) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.organization_unit') }}</span>
        <p>
          <span
            :class="{
              'text-danger': isDifferent(dataAfter.organizationUnit, dataBefore.organizationUnit)
            }"
          >
            {{ valOrNA(dataAfter.organizationUnit) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.country') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.country, dataBefore.country) }">
            {{ valOrNA(dataAfter.country) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.province') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.province, dataBefore.province) }">
            {{ valOrNA(dataAfter.province) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.locality') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.locality, dataBefore.locality) }">
            {{ valOrNA(dataAfter.locality) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.certificate-quest.file-name') }}</span>
        <p>
          <span :class="{ 'text-danger': isDifferent(dataAfter.fileName, dataBefore.fileName) }">
            {{ valOrNA(dataAfter.fileName) }}
          </span>
        </p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, isDifferent, valOrNA } from '@/utils/util'
import { type BaseSelect, defaultOptionSelect } from '@/utils/select/baseSelect'
import { keyLengthOptionSelect, signAlgorithmOptionSelect } from '@/utils/select/signCsr'
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
