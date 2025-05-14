<script setup lang="ts">

import { ArrowDown, Lock, User } from '@element-plus/icons-vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { useUserInfoStore } from '@/stores/user-info.ts'
import { useMessage } from '@/composables/message.ts'
import { useAuthorizationStore } from '@/stores/authorization.ts'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const router = useRouter()

const handleLogout = () => {
  ElMessageBox.confirm(
    '确定注销并退出系统吗？',
    '提示',
    {
      type: 'warning',
    }
  )
    .then(() => {
      useMessage().success('已退出登录')
      useAuthorizationStore().deleteToken()
      router.push('/login')
    })
    .catch(() => {})
}

const userMenuItems = [
  { icon: User, label: '个人中心', index: '/admin/account/info' },
  { icon: Lock, label: '密码管理', index: '/admin/account/password' },
  // { icon: Clock, label: '操作记录' },
  { divider: true },
  { icon: Icon, props: { icon: 'mdi:logout' }, label: '退出登录', onClick: handleLogout },
]

const isVisible = ref<boolean>(false);

const openDialog = () => {
  isVisible.value = true;
}

const state = useUserInfoStore()
const { userInfo } = storeToRefs(state)

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
        <el-avatar
          :src="userInfo?.avatar"
        />
        <div class="text-align-left px-12px lh-18px w-128px">
          <div>{{ userInfo?.nickname }}</div>
          <div class="font-size-.9em">{{ userInfo?.role?.label ?? '用户' }}</div>
        </div>
        <el-icon class="transition-transform" :class="{ 'rotate-180': isVisible }"><ArrowDown /></el-icon>
      </el-button>
    </template>
    <div class="flex flex-col items-center">
      <div
        class="bg-gray w-100% h-80px"
        :style="{
          backgroundImage: `url(/src/assets/imgs/background.jpg)`
        }"
        style="
          background-size: cover;
          background-position: center;
        "
      />
      <el-avatar
        :src="userInfo?.avatar"
        size="large"
        style="margin-top: calc(-1 * var(--el-avatar-size) / 2)"
      />
      <h3>{{ userInfo?.nickname }}</h3>
      <div>
        <el-tag :type="userInfo?.role?.type ?? 'info'">{{ userInfo?.role?.label ?? '用户' }}</el-tag>
      </div>
      <el-divider class="mb-0! mt-10px!" />
      <el-menu
        router
        class="w-100%"
        style="
          --el-menu-item-height: 36px;
          --el-menu-border-color: transparent;
          --el-menu-active-color: var(--el-menu-text-color);
        "
      >
        <template v-for="(item, i) in userMenuItems">
          <el-divider v-if="item.divider" :key="`el-divider-${i}`" />
          <el-menu-item
            v-else
            :key="`el-menu-item-${i}`"
            :index="item.index"
            @click="item.onClick?.()"
          >
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
