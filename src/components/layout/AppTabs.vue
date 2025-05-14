<script setup lang="ts">
import { computed, ref, unref, watch } from 'vue'
import { type RouteRecord, useRoute, useRouter } from 'vue-router'
import type { TabPaneName } from 'element-plus'
import { Icon } from '@iconify/vue'
import { useDynamicRoutesStore } from '@/stores/dynamic-routes.ts'

const route = useRoute()
const router = useRouter()

interface TabItem {
  icon: string
  title: string
  path: string
}

const pageTabsValue = ref('/admin')
const pageTabs = ref<TabItem[]>([
  {
    icon: 'mdi:home',
    title: '主页',
    path: '/admin/index'
  }
])

const validPaths = computed(() => [
  '/admin/index',
  ... unref(useDynamicRoutesStore().dynamicRoutes)
    .map((route: RouteRecord) => route.path)
])

// 路由变化监听
watch(
  () => route.fullPath,
  (newPath) => {
    if (! unref(validPaths).includes(newPath)) {
      pageTabsValue.value = '/empty'
      return
    }

    const existingTab = pageTabs.value.find((tab) => tab.path === newPath)

    if (existingTab) {
      pageTabsValue.value = existingTab.path
    } else {
      addNewTab({
        title: (route.meta.title as string) || route.name?.toString() || 'New Tab',
        path: route.path,
        icon: route.meta.icon as string
      })
    }
  },
  { immediate: true },
)

function addNewTab(tab: TabItem) {
  // 防止重复添加
  if (pageTabs.value.some((t) => t.path === tab.path)) return

  pageTabs.value.push(tab)
  pageTabsValue.value = tab.path
}

const removeTab = async (targetPath: TabPaneName) => {
  const tabs = pageTabs.value
  let activePath = pageTabsValue.value

  if (activePath === targetPath) {
    const currentIndex = tabs.findIndex((tab) => tab.path === targetPath)
    const newTab = tabs[currentIndex - 1] || tabs[currentIndex + 1]

    if (newTab) {
      activePath = newTab.path
      await router.push(newTab.path)
    } else {
      await router.push('/admin')
    }
  }

  pageTabsValue.value = activePath
  pageTabs.value = tabs.filter((tab) => tab.path !== targetPath)
}
</script>

<template>
  <el-tabs
    v-model="pageTabsValue"
    type="border-card"
    class="b-width-0!"
    closable
    @tab-change="(tab: string) => router.push(tab)"
    @tab-remove="removeTab"
    style="--el-tabs-header-height: 32px"
  >
    <el-tab-pane
      v-for="item in pageTabs"
      :key="item.path"
      :name="item.path"
    >
      <template #label>
        <span class="select-none">
          <el-icon :size="18" class="vertical-text-bottom m-r-8px">
            <Icon :icon="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
.el-tabs:deep(.el-tabs__content) {
  display: none;
}

.el-tabs:deep(.el-tabs__header .el-tabs__nav-next),
.el-tabs:deep(.el-tabs__header .el-tabs__nav-prev) {
  line-height: 32px;
  transition: opacity 300ms;
}

.el-tabs:deep(.el-tabs__header .el-tabs__nav-next).is-disabled,
.el-tabs:deep(.el-tabs__header .el-tabs__nav-prev).is-disabled {
  opacity: 0;
}

.el-tabs:deep(.el-tabs__header .el-tabs__nav-next) {
  border-left: 1px solid var(--el-border-color);
}

.el-tabs:deep(.el-tabs__header .el-tabs__nav-prev) {
  border-right: 1px solid var(--el-border-color);
}

.el-tabs:deep(.el-tabs__header .el-tabs__item:first-child) .el-icon.is-icon-close {
  display: none;
}

.el-tabs:deep(.el-tabs__header .el-tabs__item) {
  min-width: 148px;
  justify-content: space-between;
  padding: 0 12px !important;
  border-right: 1px solid var(--el-border-color);
  font-weight: inherit;
}

.el-tabs:deep(.el-tabs__header .el-tabs__item):not(.is-active.is-disabled) {
  position: relative;
}

.el-tabs:deep(.el-tabs__header .el-tabs__item):not(.is-active.is-disabled):hover:after {
  content: '';
  position: absolute;
  inset: 3px;
  z-index: -1;
  background-color: #0000000c;
}
</style>
