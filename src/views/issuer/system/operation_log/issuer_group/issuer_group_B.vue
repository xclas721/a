<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-group.id') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.groupId) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-group.name') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.groupName) }}
          </span>
        </p>
        <hr />
      </div>

      <div class="col-md-12">
        <span class="form-label d-block">{{ $t('ui.issuer-group.description') }}</span>
        <p>
          <span>
            {{ valOrNA(dataBefore.description) }}
          </span>
        </p>
        <hr />
      </div>

      <div v-for="(value, key) in dataBefore.permissionMap" :key="key" class="col-md-12 mt-3">
        <!-- Title area -->
        <div class="header-title">
          {{ $t(key.toString()) }}
        </div>

        <!-- Submenu -->
        <div class="menu-content p-3">
          <div class="row">
            <div v-for="(child, index) in value" :key="index" class="col-3 menu-item">
              <span>
                {{ $t(child) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { valOrNA } from '@/utils/util'
import type { BaseSelect } from '@/utils/select/baseSelect'

defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
</script>
