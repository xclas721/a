<template>
  <div class="p-3">
    <div class="rounded m-0 t-16 row">
      <h3>{{ $t('ui.issuer-reconfirm') }}</h3>
      <hr />

      <div v-if="formData.functions.length">
        <div v-for="(menuList, index) in formData.functions" :key="index">
          <table class="table table-hover">
            <thead>
              <tr>
                <th style="width: 90%">
                  <div class="ft-15 font-weight-bold">
                    <b v-if="formData.modules[index]?.i18nCode">
                      {{ $t(formData.modules[index].i18nCode) }}
                    </b>
                  </div>
                </th>
                <th>
                  <div class="ft-15 font-weight-bold"></div>
                </th>
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
                      :disabled="title === 'DETAIL'"
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

  <div class="row offset-md-4 mb-5" v-if="title !== 'DETAIL'">
    <FormButton label="btn.save" type="submit" variant="primary" @click="submit" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FormButton from '@/components/formTable/FormButton.vue'
import swalMessage from '@/plugins/swalMessage'
import ApiUtil from '@/utils/apiUtils'
defineProps<{
  title: string
}>()
// Type definition
interface Module {
  i18nCode: string
}

interface Menu {
  i18nCode: string
  accessId: string
}

interface FormData {
  functions: Menu[][]
  modules: Module[]
  accessIds: string[]
}

const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const { t } = useI18n()

const formData = ref<FormData>({
  functions: [],
  modules: [],
  accessIds: []
})

const formDateSubmit = reactive({
  accessIds: [] as string[]
})

const submit = async () => {
  const result = await apiUtil.post('/issuer_reconfirm/edit', { accessIds: formDateSubmit.accessIds }, {}, true)
  if (result.success && result.code === '0000') {
    await swalMessage.success(t('ui.message.add.success'))
  } else {
    await swalMessage.error(result.message)
  }
}

// Initialize触发函数
onMounted(async () => {
  const result = await apiUtil.get('/issuer_reconfirm/detail', {}, {}, true)
  if (result.success && result.code === '0000') {
    formData.value = result.data
    formDateSubmit.accessIds = result.data.accessIds
  } else {
    await swalMessage.error(result.message)
  }
})
</script>
