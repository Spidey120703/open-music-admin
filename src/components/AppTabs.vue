<script setup lang="ts">
import { ref } from 'vue'
import type { TabPaneName } from 'element-plus'

let tabIndex = 2
const editableTabsValue = ref('2')
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  },
])

const addTab = (targetName: string) => {
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title: 'New Tab',
    name: newTabName,
    content: 'New Tab content',
  })
  editableTabsValue.value = newTabName
}

for (let i = 0; i < 20; i++) {
  addTab(`${i}`)
}

const removeTab = (targetName: TabPaneName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>

<template>
  <el-tabs
    v-model="editableTabsValue"
    type="border-card"
    class="important-border-width-0"
    closable
    @tab-remove="removeTab"
    style="--el-tabs-header-height: 32px"
  >
    <el-tab-pane label="主页" name="main-page"></el-tab-pane>
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
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
  padding: 0 12px;
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
