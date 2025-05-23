<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { OIcon } from '@/components/common'
import { ElMenu } from 'element-plus'
import type { ApiResponse, Menu } from '@/types'
import { getMenus } from '@/api/menu.ts'
import { useMenuItemsStore } from '@/stores/menu.ts'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const props = defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
})

const activeIndex = computed(() => {
  return route.path || '/admin'
})

const state = useMenuItemsStore()
const { menuItems } = storeToRefs(state)


const appMenu = ref<typeof ElMenu>()

</script>

<template>
  <el-menu
    ref="appMenu"
    :collapse="collapse"
    :default-active="activeIndex"
    router
    class="app-menu b-width-0! h-100vh overflow-y-auto"
  >
    <el-menu-item
      index="/admin/index"
      class="sticky! top-0 z-1 logo-menu-item c-white! h-[calc(var(--el-menu-item-height)-1px)]!"
    >
      <el-icon>
        <img
          src="/src/assets/logo-transparent.svg"
          class="block w-1em h-1em transition-all scale-160"
          alt="OpenMusic 管理后台 LOGO"
        />
      </el-icon>
      <template #title>
        <span class="font-bold">OpenMusic 管理后台</span>
      </template>
    </el-menu-item>
    <el-divider style="--el-border-color: #1f2d3d" class="sticky! z-1" />
    <template v-for="item in menuItems" :key="item.route">
      <el-sub-menu
        v-if="item.children?.length"
        :index="item.route"
        v-show="! item.hidden"
      >
        <template #title>
          <el-icon size="18px" style="margin-right: var(--el-menu-base-level-padding);">
            <OIcon :icon="item.icon as string" />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="subItem in item.children"
          :key="subItem.route"
          :index="subItem.route"
          v-show="! subItem.hidden"
        >
          <el-icon size="18px">
            <OIcon :icon="subItem.icon as string" />
          </el-icon>
          <template #title>
            <span>{{ subItem.title }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item
        v-else
        :index="item.route"
      >
        <el-icon size="18px">
          <OIcon :icon="item.icon as string" />
        </el-icon>
        <template #title>
          <span>{{ item.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped>
:deep(.el-scrollbar__thumb) {
  position: relative;
  z-index: 1000000;
}

.app-menu {
  --el-menu-base-level-padding: 16px;
  --el-menu-item-height: 50px;
  --el-menu-bg-color: #304156;
  --el-menu-hover-bg-color: #263445;
  --el-menu-text-color: #bfcbd9;
  --el-menu-active-color: #409eff;
  --el-menu-icon-width: 18px;
}

.app-menu::-webkit-scrollbar {
  display: none;
}

.el-menu .el-menu-item.logo-menu-item {
  background: var(--el-menu-bg-color);
}
.el-menu .el-menu-item.logo-menu-item:hover {
  background: var(--el-menu-hover-bg-color);
}
.el-menu .el-menu-item.logo-menu-item + .el-divider {
  top: calc(var(--el-menu-item-height) - 1px);
}

.el-menu:not(.el-menu--collapse) {
  width: 210px;
}

.el-menu .el-sub-menu.is-active:deep(.el-sub-menu__title) {
  color: #f4f4f5 !important;
}

.el-menu .el-sub-menu:deep(.el-menu) {
  --el-menu-bg-color: #1f2d3d;
  --el-menu-hover-bg-color: #001528;
}

/*
@media (min-width: 768px) {
  .el-menu:not(.el-menu--collapse) {
    width: 210px;
  }
}

@media (max-width: 768px) {
  .el-menu:not(.el-menu--collapse) {
    width: 100vw;
  }
}
*/
</style>
