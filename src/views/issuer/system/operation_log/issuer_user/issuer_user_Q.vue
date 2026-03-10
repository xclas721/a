<template>
  <div class="col-md-12 mt-3">
    <div class="header-title-query">{{ $t('ui.search-criteria') }}</div>
    <div class="content-box-query p-3">
      <div class="row">
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.admin-user.group') }}</span>
          <p>
            <span>{{ getOptionsByValue(data.criteriaIssuerGroupOid, groupOptions) }}</span>
          </p>
          <hr />
        </div>
        <div class="col-md-4">
          <span class="form-label d-block">{{ $t('ui.admin-user.account') }}</span>
          <p>
            <span>{{ valOrNA(data.criteriaIssuerUserAccount) }}</span>
          </p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getOptionsByValue, valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'
import { onMounted, ref } from 'vue'
import { findAllPermissionGroup } from '@/hooks/permissionGroup'

const groupOptions = ref<BaseSelect[]>([])

onMounted(async () => {
  groupOptions.value = await findAllPermissionGroup()
})

defineProps<{
  data: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
