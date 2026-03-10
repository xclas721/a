import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from '../../router'
import { createApp, nextTick } from 'vue'
import i18n from '../../locales'
import setupPlugins from '@/plugins'
import App from '../../App.vue'
import CardBinView from '../../views/common/system/card_bin/CardBinView.vue'
import { login } from '../../utils/authUserUtils'
import QueryCriteriaComponent from '../query/QueryCriteriaComponent.vue'
import DataTable from '../dataTable/DataTable.vue'
import FormComponent from '../formTable/FormComponent.vue'
import FormInput from '../formTable/FormInput.vue'
import FormFile from '../formTable/FormImgFile.vue'
import FormButton from '../formTable/FormButton.vue'
import { afterEach } from '@vitest/runner'
import QueryButton from '../query/QueryButton.vue'
import { findByCodeType } from '../../hooks/sysCode'

describe('test Card Bin', () => {
  // Create a function to create new router instance
  function createTestRouter() {
    return createRouter({
      history: createWebHistory(),
      routes: constantRoutes
    })
  }

  let wrapper: VueWrapper<any>
  // 在每个测试之前执行的准备工作
  beforeEach(async () => {
    window.scrollTo = vi.fn(() => {}) as unknown as typeof window.scrollTo
    const router = createTestRouter()
    const app = createApp(App)
    app.use(setupPlugins)

    //先登录，才能调用API
    const loginForm = {
      account: 'admin',
      password: '123456',
      inputCaptchaCode: 'PUIS',
      captchaToken: '24e93cce1fb746b18bc475243f6fa16c',
      organ: 'issuer',
      issuerOid: ''
    }
    await login(loginForm, 'issuer')
    // Use mount to create a component with routing
    wrapper = mount(CardBinView, {
      global: {
        components: { QueryCriteriaComponent, DataTable, FormComponent },
        plugins: [router, i18n]
      }
    })
    //跳转到card_bin
    // await router.push('/acs-admin/system/card_bin')
    // await router.isReady()
  })

  afterEach(async () => {
    // Immediately execute unfinished Promise
    await flushPromises()
  })
  it('CardBinView component create', async () => {
    // 断言 是否包含‘Card BIN’
    expect(wrapper.text()).toContain('BIN')
  })

  it('should render the QueryCriteriaComponent and DataTable components', () => {
    //判断是否存在组件
    expect(wrapper.findComponent(QueryCriteriaComponent).exists()).toBe(true)
    expect(wrapper.findComponent(QueryCriteriaComponent).vm.$props.title).toContain('BIN')
    expect(wrapper.findComponent(DataTable).exists()).toBe(true)
    expect(wrapper.findComponent(FormComponent).exists()).toBe(true)
  })

  it('should call handleSearch with correct parameters when search is emitted', async () => {
    const searchParams = {
      cardScheme: '',
      cardType: '',
      criteriaCardBin: '6228010000000000',
      decAuthInd: '',
      merWhiteListInd: ''
    }
    // 触发 search 事件
    wrapper.findComponent(QueryCriteriaComponent).vm.$emit('search', searchParams)
    // 验证 searchCriteria 是否被正确更新
    expect(wrapper.vm.searchCriteria).toMatchObject(searchParams)
    // Immediately execute unfinished Promise
    await flushPromises()

    //table 有5列
    expect(wrapper.findComponent(DataTable).vm.$props.columns).toHaveLength(5)

    //有没有执行选项
    expect(wrapper.findComponent(DataTable).find('#operationBtn').exists()).toBe(false)
  })

  it('should click add with correct parameters', async () => {
    await wrapper
      .findComponent(QueryCriteriaComponent)
      .findAllComponents(QueryButton)[2]
      .find('button')
      .trigger('click')

    // Title is ADD
    expect(wrapper.vm.formTitle).eq('ADD')

    // Check if 8 FormInput.vue components exist
    expect(wrapper.findAllComponents(FormInput)).toHaveLength(8)
    expect(wrapper.findAllComponents(FormFile)).toHaveLength(1)
  })

  it('should call add with correct parameters', async () => {
    await wrapper
      .findComponent(QueryCriteriaComponent)
      .findAllComponents(QueryButton)[2]
      .find('button')
      .trigger('click')

    // Title is ADD
    expect(wrapper.vm.formTitle).eq('ADD')

    // Check if 8 FormInput.vue components exist
    expect(wrapper.findAllComponents(FormInput)).toHaveLength(8)
    expect(wrapper.findAllComponents(FormFile)).toHaveLength(1)

    //表单赋值
    const cardScheme = 'V'
    const cardType = 'C'
    const binBegin = '6228010000000000'
    const binEnd = '6228010000000999'
    const decAuthInd = '0'
    const merWhiteListInd = '0'
    const cupSupportInd = '1'

    wrapper.vm.formConfig.forEach((field: Record<string, any>) => {
      if (field.model === 'spcIconImg') {
        field.required = false
      }
    })
    wrapper.vm.schemeOptions = await findByCodeType('CARD_SCHEME')
    await wrapper.findAllComponents(FormInput)[1].find('select').setValue(cardScheme)
    await wrapper.findAllComponents(FormInput)[2].find('select').setValue(cardType)
    await wrapper.findAllComponents(FormInput)[3].find('input').setValue(binBegin)
    await wrapper.findAllComponents(FormInput)[4].find('input').setValue(binEnd)
    await wrapper.findAllComponents(FormInput)[5].find('select').setValue(decAuthInd)
    await wrapper.findAllComponents(FormInput)[6].find('select').setValue(merWhiteListInd)
    await wrapper.findAllComponents(FormInput)[7].find('select').setValue(cupSupportInd)

    // Find submit button
    await wrapper.findComponent(FormComponent).findAllComponents(FormButton)[1].find('button').trigger('click')

    await nextTick()
    expect(wrapper.findComponent(FormComponent).emitted('submit')).toStrictEqual([
      [
        {
          binBegin,
          binEnd,
          cardScheme,
          cardType,
          cupSupportInd,
          decAuthInd,
          issuerOid: '22df320b-5cf2-d898-128a-846f75e56d07',
          merWhiteListInd,
          spcIconImg: null
        }
      ]
    ])
  })

  it('should call openDetail with correct parameters when open-detail is emitted', async () => {
    expect(wrapper.vm.formDetails).toMatchObject({})
    const detailParams = { oid: 'a509b2c1-7936-24ee-0c46-a40b1b82f34e' }

    wrapper.findComponent(DataTable).vm.$emit('openDetail', detailParams)

    expect(wrapper.vm.formTitle).eq('DETAIL')
    // Immediately execute unfinished Promise
    await flushPromises()

    // Does result contain query OID
    expect(JSON.stringify(wrapper.vm.formDetails)).toMatch('a509b2c1-7936-24ee-0c46-a40b1b82f34e')

    // Check if 8 FormInput.vue components exist
    expect(wrapper.findAllComponents(FormInput)).toHaveLength(8)
    expect(wrapper.findAllComponents(FormFile)).toHaveLength(1)
  })

  it('should call openUpdate with correct parameters when open-update is emitted', async () => {
    const detailParams = { oid: 'a509b2c1-7936-24ee-0c46-a40b1b82f34e' }

    wrapper.findComponent(DataTable).vm.$emit('openUpdate', detailParams)

    expect(wrapper.vm.formTitle).eq('UPDATE')
    // Immediately execute unfinished Promise
    await flushPromises()

    // Does result contain query OID
    expect(JSON.stringify(wrapper.vm.formDetails)).toMatch('a509b2c1-7936-24ee-0c46-a40b1b82f34e')

    // Check if 8 FormInput.vue components exist
    expect(wrapper.findAllComponents(FormInput)).toHaveLength(8)
    expect(wrapper.findAllComponents(FormFile)).toHaveLength(1)

    wrapper.vm.formConfig.forEach((field: Record<string, any>) => {
      if (field.model === 'spcIconImg') {
        field.required = false
      }
    })
    expect(wrapper.vm.formDetails).toMatchObject(wrapper.findComponent(FormComponent).vm.formData)

    expect(wrapper.findComponent(FormComponent).vm.formData.merWhiteListInd).toBe('1')

    await wrapper.findAllComponents(FormInput)[5].find('select').setValue('0')

    // Find submit button
    await wrapper.findComponent(FormComponent).findAllComponents(FormButton)[1].find('button').trigger('click')

    await nextTick()
    console.log(wrapper.findComponent(FormComponent).emitted('submit'))
    expect(JSON.stringify(wrapper.findComponent(FormComponent).emitted('submit'))).toContain('"merWhiteListInd":"1"')
  })

  it('should call deleteRow with correct parameters when delete-row is emitted', async () => {
    const detailParams = { oid: 'a509b2c1-7936-24ee-0c46-a40b1b82f34e' }
    wrapper.findComponent(DataTable).vm.$emit('deleteRow', detailParams)

    expect(wrapper.findComponent(DataTable).emitted('deleteRow')).toStrictEqual([
      [
        {
          oid: 'a509b2c1-7936-24ee-0c46-a40b1b82f34e'
        }
      ]
    ])
  })
})
