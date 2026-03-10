<template>
  <div :class="isCollapsed" class="sidebar-wrapper">
    <div class="sidebar-header border-bottom" :class="{ 'sidebar-header--custom-logo': hasCustomLogo }">
      <div class="sidebar-brand">
        <a href="/"
          ><img
            class="sidebar-brand-full"
            :class="{ 'sidebar-brand-custom': hasCustomLogo }"
            :src="imgSrc"
            alt="Logo"
          />
        </a>
      </div>
    </div>
    <simplebar class="sidebar-nav" id="side-menu">
      <li :class="menuCollapseIcon(item.isCollapsed)" v-for="item in menuTree" :key="item.oid">
        <a class="nav-link nav-group-toggle" @click="toggleCollapse(item)">
          <template v-if="item.i18nCode == 'ui.menu.sys'">
            <i class="icon cil-settings me-2"></i>{{ $t(item.i18nCode) }}
          </template>
          <template v-else-if="item.i18nCode == 'ui.menu.trans'">
            <i class="icon cil-credit-card me-2"></i>{{ $t(item.i18nCode) }}
          </template>
          <template v-else-if="item.i18nCode == 'ui.menu.privilege'">
            <i class="icon cil-user me-2"></i>{{ $t(item.i18nCode) }}
          </template>
          <template v-else-if="item.i18nCode == 'ui.menu.risk'">
            <i class="icon cil-bell me-2"></i>{{ $t(item.i18nCode) }}
          </template>
          <template v-else-if="item.i18nCode == 'ui.cardholder-data'">
            <i class="icon cil-people me-2"></i>{{ $t(item.i18nCode) }}
          </template>
          <template v-else-if="item.i18nCode == 'ui.menu.certificate'">
            <i class="icon cil-file me-2"></i>{{ $t(item.i18nCode) }}
          </template>
          <template v-else-if="item.i18nCode == 'ui.menu.key'">
            <i class="icon ri-key-2-line me-2 mb-1"></i>{{ $t(item.i18nCode) }}
          </template>
          <template v-else-if="item.i18nCode == 'ui.menu.visa.ext'">
            <i class="icon ri-visa-fill me-2 mb-2"></i>{{ $t(item.i18nCode) }}
          </template>
          <template v-else-if="item.i18nCode == 'ui.menu.insightedge_sys'">
            <i class="icon ri-settings-3-line me-2 mb-2"></i>{{ $t(item.i18nCode) }}
          </template>
          <template v-else-if="item.i18nCode == 'ui.menu.insightedge'">
            <i class="icon ri-donut-chart-fill me-2 mb-2"></i>{{ $t(item.i18nCode) }}
          </template>
          <template v-else> <i class="icon cil-tag me-2"></i>{{ $t(item.i18nCode) }} </template>
        </a>

        <transition name="slide">
          <div v-if="!item.isCollapsed && item.children?.length">
            <!-- 修复：将 router-link 移到 li 内部 -->
            <li v-for="child in item.children" :key="child.oid" class="nav-item">
              <router-link :to="getComputedRoute(child.accessId, item)" class="text-decoration-none">
                <!-- 关键修复：使用 Flex 布局 -->
                <a class="nav-link d-flex justify-content-between align-items-center" @click="getCount(child.accessId)">
                  <span class="d-flex align-items-center w-100">
                    <span class="nav-icon">
                      <span class="nav-icon-bullet"></span>
                    </span>
                    {{ $t(child.i18nCode) }}
                  </span>
                  <span v-if="child.accessId == 'reconfirm' && count > 0" class="nav-reconfirm-count">{{ count }}</span>
                </a>
              </router-link>
            </li>
          </div>
        </transition>
      </li>
    </simplebar>
    <div class="sidebar-footer">
      <router-link to="/account-security" class="nav-link sidebar-footer-link">
        <i class="icon cil-shield-alt me-2"></i>{{ $t('ui.main.menu.account-security') }}
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import simplebar from 'simplebar-vue'
import { userStateStore, type AdminMenu } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore, useAppStoreHook } from '@/stores/app'
import ApiUtil from '@/utils/apiUtils'
import HiLogoLight from '@/assets/img/HiTRUST_light.png'
import HiLogoDark from '@/assets/img/HiTRUST_dark.png'
const appStoreHook = useAppStoreHook()
const sidebarStore = useAppStore()
// Store and userState initialization
const userState = userStateStore()
const apiUtil = new ApiUtil({ showModel: (params: any) => console.log(params) })
const count = ref(0)
const menuTree = ref(userState.user.menu || [])
const { theme } = storeToRefs(appStoreHook)
// issuer 自訂 logo URL（有值時優先使用）；否則依 theme：light 用 HiTRUST_Logo_svg.svg，dark 用 HiTRUST_Logo_bg_svg.svg
const customLogoUrl = ref<string | null>(null)
const hasCustomLogo = ref(false)
const imgSrc = computed(() => {
  if (customLogoUrl.value) return customLogoUrl.value
  return theme.value === 'dark' ? HiLogoDark : HiLogoLight
})
// 掛載時，如果 issuer，則取得 issuer 的 logo，否則使用 default logo
onMounted(async () => {
  if (appStoreHook.organ === 'issuer') {
    const result = await apiUtil.get(`/issuer_param/image`, { issuerOid: userState.user.issuerOid, size: 1 }, {}, true)
    if (result.success && result.data) {
      customLogoUrl.value = 'data:image/png;base64,' + result.data
      hasCustomLogo.value = true
    } else {
      customLogoUrl.value = null
      hasCustomLogo.value = false
    }
  } else {
    customLogoUrl.value = null
    hasCustomLogo.value = false
  }
})

