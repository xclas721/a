<template>
  <div class="row">
    <!-- After change -->
    <div class="col-md-12">
      <div class="col-md-12">
        <div v-if="dataBefore.menuConfigModelMap.functions.length">
          <div v-for="(menuList, index) in dataBefore.menuConfigModelMap.functions" :key="index">
            <table class="table table-hover">
              <thead>
                <tr>
                  <td style="width: 90%">
                    <div class="ft-15 font-weight-bold">
                      <b v-if="dataBefore.menuConfigModelMap.modules[index]?.i18nCode">
                        {{ $t(dataBefore.menuConfigModelMap.modules[index].i18nCode) }}
                      </b>
                    </div>
                  </td>
                  <td>
                    <div class="ft-15 font-weight-bold"></div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="menu in menuList" :key="menu.accessId">
                  <td class="ft-15" style="vertical-align: middle">
                    <div>
                      <span v-if="menu.i18nCode">{{ $t(menu.i18nCode) }}</span>
                    </div>
                  </td>
                  <!-- Query Permission -->
                  <td>
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        :value="menu.accessId"
                        v-model="formDateSubmit.accessIds"
                        disabled
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { BaseSelect } from '@/utils/select/baseSelect'
import { reactive } from 'vue'

const props = defineProps<{
  dataAfter: Record<string, any>
  dataBefore: Record<string, any>
  schemeOptions?: BaseSelect[]
  issuerOptions?: BaseSelect[]
}>()
const formDateSubmit = reactive({
  accessIds: props.dataBefore.menuConfigModelMap.accessIds ?? [] // Initialize选中
})
</script>
