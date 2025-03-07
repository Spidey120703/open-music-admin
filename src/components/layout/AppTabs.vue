<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TabPaneName } from 'element-plus'
import { Icon } from '@iconify/vue'

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

const validPaths = new Set([
  '/admin/index',
  '/admin/dashboard',
  '/admin/perm/user',
  '/admin/perm/role',
  '/admin/perm/log',
  '/admin/sys/menu',
  '/admin/sys/home',
  '/admin/user/info',
  '/admin/user/password',
  '/admin/user/device',
  '/admin/music/song',
  '/admin/music/artist',
  '/admin/music/album',
  '/admin/post/article',
  '/admin/post/comment',
  '/admin/cloud/file',
])

// 路由变化监听
watch(
  () => route.fullPath,
  (newPath) => {
    if (!validPaths.has(route.path)) {
      pageTabsValue.value = '/empty'
      return
    }

    const existingTab = pageTabs.value.find((tab) => tab.path === route.path)

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
    class="important-border-width-0"
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