// 定义函数的返回类型，使用 AdminMenu[] 数组
const initializeMenuTree = (tree: AdminMenu[]): AdminMenu[] => {
  return tree.map((item) => ({
    ...item,
    isCollapsed: true, // 默认折叠
    children: item.children ? initializeMenuTree(item.children) : []
  }))
}
const isCollapsed = computed(() =>
  sidebarStore.isCollapsed
    ? 'sidebar d-print-none border-end sidebar-light sidebar-fixed hide'
    : 'sidebar d-print-none border-end sidebar-light sidebar-fixed show'
)

function menuCollapseIcon(item: boolean) {
  return item ? 'nav-group' : 'nav-group show'
}

// Toggle collapse function
const toggleCollapse = (item: AdminMenu) => {
  item.isCollapsed = !item.isCollapsed
}

// Dynamic route function to create paths based on accessId
const getComputedRoute = (accessId: string, parent: AdminMenu) => {
  getCount(accessId)
  return '/' + parent.accessId + '/' + accessId
}
const getCount = async (accessId: string) => {
  if (userState.user.userType == '1') {
    //只有点击展开和点击复核时查询复核条数
    if (accessId == 'reconfirm' || accessId == 'system') {
      const result = await apiUtil.get(`/reconfirm/countIssuerUserUnreconfirm`, null, {}, true)
      if (result.success && result.code == '0000') {
        count.value = result.data
      }
    }
  }
}
// Initialize menuTree with collapse state on component mount
menuTree.value = initializeMenuTree(menuTree.value)
</script>

<style scoped>
/* Logo 區：不參與縮放。dark/light 時外框 59px（與 Header 同高），圖片 57px */
.sidebar-header {
  flex-shrink: 0;
  min-height: 59px;
  max-height: 59px;
}

/* Issuer 自訂 LOGO 時，此區最高 88px */
.sidebar-header.sidebar-header--custom-logo {
  max-height: 88px;
}

/* Logo 置中 */
.sidebar-brand {
  width: 100%;
  min-height: 59px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar-nav .nav-link {
  white-space: normal;
}

/* 折叠动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}

/* 箭头动画 */
.arrow-icon {
  transition: transform 0.3s ease;
  font-size: 0.8rem;
}

.nav-group.show .arrow-icon {
  transform: rotate(90deg);
}

/* 菜单项动画 */
.nav-item {
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.nav-item:hover::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 2px;
  animation: line-grow 0.3s ease;
}

@keyframes line-grow {
  from {
    height: 0;
  }
  to {
    height: 100%;
  }
}

/* 层级缩进 */
.nav-group-items {
  padding-left: 1.5rem;
  transition: padding 0.3s ease;
}

/* Dark/Light：外框 59px、圖片最高 57px，維持比例 */
.sidebar-brand-full {
  max-height: 35px;
  height: auto;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  display: block;
}

/* Issuer 自訂 LOGO：圖片最高 73px，維持比例不拉伸；外層 .sidebar-header 最高 89px */
.sidebar-brand-custom {
  max-height: 73px;
  height: auto;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  display: block;
  background-color: white;
  border-radius: 4px;
}

.sidebar-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.sidebar-nav {
  flex: 1 1 auto;
  min-height: 0;
}

.sidebar-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--cui-border-color, #dee2e6);
  display: flex;
  align-items: stretch;
  width: 100%;
}

/* 待覆核數量：獨立小圓標，不依賴 .badge，數字置中 */
.nav-reconfirm-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.15rem;
  height: 1.15rem;
  padding: 0 0.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1;
  color: #fff;
  background: var(--sidebar-active-bar, #8c1c36);
  border-radius: 999px;
  flex-shrink: 0;
}
</style>
