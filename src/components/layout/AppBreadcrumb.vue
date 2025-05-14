<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import {
  type RouteRecord,
  type RouteRecordNormalized,
  type RouteRecordRaw,
  useRoute
} from 'vue-router'
import { ref, unref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElMenu, ElMenuItem, ClickOutside as vClickOutside } from 'element-plus'
import { joinPath } from '@/utils/path.ts'
import { useMenuItemsStore } from '@/stores/menu.ts'
import type { Menu } from '@/types'
import { storeToRefs } from 'pinia'

const route = useRoute()

const INDEX_PATH = '/admin/index'

const state = useMenuItemsStore()
const { menuItems } = storeToRefs(state)

const parentMenuItem = computed(() => {
  // if (route.matched.length < 3) return null
  // return route.matched[1]
  /**
   * 在子菜单中搜索 - 定制函数 - 无通用功能
   * @param routes
   */
  const searchSubMenuItem = (routes: Menu[]) : (Menu | undefined) => {
    return routes.find(r => r.route == route.fullPath || searchSubMenuItem(r.children || []))
  }
  const currentRouteRecord = unref(menuItems).find(r => searchSubMenuItem(r.children || []))
  if (! currentRouteRecord) return null
  return currentRouteRecord
})

const visible = ref<boolean>(false)
const popoverRef = ref()

const onClickOutside = () => {
  visible.value = false
}

const activeIndex = computed(() => {
  return route.fullPath || '/admin/index'
})

</script>

<template>
  <div>
    <el-breadcrumb :separator-icon="ArrowRight" class="font-size-16px! px-14px">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item to="/admin/index" :key="INDEX_PATH">首页</el-breadcrumb-item>
        <el-breadcrumb-item
          v-if="parentMenuItem"
          :key="parentMenuItem.route"
          v-popover="popoverRef"
          v-click-outside="onClickOutside"
          :to="{}"
        >
          {{ parentMenuItem.title }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.fullPath !== INDEX_PATH" :key="route.fullPath">
          {{ route.meta.title }}
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>

    <el-popover
      v-if="parentMenuItem && parentMenuItem?.children"
      v-model:visible="visible"
      ref="popoverRef"
      trigger="click"
      placement="right"
      :show-arrow="false"
      virtual-triggering
      popper-class="px-0! py-5px! overflow-hidden top-50px! transform-translate-x--36px min-w-200px!"
    >
      <el-menu router class="b-width-0!" :default-active="activeIndex">
        <el-menu-item
          v-for="subMenuItem in parentMenuItem.children"
          :key="subMenuItem.name"
          :index="subMenuItem.route"
          @click="visible = false"
        >
          <el-icon v-if="subMenuItem.icon" size="18px">
            <Icon :icon="subMenuItem.icon as string" />
          </el-icon>
          <template #title>
            <span>{{ subMenuItem.title }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-popover>
  </div>
</template>

<style scoped>
.el-breadcrumb__item:deep(.el-breadcrumb__separator),
.el-breadcrumb__item:deep(.el-breadcrumb__separator) {
  transition: opacity 0.5s;
}

.el-breadcrumb__item.breadcrumb-enter-active:deep(.el-breadcrumb__separator),
.el-breadcrumb__item.breadcrumb-leave-active:deep(.el-breadcrumb__separator) {
  opacity: 0;
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter-active {
  opacity: 0;
  transform: translateX(30px);
}

.breadcrumb-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
