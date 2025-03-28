<script setup lang="ts">

import { ArrowDown, Clock, Lock, User } from '@element-plus/icons-vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const userMenuItems = [
  { icon: User, label: '个人中心' },
  { icon: Lock, label: '密码管理' },
  { icon: Clock, label: '操作记录' },
  { divider: true },
  { icon: Icon, props: { icon: 'mdi:logout' }, label: '退出登录' },
]

const isVisible = ref<boolean>(false);

const openDialog = () => {
  isVisible.value = true;
}

defineExpose({ openDialog })

</script>

<template>
  <el-popover
    placement="top-start"
    :width="206"
    :show-arrow="false"
    trigger="click"
    v-model:visible="isVisible"
    popper-class="pa-0! overflow-hidden"
  >
    <template #reference>
      <el-button
        text
        size="large"
        class="px-12px! h-100%!"
      >
        <el-avatar />
        <div class="text-align-left px-12px lh-18px w-128px">
          <div>Administrator</div>
          <div class="font-size-.9em">超级管理员</div>
        </div>
        <el-icon class="transition-transform" :class="{ 'rotate-180': isVisible }"><ArrowDown /></el-icon>
      </el-button>
    </template>
    <div class="flex flex-col items-center">
      <div class="bg-gray w-100% h-80px" />
      <el-avatar size="large" style="margin-top: calc(-1 * var(--el-avatar-size) / 2)" />
      <h3>Administrator</h3>
      <div>
        <el-tag type="primary">超级管理员</el-tag>
      </div>
      <el-divider class="mb-0! mt-10px!" />
      <el-menu
        class="w-100%"
        style="--el-menu-item-height: 36px; --el-menu-border-color: transparent;"
      >
        <template v-for="(item, i) in userMenuItems">
          <el-divider v-if="item.divider" :key="`el-divider-${i}`" />
          <el-menu-item v-else :key="`el-menu-item-${i}`">
            <el-icon><Component :is="item.icon" v-bind="item.props || {}" /></el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </el-popover>
</template>

<style scoped>

.navbar button + button {
  margin-left: unset;
}

</style>
